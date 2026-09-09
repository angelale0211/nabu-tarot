import { test } from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index";
import { PLAY_ITEMS } from "../src/catalog";
import { makeKeys, env, ctx, mockFetch, json, idToken } from "./util";

/* One keypair for the whole file, not one per test. auth.ts caches Google's
   JWKS at module scope (keyCache, keyed by "kid") for the life of the worker,
   and every key from makeKeys() reuses the same kid ("k1"). A fresh keypair
   per test would collide with that cache: the first test's key wins it, and
   every later test's JWTs - signed with a different key under the same kid -
   would fail to verify. Not a deviation in behaviour under test, just in how
   the fixture is wired, forced by a real module-level cache this suite has to
   share the process with. */
const K = await makeKeys();

function world(k: Awaited<ReturnType<typeof makeKeys>>, play: { products?: Record<string, unknown>; subs?: Record<string, unknown> }) {
  const docs: Record<string, Record<string, unknown>> = {};
  const m = mockFetch(k, {
    "androidpublisher.googleapis.com": (url, init) => {
      if (init.method === "POST") return json({});                                   // acknowledge / consume
      const tok = decodeURIComponent(url.split("/tokens/")[1]);
      const table = url.includes("/subscriptionsv2/") ? play.subs || {} : play.products || {};
      return table[tok] ? json(table[tok]) : json({}, 404);
    },
    "firestore.googleapis.com": (url, init) => {
      const id = url.split("/documents/")[1].split("?")[0];
      if (init.method === "PATCH") {
        if (url.includes("currentDocument.exists=false") && docs[id]) return json({}, 409);
        docs[id] = Object.assign(docs[id] || {}, JSON.parse(String(init.body)).fields);
        return json({ name: id });
      }
      return docs[id] ? json({ fields: docs[id] }) : json({}, 404);
    },
  });
  return { docs, m };
}
const post = async (k: Awaited<ReturnType<typeof makeKeys>>, uid: string, body: unknown, e = env(k)) => {
  const c = ctx();
  const r = await worker.fetch(new Request("https://nabu-ai.test/billing", { method: "POST", headers: { Authorization: "Bearer " + await idToken(k, uid), "Content-Type": "application/json" }, body: JSON.stringify(body) }), e as never, c as never);
  await c.done();
  return { status: r.status, body: await r.json() as Record<string, unknown> };
};
const str = (f: unknown) => (f as { stringValue: string }).stringValue;

