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
