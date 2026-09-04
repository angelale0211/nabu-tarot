/* ============================ learn ============================
   #/learn                 categories
   #/learn/tarot           78 cards        #/learn/card/<id>
   #/learn/lenormand       36 cards        #/learn/len/<n>
   #/learn/astro           signs, planets, houses, aspects   #/learn/sign/<key>
   #/learn/spreads         layouts         #/learn/spread/<id>
   #/learn/manifest, #/learn/fortune       guides   #/learn/guide/<id>
   #/learn/numbers         the visitor's numbers */
const CAT_ICONS = { tarot: '🃏', lenormand: '🗝️', astro: '🔮', spreads: '🧩', manifest: '🌙', fortune: '🔢' };
const badgeHTML = (b) => '<span class="badge-src ' + b + '">' + esc(T().badges[b]) + '</span>';
const backLink = (href, label) => '<p><a href="' + href + '">← ' + esc(label) + '</a></p>';

function renderLearn(args) {
  const S = T(), m = $('#main'), sub = args[0];
  if (!sub) {
    const ints = PROFILE.interests || [];
    const rec = { tarot: ints.indexOf('tarot') > -1, lenormand: ints.indexOf('lenormand') > -1, astro: ints.indexOf('astro') > -1, manifest: ints.indexOf('manifest') > -1, fortune: ints.indexOf('fortune') > -1, spreads: ints.indexOf('tarot') > -1 };
    m.innerHTML = '<div class="eyebrow">' + esc(S.nav.learn) + '</div><h1 style="margin-bottom:6px">' + esc(S.learnTitle) + '</h1><p class="muted">' + esc(S.learnIntro) + '</p>'
      + '<div class="tiles">' + ['tarot', 'lenormand', 'astro', 'spreads', 'manifest', 'fortune'].map((k) =>
        '<a class="tile' + (rec[k] ? ' rec' : '') + '" href="#/learn/' + k + '"><div class="ic">' + CAT_ICONS[k] + '</div><b>' + esc(S.cats[k]) + '</b><span>' + esc(S.catSub[k]) + '</span></a>').join('') + '</div>'
      + suggestedGuidesHTML(4);
    return;
  }
  if (sub === 'tarot') return renderTarotList();
  if (sub === 'card') return renderCard(args[1]);
  if (sub === 'lenormand') return renderLenList();
  if (sub === 'len') return renderLen(Number(args[1]));
  if (sub === 'astro') return renderAstro();
  if (sub === 'sign') return renderSign(args[1]);
  if (sub === 'spreads') return renderSpreads();
  if (sub === 'spread') return renderSpread(args[1]);
  if (sub === 'manifest' || sub === 'fortune') return renderGuideList(sub);
  if (sub === 'guide') return renderGuide(args[1]);
  if (sub === 'numbers') return renderNumbers();
  location.hash = '#/learn';
}

