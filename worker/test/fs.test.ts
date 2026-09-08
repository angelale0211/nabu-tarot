import { test } from "node:test";
import assert from "node:assert/strict";
import { encode, decode } from "../src/fs";

test("encode/decode round-trips strings, booleans, numbers, arrays and nested maps", () => {
  const o = { a: "x", b: true, n: 3, arr: ["p", "q"], m: { k: "v", deep: { z: false } } };
  assert.deepEqual(decode({ fields: encode(o) }), o);
});
test("decode of a missing document is an empty object", () => {
  assert.deepEqual(decode({}), {});
});
