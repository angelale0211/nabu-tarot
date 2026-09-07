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
    sum: { vi: 'Không giới hạn lượt tung đồng xu và rung cây, mở toàn bộ giao diện.', en: 'The coin and the tree without limit, and every design.' },
    name: { vi: 'Nabu Plus', en: 'Nabu Plus' },
    blurb: { vi: 'Nabu Plus mở toàn bộ các phần ngoài khu vực bạn nhỏ. Bạn được tung đồng xu và rung cây thông điệp không giới hạn số lượt, đồng thời sử dụng tất cả giao diện của ứng dụng: mặt sau lá bài, cây thông điệp, đồng xu và trang nhật ký.',
      en: 'Everything that is not a companion: flip the coin and shake the message tree as often as you like, and take every design in the app — card backs, message trees, coins and diary pages.' },
    includes: { vi: ['Tung đồng xu không giới hạn', 'Rung cây thông điệp không giới hạn', '3 mặt sau lá bài, 3 cây thông điệp, 3 đồng xu, 3 trang nhật ký', 'Thời hạn sử dụng 12 tháng'],
      en: ['Unlimited coin flips', 'Unlimited tree shakes', '3 card backs, 3 trees, 3 coins, 3 diary pages', '12 months of access'] } },
  /* Pro is sold by the half year and by the year. The year is cheaper by the
     month - 249.000 against 298.000 for two half years - so paying once is the
     better deal and reads as one. Both open exactly the same thing; only the
     date they run to differs. */
  { id: 'pro6', kind: 'unlock', icon: '👑', to: '#/play/pet', price: 149000, months: 6,
    sum: { vi: 'Trọn quyền lợi Nabu Plus, thêm linh thú và vật phẩm cho bạn nhỏ.', en: 'All of Plus, and the companions with everything for them.' },
    name: { vi: 'Nabu Pro · 6 tháng', en: 'Nabu Pro · 6 months' },
    blurb: { vi: 'Nabu Pro bao gồm toàn bộ quyền lợi của Nabu Plus, cùng với khu vực bạn nhỏ: mười hai linh thú trong truyền thuyết, nuôi tối đa sáu bạn cùng lúc, đầy đủ thức ăn, nhà ở và trang phục dành cho các bạn ấy, thời gian chờ giữa hai bữa rút ngắn từ sáu giờ xuống còn hai giờ, và điểm kinh nghiệm nhân đôi.',
      en: 'Everything in Nabu Plus, and the companions besides: twelve spirit beasts, six of them at once, their good food, their homes and their clothes, a two-hour wait between meals instead of six, and double points.' },
    includes: { vi: ['Giảm 15% cho mọi buổi xem bài cùng Nabu', 'Toàn bộ quyền lợi của Nabu Plus', '12 linh thú, nuôi tối đa 6 bạn cùng lúc', '9 món ăn, 8 ngôi nhà, 9 bộ trang phục', 'Chờ 2 giờ giữa hai bữa, 3 lượt chơi mỗi ngày, điểm kinh nghiệm nhân đôi', 'Voucher giảm 15% và 20%', 'Thời hạn sử dụng 6 tháng'],
      en: ['15% off every reading with Nabu', 'Everything in Nabu Plus', '12 spirit beasts, six kept at once', '9 foods, 8 homes, 9 things to wear', '2 hours between meals, 3 plays a day, double points', 'The 15% and 20% vouchers', '6 months of access'] } },
  { id: 'pro', kind: 'unlock', icon: '👑', to: '#/play/pet', price: 249000, months: 12,
    sum: { vi: 'Quyền lợi như gói 6 tháng, dùng trọn một năm và tiết kiệm 49.000đ.', en: 'The same, for a whole year — 49.000đ less than two half years.' },
    name: { vi: 'Nabu Pro · 12 tháng', en: 'Nabu Pro · 12 months' },
    blurb: { vi: 'Nabu Pro bao gồm toàn bộ quyền lợi của Nabu Plus, cùng với khu vực bạn nhỏ: mười hai linh thú trong truyền thuyết, nuôi tối đa sáu bạn cùng lúc, đầy đủ thức ăn, nhà ở và trang phục dành cho các bạn ấy, thời gian chờ giữa hai bữa rút ngắn từ sáu giờ xuống còn hai giờ, và điểm kinh nghiệm nhân đôi. Thanh toán một lần cho cả năm sẽ tiết kiệm hơn so với mua hai lần gói 6 tháng.',
      en: 'Everything in Nabu Plus, and the companions besides: twelve spirit beasts, six of them at once, their good food, their homes and their clothes, a two-hour wait between meals instead of six, and double points. Paying once for the year costs less.' },
    includes: { vi: ['Giảm 15% cho mọi buổi xem bài cùng Nabu', 'Tiết kiệm 49.000đ so với mua hai lần gói 6 tháng', 'Toàn bộ quyền lợi của Nabu Plus', '12 linh thú, nuôi tối đa 6 bạn cùng lúc', '9 món ăn, 8 ngôi nhà, 9 bộ trang phục', 'Chờ 2 giờ giữa hai bữa, 3 lượt chơi mỗi ngày, điểm kinh nghiệm nhân đôi', 'Voucher giảm 15% và 20%', 'Thời hạn sử dụng 12 tháng'],
      en: ['15% off every reading with Nabu', '49.000đ less than two half years', 'Everything in Nabu Plus', '12 spirit beasts, six kept at once', '9 foods, 8 homes, 9 things to wear', '2 hours between meals, 3 plays a day, double points', 'The 15% and 20% vouchers', '12 months of access'] } },
  /* A wedding is bought once and held once, but the year is there so nobody
     loses what they paid for by having to move the date. */
  { id: 'wedding', kind: 'unlock', icon: '\uD83D\uDC92', to: '#/wedding', price: 30000, months: 12,
    sum: { vi: 'Tổ chức lễ cưới trong ứng dụng, có khách mời và Nabu Cupid chủ hôn.', en: 'Hold a ceremony inside the app, with guests and Nabu Cupid to marry you.' },
    name: { vi: 'Lễ cưới trên Nabu', en: 'A wedding on Nabu' },
    blurb: { vi: 'Hai bạn đã đính ước trên sợi tơ hồng có thể tổ chức một lễ cưới ngay trong ứng dụng. Bạn chọn ngày giờ, gửi thiệp mời cho bạn bè, và đến giờ, Nabu Cupid sẽ chủ hôn: hỏi lời thề của từng người, chờ hai bạn trả lời, rồi tuyên bố hai bạn nên duyên. Khách mời vào xem, gửi quà chúc mừng miễn phí, và tham gia màn tung hoa cưới ở cuối buổi lễ.',
      en: 'A couple engaged on the red thread can hold a ceremony inside the app. You choose the day and the hour, send invitations to your friends, and when the time comes Nabu Cupid marries you: the vows are asked one at a time, you answer them in front of everybody, and then you are declared married. Guests watch, send free congratulations, and join the bouquet toss at the end.' },
    includes: { vi: ['Phòng cưới riêng, có ngày giờ do hai bạn chọn', 'Thiệp mời gửi bằng đường dẫn, không giới hạn khách', 'Nabu Cupid chủ hôn, hỏi lời thề từng người', 'Nhạc lễ và hiệu ứng trong suốt buổi', 'Khách gửi lời chúc và quà miễn phí', 'Màn tung hoa cưới chọn người may mắn', 'Thời hạn sử dụng 12 tháng'],
      en: ['A room of your own, at an hour you choose', 'Invitations by link, as many guests as you like', 'Nabu Cupid asks each of you your vows', 'Music and effects throughout', 'Guests send congratulations and gifts, free', 'A bouquet toss to pick one lucky guest', '12 months to hold it'] } }
];
/* Where the reading itself happens. Three, because these are the three
   places Nabu actually reads. */
