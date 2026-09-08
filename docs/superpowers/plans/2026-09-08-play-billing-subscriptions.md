# Google Play Billing (one-time + subscriptions + wedding) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Inside the Android app every course, subscription and the wedding is bought through Google Play and unlocked by the worker automatically; the website is unchanged.

**Architecture:** A shared catalogue maps Play product IDs to internal access keys on both sides. The Cloudflare Worker is the only writer of entitlements (`users/{uid}.access` + new `users/{uid}.subs`), verifies every token with Google (`purchases.products` for one-time, `purchases.subscriptionsv2` for subscriptions), keeps a token-keyed ledger for idempotency, receives Real-time Developer Notifications on `/rtdn`, and reconciles every 6 hours. The client (`billing.js` + new `store.js`) only shows Play's prices, launches Play, sends tokens, and re-reads the account.

**Tech Stack:** Vanilla JS PWA built by `python build.py`; Cloudflare Worker in TypeScript (no libraries, WebCrypto); Firebase Auth + Firestore (REST from the worker, compat SDK on the client); Digital Goods API 2.1 via android-browser-helper's Play Billing bridge (already in the shipped AAB); Google Play Developer API v3; Cloud Pub/Sub push.

**Spec:** `docs/superpowers/specs/2026-09-08-play-billing-subscriptions-design.md`

## Global Constraints

- **Do not start until the other window's ~40 uncommitted files are committed and its release is out.** Then `git pull`, work on `main`. Never run `python build.py`, commit `index.html` or release while another window is editing or running the suite (`netstat -ano | findstr :8765` must be empty right before a build).
- Package `app.nabutarot.twa`; live site `https://nabutarot.com`; worker `https://nabu-ai.0211nhatanh.workers.dev`; Firebase project `nabutarot`.
- Internal access keys stay: `tarot lenormand playing manifest plus pro wedding`. `pro6` is a *catalogue key* (a Pro plan), never an access key.
- Legacy one-time Play products `manifest plus pro6 pro` are never listed or accepted.
- Play product IDs for the four subscriptions come from **input B1** (Task 0). Until B1 is filled the four `sku` values in both catalogue files are `''` and every test that needs them is skipped with a printed reason — never invented.
- Vietnamese customer copy is the owner's (**input B3**). New `vi` strings carry the literal marker `VI-OWNER:` followed by the English until the owner's line is pasted; Task 13 refuses to release while `grep -c "VI-OWNER:" src/strings.js` is not 0. Short sentences, one idea each, everyday tarot words.
- Never print the contents of `C:\Users\angel\nabu-tarot-keys\*.json`. Never commit anything from `nabu-tarot-keys`.
- Secrets live only in Worker secrets (`PLAY_SERVICE_ACCOUNT`). No new secrets.
- Bash heredocs mangle Vietnamese: edit with the Edit tool or a Python script that asserts `s.count(anchor) == 1` before each replace. Set `PYTHONIOENCODING=utf-8` before printing Vietnamese.
- Suite: `PYTHONIOENCODING=utf-8 python test/run.py` (~6 min). Second window: `NABU_PORT=8766`. Worker tests: `cd worker && npm test`.
- A commit's `index.html` can predate its source: before calling anything done, grep the built file for a string only the new code has.
- Never shut down, restart or sleep this PC.

---

## File map

| File | Responsibility |
|---|---|
| `src/play-catalog.js` (new) | `PLAY_SUB_SKUS`, `PLAY_ITEMS`, `playItem(key)`, `playItemBySku(sku)` |
| `src/billing.js` (rewrite) | `BILL`: start/retry/details/buy/verify/pending/restore/sync |
| `src/store.js` (new) | in-app store (`#/unlock` in TWA), Me-tab plans card, status words |
| `src/learn.js` | paywall TWA branch; `#/unlock` delegates to store in TWA; web loses reward panel |
| `src/me.js`, `src/play.js`, `src/pick.js` | TWA branches: no code boxes, Buy Plus, plans card |
| `src/wedding.js`, `src/admin.js` | per-room paid, no move, TWA pay button, terms |
| `src/luck.js`, `src/services.js` | vouchers trimmed, Pro includes |
| `src/backend.js`, `src/core.js` | `subs` pulled and exposed as `SUBS` |
| `src/strings.js` | new `st*` keys, wedding terms, coin lines (vi/en/de) |
| `build.py` | `play-catalog.js` and `store.js` in `SCRIPTS` |
| `firestore.rules` | `subs` paid-only; wedding keys |
| `worker/src/catalog.ts` (new) | same mapping as the client |
| `worker/src/fs.ts` (new) | Firestore REST get/patch + encode/decode |
| `worker/src/play.ts` | `checkSubscription`, `acknowledgeSub` |
| `worker/src/entitle.ts` (new) | `subAccess`, `recompute`, `applySubscription`, `payRoom` |
| `worker/src/refunds.ts` | ledger fields `kind until wid plan`, `claimPurchase` returns the existing row, `ledgerGet`, `ledgerSet`, `unpayRoom` |
| `worker/src/auth.ts` | `verifyJwt`, `verifyGoogleJwt` |
| `worker/src/rtdn.ts` (new) | `/rtdn` handler |
| `worker/src/reconcile.ts` (new) | `reconcileSubs` |
| `worker/src/index.ts` | `/billing` rewrite, `/rtdn` route, scheduled |
| `worker/wrangler.toml`, `worker/package.json`, `.github/workflows/worker.yml` | vars, cron, tests |
| `worker/test/*.test.ts` (new) | node tests |
| `test/test.html` | `playMode` stub + checks |
| `scripts/play-probe.py` (new, untracked-safe) | read-only Play probe for B1 |

---

### Task 0: Preconditions, the Play probe, and inputs B1/B2

**Files:**
- Create: `scripts/play-probe.py`

**Interfaces:**
- Produces: the four subscription `sku` values for Task 1, or the owner's table.

- [ ] **Step 1: Confirm the tree is clean and current**

Run:
```bash
cd ~/nabu-tarot && git status --short | wc -l && git log --oneline -1 && git fetch -q && git status -sb | head -1
```
Expected: `0` modified files, `## main...origin/main` (not behind). If not, stop: the other window has not landed. Do not proceed.

- [ ] **Step 2: Write the read-only probe**

```python
# scripts/play-probe.py
"""Read-only: lists the in-app products and subscriptions (with base plans)
Play knows for app.nabutarot.twa, using the worker's service account. Prints
IDs only. Never prints the key. Exit 2 = permission refused (owner must link
the service account, Task 0 step 4)."""
import glob, json, sys, time, urllib.request, urllib.parse, base64
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding

KEY = sorted(glob.glob(r'C:\Users\angel\nabu-tarot-keys\*.json'))[0]
PKG = 'app.nabutarot.twa'
sa = json.load(open(KEY, encoding='utf-8'))
b64 = lambda b: base64.urlsafe_b64encode(b).rstrip(b'=').decode()
now = int(time.time())
head = b64(json.dumps({'alg': 'RS256', 'typ': 'JWT'}).encode())
claim = b64(json.dumps({'iss': sa['client_email'], 'scope': 'https://www.googleapis.com/auth/androidpublisher',
                        'aud': 'https://oauth2.googleapis.com/token', 'iat': now, 'exp': now + 3600}).encode())
key = serialization.load_pem_private_key(sa['private_key'].encode(), None)
sig = key.sign(f'{head}.{claim}'.encode(), padding.PKCS1v15(), hashes.SHA256())
tok = urllib.request.urlopen(urllib.request.Request('https://oauth2.googleapis.com/token',
      data=urllib.parse.urlencode({'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      'assertion': f'{head}.{claim}.{b64(sig)}'}).encode())).read()
at = json.loads(tok)['access_token']
def get(path):
    r = urllib.request.Request(f'https://androidpublisher.googleapis.com/androidpublisher/v3/applications/{PKG}/{path}',
                               headers={'Authorization': 'Bearer ' + at})
    try: return json.load(urllib.request.urlopen(r))
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8', 'ignore')
        print('HTTP', e.code, body[:300]); sys.exit(2 if e.code == 403 else 1)
print('== one-time products ==')
for p in get('inappproducts').get('inappproduct', []):
    print(' ', p.get('sku'), '|', p.get('status'), '|', p.get('purchaseType'))
print('== subscriptions ==')
for s in get('subscriptions').get('subscriptions', []):
    plans = [(b.get('basePlanId'), b.get('state'), (b.get('autoRenewingBasePlanType') or {}).get('billingPeriodDuration'))
             for b in s.get('basePlans', [])]
    print(' ', s.get('productId'), '|', plans)
```

- [ ] **Step 3: Run it**

Run: `cd ~/nabu-tarot && python -m pip show cryptography >/dev/null 2>&1 || python -m pip install -q cryptography; PYTHONIOENCODING=utf-8 python scripts/play-probe.py`

Expected, one of:
- A list of one-time products and subscriptions with `basePlans`. Copy the four subscription `productId`s into Task 1's `PLAY_SUB_SKUS` and record them in the spec §3 (B1 done). If Pro shows **one** product with two base plans → **B2**: tell the owner a second Pro subscription product is needed (Appendix A, item 2) and leave that `sku` `''` until it exists.
- `HTTP 403 … caller does not have permission` → the service account is still not linked (Appendix A, item 3). Ask the owner for the B1 table by message and continue with `''`.

- [ ] **Step 4: Add the probe to `.gitignore`? No — keep it tracked; it prints no secrets.** Commit.

```bash
git add scripts/play-probe.py && git commit -m "scripts: read-only Play catalogue probe for the worker's service account"
```

---

### Task 1: The catalogue on both sides, and the worker test harness

**Files:**
- Create: `src/play-catalog.js`, `worker/src/catalog.ts`, `worker/test/catalog.test.ts`, `worker/test/util.ts`
- Modify: `build.py:13-16` (SCRIPTS), `worker/package.json`, `.github/workflows/worker.yml`, `src/main.js:3` (expose), `test/test.html`

**Interfaces:**
- Produces (client): `PLAY_SUB_SKUS`, `PLAY_ITEMS: {key, sku, kind:'inapp'|'subs', opens:string[], months:number}[]`, `playItem(key)`, `playItemBySku(sku)`, `PLAY_MANAGED_KEYS` (= `['manifest','plus','pro']`).
- Produces (worker): same names in `catalog.ts`, plus `type Kind`, `interface PlayItem`.

- [ ] **Step 1: Worker test harness**

`worker/package.json` — add:
```json
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "typecheck": "tsc --noEmit",
    "test": "node --import tsx --test test/*.test.ts"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "wrangler": "^4.0.0",
    "@cloudflare/workers-types": "^4.20240909.0",
    "tsx": "^4.19.0",
    "@types/node": "^20.0.0"
  }
```
`.github/workflows/worker.yml` — after the `Types` step:
```yaml
      - name: Tests
        run: npm test
```
`worker/test/util.ts`:
```ts
/* Shared helpers for the worker tests: a throwaway RSA key that plays both
   Google's signing key and the service account, an ID token signer, and a
   fetch mock keyed by URL substring. Node 20 has WebCrypto on globalThis. */
import { webcrypto } from "node:crypto";
const subtle = webcrypto.subtle;
const b64url = (b: ArrayBuffer | Uint8Array | string): string => {
  const bytes = typeof b === "string" ? new TextEncoder().encode(b) : new Uint8Array(b as ArrayBuffer);
  return Buffer.from(bytes).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
export interface Keys { priv: CryptoKey; jwk: JsonWebKey; pem: string }
export async function makeKeys(): Promise<Keys> {
  const kp = await subtle.generateKey({ name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["sign", "verify"]) as CryptoKeyPair;
  const jwk = await subtle.exportKey("jwk", kp.publicKey) as JsonWebKey & { kid?: string };
  jwk.kid = "k1"; jwk.alg = "RS256"; jwk.use = "sig";
  const pkcs8 = await subtle.exportKey("pkcs8", kp.privateKey);
  const pem = "-----BEGIN PRIVATE KEY-----\n" + Buffer.from(pkcs8).toString("base64").replace(/(.{64})/g, "$1\n") + "\n-----END PRIVATE KEY-----\n";
  return { priv: kp.privateKey, jwk, pem };
}
export async function signJwt(k: Keys, claims: Record<string, unknown>): Promise<string> {
  const h = b64url(JSON.stringify({ alg: "RS256", typ: "JWT", kid: "k1" }));
  const c = b64url(JSON.stringify(claims));
  const sig = await subtle.sign("RSASSA-PKCS1-v1_5", k.priv, new TextEncoder().encode(h + "." + c));
  return h + "." + c + "." + b64url(sig);
}
export const idToken = (k: Keys, uid: string) => {
  const now = Math.floor(Date.now() / 1000);
  return signJwt(k, { aud: "nabutarot", iss: "https://securetoken.google.com/nabutarot", sub: uid, exp: now + 3600, iat: now, email: uid + "@test", email_verified: true });
};
export const serviceAccount = (k: Keys) => JSON.stringify({ client_email: "nabu-worker@nabutarot.iam.gserviceaccount.com", private_key: k.pem });
export const env = (k: Keys, extra: Record<string, string> = {}) => ({
  PLAY_SERVICE_ACCOUNT: serviceAccount(k), FIREBASE_PROJECT_ID: "nabutarot", ANDROID_PACKAGE: "app.nabutarot.twa",
  ALLOWED_ORIGIN: "https://nabutarot.com", ...extra,
});
export const ctx = () => { const waits: Promise<unknown>[] = []; return { waitUntil: (p: Promise<unknown>) => { waits.push(p); }, passThroughOnException() {}, done: () => Promise.all(waits) }; };
export type Route = (url: string, init: RequestInit) => Response | Promise<Response> | null;
/* Install a fetch that answers from `routes` (first match by substring wins)
   and records every call. Returns the log and an uninstaller. */
export function mockFetch(k: Keys, routes: Record<string, Route>) {
  const log: { url: string; method: string; body: string }[] = [];
  const real = globalThis.fetch;
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input instanceof Request ? input.url : input);
    log.push({ url, method: (init && init.method) || "GET", body: String((init && init.body) || "") });
    if (url.includes("securetoken@system.gserviceaccount.com") || url.includes("oauth2/v3/certs")) return new Response(JSON.stringify({ keys: [k.jwk] }), { headers: { "cache-control": "max-age=3600" } });
    if (url.includes("oauth2.googleapis.com/token")) return new Response(JSON.stringify({ access_token: "at", expires_in: 3600 }));
    for (const key of Object.keys(routes)) if (url.includes(key)) { const r = await routes[key](url, init || {}); if (r) return r; }
    return new Response(JSON.stringify({ error: "unrouted " + url }), { status: 599 });
  }) as typeof fetch;
  return { log, restore: () => { globalThis.fetch = real; } };
}
export const json = (o: unknown, status = 200) => new Response(JSON.stringify(o), { status, headers: { "Content-Type": "application/json" } });
/* Firestore REST value encoding, enough for the tests to build documents. */
export const fsDoc = (fields: Record<string, unknown>) => ({ fields: enc(fields) });
function enc(o: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(o)) out[k] = val(o[k]);
  return out;
}
function val(v: unknown): unknown {
  if (typeof v === "string") return { stringValue: v };
  if (typeof v === "boolean") return { booleanValue: v };
  if (typeof v === "number") return { integerValue: String(v) };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(val) } };
  if (v && typeof v === "object") return { mapValue: { fields: enc(v as Record<string, unknown>) } };
  return { nullValue: null };
}
```

- [ ] **Step 2: Failing catalogue test (worker)**

`worker/test/catalog.test.ts`:
```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { PLAY_ITEMS, itemBySku, PLAY_MANAGED_KEYS, PLAY_SUB_SKUS } from "../src/catalog";

test("four one-time items with the exact Play ids", () => {
  const inapp = PLAY_ITEMS.filter((i) => i.kind === "inapp").map((i) => i.sku).sort();
  assert.deepEqual(inapp, ["lenormand", "playing", "tarot", "wedding"]);
});
test("both Pro plans open pro and plus; manifest is not in plus", () => {
  const pro6 = PLAY_ITEMS.find((i) => i.key === "pro6")!, pro = PLAY_ITEMS.find((i) => i.key === "pro")!, plus = PLAY_ITEMS.find((i) => i.key === "plus")!;
  assert.deepEqual(pro6.opens, ["pro", "plus"]); assert.deepEqual(pro.opens, ["pro", "plus"]);
  assert.equal(pro6.months, 6); assert.equal(pro.months, 12);
  assert.deepEqual(plus.opens, ["plus"]);
});
test("legacy one-time ids are not in the catalogue and an empty sku matches nothing", () => {
  for (const legacy of ["manifest", "plus", "pro6", "pro"]) assert.equal(PLAY_ITEMS.some((i) => i.kind === "inapp" && i.sku === legacy), false);
  assert.equal(itemBySku(""), null);
});
test("play-managed keys are the union of what subscriptions open", () => {
  assert.deepEqual([...PLAY_MANAGED_KEYS].sort(), ["manifest", "plus", "pro"]);
});
test("subscription skus, when filled, are distinct", () => {
  const vals = Object.values(PLAY_SUB_SKUS).filter(Boolean);
  assert.equal(new Set(vals).size, vals.length);
});
```

- [ ] **Step 3: Run to see it fail**

Run: `cd ~/nabu-tarot/worker && npm install && npm test`
Expected: FAIL — `Cannot find module '../src/catalog'`.

- [ ] **Step 4: Write `worker/src/catalog.ts`**

```ts
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
export const PLAY_SUB_SKUS = { manifest: "", plus: "", pro6: "", pro: "" };

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
```

