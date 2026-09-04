/* ============================ Nabu Tarot: core ============================
   Utilities, language and theme, the deck, the logo, the chrome and the
   router. Screen modules register themselves in ROUTES. */

const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } }
};
const pad2 = (n) => String(n).padStart(2, '0');
const isoDate = (d) => d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());

/* ---- language + theme ---- */
let lang = store.get('nabu-lang', 'vi');
if (LANGS.indexOf(lang) < 0) lang = 'vi';
const T = () => STR[lang];
const L = (obj) => { if (obj == null) return ''; if (typeof obj === 'string') return obj; return obj[lang] || obj.vi || obj.en || ''; };
const L2 = (obj, lg) => (obj == null ? '' : typeof obj === 'string' ? obj : (obj[lg] || ''));

const darkMQ = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : { matches: false, addEventListener: () => {} };
function themeChoice() { const t = store.get('nabu-theme', ''); return t === 'dark' || t === 'light' ? t : 'auto'; }
function effectiveTheme() { const t = themeChoice(); return t === 'auto' ? (darkMQ.matches ? 'dark' : 'light') : t; }
function setTheme(t) { store.set('nabu-theme', t === 'auto' ? '' : t); applyTheme(); }
function applyTheme() {
  const t = themeChoice();
  if (t === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', t);
  const dark = effectiveTheme() === 'dark';
  $('#theme').textContent = dark ? '☀️' : '🌙';
  $('meta[name="theme-color"]').setAttribute('content', dark ? '#241A45' : '#EFE9FA');
}
darkMQ.addEventListener('change', applyTheme);

/* ---- profile (local first; backend.js syncs it when signed in) ---- */
let PROFILE = Object.assign({ name: '', birthday: '', interests: [], tourDone: false }, store.get('nabu-profile', {}));
function saveProfileLocal(p) { PROFILE = Object.assign(PROFILE, p); store.set('nabu-profile', PROFILE); }
function birthParts() {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(PROFILE.birthday || '');
  return m ? { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) } : null;
}
function mySign() { const b = birthParts(); return b ? sunSignIndex(b.m, b.d) : -1; }

/* ---- course access ----
   Codes: NABU-T-YYMMDD-XXXX (T = tarot, L = lenormand), the date is the expiry
   and XXXX a checksum over date + CONFIG.courseSecret. Checked on the device;
   good enough to keep casual sharing in check, not a bank vault. */
const ACCESS = {
  get() { return store.get('nabu-access', {}); },
  has(course) { const a = this.get()[course]; return !!a && a >= isoDate(new Date()); },
  grant(course, until) { const a = this.get(); a[course] = until; store.set('nabu-access', a); if (window.BE && BE.user) BE.pushProfile(); }
};
function courseHash(str) {
  let h1 = 0x811c9dc5, h2 = 5381;
  for (let i = 0; i < str.length; i++) { const c = str.charCodeAt(i); h1 = Math.imul(h1 ^ c, 16777619) >>> 0; h2 = (Math.imul(h2, 33) + c) >>> 0; }
  return (h1.toString(36) + h2.toString(36)).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(-4).padStart(4, 'X');
}
function makeCode(course, untilISO) {
  const d = untilISO.replace(/-/g, '').slice(2), Lt = course === 'tarot' ? 'T' : 'L';
  return 'NABU-' + Lt + '-' + d + '-' + courseHash(Lt + d + CONFIG.courseSecret);
}
function parseCode(code) {
  const m = /^NABU-([TL])-(\d{6})-([A-Z0-9]{4})$/.exec(String(code || '').trim().toUpperCase().replace(/\s+/g, ''));
  if (!m || courseHash(m[1] + m[2] + CONFIG.courseSecret) !== m[3]) return null;
  return { course: m[1] === 'T' ? 'tarot' : 'lenormand', until: '20' + m[2].slice(0, 2) + '-' + m[2].slice(2, 4) + '-' + m[2].slice(4, 6) };
}
function addMonths(iso, n) { const d = new Date(iso + 'T00:00:00'); d.setMonth(d.getMonth() + n); return isoDate(d); }

