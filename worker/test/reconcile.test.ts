import { test } from "node:test";
import assert from "node:assert/strict";
import { reconcileSubs } from "../src/reconcile";
import { PLAY_ITEMS, itemByKey } from "../src/catalog";
import { makeKeys, env, mockFetch, json, fsDoc } from "./util";

/* One keypair for the whole file - see billing.test.ts / rtdn.test.ts for
   why: auth.ts and this file's own token cache in play.ts are module-scoped,
   and a fresh keypair per test would collide with a cache another test in
   this file already populated. */
const K = await makeKeys();

/* Input B1 has landed for all four subscription keys - "manifest", "plus",
   "pro6" and "pro" all carry real Play product ids now, so every test below
   reads its sku straight from the catalogue with `itemByKey(...).sku`
   instead of faking one. (The skip condition on the first test is left in
   place as a general guard, not because it still fires.) */

test("reconcile re-reads every live subscription row and rewrites the account", { skip: !PLAY_ITEMS.find((i) => i.key === "plus")!.sku && "B1: plus sku not filled" }, async () => {
  const k = K;
  const plus = PLAY_ITEMS.find((i) => i.key === "plus")!;
  const docs: Record<string, Record<string, unknown>> = { "purchases/h1": fsDoc({ uid: "u1", sku: plus.sku, kind: "subs", ids: ["plus"], state: "SUBSCRIPTION_STATE_ACTIVE", token: "S1" }).fields as Record<string, unknown>, "users/u1": fsDoc({ access: { plus: "2099-01-01" }, subs: {} }).fields as Record<string, unknown> };
  const m = mockFetch(k, {
    ":runQuery": () => json([{ document: { name: "projects/x/databases/(default)/documents/purchases/h1", fields: docs["purchases/h1"] } }]),
    "androidpublisher.googleapis.com": () => json({ subscriptionState: "SUBSCRIPTION_STATE_EXPIRED", lineItems: [{ productId: plus.sku, expiryTime: new Date(Date.now() - 1000).toISOString() }] }),
    "firestore.googleapis.com": (url, init) => { const id = url.split("/documents/")[1].split("?")[0]; if (init.method === "PATCH") { docs[id] = Object.assign(docs[id] || {}, JSON.parse(String(init.body)).fields); return json({}); } return docs[id] ? json({ fields: docs[id] }) : json({}, 404); },
  });
  try {
    const out = await reconcileSubs(env(k));
    assert.equal(out.looked, 1); assert.equal(out.changed, 1);
    const access = (docs["users/u1"].access as { mapValue: { fields: Record<string, unknown> } }).mapValue.fields;
    assert.equal(access.plus, undefined);
  } finally { m.restore(); }
});

test("without PLAY_SERVICE_ACCOUNT or FIREBASE_PROJECT_ID, reconcile is a no-op (not a crash)", async () => {
  const out = await reconcileSubs({});
  assert.deepEqual(out, { looked: 0, changed: 0, failed: 0 });
});

/* Binding rule: a transient Google failure (a 500, a timeout - anything that
   is not a clean 404 "no such purchase") must never be read as "this
   subscription is gone". checkSubscription already turns that into
   `{ ok:false, why:"play 500" }` rather than a thrown 404-style refusal;
   reconcileSubs must count that row as failed and move on WITHOUT calling
   applySubscription, so an outage at Google can never revoke a payer. And one
   bad row must not stop the row after it from being reconciled normally. */
