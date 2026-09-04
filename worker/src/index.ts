/* Nabu AI — Cloudflare Worker that answers the app's questions with Claude.
   The app never sees the API key: it POSTs { lang, question, context, kind,
   history, profile } here, and this worker calls Claude with a fixed system
   prompt plus the knowledge the app already showed the visitor.
   Deploy: npm install && npx wrangler secret put ANTHROPIC_API_KEY && npx wrangler deploy
   Then put the worker URL into CONFIG.aiEndpoint in src/config.js. */
import Anthropic from "@anthropic-ai/sdk";

export interface Env {
  ANTHROPIC_API_KEY?: string;
  AI?: { run: (model: string, input: unknown) => Promise<{ response?: string }> }; // Workers AI binding (free tier, open models)
  ALLOWED_ORIGIN?: string; // e.g. https://angelale0211.github.io
  RESEND_API_KEY?: string; // for /booking: mails the reader a calendar invitation
}

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
  "Access-Control-Allow-Headers": "Content-Type",
});

/* Build an iCalendar invitation for a booking and mail it (Resend). Outlook and
   most mail apps add a METHOD:REQUEST invitation to the calendar on arrival. */
async function bookingMail(request: Request, env: Env, headers: Record<string, string>): Promise<Response> {
  if (!env.RESEND_API_KEY) return new Response(JSON.stringify({ error: "no mail key" }), { status: 500, headers });
  let b: { booking: Record<string, string>; tz?: string; to?: string; lang?: string };
  try { b = await request.json(); } catch { return new Response(JSON.stringify({ error: "bad json" }), { status: 400, headers }); }
  const bk = b.booking || {}, to = (b.to || "").trim();
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
    from: "Nabu Tarot <onboarding@resend.dev>", to: [to], subject: summary,
    text: desc + "\n\nLịch hẹn đã được thêm vào lịch (file .ics đính kèm).",
    attachments: [{ filename: "nabu-booking.ics", content: btoa(unescape(encodeURIComponent(ics))), content_type: "text/calendar; method=REQUEST" }],
  }) });
  if (!r.ok) return new Response(JSON.stringify({ error: "mail " + r.status }), { status: 502, headers });
  return new Response(JSON.stringify({ ok: true }), { headers });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const headers = { ...cors(request.headers.get("Origin") || undefined, env), "Content-Type": "application/json" };
    if (request.method === "OPTIONS") return new Response(null, { headers });
    if (request.method !== "POST") return new Response(JSON.stringify({ error: "POST only" }), { status: 405, headers });
    if (new URL(request.url).pathname.endsWith("/booking")) return bookingMail(request, env, headers);
    let body: AskBody;
    try { body = (await request.json()) as AskBody; } catch { return new Response(JSON.stringify({ error: "bad json" }), { status: 400, headers }); }
    const question = (body.question || "").trim().slice(0, 1000);
    if (!question) return new Response(JSON.stringify({ error: "empty question" }), { status: 400, headers });

    const knowledge = `KIND: ${body.kind}\nVISITOR: ${body.profile?.name || "-"} ${body.profile?.sign ? "(" + body.profile.sign + ")" : ""}\nKNOWLEDGE:\n${(body.context || "").slice(0, 12000)}`;
    // No Anthropic key: answer with an open model on Workers AI (free tier).
    if (!env.ANTHROPIC_API_KEY && env.AI) {
      const msgs: { role: string; content: string }[] = [{ role: "system", content: (body.lang === "en" ? SYSTEM_EN : SYSTEM_VI) + "\n\n" + knowledge }];
      for (const h of (body.history || []).slice(-6)) if (h && h.text) msgs.push({ role: h.role === "assistant" ? "assistant" : "user", content: h.text.slice(0, 2000) });
      if (msgs[msgs.length - 1].role === "user") msgs.pop();
      msgs.push({ role: "user", content: question });
      try {
        const out = await env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", { messages: msgs, max_tokens: 700 });
        return new Response(JSON.stringify({ answer: (out.response || "").trim() }), { headers });
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
      return new Response(JSON.stringify({ answer }), { headers });
    } catch (error) {
      if (error instanceof Anthropic.RateLimitError) return new Response(JSON.stringify({ error: "busy" }), { status: 429, headers });
      if (error instanceof Anthropic.AuthenticationError) return new Response(JSON.stringify({ error: "key" }), { status: 500, headers });
      if (error instanceof Anthropic.APIError) return new Response(JSON.stringify({ error: `api ${error.status}` }), { status: 502, headers });
      return new Response(JSON.stringify({ error: "unknown" }), { status: 500, headers });
    }
  },
};
