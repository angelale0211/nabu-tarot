/* ============================ the luck companions ============================
   Four small animals, each one looking after a different corner of life: love,
   work, study and money. You feed one every day and you may say a wish over it
   once a day; it answers with a short blessing from its own corner.

   Care is the whole idea. Coming back every day, feeding it something good,
   dressing it, giving it a proper home: each of those fills the luck bar a
   little further, and the app shows exactly how much each one is worth. One
   companion, plain food and a grass mat are free. Nabu Tarot Plus opens all
   four companions, the good food, the homes and the charms.

   Everything is kept on the device, like the diary and the wish jar. The
   blessings are written to comfort and to give the day a shape, the way a
   drawn card does; nothing here promises an outcome. */

const PET_KINDS = ['cat', 'fox', 'bunny', 'turtle'];
const PET_NAMES = {
  cat: { vi: 'Mèo Trăng', en: 'Moon cat' },
  fox: { vi: 'Cáo Sao', en: 'Star fox' },
  bunny: { vi: 'Thỏ Mây', en: 'Cloud bunny' },
  turtle: { vi: 'Rùa Ngọc', en: 'Jade turtle' }
};

/* ---- what each one looks after ---- */
const PET_LUCK = { cat: 'love', fox: 'career', bunny: 'study', turtle: 'money' };
const LUCKS = {
  love: {
    id: 'love', sym: '💗', ink: '#D3557E', aura: '#FBD3E1',
    name: { vi: 'Tình duyên', en: 'Love' },
    line: { vi: 'Mèo Trăng ngồi canh chuyện tình cảm và giữ cho lòng bạn ấm.', en: 'The moon cat sits with matters of the heart and keeps you warm.' }
  },
  career: {
    id: 'career', sym: '⭐', ink: '#B98420', aura: '#FBE7BE',
    name: { vi: 'Sự nghiệp', en: 'Work' },
    line: { vi: 'Cáo Sao đi trước một bước để mở đường cho công việc của bạn.', en: 'The star fox walks a step ahead and opens the way at work.' }
  },
  study: {
    id: 'study', sym: '📖', ink: '#4173B8', aura: '#CFE0F7',
    name: { vi: 'Học hành', en: 'Study' },
    line: { vi: 'Thỏ Mây thức cùng bạn qua những trang sách khó nhất.', en: 'The cloud bunny stays up with you through the hardest pages.' }
  },
  money: {
    id: 'money', sym: '🪙', ink: '#2E8A68', aura: '#C6E8D9',
    name: { vi: 'Tiền tài', en: 'Money' },
    line: { vi: 'Rùa Ngọc đi chậm mà chắc, giữ lại những gì bạn đã có.', en: 'The jade turtle moves slowly and keeps what you already have.' }
  }
};
const petLuck = (kind) => LUCKS[PET_LUCK[kind] || 'love'];

/* ---- what they say when you make a wish over them ----
   Six lines each, so the answer feels like it belongs to that companion. */
const PET_BLESS = {
  love: [
    { vi: 'Hôm nay có người nghĩ về bạn nhiều hơn bạn tưởng.', en: 'Someone is thinking of you more than you would guess today.' },
    { vi: 'Bạn không cần chứng minh điều gì cả. Người hợp sẽ ở lại.', en: 'You do not need to prove anything. The right person stays.' },
    { vi: 'Giữ lòng mình mềm, nhưng giữ ranh giới thật rõ.', en: 'Keep your heart soft and your limits clear.' },
    { vi: 'Một cuộc gặp rất bình thường tuần này có thể ấm hơn bạn nghĩ.', en: 'An ordinary meeting this week may turn out warmer than you expect.' },
    { vi: 'Điều bạn đang đợi chưa mất, nó chỉ đang đi đường vòng.', en: 'What you are waiting for is not lost. It is taking the long way.' },
    { vi: 'Nói ra một câu thật lòng hôm nay sẽ nhẹ hơn giữ nó thêm một tuần.', en: 'One honest sentence today weighs less than another week of silence.' }
  ],
  career: [
    { vi: 'Việc bạn làm lặng lẽ hôm nay sẽ có người nhìn thấy.', en: 'The work you do quietly today is seen by someone.' },
    { vi: 'Đừng nhận thêm phần việc vốn không thuộc về bạn.', en: 'Do not take on work that was never yours.' },
    { vi: 'Một cơ hội nhỏ đang mở ra. Hãy trả lời sớm.', en: 'A small opening is there. Answer it early.' },
    { vi: 'Bạn đang làm tốt hơn chính bạn của năm ngoái.', en: 'You are doing better than you were a year ago.' },
    { vi: 'Hôm nay hợp để hỏi, chưa hợp để hứa.', en: 'A good day to ask. Not yet a day to promise.' },
    { vi: 'Ở một nơi bạn không có mặt, tên bạn được nhắc đến một cách tử tế.', en: 'Somewhere you are not, your name is being spoken kindly.' }
  ],
  study: [
    { vi: 'Học ít mà đều còn hơn học thật nhiều trong một lần.', en: 'A little every day beats everything at once.' },
    { vi: 'Phần bạn thấy khó nhất chính là phần sắp thông.', en: 'The part that feels hardest is the part about to open.' },
    { vi: 'Ghi lại ba điều bạn vừa hiểu, chúng sẽ ở lại lâu hơn.', en: 'Write down three things you just understood. They will stay longer.' },
    { vi: 'Đừng so tốc độ với người khác. Bạn đang đi đúng đường của mình.', en: 'Do not measure your speed against anyone. You are on your own road.' },
    { vi: 'Một câu hỏi bạn ngại hỏi sẽ mở ra nhiều thứ hơn bạn tưởng.', en: 'The question you are shy to ask opens more than you think.' },
    { vi: 'Nghỉ đúng lúc cũng là một phần của việc học.', en: 'Resting at the right moment is part of studying.' }
  ],
  money: [
    { vi: 'Một khoản nhỏ quay về đúng lúc bạn cần đến nó.', en: 'A small amount comes back just when you need it.' },
    { vi: 'Hôm nay hợp để giữ tiền hơn là để tiêu tiền.', en: 'Today suits keeping money more than spending it.' },
    { vi: 'Đếm lại những gì bạn đang có trước khi đi tìm thêm.', en: 'Count what you already have before looking for more.' },
    { vi: 'Một cơ hội kiếm thêm đến từ một người quen cũ.', en: 'A chance to earn more comes through someone you already know.' },
    { vi: 'Đừng quyết định chuyện lớn khi trong người đang mệt.', en: 'Do not make a large decision while you are tired.' },
    { vi: 'Tiền vào chậm nhưng chắc. Cứ giữ nhịp của bạn.', en: 'Money comes in slowly and steadily. Keep your rhythm.' }
  ]
};

