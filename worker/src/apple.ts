/* Checking a purchase made in the iPhone app.

   The same rule as play.ts: the phone is not a witness. The iPhone app hands
   over the transaction id StoreKit gave it, and everything after that is asked
   of Apple directly, through the App Store Server API, with a key only this
   worker holds - is this transaction real, for this app, for this product, for
   this Nabu account, and has it been refunded.

   What Apple answers is then written through exactly the machinery Play
   already uses: the token-keyed ledger (claimPurchase), the subscription rows
   and their recompute (applySubscription), a course's date (grantUntil), a
   wedding room (payRoom). An App Store purchase is filed in the ledger under
   "apple:" + its id, so it can never collide with a Play token and every
   reader can tell the two apart.

   Talking to Apple needs a JWT signed with the In-App Purchase key (.p8, an
   EC P-256 key) - ES256 over WebCrypto, no library. */
import { b64url, utf8, pemToBytes } from "./play";
import type { PlayEnv, SubInfo } from "./play";
import { itemBySku } from "./catalog";
import { applySubscription, dropSubscriptionFrom, payRoom, unpayRoom } from "./entitle";
import { claimPurchase, ledgerGet, ledgerSet, markGranted, movePurchase, tokenId, removeAccessFor, LedgerRow } from "./refunds";
import { decode } from "./fs";
import { serviceToken, FS_SCOPE, grantUntil } from "./play";

export interface AppleEnv extends PlayEnv {
  APPLE_BUNDLE_ID?: string;    // app.nabutarot.ios
  APPLE_TEAM_ID?: string;         // the developer team, for Sign in with Apple
  APPLE_SIWA_KEY_ID?: string;     // a Sign in with Apple key (a different key from the In-App Purchase one)
  APPLE_SIWA_PRIVATE_KEY?: string; // that key's .p8, as a secret
  APPLE_ISSUER_ID?: string;    // App Store Connect > Users and Access > Integrations > In-App Purchase
  APPLE_KEY_ID?: string;       // the id of that key
  APPLE_PRIVATE_KEY?: string;  // the .p8 file's contents, as a secret
}
export const appleConfigured = (env: AppleEnv): boolean =>
  !!(env.APPLE_ISSUER_ID && env.APPLE_KEY_ID && env.APPLE_PRIVATE_KEY && env.FIREBASE_PROJECT_ID);
const bundleOf = (env: AppleEnv) => env.APPLE_BUNDLE_ID || "app.nabutarot.ios";

/* Production first, sandbox second. TestFlight, Xcode sandbox testers AND
   Apple's own reviewers all buy in the sandbox, so a build under review would
   fail every purchase if only production were asked. Apple's own advice is
   exactly this order: a transaction production does not know (404) is asked of
   the sandbox.

   401 moves on to the sandbox as well. Before an app has ever been on the
   store, the production server refuses the key outright - 401, not 404 - for
   every request, a test notification included. Falling through only on 404
   meant the first TestFlight purchase answered "apple 401" and nothing was
   ever unlocked, which is exactly what the owner saw. A key that is genuinely
   wrong gets 401 from both hosts and still ends as "apple 401". */
const HOSTS = ["https://api.storekit.itunes.apple.com", "https://api.storekit-sandbox.itunes.apple.com"];

/* What the ledger files an App Store purchase under. */
export const appleToken = (id: string): string => "apple:" + id;
export const isAppleToken = (token: string | undefined): boolean => !!token && token.indexOf("apple:") === 0;

/* ---- the account a purchase belongs to ----

   StoreKit carries an appAccountToken, a UUID the app chooses at the moment
   of buying and Apple keeps on the transaction and on every renewal. It is
   derived from the Firebase uid, one-way, so Apple never learns the uid and a
   purchase can still be tied to the account that made it: a transaction
   bought by one Nabu account and sent in by another is refused here before
   the ledger is even asked. The phone computes the same UUID (billing-apple.js)
   and a check on each side keeps the two in step. */
