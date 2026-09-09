/* ======================= what Play sells =======================
   Same table as worker/src/catalog.ts; the suite checks they agree. `key` is
   the app's own name (COURSES ids, ACCESS keys), `sku` the Play product id.
   Pro is two plans with the same contents; the wedding pays for one room. */
const PLAY_SUB_SKUS = { manifest: 'manifest_sub', plus: 'plus_sub', pro6: 'pro_sub', pro: 'pro12_sub' };   // input B1
const PLAY_ITEMS = [
  { key: 'tarot', sku: 'tarot', kind: 'inapp', opens: ['tarot'], months: 6 },
  { key: 'lenormand', sku: 'lenormand', kind: 'inapp', opens: ['lenormand'], months: 6 },
  { key: 'playing', sku: 'playing', kind: 'inapp', opens: ['playing'], months: 6 },
  { key: 'wedding', sku: 'wedding', kind: 'inapp', opens: [], months: 0 },
  { key: 'manifest', sku: PLAY_SUB_SKUS.manifest, kind: 'subs', opens: ['manifest'], months: 12 },
  { key: 'plus', sku: PLAY_SUB_SKUS.plus, kind: 'subs', opens: ['plus'], months: 12 },
  { key: 'pro6', sku: PLAY_SUB_SKUS.pro6, kind: 'subs', opens: ['pro', 'plus'], months: 6 },
  { key: 'pro', sku: PLAY_SUB_SKUS.pro, kind: 'subs', opens: ['pro', 'plus'], months: 12 }
];
const playItem = (key) => PLAY_ITEMS.filter((i) => i.key === key)[0] || null;
const playItemBySku = (sku) => (sku && PLAY_ITEMS.filter((i) => i.sku === sku)[0]) || null;
const PLAY_MANAGED_KEYS = ['manifest', 'plus', 'pro'];
