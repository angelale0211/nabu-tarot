/* The fallback for a missed notification: every few hours, every subscription
   this worker has ever seen and not yet written off is asked about again.

   Google's answer is the only truth taken here - the stored ledger row is
   never trusted for state, only for which token to ask Google about. A
   transient Google failure (a 5xx, a timeout) must never be read as "this
   subscription is gone": applySubscription is only ever called with a fresh,
   successful answer from checkSubscription, so a bad row is counted as
   failed and skipped, and one bad row never stops the rest of the run.

   This is also the repair for a known gap in applySubscription: it does a
   read-modify-write of users/{uid} with no compare-and-set, so two events for
   the same user touching different subscription keys can lose one of them.
   Because this job re-applies every live row on its own schedule, a row lost
   that way comes back on the next pass - it is re-fetched from Google and
   written back into users/{uid}.subs regardless of what is there now. */
import { PlayEnv, checkSubscription, serviceToken, FS_SCOPE } from "./play";
import { itemBySku } from "./catalog";
import { applySubscription } from "./entitle";
import { decode } from "./fs";
import { ledgerSet, LedgerRow } from "./refunds";

export async function reconcileSubs(env: PlayEnv): Promise<{ looked: number; changed: number; failed: number }> {
  const out = { looked: 0, changed: 0, failed: 0 };
  if (!env.PLAY_SERVICE_ACCOUNT || !env.FIREBASE_PROJECT_ID) return out;
  const at = await serviceToken(env, FS_SCOPE);
  const r = await fetch("https://firestore.googleapis.com/v1/projects/" + encodeURIComponent(env.FIREBASE_PROJECT_ID) + "/databases/(default)/documents:runQuery", {
    method: "POST", headers: { Authorization: "Bearer " + at, "Content-Type": "application/json" },
    body: JSON.stringify({ structuredQuery: { from: [{ collectionId: "purchases" }], where: { fieldFilter: { field: { fieldPath: "kind" }, op: "EQUAL", value: { stringValue: "subs" } } }, limit: 500 } }),
  });
  if (!r.ok) throw new Error("query " + r.status);
  const rows = (await r.json()) as { document?: { name: string; fields?: Record<string, Record<string, unknown>> } }[];
  for (const it of rows) {
    if (!it.document) continue;
    const row = decode(it.document as { fields?: Record<string, Record<string, unknown>> }) as unknown as LedgerRow & { token?: string };
    if (row.state === "SUBSCRIPTION_STATE_EXPIRED" || row.state === "voided" || !row.token) continue;
    const item = itemBySku(row.sku);
    if (!item) continue;
    out.looked++;
    try {
      const got = await checkSubscription(env, row.token);
      if (!got.ok || !got.sub) { out.failed++; continue; }
      const hash = it.document.name.split("/purchases/")[1];
      await applySubscription(env, row.uid, item, got.sub, hash);
      if (got.sub.state !== row.state) { await ledgerSet(env, hash, { state: got.sub.state }); out.changed++; }
    } catch { out.failed++; }
  }
  return out;
}
