import { test } from "node:test";
import assert from "node:assert/strict";
import { subAccess, recompute, applySubscription, SubRow } from "../src/entitle";
import { SubInfo } from "../src/play";
import { itemByKey } from "../src/catalog";
import { makeKeys, env, mockFetch, json, fsDoc } from "./util";

const sub = (state: string, days = 30): SubInfo => ({ state, expiryMs: Date.now() + days * 86400000, productId: "x", basePlanId: "b", autoRenew: true, acknowledged: true, linkedToken: "" });
const day = (d: number) => new Date(Date.now() + d * 86400000).toISOString().slice(0, 10);

test("active, cancelled-but-paid and grace keep access until expiry", () => {
  for (const s of ["SUBSCRIPTION_STATE_ACTIVE", "SUBSCRIPTION_STATE_CANCELED", "SUBSCRIPTION_STATE_IN_GRACE_PERIOD"]) {
    const a = subAccess(sub(s, 10)); assert.equal(a.grant, true, s); assert.equal(a.until, day(10));
  }
});
test("hold, paused, expired, pending and unknown grant nothing", () => {
  for (const s of ["SUBSCRIPTION_STATE_ON_HOLD", "SUBSCRIPTION_STATE_PAUSED", "SUBSCRIPTION_STATE_EXPIRED", "SUBSCRIPTION_STATE_PENDING", "SUBSCRIPTION_STATE_PENDING_PURCHASE_CANCELED", "SUBSCRIPTION_STATE_UNSPECIFIED", ""])
    assert.equal(subAccess(sub(s, 10)).grant, false, s);
});
test("an active subscription whose expiry is in the past grants nothing", () => {
  assert.equal(subAccess(sub("SUBSCRIPTION_STATE_ACTIVE", -1)).grant, false);
});
test("recompute rewrites only play-managed keys from granting rows and leaves courses alone", () => {
  const row = (opens: string[], grant: boolean, until: string): SubRow => ({ sku: "s", plan: "p", state: "x", until, autoRenew: true, tok: "t", opens, grant });
  const access = { tarot: "2027-01-01", pro: "2020-01-01", manifest: "2030-01-01" };
  const out = recompute({ pro6: row(["pro", "plus"], true, "2026-12-01"), manifest: row(["manifest"], false, "2026-01-01") }, access);
  assert.deepEqual(out, { tarot: "2027-01-01", pro: "2026-12-01", plus: "2026-12-01" });
});
test("a non-Play-managed key with a falsy value survives the rebuild (presence, not truthiness, decides)", () => {
  const out = recompute({}, { tarot: "" });
  assert.deepEqual(out, { tarot: "" });
});
test("two granting rows for the same key keep the later date", () => {
  const row = (opens: string[], until: string): SubRow => ({ sku: "s", plan: "p", state: "x", until, autoRenew: true, tok: "t", opens, grant: true });
  const out = recompute({ pro6: row(["pro", "plus"], "2026-06-01"), pro: row(["pro", "plus"], "2027-06-01") }, {});
  assert.deepEqual(out, { pro: "2027-06-01", plus: "2027-06-01" });
});

/* The website sells the same three keys the Play subscriptions open. Somebody
   who paid 249.000d by bank transfer for Nabu Pro and redeemed the code Nabu
   sent them holds access.pro and access.plus with no subscription behind them.
   Applying a subscription for a DIFFERENT product must not touch either: the
   manifest row names only "manifest", so "pro" and "plus" are not Play's to
   rebuild. Before this, recompute threw away every Play-managed key it could
   not explain and the customer lost what they had paid for - unrecoverably,
   because reconcile re-ran the same wipe every six hours. */