- [ ] **Step 5: Run the worker tests**

Run: `cd ~/nabu-tarot/worker && npm test`
Expected: 5 passing.

- [ ] **Step 6: Client catalogue**

`src/play-catalog.js`:
```js
/* ======================= what Play sells =======================
   Same table as worker/src/catalog.ts; the suite checks they agree. `key` is
   the app's own name (COURSES ids, ACCESS keys), `sku` the Play product id.
   Pro is two plans with the same contents; the wedding pays for one room. */
const PLAY_SUB_SKUS = { manifest: '', plus: '', pro6: '', pro: '' };   // input B1
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
```
`build.py` line 13: insert `'play-catalog.js'` right after `'services.js'`. `src/main.js:3`: add `PLAY_ITEMS: PLAY_ITEMS, PLAY_SUB_SKUS: PLAY_SUB_SKUS, playItem: playItem,` to `window.NABU`.

- [ ] **Step 7: Suite check that both catalogues agree**

In `test/test.html`, after the `// data` block (line ~57), add:
```js
    { /* the client and the worker sell the same things under the same ids */
      const w2 = await fetch('../worker/src/catalog.ts').then((r) => r.text());
      const pick = (src) => Array.from(src.matchAll(/key: ["'](\w+)["'], sku: ([^,]+), kind: ["'](\w+)["'], opens: \[([^\]]*)\], months: (\d+)/g))
        .map((m) => m[1] + '|' + m[3] + '|' + m[4].replace(/["'\s]/g, '') + '|' + m[5]).sort().join(';');
      const c = await fetch('../src/play-catalog.js').then((r) => r.text());
      ok(pick(w2) === pick(c) && N.PLAY_ITEMS.length === 8 && N.PLAY_ITEMS.filter((i) => i.kind === 'inapp').length === 4,
        'the client and the worker carry the same Play catalogue: 4 one-time items, 4 subscriptions, same keys, contents and months'); }
```
(`test/run.py` serves the repo root, so `../worker/src/catalog.ts` is reachable.)

- [ ] **Step 8: Build, run the suite, commit**

Run: `cd ~/nabu-tarot && netstat -ano | findstr :8765; python build.py && grep -c "PLAY_SUB_SKUS" index.html && PYTHONIOENCODING=utf-8 python test/run.py 2>&1 | tail -3`
Expected: `1` (or more) and the suite passes with one new PASS line.
```bash
git add src/play-catalog.js worker/src/catalog.ts worker/test worker/package.json worker/package-lock.json .github/workflows/worker.yml build.py src/main.js test/test.html index.html
git commit -m "billing: one catalogue of Play products on both sides, worker test harness"
```

---

### Task 2: Firestore REST helper and subscription checks in the worker

**Files:**
- Create: `worker/src/fs.ts`, `worker/test/fs.test.ts`
- Modify: `worker/src/play.ts` (add after `checkPurchase`)

**Interfaces:**
- Produces: `fsGet(env, path) → Promise<Record<string,unknown>|null>`, `fsPatch(env, path, obj, mask?: string[], opts?: {createOnly?: boolean}) → Promise<Response>`, `decode(doc)`, `encode(obj)`.
- Produces: `checkSubscription(env, token) → Promise<{ok:boolean; why?:string; sub?: SubInfo}>`, `acknowledgeSub(env, productId, token)`, `interface SubInfo { state; expiryMs; productId; basePlanId; autoRenew; acknowledged; linkedToken }`.

- [ ] **Step 1: Failing tests for encode/decode round trip**

`worker/test/fs.test.ts`:
```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { encode, decode } from "../src/fs";

test("encode/decode round-trips strings, booleans, numbers, arrays and nested maps", () => {
  const o = { a: "x", b: true, n: 3, arr: ["p", "q"], m: { k: "v", deep: { z: false } } };
  assert.deepEqual(decode({ fields: encode(o) }), o);
});
test("decode of a missing document is an empty object", () => {
  assert.deepEqual(decode({}), {});
});
```
Run: `npm test` → FAIL, module not found.

- [ ] **Step 2: Write `worker/src/fs.ts`**

```ts
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
  for (const f of mask || Object.keys(obj)) q.push("updateMask.fieldPaths=" + encodeURIComponent(f));
  if (opts && opts.createOnly) q.push("currentDocument.exists=false");
  return fetch(docUrl(env, path) + (q.length ? "?" + q.join("&") : ""), {
    method: "PATCH",
    headers: { Authorization: "Bearer " + at, "Content-Type": "application/json" },
    body: JSON.stringify({ fields: encode(obj) }),
  });
}
```
Run: `npm test` → fs tests pass.

- [ ] **Step 3: Subscription verification in `play.ts`**

Append to `worker/src/play.ts`:
```ts
/* ---- subscriptions ----
   subscriptionsv2 is the current shape: one token, a state for the whole
   subscription, and a line item per product with its expiry and base plan.
   The state is Google's word, and it is the only word this worker takes. */
export interface SubInfo {
  state: string;          // SUBSCRIPTION_STATE_ACTIVE | _CANCELED | _IN_GRACE_PERIOD | _ON_HOLD | _PAUSED | _EXPIRED | _PENDING | _PENDING_PURCHASE_CANCELED | _UNSPECIFIED
  expiryMs: number;
  productId: string;
  basePlanId: string;
  autoRenew: boolean;
  acknowledged: boolean;
  linkedToken: string;    // the token this one replaced, on a plan change
}
export interface SubCheck { ok: boolean; why?: string; sub?: SubInfo }

export async function checkSubscription(env: PlayEnv, token: string): Promise<SubCheck> {
  const pkg = env.ANDROID_PACKAGE || "app.nabutarot.twa";
  const at = await accessToken(env, PLAY_SCOPE);
  const url = "https://androidpublisher.googleapis.com/androidpublisher/v3/applications/"
    + encodeURIComponent(pkg) + "/purchases/subscriptionsv2/tokens/" + encodeURIComponent(token);
  const r = await fetch(url, { headers: { Authorization: "Bearer " + at } });
  if (r.status === 404) return { ok: false, why: "unknown purchase" };
  if (!r.ok) return { ok: false, why: "play " + r.status };
  const j = (await r.json()) as {
    subscriptionState?: string; acknowledgementState?: string; linkedPurchaseToken?: string;
    lineItems?: { productId?: string; expiryTime?: string; autoRenewingPlan?: { autoRenewEnabled?: boolean }; offerDetails?: { basePlanId?: string } }[];
  };
  const li = (j.lineItems || [])[0] || {};
  return { ok: true, sub: {
    state: j.subscriptionState || "SUBSCRIPTION_STATE_UNSPECIFIED",
    expiryMs: li.expiryTime ? Date.parse(li.expiryTime) : 0,
    productId: li.productId || "",
    basePlanId: (li.offerDetails && li.offerDetails.basePlanId) || "",
    autoRenew: !!(li.autoRenewingPlan && li.autoRenewingPlan.autoRenewEnabled),
    acknowledged: j.acknowledgementState === "ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED",
    linkedToken: j.linkedPurchaseToken || "",
  } };
}

/* Acknowledged, never consumed: a subscription that is consumed is gone. Not
   acknowledging within three days refunds the buyer, so this is money. */
export async function acknowledgeSub(env: PlayEnv, productId: string, token: string): Promise<void> {
  const pkg = env.ANDROID_PACKAGE || "app.nabutarot.twa";
  const at = await accessToken(env, PLAY_SCOPE);
  await fetch("https://androidpublisher.googleapis.com/androidpublisher/v3/applications/" + encodeURIComponent(pkg)
    + "/purchases/subscriptions/" + encodeURIComponent(productId) + "/tokens/" + encodeURIComponent(token) + ":acknowledge",
    { method: "POST", headers: { Authorization: "Bearer " + at, "Content-Type": "application/json" }, body: "{}" });
}
```

- [ ] **Step 4: Typecheck, test, commit**

Run: `cd ~/nabu-tarot/worker && npm run typecheck && npm test`
```bash
git add worker/src/fs.ts worker/src/play.ts worker/test/fs.test.ts
git commit -m "worker: Firestore REST helper; verify and acknowledge subscriptions with subscriptionsv2"
```

---

### Task 3: Entitlements — the state machine and the writers

**Files:**
- Create: `worker/src/entitle.ts`, `worker/test/entitle.test.ts`

**Interfaces:**
- Consumes: `SubInfo` (Task 2), `PlayItem`, `PLAY_MANAGED_KEYS` (Task 1), `fsGet/fsPatch` (Task 2).
- Produces: `subAccess(sub, nowMs?) → {grant:boolean; until:string}`, `interface SubRow {sku,plan,state,until,autoRenew,tok,opens,grant}`, `recompute(subs, access) → access`, `applySubscription(env, uid, item, sub, tokenHash) → Promise<{access, subs}>`, `payRoom(env, uid, wid, tokenHash) → Promise<{ok:boolean; why?:string}>`, `unpayRoom(env, wid)`.

- [ ] **Step 1: Failing tests**

`worker/test/entitle.test.ts`:
```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { subAccess, recompute, SubRow } from "../src/entitle";
import { SubInfo } from "../src/play";

const sub = (state: string, days = 30): SubInfo => ({ state, expiryMs: Date.now() + days * 86400000, productId: "x", basePlanId: "b", autoRenew: true, acknowledged: true, linkedToken: "" });
const day = (d: number) => new Date(Date.now() + d * 86400000).toISOString().slice(0, 10);

test("active, cancelled-but-paid and grace keep access until expiry", () => {
  for (const s of ["SUBSCRIPTION_STATE_ACTIVE", "SUBSCRIPTION_STATE_CANCELED", "SUBSCRIPTION_STATE_IN_GRACE_PERIOD"]) {
    const a = subAccess(sub(s, 10)); assert.equal(a.grant, true, s); assert.equal(a.until, day(10));
  }
});
test("hold, paused, expired, pending and unknown grant nothing", () => {
  for (const s of ["SUBSCRIPTION_STATE_ON_HOLD", "SUBSCRIPTION_STATE_PAUSED", "SUBSCRIPTION_STATE_EXPIRED", "SUBSCRIPTION_STATE_PENDING", "SUBSCRIPTION_STATE_PENDING_PURCHASE_CANCELED", "SUBSCRIPTION_STATE_UNSPECIFIED", ""])
    assert.equal(subAccess(sub(s, 10)).grant, false, s);
});
test("an active subscription whose expiry is in the past grants nothing", () => {
  assert.equal(subAccess(sub("SUBSCRIPTION_STATE_ACTIVE", -1)).grant, false);
});
test("recompute rewrites only play-managed keys from granting rows and leaves courses alone", () => {
  const row = (opens: string[], grant: boolean, until: string): SubRow => ({ sku: "s", plan: "p", state: "x", until, autoRenew: true, tok: "t", opens, grant });
  const access = { tarot: "2027-01-01", pro: "2020-01-01", manifest: "2030-01-01" };
  const out = recompute({ pro6: row(["pro", "plus"], true, "2026-12-01"), manifest: row(["manifest"], false, "2026-01-01") }, access);
  assert.deepEqual(out, { tarot: "2027-01-01", pro: "2026-12-01", plus: "2026-12-01" });
});
test("two granting rows for the same key keep the later date", () => {
  const row = (opens: string[], until: string): SubRow => ({ sku: "s", plan: "p", state: "x", until, autoRenew: true, tok: "t", opens, grant: true });
  const out = recompute({ pro6: row(["pro", "plus"], "2026-06-01"), pro: row(["pro", "plus"], "2027-06-01") }, {});
  assert.deepEqual(out, { pro: "2027-06-01", plus: "2027-06-01" });
});
```
Run: `npm test` → FAIL, module not found.

- [ ] **Step 2: Write `worker/src/entitle.ts`**

```ts
/* What a subscription opens, decided from Google's word alone, and written
   onto the account by the only party allowed to write it. */
import { PlayEnv, SubInfo } from "./play";
import { PlayItem, PLAY_MANAGED_KEYS } from "./catalog";
import { fsGet, fsPatch } from "./fs";

const GRANTING = new Set(["SUBSCRIPTION_STATE_ACTIVE", "SUBSCRIPTION_STATE_CANCELED", "SUBSCRIPTION_STATE_IN_GRACE_PERIOD"]);
const isoDay = (ms: number) => new Date(ms).toISOString().slice(0, 10);

/* Cancelled means "will not renew", and the buyer keeps what they paid for
   until it runs out. Grace means Google is retrying the card and says keep
   serving. Hold and pause mean stop. Expired means gone. */
export function subAccess(s: SubInfo, nowMs: number = Date.now()): { grant: boolean; until: string } {
  const until = s.expiryMs ? isoDay(s.expiryMs) : "";
  return { grant: GRANTING.has(s.state) && s.expiryMs > nowMs, until };
}

export interface SubRow { sku: string; plan: string; state: string; until: string; autoRenew: boolean; tok: string; opens: string[]; grant: boolean }

/* Play-managed keys are derived, never edited: throw them away and rebuild
   them from every row that grants. A course key is not Play-managed and is
   carried through untouched. Order of events cannot matter to a function
   that only looks at the current rows. */
export function recompute(subs: Record<string, SubRow>, access: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.keys(access)) if (!PLAY_MANAGED_KEYS.has(k) && access[k]) out[k] = access[k];
  for (const row of Object.values(subs)) {
    if (!row || !row.grant) continue;
    for (const k of row.opens || []) if (!out[k] || row.until > out[k]) out[k] = row.until;
  }
  return out;
}

export async function applySubscription(env: PlayEnv, uid: string, item: PlayItem, sub: SubInfo, tokenHash: string): Promise<{ access: Record<string, string>; subs: Record<string, SubRow> }> {
  const doc = (await fsGet(env, "users/" + encodeURIComponent(uid))) || {};
  const access = (doc.access as Record<string, string>) || {};
  const subs = { ...((doc.subs as Record<string, SubRow>) || {}) };
  const a = subAccess(sub);
  subs[item.key] = { sku: item.sku, plan: sub.basePlanId, state: sub.state, until: a.until, autoRenew: sub.autoRenew, tok: tokenHash, opens: item.opens, grant: a.grant };
  const next = recompute(subs, access);
  const w = await fsPatch(env, "users/" + encodeURIComponent(uid), { access: next, subs }, ["access", "subs"]);
  if (!w.ok) throw new Error("firestore " + w.status);
  return { access: next, subs };
}

/* ---- the wedding: one purchase pays one room ---- */
export async function payRoom(env: PlayEnv, uid: string, wid: string, tokenHash: string): Promise<{ ok: boolean; why?: string }> {
  const room = await fsGet(env, "weddings/" + encodeURIComponent(wid));
  if (!room) return { ok: false, why: "no room" };
  const uids = (room.uids as string[]) || [];
  if (uids.indexOf(uid) < 0) return { ok: false, why: "not yours" };
  if (room.paid === true && room.purchase && room.purchase !== tokenHash) return { ok: false, why: "room paid" };
  const w = await fsPatch(env, "weddings/" + encodeURIComponent(wid),
    { paid: true, paidAt: Date.now(), paidBy: uid, purchase: tokenHash }, ["paid", "paidAt", "paidBy", "purchase"]);
  if (!w.ok) throw new Error("firestore " + w.status);
  return { ok: true };
}
/* A refunded wedding: the room stays, the payment does not. The couple see
   "unpaid" again and the door does not open. */
export async function unpayRoom(env: PlayEnv, wid: string): Promise<void> {
  const w = await fsPatch(env, "weddings/" + encodeURIComponent(wid), { paid: false, purchase: "" }, ["paid", "purchase"]);
  if (!w.ok) throw new Error("firestore " + w.status);
}
```

- [ ] **Step 3: Test, typecheck, commit**

Run: `cd ~/nabu-tarot/worker && npm test && npm run typecheck`
```bash
git add worker/src/entitle.ts worker/test/entitle.test.ts
git commit -m "worker: subscription state -> access, recompute of play-managed keys, paying a wedding room"
```

---

### Task 4: The ledger learns kinds, rooms and idempotent dates

**Files:**
- Modify: `worker/src/refunds.ts` (`claimPurchase`, `markGranted`, `sweepRefunds`; add `ledgerGet`, `ledgerSet`)
- Create: `worker/test/ledger.test.ts`

**Interfaces:**
- Produces: `claimPurchase(env, uid, sku, ids, token, extra?: {kind?: 'inapp'|'subs'; wid?: string}) → Promise<{ok; why?; existing?: LedgerRow}>`, `interface LedgerRow {uid; sku; kind; ids; state; until?; wid?; plan?; at}`, `markGranted(env, token, extra?: {until?: string; state?: string; plan?: string})`, `ledgerGet(env, tokenHash) → Promise<LedgerRow|null>`, `tokenId(token)` (exists).

- [ ] **Step 1: Failing tests**

