/* ============================ Nabu Tarot app ============================
   One page, three screens (feed, pick a card, booking) plus a composer for
   the reader at #/admin. Everything below only depends on the data files
   assembled before it: CONFIG, STR, TOPICS, the card text, the artwork and
   Thu Anh's keyword/question knowledge base (KW, ASK). */

const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } }
};

/* ============================ language + theme ============================ */
let lang = store.get('nabu-lang', 'vi');
if (LANGS.indexOf(lang) < 0) lang = 'vi';
const T = () => STR[lang];
const L = (obj) => { // bilingual field: {vi, en} or plain string
  if (obj == null) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] || obj.vi || obj.en || '';
};

function applyTheme() {
  const th = store.get('nabu-theme', '');
  if (th) document.documentElement.setAttribute('data-theme', th);
  else document.documentElement.removeAttribute('data-theme');
  const dark = th !== 'light';
  $('#theme').textContent = dark ? '☀' : '☾';
  $('meta[name="theme-color"]').setAttribute('content', dark ? '#120F24' : '#F4F0E6');
}

/* ============================ the deck ============================ */
function buildDeck(lg) {
  const X = LEX[lg], D = DECKTEXT[lg], out = [];
  D.majors.forEach((m, i) => {
    out.push({ id: 'major-' + i, suit: 'major', badge: ROMAN[i], name: m[0],
      meta: X.suitNames.major + ' · ' + ROMAN[i], kw: m[1].split(' · '),
      scene: m[2], up: m[3], rev: m[4], art: MAJOR_ART[i] });
  });
  SUIT_KEYS.forEach((suit) => {
    const S = D.minors[suit], sn = X.suitNames[suit], el = X.elements[suit];
    S.pips.forEach((p, i) => {
      out.push({ id: suit + '-' + (i + 1), suit: suit, badge: '', name: X.pipName(X.numbers[i], sn),
        meta: sn + ' · ' + el, kw: [], scene: p[0], up: p[1], rev: p[2], art: ART_CACHE[suit + '-' + (i + 1)] });
    });
    S.court.forEach((c, i) => {
      out.push({ id: suit + '-c' + i, suit: suit, badge: '', name: X.courtName(X.courts[i], sn),
        meta: sn + ' · ' + el + ' · ' + X.courtTag, kw: [], scene: c[0], up: c[1], rev: c[2], art: ART_CACHE[suit + '-c' + i] });
    });
  });
  return out;
}
const DECK = { vi: buildDeck('vi'), en: buildDeck('en') };
const INDEX = {};
LANGS.forEach((lg) => { INDEX[lg] = {}; DECK[lg].forEach((c) => { INDEX[lg][c.id] = c; }); });
const cardById = (id, lg) => INDEX[lg || lang][id];

function faceSVG(card) {
  const b = card.badge;
  const numeral = b
    ? '<g><rect x="' + (50 - Math.max(9, b.length * 3.4)) + '" y="6" width="' + Math.max(18, b.length * 6.8) + '" height="15" fill="var(--card-bg)" stroke="var(--card-ink)" stroke-width="1"/>'
      + '<text x="50" y="17.2" text-anchor="middle" font-family="Georgia,serif" font-size="9.5" fill="var(--card-ink)">' + b + '</text></g>'
    : '';
  return '<svg viewBox="0 0 100 172" role="img" aria-label="' + esc(card.name) + '">'
    + '<rect x="1.3" y="1.3" width="97.4" height="169.4" rx="3" fill="var(--card-bg)" stroke="var(--card-ink)" stroke-width="2.6"/>'
    + '<g stroke="var(--card-ink)" stroke-linejoin="round" stroke-linecap="round" fill="none">'
    + card.art
    + '<rect x="5" y="5" width="90" height="135" fill="none" stroke-width="1"/>'
    + '<rect x="5" y="140" width="90" height="27" fill="none" stroke-width="1"/>'
    + '</g>' + numeral
    + '<text x="50" y="157" text-anchor="middle" font-family="'Be Vietnam Pro',sans-serif" font-size="' + (card.name.length > 16 ? 6.2 : 7.4) + '" fill="var(--card-ink)">' + esc(card.name) + '</text>'
    + '</svg>';
}

