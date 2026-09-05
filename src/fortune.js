/* ============================ fortune telling ============================
   #/learn/fortune            hub: five illustrated tools
   #/learn/fortune/numbers    numerology: number wheel, your numbers, 9-year cycle
   #/learn/fortune/palm       palm map: tap a line
   #/learn/fortune/cards      playing cards -> the matching tarot card
   #/learn/fortune/tea        tea-leaf cup map + symbol glossary + practice draw
   #/learn/fortune/animals    the 12 animals wheel, trios and clashes */
const FT = {
  numbers: { ic: '🔢', vi: ['Thần số học', 'Số của bạn, từ ngày sinh và tên'], en: ['Numerology', 'Your numbers, from birth date and name'] },
  palm: { ic: '🖐️', vi: ['Xem chỉ tay', 'Bản đồ bàn tay, chạm từng đường'], en: ['Palm reading', 'A map of the hand, tap each line'] },
  cards: { ic: '🂡', vi: ['Bói bài Tây', '52 lá, nghĩa truyền thống + tarot'], en: ['Playing cards', '52 cards, traditional meanings + tarot'] },
  tea: { ic: '🍵', vi: ['Bài trà', 'Bản đồ tách trà và các hình'], en: ['Tealeaf fortune telling', 'Cup map and the shapes'] },
  animals: { ic: '🐉', vi: ['12 con giáp', 'Vòng con giáp, tam hợp, tứ hành xung'], en: ['12 animals', 'The wheel, trios and clashes'] }
};
const NUM_ICON = { 1: '🚀', 2: '🤝', 3: '🎨', 4: '🏛️', 5: '🧭', 6: '🏡', 7: '🔭', 8: '👑', 9: '🌍', 11: '⚡', 22: '🏗️', 33: '💞' };
const NUM_KW = {
  vi: { 1: 'dẫn đầu', 2: 'kết nối', 3: 'biểu đạt', 4: 'xây dựng', 5: 'tự do', 6: 'chăm sóc', 7: 'tìm hiểu', 8: 'làm chủ', 9: 'cho đi', 11: 'truyền cảm hứng', 22: 'xây điều lớn', 33: 'chữa lành' },
  en: { 1: 'lead', 2: 'connect', 3: 'express', 4: 'build', 5: 'freedom', 6: 'care', 7: 'seek', 8: 'master', 9: 'give', 11: 'inspire', 22: 'build big', 33: 'heal' }
};
const ANIMAL_EMOJI = ['🐀', '🐂', '🐅', '🐈', '🐉', '🐍', '🐎', '🐐', '🐒', '🐓', '🐕', '🐖'];
const ANIMAL_INFO = {
  vi: [['nhanh trí', 'khéo léo', 'tiết kiệm', 'Chuột nhanh, khôn và biết xoay xở. Hợp việc cần đầu óc và quan hệ.'], ['bền bỉ', 'thật thà', 'chậm mà chắc', 'Trâu chăm, chịu khó và giữ lời. Hợp việc cần kiên nhẫn.'], ['can đảm', 'nhiệt', 'thích dẫn đầu', 'Hổ mạnh mẽ, dám làm, hay bốc đồng. Hợp việc cần quyết đoán.'], ['nhẹ nhàng', 'khéo', 'cẩn trọng', 'Mèo tinh tế, hoà nhã, biết giữ mình. Hợp việc cần khéo léo.'], ['tự tin', 'may mắn', 'kiêu', 'Rồng nổi bật, nhiều năng lượng và tham vọng. Hợp việc lớn.'], ['sâu sắc', 'bí ẩn', 'trực giác', 'Rắn khôn ngoan, kín đáo, suy nghĩ kỹ. Hợp việc cần chiều sâu.'], ['tự do', 'nhanh', 'nhiệt tình', 'Ngựa yêu tự do, hoạt bát, thích đi. Hợp việc di chuyển, giao tiếp.'], ['hiền', 'sáng tạo', 'hay lo', 'Dê dịu dàng, nghệ sĩ, cần được yên. Hợp việc sáng tạo.'], ['thông minh', 'vui', 'tinh nghịch', 'Khỉ lanh lợi, sáng ý, thích đùa. Hợp việc cần ứng biến.'], ['chăm', 'thẳng', 'tỉ mỉ', 'Gà siêng năng, rõ ràng, hay góp ý. Hợp việc cần chính xác.'], ['trung thành', 'công bằng', 'hay lo', 'Chó tận tuỵ, thật thà, bảo vệ người thân. Hợp việc phục vụ.'], ['rộng lượng', 'tốt bụng', 'dễ tin', 'Lợn hiền, hào phóng, thích vui vẻ. Hợp việc chăm sóc, ẩm thực.']],
  en: [['quick', 'resourceful', 'thrifty', 'The Rat is quick, clever and adaptable. Suits work of the mind and networks.'], ['steady', 'honest', 'slow but sure', 'The Ox is diligent and keeps its word. Suits patient work.'], ['brave', 'fiery', 'leads', 'The Tiger is strong, bold, sometimes rash. Suits decisive work.'], ['gentle', 'tactful', 'careful', 'The Cat is refined, gracious, self-protective. Suits delicate work.'], ['confident', 'lucky', 'proud', 'The Dragon stands out, full of energy and ambition. Suits big things.'], ['deep', 'mysterious', 'intuitive', 'The Snake is wise, private, thinks it through. Suits work with depth.'], ['free', 'fast', 'enthusiastic', 'The Horse loves freedom, lively, always moving. Suits travel and talk.'], ['gentle', 'creative', 'worried', 'The Goat is soft, artistic, needs peace. Suits creative work.'], ['clever', 'fun', 'mischievous', 'The Monkey is sharp, inventive, playful. Suits improvisation.'], ['hard-working', 'direct', 'precise', 'The Rooster is diligent, clear, quick to advise. Suits exact work.'], ['loyal', 'fair', 'anxious', 'The Dog is devoted, honest, protective. Suits service.'], ['generous', 'kind', 'trusting', 'The Pig is gentle, giving, fond of fun. Suits care and food.']]
};
const TRIOS = [[8, 0, 4], [2, 6, 10], [11, 3, 7], [5, 9, 1]];       // tam hợp: Thân Tý Thìn · Dần Ngọ Tuất · Hợi Mão Mùi · Tỵ Dậu Sửu
const CLASHES = [[0, 6, 3, 9], [2, 8, 5, 11], [4, 10, 1, 7]];        // tứ hành xung: Tý Ngọ Mão Dậu · Dần Thân Tỵ Hợi · Thìn Tuất Sửu Mùi
const PALM = {
  heart: { d: 'M28 62 C 44 46, 68 40, 92 44', vi: ['Đường tim', 'Đường trên cùng, chạy ngang dưới các ngón. Nói về tình cảm, cách bạn yêu và cách bạn nhận yêu thương.', ['Cong và dài: cởi mở, dễ bày tỏ cảm xúc.', 'Thẳng và ngắn: kín đáo, thực tế trong tình yêu.', 'Kết thúc dưới ngón trỏ: yêu bằng lý tưởng, dễ hài lòng.', 'Kết thúc dưới ngón giữa: yêu bằng lý trí, đặt mình trước.', 'Có nhánh nhỏ đi lên: nhiều mối quan hệ tốt; nhánh đi xuống: từng thất vọng.']], en: ['Heart line', 'The topmost line, running across under the fingers. It speaks of feelings, how you love and how you receive love.', ['Curved and long: open, shows feelings easily.', 'Straight and short: private, practical in love.', 'Ends under the index finger: idealistic, content in love.', 'Ends under the middle finger: loves with the head, puts self first.', 'Small branches upward: good relationships; downward: past disappointments.']] },
  head: { d: 'M26 74 C 46 70, 66 74, 84 86', vi: ['Đường trí', 'Đường giữa lòng bàn tay. Nói về cách bạn nghĩ, học và quyết định.', ['Dài: nghĩ nhiều, thích phân tích.', 'Ngắn: quyết nhanh, thực tế.', 'Cong xuống phía gò Mặt Trăng: giàu tưởng tượng, sáng tạo.', 'Thẳng: thiên về logic, con số.', 'Tách rời đường sinh mệnh ngay từ đầu: độc lập sớm; dính vào một đoạn: thận trọng, gắn bó gia đình.']], en: ['Head line', 'The line through the middle of the palm. It speaks of how you think, learn and decide.', ['Long: thinks a lot, likes to analyse.', 'Short: decides fast, stays practical.', 'Curving down toward the Moon mount: imaginative, creative.', 'Straight: leans to logic and numbers.', 'Separate from the life line at the start: independent early; joined for a stretch: cautious, close to family.']] },
  life: { d: 'M30 70 C 24 92, 30 116, 50 134', vi: ['Đường sinh mệnh', 'Đường vòng quanh gốc ngón cái. Nói về sức sống, sức bền và những thay đổi lớn, không phải tuổi thọ.', ['Rõ và sâu: nhiều sức sống, hồi phục nhanh.', 'Mờ hoặc mảnh: dễ mệt, cần chăm cơ thể.', 'Vòng rộng ôm lấy gò Kim Tinh: sống hết mình, hướng ngoại.', 'Sát gốc ngón cái: dè dặt, tiết kiệm sức.', 'Đứt đoạn hay rẽ nhánh: một lần đổi đời như chuyển nhà, đổi việc.']], en: ['Life line', 'The line curving around the base of the thumb. It speaks of vitality, stamina and big changes, not of lifespan.', ['Clear and deep: strong vitality, quick recovery.', 'Faint or thin: tires easily, should care for the body.', 'A wide curve around the Venus mount: lives fully, outgoing.', 'Hugging the thumb: reserved, saves energy.', 'A break or fork: a turning point such as a move or a new job.']] },
  fate: { d: 'M62 136 C 60 110, 60 84, 64 56', vi: ['Đường sự nghiệp', 'Đường dọc giữa bàn tay, hướng lên ngón giữa. Không phải ai cũng có. Nói về con đường công việc và mục đích.', ['Rõ từ dưới lên: định hướng sớm, sự nghiệp ổn định.', 'Bắt đầu từ giữa tay: tìm ra đường của mình muộn hơn.', 'Xuất phát từ đường sinh mệnh: tự gây dựng.', 'Xuất phát từ gò Mặt Trăng: công việc nhờ người khác giúp hoặc công việc hướng về công chúng.', 'Đứt rồi nối tiếp: đổi ngành, đổi hướng.']], en: ['Fate line', 'The line up the middle of the palm toward the middle finger. Not everyone has one. It speaks of the work path and sense of purpose.', ['Clear from the bottom: early direction, steady career.', 'Starting mid-palm: finds the right path later.', 'Starting from the life line: self-made.', 'Starting from the Moon mount: work helped by others, or public-facing work.', 'Broken then continued: a change of field or direction.']] },
  sun: { d: 'M80 130 C 82 108, 84 88, 86 68', vi: ['Đường mặt trời', 'Đường dọc hướng lên ngón áp út. Nói về sự sáng tạo, danh tiếng và sự hài lòng với việc mình làm.', ['Rõ và dài: được công nhận, có tài trong nghệ thuật hay giao tiếp.', 'Ngắn, chỉ ở phần trên: thành công đến muộn nhưng chắc.', 'Nhiều đường nhỏ: nhiều hứng thú, khó chọn một.', 'Không có: hạnh phúc không phụ thuộc vào sự chú ý của người khác.']], en: ['Sun line', 'A vertical line toward the ring finger. It speaks of creativity, recognition and satisfaction in your work.', ['Clear and long: recognised, gifted in art or communication.', 'Short, only near the top: success comes late but stays.', 'Several small lines: many interests, hard to pick one.', 'Absent: happiness does not depend on being noticed.']] },
  mercury: { d: 'M46 130 C 62 118, 80 104, 96 84', vi: ['Đường sức khỏe', 'Đường chéo từ gần cổ tay lên gò ngón út. Nói về sức khỏe, làm ăn và cách bạn nói chuyện.', ['Rõ và thẳng: nói năng rõ ràng, nhạy trong kinh doanh.', 'Gợn sóng hoặc đứt: cơ thể hay báo động khi căng thẳng, cần nghỉ đủ.', 'Không có: theo cách xem truyền thống, đây là dấu hiệu tốt về sức khỏe.']], en: ['Health line', 'A diagonal line from near the wrist up to the little-finger mount. It speaks of health, business and how you communicate.', ['Clear and straight: speaks clearly, sharp in business.', 'Wavy or broken: the body signals under stress, so rest enough.', 'Absent: in the traditional reading this is a good sign for health.']] },
  marriage: { d: 'M90 76 L 103 75 M91 82 L 100 81', vi: ['Đường hôn nhân', 'Những vạch ngắn nằm ngang ở cạnh bàn tay, dưới ngón út. Nói về các mối quan hệ sâu sắc.', ['Một đường rõ và dài: một mối quan hệ lớn, bền.', 'Hai hay ba đường: vài mối quan hệ quan trọng trong đời, không nhất thiết là hôn nhân.', 'Đường cong xuống: mối quan hệ cần được chăm sóc.', 'Chẻ đôi ở cuối: có giai đoạn xa cách rồi quay lại hoặc tách hẳn.']], en: ['Marriage lines', 'Short horizontal marks on the edge of the palm under the little finger. They speak of deep relationships.', ['One clear, long line: one major, lasting relationship.', 'Two or three lines: a few important relationships in life, not necessarily marriages.', 'Curving downward: a relationship that needs care.', 'Forked at the end: a period apart, then a return or a parting.']] }
};
const MOUNT_GLYPH = { jupiter: '♃', saturn: '♄', apollo: '☉', mercury: '☿', venus: '♀', luna: '☽', mars: '♂' };
const MOUNTS = {
  jupiter: { x: 52, y: 66, vi: ['Gò Mộc Tinh', 'Dưới ngón trỏ. Tham vọng, tự tin, khả năng dẫn dắt.', ['Đầy đặn: tự tin, thích dẫn đầu, có uy.', 'Phẳng: khiêm tốn, ngại đứng đầu.', 'Quá cao: kiêu, thích chỉ huy.']], en: ['Mount of Jupiter', 'Under the index finger. Ambition, confidence, leadership.', ['Full: confident, likes to lead, has authority.', 'Flat: modest, shy of the front row.', 'Too high: proud, bossy.']] },
  saturn: { x: 68, y: 62, vi: ['Gò Thổ Tinh', 'Dưới ngón giữa. Kỷ luật, trách nhiệm, sự nghiêm túc.', ['Vừa phải: chín chắn, đáng tin.', 'Phẳng: vô tư, sống thoải mái.', 'Quá cao: hay lo, u sầu, khép kín.']], en: ['Mount of Saturn', 'Under the middle finger. Discipline, responsibility, seriousness.', ['Moderate: mature, reliable.', 'Flat: carefree, easy-going.', 'Too high: worries, gloomy, withdrawn.']] },
  apollo: { x: 84, y: 66, vi: ['Gò Thái Dương', 'Dưới ngón áp út. Sáng tạo, thẩm mỹ, sức hút.', ['Đầy đặn: có gu, yêu cái đẹp, được nhiều người mến.', 'Phẳng: thực tế, ít quan tâm hình thức.', 'Quá cao: thích hào nhoáng, sợ bị bỏ quên.']], en: ['Mount of Apollo', 'Under the ring finger. Creativity, taste, charm.', ['Full: good taste, loves beauty, well liked.', 'Flat: practical, little care for appearances.', 'Too high: loves glamour, fears being overlooked.']] },
  mercury: { x: 96, y: 80, vi: ['Gò Thủy Tinh', 'Dưới ngón út. Giao tiếp, nhanh trí, buôn bán.', ['Đầy đặn: nói khéo, học nhanh, hợp kinh doanh.', 'Phẳng: ít nói, thích làm hơn nói.', 'Quá cao: dễ nói quá, khéo đến mức thiếu chân thật.']], en: ['Mount of Mercury', 'Under the little finger. Communication, quick wit, trade.', ['Full: speaks well, learns fast, suited to business.', 'Flat: quiet, prefers doing to talking.', 'Too high: exaggerates, clever to the point of insincerity.']] },
  venus: { x: 42, y: 108, vi: ['Gò Kim Tinh', 'Gốc ngón cái, bên trong đường sinh mệnh. Tình cảm, sức sống, sự ấm áp.', ['Đầy đặn: nồng nhiệt, yêu đời, giàu sức khỏe.', 'Phẳng: điềm đạm, ít bộc lộ, hay mệt.', 'Quá cao: đam mê mạnh, dễ bị cảm xúc cuốn.']], en: ['Mount of Venus', 'The base of the thumb, inside the life line. Affection, vitality, warmth.', ['Full: warm, loves life, strong health.', 'Flat: calm, reserved, tires easily.', 'Too high: strong passions, easily swept by feeling.']] },
  luna: { x: 88, y: 120, vi: ['Gò Mặt Trăng', 'Cạnh ngoài, phía dưới bàn tay. Trí tưởng tượng, trực giác, mộng mơ.', ['Đầy đặn: giàu tưởng tượng, nhạy cảm, thích đi xa.', 'Phẳng: thực tế, ít mơ mộng.', 'Quá cao: hay lo lắng vô cớ, sống trong đầu nhiều hơn ngoài đời.']], en: ['Mount of the Moon', 'The outer, lower part of the palm. Imagination, intuition, daydreams.', ['Full: imaginative, sensitive, loves travel.', 'Flat: practical, little daydreaming.', 'Too high: needless worry, lives more in the head than in the world.']] },
  mars: { x: 36, y: 86, vi: ['Gò Hỏa Tinh', 'Giữa gốc ngón cái và ngón trỏ, cạnh trong bàn tay. Can đảm, sức chịu đựng.', ['Đầy đặn: gan dạ, không ngại va chạm.', 'Phẳng: tránh xung đột, dễ nhường.', 'Quá cao: nóng nảy, dễ gây gổ.']], en: ['Mount of Mars', 'Between the thumb base and the index finger, on the inner edge. Courage, endurance.', ['Full: brave, unafraid of confrontation.', 'Flat: avoids conflict, gives way easily.', 'Too high: hot-tempered, quarrelsome.']] }
};
/* Four hand shapes by element (palm square or long, fingers short or long). */
const HAND_SHAPES = [
  { el: 'earth', palm: 'sq', fingers: 'short', vi: ['Tay Đất', 'Lòng bàn tay vuông, ngón ngắn', 'Thực tế, chắc chắn, thích làm bằng tay. Tin vào những gì thấy được.'], en: ['Earth hand', 'Square palm, short fingers', 'Practical, solid, likes to work with the hands. Trusts what can be seen.'] },
  { el: 'air', palm: 'sq', fingers: 'long', vi: ['Tay Khí', 'Lòng bàn tay vuông, ngón dài', 'Nghĩ nhiều, nói giỏi, tò mò. Cần được trò chuyện và học điều mới.'], en: ['Air hand', 'Square palm, long fingers', 'Thinks a lot, talks well, curious. Needs conversation and new ideas.'] },
  { el: 'fire', palm: 'long', fingers: 'short', vi: ['Tay Lửa', 'Lòng bàn tay dài, ngón ngắn', 'Nhiệt tình, nhanh, thích dẫn đầu. Dễ chán nếu mọi thứ đứng yên.'], en: ['Fire hand', 'Long palm, short fingers', 'Enthusiastic, fast, likes to lead. Gets bored when nothing moves.'] },
  { el: 'water', palm: 'long', fingers: 'long', vi: ['Tay Nước', 'Lòng bàn tay dài, ngón dài', 'Nhạy cảm, giàu trực giác, sống bằng cảm xúc. Cần không gian yên.'], en: ['Water hand', 'Long palm, long fingers', 'Sensitive, intuitive, lives through feeling. Needs quiet space.'] }
];
function handShapeSVG(sh) {
  const pw = sh.palm === 'sq' ? 40 : 34, ph = sh.palm === 'sq' ? 40 : 52, fl = sh.fingers === 'short' ? 22 : 34, x0 = 30 - pw / 2, top = 96 - ph;
  let s = '<svg viewBox="0 0 60 100" class="hshape"><g fill="#F6DCC9" stroke="#3B2A5E" stroke-width="1.6" stroke-linejoin="round">';
  for (let i = 0; i < 4; i++) { const w = pw / 4 - 2, x = x0 + 1 + i * pw / 4; s += '<rect x="' + x.toFixed(1) + '" y="' + (top - fl + (i === 3 ? 6 : i === 0 ? 3 : 0)).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + (fl + 4).toFixed(1) + '" rx="' + (w / 2).toFixed(1) + '"/>'; }
  s += '<rect x="' + x0.toFixed(1) + '" y="' + top + '" width="' + pw + '" height="' + ph + '" rx="8"/>';
  s += '<rect x="' + (x0 - 9).toFixed(1) + '" y="' + (top + 6) + '" width="9" height="' + (ph * 0.5).toFixed(1) + '" rx="4.5" transform="rotate(-18 ' + (x0 - 4.5).toFixed(1) + ' ' + (top + 6) + ')"/>';
  return s + '</g></svg>';
}
function handShapesHTML() {
  return '<div class="hshapes">' + HAND_SHAPES.map((sh) => '<div class="hs" style="border-color:' + EL_COLOR[sh.el] + '">' + handShapeSVG(sh) + '<b style="color:' + EL_COLOR[sh.el] + '">' + esc(sh[lang][0]) + '</b><span>' + esc(sh[lang][1]) + '</span><p>' + esc(sh[lang][2]) + '</p></div>').join('') + '</div>';
}
const TEA = [['🐦', 'Chim', 'Bird', 'tin tức đang tới', 'news on the way'], ['💗', 'Trái tim', 'Heart', 'tình cảm, một người thương', 'love, someone dear'], ['💍', 'Nhẫn', 'Ring', 'cam kết, hôn nhân', 'commitment, marriage'], ['🔑', 'Chìa khoá', 'Key', 'cửa mở, cơ hội', 'a door opens'], ['➖', 'Đường thẳng', 'Straight line', 'chuyến đi, kế hoạch rõ', 'a journey, a clear plan'], ['🌳', 'Cây', 'Tree', 'thành công dần dần', 'gradual success'], ['☁️', 'Mây', 'Cloud', 'rối, chưa rõ', 'confusion, not yet clear'], ['🔤', 'Chữ cái', 'Letter', 'tên một người', 'someone\'s initial'], ['🔢', 'Con số', 'Number', 'ngày hoặc tháng', 'days or months'], ['⭐', 'Ngôi sao', 'Star', 'may mắn, hy vọng', 'luck, hope'], ['🌙', 'Trăng', 'Moon', 'thay đổi, chuyện tình cảm', 'change, matters of the heart'], ['🐍', 'Rắn', 'Snake', 'coi chừng người xấu', 'beware a false friend'], ['🐟', 'Cá', 'Fish', 'tin vui, tiền vào', 'good news, money coming'], ['🏠', 'Ngôi nhà', 'House', 'an toàn, gia đình', 'safety, home'], ['⚓', 'Mỏ neo', 'Anchor', 'ổn định, công việc chắc', 'stability, steady work'], ['🚪', 'Cánh cửa', 'Door', 'chuyện mới sắp mở', 'something new about to open']];
const PC_SUITS = [['h', '♥', 'cups'], ['d', '♦', 'pentacles'], ['c', '♣', 'wands'], ['s', '♠', 'swords']];
const PC_RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const pcToTarot = (suit, rank) => { const s = PC_SUITS.filter((x) => x[0] === suit)[0][2]; if (rank === 'J') return s + '-c1'; if (rank === 'Q') return s + '-c2'; if (rank === 'K') return s + '-c3'; return s + '-' + (rank === 'A' ? 1 : Number(rank)); };