`worker/test/ledger.test.ts`:
```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { claimPurchase, ledgerGet } from "../src/refunds";
import { makeKeys, env, mockFetch, json, fsDoc } from "./util";

test("claim: first claim creates; same uid re-claim returns the existing row; other uid refused; other wid refused", async () => {
  const k = await makeKeys();
  const docs: Record<string, Record<string, unknown>> = {};
  const m = mockFetch(k, {
    "firestore.googleapis.com": (url, init) => {
      const id = url.split("/documents/")[1].split("?")[0];
      if (init.method === "PATCH") {
        if (url.includes("currentDocument.exists=false") && docs[id]) return json({ error: { status: "FAILED_PRECONDITION" } }, 409);
        const f = JSON.parse(String(init.body)).fields;
        docs[id] = Object.assign(docs[id] || {}, f);
        return json({ name: id });
      }
      return docs[id] ? json({ fields: docs[id] }) : json({}, 404);
    },
  });
  try {
    const e = env(k);
    const a = await claimPurchase(e, "u1", "wedding", [], "TOK", { kind: "inapp", wid: "w1" });
    assert.equal(a.ok, true); assert.equal(a.existing, undefined);
    const b = await claimPurchase(e, "u1", "wedding", [], "TOK", { kind: "inapp", wid: "w1" });
    assert.equal(b.ok, true); assert.equal(b.existing && b.existing.wid, "w1");
    const c = await claimPurchase(e, "u2", "wedding", [], "TOK", { kind: "inapp", wid: "w1" });
    assert.deepEqual({ ok: c.ok, why: c.why }, { ok: false, why: "already used" });
    const d = await claimPurchase(e, "u1", "wedding", [], "TOK", { kind: "inapp", wid: "w2" });
    assert.deepEqual({ ok: d.ok, why: d.why }, { ok: false, why: "already used" });
    const row = await ledgerGet(e, Object.keys(docs)[0].replace("purchases/", ""));
    assert.equal(row && row.kind, "inapp");
  } finally { m.restore(); }
});
```
Run: `npm test` → FAIL (`claimPurchase` has no 5th argument / `ledgerGet` missing).

- [ ] **Step 2: Rewrite the ledger functions in `refunds.ts`**

Replace `claimPurchase` and `markGranted` (keep `tokenId`, `docUrl`, `voidedSince`, `removeAccess`, `markVoided`) with:
```ts
import { fsGet, fsPatch } from "./fs";
import { unpayRoom } from "./entitle";

export interface LedgerRow { uid: string; sku: string; kind: "inapp" | "subs"; ids: string[]; state: string; at: string; until?: string; wid?: string; plan?: string }
export interface Claim { ok: boolean; why?: string; existing?: LedgerRow }

export async function ledgerGet(env: PlayEnv, hash: string): Promise<LedgerRow | null> {
  const d = await fsGet(env, "purchases/" + hash);
  return d ? (d as unknown as LedgerRow) : null;
}
export async function ledgerSet(env: PlayEnv, hash: string, patch: Partial<LedgerRow> & Record<string, unknown>): Promise<void> {
  const w = await fsPatch(env, "purchases/" + hash, patch, Object.keys(patch));
  if (!w.ok) throw new Error("ledger " + w.status);
}

/* The claim. Created with the condition that it must not exist; if that
   fails, the row is read and it is the row that decides: the same account
   (and, for a wedding, the same room) is a retry and passes with the row
   attached, so the caller can repeat exactly what was granted before rather
   than granting again; anybody else is refused. */
export async function claimPurchase(env: PlayEnv, uid: string, sku: string, ids: string[], token: string,
  extra: { kind?: "inapp" | "subs"; wid?: string } = {}): Promise<Claim> {
  const id = await tokenId(token);
  const row: LedgerRow = { uid, sku, kind: extra.kind || "inapp", ids, state: "claimed", at: new Date().toISOString() };
  if (extra.wid) row.wid = extra.wid;
  const r = await fsPatch(env, "purchases/" + id, row as unknown as Record<string, unknown>, undefined, { createOnly: true });
  if (r.ok) return { ok: true };
  const cur = await ledgerGet(env, id);
  if (!cur) throw new Error("claim " + r.status);
  if (cur.uid !== uid) return { ok: false, why: "already used" };
  if (extra.wid && cur.wid && cur.wid !== extra.wid) return { ok: false, why: "already used" };
  return { ok: true, existing: cur };
}

/* Said once the access exists. `until` is what a course was granted to, kept
   so a retry grants the same date and not a fresh six months. */
export async function markGranted(env: PlayEnv, token: string, extra: { until?: string; state?: string; plan?: string } = {}): Promise<void> {
  await ledgerSet(env, await tokenId(token), { state: extra.state || "granted", ...(extra.until ? { until: extra.until } : {}), ...(extra.plan ? { plan: extra.plan } : {}) });
}
```
In `sweepRefunds`, after `const ids = …` and before `out.matched++`, handle a wedding row:
```ts
    const wid = doc.fields?.wid?.stringValue || "";
    if (wid) { await unpayRoom(env, wid); await markVoided(env, id, ["wedding:" + wid]); out.matched++; out.revoked++; continue; }
```
(add `wid?: { stringValue?: string }` to the `doc` type there).

- [ ] **Step 3: Test, typecheck, commit**

Run: `cd ~/nabu-tarot/worker && npm test && npm run typecheck`
```bash
git add worker/src/refunds.ts worker/test/ledger.test.ts
git commit -m "worker: ledger rows carry kind, room and granted date; a retry repeats, a stranger is refused"
```

---

### Task 5: `/billing` for courses, the wedding and subscriptions

**Files:**
- Modify: `worker/src/index.ts:136-183` (replace the `/billing` block), imports at top
- Create: `worker/test/billing.test.ts`

**Interfaces:**
- Consumes: everything from Tasks 1–4.
- Produces: `POST /billing {sku, token, wid?}` → 200 `{ok:true, opened:string[], access, subs?}` · 202 `{pending:true}` · 402 `{error}` · 400/401/403.

- [ ] **Step 1: Failing handler tests**

`worker/test/billing.test.ts`:
```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index";
import { PLAY_ITEMS } from "../src/catalog";
import { makeKeys, env, ctx, mockFetch, json, idToken } from "./util";

function world(k: Awaited<ReturnType<typeof makeKeys>>, play: { products?: Record<string, unknown>; subs?: Record<string, unknown> }) {
  const docs: Record<string, Record<string, unknown>> = {};
  const m = mockFetch(k, {
    "androidpublisher.googleapis.com": (url, init) => {
      if (init.method === "POST") return json({});                                   // acknowledge / consume
      const tok = decodeURIComponent(url.split("/tokens/")[1]);
      const table = url.includes("/subscriptionsv2/") ? play.subs || {} : play.products || {};
      return table[tok] ? json(table[tok]) : json({}, 404);
    },
    "firestore.googleapis.com": (url, init) => {
      const id = url.split("/documents/")[1].split("?")[0];
      if (init.method === "PATCH") {
        if (url.includes("currentDocument.exists=false") && docs[id]) return json({}, 409);
        docs[id] = Object.assign(docs[id] || {}, JSON.parse(String(init.body)).fields);
        return json({ name: id });
      }
      return docs[id] ? json({ fields: docs[id] }) : json({}, 404);
    },
  });
  return { docs, m };
}
const post = async (k: Awaited<ReturnType<typeof makeKeys>>, uid: string, body: unknown, e = env(k)) => {
  const c = ctx();
  const r = await worker.fetch(new Request("https://nabu-ai.test/billing", { method: "POST", headers: { Authorization: "Bearer " + await idToken(k, uid), "Content-Type": "application/json" }, body: JSON.stringify(body) }), e as never, c as never);
  await c.done();
  return { status: r.status, body: await r.json() as Record<string, unknown> };
};
const str = (f: unknown) => (f as { stringValue: string }).stringValue;

test("a course: granted once; the same token again returns the same date and consumes nothing new", async () => {
  const k = await makeKeys();
  const w = world(k, { products: { T1: { purchaseState: 0, consumptionState: 0 } } });
  try {
    const a = await post(k, "u1", { sku: "tarot", token: "T1" });
    assert.equal(a.status, 200); assert.deepEqual(a.body.opened, ["tarot"]);
    const until = (a.body.access as Record<string, string>).tarot;
    const b = await post(k, "u1", { sku: "tarot", token: "T1" });
    assert.equal(b.status, 200); assert.equal((b.body.access as Record<string, string>).tarot, until);
    const c = await post(k, "u2", { sku: "tarot", token: "T1" });
    assert.equal(c.status, 402); assert.equal(c.body.error, "already used");
  } finally { w.m.restore(); }
});
test("a pending purchase answers 202 and grants nothing", async () => {
  const k = await makeKeys();
  const w = world(k, { products: { P1: { purchaseState: 2 } } });
  try { const a = await post(k, "u1", { sku: "tarot", token: "P1" }); assert.equal(a.status, 202); assert.equal(a.body.pending, true); assert.equal(w.docs["users/u1"], undefined); }
  finally { w.m.restore(); }
});
test("legacy one-time ids are unknown products", async () => {
  const k = await makeKeys();
  const w = world(k, { products: { L1: { purchaseState: 0, consumptionState: 0 } } });
  try { for (const sku of ["manifest", "plus", "pro6", "pro"]) { const a = await post(k, "u1", { sku, token: "L1" }); assert.equal(a.status, 400, sku); } }
  finally { w.m.restore(); }
});
test("a wedding pays the named room, only for a member, and only one room per token", async () => {
  const k = await makeKeys();
  const w = world(k, { products: { W1: { purchaseState: 0, consumptionState: 0 } } });
  w.docs["weddings/a__b"] = { uids: { arrayValue: { values: [{ stringValue: "a" }, { stringValue: "b" }] } } };
  w.docs["weddings/c__d"] = { uids: { arrayValue: { values: [{ stringValue: "c" }, { stringValue: "d" }] } } };
  try {
    const nope = await post(k, "a", { sku: "wedding", token: "W1" }); assert.equal(nope.status, 400);
    const other = await post(k, "a", { sku: "wedding", token: "W1", wid: "c__d" }); assert.equal(other.status, 403);
    const ok = await post(k, "a", { sku: "wedding", token: "W1", wid: "a__b" });
    assert.equal(ok.status, 200); assert.equal((w.docs["weddings/a__b"].paid as { booleanValue: boolean }).booleanValue, true);
    const again = await post(k, "a", { sku: "wedding", token: "W1", wid: "a__b" }); assert.equal(again.status, 200);
    const second = await post(k, "a", { sku: "wedding", token: "W1", wid: "c__d" }); assert.equal(second.status, 402);
  } finally { w.m.restore(); }
});
test("a subscription writes subs and access from Google's state, and is acknowledged not consumed", { skip: !PLAY_ITEMS.find((i) => i.key === "plus")!.sku && "B1: plus sku not filled" }, async () => {
  const k = await makeKeys();
  const plus = PLAY_ITEMS.find((i) => i.key === "plus")!;
  const exp = new Date(Date.now() + 30 * 86400000).toISOString();
  const w = world(k, { subs: { S1: { subscriptionState: "SUBSCRIPTION_STATE_ACTIVE", acknowledgementState: "ACKNOWLEDGEMENT_STATE_PENDING", lineItems: [{ productId: plus.sku, expiryTime: exp, autoRenewingPlan: { autoRenewEnabled: true }, offerDetails: { basePlanId: "plus-12m" } }] } } });
  try {
    const a = await post(k, "u1", { sku: plus.sku, token: "S1" });
    assert.equal(a.status, 200); assert.deepEqual(a.body.opened, ["plus"]);
    const subs = w.docs["users/u1"].subs as { mapValue: { fields: Record<string, { mapValue: { fields: Record<string, unknown> } }> } };
    assert.equal(str(subs.mapValue.fields.plus.mapValue.fields.state), "SUBSCRIPTION_STATE_ACTIVE");
    const calls = w.m.log.filter((c) => c.url.includes("androidpublisher") && c.method === "POST").map((c) => c.url);
    assert.equal(calls.some((u) => u.endsWith(":acknowledge")), true);
    assert.equal(calls.some((u) => u.endsWith(":consume")), false);
  } finally { w.m.restore(); }
});
```
Run: `npm test` → FAIL (handler still treats everything as a course).

- [ ] **Step 2: Replace the `/billing` block in `index.ts`**

Imports at the top of `index.ts`:
```ts
import { checkPurchase, acknowledge, grantUntil, checkSubscription, acknowledgeSub } from "./play";
import { claimPurchase, markGranted, sweepRefunds, tokenId } from "./refunds";
import { itemBySku } from "./catalog";
import { applySubscription, payRoom } from "./entitle";
```
Delete the `MONTHS` and `ALSO` constants (the catalogue owns them). Replace the whole `if (path.endsWith("/billing")) { … }` block with:
```ts
    if (path.endsWith("/billing")) {
      if (!env.FIREBASE_PROJECT_ID) return new Response(JSON.stringify({ error: "not configured" }), { status: 500, headers });
      const person = await whoIsAsking(request, env.FIREBASE_PROJECT_ID);
      if (!person) return new Response(JSON.stringify({ error: "signin" }), { status: 401, headers });
      const v = await allow(env, person.uid, 40, 6);
      if (!v.ok) return tooMany(v, headers);

      let b: { sku?: string; token?: string; wid?: string };
      try { b = await request.json(); } catch { return new Response(JSON.stringify({ error: "bad json" }), { status: 400, headers }); }
      const sku = String(b.sku || ""), token = String(b.token || ""), wid = String(b.wid || "");
      const item = itemBySku(sku);
      if (!item || !token) return new Response(JSON.stringify({ error: "unknown product" }), { status: 400, headers });
      if (item.key === "wedding" && !wid) return new Response(JSON.stringify({ error: "no room" }), { status: 400, headers });
      const say = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers });
      const log = (rec: Record<string, unknown>) => console.log(JSON.stringify({ at: "billing", uid: person.uid, sku, ...rec }));

      try {
        /* ---- a subscription: Google's state is the state ---- */
        if (item.kind === "subs") {
          const got = await checkSubscription(env, token);
          if (!got.ok || !got.sub) { log({ refused: got.why }); return say(402, { error: got.why || "refused" }); }
          const sub = got.sub;
          if (sub.productId !== sku) { log({ refused: "product mismatch", product: sub.productId }); return say(402, { error: "product mismatch" }); }
          if (sub.state === "SUBSCRIPTION_STATE_PENDING") return say(202, { pending: true });
          const claim = await claimPurchase(env, person.uid, sku, item.opens, token, { kind: "subs" });
          if (!claim.ok) { log({ refused: claim.why }); return say(402, { error: claim.why || "already used" }); }
          const hash = await tokenId(token);
          const out = await applySubscription(env, person.uid, item, sub, hash);
          await markGranted(env, token, { state: sub.state, plan: sub.basePlanId }).catch((e) => log({ ledger: String(e) }));
          const opened = out.subs[item.key].grant ? item.opens : [];
          if (!sub.acknowledged && opened.length) ctx.waitUntil(acknowledgeSub(env, sku, token));
          log({ granted: opened, state: sub.state });
          return say(200, { ok: true, opened, access: out.access, subs: out.subs });
        }

        /* ---- a one-time purchase ---- */
        const bought = await checkPurchase(env, sku, token);
        if (!bought.ok) {
          if (bought.why === "pending") return say(202, { pending: true });
          log({ refused: bought.why }); return say(402, { error: bought.why || "refused" });
        }
        const claim = await claimPurchase(env, person.uid, sku, item.opens, token, { kind: "inapp", wid: wid || undefined });
        if (!claim.ok) { log({ refused: claim.why }); return say(402, { error: claim.why || "already used" }); }
        const hash = await tokenId(token);

        if (item.key === "wedding") {
          const paid = await payRoom(env, person.uid, wid, hash);
          if (!paid.ok) { log({ refused: paid.why, wid }); return say(paid.why === "not yours" ? 403 : 409, { error: paid.why }); }
          await markGranted(env, token).catch((e) => log({ ledger: String(e) }));
          /* Only now: a consumed token whose room is not paid would be money for nothing. */
          ctx.waitUntil(acknowledge(env, sku, token));
          log({ granted: ["wedding"], wid });
          return say(200, { ok: true, opened: ["wedding"], wid });
        }

        /* A course. The date is decided once and written to the ledger; a retry
           reads it back rather than adding another six months. */
        let until = claim.existing && claim.existing.until;
        if (!until) { const d = new Date(); d.setMonth(d.getMonth() + item.months); until = d.toISOString().slice(0, 10); }
        const want: Record<string, string> = {};
        for (const k of item.opens) want[k] = until;
        const access = await grantUntil(env, person.uid, want);
        await markGranted(env, token, { until }).catch((e) => log({ ledger: String(e) }));
        if (!claim.existing) ctx.waitUntil(acknowledge(env, sku, token));
        log({ granted: item.opens, until });
        return say(200, { ok: true, opened: item.opens, access });
      } catch (e) {
        console.error(JSON.stringify({ at: "billing", uid: person.uid, sku, error: String((e as Error).message || e) }));
        return say(502, { error: "check failed" });
      }
    }
```
The `/redeem` block below still imports `grant` from play.ts? It uses `grantUntil` (codes carry their own date) — check with `grep -n "grant(" worker/src/index.ts`; if `grant(` is used anywhere else keep it in the import.

- [ ] **Step 3: Test, typecheck, commit**

Run: `cd ~/nabu-tarot/worker && npm test && npm run typecheck`
Expected: all pass; the subscription test is *skipped* with "B1: plus sku not filled" until B1 lands (then it must pass).
```bash
git add worker/src/index.ts worker/test/billing.test.ts
git commit -m "worker: /billing routes by catalogue - idempotent courses, one room per wedding token, subscriptions from Google's state"
```

---

### Task 6: Real-time Developer Notifications on `/rtdn`

**Files:**
- Modify: `worker/src/auth.ts` (extract `verifyJwt`, add `verifyGoogleJwt`), `worker/src/index.ts` (route), `worker/wrangler.toml` (vars), `worker/src/index.ts` `Env`
- Create: `worker/src/rtdn.ts`, `worker/test/rtdn.test.ts`

