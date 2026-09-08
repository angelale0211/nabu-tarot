/* Nabu AI — Cloudflare Worker that answers the app's questions with Claude.
   The app never sees the API key: it POSTs { lang, question, context, kind,
   history, profile } here, and this worker calls Claude with a fixed system
   prompt plus the knowledge the app already showed the visitor.
   Deploy: npm install && npx wrangler secret put ANTHROPIC_API_KEY && npx wrangler deploy
   Then put the worker URL into CONFIG.aiEndpoint in src/config.js. */
import Anthropic from "@anthropic-ai/sdk";
import { whoIsAsking } from "./auth";
import { allow, cachedAnswer, keepAnswer } from "./limit";
import { checkPurchase, acknowledge, grant, grantUntil } from "./play";
import { claimCode } from "./codes";

/* How long each thing is sold for. Kept here rather than read from the app,
   because the app is the side that cannot be trusted about what it bought. */
const MONTHS: Record<string, number> = {
  tarot: 6, lenormand: 6, playing: 6, manifest: 12,
  plus: 12, pro6: 6, pro: 12, wedding: 12,
};
/* Pro contains Plus, exactly as a code for Pro has always opened both. */
const ALSO: Record<string, string[]> = { pro: ["plus"], pro6: ["plus"] };

export interface Env {
  ANTHROPIC_API_KEY?: string;
  GEMINI_API_KEY?: string;
  AI?: { run: (model: string, input: unknown) => Promise<{ response?: string }> }; // Workers AI binding (free tier, open models)
  ALLOWED_ORIGIN?: string; // e.g. https://nabutarot.com
  RESEND_API_KEY?: string; // for /booking: mails the reader a calendar invitation
  PLAY_SERVICE_ACCOUNT?: string; // the service-account JSON, for checking purchases
  ANDROID_PACKAGE?: string;      // app.nabutarot.twa
  FIREBASE_PROJECT_ID?: string; // whose sign-ins this worker accepts; unset = anybody may ask
  KV?: KVNamespace;            // where the per-person counts live; unset = no limits
}

/* What one person may ask for in a day. Generous for somebody using the app,
   nowhere near enough to be worth abusing. */
const ASK_A_DAY = 40, ASK_A_MINUTE = 6;
const MAIL_A_DAY = 20, MAIL_A_MINUTE = 3;

interface AskBody {
  lang: "vi" | "en";
  question: string;
  context: string;
  kind: "card" | "lesson" | "sign" | "numbers" | "general";
  history?: { role: "user" | "assistant"; text: string }[];
  profile?: { name?: string; sign?: string };
}

const SYSTEM_VI = `Bạn là Nabu AI, trợ lý của Nabu Tarot, một reader tarot người Việt. Bạn nói chuyện ấm áp, ngắn gọn, bằng tiếng Việt đời thường (xưng "mình", gọi người dùng là "bạn"). Câu ngắn, mỗi đoạn một ý, không dùng từ hoa mỹ.
Bạn trả lời dựa trên PHẦN KIẾN THỨC được cung cấp (lá bài, bài học, cung hoàng đạo hoặc các con số của người dùng). Khi câu hỏi vượt ngoài phần đó, bạn nói thẳng là một lá bài hay một cung không trả lời được, và gợi ý người dùng đặt lịch xem bài đầy đủ với Nabu.
Bạn không chẩn đoán bệnh, không tư vấn pháp lý hay đầu tư cụ thể, không hứa điều gì chắc chắn xảy ra. Bạn không nhắc đến tên nguồn, sách hay kênh nào. Trả lời trong 4 đến 8 câu, trừ khi người dùng hỏi giải thích bài học thì có thể dài hơn một chút.`;
const SYSTEM_EN = `You are Nabu AI, the assistant of Nabu Tarot, a Vietnamese tarot reader. You speak warmly and briefly in plain English. Short sentences, one idea per paragraph, no flowery words.
Answer from the KNOWLEDGE section provided (the card, the lesson, the visitor's sign or numbers). When a question goes beyond it, say plainly that one card or one sign cannot answer that, and suggest booking a full reading with Nabu.
No medical diagnosis, no specific legal or investment advice, no promises that something will certainly happen. Never name sources, books or channels. Answer in 4 to 8 sentences, a little longer only when explaining a lesson.`;

