/* ============================ learn ============================
   #/learn                  overview
   #/learn/tarot?tab=cards|spreads|guides      the Tarot course (paid)
   #/learn/lenormand?tab=…                     the Lenormand course (paid)
   #/learn/card/<id>  #/learn/len/<n>  #/learn/spread/<id>  #/learn/guide/<id>
   #/learn/astro, #/learn/sign/<key>, #/learn/manifest, #/learn/fortune, #/learn/numbers  (free) */
const CAT_ICONS = { tarot: PICK_ICON, lenormand: '🗝️', astro: '🔮', manifest: '🌙', fortune: '🔢' };
const badgeHTML = () => '';
const courseOf = (id) => COURSES.filter((c) => c.id === id)[0];

/* ---- paywall ---- */
function paywallHTML(courseId) {
  const S = T(), c = courseOf(courseId), a = ACCESS.get()[courseId];
  const expired = a && a < isoDate(new Date());
  return '<div class="paywall"><div class="ic">🔒</div><h2>' + esc(L(c.name)) + '</h2><p class="muted">' + esc(L(c.blurb)) + '</p>'
    + '<ul class="inc">' + L(c.includes).map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>'
    + '<div class="price">' + fmtPrice(c.price) + ' <span>/ ' + c.months + ' ' + esc(S.months6) + '</span></div>'
    + (expired ? '<p class="hint err">' + esc(S.courseExpired(a)) + '</p>' : '')
    + '<a class="btn primary block" data-buy="' + courseId + '" href="' + (CONFIG.instagram ? 'https://ig.me/m/' + esc(CONFIG.instagram) : '#/me') + '" target="_blank" rel="noopener">' + esc(S.buyCourse) + '</a>'
    + '<p class="hint" style="margin:8px 0">' + esc(S.buyHint) + '</p>'
    + '<div class="row"><input id="ccode" placeholder="NABU-T-…" autocapitalize="characters" style="flex:1"><button class="btn" id="cunlock">' + esc(S.unlock) + '</button></div><p class="hint" id="cstatus"></p></div>';
}
function bindPaywall(root, after) {
  const S = T();
  $$('[data-buy]', root).forEach((a) => a.addEventListener('click', () => { const c = courseOf(a.getAttribute('data-buy')); copyText(S.buyMsg(L(c.name), fmtPrice(c.price), c.months)); toast(S.copied); }));
  const btn = $('#cunlock', root);
  if (btn) btn.addEventListener('click', () => {
    const r = parseCode($('#ccode', root).value);
    const st = $('#cstatus', root);
    if (!r) { st.textContent = S.badCode; st.className = 'hint err'; return; }
    ACCESS.grant(r.course, r.until);
    toast(S.unlocked); if (after) after(); else route();
  });
}
/* What a locked course shows: lesson 1 = the overview guide, lesson 2 = the first card. */
const DEMO = { tarot: { guide: 'tarot-overview', card: 'major-0' }, lenormand: { guide: 'len-vs-tarot', card: 1 } };
function demoHTML(courseId) {
  const S = T(), d = DEMO[courseId], g = GUIDES.filter((x) => x.id === d.guide)[0];
  const lesson = (n, title, body) => '<div class="acc open lesson"><button><span>' + esc(S.lessonN(n)) + ' · ' + esc(title) + '</span></button><div class="in">' + body + '</div></div>';
  let l1 = guideBodyHTML(g);
  if (courseId === 'lenormand') { const p = GUIDES.filter((x) => x.id === 'len-pairs')[0]; l1 += '<h2>' + esc(L(p.sections[2].h)) + '</h2><p>' + esc(L(p.sections[2].p)) + '</p>'; }
  l1 += '<div class="visual">' + (courseId === 'tarot' ? journeyHTML() : lenIntroHTML()) + '</div>'
  const l2 = courseId === 'tarot' ? cardBodyHTML(d.card) : lenBodyHTML(d.card);
  return '<div class="demo-head"><span class="chip pink">' + esc(S.demoTag) + '</span><p class="muted">' + esc(S.demoIntro) + '</p></div>'
    + lesson(1, S.lesson1, '<div class="guide">' + l1 + '</div>' + aiPanelHTML({ type: 'lesson', course: courseId, n: 1 })) + lesson(2, S.lesson2, l2);
}
function gate(courseId, back) {
  if (ACCESS.has(courseId)) return false;
  const m = $('#main');
  m.innerHTML = backLink(back || '#/learn', T().learnTitle) + paywallHTML(courseId);
  bindPaywall(m);
  return true;
}