test("a website-code Pro customer who then subscribes to a DIFFERENT product keeps pro and plus", () => {
  const row = (opens: string[], until: string): SubRow => ({ sku: "s", plan: "p", state: "SUBSCRIPTION_STATE_ACTIVE", until, autoRenew: true, tok: "t", opens, grant: true });
  const access = { pro: "2027-03-01", plus: "2027-03-01", tarot: "2026-05-05" };
  const out = recompute({ manifest: row(["manifest"], "2027-09-01") }, access);
  assert.deepEqual(out, { pro: "2027-03-01", plus: "2027-03-01", tarot: "2026-05-05", manifest: "2027-09-01" });
});
test("a Play row still wins for a key it names, granting a later date over an existing value", () => {
  const row = (opens: string[], until: string): SubRow => ({ sku: "s", plan: "p", state: "SUBSCRIPTION_STATE_ACTIVE", until, autoRenew: true, tok: "t", opens, grant: true });
  const out = recompute({ pro: row(["pro", "plus"], "2028-01-01") }, { pro: "2026-01-01", plus: "2026-01-01" });
  assert.deepEqual(out, { pro: "2028-01-01", plus: "2028-01-01" });
});
/* The other half of the same rule: a row that names a key still names it when
   it stops granting, which is how an expired subscription takes its access
   away. Preserving "unexplained" keys must not become "never revoke". */
test("a subscription row that has stopped granting still takes back the key it names", () => {
  const dead: SubRow = { sku: "s", plan: "p", state: "SUBSCRIPTION_STATE_EXPIRED", until: "2026-01-01", autoRenew: false, tok: "t", opens: ["pro", "plus"], grant: false };
  assert.deepEqual(recompute({ pro: dead }, { pro: "2026-01-01", plus: "2026-01-01", tarot: "2027-01-01" }), { tarot: "2027-01-01" });
});

/* ---- `granted`: the two sources, in separate boxes ----

   `access` is the answer, not a source. What Play's rows give and what the
   website and the dashboard gave are kept apart - the rows in
   users/{uid}.subs, the rest in users/{uid}.granted - and combined at read
   time, later date winning. That is what lets Play SHORTEN its own
   contribution (a refund, a revocation, a downgrade) without ever reaching
   what somebody paid Nabu directly for, and lets a bank transfer outlast a
   subscription without ever blocking a revocation.

   These exercise applySubscription rather than recompute alone, because the
   half that cannot be got wrong lives there: the capture of grants made
   before this field existed, and exactly when it must not fire. */
const acct = (k: Awaited<ReturnType<typeof makeKeys>>, doc: Record<string, unknown> | null) => {
  const docs: Record<string, Record<string, unknown>> = {};
  if (doc) docs["users/u1"] = fsDoc(doc).fields as Record<string, unknown>;
  const m = mockFetch(k, {
    "firestore.googleapis.com": (url, init) => {
      const id = url.split("/documents/")[1].split("?")[0];
      if (init.method === "PATCH") { docs[id] = Object.assign(docs[id] || {}, JSON.parse(String(init.body)).fields); return json({ name: id }); }
      return docs[id] ? json({ fields: docs[id] }) : json({}, 404);
    },
  });
  return { docs, m };
};
/* Read a map field back out of the stored document, so the tests check what
   actually landed on the account and not only what was handed back. */
const stored = (docs: Record<string, Record<string, unknown>>, field: string): Record<string, string> => {
  const f = ((docs["users/u1"] || {})[field] as { mapValue?: { fields?: Record<string, { stringValue?: string }> } } | undefined)?.mapValue?.fields || {};
  const out: Record<string, string> = {};
  for (const key of Object.keys(f)) out[key] = f[key].stringValue || "";
  return out;
};
const on = (iso: string) => Date.parse(iso + "T00:00:00.000Z");
const subUntil = (state: string, iso: string): SubInfo => ({ state, expiryMs: on(iso), productId: "x", basePlanId: "b", autoRenew: true, acknowledged: true, linkedToken: "" });
const PRO = itemByKey("pro")!;          // opens ["pro", "plus"], twelve months
const PRO6 = itemByKey("pro6")!;        // the same two keys, six months
const MANIFEST = itemByKey("manifest")!;

/* 1. The reported bug. 249.000d by bank transfer buys Nabu Pro to 2027-06 and
   the code is redeemed; the same customer later subscribes to Play Pro, which
   runs only to 2026-12. Play's row NAMES "pro", so the old recompute threw the
   code's date away outright and six paid-for months vanished with nothing
   written down to say they had ever existed. */
