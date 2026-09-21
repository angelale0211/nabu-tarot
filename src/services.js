/* ============================ services + prices ============================
   Nabu's price list. Prices in VND. Each service has packages; a package
   may carry a `desc`, one sentence saying what it covers.
   Edit here, then  python build.py  and push. */
const SERVICES = [
  { id: 'tarot', icon: PICK_ICON, tone: 'blue', name: { vi: 'Tarot', en: 'Tarot', de: 'Tarot' },
    tagline: { vi: 'Bạn hỏi được thì Tarot trả lời được.', en: 'If you can ask it, Tarot can answer it.', de: 'Wenn du eine Frage hast, kann Tarot dir eine neue Perspektive darauf geben.' },
    packages: [
      { id: 'q1', name: { vi: '1 câu hỏi', en: '1 question', de: '1 Frage' }, price: 39000 },
      { id: 'q3', name: { vi: '3 câu hỏi', en: '3 questions', de: '3 Fragen' }, price: 99000 },
      { id: 'deep', name: { vi: 'Chuyên sâu 1 vấn đề', en: 'One matter in depth', de: 'Ein Thema ausführlich' }, price: 149000,
        desc: { vi: 'Tối đa 5 câu hỏi, tất cả xoay quanh cùng một vấn đề.', en: 'Up to 5 questions, all about the same matter.', de: 'Bis zu 5 Fragen, alle zum selben Thema.' } },
      { id: 'm3', name: { vi: 'Tổng quan 3 tháng', en: '3-month overview', de: 'Überblick 3 Monate' }, price: 159000,
        desc: { vi: 'Tình cảm, công việc/học tập, tài chính, xu hướng nổi bật, cơ hội và thử thách, điều cần lưu ý và lời khuyên.', en: 'Love, work or study, money, the main trends, opportunities and challenges, what to watch for and advice.', de: 'Liebe, Arbeit oder Studium, Finanzen, die wichtigsten Tendenzen, Chancen und Herausforderungen, worauf du achten solltest, und ein Rat.' } },
      { id: 'm6', name: { vi: 'Tổng quan 6 tháng', en: '6-month overview', de: 'Überblick 6 Monate' }, price: 249000,
        desc: { vi: 'Như gói 3 tháng, nhìn xa hơn: từng giai đoạn trong 6 tháng, những thay đổi lớn và lời khuyên cho từng chặng.', en: 'As the 3-month reading, over a longer road: each stage of the six months, the larger changes, and advice for each one.', de: 'Wie der 3-Monats-Überblick, aber weiter gefasst: jede Phase der sechs Monate, die größeren Veränderungen und ein Rat zu jeder.' } },
      { id: 'm12', name: { vi: 'Tổng quan 12 tháng', en: '12-month overview', de: 'Überblick 12 Monate' }, price: 399000,
        desc: { vi: 'Trọn một năm: từng quý, xu hướng dài hạn, cơ hội và thử thách lớn, cùng lời khuyên chi tiết cho cả năm.', en: 'A whole year: quarter by quarter, the long trends, the big opportunities and challenges, and detailed advice for the year.', de: 'Ein ganzes Jahr: Quartal für Quartal, die langen Tendenzen, die großen Chancen und Herausforderungen und ein ausführlicher Rat für das Jahr.' } }
    ] },
  { id: 'tarot-oracle', icon: '🌙', tone: 'pink', name: { vi: 'Tarot + Oracle', en: 'Tarot + Oracle', de: 'Tarot + Oracle' },
    tagline: { vi: 'Tarot phân tích tình huống, diễn biến, nguyên nhân, cảm xúc và xu hướng; Oracle bổ sung thông điệp, định hướng và lời khuyên.', en: 'Tarot reads the situation, how it unfolds, the reasons, the feelings and the trend; Oracle adds a message, a direction and advice.', de: 'Tarot deutet die Situation, ihren Verlauf, die Gründe, die Gefühle und die Tendenz; Oracle ergänzt eine Botschaft, eine Richtung und einen Rat.' },
    packages: [
      { id: 'deep', name: { vi: 'Chuyên sâu 1 vấn đề', en: 'One matter in depth', de: 'Ein Thema ausführlich' }, price: 179000,
        desc: { vi: 'Tối đa 5 câu hỏi cùng một chủ đề, kèm thông điệp và định hướng từ Oracle.', en: 'Up to 5 questions on the same matter, with a message and a direction from Oracle.', de: 'Bis zu 5 Fragen zum selben Thema, dazu eine Botschaft und eine Richtung von Oracle.' } },
      { id: 'm3', name: { vi: 'Tổng quan 3 tháng', en: '3-month overview', de: 'Überblick 3 Monate' }, price: 199000,
        desc: { vi: 'Phần phân tích Tarot của gói tổng quan 3 tháng, thêm thông điệp và định hướng từ Oracle.', en: 'The Tarot reading of the 3-month overview, with a message and a direction from Oracle.', de: 'Die Tarot-Deutung des 3-Monats-Überblicks, dazu eine Botschaft und eine Richtung von Oracle.' } },
      { id: 'm6', name: { vi: 'Tổng quan 6 tháng', en: '6-month overview', de: 'Überblick 6 Monate' }, price: 299000,
        desc: { vi: 'Phần phân tích Tarot của gói tổng quan 6 tháng, thêm thông điệp và định hướng từ Oracle.', en: 'The Tarot reading of the 6-month overview, with a message and a direction from Oracle.', de: 'Die Tarot-Deutung des 6-Monats-Überblicks, dazu eine Botschaft und eine Richtung von Oracle.' } },
      { id: 'm12', name: { vi: 'Tổng quan 12 tháng', en: '12-month overview', de: 'Überblick 12 Monate' }, price: 459000,
        desc: { vi: 'Phần phân tích Tarot của gói tổng quan 12 tháng, thêm thông điệp và định hướng từ Oracle.', en: 'The Tarot reading of the 12-month overview, with a message and a direction from Oracle.', de: 'Die Tarot-Deutung des 12-Monats-Überblicks, dazu eine Botschaft und eine Richtung von Oracle.' } }
    ] },
  { id: 'tea', icon: '🍵', tone: 'gold', name: { vi: 'Bài trà', en: 'Tealeaf fortune telling', de: 'Teeblattdeutung' },
    tagline: { vi: 'Tập trung vào sự kiện, dấu hiệu, cơ hội và thay đổi có thể xuất hiện trong thời gian tới.', en: 'It looks at events, signs, opportunities and changes that may be on their way.', de: 'Der Blick geht auf Ereignisse, Zeichen, Chancen und Veränderungen, die kommen können.' },
    packages: [
      { id: 'coming', name: { vi: 'Điều gì đang đến với bạn?', en: 'What is coming your way?', de: 'Was auf dich zukommt' }, price: 99000,
        desc: { vi: 'Những sự kiện và dấu hiệu nổi bật đang đến gần.', en: 'The events and signs that stand out as they approach.', de: 'Die Ereignisse und Zeichen, die sich gerade abzeichnen.' } },
      { id: 'm1', name: { vi: '1 tháng', en: '1 month', de: '1 Monat' }, price: 79000,
        desc: { vi: 'Sự kiện, thay đổi và điều đáng chú ý trong 1 tháng tới.', en: 'Events, changes and what is worth noticing in the coming month.', de: 'Ereignisse, Veränderungen und Bemerkenswertes im kommenden Monat.' } },
      { id: 'm3', name: { vi: '3 tháng', en: '3 months', de: '3 Monate' }, price: 159000,
        desc: { vi: 'Sự kiện, thay đổi và điều đáng chú ý trong 3 tháng tới.', en: 'Events, changes and what is worth noticing over the next three months.', de: 'Ereignisse, Veränderungen und Bemerkenswertes in den nächsten drei Monaten.' } },
      { id: 'm6', name: { vi: '6 tháng', en: '6 months', de: '6 Monate' }, price: 279000,
        desc: { vi: 'Sự kiện, thay đổi và điều đáng chú ý trong 6 tháng tới, theo từng giai đoạn.', en: 'Events, changes and what is worth noticing over six months, stage by stage.', de: 'Ereignisse, Veränderungen und Bemerkenswertes über sechs Monate, Phase für Phase.' } },
      { id: 'm12', name: { vi: '12 tháng', en: '12 months', de: '12 Monate' }, price: 499000,
        desc: { vi: 'Sự kiện, thay đổi và điều đáng chú ý trong cả năm, theo từng quý.', en: 'Events, changes and what is worth noticing across the year, quarter by quarter.', de: 'Ereignisse, Veränderungen und Bemerkenswertes über das ganze Jahr, Quartal für Quartal.' } },
      { id: 'area', name: { vi: 'Một lĩnh vực chuyên sâu', en: 'One area in depth', de: 'Ein Bereich ausführlich' }, price: 149000,
        desc: { vi: 'Chọn tình yêu, công việc, tài chính, gia đình hoặc một vấn đề bạn đang quan tâm.', en: 'Choose love, work, money, family, or a matter on your mind.', de: 'Wähle Liebe, Arbeit, Finanzen, Familie oder ein Thema, das dich beschäftigt.' } }
    ] },
  { id: 'tea-oracle', icon: '✨', tone: 'lav', name: { vi: 'Bài trà + Oracle', en: 'Tealeaf + Oracle', de: 'Teeblattdeutung + Oracle' },
    tagline: { vi: 'Bài trà tập trung vào sự kiện và những điều có khả năng xảy ra; Oracle bổ sung thông điệp, lời khuyên và định hướng.', en: 'The tealeaves look at events and what may happen; Oracle adds a message, advice and a direction.', de: 'Die Teeblätter zeigen Ereignisse und Mögliches; Oracle ergänzt eine Botschaft, einen Rat und eine Richtung.' },
    packages: [
      { id: 'coming', name: { vi: 'Điều sắp tới', en: 'What is coming your way', de: 'Was auf dich zukommt' }, price: 129000,
        desc: { vi: 'Những điều đang đến gần, kèm thông điệp và lời khuyên từ Oracle.', en: 'What is drawing near, with a message and advice from Oracle.', de: 'Was sich nähert, dazu eine Botschaft und ein Rat von Oracle.' } },
      { id: 'm1', name: { vi: '1 tháng', en: '1 month', de: '1 Monat' }, price: 109000,
        desc: { vi: 'Sự kiện và thay đổi trong 1 tháng tới, kèm thông điệp và lời khuyên từ Oracle.', en: 'Events and changes in the coming month, with a message and advice from Oracle.', de: 'Ereignisse und Veränderungen im kommenden Monat, dazu eine Botschaft und ein Rat von Oracle.' } },
      { id: 'm3', name: { vi: '3 tháng', en: '3 months', de: '3 Monate' }, price: 199000,
        desc: { vi: 'Sự kiện và thay đổi trong 3 tháng tới, kèm thông điệp và lời khuyên từ Oracle.', en: 'Events and changes over three months, with a message and advice from Oracle.', de: 'Ereignisse und Veränderungen über drei Monate, dazu eine Botschaft und ein Rat von Oracle.' } },
      { id: 'm6', name: { vi: '6 tháng', en: '6 months', de: '6 Monate' }, price: 329000,
        desc: { vi: 'Sự kiện và thay đổi trong 6 tháng tới, kèm thông điệp và lời khuyên từ Oracle.', en: 'Events and changes over six months, with a message and advice from Oracle.', de: 'Ereignisse und Veränderungen über sechs Monate, dazu eine Botschaft und ein Rat von Oracle.' } },
      { id: 'm12', name: { vi: '12 tháng', en: '12 months', de: '12 Monate' }, price: 569000,
        desc: { vi: 'Sự kiện và thay đổi trong cả năm, kèm thông điệp và lời khuyên từ Oracle.', en: 'Events and changes across the year, with a message and advice from Oracle.', de: 'Ereignisse und Veränderungen über das ganze Jahr, dazu eine Botschaft und ein Rat von Oracle.' } }
    ] },
  { id: 'tuvi', icon: '🌸', tone: 'pink', name: { vi: 'Tử vi', en: 'Tử vi (Vietnamese astrology)', de: 'Tử vi (vietnamesische Astrologie)' },
    tagline: { vi: 'Không phải chuyện hôm nay, mà là cả đường dài.', en: 'Not just today, but the long road.', de: 'Nicht nur der heutige Tag, sondern der längere Weg.' },
    note: { vi: 'Cần ngày, tháng, năm sinh và giờ sinh chính xác.', en: 'Needs your exact date and hour of birth.', de: 'Benötigt dein genaues Geburtsdatum und möglichst die genaue Geburtszeit.' },
    needsBirth: true,
    packages: [
      { id: 'one', name: { vi: '1 vấn đề', en: '1 matter', de: '1 Thema' }, price: 99000 },
      { id: 'year', name: { vi: 'Vận hạn năm', en: 'The year ahead', de: 'Das kommende Jahr' }, price: 333000 },
      { id: 'all', name: { vi: 'Tổng quan mọi vấn đề', en: 'Full overview of everything', de: 'Gesamtüberblick' }, price: 666000 }
    ] },
  { id: 'talk', icon: '💬', tone: 'blue', name: { vi: 'Tâm sự', en: 'Just talk', de: 'Einfach reden' },
    tagline: { vi: 'Một không gian riêng tư để bạn chia sẻ điều đang khiến mình băn khoăn, áp lực, hoặc đơn giản là cần một người lắng nghe.', en: 'A private space to share what is weighing on you, or simply to be heard.', de: 'Ein privater Raum für das, was dich beschäftigt oder belastet - oder einfach, um gehört zu werden.' },
    note: { vi: 'Lắng nghe và trò chuyện riêng tư, không phán xét. Bạn có thể chia sẻ về tình cảm, công việc, học tập, gia đình hoặc chuyện cá nhân. Đây không phải trị liệu hay tư vấn tâm lý chuyên môn.', en: 'A private conversation, without judgement. Love, work, study, family or anything personal. This is not therapy or professional psychological advice.', de: 'Ein privates Gespräch, ohne Urteil. Liebe, Arbeit, Studium, Familie oder Persönliches. Das ist keine Therapie und keine psychologische Fachberatung.' },
    packages: [
      { id: 't30', name: { vi: '30 phút', en: '30 minutes', de: '30 Minuten' }, price: 59000 },
      { id: 't60', name: { vi: '60 phút', en: '60 minutes', de: '60 Minuten' }, price: 99000 }
    ] }
];
/* Paid courses in the Học tab. Access codes are made in the dashboard. */
/* kind: a course is something to read, an unlock is something to use. They
   are sold the same way and belong in different lists. */
