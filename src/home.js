/* ============================ home ============================
   Today in several calendars, a greeting, quick links, what fits the
   visitor's sign and interests, then the feed (Nabu's posts plus anything
   synced from Facebook / Instagram into fb.json). */
let POSTS = null, POSTS_CACHED = false, FBPOSTS = [], HORO = null;

async function loadPosts() {
  const p = await loadContent('posts', CONFIG.postsPath, 'nabu-posts');
  POSTS = (p.data && p.data.posts) || []; POSTS_CACHED = p.fromCache;
  const f = await loadJSON('fb.json', 'nabu-fb');
  FBPOSTS = (f.data && f.data.posts) || [];
  const h = await loadJSON('horoscope.json', 'nabu-horo');
  HORO = h.data || null;
  return POSTS;
}

/* ---- today ---- */
function calLine(calendar, locale, opts) {
  try { return new Intl.DateTimeFormat(locale + '-u-ca-' + calendar, opts).format(new Date()); } catch (e) { return ''; }
}
function todayHTML() {
  const S = T(), now = new Date();
  const greg = now.toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const rows = [];
  // Vietnamese lunar calendar (Hồ Ngọc Đức's algorithm, UTC+7), as on the lịch vạn niên.
  const lu = lunarToday(now);
  const leap = lu.leap ? (lang === 'vi' ? ' (nhuận)' : ' (leap)') : '';
  rows.push([lang === 'vi' ? 'Âm lịch' : 'Lunar (VN)', lang === 'vi'
    ? 'Ngày ' + lu.day + ' tháng ' + lu.month + leap + ' năm ' + lu.yearCC + ' (' + lu.year + ')'
    : 'Day ' + lu.day + ' of lunar month ' + lu.month + leap + ', year of the ' + lu.yearAn + ' (' + lu.year + ')']);
  rows.push(lang === 'vi' ? ['Can chi', 'Ngày ' + lu.dayCC + ' · tháng ' + lu.monthCC + ' · năm ' + lu.yearCC]
    : ['Animal signs', 'Day of the ' + lu.dayAn + ' · month of the ' + lu.monthAn + ' · year of the ' + lu.yearAn]);
  const others = [['islamic-umalqura', lang === 'vi' ? 'Hồi giáo (Hijri)' : 'Islamic (Hijri)'], ['hebrew', lang === 'vi' ? 'Do Thái' : 'Hebrew'], ['persian', lang === 'vi' ? 'Ba Tư' : 'Persian'], ['buddhist', lang === 'vi' ? 'Phật lịch (Thái)' : 'Buddhist (Thai)']];
  others.forEach((o) => { const v = calLine(o[0], lang === 'vi' ? 'vi' : 'en', { day: 'numeric', month: 'long', year: 'numeric' }); if (v) rows.push([o[1], v]); });
  const mp = moonPhase(now);
  rows.push([lang === 'vi' ? 'Trăng' : 'Moon', MOON_ICONS[mp.idx] + ' ' + MOON_NAMES[lang][mp.idx] + ' · ' + (lang === 'vi' ? 'ngày ' : 'day ') + Math.round(mp.age)]);
  return '<div class="acc open" id="today"><button><span>📅 ' + esc(greg) + '</span></button><div class="in"><table class="tbl">'
    + rows.map((r) => '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td></tr>').join('') + '</table></div></div>';
}

