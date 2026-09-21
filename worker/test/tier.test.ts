import { test } from "node:test";
import assert from "node:assert/strict";
import { tierOfAccess } from "../src/index";

/* How many questions a day a reader gets is read off what they hold. Three
   rungs, because two were wrong in both directions: a Plus subscriber on the
   free five wrote in to say the AI was broken, and giving Plus what Pro gets
   would leave the larger plan buying nothing extra here.

   Pro opens `plus` as well as `pro`, so a Pro subscriber must not fall into
   the middle rung on the way past. */

const TODAY = "2026-09-21";

test("courses and Pro earn the largest allowance", () => {
  for (const k of ["tarot", "lenormand", "playing", "pro"]) {
    assert.equal(tierOfAccess({ [k]: "2026-12-31" }, TODAY), "paid", k);
  }
  assert.equal(tierOfAccess({ pro: "2026-12-31", plus: "2026-12-31" }, TODAY), "paid",
    "Pro opens plus too, and is still read as Pro");
});

test("Plus and the manifestation set sit on the rung between", () => {
  assert.equal(tierOfAccess({ plus: "2026-12-31" }, TODAY), "plus");
  assert.equal(tierOfAccess({ manifest: "2026-12-31" }, TODAY), "plus");
});

test("nothing held, or held until yesterday, is free", () => {
  assert.equal(tierOfAccess({}, TODAY), "free");
  assert.equal(tierOfAccess({ plus: "2026-09-20" }, TODAY), "free", "expired yesterday");
  assert.equal(tierOfAccess({ pro: "2026-09-20", plus: "" }, TODAY), "free", "expired Pro is not Plus");
  assert.equal(tierOfAccess({ plus: "2026-09-21T23:59:00Z" }, TODAY), "plus", "the last day still counts");
});