/* ---- the deck ---- */
function buildDeck(lg) {
  const X = LEX[lg], D = DECKTEXT[lg], out = [];
  D.majors.forEach((m, i) => {
    out.push({ id: 'major-' + i, suit: 'major', badge: ROMAN[i], name: m[0], meta: X.suitNames.major + ' · ' + ROMAN[i],
      kw: m[1].split(' · '), scene: m[2], up: m[3], rev: m[4], art: MAJOR_ART[i] });
  });
  SUIT_KEYS.forEach((suit) => {
    const S = D.minors[suit], sn = X.suitNames[suit], el = X.elements[suit];
    S.pips.forEach((p, i) => {
      out.push({ id: suit + '-' + (i + 1), suit: suit, badge: '', name: X.pipName(X.numbers[i], sn), meta: sn + ' · ' + el,
        kw: [], scene: p[0], up: p[1], rev: p[2], art: ART_CACHE[suit + '-' + (i + 1)] });
    });
    S.court.forEach((c, i) => {
      out.push({ id: suit + '-c' + i, suit: suit, badge: '', name: X.courtName(X.courts[i], sn), meta: sn + ' · ' + el + ' · ' + X.courtTag,
        kw: [], scene: c[0], up: c[1], rev: c[2], art: ART_CACHE[suit + '-c' + i] });
    });
  });
  return out;
}
const DECK = { vi: buildDeck('vi'), en: buildDeck('en') };
const INDEX = {};
LANGS.forEach((lg) => { INDEX[lg] = {}; DECK[lg].forEach((c) => { INDEX[lg][c.id] = c; }); });
const cardById = (id, lg) => INDEX[lg || lang][id];
/* Insight fields for a card in the current language. */
function insightOf(id, lg) {
  const r = (INSIGHT[lg || lang] || {})[id];
  if (!r) return null;
  return { pos: r[0].split('|'), neg: r[1].split('|'), now: r[2], love: r[3], work: r[4], study: r[5], money: r[6], advice: r[7] };
}

function faceSVG(card) {
  const b = card.badge;
  const numeral = b
    ? '<g><rect x="' + (50 - Math.max(9, b.length * 3.4)) + '" y="6" width="' + Math.max(18, b.length * 6.8) + '" height="15" fill="var(--card-bg)" stroke="var(--card-ink)" stroke-width="1"/>'
      + '<text x="50" y="17.2" text-anchor="middle" font-family="Georgia,serif" font-size="9.5" fill="var(--card-ink)">' + b + '</text></g>' : '';
  return '<svg viewBox="0 0 100 172" role="img" aria-label="' + esc(card.name) + '">'
    + '<rect x="1.3" y="1.3" width="97.4" height="169.4" rx="3" fill="var(--card-bg)" stroke="var(--card-ink)" stroke-width="2.6"/>'
    + '<g stroke="var(--card-ink)" stroke-linejoin="round" stroke-linecap="round" fill="none">' + card.art
    + '<rect x="5" y="5" width="90" height="135" fill="none" stroke-width="1"/><rect x="5" y="140" width="90" height="27" fill="none" stroke-width="1"/></g>' + numeral
    + '<text x="50" y="157" text-anchor="middle" font-family="Be Vietnam Pro, sans-serif" font-size="' + (card.name.length > 16 ? 6.2 : 7.4) + '" fill="var(--card-ink)">' + esc(card.name) + '</text></svg>';
}
/* Card back drawn after the logo: purple card, gold crescent, three gold dots. */
function backSVG() {
  return '<svg viewBox="0 0 100 172" aria-hidden="true">'
    + '<rect x="1.3" y="1.3" width="97.4" height="169.4" rx="8" fill="var(--back-1)" stroke="#2A1D4E" stroke-width="2.6"/>'
    + '<rect x="9" y="9" width="82" height="154" rx="5" fill="var(--back-2)" stroke="#E5BE5E" stroke-width="1.4"/>'
    + '<path d="M56 60 A26 26 0 1 0 56 112 A21 21 0 1 1 56 60 Z" fill="#E5BE5E"/>'
    + '<circle cx="28" cy="34" r="3.2" fill="#E5BE5E"/><circle cx="30" cy="140" r="3.2" fill="#E5BE5E"/><circle cx="74" cy="134" r="3.2" fill="#E5BE5E"/>'
    + '</svg>';
}
const BACK = backSVG();
const miniHTML = (id, link) => {
  const c = cardById(id);
  if (!c) return '';
  const inner = '<span class="face">' + faceSVG(c) + '</span>' + esc(c.name);
  return link ? '<button class="m" data-open-card="' + id + '">' + inner + '</button>' : '<div class="m">' + inner + '</div>';
};

/* The logo: cream disc, three fanned cards (blue, purple, pink), gold crescent. */
const LOGO = '<svg viewBox="0 0 100 100" aria-hidden="true">'
  + '<circle cx="50" cy="50" r="48" fill="#FBF3F5"/><circle cx="50" cy="50" r="44" fill="none" stroke="#3B2A5E" stroke-width="1.6"/>'
  + '<g transform="rotate(-18 50 62)"><rect x="34" y="30" width="26" height="42" rx="4" fill="#AFC8F0" stroke="#3B2A5E" stroke-width="2"/></g>'
  + '<g transform="rotate(18 50 62)"><rect x="40" y="30" width="26" height="42" rx="4" fill="#F6BBCB" stroke="#3B2A5E" stroke-width="2"/></g>'
  + '<rect x="37" y="26" width="26" height="44" rx="4" fill="#3D2A6E" stroke="#3B2A5E" stroke-width="2"/>'
  + '<rect x="40" y="29" width="20" height="38" rx="2.5" fill="none" stroke="#E5BE5E" stroke-width="1"/>'
  + '<path d="M52 38 A9 9 0 1 0 52 56 A7 7 0 1 1 52 38 Z" fill="#E5BE5E"/>'
  + '<circle cx="43.5" cy="33" r="1.3" fill="#E5BE5E"/><circle cx="44" cy="63" r="1.3" fill="#E5BE5E"/><circle cx="56.5" cy="62" r="1.3" fill="#E5BE5E"/>'
  + '<path d="M22 24 l1.6 3.4 3.4 1.6 -3.4 1.6 -1.6 3.4 -1.6 -3.4 -3.4 -1.6 3.4 -1.6z" fill="#E5BE5E"/>'
  + '<path d="M80 70 l1.2 2.6 2.6 1.2 -2.6 1.2 -1.2 2.6 -1.2 -2.6 -2.6 -1.2 2.6 -1.2z" fill="#F6BBCB"/>'
  + '</svg>';

