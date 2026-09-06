/* ============================ booking ============================
   Service and package, topic (required for "set topic" packages), a
   calendar of Nabu's free slots (schedule.json, minus slots taken in
   Firestore when accounts are on), details, then send. */
const book = { items: [], name: '', note: '', birth: '', birthTime: '', card: null, slot: null, month: null, day: null, timeSaved: false, restored: false };
/* The draft lives on the device: leave the screen, come back, everything is still chosen. */
const BOOK_KEYS = ['items', 'name', 'note', 'birth', 'birthTime', 'slot', 'day', 'timeSaved'];
function saveBook() { const o = {}; BOOK_KEYS.forEach((k) => { o[k] = book[k]; }); store.set('nabu-book', o); }
function restoreBook() { if (book.restored) return; book.restored = true; const o = store.get('nabu-book', null); if (!o) return; BOOK_KEYS.forEach((k) => { if (o[k] != null) book[k] = o[k]; }); if (!Array.isArray(book.items)) book.items = []; }
function clearBook() { book.items = []; book.slot = null; book.day = null; book.timeSaved = false; book.note = ''; book.card = null; store.set('nabu-book', null); }
let SCHEDULE = null, TAKEN = {};

async function loadSchedule() {
  const s = await loadContent('schedule', CONFIG.schedulePath, 'nabu-schedule');
  SCHEDULE = s.data || { slotMinutes: 60, weekly: {}, blocked: [], extra: {}, booked: [], leadDays: 1, horizonDays: 42 };
  if (BE.enabled) { await Promise.race([BE.initP || Promise.resolve(), new Promise((r) => setTimeout(r, 3000))]); if (BE.db) TAKEN = await BE.takenSlots(); }
  return SCHEDULE;
}
const slotKey = (dateStr, time) => dateStr + 'T' + time;
function slotsFor(dateStr) {
  const S = SCHEDULE; if (!S) return [];
  const d = new Date(dateStr + 'T00:00:00'), today = new Date(); today.setHours(0, 0, 0, 0);
  const lead = new Date(today); lead.setDate(lead.getDate() + (S.leadDays || 0));
  const horizon = new Date(today); horizon.setDate(horizon.getDate() + (S.horizonDays || 42));
  if (d < lead || d > horizon) return [];
  if ((S.blocked || []).indexOf(dateStr) > -1) return [];
  const base = (S.weekly || {})[String(d.getDay())] || [], extra = (S.extra || {})[dateStr] || [];
  const all = base.concat(extra).filter((t, i, a) => a.indexOf(t) === i).sort(), booked = S.booked || [];
  return all.map((t) => { const k = slotKey(dateStr, t); return { time: t, key: k, taken: booked.indexOf(k) > -1 || !!TAKEN[k.replace(/[^0-9T]/g, '')] }; });
}
function calendarHTML() {
  const S = T(), m = book.month;
  if (book.timeSaved && book.slot) return '<div class="picked saved"><span>📅 ' + esc(slotLabel(book.slot)) + '</span><button class="btn sm" id="changeslot">' + esc(S.changeSlot) + '</button></div>';
  const start = new Date(m.getFullYear(), m.getMonth(), 1).getDay(), days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate(), todayStr = isoDate(new Date());
  let cells = '';
  for (let i = 0; i < start; i++) cells += '<div class="d off"></div>';
  for (let d = 1; d <= days; d++) {
    const ds = isoDate(new Date(m.getFullYear(), m.getMonth(), d)), free = slotsFor(ds).filter((s) => !s.taken).length;
    cells += '<button class="d' + (free ? ' has' : '') + (ds === todayStr ? ' today' : '') + (ds === book.day ? ' sel' : '') + '" data-day="' + ds + '"' + (free ? '' : ' disabled') + '>' + d + '</button>';
  }
  return '<div class="cal"><div class="head"><button data-cal="-1" aria-label="prev">‹</button><b>' + esc(S.months[m.getMonth()]) + ' ' + m.getFullYear() + '</b><button data-cal="1" aria-label="next">›</button></div>'
    + '<div class="dow">' + S.dow.map((d) => '<span>' + d + '</span>').join('') + '</div><div class="days">' + cells + '</div><div id="slots">' + slotsHTML() + '</div></div>';
}
function slotsHTML() {
  const S = T();
  if (!book.day) return '<p class="hint">' + esc(S.pickDay) + '</p>';
  const list = slotsFor(book.day);
  if (!list.length) return '<p class="hint">' + esc(S.noSlots) + '</p>';
  return '<div class="slots">' + list.map((s) => '<button data-slot="' + s.key + '" class="' + (s.taken ? 'taken' : '') + (book.slot === s.key ? ' on' : '') + '">' + s.time + '</button>').join('') + '</div>'
    + (book.slot ? '<div class="picked">📅 ' + esc(slotLabel(book.slot)) + '</div><button class="btn primary block" id="saveslot" style="margin-top:8px">✓ ' + esc(S.saveSlot) + '</button>' : '');
}
function slotLabel(key) { return T().dateFmt(new Date(key.slice(0, 10) + 'T00:00:00')) + ' · ' + key.slice(11) + ' (' + L(CONFIG.tzLabel) + ')'; }