test("a transient Google failure on one row never revokes it, is counted failed, and does not stop the next row", async () => {
  const k = K;
  const plusSku = itemByKey("plus")!.sku;
  const proSku = itemByKey("pro")!.sku;
  const docs: Record<string, Record<string, unknown>> = {
    "purchases/bad": fsDoc({ uid: "u1", sku: plusSku, kind: "subs", ids: ["plus"], state: "SUBSCRIPTION_STATE_ACTIVE", token: "BAD" }).fields as Record<string, unknown>,
    "purchases/ok": fsDoc({ uid: "u2", sku: proSku, kind: "subs", ids: ["pro", "plus"], state: "SUBSCRIPTION_STATE_CANCELED", token: "OK" }).fields as Record<string, unknown>,
    "users/u1": fsDoc({ access: { plus: "2099-01-01" }, subs: { plus: { sku: plusSku, plan: "p", state: "SUBSCRIPTION_STATE_ACTIVE", until: "2099-01-01", autoRenew: true, tok: "h", opens: ["plus"], grant: true } } }).fields as Record<string, unknown>,
    "users/u2": fsDoc({ access: {}, subs: {} }).fields as Record<string, unknown>,
  };
  const okExpiry = new Date(Date.now() + 30 * 86400000).toISOString();
  const m = mockFetch(k, {
    ":runQuery": () => json([
      { document: { name: "projects/x/databases/(default)/documents/purchases/bad", fields: docs["purchases/bad"] } },
      { document: { name: "projects/x/databases/(default)/documents/purchases/ok", fields: docs["purchases/ok"] } },
    ]),
    "androidpublisher.googleapis.com": (url) => {
      if (url.includes("/tokens/BAD")) return json({ error: "boom" }, 500);
      return json({ subscriptionState: "SUBSCRIPTION_STATE_ACTIVE", acknowledgementState: "ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED", lineItems: [{ productId: proSku, expiryTime: okExpiry, autoRenewingPlan: { autoRenewEnabled: true }, offerDetails: { basePlanId: "pro-annual" } }] });
    },
    "firestore.googleapis.com": (url, init) => { const id = url.split("/documents/")[1].split("?")[0]; if (init.method === "PATCH") { docs[id] = Object.assign(docs[id] || {}, JSON.parse(String(init.body)).fields); return json({}); } return docs[id] ? json({ fields: docs[id] }) : json({}, 404); },
  });
  try {
    const before = JSON.stringify(docs["users/u1"]);
    const out = await reconcileSubs(env(k));
    assert.equal(out.looked, 2);
    assert.equal(out.failed, 1);
    assert.equal(out.changed, 1); // only the OK row's state actually moved (CANCELED -> ACTIVE)
    // The failed row's account: byte-for-byte untouched. No revoke, ever, on a transient failure.
    assert.equal(JSON.stringify(docs["users/u1"]), before);
    // The good row still went through despite the other row's failure.
    const access2 = (docs["users/u2"].access as { mapValue: { fields: Record<string, { stringValue: string }> } }).mapValue.fields;
    assert.equal(access2.pro.stringValue, okExpiry.slice(0, 10));
  } finally { m.restore(); }
});

/* The one extra requirement this task carries beyond the brief: prove that
   reconcileSubs is the self-healing this system was told to rely on. A known
   gap in applySubscription (read-modify-write of users/{uid}, no
   compare-and-set) was accepted on the explicit grounds that this job repairs
   whatever it loses. Here that loss is simulated directly: a user whose
   users/{uid}.subs map is missing the "plus" row entirely (as if a
   concurrent write for a different key clobbered it), while the ledger still
   remembers the purchase and its raw token. Reconciliation must re-fetch that
   subscription from Google and put the row - and the access it grants - back,
   without disturbing the sibling "manifest" row that was never lost. (The
   sibling deliberately is NOT "pro": pro/pro6 open BOTH "pro" and "plus", so
   a healthy pro row would itself keep granting "plus" and mask a failure to
   restore the lost plus row. "manifest" opens only "manifest", so it cannot
   overlap with what is under test.) */
