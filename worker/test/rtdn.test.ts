import { test } from "node:test";
import assert from "node:assert/strict";
import { decodeNote, handleRtdn } from "../src/rtdn";
import { makeKeys, env, mockFetch, json, signJwt } from "./util";

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