const serviceOf = (id) => SERVICES.filter((s) => s.id === id)[0];
const pkgOfItem = (it) => { const s = serviceOf(it.svc); return s ? s.packages.filter((p) => p.id === it.pkg)[0] : null; };
const itemIndex = (svc, pkg) => book.items.findIndex((x) => x.svc === svc && x.pkg === pkg);
// Summed from the prices actually charged, so the total always matches the rows.
const cartTotal = () => book.items.reduce((sum, it) => { const p = pkgOfItem(it); return sum + (p ? salePrice(p.price, 'reading') : 0); }, 0);
const needsBirth = () => book.items.some((it) => { const s = serviceOf(it.svc); return s && s.needsBirth; });
const topicLabel = (n, l) => { const t = TOPICS[n - 1]; return t ? '#' + t.id + ' ' + (l ? L2(t.name, l) : L(t.name)) : ''; };
function composeMessage() {
  const S = T(), out = [S.msgHello, ''];
  if (book.items.length) {
    out.push('🧺 ' + S.msgService + (book.items.length > 1 ? ' (' + book.items.length + ')' : '') + ':');
    book.items.forEach((it) => {
      const s = serviceOf(it.svc), p = pkgOfItem(it); if (!s || !p) return;
      out.push('• ' + L(s.name) + ' – ' + L(p.name) + ': ' + fmtPrice(salePrice(p.price, 'reading')));
      if (p.needsTopic && it.topic) out.push('   ↳ ' + S.msgTopic + ': ' + topicLabel(it.topic));
    });
    if (book.items.length > 1) out.push('💰 ' + S.msgTotal + ': ' + fmtPrice(cartTotal()));
    out.push('');
  }
  if (book.slot) out.push('📅 ' + S.msgTime + ': ' + slotLabel(book.slot));
  if (book.name.trim()) out.push('🙋 ' + S.msgName + ': ' + book.name.trim());
  if (needsBirth() && (book.birth || book.birthTime)) out.push('🎂 ' + S.msgBirth + ': ' + (book.birth || '?') + (book.birthTime ? ' ' + book.birthTime : ''));
  if (book.note.trim()) out.push('📝 ' + S.msgNote + ': ' + book.note.trim());
  if (book.card) { const c = cardById(book.card); if (c) out.push('🃏 ' + S.msgCard + ': ' + c.name); }
  while (out[out.length - 1] === '') out.pop();
  return out.join('\n');
}
/* The request as a labelled card: packages one per line, total, time, details. */
function summaryHTML() {
  const S = T(), rows = [];
  const items = book.items.map((it) => { const s = serviceOf(it.svc), p = pkgOfItem(it); if (!s || !p) return ''; return '<li>' + esc(L(s.name) + ' – ' + L(p.name)) + ' <b>' + priceHTML(p.price, 'reading') + '</b>' + (p.needsTopic ? '<br><small class="' + (it.topic ? 'ok' : 'warn') + '">' + esc(it.topic ? S.msgTopic + ': ' + topicLabel(it.topic) : S.cartNeedsTopic) + '</small>' : '') + '</li>'; }).join('');
  rows.push([S.bkItems, items ? '<ul>' + items + '</ul>' : '<span class="warn">' + esc(S.cartEmpty) + '</span>']);
  if (book.items.length > 1) rows.push([S.msgTotal, '<b>' + fmtPrice(cartTotal()) + '</b>']);
  rows.push([S.msgTime, book.slot ? esc(slotLabel(book.slot)) : '<span class="warn">' + esc(S.pickDay) + '</span>']);
  if (book.name.trim()) rows.push([S.msgName, esc(book.name.trim())]);
  if (needsBirth()) rows.push([S.msgBirth, book.birth ? esc(book.birth + (book.birthTime ? ' ' + book.birthTime : '')) : '<span class="warn">' + esc(S.needBirth) + '</span>']);
  if (book.note.trim()) rows.push([S.msgNote, esc(book.note.trim())]);
  if (book.card) { const c = cardById(book.card); if (c) rows.push([S.msgCard, esc(c.name)]); }
  return '<div class="sum">' + rows.map((r) => '<div class="r"><span class="k">' + esc(r[0]) + '</span><span class="v">' + r[1] + '</span></div>').join('') + '</div>';
}
/* The basket under the price list: every chosen package, its topic, the total. */
function cartHTML() {
  const S = T();
  if (!book.items.length) return '<div class="cart empty"><span>🧺 ' + esc(S.cartEmpty) + '</span></div>';
  return '<div class="cart"><b>🧺 ' + esc(S.cartTitle) + '</b>' + book.items.map((it, k) => { const s = serviceOf(it.svc), p = pkgOfItem(it); return '<div class="ci"><span>' + esc(L(s.name) + ' – ' + L(p.name)) + (p.needsTopic ? '<br><small class="' + (it.topic ? 'ok' : 'warn') + '">' + esc(it.topic ? S.msgTopic + ': ' + topicLabel(it.topic) : S.cartNeedsTopic) + '</small>' : '') + '</span><b>' + fmtPrice(p.price) + '</b><button class="x" data-remove="' + k + '" aria-label="remove">✕</button></div>'; }).join('')
    + (book.items.length > 1 ? '<div class="ci total"><span>' + esc(S.msgTotal) + '</span><b>' + fmtPrice(cartTotal()) + '</b></div>' : '') + '</div>';
}
/* Step 2: one topic picker per "1 preset topic" package in the basket. */
function topicSectionHTML() {
  const S = T();
  const need = book.items.map((it, k) => ({ it: it, k: k })).filter((x) => { const p = pkgOfItem(x.it); return p && p.needsTopic; });
  const cards = (k, chosen) => TOPICS.map((t) => '<button class="topic' + (chosen === t.id ? ' on open' : '') + '" data-topic="' + k + '/' + t.id + '"><div class="t"><span class="ic">' + t.icon + '</span><span><span class="n">#' + t.id + '</span> ' + esc(L(t.name)) + '</span></div><ol>' + t.q[lang].map((q) => '<li>' + esc(q) + '</li>').join('') + '</ol></button>').join('');
  if (!need.length) return '<p class="hint" style="margin-bottom:12px">' + esc(S.topicHint) + '</p><p class="hint faint">' + esc(S.topicNone) + '</p>';
  return '<p class="hint" style="margin-bottom:12px">' + esc(S.topicHint) + '</p>' + need.map((x) => { const s = serviceOf(x.it.svc), p = pkgOfItem(x.it); return '<div class="tpick" data-tpick="' + x.k + '"><h3>' + esc(S.topicFor) + ' ' + esc(L(s.name)) + '</h3>' + (x.it.topic ? '<p class="hint ok">✓</p>' : '<p class="hint warn">' + esc(S.cartNeedsTopic) + '</p>') + cards(x.k, x.it.topic) + '</div>'; }).join('');
}

