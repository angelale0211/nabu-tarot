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

   That left one hole, and `granted` closes it. Where a Play row and a code
   named the SAME key, the row used to win outright: a customer who had paid
   by bank transfer for Pro to 2027-06 and later subscribed to Play Pro to
   2026-12 was silently cut back to Play's date and lost six months they had
   paid for. Keeping simply the later of the two would be worse - Google could
   then never SHORTEN its own grant, and a refund or a revocation would never
   take anything back.

   So the two sources are kept in separate boxes and combined here. `access`
   is the answer, not an input to itself; `granted` holds what the website and
   the dashboard gave, per key, and Play's rows hold what Play gave. The
   effective date for a Play-managed key is the later of the two. Play may
   shorten its own contribution to nothing - a refund drops every row's grant
   - and the customer is left with exactly what `granted` says, which is
   nothing at all if they never had a code. Keys no subscription manages
   (`tarot`, `lenormand`, `playing`, `wedding`) are untouched by any of it. */
export function namedByRows(subs: Record<string, SubRow>): Set<string> {
  const named = new Set<string>();
  for (const row of Object.values(subs)) {
    if (!row) continue;
    for (const k of row.opens || []) if (PLAY_MANAGED_KEYS.has(k)) named.add(k);
  }
  return named;
}

export function recompute(subs: Record<string, SubRow>, access: Record<string, string>, granted: Record<string, string> = {}): Record<string, string> {
  const out: Record<string, string> = {};
  const named = namedByRows(subs);
  for (const k of Object.keys(access)) if (!named.has(k)) out[k] = access[k];
  for (const row of Object.values(subs)) {
    if (!row || !row.grant) continue;
    for (const k of row.opens || []) if (!out[k] || row.until > out[k]) out[k] = row.until;
  }
  /* What the website and the dashboard gave, folded in last. Only ever for a
     key subscriptions manage: a course key is already carried through above,
     and `granted` has no business inventing one. Later date wins, so a Play
     row that runs longer than the code keeps its own date and a code that
     runs longer than Play keeps its. */
  for (const k of Object.keys(granted)) {
    if (!PLAY_MANAGED_KEYS.has(k)) continue;
    const g = granted[k];
    if (!g) continue;
    if (!out[k] || g > out[k]) out[k] = g;
  }
  return out;
}

/* ---- catching what is already there, without a migration ----

   `granted` is new, and every customer who redeemed a code before it existed
   has their bank-transfer access sitting in `access` alone, with nothing to
   say where it came from. Rather than a one-off script over the whole user
   collection - which would have to guess, because `access` records no
   provenance - the value is captured at the one moment it can still be read
   truthfully: just before Play takes the key over.

   For each key the NEW row names, if NO EXISTING row names it, then whatever
   `access` holds for that key cannot have come from Play - no subscription
   row has ever claimed it - so it is a code or an admin grant, and it is
   folded into `granted` before the new row is written.

   Both halves of the ordering matter.

   It is checked against the rows as they are BEFORE this write. Check after,
   and the row being written names the key itself, so the capture never fires
   and the value it exists to rescue is thrown away by the recompute in the
   next line.

   And it must NOT fire when a row already named the key. `access[key]` would
   then be Play's own previous grant, and copying it into `granted` would make
   it permanent: the very next event that legitimately SHORTENS the
   subscription - a refund, a revocation, a downgrade, an expiry - would find
   the old, longer date sitting in `granted` and hand back the access Google
   had just taken away. That is the opposite failure and just as expensive, so
   the guard is a hard one: a key any current row names is Play's, and is
   never captured. */
function capture(subs: Record<string, SubRow>, access: Record<string, string>, granted: Record<string, string>, opens: string[]): void {
  const already = namedByRows(subs);
  for (const k of opens) {
    if (!PLAY_MANAGED_KEYS.has(k)) continue;   // a course key is never rebuilt, so it needs no rescuing
    if (already.has(k)) continue;              // Play holds this key already: whatever access says is Play's own
    const held = access[k];
    if (!held) continue;
    if (!granted[k] || held > granted[k]) granted[k] = held;
  }
}

export async function applySubscription(env: PlayEnv, uid: string, item: PlayItem, sub: SubInfo, tokenHash: string): Promise<{ access: Record<string, string>; subs: Record<string, SubRow>; granted: Record<string, string> }> {
  const doc = (await fsGet(env, "users/" + encodeURIComponent(uid))) || {};
  const access = (doc.access as Record<string, string>) || {};
  const subs = { ...((doc.subs as Record<string, SubRow>) || {}) };
  const granted = { ...((doc.granted as Record<string, string>) || {}) };
  /* Before the new row, never after. */
  capture(subs, access, granted, item.opens);
  const a = subAccess(sub);
  subs[item.key] = { sku: item.sku, plan: sub.basePlanId, state: sub.state, until: a.until, autoRenew: sub.autoRenew, tok: tokenHash, opens: item.opens, grant: a.grant };
  const next = recompute(subs, access, granted);
  const w = await fsPatch(env, "users/" + encodeURIComponent(uid), { access: next, subs, granted }, ["access", "subs", "granted"]);
  if (!w.ok) throw new Error("firestore " + w.status);
  return { access: next, subs, granted };
}

/* ---- writing down a grant that did not come from Play ----

   Called by /redeem, so a code that opens a Play-managed key leaves a record
   of itself next to the access it wrote. Without it the customer is safe only
   until their first subscription event: `access` alone cannot be told apart
   from a Play grant once a row names the key, and the recompute would cut a
   two-year bank transfer back to a one-year subscription.

   Play-managed keys only. `tarot`, `lenormand`, `playing` and `wedding` are
   never rebuilt from the subscription rows, so nothing can take them away and
   nothing needs to be written here. Later date wins, exactly as grantUntil
   does for `access`, so redeeming a shorter code after a longer one cannot
   shorten what was already bought. */
export async function noteGranted(env: PlayEnv, uid: string, want: Record<string, string>): Promise<Record<string, string>> {
  const keys = Object.keys(want).filter((k) => PLAY_MANAGED_KEYS.has(k) && want[k]);
  if (!keys.length) return {};
  const doc = (await fsGet(env, "users/" + encodeURIComponent(uid))) || {};
  const granted = { ...((doc.granted as Record<string, string>) || {}) };
  let moved = false;
  for (const k of keys) if (!granted[k] || want[k] > granted[k]) { granted[k] = want[k]; moved = true; }
  if (!moved) return granted;
  const w = await fsPatch(env, "users/" + encodeURIComponent(uid), { granted }, ["granted"]);
  if (!w.ok) throw new Error("firestore " + w.status);
  return granted;
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