function renderFortune(tool) {
  const S = T(), m = $('#main');
  if (!tool) {
    m.innerHTML = backLink('#/learn', S.learnTitle) + '<h1 style="margin-bottom:6px">' + esc(S.cats.fortune) + '</h1><p class="muted">' + esc(S.fortuneIntro) + '</p>'
      + '<div class="ftiles">' + Object.keys(FT).map((k) => '<a class="ftile" href="#/learn/fortune/' + k + '"><span class="ic">' + FT[k].ic + '</span><b>' + esc(FT[k][lang][0]) + '</b><span>' + esc(FT[k][lang][1]) + '</span></a>').join('') + '</div>'
      ;
    return;
  }
  const back = backLink('#/learn/fortune', S.cats.fortune), title = (k) => '<div class="eyebrow">' + esc(S.cats.fortune) + '</div><h1 style="margin-bottom:8px">' + FT[k].ic + ' ' + esc(FT[k][lang][0]) + '</h1>';
  if (tool === 'numbers') return renderNumbersTool(m, back + title('numbers'));
  if (tool === 'palm') return renderPalm(m, back + title('palm'));
  if (tool === 'cards') { if (gate('playing', '#/learn/playing')) return; return renderPlayingCards(m, back + title('cards')); }
  if (tool === 'tea') return renderTea(m, back + title('tea'));
  if (tool === 'animals') return renderAnimals(m, back + title('animals'));
  redirect('#/learn/fortune');
}

