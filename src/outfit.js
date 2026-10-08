/* ============================ outfit ============================
   Mặc gì tháng này: one painted outfit for every sign, month and gender,
   dressed for the weather and coloured from the
   sign's palette. The pictures are AI-painted and live beside the page in
   outfit/<character>/, fetched only when this screen is opened.

   Hair is shown as painted. Recolouring it pixel by pixel was tried and dropped on 2026-09-28:
   the hair is painted pale and half-transparent, and every mask left blur or specks once the colour
   went dark. A different hair colour is a different painted picture; each supported skin/hair combination
   has its own complete set of pictures.

   The screen is organised by zodiac sign, which is what App Store review
   objected to (4.3b). It was kept out of the iPhone app at first; since
   v269 it shows there too, at the owner's request, knowing the risk. */

/* Every available combination has its own painted image set. */
const OUTFIT_CHARS = ['1', '2', '3', '4'];
const outfitSkin = (c) => c === '4' ? '1' : c;
const outfitHairChoices = (c) => outfitSkin(c) === '1' ? ['1', '4'] : [c];
const OUTFIT_SIGNS = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
/* Four clothing colours per sign, in the order of STR.zodiac. */
const OUTFIT_PAL = [['#C8373B', '#F08A5D', '#F4EBDD', '#3A3A40'], ['#6B7F4E', '#D9C7A7', '#C98C7E', '#5A3E2B'], ['#F2D95C', '#8EC5E8', '#FAFAF7', '#B9BCC2'],
  ['#F3EEE3', '#C9CCD1', '#A9C9D9', '#EFC6CC'], ['#E3A72F', '#C8642C', '#F6EFE2', '#8A5A35'], ['#D8CBB3', '#7E8457', '#F7F5F0', '#A88A6A'],
  ['#F2E8DC', '#D9B8B4', '#A8B9A0', '#9C5B44'], ['#2E2B3A', '#7B2D3B', '#C9A227', '#E8E2D6'], ['#6D3B6E', '#1F6F78', '#C0703B', '#F1E7D6'],
  ['#3C3F46', '#5B4636', '#B08A5E', '#F4F2EE'], ['#3E6FD8', '#C9CCD1', '#B7A6D9', '#F8F8FA'], ['#9ED3CF', '#C9B6E4', '#5B8DB8', '#F6F3EE']];
