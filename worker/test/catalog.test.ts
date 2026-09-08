import { test } from "node:test";
import assert from "node:assert/strict";
import { PLAY_ITEMS, itemBySku, PLAY_MANAGED_KEYS, PLAY_SUB_SKUS } from "../src/catalog";

test("four one-time items with the exact Play ids", () => {
  const inapp = PLAY_ITEMS.filter((i) => i.kind === "inapp").map((i) => i.sku).sort();
  assert.deepEqual(inapp, ["lenormand", "playing", "tarot", "wedding"]);
});
test("both Pro plans open pro and plus; manifest is not in plus", () => {
  const pro6 = PLAY_ITEMS.find((i) => i.key === "pro6")!, pro = PLAY_ITEMS.find((i) => i.key === "pro")!, plus = PLAY_ITEMS.find((i) => i.key === "plus")!;
  assert.deepEqual(pro6.opens, ["pro", "plus"]); assert.deepEqual(pro.opens, ["pro", "plus"]);
  assert.equal(pro6.months, 6); assert.equal(pro.months, 12);
  assert.deepEqual(plus.opens, ["plus"]);
});
test("legacy one-time ids are not in the catalogue and an empty sku matches nothing", () => {
  for (const legacy of ["manifest", "plus", "pro6", "pro"]) assert.equal(PLAY_ITEMS.some((i) => i.kind === "inapp" && i.sku === legacy), false);
  assert.equal(itemBySku(""), null);
});
test("play-managed keys are the union of what subscriptions open", () => {
  assert.deepEqual([...PLAY_MANAGED_KEYS].sort(), ["manifest", "plus", "pro"]);
});
test("subscription skus, when filled, are distinct", () => {
  const vals = Object.values(PLAY_SUB_SKUS).filter(Boolean);
  assert.equal(new Set(vals).size, vals.length);
});
