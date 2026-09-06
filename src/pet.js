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

const PET_KINDS = ['cat', 'fox', 'bunny', 'turtle', 'deer', 'swallow',
  'phoenix', 'ninetails', 'dragon', 'tiger', 'qilin', 'owl', 'pixiu', 'toad', 'crane', 'kimquy', 'pegasus', 'eagle'];
/* The six ordinary companions are free, one of them at a time. The six spirit
   beasts below them belong to Nabu Tarot Plus, which also lifts the limit of
   one, so a subscriber can keep every corner of life covered at once. */
const PET_PRO = { phoenix: true, ninetails: true, dragon: true, tiger: true, qilin: true, owl: true,
  pixiu: true, toad: true, crane: true, kimquy: true, pegasus: true, eagle: true };
/* A spirit beast learns twice as fast from every meal and every game. */
const MYTH_XP = 2;
const PET_NAMES = {
  cat: { vi: 'Mèo Trăng', en: 'Moon cat' },
  fox: { vi: 'Cáo Sao', en: 'Star fox' },
  bunny: { vi: 'Thỏ Mây', en: 'Cloud bunny' },
  turtle: { vi: 'Rùa Ngọc', en: 'Jade turtle' },
  deer: { vi: 'Hươu Lành', en: 'Gentle deer' },
  swallow: { vi: 'Én Gió', en: 'Wind swallow' },
  phoenix: { vi: 'Phượng Hoàng', en: 'Phoenix' },
  ninetails: { vi: 'Hồ Chín Đuôi', en: 'Nine-tailed fox' },
  dragon: { vi: 'Rồng Mây', en: 'Cloud dragon' },
  tiger: { vi: 'Bạch Hổ', en: 'White tiger' },
  qilin: { vi: 'Kỳ Lân', en: 'Qilin' },
  owl: { vi: 'Cú Trăng', en: 'Moon owl' },
  pixiu: { vi: 'Tỳ Hưu', en: 'Pixiu' },
  toad: { vi: 'Thiềm Thừ', en: 'Money toad' },
  crane: { vi: 'Bạch Hạc', en: 'White crane' },
  kimquy: { vi: 'Kim Quy', en: 'Golden turtle' },
  pegasus: { vi: 'Thiên Mã', en: 'Sky horse' },
  eagle: { vi: 'Đại Bàng Vàng', en: 'Golden eagle' }
};

/* ---- what each one looks after ---- */
const PET_LUCK = {
  cat: 'love', fox: 'career', bunny: 'study', turtle: 'money', deer: 'health', swallow: 'travel',
  phoenix: 'love', ninetails: 'love', dragon: 'career', tiger: 'career', qilin: 'study', owl: 'study',
  pixiu: 'money', toad: 'money', crane: 'health', kimquy: 'health', pegasus: 'travel', eagle: 'travel'
};
/* Each spirit beast says its own version of its corner's promise. */
const PET_LINES = {
  phoenix: { vi: 'Phượng Hoàng bay qua những gì đã cũ và mở ra một mùa mới cho trái tim bạn.', en: 'The phoenix flies over what is finished and opens a new season for your heart.' },
  ninetails: { vi: 'Hồ Chín Đuôi có chín đuôi và chín cách khiến người ta nhớ đến bạn.', en: 'The nine-tailed fox has nine tails and nine ways of making you remembered.' },
  dragon: { vi: 'Rồng Mây cưỡi gió đưa tên bạn đi xa hơn những gì bạn tự nói về mình.', en: 'The cloud dragon rides the wind and carries your name further than you could speak it.' },
  tiger: { vi: 'Bạch Hổ đứng sau lưng bạn trong mọi cuộc thương lượng, nên không ai dám coi nhẹ bạn.', en: 'The white tiger stands behind you in every negotiation, so nobody takes you lightly.' },
  qilin: { vi: 'Kỳ Lân chỉ hiện ra với người chịu học, và nó đang đứng cạnh bàn của bạn.', en: 'The qilin shows itself only to those who keep studying, and it is standing by your desk.' },
  owl: { vi: 'Cú Trăng thức cùng bạn tới khuya và nhìn thấy những gì bạn còn bỏ sót.', en: 'The moon owl sits up late with you and sees what you are still missing.' },
  pixiu: { vi: 'Tỳ Hưu chỉ nuốt vào mà không nhả ra, nên của cải ở lại trong nhà bạn.', en: 'The pixiu swallows and never gives back, so what comes in stays in your house.' },
  toad: { vi: 'Thiềm Thừ ngậm đồng tiền vàng ngay cửa, ai bước vào cũng mang lộc theo.', en: 'The money toad sits at the door with a gold coin in its mouth, and everyone who enters brings something in.' },
  crane: { vi: 'Bạch Hạc sống rất thọ, và nó đứng canh giấc ngủ của bạn mỗi đêm.', en: 'The white crane lives a long life, and it keeps watch over your sleep.' },
  kimquy: { vi: 'Kim Quy đi chậm qua trăm năm, nên bên nó chuyện gì cũng kịp lành.', en: 'The golden turtle walks slowly through a hundred years, so beside it everything has time to heal.' },
  pegasus: { vi: 'Thiên Mã đi cùng người đi xa, dù là đi làm hay đi chơi, để bạn thượng lộ bình an và về đến nhà nguyên vẹn.', en: 'The sky horse rides with whoever goes far, for work or for pleasure, and sees them safely there and safely home.' },
  eagle: { vi: 'Đại Bàng Vàng nhìn thấy cả chặng đường trước khi bạn cất bước, nên bạn không đi lạc.', en: 'The golden eagle sees the whole road before you take a step, so you do not lose your way.' }
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
    line: { vi: 'Én Gió bay rất xa rồi vẫn về đúng tổ, nên đường bạn đi cũng luôn có lối về bình an.', en: 'The wind swallow flies far and still finds its own nest, so your road always has a safe way back.' },
    proLine: { vi: 'Thiên Mã đi cùng người đi xa, dù là đi làm hay đi chơi, để bạn thượng lộ bình an và về đến nhà nguyên vẹn.', en: 'The sky horse rides with whoever goes far, for work or for pleasure, and sees them safely there and safely home.' }
  }
};
const petLuck = (kind) => LUCKS[PET_LUCK[kind] || 'love'];
const petIsPro = (kind) => !!PET_PRO[kind];
/* A spirit beast says the grander version of the same promise. */
const petLine = (kind) => PET_LINES[kind] || petLuck(kind).line;

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
    { vi: 'Chuyến đi sắp tới của bạn thuận buồm xuôi gió. Bạn cứ yên tâm lên đường.', en: 'The journey ahead of you runs smooth. Set out with an easy mind.' },
    { vi: 'Bạn kiểm tra lại giấy tờ và giờ khởi hành một lần nữa, rồi đi cho nhẹ lòng.', en: 'Check your papers and your departure time once more, then travel light in your mind.' },
    { vi: 'Đi xa thì nhớ giữ sức. Đến nơi bình an quan trọng hơn đến nơi thật sớm.', en: 'Look after yourself out there. Arriving safe matters more than arriving early.' },
    { vi: 'Dù chuyến này là đi làm hay đi chơi, vẫn có người trông chừng bạn từ xa.', en: 'Whether this trip is for work or for pleasure, someone is watching over you from home.' },
    { vi: 'Đường có thể đổi, nhưng bạn vẫn sẽ đến nơi. Bạn đừng lo lắng quá.', en: 'The road may change, and you will still arrive. Do not worry so much.' },
    { vi: 'Thượng lộ bình an. Về đến nơi rồi bạn nhắn một câu cho người đang đợi.', en: 'Safe travels. Send word to whoever is waiting once you are there.' }
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
const PET_PAT_XP = 4;
/* How far a finger has to travel before a stroke counts. */
const PET_PAT_DIST = 260;
const PET_TOYS = ['🧶', '🦋', '🎈', '🍃', '✨', '🪁'];
const PET_FREE_MAX = 1;
/* A companion is a fortnight's commitment. Changing one starts the new one
   at level one, so the choice is worth making slowly. */
