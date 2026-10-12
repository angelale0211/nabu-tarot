/* Push notifications for the iPhone app: tokens filed per account, sent
   through FCM, and the sweep that notices what Nabu did in #/admin (which
   writes Firestore directly and never calls the worker). */
import { test } from "node:test";
import assert from "node:assert/strict";
import { registerPush, unregisterPush, sendPush, sweepPush, pushText, PUSH_PER_RUN } from "../src/push";
import { makeKeys, env, mockFetch, json, Keys } from "./util";

/* A small Firestore: documents by path, with GET, PATCH (mask + preconditions),
   a collection list and an equality runQuery - what push.ts uses. */
type Doc = Record<string, unknown>;
function firestore(k: Keys, docs: Record<string, Doc>, fcm: (body: { message: { token: string } }) => Response = () => json({ name: "m/1" })) {
  const enc = (v: unknown): unknown => {
    if (v && typeof v === "object" && "__ts" in (v as object)) return { timestampValue: (v as { __ts: string }).__ts };
    if (typeof v === "string") return { stringValue: v };
    if (typeof v === "boolean") return { booleanValue: v };
    if (typeof v === "number") return { integerValue: String(v) };
    if (Array.isArray(v)) return { arrayValue: { values: v.map(enc) } };
    if (v && typeof v === "object") return { mapValue: { fields: encDoc(v as Doc) } };
    return { nullValue: null };
  };
  const encDoc = (d: Doc) => Object.fromEntries(Object.entries(d).map(([a, b]) => [a, enc(b)]));
  const dec = (v: Record<string, unknown>): unknown => {
    if ("timestampValue" in v) return { __ts: v.timestampValue };
    if ("stringValue" in v) return v.stringValue;
    if ("booleanValue" in v) return v.booleanValue;
    if ("integerValue" in v) return Number(v.integerValue);
    if ("mapValue" in v) return decDoc((v.mapValue as { fields?: Record<string, Record<string, unknown>> }).fields || {});
    if ("arrayValue" in v) return (((v.arrayValue as { values?: Record<string, unknown>[] }).values) || []).map(dec);
    return null;
  };
  const decDoc = (f: Record<string, Record<string, unknown>>): Doc => Object.fromEntries(Object.entries(f).map(([a, b]) => [a, dec(b)]));
  const ROOT = "/databases/(default)/documents/";
  const name = (p: string) => "projects/nabutarot" + ROOT + p;
  const sent: { token: string; body: Record<string, unknown> }[] = [];
  const m = mockFetch(k, {
    "fcm.googleapis.com": (_u, init) => {
      const b = JSON.parse(String(init.body));
      sent.push({ token: b.message.token, body: b.message });
      return fcm(b);
    },
    ":runQuery": (_u, init) => {
      const q = JSON.parse(String(init.body)).structuredQuery;
      const coll = q.from[0].collectionId as string;
      const f = q.where && q.where.fieldFilter;
      let paths = Object.keys(docs).filter((p) => p.startsWith(coll + "/") && p.split("/").length === 2).sort();
      if (f && f.field.fieldPath === "__name__") {
        const after = String(f.value.referenceValue).split(ROOT)[1];
        paths = paths.filter((p) => p > after);
      } else if (f) paths = paths.filter((p) => docs[p][f.field.fieldPath] === f.value.stringValue);
      if (q.limit) paths = paths.slice(0, q.limit);
      const rows = paths.map((p) => ({ document: { name: name(p), fields: encDoc(docs[p]) } }));
      return json(rows.length ? rows : [{ readTime: "x" }]);
    },
    "firestore.googleapis.com": (u, init) => {
      const url = new URL(u);
      const path = decodeURIComponent(url.pathname.split(ROOT)[1] || "");
      const method = init.method || "GET";
      if (method === "GET" && !path.includes("/")) {
        const list = Object.keys(docs).filter((p) => p.startsWith(path + "/") && p.split("/").length === 2);
        return json({ documents: list.map((p) => ({ name: name(p), fields: encDoc(docs[p]) })) });
      }
      if (method === "GET") return docs[path] ? json({ name: name(path), fields: encDoc(docs[path]) }) : json({}, 404);
      if (method === "PATCH") {
        if (url.searchParams.get("currentDocument.exists") === "true" && !docs[path]) return json({}, 404);
        const mask = url.searchParams.getAll("updateMask.fieldPaths");
        const body = decDoc(JSON.parse(String(init.body)).fields || {});
        const next: Doc = { ...(docs[path] || {}) };
        for (const f of mask.length ? mask : Object.keys(body)) {
          if (f in body) next[f] = body[f]; else delete next[f];
        }
        docs[path] = next;
        return json({ name: name(path), fields: encDoc(next) });
      }
      if (method === "DELETE") { delete docs[path]; return json({}); }
      return null;
    },
  });
  return { ...m, sent, docs };
}

