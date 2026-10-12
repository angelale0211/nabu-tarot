/* Push notifications for the iPhone app.

   The phone files its FCM token here (/push-register) under the signed-in
   account: pushtokens/{uid} = { tokens: { <token>: { lang, platform, at } } }.

   Nabu answers messages and confirms or moves bookings in #/admin, which
   writes Firestore directly and never calls this worker. So nothing can send
   "at the moment it happens"; instead the scheduled sweep (every 15 minutes)
   looks, for each account that has a token, at its thread and its bookings
   and tells the person about what changed since it last looked:
     threads/{uid}.pushedAt   the lastAt of the last answer already told
     bookings/{id}.pushed     the status last seen
   Registering for the first time marks everything already there as seen, so
   turning notifications on never delivers a burst of old news.

   Sending is FCM HTTP v1 with the worker's service account, which needs the
   Firebase Cloud Messaging API enabled and the firebase.messaging scope. */
import { serviceToken, FS_SCOPE, PlayEnv } from "./play";
import { decode, docUrl, fsGet, fsPatch } from "./fs";

export const FCM_SCOPE = "https://www.googleapis.com/auth/firebase.messaging";

type Kind = "reply" | "confirmed" | "moved" | "daily";
type Text = { title: string; body: string };
const TEXTS: Record<Kind, Record<string, Text>> = {
  reply: {
    vi: { title: "Nabu đã trả lời bạn", body: "Mở tin nhắn để đọc." },
    en: { title: "Nabu has answered you", body: "Open your messages to read it." },
    de: { title: "Nabu hat dir geantwortet", body: "Öffne deine Nachrichten, um sie zu lesen." },
  },
  confirmed: {
    vi: { title: "Lịch hẹn đã được xác nhận", body: "Nabu đã xác nhận buổi đọc bài của bạn." },
    en: { title: "Your booking is confirmed", body: "Nabu has confirmed your reading." },
    de: { title: "Dein Termin ist bestätigt", body: "Nabu hat deine Legung bestätigt." },
  },
  moved: {
    vi: { title: "Nabu đề xuất giờ mới", body: "Mở lịch hẹn để đồng ý hoặc từ chối." },
    en: { title: "Nabu suggests a new time", body: "Open your bookings to accept or decline." },
    de: { title: "Nabu schlägt eine neue Zeit vor", body: "Öffne deine Termine, um zuzusagen oder abzulehnen." },
  },
  daily: {
    vi: { title: "Nabu Tarot", body: "Lá bài hôm nay của bạn đang chờ." },
    en: { title: "Nabu Tarot", body: "Your card for today is waiting." },
    de: { title: "Nabu Tarot", body: "Deine Karte für heute wartet." },
  },
};
export function pushText(kind: Kind, lang: string): Text {
  return TEXTS[kind][lang] || TEXTS[kind].vi;
}

type Tokens = Record<string, { lang?: string; platform?: string; at?: number }>;
type Msg = { title: string; body: string; route: string };

const tokensOf = (doc: Record<string, unknown> | null): Tokens => (doc && (doc.tokens as Tokens)) || {};

/* Raw fields of one document, for the timestamps decode() does not read. */
async function rawGet(env: PlayEnv, path: string): Promise<Record<string, Record<string, unknown>> | null> {
  const at = await serviceToken(env, FS_SCOPE);
  const r = await fetch(docUrl(env, path), { headers: { Authorization: "Bearer " + at } });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error("firestore get " + r.status);
  return ((await r.json()) as { fields?: Record<string, Record<string, unknown>> }).fields || {};
}

async function bookingsOf(env: PlayEnv, uid: string): Promise<{ id: string; f: Record<string, unknown> }[]> {
  const at = await serviceToken(env, FS_SCOPE);
  const base = "https://firestore.googleapis.com/v1/projects/" + encodeURIComponent(env.FIREBASE_PROJECT_ID || "") + "/databases/(default)/documents";
  const r = await fetch(base + ":runQuery", {
    method: "POST",
    headers: { Authorization: "Bearer " + at, "Content-Type": "application/json" },
    body: JSON.stringify({ structuredQuery: {
      from: [{ collectionId: "bookings" }],
      where: { fieldFilter: { field: { fieldPath: "uid" }, op: "EQUAL", value: { stringValue: uid } } },
      limit: 100,
    } }),
  });
  if (!r.ok) throw new Error("firestore query " + r.status);
  const rows = (await r.json()) as { document?: { name?: string; fields?: Record<string, Record<string, unknown>> } }[];
  return rows.filter((x) => x.document && x.document.name)
    .map((x) => ({ id: String(x.document!.name).split("/").pop() || "", f: decode(x.document!) }));
}

/* Everything this account already has is marked as told. */
async function baseline(env: PlayEnv, uid: string): Promise<void> {
  const th = await rawGet(env, "threads/" + uid);
  const last = th && th.lastAt && (th.lastAt.timestampValue as string);
  if (last) await fsPatch(env, "threads/" + uid, { pushedAt: last }, ["pushedAt"], { exists: true });
  for (const b of await bookingsOf(env, uid)) {
    if (typeof b.f.status === "string") await fsPatch(env, "bookings/" + b.id, { pushed: b.f.status }, ["pushed"], { exists: true });
  }
}

