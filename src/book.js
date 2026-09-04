/* ============================ booking ============================
   Topic, then a calendar of Nabu's free slots (schedule.json, minus slots
   taken in Firestore when accounts are on), then details, then send. */
const book = { topic: null, name: '', note: '', card: null, slot: null, month: null, day: null };
let SCHEDULE = null, TAKEN = {};

async function loadSchedule() {
  const s = await loadJSON(CONFIG.schedulePath, 'nabu-schedule');
  SCHEDULE = s.data || { slotMinutes: 60, weekly: {}, blocked: [], extra: {}, booked: [], leadDays: 1, horizonDays: 42 };
  if (BE.enabled && BE.ready) TAKEN = await BE.takenSlots();
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
  const base = (S.weekly || {})[String(d.getDay())] || [];
  const extra = (S.extra || {})[dateStr] || [];
  const all = base.concat(extra).filter((t, i, a) => a.indexOf(t) === i).sort();
  const booked = S.booked || [];
  return all.map((t) => { const k = slotKey(dateStr, t); return { time: t, key: k, taken: booked.indexOf(k) > -1 || !!TAKEN[k.replace(/[^0-9T]/g, '')] }; });
}
function calendarHTML() {
  const S = T(), m = book.month;
  const first = new Date(m.getFullYear(), m.getMonth(), 1), start = first.getDay(), days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
  const todayStr = isoDate(new Date());
  let cells = '';
  for (let i = 0; i < start; i++) cells += '<div class="d off"></div>';
  for (let d = 1; d <= days; d++) {
    const ds = isoDate(new Date(m.getFullYear(), m.getMonth(), d)), free = slotsFor(ds).filter((s) => !s.taken).length;
    cells += '<button class="d' + (free ? ' has' : '') + (ds === todayStr ? ' today' : '') + (ds === book.day ? ' sel' : '') + '" data-day="' + ds + '"' + (free ? '' : ' disabled') + '>' + d + '</button>';
  }
  return '<div class="cal"><div class="head"><button data-cal="-1" aria-label="prev">‹</button><b>' + esc(S.months[m.getMonth()]) + ' ' + m.getFullYear() + '</b><button data-cal="1" aria-label="next">›</button></div>'
    + '<div class="dow">' + S.dow.map((d) => '<span>' + d + '</span>').join('') + '</div><div class="days">' + cells + '</div>'
    + '<div id="slots">' + slotsHTML() + '</div></div>';
}
function slotsHTML() {
  const S = T();
  if (!book.day) return '<p class="hint">' + esc(S.pickDay) + '</p>';
  const list = slotsFor(book.day);
  if (!list.length) return '<p class="hint">' + esc(S.noSlots) + '</p>';
  return '<div class="slots">' + list.map((s) => '<button data-slot="' + s.key + '" class="' + (s.taken ? 'taken' : '') + (book.slot === s.key ? ' on' : '') + '">' + s.time + '</button>').join('') + '</div>'
    + (book.slot ? '<div class="picked">📅 ' + esc(slotLabel(book.slot)) + '</div>' : '');
}
function slotLabel(key) {
  const d = new Date(key.slice(0, 10) + 'T00:00:00');
  return T().dateFmt(d) + ' · ' + key.slice(11) + ' (' + L(CONFIG.tzLabel) + ')';
}
function composeMessage() {
  const S = T(), lines = [S.msgHello];
  if (book.topic === 'own') lines.push(S.msgTopic + ': ' + S.ownTopic);
  else if (book.topic) { const t = TOPICS[book.topic - 1]; lines.push(S.msgTopic + ': #' + t.id + ' ' + L(t.name)); }
  if (book.slot) lines.push(S.msgTime + ': ' + slotLabel(book.slot));
  if (book.name.trim()) lines.push(S.msgName + ': ' + book.name.trim());
  if (book.note.trim()) lines.push(S.msgNote + ': ' + book.note.trim());
  if (book.card) { const c = cardById(book.card); if (c) lines.push(S.msgCard + ': ' + c.name); }
  return lines.join('\n');
}
async function renderBook(args, params) {
  const S = T(), m = $('#main');
  book.card = params.card || null; book.name = book.name || PROFILE.name || '';
  if (!book.month) book.month = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const topics = TOPICS.map((t) => '<button class="topic' + (book.topic === t.id ? ' on open' : '') + '" data-topic="' + t.id + '"><div class="t"><span class="ic">' + t.icon + '</span><span><span class="n">#' + t.id + '</span> ' + esc(L(t.name)) + '</span></div><ol>' + t.q[lang].map((q) => '<li>' + esc(q) + '</li>').join('') + '</ol></button>').join('')
    + '<button class="topic' + (book.topic === 'own' ? ' on' : '') + '" data-topic="own"><div class="t"><span class="ic">✍️</span><span>' + esc(S.ownTopic) + '</span></div><div class="hint">' + esc(S.ownTopicHint) + '</div></button>';
  const links = [];
  if (CONFIG.instagram) links.push(['https://ig.me/m/' + CONFIG.instagram, S.viaInstagram, BE.enabled ? '' : 'primary']);
  if (CONFIG.facebookPage) links.push(['https://m.me/' + CONFIG.facebookPage, S.viaMessenger, '']);
  if (CONFIG.zalo) links.push(['https://zalo.me/' + CONFIG.zalo, S.viaZalo, '']);
  if (CONFIG.email) links.push(['mailto:' + CONFIG.email, S.viaEmail, '']);
  m.innerHTML = '<div class="eyebrow">' + esc(CONFIG.brand) + '</div><h1 style="margin-bottom:6px">' + esc(S.bookTitle) + '</h1><p class="muted">' + esc(L(CONFIG.bookingNote)) + '</p>'
    + '<div class="sec"><h2 style="margin:18px 0 4px">' + esc(S.chooseTopic) + '</h2><p class="hint" style="margin-bottom:12px">' + esc(S.topicHint) + '</p>' + topics + '</div>'
    + '<div class="sec"><h2 style="margin-bottom:4px">' + esc(S.chooseTime) + '</h2><p class="hint" style="margin-bottom:10px">' + esc(S.timeHint(L(CONFIG.tzLabel))) + '</p><div id="calwrap"><p class="hint">…</p></div></div>'
    + '<div class="sec"><h2>' + esc(S.yourDetails) + '</h2><label class="f" for="bname">' + esc(S.yourName) + '</label><input id="bname" value="' + esc(book.name) + '" autocomplete="nickname">'
    + '<label class="f" for="bnote">' + esc(S.yourNote) + '</label><textarea id="bnote" placeholder="' + esc(S.notePlaceholder) + '">' + esc(book.note) + '</textarea>'
    + (book.card ? '<p class="hint">' + esc(S.msgCard) + ': <b>' + esc(cardById(book.card).name) + '</b></p>' : '') + '</div>'
    + '<div class="sec"><h2 style="margin-bottom:6px">' + esc(S.sendVia) + '</h2><div class="msgbox" id="msgprev"></div>'
    + '<div class="row" style="flex-direction:column">'
    + (BE.enabled ? '<button class="btn block primary" id="sendapp">' + esc(S.sendInApp) + '</button><p class="hint" id="sendstatus"></p>' : '')
    + '<p class="hint">' + esc(S.sendHint) + '</p>'
    + links.map((l) => '<a class="btn block ' + l[2] + '" data-send href="' + esc(l[0]) + '" target="_blank" rel="noopener">' + esc(l[1]) + '</a>').join('')
    + '<button class="btn block" data-send="copy">' + esc(S.copyMsg) + '</button></div></div>'
    + '<div class="sec card"><h3 style="margin-bottom:10px">' + esc(S.howItWorks) + '</h3><ol class="steps">' + [S.chooseTopic.slice(3), S.chooseTime.slice(3), S.sendVia.slice(3), L(CONFIG.bookingNote)].map((x) => '<li>' + esc(x) + '</li>').join('') + '</ol></div>'
    + '<div class="sec"><h3 style="margin-bottom:6px">' + esc(S.aboutTitle) + '</h3><p class="muted">' + esc(L(CONFIG.about)) + '</p></div>';
  const prev = () => { $('#msgprev').textContent = composeMessage(); };
  prev();
  $$('[data-topic]', m).forEach((b) => b.addEventListener('click', () => {
    const v = b.getAttribute('data-topic'), id = v === 'own' ? 'own' : Number(v);
    if (book.topic === id && v !== 'own') { b.classList.toggle('open'); return; }
    book.topic = id;
    $$('[data-topic]', m).forEach((x) => { const on = x === b; x.classList.toggle('on', on); x.classList.toggle('open', on); });
    prev();
  }));
  $('#bname').addEventListener('input', (e) => { book.name = e.target.value; prev(); });
  $('#bnote').addEventListener('input', (e) => { book.note = e.target.value; prev(); });
  const need = () => {
    if (!book.topic) { toast(S.needTopic); $$('[data-topic]', m)[0].scrollIntoView({ behavior: 'smooth', block: 'center' }); return false; }
    if (!book.slot) { toast(S.needSlot); $('#calwrap').scrollIntoView({ behavior: 'smooth', block: 'center' }); return false; }
    return true;
  };
  $$('[data-send]', m).forEach((el) => el.addEventListener('click', (e) => {
    if (!need()) { e.preventDefault(); return; }
    const msg = composeMessage();
    if (el.getAttribute('data-send') === 'copy') { copyText(msg).then(() => toast(S.copied)); return; }
    if (el.getAttribute('href').indexOf('mailto:') === 0) { el.setAttribute('href', 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent(CONFIG.brand) + '&body=' + encodeURIComponent(msg)); return; }
    copyText(msg); toast(S.copied);
  }));
  const sendBtn = $('#sendapp');
  if (sendBtn) sendBtn.addEventListener('click', async () => {
    if (!need()) return;
    if (!BE.user) { $('#sendstatus').textContent = S.needLogin; location.hash = '#/me?next=book'; return; }
    sendBtn.disabled = true; sendBtn.textContent = S.sending;
    try {
      const t = book.topic === 'own' ? S.ownTopic : ('#' + book.topic + ' ' + L(TOPICS[book.topic - 1].name));
      await BE.createBooking({ name: book.name.trim() || PROFILE.name || '', slot: book.slot, topic: t, note: book.note.trim(), card: book.card ? cardById(book.card).name : '' });
      $('#sendstatus').textContent = S.sentOk; $('#sendstatus').className = 'hint ok'; toast('✓');
      TAKEN = await BE.takenSlots(); book.slot = null; book.note = ''; drawCal();
    } catch (e) { $('#sendstatus').textContent = S.publishFail + ': ' + e.message; $('#sendstatus').className = 'hint err'; }
    sendBtn.disabled = false; sendBtn.textContent = S.sendInApp;
  });
  // calendar
  const drawCal = () => {
    const w = $('#calwrap'); if (!w) return;
    w.innerHTML = calendarHTML();
    $$('[data-cal]', w).forEach((b) => b.addEventListener('click', () => { book.month = new Date(book.month.getFullYear(), book.month.getMonth() + Number(b.getAttribute('data-cal')), 1); drawCal(); }));
    $$('[data-day]', w).forEach((b) => b.addEventListener('click', () => { book.day = b.getAttribute('data-day'); book.slot = null; drawCal(); }));
    $$('[data-slot]', w).forEach((b) => b.addEventListener('click', () => { book.slot = b.getAttribute('data-slot'); $('#slots').innerHTML = slotsHTML(); bindSlots(); prev(); }));
    prev();
  };
  const bindSlots = () => { $$('[data-slot]', m).forEach((b) => b.addEventListener('click', () => { book.slot = b.getAttribute('data-slot'); $('#slots').innerHTML = slotsHTML(); bindSlots(); prev(); })); };
  await loadSchedule();
  if (!book.day) { // jump to the first month with a free slot
    for (let i = 0; i < 3; i++) { const mm = new Date(book.month.getFullYear(), book.month.getMonth() + i, 1); const days = new Date(mm.getFullYear(), mm.getMonth() + 1, 0).getDate(); let any = false; for (let d = 1; d <= days && !any; d++) any = slotsFor(isoDate(new Date(mm.getFullYear(), mm.getMonth(), d))).some((s) => !s.taken); if (any) { book.month = mm; break; } }
  }
  drawCal();
}
ROUTES.book = { nav: 'book', render: renderBook };