function renderLearn(args, params) {
  const S = T(), m = $('#main'), sub = args[0];
  if (!sub) {
    const ints = PROFILE.interests || [];
    const tile = (k, locked) => '<a class="tile' + (ints.indexOf(k) > -1 ? ' rec' : '') + '" href="#/learn/' + k + '"><div class="ic">' + CAT_ICONS[k] + (locked ? ' <span class="lock">🔒</span>' : '') + '</div><b>' + esc(S.cats[k]) + '</b><span>' + esc(S.catSub[k]) + '</span></a>';
    m.innerHTML = '<div class="eyebrow">' + esc(S.nav.learn) + '</div><h1 style="margin-bottom:6px">' + esc(S.learnTitle) + '</h1><p class="muted">' + esc(S.learnIntro) + '</p>'
      + '<div class="eyebrow">' + esc(S.courses) + '</div><div class="tiles">' + tile('tarot', !ACCESS.has('tarot')) + tile('lenormand', !ACCESS.has('lenormand')) + '</div>'
      + '<div class="eyebrow">' + esc(S.freeReads) + '</div><div class="tiles">' + tile('astro') + tile('manifest') + tile('fortune') + '</div>'
      + (function () { const ints = PROFILE.interests || []; const list = GUIDES.filter((g) => g.tags.some((t) => ints.indexOf(t) > -1) && !((g.cat === 'tarot' || g.cat === 'lenormand') && !ACCESS.has(g.cat))).slice(0, 4); return list.length ? '<div class="sec"><div class="eyebrow">' + esc(S.forInterests) + '</div>' + list.map(guideRow).join('') + '</div>' : ''; }());
    return;
  }
  if (sub === 'tarot') return renderCourse('tarot', params.tab);
  if (sub === 'lenormand') return renderCourse('lenormand', params.tab);
  if (sub === 'lesson') return renderLesson(args[1], args[2]);
  if (sub === 'card') return renderCard(args[1]);
  if (sub === 'len') return renderLen(Number(args[1]));
  if (sub === 'astro') return renderAstro();
  if (sub === 'sign') return renderSign(args[1]);
  if (sub === 'spread') return renderSpread(args[1]);
  if (sub === 'fortune') return renderFortune(args[1]);
  if (sub === 'manifest') return renderGuideList(sub);
  if (sub === 'guide') return renderGuide(args[1]);
  if (sub === 'numbers') return renderFortune('numbers');
  redirect('#/learn');
}

/* ---- the two courses: cards | spreads | guides ---- */
function renderCourse(courseId, tab) {
  if (!ACCESS.has(courseId)) {
    const S = T(), m = $('#main');
    m.innerHTML = backLink('#/learn', S.learnTitle) + '<h1 style="margin-bottom:8px">' + esc(S.cats[courseId]) + '</h1>' + demoHTML(courseId) + '<div id="unlockwrap" style="margin-top:18px">' + paywallHTML(courseId) + '</div>';
    bindAccordions(m); bindPaywall(m); bindCardLinks(m); bindAI(m);
    $$('[data-len]', m).forEach((b) => b.addEventListener('click', () => { location.hash = '#/learn/len/' + b.getAttribute('data-len'); }));
    return;
  }
  const S = T(), m = $('#main'), sys = courseId === 'tarot' ? 'tarot' : 'len';
  void sys;
  tab = ['lessons', 'cards', 'spreads', 'guides'].indexOf(tab) > -1 ? tab : 'lessons';
  const until = ACCESS.get()[courseId];
  m.innerHTML = backLink('#/learn', S.learnTitle) + '<h1 style="margin-bottom:4px">' + esc(S.cats[courseId]) + '</h1><p class="faint">' + esc(S.accessUntil(fmtDate(until))) + '</p>'
    + '<div class="tabs" id="ctabs">' + ['lessons', 'cards', 'spreads', 'guides'].map((t) => '<button data-t="' + t + '" class="' + (tab === t ? 'on' : '') + '">' + esc(S.courseTabs[t]) + '</button>').join('') + '</div><div id="cpanel"></div>';
  const panel = $('#cpanel');
  const show = (t) => {
    if (t === 'lessons') { panel.innerHTML = '<p class="muted" style="font-size:14px">' + esc(S.lessonsIntro(LESSONS[courseId].length)) + '</p>' + lessonListHTML(courseId); }
    else if (t === 'cards') { panel.innerHTML = courseId === 'tarot' ? tarotGridHTML() : lenGridHTML(); bindGrid(panel, courseId); }
    else if (t === 'spreads') { panel.innerHTML = spreadsListHTML(sys); }
    else { panel.innerHTML = (courseId === 'lenormand' ? '<p class="muted" style="font-size:14px">' + esc(S.lenNote) + '</p>' : '') + GUIDES.filter((g) => g.cat === courseId).map(guideRow).join(''); }
  };
  show(tab);
  $$('#ctabs button').forEach((b) => b.addEventListener('click', () => { $$('#ctabs button').forEach((x) => x.classList.toggle('on', x === b)); history.replaceState(null, '', '#/learn/' + courseId + '?tab=' + b.getAttribute('data-t')); show(b.getAttribute('data-t')); }));
}
function tarotGridHTML() {
  const S = T(), D = DECK[lang];
  const grid = (list) => '<div class="deckgrid">' + list.map((c) => '<button data-open-card="' + c.id + '">' + faceSVG(c) + esc(c.name) + '</button>').join('') + '</div>';
  return '<div class="tabs" id="ttabs"><button class="on" data-suit="major">' + esc(S.majors) + '</button>' + SUIT_KEYS.map((s) => '<button data-suit="' + s + '">' + esc(S.suitOf[s]) + '</button>').join('') + '</div>'
    + '<div id="tgrid">' + grid(D.filter((c) => c.suit === 'major')) + '</div>';
}
function lenGridHTML() {
  let grid = '';
  for (let i = 1; i <= 36; i++) { const d = lenCard(i); if (d) grid += '<button data-len="' + i + '">' + lenFace(i) + esc(d.name) + '</button>'; }
  return '<div class="deckgrid">' + grid + '</div>';
}
function bindGrid(panel, courseId) {
  if (courseId === 'tarot') {
    const D = DECK[lang], grid = (list) => '<div class="deckgrid">' + list.map((c) => '<button data-open-card="' + c.id + '">' + faceSVG(c) + esc(c.name) + '</button>').join('') + '</div>';
    bindCardLinks(panel);
    $$('#ttabs button', panel).forEach((b) => b.addEventListener('click', () => {
      $$('#ttabs button', panel).forEach((x) => x.classList.toggle('on', x === b));
      $('#tgrid', panel).innerHTML = grid(D.filter((c) => c.suit === b.getAttribute('data-suit'))); bindCardLinks($('#tgrid', panel));
    }));
  } else {
    $$('[data-len]', panel).forEach((b) => b.addEventListener('click', () => { location.hash = '#/learn/len/' + b.getAttribute('data-len'); }));
  }
}

