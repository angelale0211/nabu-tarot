/* Taking a course back when the money goes back.

   Google lets a buyer refund within 48 hours, and Nabu can refund from the
   Console at any time. Neither tells this worker. Without what is below, a
   refunded purchase leaves the course open forever: the one hole that billing
   opens rather than closes.

   Google will say which purchases were voided, but only by purchase token -
   it does not know or care who the buyer is here. So every grant writes down
   which account it opened and what it opened, filed under the token. A voided
   token is then a lookup rather than a search.

   The token is filed under its SHA-256 rather than itself. A purchase token is
   long, opaque and not chosen by us; a fixed-length hex string is a document
   id we can be sure of. Google hands back the same token, so the same hash
   comes out the other end. */

import { serviceToken, FS_SCOPE, PLAY_SCOPE, PlayEnv } from "./play";

/* A day is plenty - this runs daily - but a week of overlap costs nothing and
   covers a day the worker was down or a run that failed. */
const LOOK_BACK_DAYS = 7;

export const tokenId = async (token: string): Promise<string> => {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
};

const docUrl = (env: PlayEnv, path: string): string =>
  "https://firestore.googleapis.com/v1/projects/" + encodeURIComponent(env.FIREBASE_PROJECT_ID || "")
  + "/databases/(default)/documents/" + path;

/* ---- the ledger ----

   Written after the access, and never in front of it: a purchase recorded that
   was never granted would be revoked later for a course the buyer never had. */
export async function recordPurchase(
  env: PlayEnv, uid: string, sku: string, ids: string[], token: string,
): Promise<void> {
  const at = await serviceToken(env, FS_SCOPE);
  const id = await tokenId(token);
  const body = {
    fields: {
      uid: { stringValue: uid },
      sku: { stringValue: sku },
      ids: { arrayValue: { values: ids.map((x) => ({ stringValue: x })) } },
      at: { stringValue: new Date().toISOString() },
      state: { stringValue: "granted" },
    },
  };
  const r = await fetch(docUrl(env, "purchases/" + id), {
    method: "PATCH",
    headers: { Authorization: "Bearer " + at, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error("ledger " + r.status);
}

/* ---- what Google says was voided ---- */
interface Voided { purchaseToken?: string; voidedTimeMillis?: string; orderId?: string }

export async function voidedSince(env: PlayEnv, sinceMs: number): Promise<Voided[]> {
  const pkg = env.ANDROID_PACKAGE || "app.nabutarot.twa";
  const at = await serviceToken(env, PLAY_SCOPE);
  const out: Voided[] = [];
  let token = "";
  /* Paged, and capped: a runaway page loop in a scheduled job is a bill nobody
     is watching. Ten pages is far more than this shop will ever void in a week. */
  for (let page = 0; page < 10; page++) {
    const url = "https://androidpublisher.googleapis.com/androidpublisher/v3/applications/"
      + encodeURIComponent(pkg) + "/purchases/voidedpurchases"
      + "?startTime=" + sinceMs + "&maxResults=100" + (token ? "&token=" + encodeURIComponent(token) : "");
    const r = await fetch(url, { headers: { Authorization: "Bearer " + at } });
    if (r.status === 404) return out;           // nothing has ever been voided
    if (!r.ok) throw new Error("voided " + r.status);
    const j = (await r.json()) as { voidedPurchases?: Voided[]; tokenPagination?: { nextPageToken?: string } };
    out.push(...(j.voidedPurchases || []));
    token = j.tokenPagination?.nextPageToken || "";
    if (!token) break;
  }
  return out;
}

/* ---- taking it back ----

   Only the courses this purchase opened, and only if they are still the ones
   it opened. Somebody who refunds one course and keeps another must keep the
   other. */
async function removeAccess(env: PlayEnv, uid: string, ids: string[]): Promise<string[]> {
  const at = await serviceToken(env, FS_SCOPE);
  const base = docUrl(env, "users/" + encodeURIComponent(uid));
  const cur = await fetch(base, { headers: { Authorization: "Bearer " + at } });
  if (!cur.ok) return [];
  const doc = (await cur.json()) as { fields?: { access?: { mapValue?: { fields?: Record<string, { stringValue?: string }> } } } };
  const held = doc.fields?.access?.mapValue?.fields || {};

  const fields: Record<string, { stringValue: string }> = {};
  const taken: string[] = [];
  for (const k of Object.keys(held)) {
    if (ids.indexOf(k) > -1) { taken.push(k); continue; }
    if (held[k].stringValue) fields[k] = { stringValue: held[k].stringValue as string };
  }
  if (!taken.length) return [];

  const w = await fetch(base + "?updateMask.fieldPaths=access", {
    method: "PATCH",
    headers: { Authorization: "Bearer " + at, "Content-Type": "application/json" },
    body: JSON.stringify({ fields: { access: { mapValue: { fields } } } }),
  });
  if (!w.ok) throw new Error("firestore " + w.status);
  return taken;
}

/* Marked so the same refund is not processed every night for a week, and so
   the Pay tab can show what happened rather than a silent gap. */
async function markVoided(env: PlayEnv, id: string, taken: string[]): Promise<void> {
  const at = await serviceToken(env, FS_SCOPE);
  const body = {
    fields: {
      state: { stringValue: "voided" },
      voidedAt: { stringValue: new Date().toISOString() },
      took: { arrayValue: { values: taken.map((x) => ({ stringValue: x })) } },
    },
  };
  const mask = ["state", "voidedAt", "took"].map((f) => "updateMask.fieldPaths=" + f).join("&");
  await fetch(docUrl(env, "purchases/" + id) + "?" + mask, {
    method: "PATCH",
    headers: { Authorization: "Bearer " + at, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export interface Swept { looked: number; matched: number; revoked: number; skipped: number }

/* One pass. Safe to run twice: a purchase already marked voided is left alone,
   and removing a course that is already gone changes nothing. */
export async function sweepRefunds(env: PlayEnv): Promise<Swept> {
  const out: Swept = { looked: 0, matched: 0, revoked: 0, skipped: 0 };
  if (!env.PLAY_SERVICE_ACCOUNT || !env.FIREBASE_PROJECT_ID) return out;

  const since = Date.now() - LOOK_BACK_DAYS * 86400000;
  const list = await voidedSince(env, since);
  out.looked = list.length;

  const at = await serviceToken(env, FS_SCOPE);
  for (const v of list) {
    if (!v.purchaseToken) continue;
    const id = await tokenId(v.purchaseToken);
    const r = await fetch(docUrl(env, "purchases/" + id), { headers: { Authorization: "Bearer " + at } });
    /* Not ours, or granted before the ledger existed. Nothing to act on, and
       guessing whose it was would be worse than leaving it. */
    if (!r.ok) { out.skipped++; continue; }
    const doc = (await r.json()) as {
      fields?: { uid?: { stringValue?: string }; state?: { stringValue?: string };
                 ids?: { arrayValue?: { values?: { stringValue?: string }[] } } };
    };
    const uid = doc.fields?.uid?.stringValue || "";
    if (doc.fields?.state?.stringValue === "voided") { out.skipped++; continue; }
    const ids = (doc.fields?.ids?.arrayValue?.values || []).map((x) => x.stringValue || "").filter(Boolean);
    if (!uid || !ids.length) { out.skipped++; continue; }
    out.matched++;
    const taken = await removeAccess(env, uid, ids);
    await markVoided(env, id, taken);
    if (taken.length) out.revoked++;
    console.log(JSON.stringify({ at: "refund", uid, took: taken, order: v.orderId || "" }));
  }
  return out;
}
