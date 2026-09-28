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

/* ---- a booking mailed to Nabu ----

   The app used to POST the whole booking and a list of recipients here, and
   the worker mailed whatever it was given to whoever it was told: anybody
   could have used it to send mail. Now the app sends only the booking's id
   with the sign-in, and everything in the mail is read from Firestore: the
   booking has to exist and be the caller's own, and the mail goes only to
   the addresses in MAIL_TO (wrangler.toml), never to one from the request.

   Slots are Vietnam wall-clock times ("2026-10-01T19:00", UTC+7, no daylight
   saving). The calendar file writes them in UTC, which every calendar reads
   the same way; a TZID with no VTIMEZONE beside it is not understood by all
   of them, Outlook among them. */
export interface MailEnv extends PlayEnv { RESEND_API_KEY?: string; MAIL_TO?: string; MAIL_FROM?: string }
export type Mail = { subject: string; text: string; ics?: string };
export type MailResult = { ok: true; sent: boolean; why?: string } | { ok: false; why: "bad" | "gone" | "not yours" };

const SLOT_RE = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;
/* The moment a Vietnam wall-clock slot starts, as a UTC Date. */
export function slotUtc(slot: unknown): Date | null {
  const m = SLOT_RE.exec(String(slot || ""));
  return m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4] - 7, +m[5])) : null;
}
const icsTime = (d: Date): string => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const human = (slot: unknown): string => {
  const m = SLOT_RE.exec(String(slot || ""));
  return m ? m[4] + ":" + m[5] + " " + m[3] + "/" + m[2] + "/" + m[1] + " (giờ Việt Nam)" : String(slot || "");
};
const str = (v: unknown, n = 600): string => (typeof v === "string" ? v.trim().slice(0, n) : typeof v === "number" ? String(v) : "");

export const mailTo = (env: MailEnv): string[] =>
  String(env.MAIL_TO || "").split(",").map((x) => x.trim()).filter((x) => /^[^@\s,]+@[^@\s,]+\.[^@\s,]+$/.test(x)).slice(0, 5);

/* What Nabu reads. Vietnamese, because she reads it. */
export function bookingMail(b: Record<string, unknown>, id: string, now = new Date()): Mail | null {
  const start = slotUtc(b.slot);
  if (!start) return null;
  const status = str(b.status, 40), service = str(b.service, 300), name = str(b.name, 120);
  const head = status === "change_requested" ? "Khách xin đổi giờ" : status === "cancel_requested" ? "Khách xin huỷ lịch" : "Lịch hẹn mới";
  const subject = "Nabu Tarot: " + head + " · " + (name || str(b.email, 120) || "khách") + " · " + human(b.slot);
  const lines = [
    head,
    "Giờ đã đặt: " + human(b.slot),
    status === "change_requested" && b.newSlot ? "Giờ mới khách xin: " + human(b.newSlot) : "",
    service ? "Dịch vụ: " + service + (typeof b.price === "number" && b.price ? " (" + b.price + "đ)" : "") : "",
    str(b.topic) ? "Chủ đề: " + str(b.topic) : "",
    name ? "Khách: " + name : "",
    str(b.email) ? "Email: " + str(b.email) : "",
    str(b.whereName) ? "Hình thức: " + str(b.whereName) + (str(b.whereId) ? " · " + str(b.whereId) : "") : "",
    str(b.birth) ? "Ngày giờ sinh: " + str(b.birth) : "",
    str(b.card) ? "Lá đã rút: " + str(b.card) : "",
    str(b.note, 2000) ? "Ghi chú: " + str(b.note, 2000) : "",
    "Mã đặt lịch: " + id,
  ].filter(Boolean);
  const text = lines.join("\n") + "\n\nTrả lời trong app: https://nabutarot.com/#/admin?tab=bookings";
  /* Only a new booking carries a calendar file. A change or a cancellation is
     a question Nabu answers in the app; putting it in her calendar first would
     move or drop the hour before she has said yes. */
  if (status && status !== "requested") return { subject, text };
  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
  const end = new Date(start.getTime() + 60 * 60000);
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Nabu Tarot//Booking//VI", "METHOD:PUBLISH", "BEGIN:VEVENT",
    "UID:" + id + "@nabu-tarot", "DTSTAMP:" + icsTime(now), "DTSTART:" + icsTime(start), "DTEND:" + icsTime(end),
    "SUMMARY:" + esc("Nabu Tarot: " + (service || "") + (name ? " · " + name : "")), "DESCRIPTION:" + esc(text),
    "STATUS:TENTATIVE", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  return { subject, text, ics };
}

/* Sent only while RESEND_API_KEY and MAIL_TO are both set; without them this
   answers { ok: true, sent: false } and nothing leaves the worker. */
export async function mailBooking(env: MailEnv, uid: string, id: string): Promise<MailResult> {
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(id)) return { ok: false, why: "bad" };
  const to = mailTo(env);
  if (!env.RESEND_API_KEY || !to.length) return { ok: true, sent: false, why: "mail off" };
  const b = await fsGet(env, "bookings/" + id);
  if (!b) return { ok: false, why: "gone" };
  if (b.uid !== uid) return { ok: false, why: "not yours" };
  const mail = bookingMail(b, id);
  if (!mail) return { ok: false, why: "bad" };
  const utf8b64 = (s: string) => { const u = new TextEncoder().encode(s); let x = ""; for (let i = 0; i < u.length; i++) x += String.fromCharCode(u[i]); return btoa(x); };
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST", headers: { Authorization: "Bearer " + env.RESEND_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.MAIL_FROM || "Nabu Tarot <onboarding@resend.dev>", to, subject: mail.subject, text: mail.text,
      ...(mail.ics ? { attachments: [{ filename: "nabu-booking.ics", content: utf8b64(mail.ics), content_type: "text/calendar; charset=utf-8" }] } : {}),
    }),
  });
  if (!r.ok) throw new Error("mail " + r.status + " " + (await r.text().catch(() => "")).slice(0, 200));
  return { ok: true, sent: true };
}