const COURSES = [
  { id: 'tarot', kind: 'course', icon: PICK_ICON, to: '#/learn/tarot', price: 300000, months: 6, sum: { vi: '78 lá, 8 trải bài và các bài đọc.', en: '78 cards, 8 spreads and the guides.', de: '78 Karten, 8 Legungen und ausführliche Guides.' }, name: { vi: 'Khóa Tarot', en: 'Tarot course', de: 'Tarot-Kurs' },
    blurb: { vi: 'Toàn bộ 78 lá, mỗi lá có hình, từ khóa, nghĩa xuôi ngược, nghĩa theo tình cảm, công việc, học tập, tiền bạc, và các câu hỏi thường gặp. Kèm 8 cách trải bài và các bài đọc.', en: 'All 78 cards with art, keywords, upright and reversed meanings, love / work / study / money readings and frequently asked questions. Plus 8 spreads and the guides.', de: 'Alle 78 Karten mit Bild, Stichworten, aufrechter und umgekehrter Bedeutung sowie Deutungen für Liebe, Arbeit, Lernen und Geld. Dazu häufige Fragen, 8 Legungen und ausführliche Guides.' },
    includes: { vi: ['78 lá bài, mỗi lá một trang', '8 cách trải bài có sơ đồ', 'Bài đọc: bắt đầu, lá ngược, lá hoàng gia', 'Dùng 6 tháng, xem offline'], en: ['78 cards, one page each', '8 spreads with diagrams', 'Guides: starting out, reversals, court cards', '6 months of access, works offline'], de: ['78 Karten, jede mit eigener Seite', '8 Legungen mit Diagrammen', 'Guides: Einstieg, umgekehrte Karten, Hofkarten', '6 Monate Zugriff, auch offline'] } },
  { id: 'lenormand', kind: 'course', icon: '🗝️', to: '#/learn/lenormand', price: 300000, months: 6, sum: { vi: '36 lá, 7 trải bài và cách ghép cặp.', en: '36 cards, 7 spreads and how to pair them.', de: '36 Karten, 7 Legungen und Kartenkombinationen.' }, name: { vi: 'Khóa Lenormand', en: 'Lenormand course', de: 'Lenormand-Kurs' },
    blurb: { vi: 'Toàn bộ 36 lá, mỗi lá có hình, sắc thái, nghĩa chính, tình cảm, công việc, chỉ người, thời gian và các cặp lá. Kèm 7 cách trải bài và các bài đọc.', en: 'All 36 cards with art, tone, core meaning, love, work, person, timing and pairs. Plus 7 spreads and the guides.', de: 'Alle 36 Karten mit Bild, Grundton, Kernbedeutung sowie Deutungen für Liebe, Arbeit, Personen, Zeit und Kartenpaare. Dazu 7 Legungen und ausführliche Guides.' },
    includes: { vi: ['36 lá bài, mỗi lá một trang', 'Cặp lá thường gặp', '7 cách trải bài, có Grand Tableau', 'Dùng 6 tháng, xem offline'], en: ['36 cards, one page each', 'Common pairs', '7 spreads including the Grand Tableau', '6 months of access, works offline'], de: ['36 Karten, jede mit eigener Seite', 'Häufige Kartenpaare', '7 Legungen inklusive Grand Tableau', '6 Monate Zugriff, auch offline'] } },
  { id: 'playing', kind: 'course', icon: '🂡', to: '#/learn/playing', price: 300000, months: 6, sum: { vi: '52 lá bài Tây, 9 bài học, 4 trải bài.', en: '52 playing cards, 9 lessons, 4 spreads.', de: '52 Spielkarten, 9 Lektionen und 4 Legungen.' }, name: { vi: 'Khóa Bài Tây', en: 'Cartomancy course', de: 'Kurs Kartenlegen mit Spielkarten' },
    blurb: { vi: 'Bói bài Tây 52 lá theo lối truyền thống: bốn chất, câu chuyện từ Át tới Mười, 12 lá hình, cặp lá, thời gian và bốn trải bài. Mỗi lá có hình vẽ, nghĩa truyền thống, lý do của nghĩa ấy và lá tarot tương ứng.', en: 'Traditional 52-card cartomancy: four suits, the Ace-to-Ten story, the 12 court cards, pairs, timing and four spreads. Every card has a drawn face, its traditional meaning, why it means that, and its tarot twin.', de: 'Traditionelles Kartenlegen mit 52 Spielkarten: vier Farben, die Entwicklung vom Ass bis zur Zehn, 12 Hofkarten, Kartenpaare, Zeitdeutung und vier Legungen. Jede Karte zeigt ihre traditionelle Bedeutung, den Hintergrund dieser Deutung und die Tarot-Entsprechung.' },
    includes: { vi: ['9 bài học có hình', '52 lá, mỗi lá một trang', 'Cặp lá, thời gian, trải bài điều ước', 'Dùng 6 tháng, xem offline'], en: ['9 illustrated sessions', '52 cards, one page each', 'Pairs, timing, the wish spread', '6 months of access, works offline'], de: ['9 bebilderte Lektionen', '52 Karten, jede mit eigener Seite', 'Kartenpaare, Zeitdeutung und Wunschlegung', '6 Monate Zugriff, auch offline'] } },
  { id: 'manifest', kind: 'course', icon: '🌙', to: '#/learn/manifest', price: 75000, months: 12, sum: { vi: '7 phương pháp, mỗi bài một công cụ.', en: '7 methods, one tool with each.', de: '7 Methoden, jeweils mit einem Werkzeug zum Ausprobieren.' }, name: { vi: 'Bộ Manifestation', en: 'Manifestation set', de: 'Manifestation-Set' },
    blurb: { vi: 'Bảy phương pháp có công cụ làm ngay trong app: WOOP, bảng tầm nhìn có ảnh, nghi thức trăng, kế hoạch nếu-thì, buông bỏ, giới hạn, nến và đá. Mọi thứ bạn viết được lưu trên máy và có thể xoá làm lại bất cứ lúc nào.', en: 'Seven methods with tools you use right in the app: WOOP, a vision board with photos, Moon rituals, if-then plans, letting go, limits, candles and stones. Everything you write is saved on your device and can be cleared and redone any time.', de: 'Sieben Methoden mit Werkzeugen direkt in der App: WOOP, Vision Board mit Bildern, Mondrituale, Wenn-dann-Pläne, Loslassen, Grenzen sowie Kerzen und Steine. Deine Einträge werden auf deinem Gerät gespeichert und können jederzeit gelöscht oder neu begonnen werden.' },
    includes: { vi: ['7 bài hướng dẫn nâng cao', 'Bảng ảnh, kế hoạch, nghi thức, buông bỏ', 'Nến và đá theo mục đích', 'Dùng 12 tháng, xem offline'], en: ['7 advanced guides', 'Photo board, plans, ritual and letting-go tools', 'Candles and stones by purpose', '12 months of access, works offline'], de: ['7 vertiefende Guides', 'Vision Board, Pläne, Rituale und Loslassen', 'Kerzen und Steine nach Absicht', '12 Monate Zugriff, auch offline'] } },
  { id: 'plus', kind: 'unlock', icon: '✨', to: '#/play/coin', price: 79000, months: 12,
    sum: { vi: 'Không giới hạn lượt tung đồng xu, rung cây, mở mọi giao diện.', en: 'The coin and the tree without limit, and every design.', de: 'Unbegrenzt Münze werfen und den Botschaftsbaum schütteln – plus alle Designs.' },
    name: { vi: 'Nabu Plus', en: 'Nabu Plus', de: 'Nabu Plus' },
    blurb: { vi: 'Nabu Plus mở toàn bộ các phần ngoài khu vực bạn nhỏ. Bạn được tung đồng xu và rung cây thông điệp không giới hạn số lượt, đồng thời sử dụng tất cả giao diện của ứng dụng: mặt sau lá bài, cây thông điệp, đồng xu và trang nhật ký.',
      en: 'Everything that is not a companion: flip the coin and shake the message tree as often as you like, and take every design in the app — card backs, message trees, coins and diary pages.', de: 'Nabu Plus schaltet alle Bereiche außerhalb der Begleiterwelt frei. Du kannst die Münze und den Botschaftsbaum unbegrenzt nutzen und alle Designs verwenden: Kartenrückseiten, Botschaftsbäume, Münzen und Tagebuchseiten.' },
    includes: { vi: ['Tung đồng xu không giới hạn', 'Rung cây thông điệp không giới hạn', '3 mặt sau lá bài, 3 cây thông điệp, 3 đồng xu, 3 trang nhật ký', 'Thời hạn sử dụng 12 tháng'],
      en: ['Unlimited coin flips', 'Unlimited tree shakes', '3 card backs, 3 trees, 3 coins, 3 diary pages', '12 months of access'], de: ['Unbegrenzte Münzwürfe', 'Unbegrenztes Schütteln des Botschaftsbaums', '3 Kartenrückseiten, 3 Botschaftsbäume, 3 Münzen, 3 Tagebuchseiten', '12 Monate Zugriff'] } },
  /* Pro is sold by the half year and by the year. The year is cheaper by the
     month - 249.000 against 298.000 for two half years - so paying once is the
     better deal and reads as one. Both open exactly the same thing; only the
     date they run to differs. */
  { id: 'pro6', kind: 'unlock', icon: '👑', to: '#/play/pet', price: 149000, months: 6,
    sum: { vi: 'Trọn quyền lợi Plus, thêm linh thú và vật phẩm cho bạn nhỏ.', en: 'All of Plus, and the companions with everything for them.', de: 'Alles aus Nabu Plus, dazu Begleiter und ihre Gegenstände.' },
    name: { vi: 'Nabu Pro · 6 tháng', en: 'Nabu Pro · 6 months', de: 'Nabu Pro · 6 Monate' },
    blurb: { vi: 'Nabu Pro bao gồm toàn bộ quyền lợi của Nabu Plus, cùng với khu vực bạn nhỏ: mười hai linh thú trong truyền thuyết, nuôi tối đa sáu bạn cùng lúc, đầy đủ thức ăn, nhà ở và trang phục dành cho các bạn ấy, thời gian chờ giữa hai bữa rút ngắn từ sáu giờ xuống còn hai giờ, và điểm kinh nghiệm nhân đôi.',
      en: 'Everything in Nabu Plus, and the companions besides: twelve spirit beasts, six of them at once, their good food, their homes and their clothes, a two-hour wait between meals instead of six, and double points.', de: 'Nabu Pro enthält alles aus Nabu Plus und zusätzlich die Begleiterwelt: zwölf mythische Begleiter, bis zu sechs gleichzeitig, alle Futtersorten, Zuhause und Kleidungsstücke, nur zwei statt sechs Stunden Wartezeit zwischen den Mahlzeiten und doppelte Erfahrungspunkte.' },
    includes: { vi: ['Toàn bộ quyền lợi của Nabu Plus', '12 linh thú, nuôi tối đa 6 bạn cùng lúc', '9 món ăn, 8 ngôi nhà, 9 bộ trang phục', 'Chờ 2 giờ giữa hai bữa, 3 lượt chơi mỗi ngày, điểm kinh nghiệm nhân đôi', 'Thời hạn sử dụng 6 tháng'],
      en: ['Everything in Nabu Plus', '12 spirit beasts, six kept at once', '9 foods, 8 homes, 9 things to wear', '2 hours between meals, 3 plays a day, double points', '6 months of access'], de: ['Alle Vorteile von Nabu Plus', '12 Begleiter, bis zu 6 gleichzeitig', '9 Futtersorten, 8 Zuhause, 9 Kleidungsstücke', '2 Stunden zwischen Mahlzeiten, 3 Spiele pro Tag, doppelte Erfahrungspunkte', '6 Monate Zugriff'] } },
  { id: 'pro', kind: 'unlock', icon: '👑', to: '#/play/pet', price: 249000, months: 12,
    /* No amount here on purpose. The saving is a different number in every
       currency Play sells in, and naming one invites the reader to check it
       against a price that was rounded separately. "Saves more" is true in
       all of them. */
    sum: { vi: 'Quyền lợi như gói 6 tháng, dùng trọn một năm và tiết kiệm hơn.', en: 'The same, for a whole year — and cheaper than two half years.', de: 'Dieselben Vorteile wie im 6-Monats-Paket, für ein ganzes Jahr und günstiger als zweimal 6 Monate.' },
    name: { vi: 'Nabu Pro · 12 tháng', en: 'Nabu Pro · 12 months', de: 'Nabu Pro · 12 Monate' },
    blurb: { vi: 'Nabu Pro bao gồm toàn bộ quyền lợi của Nabu Plus, cùng với khu vực bạn nhỏ: mười hai linh thú trong truyền thuyết, nuôi tối đa sáu bạn cùng lúc, đầy đủ thức ăn, nhà ở và trang phục dành cho các bạn ấy, thời gian chờ giữa hai bữa rút ngắn từ sáu giờ xuống còn hai giờ, và điểm kinh nghiệm nhân đôi. Thanh toán một lần cho cả năm sẽ tiết kiệm hơn so với mua hai lần gói 6 tháng.',
      en: 'Everything in Nabu Plus, and the companions besides: twelve spirit beasts, six of them at once, their good food, their homes and their clothes, a two-hour wait between meals instead of six, and double points. Paying once for the year costs less.', de: 'Nabu Pro enthält alles aus Nabu Plus und zusätzlich die Begleiterwelt: zwölf mythische Begleiter, bis zu sechs gleichzeitig, alle Futtersorten, Zuhause und Kleidungsstücke, nur zwei statt sechs Stunden Wartezeit zwischen den Mahlzeiten und doppelte Erfahrungspunkte. Die Jahreszahlung ist günstiger als zwei 6-Monats-Pakete.' },
    includes: { vi: ['Tiết kiệm hơn so với mua hai lần gói 6 tháng', 'Toàn bộ quyền lợi của Nabu Plus', '12 linh thú, nuôi tối đa 6 bạn cùng lúc', '9 món ăn, 8 ngôi nhà, 9 bộ trang phục', 'Chờ 2 giờ giữa hai bữa, 3 lượt chơi mỗi ngày, điểm kinh nghiệm nhân đôi', 'Thời hạn sử dụng 12 tháng'],
      en: ['Cheaper than two half years', 'Everything in Nabu Plus', '12 spirit beasts, six kept at once', '9 foods, 8 homes, 9 things to wear', '2 hours between meals, 3 plays a day, double points', '12 months of access'], de: ['Günstiger als zweimal 6 Monate', 'Alle Vorteile von Nabu Plus', '12 Begleiter, bis zu 6 gleichzeitig', '9 Futtersorten, 8 Zuhause, 9 Kleidungsstücke', '2 Stunden zwischen Mahlzeiten, 3 Spiele pro Tag, doppelte Erfahrungspunkte', '12 Monate Zugriff'] } },
  /* A wedding is bought once and held once. `months` is not what is being sold
     here - it is only the window the access is granted for, so that moving the
     date does not lose what was paid for. What a buyer is told is `term`:
     "12 months" beside a single ceremony read as a subscription. */
  { id: 'wedding', kind: 'unlock', icon: '\uD83D\uDC92', to: '#/wedding', price: 30000, months: 12,
    term: { vi: '1 lễ cưới', en: '1 wedding', de: '1 Hochzeit' },
    sum: { vi: 'Tổ chức lễ cưới trên Nabu, có khách mời và Nabu Cupid chủ hôn.', en: 'A ceremony on Nabu, with guests and Nabu Cupid to marry you.', de: 'Heiraten auf Nabu – mit Gästen und Nabu Cupid als Trauredner.' },
    name: { vi: 'Lễ cưới trên Nabu', en: 'A wedding on Nabu', de: 'Hochzeit auf Nabu' },
    blurb: { vi: 'Hai bạn đã đính ước trên sợi tơ hồng có thể tổ chức một lễ cưới ngay trong ứng dụng. Bạn chọn ngày giờ, gửi thiệp mời cho bạn bè, và đến giờ, Nabu Cupid sẽ chủ hôn: hỏi lời thề của từng người, chờ hai bạn trả lời, rồi tuyên bố hai bạn nên duyên. Khách mời vào xem, gửi quà chúc mừng miễn phí, và tham gia màn tung hoa cưới ở cuối buổi lễ.',
      en: 'A couple engaged on the red thread can hold a ceremony inside the app. You choose the day and the hour, send invitations to your friends, and when the time comes Nabu Cupid marries you: the vows are asked one at a time, you answer them in front of everybody, and then you are declared married. Guests watch, send free congratulations, and join the bouquet toss at the end.', de: 'Wenn ihr euch über den Roten Faden verlobt habt, könnt ihr eine Zeremonie direkt in der App feiern. Ihr wählt Datum und Uhrzeit, verschickt Einladungen und Nabu Cupid führt euch durch die Zeremonie: Eure Versprechen werden nacheinander gefragt, ihr antwortet vor euren Gästen und werdet anschließend als verheiratet erklärt. Gäste können zuschauen, kostenlose Glückwünsche und Geschenke senden und am Ende beim Brautstraußwurf mitmachen.' },
    includes: { vi: ['Phòng cưới riêng, có ngày giờ do hai bạn chọn', 'Thiệp mời gửi bằng đường dẫn, không giới hạn khách', 'Nabu Cupid chủ hôn, hỏi lời thề từng người', 'Nhạc lễ và hiệu ứng trong suốt buổi', 'Khách gửi lời chúc và quà miễn phí', 'Màn tung hoa cưới chọn người may mắn', '1 lễ cưới'],
      en: ['A room of your own, at an hour you choose', 'Invitations by link, as many guests as you like', 'Nabu Cupid asks each of you your vows', 'Music and effects throughout', 'Guests send congratulations and gifts, free', 'A bouquet toss to pick one lucky guest', '1 wedding'], de: ['Eigener Hochzeitsraum zu eurem gewählten Termin', 'Einladungslink für beliebig viele Gäste', 'Nabu Cupid führt durch eure Versprechen', 'Musik und Effekte während der Zeremonie', 'Kostenlose Glückwünsche und Geschenke von Gästen', 'Brautstraußwurf für einen glücklichen Gast', '1 Hochzeit'] } }
];
/* Where the reading itself happens. Three, because these are the three
   places Nabu actually reads. */