/* The Vietnamese here was approved on 2026-09-28 (appstore/duyet-noi-dung.md, section J); change it only with a new approval. */
const OUTFIT_TXT = {
  vi: {
    title: 'Mặc gì tháng này', intro: 'Mỗi tháng một bộ đồ hợp thời tiết, phối từ bảng màu của cung bạn.',
    female: 'Nữ', male: 'Nam', chars: { 1: 'Da sáng', 2: 'Da nâu', 3: 'Da ngăm', 4: 'Da sáng' }, skin: 'Màu da', skins: { 1: 'Sáng', 3: 'Ngăm', 2: 'Nâu' }, hairs: { 1: 'Nâu đen', 2: 'Đen', 3: 'Đen', 4: 'Vàng' }, month: (m) => 'Tháng ' + m,
    pal: (s) => 'Bảng màu của ' + s, hair: 'Màu tóc', hairReset: 'Để nguyên', hairOther: 'Chọn màu khác',
    ai: 'Hình minh hoạ do AI vẽ.', offline: 'Chưa tải được hình. Kiểm tra mạng rồi thử lại nhé.',
    /* Choosing the weather: draft Vietnamese, section O of the approval file. */
    modeMonth: 'Theo tháng', modeWx: 'Tự chọn thời tiết', wxLbl: 'Thời tiết', tLbl: 'Nhiệt độ',
    wx: { sun: 'Nắng', cloud: 'Nhiều mây, âm u', rain: 'Mưa' },
    rain: { w1: { female: 'Áo mưa dài có mũ thắt eo, len cổ lọ, quần ống đứng và ủng mưa cao cổ', male: 'Áo parka chống nước có mũ, áo len, quần ống đứng và ủng cao su' },
      w2: { female: 'Trench coat chống nước, áo len mỏng, chân váy midi và ủng mưa cổ ngắn', male: 'Áo khoác đi mưa mỏng có mũ, sơ mi dài tay, quần kaki và giày thể thao chống nước' } },
    weather: ['10–17°, rét, mưa phùn', '13–19°, nồm ẩm', '17–23°, mưa phùn', '21–28°, ấm', '25–33°, nóng dần', '27–35°, nắng gắt', '27–34°, mưa rào', '26–33°, mưa nhiều', '24–31°, đầu thu', '20–27°, thu mát', '17–24°, se lạnh', '12–19°, lạnh'],
    female_: ['Áo khoác dạ dài, len cổ lọ, chân váy xếp ly qua gối, quần tất, bốt cổ ngắn và khăn len', 'Trench coat thắt eo, áo len mỏng, quần ống đứng và giày lười', 'Áo khoác lửng, sơ mi mềm, chân váy chữ A và giày búp bê', 'Áo tay bồng sơ vin, chân váy xoè và sandal quai mảnh', 'Áo linen sát nách, quần linen ống rộng và dép quai đan', 'Váy suông sát nách, mũ cói rộng vành và sandal quai mảnh', 'Váy sơ mi vải nhanh khô, áo mưa mỏng buộc ngang eo và sandal nhựa', 'Áo mưa lửng, áo ba lỗ, quần lửng và ủng mưa cổ ngắn', 'Sơ mi mềm, chân váy satin và giày mary jane', 'Áo len gân mỏng, cardigan, quần ống đứng và giày lười đính nơ', 'Áo khoác dạ ngắn, len cổ lọ, chân váy xếp ly, quần tất và bốt gót nhỏ', 'Áo phao, len vặn thừng, quần jeans ống đứng, bốt lót lông và mũ len'],
    male_: ['Măng tô dạ, len cổ lọ, quần âu len, bốt chelsea da nâu và khăn len', 'Trench coat, áo len mỏng, quần kaki ống đứng và giày derby da', 'Áo khoác khoá kéo mỏng, sơ mi oxford, quần kaki và giày thể thao da trắng', 'Sơ mi linen ngắn tay, quần kaki ống côn và giày vải buộc dây', 'Áo phông linen rộng, quần short linen và sandal da quai bản', 'Sơ mi cổ bẻ ngắn tay, quần short, mũ tai bèo và sandal đế dày', 'Áo phông nhanh khô, quần short túi hộp, áo mưa mỏng và sandal chống nước', 'Áo mưa có mũ, áo phông, quần lửng và ủng cao su buộc dây', 'Sơ mi xắn tay, quần ống đứng và giày lười da lộn', 'Polo len mỏng, cardigan, quần ống đứng và giày brogue da', 'Áo khoác dạ ngắn, len cổ lọ, quần âu ôm và bốt da buộc dây', 'Áo phao, len vặn thừng, quần jeans ống đứng, giày leo núi và mũ len']
  },
  en: {
    title: 'What to wear this month', intro: 'An outfit for every month, dressed for the weather and coloured from your sign’s palette.',
    female: 'Women', male: 'Men', chars: { 1: 'Fair skin', 2: 'Brown skin', 3: 'Tan skin', 4: 'Fair skin' }, skin: 'Skin tone', skins: { 1: 'Fair', 3: 'Tan', 2: 'Brown' }, hairs: { 1: 'Dark brown', 2: 'Black', 3: 'Black', 4: 'Blonde' }, month: (m) => MONTHS_EN[m - 1],
    pal: (s) => s + ' palette', hair: 'Hair colour', hairReset: 'As painted', hairOther: 'Pick another colour',
    ai: 'Illustrations painted by AI.', offline: 'The picture did not load. Check your connection and try again.',
    modeMonth: 'By month', modeWx: 'Choose the weather', wxLbl: 'Weather', tLbl: 'Temperature',
    wx: { sun: 'Sunny', cloud: 'Cloudy, overcast', rain: 'Rain' },
    rain: { w1: { female: 'A long belted hooded raincoat, a turtleneck, straight trousers and tall rain boots', male: 'A hooded waterproof parka, a knit jumper, straight trousers and rubber rain boots' },
      w2: { female: 'A light waterproof trench coat, a fine-knit top, a midi skirt and short rain boots', male: 'A light hooded rain jacket, a long-sleeved shirt, chinos and waterproof trainers' } },
    weather: ['10–17°, cold and drizzly', '13–19°, damp and muggy', '17–23°, drizzle', '21–28°, warm', '25–33°, heating up', '27–35°, blazing sun', '27–34°, showers', '26–33°, heavy rain', '24–31°, early autumn', '20–27°, mild autumn', '17–24°, a chill in the air', '12–19°, cold'],
    female_: ['A long wool coat, a chunky turtleneck, a pleated midi skirt with tights, ankle boots and a knitted scarf', 'A belted trench coat, a fine-knit jumper, straight trousers and loafers', 'A cropped jacket, a soft blouse, an A-line midi skirt and ballet flats', 'A puff-sleeve blouse tucked into a flared midi skirt, with strappy sandals', 'A sleeveless linen top, wide-leg linen trousers and woven slides', 'A flowing sundress, a wide straw hat and fine-strapped sandals', 'A quick-dry shirt dress, a light rain jacket tied at the waist and jelly sandals', 'A cropped rain jacket over a vest top, cropped trousers and short rain boots', 'A soft shirt, a satin midi skirt and Mary Janes', 'A ribbed top, an open cardigan, straight trousers and bow loafers', 'A short wool jacket, a turtleneck, a pleated skirt with tights and heeled ankle boots', 'A padded coat, a cable-knit jumper, straight jeans, fleece-lined boots and a beanie'],
    male_: ['A wool overcoat, a chunky turtleneck, wool trousers, brown Chelsea boots and a knitted scarf', 'A trench coat, a fine-knit jumper, straight chinos and leather derbies', 'A light zip jacket, an Oxford shirt, slim chinos and white leather trainers', 'A short-sleeved linen shirt, tapered chinos and canvas lace-ups', 'A loose linen T-shirt, linen shorts and leather fisherman sandals', 'A camp-collar shirt, light shorts, a bucket hat and chunky sport sandals', 'A quick-dry T-shirt, cargo shorts, a light rain jacket and trekking sandals', 'A hooded rain jacket, a T-shirt, cropped trousers and laced rubber boots', 'A shirt with the sleeves rolled, straight trousers and suede penny loafers', 'A knitted polo, an open cardigan, straight trousers and leather brogues', 'A short wool jacket, a turtleneck, slim trousers and lace-up work boots', 'A padded coat, a cable-knit jumper, straight jeans, hiking boots and a beanie']
  },
  de: {
    title: 'Was ziehe ich diesen Monat an', intro: 'Für jeden Monat ein Outfit, passend zum Wetter und in den Farben deines Sternzeichens.',
    female: 'Damen', male: 'Herren', chars: { 1: 'Helle Haut', 2: 'Braune Haut', 3: 'Gebräunte Haut', 4: 'Helle Haut' }, skin: 'Hautton', skins: { 1: 'Hell', 3: 'Gebräunt', 2: 'Braun' }, hairs: { 1: 'Dunkelbraun', 2: 'Schwarz', 3: 'Schwarz', 4: 'Blond' }, month: (m) => MONTHS_DE[m - 1],
    pal: (s) => 'Farben: ' + s, hair: 'Haarfarbe', hairReset: 'Wie gemalt', hairOther: 'Andere Farbe wählen',
    ai: 'Illustrationen von einer KI gemalt.', offline: 'Das Bild ließ sich nicht laden. Prüfe deine Verbindung und versuch es noch einmal.',
    modeMonth: 'Nach Monat', modeWx: 'Wetter selbst wählen', wxLbl: 'Wetter', tLbl: 'Temperatur',
    wx: { sun: 'Sonnig', cloud: 'Bewölkt, trüb', rain: 'Regen' },
    rain: { w1: { female: 'Langer Regenmantel mit Kapuze und Gürtel, Rollkragen, gerade Hose und hohe Gummistiefel', male: 'Wasserdichter Parka mit Kapuze, Strickpullover, gerade Hose und Gummistiefel' },
      w2: { female: 'Leichter wasserdichter Trenchcoat, feines Strickoberteil, Midirock und kurze Gummistiefel', male: 'Leichte Regenjacke mit Kapuze, langärmliges Hemd, Chinos und wasserdichte Sneaker' } },
    weather: ['10–17°, kalt, Nieselregen', '13–19°, feucht und schwül', '17–23°, Nieselregen', '21–28°, warm', '25–33°, es wird heiß', '27–35°, pralle Sonne', '27–34°, Regenschauer', '26–33°, viel Regen', '24–31°, Frühherbst', '20–27°, milder Herbst', '17–24°, frisch', '12–19°, kalt'],
    female_: ['Langer Wollmantel, grober Rollkragenpullover, Plisseerock mit Strumpfhose, Stiefeletten und Strickschal', 'Trenchcoat mit Gürtel, feiner Pullover, gerade Hose und Loafer', 'Kurze Jacke, weiche Bluse, A-Linien-Midirock und Ballerinas', 'Bluse mit Puffärmeln im ausgestellten Midirock, dazu Riemchensandalen', 'Ärmelloses Leinentop, weite Leinenhose und geflochtene Pantoletten', 'Fließendes Sommerkleid, breiter Strohhut und zarte Sandalen', 'Hemdblusenkleid aus schnell trocknendem Stoff, Regenjacke um die Taille und Jelly-Sandalen', 'Kurze Regenjacke über einem Top, verkürzte Hose und kurze Gummistiefel', 'Weiche Bluse, Satin-Midirock und Mary Janes', 'Geripptes Oberteil, offene Strickjacke, gerade Hose und Loafer mit Schleife', 'Kurze Wolljacke, Rollkragen, Faltenrock mit Strumpfhose und Stiefeletten mit Absatz', 'Steppmantel, Zopfstrickpullover, gerade Jeans, gefütterte Boots und Mütze'],
    male_: ['Wollmantel, grober Rollkragenpullover, Wollhose, braune Chelsea-Boots und Strickschal', 'Trenchcoat, feiner Pullover, gerade Chinos und Derbys aus Leder', 'Leichte Jacke mit Reißverschluss, Oxfordhemd, schmale Chinos und weiße Ledersneaker', 'Kurzärmliges Leinenhemd, Chinos und Schnürschuhe aus Canvas', 'Lockeres Leinenshirt, Leinenshorts und Fischersandalen aus Leder', 'Hemd mit Reverskragen, leichte Shorts, Fischerhut und Sportsandalen', 'Schnell trocknendes Shirt, Cargoshorts, leichte Regenjacke und Trekkingsandalen', 'Regenjacke mit Kapuze, T-Shirt, verkürzte Hose und Gummistiefel zum Schnüren', 'Hemd mit hochgekrempelten Ärmeln, gerade Hose und Penny Loafer aus Wildleder', 'Strickpolo, offene Strickjacke, gerade Hose und Budapester', 'Kurze Wolljacke, Rollkragen, schmale Hose und Schnürboots', 'Steppmantel, Zopfstrickpullover, gerade Jeans, Wanderschuhe und Mütze']
  }
};
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_DE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
/* ---- choosing the weather ----
   Instead of the month, the visitor may pick the weather and a temperature. There are no pictures
   of their own for that yet: each of the twelve cells is the month whose outfit fits it best, so
   the clothes, their caption and the picture always agree. (Cold or cool rain has no umbrella or
   rain gear among the twelve; new pictures for those cells are the next step.) */
