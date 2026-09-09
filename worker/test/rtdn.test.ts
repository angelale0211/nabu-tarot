import { test } from "node:test";
import assert from "node:assert/strict";
import { decodeNote, handleRtdn } from "../src/rtdn";
import { itemByKey } from "../src/catalog";
import { tokenId } from "../src/refunds";
import { makeKeys, env, mockFetch, json, fsDoc, signJwt } from "./util";

const push = (note: unknown) => JSON.stringify({ message: { data: Buffer.from(JSON.stringify(note)).toString("base64"), messageId: "1" }, subscription: "s" });

/* One keypair for the whole file. auth.ts caches Google's JWKS at module
   scope (keyCache, keyed by JWKS url) for the life of the worker, and every
   key from makeKeys() reuses the same kid ("k1"). A fresh keypair per test
   would collide with that cache: whichever test populates the GOOGLE_JWKS
   entry first wins it for every test after, so a later test signing with a
   different keypair under the same kid would fail signature verification -
   for the wrong reason, masking the thing under test. Same fixture pattern
   as billing.test.ts. */
const K = await makeKeys();

test("decodeNote reads the Pub/Sub envelope and the Play notification inside", () => {
  const n = decodeNote(JSON.parse(push({ version: "1.0", packageName: "app.nabutarot.twa", eventTimeMillis: "1", subscriptionNotification: { version: "1.0", notificationType: 2, purchaseToken: "S1", subscriptionId: "plus_x" } })));
  assert.equal(n && n.packageName, "app.nabutarot.twa");
  assert.equal(n && n.subscriptionNotification && n.subscriptionNotification.purchaseToken, "S1");
  assert.equal(decodeNote({}), null);
});
test("a push without a valid Google token is refused; with one, an unknown token is ignored with 204", async () => {
  const k = K;
  const m = mockFetch(k, { "firestore.googleapis.com": () => json({}, 404) });
  try {
    const e = env(k, { RTDN_AUDIENCE: "https://nabu-ai.test/rtdn", RTDN_PUSH_EMAIL: "nabu-worker@nabutarot.iam.gserviceaccount.com" });
    const body = push({ version: "1.0", packageName: "app.nabutarot.twa", subscriptionNotification: { notificationType: 3, purchaseToken: "NOPE", subscriptionId: "x" } });
    const bare = await handleRtdn(new Request("https://nabu-ai.test/rtdn", { method: "POST", body }), e as never);
    assert.equal(bare.status, 401);
    const now = Math.floor(Date.now() / 1000);
    const good = await signJwt(k, { iss: "https://accounts.google.com", aud: "https://nabu-ai.test/rtdn", email: "nabu-worker@nabutarot.iam.gserviceaccount.com", email_verified: true, exp: now + 600, iat: now, sub: "1" });
    const r = await handleRtdn(new Request("https://nabu-ai.test/rtdn", { method: "POST", headers: { Authorization: "Bearer " + good }, body }), e as never);
    assert.equal(r.status, 204);
    const wrongAud = await signJwt(k, { iss: "https://accounts.google.com", aud: "https://elsewhere", email: "nabu-worker@nabutarot.iam.gserviceaccount.com", email_verified: true, exp: now + 600, iat: now, sub: "1" });
    const r2 = await handleRtdn(new Request("https://nabu-ai.test/rtdn", { method: "POST", headers: { Authorization: "Bearer " + wrongAud }, body }), e as never);
    assert.equal(r2.status, 401);
  } finally { m.restore(); }
});
test("a validly-signed token naming a DIFFERENT service account is rejected, and nothing is written", async () => {
  const k = K;
  const m = mockFetch(k, { "firestore.googleapis.com": () => json({}, 404) });
  try {
    const e = env(k, { RTDN_AUDIENCE: "https://nabu-ai.test/rtdn", RTDN_PUSH_EMAIL: "nabu-worker@nabutarot.iam.gserviceaccount.com" });
    const body = push({ version: "1.0", packageName: "app.nabutarot.twa", subscriptionNotification: { notificationType: 3, purchaseToken: "NOPE", subscriptionId: "x" } });
    const now = Math.floor(Date.now() / 1000);
    // Same signing key (the mock JWKS only knows one), but a DIFFERENT GCP
    // customer's service-account email, aiming at the same public audience
    // string. This is exactly the forgery the audience alone cannot stop.
    const other = await signJwt(k, { iss: "https://accounts.google.com", aud: "https://nabu-ai.test/rtdn", email: "someone-else@another-project.iam.gserviceaccount.com", email_verified: true, exp: now + 600, iat: now, sub: "2" });
    const r = await handleRtdn(new Request("https://nabu-ai.test/rtdn", { method: "POST", headers: { Authorization: "Bearer " + other }, body }), e as never);
    assert.equal(r.status, 401);
    assert.equal(m.log.some((c) => c.method === "PATCH" && c.url.includes("firestore")), false);
  } finally { m.restore(); }
});
test("with RTDN_PUSH_EMAIL unset, even a validly-signed, right-audience token is rejected (fail closed, not open)", async () => {
  const k = K;
  const m = mockFetch(k, { "firestore.googleapis.com": () => json({}, 404) });
  try {
    const e = env(k, { RTDN_AUDIENCE: "https://nabu-ai.test/rtdn" }); // RTDN_PUSH_EMAIL deliberately absent
    const body = push({ version: "1.0", packageName: "app.nabutarot.twa", subscriptionNotification: { notificationType: 3, purchaseToken: "NOPE", subscriptionId: "x" } });
    const now = Math.floor(Date.now() / 1000);
    const good = await signJwt(k, { iss: "https://accounts.google.com", aud: "https://nabu-ai.test/rtdn", email: "anybody@any-project.iam.gserviceaccount.com", email_verified: true, exp: now + 600, iat: now, sub: "3" });
    const r = await handleRtdn(new Request("https://nabu-ai.test/rtdn", { method: "POST", headers: { Authorization: "Bearer " + good }, body }), e as never);
    assert.equal(r.status, 401);
  } finally { m.restore(); }
});