const ts = (iso: string) => ({ __ts: iso });

test("register files the token under the account and baselines what already happened", async () => {
  const k = await makeKeys();
  const docs: Record<string, Doc> = {
    "threads/u1": { lastFrom: "nabu", userUnread: 2, lastAt: ts("2026-10-10T08:00:00.123Z"), lastText: "old answer" },
    "bookings/b1": { uid: "u1", status: "confirmed", slot: "2026-10-20T10:00" },
    "bookings/b2": { uid: "other", status: "confirmed" },
  };
  const fs = firestore(k, docs);
  try {
    const r = await registerPush(env(k), "u1", "tok-A", "de");
    assert.equal(r.first, true);
    const t = (docs["pushtokens/u1"].tokens as Doc)["tok-A"] as Doc;
    assert.equal(t.lang, "de");
    assert.equal(t.platform, "ios");
    // What Nabu did before the phone asked for notifications is not news.
    assert.equal(docs["threads/u1"].pushedAt, "2026-10-10T08:00:00.123Z");
    assert.equal(docs["bookings/b1"].pushed, "confirmed");
    assert.equal(docs["bookings/b2"].pushed, undefined);
    // A sweep right after sends nothing about them.
    await sweepPush(env(k), new Date("2026-10-12T10:00:00Z"));
    assert.equal(fs.sent.length, 0);
  } finally { fs.restore(); }
});

test("a second token for the same account is added, not swapped, and is not a first registration", async () => {
  const k = await makeKeys();
  const docs: Record<string, Doc> = { "pushtokens/u1": { tokens: { "tok-A": { lang: "vi", platform: "ios", at: 1 } } } };
  const fs = firestore(k, docs);
  try {
    const r = await registerPush(env(k), "u1", "tok-B", "en");
    assert.equal(r.first, false);
    assert.deepEqual(Object.keys(docs["pushtokens/u1"].tokens as Doc).sort(), ["tok-A", "tok-B"]);
  } finally { fs.restore(); }
});

test("unregister removes exactly that token", async () => {
  const k = await makeKeys();
  const docs: Record<string, Doc> = { "pushtokens/u1": { tokens: { "tok-A": { lang: "vi" }, "tok-B": { lang: "vi" } } } };
  const fs = firestore(k, docs);
  try {
    await unregisterPush(env(k), "u1", "tok-A");
    assert.deepEqual(Object.keys(docs["pushtokens/u1"].tokens as Doc), ["tok-B"]);
  } finally { fs.restore(); }
});

test("sendPush reaches every token with the route, and drops one FCM calls UNREGISTERED", async () => {
  const k = await makeKeys();
  const docs: Record<string, Doc> = { "pushtokens/u1": { tokens: { good: { lang: "vi" }, dead: { lang: "vi" } } } };
  const fs = firestore(k, docs, (b) => b.message.token === "dead"
    ? json({ error: { status: "NOT_FOUND", details: [{ errorCode: "UNREGISTERED" }] } }, 404)
    : json({ name: "m/1" }));
  try {
    const r = await sendPush(env(k), "u1", (lang) => ({ title: "T", body: "B-" + lang, route: "me/bookings" }));
    assert.deepEqual(r, { sent: 1, dropped: 1 });
    const good = fs.sent.find((s) => s.token === "good")!.body as { data: { route: string }; notification: { body: string } };
    assert.equal(good.data.route, "me/bookings");
    assert.equal(good.notification.body, "B-vi");
    assert.deepEqual(Object.keys(docs["pushtokens/u1"].tokens as Doc), ["good"]);
  } finally { fs.restore(); }
});

test("an FCM outage keeps the token", async () => {
  const k = await makeKeys();
  const docs: Record<string, Doc> = { "pushtokens/u1": { tokens: { good: { lang: "vi" } } } };
  const fs = firestore(k, docs, () => json({ error: { status: "UNAVAILABLE" } }, 503));
  try {
    const r = await sendPush(env(k), "u1", () => ({ title: "T", body: "B", route: "" }));
    assert.deepEqual(r, { sent: 0, dropped: 0 });
    assert.ok((docs["pushtokens/u1"].tokens as Doc).good);
  } finally { fs.restore(); }
});