/* ---- coats, food, homes and charms ----
   Four coats anyone can use, four more with Plus. Two plain foods for
   everyone, six good ones with Plus. The mat is free, the three real homes
   are not. Every paid item says what it adds, so nothing is hidden. */
const PET_COATS = [
  { id: 'cream', pro: false, body: '#F3DCC4', dark: '#D9BC9B', ink: '#5B4632' },
  { id: 'lilac', pro: false, body: '#D9C9F2', dark: '#BCA6E4', ink: '#4A3670' },
  { id: 'rose', pro: false, body: '#F6C6D4', dark: '#E3A2B6', ink: '#6A2F45' },
  { id: 'sky', pro: false, body: '#BFD8F5', dark: '#9CBCE6', ink: '#28456E' },
  { id: 'mint', pro: true, body: '#B8E6D0', dark: '#8FCDB2', ink: '#1E5340' },
  { id: 'ember', pro: true, body: '#F7C89A', dark: '#E3A66C', ink: '#6B3A16' },
  { id: 'midnight', pro: true, body: '#8E86C9', dark: '#6E64A8', ink: '#F3EEFF' },
  { id: 'gold', pro: true, body: '#EDD08A', dark: '#D4B25F', ink: '#5A4415' }
];
const PET_FOODS = [
  { id: 'rice', pro: false, add: 0, sym: '🍚', name: { vi: 'Cơm trắng', en: 'Plain rice' } },
  { id: 'carrot', pro: false, add: 0, sym: '🥕', name: { vi: 'Cà rốt vườn', en: 'Garden carrot' } },
  { id: 'moon', pro: true, add: 2, sym: '🍡', name: { vi: 'Bánh trôi ngũ sắc', en: 'Five-colour dumplings' } },
  { id: 'fish', pro: true, add: 2, sym: '🐟', name: { vi: 'Cá nướng lá chuối', en: 'Fish in banana leaf' } },
  { id: 'honey', pro: true, add: 2, sym: '🍯', name: { vi: 'Mật hoa rừng', en: 'Wild flower honey' } },
  { id: 'berry', pro: true, add: 2, sym: '🍓', name: { vi: 'Dâu sương sớm', en: 'Morning-dew berries' } },
  { id: 'cake', pro: true, add: 2, sym: '🍥', name: { vi: 'Bánh trăng rằm', en: 'Full-moon cake' } },
  { id: 'star', pro: true, add: 2, sym: '🧁', name: { vi: 'Bánh kem sao', en: 'Star cream cake' } }
];
const PET_HOMES = [
  { id: 'mat', pro: false, add: 0, name: { vi: 'Chiếu cỏ', en: 'Grass mat' } },
  { id: 'cloud', pro: true, add: 12, name: { vi: 'Nhà mây', en: 'Cloud cottage' } },
  { id: 'shrine', pro: true, add: 12, name: { vi: 'Đền nhỏ', en: 'Little shrine' } },
  { id: 'moon', pro: true, add: 12, name: { vi: 'Vườn trăng', en: 'Moon garden' } }
];
const PET_WEARS = [
  { id: 'none', pro: false, add: 0, name: { vi: 'Để mộc', en: 'Nothing' } },
  { id: 'scarf', pro: true, add: 10, name: { vi: 'Khăn lụa', en: 'Silk scarf' } },
  { id: 'bell', pro: true, add: 10, name: { vi: 'Chuông vàng', en: 'Gold bell' } },
  { id: 'crown', pro: true, add: 10, name: { vi: 'Vòng hoa', en: 'Flower crown' } },
  { id: 'hat', pro: true, add: 10, name: { vi: 'Nón trăng', en: 'Moon hat' } }
];
const PET_FREE_MAX = 1;
const pickFrom = (set, id, free) => {
  const found = set.filter((x) => x.id === id)[0] || set[0];
  return (found.pro && !proOn()) ? (free ? set[0] : found) : found;
};

/* ---- the little household ----
   Kept as a list. Before v98 there was only ever one companion, saved under
   its own key, so that one is carried across the first time this runs. */
