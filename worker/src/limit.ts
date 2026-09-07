/* How often one person may ask.

   Every answer costs money, and there is nothing in an app that stops somebody
   holding down a button. Two limits, both cheap: a burst limit so one person
   cannot fire twenty questions in a minute, and a day limit so a bad afternoon
   cannot become a bad bill.

   Counts live in KV. If the binding is missing the worker still answers - a
   missing limiter should not take the app down - but it says so in the log, so
   "the limits are off" is a thing somebody can find out rather than assume. */

export interface Limits { KV?: KVNamespace }

export interface Verdict { ok: boolean; retryAfter: number; left: number }

const OK = (left: number): Verdict => ({ ok: true, retryAfter: 0, left });

/* Midnight in Hồ Chí Minh City, because that is where the day turns for the
   people using this, not UTC. */
const VN_OFFSET = 7 * 3600;
const dayKey = (now: number): string =>
  new Date((Math.floor(now / 1000) + VN_OFFSET) * 1000).toISOString().slice(0, 10);
const secondsLeftToday = (now: number): number => {
  const t = Math.floor(now / 1000) + VN_OFFSET;
  return 86400 - (t % 86400);
};

async function bump(kv: KVNamespace, key: string, ttl: number): Promise<number> {
  const raw = await kv.get(key);
  const n = (Number(raw) || 0) + 1;
  /* KV is eventually consistent, so two questions in the same instant can both
     read the same number. That undercounts by one now and then, which is fine:
     this is a spending guard, not an accountant. */
  await kv.put(key, String(n), { expirationTtl: Math.max(60, ttl) });
  return n;
}

/* `who` is a uid for a signed-in person, or "ip:1.2.3.4" for the endpoints
   that do not need an account. */
export async function allow(
  env: Limits, who: string, perDay: number, perMinute: number,
): Promise<Verdict> {
  if (!env.KV) { console.log(JSON.stringify({ at: "limit", note: "no KV binding, limits are off" })); return OK(perDay); }
  const now = Date.now();
  const minute = Math.floor(now / 60000);

  const burst = await bump(env.KV, `b:${who}:${minute}`, 120);
  if (burst > perMinute) return { ok: false, retryAfter: 60 - Math.floor((now % 60000) / 1000), left: 0 };

  const day = await bump(env.KV, `d:${who}:${dayKey(now)}`, secondsLeftToday(now) + 60);
  if (day > perDay) return { ok: false, retryAfter: secondsLeftToday(now), left: 0 };

  return OK(Math.max(0, perDay - day));
}

/* ---- the same answer, asked again ----

   "What does the Three of Cups mean for love?" is asked by different people all
   day and the answer is the same every time. Identical questions with no
   conversation behind them are kept for a day. The Cache API is used rather
   than KV because it is free and has no write quota.

   Only when there is no history: once a conversation has a shape, the answer
   belongs to that person and must not be handed to anybody else. */
const cacheUrl = async (body: unknown): Promise<string> => {
  const bytes = new TextEncoder().encode(JSON.stringify(body));
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  const hex = [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return "https://nabu-ai.cache/ask/" + hex;
};

export async function cachedAnswer(key: unknown): Promise<string | null> {
  try {
    const hit = await caches.default.match(new Request(await cacheUrl(key)));
    return hit ? ((await hit.json()) as { answer?: string }).answer || null : null;
  } catch { return null; }
}

export async function keepAnswer(key: unknown, answer: string, ctx: ExecutionContext): Promise<void> {
  try {
    const req = new Request(await cacheUrl(key));
    const res = new Response(JSON.stringify({ answer }), {
      headers: { "Content-Type": "application/json", "Cache-Control": "max-age=86400" },
    });
    ctx.waitUntil(caches.default.put(req, res));
  } catch { /* a cache that will not keep something is not a failed answer */ }
}
