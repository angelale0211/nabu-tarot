/* A new time Nabu proposed, answered by the person who booked.

   Nabu proposes from the dashboard, where the Firestore rules let her write
   anything. The customer's answer cannot go the same way: the rules let a
   customer touch only status, newSlot and prevStatus of their own booking,
   and never delete a row of `taken`. Accepting moves the slot and frees the
   old hour, so it happens here, with the service account, after checking the
   three things the rules would have: the booking is theirs, a proposal is
   open, and the hour being accepted is the one Nabu proposed - never an hour
   of the customer's choosing. */
import { fsGet, fsPatch, fsDelete } from "./fs";
import type { PlayEnv } from "./play";

export type Answer = { ok: true; slot: string; status: string } | { ok: false; why: "bad" | "gone" | "not yours" | "nothing to answer" };

const keyOf = (slot: unknown): string => String(slot || "").replace(/[^0-9T]/g, "");

/* A row of `taken` is freed only while it still points at this booking. If
   somebody else holds that hour now, it is theirs and stays. */
async function freeIfOurs(env: PlayEnv, key: string, id: string): Promise<void> {
  if (!key) return;
  const row = await fsGet(env, "taken/" + key);
  if (row && row.bookingId === id) await fsDelete(env, "taken/" + key);
}

export async function answerProposal(env: PlayEnv, uid: string, id: string, yes: boolean): Promise<Answer> {
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(id)) return { ok: false, why: "bad" };
  const b = await fsGet(env, "bookings/" + id);
  if (!b) return { ok: false, why: "gone" };
  if (b.uid !== uid) return { ok: false, why: "not yours" };
  const proposed = typeof b.proposedSlot === "string" ? b.proposedSlot : "";
  if (b.status !== "change_proposed" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(proposed)) return { ok: false, why: "nothing to answer" };
  const back = typeof b.prevStatus === "string" && b.prevStatus ? b.prevStatus : "confirmed";

  if (yes) {
    const was = String(b.slot || "");
    /* Fields named in the mask but missing from the body are deleted, which is
       how the proposal closes. `exists` so a booking deleted meanwhile is not
       brought back as a stub. */
    const r = await fsPatch(env, "bookings/" + id,
      { slot: proposed, status: back, movedFrom: was, movedAt: new Date().toISOString() },
      ["slot", "status", "movedFrom", "movedAt", "proposedSlot", "prevStatus"], { exists: true });
    if (!r.ok) throw new Error("booking write " + r.status);
    /* The new hour was held as pending when Nabu proposed it; now it is
       simply held. The old one goes back on the calendar. */
    await fsPatch(env, "taken/" + keyOf(proposed), { bookingId: id, confirmed: back === "confirmed" }, ["bookingId", "pending", "confirmed"]);
    if (keyOf(was) !== keyOf(proposed)) await freeIfOurs(env, keyOf(was), id);
    return { ok: true, slot: proposed, status: back };
  }

  /* Declined: the booking keeps its old hour and says so, so Nabu sees it
     and can propose again, keep the old time or call it off. The terms
     promise a choice of another time or the full amount back. */
  const r = await fsPatch(env, "bookings/" + id,
    { status: "proposal_declined", declinedSlot: proposed },
    ["status", "declinedSlot", "proposedSlot"], { exists: true });
  if (!r.ok) throw new Error("booking write " + r.status);
  await freeIfOurs(env, keyOf(proposed), id);
  return { ok: true, slot: String(b.slot || ""), status: "proposal_declined" };
}
