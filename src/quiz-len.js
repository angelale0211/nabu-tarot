/* ==================== quiz bank: the Lenormand course ====================
   Five questions to a lesson, the correct option written first and shuffled on
   screen.

   The hard pair in each set leans on two things the app already carries and the
   lesson does not spell out: the playing-card inset printed on every Petit
   Lenormand card, and the grammar of the system - which card in a pair is the
   noun, how far a card sits from the significator, what a house is. These are
   the first things a Lenormand reader meets after the card list, and they are
   what separates reading Lenormand from reading tarot with different pictures. */

QUIZ.lenormand = {
  1: [
    { q: { vi: 'Bộ Petit Lenormand gồm bao nhiêu lá?', en: 'How many cards are in a Petit Lenormand deck?' },
      a: [{ vi: '36', en: '36' }, { vi: '78', en: '78' }, { vi: '52', en: '52' }, { vi: '22', en: '22' }],
      why: { vi: 'Đúng 36 lá, đánh số từ 1 tới 36.', en: 'Exactly 36, numbered 1 to 36.' } },
    { q: { vi: 'Trong lối đọc Lenormand truyền thống, một lá đứng một mình có ý nghĩa đầy đủ không?', en: 'In traditional Lenormand, does a single card carry a complete meaning on its own?' },
      a: [{ vi: 'Không — lá chỉ có nghĩa khi ghép với lá bên cạnh', en: 'No — a card takes its meaning from the card beside it' }, { vi: 'Có — mỗi lá là một lời khuyên trọn vẹn', en: 'Yes — each card is a complete piece of advice' }, { vi: 'Có, nếu đó là lá số lẻ', en: 'Yes, if it is an odd-numbered card' }, { vi: 'Chỉ khi lá đó bị ngược', en: 'Only when the card is reversed' }],
      why: { vi: 'Lenormand đọc thành câu. Một lá là một từ; nghĩa nằm ở chỗ các từ đứng cạnh nhau.', en: 'Lenormand is read as a sentence. One card is one word; the meaning lives in how the words sit together.' } },
    { q: { vi: 'Lenormand có dùng lá ngược không?', en: 'Does Lenormand use reversed cards?' },
      a: [{ vi: 'Không, theo truyền thống thì không', en: 'No, not in the tradition' }, { vi: 'Có, giống hệt tarot', en: 'Yes, exactly as in tarot' }, { vi: 'Chỉ với các lá người', en: 'Only with the people cards' }, { vi: 'Chỉ trong Grand Tableau', en: 'Only in the Grand Tableau' }],
      why: { vi: 'Lá ngược không thuộc hệ Lenormand. Sắc thái tốt hay xấu đến từ các lá đứng quanh nó.', en: 'Reversals are not part of the system. Whether a card reads well or badly comes from its neighbours.' } },
    { hard: true,
      q: { vi: 'Bộ 36 lá Lenormand bắt nguồn từ bộ bài Tây rút gọn. Những lá số nào đã bị bỏ đi?', en: 'The 36-card deck comes from a shortened pack of playing cards. Which pips were removed?' },
      a: [{ vi: 'Các lá 2, 3, 4 và 5 của cả bốn chất', en: 'The 2, 3, 4 and 5 of every suit' }, { vi: 'Các lá 6, 7, 8 và 9 của cả bốn chất', en: 'The 6, 7, 8 and 9 of every suit' }, { vi: 'Toàn bộ chất Bích', en: 'The whole spade suit' }, { vi: 'Các lá hình', en: 'All the court cards' }],
      why: { vi: 'Bỏ 2, 3, 4 và 5 của mỗi chất khỏi bộ 52 lá thì còn 36 lá — đúng bằng bộ piquet, và đúng bằng số lá Lenormand.', en: 'Take the 2, 3, 4 and 5 out of each suit of a 52-card pack and 36 remain — a piquet deck, and exactly the number of Lenormand cards.' } },
    { hard: true,
      q: { vi: 'Trên mỗi lá Petit Lenormand thường in kèm một hình nhỏ. Đó là hình gì?', en: 'A small inset is printed on most Petit Lenormand cards. What does it show?' },
      a: [{ vi: 'Lá bài Tây tương ứng với lá đó', en: 'The playing card that belongs to it' }, { vi: 'Cung hoàng đạo của lá đó', en: 'Its zodiac sign' }, { vi: 'Số thứ tự viết bằng chữ La Mã', en: 'Its number in Roman figures' }, { vi: 'Lá tarot tương ứng', en: 'Its matching tarot card' }],
      why: { vi: 'Mỗi lá mang một lá bài Tây: Kỵ Mã là 9 Cơ, Trái Tim là J Cơ, và Người Đàn Ông là Át Cơ. Bạn xem lại ở trang của từng lá.', en: 'Every card carries a playing card: the Rider is the Nine of Hearts, the Heart is the Jack of Hearts, the Man is the Ace of Hearts. Each card page shows it.' } }
  ],
  2: [
    { q: { vi: 'Lá số 1 của bộ Lenormand là lá nào?', en: 'Which card is number 1 in the Lenormand deck?' },
      a: [{ vi: 'Kỵ Mã', en: 'The Rider' }, { vi: 'Cỏ Ba Lá', en: 'The Clover' }, { vi: 'Con Thuyền', en: 'The Ship' }, { vi: 'Ngôi Nhà', en: 'The House' }],
      why: { vi: 'Kỵ Mã mở đầu bộ bài, và nó nói về tin tức đang trên đường tới.', en: 'The Rider opens the deck, and it speaks of news on its way.' } },
    { q: { vi: 'Lá Ngôi Nhà (số 4) nói về điều gì?', en: 'What does the House (4) speak of?' },
      a: [{ vi: 'Gia đình, nơi ở và sự ổn định', en: 'Family, home and stability' }, { vi: 'Một chuyến đi xa', en: 'A journey far away' }, { vi: 'Một khoản tiền lớn', en: 'A large sum of money' }, { vi: 'Một lời nói dối', en: 'A lie' }],
      why: { vi: 'Ngôi Nhà là mái nhà, người trong nhà và những gì bền vững.', en: 'The House is the roof, the people under it, and what is built to last.' } },
    { q: { vi: 'Lá Mây (số 6) mang sắc thái gì?', en: 'What tone does the Clouds (6) carry?' },
      a: [{ vi: 'Sự mù mờ và nghi ngờ', en: 'Confusion and doubt' }, { vi: 'Niềm vui trọn vẹn', en: 'Complete joy' }, { vi: 'Sự chắc chắn', en: 'Certainty' }, { vi: 'Một món quà', en: 'A gift' }],
      why: { vi: 'Mây làm mờ thứ nó che. Bên nào của lá quay về đâu cũng có ý nghĩa trong nhiều dòng truyền thống.', en: 'Clouds obscure whatever they sit over. In many traditions even which way they face carries meaning.' } },
    { hard: true,
      q: { vi: 'Lá Kỵ Mã mang lá bài Tây nào?', en: 'Which playing card belongs to the Rider?' },
      a: [{ vi: '9 Cơ', en: 'The Nine of Hearts' }, { vi: 'Át Cơ', en: 'The Ace of Hearts' }, { vi: 'J Chuồn', en: 'The Jack of Clubs' }, { vi: '10 Bích', en: 'The Ten of Spades' }],
      why: { vi: 'Kỵ Mã là 9 Cơ. Trong bói bài Tây, 9 Cơ là lá điều ước — nên Kỵ Mã mang tin lành đang tới.', en: 'The Rider is the Nine of Hearts. In cartomancy the Nine of Hearts is the wish card, which is why the Rider brings news you want.' } },
    { hard: true,
      q: { vi: 'Lá Rắn (số 7) và lá Cáo (số 14) khác nhau ở chỗ nào?', en: 'What separates the Snake (7) from the Fox (14)?' },
      a: [{ vi: 'Rắn là một người hoặc một chuyện phức tạp; Cáo là sự khôn lỏi và chuyện công việc', en: 'The Snake is a person or a complication; the Fox is cunning and matters of work' }, { vi: 'Rắn nói về tiền, Cáo nói về tình', en: 'The Snake is money, the Fox is love' }, { vi: 'Hai lá có nghĩa hoàn toàn giống nhau', en: 'They mean exactly the same thing' }, { vi: 'Rắn luôn tốt, Cáo luôn xấu', en: 'The Snake is always good, the Fox always bad' }],
      why: { vi: 'Cả hai đều cảnh báo, nhưng khác hướng: Rắn là đường vòng và người không thẳng thắn, còn Cáo là sự tính toán, thường gắn với công việc.', en: 'Both warn, but differently: the Snake is a detour and someone not straight with you, the Fox is calculation, and it usually concerns work.' } }
  ],
  3: [
    { q: { vi: 'Lá số 24 là lá nào?', en: 'Which card is number 24?' },
      a: [{ vi: 'Trái Tim', en: 'The Heart' }, { vi: 'Chiếc Nhẫn', en: 'The Ring' }, { vi: 'Ngôi Sao', en: 'The Stars' }, { vi: 'Con Chó', en: 'The Dog' }],
      why: { vi: 'Trái Tim là số 24, và đó là lá của tình cảm.', en: 'The Heart is 24, and it is the card of love.' } },
    { q: { vi: 'Lá Con Chó (số 18) nói về điều gì?', en: 'What does the Dog (18) speak of?' },
      a: [{ vi: 'Một người bạn và lòng trung thành', en: 'A friend, and loyalty' }, { vi: 'Một kẻ thù', en: 'An enemy' }, { vi: 'Một khoản nợ', en: 'A debt' }, { vi: 'Một chuyến đi', en: 'A journey' }],
      why: { vi: 'Con Chó là người ở lại bên bạn: bạn bè, người đáng tin.', en: 'The Dog is the one who stays: a friend, someone to be trusted.' } },
    { q: { vi: 'Lá Ngọn Núi (số 21) mang ý gì?', en: 'What does the Mountain (21) carry?' },
      a: [{ vi: 'Một trở ngại và sự chậm trễ', en: 'An obstacle, and delay' }, { vi: 'Một tin vui', en: 'Good news' }, { vi: 'Một cuộc gặp đông người', en: 'A crowded gathering' }, { vi: 'Một lời hứa', en: 'A promise' }],
      why: { vi: 'Ngọn Núi chặn đường. Nó không nói không, nó nói chưa và nói khó.', en: 'The Mountain blocks the road. It does not say no; it says not yet, and not easily.' } },
    { hard: true,
      q: { vi: 'Hai lá nào trong bộ Lenormand thường được dùng làm lá đại diện cho người hỏi?', en: 'Which two cards are traditionally used to stand for the querent?' },
      a: [{ vi: 'Người Đàn Ông (28) và Người Phụ Nữ (29)', en: 'The Man (28) and the Woman (29)' }, { vi: 'Trái Tim (24) và Chiếc Nhẫn (25)', en: 'The Heart (24) and the Ring (25)' }, { vi: 'Kỵ Mã (1) và Lá Thư (27)', en: 'The Rider (1) and the Letter (27)' }, { vi: 'Mặt Trời (31) và Mặt Trăng (32)', en: 'The Sun (31) and the Moon (32)' }],
      why: { vi: 'Người Đàn Ông và Người Phụ Nữ là hai lá đại diện. Vị trí của chúng trong Grand Tableau quyết định phần lớn cách đọc.', en: 'The Man and the Woman are the significators. Where they fall in a Grand Tableau decides most of how it is read.' } },
    { hard: true,
      q: { vi: 'Lá Trái Tim mang lá bài Tây nào?', en: 'Which playing card belongs to the Heart?' },
      a: [{ vi: 'J Cơ', en: 'The Jack of Hearts' }, { vi: 'Át Cơ', en: 'The Ace of Hearts' }, { vi: 'K Cơ', en: 'The King of Hearts' }, { vi: 'Q Cơ', en: 'The Queen of Hearts' }],
      why: { vi: 'Trái Tim là J Cơ. Át Cơ thuộc về Người Đàn Ông, K Cơ thuộc về Ngôi Nhà, còn Q Cơ thuộc về Con Cò.', en: 'The Heart is the Jack of Hearts. The Ace of Hearts belongs to the Man, the King to the House and the Queen to the Stork.' } }
  ],
  4: [
    { q: { vi: 'Lá số 25 là lá nào?', en: 'Which card is number 25?' },
      a: [{ vi: 'Chiếc Nhẫn', en: 'The Ring' }, { vi: 'Quyển Sách', en: 'The Book' }, { vi: 'Lá Thư', en: 'The Letter' }, { vi: 'Hoa Huệ', en: 'The Lily' }],
      why: { vi: 'Chiếc Nhẫn là số 25: cam kết, hợp đồng, một vòng khép kín.', en: 'The Ring is 25: commitment, a contract, a closed circle.' } },
    { q: { vi: 'Lá Quyển Sách (số 26) nói về điều gì?', en: 'What does the Book (26) speak of?' },
      a: [{ vi: 'Một điều còn giữ kín, hoặc việc học', en: 'Something kept secret, or study' }, { vi: 'Một chuyến đi biển', en: 'A voyage' }, { vi: 'Một cuộc cãi vã', en: 'A quarrel' }, { vi: 'Một đám đông', en: 'A crowd' }],
      why: { vi: 'Quyển Sách đóng lại là bí mật, mở ra là kiến thức. Lá bên cạnh cho biết nó đang đóng hay mở.', en: 'Closed, the Book is a secret; open, it is knowledge. The neighbouring card says which.' } },
    { q: { vi: 'Lá cuối cùng của bộ bài, số 36, là lá nào?', en: 'Which card closes the deck at number 36?' },
      a: [{ vi: 'Cây Thánh Giá', en: 'The Cross' }, { vi: 'Mỏ Neo', en: 'The Anchor' }, { vi: 'Con Cá', en: 'The Fish' }, { vi: 'Chiếc Chìa Khoá', en: 'The Key' }],
      why: { vi: 'Cây Thánh Giá là lá số 36: gánh nặng, thử thách, điều phải đi qua.', en: 'The Cross is 36: a burden, a trial, something to be gone through.' } },
    { hard: true,
      q: { vi: 'Trong một câu hỏi có/không, lá nào được xem là lá “có” rõ ràng nhất?', en: 'In a yes-or-no question, which card reads as the clearest yes?' },
      a: [{ vi: 'Chiếc Chìa Khoá (33)', en: 'The Key (33)' }, { vi: 'Con Cá (34)', en: 'The Fish (34)' }, { vi: 'Mặt Trăng (32)', en: 'The Moon (32)' }, { vi: 'Quyển Sách (26)', en: 'The Book (26)' }],
      why: { vi: 'Chiếc Chìa Khoá là lá của sự chắc chắn: nó mở cửa và nó xác nhận. Nhiều người đọc coi đây là lá “có” mạnh nhất trong bộ.', en: 'The Key is the card of certainty: it opens, and it confirms. Most readers treat it as the strongest yes in the deck.' } },
    { hard: true,
      q: { vi: 'Lá Con Cá (34) và lá Mỏ Neo (35) khác nhau thế nào khi nói về công việc?', en: 'On the subject of work, how do the Fish (34) and the Anchor (35) differ?' },
      a: [{ vi: 'Con Cá là dòng tiền và việc kinh doanh; Mỏ Neo là công việc ổn định và sự bám trụ', en: 'The Fish is money moving and business; the Anchor is steady work and holding fast' }, { vi: 'Con Cá là thất nghiệp; Mỏ Neo là thăng chức', en: 'The Fish is unemployment; the Anchor is promotion' }, { vi: 'Hai lá có nghĩa như nhau', en: 'They mean the same thing' }, { vi: 'Con Cá nói về sức khỏe; Mỏ Neo nói về tình cảm', en: 'The Fish is health; the Anchor is love' }],
      why: { vi: 'Con Cá chảy: tiền vào, tiền ra, việc buôn bán. Mỏ Neo giữ lại: chỗ làm lâu dài, điều không dời đi.', en: 'The Fish flows: money in, money out, trade. The Anchor holds: the long job, the thing that does not move.' } }
  ],
  5: [
    { q: { vi: 'Khi đọc hai lá, lá đứng trước thường đóng vai gì?', en: 'When two cards are read together, what part does the first one play?' },
      a: [{ vi: 'Chủ thể — điều đang được nói tới', en: 'The subject — the thing being spoken about' }, { vi: 'Kết quả cuối cùng', en: 'The final outcome' }, { vi: 'Người hỏi, luôn luôn', en: 'The querent, always' }, { vi: 'Thời gian xảy ra', en: 'The timing' }],
      why: { vi: 'Lá trước là danh từ, lá sau mô tả nó. Đổi thứ tự thì đổi nghĩa: Trái Tim + Con Cá khác Con Cá + Trái Tim.', en: 'The first card is the noun and the second describes it. Swap them and the meaning changes: Heart + Fish is not Fish + Heart.' } },
    { q: { vi: 'Khi đọc ba lá, lá ở giữa thường giữ vai trò gì?', en: 'In a three-card line, what does the middle card usually hold?' },
      a: [{ vi: 'Chủ đề chính, được hai lá kia làm rõ', en: 'The main subject, with the other two qualifying it' }, { vi: 'Điều đã qua', en: 'What is already past' }, { vi: 'Lời khuyên', en: 'The advice' }, { vi: 'Điều nên tránh', en: 'What to avoid' }],
      why: { vi: 'Trong lối đọc Lenormand, lá giữa là trung tâm câu, còn hai lá bên là những gì tô cho nó.', en: 'In Lenormand the middle card is the centre of the sentence and the two beside it colour it.' } },
    { q: { vi: 'Ghép Mây (6) với Con Cá (34) hợp lý nhất là gì?', en: 'What is the most sensible reading of Clouds (6) with Fish (34)?' },
      a: [{ vi: 'Chuyện tiền bạc đang không rõ ràng', en: 'Money matters that are not clear' }, { vi: 'Một chuyến đi biển vui vẻ', en: 'A happy sea voyage' }, { vi: 'Một đám cưới', en: 'A wedding' }, { vi: 'Một người bạn thân', en: 'A close friend' }],
      why: { vi: 'Mây làm mờ thứ nó đứng cạnh, và Con Cá là tiền. Ghép lại: tài chính mù mờ, hoặc thu nhập chưa chắc chắn.', en: 'Clouds obscure whatever they stand next to, and the Fish is money. Together: unclear finances, or income you cannot count on.' } },
    { hard: true,
      q: { vi: 'Vì sao không nên đọc một lá Lenormand theo kiểu “lá này khuyên bạn nên…”?', en: 'Why is “this card advises you to…” the wrong way to read a Lenormand card?' },
      a: [{ vi: 'Vì Lenormand mô tả tình huống chứ không đưa lời khuyên', en: 'Because Lenormand describes a situation rather than giving advice' }, { vi: 'Vì lá bài luôn nói ngược lại', en: 'Because the cards always mean the opposite' }, { vi: 'Vì chỉ lá ngược mới khuyên được', en: 'Because only reversed cards can advise' }, { vi: 'Vì phải có ít nhất chín lá', en: 'Because you need at least nine cards' }],
      why: { vi: 'Đây là khác biệt lớn nhất với tarot. Lenormand trả lời “việc gì đang xảy ra”, không trả lời “bạn nên cảm thấy thế nào”. Lời khuyên là do người đọc rút ra, không phải do lá bài nói.', en: 'This is the sharpest difference from tarot. Lenormand answers what is happening, not how you should feel about it. Any advice is the reader\'s, not the card\'s.' } },
    { hard: true,
      q: { vi: 'Khi một lá người (28 hoặc 29) quay mặt về phía một lá khác, điều đó thường được đọc là gì?', en: 'When a people card (28 or 29) faces towards another card, how is that usually read?' },
      a: [{ vi: 'Người ấy đang hướng về điều đó; điều sau lưng là đã qua', en: 'They are turned towards it; what lies behind them is past' }, { vi: 'Người ấy đang tránh điều đó', en: 'They are avoiding it' }, { vi: 'Không có ý nghĩa gì', en: 'It carries no meaning' }, { vi: 'Lá đó phải bỏ ra khỏi trải bài', en: 'That card must be taken out of the spread' }],
      why: { vi: 'Hướng nhìn là một phần ngữ pháp của Lenormand: cái người ấy nhìn về là điều đang tới, cái ở sau lưng là điều đã ở lại.', en: 'Facing is part of Lenormand grammar: what a figure looks towards is what is coming, and what sits behind them is what has been left.' } }
  ],
  6: [
    { q: { vi: 'Grand Tableau dùng bao nhiêu lá?', en: 'How many cards does a Grand Tableau use?' },
      a: [{ vi: 'Toàn bộ 36 lá', en: 'All 36' }, { vi: '9 lá', en: '9' }, { vi: '10 lá', en: '10' }, { vi: '21 lá', en: '21' }],
      why: { vi: 'Grand Tableau trải cả bộ bài, thường là bốn hàng chín lá, hoặc bốn hàng tám lá cộng bốn lá cuối.', en: 'The Grand Tableau lays the whole deck, usually four rows of nine, or four rows of eight with the last four beneath.' } },
    { q: { vi: 'Việc đầu tiên cần làm khi đọc một Grand Tableau là gì?', en: 'What is the first thing to do when reading a Grand Tableau?' },
      a: [{ vi: 'Tìm lá đại diện cho người hỏi', en: 'Find the card that stands for the querent' }, { vi: 'Đếm số lá đỏ', en: 'Count the red cards' }, { vi: 'Lật lá cuối cùng lên trước', en: 'Turn the last card over first' }, { vi: 'Bỏ các lá xấu ra', en: 'Take the difficult cards out' }],
      why: { vi: 'Mọi thứ được đọc quanh lá đại diện: cái gì gần, cái gì ở trên, cái gì người ấy đang nhìn về.', en: 'Everything is read around the significator: what is near it, what is above it, what it looks towards.' } },
    { q: { vi: 'Trải ba lá trong Lenormand trả lời tốt nhất loại câu hỏi nào?', en: 'What kind of question does a three-card Lenormand line answer best?' },
      a: [{ vi: 'Một câu hỏi hẹp và cụ thể', en: 'A narrow, specific one' }, { vi: 'Một câu hỏi về cả cuộc đời', en: 'One about a whole life' }, { vi: 'Một câu hỏi không có chủ đề', en: 'One with no subject at all' }, { vi: 'Chỉ câu hỏi về tiền', en: 'Only questions about money' }],
      why: { vi: 'Ba lá là một câu ngắn, nên câu hỏi cũng phải ngắn. Câu hỏi rộng thì cần trải rộng.', en: 'Three cards make a short sentence, so the question has to be short too. A wide question needs a wide spread.' } },
    { hard: true,
      q: { vi: 'Trong Grand Tableau, “nhà” (house) của một vị trí nghĩa là gì?', en: 'In a Grand Tableau, what is meant by the “house” of a position?' },
      a: [{ vi: 'Ý nghĩa cố định gắn với vị trí đó, đánh số từ 1 tới 36', en: 'The fixed meaning attached to that position, numbered 1 to 36' }, { vi: 'Lá Ngôi Nhà, số 4', en: 'The House card, number 4' }, { vi: 'Hàng thứ tư của trải bài', en: 'The fourth row of the layout' }, { vi: 'Lá nằm ngay dưới lá đại diện', en: 'The card directly under the significator' }],
      why: { vi: 'Mỗi ô trong Grand Tableau mang sẵn một ý nghĩa theo số thứ tự của nó. Lá rơi vào ô số 24 là chuyện tình cảm, dù lá ấy là lá gì. Ô là câu hỏi, lá là câu trả lời.', en: 'Every slot in the Grand Tableau carries a meaning of its own by its number. A card landing in slot 24 concerns love, whatever card it is. The slot asks; the card answers.' } },
    { hard: true,
      q: { vi: 'Trong Grand Tableau, khoảng cách giữa một lá và lá đại diện cho biết điều gì?', en: 'In a Grand Tableau, what does the distance between a card and the significator tell you?' },
      a: [{ vi: 'Càng gần thì càng sớm và càng quan trọng', en: 'The closer it lies, the sooner and the more it matters' }, { vi: 'Càng gần thì càng ít quan trọng', en: 'The closer it lies, the less it matters' }, { vi: 'Khoảng cách không có ý nghĩa', en: 'Distance carries no meaning' }, { vi: 'Chỉ khoảng cách theo hàng ngang mới tính', en: 'Only distance along the row counts' }],
      why: { vi: 'Đây là “phép khoảng cách”: lá kề bên nói chuyện đang xảy ra, lá ở cuối bàn nói chuyện xa hoặc chuyện nhỏ. Kề theo đường chéo cũng tính là kề.', en: 'This is the distance method: a card touching the significator is happening now, a card across the table is far off or slight. Diagonal touching counts as touching.' } }
  ]
};
