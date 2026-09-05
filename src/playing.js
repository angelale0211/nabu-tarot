/* ============================ playing-card course (Bài Tây) ============================
   A 52-card course in the same shape as the tarot and Lenormand ones: sessions
   with drawn card faces, one page per card, the traditional meanings from
   fortune.js plus suit, number and court logic, pairs, timing and spreads.
   Text is original; the meanings follow the common cartomancy tradition. */
const PC_SUIT_TEXT = {
  h: { vi: ['Cơ', 'Tình cảm, gia đình, niềm vui và những gì bạn yêu. Tương ứng với Cốc trong tarot. Người: da sáng, tóc sáng, tính ấm áp. Mùa: xuân.', '♥ = Cốc · nước · cảm xúc'],
       en: ['Hearts', 'Love, family, joy and what you care for. The tarot twin is Cups. People: fair, warm-natured. Season: spring.', '♥ = Cups · water · feeling'] },
  d: { vi: ['Rô', 'Tiền bạc, công việc, tin tức và chuyện thực tế. Tương ứng với Tiền. Người: tóc rất sáng hoặc hung, nhanh nhẹn. Mùa: thu.', '♦ = Tiền · đất · vật chất'],
       en: ['Diamonds', 'Money, work, news and practical matters. The tarot twin is Pentacles. People: very fair or red-haired, quick. Season: autumn.', '♦ = Pentacles · earth · the material'] },
  c: { vi: ['Chuồn', 'Hành động, việc làm ăn, bạn bè và may mắn. Tương ứng với Gậy. Người: tóc nâu, cởi mở, năng động. Mùa: hè.', '♣ = Gậy · lửa · hành động'],
       en: ['Clubs', 'Action, business, friends and luck. The tarot twin is Wands. People: brown-haired, open, energetic. Season: summer.', '♣ = Wands · fire · action'] },
  s: { vi: ['Bích', 'Thử thách, lo âu, tin không vui và những quyết định khó. Tương ứng với Kiếm. Người: tóc sẫm, kín đáo, nghiêm. Mùa: đông.', '♠ = Kiếm · khí · suy nghĩ'],
       en: ['Spades', 'Challenges, worry, unwelcome news and hard decisions. The tarot twin is Swords. People: dark-haired, reserved, serious. Season: winter.', '♠ = Swords · air · thought'] }
};
const PC_RANK_TEXT = {
  A: { vi: ['Khởi đầu', 'Át là hạt giống của chất: điều tinh khiết nhất của chất ấy vừa xuất hiện.'], en: ['Beginning', 'The Ace is the seed of the suit: its purest form, just appearing.'] },
  2: { vi: ['Cặp đôi, lựa chọn', 'Hai là hai người hoặc hai con đường. Cân bằng, hoặc phải chọn.'], en: ['A pair, a choice', 'Two is two people or two roads. Balance, or a choice to make.'] },
  3: { vi: ['Mọc lên, nhóm nhỏ', 'Ba là điều gì đó bắt đầu lớn, hoặc thêm một người thứ ba.'], en: ['Growth, a small group', 'Three is something starting to grow, or a third person joining.'] },
  4: { vi: ['Ổn định', 'Bốn là nền móng: chắc, yên, đôi khi hơi cứng.'], en: ['Stability', 'Four is a foundation: solid, quiet, sometimes a little stiff.'] },
  5: { vi: ['Thay đổi, va chạm', 'Năm phá thế yên của Bốn: xáo trộn, tranh cãi, hoặc một quyết định.'], en: ['Change, friction', 'Five breaks the calm of Four: disruption, argument, or a decision.'] },
  6: { vi: ['Hài hoà, điều chỉnh', 'Sáu sửa lại sau Năm: hoà giải, kỷ niệm, một sự giúp đỡ.'], en: ['Harmony, adjustment', 'Six repairs after Five: reconciliation, memories, help offered.'] },
  7: { vi: ['Thử thách, cân nhắc', 'Bảy là bài kiểm tra: đánh giá, thất vọng nhỏ, hoặc một cám dỗ.'], en: ['A test, a weighing up', 'Seven is the examination: assessment, a small disappointment, or a temptation.'] },
  8: { vi: ['Chuyển động', 'Tám là đi và đổi: chuyến đi, tiến bộ, tin tức đang tới.'], en: ['Movement', 'Eight is going and changing: a journey, progress, news on the way.'] },
  9: { vi: ['Gần trọn vẹn', 'Chín là điều ước và kết quả: ở Cơ là lá ước nguyện, ở Bích là thất vọng.'], en: ['Nearly complete', 'Nine is the wish and the result: in Hearts the wish card, in Spades the disappointment.'] },
  10: { vi: ['Trọn vẹn, đầy', 'Mười là chất ấy đến mức tối đa: hạnh phúc trọn (Cơ), tiền lớn (Rô), thành công (Chuồn), kết thúc (Bích).'], en: ['Complete, full', 'Ten is the suit at its fullest: full happiness (Hearts), big money (Diamonds), success (Clubs), an ending (Spades).'] },
  J: { vi: ['Người trẻ, tin nhắn', 'J là một người trẻ hoặc một thông điệp mang tính cách của chất.'], en: ['A young person, a message', 'The Jack is a young person, or a message carrying the suit’s character.'] },
  Q: { vi: ['Người phụ nữ', 'Q là một người phụ nữ trưởng thành, hoặc phần chăm sóc và cảm nhận trong bạn.'], en: ['A woman', 'The Queen is a grown woman, or the caring, sensing side of you.'] },
  K: { vi: ['Người đàn ông, quyền uy', 'K là một người đàn ông trưởng thành, người có quyền, hoặc phần quyết đoán trong bạn.'], en: ['A man, authority', 'The King is a grown man, someone in charge, or the decisive side of you.'] }
};
const PC_COURT_TEXT = {
  hJ: { vi: 'Bạn thân, người yêu trẻ, một người hiền và tình cảm. Tin vui về tình cảm.', en: 'A close friend, a young lover, a gentle and affectionate person. Good news in love.' },
  hQ: { vi: 'Người phụ nữ ấm áp, đáng tin, hay là mẹ. Người đứng về phía bạn.', en: 'A warm, trustworthy woman, often a mother figure. Someone on your side.' },
  hK: { vi: 'Người đàn ông tốt bụng, rộng lượng, đôi khi hơi mềm lòng. Lời khuyên hiền.', en: 'A kind, generous man, sometimes soft-hearted. Gentle advice.' },
  dJ: { vi: 'Người trẻ mang tin về tiền hay công việc, đôi khi không đáng tin lắm.', en: 'A young person bringing news about money or work, sometimes not quite reliable.' },
  dQ: { vi: 'Người phụ nữ thực tế, giỏi tính toán, hay là người ưa tán chuyện.', en: 'A practical, calculating woman, sometimes the one who gossips.' },
  dK: { vi: 'Người đàn ông có tiền hoặc chức, quyết đoán về việc làm ăn.', en: 'A man with money or position, decisive in business.' },
  cJ: { vi: 'Người bạn trung thành, người trẻ đầy nhiệt huyết, một lời mời.', en: 'A loyal friend, an energetic young person, an invitation.' },
  cQ: { vi: 'Người phụ nữ tự tin, hay giúp người, có tiếng nói trong nhóm.', en: 'A confident, helpful woman with a voice in the group.' },
  cK: { vi: 'Người đàn ông thẳng thắn, đáng tin, giỏi gây dựng. Người cố vấn.', en: 'A straight, dependable man who builds things. A mentor.' },
  sJ: { vi: 'Người trẻ khó lường, tin kém vui, hoặc một người đang do thám.', en: 'An unpredictable young person, unwelcome news, or someone watching you.' },
  sQ: { vi: 'Người phụ nữ sắc sảo, từng trải, có thể goá hoặc cô đơn, đôi khi khắt khe.', en: 'A sharp, experienced woman, perhaps widowed or alone, sometimes harsh.' },
  sK: { vi: 'Người đàn ông có quyền và lạnh: luật sư, sếp, người phán xét.', en: 'A cold man with power: a lawyer, a boss, a judge.' }
};
const PC_COMBOS = [
  ['hA', 'h9', { vi: 'Điều ước thành sự thật, niềm vui trong nhà.', en: 'A wish coming true, happiness at home.' }],
  ['hQ', 'hK', { vi: 'Một cặp đôi, hôn nhân, gia đình yên.', en: 'A couple, a marriage, a settled home.' }],
  ['h2', 'hA', { vi: 'Đính ước, lời hứa gắn bó.', en: 'An engagement, a promise to commit.' }],
  ['dA', 'd9', { vi: 'Tin tốt về tiền, một khoản đến.', en: 'Good news about money, a sum arriving.' }],
  ['dA', 'd10', { vi: 'Hợp đồng lớn, chuyến đi vì công việc.', en: 'A big contract, a journey for work.' }],
  ['cA', 'c10', { vi: 'Việc làm ăn thành, thành công qua bạn bè.', en: 'Business succeeding, success through friends.' }],
  ['c9', 'h9', { vi: 'May mắn cộng với niềm vui: một kỳ vọng được đáp.', en: 'Luck plus joy: an expectation met.' }],
  ['sA', 's10', { vi: 'Một kết thúc lớn; đóng lại để mở ra.', en: 'A big ending; closing to open again.' }],
  ['s9', 'h9', { vi: 'Ước mà chưa được: chờ thêm, hoặc điều ước cần đổi.', en: 'A wish not yet granted: wait, or change the wish.' }],
  ['s8', 's9', { vi: 'Lo âu chồng lo âu; nghỉ, đừng quyết gì lúc này.', en: 'Worry on worry; rest, decide nothing now.' }],
  ['d7', 'c7', { vi: 'Tiền và việc đang được cân: một quyết định thực tế.', en: 'Money and work being weighed: a practical decision.' }],
  ['hJ', 'cJ', { vi: 'Hai người bạn trẻ, một lời mời vui.', en: 'Two young friends, a cheerful invitation.' }]
];
const PC_SPECIAL = { h9: { vi: 'Lá ước nguyện', en: 'The wish card' }, s9: { vi: 'Lá thất vọng', en: 'The disappointment card' }, sA: { vi: 'Lá kết thúc', en: 'The ending card' }, d10: { vi: 'Lá tiền lớn', en: 'The big-money card' }, c10: { vi: 'Lá thành công', en: 'The success card' }, h10: { vi: 'Lá hạnh phúc', en: 'The happiness card' } };
const PC_TIMING = { vi: ['Chốt đơn vị trước khi xào: ngày, tuần hay tháng.', 'Số trên lá là số đơn vị ấy: Ba Cơ trong khung tuần là khoảng ba tuần.', 'Cơ và Rô thường đến nhanh hơn Chuồn và Bích.', 'Mùa theo chất: Cơ xuân, Chuồn hè, Rô thu, Bích đông.', 'Không có quy ước nào được mọi sách đồng ý; giữ một cách và dùng đều.'],
                    en: ['Fix the unit before you shuffle: days, weeks or months.', 'The number on the card is that many units: a Three of Hearts in a weekly frame is about three weeks.', 'Hearts and Diamonds tend to arrive faster than Clubs and Spades.', 'Seasons by suit: Hearts spring, Clubs summer, Diamonds autumn, Spades winter.', 'No convention is shared by every book; keep one and use it consistently.'] };
