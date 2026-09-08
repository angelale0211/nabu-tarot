/* What a subscription opens, decided from Google's word alone, and written
   onto the account by the only party allowed to write it. */
import { PlayEnv, SubInfo } from "./play";
import { PlayItem, PLAY_MANAGED_KEYS } from "./catalog";
import { fsGet, fsPatch } from "./fs";

const GRANTING = new Set(["SUBSCRIPTION_STATE_ACTIVE", "SUBSCRIPTION_STATE_CANCELED", "SUBSCRIPTION_STATE_IN_GRACE_PERIOD"]);
const isoDay = (ms: number) => new Date(ms).toISOString().slice(0, 10);

/* Cancelled means "will not renew", and the buyer keeps what they paid for
   until it runs out. Grace means Google is retrying the card and says keep
   serving. Hold and pause mean stop. Expired means gone. */
export function subAccess(s: SubInfo, nowMs: number = Date.now()): { grant: boolean; until: string } {
  const until = s.expiryMs ? isoDay(s.expiryMs) : "";
  return { grant: GRANTING.has(s.state) && s.expiryMs > nowMs, until };
}

export interface SubRow { sku: string; plan: string; state: string; until: string; autoRenew: boolean; tok: string; opens: string[]; grant: boolean }

/* Play-managed keys are derived, never edited: throw them away and rebuild
   them from every row that grants. A course key is not Play-managed and is
   carried through untouched. Order of events cannot matter to a function
   that only looks at the current rows. */
export function recompute(subs: Record<string, SubRow>, access: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.keys(access)) if (!PLAY_MANAGED_KEYS.has(k) && k in access) out[k] = access[k];
  for (const row of Object.values(subs)) {
    if (!row || !row.grant) continue;
    for (const k of row.opens || []) if (!out[k] || row.until > out[k]) out[k] = row.until;
  }
  return out;
}

export async function applySubscription(env: PlayEnv, uid: string, item: PlayItem, sub: SubInfo, tokenHash: string): Promise<{ access: Record<string, string>; subs: Record<string, SubRow> }> {
  const doc = (await fsGet(env, "users/" + encodeURIComponent(uid))) || {};
  const access = (doc.access as Record<string, string>) || {};
  const subs = { ...((doc.subs as Record<string, SubRow>) || {}) };
  const a = subAccess(sub);
  subs[item.key] = { sku: item.sku, plan: sub.basePlanId, state: sub.state, until: a.until, autoRenew: sub.autoRenew, tok: tokenHash, opens: item.opens, grant: a.grant };
  const next = recompute(subs, access);
  const w = await fsPatch(env, "users/" + encodeURIComponent(uid), { access: next, subs }, ["access", "subs"]);
  if (!w.ok) throw new Error("firestore " + w.status);
  return { access: next, subs };
}

/* ---- the wedding: one purchase pays one room ---- */
export async function payRoom(env: PlayEnv, uid: string, wid: string, tokenHash: string): Promise<{ ok: boolean; why?: string }> {
  const room = await fsGet(env, "weddings/" + encodeURIComponent(wid));
  if (!room) return { ok: false, why: "no room" };
  const uids = (room.uids as string[]) || [];
  if (uids.indexOf(uid) < 0) return { ok: false, why: "not yours" };
  if (room.paid === true && room.purchase && room.purchase !== tokenHash) return { ok: false, why: "room paid" };
  const w = await fsPatch(env, "weddings/" + encodeURIComponent(wid),
    { paid: true, paidAt: Date.now(), paidBy: uid, purchase: tokenHash }, ["paid", "paidAt", "paidBy", "purchase"]);
  if (!w.ok) throw new Error("firestore " + w.status);
  return { ok: true };
}
/* A refunded wedding: the room stays, the payment does not. The couple see
   "unpaid" again and the door does not open. */
export async function unpayRoom(env: PlayEnv, wid: string): Promise<void> {
  const w = await fsPatch(env, "weddings/" + encodeURIComponent(wid), { paid: false, purchase: "" }, ["paid", "purchase"]);
  if (!w.ok) throw new Error("firestore " + w.status);
}
