/* ==================== quiz bank: the cartomancy course ====================
   Five questions to a lesson, the correct option written first and shuffled on
   screen.

   The hard pair in each set is drawn from what the course itself carries but
   states in passing: the tarot twin of each suit, the season each suit rules,
   the two nines that decide a wish, and the rule that the unit of time must be
   fixed before the cards are shuffled rather than after they are seen. All of
   it can be checked on the course pages. */

QUIZ.playing = {
  1: [
    { q: { vi: 'Bộ bài Tây có bao nhiêu lá?', en: 'How many cards are in a pack of playing cards?' },
      a: [{ vi: '52', en: '52' }, { vi: '36', en: '36' }, { vi: '78', en: '78' }, { vi: '54', en: '54' }],
      why: { vi: '52 lá: bốn chất, mỗi chất mười ba lá.', en: '52: four suits of thirteen.' } },
    { q: { vi: 'Chất Cơ nói về điều gì?', en: 'What does the suit of Hearts speak of?' },
      a: [{ vi: 'Tình cảm, gia đình và niềm vui', en: 'Love, family and joy' }, { vi: 'Tiền bạc và tin tức', en: 'Money and news' }, { vi: 'Việc làm và may mắn', en: 'Work and luck' }, { vi: 'Thử thách và lo âu', en: 'Challenges and worry' }],
      why: { vi: 'Cơ là chất của tình cảm và của những người bạn yêu.', en: 'Hearts is the suit of feeling and of the people you care for.' } },
    { q: { vi: 'Chất Bích nói về điều gì?', en: 'What does the suit of Spades speak of?' },
      a: [{ vi: 'Thử thách, lo âu và quyết định khó', en: 'Challenges, worry and hard decisions' }, { vi: 'Tình cảm và gia đình', en: 'Love and family' }, { vi: 'Tiền bạc', en: 'Money' }, { vi: 'Bạn bè', en: 'Friends' }],
      why: { vi: 'Bích là chất nặng nhất: tin không vui, lo lắng, và những việc phải cân nhắc.', en: 'Spades is the heaviest suit: unwelcome news, worry, and things that must be weighed.' } },
    { hard: true,
      q: { vi: 'Chất Rô tương ứng với chất nào trong tarot?', en: 'Which tarot suit is the twin of Diamonds?' },
      a: [{ vi: 'Tiền', en: 'Pentacles' }, { vi: 'Gậy', en: 'Wands' }, { vi: 'Cốc', en: 'Cups' }, { vi: 'Kiếm', en: 'Swords' }],
      why: { vi: 'Rô ứng với Tiền, tức đất và chuyện vật chất. Chuồn ứng với Gậy, Cơ ứng với Cốc, Bích ứng với Kiếm.', en: 'Diamonds answers to Pentacles: earth and material things. Clubs is Wands, Hearts is Cups, Spades is Swords.' } },
    { hard: true,
      q: { vi: 'Bài Tây có 12 lá hình, còn tarot có 16 lá hoàng gia. Vì sao lại lệch bốn lá?', en: 'A playing pack has 12 court cards, tarot has 16. Where do the four extra come from?' },
      a: [{ vi: 'Tarot có thêm một thứ bậc là Hiệp Sĩ', en: 'Tarot keeps a fourth rank, the Knight' }, { vi: 'Tarot có năm chất', en: 'Tarot has five suits' }, { vi: 'Bài Tây bỏ mất bốn lá Át', en: 'The playing pack has lost its four Aces' }, { vi: 'Tarot đếm cả hai lá Joker', en: 'Tarot counts the two Jokers' }],
      why: { vi: 'Bài Tây giữ ba thứ bậc: J, Q, K. Tarot giữ bốn: Tiểu Đồng, Hiệp Sĩ, Hoàng Hậu, Vua. Chính lá Hiệp Sĩ đã rơi mất khi bộ bài đi vào lối chơi bài Tây.', en: 'The playing pack keeps three ranks: Jack, Queen, King. Tarot keeps four: Page, Knight, Queen, King. It is the Knight that fell away as the pack became a gaming deck.' } }
  ],
  2: [
    { q: { vi: 'Lá Át mang ý gì trong dãy số?', en: 'What does the Ace carry in the run of numbers?' },
      a: [{ vi: 'Hạt giống của chất, điều tinh khiết nhất vừa xuất hiện', en: 'The seed of the suit, its purest form just appearing' }, { vi: 'Kết quả cuối cùng', en: 'The final outcome' }, { vi: 'Một người trưởng thành', en: 'A grown person' }, { vi: 'Một khoảng thời gian dài', en: 'A long stretch of time' }],
      why: { vi: 'Át là khởi đầu: chất ấy ở dạng thuần nhất, chưa pha gì.', en: 'The Ace is the beginning: the suit in its purest form, not yet mixed with anything.' } },
    { q: { vi: 'Lá Mười mang ý gì?', en: 'What does the Ten carry?' },
      a: [{ vi: 'Chất ấy ở mức đầy nhất', en: 'The suit at its fullest' }, { vi: 'Một khởi đầu mới', en: 'A fresh start' }, { vi: 'Một lời nhắn', en: 'A message' }, { vi: 'Một sự do dự', en: 'Hesitation' }],
      why: { vi: 'Mười là điểm cuối của dãy: hạnh phúc trọn với Cơ, tiền lớn với Rô, thành công với Chuồn, kết thúc với Bích.', en: 'The Ten ends the run: full happiness in Hearts, big money in Diamonds, success in Clubs, an ending in Spades.' } },
    { q: { vi: 'Số nào phá vỡ thế yên của số Bốn?', en: 'Which number breaks the calm of the Four?' },
      a: [{ vi: 'Năm', en: 'The Five' }, { vi: 'Sáu', en: 'The Six' }, { vi: 'Bảy', en: 'The Seven' }, { vi: 'Tám', en: 'The Eight' }],
      why: { vi: 'Bốn là nền móng; Năm làm nó rung: xáo trộn, tranh cãi hoặc một quyết định. Sáu sửa lại sau đó.', en: 'The Four is a foundation; the Five shakes it: disruption, argument, a decision. The Six repairs afterwards.' } },
    { hard: true,
      q: { vi: 'Trong bói bài Tây, lá nào được gọi là lá điều ước?', en: 'In cartomancy, which card is known as the wish card?' },
      a: [{ vi: 'Chín Cơ', en: 'The Nine of Hearts' }, { vi: 'Chín Rô', en: 'The Nine of Diamonds' }, { vi: 'Át Cơ', en: 'The Ace of Hearts' }, { vi: 'Mười Cơ', en: 'The Ten of Hearts' }],
      why: { vi: 'Chín Cơ là lá điều ước. Ở chất Bích, chính lá Chín lại là lá thất vọng — cùng một con số, hai đầu đối nhau.', en: 'The Nine of Hearts is the wish card. In Spades the same number is the card of disappointment: one number, two opposite ends.' } },
    { hard: true,
      q: { vi: 'Lá Chín Bích mang ý gì?', en: 'What does the Nine of Spades carry?' },
      a: [{ vi: 'Thất vọng, lo âu, chưa phải lúc', en: 'Disappointment, worry, not now' }, { vi: 'Một chuyến đi vui', en: 'A happy journey' }, { vi: 'Một khoản tiền', en: 'A sum of money' }, { vi: 'Một đám cưới', en: 'A wedding' }],
      why: { vi: 'Chín Bích là lá thất vọng, và trong trải bài điều ước nó có nghĩa là chưa phải lúc.', en: 'The Nine of Spades is the card of disappointment, and in the wish spread it means not now.' } }
  ],
  3: [
    { q: { vi: 'Át Cơ thường gợi tới điều gì?', en: 'What does the Ace of Hearts traditionally suggest?' },
      a: [{ vi: 'Một khởi đầu về tình cảm, mái ấm hoặc chuyện của trái tim', en: 'An emotional beginning, home or a new matter of the heart' }, { vi: 'Một kết thúc dứt khoát', en: 'A final ending' }, { vi: 'Một chuyện pháp lý', en: 'A legal dispute' }, { vi: 'Một chuyến đi vì công việc', en: 'A journey for work' }],
      why: { vi: 'Át mở đầu chất Cơ: cảm xúc, mái ấm và những điều thuộc về tình cảm bắt đầu hoặc được chú ý trở lại.', en: 'The Ace opens the Hearts suit: feelings, home and relationship matters begin or receive fresh attention.' } },
    { q: { vi: 'Lá Mười Cơ báo điều gì?', en: 'What does the Ten of Hearts announce?' },
      a: [{ vi: 'Hạnh phúc trọn vẹn', en: 'Full happiness' }, { vi: 'Một kết thúc', en: 'An ending' }, { vi: 'Một khoản nợ', en: 'A debt' }, { vi: 'Một cuộc cãi vã', en: 'A quarrel' }],
      why: { vi: 'Mười là chất ở mức đầy nhất, và chất ấy là tình cảm.', en: 'The Ten is the suit at its fullest, and the suit is love.' } },
    { q: { vi: 'Cặp Q Cơ đi cùng K Cơ thường được đọc là gì?', en: 'What does the Queen of Hearts beside the King of Hearts usually read as?' },
      a: [{ vi: 'Một cặp đôi, hôn nhân, gia đình yên ấm', en: 'A couple, a marriage, a settled home' }, { vi: 'Hai người xa lạ', en: 'Two strangers' }, { vi: 'Một cuộc chia tay', en: 'A parting' }, { vi: 'Một chuyến đi', en: 'A journey' }],
      why: { vi: 'Hai lá hình cùng chất Cơ đứng cạnh nhau là hình ảnh của một đôi và một mái nhà yên.', en: 'Two Hearts court cards side by side are the picture of a pair and a settled home.' } },
    { hard: true,
      q: { vi: 'Chất Cơ ứng với mùa nào?', en: 'Which season belongs to Hearts?' },
      a: [{ vi: 'Mùa xuân', en: 'Spring' }, { vi: 'Mùa hè', en: 'Summer' }, { vi: 'Mùa thu', en: 'Autumn' }, { vi: 'Mùa đông', en: 'Winter' }],
      why: { vi: 'Cơ là xuân, Chuồn là hè, Rô là thu, Bích là đông. Đây là cách tính mùa dùng trong khoá học này.', en: 'Hearts is spring, Clubs summer, Diamonds autumn, Spades winter. That is the scheme this course uses.' } },
    { hard: true,
      q: { vi: 'Cặp Át Cơ đi cùng Chín Cơ báo điều gì?', en: 'What do the Ace of Hearts and the Nine of Hearts announce together?' },
      a: [{ vi: 'Một điều ước thành sự thật, niềm vui trong nhà', en: 'A wish coming true, happiness at home' }, { vi: 'Một khoản tiền lớn', en: 'A large sum of money' }, { vi: 'Một chuyến đi công tác', en: 'A journey for work' }, { vi: 'Một kết thúc lớn', en: 'A big ending' }],
      why: { vi: 'Át Cơ là mái nhà và khởi đầu của tình cảm; Chín Cơ là điều ước. Ghép lại là điều mong đã tới.', en: 'The Ace of Hearts is the home and the start of feeling; the Nine is the wish. Together: the thing hoped for has arrived.' } }
  ],
  4: [
    { q: { vi: 'Chất Rô nói về điều gì?', en: 'What does the suit of Diamonds speak of?' },
      a: [{ vi: 'Tiền bạc, công việc và tin tức', en: 'Money, work and news' }, { vi: 'Tình cảm', en: 'Love' }, { vi: 'Bạn bè và may mắn', en: 'Friends and luck' }, { vi: 'Bệnh tật', en: 'Illness' }],
      why: { vi: 'Rô là chất của chuyện thực tế: tiền, giấy tờ và tin tức.', en: 'Diamonds is the practical suit: money, paperwork and news.' } },
    { q: { vi: 'Lá Mười Rô báo điều gì?', en: 'What does the Ten of Diamonds announce?' },
      a: [{ vi: 'Một khoản tiền lớn', en: 'Big money' }, { vi: 'Một lời hứa', en: 'A promise' }, { vi: 'Một cuộc chia tay', en: 'A parting' }, { vi: 'Một giấc mơ', en: 'A dream' }],
      why: { vi: 'Mười là chất ở mức đầy nhất, và chất ấy là tiền.', en: 'The Ten is the suit at its fullest, and the suit is money.' } },
    { q: { vi: 'Lá J Rô thường chỉ điều gì?', en: 'What does the Jack of Diamonds usually point to?' },
      a: [{ vi: 'Một người trẻ hoặc một tin nhắn về chuyện tiền bạc', en: 'A young person, or a message about money' }, { vi: 'Một người lớn tuổi có quyền', en: 'An older person in authority' }, { vi: 'Một khoản thừa kế', en: 'An inheritance' }, { vi: 'Một cuộc hôn nhân', en: 'A marriage' }],
      why: { vi: 'J là người trẻ hoặc một thông điệp, mang tính chất của chất mình.', en: 'The Jack is a young person or a message, carrying the character of its suit.' } },
    { hard: true,
      q: { vi: 'Chất Rô ứng với mùa nào?', en: 'Which season belongs to Diamonds?' },
      a: [{ vi: 'Mùa thu', en: 'Autumn' }, { vi: 'Mùa xuân', en: 'Spring' }, { vi: 'Mùa hè', en: 'Summer' }, { vi: 'Mùa đông', en: 'Winter' }],
      why: { vi: 'Rô là mùa thu, mùa của thu hoạch và của kết toán.', en: 'Diamonds is autumn: the season of harvest and of settling accounts.' } },
    { hard: true,
      q: { vi: 'Cặp Át Rô đi cùng Mười Rô báo điều gì?', en: 'What do the Ace of Diamonds and the Ten of Diamonds announce together?' },
      a: [{ vi: 'Một hợp đồng lớn, hoặc một chuyến đi vì công việc', en: 'A big contract, or a journey for work' }, { vi: 'Một điều ước thành sự thật', en: 'A wish coming true' }, { vi: 'Một tình bạn mới', en: 'A new friendship' }, { vi: 'Một kết thúc', en: 'An ending' }],
      why: { vi: 'Át Rô mở một việc tiền bạc, Mười Rô đưa nó tới mức lớn nhất. Ghép lại thường là hợp đồng, hoặc chuyến đi làm ăn.', en: 'The Ace of Diamonds opens a money matter and the Ten carries it to its fullest. Together that is usually a contract, or travel for business.' } }
  ],
  5: [
    { q: { vi: 'Chất Chuồn nói về điều gì?', en: 'What does the suit of Clubs speak of?' },
      a: [{ vi: 'Hành động, việc làm ăn, bạn bè và may mắn', en: 'Action, business, friends and luck' }, { vi: 'Tình cảm và gia đình', en: 'Love and family' }, { vi: 'Lo âu và mất mát', en: 'Worry and loss' }, { vi: 'Giấy tờ và tin tức', en: 'Paperwork and news' }],
      why: { vi: 'Chuồn là chất của việc đang làm và của những người cùng làm với bạn.', en: 'Clubs is the suit of work in motion and of the people doing it with you.' } },
    { q: { vi: 'Chất Chuồn tương ứng với chất nào trong tarot?', en: 'Which tarot suit is the twin of Clubs?' },
      a: [{ vi: 'Gậy', en: 'Wands' }, { vi: 'Tiền', en: 'Pentacles' }, { vi: 'Cốc', en: 'Cups' }, { vi: 'Kiếm', en: 'Swords' }],
      why: { vi: 'Chuồn ứng với Gậy: lửa, hành động, ý chí.', en: 'Clubs answers to Wands: fire, action, will.' } },
    { q: { vi: 'Khi một trải bài có nhiều lá Chuồn, điều đó thường gợi tới điều gì?', en: 'What can a spread with many Clubs suggest?' },
      a: [{ vi: 'Hành động, công việc hoặc sự việc đang chuyển động', en: 'That action, work or movement is a major theme' }, { vi: 'Người hỏi chắc chắn sắp giàu', en: 'That the querent is certain to become rich' }, { vi: 'Phải xào lại bộ bài', en: 'That the deck must be reshuffled' }, { vi: 'Câu hỏi đã đặt sai', en: 'That the question was asked incorrectly' }],
      why: { vi: 'Nhiều lá Chuồn hướng câu chuyện về hành động, công việc, các mối liên hệ và những điều đang bắt đầu chuyển động.', en: 'Many Clubs point the reading towards action, work, contacts and things beginning to move.' } },
    { hard: true,
      q: { vi: 'Chất Chuồn ứng với mùa nào?', en: 'Which season belongs to Clubs?' },
      a: [{ vi: 'Mùa hè', en: 'Summer' }, { vi: 'Mùa xuân', en: 'Spring' }, { vi: 'Mùa thu', en: 'Autumn' }, { vi: 'Mùa đông', en: 'Winter' }],
      why: { vi: 'Chuồn là mùa hè: mùa nóng nhất, và cũng là chất năng nổ nhất.', en: 'Clubs is summer: the hottest season, and the most driven suit.' } },
    { hard: true,
      q: { vi: 'Cặp Chín Chuồn đi cùng Chín Cơ được đọc là gì?', en: 'How are the Nine of Clubs and the Nine of Hearts read together?' },
      a: [{ vi: 'May mắn gộp với niềm vui: một kỳ vọng được đáp', en: 'Luck plus joy: an expectation met' }, { vi: 'Hai tin xấu liền nhau', en: 'Two pieces of bad news together' }, { vi: 'Một khoản nợ phải trả', en: 'A debt to be paid' }, { vi: 'Một chuyến đi bị hoãn', en: 'A journey postponed' }],
      why: { vi: 'Chín Chuồn mang may mắn, Chín Cơ là điều ước. Hai lá Chín cạnh nhau làm mạnh lẫn nhau.', en: 'The Nine of Clubs brings luck and the Nine of Hearts is the wish. Two Nines beside each other strengthen one another.' } }
  ],
  6: [
    { q: { vi: 'Chất Bích tương ứng với chất nào trong tarot?', en: 'Which tarot suit is the twin of Spades?' },
      a: [{ vi: 'Kiếm', en: 'Swords' }, { vi: 'Cốc', en: 'Cups' }, { vi: 'Gậy', en: 'Wands' }, { vi: 'Tiền', en: 'Pentacles' }],
      why: { vi: 'Bích ứng với Kiếm: khí, suy nghĩ, lời nói.', en: 'Spades answers to Swords: air, thought, speech.' } },
    { q: { vi: 'Lá Mười Bích báo điều gì?', en: 'What does the Ten of Spades announce?' },
      a: [{ vi: 'Một kết thúc', en: 'An ending' }, { vi: 'Một khởi đầu', en: 'A beginning' }, { vi: 'Một khoản tiền', en: 'A sum of money' }, { vi: 'Một cuộc hẹn', en: 'A meeting' }],
      why: { vi: 'Mười là chất ở mức đầy nhất, và chất ấy là thử thách: điều gì đó đã đi hết đường của nó.', en: 'The Ten is the suit at its fullest, and the suit is difficulty: something has run its full course.' } },
    { q: { vi: 'Khi phần lớn các lá trong trải bài là Bích, điều đó nói lên gì?', en: 'When most of a spread comes up Spades, what does that say?' },
      a: [{ vi: 'Vấn đề đang nằm ở chỗ khó khăn và cần cân nhắc', en: 'The matter sits in difficulty and calls for weighing up' }, { vi: 'Người hỏi sắp giàu', en: 'The querent is about to be rich' }, { vi: 'Trải bài phải xào lại', en: 'The spread must be shuffled again' }, { vi: 'Câu hỏi đã bị đặt sai', en: 'The question was asked wrongly' }],
      why: { vi: 'Bài Tây đọc theo số đông: chất chiếm nhiều lá nhất cho biết vấn đề đang sống ở đâu.', en: 'Playing cards are read by majority: the suit that dominates says where the matter lives.' } },
    { hard: true,
      q: { vi: 'Chất Bích ứng với mùa nào?', en: 'Which season belongs to Spades?' },
      a: [{ vi: 'Mùa đông', en: 'Winter' }, { vi: 'Mùa thu', en: 'Autumn' }, { vi: 'Mùa hè', en: 'Summer' }, { vi: 'Mùa xuân', en: 'Spring' }],
      why: { vi: 'Bích là mùa đông: mùa chậm nhất, và chất nặng nhất.', en: 'Spades is winter: the slowest season, and the heaviest suit.' } },
    { hard: true,
      q: { vi: 'Cặp Át Bích đi cùng Mười Bích được đọc là gì?', en: 'How are the Ace of Spades and the Ten of Spades read together?' },
      a: [{ vi: 'Một kết thúc lớn: đóng lại để mở ra', en: 'A big ending: closing so that something can open' }, { vi: 'Một khoản tiền bất ngờ', en: 'Unexpected money' }, { vi: 'Một lời cầu hôn', en: 'A proposal of marriage' }, { vi: 'Một chuyến đi ngắn', en: 'A short trip' }],
      why: { vi: 'Hai lá nặng nhất của chất nặng nhất. Truyền thống không đọc nó là tai hoạ, mà là một chương khép lại dứt khoát.', en: 'The two heaviest cards of the heaviest suit. The tradition does not read this as catastrophe but as a chapter closing for good.' } }
  ],
  7: [
    { q: { vi: 'Bài Tây có bao nhiêu lá hình?', en: 'How many court cards are in a playing pack?' },
      a: [{ vi: '12', en: '12' }, { vi: '16', en: '16' }, { vi: '4', en: '4' }, { vi: '8', en: '8' }],
      why: { vi: 'Ba thứ bậc J, Q, K nhân bốn chất là 12 lá.', en: 'Three ranks — Jack, Queen, King — in four suits makes 12.' } },
    { q: { vi: 'Lá K thường chỉ điều gì?', en: 'What does a King usually point to?' },
      a: [{ vi: 'Một người đàn ông trưởng thành hoặc người có quyền', en: 'A grown man, or someone in charge' }, { vi: 'Một đứa trẻ', en: 'A child' }, { vi: 'Một lá thư', en: 'A letter' }, { vi: 'Một mùa trong năm', en: 'A season of the year' }],
      why: { vi: 'K là thứ bậc của quyền quyết định, hoặc phần quyết đoán trong chính người hỏi.', en: 'The King is the rank of decision, or the decisive side of the querent themselves.' } },
    { q: { vi: 'Lá Q thường chỉ điều gì?', en: 'What does a Queen usually point to?' },
      a: [{ vi: 'Một người phụ nữ trưởng thành, hoặc phần chăm sóc và cảm nhận', en: 'A grown woman, or the caring, sensing side' }, { vi: 'Một khoản tiền', en: 'A sum of money' }, { vi: 'Một chuyến đi', en: 'A journey' }, { vi: 'Một tin xấu', en: 'Bad news' }],
      why: { vi: 'Q là người phụ nữ trưởng thành, hoặc phần biết lắng nghe và chăm sóc trong bạn.', en: 'The Queen is a grown woman, or the part of you that listens and takes care.' } },
    { hard: true,
      q: { vi: 'Một lá J trong trải bài không nhất thiết là một con người. Nó còn có thể là gì?', en: 'A Jack in a spread need not be a person at all. What else can it be?' },
      a: [{ vi: 'Một tin nhắn mang tính chất của chất đó', en: 'A message carrying the character of its suit' }, { vi: 'Một khoảng thời gian mười một ngày', en: 'A stretch of eleven days' }, { vi: 'Một địa điểm', en: 'A place' }, { vi: 'Một con số may mắn', en: 'A lucky number' }],
      why: { vi: 'J là người trẻ, nhưng cũng là thông điệp. J Rô là tin về tiền; J Bích là tin không vui. Lá bên cạnh cho biết đó là người hay tin.', en: 'The Jack is a young person, but also a message. The Jack of Diamonds is news about money; the Jack of Spades is unwelcome news. The neighbouring card says which it is.' } },
    { hard: true,
      q: { vi: 'Vì sao nên đọc lá hình theo vai trò và bối cảnh thay vì màu tóc hay màu da?', en: 'Why is it better to read court cards through role and context rather than hair or skin colour?' },
      a: [{ vi: 'Vì những quy ước ngoại hình cũ không đáng tin và cũng không cần thiết; vai trò, hành vi và bối cảnh hữu ích hơn', en: 'Because old appearance correspondences are neither reliable nor necessary; role, behaviour and context are more useful' }, { vi: 'Vì lá hình không bao giờ chỉ người thật', en: 'Because court cards can never represent real people' }, { vi: 'Vì chỉ con số trên lá mới có ý nghĩa', en: 'Because only the number matters' }, { vi: 'Vì mọi lá hình đều có cùng một nghĩa', en: 'Because every court card means the same thing' }],
      why: { vi: 'Một số hệ thống bói bài cũ từng gắn lá hình với ngoại hình, nhưng cách này không đáng tin và dễ lỗi thời. Vai trò, cách hành xử và các lá xung quanh cho bạn nhiều thông tin hơn.', en: 'Some older cartomancy systems used appearance correspondences, but they are not reliable and age badly. Role, behaviour and surrounding cards give you more useful information.' } }
  ],
  8: [
    { q: { vi: 'Khi hai lá đứng cạnh nhau, điều gì xảy ra?', en: 'When two cards sit side by side, what happens?' },
      a: [{ vi: 'Chúng đổi nghĩa cho nhau', en: 'They change each other\'s meaning' }, { vi: 'Chỉ lá bên trái được tính', en: 'Only the left-hand card counts' }, { vi: 'Cả hai đều bị bỏ qua', en: 'Both are set aside' }, { vi: 'Lá mạnh hơn xoá lá yếu hơn', en: 'The stronger cancels the weaker' }],
      why: { vi: 'Bài Tây đọc theo cặp: nghĩa của một lá luôn chịu ảnh hưởng của lá bên cạnh.', en: 'Playing cards are read in pairs: a card\'s meaning is always coloured by its neighbour.' } },
    { q: { vi: 'Con số trên lá được dùng để tính thời gian như thế nào?', en: 'How is the number on a card used for timing?' },
      a: [{ vi: 'Là số đơn vị thời gian đã chốt từ trước', en: 'It is that many of the unit fixed beforehand' }, { vi: 'Luôn luôn là số ngày', en: 'It is always that many days' }, { vi: 'Luôn luôn là số tháng', en: 'It is always that many months' }, { vi: 'Không dùng để tính thời gian', en: 'It is not used for timing at all' }],
      why: { vi: 'Ba Cơ trong khung tuần là khoảng ba tuần; trong khung tháng là khoảng ba tháng. Khung do bạn chốt.', en: 'A Three of Hearts in a weekly frame is about three weeks; in a monthly frame, three months. The frame is yours to set.' } },
    { q: { vi: 'Chất nào thường được xem là đến nhanh hơn?', en: 'Which suits are held to arrive faster?' },
      a: [{ vi: 'Cơ và Rô', en: 'Hearts and Diamonds' }, { vi: 'Chuồn và Bích', en: 'Clubs and Spades' }, { vi: 'Chỉ Bích', en: 'Spades alone' }, { vi: 'Cả bốn chất đều như nhau', en: 'All four the same' }],
      why: { vi: 'Cơ và Rô thường đến nhanh hơn Chuồn và Bích. Đây là quy ước của khoá học này.', en: 'Hearts and Diamonds tend to arrive sooner than Clubs and Spades. That is the convention this course uses.' } },
    { hard: true,
      q: { vi: 'Đơn vị thời gian phải được chốt vào lúc nào?', en: 'When must the unit of time be fixed?' },
      a: [{ vi: 'Trước khi xào bài', en: 'Before the cards are shuffled' }, { vi: 'Sau khi đã lật bài lên', en: 'After the cards have been turned over' }, { vi: 'Khi lá cuối cùng được rút', en: 'When the last card is drawn' }, { vi: 'Không cần chốt', en: 'It does not need fixing' }],
      why: { vi: 'Chốt sau khi đã nhìn thấy lá là tự chiều mình: bạn sẽ chọn đơn vị nào cho ra câu trả lời dễ chịu nhất. Chốt trước thì câu trả lời mới có giá trị.', en: 'Fixing it after you have seen the cards is flattering yourself: you will pick whichever unit gives the answer you want. Fixed beforehand, the answer means something.' } },
    { hard: true,
      q: { vi: 'Vì sao khoá học nhắc rằng không có quy ước thời gian nào được mọi sách đồng ý?', en: 'Why does the course note that no timing convention is shared by every book?' },
      a: [{ vi: 'Vì điều quan trọng là giữ một cách và dùng đều, chứ không phải tìm cách đúng duy nhất', en: 'Because what matters is keeping one method and using it consistently, not finding the one true one' }, { vi: 'Vì thời gian không thể đọc được', en: 'Because timing cannot be read at all' }, { vi: 'Vì chỉ có bài tarot mới tính được thời gian', en: 'Because only tarot can time anything' }, { vi: 'Vì mỗi bộ bài có quy ước riêng in kèm', en: 'Because each deck comes with its own printed convention' }],
      why: { vi: 'Các truyền thống khác nhau gán đơn vị khác nhau cho từng chất. Một hệ thống nhất quán, dùng lâu và đối chiếu lại, sẽ chính xác hơn nhiều hệ trộn lẫn.', en: 'Different traditions assign different units to the suits. One consistent system, used for a long time and checked against what happened, will beat a mixture of several.' } }
  ],
  9: [
    { q: { vi: 'Trải ba lá đọc theo thứ tự nào?', en: 'How is the three-card spread read?' },
      a: [{ vi: 'Quá khứ, hiện tại, tương lai', en: 'Past, present, future' }, { vi: 'Tốt, xấu, trung tính', en: 'Good, bad, neutral' }, { vi: 'Người, việc, nơi chốn', en: 'Person, thing, place' }, { vi: 'Sáng, trưa, tối', en: 'Morning, noon, night' }],
      why: { vi: 'Ba lá theo dòng thời gian là trải bài hằng ngày.', en: 'Three cards along a timeline is the daily spread.' } },
    { q: { vi: 'Trải năm lá gồm những vị trí nào?', en: 'What are the five positions in the five-card spread?' },
      a: [{ vi: 'Quá khứ, hiện tại, điều cản, lời khuyên, kết quả', en: 'Past, present, what blocks, advice, outcome' }, { vi: 'Năm người thân trong nhà', en: 'Five people in the family' }, { vi: 'Năm năm sắp tới', en: 'The next five years' }, { vi: 'Năm chất của bộ bài', en: 'The five suits of the pack' }],
      why: { vi: 'Năm lá đọc từ trái sang phải như một câu.', en: 'The five are read left to right as a sentence.' } },
    { q: { vi: 'Trong trải chín lá, lá nào là trọng tâm?', en: 'In the nine-card spread, which card is the heart of it?' },
      a: [{ vi: 'Lá ở giữa', en: 'The middle one' }, { vi: 'Lá góc trên bên trái', en: 'The top left' }, { vi: 'Lá cuối cùng', en: 'The last one' }, { vi: 'Lá đầu tiên', en: 'The first one' }],
      why: { vi: 'Ba hàng: trên là hoàn cảnh, giữa là bạn lúc này, dưới là kết quả. Lá giữa là bạn.', en: 'Three rows: the situation above, you now in the middle, the outcome below. The middle card is you.' } },
    { hard: true,
      q: { vi: 'Trải bài điều ước đếm ra bao nhiêu lá?', en: 'How many cards are dealt in the wish spread?' },
      a: [{ vi: '15', en: '15' }, { vi: '9', en: '9' }, { vi: '21', en: '21' }, { vi: '12', en: '12' }],
      why: { vi: 'Bạn nghĩ tới một điều ước, xào bài, rồi đếm ra 15 lá.', en: 'Think of a wish, shuffle, and deal fifteen.' } },
    { hard: true,
      q: { vi: 'Trong trải bài điều ước, nếu không có cả Chín Cơ lẫn Chín Bích thì đọc thế nào?', en: 'In the wish spread, what does it mean if neither the Nine of Hearts nor the Nine of Spades appears?' },
      a: [{ vi: 'Kết quả tuỳ ở chính người hỏi', en: 'The outcome rests with the querent themselves' }, { vi: 'Điều ước chắc chắn không thành', en: 'The wish will certainly not come' }, { vi: 'Phải xào lại và đếm lần nữa', en: 'You must shuffle and deal again' }, { vi: 'Điều ước sẽ thành sau đúng chín năm', en: 'The wish comes in exactly nine years' }],
      why: { vi: 'Chín Cơ nghĩa là điều ước sẽ đến; Chín Bích nghĩa là chưa phải lúc. Không có lá nào thì bài không quyết thay bạn — việc còn lại là của bạn.', en: 'The Nine of Hearts says the wish comes; the Nine of Spades says not now. With neither, the cards decline to decide for you: the rest is your own doing.' } }
  ]
};

