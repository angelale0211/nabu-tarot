/* ======================= levels, coins and vouchers =======================
   Caring for a companion earns it experience, and experience earns the person
   something real: Nabu coins, which come off the price of anything sold here,
   and a voucher that grows with the highest level reached.

   One coin is worth one đồng. Coins are earned slowly and never expire, so
   they can be saved for a course or spent on a single reading; using them is
   always a choice, offered at the moment of ordering and never automatic.

   Everything is kept on the device. Nothing is deducted until an order is
   actually sent, and coins put into an order can be taken back if the order
   never happens. */

/* Ten levels. The numbers are cumulative experience. */
const PET_STEPS = [0, 120, 320, 640, 1100, 1750, 2600, 3700, 5100, 6800];
/* The most a companion can learn in one day, whoever is feeding it. */
const PET_DAY_XP = 400;
const PET_MAXLV = PET_STEPS.length;
function petLevel(xp) {
  const x = Math.max(0, Number(xp) || 0);
  let lv = 1;
  for (let i = 0; i < PET_STEPS.length; i++) if (x >= PET_STEPS[i]) lv = i + 1;
  return lv;
}
/* Where the bar stands between this level and the next. */
function petStep(xp) {
  const x = Math.max(0, Number(xp) || 0), lv = petLevel(x);
  if (lv >= PET_MAXLV) return { lv: lv, into: 1, need: 0, at: 100 };
  const from = PET_STEPS[lv - 1], to = PET_STEPS[lv];
  return { lv: lv, into: x - from, need: to - from, at: Math.round((x - from) / (to - from) * 100) };
}

/* The vouchers the levels unlock, kept in order. */
/* The last two are held for Plus: reaching level seven without it still
   counts, but the voucher stays at ten per cent until Plus is on. */
const VOUCHERS = [
  { lv: 3, pct: 5 },
  { lv: 5, pct: 10 },
  { lv: 7, pct: 15, pro: true },
  { lv: 10, pct: 20, pro: true }
];
/* What a level-up pays into the purse. */
const levelCoins = (lv) => lv * 200;
/* The purse is kept on the device, where anyone can edit it. The app cannot
   prevent that, so it caps what a single order may claim: never more than
   half the price, and never more than this. Nabu still sees every order
   before honouring it. */
const COIN_MAX_PER_ORDER = 100000;

const BANK = {
  coins() { return Math.max(0, Math.round(Number(store.get('nabu-coins', 0)) || 0)); },
  put(n) { store.set('nabu-coins', Math.max(0, Math.round(n))); },
  earn(n) { if (n > 0) this.put(this.coins() + n); },
  /* Feeding pays a few coins, but only up to a point each day, so the purse
     grows by coming back for a long time rather than by tapping all evening. */
  /* Plus fills the purse twice as fast, on top of levelling twice as fast. */
  get dayCap() { return proOn() ? 40 : 20; },
  earnDay(n) {
    const rec = store.get('nabu-coin-day', null) || {}, today = isoDate(new Date());
    const used = rec.d === today ? (Number(rec.n) || 0) : 0;
    const give = Math.max(0, Math.min(Math.round(n), this.dayCap - used));
    if (give) { this.earn(give); store.set('nabu-coin-day', { d: today, n: used + give }); }
    return give;
  },
  spend(n) { const take = Math.min(this.coins(), Math.max(0, Math.round(n))); this.put(this.coins() - take); return take; },
  /* The highest level any companion has ever reached, which is what the
     voucher is based on. It never goes down, even if a companion is let go. */
  best() { return Math.max(1, Number(store.get('nabu-luck-best', 1)) || 1); },
  mark(lv) { if (lv > this.best()) store.set('nabu-luck-best', lv); },
  tier() { let out = null; VOUCHERS.forEach((v) => { if (BANK.best() >= v.lv && (!v.pro || proOn())) out = v; }); return out; },
  next() { let out = null; VOUCHERS.slice().reverse().forEach((v) => { if (BANK.best() < v.lv || (v.pro && !proOn())) out = v; }); return out; },
  /* Coins put into an order that has been sent but not yet answered. */
  holds() { const a = store.get('nabu-luck-hold', []); return Array.isArray(a) ? a : []; },
  hold(rec) { const a = this.holds(); a.unshift(rec); store.set('nabu-luck-hold', a.slice(0, 12)); },
  release(at) {
    const a = this.holds(), keep = a.filter((r) => r.at !== at), gone = a.filter((r) => r.at === at)[0];
    if (!gone) return 0;
    store.set('nabu-luck-hold', keep); this.earn(Number(gone.coins) || 0);
    return Number(gone.coins) || 0;
  }
};