test("the sweep tells the person Nabu answered, once", async () => {
  const k = await makeKeys();
  const docs: Record<string, Doc> = {
    "pushtokens/u1": { tokens: { tok: { lang: "en" } }, daily: "2026-10-12" },
    "threads/u1": { lastFrom: "nabu", userUnread: 1, lastAt: ts("2026-10-12T09:00:00Z"), lastText: "Your reading is ready", pushedAt: "2026-10-11T09:00:00Z" },
  };
  const fs = firestore(k, docs);
  try {
    await sweepPush(env(k), new Date("2026-10-12T10:00:00Z"));
    assert.equal(fs.sent.length, 1);
    const msg = fs.sent[0].body as { data: { route: string }; notification: { body: string } };
    assert.equal(msg.data.route, "me/inbox");
    assert.match(msg.notification.body, /Your reading is ready/);
    await sweepPush(env(k), new Date("2026-10-12T10:15:00Z"));
    assert.equal(fs.sent.length, 1);
  } finally { fs.restore(); }
});

test("the sweep says nothing about a message the person wrote, or one already read", async () => {
  const k = await makeKeys();
  const docs: Record<string, Doc> = {
    "pushtokens/u1": { tokens: { tok: { lang: "vi" } }, daily: "2026-10-12" },
    "pushtokens/u2": { tokens: { tok2: { lang: "vi" } }, daily: "2026-10-12" },
    "threads/u1": { lastFrom: "user", userUnread: 0, lastAt: ts("2026-10-12T09:00:00Z") },
    "threads/u2": { lastFrom: "nabu", userUnread: 0, lastAt: ts("2026-10-12T09:00:00Z") },
  };
  const fs = firestore(k, docs);
  try {
    await sweepPush(env(k), new Date("2026-10-12T10:00:00Z"));
    assert.equal(fs.sent.length, 0);
  } finally { fs.restore(); }
});

test("a booking Nabu confirms or moves is told once; other changes are noted silently", async () => {
  const k = await makeKeys();
  const docs: Record<string, Doc> = {
    "pushtokens/u1": { tokens: { tok: { lang: "vi" } }, daily: "2026-10-12" },
    "bookings/b1": { uid: "u1", status: "confirmed", pushed: "requested" },
    "bookings/b2": { uid: "u1", status: "change_proposed", pushed: "confirmed" },
    "bookings/b3": { uid: "u1", status: "cancel_requested", pushed: "confirmed" },
  };
  const fs = firestore(k, docs);
  try {
    await sweepPush(env(k), new Date("2026-10-12T10:00:00Z"));
    assert.equal(fs.sent.length, 2);
    for (const s of fs.sent) assert.equal((s.body as { data: { route: string } }).data.route, "me/bookings");
    assert.equal(docs["bookings/b1"].pushed, "confirmed");
    assert.equal(docs["bookings/b2"].pushed, "change_proposed");
    assert.equal(docs["bookings/b3"].pushed, "cancel_requested");
    await sweepPush(env(k), new Date("2026-10-12T10:15:00Z"));
    assert.equal(fs.sent.length, 2);
  } finally { fs.restore(); }
});

test("the daily card goes out once per account per Vietnam day, from 07:00", async () => {
  const k = await makeKeys();
  const docs: Record<string, Doc> = { "pushtokens/u1": { tokens: { tok: { lang: "de" } }, daily: "2026-10-12" } };
  const fs = firestore(k, docs);
  try {
    await sweepPush(env(k), new Date("2026-10-12T23:30:00Z"));   // 06:30 on the 13th in Vietnam
    assert.equal(fs.sent.length, 0);
    await sweepPush(env(k), new Date("2026-10-13T00:05:00Z"));   // 07:05
    assert.equal(fs.sent.length, 1);
    const msg = fs.sent[0].body as { data: { route: string }; notification: { body: string } };
    assert.equal(msg.data.route, "pick");
    assert.equal(msg.notification.body, pushText("daily", "de").body);
    assert.equal(docs["pushtokens/u1"].daily, "2026-10-13");
    await sweepPush(env(k), new Date("2026-10-13T09:00:00Z"));
    assert.equal(fs.sent.length, 1);
  } finally { fs.restore(); }
});

test("a sweep takes a few accounts at a time and the next run goes on from there", async () => {
  const k = await makeKeys();
  const docs: Record<string, Doc> = {};
  const n = PUSH_PER_RUN * 2 + 1;
  for (let i = 0; i < n; i++) docs["pushtokens/u" + String(i).padStart(2, "0")] = { tokens: { ["t" + i]: { lang: "vi" } }, daily: "2026-10-12" };
  const fs = firestore(k, docs);
  try {
    const seen = new Set<number>();
    for (let run = 0; run < 3; run++) {
      const r = await sweepPush(env(k), new Date("2026-10-12T10:00:00Z"));
      assert.ok(r.people <= PUSH_PER_RUN);
      seen.add(r.people);
    }
    // three runs covered every account exactly once, then the cursor starts over
    const firestoreReads = fs.log.filter((l) => l.url.includes("threads/")).map((l) => l.url.split("threads/")[1]);
    assert.equal(new Set(firestoreReads).size, n);
    assert.equal(docs["pushstate/sweep"].after, "");
  } finally { fs.restore(); }
});