const PET_CHANGE_GAP = 14 * 86400000;
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
  /* When the last change happened, and when the next one is allowed. */
  changedAt() { return Math.max(0, Number(store.get('nabu-pet-change', 0)) || 0); },
  markChange() { store.set('nabu-pet-change', Date.now()); },
  changeLeft() { return this.all().length ? Math.max(0, this.changedAt() + PET_CHANGE_GAP - Date.now()) : 0; },
  canChange() { return this.changeLeft() <= 0; },
  changeOn() { const d = new Date(this.changedAt() + PET_CHANGE_GAP); return isoDate(d); },
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
    const sum = 10 + Math.max(0, days) + food + wear + home + coat;
    const myth = petIsPro(p.kind) ? MYTH_XP : 1;
    return { meal: 10, days: Math.max(0, days), food: food, wear: wear, home: home, coat: coat,
      myth: myth, total: sum * myth };
  },
  /* A streak counts one day at a time, however many meals are given that day.
     Feeding pays experience and a few coins; crossing a level pays more. */
  feed(p) {
    const today = isoDate(new Date());
    const y = new Date(); y.setDate(y.getDate() - 1);
    if (p.fed !== today) p.streak = p.fed === isoDate(y) ? (Number(p.streak) || 0) + 1 : 1;
    const before = petLevel(p.xp);
    const good = !!this.food(p).add;
    const learnt = this.addXP(p, this.gain(p).total);
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
    return { coins: coins, up: up, from: before, to: after, xp: learnt };
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
    const learnt = this.addXP(p, 12 * (petIsPro(p.kind) ? MYTH_XP : 1));
    const coins = BANK.earnDay(3);
    const after = petLevel(p.xp);
    let up = 0;
    for (let lv = before + 1; lv <= after; lv++) { BANK.earn(levelCoins(lv)); up += levelCoins(lv); }
    BANK.mark(after);
    this.put(p);
    return { coins: coins, up: up, from: before, to: after, xp: learnt };
  },
  /* Playing is the other half of caring for one: once a day for everyone,
     three times a day with Plus. It pays more experience than a meal, because
     it is the thing a person has to make time for. */
  playCap() { return proOn() ? 3 : 1; },
  playedToday(p) { return p && p.playDay === isoDate(new Date()) ? Math.max(0, Number(p.playN) || 0) : 0; },
  playLeft(p) { return Math.max(0, this.playCap() - this.playedToday(p)); },
  canPlay(p) { return this.playLeft(p) > 0; },
  /* Playing is the other half of caring for one: once a day for everyone,
     three times a day with Plus. It pays more experience than a meal, because
     it is the thing a person has to make time for. */
  playCap() { return proOn() ? 3 : 1; },
  playedToday(p) { return p && p.playDay === isoDate(new Date()) ? Math.max(0, Number(p.playN) || 0) : 0; },
  playLeft(p) { return Math.max(0, this.playCap() - this.playedToday(p)); },
  canPlay(p) { return this.playLeft(p) > 0; },
  /* One wish a day, and the answer stays on the card until tomorrow. */
  pray(p) {
    const pool = PET_BLESS[petLuck(p.kind).id];
    p.pray = isoDate(new Date());
    p.bless = Math.floor(Math.random() * pool.length);
    this.addXP(p, 6);
    BANK.mark(petLevel(p.xp));
    return this.put(p);
  },
  blessing(p) { return PET_BLESS[petLuck(p.kind).id][Number(p.bless) || 0]; },
  /* Experience is added through here so the daily ceiling is kept in one
     place, and so the card can say how much of it is left. */
  xpToday() {
    const rec = store.get('nabu-xp-day', null) || {};
    return rec.d === isoDate(new Date()) ? Math.max(0, Number(rec.n) || 0) : 0;
  },
  xpLeft() { return Math.max(0, PET_DAY_XP - this.xpToday()); },
  addXP(p, want) {
    const give = Math.max(0, Math.min(Math.round(want), this.xpLeft()));
    if (give) {
      p.xp = (Number(p.xp) || 0) + give;
      store.set('nabu-xp-day', { d: isoDate(new Date()), n: this.xpToday() + give });
    }
    return give;
  },
  /* Experience is added through here so the daily ceiling is kept in one
     place, and so the card can say how much of it is left. */
  xpToday() {
    const rec = store.get('nabu-xp-day', null) || {};
    return rec.d === isoDate(new Date()) ? Math.max(0, Number(rec.n) || 0) : 0;
  },
  xpLeft() { return Math.max(0, PET_DAY_XP - this.xpToday()); },
  addXP(p, want) {
    const give = Math.max(0, Math.min(Math.round(want), this.xpLeft()));
    if (give) {
      p.xp = (Number(p.xp) || 0) + give;
      store.set('nabu-xp-day', { d: isoDate(new Date()), n: this.xpToday() + give });
    }
    return give;
  },
  /* Experience is added through here so the daily ceiling is kept in one
     place, and so the card can say how much of it is left. */
  xpToday() {
    const rec = store.get('nabu-xp-day', null) || {};
    return rec.d === isoDate(new Date()) ? Math.max(0, Number(rec.n) || 0) : 0;
  },
  xpLeft() { return Math.max(0, PET_DAY_XP - this.xpToday()); },
  addXP(p, want) {
    const give = Math.max(0, Math.min(Math.round(want), this.xpLeft()));
    if (give) {
      p.xp = (Number(p.xp) || 0) + give;
      store.set('nabu-xp-day', { d: isoDate(new Date()), n: this.xpToday() + give });
    }
    return give;
  },
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
    /* Rounder ears, a small snout and a big curled brush: a fox, but a soft
       one, because it sits beside a cat and a rabbit. */
    bodyRX: 29,
    ears: '<path d="M34 32 Q28 8 34 4 Q52 12 57 25 Z" fill="' + c.body + '"/>'
      + '<path d="M86 32 Q92 8 86 4 Q68 12 63 25 Z" fill="' + c.body + '"/>'
      + '<path d="M38 29 Q35 14 40 12 Q50 19 52 26 Z" fill="#F0A97E" opacity=".7"/>'
      + '<path d="M82 29 Q85 14 80 12 Q70 19 68 26 Z" fill="#F0A97E" opacity=".7"/>'
      + '<path d="M34 4 Q31 12 34 16 Q40 12 40 8 Z" fill="#6B4A32"/><path d="M86 4 Q89 12 86 16 Q80 12 80 8 Z" fill="#6B4A32"/>',
    behind: '<path d="M80 102 Q114 100 110 66 Q104 88 78 90 Z" fill="#E08A54"/>'
      + '<path d="M104 74 Q116 66 112 52 Q100 62 98 74 Z" fill="#FFFDF8"/>',
    overBody: '<path d="M60 68 q-14 17 -13 36 q13 6 26 0 q1 -19 -13 -36 Z" fill="#FFFDF8"/>'
      + '<ellipse cx="38" cy="104" rx="8" ry="5" fill="#6B4A32"/><ellipse cx="82" cy="104" rx="8" ry="5" fill="#6B4A32"/>',
    front: '<path d="M32 50 q-11 8 -8 20 q11 -3 15 -11 Z" fill="#FFFDF8"/>'
      + '<path d="M88 50 q11 8 8 20 q-11 -3 -15 -11 Z" fill="#FFFDF8"/>'
      + '<path d="M60 58 Q51 66 50 75 Q60 82 70 75 Q69 66 60 58 Z" fill="#FFFDF8"/>'
      + '<ellipse cx="60" cy="72" rx="4.4" ry="3.1" fill="#5A3A24"/>'
      + '<path d="M60 76 q-5 4 -9 1 M60 76 q5 4 9 1" stroke="#5A3A24" stroke-width="1.4" fill="none" stroke-linecap="round"/>'
      + '<path d="M46 68 h-12 M47 74 h-12 M74 68 h12 M73 74 h12" stroke="#8A6446" stroke-width="1" stroke-linecap="round" opacity=".6"/>',
    feet: false, eyeY: 50, noMouth: true, blushY: 60, charmY: 94
  }),
  bunny: (c) => ({
    ears: '<ellipse cx="47" cy="22" rx="7.5" ry="19" fill="' + c.body + '" transform="rotate(-8 47 22)"/>'
      + '<ellipse cx="73" cy="22" rx="7.5" ry="19" fill="' + c.body + '" transform="rotate(8 73 22)"/>'
      + '<ellipse cx="47" cy="23" rx="3.6" ry="12.5" fill="#F7C7D6" transform="rotate(-8 47 23)"/>'
      + '<ellipse cx="73" cy="23" rx="3.6" ry="12.5" fill="#F7C7D6" transform="rotate(8 73 23)"/>',
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
    /* A round little bird in soft blue, with a fat white front and a short
       tail, rather than the dark sharp thing it was. */
    feet: false, bodyRX: 28, headRX: 27, headRY: 25,
    behind: '<path d="M84 98 q26 6 30 22 q-22 2 -30 -10 Z" fill="#7E96CE"/>'
      + '<path d="M86 104 q20 12 20 24 q-16 -6 -22 -16 Z" fill="#9DB2DE"/>',
    overBody: '<path d="M34 78 q-11 17 -1 32 q15 -4 19 -15 q-6 -13 -18 -17 Z" fill="#7E96CE"/>'
      + '<path d="M86 78 q11 17 1 32 q-15 -4 -19 -15 q6 -13 18 -17 Z" fill="#7E96CE"/>'
      + '<g stroke="#B9C8E8" stroke-width="1.5" opacity=".8" fill="none"><path d="M38 88 q9 6 11 14 M82 88 q-9 6 -11 14"/></g>'
      + '<ellipse cx="60" cy="94" rx="19" ry="15" fill="#FFFDF8"/>'
      + '<g stroke="#E8A33C" stroke-width="2.8" stroke-linecap="round"><path d="M53 110 v6 M67 110 v6"/></g>',
    ears: '<path d="M44 32 Q40 20 48 14 Q52 24 51 32 Z" fill="#7E96CE" opacity=".9"/>'
      + '<path d="M76 32 Q80 20 72 14 Q68 24 69 32 Z" fill="#7E96CE" opacity=".9"/>',
    front: '<path d="M60 62 L50 69 L60 76 Z" fill="#F0B24E"/><path d="M60 62 L70 69 L60 76 Z" fill="#E8A33C"/>'
      + '<path d="M50 69 h20" stroke="#C4813C" stroke-width="1"/>',
    noMouth: true, eyeY: 54, blushY: 62, charmY: 96
  }),
  /* ---- the twelve spirit beasts ----
     Two for each corner of life. Each one carries its own colours rather than
     the coat, because a phoenix is not a cream cat with wings, and its own
     proportions, because the thing that tells an owl from a tiger is the
     shape before it is the markings. All of them wear the gold halo and the
     sparks, and all of them earn double. */
  phoenix: () => ({
    glow: true, feet: false, pal: { body: '#F9DCE6', dark: '#EFA9C6', ink: '#7A2F4B' },
    bodyRX: 27, headRX: 26, headRY: 24,
    ears: '<path d="M60 30 Q52 6 60 -2 Q68 8 60 30 Z" fill="#E5BE5E"/>'
      + '<path d="M46 32 Q32 14 34 2 Q50 14 46 32 Z" fill="#F2789F"/><path d="M74 32 Q88 14 86 2 Q70 14 74 32 Z" fill="#F2789F"/>'
      + '<path d="M52 30 Q44 16 46 8 Q56 18 52 30 Z" fill="#E5BE5E" opacity=".8"/><path d="M68 30 Q76 16 74 8 Q64 18 68 30 Z" fill="#E5BE5E" opacity=".8"/>',
    behind: '<path d="M82 92 Q116 78 112 40 Q104 76 80 80 Z" fill="#E85C86"/>'
      + '<path d="M84 98 Q118 100 118 68 Q106 92 82 90 Z" fill="#F2789F"/>'
      + '<path d="M86 104 Q114 114 110 92 Q102 106 84 100 Z" fill="#E5BE5E"/>'
      + '<circle cx="106" cy="54" r="5" fill="#FFF3C4"/><circle cx="110" cy="80" r="4.2" fill="#FFF3C4"/><circle cx="104" cy="102" r="3.4" fill="#FFF3C4"/>'
      + '<path d="M32 92 Q4 80 8 50 Q18 80 36 84 Z" fill="#F7B08A"/>'
      + '<path d="M34 98 Q10 96 12 74 Q22 92 38 92 Z" fill="#E5BE5E" opacity=".8"/>',
    overBody: '<path d="M34 78 q-8 18 4 32 q13 -4 17 -17 q-7 -13 -21 -15 Z" fill="#E85C86"/>'
      + '<path d="M86 78 q8 18 -4 32 q-13 -4 -17 -17 q7 -13 21 -15 Z" fill="#E85C86"/>'
      + '<g stroke="#E5BE5E" stroke-width="1.5" fill="none" opacity=".85"><path d="M38 88 q10 5 13 14 M82 88 q-10 5 -13 14"/></g>'
      + '<path d="M60 70 q-10 14 -8 28 q10 4 16 0 q2 -14 -8 -28 Z" fill="#FFF3C4" opacity=".8"/>'
      + '<g stroke="#E8A33C" stroke-width="2.8" stroke-linecap="round"><path d="M51 110 v7 M69 110 v7"/></g>',
    front: '<path d="M54 62 L60 75 L66 62 Z" fill="#E8A33C"/><path d="M56 62 L60 69 L64 62 Z" fill="#C4813C"/>',
    noMouth: true, eyeY: 52, blushY: 60
  }),
  /* Nine tails, drawn full and fanned, and a fox's short sharp muzzle rather
     than the long jaw that made her a dog. */
  ninetails: () => ({
    glow: true, feet: false, pal: { body: '#FFFDF8', dark: '#F0C6D6', ink: '#6E2B44' },
    bodyRX: 25, bodyRY: 22,
    /* Nine plumes fanned behind her. Each is as long as it can be at its own
       angle without leaving the square, so the fan fills the frame instead of
       being cropped into stubs. */
    behind: (() => {
      const R = Math.PI / 180;
      let out = '';
      [-74, -56, -37, -18, 0, 18, 37, 56, 74].forEach((a) => {
        const s0 = Math.sin(a * R), c0 = Math.cos(a * R);
        const bx = 60, by = 102;
        const room = Math.min(Math.abs(s0) > 0.05 ? 54 / Math.abs(s0) : 999, Math.abs(c0) > 0.05 ? 92 / Math.abs(c0) : 999);
        const len = Math.min(88, room);
        const tipX = bx + s0 * len, tipY = by - c0 * len;
        const midX = bx + s0 * len * 0.5, midY = by - c0 * len * 0.5;
        const w = 13;
        const p = (k) => [midX + c0 * w * k, midY + s0 * w * k];
        const l = p(1), r = p(-1);
        out += '<path d="M' + bx + ' ' + by + ' Q' + l[0].toFixed(1) + ' ' + l[1].toFixed(1) + ' ' + tipX.toFixed(1) + ' ' + tipY.toFixed(1)
          + ' Q' + r[0].toFixed(1) + ' ' + r[1].toFixed(1) + ' ' + bx + ' ' + by + ' Z" fill="#FFFDF8" stroke="#EFC3D4" stroke-width="1.3"/>';
        const nx = bx + s0 * len * 0.72, ny = by - c0 * len * 0.72;
        const q = (k) => [nx + c0 * 7 * k, ny + s0 * 7 * k];
        const ql = q(1), qr = q(-1);
        out += '<path d="M' + nx.toFixed(1) + ' ' + ny.toFixed(1) + ' Q' + ql[0].toFixed(1) + ' ' + ql[1].toFixed(1) + ' ' + tipX.toFixed(1) + ' ' + tipY.toFixed(1)
          + ' Q' + qr[0].toFixed(1) + ' ' + qr[1].toFixed(1) + ' ' + nx.toFixed(1) + ' ' + ny.toFixed(1) + ' Z" fill="#F2789F" opacity=".9"/>';
      });
      return out;
    })(),
    // A wedge: wide at the brow, cheeks flared, narrowing to a small chin.
    headPath: 'M60 24 Q35 26 31 47 Q28 62 42 69 Q51 74 55 83 Q58 88 60 88 Q62 88 65 83 Q69 74 78 69 Q92 62 89 47 Q85 26 60 24 Z',
    ears: '<path d="M34 30 L26 0 L58 20 Z" fill="#FFFDF8" stroke="#EFC3D4" stroke-width="1.2"/>'
      + '<path d="M86 30 L94 0 L62 20 Z" fill="#FFFDF8" stroke="#EFC3D4" stroke-width="1.2"/>'
      + '<path d="M38 27 L33 9 L51 21 Z" fill="#F2789F" opacity=".55"/><path d="M82 27 L87 9 L69 21 Z" fill="#F2789F" opacity=".55"/>',
    overBody: '<path d="M60 74 q-10 14 -9 28 q9 5 18 0 q1 -14 -9 -28 Z" fill="#FDEFF4"/>',
    front: (() => {
      // The ruff at each cheek, which is what a fox has and a dog does not.
      const ruff = '<path d="M34 57 q-10 5 -12 14 q9 -2 13 -8 q-3 7 -10 12 q11 -1 16 -11 Z" fill="#FFFDF8" stroke="#EFC3D4" stroke-width="1"/>'
        + '<path d="M86 57 q10 5 12 14 q-9 -2 -13 -8 q3 7 10 12 q-11 -1 -16 -11 Z" fill="#FFFDF8" stroke="#EFC3D4" stroke-width="1"/>';
      // Slanted eyes with liner running back towards the ears.
      const eyes = '<g class="eyes">'
        + '<path d="M41 50 Q48 44 56 52 Q47 55.5 41 50 Z" fill="#6E2B44"/>'
        + '<path d="M79 50 Q72 44 64 52 Q73 55.5 79 50 Z" fill="#6E2B44"/>'
        + '<circle cx="47" cy="49" r="1.5" fill="#fff"/><circle cx="73" cy="49" r="1.5" fill="#fff"/>'
        + '<path d="M41 50 q-6 -3 -9 -7 M79 50 q6 -3 9 -7" stroke="#6E2B44" stroke-width="1.8" fill="none" stroke-linecap="round"/>'
        + '</g>';
      const snout = '<path d="M54 60 Q53 71 57 78 Q60 81 63 78 Q67 71 66 60 Z" fill="#FFFDF8" stroke="#E8B4C8" stroke-width="1"/>'
        + '<path d="M56.5 73 Q60 72 63.5 73 Q61.5 79 60 79 Q58.5 79 56.5 73 Z" fill="#4E1E32"/>'
        + '<path d="M60 79 q-4 4 -7 1 M60 79 q4 4 7 1" stroke="#4E1E32" stroke-width="1.2" fill="none" stroke-linecap="round"/>';
      const mark = '<path d="M53 34 q7 -4 14 0" stroke="#E5BE5E" stroke-width="2.2" fill="none" stroke-linecap="round"/>'
        + '<circle cx="60" cy="30" r="3" fill="#E5BE5E"/>';
      return ruff + eyes + snout + mark;
    })(),
    noFace: true, noMouth: true, charmY: 98
  }),
  dragon: () => ({
    glow: true, pal: { body: '#C6EEDA', dark: '#7FC9A8', ink: '#12452F' },
    headRX: 27, headRY: 25,
    ears: '<g fill="#E5BE5E"><path d="M40 28 Q24 16 18 0 Q42 8 47 26 Z"/><path d="M80 28 Q96 16 102 0 Q78 8 73 26 Z"/></g>'
      + '<path d="M50 22 q10 -7 20 0 q-10 -3 -20 0 Z" fill="#4E9C7C"/>'
      + '<path d="M60 26 l4 7 -4 7 -4 -7 Z" fill="#E5BE5E" opacity=".9"/>',
    behind: '<path d="M84 96 Q118 92 114 56 Q106 86 82 86 Z" fill="#5FB894"/>'
      + '<path d="M110 60 q10 -9 8 -20 q-11 7 -13 18 Z" fill="#E5BE5E"/>'
      + '<g fill="#4E9C7C"><path d="M96 90 l6 -8 4 8 Z"/><path d="M106 80 l6 -8 3 8 Z"/><path d="M112 68 l6 -7 2 8 Z"/></g>',
    overBody: '<path d="M60 68 q-13 16 -12 34 q12 5 24 0 q1 -18 -12 -34 Z" fill="#EAF7F0"/>'
      + '<g fill="none" stroke="#4E9C7C" stroke-width="1.6" opacity=".75"><path d="M48 82 q12 -6 24 0 M46 92 q14 -6 28 0 M50 101 q10 -5 20 0"/></g>'
      + '<path d="M32 74 q-11 12 -5 27 q11 -4 15 -15 Z" fill="#7FC9A8"/>'
      + '<path d="M88 74 q11 12 5 27 q-11 -4 -15 -15 Z" fill="#7FC9A8"/>',
    // A long snout with whiskers, not a round grey nose.
    front: '<path d="M52 62 Q51 74 56 82 Q60 85 64 82 Q69 74 68 62 Z" fill="#DCF2E6" stroke="#5FB894" stroke-width="1.2"/>'
      + '<ellipse cx="56.5" cy="72" rx="1.8" ry="2.3" fill="#12452F"/><ellipse cx="63.5" cy="72" rx="1.8" ry="2.3" fill="#12452F"/>'
      + '<path d="M55 78 q5 3 10 0" stroke="#12452F" stroke-width="1.4" fill="none" stroke-linecap="round"/>'
      + '<path d="M48 66 q-16 2 -22 14 q14 -1 22 -8" fill="none" stroke="#E5BE5E" stroke-width="2.2" stroke-linecap="round"/>'
      + '<path d="M72 66 q16 2 22 14 q-14 -1 -22 -8" fill="none" stroke="#E5BE5E" stroke-width="2.2" stroke-linecap="round"/>',
    noMouth: true, eyeY: 50, blushY: 58
  }),
  /* The white tiger: a broad head, bold stripes, and a cat's flat muzzle. */
  tiger: () => ({
    glow: true, pal: { body: '#FFFDF8', dark: '#EFE4D2', ink: '#2A2438' },
    headRX: 32, headRY: 27, bodyRX: 31,
    ears: '<circle cx="34" cy="30" r="12" fill="#FFFDF8"/><circle cx="86" cy="30" r="12" fill="#FFFDF8"/>'
      + '<circle cx="34" cy="30" r="6" fill="#F2A9BE"/><circle cx="86" cy="30" r="6" fill="#F2A9BE"/>'
      + '<path d="M24 26 a12 12 0 0 1 12 -8" fill="none" stroke="#2A2438" stroke-width="3" stroke-linecap="round"/>'
      + '<path d="M96 26 a12 12 0 0 0 -12 -8" fill="none" stroke="#2A2438" stroke-width="3" stroke-linecap="round"/>',
    behind: '<path d="M86 98 q30 4 28 -24 q-8 18 -28 16 Z" fill="#FFFDF8"/>'
      + '<g stroke="#2A2438" stroke-width="3.4" stroke-linecap="round"><path d="M96 98 l3 -7 M106 92 l3 -7 M112 82 l4 -5"/></g>',
    overBody: '<path d="M60 70 q-14 16 -13 34 q13 6 26 0 q1 -18 -13 -34 Z" fill="#FBF3E6"/>'
      + '<g stroke="#2A2438" stroke-width="3.6" stroke-linecap="round" opacity=".92">'
      + '<path d="M33 76 q7 7 5 14 M31 91 q8 5 8 12 M87 76 q-7 7 -5 14 M89 91 q-8 5 -8 12"/></g>',
    front: '<path d="M26 46 q-11 9 -9 22 q12 -4 16 -12 Z" fill="#FFFDF8"/><path d="M94 46 q11 9 9 22 q-12 -4 -16 -12 Z" fill="#FFFDF8"/>'
      + '<ellipse cx="60" cy="70" rx="21" ry="13" fill="#FFFDF8"/>'
      + '<path d="M53 62 h14 l-7 8 Z" fill="#F2789F"/>'
      + '<path d="M60 70 v4 M60 74 q-7 6 -13 2 M60 74 q7 6 13 2" stroke="#2A2438" stroke-width="1.9" fill="none" stroke-linecap="round"/>'
      + '<g stroke="#2A2438" stroke-width="3.2" stroke-linecap="round"><path d="M24 44 q9 -5 15 -2 M96 44 q-9 -5 -15 -2 M26 56 q8 -3 13 -1 M94 56 q-8 -3 -13 -1"/></g>'
      + '<g stroke="#2A2438" stroke-width="2.6" stroke-linecap="round"><path d="M52 36 h16 M60 30 v14 M55 43 h10"/></g>'
      + '<g stroke="#2A2438" stroke-width="1" stroke-linecap="round" opacity=".55"><path d="M40 66 h-14 M41 72 h-14 M80 66 h14 M79 72 h14"/></g>',
    eyeY: 52, noMouth: true, blushY: 60
  }),
  qilin: () => ({
    glow: true, pal: { body: '#FDF2D6', dark: '#E8D5A0', ink: '#4A3A1A' },
    headRX: 27, headRY: 25,
    ears: '<path d="M58 26 Q55 4 60 -4 Q67 6 62 26 Z" fill="#E5BE5E"/>'
      + '<g stroke="#E5BE5E" stroke-width="1.8" fill="none"><path d="M57 20 q5 -2 5 -7 M57 11 q5 -2 5 -7"/></g>'
      + '<path d="M30 42 q-9 -14 -1 -26 q11 9 11 22 Z" fill="#7FD0F0"/><path d="M90 42 q9 -14 1 -26 q-11 9 -11 22 Z" fill="#7FD0F0"/>'
      + '<path d="M44 30 q-6 -12 0 -20 q7 7 6 18 Z" fill="#B9E6F8" opacity=".9"/><path d="M76 30 q6 -12 0 -20 q-7 7 -6 18 Z" fill="#B9E6F8" opacity=".9"/>',
    behind: '<path d="M86 94 q28 -2 28 -26 q-9 18 -28 18 Z" fill="#7FD0F0"/>'
      + '<circle cx="110" cy="62" r="10" fill="#B9E6F8"/><circle cx="119" cy="70" r="6.5" fill="#B9E6F8"/>',
    overBody: '<g fill="none" stroke="#7FD0F0" stroke-width="2" opacity=".95"><path d="M42 82 q9 -7 18 0 q9 -7 18 0 M40 92 q10 -7 20 0 q10 -7 20 0 M44 101 q8 -6 16 0 q8 -6 16 0"/></g>'
      + '<g fill="#E5BE5E"><path d="M36 100 q-6 6 -2 12 q9 -2 11 -10 Z"/><path d="M84 100 q6 6 2 12 q-9 -2 -11 -10 Z"/></g>',
    front: '<path d="M28 46 q-9 12 -5 25 q11 -8 13 -21 Z" fill="#E5BE5E" opacity=".75"/>'
      + '<path d="M92 46 q9 12 5 25 q-11 -8 -13 -21 Z" fill="#E5BE5E" opacity=".75"/>'
      + '<ellipse cx="60" cy="68" rx="9" ry="6" fill="#EFE0BC"/>'
      + '<path d="M55 66 q5 -3 10 0" stroke="#4A3A1A" stroke-width="1.4" fill="none" stroke-linecap="round"/>'
  }),
  /* The moon owl is one shape, not a head on a body: a wide face, two eyes
     that do not touch, and folded wings down the sides. */
  owl: () => ({
    glow: true, feet: false, pal: { body: '#C9B0EA', dark: '#9E82D2', ink: '#33285A' },
    headRX: 33, headRY: 29, bodyRX: 27, bodyRY: 22,
    ears: '<path d="M32 34 Q26 12 38 4 Q46 18 44 33 Z" fill="#9E82D2"/><path d="M88 34 Q94 12 82 4 Q74 18 76 33 Z" fill="#9E82D2"/>',
    behind: '<path d="M86 100 q20 10 20 24 q-18 -2 -25 -13 Z" fill="#9E82D2"/>',
    overBody: '<path d="M33 74 q-11 20 -1 36 q16 -4 20 -17 q-6 -15 -19 -19 Z" fill="#9E82D2"/>'
      + '<path d="M87 74 q11 20 1 36 q-16 -4 -20 -17 q6 -15 19 -19 Z" fill="#9E82D2"/>'
      + '<g fill="none" stroke="#7A61B4" stroke-width="1.4" opacity=".8"><path d="M37 84 q9 6 11 16 M83 84 q-9 6 -11 16 M33 92 q10 6 12 16 M87 92 q-10 6 -12 16"/></g>'
      + '<g fill="none" stroke="#E8DCF7" stroke-width="2" opacity=".85"><path d="M50 84 q10 -5 20 0 M48 94 q12 -5 24 0 M50 103 q10 -4 20 0"/></g>'
      + '<g stroke="#E8A33C" stroke-width="3" stroke-linecap="round"><path d="M52 110 v7 M68 110 v7 M48 117 h8 M64 117 h8"/></g>',
    // The facial disc, then the eyes inside it with a clear gap between them.
    front: '<path d="M60 34 Q34 38 33 58 Q32 76 60 82 Q88 76 87 58 Q86 38 60 34 Z" fill="#F3ECFF"/>'
      + '<path d="M60 34 Q34 38 33 58 Q32 76 60 82 Q88 76 87 58 Q86 38 60 34 Z" fill="none" stroke="#B49BDE" stroke-width="1.4"/>'
      + '<circle cx="47" cy="55" r="12" fill="#FFFDF8" stroke="#E5BE5E" stroke-width="1.8"/>'
      + '<circle cx="73" cy="55" r="12" fill="#FFFDF8" stroke="#E5BE5E" stroke-width="1.8"/>'
      + '<circle cx="47" cy="55" r="5.6" fill="#33285A"/><circle cx="73" cy="55" r="5.6" fill="#33285A"/>'
      + '<circle cx="49" cy="53" r="1.9" fill="#fff"/><circle cx="75" cy="53" r="1.9" fill="#fff"/>'
      + '<path d="M60 60 L55 70 L60 74 L65 70 Z" fill="#E8A33C"/>'
      + '<path d="M42 40 q18 -6 36 0" stroke="#B49BDE" stroke-width="1.4" fill="none"/>',
    noFace: true, noMouth: true, charmY: 96
  }),
  pixiu: () => ({
    glow: true, pal: { body: '#F7E3AC', dark: '#DCBE72', ink: '#5A4415' },
    headRX: 29, headRY: 26,
    ears: '<path d="M52 24 Q56 2 60 -4 Q66 4 64 24 Z" fill="#E5BE5E"/>'
      + '<path d="M32 40 q-7 -13 2 -22 q9 9 9 20 Z" fill="#DCBE72"/><path d="M88 40 q7 -13 -2 -22 q-9 9 -9 20 Z" fill="#DCBE72"/>'
      + '<g fill="#E5BE5E" opacity=".9"><path d="M40 34 q-8 -8 -6 -18 q9 5 11 16 Z"/><path d="M80 34 q8 -8 6 -18 q-9 5 -11 16 Z"/></g>',
    behind: '<g fill="#E5BE5E"><circle cx="15" cy="64" r="9"/><circle cx="15" cy="64" r="3.4" fill="#B9913B"/>'
      + '<circle cx="105" cy="50" r="7.5"/><circle cx="105" cy="50" r="2.8" fill="#B9913B"/>'
      + '<circle cx="112" cy="88" r="10"/><circle cx="112" cy="88" r="3.6" fill="#B9913B"/></g>'
      + '<path d="M28 76 q-20 -10 -20 -30 q16 13 24 24 Z" fill="#F2D18A"/>'
      + '<path d="M92 76 q20 -10 20 -30 q-16 13 -24 24 Z" fill="#F2D18A"/>'
      + '<path d="M86 98 q26 4 26 -18 q-8 14 -26 12 Z" fill="#DCBE72"/>',
    overBody: '<path d="M60 66 q-20 6 -22 22 q22 8 44 0 q-2 -16 -22 -22 Z" fill="#FDF2D0"/>'
      + '<g stroke="#B9913B" stroke-width="1.6" fill="none" opacity=".7"><path d="M46 90 q14 -6 28 0 M48 98 q12 -5 24 0"/></g>',
    front: '<g fill="#E5BE5E" opacity=".85"><path d="M24 44 q-11 9 -11 20 q11 -4 15 -15 Z"/><path d="M96 44 q11 9 11 20 q-11 -4 -15 -15 Z"/></g>'
      + '<ellipse cx="60" cy="68" rx="11" ry="7" fill="#EFDCA8"/>'
      + '<path d="M53 65 q7 -4 14 0" stroke="#5A4415" stroke-width="1.6" fill="none" stroke-linecap="round"/>'
      + '<path d="M60 70 q-6 6 -11 3 M60 70 q6 6 11 3" stroke="#5A4415" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
    noMouth: true, eyeY: 52
  }),
  toad: () => ({
    glow: true, feet: false, head: 0.82, headY: 4, pal: { body: '#B7E8C8', dark: '#7FC9A8', ink: '#1E4A32' },
    behind: '<g fill="#E5BE5E"><circle cx="20" cy="104" r="9"/><circle cx="20" cy="104" r="3.2" fill="#B9913B"/>'
      + '<circle cx="100" cy="104" r="9"/><circle cx="100" cy="104" r="3.2" fill="#B9913B"/>'
      + '<circle cx="60" cy="112" r="8"/><circle cx="60" cy="112" r="3" fill="#B9913B"/></g>',
    ears: '<circle cx="42" cy="34" r="11" fill="#8FD4A8"/><circle cx="78" cy="34" r="11" fill="#8FD4A8"/>'
      + '<circle cx="42" cy="34" r="6" fill="#E5BE5E"/><circle cx="78" cy="34" r="6" fill="#E5BE5E"/>'
      + '<circle cx="42" cy="34" r="2.6" fill="#1E4A32"/><circle cx="78" cy="34" r="2.6" fill="#1E4A32"/>',
    overBody: '<ellipse cx="60" cy="90" rx="33" ry="24" fill="#8FD4A8"/>'
      + '<ellipse cx="60" cy="96" rx="20" ry="14" fill="#DBF3E6"/>'
      + '<g fill="#6FBE8E"><circle cx="38" cy="82" r="3"/><circle cx="82" cy="82" r="3"/><circle cx="48" cy="98" r="2.4"/><circle cx="72" cy="98" r="2.4"/></g>'
      + '<ellipse cx="26" cy="104" rx="12" ry="7" fill="#6FBE8E" transform="rotate(-18 26 104)"/>'
      + '<ellipse cx="94" cy="104" rx="12" ry="7" fill="#6FBE8E" transform="rotate(18 94 104)"/>',
    front: '<path d="M40 62 q20 12 40 0" stroke="#12603C" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
      + '<circle cx="60" cy="70" r="9" fill="#E5BE5E" stroke="#B9913B" stroke-width="1.6"/>'
      + '<rect x="56.5" y="66.5" width="7" height="7" fill="#B9913B"/>',
    eyeY: 50, noMouth: true, blushY: 58, charmY: 98
  }),
  crane: () => ({
    glow: true, feet: false, pal: { body: '#FFFFFF', dark: '#E6E2DA', ink: '#3A3348' },
    headRX: 25, headRY: 24, bodyRX: 27,
    ears: '<path d="M46 32 Q60 16 74 32 Q60 26 46 32 Z" fill="#D34F4F"/>'
      + '<path d="M50 30 Q60 22 70 30 Q60 27 50 30 Z" fill="#EA6A6A"/>',
    behind: '<path d="M88 92 q30 10 32 32 q-24 0 -34 -15 Z" fill="#FFFFFF"/>'
      + '<path d="M100 110 q18 8 20 20 q-16 0 -24 -11 Z" fill="#3A3348"/>',
    overBody: '<path d="M32 74 q-11 19 0 36 q15 -4 19 -17 q-6 -15 -19 -19 Z" fill="#FFFFFF"/>'
      + '<path d="M88 74 q11 19 0 36 q-15 -4 -19 -17 q6 -15 19 -19 Z" fill="#FFFFFF"/>'
      + '<g fill="none" stroke="#DAD5CC" stroke-width="1.3"><path d="M37 84 q9 6 11 15 M83 84 q-9 6 -11 15"/></g>'
      + '<path d="M33 104 q9 7 15 7 q-2 5 -9 4 Z" fill="#3A3348"/><path d="M87 104 q-9 7 -15 7 q2 5 9 4 Z" fill="#3A3348"/>'
      + '<g stroke="#D9C9A8" stroke-width="2.6" stroke-linecap="round"><path d="M52 110 v9 M68 110 v9"/></g>',
    front: '<path d="M56 60 L60 86 L64 60 Z" fill="#E8A33C"/><path d="M58 60 L60 76 L62 60 Z" fill="#C4813C"/>'
      + '<path d="M44 66 q-14 4 -18 12" fill="none" stroke="#E6E2DA" stroke-width="2" stroke-linecap="round"/>'
      + '<path d="M76 66 q14 4 18 12" fill="none" stroke="#E6E2DA" stroke-width="2" stroke-linecap="round"/>',
    noMouth: true, eyeY: 52, blushY: 60
  }),
  /* The golden turtle: a domed shell with real scutes and a scalloped edge,
     four legs and a tail, so it is a turtle rather than a saucer. */
  kimquy: () => ({
    glow: true, feet: false, head: 0.74, headY: -10, pal: { body: '#F2E2B8', dark: '#D4B25F', ink: '#5A4415' },
    behind: '<ellipse cx="24" cy="102" rx="13" ry="7" fill="#D4B25F" transform="rotate(-18 24 102)"/>'
      + '<ellipse cx="96" cy="102" rx="13" ry="7" fill="#D4B25F" transform="rotate(18 96 102)"/>'
      + '<ellipse cx="34" cy="112" rx="11" ry="6" fill="#C9A54E"/><ellipse cx="86" cy="112" rx="11" ry="6" fill="#C9A54E"/>'
      + '<path d="M94 92 q16 0 20 8 q-10 6 -20 -1 Z" fill="#D4B25F"/>',
    overBody: '<path d="M20 104 Q20 60 60 60 Q100 60 100 104 Z" fill="#E5BE5E"/>'
      + '<path d="M20 104 Q20 60 60 60 Q100 60 100 104" fill="none" stroke="#A8842F" stroke-width="2.6"/>'
      + '<g fill="none" stroke="#A8842F" stroke-width="1.8" opacity=".9">'
      + '<path d="M60 62 L60 104 M38 68 L46 104 M82 68 L74 104 M24 86 L32 104 M96 86 L88 104"/>'
      + '<path d="M28 84 Q60 70 92 84 M23 96 Q60 84 97 96"/></g>'
      + '<g fill="#FFF3C4" opacity=".7"><path d="M60 70 l4 6 -4 6 -4 -6 Z"/><circle cx="44" cy="90" r="3"/><circle cx="76" cy="90" r="3"/></g>'
      + '<path d="M18 104 q6 7 12 0 q6 7 12 0 q6 7 12 0 q6 7 12 0 q6 7 12 0 q6 7 12 0" fill="none" stroke="#A8842F" stroke-width="2.4" stroke-linecap="round"/>',
    front: '<path d="M40 44 q6 -9 14 -10 M80 44 q-6 -9 -14 -10" fill="none" stroke="#D4B25F" stroke-width="1.8" stroke-linecap="round" opacity=".8"/>',
    charmY: 84
  }),
  pegasus: () => ({
    glow: true, feet: false, head: 0.86, headY: -8, pal: { body: '#F5EEFF', dark: '#D3C2F5', ink: '#463373' },
    behind: '<path d="M34 84 Q10 68 7 36 Q27 54 41 76 Z" fill="#FFFFFF"/>'
      + '<path d="M35 88 Q15 78 10 52 Q27 68 42 84 Z" fill="#EFE8FF"/>'
      + '<path d="M37 92 Q21 88 17 68 Q31 80 43 88 Z" fill="#DCCEF7"/>'
      + '<path d="M86 84 Q110 68 113 36 Q93 54 79 76 Z" fill="#FFFFFF"/>'
      + '<path d="M85 88 Q105 78 110 52 Q93 68 78 84 Z" fill="#EFE8FF"/>'
      + '<path d="M83 92 Q99 88 103 68 Q89 80 77 88 Z" fill="#DCCEF7"/>'
      + '<g stroke="#C9B0EA" stroke-width="1.1" fill="none" opacity=".7">'
      + '<path d="M14 46 Q26 60 34 78 M12 62 Q24 72 36 86 M106 46 Q94 60 86 78 M108 62 Q96 72 84 86"/></g>'
      + '<path d="M48 26 Q31 32 28 52 Q26 68 34 80 Q31 60 41 47 Q46 36 48 26 Z" fill="#B79BEA"/>'
      + '<path d="M53 28 Q39 36 36 54 Q35 66 40 76 Q39 58 47 47 Q51 38 53 28 Z" fill="#D3C2F5"/>'
      + '<path d="M84 100 Q108 104 112 122 Q93 118 82 107 Z" fill="#C9B0EA"/>',
    ears: '<path d="M43 28 Q40 8 48 2 Q55 14 53 27 Z" fill="#F5EEFF"/><path d="M77 28 Q80 8 72 2 Q65 14 67 27 Z" fill="#F5EEFF"/>'
      + '<path d="M47 22 Q47 12 50 8 Q52 16 51 23 Z" fill="#C9B0EA"/><path d="M73 22 Q73 12 70 8 Q68 16 69 23 Z" fill="#C9B0EA"/>',
    front: '<path d="M53 62 Q52 78 56 88 Q60 91 64 88 Q68 78 67 62 Z" fill="#FBF6FF"/>'
      + '<path d="M53 62 Q52 78 56 88 Q60 91 64 88 Q68 78 67 62" fill="none" stroke="#C9B0EA" stroke-width="1.2"/>'
      + '<path d="M57 80 q-1 -4 2 -5 M63 80 q1 -4 -2 -5" stroke="#8A76AE" stroke-width="1.7" fill="none" stroke-linecap="round"/>'
      + '<path d="M56 86 q4 2 8 0" stroke="#8A76AE" stroke-width="1.3" fill="none" stroke-linecap="round"/>'
      + '<path d="M60 30 Q52 40 55 50 Q60 43 65 48 Q66 38 60 30 Z" fill="#C9B0EA"/>',
    overBody: '<g fill="#FFF3C4"><circle cx="24" cy="72" r="2.2"/><circle cx="100" cy="68" r="2"/><circle cx="94" cy="98" r="1.8"/></g>'
      + '<ellipse cx="38" cy="106" rx="8" ry="4.6" fill="#E5BE5E"/><ellipse cx="82" cy="106" rx="8" ry="4.6" fill="#E5BE5E"/>',
    eyeY: 48, noMouth: true, blushY: 56, charmY: 96
  }),
  /* The golden eagle: a brow over the eye is the whole difference between a
     raptor and a soft brown bird. */
  eagle: () => ({
    glow: true, feet: false, pal: { body: '#8A5F2E', dark: '#6B4620', ink: '#2E1E0E' },
    headRX: 26, headRY: 24, bodyRX: 29,
    behind: '<path d="M30 84 Q4 66 2 32 Q22 52 38 76 Z" fill="#6B4620"/>'
      + '<path d="M32 90 Q10 80 6 50 Q24 66 40 84 Z" fill="#8A5F2E"/>'
      + '<path d="M34 96 Q16 92 12 70 Q28 82 42 92 Z" fill="#B07C3E"/>'
      + '<path d="M90 84 Q116 66 118 32 Q98 52 82 76 Z" fill="#6B4620"/>'
      + '<path d="M88 90 Q110 80 114 50 Q96 66 80 84 Z" fill="#8A5F2E"/>'
      + '<path d="M86 96 Q104 92 108 70 Q92 82 78 92 Z" fill="#B07C3E"/>'
      + '<g stroke="#4E3316" stroke-width="1.2" fill="none" opacity=".7">'
      + '<path d="M10 44 Q22 60 32 80 M12 62 Q24 74 36 90 M110 44 Q98 60 88 80 M108 62 Q96 74 84 90"/></g>'
      + '<path d="M48 108 q12 14 24 0 q-3 14 -12 16 q-9 -2 -12 -16 Z" fill="#6B4620"/>',
    ears: '<path d="M36 30 Q48 12 60 8 Q72 12 84 30 Q60 20 36 30 Z" fill="#C9A05A"/>'
      + '<path d="M42 26 Q52 16 60 14 Q68 16 78 26 Q60 20 42 26 Z" fill="#E8CE9A"/>',
    overBody: '<path d="M60 66 q-17 17 -15 38 q15 6 30 0 q2 -21 -15 -38 Z" fill="#E8CE9A"/>'
      + '<g stroke="#B07C3E" stroke-width="1.6" fill="none" opacity=".85"><path d="M48 82 q12 -5 24 0 M46 92 q14 -5 28 0 M50 101 q10 -4 20 0"/></g>'
      + '<g stroke="#E5BE5E" stroke-width="3.2" stroke-linecap="round"><path d="M50 112 v6 M70 112 v6 M45 118 h9 M66 118 h9"/></g>',
    // A hooked beak and a heavy brow: the two things that make it a raptor.
    front: '<path d="M60 52 L52 62 Q52 74 60 78 Q68 74 68 62 Z" fill="#F0B24E"/>'
      + '<path d="M60 70 Q55 76 58 82 Q62 78 60 70 Z" fill="#C4813C"/>'
      + '<ellipse cx="49" cy="50" rx="6" ry="6.6" fill="#F7E9C8"/><ellipse cx="71" cy="50" rx="6" ry="6.6" fill="#F7E9C8"/>'
      + '<circle cx="50" cy="51" r="3.4" fill="#2E1E0E"/><circle cx="70" cy="51" r="3.4" fill="#2E1E0E"/>'
      + '<circle cx="51" cy="49.6" r="1.2" fill="#fff"/><circle cx="71" cy="49.6" r="1.2" fill="#fff"/>'
      + '<path d="M40 42 Q50 40 56 46" fill="none" stroke="#6B4620" stroke-width="4" stroke-linecap="round"/>'
      + '<path d="M80 42 Q70 40 64 46" fill="none" stroke="#6B4620" stroke-width="4" stroke-linecap="round"/>',
    noFace: true, noMouth: true, charmY: 96
  })
};