const PC_SPREADS = [
  { n: 3, lay: 'three', vi: ['Ba lá', 'Quá khứ, hiện tại, tương lai. Trải bài hằng ngày.'], en: ['Three cards', 'Past, present, future. The daily spread.'] },
  { n: 5, lay: 'five', vi: ['Năm lá', 'Quá khứ, hiện tại, điều cản, lời khuyên, kết quả. Đọc trái sang phải như một câu.'], en: ['Five cards', 'Past, present, what blocks, advice, outcome. Read left to right as a sentence.'] },
  { n: 9, lay: 'box9', vi: ['Chín lá', 'Ba hàng: trên là hoàn cảnh, giữa là bạn lúc này, dưới là kết quả. Lá giữa là trọng tâm.'], en: ['Nine cards', 'Three rows: the situation above, you now in the middle, the outcome below. The centre card is the heart.'] },
  { n: 15, lay: 'wish', vi: ['Trải bài điều ước', 'Nghĩ tới một điều ước, xào, đếm ra 15 lá. Có Chín Cơ: điều ước đến. Có Chín Bích: chưa phải lúc. Không có cả hai: tuỳ ở bạn.'], en: ['The wish spread', 'Think of a wish, shuffle, deal 15 cards. The Nine of Hearts present: the wish comes. The Nine of Spades: not now. Neither: it is up to you.'] }
];
const PC_LESSONS_VI = [
  { n: 1, title: { vi: 'Tổng quan: 52 lá và bốn chất', en: 'The deck at a glance: 52 cards, four suits' }, guide: 'fort-playing', visual: 'pcsuits' },
  { n: 2, title: { vi: 'Số từ Át tới Mười: một câu chuyện', en: 'Ace to Ten: one story' }, visual: 'pcranks', intro: { vi: 'Mười số kể cùng một câu chuyện trong cả bốn chất: hạt giống, cặp đôi, mọc lên, ổn định, va chạm, sửa lại, thử thách, chuyển động, gần trọn, trọn vẹn. Thuộc câu chuyện này là bạn đoán được 40 lá mà chưa cần tra.', en: 'The ten numbers tell the same story in all four suits: seed, pair, growth, stability, friction, repair, test, movement, nearly complete, complete. Know this story and you can guess 40 cards before looking anything up.' } },
  { n: 3, title: { vi: 'Cơ: tình cảm và gia đình', en: 'Hearts: love and family' }, visual: 'pcstrip', suit: 'h', intro: { vi: 'Mười ba lá Cơ, từ mái nhà mới của Át tới hạnh phúc trọn của Mười. Chín Cơ là lá ước nguyện, lá được mong nhất trong bộ.', en: 'The thirteen Hearts, from the new home of the Ace to the full happiness of the Ten. The Nine of Hearts is the wish card, the most hoped-for card in the deck.' } },
  { n: 4, title: { vi: 'Rô: tiền bạc và tin tức', en: 'Diamonds: money and news' }, visual: 'pcstrip', suit: 'd', intro: { vi: 'Rô nói về thứ đếm được: tiền, giấy tờ, chuyến đi, tin tức. Đọc Rô theo nghĩa đen trước rồi mới nghĩ xa.', en: 'Diamonds speak about what can be counted: money, papers, journeys, news. Read Diamonds literally first, then more widely.' } },
  { n: 5, title: { vi: 'Chuồn: việc làm và may mắn', en: 'Clubs: work and luck' }, visual: 'pcstrip', suit: 'c', intro: { vi: 'Chuồn là chất của hành động, bạn bè và cơ hội. Nhiều Chuồn trong một trải bài là chuyện đang chuyển động.', en: 'Clubs are the suit of action, friends and opportunity. Many Clubs in a spread means things are moving.' } },
  { n: 6, title: { vi: 'Bích: thử thách và quyết định', en: 'Spades: challenges and decisions' }, visual: 'pcstrip', suit: 's', intro: { vi: 'Bích là chất khó nhất, nhưng cũng thật nhất: nó gọi tên điều đang cản. Đọc Bích như lời cảnh báo có ích, không phải lời nguyền.', en: 'Spades are the hardest suit and the most honest: they name what is in the way. Read Spades as a useful warning, never a curse.' } },
  { n: 7, title: { vi: 'Lá hình: 12 người', en: 'The court: 12 people' }, visual: 'pccourt', intro: { vi: 'J, Q, K của mỗi chất là ba người: trẻ, phụ nữ, đàn ông, mang tính cách của chất ấy. Lá hình cũng có thể là một phần trong bạn hoặc một cách hành xử.', en: 'The Jack, Queen and King of each suit are three people: young, a woman, a man, with the suit’s character. A court card can also be a side of you or a way of acting.' } },
  { n: 8, title: { vi: 'Cặp lá và thời gian', en: 'Pairs and timing' }, visual: 'pccombo', intro: { vi: 'Bài Tây đọc theo cặp và theo số đông: hai lá cạnh nhau đổi nghĩa cho nhau, và chất nào chiếm nhiều thì chuyện nằm ở đó. Thời gian tính bằng số trên lá trong khung bạn đã chốt.', en: 'Playing cards are read in pairs and by majority: two neighbours change each other’s meaning, and the suit that dominates says where the matter lives. Timing is the number on the card inside the frame you fixed.' } },
  { n: 9, title: { vi: 'Trải bài và luyện tập', en: 'Spreads and practice' }, visual: 'pcspreads', intro: { vi: 'Bắt đầu với ba lá mỗi sáng. Năm lá khi có câu hỏi rõ. Chín lá cho một chuyện lớn. Trải bài điều ước để vui, và để nhớ rằng bộ bài nói về xu hướng, không phải số phận.', en: 'Start with three cards each morning. Five when the question is clear. Nine for a big matter. The wish spread for fun, and to remember that the deck speaks about tendencies, not fate.' } }
];