const cors = (origin: string | undefined, env: Env) => ({
  "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN && origin === env.ALLOWED_ORIGIN ? origin : env.ALLOWED_ORIGIN || "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
});

/* Cloudflare puts the caller's address here. Behind it there is no spoofing it,
   which is what makes it usable for counting. */
const caller = (request: Request): string =>
  "ip:" + (request.headers.get("CF-Connecting-IP") || "unknown");

const tooMany = (v: { retryAfter: number }, headers: Record<string, string>): Response =>
  new Response(JSON.stringify({ error: "limit", retryAfter: v.retryAfter }), {
    status: 429, headers: { ...headers, "Retry-After": String(v.retryAfter) },
  });

const recipients = (to: unknown): string[] => (Array.isArray(to) ? to : [to]).map((x) => String(x || "").trim()).filter((x) => /^[^@\s]+@[^@\s]+$/.test(x)).slice(0, 5);

/* Mail a bug report from #/report (Resend). */
async function reportMail(request: Request, env: Env, headers: Record<string, string>): Promise<Response> {
  if (!env.RESEND_API_KEY) return new Response(JSON.stringify({ error: "no mail key" }), { status: 500, headers });
  let b: { text?: string; contact?: string; info?: string; to?: string | string[]; lang?: string };
  try { b = await request.json(); } catch { return new Response(JSON.stringify({ error: "bad json" }), { status: 400, headers }); }
  const toList = recipients(b.to), text = String(b.text || "").trim().slice(0, 4000);
  if (!toList.length || !text) return new Response(JSON.stringify({ error: "missing" }), { status: 400, headers });
  const bodyText = text + "\n\n" + (b.contact ? "Liên hệ: " + String(b.contact).slice(0, 200) + "\n" : "") + "— " + String(b.info || "").slice(0, 600);
  const r = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: "Bearer " + env.RESEND_API_KEY, "Content-Type": "application/json" }, body: JSON.stringify({ from: "Nabu Tarot <onboarding@resend.dev>", to: toList, subject: "Báo lỗi app Nabu Tarot", text: bodyText }) });
  if (!r.ok) return new Response(JSON.stringify({ error: "mail " + r.status }), { status: 502, headers });
  return new Response(JSON.stringify({ ok: true }), { headers });
}

/* Build an iCalendar invitation for a booking and mail it (Resend). Outlook and
   most mail apps add a METHOD:REQUEST invitation to the calendar on arrival. */