function petSVG(kind, coat, mood, wear) {
  const dressed = coat || PET_COATS[0];
  const luck = petLuck(kind);
  const art = (PET_ART[kind] || PET_ART.cat)(dressed);
  /* A spirit beast brings its own colours; an everyday companion wears the
     coat that was chosen for it. */
  const c = art.pal || dressed;
  const bRX = art.bodyRX || 30, bRY = art.bodyRY || 23;
  const hRX = art.headRX || 29, hRY = art.headRY || 26;
  const happy = mood === 'happy';
  const eyeY = art.eyeY || 54, blushY = art.blushY || 62;
  const eye = (x) => happy
    ? '<path d="M' + (x - 5) + ' ' + eyeY + ' q5 -6 10 0" fill="none" stroke="' + c.ink + '" stroke-width="2.6" stroke-linecap="round"/>'
    : '<ellipse cx="' + x + '" cy="' + eyeY + '" rx="3.4" ry="4.4" fill="' + c.ink + '"/><circle cx="' + (x + 1.2) + '" cy="' + (eyeY - 1.8) + '" r="1.2" fill="#fff"/>';
  const face = (art.noFace ? '' : '<g class="eyes">' + eye(50) + eye(70) + '</g>')
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
  const headShape = art.headPath
    ? '<path d="' + art.headPath + '" fill="' + c.body + '"/>'
    : '<ellipse cx="60" cy="56" rx="' + hRX + '" ry="' + hRY + '" fill="' + c.body + '"/>';
  const head = headShape + face + (art.front || '');
  const headed = art.head
    ? '<g transform="translate(60,' + (56 + (art.headY || 0)) + ') scale(' + art.head + ') translate(-60,-56)">' + head + '</g>'
    : head;
  /* Every spirit beast wears the same halo and the same sparks, so the set
     reads as one rank above the ordinary companions. */
  const halo = art.glow
    ? '<circle cx="60" cy="54" r="40" fill="#FFF3C4" opacity=".22"/>'
      + '<circle cx="60" cy="54" r="37" fill="none" stroke="#E5BE5E" stroke-width="1.6" opacity=".55"/>'
      + '<g class="sparks" fill="#FFF3C4"><path class="twinkle" d="M16 30 l2.6 5.4 5.4 2.6 -5.4 2.6 -2.6 5.4 -2.6 -5.4 -5.4 -2.6 5.4 -2.6 Z"/>'
      + '<path class="twinkle" style="animation-delay:900ms" d="M104 26 l2.2 4.6 4.6 2.2 -4.6 2.2 -2.2 4.6 -2.2 -4.6 -4.6 -2.2 4.6 -2.2 Z"/>'
      + '<path class="twinkle" style="animation-delay:1800ms" d="M100 108 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2 Z"/></g>'
    : '';
  return '<svg viewBox="0 0 120 120" class="petart' + (art.glow ? ' myth' : '') + '" role="img" aria-label="' + esc(L(PET_NAMES[kind])) + '">'
    + halo
    + '<ellipse cx="60" cy="112" rx="32" ry="6" fill="#C9A5D8" opacity=".28"/>'
    + (art.behind || '')
    + '<ellipse cx="60" cy="88" rx="' + bRX + '" ry="' + bRY + '" fill="' + c.body + '"/>'
    + '<ellipse cx="60" cy="92" rx="' + (bRX * 0.6).toFixed(1) + '" ry="' + (bRY * 0.61).toFixed(1) + '" fill="#FFF7EE" opacity=".5"/>'
    + (art.feet === false ? '' : '<ellipse class="ft" cx="38" cy="104" rx="8" ry="5" fill="' + c.dark + '"/><ellipse class="ft wav" cx="82" cy="104" rx="8" ry="5" fill="' + c.dark + '"/>')
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
  let busy = false, open = '', sheet = '';

  /* One line of the meal list: what it adds, and whether it is open. */
  const gainRow = (label, got, worth, locked) => '<li' + (locked ? ' class="locked"' : '') + '><span>' + esc(label) + '</span><b>' + (locked ? '🔒 +' + worth : '+' + got) + '</b></li>';

  const petCardHTML = (p) => {
    const luck = petLuck(p.kind), coat = PETS.coat(p), prayed = PETS.prayedToday(p);
    const st = PETS.step(p), gain = PETS.gain(p), pro = proOn(), ready = PETS.canFeed(p);
    const bless = prayed ? PETS.blessing(p) : null;
    return '<div class="card petwrap luck-' + luck.id + '">'
      + '<div class="petstage" id="petstage">' + petHomeSVG(PETS.home(p).id) + petAuraHTML(p.kind) + petSVG(p.kind, coat, ready ? '' : 'happy', PETS.wear(p)) + '<span class="crumbs" id="crumbs"></span><span class="toys" id="toys"></span><span class="pats" id="pats"></span>'
      + '<span class="stagebtns left">' + stageBtn('food', '🍚', S.petFoodTitle) + stageBtn('wear', '👑', S.petWearTitle) + '</span>'
      + '<span class="stagebtns right">' + stageBtn('home', '🏠', S.petHomeShort) + stageBtn('coat', '🎨', S.petCoat) + '</span></div>'
      + '<div class="lucktag" style="--ink:' + luck.ink + ';--aura:' + luck.aura + '">' + luck.sym + ' ' + esc(S.petBrings(L(luck.name))) + '</div>'
      + '<p class="petline">' + esc(L(petLine(p.kind))) + '</p>'
      + '<div class="charm"><span class="lbl">' + esc(S.petLevel(st.lv)) + '</span><span class="bar"><i style="width:' + st.at + '%;background:' + luck.ink + '"></i></span>'
      + '<b>' + (st.need ? st.into + '/' + st.need : '★') + '</b></div>'
      + (petIsPro(p.kind) ? '<p class="mythline">✨ ' + esc(S.petMythBonus(MYTH_XP)) + '</p>' : '')
      + '<ul class="carelist"><li class="head"><span>' + esc(S.petMealWorth) + '</span><b>+' + gain.total + '</b></li>'
      + gainRow(S.careMeal, gain.meal, 10, false)
      + gainRow(S.careDays, gain.days, 10, false)
      + gainRow(S.careTreats, gain.food, 8, !pro)
      + gainRow(S.careWear, gain.wear, 4, !pro)
      + gainRow(S.careHome, gain.home, 5, !pro)
      + gainRow(S.careCoat, gain.coat, 3, !pro)
      + '</ul>'
      + '<div class="petstat"><span>🔥 ' + esc(S.petStreak(Number(p.streak) || 0)) + '</span><span>🍽️ ' + esc(S.petMeals(Number(p.meals) || 0)) + '</span><a href="#/rewards">🪙 ' + fmtNum(BANK.coins()) + '</a></div>'
      + '<p class="hint" style="text-align:center">' + esc(PETS.xpLeft() ? S.petDayLeft(PETS.xpToday(), PET_DAY_XP) : S.petDayFull) + '</p>'
      + '<p class="hint" style="text-align:center">' + esc(PETS.xpLeft() ? S.petDayLeft(PETS.xpToday(), PET_DAY_XP) : S.petDayFull) + '</p>'
      + '<p class="hint" style="text-align:center">' + esc(PETS.xpLeft() ? S.petDayLeft(PETS.xpToday(), PET_DAY_XP) : S.petDayFull) + '</p>'
      + '<p class="hint pathint">✋ ' + esc(S.petPatHint) + '</p>'
      + (ready
        ? '<div class="feedrow"><span class="foodchip" id="foodchip" title="' + esc(S.petDragFood) + '">' + PETS.food(p).sym + '</span>'
          + '<span class="dragtip">' + esc(S.petDragFood) + '</span></div>'
          + '<button class="btn primary block" id="feed">' + PETS.food(p).sym + ' ' + esc(S.petFeedWith(L(PETS.food(p).name))) + '</button>'
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

  /* A button on the edge of the scene, so what can be changed is visible the
     moment the screen opens rather than three scrolls down. */
  const stageBtn = (key, icon, label) => '<button type="button" class="stagebtn" data-open-sheet="' + key + '" aria-label="' + esc(label) + '"><span class="ic">' + icon + '</span><span class="lb">' + esc(label) + '</span></button>';

  /* One shelf of things to give the companion. Locked items are shown in full
     with what they would add, never hidden. */
  const shelfRows = (set, chosenId, key, label) => '<div class="shelf">' + set.map((x) => {
    const locked = x.pro && !proOn();
    return '<button type="button" class="sh' + (chosenId === x.id ? ' on' : '') + (locked ? ' locked' : '') + '" data-shelf="' + key + ':' + x.id + '">'
      + '<span class="shart">' + (label === 'food' ? x.sym : (label === 'home' ? petHomeSVG(x.id) : (label === 'coat' ? '<span class="dot" style="background:' + x.body + '"></span>' : petWearArt(x.id)))) + '</span>'
      + '<b>' + esc(L(x.name) || x.id) + '</b>'
      + (x.add ? '<span class="plus">+' + x.add + '</span>' : '')
      + (locked ? '<span class="sh-lock">🔒</span>' : '') + (chosenId === x.id ? '<span class="sh-on">✓</span>' : '')
      + '</button>';
  }).join('') + '</div>';

  /* The four groups live in one sheet, so a visitor who opens the food can go
     straight on to the home without closing anything. */
  const SHEETS = [
    { key: 'food', icon: '🍚', title: () => S.petFoodTitle, note: () => S.petFoodNote, set: () => PET_FOODS, now: (p) => PETS.food(p).id, art: 'food' },
    { key: 'home', icon: '🏠', title: () => S.petHomeTitle, note: () => S.petHomeNote, set: () => PET_HOMES, now: (p) => PETS.home(p).id, art: 'home' },
    { key: 'wear', icon: '👑', title: () => S.petWearTitle, note: () => S.petWearNote, set: () => PET_WEARS, now: (p) => PETS.wear(p).id, art: 'wear' },
    { key: 'coat', icon: '🎨', title: () => S.petCoat, note: () => S.petCoatNote, set: () => PET_COATS.map((c) => ({ id: c.id, pro: c.pro, add: 3, body: c.body, name: S.coatNames[c.id] || c.id })), now: (p) => PETS.coat(p).id, art: 'coat' }
  ];
  const sheetHTML = (p, open) => {
    const cur = SHEETS.filter((x) => x.key === open)[0] || SHEETS[0];
    return '<div class="sheet" id="petsheet"><div class="sh-back" data-close-sheet="1"></div>'
      + '<div class="sh-body" role="dialog" aria-modal="true" aria-label="' + esc(cur.title()) + '">'
      + '<div class="sh-grip"></div>'
      + '<div class="chips sh-tabs">' + SHEETS.map((x) => '<button type="button" class="chip' + (x.key === cur.key ? ' on' : '') + '" data-sheet-tab="' + x.key + '">' + x.icon + ' ' + esc(x.title()) + '</button>').join('') + '</div>'
      + '<p class="hint">' + esc(cur.note()) + '</p>'
      + shelfRows(cur.set(), cur.now(p), cur.key, cur.art)
      + '<button type="button" class="btn block" data-close-sheet="1" style="margin-top:12px">' + esc(S.sheetClose) + '</button>'
      + '</div></div>';
  };

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
      + '<div class="card"><label class="f" for="petname">' + esc(S.petName) + '</label><input id="petname" maxlength="24" value="' + esc(p.name || '') + '" placeholder="' + esc(L(PET_NAMES[p.kind])) + '">'
      + '<button class="btn block" id="petswap" style="margin-top:10px">' + esc(pets.length > 1 ? S.petLetGo : S.petSwap) + '</button>'
      + (PETS.canChange() ? '<p class="hint">' + esc(S.petChangeFree) + '</p>' : '<p class="hint">' + esc(S.petChangeWait(fmtDate(PETS.changeOn()))) + '</p>') + '</div>'
      + '<p style="margin-top:14px"><a href="#/play" class="backlink">← ' + esc(S.actTitle) + '</a></p>'
      + (sheet ? sheetHTML(p, sheet) : '');

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
    /* Stroking. The finger leaves hearts where it goes; every so far it has
       travelled counts as one stroke, worth a little experience. Nothing is
       redrawn while the finger is down, so the animation is never cut off. */
    const stage = $('#petstage');
    if (stage) {
      let down = false, lastX = 0, lastY = 0, went = 0, since = 0, earned = 0;
      const heart = (x, y) => {
        const box = $('#pats'); if (!box) return;
        const r = stage.getBoundingClientRect();
        const i = document.createElement('i');
        i.textContent = ['💗', '💕', '✨', '💖'][Math.floor(Math.random() * 4)];
        i.style.left = ((x - r.left) / r.width * 100) + '%';
        i.style.top = ((y - r.top) / r.height * 100) + '%';
        box.appendChild(i);
        setTimeout(() => i.remove(), 1200);
      };
      const refresh = () => {
        const st = PETS.step(p), bar = $('.charm .bar i', m), num = $('.charm b', m), day = $('.petwrap .hint.ok', m);
        if (bar) bar.style.width = st.at + '%';
        if (num) num.textContent = st.need ? st.into + '/' + st.need : '★';
        const lbl = $('.charm .lbl', m); if (lbl) lbl.textContent = S.petLevel(st.lv);
        if (day) day.textContent = PETS.xpLeft() ? S.petDayLeft(PETS.xpToday(), PET_DAY_XP) : S.petDayFull;
      };
      const start = (e) => {
        if (busy || e.target.closest('.stagebtn')) return;
        down = true; went = 0; earned = 0; lastX = e.clientX; lastY = e.clientY;
        stage.classList.add('patting');
        if (stage.setPointerCapture && e.pointerId != null) { try { stage.setPointerCapture(e.pointerId); } catch (err) { /* not captured: the move handler still works */ } }
      };
      const move = (e) => {
        if (!down) return;
        const dx = e.clientX - lastX, dy = e.clientY - lastY;
        const d = Math.sqrt(dx * dx + dy * dy);
        lastX = e.clientX; lastY = e.clientY;
        went += d; since += d;
        if (since > 34) { since = 0; heart(e.clientX, e.clientY); }
        if (went >= PET_PAT_DIST) {
          went = 0;
          const got = PETS.addXP(p, PET_PAT_XP);
          if (got) { earned += got; PETS.put(p); BANK.mark(petLevel(p.xp)); refresh(); }
        }
        e.preventDefault();
      };
      const stop = () => {
        if (!down) return;
        down = false;
        stage.classList.remove('patting');
        if (earned) toast(S.petPatThanks(earned));
      };
      stage.addEventListener('pointerdown', start);
      stage.addEventListener('pointermove', move);
      stage.addEventListener('pointerup', stop);
      stage.addEventListener('pointercancel', stop);
      stage.addEventListener('pointerleave', stop);
    }

    /* Dragging the food onto the companion feeds it, exactly as the button
       does. The button stays for anyone who would rather tap. */
    const chip = $('#foodchip');
    if (chip && stage) {
      let ghost = null;
      const over = (e) => {
        const r = stage.getBoundingClientRect();
        return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      };
      chip.addEventListener('pointerdown', (e) => {
        if (busy) return;
        e.preventDefault();
        ghost = document.createElement('div');
        ghost.className = 'dragfood';
        ghost.textContent = chip.textContent;
        ghost.style.left = e.clientX + 'px'; ghost.style.top = e.clientY + 'px';
        document.body.appendChild(ghost);
        chip.setPointerCapture && chip.setPointerCapture(e.pointerId);
      });
      chip.addEventListener('pointermove', (e) => {
        if (!ghost) return;
        ghost.style.left = e.clientX + 'px'; ghost.style.top = e.clientY + 'px';
        stage.classList.toggle('hoverfeed', over(e));
      });
      const drop = (e) => {
        if (!ghost) return;
        const hit = over(e);
        ghost.remove(); ghost = null;
        stage.classList.remove('hoverfeed');
        if (hit) { const fb2 = $('#feed'); if (fb2) fb2.click(); }
      };
      chip.addEventListener('pointerup', drop);
      chip.addEventListener('pointercancel', drop);
    }

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
    $$('[data-open-sheet]', m).forEach((b) => b.addEventListener('click', () => { sheet = b.getAttribute('data-open-sheet'); draw(); }));
    $$('[data-sheet-tab]', m).forEach((b) => b.addEventListener('click', () => { sheet = b.getAttribute('data-sheet-tab'); draw(); }));
    $$('[data-close-sheet]', m).forEach((b) => b.addEventListener('click', () => { sheet = ''; draw(); }));
    $$('[data-shelf]', m).forEach((b) => b.addEventListener('click', () => {
      const parts = b.getAttribute('data-shelf').split(':'), key = parts[0], id = parts[1];
      const set = key === 'food' ? PET_FOODS : (key === 'home' ? PET_HOMES : (key === 'wear' ? PET_WEARS : PET_COATS));
      const item = set.filter((x) => x.id === id)[0];
      if (!item) return;
      if (item.pro && !proOn()) { toast(S.petPlusItem); location.hash = '#/unlock'; return; }
      p[key] = id; PETS.put(p); draw();
    }));
    $('#petname').addEventListener('input', () => { p.name = $('#petname').value.trim(); PETS.put(p); });
    $('#petswap').addEventListener('click', () => {
      if (!PETS.canChange()) { toast(S.petChangeWait(fmtDate(PETS.changeOn()))); return; }
      if (!confirm(PETS.all().length > 1 ? S.petLetGoAsk : S.petChangeAsk)) return;
      PETS.drop(p.kind); PETS.markChange(); open = ''; draw();
    });
  };

  /* Nothing is chosen by tapping a tile. The tile opens this, and only the
     button at the bottom of it keeps the creature. */
  /* The same four buttons the kept companion has, shown with a padlock so a
     visitor can see what comes with keeping one before they keep it. */
  const prevBtn = (icon, label) => '<span class="stagebtn locked"><span class="ic">' + icon + '</span><span class="lb">' + esc(label) + '</span><span class="lk">🔒</span></span>';
  const drawPreview = (kind) => {
    const luck = petLuck(kind), have = !!PETS.one(kind), pets = PETS.all();
    const swap = !have && !PETS.room();
    const blocked = swap && !PETS.canChange();
    m.innerHTML = '<div class="eyebrow">' + esc(S.actTitle) + '</div><h1 style="margin-bottom:6px">' + esc(L(PET_NAMES[kind])) + '</h1>'
      + '<p class="muted">' + esc(S.petPreviewIntro) + '</p>'
      + '<div class="card petwrap luck-' + luck.id + '">'
      + '<div class="petstage">' + petHomeSVG('mat') + petAuraHTML(kind) + petSVG(kind, PET_COATS[0], 'happy')
      + '<span class="stagebtns left">' + prevBtn('🍚', S.petFoodTitle) + prevBtn('👑', S.petWearTitle) + '</span>'
      + '<span class="stagebtns right">' + prevBtn('🏠', S.petHomeShort) + prevBtn('🎨', S.petCoat) + '</span></div>'
      + '<div class="lucktag" style="--ink:' + luck.ink + ';--aura:' + luck.aura + '">' + luck.sym + ' ' + esc(S.petBrings(L(luck.name))) + '</div>'
      + '<p class="petline">' + esc(L(petLine(kind))) + '</p>'
      + (petIsPro(kind) ? '<p class="mythline">✨ ' + esc(S.petMythBonus(MYTH_XP)) + '</p>' : '')
      + '<p class="hint" style="text-align:center;margin-bottom:6px">' + esc(S.petPreviewCan) + '</p>'
      + '<ul class="carelist">'
      + '<li><span>' + esc(S.petPrevFeed) + '</span><b>' + esc(S.petPrevFeedN(proOn() ? 2 : 6)) + '</b></li>'
      + '<li><span>' + esc(S.petPrevPlay) + '</span><b>' + esc(S.petPrevPlayN(proOn() ? 3 : 1)) + '</b></li>'
      + '<li><span>' + esc(S.petPrevWish) + '</span><b>' + esc(S.petPrevWishN) + '</b></li>'
      + '<li><span>' + esc(S.petFoodTitle) + ' · ' + esc(S.petHomeShort) + ' · ' + esc(S.petWearTitle) + ' · ' + esc(S.petCoat) + '</span><b>🔒</b></li>'
      + '</ul></div>'
      + '<p class="hint">' + esc(have ? S.petPrevHave : (swap ? S.petPrevSwap : S.petPrevKeep)) + '</p>'
      + (blocked ? '<p class="hint err">' + esc(S.petChangeWait(fmtDate(PETS.changeOn()))) + '</p>' : '')
      + '<button class="btn primary block" id="petkeep"' + (blocked ? ' disabled' : '') + '>' + esc(have ? S.petPrevOpen : (swap ? S.petPrevChange : S.petPrevTake)) + '</button>'
      + '<button class="btn block" id="petback2" style="margin-top:10px">' + esc(S.petPrevOther) + '</button>'
      + '<p style="margin-top:14px"><a href="#/play" class="backlink">← ' + esc(S.actTitle) + '</a></p>';
    $('#petback2').addEventListener('click', () => drawPicker());
    $('#petkeep').addEventListener('click', () => {
      if (have) { open = kind; draw(); return; }
      if (swap) {
        if (!PETS.canChange()) { toast(S.petChangeWait(fmtDate(PETS.changeOn()))); return; }
        if (!confirm(S.petChangeAsk)) return;
        pets.forEach((x) => PETS.drop(x.kind));
        PETS.markChange();
      }
      PETS.put(PETS.fresh(kind)); open = kind; draw();
    });
  };

  /* The picker shows every companion, with what each one looks after, because
     the ones that cannot be kept yet are the reason to look at Plus. */
  const drawPicker = () => {
    const pets = PETS.all();
    const tile = (k) => {
      const luck = petLuck(k), have = !!PETS.one(k), locked = !have && !PETS.mayKeep(k);
      return '<button type="button" class="pp luck-' + luck.id + (have ? ' have' : '') + (locked ? ' locked' : '') + (petIsPro(k) ? ' myth' : '') + '" data-kind="' + k + '">'
        + '<span class="ppart">' + petAuraHTML(k, 3) + petSVG(k, PET_COATS[0], 'happy') + '</span>'
        + '<b>' + esc(L(PET_NAMES[k])) + '</b>'
        + '<span class="pl" style="--ink:' + luck.ink + ';--aura:' + luck.aura + '">' + luck.sym + ' ' + esc(L(luck.name)) + '</span>'
        + (petIsPro(k) ? '<span class="x2">×' + MYTH_XP + ' ' + esc(S.petXpWord) + '</span>' : '')
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
      // A spirit beast cannot be previewed without Plus; everything else can.
      if (petIsPro(k) && !proOn()) { toast(S.petMythPlus); location.hash = '#/unlock'; return; }
      drawPreview(k);
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
