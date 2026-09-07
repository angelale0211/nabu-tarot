/* Who is asking.

   CORS is not a lock. It is a rule browsers agree to follow, and curl does not
   use a browser, so before this the worker answered anybody on earth who knew
   the URL - and every answer costs money. The app already signs people in with
   Firebase, so it can send the token it already holds; this checks it.

   No library: Google publishes the signing keys as JWKs, and Workers have
   WebCrypto, so verifying is a fetch, an importKey and a verify. */

export interface Who { uid: string; email: string; verified: boolean }

const JWKS_URL = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";

/* Keys change rarely and the worker stays warm, so the ones we have are kept
   until Google's own cache header says they are stale. A cold worker fetches
   once; every request after that is arithmetic. */
let keyCache: { at: number; ttl: number; keys: Record<string, CryptoKey> } | null = null;

const b64url = (s: string): Uint8Array => {
  const pad = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(pad + "=".repeat((4 - (pad.length % 4)) % 4));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
};

const jsonPart = (s: string): Record<string, unknown> =>
  JSON.parse(new TextDecoder().decode(b64url(s)));

async function keys(): Promise<Record<string, CryptoKey>> {
  const now = Date.now();
  if (keyCache && now - keyCache.at < keyCache.ttl) return keyCache.keys;
  const r = await fetch(JWKS_URL);
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
  keyCache = { at: now, ttl: Math.max(60, Number(max?.[1] || 3600)) * 1000, keys: out };
  return out;
}

/* Returns who is asking, or null. Null is never "probably fine": the caller
   turns it into a 401. */
export async function whoIsAsking(request: Request, projectId: string): Promise<Who | null> {
  const raw = (request.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "").trim();
  if (!raw) return null;
  const bits = raw.split(".");
  if (bits.length !== 3) return null;
  try {
    const head = jsonPart(bits[0]) as { alg?: string; kid?: string };
    if (head.alg !== "RS256" || !head.kid) return null;
    const key = (await keys())[head.kid];
    if (!key) return null;

    const signed = new TextEncoder().encode(bits[0] + "." + bits[1]);
    const okSig = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5", key, b64url(bits[2]) as unknown as BufferSource, signed);
    if (!okSig) return null;

    /* A signature only says Google wrote it. These say it was written for us,
       recently, about somebody. */
    const c = jsonPart(bits[1]) as {
      aud?: string; iss?: string; sub?: string; exp?: number; iat?: number;
      email?: string; email_verified?: boolean;
    };
    const now = Math.floor(Date.now() / 1000);
    if (c.aud !== projectId) return null;
    if (c.iss !== "https://securetoken.google.com/" + projectId) return null;
    if (!c.sub) return null;
    if (!c.exp || c.exp <= now) return null;
    if (c.iat && c.iat > now + 300) return null;   // clocks differ; five minutes is plenty
    return { uid: c.sub, email: String(c.email || ""), verified: c.email_verified === true };
  } catch {
    return null;
  }
}