/* ---- price sheet (also its own screen at #/prices) ---- */
function priceSheetHTML(interactive) {
  const S = T();
  return SERVICES.map((s) => '<div class="svc ' + s.tone + (interactive && book.items.some((it) => it.svc === s.id) ? ' on' : '') + '" data-svc="' + s.id + '">'
    + '<div class="t"><span class="ic">' + s.icon + '</span><div><b>' + esc(L(s.name)) + '</b><div class="tag">' + esc(L(s.tagline)) + '</div></div></div>'
    + (s.note ? '<p class="hint">' + esc(L(s.note)) + '</p>' : '')
    + '<div class="pk">' + s.packages.map((p) => (interactive
      ? '<button class="pkg' + (itemIndex(s.id, p.id) > -1 ? ' on' : '') + '" data-pkg="' + s.id + '/' + p.id + '"><span>' + (itemIndex(s.id, p.id) > -1 ? '✓ ' : '') + esc(L(p.name)) + '</span><b>' + priceHTML(p.price, 'reading') + '</b></button>'
      : '<div class="pkg"><span>' + esc(L(p.name)) + '</span><b>' + priceHTML(p.price, 'reading') + '</b></div>')).join('') + '</div></div>').join('')
    + '<p class="paynote">💜 ' + esc(L(PAYMENT_NOTE)) + '</p>';
}
function renderPrices() {
  const S = T(), m = $('#main');
  m.innerHTML = '<div class="eyebrow">' + esc(CONFIG.brand) + '</div><h1 style="margin-bottom:6px">' + esc(S.priceTitle) + '</h1><p class="muted">' + esc(S.priceIntro) + '</p>'
    + priceSheetHTML(false) + '<a class="btn primary block" href="#/book">' + esc(S.ctaBook) + '</a>'
    + '<h2 style="margin:24px 0 10px">' + esc(S.courses) + '</h2>' + COURSES.map((c) => '<div class="svc lav"><div class="t"><span class="ic">' + (c.id === 'tarot' ? PICK_ICON : '🗝️') + '</span><div><b>' + esc(L(c.name)) + '</b><div class="tag">' + esc(L(c.blurb)) + '</div></div></div>'
      + (isTWA() ? '' : '<div class="pk"><div class="pkg"><span>' + c.months + ' ' + esc(S.months6) + '</span><b>' + priceHTML(c.price, 'unlock') + '</b></div></div>') + '<a class="btn sm block" href="#/learn/' + c.id + '" style="margin-top:8px">' + esc(S.cats[c.id]) + ' →</a></div>').join('');
}