**Interfaces:**
- Produces: `verifyJwt(raw, jwksUrl) → Promise<Record<string,unknown>|null>` (signature + exp/iat only), `verifyGoogleJwt(raw, aud, email?) → Promise<boolean>`, `handleRtdn(request, env) → Promise<Response>`, `decodeNote(body) → Note|null`.
- Env: `RTDN_AUDIENCE?: string; RTDN_PUSH_EMAIL?: string`.

- [ ] **Step 1: Failing tests**

`worker/test/rtdn.test.ts`:
```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { decodeNote, handleRtdn } from "../src/rtdn";
import { makeKeys, env, mockFetch, json, signJwt } from "./util";

const push = (note: unknown) => JSON.stringify({ message: { data: Buffer.from(JSON.stringify(note)).toString("base64"), messageId: "1" }, subscription: "s" });

test("decodeNote reads the Pub/Sub envelope and the Play notification inside", () => {
  const n = decodeNote(JSON.parse(push({ version: "1.0", packageName: "app.nabutarot.twa", eventTimeMillis: "1", subscriptionNotification: { version: "1.0", notificationType: 2, purchaseToken: "S1", subscriptionId: "plus_x" } })));
  assert.equal(n && n.packageName, "app.nabutarot.twa");
  assert.equal(n && n.subscriptionNotification && n.subscriptionNotification.purchaseToken, "S1");
  assert.equal(decodeNote({}), null);
});
test("a push without a valid Google token is refused; with one, an unknown token is ignored with 204", async () => {
  const k = await makeKeys();
  const m = mockFetch(k, { "firestore.googleapis.com": () => json({}, 404) });
  try {
    const e = env(k, { RTDN_AUDIENCE: "https://nabu-ai.test/rtdn", RTDN_PUSH_EMAIL: "nabu-worker@nabutarot.iam.gserviceaccount.com" });
    const body = push({ version: "1.0", packageName: "app.nabutarot.twa", subscriptionNotification: { notificationType: 3, purchaseToken: "NOPE", subscriptionId: "x" } });
    const bare = await handleRtdn(new Request("https://nabu-ai.test/rtdn", { method: "POST", body }), e as never);
    assert.equal(bare.status, 401);
    const now = Math.floor(Date.now() / 1000);
    const good = await signJwt(k, { iss: "https://accounts.google.com", aud: "https://nabu-ai.test/rtdn", email: "nabu-worker@nabutarot.iam.gserviceaccount.com", email_verified: true, exp: now + 600, iat: now, sub: "1" });
    const r = await handleRtdn(new Request("https://nabu-ai.test/rtdn", { method: "POST", headers: { Authorization: "Bearer " + good }, body }), e as never);
    assert.equal(r.status, 204);
    const wrongAud = await signJwt(k, { iss: "https://accounts.google.com", aud: "https://elsewhere", email: "nabu-worker@nabutarot.iam.gserviceaccount.com", email_verified: true, exp: now + 600, iat: now, sub: "1" });
    const r2 = await handleRtdn(new Request("https://nabu-ai.test/rtdn", { method: "POST", headers: { Authorization: "Bearer " + wrongAud }, body }), e as never);
    assert.equal(r2.status, 401);
  } finally { m.restore(); }
});
```
Run: `npm test` → FAIL, module not found.

- [ ] **Step 2: Refactor `auth.ts`**

Change `keys()` to take the JWKS URL and cache per URL; extract the signature/expiry part; keep `whoIsAsking` behaviour identical:
```ts
const FIREBASE_JWKS = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";
const GOOGLE_JWKS = "https://www.googleapis.com/oauth2/v3/certs";
let keyCache: Record<string, { at: number; ttl: number; keys: Record<string, CryptoKey> }> = {};

async function keys(url: string): Promise<Record<string, CryptoKey>> {
  const now = Date.now(), had = keyCache[url];
  if (had && now - had.at < had.ttl) return had.keys;
  const r = await fetch(url);
  if (!r.ok) throw new Error("jwks " + r.status);
  const body = (await r.json()) as { keys: JsonWebKey[] };
  const max = /max-age=(\d+)/.exec(r.headers.get("cache-control") || "");
  const out: Record<string, CryptoKey> = {};
  for (const jwk of body.keys || []) {
    const kid = (jwk as { kid?: string }).kid;
    if (!kid) continue;
    out[kid] = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  }
  keyCache[url] = { at: now, ttl: Math.max(60, Number(max?.[1] || 3600)) * 1000, keys: out };
  return out;
}

/* Signature, expiry and clock skew only. Who it is for and who wrote it are
   the caller's questions, because they differ between a Firebase sign-in and
   a Pub/Sub push. */
export async function verifyJwt(raw: string, jwksUrl: string): Promise<Record<string, unknown> | null> {
  const bits = (raw || "").split(".");
  if (bits.length !== 3) return null;
  try {
    const head = jsonPart(bits[0]) as { alg?: string; kid?: string };
    if (head.alg !== "RS256" || !head.kid) return null;
    const key = (await keys(jwksUrl))[head.kid];
    if (!key) return null;
    const okSig = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, b64url(bits[2]) as unknown as BufferSource, new TextEncoder().encode(bits[0] + "." + bits[1]));
    if (!okSig) return null;
    const c = jsonPart(bits[1]) as { exp?: number; iat?: number };
    const now = Math.floor(Date.now() / 1000);
    if (!c.exp || c.exp <= now) return null;
    if (c.iat && c.iat > now + 300) return null;
    return c as Record<string, unknown>;
  } catch { return null; }
}

export async function whoIsAsking(request: Request, projectId: string): Promise<Who | null> {
  const raw = (request.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "").trim();
  if (!raw) return null;
  const c = await verifyJwt(raw, FIREBASE_JWKS) as { aud?: string; iss?: string; sub?: string; email?: string; email_verified?: boolean } | null;
  if (!c) return null;
  if (c.aud !== projectId) return null;
  if (c.iss !== "https://securetoken.google.com/" + projectId) return null;
  if (!c.sub) return null;
  return { uid: c.sub, email: String(c.email || ""), verified: c.email_verified === true };
}

/* A Pub/Sub push carries an OIDC token Google signed for the audience we gave
   the subscription, on behalf of the service account we named. */
export async function verifyGoogleJwt(raw: string, aud: string, email?: string): Promise<boolean> {
  const c = await verifyJwt(raw, GOOGLE_JWKS) as { aud?: string; iss?: string; email?: string; email_verified?: boolean } | null;
  if (!c) return false;
  if (c.iss !== "https://accounts.google.com" && c.iss !== "accounts.google.com") return false;
  if (c.aud !== aud) return false;
  if (email && (c.email !== email || c.email_verified !== true)) return false;
  return true;
}
```

- [ ] **Step 3: Write `worker/src/rtdn.ts`**

```ts
/* Google telling us something changed.

   Play publishes a Real-time Developer Notification to a Pub/Sub topic and
   Pub/Sub pushes it here. The notification names a purchase token and a
   type. The type is not trusted for anything: whatever it says, the worker
   asks Google for the current state of that token and applies that. So a
   duplicate, a late arrival or two out of order all land on the same answer.

   Always 204 once the caller is Google. Anything else and Pub/Sub retries
   for a week. */
import { PlayEnv, checkSubscription } from "./play";
import { verifyGoogleJwt } from "./auth";
import { itemBySku } from "./catalog";
import { applySubscription, unpayRoom } from "./entitle";
import { ledgerGet, ledgerSet, tokenId, removeAccessFor } from "./refunds";

export interface RtdnEnv extends PlayEnv { RTDN_AUDIENCE?: string; RTDN_PUSH_EMAIL?: string }
export interface Note {
  packageName?: string; eventTimeMillis?: string;
  subscriptionNotification?: { notificationType?: number; purchaseToken?: string; subscriptionId?: string };
  oneTimeProductNotification?: { notificationType?: number; purchaseToken?: string; sku?: string };
  voidedPurchaseNotification?: { purchaseToken?: string; orderId?: string; productType?: number; refundType?: number };
  testNotification?: { version?: string };
}
export function decodeNote(body: unknown): Note | null {
  try {
    const data = (body as { message?: { data?: string } }).message?.data;
    if (!data) return null;
    return JSON.parse(atob(data.replace(/-/g, "+").replace(/_/g, "/"))) as Note;
  } catch { return null; }
}

export async function handleRtdn(request: Request, env: RtdnEnv): Promise<Response> {
  if (!env.RTDN_AUDIENCE) return new Response("not configured", { status: 404 });
  const raw = (request.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "").trim();
  if (!(await verifyGoogleJwt(raw, env.RTDN_AUDIENCE, env.RTDN_PUSH_EMAIL))) return new Response("who?", { status: 401 });
  let body: unknown;
  try { body = await request.json(); } catch { return new Response(null, { status: 204 }); }
  const note = decodeNote(body);
  const pkg = env.ANDROID_PACKAGE || "app.nabutarot.twa";
  if (!note || note.packageName !== pkg || note.testNotification) { console.log(JSON.stringify({ at: "rtdn", ignored: !note ? "undecodable" : note.testNotification ? "test" : "other package" })); return new Response(null, { status: 204 }); }
  try {
    if (note.subscriptionNotification?.purchaseToken) await onSubscription(env, note.subscriptionNotification.purchaseToken, note.subscriptionNotification.notificationType || 0);
    else if (note.voidedPurchaseNotification?.purchaseToken) await onVoided(env, note.voidedPurchaseNotification.purchaseToken);
    else if (note.oneTimeProductNotification?.purchaseToken && note.oneTimeProductNotification.notificationType === 2) await onVoided(env, note.oneTimeProductNotification.purchaseToken);
  } catch (e) { console.error(JSON.stringify({ at: "rtdn", error: String((e as Error).message || e) })); }
  return new Response(null, { status: 204 });
}

async function onSubscription(env: RtdnEnv, token: string, type: number): Promise<void> {
  const hash = await tokenId(token);
  const row = await ledgerGet(env, hash);
  if (!row) { console.log(JSON.stringify({ at: "rtdn", type, orphan: hash.slice(0, 12) })); return; }   // bought before /billing ever saw it; the app's next sync will claim it
  const item = itemBySku(row.sku);
  if (!item || item.kind !== "subs") return;
  const got = await checkSubscription(env, token);
  if (!got.ok || !got.sub) { console.log(JSON.stringify({ at: "rtdn", type, why: got.why })); return; }
  await applySubscription(env, row.uid, item, got.sub, hash);
  await ledgerSet(env, hash, { state: got.sub.state, plan: got.sub.basePlanId });
  console.log(JSON.stringify({ at: "rtdn", type, uid: row.uid, key: item.key, state: got.sub.state }));
}

async function onVoided(env: RtdnEnv, token: string): Promise<void> {
  const hash = await tokenId(token);
  const row = await ledgerGet(env, hash);
  if (!row || row.state === "voided") return;
  if (row.wid) await unpayRoom(env, row.wid);
  else if (row.kind === "inapp" && row.ids.length) await removeAccessFor(env, row.uid, row.ids);
  await ledgerSet(env, hash, { state: "voided", voidedAt: new Date().toISOString() });
  console.log(JSON.stringify({ at: "rtdn", voided: row.uid, ids: row.ids, wid: row.wid || "" }));
}
```
In `refunds.ts`, export the existing `removeAccess` under a public name: `export const removeAccessFor = removeAccess;` (a voided *subscription* is handled by `onSubscription` — Google reports it EXPIRED/REVOKED and the recompute removes the keys — so `onVoided` only touches one-time rows).

- [ ] **Step 4: Route and config**

`index.ts` `Env`: add `RTDN_AUDIENCE?: string; RTDN_PUSH_EMAIL?: string;`. Import `handleRtdn`. In `fetch`, before the `/booking`/`/report` branch:
```ts
    if (path.endsWith("/rtdn")) return handleRtdn(request, env);
```
`wrangler.toml` `[vars]`:
```toml
# Pub/Sub pushes Play's notifications here. The audience is this URL, given
# to the push subscription; the email is the service account it pushes as.
RTDN_AUDIENCE = "https://nabu-ai.0211nhatanh.workers.dev/rtdn"
RTDN_PUSH_EMAIL = "nabu-worker@nabutarot.iam.gserviceaccount.com"
```

- [ ] **Step 5: Test, typecheck, commit**

Run: `cd ~/nabu-tarot/worker && npm test && npm run typecheck`
```bash
git add worker/src/auth.ts worker/src/rtdn.ts worker/src/index.ts worker/src/refunds.ts worker/wrangler.toml worker/test/rtdn.test.ts
git commit -m "worker: Real-time Developer Notifications on /rtdn, verified as Google's push and re-read from Google"
```

---

### Task 7: Reconciliation every six hours

**Files:**
- Create: `worker/src/reconcile.ts`, `worker/test/reconcile.test.ts`
- Modify: `worker/src/index.ts` (`scheduled`), `worker/wrangler.toml` (`crons`)

**Interfaces:**
- Produces: `reconcileSubs(env) → Promise<{looked:number; changed:number; failed:number}>`.

- [ ] **Step 1: Failing test**

`worker/test/reconcile.test.ts`:
```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { reconcileSubs } from "../src/reconcile";
import { PLAY_ITEMS } from "../src/catalog";
import { makeKeys, env, mockFetch, json, fsDoc } from "./util";

test("reconcile re-reads every live subscription row and rewrites the account", { skip: !PLAY_ITEMS.find((i) => i.key === "plus")!.sku && "B1: plus sku not filled" }, async () => {
  const k = await makeKeys();
  const plus = PLAY_ITEMS.find((i) => i.key === "plus")!;
  const docs: Record<string, Record<string, unknown>> = { "purchases/h1": fsDoc({ uid: "u1", sku: plus.sku, kind: "subs", ids: ["plus"], state: "SUBSCRIPTION_STATE_ACTIVE", token: "S1" }).fields as Record<string, unknown>, "users/u1": fsDoc({ access: { plus: "2099-01-01" }, subs: {} }).fields as Record<string, unknown> };
  const m = mockFetch(k, {
    ":runQuery": () => json([{ document: { name: "projects/x/databases/(default)/documents/purchases/h1", fields: docs["purchases/h1"] } }]),
    "androidpublisher.googleapis.com": () => json({ subscriptionState: "SUBSCRIPTION_STATE_EXPIRED", lineItems: [{ productId: plus.sku, expiryTime: new Date(Date.now() - 1000).toISOString() }] }),
    "firestore.googleapis.com": (url, init) => { const id = url.split("/documents/")[1].split("?")[0]; if (init.method === "PATCH") { docs[id] = Object.assign(docs[id] || {}, JSON.parse(String(init.body)).fields); return json({}); } return docs[id] ? json({ fields: docs[id] }) : json({}, 404); },
  });
  try {
    const out = await reconcileSubs(env(k));
    assert.equal(out.looked, 1); assert.equal(out.changed, 1);
    const access = (docs["users/u1"].access as { mapValue: { fields: Record<string, unknown> } }).mapValue.fields;
    assert.equal(access.plus, undefined);
  } finally { m.restore(); }
});
```
Note the ledger row must carry the raw `token` for reconciliation to re-query Google — add `token` to `LedgerRow` and write it in `claimPurchase` (Task 4: `row.token = token`). The ledger is worker-only and the token is useless without the service account; this is the same exposure as before.

- [ ] **Step 2: Write `worker/src/reconcile.ts`**

```ts
/* The fallback for a missed notification: every few hours, every subscription
   this worker has ever seen and not yet written off is asked about again. */
import { PlayEnv, checkSubscription, serviceToken, FS_SCOPE } from "./play";
import { itemBySku } from "./catalog";
import { applySubscription } from "./entitle";
import { decode } from "./fs";
import { ledgerSet, LedgerRow } from "./refunds";

export async function reconcileSubs(env: PlayEnv): Promise<{ looked: number; changed: number; failed: number }> {
  const out = { looked: 0, changed: 0, failed: 0 };
  if (!env.PLAY_SERVICE_ACCOUNT || !env.FIREBASE_PROJECT_ID) return out;
  const at = await serviceToken(env, FS_SCOPE);
  const r = await fetch("https://firestore.googleapis.com/v1/projects/" + encodeURIComponent(env.FIREBASE_PROJECT_ID) + "/databases/(default)/documents:runQuery", {
    method: "POST", headers: { Authorization: "Bearer " + at, "Content-Type": "application/json" },
    body: JSON.stringify({ structuredQuery: { from: [{ collectionId: "purchases" }], where: { fieldFilter: { field: { fieldPath: "kind" }, op: "EQUAL", value: { stringValue: "subs" } } }, limit: 500 } }),
  });
  if (!r.ok) throw new Error("query " + r.status);
  const rows = (await r.json()) as { document?: { name: string; fields?: Record<string, Record<string, unknown>> } }[];
  for (const it of rows) {
    if (!it.document) continue;
    const row = decode(it.document as { fields?: Record<string, Record<string, unknown>> }) as unknown as LedgerRow & { token?: string };
    if (row.state === "SUBSCRIPTION_STATE_EXPIRED" || row.state === "voided" || !row.token) continue;
    const item = itemBySku(row.sku);
    if (!item) continue;
    out.looked++;
    try {
      const got = await checkSubscription(env, row.token);
      if (!got.ok || !got.sub) { out.failed++; continue; }
      const hash = it.document.name.split("/purchases/")[1];
      await applySubscription(env, row.uid, item, got.sub, hash);
      if (got.sub.state !== row.state) { await ledgerSet(env, hash, { state: got.sub.state }); out.changed++; }
    } catch { out.failed++; }
  }
  return out;
}
```

- [ ] **Step 3: Schedule it**

