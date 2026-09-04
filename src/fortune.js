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
  heart: { d: 'M28 62 C 44 46, 68 40, 92 44', vi: ['Đường tim', 'Trên cùng, chạy dưới các ngón. Nói về tình cảm và cách bạn yêu.', ['Cong và dài: cởi mở, thể hiện dễ.', 'Thẳng và ngắn: kín đáo, thực tế trong tình yêu.', 'Kết thúc dưới ngón trỏ: yêu bằng lý tưởng, hay hài lòng.', 'Kết thúc dưới ngón giữa: yêu bằng lý trí, đặt mình trước.']], en: ['Heart line', 'Topmost, running under the fingers. Feelings and how you love.', ['Curved and long: open, expressive.', 'Straight and short: private, practical in love.', 'Ends under the index finger: idealistic, content in love.', 'Ends under the middle finger: loves with the head, self first.']] },
  head: { d: 'M26 74 C 46 70, 66 74, 84 86', vi: ['Đường trí', 'Ở giữa. Cách bạn nghĩ và quyết định.', ['Dài: nghĩ nhiều, phân tích.', 'Ngắn: quyết nhanh, thực tế.', 'Cong xuống: giàu tưởng tượng.', 'Tách rời đường sinh mệnh ở đầu: độc lập sớm.']], en: ['Head line', 'In the middle. How you think and decide.', ['Long: thinks a lot, analytical.', 'Short: decides fast, practical.', 'Curving down: imaginative.', 'Separate from the life line at the start: independent early.']] },
  life: { d: 'M30 70 C 24 92, 30 116, 50 134', vi: ['Đường sinh mệnh', 'Vòng quanh gốc ngón cái. Sức sống và những thay đổi lớn, không phải tuổi thọ.', ['Rõ và sâu: nhiều sức sống.', 'Mờ: mệt, cần chăm cơ thể.', 'Đứt đoạn hay rẽ nhánh: một lần đổi đời.', 'Vòng rộng: sống hết mình, hướng ngoại.']], en: ['Life line', 'Around the base of the thumb. Vitality and big changes, not lifespan.', ['Clear and deep: strong vitality.', 'Faint: tired, look after the body.', 'A break or a fork: a life change.', 'A wide curve: lives fully, outgoing.']] },
  fate: { d: 'M62 136 C 60 110, 60 84, 64 56', vi: ['Đường sự nghiệp', 'Dọc giữa bàn tay, không phải ai cũng có. Con đường công việc.', ['Rõ từ dưới lên: sự nghiệp ổn định sớm.', 'Bắt đầu từ giữa tay: tìm ra đường muộn hơn.', 'Đứt rồi nối: đổi ngành.', 'Không có: sống nhiều hướng, không theo một nghề.']], en: ['Fate line', 'Up the middle of the palm; not everyone has one. The work path.', ['Clear from the bottom: a career settles early.', 'Starts mid-palm: finds the path later.', 'Broken then resumed: a change of field.', 'Absent: many directions, no single career.']] }
};
const TEA = [['🐦', 'Chim', 'Bird', 'tin tức đang tới', 'news on the way'], ['💗', 'Trái tim', 'Heart', 'tình cảm, một người thương', 'love, someone dear'], ['💍', 'Nhẫn', 'Ring', 'cam kết, hôn nhân', 'commitment, marriage'], ['🔑', 'Chìa khoá', 'Key', 'cửa mở, cơ hội', 'a door opens'], ['➖', 'Đường thẳng', 'Straight line', 'chuyến đi, kế hoạch rõ', 'a journey, a clear plan'], ['🌳', 'Cây', 'Tree', 'thành công dần dần', 'gradual success'], ['☁️', 'Mây', 'Cloud', 'rối, chưa rõ', 'confusion, not yet clear'], ['🔤', 'Chữ cái', 'Letter', 'tên một người', 'someone\'s initial'], ['🔢', 'Con số', 'Number', 'ngày hoặc tháng', 'days or months'], ['⭐', 'Ngôi sao', 'Star', 'may mắn, hy vọng', 'luck, hope'], ['🌙', 'Trăng', 'Moon', 'thay đổi, chuyện tình cảm', 'change, matters of the heart'], ['🐍', 'Rắn', 'Snake', 'coi chừng người xấu', 'beware a false friend'], ['🐟', 'Cá', 'Fish', 'tin vui, tiền vào', 'good news, money coming'], ['🏠', 'Ngôi nhà', 'House', 'an toàn, gia đình', 'safety, home'], ['⚓', 'Mỏ neo', 'Anchor', 'ổn định, công việc chắc', 'stability, steady work'], ['🚪', 'Cánh cửa', 'Door', 'chuyện mới sắp mở', 'something new about to open']];
const PC_SUITS = [['h', '♥', 'cups'], ['d', '♦', 'pentacles'], ['c', '♣', 'wands'], ['s', '♠', 'swords']];
const PC_RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const pcToTarot = (suit, rank) => { const s = PC_SUITS.filter((x) => x[0] === suit)[0][2]; if (rank === 'J') return s + '-c1'; if (rank === 'Q') return s + '-c2'; if (rank === 'K') return s + '-c3'; return s + '-' + (rank === 'A' ? 1 : Number(rank)); };

