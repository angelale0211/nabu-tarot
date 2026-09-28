/* ============================ outfit ============================
   Mặc gì tháng này: one painted outfit for every sign, month and gender,
   dressed for the weather in the north of Vietnam and coloured from the
   sign's palette. The pictures are AI-painted and live beside the page in
   outfit/<character>/, fetched only when this screen is opened.

   Hair can be recoloured. Each picture has a grey mask of its hair
   (outfit/<character>/m/), and paintOutfit() runs a gradient map inside it:
   every pixel keeps its place between the hair's own shadows and highlights
   and takes a colour from a ramp running from a warm dark, through the
   chosen colour, to a lighter one. Skin is not recoloured, because a mask
   cannot tell pale fabric from skin reliably; skin tone is chosen by picking
   the character painted with it.

   The screen is organised by zodiac sign, which is what App Store review
   objected to (4.3b), so the iPhone app does not show it. */

/* The two characters: fair skin, and brown skin. */
const OUTFIT_CHARS = ['1', '2'];
const OUTFIT_SIGNS = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
/* Four clothing colours per sign, in the order of STR.zodiac. */
const OUTFIT_PAL = [['#C8373B', '#F08A5D', '#F4EBDD', '#3A3A40'], ['#6B7F4E', '#D9C7A7', '#C98C7E', '#5A3E2B'], ['#F2D95C', '#8EC5E8', '#FAFAF7', '#B9BCC2'],
  ['#F3EEE3', '#C9CCD1', '#A9C9D9', '#EFC6CC'], ['#E3A72F', '#C8642C', '#F6EFE2', '#8A5A35'], ['#D8CBB3', '#7E8457', '#F7F5F0', '#A88A6A'],
  ['#F2E8DC', '#D9B8B4', '#A8B9A0', '#9C5B44'], ['#2E2B3A', '#7B2D3B', '#C9A227', '#E8E2D6'], ['#6D3B6E', '#1F6F78', '#C0703B', '#F1E7D6'],
  ['#3C3F46', '#5B4636', '#B08A5E', '#F4F2EE'], ['#3E6FD8', '#C9CCD1', '#B7A6D9', '#F8F8FA'], ['#9ED3CF', '#C9B6E4', '#5B8DB8', '#F6F3EE']];
const OUTFIT_HAIR = ['#1E1A1A', '#4A3226', '#8A5A3C', '#E8CB86', '#D98FA8', '#8FA7D9', '#B8B8C0'];