/* best: the one Nabu would rather use, and says so on the card.
   needsId: somewhere Nabu cannot reach without being given an account. */
const BOOK_WHERE = [
  { id: 'app', icon: '💬', best: true,
    name: { vi: 'Trong Nabu Tarot', en: 'Here in Nabu Tarot', de: 'In Nabu Tarot' },
    sub: { vi: 'Nabu nhắn trực tiếp trong mục Hồ sơ. Bạn có thể xem lại trên cả điện thoại và máy tính.',
      en: 'Nabu replies directly under Profile. You can revisit the reading on both phone and computer.',
      de: 'Nabu antwortet direkt im Profil. Du kannst die Legung später auf dem Handy und am Computer wieder ansehen.' } },
  { id: 'ig', icon: '📸', needsId: true, name: { vi: 'Instagram', en: 'Instagram', de: 'Instagram' },
    sub: { vi: 'Nabu nhắn qua tin nhắn Instagram', en: 'Nabu writes to you on Instagram', de: 'Nabu schreibt dir per Instagram-Direktnachricht.' } },
  { id: 'fb', icon: '💬', needsId: true, name: { vi: 'Facebook', en: 'Facebook', de: 'Facebook' },
    sub: { vi: 'Nabu nhắn qua Messenger', en: 'Nabu writes to you on Messenger', de: 'Nabu schreibt dir über Messenger.' } }
];
const whereOf = (id) => BOOK_WHERE.filter((w) => w.id === id)[0] || null;
const PAYMENT_NOTE = { vi: 'Vui lòng chuyển khoản trước khi xem.', en: 'Please transfer the fee in advance.', de: 'Bitte überweise vor der Legung.' };
const fmtNum = (n) => String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
/* ---- what a price looks like in the language being read ----

   Vietnamese is the price itself, in dong. English and German are converted at
   a rate kept right here - one number to change when the rate moves, rather
   than thirty-four prices to recalculate - and then a flat amount is added,
   because a card payment from abroad costs more to take than it does at home.

   The flat amount is smaller on the cheap tiers on purpose. Two euros on a
   ten-thousand-dong question is a five hundred per cent markup and flattens the
   bottom of the ladder: the one-question price and the three-question price
   come out the same number, which makes the cheap one look like a mistake.

   Rounded up to the next half, never down. Rounding a price down gives money
   away on every sale for the sake of a tidier number. */
