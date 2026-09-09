import { test } from "node:test";
import assert from "node:assert/strict";
import { decodeNote, handleRtdn } from "../src/rtdn";
import { makeKeys, env, mockFetch, json, signJwt } from "./util";

const push = (note: unknown) => JSON.stringify({ message: { data: Buffer.from(JSON.stringify(note)).toString("base64"), messageId: "1" }, subscription: "s" });

test("decodeNote reads the Pub/Sub envelope and the Play notification inside", () => {
  const n = decodeNote(JSON.parse(push({ version: "1.0", packageName: "app.nabutarot.twa", eventTimeMillis: "1", subscriptionNotification: { version: "1.0", notificationType: 2, purchaseToken: "S1", subscriptionId: "plus_x" } })));
  assert.equal(n && n.packageName, "app.nabutarot.twa");
  assert.equal(n && n.subscriptionNotification && n.subscriptionNotification.purchaseToken, "S1");
  assert.equal(decodeNote({}), null);
});
test("a push without a valid Google token is refused; with one, an unknown token is ignored with 204", async () => {
  const k = await makeKeys();
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
