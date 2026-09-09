/* Who is asking.

   CORS is not a lock. It is a rule browsers agree to follow, and curl does not
   use a browser, so before this the worker answered anybody on earth who knew
   the URL - and every answer costs money. The app already signs people in with
   Firebase, so it can send the token it already holds; this checks it.

   No library: Google publishes the signing keys as JWKs, and Workers have
   WebCrypto, so verifying is a fetch, an importKey and a verify. */

export interface Who { uid: string; email: string; verified: boolean }

const FIREBASE_JWKS = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";
const GOOGLE_JWKS = "https://www.googleapis.com/oauth2/v3/certs";

/* Keys change rarely and the worker stays warm, so the ones we have are kept
   until Google's own cache header says they are stale. A cold worker fetches
   once; every request after that is arithmetic. Cached per JWKS url, because
   Firebase sign-in and a Pub/Sub push are signed by different key sets. */
let keyCache: Record<string, { at: number; ttl: number; keys: Record<string, CryptoKey> }> = {};

const b64url = (s: string): Uint8Array => {
  const pad = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(pad + "=".repeat((4 - (pad.length % 4)) % 4));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
};

const jsonPart = (s: string): Record<string, unknown> =>
  JSON.parse(new TextDecoder().decode(b64url(s)));

async function keys(url: string): Promise<Record<string, CryptoKey>> {
  const now = Date.now(), had = keyCache[url];
  if (had && now - had.at < had.ttl) return had.keys;
  const r = await fetch(url);
  if (!r.ok) throw new Error("jwks " + r.status);
  const body = (await r.json()) as { keys: JsonWebKey[] };
  const max = /max-age=(\d+)/.exec(r.headers.get("cache-control") || "");
  const out: Record<string, CryptoKey> = {};
  for (const jwk of body.keys || []) {
    const kid = (jwk as { kid?: string }).kid;
    if (!kid) continue;
    out[kid] = await crypto.subtle.importKey(
      "jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  }
  keyCache[url] = { at: now, ttl: Math.max(60, Number(max?.[1] || 3600)) * 1000, keys: out };
  return out;
}

/* Signature, expiry and clock skew only. Who it is for and who wrote it are
   the caller's questions, because they differ between a Firebase sign-in and
   a Pub/Sub push. */
export async function verifyJwt(raw: string, jwksUrl: string): Promise<Record<string, unknown> | null> {
  const bits = (raw || "").split(".");
  if (bits.length !== 3) return null;
  try {
    const head = jsonPart(bits[0]) as { alg?: string; kid?: string };
    if (head.alg !== "RS256" || !head.kid) return null;
    const key = (await keys(jwksUrl))[head.kid];
    if (!key) return null;
    const okSig = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, b64url(bits[2]) as unknown as BufferSource, new TextEncoder().encode(bits[0] + "." + bits[1]));
    if (!okSig) return null;
    const c = jsonPart(bits[1]) as { exp?: number; iat?: number };
    const now = Math.floor(Date.now() / 1000);
    if (!c.exp || c.exp <= now) return null;
    if (c.iat && c.iat > now + 300) return null;
    return c as Record<string, unknown>;
  } catch { return null; }
}

/* Returns who is asking, or null. Null is never "probably fine": the caller
   turns it into a 401. */
export async function whoIsAsking(request: Request, projectId: string): Promise<Who | null> {
  const raw = (request.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "").trim();
  if (!raw) return null;
  const c = await verifyJwt(raw, FIREBASE_JWKS) as { aud?: string; iss?: string; sub?: string; email?: string; email_verified?: boolean } | null;
  if (!c) return null;
  if (c.aud !== projectId) return null;
  if (c.iss !== "https://securetoken.google.com/" + projectId) return null;
  if (!c.sub) return null;
  return { uid: c.sub, email: String(c.email || ""), verified: c.email_verified === true };
}

/* A Pub/Sub push carries an OIDC token Google signed for the audience we gave
   the subscription, on behalf of the service account we named. */
export async function verifyGoogleJwt(raw: string, aud: string, email?: string): Promise<boolean> {
  /* The audience is just a URL string, so anyone with a GCP account can mint
     a token naming it as their own audience. The service-account email is
     the only thing that tells Google-the-publisher apart from any other GCP
     customer, so it is mandatory here, not merely checked when supplied - an
     unset or empty `email` fails closed rather than skipping the check. */
  if (!email) return false;
  const c = await verifyJwt(raw, GOOGLE_JWKS) as { aud?: string; iss?: string; email?: string; email_verified?: boolean } | null;
  if (!c) return false;
  if (c.iss !== "https://accounts.google.com" && c.iss !== "accounts.google.com") return false;
  if (c.aud !== aud) return false;
  if (c.email !== email || c.email_verified !== true) return false;
  return true;
}