/* The Vietnamese here was approved on 2026-09-28 (appstore/duyet-noi-dung.md, section J); change it only with a new approval. */
const OUTFIT_TXT = {
  vi: {
    title: 'Mặc gì tháng này', intro: 'Mỗi tháng một bộ đồ hợp thời tiết miền Bắc, phối từ bảng màu của cung bạn.',
    female: 'Nữ', male: 'Nam', chars: { 1: 'Da sáng', 2: 'Da nâu' }, month: (m) => 'Tháng ' + m,
    pal: (s) => 'Bảng màu của ' + s, hair: 'Màu tóc', hairReset: 'Để nguyên', hairOther: 'Chọn màu khác',
    ai: 'Hình minh hoạ do AI vẽ.', offline: 'Chưa tải được hình. Kiểm tra mạng rồi thử lại nhé.',
    weather: ['10–17°, rét, mưa phùn', '13–19°, nồm ẩm', '17–23°, mưa phùn', '21–28°, ấm', '25–33°, nóng dần', '27–35°, nắng gắt', '27–34°, mưa rào', '26–33°, mưa nhiều', '24–31°, đầu thu', '20–27°, thu mát', '17–24°, se lạnh', '12–19°, lạnh'],
    female_: ['Áo khoác dạ dài, len cổ lọ, chân váy xếp ly qua gối, quần tất, bốt cổ ngắn và khăn len', 'Trench coat thắt eo, áo len mỏng, quần ống đứng và giày lười', 'Áo khoác lửng, sơ mi mềm, chân váy chữ A và giày búp bê', 'Áo tay bồng sơ vin, chân váy xoè và sandal quai mảnh', 'Áo linen sát nách, quần linen ống rộng và dép quai đan', 'Váy suông sát nách, mũ cói rộng vành và sandal quai mảnh', 'Váy sơ mi vải nhanh khô, áo mưa mỏng buộc ngang eo và sandal nhựa', 'Áo mưa lửng, áo ba lỗ, quần lửng và ủng mưa cổ ngắn', 'Sơ mi mềm, chân váy satin và giày mary jane', 'Áo len gân mỏng, cardigan, quần ống đứng và giày lười đính nơ', 'Áo khoác dạ ngắn, len cổ lọ, chân váy xếp ly, quần tất và bốt gót nhỏ', 'Áo phao, len vặn thừng, quần jeans ống đứng, bốt lót lông và mũ len'],
    male_: ['Măng tô dạ, len cổ lọ, quần âu len, bốt chelsea da nâu và khăn len', 'Trench coat, áo len mỏng, quần kaki ống đứng và giày derby da', 'Áo khoác khoá kéo mỏng, sơ mi oxford, quần kaki và giày thể thao da trắng', 'Sơ mi linen ngắn tay, quần kaki ống côn và giày vải buộc dây', 'Áo phông linen rộng, quần short linen và sandal da quai bản', 'Sơ mi cổ bẻ ngắn tay, quần short, mũ tai bèo và sandal đế dày', 'Áo phông nhanh khô, quần short túi hộp, áo mưa mỏng và sandal chống nước', 'Áo mưa có mũ, áo phông, quần lửng và ủng cao su buộc dây', 'Sơ mi xắn tay, quần ống đứng và giày lười da lộn', 'Polo len mỏng, cardigan, quần ống đứng và giày brogue da', 'Áo khoác dạ ngắn, len cổ lọ, quần âu ôm và bốt da buộc dây', 'Áo phao, len vặn thừng, quần jeans ống đứng, giày leo núi và mũ len']
  },
  en: {
    title: 'What to wear this month', intro: 'An outfit for every month, dressed for the weather in northern Vietnam and coloured from your sign’s palette.',
    female: 'Women', male: 'Men', chars: { 1: 'Fair skin', 2: 'Brown skin' }, month: (m) => MONTHS_EN[m - 1],
    pal: (s) => s + ' palette', hair: 'Hair colour', hairReset: 'As painted', hairOther: 'Pick another colour',
    ai: 'Illustrations painted by AI.', offline: 'The picture did not load. Check your connection and try again.',
    weather: ['10–17°, cold and drizzly', '13–19°, damp and muggy', '17–23°, drizzle', '21–28°, warm', '25–33°, heating up', '27–35°, blazing sun', '27–34°, showers', '26–33°, heavy rain', '24–31°, early autumn', '20–27°, mild autumn', '17–24°, a chill in the air', '12–19°, cold'],
    female_: ['A long wool coat, a chunky turtleneck, a pleated midi skirt with tights, ankle boots and a knitted scarf', 'A belted trench coat, a fine-knit jumper, straight trousers and loafers', 'A cropped jacket, a soft blouse, an A-line midi skirt and ballet flats', 'A puff-sleeve blouse tucked into a flared midi skirt, with strappy sandals', 'A sleeveless linen top, wide-leg linen trousers and woven slides', 'A flowing sundress, a wide straw hat and fine-strapped sandals', 'A quick-dry shirt dress, a light rain jacket tied at the waist and jelly sandals', 'A cropped rain jacket over a vest top, cropped trousers and short rain boots', 'A soft shirt, a satin midi skirt and Mary Janes', 'A ribbed top, an open cardigan, straight trousers and bow loafers', 'A short wool jacket, a turtleneck, a pleated skirt with tights and heeled ankle boots', 'A padded coat, a cable-knit jumper, straight jeans, fleece-lined boots and a beanie'],
    male_: ['A wool overcoat, a chunky turtleneck, wool trousers, brown Chelsea boots and a knitted scarf', 'A trench coat, a fine-knit jumper, straight chinos and leather derbies', 'A light zip jacket, an Oxford shirt, slim chinos and white leather trainers', 'A short-sleeved linen shirt, tapered chinos and canvas lace-ups', 'A loose linen T-shirt, linen shorts and leather fisherman sandals', 'A camp-collar shirt, light shorts, a bucket hat and chunky sport sandals', 'A quick-dry T-shirt, cargo shorts, a light rain jacket and trekking sandals', 'A hooded rain jacket, a T-shirt, cropped trousers and laced rubber boots', 'A shirt with the sleeves rolled, straight trousers and suede penny loafers', 'A knitted polo, an open cardigan, straight trousers and leather brogues', 'A short wool jacket, a turtleneck, slim trousers and lace-up work boots', 'A padded coat, a cable-knit jumper, straight jeans, hiking boots and a beanie']
  },
  de: {
    title: 'Was ziehe ich diesen Monat an', intro: 'Für jeden Monat ein Outfit, passend zum Wetter in Nordvietnam und in den Farben deines Sternzeichens.',
    female: 'Damen', male: 'Herren', chars: { 1: 'Helle Haut', 2: 'Braune Haut' }, month: (m) => MONTHS_DE[m - 1],
    pal: (s) => 'Farben: ' + s, hair: 'Haarfarbe', hairReset: 'Wie gemalt', hairOther: 'Andere Farbe wählen',
    ai: 'Illustrationen von einer KI gemalt.', offline: 'Das Bild ließ sich nicht laden. Prüfe deine Verbindung und versuch es noch einmal.',
    weather: ['10–17°, kalt, Nieselregen', '13–19°, feucht und schwül', '17–23°, Nieselregen', '21–28°, warm', '25–33°, es wird heiß', '27–35°, pralle Sonne', '27–34°, Regenschauer', '26–33°, viel Regen', '24–31°, Frühherbst', '20–27°, milder Herbst', '17–24°, frisch', '12–19°, kalt'],
    female_: ['Langer Wollmantel, grober Rollkragenpullover, Plisseerock mit Strumpfhose, Stiefeletten und Strickschal', 'Trenchcoat mit Gürtel, feiner Pullover, gerade Hose und Loafer', 'Kurze Jacke, weiche Bluse, A-Linien-Midirock und Ballerinas', 'Bluse mit Puffärmeln im ausgestellten Midirock, dazu Riemchensandalen', 'Ärmelloses Leinentop, weite Leinenhose und geflochtene Pantoletten', 'Fließendes Sommerkleid, breiter Strohhut und zarte Sandalen', 'Hemdblusenkleid aus schnell trocknendem Stoff, Regenjacke um die Taille und Jelly-Sandalen', 'Kurze Regenjacke über einem Top, verkürzte Hose und kurze Gummistiefel', 'Weiche Bluse, Satin-Midirock und Mary Janes', 'Geripptes Oberteil, offene Strickjacke, gerade Hose und Loafer mit Schleife', 'Kurze Wolljacke, Rollkragen, Faltenrock mit Strumpfhose und Stiefeletten mit Absatz', 'Steppmantel, Zopfstrickpullover, gerade Jeans, gefütterte Boots und Mütze'],
    male_: ['Wollmantel, grober Rollkragenpullover, Wollhose, braune Chelsea-Boots und Strickschal', 'Trenchcoat, feiner Pullover, gerade Chinos und Derbys aus Leder', 'Leichte Jacke mit Reißverschluss, Oxfordhemd, schmale Chinos und weiße Ledersneaker', 'Kurzärmliges Leinenhemd, Chinos und Schnürschuhe aus Canvas', 'Lockeres Leinenshirt, Leinenshorts und Fischersandalen aus Leder', 'Hemd mit Reverskragen, leichte Shorts, Fischerhut und Sportsandalen', 'Schnell trocknendes Shirt, Cargoshorts, leichte Regenjacke und Trekkingsandalen', 'Regenjacke mit Kapuze, T-Shirt, verkürzte Hose und Gummistiefel zum Schnüren', 'Hemd mit hochgekrempelten Ärmeln, gerade Hose und Penny Loafer aus Wildleder', 'Strickpolo, offene Strickjacke, gerade Hose und Budapester', 'Kurze Wolljacke, Rollkragen, schmale Hose und Schnürboots', 'Steppmantel, Zopfstrickpullover, gerade Jeans, Wanderschuhe und Mütze']
  }
};
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_DE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
const outfitTxt = () => OUTFIT_TXT[lang] || OUTFIT_TXT.en;

