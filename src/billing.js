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
const PLAY_CONNECT_MS = 10000;  // getDigitalGoodsService can stay pending for ever, and a Retry queued behind it would never run
const PLAY_DETAILS_MS = 15000;  // so can getDetails
const PLAY_BACKOFF = [0, 2000, 5000, 15000, 30000];  // between failed attempts, so a redraw loop cannot hammer Play

/* Names PaymentRequest.show() rejects with when the sheet never launched.
   Only AbortError is ever a person closing it, and even that is not certain:
   Chrome's Play bridge reuses AbortError for failures of its own. */
const SHEET_NOLAUNCH = /^(NotAllowedError|NotSupportedError|InvalidStateError|SecurityError|NotFoundError|NotReadableError|UnknownError)$/;

/* A name safe to put on a screen and paste into a chat: letters only, and a
   timeout of ours reported as `timeout` rather than the bare `Error` that
   withTimeout would otherwise contribute. Never the message, which can carry
   a url, an account or a price. */
const errName = (e) => {
  if (/timeout/i.test(String((e && e.message) || ''))) return 'timeout';
  const n = String((e && e.name) || '');
  return /^[A-Za-z]{1,40}$/.test(n) ? n : 'Error';
};

const BILL = {
  service: null, details: {}, starting: null, ready: false,

  /* Where the last attempt got to.

       idle      nothing tried yet
       starting  an attempt is running and everybody awaits the same promise
       ready     Play answered AND priced at least one product
       failed    it did not get there; `why` says where it stopped

     `ready` (the older boolean) stays beside it meaning only "an attempt has
     finished", because screens outside this file read it. */
  state: 'idle',
  /* Every attempt takes a number. An answer arriving after its attempt has
     been superseded - a slow connect landing behind a Retry, a getDetails
     resolving after we timed it out - writes nothing. Without this a stale
     answer could hand the screen a catalogue the buyer had already
     retried past, or reopen a failure they had just cleared. */
  attempt: 0,
  tries: 0, lastTryAt: 0, tookMs: 0,
  /* Fields rather than the constants themselves: the suite has to prove that a
     call which never answers is survivable, and it cannot spend ten seconds
     per case to do it. */
  connectMs: PLAY_CONNECT_MS, detailsMs: PLAY_DETAILS_MS,
  sheetWaitMs: 20000,  // how long a sheet may stay silent before the app asks Play whether it is really open
  stage: '',        // how far the last attempt got: 'connect', 'details', or ''
  buying: '',       // the key whose sheet is open, so a second tap cannot start another
  lastSheet: null,  // {outcome, name, ms} of the last show(), for the diagnostics

  /* Two questions that used to be one. can() is "Play answered and priced
     something", which decides whether a screen shows rows at all. canBuy(key)
     is "Play priced THIS product", which decides whether that one row gets a
     button. v211 asked only the first, so an empty or partial catalogue still
     drew Buy buttons for products Play had never heard of, and the tap threw
     `noproduct` into a status line nobody had a reason to be reading. */
  can() { return this.state === 'ready' && !!this.service; },
  canBuy(key) { return this.can() && !!this.detailsOf(key); },
  priced() { return Object.keys(this.details).length; },
  sellable() { return PLAY_ITEMS.filter((i) => i.sku).length; },

  /* Why the store could not open, in a few characters, for the screen to show.
     Three quite different failures used to arrive at the reader as one
     sentence - "no response from Google Play" - and the exception behind them
     was thrown away, so neither the reader, nor a tester, nor anybody reading
     their report could tell which had happened. A whole day went on guessing
     between them once. The codes:

       noapi            the Digital Goods API is not here at all - a browser,
                        or an installed app whose wrapper has no Play Billing
       connect:<name>   asking Play for the service threw. NotAllowedError
                        means the payment Permissions-Policy is blocking it
       details:<name>   Play was reached but refused to price the catalogue -
                        usually the account cannot see these products
       connect:timeout  Play never answered at all within PLAY_CONNECT_MS
       details:timeout  nor priced anything within PLAY_DETAILS_MS
       noproducts       Play answered with an empty list: the ids exist here
                        but not, for this account, over there
       error:<name>     anything else

     It is deliberately short and unexplained. A reader who is not looking for
     it sees a few grey characters; a tester can read it down a phone line. */
  why: '',

  /* One attempt at a time, and a finished failure is not a life sentence.

     v211 cached the promise for ever: once the first attempt failed - a Play
     service still waking up after a cold start is enough - every later start()
     handed back that same settled `false` and nothing ever reconnected. Only
     the Retry button cleared it, and Retry lives on the one card a screen in
     that state might not be showing. A failure is now retried on demand,
     behind a backoff so a redraw loop cannot hammer Play; `force`, which Retry
     passes, skips the wait.

     Both calls into Play are bounded. Either can stay pending for ever, and
     when they did, every caller awaiting start() - the Retry button among
     them - waited with them. */
  start(force) {
    if (this.state === 'starting' && this.starting) return this.starting;
    /* `force` is Retry, and Retry has to mean it even when we believe we are
       connected: a service that has gone away since answers can() true right
       up until the next call fails. */
    if (this.state === 'ready' && !force) return Promise.resolve(true);
    if (this.state === 'failed' && !force && Date.now() - this.lastTryAt < this.backoffMs()) return Promise.resolve(false);
    const my = ++this.attempt, began = Date.now();
    this.state = 'starting'; this.lastTryAt = began; this.stage = ''; this.why = '';
    this.starting = (async () => {
      const mine = () => my === this.attempt;
      try {
        if (!window.getDigitalGoodsService) { if (mine()) this.fail('noapi', '', began); return false; }
        if (!CONFIG.aiEndpoint) { if (mine()) this.fail('noendpoint', '', began); return false; }
        let svc;
        try { svc = await withTimeout(window.getDigitalGoodsService(PLAY_METHOD), this.connectMs); }
        catch (e) { if (mine()) this.fail('connect:' + errName(e), 'connect', began); return false; }
        if (!mine()) return false;
        let list;
        try { list = await withTimeout(svc.getDetails(PLAY_ITEMS.map((i) => i.sku).filter(Boolean)), this.detailsMs); }
        catch (e) { if (mine()) this.fail('details:' + errName(e), 'details', began); return false; }
        if (!mine()) return false;
        const got = {};
        (list || []).forEach((d) => { if (d && d.itemId) got[d.itemId] = d; });
        /* A service that priced nothing is not a shop. It used to answer true
           and leave can() true, so the screen drew a catalogue of buttons over
           an empty answer. The service is kept - restore() finds a purchase
           already made through it, and a catalogue we could not price is no
           reason to lose one - but the store says `noproducts` and offers
           Retry instead of selling what Play does not have. */
        this.service = svc;
        if (!Object.keys(got).length) { this.fail('noproducts', 'details', began); return false; }
        this.details = got; this.state = 'ready'; this.ready = true;
        this.tries = 0; this.stage = ''; this.why = ''; this.tookMs = Date.now() - began;
        return true;
      } catch (e) { if (mine()) this.fail('error:' + errName(e), this.stage, began); return false; }
    })();
    return this.starting;
  },
  backoffMs() { return PLAY_BACKOFF[Math.min(this.tries, PLAY_BACKOFF.length - 1)]; },
  fail(why, stage, began) {
    this.details = {}; this.state = 'failed'; this.ready = true;
    this.why = why; this.stage = stage || ''; this.tookMs = Date.now() - began; this.tries++;
    return false;
  },
  /* Play was silent, or the suite swapped the world under us. Retry never
     waits out the backoff and never runs beside another attempt: a second
     press joins the first rather than starting a competitor. */
  retry() { return this.start(true); },

  /* What a rejection from PaymentRequest.show() actually means.

     v212 decided this with a stopwatch: inside 900ms was "the sheet never
     opened", slower was "the buyer closed it". Both halves are wrong. A phone
     that takes a second and a half to fail to launch was read as a deliberate
     cancellation and answered with silence - exactly how this stayed invisible
     to three testers - and a buyer who dismissed the sheet at once was told
     the sheet had failed.

     The name carries the meaning. Only AbortError can be a person, and even
     that is not certain, so AbortError earns a short neutral line rather than
     silence or a false "payment failed". Elapsed time is still recorded, but
     as evidence in the diagnostics, never as the decision. */
  sheetOutcome(e) {
    const n = errName(e);
    if (SHEET_NOLAUNCH.test(n)) return 'nolaunch';
    if (n === 'AbortError') return 'aborted';
    return 'failed';
  },

  /* Which browser the wrapper is running in. A Trusted Web Activity opens in
     the phone's DEFAULT browser, invisibly, and only Chrome carries the Play
     Billing bridge. Samsung Internet names itself in the UA; Brave and others
     ship Chrome's UA verbatim, so 'chrome' is only ever answered from
     navigator.userAgentData.brands, never from the UA string. 'unknown' is an
     honest answer; a wrong 'chrome' misleads the next reader. */
  provider() {
    const ua = String((window.navigator || {}).userAgent || '');
    if (/SamsungBrowser\//.test(ua)) return 'samsung';
    const brands = ((window.navigator || {}).userAgentData || {}).brands || [];
    const names = brands.map((b) => String(b.brand || '')).join(' ');
    if (/Samsung/i.test(names)) return 'samsung';
    if (/Brave/i.test(names) || (window.navigator && typeof window.navigator.brave === 'object')) return 'brave';
    if (/Edge/i.test(names)) return 'edge';
    if (/Google Chrome/i.test(names)) return 'chrome';
    return 'unknown';
  },

  /* Everything a tester can safely send back, and nothing else: no purchase
     token, no id token, no email, no address. A diagnostic that cannot be
     pasted into a group chat is one nobody sends. */
  diag(key) {
    const ua = String((window.navigator || {}).userAgent || '');
    const it = key ? playItem(key) : null, d = it && this.detailsOf(key);
    const rows = [['web', String(window.APP_VERSION || '?')],
      ['shell', isTWA() ? 'twa' : (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser')],
      ['android', 'unavailable'],
      ['chrome', (/Chrome\/(\d+)/.exec(ua) || [])[1] || 'unknown'],
      ['browser', this.provider()],
      ['dga', window.getDigitalGoodsService ? 'yes' : 'no'],
      ['user', (typeof BE !== 'undefined' && BE.user) ? 'yes' : 'no'],
      ['state', this.state], ['why', this.why || '-'], ['stage', this.stage || '-'],
      ['priced', this.priced() + '/' + this.sellable()],
      ['ms', String(this.tookMs || 0)], ['tries', String(this.tries)], ['try', String(this.attempt)]];
    if (it) rows.push(['sku', String(it.sku)], ['plan', String((d && d.subscriptionPeriod) || '-')]);
    if (this.lastSheet) rows.push(['sheet', this.lastSheet.outcome + '/' + this.lastSheet.name + '/' + this.lastSheet.ms + 'ms']);
    rows.push(['at', new Date().toISOString().replace(/\.\d+Z$/, 'Z')]);
    return rows.map((r) => r[0] + '=' + r[1]).join(' ');
  },

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
    /* One sheet at a time. A second tap while Play's sheet is open used to
       build a second PaymentRequest; Chrome rejects that with InvalidStateError,
       which the screen then reported as a failure of the purchase the buyer
       was in the middle of making. Refused here instead, by name, and never by
       reopening anything. */
    if (this.buying) throw new Error('busy');
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
      /* Bounded, like connect and details: on 2026-09-09 this call was watched
         hanging for 25 s on an emulator, which left the button disabled and
         the screen silent. A hung answer is treated as "no token" - the
         branch below already refuses to double-bill on that. */
      const old = playItem(opt.oldKey), held = await withTimeout(this.service.listPurchases(), this.detailsMs).catch(() => []);
      const row = (held || []).filter((p) => old && p.itemId === old.sku)[0];
      if (row) { data.oldSku = old.sku; data.purchaseToken = row.purchaseToken; }
      else if ((SUBS.of(opt.oldKey) || {}).grant) throw new Error('oldmissing');
    }
    const req = new PaymentRequest([{ supportedMethods: PLAY_METHOD, data: data }],
      { total: { label: L((courseOf(key) || { name: { vi: key, en: key } }).name), amount: { currency: 'VND', value: '0' } } });
    /* The rejection is classified by name, not by stopwatch, and what came
       back is kept for the diagnostics: on 2026-09-09 a tester tapped Buy, got
       no sheet, no message and nothing to report, and there was no record of
       what Play had actually said. */
    const shownAt = Date.now();
    this.buying = key;
    /* A sheet that never answers (H7, 2026-09-09): show() can stay pending
       with no sheet on a phone where Play never answers, and the button then
       stays disabled while the diagnostic line looks healthy. On the emulator
       a pending show() turned out to be an open sheet, which is why abort is
       asked before anything is concluded. After sheetWaitMs the app asks Play
       to abort. If Play agrees
       the request was never under way: the buyer is told and gets the button
       back. If Play refuses, a sheet IS open: the buyer is told, `buying`
       stays set so nothing can start a second purchase, and a late answer is
       still completed and remembered for restore(). Never a plain timeout. */
    let hung = '';
    const showP = req.show();
    /* Only ever read through the Promise.race below, so a guard left pending once show() has answered is awaited by nobody and costs nothing. */
    let wd = 0;
    const guard = new Promise((resolve) => { wd = setTimeout(async () => {
      try { await req.abort(); hung = 'hung'; } catch (e2) { hung = 'waiting'; }
      resolve('__guard');
    }, this.sheetWaitMs); });
    showP.then((late) => {
      clearTimeout(wd);
      if (hung !== 'waiting') return;
      this.buying = '';
      const tok = late && late.details && (late.details.purchaseToken || late.details.token);
      try { late.complete(tok ? 'success' : 'fail').catch(() => {}); } catch (e3) { /* closed */ }
      if (tok) this.remember(Object.assign({ sku: it.sku, token: tok, at: Date.now() }, opt.wid ? { wid: opt.wid } : {}));
    }, () => { clearTimeout(wd); if (hung === 'waiting') this.buying = ''; });
    let res;
    try {
      res = await Promise.race([showP, guard]);
      if (res === '__guard') { const e = new Error(hung); e.name = 'TimeoutError'; throw e; }
    } catch (e) {
      e.stage = 'show'; e.playName = errName(e); e.elapsedMs = Date.now() - shownAt;
      e.outcome = hung || this.sheetOutcome(e);
      this.lastSheet = { outcome: e.outcome, name: e.playName, ms: e.elapsedMs };
      throw e;
    } finally { if (hung !== 'waiting') this.buying = ''; }
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
    /* `service`, not can(). A purchase already made must still be recoverable
       when the catalogue came back empty or unpriced - that is exactly the
       state a stuck buyer is in, and refusing to look would strand the very
       token restore() exists to redeem. */
    if (!this.service || !BE.enabled || !BE.user) return out;
    const list = (await withTimeout(this.service.listPurchases(), this.detailsMs).catch(() => [])) || [];
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
