/* ======================= buying inside the Android app =======================

   Google requires that digital things sold inside an Android app are sold
   through Play, and takes a share for it. A reading with Nabu is not a digital
   thing - it is an hour of somebody's time - so bookings are left alone and go
   on being arranged by message and paid by bank transfer, as they always were.
   What goes through Play is the courses and the unlocks.

   None of this exists in a browser. The Digital Goods API is only there inside
   the installed Android app, so BILL.can() is false on the web and every screen
   falls back to what it did before. That is not a limitation to work around: it
   is the reason the website can keep selling without paying a commission.

   The phone is never trusted about what it bought. It sends the token Play
   hands back to the worker, which asks Google directly and writes the access
   itself. A phone that says "I bought the Pro course" and shows no token gets
   nothing. */

const PLAY_METHOD = 'https://play.google.com/billing';

const BILL = {
  service: null,
  details: {},
  ready: false,

  /* Only inside the installed app, and only when Play answers. */
  can() { return !!(this.ready && this.service); },

  async start() {
    if (this.ready) return this.can();
    this.ready = true;
    try {
      if (!window.getDigitalGoodsService || !CONFIG.aiEndpoint) return false;
      this.service = await window.getDigitalGoodsService(PLAY_METHOD);
      const ids = COURSES.map((c) => c.id);
      const list = await this.service.getDetails(ids);
      (list || []).forEach((d) => { if (d && d.itemId) this.details[d.itemId] = d; });
      return true;
    } catch (e) {
      /* No Play, an older webview, or the product list is not published yet.
         Silence is right: on the web this is the normal case. */
      this.service = null;
      return false;
    }
  },

  /* What Play says it costs, in the buyer's own currency, or '' to fall back to
     the price written in the app. */
  priceOf(id) {
    const d = this.details[id];
    if (!d || !d.price) return '';
    try { return new Intl.NumberFormat(lang === 'vi' ? 'vi-VN' : (lang === 'de' ? 'de-DE' : 'en-GB'), { style: 'currency', currency: d.price.currency }).format(Number(d.price.value)); }
    catch (e) { return d.price.value + ' ' + d.price.currency; }
  },

  /* Buy one thing. Resolves with what was opened, or throws with a reason the
     caller can show. */
  async buy(id) {
    if (!this.can()) throw new Error('nostore');
    if (!BE.enabled || !BE.user) throw new Error('signin');
    if (!this.details[id]) throw new Error('noproduct');

    const req = new PaymentRequest([{ supportedMethods: PLAY_METHOD, data: { sku: id } }],
      { total: { label: L(courseById(id) ? courseById(id).name : id), amount: { currency: 'VND', value: '0' } } });
    const res = await req.show();
    /* The token is the only thing worth carrying out of here. */
    const token = res && res.details && (res.details.purchaseToken || res.details.token);
    try { await res.complete(token ? 'success' : 'fail'); } catch (e) { /* already closed */ }
    if (!token) throw new Error('nopurchase');

    const idTok = await BE.token();
    const r = await withTimeout(fetch(CONFIG.aiEndpoint.replace(/\/$/, '') + '/billing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + idTok },
      body: JSON.stringify({ sku: id, token: token })
    }), 30000);
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.ok) throw new Error(j.error || ('billing ' + r.status));

    /* The worker has already written it on the account. Pulling it down is what
       makes it true on this phone, rather than writing it here and hoping. */
    try { await BE.pullProfile(); } catch (e) { ACCESS.grant(j.opened || [id], (j.access || {})[id]); }
    return j.opened || [id];
  }
};

const courseById = (id) => COURSES.filter((c) => c.id === id)[0] || null;

/* Started once, early, so a course page can ask BILL.can() without waiting. */
if (typeof window !== 'undefined') {
  setTimeout(() => { try { BILL.start(); } catch (e) { /* never block the app */ } }, 1200);
}