/* What the visitor picked last time. The sign starts at their own when the
   birthday is known, the month at this one (Vietnam time). */
function outfitState() {
  const saved = store.get('nabu-outfit', {}) || {};
  const own = mySign();
  const st = {
    c: OUTFIT_CHARS.indexOf(saved.c) > -1 ? saved.c : OUTFIT_CHARS[0],
    g: saved.g === 'male' ? 'male' : 'female',
    s: typeof saved.s === 'number' && saved.s >= 0 && saved.s < 12 ? saved.s : (own >= 0 ? own : 0),
    m: new Date(Date.now() + 7 * 3600e3).getUTCMonth() + 1,
    hair: /^#[0-9a-f]{6}$/i.test(saved.hair || '') ? saved.hair : null
  };
  return st;
}
const outfitSave = (st) => store.set('nabu-outfit', { c: st.c, g: st.g, s: st.s, hair: st.hair });
const outfitName = (st) => OUTFIT_SIGNS[st.s] + '-' + st.m + '-' + st.g;

/* The recolour itself: base picture into `canvas`, hair (mask channel 0)
   gradient-mapped to `hex`. Pure pixels in, pixels out, so the suite can run it. */
function paintOutfit(canvas, base, mask, hex) {
  const w = base.naturalWidth || base.width, h = base.naturalHeight || base.height;
  canvas.width = w; canvas.height = h;
  const c = canvas.getContext('2d'); c.drawImage(base, 0, 0, w, h);
  if (!hex || !mask) return;
  const px = c.getImageData(0, 0, w, h), d = px.data;
  const mc = document.createElement('canvas'); mc.width = w; mc.height = h;
  const mx = mc.getContext('2d'); mx.drawImage(mask, 0, 0, w, h); const m = mx.getImageData(0, 0, w, h).data;
  const t = [1, 3, 5].map((i) => parseInt(hex.substr(i, 2), 16) / 255);
  const lum = (i) => (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255;
  let sum = 0, n = 0;
  for (let i = 0; i < d.length; i += 4) if (m[i] > 127) { sum += lum(i); n++; }
  if (!n) return;
  const mean = sum / n;
  let sq = 0;
  for (let i = 0; i < d.length; i += 4) if (m[i] > 127) { const l = lum(i) - mean; sq += l * l; }
  const sd = Math.sqrt(sq / n) || 0.1;
  /* Darkening a light colour directly turns blonde olive; a warm shadow does not. */
  const shadow = [t[0] * 0.42 + 0.03, t[1] * 0.32 + 0.02, t[2] * 0.26 + 0.02];
  const light = t.map((v) => v + (1 - v) * 0.45);
  const ramp = (u) => (u < 0.5 ? shadow.map((s, k) => s + (t[k] - s) * (u * 2)) : t.map((v, k) => v + (light[k] - v) * ((u - 0.5) * 2)));
  for (let i = 0; i < d.length; i += 4) {
    let a = m[i] / 255; if (!a) continue;
    /* Much brighter than the hair is background showing through the mask's
       soft edge: fade it out rather than paint a pale fringe. */
    const z = (lum(i) - mean) / sd;
    if (z > 2) a *= Math.max(0, 1 - (z - 2) / 1.5);
    if (!a) continue;
    const nv = ramp(Math.max(0, Math.min(1, 0.5 + z * 0.18)));
    for (let k = 0; k < 3; k++) d[i + k] = Math.round((d[i + k] / 255 * (1 - a) + nv[k] * a) * 255);
  }
  c.putImageData(px, 0, 0);
}

function outfitLoad(src) {
  return new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
}

function renderOutfit() {
  if (isIOSApp()) { redirect('#/home'); return; }
  const S = T(), X = outfitTxt(), m = $('#main'), st = outfitState();
  const here = navStillHere();
  let base = null, mask = null, token = 0;
  const chip = (k, v, label, on) => '<button class="chip' + (on ? ' on' : '') + '" data-ok="' + k + '" data-ov="' + v + '" aria-pressed="' + on + '">' + esc(label) + '</button>';

  function chrome() {
    const pal = OUTFIT_PAL[st.s];
    $('#ofChips').innerHTML = '<div class="ofrow">' + chip('g', 'female', X.female, st.g === 'female') + chip('g', 'male', X.male, st.g === 'male')
      + (OUTFIT_CHARS.length > 1 ? OUTFIT_CHARS.map((c) => chip('c', c, X.chars[c], st.c === c)).join('') : '') + '</div>'
      + '<div class="ofrow ofscroll">' + S.zodiac.map((z, i) => chip('s', i, z, st.s === i)).join('') + '</div>'
      + '<div class="ofrow ofscroll">' + MONTHS_EN.map((_, i) => chip('m', i + 1, X.month(i + 1), st.m === i + 1)).join('') + '</div>';
    $('#ofCap').innerHTML = '<h2>' + esc(S.zodiac[st.s]) + ' · ' + esc(X.month(st.m)) + '</h2>'
      + '<p class="faint">' + esc(X.weather[st.m - 1]) + '</p>'
      + '<p>' + esc(X[st.g + '_'][st.m - 1]) + '</p>'
      + '<div class="ofpal" aria-label="' + esc(X.pal(S.zodiac[st.s])) + '">' + pal.map((c) => '<span style="background:' + c + '"></span>').join('')
      + '<span class="faint">' + esc(X.pal(S.zodiac[st.s])) + '</span></div>';
    $('#ofHair').innerHTML = OUTFIT_HAIR.map((c) => '<button class="ofsw" data-ok="hair" data-ov="' + c + '" style="background:' + c + '" aria-label="' + c + '" aria-pressed="' + (st.hair === c) + '"></button>').join('')
      + '<input type="color" class="ofsw" id="ofPick" aria-label="' + esc(X.hairOther) + '" value="' + (st.hair || '#8a5a3c') + '">'
      + '<button class="more" data-ok="hair" data-ov="">' + esc(X.hairReset) + '</button>';
    /* The rows are redrawn on every tap, which scrolls them back to the start:
       bring the chosen sign and month back into view. */
    document.querySelectorAll('#ofChips .ofscroll').forEach((row) => {
      const on = row.querySelector('.on');
      if (on) row.scrollLeft = on.offsetLeft - row.offsetLeft - (row.clientWidth - on.offsetWidth) / 2;
    });
  }
  function paint() {
    const cv = $('#ofCanvas'); if (!cv || !base) return;
    paintOutfit(cv, base, mask, st.hair);
    /* The two characters were painted at slightly different heights; the frame takes the picture's own shape. */
    cv.parentNode.style.aspectRatio = cv.width + '/' + cv.height;
    cv.classList.remove('dim');
  }
  async function fetchAndPaint() {
    const my = ++token, dir = 'outfit/' + st.c + '/', n = outfitName(st);
    const cv = $('#ofCanvas'); if (cv) cv.classList.add('dim');
    try {
      const got = await Promise.all([outfitLoad(dir + n + '.jpg'), outfitLoad(dir + 'm/' + n + '.png').catch(() => null)]);
      if (my !== token || !here()) return;
      base = got[0]; mask = got[1];
      $('#ofErr').textContent = '';
      paint();
    } catch (e) {
      if (my !== token || !here()) return;
      $('#ofErr').textContent = X.offline;
      if (cv) cv.classList.remove('dim');
    }
  }

  m.innerHTML = backLink('#/play', S.actTitle) + '<div id="of"><h1 style="margin-bottom:6px">' + esc(X.title) + '</h1><p class="muted">' + esc(X.intro) + '</p>'
    + '<div id="ofChips"></div>'
    + '<div class="ofstage"><canvas id="ofCanvas" class="dim" role="img" aria-label="' + esc(X.title) + '"></canvas></div>'
    + '<p class="err" id="ofErr" role="status"></p>'
    + '<div id="ofCap" class="ofcap"></div>'
    + '<h3 class="oflbl">' + esc(X.hair) + '</h3><div class="ofhair" id="ofHair"></div>'
    + '<p class="faint" style="margin-top:18px">' + esc(X.ai) + '</p></div>';
  chrome(); fetchAndPaint();

  const root = $('#of');
  root.addEventListener('click', (e) => {
    const b = e.target.closest('[data-ok]'); if (!b || b.type === 'color') return;
    const k = b.dataset.ok, v = b.dataset.ov;
    if (k === 'hair') { st.hair = v || null; outfitSave(st); chrome(); paint(); return; }
    st[k] = (k === 's' || k === 'm') ? Number(v) : v;
    outfitSave(st); chrome(); fetchAndPaint();
  });
  /* The native picker fires input on every drag; repaint at most once a frame. */
  let raf = 0;
  root.addEventListener('input', (e) => {
    if (e.target.id !== 'ofPick') return;
    st.hair = e.target.value;
    if (!raf) raf = requestAnimationFrame(() => { raf = 0; paint(); });
  });
  root.addEventListener('change', (e) => { if (e.target.id === 'ofPick') { outfitSave(st); chrome(); } });
}
ROUTES.outfit = { nav: 'play', render: renderOutfit };
