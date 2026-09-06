/* ======================= angel numbers (free) =======================
   The numbers people keep seeing: on a clock, on a receipt, on a number plate.
   They are grouped by pattern rather than listed one by one, because 111 and
   1111 are the same message said twice as loudly, and because a list of forty
   numbers is a list nobody reads.

   Everything here is folklore, written down plainly. The app says so on the
   page: a number is a prompt to look at something, not a prediction.

   The screen is built around one thing a person actually wants to do - type
   the number they keep seeing and be told what it means - so the keypad comes
   first and the reading follows it. Whatever is typed matches: a repeated
   digit, a mirrored pair, a ladder, or, failing all of those, the root the
   number reduces to. */

const ANGEL_ROOT = { 1: 'n1', 2: 'n2', 3: 'n3', 4: 'n4', 5: 'n5', 6: 'n6', 7: 'n7', 8: 'n8', 9: 'n9' };

const ANGELS = [
  {
    id: 'n0', digit: 0, ink: '#6E5AA8', aura: '#E4DCFA', seen: ['000', '0000', '00:00'],
    name: { vi: 'Số 0 lặp lại', en: 'Repeating zeros' },
    short: { vi: 'Một vòng mới bắt đầu', en: 'A circle opening' },
    keys: { vi: ['khởi đầu', 'trở về gốc', 'buông bớt'], en: ['beginning', 'return', 'letting go'] },
    body: {
      vi: ['Số 0 không có điểm đầu và cũng không có điểm cuối. Khi bạn liên tục nhìn thấy 000 hoặc 0000, người ta cho rằng bạn đang đứng ở đoạn giữa hai chương: chương cũ đã đóng lại nhưng chương mới thì chưa kịp mở ra. Cảm giác trống trải trong giai đoạn này là bình thường, và nó không có nghĩa là bạn đang đi sai đường.',
        'Đây thường là lúc những thói quen cũ không còn phù hợp nữa. Bạn có thể thấy mình mất hứng thú với những việc trước đây từng theo đuổi, hoặc thấy cần một khoảng lặng trước khi quyết định điều gì. Số 0 nhắc bạn rằng khoảng lặng ấy là một phần của quá trình, không phải là sự trì trệ.',
        'Trong nhiều truyền thống, số 0 còn được xem là biểu tượng của sự trọn vẹn: mọi thứ vốn đã đủ, chỉ là bạn đang nhìn nó theo một cách khác. Khi gặp số này, bạn hãy quay về với những điều cơ bản nhất của mình.'],
      en: ['Zero has no beginning and no end. Seeing 000 or 0000 again and again is read as standing between two chapters: the old one has closed and the new one has not opened yet. The empty feeling that comes with it is normal, and it does not mean you have gone the wrong way.',
        'This is usually a stretch where old habits stop fitting. You may lose interest in something you used to chase, or find you need a pause before deciding anything. Zero says the pause is part of the process rather than a stall.',
        'In many traditions zero also stands for wholeness: nothing is missing, you are only looking at it differently. When it appears, go back to your own basics.']
    },
    todo: { vi: 'Bạn dọn bớt một thứ đã cũ trong tuần này, dù là một món đồ, một thói quen hay một cuộc trò chuyện chưa dứt.', en: 'Clear one old thing this week: an object, a habit, or a conversation you never finished.' }
  },
  {
    id: 'n1', digit: 1, ink: '#C0872A', aura: '#FBE7BE', seen: ['111', '1111', '11:11'],
    name: { vi: 'Số 1 lặp lại', en: 'Repeating ones' },
    short: { vi: 'Cánh cửa vừa mở', en: 'A door standing open' },
    keys: { vi: ['khởi sự', 'ý nghĩ thành hình', 'đi trước'], en: ['starting', 'thoughts taking shape', 'going first'] },
    body: {
      vi: ['111 và 1111 là dãy số được nhắc đến nhiều nhất. Người ta xem đây là dấu hiệu của một cánh cửa vừa mở ra, và điều bạn đang nghĩ trong khoảnh khắc ấy có sức nặng hơn bình thường. Vì vậy mới có thói quen ước một điều gì đó khi đồng hồ chỉ 11:11.',
        'Ở mức thực tế hơn, số 1 gắn với việc bắt đầu và với việc tự mình đi bước đầu tiên. Nếu bạn đang cân nhắc một việc mới, dãy số này thường xuất hiện đúng vào lúc bạn đã có đủ thông tin nhưng còn thiếu quyết tâm.',
        'Số 1 cũng nhắc bạn để ý đến giọng nói bên trong của mình. Những câu bạn tự nói với bản thân trong giai đoạn này sẽ định hình cách bạn hành động trong vài tháng tới, nên bạn hãy chọn lời cho tử tế.'],
      en: ['111 and 1111 are the most talked-about of all. They are read as a door standing open, with whatever you are thinking at that moment carrying more weight than usual - which is where the habit of making a wish at 11:11 comes from.',
        'More practically, one is the number of beginnings and of taking the first step yourself. If you are weighing something new, this sequence tends to turn up exactly when you have enough information and not quite enough nerve.',
        'It also asks you to listen to your own voice. What you say to yourself now shapes how you act for months, so choose the words kindly.']
    },
    todo: { vi: 'Bạn viết ra một câu về điều bạn muốn, ở thì hiện tại, rồi làm một việc nhỏ nhất có thể để bắt đầu.', en: 'Write one sentence about what you want, in the present tense, then do the smallest thing that starts it.' }
  },
  {
    id: 'n2', digit: 2, ink: '#B0537A', aura: '#FBD3E1', seen: ['222', '2222', '22:22'],
    name: { vi: 'Số 2 lặp lại', en: 'Repeating twos' },
    short: { vi: 'Hãy cho mọi việc thêm thời gian', en: 'Give it time' },
    keys: { vi: ['cân bằng', 'bạn đồng hành', 'đúng thời điểm'], en: ['balance', 'partnership', 'timing'] },
    body: {
      vi: ['Số 2 nói về hai phía: bạn và một người khác, công việc và đời sống riêng, điều bạn muốn và điều bạn đang có. Khi 222 xuất hiện nhiều lần, người ta hiểu rằng có một việc trong đời bạn đang cần được cân lại cho đều.',
        'Đây cũng là dãy số của sự kiên nhẫn. Những gì bạn gieo trước đó chưa kịp nảy mầm, và số 2 khuyên bạn đừng đào lên xem. Nhiều chuyện chỉ cần thêm thời gian chứ không cần thêm nỗ lực.',
        'Trong chuyện tình cảm và trong hợp tác làm ăn, dãy số này thường được xem là dấu hiệu tốt: một mối quan hệ đang đi đúng hướng, hoặc một người phù hợp sắp bước vào phần việc bạn đang làm.'],
      en: ['Two is about two sides: you and someone else, work and life, what you want and what you have. When 222 keeps appearing, something in your life is asking to be evened out.',
        'It is also the number of patience. What you planted has not come up yet, and two says do not dig it back up to look. Some things need more time rather than more effort.',
        'In love and in partnerships it is usually read as a good sign: a relationship is going the right way, or the right person is about to join what you are building.']
    },
    todo: { vi: 'Bạn nhắn cho một người mà bạn đang chờ, hoặc cho họ thêm một tuần nữa mà không hỏi lại.', en: 'Message the person you are waiting on, or give them one more week without asking again.' }
  },
  {
    id: 'n3', digit: 3, ink: '#C46A2C', aura: '#F8D9C6', seen: ['333', '3333', '3:33'],
    name: { vi: 'Số 3 lặp lại', en: 'Repeating threes' },
    short: { vi: 'Nói ra điều bạn đang giữ', en: 'Say the thing' },
    keys: { vi: ['sáng tạo', 'lên tiếng', 'có người bên cạnh'], en: ['creativity', 'speaking up', 'support'] },
    body: {
      vi: ['Số 3 gắn với việc thể hiện: viết, vẽ, hát, hoặc đơn giản là nói ra một điều bạn đã giữ trong lòng quá lâu. Khi 333 xuất hiện, thường là lúc bạn đang có điều muốn nói nhưng lại tự thuyết phục mình rằng chưa phải lúc.',
        'Dãy số này còn được xem là dấu hiệu bạn không đơn độc. Có thể là một người thầy, một người bạn cũ, hoặc một người bạn chưa từng nghĩ tới sẽ giúp bạn trong việc bạn đang làm dở.',
        'Nếu bạn đang làm công việc sáng tạo, 333 là lời nhắc quay lại với phần việc bạn thích nhất chứ không phải phần việc dễ đo đếm nhất.'],
      en: ['Three is expression: writing, drawing, singing, or simply saying something you have held too long. When 333 turns up, there is usually something you want to say and keep telling yourself is not timely yet.',
        'It is also read as a sign that you are not on your own. A teacher, an old friend, or someone you never expected is about to help with the thing you left half-finished.',
        'If you make things for a living, 333 asks you back to the part of the work you actually like rather than the part that is easiest to measure.']
    },
    todo: { vi: 'Bạn gửi đi một tin nhắn hoặc một tác phẩm mà bạn vẫn để trong bản nháp.', en: 'Send one message, or share one piece of work, that has been sitting in drafts.' }
  },
  {
    id: 'n4', digit: 4, ink: '#3E7D5A', aura: '#C6E8D9', seen: ['444', '4444', '4:44'],
    name: { vi: 'Số 4 lặp lại', en: 'Repeating fours' },
    short: { vi: 'Bạn đang được che chắn', en: 'You are held' },
    keys: { vi: ['nền móng', 'được bảo vệ', 'làm cho chắc'], en: ['foundations', 'protection', 'steadiness'] },
    body: {
      vi: ['444 là dãy số của sự vững chãi. Người ta tin rằng khi số này xuất hiện, bạn đang được che chắn trong một giai đoạn khó, và những gì bạn đã xây dựng chắc chắn hơn bạn tưởng.',
        'Số 4 cũng nói về nền móng: sức khỏe, tiền tiết kiệm, chỗ ở, những mối quan hệ lâu năm. Đây là lúc thích hợp để kiểm tra lại phần gốc thay vì chạy theo cơ hội mới.',
        'Nếu bạn đang lo lắng về một việc cụ thể, dãy số này thường được đọc là lời trấn an: bạn không sai khi kiên trì, chỉ là kết quả đến chậm hơn bạn muốn.'],
      en: ['444 is the steady one. It is read as being held through a hard stretch, with what you have built standing firmer than you think.',
        'Four is also foundations: health, savings, where you live, the relationships that have lasted. A good time to check the base rather than chase something new.',
        'If you are worried about one particular thing, this sequence is usually read as reassurance: you are not wrong to keep going, the result is simply slower than you wanted.']
    },
    todo: { vi: 'Bạn kiểm tra lại một việc thuộc phần nền: giấy tờ, sức khỏe, hoặc một khoản chi đều đặn.', en: 'Check one thing at the base: papers, health, or a payment that goes out every month.' }
  },
  {
    id: 'n5', digit: 5, ink: '#2F7E96', aura: '#C7EAEE', seen: ['555', '5555', '5:55'],
    name: { vi: 'Số 5 lặp lại', en: 'Repeating fives' },
    short: { vi: 'Có thay đổi đang tới', en: 'Change is coming' },
    keys: { vi: ['thay đổi', 'tự do', 'nới tay ra'], en: ['change', 'freedom', 'loosening'] },
    body: {
      vi: ['555 báo hiệu sự thay đổi. Có thể là công việc, chỗ ở, hoặc cách bạn nhìn một mối quan hệ. Điều đáng nói là thay đổi ấy thường đã bắt đầu từ trước khi bạn kịp nhận ra.',
        'Người ta khuyên rằng khi gặp dãy số này, bạn nên nới tay với những kế hoạch quá chi tiết. Giai đoạn 5 hiếm khi đi theo đúng lịch, và phần lớn những gì tốt đẹp trong giai đoạn này đến từ chỗ bạn không tính trước.',
        'Nếu bạn đang sợ thay đổi, số 5 không hứa rằng mọi việc sẽ dễ. Nó chỉ nói rằng đứng yên cũng không còn là lựa chọn thoải mái nữa.'],
      en: ['555 announces change: work, where you live, or how you see a relationship. What is worth noticing is that it usually began before you noticed it.',
        'When it appears, loosen your grip on plans that are too detailed. A five stretch rarely keeps to a schedule, and most of the good in it arrives from somewhere you did not account for.',
        'If change frightens you, five does not promise it will be easy. It only says that standing still has stopped being comfortable.']
    },
    todo: { vi: 'Bạn thử đổi một thói quen nhỏ trong tuần này, như đi một đường khác hoặc dậy sớm hơn nửa tiếng.', en: 'Change one small habit this week: a different route, or half an hour earlier.' }
  },
  {
    id: 'n6', digit: 6, ink: '#8B5E3C', aura: '#EFDCC4', seen: ['666', '6666', '6:66'],
    name: { vi: 'Số 6 lặp lại', en: 'Repeating sixes' },
    short: { vi: 'Nhìn lại chuyện nhà và chuyện tiền', en: 'Home and money, rebalanced' },
    keys: { vi: ['gia đình', 'chăm sóc', 'cân lại vật chất'], en: ['family', 'caring', 'material balance'] },
    body: {
      vi: ['Trái với những gì nhiều người nghĩ, 666 trong cách đọc này không mang nghĩa xấu. Đây là dãy số nhắc bạn về sự cân bằng giữa phần vật chất và phần còn lại của cuộc sống.',
        'Số 6 gắn với nhà cửa, gia đình và việc chăm sóc người khác. Khi số này xuất hiện nhiều, thường là lúc bạn đang dồn quá nhiều sức cho một phía: hoặc lo kiếm tiền mà quên người nhà, hoặc lo cho người khác mà quên chính mình.',
        'Đây cũng là lời nhắc kiểm tra lại các con số thật: chi tiêu, nợ, những khoản đang chảy đi mà bạn không để ý. Số 6 không bảo bạn từ bỏ vật chất, nó chỉ bảo bạn đặt vật chất đúng chỗ.'],
      en: ['Contrary to what many expect, 666 is not read as an ill omen here. It is the number of balance between the material side of life and everything else.',
        'Six is home, family and looking after people. When it keeps appearing, you are usually pouring too much into one side: earning and forgetting the people at home, or caring for everyone and forgetting yourself.',
        'It is also a nudge to check the real numbers: spending, debts, the small amounts leaving without your noticing. Six does not ask you to give up material things, only to put them in their place.']
    },
    todo: { vi: 'Bạn dành một buổi tối cho người nhà, và một buổi khác để xem lại các khoản chi trong tháng.', en: 'Give one evening to the people at home, and another to last month’s spending.' }
  },
  {
    id: 'n7', digit: 7, ink: '#5A4BA8', aura: '#DCD4F7', seen: ['777', '7777', '7:77'],
    name: { vi: 'Số 7 lặp lại', en: 'Repeating sevens' },
    short: { vi: 'Bạn đang đi đúng hướng', en: 'You are on the right road' },
    keys: { vi: ['may mắn', 'trực giác', 'học hỏi'], en: ['luck', 'intuition', 'study'] },
    body: {
      vi: ['777 được xem là dãy số của sự thuận lợi. Không phải kiểu may mắn trúng thưởng, mà là cảm giác mọi thứ bắt đầu khớp lại sau một thời gian dài rời rạc.',
        'Số 7 gắn với chiều sâu: đọc, học, suy nghĩ, hoặc theo đuổi một câu hỏi mà bạn không giải thích được vì sao lại quan tâm. Khi số này xuất hiện, những gì bạn học trong giai đoạn này sẽ có ích hơn bạn tưởng.',
        'Người ta cũng cho rằng 777 là lúc trực giác của bạn đáng tin. Nếu bạn có một linh cảm rõ ràng về ai đó hoặc về một cơ hội, bạn nên ghi lại nó thay vì gạt đi.'],
      en: ['777 is read as the easy stretch. Not lottery luck, but the feeling of things fitting together after a long time of not fitting.',
        'Seven is depth: reading, studying, thinking, or following a question you cannot explain your interest in. What you learn now turns out to be more useful than it looks.',
        'It is also taken as a sign that your instinct is worth trusting. If you have a clear feeling about a person or an opening, write it down rather than dismissing it.']
    },
    todo: { vi: 'Bạn ghi lại một linh cảm hôm nay, kèm ngày tháng, rồi đọc lại sau một tháng.', en: 'Write down one hunch today with the date on it, and read it again in a month.' }
  },
  {
    id: 'n8', digit: 8, ink: '#1F7A5E', aura: '#C6E8D9', seen: ['888', '8888', '8:88'],
    name: { vi: 'Số 8 lặp lại', en: 'Repeating eights' },
    short: { vi: 'Của cải và sự đền đáp', en: 'Abundance and return' },
    keys: { vi: ['tiền bạc', 'vòng tuần hoàn', 'cho và nhận'], en: ['money', 'cycles', 'give and take'] },
    body: {
      vi: ['Số 8 nằm ngang chính là dấu vô cực, nên 888 thường được đọc là dòng chảy: cái gì đi ra rồi cũng quay về. Trong tiếng Hoa và trong quan niệm dân gian ở Việt Nam, số 8 còn gắn liền với tài lộc.',
        'Khi dãy số này xuất hiện, người ta xem đó là dấu hiệu của một giai đoạn được đền đáp. Công sức bạn bỏ ra trước đây bắt đầu quay lại, đôi khi từ một hướng hoàn toàn khác với chỗ bạn đã bỏ công.',
        'Số 8 cũng nhắc về sự công bằng trong trao đổi. Nếu bạn đang cho đi quá nhiều mà không nhận lại, hoặc ngược lại, đây là lúc để chỉnh cho cân.'],
      en: ['Eight on its side is the infinity sign, so 888 is read as flow: what goes out comes back. In Chinese and Vietnamese folk belief eight is also the number of prosperity.',
        'When it appears it is taken as a season of return. Effort you put in earlier starts coming back, sometimes from a completely different direction than where you spent it.',
        'Eight also asks about fairness in the exchange. If you are giving far more than you receive, or the reverse, this is the moment to even it out.']
    },
    todo: { vi: 'Bạn gửi hóa đơn còn treo, đòi một khoản người ta nợ bạn, hoặc trả một khoản bạn đang nợ.', en: 'Send the invoice you have not sent, ask for what you are owed, or pay what you owe.' }
  },
  {
    id: 'n9', digit: 9, ink: '#8A4B6E', aura: '#F0D4E4', seen: ['999', '9999', '9:99'],
    name: { vi: 'Số 9 lặp lại', en: 'Repeating nines' },
    short: { vi: 'Một chương đang khép lại', en: 'A chapter closing' },
    keys: { vi: ['kết thúc', 'buông', 'dọn chỗ'], en: ['endings', 'release', 'making room'] },
    body: {
      vi: ['999 là dãy số của sự hoàn tất. Một việc trong đời bạn đã đi hết vòng của nó: một công việc, một mối quan hệ, hoặc một cách sống mà bạn đã quen suốt nhiều năm.',
        'Kết thúc trong cách đọc này không mang nghĩa mất mát. Nó có nghĩa là phần việc ấy đã dạy xong những gì cần dạy, và giữ lại lâu hơn nữa chỉ khiến bạn mệt.',
        'Người ta cũng gắn số 9 với việc quay lại giúp người khác. Sau khi đi qua một chặng dài, bạn thường có thứ mà người đi sau đang cần: không phải lời khuyên, mà là kinh nghiệm cụ thể.'],
      en: ['999 is completion. Something in your life has gone all the way round: a job, a relationship, or a way of living you have been used to for years.',
        'Ending, read this way, is not loss. It means that part has finished teaching what it had to teach, and holding on longer only tires you.',
        'Nine is also associated with turning back to help. After a long stretch you usually have what the person behind you needs: not advice, but the specifics.']
    },
    todo: { vi: 'Bạn kết thúc dứt điểm một việc còn dở, và kể lại kinh nghiệm đó cho một người đang bắt đầu.', en: 'Finish one thing you left hanging, and tell someone starting out what it taught you.' }
  },
  {
    id: 'mirror', digit: -1, ink: '#4173B8', aura: '#CFE0F7', seen: ['1010', '1212', '1313', '2121', '1221'],
    name: { vi: 'Số gương và số lặp cặp', en: 'Mirror and paired numbers' },
    short: { vi: 'Hai nửa đang khớp lại', en: 'Two halves lining up' },
    keys: { vi: ['đối chiếu', 'đồng điệu', 'bước tiếp'], en: ['reflection', 'alignment', 'stepping on'] },
    body: {
      vi: ['Số gương là những dãy lặp lại theo cặp như 1010, 1212, 1313, hoặc đọc xuôi đọc ngược đều như nhau như 1221. Người ta xem đây là dấu hiệu của sự đồng điệu: điều bạn nghĩ và điều đang xảy ra bên ngoài đang khớp với nhau.',
        'Trong nhóm này, 1010 thường được đọc là một vòng mới bắt đầu cùng với một sự tỉnh thức nào đó, còn 1212 là lời nhắc bước tiếp trên con đường bạn đã chọn, kể cả khi bạn chưa nhìn thấy hết đường.',
        'Số gương cũng hay xuất hiện khi bạn vừa gặp ai đó và có cảm giác quen thuộc khó giải thích. Dân gian gọi đó là những người đi cùng đường với bạn trong một chặng.'],
      en: ['Mirror numbers repeat in pairs - 1010, 1212, 1313 - or read the same both ways, like 1221. They are taken as a sign of alignment: what you are thinking and what is happening outside are matching.',
        'Within this group, 1010 is usually read as a new cycle arriving with some kind of waking up, and 1212 as a nudge to keep walking the road you chose even when you cannot see all of it.',
        'Mirror numbers also turn up when you have just met someone and feel an ease you cannot explain. Folk reading calls those people fellow travellers for a stretch of the road.']
    },
    todo: { vi: 'Bạn viết ra hai cột: điều bạn đang nghĩ và điều đang thực sự xảy ra. Xem hai cột ấy có khớp không.', en: 'Write two columns: what you are thinking, and what is actually happening. See whether they match.' }
  },
  {
    id: 'ladder', digit: -2, ink: '#B07C3E', aura: '#F7E6C8', seen: ['123', '1234', '234', '2345'],
    name: { vi: 'Số bậc thang', en: 'Ladder numbers' },
    short: { vi: 'Đi từng bước một', en: 'One step at a time' },
    keys: { vi: ['tuần tự', 'tiến độ', 'kiên trì'], en: ['order', 'progress', 'persistence'] },
    body: {
      vi: ['Những dãy số tăng dần như 123, 1234 hay 2345 được xem là dấu hiệu của sự tiến lên theo thứ tự. Bạn không cần nhảy cóc, và cũng không nên.',
        'Dãy số này thường xuất hiện với người đang làm một việc dài hơi và bắt đầu sốt ruột. Nó nhắc rằng phần bạn đã đi qua là có thật, và bước tiếp theo luôn là bước ngay sau chỗ bạn đang đứng.',
        'Trong một số cách đọc, 1234 còn được hiểu là lời khuyên đơn giản hóa: bỏ bớt những việc không thuộc về con đường chính, giữ lại bốn năm việc thật sự quan trọng.'],
      en: ['Rising runs like 123, 1234 or 2345 are read as progress in order. You do not need to skip steps, and you should not.',
        'They tend to appear to people doing something long and starting to fret. The stretch you have covered is real, and the next step is always the one immediately after where you stand.',
        'In some readings 1234 is simply advice to simplify: drop what is not on the main road and keep the four or five things that matter.']
    },
    todo: { vi: 'Bạn viết ra bốn bước tiếp theo của việc bạn đang làm, rồi chỉ làm bước đầu tiên hôm nay.', en: 'Write the next four steps of what you are doing, then do only the first today.' }
  }
];

