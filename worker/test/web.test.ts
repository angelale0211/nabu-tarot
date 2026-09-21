import { test } from "node:test";
import assert from "node:assert/strict";
import { wikiQuery, wikiLook } from "../src/web";
import { isHard } from "../src/index";

/* The free way to know something the model does not. Grounding with Google
   Search is shut to a key with no billing, so this is what is left, and it
   has to behave: a slow or broken Wikipedia answers nothing and the reader
   still gets their answer from what the app knows. */

const page = (title: string, extract: string) => ({ title, extract });
const reply = (pages: Record<string, { title: string; extract: string }>) => ({
  ok: true, status: 200, json: async () => ({ query: { pages } }),
} as unknown as Response);

test("the search words are what carries meaning, not the whole spoken sentence", () => {
  assert.equal(wikiQuery("Lễ Vu Lan là gì vậy bạn?"), "Lễ Vu Lan");
  assert.equal(wikiQuery("what is the summer solstice about?"), "summer solstice");
  assert.equal(wikiQuery("   ?  "), "");
});

test("two pages at most, each trimmed, titles kept", async () => {
  const got = await wikiLook("vi", "Lễ Vu Lan", { fetch: (async () => reply({
    a: page("Vu Lan", "x".repeat(900)), b: page("Rằm tháng Bảy", "y".repeat(120)), c: page("Ba", "z".repeat(120)),
  })) as unknown as typeof fetch });
  assert.match(got, /^Vu Lan: x+/);
  assert.match(got, /Rằm tháng Bảy: y+/);
  assert.doesNotMatch(got, /Ba: z/, "the third page is left out");
  assert.ok(got.length <= 1400, "trimmed to something a prompt can carry");
});

test("a page with nothing in it is not offered as background", async () => {
  const got = await wikiLook("en", "some name", { fetch: (async () => reply({ a: page("Stub", "short") })) as unknown as typeof fetch });
  assert.equal(got, "");
});

test("Wikipedia being down, slow or angry answers nothing rather than throwing", async () => {
  const down = await wikiLook("vi", "Lễ Vu Lan", { fetch: (async () => { throw new Error("network"); }) as unknown as typeof fetch });
  assert.equal(down, "");
  const refused = await wikiLook("vi", "Lễ Vu Lan", { fetch: (async () => ({ ok: false, status: 429 })) as unknown as typeof fetch });
  assert.equal(refused, "");
  const slow = await wikiLook("vi", "Lễ Vu Lan", { ms: 20, fetch: ((_u: string, o: { signal: AbortSignal }) => new Promise((_res, rej) => {
    o.signal.addEventListener("abort", () => rej(new Error("aborted")));
  })) as unknown as typeof fetch });
  assert.equal(slow, "");
});

/* Which model answers: the fast one for a card's meaning, the one that thinks
   for a question that has to be reasoned about. */
test("a question asking for a reason or a comparison is the one worth thinking about", () => {
  assert.equal(isHard({}, "Vì sao lá này lại ngược với lá kia?"), true);
  assert.equal(isHard({}, "Why do these two cards disagree?"), true);
  assert.equal(isHard({}, "Was ist der Unterschied zwischen den beiden?"), true);
  assert.equal(isHard({}, "Lá này nghĩa là gì?"), false);
  assert.equal(isHard({}, "x".repeat(200)), true, "a long question is working something out");
  assert.equal(isHard({ history: [{ role: "user", text: "a" }, { role: "assistant", text: "b" },
    { role: "user", text: "c" }, { role: "assistant", text: "d" }] }, "Còn cái kia?"), true,
    "by the third turn the reader is working something out");
});
