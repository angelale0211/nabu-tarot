/* What Play sells, and what each thing opens inside the app.

   Two different names for one thing, on purpose. The `sku` is the Play
   product id, chosen in the Console and impossible to rename. The `key` is
   what the app has always called the thing (`ACCESS.has('pro')`), and
   `opens` are the access keys a purchase writes. Pro comes in two plans that
   open exactly the same keys; only the months differ.

   The client has the same table in src/play-catalog.js. A test on each side
   checks they agree. */
export type Kind = "inapp" | "subs";
export interface PlayItem { key: string; sku: string; kind: Kind; opens: string[]; months: number }

/* Input B1: the subscription product ids created in Play Console. Empty
   until confirmed; an empty sku is never matched and never sold. */
export const PLAY_SUB_SKUS = { manifest: "manifest_sub", plus: "plus_sub", pro6: "pro_sub", pro: "pro12_sub" };

export const PLAY_ITEMS: PlayItem[] = [
  { key: "tarot", sku: "tarot", kind: "inapp", opens: ["tarot"], months: 6 },
  { key: "lenormand", sku: "lenormand", kind: "inapp", opens: ["lenormand"], months: 6 },
  { key: "playing", sku: "playing", kind: "inapp", opens: ["playing"], months: 6 },
  /* A wedding opens no key: it pays for one room, named in the request. */
  { key: "wedding", sku: "wedding", kind: "inapp", opens: [], months: 0 },
  { key: "manifest", sku: PLAY_SUB_SKUS.manifest, kind: "subs", opens: ["manifest"], months: 12 },
  { key: "plus", sku: PLAY_SUB_SKUS.plus, kind: "subs", opens: ["plus"], months: 12 },
  { key: "pro6", sku: PLAY_SUB_SKUS.pro6, kind: "subs", opens: ["pro", "plus"], months: 6 },
  { key: "pro", sku: PLAY_SUB_SKUS.pro, kind: "subs", opens: ["pro", "plus"], months: 12 },
];

export const itemBySku = (sku: string): PlayItem | null =>
  (sku && PLAY_ITEMS.find((i) => i.sku === sku)) || null;
export const itemByKey = (key: string): PlayItem | null =>
  PLAY_ITEMS.find((i) => i.key === key) || null;

/* The keys subscriptions decide. They are recomputed from users.subs on every
   event; course keys are never touched by that. */
export const PLAY_MANAGED_KEYS: ReadonlySet<string> = new Set(
  PLAY_ITEMS.filter((i) => i.kind === "subs").flatMap((i) => i.opens));