const PETS = {
  all() {
    let list = store.get('nabu-pets', null);
    if (!Array.isArray(list)) {
      const old = store.get('nabu-pet', null);
      list = old && PET_KINDS.indexOf(old.kind) > -1 ? [old] : [];
      if (list.length) store.set('nabu-pets', list);
    }
    return list.filter((p) => p && PET_KINDS.indexOf(p.kind) > -1);
  },
  save(list) { store.set('nabu-pets', list); },
  put(p) {
    const list = this.all().filter((x) => x.kind !== p.kind);
    list.push(p); this.save(list); return p;
  },
  drop(kind) { this.save(this.all().filter((p) => p.kind !== kind)); },
  one(kind) { return this.all().filter((p) => p.kind === kind)[0] || null; },
  /* How many may be kept: one, or all of them with Plus. */
  cap() { return proOn() ? PET_KINDS.length : PET_FREE_MAX; },
  room() { return this.all().length < this.cap(); },
  fresh(kind) { return { kind: kind, coat: 'cream', wear: 'none', home: 'mat', food: 'rice', name: '', streak: 0, meals: 0, treats: 0, xp: 0, last: 0, fed: '', pray: '', bless: 0 }; },
  /* Anything paid falls back to the free version the day Plus lapses, so a
     lapsed subscription never leaves a companion looking broken. */
  coat(p) { return pickFrom(PET_COATS, p && p.coat, true); },
  wear(p) { return pickFrom(PET_WEARS, p && p.wear, true); },
  home(p) { return pickFrom(PET_HOMES, p && p.home, true); },
  food(p) { return pickFrom(PET_FOODS, p && p.food, true); },
  fedToday(p) { return !!p && p.fed === isoDate(new Date()); },
  prayedToday(p) { return !!p && p.pray === isoDate(new Date()); },
  /* Everyone may feed a companion several times a day. The wait between two
     meals is six hours, or two hours with Plus. */
  gap() { return (proOn() ? 2 : 6) * 3600000; },
  waitLeft(p) { return Math.max(0, (Number(p && p.last) || 0) + this.gap() - Date.now()); },
  canFeed(p) { return this.waitLeft(p) <= 0; },
  /* What one meal is worth, itemised, because the card shows the list and the
     list is what makes the case for feeding it something good. */
  gain(p) {
    const days = Math.min(10, ((Number(p.streak) || 0) - 1) * 2);
    const food = this.food(p).add ? 8 : 0;
    const wear = this.wear(p).add ? 4 : 0;
    const home = this.home(p).add ? 5 : 0;
    const coat = this.coat(p).pro ? 3 : 0;
    return { meal: 10, days: Math.max(0, days), food: food, wear: wear, home: home, coat: coat,
      total: 10 + Math.max(0, days) + food + wear + home + coat };
  },
  /* A streak counts one day at a time, however many meals are given that day.
     Feeding pays experience and a few coins; crossing a level pays more. */
  feed(p) {
    const today = isoDate(new Date());
    const y = new Date(); y.setDate(y.getDate() - 1);
    if (p.fed !== today) p.streak = p.fed === isoDate(y) ? (Number(p.streak) || 0) + 1 : 1;
    const before = petLevel(p.xp);
    const good = !!this.food(p).add;
    p.xp = (Number(p.xp) || 0) + this.gain(p).total;
    p.fed = today;
    p.last = Date.now();
    p.meals = (Number(p.meals) || 0) + 1;
    if (good) p.treats = (Number(p.treats) || 0) + 1;
    const coins = BANK.earnDay(good ? 5 : 2);
    const after = petLevel(p.xp);
    let up = 0;
    for (let lv = before + 1; lv <= after; lv++) { BANK.earn(levelCoins(lv)); up += levelCoins(lv); }
    BANK.mark(after);
    this.put(p);
    return { coins: coins, up: up, from: before, to: after };
  },
  /* One wish a day, and the answer stays on the card until tomorrow. */
  pray(p) {
    const pool = PET_BLESS[petLuck(p.kind).id];
    p.pray = isoDate(new Date());
    p.bless = Math.floor(Math.random() * pool.length);
    p.xp = (Number(p.xp) || 0) + 6;
    BANK.mark(petLevel(p.xp));
    return this.put(p);
  },
  blessing(p) { return PET_BLESS[petLuck(p.kind).id][Number(p.bless) || 0]; },
  level(p) { return petLevel(p && p.xp); },
  step(p) { return petStep(p && p.xp); }
};
/* The older name, kept because the tree and the activities list use it. */
const PET = PETS;

/* ---- the four homes ----
   Drawn behind the companion, filling the width of the stage. */