async function bookingMail(request: Request, env: Env, headers: Record<string, string>): Promise<Response> {
  if (!env.RESEND_API_KEY) return new Response(JSON.stringify({ error: "no mail key" }), { status: 500, headers });
  let b: { booking: Record<string, string>; tz?: string; to?: string | string[]; lang?: string };
  try { b = await request.json(); } catch { return new Response(JSON.stringify({ error: "bad json" }), { status: 400, headers }); }
  const bk = b.booking || {}, toList = recipients(b.to), to = toList[0] || "";
  if (!to || !bk.slot) return new Response(JSON.stringify({ error: "missing" }), { status: 400, headers });
  const start = bk.slot.replace(/[^0-9T]/g, "") + "00"; // YYYYMMDDTHHMM00 local time
  const [d, t] = bk.slot.split("T"), hh = Number(t.slice(0, 2)) + 1;
  const end = d.replace(/-/g, "") + "T" + String(hh).padStart(2, "0") + t.slice(3, 5) + "00";
  const tz = b.tz || "Asia/Ho_Chi_Minh";
  const summary = "Nabu Tarot: " + (bk.service || "") + (bk.pkg ? " – " + bk.pkg : "") + (bk.name ? " · " + bk.name : "");
  const desc = [bk.service && bk.pkg ? bk.service + " – " + bk.pkg + (bk.price ? " (" + bk.price + "đ)" : "") : "", bk.topic ? "Chủ đề: " + bk.topic : "", bk.name ? "Khách: " + bk.name : "", bk.email ? "Email: " + bk.email : "", bk.birth ? "Ngày giờ sinh: " + bk.birth : "", bk.card ? "Lá đã rút: " + bk.card : "", bk.note ? "Ghi chú: " + bk.note : "", bk.id ? "Mã đặt lịch: " + bk.id : ""].filter(Boolean).join("\n");
  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  const uid = (bk.id || start) + "@nabu-tarot";
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Nabu Tarot//Booking//VI", "METHOD:REQUEST", "BEGIN:VEVENT", "UID:" + uid, "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z", "DTSTART;TZID=" + tz + ":" + start, "DTEND;TZID=" + tz + ":" + end, "SUMMARY:" + esc(summary), "DESCRIPTION:" + esc(desc), "ORGANIZER;CN=Nabu Tarot:mailto:" + to, "ATTENDEE;CN=Nabu;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED:mailto:" + to, "STATUS:CONFIRMED", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  const r = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: "Bearer " + env.RESEND_API_KEY, "Content-Type": "application/json" }, body: JSON.stringify({
    from: "Nabu Tarot <onboarding@resend.dev>", to: toList, subject: summary,
    text: desc + "\n\nLịch hẹn đã được thêm vào lịch (file .ics đính kèm).",
    attachments: [{ filename: "nabu-booking.ics", content: btoa(unescape(encodeURIComponent(ics))), content_type: "text/calendar; method=REQUEST" }],
  }) });
  if (!r.ok) return new Response(JSON.stringify({ error: "mail " + r.status }), { status: 502, headers });
  return new Response(JSON.stringify({ ok: true }), { headers });
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const headers = { ...cors(request.headers.get("Origin") || undefined, env), "Content-Type": "application/json" };
    if (request.method === "OPTIONS") return new Response(null, { headers });
    if (request.method !== "POST") return new Response(JSON.stringify({ error: "POST only" }), { status: 405, headers });

    /* The two mail endpoints do not need an account - a bug report from
       somebody who cannot sign in is exactly the report worth having - so they
       are counted by address instead. */
    const path = new URL(request.url).pathname;
    if (path.endsWith("/booking") || path.endsWith("/report")) {
      const v = await allow(env, caller(request), MAIL_A_DAY, MAIL_A_MINUTE);
      if (!v.ok) return tooMany(v, headers);
      return path.endsWith("/booking") ? bookingMail(request, env, headers) : reportMail(request, env, headers);
    }

    /* ---- somebody bought something in the Android app ----

       The phone sends the token Play gave it. Everything else is asked of
       Google: is this token real, for this product, for this app, and has it
       been handed over before. Then the access is written from here, with the
       service account, so that granting it never depends on what a phone is
       allowed to write. */
    if (path.endsWith("/billing")) {
      if (!env.FIREBASE_PROJECT_ID) return new Response(JSON.stringify({ error: "not configured" }), { status: 500, headers });
      const person = await whoIsAsking(request, env.FIREBASE_PROJECT_ID);
      if (!person) return new Response(JSON.stringify({ error: "signin" }), { status: 401, headers });
      const v = await allow(env, person.uid, 40, 6);
      if (!v.ok) return tooMany(v, headers);

      let b: { sku?: string; token?: string };
      try { b = await request.json(); } catch { return new Response(JSON.stringify({ error: "bad json" }), { status: 400, headers }); }
      const sku = String(b.sku || "");
      const token = String(b.token || "");
      if (!MONTHS[sku] || !token) return new Response(JSON.stringify({ error: "unknown product" }), { status: 400, headers });

      try {
        const bought = await checkPurchase(env, sku, token);
        if (!bought.ok) {
          console.log(JSON.stringify({ at: "billing", uid: person.uid, sku, refused: bought.why }));
          return new Response(JSON.stringify({ error: bought.why || "refused" }), { status: 402, headers });
        }
        const ids = [sku].concat(ALSO[sku] || []);
        const access = await grant(env, person.uid, ids, MONTHS);
        /* Only once it is written down. A purchase acknowledged before the
           access exists is a purchase Google will not refund and the buyer
           never received. */
        ctx.waitUntil(acknowledge(env, sku, token));
        console.log(JSON.stringify({ at: "billing", uid: person.uid, sku, granted: ids }));
        return new Response(JSON.stringify({ ok: true, opened: ids, access }), { headers });
      } catch (e) {
        console.error(JSON.stringify({ at: "billing", uid: person.uid, sku, error: String((e as Error).message || e) }));
        return new Response(JSON.stringify({ error: "check failed" }), { status: 502, headers });
      }
    }

    /* ---- somebody typed an access code ----

       The code is checked and claimed here, against a book only Nabu and this
       worker can read, and bound to the account that typed it. The same
       account may type it again on another phone; a different account is
       refused. The access is then written from here, like a purchase. */
    if (path.endsWith("/redeem")) {
      if (!env.FIREBASE_PROJECT_ID || !env.PLAY_SERVICE_ACCOUNT) return new Response(JSON.stringify({ error: "not configured" }), { status: 500, headers });
      const person = await whoIsAsking(request, env.FIREBASE_PROJECT_ID);
      if (!person) return new Response(JSON.stringify({ error: "signin" }), { status: 401, headers });
      /* Guessing is the only attack left, and a six-letter tail from a
         32-letter alphabet is a billion codes: twenty tries a day gets nowhere. */
      const v = await allow(env, "redeem:" + person.uid, 20, 5);
      if (!v.ok) return tooMany(v, headers);

      let b: { code?: string };
      try { b = await request.json(); } catch { return new Response(JSON.stringify({ error: "bad json" }), { status: 400, headers }); }
      const code = String(b.code || "").slice(0, 40);
      try {
        const got = await claimCode(env, person.uid, code);
        if (!got.ok) {
          console.log(JSON.stringify({ at: "redeem", uid: person.uid, refused: got.why }));
          return new Response(JSON.stringify({ error: got.why }), { status: got.why === "check failed" ? 502 : 402, headers });
        }
        const ids = [got.course].concat(ALSO[got.course] || []);
        const want: Record<string, string> = {};
        for (const id of ids) want[id] = got.until;
        const access = await grantUntil(env, person.uid, want);
        console.log(JSON.stringify({ at: "redeem", uid: person.uid, granted: ids, until: got.until }));
        return new Response(JSON.stringify({ ok: true, opened: ids, access }), { headers });
      } catch (e) {
        console.error(JSON.stringify({ at: "redeem", uid: person.uid, error: String((e as Error).message || e) }));
        return new Response(JSON.stringify({ error: "check failed" }), { status: 502, headers });
      }
    }

    /* Asking costs money, so asking requires an account. Until the project id
       is set the worker keeps its old behaviour, so deploying this cannot lock
       the app out before the app is sending a token. */
    let who = "";
    if (env.FIREBASE_PROJECT_ID) {
      const person = await whoIsAsking(request, env.FIREBASE_PROJECT_ID);
      if (!person) return new Response(JSON.stringify({ error: "signin" }), { status: 401, headers });
      who = person.uid;
    } else {
      who = caller(request);
    }
    const verdict = await allow(env, who, ASK_A_DAY, ASK_A_MINUTE);
    if (!verdict.ok) return tooMany(verdict, headers);

    let body: AskBody;
    try { body = (await request.json()) as AskBody; } catch { return new Response(JSON.stringify({ error: "bad json" }), { status: 400, headers }); }
    const question = (body.question || "").trim().slice(0, 1000);
    if (!question) return new Response(JSON.stringify({ error: "empty question" }), { status: 400, headers });

    /* The same question with nothing said before it has the same answer for
       everybody, and the card meanings are asked all day long. */
    const fresh = !(body.history || []).length;
    const cacheKey = { lang: body.lang, kind: body.kind, question, context: (body.context || "").slice(0, 12000) };
    if (fresh) {
      const hit = await cachedAnswer(cacheKey);
      if (hit) return new Response(JSON.stringify({ answer: hit }), { headers });
    }
    const keep = (answer: string): void => { if (fresh && answer) keepAnswer(cacheKey, answer, ctx); };

    const knowledge = `KIND: ${body.kind}\nVISITOR: ${body.profile?.name || "-"} ${body.profile?.sign ? "(" + body.profile.sign + ")" : ""}\nKNOWLEDGE:\n${(body.context || "").slice(0, 12000)}`;
    /* Gemini, with the key held here rather than in the browser. Set it with
       npx wrangler secret put GEMINI_API_KEY */
    if (env.GEMINI_API_KEY) {
      const sys = (body.lang === "en" ? SYSTEM_EN : SYSTEM_VI) + "\n\n" + knowledge;
      const contents: { role: string; parts: { text: string }[] }[] = [];
      for (const h of (body.history || []).slice(-6)) {
        if (h && h.text) contents.push({ role: h.role === "assistant" ? "model" : "user", parts: [{ text: h.text.slice(0, 2000) }] });
      }
      if (contents.length && contents[contents.length - 1].role === "user") contents.pop();
      contents.push({ role: "user", parts: [{ text: question }] });
      const models = ["gemini-3.5-flash-lite", "gemini-2.5-flash-lite", "gemini-2.0-flash"];
      for (const model of models) {
        try {
          const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(model) + ":generateContent?key=" + encodeURIComponent(env.GEMINI_API_KEY), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ systemInstruction: { parts: [{ text: sys }] }, contents, generationConfig: { temperature: 0.6, maxOutputTokens: 900 } }),
          });
          if (!r.ok) continue;
          const j = (await r.json()) as any;
          const text = (j?.candidates?.[0]?.content?.parts || []).map((p: any) => p.text || "").join("").trim();
          if (text) { keep(text); return new Response(JSON.stringify({ answer: text }), { headers }); }
        } catch { /* try the next model */ }
      }
      return new Response(JSON.stringify({ error: "gemini" }), { status: 502, headers });
    }
    // No Anthropic key: answer with an open model on Workers AI (free tier).
    if (!env.ANTHROPIC_API_KEY && env.AI) {
      const msgs: { role: string; content: string }[] = [{ role: "system", content: (body.lang === "en" ? SYSTEM_EN : SYSTEM_VI) + "\n\n" + knowledge }];
      for (const h of (body.history || []).slice(-6)) if (h && h.text) msgs.push({ role: h.role === "assistant" ? "assistant" : "user", content: h.text.slice(0, 2000) });
      if (msgs[msgs.length - 1].role === "user") msgs.pop();
      msgs.push({ role: "user", content: question });
      try {
        const out = await env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", { messages: msgs, max_tokens: 700 });
        const said = (out.response || "").trim();
        keep(said);
        return new Response(JSON.stringify({ answer: said }), { headers });
      } catch { return new Response(JSON.stringify({ error: "workers-ai" }), { status: 502, headers }); }
    }
    if (!env.ANTHROPIC_API_KEY) return new Response(JSON.stringify({ error: "no provider" }), { status: 500, headers });
    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
    const messages: Anthropic.MessageParam[] = [];
    for (const h of (body.history || []).slice(-6)) {
      if (h && (h.role === "user" || h.role === "assistant") && h.text) messages.push({ role: h.role, content: h.text.slice(0, 2000) });
    }
    if (messages.length && messages[messages.length - 1].role === "user") messages.pop();
    messages.push({ role: "user", content: question });

    try {
      const response = await client.messages.create({
        model: "claude-opus-5",
        max_tokens: 1200,
        thinking: { type: "adaptive" },
        output_config: { effort: "low" },
        system: [
          { type: "text", text: body.lang === "en" ? SYSTEM_EN : SYSTEM_VI, cache_control: { type: "ephemeral" } },
          { type: "text", text: knowledge },
        ],
        messages,
      });
      if (response.stop_reason === "refusal") {
        return new Response(JSON.stringify({ answer: body.lang === "en" ? "I can't help with that one. Try asking about the card, the lesson or your sign." : "Câu này mình không trả lời được. Bạn thử hỏi về lá bài, bài học hay cung của bạn nhé." }), { headers });
      }
      const answer = response.content.filter((b) => b.type === "text").map((b) => (b as Anthropic.TextBlock).text).join("\n").trim();
      keep(answer);
      return new Response(JSON.stringify({ answer }), { headers });
    } catch (error) {
      if (error instanceof Anthropic.RateLimitError) return new Response(JSON.stringify({ error: "busy" }), { status: 429, headers });
      if (error instanceof Anthropic.AuthenticationError) return new Response(JSON.stringify({ error: "key" }), { status: 500, headers });
      if (error instanceof Anthropic.APIError) return new Response(JSON.stringify({ error: `api ${error.status}` }), { status: 502, headers });
      return new Response(JSON.stringify({ error: "unknown" }), { status: 500, headers });
    }
  },
};