function renderFortune(tool) {
  const S = T(), m = $('#main');
  if (!tool) {
    m.innerHTML = backLink('#/learn', S.learnTitle) + '<h1 style="margin-bottom:6px">' + esc(S.cats.fortune) + '</h1><p class="muted">' + esc(S.fortuneIntro) + '</p>'
      + '<div class="ftiles">' + Object.keys(FT).map((k) => '<a class="ftile" href="#/learn/fortune/' + k + '"><span class="ic">' + FT[k].ic + '</span><b>' + esc(FT[k][lang][0]) + '</b><span>' + esc(FT[k][lang][1]) + '</span></a>').join('') + '</div>'
      + '<div class="eyebrow" style="margin-top:20px">' + esc(S.readMoreTitle) + '</div>' + GUIDES.filter((g) => g.cat === 'fortune' && g.id === 'fort-oracle').map(guideRow).join('');
    return;
  }
  const back = backLink('#/learn/fortune', S.cats.fortune), title = (k) => '<div class="eyebrow">' + esc(S.cats.fortune) + '</div><h1 style="margin-bottom:8px">' + FT[k].ic + ' ' + esc(FT[k][lang][0]) + '</h1>';
  if (tool === 'numbers') return renderNumbersTool(m, back + title('numbers'));
  if (tool === 'palm') return renderPalm(m, back + title('palm'));
  if (tool === 'cards') return renderPlayingCards(m, back + title('cards'));
  if (tool === 'tea') return renderTea(m, back + title('tea'));
  if (tool === 'animals') return renderAnimals(m, back + title('animals'));
  location.hash = '#/learn/fortune';
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
function handSVG(active) {
  const line = (k, col) => '<path d="' + PALM[k].d + '" fill="none" stroke="' + col + '" stroke-width="' + (active === k ? 4 : 2.5) + '" stroke-linecap="round" data-line="' + k + '" style="cursor:pointer"' + (active === k ? '' : ' opacity=".75"') + '/>';
  return '<svg viewBox="0 0 120 150" class="hand">'
    + '<path d="M30 70 C 26 50, 30 30, 38 30 C 46 30, 46 55, 46 62 C 46 40, 44 18, 54 18 C 64 18, 62 44, 62 60 C 62 40, 62 22, 72 22 C 82 22, 78 46, 78 62 C 80 46, 80 34, 88 34 C 96 34, 92 56, 92 70 C 100 60, 108 64, 104 74 C 96 84, 92 94, 90 106 C 86 130, 76 140, 60 140 C 40 140, 30 126, 28 108 C 26 92, 26 82, 30 70 Z" fill="#F6DCC9" stroke="#3B2A5E" stroke-width="2"/>'
    + line('life', '#C4557A') + line('head', '#2F5E9A') + line('heart', '#B04A2E') + line('fate', '#5B3F9E') + '</svg>';
}
function renderPalm(m, head) {
  const S = T();
  const keys = ['heart', 'head', 'life', 'fate'], cols = { heart: '#B04A2E', head: '#2F5E9A', life: '#C4557A', fate: '#5B3F9E' };
  const draw = (k) => {
    $('#handwrap').innerHTML = handSVG(k);
    const p = PALM[k][lang];
    $('#palmout').innerHTML = '<h3 style="color:' + cols[k] + '">' + esc(p[0]) + '</h3><p>' + esc(p[1]) + '</p><ul class="pl">' + p[2].map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>';
    $$('[data-pl]', m).forEach((b) => b.classList.toggle('on', b.getAttribute('data-pl') === k));
    $$('[data-line]', m).forEach((l) => l.addEventListener('click', () => draw(l.getAttribute('data-line'))));
  };
  m.innerHTML = head + '<p class="muted">' + esc(S.palmIntro) + '</p><div class="palmwrap"><div id="handwrap"></div><div class="chips" style="justify-content:center;margin:8px 0">' + keys.map((k) => '<button class="chip" data-pl="' + k + '" style="border-color:' + cols[k] + '">' + esc(PALM[k][lang][0]) + '</button>').join('') + '</div><div class="ins" id="palmout"></div></div>'
    + '<div class="acc"><button><span>' + esc(S.readMoreTitle) + '</span></button><div class="in">' + guideBodyHTML(GUIDES.filter((g) => g.id === 'fort-palm')[0]) + '</div></div>';
  $$('[data-pl]', m).forEach((b) => b.addEventListener('click', () => draw(b.getAttribute('data-pl'))));
  draw('heart'); bindAccordions(m);
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
    $('#pcout').innerHTML = '<div class="pcresult"><div class="pcard"><span class="' + (suit === 'h' || suit === 'd' ? 'red' : '') + '">' + rank + PC_SUITS.filter((x) => x[0] === suit)[0][1] + '</span></div><div><div class="eyebrow">' + esc(S.pcTrad) + '</div><p class="pctrad">' + esc(lang === 'vi' ? trad[0] : trad[1]) + '</p></div></div>'
      + '<div class="pcresult"><div class="eyebrow" style="width:100%">' + esc(S.pcTarotWay) + '</div><button class="face" data-open-card="' + id + '" style="width:96px">' + faceSVG(c) + '</button><div><b>' + esc(c.name) + '</b><p>' + esc(I.pos.slice(0, 3).join(' · ')) + '</p><p class="muted">' + esc(c.up) + '</p></div></div>';
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
  let s = '<svg viewBox="0 0 220 220" class="awheel">';
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * Math.PI * 2 - Math.PI / 2, x = 110 + 86 * Math.cos(a), y = 110 + 86 * Math.sin(a), on = i === active;
    s += '<g data-animal="' + i + '" style="cursor:pointer"><circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (on ? 20 : 16) + '" fill="' + (on ? 'var(--primary)' : 'var(--surface)') + '" stroke="var(--rule)"/><text x="' + x.toFixed(1) + '" y="' + (y + 6).toFixed(1) + '" text-anchor="middle" font-size="' + (on ? 20 : 16) + '">' + ANIMAL_EMOJI[i] + '</text><text x="' + x.toFixed(1) + '" y="' + (y + 28).toFixed(1) + '" text-anchor="middle" font-size="8" font-weight="700" fill="var(--fg)">' + CHI[i] + '</text></g>';
  }
  return s + '</svg>';
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
