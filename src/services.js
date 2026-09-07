/* ============================ services + prices ============================
   Nabu's price list. Prices in VND. Each service has packages; a package
   with needsTopic asks the client to choose one of the five preset topics.
   Edit here, then  python build.py  and push. */
const SERVICES = [
  { id: 'tarot', icon: PICK_ICON, tone: 'blue', name: { vi: 'Tarot', en: 'Tarot' },
    tagline: { vi: 'Bạn hỏi được thì Tarot trả lời được.', en: 'If you can ask it, Tarot can answer it.' },
    packages: [
      { id: 'yn', name: { vi: '1 câu Yes/No', en: '1 yes/no question' }, price: 10000 },
      { id: 'q1', name: { vi: '1 câu chi tiết', en: '1 question in detail' }, price: 20000 },
      { id: 'q3', name: { vi: '3 câu chi tiết', en: '3 questions in detail' }, price: 50000 },
      { id: 'topic', name: { vi: '1 chủ đề sẵn (chọn trong 5 chủ đề)', en: '1 of the 5 preset topics' }, price: 60000, needsTopic: true },
      { id: 't40', name: { vi: '40 phút', en: '40 minutes' }, price: 80000 }
    ] },
  { id: 'lenormand', icon: '🗝️', tone: 'lav', name: { vi: 'Lenormand', en: 'Lenormand' },
    tagline: { vi: 'Hỏi chuyện cụ thể, trả lời cụ thể.', en: 'Concrete questions, concrete answers.' },
    packages: [
      { id: 'yn', name: { vi: '1 câu Yes/No', en: '1 yes/no question' }, price: 15000 },
      { id: 'q1', name: { vi: '1 câu chi tiết', en: '1 question in detail' }, price: 25000 },
      { id: 'q3', name: { vi: '3 câu chi tiết', en: '3 questions in detail' }, price: 60000 },
      { id: 'topic', name: { vi: '1 chủ đề sẵn (chọn trong 5 chủ đề)', en: '1 of the 5 preset topics' }, price: 75000, needsTopic: true },
      { id: 't40', name: { vi: '40 phút', en: '40 minutes' }, price: 90000 }
    ] },
  { id: 'tea', icon: '🍵', tone: 'gold', name: { vi: 'Bài trà', en: 'Tealeaf fortune telling' },
    tagline: { vi: 'Một tách trà, một câu chuyện.', en: 'One cup of tea, one story.' },
    packages: [
      { id: 'q1', name: { vi: '1 câu', en: '1 question' }, price: 25000 },
      { id: 'q3', name: { vi: '3 câu', en: '3 questions' }, price: 50000 },
      { id: 't30', name: { vi: '30 phút', en: '30 minutes' }, price: 80000 }
    ] },
  { id: 'tarot-oracle', icon: '🌙', tone: 'pink', name: { vi: 'Tarot + Oracle', en: 'Tarot + Oracle' },
    tagline: { vi: 'Tarot trả lời, Oracle nhắn thêm một lời.', en: 'Tarot answers, Oracle adds a message.' },
    packages: [
      { id: 'q1', name: { vi: '1 câu chi tiết', en: '1 question in detail' }, price: 30000 },
      { id: 'q3', name: { vi: '3 câu chi tiết', en: '3 questions in detail' }, price: 75000 },
      { id: 'topic', name: { vi: '1 chủ đề sẵn (chọn trong 5 chủ đề)', en: '1 of the 5 preset topics' }, price: 95000, needsTopic: true },
      { id: 't60', name: { vi: '60 phút', en: '60 minutes' }, price: 120000 }
    ] },
  { id: 'lenormand-oracle', icon: '✨', tone: 'lav', name: { vi: 'Lenormand + Oracle', en: 'Lenormand + Oracle' },
    tagline: { vi: 'Chuyện cụ thể, thêm một lời nhắn.', en: 'The concrete story, plus a message.' },
    packages: [
      { id: 'q1', name: { vi: '1 câu chi tiết', en: '1 question in detail' }, price: 35000 },
      { id: 'q3', name: { vi: '3 câu chi tiết', en: '3 questions in detail' }, price: 90000 },
      { id: 'topic', name: { vi: '1 chủ đề sẵn (chọn trong 5 chủ đề)', en: '1 of the 5 preset topics' }, price: 110000, needsTopic: true },
      { id: 't60', name: { vi: '60 phút', en: '60 minutes' }, price: 145000 }
    ] },
  { id: 'tuvi', icon: '🌸', tone: 'pink', name: { vi: 'Tử vi', en: 'Tử vi (Vietnamese astrology)' },
    tagline: { vi: 'Không phải chuyện hôm nay, mà là cả đường dài.', en: 'Not just today, but the long road.' },
    note: { vi: 'Cần ngày, tháng, năm sinh và giờ sinh chính xác.', en: 'Needs your exact date and hour of birth.' },
    needsBirth: true,
    packages: [
      { id: 'one', name: { vi: '1 vấn đề', en: '1 matter' }, price: 99000 },
      { id: 'year', name: { vi: 'Vận hạn năm', en: 'The year ahead' }, price: 333000 },
      { id: 'all', name: { vi: 'Tổng quan mọi vấn đề', en: 'Full overview of everything' }, price: 666000 }
    ] },
  { id: 'talk', icon: '💬', tone: 'blue', name: { vi: 'Chỉ tâm sự', en: 'Just talk' },
    tagline: { vi: 'Không có trải bài, không đưa dự đoán, nhưng luôn sẵn lòng lắng nghe.', en: 'No readings or predictions, but always ready to listen.' },
    packages: [
      { id: 't30', name: { vi: '30 phút', en: '30 minutes' }, price: 30000 },
      { id: 't60', name: { vi: '1 tiếng', en: '1 hour' }, price: 60000 }
    ] }
];
/* Paid courses in the Học tab. Access codes are made in the dashboard. */
/* kind: a course is something to read, an unlock is something to use. They
   are sold the same way and belong in different lists. */