/* ---- numerology ---- */
function ringSVG(current) {
  let s = '<svg viewBox="0 0 200 200" class="ring">';
  for (let i = 1; i <= 9; i++) {
    const a = (i - 1) / 9 * Math.PI * 2 - Math.PI / 2, x = 100 + 78 * Math.cos(a), y = 100 + 78 * Math.sin(a), on = i === current;
    s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (on ? 17 : 13) + '" fill="' + (on ? 'var(--primary)' : 'var(--surface-2)') + '" stroke="var(--rule)"/><text x="' + x.toFixed(1) + '" y="' + (y + 4.5).toFixed(1) + '" text-anchor="middle" font-size="' + (on ? 15 : 12) + '" font-weight="700" fill="' + (on ? 'var(--primary-ink)' : 'var(--fg)') + '">' + i + '</text>';
  }
  return s + '<circle cx="100" cy="100" r="60" fill="none" stroke="var(--rule-soft)" stroke-dasharray="3 4"/></svg>';
}
function renderNumbersTool(m, head) {
  const S = T(), b = birthParts(), nm = numerologyOf(PROFILE.name, PROFILE.birthday);
  const wheel = '<div class="nwheel">' + [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33].map((n) => '<button class="nw' + (nm.lifePath === n ? ' me' : '') + '" data-num="' + n + '"><span class="ic">' + NUM_ICON[n] + '</span><b>' + n + '</b><span>' + esc(NUM_KW[lang][n]) + '</span></button>').join('') + '</div><div class="ins" id="numout"><p class="muted">' + esc(S.numTap) + '</p></div>';
  const numRow = (label, n, text) => n ? '<div class="nrow"><span class="ic">' + NUM_ICON[n] + '</span><div><b>' + esc(label) + ' · ' + n + '</b><p>' + esc(text) + '</p></div></div>' : '';
  const mine = b ? '<div class="ins"><h3>' + esc(S.numYours) + '</h3>' + numRow(S.lifePath, nm.lifePath, LIFEPATH[nm.lifePath][lang]) + numRow(S.numBirthday, nm.birthday, NUM[nm.birthday][lang].expr)
    + '<label class="f" for="nname">' + esc(S.numName) + '</label><input id="nname" value="' + esc(PROFILE.name || '') + '"><p class="hint">' + esc(S.numNameHint) + '</p><div id="nameout">' + (nm.expression ? numRow(S.numExpr, nm.expression, NUM[nm.expression][lang].expr) + numRow(S.numSoul, nm.soul, NUM[nm.soul][lang].soul) + numRow(S.numPers, nm.personality, NUM[nm.personality][lang].pers) : '') + '</div></div>'
    + '<div class="ins"><h3>' + esc(S.numCycle) + '</h3><div class="ringwrap">' + ringSVG(nm.personalYear) + '<div><b>' + esc(S.numYear) + ' ' + nm.personalYear + '</b><p>' + esc(PYEAR[nm.personalYear][lang]) + '</p><p class="hint">' + esc(S.numCycleHint) + '</p></div></div></div>'
    : '<div class="ins"><p class="muted">' + esc(S.enterBirthday) + '</p><a class="btn primary" href="#/me">' + esc(S.setupBtn) + '</a></div>';
  m.innerHTML = head + '<p class="muted">' + esc(S.numIntro) + '</p><div class="visual">' + wheel + '</div>' + mine + aiPanelHTML({ type: 'numbers' }) + '<div class="acc"><button><span>' + esc(S.numHow) + '</span></button><div class="in">' + guideBodyHTML(GUIDES.filter((g) => g.id === 'fort-numerology')[0]) + '</div></div>';
  $$('[data-num]', m).forEach((btn) => btn.addEventListener('click', () => { const n = Number(btn.getAttribute('data-num')); $$('[data-num]', m).forEach((x) => x.classList.toggle('on', x === btn)); $('#numout').innerHTML = '<div class="nrow"><span class="ic">' + NUM_ICON[n] + '</span><div><b>' + n + ' · ' + esc(NUM_KW[lang][n]) + '</b><p>' + esc(LIFEPATH[n][lang]) + '</p><p class="faint">' + esc(NUM[n][lang].expr) + '</p></div></div>'; }));
  const nn = $('#nname'); if (nn) nn.addEventListener('input', (e) => { const x = numerologyOf(e.target.value, PROFILE.birthday); $('#nameout').innerHTML = x.expression ? numRow(S.numExpr, x.expression, NUM[x.expression][lang].expr) + numRow(S.numSoul, x.soul, NUM[x.soul][lang].soul) + numRow(S.numPers, x.personality, NUM[x.personality][lang].pers) : ''; });
  bindAccordions(m); bindAI(m);
}