test("a code-granted Pro to a FAR date survives a Play Pro subscription that runs out earlier", async () => {
  const k = await makeKeys();
  const w = acct(k, { access: { pro: "2027-06-01", plus: "2027-06-01" }, granted: { pro: "2027-06-01", plus: "2027-06-01" }, subs: {} });
  try {
    const out = await applySubscription(env(k) as never, "u1", PRO, subUntil("SUBSCRIPTION_STATE_ACTIVE", "2026-12-01"), "h1");
    assert.equal(out.access.pro, "2027-06-01", "the bank transfer is not shortened to Play's date");
    assert.equal(out.access.plus, "2027-06-01");
    assert.equal(out.subs.pro.until, "2026-12-01", "Play's own row still records exactly what Play gave");
    assert.deepEqual(stored(w.docs, "access"), { pro: "2027-06-01", plus: "2027-06-01" });
  } finally { w.m.restore(); }
});

/* The same customer, but redeemed BEFORE `granted` existed: nothing except
   `access` says they hold Pro. No migration is run over the user collection -
   the value is caught here instead, at the one moment it can still be read
   truthfully, because no subscription row has ever named "pro". */
test("a code-granted Pro with NO granted field is captured automatically when Play first takes the key", async () => {
  const k = await makeKeys();
  const w = acct(k, { access: { pro: "2027-06-01", plus: "2027-06-01", tarot: "2026-11-01" }, subs: {} });
  try {
    const out = await applySubscription(env(k) as never, "u1", PRO, subUntil("SUBSCRIPTION_STATE_ACTIVE", "2026-12-01"), "h1");
    assert.deepEqual(out.granted, { pro: "2027-06-01", plus: "2027-06-01" }, "captured, and only the Play-managed keys");
    assert.equal(out.access.pro, "2027-06-01");
    assert.equal(out.access.tarot, "2026-11-01", "a course key is untouched by any of this");
    assert.deepEqual(stored(w.docs, "granted"), { pro: "2027-06-01", plus: "2027-06-01" });
  } finally { w.m.restore(); }
});

/* 2. And the whole reason for keeping the two in separate boxes rather than
   simply taking the later of two dates: Google must still be able to take its
   own grant away to nothing. A customer who never had a code is left with
   nothing at all, which is what a refund means. */
test("a refunded Play Pro is revoked in full when nothing else granted it", async () => {
  const k = await makeKeys();
  const w = acct(k, null);
  try {
    const first = await applySubscription(env(k) as never, "u1", PRO, subUntil("SUBSCRIPTION_STATE_ACTIVE", "2027-06-01"), "h1");
    assert.equal(first.access.pro, "2027-06-01");
    assert.deepEqual(first.granted, {}, "Play's own grant is never written into granted");
    const gone = await applySubscription(env(k) as never, "u1", PRO, subUntil("SUBSCRIPTION_STATE_EXPIRED", "2026-09-01"), "h1");
    assert.deepEqual(gone.access, {}, "a refund still revokes, completely");
    assert.deepEqual(gone.granted, {});
    assert.deepEqual(stored(w.docs, "access"), {});
  } finally { w.m.restore(); }
});
/* The same refund against a customer who ALSO paid Nabu directly: Play's half
   goes, theirs stays. */
test("a refunded Play Pro leaves exactly what granted holds, and no more", async () => {
  const k = await makeKeys();
  const w = acct(k, { access: { pro: "2027-06-01", plus: "2027-06-01" }, granted: { pro: "2027-06-01", plus: "2027-06-01" }, subs: {} });
  try {
    await applySubscription(env(k) as never, "u1", PRO, subUntil("SUBSCRIPTION_STATE_ACTIVE", "2028-01-01"), "h1");
    const gone = await applySubscription(env(k) as never, "u1", PRO, subUntil("SUBSCRIPTION_STATE_EXPIRED", "2026-09-01"), "h1");
    assert.deepEqual(gone.access, { pro: "2027-06-01", plus: "2027-06-01" }, "Play's extra year goes; the bank transfer stays");
  } finally { w.m.restore(); }
});

/* 3. Subscribing to a DIFFERENT product must not disturb keys that product
   does not name - and the capture must not reach for them either. */