function backSVG() {
  const pts = [];
  for (let i = 0; i < 16; i++) {
    const r = i % 2 ? 6 : 15, a = (-90 + i * 22.5) * Math.PI / 180;
    pts.push((50 + r * Math.cos(a)).toFixed(2) + ',' + (86 + r * Math.sin(a)).toFixed(2));
  }
  let dots = '';
  for (let y = 12; y < 165; y += 9) for (let x = 12; x < 92; x += 9) dots += '<circle cx="' + x + '" cy="' + y + '" r=".7"/>';
  return '<svg viewBox="0 0 100 172" aria-hidden="true">'
    + '<rect x="1.3" y="1.3" width="97.4" height="169.4" rx="4" fill="var(--back-1)" stroke="var(--gold)" stroke-width="2.2"/>'
    + '<rect x="7" y="7" width="86" height="158" rx="2" fill="var(--back-2)" stroke="var(--gold)" stroke-width=".7"/>'
    + '<g fill="var(--gold)" opacity=".45">' + dots + '</g>'
    + '<circle cx="50" cy="86" r="26" fill="var(--back-1)" stroke="var(--gold)" stroke-width="1.1"/>'
    + '<path d="M44 68 A19 19 0 1 0 44 104 A15 15 0 1 1 44 68 Z" fill="var(--gold)" opacity=".9"/>'
    + '<polygon points="' + pts.join(' ') + '" fill="var(--gold)" transform="translate(8,-6) scale(.7) translate(-21,37)"/>'
    + '</svg>';
}
const BACK = backSVG();

const miniHTML = (id) => {
  const c = cardById(id);
  return c ? '<div class="m"><span class="face">' + faceSVG(c) + '</span>' + esc(c.name) + '</div>' : '';
};

/* ============================ chrome ============================ */
const ICONS = {
  feed: '<svg viewBox="0 0 24 24"><path d="M4 5h16M4 12h16M4 19h10"/></svg>',
  pick: '<svg viewBox="0 0 24 24"><rect x="6" y="3" width="12" height="18" rx="2"/><path d="M12 8l1.5 3 3 .4-2.2 2.1.6 3.2L12 15.2 9.1 16.7l.6-3.2L7.5 11.4l3-.4z"/></svg>',
  book: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>'
};
function renderChrome(route) {
  document.documentElement.setAttribute('lang', lang);
  $('#brand').innerHTML = '<svg viewBox="0 0 24 24" fill="var(--gold)"><path d="M12 1l2.2 6.8L21 10l-6.8 2.2L12 19l-2.2-6.8L3 10l6.8-2.2z"/></svg>' + esc(CONFIG.brand);
  $('#lang').textContent = T().lang;
  $('#nav').innerHTML = ['feed', 'pick', 'book'].map((k) =>
    '<a href="#/' + k + '" class="' + (route === k ? 'on' : '') + '">' + ICONS[k] + '<span>' + esc(T().nav[k]) + '</span></a>').join('');
}

let toastTimer = null;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).catch(() => copyFallback(text));
  return Promise.resolve(copyFallback(text));
}
function copyFallback(text) {
  const ta = document.createElement('textarea');
  ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.top = '-1000px';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); } catch (e) { /* nothing more to try */ }
  document.body.removeChild(ta);
}
function shareOrCopy(text, url) {
  if (navigator.share) return navigator.share({ text: text, url: url }).catch(() => {});
  return copyText(text + (url ? ' ' + url : '')).then(() => toast(T().copied));
}
const appURL = () => location.href.split('#')[0];

/* ============================ feed ============================ */
let POSTS = null, postsFromCache = false;
async function loadPosts() {
  let fresh = null;
  try {
    const r = await fetch(CONFIG.postsPath + '?t=' + Date.now(), { cache: 'no-store' });
    if (r.ok) { const j = await r.json(); fresh = j.posts || []; }
  } catch (e) { /* offline */ }
  if (fresh) { POSTS = fresh; postsFromCache = false; store.set('nabu-posts', fresh); }
  else { POSTS = store.get('nabu-posts', []); postsFromCache = true; }
  return POSTS;
}
function sortedPosts() {
  return POSTS.slice().sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || String(b.date).localeCompare(String(a.date)));
}
function fmtDate(s) {
  const d = new Date(String(s) + 'T00:00:00');
  return isNaN(d) ? esc(s) : T().dateFmt(d);
}
function paras(text) {
  return String(text || '').split(/\n\s*\n/).filter((x) => x.trim()).map((p) => '<p>' + esc(p.trim()).replace(/\n/g, '<br>') + '</p>').join('');
}
function markersHTML(p) {
  const m = p.markers || {}; const bits = [];
  if (m.initials && m.initials.length) bits.push(T().initials + ' <b>' + esc(m.initials.join(', ')) + '</b>');
  if (m.signs && m.signs.length) bits.push(T().signs + ' <b>' + esc(m.signs.map((i) => T().zodiac[i]).filter(Boolean).join(', ')) + '</b>');
  return bits.length ? '<div class="markers">' + T().forYouIf + ' ' + bits.join(' · ') + '</div>' : '';
}
function postHTML(p, full) {
  const body = L(p.body), long = !full && body.length > 320;
  return '<article class="post" data-id="' + esc(p.id) + '">'
    + '<div class="date"><span>' + fmtDate(p.date) + '</span>' + (p.pinned ? '<span class="pin">★ ' + T().pinned + '</span>' : '') + '</div>'
    + '<h2>' + esc(L(p.title)) + '</h2>'
    + markersHTML(p)
    + '<div class="body' + (long ? ' clamp' : '') + '">' + paras(body) + '</div>'
    + (long ? '<button class="more" data-more>' + T().readMore + '</button>' : '')
    + (p.cards && p.cards.length ? '<div class="faint">' + T().cardsDrawn + '</div><div class="mini">' + p.cards.map(miniHTML).join('') + '</div>' : '')
    + '<div class="foot"><button data-share>' + T().share + '</button></div>'
    + '</article>';
}
function bindPost(root) {
  $$('[data-more]', root).forEach((b) => b.addEventListener('click', () => {
    const body = b.previousElementSibling; const open = body.classList.toggle('clamp');
    b.textContent = open ? T().readMore : T().readLess;
  }));
  $$('[data-share]', root).forEach((b) => b.addEventListener('click', () => {
    const art = b.closest('article'), p = POSTS.filter((x) => x.id === art.getAttribute('data-id'))[0];
    if (!p) return;
    shareOrCopy(L(p.title) + '\n' + L(p.body), appURL() + '#/post/' + p.id);
  }));
}
const ctaHTML = () => '<div class="cta"><h3>' + esc(T().ctaPick) + '</h3><p>' + esc(T().pickIntro) + '</p>'
  + '<div class="row"><a class="btn primary" href="#/pick">' + esc(T().nav.pick) + '</a><a class="btn" href="#/book">' + esc(T().ctaBook) + '</a></div></div>';

