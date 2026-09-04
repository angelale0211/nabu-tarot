/* ============================ guides ============================
   Short pieces for the Learn tab. Every guide carries a badge:
   doc  = a documented tradition with a source you can name
   conv = common practice among readers, no single source
   own  = one reader's own system, presented as such
   Plain language; one idea per paragraph. `tags` are INTERESTS ids so the home
   screen can suggest guides. */
const GUIDES = [

/* ------------------------------------------------------------ tarot ---- */
{ id: 'tarot-start', cat: 'tarot', badge: 'conv', tags: ['tarot'],
  title: { vi: 'Bắt đầu học tarot', en: 'Getting started with tarot' },
  intro: { vi: 'Bạn không cần thuộc 78 lá trước khi rút lá đầu tiên. Bạn cần một bộ bài, một câu hỏi rõ, và thói quen mỗi ngày.', en: 'You do not need to memorise 78 cards before your first draw. You need one deck, one clear question, and a daily habit.' },
  sections: [
    { h: { vi: 'Một bộ bài thôi', en: 'One deck only' }, p: { vi: 'Bắt đầu với Rider–Waite–Smith hoặc bộ vẽ theo nó. Mọi sách và video đều dựa trên hình của bộ này. 78 lá đều có tranh, nên tranh dạy bạn trước khi bạn thuộc nghĩa.', en: 'Start with Rider–Waite–Smith or a deck drawn after it. Every book and video assumes its pictures. All 78 cards are illustrated, so the pictures teach you before the meanings do.' } },
    { h: { vi: 'Học cấu trúc trước, nghĩa sau', en: 'Structure before meanings' }, p: { vi: '22 lá Ẩn Chính là những bài học lớn. 56 lá Ẩn Phụ là chuyện hằng ngày, chia bốn chất: Gậy (lửa, hành động), Cốc (nước, cảm xúc), Kiếm (khí, suy nghĩ), Tiền (đất, vật chất). Biết bộ khung này, bạn đoán được một lá chưa học.', en: '22 Majors are the big lessons. 56 Minors are daily life, in four suits: Wands (fire, action), Cups (water, feeling), Swords (air, thought), Pentacles (earth, material). Knowing this skeleton, you can guess a card you have not studied.' } },
    { h: { vi: 'Mỗi ngày một lá', en: 'One card a day' }, p: { vi: 'Sáng rút một lá. Viết ra bạn thấy gì và nghĩ nó nói gì. Rồi mới tra nghĩa. Khoảng cách giữa điều bạn nghĩ và điều sách nói là chỗ bạn học được nhiều nhất. Tối xem lại lá đó khớp với ngày của bạn ra sao.', en: 'Pull one card in the morning. Write what you see and what you think it says. Then look it up. The gap between your guess and the book is where you learn. In the evening, check how the card matched your day.' } },
    { h: { vi: 'Câu hỏi quyết định câu trả lời', en: 'The question decides the answer' }, p: { vi: 'Hỏi "mình cần biết gì về…" tốt hơn "có nên không". Hỏi "làm sao để…" tốt hơn "khi nào". Một lá trả lời tốt câu "cái gì", trả lời dở câu "có/không", và gần như không trả lời được câu "khi nào".', en: '"What do I need to know about…" beats "should I". "How can I…" beats "when". One card answers "what" well, "yes or no" badly, and "when" almost not at all.' } }
  ] },
{ id: 'tarot-reversed', cat: 'tarot', badge: 'conv', tags: ['tarot'],
  title: { vi: 'Lá ngược: đọc hay không đọc?', en: 'Reversed cards: read them or not?' },
  intro: { vi: 'Không có luật bắt buộc. Nhiều người đọc lá ngược, nhiều người không. Nabu không đọc lá ngược: mỗi lá được học cả mặt sáng lẫn mặt tối.', en: 'There is no rule. Many readers use reversals, many do not. Nabu does not: each card is learned with both its bright side and its shadow.' },
  sections: [
    { h: { vi: 'Cách 1: không đọc ngược', en: 'Way 1: no reversals' }, p: { vi: 'Mỗi lá có mặt sáng và mặt tối. Bạn nhìn các lá xung quanh và câu hỏi để biết lá này đang nói mặt nào. Mẹo nhỏ: thêm chữ "quá" vào từ khóa tích cực là ra từ khóa tiêu cực. Tự tin quá thành kiêu. Chủ động quá thành áp đặt.', en: 'Every card has a bright side and a shadow. The neighbouring cards and the question tell you which side is speaking. A handy trick: put "too" in front of a positive keyword to get the negative one. Too confident becomes arrogant. Too active becomes pushy.' } },
    { h: { vi: 'Cách 2: đọc ngược', en: 'Way 2: with reversals' }, p: { vi: 'Lá ngược thường là năng lượng của lá bị chặn, bị trễ, hoặc quay vào trong. Ngược không phải "xấu". Mười Kiếm ngược có thể là điều tệ nhất đã qua.', en: 'A reversed card is usually the card\'s energy blocked, delayed, or turned inward. Reversed is not "bad". Ten of Swords reversed can mean the worst is over.' } },
    { h: { vi: 'Chọn một cách và giữ nó', en: 'Pick one way and keep it' }, p: { vi: 'Quyết định trước khi xào bài. Đổi giữa chừng vì không thích câu trả lời là tự lừa mình.', en: 'Decide before you shuffle. Switching halfway because you dislike the answer is fooling yourself.' } }
  ] },
{ id: 'tarot-court', cat: 'tarot', badge: 'conv', tags: ['tarot', 'love'],
  title: { vi: 'Lá hoàng gia: người hay tính cách?', en: 'Court cards: a person or a trait?' },
  intro: { vi: '16 lá hoàng gia (Tiểu Đồng, Kỵ Sĩ, Nữ Hoàng, Đức Vua) là phần khó nhất với người mới. Chúng có thể là một người, một phần của bạn, hoặc một cách hành xử.', en: 'The 16 court cards (Page, Knight, Queen, King) are the hardest part for beginners. They can be a person, a part of you, or a way of behaving.' },
  sections: [
    { h: { vi: 'Bốn cấp', en: 'Four ranks' }, p: { vi: 'Tiểu Đồng: người trẻ, tin nhắn, bắt đầu học. Kỵ Sĩ: hành động, di chuyển, đôi khi quá đà. Nữ Hoàng: làm chủ chất đó từ bên trong. Đức Vua: làm chủ chất đó ra bên ngoài, có quyền.', en: 'Page: someone young, a message, learning. Knight: action, movement, sometimes too much. Queen: mastery of the suit from within. King: mastery turned outward, with authority.' } },
    { h: { vi: 'Khi hỏi về một người', en: 'When asking about a person' }, p: { vi: 'Lá hoàng gia mô tả tính cách, không mô tả tuổi hay giới tính cố định. Nữ Hoàng Kiếm có thể là một người đàn ông sắc sảo. Nhìn chất trước: Gậy nóng, Cốc tình cảm, Kiếm lý trí, Tiền thực tế.', en: 'A court card describes character, not fixed age or gender. The Queen of Swords can be a sharp man. Look at the suit first: Wands hot, Cups emotional, Swords rational, Pentacles practical.' } }
  ] },

/* -------------------------------------------------------- lenormand ---- */
{ id: 'len-vs-tarot', cat: 'lenormand', badge: 'doc', tags: ['lenormand'],
  title: { vi: 'Lenormand khác tarot thế nào', en: 'How Lenormand differs from tarot' },
  intro: { vi: 'Lenormand là bộ 36 lá, mỗi lá là một vật: Kỵ Mã, Cỏ Ba Lá, Thuyền, Nhà… Bạn không đọc từng lá. Bạn đọc các lá đứng cạnh nhau như một câu.', en: 'Lenormand is a 36-card deck where each card is a thing: Rider, Clover, Ship, House… You do not read one card at a time. You read cards next to each other like a sentence.' },
  sections: [
    { h: { vi: 'Lá là danh từ', en: 'Cards are nouns' }, p: { vi: 'Tarot cho bạn một cảnh và nhiều tầng nghĩa. Lenormand cho bạn một từ. Thư là thư. Chìa Khóa là mở ra, chắc chắn. Nghĩa đến từ việc ghép các từ lại: Kỵ Mã + Thư = tin nhắn đang tới.', en: 'Tarot gives you a scene with layers of meaning. Lenormand gives you a word. Letter is a letter. Key is opening, certainty. Meaning comes from joining words: Rider + Letter = a message on its way.' } },
    { h: { vi: 'Không có lá ngược', en: 'No reversals' }, p: { vi: 'Lenormand không đọc lá ngược. Mỗi lá có sắc thái sẵn: tích cực, trung tính, tiêu cực. Lá cạnh bên làm dịu hay làm nặng sắc thái đó.', en: 'Lenormand has no reversals. Each card has a built-in tone: positive, neutral, negative. The card beside it softens or sharpens that tone.' } },
    { h: { vi: 'Nguồn gốc', en: 'Where it comes from' }, p: { vi: 'Bộ bài bắt nguồn từ "Das Spiel der Hoffnung" của Hechtel (1799), một trò chơi cờ, và lấy tên bà Lenormand sau khi bà mất. Mỗi lá in kèm một lá bài Tây (bộ 36 lá piquet). Lenormand không có tương ứng cung hoàng đạo; các bảng cung trên mạng là do từng tác giả tự đặt.', en: 'The deck descends from Hechtel\'s "Das Spiel der Hoffnung" (1799), a board game, and took Mlle Lenormand\'s name after her death. Each card carries a playing-card inset (a 36-card piquet pack). Lenormand has no zodiac correspondences; the tables online are each author\'s own invention.' } }
  ] },
{ id: 'len-pairs', cat: 'lenormand', badge: 'doc', tags: ['lenormand'],
  title: { vi: 'Cách đọc hai lá và ba lá', en: 'Reading two and three cards' },
  intro: { vi: 'Đây là bài tập cơ bản nhất và cũng là thứ bạn dùng mãi. Hai lá là một ý. Ba lá là một câu chuyện nhỏ.', en: 'This is the most basic exercise and the one you keep using. Two cards make one idea. Three cards make a small story.' },
  sections: [
    { h: { vi: 'Hai lá', en: 'Two cards' }, p: { vi: 'Lá đầu là chủ đề, lá sau bổ nghĩa cho nó. Nhà + Tim: một gia đình ấm áp. Tim + Nhà: tình cảm hướng về gia đình, muốn ổn định. Đổi thứ tự là đổi nghĩa.', en: 'The first card is the subject, the second describes it. House + Heart: a warm home. Heart + House: love turned toward home, wanting to settle. Swap the order and the meaning shifts.' } },
    { h: { vi: 'Ba lá', en: 'Three cards' }, p: { vi: 'Lá giữa là trọng tâm. Hai lá hai bên bổ nghĩa. Hoặc đọc trái sang phải như quá khứ, hiện tại, tương lai. Chọn một cách trước khi rút.', en: 'The middle card is the focus, the two sides describe it. Or read left to right as past, present, future. Choose the way before you draw.' } },
    { h: { vi: 'Luyện mỗi ngày', en: 'Daily practice' }, p: { vi: 'Rút ba lá buổi sáng, viết một câu. Tối kiểm lại. Sau một tháng bạn sẽ đọc được cặp lá không cần tra.', en: 'Draw three cards in the morning, write one sentence. Check in the evening. After a month you will read pairs without looking them up.' } }
  ] },

/* ------------------------------------------------------------ astro ---- */
{ id: 'astro-big3', cat: 'astro', badge: 'doc', tags: ['astro'],
  title: { vi: 'Cung Mặt Trời, Mặt Trăng và Mọc', en: 'Sun, Moon and Rising' },
  intro: { vi: 'Cung bạn hay nói "mình là Sư Tử" là cung Mặt Trời. Nó chỉ là một phần của bản đồ sao. Hai phần quan trọng nữa là Mặt Trăng và cung Mọc.', en: 'The sign you call "I am a Leo" is your Sun sign. It is one part of the chart. Two more matter a lot: the Moon and the Rising sign.' },
  sections: [
    { h: { vi: 'Mặt Trời: bạn là ai', en: 'Sun: who you are' }, p: { vi: 'Tính theo ngày sinh. Đây là cái tôi, hướng sống, thứ bạn muốn trở thành. App này tính cung Mặt Trời từ ngày sinh của bạn.', en: 'Set by your birth date. This is your core self, your direction, what you want to become. This app works out your Sun sign from your birthday.' } },
    { h: { vi: 'Mặt Trăng: bạn cảm thế nào', en: 'Moon: how you feel' }, p: { vi: 'Cần giờ sinh gần đúng. Mặt Trăng là cảm xúc, thói quen, thứ bạn cần để thấy an toàn. Nhiều người thấy mình giống cung Mặt Trăng hơn cung Mặt Trời.', en: 'Needs a roughly correct birth time. The Moon is feelings, habits, what you need to feel safe. Many people recognise themselves more in their Moon than in their Sun.' } },
    { h: { vi: 'Mọc: người khác thấy bạn thế nào', en: 'Rising: how others see you' }, p: { vi: 'Cần giờ sinh và nơi sinh chính xác, vì cung Mọc đổi mỗi hai giờ. Đây là ấn tượng đầu, phong cách, vẻ ngoài. Muốn có bản đồ sao đầy đủ, bạn cần cả ba thứ: ngày, giờ, nơi sinh.', en: 'Needs exact birth time and place, because the Rising sign changes every two hours. This is first impression, style, appearance. For a full chart you need all three: date, time, place of birth.' } }
  ] },
{ id: 'astro-elements', cat: 'astro', badge: 'doc', tags: ['astro', 'tarot'],
  title: { vi: 'Bốn nguyên tố và ba tính chất', en: 'Four elements and three modes' },
  intro: { vi: '12 cung chia theo hai cách. Nguyên tố nói cung đó "làm bằng gì". Tính chất nói cung đó "chuyển động ra sao".', en: 'The 12 signs split two ways. The element says what a sign is made of. The mode says how it moves.' },
  sections: [
    { h: { vi: 'Nguyên tố', en: 'Elements' }, p: { vi: 'Lửa (Bạch Dương, Sư Tử, Nhân Mã): hành động, nhiệt, tự tin. Đất (Kim Ngưu, Xử Nữ, Ma Kết): thực tế, bền, vật chất. Khí (Song Tử, Thiên Bình, Bảo Bình): suy nghĩ, giao tiếp, ý tưởng. Nước (Cự Giải, Bọ Cạp, Song Ngư): cảm xúc, trực giác, ký ức. Trong tarot: Gậy là lửa, Tiền là đất, Kiếm là khí, Cốc là nước.', en: 'Fire (Aries, Leo, Sagittarius): action, heat, confidence. Earth (Taurus, Virgo, Capricorn): practical, steady, material. Air (Gemini, Libra, Aquarius): thought, communication, ideas. Water (Cancer, Scorpio, Pisces): feeling, intuition, memory. In tarot: Wands are fire, Pentacles earth, Swords air, Cups water.' } },
    { h: { vi: 'Tính chất', en: 'Modes' }, p: { vi: 'Khởi đầu (Bạch Dương, Cự Giải, Thiên Bình, Ma Kết): mở mùa, bắt đầu việc. Cố định (Kim Ngưu, Sư Tử, Bọ Cạp, Bảo Bình): giữ, duy trì, bướng. Biến đổi (Song Tử, Xử Nữ, Nhân Mã, Song Ngư): thích nghi, kết thúc, linh hoạt.', en: 'Cardinal (Aries, Cancer, Libra, Capricorn): opens the season, starts things. Fixed (Taurus, Leo, Scorpio, Aquarius): holds, maintains, stubborn. Mutable (Gemini, Virgo, Sagittarius, Pisces): adapts, finishes, flexible.' } }
  ] },
{ id: 'astro-moon', cat: 'astro', badge: 'conv', tags: ['astro', 'manifest'],
  title: { vi: 'Chu kỳ trăng và cách dùng', en: 'The Moon cycle and how to use it' },
  intro: { vi: 'Trăng đi hết một vòng trong khoảng 29,5 ngày. Nhiều người dùng chu kỳ này để đặt ý định và buông bỏ. Đây là thói quen, không phải quy luật.', en: 'The Moon completes a cycle in about 29.5 days. Many people use it to set intentions and let go. This is a practice, not a law.' },
  sections: [
    { h: { vi: 'Trăng non', en: 'New Moon' }, p: { vi: 'Bầu trời tối. Thời điểm gieo: viết điều bạn muốn bắt đầu trong tháng này. Ngắn gọn, cụ thể.', en: 'Dark sky. Planting time: write what you want to start this month. Short and specific.' } },
    { h: { vi: 'Trăng tròn', en: 'Full Moon' }, p: { vi: 'Sáng nhất. Thời điểm nhìn lại: điều gì đã lộ ra, điều gì cần thả. Nhiều người xem bài vào trăng tròn vì cảm xúc rõ hơn.', en: 'Brightest. Time to look back: what has come to light, what to release. Many people read cards at the Full Moon because feelings are clearer.' } },
    { h: { vi: 'Trăng khuyết', en: 'Waning Moon' }, p: { vi: 'Từ tròn về non. Dọn dẹp, kết thúc, nghỉ. Không hợp để bắt đầu việc lớn.', en: 'From full back to new. Clearing, ending, resting. Not the time to start something big.' } }
  ] },
{ id: 'astro-retro', cat: 'astro', badge: 'doc', tags: ['astro', 'work'],
  title: { vi: 'Sao Thủy nghịch hành là gì', en: 'What Mercury retrograde is' },
  intro: { vi: 'Ba, bốn lần mỗi năm, Sao Thủy nhìn từ Trái Đất có vẻ đi lùi khoảng ba tuần. Đó là hiệu ứng góc nhìn, sao không lùi thật.', en: 'Three or four times a year, Mercury appears from Earth to move backwards for about three weeks. It is a viewing effect; the planet does not reverse.' },
  sections: [
    { h: { vi: 'Người ta gán cho nó điều gì', en: 'What people link it to' }, p: { vi: 'Sao Thủy gắn với giao tiếp, đi lại, hợp đồng, máy móc. Nên thời gian này người ta hay đổ lỗi cho tin nhắn hiểu lầm, chuyến đi trễ, máy hỏng.', en: 'Mercury is linked to communication, travel, contracts, devices. So this period gets blamed for misread messages, late trips and broken machines.' } },
    { h: { vi: 'Cách dùng cho có ích', en: 'A useful way to use it' }, p: { vi: 'Xem nó như lời nhắc: đọc lại trước khi gửi, sao lưu, kiểm tra kỹ hợp đồng, liên lạc lại người cũ nếu cần. Đừng hoãn cả đời vì một hành tinh.', en: 'Treat it as a reminder: re-read before sending, back things up, check contracts, reconnect with old contacts if useful. Do not put your life on hold for a planet.' } }
  ] },

/* --------------------------------------------------------- manifest ---- */
{ id: 'mani-what', cat: 'manifest', badge: 'conv', tags: ['manifest'],
  title: { vi: 'Manifestation là gì', en: 'What manifestation is' },
  intro: { vi: 'Manifestation là việc nói rõ điều bạn muốn, tin rằng nó có thể, và hành động như thể nó đang tới. Phần "hành động" là phần hay bị quên.', en: 'Manifestation is naming clearly what you want, believing it is possible, and acting as if it is on its way. The "acting" part is the one people forget.' },
  sections: [
    { h: { vi: 'Nó làm được gì', en: 'What it can do' }, p: { vi: 'Khi bạn nói rõ mục tiêu, não bạn bắt đầu để ý cơ hội liên quan. Bạn dám mở lời, dám nộp đơn, dám hẹn. Đó là cách "vũ trụ đáp lại" theo nghĩa thực tế nhất.', en: 'When you name a goal clearly, your mind starts noticing related chances. You dare to speak up, apply, ask. That is "the universe answering" in the most practical sense.' } },
    { h: { vi: 'Nó không làm được gì', en: 'What it cannot do' }, p: { vi: 'Nó không thay đổi người khác. Nó không thay thế việc học, làm, hay đi khám bệnh. Nếu ai đó nói bạn bị bệnh hay nghèo là do "rung động thấp", họ đang đổ lỗi cho bạn, không phải dạy bạn.', en: 'It does not change other people. It does not replace studying, working, or seeing a doctor. If someone says you are sick or poor because of "low vibration", they are blaming you, not teaching you.' } },
    { h: { vi: 'Cách bắt đầu', en: 'How to begin' }, p: { vi: 'Viết một câu ở thì hiện tại: "Mình đang làm công việc mình thích, lương đủ sống thoải mái." Đọc mỗi sáng. Rồi làm một việc nhỏ hướng về nó trong ngày.', en: 'Write one sentence in the present tense: "I am doing work I enjoy that pays me comfortably." Read it each morning. Then do one small thing toward it that day.' } }
  ] },
{ id: 'mani-script', cat: 'manifest', badge: 'conv', tags: ['manifest', 'love', 'work'],
  title: { vi: 'Viết kịch bản (scripting)', en: 'Scripting' },
  intro: { vi: 'Bạn viết một trang nhật ký như thể điều bạn muốn đã xảy ra. Càng cụ thể càng tốt: bạn thấy gì, nghe gì, cảm thấy gì.', en: 'You write a diary page as if what you want has already happened. The more specific the better: what you see, hear, feel.' },
  sections: [
    { h: { vi: 'Cách viết', en: 'How to write it' }, p: { vi: 'Thì hiện tại hoặc quá khứ gần. "Hôm nay mình vừa ký hợp đồng mới. Sếp bắt tay và nói…" Kết bằng lời cảm ơn. Viết 10 phút, không sửa.', en: 'Present or recent past tense. "Today I signed the new contract. My manager shook my hand and said…" End with thanks. Write for ten minutes, no editing.' } },
    { h: { vi: 'Khi nào viết', en: 'When to write' }, p: { vi: 'Nhiều người viết vào trăng non hoặc tối trước ngày quan trọng. Thật ra lúc nào bạn yên tĩnh được 10 phút là được.', en: 'Many people write at the New Moon or the night before an important day. In truth, any ten quiet minutes will do.' } },
    { h: { vi: 'Về người khác', en: 'About other people' }, p: { vi: 'Viết về cảm giác bạn muốn có trong tình yêu, đừng viết tên một người cụ thể phải yêu bạn. Người ta có ý chí riêng. Viết "mình được yêu một cách nhẹ nhàng và rõ ràng" mở ra nhiều cửa hơn.', en: 'Write about the feeling you want in love, not that a specific person must love you. People have their own will. "I am loved gently and clearly" opens more doors.' } }
  ] },
{ id: 'mani-369', cat: 'manifest', badge: 'own', tags: ['manifest'],
  title: { vi: 'Phương pháp 369', en: 'The 369 method' },
  intro: { vi: 'Viết câu khẳng định 3 lần buổi sáng, 6 lần buổi chiều, 9 lần buổi tối. Lan truyền trên TikTok, gắn với tên Tesla nhưng ông không hề dạy điều này.', en: 'Write your affirmation 3 times in the morning, 6 in the afternoon, 9 at night. It spread on TikTok and is linked to Tesla\'s name, though he never taught it.' },
  sections: [
    { h: { vi: 'Vì sao nó có tác dụng với một số người', en: 'Why it works for some' }, p: { vi: 'Không phải vì con số. Vì bạn nhắc mình 18 lần mỗi ngày về một mục tiêu. Sự lặp lại làm mục tiêu thành ưu tiên.', en: 'Not because of the numbers. Because you remind yourself 18 times a day of one goal. Repetition turns the goal into a priority.' } },
    { h: { vi: 'Cách làm gọn', en: 'A lean version' }, p: { vi: 'Một câu ngắn, dưới 15 chữ. Giữ 21 ngày. Nếu quên một ngày, cứ tiếp tục, đừng bắt đầu lại.', en: 'One short sentence, under 15 words. Keep it for 21 days. If you miss a day, continue; do not restart.' } }
  ] },
{ id: 'mani-gratitude', cat: 'manifest', badge: 'conv', tags: ['manifest'],
  title: { vi: 'Biết ơn và câu khẳng định', en: 'Gratitude and affirmations' },
  intro: { vi: 'Hai thói quen đơn giản nhất và có bằng chứng tâm lý học tốt nhất. Ghi ba điều biết ơn mỗi tối. Nói một câu khẳng định mỗi sáng.', en: 'The two simplest habits, and the ones with the best backing from psychology. Note three things you are grateful for each night. Say one affirmation each morning.' },
  sections: [
    { h: { vi: 'Biết ơn', en: 'Gratitude' }, p: { vi: 'Cụ thể mới có tác dụng. Không phải "biết ơn gia đình" mà "biết ơn mẹ gọi hỏi mình ăn chưa lúc 7 giờ tối". Ba điều, mỗi tối, trong sổ.', en: 'It only works when specific. Not "grateful for family" but "grateful mum called at 7pm to ask if I had eaten". Three things, every night, in a notebook.' } },
    { h: { vi: 'Câu khẳng định', en: 'Affirmations' }, p: { vi: 'Câu phải tin được. "Mình là triệu phú" khi tài khoản trống sẽ làm bạn thấy giả. "Mình đang học cách quản lý tiền tốt hơn mỗi tuần" thì tin được và kéo bạn đi.', en: 'The sentence has to be believable. "I am a millionaire" with an empty account feels fake. "I am learning to handle money better every week" is believable and moves you.' } }
  ] },
{ id: 'mani-limits', cat: 'manifest', badge: 'own', tags: ['manifest'],
  title: { vi: 'Giới hạn và sự thật thà', en: 'Limits and honesty' },
  intro: { vi: 'Nabu không hứa manifestation làm được mọi thứ. Đây là cách Nabu nhìn nó: một công cụ để rõ mình muốn gì, và để can đảm hơn.', en: 'Nabu does not promise manifestation can do everything. This is how Nabu sees it: a tool to get clear on what you want, and to be braver.' },
  sections: [
    { h: { vi: 'Dấu hiệu bạn đang dùng sai', en: 'Signs you are using it wrong' }, p: { vi: 'Bạn chờ thay vì làm. Bạn tự trách khi điều xấu xảy ra. Bạn tiêu tiền vào khóa học hứa "bí mật". Bạn tránh bác sĩ hoặc tránh nói chuyện thật vì "sợ hút năng lượng xấu".', en: 'You wait instead of acting. You blame yourself when bad things happen. You spend on courses promising "the secret". You avoid doctors or honest conversations for fear of "attracting bad energy".' } },
    { h: { vi: 'Dấu hiệu bạn đang dùng đúng', en: 'Signs you are using it right' }, p: { vi: 'Bạn rõ hơn mình muốn gì. Bạn dám mở lời. Bạn bớt sợ. Bạn vẫn làm việc, vẫn đi khám, vẫn tiết kiệm. Manifestation là thêm vào, không thay thế.', en: 'You are clearer about what you want. You speak up. You are less afraid. You still work, still see the doctor, still save. Manifestation adds; it does not replace.' } }
  ] },

/* ---------------------------------------------------------- fortune ---- */
{ id: 'fort-numerology', cat: 'fortune', badge: 'conv', tags: ['fortune'],
  title: { vi: 'Thần số học: số đường đời', en: 'Numerology: your life path number' },
  intro: { vi: 'Số đường đời tính từ ngày sinh. Cộng ngày, tháng, năm về một chữ số, giữ nguyên 11, 22, 33. App tính sẵn cho bạn ở mục Tôi.', en: 'The life path number comes from your birth date. Add day, month and year down to one digit, keeping 11, 22 and 33. The app works it out for you under Me.' },
  sections: [
    { h: { vi: 'Cách tính', en: 'How to count' }, p: { vi: 'Sinh 12/03/1995. Ngày: 1+2 = 3. Tháng: 3. Năm: 1+9+9+5 = 24 → 2+4 = 6. Cộng: 3+3+6 = 12 → 1+2 = 3. Số đường đời là 3. Tháng 11 và ngày 11, 22 giữ nguyên, không rút gọn.', en: 'Born 12/03/1995. Day: 1+2 = 3. Month: 3. Year: 1+9+9+5 = 24 → 2+4 = 6. Total: 3+3+6 = 12 → 1+2 = 3. Life path 3. Month 11 and days 11 and 22 stay as they are.' } },
    { h: { vi: 'Đọc thế nào', en: 'How to read it' }, p: { vi: 'Xem số như một chủ đề của đời bạn, không phải bản án. Số 1 học tự lập, số 2 học hợp tác, số 7 học tin người. Số bậc thầy 11, 22, 33 mang cả bài học của số rút gọn (2, 4, 6) cộng thêm áp lực lớn hơn.', en: 'Treat the number as a theme of your life, not a verdict. 1 learns independence, 2 learns cooperation, 7 learns trust. Master numbers 11, 22, 33 carry the lesson of their reduced digit (2, 4, 6) plus extra pressure.' } },
    { h: { vi: 'Nguồn', en: 'Source' }, p: { vi: 'Thần số học hiện đại đến từ L. Dow Balliett và Juno Jordan đầu thế kỷ 20, dựa trên ý tưởng gán số cho chữ của Pythagoras. Không có nghiên cứu nào chứng minh nó dự đoán được đời người; hãy dùng như một tấm gương để nghĩ về mình.', en: 'Modern numerology comes from L. Dow Balliett and Juno Jordan in the early 1900s, built on Pythagorean ideas of numbers and letters. No study shows it predicts a life; use it as a mirror for thinking about yourself.' } }
  ] },
{ id: 'fort-palm', cat: 'fortune', badge: 'conv', tags: ['fortune'],
  title: { vi: 'Xem chỉ tay cơ bản', en: 'Palm reading basics' },
  intro: { vi: 'Ba đường chính trên lòng bàn tay: đường tim, đường trí, đường sinh mệnh. Xem tay thuận là "hiện tại", tay kia là "bẩm sinh".', en: 'Three main lines on the palm: heart line, head line, life line. Read the dominant hand as "now" and the other as "given".' },
  sections: [
    { h: { vi: 'Đường tim', en: 'Heart line' }, p: { vi: 'Nằm trên cùng, chạy dưới các ngón. Cong và dài: cảm xúc cởi mở, thể hiện dễ. Thẳng và ngắn: kín đáo, thực tế trong tình yêu. Bắt đầu dưới ngón trỏ: kén chọn. Dưới ngón giữa: yêu bằng lý trí.', en: 'Topmost, running under the fingers. Curved and long: open, expressive feelings. Straight and short: private, practical in love. Starts under the index finger: selective. Under the middle finger: loves with the head.' } },
    { h: { vi: 'Đường trí', en: 'Head line' }, p: { vi: 'Ở giữa. Dài: nghĩ nhiều, phân tích. Ngắn: quyết nhanh, thực tế. Cong xuống: giàu tưởng tượng. Thẳng: logic. Tách rời đường sinh mệnh ở đầu: độc lập sớm.', en: 'In the middle. Long: thinks a lot, analytical. Short: decides fast, practical. Curving down: imaginative. Straight: logical. Separate from the life line at the start: independent early.' } },
    { h: { vi: 'Đường sinh mệnh', en: 'Life line' }, p: { vi: 'Vòng quanh gốc ngón cái. Nó không nói bạn sống bao lâu. Nó nói về sức sống và những thay đổi lớn: đứt đoạn hay rẽ nhánh thường là một lần đổi đời.', en: 'Curves around the base of the thumb. It does not say how long you live. It speaks of vitality and big changes: a break or a fork is usually a life change.' } },
    { h: { vi: 'Nguồn', en: 'Source' }, p: { vi: 'Xem chỉ tay có ở Ấn Độ, Trung Quốc và châu Âu từ hàng ngàn năm, mỗi nơi một cách. Bản trên là cách phổ thông ở phương Tây (Cheiro, cuối thế kỷ 19). Không có bằng chứng khoa học; hãy xem như trò chuyện về tính cách.', en: 'Palmistry exists in India, China and Europe going back thousands of years, each with its own rules. The version above is the common Western one (Cheiro, late 1800s). No scientific evidence; treat it as a conversation about character.' } }
  ] },
{ id: 'fort-playing', cat: 'fortune', badge: 'conv', tags: ['fortune', 'tarot'],
  title: { vi: 'Bói bài Tây 52 lá', en: 'Reading with playing cards' },
  intro: { vi: 'Bộ bài Tây là bộ tarot không có Ẩn Chính và không có Kỵ Sĩ. Biết tarot là bạn đọc được bài Tây.', en: 'A playing-card deck is a tarot deck without the Majors and without the Knights. If you know tarot, you can read playing cards.' },
  sections: [
    { h: { vi: 'Bốn chất', en: 'Four suits' }, p: { vi: 'Cơ = Cốc: tình cảm, gia đình. Rô = Tiền: tiền bạc, công việc. Chuồn = Gậy: hành động, kế hoạch, bạn bè. Bích = Kiếm: khó khăn, suy nghĩ, tin xấu.', en: 'Hearts = Cups: love, family. Diamonds = Pentacles: money, work. Clubs = Wands: action, plans, friends. Spades = Swords: trouble, thought, bad news.' } },
    { h: { vi: 'Số và hình', en: 'Numbers and faces' }, p: { vi: 'Át là khởi đầu của chất đó. 10 là kết thúc, trọn vẹn. J là người trẻ hoặc tin tức. Q là phụ nữ hoặc người chăm sóc. K là đàn ông hoặc người có quyền. Số nghĩa gần giống lá Ẩn Phụ cùng số.', en: 'Ace is the beginning of the suit. Ten is completion. Jack is a young person or news. Queen a woman or a carer. King a man or someone in authority. Numbers mean roughly what the same-numbered Minor means.' } },
    { h: { vi: 'Lenormand dùng chúng thế nào', en: 'How Lenormand uses them' }, p: { vi: 'Mỗi lá Lenormand in kèm một lá bài Tây từ bộ 36 lá (6 đến Át). Đó là tương ứng thật duy nhất của Lenormand, in trên bài từ 1799.', en: 'Each Lenormand card carries a playing card from the 36-card pack (6 to Ace). That is Lenormand\'s only real correspondence, printed on the cards since 1799.' } }
  ] },
{ id: 'fort-animals', cat: 'fortune', badge: 'doc', tags: ['fortune', 'astro'],
  title: { vi: '12 con giáp', en: 'The 12 zodiac animals' },
  intro: { vi: 'Mỗi năm âm lịch mang một con giáp, lặp lại sau 12 năm. App tính con giáp của bạn theo năm sinh ở mục Tôi.', en: 'Each lunar year carries an animal, repeating every 12 years. The app works out yours from your birth year under Me.' },
  sections: [
    { h: { vi: 'Lưu ý về Tết', en: 'The Tết boundary' }, p: { vi: 'Năm con giáp bắt đầu từ Tết, không phải 1/1. Sinh tháng 1 hoặc đầu tháng 2, bạn có thể thuộc con giáp của năm trước. App tính theo năm dương nên hãy kiểm lại nếu bạn sinh trước Tết.', en: 'The animal year starts at Lunar New Year, not 1 January. Born in January or early February, you may belong to the previous animal. The app counts by calendar year, so double-check if you were born before Tết.' } },
    { h: { vi: 'Đọc thế nào', en: 'How to read it' }, p: { vi: 'Con giáp là chuyện tính cách chung và "hợp tuổi" trong văn hóa. Nó là truyền thống lâu đời, không phải khoa học. Đừng để "khắc tuổi" quyết định chuyện cưới hỏi thay hai người trong cuộc.', en: 'Animals speak of general character and cultural "compatibility". It is a long tradition, not science. Do not let "clashing years" decide a marriage instead of the two people involved.' } },
    { h: { vi: 'Tử vi thì khác', en: 'Tử vi is different' }, p: { vi: 'Tử vi đẩu số cần giờ sinh và lập lá số 12 cung với hơn 100 sao. Đó là hệ thống riêng, sâu hơn nhiều so với con giáp. Nabu không xem tử vi trong app này.', en: 'Tử vi (Vietnamese astrology) needs the birth hour and builds a 12-palace chart with over 100 stars. It is a separate, much deeper system. Nabu does not offer tử vi in this app.' } }
  ] },
{ id: 'fort-tea', cat: 'fortune', badge: 'conv', tags: ['fortune'],
  title: { vi: 'Bói lá trà', en: 'Tea leaf reading' },
  intro: { vi: 'Bạn uống một tách trà lá gần cạn, xoay tách ba vòng, úp lên đĩa, rồi nhìn hình lá trà còn lại trong lòng tách. Cách xem này đến từ châu Âu thế kỷ 17, khi trà mới sang từ Trung Quốc.', en: 'Drink a cup of loose-leaf tea nearly to the bottom, swirl it three times, turn it onto the saucer, then read the shapes the leaves left inside. The practice comes from 17th-century Europe, when tea arrived from China.' },
  sections: [
    { h: { vi: 'Cách chuẩn bị', en: 'How to prepare' }, p: { vi: 'Dùng trà lá rời, không dùng túi lọc. Tách sáng màu, lòng tròn. Vừa uống vừa nghĩ về câu hỏi. Chừa lại một chút nước, xoay tách bằng tay trái ba vòng, úp nhanh lên đĩa, đợi vài giây rồi lật lên.', en: 'Use loose leaves, not a bag. A light-coloured, round cup. Think about your question while you drink. Leave a sip, swirl three times with your left hand, flip onto the saucer, wait a few seconds, turn it back.' } },
    { h: { vi: 'Đọc theo vị trí', en: 'Reading by position' }, p: { vi: 'Gần miệng tách: chuyện sắp tới. Giữa tách: vài tuần nữa. Đáy tách: xa hơn, hoặc chuyện gốc rễ. Gần quai: chuyện liên quan trực tiếp đến bạn. Đối diện quai: người khác, bên ngoài.', en: 'Near the rim: soon. Middle: a few weeks out. Bottom: further away, or the root of the matter. Near the handle: directly about you. Opposite the handle: other people, outside events.' } },
    { h: { vi: 'Vài hình thường gặp', en: 'Common shapes' }, p: { vi: 'Chim: tin tức. Tim: tình cảm. Nhẫn: cam kết, hôn nhân. Chìa khoá: cửa mở, cơ hội. Đường thẳng: chuyến đi. Cây: thành công dần dần. Mây: rối, chưa rõ. Chữ cái: tên một người. Số: ngày hoặc tháng.', en: 'Bird: news. Heart: love. Ring: commitment, marriage. Key: a door opening. Straight line: a journey. Tree: gradual success. Cloud: confusion. A letter: someone\'s name. A number: days or months.' } },
    { h: { vi: 'Đọc thế nào cho đúng tinh thần', en: 'The right spirit' }, p: { vi: 'Bói lá trà là cách kể chuyện qua hình ảnh, giống nhìn mây. Nó gợi ý, không phán. Hình bạn thấy đầu tiên thường là hình quan trọng nhất.', en: 'Tea leaves tell a story through pictures, like cloud-watching. They suggest; they do not rule. The shape you notice first is usually the one that matters.' } }
  ] },
{ id: 'fort-oracle', cat: 'fortune', badge: 'conv', tags: ['fortune', 'tarot'],
  title: { vi: 'Bài oracle và bài "Pick a Card"', en: 'Oracle decks and "Pick a Card"' },
  intro: { vi: 'Oracle là bộ bài tự do: số lá, hình, nghĩa do tác giả đặt. Không có cấu trúc chung như tarot. Nabu dùng oracle như lời nhắn thêm, luôn một lá, xào riêng.', en: 'An oracle deck is free-form: card count, images and meanings are the author\'s. No shared structure like tarot. Nabu uses oracle as an extra message, always one card, shuffled separately.' },
  sections: [
    { h: { vi: 'Pick a Card là gì', en: 'What a Pick a Card post is' }, p: { vi: 'Một thông điệp cho nhiều người. Người xem chọn một trong vài nhóm (số, hình, chữ cái). Nabu rút bài cho từng nhóm. Đây là bài chung, không phải bài riêng cho bạn: cái nào không khớp thì bỏ qua.', en: 'One message for many people. Viewers choose one of a few piles (numbers, images, letters). Nabu draws for each pile. It is a collective reading, not your personal one: skip what does not fit.' } },
    { h: { vi: 'Đọc dấu hiệu tên và cung', en: 'Initials and signs' }, p: { vi: 'Đọc chữ cái đầu tên từ lá bài không có nguồn gốc lịch sử nào; đó là hệ thống riêng của người đọc. Trong app này, các bài có ghi "dành cho bạn nếu…" là gợi ý của Nabu để bạn nhận ra mình, không phải dự đoán chắc chắn.', en: 'Reading name initials from cards has no historical basis; it is the reader\'s own system. In this app, posts marked "for you if…" are Nabu\'s hint to help you recognise yourself, not a firm prediction.' } }
  ] }
];
