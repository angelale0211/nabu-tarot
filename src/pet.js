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

const PET_KINDS = ['cat', 'fox', 'bunny', 'turtle', 'deer', 'swallow', 'phoenix', 'dragon', 'qilin', 'pixiu', 'crane', 'pegasus'];
/* The six ordinary companions are free, one of them at a time. The six spirit
   beasts below them belong to Nabu Tarot Plus, which also lifts the limit of
   one, so a subscriber can keep every corner of life covered at once. */
const PET_PRO = { phoenix: true, dragon: true, qilin: true, pixiu: true, crane: true, pegasus: true };
const PET_NAMES = {
  cat: { vi: 'Mèo Trăng', en: 'Moon cat' },
  fox: { vi: 'Cáo Sao', en: 'Star fox' },
  bunny: { vi: 'Thỏ Mây', en: 'Cloud bunny' },
  turtle: { vi: 'Rùa Ngọc', en: 'Jade turtle' },
  deer: { vi: 'Hươu Lành', en: 'Gentle deer' },
  swallow: { vi: 'Én Gió', en: 'Wind swallow' },
  phoenix: { vi: 'Phượng Hoàng', en: 'Phoenix' },
  dragon: { vi: 'Rồng Mây', en: 'Cloud dragon' },
  qilin: { vi: 'Kỳ Lân', en: 'Qilin' },
  pixiu: { vi: 'Tỳ Hưu', en: 'Pixiu' },
  crane: { vi: 'Bạch Hạc', en: 'White crane' },
  pegasus: { vi: 'Thiên Mã', en: 'Sky horse' }
};