/* ---- tarot card page ---- */
function renderCard(id) {
  if (id !== DEMO.tarot.card && gate('tarot', '#/learn/tarot')) return;
  const S = T(), m = $('#main');
  if (!cardById(id)) { redirect('#/learn/tarot'); return; }
  m.innerHTML = backLink('#/learn/tarot', S.cats.tarot) + cardBodyHTML(id);
  bindAccordions(m); bindAI(m);
}
function cardBodyHTML(id) {
  const S = T(), c = cardById(id);
  const other = cardById(id, lang === 'vi' ? 'en' : 'vi'), I = insightOf(id);
  const kwv = lang === 'vi' ? (KW.vi[id] || null) : null;
  // Some Vietnamese keyword sets carry no negative side (or no positive side).
  const pos = kwv ? (kwv.pos || []) : (I ? I.pos : c.kw), neg = kwv ? (kwv.neg || []) : (I ? I.neg : []);
  const asks = lang === 'vi' ? (ASK.vi[id] || []) : [];
  const groups = {};
  asks.forEach((a) => { (groups[a[0]] = groups[a[0]] || []).push(a); });
  const catName = { love: 'Tình cảm', career: 'Công việc', money: 'Tiền bạc', health: 'Sức khỏe', timing: 'Thời gian', verdict: 'Có / không', other: 'Khác' };
  return '<div class="detail">'
    + '<div class="hero"><span class="face">' + faceSVG(c) + '</span><div><div class="name">' + esc(c.name) + '</div><div class="en">' + esc(other.name) + '</div><div class="meta m-' + c.suit + '"><i>' + esc(c.meta) + '</i></div></div></div>'
    + '<div class="ins"><h3>' + esc(S.onTheCard) + '</h3><p class="scene">' + esc(c.scene) + '</p></div>'
    + '<div class="ins"><h3>' + esc(S.kwPos) + '</h3><div class="kwl">' + pos.map((k) => '<span>' + esc(k) + '</span>').join('') + '</div>'
    + (neg.length ? '<h3>' + esc(S.kwNeg) + '</h3><div class="kwl neg">' + neg.map((k) => '<span>' + esc(k) + '</span>').join('') + '</div>' : '') + '</div>'
    + '<div class="ins"><h3>' + esc(S.upright) + '</h3><p>' + esc(c.up) + '</p>' + (I ? '<p>' + esc(I.now) + '</p>' : '') + '<h3>' + esc(S.reversed) + '</h3><p>' + esc(c.rev) + '</p></div>'
    + (I ? '<div class="ins"><h3>' + esc(S.focus.love) + '</h3><p>' + esc(I.love) + '</p><h3>' + esc(S.focus.work) + '</h3><p>' + esc(I.work) + '</p><h3>' + esc(S.focus.study) + '</h3><p>' + esc(I.study) + '</p><h3>' + esc(S.focus.money) + '</h3><p>' + esc(I.money) + '</p></div>' : '')
    + (asks.length ? '<div class="ins"><h3>' + esc(S.questions) + '</h3>' + Object.keys(groups).map((g) => '<div class="acc"><button><span>' + esc(catName[g] || g) + ' (' + groups[g].length + ')</span></button><div class="in">'
      + groups[g].map((a) => '<div class="qa"><div class="q">' + esc(a[1]) + '</div><p class="a">' + esc(a[2]) + '</p></div>').join('') + '</div></div>').join('') + '</div>' : '')
    + aiPanelHTML({ type: 'card', id: id, focus: 'general' })
    + '<div class="row"><a class="btn primary" href="#/pick">' + esc(S.nav.pick) + '</a><a class="btn" href="#/book?card=' + id + '">' + esc(S.ctaBook) + '</a></div></div>';
}