`index.ts` `scheduled`:
```ts
  async scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil((async () => {
      try { console.log(JSON.stringify({ at: "refund-sweep", ...(await sweepRefunds(env)) })); }
      catch (e) { console.error(JSON.stringify({ at: "refund-sweep", error: String((e as Error).message || e) })); }
      try { console.log(JSON.stringify({ at: "reconcile", ...(await reconcileSubs(env)) })); }
      catch (e) { console.error(JSON.stringify({ at: "reconcile", error: String((e as Error).message || e) })); }
    })());
  },
```
`wrangler.toml`: `crons = ["10 */6 * * *"]` with the comment updated: "every six hours: refunds taken back, subscriptions re-read".

- [ ] **Step 4: Test, typecheck, commit**

```bash
cd ~/nabu-tarot/worker && npm test && npm run typecheck
git add worker/src/reconcile.ts worker/src/index.ts worker/src/refunds.ts worker/wrangler.toml worker/test/reconcile.test.ts
git commit -m "worker: re-read every live subscription every six hours"
```

---

### Task 8: The client `BILL`: catalogue-aware, restorable, pending-aware

**Files:**
- Rewrite: `src/billing.js`
- Modify: `src/backend.js` (`pullProfile` stores `subs`; `signIn*` success → `BILL.sync()`), `src/core.js` (add `SUBS`), `src/main.js:3` (expose `BILL`, `SUBS`)
- Modify: `test/test.html` (add `playMode`)

**Interfaces:**
- Produces: `BILL.start() → Promise<boolean>`, `BILL.retry()`, `BILL.can()`, `BILL.detailsOf(key)`, `BILL.priceOf(key) → string`, `BILL.periodMonths(key) → number`, `BILL.buy(key, {oldKey?, wid?}) → Promise<{opened:string[]}|{pending:true}>` (throws `Error('signin'|'nostore'|'noproduct'|'nopurchase'|'already used'|'offline'|<worker error>)`), `BILL.restore() → Promise<{tried:number; opened:number; pending:number}>`, `BILL.sync()`, `BILL.pendingList()`.
- Produces: `SUBS.get() → {key: SubRow}`; `store 'nabu-subs'`, `'nabu-play-pending'`.

- [ ] **Step 1: The suite's Play stub and first failing checks**

In `test/test.html`, next to `codeMode` (after line ~247), add:
```js
    /* ---- a fake Play, a fake worker, for the Android build ----
       The Digital Goods API is only inside the installed app, so the suite
       stands one up: getDetails answers with prices, listPurchases with what
       this fake Google remembers, PaymentRequest hands back a token, and the
       /billing stub verifies against the same memory and writes the fake
       account the way the worker does. */
    const play = { products: {}, subs: {}, next: 1, requests: [] };
    const playItem = (k) => N.PLAY_ITEMS.filter((i) => i.key === k)[0];
    const skuKey = (sku) => (N.PLAY_ITEMS.filter((i) => i.sku === sku)[0] || {}).key;
    let playKeep = null;
    const playStub = async (url, opt) => {
      const say = (status, body) => ({ ok: status < 300, status: status, json: async () => body });
      if (!/\/billing$/.test(url)) return codeKeep.fetch(url, opt);
      const body = JSON.parse((opt && opt.body) || '{}'), uid = (N.BE.user || {}).uid;
      if (!uid) return say(401, { error: 'signin' });
      const it = N.PLAY_ITEMS.filter((i) => i.sku && i.sku === body.sku)[0];
      if (!it) return say(400, { error: 'unknown product' });
      const doc = cdocs['users/' + uid] || {}, acc = Object.assign({}, doc.access || {}), subs = Object.assign({}, doc.subs || {});
      if (it.kind === 'subs') {
        const s = play.subs[body.token]; if (!s) return say(402, { error: 'unknown purchase' });
        if (s.state === 'SUBSCRIPTION_STATE_PENDING') return say(202, { pending: true });
        if (s.uid && s.uid !== uid) return say(402, { error: 'already used' }); s.uid = uid;
        const grant = ['SUBSCRIPTION_STATE_ACTIVE', 'SUBSCRIPTION_STATE_CANCELED', 'SUBSCRIPTION_STATE_IN_GRACE_PERIOD'].indexOf(s.state) > -1 && s.expiryMs > Date.now();
        const until = new Date(s.expiryMs).toISOString().slice(0, 10);
        subs[it.key] = { sku: it.sku, plan: s.plan || '', state: s.state, until: until, autoRenew: s.autoRenew !== false, tok: 'h' + body.token, opens: it.opens, grant: grant };
        ['manifest', 'plus', 'pro'].forEach((k) => delete acc[k]);
        Object.keys(subs).forEach((k) => { if (subs[k].grant) subs[k].opens.forEach((o) => { if (!acc[o] || subs[k].until > acc[o]) acc[o] = subs[k].until; }); });
        cdocs['users/' + uid] = Object.assign({}, doc, { access: acc, subs: subs });
        return say(200, { ok: true, opened: grant ? it.opens : [], access: acc, subs: subs });
      }
      const p = play.products[body.token]; if (!p) return say(402, { error: 'unknown purchase' });
      if (p.state === 'pending') return say(202, { pending: true });
      if (p.uid && p.uid !== uid) return say(402, { error: 'already used' }); p.uid = uid;
      if (it.key === 'wedding') { if (!body.wid) return say(400, { error: 'no room' }); if (p.wid && p.wid !== body.wid) return say(402, { error: 'already used' }); p.wid = body.wid; cdocs['weddings/' + body.wid] = Object.assign({}, cdocs['weddings/' + body.wid] || {}, { paid: true, paidBy: uid }); return say(200, { ok: true, opened: ['wedding'], wid: body.wid }); }
      if (!p.until) { const d = new Date(); d.setMonth(d.getMonth() + it.months); p.until = d.toISOString().slice(0, 10); }
      it.opens.forEach((o) => { if (!acc[o] || p.until > acc[o]) acc[o] = p.until; });
      cdocs['users/' + uid] = Object.assign({}, doc, { access: acc });
      return say(200, { ok: true, opened: it.opens, access: acc });
    };
    const playMode = async (on, uid) => {
      if (on) {
        codeMode(true, uid || 'uidP'); playKeep = { dg: w.getDigitalGoodsService, pr: w.PaymentRequest };
        w.localStorage.setItem('nabu-twa', 'true');
        w.getDigitalGoodsService = async () => ({
          getDetails: async (ids) => ids.filter((s) => !!skuKey(s)).map((s) => { const it = playItem(skuKey(s)); return { itemId: s, title: it.key, description: '', type: it.kind === 'subs' ? 'subscription' : 'product', price: { currency: 'VND', value: String({ tarot: 300000, lenormand: 300000, playing: 300000, wedding: 30000, manifest: 75000, plus: 79000, pro6: 149000, pro: 249000 }[it.key]) }, subscriptionPeriod: it.kind === 'subs' ? 'P' + it.months + 'M' : undefined }; }),
          listPurchases: async () => Object.keys(play.products).filter((t) => !play.products[t].consumed).map((t) => ({ itemId: play.products[t].sku, purchaseToken: t }))
            .concat(Object.keys(play.subs).map((t) => ({ itemId: play.subs[t].sku, purchaseToken: t }))),
          consume: async () => {}
        });
        w.PaymentRequest = function (methods, total) { const data = methods[0].data; play.requests.push(data); const it = N.PLAY_ITEMS.filter((i) => i.sku === data.sku)[0]; const tok = 'tok' + (play.next++);
          this.show = async () => { if (play.cancelNext) { play.cancelNext = false; const e = new Error('cancelled'); e.name = 'AbortError'; throw e; }
            if (it.kind === 'subs') { play.subs[tok] = { sku: it.sku, state: play.pendingNext ? 'SUBSCRIPTION_STATE_PENDING' : 'SUBSCRIPTION_STATE_ACTIVE', expiryMs: Date.now() + it.months * 30 * 86400000, plan: it.key + '-plan' }; if (data.oldSku) Object.keys(play.subs).forEach((t) => { if (play.subs[t].sku === data.oldSku && t !== tok) play.subs[t].state = 'SUBSCRIPTION_STATE_EXPIRED'; }); }
            else play.products[tok] = { sku: it.sku, state: play.pendingNext ? 'pending' : 'ok' };
            play.pendingNext = false; return { details: { purchaseToken: tok }, complete: async () => {} }; }; };
        w.fetch = playStub;
        await N.BILL.retry();
      } else {
        w.getDigitalGoodsService = playKeep.dg; w.PaymentRequest = playKeep.pr; w.localStorage.removeItem('nabu-twa'); w.localStorage.removeItem('nabu-play-pending'); w.localStorage.removeItem('nabu-subs');
        codeMode(false, uid); await N.BILL.retry();
      }
    };
```
And, as a first block of checks (place after the existing `nabu-twa` paywall check, replacing it — that check asserts the code field exists, which is now wrong):
```js
    { await playMode(true);
      ok(N.BILL.can() && N.BILL.priceOf('tarot') && /300/.test(N.BILL.priceOf('tarot')) && N.BILL.periodMonths('pro6') === 6,
        'inside the app BILL answers with Play\'s own prices and periods for every catalogue item');
      const r1 = await N.BILL.buy('tarot');
      const until1 = N.ACCESS.get().tarot;
      const r2 = await N.BILL.verify('tarot', 'tok1');
      ok(r1.opened[0] === 'tarot' && N.ACCESS.has('tarot') && until1 && N.ACCESS.get().tarot === until1 && r2.ok,
        'buying a course opens it on the account, and sending the same token again returns the same date');
      play.pendingNext = true;
      const r3 = await N.BILL.buy('lenormand');
      ok(r3.pending === true && N.BILL.pendingList().length === 1 && !N.ACCESS.has('lenormand'), 'a pending purchase is remembered and opens nothing yet');
      play.products[N.BILL.pendingList()[0].token].state = 'ok';
      const rs = await N.BILL.restore();
      ok(N.ACCESS.has('lenormand') && N.BILL.pendingList().length === 0 && rs.opened >= 1, 'restore re-sends pending and listed purchases and clears what went through');
      play.cancelNext = true;
      const cancelled = await N.BILL.buy('playing').catch((e) => e);
      ok(cancelled instanceof Error && /Abort|cancel/i.test(cancelled.name + cancelled.message) && !N.ACCESS.has('playing'), 'a cancelled Play sheet opens nothing and is not an error the buyer is blamed for');
      await playMode(false); }
```

- [ ] **Step 2: Run the suite to see the new checks fail**

Run: `cd ~/nabu-tarot && python build.py && PYTHONIOENCODING=utf-8 python test/run.py 2>&1 | grep -E "FAIL|checks"`
Expected: the five new checks FAIL (`N.BILL.retry is not a function` etc.).

- [ ] **Step 3: Rewrite `src/billing.js`**

```js
/* ======================= buying inside the Android app =======================

   Google requires that digital things sold inside an Android app are sold
   through Play. A reading is an hour of somebody's time and is not sold here.
   What goes through Play is the catalogue in play-catalog.js: three courses
   and the wedding once, and four subscriptions that renew until cancelled.

   None of this exists in a browser. The Digital Goods API is only there inside
   the installed app, so BILL.can() is false on the web and every screen falls
   back to what it did before. That is not a limitation: it is how the website
   keeps selling without a commission.

   The phone is never trusted about what it bought. It sends the token Play
   hands back to the worker; the worker asks Google and writes the account.
   The phone then reads the account back. Nothing here opens anything. */

const PLAY_METHOD = 'https://play.google.com/billing';
const PLAY_PENDING = 'nabu-play-pending';

const BILL = {
  service: null, details: {}, starting: null, ready: false,

  can() { return !!this.service; },

  /* One start, shared by everybody who awaits it. Silent on failure: on the
     web this is the normal case. */
  start() {
    if (this.starting) return this.starting;
    this.starting = (async () => {
      try {
        if (!window.getDigitalGoodsService || !CONFIG.aiEndpoint) return false;
        this.service = await window.getDigitalGoodsService(PLAY_METHOD);
        const skus = PLAY_ITEMS.map((i) => i.sku).filter(Boolean);
        const list = await this.service.getDetails(skus);
        (list || []).forEach((d) => { if (d && d.itemId) this.details[d.itemId] = d; });
        return true;
      } catch (e) { this.service = null; return false; }
      finally { this.ready = true; }
    })();
    return this.starting;
  },
  /* Play was silent, or the suite swapped the world under us. */
  retry() { this.starting = null; this.ready = false; this.service = null; this.details = {}; return this.start(); },

  detailsOf(key) { const it = playItem(key); return (it && it.sku && this.details[it.sku]) || null; },
  /* Play's price in the buyer's own currency, or '' when Play has not said. */
  priceOf(key) {
    const d = this.detailsOf(key);
    if (!d || !d.price) return '';
    const loc = lang === 'vi' ? 'vi-VN' : lang === 'de' ? 'de-DE' : 'en-GB';
    try { return new Intl.NumberFormat(loc, { style: 'currency', currency: d.price.currency, maximumFractionDigits: d.price.currency === 'VND' ? 0 : 2 }).format(Number(d.price.value)); }
    catch (e) { return d.price.value + ' ' + d.price.currency; }
  },
  /* ISO 8601 from Play (P6M, P1Y) → months; the catalogue's number when Play
     has not said. */
  periodMonths(key) {
    const d = this.detailsOf(key), it = playItem(key);
    const m = d && d.subscriptionPeriod && /^P(?:(\d+)Y)?(?:(\d+)M)?/.exec(d.subscriptionPeriod);
    return m ? (Number(m[1] || 0) * 12 + Number(m[2] || 0)) : (it ? it.months : 0);
  },

  pendingList() { const a = store.get(PLAY_PENDING, []); return Array.isArray(a) ? a : []; },
  remember(rec) { store.set(PLAY_PENDING, this.pendingList().filter((p) => p.token !== rec.token).concat([rec]).slice(-10)); },
  forget(token) { store.set(PLAY_PENDING, this.pendingList().filter((p) => p.token !== token)); },

  /* Hand a token to the worker. Resolves { ok, opened, access, subs } or
     { pending: true }; throws with the worker's word for anything refused. */
  async verify(sku, token, extra) {
    const idTok = await BE.token();
    const r = await withTimeout(fetch(CONFIG.aiEndpoint.replace(/\/$/, '') + '/billing', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + idTok },
      body: JSON.stringify(Object.assign({ sku: sku, token: token }, extra || {}))
    }), 30000);
    const j = await r.json().catch(() => ({}));
    if (r.status === 202 && j.pending) { this.remember(Object.assign({ sku: sku, token: token, at: Date.now() }, extra || {})); return { pending: true }; }
    if (!r.ok || !j.ok) throw new Error(j.error || ('billing ' + r.status));
    this.forget(token);
    return j;
  },

  /* Buy one thing. opt.oldKey: the plan being replaced (Pro 6 → Pro 12);
     opt.wid: the wedding room this pays for. */
  async buy(key, opt) {
    opt = opt || {};
    const it = playItem(key);
    if (!this.can()) throw new Error('nostore');
    if (!BE.enabled || !BE.user) throw new Error('signin');
    if (!it || !it.sku || !this.details[it.sku]) throw new Error('noproduct');
    const data = { sku: it.sku };
    if (opt.oldKey) {
      /* The bridge replaces a subscription when told which one, by its sku and
         its own token; the token is what listPurchases hands back. */
      const old = playItem(opt.oldKey), held = await this.service.listPurchases().catch(() => []);
      const row = (held || []).filter((p) => old && p.itemId === old.sku)[0];
      if (row) { data.oldSku = old.sku; data.purchaseToken = row.purchaseToken; }
    }
    const req = new PaymentRequest([{ supportedMethods: PLAY_METHOD, data: data }],
      { total: { label: L((courseOf(key) || { name: { vi: key, en: key } }).name), amount: { currency: 'VND', value: '0' } } });
    const res = await req.show();
    const token = res && res.details && (res.details.purchaseToken || res.details.token);
    try { await res.complete(token ? 'success' : 'fail'); } catch (e) { /* already closed */ }
    if (!token) throw new Error('nopurchase');
    const extra = opt.wid ? { wid: opt.wid } : undefined;
    let out;
    try { out = await this.verify(it.sku, token, extra); }
    catch (e) {
      /* Paid, and the worker could not be reached: remembered, and restore
         will finish it. Never lost. */
      if (/billing 5|Failed to fetch|timeout|NetworkError/i.test(String(e && e.message))) { this.remember(Object.assign({ sku: it.sku, token: token, at: Date.now() }, extra || {})); throw new Error('offline'); }
      throw e;
    }
    if (out.pending) return out;
    try { await BE.pullProfile(); } catch (e) { if (out.access) store.set('nabu-access', out.access); if (out.subs) store.set('nabu-subs', out.subs); }
    return { opened: out.opened || it.opens };
  },

  /* Everything Play says this Google account holds, plus everything this
     phone is still waiting on, sent to the worker again. Safe to repeat: the
     worker answers a repeat with what it already did. */
  async restore() {
    const out = { tried: 0, opened: 0, pending: 0 };
    await this.start();
    if (!this.can() || !BE.enabled || !BE.user) return out;
    const seen = {};
    const list = (await this.service.listPurchases().catch(() => [])) || [];
    const rows = list.map((p) => ({ sku: p.itemId, token: p.purchaseToken })).concat(this.pendingList());
    for (const p of rows) {
      if (!p.token || seen[p.token] || !playItemBySku(p.sku)) continue;
      seen[p.token] = true; out.tried++;
      try {
        const extra = p.wid ? { wid: p.wid } : undefined;
        const r = await this.verify(p.sku, p.token, extra);
        if (r.pending) out.pending++; else out.opened++;
      } catch (e) { if (String(e && e.message) === 'already used') this.forget(p.token); }
    }
    try { await BE.pullProfile(); } catch (e) { /* offline: the account is read next time */ }
    return out;
  },
  /* Quietly, at the moments something may have changed. */
  sync() { return this.restore().catch(() => null); }
};

/* Started once, early, so a course page can ask BILL.can() without waiting;
   and once the account is known, whatever Play holds is reconciled. */
if (typeof window !== 'undefined') {
  setTimeout(() => { try { BILL.start().then(() => { if (BILL.can() && typeof BE !== 'undefined' && BE.user) BILL.sync(); }); } catch (e) { /* never block the app */ } }, 1200);
}
```
`courseOf` lives in `learn.js` which loads *after* `billing.js`? Check `build.py`: `learn.js` comes before `billing.js` — fine; `courseOf` is a plain function declaration and hoists within the concatenated script anyway.