function petHomeSVG(id) {
  const open = '<svg viewBox="0 0 240 150" class="pethome" aria-hidden="true">';
  if (id === 'cloud') {
    return open
      + '<circle cx="60" cy="46" r="26" fill="#EDE6FB"/><circle cx="96" cy="34" r="32" fill="#F5F0FF"/><circle cx="140" cy="40" r="28" fill="#EDE6FB"/><circle cx="178" cy="52" r="22" fill="#F5F0FF"/>'
      + '<path d="M56 96 L120 52 L184 96 Z" fill="#D9C9F2"/><rect x="72" y="94" width="96" height="46" rx="8" fill="#F3EAFE" stroke="#C7B4EC" stroke-width="2"/>'
      + '<rect x="104" y="110" width="32" height="30" rx="6" fill="#C9B0EA"/>'
      + '<circle cx="88" cy="112" r="7" fill="#FFF7EE" stroke="#C7B4EC" stroke-width="1.6"/><circle cx="152" cy="112" r="7" fill="#FFF7EE" stroke="#C7B4EC" stroke-width="1.6"/>'
      + '<ellipse cx="120" cy="146" rx="94" ry="6" fill="#C9A5D8" opacity=".25"/></svg>';
  }
  if (id === 'shrine') {
    return open
      + '<path d="M28 62 L120 26 L212 62 Z" fill="#B0483F"/><rect x="34" y="62" width="172" height="10" rx="4" fill="#8E3A33"/>'
      + '<rect x="52" y="72" width="136" height="66" rx="6" fill="#F0DFC8" stroke="#C6A98A" stroke-width="2"/>'
      + '<rect x="96" y="86" width="48" height="52" rx="4" fill="#8E3A33"/><circle cx="120" cy="104" r="10" fill="#E5BE5E"/>'
      + '<rect x="60" y="72" width="10" height="66" fill="#B0483F"/><rect x="170" y="72" width="10" height="66" fill="#B0483F"/>'
      + '<g fill="#E5BE5E"><circle cx="44" cy="52" r="4"/><circle cx="196" cy="52" r="4"/></g>'
      + '<path d="M74 96 q10 -8 20 0" stroke="#C6A98A" stroke-width="2" fill="none"/><path d="M146 96 q10 -8 20 0" stroke="#C6A98A" stroke-width="2" fill="none"/>'
      + '<ellipse cx="120" cy="146" rx="94" ry="6" fill="#C9A5D8" opacity=".25"/></svg>';
  }
  if (id === 'moon') {
    let stars = '';
    for (let i = 0; i < 16; i++) stars += '<circle class="twinkle" cx="' + (14 + (i * 31) % 214) + '" cy="' + (12 + (i * 43) % 76) + '" r="' + (1 + (i % 3) * 0.6) + '" fill="#FFF3C4" style="animation-delay:' + (i * 190) + 'ms"/>';
    return open
      + '<rect x="0" y="0" width="240" height="150" rx="16" fill="#2E2756"/>' + stars
      + '<path d="M188 40 A24 24 0 1 0 188 88 A19 19 0 1 1 188 40 Z" fill="#FFE9A8"/>'
      + '<path d="M0 118 q60 -22 120 -4 q60 18 120 -6 L240 150 L0 150 Z" fill="#4A3E80"/>'
      + '<g fill="#8E7FD6"><ellipse cx="42" cy="122" rx="16" ry="9"/><ellipse cx="196" cy="126" rx="14" ry="8"/></g>'
      + '<g fill="#F7A9C6"><circle cx="30" cy="112" r="4"/><circle cx="70" cy="118" r="3.4"/><circle cx="206" cy="116" r="3.6"/></g></svg>';
  }
  return open
    + '<ellipse cx="120" cy="126" rx="92" ry="20" fill="#CFE3C4"/><ellipse cx="120" cy="126" rx="92" ry="20" fill="none" stroke="#AECFA0" stroke-width="2"/>'
    + '<g stroke="#AECFA0" stroke-width="2" stroke-linecap="round"><path d="M44 120 v10 M64 116 v12 M176 116 v12 M196 120 v10"/></g>'
    + '<g fill="#F7A9C6"><circle cx="52" cy="112" r="4"/><circle cx="188" cy="114" r="4"/></g></svg>';
}

/* ---- the four creatures ----
   The same body plan, so they read as one family: a round body, a round head,
   a face, a charm at the throat in the colour of the luck they carry, and one
   feature that tells them apart. Drawn on a 120x120 square. */