/* ---- lenormand ---- */
function lenCard(n, lg) { const d = LEN[lg || lang][n]; return d ? Object.assign({ n: n, art: LEN_ART[n] }, d) : null; }
function lenFace(n) {
  const d = lenCard(n);
  return '<svg viewBox="0 0 100 172" role="img" aria-label="' + esc(d.name) + '"><rect x="1.3" y="1.3" width="97.4" height="169.4" rx="3" fill="var(--card-bg)" stroke="var(--card-ink)" stroke-width="2.6"/>'
    + '<g stroke="var(--card-ink)" stroke-linejoin="round" stroke-linecap="round" fill="none">' + d.art + '<rect x="5" y="5" width="90" height="135" fill="none" stroke-width="1"/><rect x="5" y="140" width="90" height="27" fill="none" stroke-width="1"/></g>'
    + '<g><rect x="41" y="6" width="18" height="15" fill="var(--card-bg)" stroke="var(--card-ink)" stroke-width="1"/><text x="50" y="17.2" text-anchor="middle" font-family="Georgia,serif" font-size="9.5" fill="var(--card-ink)">' + n + '</text></g>'
    + '<text x="50" y="157" text-anchor="middle" font-family="Be Vietnam Pro, sans-serif" font-size="7.4" fill="var(--card-ink)">' + esc(d.name) + '</text></svg>';
}
function renderLen(n) {
  if (n !== DEMO.lenormand.card && gate('lenormand', '#/learn/lenormand')) return;
  const S = T(), m = $('#main');
  if (!lenCard(n)) { redirect('#/learn/lenormand'); return; }
  m.innerHTML = backLink('#/learn/lenormand', S.cats.lenormand) + lenBodyHTML(n);
}
function lenBodyHTML(n) {
  const S = T(), d = lenCard(n);
  const other = lenCard(n, lang === 'vi' ? 'en' : 'vi');
  const sec = (h, t) => t ? '<h3>' + esc(h) + '</h3><p>' + esc(t) + '</p>' : '';
  return '<div class="detail">'
    + '<div class="hero"><span class="face">' + lenFace(n) + '</span><div><div class="name">' + n + '. ' + esc(d.name) + '</div><div class="en">' + esc(other.name) + '</div>'
    + '<div class="meta"><span class="chip tag">' + esc(S.lenTone[d.tone]) + '</span> <span class="chip tag">' + esc(S.lenCard) + ': ' + esc(d.card) + '</span></div></div></div>'
    + '<div class="ins"><h3>' + esc(S.onTheCard) + '</h3><p class="scene">' + esc(d.scene) + '</p></div>'
    + '<div class="ins"><h3>' + esc(S.kwPos) + '</h3><div class="kwl">' + (d.kw.pos || []).map((k) => '<span>' + esc(k) + '</span>').join('') + '</div>'
    + ((d.kw.neg || []).length ? '<h3>' + esc(S.kwNeg) + '</h3><div class="kwl neg">' + d.kw.neg.map((k) => '<span>' + esc(k) + '</span>').join('') + '</div>' : '') + '</div>'
    + '<div class="ins">' + sec(S.lenCore, d.core) + sec(S.lenLove, d.love) + sec(S.lenWork, d.work) + sec(S.lenWho, d.who) + sec(S.lenTime, d.time) + '</div>'
    + ((d.combo || []).length ? '<div class="ins"><h3>' + esc(S.lenCombo) + '</h3>' + d.combo.map((c) => '<div class="qa"><div class="q">' + esc(c[0]) + '</div><p class="a">' + esc(c[1]) + '</p></div>').join('') + '</div>' : '')
    + '</div>';
}