/* ---- what an order costs after the person's own rewards ----
   The shop's own sale has already been taken off the price before this runs,
   so the voucher comes off the sale price and the coins come off last. */
function luckCut(total, use) {
  const base = Math.max(0, Math.round(Number(total) || 0));
  const tier = BANK.tier();
  const pct = (use && use.v && tier) ? tier.pct : 0;
  const pctOff = pct ? Math.round(base * pct / 100 / 1000) * 1000 : 0;
  const afterPct = Math.max(0, base - pctOff);
  const ceiling = Math.min(COIN_MAX_PER_ORDER, Math.floor(base / 2));
  const coins = Math.min(Math.max(0, Math.round((use && use.c) || 0)), BANK.coins(), afterPct, ceiling);
  return { pct: pct, pctOff: pctOff, coins: coins, final: Math.max(0, afterPct - coins), cap: ceiling };
}
/* The lines added to the message that is sent to Nabu. */
function luckLines(cut) {
  const S = T();
  let s = '';
  if (cut.pctOff) s += '\n🎟️ ' + S.luckVoucherOf(cut.pct) + ': -' + fmtPrice(cut.pctOff);
  if (cut.coins) s += '\n🪙 ' + S.luckCoinsUsed(fmtNum(cut.coins)) + ': -' + fmtPrice(cut.coins);
  return s;
}

/* ---- the panel offered at the moment of ordering ----
   Nothing is ticked to begin with: spending a reward is always a decision,
   and the panel says plainly that saved coins keep for later. */
function rewardPanelHTML(total, use) {
  const S = T(), tier = BANK.tier(), have = BANK.coins();
  if (!tier && have < 1000) return '';
  const cut = luckCut(total, use);
  const afterPct = Math.max(0, Math.round(total) - cut.pctOff);
  const steps = [1000, 5000, 10000, 20000].filter((n) => n <= Math.min(have, afterPct));
  return '<div class="card luckpanel"><h3 style="margin-bottom:4px">🪙 ' + esc(S.luckTitle) + '</h3>'
    + '<p class="hint" style="margin-bottom:10px">' + esc(S.luckHint) + '</p>'
    + (tier ? '<label class="lk-row"><input type="checkbox" id="luckv"' + (use.v ? ' checked' : '') + '><span>' + esc(S.luckVoucherOf(tier.pct)) + '</span><b>-' + fmtPrice(cut.pctOff) + '</b></label>' : '')
    + '<div class="lk-row"><span>' + esc(S.luckHave(fmtNum(have))) + '</span><b>' + (cut.coins ? '-' + fmtPrice(cut.coins) : fmtPrice(0)) + '</b></div>'
    + (have >= 1000 && afterPct > 0
      ? '<div class="chips lkchips"><button type="button" class="chip' + (!use.c ? ' on' : '') + '" data-coin="0">' + esc(S.luckKeep) + '</button>'
        + steps.map((n) => '<button type="button" class="chip' + (use.c === n ? ' on' : '') + '" data-coin="' + n + '">' + fmtNum(n) + '</button>').join('')
        + '<button type="button" class="chip' + (use.c === -1 ? ' on' : '') + '" data-coin="-1">' + esc(S.luckAll) + '</button></div>'
      : '<p class="hint">' + esc(S.luckSaveUp) + '</p>')
    + '</div>';
}
function bindRewardPanel(root, use, redraw) {
  const v = $('#luckv', root);
  if (v) v.addEventListener('change', () => { use.v = v.checked; redraw(); });
  $$('[data-coin]', root).forEach((b) => b.addEventListener('click', () => {
    const n = Number(b.getAttribute('data-coin'));
    use.c = n === -1 ? -1 : n;
    redraw();
  }));
}
/* -1 means "all of them", worked out against whatever the total is now. */
function luckWanted(use, total) {
  if (!use || !use.c) return 0;
  if (use.c === -1) return Math.min(BANK.coins(), Math.max(0, Math.round(total)));
  return use.c;
}
/* Called once the order has actually been sent. */
function luckCommit(cut, what) {
  if (!cut.coins) return;
  BANK.spend(cut.coins);
  BANK.hold({ at: Date.now(), coins: cut.coins, what: what || '' });
}

