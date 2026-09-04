/* ============================ course sessions ============================
   Each course is a short series of sessions, the way beginner courses are
   usually built: the deck's structure and story first, then the cards in
   groups, then the court, then spreads and practice. Every session is
   visual: card faces, strips, grids and diagrams drawn from the app's own
   artwork, with a line or two of text per card. */
const LESSONS = {
  tarot: [
    { n: 1, title: { vi: 'Tổng quan bộ bài và hành trình của Gã Khờ', en: 'The deck at a glance and the Fool\'s Journey' }, guide: 'tarot-overview', visual: 'journey' },
    { n: 2, title: { vi: 'Ẩn Chính 0–7: bước ra thế giới', en: 'Majors 0–7: stepping into the world' }, cards: ['major-0', 'major-1', 'major-2', 'major-3', 'major-4', 'major-5', 'major-6', 'major-7'], visual: 'strip',
      intro: { vi: 'Tám lá đầu là những người thầy đầu tiên trên đường. Học theo thứ tự, mỗi lá một ngày, và tự kể lại vì sao lá sau đứng sau lá trước.', en: 'The first eight cards are the first teachers on the road. Learn them in order, one a day, and retell why each card follows the last.' } },
    { n: 3, title: { vi: 'Ẩn Chính 8–14: quay vào bên trong', en: 'Majors 8–14: turning inward' }, cards: ['major-8', 'major-9', 'major-10', 'major-11', 'major-12', 'major-13', 'major-14'], visual: 'strip',
      intro: { vi: 'Sau chiến thắng đầu tiên, Gã Khờ học rằng sức mạnh thật là sức mạnh lặng. Bảy lá này nói về buông, chờ, chịu trách nhiệm và cân bằng.', en: 'After the first victory, the Fool learns that real strength is quiet. These seven cards speak of letting go, waiting, owning your actions and finding balance.' } },
    { n: 4, title: { vi: 'Ẩn Chính 15–21: bóng tối và ánh sáng', en: 'Majors 15–21: darkness and light' }, cards: ['major-15', 'major-16', 'major-17', 'major-18', 'major-19', 'major-20', 'major-21'], visual: 'strip',
      intro: { vi: 'Chặng cuối: bị trói, sụp đổ, rồi hy vọng, sương mù, ánh sáng, thức tỉnh và về đích. Đây là những lá mạnh nhất trong bộ.', en: 'The last stretch: bound, toppled, then hope, fog, light, awakening and arrival. These are the strongest cards in the deck.' } },
    { n: 5, title: { vi: 'Gậy và Cốc: lửa và nước', en: 'Wands and Cups: fire and water' }, suits: ['wands', 'cups'], visual: 'suits',
      intro: { vi: 'Ẩn Phụ đi từ Át (hạt giống) đến Mười (kết quả). Gậy là hành động và đam mê. Cốc là cảm xúc và tình yêu. Nhìn cả dãy mười lá, bạn sẽ thấy một câu chuyện lên rồi xuống.', en: 'The Minors run from Ace (the seed) to Ten (the outcome). Wands are action and passion. Cups are feeling and love. Look at the ten in a row and you see a story that rises and falls.' } },
    { n: 6, title: { vi: 'Kiếm và Tiền: khí và đất', en: 'Swords and Pentacles: air and earth' }, suits: ['swords', 'pentacles'], visual: 'suits',
      intro: { vi: 'Kiếm là suy nghĩ, lời nói và xung đột: chất khó nhất của bộ bài. Tiền là tiền bạc, sức khỏe và việc cụ thể: chất chậm mà chắc.', en: 'Swords are thought, words and conflict: the hardest suit in the deck. Pentacles are money, health and practical work: the slow and steady suit.' } },
    { n: 7, title: { vi: 'Lá hoàng gia: 16 tính cách', en: 'The court: 16 characters' }, guide: 'tarot-court', visual: 'court',
      intro: { vi: 'Bốn cấp nhân bốn chất. Đọc theo hàng để thấy chất, theo cột để thấy cấp. Một lá hoàng gia có thể là một người, một phần của bạn, hoặc một cách hành xử.', en: 'Four ranks times four suits. Read across a row for the suit, down a column for the rank. A court card can be a person, a part of you, or a way of acting.' } },
    { n: 8, title: { vi: 'Trải bài và luyện đọc', en: 'Spreads and reading practice' }, guides: ['tarot-start', 'tarot-reversed'], visual: 'spreads', sys: 'tarot',
      intro: { vi: 'Bắt đầu với một lá, rồi ba lá. Celtic Cross để dành khi bạn đã đọc quen. Mỗi trải bài có sơ đồ và câu hỏi cho từng vị trí.', en: 'Start with one card, then three. Save the Celtic Cross for when reading feels natural. Every spread has a diagram and a question for each position.' } }
  ],
  lenormand: [
    { n: 1, title: { vi: 'Lenormand là gì và cách học', en: 'What Lenormand is and how to learn it' }, guide: 'len-vs-tarot', extra: ['len-pairs', 2], visual: 'lenintro' },
    { n: 2, title: { vi: 'Lá 1–12: người đưa tin đến con chim', en: 'Cards 1–12: from the Rider to the Birds' }, len: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], visual: 'lenstrip',
      intro: { vi: 'Mỗi lá là một vật, một danh từ. Học tên, sắc thái (tích cực, trung tính, tiêu cực) và một từ khóa. Đừng cố nhớ hết nghĩa; nghĩa đến khi ghép cặp.', en: 'Each card is a thing, a noun. Learn the name, the tone (positive, neutral, negative) and one keyword. Do not try to memorise every meaning; meaning comes when you pair cards.' } },
    { n: 3, title: { vi: 'Lá 13–24: đứa trẻ đến trái tim', en: 'Cards 13–24: from the Child to the Heart' }, len: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], visual: 'lenstrip',
      intro: { vi: 'Nhóm này có nhiều lá về người và về chuyện giữa người với người: Đứa Trẻ, Cáo, Gấu, Chuột, Trái Tim.', en: 'This group holds many people cards and cards about what happens between people: the Child, Fox, Bear, Mice, Heart.' } },
    { n: 4, title: { vi: 'Lá 25–36: chiếc nhẫn đến cây thánh giá', en: 'Cards 25–36: from the Ring to the Cross' }, len: [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36], visual: 'lenstrip',
      intro: { vi: 'Nhóm cuối có hai lá chỉ người hỏi (Quý Ông, Quý Bà), các lá thời gian và kết thúc: Mặt Trăng, Chìa Khóa, Mỏ Neo, Thánh Giá.', en: 'The last group has the two significators (Man, Woman), the timing cards and the endings: Moon, Key, Anchor, Cross.' } },
    { n: 5, title: { vi: 'Ghép cặp: đọc hai lá và ba lá', en: 'Pairs: reading two and three cards' }, guide: 'len-pairs', visual: 'pairs',
      intro: { vi: 'Đây là kỹ năng chính của Lenormand. Lá đầu là chủ đề, lá sau bổ nghĩa. Bên dưới là những cặp thường gặp, lấy từ trang của từng lá.', en: 'This is the core skill of Lenormand. The first card is the subject, the second describes it. Below are common pairs, taken from the card pages.' } },
    { n: 6, title: { vi: 'Trải bài: từ ba lá đến Grand Tableau', en: 'Spreads: from three cards to the Grand Tableau' }, visual: 'spreads', sys: 'len',
      intro: { vi: 'Ba lá là bài tập hằng ngày. Chín lá (hộp 3×3) là trải bài đầy đủ đầu tiên. Grand Tableau 36 lá để dành khi bạn đã đọc cặp lá không cần tra.', en: 'Three cards is the daily exercise. Nine cards (the 3×3 box) is the first full spread. Save the 36-card Grand Tableau for when you read pairs without looking them up.' } }
  ]
};