/* ---- astrology (free) ---- */
function astroLine(id) {
  const a = ASTRO[id]; if (!a) return '';
  const sign = a.sign ? ZSIGN[a.sign] : null, planet = a.planet ? ZPLANET[a.planet] : null, el = a.el ? ZELEM[a.el] : null;
  const nm = (o) => o ? (o.g + ' ' + o[lang]) : '';
  if (a.k === 'sign') return nm(sign);
  if (a.k === 'planet') return nm(planet) + (el ? ' · ' + nm(el) : '');
  if (a.k === 'elem') return nm(el) + (a.outer ? ' · ' + nm(ZPLANET[a.outer]) : '');
  if (a.k === 'decan') return nm(planet) + ' ' + (lang === 'vi' ? 'trong' : 'in') + ' ' + nm(sign) + ' · ' + (lang === 'vi' ? a.dvi : a.den) + ' · ' + (lang === 'vi' ? a.tvi : a.ten);
  if (a.k === 'court') return nm(sign) + ' (' + (lang === 'vi' ? 'cuối ' : 'late ') + ZSIGN[a.prev][lang] + ' → ' + sign[lang] + ')';
  return nm(el);
}
function renderAstro() {
  const S = T(), m = $('#main'), me = mySign();
  m.innerHTML = backLink('#/learn', S.learnTitle) + '<h1 style="margin-bottom:6px">' + esc(S.cats.astro) + '</h1><p class="muted" style="font-size:14px">' + esc(S.astroNote) + '</p>'
    + '<div class="tabs" id="atabs"><button class="on" data-t="signs">' + (lang === 'vi' ? '12 cung' : '12 signs') + '</button><button data-t="planets">' + (lang === 'vi' ? 'Hành tinh' : 'Planets') + '</button><button data-t="houses">' + (lang === 'vi' ? '12 nhà' : '12 houses') + '</button><button data-t="aspects">' + (lang === 'vi' ? 'Góc chiếu' : 'Aspects') + '</button><button data-t="guides">' + (lang === 'vi' ? 'Bài đọc' : 'Guides') + '</button></div>'
    + '<div id="apanel"></div>';
  const panel = $('#apanel');
  const show = (t) => {
    if (t === 'signs') {
      panel.innerHTML = '<div class="visual">' + zodiacRingSVG(me > -1 ? ZKEYS[me] : null) + '<div class="ellegend">' + ['fire', 'earth', 'air', 'water'].map((el) => '<span><i style="background:' + EL_COLOR[el] + '"></i>' + esc(ZELEM[el][lang]) + '</span>').join('') + '</div></div>'
        + '<div class="signlist">' + ZKEYS.map((k, i) => { const z = ZSIGN[k]; return '<button data-sign="' + k + '" class="' + (i === me ? 'me' : '') + '"><span class="g" style="color:' + EL_COLOR[z.el] + '">' + z.g + '</span><b>' + esc(z[lang]) + '</b><span>' + esc(lang === 'vi' ? z.dvi : z.den) + '</span></button>'; }).join('') + '</div>';
      $$('[data-sign],[data-zsign]', panel).forEach((b) => b.addEventListener('click', () => { location.hash = '#/learn/sign/' + (b.getAttribute('data-sign') || b.getAttribute('data-zsign')); }));
    } else if (t === 'planets') {
      const showPlanet = (id) => { const p = PLANETS.filter((x) => x.id === id)[0]; $('#porbit', panel).innerHTML = planetOrbitSVG(id); $('#pout', panel).innerHTML = '<div class="nrow"><span class="ic">' + p.g + '</span><div><b>' + esc(p.name[lang]) + ' · ' + esc(lang === 'vi' ? 'chủ cung ' : 'rules ') + ZSIGN[p.rules].g + ' ' + esc(ZSIGN[p.rules][lang]) + '</b><p>' + esc(p[lang]) + '</p></div></div>'; $$('[data-pl]', panel).forEach((b) => b.classList.toggle('on', b.getAttribute('data-pl') === id)); };
      panel.innerHTML = '<div class="visual"><div id="porbit"></div><div class="chips">' + PLANETS.map((p) => '<button class="chip" data-pl="' + p.id + '">' + p.g + ' ' + esc(p.name[lang]) + '</button>').join('') + '</div></div><div class="ins" id="pout"></div>';
      $$('[data-pl]', panel).forEach((b) => b.addEventListener('click', () => showPlanet(b.getAttribute('data-pl'))));
      showPlanet('sun');
    } else if (t === 'houses') {
      const showHouse = (n) => { const h = HOUSES[n - 1]; $('#hwheel', panel).innerHTML = houseWheelSVG(n); $('#hout', panel).innerHTML = '<div class="nrow"><span class="ic" style="font-family:var(--display);font-size:30px">' + n + '</span><div><b>' + esc(h[lang][0]) + '</b><p>' + esc(h[lang][1]) + '</p></div></div>'; $$('[data-house]', panel).forEach((p) => p.addEventListener('click', () => showHouse(Number(p.getAttribute('data-house'))))); };
      panel.innerHTML = '<div class="visual awrapper"><div id="hwheel"></div><p class="faint">' + esc(lang === 'vi' ? 'Chạm vào một nhà trên bánh xe. Nhà 1 bắt đầu ở bên trái, chỗ cung Mọc.' : 'Tap a house on the wheel. House 1 starts on the left, at the Ascendant.') + '</p></div><div class="ins" id="hout"></div>';
      showHouse(1);
    } else if (t === 'aspects') {
      panel.innerHTML = ASPECTS.map((a) => '<div class="aspect">' + aspectSVG(parseInt(a.deg, 10)) + '<div><b>' + a.g + ' ' + esc(a.name[lang]) + ' · ' + a.deg + '</b><p>' + esc(a[lang]) + '</p></div></div>').join('');
    } else {
      panel.innerHTML = GUIDES.filter((g) => g.cat === 'astro').map((g) => guideRow(g)).join('');
    }
  };
  show('signs');
  $$('#atabs button').forEach((b) => b.addEventListener('click', () => { $$('#atabs button').forEach((x) => x.classList.toggle('on', x === b)); show(b.getAttribute('data-t')); }));
}
function renderSign(key) {
  const S = T(), m = $('#main'), z = ZSIGN[key];
  if (!z) { redirect('#/learn/astro'); return; }
  const zp = ZODIAC[key][lang], ruler = ZPLANET[ZRULER[key]];
  const cards = Object.keys(ASTRO).filter((id) => ASTRO[id].sign === key);
  m.innerHTML = backLink('#/learn/astro', S.cats.astro) + '<div class="detail">'
    + '<div class="hero" style="grid-template-columns:72px 1fr"><div class="glyph" style="width:72px;height:72px;border-radius:50%;background:' + EL_COLOR[z.el] + ';display:flex;align-items:center;justify-content:center;font-size:40px;color:#fff">' + z.g + '</div>'
    + '<div><div class="name">' + esc(z[lang]) + '</div><div class="en">' + esc(lang === 'vi' ? z.en : z.vi) + '</div><div class="meta"><i>' + esc(lang === 'vi' ? z.dvi : z.den) + '</i></div></div></div>'
    + '<div class="row" style="margin-bottom:12px"><span class="chip tag">' + esc(S.element) + ': ' + ZELEM[z.el].g + ' ' + esc(ZELEM[z.el][lang]) + '</span><span class="chip tag">' + esc(S.mode) + ': ' + esc(ZMODE[z.mod][lang]) + '</span><span class="chip tag">' + esc(S.ruler) + ': ' + ruler.g + ' ' + esc(ruler[lang]) + '</span></div>'
    + '<div class="kwl">' + zp.kw.map((k) => '<span>' + esc(k) + '</span>').join('') + '</div>'
    + '<div class="ins"><h3>' + esc(S.signAbout) + '</h3><p>' + esc(zp.about) + '</p><h3>' + esc(S.signLove) + '</h3><p>' + esc(zp.love) + '</p><h3>' + esc(S.signWork) + '</h3><p>' + esc(zp.work) + '</p><h3>' + esc(S.signTip) + '</h3><p>' + esc(zp.tip) + '</p></div>'
    + '<div class="ins"><h3>' + esc(S.strengths) + '</h3><div class="kwl">' + ZDEEP[key][lang].strengths.map((k) => '<span>' + esc(k) + '</span>').join('') + '</div><h3>' + esc(S.challenges) + '</h3><div class="kwl neg">' + ZDEEP[key][lang].challenges.map((k) => '<span>' + esc(k) + '</span>').join('') + '</div><h3>' + esc(S.compat) + '</h3><div class="awrapper">' + zodiacRingSVG(key, ZDEEP[key].compat) + '</div><div class="chips">' + ZDEEP[key].compat.map((k) => '<a class="chip lav" href="#/learn/sign/' + k + '">' + ZSIGN[k].g + ' ' + esc(ZSIGN[k][lang]) + '</a>').join('') + '</div></div>'
    + '<div class="ins"><h3>' + esc(S.moonSign) + '</h3><p>' + esc(ZDEEP[key][lang].moon) + '</p><h3>' + esc(S.risingSign) + '</h3><p>' + esc(ZDEEP[key][lang].rising) + '</p></div>'
    + '<div class="ins"><h3>' + esc(S.signCards) + '</h3><div class="mini">' + cards.map((id) => miniHTML(id, true)).join('') + '</div><p class="faint">' + cards.map((id) => cardById(id).name + ': ' + astroLine(id)).map(esc).join('<br>') + '</p></div>'
    + aiPanelHTML({ type: 'sign', key: key }) + '</div>';
  bindCardLinks(m); bindAI(m);
  $$('[data-zsign]', m).forEach((b) => b.addEventListener('click', () => { location.hash = '#/learn/sign/' + b.getAttribute('data-zsign'); }));
}

