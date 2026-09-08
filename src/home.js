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

/* ---- tour ----
   Eight steps in the owner's own words (Vietnamese verbatim; English and
   German written to match). A step's text may be two paragraphs, split on a
   newline. */
const TOUR = [
  { ic: "🔮", vi: ["Rút bài", "Chọn chủ đề bạn đang quan tâm, sau đó rút một lá bài để nhận thông điệp và xem năng lượng dành cho bạn trong hôm nay. Mỗi chủ đề sẽ có cách diễn giải riêng, nên hãy chọn điều phù hợp nhất với câu hỏi của bạn."], en: ["Draw a card", "Choose the topic on your mind, then draw one card to receive its message and see the energy meant for you today. Each topic is read in its own way, so pick the one that fits your question best."], de: ["Karte ziehen", "Wähl das Thema, das dich gerade beschäftigt, und zieh dann eine Karte: Sie bringt dir ihre Botschaft und zeigt die Energie, die heute für dich gilt. Jedes Thema wird auf seine eigene Art gedeutet, also wähl das, was am besten zu deiner Frage passt."] },
  { ic: "🌙", vi: ["Dự đoán", "Các bài dự đoán mới nhất của Nabu sẽ xuất hiện ngay trên trang chủ. Những bài có nhãn “Dành cho bạn” được chọn dựa trên cung hoàng đạo trong hồ sơ của bạn, để bạn dễ tìm đúng nội dung phù hợp với mình."], en: ["Forecasts", "Nabu’s newest forecasts appear right on the home screen. Those marked “For you” are chosen by the zodiac sign in your profile, so the right reading is easy to find."], de: ["Vorhersagen", "Nabus neueste Vorhersagen erscheinen direkt auf der Startseite. Die mit „Für dich“ markierten werden nach dem Sternzeichen in deinem Profil ausgewählt, damit du leicht das Passende findest."] },
  { ic: "🍀", vi: ["Hoạt động", "Đây là nơi bạn có thể thư giãn và thử một chút vận may cùng Nabu: nuôi linh thú, buộc Sợi Tơ Hồng, rung Cây Thông Điệp, tung đồng xu và viết nhật ký.\nKhi Nabu mở các hoạt động đặc biệt, bạn còn có thể tham gia chọn tụ bài, bình chọn, gửi điều ước và nhiều sự kiện nhỏ khác."], en: ["Activities", "This is where you relax and try a little luck with Nabu: raise a companion, tie the Red Thread, shake the Message Tree, flip the coin and write your diary.\nWhen Nabu opens a special activity, you can also pick a pile, vote, send a wish and join other small events."], de: ["Aktivitäten", "Hier kannst du entspannen und mit Nabu ein bisschen Glück versuchen: einen Begleiter großziehen, den Roten Faden knüpfen, den Nachrichtenbaum schütteln, die Münze werfen und Tagebuch schreiben.\nWenn Nabu eine besondere Aktion öffnet, kannst du außerdem einen Stapel wählen, abstimmen, einen Wunsch schicken und bei anderen kleinen Ereignissen mitmachen."] },
  { ic: "📚", vi: ["Học & khám phá", "Khám phá kiến thức về Tarot, Lenormand, bài Tây, chiêm tinh, số thiên thần, manifestation và các hình thức bói toán.\nBạn có thể chọn trực tiếp một lá bài, cung hoàng đạo hoặc chủ đề mình quan tâm để đọc giải thích chi tiết mà không cần tìm kiếm qua nhiều bài viết."], en: ["Learn & explore", "Explore Tarot, Lenormand, playing cards, astrology, angel numbers, manifestation and other forms of divination.\nGo straight to a card, a zodiac sign or a topic you care about and read its full explanation without searching through many posts."], de: ["Lernen & entdecken", "Entdecke Wissen über Tarot, Lenormand, Spielkarten, Astrologie, Engelszahlen, Manifestation und andere Formen des Wahrsagens.\nGeh direkt zu einer Karte, einem Sternzeichen oder einem Thema, das dich interessiert, und lies die ausführliche Erklärung, ohne viele Beiträge durchsuchen zu müssen."] },
  { ic: "💞", vi: ["Sợi Tơ Hồng", "Tạo một Sợi Tơ Hồng dành riêng cho bạn và một người đặc biệt. Bạn đặt tên cho mối liên kết rồi gửi lời mời cho người ấy.\nKhi người ấy đồng ý, Nabu sẽ bắt đầu lưu lại số ngày hai bạn đồng hành cùng nhau. Từ đó, cả hai có thể ngỏ lời, đính ước, tặng quà và tổ chức một lễ cưới nhỏ ngay trong Nabu. 💍✨"], en: ["The Red Thread", "Create a Red Thread just for you and someone special. Name the bond, then send them an invitation.\nOnce they accept, Nabu starts counting the days you have walked together. From there you can propose, get engaged, exchange gifts and hold a small wedding right inside Nabu. 💍✨"], de: ["Der Rote Faden", "Knüpf einen Roten Faden nur für dich und einen besonderen Menschen. Gib der Verbindung einen Namen und schick eine Einladung.\nSobald der andere zusagt, zählt Nabu die Tage, die ihr gemeinsam geht. Von da an könnt ihr einen Antrag machen, euch verloben, Geschenke austauschen und eine kleine Hochzeit direkt in Nabu feiern. 💍✨"] },
  { ic: "💌", vi: ["Đặt lịch với Nabu", "Chọn dịch vụ bạn muốn xem, chọn ngày giờ còn trống trên lịch và gửi yêu cầu đặt lịch.\nSau khi gửi, bạn có thể theo dõi trạng thái lịch hẹn trong tài khoản của mình."], en: ["Book with Nabu", "Choose the service you want, pick a free date and time on the calendar and send your booking request.\nAfterwards you can follow the status of your booking in your account."], de: ["Termin bei Nabu", "Wähl den gewünschten Dienst, such dir einen freien Tag und eine Uhrzeit im Kalender aus und schick deine Anfrage.\nDanach kannst du den Status deines Termins in deinem Konto verfolgen."] },
  { ic: "🔔", vi: ["Làm mới & thông báo", "Muốn cập nhật nội dung mới nhất, bạn chỉ cần kéo màn hình xuống từ đầu trang rồi thả ra. Nabu sẽ tự làm mới và tải phiên bản nội dung mới nhất.\nBiểu tượng chuông 🔔 ở góc trên bên phải lưu lại những cập nhật và hoạt động đã diễn ra khi bạn không mở app, để bạn không bỏ lỡ điều gì."], en: ["Refresh & notifications", "To get the newest content, pull the screen down from the top and let go. Nabu refreshes itself and loads the latest version.\nThe bell 🔔 in the top right keeps the updates and activities that happened while you were away, so you miss nothing."], de: ["Aktualisieren & Benachrichtigungen", "Für die neuesten Inhalte ziehst du den Bildschirm oben einfach nach unten und lässt los. Nabu aktualisiert sich selbst und lädt die neueste Version.\nDie Glocke 🔔 oben rechts bewahrt die Neuigkeiten und Aktivitäten auf, die passiert sind, während du weg warst, damit dir nichts entgeht."] },
  { ic: "👤", vi: ["Hồ sơ của bạn", "Nhập tên và ngày sinh để Nabu có thể cá nhân hóa một số nội dung, chẳng hạn như dự đoán phù hợp với cung hoàng đạo của bạn.\nĐăng nhập để lưu hồ sơ, lịch hẹn và những dữ liệu cá nhân khác, nhờ đó bạn vẫn có thể tiếp tục hành trình của mình khi đổi máy hoặc đăng nhập trên thiết bị khác. ✨"], en: ["Your profile", "Enter your name and birthday so Nabu can personalise some content, such as forecasts for your zodiac sign.\nSign in to keep your profile, bookings and other personal data, so you can carry on your journey when you change phones or sign in elsewhere. ✨"], de: ["Dein Profil", "Gib deinen Namen und dein Geburtsdatum ein, damit Nabu einige Inhalte für dich anpassen kann, zum Beispiel Vorhersagen für dein Sternzeichen.\nMeld dich an, um Profil, Termine und andere persönliche Daten zu behalten, damit du deinen Weg fortsetzen kannst, wenn du das Handy wechselst oder dich woanders anmeldest. ✨"] }
];
function tourHTML(step) {
  const t = TOUR[step], txt = t[lang];
  const pct = Math.round((step + 1) / TOUR.length * 100);
  /* A bar along the top, because eight steps with no sense of how many are
     left is eight steps somebody abandons at the third. The icon sits in a
     round well rather than loose on the card, which is what makes a row of
     unrelated emoji read as one series. */
  return '<div class="card tourcard" id="tour" style="text-align:center;border-color:var(--lav)">'
    + '<div class="tourbar"><span style="width:' + pct + '%"></span></div>'
    + '<div class="tourwell">' + t.ic + '</div>'
    + '<h3 style="margin:6px 0">' + esc(txt[0]) + '</h3>' + txt[1].split('\n').map((para) => '<p class="muted" style="font-size:14.5px">' + esc(para) + '</p>').join('')
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
    // On the home screen the card folds into its little bar; anywhere else it
    // was opened on purpose, so closing it simply removes it.
    if (parseHash().route === 'home') { $('#tour').outerHTML = tourMiniHTML(); bindTour(root, 0); }
    else { const el = $('#tour', root); if (el) el.remove(); }
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
    + '<h2' + (full ? '' : ' class="tclamp"') + '>' + titleHTML(L(p.title)) + '</h2>' + markersHTML(p)
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
  const sale = SALE.live();
  const saleBanner = sale
    ? '<a class="salebar" href="' + (sale.scope === 'unlock' ? '#/unlock?from=app' : '#/prices') + '"><span class="tag">🏷️ ' + esc(SALE.off()) + '</span><span class="txt">' + esc(SALE.title() || T().saleDefault) + '</span><span class="go">' + esc(T().saleSee) + ' ›</span></a>'
    : '';
  /* The calendar and the tour sit together in an aside. On a phone that is
     invisible: same order, same flow. On a wide window it becomes the right
     column, sticky, so a desk sees today's date beside the feed rather than
     above it and then never again. */
  /* No eyebrow with the name on it: the logo sits directly above this line
     and already says it. */
  m.innerHTML = saleBanner
    + '<aside class="side">'
    + todayHTML()
    + (PROFILE.tourDone ? tourMiniHTML() : tourHTML(0))
    /* On a desk the month and the week for this person's sign sit here, under
       the calendar, rather than a long way down the left. On a phone this box
       stays empty and hidden and the forecast keeps its old place further down
       - the same two cards, drawn once for whichever column is showing. */
    + '<div id="sidehoro" hidden></div>'
    + '</aside>'
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
  const sh = $('#sidehoro'); if (sh) { sh.innerHTML = '<div class="eyebrow">' + esc(T().forInterests) + '</div>' + horoCardHTML('monthly') + horoCardHTML('weekly'); sh.hidden = false; }
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
    const newsBox = $('#news');
    newsBox.innerHTML = list.length ? list.map((p) => postHTML(p, false)).join('') : '<p class="empty">' + esc(q ? S.noMatch : S.feedEmpty) + '</p>';
    bindPost($('#news'));
  };
  $('#nsearch').addEventListener('input', draw); draw();
}
ROUTES.home = { nav: 'home', render: renderHome };
ROUTES.news = { nav: 'home', render: renderNews };
ROUTES.post = { nav: 'home', render: renderPost };
