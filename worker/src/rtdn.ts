/* Google telling us something changed.

   Play publishes a Real-time Developer Notification to a Pub/Sub topic and
   Pub/Sub pushes it here. The notification names a purchase token and a
   type. The type is not trusted for anything: whatever it says, the worker
   asks Google for the current state of that token and applies that. So a
   duplicate, a late arrival or two out of order all land on the same answer.

   Always 204 once the caller is Google. Anything else and Pub/Sub retries
   for a week. */
import { PlayEnv, checkSubscription } from "./play";
import { verifyGoogleJwt } from "./auth";
import { itemBySku } from "./catalog";
import { applySubscription, unpayRoom } from "./entitle";
import { ledgerGet, ledgerSet, tokenId, removeAccessFor } from "./refunds";

export interface RtdnEnv extends PlayEnv { RTDN_AUDIENCE?: string; RTDN_PUSH_EMAIL?: string }
export interface Note {
  packageName?: string; eventTimeMillis?: string;
  subscriptionNotification?: { notificationType?: number; purchaseToken?: string; subscriptionId?: string };
  oneTimeProductNotification?: { notificationType?: number; purchaseToken?: string; sku?: string };
  voidedPurchaseNotification?: { purchaseToken?: string; orderId?: string; productType?: number; refundType?: number };
  testNotification?: { version?: string };
}
export function decodeNote(body: unknown): Note | null {
  try {
    const data = (body as { message?: { data?: string } }).message?.data;
    if (!data) return null;
    return JSON.parse(atob(data.replace(/-/g, "+").replace(/_/g, "/"))) as Note;
  } catch { return null; }
}

export async function handleRtdn(request: Request, env: RtdnEnv): Promise<Response> {
  if (!env.RTDN_AUDIENCE) return new Response("not configured", { status: 404 });
  const raw = (request.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "").trim();
  if (!(await verifyGoogleJwt(raw, env.RTDN_AUDIENCE, env.RTDN_PUSH_EMAIL))) return new Response("who?", { status: 401 });
  let body: unknown;
  try { body = await request.json(); } catch { return new Response(null, { status: 204 }); }
  const note = decodeNote(body);
  const pkg = env.ANDROID_PACKAGE || "app.nabutarot.twa";
  if (!note || note.packageName !== pkg || note.testNotification) { console.log(JSON.stringify({ at: "rtdn", ignored: !note ? "undecodable" : note.testNotification ? "test" : "other package" })); return new Response(null, { status: 204 }); }
  try {
    if (note.subscriptionNotification?.purchaseToken) await onSubscription(env, note.subscriptionNotification.purchaseToken, note.subscriptionNotification.notificationType || 0);
    else if (note.voidedPurchaseNotification?.purchaseToken) await onVoided(env, note.voidedPurchaseNotification.purchaseToken);
    else if (note.oneTimeProductNotification?.purchaseToken && note.oneTimeProductNotification.notificationType === 2) await onVoided(env, note.oneTimeProductNotification.purchaseToken);
  } catch (e) { console.error(JSON.stringify({ at: "rtdn", error: String((e as Error).message || e) })); }
  return new Response(null, { status: 204 });
}

async function onSubscription(env: RtdnEnv, token: string, type: number): Promise<void> {
  const hash = await tokenId(token);
  const row = await ledgerGet(env, hash);
  if (!row) { console.log(JSON.stringify({ at: "rtdn", type, orphan: hash.slice(0, 12) })); return; }   // bought before /billing ever saw it; the app's next sync will claim it
  const item = itemBySku(row.sku);
  if (!item || item.kind !== "subs") return;
  const got = await checkSubscription(env, token);
  if (!got.ok || !got.sub) { console.log(JSON.stringify({ at: "rtdn", type, why: got.why })); return; }
  await applySubscription(env, row.uid, item, got.sub, hash);
  await ledgerSet(env, hash, { state: got.sub.state, plan: got.sub.basePlanId });
  console.log(JSON.stringify({ at: "rtdn", type, uid: row.uid, key: item.key, state: got.sub.state }));
}

async function onVoided(env: RtdnEnv, token: string): Promise<void> {
  const hash = await tokenId(token);
  const row = await ledgerGet(env, hash);
  if (!row || row.state === "voided") return;
  if (row.wid) await unpayRoom(env, row.wid);
  else if (row.kind === "inapp" && row.ids.length) await removeAccessFor(env, row.uid, row.ids);
  await ledgerSet(env, hash, { state: "voided", voidedAt: new Date().toISOString() });
  console.log(JSON.stringify({ at: "rtdn", voided: row.uid, ids: row.ids, wid: row.wid || "" }));
}