const angelById = (id) => ANGELS.filter((a) => a.id === id)[0] || null;

/* ---- what a typed number means ----
   In order: all one digit, an alternating or mirrored pair, a rising run, and
   failing those the root it reduces to. The reason is returned with it so the
   screen can say why that reading was chosen. */
function angelRead(raw) {
  const s = String(raw || '').replace(/[^0-9]/g, '');
  if (!s) return null;
  const digits = s.split('').map(Number);
  if (s.length >= 2 && digits.every((d) => d === digits[0])) {
    return { a: angelById('n' + digits[0]), why: 'same', n: s };
  }
  const half = s.slice(0, s.length / 2);
  if (s.length >= 4 && s.length % 2 === 0 && half + half === s && half[0] !== half[1]) {
    return { a: angelById('mirror'), why: 'mirror', n: s };
  }
  if (s.length >= 3 && s === s.split('').reverse().join('')) {
    return { a: angelById('mirror'), why: 'palindrome', n: s };
  }
  if (s.length >= 3 && digits.every((d, i) => i === 0 || d === digits[i - 1] + 1)) {
    return { a: angelById('ladder'), why: 'ladder', n: s };
  }
  let sum = digits.reduce((t, d) => t + d, 0);
  while (sum > 9) sum = String(sum).split('').reduce((t, d) => t + Number(d), 0);
  return { a: angelById(ANGEL_ROOT[sum] || 'n9'), why: 'root', n: s, root: sum };
}