const COURSES = [
  { id: 'tarot', kind: 'course', icon: PICK_ICON, to: '#/learn/tarot', price: 300000, months: 6, sum: { vi: '78 lá, 8 trải bài và các bài đọc.', en: '78 cards, 8 spreads and the guides.' }, name: { vi: 'Khóa Tarot', en: 'Tarot course' },
    blurb: { vi: 'Toàn bộ 78 lá, mỗi lá có hình, từ khóa, nghĩa xuôi ngược, nghĩa theo tình cảm, công việc, học tập, tiền bạc, và các câu hỏi thường gặp. Kèm 8 cách trải bài và các bài đọc.', en: 'All 78 cards with art, keywords, upright and reversed meanings, love / work / study / money readings and frequently asked questions. Plus 8 spreads and the guides.' },
    includes: { vi: ['78 lá bài, mỗi lá một trang', '8 cách trải bài có sơ đồ', 'Bài đọc: bắt đầu, lá ngược, lá hoàng gia', 'Dùng 6 tháng, xem offline'], en: ['78 cards, one page each', '8 spreads with diagrams', 'Guides: starting out, reversals, court cards', '6 months of access, works offline'] } },
  { id: 'lenormand', kind: 'course', icon: '🗝️', to: '#/learn/lenormand', price: 300000, months: 6, sum: { vi: '36 lá, 7 trải bài và cách ghép cặp.', en: '36 cards, 7 spreads and how to pair them.' }, name: { vi: 'Khóa Lenormand', en: 'Lenormand course' },
    blurb: { vi: 'Toàn bộ 36 lá, mỗi lá có hình, sắc thái, nghĩa chính, tình cảm, công việc, chỉ người, thời gian và các cặp lá. Kèm 7 cách trải bài và các bài đọc.', en: 'All 36 cards with art, tone, core meaning, love, work, person, timing and pairs. Plus 7 spreads and the guides.' },
    includes: { vi: ['36 lá bài, mỗi lá một trang', 'Cặp lá thường gặp', '7 cách trải bài, có Grand Tableau', 'Dùng 6 tháng, xem offline'], en: ['36 cards, one page each', 'Common pairs', '7 spreads including the Grand Tableau', '6 months of access, works offline'] } },
  { id: 'playing', kind: 'course', icon: '🂡', to: '#/learn/playing', price: 300000, months: 6, sum: { vi: '52 lá bài Tây, 9 bài học, 4 trải bài.', en: '52 playing cards, 9 lessons, 4 spreads.' }, name: { vi: 'Khóa Bài Tây', en: 'Cartomancy course' },
    blurb: { vi: 'Bói bài Tây 52 lá theo lối truyền thống: bốn chất, câu chuyện từ Át tới Mười, 12 lá hình, cặp lá, thời gian và bốn trải bài. Mỗi lá có hình vẽ, nghĩa truyền thống, lý do của nghĩa ấy và lá tarot tương ứng.', en: 'Traditional 52-card cartomancy: four suits, the Ace-to-Ten story, the 12 court cards, pairs, timing and four spreads. Every card has a drawn face, its traditional meaning, why it means that, and its tarot twin.' },
    includes: { vi: ['9 bài học có hình', '52 lá, mỗi lá một trang', 'Cặp lá, thời gian, trải bài điều ước', 'Dùng 6 tháng, xem offline'], en: ['9 illustrated sessions', '52 cards, one page each', 'Pairs, timing, the wish spread', '6 months of access, works offline'] } },
  { id: 'manifest', kind: 'course', icon: '🌙', to: '#/learn/manifest', price: 75000, months: 12, sum: { vi: '7 phương pháp, mỗi bài một công cụ.', en: '7 methods, one tool with each.' }, name: { vi: 'Bộ Manifestation', en: 'Manifestation set' },
    blurb: { vi: 'Bảy phương pháp có công cụ làm ngay trong app: WOOP, bảng tầm nhìn có ảnh, nghi thức trăng, kế hoạch nếu-thì, buông bỏ, giới hạn, nến và đá. Mọi thứ bạn viết được lưu trên máy và có thể xoá làm lại bất cứ lúc nào.', en: 'Seven methods with tools you use right in the app: WOOP, a vision board with photos, Moon rituals, if-then plans, letting go, limits, candles and stones. Everything you write is saved on your device and can be cleared and redone any time.' },
    includes: { vi: ['7 bài hướng dẫn nâng cao', 'Bảng ảnh, kế hoạch, nghi thức, buông bỏ', 'Nến và đá theo mục đích', 'Dùng 12 tháng, xem offline'], en: ['7 advanced guides', 'Photo board, plans, ritual and letting-go tools', 'Candles and stones by purpose', '12 months of access, works offline'] } },
  { id: 'plus', kind: 'unlock', icon: '✨', to: '#/play/coin', price: 79000, months: 12,
    sum: { vi: 'Tung xu và rung cây không giới hạn, cùng toàn bộ giao diện.', en: 'The coin and the tree without limit, and every design.' },
    name: { vi: 'Nabu Plus', en: 'Nabu Plus' },
    blurb: { vi: 'Mở tất cả những gì không thuộc về bạn nhỏ: tung đồng xu và rung cây thông điệp bao nhiêu lần tùy bạn, và toàn bộ giao diện của app: mặt sau lá bài, cây thông điệp, đồng xu và trang nhật ký.',
      en: 'Everything that is not a companion: flip the coin and shake the message tree as often as you like, and take every design in the app — card backs, message trees, coins and diary pages.' },
    includes: { vi: ['Tung đồng xu không giới hạn', 'Rung cây thông điệp không giới hạn', '3 mặt sau lá bài, 3 cây, 3 đồng xu, 3 trang nhật ký', 'Dùng 12 tháng'],
      en: ['Unlimited coin flips', 'Unlimited tree shakes', '3 card backs, 3 trees, 3 coins, 3 diary pages', '12 months of access'] } },
  { id: 'pro', kind: 'unlock', icon: '👑', to: '#/play/pet', price: 149000, months: 12,
    sum: { vi: 'Toàn bộ Plus, cộng linh thú và mọi thứ cho bạn nhỏ.', en: 'All of Plus, and the companions with everything for them.' },
    name: { vi: 'Nabu Pro', en: 'Nabu Pro' },
    blurb: { vi: 'Có tất cả những gì của Nabu Plus, và thêm phần bạn nhỏ: mười hai linh thú trong truyền thuyết, nuôi sáu vị cùng lúc, món ngon, nhà đẹp và đồ mặc cho chúng, chờ hai giờ thay vì sáu giờ giữa hai bữa, và điểm nhân đôi.',
      en: 'Everything in Nabu Plus, and the companions besides: twelve spirit beasts, six of them at once, their good food, their homes and their clothes, a two-hour wait between meals instead of six, and double points.' },
    includes: { vi: ['Mọi thứ của Nabu Plus', '12 linh thú, nuôi 6 vị cùng lúc', '9 món ăn, 8 ngôi nhà, 9 món đồ mặc', 'Chờ 2 giờ giữa hai bữa, chơi 3 lượt mỗi ngày, điểm nhân đôi', 'Voucher 15% và 20%', 'Dùng 12 tháng'],
      en: ['Everything in Nabu Plus', '12 spirit beasts, six kept at once', '9 foods, 8 homes, 9 things to wear', '2 hours between meals, 3 plays a day, double points', 'The 15% and 20% vouchers', '12 months of access'] } }
];
/* Where the reading itself happens. Three, because these are the three
   places Nabu actually reads. */
const BOOK_WHERE = [
  { id: 'app', icon: '💬', name: { vi: 'Trong app Nabu Tarot', en: 'Here in the Nabu Tarot app' },
    sub: { vi: 'Nabu nhắn trực tiếp trong mục Hồ sơ', en: 'Nabu replies in your Profile tab' } },
  { id: 'ig', icon: '📷', name: { vi: 'Instagram', en: 'Instagram' },
    sub: { vi: 'Nabu nhắn qua tin nhắn Instagram', en: 'Nabu writes to you on Instagram' } },
  { id: 'fb', icon: '🌐', name: { vi: 'Facebook', en: 'Facebook' },
    sub: { vi: 'Nabu nhắn qua Messenger', en: 'Nabu writes to you on Messenger' } }
];
const whereOf = (id) => BOOK_WHERE.filter((w) => w.id === id)[0] || null;
const PAYMENT_NOTE = { vi: 'Vui lòng chuyển khoản trước khi xem.', en: 'Please transfer the fee in advance.' };
const fmtNum = (n) => String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const fmtPrice = (n) => fmtNum(n) + 'đ';
