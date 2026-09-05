/* ============================ Nabu Tarot: core ============================
   Utilities, language and theme, the deck, the logo, the chrome and the
   router. Screen modules register themselves in ROUTES. */

const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } },
  del(k) { try { localStorage.removeItem(k); } catch (e) { /* private mode */ } }
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
const THEMES = ['light', 'dark', 'pink'];
function themeChoice() { const t = store.get('nabu-theme', ''); return THEMES.indexOf(t) > -1 ? t : 'auto'; }
function effectiveTheme() { const t = themeChoice(); return t === 'auto' ? (darkMQ.matches ? 'dark' : 'light') : t; }
function setTheme(t) { store.set('nabu-theme', t === 'auto' ? '' : t); applyTheme(); }
function applyTheme() {
  const t = themeChoice();
  if (t === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', t);
  const cur = effectiveTheme();
  // The pill shows the theme that comes next: light → dark → pink → light.
  $('#theme').textContent = cur === 'light' ? '🌙' : cur === 'dark' ? '🌸' : '☀️';
  $('meta[name="theme-color"]').setAttribute('content', cur === 'dark' ? '#241A45' : cur === 'pink' ? '#FBEEF2' : '#EFE9FA');
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
  // Nabu (any admin email) always has every course open.
  // Admins: true as soon as sign-in resolves, and remembered on the device so a
  // cold start does not flash the paywall before Firebase answers.
  // BE is a top-level const (not on window), so test for it with typeof.
  isAdmin() { const be = typeof BE !== 'undefined' ? BE : null; return !!((be && be.user && be.isAdmin()) || (!(be && be.ready) && store.get('nabu-admin', ''))); },
  has(course) { if (this.isAdmin()) return true; const a = this.get()[course]; return !!a && a >= isoDate(new Date()); },
  grant(course, until) { const a = this.get(); a[course] = until; store.set('nabu-access', a); if (typeof BE !== 'undefined' && BE.user) BE.pushProfile(); }
};
function courseHash(str) {
  let h1 = 0x811c9dc5, h2 = 5381;
  for (let i = 0; i < str.length; i++) { const c = str.charCodeAt(i); h1 = Math.imul(h1 ^ c, 16777619) >>> 0; h2 = (Math.imul(h2, 33) + c) >>> 0; }
  return (h1.toString(36) + h2.toString(36)).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(-4).padStart(4, 'X');
}
function makeCode(course, untilISO) {
  const d = untilISO.replace(/-/g, '').slice(2), Lt = course === 'tarot' ? 'T' : course === 'manifest' ? 'M' : course === 'playing' ? 'P' : 'L';
  return 'NABU-' + Lt + '-' + d + '-' + courseHash(Lt + d + CONFIG.courseSecret);
}
function parseCode(code) {
  const m = /^NABU-([TLMP])-(\d{6})-([A-Z0-9]{4})$/.exec(String(code || '').trim().toUpperCase().replace(/\s+/g, ''));
  if (!m || courseHash(m[1] + m[2] + CONFIG.courseSecret) !== m[3]) return null;
  return { course: m[1] === 'T' ? 'tarot' : m[1] === 'M' ? 'manifest' : m[1] === 'P' ? 'playing' : 'lenormand', until: '20' + m[2].slice(0, 2) + '-' + m[2].slice(2, 4) + '-' + m[2].slice(4, 6) };
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
/* Card back drawn after the logo: purple card, gold crescent, and a gold dot
   toward each of the four corners of the frame. */
function backSVG() {
  return '<svg viewBox="0 0 100 172" aria-hidden="true">'
    + '<rect x="1.3" y="1.3" width="97.4" height="169.4" rx="8" fill="var(--back-1)" stroke="#2A1D4E" stroke-width="2.6"/>'
    + '<rect x="9" y="9" width="82" height="154" rx="5" fill="var(--back-2)" stroke="#E5BE5E" stroke-width="1.4"/>'
    + '<path d="M56 60 A26 26 0 1 0 56 112 A21 21 0 1 1 56 60 Z" fill="#E5BE5E"/>'
    + [[26, 32], [74, 32], [26, 140], [74, 140]].map((p) => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.4" fill="#E5BE5E"/>').join('')
    + '</svg>';
}
const BACK = backSVG();
/* The logo's three cards, for the home block. */
function logoCardSVG(kind) {
  const fill = kind === 'blue' ? '#AFC8F0' : kind === 'pink' ? '#F6BBCB' : '#3D2A6E';
  let mark = '';
  if (kind === 'blue') mark = '<path d="M50 60 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4z" fill="#E5BE5E"/><circle cx="50" cy="108" r="3" fill="#E5BE5E"/>';
  else if (kind === 'pink') mark = '<path d="M50 62 l3 6.5 6.5 3 -6.5 3 -3 6.5 -3 -6.5 -6.5 -3 6.5 -3z" fill="#E5BE5E"/><path d="M50 98 l2 4.4 4.4 2 -4.4 2 -2 4.4 -2 -4.4 -4.4 -2 4.4 -2z" fill="#E5BE5E"/>';
  else mark = '<path d="M56 60 A26 26 0 1 0 56 112 A21 21 0 1 1 56 60 Z" fill="#E5BE5E"/><circle cx="28" cy="34" r="3.2" fill="#E5BE5E"/><circle cx="30" cy="140" r="3.2" fill="#E5BE5E"/><circle cx="74" cy="134" r="3.2" fill="#E5BE5E"/>';
  return '<svg viewBox="0 0 100 172" aria-hidden="true"><rect x="1.3" y="1.3" width="97.4" height="169.4" rx="10" fill="' + fill + '" stroke="#3B2A5E" stroke-width="3"/>'
    + '<rect x="10" y="10" width="80" height="152" rx="6" fill="none" stroke="#E5BE5E" stroke-width="1.6"/>' + mark + '</svg>';
}
const miniHTML = (id, link) => {
  const c = cardById(id);
  if (!c) return '';
  const inner = '<span class="face">' + faceSVG(c) + '</span>' + esc(c.name);
  return link ? '<button class="m" data-open-card="' + id + '">' + inner + '</button>' : '<div class="m">' + inner + '</div>';
};

/* The logo: cream disc, three fanned cards (blue, purple, pink), gold crescent. */
const LOGO = '<span class="lockup" aria-label="Nabu Tarot"><img src="' + LOGO_PNG + '" alt="" class="avatar"><span class="word">Nabu Tarot</span></span>';

/* ---- chrome ---- */
const ICONS = {
  home: '<svg viewBox="0 0 24 24"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
  pick: '<svg viewBox="0 0 24 24"><rect x="4.5" y="5" width="11" height="16" rx="2" transform="rotate(-10 10 13)"/><rect x="9" y="3.5" width="11" height="16" rx="2" transform="rotate(8 14.5 11.5)"/><path d="M16.2 8.2a2.3 2.3 0 1 0 0 4.2 1.8 1.8 0 1 1 0-4.2z"/></svg>',
  learn: '<svg viewBox="0 0 24 24"><path d="M4 5a2 2 0 0 1 2-2h5v18H6a2 2 0 0 1-2-2zM13 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5z"/></svg>',
  book: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  play: '<svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="4"/><circle cx="8.5" cy="8.5" r="1.3" fill="currentColor"/><circle cx="15.5" cy="8.5" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="8.5" cy="15.5" r="1.3" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.3" fill="currentColor"/></svg>',
  me: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>'
};
let UNREAD = 0, NEWBK = 0;
/* Notifications for Nabu: a system notification when the browser allows it
   (Android, desktop, and iPhone once the app is on the home screen), and
   always a toast while the app is open. */
function notifyAdmin(title, body, hash) {
  toast(title + (body ? ': ' + body : ''));
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    const n = new Notification(title, { body: body || '', icon: 'icon-180.png', badge: 'icon-180.png', tag: hash || 'nabu' });
    n.onclick = () => { window.focus(); if (hash) location.hash = hash; n.close(); };
  } catch (e) { /* some browsers only allow this from a service worker */ }
}
function notifyState() { return !('Notification' in window) ? 'unsupported' : Notification.permission; }
async function askNotify() { if (!('Notification' in window)) return 'unsupported'; try { return await Notification.requestPermission(); } catch (e) { return Notification.permission; } }
function renderFooter() {
  const S = T(), links = [];
  if (CONFIG.instagram) links.push('<a href="https://instagram.com/' + esc(CONFIG.instagram) + '" target="_blank" rel="noopener" title="Instagram">IG</a>');
  if (CONFIG.facebookUrl) links.push('<a href="' + esc(CONFIG.facebookUrl) + '" target="_blank" rel="noopener" title="Facebook">FB</a>');
  links.push('<a href="#/contact">' + esc(S.contactLink) + '</a>');
  links.push('<a href="#/install">' + esc(S.installLink) + '</a>');
  links.push('<a href="#/privacy">' + esc(S.privacyLink) + '</a>');
  links.push('<a href="#/report">' + esc(S.reportLink) + '</a>');
  $('#foot').innerHTML = '<div class="wrap">' + LOGO + '<div>' + esc(L(CONFIG.tagline)) + '<div class="links">' + links.join(' · ') + '</div><div class="copy">© ' + new Date().getFullYear() + ' ' + esc(CONFIG.brand) + '. ' + esc(S.rights) + '</div></div></div>';
}
function renderChrome(route) {
  document.documentElement.setAttribute('lang', lang);
  renderFooter();
  $('#brand').innerHTML = LOGO;
  $('#lang').textContent = T().lang;
  $('#nav').innerHTML = ['home', 'pick', 'play', 'learn', 'book', 'me'].map((k) =>
    '<a href="#/' + k + '" class="' + (route === k ? 'on' : '') + '">' + ICONS[k] + '<span>' + esc(T().nav[k]) + '</span>'
    + (k === 'me' && (UNREAD + NEWBK) ? '<span class="badge">' + (UNREAD + NEWBK) + '</span>' : '') + '</a>').join('');
  if (typeof adminTabBadges === 'function') adminTabBadges();
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
/* Photos for posts are shrunk on the phone before they go to the cloud, so each stays well under the 1 MB document limit. */
function shrinkImage(file, max, quality) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file), img = new Image();
    img.onload = () => {
      const k = Math.min(1, (max || 1100) / Math.max(img.width, img.height)), w = Math.round(img.width * k), h = Math.round(img.height * k);
      const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url); resolve(c.toDataURL('image/jpeg', quality || 0.82));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('image')); };
    img.src = url;
  });
}
/* Inside the Google Play build (a Trusted Web Activity) the page is opened with an android-app:// referrer. Play's
   rules forbid pointing people to outside payment for digital content, so that build hides course prices and
   the "buy" buttons and only takes an unlock code. Remembered on the device after the first launch. */