/* ---- tour ---- */
const TOUR = [
  { ic: DRAW_ICON, vi: ['Rút bài', 'Chọn chủ đề trước, rồi lật một lá để xem năng lượng hôm nay của bạn.'], en: ['Pick a card', 'Tap one card to see your energy today. Choose a focus first: love, work, study, money.'] },
  { ic: '✨', vi: ['Dự đoán', 'Bài mới của Nabu nằm ở trang chủ. Bài ghi "dành cho bạn" hợp với cung của bạn.'], en: ['Readings', 'Nabu\'s new posts live on the home screen. Posts marked "for you" match your sign.'] },
  { ic: '📚', vi: ['Học', 'Tarot, Lenormand, chiêm tinh và manifestation. Bạn bấm vào một lá bài hoặc một cung để đọc.'], en: ['Learn', 'Tarot, Lenormand, astrology, manifestation and fortune telling. Tap a card or a sign to read.'] },
  { ic: '📅', vi: ['Đặt lịch', 'Bạn chọn gói, chọn giờ trên lịch rồi gửi yêu cầu cho Nabu.'], en: ['Book', 'Choose a topic, pick a time on the calendar, send it to Nabu.'] },
  { ic: '👤', vi: ['Hồ sơ', 'Nhập tên và ngày sinh để app chọn nội dung hợp với bạn. Đăng nhập để lưu hồ sơ và xem lịch hẹn.'], en: ['Profile', 'Enter your name and birthday so the app picks content for you. Sign in to keep your profile, message Nabu and see bookings.'] }
];
function tourHTML(step) {
  const t = TOUR[step], txt = t[lang];
  return '<div class="card" id="tour" style="text-align:center;border-color:var(--lav)"><div style="font-size:40px">' + t.ic + '</div>'
    + '<h3 style="margin:6px 0">' + esc(txt[0]) + '</h3><p class="muted" style="font-size:14.5px">' + esc(txt[1]) + '</p>'
    // Both arrows are always there, in the same place: back is greyed out on the first step, forward becomes a tick on the last.
    + '<div class="tournav"><button class="btn sm" data-tour="prev" aria-label="back"' + (step === 0 ? ' disabled' : '') + '>←</button><span class="faint">' + (step + 1) + ' / ' + TOUR.length + '</span><button class="btn sm primary" data-tour="next" aria-label="next">' + (step === TOUR.length - 1 ? '✓' : '→') + '</button></div>'
    + '<button class="linkbtn" data-tour="skip" style="margin-top:8px;font-size:13px">' + esc(T().dismiss) + '</button></div>';
}
/* Once the tour is done or closed it shrinks to a one-line bar that can reopen it. */
function tourMiniHTML() {
  const S = T();
  return '<div class="tourmini" id="tour"><span>💡 ' + esc(S.tourMini) + '</span><button class="btn sm" data-tour="open">' + esc(S.tourOpen) + '</button></div>';
}
function bindTour(root, step) {
  $$('[data-tour]', root).forEach((b) => b.addEventListener('click', () => {
    const act = b.getAttribute('data-tour');
    if (act === 'open') { $('#tour').outerHTML = tourHTML(0); bindTour(root, 0); return; }
    if (act === 'next' && step < TOUR.length - 1) { $('#tour').outerHTML = tourHTML(step + 1); bindTour(root, step + 1); return; }
    if (act === 'prev') { $('#tour').outerHTML = tourHTML(Math.max(0, step - 1)); bindTour(root, Math.max(0, step - 1)); return; }
    saveProfileLocal({ tourDone: true }); if (BE.user) BE.pushProfile();
    $('#tour').outerHTML = tourMiniHTML(); bindTour(root, 0);
  }));
}

/* ---- feed pieces ---- */
function markersHTML(p) {
  const m = p.markers || {}; const bits = [];
  if (m.initials && m.initials.length) bits.push(T().initials + ' <b>' + esc(m.initials.join(', ')) + '</b>');
  if (m.signs && m.signs.length) bits.push(T().signs + ' <b>' + esc(m.signs.map((i) => T().zodiac[i]).filter(Boolean).join(', ')) + '</b>');
  return bits.length ? '<div class="markers">' + T().forYouIf + ' ' + bits.join(' · ') + '</div>' : '';
}
function postScore(p) {
  let s = 0; const sign = mySign(), ints = PROFILE.interests || [];
  if (p.markers && p.markers.signs && sign > -1 && p.markers.signs.indexOf(sign) > -1) s += 3;
  if (p.markers && p.markers.initials && PROFILE.name && p.markers.initials.indexOf(PROFILE.name.trim().charAt(0).toUpperCase()) > -1) s += 2;
  if (p.topics && p.topics.some((t) => ints.indexOf(t) > -1)) s += 1;
  return s;
}
/* ---- rich post bodies ----
   Plain text with light marks the dashboard toolbar inserts: **bold**,
   __underline__, ==highlight==, "## " small heading, "> " title box,
   [img:ID] for a photo stored in the cloud, [video:URL] for an embed. */
