import { test } from "node:test";
import assert from "node:assert/strict";
import { systemFor } from "../src/index";

/* Nabu AI's scope follows what the reader has bought. A reader with a course
   or Pro is not turned away for asking something that is not tarot - Gemini
   refused "when is Lễ Vu Lan in 2027" as outside tarot while the one scope
   said so for everyone. A reader with nothing bought keeps the app's own
   knowledge, and is still told the calendar counts as that knowledge. */

test("a paying reader's prompt answers questions beyond tarot and takes dates from the calendar", () => {
  for (const lang of ["vi", "en", "de"]) {
    const p = systemFor(lang, true);
    assert.match(p, /CALENDAR/, lang + ": names the calendar");
    assert.doesNotMatch(p, /một lá bài hay một cung không trả lời được|one card or one sign cannot answer|einzelne Karte oder ein einzelnes Sternzeichen das nicht beantworten/,
      lang + ": does not tell the model to turn questions away");
  }
  assert.match(systemFor("vi", true), /không từ chối chỉ vì câu hỏi không liên quan đến tarot/);
  assert.match(systemFor("en", true), /do not turn a question down only because it is not about tarot/);
});

test("a reader with nothing bought keeps the app's knowledge, the calendar included", () => {
  for (const lang of ["vi", "en", "de"]) {
    const p = systemFor(lang, false);
    assert.match(p, /CALENDAR/, lang + ": the calendar is the app's knowledge too");
    assert.match(p, /một lá bài hay một cung không trả lời được|one card or one sign cannot answer|einzelne Karte oder ein einzelnes Sternzeichen das nicht beantworten/,
      lang + ": beyond that, says a card cannot answer and points to a reading");
  }
});

test("every language gets its own prompt, and anything unknown falls back to Vietnamese", () => {
  assert.match(systemFor("vi"), /^Bạn là Nabu AI/);
  assert.match(systemFor("en"), /^You are Nabu AI/);
  assert.match(systemFor("de"), /^Du bist Nabu AI/);
  assert.equal(systemFor("fr"), systemFor("vi"));
  for (const paid of [true, false]) {
    for (const lang of ["vi", "en", "de"]) {
      assert.match(systemFor(lang, paid), /4 (đến|to|bis) 8/, lang + ": the length limit holds on both tiers");
    }
  }
});

test("Nabu AI never introduces itself as Nabu, and only brings up today when asked about dates", () => {
  // Flash-Lite, given the calendar, opened a tarot answer with "Hôm nay là Chủ
  // Nhật..." and once said "mình là Nabu đây" - Nabu is the reader, not the bot.
  for (const paid of [true, false]) {
    assert.match(systemFor("vi", paid), /đừng tự xưng là Nabu/);
    assert.match(systemFor("en", paid), /never introduce yourself as Nabu/);
    assert.match(systemFor("de", paid), /stell dich also nie als Nabu vor/);
    assert.match(systemFor("vi", paid), /Chỉ nhắc đến ngày hôm nay khi người dùng hỏi về ngày tháng/);
  }
});
