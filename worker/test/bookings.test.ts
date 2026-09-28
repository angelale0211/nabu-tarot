import { test } from "node:test";
import assert from "node:assert/strict";
import { answerProposal, bookingMail, mailBooking, slotUtc, mailTo } from "../src/bookings";
import worker from "../src/index";
import { makeKeys, env, mockFetch, json, fsDoc, idToken, ctx } from "./util";
import { decode } from "../src/fs";

/* A Firestore that holds documents by path and honours PATCH masks the way the
   real one does: a field in the mask but not in the body is deleted. */
function fakeFs(start: Record<string, Record<string, unknown>>) {
  const docs: Record<string, Record<string, unknown>> = JSON.parse(JSON.stringify(start));
  const pathOf = (url: string) => decodeURIComponent(url.split("/documents/")[1].split("?")[0]);
  const route = (url: string, init: RequestInit) => {
    const p = pathOf(url), method = init.method || "GET";
    if (method === "GET") return docs[p] ? json(fsDoc(docs[p])) : json({ error: "nf" }, 404);
    if (method === "DELETE") { delete docs[p]; return json({}); }
    if (method === "PATCH") {
      if (url.includes("currentDocument.exists=true") && !docs[p]) return json({ error: "nf" }, 404);
      const mask = [...url.matchAll(/updateMask\.fieldPaths=([^&]+)/g)].map((m) => decodeURIComponent(m[1]));
      const body = decode(JSON.parse(String(init.body)));
      const cur = docs[p] || {};
      for (const f of mask) { if (f in body) cur[f] = body[f]; else delete cur[f]; }
      docs[p] = cur;
      return json(fsDoc(cur));
    }
    return null;
  };
  return { docs, route };
}

const proposal = () => ({
  "bookings/b1": { uid: "u1", slot: "2026-10-01T19:00", status: "change_proposed", proposedSlot: "2026-10-02T20:00", prevStatus: "confirmed", price: 300000 },
  "taken/20261001T1900": { bookingId: "b1" },
  "taken/20261002T2000": { bookingId: "b1", pending: true },
});

test("accepting moves the booking to the proposed hour, restores its status and frees the old hour", async () => {
  const k = await makeKeys(), fs = fakeFs(proposal());
  const { restore } = mockFetch(k, { "firestore.googleapis.com": fs.route });
  try {
    const got = await answerProposal(env(k), "u1", "b1", true);
    assert.deepEqual(got, { ok: true, slot: "2026-10-02T20:00", status: "confirmed" });
    const b = fs.docs["bookings/b1"];
    assert.equal(b.slot, "2026-10-02T20:00");
    assert.equal(b.status, "confirmed");
    assert.equal(b.movedFrom, "2026-10-01T19:00");
    assert.ok(!("proposedSlot" in b) && !("prevStatus" in b), "the proposal is closed");
    assert.equal(b.price, 300000, "nothing else on the booking is touched");
    assert.deepEqual(fs.docs["taken/20261002T2000"], { bookingId: "b1", confirmed: true }, "the new hour is held as confirmed, no longer pending");
    assert.ok(!fs.docs["taken/20261001T1900"], "the old hour is back on the calendar");
  } finally { restore(); }
});

test("declining keeps the old hour, frees the proposed one and tells Nabu", async () => {
  const k = await makeKeys(), fs = fakeFs(proposal());
  const { restore } = mockFetch(k, { "firestore.googleapis.com": fs.route });
  try {
    const got = await answerProposal(env(k), "u1", "b1", false);
    assert.equal(got.ok, true);
    const b = fs.docs["bookings/b1"];
    assert.equal(b.status, "proposal_declined");
    assert.equal(b.slot, "2026-10-01T19:00");
    assert.equal(b.declinedSlot, "2026-10-02T20:00");
    assert.equal(b.prevStatus, "confirmed", "kept, so Nabu can still keep the old time");
    assert.ok(!("proposedSlot" in b));
    assert.ok(!fs.docs["taken/20261002T2000"], "the proposed hour is free again");
    assert.deepEqual(fs.docs["taken/20261001T1900"], { bookingId: "b1" }, "the old hour is still held");
  } finally { restore(); }
});

test("somebody else's booking, a booking with no open proposal, and a bad id are all refused without a write", async () => {
  const k = await makeKeys();
  const start = proposal();
  start["bookings/b2"] = { uid: "u1", slot: "2026-10-01T19:00", status: "confirmed" };
  const fs = fakeFs(start);
  const { log, restore } = mockFetch(k, { "firestore.googleapis.com": fs.route });
  try {
    assert.deepEqual(await answerProposal(env(k), "u2", "b1", true), { ok: false, why: "not yours" });
    assert.deepEqual(await answerProposal(env(k), "u1", "b2", true), { ok: false, why: "nothing to answer" });
    assert.deepEqual(await answerProposal(env(k), "u1", "../users/u1", true), { ok: false, why: "bad" });
    assert.deepEqual(await answerProposal(env(k), "u1", "nope", true), { ok: false, why: "gone" });
    assert.equal(log.filter((c) => c.method !== "GET" && c.url.includes("firestore")).length, 0);
    assert.equal(fs.docs["bookings/b1"].status, "change_proposed");
  } finally { restore(); }
});

test("an old hour somebody else has taken since is not freed", async () => {
  const k = await makeKeys(), start = proposal();
  start["taken/20261001T1900"] = { bookingId: "other" };
  const fs = fakeFs(start);
  const { restore } = mockFetch(k, { "firestore.googleapis.com": fs.route });
  try {
    await answerProposal(env(k), "u1", "b1", true);
    assert.deepEqual(fs.docs["taken/20261001T1900"], { bookingId: "other" });
  } finally { restore(); }
});

