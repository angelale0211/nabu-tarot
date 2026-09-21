/* ======================= buying inside the iPhone app =======================

   Apple requires what Google requires: anything digital sold inside the app
   is sold through the App Store. The iPhone app is a Capacitor shell around
   this same site, and its NativePurchases plugin (@capgo/native-purchases,
   StoreKit 2) is the App Store's side of the counter.

   Nothing on any screen changes. The store, the paywalls, the coin and the
   wedding all ask BILL; inside the iPhone app BILL answers from the App Store
   instead of Google Play, with the same questions and the same shape of
   answer: can(), canBuy(key), priceOf(key), buy(key, opt), restore(), diag().

   The rule from billing.js holds here too. The phone is never trusted about
   what it bought: it hands the worker the transaction id StoreKit gave it,
   the worker asks Apple (worker/src/apple.ts) and writes the account, and the
   phone reads the account back. A transaction is only marked finished in
   StoreKit once the worker has answered for it - an unfinished one stays in
   Apple's queue and is sent again - so a purchase can be delayed by a lost
   connection but never lost. */

const APPLE_PENDING = 'nabu-apple-pending';
const APPLE_GIVE_UP = 8;

function applePlugin() {
  const C = window.Capacitor;
  if (!C) return null;
  if (C.Plugins && C.Plugins.NativePurchases) return C.Plugins.NativePurchases;
  return typeof C.isPluginAvailable === 'function' && C.isPluginAvailable('NativePurchases') && typeof C.registerPlugin === 'function'
    ? C.registerPlugin('NativePurchases') : null;
}

/* The Nabu account a purchase belongs to, as the UUID StoreKit carries on the
   transaction and every renewal: sha256("nabu-tarot:" + uid), first 16 bytes,
   version-5 and variant bits. worker/src/apple.ts derives the same value and
   refuses a transaction whose token names a different account. */
async function appleAccountToken(uid) {
  const h = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode('nabu-tarot:' + uid))).slice(0, 16);
  h[6] = (h[6] & 0x0f) | 0x50; h[8] = (h[8] & 0x3f) | 0x80;
  const x = Array.from(h).map((b) => b.toString(16).padStart(2, '0')).join('');
  return x.slice(0, 8) + '-' + x.slice(8, 12) + '-' + x.slice(12, 16) + '-' + x.slice(16, 20) + '-' + x.slice(20);
}