/* ---- the sigil ----
   A ring for the number, with as many points around it as the digit, so each
   entry has a picture of its own rather than a coloured square. */
function angelSigil(a, size) {
  const n = a.digit > 0 ? a.digit : (a.id === 'mirror' ? 4 : 5);
  let rays = '';
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2 - Math.PI / 2;
    const x = 60 + Math.cos(t) * 34, y = 60 + Math.sin(t) * 34;
    rays += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="4.6" fill="' + a.ink + '" opacity=".85"/>'
      + '<line x1="60" y1="60" x2="' + x.toFixed(1) + '" y2="' + y.toFixed(1) + '" stroke="' + a.ink + '" stroke-width="1.1" opacity=".35"/>';
  }
  const face = a.digit >= 0 ? String(a.digit) : (a.id === 'mirror' ? '↔' : '↗');
  return '<svg viewBox="0 0 120 120" class="sigil" style="width:' + (size || 64) + 'px" aria-hidden="true">'
    + '<circle cx="60" cy="60" r="46" fill="' + a.aura + '"/>'
    + '<circle cx="60" cy="60" r="34" fill="none" stroke="' + a.ink + '" stroke-width="1" opacity=".35"/>'
    + rays
    + '<text x="60" y="60" text-anchor="middle" dominant-baseline="central" font-family="Georgia,serif" font-weight="700" font-size="30" fill="' + a.ink + '">' + face + '</text>'
    + '</svg>';
}