const DONE = {
  get() { return store.get('nabu-lessons-done', {}); },
  is(course, n) { return !!(this.get()[course] || {})[n]; },
  toggle(course, n) { const d = this.get(); d[course] = d[course] || {}; d[course][n] = !d[course][n]; store.set('nabu-lessons-done', d); }
};

/* ---- visual blocks ---- */
function cardTile(id) {
  const c = cardById(id), I = insightOf(id);
  return '<button class="vt" data-open-card="' + id + '">' + faceSVG(c) + '<b>' + esc(c.name) + '</b><span>' + esc(I ? I.pos.slice(0, 2).join(' · ') : c.kw.slice(0, 2).join(' · ')) + '</span></button>';
}
function stripHTML(ids) { return '<div class="vstrip">' + ids.map(cardTile).join('') + '</div>'; }
function journeyHTML() {
  const S = T();
  const stages = [[lang === 'vi' ? 'Chặng một · bước ra thế giới' : 'Part one · into the world', 0, 7], [lang === 'vi' ? 'Chặng hai · quay vào bên trong' : 'Part two · turning inward', 8, 14], [lang === 'vi' ? 'Chặng ba · bóng tối và ánh sáng' : 'Part three · darkness and light', 15, 21]];
  return '<div class="journey">' + stages.map((st, i) => {
    const ids = []; for (let k = st[1]; k <= st[2]; k++) ids.push('major-' + k);
    return '<div class="stage s' + i + '"><div class="stage-h"><span class="num">' + (i + 1) + '</span>' + esc(st[0]) + '</div><div class="vstrip">' + ids.map((id) => { const c = cardById(id); return '<button class="vt" data-open-card="' + id + '">' + faceSVG(c) + '<b>' + esc(c.badge + ' · ' + c.name) + '</b></button>'; }).join('') + '</div></div>';
  }).join('') + '<p class="faint">' + esc(S.journeyHint) + '</p></div>' + minorsByElementHTML();
}
/* The 56 Minors in four element groups, Ace to King. */
function minorsByElementHTML() {
  const X = LEX[lang];
  return '<div class="journey minors"><h3 style="margin:16px 0 8px">' + esc(lang === 'vi' ? '56 lá Ẩn Phụ · bốn nguyên tố' : 'The 56 Minor Arcana · four elements') + '</h3>' + SUIT_KEYS.map((s) => {
    const ids = []; for (let i = 1; i <= 10; i++) ids.push(s + '-' + i); for (let i = 0; i < 4; i++) ids.push(s + '-c' + i);
    const el = { wands: 'fire', cups: 'water', swords: 'air', pentacles: 'earth' }[s];
    return '<div class="stage" style="border-color:' + EL_COLOR[el] + '"><div class="stage-h"><span class="num" style="background:' + EL_COLOR[el] + '">' + ZELEM[el].g + '</span>' + esc(X.suitNames[s]) + ' · ' + esc(X.elements[s]) + '</div><div class="vstrip">' + ids.map((id) => { const c = cardById(id); return '<button class="vt" data-open-card="' + id + '">' + faceSVG(c) + '<b>' + esc(c.name) + '</b></button>'; }).join('') + '</div></div>';
  }).join('') + '</div>';
}
function suitsHTML(suits) {
  const S = T(), X = LEX[lang];
  const wheel = '<div class="wheel">' + SUIT_KEYS.map((s) => '<div class="w ' + s + (suits.indexOf(s) > -1 ? ' on' : '') + '"><svg viewBox="-20 -22 40 44">' + '<g stroke="var(--card-ink)" stroke-linejoin="round" stroke-linecap="round" fill="none">' + emblem(s, 0, 0, 1) + '</g></svg><b>' + esc(X.suitNames[s]) + '</b><span>' + esc(X.elements[s]) + '</span></div>').join('') + '</div>';
  return wheel + suits.map((s) => { const ids = []; for (let i = 1; i <= 10; i++) ids.push(s + '-' + i); return '<h3 class="m-' + s + '">' + esc(X.suitNames[s]) + ' · ' + esc(X.elements[s]) + '</h3>' + stripHTML(ids); }).join('');
}
function courtHTML() {
  const X = LEX[lang];
  let h = '<div class="court"><div class="corner"></div>' + X.courts.map((c) => '<div class="ch">' + esc(c) + '</div>').join('');
  SUIT_KEYS.forEach((s) => { h += '<div class="rh m-' + s + '">' + esc(X.suitNames[s]) + '</div>'; for (let i = 0; i < 4; i++) { const id = s + '-c' + i; h += '<button class="cc" data-open-card="' + id + '">' + faceSVG(cardById(id)) + '</button>'; } });
  return h + '</div>';
}
function lenTile(n) {
  const d = lenCard(n);
  return '<button class="vt tone-' + d.tone + '" data-len="' + n + '">' + lenFace(n) + '<b>' + n + '. ' + esc(d.name) + '</b><span>' + esc((d.kw.pos || [])[0] || '') + '</span><i class="tone">' + esc(T().lenTone[d.tone]) + '</i></button>';
}
function lenStripHTML(ns) { return '<div class="tonekey">' + ['pos', 'neu', 'neg'].map((t) => '<span class="tk tone-' + t + '">' + esc(T().lenTone[t]) + '</span>').join('') + '</div><div class="vstrip">' + ns.map(lenTile).join('') + '</div>'; }
function lenIntroHTML() {
  const ns = []; for (let i = 1; i <= 36; i++) ns.push(i);
  return '<div class="vgrid">' + ns.map((n) => '<button class="vg" data-len="' + n + '">' + lenFace(n) + '</button>').join('') + '</div><p class="faint">' + esc(T().lenGridHint) + '</p>';
}
function pairsHTML() {
  // Resolve "+ Heart" style combos on a handful of cards into face pairs.
  const byName = {}; for (let i = 1; i <= 36; i++) byName[LEN.en[i].name.toLowerCase()] = i;
  const out = [];
  [1, 3, 5, 24, 27, 33].forEach((n) => { const d = lenCard(n); (d.combo || []).slice(0, 2).forEach((c) => { const m = /\+\s*(.+)$/.exec(LEN.en[n].combo[d.combo.indexOf(c)][0]); const t = m && byName[m[1].trim().toLowerCase()]; if (t) out.push([n, t, c[1]]); }); });
  return '<div class="pairs">' + out.map((p) => '<div class="pair"><div class="pf">' + lenFace(p[0]) + '<span>+</span>' + lenFace(p[1]) + '</div><p>' + esc(p[2]) + '</p></div>').join('') + '</div>';
}
function spreadsVisualHTML(sys) {
  return SPREADS[lang].filter((s) => s.sys === sys && s.n <= 12).map((s) => '<a class="spv" href="#/learn/spread/' + s.id + '"><div class="spd">' + spreadArt(s.lay) + '</div><b>' + esc(s.name) + '</b><span>' + s.n + (lang === 'vi' ? ' lá' : ' cards') + '</span></a>').join('')
    + (sys === 'len' ? '<a class="spv" href="#/learn/spread/len-gt"><div class="spd gt">' + spreadArt(LAY.gt) + '</div><b>Grand Tableau</b><span>36 ' + (lang === 'vi' ? 'lá' : 'cards') + '</span></a>' : '');
}