const IMGS = {};
async function loadImg(id) {
  if (IMGS[id] != null) return IMGS[id];
  IMGS[id] = '';
  try { if (typeof BE !== 'undefined' && BE.enabled) { await Promise.race([BE.initP || Promise.resolve(), new Promise((r) => setTimeout(r, 4000))]); if (BE.db) { const d = await BE.getContent('img_' + id); if (d && d.data) IMGS[id] = d.data; } } } catch (e) { /* offline: the picture stays blank */ }
  return IMGS[id];
}
function videoHTML(url) {
  const u = String(url).trim(), m = /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/.exec(u);
  if (m) return '<div class="video"><iframe src="https://www.youtube.com/embed/' + m[1] + '" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>';
  if (/facebook\.com\/.*\/videos\/|fb\.watch\//.test(u)) return '<div class="video"><iframe src="https://www.facebook.com/plugins/video.php?href=' + encodeURIComponent(u) + '&show_text=false" allowfullscreen loading="lazy"></iframe></div>';
  const site = /tiktok/.test(u) ? 'TikTok' : /instagram/.test(u) ? 'Instagram' : /facebook|fb\./.test(u) ? 'Facebook' : 'video';
  return '<a class="vlink" href="' + esc(u) + '" target="_blank" rel="noopener">▶ ' + esc(T().watchOn(site)) + '</a>';
}
function richHTML(text) {
  const inline = (s) => esc(s).replace(/\*\*([^*\n]+)\*\*/g, '<b>$1</b>').replace(/(^|[^*])\*([^*\n]+)\*(?=[^*]|$)/g, '$1<i>$2</i>').replace(/__([^_\n]+)__/g, '<u>$1</u>').replace(/==([^=\n]+)==/g, '<mark>$1</mark>');
  const block = (b) => {
    const t = b.trim(); let m;
    if (!t) return '';
    if ((m = /^\[img:([^\]\s]+)\]$/.exec(t))) return '<img class="pimg" data-img="' + esc(m[1]) + '"' + (IMGS[m[1]] ? ' src="' + esc(IMGS[m[1]]) + '"' : '') + ' alt="">';
    if ((m = /^\[video:([^\]\s]+)\]$/.exec(t))) return videoHTML(m[1]);
    if (/^##\s/.test(t)) return '<h3>' + inline(t.replace(/^##\s+/, '')) + '</h3>';
    if (/^>/.test(t)) return '<div class="callout">' + inline(t.replace(/^>\s?/gm, '')).replace(/\n/g, '<br>') + '</div>';
    return '<p>' + inline(t).replace(/\n/g, '<br>') + '</p>';
  };
  // Tokens and heading lines stand on their own even without blank lines around them.
  return String(text || '').replace(/\n?(\[(?:img|video):[^\]\s]+\])\n?/g, '\n\n$1\n\n').replace(/^(##\s.*)$/gm, '\n$1\n').split(/\n\s*\n/).map(block).join('');
}
const plainText = (s) => String(s || '').replace(/\[(?:img|video):[^\]\s]+\]/g, '').replace(/\*\*|__|==|\*/g, '').replace(/^##\s+|^>\s?/gm, '').trim();
function hydrateImages(root) {
  $$('img.pimg[data-img]', root).forEach((img) => { const id = img.getAttribute('data-img'); if (IMGS[id]) { img.src = IMGS[id]; return; } loadImg(id).then((d) => { if (d) img.src = d; }); });
}
function postHTML(p, full) {
  const raw = L(p.body), body = plainText(raw), long = !full && body.length > 320, score = postScore(p);
  return '<article class="post" data-id="' + esc(p.id) + '">'
    + '<div class="date"><span>' + fmtDate(p.date) + (p.source ? ' · ' + esc(p.source) : '') + '</span>' + (p.pinned ? '<span class="pin">★ ' + T().pinned + '</span>' : '') + '</div>'
    + (score >= 2 ? '<span class="foryou">✦ ' + esc(T().forYou) + '</span>' : '')
    + '<h2>' + esc(L(p.title)) + '</h2>' + markersHTML(p)
    + (p.image ? '<img src="' + esc(p.image) + '" alt="" style="border-radius:12px;margin-bottom:10px">' : '')
    + '<div class="body' + (long ? ' clamp' : '') + '">' + richHTML(raw) + '</div>'
    + (long ? '<button class="more" data-more>' + T().readMore + '</button>' : '')
    + (p.cards && p.cards.length ? '<div class="faint">' + T().cardsDrawn + '</div><div class="mini">' + p.cards.map((c) => miniHTML(c, true)).join('') + '</div>' : '')
    + '<div class="foot">' + (p.link ? '<a class="btn sm" href="' + esc(p.link) + '" target="_blank" rel="noopener">' + esc(p.source || 'Facebook') + ' ↗</a>' : '') + '<button data-share>' + T().share + '</button></div>'
    + '</article>';
}
function bindPost(root) {
  $$('[data-more]', root).forEach((b) => b.addEventListener('click', () => {
    const body = b.previousElementSibling; const open = body.classList.toggle('clamp'); b.textContent = open ? T().readMore : T().readLess;
  }));
  $$('[data-share]', root).forEach((b) => b.addEventListener('click', () => {
    const art = b.closest('article'), p = allPosts().filter((x) => x.id === art.getAttribute('data-id'))[0];
    if (p) shareOrCopy(L(p.title) + '\n' + plainText(L(p.body)), p.link || (appURL() + '#/post/' + p.id));
  }));
  bindCardLinks(root); hydrateImages(root);
}
function allPosts() { return (POSTS || []).concat(FBPOSTS.map((f) => Object.assign({ source: f.source || 'Facebook' }, f))); }
function sortedPosts() {
  return allPosts().sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || postScore(b) - postScore(a) || String(b.date).localeCompare(String(a.date)));
}