/* ---- palm ---- */
const PALM_COLS = { heart: '#B04A2E', head: '#2F5E9A', life: '#C4557A', fate: '#5B3F9E', sun: '#C9932A', mercury: '#2E7D6B', marriage: '#8A4E9E' };
function handSVG(active, mode, activeMount) {
  const line = (k) => '<path d="' + PALM[k].d + '" fill="none" stroke="' + PALM_COLS[k] + '" stroke-width="' + (active === k ? 4 : 2.2) + '" stroke-linecap="round" data-line="' + k + '" style="cursor:pointer"' + (active === k || mode === 'mounts' ? '' : ' opacity=".7"') + (mode === 'mounts' ? ' opacity=".35"' : '') + '/>';
  let s = '<svg viewBox="0 0 120 150" class="hand">'
    + '<path d="M30 70 C 26 50, 30 30, 38 30 C 46 30, 46 55, 46 62 C 46 40, 44 18, 54 18 C 64 18, 62 44, 62 60 C 62 40, 62 22, 72 22 C 82 22, 78 46, 78 62 C 80 46, 80 34, 88 34 C 96 34, 92 56, 92 70 C 100 60, 108 64, 104 74 C 96 84, 92 94, 90 106 C 86 130, 76 140, 60 140 C 40 140, 30 126, 28 108 C 26 92, 26 82, 30 70 Z" fill="#F6DCC9" stroke="#3B2A5E" stroke-width="2"/>'
    + ['life', 'head', 'heart', 'fate', 'sun', 'mercury', 'marriage'].map(line).join('');
  if (mode === 'mounts') {
    Object.keys(MOUNTS).forEach((k) => { const mt = MOUNTS[k], on = k === activeMount; s += '<g data-mount="' + k + '" style="cursor:pointer"><circle cx="' + mt.x + '" cy="' + mt.y + '" r="' + (on ? 11 : 9) + '" fill="' + (on ? 'var(--primary)' : 'rgba(255,255,255,.55)') + '" stroke="#3B2A5E" stroke-width="1.2"/><text x="' + mt.x + '" y="' + (mt.y + 3.5) + '" text-anchor="middle" font-size="11" font-weight="700" fill="' + (on ? 'var(--primary-ink)' : '#3B2A5E') + '" pointer-events="none">' + MOUNT_GLYPH[k] + '</text></g>'; });
  }
  return s + '</svg>';
}
function renderPalm(m, head) {
  const S = T();
  const keys = Object.keys(PALM), mkeys = Object.keys(MOUNTS);
  let mode = 'lines', line = 'heart', mount = 'jupiter';
  const draw = () => {
    $('#handwrap').innerHTML = handSVG(line, mode, mount);
    const p = mode === 'lines' ? PALM[line][lang] : MOUNTS[mount][lang];
    $('#palmout').innerHTML = '<h3 style="color:' + (mode === 'lines' ? PALM_COLS[line] : 'var(--link)') + '">' + (mode === 'mounts' ? MOUNT_GLYPH[mount] + ' ' : '') + esc(p[0]) + '</h3><p>' + esc(p[1]) + '</p><ul class="pl">' + p[2].map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>';
    $$('[data-pl]', m).forEach((b) => b.classList.toggle('on', mode === 'lines' && b.getAttribute('data-pl') === line));
    $$('[data-pm]', m).forEach((b) => b.classList.toggle('on', mode === 'mounts' && b.getAttribute('data-pm') === mount));
    $$('[data-pmode]', m).forEach((b) => b.classList.toggle('on', b.getAttribute('data-pmode') === mode));
    $('#plines').hidden = mode !== 'lines'; $('#pmounts').hidden = mode !== 'mounts';
    $$('[data-line]', m).forEach((l) => l.addEventListener('click', () => { mode = 'lines'; line = l.getAttribute('data-line'); draw(); }));
    $$('[data-mount]', m).forEach((l) => l.addEventListener('click', () => { mount = l.getAttribute('data-mount'); draw(); }));
  };
  m.innerHTML = head + '<p class="muted">' + esc(S.palmIntro) + '</p>'
    + '<div class="chips" style="justify-content:center;margin-bottom:8px"><button class="chip on" data-pmode="lines">' + esc(S.palmLines) + '</button><button class="chip" data-pmode="mounts">' + esc(S.palmMounts) + '</button></div>'
    + '<div class="palmwrap"><div id="handwrap"></div>'
    + '<div class="chips" style="justify-content:center;margin:8px 0" id="plines">' + keys.map((k) => '<button class="chip" data-pl="' + k + '" style="border-color:' + PALM_COLS[k] + '">' + esc(PALM[k][lang][0]) + '</button>').join('') + '</div>'
    + '<div class="chips" style="justify-content:center;margin:8px 0" id="pmounts" hidden>' + mkeys.map((k) => '<button class="chip" data-pm="' + k + '">' + MOUNT_GLYPH[k] + ' ' + esc(MOUNTS[k][lang][0]) + '</button>').join('') + '</div>'
    + '<div class="ins" id="palmout"></div></div>'
    + '<h3 style="margin:18px 0 8px">' + esc(S.palmShapes) + '</h3><p class="muted">' + esc(S.palmShapesHint) + '</p>' + handShapesHTML()
    + '<div class="acc"><button><span>' + esc(S.readMoreTitle) + '</span></button><div class="in">' + guideBodyHTML(GUIDES.filter((g) => g.id === 'fort-palm')[0]) + '</div></div>';
  $$('[data-pl]', m).forEach((b) => b.addEventListener('click', () => { line = b.getAttribute('data-pl'); draw(); }));
  $$('[data-pm]', m).forEach((b) => b.addEventListener('click', () => { mount = b.getAttribute('data-pm'); draw(); }));
  $$('[data-pmode]', m).forEach((b) => b.addEventListener('click', () => { mode = b.getAttribute('data-pmode'); draw(); }));
  draw(); bindAccordions(m);
}

