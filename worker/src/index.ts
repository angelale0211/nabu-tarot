/* Nabu AI — Cloudflare Worker that answers the app's questions with Claude.
   The app never sees the API key: it POSTs { lang, question, context, kind,
   history, profile } here, and this worker calls Claude with a fixed system
   prompt plus the knowledge the app already showed the visitor.
   Deploy: npm install && npx wrangler secret put ANTHROPIC_API_KEY && npx wrangler deploy
   Then put the worker URL into CONFIG.aiEndpoint in src/config.js. */
import Anthropic from "@anthropic-ai/sdk";

export interface Env {
  ANTHROPIC_API_KEY: string;
  ALLOWED_ORIGIN?: string; // e.g. https://angelale0211.github.io
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

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const headers = { ...cors(request.headers.get("Origin") || undefined, env), "Content-Type": "application/json" };
    if (request.method === "OPTIONS") return new Response(null, { headers });
    if (request.method !== "POST") return new Response(JSON.stringify({ error: "POST only" }), { status: 405, headers });
    let body: AskBody;
    try { body = (await request.json()) as AskBody; } catch { return new Response(JSON.stringify({ error: "bad json" }), { status: 400, headers }); }
    const question = (body.question || "").trim().slice(0, 1000);
    if (!question) return new Response(JSON.stringify({ error: "empty question" }), { status: 400, headers });

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
          { type: "text", text: `KIND: ${body.kind}\nVISITOR: ${body.profile?.name || "-"} ${body.profile?.sign ? "(" + body.profile.sign + ")" : ""}\nKNOWLEDGE:\n${(body.context || "").slice(0, 12000)}` },
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