- [ ] **Step 4: `subs` on the phone**

`src/core.js`, after the `ACCESS` object:
```js
/* What the account says about each subscription: Google's state, when it
   runs to, whether it renews. Written by the worker, read for the Me tab. */
const SUBS = {
  get() { const s = store.get('nabu-subs', {}); return s && typeof s === 'object' ? s : {}; },
  of(key) { return this.get()[key] || null; }
};
```
`src/backend.js` `pullProfile`, right after `store.set('nabu-access', cloud);`:
```js
    store.set('nabu-subs', d.subs && typeof d.subs === 'object' ? d.subs : {});
```
In `backend.js`, wherever a sign-in resolves (`signIn`, `signInEmail` success paths — find with `grep -n "onAuthStateChanged\|async signIn" src/backend.js`), inside the auth-state handler after `pullProfile()` resolves add `if (typeof BILL !== 'undefined') BILL.sync();`.
`src/main.js:3`: add `BILL: BILL, SUBS: SUBS,` to `window.NABU`.

- [ ] **Step 5: Build, run the suite, commit**

Run: `cd ~/nabu-tarot && python build.py && grep -c "nabu-play-pending" index.html && PYTHONIOENCODING=utf-8 python test/run.py 2>&1 | grep -E "FAIL|checks"`
Expected: no FAIL; check count up by 5.
```bash
git add src/billing.js src/core.js src/backend.js src/main.js test/test.html index.html
git commit -m "app: BILL speaks the catalogue - awaitable start, pending purchases remembered, restore and sync"
```

---

### Task 9: The in-app store and the Me-tab plans card

**Files:**
- Create: `src/store.js`
- Modify: `src/learn.js` (`paywallHTML`, `bindPaywall`, `renderUnlock`), `src/me.js:268-345`, `src/play.js:359-380`, `src/pick.js:40-48`, `src/strings.js` (three language blocks), `build.py` (SCRIPTS), `test/test.html`

**Interfaces:**
- Consumes: `BILL.*`, `SUBS.get()`, `PLAY_ITEMS`, `playItem`.
- Produces: `renderStore(params)`, `storeRowHTML(item)`, `bindStore(root, redraw)`, `myPlansHTML()`, `bindMyPlans(root, redraw)`, `subStateWord(row) → string`, `buyButtonHTML(key, label?)`, `storeNotReadyHTML()`.
- Strings (all three languages; `vi` prefixed `VI-OWNER:` until B3): `stTitle stIntro stBuy stSubscribe stEveryMonths(n) stRenews(d) stEndsOn(d) stProblem stExpired stActive stCancelMeaning stManage stRestore stRestoring stRestored(n) stRestoreNone stNotReady stRetry stPending stIncludedPro stSwitchTo(n) stNeedIn stFailed stHeld myPlans stPlusPitch stCourses stPlans`.

- [ ] **Step 1: Failing checks**

Append to the block in Task 8 step 1, before `await playMode(false);`:
```js
      await go('#/unlock?from=app', '.store');
      ok(d.querySelectorAll('.store [data-buy]').length >= 7 && !d.querySelector('#ucode') && !d.querySelector('#usend') && !d.querySelector('.paypanel') && !d.querySelector('.luckpanel') && !/đ\b/.test(d.querySelector('.store').textContent.replace(/₫/g, '')),
        'the in-app store lists every catalogue item with a Buy button and no basket, code field, transfer panel, reward panel or đồng price');
      d.querySelector('.store [data-buy="plus"]').click(); await waitFor(() => N.ACCESS.has('plus'), 4000);
      await go('#/me', '[data-theme-pick]'); d.querySelector('details[data-sect="own"]').open = true;
      const plans = d.querySelector('.myplans');
      ok(N.SUBS.of('plus') && N.SUBS.of('plus').state === 'SUBSCRIPTION_STATE_ACTIVE' && plans && /renew|gia hạn|verlängert/i.test(plans.textContent) && plans.querySelector('a[href*="play.google.com/store/account/subscriptions?sku="]') && !d.querySelector('#mcode') && d.querySelector('#restore'),
        'the Me tab shows the subscription as active with its renewal date and a Manage link, a Restore button, and no code field');
      Object.keys(play.subs).forEach((t) => { play.subs[t].state = 'SUBSCRIPTION_STATE_CANCELED'; }); await N.BILL.restore();
      await go('#/unlock?from=app', '.store');
      ok(N.ACCESS.has('plus') && /ends|kết thúc|endet/i.test(d.querySelector('.store [data-key="plus"]').textContent), 'cancelled but paid: access stays and the row says when it ends');
      Object.keys(play.subs).forEach((t) => { play.subs[t].state = 'SUBSCRIPTION_STATE_ON_HOLD'; }); await N.BILL.restore();
      ok(!N.ACCESS.has('plus') && N.SUBS.of('plus').state === 'SUBSCRIPTION_STATE_ON_HOLD', 'a payment problem (on hold) closes access until Google says it is paid');
      Object.keys(play.subs).forEach((t) => { play.subs[t].state = 'SUBSCRIPTION_STATE_EXPIRED'; }); await N.BILL.restore();
      await N.BILL.buy('pro6'); await N.BILL.buy('pro', { oldKey: 'pro6' });
      const last = play.requests[play.requests.length - 1];
      ok(last.oldSku === playItem('pro6').sku && last.purchaseToken && N.ACCESS.has('pro') && N.ACCESS.has('plus') && N.SUBS.of('pro6').state === 'SUBSCRIPTION_STATE_EXPIRED',
        'switching Pro plans tells Play which subscription it replaces, and the account ends up holding Pro once');
      await go('#/learn/tarot', '.paywall, #ctabs');
      w.localStorage.removeItem('nabu-access'); await go('#/learn/lenormand', '.paywall');
      ok(d.querySelector('.paywall [data-buy="lenormand"]') && !d.querySelector('#ccode') && !d.querySelector('[data-buyreq]'), 'a course paywall in the app has Play\'s Buy button and nothing else');
      await go('#/play/coin', '.luckbox, .coinwrap, #main');
      ok(!d.querySelector('#luckcode') && (!d.querySelector('.luckbox') || d.querySelector('.luckbox [data-buy="plus"]')), 'the coin\'s limit box in the app offers Plus through Play, not a code');
      /* the sweep: nothing on any screen in the app asks for a transfer, an order or a code */
      const twaRoutes = ['#/home', '#/learn', '#/learn/tarot', '#/learn/lenormand', '#/learn/playing', '#/learn/manifest', '#/learn/guide/mani-woop', '#/unlock', '#/unlock?from=app', '#/me', '#/looks', '#/play/coin', '#/play/tree', '#/pick', '#/play/pet', '#/rewards', '#/prices', '#/book', '#/wedding'];
      const leaks = [];
      for (const r of twaRoutes) { await go(r, '#main'); await sleep(150); const main = d.querySelector('#main');
        if (main.querySelector('#ccode,#ucode,#mcode,#luckcode,input[placeholder^="NABU-"],.paypanel,[data-buyreq],#usend,#wedpay') || /chuyển khoản|mã mở kho|Gửi yêu cầu mở khoá|transfer|unlock code|Freischaltcode|überweis/i.test(main.textContent)) leaks.push(r); }
      ok(leaks.length === 0, 'with the app flag set no screen asks for a transfer, an order to Nabu or a code (leaks: ' + leaks.join(' ') + ')');
      N.BILL.service = null;
      await go('#/unlock?from=app', '.store');
      ok(d.querySelector('.store [data-retry]') && !d.querySelector('.store [data-buy]') && !d.querySelector('#ucode'), 'when Play is silent the store says so and offers Retry - never the website\'s flow');
```
(`#/prices` and `#/book` are readings and may legitimately say "chuyển khoản" — if the sweep flags them, exclude those two from `twaRoutes`; readings are outside Play.)

- [ ] **Step 2: Strings**

In `src/strings.js`, in each language block add (EN shown; DE below; `vi` = `'VI-OWNER: ' + <the English>` for every key):
```js
    stTitle: 'Unlock more in Nabu Tarot', stIntro: 'Bought through Google Play. What you open here is on your account, on every phone you sign in on.',
    stCourses: 'Courses', stPlans: 'Plans', stBuy: 'Buy', stSubscribe: 'Subscribe',
    stEveryMonths: (n) => 'Renews automatically every ' + n + ' months until you cancel', stRenews: (d) => 'Renews on ' + d, stEndsOn: (d) => 'Ends on ' + d + ' · will not renew',
    stProblem: 'Payment problem · fix it in Google Play', stExpired: 'Expired', stActive: 'Active', stHeld: 'Yours',
    stCancelMeaning: 'Cancel any time in Google Play. You keep access until the end of the paid period.',
    stManage: 'Manage in Google Play', stRestore: 'Restore purchases', stRestoring: 'Checking with Google Play…', stRestored: (n) => n + ' purchase(s) restored.', stRestoreNone: 'Nothing new to restore.',
    stNotReady: 'Google Play is not answering right now.', stRetry: 'Try again', stPending: 'Waiting for your payment. It opens by itself once Google Play confirms.',
    stIncludedPro: 'Included in Nabu Pro', stSwitchTo: (n) => 'Switch to ' + n, stNeedIn: 'Sign in first, so the purchase is kept on your account.', stFailed: 'That did not go through. Try again.',
    myPlans: 'Your plans', stPlusPitch: 'Nabu Plus: unlimited coin flips and tree shakes, and every design.',
```
German:
```js
    stTitle: 'Mehr in Nabu Tarot freischalten', stIntro: 'Gekauft über Google Play. Was du hier öffnest, liegt auf deinem Konto, auf jedem Handy, auf dem du dich anmeldest.',
    stCourses: 'Kurse', stPlans: 'Abos', stBuy: 'Kaufen', stSubscribe: 'Abonnieren',
    stEveryMonths: (n) => 'Verlängert sich automatisch alle ' + n + ' Monate, bis du kündigst', stRenews: (d) => 'Verlängert sich am ' + d, stEndsOn: (d) => 'Endet am ' + d + ' · wird nicht verlängert',
    stProblem: 'Zahlungsproblem · in Google Play beheben', stExpired: 'Abgelaufen', stActive: 'Aktiv', stHeld: 'Deins',
    stCancelMeaning: 'Jederzeit in Google Play kündbar. Der Zugang bleibt bis zum Ende des bezahlten Zeitraums.',
    stManage: 'In Google Play verwalten', stRestore: 'Käufe wiederherstellen', stRestoring: 'Frage bei Google Play nach…', stRestored: (n) => n + ' Kauf/Käufe wiederhergestellt.', stRestoreNone: 'Nichts Neues zum Wiederherstellen.',
    stNotReady: 'Google Play antwortet gerade nicht.', stRetry: 'Noch einmal versuchen', stPending: 'Warte auf deine Zahlung. Es öffnet sich von selbst, sobald Google Play bestätigt.',
    stIncludedPro: 'In Nabu Pro enthalten', stSwitchTo: (n) => 'Wechseln zu ' + n, stNeedIn: 'Melde dich zuerst an, damit der Kauf auf deinem Konto bleibt.', stFailed: 'Das hat nicht geklappt. Versuch es noch einmal.',
    myPlans: 'Deine Abos', stPlusPitch: 'Nabu Plus: Münze und Baum ohne Grenze, dazu jedes Design.',
```

- [ ] **Step 3: Write `src/store.js`**

```js
/* ======================= the store inside the Android app =======================
   #/unlock, when the app is the installed one. One row per thing Play sells,
   with Play's own price, and a button that opens Play's sheet. Nothing here
   asks for a transfer, an order or a code: inside the app, Play is the shop.
   The website's #/unlock (learn.js) is untouched. */

const SUB_WORDS = {
  SUBSCRIPTION_STATE_ACTIVE: 'active', SUBSCRIPTION_STATE_CANCELED: 'ending', SUBSCRIPTION_STATE_IN_GRACE_PERIOD: 'problem',
  SUBSCRIPTION_STATE_ON_HOLD: 'problem', SUBSCRIPTION_STATE_PAUSED: 'problem', SUBSCRIPTION_STATE_EXPIRED: 'expired'
};
/* One sentence about a held subscription, from Google's state. */
function subStateWord(row) {
  const S = T(), k = SUB_WORDS[row && row.state] || 'expired', d = row && row.until ? fmtDate(row.until) : '';
  if (k === 'active') return (row.autoRenew ? S.stRenews(d) : S.stEndsOn(d));
  if (k === 'ending') return S.stEndsOn(d);
  if (k === 'problem') return S.stProblem;
  return S.stExpired;
}
const manageURL = (key) => 'https://play.google.com/store/account/subscriptions?sku=' + encodeURIComponent((playItem(key) || {}).sku || '') + '&package=app.nabutarot.twa';
const buyButtonHTML = (key, label, opt) => '<button type="button" class="btn primary block" data-buy="' + key + '"' + (opt && opt.oldKey ? ' data-old="' + opt.oldKey + '"' : '') + (opt && opt.wid ? ' data-wid="' + esc(opt.wid) + '"' : '') + '>' + esc(label || T().stBuy) + '</button>';
const storeNotReadyHTML = () => '<div class="card"><p class="hint">' + esc(T().stNotReady) + '</p><button type="button" class="btn block" data-retry>' + esc(T().stRetry) + '</button></div>';

function storeRowHTML(item) {
  const S = T(), c = courseOf(item.key), name = c ? L(c.name) : item.key, sum = c ? L(c.sum || c.blurb) : '';
  const price = BILL.priceOf(item.key), months = BILL.periodMonths(item.key);
  const held = ACCESS.has(item.key) || (item.opens.length && item.opens.every((k) => ACCESS.has(k)));
  const row = item.kind === 'subs' ? SUBS.of(item.key) : null;
  let foot;
  if (item.kind === 'subs') {
    const proHeld = ACCESS.has('pro'), isPlus = item.key === 'plus', other = item.key === 'pro6' ? 'pro' : item.key === 'pro' ? 'pro6' : '';
    if (row && row.grant) foot = '<p class="hint st">✓ ' + esc(subStateWord(row)) + '</p><a class="btn block" href="' + manageURL(item.key) + '" target="_blank" rel="noopener">' + esc(S.stManage) + '</a>'
      + (other && !(SUBS.of(other) || {}).grant ? '' : '');
    else if (isPlus && proHeld) foot = '<p class="hint st">✓ ' + esc(S.stIncludedPro) + '</p>';
    else if (other && (SUBS.of(other) || {}).grant) foot = buyButtonHTML(item.key, S.stSwitchTo(name), { oldKey: other });
    else foot = (row && SUB_WORDS[row.state] === 'problem' ? '<p class="hint err">' + esc(S.stProblem) + '</p><a class="btn block" href="' + manageURL(item.key) + '" target="_blank" rel="noopener">' + esc(S.stManage) + '</a>' : '')
      + '<p class="hint">' + esc(S.stEveryMonths(months)) + '</p>' + buyButtonHTML(item.key, S.stSubscribe) + '<p class="hint">' + esc(S.stCancelMeaning) + '</p>';
  } else {
    foot = held ? '<p class="hint st">✓ ' + esc(S.stHeld) + (ACCESS.get()[item.key] ? ' · ' + esc(S.unlockOpenUntil(fmtDate(ACCESS.get()[item.key]))) : '') + '</p>'
      : '<p class="hint">' + esc(item.months + ' ' + S.months6) + '</p>' + buyButtonHTML(item.key);
  }
  return '<div class="unl store-row' + (held || (row && row.grant) ? ' on' : '') + '" data-key="' + item.key + '"><div class="unl-h"><b>' + esc(name) + '</b>' + (price ? '<span class="pr">' + esc(price) + (item.kind === 'subs' ? ' <small>/ ' + months + ' ' + esc(S.months6) + '</small>' : '') + '</span>' : '') + '</div>'
    + (sum ? '<p class="hint">' + esc(sum) + '</p>' : '') + '<div class="unl-f">' + foot + '<p class="hint st" data-st="' + item.key + '"></p></div></div>';
}

function bindStore(root, redraw) {
  const S = T();
  $$('[data-buy]', root).forEach((b) => b.addEventListener('click', async () => {
    const key = b.getAttribute('data-buy'), st = $('[data-st="' + key + '"]', root) || $('#bstatus', root);
    if (!(BE.enabled && BE.user)) { toast(S.stNeedIn); location.hash = signinHref(location.hash.slice(1)); return; }
    b.disabled = true; if (st) { st.className = 'hint st'; st.textContent = S.buyWorking; }
    try {
      const opt = {}; if (b.getAttribute('data-old')) opt.oldKey = b.getAttribute('data-old'); if (b.getAttribute('data-wid')) opt.wid = b.getAttribute('data-wid');
      const r = await BILL.buy(key, opt);
      if (r.pending) { if (st) st.textContent = S.stPending; b.disabled = false; return; }
      toast(S.unlocked); if (redraw) redraw(); else route();
    } catch (e) {
      b.disabled = false; const why = String((e && e.message) || '');
      if (st) { st.className = 'hint st err'; st.textContent = why === 'signin' ? S.stNeedIn : /Abort|cancel/i.test((e && e.name) + why) ? '' : why === 'already used' ? S.buyAlready : why === 'nostore' ? S.stNotReady : S.stFailed; }
    }
  }));
  $$('[data-retry]', root).forEach((b) => b.addEventListener('click', async () => { b.disabled = true; await BILL.retry(); if (redraw) redraw(); else route(); }));
  const rs = $('#restore', root);
  if (rs) rs.addEventListener('click', async () => {
    const st = $('#rstatus', root); rs.disabled = true; if (st) { st.className = 'hint'; st.textContent = S.stRestoring; }
    const out = await BILL.restore(); rs.disabled = false;
    if (st) st.textContent = out.opened || out.pending ? S.stRestored(out.opened + out.pending) : S.stRestoreNone;
    if (redraw) redraw();
  });
}

function renderStore(params) {
  const S = T(), m = $('#main');
  const draw = async () => {
    await BILL.start();
    const group = (keys) => '<div class="unlist">' + PLAY_ITEMS.filter((i) => keys.indexOf(i.key) > -1 && i.sku).map(storeRowHTML).join('') + '</div>';
    const from = (params && params.from) || '';
    const courses = '<div class="sec"><h2 style="margin-bottom:8px">' + esc(S.stCourses) + '</h2>' + group(['tarot', 'lenormand', 'playing']) + '</div>';
    const plans = '<div class="sec"><h2 style="margin-bottom:8px">' + esc(S.stPlans) + '</h2>' + group(['plus', 'pro6', 'pro', 'manifest']) + '</div>';
    m.innerHTML = '<div class="store"><div class="eyebrow">' + esc(CONFIG.brand) + '</div><h1 style="margin-bottom:6px">' + esc(S.stTitle) + '</h1><p class="muted">' + esc(S.stIntro) + '</p>'
      + (BILL.can() ? (from === 'app' ? plans + courses : courses + plans) : storeNotReadyHTML())
      + '<div class="card"><button type="button" class="btn block" id="restore">' + esc(S.stRestore) + '</button><p class="hint" id="rstatus"></p></div></div>';
    bindStore(m, draw);
  };
  draw();
}

/* The Me tab: what this account holds, said the way Play says it. */
function myPlansHTML() {
  const S = T();
  const rows = PLAY_ITEMS.filter((i) => i.sku && (i.kind === 'subs' ? SUBS.of(i.key) : ACCESS.get()[i.key]));
  return '<div class="card myplans"><h3 style="margin-bottom:8px">' + esc(S.myPlans) + '</h3>'
    + (rows.length ? rows.map((i) => { const c = courseOf(i.key), row = i.kind === 'subs' ? SUBS.of(i.key) : null;
        return '<div class="course"><span class="nm">' + esc(c ? L(c.name) : i.key) + '</span><span class="pr faint">' + esc(row ? subStateWord(row) : S.unlockOpenUntil(fmtDate(ACCESS.get()[i.key]))) + '</span></div>'
          + (row ? '<p class="hint"><a href="' + manageURL(i.key) + '" target="_blank" rel="noopener">' + esc(S.stManage) + ' →</a></p>' : ''); }).join('')
      : '<p class="hint">' + esc(S.unlockEmpty) + '</p>')
    + '<button type="button" class="btn block" id="restore" style="margin-top:8px">' + esc(S.stRestore) + '</button><p class="hint" id="rstatus"></p>'
    + '<p style="margin-top:8px"><a class="backlink" href="#/unlock?from=app">' + esc(S.stTitle) + ' →</a></p></div>';
}
const bindMyPlans = (root, redraw) => bindStore(root, redraw);
```
`build.py`: insert `'store.js'` right after `'billing.js'`. `src/main.js:3`: add `renderStore: renderStore, subStateWord: subStateWord,`.

