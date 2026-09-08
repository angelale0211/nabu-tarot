/* Redeeming an access code, on the one side that cannot be edited.

   Until now a code was checked on the phone against a public book of hashes,
   and the phone then wrote its own access. Two leaks followed from that: the
   book was public, so anyone could read it; and the phone was trusted, so a
   code was never bound to anybody and one code served a whole household.

   Now the book is private - only Nabu and this worker can read it - and this
   is where a code is checked. The entry is keyed by a plain SHA-256 of the
   salt and the code. A slow hash is no longer needed: nobody can try codes
   against a book they cannot read, and trying them here is rate limited. (It
   is also not possible: Workers refuse PBKDF2 above 100,000 rounds, and the
   old book used 250,000.)

   Claiming comes before granting, deliberately. Claim first, and a grant that
   fails leaves a code the same person can simply try again. Grant first, and
   a claim that fails leaves a code that worked once and still works for the
   next phone it is pasted into. */

import { serviceToken, FS_SCOPE } from "./play";

export interface CodesEnv {
  PLAY_SERVICE_ACCOUNT?: string;
  FIREBASE_PROJECT_ID?: string;
}

/* The published entry, as the dashboard writes it: what it opens, until when,
   and - once used - by whom. */
interface Entry { c: string; u: string; at?: string; by?: string; usedAt?: string; v?: number }

export type Claimed =
  | { ok: true; course: string; until: string }
  | { ok: false; why: "bad" | "used" | "expired" | "check failed" };

/* Must match codeDigest() in src/codes.js exactly: the dashboard writes the
   key the same way this reads it. */
const tidy = (s: string): string => String(s || "").toUpperCase().replace(/[^A-Z0-9]/g, "");

export async function codeKey(code: string, salt: string): Promise<string> {
  const bytes = new TextEncoder().encode(salt + "\n" + tidy(code));
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/* ---- the book, through the REST API ----
   Firestore's REST shape wraps every value: { stringValue }, { mapValue: {
   fields } }. Only the pieces this needs are unwrapped. */
type FsValue = { stringValue?: string; integerValue?: string; mapValue?: { fields?: Record<string, FsValue> } };

const str = (v: FsValue | undefined): string => (v && v.stringValue) || "";

function readEntry(v: FsValue | undefined): Entry | null {
  const f = v?.mapValue?.fields;
  if (!f || !str(f.c)) return null;
  return { c: str(f.c), u: str(f.u), at: str(f.at), by: str(f.by), usedAt: str(f.usedAt), v: Number(f.v?.integerValue || 0) };
}

const bookUrl = (env: CodesEnv): string =>
  "https://firestore.googleapis.com/v1/projects/" + encodeURIComponent(env.FIREBASE_PROJECT_ID || "")
  + "/databases/(default)/documents/content/codes";

const today = (): string => new Date().toISOString().slice(0, 10);

/* One attempt: read the book, find the entry, claim it. The claim carries the
   book's update time as a precondition, so two phones redeeming the same code
   in the same second cannot both succeed - the second write is refused and
   the caller reads again, by which time the entry says who has it. */
async function tryClaim(env: CodesEnv, uid: string, code: string, at: string): Promise<Claimed | "again"> {
  const r = await fetch(bookUrl(env), { headers: { Authorization: "Bearer " + at } });
  if (r.status === 404) return { ok: false, why: "bad" };      // no book at all: no code is real
  if (!r.ok) throw new Error("book " + r.status);
  const doc = (await r.json()) as { updateTime?: string; fields?: { salt?: FsValue; codes?: FsValue } };
  const salt = str(doc.fields?.salt);
  const key = await codeKey(code, salt);
  const entry = readEntry(doc.fields?.codes?.mapValue?.fields?.[key]);
  if (!entry) return { ok: false, why: "bad" };
  if (entry.by && entry.by !== uid) return { ok: false, why: "used" };
  if (!entry.u || entry.u < today()) return { ok: false, why: "expired" };
  if (entry.by === uid) return { ok: true, course: entry.c, until: entry.u };   // same person, new phone

  /* Only these two leaves, so nothing else in the book is touched, and only
     if the book is still the one that was just read. */
  const path = (leaf: string) => "codes.`" + key + "`." + leaf;
  const url = bookUrl(env)
    + "?updateMask.fieldPaths=" + encodeURIComponent(path("by"))
    + "&updateMask.fieldPaths=" + encodeURIComponent(path("usedAt"))
    + (doc.updateTime ? "&currentDocument.updateTime=" + encodeURIComponent(doc.updateTime) : "");
  const body = { fields: { codes: { mapValue: { fields: { [key]: { mapValue: { fields: {
    by: { stringValue: uid }, usedAt: { stringValue: today() },
  } } } } } } } };
  const w = await fetch(url, {
    method: "PATCH",
    headers: { Authorization: "Bearer " + at, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (w.ok) return { ok: true, course: entry.c, until: entry.u };
  if (w.status === 400 || w.status === 409 || w.status === 412) return "again";   // the book moved under us
  throw new Error("claim " + w.status);
}

export async function claimCode(env: CodesEnv, uid: string, code: string): Promise<Claimed> {
  if (tidy(code).length < 8) return { ok: false, why: "bad" };
  const at = await serviceToken(env, FS_SCOPE);
  for (let i = 0; i < 3; i++) {
    const got = await tryClaim(env, uid, code, at);
    if (got !== "again") return got;
  }
  return { ok: false, why: "check failed" };
}