export async function accountToken(uid: string): Promise<string> {
  const h = new Uint8Array(await crypto.subtle.digest("SHA-256", utf8("nabu-tarot:" + uid))).slice(0, 16);
  h[6] = (h[6] & 0x0f) | 0x50;   // version 5 layout
  h[8] = (h[8] & 0x3f) | 0x80;   // RFC 4122 variant
  const x = [...h].map((b) => b.toString(16).padStart(2, "0")).join("");
  return x.slice(0, 8) + "-" + x.slice(8, 12) + "-" + x.slice(12, 16) + "-" + x.slice(16, 20) + "-" + x.slice(20);
}

/* ---- the key ----
   A token may live an hour; one is kept for half of that. */
let jwtCache: { at: number; token: string; kid: string } | null = null;
export async function appleJwt(env: AppleEnv): Promise<string> {
  const now = Date.now();
  if (jwtCache && jwtCache.kid === env.APPLE_KEY_ID && now - jwtCache.at < 30 * 60000) return jwtCache.token;
  const iat = Math.floor(now / 1000);
  const header = b64url(utf8(JSON.stringify({ alg: "ES256", kid: env.APPLE_KEY_ID, typ: "JWT" })));
  const claim = b64url(utf8(JSON.stringify({ iss: env.APPLE_ISSUER_ID, iat, exp: iat + 3600, aud: "appstoreconnect-v1", bid: bundleOf(env) })));
  const key = await crypto.subtle.importKey("pkcs8", pemToBytes(env.APPLE_PRIVATE_KEY || ""), { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  /* WebCrypto signs ECDSA as r||s, which is already the form JWS wants - no DER to unwrap. */
  const sig = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, utf8(header + "." + claim));
  const token = header + "." + claim + "." + b64url(sig);
  jwtCache = { at: now, token, kid: env.APPLE_KEY_ID || "" };
  return token;
}

/* ---- reading what Apple says ----

   Apple signs its answers as JWS. They are read, not verified, and that is a
   choice rather than a shortcut: every JWS read here arrived in answer to a
   request this worker made to Apple's own host over TLS, with this worker's
   key. A notification pushed to /asn is different - anybody can post one -
   so a notification is only ever a nudge: its ids are looked up again through
   the API before anything is written, exactly as /rtdn re-asks Google. */
export function jwsPayload<T>(jws: unknown): T | null {
  try {
    const part = String(jws || "").split(".")[1];
    if (!part) return null;
    const bin = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return JSON.parse(new TextDecoder().decode(bytes)) as T;
  } catch { return null; }
}

export interface AppleTx {
  transactionId: string; originalTransactionId: string; bundleId: string; productId: string;
  purchaseDate: number; expiresDate?: number; revocationDate?: number;
  appAccountToken?: string; type?: string; environment?: string;
}
export interface AppleCheck { ok: boolean; why?: string; tx?: AppleTx }

async function ask(env: AppleEnv, path: string): Promise<{ status: number; body: Record<string, unknown> }> {
  const jwt = await appleJwt(env);
  let last = { status: 404, body: {} as Record<string, unknown> };
  for (const host of HOSTS) {
    const r = await fetch(host + path, { headers: { Authorization: "Bearer " + jwt } });
    let body: Record<string, unknown> = {};
    try { body = (await r.json()) as Record<string, unknown>; } catch { /* an empty or broken body */ }
    last = { status: r.status, body };
    if (r.status !== 404 && r.status !== 401) return last;
  }
  return last;
}

/* Ids are digits. Anything else never reaches Apple. */
const validId = (id: string) => /^\d{1,30}$/.test(id);

export async function checkAppleTransaction(env: AppleEnv, transactionId: string): Promise<AppleCheck> {
  if (!validId(transactionId)) return { ok: false, why: "unknown purchase" };
  const r = await ask(env, "/inApps/v1/transactions/" + transactionId);
  if (r.status === 404) return { ok: false, why: "unknown purchase" };
  /* Apple's outage is not the buyer's fault: said as "apple <status>" so the
     caller answers 502 and the phone tries again, never as a refusal. */
  if (r.status < 200 || r.status >= 300) return { ok: false, why: "apple " + r.status };
  const tx = jwsPayload<AppleTx>(r.body.signedTransactionInfo);
  if (!tx || !tx.transactionId) return { ok: false, why: "apple 502" };
  tx.transactionId = String(tx.transactionId); tx.originalTransactionId = String(tx.originalTransactionId || tx.transactionId);
  if (tx.bundleId !== bundleOf(env)) return { ok: false, why: "wrong app" };
  return { ok: true, tx };
}

/* ---- a subscription's state, said in Play's words ----

   The rest of the system - the recompute in entitle.ts, the store's own
   sentences in store.js - already understands Google's states, so Apple's are
   translated into them rather than taught to everything else:

     1 active, renewing        SUBSCRIPTION_STATE_ACTIVE
     1 active, turned off      SUBSCRIPTION_STATE_CANCELED   (kept to the end of the period)
     4 billing grace period    SUBSCRIPTION_STATE_IN_GRACE_PERIOD, to the end of the grace
     3 billing retry           SUBSCRIPTION_STATE_ON_HOLD     (Apple stopped serving; so do we)
     2 expired, 5 revoked      SUBSCRIPTION_STATE_EXPIRED */
interface RenewalInfo { autoRenewStatus?: number; gracePeriodExpiresDate?: number; autoRenewProductId?: string }
export interface AppleSubCheck { ok: boolean; why?: string; sub?: SubInfo; tx?: AppleTx }

export function appleState(status: number, autoRenew: boolean): string {
  if (status === 1) return autoRenew ? "SUBSCRIPTION_STATE_ACTIVE" : "SUBSCRIPTION_STATE_CANCELED";
  if (status === 4) return "SUBSCRIPTION_STATE_IN_GRACE_PERIOD";
  if (status === 3) return "SUBSCRIPTION_STATE_ON_HOLD";
  return "SUBSCRIPTION_STATE_EXPIRED";
}

export async function checkAppleSubscription(env: AppleEnv, transactionId: string): Promise<AppleSubCheck> {
  const first = await checkAppleTransaction(env, transactionId);
  if (!first.ok || !first.tx) return { ok: false, why: first.why };
  const r = await ask(env, "/inApps/v1/subscriptions/" + transactionId);
  if (r.status === 404) return { ok: false, why: "unknown purchase" };
  if (r.status < 200 || r.status >= 300) return { ok: false, why: "apple " + r.status };
  const groups = (r.body.data as { lastTransactions?: { originalTransactionId?: string | number; status?: number; signedTransactionInfo?: string; signedRenewalInfo?: string }[] }[]) || [];
  const orig = first.tx.originalTransactionId;
  /* The answer covers every subscription group this customer holds - Plus/Pro
     and Manifestation are separate groups - so the one for THIS purchase is
     picked out by its original transaction, never by position. */
  const hit = groups.flatMap((g) => g.lastTransactions || []).find((t) => String(t.originalTransactionId) === orig);
  if (!hit) return { ok: false, why: "unknown purchase" };
  const last = jwsPayload<AppleTx>(hit.signedTransactionInfo);
  const renewal = jwsPayload<RenewalInfo>(hit.signedRenewalInfo) || {};
  if (!last) return { ok: false, why: "apple 502" };
  const autoRenew = renewal.autoRenewStatus === 1;
  const status = last.revocationDate ? 5 : Number(hit.status || 0);
  const expiry = Math.max(Number(last.expiresDate || 0), status === 4 ? Number(renewal.gracePeriodExpiresDate || 0) : 0);
  return {
    ok: true,
    tx: { ...last, transactionId: String(last.transactionId), originalTransactionId: orig },
    sub: { state: appleState(status, autoRenew), expiryMs: expiry, productId: last.productId, basePlanId: last.productId, autoRenew, acknowledged: true, linkedToken: "" },
  };
}

/* ---- /billing, for a purchase made in the iPhone app ---- */
export interface Answer { status: number; body: Record<string, unknown> }

export async function appleBill(env: AppleEnv, uid: string, b: { sku?: string; token?: string; wid?: string }): Promise<Answer> {
  if (!appleConfigured(env)) return { status: 500, body: { error: "not configured" } };
  const id = String(b.token || ""), wid = String(b.wid || "");
  const want = itemBySku(String(b.sku || ""));
  if (!want || !validId(id)) return { status: 400, body: { error: "unknown product" } };
  if (want.key === "wedding" && !wid) return { status: 400, body: { error: "no room" } };
  const log = (rec: Record<string, unknown>) => console.log(JSON.stringify({ at: "billing", store: "apple", uid, sku: want.sku, ...rec }));
  const refuse = (why?: string): Answer => {
    if (why && why.indexOf("apple ") === 0) { log({ transient: why }); return { status: 502, body: { error: why } }; }
    log({ refused: why }); return { status: 402, body: { error: why || "refused" } };
  };

  const got = await checkAppleTransaction(env, id);
  if (!got.ok || !got.tx) return refuse(got.why);
  const tx = got.tx;
  /* Apple wrote down which Nabu account started this purchase. A purchase
     naming somebody else is only allowed through when the ledger has a row
     for it and can therefore move it - the account that held it loses it in
     the same step (movePurchase). A purchase naming somebody else that
     nothing has ever claimed has no owner to take it from and no buyer to put
     right, so it stays refused, the way the ledger says it. */
  const foreign = !!(tx.appAccountToken && tx.appAccountToken.toLowerCase() !== await accountToken(uid));
  if (tx.revocationDate) return refuse("refunded");

  /* ---- a subscription: Apple's current state is the state ---- */
  if (want.kind === "subs") {
    const have = itemBySku(tx.productId);
    if (!have || have.kind !== "subs") return refuse("product mismatch");
    const s = await checkAppleSubscription(env, id);
    if (!s.ok || !s.sub || !s.tx) return refuse(s.why);
    /* The product Apple says is current decides, not the one the phone named:
       after an upgrade the same purchase is Pro, whatever the button said. */
    const item = itemBySku(s.sub.productId);
    if (!item || item.kind !== "subs") return refuse("product mismatch");
    const token = appleToken(s.tx.originalTransactionId);
    const hash = await tokenId(token);
    /* Asked before the claim, never after: a claim that should not have been
       made cannot be taken back without leaving a row that refuses its own
       rightful owner later. */
    if (foreign && !(await ledgerGet(env, hash))) return refuse("already used");
    const claim = await claimPurchase(env, uid, item.sku, item.opens, token, { kind: "subs" });
    if (!claim.ok) {
      /* Held by another Nabu account. Apple has just said this subscription
         is the one this phone holds, so it follows its buyer: the account
         that held it stops holding it and this one takes it up. */
      const moved = await movePurchase(env, hash, uid, (row) => dropSubscriptionFrom(env, row.uid, hash).then(() => undefined));
      if (!moved.ok) return refuse(moved.why || claim.why || "already used");
      log({ moved: hash, from: moved.from });
    }
    const out = await applySubscription(env, uid, item, s.sub, hash, "apple");
    await ledgerSet(env, hash, { state: s.sub.state, plan: s.sub.basePlanId, sku: item.sku, ids: item.opens, store: "apple" }).catch((e) => log({ ledger: String(e) }));
    const opened = out.subs[item.key].grant ? item.opens : [];
    log({ granted: opened, state: s.sub.state });
    return { status: 200, body: { ok: true, opened, access: out.access, subs: out.subs } };
  }

  if (tx.productId !== want.sku) return refuse("product mismatch");
  const token = appleToken(tx.transactionId);
  /* A wedding is paid for a room and never moves, so for it this is what it
     has always been: a flat refusal. */
  if (foreign && (want.key === "wedding" || !(await ledgerGet(env, await tokenId(token))))) return refuse("already used");

  /* ---- the wedding: the same claim-then-pay order as Play, and for the same reasons (index.ts) ---- */
  if (want.key === "wedding") {
    const claim = await claimPurchase(env, uid, want.sku, want.opens, token, { kind: "inapp", wid });
    if (!claim.ok) return refuse(claim.why || "already used");
    const hash = await tokenId(token);
    const paid = await payRoom(env, uid, wid, hash);
    if (!paid.ok) {
      await ledgerSet(env, hash, { wid: "" });
      log({ refused: paid.why, wid });
      return { status: paid.why === "not yours" ? 403 : 409, body: { error: paid.why } };
    }
    await ledgerSet(env, hash, { wid, state: "granted", store: "apple" });
    log({ granted: ["wedding"], wid });
    return { status: 200, body: { ok: true, opened: ["wedding"], wid } };
  }

  /* ---- a course: six months from the day it was bought ----
     A non-renewing subscription on the App Store, so Apple records no end
     date and the months are counted here - from Apple's purchase date rather
     than from now, so a purchase that reaches the worker a day late is not
     given a day extra, and a retry reads the date back from the ledger. */
  const claim = await claimPurchase(env, uid, want.sku, want.opens, token, { kind: "inapp" });
  if (!claim.ok) {
    /* A course follows its buyer for the same reason a subscription does, and
       loses nothing on the way: the old holder keeps any part of it a code or
       a bank transfer paid for (removeAccess reads that floor for itself). */
    const hash = await tokenId(token);
    const moved = await movePurchase(env, hash, uid, (row) => removeAccessFor(env, row.uid, row.ids, hash).then(() => undefined));
    if (!moved.ok) return refuse(moved.why || claim.why || "already used");
    log({ moved: hash, from: moved.from });
  }
  let until = claim.existing && claim.existing.until;
  if (!until) { const d = new Date(tx.purchaseDate || Date.now()); d.setMonth(d.getMonth() + want.months); until = d.toISOString().slice(0, 10); }
  const wantAccess: Record<string, string> = {};
  for (const k of want.opens) wantAccess[k] = until;
  const access = await grantUntil(env, uid, wantAccess);
  await markGranted(env, token, { until }).catch((e) => log({ ledger: String(e) }));
  await ledgerSet(env, await tokenId(token), { store: "apple" }).catch((e) => log({ ledger: String(e) }));
  log({ granted: want.opens, until });
  return { status: 200, body: { ok: true, opened: want.opens, access } };
}

/* ---- App Store Server Notifications, version 2 ----

   Apple posts { signedPayload } here on a renewal, a lapse, a plan change, a
   refund. Nothing in it is believed: the transaction it names is looked up
   again through the API, and whatever Apple says NOW is applied - so a forged,
   duplicate, late or out-of-order notification all land on the same answer.
   Always 200, or Apple retries for days. */
interface Notice { notificationType?: string; subtype?: string; data?: { bundleId?: string; signedTransactionInfo?: string } }

export async function handleAsn(request: Request, env: AppleEnv): Promise<Response> {
  const done = (note: Record<string, unknown>) => { console.log(JSON.stringify({ at: "asn", ...note })); return new Response(null, { status: 200 }); };
  if (!appleConfigured(env)) return new Response("not configured", { status: 404 });
  let body: { signedPayload?: string };
  try { body = await request.json(); } catch { return done({ ignored: "bad json" }); }
  const notice = jwsPayload<Notice>(body.signedPayload);
  if (!notice || !notice.data) return done({ ignored: "undecodable" });
  if (notice.data.bundleId !== bundleOf(env)) return done({ ignored: "other app" });
  if (notice.notificationType === "TEST") return done({ ignored: "test" });
  const said = jwsPayload<AppleTx>(notice.data.signedTransactionInfo);
  if (!said || !said.transactionId) return done({ ignored: "no transaction", type: notice.notificationType });
  const txid = String(said.transactionId), orig = String(said.originalTransactionId || txid);
  try {
    const item = itemBySku(String(said.productId || ""));
    if ((item && item.kind === "subs") || said.expiresDate) await onAppleSubscription(env, orig, txid);
    else await onAppleOneTime(env, txid);
  } catch (e) { console.error(JSON.stringify({ at: "asn", error: String((e as Error).message || e) })); }
  return done({ type: notice.notificationType, subtype: notice.subtype || "" });
}

async function onAppleSubscription(env: AppleEnv, orig: string, txid: string): Promise<void> {
  const hash = await tokenId(appleToken(orig));
  const row = await ledgerGet(env, hash);
  if (!row) { console.log(JSON.stringify({ at: "asn", orphan: hash.slice(0, 12) })); return; }   // the app's next sync will claim it
  const s = await checkAppleSubscription(env, validId(txid) ? txid : orig);
  if (!s.ok || !s.sub) { console.log(JSON.stringify({ at: "asn", why: s.why })); return; }
  const item = itemBySku(s.sub.productId);
  if (!item || item.kind !== "subs") return;
  await applySubscription(env, row.uid, item, s.sub, hash, "apple");
  await ledgerSet(env, hash, { state: s.sub.state, plan: s.sub.basePlanId, sku: item.sku, ids: item.opens });
  console.log(JSON.stringify({ at: "asn", uid: row.uid, key: item.key, state: s.sub.state }));
}

/* A course or a wedding taken back. Only a transaction Apple now reports as
   revoked is undone; a notification about one that stands (a refund request
   Apple declined, a consumption question) changes nothing. */
async function onAppleOneTime(env: AppleEnv, txid: string): Promise<void> {
  const hash = await tokenId(appleToken(txid));
  const row = await ledgerGet(env, hash);
  if (!row || row.state === "voided") return;
  const got = await checkAppleTransaction(env, txid);
  if (!got.ok || !got.tx || !got.tx.revocationDate) return;
  await voidAppleRow(env, hash, row);
}

async function voidAppleRow(env: AppleEnv, hash: string, row: LedgerRow): Promise<void> {
  if (row.wid) await unpayRoom(env, row.wid, hash);
  else if (row.kind === "inapp" && row.ids.length) await removeAccessFor(env, row.uid, row.ids, hash);
  await ledgerSet(env, hash, { state: "voided", voidedAt: new Date().toISOString() });
  console.log(JSON.stringify({ at: "asn", voided: row.uid, ids: row.ids, wid: row.wid || "" }));
}

/* ---- the backstop for a refund notification that never came ----

   Google can list what it voided; Apple cannot, it can only be asked about
   one transaction at a time. So every App Store course or wedding that is
   still standing - not voided, and for a course not yet run out - is asked
   about again, a bounded number per pass. A failure to reach Apple takes
   nothing back. */
export async function sweepAppleRefunds(env: AppleEnv, cap = 200): Promise<{ looked: number; revoked: number; failed: number }> {
  const out = { looked: 0, revoked: 0, failed: 0 };
  if (!appleConfigured(env)) return out;
  const at = await serviceToken(env, FS_SCOPE);
  const r = await fetch("https://firestore.googleapis.com/v1/projects/" + encodeURIComponent(env.FIREBASE_PROJECT_ID || "") + "/databases/(default)/documents:runQuery", {
    method: "POST", headers: { Authorization: "Bearer " + at, "Content-Type": "application/json" },
    body: JSON.stringify({ structuredQuery: { from: [{ collectionId: "purchases" }], where: { fieldFilter: { field: { fieldPath: "store" }, op: "EQUAL", value: { stringValue: "apple" } } }, limit: 500 } }),
  });
  if (!r.ok) throw new Error("query " + r.status);
  const today = new Date().toISOString().slice(0, 10);
  const rows = (await r.json()) as { document?: { name: string; fields?: Record<string, Record<string, unknown>> } }[];
  for (const it of rows) {
    if (out.looked >= cap) break;
    if (!it.document) continue;
    const row = decode(it.document as { fields?: Record<string, Record<string, unknown>> }) as unknown as LedgerRow;
    if (row.kind !== "inapp" || row.state === "voided" || !isAppleToken(row.token)) continue;
    if (!row.wid && (!row.until || row.until < today)) continue;
    out.looked++;
    try {
      const got = await checkAppleTransaction(env, row.token.slice("apple:".length));
      if (!got.ok || !got.tx) { if (got.why && got.why.indexOf("apple ") === 0) out.failed++; continue; }
      if (!got.tx.revocationDate) continue;
      await voidAppleRow(env, it.document.name.split("/purchases/")[1], row);
      out.revoked++;
    } catch { out.failed++; }
  }
  return out;
}

/* ---- Sign in with Apple, taken back when the account is deleted ----

   Apple's rule for an app that offers Sign in with Apple and lets somebody
   delete their account: the deletion must also revoke the Apple sign-in, so
   the app no longer appears under "Sign in with Apple" in that person's Apple
   ID. It takes Apple's REST API and a client secret signed with a Sign in with
   Apple key, which is why it happens here and not on the phone.

   The phone has just asked Apple to sign the person in again - Firebase needs
   a fresh sign-in before it deletes a login anyway - and hands over the
   one-time authorization code that came with it. That code is exchanged for
   the refresh token, and the refresh token is revoked. The code is only taken
   for the Apple ID this Nabu account signs in with: Apple's own id_token says
   whose it is, and Firebase's token says whose the account is. */
async function siwaSecret(env: AppleEnv): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  const header = b64url(utf8(JSON.stringify({ alg: "ES256", kid: env.APPLE_SIWA_KEY_ID })));
  const claim = b64url(utf8(JSON.stringify({ iss: env.APPLE_TEAM_ID, iat, exp: iat + 300, aud: "https://appleid.apple.com", sub: bundleOf(env) })));
  const key = await crypto.subtle.importKey("pkcs8", pemToBytes(env.APPLE_SIWA_PRIVATE_KEY || ""), { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, utf8(header + "." + claim));
  return header + "." + claim + "." + b64url(sig);
}
export const siwaConfigured = (env: AppleEnv): boolean => !!(env.APPLE_TEAM_ID && env.APPLE_SIWA_KEY_ID && env.APPLE_SIWA_PRIVATE_KEY);

export async function appleRevoke(env: AppleEnv, who: { uid: string; appleSub?: string }, code: string): Promise<Answer> {
  if (!siwaConfigured(env)) return { status: 501, body: { error: "not configured" } };
  if (!code || code.length > 2000) return { status: 400, body: { error: "no code" } };
  if (!who.appleSub) return { status: 409, body: { error: "not an apple account" } };
  const form = (o: Record<string, string>) => Object.keys(o).map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(o[k])).join("&");
  const secret = await siwaSecret(env);
  const t = await fetch("https://appleid.apple.com/auth/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form({ client_id: bundleOf(env), client_secret: secret, code, grant_type: "authorization_code" }),
  });
  const tok = (await t.json().catch(() => ({}))) as { refresh_token?: string; access_token?: string; id_token?: string; error?: string };
  if (t.status >= 500) return { status: 502, body: { error: "apple " + t.status } };
  if (!t.ok || (!tok.refresh_token && !tok.access_token)) return { status: 400, body: { error: tok.error || "bad code" } };
  const idc = jwsPayload<{ sub?: string; aud?: string }>(tok.id_token);
  if (!idc || idc.sub !== who.appleSub) { console.log(JSON.stringify({ at: "apple-revoke", uid: who.uid, refused: "other apple id" })); return { status: 403, body: { error: "not yours" } }; }
  const token = tok.refresh_token || tok.access_token || "";
  const r = await fetch("https://appleid.apple.com/auth/revoke", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form({ client_id: bundleOf(env), client_secret: secret, token, token_type_hint: tok.refresh_token ? "refresh_token" : "access_token" }),
  });
  if (!r.ok) return { status: r.status >= 500 ? 502 : 400, body: { error: "revoke " + r.status } };
  console.log(JSON.stringify({ at: "apple-revoke", uid: who.uid, revoked: true }));
  return { status: 200, body: { ok: true } };
}
