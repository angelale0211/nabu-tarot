/* Shared helpers for the worker tests: a throwaway RSA key that plays both
   Google's signing key and the service account, an ID token signer, and a
   fetch mock keyed by URL substring. Node 20 has WebCrypto on globalThis. */
import { webcrypto } from "node:crypto";
const subtle = webcrypto.subtle;
const b64url = (b: ArrayBuffer | Uint8Array | string): string => {
  const bytes = typeof b === "string" ? new TextEncoder().encode(b) : new Uint8Array(b as ArrayBuffer);
  return Buffer.from(bytes).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
export interface Keys { priv: CryptoKey; jwk: JsonWebKey; pem: string }
export async function makeKeys(): Promise<Keys> {
  const kp = await subtle.generateKey({ name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["sign", "verify"]) as CryptoKeyPair;
  const jwk = await subtle.exportKey("jwk", kp.publicKey) as JsonWebKey & { kid?: string };
  jwk.kid = "k1"; jwk.alg = "RS256"; jwk.use = "sig";
  const pkcs8 = await subtle.exportKey("pkcs8", kp.privateKey);
  const pem = "-----BEGIN PRIVATE KEY-----\n" + Buffer.from(pkcs8).toString("base64").replace(/(.{64})/g, "$1\n") + "\n-----END PRIVATE KEY-----\n";
  return { priv: kp.privateKey, jwk, pem };
}
export async function signJwt(k: Keys, claims: Record<string, unknown>): Promise<string> {
  const h = b64url(JSON.stringify({ alg: "RS256", typ: "JWT", kid: "k1" }));
  const c = b64url(JSON.stringify(claims));
  const sig = await subtle.sign("RSASSA-PKCS1-v1_5", k.priv, new TextEncoder().encode(h + "." + c));
  return h + "." + c + "." + b64url(sig);
}
export const idToken = (k: Keys, uid: string) => {
  const now = Math.floor(Date.now() / 1000);
  return signJwt(k, { aud: "nabutarot", iss: "https://securetoken.google.com/nabutarot", sub: uid, exp: now + 3600, iat: now, email: uid + "@test", email_verified: true });
};
export const serviceAccount = (k: Keys) => JSON.stringify({ client_email: "nabu-worker@nabutarot.iam.gserviceaccount.com", private_key: k.pem });
export const env = (k: Keys, extra: Record<string, string> = {}) => ({
  PLAY_SERVICE_ACCOUNT: serviceAccount(k), FIREBASE_PROJECT_ID: "nabutarot", ANDROID_PACKAGE: "app.nabutarot.twa",
  ALLOWED_ORIGIN: "https://nabutarot.com", ...extra,
});
export const ctx = () => { const waits: Promise<unknown>[] = []; return { waitUntil: (p: Promise<unknown>) => { waits.push(p); }, passThroughOnException() {}, done: () => Promise.all(waits) }; };
export type Route = (url: string, init: RequestInit) => Response | Promise<Response> | null;
/* Install a fetch that answers from `routes` (first match by substring wins)
   and records every call. Returns the log and an uninstaller. */
export function mockFetch(k: Keys, routes: Record<string, Route>) {
  const log: { url: string; method: string; body: string }[] = [];
  const real = globalThis.fetch;
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input instanceof Request ? input.url : input);
    log.push({ url, method: (init && init.method) || "GET", body: String((init && init.body) || "") });
    if (url.includes("securetoken@system.gserviceaccount.com") || url.includes("oauth2/v3/certs")) return new Response(JSON.stringify({ keys: [k.jwk] }), { headers: { "cache-control": "max-age=3600" } });
    if (url.includes("oauth2.googleapis.com/token")) return new Response(JSON.stringify({ access_token: "at", expires_in: 3600 }));
    for (const key of Object.keys(routes)) if (url.includes(key)) { const r = await routes[key](url, init || {}); if (r) return r; }
    return new Response(JSON.stringify({ error: "unrouted " + url }), { status: 599 });
  }) as typeof fetch;
  return { log, restore: () => { globalThis.fetch = real; } };
}
export const json = (o: unknown, status = 200) => new Response(JSON.stringify(o), { status, headers: { "Content-Type": "application/json" } });
/* Firestore REST value encoding, enough for the tests to build documents. */
export const fsDoc = (fields: Record<string, unknown>) => ({ fields: enc(fields) });
function enc(o: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(o)) out[k] = val(o[k]);
  return out;
}
function val(v: unknown): unknown {
  if (typeof v === "string") return { stringValue: v };
  if (typeof v === "boolean") return { booleanValue: v };
  if (typeof v === "number") return { integerValue: String(v) };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(val) } };
  if (v && typeof v === "object") return { mapValue: { fields: enc(v as Record<string, unknown>) } };
  return { nullValue: null };
}
