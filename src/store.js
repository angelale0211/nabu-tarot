/* ======================= the store inside the Android app =======================
   #/unlock, when the app is the installed one. One row per thing Play sells,
   with Play's own price, and a button that opens Play's sheet. Nothing here
   asks for a transfer, an order or a code: inside the app, Play is the shop.
   The website's #/unlock (learn.js) is untouched. */

/* Google's grace period and paused states both read as "there is a payment
   problem to sort out" (stProblem); on hold is said in Play's own words
   (stHeld), which is a different sentence from a card being declined. */
const SUB_WORDS = {
  SUBSCRIPTION_STATE_ACTIVE: 'active', SUBSCRIPTION_STATE_CANCELED: 'ending', SUBSCRIPTION_STATE_IN_GRACE_PERIOD: 'problem',
  SUBSCRIPTION_STATE_ON_HOLD: 'held', SUBSCRIPTION_STATE_PAUSED: 'problem', SUBSCRIPTION_STATE_EXPIRED: 'expired'
};
/* One sentence about a held subscription, from Google's state. */
function subStateWord(row) {
  const S = T(), k = SUB_WORDS[row && row.state] || 'expired', d = row && row.until ? fmtDate(row.until) : '';
  if (k === 'active') return (row.autoRenew ? S.stRenews(d) : S.stEndsOn(d));
  if (k === 'ending') return S.stEndsOn(d);
  if (k === 'held') return S.stHeld;
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
    if (row && row.grant) foot = '<p class="hint st">✓ ' + esc(subStateWord(row)) + '</p><a class="btn block" href="' + manageURL(item.key) + '" target="_blank" rel="noopener">' + esc(S.stManage) + '</a>';
    else if (isPlus && proHeld) foot = '<p class="hint st">✓ ' + esc(S.stIncludedPro) + '</p>';
    else if (other && (SUBS.of(other) || {}).grant) foot = buyButtonHTML(item.key, S.stSwitchTo(name), { oldKey: other });
    else foot = (row && SUB_WORDS[row.state] === 'problem' ? '<p class="hint err">' + esc(S.stProblem) + '</p><a class="btn block" href="' + manageURL(item.key) + '" target="_blank" rel="noopener">' + esc(S.stManage) + '</a>' : '')
      + '<p class="hint">' + esc(S.stEveryMonths(months)) + '</p>' + buyButtonHTML(item.key, S.stSubscribe) + '<p class="hint">' + esc(S.stCancelMeaning) + '</p>';
  } else {
    foot = held ? '<p class="hint st">✓ ' + esc(S.stActive) + (ACCESS.get()[item.key] ? ' · ' + esc(S.unlockOpenUntil(fmtDate(ACCESS.get()[item.key]))) : '') + '</p>'
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