try { if (/^android-app:\/\//.test(document.referrer || '')) store.set('nabu-twa', true); } catch (e) { /* no referrer */ }
const isTWA = () => store.get('nabu-twa', false) === true;
const EMOJIS = ['✨', '💜', '🔮', '🌙', '☀️', '⭐', '🌟', '💫', '🃏', '🗝️', '🌸', '🌿', '🕯️', '🧿', '💌', '❤️', '💔', '💰', '💼', '📚', '😊', '🙏', '👉', '⚠️', '✅', '📅', '🎁', '🎉'];
/* A booking as a calendar file with four reminders (24 h, 6 h, 1 h, 15 min).
   Times are Vietnam time (UTC+7, no daylight saving), written as UTC. */
function icsFor(b) {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(String(b.slot || ''));
  if (!m) return '';
  const start = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4] - 7, +m[5])), end = new Date(start.getTime() + 60 * 60000);
  const f = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const clean = (s) => String(s || '').replace(/[\\;,]/g, (c) => '\\' + c).replace(/\n/g, '\\n');
  const alarms = [['-P1D', '24 h'], ['-PT6H', '6 h'], ['-PT1H', '1 h'], ['-PT15M', '15 min']].map((a) => 'BEGIN:VALARM\r\nTRIGGER:' + a[0] + '\r\nACTION:DISPLAY\r\nDESCRIPTION:Nabu Tarot ' + a[1] + '\r\nEND:VALARM').join('\r\n');
  const what = clean(CONFIG.brand + (b.service ? ' · ' + b.service : '')), who = clean(b.name ? b.name : '');
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Nabu Tarot//app//VI', 'BEGIN:VEVENT', 'UID:' + (b.id || Date.now()) + '@nabutarot', 'DTSTAMP:' + f(new Date()), 'DTSTART:' + f(start), 'DTEND:' + f(end),
    'SUMMARY:' + what, 'DESCRIPTION:' + clean((b.topic ? b.topic + '\n' : '') + (b.note || '') + (who ? '\n' + who : '')), 'URL:' + appURL() + '#/me', alarms, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
}
const icsLink = (b) => 'data:text/calendar;charset=utf-8,' + encodeURIComponent(icsFor(b));
/* Google Calendar's "add event" page, for people who keep their calendar there. */
function gcalLink(b) {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(String(b.slot || ''));
  if (!m) return '';
  const start = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4] - 7, +m[5])), end = new Date(start.getTime() + 3600000);
  const f = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(CONFIG.brand + (b.service ? ' · ' + b.service : '')) + '&dates=' + f(start) + '/' + f(end) + '&ctz=Asia%2FHo_Chi_Minh&details=' + encodeURIComponent((b.topic ? b.topic + '\n' : '') + (b.note || '') + '\n' + appURL() + '#/me');
}
/* Hand the .ics to the phone: the share sheet (Calendar, Files…) where it exists, otherwise a download. */
async function addToCalendar(b) {
  const S = T(), ics = icsFor(b); if (!ics) return;
  const name = 'nabu-tarot-' + String(b.slot || '').slice(0, 10) + '.ics';
  try {
    const file = new File([ics], name, { type: 'text/calendar' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: CONFIG.brand }); return; }
  } catch (e) { if (e && e.name === 'AbortError') return; }
  try {
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' })), a = document.createElement('a');
    a.href = url; a.download = name; a.rel = 'noopener'; document.body.appendChild(a); a.click(); setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 4000);
    toast(S.icsDownloaded);
  } catch (e) { window.open(gcalLink(b), '_blank', 'noopener'); }
}
const slotDate = (slot) => { const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(String(slot || '')); return m ? new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) : null; };
/* Reminders while the app is open: 24 h, 6 h, 1 h and 15 min before every upcoming booking. */
const REM = { timers: [] };
function scheduleReminders(list) {
  REM.timers.forEach(clearTimeout); REM.timers = [];
  const S = T(), now = Date.now(), soon = [];
  (list || []).filter((b) => ['requested', 'confirmed', 'change_requested'].indexOf(b.status) > -1).forEach((b) => {
    const d = slotDate(b.slot); if (!d || d.getTime() < now) return;
    soon.push(b);
    [[24 * 60, S.inHours(24)], [6 * 60, S.inHours(6)], [60, S.inHours(1)], [15, S.inMinutes(15)]].forEach((r) => {
      const at = d.getTime() - r[0] * 60000, wait = at - now;
      if (wait > 0 && wait < 36 * 3600000) REM.timers.push(setTimeout(() => notifyAdmin(S.remindTitle(r[1]), slotLabel(b.slot), '#/me'), wait));
    });
  });
  soon.sort((a, b) => String(a.slot).localeCompare(String(b.slot)));
  store.set('nabu-nextbk', soon[0] ? { slot: soon[0].slot, status: soon[0].status, service: soon[0].service || '' } : null);
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

/* Content that Nabu edits in the dashboard: the cloud copy wins when it
   exists, the repo file is the fallback (and the offline cache after that). */
async function loadContent(name, path, key) {
  const be = typeof BE !== 'undefined' ? BE : null;
  if (be && be.enabled) {
    try {
      await Promise.race([be.initP || Promise.resolve(), new Promise((r) => setTimeout(r, 2500))]);
      if (be.db) {
        const d = await Promise.race([be.getContent(name), new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 2500))]);
        if (d) { delete d.updatedAt; store.set(key, d); return { data: d, fromCache: false }; }
      }
    } catch (e) { /* offline, rules, or not saved yet: use the file */ }
  }
  return loadJSON(path, key);
}

