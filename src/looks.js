/* ============================ looks ============================
   Four things in the app can be dressed differently: the back of the cards you
   draw, the message tree, the coin, and the paper the diary is written on.
   Each one has a free look plus three that come with Nabu Tarot Plus.

   A locked look is never hidden. It is drawn in full, at half brightness with
   a padlock over it, so the reason to buy is the thing itself rather than a
   description of it. Choosing one you do not own bounces to the unlock screen
   and leaves your current look alone. */

const LOOK_KINDS = ['cardback', 'tree', 'coin', 'diary'];
const proOn = () => ACCESS.has('pro');

/* What the visitor has chosen, and a fallback to the free look whenever the
   chosen one is not theirs any more (an expired code, a shared device). */
const LOOKS = {
  all() { return store.get('nabu-looks', {}) || {}; },
  get(kind) {
    const id = this.all()[kind];
    const set = LOOK_SETS[kind];
    if (!set) return '';
    const found = set.filter((x) => x.id === id)[0];
    if (!found) return set[0].id;
    return (found.pro && !proOn()) ? set[0].id : found.id;
  },
  set(kind, id) { const a = this.all(); a[kind] = id; store.set('nabu-looks', a); },
  of(kind) { const set = LOOK_SETS[kind] || []; const id = this.get(kind); return set.filter((x) => x.id === id)[0] || set[0]; }
};

/* ---- the backs of the drawn cards ----
   Each returns the inside of a 100x172 card; the frame is drawn around it. */