const OUTFIT_WX = ['sun', 'cloud', 'rain'];
const OUTFIT_WX_ICON = { sun: '☀️', cloud: '⛅', rain: '🌧️' };
const OUTFIT_TEMPS = ['≤ 15°', '16–22°', '23–28°', '≥ 29°'];
/* [temperature band][sun, cloud, rain] -> month */
/* Cold and cool rain have outfits of their own (w1, w2: raincoat, rain boots), painted 2026-09-29. */
const OUTFIT_CELL = [[12, 12, 'w1'], [11, 2, 'w2'], [4, 10, 7], [6, 5, 8]];
/* The weather drawn over a month's picture: drizzle is a lighter rain. */
const OUTFIT_MONTH_WX = ['drizzle', 'cloud', 'drizzle', 'sun', 'sun', 'sun', 'rain', 'rain', 'sun', 'cloud', 'cloud', 'cloud'];
const outfitMonth = (st) => (st.mode === 'wx' ? OUTFIT_CELL[st.t][OUTFIT_WX.indexOf(st.w)] : st.m);
const outfitFx = (st) => (st.mode === 'wx' ? (st.w === 'rain' && st.t < 2 ? 'drizzle' : st.w) : OUTFIT_MONTH_WX[st.m - 1]);

/* ?v=6 refreshes the reviewed painted image sets. */
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
    mode: saved.mode === 'wx' ? 'wx' : 'month',
    w: OUTFIT_WX.indexOf(saved.w) > -1 ? saved.w : 'sun',
    t: typeof saved.t === 'number' && saved.t >= 0 && saved.t < 4 ? saved.t : 2
  };
  return st;
}
const outfitSave = (st) => store.set('nabu-outfit', { c: st.c, g: st.g, s: st.s, mode: st.mode, w: st.w, t: st.t });
const outfitName = (st) => OUTFIT_SIGNS[st.s] + '-' + outfitMonth(st) + '-' + st.g;