/* ---- what people have been seeing ----
   Kept on the device, like the wish jar. The count is the useful part: the
   number you meet most is the one worth reading twice. */
const ANGEL_LOG = {
  all() { const a = store.get('nabu-angel-log', []); return Array.isArray(a) ? a : []; },
  add(n, id) {
    const a = this.all();
    a.unshift({ n: n, id: id, at: Date.now() });
    store.set('nabu-angel-log', a.slice(0, 60));
  },
  clear() { store.set('nabu-angel-log', []); },
  top() {
    const c = {};
    this.all().forEach((r) => { c[r.n] = (c[r.n] || 0) + 1; });
    const keys = Object.keys(c).sort((x, y) => c[y] - c[x]);
    return keys.length ? { n: keys[0], count: c[keys[0]] } : null;
  }
};

/* The number of the day, from today's date, so there is always something to
   read even before anything has been typed. */
function angelToday() {
  const d = new Date();
  const s = String(d.getDate()) + String(d.getMonth() + 1) + String(d.getFullYear());
  return angelRead(s);
}

/* ---- the screens ---- */
function renderAngel() {
  const S = T(), m = $('#main');
  let typed = store.get('nabu-angel-last', '') || '';
  const draw = () => {
    const read = typed ? angelRead(typed) : null, today = angelToday(), top = ANGEL_LOG.top();
    const log = ANGEL_LOG.all().slice(0, 6);
    m.innerHTML = backLink('#/learn', S.learnTitle)
      + '<h1 style="margin-bottom:6px">' + esc(S.angelTitle) + '</h1><p class="muted">' + esc(S.angelIntro) + '</p>'
      + '<div class="card angelpad"><label class="f" for="angelin">' + esc(S.angelAsk) + '</label>'
      + '<div class="angelshow" id="angelshow">' + esc(typed || '—') + '</div>'
      + '<div class="keypad">' + ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✓'].map((k) => '<button type="button" class="key' + (k === '✓' ? ' go' : '') + '" data-key="' + esc(k) + '">' + k + '</button>').join('') + '</div>'
      + '<input id="angelin" class="sr" inputmode="numeric" value="' + esc(typed) + '" aria-label="' + esc(S.angelAsk) + '">'
      + '<p class="hint">' + esc(S.angelPadHint) + '</p></div>'
      + (read && read.a ? angelAnswerHTML(read, true) : '')
      + '<div class="sec"><div class="eyebrow">' + esc(S.angelToday) + '</div>'
      + '<a class="angelrow" href="#/learn/angel/' + esc(today.a.id) + '">' + angelSigil(today.a, 46) + '<span class="b"><b>' + esc(L(today.a.name)) + '</b><span>' + esc(L(today.a.short)) + '</span></span><span class="go">›</span></a></div>'
      + '<div class="sec"><div class="eyebrow">' + esc(S.angelAll) + '</div><div class="angelgrid">'
      + ANGELS.map((a) => '<a class="angeltile" href="#/learn/angel/' + esc(a.id) + '" style="--ink:' + a.ink + ';--aura:' + a.aura + '">' + angelSigil(a, 56) + '<b>' + esc(L(a.name)) + '</b><span>' + esc(a.seen.slice(0, 2).join(' · ')) + '</span></a>').join('')
      + '</div></div>'
      + (log.length
        ? '<div class="sec"><div class="eyebrow">' + esc(S.angelLog) + '</div>'
          + (top && top.count > 1 ? '<p class="hint ok">' + esc(S.angelTop(top.n, top.count)) + '</p>' : '')
          + '<ul class="angellog">' + log.map((r) => '<li><b>' + esc(r.n) + '</b><span>' + esc(fmtDate(isoDate(new Date(r.at)))) + '</span></li>').join('') + '</ul>'
          + '<button type="button" class="btn sm" id="angelclear">' + esc(S.angelClear) + '</button></div>'
        : '')
      + '<p class="hint" style="margin-top:14px">' + esc(S.angelNote) + '</p>';

    $$('[data-key]', m).forEach((b) => b.addEventListener('click', () => {
      const k = b.getAttribute('data-key');
      if (k === '⌫') typed = typed.slice(0, -1);
      else if (k === '✓') {
        if (!typed) return;
        const r = angelRead(typed);
        if (r && r.a) { ANGEL_LOG.add(typed, r.a.id); store.set('nabu-angel-last', typed); toast('✓'); }
        draw();
        const ans = $('.angelanswer', m); if (ans) ans.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      } else if (typed.length < 8) typed += k;
      store.set('nabu-angel-last', typed);
      const show = $('#angelshow'); if (show) show.textContent = typed || '—';
    }));
    const cl = $('#angelclear');
    if (cl) cl.addEventListener('click', () => { if (!confirm(S.confirmDel)) return; ANGEL_LOG.clear(); draw(); });
  };
  draw();
}