/* ---- spreads (inside each course) ---- */
function spreadArt(lay) {
  const U = 23, CW = 1, CH = 1.5, SX = 1.3, SY = 1.86, DROP = 6, crossed = {};
  lay.forEach((p) => { if (p[2] === 'r') crossed[p[0] + ',' + p[1]] = true; });
  const geo = lay.map((p) => { const rot = p[2] === 'r'; return { rot: rot, under: !rot && crossed[p[0] + ',' + p[1]], w: (rot ? CH : CW) * U, h: (rot ? CW : CH) * U, cx: (p[0] * SX + CW / 2) * U, cy: (p[1] * SY + CH / 2) * U + (rot ? DROP : 0) }; });
  let maxX = 0, maxY = 0; geo.forEach((g) => { maxX = Math.max(maxX, g.cx + g.w / 2); maxY = Math.max(maxY, g.cy + g.h / 2); });
  const W = maxX + 3, H = maxY + 3;
  let s = '<svg viewBox="0 0 ' + W.toFixed(1) + ' ' + H.toFixed(1) + '" width="' + Math.round(W) + '" height="' + Math.round(H) + '" role="img">';
  geo.forEach((g, i) => {
    s += '<rect x="' + (g.cx - g.w / 2).toFixed(1) + '" y="' + (g.cy - g.h / 2).toFixed(1) + '" width="' + g.w.toFixed(1) + '" height="' + g.h.toFixed(1) + '" rx="1.6" fill="var(--card-bg)" stroke="var(--card-ink)" stroke-width="1.1"/>';
    s += '<text x="' + (g.rot ? g.cx + g.w / 2 - 7 : g.cx).toFixed(1) + '" y="' + (g.under ? g.cy - g.h / 2 + 10 : g.cy + 3.3).toFixed(1) + '" text-anchor="middle" font-family="Georgia,serif" font-size="9.5" fill="var(--card-ink)">' + (i + 1) + '</text>';
  });
  return s + '</svg>';
}
function spreadsListHTML(sys) {
  const list = SPREADS[lang].filter((s) => s.sys === sys);
  return list.map((s) => '<a class="acc" href="#/learn/spread/' + s.id + '" style="display:block;text-decoration:none;color:inherit"><button style="pointer-events:none"><span>' + esc(s.name) + ' <span class="faint">· ' + s.n + (lang === 'vi' ? ' lá' : ' cards') + '</span></span></button></a>').join('');
}
function renderSpread(id) {
  const S = T(), m = $('#main'), s = SPREADS[lang].filter((x) => x.id === id)[0];
  if (!s) { redirect('#/learn'); return; }
  const courseId = s.sys === 'len' ? 'lenormand' : 'tarot', back = '#/learn/' + courseId + '?tab=spreads';
  if (gate(courseId, back)) return;
  const sec = (h, t) => t ? '<h3>' + esc(h) + '</h3><p>' + esc(t).replace(/\*([^*]+)\*/g, '<i>$1</i>') + '</p>' : '';
  m.innerHTML = backLink(back, S.courseTabs.spreads) + '<div class="guide"><h1>' + esc(s.name) + '</h1><p class="faint">' + s.n + (lang === 'vi' ? ' lá' : ' cards') + '</p>'
    + '<div class="spread-d">' + (s.n <= 12 ? spreadArt(s.lay) : '') + '</div>'
    + '<div class="ins">' + sec(S.spreadWhen, s.when) + sec(S.spreadAsk, s.ask) + '</div>'
    + '<div class="ins"><h3>' + esc(S.spreadPos) + '</h3>' + s.pos.map((p, i) => '<div class="qa"><div class="q">' + (i + 1) + '. ' + esc(p[0]) + '</div><p class="a">' + esc(p[1]) + '</p></div>').join('') + '</div>'
    + '<div class="ins">' + sec(S.spreadRead, s.read) + sec(S.spreadNote, s.note) + '</div>'
    + (s.id.indexOf('nabu-') === 0 ? '<a class="btn primary block" href="#/book">' + esc(S.ctaBook) + '</a>' : '') + '</div>';
}

