/* Nabu AI — Cloudflare Worker that answers the app's questions with Claude.
   The app never sees the API key: it POSTs { lang, question, context, kind,
   history, profile } here, and this worker calls Claude with a fixed system
   prompt plus the knowledge the app already showed the visitor.
   Deploy: npm install && npx wrangler secret put ANTHROPIC_API_KEY && npx wrangler deploy
   Then put the worker URL into CONFIG.aiEndpoint in src/config.js. */
import Anthropic from "@anthropic-ai/sdk";
import { whoIsAsking } from "./auth";
import { allow, cachedAnswer, keepAnswer } from "./limit";
import { wikiLook } from "./web";
import { checkPurchase, acknowledge, grantUntil, checkSubscription, acknowledgeSub } from "./play";
import type { PlayEnv } from "./play";
import { fsGet } from "./fs";
import { claimCode } from "./codes";
import { claimPurchase, markGranted, sweepRefunds, tokenId, ledgerSet } from "./refunds";
import { itemBySku, itemByKey } from "./catalog";
import { applySubscription, payRoom, noteGranted } from "./entitle";
import { handleRtdn } from "./rtdn";
import { reconcileSubs } from "./reconcile";
import { appleBill, handleAsn, sweepAppleRefunds, appleRevoke } from "./apple";

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
  RTDN_AUDIENCE?: string;      // the /rtdn URL, as given to the Pub/Sub push subscription
  RTDN_PUSH_EMAIL?: string;    // the service account Pub/Sub pushes as
  APPLE_BUNDLE_ID?: string;    // app.nabutarot.ios, for checking App Store purchases
  APPLE_ISSUER_ID?: string;    // the In-App Purchase key's issuer, from App Store Connect
  APPLE_KEY_ID?: string;       // that key's id
  APPLE_PRIVATE_KEY?: string;  // the .p8, as a secret
  APPLE_TEAM_ID?: string;           // for Sign in with Apple
  APPLE_SIWA_KEY_ID?: string;       // the Sign in with Apple key's id
  APPLE_SIWA_PRIVATE_KEY?: string;  // its .p8, as a secret
}

/* What one person may ask in a day.

   Answering costs money, so the allowance follows what somebody has bought.
   A reader with an account and nothing else gets enough to try Nabu AI
   properly and find out whether it is worth having; a reader who has bought
   any one of the three courses gets the same allowance as Pro, which is what
   the owner asked for - buying one course should not feel like a smaller
   version of the same feature.

   The minute is about bursts rather than money: it is the same for everybody
   and only stops a stuck loop or a script.

   These numbers are worth revisiting against whatever is answering. On
   Workers AI's free tier the whole project gets roughly a hundred questions
   a day before requests start failing for everyone, so the per-person
   allowance is not the binding constraint there - the daily total is. */
const ASK_A_DAY_FREE = 5, ASK_A_DAY_PLUS = 20, ASK_A_DAY_PAID = 50, ASK_A_MINUTE = 6;
/* The entitlements that earn the largest allowance: the three courses, and
   Pro - both the six-month and the twelve-month plan, which each open the
   key `pro`. */
const ASK_PAID_KEYS = ["tarot", "lenormand", "playing", "pro"];
/* A rung of its own between the two. Plus is a paid plan, so five questions a
   day reads as broken to somebody who is paying; it is the smaller plan, so it
   does not get what Pro gets. Twenty. `manifest` sits here too: it is bought,
   and it is not a course. Note that Pro opens `plus` as well, so the larger
   allowance has to be looked for first. */
const ASK_PLUS_KEYS = ["plus", "manifest"];
const MAIL_A_DAY = 20, MAIL_A_MINUTE = 3;

interface AskBody {
  lang: "vi" | "en" | "de";
  question: string;
  context: string;
  kind: "card" | "lesson" | "sign" | "numbers" | "general";
  history?: { role: "user" | "assistant"; text: string }[];
  profile?: { name?: string; sign?: string };
}

/* The prompt is three parts: who Nabu AI is and how it speaks, what it may
   answer - which depends on whether the reader has bought something - and the
   limits that hold for everybody.

   The scope used to be one sentence for everyone: answer from the card or the
   lesson, and when a question goes beyond it, say a card cannot answer that.
   Given to Gemini for a reader with Pro, it turned down "when is Lễ Vu Lan in
   2027" as outside tarot - the opposite of what paying for Nabu AI is meant to
   buy. A reader who has bought something now gets an assistant that uses the
   app's knowledge where it applies and answers everything else plainly; a
   reader who has not keeps the app's own knowledge. The CALENDAR the app sends
   counts as that knowledge for both, because it is exact where a model's
   memory of Vietnamese lunar dates is not. */