/* ---- German localization (review section 29.5) ----
   Same lesson and question order as above; the correct option stays first. */
const QUIZ_PLAY_DE = {
1: [
['Wie viele Karten hat ein übliches Spielkartenblatt ohne Joker?', ['52', '36', '78', '54'], '52 Karten: vier Farben mit jeweils dreizehn Karten.'],
['Wofür steht Herz beim Kartenlegen hauptsächlich?', ['Liebe, Familie und Freude', 'Geld und Nachrichten', 'Arbeit und Glück', 'Herausforderungen und Sorgen'], 'Herz ist die Farbe der Gefühle, Beziehungen und Menschen, die dir nahestehen.'],
['Wofür steht Pik hauptsächlich?', ['Herausforderungen, Sorgen und schwierige Entscheidungen', 'Liebe und Familie', 'Geld', 'Freunde'], 'Pik ist die ernsteste Farbe und wird traditionell mit Sorgen, unangenehmen Nachrichten und schwierigen Entscheidungen verbunden.'],
['Welcher Tarotfarbe entspricht Karo am ehesten?', ['Münzen', 'Stäbe', 'Kelche', 'Schwerter'], 'Karo entspricht den Münzen: Erde, Geld und praktische Themen. Kreuz entspricht Stäben, Herz Kelchen und Pik Schwertern.'],
['Ein Spielkartenblatt hat 12 Hofkarten, Tarot hat 16. Woher kommen die vier zusätzlichen Tarotkarten?', ['Tarot hat mit dem Ritter einen vierten Hofrang', 'Tarot hat fünf Farben', 'Im Spielkartenblatt fehlen vier Asse', 'Tarot zählt zwei Joker mit'], 'Spielkarten haben Bube, Dame und König. Im Tarot gibt es vier Hofränge: Bube, Ritter, Königin und König.']
],
2: [
['Wofür steht das Ass in der Zahlenfolge?', ['Für den Samen der Farbe — ihre reine Form am Anfang', 'Für das Endergebnis', 'Für eine erwachsene Person', 'Für einen langen Zeitraum'], 'Das Ass steht am Anfang: Die Energie der Farbe erscheint in ihrer einfachsten, noch jungen Form.'],
['Wofür steht die Zehn?', ['Für die stärkste oder vollständigste Ausprägung der Farbe', 'Für einen Neuanfang', 'Für eine Nachricht', 'Für Zögern'], 'Die Zehn beendet die Zahlenreihe. Sie zeigt, wie sich das Thema der jeweiligen Farbe bis zum Ende entwickelt.'],
['Welche Zahl durchbricht die Ruhe der Vier?', ['Die Fünf', 'Die Sechs', 'Die Sieben', 'Die Acht'], 'Die Vier bildet ein Fundament; die Fünf bringt Bewegung, Reibung oder eine Entscheidung. Die Sechs versucht danach wieder auszugleichen.'],
['Welche Karte gilt in der traditionellen Kartomantie als Wunschkarte?', ['Herz Neun', 'Karo Neun', 'Herz Ass', 'Herz Zehn'], 'Herz Neun wird traditionell als Wunschkarte gelesen. Pik Neun trägt dagegen einen deutlich schwereren Grundton.'],
['Wofür steht Pik Neun traditionell?', ['Enttäuschung, Sorge oder „noch nicht"', 'Eine glückliche Reise', 'Eine Geldsumme', 'Eine Hochzeit'], 'Pik Neun gilt traditionell als Karte von Enttäuschung und Sorge; in der Wunschlegung wird sie eher als Verzögerung oder „noch nicht" gelesen.']
],
3: [
['Wofür kann Herz Ass traditionell stehen?', ['Für einen emotionalen Anfang, Zuhause oder eine neue Herzensangelegenheit', 'Für einen endgültigen Abschluss', 'Für einen Rechtsstreit', 'Für eine berufliche Reise'], 'Das Ass eröffnet die Farbe Herz: Gefühle, Zuhause und Beziehungsthemen beginnen oder bekommen neue Aufmerksamkeit.'],
['Wofür steht Herz Zehn?', ['Für große Freude und emotionale Fülle', 'Für ein Ende', 'Für Schulden', 'Für Streit'], 'Die Zehn zeigt die Farbe in ihrer Fülle, und Herz steht für Gefühle, Beziehungen und Zuhause.'],
['Wie werden Herz Dame und Herz König nebeneinander traditionell oft gelesen?', ['Als Paar, feste Verbindung oder ruhiges Zuhause', 'Als zwei Fremde', 'Als Trennung', 'Als Reise'], 'Zwei Herz-Hofkarten nebeneinander können auf ein Paar, eine feste Bindung oder ein familiäres Thema hinweisen.'],
['Welche Jahreszeit wird Herz in diesem Kurs zugeordnet?', ['Frühling', 'Sommer', 'Herbst', 'Winter'], 'In diesem Kurs gilt: Herz Frühling, Kreuz Sommer, Karo Herbst, Pik Winter.'],
['Wie werden Herz Ass und Herz Neun zusammen traditionell gelesen?', ['Als günstiges Zeichen für einen Wunsch oder Freude im Zuhause', 'Als große Geldsumme', 'Als berufliche Reise', 'Als deutliches Ende'], 'Herz Ass eröffnet ein Herzens- oder Zuhause-Thema, Herz Neun gilt als Wunschkarte. Zusammen werden sie traditionell günstig gelesen.']
],
4: [
['Wofür steht Karo?', ['Geld, Arbeit und Nachrichten', 'Liebe', 'Freunde und Glück', 'Krankheit'], 'Karo ist die praktische Farbe: Geld, Dokumente, Nachrichten und greifbare Angelegenheiten.'],
['Wofür steht Karo Zehn traditionell?', ['Für eine größere Geld- oder Geschäftsangelegenheit', 'Für ein Versprechen', 'Für eine Trennung', 'Für einen Traum'], 'Die Zehn zeigt die Farbe in ihrer Fülle, und Karo steht für materielle und geschäftliche Themen.'],
['Worauf kann Karo Bube hinweisen?', ['Auf einen jungen Menschen oder eine Nachricht rund um Geld oder Arbeit', 'Auf eine ältere Autoritätsperson', 'Auf eine Erbschaft', 'Auf eine Hochzeit'], 'Der Bube kann einen jungen Menschen oder eine Nachricht darstellen und trägt dabei den Charakter seiner Farbe.'],
['Welche Jahreszeit wird Karo in diesem Kurs zugeordnet?', ['Herbst', 'Frühling', 'Sommer', 'Winter'], 'Karo wird hier dem Herbst zugeordnet — der Zeit von Ernte und Bilanz.'],
['Wie werden Karo Ass und Karo Zehn zusammen traditionell oft gelesen?', ['Als größerer Vertrag, Geschäft oder berufliche Reise', 'Als erfüllter Wunsch', 'Als neue Freundschaft', 'Als Abschluss'], 'Karo Ass eröffnet eine praktische oder finanzielle Angelegenheit, Karo Zehn verstärkt dieses Thema. Zusammen können sie auf ein größeres Geschäft oder berufliche Bewegung hinweisen.']
],
5: [
['Wofür steht Kreuz?', ['Handlung, Arbeit, Freunde und Chancen', 'Liebe und Familie', 'Sorgen und Verlust', 'Dokumente und Nachrichten'], 'Kreuz ist die Farbe von Bewegung, Arbeit, Kontakten und Gelegenheiten.'],
['Welcher Tarotfarbe entspricht Kreuz?', ['Stäbe', 'Münzen', 'Kelche', 'Schwerter'], 'Kreuz entspricht den Stäben: Feuer, Wille und Handlung.'],
['Was kann eine Häufung von Kreuzkarten in einer Legung anzeigen?', ['Dass Handlung, Arbeit oder Bewegung gerade eine große Rolle spielen', 'Dass die fragende Person zwingend reich wird', 'Dass die Karten neu gemischt werden müssen', 'Dass die Frage falsch gestellt wurde'], 'Viele Kreuzkarten lenken den Blick auf Tätigkeit, Kontakte, Arbeit und Dinge, die in Bewegung kommen.'],
['Welche Jahreszeit wird Kreuz in diesem Kurs zugeordnet?', ['Sommer', 'Frühling', 'Herbst', 'Winter'], 'Kreuz wird hier dem Sommer zugeordnet: eine aktive, nach außen gerichtete Phase.'],
['Wie werden Kreuz Neun und Herz Neun zusammen traditionell gelesen?', ['Glück plus Freude: Eine Hoffnung bekommt Rückenwind', 'Als zwei schlechte Nachrichten', 'Als zu zahlende Schuld', 'Als verschobene Reise'], 'Kreuz Neun trägt einen glücklichen Grundton, Herz Neun gilt als Wunschkarte. Zusammen verstärken sie eine günstige Lesart.']
],
6: [
['Welcher Tarotfarbe entspricht Pik?', ['Schwerter', 'Kelche', 'Stäbe', 'Münzen'], 'Pik entspricht den Schwertern: Luft, Denken, Sprache und Konflikt.'],
['Wofür steht Pik Zehn traditionell?', ['Für einen deutlichen Abschluss', 'Für einen Anfang', 'Für eine Geldsumme', 'Für ein Treffen'], 'Die Zehn zeigt das Thema der Farbe am Ende seiner Entwicklung; bei Pik wird das häufig als Abschluss einer schwierigen Phase gelesen.'],
['Was kann es bedeuten, wenn in einer Legung besonders viele Pikkarten liegen?', ['Dass Schwierigkeiten, Sorgen oder Entscheidungen das Hauptthema bilden', 'Dass die fragende Person bald reich wird', 'Dass neu gemischt werden muss', 'Dass die Frage falsch gestellt wurde'], 'Beim Kartenlegen wird auch die Verteilung der Farben betrachtet. Viele Pikkarten lenken die Deutung auf Herausforderungen und Entscheidungen.'],
['Welche Jahreszeit wird Pik in diesem Kurs zugeordnet?', ['Winter', 'Herbst', 'Sommer', 'Frühling'], 'Pik wird hier dem Winter zugeordnet: langsam, ernst und nach innen gerichtet.'],
['Wie werden Pik Ass und Pik Zehn zusammen traditionell gelesen?', ['Als deutlicher Abschluss: Etwas schließt sich, damit Neues beginnen kann', 'Als unerwartetes Geld', 'Als Heiratsantrag', 'Als kurze Reise'], 'Beide Karten tragen starke Abschluss-Symbolik. Traditionell wird die Kombination eher als endgültiges Schließen eines Kapitels gelesen als als Katastrophe.']
],
7: [
['Wie viele Hofkarten hat ein übliches Spielkartenblatt?', ['12', '16', '4', '8'], 'Bube, Dame und König in vier Farben ergeben zwölf Hofkarten.'],
['Worauf kann ein König in einer Legung hinweisen?', ['Auf einen erwachsenen Mann, eine Autoritätsperson oder eine entschlossene Rolle', 'Auf ein Kind', 'Auf einen Brief', 'Auf eine Jahreszeit'], 'Der König steht traditionell für Verantwortung, Entscheidungskraft oder eine Person mit Einfluss. Er kann auch eine Rolle oder Verhaltensweise beschreiben.'],
['Worauf kann eine Dame in einer Legung hinweisen?', ['Auf eine erwachsene Frau oder eine fürsorgliche, wahrnehmende Rolle', 'Auf eine Geldsumme', 'Auf eine Reise', 'Auf schlechte Nachrichten'], 'Die Dame steht traditionell für eine erwachsene Frau, kann aber ebenso eine fürsorgliche, beobachtende oder reife Rolle beschreiben.'],
['Ein Bube muss nicht unbedingt eine Person sein. Wofür kann er außerdem stehen?', ['Für eine Nachricht, die den Charakter seiner Farbe trägt', 'Für genau elf Tage', 'Für einen Ort', 'Für eine Glückszahl'], 'Der Bube kann einen jungen Menschen darstellen, aber auch eine Nachricht. Die Farbe und die Nachbarkarten helfen bei der Einordnung.'],
['Warum ist es sinnvoller, Hofkarten über Rolle und Kontext zu lesen als über Haar- oder Hautfarbe?', ['Weil alte Aussehens-Zuordnungen weder zuverlässig noch nötig sind; Rolle, Verhalten und Kontext geben mehr her', 'Weil Hofkarten grundsätzlich niemals Menschen darstellen', 'Weil nur die Kartenzahl eine Rolle spielt', 'Weil alle Hofkarten dieselbe Bedeutung haben'], 'Ältere Kartomantie-Systeme nutzten manchmal Aussehensmerkmale, doch diese Zuordnungen sind weder verlässlich noch besonders hilfreich. Rolle, Verhalten und Umfeld der Karte sind heute die bessere Grundlage.']
],
8: [
['Was passiert, wenn zwei Karten direkt nebeneinander liegen?', ['Sie beeinflussen und verändern die Deutung voneinander', 'Nur die linke Karte zählt', 'Beide werden ignoriert', 'Die stärkere löscht die schwächere aus'], 'Beim Kartenlegen werden Nachbarkarten gemeinsam gelesen: Jede Karte färbt die Bedeutung der anderen.'],
['Wie wird die Zahl einer Karte für Zeitangaben verwendet?', ['Als Anzahl der vorher festgelegten Zeiteinheit', 'Immer als Tage', 'Immer als Monate', 'Gar nicht'], 'Herz Drei kann in einem Wochenrahmen etwa drei Wochen bedeuten, in einem Monatsrahmen etwa drei Monate. Den Rahmen legst du vorher fest.'],
['Welche Farben werden in diesem Kurssystem tendenziell schneller gelesen?', ['Herz und Karo', 'Kreuz und Pik', 'Nur Pik', 'Alle gleich schnell'], 'In diesem Kurs gelten Herz und Karo als eher schnell, Kreuz und Pik als eher langsam. Das ist eine Konvention, keine universelle Regel.'],
['Wann sollte die Zeiteinheit festgelegt werden?', ['Bevor die Karten gemischt werden', 'Nachdem die Karten aufgedeckt wurden', 'Wenn die letzte Karte gezogen wurde', 'Sie muss nicht festgelegt werden'], 'Wenn du die Einheit erst nach dem Aufdecken wählst, kannst du sie unbewusst an ein gewünschtes Ergebnis anpassen. Lege sie deshalb vorher fest.'],
['Warum weist der Kurs darauf hin, dass nicht alle Bücher dieselbe Zeitregel verwenden?', ['Weil Konsequenz wichtiger ist als die Suche nach einer einzigen „richtigen" Regel', 'Weil Zeit grundsätzlich nicht gedeutet werden kann', 'Weil nur Tarot Zeitangaben erlaubt', 'Weil jedes Deck seine eigene Regel aufdruckt'], 'Verschiedene Traditionen ordnen Farben und Zeiteinheiten unterschiedlich zu. Sinnvoller ist, ein System konsequent zu verwenden und die eigenen Erfahrungen damit zu prüfen.']
],
9: [
['Wie wird die Dreierlegung in diesem Kurs gelesen?', ['Vergangenheit, Gegenwart, Zukunft', 'Gut, schlecht, neutral', 'Person, Sache, Ort', 'Morgen, Mittag, Abend'], 'Drei Karten entlang einer Zeitlinie sind eine einfache Alltagslegung.'],
['Welche fünf Positionen hat die Fünferlegung?', ['Vergangenheit, Gegenwart, Hindernis, Rat, mögliche Entwicklung', 'Fünf Familienmitglieder', 'Die nächsten fünf Jahre', 'Fünf Farben des Decks'], 'Die fünf Karten werden von links nach rechts wie ein Satz gelesen.'],
['Welche Karte bildet in der Neunerlegung den Schwerpunkt?', ['Die mittlere Karte', 'Die Karte oben links', 'Die letzte Karte', 'Die erste Karte'], 'Die Karten liegen in drei Reihen, und die mittlere Karte bildet den Kern der Legung.'],
['Wie viele Karten werden bei der Wunschlegung ausgelegt?', ['15', '9', '21', '12'], 'Du denkst an einen Wunsch, mischst und legst fünfzehn Karten aus.'],
['Wie wird es in der Wunschlegung gelesen, wenn weder Herz Neun noch Pik Neun erscheint?', ['Die Karten geben kein klares Ja oder „noch nicht" vor; die weitere Entwicklung bleibt offen', 'Der Wunsch erfüllt sich sicher nicht', 'Du musst sofort neu mischen', 'Der Wunsch erfüllt sich genau in neun Jahren'], 'Herz Neun gilt traditionell als günstiges Wunschzeichen, Pik Neun als Verzögerung. Fehlen beide, sollte die Legung nicht künstlich zu einer eindeutigen Vorhersage gemacht werden.']
]
};

/* Fold the German strings into the bank the course already reads. */
Object.keys(QUIZ_PLAY_DE).forEach((lesson) => {
  QUIZ_PLAY_DE[lesson].forEach((row, i) => {
    const item = (QUIZ.playing[lesson] || [])[i];
    if (!item) return;
    item.q.de = row[0];
    item.a.forEach((opt, j) => { if (row[1][j] !== undefined) opt.de = row[1][j]; });
    item.why.de = row[2];
  });
});