function petSVG(kind, coat, mood, wear) {
  const c = coat || PET_COATS[0];
  const luck = petLuck(kind);
  const happy = mood === 'happy';
  const eye = (x) => happy
    ? '<path d="M' + (x - 5) + ' 54 q5 -6 10 0" fill="none" stroke="' + c.ink + '" stroke-width="2.6" stroke-linecap="round"/>'
    : '<ellipse cx="' + x + '" cy="54" rx="3.4" ry="4.4" fill="' + c.ink + '"/><circle cx="' + (x + 1.2) + '" cy="52.2" r="1.2" fill="#fff"/>';
  const face = eye(50) + eye(70)
    + '<path d="M56 64 q4 4 8 0" fill="none" stroke="' + c.ink + '" stroke-width="2.4" stroke-linecap="round"/>'
    + '<ellipse cx="40" cy="62" rx="5" ry="3.2" fill="#F2A9BE" opacity=".55"/>'
    + '<ellipse cx="80" cy="62" rx="5" ry="3.2" fill="#F2A9BE" opacity=".55"/>';
  let ears = '', extra = '', behind = '', overBody = '', feet = true;
  if (kind === 'cat') {
    ears = '<path d="M36 32 L38 10 L54 24 Z" fill="' + c.body + '"/><path d="M84 32 L82 10 L66 24 Z" fill="' + c.body + '"/>'
      + '<path d="M40 30 L41 18 L50 26 Z" fill="' + c.dark + '"/><path d="M80 30 L79 18 L70 26 Z" fill="' + c.dark + '"/>';
    behind = '<path d="M86 96 q24 -4 18 -26" fill="none" stroke="' + c.dark + '" stroke-width="8" stroke-linecap="round"/>';
    extra = '<path d="M28 56 h-11 M28 61 h-12 M92 56 h11 M92 61 h12" stroke="' + c.dark + '" stroke-width="1.4" stroke-linecap="round"/>';
  } else if (kind === 'fox') {
    ears = '<path d="M34 34 L33 8 L56 24 Z" fill="' + c.body + '"/><path d="M86 34 L87 8 L64 24 Z" fill="' + c.body + '"/>'
      + '<path d="M38 30 L38 16 L50 25 Z" fill="' + c.ink + '" opacity=".4"/><path d="M82 30 L82 16 L70 25 Z" fill="' + c.ink + '" opacity=".4"/>';
    behind = '<path d="M84 98 q28 4 22 -22 q-5 15 -22 13 Z" fill="' + c.dark + '"/><path d="M102 80 q7 -5 5 -12" stroke="#FFF7EE" stroke-width="6" fill="none" stroke-linecap="round"/>';
    extra = '<path d="M44 74 q16 7 32 0" fill="none" stroke="' + c.dark + '" stroke-width="2" opacity=".45"/>';
  } else if (kind === 'bunny') {
    ears = '<ellipse cx="47" cy="18" rx="7.5" ry="21" fill="' + c.body + '" transform="rotate(-8 47 18)"/>'
      + '<ellipse cx="73" cy="18" rx="7.5" ry="21" fill="' + c.body + '" transform="rotate(8 73 18)"/>'
      + '<ellipse cx="47" cy="20" rx="3.6" ry="14" fill="#F7C7D6" transform="rotate(-8 47 20)"/>'
      + '<ellipse cx="73" cy="20" rx="3.6" ry="14" fill="#F7C7D6" transform="rotate(8 73 20)"/>';
    behind = '<circle cx="92" cy="94" r="9" fill="#FFF7EE"/>';
  } else {
    // The turtle is a shell with a head coming out of it: the flippers and the
    // tail are drawn first so the shell sits over them, and the charm is set
    // into the shell rather than hung at the throat.
    feet = false;
    behind = '<ellipse cx="26" cy="100" rx="12" ry="6.5" fill="' + c.dark + '" transform="rotate(-16 26 100)"/>'
      + '<ellipse cx="94" cy="100" rx="12" ry="6.5" fill="' + c.dark + '" transform="rotate(16 94 100)"/>'
      + '<path d="M92 96 q14 -1 18 6 q-9 5 -18 -1 Z" fill="' + c.dark + '"/>';
    overBody = '<path d="M24 106 A36 32 0 0 1 96 106 Z" fill="#7FC9A8"/>'
      + '<ellipse cx="60" cy="106" rx="36" ry="5" fill="#4E9C7C"/>'
      + '<path d="M24 106 A36 32 0 0 1 96 106" fill="none" stroke="#4E9C7C" stroke-width="2.4"/>'
      + '<g fill="none" stroke="#4E9C7C" stroke-width="1.6" opacity=".9">'
      + '<path d="M60 74 L60 106 M40 80 L48 106 M80 80 L72 106 M27 95 L34 106 M93 95 L86 106"/>'
      + '<path d="M34 92 Q60 82 86 92"/></g>'
      + '<path d="M40 100 q20 -7 40 0" fill="none" stroke="#B9E8D2" stroke-width="2" opacity=".7"/>';
    extra = '<path d="M36 46 q6 -8 14 -9 M84 46 q-6 -8 -14 -9" fill="none" stroke="' + c.dark + '" stroke-width="1.8" stroke-linecap="round" opacity=".7"/>';
  }
  // The charm at the throat says which luck this one carries.
  const charmY = kind === 'turtle' ? 92 : 80;
  let neck = (kind === 'turtle' ? '' : '<path d="M42 74 q18 9 36 0" fill="none" stroke="' + luck.ink + '" stroke-width="2.4" stroke-linecap="round" opacity=".9"/>')
    + '<circle cx="60" cy="' + charmY + '" r="6.4" fill="' + luck.ink + '"/><circle cx="60" cy="' + charmY + '" r="3" fill="' + luck.aura + '"/>';
  let worn = '';
  const w = (wear && wear.id) || 'none';
  if (w === 'scarf') {
    neck = '<path d="M38 72 q22 14 44 0 q2 8 -4 12 q-18 9 -36 0 q-6 -4 -4 -12 Z" fill="#E1607F"/>'
      + '<path d="M74 82 q10 8 6 20 q-8 2 -12 -4 Z" fill="#C94C6C"/>';
  } else if (w === 'bell') {
    neck += '<circle cx="60" cy="80" r="6.4" fill="#E5BE5E" stroke="#B9913B" stroke-width="1.4"/>'
      + '<path d="M55 80 h10" stroke="#B9913B" stroke-width="1.4"/><circle cx="60" cy="84" r="1.6" fill="#8A6B22"/>';
  } else if (w === 'crown') {
    const bud = (x, y, col) => [0, 72, 144, 216, 288].map((a) => '<ellipse cx="' + x + '" cy="' + (y - 3.4) + '" rx="2.2" ry="3.4" fill="' + col + '" transform="rotate(' + a + ' ' + x + ' ' + y + ')"/>').join('') + '<circle cx="' + x + '" cy="' + y + '" r="1.6" fill="#FFE9A8"/>';
    worn = '<path d="M34 36 Q60 22 86 36" fill="none" stroke="#8FBF7F" stroke-width="2.4"/>'
      + bud(38, 35, '#F7A9C6') + bud(52, 28, '#FFF3C4') + bud(68, 28, '#F7A9C6') + bud(82, 35, '#C9B0EA');
  } else if (w === 'hat') {
    worn = '<ellipse cx="60" cy="34" rx="30" ry="7" fill="#E8CFA0"/><path d="M38 34 L60 6 L82 34 Z" fill="#F0DFC8" stroke="#C6A98A" stroke-width="1.6"/>'
      + '<path d="M46 28 q14 -6 28 0" fill="none" stroke="#C6A98A" stroke-width="1.4"/>'
      + '<path d="M60 8 A9 9 0 1 0 60 26 A7 7 0 1 1 60 8 Z" fill="#E5BE5E"/>';
  }
  // A turtle's head is small and comes out over the shell, so its head and
  // face are drawn smaller and higher than the rest of the family's.
  const head = '<ellipse cx="60" cy="56" rx="29" ry="26" fill="' + c.body + '"/>' + face + extra;
  const headed = kind === 'turtle'
    ? '<g transform="translate(60,50) scale(.76) translate(-60,-56)">' + head + '</g>'
    : head;
  return '<svg viewBox="0 0 120 120" class="petart" role="img" aria-label="' + esc(L(PET_NAMES[kind])) + '">'
    + '<ellipse cx="60" cy="112" rx="32" ry="6" fill="#C9A5D8" opacity=".28"/>'
    + behind
    + '<ellipse cx="60" cy="88" rx="30" ry="23" fill="' + c.body + '"/>'
    + '<ellipse cx="60" cy="92" rx="18" ry="14" fill="#FFF7EE" opacity=".55"/>'
    + (feet ? '<ellipse cx="38" cy="104" rx="8" ry="5" fill="' + c.dark + '"/><ellipse cx="82" cy="104" rx="8" ry="5" fill="' + c.dark + '"/>' : '')
    + overBody + ears + headed + neck + worn
    + '</svg>';
}