const VOICE: Record<string, string> = {
  vi: `Bạn là Nabu AI, trợ lý của Nabu Tarot, một reader tarot người Việt. Bạn nói chuyện ấm áp, ngắn gọn, bằng tiếng Việt đời thường (xưng "mình", gọi người dùng là "bạn"). Câu ngắn, mỗi đoạn một ý, không dùng từ hoa mỹ. Bạn là Nabu AI chứ không phải Nabu: Nabu là người xem bài thật, bạn đừng tự xưng là Nabu. Chỉ nhắc đến ngày hôm nay khi người dùng hỏi về ngày tháng.`,
  en: `You are Nabu AI, the assistant of Nabu Tarot, a Vietnamese tarot reader. You speak warmly and briefly in plain English. Short sentences, one idea per paragraph, no flowery words. You are Nabu AI, not Nabu: Nabu is the real reader, so never introduce yourself as Nabu. Only mention today's date when the visitor asks about dates.`,
  de: `Du bist Nabu AI, die Assistenz von Nabu Tarot, einer vietnamesischen Kartenlegerin. Du sprichst warm und knapp in einfachem Deutsch und duzt die Person. Kurze Sätze, ein Gedanke pro Absatz, keine geschwollenen Wörter. Du bist Nabu AI, nicht Nabu: Nabu ist die echte Kartenlegerin, stell dich also nie als Nabu vor. Das heutige Datum erwähnst du nur, wenn die Person nach einem Datum fragt.`,
};
const SCOPE_FREE: Record<string, string> = {
  vi: `Bạn trả lời dựa trên PHẦN KIẾN THỨC được cung cấp (lá bài, bài học, cung hoàng đạo hoặc các con số của người dùng). Phần CALENDAR cũng là kiến thức của app: câu hỏi về hôm nay, ngày lễ hay ngày âm dương thì bạn trả lời đúng theo phần đó. Khi câu hỏi vượt ngoài những phần này, bạn nói thẳng là một lá bài hay một cung không trả lời được, và gợi ý người dùng đặt lịch xem bài đầy đủ với Nabu.`,
  en: `Answer from the KNOWLEDGE section provided (the card, the lesson, the visitor's sign or numbers). The CALENDAR section is the app's knowledge too: questions about today, a festival or a lunar date are answered exactly from it. When a question goes beyond these, say plainly that one card or one sign cannot answer that, and suggest booking a full reading with Nabu.`,
  de: `Du antwortest aus dem Abschnitt KNOWLEDGE (die Karte, die Lektion, das Sternzeichen oder die Zahlen der Person). Der Abschnitt CALENDAR gehört ebenfalls zum Wissen der App: Fragen zu heute, zu einem Fest oder einem Mondkalenderdatum beantwortest du genau danach. Wenn eine Frage darüber hinausgeht, sag klar, dass eine einzelne Karte oder ein einzelnes Sternzeichen das nicht beantworten kann, und schlag eine ausführliche Legung bei Nabu vor.`,
};
const SCOPE_PAID: Record<string, string> = {
  vi: `Với câu hỏi về lá bài, bài học, cung hoàng đạo hay các con số, bạn dựa vào PHẦN KIẾN THỨC được cung cấp. Với những câu hỏi khác – ngày lễ, lịch âm dương, kiến thức phổ thông, giải thích một điều gì đó, dịch hay viết một đoạn ngắn – bạn trả lời thẳng và chính xác, không từ chối chỉ vì câu hỏi không liên quan đến tarot. Ngày tháng thì luôn lấy theo phần CALENDAR, vì phần đó được tính theo lịch âm Việt Nam. Nếu không chắc chắn, bạn nói rõ là mình không chắc.`,
  en: `For questions about the card, the lesson, the visitor's sign or numbers, use the KNOWLEDGE section provided. Answer other questions too - festivals, lunar and solar dates, general knowledge, explaining something, translating or writing a short passage - directly and accurately; do not turn a question down only because it is not about tarot. Always take dates from the CALENDAR section, which follows the Vietnamese lunar calendar. If you are not sure of something, say so.`,
  de: `Bei Fragen zur Karte, zur Lektion, zum Sternzeichen oder zu den Zahlen der Person nutzt du den Abschnitt KNOWLEDGE. Auch andere Fragen beantwortest du – Feste, Mond- und Sonnendaten, Allgemeinwissen, Erklärungen, Übersetzungen oder einen kurzen Text – direkt und genau; lehne eine Frage nicht nur deshalb ab, weil sie nichts mit Tarot zu tun hat. Daten nimmst du immer aus dem Abschnitt CALENDAR, der dem vietnamesischen Mondkalender folgt. Wenn du dir bei etwas nicht sicher bist, sag es.`,
};
const LIMITS: Record<string, string> = {
  vi: `Bạn không chẩn đoán bệnh, không tư vấn pháp lý hay đầu tư cụ thể, không hứa điều gì chắc chắn xảy ra. Bạn không nhắc đến tên nguồn, sách hay kênh nào. Trả lời trong 4 đến 8 câu, trừ khi người dùng hỏi giải thích bài học thì có thể dài hơn một chút.`,
  en: `No medical diagnosis, no specific legal or investment advice, no promises that something will certainly happen. Never name sources, books or channels. Answer in 4 to 8 sentences, a little longer only when explaining a lesson.`,
  de: `Keine medizinischen Diagnosen, keine konkrete Rechts- oder Anlageberatung, keine Versprechen, dass etwas sicher eintritt. Nenne niemals Quellen, Bücher oder Kanäle. Antworte in 4 bis 8 Sätzen, nur beim Erklären einer Lektion etwas länger.`,
};
/* German used to fall through to the Vietnamese prompt, because the choice was
   written as "English, or else Vietnamese" back when there were two languages.
   A German reader was answered in Vietnamese by a prompt they could not read. */