export async function registerPush(env: PlayEnv, uid: string, token: string, lang: string): Promise<{ ok: true; first: boolean }> {
  const doc = await fsGet(env, "pushtokens/" + uid);
  const tokens = tokensOf(doc);
  const first = Object.keys(tokens).length === 0;
  tokens[token] = { lang: ["vi", "en", "de"].indexOf(lang) > -1 ? lang : "vi", platform: "ios", at: Date.now() };
  if (first) await baseline(env, uid);
  const r = await fsPatch(env, "pushtokens/" + uid, { tokens }, ["tokens"]);
  if (!r.ok) throw new Error("firestore patch " + r.status);
  return { ok: true, first };
}

export async function unregisterPush(env: PlayEnv, uid: string, token: string): Promise<void> {
  const doc = await fsGet(env, "pushtokens/" + uid);
  const tokens = tokensOf(doc);
  if (!(token in tokens)) return;
  delete tokens[token];
  await fsPatch(env, "pushtokens/" + uid, { tokens }, ["tokens"]);
}

/* One message to every phone of this account, in each phone's language. A
   token FCM no longer knows is dropped; an outage keeps it. */
export async function sendPush(env: PlayEnv, uid: string, text: (lang: string) => Msg): Promise<{ sent: number; dropped: number }> {
  const doc = await fsGet(env, "pushtokens/" + uid);
  const tokens = tokensOf(doc);
  const out = { sent: 0, dropped: 0 };
  if (!Object.keys(tokens).length) return out;
  const at = await serviceToken(env, FCM_SCOPE);
  const url = "https://fcm.googleapis.com/v1/projects/" + encodeURIComponent(env.FIREBASE_PROJECT_ID || "") + "/messages:send";
  const dead: string[] = [];
  for (const token of Object.keys(tokens)) {
    const m = text(tokens[token].lang || "vi");
    const r = await fetch(url, {
      method: "POST",
      headers: { Authorization: "Bearer " + at, "Content-Type": "application/json" },
      body: JSON.stringify({ message: {
        token,
        notification: { title: m.title, body: m.body },
        data: { route: m.route },
        apns: { payload: { aps: { sound: "default" } } },
      } }),
    });
    if (r.ok) { out.sent++; continue; }
    const j = (await r.json().catch(() => ({}))) as { error?: { status?: string; details?: { errorCode?: string }[] } };
    const code = ((j.error && j.error.details) || []).map((d) => d.errorCode).join(",");
    if (r.status === 404 || /UNREGISTERED|INVALID_ARGUMENT/.test(code) || (j.error && j.error.status === "NOT_FOUND")) dead.push(token);
  }
  if (dead.length) {
    for (const t of dead) delete tokens[t];
    await fsPatch(env, "pushtokens/" + uid, { tokens }, ["tokens"]);
    out.dropped = dead.length;
  }
  return out;
}

async function accounts(env: PlayEnv): Promise<string[]> {
  const at = await serviceToken(env, FS_SCOPE);
  const r = await fetch(docUrl(env, "pushtokens") + "?pageSize=300", { headers: { Authorization: "Bearer " + at } });
  if (!r.ok) throw new Error("firestore list " + r.status);
  const j = (await r.json()) as { documents?: { name?: string; fields?: Record<string, Record<string, unknown>> }[] };
  return (j.documents || [])
    .filter((d) => Object.keys(tokensOf(decode(d))).length)
    .map((d) => String(d.name || "").split("/").pop() || "")
    .filter(Boolean);
}

const PUSHABLE: Record<string, Kind> = { confirmed: "confirmed", change_proposed: "moved" };

/* Daily card: the sweep that runs in the first quarter hour after 00:00 UTC,
   which is 07:00 in Vietnam. */
const dailyWindow = (now: Date) => now.getUTCHours() === 0 && now.getUTCMinutes() < 15;

export async function sweepPush(env: PlayEnv, now: Date): Promise<{ people: number; sent: number }> {
  const out = { people: 0, sent: 0 };
  for (const uid of await accounts(env)) {
    out.people++;
    try {
      const th = await rawGet(env, "threads/" + uid);
      if (th) {
        const last = (th.lastAt && (th.lastAt.timestampValue as string)) || "";
        const told = (th.pushedAt && (th.pushedAt.stringValue as string)) || "";
        const unread = Number((th.userUnread && th.userUnread.integerValue) || 0);
        const from = (th.lastFrom && th.lastFrom.stringValue) || "";
        if (from === "nabu" && unread > 0 && last && (!told || Date.parse(last) > Date.parse(told))) {
          const said = String((th.lastText && th.lastText.stringValue) || "").slice(0, 140);
          out.sent += (await sendPush(env, uid, (lang) => ({ ...pushText("reply", lang), ...(said ? { body: said } : {}), route: "me/inbox" }))).sent;
          await fsPatch(env, "threads/" + uid, { pushedAt: last }, ["pushedAt"], { exists: true });
        }
      }
      for (const b of await bookingsOf(env, uid)) {
        const status = typeof b.f.status === "string" ? b.f.status : "";
        if (!status || b.f.pushed === status) continue;
        const kind = PUSHABLE[status];
        if (kind) out.sent += (await sendPush(env, uid, (lang) => ({ ...pushText(kind, lang), route: "me/bookings" }))).sent;
        await fsPatch(env, "bookings/" + b.id, { pushed: status }, ["pushed"], { exists: true });
      }
      if (dailyWindow(now)) out.sent += (await sendPush(env, uid, (lang) => ({ ...pushText("daily", lang), route: "pick" }))).sent;
    } catch (e) {
      console.error(JSON.stringify({ at: "push-sweep", uid, error: String((e as Error).message || e) }));
    }
  }
  return out;
}