/* A voided-purchase notification about a SUBSCRIPTION is never taken as
   final. It used to write state:"voided" on the ledger row and remove
   nothing, on the understanding that the paired SUBSCRIPTION_REVOKED push
   would do the removing - but handleRtdn answers 204 whatever happens, so
   Pub/Sub never redelivers a push this worker dropped, and reconcile then
   skipped the "voided" row for good. Google is asked instead, and its answer
   is what is written: the same rule the rest of this file already follows. */
const pushed = async (k: Awaited<ReturnType<typeof makeKeys>>, e: Record<string, string>, body: string) => {
  const now = Math.floor(Date.now() / 1000);
  const jwt = await signJwt(k, { iss: "https://accounts.google.com", aud: "https://nabu-ai.test/rtdn", email: "nabu-worker@nabutarot.iam.gserviceaccount.com", email_verified: true, exp: now + 600, iat: now, sub: "1" });
  return handleRtdn(new Request("https://nabu-ai.test/rtdn", { method: "POST", headers: { Authorization: "Bearer " + jwt }, body }), e as never);
};
const rtdnEnv = (k: Awaited<ReturnType<typeof makeKeys>>) => env(k, { RTDN_AUDIENCE: "https://nabu-ai.test/rtdn", RTDN_PUSH_EMAIL: "nabu-worker@nabutarot.iam.gserviceaccount.com" });

test("a voided SUBSCRIPTION is re-asked of Google and written off from its real answer, not from the notification", async () => {
  const k = K;
  const plus = itemByKey("plus")!;
  const hash = await tokenId("SV1");
  const docs: Record<string, Record<string, unknown>> = {
    ["purchases/" + hash]: fsDoc({ uid: "u1", sku: plus.sku, kind: "subs", ids: ["plus"], state: "SUBSCRIPTION_STATE_ACTIVE", token: "SV1" }).fields as Record<string, unknown>,
    "users/u1": fsDoc({ access: { plus: "2099-01-01", tarot: "2099-01-01" }, subs: { plus: { sku: plus.sku, plan: "plus-12m", state: "SUBSCRIPTION_STATE_ACTIVE", until: "2099-01-01", autoRenew: true, tok: hash, opens: ["plus"], grant: true } } }).fields as Record<string, unknown>,
  };
  const m = mockFetch(k, {
    "androidpublisher.googleapis.com": () => json({ subscriptionState: "SUBSCRIPTION_STATE_EXPIRED", lineItems: [{ productId: plus.sku, expiryTime: new Date(Date.now() - 86400000).toISOString() }] }),
    "firestore.googleapis.com": (url, init) => { const id = url.split("/documents/")[1].split("?")[0]; if (init.method === "PATCH") { docs[id] = Object.assign(docs[id] || {}, JSON.parse(String(init.body)).fields); return json({}); } return docs[id] ? json({ fields: docs[id] }) : json({}, 404); },
  });
  try {
    const r = await pushed(k, rtdnEnv(k), push({ version: "1.0", packageName: "app.nabutarot.twa", voidedPurchaseNotification: { purchaseToken: "SV1", orderId: "GPA.1", productType: 2 } }));
    assert.equal(r.status, 204);
    const access = (docs["users/u1"].access as { mapValue: { fields: Record<string, { stringValue: string }> } }).mapValue.fields;
    assert.equal(access.plus, undefined);
    assert.equal(access.tarot.stringValue, "2099-01-01");
    // Google's state, not the word "voided" - so reconcile keeps this row in view.
    assert.equal((docs["purchases/" + hash].state as { stringValue?: string }).stringValue, "SUBSCRIPTION_STATE_EXPIRED");
  } finally { m.restore(); }
});