/* One scope for everyone now. The narrow one was there to keep a reader who
   had bought nothing from spending the allowance on questions that were not
   about the app, and what it actually did was refuse them: somebody asking
   when a festival falls was told a card cannot answer that, by an assistant
   that knew perfectly well. Both allowances are free; a refusal costs the
   same request as an answer and reads as a broken app. */
export const systemFor = (lang: string, paid = false): string => {
  const lg = lang === "en" || lang === "de" ? lang : "vi";
  void paid;
  return [VOICE[lg], SCOPE_PAID[lg], LIMITS[lg]].join("\n");
};
/* Set for an hour when Google refuses a search for quota; while it exists,
   paying readers are answered by Gemini without search. */
const SEARCH_OFF_KEY = "ai:search-off";
/* What to call the list of pages an answer leaned on. */
const SOURCES_WORD: Record<string, string> = { vi: "Tham khảo", de: "Quellen", en: "Sources" };

/* Whether this person has bought something that counts.

   It decides two things: the daily allowance, and whether Nabu AI may search
   the web for them. `users/{uid}.access` holds one ISO date per opened key, written by this
   worker when a purchase is checked and by the dashboard for a code. A key
   counts while its date has not passed - the same test the app makes in
   ACCESS.has(), so the phone and the worker never disagree about who has
   bought what.

   Nabu asks with the same account she answers from, and every course is open
   to her by definition, so she lands on the larger allowance through the
   ordinary path with no special case here.

   A read that fails counts as not paid. That is the safe direction: somebody
   who has paid and is wrongly given five questions without search is annoyed
   and writes in, which is recoverable; the other way round, an outage becomes
   an open bar. */
export type Tier = "free" | "plus" | "paid";
export const tierOfAccess = (access: Record<string, unknown>, today: string): Tier => {
  const held = (k: string) => { const until = String(access[k] || ""); return !!until && until.slice(0, 10) >= today; };
  if (ASK_PAID_KEYS.some(held)) return "paid";
  if (ASK_PLUS_KEYS.some(held)) return "plus";
  return "free";
};
const ASK_A_DAY: Record<Tier, number> = { free: ASK_A_DAY_FREE, plus: ASK_A_DAY_PLUS, paid: ASK_A_DAY_PAID };

async function tierOf(env: Env, uid: string): Promise<Tier> {
  try {
    const doc = await fsGet(env as unknown as PlayEnv, "users/" + uid);
    const access = (doc && (doc.access as Record<string, unknown>)) || {};
    const d = new Date();
    const today = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    return tierOfAccess(access, today);
  } catch (e) {
    console.error(JSON.stringify({ at: "ai", uid, tier: "read failed, treating as free", error: String(e) }));
  }
  return "free";
}

/* ---- the two free answering services ----

   Each returns the words, or why it has none. "Not configured" is neither -
   an empty object - so a service that was never set up does not overwrite
   the reason a real attempt gave. */
/* partial: the model stopped before it finished (a token ceiling, a safety
   stop). Shown, because something beats nothing, but never cached. */
type Said = { text?: string; why?: string; partial?: boolean };
type Turn = { role: string; parts: { text: string }[] };

function history(body: AskBody, question: string): Turn[] {
  const out: Turn[] = [];
  for (const h of (body.history || []).slice(-6)) {
    if (h && h.text) out.push({ role: h.role === "assistant" ? "model" : "user", parts: [{ text: h.text.slice(0, 2000) }] });
  }
  if (out.length && out[out.length - 1].role === "user") out.pop();
  out.push({ role: "user", parts: [{ text: question }] });
  return out;
}

/* Gemini, optionally with Google Search.

   Search is what lets a paying reader ask about something the app's own
   knowledge does not hold - a piece of news, anything after the model's
   training. It needs billing on the key's Google project: without it, Google
   answers 429 to the first search of the day as readily as the thousandth
   (seen 13 September 2026, on a key made that day - the free 500 a day the
   pricing page lists belonged to the 2.5 models, which new keys cannot use).
   A refused search switches search off for an hour (SEARCH_OFF_KEY) and the
   reader is answered without it. Gemini without search still knows dates,
   festivals and most general facts up to its training, which is most of what
   a tarot reader is asked. */
/* What counts as a question worth thinking about. Length alone is a poor
   judge - "vì sao lá này lại ngược với lá kia?" is short and needs reasoning,
   while a long one can be a greeting with a name in it - so the words that ask
   for a reason or a comparison decide, and a conversation that has already run
   a few turns counts too, because by then the reader is working something out
   rather than asking one thing. */
const HARD_WORDS = /(vì sao|tại sao|vi sao|tai sao|so sánh|so sanh|phân tích|phan tich|nên chọn|nen chon|khác nhau|khac nhau|ý nghĩa sâu|giải thích|giai thich|liên quan|lien quan|why|how come|compare|difference|analyse|analyze|explain|should i|warum|wieso|vergleich|unterschied|erklär|erklar)/i;
export const isHard = (body: { history?: { role: string; text: string }[] }, question: string): boolean =>
  HARD_WORDS.test(question) || question.trim().length > 140 || ((body.history || []).length >= 4);

