import { test } from "node:test";
import assert from "node:assert/strict";
import { claimPurchase, markGranted, ledgerGet, tokenId, sweepRefunds } from "../src/refunds";
import { makeKeys, env, mockFetch, json, fsDoc } from "./util";

test("claim: first claim creates; same uid re-claim returns the existing row; other uid refused; other wid refused", async () => {
  const k = await makeKeys();
  const docs: Record<string, Record<string, unknown>> = {};
  const m = mockFetch(k, {
    "firestore.googleapis.com": (url, init) => {
      const id = url.split("/documents/")[1].split("?")[0];
      if (init.method === "PATCH") {
        if (url.includes("currentDocument.exists=false") && docs[id]) return json({ error: { status: "FAILED_PRECONDITION" } }, 409);
        const f = JSON.parse(String(init.body)).fields;
        docs[id] = Object.assign(docs[id] || {}, f);
        return json({ name: id });
      }
      return docs[id] ? json({ fields: docs[id] }) : json({}, 404);
    },
  });
  try {
    const e = env(k);
    const a = await claimPurchase(e, "u1", "wedding", [], "TOK", { kind: "inapp", wid: "w1" });
    assert.equal(a.ok, true); assert.equal(a.existing, undefined);

    // R2: the very first write is the ONLY thing stopping a token being spent
    // twice, so it must carry the create-only precondition - verify it does.
    const firstPatch = m.log.find((c) => c.method === "PATCH");
    assert.ok(firstPatch && firstPatch.url.includes("currentDocument.exists=false"),
      "first claim write must set currentDocument.exists=false");

    const b = await claimPurchase(e, "u1", "wedding", [], "TOK", { kind: "inapp", wid: "w1" });
    assert.equal(b.ok, true); assert.equal(b.existing && b.existing.wid, "w1");
    // R1: the raw token must be recoverable from the row, not just its hash.
    assert.equal(b.existing && b.existing.token, "TOK");

    const c = await claimPurchase(e, "u2", "wedding", [], "TOK", { kind: "inapp", wid: "w1" });
    assert.deepEqual({ ok: c.ok, why: c.why }, { ok: false, why: "already used" });
    const d = await claimPurchase(e, "u1", "wedding", [], "TOK", { kind: "inapp", wid: "w2" });
    assert.deepEqual({ ok: d.ok, why: d.why }, { ok: false, why: "already used" });
    const row = await ledgerGet(e, Object.keys(docs)[0].replace("purchases/", ""));
    assert.equal(row && row.kind, "inapp");
    assert.equal(row && row.token, "TOK");
  } finally { m.restore(); }
});

test("markGranted stores state, until and plan without disturbing the rest of the row", async () => {
  const k = await makeKeys();
  const docs: Record<string, Record<string, unknown>> = {};
  const m = mockFetch(k, {
    "firestore.googleapis.com": (url, init) => {
      const id = url.split("/documents/")[1].split("?")[0];
      if (init.method === "PATCH") {
        if (url.includes("currentDocument.exists=false") && docs[id]) return json({ error: { status: "FAILED_PRECONDITION" } }, 409);
        const f = JSON.parse(String(init.body)).fields;
        docs[id] = Object.assign(docs[id] || {}, f);
        return json({ name: id });
      }
      return docs[id] ? json({ fields: docs[id] }) : json({}, 404);
    },
  });
  try {
    const e = env(k);
    await claimPurchase(e, "u1", "pro", ["pro", "plus"], "SUBTOK", { kind: "subs" });
    await markGranted(e, "SUBTOK", { until: "2027-01-01", plan: "pro-monthly" });
    const row = await ledgerGet(e, await tokenId("SUBTOK"));
    assert.equal(row && row.state, "granted");
    assert.equal(row && row.until, "2027-01-01");
    assert.equal(row && row.plan, "pro-monthly");
    assert.equal(row && row.uid, "u1");     // untouched by the update mask
    assert.equal(row && row.token, "SUBTOK"); // untouched by the update mask
  } finally { m.restore(); }
});

