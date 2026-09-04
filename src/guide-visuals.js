/* ============================ visuals for guides and astrology ============================
   Every guide gets a picture or a small interactive block at the top, and the
   astrology tab gets wheels instead of lists. All drawn from the app's own data. */
const GUIDE_VISUAL = { 'tarot-start': 'steps', 'tarot-reversed': 'reversed', 'tarot-court': 'court', 'tarot-overview': 'journey', 'len-vs-tarot': 'lenvstarot', 'len-pairs': 'pairs',
  'astro-big3': 'big3', 'astro-elements': 'elements', 'astro-moon': 'moonphases', 'astro-retro': 'retro',
  'mani-what': 'steps', 'mani-script': 'script', 'mani-369': 'tracker369', 'mani-gratitude': 'gratitude', 'mani-limits': 'checklist',
  'fort-numerology': 'numwheel', 'fort-palm': 'hand', 'fort-playing': 'pcmap', 'fort-animals': 'animals', 'fort-tea': 'cup', 'fort-oracle': 'oracle' };
const EL_COLOR = { fire: '#E07A5F', earth: '#6A994E', air: '#7FB3E6', water: '#5B7DB1' };

function zodiacRingSVG(active, highlight) {
  let s = '<svg viewBox="0 0 240 240" class="zring">';
  s += '<circle cx="120" cy="120" r="100" fill="none" stroke="var(--rule)" stroke-width="1.5"/><circle cx="120" cy="120" r="66" fill="none" stroke="var(--rule-soft)" stroke-dasharray="3 5"/>';
  ZKEYS.forEach((k, i) => {
    const a = i / 12 * Math.PI * 2 - Math.PI / 2, x = 120 + 100 * Math.cos(a), y = 120 + 100 * Math.sin(a), z = ZSIGN[k];
    const on = k === active, hi = highlight && highlight.indexOf(k) > -1;
    s += '<g data-zsign="' + k + '" style="cursor:pointer"><circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (on ? 19 : 15) + '" fill="' + (on || hi ? EL_COLOR[z.el] : 'var(--surface)') + '" stroke="' + EL_COLOR[z.el] + '" stroke-width="2"/>'
      + '<text x="' + x.toFixed(1) + '" y="' + (y + 6).toFixed(1) + '" text-anchor="middle" font-size="' + (on ? 18 : 15) + '" fill="' + (on || hi ? '#fff' : 'var(--fg)') + '">' + z.g + '</text></g>';
  });
  return s + '</svg>';
}
function houseWheelSVG(active) {
  let s = '<svg viewBox="0 0 240 240" class="zring">';
  for (let h = 1; h <= 12; h++) {
    const a0 = Math.PI - (h - 1) / 12 * Math.PI * 2, a1 = a0 - Math.PI / 6; // houses run counter-clockwise from the left (the Ascendant)
    const x0 = 120 + 100 * Math.cos(a0), y0 = 120 + 100 * Math.sin(a0), x1 = 120 + 100 * Math.cos(a1), y1 = 120 + 100 * Math.sin(a1);
    const am = (a0 + a1) / 2, tx = 120 + 72 * Math.cos(am), ty = 120 + 72 * Math.sin(am);
    s += '<path d="M120 120 L' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' A100 100 0 0 0 ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' Z" fill="' + (h === active ? 'var(--primary)' : (h % 2 ? 'var(--surface-2)' : 'var(--surface)')) + '" stroke="var(--rule)" data-house="' + h + '" style="cursor:pointer"/>'
      + '<text x="' + tx.toFixed(1) + '" y="' + (ty + 5).toFixed(1) + '" text-anchor="middle" font-size="13" font-weight="700" fill="' + (h === active ? 'var(--primary-ink)' : 'var(--fg)') + '" pointer-events="none">' + h + '</text>';
  }
  return s + '<circle cx="120" cy="120" r="34" fill="var(--surface)" stroke="var(--rule)"/><text x="120" y="116" text-anchor="middle" font-size="9" fill="var(--fg-faint)">AC</text><text x="120" y="128" text-anchor="middle" font-size="9" fill="var(--fg-faint)">←</text></svg>';
}
function aspectSVG(deg) {
  const a = -Math.PI / 2, b = a + deg * Math.PI / 180, x0 = 40 + 30 * Math.cos(a), y0 = 40 + 30 * Math.sin(a), x1 = 40 + 30 * Math.cos(b), y1 = 40 + 30 * Math.sin(b);
  return '<svg viewBox="0 0 80 80" class="asp"><circle cx="40" cy="40" r="30" fill="none" stroke="var(--rule)"/><line x1="' + x0.toFixed(1) + '" y1="' + y0.toFixed(1) + '" x2="' + x1.toFixed(1) + '" y2="' + y1.toFixed(1) + '" stroke="var(--primary)" stroke-width="2.5"/><circle cx="' + x0.toFixed(1) + '" cy="' + y0.toFixed(1) + '" r="5" fill="var(--primary)"/><circle cx="' + x1.toFixed(1) + '" cy="' + y1.toFixed(1) + '" r="5" fill="' + (deg ? 'var(--pink)' : 'var(--primary)') + '"/></svg>';
}
function planetOrbitSVG(activeId) {
  const order = ['sun', 'mer', 'ven', 'moo', 'mar', 'jup', 'sat', 'ura', 'nep', 'plu'];
  let s = '<svg viewBox="0 0 320 90" class="orbit">';
  order.forEach((id, i) => { const p = PLANETS.filter((x) => x.id === id)[0], x = 22 + i * 31, on = id === activeId; s += '<circle cx="' + x + '" cy="45" r="' + (on ? 16 : 12) + '" fill="' + (on ? 'var(--primary)' : 'var(--surface-2)') + '" stroke="var(--rule)"/><text x="' + x + '" y="50" text-anchor="middle" font-size="' + (on ? 16 : 13) + '" fill="' + (on ? 'var(--primary-ink)' : 'var(--fg)') + '">' + p.g + '</text><text x="' + x + '" y="78" text-anchor="middle" font-size="7.5" fill="var(--fg-faint)">' + esc(p.name[lang].replace('Sao ', '')) + '</text>'; });
  return s + '</svg>';
}

