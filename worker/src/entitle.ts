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

/* Play decides only the keys its own rows name.

   `manifest`, `plus` and `pro` are keys a subscription can open - but they
   are not keys ONLY a subscription can open. The same three are sold on the
   website and handed over as a redemption code, and an admin can grant them
   by hand. Rebuilding every Play-managed key from the subscription rows
   alone therefore deleted what the website had sold: a customer who paid by
   bank transfer for Nabu Pro and then subscribed to Manifestation in the app
   lost `pro` and `plus` the moment that subscription was applied, with
   nothing written down to say why and the six-hourly reconcile wiping any
   re-issued code again within the day.

   So the rule is narrower than "Play-managed": a key is thrown away and
   rebuilt only if some current subscription row NAMES it. A row that names a
   key still names it when it does not grant - that is how an expired or
   revoked subscription takes its access back. A key no row mentions is not
   Play's to decide and is carried through untouched, exactly like a course
   key. Order of events still cannot matter: this looks only at the rows and
   the account as they are now.

   What this deliberately does not do is merge a code grant with a Play row
   for the SAME key - a Play row that names the key wins outright, so a
   longer code-granted date for a key the buyer also holds on Play is still
   shortened to Play's. Keeping the later of the two instead would mean an
   expiry that moves earlier (a plan change, a revoked extension) could never
   shorten access, which is worse. Closing that last gap needs provenance
   written next to the grant, and a code redeemed before that field exists
   would have none - so it is not what this branch relies on. */
export function recompute(subs: Record<string, SubRow>, access: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  const named = new Set<string>();
  for (const row of Object.values(subs)) {
    if (!row) continue;
    for (const k of row.opens || []) if (PLAY_MANAGED_KEYS.has(k)) named.add(k);
  }
  for (const k of Object.keys(access)) if (!named.has(k)) out[k] = access[k];
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
   "unpaid" again and the door does not open.

   Read first, and only then write. A Firestore REST PATCH CREATES a document
   that is not there, and cancel-then-refund is an ordinary sequence: a couple
   who call the wedding off delete the room (cancelling spends the purchase by
   design), and the refund that follows arrives at a wid with nothing behind
   it. A blind PATCH conjured a ghost document holding `paid:false` and no
   `uids` - and wedding ids are deterministic (`uidA__uidB`), so
   firestore.rules, which gates update and delete on being one of
   `resource.data.uids`, locked that couple out of their own id forever:
   create no longer applied, update and delete were refused. Nothing to
   un-pay is therefore nothing to write.

   And only the purchase that paid for this room may un-pay it. Without that
   check a refund could take back a room paid for a second time by a
   different token, or a room Nabu was paid for by bank transfer and marked
   paid by hand - neither of which was refunded. */
export async function unpayRoom(env: PlayEnv, wid: string, tokenHash: string): Promise<boolean> {
  const room = await fsGet(env, "weddings/" + encodeURIComponent(wid));
  if (!room) return false;
  if (!tokenHash || room.purchase !== tokenHash) return false;
  /* exists=true as well as the read: between the two the couple may have
     deleted the room, and re-creating it here is the very thing this guards
     against. A 404 back from that precondition is "already gone", not a
     failure to report. */
  const w = await fsPatch(env, "weddings/" + encodeURIComponent(wid), { paid: false, purchase: "" }, ["paid", "purchase"], { exists: true });
  if (w.status === 404) return false;
  if (!w.ok) throw new Error("firestore " + w.status);
  return true;
}
