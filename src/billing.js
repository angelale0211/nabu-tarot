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
const PLAY_PENDING_MAX = 50;  // a hard ceiling; PLAY_GIVE_UP below is what actually retires a stuck row
const PLAY_GIVE_UP = 8;       // tries before a row that keeps failing for a reason other than "already used" is surfaced and dropped

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
  /* A token that has not yet been accepted by the worker is never silently
     dropped to make room. The cap is a last resort - the real way this list
     shrinks is give-up, in restore(), which is never silent - so if it is
     ever reached, the rows nearest giving up anyway (the most tries so far)
     are the ones dropped, never a token still on its first try. */
  remember(rec) {
    const list = this.pendingList().filter((p) => p.token !== rec.token).concat([rec]);
    /* Ascending, so the tail truncated away is the rows nearest giving up
       (the most tries so far) - never a token still on its first try. Sorting
       the other way and cutting the tail evicted exactly the freshest,
       never-yet-verified purchases: the one thing this cap must not do. */
    if (list.length > PLAY_PENDING_MAX) { list.sort((a, b) => (a.tries || 0) - (b.tries || 0)); list.length = PLAY_PENDING_MAX; }
    store.set(PLAY_PENDING, list);
  },
  forget(token) { store.set(PLAY_PENDING, this.pendingList().filter((p) => p.token !== token)); },
  /* One purchase, one id, for the life of that purchase. A row rediscovered
     from Play's own list has no `at` - only a row this phone remembered
     itself ever had one - so keying on `rec.at || Date.now()` gave every
     give-up a brand new id, and an unresolvable wedding token raised a fresh
     alert every eight restore cycles for ever. The token is what identifies
     the purchase, but it must never be repeated in an alert, so it is folded
     to a short number that cannot be read back. */
  stuckKey(rec) {
    const s = String((rec && rec.token) || '');
    let h = 0;
    for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    return s ? (h >>> 0).toString(36) : 'x';
  },
  /* A row that could not be resolved after every bounded retry, said once,
     without ever repeating the token it cost. */
  flagStuck(rec) {
    if (typeof ALERTS === 'undefined') return;
    ALERTS.add({ id: 'billstuck-' + (rec.sku || 'x') + '-' + this.stuckKey(rec), k: 'app', t: T().buyFailed, b: '', href: '#/me' });
  },
  /* A wedding is paid for a room, but Play only ever knows the sku, never
     which room - the room's id lives only in the wid this phone carried at
     the moment of paying. If that is lost (a reinstall, cleared storage, the
     pending list evicted), the room can still be found: it was made before it
     was paid for, so the signed-in buyer is already a member of it. Guessed
     only when there is exactly one unpaid room to guess - none or several and
     this returns '', which is "do not guess", not "pick one". */
  async resolveWeddingWid() {
    if (!BE.db || !BE.user) return '';
    try {
      const s = await BE.db.collection('weddings').where('uids', 'array-contains', BE.user.uid).get();
      const rooms = (s.docs || []).map((d) => Object.assign({ id: d.id }, d.data())).filter((w) => !w.paid);
      return rooms.length === 1 ? rooms[0].id : '';
    } catch (e) { return ''; }
  },

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
         its own token; the token is what listPurchases hands back. If the
         account is currently holding the old plan but Play cannot produce its
         token, buying a new one anyway would double-bill silently - a lapsed
         or already-expired old plan is the only case safe to proceed as a
         plain new purchase. */
      const old = playItem(opt.oldKey), held = await this.service.listPurchases().catch(() => []);
      const row = (held || []).filter((p) => old && p.itemId === old.sku)[0];
      if (row) { data.oldSku = old.sku; data.purchaseToken = row.purchaseToken; }
      else if ((SUBS.of(opt.oldKey) || {}).grant) throw new Error('oldmissing');
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
    /* A wedding is used up the moment it is granted - one room, one payment -
       so it is consumed rather than left for Play to keep handing back
       forever, which is what would make a later restore() unable to tell a
       done purchase from a stuck one. */
    if (it.key === 'wedding' && this.service && typeof this.service.consume === 'function') { try { await this.service.consume(token); } catch (e) { /* best effort */ } }
    /* The worker's own answer is written first and unconditionally - it is
       the one place that knows what was just bought - then sync() reconciles
       everything else Play or the account may also be holding. sync() never
       throws, so nothing here is lost if that reconciliation cannot reach the
       network right now. */
    if (out.access) store.set('nabu-access', out.access);
    if (out.subs) store.set('nabu-subs', out.subs);
    await this.sync();
    return { opened: out.opened || it.opens };
  },

  /* Everything Play says this Google account holds, plus everything this
     phone is still waiting on, sent to the worker again. Safe to repeat: the
     worker answers a repeat with what it already did. A row that keeps
     failing for a reason that is not "already used" is retried a bounded
     number of times and then given up on out loud - never forever, and never
     silently. */
  async restore() {
    const out = { tried: 0, opened: 0, pending: 0, failed: 0 };
    await this.start();
    if (!this.can() || !BE.enabled || !BE.user) return out;
    const list = (await this.service.listPurchases().catch(() => [])) || [];
    /* Keyed by token so each purchase is looked at once. A pending record
       already knows more than Play's bare list - its wid, its tries so far -
       so it wins the merge rather than being shadowed by a fresh, empty-
       looking row that happens to carry the same token. */
    const byToken = {};
    list.forEach((p) => { if (p.purchaseToken) byToken[p.purchaseToken] = { sku: p.itemId, token: p.purchaseToken }; });
    this.pendingList().forEach((p) => { if (p.token) byToken[p.token] = Object.assign({}, byToken[p.token], p); });
    for (const token of Object.keys(byToken)) {
      const p = byToken[token], it = playItemBySku(p.sku);
      if (!it) continue;
      out.tried++;
      let wid = p.wid;
      try {
        /* Play never carries the room's id, only the sku, so a wedding token
           rediscovered with no wid has to be resolved before it is sent -
           never guessed. */
        if (it.key === 'wedding' && !wid) wid = await this.resolveWeddingWid();
        if (it.key === 'wedding' && !wid) throw new Error('noroom');
        const r = await this.verify(p.sku, token, wid ? { wid: wid } : undefined);
        if (r.pending) { out.pending++; }
        else {
          out.opened++;
          if (it.key === 'wedding' && this.service && typeof this.service.consume === 'function') { try { await this.service.consume(token); } catch (e2) { /* best effort */ } }
        }
      } catch (e) {
        const msg = String(e && e.message);
        if (msg === 'already used') { this.forget(token); continue; }
        const tries = (p.tries || 0) + 1;
        if (tries >= PLAY_GIVE_UP) { this.forget(token); out.failed++; this.flagStuck(p); }
        else this.remember(Object.assign({}, p, { token: token, tries: tries }));
      }
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