/* ---- guides ---- */
function guideRow(g) {
  const locked = (g.cat === 'tarot' || g.cat === 'lenormand') && !ACCESS.has(g.cat);
  return '<a class="acc" href="#/learn/guide/' + g.id + '" style="display:block;text-decoration:none;color:inherit"><button style="pointer-events:none"><span>' + (locked ? '🔒 ' : '') + esc(L(g.title)) + '</span></button></a>';
}
function renderGuideList(cat) {
  const S = T(), m = $('#main');
  m.innerHTML = backLink('#/learn', S.learnTitle) + '<h1 style="margin-bottom:12px">' + esc(S.cats[cat]) + '</h1>' + GUIDES.filter((g) => g.cat === cat).map(guideRow).join('')
    + (cat === 'fortune' ? '<a class="btn block" href="#/learn/numbers" style="margin-top:10px">' + esc(S.numerology) + '</a>' : '');
}
function renderGuide(id) {
  const S = T(), m = $('#main'), g = GUIDES.filter((x) => x.id === id)[0];
  if (!g) { redirect('#/learn'); return; }
  const back = g.cat === 'tarot' || g.cat === 'lenormand' ? '#/learn/' + g.cat + '?tab=guides' : g.cat === 'astro' ? '#/learn/astro' : '#/learn/' + g.cat;
  if ((g.cat === 'tarot' || g.cat === 'lenormand') && g.id !== DEMO[g.cat].guide && gate(g.cat, back)) return;
  const vis = guideVisualHTML(g.id);
  m.innerHTML = backLink(back, S.cats[g.cat]) + '<div class="guide"><h1 style="margin:8px 0">' + esc(L(g.title)) + '</h1><p class="lead">' + esc(L(g.intro)) + '</p>'
    + (vis ? '<div class="visual">' + vis + '</div>' : '')
    + g.sections.map((s, i) => '<div class="gsec"><span class="n">' + (i + 1) + '</span><div><h2>' + esc(L(s.h)) + '</h2><p>' + esc(L(s.p)) + '</p></div></div>').join('') + '</div>';
  bindGuideVisual(m);
}
function guideBodyHTML(g) {
  return '<p class="lead">' + esc(L(g.intro)) + '</p>' + g.sections.map((s) => '<h2>' + esc(L(s.h)) + '</h2><p>' + esc(L(s.p)) + '</p>').join('');
}