const MONEY = {
  vi: { sym: 'đ', rate: 1 },
  en: { sym: '$', rate: 25500, add: 2, small: 1, under: 30000 },
  de: { sym: '€', rate: 27500, add: 2, small: 1, under: 30000 }
};
function moneyOf(n) {
  const m = MONEY[typeof lang !== 'undefined' ? lang : 'vi'] || MONEY.vi;
  const v = Math.max(0, Math.round(Number(n) || 0));
  if (m.rate === 1) return { m: m, v: v };
  const raw = v / m.rate + (v < m.under ? m.small : m.add);
  return { m: m, v: Math.ceil(raw * 2) / 2 };
}
/* A package may name its own price abroad. The smallest question is the way in
   to everything else, and the conversion plus a flat amount pushed it to a
   number that made it look like a worse deal than the tier above it. Only the
   dong price is real for the arithmetic; this is what a foreign reader sees. */
function fmtPrice(n, abroad) {
  const p = moneyOf(n);
  if (p.m.rate === 1) return fmtNum(p.v) + p.m.sym;
  const lg = typeof lang !== 'undefined' ? lang : 'vi';
  const v = (abroad && typeof abroad[lg] === 'number') ? abroad[lg] : p.v;
  return p.m.sym + (v % 1 ? v.toFixed(2) : String(v));
}