function guideVisualHTML(id) {
  const S = T(), v = GUIDE_VISUAL[id];
  if (!v) return '';
  if (v === 'journey') return journeyHTML();
  if (v === 'court') return courtHTML();
  if (v === 'pairs') return pairsHTML();
  if (v === 'numwheel') return '<div class="nwheel">' + [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => '<a class="nw" href="#/learn/fortune/numbers"><span class="ic">' + NUM_ICON[n] + '</span><b>' + n + '</b><span>' + esc(NUM_KW[lang][n]) + '</span></a>').join('') + '</div>';
  if (v === 'hand') return '<div class="palmwrap"><a href="#/learn/fortune/palm">' + handSVG('heart') + '</a></div>';
  if (v === 'cup') return '<div class="teawrap"><a href="#/learn/fortune/tea">' + cupSVG('rim') + '</a></div>';
  if (v === 'animals') return '<div class="awrapper"><a href="#/learn/fortune/animals">' + animalsWheelSVG(-1) + '</a></div>';
  if (v === 'pcmap') return '<div class="pcmap">' + PC_SUITS.map((s) => '<a class="pcs" href="#/learn/fortune/cards"><span class="pip ' + (s[0] === 'h' || s[0] === 'd' ? 'red' : '') + '">' + s[1] + '</span><span>=</span><svg viewBox="-20 -22 40 44"><g stroke="var(--card-ink)" stroke-linejoin="round" stroke-linecap="round" fill="none">' + emblem(s[2], 0, 0, 1) + '</g></svg><b>' + esc(LEX[lang].suitNames[s[2]]) + '</b></a>').join('') + '</div>';
  if (v === 'steps') { const g = GUIDES.filter((x) => x.id === id)[0]; return '<div class="stepsv">' + g.sections.map((s, i) => '<div class="stp"><span class="n">' + (i + 1) + '</span><b>' + esc(L(s.h)) + '</b></div>').join('<span class="arr">→</span>') + '</div>'; }
  if (v === 'reversed') { const c = cardById('major-19'); return '<div class="cmp"><div><span class="face" style="width:110px">' + faceSVG(c) + '</span><b>' + esc(S.upright) + '</b></div><div><span class="face flipped" style="width:110px">' + faceSVG(c) + '</span><b>' + esc(S.reversed) + '</b></div></div>'; }
  if (v === 'lenvstarot') { return '<div class="cmp"><div><span class="face" style="width:110px">' + faceSVG(cardById('major-17')) + '</span><b>Tarot</b><span>' + esc(lang === 'vi' ? 'một cảnh, nhiều tầng' : 'a scene, many layers') + '</span></div><div><span class="face" style="width:110px">' + lenFace(16) + '</span><b>Lenormand</b><span>' + esc(lang === 'vi' ? 'một vật, một từ' : 'one thing, one word') + '</span></div></div>'; }
  if (v === 'big3') { const si = mySign(), k = si > -1 ? ZKEYS[si] : null; const disc = (lbl, g, sub) => '<div class="disc"><span class="g">' + g + '</span><b>' + esc(lbl) + '</b><span>' + esc(sub) + '</span></div>'; return '<div class="big3">' + disc(lang === 'vi' ? 'Mặt Trời' : 'Sun', k ? ZSIGN[k].g : '☉', k ? ZSIGN[k][lang] : (lang === 'vi' ? 'nhập ngày sinh' : 'add your birthday')) + disc(lang === 'vi' ? 'Mặt Trăng' : 'Moon', '☽', lang === 'vi' ? 'cần giờ sinh' : 'needs birth time') + disc(lang === 'vi' ? 'Mọc' : 'Rising', '↑', lang === 'vi' ? 'cần giờ + nơi sinh' : 'needs time + place') + '</div>'; }
  if (v === 'elements') return '<div class="elgrid">' + ['fire', 'earth', 'air', 'water'].map((el) => '<div class="elc" style="border-color:' + EL_COLOR[el] + '"><b style="color:' + EL_COLOR[el] + '">' + ZELEM[el].g + ' ' + esc(ZELEM[el][lang]) + '</b>' + ZKEYS.filter((k) => ZSIGN[k].el === el).map((k) => '<a href="#/learn/sign/' + k + '">' + ZSIGN[k].g + ' ' + esc(ZSIGN[k][lang]) + '</a>').join('') + '</div>').join('') + '</div>';
  if (v === 'moonphases') { const idx = moonPhase(new Date()).idx; return '<div class="phases">' + MOON_ICONS.map((ic, i) => '<div class="ph' + (i === idx ? ' on' : '') + '"><span class="ic">' + ic + '</span><span>' + esc(MOON_NAMES[lang][i]) + '</span></div>').join('') + '</div><p class="faint" style="text-align:center">' + esc(lang === 'vi' ? 'Hôm nay: ' : 'Today: ') + MOON_NAMES[lang][idx] + '</p>'; }
  if (v === 'retro') return '<svg viewBox="0 0 320 120" class="orbit"><circle cx="60" cy="60" r="22" fill="#F6C453"/><text x="60" y="66" text-anchor="middle" font-size="16">☉</text><ellipse cx="60" cy="60" rx="110" ry="40" fill="none" stroke="var(--rule)" stroke-dasharray="4 4"/><path d="M150 40 C 175 30, 190 55, 170 62 C 150 70, 160 90, 185 82" fill="none" stroke="var(--primary)" stroke-width="3" stroke-linecap="round"/><text x="230" y="60" font-size="13" fill="var(--fg)">☿ ' + esc(lang === 'vi' ? 'nhìn từ Trái Đất' : 'seen from Earth') + '</text><text x="230" y="78" font-size="10" fill="var(--fg-faint)">' + esc(lang === 'vi' ? 'có vẻ đi lùi' : 'appears to go backwards') + '</text></svg>';
  if (v === 'script') return '<div class="script"><div class="paper"><b>' + esc(lang === 'vi' ? 'Hôm nay, ___ / ___' : 'Today, ___ / ___') + '</b><p>' + esc(lang === 'vi' ? 'Mình vừa ______________________.' : 'I just ______________________.') + '</p><p>' + esc(lang === 'vi' ? 'Mình thấy __________ và nghe __________.' : 'I saw __________ and heard __________.') + '</p><p>' + esc(lang === 'vi' ? 'Cảm giác lúc đó là __________.' : 'It felt __________.') + '</p><p>' + esc(lang === 'vi' ? 'Cảm ơn vì điều này. ♡' : 'Thank you for this. ♡') + '</p></div></div>';
  if (v === 'tracker369') { const t = store.get('nabu-369', { d: '', a: 0, b: 0, c: 0 }), today = isoDate(new Date()); if (t.d !== today) { t.d = today; t.a = t.b = t.c = 0; } return '<div class="t369">' + [['a', 3, lang === 'vi' ? 'Sáng' : 'Morning'], ['b', 6, lang === 'vi' ? 'Chiều' : 'Afternoon'], ['c', 9, lang === 'vi' ? 'Tối' : 'Night']].map((x) => '<button class="t3" data-t369="' + x[0] + '" data-max="' + x[1] + '"><b>' + x[2] + '</b><span class="cnt">' + t[x[0]] + ' / ' + x[1] + '</span><span class="dots">' + '●'.repeat(t[x[0]]) + '○'.repeat(x[1] - t[x[0]]) + '</span></button>').join('') + '</div><p class="faint" style="text-align:center">' + esc(lang === 'vi' ? 'Mỗi lần viết xong một câu, chạm một lần. Tự về 0 mỗi ngày.' : 'Tap once for each line you write. Resets every day.') + '</p>'; }
  if (v === 'gratitude') { const g = store.get('nabu-gratitude', ['', '', '']); return '<div class="grat"><b>' + esc(lang === 'vi' ? 'Ba điều biết ơn hôm nay' : 'Three things I am grateful for today') + '</b>' + [0, 1, 2].map((i) => '<input data-grat="' + i + '" value="' + esc(g[i] || '') + '" placeholder="' + (i + 1) + '. ' + esc(lang === 'vi' ? 'cụ thể nhé…' : 'be specific…') + '">').join('') + '<p class="faint">' + esc(lang === 'vi' ? 'Lưu trên máy này.' : 'Saved on this device.') + '</p></div>'; }
  if (v === 'checklist') { const g = GUIDES.filter((x) => x.id === id)[0]; return '<div class="chk2">' + g.sections.slice(0, 2).map((s, i) => '<div class="col ' + (i ? 'good' : 'bad') + '"><b>' + (i ? '✓ ' : '✗ ') + esc(L(s.h)) + '</b>' + L(s.p).split(/\.\s+/).filter(Boolean).slice(0, 4).map((line) => '<label><input type="checkbox"> ' + esc(line.replace(/\.$/, '')) + '</label>').join('') + '</div>').join('') + '</div>'; }
  if (v === 'oracle') return '<div class="cmp"><div><span class="face" style="width:110px">' + BACK + '</span><b>Tarot · 78</b><span>' + esc(lang === 'vi' ? 'cấu trúc chung' : 'shared structure') + '</span></div><div><span class="face" style="width:110px">' + logoCardSVG('pink') + '</span><b>Oracle</b><span>' + esc(lang === 'vi' ? 'tự do, một lá' : 'free-form, one card') + '</span></div></div>';
  return '';
}
function bindGuideVisual(root) {
  bindCardLinks(root);
  $$('[data-t369]', root).forEach((b) => b.addEventListener('click', () => { const t = store.get('nabu-369', { d: isoDate(new Date()), a: 0, b: 0, c: 0 }), k = b.getAttribute('data-t369'), mx = Number(b.getAttribute('data-max')); t[k] = (t[k] + 1) % (mx + 1); t.d = isoDate(new Date()); store.set('nabu-369', t); $('.cnt', b).textContent = t[k] + ' / ' + mx; $('.dots', b).textContent = '●'.repeat(t[k]) + '○'.repeat(mx - t[k]); }));
  $$('[data-grat]', root).forEach((inp) => inp.addEventListener('input', () => { store.set('nabu-gratitude', $$('[data-grat]', root).map((x) => x.value)); }));
  $$('[data-len]', root).forEach((b) => b.addEventListener('click', () => { location.hash = '#/learn/len/' + b.getAttribute('data-len'); }));
}