/* The wait until the next meal, rounded the way a person would say it. */
function waitWord(ms) {
  const S = T(), mins = Math.max(1, Math.ceil(ms / 60000));
  if (mins < 60) return S.waitMin(mins);
  const h = Math.floor(mins / 60), m = mins % 60;
  return m ? S.waitHourMin(h, m) : S.waitHour(h);
}

/* The halo of luck behind a companion, and the symbols drifting up out of it.
   They are HTML rather than SVG so they can be animated cheaply. */
function petAuraHTML(kind, n) {
  const luck = petLuck(kind);
  let s = '<span class="aura" style="--aura:' + luck.aura + '"></span><span class="lucksyms" aria-hidden="true">';
  for (let i = 0; i < (n || 5); i++) s += '<i style="left:' + (12 + i * 18) + '%;animation-delay:' + (i * 700) + 'ms">' + luck.sym + '</i>';
  return s + '</span>';
}

/* ---- the screen ---- */
function renderPet(want) {
  const S = T(), m = $('#main');
  let busy = false, open = '';

  /* One line of the meal list: what it adds, and whether it is open. */
  const gainRow = (label, got, worth, locked) => '<li' + (locked ? ' class="locked"' : '') + '><span>' + esc(label) + '</span><b>' + (locked ? '🔒 +' + worth : '+' + got) + '</b></li>';

  const petCardHTML = (p) => {
    const luck = petLuck(p.kind), coat = PETS.coat(p), prayed = PETS.prayedToday(p);
    const st = PETS.step(p), gain = PETS.gain(p), pro = proOn(), ready = PETS.canFeed(p);
    const bless = prayed ? PETS.blessing(p) : null;
    return '<div class="card petwrap luck-' + luck.id + '">'
      + '<div class="petstage" id="petstage">' + petHomeSVG(PETS.home(p).id) + petAuraHTML(p.kind) + petSVG(p.kind, coat, ready ? '' : 'happy', PETS.wear(p)) + '<span class="crumbs" id="crumbs"></span></div>'
      + '<div class="lucktag" style="--ink:' + luck.ink + ';--aura:' + luck.aura + '">' + luck.sym + ' ' + esc(S.petBrings(L(luck.name))) + '</div>'
      + '<p class="petline">' + esc(L(luck.line)) + '</p>'
      + '<div class="charm"><span class="lbl">' + esc(S.petLevel(st.lv)) + '</span><span class="bar"><i style="width:' + st.at + '%;background:' + luck.ink + '"></i></span>'
      + '<b>' + (st.need ? st.into + '/' + st.need : '★') + '</b></div>'
      + '<ul class="carelist"><li class="head"><span>' + esc(S.petMealWorth) + '</span><b>+' + gain.total + '</b></li>'
      + gainRow(S.careMeal, gain.meal, 10, false)
      + gainRow(S.careDays, gain.days, 10, false)
      + gainRow(S.careTreats, gain.food, 8, !pro)
      + gainRow(S.careWear, gain.wear, 4, !pro)
      + gainRow(S.careHome, gain.home, 5, !pro)
      + gainRow(S.careCoat, gain.coat, 3, !pro)
      + '</ul>'
      + '<div class="petstat"><span>🔥 ' + esc(S.petStreak(Number(p.streak) || 0)) + '</span><span>🍽️ ' + esc(S.petMeals(Number(p.meals) || 0)) + '</span><a href="#/rewards">🪙 ' + fmtNum(BANK.coins()) + '</a></div>'
      + (ready
        ? '<button class="btn primary block" id="feed">' + PETS.food(p).sym + ' ' + esc(S.petFeedWith(L(PETS.food(p).name))) + '</button>'
        : '<p class="hint ok">' + esc(S.petFull(waitWord(PETS.waitLeft(p)))) + '</p>'
          + (pro ? '' : '<p class="hint">' + esc(S.petFasterPlus) + '</p>'))
      + (bless ? '<div class="bless"><span class="q">' + luck.sym + '</span><p>' + esc(L(bless)) + '</p><span class="who">' + esc(p.name || L(PET_NAMES[p.kind])) + '</span></div>'
        : '<button class="btn block' + (PETS.fedToday(p) ? '' : ' off') + '" id="pray" style="margin-top:10px">🙏 ' + esc(S.petPray) + '</button>'
          + '<p class="hint">' + esc(PETS.fedToday(p) ? S.petPrayHint : S.petNeedFeed) + '</p>')
      + '</div>';
  };

  /* One shelf of things to give the companion: food, a home, something to
     wear. Locked items are shown in full with what they would add. */
  const shelfHTML = (title, note, set, chosenId, key, label) => '<div class="card"><h3 style="margin-bottom:4px">' + esc(title) + '</h3><p class="hint" style="margin-bottom:10px">' + esc(note) + '</p>'
    + '<div class="shelf">' + set.map((x) => {
      const locked = x.pro && !proOn();
      return '<button type="button" class="sh' + (chosenId === x.id ? ' on' : '') + (locked ? ' locked' : '') + '" data-shelf="' + key + ':' + x.id + '">'
        + '<span class="shart">' + (label === 'food' ? x.sym : (label === 'home' ? petHomeSVG(x.id) : petWearArt(x.id))) + '</span>'
        + '<b>' + esc(L(x.name)) + '</b>'
        + (x.add ? '<span class="plus">+' + x.add + '</span>' : '')
        + (locked ? '<span class="sh-lock">🔒</span>' : '') + (chosenId === x.id ? '<span class="sh-on">✓</span>' : '')
        + '</button>';
    }).join('') + '</div></div>';

  const draw = () => {
    const pets = PETS.all();
    if (!pets.length) { drawPicker(); return; }
    if (!open || !PETS.one(open)) open = pets[0].kind;
    const p = PETS.one(open), coat = PETS.coat(p);
    const tabs = pets.length > 1
      ? '<div class="pettabs">' + pets.map((x) => '<button type="button" class="pt' + (x.kind === open ? ' on' : '') + '" data-open="' + x.kind + '">' + petSVG(x.kind, PETS.coat(x), 'happy', PETS.wear(x)) + '<b>' + esc(x.name || L(PET_NAMES[x.kind])) + '</b></button>').join('') + '</div>'
      : '';
    const room = PETS.room(), left = PETS.cap() - pets.length;
    m.innerHTML = '<div class="eyebrow">' + esc(S.actTitle) + '</div><h1 style="margin-bottom:6px">🐾 ' + esc(p.name || L(PET_NAMES[p.kind])) + '</h1>'
      + '<p class="muted">' + esc(S.petIntro) + '</p>'
      + tabs + petCardHTML(p)
      + (pets.length > 1 ? '<p class="hint ok" style="text-align:center">✨ ' + esc(S.petLuckTotal(pets.length)) + '</p>' : '')
      + (room
        ? '<button type="button" class="btn block" id="addpet" style="margin-top:12px">➕ ' + esc(S.petAdd) + (left > 1 ? ' · ' + esc(S.petRoomLeft(left)) : '') + '</button>'
        : (proOn() ? '' : '<a class="salebar" href="#/unlock"><span class="tag">✨ ' + esc(S.plusName) + '</span><span class="txt">' + esc(S.petPlusPitch) + '</span><span class="go">' + esc(S.unlockLink) + ' ›</span></a>'))
      + shelfHTML(S.petFoodTitle, S.petFoodNote, PET_FOODS, PETS.food(p).id, 'food', 'food')
      + shelfHTML(S.petHomeTitle, S.petHomeNote, PET_HOMES, PETS.home(p).id, 'home', 'home')
      + shelfHTML(S.petWearTitle, S.petWearNote, PET_WEARS, PETS.wear(p).id, 'wear', 'wear')
      + '<div class="card"><h3 style="margin-bottom:8px">' + esc(S.petCoat) + '</h3><div class="chips coats">'
      + PET_COATS.map((c) => { const locked = c.pro && !proOn(); return '<button type="button" class="coat' + (coat.id === c.id ? ' on' : '') + (locked ? ' locked' : '') + '" data-coat="' + c.id + '" style="background:' + c.body + '" aria-label="' + esc(c.id) + '">' + (locked ? '🔒' : '') + '</button>'; }).join('')
      + '</div><label class="f" for="petname" style="margin-top:12px">' + esc(S.petName) + '</label><input id="petname" maxlength="24" value="' + esc(p.name || '') + '" placeholder="' + esc(L(PET_NAMES[p.kind])) + '">'
      + '<button class="btn block" id="petswap" style="margin-top:10px">' + esc(pets.length > 1 ? S.petLetGo : S.petSwap) + '</button></div>'
      + '<p style="margin-top:14px"><a href="#/play" class="backlink">← ' + esc(S.actTitle) + '</a></p>';

    $$('[data-open]', m).forEach((b) => b.addEventListener('click', () => { open = b.getAttribute('data-open'); draw(); }));
    const add = $('#addpet');
    if (add) add.addEventListener('click', () => drawPicker());
    const fb = $('#feed');
    if (fb) fb.addEventListener('click', () => {
      if (busy) return;
      busy = true; fb.disabled = true;
      const stage = $('#petstage'), crumbs = $('#crumbs'), sym = PETS.food(p).sym;
      stage.classList.add('munch');
      let html = '';
      for (let i = 0; i < 7; i++) html += '<i style="left:' + (18 + Math.round(Math.random() * 64)) + '%;animation-delay:' + (i * 90) + 'ms">' + sym + '</i>';
      crumbs.innerHTML = html;
      setTimeout(() => {
        const got = PETS.feed(p);
        busy = false; draw();
        toast(got.to > got.from ? S.petLevelUp(got.to, fmtNum(got.up)) : (got.coins ? S.petThanksCoins(fmtNum(got.coins)) : S.petThanks));
      }, 1100);
    });
    const pb = $('#pray');
    if (pb) pb.addEventListener('click', () => {
      if (busy) return;
      if (!PETS.fedToday(p)) { toast(S.petNeedFeed); return; }
      busy = true; pb.disabled = true;
      $('#petstage').classList.add('praying');
      setTimeout(() => { PETS.pray(p); busy = false; draw(); }, 1200);
    });
    $$('[data-shelf]', m).forEach((b) => b.addEventListener('click', () => {
      const parts = b.getAttribute('data-shelf').split(':'), key = parts[0], id = parts[1];
      const set = key === 'food' ? PET_FOODS : (key === 'home' ? PET_HOMES : PET_WEARS);
      const item = set.filter((x) => x.id === id)[0];
      if (item.pro && !proOn()) { toast(S.petPlusItem); location.hash = '#/unlock'; return; }
      p[key] = id; PETS.put(p); draw();
    }));
    $$('[data-coat]', m).forEach((b) => b.addEventListener('click', () => {
      const id = b.getAttribute('data-coat'), c = PET_COATS.filter((x) => x.id === id)[0];
      if (c.pro && !proOn()) { toast(S.petPlusItem); location.hash = '#/unlock'; return; }
      p.coat = id; PETS.put(p); draw();
    }));
    $('#petname').addEventListener('input', () => { p.name = $('#petname').value.trim(); PETS.put(p); });
    $('#petswap').addEventListener('click', () => {
      if (!confirm(PETS.all().length > 1 ? S.petLetGoAsk : S.petSwapAsk)) return;
      PETS.drop(p.kind); open = ''; draw();
    });
  };

  /* The picker always shows all four, with what each one looks after, because
     the ones that cannot be kept yet are the reason to look at Plus. */
  const drawPicker = () => {
    const pets = PETS.all(), room = PETS.room();
    m.innerHTML = '<div class="eyebrow">' + esc(S.actTitle) + '</div><h1 style="margin-bottom:6px">🐾 ' + esc(pets.length ? S.petAdd : S.petTitle) + '</h1><p class="muted">' + esc(S.petPick) + '</p>'
      + (room ? '' : '<a class="salebar" href="#/unlock"><span class="tag">✨ ' + esc(S.plusName) + '</span><span class="txt">' + esc(S.petPlusPitch) + '</span><span class="go">' + esc(S.unlockLink) + ' ›</span></a>')
      + '<div class="petpick">' + PET_KINDS.map((k) => {
        const luck = petLuck(k), have = !!PETS.one(k), locked = !have && !room;
        return '<button type="button" class="pp luck-' + luck.id + (have ? ' have' : '') + (locked ? ' locked' : '') + '" data-kind="' + k + '">'
          + '<span class="ppart">' + petAuraHTML(k, 3) + petSVG(k, PET_COATS[0], 'happy') + '</span>'
          + '<b>' + esc(L(PET_NAMES[k])) + '</b>'
          + '<span class="pl" style="--ink:' + luck.ink + ';--aura:' + luck.aura + '">' + luck.sym + ' ' + esc(L(luck.name)) + '</span>'
          + (have ? '<span class="pp-on">✓</span>' : (locked ? '<span class="pp-lock">🔒</span>' : ''))
          + '</button>';
      }).join('') + '</div>'
      + '<p class="hint">' + esc(S.petLuckNote) + '</p>'
      + '<p style="margin-top:14px"><a href="#/play" class="backlink" id="petback">← ' + esc(pets.length ? S.petBack : S.actTitle) + '</a></p>';
    $$('[data-kind]', m).forEach((b) => b.addEventListener('click', () => {
      const k = b.getAttribute('data-kind');
      if (PETS.one(k)) { open = k; draw(); return; }
      if (!PETS.room()) { toast(S.petPlusPitch); location.hash = '#/unlock'; return; }
      PETS.put(PETS.fresh(k)); open = k; draw();
    }));
    const back = $('#petback');
    if (back && pets.length) back.addEventListener('click', (e) => { e.preventDefault(); draw(); });
  };

  /* What a charm looks like on its own, for the shelf. */
  if (want === 'add') drawPicker(); else draw();
}

