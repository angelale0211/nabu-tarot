import { test } from "node:test";
import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import worker from "../src/index";
import { accountToken, appleState, appleJwt, jwsPayload } from "../src/apple";
import { reconcileSubs } from "../src/reconcile";
import { itemByKey } from "../src/catalog";
import { makeKeys, env, ctx, mockFetch, json, idToken, fsDoc, signJwt } from "./util";

/* One keypair for the whole file, for the same module-cache reason as
   billing.test.ts. The App Store key is its own EC P-256 key, as a real .p8 is. */
const K = await makeKeys();
const ec = await webcrypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]) as CryptoKeyPair;
const P8 = "-----BEGIN PRIVATE KEY-----\n" + Buffer.from(await webcrypto.subtle.exportKey("pkcs8", ec.privateKey)).toString("base64") + "\n-----END PRIVATE KEY-----\n";
const APPLE = { APPLE_BUNDLE_ID: "app.nabutarot.ios", APPLE_ISSUER_ID: "iss-1", APPLE_KEY_ID: "KEY123", APPLE_PRIVATE_KEY: P8 };
const E = () => env(K, APPLE);

const b64 = (o: unknown) => Buffer.from(JSON.stringify(o)).toString("base64url");
/* Apple's JWS as the worker reads it: header, payload, a signature it never checks. */
const jws = (payload: unknown) => b64({ alg: "ES256", x5c: [] }) + "." + b64(payload) + ".sig";
const DAY = 86400000;

interface Store { tx: Record<string, Record<string, unknown>>; subs: Record<string, { status: number; renew?: Record<string, unknown> }>; sandboxOnly?: boolean; down?: number }
function world(apple: Store) {
  const docs: Record<string, Record<string, unknown>> = {};
  const answer = (url: string) => {
    if (apple.down) return json({}, apple.down);
    const sandbox = url.includes("storekit-sandbox");
    if (apple.sandboxOnly && !sandbox) return json({ errorCode: 4040010 }, 404);
    const id = url.split("/").pop() as string;
    /* Apple answers for an original transaction id too: it is itself a transaction. */
    const find = (x: string) => apple.tx[x] || Object.values(apple.tx).filter((t) => String(t.originalTransactionId) === x).sort((a, b) => Number(a.purchaseDate) - Number(b.purchaseDate))[0];
    if (url.includes("/inApps/v1/transactions/")) return find(id) ? json({ signedTransactionInfo: jws(find(id)) }) : json({ errorCode: 4040010 }, 404);
    if (url.includes("/inApps/v1/subscriptions/")) {
      const t = find(id); if (!t) return json({}, 404);
      const orig = String(t.originalTransactionId);
      const last = Object.values(apple.tx).filter((x) => String(x.originalTransactionId) === orig).sort((a, b) => Number(b.purchaseDate) - Number(a.purchaseDate))[0];
      const s = apple.subs[orig];
      return json({ data: [{ subscriptionGroupIdentifier: "g", lastTransactions: [{ originalTransactionId: orig, status: s.status, signedTransactionInfo: jws(last), signedRenewalInfo: jws(s.renew || { autoRenewStatus: 1 }) }] }] });
    }
    return json({}, 404);
  };
  const m = mockFetch(K, {
    "api.storekit": (url, init) => { assert.match(String((init.headers as Record<string, string>).Authorization), /^Bearer ey/); return answer(url); },
    ":runQuery": () => json(Object.keys(docs).filter((k) => k.indexOf("purchases/") === 0).map((k) => ({ document: { name: "projects/x/databases/(default)/documents/" + k, fields: docs[k] } }))),
    "firestore.googleapis.com": (url, init) => {
      const id = url.split("/documents/")[1].split("?")[0];
      if (init.method === "PATCH") {
        if (url.includes("currentDocument.exists=false") && docs[id]) return json({}, 409);
        if (url.includes("currentDocument.exists=true") && !docs[id]) return json({}, 404);
        docs[id] = Object.assign(docs[id] || {}, JSON.parse(String(init.body)).fields);
        return json({ name: id });
      }
      return docs[id] ? json({ fields: docs[id] }) : json({}, 404);
    },
  });
  return { docs, m };
}
const post = async (uid: string, body: unknown, path = "/billing") => {
  const c = ctx();
  const r = await worker.fetch(new Request("https://nabu-ai.test" + path, { method: "POST", headers: { Authorization: "Bearer " + await idToken(K, uid), "Content-Type": "application/json", "CF-Connecting-IP": "1.2.3.4" }, body: JSON.stringify(body) }), E() as never, c as never);
  await c.done();
  const text = await r.text();
  return { status: r.status, body: (text ? JSON.parse(text) : {}) as Record<string, unknown> };
};
const s = (f: unknown) => (f as { stringValue: string }).stringValue;
const map = (f: unknown) => (f as { mapValue: { fields: Record<string, unknown> } }).mapValue.fields;
const course = (id: string, uid: string, extra: Record<string, unknown> = {}) => ({ transactionId: id, originalTransactionId: id, bundleId: "app.nabutarot.ios", productId: "tarot", purchaseDate: Date.UTC(2026, 8, 1), type: "Non-Renewing Subscription", appAccountToken: uid, ...extra });