- [ ] **Step 4: Screens**

`src/learn.js`:
- `paywallHTML`: replace the whole `+ (isTWA() ? (BILL.can() && BILL.priceOf(c.id) ? … : '') : <price>)` and the `+ (isTWA() ? (BILL.can() ? <playbuy…> : <storeCodeHint>) : <buyreq…>)` and the trailing code row with:
```js
    + (isTWA()
      ? (BILL.can() ? (BILL.priceOf(c.id) ? '<div class="price">' + esc(BILL.priceOf(c.id)) + ' <span>/ ' + c.months + ' ' + esc(S.months6) + '</span></div>' : '')
          + buyButtonHTML(c.id) + '<p class="hint st" data-st="' + c.id + '" style="margin:8px 0"></p>'
        : storeNotReadyHTML())
      : '<div class="price">' + priceHTML(c.price, 'unlock', c.id) + ' <span>/ ' + c.months + ' ' + esc(S.months6) + '</span></div>'
        + (expired ? '<p class="hint err">' + esc(S.courseExpired(a)) + '</p>' : '')
        + '<button type="button" class="btn primary block" data-buyreq="' + courseId + '">' + esc(S.buyCourse) + '</button>'
        + '<p class="hint" id="bstatus" style="margin:8px 0"></p><p class="hint" style="margin:8px 0">' + esc(S.buyHint) + '</p>'
        + '<p style="margin:8px 0"><a class="backlink" href="#/unlock?from=learn">' + esc(S.unlockLink) + ' \u2192</a></p>'
        + '<div class="row"><input id="ccode" placeholder="NABU-T-…" autocapitalize="characters" style="flex:1"><button class="btn" id="cunlock">' + esc(S.unlock) + '</button></div><p class="hint" id="cstatus"></p>')
    + '</div>';
```
  Keep the `expired` line for the TWA branch too (insert it before `buyButtonHTML`). Callers of `paywallHTML` that render synchronously must first `await BILL.start()` in TWA: in `renderCourse` (the function that calls `paywallHTML(courseId)`), make it `async` and add `if (isTWA()) await BILL.start();` before drawing — find with `grep -n "paywallHTML(" src/learn.js`.
- `bindPaywall`: delete the `[data-playbuy]` block; at the top add `bindStore(root, after);`. Guard the `#cunlock`/`[data-buyreq]` blocks with `if (btn)` (already) — they are absent in TWA.
- `renderUnlock`: first line: `if (isTWA()) { renderStore(params); return; }`. Then remove every `isTWA() ? '' :` conditional inside it (the web is the only caller now) and delete the `#ucode` card's TWA-only expectations (nothing to change: the card stays for the web).
- Delete `S.storeCodeHint` usage (string may stay).

`src/me.js:275-283`: replace the "own" card construction with:
```js
    let own = isTWA()
      ? myPlansHTML()
      : '<div class="card"><h3 style="margin-bottom:8px">' + esc(S.myCourses) + '</h3>' + COURSES.map((c) => { /* unchanged web rows */ … }).join('')
        + '<label class="f" for="mcode">' + esc(S.enterCode) + '</label><div class="row nw"><input id="mcode" placeholder="NABU-T-…" autocapitalize="characters"><button class="btn" id="munlock">' + esc(S.unlock) + '</button></div><p class="hint" id="mcstatus"></p></div>';
```
and guard the `#munlock` listener: `const mu = $('#munlock'); if (mu) mu.addEventListener(…)`; after `bindAuth(body)…` add `if (isTWA()) bindMyPlans(body, draw);`.

`src/play.js:359-368` `luckPanelHTML`: the code row becomes
```js
    + (isTWA()
      ? (BILL.can() ? buyButtonHTML('plus', S.stSubscribe) + '<p class="hint st" data-st="plus"></p>' : storeNotReadyHTML())
      : '<div class="row nw"><input id="luckcode" placeholder="' + esc(S.luckCodePh) + '" autocapitalize="characters"><button class="btn" id="luckgo">' + esc(S.unlock) + '</button></div><p class="hint" id="luckstatus"></p>')
```
and `S.luckOffer` (which names 79.000đ) is shown only when `!isTWA()`; in TWA show `S.stPlusPitch`. `bindLuck`: add `bindStore(root, redraw);` first; keep the `#luckgo` block guarded by `if (!go) return;` as now (move `bindStore` above the return).

`src/pick.js:43-47` `pickLimitHTML`: the TWA branch becomes `(BILL.can() ? '<p class="hint" style="margin-bottom:10px">' + esc(S.stPlusPitch) + '</p>' + buyButtonHTML('plus', S.stSubscribe) + '<p class="hint st" data-st="plus"></p>' : storeNotReadyHTML())`; where the pick screen binds its panel, add `bindStore(root, redraw)` (find the function that renders `pickLimitHTML` and its redraw).

- [ ] **Step 5: Build, run, commit**

Run: `cd ~/nabu-tarot && python build.py && grep -c 'class="store"' index.html && PYTHONIOENCODING=utf-8 python test/run.py 2>&1 | grep -E "FAIL|checks"`
Expected: no FAIL. If the sweep names `#/prices` or `#/book`, remove those two from `twaRoutes` (readings are allowed to say "chuyển khoản").
```bash
git add src/store.js src/learn.js src/me.js src/play.js src/pick.js src/strings.js build.py src/main.js test/test.html index.html
git commit -m "app: the in-app store - Play prices, subscriptions with status and Manage, Restore; no code or transfer inside the app"
```

---

### Task 10: The wedding — one purchase, one room, no moving

**Files:**
- Modify: `src/wedding.js` (WED helper, `drawPlan`, `drawPay`, room screen), `src/admin.js:393`, `src/strings.js` (wedding block ×3), `src/services.js` (wedding comment/blurb), `firestore.rules:331-354`, `test/test.html`

**Interfaces:**
- Consumes: `BILL.buy('wedding', {wid})`, `buyButtonHTML`, `bindStore`, `storeNotReadyHTML`.
- Produces: `WED.isPaid(w) = !!(w && w.paid)`; `WED_LATE_MS`; no `askMove/answerMove/canMove/moved/asking/wantMs`.
- Strings changed: `wedTerms` (3 lines), `wedRules` (3), `wedWhenHint`, `wedBuyHint`, `wedDropHint`, `wedDropAsk`, `wedPlanPay`, `wedPayHold`; removed: `wedMoveTitle wedMove wedMoved wedMoveRule wedMoveOnce wedMovedAlready wedMoveTooLate wedMoveAsked wedMoveWait adminWedWants`.
- **D1** lives in one place: `WED.dropCountsAsUsed = true` and terms line 3. If the owner chooses "free cancel", that flag and that line change — nothing else in this task.

- [ ] **Step 1: Failing checks**