async function renderFeed() {
  const m = $('#main');
  m.innerHTML = '<div class="eyebrow">' + esc(CONFIG.brand) + '</div><h1 style="margin-bottom:16px">' + esc(T().feedTitle) + '</h1><p class="muted">…</p>';
  if (POSTS == null) await loadPosts();
  if (location.hash.replace(/^#\/?/, '').split('?')[0] !== 'feed' && location.hash !== '' && location.hash !== '#') return;
  const list = sortedPosts();
  m.innerHTML = installBanner()
    + '<div class="eyebrow">' + esc(CONFIG.brand) + '</div><h1 style="margin-bottom:16px">' + esc(T().feedTitle) + '</h1>'
    + (postsFromCache && list.length ? '<div class="banner">' + esc(T().feedOffline) + '</div>' : '')
    + ctaHTML()
    + (list.length ? list.map((p) => postHTML(p, false)).join('') : '<p class="muted">' + esc(T().feedEmpty) + '</p>');
  bindPost(m); bindBanner(m);
}
async function renderPost(id) {
  const m = $('#main');
  if (POSTS == null) await loadPosts();
  const p = POSTS.filter((x) => x.id === id)[0];
  m.innerHTML = '<p><a href="#/feed">← ' + esc(T().backToFeed) + '</a></p>'
    + (p ? postHTML(p, true) + ctaHTML() : '<p class="muted">' + esc(T().notFound) + '</p>');
  bindPost(m);
}

/* ============================ pick a card ============================ */
const pick = { focus: store.get('nabu-focus', 'general'), hand: [], chosen: null };
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function newHand() { pick.hand = shuffle(DECK.vi.map((c) => c.id)).slice(0, 7); pick.chosen = null; }

const FOCUS_CATS = { love: ['love'], work: ['career'], money: ['money', 'career'], general: ['other', 'verdict', 'timing', 'health'] };
function readingsFor(id, focus) {
  const all = ASK.vi[id] || [];
  let list;
  if (focus === 'study') {
    list = all.filter((a) => /học|thi\b|kỳ thi|trường|điểm số|bài vở/i.test(a[1]));
    if (!list.length) list = all.filter((a) => a[0] === 'career');
  } else {
    const cats = FOCUS_CATS[focus] || FOCUS_CATS.general;
    list = all.filter((a) => cats.indexOf(a[0]) > -1);
    if (!list.length && focus === 'general') list = all.slice();
  }
  return shuffle(list.slice()).slice(0, 2);
}
function insightHTML(id, focus) {
  const c = cardById(id), k = KW.vi[id] || { pos: [], neg: [] };
  // Thu Anh's lists mix real keywords with the odd full-sentence note
  // ("no negative sense seen for this card"); a note reads as a sentence, not
  // inside the keyword template.
  const split = (list) => { const kw = [], notes = []; (list || []).forEach((x) => (x.length > 45 ? notes : kw).push(x)); return { kw: kw.slice(0, 3), notes: notes }; };
  const P = split(k.pos), N = split(k.neg), pos = P.kw, neg = N.kw;
  const enkw = lang === 'en' && c.kw.length ? c.kw : [];
  const qa = readingsFor(id, focus);
  let h = '';
  h += '<div class="ins"><h3>' + esc(T().energyNow) + '</h3>';
  if (pos.length) h += '<p>' + esc(T().energyLine(pos.join(', '))) + '</p>';
  else if (enkw.length) h += '<p>' + esc(T().energyLine(enkw.join(', '))) + '</p>';
  P.notes.forEach((n) => { h += '<p>' + esc(n) + '</p>'; });
  if (lang === 'en' && pos.length) h += '<div class="kw">' + pos.map((x) => '<span>' + esc(x) + '</span>').join('') + '</div>';
  h += '<p>' + esc(c.up) + '</p>';
  h += '<p class="scene">' + esc(c.scene) + '</p></div>';
  h += '<div class="ins"><h3>' + esc(T().shadow) + '</h3>';
  if (neg.length) h += '<p>' + esc(T().shadowLine(neg.join(', '))) + '</p>';
  N.notes.forEach((n) => { h += '<p>' + esc(n) + '</p>'; });
  h += '<p>' + esc(c.rev) + '</p></div>';
  h += '<div class="ins"><h3>' + esc(T().focusHead(T().focus[focus])) + '</h3>';
  if (qa.length) h += qa.map((a) => '<div class="qa"><div class="q">' + esc(a[1]) + '</div><p class="a">' + esc(a[2]) + '</p></div>').join('');
  else h += '<p class="muted">' + esc(T().noFocus) + '</p>';
  h += '</div>';
  h += '<p class="src">' + esc(T().source) + '</p>';
  return h;
}
function renderPick() {
  if (!pick.hand.length) newHand();
  const m = $('#main');
  const focusChips = Object.keys(T().focus).map((f) =>
    '<button class="chip' + (pick.focus === f ? ' on' : '') + '" data-focus="' + f + '">' + esc(T().focus[f]) + '</button>').join('');
  const fan = pick.hand.map((id, i) => {
    const a = (i - 3) * 9;
    const cls = pick.chosen == null ? '' : (pick.chosen === id ? ' chosen' : ' dim');
    return '<div class="slot' + cls + '" style="transform:rotate(' + a + 'deg)"><button data-card="' + id + '" aria-label="' + (i + 1) + '">' + BACK + '</button></div>';
  }).join('');
  m.innerHTML = '<div class="pick-head"><div class="eyebrow">' + esc(T().nav.pick) + '</div><h1>' + esc(T().pickTitle) + '</h1><p>' + esc(T().pickIntro) + '</p></div>'
    + '<div class="faint" style="text-align:center">' + esc(T().focusLabel) + '</div><div class="chips focus">' + focusChips + '</div>'
    + '<div class="fan" id="fan">' + fan + '</div>'
    + '<div class="tap-hint">' + (pick.chosen == null ? esc(T().tapACard) : '') + '</div>'
    + '<div class="reveal" id="reveal"></div>';
  $$('[data-focus]', m).forEach((b) => b.addEventListener('click', () => {
    pick.focus = b.getAttribute('data-focus'); store.set('nabu-focus', pick.focus);
    $$('[data-focus]', m).forEach((x) => x.classList.toggle('on', x === b));
    if (pick.chosen != null) renderReveal(false);
  }));
  $$('[data-card]', m).forEach((b) => b.addEventListener('click', () => {
    if (pick.chosen != null) return;
    pick.chosen = b.getAttribute('data-card');
    $$('.slot', m).forEach((s) => s.classList.add($('button', s) === b ? 'chosen' : 'dim'));
    $('.tap-hint', m).textContent = '';
    renderReveal(true);
    setTimeout(() => { const r = $('#reveal'); if (r) r.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 250);
  }));
  if (pick.chosen != null) renderReveal(false);
}
function renderReveal(animate) {
  const id = pick.chosen, c = cardById(id), other = cardById(id, lang === 'vi' ? 'en' : 'vi');
  const k = KW.vi[id] || { pos: [] };
  const kws = (k.pos || []).slice(0, 3).join(', ') || c.kw.join(', ');
  const r = $('#reveal');
  r.innerHTML = '<div class="eyebrow">' + esc(T().yourCard) + '</div>'
    + '<div class="hero"><div class="flip"><div class="inner"' + (animate ? '' : ' style="animation:none"') + '><span class="face fr">' + faceSVG(c) + '</span><span class="face bk">' + BACK + '</span></div></div>'
    + '<div><div class="name">' + esc(c.name) + '</div><div class="en">' + esc(other.name) + '</div>'
    + '<div class="meta m-' + c.suit + '"><i>' + esc(c.meta) + '</i></div></div></div>'
    + insightHTML(id, pick.focus)
    + '<div class="ins" style="border-color:var(--gold)"><p class="muted" style="margin-bottom:12px">' + esc(T().quickNote) + '</p>'
    + '<div class="row"><a class="btn primary" href="#/book?card=' + id + '">' + esc(T().bookWithCard) + '</a>'
    + '<button class="btn" id="shareCard">' + esc(T().shareCard) + '</button></div></div>'
    + '<button class="btn block" id="redraw" style="margin-top:6px">' + esc(T().redraw) + '</button>';
  $('#shareCard').addEventListener('click', () => shareOrCopy(T().shareText(c.name, kws), appURL()));
  $('#redraw').addEventListener('click', () => { newHand(); renderPick(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
}

/* ============================ booking ============================ */
const book = { topic: null, name: store.get('nabu-name', ''), note: '', card: null };
function composeMessage() {
  const S = T(), lines = [S.msgHello];
  if (book.topic === 'own') lines.push(S.msgTopic + ': ' + S.ownTopic);
  else if (book.topic) { const t = TOPICS[book.topic - 1]; lines.push(S.msgTopic + ': #' + t.id + ' ' + L(t.name)); }
  if (book.name.trim()) lines.push(S.msgName + ': ' + book.name.trim());
  if (book.note.trim()) lines.push(S.msgNote + ': ' + book.note.trim());
  if (book.card) { const c = cardById(book.card); if (c) lines.push(S.msgCard + ': ' + c.name); }
  return lines.join('\n');
}
function renderBook(params) {
  book.card = params.card || null;
  const m = $('#main'), S = T();
  const topics = TOPICS.map((t) => '<button class="topic' + (book.topic === t.id ? ' on open' : '') + '" data-topic="' + t.id + '">'
    + '<div class="t"><span class="ic">' + t.icon + '</span><span><span class="n">#' + t.id + '</span> ' + esc(L(t.name)) + '</span></div>'
    + '<ol>' + t.q[lang].map((q) => '<li>' + esc(q) + '</li>').join('') + '</ol></button>').join('');
  const own = '<button class="topic' + (book.topic === 'own' ? ' on' : '') + '" data-topic="own"><div class="t"><span class="ic">✍️</span><span>' + esc(S.ownTopic) + '</span></div><div class="hint">' + esc(S.ownTopicHint) + '</div></button>';
  const links = [];
  if (CONFIG.instagram) links.push(['https://ig.me/m/' + CONFIG.instagram, S.viaInstagram, 'primary']);
  if (CONFIG.facebookPage) links.push(['https://m.me/' + CONFIG.facebookPage, S.viaMessenger, '']);
  if (CONFIG.zalo) links.push(['https://zalo.me/' + CONFIG.zalo, S.viaZalo, '']);
  if (CONFIG.email) links.push(['mailto:' + CONFIG.email, S.viaEmail, '']);
  m.innerHTML = '<div class="eyebrow">' + esc(CONFIG.brand) + '</div><h1 style="margin-bottom:6px">' + esc(S.bookTitle) + '</h1>'
    + '<p class="muted">' + esc(L(CONFIG.bookingNote)) + '</p>'
    + '<div class="sec"><h2 style="margin:18px 0 4px">' + esc(S.chooseTopic) + '</h2><p class="hint" style="margin-bottom:12px">' + esc(S.topicHint) + '</p>' + topics + own + '</div>'
    + '<div class="sec"><label class="f" for="bname">' + esc(S.yourName) + '</label><input id="bname" value="' + esc(book.name) + '" autocomplete="nickname">'
    + '<label class="f" for="bnote">' + esc(S.yourNote) + '</label><textarea id="bnote" placeholder="' + esc(S.notePlaceholder) + '">' + esc(book.note) + '</textarea>'
    + (book.card ? '<p class="hint">' + esc(S.msgCard) + ': <b>' + esc(cardById(book.card).name) + '</b></p>' : '') + '</div>'
    + '<div class="sec"><h2 style="margin-bottom:6px">' + esc(S.sendVia) + '</h2><p class="hint" style="margin-bottom:8px">' + esc(S.sendHint) + '</p>'
    + '<div class="msgbox" id="msgprev"></div>'
    + '<div class="row" style="flex-direction:column">'
    + links.map((l) => '<a class="btn block ' + l[2] + '" data-send href="' + esc(l[0]) + '" target="_blank" rel="noopener">' + esc(l[1]) + '</a>').join('')
    + '<button class="btn block" data-send="copy">' + esc(S.copyMsg) + '</button></div></div>'
    + '<div class="sec card"><h3 style="margin-bottom:10px">' + esc(S.howItWorks) + '</h3><ol class="steps">'
    + [S.chooseTopic, S.sendVia, L(CONFIG.bookingNote)].map((x) => '<li>' + esc(x) + '</li>').join('') + '</ol></div>'
    + '<div class="sec"><h3 style="margin-bottom:6px">' + esc(S.aboutTitle) + '</h3><p class="muted">' + esc(L(CONFIG.about)) + '</p></div>';
  const prev = () => { $('#msgprev').textContent = composeMessage(); };
  prev();
  $$('[data-topic]', m).forEach((b) => b.addEventListener('click', () => {
    const v = b.getAttribute('data-topic'); const id = v === 'own' ? 'own' : Number(v);
    if (book.topic === id && v !== 'own') { b.classList.toggle('open'); return; }
    book.topic = id;
    $$('[data-topic]', m).forEach((x) => { const on = x === b; x.classList.toggle('on', on); x.classList.toggle('open', on); });
    prev();
  }));
  $('#bname').addEventListener('input', (e) => { book.name = e.target.value; store.set('nabu-name', book.name); prev(); });
  $('#bnote').addEventListener('input', (e) => { book.note = e.target.value; prev(); });
  $$('[data-send]', m).forEach((el) => el.addEventListener('click', (e) => {
    if (!book.topic) { e.preventDefault(); toast(S.needTopic); $$('[data-topic]', m)[0].scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    const msg = composeMessage();
    if (el.getAttribute('data-send') === 'copy') { copyText(msg).then(() => toast(S.copied)); return; }
    if (el.getAttribute('href').indexOf('mailto:') === 0) {
      el.setAttribute('href', 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent(CONFIG.brand) + '&body=' + encodeURIComponent(msg));
      return;
    }
    copyText(msg); toast(S.copied);
  }));
}

/* ============================ composer (#/admin) ============================ */
const admin = { editing: null, cards: [], busy: false };
const ghHeaders = (token) => ({ Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' });
const b64enc = (s) => btoa(unescape(encodeURIComponent(s)));
const b64dec = (s) => decodeURIComponent(escape(atob(s.replace(/\n/g, ''))));
async function ghRead(token) {
  const r = await fetch('https://api.github.com/repos/' + CONFIG.repo + '/contents/' + CONFIG.postsPath + '?ref=' + CONFIG.branch, { headers: ghHeaders(token), cache: 'no-store' });
  if (r.status === 404) return { sha: null, posts: [] };
  if (!r.ok) throw new Error('GET ' + r.status);
  const j = await r.json();
  return { sha: j.sha, posts: (JSON.parse(b64dec(j.content)).posts || []) };
}
async function ghWrite(token, posts, sha, message) {
  const body = { message: message, content: b64enc(JSON.stringify({ posts: posts }, null, 1)), branch: CONFIG.branch };
  if (sha) body.sha = sha;
  const r = await fetch('https://api.github.com/repos/' + CONFIG.repo + '/contents/' + CONFIG.postsPath, { method: 'PUT', headers: ghHeaders(token), body: JSON.stringify(body) });
  if (!r.ok) { let t = ''; try { t = (await r.json()).message; } catch (e) { /* ignore */ } throw new Error('PUT ' + r.status + ' ' + t); }
}
function formPost() {
  const v = (id) => $(id).value.trim();
  const today = new Date(); const iso = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
  const p = {
    id: admin.editing || (v('#pdate') || iso) + '-' + Math.random().toString(36).slice(2, 6),
    date: v('#pdate') || iso,
    title: { vi: v('#ptitle'), en: v('#ptitle_en') },
    body: { vi: v('#pbody'), en: v('#pbody_en') },
    cards: admin.cards.slice(),
    markers: {
      initials: v('#pinit').split(/[,\s]+/).map((x) => x.trim().toUpperCase()).filter(Boolean),
      signs: $$('[data-sign].on').map((b) => Number(b.getAttribute('data-sign')))
    },
    pinned: $('#ppin').checked
  };
  if (!p.title.en) delete p.title.en;
  if (!p.body.en) delete p.body.en;
  return p;
}
function fillForm(p) {
  admin.editing = p ? p.id : null;
  admin.cards = p ? (p.cards || []).slice() : [];
  $('#pdate').value = p ? p.date : '';
  $('#ptitle').value = p ? L2(p.title, 'vi') : ''; $('#ptitle_en').value = p ? L2(p.title, 'en') : '';
  $('#pbody').value = p ? L2(p.body, 'vi') : ''; $('#pbody_en').value = p ? L2(p.body, 'en') : '';
  $('#pinit').value = p && p.markers && p.markers.initials ? p.markers.initials.join(', ') : '';
  const signs = p && p.markers && p.markers.signs ? p.markers.signs : [];
  $$('[data-sign]').forEach((b) => b.classList.toggle('on', signs.indexOf(Number(b.getAttribute('data-sign'))) > -1));
  $('#ppin').checked = !!(p && p.pinned);
  $$('#cgrid button').forEach((b) => b.classList.toggle('on', admin.cards.indexOf(b.getAttribute('data-cid')) > -1));
  $('#formhead').textContent = p ? T().edit + ': ' + L2(p.title, 'vi') : T().newPost;
}
const L2 = (obj, lg) => (obj == null ? '' : typeof obj === 'string' ? obj : (obj[lg] || ''));
async function renderAdmin() {
  const m = $('#main'), S = T();
  const token = store.get('nabu-gh-token', '');
  m.innerHTML = '<div class="eyebrow">' + esc(CONFIG.brand) + '</div><h1 style="margin-bottom:6px">' + esc(S.adminTitle) + '</h1><p class="muted">' + esc(S.adminIntro) + '</p>'
    + '<div class="card"><label class="f" for="gtoken">' + esc(S.token) + '</label><div class="row"><input id="gtoken" type="password" value="' + esc(token) + '" style="flex:1" autocomplete="off"><button class="btn sm" id="savetoken">' + esc(S.saveToken) + '</button></div><p class="hint">' + esc(S.tokenHint) + ' (' + esc(CONFIG.repo) + ')</p></div>'
    + '<div class="card"><h3 id="formhead" style="margin-bottom:4px">' + esc(S.newPost) + '</h3>'
    + '<label class="f" for="pdate">' + esc(S.postDate) + '</label><input id="pdate" type="date">'
    + '<label class="f" for="ptitle">' + esc(S.postTitle) + '</label><input id="ptitle">'
    + '<label class="f" for="pbody">' + esc(S.postBody) + '</label><textarea id="pbody" style="min-height:160px"></textarea><p class="hint">' + esc(S.bodyHint) + '</p>'
    + '<label class="f" for="ptitle_en">' + esc(S.postTitleEn) + '</label><input id="ptitle_en">'
    + '<label class="f" for="pbody_en">' + esc(S.postBodyEn) + '</label><textarea id="pbody_en"></textarea>'
    + '<label class="f" for="csearch">' + esc(S.postCards) + '</label><input id="csearch" placeholder="' + esc(S.searchCard) + '" style="margin-bottom:8px">'
    + '<div class="grid" id="cgrid">' + DECK[lang].map((c) => '<button data-cid="' + c.id + '" data-name="' + esc((c.name + ' ' + cardById(c.id, lang === 'vi' ? 'en' : 'vi').name).toLowerCase()) + '">' + faceSVG(c) + '</button>').join('') + '</div>'
    + '<div class="mini" id="csel"></div>'
    + '<label class="f" for="pinit">' + esc(S.markInitials) + '</label><input id="pinit" placeholder="C, E, H">'
    + '<label class="f">' + esc(S.markSigns) + '</label><div class="chips">' + S.zodiac.map((z, i) => '<button class="chip" data-sign="' + i + '">' + esc(z) + '</button>').join('') + '</div>'
    + '<label class="f" style="display:flex;gap:8px;align-items:center;margin-top:16px"><input type="checkbox" id="ppin" style="width:auto">' + esc(S.pinPost) + '</label>'
    + '<div class="row" style="margin-top:16px"><button class="btn primary" id="publish">' + esc(S.publish) + '</button><button class="btn" id="preview">' + esc(S.preview) + '</button><button class="btn" id="copyjson">' + esc(S.copyJson) + '</button><button class="btn" id="clear">' + esc(S.newPost) + '</button></div>'
    + '<p id="status" class="hint"></p><div id="pprev"></div></div>'
    + '<div class="card"><h3 style="margin-bottom:6px">' + esc(S.existing) + '</h3><div class="plist" id="plist"><p class="hint">…</p></div></div>';

  const status = (msg, cls) => { const s = $('#status'); s.textContent = msg; s.className = 'hint ' + (cls || ''); };
  const syncSel = () => {
    $$('#cgrid button').forEach((b) => b.classList.toggle('on', admin.cards.indexOf(b.getAttribute('data-cid')) > -1));
    $('#csel').innerHTML = admin.cards.map(miniHTML).join('');
  };
  $('#savetoken').addEventListener('click', () => { store.set('nabu-gh-token', $('#gtoken').value.trim()); toast('✓'); refreshList(); });
  $('#csearch').addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    $$('#cgrid button').forEach((b) => { b.style.display = !q || b.getAttribute('data-name').indexOf(q) > -1 ? '' : 'none'; });
  });
  $$('#cgrid button').forEach((b) => b.addEventListener('click', () => {
    const id = b.getAttribute('data-cid'), i = admin.cards.indexOf(id);
    if (i > -1) admin.cards.splice(i, 1); else admin.cards.push(id);
    syncSel();
  }));
  $$('[data-sign]', m).forEach((b) => b.addEventListener('click', () => b.classList.toggle('on')));
  $('#preview').addEventListener('click', () => { const p = formPost(); $('#pprev').innerHTML = postHTML(p, true); bindPost($('#pprev')); });
  $('#copyjson').addEventListener('click', () => copyText(JSON.stringify(formPost(), null, 1)).then(() => toast(S.copied)));
  $('#clear').addEventListener('click', () => { fillForm(null); syncSel(); $('#pprev').innerHTML = ''; });

  async function refreshList() {
    const tk = store.get('nabu-gh-token', '');
    const box = $('#plist');
    let posts = POSTS || store.get('nabu-posts', []);
    if (tk) { try { posts = (await ghRead(tk)).posts; } catch (e) { box.innerHTML = '<p class="hint err">' + esc(String(e.message)) + '</p>'; return; } }
    else if (POSTS == null) { await loadPosts(); posts = POSTS; }
    box.innerHTML = posts.length ? posts.slice().sort((a, b) => String(b.date).localeCompare(String(a.date))).map((p) =>
      '<div class="it"><div class="tt"><div>' + (p.pinned ? '★ ' : '') + esc(L2(p.title, 'vi') || L2(p.title, 'en')) + '</div><div class="d">' + esc(p.date) + '</div></div>'
      + '<button class="btn sm" data-edit="' + esc(p.id) + '">' + esc(S.edit) + '</button><button class="btn sm" data-del="' + esc(p.id) + '">' + esc(S.del) + '</button></div>').join('')
      : '<p class="hint">' + esc(S.feedEmpty) + '</p>';
    $$('[data-edit]', box).forEach((b) => b.addEventListener('click', () => {
      const p = posts.filter((x) => x.id === b.getAttribute('data-edit'))[0];
      fillForm(p); syncSel(); $('#formhead').scrollIntoView({ behavior: 'smooth' });
    }));
    $$('[data-del]', box).forEach((b) => b.addEventListener('click', async () => {
      if (!confirm(S.confirmDel)) return;
      const tk2 = store.get('nabu-gh-token', ''); if (!tk2) { status(S.needToken, 'err'); return; }
      try {
        const cur = await ghRead(tk2);
        await ghWrite(tk2, cur.posts.filter((x) => x.id !== b.getAttribute('data-del')), cur.sha, 'Remove post ' + b.getAttribute('data-del'));
        POSTS = null; toast('✓'); refreshList();
      } catch (e) { status(S.publishFail + ': ' + e.message, 'err'); }
    }));
  }
  $('#publish').addEventListener('click', async () => {
    if (admin.busy) return;
    const tk = store.get('nabu-gh-token', '') || $('#gtoken').value.trim();
    if (!tk) { status(S.needToken, 'err'); return; }
    const p = formPost();
    if (!L2(p.title, 'vi') && !L2(p.title, 'en') || !L2(p.body, 'vi') && !L2(p.body, 'en')) { status(S.needBody, 'err'); return; }
    admin.busy = true; $('#publish').textContent = S.publishing; status('');
    try {
      const cur = await ghRead(tk);
      const rest = cur.posts.filter((x) => x.id !== p.id);
      await ghWrite(tk, [p].concat(rest), cur.sha, (admin.editing ? 'Update post: ' : 'New post: ') + (L2(p.title, 'vi') || L2(p.title, 'en')));
      status(S.published, 'ok'); POSTS = null; fillForm(null); syncSel(); refreshList();
    } catch (e) { status(S.publishFail + ': ' + e.message, 'err'); }
    admin.busy = false; $('#publish').textContent = S.publish;
  });
  fillForm(null); syncSel();
  refreshList();
}

/* ============================ install hint ============================ */
function isIOS() { return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream; }
function standalone() { return window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches; }
function installBanner() {
  if (!isIOS() || standalone() || store.get('nabu-install-hint', false)) return '';
  return '<div class="banner" id="ihint"><span>' + esc(T().install) + '</span><button data-dismiss>' + esc(T().dismiss) + '</button></div>';
}
function bindBanner(root) {
  const b = $('[data-dismiss]', root);
  if (b) b.addEventListener('click', () => { store.set('nabu-install-hint', true); $('#ihint').remove(); });
}

/* ============================ router ============================ */
function parseHash() {
  const h = location.hash.replace(/^#\/?/, '');
  const q = h.split('?'), path = q[0].split('/'), params = {};
  (q[1] || '').split('&').forEach((kv) => { if (!kv) return; const p = kv.split('='); params[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || ''); });
  return { route: path[0] || 'feed', arg: path[1] || '', params: params };
}
function route() {
  const r = parseHash();
  const nav = { feed: 'feed', post: 'feed', pick: 'pick', book: 'book', admin: '' }[r.route];
  if (nav === undefined) { location.hash = '#/feed'; return; }
  renderChrome(nav);
  window.scrollTo(0, 0);
  if (r.route === 'feed') renderFeed();
  else if (r.route === 'post') renderPost(r.arg);
  else if (r.route === 'pick') renderPick();
  else if (r.route === 'book') renderBook(r.params);
  else if (r.route === 'admin') renderAdmin();
}
window.addEventListener('hashchange', route);
$('#lang').addEventListener('click', () => { lang = lang === 'vi' ? 'en' : 'vi'; store.set('nabu-lang', lang); route(); });
$('#theme').addEventListener('click', () => { store.set('nabu-theme', store.get('nabu-theme', '') === 'light' ? '' : 'light'); applyTheme(); });
/* handle for the headless tests */
window.NABU = { DECK: DECK, KW: KW, ASK: ASK, TOPICS: TOPICS, pick: pick, insightHTML: insightHTML };

applyTheme();
route();

/* ============================ offline ============================ */
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.register('sw.js').then((reg) => {
      const w = reg.installing;
      if (w && !hadController) w.addEventListener('statechange', () => { if (w.state === 'activated') toast(T().offlineReady); });
    }).catch(() => {});
  });
}