test("R3: a transient failure claiming a token surfaces as an error, never as a false \"already used\"", async () => {
  const k = await makeKeys();
  const m = mockFetch(k, {
    "firestore.googleapis.com": (_url, init) => {
      if (init.method === "PATCH") return json({ error: "boom" }, 500); // not the 409 precondition failure
      return json({}, 404); // and nobody's row exists either
    },
  });
  try {
    const e = env(k);
    await assert.rejects(() => claimPurchase(e, "u1", "tarot", ["tarot"], "TOK"), /claim 500/);
  } finally { m.restore(); }
});

test("sweepRefunds: a voided wedding purchase unpays the room and counts as revoked", async () => {
  const k = await makeKeys();
  const purchaseId = await tokenId("WEDTOK");
  const docs: Record<string, Record<string, unknown>> = {
    ["purchases/" + purchaseId]: fsDoc({ uid: "u1", sku: "wedding", ids: [], wid: "w1", state: "granted" }).fields,
    ["weddings/w1"]: fsDoc({ paid: true, paidBy: "u1", purchase: purchaseId, uids: ["u1"] }).fields,
  };
  const m = mockFetch(k, {
    "voidedpurchases": () => json({ voidedPurchases: [{ purchaseToken: "WEDTOK", voidedTimeMillis: String(Date.now()), orderId: "GPA.1" }] }),
    "firestore.googleapis.com": (url, init) => {
      const id = url.split("/documents/")[1].split("?")[0];
      if (init.method === "PATCH") {
        const f = JSON.parse(String(init.body)).fields;
        docs[id] = Object.assign(docs[id] || {}, f);
        return json({ name: id });
      }
      return docs[id] ? json({ fields: docs[id] }) : json({}, 404);
    },
  });
  try {
    const e = env(k);
    const swept = await sweepRefunds(e);
    assert.equal(swept.looked, 1);
    assert.equal(swept.matched, 1);
    assert.equal(swept.revoked, 1);
    assert.equal((docs["weddings/w1"].paid as { booleanValue?: boolean }).booleanValue, false);
    assert.equal((docs["weddings/w1"].purchase as { stringValue?: string }).stringValue, "");
    assert.equal((docs["purchases/" + purchaseId].state as { stringValue?: string }).stringValue, "voided");
  } finally { m.restore(); }
});

test("R3: sweepRefunds skips (never revokes) a row it could not read because of a transient Firestore failure, and still processes the rest", async () => {
  const k = await makeKeys();
  const goodId = await tokenId("GOODTOK");
  const badId = await tokenId("BADTOK");
  const docs: Record<string, Record<string, unknown>> = {
    ["purchases/" + goodId]: fsDoc({ uid: "u2", sku: "tarot", ids: ["tarot"], state: "granted" }).fields,
    ["users/u2"]: fsDoc({ access: { tarot: "2099-01-01" } }).fields,
  };
  const m = mockFetch(k, {
    "voidedpurchases": () => json({ voidedPurchases: [
      { purchaseToken: "BADTOK", orderId: "GPA.bad" },
      { purchaseToken: "GOODTOK", orderId: "GPA.good" },
    ] }),
    "firestore.googleapis.com": (url, init) => {
      const id = url.split("/documents/")[1].split("?")[0];
      if (id === "purchases/" + badId && init.method !== "PATCH") return json({ error: "boom" }, 500);
      if (init.method === "PATCH") {
        const f = JSON.parse(String(init.body)).fields;
        docs[id] = Object.assign(docs[id] || {}, f);
        return json({ name: id });
      }
      return docs[id] ? json({ fields: docs[id] }) : json({}, 404);
    },
  });
  try {
    const e = env(k);
    const swept = await sweepRefunds(e);
    assert.equal(swept.looked, 2);
    assert.equal(swept.skipped, 1);   // the 500 on BADTOK - never treated as "not ours"
    assert.equal(swept.matched, 1);   // GOODTOK still went through
    assert.equal(swept.revoked, 1);
    assert.deepEqual(docs["users/u2"].access, { mapValue: { fields: {} } }); // tarot actually taken
    assert.equal(docs["purchases/" + badId], undefined); // never written to - nothing guessed
  } finally { m.restore(); }
});