async function renderBook(args, params) {
  const S = T(), m = $('#main');
  if (params.change) return renderChange(params.change);
  restoreBook();
  book.card = params.card || book.card || null; book.name = book.name || PROFILE.name || ''; book.birth = book.birth || PROFILE.birthday || '';
  if (!book.month) book.month = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  m.innerHTML = '<div class="eyebrow">' + esc(CONFIG.brand) + '</div><h1 style="margin-bottom:6px">' + esc(S.bookTitle) + '</h1><p class="muted">' + esc(L(CONFIG.bookingNote)) + '</p><div class="notes"><div class="note"><span class="ni">👆</span><span>' + esc(S.bookTip) + '</span></div><div class="note"><span class="ni">💾</span><span>' + esc(S.draftKept) + '</span></div><div class="note"><span class="ni">📋</span><span>' + esc(S.topicNote) + '</span></div></div>'
    + '<div class="sec"><h2 style="margin:18px 0 4px">' + esc(S.chooseService) + '</h2><p class="hint" style="margin-bottom:12px">' + esc(S.serviceHint) + '</p><div id="svcwrap">' + priceSheetHTML(true) + '</div><div id="cartwrap">' + cartHTML() + '</div></div>'
    + '<div class="sec"><h2 style="margin:18px 0 4px">' + esc(S.chooseTopic) + '</h2><div id="topicwrap">' + topicSectionHTML() + '</div></div>'
    + '<div class="sec"><h2 style="margin-bottom:4px">' + esc(S.chooseTime) + '</h2><p class="hint" style="margin-bottom:10px">' + esc(S.timeHint(L(CONFIG.tzLabel))) + '</p><div id="calwrap"><p class="hint">…</p></div></div>'
    + '<div class="sec"><h2>' + esc(S.yourDetails) + '</h2><label class="f" for="bname">' + esc(S.yourName) + '</label><input id="bname" value="' + esc(book.name) + '" autocomplete="nickname">'
    + '<div id="birthwrap" hidden><label class="f" for="bbirth">' + esc(S.birthday) + '</label><input id="bbirth" type="date" value="' + esc(book.birth) + '"><label class="f" for="btime">' + esc(S.birthTime) + '</label><input id="btime" type="time" value="' + esc(book.birthTime) + '"><p class="hint">' + esc(S.birthHint) + '</p></div>'
    + '<label class="f" for="bnote">' + esc(S.yourNote) + '</label><textarea id="bnote" placeholder="' + esc(S.notePlaceholder) + '">' + esc(book.note) + '</textarea>'
    + (book.card ? '<p class="hint">' + esc(S.msgCard) + ': <b>' + esc(cardById(book.card).name) + '</b></p>' : '') + '</div>'
    + '<div class="sec"><h2 style="margin-bottom:6px">' + esc(S.sendVia) + '</h2><p class="hint">' + esc(S.summaryTitle) + '</p><div id="msgprev"></div><div id="msgtext" hidden></div><p class="hint" style="margin:0 0 10px">' + esc(L(PAYMENT_NOTE)) + '</p>'
    + '<div class="row" style="flex-direction:column">'
    + (BE.enabled ? '<button class="btn block primary" id="sendapp">' + esc(S.sendInApp) + '</button><p class="hint" id="sendstatus"></p>' : '<p class="hint">' + esc(S.needLogin) + '</p>')
    + '<a class="btn block" href="#/contact">💬 ' + esc(S.contactTitle) + '</a></div></div>'
    + '<div class="sec card"><h3 style="margin-bottom:10px">' + esc(S.howItWorks) + '</h3><ol class="steps">' + [S.chooseService.slice(3), S.chooseTopic.slice(3), S.chooseTime.slice(3), S.sendVia.slice(3), L(PAYMENT_NOTE)].map((x) => '<li>' + esc(x) + '</li>').join('') + '</ol></div>';
  const prev = () => { const p = $('#msgprev'); if (!p) return; p.innerHTML = summaryHTML(); $('#msgtext').textContent = composeMessage(); saveBook(); };
  const done = () => {
    m.innerHTML = '<div class="done"><div class="big">✅</div><h1>' + esc(S.doneTitle) + '</h1><p class="muted">' + esc(S.doneBody) + '</p><p><span class="st requested">' + esc(S.status.requested) + '</span></p>' + summaryHTML()
      + '<div class="row" style="flex-direction:column;margin-top:16px"><a class="btn primary block" href="#/me">' + esc(S.doneMe) + '</a><a class="btn block" href="#/home">' + esc(S.doneHome) + '</a><button class="btn block" id="bookmore">' + esc(S.doneMore) + '</button></div></div>';
    clearBook(); window.scrollTo(0, 0);
    $('#bookmore').addEventListener('click', () => { renderBook([], {}); });
  };
  const bindTopics = () => {
    $$('[data-topic]', m).forEach((btn) => btn.addEventListener('click', () => {
      const v = btn.getAttribute('data-topic').split('/'), k = Number(v[0]), id = Number(v[1]), it = book.items[k];
      if (!it) return;
      it.topic = it.topic === id ? null : id;   // a second tap clears the choice
      syncCart(false);
    }));
  };
  const syncCart = (scrollTopics) => {
    $$('.svc', m).forEach((el) => el.classList.toggle('on', book.items.some((it) => it.svc === el.getAttribute('data-svc'))));
    $$('[data-pkg]', m).forEach((el) => { const v = el.getAttribute('data-pkg').split('/'), on = itemIndex(v[0], v[1]) > -1; el.classList.toggle('on', on); el.querySelector('span').textContent = (on ? '✓ ' : '') + L(serviceOf(v[0]).packages.filter((p) => p.id === v[1])[0].name); });
    $('#cartwrap').innerHTML = cartHTML();
    $$('[data-remove]', m).forEach((x) => x.addEventListener('click', () => { book.items.splice(Number(x.getAttribute('data-remove')), 1); syncCart(false); }));
    $('#topicwrap').innerHTML = topicSectionHTML(); bindTopics();
    $('#birthwrap').hidden = !needsBirth();
    prev();
    if (scrollTopics) { const t = $('.tpick:not(:has(.topic.on))', m); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  };
  syncCart(false);
  $$('[data-pkg]', m).forEach((btn) => btn.addEventListener('click', () => {
    const v = btn.getAttribute('data-pkg').split('/'), k = itemIndex(v[0], v[1]);
    if (k > -1) { book.items.splice(k, 1); syncCart(false); return; }
    const p = serviceOf(v[0]).packages.filter((x) => x.id === v[1])[0];
    book.items.push({ svc: v[0], pkg: v[1], topic: null });
    syncCart(!!p.needsTopic);
  }));
  $('#bname').addEventListener('input', (e) => { book.name = e.target.value; prev(); });
  $('#bnote').addEventListener('input', (e) => { book.note = e.target.value; prev(); });
  $('#bbirth').addEventListener('input', (e) => { book.birth = e.target.value; prev(); });
  $('#btime').addEventListener('input', (e) => { book.birthTime = e.target.value; prev(); });
  const need = () => {
    if (!book.items.length) { toast(S.needService); $('#svcwrap').scrollIntoView({ behavior: 'smooth', block: 'start' }); return false; }
    const missing = book.items.findIndex((it) => { const p = pkgOfItem(it); return p && p.needsTopic && !it.topic; });
    if (missing > -1) { toast(S.needTopic); const t = $('.tpick[data-tpick="' + missing + '"]', m); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); return false; }
    if (!book.slot) { toast(S.needSlot); $('#calwrap').scrollIntoView({ behavior: 'smooth', block: 'center' }); return false; }
    if (needsBirth() && !book.birth) { toast(S.needBirth); $('#birthwrap').scrollIntoView({ behavior: 'smooth', block: 'center' }); return false; }
    return true;
  };
  const sendBtn = $('#sendapp');
  if (sendBtn) sendBtn.addEventListener('click', async () => {
    if (!need()) return;
    if (!BE.user) { $('#sendstatus').textContent = S.needLogin; location.hash = '#/me?next=book'; return; }
    sendBtn.disabled = true; sendBtn.textContent = S.sending;
    try {
      const items = book.items.map((it) => { const s = serviceOf(it.svc), p = pkgOfItem(it); return { service: L2(s.name, 'vi'), pkg: L2(p.name, 'vi'), price: p.price, topic: p.needsTopic && it.topic ? topicLabel(it.topic, 'vi') : '' }; });
      await BE.createBooking({ name: book.name.trim() || PROFILE.name || '', slot: book.slot,
        service: items.map((x) => x.service + ' – ' + x.pkg + (x.topic ? ' (' + x.topic + ')' : '')).join(' + '), pkg: '', price: cartTotal(), topic: items.map((x) => x.topic).filter(Boolean).join('; '), items: items,
        note: book.note.trim(), message: composeMessage(), birth: needsBirth() ? (book.birth + (book.birthTime ? ' ' + book.birthTime : '')) : '', card: book.card ? cardById(book.card).name : '' });
      toast('✓'); try { TAKEN = await BE.takenSlots(); } catch (e2) { /* refreshed on the next visit */ }
      done(); return;
    } catch (e) { $('#sendstatus').textContent = S.publishFail + ': ' + e.message; $('#sendstatus').className = 'hint err'; }
    sendBtn.disabled = false; sendBtn.textContent = S.sendInApp;
  });
  const bindSlots = () => {
    $$('[data-slot]', m).forEach((b) => b.addEventListener('click', () => { book.slot = b.getAttribute('data-slot'); book.timeSaved = false; $('#slots').innerHTML = slotsHTML(); bindSlots(); prev(); }));
    const sv = $('#saveslot'); if (sv) sv.addEventListener('click', () => { book.timeSaved = true; drawCal(); toast(S.slotSaved); const n = $('#bname'); if (n) n.scrollIntoView({ behavior: 'smooth', block: 'center' }); });
  };
  const drawCal = () => {
    const w = $('#calwrap'); if (!w) return;
    w.innerHTML = calendarHTML();
    $$('[data-cal]', w).forEach((b) => b.addEventListener('click', () => { book.month = new Date(book.month.getFullYear(), book.month.getMonth() + Number(b.getAttribute('data-cal')), 1); drawCal(); }));
    $$('[data-day]', w).forEach((b) => b.addEventListener('click', () => { book.day = b.getAttribute('data-day'); book.slot = null; book.timeSaved = false; drawCal(); }));
    const ch = $('#changeslot'); if (ch) ch.addEventListener('click', () => { book.timeSaved = false; drawCal(); });
    bindSlots(); prev();
  };
  await loadSchedule();
  if (!book.day) {
    for (let i = 0; i < 3; i++) { const mm = new Date(book.month.getFullYear(), book.month.getMonth() + i, 1); const days = new Date(mm.getFullYear(), mm.getMonth() + 1, 0).getDate(); let any = false; for (let d = 1; d <= days && !any; d++) any = slotsFor(isoDate(new Date(mm.getFullYear(), mm.getMonth(), d))).some((s) => !s.taken); if (any) { book.month = mm; break; } }
  }
  drawCal();
}
/* Moving an existing booking: only the calendar, then a request Nabu approves. */
async function renderChange(id) {
  const S = T(), m = $('#main');
  m.innerHTML = '<div class="eyebrow">' + esc(CONFIG.brand) + '</div><h1 style="margin-bottom:6px">' + esc(S.changeTitle) + '</h1><p class="muted">…</p>';
  if (!BE.enabled) { redirect('#/me'); return; }
  await Promise.race([BE.initP || Promise.resolve(), new Promise((r) => setTimeout(r, 4000))]);
  if (!BE.user) { location.hash = '#/me'; return; }
  let bk = null; try { bk = await BE.getBooking(id); } catch (e) { /* shown below */ }
  if (!bk || bk.uid !== BE.user.uid) { redirect('#/me'); return; }
  const keep = { slot: book.slot, day: book.day, timeSaved: book.timeSaved, month: book.month };
  book.slot = null; book.day = String(bk.slot).slice(0, 10); book.timeSaved = false; book.month = new Date(book.day + 'T00:00:00'); book.month = new Date(book.month.getFullYear(), book.month.getMonth(), 1);
  m.innerHTML = '<div class="eyebrow">' + esc(CONFIG.brand) + '</div><h1 style="margin-bottom:6px">' + esc(S.changeTitle) + '</h1><p class="muted">' + esc(S.changeIntro) + '</p>'
    + '<div class="picked"><span>' + esc(S.currentSlot) + ': ' + esc(slotLabel(bk.slot)) + '</span></div>'
    + '<div class="sec" style="margin-top:14px"><p class="hint" style="margin-bottom:10px">' + esc(S.timeHint(L(CONFIG.tzLabel))) + '</p><div id="calwrap"><p class="hint">…</p></div></div>'
    + '<button class="btn primary block" id="sendchange">' + esc(S.sendChange) + '</button><p class="hint" id="chstatus"></p><p style="margin-top:10px"><a href="#/me" class="backlink">← ' + esc(S.nav.me) + '</a></p>';
  const restore = () => { book.slot = keep.slot; book.day = keep.day; book.timeSaved = keep.timeSaved; book.month = keep.month; };
  const bindSlots = () => { $$('[data-slot]', m).forEach((b) => b.addEventListener('click', () => { book.slot = b.getAttribute('data-slot'); $('#slots').innerHTML = slotsHTML().replace(/<button class="btn primary block" id="saveslot"[^]*?<\/button>/, ''); bindSlots(); })); };
  const drawCal = () => {
    const w = $('#calwrap'); if (!w) return;
    w.innerHTML = calendarHTML().replace(/<button class="btn primary block" id="saveslot"[^]*?<\/button>/, '');
    $$('[data-cal]', w).forEach((b) => b.addEventListener('click', () => { book.month = new Date(book.month.getFullYear(), book.month.getMonth() + Number(b.getAttribute('data-cal')), 1); drawCal(); }));
    $$('[data-day]', w).forEach((b) => b.addEventListener('click', () => { book.day = b.getAttribute('data-day'); book.slot = null; drawCal(); }));
    bindSlots();
  };
  await loadSchedule(); drawCal();
  $('#sendchange').addEventListener('click', async () => {
    const st = $('#chstatus');
    if (!book.slot) { toast(S.needSlot); return; }
    if (book.slot === bk.slot) { toast(S.needSlot); return; }
    $('#sendchange').disabled = true;
    try { await BE.requestChange(bk, book.slot); restore(); st.textContent = S.changeSent; st.className = 'hint ok'; toast('✓'); setTimeout(() => { location.hash = '#/me'; }, 900); }
    catch (e) { st.textContent = S.publishFail + ': ' + e.message; st.className = 'hint err'; $('#sendchange').disabled = false; }
  });
}
ROUTES.book = { nav: 'book', render: renderBook };
ROUTES.prices = { nav: 'book', render: renderPrices };