test("SELF-HEALING: a subs row missing from users/{uid} (lost to a concurrent write) is restored by the next reconcile pass", async () => {
  const k = K;
  const plusSku = itemByKey("plus")!.sku;
  const manifestSku = itemByKey("manifest")!.sku;
  const expiry = new Date(Date.now() + 60 * 86400000).toISOString();
  const untilDay = expiry.slice(0, 10);
  const docs: Record<string, Record<string, unknown>> = {
    /* The ledger still knows about the plus purchase - it is never touched
       by the lost users/{uid} write, since it lives in a different document. */
    "purchases/lost": fsDoc({ uid: "u1", sku: plusSku, kind: "subs", ids: ["plus"], state: "SUBSCRIPTION_STATE_IN_GRACE_PERIOD", token: "S-LOST" }).fields as Record<string, unknown>,
    /* users/u1.subs has "manifest" but NOT "plus" - the simulated lost row -
       and access.plus was already dropped along with it (recompute derives
       access only from what is in subs). */
    "users/u1": fsDoc({
      access: { manifest: "2099-01-01" },
      subs: { manifest: { sku: manifestSku, plan: "manifest-12m", state: "SUBSCRIPTION_STATE_ACTIVE", until: "2099-01-01", autoRenew: true, tok: "hman", opens: ["manifest"], grant: true } },
    }).fields as Record<string, unknown>,
  };
  const m = mockFetch(k, {
    /* Reads the CURRENT ledger doc each time, so a second pass sees what the
       first pass wrote - the idempotency check below depends on this. */
    ":runQuery": () => json([{ document: { name: "projects/x/databases/(default)/documents/purchases/lost", fields: docs["purchases/lost"] } }]),
    "androidpublisher.googleapis.com": () => json({ subscriptionState: "SUBSCRIPTION_STATE_ACTIVE", acknowledgementState: "ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED", lineItems: [{ productId: plusSku, expiryTime: expiry, autoRenewingPlan: { autoRenewEnabled: true }, offerDetails: { basePlanId: "plus-12m" } }] }),
    "firestore.googleapis.com": (url, init) => { const id = url.split("/documents/")[1].split("?")[0]; if (init.method === "PATCH") { docs[id] = Object.assign(docs[id] || {}, JSON.parse(String(init.body)).fields); return json({}); } return docs[id] ? json({ fields: docs[id] }) : json({}, 404); },
  });
  try {
    const out = await reconcileSubs(env(k));
    assert.equal(out.looked, 1);
    assert.equal(out.failed, 0);
    assert.equal(out.changed, 1); // IN_GRACE_PERIOD -> ACTIVE

    const subsField = (docs["users/u1"].subs as { mapValue: { fields: Record<string, { mapValue: { fields: Record<string, { stringValue?: string; booleanValue?: boolean }> } }> } }).mapValue.fields;
    // The lost row is back.
    assert.equal(subsField.plus.mapValue.fields.state.stringValue, "SUBSCRIPTION_STATE_ACTIVE");
    assert.equal(subsField.plus.mapValue.fields.until.stringValue, untilDay);
    // The sibling row that was never lost is untouched.
    assert.equal(subsField.manifest.mapValue.fields.state.stringValue, "SUBSCRIPTION_STATE_ACTIVE");
    assert.equal(subsField.manifest.mapValue.fields.until.stringValue, "2099-01-01");

    const accessField = (docs["users/u1"].access as { mapValue: { fields: Record<string, { stringValue: string }> } }).mapValue.fields;
    assert.equal(accessField.plus.stringValue, untilDay); // access restored too, not just the subs row
    assert.equal(accessField.manifest.stringValue, "2099-01-01"); // untouched

    // Idempotent: running it again with the now-consistent state changes nothing further.
    const again = await reconcileSubs(env(k));
    assert.equal(again.looked, 1);
    assert.equal(again.changed, 0); // ledger's state was updated to ACTIVE by the first pass
    assert.equal(again.failed, 0);
  } finally { m.restore(); }
});

/* onVoided used to write state:"voided" on a subs ledger row and remove
   nothing - right for a plain refund, where the paired SUBSCRIPTION_REVOKED
   push does the removing - and reconcile then skipped a "voided" row for
   good. handleRtdn answers 204 whatever happens, so Pub/Sub never redelivers:
   one transient failure on that paired push and paid access stood for ever,
   with the backstop switched off for exactly the row that needed it. Nothing
   but Google's own EXPIRED retires a row now. */