/* ---- a drawn card face ---- */
const PC_PIP = { h: '♥', d: '♦', c: '♣', s: '♠' };
const PC_LAYOUT = { A: [[30, 44]], 2: [[30, 22], [30, 66]], 3: [[30, 20], [30, 44], [30, 68]], 4: [[20, 22], [40, 22], [20, 66], [40, 66]], 5: [[20, 22], [40, 22], [30, 44], [20, 66], [40, 66]],
  6: [[20, 22], [40, 22], [20, 44], [40, 44], [20, 66], [40, 66]], 7: [[20, 20], [40, 20], [30, 33], [20, 46], [40, 46], [20, 68], [40, 68]], 8: [[20, 18], [40, 18], [20, 36], [40, 36], [20, 52], [40, 52], [20, 70], [40, 70]],
  9: [[20, 18], [40, 18], [20, 34], [40, 34], [30, 44], [20, 54], [40, 54], [20, 70], [40, 70]], 10: [[20, 16], [40, 16], [30, 27], [20, 38], [40, 38], [20, 50], [40, 50], [30, 61], [20, 72], [40, 72]] };
function pcFaceSVG(suit, rank) {
  const red = suit === 'h' || suit === 'd', col = red ? '#C4302B' : '#2A2A3A', pip = PC_PIP[suit], court = /[JQK]/.test(rank);
  let inner = '';
  if (court) inner = '<text x="30" y="52" text-anchor="middle" font-family="Georgia,serif" font-size="30" font-weight="700" fill="' + col + '">' + rank + '</text><text x="30" y="70" text-anchor="middle" font-size="12" fill="' + col + '">' + pip + '</text><path d="M18 24 L22 16 L26 22 L30 14 L34 22 L38 16 L42 24 Z" fill="' + (suit === 'h' || suit === 'd' ? '#E9C784' : '#CBD2DA') + '" stroke="' + col + '" stroke-width="1"/>';
  else if (rank === 'A') inner = '<text x="30" y="55" text-anchor="middle" font-size="30" fill="' + col + '">' + pip + '</text>';
  else inner = (PC_LAYOUT[rank] || []).map((p) => '<text x="' + p[0] + '" y="' + (p[1] + 4) + '" text-anchor="middle" font-size="11" fill="' + col + '">' + pip + '</text>').join('');
  const corner = (x, y, rot) => '<g transform="translate(' + x + ',' + y + ') rotate(' + rot + ')"><text x="0" y="0" text-anchor="middle" font-family="Georgia,serif" font-size="9" font-weight="700" fill="' + col + '">' + rank + '</text><text x="0" y="9" text-anchor="middle" font-size="8" fill="' + col + '">' + pip + '</text></g>';
  return '<svg viewBox="0 0 60 84" class="pcface"><rect x="1" y="1" width="58" height="82" rx="6" fill="#FFFDF8" stroke="#3B2A5E" stroke-width="1.6"/>' + corner(8, 11, 0) + corner(52, 73, 180) + inner + '</svg>';
}
const pcId = (suit, rank) => suit + rank;
const pcName = (suit, rank) => { const X = LEX[lang], r = /[JQK]/.test(rank) ? (lang === 'vi' ? { J: 'J', Q: 'Q', K: 'K' }[rank] : { J: 'Jack', Q: 'Queen', K: 'King' }[rank]) : (rank === 'A' ? (lang === 'vi' ? 'Át' : 'Ace') : rank); return lang === 'vi' ? r + ' ' + PC_SUIT_TEXT[suit].vi[0] : r + ' of ' + PC_SUIT_TEXT[suit].en[0]; };
const pcTile = (suit, rank) => '<button class="vt pct" data-pc="' + pcId(suit, rank) + '">' + pcFaceSVG(suit, rank) + '<b>' + esc(pcName(suit, rank)) + '</b></button>';