/* ---- the weather over the picture ----
   Rain and overcast are drawn on a canvas, not with CSS stripes: rain falls in three depths (far
   drops thin, faint and slow; near ones long and fast), slanted by the wind, splashing at the feet,
   under a cool grey light with mist near the ground; overcast is soft clouds with lit tops and grey
   undersides drifting at two speeds under a dim sky. About a hundred drops at most and a handful of
   cloud sprites drawn from an offscreen canvas, so a phone keeps up. It stops when the screen goes,
   pauses in a background tab, and draws one still frame for anyone who asked for less motion. */
let OF_WX = null, OF_FIG = null;
/* Where the figure is: the pictures have a flat pale background, so every pixel far from the
   corner colour is figure. Clouds are cut out there and so pass behind the character. */
function ofFigure(base) {
  const w = 225, h = Math.round(w * (base.naturalHeight || base.height) / (base.naturalWidth || base.width));
  const o = document.createElement('canvas'); o.width = w; o.height = h; const x = o.getContext('2d');
  x.drawImage(base, 0, 0, w, h);
  const im = x.getImageData(0, 0, w, h), d = im.data;
  const bg = [0, 1, 2].map((k) => (d[k] + d[(w - 1) * 4 + k] + d[(w * 3) * 4 + k] + d[(w * 3 + w - 1) * 4 + k]) / 4);
  for (let i = 0; i < d.length; i += 4) {
    const dist = Math.abs(d[i] - bg[0]) + Math.abs(d[i + 1] - bg[1]) + Math.abs(d[i + 2] - bg[2]);
    const a = Math.max(0, Math.min(1, (dist - 10) / 14));
    d[i] = d[i + 1] = d[i + 2] = 0; d[i + 3] = Math.round(a * 255);
  }
  x.putImageData(im, 0, 0);
  const g = document.createElement('canvas'); g.width = w; g.height = h; const gx = g.getContext('2d');
  gx.filter = 'blur(1.2px)'; gx.drawImage(o, 0, 0); gx.drawImage(o, 0, 0);
  OF_FIG = g;
}
function ofWeather(host, kind) {
  if (OF_WX) { cancelAnimationFrame(OF_WX.raf); OF_WX = null; }
  let cv = host.querySelector('canvas');
  if (kind !== 'rain' && kind !== 'drizzle' && kind !== 'cloud') { if (cv) cv.remove(); return; }
  if (!cv) { cv = document.createElement('canvas'); host.appendChild(cv); }
  const still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const size = () => { const r = host.getBoundingClientRect(); cv.width = Math.max(1, Math.round(r.width * dpr)); cv.height = Math.max(1, Math.round(r.height * dpr)); };
  size();
  const c = cv.getContext('2d'), rnd = (a, b) => a + Math.random() * (b - a);
  const light = kind === 'drizzle';
  const st = { raf: 0, kind, t0: performance.now(), last: performance.now() };
  OF_WX = st;
  /* rain */
  const wind = 0.16;
  const layers = kind === 'cloud' ? [] : [
    { n: light ? 34 : 60, len: [10, 16], w: 0.8, v: [520, 700], a: light ? 0.22 : 0.32 },
    { n: light ? 18 : 38, len: [18, 28], w: 1.1, v: [800, 1000], a: light ? 0.3 : 0.44 },
    { n: light ? 6 : 14, len: [30, 46], w: 1.5, v: [1150, 1400], a: light ? 0.36 : 0.55 }];
  const drops = [];
  layers.forEach((L, li) => { for (let i = 0; i < L.n; i++) drops.push({ li, x: Math.random(), y: Math.random(), l: rnd(L.len[0], L.len[1]), v: rnd(L.v[0], L.v[1]) }); });
  const splashes = [];
  /* clouds: small, flat sprites of soft puffs, lit from above with a grey underside. Every puff
     stays inside its sprite so no cloud shows a cut edge, and they keep to the strip of sky over
     the head rather than covering the figure. */
  const sprite = (w, h, dark) => {
    const o = document.createElement('canvas'); o.width = w; o.height = h; const x = o.getContext('2d');
    /* a dome: puffs grow toward the middle, and every one sits on the same flat base */
    for (let i = 0; i < 24; i++) {
      const u = rnd(-1, 1), px = w * (0.5 + u * 0.3), r = h * (0.36 - Math.abs(u) * 0.2) * rnd(0.8, 1.05);
      const py = h * 0.8 - r * rnd(0.55, 0.85);
      const g = x.createRadialGradient(px, py - r * 0.45, r * 0.05, px, py, r);
      g.addColorStop(0, dark ? 'rgba(236,237,243,0.92)' : 'rgba(255,255,255,0.95)');
      g.addColorStop(0.62, dark ? 'rgba(204,207,219,0.66)' : 'rgba(236,238,246,0.6)');
      g.addColorStop(1, 'rgba(190,194,208,0)');
      x.fillStyle = g; x.beginPath(); x.arc(px, py, r, 0, Math.PI * 2); x.fill();
    }
    return o;
  };
  const clouds = kind === 'cloud' ? [0, 1, 2, 3].map((i) => ({ s: sprite(360, 150, i < 2), x: i / 4 * 1.5 - 0.5 + rnd(-0.08, 0.08), y: i < 2 ? rnd(-0.04, 0.0) : rnd(0.03, 0.07), k: i < 2 ? rnd(0.62, 0.72) : rnd(0.46, 0.54), v: i < 2 ? 0.008 : 0.014, a: i < 2 ? 0.8 : 0.65 })) : [];
  function frame(now) {
    if (!host.isConnected || OF_WX !== st) return;
    if (document.hidden) { st.raf = requestAnimationFrame(frame); st.last = now; return; }
    if (cv.width !== Math.round(host.getBoundingClientRect().width * dpr)) size();
    const W = cv.width, H = cv.height, dt = Math.max(0, Math.min(0.05, (now - st.last) / 1000)); st.last = now;
    c.clearRect(0, 0, W, H);
    if (kind === 'cloud') {
      const sky = c.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, 'rgba(118,124,142,0.30)'); sky.addColorStop(0.45, 'rgba(140,146,160,0.12)'); sky.addColorStop(1, 'rgba(150,154,166,0.06)');
      c.fillStyle = sky; c.fillRect(0, 0, W, H);
      if (!st.layer || st.layer.width !== W || st.layer.height !== H) { st.layer = document.createElement('canvas'); st.layer.width = W; st.layer.height = H; }
      const lx = st.layer.getContext('2d'); lx.clearRect(0, 0, W, H);
      clouds.forEach((cl) => {
        if (!still) cl.x += cl.v * dt; if (cl.x > 1.05) cl.x = -cl.k - 0.05;
        const w = W * cl.k, h = w * cl.s.height / cl.s.width;
        lx.globalAlpha = cl.a; lx.drawImage(cl.s, cl.x * W, cl.y * H, w, h);
      });
      lx.globalAlpha = 1;
      if (OF_FIG) { lx.globalCompositeOperation = 'destination-out'; lx.drawImage(OF_FIG, 0, 0, W, H); lx.globalCompositeOperation = 'source-over'; }
      c.drawImage(st.layer, 0, 0);
    } else {
      const sky = c.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, light ? 'rgba(96,110,138,0.20)' : 'rgba(80,94,124,0.30)'); sky.addColorStop(0.6, 'rgba(110,122,146,0.08)'); sky.addColorStop(1, light ? 'rgba(210,216,228,0.22)' : 'rgba(200,208,224,0.30)');
      c.fillStyle = sky; c.fillRect(0, 0, W, H);
      c.lineCap = 'round';
      drops.forEach((d) => {
        const L = layers[d.li];
        if (!still) { d.y += d.v * dt * dpr / H; d.x += d.v * wind * dt * dpr / W; }
        if (d.y > 1.02) {
          if (d.li === 2 || (d.li === 1 && Math.random() < 0.4)) splashes.push({ x: d.x * W, y: H * rnd(0.9, 0.985), t: 0 });
          d.y = rnd(-0.15, -0.02); d.x = Math.random() * 1.1 - 0.1;
        }
        const x = d.x * W, y = d.y * H, len = d.l * dpr;
        const g = c.createLinearGradient(x - len * wind, y - len, x, y);
        g.addColorStop(0, 'rgba(70,86,120,0)'); g.addColorStop(0.7, 'rgba(78,94,128,' + (L.a * 0.8) + ')'); g.addColorStop(1, 'rgba(96,112,146,' + L.a + ')');
        c.strokeStyle = g; c.lineWidth = L.w * dpr;
        c.beginPath(); c.moveTo(x - len * wind, y - len); c.lineTo(x, y); c.stroke();
      });
      for (let i = splashes.length - 1; i >= 0; i--) {
        const sp = splashes[i]; sp.t += dt;
        if (sp.t > 0.35) { splashes.splice(i, 1); continue; }
        const k = sp.t / 0.35;
        c.strokeStyle = 'rgba(84,100,134,' + (0.5 * (1 - k)) + ')'; c.lineWidth = 1 * dpr;
        c.beginPath(); c.ellipse(sp.x, sp.y, (3 + 9 * k) * dpr, (1 + 2.5 * k) * dpr, 0, 0, Math.PI * 2); c.stroke();
      }
    }
    if (!still) st.raf = requestAnimationFrame(frame);
  }
  st.raf = requestAnimationFrame(frame);
}

