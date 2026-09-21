/* Something to read that is not the model's memory.

   Grounding with Google Search is the obvious way and it is shut: on a 3.x
   model the free tier does not offer it at all, and a key whose Google project
   has no billing account is refused at the first search of the day. The owner
   does not want a bill, so the app cannot have that.

   Wikipedia is free, needs no key and no account, and answers most of what a
   reader actually asks past the cards: who someone is, what a festival is,
   what a word means. It is one request, in the reader's own language, and it
   is handed to the model as background rather than as the answer - the model
   uses it when it fits and ignores it when it does not.

   What this is not: a search engine. It will not have this morning's news. */

const WIKI: Record<string, string> = { vi: "vi", en: "en", de: "de" };

/* Wikipedia's own search does better with the words that carry meaning than
   with a whole spoken sentence. Question words and the polite filler around
   them are dropped; anything else is left alone, including names.

   Matched word by word rather than with a regular expression: \b knows about
   a, b, c and not about ề, so \blà\b never matched "là" and the filler stayed
   in the query. */
const NOISE = new Set(("mình bạn nhé nha ạ vậy thì là của cho với về có không gì nào ai đâu bao giờ tại sao vì sao "
  + "the a an of is are do does did to for about please tell me what which who when where why how "
  + "der die das und ist sind mir mich bitte sag was wer wann wo warum wie ein eine").split(" "));

export const wikiQuery = (question: string): string => {
  const words = String(question || "")
    .replace(/[?!.,;:"'()\[\]]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !NOISE.has(w.toLowerCase()));
  return words.slice(0, 8).join(" ").slice(0, 200);
};

/* A page's opening paragraphs, trimmed. Two pages at most: past that it stops
   being background and starts crowding out the app's own knowledge. */
export async function wikiLook(lang: string, question: string, opts?: { fetch?: typeof fetch; ms?: number }): Promise<string> {
  const q = wikiQuery(question);
  if (q.length < 3) return "";
  const site = WIKI[lang] || "vi";
  const f = opts?.fetch || fetch;
  const url = `https://${site}.wikipedia.org/w/api.php?action=query&format=json&generator=search`
    + `&gsrsearch=${encodeURIComponent(q)}&gsrlimit=2&prop=extracts&exintro=1&explaintext=1&exlimit=2&redirects=1`;
  try {
    const r = await f(url, { signal: AbortSignal.timeout(opts?.ms ?? 1500), headers: { "User-Agent": "NabuTarot/1.0 (https://nabutarot.com)" } });
    if (!r.ok) return "";
    const j = await r.json() as { query?: { pages?: Record<string, { title?: string; extract?: string }> } };
    const pages = Object.values((j.query && j.query.pages) || {});
    const out = pages
      .map((p) => ({ title: String(p.title || "").trim(), text: String(p.extract || "").replace(/\s+/g, " ").trim() }))
      .filter((p) => p.title && p.text.length > 40)
      .slice(0, 2)
      .map((p) => `${p.title}: ${p.text.slice(0, 700)}`)
      .join("\n\n");
    return out.slice(0, 1400);
  } catch {
    /* Wikipedia being slow or down is not a reason to answer nothing: the
       model still has the app's knowledge and its own. */
    return "";
  }
}