/* ---- an amount named inside a sentence ----
   Only the dong price is real. What a reader abroad is charged is that price
   converted, given its flat amount and rounded up on its own - which means a
   saving is not one number in three languages. The year against two half years
   saves 49.000d in dong, but the same two packages save $4 and EUR 3.50,
   because each of the four prices was rounded separately. Writing the dong
   figure into the English and German sentences put "49.000d" beside a price in
   dollars, which is what the owner reported.

   So the sentences carry a token and the amount is worked out here, in the
   currency on screen. The saving is the difference of the two prices a buyer
   actually sees - not the dong difference converted, which rounds to EUR 4 and
   would not match the two prices printed above it. */
function moneyText(v) {
  const m = MONEY[typeof lang !== 'undefined' ? lang : 'vi'] || MONEY.vi;
  if (m.rate === 1) return fmtNum(v) + m.sym;
  return m.sym + (v % 1 ? v.toFixed(2) : String(v));
}
const priceOf = (id) => { const c = COURSES.filter((x) => x.id === id)[0]; return c ? c.price : 0; };
/* How long a purchase lasts, as a buyer is told it. Almost everything here is
   sold by the month and says so; a thing bought once names itself instead. */
const termText = (c) => (c && c.term) ? L(c.term) : (((c && c.months) || 12) + ' ' + T().months6);
const proSaveText = () => moneyText(Math.max(0, moneyOf(priceOf('pro6')).v * 2 - moneyOf(priceOf('pro')).v));
const wedFeeText = () => fmtPrice(priceOf('wedding'));
const MONEY_IN_TEXT = { '{save}': proSaveText, '{wedfee}': wedFeeText };
/* Every sentence that names one of these amounts is passed through here on its
   way to the screen. A string with no token is returned untouched. */
function priceText(s) {
  let out = String(s == null ? '' : s);
  Object.keys(MONEY_IN_TEXT).forEach((k) => {
    if (out.indexOf(k) > -1) out = out.split(k).join(MONEY_IN_TEXT[k]());
  });
  return out;
}