/* Traditional cartomancy meanings for the 52 cards, the way fortune tellers
   read them before tarot decks were common. [vi, en] per card. */
const PC_TRAD = {
  hA: ['Mái nhà, tình yêu mới, niềm vui trong gia đình', 'Home, a new love, happiness in the family'],
  h2: ['Đôi lứa, tình cảm đáp lại, hứa hẹn gắn bó', 'A couple, love returned, a promise to commit'],
  h3: ['Cẩn thận trong tình cảm, người thứ ba, lựa chọn của trái tim', 'Care in love, a third person, a choice of the heart'],
  h4: ['Thay đổi trong nhà, một chuyến đi, hôn nhân bị hoãn', 'A change at home, a journey, a marriage delayed'],
  h5: ['Ghen tuông, do dự, một quyết định về tình cảm', 'Jealousy, hesitation, a decision about love'],
  h6: ['Kỷ niệm, người cũ quay lại, lòng rộng lượng', 'Memories, someone from the past returns, generosity'],
  h7: ['Thất vọng, lời hứa không giữ, người hay đổi ý', 'Disappointment, a broken promise, a fickle person'],
  h8: ['Lời mời, cuộc thăm hỏi, quà tặng, tiệc tùng', 'An invitation, a visit, a gift, a celebration'],
  h9: ['Lá ước nguyện: điều mong muốn thành hiện thực', 'The wish card: what you hope for comes true'],
  h10: ['May mắn lớn, gia đình hạnh phúc, thành công', 'Great luck, a happy family, success'],
  hJ: ['Một người bạn thân, một người trẻ tốt bụng và chân thành', 'A close friend, a kind and sincere young person'],
  hQ: ['Một người phụ nữ dịu dàng, yêu thương; người mẹ', 'A gentle, loving woman; the mother'],
  hK: ['Một người đàn ông ấm áp, rộng lượng; lời khuyên tốt', 'A warm, generous man; good advice'],
  dA: ['Thư từ, tin nhắn, chiếc nhẫn, tin về tiền bạc', 'A letter, a message, a ring, news about money'],
  d2: ['Chuyện tình bị phản đối, bất đồng về tiền, cần chọn một trong hai', 'A romance others disapprove of, a money disagreement, choosing between two'],
  d3: ['Giấy tờ, pháp lý, tranh cãi, cãi vã trong nhà', 'Paperwork, legal matters, quarrels, arguments at home'],
  d4: ['Thừa kế, tiền bạc ổn định, sự an toàn', 'An inheritance, steady money, security'],
  d5: ['Tin vui, thay đổi tốt lên, công việc thuận lợi', 'Good news, a change for the better, business goes well'],
  d6: ['Hôn nhân sớm, cơ hội thứ hai, cẩn thận với chi tiêu', 'An early marriage, a second chance, care with spending'],
  d7: ['Lời đàm tiếu, chỉ trích, lo lắng tiền bạc, mất mát nhỏ', 'Gossip, criticism, money worries, a small loss'],
  d8: ['Hôn nhân muộn, chuyến đi ngắn, tiền đến rồi đi', 'A late marriage, a short trip, money that comes and goes'],
  d9: ['Bất ngờ, phiêu lưu, khoản tiền ngoài dự tính, bồn chồn', 'A surprise, adventure, unexpected money, restlessness'],
  d10: ['Tiền bạc, chuyến đi xa, đám cưới, vận may', 'Money, a long journey, a wedding, good fortune'],
  dJ: ['Người đưa tin, một người trẻ mang tin; người giúp nhưng không đáng tin lắm', 'A messenger, a young person bringing news; a helper who is not fully reliable'],
  dQ: ['Người phụ nữ sành sỏi, hay nói; sự chen ngang', 'A worldly woman, a talker; interference'],
  dK: ['Người đàn ông làm ăn, có quyền, cứng đầu', 'A businessman, a man of authority, stubborn'],
  cA: ['Của cải, thành công, một khởi đầu tốt', 'Wealth, success, a good beginning'],
  c2: ['Đối đầu, lời đồn, thất vọng, tranh cãi', 'Opposition, rumours, disappointment, arguments'],
  c3: ['Hôn nhân, hợp tác lâu dài, cơ hội thứ hai', 'Marriage, a long partnership, a second chance'],
  c4: ['Thay đổi, vận rủi bất ngờ; lời nhắc tránh xung đột', 'A change, a sudden misfortune; a reminder to avoid conflict'],
  c5: ['Bạn mới, một liên minh có ích, hôn nhân', 'New friends, a helpful alliance, marriage'],
  c6: ['Việc làm ăn thuận lợi, được hỗ trợ tài chính', 'Business success, financial support'],
  c7: ['Thịnh vượng, một người bạn tốt; đề phòng người ganh đua', 'Prosperity, a good friend; watch out for a rival'],
  c8: ['Làm việc quá sức, ham may rủi; một lời đề nghị', 'Overwork, a taste for gambling; a proposal'],
  c9: ['Tình cảm mới; bất đồng với bạn bè', 'A new romance; disagreement with friends'],
  c10: ['Đi xa, thành công trong công việc, may mắn sau nỗ lực', 'Travel, success at work, luck after effort'],
  cJ: ['Người bạn đáng tin, chàng trai chân thành', 'A reliable friend, a sincere young man'],
  cQ: ['Người phụ nữ tự tin, ấm áp, hay giúp đỡ', 'A confident, warm, helpful woman'],
  cK: ['Người đàn ông rộng rãi, trung thành; người cố vấn tốt', 'A generous, loyal man; a good adviser'],
  sA: ['Kết thúc, quyết định khó, chuyện không may', 'An ending, a hard decision, misfortune'],
  s2: ['Chia ly, tạm dừng, lựa chọn khó, lời nói dối', 'Separation, a pause, a hard choice, a lie'],
  s3: ['Đau lòng, phản bội, nước mắt', 'Heartbreak, betrayal, tears'],
  s4: ['Ốm đau, thụt lùi; cần nghỉ ngơi để hồi phục', 'Illness, a setback; rest to recover'],
  s5: ['Trở ngại, lo âu; vượt qua rồi sẽ thành', 'Obstacles, anxiety; success after they pass'],
  s6: ['Tiến bộ nhỏ, một chuyến đi để bỏ lại rắc rối', 'Small progress, a journey to leave trouble behind'],
  s7: ['Mất mát, lời cảnh báo; đừng tin người quá dễ', 'A loss, a warning; do not trust too easily'],
  s8: ['Rắc rối, thất vọng, nguy cơ bệnh tật hay kiện tụng', 'Trouble, disappointment, a risk of illness or a lawsuit'],
  s9: ['Tin xấu, lo lắng, muộn phiền: lá nặng nhất bộ', 'Bad news, worry, sorrow: the heaviest card in the pack'],
  s10: ['Lo âu, bị ràng buộc, một giai đoạn khó đang khép lại', 'Anxiety, feeling trapped, a hard period coming to a close'],
  sJ: ['Người trẻ không đáng tin, đối thủ', 'An untrustworthy young person, a rival'],
  sQ: ['Người phụ nữ lạnh lùng hoặc góa bụa; lời phê bình gắt', 'A cold or widowed woman; harsh criticism'],
  sK: ['Luật sư, quan tòa, người có quyền và tham vọng', 'A lawyer, a judge, an ambitious man of authority']
};
/* ---- playing cards ---- */
function renderPlayingCards(m, head) {
  const S = T(), X = LEX[lang];
  let suit = 'h', rank = 'A';
  const legend = '<div class="pcmap">' + PC_SUITS.map((s) => '<div class="pcs"><span class="pip ' + (s[0] === 'h' || s[0] === 'd' ? 'red' : '') + '">' + s[1] + '</span><span>=</span><svg viewBox="-20 -22 40 44"><g stroke="var(--card-ink)" stroke-linejoin="round" stroke-linecap="round" fill="none">' + emblem(s[2], 0, 0, 1) + '</g></svg><b>' + esc(X.suitNames[s[2]]) + '</b></div>').join('') + '</div>';
  const show = () => {
    const id = pcToTarot(suit, rank), c = cardById(id), I = insightOf(id);
    const trad = PC_TRAD[suit + rank] || ['', ''];
    $('#pcout').innerHTML = '<div class="pcrow"><div class="pcard"><span class="' + (suit === 'h' || suit === 'd' ? 'red' : '') + '">' + rank + PC_SUITS.filter((x) => x[0] === suit)[0][1] + '</span></div><div><div class="eyebrow">' + esc(S.pcTrad) + '</div><p class="pctrad">' + esc(lang === 'vi' ? trad[0] : trad[1]) + '</p></div></div>'
      + '<div class="pcrow"><button class="face" data-open-card="' + id + '">' + faceSVG(c) + '</button><div><div class="eyebrow">' + esc(S.pcTarotWay) + '</div><b>' + esc(c.name) + '</b><p>' + esc(I.pos.slice(0, 3).join(' · ')) + '</p><p class="muted">' + esc(c.up) + '</p></div></div>';
    bindCardLinks($('#pcout'));
    $$('[data-suit]', m).forEach((b) => b.classList.toggle('on', b.getAttribute('data-suit') === suit));
    $$('[data-rank]', m).forEach((b) => b.classList.toggle('on', b.getAttribute('data-rank') === rank));
  };
  m.innerHTML = head + '<p class="muted">' + esc(S.pcIntro) + '</p><div class="visual">' + legend + '</div>'
    + '<div class="ins"><h3>' + esc(S.pcPick) + '</h3><div class="chips" style="margin-bottom:8px">' + PC_SUITS.map((s) => '<button class="chip pcchip ' + (s[0] === 'h' || s[0] === 'd' ? 'red' : '') + '" data-suit="' + s[0] + '">' + s[1] + '</button>').join('') + '</div><div class="chips">' + PC_RANKS.map((r) => '<button class="chip" data-rank="' + r + '">' + r + '</button>').join('') + '</div><div id="pcout" style="margin-top:12px"></div><p class="hint">' + esc(S.pcNote) + '</p></div>'
    + '<div class="acc"><button><span>' + esc(S.readMoreTitle) + '</span></button><div class="in">' + guideBodyHTML(GUIDES.filter((g) => g.id === 'fort-playing')[0]) + '</div></div>';
  $$('[data-suit]', m).forEach((b) => b.addEventListener('click', () => { suit = b.getAttribute('data-suit'); show(); }));
  $$('[data-rank]', m).forEach((b) => b.addEventListener('click', () => { rank = b.getAttribute('data-rank'); show(); }));
  show(); bindAccordions(m);
}

