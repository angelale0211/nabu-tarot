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
/* Every screen that sells anything comes through here, so this is where
   "Play priced this one" is asked. A row whose product Play did not return
   says so where its button was, rather than offering a button that can only
   throw `noproduct` when it is pressed. Partial catalogues therefore keep
   working: the products Play did price stay buyable. */
const buyButtonHTML = (key, label, opt) => (BILL.canBuy(key)
  ? '<button type="button" class="btn primary block" data-buy="' + key + '"' + (opt && opt.oldKey ? ' data-old="' + opt.oldKey + '"' : '') + (opt && opt.wid ? ' data-wid="' + esc(opt.wid) + '"' : '') + '>' + esc(label || T().stBuy) + '</button>'
  : '<p class="hint err" data-off="' + key + '">' + esc(T().stItemOff) + (BILL.why ? ' (' + esc(BILL.why) + ')' : '') + '</p>');

/* Only what a tester can safely send: BILL.diag() carries no token, no
   account and no address. Selectable as well as copyable, because a phone
   that refuses the clipboard is exactly the kind of phone reporting a fault. */
const storeDiagHTML = (key) => '<details class="card billdiag"><summary>' + esc(T().stDiagTitle) + '</summary>'
  + '<p class="hint" style="user-select:all;word-break:break-all;margin:8px 0;font-size:12px">' + esc(BILL.diag(key || '')) + '</p>'
  + '<button type="button" class="btn block" data-diag="' + esc(key || '') + '">' + esc(T().stDiagCopy) + '</button>'
  + '<p class="hint" data-diagst></p></details>';
/* The reason is shown, not swallowed. `stNotReady` covers three different
   failures, and without the code beneath it a report of "it does not work"
   cannot be told apart from any other. Small, grey and selectable: a reader
   passes over it, a tester can read it out or copy it. */
const storeNotReadyHTML = () => '<div class="card">'
  /* Keyed on what the app can prove, not on a browser sniff: inside the
     installed app, no Play bridge at all means the wrapper opened in a
     browser that does not carry one. The browser is only named when it can
     actually be recognised - Brave ships Chrome's UA verbatim. */
  + (isTWA() && BILL.why === 'noapi' ? '<p class="hint err" style="margin-bottom:10px">' + esc(T().stNeedChrome({ samsung: 'Samsung Internet', brave: 'Brave', edge: 'Microsoft Edge' }[BILL.provider()] || '')) + '</p>' : '')
  + '<p class="hint">' + esc(T().stNotReady) + '</p><button type="button" class="btn block" data-retry>' + esc(T().stRetry) + '</button>'
  + (BILL.why ? '<p class="hint" style="margin-top:8px;opacity:.6;font-size:12px;user-select:all">' + esc(BILL.why) + '</p>' : '') + '</div>'
  /* The diagnostics have to be reachable from the one screen a stuck buyer
     actually sees. Putting them only on the working store meant the phones
     that needed them were the phones that could not open them. */
  + storeDiagHTML('');