function outfitLoad(src) {
  return new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
}

function renderOutfit() {
  const S = T(), X = outfitTxt(), m = $('#main'), st = outfitState();
  const here = navStillHere();
  let base = null, token = 0;
  const chip = (k, v, label, on) => '<button class="chip' + (on ? ' on' : '') + '" data-ok="' + k + '" data-ov="' + v + '" aria-pressed="' + on + '">' + esc(label) + '</button>';

  const swatch = (k, v, label, on, color) => chip(k, v, label, on).replace('>' + esc(label), '><span class="ofswatch" aria-hidden="true" style="background:' + color + '"></span>' + esc(label));

  function chrome() {
    const pal = OUTFIT_PAL[st.s];
    $('#ofChips').innerHTML = '<div class="ofrow">' + chip('g', 'female', X.female, st.g === 'female') + chip('g', 'male', X.male, st.g === 'male')
      + '</div>'
      + '<div class="ofrow ofcolors" role="group" aria-label="' + esc(X.skin) + '"><span class="oflabel">' + esc(X.skin) + '</span>'
      + ['1', '3', '2'].map((c) => swatch('skin', c, X.skins[c], outfitSkin(st.c) === c, { 1: '#f4d9c7', 3: '#c99462', 2: '#815437' }[c])).join('') + '</div>'
      + '<div class="ofrow ofcolors" role="group" aria-label="' + esc(X.hair) + '"><span class="oflabel">' + esc(X.hair) + '</span>'
      + outfitHairChoices(st.c).map((c) => swatch('c', c, X.hairs[c], st.c === c, { 1: '#44312b', 2: '#202023', 3: '#202023', 4: '#d7b06a' }[c])).join('') + '</div>'
      + '<div class="ofrow ofscroll">' + S.zodiac.map((z, i) => chip('s', i, z, st.s === i)).join('') + '</div>'
      + '<div class="ofrow ofmode">' + chip('mode', 'month', '📅 ' + X.modeMonth, st.mode === 'month') + chip('mode', 'wx', '🌤️ ' + X.modeWx, st.mode === 'wx') + '</div>'
      + (st.mode === 'wx'
        ? '<div class="ofrow" role="group" aria-label="' + esc(X.wxLbl) + '">' + OUTFIT_WX.map((w) => chip('w', w, OUTFIT_WX_ICON[w] + ' ' + X.wx[w], st.w === w)).join('') + '</div>'
          + '<div class="ofrow" role="group" aria-label="' + esc(X.tLbl) + '">' + OUTFIT_TEMPS.map((t, i) => chip('t', i, '🌡️ ' + t, st.t === i)).join('') + '</div>'
        : '<div class="ofrow ofscroll">' + MONTHS_EN.map((_, i) => chip('m', i + 1, X.month(i + 1), st.m === i + 1)).join('') + '</div>');
    const mo = outfitMonth(st);
    $('#ofCap').innerHTML = '<h2>' + esc(S.zodiac[st.s]) + ' · ' + esc(st.mode === 'wx' ? OUTFIT_WX_ICON[st.w] + ' ' + X.wx[st.w] + ', ' + OUTFIT_TEMPS[st.t] : X.month(st.m)) + '</h2>'
      + (st.mode === 'wx' ? '' : '<p class="faint">' + esc(X.weather[st.m - 1]) + '</p>')
      + '<p>' + esc(typeof mo === 'string' ? X.rain[mo][st.g] : X[st.g + '_'][mo - 1]) + '</p>'
      + '<div class="ofpal" aria-label="' + esc(X.pal(S.zodiac[st.s])) + '">' + pal.map((c) => '<span style="background:' + c + '"></span>').join('')
      + '<span class="faint">' + esc(X.pal(S.zodiac[st.s])) + '</span></div>';
    /* The rows are redrawn on every tap, which scrolls them back to the start:
       bring the chosen sign and month back into view. */
    document.querySelectorAll('#ofChips .ofscroll').forEach((row) => {
      const on = row.querySelector('.on');
      if (on) row.scrollLeft = on.offsetLeft - row.offsetLeft - (row.clientWidth - on.offsetWidth) / 2;
    });
  }
  /* Rain, sun or cloud drawn over the picture, from the chosen weather or the month's. */
  function weatherFx() { const fx = $('#ofWx'); if (fx) { fx.className = 'ofwx wx-' + outfitFx(st); ofWeather(fx, outfitFx(st)); } }
  function paint() {
    const cv = $('#ofCanvas'); if (!cv || !base) return;
    cv.width = base.naturalWidth; cv.height = base.naturalHeight;
    cv.getContext('2d').drawImage(base, 0, 0);
    ofFigure(base);
    /* The two characters were painted at slightly different heights; the frame takes the picture's own shape. */
    cv.parentNode.style.aspectRatio = cv.width + '/' + cv.height;
    cv.classList.remove('dim');
  }
  async function fetchAndPaint() {
    const my = ++token, dir = 'outfit/' + st.c + '/', n = outfitName(st);
    const cv = $('#ofCanvas'); if (cv) cv.classList.add('dim');
    try {
      const got = await outfitLoad(dir + n + '.jpg?v=6');
      if (my !== token || !here()) return;
      base = got;
      const er = $('#ofErr'); if (er) er.textContent = '';
      paint();
    } catch (e) {
      if (my !== token || !here()) return;
      const er = $('#ofErr'); if (er) er.textContent = X.offline;
      if (cv) cv.classList.remove('dim');
    }
  }

  m.innerHTML = backLink('#/play', S.actTitle) + '<div id="of"><h1 style="margin-bottom:6px">' + esc(X.title) + '</h1><p class="muted">' + esc(X.intro) + '</p>'
    + '<div id="ofChips"></div>'
    + '<div class="ofstage"><canvas id="ofCanvas" class="dim" role="img" aria-label="' + esc(X.title) + '"></canvas><div class="ofwx" id="ofWx" aria-hidden="true"></div></div>'
    + '<p class="err" id="ofErr" role="status"></p>'
    + '<div id="ofCap" class="ofcap"></div>'
    + '<p class="faint" style="margin-top:18px">' + esc(X.ai) + '</p></div>';
  chrome(); weatherFx(); fetchAndPaint();

  const root = $('#of');
  root.addEventListener('click', (e) => {
    const b = e.target.closest('[data-ok]'); if (!b || b.type === 'color') return;
    const k = b.dataset.ok, v = b.dataset.ov;
    if (k === 'skin') st.c = v === '1' && outfitSkin(st.c) === '1' ? st.c : v;
    else st[k] = (k === 's' || k === 'm' || k === 't') ? Number(v) : v;
    outfitSave(st); chrome(); weatherFx(); fetchAndPaint();
  });
}
ROUTES.outfit = { nav: 'play', render: renderOutfit };