/* ---- visuals for the sessions ---- */
function pcSuitsHTML() {
  return '<div class="pcsuits">' + PC_SUITS.map((s) => { const t = PC_SUIT_TEXT[s[0]][lang]; return '<div class="pcsuit"><div class="pcs2">' + pcFaceSVG(s[0], 'A') + '<div><b class="' + (s[0] === 'h' || s[0] === 'd' ? 'red' : '') + '">' + s[1] + ' ' + esc(t[0]) + '</b><span class="faint">' + esc(t[2]) + '</span></div></div><p>' + esc(t[1]) + '</p></div>'; }).join('') + '</div>';
}
function pcRanksHTML() {
  return '<div class="vstrip">' + PC_RANKS.slice(0, 10).map((r) => '<button class="vt pct" data-pc="' + pcId('h', r) + '">' + pcFaceSVG('h', r) + '<b>' + esc(PC_RANK_TEXT[r][lang][0]) + '</b></button>').join('') + '</div>';
}
function pcStripHTML(suit) {
  return '<div class="pcgrid">' + PC_RANKS.map((r) => { const tr = PC_TRAD[pcId(suit, r)] || ['', '']; return '<button class="pcrowb" data-pc="' + pcId(suit, r) + '">' + pcFaceSVG(suit, r) + '<span><b>' + esc(pcName(suit, r)) + '</b><span>' + esc(lang === 'vi' ? tr[0] : tr[1]) + '</span></span></button>'; }).join('') + '</div>';
}
function pcCourtHTML() {
  return '<div class="pccourt">' + PC_SUITS.map((s) => '<div class="pcc-row"><b class="' + (s[0] === 'h' || s[0] === 'd' ? 'red' : '') + '">' + s[1] + ' ' + esc(PC_SUIT_TEXT[s[0]][lang][0]) + '</b><div class="vstrip">' + ['J', 'Q', 'K'].map((r) => '<button class="vt pct" data-pc="' + pcId(s[0], r) + '">' + pcFaceSVG(s[0], r) + '<b>' + esc(PC_RANK_TEXT[r][lang][0]) + '</b></button>').join('') + '</div><p class="faint">' + esc(PC_COURT_TEXT[s[0] + 'Q'][lang]) + '</p></div>').join('') + '</div>';
}
function pcComboHTML() {
  return '<div class="pcpairs">' + PC_COMBOS.map((c) => '<div class="pcpair"><div class="two">' + pcFaceSVG(c[0][0], c[0].slice(1)) + '<span>+</span>' + pcFaceSVG(c[1][0], c[1].slice(1)) + '</div><p>' + esc(c[2][lang]) + '</p></div>').join('') + '</div>'
    + '<div class="ins"><h3>⏳ ' + esc(lang === 'vi' ? 'Thời gian' : 'Timing') + '</h3><ul class="pl">' + PC_TIMING[lang].map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul></div>';
}
function pcSpreadsHTML() {
  const wishLay = (function () { const a = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) a.push([c, r]); return a; }());
  return '<div class="spv-list">' + PC_SPREADS.map((s) => '<div class="ins"><h3>' + esc(s[lang][0]) + ' · ' + s.n + (lang === 'vi' ? ' lá' : ' cards') + '</h3><div class="spread-d">' + spreadArt(s.lay === 'wish' ? wishLay : LAY[s.lay]) + '</div><p>' + esc(s[lang][1]) + '</p></div>').join('') + '</div>'
    + '<a class="btn primary block" href="#/learn/fortune/cards">🃏 ' + esc(lang === 'vi' ? 'Tra một lá bất kỳ và so với tarot' : 'Look up any card and compare with tarot') + '</a>';
}
function pcGridHTML() {
  return PC_SUITS.map((s) => '<h3 style="margin:14px 0 8px" class="' + (s[0] === 'h' || s[0] === 'd' ? 'red' : '') + '">' + s[1] + ' ' + esc(PC_SUIT_TEXT[s[0]][lang][0]) + '</h3><div class="deckgrid">' + PC_RANKS.map((r) => '<button data-pc="' + pcId(s[0], r) + '">' + pcFaceSVG(s[0], r) + esc(pcName(s[0], r)) + '</button>').join('') + '</div>').join('');
}
function bindPC(root) { $$('[data-pc]', root).forEach((b) => b.addEventListener('click', () => { location.hash = '#/learn/pc/' + b.getAttribute('data-pc'); })); }