/* ---- the rewards screen ---- */
function renderRewards() {
  const S = T(), m = $('#main');
  const draw = () => {
    const tier = BANK.tier(), next = BANK.next(), best = BANK.best(), holds = BANK.holds();
    m.innerHTML = '<div class="eyebrow">' + esc(CONFIG.brand) + '</div><h1 style="margin-bottom:6px">🪙 ' + esc(S.luckTitle) + '</h1>'
      + '<p class="muted">' + esc(S.luckIntro) + '</p>'
      + '<div class="card coinbox"><span class="n">' + fmtNum(BANK.coins()) + '</span><span class="u">' + esc(S.luckCoins) + '</span>'
      + '<p class="hint">' + esc(S.luckWorth(fmtPrice(BANK.coins()))) + '</p></div>'
      + '<div class="card"><h3 style="margin-bottom:8px">🎟️ ' + esc(S.luckVoucher) + '</h3>'
      + '<p class="hint" style="margin-bottom:10px">' + esc(S.luckVoucherHint) + '</p>'
      + '<ul class="vlist">' + VOUCHERS.map((v) => { const open = best >= v.lv && (!v.pro || proOn()); return '<li class="' + (open ? 'on' : '') + '"><span>' + esc(S.luckAtLevel(v.lv)) + (v.pro ? ' · ✨ ' + esc(S.plusName) : '') + '</span><b>' + (open ? '✓ ' : '🔒 ') + '-' + v.pct + '%</b></li>'; }).join('') + '</ul>'
      + (next ? '<p class="hint">' + esc(S.luckNextTier(next.lv, next.pct)) + '</p>' : '<p class="hint ok">' + esc(S.luckTopTier) + '</p>')
      + '</div>'
      + '<div class="card"><h3 style="margin-bottom:8px">' + esc(S.luckEarnTitle) + '</h3><ul class="carelist">'
      + '<li><span>' + esc(S.luckEarnFeed) + '</span><b>+2</b></li>'
      + '<li><span>' + esc(S.luckEarnGood) + '</span><b>+5</b></li>'
      + '<li><span>' + esc(S.luckEarnPlay) + '</span><b>+3</b></li>'
      + '<li><span>' + esc(S.luckEarnLevel) + '</span><b>+200 × ' + esc(S.luckLevelWord) + '</b></li>'
      + '</ul><p class="hint">' + esc(S.luckEarnNote(BANK.dayCap)) + '</p>'
      + '<p class="hint">' + esc(S.luckPaceNote) + '</p></div>'
      + (holds.length
        ? '<div class="card"><h3 style="margin-bottom:8px">' + esc(S.luckHoldTitle) + '</h3><ul class="holds">'
          + holds.map((r) => '<li><span>' + esc(fmtDate(isoDate(new Date(r.at)))) + ' · ' + esc(r.what || '') + '</span><b>' + fmtNum(r.coins) + '</b><button type="button" class="btn tiny" data-back="' + r.at + '">' + esc(S.luckTakeBack) + '</button></li>').join('')
          + '</ul><p class="hint">' + esc(S.luckHoldHint) + '</p></div>'
        : '')
      + '<p style="margin-top:14px"><a class="backlink" href="#/play/pet">← ' + esc(S.petBack) + '</a></p>';
    $$('[data-back]', m).forEach((b) => b.addEventListener('click', () => {
      const n = BANK.release(Number(b.getAttribute('data-back')));
      if (n) toast(S.luckGaveBack(fmtNum(n)));
      draw();
    }));
  };
  draw();
}
ROUTES.rewards = { nav: '', render: renderRewards };