async function gemini(env: Env, sys: string, body: AskBody, question: string, search: boolean): Promise<Said> {
  if (!env.GEMINI_API_KEY) return {};
  /* maxOutputTokens covers the model's thinking as well as its answer on the
     Gemini 3 models, and 900 was spent thinking: answers came back cut off
     mid-word ("rơi vào ngày **2"). The system prompt keeps the answer itself to
     a few sentences; this is only the ceiling. */
  /* A question that has to be reasoned about gets a model that reasons, and
     one that wants a card's meaning gets the fast one. Thinking is free on
     both - it is spent in tokens, and the tokens are inside an allowance
     nobody is billed for - so the only price of "high" is seconds. */
  const hard = isHard(body, question);
  const base = { systemInstruction: { parts: [{ text: sys }] }, contents: history(body, question),
    generationConfig: { temperature: 0.6, maxOutputTokens: 8192, thinkingConfig: { thinkingLevel: hard ? "high" : "low" } } };
  let why = "";
  /* Flash-Lite first, for speed. Measured on 13 September 2026 with the
     calendar context the app sends: gemini-3.6-flash took 5-6 seconds to answer
     a short tarot or date question whatever its thinking level, and
     gemini-3.5-flash-lite 0.9-1.4 seconds, with the same dates right and the
     same readings. Flash stays as the fallback.

     The models Google names itself. The 2.5 models answer 404 to any key made
     after they were retired - "no longer available to new users. Please update
     your code to use models/gemini-3.6-flash" - and a key made on 13 September
     2026 is exactly that, so every paid question fell through to Workers AI,
     which cannot search and invented a date. If Google retires these too, the
     404 names their successor in the worker's logs (wrangler tail). */
  for (const model of (hard ? ["gemini-3.6-flash", "gemini-3.5-flash-lite"] : ["gemini-3.5-flash-lite", "gemini-3.6-flash"])) {
    try {
      const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(model) + ":generateContent?key=" + encodeURIComponent(env.GEMINI_API_KEY), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(search ? { ...base, tools: [{ google_search: {} }] } : base),
      });
      if (!r.ok) {
        why = "gemini " + r.status + (search ? " with search" : "") + " on " + model;
        /* Long enough to keep Google's quota details, which name the exact
           limit a 429 hit and come after the message. */
        console.error(JSON.stringify({ at: "ai", model, search, status: r.status, said: (await r.text()).slice(0, 3000) }));
        /* A search refused for quota is refused for every model on the key -
           they share it - so there is no point asking the next one. And on a
           key with no billing the allowance is not merely spent but absent:
           Google refused the first search of the day on 13 September 2026. So
           search is switched off for an hour rather than costing every paying
           reader two refused round trips before their answer; if billing is
           ever enabled, it comes back by itself within that hour. */
        if (search && r.status === 429) {
          if (env.KV) await env.KV.put(SEARCH_OFF_KEY, "1", { expirationTtl: 3600 }).catch(() => {});
          return { why };
        }
        continue;
      }
      const j = (await r.json()) as any;
      const cand = j?.candidates?.[0];
      const text = (cand?.content?.parts || []).map((p: any) => p.text || "").join("").trim();
      if (!text) { why = "gemini answered nothing on " + model; continue; }
      /* A cut-off answer is still returned - it is better than nothing - but
         said, so a ceiling that is too low shows up in the logs, and it is not
         cached, so a reader asking again gets a fresh try. */
      const partial = !!cand?.finishReason && cand.finishReason !== "STOP";
      if (partial) console.error(JSON.stringify({ at: "ai", model, search, finishReason: cand.finishReason }));
      /* Where it looked, so a reader can tell a searched answer from a card
         reading - named the way the app names things elsewhere. */
      const pages = ((cand?.groundingMetadata?.groundingChunks || []) as any[]).map((c) => c?.web).filter(Boolean).slice(0, 3);
      return { partial, text: text + (pages.length ? "\n\n" + (SOURCES_WORD[body.lang] || SOURCES_WORD.en) + ": " + pages.map((c: any) => c.title || c.uri).join(" · ") : "") };
    } catch (e) {
      why = "gemini threw on " + model + ": " + String((e as Error).message || e);
      console.error(JSON.stringify({ at: "ai", model, search, error: String(e) }));
    }
  }
  return { why };
}

