/* Checking that a purchase really happened.

   The phone says "they paid". The phone is not a witness: anything a browser
   can send, a person can send by hand. So the only thing the app is trusted
   with is the token Play hands back, and everything after that is asked of
   Google directly - is this token real, for this product, for this app, and has
   it been used before.

   Then the access is written from here rather than by the phone, because the
   phone asking for what it just bought and the phone asking for whatever it
   likes look identical from the other end.

   Talking to Google needs a service account: a JWT this worker signs, swapped
   for an access token. No library - Workers have WebCrypto, and a JWT is a
   signature over two base64 strings. */

export interface PlayEnv {
  PLAY_SERVICE_ACCOUNT?: string;   // the whole service-account JSON, as a secret
  ANDROID_PACKAGE?: string;        // app.nabutarot.twa
  FIREBASE_PROJECT_ID?: string;
}

/* One service account does three jobs: it asks Play about purchases, it reads
   the code book, and it writes access. The same secret serves all three. */
export type ServiceEnv = Pick<PlayEnv, "PLAY_SERVICE_ACCOUNT">;

interface ServiceAccount { client_email: string; private_key: string }

const b64url = (bytes: ArrayBuffer | Uint8Array): string => {
  const b = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = "";
  for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const utf8 = (s: string) => new TextEncoder().encode(s);

/* A PEM private key is base64 with a header and footer and newlines through it. */
function pemToBytes(pem: string): ArrayBuffer {
  const body = pem.replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");
  const bin = atob(body);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out.buffer;
}

/* Access tokens last an hour and the worker stays warm, so one is kept until it
   is nearly out rather than fetched per purchase. */
let tokenCache: Record<string, { at: number; ttl: number; token: string }> = {};

export async function serviceToken(env: ServiceEnv, scope: string): Promise<string> {
  const now = Date.now();
  const had = tokenCache[scope];
  if (had && now - had.at < had.ttl) return had.token;
  if (!env.PLAY_SERVICE_ACCOUNT) throw new Error("no service account");
  const sa = JSON.parse(env.PLAY_SERVICE_ACCOUNT) as ServiceAccount;

  const iat = Math.floor(now / 1000);
  const header = b64url(utf8(JSON.stringify({ alg: "RS256", typ: "JWT" })));
  const claim = b64url(utf8(JSON.stringify({
    iss: sa.client_email,
    scope,
    aud: "https://oauth2.googleapis.com/token",
    iat,
    exp: iat + 3600,
  })));

  const key = await crypto.subtle.importKey(
    "pkcs8", pemToBytes(sa.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, utf8(header + "." + claim));
  const assertion = header + "." + claim + "." + b64url(sig);

  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=" + encodeURIComponent(assertion),
  });
  if (!r.ok) throw new Error("oauth " + r.status);
  const j = (await r.json()) as { access_token: string; expires_in: number };
  tokenCache[scope] = { at: now, ttl: Math.max(60, (j.expires_in || 3600) - 120) * 1000, token: j.access_token };
  return j.access_token;
}
const accessToken = serviceToken;

export const PLAY_SCOPE = "https://www.googleapis.com/auth/androidpublisher";
export const FS_SCOPE = "https://www.googleapis.com/auth/datastore";

export interface Bought { ok: boolean; why?: string; sku?: string }

/* purchaseState 0 is bought, 1 cancelled, 2 pending. consumptionState 1 means
   it has already been handed over once, which is what stops the same token
   being sent again for a second helping. */
export async function checkPurchase(env: PlayEnv, sku: string, token: string): Promise<Bought> {
  const pkg = env.ANDROID_PACKAGE || "app.nabutarot.twa";
  const at = await accessToken(env, PLAY_SCOPE);
  const url = "https://androidpublisher.googleapis.com/androidpublisher/v3/applications/"
    + encodeURIComponent(pkg) + "/purchases/products/" + encodeURIComponent(sku)
    + "/tokens/" + encodeURIComponent(token);
  const r = await fetch(url, { headers: { Authorization: "Bearer " + at } });
  if (r.status === 404) return { ok: false, why: "unknown purchase" };
  if (!r.ok) return { ok: false, why: "play " + r.status };
  const p = (await r.json()) as { purchaseState?: number; consumptionState?: number; acknowledgementState?: number };
  if (p.purchaseState === 2) return { ok: false, why: "pending" };
  if (p.purchaseState !== 0) return { ok: false, why: "not bought" };
  if (p.consumptionState === 1) return { ok: false, why: "already used" };
  return { ok: true, sku };
}

/* Unacknowledged purchases are refunded by Google after three days, so this is
   not housekeeping - it is the difference between being paid and not. */
export async function acknowledge(env: PlayEnv, sku: string, token: string): Promise<void> {
  const pkg = env.ANDROID_PACKAGE || "app.nabutarot.twa";
  const at = await accessToken(env, PLAY_SCOPE);
  const base = "https://androidpublisher.googleapis.com/androidpublisher/v3/applications/"
    + encodeURIComponent(pkg) + "/purchases/products/" + encodeURIComponent(sku)
    + "/tokens/" + encodeURIComponent(token);
  await fetch(base + ":acknowledge", {
    method: "POST",
    headers: { Authorization: "Bearer " + at, "Content-Type": "application/json" },
    body: "{}",
  });
  /* Consumed as well, because everything sold here runs out: six months or
     twelve, and then it is bought again. A product that can never be bought
     twice would have to be a subscription instead. */
  await fetch(base + ":consume", {
    method: "POST",
    headers: { Authorization: "Bearer " + at, "Content-Type": "application/json" },
    body: "{}",
  });
}

