import { test } from "node:test";
import assert from "node:assert/strict";
import { answerProposal } from "../src/bookings";
import { makeKeys, env, mockFetch, json, fsDoc } from "./util";
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