/* best: the one Nabu would rather use, and says so on the card.
   needsId: somewhere Nabu cannot reach without being given an account. */
const BOOK_WHERE = [
  { id: 'app', icon: '💬', best: true, name: { vi: 'Trong app Nabu Tarot', en: 'Here in the Nabu Tarot app' },
    sub: { vi: 'Nabu nhắn thẳng vào mục Hồ sơ của bạn, không lạc đi đâu được', en: 'Nabu replies straight into your Profile tab, where nothing can go astray' } },
  { id: 'ig', icon: '📸', needsId: true, name: { vi: 'Instagram', en: 'Instagram' },
    sub: { vi: 'Nabu nhắn qua tin nhắn Instagram', en: 'Nabu writes to you on Instagram' } },
  { id: 'fb', icon: '💬', needsId: true, name: { vi: 'Facebook', en: 'Facebook' },
    sub: { vi: 'Nabu nhắn qua Messenger', en: 'Nabu writes to you on Messenger' } }
];
const whereOf = (id) => BOOK_WHERE.filter((w) => w.id === id)[0] || null;
const PAYMENT_NOTE = { vi: 'Vui lòng chuyển khoản trước khi xem.', en: 'Please transfer the fee in advance.' };
const fmtNum = (n) => String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const fmtPrice = (n) => fmtNum(n) + 'đ';
