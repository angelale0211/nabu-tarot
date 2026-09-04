/* ============================ services + prices ============================
   Nabu's price list. Prices in VND. Each service has packages; a package
   with needsTopic asks the client to choose one of the five preset topics.
   Edit here, then  python build.py  and push. */
const SERVICES = [
  { id: 'tarot', icon: '🃏', tone: 'blue', name: { vi: 'Tarot', en: 'Tarot' },
    tagline: { vi: 'Bạn hỏi được thì Tarot trả lời được.', en: 'If you can ask it, Tarot can answer it.' },
    packages: [
      { id: 'yn', name: { vi: '1 câu Yes/No', en: '1 yes/no question' }, price: 10000 },
      { id: 'q1', name: { vi: '1 câu chi tiết', en: '1 question in detail' }, price: 20000 },
      { id: 'q3', name: { vi: '3 câu chi tiết', en: '3 questions in detail' }, price: 50000 },
      { id: 'topic', name: { vi: 'Xem chủ đề sẵn (5 lá)', en: 'Set topic (5 cards)' }, price: 60000, needsTopic: true },
      { id: 't40', name: { vi: '40 phút', en: '40 minutes' }, price: 80000 }
    ] },
  { id: 'lenormand', icon: '🗝️', tone: 'lav', name: { vi: 'Lenormand', en: 'Lenormand' },
    tagline: { vi: 'Hỏi chuyện cụ thể, trả lời cụ thể.', en: 'Concrete questions, concrete answers.' },
    packages: [
      { id: 'yn', name: { vi: '1 câu Yes/No', en: '1 yes/no question' }, price: 12000 },
      { id: 'q1', name: { vi: '1 câu chi tiết', en: '1 question in detail' }, price: 25000 },
      { id: 'q3', name: { vi: '3 câu chi tiết', en: '3 questions in detail' }, price: 50000 },
      { id: 'topic', name: { vi: 'Xem chủ đề sẵn', en: 'Set topic' }, price: 60000, needsTopic: true },
      { id: 't40', name: { vi: '40 phút', en: '40 minutes' }, price: 90000 }
    ] },
  { id: 'tea', icon: '🍵', tone: 'gold', name: { vi: 'Bói lá trà', en: 'Tea leaf reading' },
    tagline: { vi: 'Một tách trà, một câu chuyện.', en: 'One cup of tea, one story.' },
    note: { vi: 'Bạn pha một tách trà lá, uống gần cạn, chụp ảnh lòng tách gửi Nabu.', en: 'Brew loose-leaf tea, drink it nearly to the bottom, send Nabu a photo of the cup.' },
    packages: [
      { id: 'q1', name: { vi: '1 câu', en: '1 question' }, price: 25000 },
      { id: 'q3', name: { vi: '3 câu', en: '3 questions' }, price: 50000 },
      { id: 't30', name: { vi: '30 phút', en: '30 minutes' }, price: 80000 }
    ] },
  { id: 'tarot-oracle', icon: '🌙', tone: 'pink', name: { vi: 'Tarot + Oracle', en: 'Tarot + Oracle' },
    tagline: { vi: 'Tarot trả lời, Oracle nhắn thêm một lời.', en: 'Tarot answers, Oracle adds a message.' },
    packages: [
      { id: 'q1', name: { vi: '1 câu chi tiết', en: '1 question in detail' }, price: 30000 },
      { id: 'q3', name: { vi: '3 câu chi tiết', en: '3 questions in detail' }, price: 60000 },
      { id: 'topic', name: { vi: 'Xem chủ đề sẵn', en: 'Set topic' }, price: 70000, needsTopic: true },
      { id: 't40', name: { vi: '40 phút', en: '40 minutes' }, price: 100000 }
    ] },
  { id: 'lenormand-oracle', icon: '✨', tone: 'lav', name: { vi: 'Lenormand + Oracle', en: 'Lenormand + Oracle' },
    tagline: { vi: 'Chuyện cụ thể, thêm một lời nhắn.', en: 'The concrete story, plus a message.' },
    packages: [
      { id: 'q1', name: { vi: '1 câu chi tiết', en: '1 question in detail' }, price: 35000 },
      { id: 'q3', name: { vi: '3 câu chi tiết', en: '3 questions in detail' }, price: 65000 },
      { id: 'topic', name: { vi: 'Xem chủ đề sẵn', en: 'Set topic' }, price: 75000, needsTopic: true },
      { id: 't40', name: { vi: '40 phút', en: '40 minutes' }, price: 110000 }
    ] },
  { id: 'tuvi', icon: '🌸', tone: 'pink', name: { vi: 'Tử vi', en: 'Tử vi (Vietnamese astrology)' },
    tagline: { vi: 'Không phải chuyện hôm nay, mà là cả đường dài.', en: 'Not about today, but the long road.' },
    note: { vi: 'Cần ngày, tháng, năm sinh và giờ sinh chính xác.', en: 'Needs your exact date and hour of birth.' },
    needsBirth: true,
    packages: [
      { id: 'one', name: { vi: '1 vấn đề', en: '1 matter' }, price: 111000 },
      { id: 'year', name: { vi: 'Vận hạn năm', en: 'The year ahead' }, price: 222000 },
      { id: 'all', name: { vi: 'Tổng quan mọi vấn đề', en: 'Full overview of everything' }, price: 666000 }
    ] },
  { id: 'talk', icon: '💬', tone: 'blue', name: { vi: 'Chỉ tâm sự', en: 'Just talk' },
    tagline: { vi: 'Không bài, không dự đoán. Chỉ có người lắng nghe.', en: 'No cards, no predictions. Just someone who listens.' },
    packages: [
      { id: 't30', name: { vi: '30 phút', en: '30 minutes' }, price: 30000 },
      { id: 't60', name: { vi: '1 tiếng', en: '1 hour' }, price: 60000 }
    ] }
];
/* Paid courses in the Học tab. Access codes are made in the dashboard. */
const COURSES = [
  { id: 'tarot', price: 200000, months: 6, name: { vi: 'Khóa Tarot', en: 'Tarot course' },
    blurb: { vi: 'Toàn bộ 78 lá, mỗi lá có hình, từ khóa, nghĩa xuôi ngược, nghĩa theo tình cảm, công việc, học tập, tiền bạc, và các câu hỏi thường gặp. Kèm 13 cách trải bài và các bài đọc.', en: 'All 78 cards with art, keywords, upright and reversed meanings, love / work / study / money readings and frequently asked questions. Plus 13 spreads and the guides.' },
    includes: { vi: ['78 lá bài, mỗi lá một trang', '13 cách trải bài có sơ đồ', 'Bài đọc: bắt đầu, lá ngược, lá hoàng gia', 'Dùng 6 tháng, xem offline'], en: ['78 cards, one page each', '13 spreads with diagrams', 'Guides: starting out, reversals, court cards', '6 months of access, works offline'] } },
  { id: 'lenormand', price: 200000, months: 6, name: { vi: 'Khóa Lenormand', en: 'Lenormand course' },
    blurb: { vi: 'Toàn bộ 36 lá, mỗi lá có hình, sắc thái, nghĩa chính, tình cảm, công việc, chỉ người, thời gian và các cặp lá. Kèm 7 cách trải bài và các bài đọc.', en: 'All 36 cards with art, tone, core meaning, love, work, person, timing and pairs. Plus 7 spreads and the guides.' },
    includes: { vi: ['36 lá bài, mỗi lá một trang', 'Cặp lá thường gặp', '7 cách trải bài, có Grand Tableau', 'Dùng 6 tháng, xem offline'], en: ['36 cards, one page each', 'Common pairs', '7 spreads including the Grand Tableau', '6 months of access, works offline'] } }
];
const PAYMENT_NOTE = { vi: 'Bạn thân mến vui lòng chuyển khoản trước khi xem.', en: 'Please transfer the fee before the reading.' };
const fmtPrice = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