function angelAnswerHTML(read, brief) {
  const S = T(), a = read.a;
  const why = { same: S.angelWhySame(read.n), mirror: S.angelWhyMirror, palindrome: S.angelWhyMirror, ladder: S.angelWhyLadder, root: S.angelWhyRoot(read.root) }[read.why];
  return '<div class="card angelanswer" style="--ink:' + a.ink + ';--aura:' + a.aura + '">'
    + '<div class="head">' + angelSigil(a, 64) + '<div><b>' + esc(L(a.name)) + '</b><span>' + esc(L(a.short)) + '</span></div></div>'
    + '<p class="why">' + esc(why) + '</p>'
    + '<p>' + esc(L(a.body)[0]) + '</p>'
    + (brief ? '<p style="margin-top:10px"><a class="btn block" href="#/learn/angel/' + esc(a.id) + '">' + esc(S.angelMore) + '</a></p>' : '')
    + '</div>';
}

function renderAngelOne(id) {
  const S = T(), m = $('#main'), a = angelById(id);
  if (!a) { redirect('#/learn/angel'); return; }
  const i = ANGELS.indexOf(a), prev = ANGELS[(i - 1 + ANGELS.length) % ANGELS.length], next = ANGELS[(i + 1) % ANGELS.length];
  const arrows = '<div class="cardnav"><a href="#/learn/angel/' + esc(prev.id) + '">‹ ' + esc(L(prev.name)) + '</a><a href="#/learn/angel/' + esc(next.id) + '">' + esc(L(next.name)) + ' ›</a></div>';
  m.innerHTML = backLink('#/learn/angel', S.angelTitle)
    + '<div class="detail angelone" style="--ink:' + a.ink + ';--aura:' + a.aura + '">'
    + arrows
    + '<div class="angelhero">' + angelSigil(a, 110) + '<h1>' + esc(L(a.name)) + '</h1><p class="muted">' + esc(L(a.short)) + '</p>'
    + '<div class="chips seen">' + a.seen.map((x) => '<span class="chip">' + esc(x) + '</span>').join('') + '</div></div>'
    + '<div class="chips keys">' + L(a.keys).map((k) => '<span class="chip pink">' + esc(k) + '</span>').join('') + '</div>'
    + L(a.body).map((p) => '<p>' + esc(p) + '</p>').join('')
    + '<div class="ins"><h3>' + esc(S.angelTodo) + '</h3><p>' + esc(L(a.todo)) + '</p></div>'
    + arrows
    + '<p class="hint">' + esc(S.angelNote) + '</p></div>';
}