/* ---- booking mail ---- */
const MAIL = { RESEND_API_KEY: "re_test", MAIL_TO: "nabu@example.com, other@example.com" };
const booked = () => ({
  "bookings/b9": { uid: "u1", slot: "2026-10-03T23:30", status: "requested", service: "Tarot – 3 câu", price: 150000, name: "Anna", email: "anna@example.de", note: "hi" },
});

test("a Vietnam slot is the same moment wherever the phone is: 19:00 in Hanoi is 12:00 UTC", () => {
  assert.equal(slotUtc("2026-10-01T19:00")!.toISOString(), "2026-10-01T12:00:00.000Z");
  assert.equal(slotUtc("2026-10-01T03:30")!.toISOString(), "2026-09-30T20:30:00.000Z", "an early Vietnam hour is the previous day in UTC");
  assert.equal(slotUtc("nonsense"), null);
});

test("the mail for a new booking carries a calendar file in UTC, even for a 23:30 start that ends after midnight", () => {
  const m = bookingMail(booked()["bookings/b9"], "b9", new Date("2026-09-28T00:00:00Z"))!;
  assert.ok(m.ics, "a new booking has a calendar file");
  assert.match(m.ics!, /DTSTART:20261003T163000Z/);
  assert.match(m.ics!, /DTEND:20261003T173000Z/);
  assert.match(m.text, /23:30 03\/10\/2026 \(giờ Việt Nam\)/);
  assert.match(m.subject, /Anna/);
});

test("a request to move or cancel is mailed without a calendar file, and says which new hour was asked for", () => {
  const b = { ...booked()["bookings/b9"], status: "change_requested", newSlot: "2026-10-04T14:00" };
  const m = bookingMail(b, "b9")!;
  assert.equal(m.ics, undefined);
  assert.match(m.text, /14:00 04\/10\/2026/);
  assert.equal(bookingMail({ ...b, status: "cancel_requested" }, "b9")!.ics, undefined);
});

test("MAIL_TO is the only source of recipients and bad entries are dropped", () => {
  assert.deepEqual(mailTo({ MAIL_TO: "a@x.com, nope ,b@y.de" } as never), ["a@x.com", "b@y.de"]);
  assert.deepEqual(mailTo({} as never), []);
});

test("without a mail key nothing is read or sent, and the answer is still ok", async () => {
  const k = await makeKeys(), fs = fakeFs(booked());
  const { log, restore } = mockFetch(k, { "firestore.googleapis.com": fs.route });
  try {
    assert.deepEqual(await mailBooking(env(k, { MAIL_TO: MAIL.MAIL_TO }), "u1", "b9"), { ok: true, sent: false, why: "mail off" });
    const r = await worker.fetch(new Request("https://nabu-ai.test/booking", { method: "POST", body: JSON.stringify({ id: "b9" }) }), env(k) as never, ctx() as never);
    assert.equal(r.status, 200);
    assert.deepEqual(await r.json(), { ok: true, sent: false });
    assert.equal(log.length, 0, "no call left the worker");
  } finally { restore(); }
});

test("the booking is read from Firestore, must be the caller's, and goes only to MAIL_TO", async () => {
  const k = await makeKeys(), fs = fakeFs(booked());
  const sent: Record<string, unknown>[] = [];
  const { restore } = mockFetch(k, {
    "firestore.googleapis.com": fs.route,
    "api.resend.com": (_u, init) => { sent.push(JSON.parse(String(init.body))); return json({ id: "m1" }); },
  });
  try {
    const call = async (uid: string, body: unknown) => worker.fetch(new Request("https://nabu-ai.test/booking", { method: "POST",
      headers: { Authorization: "Bearer " + await idToken(k, uid), "Content-Type": "application/json", "CF-Connecting-IP": "1.2.3.4" },
      body: JSON.stringify(body) }), env(k, MAIL) as never, ctx() as never);
    const r = await call("u1", { id: "b9", to: ["attacker@example.com"], booking: { slot: "2020-01-01T00:00", name: "forged" } });
    assert.equal(r.status, 200);
    assert.deepEqual(await r.json(), { ok: true, sent: true });
    assert.equal(sent.length, 1);
    assert.deepEqual(sent[0].to, ["nabu@example.com", "other@example.com"], "never an address from the request");
    assert.match(String(sent[0].text), /Anna/);
    assert.doesNotMatch(String(sent[0].text), /forged/, "the content is the stored booking, not the posted one");
    assert.equal((await call("u2", { id: "b9" })).status, 403, "somebody else's booking");
    assert.equal((await call("u1", { id: "nope" })).status, 404);
    assert.equal((await call("u1", { id: "../x" })).status, 400);
    const anon = await worker.fetch(new Request("https://nabu-ai.test/booking", { method: "POST", body: JSON.stringify({ id: "b9" }) }), env(k, MAIL) as never, ctx() as never);
    assert.equal(anon.status, 401);
    assert.equal(sent.length, 1, "none of the refusals sent anything");
  } finally { restore(); }
});

test("a bug report is mailed only to MAIL_TO, never to an address in the request", async () => {
  const k = await makeKeys(), sent: Record<string, unknown>[] = [];
  const { restore } = mockFetch(k, { "api.resend.com": (_u, init) => { sent.push(JSON.parse(String(init.body))); return json({ id: "m2" }); } });
  try {
    const r = await worker.fetch(new Request("https://nabu-ai.test/report", { method: "POST", headers: { "Content-Type": "application/json", "CF-Connecting-IP": "5.6.7.8" },
      body: JSON.stringify({ text: "broken", to: ["attacker@example.com"] }) }), env(k, MAIL) as never, ctx() as never);
    assert.equal(r.status, 200);
    assert.deepEqual(sent[0].to, ["nabu@example.com", "other@example.com"]);
  } finally { restore(); }
});