const CARD_BACKS = {
  moon(g) {
    return '<path d="M56 60 A26 26 0 1 0 56 112 A21 21 0 1 1 56 60 Z" fill="' + g + '"/>'
      + [[26, 32], [74, 32], [26, 140], [74, 140]].map((p) => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.4" fill="' + g + '"/>').join('');
  },
  stars(g) {
    // A night sky: one bright star, a scatter of small ones, and a soft arc.
    const star = (x, y, r) => '<path d="M' + x + ' ' + (y - r) + ' L' + (x + r * 0.28) + ' ' + (y - r * 0.28) + ' L' + (x + r) + ' ' + y + ' L' + (x + r * 0.28) + ' ' + (y + r * 0.28) + ' L' + x + ' ' + (y + r) + ' L' + (x - r * 0.28) + ' ' + (y + r * 0.28) + ' L' + (x - r) + ' ' + y + ' L' + (x - r * 0.28) + ' ' + (y - r * 0.28) + ' Z" fill="' + g + '"/>';
    let s = star(50, 74, 20) + star(30, 118, 8) + star(72, 126, 6) + star(66, 44, 5);
    [[22, 52], [78, 60], [38, 146], [62, 152], [50, 34], [84, 96], [18, 92]].forEach((p) => { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="1.7" fill="' + g + '" opacity=".85"/>'; });
    s += '<path d="M14 130 C 34 112, 66 112, 86 130" fill="none" stroke="' + g + '" stroke-width="1.2" opacity=".55"/>';
    return s;
  },
  bloom(g) {
    // A damask flower, mirrored, the way an old card back is printed.
    const petal = (a) => '<ellipse cx="50" cy="60" rx="7.5" ry="17" fill="' + g + '" opacity=".9" transform="rotate(' + a + ' 50 86)"/>';
    let s = '';
    for (let a = 0; a < 360; a += 45) s += petal(a);
    s += '<circle cx="50" cy="86" r="7" fill="' + g + '"/>';
    s += '<circle cx="50" cy="86" r="30" fill="none" stroke="' + g + '" stroke-width="1" opacity=".5"/>';
    [[50, 24], [50, 148], [22, 86], [78, 86]].forEach((p) => { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.6" fill="' + g + '"/>'; });
    return s;
  },
  eye(g) {
    // An eye between two crescents: the old fortune-teller's card back.
    return '<path d="M22 86 C 34 66, 66 66, 78 86 C 66 106, 34 106, 22 86 Z" fill="none" stroke="' + g + '" stroke-width="2"/>'
      + '<circle cx="50" cy="86" r="9" fill="' + g + '"/><circle cx="50" cy="86" r="3.4" fill="#2A1D4E"/>'
      + '<path d="M50 34 A12 12 0 1 0 50 58 A9 9 0 1 1 50 34 Z" fill="' + g + '"/>'
      + '<path d="M50 138 A12 12 0 1 0 50 114 A9 9 0 1 1 50 138 Z" fill="' + g + '"/>'
      + [[26, 74], [74, 74], [26, 98], [74, 98]].map((p) => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2" fill="' + g + '" opacity=".8"/>').join('');
  }
};

const LOOK_SETS = {
  cardback: [
    { id: 'moon', pro: false, name: { vi: 'Trăng vàng', en: 'Gold crescent' }, card: ['#3D2A6E', '#4A3480'], gold: '#E5BE5E' },
    { id: 'stars', pro: true, name: { vi: 'Trời sao', en: 'Night sky' }, card: ['#1E2A57', '#2C3C74'], gold: '#FFE9A8' },
    { id: 'bloom', pro: true, name: { vi: 'Hoa gấm', en: 'Damask bloom' }, card: ['#5B2340', '#7A3055'], gold: '#F6BBCB' },
    { id: 'eye', pro: true, name: { vi: 'Mắt huyền', en: 'The seeing eye' }, card: ['#173F3A', '#215750'], gold: '#9FE3C9' }
  ],
  tree: [
    { id: 'sakura', pro: false, name: { vi: 'Anh đào', en: 'Cherry blossom' } },
    { id: 'night', pro: true, name: { vi: 'Đêm đom đóm', en: 'Firefly night' } },
    { id: 'galaxy', pro: true, name: { vi: 'Cây ngân hà', en: 'Galaxy tree' } },
    { id: 'butterfly', pro: true, name: { vi: 'Vườn bướm', en: 'Butterfly garden' } }
  ],
  coin: [
    { id: 'gold', pro: false, name: { vi: 'Vàng', en: 'Gold' }, face: '#E5BE5E', rim: '#B9913B', ink: '#5A3F18' },
    { id: 'moonsilver', pro: true, name: { vi: 'Bạc trăng', en: 'Moon silver' }, face: '#DCE3EF', rim: '#94A3BE', ink: '#2C3A52' },
    { id: 'rose', pro: true, name: { vi: 'Vàng hồng', en: 'Rose gold' }, face: '#F0C4C2', rim: '#C98A85', ink: '#63302C' },
    { id: 'obsidian', pro: true, name: { vi: 'Hắc Ngọc', en: 'Obsidian' }, face: '#2A2340', rim: '#E5BE5E', ink: '#F3E4B8' }
  ],
  diary: [
    { id: 'plain', pro: false, name: { vi: 'Giấy trơn', en: 'Plain paper' } },
    { id: 'ruled', pro: true, name: { vi: 'Giấy kẻ cũ', en: 'Old ruled paper' } },
    { id: 'floral', pro: true, name: { vi: 'Viền hoa', en: 'Floral border' } },
    { id: 'starry', pro: true, name: { vi: 'Đêm sao', en: 'Starry night' } }
  ]
};

/* ---- the card back, drawn in whichever look is chosen ---- */
function backSVGFor(look) {
  const b = look || LOOKS.of('cardback');
  const draw = CARD_BACKS[b.id] || CARD_BACKS.moon;
  return '<svg viewBox="0 0 100 172" aria-hidden="true">'
    + '<rect x="1.3" y="1.3" width="97.4" height="169.4" rx="8" fill="' + b.card[0] + '" stroke="#2A1D4E" stroke-width="2.6"/>'
    + '<rect x="9" y="9" width="82" height="154" rx="5" fill="' + b.card[1] + '" stroke="' + b.gold + '" stroke-width="1.4"/>'
    + draw(b.gold) + '</svg>';
}

/* ---- the four coins ----
   Each returns everything behind the word: the blank, the rim and whatever is
   struck into it. The band from y 56 to y 104 is left clear, because that is
   where the answer goes. */
const COIN_ART = {
  gold(m) {
    const band = (y) => '<path d="M80 ' + (y - 5) + ' l4.5 5 -4.5 5 -4.5 -5 Z"/>'
      + '<rect x="56" y="' + (y - 0.9) + '" width="16" height="1.8" rx=".9"/>'
      + '<rect x="88" y="' + (y - 0.9) + '" width="16" height="1.8" rx=".9"/>';
    return '<circle cx="80" cy="80" r="74" fill="' + m.face + '" stroke="' + m.rim + '" stroke-width="5"/>'
      + '<circle cx="80" cy="80" r="60" fill="none" stroke="' + m.rim + '" stroke-width="2"/>'
      + '<g fill="' + m.ink + '" opacity=".6">' + band(44) + band(116) + '</g>';
  },
  /* A milled edge, a crescent and a sky of small stars. */
  moonsilver(m) {
    let mill = '';
    for (let i = 0; i < 48; i++) mill += '<rect x="79.2" y="4" width="1.6" height="8" rx=".8" fill="' + m.rim + '" transform="rotate(' + (i * 7.5) + ' 80 80)"/>';
    const star = (x, y, r) => '<path d="M' + x + ' ' + (y - r) + ' L' + (x + r * 0.3) + ' ' + (y - r * 0.3) + ' L' + (x + r) + ' ' + y + ' L' + (x + r * 0.3) + ' ' + (y + r * 0.3) + ' L' + x + ' ' + (y + r) + ' L' + (x - r * 0.3) + ' ' + (y + r * 0.3) + ' L' + (x - r) + ' ' + y + ' L' + (x - r * 0.3) + ' ' + (y - r * 0.3) + ' Z" fill="' + m.ink + '" opacity=".75"/>';
    return '<circle cx="80" cy="80" r="76" fill="' + m.rim + '"/>' + mill
      + '<circle cx="80" cy="80" r="68" fill="' + m.face + '"/>'
      + '<circle cx="80" cy="80" r="61" fill="none" stroke="' + m.rim + '" stroke-width="1.4" stroke-dasharray="2 5"/>'
      + '<g fill="' + m.ink + '" opacity=".85"><path fill-rule="evenodd" d="M80 40 m-13 0 a13 13 0 1 0 26 0 a13 13 0 1 0 -26 0 M82.5 40 m-10.5 0 a10.5 10.5 0 1 0 21 0 a10.5 10.5 0 1 0 -21 0"/></g>'
      + star(52, 50, 4.5) + star(110, 52, 4) + star(40, 96, 3.4) + star(120, 92, 3.8) + star(80, 122, 5)
      + '<g fill="' + m.ink + '" opacity=".45"><circle cx="62" cy="36" r="1.6"/><circle cx="100" cy="34" r="1.4"/><circle cx="34" cy="76" r="1.6"/><circle cx="126" cy="74" r="1.4"/><circle cx="60" cy="126" r="1.4"/><circle cx="102" cy="124" r="1.6"/></g>';
  },
  /* A wreath of petals around an enamel centre. */
  rose(m) {
    let wreath = '';
    for (let i = 0; i < 16; i++) {
      wreath += '<g transform="rotate(' + (i * 22.5) + ' 80 80)"><ellipse cx="80" cy="16" rx="4.4" ry="7" fill="' + m.ink + '" opacity=".5"/>'
        + '<ellipse cx="80" cy="24" rx="2.4" ry="3.6" fill="' + m.rim + '" opacity=".7"/></g>';
    }
    const bloom = (x, y, r) => [0, 72, 144, 216, 288].map((a) => '<ellipse cx="' + x + '" cy="' + (y - r * 0.62) + '" rx="' + (r * 0.42).toFixed(1) + '" ry="' + (r * 0.62).toFixed(1) + '" fill="' + m.ink + '" opacity=".7" transform="rotate(' + a + ' ' + x + ' ' + y + ')"/>').join('')
      + '<circle cx="' + x + '" cy="' + y + '" r="' + (r * 0.28).toFixed(1) + '" fill="' + m.rim + '"/>';
    return '<circle cx="80" cy="80" r="76" fill="' + m.rim + '"/>'
      + '<circle cx="80" cy="80" r="71" fill="' + m.face + '"/>' + wreath
      + '<circle cx="80" cy="80" r="54" fill="#FDEFEE"/>'
      + '<circle cx="80" cy="80" r="54" fill="none" stroke="' + m.rim + '" stroke-width="1.6"/>'
      + bloom(80, 42, 11) + bloom(80, 118, 9)
      + '<g stroke="' + m.rim + '" stroke-width="1.4" fill="none" opacity=".7"><path d="M44 80 q6 -7 12 0 M116 80 q-6 -7 -12 0"/></g>';
  },
  /* Obsidian struck with gold: a dark stone disc, a gold rim, a ring of stars
     and a sun mark at the top. The only dark coin of the four. */
  obsidian(m) {
    let stars = '';
    for (let k = 0; k < 24; k++) {
      const t = (k / 24) * Math.PI * 2;
      const x = 80 + Math.cos(t) * 62, y = 80 + Math.sin(t) * 62;
      stars += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (k % 3 === 0 ? 2.2 : 1.2) + '" fill="' + m.rim + '" opacity="' + (k % 3 === 0 ? '.9' : '.5') + '"/>';
    }
    const ray = (len, w) => {
      let out = '';
      for (let k = 0; k < 8; k++) {
        out += '<path d="M80 ' + (80 - len) + ' l' + w + ' ' + w + ' l-' + w + ' ' + (len - 80 + 80 - w) + ' l-' + w + ' -' + (len - w) + ' Z" fill="' + m.rim + '" opacity=".9" transform="rotate(' + (k * 45) + ' 80 80)"/>';
      }
      return out;
    };
    return '<circle cx="80" cy="80" r="76" fill="' + m.rim + '"/>'
      + '<circle cx="80" cy="80" r="71" fill="' + m.face + '"/>'
      + '<circle cx="80" cy="80" r="71" fill="none" stroke="#4A3F6B" stroke-width="1.4"/>'
      + stars
      + '<circle cx="80" cy="80" r="52" fill="none" stroke="' + m.rim + '" stroke-width="1.6" opacity=".7"/>'
      + '<circle cx="80" cy="80" r="49" fill="#1F1932" opacity=".45"/>'
      + '<g opacity=".95"><circle cx="80" cy="42" r="7" fill="' + m.rim + '"/>'
      + '<path d="M80 30 l2.4 6 6 2.4 -6 2.4 -2.4 6 -2.4 -6 -6 -2.4 6 -2.4 Z" fill="' + m.rim + '" opacity=".8"/></g>'
      + '<g fill="' + m.rim + '" opacity=".85"><circle cx="66" cy="120" r="2.4"/><circle cx="80" cy="122" r="3"/><circle cx="94" cy="120" r="2.4"/></g>';
  }

};

/* ---- the coin, in whichever metal is chosen ---- */
function coinMetal() { return LOOKS.of('coin'); }

/* ---- the paper the diary is written on ---- */
function diaryPaperClass() { return 'paper-' + LOOKS.get('diary'); }

/* ---- the picker ----
   Every look is drawn at its real size. The ones that need Plus are dimmed and
   carry a padlock, so what you would get is visible before you pay. */
function lookPreview(kind, item) {
  if (kind === 'cardback') return '<span class="lk-card">' + backSVGFor(item) + '</span>';
  if (kind === 'tree') return '<span class="lk-tree">' + treeSVGFor(item.id, true) + '</span>';
  if (kind === 'coin') return '<span class="lk-coin">' + coinFaceFor(item, '') + '</span>';
  return '<span class="lk-diary ' + esc('paper-' + item.id) + '"><i></i><i></i><i></i></span>';
}
/* The same tiles as the picker, in one row, for the screen the look belongs
   to. A locked one is drawn in full and dimmed rather than hidden, so the
   choice is made in front of the thing it changes. */
function lookStripHTML(kind) {
  const S = T(), set = LOOK_SETS[kind] || [], now = LOOKS.get(kind), pro = proOn();
  if (!set.length) return '';
  return '<div class="card lookstrip"><div class="ls-h"><h3>' + esc(S.lookKinds[kind]) + '</h3>'
    + '<a href="#/looks">' + esc(S.looksAll) + ' ›</a></div>'
    + '<p class="hint">' + esc(pro ? S.looksYours : S.looksStripNote) + '</p>'
    + '<div class="lookgrid four">' + set.map((x) => {
      const locked = x.pro && !pro, on = now === x.id;
      return '<button type="button" class="look' + (on ? ' on' : '') + (locked ? ' locked' : '') + '" data-strip="' + kind + ':' + x.id + '">'
        + lookPreview(kind, x) + '<b>' + esc(L(x.name)) + '</b>'
        + (locked ? '<span class="lk-lock">🔒</span>' : '') + (on ? '<span class="lk-on">✓</span>' : '') + '</button>';
    }).join('') + '</div></div>';
}
/* redraw is called after a change, so the screen shows the new look at once. */
function bindLookStrip(root, redraw) {
  $$('[data-strip]', root).forEach((b) => b.addEventListener('click', () => {
    const p = b.getAttribute('data-strip').split(':'), item = (LOOK_SETS[p[0]] || []).filter((x) => x.id === p[1])[0];
    if (!item) return;
    if (item.pro && !proOn()) { toast(T().looksNeedPlus); location.hash = '#/unlock'; return; }
    LOOKS.set(p[0], p[1]); toast('✓');
    if (redraw) redraw();
  }));
}
/* The same tiles as the picker, in one row, for the screen the look belongs
   to. A locked one is drawn in full and dimmed rather than hidden, so the
   choice is made in front of the thing it changes. */
function lookStripHTML(kind) {
  const S = T(), set = LOOK_SETS[kind] || [], now = LOOKS.get(kind), pro = proOn();
  if (!set.length) return '';
  return '<div class="card lookstrip"><div class="ls-h"><h3>' + esc(S.lookKinds[kind]) + '</h3>'
    + '<a href="#/looks">' + esc(S.looksAll) + ' ›</a></div>'
    + '<p class="hint">' + esc(pro ? S.looksYours : S.looksStripNote) + '</p>'
    + '<div class="lookgrid four">' + set.map((x) => {
      const locked = x.pro && !pro, on = now === x.id;
      return '<button type="button" class="look' + (on ? ' on' : '') + (locked ? ' locked' : '') + '" data-strip="' + kind + ':' + x.id + '">'
        + lookPreview(kind, x) + '<b>' + esc(L(x.name)) + '</b>'
        + (locked ? '<span class="lk-lock">🔒</span>' : '') + (on ? '<span class="lk-on">✓</span>' : '') + '</button>';
    }).join('') + '</div></div>';
}
/* redraw is called after a change, so the screen shows the new look at once. */
function bindLookStrip(root, redraw) {
  $$('[data-strip]', root).forEach((b) => b.addEventListener('click', () => {
    const p = b.getAttribute('data-strip').split(':'), item = (LOOK_SETS[p[0]] || []).filter((x) => x.id === p[1])[0];
    if (!item) return;
    if (item.pro && !proOn()) { toast(T().looksNeedPlus); location.hash = '#/unlock'; return; }
    LOOKS.set(p[0], p[1]); toast('✓');
    if (redraw) redraw();
  }));
}
function renderLooks() {
  const S = T(), m = $('#main');
  const draw = () => {
    const pro = proOn();
    m.innerHTML = '<div class="eyebrow">' + esc(CONFIG.brand) + '</div><h1 style="margin-bottom:6px">' + esc(S.looksTitle) + '</h1><p class="muted">' + esc(S.looksIntro) + '</p>'
      + (pro ? '<p class="hint">✨ ' + esc(S.looksPlusOn) + '</p>' : '<a class="salebar" href="#/unlock"><span class="tag">✨ ' + esc(S.plusName) + '</span><span class="txt">' + esc(S.looksLocked) + '</span><span class="go">' + esc(S.unlockLink) + ' ›</span></a>')
      + LOOK_KINDS.map((kind) => '<div class="sec"><h2 style="margin-bottom:8px">' + esc(S.lookKinds[kind]) + '</h2><div class="lookgrid">'
        + LOOK_SETS[kind].map((x) => {
          const locked = x.pro && !pro, on = LOOKS.get(kind) === x.id;
          return '<button type="button" class="look' + (on ? ' on' : '') + (locked ? ' locked' : '') + '" data-look="' + kind + ':' + x.id + '">'
            + lookPreview(kind, x) + '<b>' + esc(L(x.name)) + '</b>'
            + (locked ? '<span class="lk-lock">🔒</span>' : '') + (on ? '<span class="lk-on">✓</span>' : '') + '</button>';
        }).join('') + '</div></div>').join('')
      + '<p style="margin-top:14px"><a class="backlink" href="#/unlock">' + esc(S.unlockLink) + ' →</a></p>';
    $$('[data-look]', m).forEach((b) => b.addEventListener('click', () => {
      const p = b.getAttribute('data-look').split(':'), item = LOOK_SETS[p[0]].filter((x) => x.id === p[1])[0];
      if (item.pro && !proOn()) { toast(S.looksNeedPlus); location.hash = '#/unlock'; return; }
      LOOKS.set(p[0], p[1]); toast('✓'); draw();
    }));
  };
  draw();
}
ROUTES.looks = { nav: '', render: renderLooks };
