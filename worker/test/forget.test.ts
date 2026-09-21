import { test } from "node:test";
import assert from "node:assert/strict";
import { fsDeleteWhere } from "../src/fs";
import { makeKeys, env, mockFetch, json } from "./util";

/* An account asking to be forgotten also owns rows the phone may not touch:
   the moderation flags, the error log and the messages sent in from #/report
   are readable by the owner alone, so their rules refuse a delete from the
   client. The worker holds the service account and does them.

   What matters here: it finds them by uid, deletes every one it finds, pages
   through more than one batch, stops rather than looping for ever, and treats
   a row that is already gone as gone. */

const keys = await makeKeys();
const E = env(keys);

/* Firestore answers a query with one entry per row, and a delete with 200. */
function firestore(pages: string[][], deleteStatus: (name: string) => number = () => 200) {
  const deleted: string[] = [];
  let page = 0;
  const m = mockFetch(keys, {
    ":runQuery": () => json((pages[page++] || []).map((name) => ({ document: { name } }))),
    "firestore.googleapis.com/v1/projects": (url, init) => {
      if ((init.method || "GET") !== "DELETE") return null;
      const name = url.replace("https://firestore.googleapis.com/v1/", "");
      deleted.push(name);
      const st = deleteStatus(name);
      return new Response("{}", { status: st });
    },
  });
  return { deleted, restore: m.restore };
}

test("every row naming the account is deleted, one short page and done", async () => {
  const fs = firestore([["projects/p/databases/(default)/documents/flags/a", "projects/p/databases/(default)/documents/flags/b"]]);
  try {
    const gone = await fsDeleteWhere(E, "flags", "uid", "u1");
    assert.equal(gone, 2);
    assert.equal(fs.deleted.length, 2, "a page shorter than the limit is the last one, so it does not ask again");
    assert.ok(fs.deleted[1].endsWith("flags/b"));
  } finally { fs.restore(); }
});

test("a full page means there may be more, so it asks again", async () => {
  const full = Array.from({ length: 100 }, (_, i) => "projects/p/databases/(default)/documents/flags/" + i);
  const fs = firestore([full, ["projects/p/databases/(default)/documents/flags/last"]]);
  try { assert.equal(await fsDeleteWhere(E, "flags", "uid", "u1"), 101); } finally { fs.restore(); }
});

test("nothing to forget is not a failure", async () => {
  const fs = firestore([[]]);
  try { assert.equal(await fsDeleteWhere(E, "reports", "uid", "u1"), 0); } finally { fs.restore(); }
});

test("a row already gone counts as gone", async () => {
  const fs = firestore([["projects/p/databases/(default)/documents/errors/a"], []], () => 404);
  try { assert.equal(await fsDeleteWhere(E, "errors", "uid", "u1"), 1); } finally { fs.restore(); }
});

test("it stops at the cap instead of looping for ever", async () => {
  const full = Array.from({ length: 100 }, (_, i) => "projects/p/databases/(default)/documents/errors/" + i);
  const fs = firestore([full, full, full, full, full, full]);
  try { assert.equal(await fsDeleteWhere(E, "errors", "uid", "u1", 250), 250); } finally { fs.restore(); }
});