/* ---- router ---- */
const ROUTES = {};
/* In-app history: the back arrow on a screen returns to the screen the
   visitor actually came from (home, a tab, a list), not to a fixed parent. */
const NAV = { current: '', stack: [], popping: false, skip: false, scroll: {}, restore: null };
try { NAV.stack = JSON.parse(sessionStorage.getItem('nabu-nav') || '[]'); } catch (e) { NAV.stack = []; }
function navRemember(h) {
  // Where the visitor was on the screen they are leaving, so a return lands there.
  if (NAV.current) NAV.scroll[NAV.current] = window.scrollY || 0;
  const top = NAV.stack[NAV.stack.length - 1];
  NAV.restore = null;
  if (NAV.skip) { NAV.skip = false; }
  else if (NAV.popping || (top && top === h && NAV.current !== h)) { NAV.popping = false; NAV.stack.pop(); NAV.restore = NAV.scroll[h] || 0; }
  else if (NAV.current && NAV.current !== h) { NAV.stack.push(NAV.current); if (NAV.stack.length > 40) NAV.stack.shift(); }
  NAV.current = h;
  try { sessionStorage.setItem('nabu-nav', JSON.stringify(NAV.stack)); } catch (e) { /* private mode */ }
}
function redirect(h) { NAV.skip = true; location.replace(h); }
/* A short name for a hash, used as the back arrow's label. */
function screenLabel(h) {
  const S = T(), p = String(h || '').replace(/^#\/?/, '').split('?')[0].split('/'), r = p[0] || 'home', a = p.slice(1);
  if (r === 'home') return S.nav.home;
  if (r === 'pick') return S.nav.pick;
  if (r === 'book') return S.nav.book;
  if (r === 'prices') return S.priceTitle;
  if (r === 'news') return S.newsTitle;
  if (r === 'contact') return S.contactTitle;
  if (r === 'privacy') return S.privacyTitle;
  if (r === 'install') return S.installTitle;
  if (r === 'play') return S.actTitle;
  if (r === 'me') return S.nav.me;
  if (r === 'learn') { if (!a.length) return S.learnTitle; if (a.length === 1 && S.cats[a[0]]) return S.cats[a[0]]; if (a[0] === 'fortune' && a.length === 2) return S.cats.fortune; }
  return S.back;
}
function backTarget() { const prev = NAV.stack[NAV.stack.length - 1]; return prev && prev !== NAV.current ? prev : ''; }
function backLink(href, label) {
  if (backTarget()) return '';  // the bar above the screen already shows the way back
  return '<p><a href="' + esc(href) + '" class="backlink">← ' + esc(label) + '</a></p>';
}
/* The main tabs always lead back to home; deeper screens lead back to where
   the visitor came from. */
const TAB_ROOTS = { pick: 1, play: 1, learn: 1, book: 1, prices: 1, me: 1 };
function renderBackBar(r) {
  const bar = $('#backbar');
  const isTab = TAB_ROOTS[r.route] && !r.args.length;
  const prev = r.route === 'home' ? '' : isTab ? '#/home' : backTarget();
  bar.hidden = !prev;
  const link = prev ? '<a href="' + esc(prev) + '" class="backlink"' + (isTab ? '' : ' data-back="1"') + '>← ' + esc(screenLabel(prev)) + '</a>' : '';
  bar.innerHTML = link;
  // The same way back sits under the screen too, so nobody has to scroll up after a long read; deeper screens add a straight jump home.
  const foot = $('#homefoot');
  if (foot) { foot.hidden = !prev; foot.innerHTML = link + (prev && prev !== '#/home' ? '<a href="#/home" class="backlink">🏠 ' + esc(T().nav.home) + '</a>' : ''); }
}
function parseHash() {
  const h = location.hash.replace(/^#\/?/, '');
  const q = h.split('?'), path = q[0].split('/'), params = {};
  (q[1] || '').split('&').forEach((kv) => { if (!kv) return; const p = kv.split('='); params[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || ''); });
  return { route: path[0] || 'home', args: path.slice(1), params: params };
}
function route() {
  const r = parseHash();
  const def = ROUTES[r.route];
  if (!def) { redirect('#/home'); return; }
  navRemember(location.hash || '#/home');
  renderChrome(def.nav);
  renderBackBar(r);
  const y = NAV.restore;
  if (y == null) window.scrollTo(0, 0);
  Promise.resolve(def.render(r.args, r.params)).then(() => {
    if (!y) return;  // nothing to restore, and never fight a visitor who has started scrolling
    window.scrollTo(0, y);
    requestAnimationFrame(() => window.scrollTo(0, y));
    setTimeout(() => { if (window.scrollY < 4) window.scrollTo(0, y); }, 120);
  });
}
function boot() {
  window.addEventListener('hashchange', route);
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[data-back]');
    if (!a) return;
    e.preventDefault(); NAV.popping = true; location.hash = a.getAttribute('href');
  });
  $('#lang').addEventListener('click', () => { lang = lang === 'vi' ? 'en' : 'vi'; store.set('nabu-lang', lang); route(); });
  $('#theme').addEventListener('click', () => { const cur = effectiveTheme(); setTheme(THEMES[(THEMES.indexOf(cur) + 1) % THEMES.length]); });
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