/* A small picture of each charm, shown on the shelf rather than on the pet. */
function petWearArt(id) {
  const open = '<svg viewBox="0 0 60 60" class="wearart" aria-hidden="true">';
  if (id === 'scarf') return open + '<path d="M10 22 q20 14 40 0 q3 10 -4 15 q-16 9 -32 0 q-7 -5 -4 -15 Z" fill="#E1607F"/><path d="M40 36 q10 10 6 20 q-9 2 -13 -5 Z" fill="#C94C6C"/></svg>';
  if (id === 'bell') return open + '<path d="M12 34 q18 10 36 0" fill="none" stroke="#B9913B" stroke-width="3" stroke-linecap="round"/><circle cx="30" cy="38" r="11" fill="#E5BE5E" stroke="#B9913B" stroke-width="2"/><path d="M21 38 h18" stroke="#B9913B" stroke-width="2"/><circle cx="30" cy="45" r="2.6" fill="#8A6B22"/></svg>';
  if (id === 'crown') {
    const bud = (x, y, col) => [0, 72, 144, 216, 288].map((a) => '<ellipse cx="' + x + '" cy="' + (y - 4.6) + '" rx="3" ry="4.6" fill="' + col + '" transform="rotate(' + a + ' ' + x + ' ' + y + ')"/>').join('') + '<circle cx="' + x + '" cy="' + y + '" r="2.2" fill="#FFE9A8"/>';
    return open + '<path d="M8 40 Q30 20 52 40" fill="none" stroke="#8FBF7F" stroke-width="3"/>' + bud(13, 38, '#F7A9C6') + bud(30, 26, '#FFF3C4') + bud(47, 38, '#C9B0EA') + '</svg>';
  }
  if (id === 'hat') return open + '<ellipse cx="30" cy="42" rx="24" ry="6" fill="#E8CFA0"/><path d="M12 42 L30 12 L48 42 Z" fill="#F0DFC8" stroke="#C6A98A" stroke-width="2"/><path d="M30 14 A9 9 0 1 0 30 32 A7 7 0 1 1 30 14 Z" fill="#E5BE5E"/></svg>';
  return open + '<circle cx="30" cy="30" r="16" fill="none" stroke="#C9BFE0" stroke-width="2" stroke-dasharray="4 4"/></svg>';
}
ROUTES.pet = { nav: 'play', render: renderPet };
