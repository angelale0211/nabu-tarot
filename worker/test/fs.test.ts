import { test } from "node:test";
import assert from "node:assert/strict";
import { encode, decode, fsPatch } from "../src/fs";
import { makeKeys, env, mockFetch } from "./util";

test("encode/decode round-trips strings, booleans, numbers, arrays and nested maps", () => {
  const o = { a: "x", b: true, n: 3, arr: ["p", "q"], m: { k: "v", deep: { z: false } } };
  assert.deepEqual(decode({ fields: encode(o) }), o);
});
test("decode of a missing document is an empty object", () => {
  assert.deepEqual(decode({}), {});
});

/* fsPatch must never send a maskless PATCH: with the old `mask ||
   Object.keys(obj)` an explicit empty array is truthy, so it would win and
   produce zero updateMask.fieldPaths - which tells Firestore to replace the
   whole document rather than merge. Both an explicit [] and an omitted mask
   over an empty object must refuse to send the request at all. */
test("fsPatch with an explicit empty mask falls back to the object's own keys, never a maskless request", async () => {
  const k = await makeKeys();
  const { log, restore } = mockFetch(k, {
    "firestore.googleapis.com": () => new Response(JSON.stringify({}), { status: 200 }),
  });
  try {
    await fsPatch(env(k), "users/u1", { a: 1, b: 2 }, []);
    const call = log.find((c) => c.url.includes("firestore.googleapis.com"));
    assert.ok(call, "expected a firestore call");
    assert.ok(call!.url.includes("updateMask.fieldPaths=a"));
    assert.ok(call!.url.includes("updateMask.fieldPaths=b"));
  } finally {
    restore();
  }
});

test("fsPatch with no mask and an empty object throws instead of sending a maskless request", async () => {
  const k = await makeKeys();
  const { log, restore } = mockFetch(k, {
    "firestore.googleapis.com": () => new Response(JSON.stringify({}), { status: 200 }),
  });
  try {
    await assert.rejects(() => fsPatch(env(k), "users/u1", {}));
    assert.equal(log.filter((c) => c.url.includes("firestore.googleapis.com")).length, 0);
  } finally {
    restore();
  }
});

test("fsPatch with a normal non-empty mask sends exactly those fieldPaths, and createOnly adds the exists precondition", async () => {
  const k = await makeKeys();
  const { log, restore } = mockFetch(k, {
    "firestore.googleapis.com": () => new Response(JSON.stringify({}), { status: 200 }),
  });
  try {
    const res = await fsPatch(env(k), "users/u1", { a: 1, b: 2, c: 3 }, ["a", "b"], { createOnly: true });
    assert.equal(res.status, 200);
    const call = log.find((c) => c.url.includes("firestore.googleapis.com"));
    assert.ok(call, "expected a firestore call");
    assert.equal(call!.method, "PATCH");
    assert.ok(call!.url.includes("updateMask.fieldPaths=a"));
    assert.ok(call!.url.includes("updateMask.fieldPaths=b"));
    assert.ok(!call!.url.includes("updateMask.fieldPaths=c"));
    assert.ok(call!.url.includes("currentDocument.exists=false"));
  } finally {
    restore();
  }
});