test("a course: granted once; the same token again returns the same date and consumes nothing new", async () => {
  const k = K;
  const w = world(k, { products: { T1: { purchaseState: 0, consumptionState: 0 } } });
  try {
    const a = await post(k, "u1", { sku: "tarot", token: "T1" });
    assert.equal(a.status, 200); assert.deepEqual(a.body.opened, ["tarot"]);
    const until = (a.body.access as Record<string, string>).tarot;
    const b = await post(k, "u1", { sku: "tarot", token: "T1" });
    assert.equal(b.status, 200); assert.equal((b.body.access as Record<string, string>).tarot, until);
    const c = await post(k, "u2", { sku: "tarot", token: "T1" });
    assert.equal(c.status, 402); assert.equal(c.body.error, "already used");
  } finally { w.m.restore(); }
});
test("a pending purchase answers 202 and grants nothing", async () => {
  const k = K;
  const w = world(k, { products: { P1: { purchaseState: 2 } } });
  try { const a = await post(k, "u1", { sku: "tarot", token: "P1" }); assert.equal(a.status, 202); assert.equal(a.body.pending, true); assert.equal(w.docs["users/u1"], undefined); }
  finally { w.m.restore(); }
});
test("legacy one-time ids are unknown products", async () => {
  const k = K;
  const w = world(k, { products: { L1: { purchaseState: 0, consumptionState: 0 } } });
  try { for (const sku of ["manifest", "plus", "pro6", "pro"]) { const a = await post(k, "u1", { sku, token: "L1" }); assert.equal(a.status, 400, sku); } }
  finally { w.m.restore(); }
});
test("an empty sku matches nothing", async () => {
  const k = K;
  const w = world(k, { products: {} });
  try {
    const a = await post(k, "u1", { sku: "", token: "T1" });
    assert.equal(a.status, 400); assert.equal(a.body.error, "unknown product");
    const b = await post(k, "u1", { token: "T1" });
    assert.equal(b.status, 400); assert.equal(b.body.error, "unknown product");
  } finally { w.m.restore(); }
});
test("a wedding pays the named room, only for a member, and only one room per token", async () => {
  const k = K;
  const w = world(k, { products: { W1: { purchaseState: 0, consumptionState: 0 } } });
  w.docs["weddings/a__b"] = { uids: { arrayValue: { values: [{ stringValue: "a" }, { stringValue: "b" }] } } };
  w.docs["weddings/c__d"] = { uids: { arrayValue: { values: [{ stringValue: "c" }, { stringValue: "d" }] } } };
  try {
    const nope = await post(k, "a", { sku: "wedding", token: "W1" }); assert.equal(nope.status, 400);
    const other = await post(k, "a", { sku: "wedding", token: "W1", wid: "c__d" }); assert.equal(other.status, 403);
    const ok = await post(k, "a", { sku: "wedding", token: "W1", wid: "a__b" });
    assert.equal(ok.status, 200); assert.equal((w.docs["weddings/a__b"].paid as { booleanValue: boolean }).booleanValue, true);
    const again = await post(k, "a", { sku: "wedding", token: "W1", wid: "a__b" }); assert.equal(again.status, 200);
    const second = await post(k, "a", { sku: "wedding", token: "W1", wid: "c__d" }); assert.equal(second.status, 402);
  } finally { w.m.restore(); }
});
test("a subscription writes subs and access from Google's state, and is acknowledged not consumed", { skip: !PLAY_ITEMS.find((i) => i.key === "plus")!.sku && "B1: plus sku not filled" }, async () => {
  const k = K;
  const plus = PLAY_ITEMS.find((i) => i.key === "plus")!;
  const exp = new Date(Date.now() + 30 * 86400000).toISOString();
  const w = world(k, { subs: { S1: { subscriptionState: "SUBSCRIPTION_STATE_ACTIVE", acknowledgementState: "ACKNOWLEDGEMENT_STATE_PENDING", lineItems: [{ productId: plus.sku, expiryTime: exp, autoRenewingPlan: { autoRenewEnabled: true }, offerDetails: { basePlanId: "plus-12m" } }] } } });
  try {
    const a = await post(k, "u1", { sku: plus.sku, token: "S1" });
    assert.equal(a.status, 200); assert.deepEqual(a.body.opened, ["plus"]);
    const subs = w.docs["users/u1"].subs as { mapValue: { fields: Record<string, { mapValue: { fields: Record<string, unknown> } }> } };
    assert.equal(str(subs.mapValue.fields.plus.mapValue.fields.state), "SUBSCRIPTION_STATE_ACTIVE");
    const calls = w.m.log.filter((c) => c.url.includes("androidpublisher") && c.method === "POST").map((c) => c.url);
    assert.equal(calls.some((u) => u.endsWith(":acknowledge")), true);
    assert.equal(calls.some((u) => u.endsWith(":consume")), false);
  } finally { w.m.restore(); }
});

/* Binding rule: a transient Google failure (500, 503, a timeout) must never
   read as "invalid purchase" and must never grant either. It has to come
   back as a 5xx so the phone retries - the one failure mode this endpoint
   is not allowed to have. */
test("a transient Google failure (500) is answered with a 5xx, never as an invalid purchase, and grants nothing", async () => {
  const k = K;
  const docs: Record<string, Record<string, unknown>> = {};
  const m = mockFetch(k, {
    "androidpublisher.googleapis.com": (_url, init) => (init.method === "POST" ? json({}) : json({ error: "boom" }, 500)),
    "firestore.googleapis.com": (url, init) => {
      const id = url.split("/documents/")[1].split("?")[0];
      if (init.method === "PATCH") { docs[id] = Object.assign(docs[id] || {}, JSON.parse(String(init.body)).fields); return json({ name: id }); }
      return docs[id] ? json({ fields: docs[id] }) : json({}, 404);
    },
  });
  try {
    const a = await post(k, "u1", { sku: "tarot", token: "T500" });
    assert.equal(a.status, 502);
    assert.notEqual(a.body.error, "invalid purchase");
    assert.equal(a.body.error, "play 500");
    assert.equal(docs["users/u1"], undefined);
  } finally { m.restore(); }
});