/* ---- tea leaves ---- */
function cupSVG(active) {
  const zone = (k, d, label, tx, ty) => '<path d="' + d + '" fill="' + (active === k ? 'var(--lav-soft)' : 'var(--surface-2)') + '" stroke="var(--rule)" data-zone="' + k + '" style="cursor:pointer"/><text x="' + tx + '" y="' + ty + '" text-anchor="middle" font-size="7.5" font-weight="700" fill="var(--fg)" pointer-events="none">' + label + '</text>';
  const S = T();
  return '<svg viewBox="0 0 160 120" class="cup">'
    + '<ellipse cx="70" cy="100" rx="52" ry="10" fill="var(--surface-3)"/>'
    + zone('rim', 'M18 30 L122 30 L118 52 L22 52 Z', S.teaZones.rim, 70, 44)
    + zone('mid', 'M22 52 L118 52 L112 76 L28 76 Z', S.teaZones.mid, 70, 67)
    + zone('bottom', 'M28 76 L112 76 L104 96 L36 96 Z', S.teaZones.bottom, 70, 89)
    + '<path d="M18 30 C 14 60, 30 100, 70 100 C 110 100, 126 60, 122 30" fill="none" stroke="#3B2A5E" stroke-width="2.5"/>'
    + '<path d="M122 42 C 148 40, 148 78, 118 80" fill="none" stroke="#3B2A5E" stroke-width="2.5" data-zone="handle" style="cursor:pointer"/>'
    + '<text x="140" y="62" text-anchor="middle" font-size="7" font-weight="700" fill="var(--fg)">' + S.teaZones.handle + '</text></svg>';
}
function renderTea(m, head) {
  const S = T();
  const draw = (k) => { $('#cupwrap').innerHTML = cupSVG(k); $('#teaout').textContent = S.teaZoneText[k]; $$('[data-zone]', m).forEach((z) => z.addEventListener('click', () => draw(z.getAttribute('data-zone')))); };
  m.innerHTML = head + '<p class="muted">' + esc(S.teaIntro) + '</p><div class="teawrap"><div id="cupwrap"></div><p class="ins" id="teaout"></p></div>'
    + '<h3 style="margin:16px 0 8px">' + esc(S.teaSymbols) + '</h3><div class="teagrid">' + TEA.map((t) => '<div class="tsym"><span class="ic">' + t[0] + '</span><b>' + esc(lang === 'vi' ? t[1] : t[2]) + '</b><span>' + esc(lang === 'vi' ? t[3] : t[4]) + '</span></div>').join('') + '</div>'
    + '<div class="ins" style="text-align:center"><h3>' + esc(S.teaPractice) + '</h3><p class="hint">' + esc(S.teaPracticeHint) + '</p><button class="btn primary" id="teadraw">' + esc(S.teaDraw) + '</button><div id="teadrawn" style="margin-top:10px"></div></div>'
    + '<div class="acc"><button><span>' + esc(S.readMoreTitle) + '</span></button><div class="in">' + guideBodyHTML(GUIDES.filter((g) => g.id === 'fort-tea')[0]) + '</div></div>';
  draw('rim'); bindAccordions(m);
  $('#teadraw').addEventListener('click', () => { const zones = ['rim', 'mid', 'bottom', 'handle']; const t = TEA[Math.floor(Math.random() * TEA.length)], z = zones[Math.floor(Math.random() * zones.length)]; $('#teadrawn').innerHTML = '<div class="tsym big"><span class="ic">' + t[0] + '</span><b>' + esc(lang === 'vi' ? t[1] : t[2]) + '</b><span>' + esc((lang === 'vi' ? t[3] : t[4]) + ' · ' + S.teaZones[z]) + '</span><p class="faint">' + esc(S.teaZoneText[z]) + '</p></div>'; });
}

