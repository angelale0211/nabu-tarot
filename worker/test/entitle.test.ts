import { test } from "node:test";
import assert from "node:assert/strict";
import { subAccess, recompute, SubRow } from "../src/entitle";
import { SubInfo } from "../src/play";

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
test("two granting rows for the same key keep the later date", () => {
  const row = (opens: string[], until: string): SubRow => ({ sku: "s", plan: "p", state: "x", until, autoRenew: true, tok: "t", opens, grant: true });
  const out = recompute({ pro6: row(["pro", "plus"], "2026-06-01"), pro: row(["pro", "plus"], "2027-06-01") }, {});
  assert.deepEqual(out, { pro: "2027-06-01", plus: "2027-06-01" });
});