/* ---- numbers (free) ---- */
function renderNumbers() {
  const S = T(), m = $('#main'), b = birthParts();
  if (!b) { m.innerHTML = backLink('#/learn/fortune', S.cats.fortune) + '<h1>' + esc(S.numerology) + '</h1><p class="muted">' + esc(S.enterBirthday) + '</p><a class="btn primary" href="#/me">' + esc(S.setupBtn) + '</a>'; return; }
  const lp = lifePath(b.y, b.m, b.d), si = mySign(), key = ZKEYS[si], nm = numerologyOf(PROFILE.name, PROFILE.birthday);
  const numRow = (label, n, text) => n ? '<div class="ins"><h3>' + esc(label) + ' · ' + n + '</h3><p>' + esc(text) + '</p></div>' : '';
  m.innerHTML = backLink('#/learn/fortune', S.cats.fortune) + '<h1 style="margin-bottom:12px">' + esc(S.numerology) + '</h1>'
    + '<div class="ins"><h3>' + esc(S.lifePathOf(lp)) + '</h3><p>' + esc(LIFEPATH[lp][lang]) + '</p><p class="faint">' + b.d + '/' + b.m + '/' + b.y + '</p></div>'
    + numRow(S.numBirthday, nm.birthday, (NUM[nm.birthday] || NUM[1])[lang].expr) + numRow(S.numYear, nm.personalYear, (PYEAR[nm.personalYear] || PYEAR[1])[lang])
    + '<div class="ins"><label class="f" for="nname">' + esc(S.numName) + '</label><input id="nname" value="' + esc(PROFILE.name || '') + '"><p class="hint">' + esc(S.numNameHint) + '</p><div id="nameout">' + (nm.expression ? numRow(S.numExpr, nm.expression, NUM[nm.expression][lang].expr) + numRow(S.numSoul, nm.soul, NUM[nm.soul][lang].soul) + numRow(S.numPers, nm.personality, NUM[nm.personality][lang].pers) : '') + '</div></div>'
    + aiPanelHTML({ type: 'numbers' })
    + '<div class="ins"><h3>' + esc(S.yourSign) + '</h3><p>' + ZSIGN[key].g + ' ' + esc(S.zodiac[si]) + ' · ' + esc(ZODIAC[key][lang].kw.join(', ')) + '</p><a href="#/learn/sign/' + key + '">' + esc(S.readSign) + ' →</a></div>'
    + '<div class="ins"><h3>' + esc(S.animal) + '</h3><p>' + (lang === 'vi' ? esc(animalOf(b.y).vi) + ' · ' + esc(canChi(b.y)) : 'Year of the ' + esc(animalOf(b.y).en) + ' (' + b.y + ')') + '</p><p class="faint">' + esc(S.animalNote) + '</p></div>'
    + GUIDES.filter((g) => g.id === 'fort-numerology' || g.id === 'fort-animals').map(guideRow).join('');
  bindAI(m);
  $('#nname').addEventListener('input', (e) => { const x = numerologyOf(e.target.value, PROFILE.birthday); $('#nameout').innerHTML = x.expression ? numRow(S.numExpr, x.expression, NUM[x.expression][lang].expr) + numRow(S.numSoul, x.soul, NUM[x.soul][lang].soul) + numRow(S.numPers, x.personality, NUM[x.personality][lang].pers) : ''; });
}
ROUTES.learn = { nav: 'learn', render: renderLearn };