test("a token FCM calls INVALID_ARGUMENT is kept: that is a message fault, not a dead phone", async () => {
  const k = await makeKeys();
  const docs: Record<string, Doc> = { "pushtokens/u1": { tokens: { good: { lang: "vi" } } } };
  const fs = firestore(k, docs, () => json({ error: { status: "INVALID_ARGUMENT", details: [{ errorCode: "INVALID_ARGUMENT" }] } }, 400));
  try {
    const r = await sendPush(env(k), "u1", () => ({ title: "T", body: "B", route: "" }));
    assert.deepEqual(r, { sent: 0, dropped: 0 });
    assert.ok((docs["pushtokens/u1"].tokens as Doc).good);
  } finally { fs.restore(); }
});

test("texts exist in all three languages and fall back to Vietnamese", () => {
  for (const kind of ["reply", "confirmed", "moved", "daily"] as const) {
    for (const lang of ["vi", "en", "de"]) {
      const t = pushText(kind, lang);
      assert.ok(t.title && t.body, kind + "/" + lang);
    }
    assert.deepEqual(pushText(kind, "fr"), pushText(kind, "vi"));
  }
});

import worker from "../src/index";
import { idToken, ctx } from "./util";

/* One key for every route test: the worker caches Google's signing keys. */
const routeKeys = makeKeys();

test("/push-register needs a signed-in person and a token, and files it under that person", async () => {
  const k = await routeKeys;
  const docs: Record<string, Doc> = {};
  const fs = firestore(k, docs);
  const post = (body: unknown, auth?: string) => worker.fetch(new Request("https://nabu-ai.test/push-register", {
    method: "POST", headers: { "Content-Type": "application/json", ...(auth ? { Authorization: "Bearer " + auth } : {}) }, body: JSON.stringify(body),
  }), env(k) as never, ctx() as never);
  try {
    assert.equal((await post({ token: "tok" })).status, 401);
    const who = await idToken(k, "u7");
    assert.equal((await post({ token: "" }, who)).status, 400);
    assert.equal((await post({ token: "x".repeat(5000) }, who)).status, 400);
    const r = await post({ token: "tok-7", lang: "en" }, who);
    assert.equal(r.status, 200);
    assert.ok((docs["pushtokens/u7"].tokens as Doc)["tok-7"]);
  } finally { fs.restore(); }
});

test("/push-unregister removes the token of the signed-in person only", async () => {
  const k = await routeKeys;
  const docs: Record<string, Doc> = { "pushtokens/u7": { tokens: { "tok-7": { lang: "vi" } } } };
  const fs = firestore(k, docs);
  try {
    const r = await worker.fetch(new Request("https://nabu-ai.test/push-unregister", {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + await idToken(k, "u7") }, body: JSON.stringify({ token: "tok-7" }),
    }), env(k) as never, ctx() as never);
    assert.equal(r.status, 200);
    assert.deepEqual(docs["pushtokens/u7"].tokens, {});
  } finally { fs.restore(); }
});

test("the 15-minute schedule runs the push sweep and not the six-hourly refund sweeps", async () => {
  const k = await makeKeys();
  const docs: Record<string, Doc> = {};
  const fs = firestore(k, docs);
  try {
    const c = ctx();
    await worker.scheduled({ cron: "*/15 * * * *", scheduledTime: Date.now() } as never, env(k) as never, c as never);
    await c.done();
    assert.ok(fs.log.some((l) => l.url.includes(":runQuery") && l.body.includes("pushtokens")), "push sweep listed the tokens");
    assert.ok(!fs.log.some((l) => l.url.includes("androidpublisher") || l.url.includes("api.storekit")), "no refund sweep");
  } finally { fs.restore(); }
});

test("/forget also removes the account's notification tokens", async () => {
  const k = await routeKeys;
  const docs: Record<string, Doc> = { "pushtokens/u7": { tokens: { "tok-7": { lang: "vi" } } } };
  const fs = firestore(k, docs);
  try {
    const r = await worker.fetch(new Request("https://nabu-ai.test/forget", {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + await idToken(k, "u7") }, body: "{}",
    }), env(k) as never, ctx() as never);
    assert.equal(r.status, 200);
    assert.equal(docs["pushtokens/u7"], undefined);
  } finally { fs.restore(); }
});