const APPLE_BILL = {
  store: 'apple',
  service: null, details: {}, starting: null, ready: false, state: 'idle', why: '', stage: '',
  attempt: 0, tries: 0, lastTryAt: 0, tookMs: 0, buying: '', buyingSeq: 0, seq: 0, lastSheet: null, onSettled: null,
  connectMs: 10000, detailsMs: 15000, sheetMs: 150000, listening: false,

  can() { return this.state === 'ready' && !!this.service; },
  canBuy(key) { return this.can() && !!this.detailsOf(key); },
  priced() { return Object.keys(this.details).length; },
  sellable() { return PLAY_ITEMS.filter((i) => i.sku).length; },
  provider() { return 'appstore'; },
  detailsOf(key) { const it = playItem(key); return (it && it.sku && this.details[it.sku]) || null; },
  /* The App Store's own price string, already in the buyer's currency and format. */
  priceOf(key) { const d = this.detailsOf(key); return (d && d.priceString) || ''; },
  /* The catalogue's months: the App Store describes a period in its own terms and the store's sentence only needs a number. */
  periodMonths(key) { const it = playItem(key); return it ? it.months : 0; },
  backoffMs() { return [0, 2000, 5000, 15000, 30000][Math.min(this.tries, 4)]; },
  retry() { return this.start(true); },

  /* Ask the App Store for the catalogue. The same guard-rails as Play: one
     attempt at a time, bounded, a failure retried on demand behind a backoff,
     and the reason kept in a few characters for the screen:

       noplugin      the shell has no purchase plugin (an old build of the app)
       noendpoint    no worker to check purchases with
       details:<n>   the App Store refused to price the catalogue
       noproducts    it answered with nothing - the products are not live yet
                     for this Apple account, or the agreements are unsigned */
  start(force) {
    if (this.state === 'starting' && this.starting) return this.starting;
    if (this.state === 'ready' && !force) return Promise.resolve(true);
    if (this.state === 'failed' && !force && Date.now() - this.lastTryAt < this.backoffMs()) return Promise.resolve(false);
    const my = ++this.attempt, began = Date.now();
    this.state = 'starting'; this.lastTryAt = began; this.why = ''; this.stage = '';
    this.starting = (async () => {
      const mine = () => my === this.attempt;
      const fail = (why, stage) => { if (!mine()) return false; this.details = {}; this.state = 'failed'; this.ready = true; this.why = why; this.stage = stage || ''; this.tookMs = Date.now() - began; this.tries++; return false; };
      const P = applePlugin();
      if (!P) return fail('noplugin');
      if (!CONFIG.aiEndpoint) return fail('noendpoint');
      this.listen(P);
      let got;
      try { got = await withTimeout(P.getProducts({ productIdentifiers: PLAY_ITEMS.map((i) => i.sku).filter(Boolean) }), this.detailsMs); }
      catch (e) { return fail('details:' + errName(e), 'details'); }
      if (!mine()) return false;
      const map = {};
      ((got && got.products) || []).forEach((p) => { if (p && p.identifier) map[p.identifier] = p; });
      this.service = P;
      if (!Object.keys(map).length) return fail('noproducts', 'details');
      /* Which storefront StoreKit is actually pricing in. The owner's App Store
         account is Vietnam and the payment sheet charges dong, while the price
         list came back in dollars; this is the one number that says which
         country StoreKit thinks it is selling to, rather than guessing from
         the prices. Kept for the diagnostics only - nothing is decided by it. */
      try { const sf = await withTimeout(P.getStorefront(), this.detailsMs); this.storefront = (sf && sf.countryCode) || ''; }
      catch (e) { this.storefront = ''; }
      this.details = map; this.state = 'ready'; this.ready = true; this.tries = 0; this.why = ''; this.tookMs = Date.now() - began;
      return true;
    })();
    return this.starting;
  },

  /* What StoreKit delivers on its own - a renewal, an Ask to Buy a parent has
     approved, a purchase finished while the app was closed - is handed to the
     worker the same way a purchase made on the screen is. */
  listen(P) {
    if (this.listening || !P || typeof P.addListener !== 'function') return;
    this.listening = true;
    try {
      P.addListener('transactionUpdated', (tx) => {
        if (!tx || !tx.transactionId || !tx.productIdentifier) return;
        this.remember({ sku: tx.productIdentifier, token: String(tx.transactionId), at: Date.now() });
        if (typeof BE !== 'undefined' && BE.user) this.restore().catch(() => {});
      });
    } catch (e) { this.listening = false; }
  },

  pendingList() { const a = store.get(APPLE_PENDING, []); return Array.isArray(a) ? a : []; },
  remember(rec) {
    const list = this.pendingList().filter((p) => p.token !== rec.token).concat([Object.assign({}, this.pendingList().filter((p) => p.token === rec.token)[0] || {}, rec)]);
    if (list.length > 50) { list.sort((a, b) => (a.tries || 0) - (b.tries || 0)); list.length = 50; }
    store.set(APPLE_PENDING, list);
  },
  forget(token) { store.set(APPLE_PENDING, this.pendingList().filter((p) => p.token !== token)); },
  stuckKey(rec) { return BILL_PLAY.stuckKey(rec); },
  flagStuck(rec) { return BILL_PLAY.flagStuck.call(this, rec); },
  resolveWeddingWid() { return BILL_PLAY.resolveWeddingWid.call(this); },

  /* The worker's word on one transaction. Resolves { ok, opened, access, subs };
     throws with the worker's reason for a refusal, or 'offline' for anything
     that is not an answer. */
  async verify(sku, token, extra) {
    const idTok = await BE.token();
    let r;
    try {
      r = await withTimeout(fetch(CONFIG.aiEndpoint.replace(/\/$/, '') + '/billing', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + idTok },
        body: JSON.stringify(Object.assign({ store: 'apple', sku: sku, token: token }, extra || {}))
      }), 30000);
    } catch (e) { throw new Error('offline'); }
    const j = await r.json().catch(() => ({}));
    if (r.status >= 500 || r.status === 429) throw new Error('offline');
    if (!r.ok || !j.ok) throw new Error(j.error || ('billing ' + r.status));
    return j;
  },

  /* StoreKit is told the purchase is done only once the worker has answered
     for it - granted, or refused for good. */
  async finish(token) {
    const P = this.service || applePlugin();
    if (!P || typeof P.acknowledgePurchase !== 'function') return;
    try { await withTimeout(P.acknowledgePurchase({ purchaseToken: String(token) }), this.detailsMs); } catch (e) { /* already finished, or gone: nothing left to do */ }
  },

  /* One transaction, from StoreKit to the account. */
  async settle(rec) {
    this.remember(rec);
    let out;
    try { out = await this.verify(rec.sku, rec.token, rec.wid ? { wid: rec.wid } : undefined); }
    catch (e) {
      const why = String((e && e.message) || '');
      /* Apple has the money and the worker could not be reached: kept, unfinished, for restore(). */
      if (why === 'offline') throw e;
      /* A final answer - already used by another account, refunded, not this app - is final for StoreKit too. */
      this.forget(rec.token); await this.finish(rec.token);
      throw e;
    }
    this.forget(rec.token);
    await this.finish(rec.token);
    if (out.access) store.set('nabu-access', out.access);
    if (out.subs) store.set('nabu-subs', out.subs);
    return out;
  },

  /* Buy one thing. opt.wid: the wedding room it pays for. opt.oldKey is Play's
     business - the App Store moves a subscription within its group by itself,
     so buying Pro while holding Plus is simply buying Pro. */
  async buy(key, opt) {
    opt = opt || {};
    const it = playItem(key);
    if (this.buying) throw new Error('busy');
    if (!this.can()) throw new Error('nostore');
    if (!BE.enabled || !BE.user) throw new Error('signin');
    if (!it || !it.sku || !this.details[it.sku]) throw new Error('noproduct');
    const shownAt = Date.now();
    this.seq++; this.buying = key; this.buyingSeq = this.seq;
    let tx;
    try {
      /* Watched. Buying something this Apple account already holds ends in
         Apple's own "You are currently subscribed to this" alert, and the
         promise behind it never settles: the sheet is gone, the account is
         unchanged, and the button sits on "Working..." until the app is
         closed - which is exactly what the owner photographed. The wait is
         long enough for a slow payment and short enough to hand the button
         back; whatever was really bought is picked up by restore(), which
         runs on the way out of the failure. */
      tx = await withTimeout(this.service.purchaseProduct({
        productIdentifier: it.sku, productType: it.kind === 'subs' ? 'subs' : 'inapp', quantity: 1,
        appAccountToken: await appleAccountToken(BE.user.uid), autoAcknowledgePurchases: false
      }), this.sheetMs);
    } catch (e) {
      const msg = String((e && e.message) || e || '');
      this.buying = ''; this.buyingSeq = 0;
      /* Ask to Buy: nothing is charged until somebody approves, and the approval arrives through listen(). */
      if (/pending/i.test(msg)) { this.lastSheet = { outcome: 'done', name: 'Pending', ms: Date.now() - shownAt }; return { pending: true }; }
      /* Before blaming the buyer: the App Store may have refused because this
         Apple account already holds the thing. If it does, and it is this
         Nabu account's, restore opens it and the purchase was a success after
         all. Never allowed to throw over the original failure. */
      try { await this.restore(); } catch (e2) { /* the failure below stands */ }
      const got = it.opens.length && it.opens.every((k) => ACCESS.has(k));
      if (got) { this.lastSheet = { outcome: 'done', name: 'Restored', ms: Date.now() - shownAt }; return { opened: it.opens }; }
      const hung = /timeout|timed out/i.test(msg);
      const err = new Error(msg || 'failed');
      err.outcome = /cancel/i.test(msg) ? 'aborted' : hung ? 'hung' : 'failed';
      err.playName = /cancel/i.test(msg) ? 'UserCancelled' : hung ? 'SheetHung' : 'StoreKitError';
      this.lastSheet = { outcome: err.outcome, name: err.playName, ms: Date.now() - shownAt };
      throw err;
    }
    this.buying = ''; this.buyingSeq = 0;
    this.lastSheet = { outcome: 'done', name: '-', ms: Date.now() - shownAt };
    if (!tx || !tx.transactionId) throw new Error('nopurchase');
    const out = await this.settle({ sku: tx.productIdentifier || it.sku, token: String(tx.transactionId), at: Date.now(), wid: opt.wid || undefined });
    await this.sync();
    return { opened: out.opened || it.opens };
  },

  /* Everything this Apple account currently holds, and every transaction this
     phone is still waiting on, sent to the worker again. Safe to repeat: the
     worker answers a repeat with what it already did. */
  async restore() {
    const out = { tried: 0, opened: 0, pending: 0, failed: 0 };
    await this.start();
    const P = this.service || applePlugin();
    if (!P || !BE.enabled || !BE.user) return out;
    const held = await withTimeout(P.getPurchases({ onlyCurrentEntitlements: true }), this.detailsMs).catch(() => ({ purchases: [] }));
    const mine = (await appleAccountToken(BE.user.uid)).toLowerCase();
    const byToken = {};
    ((held && held.purchases) || []).forEach((t) => {
      /* Only what this Nabu account bought. StoreKit writes the token in capitals; a purchase with none
         (an offer code redeemed in the App Store) is sent too, and the worker's ledger decides. */
      const tok = String(t.appAccountToken || '').toLowerCase();
      if (t.transactionId && (!tok || tok === mine)) byToken[String(t.transactionId)] = { sku: t.productIdentifier, token: String(t.transactionId) };
    });
    this.pendingList().forEach((p) => { if (p.token) byToken[p.token] = Object.assign({}, byToken[p.token], p); });
    for (const token of Object.keys(byToken)) {
      const p = byToken[token], it = playItemBySku(p.sku);
      if (!it) continue;
      out.tried++;
      let wid = p.wid;
      try {
        if (it.key === 'wedding' && !wid) wid = await this.resolveWeddingWid();
        if (it.key === 'wedding' && !wid) throw new Error('noroom');
        await this.settle(Object.assign({}, p, { token: token, wid: wid || undefined }));
        out.opened++;
      } catch (e) {
        const msg = String((e && e.message) || '');
        if (msg !== 'offline' && msg !== 'noroom') continue;   // a final answer: settle() has already let it go
        const tries = (p.tries || 0) + 1;
        if (tries >= APPLE_GIVE_UP) { this.forget(token); out.failed++; this.flagStuck(p); }
        else this.remember(Object.assign({}, p, { token: token, tries: tries }));
      }
    }
    try { await BE.pullProfile(); } catch (e) { /* offline: the account is read next time */ }
    return out;
  },
  sync() { return this.restore().catch(() => null); },

  /* Apple's own page for the subscriptions on this Apple account. */
  manage() { const P = this.service || applePlugin(); if (P && typeof P.manageSubscriptions === 'function') return P.manageSubscriptions().catch(() => {}); return Promise.resolve(); },

  diag(key) {
    const it = key ? playItem(key) : null;
    const rows = [['web', String(window.APP_VERSION || '?')], ['shell', 'ios'], ['store', 'appstore'],
      ['plugin', applePlugin() ? 'yes' : 'no'], ['user', (typeof BE !== 'undefined' && BE.user) ? 'yes' : 'no'],
      ['state', this.state], ['why', this.why || '-'], ['stage', this.stage || '-'],
      ['priced', this.priced() + '/' + this.sellable()], ['ms', String(this.tookMs || 0)], ['tries', String(this.tries)], ['try', String(this.attempt)],
      ['waiting', String(this.pendingList().length)]];
    if (it) rows.push(['sku', String(it.sku)]);
    if (this.lastSheet) rows.push(['sheet', this.lastSheet.outcome + '/' + this.lastSheet.name + '/' + this.lastSheet.ms + 'ms']);
    rows.push(['at', new Date().toISOString().replace(/\.\d+Z$/, 'Z')]);
    return rows.map((r) => r[0] + '=' + r[1]).join(' ');
  }
};

/* Play's BILL exactly as billing.js built it, kept whole, so the one object
   every screen holds can be pointed at either store - the iPhone app points
   it at the App Store before anything is drawn, and the suite points it back
   and forth to check both. */
const BILL_PLAY = Object.assign({}, BILL);
function billUse(which) {
  Object.keys(BILL).forEach((k) => { delete BILL[k]; });
  Object.assign(BILL, BILL_PLAY, { details: {}, state: 'idle', service: null, starting: null, ready: false, why: '', tries: 0, attempt: 0, lastSheet: null, buying: '' });
  if (which === 'apple') Object.assign(BILL, APPLE_BILL, { details: {}, state: 'idle', service: null, starting: null, listening: false, why: '', tries: 0, attempt: 0, lastSheet: null, buying: '' });
  return BILL;
}
if (typeof window !== 'undefined' && isIOSApp()) billUse('apple');
