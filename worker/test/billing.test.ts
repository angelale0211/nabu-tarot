import { test } from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index";
import { PLAY_ITEMS } from "../src/catalog";
import { codeKey } from "../src/codes";
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

/* CRITICAL fix round 1: claimPurchase's currentDocument.exists=false is the
   only atomic gate in this whole flow. A design that peeks the ledger with
   an ordinary read before paying a room, and only claims the token
   afterwards, has a window where the claim never lands - a Firestore blip on
   that write is exactly such a case - and a retry with a DIFFERENT room then
   sails through the same "no existing row" peek a second time. One token
   must never pay two rooms, on any account. This is the scenario from the
   review, reproduced deterministically: the token's very first claim attempt
   fails with a transient 500 (a real ledger write blip, not a precondition
   failure), so no row is ever created for it and the room from that attempt
   is never touched; the very next call, same token, a different room, must
   be the only one that ever gets paid. */
test("a wedding token that failed to claim after a Firestore blip must not later pay a second room", async () => {
  const k = K;
  const docs: Record<string, Record<string, unknown>> = {};
  docs["weddings/e__f"] = { uids: { arrayValue: { values: [{ stringValue: "a" }, { stringValue: "f" }] } } };
  docs["weddings/g__h"] = { uids: { arrayValue: { values: [{ stringValue: "a" }, { stringValue: "h" }] } } };
  let claimAttempts = 0;
  const m = mockFetch(k, {
    "androidpublisher.googleapis.com": (_url, init) => (init.method === "POST" ? json({}) : json({ purchaseState: 0, consumptionState: 0 })),
    "firestore.googleapis.com": (url, init) => {
      const id = url.split("/documents/")[1].split("?")[0];
      if (init.method === "PATCH") {
        if (id.startsWith("purchases/") && url.includes("currentDocument.exists=false")) {
          claimAttempts++;
          if (claimAttempts === 1) return json({ error: "boom" }, 500); // a genuine Firestore blip, not "already claimed"
        }
        if (url.includes("currentDocument.exists=false") && docs[id]) return json({}, 409);
        docs[id] = Object.assign(docs[id] || {}, JSON.parse(String(init.body)).fields);
        return json({ name: id });
      }
      return docs[id] ? json({ fields: docs[id] }) : json({}, 404);
    },
  });
  try {
    const first = await post(k, "a", { sku: "wedding", token: "WFAULT", wid: "e__f" });
    assert.equal(first.status, 502); // the blip surfaces as retryable, never as a grant
    assert.notEqual(docs["weddings/e__f"] && (docs["weddings/e__f"].paid as { booleanValue?: boolean } | undefined)?.booleanValue, true);

    const second = await post(k, "a", { sku: "wedding", token: "WFAULT", wid: "g__h" });
    assert.equal(second.status, 200);
    assert.equal((docs["weddings/g__h"].paid as { booleanValue: boolean }).booleanValue, true);

    // the room from the failed first attempt must still be unpaid: one token
    // never buys two rooms, however the failure lands.
    assert.notEqual(docs["weddings/e__f"] && (docs["weddings/e__f"].paid as { booleanValue?: boolean } | undefined)?.booleanValue, true);
  } finally { m.restore(); }
});

/* IMPORTANT fix round 1: itemByKey("wedding").opens is [], and [] || [x] is
   [] - an empty array is truthy in JavaScript, so the old `opens ||
   [got.course]` fallback in /redeem silently picked the empty array and
   opened nothing. A wedding code must open the "wedding" access key, the
   same one src/wedding.js and src/alerts.js read with ACCESS.has('wedding'),
   and claimCode has already burned the code by the time this runs - so
   opening nothing here means the customer loses the code for good. */