/* ---- what each one looks after ---- */
const PET_LUCK = {
  cat: 'love', fox: 'career', bunny: 'study', turtle: 'money', deer: 'health', swallow: 'travel',
  phoenix: 'love', dragon: 'career', qilin: 'study', pixiu: 'money', crane: 'health', pegasus: 'travel'
};
const LUCKS = {
  love: {
    id: 'love', sym: '💗', ink: '#D3557E', aura: '#FBD3E1',
    name: { vi: 'Tình duyên', en: 'Love' },
    line: { vi: 'Mèo Trăng ngồi canh chuyện tình cảm và giữ cho lòng bạn ấm.', en: 'The moon cat sits with matters of the heart and keeps you warm.' },
    proLine: { vi: 'Phượng Hoàng bay qua những gì đã cũ và mở ra một mùa mới cho trái tim bạn.', en: 'The phoenix flies over what is finished and opens a new season for your heart.' }
  },
  career: {
    id: 'career', sym: '⭐', ink: '#B98420', aura: '#FBE7BE',
    name: { vi: 'Sự nghiệp', en: 'Work' },
    line: { vi: 'Cáo Sao đi trước một bước để mở đường cho công việc của bạn.', en: 'The star fox walks a step ahead and opens the way at work.' },
    proLine: { vi: 'Rồng Mây cưỡi gió đưa tên bạn đi xa hơn những gì bạn tự nói về mình.', en: 'The cloud dragon rides the wind and carries your name further than you could speak it.' }
  },
  study: {
    id: 'study', sym: '📖', ink: '#4173B8', aura: '#CFE0F7',
    name: { vi: 'Học hành', en: 'Study' },
    line: { vi: 'Thỏ Mây thức cùng bạn qua những trang sách khó nhất.', en: 'The cloud bunny stays up with you through the hardest pages.' },
    proLine: { vi: 'Kỳ Lân chỉ hiện ra với người chịu học, và nó đang đứng cạnh bàn của bạn.', en: 'The qilin shows itself only to those who keep studying, and it is standing by your desk.' }
  },
  money: {
    id: 'money', sym: '🪙', ink: '#2E8A68', aura: '#C6E8D9',
    name: { vi: 'Tiền tài', en: 'Money' },
    line: { vi: 'Rùa Ngọc đi chậm mà chắc, giữ lại những gì bạn đã có.', en: 'The jade turtle moves slowly and keeps what you already have.' },
    proLine: { vi: 'Tỳ Hưu chỉ nuốt vào mà không nhả ra, nên của cải ở lại trong nhà bạn.', en: 'The pixiu swallows and never gives back, so what comes in stays in your house.' }
  },
  health: {
    id: 'health', sym: '🌿', ink: '#1F8A98', aura: '#C7EAEE',
    name: { vi: 'Sức khỏe', en: 'Health' },
    line: { vi: 'Hươu Lành nhắc bạn đi chậm lại một chút để người còn theo kịp.', en: 'The gentle deer asks you to slow down so your body can keep up.' },
    proLine: { vi: 'Bạch Hạc sống rất thọ, và nó đứng canh giấc ngủ của bạn mỗi đêm.', en: 'The white crane lives a long life, and it keeps watch over your sleep.' }
  },
  travel: {
    id: 'travel', sym: '🧭', ink: '#C4643C', aura: '#F8D9C6',
    name: { vi: 'Đi lại', en: 'Travel' },
    line: { vi: 'Én Gió biết đường về, nên chuyến đi nào của bạn cũng có lối quay lại.', en: 'The wind swallow knows the way home, so every journey of yours has a way back.' },
    proLine: { vi: 'Thiên Mã không cần đường, nơi nào bạn muốn đến thì nó đã đứng sẵn ở đó.', en: 'The sky horse needs no road; wherever you mean to go, it is already standing there.' }
  }
};
const petLuck = (kind) => LUCKS[PET_LUCK[kind] || 'love'];
const petIsPro = (kind) => !!PET_PRO[kind];
/* A spirit beast says the grander version of the same promise. */
const petLine = (kind) => { const l = petLuck(kind); return petIsPro(kind) ? l.proLine : l.line; };

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
  ],
  health: [
    { vi: 'Hôm nay bạn hãy uống thêm một cốc nước và ngủ sớm hơn một chút.', en: 'Drink one more glass of water today and go to bed a little earlier.' },
    { vi: 'Cơ thể bạn đang nhắc một điều nhỏ. Bạn nghe nó trước khi nó phải nói to.', en: 'Your body is mentioning something quietly. Listen before it has to raise its voice.' },
    { vi: 'Một buổi đi bộ ngắn hôm nay đáng giá hơn một lời hứa tập luyện cả tháng.', en: 'A short walk today is worth more than a month of promises to start.' },
    { vi: 'Bạn không lười. Bạn đang mệt, và mệt thì cần nghỉ chứ không cần trách.', en: 'You are not lazy. You are tired, and tired needs rest rather than blame.' },
    { vi: 'Bữa ăn tử tế với chính mình cũng là một cách chữa lành.', en: 'Feeding yourself properly is its own kind of healing.' },
    { vi: 'Điều bạn lo về sức khỏe nên được hỏi bác sĩ, đừng hỏi mỗi mình bạn.', en: 'The worry you are carrying belongs to a doctor, not only to you.' }
  ],
  travel: [
    { vi: 'Chuyến đi bạn hoãn mãi có thể bắt đầu bằng một việc rất nhỏ hôm nay.', en: 'The trip you keep postponing can start with one small thing today.' },
    { vi: 'Bạn kiểm tra lại giấy tờ và giờ giấc một lần nữa trước khi đi.', en: 'Check your papers and your times once more before you set out.' },
    { vi: 'Đường xa nhưng thuận. Bạn cứ đi sớm hơn dự định một chút.', en: 'The way is long but clear. Set out a little earlier than you planned.' },
    { vi: 'Một nơi bạn từng đến sẽ gọi bạn quay lại trong năm nay.', en: 'A place you have been before will call you back this year.' },
    { vi: 'Bạn đi nhẹ thôi. Thứ bạn cần ở đó nhiều hơn bạn tưởng.', en: 'Travel light. More of what you need is already there.' },
    { vi: 'Người bạn gặp trên đường quan trọng hơn nơi bạn đến.', en: 'Who you meet on the way matters more than where you arrive.' }
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
/* What gets thrown when the two of you play. */
const PET_TOYS = ['🧶', '🦋', '🎈', '🍃', '✨', '🪁'];
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
  /* A spirit beast is never kept without Plus, however much room there is. */
  mayKeep(kind) { return !petIsPro(kind) || proOn(); },
  room() { return this.all().length < this.cap(); },
  fresh(kind) { return { kind: kind, coat: 'cream', wear: 'none', home: 'mat', food: 'rice', name: '', streak: 0, meals: 0, treats: 0, xp: 0, last: 0, fed: '', pray: '', bless: 0, playDay: '', playN: 0 }; },
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
  /* Playing is the other half of caring for one: once a day for everyone,
     three times a day with Plus. It pays more experience than a meal, because
     it is the thing a person has to make time for. */
  playCap() { return proOn() ? 3 : 1; },
  playedToday(p) { return p && p.playDay === isoDate(new Date()) ? Math.max(0, Number(p.playN) || 0) : 0; },
  playLeft(p) { return Math.max(0, this.playCap() - this.playedToday(p)); },
  canPlay(p) { return this.playLeft(p) > 0; },
  play(p) {
    const today = isoDate(new Date());
    if (p.playDay !== today) { p.playDay = today; p.playN = 0; }
    p.playN = (Number(p.playN) || 0) + 1;
    const before = petLevel(p.xp);
    p.xp = (Number(p.xp) || 0) + 12;
    const coins = BANK.earnDay(3);
    const after = petLevel(p.xp);
    let up = 0;
    for (let lv = before + 1; lv <= after; lv++) { BANK.earn(levelCoins(lv)); up += levelCoins(lv); }
    BANK.mark(after);
    this.put(p);
    return { coins: coins, up: up, from: before, to: after };
  },
  /* Playing is the other half of caring for one: once a day for everyone,
     three times a day with Plus. It pays more experience than a meal, because
     it is the thing a person has to make time for. */
  playCap() { return proOn() ? 3 : 1; },
  playedToday(p) { return p && p.playDay === isoDate(new Date()) ? Math.max(0, Number(p.playN) || 0) : 0; },
  playLeft(p) { return Math.max(0, this.playCap() - this.playedToday(p)); },
  canPlay(p) { return this.playLeft(p) > 0; },
  play(p) {
    const today = isoDate(new Date());
    if (p.playDay !== today) { p.playDay = today; p.playN = 0; }
    p.playN = (Number(p.playN) || 0) + 1;
    const before = petLevel(p.xp);
    p.xp = (Number(p.xp) || 0) + 12;
    const coins = BANK.earnDay(3);
    const after = petLevel(p.xp);
    let up = 0;
    for (let lv = before + 1; lv <= after; lv++) { BANK.earn(levelCoins(lv)); up += levelCoins(lv); }
    BANK.mark(after);
    this.put(p);
    return { coins: coins, up: up, from: before, to: after };
  },
  /* Playing is the other half of caring for one: once a day for everyone,
     three times a day with Plus. It pays more experience than a meal, because
     it is the thing a person has to make time for. */
  playCap() { return proOn() ? 3 : 1; },
  playedToday(p) { return p && p.playDay === isoDate(new Date()) ? Math.max(0, Number(p.playN) || 0) : 0; },
  playLeft(p) { return Math.max(0, this.playCap() - this.playedToday(p)); },
  canPlay(p) { return this.playLeft(p) > 0; },
  play(p) {
    const today = isoDate(new Date());
    if (p.playDay !== today) { p.playDay = today; p.playN = 0; }
    p.playN = (Number(p.playN) || 0) + 1;
    const before = petLevel(p.xp);
    p.xp = (Number(p.xp) || 0) + 12;
    const coins = BANK.earnDay(3);
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
   A home is the whole picture behind the companion: sky at the top, ground at
   the bottom, and the place itself standing behind it. The square matches the
   stage exactly, so the scene fills the frame with nothing floating in it.
   The companion stands to the left of centre, which is why every building is
   set to the right. */
function petHomeSVG(id) {
  const open = '<svg viewBox="0 0 240 240" class="pethome" preserveAspectRatio="xMidYMax slice" aria-hidden="true">';
  if (id === 'cloud') {
    let stars = '';
    [[26, 34], [58, 20], [120, 26], [196, 22], [222, 48], [14, 74]].forEach((p, k) => {
      stars += '<circle class="twinkle" cx="' + p[0] + '" cy="' + p[1] + '" r="' + (1.4 + (k % 2)) + '" fill="#FFF7EE" style="animation-delay:' + (k * 260) + 'ms"/>';
    });
    return open
      + '<defs><linearGradient id="hgc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#E6DCFB"/><stop offset="100%" stop-color="#F8F4FF"/></linearGradient></defs>'
      + '<rect width="240" height="240" fill="url(#hgc)"/>' + stars
      + '<g fill="#F5F0FF" opacity=".9"><ellipse cx="44" cy="96" rx="34" ry="17"/><ellipse cx="74" cy="86" rx="26" ry="14"/><ellipse cx="214" cy="78" rx="28" ry="15"/></g>'
      + '<path d="M136 130 L182 80 L228 130 Z" fill="#C9B0EA"/>'
      + '<path d="M182 80 L228 130 L222 130 L182 88 Z" fill="#B49BD8"/>'
      + '<rect x="148" y="128" width="68" height="76" rx="7" fill="#F6F0FF" stroke="#C7B4EC" stroke-width="2"/>'
      + '<rect x="170" y="160" width="26" height="44" rx="5" fill="#C9B0EA"/><circle cx="192" cy="182" r="2.4" fill="#7C63B8"/>'
      + '<rect x="154" y="140" width="16" height="14" rx="3" fill="#FFF7EE" stroke="#C7B4EC" stroke-width="1.6"/>'
      + '<rect x="198" y="140" width="14" height="14" rx="3" fill="#FFF7EE" stroke="#C7B4EC" stroke-width="1.6"/>'
      + '<path d="M182 74 q10 -12 22 -8" stroke="#C7B4EC" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
      + '<g fill="#FFFFFF"><ellipse cx="26" cy="212" rx="46" ry="26"/><ellipse cx="96" cy="220" rx="56" ry="28"/><ellipse cx="176" cy="214" rx="50" ry="26"/><ellipse cx="232" cy="222" rx="34" ry="20"/></g>'
      + '<g fill="#F0E9FF"><ellipse cx="60" cy="228" rx="40" ry="16"/><ellipse cx="150" cy="230" rx="46" ry="16"/></g></svg>';
  }
  if (id === 'shrine') {
    return open
      + '<defs><linearGradient id="hgs" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FBDDC2"/><stop offset="60%" stop-color="#FCEEDC"/><stop offset="100%" stop-color="#F6E7CE"/></linearGradient></defs>'
      + '<rect width="240" height="240" fill="url(#hgs)"/>'
      + '<circle cx="52" cy="70" r="24" fill="#F8C79A" opacity=".7"/>'
      + '<g fill="#E7C9A6" opacity=".7"><path d="M0 158 q40 -26 84 -6 q40 20 74 -2 q34 -20 82 0 L240 200 L0 200 Z"/></g>'
      + '<path d="M120 122 L180 68 L240 122 Z" fill="#B0483F"/>'
      + '<path d="M114 120 h132 v11 a5 5 0 0 1 -5 5 H119 a5 5 0 0 1 -5 -5 Z" fill="#8E3A33"/>'
      + '<rect x="142" y="136" width="76" height="66" fill="#F2E3CB" stroke="#CBAE8B" stroke-width="2"/>'
      + '<rect x="146" y="136" width="11" height="66" fill="#B0483F"/><rect x="203" y="136" width="11" height="66" fill="#B0483F"/>'
      + '<rect x="166" y="152" width="28" height="50" rx="3" fill="#8E3A33"/>'
      + '<circle cx="180" cy="146" r="7" fill="#E5BE5E"/>'
      + '<g><rect x="26" y="112" width="3" height="30" fill="#8E3A33"/><ellipse cx="27.5" cy="152" rx="12" ry="15" fill="#E9705F"/><ellipse cx="27.5" cy="152" rx="12" ry="15" fill="none" stroke="#B0483F" stroke-width="1.6"/><path d="M18 146 h19 M18 158 h19" stroke="#B0483F" stroke-width="1.2"/></g>'
      + '<rect x="0" y="200" width="240" height="40" fill="#E0D0B4"/>'
      + '<g fill="#D2BE9C"><ellipse cx="40" cy="216" rx="20" ry="7"/><ellipse cx="104" cy="228" rx="26" ry="8"/><ellipse cx="176" cy="214" rx="22" ry="7"/><ellipse cx="222" cy="230" rx="18" ry="6"/></g>'
      + '<g fill="#B0483F" opacity=".5"><circle cx="14" cy="196" r="4"/><circle cx="232" cy="196" r="4"/></g></svg>';
  }
  if (id === 'moon') {
    let stars = '';
    for (let k = 0; k < 30; k++) {
      const x = 10 + (k * 47) % 226, y = 8 + (k * 61) % 150, r = 0.9 + (k % 3) * 0.7;
      stars += '<circle class="twinkle" cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#FFF3C4" style="animation-delay:' + (k * 150) + 'ms"/>';
    }
    let flies = '';
    [[30, 168], [66, 150], [206, 160], [228, 186]].forEach((f, k) => {
      flies += '<circle class="fly lit" cx="' + f[0] + '" cy="' + f[1] + '" r="3" fill="#FFE9A8" style="animation-delay:' + (k * 380) + 'ms"/>';
    });
    return open
      + '<defs><linearGradient id="hgm" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#241E4A"/><stop offset="100%" stop-color="#3B3168"/></linearGradient></defs>'
      + '<rect width="240" height="240" fill="url(#hgm)"/>' + stars
      + '<circle cx="192" cy="52" r="27" fill="#FFE9A8"/>'
      + '<g fill="#F0D48C" opacity=".55"><circle cx="184" cy="44" r="6"/><circle cx="201" cy="60" r="4.4"/><circle cx="188" cy="63" r="3"/></g>'
      + '<path d="M0 172 q54 -40 110 -10 q52 28 130 -8 L240 240 L0 240 Z" fill="#4A3E80"/>'
      + '<path d="M0 200 q60 -18 122 4 q56 20 118 -4 L240 240 L0 240 Z" fill="#3A3068"/>'
      + '<ellipse cx="106" cy="228" rx="86" ry="13" fill="#5A4C98" opacity=".55"/>'
      + '<path d="M150 226 q22 -4 42 0" stroke="#FFE9A8" stroke-width="2" opacity=".5" fill="none"/>'
      + '<g fill="#8E7FD6"><ellipse cx="20" cy="192" rx="16" ry="8"/><ellipse cx="226" cy="200" rx="14" ry="7"/></g>' + flies + '</svg>';
  }
  return open
    + '<defs><linearGradient id="hgg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#DCEBFB"/><stop offset="70%" stop-color="#F7F1E6"/><stop offset="100%" stop-color="#F2EEDF"/></linearGradient></defs>'
    + '<rect width="240" height="240" fill="url(#hgg)"/>'
    + '<circle cx="204" cy="42" r="24" fill="#FFE9A8" opacity=".8"/>'
    + '<g fill="#FFFFFF" opacity=".9"><ellipse cx="52" cy="48" rx="28" ry="14"/><ellipse cx="78" cy="42" rx="20" ry="11"/><ellipse cx="150" cy="66" rx="20" ry="10"/></g>'
    + '<path d="M0 164 q48 -34 100 -8 q44 22 82 -2 q32 -18 58 -2 L240 240 L0 240 Z" fill="#CDE3BF"/>'
    + '<path d="M0 196 q64 -16 126 2 q54 16 114 -2 L240 240 L0 240 Z" fill="#BFDAAE"/>'
    + '<g stroke="#A8C995" stroke-width="2.2" stroke-linecap="round"><path d="M22 214 v-11 M30 216 v-9 M212 208 v-11 M220 210 v-9 M196 224 v-10"/></g>'
    + '<circle cx="224" cy="182" r="17" fill="#B4D5A2"/><circle cx="208" cy="190" r="12" fill="#C2DFB0"/>'
    + '<ellipse cx="106" cy="216" rx="70" ry="16" fill="#E8D9A8"/>'
    + '<ellipse cx="106" cy="216" rx="70" ry="16" fill="none" stroke="#C9B47F" stroke-width="2"/>'
    + '<g stroke="#D3C08E" stroke-width="1.6"><path d="M62 210 h88 M52 216 h108 M62 222 h88"/></g>'
    + '<g fill="#F7A9C6"><circle cx="30" cy="200" r="4"/><circle cx="190" cy="204" r="3.6"/></g>'
    + '<g fill="#FFF3C4"><circle cx="30" cy="200" r="1.6"/><circle cx="190" cy="204" r="1.5"/></g></svg>';
}

/* ---- the twelve creatures ----
   One body plan, so they read as one family: a round body, a round head, a
   face, and a charm in the colour of the luck they carry. Everything that
   tells them apart is a part in the table below, drawn on a 120x120 square.

   behind   goes under the body: tails, wings, back legs
   overBody goes over the body: shells, scales, chest markings
   ears     goes behind the head: ears, horns, crests, antlers
   front    goes over the face: muzzles, beaks, whiskers, manes
   feet     false when the creature has no ordinary paws
   eyeY     moves the eyes for a longer or shorter head
   noMouth  for a creature whose muzzle or beak carries the mouth
   head     scales the head about its own centre, for small-headed animals */
const PET_ART = {
  cat: (c) => ({
    ears: '<path d="M36 32 L38 10 L54 24 Z" fill="' + c.body + '"/><path d="M84 32 L82 10 L66 24 Z" fill="' + c.body + '"/>'
      + '<path d="M40 30 L41 18 L50 26 Z" fill="' + c.dark + '"/><path d="M80 30 L79 18 L70 26 Z" fill="' + c.dark + '"/>',
    behind: '<path d="M86 96 q24 -4 18 -26" fill="none" stroke="' + c.dark + '" stroke-width="8" stroke-linecap="round"/>',
    front: '<path d="M28 56 h-11 M28 61 h-12 M92 56 h11 M92 61 h12" stroke="' + c.dark + '" stroke-width="1.4" stroke-linecap="round"/>'
  }),
  /* A fox is a snout, a ruff and a brush. Without those it is only a cat with
     pointed ears, which is what it used to look like. */
  fox: (c) => ({
    ears: '<path d="M33 34 L28 2 L57 24 Z" fill="' + c.body + '"/><path d="M87 34 L92 2 L63 24 Z" fill="' + c.body + '"/>'
      + '<path d="M37 30 L34 12 L50 25 Z" fill="#C4643C" opacity=".55"/><path d="M83 30 L86 12 L70 25 Z" fill="#C4643C" opacity=".55"/>'
      + '<path d="M28 2 L32 18 L41 11 Z" fill="#3E2E22"/><path d="M92 2 L88 18 L79 11 Z" fill="#3E2E22"/>',
    behind: '<path d="M80 100 q32 8 28 -26 q-6 20 -28 17 Z" fill="#C4643C"/>'
      + '<path d="M104 80 q10 -8 4 -18 q-12 6 -12 16 Z" fill="#FFFDF8"/>',
    overBody: '<path d="M60 68 q-14 18 -13 36 q13 6 26 0 q1 -18 -13 -36 Z" fill="#FFFDF8"/>'
      + '<ellipse cx="38" cy="104" rx="8" ry="5" fill="#3E2E22"/><ellipse cx="82" cy="104" rx="8" ry="5" fill="#3E2E22"/>',
    front: '<path d="M30 52 q-13 9 -9 23 q12 -4 17 -13 Z" fill="#FFFDF8" stroke="' + c.dark + '" stroke-width="1.1"/>'
      + '<path d="M90 52 q13 9 9 23 q-12 -4 -17 -13 Z" fill="#FFFDF8" stroke="' + c.dark + '" stroke-width="1.1"/>'
      + '<path d="M60 52 Q45 67 44 84 Q60 94 76 84 Q75 67 60 52 Z" fill="#FFFDF8" stroke="' + c.dark + '" stroke-width="1.2"/>'
      + '<ellipse cx="60" cy="82" rx="6.4" ry="4.4" fill="#3E2E22"/>'
      + '<path d="M60 86 q-7 6 -12 2 M60 86 q7 6 12 2" stroke="#3E2E22" stroke-width="1.7" fill="none" stroke-linecap="round"/>'
      + '<path d="M42 76 h-14 M44 82 h-14 M78 76 h14 M76 82 h14" stroke="#3E2E22" stroke-width="1.1" stroke-linecap="round" opacity=".65"/>',
    feet: false, eyeY: 48, noMouth: true, blushY: 56, charmY: 96
  }),
  bunny: (c) => ({
    ears: '<ellipse cx="47" cy="18" rx="7.5" ry="21" fill="' + c.body + '" transform="rotate(-8 47 18)"/>'
      + '<ellipse cx="73" cy="18" rx="7.5" ry="21" fill="' + c.body + '" transform="rotate(8 73 18)"/>'
      + '<ellipse cx="47" cy="20" rx="3.6" ry="14" fill="#F7C7D6" transform="rotate(-8 47 20)"/>'
      + '<ellipse cx="73" cy="20" rx="3.6" ry="14" fill="#F7C7D6" transform="rotate(8 73 20)"/>',
    behind: '<circle cx="92" cy="94" r="9" fill="#FFF7EE"/>'
  }),
  turtle: (c) => ({
    feet: false, head: 0.76, headY: -6,
    behind: '<ellipse cx="26" cy="100" rx="12" ry="6.5" fill="' + c.dark + '" transform="rotate(-16 26 100)"/>'
      + '<ellipse cx="94" cy="100" rx="12" ry="6.5" fill="' + c.dark + '" transform="rotate(16 94 100)"/>'
      + '<path d="M92 96 q14 -1 18 6 q-9 5 -18 -1 Z" fill="' + c.dark + '"/>',
    overBody: '<path d="M24 106 A36 32 0 0 1 96 106 Z" fill="#7FC9A8"/>'
      + '<ellipse cx="60" cy="106" rx="36" ry="5" fill="#4E9C7C"/>'
      + '<path d="M24 106 A36 32 0 0 1 96 106" fill="none" stroke="#4E9C7C" stroke-width="2.4"/>'
      + '<g fill="none" stroke="#4E9C7C" stroke-width="1.6" opacity=".9">'
      + '<path d="M60 74 L60 106 M40 80 L48 106 M80 80 L72 106 M27 95 L34 106 M93 95 L86 106"/>'
      + '<path d="M34 92 Q60 82 86 92"/></g>'
      + '<path d="M40 100 q20 -7 40 0" fill="none" stroke="#B9E8D2" stroke-width="2" opacity=".7"/>',
    charmY: 92
  }),
  /* A deer is antlers, spots and a small dark nose. */
  deer: (c) => ({
    ears: '<ellipse cx="34" cy="40" rx="10" ry="6" fill="' + c.dark + '" transform="rotate(-24 34 40)"/>'
      + '<ellipse cx="86" cy="40" rx="10" ry="6" fill="' + c.dark + '" transform="rotate(24 86 40)"/>'
      + '<g stroke="#C08B52" stroke-width="3.4" fill="none" stroke-linecap="round">'
      + '<path d="M46 32 Q40 16 36 8 M42 20 Q34 16 28 18 M40 13 Q34 8 33 2"/>'
      + '<path d="M74 32 Q80 16 84 8 M78 20 Q86 16 92 18 M80 13 Q86 8 87 2"/></g>',
    behind: '<path d="M88 98 q14 2 12 -10 q-4 7 -12 6 Z" fill="#FFF7EE"/>',
    overBody: '<g fill="#FFF7EE" opacity=".8"><circle cx="46" cy="86" r="3.6"/><circle cx="60" cy="94" r="3"/><circle cx="74" cy="84" r="3.4"/><circle cx="66" cy="78" r="2.4"/></g>',
    front: '<ellipse cx="60" cy="66" rx="6" ry="4.4" fill="' + c.dark + '"/><ellipse cx="60" cy="65" rx="3" ry="2" fill="#4A3728"/>',
    noMouth: true
  }),
  /* A swallow is a beak, folded wings and a forked tail. */
  swallow: (c) => ({
    feet: false,
    behind: '<path d="M84 96 q28 8 34 26 q-22 2 -32 -12 Z" fill="#3E4C6E"/>'
      + '<path d="M86 102 q22 14 22 28 q-18 -6 -24 -18 Z" fill="#55648C"/>',
    overBody: '<path d="M34 78 q-10 17 0 32 q14 -4 18 -15 q-6 -13 -18 -17 Z" fill="#3E4C6E"/>'
      + '<path d="M86 78 q10 17 0 32 q-14 -4 -18 -15 q6 -13 18 -17 Z" fill="#3E4C6E"/>'
      + '<g stroke="#8C9AB8" stroke-width="1.3" opacity=".45" fill="none"><path d="M38 88 q9 6 11 15 M82 88 q-9 6 -11 15"/></g>'
      + '<ellipse cx="60" cy="94" rx="17" ry="14" fill="#FFFDF8"/>'
      + '<g stroke="#E8A33C" stroke-width="2.6" stroke-linecap="round"><path d="M53 111 v6 M67 111 v6"/></g>',
    ears: '<path d="M42 34 Q36 22 44 14 Q50 24 49 33 Z" fill="#3E4C6E" opacity=".8"/>'
      + '<path d="M78 34 Q84 22 76 14 Q70 24 71 33 Z" fill="#3E4C6E" opacity=".8"/>',
    front: '<path d="M60 60 L48 68 L60 74 Z" fill="#E8A33C"/><path d="M60 60 L72 68 L60 74 Z" fill="#F0B24E"/>'
      + '<path d="M48 68 L72 68" stroke="#C4813C" stroke-width="1.1"/>'
      + '<path d="M50 76 q10 6 20 0" fill="#FFFDF8" opacity=".9"/>',
    noMouth: true, eyeY: 52, blushY: 60, charmY: 96
  }),
  /* ---- the six spirit beasts ---- */
  phoenix: (c) => ({
    glow: true, feet: false,
    ears: '<g fill="#E5BE5E"><path d="M60 30 Q52 8 60 0 Q68 10 60 30 Z"/><path d="M46 34 Q34 16 36 6 Q50 16 46 34 Z" fill="#F2789F"/><path d="M74 34 Q86 16 84 6 Q70 16 74 34 Z" fill="#F2789F"/></g>',
    behind: '<path d="M84 94 Q116 84 112 46 Q104 78 82 82 Z" fill="#F2789F"/>'
      + '<path d="M86 100 Q118 104 118 74 Q106 96 84 92 Z" fill="#E5BE5E"/>'
      + '<circle cx="108" cy="58" r="4.6" fill="#FFF3C4"/><circle cx="110" cy="86" r="4" fill="#FFF3C4"/>'
      + '<path d="M30 92 Q6 82 8 56 Q18 82 34 84 Z" fill="#F7C89A"/>',
    overBody: '<path d="M32 80 q-6 18 6 30 q12 -4 16 -16 q-8 -12 -22 -14 Z" fill="#F2789F" opacity=".9"/>'
      + '<path d="M88 80 q6 18 -6 30 q-12 -4 -16 -16 q8 -12 22 -14 Z" fill="#F2789F" opacity=".9"/>'
      + '<g stroke="#E5BE5E" stroke-width="1.6" fill="none" opacity=".8"><path d="M36 90 q10 4 14 12 M84 90 q-10 4 -14 12"/></g>'
      + '<g stroke="#E8A33C" stroke-width="2.6" stroke-linecap="round"><path d="M50 110 v6 M70 110 v6"/></g>',
    front: '<path d="M53 62 L60 74 L67 62 Z" fill="#E8A33C"/>',
    noMouth: true, blushY: 60
  }),
  dragon: (c) => ({
    glow: true,
    ears: '<g fill="#E5BE5E"><path d="M40 30 Q26 18 22 4 Q42 12 46 28 Z"/><path d="M80 30 Q94 18 98 4 Q78 12 74 28 Z"/></g>'
      + '<path d="M50 24 q10 -8 20 0 q-10 -3 -20 0 Z" fill="#7FC9A8"/>',
    behind: '<path d="M86 98 Q118 96 116 62 Q108 90 84 88 Z" fill="#5FB894"/>'
      + '<path d="M112 66 q10 -8 8 -18 q-10 6 -12 16 Z" fill="#E5BE5E"/>',
    overBody: '<g fill="#5FB894"><path d="M60 64 l7 10 l-7 10 l-7 -10 Z" opacity=".55"/></g>'
      + '<g fill="none" stroke="#4E9C7C" stroke-width="1.8" opacity=".7"><path d="M44 84 q16 -8 32 0 M44 94 q16 -8 32 0 M48 102 q12 -6 24 0"/></g>'
      + '<path d="M34 72 q-10 12 -4 26 q10 -4 14 -14 Z" fill="#7FC9A8" opacity=".9"/>'
      + '<path d="M86 72 q10 12 4 26 q-10 -4 -14 -14 Z" fill="#7FC9A8" opacity=".9"/>',
    front: '<path d="M34 62 q-14 4 -18 16 q12 -2 18 -10" fill="none" stroke="#E5BE5E" stroke-width="2.2" stroke-linecap="round"/>'
      + '<path d="M86 62 q14 4 18 16 q-12 -2 -18 -10" fill="none" stroke="#E5BE5E" stroke-width="2.2" stroke-linecap="round"/>'
      + '<ellipse cx="60" cy="66" rx="9" ry="5" fill="' + c.dark + '"/><circle cx="56" cy="66" r="1.4" fill="#4A3728"/><circle cx="64" cy="66" r="1.4" fill="#4A3728"/>',
    noMouth: true
  }),
  qilin: (c) => ({
    glow: true,
    ears: '<path d="M58 28 Q56 8 60 0 Q66 10 62 28 Z" fill="#E5BE5E"/>'
      + '<g stroke="#E5BE5E" stroke-width="1.6" fill="none"><path d="M58 22 q4 -2 4 -6 M58 14 q4 -2 4 -6"/></g>'
      + '<path d="M30 44 q-8 -14 0 -24 q10 8 10 20 Z" fill="#9FD8F0"/><path d="M90 44 q8 -14 0 -24 q-10 8 -10 20 Z" fill="#9FD8F0"/>',
    behind: '<path d="M86 94 q26 -2 26 -24 q-8 16 -26 16 Z" fill="#9FD8F0"/>'
      + '<circle cx="108" cy="66" r="9" fill="#CFEBF8"/><circle cx="118" cy="72" r="6" fill="#CFEBF8"/>',
    overBody: '<g fill="none" stroke="#9FD8F0" stroke-width="1.8" opacity=".9"><path d="M42 82 q9 -7 18 0 q9 -7 18 0 M40 92 q10 -7 20 0 q10 -7 20 0"/></g>'
      + '<g fill="#E5BE5E" opacity=".9"><path d="M36 100 q-6 6 -2 12 q8 -2 10 -10 Z"/><path d="M84 100 q6 6 2 12 q-8 -2 -10 -10 Z"/></g>',
    front: '<path d="M28 46 q-8 12 -4 24 q10 -8 12 -20 Z" fill="#E5BE5E" opacity=".7"/>'
      + '<path d="M92 46 q8 12 4 24 q-10 -8 -12 -20 Z" fill="#E5BE5E" opacity=".7"/>'
  }),
  pixiu: (c) => ({
    glow: true,
    ears: '<path d="M52 26 Q56 6 60 0 Q66 8 64 26 Z" fill="#E5BE5E"/>'
      + '<path d="M32 40 q-6 -12 2 -20 q8 8 8 18 Z" fill="' + c.dark + '"/><path d="M88 40 q6 -12 -2 -20 q-8 8 -8 18 Z" fill="' + c.dark + '"/>',
    behind: '<g fill="#E5BE5E" opacity=".95"><circle cx="16" cy="66" r="8"/><circle cx="16" cy="66" r="3" fill="#B9913B"/>'
      + '<circle cx="104" cy="52" r="7"/><circle cx="104" cy="52" r="2.6" fill="#B9913B"/>'
      + '<circle cx="112" cy="86" r="9"/><circle cx="112" cy="86" r="3.2" fill="#B9913B"/></g>'
      + '<path d="M28 78 q-18 -10 -18 -28 q14 12 22 22 Z" fill="#F2D18A"/>'
      + '<path d="M92 78 q18 -10 18 -28 q-14 12 -22 22 Z" fill="#F2D18A"/>',
    overBody: '<path d="M60 66 q-20 6 -22 22 q22 8 44 0 q-2 -16 -22 -22 Z" fill="#E5BE5E" opacity=".45"/>'
      + '<g stroke="#B9913B" stroke-width="1.6" fill="none" opacity=".8"><path d="M46 92 q14 -6 28 0"/></g>',
    front: '<g fill="#E5BE5E"><path d="M24 46 q-10 8 -10 18 q10 -4 14 -14 Z" opacity=".8"/><path d="M96 46 q10 8 10 18 q-10 -4 -14 -14 Z" opacity=".8"/></g>'
      + '<ellipse cx="60" cy="66" rx="8" ry="4.6" fill="' + c.dark + '"/>',
    noMouth: true
  }),
  crane: (c) => ({
    glow: true, feet: false,
    ears: '<path d="M46 34 Q60 20 74 34 Q60 28 46 34 Z" fill="#D34F4F"/>',
    behind: '<path d="M88 92 q28 10 30 30 q-22 0 -32 -14 Z" fill="#FFFFFF"/>'
      + '<path d="M100 108 q16 8 18 18 q-14 0 -22 -10 Z" fill="#3A3348"/>',
    overBody: '<path d="M32 76 q-10 18 0 34 q14 -4 18 -16 q-6 -14 -18 -18 Z" fill="#FFFFFF"/>'
      + '<path d="M88 76 q10 18 0 34 q-14 -4 -18 -16 q6 -14 18 -18 Z" fill="#FFFFFF"/>'
      + '<path d="M34 104 q8 6 14 6 q-2 4 -8 4 Z" fill="#3A3348"/><path d="M86 104 q-8 6 -14 6 q2 4 8 4 Z" fill="#3A3348"/>'
      + '<g stroke="#D9C9A8" stroke-width="2.4" stroke-linecap="round"><path d="M52 110 v8 M68 110 v8"/></g>',
    front: '<path d="M55 62 L60 82 L65 62 Z" fill="#E8A33C"/><path d="M57 62 L60 74 L63 62 Z" fill="#C4813C"/>',
    noMouth: true, blushY: 58
  }),
  pegasus: (c) => ({
    glow: true,
    ears: '<path d="M42 34 Q38 16 44 8 Q52 18 50 32 Z" fill="' + c.body + '"/><path d="M78 34 Q82 16 76 8 Q68 18 70 32 Z" fill="' + c.body + '"/>'
      + '<path d="M60 26 Q44 18 34 26 Q46 24 52 30 Z" fill="#C9B0EA"/>'
      + '<path d="M60 20 Q46 10 34 16 Q48 16 56 24 Z" fill="#E0D2F7"/>',
    behind: '<path d="M28 74 q-26 -14 -24 -38 q18 18 30 30 Z" fill="#FFFFFF"/>'
      + '<path d="M92 74 q26 -14 24 -38 q-18 18 -30 30 Z" fill="#FFFFFF"/>'
      + '<path d="M30 80 q-22 -6 -24 -24 q16 12 28 18 Z" fill="#E0D2F7"/>'
      + '<path d="M90 80 q22 -6 24 -24 q-16 12 -28 18 Z" fill="#E0D2F7"/>'
      + '<path d="M86 98 q22 4 24 22 q-18 -2 -26 -12 Z" fill="#C9B0EA"/>',
    front: '<ellipse cx="60" cy="68" rx="11" ry="8" fill="' + c.dark + '"/>'
      + '<ellipse cx="56" cy="66" rx="1.8" ry="2.4" fill="#4A3728"/><ellipse cx="64" cy="66" rx="1.8" ry="2.4" fill="#4A3728"/>'
      + '<path d="M40 46 Q28 40 22 46 Q34 46 40 54 Z" fill="#E0D2F7"/>',
    overBody: '<g fill="#FFF3C4" opacity=".9"><circle cx="44" cy="82" r="2"/><circle cx="76" cy="88" r="1.8"/><circle cx="58" cy="76" r="1.6"/></g>',
    noMouth: true
  })
};

function petSVG(kind, coat, mood, wear) {
  const c = coat || PET_COATS[0];
  const luck = petLuck(kind);
  const art = (PET_ART[kind] || PET_ART.cat)(c);
  const happy = mood === 'happy';
  const eyeY = art.eyeY || 54, blushY = art.blushY || 62;
  const eye = (x) => happy
    ? '<path d="M' + (x - 5) + ' ' + eyeY + ' q5 -6 10 0" fill="none" stroke="' + c.ink + '" stroke-width="2.6" stroke-linecap="round"/>'
    : '<ellipse cx="' + x + '" cy="' + eyeY + '" rx="3.4" ry="4.4" fill="' + c.ink + '"/><circle cx="' + (x + 1.2) + '" cy="' + (eyeY - 1.8) + '" r="1.2" fill="#fff"/>';
  const face = eye(50) + eye(70)
    + (art.noMouth ? '' : '<path d="M56 64 q4 4 8 0" fill="none" stroke="' + c.ink + '" stroke-width="2.4" stroke-linecap="round"/>')
    + '<ellipse cx="40" cy="' + blushY + '" rx="5" ry="3.2" fill="#F2A9BE" opacity=".55"/>'
    + '<ellipse cx="80" cy="' + blushY + '" rx="5" ry="3.2" fill="#F2A9BE" opacity=".55"/>';
  // The charm at the throat says which luck this one carries. A shelled or
  // armoured creature wears it lower, where the throat is covered.
  const charmY = art.charmY || 80;
  const neck = (art.charmY ? '' : '<path d="M42 74 q18 9 36 0" fill="none" stroke="' + luck.ink + '" stroke-width="2.4" stroke-linecap="round" opacity=".9"/>')
    + '<circle cx="60" cy="' + charmY + '" r="6.4" fill="' + luck.ink + '"/><circle cx="60" cy="' + charmY + '" r="3" fill="' + luck.aura + '"/>';
  let worn = '';
  const w = (wear && wear.id) || 'none';
  if (w === 'scarf') {
    worn = '<path d="M38 72 q22 14 44 0 q2 8 -4 12 q-18 9 -36 0 q-6 -4 -4 -12 Z" fill="#E1607F"/>'
      + '<path d="M74 82 q10 8 6 20 q-8 2 -12 -4 Z" fill="#C94C6C"/>';
  } else if (w === 'bell') {
    worn = '<circle cx="60" cy="' + charmY + '" r="6.4" fill="#E5BE5E" stroke="#B9913B" stroke-width="1.4"/>'
      + '<path d="M55 ' + charmY + ' h10" stroke="#B9913B" stroke-width="1.4"/><circle cx="60" cy="' + (charmY + 4) + '" r="1.6" fill="#8A6B22"/>';
  } else if (w === 'crown') {
    const bud = (x, y, col) => [0, 72, 144, 216, 288].map((a) => '<ellipse cx="' + x + '" cy="' + (y - 3.4) + '" rx="2.2" ry="3.4" fill="' + col + '" transform="rotate(' + a + ' ' + x + ' ' + y + ')"/>').join('') + '<circle cx="' + x + '" cy="' + y + '" r="1.6" fill="#FFE9A8"/>';
    worn = '<path d="M34 36 Q60 22 86 36" fill="none" stroke="#8FBF7F" stroke-width="2.4"/>'
      + bud(38, 35, '#F7A9C6') + bud(52, 28, '#FFF3C4') + bud(68, 28, '#F7A9C6') + bud(82, 35, '#C9B0EA');
  } else if (w === 'hat') {
    worn = '<ellipse cx="60" cy="34" rx="30" ry="7" fill="#E8CFA0"/><path d="M38 34 L60 6 L82 34 Z" fill="#F0DFC8" stroke="#C6A98A" stroke-width="1.6"/>'
      + '<path d="M46 28 q14 -6 28 0" fill="none" stroke="#C6A98A" stroke-width="1.4"/>'
      + '<path d="M60 8 A9 9 0 1 0 60 26 A7 7 0 1 1 60 8 Z" fill="#E5BE5E"/>';
  }
  const head = '<ellipse cx="60" cy="56" rx="29" ry="26" fill="' + c.body + '"/>' + face + (art.front || '');
  const headed = art.head
    ? '<g transform="translate(60,' + (56 + (art.headY || 0)) + ') scale(' + art.head + ') translate(-60,-56)">' + head + '</g>'
    : head;
  return '<svg viewBox="0 0 120 120" class="petart' + (art.glow ? ' myth' : '') + '" role="img" aria-label="' + esc(L(PET_NAMES[kind])) + '">'
    + '<ellipse cx="60" cy="112" rx="32" ry="6" fill="#C9A5D8" opacity=".28"/>'
    + (art.behind || '')
    + '<ellipse cx="60" cy="88" rx="30" ry="23" fill="' + c.body + '"/>'
    + '<ellipse cx="60" cy="92" rx="18" ry="14" fill="#FFF7EE" opacity=".55"/>'
    + (art.feet === false ? '' : '<ellipse cx="38" cy="104" rx="8" ry="5" fill="' + c.dark + '"/><ellipse cx="82" cy="104" rx="8" ry="5" fill="' + c.dark + '"/>')
    + (art.overBody || '') + (art.ears || '') + headed + neck + worn
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
      + '<div class="petstage" id="petstage">' + petHomeSVG(PETS.home(p).id) + petAuraHTML(p.kind) + petSVG(p.kind, coat, ready ? '' : 'happy', PETS.wear(p)) + '<span class="crumbs" id="crumbs"></span><span class="toys" id="toys"></span></div>'
      + '<div class="lucktag" style="--ink:' + luck.ink + ';--aura:' + luck.aura + '">' + luck.sym + ' ' + esc(S.petBrings(L(luck.name))) + '</div>'
      + '<p class="petline">' + esc(L(petLine(p.kind))) + '</p>'
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
      + (PETS.canPlay(p)
        ? '<button class="btn block" id="playbtn" style="margin-top:10px">🧶 ' + esc(S.petPlay) + ' · ' + esc(S.petPlayLeft(PETS.playLeft(p))) + '</button>'
        : '<p class="hint ok">' + esc(S.petPlayDone) + '</p>' + (pro ? '' : '<p class="hint">' + esc(S.petPlayMore) + '</p>'))
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
    const play = $('#playbtn');
    if (play) play.addEventListener('click', () => {
      if (busy) return;
      busy = true; play.disabled = true;
      const stage = $('#petstage'), toys = $('#toys');
      stage.classList.add('playing');
      let html = '';
      for (let i = 0; i < 5; i++) {
        const toy = PET_TOYS[Math.floor(Math.random() * PET_TOYS.length)];
        html += '<i style="left:' + (10 + i * 17) + '%;bottom:' + (16 + (i % 3) * 8) + '%;--tx:' + (i % 2 ? 34 : -34) + 'px;animation-delay:' + (i * 160) + 'ms">' + toy + '</i>';
      }
      toys.innerHTML = html;
      setTimeout(() => {
        const got = PETS.play(p);
        busy = false; draw();
        toast(got.to > got.from ? S.petLevelUp(got.to, fmtNum(got.up)) : S.petPlayThanks);
      }, 1500);
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
    const pets = PETS.all();
    const tile = (k) => {
      const luck = petLuck(k), have = !!PETS.one(k), locked = !have && !PETS.mayKeep(k);
      return '<button type="button" class="pp luck-' + luck.id + (have ? ' have' : '') + (locked ? ' locked' : '') + (petIsPro(k) ? ' myth' : '') + '" data-kind="' + k + '">'
        + '<span class="ppart">' + petAuraHTML(k, 3) + petSVG(k, PET_COATS[0], 'happy') + '</span>'
        + '<b>' + esc(L(PET_NAMES[k])) + '</b>'
        + '<span class="pl" style="--ink:' + luck.ink + ';--aura:' + luck.aura + '">' + luck.sym + ' ' + esc(L(luck.name)) + '</span>'
        + (have ? '<span class="pp-on">✓</span>' : (locked ? '<span class="pp-lock">🔒</span>' : ''))
        + '</button>';
    };
    const free = PET_KINDS.filter((k) => !petIsPro(k)), myth = PET_KINDS.filter(petIsPro);
    m.innerHTML = '<div class="eyebrow">' + esc(S.actTitle) + '</div><h1 style="margin-bottom:6px">🐾 ' + esc(pets.length ? S.petAdd : S.petTitle) + '</h1><p class="muted">' + esc(S.petPick) + '</p>'
      + (PETS.room() ? '' : '<a class="salebar" href="#/unlock"><span class="tag">✨ ' + esc(S.plusName) + '</span><span class="txt">' + esc(S.petPlusPitch) + '</span><span class="go">' + esc(S.unlockLink) + ' ›</span></a>')
      + '<div class="sec"><h2 style="margin-bottom:4px">' + esc(S.petPickFree) + '</h2><p class="hint" style="margin-bottom:10px">' + esc(S.petPickFreeNote) + '</p>'
      + '<div class="petpick">' + free.map(tile).join('') + '</div></div>'
      + '<div class="sec"><h2 style="margin-bottom:4px">✨ ' + esc(S.petPickPro) + '</h2><p class="hint" style="margin-bottom:10px">' + esc(S.petPickProNote) + '</p>'
      + '<div class="petpick">' + myth.map(tile).join('') + '</div></div>'
      + '<p class="hint">' + esc(S.petLuckNote) + '</p>'
      + '<p style="margin-top:14px"><a href="#/play" class="backlink" id="petback">← ' + esc(pets.length ? S.petBack : S.actTitle) + '</a></p>';
    $$('[data-kind]', m).forEach((b) => b.addEventListener('click', () => {
      const k = b.getAttribute('data-kind');
      if (PETS.one(k)) { open = k; draw(); return; }
      if (petIsPro(k) && !proOn()) { toast(S.petMythPlus); location.hash = '#/unlock'; return; }
      // No room and no Plus means this is a swap, not an extra companion.
      if (!PETS.room()) {
        if (!confirm(S.petSwapAsk)) return;
        PETS.all().forEach((x) => PETS.drop(x.kind));
      }
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