/* ---- writing the access down ----

   Through the REST API with the service account, so it does not depend on what
   the security rules allow a phone to do. Merged into whatever is there, so a
   second purchase does not wipe the first. */
const isoPlusMonths = (months: number): string => {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
};

export async function grant(env: PlayEnv, uid: string, ids: string[], months: Record<string, number>): Promise<Record<string, string>> {
  const want: Record<string, string> = {};
  for (const id of ids) want[id] = isoPlusMonths(months[id] || 12);
  return grantUntil(env, uid, want);
}

/* The same, with the dates already decided - a code carries its own expiry. */
export async function grantUntil(env: PlayEnv, uid: string, want: Record<string, string>): Promise<Record<string, string>> {
  if (!env.FIREBASE_PROJECT_ID) throw new Error("no project id");
  const at = await accessToken(env, FS_SCOPE);
  const base = "https://firestore.googleapis.com/v1/projects/"
    + encodeURIComponent(env.FIREBASE_PROJECT_ID) + "/databases/(default)/documents/users/" + encodeURIComponent(uid);

  /* Read what is there, keep whichever date is later, write the lot back. Two
     purchases in the same minute are rare enough to be worth the simplicity. */
  const cur = await fetch(base, { headers: { Authorization: "Bearer " + at } });
  const held: Record<string, string> = {};
  if (cur.ok) {
    const doc = (await cur.json()) as { fields?: { access?: { mapValue?: { fields?: Record<string, { stringValue?: string }> } } } };
    const f = doc.fields?.access?.mapValue?.fields || {};
    for (const k of Object.keys(f)) if (f[k].stringValue) held[k] = f[k].stringValue as string;
  }

  const out: Record<string, string> = { ...held };
  for (const id of Object.keys(want)) {
    if (!out[id] || want[id] > out[id]) out[id] = want[id];
  }

  const fields: Record<string, { stringValue: string }> = {};
  for (const k of Object.keys(out)) fields[k] = { stringValue: out[k] };
  const body = { fields: { access: { mapValue: { fields } } } };
  const w = await fetch(base + "?updateMask.fieldPaths=access", {
    method: "PATCH",
    headers: { Authorization: "Bearer " + at, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!w.ok) throw new Error("firestore " + w.status);
  return out;
}

/* ---- subscriptions ----
   subscriptionsv2 is the current shape: one token, a state for the whole
   subscription, and a line item per product with its expiry and base plan.
   The state is Google's word, and it is the only word this worker takes. */
export interface SubInfo {
  state: string;          // SUBSCRIPTION_STATE_ACTIVE | _CANCELED | _IN_GRACE_PERIOD | _ON_HOLD | _PAUSED | _EXPIRED | _PENDING | _PENDING_PURCHASE_CANCELED | _UNSPECIFIED
  expiryMs: number;
  productId: string;
  basePlanId: string;
  autoRenew: boolean;
  acknowledged: boolean;
  linkedToken: string;    // the token this one replaced, on a plan change
}
export interface SubCheck { ok: boolean; why?: string; sub?: SubInfo }

export async function checkSubscription(env: PlayEnv, token: string): Promise<SubCheck> {
  const pkg = env.ANDROID_PACKAGE || "app.nabutarot.twa";
  const at = await accessToken(env, PLAY_SCOPE);
  const url = "https://androidpublisher.googleapis.com/androidpublisher/v3/applications/"
    + encodeURIComponent(pkg) + "/purchases/subscriptionsv2/tokens/" + encodeURIComponent(token);
  const r = await fetch(url, { headers: { Authorization: "Bearer " + at } });
  if (r.status === 404) return { ok: false, why: "unknown purchase" };
  if (!r.ok) return { ok: false, why: "play " + r.status };
  const j = (await r.json()) as {
    subscriptionState?: string; acknowledgementState?: string; linkedPurchaseToken?: string;
    lineItems?: { productId?: string; expiryTime?: string; autoRenewingPlan?: { autoRenewEnabled?: boolean }; offerDetails?: { basePlanId?: string } }[];
  };
  const li = (j.lineItems || [])[0] || {};
  return { ok: true, sub: {
    state: j.subscriptionState || "SUBSCRIPTION_STATE_UNSPECIFIED",
    expiryMs: li.expiryTime ? Date.parse(li.expiryTime) : 0,
    productId: li.productId || "",
    basePlanId: (li.offerDetails && li.offerDetails.basePlanId) || "",
    autoRenew: !!(li.autoRenewingPlan && li.autoRenewingPlan.autoRenewEnabled),
    acknowledged: j.acknowledgementState === "ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED",
    linkedToken: j.linkedPurchaseToken || "",
  } };
}

/* Acknowledged, never consumed: a subscription that is consumed is gone. Not
   acknowledging within three days refunds the buyer, so this is money. */
export async function acknowledgeSub(env: PlayEnv, productId: string, token: string): Promise<void> {
  const pkg = env.ANDROID_PACKAGE || "app.nabutarot.twa";
  const at = await accessToken(env, PLAY_SCOPE);
  await fetch("https://androidpublisher.googleapis.com/androidpublisher/v3/applications/" + encodeURIComponent(pkg)
    + "/purchases/subscriptions/" + encodeURIComponent(productId) + "/tokens/" + encodeURIComponent(token) + ":acknowledge",
    { method: "POST", headers: { Authorization: "Bearer " + at, "Content-Type": "application/json" }, body: "{}" });
}