test("the account token is a stable version-5 UUID, the same the phone computes", async () => {
  const a = await accountToken("uid-1"), b = await accountToken("uid-1"), c = await accountToken("uid-2");
  assert.match(a, /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  assert.equal(a, b); assert.notEqual(a, c);
  /* Derived again here the long way, so the recipe itself is pinned: sha256("nabu-tarot:" + uid), first
     16 bytes, version and variant bits. billing-apple.js follows the same recipe and test.html pins the
     same value for the same uid. */
  const h = webcrypto.getRandomValues ? Buffer.from(await webcrypto.subtle.digest("SHA-256", new TextEncoder().encode("nabu-tarot:nabu-test-uid"))).subarray(0, 16) : Buffer.alloc(16);
  h[6] = (h[6] & 0x0f) | 0x50; h[8] = (h[8] & 0x3f) | 0x80;
  const x = h.toString("hex");
  assert.equal(await accountToken("nabu-test-uid"), [x.slice(0, 8), x.slice(8, 12), x.slice(12, 16), x.slice(16, 20), x.slice(20)].join("-"));
});

test("the App Store key signs an ES256 token for this app, which the key's public half verifies", async () => {
  const t = await appleJwt(E());
  const [h, c, sig] = t.split(".");
  const head = JSON.parse(Buffer.from(h, "base64url").toString()), claim = JSON.parse(Buffer.from(c, "base64url").toString());
  assert.equal(head.alg, "ES256"); assert.equal(head.kid, "KEY123");
  assert.equal(claim.iss, "iss-1"); assert.equal(claim.aud, "appstoreconnect-v1"); assert.equal(claim.bid, "app.nabutarot.ios");
  assert.ok(claim.exp - claim.iat <= 3600);
  const ok = await webcrypto.subtle.verify({ name: "ECDSA", hash: "SHA-256" }, ec.publicKey, Buffer.from(sig, "base64url"), new TextEncoder().encode(h + "." + c));
  assert.equal(ok, true);
  assert.deepEqual(jwsPayload(jws({ a: 1 })), { a: 1 });
});

test("Apple's subscription statuses read as the states the rest of the app already knows", () => {
  assert.equal(appleState(1, true), "SUBSCRIPTION_STATE_ACTIVE");
  assert.equal(appleState(1, false), "SUBSCRIPTION_STATE_CANCELED");
  assert.equal(appleState(4, true), "SUBSCRIPTION_STATE_IN_GRACE_PERIOD");
  assert.equal(appleState(3, true), "SUBSCRIPTION_STATE_ON_HOLD");
  assert.equal(appleState(2, false), "SUBSCRIPTION_STATE_EXPIRED");
  assert.equal(appleState(5, true), "SUBSCRIPTION_STATE_EXPIRED");
});

test("a course bought in the iPhone app: six months from Apple's purchase date, once, for the account that bought it", async () => {
  const u1 = await accountToken("u1");
  const w = world({ tx: { "1001": course("1001", u1) }, subs: {} });
  try {
    const a = await post("u1", { store: "apple", sku: "tarot", token: "1001" });
    assert.equal(a.status, 200); assert.deepEqual(a.body.opened, ["tarot"]);
    assert.equal((a.body.access as Record<string, string>).tarot, "2027-03-01");
    const again = await post("u1", { store: "apple", sku: "tarot", token: "1001" });
    assert.equal(again.status, 200); assert.equal((again.body.access as Record<string, string>).tarot, "2027-03-01");
    const row = Object.keys(w.docs).find((k) => k.indexOf("purchases/") === 0) as string;
    assert.equal(s(w.docs[row].store), "apple"); assert.equal(s(w.docs[row].token), "apple:1001");
  } finally { w.m.restore(); }
});

/* The rule that replaced "the first account keeps it for ever": the App Store
   sells a course or a subscription to an Apple Account once, so whoever
   presents that purchase is the person who paid for it, and it follows them.
   One account holds it at a time - which is what stops it being shared. */
test("a course follows its buyer to their new account, and leaves the old one", async () => {
  const w = world({ tx: { "1001": course("1001", await accountToken("u1")) }, subs: {} });
  try {
    assert.equal((await post("u1", { store: "apple", sku: "tarot", token: "1001" })).status, 200);
    const moved = await post("u2", { store: "apple", sku: "tarot", token: "1001" });
    assert.equal(moved.status, 200, "the same Apple purchase, presented by another Nabu account");
    assert.deepEqual(moved.body.opened, ["tarot"]);
    const row = Object.keys(w.docs).find((k) => k.indexOf("purchases/") === 0) as string;
    assert.equal(s(w.docs[row].uid), "u2"); assert.equal(s(w.docs[row].from), "u1");
    assert.ok(s(w.docs[row].movedAt), "the move is written down");
    assert.equal(map(w.docs["users/u1"].access).tarot, undefined, "and the account that held it lets go");
    assert.equal(s(map(w.docs["users/u2"].access).tarot), "2027-03-01");
  } finally { w.m.restore(); }
});

test("a purchase moves once a day, not back and forth all afternoon", async () => {
  const w = world({ tx: { "1002": course("1002", "", { appAccountToken: undefined }) }, subs: {} });
  try {
    assert.equal((await post("u1", { store: "apple", sku: "tarot", token: "1002" })).status, 200);
    assert.equal((await post("u2", { store: "apple", sku: "tarot", token: "1002" })).status, 200);
    const back = await post("u1", { store: "apple", sku: "tarot", token: "1002" });
    assert.equal(back.status, 402); assert.equal(back.body.error, "already used");
  } finally { w.m.restore(); }
});

test("a purchase Apple says belongs to another Nabu account, and that nothing has ever claimed, is still refused", async () => {
  const w = world({ tx: { "1003": course("1003", await accountToken("u1")) }, subs: {} });
  try {
    /* Nobody is holding it, so there is no buyer to put right and no owner to
       take it from - only an id somebody would be guessing with. */
    const b = await post("u2", { store: "apple", sku: "tarot", token: "1003" });
    assert.equal(b.status, 402); assert.equal(b.body.error, "already used");
    assert.equal(Object.keys(w.docs).find((k) => k.indexOf("purchases/") === 0), undefined, "and nothing was written");
  } finally { w.m.restore(); }
});

test("the phone cannot name a product it did not buy, another app's purchase, a refunded one, or a made-up id", async () => {
  const u1 = await accountToken("u1");
  const w = world({ tx: {
    "2001": course("2001", u1),
    "2002": course("2002", u1, { bundleId: "com.someone.else" }),
    "2003": course("2003", u1, { revocationDate: Date.now() }),
  }, subs: {} });
  try {
    assert.equal((await post("u1", { store: "apple", sku: "lenormand", token: "2001" })).body.error, "product mismatch");
    assert.equal((await post("u1", { store: "apple", sku: "tarot", token: "2002" })).body.error, "wrong app");
    assert.equal((await post("u1", { store: "apple", sku: "tarot", token: "2003" })).body.error, "refunded");
    assert.equal((await post("u1", { store: "apple", sku: "tarot", token: "9999" })).body.error, "unknown purchase");
    assert.equal((await post("u1", { store: "apple", sku: "tarot", token: "../../x" })).status, 400);
    assert.equal(Object.keys(w.docs).filter((k) => k.indexOf("users/") === 0).length, 0, "nothing was opened");
  } finally { w.m.restore(); }
});

test("a purchase only the sandbox knows (TestFlight, App Review) is found there", async () => {
  const u1 = await accountToken("u1");
  const w = world({ tx: { "3001": course("3001", u1) }, subs: {}, sandboxOnly: true });
  try {
    const a = await post("u1", { store: "apple", sku: "tarot", token: "3001" });
    assert.equal(a.status, 200);
    assert.ok(w.m.log.some((l) => l.url.includes("api.storekit-sandbox.itunes.apple.com")));
  } finally { w.m.restore(); }
});

test("Apple being down is 502 so the phone tries again - never a refusal, never a grant", async () => {
  const w = world({ tx: {}, subs: {}, down: 503 });
  try {
    const a = await post("u1", { store: "apple", sku: "tarot", token: "4001" });
    assert.equal(a.status, 502);
    assert.equal(Object.keys(w.docs).length, 0);
  } finally { w.m.restore(); }
});

/* The case that sent people to write in: buy Pro, delete the Nabu account or
   simply sign up again, and the App Store will not sell the same subscription
   twice - it hands back the purchase already made, which the ledger then read
   as somebody else's. The subscription follows its buyer instead. */
test("a subscription follows its buyer to their new account, and the old one stops holding it", async () => {
  const u1 = await accountToken("u1");
  const plus = itemByKey("plus")!;
  const exp = Date.now() + 300 * DAY;
  const apple: Store = { tx: { "6001": { transactionId: "6001", originalTransactionId: "6000", bundleId: "app.nabutarot.ios", productId: plus.sku, purchaseDate: Date.now() - DAY, expiresDate: exp, appAccountToken: u1 } }, subs: { "6000": { status: 1 } } };
  const w = world(apple);
  try {
    assert.equal((await post("u1", { store: "apple", sku: plus.sku, token: "6001" })).status, 200);
    const moved = await post("u2", { store: "apple", sku: plus.sku, token: "6001" });
    assert.equal(moved.status, 200); assert.deepEqual(moved.body.opened, ["plus"]);
    assert.equal((moved.body.subs as Record<string, Record<string, unknown>>).plus.grant, true);
    const row = Object.keys(w.docs).find((k) => k.indexOf("purchases/") === 0) as string;
    assert.equal(s(w.docs[row].uid), "u2"); assert.equal(s(w.docs[row].from), "u1");
    const before = map(w.docs["users/u1"].subs).plus as { mapValue: { fields: Record<string, unknown> } };
    assert.equal((before.mapValue.fields.grant as { booleanValue: boolean }).booleanValue, false, "the old account's row stops granting");
    assert.equal(map(w.docs["users/u1"].access).plus, undefined, "and its access goes with it");
  } finally { w.m.restore(); }
});

test("a subscription: Plus granted to Apple's expiry, marked as the App Store's; upgrading to Pro retires Plus on the same purchase", async () => {
  const u1 = await accountToken("u1");
  const plus = itemByKey("plus")!, pro = itemByKey("pro")!;
  const exp = Date.now() + 300 * DAY;
  const apple: Store = { tx: { "5001": { transactionId: "5001", originalTransactionId: "5000", bundleId: "app.nabutarot.ios", productId: plus.sku, purchaseDate: Date.now() - DAY, expiresDate: exp, appAccountToken: u1 } }, subs: { "5000": { status: 1 } } };
  const w = world(apple);
  try {
    const a = await post("u1", { store: "apple", sku: plus.sku, token: "5001" });
    assert.equal(a.status, 200); assert.deepEqual(a.body.opened, ["plus"]);
    const row = (a.body.subs as Record<string, Record<string, unknown>>).plus;
    assert.equal(row.state, "SUBSCRIPTION_STATE_ACTIVE"); assert.equal(row.store, "apple"); assert.equal(row.grant, true);
    /* Apple moves the same original purchase to Pro. */
    apple.tx["5002"] = { transactionId: "5002", originalTransactionId: "5000", bundleId: "app.nabutarot.ios", productId: pro.sku, purchaseDate: Date.now(), expiresDate: exp + 60 * DAY, appAccountToken: u1 };
    const b = await post("u1", { store: "apple", sku: pro.sku, token: "5002" });
    assert.equal(b.status, 200); assert.deepEqual(b.body.opened, ["pro", "plus"]);
    const subs = b.body.subs as Record<string, Record<string, unknown>>;
    assert.equal(subs.pro.grant, true); assert.equal(subs.plus.grant, false); assert.equal(subs.plus.state, "SUBSCRIPTION_STATE_EXPIRED");
    const ledger = Object.keys(w.docs).filter((k) => k.indexOf("purchases/") === 0);
    assert.equal(ledger.length, 1, "one purchase, one ledger row"); assert.equal(s(w.docs[ledger[0]].sku), pro.sku);
  } finally { w.m.restore(); }
});

test("a wedding bought in the iPhone app pays exactly the room it names", async () => {
  const u1 = await accountToken("u1");
  const w = world({ tx: { "6001": { ...course("6001", u1), productId: "wedding", type: "Consumable" } }, subs: {} });
  w.docs["weddings/u1__u9"] = fsDoc({ uids: ["u1", "u9"], paid: false }).fields as Record<string, unknown>;
  try {
    assert.equal((await post("u1", { store: "apple", sku: "wedding", token: "6001" })).status, 400);   // no room named
    const a = await post("u1", { store: "apple", sku: "wedding", token: "6001", wid: "u1__u9" });
    assert.equal(a.status, 200);
    assert.equal((w.docs["weddings/u1__u9"].paid as { booleanValue: boolean }).booleanValue, true);
    /* And it stays paid for that room. A course or a subscription follows its
       buyer to a new account; a wedding was bought for two people in a room,
       so there is nothing for it to follow. */
    const other = await post("u2", { store: "apple", sku: "wedding", token: "6001", wid: "u2__u8" });
    assert.equal(other.status, 402); assert.equal(other.body.error, "already used");
    const row = Object.keys(w.docs).find((k) => k.indexOf("purchases/") === 0) as string;
    assert.equal(s(w.docs[row].uid), "u1"); assert.equal(s(w.docs[row].wid), "u1__u9");
  } finally { w.m.restore(); }
});

test("a refund notification is re-asked of Apple: a course Apple says was revoked is taken back, a forged one changes nothing", async () => {
  const u1 = await accountToken("u1");
  const apple: Store = { tx: { "7001": course("7001", u1) }, subs: {} };
  const w = world(apple);
  try {
    assert.equal((await post("u1", { store: "apple", sku: "tarot", token: "7001" })).status, 200);
    const notice = { signedPayload: jws({ notificationType: "REFUND", data: { bundleId: "app.nabutarot.ios", signedTransactionInfo: jws(course("7001", u1, { revocationDate: Date.now() })) } }) };
    /* Forged: the notification says refunded, Apple does not. */
    assert.equal((await post("u1", notice, "/asn")).status, 200);
    assert.ok(map(w.docs["users/u1"].access).tarot, "a notification's word alone takes nothing back");
    /* Real: Apple now reports the revocation. */
    apple.tx["7001"] = course("7001", u1, { revocationDate: Date.now() });
    assert.equal((await post("u1", notice, "/asn")).status, 200);
    assert.equal(map(w.docs["users/u1"].access).tarot, undefined);
    const row = Object.keys(w.docs).find((k) => k.indexOf("purchases/") === 0) as string;
    assert.equal(s(w.docs[row].state), "voided");
    /* Another app's notification, or nonsense, is still a 200 and ignored. */
    assert.equal((await post("u1", { signedPayload: jws({ notificationType: "REFUND", data: { bundleId: "com.other" } }) }, "/asn")).status, 200);
    assert.equal((await post("u1", { signedPayload: "garbage" }, "/asn")).status, 200);
  } finally { w.m.restore(); }
});

test("a lapsed App Store subscription is caught by the notification and by the six-hourly reconcile", async () => {
  const u1 = await accountToken("u1");
  const plus = itemByKey("plus")!;
  const apple: Store = { tx: { "8001": { transactionId: "8001", originalTransactionId: "8000", bundleId: "app.nabutarot.ios", productId: plus.sku, purchaseDate: Date.now() - DAY, expiresDate: Date.now() + 30 * DAY, appAccountToken: u1 } }, subs: { "8000": { status: 1 } } };
  const w = world(apple);
  try {
    assert.equal((await post("u1", { store: "apple", sku: plus.sku, token: "8001" })).status, 200);
    assert.ok(map(w.docs["users/u1"].access).plus);
    apple.subs["8000"] = { status: 2, renew: { autoRenewStatus: 0 } };
    apple.tx["8001"].expiresDate = Date.now() - 1000;
    const out = await reconcileSubs(E());
    assert.equal(out.looked, 1); assert.equal(out.changed, 1);
    assert.equal(map(w.docs["users/u1"].access).plus, undefined);
  } finally { w.m.restore(); }
});

test("with no App Store key the iPhone path says not configured, and /asn is not there", async () => {
  const c = ctx();
  const r = await worker.fetch(new Request("https://nabu-ai.test/billing", { method: "POST", headers: { Authorization: "Bearer " + await idToken(K, "u1"), "Content-Type": "application/json" }, body: JSON.stringify({ store: "apple", sku: "tarot", token: "1" }) }), env(K) as never, c as never);
  const m = mockFetch(K, {});
  try {
    assert.equal(r.status, 500);
    const a = await worker.fetch(new Request("https://nabu-ai.test/asn", { method: "POST", body: "{}" }), env(K) as never, ctx() as never);
    assert.equal(a.status, 404);
  } finally { m.restore(); }
});

/* ---- revoking Sign in with Apple when an account is deleted ---- */
const SIWA = { APPLE_TEAM_ID: "TEAM1", APPLE_SIWA_KEY_ID: "SIWA1", APPLE_SIWA_PRIVATE_KEY: P8 };
const appleUser = (uid: string, appleSub: string) => {
  const now = Math.floor(Date.now() / 1000);
  return signJwt(K, { aud: "nabutarot", iss: "https://securetoken.google.com/nabutarot", sub: uid, exp: now + 3600, iat: now, firebase: { identities: appleSub ? { "apple.com": [appleSub] } : {}, sign_in_provider: appleSub ? "apple.com" : "password" } });
};
const revoke = async (tok: string, code: string, extra: Record<string, string> = SIWA) => {
  const r = await worker.fetch(new Request("https://nabu-ai.test/apple-revoke", { method: "POST", headers: { Authorization: "Bearer " + tok, "Content-Type": "application/json" }, body: JSON.stringify({ code }) }), env(K, { ...APPLE, ...extra }) as never, ctx() as never);
  return { status: r.status, body: await r.json() as Record<string, unknown> };
};

test("deleting an Apple account revokes its Sign in with Apple - the code is exchanged, and only this Apple ID's token is revoked", async () => {
  const calls: { url: string; body: string }[] = [];
  const m = mockFetch(K, {
    "appleid.apple.com/auth/token": (url, init) => { calls.push({ url, body: String(init.body) }); const code = new URLSearchParams(String(init.body)).get("code");
      return json({ refresh_token: "r-" + code, access_token: "a", id_token: jws({ sub: code === "mine" ? "001.apple.sub" : "002.someone.else", aud: "app.nabutarot.ios" }) }); },
    "appleid.apple.com/auth/revoke": (url, init) => { calls.push({ url, body: String(init.body) }); return json({}); },
  });
  try {
    const me = await appleUser("u1", "001.apple.sub");
    const ok = await revoke(me, "mine");
    assert.equal(ok.status, 200);
    const exchange = new URLSearchParams(calls[0].body), rev = new URLSearchParams(calls[1].body);
    assert.equal(exchange.get("client_id"), "app.nabutarot.ios"); assert.equal(exchange.get("grant_type"), "authorization_code");
    const secret = JSON.parse(Buffer.from(String(exchange.get("client_secret")).split(".")[1], "base64url").toString());
    assert.equal(secret.iss, "TEAM1"); assert.equal(secret.sub, "app.nabutarot.ios"); assert.equal(secret.aud, "https://appleid.apple.com");
    assert.ok(calls[1].url.includes("/auth/revoke")); assert.equal(rev.get("token"), "r-mine"); assert.equal(rev.get("token_type_hint"), "refresh_token");
    /* A code for a different Apple ID: exchanged, never revoked. */
    calls.length = 0;
    const other = await revoke(me, "theirs");
    assert.equal(other.status, 403); assert.equal(calls.filter((c) => c.url.includes("/auth/revoke")).length, 0);
    /* An account that does not sign in with Apple has nothing to revoke. */
    assert.equal((await revoke(await appleUser("u2", ""), "mine")).status, 409);
    /* Without the Sign in with Apple key the phone is told so, and goes on deleting. */
    assert.equal((await revoke(me, "mine", {})).status, 501);
  } finally { m.restore(); }
});