test("a code-granted Pro customer who subscribes to Manifestation keeps pro and plus", async () => {
  const k = await makeKeys();
  const w = acct(k, { access: { pro: "2027-06-01", plus: "2027-06-01" }, granted: { pro: "2027-06-01", plus: "2027-06-01" }, subs: {} });
  try {
    const out = await applySubscription(env(k) as never, "u1", MANIFEST, subUntil("SUBSCRIPTION_STATE_ACTIVE", "2027-01-01"), "h1");
    assert.deepEqual(out.access, { pro: "2027-06-01", plus: "2027-06-01", manifest: "2027-01-01" });
    assert.deepEqual(out.granted, { pro: "2027-06-01", plus: "2027-06-01" }, "the manifest row captures nothing: it names only manifest");
  } finally { w.m.restore(); }
});

/* 4. The dangerous direction, and the reason the capture is checked against
   the rows as they stand BEFORE the write. Once a row names a key, whatever
   `access` holds for that key is Play's own previous grant. Capturing it would
   make it permanent, and the very next legitimate SHORTENING - a downgrade, a
   partial refund, an expiry - would find the old longer date sitting in
   `granted` and hand back access Google had just taken away. */
test("the capture does NOT fire for a key an existing row already names: a Play shortening stands", async () => {
  const k = await makeKeys();
  const w = acct(k, null);
  try {
    const long = await applySubscription(env(k) as never, "u1", PRO, subUntil("SUBSCRIPTION_STATE_ACTIVE", "2028-01-01"), "h1");
    assert.equal(long.access.pro, "2028-01-01");
    // Google now says the same subscription runs only to 2026-10.
    const short = await applySubscription(env(k) as never, "u1", PRO, subUntil("SUBSCRIPTION_STATE_ACTIVE", "2026-10-01"), "h1");
    assert.deepEqual(short.granted, {}, "nothing captured: the pro row already named pro and plus");
    assert.deepEqual(short.access, { pro: "2026-10-01", plus: "2026-10-01" }, "the shortening is not undone");
  } finally { w.m.restore(); }
});
/* Across rows, not merely across the same slot in `subs`: pro6 and pro are
   different entries naming the same two keys, so a plan change from one to the
   other must not read as "no row named this key". */
test("the capture does NOT fire for a key a DIFFERENT existing row names", async () => {
  const k = await makeKeys();
  const w = acct(k, null);
  try {
    await applySubscription(env(k) as never, "u1", PRO6, subUntil("SUBSCRIPTION_STATE_ACTIVE", "2028-01-01"), "h6");
    const out = await applySubscription(env(k) as never, "u1", PRO, subUntil("SUBSCRIPTION_STATE_ACTIVE", "2027-01-01"), "h12");
    assert.deepEqual(out.granted, {}, "the pro6 row already named pro and plus");
  } finally { w.m.restore(); }
});

/* The second half of the reported bug. A customer's Play Pro lapsed long ago;
   subscription rows are never deleted, so that dead row goes on naming "pro"
   and "plus" for ever. They then buy Pro by bank transfer and redeem the code,
   which now writes `granted` alongside `access`. Before this branch the next
   subscription event of any kind wiped them out again, and the six-hourly
   reconcile repeated it within the day. */
test("a lapsed Play row does not eat a bank transfer redeemed after it", async () => {
  const k = await makeKeys();
  const dead = { sku: PRO6.sku, plan: "p", state: "SUBSCRIPTION_STATE_EXPIRED", until: "2026-01-01", autoRenew: false, tok: "h6", opens: ["pro", "plus"], grant: false };
  const w = acct(k, { access: { pro: "2027-06-01", plus: "2027-06-01" }, granted: { pro: "2027-06-01", plus: "2027-06-01" }, subs: { pro6: dead } });
  try {
    const out = await applySubscription(env(k) as never, "u1", MANIFEST, subUntil("SUBSCRIPTION_STATE_ACTIVE", "2027-01-01"), "hm");
    assert.equal(out.access.pro, "2027-06-01");
    assert.equal(out.access.plus, "2027-06-01");
  } finally { w.m.restore(); }
});
