/* Firestore over REST with the service account, the way the worker already
   talks to it in play.ts and refunds.ts - gathered here so the new code does
   not hand-build {stringValue} maps a third time. */
import { serviceToken, FS_SCOPE, PlayEnv } from "./play";

type FsValue = Record<string, unknown>;
export const docUrl = (env: PlayEnv, path: string): string =>
  "https://firestore.googleapis.com/v1/projects/" + encodeURIComponent(env.FIREBASE_PROJECT_ID || "")
  + "/databases/(default)/documents/" + path;

export function encode(o: Record<string, unknown>): Record<string, FsValue> {
  const out: Record<string, FsValue> = {};
  for (const k of Object.keys(o)) if (o[k] !== undefined) out[k] = val(o[k]);
  return out;
}
function val(v: unknown): FsValue {
  if (typeof v === "string") return { stringValue: v };
  if (typeof v === "boolean") return { booleanValue: v };
  if (typeof v === "number") return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(val) } };
  if (v && typeof v === "object") return { mapValue: { fields: encode(v as Record<string, unknown>) } };
  return { nullValue: null };
}
export function decode(doc: { fields?: Record<string, FsValue> }): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  const f = doc.fields || {};
  for (const k of Object.keys(f)) out[k] = unval(f[k]);
  return out;
}
function unval(v: FsValue): unknown {
  if ("stringValue" in v) return v.stringValue;
  if ("booleanValue" in v) return v.booleanValue;
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return v.doubleValue;
  if ("arrayValue" in v) return (((v.arrayValue as { values?: FsValue[] }).values) || []).map(unval);
  if ("mapValue" in v) return decode(v.mapValue as { fields?: Record<string, FsValue> });
  return null;
}

export async function fsGet(env: PlayEnv, path: string): Promise<Record<string, unknown> | null> {
  const at = await serviceToken(env, FS_SCOPE);
  const r = await fetch(docUrl(env, path), { headers: { Authorization: "Bearer " + at } });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error("firestore get " + r.status);
  return decode((await r.json()) as { fields?: Record<string, FsValue> });
}

/* PATCH with an update mask writes only the named top-level fields and leaves
   the rest of the document alone. createOnly adds the precondition that the
   document must not exist yet, which is how a purchase token is claimed. */
export async function fsPatch(env: PlayEnv, path: string, obj: Record<string, unknown>, mask?: string[], opts?: { createOnly?: boolean }): Promise<Response> {
  const at = await serviceToken(env, FS_SCOPE);
  const q: string[] = [];
  // An empty array is truthy, so `mask || Object.keys(obj)` would pick []
  // and emit zero fieldPaths. A Firestore PATCH with no updateMask at all
  // replaces the whole document instead of merging, so treat an empty
  // mask as absent, and refuse to send a request with no fields at all.
  const fields = mask && mask.length ? mask : Object.keys(obj);
  if (fields.length === 0) throw new Error("fsPatch: empty field mask for " + path);
  for (const f of fields) q.push("updateMask.fieldPaths=" + encodeURIComponent(f));
  if (opts && opts.createOnly) q.push("currentDocument.exists=false");
  return fetch(docUrl(env, path) + (q.length ? "?" + q.join("&") : ""), {
    method: "PATCH",
    headers: { Authorization: "Bearer " + at, "Content-Type": "application/json" },
    body: JSON.stringify({ fields: encode(obj) }),
  });
}