/* ---- 12 animals ---- */
function animalsWheelSVG(active) {
  let s = '<div class="awheel">';
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * Math.PI * 2 - Math.PI / 2, x = 50 + 39 * Math.cos(a), y = 50 + 39 * Math.sin(a), on = i === active;
    s += '<button class="aw' + (on ? ' on' : '') + '" data-animal="' + i + '" style="left:' + x.toFixed(1) + '%;top:' + y.toFixed(1) + '%" aria-label="' + CHI[i] + '"><span class="e">' + ANIMAL_EMOJI[i] + '</span><b>' + CHI[i] + '</b></button>';
  }
  return s + '</div>';
}
function renderAnimals(m, head) {
  const S = T(), b = birthParts(), mine = b ? ((b.y - 4) % 12 + 12) % 12 : -1;
  const draw = (i) => {
    $('#awrap').innerHTML = animalsWheelSVG(i);
    const info = ANIMAL_INFO[lang][i], trio = TRIOS.filter((t) => t.indexOf(i) > -1)[0].filter((x) => x !== i), clash = CLASHES.filter((c) => c.indexOf(i) > -1)[0].filter((x) => x !== i);
    const years = []; for (let y = 2032; y >= 1960; y -= 1) if (((y - 4) % 12 + 12) % 12 === i) years.push(y);
    $('#aout').innerHTML = '<div class="nrow"><span class="ic" style="font-size:34px">' + ANIMAL_EMOJI[i] + '</span><div><b>' + esc(ANIMALS[i][lang]) + (i === mine ? ' · ' + esc(S.animalYours) : '') + '</b><div class="kwl">' + info.slice(0, 3).map((k) => '<span>' + esc(k) + '</span>').join('') + '</div><p>' + esc(info[3]) + '</p>'
      + '<p><b>' + esc(S.animalTrio) + ':</b> ' + trio.map((t) => ANIMAL_EMOJI[t] + ' ' + esc(ANIMALS[t][lang])).join(' · ') + '</p><p><b>' + esc(S.animalClash) + ':</b> ' + clash.map((t) => ANIMAL_EMOJI[t] + ' ' + esc(ANIMALS[t][lang])).join(' · ') + '</p><p class="faint">' + esc(S.animalYears) + ': ' + years.slice(0, 6).join(', ') + '</p></div></div>';
    $$('[data-animal]', m).forEach((g) => g.addEventListener('click', () => draw(Number(g.getAttribute('data-animal')))));
  };
  m.innerHTML = head + '<p class="muted">' + esc(S.animalIntro) + '</p><div class="awrapper"><div id="awrap"></div></div><div class="ins" id="aout"></div><p class="hint">' + esc(S.animalNote) + '</p>'
    + '<div class="acc"><button><span>' + esc(S.readMoreTitle) + '</span></button><div class="in">' + guideBodyHTML(GUIDES.filter((g) => g.id === 'fort-animals')[0]) + '</div></div>';
  draw(mine > -1 ? mine : 4); bindAccordions(m);
}