/* ---- tarot ---- */
function renderTarotList() {
  const S = T(), m = $('#main');
  const grid = (list) => '<div class="deckgrid">' + list.map((c) => '<button data-open-card="' + c.id + '">' + faceSVG(c) + esc(c.name) + '</button>').join('') + '</div>';
  const D = DECK[lang];
  m.innerHTML = backLink('#/learn', S.learnTitle) + '<h1 style="margin-bottom:12px">' + esc(S.cats.tarot) + '</h1>'
    + '<div class="tabs" id="ttabs"><button class="on" data-suit="major">' + esc(S.majors) + '</button>' + SUIT_KEYS.map((s) => '<button data-suit="' + s + '">' + esc(S.suitOf[s]) + '</button>').join('') + '</div>'
    + '<div id="tgrid">' + grid(D.filter((c) => c.suit === 'major')) + '</div>';
  bindCardLinks(m);
  $$('#ttabs button').forEach((b) => b.addEventListener('click', () => {
    $$('#ttabs button').forEach((x) => x.classList.toggle('on', x === b));
    $('#tgrid').innerHTML = grid(D.filter((c) => c.suit === b.getAttribute('data-suit'))); bindCardLinks($('#tgrid'));
  }));
}
function astroLine(id) {
  const a = ASTRO[id]; if (!a) return '';
  const sign = a.sign ? ZSIGN[a.sign] : null, planet = a.planet ? ZPLANET[a.planet] : null, el = a.el ? ZELEM[a.el] : null;
  const nm = (o) => o ? (o.g + ' ' + o[lang]) : '';
  if (a.k === 'sign') return nm(sign);
  if (a.k === 'planet') return nm(planet) + (el ? ' · ' + nm(el) : '');
  if (a.k === 'elem') return nm(el) + (a.outer ? ' · ' + nm(ZPLANET[a.outer]) : '');
  if (a.k === 'decan') return nm(planet) + ' ' + (lang === 'vi' ? 'trong' : 'in') + ' ' + nm(sign) + ' · ' + (lang === 'vi' ? a.dvi : a.den) + ' · ' + (lang === 'vi' ? a.tvi : a.ten);
  if (a.k === 'court') return nm(sign) + ' (' + (lang === 'vi' ? 'cuối ' : 'late ') + ZSIGN[a.prev][lang] + ' → ' + sign[lang] + ')';
  if (a.k === 'ace') return nm(el) + (lang === 'vi' ? ' · gốc của chất, không có cung' : ' · root of the suit, no sign');
  if (a.k === 'quad') return nm(el) + (lang === 'vi' ? ' · lá đất của chất, không có cung' : ' · earthy part of the suit, no sign');
  return '';
}
function renderCard(id) {
  const S = T(), m = $('#main'), c = cardById(id);
  if (!c) { location.hash = '#/learn/tarot'; return; }
  const other = cardById(id, lang === 'vi' ? 'en' : 'vi'), I = insightOf(id);
  const kwv = lang === 'vi' ? (KW.vi[id] || null) : null;
  // Some Vietnamese keyword sets carry no negative side (or no positive side).
  const pos = kwv ? (kwv.pos || []) : (I ? I.pos : c.kw), neg = kwv ? (kwv.neg || []) : (I ? I.neg : []);
  const asks = lang === 'vi' ? (ASK.vi[id] || []) : [];
  const groups = {};
  asks.forEach((a) => { (groups[a[0]] = groups[a[0]] || []).push(a); });
  const catName = { love: 'Tình cảm', career: 'Công việc', money: 'Tiền bạc', health: 'Sức khỏe', timing: 'Thời gian', verdict: 'Có / không', other: 'Khác' };
  m.innerHTML = backLink('#/learn/tarot', S.cats.tarot) + '<div class="detail">'
    + '<div class="hero"><span class="face">' + faceSVG(c) + '</span><div><div class="name">' + esc(c.name) + '</div><div class="en">' + esc(other.name) + '</div><div class="meta m-' + c.suit + '"><i>' + esc(c.meta) + '</i></div></div></div>'
    + '<div class="ins"><h3>' + esc(S.onTheCard) + '</h3><p class="scene">' + esc(c.scene) + '</p></div>'
    + '<div class="ins"><h3>' + esc(S.kwPos) + '</h3><div class="kwl">' + pos.map((k) => '<span>' + esc(k) + '</span>').join('') + '</div>'
    + (neg.length ? '<h3>' + esc(S.kwNeg) + '</h3><div class="kwl neg">' + neg.map((k) => '<span>' + esc(k) + '</span>').join('') + '</div>' : '') + '</div>'
    + '<div class="ins"><h3>' + esc(S.upright) + '</h3><p>' + esc(c.up) + '</p>' + (I ? '<p>' + esc(I.now) + '</p>' : '') + '<h3>' + esc(S.reversed) + '</h3><p>' + esc(c.rev) + '</p></div>'
    + (I ? '<div class="ins"><h3>' + esc(S.focus.love) + '</h3><p>' + esc(I.love) + '</p><h3>' + esc(S.focus.work) + '</h3><p>' + esc(I.work) + '</p><h3>' + esc(S.focus.study) + '</h3><p>' + esc(I.study) + '</p><h3>' + esc(S.focus.money) + '</h3><p>' + esc(I.money) + '</p></div>' : '')
    + (asks.length ? '<div class="ins"><h3>' + esc(S.questions) + '</h3>' + Object.keys(groups).map((g) => '<div class="acc"><button><span>' + esc(catName[g] || g) + ' (' + groups[g].length + ')</span></button><div class="in">'
      + groups[g].map((a) => '<div class="qa"><div class="q">' + esc(a[1]) + '</div><p class="a">' + esc(a[2]) + '</p></div>').join('') + '</div></div>').join('') + '</div>' : '')
    + (ASTRO[id] ? '<div class="ins"><h3>' + esc(S.astroOf) + '</h3><p>' + esc(astroLine(id)) + '</p></div>' : '')
    + '<div class="row"><a class="btn primary" href="#/pick">' + esc(S.nav.pick) + '</a><a class="btn" href="#/book?card=' + id + '">' + esc(S.ctaBook) + '</a></div></div>';
  bindAccordions(m);
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
function renderLenList() {
  const S = T(), m = $('#main');
  let grid = '';
  for (let i = 1; i <= 36; i++) { const d = lenCard(i); if (d) grid += '<button data-len="' + i + '">' + lenFace(i) + esc(d.name) + '</button>'; }
  m.innerHTML = backLink('#/learn', S.learnTitle) + '<h1 style="margin-bottom:6px">' + esc(S.cats.lenormand) + '</h1><p class="muted" style="font-size:14px">' + esc(S.lenNote) + '</p><div class="deckgrid">' + grid + '</div>';
  $$('[data-len]', m).forEach((b) => b.addEventListener('click', () => { location.hash = '#/learn/len/' + b.getAttribute('data-len'); }));
}
function renderLen(n) {
  const S = T(), m = $('#main'), d = lenCard(n);
  if (!d) { location.hash = '#/learn/lenormand'; return; }
  const other = lenCard(n, lang === 'vi' ? 'en' : 'vi');
  const sec = (h, t) => t ? '<h3>' + esc(h) + '</h3><p>' + esc(t) + '</p>' : '';
  m.innerHTML = backLink('#/learn/lenormand', S.cats.lenormand) + '<div class="detail">'
    + '<div class="hero"><span class="face">' + lenFace(n) + '</span><div><div class="name">' + n + '. ' + esc(d.name) + '</div><div class="en">' + esc(other.name) + '</div>'
    + '<div class="meta"><span class="chip tag">' + esc(S.lenTone[d.tone]) + '</span> <span class="chip tag">' + esc(S.lenCard) + ': ' + esc(d.card) + '</span></div></div></div>'
    + (d.tnote ? '<p class="faint">' + esc(d.tnote) + '</p>' : '')
    + '<div class="ins"><h3>' + esc(S.onTheCard) + '</h3><p class="scene">' + esc(d.scene) + '</p></div>'
    + '<div class="ins"><h3>' + esc(S.kwPos) + '</h3><div class="kwl">' + (d.kw.pos || []).map((k) => '<span>' + esc(k) + '</span>').join('') + '</div>'
    + ((d.kw.neg || []).length ? '<h3>' + esc(S.kwNeg) + '</h3><div class="kwl neg">' + d.kw.neg.map((k) => '<span>' + esc(k) + '</span>').join('') + '</div>' : '') + '</div>'
    + '<div class="ins">' + sec(S.lenCore, d.core) + sec(S.lenLove, d.love) + sec(S.lenWork, d.work) + sec(S.lenWho, d.who) + sec(S.lenTime, d.time) + '</div>'
    + ((d.combo || []).length ? '<div class="ins"><h3>' + esc(S.lenCombo) + '</h3>' + d.combo.map((c) => '<div class="qa"><div class="q">' + esc(c[0]) + '</div><p class="a">' + esc(c[1]) + '</p></div>').join('') + '</div>' : '')
    + '</div>';
}

/* ---- astrology ---- */
function renderAstro() {
  const S = T(), m = $('#main'), me = mySign();
  m.innerHTML = backLink('#/learn', S.learnTitle) + '<h1 style="margin-bottom:6px">' + esc(S.cats.astro) + '</h1><p class="muted" style="font-size:14px">' + esc(S.astroNote) + '</p>'
    + '<div class="tabs" id="atabs"><button class="on" data-t="signs">' + (lang === 'vi' ? '12 cung' : '12 signs') + '</button><button data-t="planets">' + (lang === 'vi' ? 'Hành tinh' : 'Planets') + '</button><button data-t="houses">' + (lang === 'vi' ? '12 nhà' : '12 houses') + '</button><button data-t="aspects">' + (lang === 'vi' ? 'Góc chiếu' : 'Aspects') + '</button><button data-t="guides">' + (lang === 'vi' ? 'Bài đọc' : 'Guides') + '</button></div>'
    + '<div id="apanel"></div>';
  const panel = $('#apanel');
  const show = (t) => {
    if (t === 'signs') {
      panel.innerHTML = '<div class="signlist">' + ZKEYS.map((k, i) => { const z = ZSIGN[k]; return '<button data-sign="' + k + '" class="' + (i === me ? 'me' : '') + '"><span class="g">' + z.g + '</span><b>' + esc(z[lang]) + '</b><span>' + esc(lang === 'vi' ? z.dvi : z.den) + '</span></button>'; }).join('') + '</div>';
      $$('[data-sign]', panel).forEach((b) => b.addEventListener('click', () => { location.hash = '#/learn/sign/' + b.getAttribute('data-sign'); }));
    } else if (t === 'planets') {
      panel.innerHTML = PLANETS.map((p) => '<div class="acc"><button><span>' + p.g + ' ' + esc(p.name[lang]) + ' <span class="faint">· ' + esc(lang === 'vi' ? 'chủ cung ' : 'rules ') + esc(ZSIGN[p.rules][lang]) + '</span></span></button><div class="in"><p>' + esc(p[lang]) + '</p></div></div>').join('');
      bindAccordions(panel);
    } else if (t === 'houses') {
      panel.innerHTML = HOUSES.map((h) => '<div class="acc"><button><span>' + h.n + '. ' + esc(h[lang][0]) + '</span></button><div class="in"><p>' + esc(h[lang][1]) + '</p></div></div>').join('');
      bindAccordions(panel);
    } else if (t === 'aspects') {
      panel.innerHTML = '<table class="tbl">' + ASPECTS.map((a) => '<tr><td>' + a.g + ' ' + esc(a.name[lang]) + '<br><span class="faint">' + a.deg + '</span></td><td>' + esc(a[lang]) + '</td></tr>').join('') + '</table>';
    } else {
      panel.innerHTML = GUIDES.filter((g) => g.cat === 'astro').map((g) => guideRow(g)).join('');
    }
  };
  show('signs');
  $$('#atabs button').forEach((b) => b.addEventListener('click', () => { $$('#atabs button').forEach((x) => x.classList.toggle('on', x === b)); show(b.getAttribute('data-t')); }));
}
function renderSign(key) {
  const S = T(), m = $('#main'), z = ZSIGN[key];
  if (!z) { location.hash = '#/learn/astro'; return; }
  const zp = ZODIAC[key][lang], ruler = ZPLANET[ZRULER[key]];
  const cards = Object.keys(ASTRO).filter((id) => ASTRO[id].sign === key);
  m.innerHTML = backLink('#/learn/astro', S.cats.astro) + '<div class="detail">'
    + '<div class="hero" style="grid-template-columns:72px 1fr"><div class="glyph" style="width:72px;height:72px;border-radius:50%;background:var(--surface);display:flex;align-items:center;justify-content:center;font-size:40px;color:var(--primary)">' + z.g + '</div>'
    + '<div><div class="name">' + esc(z[lang]) + '</div><div class="en">' + esc(lang === 'vi' ? z.en : z.vi) + '</div><div class="meta"><i>' + esc(lang === 'vi' ? z.dvi : z.den) + '</i></div></div></div>'
    + '<div class="row" style="margin-bottom:12px"><span class="chip tag">' + esc(S.element) + ': ' + ZELEM[z.el].g + ' ' + esc(ZELEM[z.el][lang]) + '</span><span class="chip tag">' + esc(S.mode) + ': ' + esc(ZMODE[z.mod][lang]) + '</span><span class="chip tag">' + esc(S.ruler) + ': ' + ruler.g + ' ' + esc(ruler[lang]) + '</span></div>'
    + '<div class="kwl">' + zp.kw.map((k) => '<span>' + esc(k) + '</span>').join('') + '</div>'
    + '<div class="ins"><h3>' + esc(S.signAbout) + '</h3><p>' + esc(zp.about) + '</p><h3>' + esc(S.signLove) + '</h3><p>' + esc(zp.love) + '</p><h3>' + esc(S.signWork) + '</h3><p>' + esc(zp.work) + '</p><h3>' + esc(S.signTip) + '</h3><p>' + esc(zp.tip) + '</p></div>'
    + '<div class="ins"><h3>' + esc(S.signCards) + '</h3><div class="mini">' + cards.map((id) => miniHTML(id, true)).join('') + '</div><p class="faint">' + cards.map((id) => cardById(id).name + ': ' + astroLine(id)).map(esc).join('<br>') + '</p></div></div>';
  bindCardLinks(m);
}

/* ---- spreads ---- */
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
function renderSpreads() {
  const S = T(), m = $('#main'), list = SPREADS[lang];
  const row = (s) => '<a class="acc" href="#/learn/spread/' + s.id + '" style="display:block;text-decoration:none;color:inherit"><button style="pointer-events:none"><span>' + esc(s.name) + ' <span class="faint">· ' + s.n + (lang === 'vi' ? ' lá' : ' cards') + '</span></span></button></a>';
  m.innerHTML = backLink('#/learn', S.learnTitle) + '<h1 style="margin-bottom:12px">' + esc(S.cats.spreads) + '</h1>'
    + '<div class="eyebrow">Tarot</div>' + list.filter((s) => s.sys === 'tarot').map(row).join('')
    + '<div class="eyebrow" style="margin-top:16px">Lenormand</div>' + list.filter((s) => s.sys === 'len').map(row).join('');
}
function renderSpread(id) {
  const S = T(), m = $('#main'), s = SPREADS[lang].filter((x) => x.id === id)[0];
  if (!s) { location.hash = '#/learn/spreads'; return; }
  const sec = (h, t) => t ? '<h3>' + esc(h) + '</h3><p>' + esc(t).replace(/\*([^*]+)\*/g, '<i>$1</i>') + '</p>' : '';
  m.innerHTML = backLink('#/learn/spreads', S.cats.spreads) + '<div class="guide"><h1>' + esc(s.name) + '</h1><p class="faint">' + s.n + (lang === 'vi' ? ' lá' : ' cards') + '</p>'
    + '<div class="spread-d">' + (s.n <= 12 ? spreadArt(s.lay) : '') + '</div>'
    + '<div class="ins">' + sec(S.spreadWhen, s.when) + sec(S.spreadAsk, s.ask) + '</div>'
    + '<div class="ins"><h3>' + esc(S.spreadPos) + '</h3>' + s.pos.map((p, i) => '<div class="qa"><div class="q">' + (i + 1) + '. ' + esc(p[0]) + '</div><p class="a">' + esc(p[1]) + '</p></div>').join('') + '</div>'
    + '<div class="ins">' + sec(S.spreadRead, s.read) + sec(S.spreadNote, s.note) + '</div>'
    + (s.id.indexOf('nabu-') === 0 ? '<a class="btn primary block" href="#/book">' + esc(S.ctaBook) + '</a>' : '') + '</div>';
}

/* ---- guides ---- */
function guideRow(g) {
  return '<a class="acc" href="#/learn/guide/' + g.id + '" style="display:block;text-decoration:none;color:inherit"><button style="pointer-events:none"><span>' + esc(L(g.title)) + '<br>' + badgeHTML(g.badge) + '</span></button></a>';
}
function renderGuideList(cat) {
  const S = T(), m = $('#main');
  m.innerHTML = backLink('#/learn', S.learnTitle) + '<h1 style="margin-bottom:12px">' + esc(S.cats[cat]) + '</h1>' + GUIDES.filter((g) => g.cat === cat).map(guideRow).join('')
    + (cat === 'fortune' ? '<a class="btn block" href="#/learn/numbers" style="margin-top:10px">' + esc(S.numerology) + '</a>' : '');
}
function renderGuide(id) {
  const S = T(), m = $('#main'), g = GUIDES.filter((x) => x.id === id)[0];
  if (!g) { location.hash = '#/learn'; return; }
  const back = g.cat === 'tarot' ? '#/learn/tarot' : g.cat === 'lenormand' ? '#/learn/lenormand' : g.cat === 'astro' ? '#/learn/astro' : '#/learn/' + g.cat;
  m.innerHTML = backLink(back, S.cats[g.cat]) + '<div class="guide">' + badgeHTML(g.badge) + '<h1 style="margin:8px 0">' + esc(L(g.title)) + '</h1><p class="lead">' + esc(L(g.intro)) + '</p>'
    + g.sections.map((s) => '<h2>' + esc(L(s.h)) + '</h2><p>' + esc(L(s.p)) + '</p>').join('') + '</div>';
}

/* ---- numbers ---- */
function renderNumbers() {
  const S = T(), m = $('#main'), b = birthParts();
  if (!b) { m.innerHTML = backLink('#/learn/fortune', S.cats.fortune) + '<h1>' + esc(S.numerology) + '</h1><p class="muted">' + esc(S.enterBirthday) + '</p><a class="btn primary" href="#/me">' + esc(S.setupBtn) + '</a>'; return; }
  const lp = lifePath(b.y, b.m, b.d), si = mySign(), key = ZKEYS[si];
  m.innerHTML = backLink('#/learn/fortune', S.cats.fortune) + '<h1 style="margin-bottom:12px">' + esc(S.numerology) + '</h1>'
    + '<div class="ins"><h3>' + esc(S.lifePathOf(lp)) + '</h3><p>' + esc(LIFEPATH[lp][lang]) + '</p><p class="faint">' + b.d + '/' + b.m + '/' + b.y + '</p></div>'
    + '<div class="ins"><h3>' + esc(S.yourSign) + '</h3><p>' + ZSIGN[key].g + ' ' + esc(S.zodiac[si]) + ' · ' + esc(ZODIAC[key][lang].kw.join(', ')) + '</p><a href="#/learn/sign/' + key + '">' + esc(S.readSign) + ' →</a></div>'
    + '<div class="ins"><h3>' + esc(S.animal) + '</h3><p>' + esc(animalOf(b.y)[lang]) + ' · ' + esc(canChi(b.y)) + '</p><p class="faint">' + esc(S.animalNote) + '</p></div>'
    + GUIDES.filter((g) => g.id === 'fort-numerology' || g.id === 'fort-animals').map(guideRow).join('');
}
ROUTES.learn = { nav: 'learn', render: renderLearn };