/* ---- one page per card ---- */
function pcCardBodyHTML(id) {
  const S = T(), suit = id[0], rank = id.slice(1), st = PC_SUIT_TEXT[suit][lang], rk = PC_RANK_TEXT[rank][lang], tr = PC_TRAD[id] || ['', ''], tw = pcToTarot(suit, rank), c = cardById(tw), I = insightOf(tw), sp = PC_SPECIAL[id];
  const pairs = PC_COMBOS.filter((x) => x[0] === id || x[1] === id);
  return '<div class="hero"><div class="pcbig">' + pcFaceSVG(suit, rank) + '</div><div><div class="name">' + esc(pcName(suit, rank)) + '</div>' + (sp ? '<div class="en">★ ' + esc(sp[lang]) + '</div>' : '') + '<div class="meta"><i>' + esc(st[2]) + '</i></div></div></div>'
    + '<div class="ins"><h3>' + esc(S.pcTrad) + '</h3><p class="pctrad">' + esc(lang === 'vi' ? tr[0] : tr[1]) + '</p></div>'
    + '<div class="ins"><h3>' + esc(lang === 'vi' ? 'Vì sao lá này nghĩa vậy' : 'Why the card means this') + '</h3><p><b>' + esc(st[0]) + ':</b> ' + esc(st[1]) + '</p><p><b>' + esc(rk[0]) + ':</b> ' + esc(rk[1]) + '</p>' + (PC_COURT_TEXT[id] ? '<p><b>' + esc(lang === 'vi' ? 'Người' : 'The person') + ':</b> ' + esc(PC_COURT_TEXT[id][lang]) + '</p>' : '') + '</div>'
    + (pairs.length ? '<div class="ins"><h3>' + esc(lang === 'vi' ? 'Cặp lá thường gặp' : 'Common pairs') + '</h3>' + pairs.map((p) => { const o = p[0] === id ? p[1] : p[0]; return '<p>+ <b>' + esc(pcName(o[0], o.slice(1))) + '</b>: ' + esc(p[2][lang]) + '</p>'; }).join('') + '</div>' : '')
    + '<div class="pcrow"><button class="face" data-open-card="' + tw + '">' + faceSVG(c) + '</button><div><div class="eyebrow">' + esc(S.pcTarotWay) + '</div><b>' + esc(c.name) + '</b><p>' + esc(I.pos.slice(0, 3).join(' · ')) + '</p></div></div>';
}
function renderPCCard(id) {
  const S = T(), m = $('#main');
  if (!/^[hdcs](A|[2-9]|10|J|Q|K)$/.test(id || '')) { redirect('#/learn/playing'); return; }
  if (id !== DEMO.playing.card && gate('playing', '#/learn/playing?tab=cards')) return;
  m.innerHTML = backLink('#/learn/playing?tab=cards', S.cats.playing) + '<div class="detail">' + pcCardBodyHTML(id) + '</div>' + aiPanelHTML({ type: 'general' });
  bindCardLinks(m); bindAI(m);
}

LESSONS.playing = PC_LESSONS_VI;