/* ---- chrome ---- */
const ICONS = {
  home: '<svg viewBox="0 0 24 24"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
  pick: '<svg viewBox="0 0 24 24"><rect x="6" y="3" width="12" height="18" rx="2"/><path d="M12 8l1.5 3 3 .4-2.2 2.1.6 3.2L12 15.2 9.1 16.7l.6-3.2L7.5 11.4l3-.4z"/></svg>',
  learn: '<svg viewBox="0 0 24 24"><path d="M4 5a2 2 0 0 1 2-2h5v18H6a2 2 0 0 1-2-2zM13 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5z"/></svg>',
  book: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  me: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>'
};
let UNREAD = 0;
function renderChrome(route) {
  document.documentElement.setAttribute('lang', lang);
  $('#brand').innerHTML = LOGO + esc(CONFIG.brand);
  $('#lang').textContent = T().lang;
  $('#nav').innerHTML = ['home', 'pick', 'learn', 'book', 'me'].map((k) =>
    '<a href="#/' + k + '" class="' + (route === k ? 'on' : '') + '">' + ICONS[k] + '<span>' + esc(T().nav[k]) + '</span>'
    + (k === 'me' && UNREAD ? '<span class="badge">' + UNREAD + '</span>' : '') + '</a>').join('');
}
let toastTimer = null;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
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
function fmtDate(s) { const d = new Date(String(s) + 'T00:00:00'); return isNaN(d) ? esc(s) : T().dateFmt(d); }
function paras(text) {
  return String(text || '').split(/\n\s*\n/).filter((x) => x.trim()).map((p) => '<p>' + esc(p.trim()).replace(/\n/g, '<br>') + '</p>').join('');
}
function bindAccordions(root) {
  $$('.acc > button', root).forEach((b) => b.addEventListener('click', () => b.parentNode.classList.toggle('open')));
}
function bindCardLinks(root) {
  $$('[data-open-card]', root).forEach((b) => b.addEventListener('click', () => { location.hash = '#/learn/card/' + b.getAttribute('data-open-card'); }));
}

/* ---- remote JSON with an offline copy ---- */
async function loadJSON(path, key) {
  try {
    const r = await fetch(path + '?t=' + Date.now(), { cache: 'no-store' });
    if (r.ok) { const j = await r.json(); store.set(key, j); return { data: j, fromCache: false }; }
  } catch (e) { /* offline */ }
  return { data: store.get(key, null), fromCache: true };
}

/* ---- router ---- */
const ROUTES = {};
function parseHash() {
  const h = location.hash.replace(/^#\/?/, '');
  const q = h.split('?'), path = q[0].split('/'), params = {};
  (q[1] || '').split('&').forEach((kv) => { if (!kv) return; const p = kv.split('='); params[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || ''); });
  return { route: path[0] || 'home', args: path.slice(1), params: params };
}
function route() {
  const r = parseHash();
  const def = ROUTES[r.route];
  if (!def) { location.hash = '#/home'; return; }
  renderChrome(def.nav);
  window.scrollTo(0, 0);
  def.render(r.args, r.params);
}
function boot() {
  window.addEventListener('hashchange', route);
  $('#lang').addEventListener('click', () => { lang = lang === 'vi' ? 'en' : 'vi'; store.set('nabu-lang', lang); route(); });
  $('#theme').addEventListener('click', () => setTheme(effectiveTheme() === 'dark' ? 'light' : 'dark'));
  applyTheme();
  route();
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => {
      const had = !!navigator.serviceWorker.controller;
      // A new release takes over on the next open; reload once so the visitor
      // sees it right away instead of the cached page.
      navigator.serviceWorker.addEventListener('controllerchange', () => { if (had && !window.__reloaded) { window.__reloaded = true; location.reload(); } });
      navigator.serviceWorker.register('sw.js').then((reg) => {
        const w = reg.installing;
        if (w && !had) w.addEventListener('statechange', () => { if (w.state === 'activated') toast(T().offlineReady); });
        reg.update().catch(() => {});
      }).catch(() => {});
    });
  }
}