test("redeeming a wedding code opens the wedding access key, not nothing", async () => {
  const k = K;
  const salt = "s1";
  const code = "WEDDING1";
  const key = await codeKey(code, salt);
  const codesDoc = {
    updateTime: "2026-01-01T00:00:00Z",
    fields: {
      salt: { stringValue: salt },
      codes: { mapValue: { fields: { [key]: { mapValue: { fields: {
        c: { stringValue: "wedding" }, u: { stringValue: "2099-01-01" },
      } } } } } },
    },
  };
  const docs: Record<string, Record<string, unknown>> = {};
  const m = mockFetch(k, {
    "firestore.googleapis.com": (url, init) => {
      if (url.includes("/content/codes")) return init.method === "PATCH" ? json({}) : json(codesDoc);
      const id = url.split("/documents/")[1].split("?")[0];
      if (init.method === "PATCH") { docs[id] = Object.assign(docs[id] || {}, JSON.parse(String(init.body)).fields); return json({ name: id }); }
      return docs[id] ? json({ fields: docs[id] }) : json({}, 404);
    },
  });
  try {
    const c = ctx();
    const r = await worker.fetch(new Request("https://nabu-ai.test/redeem", {
      method: "POST",
      headers: { Authorization: "Bearer " + await idToken(k, "u1"), "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    }), env(k) as never, c as never);
    await c.done();
    const body = await r.json() as Record<string, unknown>;
    assert.equal(r.status, 200);
    assert.deepEqual(body.opened, ["wedding"]);
    assert.equal((body.access as Record<string, string>).wedding, "2099-01-01");
  } finally { m.restore(); }
});

/* Fix round 2, F4: the write that lands (or confirms) a wedding token's wid
   on its ledger row must never fail silently behind a 200. If it did, the
   row could be left paid for one room with no wid on record, and a
   follow-up request for a DIFFERENT room would pass the "same wid?" check
   claimPurchase makes and pay a second room from the one token. Because the
   wid is now claimed atomically with the row itself (claimPurchase's own
   currentDocument.exists=false create, not a later write), a fresh claim's
   wid is on the row from the moment the claim succeeds - before payRoom or
   any confirming write ever runs - so this must hold even while the
   *confirming* write (state -> "granted") is persistently failing. */
test("a wedding token whose confirming write keeps failing still answers 5xx and still refuses a second room", async () => {
  const k = K;
  const docs: Record<string, Record<string, unknown>> = {};
  docs["weddings/q__r"] = { uids: { arrayValue: { values: [{ stringValue: "a" }] } } };
  docs["weddings/s__t"] = { uids: { arrayValue: { values: [{ stringValue: "a" }] } } };
  const m = mockFetch(k, {
    "androidpublisher.googleapis.com": (_url, init) => (init.method === "POST" ? json({}) : json({ purchaseState: 0, consumptionState: 0 })),
    "firestore.googleapis.com": (url, init) => {
      const id = url.split("/documents/")[1].split("?")[0];
      if (init.method === "PATCH") {
        // The claim's own create-only write must still succeed - only the
        // later, non-create-only confirm write on the same purchase doc fails.
        if (id.startsWith("purchases/") && !url.includes("currentDocument.exists=false")) return json({ error: "boom" }, 500);
        if (url.includes("currentDocument.exists=false") && docs[id]) return json({}, 409);
        docs[id] = Object.assign(docs[id] || {}, JSON.parse(String(init.body)).fields);
        return json({ name: id });
      }
      return docs[id] ? json({ fields: docs[id] }) : json({}, 404);
    },
  });
  try {
    const first = await post(k, "a", { sku: "wedding", token: "WCONFIRM", wid: "q__r" });
    assert.equal(first.status, 502); // the confirm write's own failure, honestly reported
    assert.equal((docs["weddings/q__r"].paid as { booleanValue: boolean }).booleanValue, true); // payRoom itself did land

    // A different room, same token, attempted while the row is still stuck
    // on the failing confirm write: must not be allowed to pay it too.
    const second = await post(k, "a", { sku: "wedding", token: "WCONFIRM", wid: "s__t" });
    assert.equal(second.status, 402);
    assert.notEqual(docs["weddings/s__t"] && (docs["weddings/s__t"].paid as { booleanValue?: boolean } | undefined)?.booleanValue, true);
  } finally { m.restore(); }
});

/* acknowledge() does not look at the HTTP status, and it runs in waitUntil.
   Guarded by `!claim.existing`, a first attempt that failed could never be
   made again: every retry for the same token found its own claim already on
   the ledger and skipped the acknowledge. Google auto-refunds an
   unacknowledged purchase after three days, and the nightly refund sweep then
   takes the course back off somebody who believes they bought it. The wedding
   path was already made unconditional and subscriptions have sub.acknowledged
   to go on; only the course path kept the old shape. */
test("a course retry acknowledges again - a first acknowledge that failed is never the last one", async () => {
  const k = K;
  let acks = 0;
  const docs: Record<string, Record<string, unknown>> = {};
  const m = mockFetch(k, {
    "androidpublisher.googleapis.com": (url, init) => {
      if (init.method === "POST") {
        if (url.endsWith(":acknowledge")) { acks++; return json({ error: "boom" }, 500); }   // and it fails, every time
        return json({});
      }
      return json({ purchaseState: 0, consumptionState: 0 });
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
  try {
    const a = await post(k, "u1", { sku: "tarot", token: "TACK" });
    assert.equal(a.status, 200);
    assert.equal(acks, 1);
    const b = await post(k, "u1", { sku: "tarot", token: "TACK" });   // the same phone asking again
    assert.equal(b.status, 200);
    assert.equal(acks, 2, "the retry acknowledged as well, rather than trusting the first attempt");
  } finally { m.restore(); }
});

/* ---- a code writes down where it came from ----

   `manifest`, `plus` and `pro` are sold on the website (bank transfer, then a
   code) as well as on Play, and the recompute in entitle.ts rebuilds every
   such key from the subscription rows. `granted` is the only thing that tells
   it a key was ALSO paid for directly, so /redeem has to write it or the
   customer is safe only until their first subscription event.

   And only for those keys. `tarot`, `lenormand`, `playing` and `wedding` are
   never rebuilt from anything, so a course code has nothing to write down -
   and writing one anyway would put a course key in a field whose whole meaning
   is "a Play-managed key somebody else paid for". */
function codeWorld(k: Awaited<ReturnType<typeof makeKeys>>, entries: Record<string, { c: string; u: string }>) {
  const salt = "s-granted";
  const docs: Record<string, Record<string, unknown>> = {};
  const book: Record<string, unknown> = {};
  const m = mockFetch(k, {
    "/content/codes": (_url, init) => {
      if (init.method === "PATCH") return json({});
      return json({ updateTime: "2026-01-01T00:00:00Z", fields: { salt: { stringValue: salt }, codes: { mapValue: { fields: book } } } });
    },
    "firestore.googleapis.com": (url, init) => {
      const id = url.split("/documents/")[1].split("?")[0];
      if (init.method === "PATCH") { docs[id] = Object.assign(docs[id] || {}, JSON.parse(String(init.body)).fields); return json({ name: id }); }
      return docs[id] ? json({ fields: docs[id] }) : json({}, 404);
    },
  });
  const ready = (async () => {
    for (const code of Object.keys(entries)) {
      const key = await codeKey(code, salt);
      book[key] = { mapValue: { fields: { c: { stringValue: entries[code].c }, u: { stringValue: entries[code].u } } } };
    }
  })();
  return { docs, m, ready };
}
const redeem = async (k: Awaited<ReturnType<typeof makeKeys>>, uid: string, code: string) => {
  const c = ctx();
  const r = await worker.fetch(new Request("https://nabu-ai.test/redeem", {
    method: "POST",
    headers: { Authorization: "Bearer " + await idToken(k, uid), "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  }), env(k) as never, c as never);
  await c.done();
  return { status: r.status, body: await r.json() as Record<string, unknown> };
};
const mapOf = (docs: Record<string, Record<string, unknown>>, uid: string, field: string): Record<string, string> | undefined => {
  const f = (docs["users/" + uid] || {})[field] as { mapValue?: { fields?: Record<string, { stringValue?: string }> } } | undefined;
  if (!f) return undefined;
  const out: Record<string, string> = {};
  const fields = f.mapValue?.fields || {};
  for (const key of Object.keys(fields)) out[key] = fields[key].stringValue || "";
  return out;
};

test("redeeming a Pro code writes granted as well as access, so a later Play subscription cannot shorten it", async () => {
  const k = K;
  const w = codeWorld(k, { PROCODE1: { c: "pro", u: "2099-01-01" } });
  await w.ready;
  try {
    const a = await redeem(k, "ug1", "PROCODE1");
    assert.equal(a.status, 200);
    assert.deepEqual(a.body.opened, ["pro", "plus"]);
    assert.deepEqual(mapOf(w.docs, "ug1", "access"), { pro: "2099-01-01", plus: "2099-01-01" });
    assert.deepEqual(mapOf(w.docs, "ug1", "granted"), { pro: "2099-01-01", plus: "2099-01-01" });
  } finally { w.m.restore(); }
});

test("redeeming a COURSE code records it in granted, so a refund can see the website paid for it", async () => {
  const k = K;
  const w = codeWorld(k, { TARCODE1: { c: "tarot", u: "2099-01-01" } });
  await w.ready;
  try {
    const a = await redeem(k, "ug2", "TARCODE1");
    assert.equal(a.status, 200);
    assert.deepEqual(a.body.opened, ["tarot"]);
    assert.deepEqual(mapOf(w.docs, "ug2", "access"), { tarot: "2099-01-01" });
    /* Course keys are written here now. They used to be left out on the
       reasoning that nothing rebuilds a course key from `granted` - still
       true, recompute filters them out - but a REFUND asks this field what
       paid for a course besides Play. With it empty, refunding a Play
       purchase of a course somebody had ALSO paid for by bank transfer took
       the bank transfer away too. */
    assert.deepEqual(mapOf(w.docs, "ug2", "granted"), { tarot: "2099-01-01" }, "the website's own grant is recorded");
  } finally { w.m.restore(); }
});