Add to `test/test.html` (inside a `playMode(true)` block, with a fake engaged bond — reuse the suite's existing love/wedding fixtures; find them with `grep -n "weddings/" test/test.html`):
```js
      ok(typeof N.WED.askMove === 'undefined' && typeof N.WED.canMove === 'undefined' && !d.querySelector('.movewhen') && !/Đổi ngày giờ|Choose another time|Eine andere Zeit/.test(d.body.textContent),
        'the wedding hour can no longer be moved: no move code, no move panel, no move wording');
      ok(N.WED.isPaid({ paid: false }) === false && N.WED.isPaid({ paid: true }) === true && (w.localStorage.setItem('nabu-access', JSON.stringify({ wedding: '2099-01-01' })), N.WED.isPaid({ paid: false }) === false),
        'a room is paid only if the room says so - account access to "wedding" no longer counts');
      ok(N.T().wedTerms.length === 3 && /thanh toán|pay|bezahl/i.test(N.T().wedTerms[2]) && N.T().wedRules.length === 3, 'the terms are three lines and the third says a new wedding is paid for again');
      /* pay screen in the app: Buy through Play, marked on the room */
      cdocs['weddings/uidP__uidQ'] = { uids: ['uidP', 'uidQ'], a: 'uidP', b: 'uidQ', startMs: Date.now() + 3 * 86400000, state: 'planned', step: 0 };
      await go('#/wedding/pay', '[data-buy="wedding"], .wedcard');
      const wb = d.querySelector('[data-buy="wedding"]');
      ok(wb && wb.getAttribute('data-wid') === 'uidP__uidQ' && !d.querySelector('#wedpay') && !d.querySelector('.paypanel'), 'in the app the wedding is paid through Play for the room that already exists');
      if (wb) { wb.click(); await waitFor(() => cdocs['weddings/uidP__uidQ'].paid === true, 4000); }
      ok(cdocs['weddings/uidP__uidQ'].paid === true, 'paying marks that room paid');
```
(Adapt the bond fixture to whatever the suite already uses for `#/wedding`; the `cdb` fake must return `cdocs['weddings/...']` for `WED.watch`/`WED.get` — check `cdb` in `test.html` supports the `weddings` collection; if not, extend it the way it serves `users/`.)

- [ ] **Step 2: `wedding.js`**

- Line 42: `const WED_LATE_MS = 60 * 60 * 1000;   /* inside the last hour, calling off is final */` (rename; `lateNow` uses it).
- In `WED`: delete `moved`, `asking`, `wantMs`, `canMove`, `askMove`, `answerMove`. Change `isPaid(w) { return !!(w && w.paid); }`. Add `dropCountsAsUsed: true,` with the comment `/* D1: a room given up before its hour is still a wedding paid for. */`.
- `drawPlan`, `!w` branch: keep the hour input and the terms card. In the `#wedmake` click: after storing `nabu-wed-terms`, **always create the room first**: `b.disabled = true; try { await WED.create(bond, ms); store.set('nabu-wed-want', 0); toast(S.wedMade); location.hash = '#/wedding/pay'; } catch (e) { … }`. Delete the `if (!ACCESS.has('wedding')) { location.hash = '#/wedding/pay'; return; }` line and the `ACCESS.has('wedding') ? S.wedPlanHint : S.wedPlanPay(...)` ternary → always `S.wedPlanHint`.
- `drawPay(bond)` (line ~1160): it must now require the room: `const w = wedding; if (!w) { location.hash = '#/wedding'; return; }`. Body: keep the header; then
```js
      + (isTWA()
        ? (BILL.can() ? '<div class="card"><h3 style="margin-bottom:6px">' + esc(S.wedPayHow) + '</h3>' + (BILL.priceOf('wedding') ? '<p class="wedprice">' + esc(BILL.priceOf('wedding')) + '</p>' : '') + buyButtonHTML('wedding', S.wedBuy, { wid: w.id }) + '<p class="hint st" data-st="wedding"></p></div>' : storeNotReadyHTML())
        : payPanelHTML(S.wedPayWhat2(wedWhen(ms)), price, payRef('wedding|' + w.id), 'wedpanel'))
```
  and remove the `#wedpay` button and its handler entirely (the room exists already; on the web the order is created by the pay panel's existing flow — check `bindPayPanel` creates the unlock order with `wid`; if it does not, keep a small `BE.createUnlockOrder([{ id: 'wedding', wid: w.id, … }], price)` call on the panel's send). After the HTML: `if (isTWA()) bindStore(m, () => drawPay(bond)); else bindPayPanel(...)`. Remove the `\u2190 wedChangeTime` link.
- Room screen (line ~1298-1320): delete the `(ACCESS.has('wedding') ? '' : <wedUnpaid…>)` and replace with `(WED.isPaid(w) ? '' : '<p class="hint hold">' + esc(S.wedUnpaid) + ' <a href="#/wedding/pay">' + esc(S.wedPayNow) + ' \u2192</a></p>')`. Delete the whole `(WED.canMove(w) ? … : …)` block and the `#wedmove` listener. In `#weddrop`: `if (!confirm(late || WED.dropCountsAsUsed ? S.wedDropLateAsk : S.wedDropAsk)) return;`.
- No-show room (line ~832): delete the `(mine ? '<a … href="#/wedding">' + esc(S.wedMoveTitle) + '</a>' : '')` term.
- `grep -n "wedMove\|canMove\|askMove\|answerMove\|wantMs\|moveAsk\|WED_MOVE_MS\|ACCESS.has('wedding')" src/*.js` must return nothing (except the `dropCountsAsUsed` comment).

- [ ] **Step 3: `admin.js:393`** — delete the `WED.asking(w) ? … adminWedWants …` term.

- [ ] **Step 4: Strings (each language; `vi` as `VI-OWNER:` + English)**

```js
    wedTerms: [
      'The ceremony begins at the hour you choose. One of you must be here and press Begin within 15 minutes of it.',
      'If nobody has begun by then, the room closes itself, your guests are told, and the wedding counts as held.',
      'The hour cannot be changed, and calling the wedding off counts as held too. Another wedding means paying again.'
    ],
    wedRules: [
      'The ceremony starts at the chosen hour - one of you presses Begin within the first 15 minutes.',
      'The hour cannotot be changed once the room is made.',
      'Calling off, or nobody coming: the wedding counts as held and the fee is not returned.'
    ],
    wedWhenHint: 'In the time on your own phone. Choose carefully: the hour cannot be changed after this.',
    wedBuyHint: 'Paid once, for one ceremony at one hour.',
    wedPlanHint: 'Guests can only come in from 15 minutes before it starts. The hour cannot be changed once the room is made.',
    wedDropHint: 'Calling off deletes the room and the guest list. The wedding counts as held; another one means paying again.',
    wedDropAsk: 'Call this wedding off? The room and the guest list are deleted, and the wedding counts as held.',
    wedPayHold: (when) => 'The room is holding ' + when + ' for you. Paying is what makes that hour yours.',
```
(Fix the typo `cannotot` → `cannot` when pasting.) Delete `wedMoveTitle, wedMove, wedMoved, wedMoveRule, wedMoveOnce, wedMovedAlready, wedMoveTooLate, wedMoveAsked, wedMoveWait, wedChangeTime, wedPlanPay, adminWedWants` from all three blocks. `services.js` wedding entry: the comment "the year is there so nobody loses what they paid for by having to move the date" → "bought once for one room; the months are only the ledger's word"; `blurb` sentence "You choose the day and the hour" stays, add nothing about changing.

- [ ] **Step 5: Rules**

`firestore.rules:344-353`:
```
      allow update: if (request.auth != null && request.auth.uid in resource.data.uids
                    && request.resource.data.uids == resource.data.uids
                    && request.resource.data.diff(resource.data).affectedKeys()
                         .hasOnly(['state', 'step', 'vows', 'doneAt', 'bouquet', 'guestCount', 'ready']))
                    // Whether it has been paid for is Nabu's to write (a web order),
                    // or the worker's (a Play purchase; the service account is not
                    // bound by these rules). The hour is nobody's to change.
                    || (isAdmin() && request.resource.data.diff(resource.data).affectedKeys()
                         .hasOnly(['paid', 'paidAt']));
```
`firestore.rules:38-41` `touchesPaid`: both branches name `['access', 'revoked', 'subs']` (create branch: `hasAny(['revoked', 'subs']) || !emptyAccess()`).

- [ ] **Step 6: Build, run, commit**

Run: `cd ~/nabu-tarot && python build.py && grep -c "dropCountsAsUsed" index.html && grep -c "askMove" index.html; PYTHONIOENCODING=utf-8 python test/run.py 2>&1 | grep -E "FAIL|checks"`
Expected: `1`, `0`, no FAIL. The five old move checks in `test.html` (grep `askMove|canMove|wedMove`) are deleted in this task.
```bash
git add src/wedding.js src/admin.js src/strings.js src/services.js firestore.rules test/test.html index.html
git commit -m "wedding: one purchase pays one room through Play, the hour cannot be moved, cancelling counts as held"
```

---

### Task 11: Coins and vouchers are for readings only

**Files:**
- Modify: `src/luck.js:37-42, 70-71`, `src/learn.js` (`unlockCartHTML`, `unlockMessage`, `renderUnlock` web branch, `paywallHTML` web), `src/services.js:95-103`, `src/strings.js` (luck lines ×3), `test/test.html`

**Interfaces:** `VOUCHERS` has 2 entries and no `pro`; `luckCut/rewardPanelHTML/bindRewardPanel/luckCommit` unchanged and used by `book.js` only.

- [ ] **Step 1: Failing checks**

```js
    ok(N.VOUCHERS.length === 2 && N.VOUCHERS.every((v) => !v.pro) && N.VOUCHERS[1].pct === 10, 'two level vouchers, 5% and 10%, none gated on Pro');
    ok(!JSON.stringify(N.COURSES).match(/Voucher gi|15% and 20%|15 % und 20 %/), 'Pro no longer advertises vouchers');
    w.localStorage.setItem('nabu-coins', '20000'); w.localStorage.setItem('nabu-luck-best', '5');
    await go('#/unlock', '#usend'); ok(!d.querySelector('.luckpanel') && !/Phiếu giảm|voucher|Gutschein/i.test(d.querySelector('#ucart').textContent), 'the web unlock page offers no coins or vouchers');
    await go('#/book', '.luckpanel, #main'); ok(!!d.querySelector('.luckpanel'), 'booking a reading still offers coins and the voucher');
    w.localStorage.removeItem('nabu-coins'); w.localStorage.removeItem('nabu-luck-best');
```
(Adjust the `#/book` step to whatever state the suite already uses to reach the basket with an item in it — the panel appears once `cartTotal() > 0`.)

- [ ] **Step 2: Code**

`luck.js`: `const VOUCHERS = [{ lv: 3, pct: 5 }, { lv: 5, pct: 10 }];` with the comment: "Two tiers, for readings. There used to be two more held back for Pro; a subscription is not a discount card, so they went." `tier()`/`next()`: drop the `(!v.pro || proOn())` / `(v.pro && !proOn())` conditions. Header comment of the file: "come off the price of a reading" (not "anything sold here").
`learn.js`: `unlockCartHTML` → remove `cut` and the three `cut.*` rows; `unlockMessage` → remove `luckLines(cut)` and the `luckAfter` line; `renderUnlock` → remove `rewardPanelHTML(unlockBase(), UNL_USE)`, `bindRewardPanel(m, UNL_USE, draw)`, `luckCommit(...)` calls, and the `UNL_USE`/`unlockLuck` definitions; `payPanelHTML(…, unlockLuck().final, …)` → `unlockBase()`. The paywall's `data-buyreq` path never used the panel — nothing to do.
`services.js:95-103`: remove the `'Voucher giảm 15% và 20%'` / `'The 15% and 20% vouchers'` (and the German equivalent if present) entries from both Pro `includes`.
`strings.js` (×3; `vi` as `VI-OWNER:`): `luckIntro: 'Caring for your companion every day earns Nabu coins and opens a voucher. One coin is worth one đồng towards a reading with Nabu.'`, `luckWorth: (s) => 'Worth ' + s + ' towards a reading.'`, `luckHint`: unchanged, `luckOffer` (web only now): unchanged.

- [ ] **Step 3: Build, run, commit**

```bash
cd ~/nabu-tarot && python build.py && PYTHONIOENCODING=utf-8 python test/run.py 2>&1 | grep -E "FAIL|checks"
git add src/luck.js src/learn.js src/services.js src/strings.js test/test.html index.html
git commit -m "coins and vouchers: readings only; the Pro voucher tiers go"
```

---

### Task 12: Fill B1 and B3, run everything, and release v190

**Files:**
- Modify: `src/play-catalog.js`, `worker/src/catalog.ts` (B1), `src/strings.js` (B3), `src/main.js:2`, `sw.js:2`, `BILLING-SESSION.md`, `NEXT-SESSION.md`

- [ ] **Step 1: B1** — paste the four subscription product IDs into `PLAY_SUB_SKUS` in both files (same values). Run `cd worker && npm test` — the two skipped tests must now run and pass. Run the suite.

- [ ] **Step 2: B3** — paste the owner's Vietnamese for every `VI-OWNER:` key (Appendix C lists them with proposed drafts). Then:
Run: `grep -c "VI-OWNER:" src/strings.js` → must print `0`.

- [ ] **Step 3: Version, build, suite**

`src/main.js:2` → `window.APP_VERSION = 'v190';` and `sw.js:2` → `const CACHE = 'nabu-tarot-v190';`.
Run: `netstat -ano | findstr :8765` (must be empty) `&& python build.py && grep -c "v190" index.html && grep -c 'class="store"' index.html && PYTHONIOENCODING=utf-8 python test/run.py 2>&1 | tail -3`
Expected: `1`, ≥1, all checks pass (604 at v189 + about 20 new − 5 removed).

- [ ] **Step 4: Docs** — `BILLING-SESSION.md`: replace "What has to exist" §2 (eight products) with the catalogue table and the note that Pro is two subscription products; add the `/rtdn` endpoint and the 6-hour reconcile to "What is already built". `NEXT-SESSION.md`: one paragraph under "What is live now" for v190.

- [ ] **Step 5: One commit, push, verify**

```bash
git add -A src sw.js index.html worker BILLING-SESSION.md NEXT-SESSION.md docs
git commit -m "v190 - Google Play billing end to end: courses and the wedding once, Plus, Pro (6/12) and Manifestation as subscriptions; RTDN and reconciliation; coins for readings only"
git push
```
Then: `curl -s -X POST https://nabu-ai.0211nhatanh.workers.dev/billing -H "Content-Type: application/json" -d '{}'` → `{"error":"signin"}`; `curl -s -o /dev/null -w "%{http_code}" -X POST https://nabu-ai.0211nhatanh.workers.dev/rtdn` → `401` (or `404` until `RTDN_AUDIENCE` deploys). Check the GitHub Actions `worker` run is green. Open `https://nabutarot.com` and grep the page source for `dropCountsAsUsed` (a string only v190 has).

- [ ] **Step 6: Owner republishes the rules** (Appendix A, item 6) — the wedding update keys and `subs` protection are not live until then.

---

## Self-review

- Spec §4 catalogue → Task 1. §5 model (`access`, `subs`, ledger fields, room) → Tasks 3, 4, 5. §6 `/billing` (courses idempotent, wedding room, subs, 202) → Task 5; `/rtdn` → Task 6; reconcile + cron → Task 7; `auth.ts` → Task 6; `fs.ts` → Task 2; config → Tasks 6–7. §7 client → Tasks 8–9. §8 wedding → Task 10. §9 coins → Task 11. §10 rules → Task 10. §11 tests → every task; the TWA sweep in Task 9. §12 release → Task 12. B1/B2 → Task 0 + Task 12; B3 → Task 12; D1 → Task 10 (`dropCountsAsUsed`).
- Names: `claimPurchase(env, uid, sku, ids, token, extra)` used identically in Tasks 4, 5. `applySubscription(env, uid, item, sub, tokenHash)` in Tasks 3, 5, 6, 7. `markGranted(env, token, extra)` in 4, 5. `ledgerGet/ledgerSet` in 4, 6, 7. `BILL.buy(key, {oldKey, wid})`, `BILL.verify(sku, token, extra)`, `BILL.restore()`, `BILL.retry()`, `BILL.periodMonths(key)`, `BILL.pendingList()` in 8, 9, 10 and the suite. `buyButtonHTML(key, label, {oldKey, wid})`, `bindStore(root, redraw)`, `storeNotReadyHTML()` in 9, 10. `SUBS.of(key)` in 8, 9. `LedgerRow.token` added in Task 7's note — apply it in Task 4's `claimPurchase` (`row.token = token`) when executing Task 4.
- Task 6 imports `removeAccessFor` from `refunds.ts` — exported there in Task 6 step 3.
- Task 9's `manageURL` uses `playItem(key).sku`; for a plan whose sku is `''` (B1 unfilled) the store hides the row (`i.sku` filter) so no dead link renders.

---

## Appendix A — What only the owner can do in Google's consoles

Only unfinished items. **Not checked from this machine**: whether the service account is linked, whether RTDN exists, licence testers, tester opt-in, bank verification status. The probe in Task 0 is the one check that can be made from here.

1. **B1 — send the subscription IDs.** Play Console → Nabu Tarot → *Monetise with Play* → *Products* → *Subscriptions*. For each of the four, copy the **Product ID** and, inside it, the **Base plan ID**. Reply with a 4-row table. (Task 0 tries to read these itself; if it prints them, skip this.)
2. **B2 — Pro must be two products.** If Pro is one subscription with two base plans (`…-6m` and `…-12m`), the app can only ever sell the first one. Create a second subscription product (e.g. for the 12-month plan) with one base plan, activate it, and include both IDs in the table. Leave the extra base plan on the old product inactive.
3. **Service account.** *Users and permissions* → *Invite new users* → `nabu-worker@nabutarot.iam.gserviceaccount.com` → app **Nabu Tarot** → tick *View app information and download bulk reports*, *View financial data, orders and cancellation survey responses*, *Manage orders and subscriptions* → *Invite user*. Until this is done every purchase answers `check failed` after the buyer has paid.
4. **Real-time Developer Notifications.**
   a. [console.cloud.google.com](https://console.cloud.google.com) → project **nabutarot** → *Pub/Sub* → *Topics* → *Create topic* → ID `play-rtdn` → Create.
   b. On the topic → *Permissions* → *Add principal* → `google-play-developer-notifications@system.gserviceaccount.com` → role **Pub/Sub Publisher** → Save.
   c. *Subscriptions* → *Create subscription* → ID `play-rtdn-worker` → topic `play-rtdn` → Delivery type **Push** → Endpoint URL `https://nabu-ai.0211nhatanh.workers.dev/rtdn` → tick **Enable authentication** → Service account `nabu-worker@nabutarot.iam.gserviceaccount.com` → Audience `https://nabu-ai.0211nhatanh.workers.dev/rtdn` → Create. If it complains the Pub/Sub service agent needs the *Service Account Token Creator* role, click the offered *Grant*.
   d. Play Console → Nabu Tarot → *Monetise with Play* → *Monetisation setup* → *Real-time developer notifications* → Topic name `projects/nabutarot/topics/play-rtdn` → *Save* → *Send test notification*. Tell me when sent; the worker logs `{"at":"rtdn","ignored":"test"}` if it arrived.
5. **Licence testers and opt-in.** Play Console home (all apps) → *Settings* → *Licence testing* → add the Gmail of every test phone → *RESPOND_NORMALLY* → Save. Then Nabu Tarot → *Testing* → *Internal testing* → *Testers* → same Gmails → copy the *Join on the web* link → open it on each phone → *Accept* → install from Play.
6. **Republish `firestore.rules`** after v190 is pushed: [console.firebase.google.com](https://console.firebase.google.com) → nabutarot → *Firestore Database* → *Rules* → replace everything with the contents of `C:\Users\angel\nabu-tarot\firestore.rules` → *Publish*.
7. **Bank verification.** Play Console → *Setup* → *Payments profile* → look for *Verified* next to the bank account. Nothing else to do; until it says so, test purchases work but no money is paid out.

Nothing needs uploading to Play: the versionCode 2 bundle already carries the billing bridge this plan uses.

## Appendix B — Device tests (owner, licence-tester account, real phone)

Licence testers pay with test cards; subscription periods are shortened (roughly: 1 year → 30 min, 6 months → 15 min, grace 5 min, hold 10 min).

| # | Do | Expect |
|---|---|---|
| 1 | Install from the internal-test link; open | No browser bar at the top (verified TWA) |
| 2 | Learn → Tarot course | Play's price in ₫ and one **Buy** button; no code field |
| 3 | Buy with *Test card, always approves* | Course opens; Me tab lists it with a date; Firebase `users/{uid}.access.tarot` set |
| 4 | Uninstall, reinstall, sign in | Course still open (account) — and *Restore purchases* reports 0 new |
| 5 | Store → Nabu Plus → Subscribe | Row shows *Active · Renews on …*; `users/{uid}.subs.plus.state = ACTIVE`; worker log `granted` |
| 6 | Wait one shortened period | Still active; `until` moved forward (RTDN `RENEWED` in the worker log) |
| 7 | Play Store → Subscriptions → cancel Plus | Within a minute the row says *Ends on …*; coin/tree still unlimited |
| 8 | Wait until the end date | Plus gone; row says *Expired* |
| 9 | Store → Pro 6 months → Subscribe; then Pro 12 months → *Switch to* | Play shows the replacement sheet; afterwards one Pro row active, Pro 6 gone |
| 10 | Buy Manifestation with *Test card, always declines* | Play refuses; nothing opens; no error blaming you |
| 11 | Buy Lenormand with *Slow test card, approves after a few minutes* | Screen says *Waiting for your payment*; after Play confirms, *Restore* (or reopening the app) opens it |
| 12 | Play Store → payment method → cause a decline (test card *declines*) on an active sub, wait | Row shows *Payment problem*; after the hold period access closes; fix the card → returns |
| 13 | Red thread → engaged → Wedding → pick an hour → tick terms → *Create room* → Buy | Room shows paid; door opens 15 min before; the terms screen says the hour cannot be changed and cancelling counts as held |
| 14 | Try the same wedding purchase on a second room | Refused (`already used`) |
| 15 | Play Console → Order management → refund the Tarot order | Within 6 hours (or at once via RTDN) the course closes; ledger row `voided` |

## Appendix C — Vietnamese lines the owner must supply (B3)

Keys and their English; the owner writes the Vietnamese (short sentences, everyday words). Paste into the `vi` block replacing `VI-OWNER: …`.

`stTitle stIntro stCourses stPlans stBuy stSubscribe stEveryMonths stRenews stEndsOn stProblem stExpired stActive stHeld stCancelMeaning stManage stRestore stRestoring stRestored stRestoreNone stNotReady stRetry stPending stIncludedPro stSwitchTo stNeedIn stFailed myPlans stPlusPitch` (Task 9) · `wedTerms[3] wedRules[3] wedWhenHint wedBuyHint wedPlanHint wedDropHint wedDropAsk wedPayHold` (Task 10) · `luckIntro luckWorth` (Task 11).

Proposed drafts, for the owner to accept or rewrite (never shipped unaccepted):
- stBuy → "Mua" · stSubscribe → "Đăng ký" · stEveryMonths(n) → "Tự động gia hạn mỗi n tháng cho tới khi bạn huỷ" · stRenews(d) → "Gia hạn ngày d" · stEndsOn(d) → "Hết hạn ngày d · không gia hạn nữa" · stProblem → "Thanh toán gặp lỗi · bạn sửa trong Google Play nhé" · stCancelMeaning → "Huỷ lúc nào cũng được trong Google Play. Bạn vẫn dùng được tới hết kỳ đã trả." · stManage → "Quản lý trong Google Play" · stRestore → "Khôi phục mua hàng" · stNotReady → "Google Play chưa trả lời." · stRetry → "Thử lại" · stPending → "Đang chờ bạn thanh toán. Xong là tự mở, không cần làm gì thêm." · myPlans → "Gói của bạn" · wedTerms[2] → "Không đổi được ngày giờ. Huỷ lễ cũng tính là đã dùng. Muốn tổ chức lần nữa, hai bạn thanh toán lại." · luckIntro → "Chăm bạn nhỏ mỗi ngày sẽ tích được xu Nabu và mở phiếu giảm giá. Một xu bằng một đồng khi bạn đặt lịch xem bài với Nabu."