/* ---- personal block ---- */
function personalHTML() {
  const S = T(), b = birthParts();
  if (!b) return '<div class="hello"><p class="muted" style="margin-bottom:10px">' + esc(S.setupProfile) + '</p><a class="btn primary" href="#/me">' + esc(S.setupBtn) + '</a></div>';
  const si = mySign(), key = ZKEYS[si], z = ZSIGN[key], zp = ZODIAC[key][lang];
  const majorId = Object.keys(ASTRO).filter((id) => ASTRO[id].k === 'sign' && ASTRO[id].sign === key)[0];
  const c = majorId ? cardById(majorId) : null;
  const lp = lifePath(b.y, b.m, b.d);
  return '<div class="hello">'
    + '<div class="sign"><div class="glyph">' + z.g + '</div><div><div class="faint">' + esc(S.yourSign) + '</div><b>' + esc(S.zodiac[si]) + '</b> · ' + esc(lang === 'vi' ? z.dvi : z.den)
    + '<div class="faint">' + esc(zp.kw.join(' · ')) + '</div></div></div>'
    + '<p style="font-size:14.5px;margin:6px 0 0">' + esc(zp.tip) + '</p>'
    + (c ? '<button class="cardline" data-open-card="' + c.id + '" style="width:100%;text-align:left"><span class="face">' + faceSVG(c) + '</span><span><span class="faint">' + esc(S.signCard) + '</span><br><b>' + esc(c.name) + '</b></span></button>' : '')
    + '<div class="row" style="margin-top:10px"><span class="chip lav">' + esc(S.lifePath) + ' ' + lp + '</span><span class="chip lav">' + esc(S.animal) + ': ' + esc(animalOf(b.y)[lang]) + '</span></div>'
    + '<div class="row" style="margin-top:10px"><a class="btn sm" href="#/learn/sign/' + key + '">' + esc(S.readSign) + '</a><a class="btn sm" href="#/learn/numbers">' + esc(S.numerology) + '</a></div>'
    + '</div>';
}
/* The big "pick a card today" block: three card backs and one button. */
function pickCtaHTML() {
  const S = T();
  return '<a class="pickcta" href="#/pick"><div class="fan3"><span style="transform:rotate(-16deg)">' + logoCardSVG('blue') + '</span><span>' + logoCardSVG('purple') + '</span><span style="transform:rotate(16deg)">' + logoCardSVG('pink') + '</span></div>'
    + '<div><b>' + esc(S.pickToday) + '</b><p>' + esc(S.pickIntro) + '</p><span class="btn primary sm">' + esc(S.nav.pick) + ' →</span></div></a>';
}
function quickLinksHTML() {
  const S = T();
  const tiles = [['#/pick', DRAW_ICON, S.nav.pick, lang === 'vi' ? 'năng lượng hôm nay' : 'your energy today'],
    ['#/news', '✨', S.newsTitle, lang === 'vi' ? 'bài mới của Nabu' : 'new posts from Nabu'],
    ['#/learn/astro', '🔮', S.cats.astro, lang === 'vi' ? '12 cung, hành tinh, nhà' : '12 signs, planets, houses'],
    ['#/learn/tarot', PICK_ICON, S.cats.tarot, lang === 'vi' ? '78 lá, ý nghĩa' : '78 cards, meanings'],
    ['#/book', '📅', S.nav.book, lang === 'vi' ? 'chọn giờ với Nabu' : 'pick a time with Nabu'],
    ['#/prices', '💜', S.priceTitle, lang === 'vi' ? 'các gói xem bài' : 'reading packages']];
  return '<div class="tiles">' + tiles.map((t) => '<a class="tile" href="' + t[0] + '"><div class="ic">' + t[1] + '</div><b>' + esc(t[2]) + '</b><span>' + esc(t[3]) + '</span></a>').join('') + '</div>'
    + (isStandalone() || isTWA() ? '' : '<a class="upnext" href="#/install" style="margin-top:-8px"><span class="ic">📲</span><span><b>' + esc(S.installTitle) + '</b><br>' + esc(S.instAndroidIntro) + '</span></a>');
}
const SIGN_EN = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
function horoCardHTML(period) {
  const S = T(), si = mySign();
  if (si < 0) return '<div class="horo"><h3>' + esc(period === 'monthly' ? S.horoMonth : S.horoWeek) + '</h3><p class="muted">' + esc(S.horoNeedBirthday) + '</p><a class="btn sm" href="#/me">' + esc(S.setupBtn) + '</a></div>';
  const key = ZKEYS[si], data = HORO && HORO[period] && HORO[period][SIGN_EN[si]];
  const glyph = '<span class="hg" style="background:' + EL_COLOR[ZSIGN[key].el] + '">' + ZSIGN[key].g + '</span>';
  if (!data) return '<div class="horo"><div class="hh">' + glyph + '<div><h3>' + esc(period === 'monthly' ? S.horoMonth : S.horoWeek) + '</h3><span class="faint">' + esc(S.zodiac[si]) + '</span></div></div><p class="muted">' + esc(S.horoUpdating) + '</p></div>';
  const text = (lang === 'vi' && data.vi) ? data.vi : data.en, long = text.length > 420;
  return '<div class="horo"><div class="hh">' + glyph + '<div><h3>' + esc(period === 'monthly' ? S.horoMonth : S.horoWeek) + '</h3><span class="faint">' + esc(S.zodiac[si]) + (data.range ? ' · ' + esc(data.range) : '') + '</span></div></div>'
    + '<div class="body' + (long ? ' clamp' : '') + '">' + paras(text) + '</div>' + (long ? '<button class="more" data-more>' + esc(S.readMore) + '</button>' : '')
    + '<p class="faint" style="margin:8px 0 0">' + esc(S.horoSource) + ' ' + esc((HORO && HORO.source) || 'Horoscope.com') + (HORO && HORO.updated ? ' · ' + esc(S.horoUpdated) + ' ' + esc(HORO.updated) : '') + '</p></div>';
}
function suggestedGuidesHTML(limit) {
  // Only the two horoscopes: the guide overview that used to sit here was removed at Nabu's request.
  return '<div class="sec" id="foryou"><div class="eyebrow">' + esc(T().forInterests) + '</div>' + horoCardHTML('monthly') + horoCardHTML('weekly') + '</div>';
}