function storeRowHTML(item) {
  /* priceText, not L alone: a sentence naming an amount carries it as a token
     ({save}, {wedfee}) because the saving is a different number in every
     currency. Without this the reader is shown the token itself - "{save} less
     than two half years" - which is how it reached a phone in the store. Every
     other screen that prints c.sum already does this. */
  const S = T(), c = courseOf(item.key), name = c ? L(c.name) : item.key, sum = c ? priceText(L(c.sum || c.blurb)) : '';
  const price = BILL.priceOf(item.key), months = BILL.periodMonths(item.key);
  const held = ACCESS.has(item.key) || (item.opens.length && item.opens.every((k) => ACCESS.has(k)));
  const row = item.kind === 'subs' ? SUBS.of(item.key) : null;
  let foot;
  if (item.kind === 'subs') {
    /* plus, pro6 and pro are one ladder: Pro opens everything Plus opens, so
       holding two of them at once is never anything but a double charge. The
       plan being replaced used to be looked for between pro6 and pro alone,
       so somebody holding Plus who subscribed to Pro was sold a SECOND
       subscription running beside the first - both renewing, for ever, with
       nothing on the screen saying so. It is whichever rung is actually held
       now. `manifest` is not on this ladder and is never replaced. */
    const TIER = ['plus', 'pro6', 'pro'];
    const proHeld = ACCESS.has('pro'), isPlus = item.key === 'plus';
    const other = TIER.indexOf(item.key) > -1
      ? (TIER.filter((k) => k !== item.key && (SUBS.of(k) || {}).grant)[0] || '')
      : '';
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

/* One row per distinct failure per session. diag() ends in a timestamp, so
   two lines are never equal and noteOops's own dedup never fires; the key
   here is the line without `at=`, without the counters, and without how long
   the sheet took - all of which change on their own between two readings of
   the very same failure. The sheet's own outcome and name are kept, because
   those are what make one failure a different failure from another. */
const BILL_FILED = {};
function fileBilling(line, where) {
  const key = where + '|' + line.replace(/ at=\S+/, '').replace(/ tries=\d+/, '').replace(/ try=\d+/, '').replace(/ ms=\d+/, '').replace(/ sheet=(\S+?)\/\d+ms/, ' sheet=$1');
  if (BILL_FILED[key]) return;
  BILL_FILED[key] = true;
  noteOops(line, where);
}

function bindStore(root, redraw) {
  const S = T();
  $$('[data-buy]', root).forEach((b) => b.addEventListener('click', async () => {
    const key = b.getAttribute('data-buy'), st = $('[data-st="' + key + '"]', root) || $('#bstatus', root);
    if (b.disabled) return;   // a second tap on a button already working starts nothing
    /* Signed out. The old line here said "this item can only be bought in the
       Nabu Tarot Android app" - to somebody inside the Android app - and left
       nothing under the button, so a signed-out tester reported "nothing
       happens" and the diagnostic line looked healthy. Say the actual reason,
       leave it where it can be read, then go to sign-in as before. */
    if (!(BE.enabled && BE.user)) {
      if (st) { st.className = 'hint st'; st.textContent = S.stSignInToBuy; }
      toast(S.stSignInToBuy); location.hash = signinHref(location.hash.slice(1)); return;
    }
    b.disabled = true; if (st) { st.className = 'hint st'; st.textContent = S.buyWorking; }
    try {
      const opt = {}; if (b.getAttribute('data-old')) opt.oldKey = b.getAttribute('data-old'); if (b.getAttribute('data-wid')) opt.wid = b.getAttribute('data-wid');
      const r = await BILL.buy(key, opt);
      if (r.pending) { if (st) st.textContent = S.stPending; return; }
      toast(S.unlocked); if (redraw) redraw(); else route();
    } catch (e) {
      const why = String((e && e.message) || '');
      /* 'offline' is not a failure and must never be said as one. It is
         thrown only after res.complete('success') and a real purchaseToken:
         Play has charged, the token is on the pending list, and restore()
         finishes it on the next app open. Saying "Mua chưa thành công" there
         is the app contradicting the receipt Google has already emailed, and
         it is what a buyer saw on 2026-09-09 for a subscription they really
         did hold. It is the pending wording, and not in the error colour. */
      const paidNotConfirmed = why === 'offline';
      /* Which of three answers is chosen by the name Play gave, never by how
         long the sheet took to fail. v212 used a stopwatch and read a slow
         launch failure as a deliberate cancellation, which it then answered
         with silence - the same silence that hid this from three testers.

         `nolaunch`  the sheet could not open. Said plainly, in the error colour.
         `aborted`   AbortError, which Chrome uses BOTH for a buyer who closed
                     the sheet and for several bridge failures of its own.
                     Nobody can tell those apart, so it gets a short neutral
                     line in the ordinary colour: it neither blames a buyer who
                     simply changed their mind nor hides a fault from one who
                     did not. Never silence.
         anything else is a failure and says so.

         Play's own word for it is appended, sanitized to a name, because a
         screenshot is the only place it is ever seen. */
      const out = e && e.outcome, busy = why === 'busy';
      /* Samsung Internet is the one browser known to load the catalogue and
         then fail the sheet, so an AbortError there is never the buyer
         changing their mind. The browser is the discriminator, not the clock. */
      const samsung = isTWA() && BILL.provider() === 'samsung' && (out === 'aborted' || out === 'nolaunch');
      const soft = paidNotConfirmed || (out === 'aborted' && !samsung) || busy || out === 'waiting';
      if (st) {
        st.className = 'hint st' + (soft ? '' : ' err');
        const said = why === 'signin' ? S.stSignInToBuy
          : busy ? S.stBusy
          : samsung ? S.stNeedChrome('Samsung Internet')
          : out === 'hung' ? S.stSheetHung
          : out === 'waiting' ? S.stSheetWaiting
          : paidNotConfirmed ? S.stPending
          : out === 'aborted' ? S.stAborted
          : out === 'nolaunch' ? S.stNoSheet
          : why === 'already used' ? S.buyAlready
          : why === 'nostore' ? S.stNotReady
          : why === 'noproduct' ? S.stItemOff
          : S.stFailed;
        const safe = (w) => String(w || '').replace(/[^A-Za-z0-9 :._-]/g, '').slice(0, 40);
        /* The message behind a watchdog ending IS the outcome, and printing
           both gives the reader `TimeoutError/hung/hung`, which reads like two
           different things went wrong. Say it once. */
        const wsafe = safe(why);
        const code = [(e && e.playName) || (e && e.name) || '', out || '', wsafe === (out || '') ? '' : wsafe].filter(Boolean).join('/');
        const showCode = !!said && why !== 'signin' && !busy;
        st.textContent = said + (showCode && code ? ' (' + code + ')' : '');
      }
      /* The line the screen shows is also filed where the owner can read it
         without asking anybody for a screenshot. errors/ is write-only for
         the phone and read in the dashboard; the message carries no token,
         account or address (BILL.diag), and the prefix lets the tab filter. */
      if (!(why === 'signin' || busy || paidNotConfirmed)) fileBilling('billing ' + BILL.diag(key), 'store');
    }
    /* Whatever happened. A success redraws the card, so this button is already
       gone from the document and must not be touched; every other path leaves
       it pressable again - except one: while Play says a sheet is still open
       (`buying` still set), the button stays locked, because nothing may start
       a second purchase beside a live one. */
    finally { if (b.isConnected && BILL.buying !== key) b.disabled = false; }
  }));
  /* An answer that lands after the app has stopped waiting has nobody to
     tell. On 2026-09-10 a buyer closed the sheet a minute after the waiting
     line appeared: the purchase ended correctly, and the screen sat there
     with a grey button and a line saying Play was still working until the app
     was opened again. Looked up in the live document, because the render this
     was bound to may be long gone; if the store is not on screen there is
     nothing to say and nothing to do. */
  BILL.onSettled = (key, sheet) => {
    const b = $('[data-buy="' + key + '"]'), st = $('[data-st="' + key + '"]'), S2 = T();
    if (!b || !b.isConnected) return;
    b.disabled = false;
    if (st) { st.className = 'hint st'; st.textContent = (sheet && sheet.outcome === 'done') ? S2.stRestoring : S2.stAborted; }
  };
  $$('[data-diag]', root).forEach((b) => b.addEventListener('click', async () => {
    const st = $('[data-diagst]', root);
    await copyText(BILL.diag(b.getAttribute('data-diag') || ''));
    if (st) st.textContent = S.stDiagCopied;
  }));
  /* Repeated presses join the attempt already running rather than starting a
     competitor - BILL.start() coalesces - and the button is released even when
     the attempt times out, so a stuck screen is never a dead one. */
  $$('[data-retry]', root).forEach((b) => b.addEventListener('click', async () => {
    if (b.disabled) return;
    b.disabled = true;
    try { await BILL.retry(); } finally { if (b.isConnected) b.disabled = false; }
    if (redraw) redraw(); else route();
  }));
  const rs = $('#restore', root);
  if (rs) rs.addEventListener('click', async () => {
    const st = $('#rstatus', root); rs.disabled = true; if (st) { st.className = 'hint'; st.textContent = S.stRestoring; }
    const out = await BILL.restore(); rs.disabled = false;
    /* The answer is written AFTER the redraw, not before it. redraw() rebuilds
       the whole card, so the #rstatus this handler started with is gone by the
       time anybody could read it: the button appeared to do nothing at all,
       which is what it looked like to the owner. A row that could not be
       resolved is also said out loud now - counting only `opened` and
       `pending` told somebody whose restore had just failed that there was
       nothing to restore. */
    const word = out.failed ? S.buyFailed
      : (out.opened || out.pending) ? S.stRestored(out.opened + out.pending)
      : S.stRestoreNone;
    if (redraw) redraw();
    const after = $('#rstatus', root);
    if (after) { after.className = out.failed ? 'hint err' : 'hint'; after.textContent = word; }
  });
}

function renderStore(params) {
  const S = T(), m = $('#main');
  const draw = async () => {
    await BILL.start();
    /* A phone whose store never opened has no button to fail on, and it is
       exactly the phone whose `why=` is worth reading. Filed on the way in,
       so the not-ready card the buyer sees arrives in the dashboard too. */
    if (!BILL.can()) fileBilling('billing ' + BILL.diag(''), 'store:start');
    const group = (keys) => '<div class="unlist">' + PLAY_ITEMS.filter((i) => keys.indexOf(i.key) > -1 && i.sku).map(storeRowHTML).join('') + '</div>';
    const from = (params && params.from) || '';
    const courses = '<div class="sec"><h2 style="margin-bottom:8px">' + esc(S.stCourses) + '</h2>' + group(['tarot', 'lenormand', 'playing']) + '</div>';
    const plans = '<div class="sec"><h2 style="margin-bottom:8px">' + esc(S.stPlans) + '</h2>' + group(['plus', 'pro6', 'pro', 'manifest']) + '</div>';
    m.innerHTML = '<div class="store"><div class="eyebrow">' + esc(CONFIG.brand) + '</div><h1 style="margin-bottom:6px">' + esc(S.stTitle) + '</h1><p class="muted">' + esc(S.stIntro) + '</p>'
      + (BILL.can() ? (from === 'app' ? plans + courses : courses + plans) : storeNotReadyHTML())
      + '<div class="card"><button type="button" class="btn block" id="restore">' + esc(S.stRestore) + '</button><p class="hint" id="rstatus"></p></div>'
      + (BILL.can() ? storeDiagHTML('') : '') + '</div>';
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