/* Llama on Workers AI: no key, no search, Cloudflare's free Neurons. */
async function workersAi(env: Env, sys: string, body: AskBody, question: string): Promise<Said> {
  if (!env.AI) return {};
  const msgs = [{ role: "system", content: sys }].concat(
    history(body, question).map((t) => ({ role: t.role === "model" ? "assistant" : "user", content: t.parts[0].text })));
  try {
    const out = await env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", { messages: msgs, max_tokens: 700 });
    const text = (out.response || "").trim();
    return text ? { text } : { why: "workers-ai answered nothing" };
  } catch (e) {
    console.error(JSON.stringify({ at: "ai", model: "workers-ai", error: String(e) }));
    return { why: "workers-ai: " + String((e as Error).message || e) };
  }
}

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
    if (path.endsWith("/rtdn")) return handleRtdn(request, env);
    /* The App Store's notifications. Counted by address like the mail endpoints, generously - Apple sends
       bursts - so a flood of forged ones cannot turn into a flood of calls to Apple. */
    if (path.endsWith("/asn")) {
      const v = await allow(env, "asn:" + caller(request), 20000, 600);
      if (!v.ok) return tooMany(v, headers);
      return handleAsn(request, env);
    }
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
    /* ---- an account signed in with Apple is being deleted: revoke the Apple sign-in (apple.ts) ---- */
    if (path.endsWith("/apple-revoke")) {
      if (!env.FIREBASE_PROJECT_ID) return new Response(JSON.stringify({ error: "not configured" }), { status: 500, headers });
      const person = await whoIsAsking(request, env.FIREBASE_PROJECT_ID);
      if (!person) return new Response(JSON.stringify({ error: "signin" }), { status: 401, headers });
      const v = await allow(env, "revoke:" + person.uid, 10, 3);
      if (!v.ok) return tooMany(v, headers);
      let b: { code?: string };
      try { b = await request.json(); } catch { return new Response(JSON.stringify({ error: "bad json" }), { status: 400, headers }); }
      try { const a = await appleRevoke(env, person, String(b.code || "")); return new Response(JSON.stringify(a.body), { status: a.status, headers }); }
      catch (e) { console.error(JSON.stringify({ at: "apple-revoke", uid: person.uid, error: String((e as Error).message || e) })); return new Response(JSON.stringify({ error: "revoke failed" }), { status: 502, headers }); }
    }

    if (path.endsWith("/billing")) {
      if (!env.FIREBASE_PROJECT_ID) return new Response(JSON.stringify({ error: "not configured" }), { status: 500, headers });
      const person = await whoIsAsking(request, env.FIREBASE_PROJECT_ID);
      if (!person) return new Response(JSON.stringify({ error: "signin" }), { status: 401, headers });
      const v = await allow(env, person.uid, 40, 6);
      if (!v.ok) return tooMany(v, headers);

      let b: { sku?: string; token?: string; wid?: string; store?: string };
      try { b = await request.json(); } catch { return new Response(JSON.stringify({ error: "bad json" }), { status: 400, headers }); }
      /* Bought in the iPhone app: the App Store is asked instead of Google (apple.ts), and everything it
         grants goes through the same ledger and the same account writes as a Play purchase. */
      if (b.store === "apple") {
        try { const a = await appleBill(env, person.uid, b); return new Response(JSON.stringify(a.body), { status: a.status, headers }); }
        catch (e) { console.error(JSON.stringify({ at: "billing", store: "apple", uid: person.uid, error: String((e as Error).message || e) })); return new Response(JSON.stringify({ error: "check failed" }), { status: 502, headers }); }
      }
      const sku = String(b.sku || ""), token = String(b.token || ""), wid = String(b.wid || "");
      const item = itemBySku(sku);
      if (!item || !token) return new Response(JSON.stringify({ error: "unknown product" }), { status: 400, headers });
      if (item.key === "wedding" && !wid) return new Response(JSON.stringify({ error: "no room" }), { status: 400, headers });
      const say = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers });
      const log = (rec: Record<string, unknown>) => console.log(JSON.stringify({ at: "billing", uid: person.uid, sku, ...rec }));
      /* A 404 from Google is a real answer: no such purchase. Anything else -
         500, 503, a timeout surfaced by checkPurchase/checkSubscription as
         "play <status>" - is Google's outage, not the buyer's fault. Reading
         that as "invalid purchase" would refuse a paying customer for a
         problem on our side, which is the one mistake this endpoint must
         never make. It is answered with a 5xx instead, so the phone retries. */
      const transient = (why?: string): boolean => !!why && why.indexOf("play ") === 0;
      /* One immediate extra try for a write whose failure this handler would
         otherwise have to answer with a 502: it costs nothing (the write is a
         plain merge PATCH, safe to repeat) and clears most one-off blips
         before the phone ever has to make a whole new round trip. It does
         not close the window where the room is paid but not yet recorded -
         only the phone's retry, once this does answer 502, can do that -
         it just makes reaching that window less likely. */
      const onceMore = async <T>(fn: () => Promise<T>): Promise<T> => { try { return await fn(); } catch { return await fn(); } };

      try {
        /* ---- a subscription: Google's state is the state ---- */
        if (item.kind === "subs") {
          const got = await checkSubscription(env, token);
          if (!got.ok || !got.sub) {
            if (transient(got.why)) { log({ transient: got.why }); return say(502, { error: got.why }); }
            log({ refused: got.why }); return say(402, { error: got.why || "refused" });
          }
          const sub = got.sub;
          if (sub.productId !== sku) { log({ refused: "product mismatch", product: sub.productId }); return say(402, { error: "product mismatch" }); }
          if (sub.state === "SUBSCRIPTION_STATE_PENDING") return say(202, { pending: true });
          const claim = await claimPurchase(env, person.uid, sku, item.opens, token, { kind: "subs" });
          if (!claim.ok) { log({ refused: claim.why }); return say(402, { error: claim.why || "already used" }); }
          const hash = await tokenId(token);
          const out = await applySubscription(env, person.uid, item, sub, hash);
          await markGranted(env, token, { state: sub.state, plan: sub.basePlanId }).catch((e) => log({ ledger: String(e) }));
          const opened = out.subs[item.key].grant ? item.opens : [];
          if (!sub.acknowledged && opened.length) ctx.waitUntil(acknowledgeSub(env, sku, token));
          log({ granted: opened, state: sub.state });
          return say(200, { ok: true, opened, access: out.access, subs: out.subs });
        }

        /* ---- a one-time purchase ---- */
        const bought = await checkPurchase(env, sku, token);
        if (!bought.ok) {
          if (bought.why === "pending") return say(202, { pending: true });
          if (transient(bought.why)) { log({ transient: bought.why }); return say(502, { error: bought.why }); }
          log({ refused: bought.why }); return say(402, { error: bought.why || "refused" });
        }

        if (item.key === "wedding") {
          /* The token is claimed WITH its wid this time. For a fresh token
             that one write is atomic - claimPurchase's own
             currentDocument.exists=false create either lands the whole row,
             wid included, or nothing at all - so a payment that succeeds on
             its first try never passes through a moment where the room is
             paid but no record exists of which one. A wrong guess still
             costs nothing: if payRoom then refuses it, the wid is taken back
             off the row below, so a later, correct room can still be tried
             against the very same claim. Only a room payRoom actually
             accepted stays bound - and from that moment claimPurchase's own
             mismatch check refuses a different wid on this token by itself,
             with nothing further to reimplement here. */
          const claim = await claimPurchase(env, person.uid, sku, item.opens, token, { kind: "inapp", wid });
          if (!claim.ok) { log({ refused: claim.why }); return say(402, { error: claim.why || "already used" }); }
          const hash = await tokenId(token);
          const paid = await payRoom(env, person.uid, wid, hash);
          if (!paid.ok) {
            /* This guess paid nothing. Left bound, it would refuse a later,
               correct room as "already used" for a payment that never
               happened - so it is taken back off the row. If even that
               cannot be made to land, the room's own refusal is not handed
               back as final: a stuck wid is worse than one extra round trip,
               so this answers 502 and lets the phone try again. */
            try { await onceMore(() => ledgerSet(env, hash, { wid: "" })); }
            catch (e) { log({ ledger: String(e), refused: paid.why, wid }); return say(502, { error: "check failed" }); }
            log({ refused: paid.why, wid }); return say(paid.why === "not yours" ? 403 : 409, { error: paid.why });
          }
          /* For a fresh claim the wid is already on the row, written in the
             same atomic step as the claim itself - this write only needs to
             move state to "granted". For a retry of a claim whose wid was
             just cleared above, it is not yet on the row, so this write is
             what puts it there. Either way it is never swallowed: a paid
             room with no wid on record - the exact failure mode this whole
             design exists to prevent - is exactly what silently accepting
             its failure would produce. */
          await onceMore(() => ledgerSet(env, hash, { wid, state: "granted" }));
          /* Unconditional, on purpose: a first acknowledge that failed (a
             dropped waitUntil, a Play hiccup) must still be retried on the
             next call for the same token, or Google auto-refunds an
             unacknowledged purchase after three days. Acknowledging twice is
             harmless - it is not acknowledging once that costs money. */
          ctx.waitUntil(acknowledge(env, sku, token));
          log({ granted: ["wedding"], wid });
          return say(200, { ok: true, opened: ["wedding"], wid });
        }

        /* A course. The token is claimed before anything is opened. Google
           refuses a token it has already handed over, but handing it over
           happens after the access is written, and in that gap the same
           token would open the course for a second account as well. The
           claim closes the gap, and it doubles as the ledger row the nightly
           refund sweep needs. */
        const claim = await claimPurchase(env, person.uid, sku, item.opens, token, { kind: "inapp" });
        if (!claim.ok) { log({ refused: claim.why }); return say(402, { error: claim.why || "already used" }); }

        /* The date is decided once and written to the ledger; a retry reads
           it back rather than adding another six months. */
        let until = claim.existing && claim.existing.until;
        if (!until) { const d = new Date(); d.setMonth(d.getMonth() + item.months); until = d.toISOString().slice(0, 10); }
        const want: Record<string, string> = {};
        for (const k of item.opens) want[k] = until;
        const access = await grantUntil(env, person.uid, want);
        await markGranted(env, token, { until }).catch((e) => log({ ledger: String(e) }));
        /* Unconditional, exactly as on the wedding path above. Guarded by
           `!claim.existing`, a first acknowledge that failed - a dropped
           waitUntil, a Play hiccup, and acknowledge() does not look at the
           status either way - could never be retried: every later attempt
           with the same token saw its own claim already on the ledger and
           skipped it. Google auto-refunds an unacknowledged purchase after
           three days, and the refund sweep then takes the course back off
           somebody who believes they bought it. Acknowledging twice is
           harmless; acknowledging once is what costs money. */
        ctx.waitUntil(acknowledge(env, sku, token));
        log({ granted: item.opens, until });
        return say(200, { ok: true, opened: item.opens, access });
      } catch (e) {
        console.error(JSON.stringify({ at: "billing", uid: person.uid, sku, error: String((e as Error).message || e) }));
        return say(502, { error: "check failed" });
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
        /* opens is [] for a wedding code (a wedding opens no access key, it
           pays a room) - and [] is truthy, so `opens || [got.course]` would
           silently pick the empty array and open nothing at all. */
        const opens = itemByKey(got.course)?.opens;
        const ids = opens && opens.length ? opens : [got.course];
        const want: Record<string, string> = {};
        for (const id of ids) want[id] = got.until;
        /* The provenance FIRST, then the access.

           `manifest`, `plus` and `pro` are sold on the website as well as on
           Play, and once a subscription row names one of them the recompute
           rebuilds it from Play alone unless something says otherwise.
           `granted` is that something. Written before `access` on purpose: if
           the second write fails the customer is told so and retries (the
           code is already bound to them, so it still works), and at no moment
           does `access` hold a code grant that `granted` has no record of -
           which is the one state in which a later subscription event could
           quietly shorten it. A course code writes nothing here. */
        await noteGranted(env, person.uid, want);
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
    /* Where the time goes, stage by stage, in the logs and in a response
       header - so "Nabu AI is slow" can be answered with numbers rather than
       guesses. */
    const T0 = Date.now(), marks: Record<string, number> = {};
    const mark = (k: string): void => { marks[k] = Date.now() - T0; };
    const timed = (via: string, extra: Record<string, string> = {}): Record<string, string> => {
      const t = { via, ...marks, total: Date.now() - T0 };
      console.log(JSON.stringify({ at: "ai-timing", ...t }));
      return { ...headers, "X-Nabu-Timing": JSON.stringify(t), ...extra };
    };
    let who = "";
    if (env.FIREBASE_PROJECT_ID) {
      const person = await whoIsAsking(request, env.FIREBASE_PROJECT_ID);
      if (!person) return new Response(JSON.stringify({ error: "signin" }), { status: 401, headers });
      who = person.uid;
    } else {
      who = caller(request);
    }
    mark("auth");
    /* Paid or not, read once: it sets the allowance and whether the answer may
       search. Asking requires an account, so `who` is a uid here. */
    const tier: Tier = env.FIREBASE_PROJECT_ID ? await tierOf(env, who) : "paid";
    /* What the answer may do - search the web, and the wider scope - stays
       with the courses and Pro. The rung in the middle buys more questions,
       not a different answer. */
    const paid = tier === "paid";
    mark("tier");
    const verdict = await allow(env, who, ASK_A_DAY[tier], ASK_A_MINUTE);
    mark("allow");
    if (!verdict.ok) return tooMany(verdict, headers);
    /* How many questions are left today, sent with every answer: the app says
       it under the reply, so the last question does not come as a surprise. */
    const left = verdict.left;

    let body: AskBody;
    try { body = (await request.json()) as AskBody; } catch { return new Response(JSON.stringify({ error: "bad json" }), { status: 400, headers }); }
    const question = (body.question || "").trim().slice(0, 1000);
    if (!question) return new Response(JSON.stringify({ error: "empty question" }), { status: 400, headers });

    /* The same question with nothing said before it has the same answer for
       everybody on the same tier, and the card meanings are asked all day.
       The tiers are cached apart: a paying reader's answer may have searched
       the web, and handing that to a reader with nothing bought would give
       away the one thing paying buys; the other way round, a paying reader
       would be served a knowledge-only answer they did not ask for. */
    const fresh = !(body.history || []).length;
    /* gen: bumped whenever answers already in the cache should stop being
       served. 2 - every paid answer cached before it was written by Workers AI
       while Gemini was answering 404, without search, and at least one of them
       gave a wrong date for Tết Trung Thu. */
    /* 3 - Gemini's first answers were cut off by a 900-token ceiling that its
       thinking had used up, and were cached. */
    /* 4 - the prompt stopped telling Gemini to turn down questions that are not
       about tarot for readers who have paid; their cached refusals go. */
    /* 5 - Flash-Lite answers first, and the prompt stops it opening unrelated
       answers with today's date or calling itself Nabu. */
    /* 6 - one scope for everyone, so the free tier's narrower answers go; and
       a Wikipedia lookup now sits behind a miss, so what is cached is the
       answer that lookup produced. */
    const cacheKey = { gen: 6, lang: body.lang, kind: body.kind, question, context: (body.context || "").slice(0, 12000), tier: "all" };
    if (fresh) {
      const hit = await cachedAnswer(cacheKey);
      mark("cache");
      if (hit) return new Response(JSON.stringify({ answer: hit, left }), { headers: timed("cache") });
    }
    const keep = (answer: string): void => { if (fresh && answer) keepAnswer(cacheKey, answer, ctx); };

    /* One free lookup of the open web, since grounding with Google Search is
       shut to a key with no billing account. It is background: the model is
       told to use it only where it answers the question, and a slow or empty
       Wikipedia simply leaves it out. */
    const web = await wikiLook(body.lang || "vi", question);
    mark("web");
    const knowledge = `KIND: ${body.kind}\nVISITOR: ${body.profile?.name || "-"} ${body.profile?.sign ? "(" + body.profile.sign + ")" : ""}\nKNOWLEDGE:\n${(body.context || "").slice(0, 12000)}`
      + (web ? `\n\nWEB (Wikipedia, background only - use it where it answers the question, ignore it where it does not, and never name it):\n${web}` : "");
    const sys = systemFor(body.lang, paid) + "\n\n" + knowledge;

    /* Who answers, in order - and none of it costs money.

         paid:  Gemini with Google Search -> Gemini without it -> Workers AI
         free:  Workers AI -> Gemini without search

       Two separate free allowances, used deliberately: Cloudflare's daily
       Neurons carry the readers who have bought nothing, so they never spend
       Google's search requests, which are the thing a paying reader is owed.
       Each falls back on the other when its own allowance runs out.

       Nothing here can run up a bill by itself. With no billing account on the
       Google project the key belongs to, and Workers on the Free plan, running
       out of an allowance is a refusal and never a charge - the fallback is
       the next line, and past the last one the reader is told the AI is busy,
       which by then is true. */
    const searchOff = env.KV ? !!(await env.KV.get(SEARCH_OFF_KEY).catch(() => null)) : false;
    mark("searchflag");
    const order: [string, () => Promise<Said>][] = paid
      ? (searchOff ? [] : [["gemini-search", () => gemini(env, sys, body, question, true)] as [string, () => Promise<Said>]])
          .concat([["gemini", () => gemini(env, sys, body, question, false)], ["workers-ai", () => workersAi(env, sys, body, question)]])
      : [["workers-ai", () => workersAi(env, sys, body, question)], ["gemini", () => gemini(env, sys, body, question, false)]];
    let why = "";
    for (const [label, attempt] of order) {
      const got = await attempt();
      mark(label);
      if (got.text) { if (!got.partial) keep(got.text); return new Response(JSON.stringify({ answer: got.text, left }), { headers: timed(label) }); }
      if (got.why) why = got.why;
    }

    if (!env.ANTHROPIC_API_KEY) {
      /* Nothing configured at all is not "busy": it is a 503 the app names, so
         the reader is told Nabu AI is not switched on. */
      if (!env.GEMINI_API_KEY && !env.AI) {
        console.error(JSON.stringify({ at: "ai", giving_up: "no provider: no GEMINI_API_KEY, no ANTHROPIC_API_KEY, no AI binding" }));
        return new Response(JSON.stringify({ error: "no-provider" }), { status: 503, headers });
      }
      /* Something is configured and every allowance is spent or failing. */
      console.error(JSON.stringify({ at: "ai", giving_up: why, paid }));
      return new Response(JSON.stringify({ error: "busy", why }), { status: 502, headers });
    }
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
        /* The card text is in KNOWLEDGE; this is for everything else the
           reader might ask about that is not in it. */
        tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 3 }],
        /* Server-side fallbacks on a refusal would be better than the fixed
           line below, but this worker is pinned to @anthropic-ai/sdk 0.90,
           which has no `fallbacks` parameter - it typechecks as an unknown
           property. Worth adding with the next SDK bump; until then the
           refusal is answered in the reader's own language further down. */
        system: [
          { type: "text", text: systemFor(body.lang, paid), cache_control: { type: "ephemeral" } },
          { type: "text", text: knowledge },
        ],
        messages,
      });
      if (response.stop_reason === "refusal") {
        const said = body.lang === "en" ? "I can't help with that one. Try asking about the card, the lesson or your sign."
          : body.lang === "de" ? "Damit kann ich dir nicht helfen. Frag mich lieber etwas zur Karte, zur Lektion oder zu deinem Sternzeichen."
          : "Câu này mình không trả lời được. Bạn thử hỏi về lá bài, bài học hay cung của bạn nhé.";
        return new Response(JSON.stringify({ answer: said, left }), { headers });
      }
      const answer = response.content.filter((b) => b.type === "text").map((b) => (b as Anthropic.TextBlock).text).join("\n").trim();
      keep(answer);
      return new Response(JSON.stringify({ answer, left }), { headers });
    } catch (error) {
      if (error instanceof Anthropic.RateLimitError) return new Response(JSON.stringify({ error: "busy" }), { status: 429, headers });
      if (error instanceof Anthropic.AuthenticationError) return new Response(JSON.stringify({ error: "key" }), { status: 500, headers });
      if (error instanceof Anthropic.APIError) return new Response(JSON.stringify({ error: `api ${error.status}` }), { status: 502, headers });
      return new Response(JSON.stringify({ error: "unknown" }), { status: 500, headers });
    }
  },

  /* ---- every six hours: anything Google refunded taken back, every live
     subscription re-read ----

     A buyer can refund within 48 hours and Nabu can refund from the Console at
     any time, and neither of those tells this worker anything. So this asks
     Google what was voided and closes what those purchases opened. It also
     re-reads every subscription this worker has ever seen and not yet written
     off, and re-applies Google's answer - the safety net for any RTDN this
     worker missed or lost, and the repair for a lost users/{uid}.subs row.

     Both run every time, and neither's failure stops the other: a scheduled
     handler that throws is a red mark in a dashboard nobody opens; one that
     logs says what happened in a place the logs already go. */
  async scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil((async () => {
      try { console.log(JSON.stringify({ at: "refund-sweep", ...(await sweepRefunds(env)) })); }
      catch (e) { console.error(JSON.stringify({ at: "refund-sweep", error: String((e as Error).message || e) })); }
      try { console.log(JSON.stringify({ at: "reconcile", ...(await reconcileSubs(env)) })); }
      catch (e) { console.error(JSON.stringify({ at: "reconcile", error: String((e as Error).message || e) })); }
      try { console.log(JSON.stringify({ at: "apple-refund-sweep", ...(await sweepAppleRefunds(env)) })); }
      catch (e) { console.error(JSON.stringify({ at: "apple-refund-sweep", error: String((e as Error).message || e) })); }
    })());
  },
};