test("a subs row marked voided is still re-examined, and loses its access when Google says it is gone", async () => {
  const k = K;
  const plus = itemByKey("plus")!;
  const docs: Record<string, Record<string, unknown>> = {
    "purchases/hv": fsDoc({ uid: "u1", sku: plus.sku, kind: "subs", ids: ["plus"], state: "voided", token: "SV" }).fields as Record<string, unknown>,
    "users/u1": fsDoc({ access: { plus: "2099-01-01", tarot: "2099-01-01" }, subs: { plus: { sku: plus.sku, plan: "plus-12m", state: "SUBSCRIPTION_STATE_ACTIVE", until: "2099-01-01", autoRenew: true, tok: "hv", opens: ["plus"], grant: true } } }).fields as Record<string, unknown>,
  };
  const m = mockFetch(k, {
    ":runQuery": () => json([{ document: { name: "projects/x/databases/(default)/documents/purchases/hv", fields: docs["purchases/hv"] } }]),
    "androidpublisher.googleapis.com": () => json({ subscriptionState: "SUBSCRIPTION_STATE_EXPIRED", lineItems: [{ productId: plus.sku, expiryTime: new Date(Date.now() - 86400000).toISOString() }] }),
    "firestore.googleapis.com": (url, init) => { const id = url.split("/documents/")[1].split("?")[0]; if (init.method === "PATCH") { docs[id] = Object.assign(docs[id] || {}, JSON.parse(String(init.body)).fields); return json({}); } return docs[id] ? json({ fields: docs[id] }) : json({}, 404); },
  });
  try {
    const out = await reconcileSubs(env(k));
    assert.equal(out.looked, 1, "the voided row was looked at, not skipped for good");
    assert.equal(out.changed, 1);
    const access = (docs["users/u1"].access as { mapValue: { fields: Record<string, { stringValue: string }> } }).mapValue.fields;
    assert.equal(access.plus, undefined);                       // the access that should have gone, went
    assert.equal(access.tarot.stringValue, "2099-01-01");       // the course it never touched, stayed
  } finally { m.restore(); }
});

test("a voided subs row that Google cannot be asked about is NOT revoked - a transient failure never takes access away", async () => {
  const k = K;
  const plus = itemByKey("plus")!;
  const docs: Record<string, Record<string, unknown>> = {
    "purchases/hv2": fsDoc({ uid: "u9", sku: plus.sku, kind: "subs", ids: ["plus"], state: "voided", token: "SV2" }).fields as Record<string, unknown>,
    "users/u9": fsDoc({ access: { plus: "2099-01-01" }, subs: { plus: { sku: plus.sku, plan: "plus-12m", state: "SUBSCRIPTION_STATE_ACTIVE", until: "2099-01-01", autoRenew: true, tok: "hv2", opens: ["plus"], grant: true } } }).fields as Record<string, unknown>,
  };
  const m = mockFetch(k, {
    ":runQuery": () => json([{ document: { name: "projects/x/databases/(default)/documents/purchases/hv2", fields: docs["purchases/hv2"] } }]),
    "androidpublisher.googleapis.com": () => json({ error: "boom" }, 503),
    "firestore.googleapis.com": (url, init) => { const id = url.split("/documents/")[1].split("?")[0]; if (init.method === "PATCH") { docs[id] = Object.assign(docs[id] || {}, JSON.parse(String(init.body)).fields); return json({}); } return docs[id] ? json({ fields: docs[id] }) : json({}, 404); },
  });
  try {
    const before = JSON.stringify(docs["users/u9"]);
    const out = await reconcileSubs(env(k));
    assert.equal(out.looked, 1); assert.equal(out.failed, 1); assert.equal(out.changed, 0);
    assert.equal(JSON.stringify(docs["users/u9"]), before);
  } finally { m.restore(); }
});