/* A Firestore REST PATCH creates a document that is not there. Cancel-then-
   refund is an ordinary sequence - cancelling deletes the room, and the room
   is spent by design - so the refund arrives at a wid with nothing behind it.
   A blind PATCH left a ghost holding paid:false and no `uids`, and because
   wedding ids are deterministic (uidA__uidB) and firestore.rules gates update
   and delete on being in resource.data.uids, that couple could never make
   another wedding: create no longer applied, and nothing else was allowed. */
test("sweepRefunds: a refund for a room that no longer exists creates nothing", async () => {
  const k = await makeKeys();
  const purchaseId = await tokenId("GONETOK");
  const docs: Record<string, Record<string, unknown>> = {
    ["purchases/" + purchaseId]: fsDoc({ uid: "u1", sku: "wedding", ids: [], wid: "a__b", state: "granted" }).fields,
  };
  const m = mockFetch(k, {
    "voidedpurchases": () => json({ voidedPurchases: [{ purchaseToken: "GONETOK", orderId: "GPA.gone" }] }),
    "firestore.googleapis.com": (url, init) => {
      const id = url.split("/documents/")[1].split("?")[0];
      if (init.method === "PATCH") { docs[id] = Object.assign(docs[id] || {}, JSON.parse(String(init.body)).fields); return json({ name: id }); }
      return docs[id] ? json({ fields: docs[id] }) : json({}, 404);
    },
  });
  try {
    const swept = await sweepRefunds(env(k));
    assert.equal(swept.matched, 1);
    assert.equal(swept.revoked, 0);                       // there was nothing to take back
    assert.equal(docs["weddings/a__b"], undefined);       // and nothing was conjured in its place
    assert.equal(m.log.some((c) => c.method === "PATCH" && c.url.includes("/weddings/")), false);
    // The refund is still filed, so the sweep does not look at it again every night.
    assert.equal((docs["purchases/" + purchaseId].state as { stringValue?: string }).stringValue, "voided");
  } finally { m.restore(); }
});

/* Wedding ids are deterministic, so the same wid can be paid for a second
   time, by a second purchase - and only the purchase that actually paid for
   the room may un-pay it. The same guard protects a room Nabu was paid for by
   bank transfer and marked paid by hand: it carries no `purchase` at all. */
test("sweepRefunds: a room paid for by a DIFFERENT purchase is left alone", async () => {
  const k = await makeKeys();
  const refundedId = await tokenId("OLDTOK");
  const otherId = await tokenId("NEWTOK");
  const docs: Record<string, Record<string, unknown>> = {
    ["purchases/" + refundedId]: fsDoc({ uid: "u1", sku: "wedding", ids: [], wid: "a__b", state: "granted" }).fields,
    ["weddings/a__b"]: fsDoc({ paid: true, paidBy: "u1", purchase: otherId, uids: ["a", "b"] }).fields,
  };
  const m = mockFetch(k, {
    "voidedpurchases": () => json({ voidedPurchases: [{ purchaseToken: "OLDTOK", orderId: "GPA.old" }] }),
    "firestore.googleapis.com": (url, init) => {
      const id = url.split("/documents/")[1].split("?")[0];
      if (init.method === "PATCH") { docs[id] = Object.assign(docs[id] || {}, JSON.parse(String(init.body)).fields); return json({ name: id }); }
      return docs[id] ? json({ fields: docs[id] }) : json({}, 404);
    },
  });
  try {
    const swept = await sweepRefunds(env(k));
    assert.equal(swept.revoked, 0);
    assert.equal((docs["weddings/a__b"].paid as { booleanValue?: boolean }).booleanValue, true);
    assert.equal((docs["weddings/a__b"].purchase as { stringValue?: string }).stringValue, otherId);
  } finally { m.restore(); }
});