/* The next booking, when it is within two days, sits right under the greeting. */
function upcomingHTML() {
  const S = T(), nb = store.get('nabu-nextbk', null), d = nb && slotDate(nb.slot);
  if (!d || d.getTime() < Date.now() || d.getTime() - Date.now() > 48 * 3600000) return '';
  return '<a class="upnext" href="#/me"><span class="ic">⏰</span><span><b>' + esc(S.upcoming) + '</b><br>' + esc(slotLabel(nb.slot)) + ' · ' + esc(S.status[nb.status] || '') + '</span></a>';
}
async function renderHome(args, params) {
  const S = T(), m = $('#main');
  const name = (PROFILE.name || '').trim();
  m.innerHTML = '<div class="eyebrow">' + esc(CONFIG.brand) + '</div>'
    + todayHTML()
    + (PROFILE.tourDone ? tourMiniHTML() : tourHTML(0))
    + '<h1 style="margin:18px 0 4px">' + esc(name ? S.hello(name) : S.helloGuest) + '</h1><p class="muted">' + esc(lang === 'vi' ? 'Hôm nay bạn muốn làm gì?' : 'What would you like to do today?') + '</p>'
    + upcomingHTML()
    + pickCtaHTML()
    + quickLinksHTML()
    + '<div id="actwrap"></div>'
    + personalHTML()
    + '<div id="foryouwrap"></div>'
    + '<div class="sec" id="feed"><p class="muted">…</p></div>';
  bindAccordions(m); bindCardLinks(m);
  bindTour(m, 0);
  homeActHTML($('#actwrap')).catch(() => {});
  if (POSTS == null) await loadPosts();
  const fy = $('#foryouwrap'); if (fy) { fy.innerHTML = suggestedGuidesHTML(); bindPost(fy); bindAccordions(fy); }
  const feed = $('#feed'); if (!feed) return;
  const all = sortedPosts(), welcome = all.filter((p) => p.welcome)[0], list = all.filter((p) => !p.welcome);
  const wopen = store.get('nabu-welcome-open', true) !== false;
  feed.innerHTML = (welcome ? '<section class="welcome' + (wopen ? ' open' : '') + '"><button type="button" class="wtoggle" data-wtoggle><h2>' + esc(S.welcomeHead) + '</h2><span class="chev">' + (wopen ? '–' : '+') + '</span></button><div class="in">' + paras(L(welcome.body)) + '<div class="sig">' + LOGO + '</div></div></section>' : '')
    + (POSTS_CACHED && all.length ? '<div class="banner">' + esc(S.feedOffline) + '</div>' : '')
    + (list.length ? '<div class="eyebrow" style="margin-top:4px">📰 ' + esc(S.nabuPosts) + '</div>' + list.slice(0, 3).map((p) => postHTML(p, false)).join('') + '<a class="btn block" href="#/news">' + esc(S.allPostsBtn(list.length)) + '</a>' : (welcome ? '' : '<p class="empty">' + esc(S.feedEmpty) + '</p>'));
  bindPost(feed);
  const wt = $('[data-wtoggle]', feed);
  if (wt) wt.addEventListener('click', () => { const sec = wt.closest('.welcome'), open = !sec.classList.contains('open'); sec.classList.toggle('open', open); $('.chev', wt).textContent = open ? '–' : '+'; store.set('nabu-welcome-open', open); });
  if (params.go === 'feed' && NAV.restore == null) feed.scrollIntoView({ behavior: 'smooth' });
}
async function renderPost(args) {
  const m = $('#main');
  if (POSTS == null) await loadPosts();
  const p = allPosts().filter((x) => x.id === args[0])[0];
  m.innerHTML = '<p><a href="#/home">← ' + esc(T().backToFeed) + '</a></p>' + (p ? postHTML(p, true) : '<p class="empty">' + esc(T().notFound) + '</p>');
  bindPost(m);
}
/* ---- all posts, with search (#/news) ---- */
async function renderNews() {
  const S = T(), m = $('#main');
  if (POSTS == null) await loadPosts();
  m.innerHTML = '<div class="eyebrow">' + esc(CONFIG.brand) + '</div><h1 style="margin-bottom:6px">' + esc(S.newsTitle) + '</h1><p class="muted">' + esc(S.newsIntro) + '</p>'
    + '<input id="nsearch" type="search" placeholder="' + esc(S.searchPosts) + '" autocomplete="off"><div id="news" style="margin-top:12px"></div>';
  const draw = () => {
    const q = fold($('#nsearch').value.trim());
    const list = sortedPosts().filter((p) => !p.welcome).filter((p) => !q || fold(L(p.title) + ' ' + plainText(L(p.body))).indexOf(q) > -1);
    $('#news').innerHTML = list.length ? list.map((p) => postHTML(p, false)).join('') : '<p class="empty">' + esc(q ? S.noMatch : S.feedEmpty) + '</p>';
    bindPost($('#news'));
  };
  $('#nsearch').addEventListener('input', draw); draw();
}
ROUTES.home = { nav: 'home', render: renderHome };
ROUTES.news = { nav: 'home', render: renderNews };
ROUTES.post = { nav: 'home', render: renderPost };