/* ---- pages ---- */
function lessonListHTML(courseId) {
  const S = T();
  return '<div class="lessons">' + LESSONS[courseId].map((l) => '<a class="lsn' + (DONE.is(courseId, l.n) ? ' done' : '') + '" href="#/learn/lesson/' + courseId + '/' + l.n + '"><span class="num">' + l.n + '</span><span class="tt">' + esc(L(l.title)) + '</span><span class="chk">' + (DONE.is(courseId, l.n) ? '✓' : '›') + '</span></a>').join('') + '</div>';
}
function renderLesson(courseId, n) {
  const S = T(), m = $('#main'), l = (LESSONS[courseId] || []).filter((x) => x.n === Number(n))[0];
  if (!l) { location.hash = '#/learn/' + courseId; return; }
  if (!(n === '1' || n === 1) && gate(courseId, '#/learn/' + courseId)) return;
  let body = l.intro ? '<p class="lead">' + esc(L(l.intro)) + '</p>' : '';
  if (l.guide) { const g = GUIDES.filter((x) => x.id === l.guide)[0]; body += '<div class="guide">' + guideBodyHTML(g) + '</div>'; if (l.visual === 'court' || l.visual === 'journey' || l.visual === 'lenintro' || l.visual === 'pairs') { /* the lesson draws its own */ } else { const gv = guideVisualHTML(g.id); if (gv) body += '<div class="visual">' + gv + '</div>'; } }
  if (l.extra) { const g = GUIDES.filter((x) => x.id === l.extra[0])[0], sct = g.sections[l.extra[1]]; body += '<div class="guide"><h2>' + esc(L(sct.h)) + '</h2><p>' + esc(L(sct.p)) + '</p></div>'; }
  let vis = '';
  if (l.visual === 'journey') vis = journeyHTML();
  else if (l.visual === 'strip') vis = stripHTML(l.cards);
  else if (l.visual === 'suits') vis = suitsHTML(l.suits);
  else if (l.visual === 'court') vis = courtHTML();
  else if (l.visual === 'lenintro') vis = lenIntroHTML();
  else if (l.visual === 'lenstrip') vis = lenStripHTML(l.len);
  else if (l.visual === 'pairs') vis = pairsHTML();
  else if (l.visual === 'spreads') vis = '<div class="spreads-v">' + spreadsVisualHTML(l.sys) + '</div>';
  if (l.guides) vis += l.guides.map((id) => guideRow(GUIDES.filter((x) => x.id === id)[0])).join('');
  const prev = LESSONS[courseId].filter((x) => x.n === l.n - 1)[0], next = LESSONS[courseId].filter((x) => x.n === l.n + 1)[0];
  m.innerHTML = backLink('#/learn/' + courseId, S.cats[courseId]) + '<div class="eyebrow">' + esc(S.lessonN(l.n)) + ' / ' + LESSONS[courseId].length + '</div><h1 style="margin-bottom:10px">' + esc(L(l.title)) + '</h1>'
    + body + '<div class="visual">' + vis + '</div>'
    + aiPanelHTML({ type: 'lesson', course: courseId, n: l.n })
    + '<button class="btn block' + (DONE.is(courseId, l.n) ? '' : ' primary') + '" id="ldone">' + (DONE.is(courseId, l.n) ? '✓ ' + esc(S.lessonDone) : esc(S.markDone)) + '</button>'
    + '<div class="row" style="margin-top:10px">' + (prev ? '<a class="btn" href="#/learn/lesson/' + courseId + '/' + prev.n + '">← ' + esc(S.lessonN(prev.n)) + '</a>' : '') + (next ? '<a class="btn" href="#/learn/lesson/' + courseId + '/' + next.n + '" style="margin-left:auto">' + esc(S.lessonN(next.n)) + ' →</a>' : '') + '</div>';
  bindCardLinks(m); bindAI(m);
  $$('[data-len]', m).forEach((b) => b.addEventListener('click', () => { location.hash = '#/learn/len/' + b.getAttribute('data-len'); }));
  $('#ldone').addEventListener('click', () => { DONE.toggle(courseId, l.n); renderLesson(courseId, n); });
}