test("a voided SUBSCRIPTION Google cannot be asked about revokes nothing at all", async () => {
  const k = K;
  const plus = itemByKey("plus")!;
  const hash = await tokenId("SV3");
  const docs: Record<string, Record<string, unknown>> = {
    ["purchases/" + hash]: fsDoc({ uid: "u3", sku: plus.sku, kind: "subs", ids: ["plus"], state: "SUBSCRIPTION_STATE_ACTIVE", token: "SV3" }).fields as Record<string, unknown>,
    "users/u3": fsDoc({ access: { plus: "2099-01-01" } }).fields as Record<string, unknown>,
  };
  const m = mockFetch(k, {
    "androidpublisher.googleapis.com": () => json({ error: "boom" }, 503),
    "firestore.googleapis.com": (url, init) => { const id = url.split("/documents/")[1].split("?")[0]; if (init.method === "PATCH") { docs[id] = Object.assign(docs[id] || {}, JSON.parse(String(init.body)).fields); return json({}); } return docs[id] ? json({ fields: docs[id] }) : json({}, 404); },
  });
  try {
    const before = JSON.stringify(docs);
    const r = await pushed(k, rtdnEnv(k), push({ version: "1.0", packageName: "app.nabutarot.twa", voidedPurchaseNotification: { purchaseToken: "SV3", orderId: "GPA.3", productType: 2 } }));
    assert.equal(r.status, 204);
    assert.equal(JSON.stringify(docs), before, "nothing written: the row stays live for the next reconcile pass");
  } finally { m.restore(); }
});

/* A one-time purchase keeps the old behaviour: Google's voided list is the
   answer for a course, and a wedding is un-paid on the room that purchase
   actually paid for - never on a room that is no longer there. */
test("a voided one-time COURSE still takes its access back on the notification's word", async () => {
  const k = K;
  const hash = await tokenId("C1");
  const docs: Record<string, Record<string, unknown>> = {
    ["purchases/" + hash]: fsDoc({ uid: "u4", sku: "tarot", kind: "inapp", ids: ["tarot"], state: "granted", token: "C1" }).fields as Record<string, unknown>,
    "users/u4": fsDoc({ access: { tarot: "2099-01-01", lenormand: "2099-01-01" } }).fields as Record<string, unknown>,
  };
  const m = mockFetch(k, {
    "firestore.googleapis.com": (url, init) => { const id = url.split("/documents/")[1].split("?")[0]; if (init.method === "PATCH") { docs[id] = Object.assign(docs[id] || {}, JSON.parse(String(init.body)).fields); return json({}); } return docs[id] ? json({ fields: docs[id] }) : json({}, 404); },
  });
  try {
    const r = await pushed(k, rtdnEnv(k), push({ version: "1.0", packageName: "app.nabutarot.twa", voidedPurchaseNotification: { purchaseToken: "C1", orderId: "GPA.4", productType: 1 } }));
    assert.equal(r.status, 204);
    const access = (docs["users/u4"].access as { mapValue: { fields: Record<string, { stringValue: string }> } }).mapValue.fields;
    assert.equal(access.tarot, undefined);
    assert.equal(access.lenormand.stringValue, "2099-01-01");
    assert.equal((docs["purchases/" + hash].state as { stringValue?: string }).stringValue, "voided");
  } finally { m.restore(); }
});
