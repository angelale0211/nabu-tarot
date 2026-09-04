/* ==================== question-specific readings ====================
   Extracted from Người đọc bài's per-card lectures on the channel Tự Học Tarot
   cùng Người đọc bài (playlists HƯỚNG DẪN TAROT CHI TIẾT — Ẩn Chính and Ẩn Phụ).

   Her videos are conversational: she works through sample questions one after
   another — "miêu tả người yêu tiếp theo của tôi", "có nên chia tay không",
   "thất nghiệp 6 tháng, sắp tới có tìm được việc không". Each entry below is
   one of those questions and the answer she gives, condensed to the page's
   register but keeping her actual reading, including her caveats about when a
   single card cannot answer.

   [category, question, answer] -- unbounded per card.
   Cards not yet transcribed simply omit the section.
*/
const ASK = { vi: {}, en: {} };

const KW = { vi: {}, en: {} };

/* batch 1 - Majors 0-3 (The Fool, Magician, High Priestess, Empress) */
Object.assign(ASK.vi, {
'major-0': [
      ['love', 'Miêu tả người yêu tiếp theo của tôi?',
       'Một người ham cái mới, ngày nào cũng muốn thử điều gì đó khác. Vui, nhưng chưa chắc thích cam kết hay vội kết hôn — muốn biết rõ thì phải rút thêm lá. Nếu chính bạn cũng mang năng lượng này thì mối quan hệ sẽ rất vui mà cũng hơi điên rồ: muốn đi đường dài, hai người nên giống nhau ở giá trị cốt lõi và bù trừ nhau ở tính cách, chứ giống nhau quá thì giống cả tật xấu, chẳng ai giúp được ai.'],
      ['love', 'Đang cãi nhau, có nên chia tay không?',
       'Đây là câu hỏi nhạy cảm — nên rút thêm lá và nghe câu chuyện nền của người hỏi trước. Nếu chỉ là cãi vặt: đừng chia tay, hãy chấm dứt trạng thái cãi nhau bằng một năng lượng mới — cùng đi chơi, đi du lịch, làm điều gì đó mới mẻ cho nhau. Nhiều cặp cãi nhau chỉ vì mối quan hệ quá bình lặng. Nhưng nếu mối quan hệ đã thật sự độc hại thì lá này khuyên bước ra khỏi vùng an toàn, đi tìm trải nghiệm mới, hoặc thử sống độc thân một thời gian.'],
      ['career', 'Đang thất nghiệp, sắp tới có tìm được việc không?',
       'Có thể có. Nhưng đó sẽ là công việc bạn chưa từng làm và chưa có kinh nghiệm — đang học ngành y mà đùng một phát nhận việc kế toán cũng là chuyện thường.'],
      ['career', 'Đang đi làm, sắp tới công việc có gì mới?',
       'Sắp có một dự án mới mà bạn chưa từng có kinh nghiệm bao giờ.'],
      ['career', 'Nhận công việc mới rồi thì nên làm gì?',
       'Chưa có kinh nghiệm thì rất dễ vấp. Hãy học nhiều, hỏi han đồng nghiệp và cấp trên, đi từng bước một, đừng nóng vội. Thông điệp của lá bài chỉ chiếm khoảng 30%; phần lời khuyên sau khi suy luận mới là 70% còn lại.'],
      ['other', 'Trải bài về năng lượng?',
       'Phải chủ động lên. Năng lượng của Gã Khờ là tự mình đi tìm, tự mình tìm tòi — đừng ngồi đợi.']
    ],

    'major-1': [
      ['love', 'Miêu tả người yêu tiếp theo của tôi?',
       'Một người giỏi, và biết mình giỏi. Giỏi trong lĩnh vực họ làm, trong đời sống hằng ngày luôn chủ động nắm bắt thời cơ và tình huống. Về mặt công việc thì không có gì để chê.'],
      ['love', 'Người ấy có yêu tôi nhiều không?',
       'Một mình lá này chưa nói được điều gì. Nếu câu hỏi chỉ là miêu tả người đó thì lá này chưa trả lời được chuyện họ yêu bạn nhiều hay ít.'],
      ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
       'Vẫn chưa khẳng định được nhiều hay ít, vì lá này thiên về hành động chứ không về cảm xúc. Chỉ biết trong mối quan hệ này người ấy chủ động với bạn; còn sự chủ động đó có xuất phát từ tình yêu thuần túy hay không thì phải xem lá khác. Nếu đi kèm Át Cốc thì là có tình cảm và sẵn sàng bộc lộ ra. Năng lượng Nhà Ảo Thuật là yêu thì nói, thích thì nói, không chần chừ nhiều.'],
      ['love', 'Đang cãi nhau, lời khuyên cho mối quan hệ này?',
       'Chủ động. Tìm thẳng đến người ấy mà nói chuyện, chủ động tương tác, chủ động giao tiếp để giải quyết vấn đề với nhau — đừng đi tìm hướng giải quyết từ bên ngoài.'],
      ['love', 'Có nên chia tay không?',
       'Chủ động nắm bắt thời cơ — nhưng chủ động chưa chắc đã là chủ động chia tay. Có thể là chủ động ngồi xuống nói chuyện với nhau, và nói xong lại hiểu nhau hơn rồi không chia tay nữa. Chuyện chia tay hay nghỉ việc là chủ đề nhạy cảm, nên rút thêm lá cho rõ ràng.'],
      ['career', 'Thất nghiệp 6 tháng, sắp tới có tìm được việc không?',
       'Có thể có, với điều kiện bạn phải ra ngoài và chủ động đi tìm. Lá này ra trong câu hỏi đó còn cho bạn suy ngược lại được hoàn cảnh người hỏi: họ đang thụ động, đang ngồi nhà chờ một tin vui từ trên trời rơi xuống.'],
      ['money', 'Tháng này có gì mới không?',
       'Bạn sẽ tự nắm lấy một cơ hội liên quan đến công việc hoặc tài chính — cơ hội do chính bạn tạo ra, tự mở một con đường kiếm tiền cho mình.'],
      ['verdict', 'Có nên nghỉ việc không?',
       'Từ lá này chưa khẳng định được, và có hai trường hợp tùy tình huống người hỏi. Nếu đang ở trong một môi trường làm việc hay một mối quan hệ quá độc hại thì phải chủ động rời đi. Còn nếu chỉ là chán nhất thời thì nên chủ động sắp xếp lại công việc, chủ động nói chuyện, chủ động thay đổi bản thân và những thứ đang có trước đã, rồi mới tính đến giải pháp kết thúc.']
    ],

    'major-2': [
      ['love', 'Miêu tả người yêu tiếp theo của tôi?',
       'Người có trực giác rất mạnh và khả năng quan sát cực tốt, dù là nam hay nữ — phần âm trong họ mạnh, kể cả khi bề ngoài to cao vạm vỡ. Họ ngồi một chỗ và quan sát, rồi dùng chính trực giác của mình để kết luận về một người hay một tình huống.'],
      ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
       'Chưa thể khẳng định ngay là nhiều hay ít. Chỉ biết hành động hiện giờ của họ là ngồi yên quan sát. Có thể họ thích bạn, nhưng đây là tình đơn phương và họ đang có tâm thế giấu đi, nhất quyết không nói cho bạn biết. Lý do giấu thì phụ thuộc vào lá khác: sợ bị từ chối, hoặc họ vốn là người thích ra vẻ bí ẩn, hoặc đang chờ cơ hội vì một trong hai người đã có người yêu. Điểm mấu chốt là họ chưa làm gì cả.'],
      ['love', 'Đang cãi nhau, có nên chia tay không?',
       'Chưa. Cứ bình tĩnh, ngồi chờ đợi và lắng nghe trực giác của bạn nhiều hơn. Nếu đã ngồi một chỗ tĩnh tâm rồi mà trực giác vẫn bảo nên chia tay thì lúc đó hãy chia tay. Còn chia tay ngay bây giờ thì sẽ thành bốc đồng, và bạn sẽ hối hận về quyết định của mình.'],
      ['love', 'Đang cãi nhau, lời khuyên cho mối quan hệ này?',
       'Dành cho nhau một chút thời gian và không gian riêng để cùng ngẫm nghĩ. Có những mối quan hệ càng liên lạc tương tác nhiều lại càng cãi nhau; giãn ra một chút thì tình cảm hai người lại tốt hơn. Đừng cố lôgic hóa kiểu "tại sao anh nói thế, tại sao em nói thế" — rất mệt. Câu trả lời đến từ bên trong, đừng đi tìm câu trả lời từ bên ngoài.'],
      ['career', 'Thất nghiệp 6 tháng, sắp tới có tìm được việc không?',
       'Có thể là vẫn chưa tìm được. Lá này mang năng lượng ẩn giấu, chưa hiện lên, chưa rõ ràng. Nhiều khả năng hướng đi hiện tại của bạn chưa đúng, và bản thân bạn cũng chưa thật sự rõ mình hợp với ngành nào nên đang rải hồ sơ mỗi nơi một ít. Thay vì cứ rải tiếp, hãy bình tĩnh tìm câu trả lời từ bên trong: bạn thật sự thích một công việc như thế nào.'],
      ['career', 'Đang đi làm bình thường, thời gian tới công việc có gì không?',
       'Đừng vội khuyên họ tĩnh tâm xem có nên nghỉ việc — người ta hoàn toàn không có nhu cầu nghỉ việc. Hãy dùng lớp nghĩa còn lại của lá này: thông tin bị ẩn giấu. Có thể ai đó đang làm điều gì đó sau lưng bạn, mà chưa chắc đã xấu — ví dụ sếp đang âm thầm theo dõi bạn từ xa vì muốn cất nhắc bạn lên vị trí quản lý. Giấu điều gì, là ai giấu, và có lợi hay bất lợi thì phải xem các lá tiếp theo.'],
      ['other', 'Rút một mình lá này thì đọc thế nào?',
       'Đây là lá khó diễn giải khi đứng một mình. Cá nhân người đọc bài khi gặp lá này trong trải bài thường phải bốc thêm lá nữa mới đọc được.']
    ],

    'major-3': [
      ['love', 'Miêu tả một người?',
       'Mang năng lượng của người mẹ: rất giỏi chăm sóc người khác và thích chăm sóc người khác, giỏi nội trợ. Bề ngoài cũng có phần điệu đà, nữ tính, hay chăm chút — kể cả khi họ là đàn ông. Khác với Nữ Tư Tế ở chỗ: nữ tính của Nữ Tư Tế nằm bên trong (trực giác, tiềm thức), còn nữ tính của Hoàng Hậu là thứ nhìn thấy được, sờ nắm được.'],
      ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
       'Nhiều khả năng là có tình cảm — lá này thường mang năng lượng tích cực. Nhưng tình cảm đó hơi giống tình mẹ: yêu bạn và chăm sóc bạn từng li từng tí. Sự chăm sóc ấy lành mạnh hay đã thành thái quá thì phải xem kết hợp với những lá khác.'],
      ['love', 'Cãi nhau nhiều, có nên chia tay không?',
       'Phần lớn là không. Có thể hai người thương nhau quá, chăm nhau quá, thành ra để ý cả tiểu tiết. Cần bớt cái năng lượng "người mẹ" đi — đây là tình yêu chứ không phải tình cảm mẹ con.'],
      ['love', 'Cãi nhau, lời khuyên cho mối quan hệ này?',
       'Giãn ra một chút, cho nhau không gian và thời gian để thở. Nhiều khả năng một người đang cho đi quá nhiều — cứ dồn dập chăm sóc, dồn dập cho — khiến người kia ngạt thở.'],
      ['money', 'Tiền bạc của tôi tháng này thế nào?',
       'Nhiều tiền. Không phải kiểu vừa đủ mà là dư ra, còn thừa. Lá này luôn có chất "hơi thừa" — không chỉ đủ mà là thừa.'],
      ['career', 'Thời gian tới có tìm được việc không?',
       'Có. Và công việc đó còn đem lại cho bạn sự tiện nghi, hoặc là môi trường làm việc nhiều năng lượng nữ — dịch vụ, làm đẹp, y tá, điều dưỡng, buôn bán, những việc liên quan đến chăm sóc người khác. Cũng có thể là việc nhiều tiền, hoặc sếp và đồng nghiệp phần lớn là nữ. Nhìn chung đó sẽ là một môi trường tốt.'],
      ['career', 'Đang làm văn phòng bình thường, thời gian tới có biến chuyển gì không?',
       'Sắp tới trong công việc sẽ có lộc, có nhiều dự án hơn để làm và sẽ có nhiều tiền hơn.'],
      ['other', 'Lá này nói gì về chuyện con cái?',
       'Trong 78 lá, đây gần như là lá duy nhất nói trực tiếp về việc có bầu, có em bé. Còn hôn nhân thì được thể hiện qua những lá khác.']
    ]
});

Object.assign(ASK.en, {
'major-0': [
      ['love', 'Describe my next partner',
       'Someone hungry for the new, who wants to try something different every day. Fun, but not necessarily keen on commitment or in any rush to marry — you would need more cards to know. If you carry this same energy the relationship will be great fun and slightly mad: for the long run you want to match on core values and complement each other in temperament, because two people who are too alike share the same faults and neither can help the other.'],
      ['love', 'We keep arguing — should we break up?',
       'A sensitive question; draw more cards and hear the background first. If it is only petty arguing: do not break up. End the arguing with fresh energy instead — go out together, travel, do something new for each other. Plenty of couples argue simply because the relationship has gone too quiet. But if it has genuinely turned toxic, this card says leave the comfort zone: go and find new experiences, or try being single for a while.'],
      ['career', 'I am unemployed — will I find work soon?',
       'Possibly yes. But it will be work you have never done and have no experience in — trained in medicine and suddenly taking an accounting job is exactly this card.'],
      ['career', 'I am employed — anything new coming at work?',
       'A new project is coming that you have never had any experience with.'],
      ['career', 'I have taken the new job — what now?',
       'With no experience it is easy to come unstuck. Learn a great deal, ask colleagues and your manager, go one step at a time, do not rush. The card\'s message is only about 30% of a reading; the advice you reason out afterwards is the other 70%.'],
      ['health', 'A reading about health?',
       'You have to be proactive. The Fool\'s energy is to go looking and dig into it yourself — do not sit and wait.']
    ],

    'major-1': [
      ['love', 'Describe my next partner',
       'Someone capable, who knows they are capable. Good in their own field, and in daily life always quick to take an opportunity or seize a situation. On the work side there is nothing to fault.'],
      ['love', 'Does he love me much?',
       'This card alone tells you nothing here. If the question is only to describe him, this card cannot say whether he loves you much or little.'],
      ['love', 'What are his feelings toward me?',
       'Still not possible to say how much, because this card is about action rather than emotion. All you know is that in this relationship he takes the initiative with you; whether that initiative springs from real love needs another card. Paired with the Ace of Cups it means he has feelings and is ready to show them. The Magician\'s energy is: if he loves you he says so, if he likes you he says so, without much hesitation.'],
      ['love', 'We are arguing — what is your advice for the relationship?',
       'Take the initiative. Go straight to them and talk, interact, communicate, and solve it between you — do not go looking for the solution outside the relationship.'],
      ['love', 'Should we break up?',
       'Act, seize the moment — but taking the initiative does not necessarily mean initiating a breakup. It may mean being the one who sits down to talk, and after talking you understand each other better and do not break up at all. Breakups and resignations are sensitive subjects; draw more cards to get a clearer answer.'],
      ['career', 'Unemployed six months — will I find work soon?',
       'Possibly yes, on condition that you get out there and look actively. This card appearing on that question also lets you reason backwards about the querent: they are being passive, sitting at home waiting for good news to fall out of the sky.'],
      ['money', 'Anything new for me this month?',
       'You will take hold of an opportunity connected to work or money — an opportunity you create yourself, opening your own way of earning.'],
      ['verdict', 'Should I quit my job?',
       'This card alone cannot confirm it, and there are two cases depending on the situation. If you are in a genuinely toxic workplace or relationship, then leave, actively. But if it is only passing boredom, take the initiative to reorganise the work, to talk, to change yourself and what you already have first — and only then consider ending it.']
    ],

    'major-2': [
      ['love', 'Describe my next partner',
       'Someone with very strong intuition and exceptionally strong powers of observation, man or woman — the yin side in them is strong even if they are physically big and tough. They sit still and watch, then use that intuition to draw conclusions about a person or a situation.'],
      ['love', 'What are their feelings toward me?',
       'You cannot confirm straight away whether it is much or little. All you know is that their present action is to sit still and observe. They may like you, but this is one-sided and they are in a mindset of hiding it, determined not to tell you. Why they hide it depends on other cards: fear of rejection, or they are simply the type who enjoys seeming mysterious, or they are waiting for an opening because one of you is already attached. The key point is that they have done nothing yet.'],
      ['love', 'We are arguing — should we break up?',
       'Not yet. Stay calm, sit with it, and listen to your intuition more. If you have settled yourself and your intuition still says break up, then break up. Breaking up right now would be impulsive, and you would regret the decision.'],
      ['love', 'We are arguing — what is your advice for the relationship?',
       'Give each other a little time and space apart to think. Some relationships argue more the more the two interact; open a small gap and the feeling between them improves. Do not try to reason it all out — "why did you say that, why did I say this" — it is exhausting. The answer comes from inside; do not go looking for it outside.'],
      ['career', 'Unemployed six months — will I find work soon?',
       'Possibly still not. This card carries hidden energy: nothing has surfaced, nothing is clear yet. Most likely your current direction is wrong and you are not really clear which field suits you, so you are scattering applications everywhere. Rather than scattering more, settle down and look for the answer inside: what work do you actually want.'],
      ['career', 'Work is normal — anything coming up?',
       'Do not leap to telling them to reflect on whether to quit — they have no wish to quit at all. Use the card\'s other layer instead: concealed information. Someone may be doing something behind your back, and not necessarily something bad — a manager quietly watching you from a distance because they want to promote you. What is hidden, who is hiding it, and whether it helps or harms you needs the following cards.'],
      ['other', 'How do I read this card on its own?',
       'It is a hard card to interpret alone. the reader\'s own practice when it turns up in a spread is to draw an additional card before reading it.']
    ],

    'major-3': [
      ['love', 'Describe a person',
       'They carry the mother\'s energy: very good at caring for others and fond of doing it, good around a home. Their appearance also tends to the groomed and feminine — even when they are a man. The difference from the High Priestess: her femininity is internal (intuition, the subconscious), while the Empress\'s femininity is the visible, tangible kind.'],
      ['love', 'What are their feelings toward me?',
       'Most likely there are feelings — this card usually carries positive energy. But the feeling is somewhat maternal: they love you and look after you in every small detail. Whether that care is healthy or has tipped into too much needs to be read alongside other cards.'],
      ['love', 'We argue a lot — should we break up?',
       'Mostly no. It may be that the two of you love and look after each other so much that you have started picking at small things. Ease off the "mother" energy — this is romantic love, not a mother and child.'],
      ['love', 'We are arguing — what is your advice?',
       'Open a small gap, and give each other room and time to breathe. Most likely one of you is giving far too much — a constant stream of care, here, take this, let me look after you — and it is suffocating the other.'],
      ['money', 'How is my money this month?',
       'Plenty of money. Not the just-enough kind — surplus, with some left over. This card always carries a quality of slight excess: not merely sufficient, but more than needed.'],
      ['career', 'Will I find work soon?',
       'Yes. And the work will bring you comfort, or the workplace will have strong feminine energy — services, beauty, nursing, care work, trade, anything involving looking after other people. It may also be work that pays well, or a workplace where the manager and colleagues are mostly women. On the whole it should be a good environment.'],
      ['career', 'Ordinary office job — any change coming?',
       'Good fortune is coming in your work: more projects to take on, and more money.'],
      ['other', 'What does this card say about children?',
       'Of all 78 cards this is very nearly the only one that speaks directly about pregnancy and having a baby. Marriage is shown through other cards.']
    ]
});

/* batch 2 - Majors 4-6 (Emperor, Hierophant, Lovers) */
Object.assign(ASK.vi, {
  'major-4': [
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Mới yêu nhau khoảng một tháng và muốn biết người ấy có định lâu dài không: có thể là có thật. Nhưng tình cảm đó hơi gia trưởng — người ấy muốn kiểm soát bạn theo cách của họ. Không hẳn là người xấu, nhưng tính gia trưởng và khí chất lấn át người khác thì có. Ở với người này bạn sẽ phải nhún nhường; còn nếu chính bạn cũng mang năng lượng Hoàng Đế thì một nước không thể có hai vua, chắc chắn sẽ cãi nhau. Người ấy muốn nghiêm túc với bạn thật, nhưng sẽ áp đặt và cứng nhắc.'],
    ['love', 'Đang cãi nhau to, lời khuyên cho mối quan hệ?',
     'Hãy ngừng kiểm soát. Buông bỏ việc kiểm soát người kia và kiểm soát mối quan hệ. Có thể bạn luôn mong họ hành xử theo cách của bạn, nhưng trong một mối quan hệ ta phải học nhường nhịn, thỏa hiệp và chấp nhận phần tính cách của người kia. Bạn đang yêu một con người, chứ họ không phải con cái của bạn để bạn áp đặt.'],
    ['career', 'Ba tháng tới công việc có gì cần lưu ý?',
     'Phải lưu ý về sếp. Hoặc là bạn sẽ gặp vấn đề với sếp — một mình lá này chưa nói được là họ ghét hay quý bạn, chỉ biết sẽ có người mang năng lượng "sếp" xuất hiện. Hoặc chính bạn được cất nhắc lên một vị trí có quyền lực: không nhất thiết là trưởng phòng hay giám đốc, có thể chỉ là trưởng nhóm dự án, nhưng là vị thế có người ở dưới để bạn phân công.'],
    ['career', 'Thất nghiệp 6 tháng, sắp tới có tìm được việc không?',
     'Khó nói — lá này không hẳn tích cực mà cũng không hẳn xấu. Có thể bạn tìm được việc, nhưng ở chỗ làm mới sẽ gặp một người mang năng lượng Hoàng Đế: khó tính, hay soi xét, đánh giá, cứng nhắc. Không phải người lươn lẹo — bạn làm tốt thì họ sẵn sàng thưởng. Vấn đề là bạn phải chơi theo luật của họ.'],
    ['career', 'Người mang năng lượng lá này thì hợp làm gì?',
     'Có thể đọc theo hướng: người này tốt nhất đừng đi xin việc nữa mà tự làm cái gì đó của riêng mình, vì họ không hòa hợp được với bất cứ ông sếp nào — họ cần được ở vị thế người đứng đầu. Dĩ nhiên không thể vào công ty là lên quản lý ngay; nhưng nếu bạn còn trẻ, tầm 23–24 tuổi mà mang năng lượng này, thì nên tự làm chủ.'],
    ['other', 'Lá này còn báo hiệu vấn đề với ai?',
     'Vì lá này đại diện cho quyền lực và chính quyền, khi nó ra thì có thể bạn đang gặp vấn đề với bố, với gia đình, với chồng nếu đã lập gia đình, với sếp, hoặc với chính quyền — kể cả chuyện phóng nhanh vượt ẩu, vượt đèn đỏ rồi bị công an bắt. Phân biệt với lá Công Lý: Công Lý nói về giấy tờ, thủ tục, pháp lý, đôi khi chỉ là giữa người với người.']
  ],

  'major-5': [
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Hẹn hò được một tháng, chưa biết người ấy có thật lòng không: có thể là thật lòng, và không những thế người ấy còn muốn kết hôn với bạn. Nhưng nên rút thêm để xem có ra được lá Cốc nào không — trải bài tình cảm mà không có Cốc thì phần cảm xúc không nhiều đến thế. Người ấy muốn kết hôn, nhưng vì yêu bạn hay vì nhà bạn khá giả, bố bạn làm to, nhà bạn mặt phố thì lá này chưa nói được.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Có thể bạn đang cứng nhắc quá và không nhìn được bức tranh toàn cảnh. Bạn đang nghĩ rằng tôi đúng còn anh sai, vì tôi được dạy như thế. Người mang năng lượng lá này rất giỏi làm theo luật — đi đường không bao giờ vượt đèn đỏ — nhưng cũng vì thế mà thiếu những bước ngoặt sáng tạo.'],
    ['love', 'Lời khuyên cho mối quan hệ đang cãi nhau?',
     'Đi học đi. Thay vì cứ tập trung vào mối quan hệ, hãy học một cái gì đó của riêng bạn, tập trung cho bản thân, nâng cao giá trị và kiến thức của mình. Khi đó bạn sẽ bớt nghĩ nhiều đến mối quan hệ và bớt cãi nhau.'],
    ['career', 'Thời gian tới công việc có gì mới?',
     'Có thể bạn sẽ gặp được một người thầy trong công việc, hoặc được sếp cử đi một buổi hội thảo, một khóa học thêm để tăng chuyên môn. Cũng có thể tự bạn đi học kiến thức mới, tự lấy thêm bằng cấp hay chứng chỉ ngoại ngữ phục vụ công việc. Nhìn chung có yếu tố học hành, hoặc làm việc nhóm — bạn có thể được chỉ định vào một nhóm dự án mới, nhưng với tư cách thành viên chứ lá này chưa nói bạn sẽ làm lãnh đạo.'],
    ['other', 'Lá này khác Hoàng Đế ở chỗ nào?',
     'Cả hai đều là luật lệ, hệ thống, nghiêm khắc, cứng nhắc. Khác nhau ở chỗ: Hoàng Đế là người tự tạo ra luật — luật của tôi chứ không phải của người khác. Còn Giáo Hoàng là người nghe theo luật của người khác, làm theo hệ thống có sẵn, làm theo những gì người ta bảo mình.'],
    ['other', 'Lá này còn nói về điều gì?',
     'Tôn giáo, nhà trường, giáo dục, học vấn, kiến thức, hệ thống, truyền thống, văn hóa — và cả hôn nhân, vì hôn nhân cũng là một thứ truyền thống. Nó còn là ảnh hưởng vô thức của nền văn hóa nơi bạn sinh ra: bạn cứ tưởng ai trên thế giới cũng nghĩ như mình, cho đến khi tiếp xúc với một nền văn hóa khác. Trong 78 lá, đây là một trong hai lá nói về làm việc nhóm — lá còn lại là Ba Tiền.']
  ],

  'major-6': [
    ['love', 'Có ai thích tôi không?',
     'Có thể sẽ có hai người cùng thích bạn một lúc, và bạn thích cả hai nên không biết chọn ai. Phân biệt với Bảy Cốc: Bảy Cốc là có rất nhiều vệ tinh vây quanh nhưng chẳng ai hợp, bạn không thích ai cả. Còn lá này là phân vân vì có hai cơ hội cùng lúc mà bạn thích cả hai.'],
    ['love', 'Người ấy có thích tôi không?',
     'Có, chắc chắn là có. Nhưng biết đâu ngoài bạn ra người ấy còn thích thêm một người khác nữa — nên rút thêm lá. Nếu ra kèm những lá đẹp thì khẳng định được là người ấy chỉ thích mỗi mình bạn, thích thật lòng, yêu thật lòng.'],
    ['love', 'Cặp đôi hay cãi nhau, có nên chia tay không?',
     'Khoan đã, đừng vội bảo họ chia tay. Có hai hướng. Hướng lạc quan: đừng chia tay, hai người thật sự có rất nhiều tình cảm với nhau, hãy dùng chính tình cảm đó mà ngồi xuống nói chuyện và cải thiện mối quan hệ, việc gì phải đòi chia tay sớm. Hướng thứ hai: người ấy đang chán, đã có người mới, và đang phân vân giữa bạn và một người khác. Đọc theo hướng nào thì phụ thuộc vào lá đi kèm và vào trực giác của bạn — thông điệp xuất hiện đầu tiên trong đầu khi bạn rút được lá.'],
    ['career', 'Đang thất nghiệp, thời gian tới có việc không?',
     'Có. Và không những có mà thậm chí sẽ có hai cơ hội đến cùng một lúc.'],
    ['career', 'Đang đi làm bình thường, ba tháng tới có biến chuyển gì không?',
     'Có thể bạn sẽ có một cơ hội công việc mới trong khi vẫn đang có việc — tức là phải chọn giữa ở lại và ra đi.'],
    ['love', 'Đang độc thân, sắp tới có người yêu không?',
     'Có hai người đến cùng một lúc, hai mối quan hệ đến cùng một lúc, khiến bạn phải lựa chọn và đắn đo.']
  ]
});

Object.assign(ASK.en, {
  'major-4': [
    ['love', 'What are their feelings toward me?',
     'A month into dating, wanting to know if they mean it long-term: possibly yes, genuinely. But the feeling is somewhat patriarchal — they want to control you their way. Not a bad person as such, but domineering, with an air that overrides other people. With them you will have to give ground; and if you carry Emperor energy yourself, one country cannot have two kings and you will certainly argue. They do seem serious about you, but they will impose a great deal and be rigid about it.'],
    ['love', 'We are arguing badly — what is your advice?',
     'Stop controlling. Let go of controlling the other person and controlling the relationship. You may want them to behave your way, but in a relationship you have to learn to yield, to compromise, and to accept the other person\'s character. You are loving a person — they are not your child for you to impose on.'],
    ['career', 'Anything to watch at work in the next three months?',
     'Watch your manager. Either you will have a problem with them — this card alone cannot say whether they will dislike or favour you, only that someone with "boss" energy is in play — or you yourself get moved up into a position with authority. Not necessarily head of department or director; possibly just project team lead, but a position with people under you to direct.'],
    ['career', 'Unemployed six months — will I find work soon?',
     'Hard to say — this card is neither clearly positive nor clearly bad. You may find work, but at the new place you will meet someone with Emperor energy: exacting, scrutinising, critical, rigid. Not a crooked person — do the work well and they will happily reward you. The catch is that you must play by their rules.'],
    ['career', 'What suits someone carrying this card\'s energy?',
     'One valid reading: this person should stop applying for jobs and start something of their own, because they will not get along with any boss — they need to be the one at the head. Obviously you cannot walk into a company and be a manager immediately. But if you are young, around 23 or 24, and carry this energy, go and work for yourself.'],
    ['other', 'What else does this card warn about?',
     'Because it stands for power and authority, when it appears you may be having trouble with your father, your family, your husband if you are married, your boss, or the authorities — right down to being pulled over for speeding or running a red light. Distinguish it from Justice: Justice is about paperwork, procedure and the legal, sometimes only between two private people.']
  ],

  'major-5': [
    ['love', 'What are their feelings toward me?',
     'A month into dating, unsure whether they are sincere: possibly they are — and more than that, they want to marry you. But draw more cards to see whether any Cups appear; a love spread with no Cups in it does not carry that much feeling. They want to marry, but whether out of love for you or because your family is comfortable, your father is somebody, your house is on a good street — this card does not say.'],
    ['love', 'We are arguing — should we break up?',
     'You may be being too rigid to see the whole picture. You are thinking "I am right and they are wrong, because this is how I was taught." Someone carrying this card\'s energy follows the rules impeccably — never runs a red light — but for that very reason lacks any creative breakthrough.'],
    ['love', 'Advice for a relationship that keeps arguing?',
     'Go and study something. Instead of pouring everything into the relationship, learn something of your own, focus on yourself, raise your own worth and knowledge. Then you will dwell on the relationship less, and argue less.'],
    ['career', 'Anything new coming at work?',
     'You may meet a teacher or mentor at work, or be sent by your manager to a seminar or a training course to sharpen your skills. Or you go and study something yourself — a new qualification, a language certificate for the job. Broadly there is an element of study, or of teamwork: you may be assigned to a new project group, though as a member — this card does not say you will lead it.'],
    ['other', 'How does this differ from the Emperor?',
     'Both are rules, systems, strictness, rigidity. The difference: the Emperor is the one who makes the rules — my law, not someone else\'s. The Hierophant is the one who follows other people\'s rules, works inside the existing system, does what they are told.'],
    ['other', 'What else does this card cover?',
     'Religion, school, education, learning, knowledge, systems, tradition, culture — and marriage too, since marriage is itself a tradition. It is also the unconscious pull of the culture you were raised in: you assume everyone in the world thinks as you do, until you meet another culture. Of all 78 cards it is one of only two about group work; the other is the Three of Pentacles.']
  ],

  'major-6': [
    ['love', 'Does anyone like me?',
     'Possibly two people like you at the same time, and you like them both, so you cannot choose. Distinguish it from the Seven of Cups: there you have plenty of admirers circling but none of them suit you and you like none of them. Here the hesitation comes from having two opportunities at once and wanting both.'],
    ['love', 'Does he like me?',
     'Yes, definitely. But he may like someone else as well as you — draw more cards. If good cards come with it, then you can say he likes only you, sincerely, and loves you sincerely.'],
    ['love', 'A couple who argue a lot — should they break up?',
     'Hold on; do not rush to tell them to break up. There are two directions. The optimistic one: do not break up. The two really do have a great deal of feeling for each other, so use that feeling to sit down and repair the relationship — why demand a breakup so soon. The other: he has grown tired, has someone new, and is wavering between you and another woman. Which reading applies depends on the surrounding cards and on your intuition — the message that arrives first in your head as you turn the card.'],
    ['career', 'Unemployed — will there be work soon?',
     'Yes. And not just work: two opportunities arriving at the same time.'],
    ['career', 'Ordinary job — any change in the next three months?',
     'You may get a new job opportunity while still holding your current one — which means choosing between staying and going.'],
    ['love', 'I am single — is a partner coming?',
     'Two people arrive at once, two relationships at the same time, which forces you into a choice and a good deal of deliberation.']
  ]
});

/* batch 3 - Majors 7-9 (Chariot, Strength, Hermit) */
Object.assign(ASK.vi, {
  'major-7': [
    ['love', 'Miêu tả tính cách một người?',
     'Một người rất mạnh mẽ, luôn quyết tâm cao độ, luôn hướng về phía trước, tham công tiếc việc. Tuy nhiên họ có thể quá tập trung vào công việc mà thờ ơ với những thứ xung quanh — thờ ơ với gia đình, bạn bè, người yêu.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Có thể là có, nhưng tình cảm đó hơi nhanh quá, nóng vội quá. Cảm giác như người ấy muốn có bạn cho bằng được, tán đổ bạn cho bằng được — như thể đang bị ám ảnh bởi việc trở thành người yêu của bạn. Có những người rất hay bị ám ảnh về mục tiêu của chính họ và không dứt ra được. Cũng biết đâu tán đổ xong lại chán.'],
    ['love', 'Cặp đôi hay cãi nhau, có nên chia tay không?',
     'Năng lượng của bạn hiện giờ đang hơi nhanh quá, nóng vội quá — kiểu "cãi nhau mệt quá, thôi chia tay, không yêu đương gì nữa". Hãy bình tĩnh hơn rồi ngồi xuống nói chuyện với nhau. Nguyên tắc của người đọc bài: trừ khi trải bài hiện lên năng lượng quá độc hại, hai người giày vò nhau quá mệt mỏi, hoặc một trong hai đã hết sạch tình cảm, thì mới khuyên dừng lại. Còn tình cảm và chưa quá độc hại thì còn nước còn tát.'],
    ['love', 'Người ấy không thay đổi theo ý tôi, tôi phải làm sao?',
     'Đây là lỗi rất hay gặp: gặp vấn đề là ra sức tìm cách thay đổi đối phương — "làm thế nào để anh ấy nhắn tin nhiều hơn, quan tâm hơn" — thử đủ mọi cách mà họ không đổi, rồi bạn bực bội, dằn vặt chính mình. Thay vì tìm giải pháp từ bên ngoài, hãy thử đổi góc nhìn trước: có thể anh ấy ít nhắn tin vì đang bận xây dựng tương lai cho cả hai. Nhắc nhở nhẹ nhàng, đồng thời thông cảm.'],
    ['career', 'Thất nghiệp, sắp tới có tìm được việc không?',
     'Có thể tìm được, với điều kiện bạn phải mạnh mẽ hơn và quyết tâm hơn. Nếu đã thất nghiệp 6 tháng mà vẫn chưa có việc thì từ lá này hiểu ngay được năng lượng hiện tại của bạn hơi lười, hơi lơi lỏng — rải CV cho có, "ở nhà bố mẹ nuôi cũng được", hoặc muốn làm nhiều thứ nhưng sợ mất nên chẳng bắt đầu cái gì.'],
    ['career', 'Đang đi làm bình thường, ba tháng tới có gì mới?',
     'Sắp tới bạn sẽ bận hơn và tập trung nhiều hơn cho công việc — đến kỳ bận rộn, có thêm dự án mới, nhiều thứ khiến bạn phải dồn sức. Lời khuyên kèm theo: bận thì bận, nhưng đừng quên chăm sóc bản thân, ăn uống lành mạnh, ngủ nghỉ điều độ, và dành thời gian cho gia đình và người yêu.'],
    ['other', 'Lá này khác Mặt Trời ở chỗ nào?',
     'Trong bộ Ẩn Chính có hai lá nói về chiến thắng: Cỗ Chiến Xa (số 7) và Mặt Trời (số 19). Số càng lớn thì hành trình càng xa. Chiến thắng ở giai đoạn số 7 là chiến thắng không vẻ vang — có thể đạt được mục tiêu nhưng mất hết những thứ xung quanh. Còn chiến thắng của Mặt Trời là chiến thắng toàn diện: bạn không chỉ lên được vị trí giám đốc mà vẫn còn gia đình, người yêu, đồng nghiệp, thầy cũ, sếp cũ bên cạnh. Muốn mọi khía cạnh cùng tiến thì không thể đi nhanh — đi nhanh thì đi một mình, đi xa thì đi cùng người khác.']
  ],

  'major-8': [
    ['love', 'Miêu tả tính cách một người?',
     'Một người mạnh mẽ, mạnh một phần vì họ kiểm soát được cơn giận và nguồn năng lượng dồi dào bên trong mình, và vì họ biết mình là ai — biết mình giỏi ở đâu, kém ở đâu. Họ rất tự tin và sẵn sàng nhận "đúng, tôi sai, tôi thiếu sót phần này". Không phải kiểu đụng một cái là xù lông chửi ngược lại. Người cố tỏ ra mạnh mẽ thường là người bên trong biết mình yếu; còn người mang năng lượng lá này thì chẳng phải tỏ ra gì cả, không khoe kiến thức hay tài sản — giống một cây cổ thụ.'],
    ['love', 'Người ấy có thích tôi không?',
     'Có tình cảm. Nhưng họ không sồn sồn, không cố tán đổ bạn bằng mọi cách, vì vốn dĩ họ rất tự tin vào bản thân. Họ thích thì thổ lộ, thể hiện, nhưng không quá quan trọng việc bạn phải trả lời ngay lập tức, không đeo bám. Nếu bạn không thích lại thì thôi, họ nói tạm biệt và không làm phiền nhau nữa.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Khoan hãy chia tay vội. Người đọc bài gần như không bao giờ khuyên người ta chia tay, trừ khi mối quan hệ quá độc hại, hoặc trải bài ra những lá quá nặng như Tòa Tháp, Mười Kiếm, Chín Kiếm, hoặc một trong hai đã hết sạch tình cảm. Còn tình cảm thì hãy ngồi xuống giao tiếp, cùng tìm giải pháp. Và nhớ từ khóa của lá này: dùng sự yêu thương, dịu dàng, mềm mỏng để giải quyết vấn đề, chứ không phải sồn sồn to tiếng.'],
    ['career', 'Thất nghiệp, sắp tới có tìm được việc mới không?',
     'Hãy tự tin lên thì sẽ tìm được. Quãng thất nghiệp có thể đã kéo sự tự tin của bạn xuống và khiến bạn nghĩ mình không đủ giỏi; nghĩ thế là tự kỷ ám thị, và nó vô thức ảnh hưởng đến buổi phỏng vấn. Trước đây bạn có thể rất tự tin, nhưng bị từ chối vài lần rồi giờ đi phỏng vấn lại nói lắp bắp, sợ nói sai. Lá này trả lại lòng tự tin: kỹ năng bạn đang có không thua kém ai, có thể chỉ là chưa gặp thời, hoặc bạn đang ứng tuyển vào những công ty hơi lệch với năng lực của mình.'],
    ['career', 'Thời gian tới công việc cần lưu ý gì?',
     'Gần như không có biến cố gì lớn. Hiện tại bạn đang làm tốt công việc của mình, bạn thích nó, giao việc gì cũng làm trơn tru, và bạn biết mình mạnh gì yếu gì. Thời gian tới vẫn thuận lợi như thế — không lên cũng không xuống. Hơi bằng phẳng, nên nếu bạn đang chờ một cơ hội từ trên trời rơi xuống thì lá này không có.'],
    ['career', 'Sắp có dự án mới, tôi có nên nhận không?',
     'Cứ làm đi. Bạn đủ mạnh mẽ, đủ kỹ năng và đủ chuyên môn.'],
    ['other', 'Lá này ra ở vị trí lời khuyên thì đọc thế nào?',
     'Người đọc bài không đọc bài ngược, và với lá này cá nhân cô chỉ thấy nghĩa tích cực. Khi nó ra ở vị trí lời khuyên, cô đọc là: bạn đang thiếu sức mạnh, thiếu sự kiểm soát bản thân, thiếu bình tĩnh — đang để phần con thú bên trong kiểm soát mình và làm mất đi lý trí tỉnh táo. Bài khuyên bạn vững vàng hơn, mạnh mẽ hơn, và kiểm soát cơn giận.']
  ],

  'major-9': [
    ['love', 'Miêu tả người yêu tiếp theo của tôi?',
     'Một người rất thông thái, có thể hơn bạn nhiều tuổi; nếu không hơn tuổi thì cũng rất già dặn, chín chắn trong suy nghĩ. Nhưng trong chuyện tình yêu, lá này không mang năng lượng lãng mạn bay bổng: người ấy thông thái, nhưng không phải kiểu người tổ chức sự kiện bất ngờ, tiệc sinh nhật bất ngờ hay cầu hôn bất ngờ. Cũng có thể khá khó tính và có xu hướng thích ở một mình.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Có thể là có. Nhưng bản thân người ấy đang trải qua giai đoạn đi tìm câu trả lời cho những câu hỏi của riêng họ, nên đôi khi không dành được nhiều thời gian cho bạn — và đôi khi bạn sẽ thấy khó chịu. Bạn rủ đi xem phim thì họ bảo hôm nay bận, cần ở nhà đọc sách, nghiên cứu nốt vấn đề này. Năng lượng Ẩn Sĩ không xấu, nhưng không phải năng lượng tốt cho chuyện tình cảm.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Khoan hãy chia tay. Cho nhau một chút thời gian và không gian riêng để cùng ngẫm nghĩ, vì có thể cứ gặp mặt là đã cãi nhau rồi. Cả hai nên tĩnh lại và nhìn vào bên trong: vấn đề đến từ đâu, có phải đến từ mình không, và nếu đến từ mình thì nên sửa thế nào.'],
    ['love', 'Vấn đề là do đối phương hay do tôi?',
     'Nhiều cặp đôi khi cãi nhau luôn nghĩ là do đối phương chứ không phải do mình, rồi đi tìm giải pháp bằng cách thay đổi đối phương. Quan điểm của người đọc bài: mỗi lần gặp chuyện trong bất cứ mối quan hệ nào — gia đình, bạn bè hay người yêu — hãy tự hỏi bản thân trước xem có điều gì mình cần thay đổi không. Thay đổi theo hướng tốt hơn là tốt cho chính bạn, không phải chuyện nhục nhã hay đánh mất bản sắc. Có thể hỏi thẳng người kia xem họ thấy bạn cần thay đổi điều gì — và khi người ta góp ý thì nhận lời, xin lỗi, cảm ơn và tìm cách sửa.'],
    ['career', 'Thất nghiệp mấy tháng rồi, sắp tới có tìm được công việc như ý không?',
     'Bài bảo cứ tiếp tục tìm kiếm. Nhưng cũng có thể bạn đang chỉ tìm những công việc thỏa mãn mức lương, trong khi có những công việc mang lại cho bạn mục đích sống nhiều hơn. Bạn tốt nghiệp kinh tế nên cứ tìm quanh mảng kinh tế, mà không nhận ra mục đích thật sự của mình là được giúp đỡ người khác. Hãy tìm về bên trong xem câu trả lời thật sự là gì — và nếu thích giúp người thì có thể làm công việc bình thường rồi tham gia hoạt động xã hội, thiện nguyện, hoặc làm hẳn trong các tổ chức phi chính phủ.'],
    ['career', 'Thời gian tới cần lưu ý điều gì trong công việc?',
     'Có thể bạn sẽ tìm được một người thầy, một người hướng dẫn trong công việc, giúp bạn học thêm kiến thức chuyên môn.'],
    ['timing', 'Bao giờ tôi mới tìm được câu trả lời?',
     'Không dễ tìm, và nó mất thời gian. Với người đọc bài là một năm; với người khác có thể còn lâu hơn.']
  ]
});

Object.assign(ASK.en, {
  'major-7': [
    ['love', 'Describe this person\'s character',
     'Someone very strong, always highly determined, always driving forward, married to their work. But they may focus so hard on work that they become indifferent to everything around them — indifferent to family, friends, partner.'],
    ['love', 'What are their feelings toward me?',
     'Possibly real, but the feeling comes too fast and too hot. It feels as though they want to have you at any cost, to win you over at any cost — as though they were fixated on becoming your partner. Some people become obsessed with their own target and cannot let it go. And who knows: having won you over, they may lose interest.'],
    ['love', 'A couple who argue a lot — should they break up?',
     'Your energy right now is too fast and too hasty — the "I am tired of arguing, let us just break up, I am done with love" reflex. Be calmer, and sit down and talk. the reader\'s rule: unless the spread shows genuinely toxic energy, or the two are tormenting each other past exhaustion, or one of them has completely run out of feeling, she does not advise stopping. While feeling remains and it is not too toxic, there is still something to save.'],
    ['love', 'They will not change however I try — what do I do?',
     'This is a very common mistake: hit a problem and pour all your effort into changing the other person — "how do I make him text more, care more" — try everything, watch him not change, and end up frustrated and tormenting yourself. Instead of hunting for an external solution, try changing your angle first: perhaps he texts little because he is busy building a future for the two of you. Remind him gently, and sympathise at the same time.'],
    ['career', 'Unemployed — will I find work soon?',
     'You can, on condition that you become stronger and more determined. If you have been out of work six months and still found nothing, this card tells you straight away that your current energy is a little lazy, a little slack — sending CVs for the sake of it, "my parents feed me anyway", or wanting to do many things but so afraid of losing that you start none of them.'],
    ['career', 'Ordinary job — anything new in the next three months?',
     'You will be busier and far more focused on work — a busy season, a new project, plenty demanding your concentration. The advice that goes with it: busy is fine, but do not forget to look after yourself, eat properly, keep regular hours, and make time for family and your partner.'],
    ['other', 'How does this differ from the Sun?',
     'Two Majors speak of victory: the Chariot (7) and the Sun (19). The higher the number, the further along the journey. Victory at stage seven is victory without glory — you may reach the goal and lose everything around you. The Sun\'s victory is complete: you not only reach the director\'s chair, you still have family, a partner, colleagues, old teachers and old bosses beside you. To move every part of your life forward together you cannot go fast — go fast and you go alone; go far and you go with others.']
  ],

  'major-8': [
    ['love', 'Describe this person\'s character',
     'Someone strong, and strong partly because they control their temper and the abundant energy inside them, and because they know who they are — where they are good and where they are not. Very confident, and willing to say "yes, I was wrong, I am short in this area." Not the sort who bristles and shouts back. Someone who performs strength usually knows inwardly that they are weak; someone carrying this card performs nothing at all, and does not show off their knowledge or their wealth — like an old tree.'],
    ['love', 'Do they like me?',
     'There are feelings. But they are not frantic about it and will not try to win you at all costs, because they are genuinely confident in themselves. If they like you they say so and show it, but they do not need an answer immediately and they will not chase. If you do not feel the same, they say goodbye and stop troubling you.'],
    ['love', 'We are arguing — should we break up?',
     'Do not rush into it. the reader almost never advises a breakup, unless the relationship is genuinely toxic, or the spread throws up heavy cards like the Tower, the Ten of Swords or the Nine of Swords, or one of the two has completely run out of feeling. While feeling remains, sit down, talk, and look for a solution together. And remember this card\'s keyword: use warmth, gentleness and softness to solve the problem, not raised voices.'],
    ['career', 'Unemployed — will I find new work soon?',
     'Get your confidence back and you will. The stretch of unemployment may have worn your confidence down and convinced you that you are not good enough; that is self-hypnosis, and it works on you unconsciously in interviews. You may have been very confident before, but after a few rejections you now stumble over words, afraid of saying the wrong thing. This card gives the confidence back: your skills are not lesser than anyone\'s — you may simply not have met the right moment, or you are applying to companies slightly out of step with what you can do.'],
    ['career', 'Anything to watch at work?',
     'Almost nothing dramatic. You are doing your job well, you like it, whatever you are given you deliver smoothly, and you know your own strengths and weaknesses. It will keep going favourably — no rise, no fall. Rather flat, so if you were waiting for an opportunity to drop out of the sky, this card does not carry one.'],
    ['career', 'A new project is coming — should I take it?',
     'Go ahead. You are strong enough, skilled enough, and expert enough for it.'],
    ['other', 'How do I read this card in the advice position?',
     'the reader does not read reversals, and personally finds only positive meaning in this card. In the advice position she reads it as: you are short on strength, short on self-control, short on calm — you are letting the animal inside take charge and lose you your clear head. The card is telling you to be steadier, stronger, and to govern your anger.']
  ],

  'major-9': [
    ['love', 'Describe my next partner',
     'Someone genuinely wise, possibly a good deal older than you; and if not older, then mature and settled well beyond their years. But in love this card carries no soaring romantic energy: they are wise, but they are not the person who throws surprise events, surprise birthday parties or surprise proposals. They may also be quite particular, and inclined to prefer their own company.'],
    ['love', 'What are their feelings toward me?',
     'Possibly real. But they are themselves in a phase of working through their own questions, so at times they cannot give you much of their attention — and at times you will find it trying. You suggest a film and they say not today, I need to stay in and read, I need to finish thinking this through. The Hermit\'s energy is not bad, but it is not good energy for a romance.'],
    ['love', 'We are arguing — should we break up?',
     'Not yet. Give each other a little time and space apart to think, because it may be that the moment you meet you are already arguing. Both of you should go quiet and look inward: where is this coming from, is it coming from me, and if it is, how should I put it right?'],
    ['love', 'Is the problem them or me?',
     'Many couples, when they argue, assume it is the other person and go looking for the fix in changing them. the reader\'s view: whenever something goes wrong in any relationship — family, friends, or a partner — ask yourself first whether there is something you need to change. Changing for the better is good for you; it is not humiliating and it does not cost you your identity. You can ask the other person outright what they think you should change — and when they tell you, accept it, apologise, thank them, and work on it.'],
    ['career', 'Out of work for months — will I find the right job soon?',
     'The card says keep looking. But it may also be that you are only chasing work that satisfies the salary, when there is work that would give you far more sense of purpose. You graduated in economics so you keep searching around economics, without noticing that what you actually want is to help people. Look inward for the real answer — and if helping people is it, you can hold an ordinary job and do charity and social work alongside it, or work directly in the non-profit sector.'],
    ['career', 'What should I watch for at work?',
     'You may find a teacher, a mentor at work, who helps you learn more of the specialist knowledge you need.'],
    ['timing', 'When will I find the answer?',
     'It is not easy to find, and it takes time. For the reader it took a year; for someone else it might take longer.']
  ]
});

/* batch 4 - Majors 10-12 (Wheel of Fortune, Justice, Hanged Man) */
Object.assign(ASK.vi, {
  'major-10': [
    ['love', 'Miêu tả tính cách một người?',
     'Nói thẳng là rất khó diễn giải, nên rút thêm lá. Nếu chỉ có mình lá này thì có thể nói: việc bạn và họ gặp nhau là một phần của số phận, hai người ở đây để cùng nhau học một bài học nào đó — và với lá này thì bài học đó khá lớn. Lớn không có nghĩa là xấu: họ có thể dạy bạn những điều tốt bằng cách thức tốt, chứ không nhất thiết phải qua cãi vã hay chia ly.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Cũng khó diễn giải. Có thể nói: việc người ấy đến với bạn là một phần của số phận, và việc họ còn ở cạnh bạn đến tận hôm nay cũng vậy. Còn thật sự họ nghĩ gì về bạn thì hơi khó — nên rút thêm. Cũng có thể họ xem mối quan hệ này là duyên phận.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Phải rút thêm lá. Nếu lá này ra cùng Ác Quỷ và Tòa Tháp thì không nói thẳng là "chia tay đi", mà nói rằng: nếu tiếp tục, kể cả khi bạn cố cứu vãn, thì hai bên đã làm khổ nhau quá nhiều rồi — và việc chia ly rồi sẽ xảy ra, nó là một phần của vũ trụ. Việc bạn gặp họ, làm tổn thương nhau rồi buộc phải chia ly cũng là một phần của số mệnh. Điểm mấu chốt: đừng nghĩ rằng bạn có thể thay đổi họ, hay một mình bạn có thể thay đổi mối quan hệ này. Ngược lại, nếu lá này ra cùng Mười Cốc hay Bốn Gậy thì hai bạn có thể có kết thúc đẹp, thậm chí kết hôn — vậy thì tạm đừng nghĩ đến chuyện chia ly, hãy ngồi xuống nói chuyện.'],
    ['career', 'Thời gian tới có tìm được công việc mới không?',
     'Từ khóa là thay đổi mang tính bước ngoặt. Có thể bạn tìm được việc mới, và công việc đó mang đến một bước ngoặt lớn trong cuộc đời bạn: có thể bạn phải ra nước ngoài làm việc, phải chuyển chỗ định cư, hoặc nhờ công việc này mà bạn được khai sáng, được mở mang đầu óc.'],
    ['career', 'Đang làm văn phòng bình thường, ba tháng tới có gì cần lưu ý?',
     'Sắp có những thay đổi lớn mang tính bước ngoặt trong công việc. Cụ thể thế nào thì phải xem lá đi kèm — có thể là thay đổi bộ phận, được thăng chức, tăng lương; chuyển từ thành phố này sang thành phố khác công tác; cả tòa nhà công ty chuyển địa điểm; hoặc sếp thay đổi, sếp cũ nghỉ hưu và có sếp mới. Thay đổi là lớn, còn xấu hay tốt thì tùy — bản thân lá này mang tính trung lập.'],
    ['other', 'Trải bài ra nhiều lá Ẩn Chính thì hiểu thế nào?',
     'Nếu trong một trải bài mà số lượng Ẩn Chính áp đảo — áp đảo thật sự, chứ không phải 3 với 2 — thì hiểu là vấn đề khó mà thay đổi được, vì nó là một phần sắp đặt của vũ trụ, của số phận. Ngược lại nếu Ẩn Phụ áp đảo thì vấn đề chủ yếu đến từ chính người hỏi: từ tính cách, tâm tư, thái độ của họ. Nếu họ thay đổi thái độ và hành động thì kết quả có thể đẹp hơn.'],
    ['other', 'Vậy số phận có thay đổi được không?',
     'Quan điểm của người đọc bài: mỗi người sinh ra đã có một khoảng vận mệnh định sẵn — ví dụ từ 30 đến 80. Sống tử tế, phát huy hết tiềm năng thì bạn đạt tới mức tối đa là 80, nhưng không bao giờ vượt quá ngưỡng đó. Sống không tốt thì xuống mức 30, nhưng cũng không xuống thấp hơn được nữa. Không phải ai cố gắng cũng thành Einstein — nhưng cố gắng hết mức thì mới phát huy tối đa được cái mình vốn có.']
  ],

  'major-11': [
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Mối quan hệ vừa mới bắt đầu và bạn chưa biết họ có thật lòng không: lá này chưa nói được chuyện bền hay không bền. Chỉ biết cảm xúc họ dành cho bạn hơi thực dụng, không phải một tình yêu thuần khiết — trong trải bài tình cảm thì ra lá Cốc mới là điều đáng mừng nhất. Có thể họ đang cân đo đong đếm xem ai yêu ai nhiều hơn, hoặc trong mối quan hệ này họ được gì và mất gì: yêu bạn thì được tiếng vì nhà bạn khá giả, bạn xinh đẹp, nhưng lại mất tiếng nói, mất quyền hành trong gia đình, mất quyền quản lý tài chính. Họ là người khá tỉ mỉ và soi xét.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Diễn giải theo hướng tạm thời đừng chia tay. Một lớp nghĩa của lá này là cân bằng, công bằng — nên có thể hiện tại bạn đang chưa thật sự cân bằng và chưa nhìn được sự việc, tình huống, mối quan hệ, thậm chí cả con người đó một cách sáng suốt. Lá này rất tỉnh táo và lý trí, có khi còn tỉnh táo quá. Trong mối quan hệ này có thể bạn đang thiếu đi khả năng nhìn mọi thứ bằng lý trí, đang để cảm xúc lấn át. Để cảm xúc lấn át trong tình cảm là bình thường, nhưng cần biết đến mức nào là hợp lý và đến lúc nào thì bắt đầu thiếu lành mạnh, để nhìn ra sự lặp đi lặp lại của chính mình mà điều chỉnh.'],
    ['career', 'Thất nghiệp mấy tháng, thời gian tới có tìm được công việc ưng ý không?',
     'Chưa nói được nhiều, nên rút thêm. Nhưng riêng lá này có thể diễn giải nhiều cách: có thể bạn tìm được việc, và công việc đó liên quan đến hành chính, thủ tục, giấy tờ — bạn làm việc đầu óc chứ không phải chân tay, ví dụ ngân hàng, số má, kế toán, hoặc ngành luật. Hoặc ở chỗ làm mới, sếp của bạn là người mang tính cách Công Lý, rất khắt khe. Cũng có thể bạn đang gặp trục trặc giấy tờ, hoặc CV và hồ sơ của bạn chưa đẹp nên mãi không xin được việc — hãy sửa lại hồ sơ, xem phần nào cần thêm, phần nào cần cắt, và nhờ người giỏi xem giúp.'],
    ['career', 'Thời gian tới công việc có gì cần lưu ý?',
     'Có thể bạn gặp trục trặc về giấy tờ, thủ tục hành chính trong công việc. Ví dụ sếp có quyết định tăng lương nhưng vì thiếu giấy tờ nên chưa tăng được, chưa thăng chức được. Người đọc bài từng chứng kiến một người bạn mới ra trường được phòng muốn tăng lương và thăng chức, nhưng chưa có bằng đại học nên bên nhân sự không duyệt.'],
    ['other', 'Khi có chuyện không hay, tôi nên nhìn vào đâu trước?',
     'Người đầu tiên nên nhìn vào là chính mình: mình đã làm gì đúng, gì sai, đã hoàn thành đầy đủ mọi thứ chưa. Phân tích chán chê rồi mới nhìn sang người đối diện. Thường thì 99% là nên thay đổi bản thân trước — như thế bạn mới có được một cuộc sống an nhiên. Còn nếu lúc nào bạn cũng cho là người kia sai và họ phải xin lỗi mình, thì bạn đang để cho bản ngã và lòng tự tôn thắng, và nếu họ không xin lỗi thì bạn cứ sống trong cái vòng luẩn quẩn đó cả đời.'],
    ['other', 'Bài trả lời không đúng câu tôi hỏi thì sao?',
     'Chuyện đó bình thường. Người hỏi một kiểu mà trải bài trả lời một kiểu là chuyện vẫn xảy ra — hỏi về công việc sắp tới mà bài lại nói về tính cách của sếp. Khi đó cứ nói ra đúng cái hiện lên trong đầu bạn tại thời điểm ấy, vì đây là bộ môn dùng trực giác rất nhiều.']
  ],

  'major-12': [
    ['love', 'Miêu tả một người?',
     'Một người hơi lập dị: cách ăn mặc, cách nhìn nhận cuộc sống của họ tương đối khác người. Nhưng lá này còn có nghĩa là khác biệt mà tốt — khác người nhưng không xấu. Có thể họ có một đặc điểm gì đó không giống số đông, hoặc thuộc cộng đồng LGBT. Chính việc trở thành một người đọc bài Tarot cũng đã là "khác người" rồi — thử về nói với bố mẹ rằng con nghỉ làm nhân viên ngân hàng để đi đọc bài Tarot mà xem.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Chưa nói được nhiều. Có thể là có tình cảm, nhưng lý do họ thích bạn hơi khác những người khác: người ta thích bạn ở hình thể, ngoại hình, tính cách thân thiện, còn họ lại thích bạn vì một lý do hơi khác thường. Hoặc bản thân bạn cũng là người khác người. Trong trải bài tình yêu thì lá này không nói được nhiều.'],
    ['love', 'Cãi nhau, lời khuyên cho mối quan hệ?',
     'Thay vì đi tìm giải pháp, hãy thử nhìn sự việc dưới một góc độ khác. Nhìn được từ góc độ khác đòi hỏi khả năng ở một mình — có thời gian một mình bạn mới tập trung tìm về bên trong và nghĩ thông thoáng được. Hoặc chí ít hãy tìm đến một người mà bạn cảm nhận được là họ tư duy rất khác mình; họ có thể cho bạn một điểm nhìn mới. Đôi khi đổi góc nhìn rồi bạn sẽ nhận ra việc cãi nhau này lại cần thiết cho mối quan hệ, rằng nó không to, không độc hại — và thế là chẳng cần thay đổi thứ gì cả, chỉ cần đổi cách nghĩ là thấy an nhiên hơn rất nhiều.'],
    ['career', 'Sắp tới có tìm được công việc mới không?',
     'Có hai trường hợp. Một: công việc mới của bạn hơi khác người — khác với kỳ vọng của bạn, hoặc khác với ngành bạn đã học. Hai: bài muốn bạn nghĩ thoáng ra. Có thể bây giờ bạn đang khư khư tập trung vào một lĩnh vực nhất định và không chịu mở rộng phạm vi tìm kiếm. Thay vì cứ chăm chăm xin việc ở nước ngoài, sao không thử về Việt Nam, hoặc thử một hướng khác.'],
    ['career', 'Ba đến sáu tháng tới cần lưu ý gì trong công việc?',
     'Không có nhiều cách diễn giải, nên rút thêm lá. Nhưng riêng lá này thì có thể bạn được giao thêm một dự án, và dự án này hơi khác với những gì bạn đã làm — nhưng nhờ nó mà bạn thông suốt hơn, được tiếp cận một góc độ khác trong lĩnh vực của mình. Hoặc bạn gặp được một người hướng dẫn mà phong cách hơi khác người, hoặc lời khuyên họ đưa ra nghe thì hơi lạ, nhưng ngẫm lại thì rất có ích cho bạn.'],
    ['other', 'Ý nghĩa cốt lõi của lá này là gì?',
     'Sau giai đoạn Bánh Xe Số Phận và Công Lý, Gã Khờ chấp nhận một điều gì đó ở mình vốn khác người, và không có ý định thay đổi nó. Khi chấp nhận được mặt đó, anh ta bắt đầu nhìn cuộc sống từ một góc độ khác, và nhận ra bấy lâu nay mình đã gồng mình ép theo một cái khuôn khổ mà xã hội mong muốn. Bài học của lá này: khi gặp vấn đề, thay vì ra ngoài tìm giải pháp, hãy tìm giải pháp từ bên trong — và một trong số đó là thay đổi góc nhìn.'],
    ['other', 'Nên chọn bạn mà chơi như thế nào?',
     'Hãy chơi với cả những người có quan điểm tương đối khác bạn — không phải kiểu hung hăng chỉ chực cãi nhau, mà những người nhìn cuộc sống khác bạn. Chính họ sẽ cho bạn thấy còn những cách nhìn khác nữa. Khi nhìn được cuộc sống đa chiều, bạn sẽ dễ cảm thông hơn: gặp một tình huống, thay vì phán xét, bạn hiểu rằng người này có góc nhìn khác, hoàn cảnh sinh ra và lớn lên khác, nên họ cư xử khác kỳ vọng của mình — và thay vì bắt họ theo ý mình, bạn có thể chấp nhận và tìm cách dung hòa.']
  ]
});

Object.assign(ASK.en, {
  'major-10': [
    ['love', 'Describe this person\'s character',
     'Honestly very hard to read, so draw more cards. From this card alone: the fact that the two of you met is part of fate, and you are here to learn some lesson together — and with this card that lesson is a fairly large one. Large does not mean bad: they may teach you good things by good means, not necessarily through fighting or parting.'],
    ['love', 'What are their feelings toward me?',
     'Also hard to read. What you can say: their coming into your life is part of fate, and their still being beside you today is part of it too. What they actually think of you is harder — draw more. It may also be that they see this relationship as destined.'],
    ['love', 'We are arguing — should we break up?',
     'Draw more cards. If this comes with the Devil and the Tower, do not say outright "break up" — say instead that if you continue, even if you try to save it, the two of you have already hurt each other too much, and the parting will happen; it is part of the universe. Meeting them, wounding each other, and having to part is also part of fate. The key point: do not imagine you can change them, or that you alone can change this relationship. Conversely, if it comes with the Ten of Cups or the Four of Wands, the two of you may well have a happy ending, even marriage — so set the idea of parting aside for now and sit down and talk.'],
    ['career', 'Will I find new work soon?',
     'The keyword is turning-point change. You may well find new work, and it will bring a large turning point into your life: you may have to go abroad for it, or relocate, or through this job find your mind opened.'],
    ['career', 'Ordinary office job — anything to watch in the next three months?',
     'Large, turning-point changes are coming to your work. Exactly what depends on the cards beside it — a change of department, a promotion, a raise; moving from one city to another for the job; the whole company building relocating; or a change of manager, the old one retiring and a new one arriving. The change is big; whether it is good or bad depends, because this card itself is neutral.'],
    ['other', 'What does a spread full of Majors mean?',
     'If the Majors overwhelmingly dominate a spread — genuinely dominate, not three to two — the matter is hard to change, because it is part of the arrangement of the universe, of fate. Conversely, if the Minors dominate, the problem comes mainly from the querent: from their character, their state of mind, their attitude. If they change their attitude and their actions, the result may improve.'],
    ['other', 'So can fate be changed?',
     'the reader\'s view: everyone is born into a set range of destiny — say from 30 to 80. Live decently and develop your full potential and you reach the ceiling of 80, but never beyond it. Live badly and you sink to 30, but no lower. Not everyone who tries becomes Einstein — but only by trying your hardest do you get the most out of what you were given.']
  ],

  'major-11': [
    ['love', 'What are their feelings toward me?',
     'A relationship just beginning and you do not know if they are sincere: this card cannot say whether it will last. Only that the feeling they hold for you is somewhat pragmatic — not a pure love. In a love spread, Cups are what you most want to see. They may be weighing up who loves whom more, or what they gain and lose in this relationship: loving you they gain standing because your family is comfortable and you are beautiful, but they lose their voice, their authority at home, their control of the money. They are quite meticulous and given to scrutiny.'],
    ['love', 'We are arguing — should we break up?',
     'Read it toward not breaking up for now. One layer of this card is balance and fairness — so you may not truly be in balance at the moment, and may not be seeing the situation, the relationship, or even that person clearly. This card is very lucid and rational, sometimes too lucid. In this relationship you may be short on the ability to see things rationally, letting emotion take over. Emotion taking over in love is normal, but you need to know at what point it is reasonable and at what point it turns unhealthy, so you can see your own repeating pattern and adjust it.'],
    ['career', 'Out of work for months — will I find the right job soon?',
     'Not much can be said; draw more. But from this card alone there are several readings: you may find work, and it may involve administration, procedure, paperwork — head work rather than manual work, so banking, figures, accounting, or law. Or at the new workplace your manager is a Justice character: exacting. It may also be that you are hitting paperwork trouble, or that your CV is not good enough, which is why nothing lands — so rework it, see what to add and what to cut, and get someone good at it to look it over.'],
    ['career', 'Anything to watch at work?',
     'You may hit trouble with paperwork or administrative procedure. Your manager may have decided on a raise, but with documents missing it cannot go through, so no raise and no promotion. the reader watched this happen to a friend fresh out of school whose department wanted to promote and raise them, but who did not yet have their degree, so HR would not approve it.'],
    ['other', 'When something goes wrong, where should I look first?',
     'The first person to look at is yourself: what did I do right, what did I do wrong, did I finish everything I should have. Analyse that thoroughly, and only then look at the other person. Ninety-nine per cent of the time you should change yourself first — that is how you get a peaceful life. If you always decide the other person is wrong and owes you an apology, you are letting your ego and your pride win; and if they never apologise, you will live inside that loop for the rest of your life.'],
    ['other', 'What if the cards answer a different question than I asked?',
     'That is normal. The querent asks one thing and the spread answers another — you ask about your job and the cards talk about your manager. When that happens, say exactly what comes into your head at that moment, because this is a discipline that leans heavily on intuition.']
  ],

  'major-12': [
    ['love', 'Describe a person',
     'Someone slightly unconventional: their dress and their way of seeing life are fairly different from most people. But this card means different-and-good — different without being bad. They may have some trait that does not match the majority, or belong to the LGBT community. Becoming a Tarot reader is itself already "different" — try telling your parents you are leaving your bank job to read cards.'],
    ['love', 'What are their feelings toward me?',
     'Not much can be said. There may be feelings, but the reason they like you is a little unlike other people\'s: others like you for your looks, your figure, your warmth, while they like you for some rather unusual reason. Or you are the unconventional one yourself. In a love spread this card does not say a great deal.'],
    ['love', 'We are arguing — what is your advice?',
     'Instead of hunting for a solution, try seeing the thing from a different angle. Seeing from another angle takes the capacity to be alone — only with time alone can you turn inward and think clearly. Or at the very least find someone whose thinking is genuinely different from yours; they may hand you a new vantage point. Sometimes, having changed the angle, you realise the arguing is actually necessary for the relationship, that it is not large and not toxic — and then nothing needs changing at all. Change how you think about it and a great deal of peace arrives.'],
    ['career', 'Will I find new work soon?',
     'Two cases. First: the new work may be somewhat unusual — different from what you expected, or from what you trained in. Second: the card wants you to open your thinking. You may be clinging to one particular field and refusing to widen the search. Instead of doggedly applying abroad, why not try at home, or try a different direction entirely.'],
    ['career', 'What should I watch for at work over the next three to six months?',
     'There are not many readings here, so draw more. But from this card alone: you may be given an extra project, one somewhat unlike what you have done before — and through it you come to see your own field from another angle. Or you meet a guide whose manner is a little unusual, or whose advice sounds odd at first but proves genuinely useful once you sit with it.'],
    ['other', 'What is this card really about?',
     'After the Wheel of Fortune and Justice, the Fool accepts something in himself that is unlike other people, and has no intention of changing it. Accepting that side of himself, he begins to see life from a different angle, and realises he has spent all this time forcing himself into a shape society wanted. The lesson: when a problem comes, instead of going outside for a solution, look inside — and one of those solutions is to change the angle you are looking from.'],
    ['other', 'How should I choose the people around me?',
     'Keep company with people whose views are fairly different from yours — not the aggressive sort spoiling for an argument, but people who see life differently. They are the ones who show you that other ways of seeing exist. Once you can see life from several angles you find it much easier to sympathise: meeting a situation, instead of judging, you understand that this person has a different vantage point and a different upbringing, and so behaves differently from what you expected. And rather than forcing them to your way, you can accept it and look for harmony.']
  ]
});

/* batch 5 - Majors 13-15 (Death, Temperance, Devil) */
Object.assign(ASK.vi, {
  'major-13': [
    ['love', 'Miêu tả tính cách một người?',
     'Có thể là người mang năng lượng Thần Nông, vì Thần Nông lột xác rất nhiều. Cuộc đời họ có khá nhiều biến cố, lên voi xuống chó, và chính vì những biến cố đó mà tư duy của họ phải thay đổi, phải lột xác nhiều lần cho phù hợp với hoàn cảnh. Có những người hai ba chục năm nhận thức gần như không đổi; còn người mang năng lượng lá này thì mỗi lần thay đổi là một lần nâng cấp — như con sâu lột xác thành con bướm, chứ không phải lột xác thành một sinh vật xấu xí hơn.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Khó nói lắm, nên rút thêm. Nếu lá này ra ngay đầu thì có thể người ấy cũng thích bạn, nhưng đang tìm cách chấm dứt hoàn toàn mối quan hệ với người cũ — họ muốn kết thúc dứt điểm chuyện đó rồi mới toàn tâm toàn ý đến được với bạn. Vậy nên có thể bạn hãy chờ họ một chút, cho họ một chút thời gian.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Chưa chắc đã cần phải chia tay. Lá Tử Thần không nói rằng mối quan hệ đang độc hại. Có thể hai bạn nên chấm dứt cái tình trạng hiện tại: cùng nhau ngồi xuống nói chuyện, những buổi nói chuyện sâu sắc nói hết tâm tư nỗi lòng của nhau ra — chấm dứt tình trạng cũ để đón một tình trạng mới.'],
    ['career', 'Thất nghiệp ba bốn tháng, sắp tới có tìm được việc mới không?',
     'Bài đang khuyên bạn chấm dứt tình trạng hiện tại. Một lý do khiến bạn chưa tìm được việc có thể là bạn hơi thiếu tự tin nên phỏng vấn không tốt, hoặc hướng tìm việc của bạn không đúng — bạn đang tìm những công việc hơi lệch so với ngành nghề và khả năng thật sự của mình. Ví dụ bạn thiên về sáng tạo nghệ thuật mà cứ đi xin việc kế toán tài chính, đến khi người ta hỏi thì bạn trả lời bay bổng quá, thiếu lôgic, và họ nghĩ người bay bổng thế thì làm kế toán sao được. Hãy chấm dứt hướng đi sai và tìm hướng đúng cho bản thân.'],
    ['career', 'Sáu tháng tới công việc có vấn đề gì không?',
     'Không phải là nghỉ việc đâu. Lá này luôn nên đọc theo hướng kết thúc một cách chủ động: có thể chính bạn tự kết thúc một công việc không còn phù hợp, hoặc một dự án kết thúc để chuẩn bị làm dự án mới. Còn nó kết thúc hoành tráng hay kết thúc trong thất vọng thì phải rút thêm lá khác.'],
    ['other', 'Vì sao phải buông bỏ, khi tôi vẫn còn tiếc?',
     'Bạn không thể mang theo mọi thứ — giống như cái ba lô, có những thứ không còn cần thiết nữa thì phải bỏ ra, vì sức bạn có hạn. Đôi khi phải học cách buông bỏ dù rất tiếc, rất buồn, dù ta cứ nghĩ liệu buông người này rồi có tìm được ai tốt hơn không. Nói thẳng: nếu người đó, mối quan hệ đó, tình huống đó thật sự tốt đến thế thì bạn đã chẳng phải lăn tăn về việc từ bỏ. Chính vì nó không tốt, vì nó có những bất cập nhất định, nên bạn mới muốn từ bỏ. Hãy tin vào vũ trụ: một cánh cửa khép lại thì một cánh cửa khác tốt hơn đang chờ phía trước.']
  ],

  'major-14': [
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Có thể là có, nhưng cách họ thể hiện tình cảm rất cân bằng. Họ thích bạn nhưng không sồn sồn, không tìm mọi cách để tán đổ bạn — mà cũng không hề lạnh lùng với bạn. Mọi thứ trong chuyện tình cảm với họ đều nhẹ nhàng và đều đặn. Nếu bạn mong một người yêu năng động, sôi nổi, nhiệt huyết cháy bỏng thì lá này không đem lại kỳ vọng đó, và có những lúc sẽ khiến bạn thất vọng — dù bản thân điều đó không tiêu cực. Họ có nhịp độ riêng, và nhiệt độ của họ khá cân bằng: không nhanh, không chậm.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Khoan hãy vội chia tay. Hãy bình tĩnh lại, giữ cái đầu lạnh, và tốt nhất là cân bằng lại — sống điều độ hơn. Đôi khi chính cuộc sống thiếu điều độ đang khiến bạn stress một cách vô thức mà bạn không nhận ra. Nó là một vòng lặp: bận quá nên ngủ muộn, thiếu ngủ; thiếu ngủ thì ăn uống vô tội vạ; đầu óc như có một bức sương mù đặc quánh khiến bạn mất khả năng nhìn mọi thứ sáng suốt. Cân bằng lại không phải chuyện một hai ngày — ít nhất một đến hai tuần. Khi đầu óc tỉnh táo hơn, tự dưng bạn sẽ thấy chuyện cãi nhau với người yêu chẳng đáng, và tự bạn sẽ thấy hướng giải quyết.'],
    ['career', 'Thất nghiệp 6 tháng, có tìm được công việc như ý không?',
     'Lá này ở thời điểm đó đang nói về năng lượng của bạn: hơi lười. Có thể bạn tìm việc theo kiểu chưa chịu khó — có thì có, không thì thôi, mỗi tháng gửi một cái CV, sáu tháng được sáu cái, thì bảo sao không có việc. Năng lượng của bạn đang quá thong thả, mà rõ ràng không có việc thì không có tiền. Muốn có việc thì phải thay đổi thái độ hiện giờ: năng nổ hơn, hoạt bát hơn, hành động nhiều hơn. Lá này tốt, nhưng hơi thiếu tính lửa, hơi thiếu sự hành động.'],
    ['career', 'Ba đến sáu tháng tới công việc có vấn đề gì không?',
     'Hiện tại công việc của bạn đang cân bằng, và thời gian tới nó vẫn cân bằng như thế. Nên nếu bạn đang mong chờ một lời mời đột ngột, hay điều gì đó khiến công việc thay đổi toàn diện, khiến bạn phát triển vượt bậc về kiến thức và con người, thì lá này không có. Từ khóa có thể coi là tiêu cực của nó là dậm chân tại chỗ. Nhưng cũng nên hiểu: không phải lúc nào lao về phía trước cũng là tốt, đôi khi phải học cách nghỉ ngơi và cân bằng. Dĩ nhiên nghỉ ngơi nhiều quá — như anh chàng thất nghiệp sáu tháng — thì lại không hay. Cuộc sống có lúc chạy, có lúc nghỉ: chạy mãi thì chết sớm, mà ngồi suốt thì cơ thể cũng rệu rã.']
  ],

  'major-15': [
    ['love', 'Miêu tả tính cách một người?',
     'Một người đang không kiểm soát được hành vi của bản thân, đang để phần con lấn át. Có thể họ nghiện một thứ gì đó — không nhất thiết là rượu bia: nghiện thuốc lá, nghiện ăn, nghiện ngủ, nhịn ăn, nghiện game, nghiện điện thoại, nghiện Facebook. Cứ ngồi lướt, chỉ đọc tiêu đề rồi đọc bình luận, hết vài tiếng mà chẳng làm được việc gì. Hoặc kiểu "hôm nay ngủ sớm" rồi một phát nhìn lại đã hai giờ sáng.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Tình cảm đó không thuần khiết. Có thể họ chỉ muốn thân thể bạn, chỉ muốn lên giường với bạn. Hoặc họ thấy ở bạn một điều gì đó hơi sai trái mà họ muốn thử — ví dụ bạn đã có gia đình và họ muốn thử xem yêu một người có gia đình thì thế nào. Họ không yêu bạn vì con người bạn, mà vì một lý do nào đó khác.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Mối quan hệ này nhiều khả năng đã độc hại về bản chất, và khả năng cao là nên khuyên chia tay. Bản chất của một mối quan hệ độc hại rất giống năng lượng của cám dỗ và nghiện ngập: bạn biết là sai, nhưng lúc ở cạnh người đó thì thấy sướng; đến khi không ở cạnh họ nữa thì bứt rứt, đứng ngồi không yên, chỉ muốn được gặp lại — mà lúc gặp thì lại cãi nhau, lại chửi bới, lại ghen tuông. Giống hệt người nghiện: lúc phê thì sướng, lúc hết thuốc thì khó chịu, không tập trung được vào bất cứ việc gì, trong đầu chỉ nghĩ khi nào lại được hút. Bạn không còn là chính mình trong mối quan hệ này nữa.'],
    ['love', 'Nhưng tôi không bỏ được thì sao?',
     'Hãy sửa lại cách nói: không phải là không bỏ được, mà là chưa muốn bỏ. Từ "không làm được" chỉ dành cho những việc phi thực tế — như bay lên trời mà không có dụng cụ nào hỗ trợ, hay nhảy từ tầng 10 xuống mà không hề hấn gì. Còn việc bước ra khỏi một mối quan hệ thì không phải là không làm được. Đến ma túy người ta còn có trại cai nghiện, thì một mối quan hệ có gì mà không làm được.'],
    ['career', 'Sắp tới tôi có tìm được công việc như ý không?',
     'Có thể tìm được, nhưng cẩn thận bị lừa. Công việc đó có thể không tốt: lời chào mời ban đầu nghe rất ngọt tai, nhưng công việc hơi vùng xám, hơi vi phạm một chút, hoặc làm nó khiến bạn cảm thấy như đang bán linh hồn cho quỷ dữ — một việc tự nó không xấu, nhưng không hợp với giá trị của bạn. Cũng có thể ở chỗ làm đó có sếp hoặc đồng nghiệp mang năng lượng cám dỗ. Có việc đấy, nhưng hãy cân nhắc kỹ và đọc kỹ điều khoản trước khi nhận.'],
    ['career', 'Ba đến sáu tháng tới công việc có gì cần lưu ý?',
     'Trong môi trường công việc sẽ có những lúc bạn bị cám dỗ. Cám dỗ ở đây có thể là chuyện tình tay ba — bạn thích một người đã có gia đình, hoặc một người đã có gia đình tán tỉnh bạn. Đây là chuyện xảy ra rất nhiều, nhất là với các bạn trẻ mới đi làm xa nhà. Nếu không phải chuyện tình cảm thì là cám dỗ trong chính công việc: bạn làm thủ quỹ và tự dưng thấy tiền nhiều quá; hoặc trong ngân hàng có những lúc hơi vùng xám, người ta đưa phong bì để bạn ký một giấy tờ nào đó. Kế toán rất dễ vào tù. Người đọc bài không khuyên bạn nên làm hay không, chỉ nhắc rằng ngay sau lá Ác Quỷ là lá Tòa Tháp — đổ vỡ, và một cái kết cực kỳ đau đớn.']
  ]
});

Object.assign(ASK.en, {
  'major-13': [
    ['love', 'Describe this person\'s character',
     'Possibly someone carrying Scorpio energy, because Scorpio sheds its skin a great deal. Their life holds a good many upheavals, high one moment and low the next, and it is precisely those upheavals that force their thinking to change and shed several times over to fit the circumstances. Some people\'s outlook barely shifts in twenty or thirty years; someone carrying this card upgrades with every shedding — a caterpillar becoming a butterfly, not something uglier than before.'],
    ['love', 'What are their feelings toward me?',
     'Genuinely hard to say; draw more. If this card comes up first, they may well like you, but they are trying to bring a previous relationship to a complete end — they want that finished properly before they can come to you wholeheartedly. So perhaps wait for them a little, and give them some time.'],
    ['love', 'We are arguing — should we break up?',
     'Not necessarily. The Death card does not say the relationship is toxic. It may mean the two of you should end the current state of things: sit down together and talk, the kind of deep conversation where everything in both your hearts gets said — ending the old state to let a new one in.'],
    ['career', 'Out of work three or four months — will I find something soon?',
     'The card is advising you to end the present state of affairs. One reason nothing has landed may be that you are a little short on confidence and interviewing badly, or that your search direction is wrong — you are chasing work slightly out of line with your field and your real ability. Say you lean toward the creative and artistic, but keep applying for accounting and finance roles; when they question you your answers come out too airy and short on logic, and they conclude someone that dreamy could never do the books. End the wrong direction and find the right one.'],
    ['career', 'Any trouble at work in the next six months?',
     'Not a resignation. This card should always be read as an active ending: you may yourself end a job that no longer fits, or a project ends so a new one can begin. Whether it ends grandly or in disappointment needs another card.'],
    ['other', 'Why let go, when I still regret it?',
     'You cannot carry everything — like a backpack, some things are no longer needed and have to come out, because your strength has limits. Sometimes you must learn to let go even while regretting it, even while grieving it, even while wondering whether you will find anyone better. Put plainly: if that person, that relationship, that situation were genuinely so good, you would not be agonising about leaving. It is precisely because it is not good, because certain things fall short, that you want out. Trust the universe: when one door closes, a better one is waiting ahead.']
  ],

  'major-14': [
    ['love', 'What are their feelings toward me?',
     'Possibly real, but the way they show feeling is very even. They like you without being frantic about it, and will not hunt for every means of winning you — yet they are not cold with you either. Everything in the romance is gentle and steady. If you were hoping for a lively, fiery, burning partner, this card does not deliver that, and at moments it will disappoint you — though there is nothing negative in it as such. They keep their own tempo, and their temperature is well balanced: not fast, not slow.'],
    ['love', 'We are arguing — should we break up?',
     'Do not rush into it. Calm down, keep a cool head, and above all get yourself back in balance — live more moderately. Sometimes it is your own unbalanced life stressing you without your noticing. It is a loop: too busy, so you sleep late and short; short of sleep, you eat carelessly; and a thick fog settles over your head that takes away your ability to see anything clearly. Rebalancing is not a job of a day or two — give it one to two weeks. Once your head is clearer you will find that the fight with your partner was not worth having, and you will see the way through it yourself.'],
    ['career', 'Unemployed six months — will I find the right job?',
     'At that moment this card is describing your own energy: a little lazy. You may be job-hunting without really working at it — if it comes it comes, if not never mind — one CV a month, six in six months, and then wondering why nothing lands. Your energy is far too leisurely, and plainly no work means no money. If you want the job you have to change your present attitude: be more energetic, more active, do more. This card is a good one, but it is short on fire and short on action.'],
    ['career', 'Any trouble at work in the next three to six months?',
     'Your work is balanced now and it will stay balanced. So if you are waiting for a sudden offer, or something to transform the job entirely and vault you forward in knowledge and growth, this card does not hold it. Its arguably negative keyword is marking time. But understand: charging forward is not always the good thing. Sometimes you have to learn to rest and to balance. Rest too much, of course — like the man six months unemployed — and it turns bad the other way. Life has its moments of running and its moments of rest: run forever and you die early, sit forever and the body decays.']
  ],

  'major-15': [
    ['love', 'Describe this person\'s character',
     'Someone not in control of their own behaviour, letting the animal in them take over. They may be addicted to something — not necessarily drink: cigarettes, food, sleep, not eating, games, their phone, social media. Sitting and scrolling, reading only headlines and then the comments, hours gone and nothing done. Or the "early night tonight" that somehow becomes two in the morning.'],
    ['love', 'What are their feelings toward me?',
     'The feeling is not a pure one. They may want only your body, only to sleep with you. Or they see something slightly forbidden in you that they want to try — you are married, say, and they want to know what loving a married person is like. They do not love you for who you are, but for some other reason.'],
    ['love', 'We are arguing — should we break up?',
     'This relationship is most likely toxic in its nature, and there is a strong chance the advice is to end it. A toxic relationship closely resembles the energy of temptation and addiction: you know it is wrong, but beside that person it feels good; away from them you are restless and cannot settle, wanting only to see them again — and when you do see them, the arguing, the shouting and the jealousy start over. Exactly like an addict: the high feels good, and when it wears off there is nothing but discomfort, no concentration on anything, and one thought in your head about when you get the next one. You are no longer yourself inside this relationship.'],
    ['love', 'But I cannot leave — what then?',
     'Correct the wording: it is not that you cannot leave, it is that you do not want to yet. "Cannot" belongs to things that are physically impossible — flying with no equipment, jumping from the tenth floor unhurt. Walking out of a relationship is not in that category. There are clinics for drug addiction; what relationship, then, is impossible to leave?'],
    ['career', 'Will I find the right job soon?',
     'You may. But be careful of being taken in. The work may not be good: the offer sounds sweet at the outset, but the job sits in a grey area, edges toward something improper, or doing it leaves you feeling you are selling your soul — work that is not wrong in itself, but does not sit with your values. Or the workplace holds a manager or a colleague carrying that same tempting energy. There is a job in it, but weigh it carefully and read the terms properly before you accept.'],
    ['career', 'What should I watch for at work over the next three to six months?',
     'There will be moments in the workplace when you are tempted. The temptation may be a love triangle — you are drawn to someone married, or someone married starts flirting with you. It happens a great deal, particularly to young people working far from home. If not a relationship, then temptation inside the work itself: you handle the cash and suddenly there is a great deal of it in front of you; or in banking there are grey moments and someone slides you an envelope to sign off a document. Accountants end up in prison very easily. the reader will not tell you whether to do it — only that the card immediately after the Devil is the Tower: collapse, and an extremely painful ending.']
  ]
});

/* batch 6 - Majors 16-17 (Tower, Star) */
Object.assign(ASK.vi, {
  'major-16': [
    ['love', 'Miêu tả tính cách một người?',
     'Có thể là người vừa trải qua một sự kiện mang tính đổ vỡ và vẫn đang trong trạng thái suy sụp — họ đã thật sự vượt qua được chưa thì phải rút thêm lá. Nhìn chung lá này ra ở câu hỏi miêu tả tính cách thì cũng không hay ho gì: bản thân tính cách họ có thể rất nóng, cục súc, bốc đồng.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Cũng khó. Ví dụ hai người vừa bắt đầu mối quan hệ và mọi thứ đang rất yên ổn mà lại ra lá này: có thể trong quá khứ họ từng gặp một sự cố hay một tổn thương về mặt tình cảm — đang yên đang lành thì bị người yêu ngoại tình, hoặc người yêu bỏ đi lấy người khác — gây ra những cảm xúc sốc và hỗn loạn. Hiện giờ họ đã chữa lành được chưa thì xem tiếp các lá khác. Nếu bài cho thấy vẫn chưa, thì coi như đây là một lời cảnh báo: bạn yêu thì cứ yêu, nhưng trong quá trình đó sẽ thấy có những hành vi cho thấy vết thương của họ vẫn còn.'],
    ['love', 'Chưa chữa lành thì có nên yêu không?',
     'Khi trong bạn còn những tổn thương cũ chưa được chữa lành — những vết thương của đứa trẻ bên trong — bạn sẽ vô thức gây ra đúng vết thương y hệt như thế cho người yêu mình. Nên câu "chưa chữa lành xong thì chưa nên yêu" cũng đúng, vì nó chỉ làm khổ cả hai. Nhưng cũng phải tùy: có những vết thương chỉ trồi lên khi bạn ở trong khía cạnh tình cảm. Bạn có thể rất ổn trong công việc, bạn bè, tài chính, mà vết thương tình cảm thì chưa lành — và nếu không bước vào mối quan hệ nào thì nó không trồi lên được, và bạn cũng không chữa lành được. Đôi khi ta không biết mình còn tổn thương cho đến khi gặp một người mà ta muốn yêu thương. Nếu bạn chọn được người chín chắn, biết bạn có tổn thương và thấy bạn muốn chữa lành, họ sẽ ở cạnh và giúp bạn. Còn nếu gặp người chưa chín chắn thì họ cũng có tổn thương của riêng họ, và họ sẽ bỏ đi.'],
    ['love', 'Cãi nhau, xung đột lớn, có nên chia tay không?',
     'Hãy nhớ lại lá Ác Quỷ ngay trước đó: mối quan hệ của hai bạn có thể đã rất độc hại. Nếu không chia tay sớm hoặc không có cách giải quyết triệt để thì sắp tới sẽ có một biến cố lớn khiến cả hai đều tổn thương sâu sắc. Với lá này, năng lượng cho thấy hai người có xu hướng bạo hành lẫn nhau — người này bạo hành về thể xác, người kia độc mồm độc miệng, bạo hành về mặt cảm xúc và tinh thần. Hãy hiểu rằng gây tổn thương cho một người bằng lời nói cũng đáng lên án chẳng kém gì gây tổn thương lên cơ thể họ.'],
    ['love', 'Người ấy đánh tôi, nhưng ngoài chuyện đó ra vẫn rất thương tôi?',
     'Có những người trong mối quan hệ như vậy, dù bị đánh đến thừa sống thiếu chết vẫn nghĩ rằng "ngoài chuyện đánh ra thì anh ấy vẫn rất thương em". Đến khi tàn tật rồi mới tỉnh ngộ ra rằng người này chẳng hề yêu mình. Ngoài kia thiếu gì người trân trọng và yêu thương bạn mà không hề đánh hay xúc phạm bạn.'],
    ['career', 'Thất nghiệp ba tháng, sắp tới có tìm được việc không?',
     'Có thể hướng tìm việc của bạn không đúng, hoặc bạn lười quá, hoặc CV cẩu thả quá, hoặc đi phỏng vấn nói năng chưa nghiêm túc. Sắp tới có thể không những không tìm được việc mà còn xảy ra một biến cố. Không có việc thường đi đôi với không có tài chính — rồi tự dưng hỏng điện thoại, hoặc phải vào bệnh viện mà không có tiền trả. Lúc đấy bạn mới nhận ra sự cần thiết của tiền và của một công việc ổn định.'],
    ['career', 'Ba đến sáu tháng tới công việc có gì mới?',
     'Có thể có một sự cố, một biến cố lớn và đột ngột trong công việc. Vì Tòa Tháp đứng ngay sau Ác Quỷ: kể cả khi người hỏi không kể vấn đề của họ, bài vẫn lên được năng lượng quanh họ. Miệng họ bảo "cuộc sống tôi ổn, công việc tôi ổn", nhưng có thể họ đang bồ bịch với sếp, đang dính đến người có gia đình, hoặc đang ở trong vùng an toàn quá lâu. Sắp tới sẽ có sự cố khiến họ tỉnh ngộ rằng không thể kéo dài tình huống này lâu hơn được nữa.'],
    ['other', 'Vì sao có người tiền vận tệ mà hậu vận lại tốt?',
     'Theo quan điểm của người đọc bài: khi bạn làm điều gì xấu và nghĩ rằng xung quanh chẳng có ai, thì trời biết, đất biết, vũ trụ biết — nó được ghi vào cuốn sổ nhân quả, và khi bạn chết thì cuốn sổ đó bắt đầu tính. Việc tốt đem ra bù cho việc xấu; nếu việc tốt nhiều quá thì để lại phúc đức cho con cháu hoặc tích đức cho kiếp sau. Khoảng 30 đến 35 năm đầu đời là để trả nghiệp từ kiếp trước, còn hậu vận là lúc ta bắt đầu gặt hái thành quả từ những điều tốt đã làm trong nửa đầu cuộc đời. Chúng ta sinh ra trong hoàn cảnh gia đình mà mình không kiểm soát được — có người rất tốt, có người rất tệ — và theo cô, điều đó liên quan đến nhân quả của kiếp trước.']
  ],

  'major-17': [
    ['love', 'Miêu tả tính cách một người?',
     'Một người khá tích cực, vì họ luôn có niềm tin vào cuộc sống — "tôi sẽ làm được". Lạc quan, và những người mang tâm thế lạc quan thường khá may mắn trong cuộc sống, bởi bạn thu hút những thứ tích cực về phía mình. Nhưng sự lạc quan đó chỉ tốt nếu bạn không quá mơ mộng và có hành động dựa trên nó — chứ không phải ngồi một chỗ tin rằng "tôi sẽ có người yêu" mà không bao giờ ra khỏi nhà; thế thì đến vũ trụ cũng chịu.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Có tình cảm, nhưng có thể họ đang hơi lý tưởng hóa bạn. Họ rất thích bạn, nhưng đang thần thánh hóa bạn lên, hoặc trong mắt họ bạn hơi vĩ đại quá so với bản chất thật. Các bạn trẻ có thể sẽ thích điều đó — được coi như công chúa. Nhưng khi có tuổi rồi bạn chỉ muốn một người đỡ mơ mộng, muốn một mối quan hệ thực tế và bình dị hơn: một người cùng chia sẻ và giúp đỡ nhau trong cuộc sống, một mối quan hệ cân bằng và bình đẳng. Thế là đủ.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Tương lai phía trước của mối quan hệ này vẫn còn hi vọng. Chuyện cãi nhau của hai bạn có thể chỉ là nhất thời, và cái ý muốn chia tay cũng chỉ là nhất thời. Vẫn còn hi vọng, vẫn còn cách để giải quyết xung đột này.'],
    ['career', 'Thất nghiệp ba tháng, tương lai có tìm được công việc phù hợp không?',
     'Có, bạn sẽ tìm được — cứ lạc quan hơn và tin tưởng đi. Nhưng dĩ nhiên không phải là lạc quan ngồi một chỗ. Đừng khuyên người ta lạc quan rồi ngồi im: luật hấp dẫn chỉ thật sự vận hành khi có hành động. Đừng nghĩ rằng "tôi muốn có người yêu với đủ tiêu chuẩn từ A đến Z" trong khi tất cả những gì bạn làm là đi làm rồi về nhà, đi làm rồi về nhà, không gặp gỡ ai mới, cũng không còn nhu cầu cải thiện bản thân — mà vẫn mong yêu được một ngôi sao. Thế thì nó thành đúng phần tiêu cực của lá này: ảo tưởng.'],
    ['career', 'Ba đến sáu tháng tới công việc có gì mới?',
     'Có thể có một cánh cửa cơ hội mới mở ra với bạn. Nhưng khi cơ hội đến, bạn có nắm bắt nó hay không lại là chuyện khác. Cuộc đời mỗi người được cấu thành từ hai yếu tố: phần nghiệp quả phải trả từ kiếp trước và từ những gì ta đã làm trong quá khứ, và phần ý chí tự do của ta. Việc bạn có được cơ hội đó là vũ trụ đang trả lại cho bạn vì một điều tốt bạn đã làm; còn nhận hay không là ý chí tự do của bạn, và nhận hay không nhận sẽ dẫn đến những kết quả khác nhau.'],
    ['other', 'Ra lá này thì chắc chắn có hi vọng chứ?',
     'Không hẳn. Từ khóa tích cực là hi vọng, tương lai tươi sáng, sau cơn mưa trời lại sáng, cơ hội mới. Nhưng từ khóa tiêu cực là bị lý tưởng hóa, kỳ vọng đặt quá cao. Người đọc bài thường rút thêm và hỏi "thế bạn có hành động không" — nếu ra những lá xấu thì bạn sẽ không hành động, chỉ biết ngồi và hi vọng; đến khi cơ hội đến mà không biết cách chớp lấy thì cũng bằng không.']
  ]
});

Object.assign(ASK.en, {
  'major-16': [
    ['love', 'Describe this person\'s character',
     'Possibly someone who has just been through a shattering event and is still in the wreckage of it — whether they have genuinely come through needs another card. On the whole this card is no good omen for a character question: their temperament may be very hot, blunt and impulsive.'],
    ['love', 'What are their feelings toward me?',
     'Also difficult. Say the two of you have just begun and everything is calm, and this card turns up: it may be that in the past they suffered an accident or a wound in love — cheated on out of a clear sky, or a partner who left to marry someone else — leaving shock and chaotic feeling behind. Whether they have healed by now is for the other cards. If the spread says not, treat it as a warning: love them by all means, but along the way you will see behaviour showing the wound is still open.'],
    ['love', 'Should I avoid love until I have healed?',
     'While you still carry old unhealed wounds — the wounds of the child inside — you will unconsciously inflict that very same wound on the person you love. So "do not love until you have healed" is partly right; it only hurts you both. But it depends: some wounds only surface inside that one domain. You may be perfectly fine at work, in friendship, with money, while the wound in love stays unhealed — and if you never enter a relationship it never surfaces and can never be healed. Sometimes we do not know we are still wounded until we meet someone we want to love. If you choose a mature person, one who sees that you are wounded and that you want to heal, they will stay beside you and help. Choose someone unformed and they carry their own wounds, and they will leave.'],
    ['love', 'A serious conflict — should we break up?',
     'Remember the Devil that comes just before it: your relationship may already be deeply toxic. If you do not end it soon, or find a thorough resolution, a large incident is coming that will wound both of you badly. With this card the energy suggests the two of you are tending toward abusing each other — one physically, and one with a sharp tongue, abusing emotionally and mentally. Understand this: wounding a person with words deserves condemnation no less than wounding their body.'],
    ['love', 'They hit me, but apart from that they really love me?',
     'People in relationships like this, beaten within an inch of their lives, still think "apart from the hitting, he really loves me." Only once they are maimed do they wake up and see that this person never loved them at all. There is no shortage of people out there who will treasure and love you without ever hitting or humiliating you.'],
    ['career', 'Out of work three months — will I find something?',
     'Your search direction may be wrong, or you may be too lazy, or your CV careless, or your manner at interviews too slack. Soon you may not only fail to find work but hit an incident. No job usually travels with no money — and then the phone breaks, or you land in hospital with nothing to pay with. Only then does the necessity of money and of a steady job become real to you.'],
    ['career', 'Anything new at work in the next three to six months?',
     'There may be a sudden and sizeable incident. The Tower sits directly after the Devil: even when the querent tells you nothing of their problem, the cards still surface the energy around them. Their mouth says "my life is fine, my work is fine," but they may be entangled with a manager, involved with someone married, or sitting far too long in a comfort zone. An incident is coming that will wake them up to the fact that this cannot be dragged out any longer.'],
    ['other', 'Why do some people have a hard early life and a good later one?',
     'the reader\'s view: when you do something wrong and think nobody is nearby, the sky knows, the earth knows, the universe knows — it goes into the ledger of cause and effect, and when you die the accounting begins. Good deeds offset bad ones; if the good far outweighs, it leaves merit for your descendants or accrues merit for the next life. The first thirty to thirty-five years are spent repaying karma from previous lives, and the later fortune is when you begin harvesting the good you did in the first half. We are born into family circumstances we do not choose — some fortunate, some wretched — and in her view that traces back to the karma of previous lives.']
  ],

  'major-17': [
    ['love', 'Describe this person\'s character',
     'Someone quite positive, because they hold a real faith in life — "I can do this." Optimistic; and optimistic people tend to be lucky, because you draw positive things toward you. But that optimism only serves you if you are not too dreamy with it and you act on it — not sitting at home certain that "a partner will come" while never going out. At that point even the universe cannot help you.'],
    ['love', 'What are their feelings toward me?',
     'There are feelings, but they may be idealising you somewhat. They like you a great deal, but they are putting you on a pedestal — in their eyes you are rather grander than you actually are. Young people may enjoy that, being treated as a princess. But once you are older you want someone less dreamy and a relationship that is realistic and plain: someone to share with and help through life, balanced and equal. That is enough.'],
    ['love', 'We are arguing — should we break up?',
     'The future ahead of this relationship still holds hope. The arguing may be only temporary, and the urge to break up temporary with it. There is hope yet, and a way through this conflict.'],
    ['career', 'Out of work three months — will I find the right job?',
     'Yes, you will — be more optimistic, and trust it. But not optimism sitting still. Never tell someone to be optimistic and then wait: the law of attraction only works with action behind it. Do not think "I want a partner with every quality from A to Z" while all you do is work, go home, work, go home, meeting nobody new and no longer bothering to improve yourself — and still expect to date a star. That is exactly this card\'s negative face: delusion.'],
    ['career', 'Anything new at work in the next three to six months?',
     'A door of opportunity may open. But whether you take hold of it when it comes is another matter. A life is built of two things: the karma to be repaid from previous lives and from what you have already done, and your own free will. Being handed the opportunity is the universe repaying a good deed; whether you accept it is your free will, and accepting or refusing leads to different results.'],
    ['other', 'So this card guarantees hope?',
     'Not quite. Its positive keywords are hope, a bright future, sunshine after rain, a fresh opportunity. But its negative keyword is being idealised, expectations pitched far too high. the reader usually draws more and asks "and will you act?" — if bad cards follow, you will not act, only sit and hope; and an opportunity you do not know how to seize amounts to nothing.']
  ]
});

/* batch 7 - Majors 18-19 (Moon, Sun) */
Object.assign(ASK.vi, {
  'major-18': [
    ['love', 'Miêu tả tính cách một người?',
     'Người này đang thật sự hơi mông lung với cuộc sống: hay lo lắng, hay sợ hãi, làm gì cũng sợ. Năng lượng của họ rất thấp, và khi một người năng lượng cao ngồi cạnh một người năng lượng thấp thì sẽ bị kéo xuống theo. Người mang năng lượng Mặt Trăng muốn làm A, làm B, nhưng khi bạn bảo "muốn A thì nên làm thế này", họ sẽ phản bác "nhưng mà cái đó làm tôi sợ lắm". Bạn bảo "sợ thì thôi đừng làm", họ lại bảo "nhưng tôi vẫn muốn làm". Cuộc hội thoại cứ lặp đi lặp lại không tìm được hồi kết — một vòng luẩn quẩn mà chỉ chính họ mới tự phá vỡ được.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Có thể là có tình cảm, nhưng vì một lý do nào đó họ vẫn còn lo sợ và chưa biết có nên tiến tới hay không. Nỗi lo sợ đó chỉ là ảo tưởng do chính họ tự vẽ lên — nhưng đó là bài học của họ, và nên để họ tự thoát ra khỏi ảo tưởng ấy, mình không nên can thiệp.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Cái ý muốn chia tay có thể xuất phát từ những nỗi sợ và những ảo tưởng không có thật. Có thể bạn đang cãi nhau vì ghen bóng ghen gió, mà ghen thì chủ yếu là do ảo tưởng. Dĩ nhiên chẳng ai muốn thấy người yêu mình khoác tay người khác giới. Nhưng có những lúc ta tự biên tự diễn, tự vẽ ra kịch bản trong đầu: cứ nghĩ anh ta có bồ, chỉ cần anh ta chậm nhắn tin năm phút là "anh đang nhắn cho bồ đúng không". Ban đầu anh ta không hề có bồ, nhưng vì bạn suốt ngày nói thế nên dần dần nó thành thật — bạn đang vô thức thu hút những điều xấu vào cuộc sống mình.'],
    ['love', 'Vậy tôi nên nghĩ thế nào cho đúng?',
     'Thái độ "tôi tin anh ta không có bồ" cũng được, không vấn đề gì. Nhưng tốt nhất là nghĩ: có cũng được, không có cũng được, tôi không nghĩ đến chuyện đó nữa. Nếu thật sự anh ta có bồ thì lúc đấy tôi hiểu là anh ta đã phản bội và tôi chia tay. Hơi thờ ơ một chút với khía cạnh nào thì khía cạnh đó trong cuộc sống thường lại tốt — những người có cuộc đời yên bình thường là những người không sân si bon chen.'],
    ['career', 'Thất nghiệp hai ba tháng, sắp tới có tìm được việc không?',
     'Có thể chính bạn đã thu hút cái việc không tìm được việc, bị loại khi phỏng vấn. Bạn có gửi CV, nhưng khi đi phỏng vấn thì nghĩ "chắc mình lại trượt thôi", "không biết mình có làm tốt không", "chắc người phỏng vấn ghét mình lắm nhỉ". Chưa có kết quả mà bạn đã nghĩ như thế thì nó vô tình làm giảm độ tự tin của bạn xuống; vào phỏng vấn bạn lắp bắp, không thể hiện được đúng năng lực, và người ta nghĩ bạn không có chuyên môn. Sợ hãi một thứ gì đó không sai — ai chẳng có lúc sợ — nhưng bạn có hành động dựa trên nỗi sợ đó hay không mới là khả năng tự làm chủ bản thân.'],
    ['career', 'Ba đến sáu tháng tới công việc có gì cần lưu ý?',
     'Có thể có một biến cố khiến bạn cảm thấy lung lay, hoang mang về tương lai của công việc. Ví dụ đang làm rất bình thường thì đổi sếp — sếp cũ đi lấy chồng hoặc được điều động, sếp mới về, nhân sự thay đổi. Thế là bạn lo không biết sếp mới có quý mình không, dù rõ ràng còn chưa gặp sếp mới mà đã sợ rồi.'],
    ['other', 'Càng sợ thì càng dễ xảy ra thật à?',
     'Đúng. Bạn càng sợ một điều gì thì nó đến càng nhanh — đó là lý do những người luôn sống trong sợ hãi lại hay gặp chuyện đen đủi hơn người khác. Giải thích một cách lôgic: khi sợ một điều gì, bạn vô thức hành động theo hướng thu hút đúng cái kết quả đó. Sợ điểm thấp thì thay vì tập trung học, bạn suốt ngày lo lắng, lên mạng so sánh điểm năm ngoái, hỏi han bạn bè, để đầu óc bấn loạn, rồi vào phòng thi cũng bấn loạn. Cách tốt nhất để thu hút điều tốt không phải là liên tục nghĩ tích cực về nó, mà là chẳng nghĩ gì cả: cứ để khía cạnh đó thả trôi, tốt thì vui, không tốt thì hơi buồn một chút cũng không sao. Việc của mình là làm hết sức — còn kết quả thì thôi.']
  ],

  'major-19': [
    ['love', 'Miêu tả tính cách một người?',
     'Một người rất tỏa sáng, có hào quang toát ra, có khí chất thu hút mọi người, có khả năng lãnh đạo, lúc nào cũng lạc quan yêu đời và ai cũng thích họ. Nhưng họ lại có thể chẳng có bạn thân — có thể vì cái tôi quá cao, hoặc vì lúc nào cũng muốn một mình mình đứng dưới ánh đèn sân khấu. Cuối cùng bạn bè thân thiết bỏ đi hết, bởi giữ được một tình bạn thân thì cần nhường nhịn nhiều, mà Mặt Trời không phải người thích nhường nhịn.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Hai người mới đang tìm hiểu, chưa yêu nhau: có thể họ coi bạn là mặt trời của họ. Họ rất rõ ràng về tình cảm của mình, rõ ràng về việc họ muốn gì ở bạn và muốn mối quan hệ này phát triển ra sao. Nói chung trong chuyện tình cảm, lá này phần lớn thời gian là tích cực.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Bài khuyên hai bạn cần sáng tỏ hơn, rõ ràng và thông suốt hơn trong mối quan hệ này. Với lá này, tình trạng hiện tại có thể đang là hướng ngược lại: hai người chưa giao tiếp rõ ràng với nhau, người này muốn gì người kia muốn gì đều chưa rõ. Hãy ngồi xuống và nói cho họ biết bạn muốn gì, rồi hỏi họ muốn gì. Phần lớn vấn đề trong các mối quan hệ đến từ việc không hiểu ý nhau: một bên không nói mà cứ mong bên kia hiểu, bên kia thì ngồi đoán già đoán non hành động của bên còn lại.'],
    ['career', 'Thất nghiệp ba tháng, có tìm được công việc như ý không?',
     'Có thể sẽ tìm được, và tương lai rất sáng rõ, rực rỡ. Đó là công việc bạn hằng ao ước, làm được lâu dài, và là công việc khiến bạn cảm thấy như một chiến thắng.'],
    ['career', 'Sáu tháng đến một năm tới công việc thế nào?',
     'Hiện tại công việc của bạn vốn đã tốt rồi, nên thời gian tới nó sẽ tiếp tục tốt thôi, không có gì cần phải lưu ý thêm. Đó là khi bạn chỉ rút mỗi lá này; rút thêm lá khác thì câu chuyện sẽ thay đổi ít nhiều.'],
    ['other', 'Lá này có phải lúc nào cũng tốt không?',
     'Đa phần là nghĩa tích cực, thỉnh thoảng mới có nghĩa tiêu cực, và tất cả phụ thuộc vào trực giác của bạn. Nếu bạn là người bi quan nhìn đời màu xám thì phần trăm tiêu cực sẽ nhiều hơn. Nhưng khi đã làm người đọc bài thì hãy nhìn bằng một lăng kính khách quan, chứ không phải màu hồng — bởi người nghe chịu ảnh hưởng khá nhiều từ lời bạn nói, và nếu bạn nói những câu khiến họ càng mông lung hơn thì có thể coi là khẩu nghiệp. Người đọc bài cũng thêm một lưu ý riêng từ chiêm tinh: mặt trời mang năng lượng rực rỡ và nhiều sức sống, nhưng tính chất của nó là đến quá gần thì bị thiêu đốt.']
  ]
});

Object.assign(ASK.en, {
  'major-18': [
    ['love', 'Describe this person\'s character',
     'This person is genuinely somewhat adrift: forever worrying, forever afraid, afraid of doing anything at all. Their energy runs very low, and a high-energy person sitting beside a low-energy one gets pulled down with them. Someone carrying Moon energy wants to do A, wants to do B, but when you say "if you want A, do this," they push back with "but that frightens me." You say "then do not do it," and they say "but I still want to." The conversation loops with no end in sight — a closed circle only they can break.'],
    ['love', 'What are their feelings toward me?',
     'There may well be feelings, but for some reason they are still afraid and do not know whether to move forward. That fear is only an illusion they have painted themselves — but it is their lesson, and they should find their own way out of it. You should not step in.'],
    ['love', 'We are arguing — should we break up?',
     'The urge to break up may be coming out of fears and illusions with nothing behind them. You may be arguing out of jealousy over shadows, and jealousy is mostly illusion. Of course nobody wants to see their partner arm in arm with someone else. But there are times when we write the whole script ourselves: convinced he has someone, and the moment he is five minutes slow to reply — "you are texting her, aren\'t you." At the start he had no one; but because you say it every day, in time it becomes true. You are unconsciously drawing bad things into your own life.'],
    ['love', 'So how should I be thinking instead?',
     'The attitude "I trust that he has no one else" is fine, no problem with it. But better still: he might, he might not, and I am not going to think about it any more. If he really does have someone, then I will understand that he has betrayed me, and I will leave. Be a little indifferent about an area of life and that area usually goes well — the people with peaceful lives tend to be the ones who do not fret and compete.'],
    ['career', 'Out of work two or three months — will I find something?',
     'You may have drawn the failure toward you yourself. You send the CVs, but going into the interview you are thinking "I will probably be rejected," "I do not know if I did well," "the interviewer probably dislikes me." You have no result yet and you already believe it, and it quietly lowers your confidence; in the interview you stumble, you never show what you can actually do, and they conclude you lack the skill. Being afraid of something is not wrong — everyone is, sometimes — but whether you act out of that fear is the real measure of self-mastery.'],
    ['career', 'What should I watch for at work in the next three to six months?',
     'There may be an incident that leaves you shaken and uncertain about your future in the job. Say everything is ordinary and then the manager changes — yours leaves to marry, or gets reassigned, a new one arrives and the staffing shifts. And you start worrying about whether the new manager will like you, though plainly you have not even met them yet and the fear is already there.'],
    ['other', 'Does fearing something really make it happen?',
     'Yes. The more you fear a thing the faster it arrives — which is why people who live in fear meet more misfortune than others. The logical version: when you fear something, you unconsciously behave in ways that pull that exact outcome toward you. Afraid of a low mark, you spend the days worrying instead of studying, comparing last year\'s results online, asking around, letting your head go frantic — and walk into the exam frantic. The best way to draw a good thing in is not to think positively about it constantly, but not to think about it at all: let that part of life run loose. Good, and you are glad; not good, and you are a little sad, and that is fine. Your part is to do everything you can — the result is not yours to hold.']
  ],

  'major-19': [
    ['love', 'Describe this person\'s character',
     'Someone genuinely radiant, with an aura about them, a bearing that draws people in, real capacity to lead, always optimistic and glad of life, and everyone likes them. But they may have no close friends — perhaps because the ego runs too high, or because they always want to be the only one under the stage lights. In the end the close friends drift away, because keeping a close friendship takes a great deal of giving way, and the Sun is not someone who cares to give way.'],
    ['love', 'What are their feelings toward me?',
     'Two people still getting to know each other, not yet together: they may see you as their sun. They are very clear about their feelings, clear about what they want from you and how they want the relationship to grow. In matters of love this card is positive most of the time.'],
    ['love', 'We are arguing — should we break up?',
     'The card is telling you both to be clearer, brighter, more transparent inside this relationship. With this card the current state may be exactly the opposite: the two of you have not communicated plainly, and neither of you knows what the other actually wants. Sit down and tell them what you want, then ask what they want. Most problems in relationships come from not reading each other: one side says nothing and expects to be understood, and the other sits guessing at what the first one\'s behaviour meant.'],
    ['career', 'Out of work three months — will I find the right job?',
     'You may well. The future here is bright and radiant, and the work is the kind you have long wished for, work you can stay in, work that will feel like a victory.'],
    ['career', 'How will work be over the next six months to a year?',
     'Your work is already good, so it will simply carry on being good; there is nothing further to flag. That is with this card alone — draw others and the story shifts.'],
    ['other', 'Is this card always good?',
     'Mostly positive, occasionally not, and it all rests on your intuition. If you are a pessimist who sees life in grey, the negative share will grow. But once you read for other people, look through an objective lens rather than a rose-tinted one — the listener is quite influenced by what you say, and words that leave them more adrift than you found them count as a kind of harm done by speech. the reader adds one note of her own from astrology: the Sun carries radiant, vital energy, but its nature is that whoever comes too close is scorched.']
  ]
});

/* batch 8 - Majors 20-21 (Judgement, World) -- completes the Major Arcana */
Object.assign(ASK.vi, {
  'major-20': [
    ['love', 'Miêu tả tính cách một người?',
     'Một người đã có sự thông thái và hiểu biết nhất định về cuộc đời. Lưu ý: thông thái về cuộc sống khác với thông minh hay nhiều kiến thức — đây là cái hiểu đến từ những sự kiện họ đã trải qua, nên họ là người hiểu ý nghĩa cuộc sống. Nếu họ còn trẻ thì năng lượng này cho thấy họ già trước tuổi.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Cũng là năng lượng tích cực: có tình yêu dành cho bạn, nhưng tình yêu này mang tính tâm linh nhiều. Họ thích bạn không xuất phát từ ngoại hình hay tài chính, mà từ tính cách và tâm hồn bạn — họ cảm thấy có một sự liên kết đặc biệt với linh hồn bạn. Nhưng nếu bạn từ chối thì với họ cũng không sao: họ không tìm mọi cách để trở thành người yêu bạn hay biến bạn thành vợ. Họ có thể thẳng thắn bày tỏ tình cảm, nhưng tôn trọng lựa chọn của bạn. Đây không phải tình yêu vụ lợi, cũng không phải kiểu yêu quá nhiều lửa và ghen tuông, cũng không phải yêu đương tính toán.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Hãy nhìn lại cả hành trình từ đầu đến giờ của hai bạn: đã đi được bao lâu rồi, vì sao ban đầu bạn yêu người này; hãy nhớ về những kỷ niệm tốt và những mặt tốt mà bạn từng thích ở họ. Đừng chỉ vì một sự việc mà đòi chia tay ngay. Và từ chính việc bài đưa ra lời khuyên như vậy, ta suy ra được rằng vấn đề hai bạn đang cãi nhau là vấn đề nhỏ — nếu là chuyện lớn, hay mối quan hệ đã độc hại, hay có người cắm sừng, thì đã không ra lá này.'],
    ['career', 'Thất nghiệp ba tháng, thời gian tới tìm được việc mới không?',
     'Thay vì cứ ra ngoài rải CV thì hãy nhìn về bên trong. Đặc biệt là xem lại những ước mơ hồi còn nhỏ, hoặc mong muốn thật sự của bạn. Có thể bạn đang đâm đầu đi tìm những công việc mà bạn không muốn làm, chỉ vì không còn lựa chọn nào khác. Và vì bạn đang đi không đúng hướng nên vũ trụ không mở đường cho bạn. Khi bạn thật sự đi đúng hướng, chỉ cần bước được bước đầu tiên là bạn sẽ tự nhìn thấy bước tiếp theo — không hẳn là dễ, nhưng bạn biết ngay phải làm gì. Còn cứ loanh quanh mãi trong cảm giác hoang mang không biết đi đâu về đâu, thì tức là chưa đi đúng hướng.'],
    ['career', 'Cuối năm công việc có gì thay đổi, có cơ hội mới không?',
     'Bạn đang làm công việc bạn thích rồi, năng lượng hiện giờ vốn đã tốt, nên thời gian tới nó vẫn tiếp tục tốt như thế. Có thể sẽ có cơ hội mới. Chẳng có gì để khuyên thêm ngoài việc: hãy tiếp tục giữ được tần số cao như hiện tại.'],
    ['other', 'Thế nào là "tần số cao"?',
     'Khi bạn ở tần số cao, một cơ hội mới hay một điều vui đến với cuộc sống sẽ không khiến bạn nhảy cẫng lên "sướng quá, hạnh phúc quá" — bạn chỉ cười và thấy tốt, thấy yên bình. Và đồng thời khi một chuyện không tốt xảy ra, bạn cũng chỉ "thế à", cũng buồn, nhưng rồi thôi. Còn người phản ứng kiểu "sướng quá" thì lúc gặp chuyện buồn cũng sẽ buồn đến sống đi chết lại. Biên độ dao động cảm xúc càng lớn thì càng cho thấy bạn chưa điều khiển được cảm xúc, chưa chín chắn. Khi biên độ cảm xúc của bạn nhẹ nhàng — dù thú cưng nhà bạn mất hay bạn trúng xổ số, sự khác biệt trong cảm xúc cũng không quá lớn — thì đó mới là trưởng thành. Bạn vẫn có cảm xúc, không hề vô tâm, nhưng bạn hiểu mọi thứ chỉ là một phần của cuộc sống: đến rồi đi, đi rồi đến.'],
    ['other', 'Làm công việc mình không thích thì có sao không?',
     'Cũng được thôi. Nhưng cuộc sống là do mình chọn. Đa phần mọi người đang làm công việc họ không thích để kiếm tiền, nhưng điều đó không có nghĩa bạn cũng phải sống một cuộc đời như thế — chẳng ai bắt bạn phải làm một công việc bạn không thích cả. Chúng ta có quyền lựa chọn phong cách sống; chúng ta là diễn viên chính trong cuộc đời mình, và cũng là đạo diễn luôn. Tại sao không làm công việc mình thích và kiếm tiền từ chính công việc đó?']
  ],

  'major-21': [
    ['career', 'Thời gian tới có tìm được công việc mới không?',
     'Có thể là có, và công việc này mang tính chất nước ngoài: ra nước ngoài làm, công ty đa quốc gia, hoặc môi trường liên quan nhiều yếu tố nước ngoài. Nếu không thì bạn chuyển ra thành phố khác — có sự di chuyển về mặt địa lý.'],
    ['career', 'Đang làm văn phòng bình thường, thời gian tới có thay đổi gì không?',
     'Chưa chắc đã là kết thúc, và chưa phải là kết thúc công việc. Năng lực hiện giờ của bạn vẫn đang tốt, nên công việc vẫn vậy và vẫn tốt. Thậm chí đây có thể là công việc bạn làm được đến cuối đời, nghỉ hưu với công việc này, cống hiến lâu dài cho công ty này. Sau này bạn có thể chuyển công ty, nhưng bạn biết mình vẫn sẽ làm trong ngành này — và đó mới là điều quan trọng nhất. Trong sự nghiệp, tìm được cái ngành mà bạn muốn làm đến khi nghỉ hưu là quan trọng nhất; còn công ty nào, ở nước nào, đều không quan trọng bằng.'],
    ['love', 'Hai người hợp nhau là hợp ở điểm gì?',
     'Tính cách và cách tiếp cận vấn đề khác nhau thì bù trừ được cho nhau, giúp nhau nhìn sự việc từ nhiều góc độ. Nhưng giá trị cốt lõi thì nên giống nhau. Nếu đích đến của hai người khác nhau — một người hướng đến sự ổn định lâu dài, có gia đình con cái, còn một người chỉ thích rong ruổi và xác định độc thân cả đời, yêu chỉ để vui — thì dù tính cách giống hệt nhau, sở thích giống hệt nhau, hai bạn vẫn phải chia tay. Ngược lại, nếu tính cách hai người như nước với lửa nhưng cả hai cùng hướng đến một gia đình đầm ấm, thì họ hòa hợp và bù trừ được cho nhau — với Người đọc bài, đó mới là một mối quan hệ lý tưởng. Còn giá trị cốt lõi vừa giống nhau mà tính cách cũng giống nhau thì hai người làm bạn hợp hơn, vì không bù trừ được nhiều cho nhau.']
  ]
});

Object.assign(ASK.en, {
  'major-20': [
    ['love', 'Describe this person\'s character',
     'Someone who has arrived at a certain wisdom and understanding about life. Note the distinction: wisdom about living is not the same as being clever or well-informed — this is the understanding that comes from what they have actually been through, so they grasp what life is for. If they are young, this energy says they are old beyond their years.'],
    ['love', 'What are their feelings toward me?',
     'Positive energy again: there is love for you, but a love of a spiritual cast. They are drawn to you not by your looks or your money but by your character and your spirit — they feel a particular connection with your soul. But if you refuse them, that is all right with them: they will not hunt for every means of becoming your partner or making you their wife. They can state their feelings openly and still respect your choice. This is not a mercenary love, nor the over-hot jealous kind, nor a calculating one.'],
    ['love', 'We are arguing — should we break up?',
     'Look back over the whole journey the two of you have made: how long you have been at it, why you loved this person at the start; remember the good moments and the good sides of them you liked. Do not demand a breakup over a single incident. And from the fact that the card gives this advice at all, you can infer that what you are arguing about is small — with something large, a toxic relationship, or somebody cheating, this card would not have come up.'],
    ['career', 'Out of work three months — will I find something soon?',
     'Rather than going out and scattering CVs, look inward. Look especially at what you dreamed of as a child, or at what you actually want. You may be charging after work you have no wish to do, simply because no other option seems open. And because you are going the wrong way, the universe does not open a road for you. When you are genuinely on the right road, taking the first step is enough to reveal the next one — not necessarily easy, but you know at once what to do. Circling endlessly in the feeling of not knowing where you are headed means you are not on the right road yet.'],
    ['career', 'Any change or new opportunity at work by year end?',
     'You are already doing work you like, and the energy is already good, so it will carry on that way. A new opportunity may come. There is nothing further to advise except this: keep hold of the high frequency you are already at.'],
    ['other', 'What does "a high frequency" mean?',
     'At a high frequency, a new opportunity or a piece of good news does not send you leaping about — you simply smile: good, that is fine, peaceful. And equally, when something bad happens, it is only "ah, is that so"; you are sad, and then you carry on. Whereas the person who reacts with "how wonderful, how happy I am" grieves just as hugely when sadness comes. The wider the swing of feeling, the more it shows you do not yet govern your emotions, and are not yet mature. When the amplitude softens — when your pet dying and your winning the lottery do not sit that far apart in you — that is maturity. You still feel; you are not indifferent. But you understand that everything is only part of life: it comes and it goes, and goes and comes.'],
    ['other', 'Is it wrong to work at something I do not like?',
     'It is perfectly all right. But your life is yours to choose. Most people work at jobs they do not like in order to earn, and that does not mean you must live that way too — nobody is forcing you into work you dislike. We have the right to choose how we live; we are the lead actor in our own life, and the director as well. So why not do the work we like, and earn from that?']
  ],

  'major-21': [
    ['career', 'Will I find new work soon?',
     'Possibly yes, and the work carries a foreign element: going abroad, a multinational company, or an environment with a great deal of international contact. Failing that, you move to another city — some movement across geography.'],
    ['career', 'Ordinary office job — any change coming?',
     'Not necessarily an ending, and certainly not the end of the job. What you can do now is still good, so the work stays as it is and stays good. This may even be the work you do to the end of your working life — the job you retire from, the company you give your years to. You may change companies later, but you will know you are staying in this field, and that is what matters most. In a career, finding the field you want to be in until you retire is the important thing; which company, and which country, matter far less.'],
    ['love', 'What actually makes two people compatible?',
     'Different temperaments and different ways of approaching a problem balance each other out, and help you both see a thing from more than one side. But the core values should match. If the destinations differ — one heading for long-term stability, a family and children, the other wanting only to roam, settled on staying single for life and loving only for the fun of it — then even with identical personalities and identical interests, the two of you will still have to part. Conversely, if your temperaments are water and fire but both of you are heading for a warm family, you can harmonise and make up for each other\'s gaps; for the reader that is the ideal relationship. Whereas matching core values plus matching personalities makes you better as friends, because there is little in each of you for the other to balance.']
  ]
});

/* batch 9 - the four Aces */
Object.assign(ASK.vi, {
  'wands-1': [
    ['love', 'Miêu tả tính cách một người?',
     'Hơi nóng tính một chút, nhưng rất chủ động trong cuộc sống. Họ thiên về hành động hơn là ngồi một chỗ nghĩ ngợi hay đọc sách; là người hướng ngoại, luôn phải ra ngoài làm gì đó; có thể coi là tham vọng, nhiều nhiệt huyết, nhiều lửa. Có những người lúc nào cũng phải làm gì đó, ngồi yên một chỗ là ngứa tay; nếu không làm thì họ xả năng lượng bằng cách tập thể dục. Và nếu không được xả bằng cách nào cả thì có thể họ hướng năng lượng đó vào những thứ tiêu cực hơn — cãi nhau, đánh nhau, xung đột với người xung quanh, hoặc tự làm đau chính mình.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Nhìn chung là tích cực. Có thể nói thêm: người ấy bị thu hút về mặt sinh lý với bạn — vừa nhìn bạn, vừa tiếp xúc với bạn là đã cảm thấy một sự hấp dẫn giới tính mãnh liệt. Hấp dẫn giới tính vốn không xấu. Nhưng họ bộc lộ mong muốn đó một cách đẹp hay không thì phụ thuộc vào các lá đi kèm: nếu họ có sự hấp dẫn đó mà vẫn tôn trọng bạn, giữ khoảng cách và chờ đợi bạn thì tốt; còn nếu xong chuyện rồi bỏ rơi bạn thì lại là xấu.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Nhìn chung lá này mang năng lượng tích cực nhiều hơn, nên có thể chưa cần phải chia tay luôn. Bạn có thể chủ động ngồi xuống nói chuyện, hoặc chủ động hơn trong mối quan hệ này. Cũng có nhiều lý do: có thể người ấy thấy chán vì lúc nào cũng phải là người chủ động, còn bạn thì lúc nào cũng chờ họ đến kéo mình ra khỏi bức tường băng giá. Những câu hỏi kiểu "có nên chia tay không" thì nên trả lời thận trọng một chút.'],
    ['career', 'Thời gian tới có tìm được công việc mới không?',
     'Có thể có. Nhưng công việc này là do bạn tự tìm, tự chủ động tìm, chứ không phải có người đến đem cơ hội đến cho bạn. Thứ hai, công việc đó có thể mang tính năng động, nhiều lửa — phải đi lại nhiều hoặc tương tác với người khác nhiều — chứ không phải kiểu ngồi một chỗ trong phòng nghiên cứu cả ngày.'],
    ['career', 'Từ nay đến hết năm công việc có gì cần lưu ý?',
     'Nhìn chung là tốt. Có thể có những cơ hội công việc mới, và nếu muốn thì bạn có thể chủ động nắm bắt — cánh cửa cơ hội đó mở ra hay không là quyền của bạn. Hoặc chính bạn tự tạo ra một nguồn thu nhập mới.'],
    ['other', 'Các lá Át nói chung thì thế nào?',
     'Tất cả các lá Át đều mang năng lượng mới bắt đầu, tươi mới, bước chân vào một cuộc hành trình nào đó — và đều tích cực cả.']
  ],
  'swords-1': [
    ['love', 'Miêu tả tính cách một người?',
     'Thông minh, sắc sảo, lời nói sắc bén, suy nghĩ nhanh nhạy, nhanh trí, lôgic. Có thể nghĩ ngay đến năng lượng Song Tử, hoặc Xử Nữ — Xử Nữ không hẳn là sắc bén nhưng khá lôgic, vì Xử Nữ được cai quản bởi Sao Thủy, đại diện cho khả năng tư duy phân tích.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Cũng khó nói. Trong chuyện tình cảm mà ra lá Cốc thì vẫn tốt hơn ra những lá khác, cũng như trong công việc thì ra lá Tiền là tốt nhất. Với Át Kiếm: có thể họ thích bạn, có tình cảm đấy, nhưng bản chất họ là người rất lý trí, lôgic, sắc bén. Mà trong chuyện tình cảm thì sắc bén như thế là tốt cho họ chứ chưa chắc đã tốt cho bạn hay cho mối quan hệ — chỉ cần họ không thích là có thể cắt luôn, tức là bỏ đi luôn. Trong khi tình cảm thì Cốc mới là tốt nhất, vì Cốc đại diện cho nước, cho cảm xúc, cho sự lãng mạn. Có thể họ thích bạn, nhưng họ vẫn bảo vệ bản thân mình hơn.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Át Kiếm vẫn mang năng lượng tích cực, nên nếu các lá đi kèm tốt thì chưa chắc đã chia tay. Ở đây Át Kiếm cho thấy hai bạn đang thiếu năng lượng của việc giao tiếp rõ ràng. Một trong những lỗi phổ biến nhất của các cặp đôi: không hài lòng điều gì đó ở nhau thì giấu trong lòng, nhịn trong lòng, rồi bắt đầu nghi ngờ và soi xét đối phương thay vì nói thẳng ra. Tích tụ lâu ngày đến lúc tức nước vỡ bờ, chỉ cần một cớ rất nhỏ là cãi nhau to và lôi hết chuyện quá khứ ra — nhưng lúc đó nói thì với người kia nó không còn giá trị nữa, họ sẽ bảo "chuyện lâu lắm rồi, sao lúc đó không giải quyết luôn".'],
    ['love', 'Có tồn tại người hiểu mình mà không cần nói không?',
     'Làm ơn đừng nghĩ rằng sẽ có một người hòa hợp với mình đến mức mình không nói gì mà họ cũng hiểu được ý mình, đọc được suy nghĩ của mình. Không có mối quan hệ nào hoàn hảo ngay từ đầu. Mọi mối quan hệ đều được xây dựng trên nền tảng thỏa hiệp, tin tưởng lẫn nhau và giao tiếp rõ ràng.'],
    ['career', 'Thất nghiệp hai ba tháng, có tìm được công việc như ý không?',
     'Có hai trường hợp. Một: bạn tìm được việc mới, và công việc đó liên quan đến quan hệ, giao tiếp, hoặc công việc đầu óc. Hai: bài muốn bạn suy nghĩ lại xem hướng tìm việc của mình có đúng không. Nhiều bạn trẻ muốn có việc nhưng không biết mình thích gì và định hướng thế nào, nên gửi CV tràn lan — và khi đi phỏng vấn thì người ta nhận ra ngay: bạn không thật sự thích công việc này, bạn chỉ đang muốn có một công việc thôi. Vì không có định hướng rõ ràng nên bạn cũng không đầu tư học về ngành đó, và kiến thức của bạn thua các ứng viên khác. Hãy ngồi lại suy nghĩ xem mình thật sự cần gì, thật sự muốn ngành nào.'],
    ['career', 'Ba đến sáu tháng tới công việc có gì cần lưu ý?',
     'Có thể có dự án mới, và dự án này cần học nhiều, cần dùng đầu óc nhiều, học nhiều kiến thức mới. Nhìn chung là tốt.']
  ],
  'cups-1': [
    ['love', 'Miêu tả tính cách một người?',
     'Một người ấm áp, tràn đầy cảm xúc, và là cảm xúc tích cực. Họ yêu bản thân và yêu những người xung quanh — không phải kiểu để cho cảm xúc điều khiển mình, không phải người tiêu cực buồn bã bị cảm xúc nắm lấy. Họ quý trọng những người xung quanh, sẵn sàng giúp đỡ mọi người, và luôn nhìn đời bằng lăng kính tích cực.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Chẳng còn gì để nói cả — quá viên mãn. Rất yêu và tràn trề cảm xúc. Và nếu chỉ có mỗi Át Cốc thì tình yêu này tuy nhiều nhưng lại tích cực, vì đôi khi có kiểu tình yêu nhiều mà thành ám ảnh, thành sở hữu. Ở đây họ sẵn sàng trao trái tim và chiếc cốc cảm xúc của mình cho bạn, nhưng không đến mức ám ảnh, và cũng không kỳ vọng bạn phải trao lại một chiếc cốc tương tự. Một số người khi trao đi rất nhiều mà không nhận lại được điều tương tự thì trở nên tức giận; còn người thật sự mạnh mẽ là người sẵn sàng đặt trái tim mình ra ngoài: đây, tôi yêu anh, tôi sẵn sàng trao chiếc cốc của tôi, còn anh làm gì với trái tim tôi thì tôi không quá quan tâm.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Chia tay gì mà chia tay, tình cảm dạt dào thế này cơ mà. Thậm chí có thể hỏi ngược lại người hỏi: tình cảm nhiều thế này thì chắc hai người chỉ cãi nhau bé thôi chứ gì. Chỉ cần ngồi với nhau nói chuyện vài bữa là lại yêu nhau. Quan điểm của người đọc bài: chỉ cần còn tình cảm — linh hồn của bạn biết là bạn vẫn còn muốn ở cạnh linh hồn người đó — thì hai bạn sẽ tìm được cách giải quyết và hòa hợp. Ngược lại, ở cạnh nhau, môn đăng hộ đối, hoàn cảnh gia đình đều thuận lợi mà không có tình cảm với nhau thì có khuyên mấy cũng không nên ở cùng nhau nữa. Còn đã có tình cảm thì những yếu tố bên ngoài — gia cảnh, văn hóa, tôn giáo — đều có thể hòa hợp được.'],
    ['career', 'Thất nghiệp, thời gian tới tìm được công việc mới không?',
     'Có, và đó là công việc bạn thích, bạn có cảm xúc với nó, được làm công việc mình yêu. Tuy nhiên Át Cốc chưa nói được nhiều về tiền bạc của công việc đó — không xác định được là nhiều tiền hay ít tiền, cơ hội thăng tiến ra sao; chỉ biết là bạn rất thích. Muốn biết về tiền thì rút thêm.'],
    ['career', 'Sáu tháng tới công việc có tiến triển gì không?',
     'Biết đâu bạn gặp tình yêu ngay trong công việc. Hoặc trong công việc có những dự án mới, có thêm thứ mới để làm, và thứ mới đó khiến bạn rất thích — một dự án bạn đã ấp ủ ao ước được tham gia từ lâu.'],
    ['other', 'Vì sao hỏi về lương mà bài lại ra lá này?',
     'Đôi khi công việc mới lương cũng cao, khả năng thăng tiến tốt, chức vụ quyền hành có hết — nhưng bài vẫn ra Át Cốc, vì với người hỏi thì cảm xúc và sự đam mê dành cho công việc mới là điều quan trọng nhất; đam mê đó lấn át tất cả những yếu tố còn lại. Điều đó không có nghĩa các yếu tố kia không có. Thường khi bạn làm công việc mình đam mê thì tiền tự khắc sẽ tới, vì bạn dành nhiều thời gian công sức để học hỏi và hoàn thiện sản phẩm của mình, mà ông trời thì không bao giờ phụ lòng người chăm chỉ. Trải bài phản ánh cảm xúc của bạn, chứ không chỉ phản ánh sự việc.']
  ],
  'pentacles-1': [
    ['love', 'Miêu tả tính cách một người?',
     'Một người thực tế — nhưng thực tế theo hướng tích cực. Họ có đầu óc phân tích chi tiết, tỉ mỉ, chân chạm đất; không phải kiểu bay bổng trên mây, không phải kiểu "một túp lều tranh hai trái tim vàng", nhưng cũng sẵn sàng làm việc chăm chỉ — chăm chỉ để cùng bạn xây dựng tương lai, chứ không phải yêu bạn vì túi tiền hay gia cảnh của bạn. Thực tế và không thích lãng mạn hóa mọi thứ; có thể có lối sống rất lành mạnh, biết cái gì tốt, cái gì nên làm. Yêu một người Át Tiền thì bạn sẽ không cảm nhận được nhiệt huyết như Át Gậy, sự mới mẻ nhanh trí như Át Kiếm, hay tình yêu tràn trề mềm mại như Át Cốc — nhưng họ có điểm mạnh riêng: rất thực tế, và đôi khi sẽ nói thẳng cho bạn biết chuyện này có hợp lý hay không.'],
    ['love', 'Người ấy nghĩ gì về tôi và mối quan hệ này?',
     'Có thể là có tình cảm, nhưng đồng thời họ cũng cảm nhận được ở bạn một sự môn đăng hộ đối: hoàn cảnh gia đình, kiến thức và những thứ khác của bạn phù hợp với họ. Tình cảm là một chuyện, nhưng khi tính đến hôn nhân và những mối quan hệ lâu dài thì các yếu tố mang tính Tiền cũng khá quan trọng — chẳng phải tự dưng mà các cụ có câu môn đăng hộ đối.'],
    ['love', 'Khác biệt gia cảnh có quan trọng không?',
     'Người đọc bài đã chứng kiến rất nhiều trường hợp hai người có hoàn cảnh gia đình khác biệt quá — một người hoàng tử, một người dân thường — thì tình cảm vẫn còn đấy nhưng để lâu dài rất khó. Lý do: sinh ra trong môi trường khác nhau, được nuôi dạy khác nhau, thì cách nhìn nhận cuộc sống và tiền bạc cũng khác nhau. Người sinh ra trong nhung lụa khó mà nhìn nhận tiền bạc giống người sinh ra dưới đáy xã hội — kể cả khi người đó sau này làm việc chăm chỉ và đạt tới vị trí nhung lụa, thì tuổi thơ vẫn đóng vai trò rất quan trọng. Vẫn có những trường hợp hòa hợp được, nhưng thường là khi cả hai đã đạt đến sự trưởng thành rất cao, biết vấn đề của bản thân là gì và tìm cách hòa hợp. Những trường hợp đó hiếm.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Cứ từ từ. Hai bạn cần thực tế hơn một chút. Lý do cãi nhau có thể hơi lặt vặt, hơi linh tinh, và Át Tiền muốn cả hai chân chạm đất, thực tế hơn, đừng lãng mạn hóa mọi chuyện — hãy tiếp cận vấn đề một cách lý trí, tỉnh táo và lôgic hơn. Nếu Át Tiền ra trong trải bài của một cặp đôi đang cãi nhau thì có thể cảm nhận được rằng hai bạn còn trẻ, hoặc năng lượng của hai bạn hơi trẻ con, hơi thiên về phần bay bổng — ngược lại với năng lượng của Tiền.'],
    ['career', 'Thời gian tới có tìm được việc không?',
     'Chắc là có. Át Tiền là công việc tốt, bạn cũng thích, và tiền bạc cùng khả năng thăng tiến đều ổn. Ra lá Tiền trong trải bài công việc — nhất là Át Tiền hay Mười Tiền — thường là tốt.'],
    ['career', 'Thời gian tới công việc có gì thay đổi không?',
     'Có thể công việc của bạn có thêm thu nhập, được tăng lương, có thêm dự án để làm, sếp đem đến dự án mới, được luân chuyển bộ phận hoặc thăng chức. Hoặc chính bạn có được một nguồn kiếm tiền mới — đang làm văn phòng bình thường nhưng giờ muốn kinh doanh, đầu tư, thêm một nhánh nữa để có thêm thu nhập.']
  ]
});

Object.assign(ASK.en, {
  'wands-1': [
    ['love', 'Describe this person\'s character',
     'A little hot-tempered, but genuinely active in life. They lean toward doing rather than sitting and thinking or reading; extroverted, always needing to be out doing something; you could call them ambitious, full of enthusiasm and fire. Some people always have to be busy — sit them still and their hands itch; if they cannot work they burn the energy off exercising. And if none of that is available, they may turn it toward worse things: quarrels, fights, conflict with those around them, or hurting themselves.'],
    ['love', 'What are their feelings toward me?',
     'Broadly positive. You can add: they are physically drawn to you — the sight of you, contact with you, and they feel a powerful sexual attraction. Sexual attraction is not in itself a bad thing. Whether they express that desire well depends on the cards beside it: if they feel it and still respect you, keep their distance and wait for you, that is fine; if they want that and abandon you afterwards, that is not.'],
    ['love', 'We are arguing — should we break up?',
     'This card carries more positive energy than not, so you may not need to end it at all. You could take the initiative and sit down to talk, or simply be more active in the relationship generally. There may be reasons behind it: they may be tired of always having to be the one who moves first, while you always wait for them to come and pull you out from behind your wall of ice. Questions like "should we break up" deserve a careful answer.'],
    ['career', 'Will I find new work soon?',
     'Possibly. But it is work you find yourself, actively, rather than an opportunity somebody brings to you. And the work may be of the active, fiery sort — a lot of moving about, or a lot of dealing with people — not the kind where you sit in one room researching all day.'],
    ['career', 'Anything to watch at work between now and year end?',
     'Broadly good. New work opportunities may appear, and if you want them you can take hold of them — whether that door opens is your choice. Or you create a new income stream for yourself.'],
    ['other', 'What about the Aces in general?',
     'Every Ace carries the energy of a fresh start, of something newly begun, of setting out on some journey — and every one of them is positive.']
  ],
  'swords-1': [
    ['love', 'Describe this person\'s character',
     'Intelligent, sharp, sharp-tongued, quick-thinking, quick-witted, logical. Gemini energy comes to mind, or Virgo — Virgo is not exactly sharp so much as logical, being ruled by Mercury, which stands for the analytical mind.'],
    ['love', 'What are their feelings toward me?',
     'Hard to say. In love, drawing Cups beats drawing anything else, just as in work Pentacles is best. With the Ace of Swords: they may like you, there may be real feeling, but by nature they are highly rational, logical and sharp. And in love that sharpness serves them rather than you or the relationship — the moment they dislike something they may simply cut, which is to say leave. Cups is what you want in love, because Cups is water, feeling, romance. They may like you, but they will still protect themselves first.'],
    ['love', 'We are arguing — should we break up?',
     'The Ace of Swords still carries positive energy, so with good cards beside it a breakup is far from certain. Here it shows the two of you are short on clear communication. One of the commonest mistakes couples make: something displeases you in the other and you keep it inside, swallow it, and start suspecting and scrutinising them instead of saying it straight. It builds up until the dam breaks, and one tiny pretext sets off an enormous fight in which everything from the past comes out — but by then saying it has lost its value to them, and they will ask why you are dragging up something so old instead of settling it at the time.'],
    ['love', 'Is there someone who understands me without my having to say it?',
     'Please do not believe there is someone so in tune with you that you say nothing and they still know your mind and read your thoughts. No relationship is perfect from the beginning. Every one is built on compromise, mutual trust, and plain communication.'],
    ['career', 'Out of work two or three months — will I find the right job?',
     'Two cases. First: you find new work, and it involves relationships, communication, or head work. Second: the card wants you to reconsider whether your search direction is right. Plenty of young people want a job but do not know what they like or where they are going, so they scatter CVs everywhere — and at interview it shows immediately: you do not actually want this job, you just want a job. And with no clear direction you have not invested in learning the field, so your knowledge falls behind the other candidates. Sit down and work out what you actually need and which field you actually want.'],
    ['career', 'Anything to watch at work over the next three to six months?',
     'There may be a new project, one that calls for a lot of study and a lot of head work, learning a great deal that is new. Broadly good.']
  ],
  'cups-1': [
    ['love', 'Describe this person\'s character',
     'Someone warm and full of feeling — and positive feeling at that. They love themselves and love the people around them; not the sort who is run by their emotions, not negative or sad or held in the grip of feeling. They treasure the people near them, are ready to help, and look at life through a positive lens.'],
    ['love', 'What are their feelings toward me?',
     'There is nothing left to say — it is entirely fulfilled. Deeply in love and brimming with feeling. And with only the Ace of Cups, this is a great deal of love that is nonetheless healthy, because a great deal of love sometimes turns into obsession or possession. Here they are ready to hand you their heart and their cup of feeling, but not to the point of obsession, and without expecting an identical cup handed back. Some people give a great deal and, receiving nothing equivalent, turn angry. The genuinely strong ones are those willing to put their heart out there: here it is, I love you, I am ready to give you my cup — and what you do with my heart is not something I need to control.'],
    ['love', 'We are arguing — should we break up?',
     'Break up over what? With feeling running this deep? You could even turn it back on the querent: with feeling like this, surely the argument was a small one. Sit together and talk for a few evenings and you will be in love again. the reader\'s view: so long as feeling remains — your soul knows it still wants to be beside that person\'s soul — the two of you will find a way to resolve it and come back together. Conversely, standing side by side, families perfectly matched, every circumstance favourable, but no feeling between you: then however much anyone urges it, you should not stay together. But where feeling remains, the outside factors — family background, culture, religion — can all be harmonised.'],
    ['career', 'Unemployed — will I find new work soon?',
     'Yes, and it is work you like; you feel something for it, you would be doing work you love. But the Ace of Cups says little about the money in it — you cannot tell whether it pays well or badly, or what the prospects for advancement are. You only know you want it. For the money, draw more.'],
    ['career', 'Any progress at work over the next six months?',
     'You may find love at work itself. Or there are new projects, something new to take on — and that new thing delights you, a project you have wanted to be part of for a long time.'],
    ['other', 'Why does this card come up when I asked about pay?',
     'Sometimes the new job pays well, has good prospects, position and authority and all the rest — and the cards still show the Ace of Cups, because for this querent the feeling and the passion for the work is what matters most; it outweighs everything else. That does not mean the other factors are absent. Usually, when you do work you love, the money follows by itself, because you give it the time and effort to learn and to perfect what you make — and heaven never fails the diligent. The spread is reflecting your feeling, not only the facts.']
  ],
  'pentacles-1': [
    ['love', 'Describe this person\'s character',
     'Someone practical — but practical in a positive way. An analytical, detailed, careful mind; feet on the ground; not the sort who lives in the clouds, not the "a thatched hut and two golden hearts" type — but ready to work hard all the same, hard enough to build a future with you rather than loving you for your money or your family standing. Practical, and not inclined to romanticise anything; they may keep a very healthy way of living, knowing what is good for them and what to do. Loving an Ace of Pentacles person you will not feel the fire of the Ace of Wands, the novelty and quick wit of the Ace of Swords, or the soft, brimming love of the Ace of Cups. But they have their own strength: they are genuinely practical, and will sometimes tell you outright whether a thing makes sense or not.'],
    ['love', 'What do they think of me and this relationship?',
     'There may well be feeling, but at the same time they sense that you are a good match in standing: your family circumstances, your education, and other things about you fit with theirs. Love is one thing; but once marriage and the long term come into it, the Pentacles factors matter a good deal — there is a reason the old people had a saying about matched households.'],
    ['love', 'Does a difference in background really matter?',
     'the reader has seen a great many cases where two people\'s family backgrounds differ too widely — a prince and a commoner — and the feeling is there but the long term is very hard. The reason: born into different worlds and raised differently, you also see life and money differently. Someone born into silk can hardly see money as someone born at the bottom of society does — and even after that second person works their way up to the silk, their childhood still plays an enormous part in who they are. There are cases that do harmonise, but usually only where both people have reached real maturity, know their own issues, and work at it. Those cases are rare.'],
    ['love', 'We are arguing — should we break up?',
     'Take it slowly. The two of you need to be more practical. What you are arguing about may be rather petty, rather scattered, and the Ace of Pentacles wants you both with your feet on the ground — stop romanticising it and approach the problem rationally, calmly and logically. When this card turns up for a couple who argue, you can usually sense either that they are young or that their energy is childish, tilted toward the airy — the exact opposite of Pentacles.'],
    ['career', 'Will I find work soon?',
     'Most likely yes. The Ace of Pentacles is good work; you will like it, and the money and the prospects are sound. Pentacles in a work spread — the Ace or the Ten especially — are usually good news.'],
    ['career', 'Any change coming at work?',
     'You may get extra income, a raise, more projects, a new project handed to you by your manager, a move to another department or a promotion. Or you find a new source of earnings yourself — holding an ordinary office job but now wanting to trade, or invest, adding another branch to what you bring in.']
  ]
});

/* batch 10 - the four Twos */
Object.assign(ASK.vi, {
  'wands-2': [
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Trong mối quan hệ này họ nhìn khá xa, có tầm nhìn. Có thể chưa gì họ đã tưởng tượng ra viễn cảnh lâu dài, cam kết với bạn. Trước mắt là họ muốn cam kết thật. Nhưng lý do để cam kết là vì yêu bạn hay vì một lý do nào khác thì chưa nói được ngay — trừ khi trải bài có thêm những lá Cốc đẹp như Át Cốc, Hai Cốc, Sáu Cốc, Mười Cốc, thì đọc theo hướng tình yêu thuần túy. Còn nếu lá này đi kèm Công Lý hay Đức Vua Kiếm — những lá thiên về đầu óc suy nghĩ — thì họ muốn cam kết nhưng có lý do nào đó khác nữa.'],
    ['love', 'Lý do "khác" đó có phải là xấu không?',
     'Không hẳn. Đôi khi không phải là họ muốn lợi dụng tài chính hay vật chất của bạn đâu. Có thể họ nhìn thấy ở bạn một tính cách, một đặc điểm khiến họ cảm thấy có thể đi lâu dài được. Có người yêu bằng một trăm phần trăm trái tim, nhưng cũng có người yêu bằng 50 cái này 50 cái kia — và điều đó không hẳn là xấu. Người đọc bài còn thấy những người giữ được lý trí trong tình cảm đôi khi lại chung thủy hơn những người yêu bằng cả con tim. Ví dụ: có người muốn là con người của sự nghiệp nên tìm một người bạn đời ở nhà chăm sóc gia đình; họ thấy bạn có những đặc tính đó và bản thân bạn cũng thích thế, nên họ muốn kết hôn lâu dài với bạn. Cảm xúc dành cho bạn có thể không quá mãnh liệt, nhưng họ vẫn rất chung thủy và tốt với bạn.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Thay vì chia tay, hãy thử nhìn xa hơn một chút, nhìn vào bức tranh tổng thể. Và từ chính lời khuyên đó ta hiểu được rằng mâu thuẫn của hai bạn đang là chuyện nhỏ, hơi lặt vặt — kiểu "tại sao anh đọc tin nhắn của em mà không trả lời", "tại sao anh lại thả tim ảnh con bé kia", những giận hờn rất trẻ con mà không nhìn được bức tranh toàn cảnh: cả hai đều bận, tìm được thời gian cho nhau đã khó, cớ gì cứ gặp nhau là cãi nhau.'],
    ['career', 'Thời gian tới có tìm được công việc ưng ý không?',
     'Riêng lá này thì chưa nói được nhiều, và có thể chia làm hai trường hợp. Một: còn lâu bạn mới tìm được việc — vì Hai Gậy là nhìn xa, nhìn vào một tương lai hơi xa; bạn vẫn cần luyện tập thêm, học thêm, chuẩn bị hồ sơ kỹ hơn. Hai: bạn tìm được việc, và công việc đó liên quan đến yếu tố nước ngoài, hoặc bạn phải đi xa để làm việc. Hoặc vị trí của bạn giống như người lên kế hoạch, người tạo ra tầm nhìn cho tổ chức.'],
    ['career', 'Từ nay đến cuối năm công việc có gì cần lưu ý?',
     'Có thể tự dưng bạn thấy tham vọng hơn: muốn làm được nhiều thứ hơn, muốn lên chức, muốn tăng lương. Liệu bạn có đạt được tham vọng đó hay biến nó thành lòng tham vô đáy thì phải kết hợp với lá khác. Hoặc trong công việc bạn được đi xa, đi nước ngoài — có sự di chuyển về mặt địa lý.']
  ],
  'swords-2': [
    ['love', 'Miêu tả tính cách một người?',
     'Một người thiếu quyết đoán, và chính vì thiếu quyết đoán mà gặp nhiều chuyện không hay: tự đặt mình vào thế bị động, thiếu quyết đoán trong tình cảm nên không biết nên đi tiếp hay dừng lại, thiếu quyết đoán trong công việc nên không biết nên nghỉ hay ở. Những người như thế thường để cuộc sống của mình bị điều khiển bởi yếu tố bên ngoài mà không có khả năng tự làm chủ. Có hai cực: một người tìm cách kiểm soát mọi thứ, một người để mọi thứ thả trôi — tốt nhất là tìm được điểm ở giữa, biết lúc nào nên kiểm soát và lúc nào nên thả trôi. Người này thiên hoàn toàn về phía thả trôi.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Có thể họ đang phân vân lưỡng lự về mối quan hệ này. Có thể có tình cảm với bạn, nhưng vì lý do nào đó mà chưa thật sự tiến đến với bạn, chưa thật sự quyết đoán được. Lý do là gì thì rút thêm lá.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Với Hai Kiếm thì cả hai bạn đang mang năng lượng che mắt: có những vấn đề thật sự mà không nói thẳng ra với nhau. Có những cặp không ưa một điểm nào đó ở đối phương nhưng không dám nói, và cơn bực vẫn ở trong lòng — rồi trút cái giận đó sang việc khác. Ví dụ bạn không thích họ có bạn thân khác giới, nhưng tự thấy nói ra thì không hợp lý vì chính mình cũng có bạn khác giới; thế là cơn bực vẫn còn và bạn bắt lỗi họ chuyện khác: sao không nhắn tin trước, sao không trả lời, sao không nghe máy — trong khi nguyên nhân gốc rễ là chuyện người bạn kia. Lá này có lớp nghĩa ngoảnh mặt làm ngơ, từ chối nhìn thẳng vào sự thật. Nếu bạn nhìn ra được sự thật đó ở chính mình và ngồi xuống nói thẳng, thì không nhất thiết phải chia tay.'],
    ['career', 'Thời gian tới tìm được công việc phù hợp không?',
     'Có thể vẫn chưa. Lý do là bạn chưa thật sự tìm đúng hướng đi trong công việc. Bạn biết cần phải làm gì, thay đổi gì, học thêm kỹ năng gì, CV phải như thế nào — nhưng bạn đang chưa làm, có thể do lười, có thể do sợ thay đổi. Ví dụ chuyên ngành của bạn là kế toán nhưng bạn biết mình thích theo đuổi nghệ thuật, thế mà khi tìm việc vẫn gửi CV cho kế toán, nên không bao giờ được nhận — vì đó không phải con đường của bạn.'],
    ['career', 'Thời gian tới công việc có vấn đề gì không?',
     'Có thể ngay tại thời điểm hiện tại đã có chuyện gì đó không hay cần phải giải quyết ở chỗ làm, và phản ứng đầu tiên của bạn là từ chối giải quyết, ngoảnh mặt làm ngơ. Nhưng tốt nhất nên giải quyết càng sớm càng tốt. Ví dụ chỗ làm vẫn ổn nhưng bạn luôn cảm thấy sếp không quý mình bằng người mới; nhìn chung vẫn ổn, nhưng để lâu thì cục tức cứ tăng dần đến mức tức nước vỡ bờ.'],
    ['other', 'Để lâu thì lá này thành gì?',
     'Năng lượng Hai Kiếm nếu để lâu thì có thể thành Ác Quỷ, mà sau Ác Quỷ là Tòa Tháp. Theo quan sát của người đọc bài, những người mang năng lượng thiếu quyết đoán thường chỉ dứt ra được khi cuộc sống gặp một biến cố quá lớn — khi mọi thứ đã tan hoang, đã sụp đổ, thì lúc đó họ mới buộc phải quyết. Năng lượng Hai Kiếm còn thấp, chưa đủ để làm bạn sụp đổ, nhưng về lâu về dài thì không ai biết trước được.']
  ],
  'cups-2': [
    ['love', 'Miêu tả tính cách một người?',
     'Người đọc bài nghĩ ngay đến cung Thiên Bình: rất giỏi cân bằng, giỏi thương thảo, giỏi thuyết phục người khác, giỏi bán hàng. Cái cân của Thiên Bình không phải cán cân công lý mà là cân của người bán hàng — cân để đo xem cái nào tương xứng với cái nào. Lá này mang đúng năng lượng đó: cho đi và nhận lại tương xứng. Nguyên tắc ấy đúng với quan hệ đối tác làm ăn, và cũng đúng với chuyện tình cảm — mọi mối quan hệ đều dựa trên nguyên tắc cho đi và nhận lại. Vậy nên: một người thích công bằng, giữ được quan hệ tốt với những người xung quanh, giỏi ngoại giao, tính cách khá dễ chịu.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Tốt quá rồi. Có tình cảm, và họ muốn trao đi chiếc cốc tình yêu của mình cho bạn — dĩ nhiên đồng thời cũng mong nhận lại một thứ tương tự. Nhìn chung trong tình cảm mà ra Át Cốc, Hai Cốc, Sáu Cốc hay Mười Cốc thì đều đẹp.'],
    ['love', 'Cãi nhau, làm thế nào để cải thiện mối quan hệ?',
     'Chưa chắc đã nên chia tay, vì tình cảm hai bạn vẫn còn tràn đầy. Cãi nhau có thể chỉ là không hợp tính thôi, còn tình yêu thì vẫn còn. Hãy dùng chính nền tảng tình yêu đó mà trò chuyện thẳng thắn, tìm ra vấn đề của cả hai và cùng nhau giải quyết. Thay vì mỗi người tự tìm cách giải quyết theo cách riêng, sao không ngồi xuống cùng nhau — đây là mối quan hệ của hai người cơ mà.'],
    ['love', 'Tôi nên hỏi ai về cách cải thiện mối quan hệ?',
     'Người đọc bài thấy khá nhiều người rõ ràng đang ở trong mối quan hệ của hai người nhưng lại tự mình đi tìm hướng giải quyết, hoặc đi hỏi người đọc bài "làm thế nào để thay đổi anh ấy", "bản thân tôi cần thay đổi cái gì". Tốt nhất là đừng hỏi người đọc bài mà hỏi chính người yêu của bạn: "anh góp ý cho em đi, em cần thay đổi thế nào" — rồi mình cũng góp ý lại cho họ. Khi gặp vấn đề, đặc biệt là chuyện tình cảm, hãy ngồi xuống nói với nhau thay vì ra ngoài hỏi lời khuyên của một bên thứ ba.']
  ],
  'pentacles-2': [
    ['love', 'Miêu tả tính cách một người?',
     'Sẽ không nói người này là người cân bằng, mà là người luôn cố cân bằng mọi thứ — bản thân cuộc sống của họ có thể không cân bằng, nhưng họ luôn cố. Là người linh hoạt, thích làm nhiều thứ cùng một lúc. Nghĩ ngay đến Song Tử: họ không chịu được chỉ một góc, một công việc; sự cân bằng trong cảm xúc và tâm trí của họ đến từ chính việc làm nhiều thứ cùng lúc.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Không tích cực lắm. Có thể bản thân họ đang phải cân bằng giữa mối quan hệ này với công việc, với chuyện học tập, với chuyện riêng của họ — thành ra không thể toàn tâm toàn ý với bạn. Nếu bạn hỏi lá này có ám chỉ người thứ ba không thì cá nhân Người đọc bài thấy là không; Hai Cốc thì biết đâu, nhưng Hai Tiền giống như người đang tung hứng những thứ mang tính vật chất, công việc, học tập, tiền bạc hơn là chuyện tình cảm. Họ có thể rất bận; tình cảm thì có, nhưng hiện giờ phải tung hứng như thế nên thời gian dành cho bạn giảm xuống. Bạn có chịu được sự vô tâm, thờ ơ đó trong mối quan hệ hay không là chuyện của bạn.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Có thể hai bạn cãi nhau vì một trong hai đang rất bận. Có một xu hướng rất hay gặp, nhất là với áp lực công việc: đi làm bị sếp mắng, đồng nghiệp mắng, khách mắng, mà ở chỗ làm thì không mắng lại được ai — thế là về nhà cáu gắt với bố mẹ, với người yêu. Nghe thì buồn cười nhưng thật sự chúng ta hay trút những điều tiêu cực nhất lên chính những người mình yêu quý nhất, và thường là một cách vô thức. Hướng giải quyết là cân bằng lại công việc: nếu công việc đang khiến bạn stress và bạn mang áp lực đó trút lên người thân, hãy tìm cách giảm khối lượng công việc xuống.'],
    ['health', 'Làm sao biết mình đang mất cân bằng?',
     'Chúng ta có cả sức khỏe cơ thể lẫn sức khỏe tinh thần. Sức khỏe cơ thể dễ nhìn ra — mệt thì biết là mệt, ốm thì biết cơ thể đang đòi nghỉ ngơi. Nhưng sức khỏe tinh thần thì không dễ thấy, và người ta thường chỉ đo được nó qua mức độ vui vẻ của mình. Nếu không cẩn thận thì đến khi mắc bệnh tâm lý rồi mới biết là sức khỏe tinh thần của mình cần được chú ý.'],
    ['career', 'Thất nghiệp mấy tháng, thời gian tới tìm được việc không?',
     'Chỉ mỗi lá này thì hơi khó trả lời — cảm giác 50/50. Nếu bạn biết thu vén sắp xếp lại cuộc sống thì có thể tìm được. Cuộc sống hiện giờ của bạn tuy thất nghiệp nhưng lại rất lộn xộn, không gọn gàng. Môi trường xung quanh không gọn gàng thì ảnh hưởng đến suy nghĩ và đến việc ra quyết định; bạn cần một môi trường gọn hơn để sáng suốt hơn, để khi đi phỏng vấn trả lời tốt hơn và biết mình cần theo hướng công việc nào.'],
    ['other', 'Dọn dẹp thì liên quan gì đến chuyện tìm việc?',
     'Nhiều người không quá quan tâm đến việc giữ cho môi trường sống, các mối quan hệ, thậm chí bản thân mình được gọn gàng — cứ chạy theo những mục tiêu lớn mà bỏ qua những thứ đơn giản như dọn nhà, dọn dẹp chính mình. Hãy dọn nhà, nhất là phòng ngủ: có đủ ánh sáng không, có gọn gàng không, màu sơn tường và màu rèm có tối quá không. Những thứ tưởng rất đơn giản nhưng ảnh hưởng nhiều đến tâm sinh lý. Hãy tự hỏi vì sao bạn ghét về nhà, vì sao căn nhà mang lại cho bạn cảm giác nặng nề. Rồi đến cơ thể: bao lâu rồi bạn chưa chăm sóc da, chưa chăm sóc tóc, chưa mua cho mình bộ quần áo mới. Môi trường trực tiếp mà ta tương tác phải sạch sẽ thì bên trong ta mới thấy gọn gàng và yên bình. Tương tự với các mối quan hệ — hãy xem có mối quan hệ nào độc hại không; không cần cắt bỏ hoàn toàn, nhưng biết giữ khoảng cách.'],
    ['other', 'Vì sao bài không trả lời đúng câu tôi hỏi?',
     'Người hỏi thường hỏi những câu mang tính bề nổi, nhưng khi bài ra thì nó lại trả lời cái vấn đề gốc rễ dẫn đến bề nổi đó. Việc của người đọc là giải thích cho họ từng bước một, rằng vấn đề gốc rễ như thế nào thì mới dẫn lên vấn đề bề nổi của họ. Dĩ nhiên điều này cũng tùy người hỏi: người đã có tuổi, đã chín chắn thì sẽ hiểu, còn người còn quá trẻ thì sẽ khó hiểu hơn.']
  ]
});

Object.assign(ASK.en, {
  'wands-2': [
    ['love', 'What are their feelings toward me?',
     'In this relationship they are looking a long way ahead; they have vision. They may already be picturing something long-term and committed with you. On the face of it, they genuinely want to commit. But whether the reason for committing is love for you or something else cannot be said yet — unless the spread also holds good Cups such as the Ace, the Two, the Six or the Ten, in which case read it as love pure and simple. If instead it comes with Justice or the King of Swords — the thinking cards — then they want the commitment but have some further reason behind it.'],
    ['love', 'Is that "other reason" a bad thing?',
     'Not necessarily. It is often not that they want to make use of your money or your things. They may see a quality in you that makes them feel they could go the distance with you. Some people love with a hundred per cent of the heart; others love fifty per cent this and fifty per cent that — and that is not necessarily bad. the reader finds that people who keep their reason in love are sometimes more faithful than those who love with the whole heart. Say someone wants to be a career person and so looks for a partner who will keep the home and raise the children; they see those qualities in you, and that you want that too, so they want to marry you and stay. Their feeling may not be intense, but they will still be faithful and good to you.'],
    ['love', 'We are arguing — should we break up?',
     'Rather than breaking up, try looking a little further ahead, at the overall picture. And from that advice alone you can tell the conflict between you is small and rather petty — "why did you read my message and not reply", "why did you like that girl\'s photo" — very childish grievances that miss the whole picture: you are both busy, finding time for each other is hard enough, so why must every meeting turn into an argument.'],
    ['career', 'Will I find the right job soon?',
     'This card alone does not say much, and splits into two cases. First: it will be a while — the Two of Wands looks far off, into a somewhat distant future; you still need more practice, more study, a better-prepared CV. Second: you do find work, and it involves a foreign element, or you must travel some distance for it. Or your position is that of the planner, the one who sets the vision for the organisation.'],
    ['career', 'Anything to watch at work between now and year end?',
     'You may suddenly find yourself more ambitious: wanting to do more, wanting promotion, wanting a raise. Whether you reach that ambition or turn it into bottomless greed needs another card. Or the work takes you far — abroad, or elsewhere; there is movement across geography in it.']
  ],
  'swords-2': [
    ['love', 'Describe this person\'s character',
     'Someone indecisive, and who meets a good deal of trouble precisely because of it: putting themselves in a passive position, indecisive in love so unable to tell whether to go on or stop, indecisive at work so unable to tell whether to leave or stay. Such people usually let their life be steered by outside factors, without the capacity to be master of it. There are two extremes: the person who tries to control everything, and the person who lets everything drift. The best place is the middle — knowing when to take hold and when to let go. This person leans entirely to the drift.'],
    ['love', 'What are their feelings toward me?',
     'They may be wavering about this relationship. There may be feeling for you, but for some reason they have not genuinely moved toward you, have not managed to be decisive about it. Draw more for the reason.'],
    ['love', 'We are arguing — should we break up?',
     'With the Two of Swords, both of you are carrying blindfolded energy: there are real problems you are not saying straight to each other. Some couples dislike something in the other and do not dare say it, so the irritation stays inside — and then gets discharged onto something else. Say you dislike their close friend of the opposite sex, but feel you cannot say so because you have friends of the opposite sex yourself; the irritation stays, and you pick them up on something else instead — why did you not text first, why did you not answer, why did you not take my call — when the root of it is that friend. This card carries a layer of turning away, of refusing to look straight at the truth. If you can see that truth in yourself and sit down to say it plainly, a breakup is not necessary.'],
    ['career', 'Will I find suitable work soon?',
     'Possibly not yet. The reason is that you have not genuinely found the right direction. You know what needs doing, what to change, which skills to add, how the CV should look — and you are not doing it, whether out of laziness or fear of change. Say your training is in accounting but you know you want to pursue art, and yet you go on sending CVs to accountancy firms — and are never taken, because it is not your road.'],
    ['career', 'Any trouble at work coming up?',
     'There may already be something unpleasant at work needing to be dealt with right now, and your first reaction is to refuse to deal with it and look away. It is far better dealt with early. Say the workplace is fine but you always feel your manager favours the new arrival over you; on the whole it is fine, but left long enough the resentment builds until the dam breaks.'],
    ['other', 'What does this card become if I leave it too long?',
     'Two of Swords energy left long enough can become the Devil — and after the Devil comes the Tower. In the reader\'s observation, indecisive people usually only break out when a very large upheaval forces them to: only once everything has fallen apart do they finally decide. Two of Swords energy is still low; it is not yet enough to collapse you. But over the long run nobody can say.']
  ],
  'cups-2': [
    ['love', 'Describe this person\'s character',
     'the reader thinks immediately of Libra: very good at balancing, good at negotiating, good at persuading, good at selling. Libra\'s scales are not the scales of justice but a merchant\'s scales — weighing to see what is equal to what. This card carries exactly that energy: giving and receiving in equal measure. The principle holds for business partnerships, and for love as well — every relationship rests on giving and receiving. So: someone who likes fairness, keeps good relations with those around them, is good at diplomacy, and is fairly easy to be with.'],
    ['love', 'What are their feelings toward me?',
     'Excellent. The feeling is there, and they want to hand you their cup of love — while, naturally, hoping for something similar in return. In love, drawing the Ace, Two, Six or Ten of Cups is beautiful across the board.'],
    ['love', 'We are arguing — how do we repair this?',
     'A breakup is far from necessary, because the feeling between you is still brimming. The arguing may only be a clash of temperament, while the love itself remains. Use that foundation of love to talk frankly, find the problem that belongs to both of you, and solve it together. Rather than each of you working at it separately in your own way, why not sit down together — it is a relationship of two people, after all.'],
    ['love', 'Who should I ask about fixing my relationship?',
     'the reader sees a great many people who are plainly in a two-person relationship and yet go looking for the answer alone, or ask a reader "how do I change him", "what do I need to change about myself". Better not to ask the reader but to ask your partner: "tell me honestly, what do I need to change" — and then give them your own feedback in turn. When something goes wrong, especially in love, sit down and speak to each other rather than going outside for a third party\'s advice.']
  ],
  'pentacles-2': [
    ['love', 'Describe this person\'s character',
     'You would not say this person is balanced, but that they are forever trying to balance everything — their own life may be nothing of the kind, but they keep trying. Flexible, and fond of doing several things at once. Gemini comes straight to mind: they cannot bear having only one corner, one job; their emotional and mental balance comes precisely from having several things running at once.'],
    ['love', 'What are their feelings toward me?',
     'Not especially positive. They may be having to balance this relationship against their work, their studies, their own private business — and so cannot be wholehearted with you. If you ask whether this card hints at a third person: personally, no. The Two of Cups might; but the Two of Pentacles is more like someone juggling material things, work, study and money than anything to do with romance. They may be genuinely busy; the feeling exists, but with all that juggling the time they have for you drops. Whether you can live with that inattention is your own call.'],
    ['love', 'We are arguing — should we break up?',
     'You may be arguing because one of you is extremely busy. There is a very common pattern here, especially under work pressure: your manager scolds you, colleagues scold you, clients scold you, and at work you cannot answer any of them back — so you come home and snap at your parents, or your partner. It sounds absurd, but we really do discharge the worst of what we carry onto the people we love most, and usually without noticing. The fix is to rebalance the work: if the job is stressing you and you are unloading that pressure onto the people at home, find a way to bring the workload down.'],
    ['health', 'How do I know I am out of balance?',
     'We have physical health and mental health both. Physical health is easy to read — tired is tired, and illness tells you the body wants rest. Mental health is not easy to see, and people usually measure it only by how happy they feel. Without care, you often only discover your mental health needed attention once a psychological illness has arrived.'],
    ['career', 'Out of work some months — will I find something?',
     'With this card alone it is hard to say; it feels fifty-fifty. If you can tidy and reorder your life, you may. Your life at the moment, unemployed, may also be genuinely disordered and untidy. An untidy environment affects your thinking and your decisions; you need a tidier one to be clear-headed — clear enough to answer well at interview, and to know which direction you actually need.'],
    ['other', 'What has tidying up got to do with finding a job?',
     'A great many people pay no attention to keeping their living space, their relationships, even themselves in order — chasing large goals while neglecting simple things like cleaning the house and looking after themselves. Clean the house, and the bedroom above all: is there enough light, is it tidy, are the wall colour and the curtains too dark? Things that seem trivial and yet weigh heavily on how you feel. Ask yourself why you dislike going home, why the house feels heavy to you. Then the body: how long since you looked after your skin, your hair, since you bought yourself new clothes? The immediate environment you move through has to be clean before the inside of you can feel tidy and at peace. The same goes for relationships — look at which ones are toxic. You need not cut anyone off entirely, but know how to keep your distance.'],
    ['other', 'Why do the cards not answer the question I asked?',
     'Querents usually ask surface questions, but what comes up answers the root problem underneath the surface one. The reader\'s job is to explain, step by step, how that root leads up to what they asked about. It depends on the querent, of course: someone older and more settled will follow it, while someone very young will find it harder.']
  ]
});

/* batch 11 - the four Threes */
Object.assign(ASK.vi, {
  'wands-3': [
    ['love', 'Miêu tả tính cách một người?',
     'Một người muốn làm rất nhiều thứ nhưng lại chưa dám đi những bước đầu tiên. Rất nhiều đam mê, rất nhiều tham vọng, mà bước đầu tiên thì không dám đi — vì sợ thất bại, nên thà không làm còn hơn. Đây là kiểu người kể cho bạn nghe rất nhiều thứ họ muốn làm, rồi vài tháng sau gặp lại và hỏi thì họ có đủ cớ, và giờ đã chuyển sang một dự định khác.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Mới yêu nhau khoảng một tháng: có thể là cũng có tình cảm thật, và cũng có những suy nghĩ về việc lâu dài cam kết thật. Nhưng hành động cụ thể để biến mối quan hệ thành cam kết lâu dài thì chưa thấy. Miệng thì nói muốn lâu dài với bạn, nhưng vẫn chẳng quan tâm gì đến sự nghiệp, vẫn không có ý định đưa bạn về ra mắt gia đình, cũng không bàn với bạn sau này cưới nhau thì sẽ thế nào. Tất cả mới đang ở trong đầu họ thôi.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Riêng lá này thì khá khó nói. Nhưng một trong những lý do khiến hai bạn hay cãi nhau có thể là một trong hai, hoặc cả hai, chưa thật sự sẵn sàng cho một mối quan hệ lâu dài. Nhất là khi còn trẻ: yêu thì cứ yêu, nói vu vơ là sẽ cưới nhau, nhưng chưa hình dung được rằng muốn cam kết lâu dài thì mình cần làm gì và đối phương cần làm gì. Bạn đã biết thỏa hiệp chưa, đã ổn định tài chính chưa, công việc đã ổn chưa, đã sẵn sàng trở thành một con người của gia đình chưa? Có thể bạn vẫn đang muốn chơi, vẫn muốn đi du lịch cùng bạn bè, vẫn muốn sống theo chủ nghĩa cá nhân — thì người yêu lúc này chỉ là để vui.'],
    ['love', 'Làm thế nào để thay đổi người ấy?',
     'Bạn không bao giờ thay đổi được bất cứ ai nếu bản thân họ không muốn. Kể cả khi họ yêu bạn, thương bạn, thì việc họ có thay đổi hay không phụ thuộc vào ý chí chủ động của chính họ chứ không phải vào bạn. Nếu họ cảm thấy cần phải thay đổi để tiếp tục mối quan hệ này thì đó là do họ. Mình chỉ góp ý đến một mức độ nào đó thôi.'],
    ['career', 'Thất nghiệp mấy tháng, sắp tới tìm được việc không?',
     'Có thể bạn có nhiều dự định muốn làm, nhưng hành động của bạn lại không tương xứng với dự định đó. Ví dụ bạn muốn vào làm ở những công ty lớn — Google, Facebook — nhưng để làm được ở đó thì cần kiến thức, cần kinh nghiệm, mà bạn lại không chịu trau dồi rèn giũa bản thân. Đôi khi còn buồn cười hơn: muốn có việc nhưng đến bước gửi CV cũng lười, bước lên mạng tìm việc cũng lười. Có thể bạn muốn khởi nghiệp nhưng lại chần chừ vì sợ hãi.'],
    ['career', 'Thời gian tới công việc có gì cần lưu ý?',
     'Hiện giờ trong đầu bạn có nhiều ý tưởng muốn làm nhưng chưa dám làm vì sợ nhiều thứ. Bài mong bạn đừng sợ và hãy bước ra khỏi vùng an toàn.'],
    ['other', 'Tôi sợ thất bại rồi bị người ta cười thì sao?',
     'Thật ra chẳng ai cười bạn đâu — nói thẳng ra thì chẳng ai quan tâm đến bạn đến mức đó, chẳng ai quá quan tâm đến việc bạn thành công hay thất bại. Bạn thử nghĩ xem: nếu một người bạn của bạn thất bại thì bạn có cười họ không, hay bạn chỉ an ủi họ? Có thể bạn cười thầm trong lòng, nhưng ngày mai bạn lại quên. Nếu bạn cứ luôn sợ hãi thì bạn sẽ không bao giờ dám làm điều gì lớn trong đời — bạn cứ sống ngày qua ngày, và mặc nhiên trở thành người thất bại.']
  ],
  'swords-3': [
    ['love', 'Miêu tả tính cách một người?',
     'Một người hay đau khổ, hay buồn bực, rất tâm trạng — kiểu người để cảm xúc lấn át lý trí, và thiên về phần tiêu cực nhiều hơn. Nói chung ra lá này thì chẳng phải là một người vui vẻ gì.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Cũng không vui đâu. Có thể họ đã có những tổn thương tình cảm trong quá khứ mà chưa được chữa lành hết, nên chưa thật sự sẵn sàng cho một mối quan hệ. Nhưng năng lượng của Ba Kiếm tuy có đau khổ thì cũng không nhiều, và một người còn mang tổn thương của Ba Kiếm thì vẫn có thể tự chữa lành được mà không nhất thiết phải chia tay — dù cũng có những người buộc phải chia tay thì mới nhận ra được điều gì đó.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Chuyện cãi nhau này đúng là mệt mỏi, có gì đó hơi độc hại thật, nhưng hoàn toàn nằm trong tầm kiểm soát của bạn — vì đây là Ẩn Phụ, mà Ẩn Phụ là những thứ người hỏi có thể thay đổi được, năng lượng của nó thấp. Có thể chuyện hai bạn cãi nhau rất vặt vãnh, rất trẻ con, chẳng đáng để cãi: tại sao sáng ngủ dậy anh không nhắn tin cho em, tại sao anh lại like ảnh cô này cô kia.'],
    ['love', 'Tôi có nên kiểm soát người ấy không?',
     'Tốt nhất là đừng. Đừng biết mật khẩu của nhau, đừng quan tâm người ta like ảnh của ai, đừng theo dõi họ trên mạng xã hội, đừng quan tâm họ làm gì. Thích thì họ ở cạnh bạn, không thích thì họ không ở. Bạn thử nghĩ xem: khi bạn đuổi theo một ai đó thì người ta tìm cách chạy, còn khi bạn không quan tâm nữa thì người ta lại thích ở cạnh — đúng cả trong tình cảm lẫn trong quan hệ bạn bè. Hãy tự soi gương và hỏi: tại sao mình lại cần phải biết hôm nay họ đi đâu, gặp ai, làm gì?'],
    ['career', 'Thời gian tới có tìm được công việc như ý không?',
     'Có thể vẫn chưa tìm được công việc phù hợp. Lý do thì Ba Kiếm chưa nói, phải xem các lá khác. Có thể bạn đang đi theo hướng không phù hợp với mình: bản thân thì muốn làm người đọc bài, nhưng vì áp lực gia đình và xã hội nên cứ phải làm nhân viên ngân hàng. Cứ gửi CV mà đi sai hướng thì vũ trụ không bao giờ cho bạn kết quả đâu — nó sẽ từ chối, vì bạn đi sai đường rồi, quay lại đi.'],
    ['career', 'Thời gian tới công việc có gì thay đổi không?',
     'Cũng không vui. Có thể trong công việc gặp chuyện hơi buồn: dự án của bạn không thành công như bạn nghĩ, nhưng cũng không đến mức thất bại. Hoặc quan hệ với đồng nghiệp hơi thiếu suôn sẻ — không đến mức drama, không đến mức Tòa Tháp, chỉ là Ba Kiếm thôi.']
  ],
  'cups-3': [
    ['love', 'Miêu tả tính cách một người?',
     'Một người hướng ngoại: thích bạn bè, thích tụ tập, thích đi chơi, thích quẩy.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Chưa nói được nhiều. Có thể cảm xúc họ dành cho bạn mới dừng ở mức bạn bè — họ coi bạn là một trong những người bạn của họ. Còn nếu hai người đã ở trong một mối quan hệ rồi mà hỏi câu này thì lá này hơi căng: có thể vẫn vui, nhưng lá này thiên về niềm vui bạn bè hơn. Trong tình yêu ta cần tình cảm của Át Cốc, của lá Tình Nhân, của Mười Cốc — một cái gì đó độc nhất, hoặc ổn định và vững chắc hơn. Dù vậy chưa chắc đã là xấu: mức độ hiện tại vẫn là bạn bè hoặc trên mức bạn bè một chút, hoặc trong mối quan hệ với bạn thì họ vẫn thích đi chơi và vẫn có nhiều bạn khác giới.'],
    ['love', 'Cãi nhau nhiều, có nên chia tay không?',
     'Với câu hỏi này thì nên rút thêm lá. Cảm nhận ban đầu: lý do hai người hay cãi nhau có thể là có sự xuất hiện của người thứ ba. Nhưng lưu ý một điều rất quan trọng — người thứ ba không phải lúc nào cũng nằm ở phía đối phương. Nếu một cô gái đến hỏi bạn thì người thứ ba chưa chắc đã nằm ở phía anh chàng kia, mà có thể nằm ở chính phía cô ấy. Và người hỏi cũng không phải lúc nào cũng cung cấp cho bạn toàn bộ thông tin. Hãy nói thẳng với người hỏi rằng câu trả lời có thể mang tính hai chiều: điều thấy được là có sự xuất hiện của người thứ ba khiến mối quan hệ hay xung đột, và nó có thể ở phía họ, mà cũng có thể ở phía bạn.']
  ],
  'pentacles-3': [
    ['love', 'Miêu tả tính cách một người?',
     'Tương đối nghiêm túc. Nếu Ba Cốc là người thích ở bên cạnh người khác để tụ tập ăn chơi, thì Ba Tiền cũng thích ở cạnh người khác nhưng là để cùng nhau làm một điều gì đó có ích. Trong công việc, đây là người thích làm việc nhóm, thích môi trường công ty công sở, chứ không phải kiểu thích làm một mình. Nó khiến Người đọc bài liên tưởng đến năng lượng Bảo Bình: muốn tập hợp nhiều người lại để cùng làm điều gì có ích, chứ không phải tập hợp để chơi.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Hơi buồn đấy. Không hẳn là xấu, nhưng không vui: họ chỉ coi bạn là bạn thôi, hoặc thậm chí chỉ là đồng nghiệp, người làm cùng, người học cùng — cảm giác như họ muốn một mối quan hệ chuyên nghiệp với bạn. Còn nếu hai bạn đã yêu nhau cả năm rồi mà ra lá này thì nó vẫn mang tính chất của Tiền: Tiền là những gì cầm được, sờ được, thấy được — là vật chất. Nên thứ họ muốn ở bạn trong mối quan hệ này có thể là một thứ mang tính vật chất chứ không chỉ là tình cảm của bạn: có thể nhà bạn giàu, bố bạn làm to, và họ biết rằng yêu bạn thì vị thế của họ tự động được nâng lên; hoặc bạn đang ở nước ngoài và đã là cư dân, mà kết hôn với bạn thì họ cũng được định cư.'],
    ['love', 'Vậy có nên bỏ người đó luôn không?',
     'Đừng vội đánh giá kiểu "anh chàng đó là người như thế thì bạn phải bỏ đi". Có thể anh ta không thật lòng, nhưng chúng ta cũng chưa biết được liệu chính người hỏi có thật lòng hay không. Và cũng có những người chấp nhận mối quan hệ như vậy — nhất là khi bản thân họ cũng mang năng lượng của Tiền: họ cần ở bạn địa vị và tài chính, còn bạn cần ở họ một thứ khác, thế là cả hai ở trong mối quan hệ để thỏa mãn những khía cạnh đó chứ không phải vì cảm xúc.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Từ khóa của lá này là làm việc nhóm, nên khoan hãy chia tay — hãy ngồi xuống bàn bạc với nhau để giải quyết vấn đề bằng lời nói trước đã. Một trong những lý do hai bạn hay cãi nhau có thể là những vấn đề về mặt vật chất, tài chính, hoặc là hai bạn chưa tìm được tiếng nói chung về cam kết tương lai: yêu nhau đã lâu nhưng có lấy hay không, lấy vào thời điểm nào, lấy xong có sinh con luôn không, ở nhà ai. Những chuyện thuộc khía cạnh vật chất như vậy hai bạn chưa bàn bạc thấu đáo — một người thì muốn bàn, một người thì cứ né tránh.'],
    ['career', 'Thất nghiệp ba tháng, thời gian tới tìm được việc không?',
     'Có thể là có, và có hai trường hợp. Một: bạn tìm được việc, và công việc đó mang tính chất làm việc nhóm nhiều, làm với người khác nhiều. Hai: bạn cần hỏi những người xung quanh, cần dùng đến các mối quan hệ của mình để có được cơ hội — hãy ra ngoài và nhờ sự trợ giúp từ người khác, hỏi bạn bè người thân xem có công việc nào giới thiệu cho mình không.'],
    ['career', 'Thời gian tới công việc có gì cần lưu ý?',
     'Đơn giản thôi: sắp tới sẽ có làm việc nhóm. Nếu bạn đang làm một mình thì sắp tới sẽ làm việc nhóm; còn nếu đang làm nhóm rồi thì vẫn tiếp tục như thế. Việc làm nhóm này đem lại lợi ích hay khó khăn thì tùy: nếu bạn hướng nội và thích lủi thủi một mình thì nó sẽ đem đến nhiều thử thách hơn; còn nếu bạn thích tương tác, thích giao tiếp, hướng ngoại, thì hãy đọc năng lượng làm việc nhóm này theo hướng tích cực.'],
    ['other', 'Lá này khác Ba Cốc và Giáo Hoàng thế nào?',
     'Trong 78 lá có hai lá nói về làm việc nhóm: Ba Tiền và Giáo Hoàng. Giáo Hoàng thiên về giáo dục — đi học thì phải làm việc cùng nhau. Còn Ba Tiền thuần túy là làm việc nhóm: ba người đang cùng bàn bạc công việc. Ba Cốc cũng là nhóm, nhưng là nhóm để chơi, để tụ tập đàn đúm; còn nhóm để cùng giải quyết một vấn đề, hướng đến mục đích chung, thì là Ba Tiền.']
  ]
});

Object.assign(ASK.en, {
  'wands-3': [
    ['love', 'Describe this person\'s character',
     'Someone who wants to do a great many things and has not dared take the first step. Plenty of passion, plenty of ambition, and no first step — because they fear failing, so better not to act at all. This is the person who tells you all about what they mean to do, and when you meet again months later has excuses ready and has moved on to a different plan.'],
    ['love', 'What are their feelings toward me?',
     'A month into it: the feeling may be real, and the thoughts about long-term commitment may be real too. But the concrete action that would turn it into a lasting commitment is nowhere. They say they want the long term with you, and still pay no attention to their career, still have no intention of taking you to meet their family, still do not discuss what happens once you marry. It is all in their head so far.'],
    ['love', 'We are arguing — should we break up?',
     'With this card alone it is hard to say. But one reason you argue so much may be that one of you, or both, is not truly ready for anything long-term. Especially while young: you love, you say vaguely that you will marry, and you cannot picture what a commitment would actually ask of you and of them. Have you learned to compromise? Is your money steady, is your work steady, are you ready to become a family person? Perhaps none of that is true yet — you still want to play, to travel with friends, to live for yourself — in which case a partner right now is only for the fun of it.'],
    ['love', 'How do I change them?',
     'You will never change anybody who does not want to change. Even if they love you and care for you, whether they change rests on their own will, not on yours. If they feel they need to change to keep this relationship, that is theirs. You can offer your view up to a point, and that is all.'],
    ['career', 'Out of work some months — will I find something soon?',
     'You may have plenty of plans, and your actions may not match them. Say you want to work at one of the big companies — Google, Facebook — but getting in takes knowledge and experience, and you are not willing to put in the training. Sometimes it is funnier than that: you want the job and cannot be bothered to send the CV, cannot be bothered to search the listings. Or you want to start something of your own and hesitate out of fear.'],
    ['career', 'Anything to watch at work?',
     'Right now your head is full of ideas you want to act on and do not dare to, because you are afraid of a number of things. The card hopes you will stop being afraid and step out of the comfort zone.'],
    ['other', 'What if I fail and people laugh at me?',
     'Honestly, nobody will laugh at you — plainly put, nobody is that interested in you, and nobody cares that much whether you succeed or fail. Think about it: if a friend of yours failed, would you laugh, or would you comfort them? You might laugh privately, and tomorrow you would have forgotten. If you stay afraid, you will never dare do anything large with your life — you will live day to day, and by default you become the failure.']
  ],
  'swords-3': [
    ['love', 'Describe this person\'s character',
     'Someone often in pain, often troubled, very much at the mercy of their moods — the sort who lets feeling override reason, and leans to the negative. On the whole this card does not describe a cheerful person.'],
    ['love', 'What are their feelings toward me?',
     'Not happy either. They may carry wounds in love from the past that have not fully healed, so they are not really ready for a relationship. But the Three of Swords\' pain is not large, and someone carrying it can heal themselves without a breakup being necessary — though there are people who have to break up before they see anything at all.'],
    ['love', 'We are arguing — should we break up?',
     'The arguing is wearing, and there is something faintly toxic in it, but it sits entirely within your control — because this is a Minor, and Minors are what the querent can change; their energy is low. What you are arguing about may be extremely petty and childish, not worth the breath: why did you not text me when you woke up, why did you like that girl\'s photo.'],
    ['love', 'Should I keep tabs on them?',
     'Better not. Do not know each other\'s passwords, do not mind whose photos they like, do not watch them on social media, do not concern yourself with what they are doing. If they want to be beside you they will be; if not, they will not. And consider: when you chase someone they find a way to run, and when you stop minding they want to be near you — true in love and in friendship alike. Look in the mirror and ask why you need to know where they went today, who they saw, what they did.'],
    ['career', 'Will I find the right job soon?',
     'Possibly not yet. This card does not give the reason; look at the others. You may be going in a direction that does not suit you: you want to read cards, but under family and social pressure you keep having to be a bank clerk. Keep sending CVs in the wrong direction and the universe never gives you the result — it refuses, because you are on the wrong road. Turn back.'],
    ['career', 'Any change at work coming?',
     'Also not happy. Something mildly sad may happen at work: a project of yours is not as successful as you thought, though not to the point of failure. Or relations with colleagues run a little rough — no drama, nothing like the Tower, just a Three of Swords.']
  ],
  'cups-3': [
    ['love', 'Describe this person\'s character',
     'An extrovert: fond of their friends, fond of gathering, fond of going out, fond of a party.'],
    ['love', 'What are their feelings toward me?',
     'Not much can be said. Their feeling may still be only at the level of friendship — they count you as one of their friends. And if the two of you are already in a relationship and you ask this, the card is a little concerning: there may be enjoyment in it, but this card leans toward the pleasure of friends. In love you want the feeling of the Ace of Cups, of the Lovers, of the Ten of Cups — something singular, or something steadier and more solid. It is not necessarily bad, though: the level is still friendship or a little beyond, or in their relationship with you they still like going out and still have plenty of friends of the opposite sex.'],
    ['love', 'We argue a lot — should we break up?',
     'For that question, draw more. The first sense of it: the reason you argue may be that a third person has appeared. But note something important — the third person is not always on the other side. If a woman comes to you asking, the third party may not be on the man\'s side at all; it may be on hers. And querents do not always give you all the information. Tell them plainly that the answer may run both ways: what you can see is a third person\'s presence driving the conflict, and it may be on their side, but it may equally be on yours.']
  ],
  'pentacles-3': [
    ['love', 'Describe this person\'s character',
     'Fairly serious. Where the Three of Cups likes being with others to gather and enjoy themselves, the Three of Pentacles likes being with others to do something useful together. At work this is someone who likes working in a group, likes a company or office setting, rather than someone who prefers working alone. It puts the reader in mind of Aquarius energy: wanting to bring people together to do something worthwhile, not merely to socialise.'],
    ['love', 'What are their feelings toward me?',
     'Rather sad. Not bad exactly, but not happy: they only see you as a friend, or even just a colleague, someone they work or study alongside — it feels as though they want a professional relationship with you. And if you have already been together a year and this comes up, it still carries the Pentacles quality: Pentacles is what can be held, touched, seen — the material. So what they want from you in this relationship may be something material rather than only your feeling: your family may be well off, your father may be somebody, and they know that loving you raises their standing; or you live abroad with residency, and marrying you would give them the same.'],
    ['love', 'Should I leave them, then?',
     'Do not rush to the verdict of "he is like that, so you must leave." He may not be sincere — but we do not yet know whether the querent is sincere either. And there are people who accept an arrangement like this, particularly when they carry Pentacles energy themselves: they want your standing and your money, you want something else from them, and both of you are in the relationship to satisfy those aspects rather than out of feeling.'],
    ['love', 'We are arguing — should we break up?',
     'This card\'s keyword is group work, so hold off on the breakup — sit down and talk it through together first. One reason you argue may be material or financial matters, or that you have not found common ground about the future: you have loved a long time, but whether to marry, when, whether to have children straight away, whose family to live with. Those material questions have not been talked through properly — one of you wants to and the other keeps avoiding it.'],
    ['career', 'Out of work three months — will I find something?',
     'Possibly, in one of two ways. First: you find work, and it involves a great deal of working in a group, with other people. Second: you need to ask the people around you, to use your own connections to reach the opportunity — go out and ask for help, ask friends and family whether they have anything to put you forward for.'],
    ['career', 'Anything to watch at work?',
     'Simply this: group work is coming. If you have been working alone, soon you will be in a group; if you are already in one, it continues. Whether that helps or hinders depends: if you are introverted and prefer working by yourself it will bring more difficulty, while if you like interaction and are outgoing, read the group energy positively.'],
    ['other', 'How does this differ from the Three of Cups and the Hierophant?',
     'Of the 78 cards, two speak of group work: the Three of Pentacles and the Hierophant. The Hierophant leans toward education — going to school means working alongside others. The Three of Pentacles is group work pure and simple: three people conferring over a job. The Three of Cups is also a group, but a group for enjoying themselves; the group that gathers to solve a problem and reach a shared goal is this one.']
  ]
});

/* batch 12 - the four Fours */
Object.assign(ASK.vi, {
  'wands-4': [
    ['love', 'Miêu tả tính cách một người?',
     'Lá này không có nghĩa tiêu cực. Không nói được quá nhiều, nhưng điều hiện lên đầu tiên là: người này mang một năng lượng tương đối tích cực, lạc quan, và khá ổn định vững chắc.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Đẹp quá rồi. Họ muốn một mối quan hệ lâu dài với bạn; kể cả khi chưa kết hôn được thì họ cũng muốn nghiêm túc với bạn — chứ không phải yêu qua đường, không phải yêu để vui, để giết thời gian. Và họ muốn cùng bạn học được những bài học nào đó, cùng kéo nhau lên chứ không phải dìm nhau xuống. Tuy nhiên hiểu thế này: người muốn sự ổn định vững chắc trong mối quan hệ thì chưa chắc đã vui. Vì họ muốn nghiêm túc, an toàn và ổn định nên chưa chắc đã muốn bay nhảy, chưa chắc đã thích cùng nhau làm những điều điên rồ, và chưa chắc đã là người lãng mạn — muốn biết thì rút thêm lá khác.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Cảm giác là cả hai bạn ngay từ đầu đã muốn lâu dài với nhau, đã có mong muốn cam kết và đi đến hôn nhân. Nhưng có thể yêu nhau lâu quá nên quên mất lý do ban đầu vì sao mình lại yêu người này. Bạn cần quay về gốc rễ: tự hỏi xem thuở ban đầu vì sao bạn bị thu hút bởi họ. Viết ra giấy cũng được, tự nói chuyện với bản thân cũng được — rồi xem cái lý do ban đầu ấy có còn đủ mạnh để tiếp tục mối quan hệ hay không, hay những cãi vã hằng ngày đã bào mòn nó đến mức bạn không còn muốn lấy họ nữa. Bởi nếu đã muốn lâu dài thì phải học được cách thỏa hiệp và nhường nhịn; còn nếu lúc nào cũng muốn đối phương phải nghe theo ý mình, lúc nào cũng muốn mình là người thắng trong các cuộc cãi vã, thì mối quan hệ rất khó bền — huống hồ là hôn nhân.'],
    ['career', 'Thất nghiệp lâu rồi, thời gian tới có tìm được việc không?',
     'Khả năng cao là có. Và đó là công việc bạn yêu thích — vì ở đây có sự ăn mừng chúc tụng — một công việc làm được lâu dài chứ không phải làm tạm cho qua mùa dịch rồi lại đi tìm việc mới. Đúng ngành bạn thích, đúng định hướng bạn đang tìm hiểu, làm được nhiều năm. Công việc bạn không thích, công việc tạm bợ, thì lấy đâu ra ăn mừng.'],
    ['career', 'Thời gian tới công việc có gì cần lưu ý?',
     'Có thể hiện tại bạn đã sẵn năng lượng Bốn Gậy này rồi: bạn khá thỏa mãn với công việc của mình, không có ý định chuyển việc và muốn làm ở đây lâu dài — và thời gian tới năng lượng đó vẫn tiếp tục. Lưu ý là để đạt được sự ổn định thì cần có độ dài: ổn định là chuyện của tháng này qua tháng khác, chứ không phải hôm nay đang mông lung mà mai đã ổn định. Nên hiểu là công việc vốn đã ổn định rồi và sẽ tiếp tục ổn định, thậm chí đến tương lai xa. Bạn đã chọn đúng ngành, đúng hướng rồi.'],
    ['other', 'Ở trong vùng an toàn có xấu không?',
     'Không phải lúc nào sự an toàn ổn định hay vùng an toàn cũng là xấu — con người ta luôn cố gắng để đạt đến sự an toàn ổn định. Bạn ra khỏi vùng an toàn để làm gì? Để khám phá, rồi để thiết lập một vùng an toàn mới rộng hơn. Và nếu bạn còn sức, còn trẻ khỏe, thì bạn lại bước ra và lại thiết lập một vùng an toàn mới nữa. Không phải lúc nào cũng cứ tiến, tiến, tiến về phía trước — có những lúc ta cần nghỉ, và cái nghỉ đó chính là lúc bạn đang tận hưởng vùng an toàn mới mà mình vừa tạo ra. Nếu bạn vừa chiến đấu một thời gian dài thì việc nghỉ ngơi là tốt cho bạn, trước khi bắt tay vào chiến đấu tiếp.']
  ],
  'swords-4': [
    ['love', 'Miêu tả tính cách một người?',
     'Không phải là lười. Giống như kiểu người suy xét, soi xét, đánh giá rất kỹ trước khi bắt tay thực hiện. Họ không phải kiểu bộp chộp bốc đồng; họ sẽ tính toán và cố nhìn được mọi khía cạnh của vấn đề rồi mới hành động. Dĩ nhiên tính cách đó đôi khi cũng đem đến rắc rối: trong những tình huống cần ra quyết định ngay lập tức thì họ lại không quyết được. Người yêu đòi câu trả lời ngay tại thời điểm đó — yêu hay bỏ — thì họ không ra được quyết định.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Có thể chính người bạn đang hỏi đến đang chưa thật sự muốn thúc đẩy hay đẩy nhanh mối quan hệ này. Họ đang muốn mọi thứ bình bình, ở nguyên vị trí hiện tại, để họ tiếp tục đánh giá xem xét. Nên nếu bạn đang mong chờ việc họ sẽ tỏ tình hay hỏi cưới bạn mà ra lá này thì xin chia buồn — có thể bạn sẽ không nhận được câu trả lời mình mong muốn.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Không nên chia tay. Tốt nhất là cho nhau không gian riêng khoảng một đến hai ngày. Nhưng đừng chơi cái trò "tạm nghỉ" một tuần hay một tháng — trò tạm nghỉ trong chuyện yêu đương thì một trăm phần trăm rồi cũng sẽ chia tay. Thay vì đang có xích mích mà cứ nhắn tin, cứ gặp nhau, thì hai bạn nên dành một đến hai ngày tự sắp xếp lại suy nghĩ: mình đã làm gì sai, họ đã làm gì sai, mình cần nói gì với họ. Đừng gặp nhau lúc cả hai còn đang đầu nóng, còn đang nhiều lửa — chỉ để lao vào cãi nhau mà thôi.'],
    ['career', 'Thất nghiệp sáu tháng, thời gian tới tìm được công việc phù hợp không?',
     'Ở thời điểm đó thì có thể nói thẳng là bạn đang lười. Trực giác cho thấy bạn không thật sự đi tìm việc. Mong muốn hiện giờ của bạn có thể không phải là đi làm; bạn cần một công việc chỉ vì áp lực gia đình và áp lực xã hội mà thôi. Có thể bản thân bạn đang muốn một năm gap year — một năm làm bất cứ thứ gì bạn thích, không liên quan đến hành trình dài của mình, để thử thách và trải nghiệm: đi làm từ thiện, tình nguyện, hay đi học. Vì không làm đúng với mong muốn thật sự nên bạn không có động lực: gửi CV mà không thật sự chăm chút cái CV đó, và khi đi phỏng vấn thì thể hiện thái độ "tôi đỗ cũng được, trượt cũng chẳng sao".'],
    ['career', 'Người phỏng vấn có nhận ra điều đó không?',
     'Có. Ít nhiều họ đọc vị được bạn qua buổi phỏng vấn. Phỏng vấn kiến thức là một chuyện, nhưng họ còn xem xét thái độ và niềm yêu thích, sự đam mê của bạn với công việc. Người đọc bài có một người bạn đi phỏng vấn vị trí giao dịch viên ngân hàng, và người phỏng vấn nói thẳng: "Chị cảm thấy em thật sự không thích làm công việc này, em chỉ đi xin cho có thôi."'],
    ['career', 'Thời gian tới công việc có gì thay đổi không?',
     'Có thể thời gian tới, thậm chí ngay lúc này, công việc của bạn không có tiến triển gì nhiều — hơi giậm chân tại chỗ một chút. Tốt hay không thì tùy người hỏi: nếu bạn là người thích yên bình, thích nhàn, đi làm rồi về nhà, có một công việc ổn định và không có nhu cầu tham vọng gì cao, thì lá này là tốt cho bạn. Nhưng nếu bạn là người tham vọng, muốn thử thách bản thân, thì lá này lại không tốt.']
  ],
  'cups-4': [
    ['love', 'Miêu tả tính cách một người?',
     'Một người hơi thiển cận. Trong mắt họ chỉ có A và B, trắng và đen; ít khi họ nhìn được thứ gì ngoài những gì họ thấy. Họ tập trung vào những gì mắt thấy tai nghe, vào năm giác quan, mà không đi theo trực giác hay cảm giác — họ không có khả năng tưởng tượng ra một viễn cảnh khác và đi theo viễn cảnh đó.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Khá khó nói nếu chỉ có mỗi lá này. Có thể họ đang có bạn — chiếc cốc được đưa đến — nhưng mắt họ thì cứ nhìn vào những chiếc cốc khác. Đây có thể là người có xu hướng đứng núi này trông núi nọ: có bạn rồi nhưng vẫn chán cơm thèm phở, vẫn ngoái về người yêu cũ. Họ không nhận ra rằng bạn, ở thời điểm hiện tại, mới là mối quan hệ mà họ nên bỏ công sức vào, nên dành thời gian và năng lượng để chăm chút. Họ cứ ngoái nhìn những thứ ngoài tầm với của mình.'],
    ['love', 'Vậy chuyện này có thay đổi được không?',
     'Được. Bốn Cốc dù sao cũng là lá Ẩn Phụ số thấp — 2, 3, 4, 5, 6, 7 đều là số thấp. Khi một lá Ẩn Phụ số thấp xuất hiện thì hiểu rằng: thứ nhất, vấn đề này nhỏ; thứ hai, nó có thể giải quyết được dựa vào ý chí của người ở vị trí lá đó trong trải bài. Người này hiện giờ chưa nhìn nhận và đánh giá cao bạn, nhưng chuyện đó có thể thay đổi — qua việc ngồi nói chuyện với nhau, thậm chí qua một trận cãi nhau ra trò.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Vấn đề của hai bạn là: lý do cãi nhau giống như một bức tranh lớn mà bạn chỉ tập trung vào đúng một điểm để bắt lỗi nhau. Rõ ràng họ tốt với bạn, nhưng họ cũng là người có điều không hoàn hảo — và bạn cứ đay nghiến đúng cái điểm không hoàn hảo đó: tại sao anh lại thế, tại sao em lại vậy. Bạn không nhìn được bức tranh toàn cảnh: họ đã cố gắng vì bạn thế nào, đã thay đổi vì bạn ra sao, đã tốt với bạn đến đâu.'],
    ['career', 'Thời gian tới tìm được việc không?',
     'Rất đơn giản: có thể cơ hội công việc đang ở ngay trên mạng, ngay bên cạnh bạn, mà bạn không nhìn ra — trong khi bạn lại cứ đi tìm kiếm những công việc ở tận đâu.'],
    ['career', 'Thời gian tới công việc có gì thay đổi không?',
     'Có thể hiện giờ trong công việc và sự nghiệp của bạn đang có những cơ hội mới mà bạn không nhận ra, còn bạn thì đang nhăm nhe ngắm nhìn những cơ hội và hướng đi không dành cho mình. Ví dụ: bạn rất giỏi vẽ, nên lẽ ra bạn nên học vẽ và làm họa sĩ hoặc theo đuổi thiết kế — đúng sở thích và tài năng. Nhưng ra trường bạn lại chọn đi vẽ chân dung ở phố đi bộ, vẽ vài năm rồi không hiểu vì sao chẳng ai nhận ra khả năng của mình. Đó chính là một hình thức của việc đi sai hướng.'],
    ['other', 'Tôi không tự định hướng được thì làm sao?',
     'Nếu bạn tự cảm thấy mình không có khả năng điều hướng cho bản thân — đúng kiểu người Bốn Cốc — thì hãy tìm một người thầy, một người dẫn đường. Đó chính là lý do vì sao chúng ta cần một mentor: họ chỉ đường dẫn lối cho bạn đi hướng nào, còn bạn chỉ việc cố gắng đi theo con đường đó.']
  ],
  'pentacles-4': [
    ['love', 'Miêu tả tính cách một người?',
     'Một người luôn nắm giữ quyền lực, luôn muốn mọi thứ phải theo ý mình, không chịu san sẻ nguồn lực cho ai — dù rõ ràng người này không hề nghèo, không hề thiếu. Nhưng họ sống với tâm thức "tôi thiếu", và thế là họ thu hút về đúng cái thực tại thiếu thốn đó. Ví dụ: bạn không hề nghèo nhưng luôn nghĩ mình nghèo, luôn nghĩ tiền kiếm được hôm nay ngày mai sẽ mất; lúc nào cũng sợ mất tiền nên rất keo kiệt, không cho ai cái gì, và keo kiệt với cả bản thân — lúc cần uống thuốc chữa bệnh cũng không mua, để cơ thể tự khỏi cho tiết kiệm.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Cũng không hay ho gì cho lắm. Có thể họ yêu bạn, nhưng hoặc là muốn kiểm soát bạn, hoặc là rất dè chừng trong việc trao đi tình cảm vì sợ sẽ bị tổn thương — có thể họ đã từng bị tổn thương trong quá khứ nên giờ cảnh giác. Cụ thể thế nào thì rút thêm lá.'],
    ['love', 'Cãi nhau nhiều, làm thế nào để cải thiện?',
     'Một trong hai người, thậm chí cả hai, có xu hướng kiểm soát đối phương — mà thường sẽ là chính người hỏi: anh phải thế này, em phải ăn mặc thế kia, em phải nói theo cách này, em phải đối xử với anh như thế nọ. Hãy học cách buông bỏ kiểm soát, và chấp nhận yêu một người đúng với bản chất của họ, chứ đừng tìm cách thay đổi cái bản chất đó.'],
    ['love', 'Lá này còn nói về chuyện gì trong tình cảm?',
     'Đôi khi nó là giữ khư khư hình ảnh của người cũ, không chịu buông bỏ người cũ — không nhất thiết là đeo bám họ. Người đọc bài từng gặp một trải bài như vậy: hai người đã chia tay vài năm, không liên lạc vài năm, nhưng người hỏi vẫn tự tưởng tượng và vẽ nên hình ảnh đẹp đẽ hoàn hảo nhất về người cũ, và cho rằng đó mới là người phù hợp với mình. Bạn không nhận ra rằng cái hình ảnh bạn xây dựng lên không hề khớp với thực tại của người đó — nó không phải là người đó nữa, mà là một người khác.'],
    ['career', 'Sắp tới có tìm được công việc như ý không?',
     'Có thể vẫn chưa, và một phần là do thái độ của bạn: bạn đang tìm cách kiểm soát tình huống. Người đọc bài gặp rất nhiều người tìm việc đến hỏi bài với yêu cầu rằng chắc chắn trong tháng này phải tìm được việc, điều kiện thứ hai là lương phải cao, điều kiện thứ ba là mình phải thích công việc đó — và chắc chắn phải trong tháng này. Người tính không bằng trời tính. Hãy học cách xuôi theo dòng. Thay vì bắt buộc bản thân phải có tin vui trong tháng này, hãy nhìn lại: vì sao trước đó tôi trượt phỏng vấn, tôi cần cải thiện điều gì? Và nếu cần ba đến bốn tháng để lấy được cái bằng cấp còn thiếu thì đành phải bỏ ra ba đến bốn tháng thôi.'],
    ['career', 'Ba tháng tới công việc có gì cần lưu ý?',
     'Có thể hiện tại bạn đang tham quyền cố vị, hoặc đang có xu hướng rất ích kỷ trong công việc: bạn có kiến thức nhưng không muốn chia sẻ cho người làm cùng, không muốn chỉ cho người mới. Đây là chuyện điển hình ở công ty — những người làm lâu năm có kinh nghiệm hơn nhưng không muốn chia sẻ, vì họ sợ bạn giỏi lên. Đó chính là điển hình của sự thiển cận.'],
    ['other', 'Vì sao nên buông bỏ?',
     'Bài học của Bốn Tiền là buông bỏ sự tham lam và buông bỏ kiểm soát. Nếu bạn cứ giữ khư khư món đồ chơi mà bạn không dùng đến, thì bạn sẽ không bao giờ biết là có những món đồ chơi tốt hơn đang chờ mình. Người đọc bài kể rằng chính cô từng là người luôn muốn mọi thứ theo ý mình, và sau nhiều lần — trong học tập, công việc, tình cảm — cô nhận ra mọi thứ luôn đi chệch hướng. Nhưng nhìn lại một quãng dài thì mọi thứ đều có lý do: lý do cô thất bại ở một mối quan hệ hay một cơ hội là vì có một cánh cửa khác tốt hơn đang chờ phía trước. Ở thời điểm đó thì đau khổ, sụp đổ, thất vọng; nhưng khi cánh cửa mới đến thì nhìn lại mới thấy: nếu không thất bại ở cái cũ thì đã chẳng bao giờ biết là có cơ hội mới này.']
  ]
});

Object.assign(ASK.en, {
  'wands-4': [
    ['love', 'Describe this person\'s character',
     'This card has no negative sense. It will not tell you a great deal, but the first thing that surfaces is: this person carries a fairly positive, optimistic energy, and is quite stable and solid.'],
    ['love', 'What are their feelings toward me?',
     'Beautiful. They want something long-term with you; even where marriage is not possible they want to be serious with you — not a passing affair, not love to fill the time. And they want to learn something alongside you, the two of you pulling each other up rather than dragging each other down. But understand this: someone who wants stability and solidity in a relationship is not necessarily fun. Because they want seriousness, safety and steadiness, they may not want to fly about, may not be the sort for doing mad things together, and may not be romantic — though they might be; draw another card.'],
    ['love', 'We are arguing — should we break up?',
     'The sense is that both of you wanted the long term from the start, both had wishes for commitment and marriage. But perhaps you have loved so long that you have forgotten the original reason you loved this person. Go back to the root: ask yourself what first drew you to them. Write it down, or talk it through with yourself, and see whether that original reason is still strong enough to carry the relationship — or whether the daily arguing has worn it down to the point where you no longer want to marry them. Because wanting the long term means learning to compromise and to give way. If you always want them to follow your line, always want to win the argument, the relationship is very hard to sustain — let alone a marriage.'],
    ['career', 'Out of work a long time — will I find something?',
     'A strong chance yes. And it is work you love — there is celebration in this card — work you can stay in for the long run rather than a stopgap to get through a bad season before job-hunting again. The right field, the right direction you have been looking into, work you could do for years. Work you do not like, work taken as a stopgap, would not be getting a celebration.'],
    ['career', 'Anything to watch at work?',
     'You may already be carrying this Four of Wands energy: fairly satisfied with your work, no intention of moving, wanting to stay a long time — and that energy simply carries on. Note that stability requires duration: it is a matter of one month after another, not of being adrift today and settled tomorrow. So read it as work that is already stable and will go on being stable, even far ahead. You have chosen the right field and the right direction.'],
    ['other', 'Is being in a comfort zone a bad thing?',
     'Safety, stability and the comfort zone are not always bad — people spend their lives working toward safety and stability. Why do you leave the comfort zone? To explore, and then to build a larger one. And if you still have the strength and the youth, you step out again and build another. It is not a matter of pushing forward for ever: there are times you need to stop, and that stopping is precisely you enjoying the new comfort zone you have just made. If you have been fighting a long stretch, resting is good for you before you take up the fight again.']
  ],
  'swords-4': [
    ['love', 'Describe this person\'s character',
     'Not lazy. More the sort who considers, examines and weighs very carefully before starting anything. They are not impulsive; they will calculate and try to see every side of a thing before acting. That trait brings its own trouble, of course: in a situation demanding an immediate decision, they cannot make one. A partner asking for an answer right now — stay or go — will not get it.'],
    ['love', 'What are their feelings toward me?',
     'The person you are asking about may not really want to push this relationship along or speed it up. They want everything level, exactly where it is, so they can go on weighing it. So if you were hoping they would confess or propose and this card comes up — condolences; you may not get the answer you were after.'],
    ['love', 'We are arguing — should we break up?',
     'Do not. It is far better to give each other private space for a day or two. But do not play the "taking a break" game for a week or a month — in romance, taking a break ends in a breakup a hundred times out of a hundred. Rather than texting or meeting while the friction is live, spend a day or two each putting your own thoughts in order: what did I do wrong, what did they do wrong, what do I need to say. Do not meet while both heads are hot and both of you are full of fire; you will only fly at each other.'],
    ['career', 'Unemployed six months — will I find something suitable?',
     'At that point one can say plainly: you are being lazy. The sense is that you are not genuinely job-hunting. What you actually want right now may not be a job at all; you may need one only under family and social pressure. You may want a gap year — a year doing whatever you like, unrelated to the long road, to test yourself and gather experience: charity, volunteering, study. And because it is not what you truly want there is no drive in it: you send CVs without caring about the CV, and at interview you carry the attitude of "if I get it fine, if not, no matter."'],
    ['career', 'Would an interviewer notice that?',
     'Yes. They read you at least in part across an interview. Testing your knowledge is one thing, but they are also weighing your attitude and your genuine appetite for the work. the reader had a friend interviewing for a bank teller role who was told outright: "I get the feeling you do not really want this job, that you are only applying for the sake of it."'],
    ['career', 'Any change at work coming?',
     'In the coming stretch, and even right now, your work may not move on much — marking time somewhat. Whether that is good depends on you: if you like a quiet life, an easy one, work and then home, a steady job with no great ambitions, this card is good for you. If you are ambitious and want to test yourself, it is not.']
  ],
  'cups-4': [
    ['love', 'Describe this person\'s character',
     'Someone rather short-sighted. In their eyes there is only A and B, black and white; they rarely see anything past what is in front of them. They fix on what the eye sees and the ear hears, on the five senses, without following intuition or feeling — they cannot picture another scenario and go toward it.'],
    ['love', 'What are their feelings toward me?',
     'Hard to say with this card alone. They may have you — the cup being offered — while their eyes stay on the other cups. This may be someone forever standing on one hill and eyeing the next: they have you, and still hanker after something else, still glance back at an ex. They do not see that you, right now, are the relationship worth putting effort into, worth their time and their care. They keep looking back, and looking at what is out of reach.'],
    ['love', 'Can that change?',
     'It can. The Four of Cups is a low-numbered Minor — two, three, four, five, six and seven are all low. When a low Minor appears, understand two things: the problem is small, and it can be resolved through the will of whoever occupies that position in the spread. This person does not currently see or value you highly, but that can change — through sitting down and talking, or even through one proper row.'],
    ['love', 'We are arguing — should we break up?',
     'Your problem is that the reason you argue is like a large picture in which you fix on one single point to fault each other over. They are plainly good to you, and they are also a person with imperfections — and you keep worrying at exactly that imperfection: why did you do this, why did you do that. You are missing the whole picture: how much they have tried for you, how they have changed for you, how good they are to you.'],
    ['career', 'Will I find work soon?',
     'Very simply: the opportunity may be right there online, right beside you, and you cannot see it — while you go hunting for work somewhere far off.'],
    ['career', 'Any change at work?',
     'There may be new opportunities in your work and your career that you do not notice, while you are eyeing opportunities and directions that were never meant for you. An example of the wrong direction: you are genuinely good at drawing, so you ought to study art and become an artist or go into design — which fits your interest and your talent. Instead you graduate and take up sketching portraits on the walking street, and after a few years you cannot understand why nobody has noticed what you can do. That is what going the wrong way looks like.'],
    ['other', 'What if I cannot find my own direction?',
     'If you feel you have no capacity to steer for yourself — very much the Four of Cups type — then find a teacher, someone to lead the way. That is exactly why a mentor exists: they point out which road to take, and your part is simply to walk it.']
  ],
  'pentacles-4': [
    ['love', 'Describe this person\'s character',
     'Someone who always holds on to the power, always wants everything their way, and will not share resources with anyone — though they are plainly not poor and plainly lack nothing. But they live in a mindset of "I do not have enough," and so they draw exactly that reality of scarcity toward them. You are not poor, but you always think you are; you always think the money earned today will be gone tomorrow for some reason. Always afraid of losing it, you are very tight — you give nobody anything, and you are tight with yourself too: you will not buy the medicine you need, and let the body heal itself to save the money.'],
    ['love', 'What are their feelings toward me?',
     'Not especially good. They may love you, but either they want to control you, or they are very guarded about giving feeling for fear of being hurt — perhaps they were hurt in the past and are wary now. Draw more for the specifics.'],
    ['love', 'We argue a lot — how do we improve it?',
     'One of you, or both, tends to control the other — and usually it is the querent: you must be like this, you must dress like that, you must speak this way, you must treat me so. Learn to let the control go, and accept loving a person as they actually are rather than looking for ways to change that nature.'],
    ['love', 'What else does this card say about love?',
     'Sometimes it is clutching the image of an ex, refusing to let the old person go — not necessarily stalking them. the reader once read exactly this: two people separated some years back, out of contact for years, and the querent still painting the most beautiful, most perfect picture of that ex and believing this was the person who suited them. You do not see that the image you built does not match the reality of that person at all — it is not them any more; it is someone else.'],
    ['career', 'Will I find the right job soon?',
     'Possibly not yet, partly because of your attitude: you are trying to control the situation. the reader meets a great many job-seekers who come to a reader stipulating that they must certainly find work this month, that it must pay well, that they must like it, and that it must be this month. Man proposes; heaven disposes. Learn to go with the current. Instead of demanding good news this month, look back: why did I fail those interviews, what do I need to improve? And if it takes three or four months to get the qualification you are missing, then it takes three or four months.'],
    ['career', 'Anything to watch at work over the next three months?',
     'You may be clinging to your position, or running a very selfish streak at work: you have the knowledge and will not share it with the people beside you, will not show the new arrivals. This is the classic office pattern — the long-serving hold more experience and will not pass it on, because they are afraid you will get good. That is short-sightedness in its purest form.'],
    ['other', 'Why should I let go?',
     'The lesson of the Four of Pentacles is to let go of greed and let go of control. Keep clutching a toy you never even use and you will never learn there are better ones waiting for you. the reader says she was once exactly the person who wanted everything her own way, and after several rounds of it — in study, in work, in love — she found that everything always went off course. But looking back across a long stretch, everything had its reason: the reason she failed at a relationship or an opportunity was that a better door was waiting further on. At the time it was collapse and disappointment and every worst feeling; and when the new door came she looked back and saw that without the failure she would never have known the new opportunity was there at all.']
  ]
});

/* batch 13 - the four Fives */
Object.assign(ASK.vi, {
  'wands-5': [
    ['love', 'Miêu tả tính cách một người?',
     'Có thể là người thích cà khịa, thích nói những câu mỉa mai — không hẳn mang ý xấu, không phải muốn làm hại ai, tính họ là như vậy thôi, và chỉ dừng ở mức đó chứ không có hành động cụ thể để hại người ta. Hoặc là người luôn bị giằng xé bên trong, luôn xung đột nội tâm: muốn làm mà lại không muốn làm, muốn yêu mà lại không muốn yêu.'],
    ['love', 'Người thích tranh luận thì có xấu không?',
     'Không phải lúc nào cũng xấu. Nếu họ thích dìm hàng người khác xuống để nâng mình lên thì đó lại là kiểu khác. Còn kiểu thích tranh luận để phản biện lại ý của bạn thì không đồng nghĩa với việc họ ghét bỏ hay muốn dìm bạn. Đôi khi họ tranh luận vì muốn tìm ra điểm phi lôgic của vấn đề, và với họ thứ quan trọng nhất là sự thật. Nếu bạn đưa ra được lập luận lôgic thì chính người này sẽ dạy bạn khả năng tư duy lập luận. Những người như thế đôi khi dạy bạn những bài học hơi khô khan, hơi khó học, nhưng học được rồi thì tốt hơn cho bạn.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Có thể là thích đấy, nhưng đang gặp xung đột, mâu thuẫn nội tâm: thích nhưng vì lý do gì đó, thích mà lại không thích, yêu mà lại không. Lý do cụ thể thì hơi phức tạp, phải rút thêm.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Chưa nên. Cái hiện ra ở đây là hai bạn đang thiếu sự nói thẳng nói thật. Cãi nhau thì toàn cãi chuyện lặt vặt — tại sao anh không nhắn tin trước, tại sao ngủ dậy anh không nhắn cho em, tại sao em về đến nhà mà không nhắn cho anh. Nhưng bản chất vấn đề là bạn đang cảm thấy bất an nên tìm cách kiểm soát mối quan hệ; bạn lo rằng họ có người thứ ba. Những điều thật lòng đó thì bạn lại không chịu nói ra, mà không nói ra thì họ sẽ không bao giờ hiểu được vì sao bạn cư xử theo cách bạn đang cư xử. Với Năm Gậy thì hãy một lần nói ra cho bằng hết: bạn thật sự nghĩ gì, bạn lo sợ điều gì.'],
    ['career', 'Thời gian tới có tìm được công việc như ý không?',
     'Có thể tình trạng hiện giờ của bạn đúng là Năm Gậy: mãi không tìm được công việc phù hợp vì bạn đang có mâu thuẫn bên trong. Có thể bạn thích một công việc nhưng lại chạy theo tìm kiếm một công việc khác — biết là mình thích theo đuổi nghệ thuật, nhưng vì gia đình và vì tấm bằng nên cứ đi tìm việc kinh tế. Đó là đi không đúng hướng, và vũ trụ không bao giờ cho bạn cơ hội ở hướng đó. Hãy giải quyết mâu thuẫn bên trong trước, tìm ra vấn đề của bản thân và chấp nhận con đường mình thật sự muốn đi — lúc đó chuyện tìm việc mới trở nên đơn giản hơn.'],
    ['career', 'Thời gian tới công việc có vấn đề gì không?',
     'Có thể sẽ có chút xung đột nhỏ với người làm cùng, nhưng cường độ thấp — chỉ là xung đột không đáng kể. Để chắc ăn thì nên rút thêm lá phụ trợ, xem liệu cái xung đột bé này nếu giải quyết không cẩn thận thì có dẫn đến xung đột lớn hơn không. Đôi khi nó chỉ là một xung đột bé thật, nhưng vì người hỏi giải quyết thiếu cẩn trọng, thiếu tinh tế, khiến đối phương để bụng, thì sau này họ sẽ tìm cách trả đũa gấp mười lần.'],
    ['other', 'Vì sao người ta nói tương lai trong Tarot là thay đổi được?',
     'Cái hay của Tarot là bạn xem được những thứ CÓ THỂ xảy ra. Nếu bạn làm theo hướng ngược lại thì cái tương lai hiện lên trong trải bài đó sẽ không xuất hiện nữa. Dĩ nhiên là thay đổi trong một khoảng nhất định thôi — bạn nghe câu "đức năng thắng số" rồi đấy: thay đổi được trong khoảng đó, chứ không vượt ra khỏi khoảng ấy được.']
  ],
  'swords-5': [
    ['love', 'Miêu tả tính cách một người?',
     'Người thích tranh luận, thích tranh cãi — nhưng theo kiểu tranh cãi để làm gì, chẳng để làm gì cả. Thắng bằng lời nói, và cái thắng đó chẳng vẻ vang gì, chỉ khiến bản ngã của họ được thỏa mãn nhất thời.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Riêng lá này thì hơi khó, nên rút thêm. Có thể là có tình cảm, nhưng cách hành xử của họ khiến bạn thấy khó chịu. Có những người thật lòng yêu quý bạn nhưng lúc nào cũng "em phải thế này, anh phải thế kia" — yêu thật đấy, nhưng lời nói của họ, hoặc cách họ giao tiếp, kể cả cách viết, cách nhắn tin, khiến bạn bực bội.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Không những cãi nhau mà hai bạn còn có xu hướng làm tổn thương nhau bằng lời nói, và tổn thương một cách không đáng có: cãi nhau chỉ vì anh cho rằng ngủ sớm thì tốt còn em cho rằng ngủ muộn thì tốt. Năng lượng của Năm Kiếm còn khá trẻ con. Lời khuyên: hãy giải quyết vấn đề của Năm Kiếm đã rồi hãy nghĩ đến chuyện chia tay. Còn nếu bạn cảm thấy mình đã cố gắng rồi mà họ vẫn cứ là Năm Kiếm, thì lúc đó bạn có thể chia tay.'],
    ['career', 'Thất nghiệp vài tháng, thời gian tới tìm được việc không?',
     'Riêng lá này thì khó nói về chuyện có hay không. Nhưng cảm nhận được là bên cạnh bạn có thể đang có một người nói những lời khiến bạn thấy mình kém cỏi: "mày không làm được đâu", "tao biết mày chả làm nên trò gì", "mày định xin vào công ty đấy à, loại như mày á", "ngày xưa mày đã bị loại khỏi công ty A, bị đuổi khỏi công ty B rồi". Có thể là gia đình, có thể là bạn bè, có thể là người yêu. Dù là ai thì bên cạnh bạn đang có một người mang năng lượng Năm Kiếm — phải cẩn trọng.'],
    ['career', 'Thời gian tới công việc có gì cần lưu ý?',
     'Hoặc bạn gặp phải, hoặc chính bạn là người mang năng lượng Năm Kiếm — dùng lời nói làm tổn thương người khác. Có thể bạn bị sếp sỉ nhục, nói những lời không phải; hoặc chính bạn là người nói những lời không phải với người khác. Nếu bạn là người bị nói, hãy đáp trả bằng sự tử tế, tốt bụng và tha thứ, đừng ăn miếng trả miếng.'],
    ['other', 'Tranh cãi trên mạng thì sao?',
     'Bạn cãi nhau với người lạ trên mạng, cố cho bằng được, thậm chí soạn cả bài dài để chửi nhau, ai im trước là thua. Cuối cùng họ không trả lời và bình luận của bạn được nhiều like hơn — bạn thắng, bản ngã của bạn thắng, bạn sướng. Nhưng tất cả những gì bạn đang làm chẳng có nghĩa lý gì cả. Việc họ không trả lời không phải là họ nhận thua — có thể họ bận: bận kiếm tiền, bận đi chơi với người yêu, bận với gia đình con cái, bận báo hiếu cha mẹ. Việc bạn thắng cuộc tranh luận vô nghĩa này không thay đổi bất cứ điều gì trong cuộc sống bạn. Mỗi người có một quan điểm riêng; việc họ nghĩ khác bạn là điều bình thường, và bạn không bao giờ bắt họ nghĩ giống bạn được.'],
    ['other', 'Khẩu nghiệp là gì?',
     'Việc bạn làm tổn thương ai đó bằng lời nói, sỉ nhục ai đó, chính là khẩu nghiệp. Đừng nghĩ nó không quan trọng — nó tích tụ, và nó là nghiệp xấu. Khi bị ai đó sỉ nhục, Người đọc bài hiểu rằng có thể kiếp trước mình đã sỉ nhục họ nên kiếp này họ trả lại; hoặc trong quá khứ mình đã nói nặng với người khác nên bây giờ một người khác trả lại cho mình. Còn nếu bạn là người sắp nói ra những lời khó nghe: dù có ghét họ đến mấy, đừng bao giờ khiến người khác phải chịu tổn thương — mọi cảm xúc tiêu cực bạn gây ra cho người khác đều là nghiệp.']
  ],
  'cups-5': [
    ['other', 'Lá này là tích cực hay tiêu cực?',
     'Nó giống một lời khuyên hơn là một sự kiện tích cực hay tiêu cực. Từ khóa là thất bại và đổ vỡ — nhưng nhớ cho là cường độ nhỏ: thất bại nhỏ, đổ vỡ nhỏ. Và việc bạn coi đó là thất bại để đời hay không thì hoàn toàn do cách nhìn nhận của người hỏi.'],
    ['other', 'Vì sao cùng nói về thất bại mà Ẩn Phụ lại nhẹ hơn?',
     'Những sự kiện xảy ra trong Ẩn Phụ thường mang cường độ và tần suất nhẹ hơn Ẩn Chính. Cùng là một lá nói về thất bại, nhưng thất bại của Ẩn Chính sẽ lớn hơn — giống như một sự thất bại do vũ trụ sắp đặt. Trong Ẩn Phụ thì chỉ có những lá số 9 và nhất là số 10 mới có năng lượng gần bằng Ẩn Chính; còn những lá 2, 3, 4, 5, 6, 7 thì năng lượng thấp, và xấu hay tốt phần nhiều là do chính người hỏi tạo ra.'],
    ['love', 'Tôi vừa thất bại, vừa đổ vỡ thì nên nhìn thế nào?',
     'Như trong hình: đằng sau anh chàng vẫn còn hai chiếc cốc đứng vững, mà anh ta lại không chịu nhìn — anh ta chỉ nhìn vào phần đã đổ, không chịu nhìn vào mặt tốt của vấn đề. Có một ly nước thì nhìn vào phần vơi thay vì nhìn vào phần đầy. Cuộc sống làm sao mọi thứ theo ý ta được: có những lúc thất bại, có những lúc chia ly. Nhưng điều đó không có nghĩa là bạn phải mang nỗi khổ này cả đời — bạn vẫn phải tiến về phía trước, và hãy nhìn vào hai chiếc cốc còn đầy: tôi học được bài học gì từ lần đổ vỡ này?'],
    ['love', 'Vừa chia tay người yêu thì áp dụng thế nào?',
     'Thay vì vật vã "tôi không xứng đáng được yêu, cả đời này chắc chẳng yêu ai nữa", hãy nhìn vào phần tích cực: nhờ lần chia tay này mà tôi nhận ra tôi không hợp với một mối quan hệ như thế, tôi cần phải thay đổi điều này điều kia. Đó là lúc bạn trở nên lạc quan hơn và nhìn vào hai chiếc cốc còn lại.']
  ],
  'pentacles-5': [
    ['love', 'Miêu tả tính cách một người?',
     'Một người tự ti. Có thể trong quá khứ hoàn cảnh gia đình họ không tốt, họ sinh ra và lớn lên trong một môi trường thiếu thốn vật chất, và điều đó ảnh hưởng đến cách họ nhìn cuộc sống. Dù bây giờ đã trưởng thành, có chỗ đứng trong xã hội, được mọi người coi trọng, tự chủ về tài chính và chẳng có gì để chê, thì sự tự ti đó vẫn theo đuổi họ như một vết thương lòng. Và nếu họ không quan sát bản thân và chủ ý muốn thay đổi thì họ sẽ có những hành động, thái độ vô thức thể hiện sự tự ti ấy.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Từ khóa của lá này là thiếu thốn — và ở đây là thiếu thốn tình cảm. Có thể họ sinh ra trong một môi trường mà bố mẹ bỏ rơi họ, hoặc bố mẹ không quan tâm đến họ, nên họ luôn cảm thấy thiếu về mặt tình yêu. Mà người thiếu tình yêu thì khi lớn lên cũng không biết cách trao đi tình yêu, vì họ sợ rằng trao trái tim mình ra thì người đó sẽ làm tổn thương họ rồi lại bỏ họ đi một lần nữa, như họ đã từng bị bỏ rơi từ bé. Tình cảm thì có thể có, nhưng vết thương và vấn đề của họ thì họ phải tự giải quyết trước đã.'],
    ['love', 'Có nên bắt đầu một mối quan hệ với người mang lá này không?',
     'Lời khuyên là không. Vì kể cả có ở trong một mối quan hệ thì cũng chưa chắc đã lâu dài, do chính những vấn đề của họ.'],
    ['love', 'Tôi có thể chữa lành cho họ không?',
     'Đừng bao giờ nghĩ rằng bạn có thể chữa lành cho ai đó, rằng bạn sẽ trở thành thiên thần cứu rỗi họ. Và cũng đừng nghĩ rằng vấn đề của bạn sẽ có một thiên thần nào đó đến mang đi hộ. Mọi vấn đề tinh thần là của ai người đó tự chữa. Nhiệm vụ của người đọc bài chỉ là giúp bạn nhìn ra vấn đề của mình — giống như bác sĩ chẩn đoán bệnh và kê đơn. Còn có nghe lời khuyên hay không, có uống thuốc hay không, là việc của bạn. Bác sĩ không bao giờ nhét thuốc vào bụng bệnh nhân.'],
    ['love', 'Cãi nhau, có nên tiếp tục mối quan hệ không?',
     'Thay vì tiếp tục để rồi lại tiếp tục cãi nhau, hãy hỏi bản thân: cái thiếu thốn của mình là gì, vấn đề gì khiến mình luôn cảm thấy thảm hại, thiếu thốn, không thỏa mãn trong mối quan hệ này? Hỏi bản thân, đồng thời cũng hỏi lại họ — ngồi xuống nói rõ vấn đề của nhau. Trong mọi mối quan hệ, nếu được thì hãy nói thẳng, chứ đừng im lặng rồi mong người ta đoán. Và khi họ không đoán được thì bạn lại bắt đầu chơi trò trừng phạt bằng im lặng, không nói chuyện mấy ngày, và nghĩ rằng đối phương xứng đáng nhận sự im lặng đó vì họ không hiểu mình.'],
    ['career', 'Thời gian tới tìm được công việc như ý muốn không?',
     'Buồn cho bạn là có thể không. Hoặc công việc đó sẽ không mang lại tài chính, vật chất như bạn mong muốn. Đây là thời gian để bạn tiết kiệm và xem lại chi tiêu — giai đoạn này tài chính không được như ý, kém hơn nhiều so với kỳ vọng: bạn mong kiếm được mười thì có thể chỉ được một phần trong đó.'],
    ['career', 'Thời gian tới công việc có gì cần lưu ý?',
     'Có thể sẽ có những vấn đề liên quan đến tiền bạc, tài chính: tháng này bạn chỉ nhận được một phần lương, hoặc vì một chuyện gì đó mà tiền dự án bị chậm lại.'],
    ['other', 'Tôi kiềm chế phản ứng của mình thế nào?',
     'Chúng ta không bao giờ thay đổi được những gì người khác nói hay làm với mình, và cũng không kiểm soát được suy nghĩ và cảm xúc đầu tiên của mình — cái phản ứng đầu tiên. Nhưng chúng ta hoàn toàn kiểm soát được lời nói và hành động của mình sau đó. Dù cảm thấy bực bội, rất cáu giận, bạn vẫn có thể cư xử bình tĩnh — hoặc để bản thân bị cuốn theo cơn giận đó. Đó là lý do có câu uốn lưỡi bảy lần trước khi nói: trước khi làm điều gì mà bạn cảm thấy sẽ tiêu cực, hãy dừng lại một hai giây và nghĩ xem vì sao mình lại muốn hành xử như thế, và mình có muốn sự việc diễn ra theo hướng đó không.']
  ]
});

Object.assign(ASK.en, {
  'wands-5': [
    ['love', 'Describe this person\'s character',
     'Possibly someone who likes needling people, who enjoys a barbed remark — not necessarily meaning harm, not out to hurt anyone; it is simply their nature, and it stops there, with no concrete act behind it. Or someone permanently torn inside, in constant inner conflict: wanting to do it and not wanting to, wanting to love and not wanting to.'],
    ['love', 'Is someone who loves arguing a bad thing?',
     'Not always. If they like putting others down to raise themselves, that is a different kind. But someone who likes to argue in order to counter your point is not thereby disliking you or trying to diminish you. Sometimes they argue because they want to find where the logic breaks, and what matters most to them is the truth. Give them a sound argument and this person will teach you how to reason. People like that sometimes teach you dry, difficult lessons — and once learned they serve you well.'],
    ['love', 'What are their feelings toward me?',
     'They may well like you, and be caught in conflict and inner contradiction: liking you but for some reason, liking and not liking, loving and not. The specific reason is rather tangled; draw more.'],
    ['love', 'We are arguing — should we break up?',
     'Not yet. What shows here is that you are not saying things straight. You argue, and always over trifles — why did you not text first, why did you not text when you woke, why did you not text when you got home. But the substance of it is that you feel insecure and are looking for ways to control the relationship; you are afraid there is a third person. Those true feelings you will not say — and unsaid, they will never understand why you behave as you do. With the Five of Wands: say all of it once, properly. What you actually think, and what you are afraid of.'],
    ['career', 'Will I find the right job soon?',
     'Your present state may be precisely a Five of Wands: never finding suitable work because you are in conflict with yourself. You may want one kind of work and be chasing another — knowing you want to pursue art and, because of family and a degree, hunting economics jobs instead. That is going the wrong way, and the universe never opens opportunities in that direction. Resolve the conflict inside first, find your own problem, accept which road you actually want — and then the job question becomes far simpler.'],
    ['career', 'Any trouble at work coming?',
     'There may be a small conflict with someone you work with, but at low intensity — negligible. To be safe, draw supporting cards to see whether this small conflict, handled carelessly, could grow into a larger one. Sometimes it really is small, and because the querent handles it without care or tact the other person takes it to heart, and later finds a way to repay it tenfold.'],
    ['other', 'Why is the future in tarot said to be changeable?',
     'The value of tarot is that you see what COULD happen. Act the other way and the future the spread showed you simply does not arrive. Within limits, of course — you know the saying that merit can outweigh fate: changeable inside the range, not beyond it.']
  ],
  'swords-5': [
    ['love', 'Describe this person\'s character',
     'Someone who likes to argue and to debate — but in the manner of arguing to no purpose whatever. Winning by words, and a win with no glory in it, satisfying nothing but the ego, and only for a moment.'],
    ['love', 'What are their feelings toward me?',
     'This card alone makes it hard; draw more. There may be feeling, but the way they behave makes you uncomfortable. Some people genuinely care for you and still spend all their time on "you must do this, you must do that" — they love you truly, and their words, or the way they communicate, even the way they write and message, leave you irritated.'],
    ['love', 'We are arguing — should we break up?',
     'You do not only argue; you tend to wound each other with words, and needlessly — fighting because one of you holds that going to bed early is better and the other that late is better. The Five of Swords still carries fairly childish energy. The advice: deal with the Five of Swords problem first, and then think about breaking up. If you feel you have tried and they are still a Five of Swords, then you may.'],
    ['career', 'Out of work some months — will I find something?',
     'This card alone says little about whether you will. But the sense of it is that someone beside you may be saying things that make you feel worthless: "you cannot do it", "I know you will never amount to anything", "you are applying there? someone like you?", "you were rejected by A and fired from B." It could be family, friends, or a partner. Whoever it is, someone with Five of Swords energy is standing next to you — be careful.'],
    ['career', 'Anything to watch at work?',
     'Either you meet the person carrying Five of Swords energy, or you are that person — using words to wound. You may be humiliated by a manager, told things you should not be; or you may be the one saying them. If you are on the receiving end, answer with kindness, decency and forgiveness rather than trading blow for blow.'],
    ['other', 'What about arguing online?',
     'You argue with a stranger online, determined to win, even composing long essays to fight with them — whoever falls silent first loses. In the end they stop replying and your comment has more likes, so you have won; your ego has won and you feel wonderful. But none of what you are doing means anything. Their silence is not concession — they may simply be busy: busy earning, busy with their partner, busy with their children, busy looking after their parents. Winning this pointless argument changes nothing in your life. Everyone holds their own view; that they think differently from you is normal, and you will never make them think as you do.'],
    ['other', 'What is the karma of speech?',
     'Wounding someone with words, humiliating them, is exactly that karma. Do not imagine it does not matter — it accumulates, and it is bad karma. When she is humiliated, the reader takes it that perhaps in a past life she humiliated them and this life they are repaying it; or that she once spoke harshly to others and now someone else returns it to her. And if you are about to say something cutting: however much you dislike them, never leave another person carrying a wound — every negative feeling you cause in someone else is karma.']
  ],
  'cups-5': [
    ['other', 'Is this card positive or negative?',
     'It reads more as advice than as a positive or negative event. The keyword is failure and breakage — but note the intensity: a small failure, a small loss. And whether you count it as the failure of your life rests entirely on how the querent chooses to see it.'],
    ['other', 'Why is a Minor lighter, when the theme is the same?',
     'Events in the Minors carry lower intensity and frequency than the Majors. Take the same theme of failure: a Major\'s failure is larger, something arranged by the universe. Among the Minors only the nines and especially the tens approach Major-level energy; the twos, threes, fours, fives, sixes and sevens carry low energy, and whether they turn out good or bad is largely made by the querent.'],
    ['love', 'I have just failed at something — how should I see it?',
     'As in the picture: two cups are still standing behind him, and he will not look at them — he looks only at what spilled, and refuses the good side of it. Given a glass of water he sees the empty part rather than the full. Life does not go our way: there are failures, there are partings. That does not mean carrying the pain for the rest of your life — you still have to go forward, and you look at the two cups still full and ask what this breakage taught you.'],
    ['love', 'I have just broken up — how do I apply that?',
     'Instead of writhing in "I do not deserve love, I will never love anyone again", look at the positive side: thanks to this breakup I see that a relationship like that does not suit me, and that I need to change this and this. That is the point where you become more optimistic and start looking at the two cups that are left.']
  ],
  'pentacles-5': [
    ['love', 'Describe this person\'s character',
     'Someone who does not believe in themselves. Their family circumstances in the past may not have been good; they were born and raised amid material lack, and it shaped how they see life. Even now, grown, with a place in the world, respected, financially independent and with nothing to fault, that insecurity still follows them like an old wound. And unless they observe themselves and deliberately choose to change, they will act and behave in unconscious ways that show it.'],
    ['love', 'What are their feelings toward me?',
     'The keyword for this card is lack — and here, a lack of love. They may have been born into a home where their parents abandoned them, or simply took no interest in them, so they always feel short of love. And someone short of love does not, growing up, know how to give it — because they fear that in handing over their heart, that person will wound them and leave them again, as they were left as a child. Feeling may be there, but their wound and their problems are theirs to deal with first.'],
    ['love', 'Should I start a relationship with someone carrying this card?',
     'The advice is no. Even inside a relationship it is far from certain to last, precisely because of their own problems.'],
    ['love', 'Can I heal them?',
     'Never imagine you can heal someone, that you will be the angel who saves them. And do not imagine some angel will arrive to carry your own problems away either. Every problem of the mind is for that person to heal themselves. The reader\'s job is only to help you see your problem — like a doctor diagnosing and writing a prescription. Whether you take the advice, whether you take the medicine, is yours. No doctor ever pushes the pills into a patient\'s stomach.'],
    ['love', 'We are arguing — should we continue?',
     'Rather than continuing and going on arguing, ask yourself: what is my lack, and what is it that leaves me always feeling wretched, short of affection, unsatisfied inside this relationship? Ask yourself, and ask them too — sit down and set out each other\'s problems plainly. In any relationship, say it straight if you can, rather than staying quiet and hoping to be guessed at. And when they fail to guess, you start the punishment game: silence, days without speaking, and the thought that they deserve that silence for not understanding you.'],
    ['career', 'Will I find the job I want soon?',
     'Sad news: possibly not. Or the work will not bring the money you were hoping for. This is a stretch for saving and for reviewing what you spend — a period where the finances fall well short of what you expected: you were counting on ten, and may see a fraction of it.'],
    ['career', 'Anything to watch at work?',
     'There may be issues around money: only part of your salary arriving this month, or project money held up for some reason.'],
    ['other', 'How do I govern my own reactions?',
     'We can never change what other people say or do to us, and we cannot control our first thought or first feeling either — the first reaction. But we can entirely control the words and actions that come after it. Feeling irritated and genuinely angry, you can still behave calmly — or you can let the anger carry you. That is why the saying goes to turn your tongue seven times before speaking: before doing the thing you sense will be negative, stop for a second or two and ask why you want to behave that way, and whether you want events to go in that direction.']
  ]
});

/* batch 14 - the four Sixes */
Object.assign(ASK.vi, {
  'wands-6': [
    ['love', 'Miêu tả tính cách một người?',
     'Có thể là người hơi kiêu căng ngạo mạn một chút. Nhưng cũng tùy lá đi kèm: nếu lá này ra cùng Mặt Trời thì đọc theo hướng đây là người giỏi thật, đạt được những thành tựu trong cuộc sống, đề ra mục tiêu nào là đạt được mục tiêu đó — vì Mặt Trời mang năng lượng tốt và san sẻ nó sang Sáu Gậy. Họ vẫn có thể ngạo mạn, nhưng họ giỏi thật.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Có thể họ đang muốn chinh phục bạn trong trò chơi tình ái của họ — chưa chắc họ đã thật lòng với bạn.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Kiểu cãi nhau của hai bạn đang là ăn thua — các bạn đang để cho cái tôi ngáng đường. Hôm qua họ nói mình câu này thì hôm nay mình phải bắt lỗi để nói lại họ câu kia. Kiểu cãi nhau của bạn là "tôi phải thắng trong cuộc tranh luận này", "tôi phải thắng trong mối quan hệ này", "tôi không cho phép bản thân được cúi đầu". Nhưng tất cả sự hiếu thắng ăn thua đủ đó có thể chỉ là sự trẻ con và cái tự tôn không cần thiết của bạn mà thôi.'],
    ['career', 'Thất nghiệp, thời gian tới tìm được việc không?',
     'Có thể sẽ tìm được việc. Nhưng người hỏi có xu hướng nghĩ rằng thế là xong, thế là đạt được mục tiêu rồi, sướng quá, và rồi không chú ý đến công việc nữa. Tìm được việc, thấy mình đã đạt được rồi, hứng khởi vài ngày đầu, xong lười biếng, không chịu mài giũa bản thân, không chịu học kiến thức mới, làm việc đối phó, chủ quan — và thế là một lần nữa lại bị đuổi việc. Tóm lại: bạn sẽ tìm được việc, nhưng đừng nghĩ tìm được việc là xong, là sẽ không bao giờ bị đuổi hay mọi thứ sẽ yên ổn mãi mãi. Chẳng có gì mãi mãi cả.'],
    ['career', 'Thời gian tới công việc có gì cần lưu ý?',
     'Sẽ có những thành tựu nhất định trong công việc, nhưng đừng vì thế mà chủ quan — đây là thành tựu bé thôi, không phải tự dưng một phát lên làm giám đốc. Có thể chỉ đơn giản là được sếp khen vì làm tốt dự án, hoặc được cất nhắc lên làm trưởng nhóm dự án. Nhưng hiểu rằng cơ hội bạn nhận được vừa là cơ hội vừa là gánh nặng và thách thức: nếu không làm tốt thì bạn sẵn sàng bị đưa trở lại làm thành viên bình thường. Đừng chủ quan, hãy luôn cố gắng.'],
    ['other', 'Chiến thắng của lá này khác gì Cỗ Chiến Xa và Mặt Trời?',
     'Trong Ẩn Chính có hai lá nói về chiến thắng. Cỗ Chiến Xa là chiến thắng dẫm đạp lên người khác — bạn đạt được thứ bạn muốn nhưng mất đi những khía cạnh còn lại, bỏ bê gia đình, người yêu, con cái để đạt thành tựu công việc. Mặt Trời là thành tựu vẻ vang, thành công lớn. Còn Sáu Gậy là thành công nhỏ. Ví dụ: nếu đỗ đại học nguyện vọng một là Mặt Trời, thì Sáu Gậy là được điểm cao một kỳ thi thử. Nó khiến bạn hạnh phúc, được khen, và tin hơn vào khả năng của mình — nhưng không đồng nghĩa với việc bạn sẽ đỗ. Vẫn phải ôn luyện cho đến tận ngày thi.'],
    ['other', 'Cùng một từ khóa thì lá nào mạnh hơn?',
     'Quy tắc của người đọc bài: nếu hai lá cùng từ khóa mà một là Ẩn Phụ, một là Ẩn Chính, thì lá Ẩn Phụ mang cường độ và tần suất nhẹ hơn. Và trong Ẩn Phụ thì số càng cao năng lượng càng lớn: một lá số 3 nhẹ hơn lá số 10, và lá số 10 vẫn nhẹ hơn một lá Ẩn Chính.']
  ],
  'swords-6': [
    ['love', 'Miêu tả tính cách một người?',
     'Thật sự khó nói nếu chỉ có mỗi lá này, nên rút thêm. Nhưng có thể hiểu: người này vừa mới tự mình rời khỏi một tình huống — tự mình cắt đứt một mối quan hệ, tự mình nghỉ việc — và tâm trạng của họ đang khá cực đoan, khá u ám. Thời gian tới họ có thay đổi hay không thì tùy lá đi kèm: nếu ra những lá tươi sáng thì họ sẽ yêu đời hơn; còn không thì giai đoạn thất tình này của họ có thể kéo dài hơi lâu.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Ở thời điểm này có thể chính họ là người đang buông bỏ bạn, đang muốn chia tay bạn — vì họ biết mối quan hệ này đã quá độc hại.'],
    ['love', 'Cãi nhau, nên làm gì?',
     'Lời khuyên là nên xa nhau một thời gian — nói thẳng ra là chia tay. Bởi mối quan hệ này có thể chỉ còn là giày vò nhau. Hai bạn ở cạnh nhau vì thói quen, tình cảm thì cũng đã phai thành thói quen rồi, và bắt đầu ghét nhau, bắt lỗi nhau, làm khổ nhau. Không sáng sủa là mấy.'],
    ['love', 'Rời đi rồi lại quay về thì sao?',
     'Người đọc bài biết một số trường hợp đã làm được cái bước quan trọng là rời khỏi mối quan hệ độc hại rồi, nhưng lại không vượt qua được sự cô đơn, không vượt qua được chính mình, nên lại quay về mối quan hệ độc hại ấy — thà ở trong một mối quan hệ độc hại còn hơn cô đơn. Công việc cũng thế: thà ở trong một công việc độc hại còn hơn đi tìm việc mới, vì tìm việc mới thì sợ — sợ lại cảm giác thất nghiệp, sợ công việc mới không bằng công việc cũ, sợ người mới không tốt bằng người cũ. Nhưng một khi bạn đã có câu hỏi đó thì phải hiểu: nếu người cũ hay công việc cũ hiện tại tốt đến thế thì bạn đã không nghĩ đến chuyện rời đi. Còn nếu người mới, việc mới tệ hơn thì lại rời đi tiếp thôi. Buông bỏ ai đó, buông bỏ một công việc, không chết được đâu.'],
    ['career', 'Thất nghiệp mấy tháng, tìm được công việc như ý không?',
     'Lá này đang khuyên rằng bạn đang ở trong vùng an toàn của mình: bạn đang tìm việc trong những mảng an toàn. Ví dụ bạn học và có bằng kế toán nên cứ liên tục tìm công việc kế toán, mà cứ bị từ chối lần này lần khác — vì bạn không nhận ra rằng con đường bạn cần đi không phải kế toán. Với Sáu Kiếm thì bạn cần nhận ra và buông bỏ: cái mảng bạn đang tìm việc không dành cho bạn nữa, cần rời đi thôi. Đôi khi cũng ngược lại: bạn giỏi kế toán thật, nhưng lại thấy nghề người mẫu hào nhoáng nên cứ đâm đầu vào, trong khi lý trí bảo là bạn không hợp.'],
    ['career', 'Thời gian tới công việc có thay đổi gì không?',
     'Có thể bạn sẽ phải di chuyển hoặc phải rời đi. Miệng thì bảo công việc không có biến cố gì, nhưng nó không phải sóng lớn mà là sự lăn tăn trong lòng bạn từ bấy lâu nay: bạn đã cảm thấy công việc không còn phù hợp và chỉ muốn thoát ra, nhưng có cảm giác như bạn đang chờ một biến cố thật lớn. Mà nếu biến cố lớn không đến thì bạn sẽ ở mãi trong tình trạng đó sao? Cái mà người hỏi đang phải chịu trong lá Sáu Kiếm là một cơn đau dai dẳng ngày qua ngày — không phải cơn đau lớn, nhưng khiến bạn khó chịu cả ngày và ảnh hưởng đến mọi thứ trong cuộc sống. Cần phải đau một lần rồi thôi.']
  ],
  'cups-6': [
    ['other', 'Lá này có phải là "người cũ quay về" không?',
     'Trong bộ bài Tarot gốc không có lá nào quy định cụ thể là người cũ quay về cả. Việc nhiều người đọc lá này theo hướng đó có thể là do quy ước riêng của họ — và điều đó hoàn toàn bình thường: qua quá trình đọc bài, bạn sẽ có những từ khóa của riêng bạn cho từng lá, hình thành từ chính trải nghiệm của bạn. Ban đầu bạn học từ khóa của người khác, nhưng dần dần bạn phát triển hệ thống nguyên tắc của riêng mình. Trong Tarot bạn được thoải mái sáng tạo; chẳng ai cấm và cũng chẳng ai có quyền cấm bạn. Miễn là cả trải bài đọc ra đúng thông điệp và người hỏi được chữa lành sau buổi đọc của bạn — đó mới là mục đích quan trọng.'],
    ['other', 'Vậy nghĩa thật của lá này là gì?',
     'Nghĩa nổi bật nhất là một tình cảm thuần khiết, đơn thuần — một tình cảm mới. Nếu người cũ có quay về thật thì tình cảm giữa hai người giống như được phát triển lại từ đầu: như thể quên đi những gì đã xảy ra, cả hai đã thay đổi hoàn toàn và trở thành hai con người mới — không còn là A và B nữa mà là A phẩy và B phẩy. Chứ không phải là người cũ quay về rồi lại tiếp tục độc hại, lại tiếp tục giày vò nhau.'],
    ['other', 'Tự xem bài cho mình thì có chính xác không?',
     'Phải rất cẩn thận. Nếu bạn đang trong tình trạng chưa được chữa lành, thiếu cân bằng, thất tình, thì trải bài của bạn sẽ mang tính rất chủ quan. Bạn đang mong người cũ quay về thì tất cả những lá xuất hiện — kể cả không phải Sáu Cốc — bạn cũng bằng cách nào đó gán nó thành "người cũ đang quay về". Vì thế khi học ý nghĩa các lá, hãy cố đưa ra nghĩa rộng và trung lập, chứ đừng gắn nó vào một hoàn cảnh quá cụ thể.'],
    ['love', 'Miêu tả tính cách một người?',
     'Một người rất thuần khiết, rất ngây thơ. Kể cả trong tình yêu: thứ họ nghĩ về bạn cũng là một tình yêu thuần khiết, không phải thứ tình cảm vụ lợi. Không phải trẻ con theo nghĩa trẻ trâu, mà là hơi gà bông một chút. Có thể bạn là mối tình đầu của họ, hoặc yêu bạn khiến họ thấy thổn thức như lần đầu biết yêu — chứ không phải yêu bạn vì địa vị, vì bố bạn làm to, nhà bạn mặt phố, hay vì túi tiền của bạn.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Có thể hai bạn nên làm mới lại mối quan hệ này. Cảm giác như hai người đã ở trong một mối quan hệ lâu năm và đang thiếu đi lửa, thiếu đi yếu tố lãng mạn và bất ngờ: không còn những buổi tổ chức sinh nhật bất ngờ cho nhau, không còn những món quà bất ngờ — mà bây giờ là "sinh nhật em muốn gì, muốn thỏi son à, đây anh đưa tiền tự đi mua đi", trong khi ngày xưa anh ấy còn gấp cả lọ nghìn con hạc, trong mỗi con hạc giấu một thông điệp. Hai bạn đang thiếu đi cái năng lượng trẻ con và chân thành như trước, và bây giờ nó thành trách nhiệm và nghĩa vụ trong mối quan hệ — nên nhìn mặt nhau là thấy ngứa mắt. Hãy tìm lại cảm xúc của thuở ban đầu.'],
    ['career', 'Thời gian tới tìm được công việc như ý không?',
     'Có thể tìm được, và không những thế công việc đó còn đúng với sở thích của bạn. Tuy nhiên như với các lá Cốc nói chung: sự yêu thích thì có, còn tiền bạc và danh vọng có đi kèm hay không thì phải xem những lá khác. Chỉ biết là trong công việc có sự thỏa mãn. Ngược lại, nếu trong công việc mà chỉ toàn ra lá Tiền thì tiền thì nhiều, nhưng có thích công việc đó hay không lại là chuyện khác — bạn có thể làm giám đốc ngân hàng mà lại không thích, còn đi đọc bài Tarot thì thu nhập chẳng bằng giám đốc ngân hàng nhưng bạn lại rất thích.'],
    ['career', 'Thời gian tới công việc có gì thay đổi không?',
     'Có thể ở thời điểm hiện tại bạn vẫn thích công việc của mình, và năng lượng đó sẽ được giữ trong thời gian tới. Vốn dĩ công việc này đã đem lại cho bạn một niềm vui rất trẻ con — bạn thấy đấy, khi trẻ con thích một cái gì đó thì chúng cắm đầu vào làm thôi.']
  ],
  'pentacles-6': [
    ['love', 'Miêu tả tính cách một người?',
     'Đây là năng lượng của Tiền — những thứ hữu hình, cầm được, thấy được. Người Sáu Tiền khá cẩn trọng, làm gì cũng suy tính thiệt hơn, giúp ai thì cũng xem liệu có nhận lại được gì không. Ta có thể chê người như thế là ki bo, là tính toán — nhưng nếu ta sinh ra có cha mẹ là người như thế thì họ chắc chắn biết cách quản lý tài chính gia đình. Còn người có bao nhiêu cho hết — trong túi còn hai mươi đồng, ra đường thấy người ăn xin đáng thương quá nên cho cả hai mươi, rồi về nhà vợ con chết đói — thì chưa chắc đã tốt cho gia đình. Người Sáu Tiền không phải là không cho: họ có hai mươi thì họ cho hai ba đồng, nhưng họ sẽ làm sao để chắc chắn có ai đó chứng kiến việc họ cho.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Họ vẫn rất tốt với bạn, vẫn thương bạn, chiều bạn — nhưng bạn cảm thấy có một động lực nào đó đằng sau sự chiều chuộng ấy, chứ nó không xuất phát từ tình yêu thuần túy. Có thể nhà bạn giàu, bạn có tài sản thừa kế, hoặc có điều gì đó ở bạn mà họ biết là sẽ nhận lại được. Nhưng kiểu người như thế chưa chắc đã đáng lên án — còn tùy mức độ. Người này không đến mức lợi dụng bạn: với họ mọi thứ phải là một mối quan hệ cho đi nhận lại công bằng. "Tôi cho cô thỏi son, tôi cho cô tình yêu, thì để xem cô cho tôi được cái gì; cô tôn trọng tôi thì tôi cũng tôn trọng cô." Thực ra Sáu Tiền khá công bằng — chẳng qua sự tỉ mỉ và tính toán thiệt hơn của họ khiến người xung quanh cảm thấy thiếu chân thành.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Bài đang khuyên rằng trước khi chia tay thì hãy thử đặt lên bàn cân. Có thể bạn đang có xu hướng chỉ nhìn vào phần tiêu cực của mối quan hệ. Hãy thử nghĩ lại xem những gì họ đã làm cho bạn so với những gì họ gây ra cho bạn thì bên nào nặng hơn. Đừng vì một lý do đơn giản — như anh ta hay quên trả lời tin nhắn — mà bỏ, trong khi anh ta rất chiều bạn và lúc nào cũng cố gắng ở bên cạnh bạn; đó chỉ là một tính xấu là đôi khi đọc tin nhắn rồi quên.'],
    ['love', 'Còn nếu mối quan hệ đã quá độc hại?',
     'Thì lá này cũng bảo đúng điều đó: hãy đặt lên bàn cân xem những gì họ làm cho bạn và những gì họ gây ra cho bạn, bên nào nặng hơn. Ừ thì họ chiều chuộng, mua cho vài thỏi son, cái ví — nhưng mua thỏi son xong rồi đấm cho bạn sưng mặt chảy máu mồm, thì có đáng hay không? Ra lá này thì có thể khuyên người hỏi hãy lý trí một chút. Đôi khi chúng ta cần sự tính toán thiệt hơn trong cuộc sống: người sống hoàn toàn theo cảm tính thường gặp rất nhiều vấn đề và hay ra những quyết định sai lầm, còn người biết tính toán một chút thì cuộc sống an toàn hơn.'],
    ['career', 'Thất nghiệp mấy tháng, thời gian tới tìm được việc không?',
     'Có thể tìm được, và ở đây là nhờ có người giúp đỡ — nhưng người giúp đỡ này mong rằng sau này bạn sẽ trả ơn họ. Điều đó không có nghĩa là bạn đừng nhận sự giúp đỡ ấy: nhận thì cứ nhận thôi, sau này báo đáp được thì báo đáp.'],
    ['career', 'Thời gian tới công việc có gì cần lưu ý?',
     'Trong thời gian tới sẽ có người giúp đỡ bạn, có cơ hội được đem đến cho bạn — nhưng cơ hội này đồng nghĩa với việc sau này bạn sẽ phải trả lại cho người ta điều gì đó. Ví dụ họ giúp bạn vì biết bố bạn làm to, hoặc chú bạn là sếp của công ty bạn đang làm; họ giúp để bạn về kể với bố rằng họ đã giúp con của sếp, và sau này bố bạn sẽ giúp họ thăng tiến.']
  ]
});

Object.assign(ASK.en, {
  'wands-6': [
    ['love', 'Describe this person\'s character',
     'Possibly someone a little arrogant and full of themselves. But it depends on the cards beside it: paired with the Sun, read it as someone genuinely able, who achieves what they set out to — the Sun\'s good energy passes into the Six of Wands. They may still be arrogant, but they really are good.'],
    ['love', 'What are their feelings toward me?',
     'They may be out to conquer you in their own game of love — it is far from certain they are sincere with you.'],
    ['love', 'We are arguing — should we break up?',
     'The way you argue is competitive — you are letting the ego block the road. They said this to me yesterday, so today I must find a fault and say that back. Your manner of arguing is "I have to win this argument", "I have to win in this relationship", "I will not let myself back down." And all that need to come out on top may be nothing more than childishness and an unnecessary pride.'],
    ['career', 'Unemployed — will I find work soon?',
     'You may well find work. But the querent tends to think that is that — the goal reached, wonderful — and then stops paying attention to the job. Found the work, felt they had arrived, keen for the first few days, and after that lazy: not sharpening themselves, not learning anything new, going through the motions, complacent — and so let go all over again. In short: you will find work, but do not imagine that finding it is the end of it, that you can never be dismissed or that everything is settled for good. Nothing is for good.'],
    ['career', 'Anything to watch at work?',
     'There will be certain achievements, but do not let them make you complacent — these are small achievements, not a sudden leap to director. It may simply be a manager praising you for a project done well, or a move up to project team leader. But understand that the opportunity is also a weight and a challenge: do it badly and you will be back to ordinary member. Do not be complacent; keep working at it.'],
    ['other', 'How does this victory differ from the Chariot and the Sun?',
     'Two Majors speak of victory. The Chariot is the victory that tramples others — you reach what you wanted and lose every other part of your life, neglecting family, partner and children to get the achievement at work. The Sun is glorious achievement, real success. The Six of Wands is a small success. If getting into your first-choice university is the Sun, the Six of Wands is scoring well on a mock exam. It makes you happy, people praise you, and you trust your own ability more — but it does not mean you will get in. You still have to revise right up to the day.'],
    ['other', 'Which card is stronger when the keyword is the same?',
     'the reader\'s rule: where two cards share a keyword and one is a Minor and one a Major, the Minor carries lower intensity and frequency. And inside the Minors, the higher the number the greater the energy: a three is lighter than a ten, and a ten is still lighter than a Major.']
  ],
  'swords-6': [
    ['love', 'Describe this person\'s character',
     'Genuinely hard with this card alone; draw more. But you can read it as: this person has just left a situation under their own steam — cut off a relationship themselves, resigned themselves — and their mood is fairly extreme, fairly bleak. Whether that lifts soon depends on the cards beside it: bright ones and they will come back to life; otherwise the heartbroken stretch may run on a while.'],
    ['love', 'What are their feelings toward me?',
     'At this moment they may be the one letting you go, the one wanting to end it — because they know the relationship has turned too toxic.'],
    ['love', 'We are arguing — what should we do?',
     'The advice is to be apart for a time — plainly, to break up. Because this relationship may now be nothing but the two of you tormenting each other. You stay beside each other out of habit; the feeling has faded into habit, and you are beginning to dislike each other, to pick faults, to make each other suffer. There is not much light in it.'],
    ['love', 'What if I leave and then go back?',
     'the reader knows people who took the important step of leaving a toxic relationship and then could not get past the loneliness, could not get past themselves, and went back to it — better a toxic relationship than being alone. Work is the same: better a toxic job than looking for a new one, because job-hunting frightens you — fear of being unemployed again, fear the new job will not match the old, fear the new person will not be as good as the last. But once you are asking the question, understand this: if the old person or the old job were really that good, you would not be thinking of leaving. And if the new one turns out worse, you leave again. Letting go of someone, letting go of a job — it will not kill you.'],
    ['career', 'Out of work months — will I find the right job?',
     'The card is saying you are inside your own comfort zone: you are job-hunting only in the safe areas. Say you trained and hold an accounting qualification, so you keep applying for accounting and keep being turned down — because you do not see that the road you need is not accounting at all. With the Six of Swords you have to recognise it and let go: this field you are searching in is no longer for you, and it is time to leave. Sometimes it runs the other way: you really are good at accounting, and modelling looks glamorous, so you keep throwing yourself at it while your reason says plainly that it does not suit you.'],
    ['career', 'Any change at work coming?',
     'You may have to move, or to leave. Your mouth says there is no trouble at work, and this is not a large wave — it is a small unease you have carried a long time: you have felt for a while that the job no longer fits and you have wanted out, but it is as though you are waiting for some really large incident. And if the large incident never comes, will you stay in that state for ever? What the querent is carrying in the Six of Swords is a persistent daily ache — not a great pain, but one that makes you uncomfortable all day and touches everything else in your life. Better to hurt once and have done.']
  ],
  'cups-6': [
    ['other', 'Does this card mean an ex returning?',
     'In the original tarot deck there is no card that specifically means the ex comes back. That many readers read this one that way may come from their own convention — and that is perfectly normal: through reading you develop your own keywords for each card out of your own experience. At the start you learn someone else\'s keywords, and in time you build your own system of them. In tarot you are free to invent; nobody forbids you, and nobody has the standing to. So long as the whole spread reads the right message and the querent leaves your reading healed, that is the purpose that matters.'],
    ['other', 'So what does it actually mean?',
     'Its most prominent meaning is a pure, simple feeling — a new one. If an ex really does return, the feeling between you is as though it were being built again from the start: as though you had set aside what happened, both of you have changed entirely and become two new people — no longer A and B but A-prime and B-prime. It is not the ex coming back so the toxicity and the tormenting can continue.'],
    ['other', 'Can I read accurately for myself?',
     'Be very careful. If you are unhealed, out of balance, heartbroken, your reading will be deeply subjective. If you want the ex to return, then every card that turns up — even when it is not the Six of Cups — will somehow get attached to "the ex is coming back." So when you learn the meanings, aim for broad, neutral senses rather than tying a card to one specific circumstance.'],
    ['love', 'Describe this person\'s character',
     'Someone very pure, very innocent. In love as well: what they feel for you is a pure love, not a mercenary one. Not childish in the immature sense, but soft-hearted. It may be that you are their first love, or that loving you gives them the flutter of a first love — rather than loving you for your standing, because your father is somebody, because your house is on a good street, or for your money.'],
    ['love', 'We are arguing — should we break up?',
     'Perhaps the two of you should make the relationship new again. It feels like a long relationship missing its fire, missing the romance and the surprise: no more surprise birthdays for each other, no more unexpected gifts — now it is "what do you want for your birthday, lipstick? here is the money, go and buy it," where once he folded a jar of a thousand paper cranes for you with a message hidden inside each one. You have lost the childlike, sincere energy you had, and it has become duty and obligation — which is why the sight of each other is irritating. Go back and find what you felt at the beginning.'],
    ['career', 'Will I find the right job soon?',
     'You may, and more than that: the work will suit what you actually like. As with Cups generally, though — the liking is there, and whether money and standing come with it needs other cards. What you know is that there is satisfaction in the work. The reverse also holds: a work spread full of Pentacles means the money is there, and whether you like the job is another question — you might be a bank director and not enjoy it, while reading cards brings nowhere near a bank director\'s income and you love it.'],
    ['career', 'Any change at work coming?',
     'You may still like your work as it stands, and that energy carries on. This job has been giving you a very childlike gladness — you know how a child who likes something simply throws themselves into it.']
  ],
  'pentacles-6': [
    ['love', 'Describe this person\'s character',
     'This is Pentacles energy — the tangible, what can be held and seen. The Six of Pentacles person is careful, weighs the gain and loss in everything, and when helping anyone considers whether something comes back. You could call them tight, or calculating — but if these were your parents, they would certainly know how to run the family finances. Whereas the person who gives away everything they have — twenty left in the pocket, seeing a beggar so pitiable they hand over all twenty, and go home to a hungry family — is not necessarily doing their household any good. The Six of Pentacles person is not someone who does not give: with twenty they will give two or three, and they will make sure somebody sees them do it.'],
    ['love', 'What are their feelings toward me?',
     'They are still very good to you, still fond of you and indulgent — but you sense some motive behind the indulgence rather than plain love. Perhaps your family is well off, perhaps there is an inheritance, perhaps something in you they know will come back to them. But this type is not necessarily to be condemned; it depends on the degree. They are not exploiting you: for them everything must be a fair exchange. "I give you lipstick, I give you love — now let us see what you give me; you respect me and I respect you." In fact the Six of Pentacles is quite fair. It is only that the meticulous weighing of gain and loss leaves people around them feeling the sincerity is thin.'],
    ['love', 'We are arguing — should we break up?',
     'The card advises putting it on the scales before you decide. You may be inclined to look only at the negative side. Think again about what they have done for you against what they have done to you, and see which is heavier. Do not leave over something small — they often forget to reply to messages — while they indulge you and do their best to be beside you; that is one bad habit, no more.'],
    ['love', 'And if the relationship has already turned toxic?',
     'The card says exactly the same thing: put it on the scales, what they do for you against what they do to you, and see which weighs more. Yes, they indulge you, they buy you a lipstick and a wallet — and then they punch you until your face swells and your mouth bleeds. Is that worth it? With this card you can tell the querent to be a little more rational. Sometimes we need that weighing-up: people who live purely on feeling run into a great many problems and make a great many wrong decisions, while those who calculate a little live more safely.'],
    ['career', 'Out of work months — will I find something?',
     'You may, and here it comes through somebody helping you — but that person expects you to repay them later. That is not a reason to refuse the help: take it, and repay it later if you can.'],
    ['career', 'Anything to watch at work?',
     'Someone will help you, and an opportunity will be brought to you — but this opportunity means owing something back later. Perhaps they help you because they know your father is important, or that your uncle runs the company you work for; they help so that you will tell him they helped his relative, and so that later he will help them get on.']
  ]
});

/* batch 15 - the four Sevens */
Object.assign(ASK.vi, {
  'wands-7': [
    ['love', 'Miêu tả tính cách một người?',
     'Một người rất sân si, luôn có drama. Kiểu người mà hở ra là xung đột với người này, thù người kia. Ở chỗ làm thì có thành phần như thế: thích hóng hớt, dành nhiều thời gian cho những chuyện vô bổ, lúc nào cũng nghĩ rằng người khác đang muốn tấn công mình, đang muốn nói xấu mình — trong khi người ta chẳng quan tâm. Và cách tự vệ của họ là "mày chuẩn bị nói xấu tao đúng không, thế thì tao nói xấu mày trước", trong khi rõ ràng đối phương không hề có ý đó.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Hơi khó nói là họ có yêu bạn hay không. Nhưng thấy được một xu hướng: bản thân họ đang ở trong một trạng thái không cân bằng, bất ổn. Kể cả khi bạn là người vững vàng thì cũng phải hiểu rằng khi yêu một người đang bất ổn, một người có những tổn thương chưa được chữa lành, họ sẽ vô tình gây cho bạn đúng những vết thương giống hệt vết thương họ đang mang. Và nếu họ không đủ mạnh mẽ để nhìn nhận vấn đề của mình và thay đổi sớm, thì họ sẽ làm tổn thương bạn.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Cảm giác là hai bạn đang cãi nhau về những vấn đề rất vô bổ. Hoặc là kiểu "anh phải thay đổi cái này cái kia, anh phải làm cái này cho em" mà không chịu nhìn lại bản thân xem mình đã làm được gì cho họ. Đôi khi bạn phải thay đổi trước: nếu họ nhìn thấy sự thay đổi của bạn, trân trọng điều đó và thay đổi theo, thì đó là mối quan hệ xứng đáng để đi tiếp. Còn nếu họ nhìn thấy mà không thay đổi thì lúc đó bạn có thể tự nói với bản thân là thôi, dừng lại ở đây. Những chuyện cãi nhau kiểu tại sao anh về muộn, tại sao anh đi chơi, tại sao anh không nhắn tin trước, tại sao sáng ngủ dậy không chúc em ngày mới — rất trẻ con — mà bạn không nhìn lại rằng chính bạn cũng thường xuyên không trả lời tin nhắn của họ, cũng thường xuyên đi chơi với bạn khác giới mà không nói.'],
    ['career', 'Thời gian tới tìm được việc không?',
     'Nhắc lại một lần nữa: Ẩn Phụ là những vấn đề nhỏ do chính người hỏi gây ra, và cũng chính người hỏi giải quyết được. Việc bạn chưa tìm được việc trong thời gian dài là vì bạn đang tốn công sức vào những chuyện vô bổ, chưa thật sự tập trung vào việc tìm việc; hoặc đang tìm ở những ngành không hợp với mình. Nói chung là do bạn: phân bổ thời gian và năng lượng thiếu hiệu quả. Ta chỉ có một quỹ thời gian và năng lượng có giới hạn; người thành công là người biết sử dụng quỹ đó một cách hiệu quả.'],
    ['career', 'Thời gian tới công việc có gì mới không?',
     'Có thể sẽ có drama chốn công sở mà người ta tìm cách cuốn bạn vào. Lá này khuyên bạn đừng để bị cuốn vào: họ có thể tìm cách lôi kéo, nhưng có vào hay không là do bạn. Đôi khi nghe thấy mình bị nói xấu, bạn nghĩ mình phải trả thù, phải nói xấu lại. Nhưng người bình tĩnh hơn sẽ chọn cách bỏ ngoài tai mà sống: kể cả mày nói xấu tao thì có khiến lương tao tăng không, tao chẳng quan tâm, tao vẫn phải đến công ty, việc của tao là làm việc kiếm tiền chứ không phải xung đột nội bộ hay gây chiến với ai.'],
    ['other', 'Vậy tôi phải chiến đấu với ai?',
     'Bạn chẳng phải chiến đấu với ai cả. Kẻ thù lớn nhất của đời bạn chính là bạn. Bạn chiến đấu với chính bạn, chứ không phải với anh A anh B, không phải ông sếp, không phải bạn học, không phải đồng nghiệp. Đừng bao giờ nói những câu như "bạn phải chiến đấu với cả thế giới". Thay vì cứ tìm giải pháp từ bên ngoài, hãy thử thay đổi bản thân trước: nếu đi đâu bạn cũng gặp đúng một vấn đề ở môi trường làm việc, thì thay vì nhảy việc để tìm một công việc hoàn hảo với kỳ vọng của mình, sao không thử thay đổi mình trước? Nếu bạn liên tục thay người yêu và mong rồi sẽ có ngày tìm được người phù hợp, thì sao không thử thay đổi mình trước?']
  ],
  'swords-7': [
    ['love', 'Miêu tả tính cách một người?',
     'Đúng như từ khóa: lén lút, thích làm mọi thứ sau lưng, lại còn tham. Nói xấu sau lưng, ngoại tình, thị phi drama — tất cả những gì liên quan đến sự lén lút. Chuyện ngoại tình thì vừa là lén lút vừa là tham lam: một bạn tình không đủ, phải hai mới chịu.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Chia buồn với bạn. Người đọc bài từng gặp đúng một trường hợp như thế: một bạn hỏi anh ta nghĩ gì về mình vì hai người đang tìm hiểu nhau, và ra Bảy Kiếm — điều hiện lên trong đầu là có thể anh ta đang có người yêu rồi và bạn chỉ là người thứ ba. Sau đó bạn ấy xác nhận đúng là như vậy: anh chàng bảo vừa mới chia tay, nhưng thật ra hai người vẫn còn trong một mối quan hệ chưa dứt hẳn. May là lúc đó bạn ấy chưa nhận lời, và nhờ xem trải bài nên đã gặng hỏi và anh ta khai thật. Nên nhớ: sự lén lút ở đây không nhất thiết là anh ta đang có người thứ ba — mà có thể chính bạn mới là người thứ ba đó.'],
    ['love', 'Cãi nhau nhiều, có nên chia tay không?',
     'Có hai trường hợp. Một: bên đó có người thứ ba. Hai: nếu không phải người thứ ba thì sẽ có một thế lực thứ ba nào đó liên tục rủ rê bạn chia tay — "chia tay đi, mày yêu nó làm gì, phải có người xứng đáng với mày hơn chứ". Có thể là bạn bè, có thể là gia đình. Ai đó đang kích động từ đằng sau. Vì năng lượng của Bảy Kiếm là làm điều gì đó ở sau cánh gà chứ không phải trước mặt: nói xấu ai thì cũng là nói sau lưng chứ không nói thẳng cho người ta biết.'],
    ['career', 'Thất nghiệp lâu, sắp tới tìm được việc mới không?',
     'Có thể vẫn chưa, vì đang có một thế lực nào đó ngăn cản việc bạn tìm việc. Hãy xem xét lại trong cuộc sống của bạn: đó là gia đình, bạn bè, hay người yêu? Ví dụ: bạn muốn ra ngoài tìm việc nhưng bố bạn lại muốn bạn về làm cho công ty của bố, nên ông sẽ nói những câu thao túng tâm lý bạn — "mày kém lắm, mày không làm được đâu, ra ngoài kia mày tìm được gì cơ chứ, mày làm được việc gì". Rồi khi đi phỏng vấn thì lời của bố văng vẳng bên tai, bạn bối rối, thiếu tự tin, lắp bắp, và bạn trượt — mà bạn không nhận ra rằng một trong những lý do khiến mình thiếu tự tin như thế lại chính là bố mình.'],
    ['career', 'Thời gian tới công việc có biến cố gì không?',
     'Có đấy. Có thể bạn bị nói xấu sau lưng, bị drama thị phi — cái mà người ta gọi là bị đâm lén sau lưng. Cũng có thể bạn đang cố gắng phấn đấu để được vào vị trí quản lý hay trưởng nhóm, và một ai đó cạnh tranh với bạn nhưng không cạnh tranh trực diện và lành mạnh, mà dùng những thủ đoạn thiếu lành mạnh để hạ bệ bạn. Đó là năng lượng của Bảy Kiếm. Còn người đó là ai và bây giờ nên làm gì thì nên rút thêm — một lá thường chỉ nói được một hai phần của bức tranh.'],
    ['other', 'Thao túng cảm xúc là gì?',
     'Bảy Kiếm đôi khi khiến Người đọc bài nghĩ đến từ khóa thao túng cảm xúc. Việc người A thao túng người B xảy ra thường xuyên như cơm bữa trong cuộc sống hằng ngày; nếu không để ý và quan sát thì bạn bị thao túng, hoặc bạn thao túng người khác, một cách vô thức mà không nhận ra. Những người có khả năng thao túng người khác thường là người thông minh, có trí tuệ cảm xúc cao. Chuyện này xảy ra nhiều nhất trong tình cảm và với cấp trên. Người thao túng giỏi thường rất duyên dáng, được lòng nhiều người, biết cách chèo lái câu chuyện, biết nói gì và tỏ thái độ thế nào để người khác nghe theo, biết dùng từ nào vào thời điểm nào để đánh vào tâm lý người nghe. Bạn cứ quan sát sẽ thấy có những người như thế, và có những người nghĩ gì nói đấy.']
  ],
  'cups-7': [
    ['other', 'Từ khóa của lá này là gì?',
     'Có rất nhiều sự lựa chọn đến với bạn, nhưng bạn chẳng thích lựa chọn nào cả. Ví dụ dễ hiểu: bạn đang độc thân và có cực kỳ nhiều vệ tinh quanh mình, ai cũng muốn làm quen, ai cũng muốn tán tỉnh — vấn đề là bạn chẳng thích ai. Ngày nào cũng có người để nhắn tin, nhưng chọn lấy một người thì không chọn nổi. Nhìn hình ảnh cũng thấy: lá này không tươi sáng rực rỡ mà khá trầm, hơi u ám, và những chiếc cốc lại được đưa ra từ mây đen.'],
    ['other', 'Lá này khác Tình Nhân và Hai Kiếm thế nào?',
     'Trong 78 lá có ba lá nói về sự mông lung: Tình Nhân, Hai Kiếm và Bảy Cốc. Hai Kiếm là mông lung vì không biết phải làm gì bây giờ, lưỡng lự chần chừ. Bảy Cốc là mông lung vì bạn có quá nhiều lựa chọn mà chẳng thích cái nào. Còn Tình Nhân là mông lung vì bạn có hai lựa chọn và bạn thích cả hai.'],
    ['other', 'Một ví dụ khác cho dễ nhớ?',
     'Bạn chuẩn bị thi đại học và phải chọn ngành. Rất nhiều ngành đặt ra trước mắt, nhưng không có ngành nào bạn cực kỳ thích và cực kỳ muốn theo. Chỉ có những cái kiểu: nếu học sư phạm thì mẹ vui, nếu học kinh tế thì bố vui, nếu theo nghệ thuật thì đúng sở thích ngày xưa nhưng mình cũng không có khao khát mãnh liệt kiếm tiền từ nghệ thuật. Rất nhiều lựa chọn, mà chẳng có cái nào khiến bạn thốt lên "à, chính là nó".'],
    ['love', 'Miêu tả tính cách một người?',
     'Một người rất phân vân lưỡng lự, không quyết đoán. Có thể lúc nào cũng phải để người khác quyết định hộ, không dám tự mình chọn lấy con đường dành cho bản thân. Để người khác quyết định thì cũng được thôi — vấn đề là khi họ quyết cho bạn và bạn đi trên con đường đó thì bạn lại cảm thấy thiếu thỏa mãn. Vậy thì chọn một trong hai hướng: nếu đã muốn chơi an toàn và để người khác quyết định thì học cách thỏa mãn với điều đó; còn nếu không thể thỏa mãn thì hãy đi trên con đường của chính mình, do mình lựa chọn.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Không phải một lá hay ho gì. Có thể bạn chỉ là một trong những lựa chọn mà họ yêu tạm ở thời điểm này. Cũng có thể tình cảm bạn dành cho họ nhiều hơn, vì bạn crush họ trước, còn họ nhận lời chỉ vì lúc đó chẳng có ai để yêu tạm, để giết thời gian.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Lá này không nói là nên chia tay hay không. Chỉ thấy một xu hướng — có thể từ người hỏi, có thể từ đối phương, hoặc cả hai: hai bạn khá mệt mỏi về mối quan hệ này rồi và đang có xu hướng ra ngoài tìm kiếm người mới, cơ hội mới; nhưng vì chưa tìm được nên vẫn cứ dính lấy nhau. Hoặc diễn giải đơn giản hơn: cả hai đều đang phân vân, lo lắng, mông lung, và cảm thấy mối quan hệ hiện tại không chắc chắn. Nhưng dù sao ra Bảy Cốc thì vẫn luôn có cảm giác là có sự dòm ngó sang người khác.']
  ],
  'pentacles-7': [
    ['other', 'Từ khóa của lá này là gì?',
     'Kiên trì, bền bỉ, nhẫn nại. Hình ảnh là người đã trồng cây, chăm bẵm nuôi dưỡng nó suốt một thời gian, và bây giờ đứng ngắm cái cây đã lớn, lại còn ra hoa kết trái thành bảy đồng tiền. Lá này trung lập: khi nó ra, có thể bài đang khuyên người hỏi rằng bạn cần kiên trì hơn — mà bài đã khuyên thế thì tức là người hỏi đang thiếu kiên trì. Hoặc nó nói rằng cứ từ từ, những gì bạn đang làm là đúng hướng rồi, vất vả thêm một thời gian nữa thì kết quả sẽ được như ý.'],
    ['love', 'Miêu tả tính cách một người?',
     'Một người kiên trì, bền bỉ, nhẫn nại. Nhưng đôi khi họ hơi bị động một chút và hơi chậm một chút; lúc cần ra quyết định nhanh chóng thì họ lại không giỏi chuyện đó, không quyết đoán.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Có thể có tình cảm, và không những thế họ còn thích bạn và theo đuổi bạn từ lâu lắm rồi. Vì với họ, việc chinh phục bạn giống như vun trồng một cái cây, và tán đổ được bạn là đang hưởng thành quả của những gì họ đã làm trong quá khứ.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Có thể hai bạn đang thiếu đi sự nhẫn nại dành cho nhau. Trong một mối quan hệ, đến một lúc nào đó bạn sẽ cảm thấy thiếu nhẫn nại với người còn lại — và thật ra một phần là do chúng ta chưa đủ chín chắn, chưa đủ trân trọng đối phương: ta mong họ thay đổi vì ta, rồi bực bội khi họ không thay đổi nhiều như kỳ vọng, và thế là ta cáu, ta mắng mỏ, ta trút giận lên họ. Với Bảy Tiền thì có thể hai bạn đã ở trong một mối quan hệ tương đối lâu, nên đã mất đi cái nhiệt huyết ban đầu. Lúc mới yêu, họ có tính xấu đến mấy ta cũng như bị mù, bỏ qua hết; nhưng dần dần ta bắt đầu nhận ra và bắt đầu thiếu nhẫn nại với họ.'],
    ['love', 'Nếu họ không thể thay đổi thì sao?',
     'Hãy nhẫn nại hơn với họ và với chính mình, cho họ thêm thời gian để thay đổi. Nhưng đồng thời cũng tự hỏi trước: nếu họ không thể thay đổi thì sao? Bởi có những thứ thuộc về phạm trù bản chất, rất khó thay đổi, cần rất nhiều thời gian, và phụ thuộc vào sức mạnh ý chí muốn thay đổi của chính người kia. Nếu bản thân họ thấy yêu cầu đó là vô lý và họ chỉ đang cố làm hài lòng bạn thôi, thì ta cũng không nên ép — mà nên để họ thấy việc thay đổi này tốt cho chính họ như thế nào. Nói chung ra lá này thì cứ bình tĩnh với họ, đồng thời cũng suy nghĩ xem mình cần gì ở họ và mình có thể cho được gì cho mối quan hệ này.'],
    ['career', 'Thời gian tới tìm được công việc như ý không?',
     'Có thể tìm được, và công sức nỗ lực của bạn trong việc tìm việc hay trong việc học tập, mài giũa bản thân sẽ được đền đáp xứng đáng. Nhưng có thể bạn sẽ cần thêm một chút kiên trì nhẫn nại nữa thì công việc mới đến.'],
    ['career', 'Thời gian tới công việc thế nào?',
     'Bạn sẽ có thành quả, nhưng với Bảy Tiền thì thành quả thường đến khá chậm — chậm mà chắc. Và nó không phải kiểu bạn bỏ ra mười thì đến hai mươi, mà là bạn bỏ ra bao nhiêu thì đến đúng bấy nhiêu. Ví dụ bạn đang ở công ty A và muốn được thăng tiến: kết quả sẽ đến, nhưng không nhanh như bạn muốn. Bảy Tiền dạy ta phải kiên trì, nhẫn nại và tiếp tục chăm chỉ dù chưa thấy thành quả ngay.'],
    ['other', 'Vì sao phải kiên trì đến thế?',
     'Như trồng cây: bạn chưa thấy nó nhú lên ngay, chưa thấy nó phát triển — thì sao, bạn đập chậu trồng cây khác à? Vẫn phải tiếp tục, ngày qua ngày, mỗi ngày đều dành từng ấy thời gian để chăm cây, bón phân cho cây, không dừng lại một ngày nào. Cây không lớn ngay, nhưng nó sẽ lớn, và qua thời gian bạn sẽ thấy nó mọc to, mọc dày, đúng như kỳ vọng của bạn. Muốn thay đổi bản thân thì phải thay đổi thói quen, mà thói quen không phải một hai ngày là làm được — ít nhất 28 ngày làm liên tục mới hình thành một thói quen. Năng lượng của Bảy Tiền không phải là năng lượng bộc phát, mà là năng lượng dàn trải ngày qua ngày, đều đặn và không bao giờ dừng lại.']
  ]
});

Object.assign(ASK.en, {
  'wands-7': [
    ['love', 'Describe this person\'s character',
     'Someone deeply contentious, forever in drama. The sort who is in conflict with this one and bearing a grudge against that one the moment you turn around. Every workplace has them: fond of gossip, spending a great deal of time on the pointless, always convinced other people are out to attack them and to talk about them — while nobody actually cares. And their idea of self-defence is "you are about to badmouth me, aren\'t you? then I will badmouth you first" — when the other party plainly had no such intention.'],
    ['love', 'What are their feelings toward me?',
     'Hard to say whether they love you. But there is a tendency visible: this person is in an unbalanced, unsettled state. Even if you are the steady one, understand that loving someone unsettled, someone carrying unhealed wounds, means they will unintentionally inflict on you the very wounds they are carrying. And if they are not strong enough to face their own problem and change soon, they will hurt you.'],
    ['love', 'We are arguing — should we break up?',
     'The sense is that the two of you are arguing about entirely pointless things. Or it is the pattern of "you must change this, you must do that for me" without ever turning to look at what you have done for them. Sometimes you have to change first: if they see your change, value it, and change in turn, that is a relationship worth continuing. And if they see it and do not change, then you can tell yourself, enough, this stops here. The arguments — why were you home late, why did you go out, why did you not text first, why did you not wish me good morning — are childish, and meanwhile you do not notice that you too often leave their messages unanswered and go out with friends of the opposite sex without a word.'],
    ['career', 'Will I find work soon?',
     'Once more: Minors are small problems the querent has made, and which the querent can solve. You have not found work in a long time because you are pouring effort into pointless things and not genuinely concentrating on the search; or you are looking in fields that do not suit you. In short, it is you: distributing your time and energy ineffectively. We have only a limited fund of both, and the people who succeed are the ones who spend it well.'],
    ['career', 'Anything new coming at work?',
     'There may be office drama that people try to draw you into. The card advises you not to be drawn: they may try, and whether you go in is your choice. Hearing that you are being talked about, you think you must retaliate and talk about them back. The calmer person shrugs and gets on: even if you badmouth me, does it raise my salary? I do not care; I still have to come in; my job here is to work and earn, not to run internal warfare.'],
    ['other', 'Who am I actually meant to be fighting?',
     'Nobody. The greatest enemy of your life is yourself. You fight yourself — not this person or that, not the manager, not a classmate, not a colleague. Never say things like "you have to fight the world." And instead of hunting for solutions outside, try changing yourself first: if you meet the same problem in every workplace, then rather than job-hopping in search of one that matches your expectations, why not change yourself first? If you keep changing partners in the hope that one day the right one appears, why not change yourself first?']
  ],
  'swords-7': [
    ['love', 'Describe this person\'s character',
     'Exactly as the keywords say: furtive, fond of doing everything behind people\'s backs, and greedy with it. Talking about people behind their backs, infidelity, gossip and drama — everything connected with the covert. Infidelity is both at once: furtive and greedy, one partner not being enough.'],
    ['love', 'What are their feelings toward me?',
     'Condolences. the reader met exactly this case: a client asked what he thought of her, since the two were getting to know each other, and the Seven of Swords came up — what surfaced was that he already had a girlfriend and the client was only the third person. She later confirmed it: he had said he had just broken up, when in fact the two were still in a relationship of sorts, not properly ended. Fortunately she had not yet accepted him, and having seen the reading she pressed him and he admitted it. Note this: the furtiveness need not be that HE has a third person — it may be that YOU are the third person.'],
    ['love', 'We argue a lot — should we break up?',
     'Two cases. First: there is a third person on their side. Second: if not a third person, then some third force steadily urging you to break up — "leave them, why do you love that one, you deserve better." It could be friends, it could be family. Somebody stirring it from behind. Because Seven of Swords energy is doing something in the wings rather than to your face: badmouthing is always done behind the back, never said straight out.'],
    ['career', 'Out of work a long time — will I find something?',
     'Possibly not yet, because some force may be blocking the search. Look through your life: is it family, friends, or a partner? Say you want to go out and find a job while your father wants you home working at his company, so he uses words that work on your mind — "you are useless, you cannot do it, what could you possibly find out there, what work could you do?" Then at the interview his voice is still in your ear, and you are flustered, short of confidence, stumbling, and you fail — without ever noticing that one of the reasons for that lack of confidence is your own father.'],
    ['career', 'Any trouble at work coming?',
     'Yes. You may be talked about behind your back, hit with gossip and drama — what people call being stabbed from behind. Or you may be working toward a management or team-leader position, and someone competing with you is not competing openly and fairly but using underhand methods to bring you down. That is Seven of Swords energy. For who it is and what to do about it, draw more — a single card usually gives you only one or two parts of the picture.'],
    ['other', 'What is emotional manipulation?',
     'The Seven of Swords sometimes brings the reader to that keyword. One person manipulating another happens as routinely as meals in daily life; unless you watch for it, you are manipulated, or you manipulate, without noticing. The people capable of it are usually clever, with high emotional intelligence. It happens most in romance and with superiors. Good manipulators are usually very charming and widely liked; they know how to steer a conversation, what to say and what manner to strike so that others follow, and which word to use at which moment to reach the listener\'s psychology. Watch and you will see there are such people, and there are people who simply say what they think.']
  ],
  'cups-7': [
    ['other', 'What is this card\'s keyword?',
     'A great many choices arriving, and you wanting none of them. The easy example: you are single with a great many admirers circling, everyone wanting to know you, everyone wanting to flirt — and the trouble is you like none of them. Every day there is someone to message, and choosing one is beyond you. The picture says it too: this card is not bright and radiant but rather sombre, faintly overcast, and the cups are held out from dark cloud.'],
    ['other', 'How does it differ from the Lovers and the Two of Swords?',
     'Of the 78 cards, three speak of being adrift: the Lovers, the Two of Swords and the Seven of Cups. The Two of Swords is being adrift because you do not know what to do now — hesitant, stalled. The Seven of Cups is being adrift because there are too many choices and you want none. The Lovers is being adrift because there are two choices and you want them both.'],
    ['other', 'Another example, to make it stick?',
     'You are about to sit university entrance exams and must choose a field. Many are laid out in front of you, and there is not one you are truly keen on. Only this sort of thing: teaching would please my mother, economics would please my father, art was what I liked when I was young but I have no burning wish to earn from it. Plenty of options, and not one that makes you say, that is the one.'],
    ['love', 'Describe this person\'s character',
     'Someone deeply hesitant and indecisive. Possibly always leaving the decision to somebody else, never daring to choose their own road. Letting others decide is fine in itself — the trouble is that once they have decided and you are walking that road, you feel unsatisfied. So pick one of the two: if you want to play safe and let others decide, learn to be content with it; and if you cannot be content, then walk the road you choose yourself.'],
    ['love', 'What are their feelings toward me?',
     'Not a pleasant card. You may be only one of the options they are loving for the time being. Or your feeling for them may be the greater, because you had the crush first, and they accepted only because there was nobody else to love in the meantime, nobody else to pass the time with.'],
    ['love', 'We are arguing — should we break up?',
     'The card does not say break up or stay. What it shows is a tendency — from the querent, or their partner, or both: the two are fairly tired of this relationship and are inclined to look outside for someone new, some new opportunity, and because they have not found one they remain stuck to each other. Or read more simply: both feel hesitant, anxious and adrift, and feel the relationship is not secure. But with the Seven of Cups there is always the sense of an eye on somebody else.']
  ],
  'pentacles-7': [
    ['other', 'What is this card\'s keyword?',
     'Persistence, endurance, patience. The image is someone who planted a tree, tended and fed it over a long stretch, and now stands looking at it grown, and more than grown — flowering and fruiting into seven coins. The card is neutral: when it comes up it may be advising the querent that they need more persistence — and if the cards are advising it, the querent is short of it. Or it may be saying take your time, what you are doing is in the right direction, work on a while longer and the result will come as you want it.'],
    ['love', 'Describe this person\'s character',
     'Someone persistent, enduring and patient. But at times a little passive and a little slow; when a quick decision is called for they are not good at it, and not decisive.'],
    ['love', 'What are their feelings toward me?',
     'There may well be feeling — and more than that, they may have liked you and been courting you for a very long time. Because for them winning you over is like cultivating a tree, and having won you they are enjoying the fruit of what they did long ago.'],
    ['love', 'We are arguing — should we break up?',
     'The two of you may simply be short of patience with each other. In any relationship there comes a point where you feel that lack — and in truth it is partly because we are not mature enough, and do not value the other enough: we want them to change for us, and are irritated when they do not change as much as we expected, so we snap, we scold, we take it out on them. With the Seven of Pentacles, the two of you may have been together a fairly long time, and the early ardour has gone. At the start of love, however many faults they had you were blind to them and passed over every one; and gradually you begin to see them and begin running out of patience.'],
    ['love', 'What if they cannot change?',
     'Be more patient with them and with yourself, and give them more time. But ask yourself first: what if they cannot? Some things belong to a person\'s essential nature and are very hard to shift, needing a great deal of time and depending on the strength of that person\'s own will to change. If they feel the request is unreasonable and would only be doing it to please you, do not force it — instead let them see how the change would be good for them. In general, with this card: stay calm with them, and at the same time think about what you need from them and what you can give this relationship.'],
    ['career', 'Will I find the right job soon?',
     'You may, and the effort you have put into the search, or into studying and sharpening yourself, will be repaid in kind. But you may need a little more patience yet before the work arrives.'],
    ['career', 'How will work go from here?',
     'You will have results, but with the Seven of Pentacles they usually come slowly — slowly and surely. And not in the way where you put in ten and twenty comes back: what you put in is what arrives. Say you are at one company and want promotion: the result will come, but not as fast as you want. The Seven of Pentacles teaches you to persist, to be patient, and to keep working even when you cannot see the fruit yet.'],
    ['other', 'Why does it take so much persistence?',
     'Like planting a tree: you do not see it break the soil at once, you see no growth — and what then, do you smash the pot and plant another? It has to go on, day after day, the same time each day given to tending it and feeding it, never stopping for a single one. The tree does not grow at once, but it grows, and in time you will see it come up tall and full, exactly as you hoped. Wanting to change yourself means changing a habit, and a habit is not made in a day or two — at least 28 days of doing it without a break. The Seven of Pentacles is not an explosive energy but one spread evenly across the days, steady and never stopping.']
  ]
});

/* batch 16 - the four Eights (keywords and readings together) */
Object.assign(KW.vi, {
  'wands-8': { pos: ['nhanh — cái gì đến thì đến nhanh','di chuyển, thay đổi khoảng cách địa lý','trung lập: có lúc ta cần nhanh, có lúc ta cần chậm'],
               neg: ['nhanh quá thì dễ hỏng','vội vàng kết luận','làm nhiều thứ cùng một lúc nên sai sót'] },
  'swords-8': { pos: ['dây trói rất lỏng — bạn tự cởi được bất cứ lúc nào','vòng kiếm chỉ vây có một nửa, phía trước vẫn còn đường đi','vẫn còn kịp quay đầu, chưa đến mức Chín Kiếm hay Mười Kiếm'],
                neg: ['bế tắc','trói buộc','mất tự do','suy nghĩ tiêu cực','nhìn vào mặt tối của vấn đề','tự mình trói mình'] },
  'cups-8': { pos: ['chủ động rời đi để đi con đường của mình','biết đâu là lúc phải rời khỏi'],
              neg: ['buồn, nuối tiếc, phân vân ngay tại thời điểm rời đi','sự chia ly hơi đáng tiếc — cố thêm chút nữa có khi đã tìm được cách','tiếc những gì đã bỏ công vào nên không dám đổi hướng'] },
  'pentacles-8': { pos: ['chăm chỉ','tỉ mỉ','kỹ lưỡng','cẩn thận','bền bỉ','giỏi khi làm một mình'],
                   neg: ['không nhìn được bức tranh toàn cảnh','bới móc lỗi','chỉ thấy phần thiếu, phần sai sót','cầu toàn đến mức tự làm mình khổ'] }
});

Object.assign(KW.en, {
  'wands-8': { pos: ['speed — whatever is coming comes fast','movement, a change of geography','neutral: sometimes we need speed, sometimes we need slowness'],
               neg: ['too fast and things break','jumping to conclusions','doing several things at once and making errors'] },
  'swords-8': { pos: ['the rope is very loose — you can untie it at any moment','the swords ring only half of her; the way ahead is open','still in time to turn back, not yet the Nine or Ten of Swords'],
                neg: ['deadlock','being bound','loss of freedom','negative thinking','looking at the dark side','tying yourself up'] },
  'cups-8': { pos: ['choosing to leave in order to walk your own road','knowing when it is time to go'],
              neg: ['sadness, regret and hesitation at the moment of leaving','the parting is somewhat regrettable — a little more effort might have found a way','regretting what you have already invested, so not daring to change direction'] },
  'pentacles-8': { pos: ['diligence','meticulousness','thoroughness','care','endurance','good working alone'],
                   neg: ['unable to see the whole picture','picking at faults','seeing only what is missing or wrong','perfectionism to the point of making yourself miserable'] }
});

Object.assign(ASK.vi, {
  'wands-8': [
    ['other', 'Từ khóa của lá này là gì?',
     'Hình ảnh là tám cây gậy được phóng lên bầu trời, nên có hai gạch đầu dòng lớn nhất. Thứ nhất: nhanh — cái gì đến thì sẽ đến nhanh. Thứ hai: sự di chuyển, thay đổi khoảng cách địa lý. So với lá Thế Giới của Ẩn Chính cũng nói về đi đây đi đó, thì Thế Giới là hiểu ngay ra nước ngoài, còn Tám Gậy chưa chắc đã là nước ngoài — có thể chỉ là đi từ Hà Nội đến Hải Phòng, tức là có sự di chuyển địa lý, gần hoặc xa. Bản thân lá này trung lập: đôi khi ta cần nhanh, đôi khi ta lại cần chậm rãi.'],
    ['love', 'Miêu tả tính cách một người?',
     'Rất nhanh: nghĩ nhanh, nói nhanh, đi đứng nhanh, làm gì cũng nhanh. Nhưng người làm gì cũng nhanh thì rất dễ hỏng, nên họ cần học cách chậm lại. Cũng có thể đây là kiểu người đa nhiệm, muốn mọi thứ hoàn thành nhanh chóng nên làm nhiều thứ cùng một lúc — vừa check email vừa nói chuyện với khách hàng vừa làm việc khác. Khoa học đã chứng minh đó là sai lầm: khi tập trung cho một thứ thôi thì nhanh hơn và ít sai sót hơn; làm nhiều thứ cùng lúc, sai nhiều quá rồi phải quay lại làm lại từ đầu thì còn tốn thời gian hơn.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Hơi căng đấy. Tình cảm họ dành cho bạn có gì đó rất nhanh chóng — mà cái gì nhanh đến thì cũng dễ nhanh đi. Có thể hai người va vào nhau hơi nhanh. Ta vẫn gặp những trường hợp như thế: vừa gặp được mấy ngày đã nghĩ đây là chân ái của đời mình. Nhưng càng ngày ta càng nhận ra không phải, đây chỉ là một người bình thường — vì khi tiếp xúc lâu thì những điểm xấu của họ mới dần lộ ra. Những cặp mới yêu đã cuồng nhiệt, cho rằng người kia là nửa kia của mình vì "chúng mình có chung sở thích, chúng mình là định mệnh", thường là đang yêu cái ảo tưởng mà chính họ tạo nên cho đối phương chứ không phải yêu bản thân đối phương. Rồi khi nhận ra đối phương không hoàn hảo, họ chán và có thể bỏ đi trước.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Có thể cả hai bạn đang nóng vội quá. Gậy vốn là năng lượng của lửa, cộng thêm sự nhanh nữa — bạn tưởng tượng lửa mà lại còn nhanh, tức là cả hai đều có thể nóng, bốc đồng và chẳng ai chịu nghe ai. Có những người kết luận rất nhanh, phán xét một vấn đề chỉ bằng một hai dấu hiệu: "người này không yêu mình nữa", "người này muốn phản bội mình". Còn người bình tĩnh hơn thì quan sát, thu thập đủ thông tin rồi mới kết luận, thậm chí còn hỏi thẳng đối phương. Người Tám Gậy thì vội vàng kết luận rồi thay đổi cách cư xử cho khớp với kết luận đó — trong khi sự thật có thể không đúng như vậy. Nên lời khuyên không phải là chia tay, mà là xem xét lại bản thân và mối quan hệ, và cả hai cần tĩnh tâm để ngồi xuống nói chuyện bình tĩnh với nhau chứ không phải chửi nhau.'],
    ['career', 'Thất nghiệp, thời gian tới tìm được việc không?',
     'Có thể tìm được. Thứ nhất, nó có thể đến rất nhanh — bạn vừa xem trải bài hôm nay thì tối đó nhận được tin báo có việc. Thứ hai, công việc này có xu hướng ở xa: có thể ở thành phố khác, hoặc bạn phải di chuyển liên tục vì công việc — ở Hà Nội làm ở Hà Nội nhưng mỗi ngày đi 15 cây số và về 15 cây số; hoặc làm công việc liên quan đến di chuyển.'],
    ['career', 'Thời gian tới công việc có vấn đề gì không?',
     'Có thể sẽ có một sự kiện gì đó đến rất nhanh — cụ thể là gì thì rút thêm. Hoặc bạn sẽ có chuyến công tác trong nước, được luân chuyển bộ phận, hay đơn giản là chuyển chỗ ngồi — được chuyển sang ngồi kèm nhân viên mới.']
  ],
  'swords-8': [
    ['other', 'Từ khóa của lá này là gì?',
     'Bế tắc, trói buộc, mất tự do. Bạn bị trói, bị bịt mắt, bị vây quanh bởi tám thanh kiếm — muốn đi làm không đi được, muốn đi học không đi được, muốn yêu không yêu được. Nhưng nhìn kỹ thì họ bị trói rất lỏng, và với kiểu trói ấy họ có thể dứt ra bất cứ lúc nào. Vòng kiếm cũng chỉ vây có một nửa, phía trước vẫn còn đường đi. Nghĩa là người này hoàn toàn có khả năng thoát ra: tự cởi trói, tháo băng bịt mắt và chạy đi. Còn họ có làm hay không lại là chuyện khác.'],
    ['other', 'Vậy ai đã trói người đó?',
     'Chính họ. Bế tắc trong lá này là do bản thân người hỏi tạo ra, do những suy nghĩ tiêu cực của chính họ, chứ không phải ai bắt ép hay trói họ cả. Thật ra chính người này đã tự cắm kiếm xuống đất, tự chui vào giữa, tự bịt mắt và tự trói mình. Và khi bạn tự trói mình thì cũng chính bạn cởi được. Nhưng họ vẫn mở miệng kêu "tôi khổ quá, tôi bị trói, ai cứu tôi với" mà không nhận ra chính họ là người đã trói mình.'],
    ['love', 'Miêu tả tính cách một người?',
     'Người suy nghĩ tiêu cực, chỉ nhìn vào mặt tiêu cực của vấn đề. Những ai có xu hướng nhìn vào phần tối thì thường khá bất hạnh, vì đi đâu bạn cũng chỉ thấy những điều đen tối: người này ghét mình, đứa kia muốn hãm hại mình, công việc này mình không làm được đâu, mình kém cỏi lắm, mình không bao giờ bứt phá lên được. So với Chín Kiếm và Mười Kiếm thì đó là những cấp độ cao hơn; Tám Kiếm thì vẫn còn quay đầu được, vẫn còn kịp sửa sai.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Có thể là có tình cảm, nhưng vì một vấn đề nào đó của bản thân — một tổn thương, hoặc chính những suy nghĩ tiêu cực của họ — mà họ tự ngăn mình, tự trói mình, không cho mình đến với bạn. Ví dụ: họ tự cho rằng hoàn cảnh của mình là một nhược điểm và họ sẽ không bao giờ xứng đáng được ai yêu quý. Rồi khi gặp một người thật lòng thương họ, thật lòng muốn tốt cho họ, không quan tâm đến hoàn cảnh của họ, thì họ vẫn cứ tự nhủ "chắc người này chẳng yêu được mình lâu đâu, mình không xứng đáng" — và thế là chính họ đẩy người ta đi.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Chưa cần chia tay. Nhưng có thể bạn đang có xu hướng nhìn đời bằng con mắt tiêu cực và nghĩ rằng cuộc sống của mình bế tắc quá. Khi gặp một vấn đề, chúng ta thường ngay lập tức muốn sửa — mà sửa ở đây là sửa môi trường xung quanh và sửa những người xung quanh: tình cảm không tốt thì tìm cách sửa người yêu, công việc không tốt thì nói xấu sếp, nói xấu đồng nghiệp. Chúng ta rất ít khi nhìn lại bản thân xem mình cần sửa cái gì trước. Và đôi khi không phải là sửa một đặc điểm nào cả, mà chỉ cần thay đổi cách bạn nhìn nhận vấn đề là nó tự giải quyết.'],
    ['love', 'Ví dụ về việc đổi cách nhìn?',
     'Bạn đi làm và bị đồng nghiệp nói xấu trong khi bạn chẳng làm gì họ. Thế là bạn bắt đầu nghĩ "mình đã làm gì sai, sao lại là mình", rồi kết luận là phải trả đũa, phải nói xấu lại. Hoặc một số người thì đau khổ buồn bực: "tại sao lại đối xử với tôi như thế, tôi có làm gì đâu, sao mọi người cứ muốn hãm hại tôi" — và thế là bạn bế tắc bởi chính những suy nghĩ tiêu cực của mình. Trong khi một người khác có thể bung ra khỏi sợi dây trói ấy: "thôi kệ, nhân quả cả, chuyện gì đến cũng phải đến; có thể kiếp trước mình nói xấu họ nên giờ họ nói xấu mình; còn nếu mình chưa làm gì họ mà họ hại mình thì ngày mai sẽ có người khác nói xấu họ — mình không việc gì phải trả thù."'],
    ['career', 'Thời gian tới tìm được việc mới không?',
     'Nhiều khả năng là chưa, và vấn đề nằm ở bạn. Bạn có đi tìm việc, nhưng bạn rất tiêu cực: vẫn cho rằng chắc mình chẳng tìm được công việc nào tốt đâu. Điều đó ảnh hưởng đến kết quả phỏng vấn, và cũng ảnh hưởng đến việc bạn gửi CV — bạn toàn gửi vào những chỗ không phù hợp, kém hơn năng lực thật của mình, hoặc không đúng với sở thích của mình. Ví dụ bạn thích nhiếp ảnh nhưng cứ gửi CV vào kế toán vì bố mẹ bắt theo ngành đó.'],
    ['career', 'Thời gian tới công việc có gì cần lưu ý?',
     'Miệng thì bảo công việc bình thường, nhưng bản thân bạn đang có một số vấn đề khiến bạn cảm thấy bế tắc ở chỗ làm. Ví dụ mối quan hệ với sếp: bạn cảm thấy bế tắc, không thể nào tìm được cách khiến người này quý mình, đã thử bao nhiêu cách rồi, ngọt có cứng rắn có, mà sếp vẫn không ưa mình — và bạn cứ nghĩ về chuyện này suốt bao lâu nay. Với Tám Kiếm thì thời gian tới chắc cũng chẳng có sự kiện gì, nhưng bài muốn bạn nhìn lại bản thân xem có vấn đề gì cần giải quyết, hay có suy nghĩ nào cần buông bỏ — tự cởi trói cho mình thì sẽ có được một môi trường làm việc tích cực hơn.']
  ],
  'cups-8': [
    ['other', 'Từ khóa của lá này là gì?',
     'Chủ động rời đi. Mọi người rất tốt với bạn, môi trường tốt, người ta còn hứa hẹn cho bạn thăng tiến và bạn biết điều đó sẽ thành hiện thực — nhưng bạn vẫn lựa chọn rời khỏi, bởi bạn biết con đường dành cho bạn là phải rẽ sang ngã khác. Bạn phải tạm biệt họ; khi nào rảnh thì đi chơi với nhau, nhưng đến lúc phải rời khỏi rồi.'],
    ['love', 'Miêu tả tính cách một người?',
     'Hơi khó nói, nên rút thêm. Nếu chỉ có mỗi lá này thì có thể nói: thời gian gần đây họ vừa phải trải qua một chuyện mang năng lượng Tám Cốc — họ phải bỏ lại sau lưng một số thứ từng rất quan trọng với mình để đi trên một hành trình mới. Dĩ nhiên ở thời điểm bỏ lại thì ta buồn, ta nuối tiếc, ta phân vân lưỡng lự — nhưng ta vẫn làm. Và sự kiện đó có thể đang ảnh hưởng đến tính cách và tâm tư của họ ở thời điểm này.'],
    ['love', 'Tình cảm người ấy dành cho tôi có thật lòng không?',
     'Có thể họ có tình cảm với bạn, nhưng ở thời điểm này họ đang có những hướng khác muốn đi. Cảm giác như bạn đang đứng ở đây và nhìn thấy người ta quay lưng lại, đi hướng khác, bỏ bạn lại. Nên: người này có thể có tình cảm với bạn, nhưng lúc này họ sẽ không tiến đến với bạn đâu, vì họ biết họ có những ước mơ hoặc một con đường khác phải đi mà con đường đó không thể dính dáng đến bạn được. Ví dụ họ muốn có mối quan hệ với bạn nhưng tháng sau họ phải đi du học bốn năm, nên họ chọn thôi không bắt đầu.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Chẳng cần khuyên là chia tay hay không, vì sớm hay muộn một trong hai người sẽ bước đi và rời khỏi mối quan hệ. Lý do hai người cãi nhau có thể là: một người đã tìm được một hành trình khác, một con đường khác muốn đi, còn người kia thì cứ cố gắng níu giữ. Hai người bắt đầu có sự tách biệt, khác biệt về quan điểm sống hoặc về hành trình — nên kể cả khi khuyên là không nên chia tay thì hai bạn vẫn sẽ có sự rời khỏi. Nói chung ra Tám Cốc trong câu hỏi về chia ly thì khả năng chia ly cao: không đến từ bạn thì cũng đến từ họ. Nhưng có cảm giác sự chia ly của Tám Cốc hơi đáng tiếc — như thể nếu cố gắng hơn thì hai người vẫn có thể tìm được một cách nào đó. Chỉ là một số người không nhẫn nại đến thế.'],
    ['career', 'Thất nghiệp ba tháng, tìm được công việc như ý không?',
     'Nếu muốn tìm được công việc như ý thì bạn phải bỏ lại cái cảm giác gắn với lá này. Ví dụ bạn đang tập trung tìm việc vào một số ngành nghề nhất định, bởi vì bạn rất tiếc — tiếc rằng mình đã học ngành này, đã dành thời gian cho nó một thời gian rồi, nếu bây giờ bỏ ngang để chuyển sang ngành khác thì tiếc. Dù sao thì đây cũng là Tám Cốc, những chiếc cốc vẫn còn đầy, nên bạn phải tiếc chứ. Nhưng cứ tình hình này thì lại không tìm được việc.']
  ],
  'pentacles-8': [
    ['other', 'Từ khóa của lá này là gì?',
     'Chăm chỉ, tỉ mỉ, kỹ lưỡng, cẩn thận — và làm một mình. Hình ảnh là người thợ đang chạm khắc tám đồng tiền: công việc ấy không thể làm nhanh chóng cho xong, mà phải tỉ mỉ và cẩn thận. Muốn chạm khắc xong cả một đống đồng tiền thì phải bền bỉ và kiên trì đến mức nào.'],
    ['love', 'Miêu tả tính cách một người?',
     'Một người tỉ mỉ, có thể theo chủ nghĩa hoàn hảo, rất chăm chỉ và cầu toàn, nhưng giỏi khi làm một mình hơn là làm với nhiều người. Người đọc bài nghĩ ngay đến cung Xử Nữ. Nhược điểm của người mang năng lượng này: đôi khi họ không nhìn được bức tranh toàn cảnh — họ bới móc lỗi, chỉ nhìn được phần thiếu và phần sai sót của bức tranh mà không có khả năng tận hưởng toàn bộ bức tranh.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Có thể là có, nhưng chính cái tính bới móc lỗi kia sẽ cản trở. Thay vì nghĩ "chúng ta hợp nhau, chúng ta có thể tiến đến với nhau", người này lại nghĩ quá nhiều: họ bắt đầu săm soi xem gia cảnh hai đứa có hợp không, lương hai đứa thế nào, tính cách này thì liệu có thay đổi được không. Thay vì nghĩ rằng cứ đến với nhau rồi cùng nhau cố gắng, họ lại bới móc lỗi của cả hai. Và đôi khi họ biết làm thế chỉ khiến mình buồn và chẳng mang lại hạnh phúc, nhưng cứ như bệnh ám ảnh cưỡng chế, họ không dừng lại được.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Lý do là một trong hai, hoặc cả hai, có xu hướng bới móc lỗi của nhau thay vì nhìn vào những gì người kia đã làm cho mình. Giận hờn những chuyện rất nhỏ nhặt: tại sao hôm nay anh mặc cái áo này, em đã nói là em không thích mà; tại sao anh lại cười với bạn của em. Những chuyện không đáng để cãi nhau. Và một trong hai, hoặc cả hai, săm soi đời tư của nhau quá: "con bé này like ảnh anh, hai người có gì với nhau à", "em xem story của anh mà không nhắn gì à".'],
    ['career', 'Thời gian tới tìm được việc không?',
     'Có, và tính chất công việc sẽ giống như tính cách của lá: thứ nhất, bạn có xu hướng làm một mình trong công việc mới; thứ hai, công việc đòi hỏi sự tỉ mỉ cao và phải chăm chỉ. Đây là kiểu công việc mà bạn không thể hôm nay làm một phát là xong, mà phải tỉ mỉ từng ly từng tí trong nhiều ngày liền — giống như người thợ đang chạm khắc. Hoặc là những công việc số má: kế toán, sổ sách, kiểm toán. Loại việc đó cần rất nhiều sức bền, và bạn phải đi từng chút một.'],
    ['career', 'Thời gian tới công việc có gì thay đổi không?',
     'Công việc của bạn vốn đã tỉ mỉ và chăm chỉ rồi, nên hãy chăm chỉ nỗ lực thêm một thời gian nữa. Với Tám Tiền thì không có nhiều thứ để nói: công việc vốn đang thế, và nó là loại công việc đòi hỏi cả một quá trình. Nên thông điệp là đừng bỏ cuộc. Bạn đang cảm thấy hơi oải, và đúng là nó là một quá trình — nhưng cứ tiếp tục, bởi khi người thợ chăm chỉ làm xong thì đồng tiền rất hoàn hảo, rất hoàn chỉnh. Cứ tiếp tục chăm chỉ, bền bỉ, kiên trì rồi xem thành quả cuối cùng thế nào.']
  ]
});

Object.assign(ASK.en, {
  'wands-8': [
    ['other', 'What is this card\'s keyword?',
     'The image is eight wands launched into the sky, so there are two main points. First: speed — whatever is coming comes fast. Second: movement, a change of geography. Compare the World in the Majors, which also speaks of travel: the World means going abroad, while the Eight of Wands need not be abroad at all — it may be one city to the next, a move across geography, near or far. The card itself is neutral: sometimes we need speed and sometimes we need to go slowly.'],
    ['love', 'Describe this person\'s character',
     'Very fast: fast-thinking, fast-talking, fast-moving, fast at everything. But someone who does everything fast breaks things easily, so they need to learn to slow down. This may also be the multitasker who wants everything finished at once and so runs several things together — checking email while talking to a client while doing something else. Science has shown that to be a mistake: concentrating on one thing is faster and produces fewer errors; run several at once, make too many mistakes, and having to start again costs more time than it saved.'],
    ['love', 'What are their feelings toward me?',
     'Rather concerning. Their feeling for you has something very fast about it — and what comes fast tends to go fast. The two of you may have collided rather quickly. We all see cases like it: a few days after meeting, they are certain this is the love of their life. And with time we realise it is not, that this is an ordinary person — because it takes longer contact for the less good traits to show. Couples who fall wildly in love straight away, deciding the other is their other half because "we like the same things, we are destiny", are usually in love with an illusion they built for the other person rather than with the person. And when they see the other is not perfect, they lose interest, and may be the ones to leave first.'],
    ['love', 'We are arguing — should we break up?',
     'Both of you may be being far too hasty. Wands is fire energy, and here fire with speed added — picture that, and you have two people who are hot, impulsive, and neither listening. Some people conclude very quickly, judging a whole matter on one or two signs: "they do not love me any more", "they mean to betray me." Calmer people watch, gather enough information, and only then conclude — they even ask the other person outright. Eight of Wands people conclude in a rush and then change their behaviour to fit the conclusion — when the truth may be nothing like it. So the advice is not to break up but to look again at yourself and the relationship, and for both of you to find enough calm to sit down and talk rather than shout.'],
    ['career', 'Unemployed — will I find work soon?',
     'You may. First, it may come very fast — a reading today and news of a job that evening. Second, the work tends to be at a distance: possibly in another city, or work that has you moving constantly — living and working in the same city but with fifteen kilometres each way every day, or a job that is about movement itself.'],
    ['career', 'Any trouble at work coming?',
     'Some event may arrive very fast — draw more for what it is. Or you may have a domestic work trip, be moved to another department, or simply change desks: shifted over to sit beside and train the new arrival.']
  ],
  'swords-8': [
    ['other', 'What is this card\'s keyword?',
     'Deadlock, being bound, loss of freedom. You are tied, blindfolded, ringed by eight swords — wanting to work and unable to, wanting to study and unable to, wanting to love and unable to. But look closely: the binding is very loose, and with a tie like that she could pull free at any moment. The ring of swords only surrounds half of her; the way ahead is open. So this person is entirely able to get out: untie herself, pull off the blindfold, and walk. Whether she does is another question.'],
    ['other', 'So who tied them up?',
     'They did. The deadlock in this card is made by the querent, out of their own negative thinking — nobody forced them and nobody bound them. In truth this person planted the swords in the ground themselves, walked in among them, blindfolded themselves and tied their own hands. And what you tie yourself, you can untie yourself. And still they say aloud, "I am so wretched, I am tied up, will somebody save me" — without seeing that they are the one who did the tying.'],
    ['love', 'Describe this person\'s character',
     'Someone who thinks negatively and looks only at the dark side. People who lean that way she finds quite unhappy, because once you see the dark side you see dark things everywhere you go: this one hates me, that one wants to harm me, I will never manage this job, I am useless, I will never break through. Set against the Nine and Ten of Swords, those are higher levels; the Eight of Swords can still turn back, still in time to put things right.'],
    ['love', 'What are their feelings toward me?',
     'There may well be feeling, but because of some problem of their own — an old wound, or their own negative thinking — they hold themselves back and tie themselves up rather than come to you. Say they have decided their circumstances are a defect and that they will never deserve to be loved. Then when they meet someone who genuinely cares for them and wants their good regardless of any of it, they still tell themselves "this person will not love me for long, I do not deserve it" — and so they are the ones who push that person away.'],
    ['love', 'We are arguing — should we break up?',
     'Not yet. But you may be inclined to look at life through a negative lens and decide that your life is hopelessly stuck. When we meet a problem we want to fix it immediately — and by fixing we mean fixing the surroundings and the people in them: the relationship is not good so we try to fix the partner; work is not good so we badmouth the manager and the colleagues. We very rarely turn and ask what we ourselves need to change first. And sometimes it is not a trait that needs changing at all: change only the way you see the problem and it resolves itself.'],
    ['love', 'An example of changing the angle?',
     'A colleague badmouths you at work when you have done nothing to them. So you start on "what did I do wrong, why me", and conclude you must repay it and badmouth them back. Or you take it hard: "why treat me like this, I did nothing, why does everyone want to harm me" — and there you are, stuck inside your own negative thinking. Where someone else bursts the rope: "let them; there is cause and effect, and what comes must come. Perhaps in a past life I badmouthed them and now they badmouth me; and if I have done nothing and they harm me, tomorrow somebody else will badmouth them. I have no need of revenge."'],
    ['career', 'Will I find new work soon?',
     'Most likely not yet, and the problem is you. You are looking, but you are deeply negative: still certain you will not find anything good. That affects how the interviews go, and it affects where you send the CV — you send only to unsuitable places, below what you can actually do, or nothing to do with what you like. You want photography and keep applying for accounting because your parents pushed you into it.'],
    ['career', 'Anything to watch at work?',
     'Your mouth says work is fine, and you are already carrying problems there that feel stuck. Take your manager: you feel the relationship is at a dead end, that you cannot find any way to make this person like you; you have tried everything, gently and firmly, and they still do not — and you have been turning it over for a long time. With the Eight of Swords there will probably be no event; the card wants you to look at yourself and see what needs solving, or what thought needs letting go. Untie yourself and the working environment turns more positive.']
  ],
  'cups-8': [
    ['other', 'What is this card\'s keyword?',
     'Choosing to leave. People are good to you, the environment is good, they have even promised you promotion and you know it will happen — and you still choose to go, because you know the road meant for you turns off elsewhere. You have to say goodbye; meet them when you are free, but the time to leave has come.'],
    ['love', 'Describe this person\'s character',
     'Rather hard to say; draw more. With this card alone: they may recently have been through something with Eight of Cups energy — having to leave behind things that were once very important to them in order to walk a new road. At the moment of leaving we are sad, regretful, wavering — and we do it anyway. And that event may be shaping their character and their state of mind right now.'],
    ['love', 'Are their feelings for me genuine?',
     'They may have feelings for you, and at this moment they have other directions they want to take. It is as though you are standing here and watching them turn their back, walk another way, and leave you behind. So: they may care for you, and they will not come toward you now, because they know they have dreams or another road that cannot involve you. They want a relationship with you, and next month they leave to study abroad for four years, and they choose not to begin.'],
    ['love', 'We are arguing — should we break up?',
     'There is no need to advise it either way, because sooner or later one of the two will step away from this relationship. What you are arguing about may be that one of you has found another journey, another road to take, while the other keeps trying to hold on. The two of you are beginning to separate, in outlook or in journey — so even advised against breaking up, a departure is still coming. On a question about parting, the Eight of Cups makes parting likely: if not from you then from them. But the Eight of Cups parting feels somewhat regrettable — as though with a little more effort the two of you might have found a way. Only some people are not that patient.'],
    ['career', 'Out of work three months — will I find the right job?',
     'To find the job you want you will have to put down the feeling this card carries. You may be concentrating the search on certain fields because you feel such regret — regret that you studied this, gave it your time, and that switching now to something else would waste it. It is the Eight of Cups after all; the cups are still full, so of course you feel it. But at this rate nothing will land.']
  ],
  'pentacles-8': [
    ['other', 'What is this card\'s keyword?',
     'Diligence, meticulousness, thoroughness, care — and working alone. The image is a craftsman carving eight coins: work that cannot be rushed to completion but has to be done carefully and precisely. Think what persistence it takes to finish carving a whole pile of them.'],
    ['love', 'Describe this person\'s character',
     'Someone meticulous, possibly a perfectionist, very diligent and exacting, and better working alone than among many. the reader thinks immediately of Virgo. The weakness of this energy: sometimes they cannot see the whole picture — they pick at faults, seeing only the missing and the flawed parts and never able to enjoy the whole of it.'],
    ['love', 'What are their feelings toward me?',
     'There may be feeling, and that fault-picking will get in the way of it. Instead of thinking "we suit each other, we could move forward", this person thinks far too much: scrutinising whether the two families match, what both salaries are, whether that trait could ever change. Instead of thinking that you come together and then work at it together, they pick over the faults on both sides. And sometimes they know it only makes them unhappy and brings no joy, and, as with a compulsion, they cannot stop.'],
    ['love', 'We are arguing — should we break up?',
     'The reason is that one of you, or both, tends to pick at the other\'s faults rather than looking at what they have done for you. Resentment over very small things: why are you wearing that shirt when I said I do not like it, why did you smile at my friend. Things not worth arguing over. And one or both of you scrutinises the other\'s private life too closely: this girl liked your photo, what is going on there; you watched my story and said nothing?'],
    ['career', 'Will I find work soon?',
     'Yes, and the nature of it will follow the card: first, you will tend to work alone in the new job; second, the work demands high precision and diligence. This is work you cannot finish in one go but must do bit by bit over many days — like the craftsman carving. Or it is work with numbers: accounting, bookkeeping, auditing. That kind of work needs a great deal of endurance, taken a little at a time.'],
    ['career', 'Any change at work coming?',
     'Your work is already meticulous and hard-working, so put in the effort a while longer. With the Eight of Pentacles there is not much to say: the work is what it is, and it is work that demands a whole process. So the message is simply not to give up. You may be feeling worn, and it is indeed a process — but keep going, because when the diligent craftsman is finished the coin is perfect and complete. Keep at it, endure, persist, and see what the final result looks like.']
  ]
});

/* batch 17 - the four Nines */
Object.assign(KW.vi, {
  'wands-9': { pos: ['đừng bỏ cuộc','bền bỉ','khó khuất phục','không bỏ cuộc trước nghịch cảnh','đang đi đúng hướng, chỉ là đường gập ghềnh'],
               neg: ['gặp nhiều khó khăn hơn người bình thường','những hòn đá liên tiếp khiến bạn nản lòng','mệt mỏi, phải cảnh giác'] },
  'swords-9': { pos: ['vẫn là Ẩn Phụ — người hỏi hoàn toàn có khả năng tự giải quyết'],
                neg: ['bi quan','tuyệt vọng','nghĩ rằng cả thế giới chống lại mình','tần số thấp, và tần số thấp thì thu hút những thứ thấp','từ bé xé ra to'] },
  'cups-9': { pos: ['thỏa mãn','hài lòng với những gì mình đang có','lạc quan yêu đời','giỏi thật — đạt được Chín Cốc không phải là kém'],
              neg: ['chủ quan','tự mãn','kiêu căng ngạo mạn','chín vẫn chưa phải là mười','thiếu khiêm tốn'] },
  'pentacles-9': { pos: ['tận hưởng cuộc sống ở khía cạnh vật chất','tài chính rủng rỉnh, công việc lương ổn','tự làm ra tiền chứ không phải đào mỏ'],
                   neg: ['tận hưởng một mình','ích kỷ','không thích chia sẻ','trong tình cảm thì hướng về bản thân nhiều hơn hướng về người kia'] }
});

Object.assign(KW.en, {
  'wands-9': { pos: ['do not give up','endurance','hard to subdue','not yielding to adversity','you are on the right road, the road is simply rough'],
               neg: ['meeting more difficulty than most people do','one stone after another wearing you down','tired, and on your guard'] },
  'swords-9': { pos: ['still a Minor — the querent is entirely capable of solving it themselves'],
                neg: ['pessimism','despair','believing the whole world is against you','a low frequency, and a low frequency draws low things','making a small thing enormous'] },
  'cups-9': { pos: ['satisfaction','contentment with what you have','optimistic and glad of life','genuinely able — reaching the Nine of Cups is no small thing'],
              neg: ['complacency','smugness','arrogance','nine is still not ten','short on humility'] },
  'pentacles-9': { pos: ['enjoying life on its material side','money comfortable, the pay steady','earning it themselves rather than digging for gold'],
                   neg: ['enjoying it alone','selfishness','no wish to share','in love, turned toward the self more than toward the other'] }
});

Object.assign(ASK.vi, {
  'wands-9': [
    ['love', 'Miêu tả tính cách một người?',
     'Một người rất bền bỉ, khó khuất phục. Họ không chịu khuất phục nghịch cảnh và thử thách, không phải kiểu người dễ bỏ cuộc. Có một điều thú vị Người đọc bài gặp trong thực tế: khi rút được lá này để miêu tả một người, người ấy quả thật chăm chỉ, bền bỉ và nỗ lực hơn người bình thường — nhưng hài hước ở chỗ, bản thân họ cũng gặp nhiều khó khăn hơn người bình thường. Con đường của họ gập ghềnh hơn người khác. Rồi họ sẽ thành công thôi, với cái tính chăm chỉ ấy; và khi nhìn lại thì họ đã đi qua nhiều hơn người khác.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Rất khó khẳng định có hay không, nên rút thêm. Nếu chỉ có lá này thì có thể đọc là: họ có tình cảm, nhưng hoặc là hiện giờ họ đang phải đối mặt với nhiều thử thách khác trong cuộc sống và công việc, hoặc là trước đó họ đã gặp nhiều thử thách trong tình cảm — bị cắm sừng nhiều lần, bị bỏ rơi nhiều lần. Dù thế nào thì quá khứ và hoàn cảnh của họ cũng đều là chướng ngại vật cho mối quan hệ của hai bạn.'],
    ['love', 'Vì sao họ bảo tôi chờ?',
     'Có thể họ thích bạn nhưng lại bảo "em chờ anh một chút nhé", và bạn thấy tò mò không biết vì sao. Lý do là họ đang phải đương đầu với khá nhiều khó khăn khác trong cuộc sống, hoặc vì quá khứ bị phản bội nhiều nên họ muốn yêu chậm thôi — chậm mà chắc. Người hỏi có thể cần học cách đồng cảm hơn, thấu hiểu hơn, kiên nhẫn hơn với người này. Còn bạn có ổn với cái nhịp độ chậm ấy trong tình cảm hay không thì tùy bạn.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Mối quan hệ của hai bạn có thể vốn đã khó khăn hơn các mối quan hệ khác ngay từ xuất phát điểm: khác biệt về ngôn ngữ, vùng miền, tôn giáo, hoặc gia đình hai bên không ưa nhau ngay từ đầu. Liệu hai bạn có vượt qua được cùng nhau hay không, hay để cho khó khăn đánh bại mình — đó là câu hỏi bỏ ngỏ dành cho chính bạn. Nhưng hãy luôn nhớ từ khóa của lá này: đừng bỏ cuộc.'],
    ['career', 'Đang tìm việc, sắp tới thế nào?',
     'Có thể bạn đã bị từ chối rất nhiều lần rồi. Nhưng thôi, cố lên, tiếp tục, đừng bỏ cuộc — có thể chỉ vì đợt này khó khăn thôi. Chín Gậy cho thấy bạn đang đi đúng hướng rồi, chỉ là con đường của bạn gập ghềnh hơn mà thôi.'],
    ['career', 'Thời gian tới công việc có gì cần lưu ý?',
     'Miệng thì nói không có vấn đề gì, nhưng công việc của bạn có tính chất là thỉnh thoảng sẽ có chuyện bực mình, có vấn đề cần xử lý. Những khó khăn mà Chín Gậy mang đến không mang tính toàn cục: nó là hòn đá khiến bạn phải dừng lại một lúc, nhấc nó ra rồi đi tiếp — không phải một tảng đá to đùng từ trên trời rơi xuống, mà cũng không phải hòn sỏi bé xíu. Nó gây phiền phức nhưng không đủ lớn để chặn đường bạn. Chỉ là nếu có nhiều hòn đá liên tiếp thì bạn sẽ nản. Đừng vì thế mà bỏ việc hay nghĩ đến nhảy việc: cùng một hòn đá ấy, lần trước bạn đã giải quyết được thì lần này bạn cũng sẽ giải quyết được.'],
    ['other', 'Bài học của lá này là gì?',
     'Kiên trì và kiên nhẫn. Ví dụ: đi qua hết mười hòn đá thì thành công — nhưng có mấy ai đủ kiên trì đi hết mười hòn? Có những người bỏ cuộc ngay từ hòn đầu tiên, cũng có người bỏ cuộc ở hòn thứ chín. Đó chính là thông điệp sâu xa của Chín Gậy.']
  ],
  'swords-9': [
    ['love', 'Miêu tả tính cách một người?',
     'Người mang tâm thế: chẳng ai yêu quý mình, tất cả mọi người đều muốn chống lại mình, mình đơn độc một mình với cả thế giới này, mình khổ quá, mình bất lực quá. Đó là người mang năng lượng Chín Kiếm.'],
    ['love', 'Có nên yêu người mang lá này không?',
     'Hãy cân nhắc kỹ. Vấn đề của người này không phải là thứ có thể giải quyết một chiều, và cũng không phải là thứ mà ai đó đến để chữa lành hộ được. Nếu bạn nghĩ bạn có thể chữa lành cho họ thì bạn nhầm — vấn đề của họ phải do chính họ giải quyết. Với một khách hàng bình thường thì Người đọc bài sẽ nói như vậy; còn nếu đó là em, là chị, là bạn của cô thì cô sẽ nói thẳng: thôi, đừng yêu người này.'],
    ['love', 'Cãi nhau nhiều, có nên chia tay không?',
     'Vấn đề của hai bạn ban đầu chỉ là Tám Kiếm, nhưng dần dần bị bé xé ra to. Dù là Chín Kiếm thì vẫn là Ẩn Phụ, mà đã là Ẩn Phụ thì người hỏi hoàn toàn có khả năng tự giải quyết — dĩ nhiên đến mức 9, 10 thì khó hơn mức 3, 4, nhưng không phải là không làm được. Có thể hai bạn có tính cách rất trái ngược nhau, nhưng thay vì tìm tiếng nói chung thì mỗi người lại bắt người kia phải thay đổi: một người hay ghen, một người lại thích đi chơi với bạn hơn với người yêu — thành một vòng luẩn quẩn. Thay vì thỏa hiệp thì lại là "anh đừng đi chơi với bạn nữa, em cấm" và "em phải thay đổi đi, em đừng ghen nữa" — và mãi không tìm được tiếng nói chung, càng ngày càng độc hại hơn.'],
    ['love', 'Vậy tôi nên làm gì?',
     'Hãy tỉnh táo hơn và cố gắng thỏa hiệp để tìm tiếng nói chung. Dĩ nhiên nếu chỉ mình bạn thỏa hiệp thì cũng chẳng ra đâu vào đâu. Hãy xem: bạn thỏa hiệp trước, và nếu họ đáp lại thì tiếp tục mối quan hệ. Còn nếu bạn đã xuống nước, đã thỏa hiệp mà họ không trân trọng nỗ lực đó của bạn, thì bạn hoàn toàn có quyền rời khỏi. Nhưng dù sao thì một mối quan hệ ở mức Chín Kiếm cũng đã khá độc hại và khá mệt mỏi rồi.'],
    ['career', 'Thất nghiệp lâu, sắp tới tìm được việc không?',
     'Bạn đang khá bi quan trong việc tìm việc. Có thể bị từ chối vài lần rồi, và cách bạn nhìn nhận công việc rất tiêu cực — chưa đi phỏng vấn mà đã nghĩ "chắc mình sẽ trượt thôi". Bạn mang cái năng lượng bi quan đó vào buổi phỏng vấn và người phỏng vấn nhận ra ngay: họ chẳng muốn nhận một người bi quan như thế. Lá này khuyên bạn nên thay đổi tâm trạng của mình trước. Tần số của bạn đang khá thấp, mà tần số thấp thì thu hút những thứ thấp: thất bại, chia ly, đau khổ. Hãy lạc quan hơn và nhìn vào những điều sáng sủa trong cuộc sống.'],
    ['career', 'Thời gian tới công việc có gì cần lưu ý?',
     'Có thể bản thân bạn đã chán công việc này lắm rồi, và vì cách nhìn nhận của bạn vốn rất bi quan nên bạn hay gặp nhiều biến cố trong công việc: thỉnh thoảng bị sếp mắng, thỉnh thoảng bị đồng nghiệp nói. Rồi bạn nghĩ "tại sao đồng nghiệp và sếp cứ mắng mình thế này, có phải cả thế giới ghét mình không" — trong khi có thể chỉ đơn giản là do bạn làm sai, làm không tốt, làm ẩu. Thời gian tới vẫn sẽ có những sự kiện khiến bạn khổ vì công việc. Nếu do bản chất công việc là như thế và bạn không chịu được áp lực thì thôi, nghỉ. Còn nếu do lỗi của bạn thì tìm cách khắc phục.'],
    ['other', 'Đọc bài cho người mang lá này thì thế nào?',
     'Đó sẽ là một buổi trải bài tương đối mệt. Người đọc bài giống như miếng bọt biển hút năng lượng của người khác, cả tốt lẫn xấu — nên sau buổi đó bạn sẽ thấy mệt và thấy tâm trạng của mình bị kéo xuống theo. Ra lá này hoặc Mười Kiếm thì đều là những buổi trải bài mệt cho cả hai phía.']
  ],
  'cups-9': [
    ['other', 'Từ khóa của lá này là gì?',
     'Sự thỏa mãn — hài lòng với những gì mình đang có. Nghĩa tốt: bạn thỏa mãn, mà thỏa mãn với một điều kiện nào đó thì tức là điều kiện ấy phải tốt. Mặt tiêu cực là sự chủ quan. Dù sao đây cũng mới là Chín Cốc chứ chưa phải Mười Cốc, chưa phải sự trọn vẹn hoàn hảo — thế mà người này đã thỏa mãn rồi. Nghĩa là có những thứ bạn còn có thể cải thiện được, nhưng bạn đang nghĩ "cần gì phải cải thiện, thế là đủ rồi" — trong khi nếu cố gắng hơn thì kết quả còn tốt hơn nữa.'],
    ['other', 'Một ví dụ cho dễ hiểu?',
     'Bạn hỏi kết quả thi thử của mình thế nào và ra Chín Cốc: kết quả phải tốt thì bạn mới thấy thỏa mãn. Nhưng thi thử tốt không đồng nghĩa với việc điểm thi thật cũng cao. Chín Cốc nói rằng kết quả thi thử của bạn tốt, nhưng chính cái kết quả tốt ấy có thể khiến bạn chủ quan, khiến bạn nghĩ "mình được điểm cao rồi, không cần ôn kỹ nữa, thế là đủ" — hơi giống Sáu Gậy ở đoạn tự đắc tự mãn.'],
    ['love', 'Miêu tả tính cách một người?',
     'Một người mang lại năng lượng lạc quan yêu đời, nhưng đôi khi có thể hơi thái quá, hoặc có phần kiêu căng ngạo mạn. Cứ nhìn hình ảnh ông này đang khoanh tay, mặt cười đắc thắng, là miêu tả được người đó.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Có thể là có, nhưng cách họ đối xử với bạn giống như thể họ tin rằng bạn sẽ không bao giờ bỏ rơi họ trước — khá đắc thắng trong mối quan hệ này. Có thể họ là người tấn công, người tán đổ bạn; và tán đổ xong thì quay ra vô tâm. Nhiều người như thế: họ coi bạn như một chiến tích, và khi đã đạt được bạn, đã vượt qua được thử thách đó, thì họ đi tìm thử thách khác để đương đầu thay vì trân trọng bạn. Họ hơi quá chủ quan, cho rằng thế nào bạn cũng không bỏ trước, nên nhiều lúc họ đối xử với bạn không ra gì và không trân trọng bạn đủ.'],
    ['love', 'Cãi nhau, cần giải quyết thế nào?',
     'Chưa thấy chuyện chia tay, nhưng có vẻ như cả hai bạn đang chủ quan trong mối quan hệ, hoặc cả hai đều quá kiêu căng và tự đắc: "tao đúng, mày sai, tao chẳng việc gì phải cúi đầu xin lỗi, mày mới là người phải xin lỗi tao". Cả hai cùng mang năng lượng ấy thì cãi mãi không đến hồi kết. Trong khi phải nhận ra rằng mọi mối quan hệ — yêu đương, bạn bè hay đối tác làm ăn — đều được xây dựng trên sự thỏa hiệp, đôi bên cùng có lợi. Trong tình cảm mà ra Chín Cốc thì nên rút thêm: một mình lá này khó nói, vì ý nghĩa của nó không rõ ràng tích cực hẳn hay tiêu cực hẳn.'],
    ['career', 'Sắp tới tìm được công việc ưng ý không?',
     'Khó tìm được, vì có thể bạn quá chủ quan, quá tự đắc với khả năng của mình — nghĩ rằng mình giỏi hơn thực chất năng lực. Bạn cho rằng "với học vấn và bằng cấp của tôi thì tôi phải xin được việc ngon hơn, lương cao hơn, trợ lý tổng giám đốc chẳng hạn", mà không nhận ra rằng thật ra bạn chỉ là sinh viên mới ra trường và hoàn toàn chưa có kinh nghiệm làm việc. Một trong những lý do bạn chưa tìm được việc là bạn đang đánh giá bản thân hơi cao.'],
    ['career', 'Thời gian tới công việc cần lưu ý điều gì?',
     'Hiện giờ bạn làm tốt và thời gian tới vẫn làm tốt, nhưng kiểu của bạn là "tôi giỏi hơn người, chẳng việc gì tôi phải học hỏi thêm, kiến thức mới là thừa thãi". Người Chín Cốc có thể giỏi thật — đạt được Chín Cốc không phải là kém. Nhưng cần cù, chăm chỉ và khiêm tốn thì không bao giờ là thừa. Hôm nay có thể họ giỏi và có thành tích, nhưng điều đó không có nghĩa là ngày mai không xuất hiện người giỏi hơn. Người này nếu học được cách khiêm tốn thì sẽ hoàn hảo — giỏi, nhưng lại thiếu khiêm tốn.']
  ],
  'pentacles-9': [
    ['other', 'Từ khóa của lá này là gì?',
     'Tận hưởng cuộc sống, đặc biệt là ở khía cạnh vật chất — vì dù sao Tiền cũng là năng lượng của vật chất. Việc tận hưởng cuộc sống theo hướng vật chất là tốt hay không tốt thì phụ thuộc vào chủ quan của mỗi người.'],
    ['love', 'Miêu tả tính cách một người?',
     'Một người thích tận hưởng sự xa hoa của cuộc sống. Không nhất thiết phải giàu, không nhất thiết phải mua đồ hiệu hay ăn uống đắt đỏ — đơn giản là họ thích cái cảm giác được tận hưởng vật chất. Đôi khi họ mua quần áo mà mỗi món chỉ vài chục nghìn, một trăm nghìn thôi, nhưng họ thích cảm giác xung quanh mình được vây quanh bởi năng lượng của vật chất. Và người Chín Tiền không phải lúc nào cũng đào mỏ — họ sẵn sàng làm việc chăm chỉ để mua đồ cho bản thân. Có người thỏa mãn với kiến thức, có người thỏa mãn với yếu tố tinh thần, có người thì thích thiên về vật chất như thế này; mỗi người một cách sống, ta không phán xét.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Hơi khó, vì với lá này thì người bạn đang hỏi đến yêu bản thân họ và yêu cái thế giới xung quanh họ nhiều hơn là yêu người khác — Chín Tiền có năng lượng hướng về chủ thể hơn là hướng ra ngoài. Nhìn hình ảnh cũng thấy: cô gái đang tận hưởng vật chất, nhưng tận hưởng một mình. Trong tình cảm có thể có yếu tố ích kỷ ở đây, hoặc họ không thích chia sẻ những suy nghĩ và tâm tư của mình với người yêu. Cũng có thể họ khá ki bo trong tình yêu: chỉ muốn nhận, chỉ muốn được tặng quà, mà không muốn trao đi tình cảm thật của mình.'],
    ['love', 'Cãi nhau, có phải chia tay không?',
     'Một trong hai bạn, hoặc cả hai, có xu hướng hướng về bản thân nhiều. Chín Tiền trong trải bài tài chính và công việc thì tốt, nhưng trong tình cảm thì chưa chắc — vì tình cảm cần sự thỏa hiệp từ hai bên, trong khi người Chín Tiền chỉ thích sống cuộc sống vui vẻ của chính mình. Nên lý do hai người cãi nhau có thể là sự ích kỷ của một trong hai hoặc của cả hai. Và kiểu người này có thể là chưa sẵn sàng cho chuyện tình cảm, không hợp với những mối quan hệ cam kết.'],
    ['career', 'Sắp tới tìm được công việc mới không?',
     'Có, và công việc này cho bạn điều kiện tài chính đủ để ăn ngon mặc đẹp.'],
    ['career', 'Cụ thể là bao nhiêu tiền?',
     'Tarot sẽ không nói ra một con số cụ thể — nó phụ thuộc vào chính người hỏi. Nếu với người hỏi thì hai mươi triệu là đủ để ăn ngon mặc đẹp và sống sung túc, thì lương sẽ là hai mươi triệu; còn nếu với họ phải năm mươi triệu mới đủ thì bạn sẽ nhận được năm mươi triệu. Khi hỏi lương cao hay thấp thì cao thấp là dựa theo tiêu chí của chính người hỏi.'],
    ['career', 'Thời gian tới công việc thế nào?',
     'Sắp tới công việc vẫn rất tốt. Công việc và tiền bạc phải ổn định, rủng rỉnh thì mới khiến bạn tận hưởng cuộc sống được như thế này. Lưu ý: nếu bạn nhiều tiền nhưng không thích công việc thì bạn cũng chẳng tận hưởng được số tiền ấy — có những người làm mười sáu tiếng một ngày, rất nhiều tiền nhưng không còn thời gian để tiêu, thì họ cũng không thể có được năng lượng Chín Tiền này.']
  ]
});

Object.assign(ASK.en, {
  'wands-9': [
    ['love', 'Describe this person\'s character',
     'Someone very enduring, hard to subdue. They do not yield to adversity or to a challenge, and they are not the sort who gives up. Something curious the reader has met in practice: drawing this card to describe a person, that person did prove diligent and persistent and harder-working than most — and the joke of it was that they also met more difficulty than most. Their road is rougher than other people\'s. They will succeed, with a nature like that; and looking back, they will have been through more than others have.'],
    ['love', 'What are their feelings toward me?',
     'Very hard to confirm either way; draw more. With this card alone: they may have feelings, and either they are facing a good many other challenges in life and work at the moment, or they have already faced a great many in love — cheated on repeatedly, abandoned repeatedly. Either way, their past and their circumstances are obstacles standing in the way of the two of you.'],
    ['love', 'Why are they telling me to wait?',
     'They may like you and still say "give me a little time", and you find yourself wondering why. The reason is that they are up against a good deal of other difficulty in life, or that having been betrayed often in the past they want to love slowly — slowly and surely. The querent may need to learn more sympathy, more understanding, more patience with this person. Whether you are all right with that slower tempo in love is your own call.'],
    ['love', 'We are arguing — should we break up?',
     'Your relationship may have started out harder than most: differences of language, of region, of religion, or the two families disliking each other from the beginning. Whether you can get through it together, or let the difficulty defeat you, is the open question — and it is yours. But hold on to this card\'s keyword: do not give up.'],
    ['career', 'I am job-hunting — how will it go?',
     'You may have been turned down a great many times already. Keep going, and do not give up — it may only be a hard season. The Nine of Wands says you are on the right road; the road is simply rougher than most.'],
    ['career', 'Anything to watch at work?',
     'Your mouth says nothing is wrong, and the work has a quality of occasional irritations and problems needing handling. The difficulties the Nine of Wands brings are not sweeping: they are a stone that makes you stop, lift it aside, and go on — not a boulder out of the sky, and not a pebble either. It causes trouble without being large enough to block your road. Only, with one stone after another, you get discouraged. Do not quit or start thinking about moving on because of it: the same stone you solved last time you can solve again.'],
    ['other', 'What is the lesson of this card?',
     'Persistence and patience. Say getting past ten stones means success — how many people have the patience for all ten? Some give up at the first, and some give up at the ninth. That is the deeper message of the Nine of Wands.']
  ],
  'swords-9': [
    ['love', 'Describe this person\'s character',
     'Someone carrying this state of mind: nobody cares for me, everyone is against me, I am alone against this whole world, I am wretched, I am powerless. That is Nine of Swords energy.'],
    ['love', 'Should I love someone carrying this card?',
     'Weigh it carefully. This person\'s problem is not something that can be solved from one side, and not something anyone can arrive and heal for them. If you believe you can heal them, you are mistaken — the problem is theirs to solve. To an ordinary client the reader would put it that way; if it were her own sister or her own friend, she would say it outright: do not love this person.'],
    ['love', 'We argue a lot — should we break up?',
     'What began as an Eight of Swords has gradually been blown up out of all proportion. Even the Nine of Swords is a Minor, and a Minor means the querent is entirely able to solve it themselves — a nine or ten is harder than a three or four, certainly, but not impossible. Your characters may be sharply opposed; but instead of finding common ground you each demand the other change. One is jealous, one would rather be out with friends than with their partner — and it becomes a closed circle. Instead of compromising it is "stop going out with your friends, I forbid it" against "you have to change, stop being jealous" — and no common ground is ever found and it grows more toxic.'],
    ['love', 'So what should I do?',
     'Be more level-headed, and try to compromise toward common ground. If only you compromise, of course, nothing comes of it. See what happens: compromise first, and if they answer it, continue. But if you have climbed down and compromised and they do not value that effort, you have every right to leave. And in any case a relationship at the Nine of Swords level is already fairly toxic and fairly exhausting.'],
    ['career', 'Out of work a long time — will I find something?',
     'You are quite pessimistic about the search. You may have been turned down a few times, and you see the whole thing negatively — before the interview has even happened you are thinking "I will probably fail." You carry that pessimism in with you and the interviewer sees it at once: they do not want to hire someone that gloomy. The card says change your state of mind first. Your frequency is quite low, and a low frequency draws low things: failure, separation, distress. Be more optimistic, and look at what is bright in your life.'],
    ['career', 'Anything to watch at work?',
     'You may be thoroughly sick of this job, and because your outlook is deeply pessimistic you keep running into trouble there: scolded by your manager now and then, spoken to by colleagues now and then. And then it is "why do my colleagues and my manager keep at me, does the whole world hate me?" — when it may simply be that you did it wrong, or badly, or carelessly. More such events are coming. If it is the nature of the job and you cannot bear the pressure, then leave. If it is your own error, then find a way to put it right.'],
    ['other', 'What is it like to read for someone carrying this card?',
     'It will be a fairly exhausting session. A reader is like a sponge taking up other people\'s energy, the good and the bad — so afterwards you will feel tired and find your own mood dragged down with theirs. This card or the Ten of Swords makes for a tiring reading on both sides.']
  ],
  'cups-9': [
    ['other', 'What is this card\'s keyword?',
     'Satisfaction — contentment with what you have. The good sense of it: you are satisfied, and being satisfied with a set of conditions means those conditions must be good. The negative side is complacency. This is still the Nine of Cups and not the Ten, not yet completeness — and this person is already satisfied. Which means there are things you could still improve, and you are thinking "why improve, this is enough" — when trying harder would make the result better still.'],
    ['other', 'An example to make it clear?',
     'You ask how your mock exam went and draw the Nine of Cups: the result must be good for you to feel satisfied. But a good mock does not mean the real score will match it. The Nine of Cups says the mock went well, and that the good result may make you complacent — may have you thinking "I scored high, I need not revise so hard, that is enough" — rather like the Six of Wands in its self-satisfaction.'],
    ['love', 'Describe this person\'s character',
     'Someone bringing an optimistic, life-loving energy, though at times it may run to excess, or they may be somewhat arrogant with it. Look at the image — the man with folded arms and the triumphant smile — and you have described him.'],
    ['love', 'What are their feelings toward me?',
     'Possibly real, and the way they treat you is as though they were certain you would never leave them first — quite triumphant about the whole relationship. They may have been the pursuer, the one who won you over; and having won, they turn indifferent. Many people are like this: they treat you as a trophy, and once they have you and the challenge is behind them they go looking for the next one instead of valuing you. They are rather too complacent, sure you will never be the one to go, and so at times they treat you poorly and do not value you enough.'],
    ['love', 'We are arguing — how do we fix it?',
     'Nothing here says break up, but it looks as though both of you are complacent about the relationship, or both too arrogant and self-satisfied: "I am right and you are wrong, I have no reason to bow my head and apologise; you are the one who owes me the apology." With both of you carrying that, the argument never ends — while any relationship, romantic or friendly or commercial, is built on compromise and on both sides gaining. In a love spread the Nine of Cups is worth drawing more on: alone it says little, because its meaning is neither clearly positive nor clearly negative.'],
    ['career', 'Will I find the job I want soon?',
     'Hard to, because you may be too complacent and too pleased with your own ability — believing yourself better than you actually are. You think "with my education and my qualifications I should get something better, better paid, assistant to the managing director" — without noticing that you are in fact a new graduate with no work experience at all. One reason nothing has landed is that you are rating yourself rather high.'],
    ['career', 'Anything to watch at work?',
     'You are doing well now and will keep doing well in the near term, but your attitude is "I am better than the rest, why should I learn anything more, new knowledge is surplus to requirements." The Nine of Cups person may genuinely be good — reaching the Nine of Cups is no small thing. But diligence, effort and humility are never wasted. Today they may be good and have the achievements; that does not mean nobody better appears tomorrow. Learn humility and this person would be perfect: able, and short only on that.']
  ],
  'pentacles-9': [
    ['other', 'What is this card\'s keyword?',
     'Enjoying life, and particularly its material side — Pentacles being the energy of the material. Whether enjoying life that way is good or not depends entirely on the person judging it.'],
    ['love', 'Describe this person\'s character',
     'Someone who likes the luxury in life. Not necessarily rich, not necessarily buying labels or eating expensively — they simply like the feeling of enjoying material things. Sometimes the clothes they buy cost very little, and what they like is the sense of being surrounded by that energy. And the Nine of Pentacles person is not always digging for gold — they will work hard to buy things for themselves. Some people are satisfied by knowledge, some by the spiritual, some by having people they love around them, and some lean toward the material like this. Everyone lives differently, and we do not judge it.'],
    ['love', 'What are their feelings toward me?',
     'Rather difficult, because with this card the person you are asking about loves themselves and the world around them more than they love anyone else — the Nine of Pentacles turns toward the self rather than outward. The picture says it: she is enjoying the material, and enjoying it alone. In love there may be an element of selfishness here, or an unwillingness to share what they think and feel with a partner. They may also be quite tight in love: wanting to receive, wanting the gifts, without wanting to hand over any real feeling of their own.'],
    ['love', 'We are arguing — should we break up?',
     'One of you, or both, tends toward the self. The Nine of Pentacles is good in a money or work spread, and in love far from certain — because love takes compromise on both sides, and the Nine of Pentacles person only wants to live their own pleasant life. So the reason you argue may be selfishness, on one side or both. And this type may not be ready for a relationship at all, and does not suit anything committed.'],
    ['career', 'Will I find new work soon?',
     'Yes, and it will give you the means to eat well and dress well.'],
    ['career', 'How much money exactly?',
     'Tarot will not give you a figure — it depends on the querent. If twenty million a month is enough for this person to eat well, dress well and live comfortably, then the salary is twenty million; if for them it takes fifty, then fifty is what arrives. Asked whether pay is high or low, high and low are measured by the querent\'s own standard.'],
    ['career', 'How will work go from here?',
     'It will stay very good. Work and money have to be steady and comfortable for you to enjoy life this way. Note the corollary: plenty of money and a job you dislike means you cannot enjoy that money at all — people working sixteen-hour days earn a great deal and have no time left to spend it, and they cannot hold this Nine of Pentacles energy either.']
  ]
});

/* batch 18 - the four Tens (completes the pip cards) */
Object.assign(KW.vi, {
  'wands-10': { pos: ['nhìn ra được mình đang ở trong mớ bòng bong là bước đầu để gỡ nó'],
                neg: ['ôm đồm','bận rộn theo kiểu lắt nhắt','nhiều đầu việc không liên quan đến nhau ập đến cùng lúc','không biết nói không','thiếu quyết đoán nên không biết ưu tiên cái gì trước'] },
  'swords-10': { pos: ['số 10 vẫn là Ẩn Phụ — vấn đề vẫn do ta tích lũy mà ra, nên vẫn nằm trong tay ta'],
                 neg: ['đau đớn','khổ sở','tận cùng của nỗi đau','sướng khổ tại tâm','tiêu cực và lan tỏa tiêu cực sang người khác'] },
  'cups-10': { pos: ['hạnh phúc','đầy đủ','trọn vẹn','hân hoan, ăn mừng','kết thúc một chu kỳ trong bình an','lan tỏa năng lượng tích cực sang người khác','tần số cao'] },
  'pentacles-10': { pos: ['sung túc','đầy đủ','ổn định','di sản gia đình','hào phóng nhưng vẫn giữ được lý trí'],
                    neg: ['hơi gò bó, hơi cứng so với Mười Cốc','áp lực từ gia đình','nhiều tiền quá nên không dám rời đi để theo đuổi thứ mạo hiểm hơn'] }
});

Object.assign(KW.en, {
  'wands-10': { pos: ['seeing that you are in a tangle is the first step to undoing it'],
                neg: ['taking on far too much','busy with a scatter of small things','many unrelated tasks arriving at once','unable to say no','not decisive enough to know what comes first'] },
  'swords-10': { pos: ['a ten is still a Minor — the problem is what you accumulated, so it remains in your hands'],
                 neg: ['pain','suffering','the very end of pain','the joy and the misery are both made in the mind','negative, and spreading that negativity to others'] },
  'cups-10': { pos: ['happiness','fullness','completeness','joy and celebration','a cycle closing in peace','spreading positive energy to others','a high frequency'] },
  'pentacles-10': { pos: ['abundance','sufficiency','stability','family legacy','generous while keeping their reason'],
                    neg: ['a little constrained, a little stiff beside the Ten of Cups','pressure from the family','so much money that you dare not leave it for anything riskier'] }
});

Object.assign(ASK.vi, {
  'wands-10': [
    ['love', 'Miêu tả tính cách một người?',
     'Người hay ôm đồm. Có thể họ rất cả nể, không biết nói không, không biết từ chối khi người khác nhờ. Hoặc họ thiếu quyết đoán — người quyết đoán thì biết ưu tiên cái gì làm trước, cái gì làm sau, còn người này thiếu đúng cái đó. Thành ra cuộc sống của họ cứ rối như một mớ bòng bong. Mà rối là do chính họ, do họ tự ôm việc vào người chứ không phải do người khác. Nếu không thay đổi cái xu hướng này thì thời gian tới họ sẽ stress, và dự án của họ sẽ chẳng ra đâu vào đâu.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Có thể họ có thích bạn, có tình cảm với bạn thật. Nhưng hiện giờ cuộc sống của họ đang là một mớ bòng bong, nên nếu đến với họ thì bạn có thể chỉ là một cây gậy trong mười cây gậy của họ mà thôi. Ngoài cây gậy tình cảm ra, họ còn gậy công việc, gậy tài chính, gậy bạn bè, gậy đồng nghiệp, gậy sếp, gậy gia đình, gậy sở thích, gậy học thêm và rất nhiều gậy nữa. Nếu bạn chịu được việc mình chỉ là một phần nhỏ trong những mối quan tâm của họ thì ok; còn không thì hãy nói trước với họ rằng em cần chiếm đến một nửa cuộc sống của anh — anh chịu được thì tiến đến, không thì thôi.'],
    ['love', 'Cãi nhau, có nên chia tay không?',
     'Có thể cả hai bạn đang mang năng lượng Mười Gậy: cả hai đều quá bận, quên mất nhau, không dành thời gian cho nhau. Khi bạn quá bận rộn với những vấn đề khác thì đôi khi nhìn mặt người yêu bạn cũng thấy cáu — chúng ta có xu hướng ra ngoài xã hội thì cười nói, còn về nhà thì gắt gỏng với người thân và với những người thân thiết nhất. Đôi khi sự bận rộn ấy là không thể tránh khỏi: mùa thi cuối kỳ, làm hồ sơ đi du học.'],
    ['love', 'Đang trong giai đoạn bận như thế thì làm sao?',
     'Hãy nói và giao tiếp thẳng thắn. Nếu cả ngày bạn đã mệt lắm rồi, mười giờ tối mới về đến nhà mà người yêu vẫn bắt gọi điện hai tiếng trong khi bạn chỉ muốn tắm rửa rồi đi ngủ, thì hãy nói: "anh mệt lắm, cả ngày hôm nay phải đương đầu với mười cây gậy này; em thông cảm cho anh, thay vì gọi hai tiếng thì mình nhìn mặt nhau hai mươi phút thôi được không?" Có những thời điểm bạn buộc phải chịu Mười Gậy thì chịu, nhưng hết mùa bận rồi thì bạn phải tự sắp xếp và cân bằng lại cuộc sống. Còn nếu để tình trạng Mười Gậy kéo dài triền miên thì đó là lỗi của bạn.'],
    ['career', 'Sắp tới tìm được công việc như ý không?',
     'Khó. Ngoài việc tìm việc ra, bạn còn đang lo rất nhiều thứ khác: vừa muốn tìm việc, vừa muốn đi học, vừa muốn lấy thêm một bằng ngoại ngữ hay một chứng chỉ nào đó. Năng lượng của bạn đang bị phân ra nhiều hướng nên không thể tập trung cho việc tìm việc. Kết quả là: gửi CV xong, công ty hẹn chín giờ phỏng vấn thì bạn ngủ quên đến mười giờ mới tới; và khi đến thì lại không tìm hiểu kỹ về công ty, người ta hỏi "em biết gì về công ty chị" thì em không tìm hiểu. Năng lượng bị phân tán thì chẳng cái gì ra hồn cả.'],
    ['career', 'Thời gian tới công việc có gì không?',
     'Đơn giản thôi: bạn sẽ rất bận. Vừa bận dự án của mình, sếp lại giao thêm mấy dự án cùng lúc, đồng thời sếp còn nhờ làm việc riêng, rồi đồng nghiệp thì "em ơi làm hộ chị nhé", "em ơi làm hộ anh nhé, anh phải đi đón con". Bận theo đúng kiểu Mười Gậy: nhiều đầu việc không liên quan đến nhau đến cùng một lúc, và bạn gần như làm không xuể — rơi hết, không còn cầm được cái nào trên tay.'],
    ['other', 'Vậy phải làm gì?',
     'Nói lá này là tiêu cực thì cũng đúng, nhưng nó chưa đến mức khiến bạn gục ngã. Điều quan trọng là bạn phải nhìn ra được rằng mình đang ở trong một mớ bòng bong, rồi tìm cách sắp xếp và ra thứ tự ưu tiên: cái gì làm trước, cái gì làm sau. Còn ưu tiên cái nào trước thì đó là kỹ năng cá nhân của từng người, chứ không phải thứ bạn đi hỏi người đọc bài.']
  ],
  'swords-10': [
    ['other', 'Từ khóa của lá này là gì?',
     'Đau đớn và khổ sở — mà là đau đớn bởi chính những suy nghĩ tiêu cực của mình, bởi chính sự khổ tâm khổ não do mình tự nghĩ ra. Sướng khổ tại tâm. Lá này giống như nỗi đau không còn gì để mất, đã đạt đến tận cùng. Và dù số 10 có cường độ gần ngang với các lá Ẩn Chính, nó vẫn là Ẩn Phụ — nghĩa là vấn đề vẫn chủ yếu do ta mà ra, chẳng qua là do ta tích lũy lâu ngày.'],
    ['other', 'Có người bảo lá này vẫn có mặt tích cực?',
     'Một số tài liệu nói mặt tích cực là ở Mười Kiếm thì không còn gì để mất nữa, và phía xa vẫn còn những tia nắng — mây đen đang tan và ánh nắng đang từ từ xuất hiện để ta vực dậy. Nhưng cá nhân Người đọc bài thấy: nếu diễn giải theo hướng "sau cơn mưa trời lại sáng" thì người hỏi sẽ nghĩ rằng mình chịu khổ một thời gian rồi tự dưng trời sáng, mọi thứ lại đâu vào đấy — và họ sẽ không bao giờ nhận ra là do chính họ. Nên vấn đề của Mười Kiếm là bạn phải tìm về bên trong: tại sao mình lại tự lấy những thanh kiếm này đâm vào mình, tại sao mình lại để chuyện đến mức này, và nếu gặp chuyện tương tự một lần nữa thì mình có thể làm gì để tránh.'],
    ['love', 'Miêu tả tính cách một người?',
     'Một người cực kỳ tiêu cực, và họ còn lan tỏa năng lượng tiêu cực đó sang người khác. Có những người gặp nhiều chuyện không may hơn người khác thật, nhưng thay vì giữ thái độ tích cực thì họ lại càng ngày càng tiêu cực hơn — thành một vòng luẩn quẩn: càng tiêu cực thì lại càng thêm điều tiêu cực. Ví dụ bạn bị bố mẹ mắng, thế là đến lớp bạn bực mình và cáu gắt với giáo viên và bạn bè; bạn bè bị cáu gắt thì ghét bạn và nói xấu bạn, giáo viên thì cho bạn điểm kém — và bạn lại càng thấy "tại sao gia đình đối xử với tôi như thế, giáo viên chẳng hiểu cho tôi, bạn bè thì nói xấu bắt nạt, sao tôi khổ thế" — mà không hề nhận ra rằng chính thái độ của bạn với họ đã tệ trước.'],
    ['other', 'Nói chuyện với người mang lá này thì thế nào?',
     'Bạn sẽ thấy mệt, kể cả khi bạn không phải người nhạy cảm về năng lượng. Người đọc bài hay gọi những người này là quỷ hút năng lượng: chúng ta có ma cà rồng hút máu thì cũng có ma cà rồng hút năng lượng. Họ luôn than thở và cằn nhằn hết chuyện này đến chuyện khác mà không chịu tự nhìn nhận vấn đề và tự đứng lên giải quyết; lần thứ hai gặp họ thì họ lại tiếp tục than thở về đúng những vấn đề ấy. Họ không ngồi lắng nghe bạn — họ chỉ muốn trút lên đầu bạn những điều tiêu cực trong đời họ.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Người này có cách nhìn rất bi quan về chuyện tình yêu. Dù có thể họ thích bạn, ngay từ đầu họ đã nghĩ "con bé này sẽ cắm sừng mình đây", "nó chẳng muốn tìm hiểu mình đâu, nó chỉ muốn lợi dụng mình thôi" — trong khi rõ ràng hai người mới đang tìm hiểu nhau bình thường và bạn chẳng có ý gì như thế.'],
    ['love', 'Tôi có nên giúp người mang năng lượng này không?',
     'Lời khuyên là tránh xa và giữ khoảng cách. Bạn có thể nghĩ "nhưng đây là bạn của mình, mình phải làm gì để giúp họ". Nhưng người Mười Kiếm — đã đi qua Tám Kiếm và Chín Kiếm rồi — thường từ chối sự giúp đỡ của người khác, từ chối thay đổi, và chỉ muốn lún sâu vào sự tiêu cực đó. Nếu bạn muốn giúp thì hãy giúp những người xòe tay ra để nhận, chứ không phải người nắm tay lại và không muốn nhận. Bản thân họ có thể nghĩ "không phải lỗi của tôi, lỗi đến từ bên ngoài, số tôi khổ".'],
    ['other', 'Vì sao Người đọc bài không nhận xem cho những người này?',
     'Những bạn như thế đi xem trải bài, khi được khuyên những điều tích cực, khuyên rằng phải thay đổi từ bên trong, thì thường không thỏa mãn với câu trả lời đó. Nhưng nếu nói với họ rằng "cả đời bạn sẽ không thay đổi được đâu, sẽ chỉ khổ mãi như thế này thôi, có cố mấy cũng chẳng khá lên được vì đây là nghiệp rồi" thì họ lại thấy thoải mái và thỏa mãn. Vì có thể họ đang cố tìm một lý do để không phải cố gắng nữa: "mình sinh ra đã vậy rồi, cố mấy cũng chả khá lên được, thôi mình chấp nhận."'],
    ['love', 'Cãi nhau nhiều, có nên chia tay không?',
     'Một trong hai người, hoặc cả hai, đang mang năng lượng Mười Kiếm. Một mối quan hệ mang năng lượng này thì rất độc hại, và có thể lời khuyên sẽ là chia tay — độc hại và liên tục làm khổ nhau.'],
    ['career', 'Tìm được việc ưng ý không?',
     'Hãy thay đổi năng lượng của bạn trước đã, rồi hãy đi tìm việc mới. Khi bạn đi xin việc mà mang bộ mặt u ám đưa đám thì người khác cảm nhận được ngay — ai nhạy cảm thì nhìn mặt là biết. Có ai muốn nhận một người như thế? Nên bạn hãy làm việc với vấn đề tinh thần và tâm lý của mình trước, tĩnh tâm một hai tháng rồi hãy đi tìm việc sau.'],
    ['career', 'Thời gian tới công việc có biến cố gì không?',
     'Công việc của bạn sắp tới sẽ rất căng thẳng và rất độc hại. Riêng lá này thì chưa nói được là độc hại vì cái gì — có thể là đồng nghiệp độc hại, sếp độc hại, hoặc khách hàng; nên rút thêm, và rút thêm cả lá lời khuyên để xem làm thế nào tránh hoặc giảm nhẹ. Chỉ biết là ra lá này thì đến người đọc bài cũng thấy mệt: diễn giải những điều tiêu cực thì chính mình cũng mệt mỏi theo. Đây là một trong những lá mà Người đọc bài ước là mình không phải rút.']
  ],
  'cups-10': [
    ['other', 'Từ khóa của lá này là gì?',
     'Hạnh phúc, hân hoan, ăn mừng, sự trọn vẹn, kết thúc một chu kỳ. Hình ảnh là một gia đình — hai vợ chồng và hai đứa trẻ đang hân hoan, hai đứa trẻ nắm tay nhau nhảy múa, trên bầu trời là mười chiếc cốc và cầu vồng. Lá này không có nghĩa tiêu cực nào cả. Cảm xúc của ta có thể đã lên xuống thất thường từ 1 đến 9, và cuối cùng ta tìm được bến đỗ của hạnh phúc — tâm lý và tinh thần cũng được ổn định, được cân bằng.'],
    ['other', 'Lá số 10 mạnh đến đâu?',
     'Nếu nói về lá Ẩn Phụ nào có năng lượng mạnh nhất, mãnh liệt nhất, cường độ gần với Ẩn Chính nhất, thì đó chính là những lá số 10. Và trong Ẩn Phụ thì bộ Hoàng gia gần như là một bộ khác: Ẩn Phụ chia làm hai phần, phần từ 1 đến 10 và phần 16 lá Hoàng gia; nên lá số 10 chính là kết thúc của chu kỳ mười lá đó.'],
    ['love', 'Miêu tả tính cách một người?',
     'Chắc chắn là năng lượng tích cực. Và kiểu người này không chỉ mang năng lượng tích cực mà còn có khả năng lan tỏa nó sang người khác. Bạn biết có những người mà khi đến chơi nhà họ, hoặc trong một buổi tiệc, họ gần như luôn là tâm điểm — không phải vì họ thích được chú ý hay ăn diện thể hiện, mà vì họ rất vui vẻ, luôn cười, và có một năng lượng ấm áp khiến mọi người muốn lại gần. Ấm áp, EQ cao, biết cách nói chuyện khiến những người xung quanh thấy dễ chịu.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Rất tích cực. Có tình cảm, và đó là một thứ tình cảm rất lãng mạn — bản thân họ cũng có thể là người lãng mạn. Ra Mười Cốc thì cảm nhận được ngay rằng người này cũng như mối quan hệ này là của những người mang năng lượng tần số cao. Nên nếu bạn đang có được tình cảm từ một người Mười Cốc thì hãy cố giữ lấy họ, đừng để vuột mất. Không chỉ là họ thương bạn, họ còn muốn lâu dài với bạn — nhưng không theo kiểu bắt buộc phải lâu dài, phải kết hôn; họ muốn lâu dài mà vẫn để mọi thứ thuận theo tự nhiên.'],
    ['love', 'Cãi nhau, xin lời khuyên?',
     'Chuyện xung đột mà bạn đang hỏi có thể chỉ là chuyện bé, bởi tổng quan năng lượng tình cảm của hai người vẫn rất đẹp. Đừng để cái chuyện cãi nhau bé xíu này ảnh hưởng đến mối quan hệ. Nói thẳng ra: nếu năng lượng của hai bạn là Mười Cốc mà chỉ vì một trận cãi nhau bé mà đi xem bài thì hơi phí tiền — hoặc là bạn đi xem vì công việc rồi tiện thể hỏi luôn chuyện tình cảm, chứ chuyện tình cảm không có gì to tát khi ra Mười Cốc.'],
    ['career', 'Thời gian tới tìm được công việc mới không?',
     'Có. Tuy nhiên nhắc lại một lần nữa: trong trải bài về công việc thì những lá Tiền được kỳ vọng hơn, vì bạn đi làm là để kiếm tiền. Với Mười Cốc thì bạn tìm được công việc mới và công việc đó bạn thích, đúng với sở thích và nguyện vọng của bạn. Về mặt cảm xúc thì ổn, nhưng lá này chưa cho biết bạn có kiếm được nhiều tiền từ công việc đó hay không, cũng như khả năng thăng tiến ra sao. Muốn biết thì rút thêm — Người đọc bài có thể vừa diễn giải vừa xin thêm một lá để xem khả năng thăng tiến, thêm một lá nữa để xem khả năng tài chính. Vì có công việc bạn thích mà tiền ít và thăng tiến thấp, cũng có công việc bạn không thích mà tiền cao và thăng tiến cũng cao. Với Mười Cốc thì tính chất công việc là bạn thích nó, và môi trường làm việc — sếp, đồng nghiệp — cũng rất tốt. Nhưng không đồng nghĩa với rất nhiều tiền.'],
    ['career', 'Thời gian tới công việc có gì cần lưu ý?',
     'Chẳng có gì cần lưu ý cả. Năng lượng Mười Cốc là năng lượng xuyên suốt.']
  ],
  'pentacles-10': [
    ['other', 'Từ khóa của lá này là gì?',
     'Sung túc, đầy đủ. Hình ảnh gợi đến một gia đình ba thế hệ — ông bà, cha mẹ, con cái và cả vật nuôi — trong một căn nhà ấm cúng, và những người này ăn mặc đẹp đẽ chứ không rách rưới gì cả. Nhìn chung mang nghĩa tích cực nhiều hơn tiêu cực.'],
    ['other', 'Vì sao nó khác Mười Cốc?',
     'Theo cảm nhận và kinh nghiệm riêng của người đọc bài: Mười Tiền không nhẹ nhõm như Mười Cốc. Mười Cốc là sung túc đầy đủ; còn Mười Tiền thì hơi gò bó, hơi cứng — như kiểu bạn sinh ra trong một gia đình đầy đủ ông bà bố mẹ, một gia đình khá truyền thống, gia giáo, tương đối dư giả. Sinh ra trong gia đình như thế thì đôi khi bạn sẽ thấy áp lực: gia đình muốn bạn làm cái này, muốn bạn làm cái kia. Bạn đang ở trong một tình huống rất nhiều tiền mà lại cảm thấy bị gò bó, và bạn không thể cứ thế mà bỏ cơ hội vật chất này để đi theo tiếng gọi con tim được.'],
    ['love', 'Miêu tả tính cách một người?',
     'Tương đối ổn định và thực tế — đây là năng lượng của Tiền nên phải thực tế và ổn định. Và họ không ki bo: họ nhiều tiền, hoặc đúng hơn là họ không cảm thấy thiếu, nên họ cũng sẵn sàng làm từ thiện hay tặng quà biếu xén cho người khác. Nhưng nếu họ giúp ai đó về mặt vật chất thì họ rất lý trí: "anh cần tôi giúp vì anh đang gặp khó khăn? Được, tôi giúp. Nhưng nếu anh muốn vay tiền tôi để đi ăn chơi thì không." Người Mười Tiền là như vậy: hào phóng, đầy đủ, tốt, nhưng vẫn giữ được lý trí của mình. Năng lượng của họ không hướng ngoại và vui vẻ hay cười như người Mười Cốc, nhưng nhìn chung vẫn là một loại năng lượng cao.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Tình cảm khá ổn định nhưng hơi lạnh lùng. Người này có thể muốn kết hôn với bạn, nhưng có thể là vì họ cảm thấy gia đình hai bên môn đăng hộ đối. Người kết hôn vì lý do Mười Tiền chưa chắc đã là đào mỏ — bản thân họ cũng chẳng nghèo, nhưng họ tìm kiếm sự giống nhau về xuất phát điểm, về hoàn cảnh sống, về gia đình. Bản thân họ đến từ một gia đình tốt và họ cũng tìm những người như thế; họ nhìn thấy điểm đó ở bạn và thích điều đó trước khi muốn tìm hiểu về con người và trái tim bạn. Điều đó không phải là xấu: người theo chủ nghĩa lãng mạn sẽ không thích, còn người theo chủ nghĩa hiện thực thì thấy ổn. Tốt hay xấu phụ thuộc vào đánh giá chủ quan của mỗi người.'],
    ['love', 'Vì sao chúng tôi cãi nhau?',
     'Riêng lá này trong tình cảm thì hơi khó nói, nên rút thêm — vì tình cảm liên quan đến Cốc, còn Tiền thì nói về công việc nhiều hơn. Nhưng nếu hỏi lý do cãi nhau mà ra Mười Tiền thì có thể là vấn đề gia đình: gia đình hai bên phản đối, có sự khác biệt trong hoàn cảnh gia đình, gia đình họ không thích gia đình bạn; những lý do liên quan đến gia đình, đến truyền thống, đến tôn giáo. Hoặc là lý do rất thực tế: hai người lấy nhau rồi nhưng không đủ tiền, hoặc đang yêu nhau mà cãi nhau về vấn đề tiền bạc.'],
    ['career', 'Tìm được công việc mới không?',
     'Không những tìm được mà còn là công việc nhiều tiền, mang lại cho bạn sự ổn định. Nhắc lại: khi hỏi lương cao hay thấp thì cao thấp là theo tiêu chuẩn của người hỏi chứ không phải của người đọc bài. Với Mười Tiền thì thu nhập không hẳn là cao vút, nhưng thuộc tầm cao, đủ để bạn sống thoải mái và còn một chút để tiết kiệm. Trong công việc này bạn có tiền và có khả năng thăng tiến về mặt vật chất. Còn bạn có thích công việc đó hay không, có muốn làm lâu dài hay không, thì lại là chuyện khác — nhiều tiền mà bạn không thích thì vẫn có thể xảy ra.'],
    ['career', 'Thời gian tới công việc có thay đổi gì không?',
     'Công việc của bạn hiện đang nhiều tiền; có thể bạn đang ở một vị trí lương cao, chức vụ cũng khá. Thời gian tới lương vẫn cao và chức vụ vẫn thế — gần như không có thay đổi, vì Mười Tiền mang tính ổn định rất cao. Nếu có thay đổi thì cũng sẽ thay đổi rất chậm, bởi năng lượng của Tiền là năng lượng ổn định. Mười Tiền là nhiều, nhưng không phải nhiều theo kiểu đột ngột — mà là nhiều được xây dựng qua cả một quá trình, và bây giờ là lúc hưởng thành quả.']
  ]
});

Object.assign(ASK.en, {
  'wands-10': [
    ['love', 'Describe this person\'s character',
     'Someone who takes on far too much. They may be too obliging to say no, unable to refuse when asked. Or they lack decisiveness — a decisive person knows what comes first and what comes after, and this person does not. So their life stays a tangle. And the tangle is of their own making: they gather the work in themselves, nobody hands it to them. If that tendency does not change, before long they will be under real strain and their projects will come to nothing.'],
    ['love', 'What are their feelings toward me?',
     'They may genuinely like you and genuinely feel something. But their life right now is a tangle, so if you go to them you may be only one wand out of their ten. Besides the wand that is you, they carry a work wand, a money wand, a friends wand, a colleagues wand, a manager wand, a family wand, a hobby wand, a further-study wand and a good many more. If you can live with being a small part of what they are carrying, fine; if not, say so up front — I need to be half your life; if you can manage that, come, and if not, then no.'],
    ['love', 'We are arguing — should we break up?',
     'Both of you may be carrying Ten of Wands energy: too busy, forgetting each other, making no time. When you are overloaded with everything else, the sight of your partner sometimes irritates you — we tend to be all smiles out in the world and short-tempered at home, with family and with the people closest to us. And sometimes the busyness genuinely cannot be avoided: exam season, or putting together papers to study abroad.'],
    ['love', 'What do I do during a stretch like that?',
     'Speak plainly. If you have been worn out all day and get home at ten while your partner still wants a two-hour call and all you want is to wash and sleep, then say so: "I am exhausted; I have been carrying these ten wands all day. Please bear with me — instead of two hours on the phone, could we see each other for twenty minutes?" There are seasons when you have to carry the ten wands, and you carry them. But once the season passes you have to rearrange things and get the balance back. Let a Ten of Wands state run on indefinitely and that is your own doing.'],
    ['career', 'Will I find the right job soon?',
     'Hard. Beyond the search you are carrying a great many other worries: wanting the job, wanting to study, wanting a language qualification, wanting some certificate. Your energy is split across too many directions to focus on the search. The result: you send the CV, they set an interview for nine, you oversleep and arrive at ten; and when you get there you have not looked into the company, so asked what you know about them, you have nothing. Scatter the energy and nothing gets done properly.'],
    ['career', 'Anything coming at work?',
     'Simply this: you will be extremely busy. Busy with your own project, and your manager hands you several more at once, and also has you running personal errands, and colleagues are asking you to cover for them. Busy in exactly the Ten of Wands way: many unrelated tasks arriving together, until you can barely manage — and you drop them all, holding none.'],
    ['other', 'So what should I do about it?',
     'Calling this card negative is fair enough, and it is not to the point of felling you. What matters is seeing that you are in a tangle at all, and then finding a way to arrange it and set the order: this first, that after. What to put first is a personal skill, not something to ask a reader about.']
  ],
  'swords-10': [
    ['other', 'What is this card\'s keyword?',
     'Pain and suffering — and pain caused by your own negative thinking, by anguish you have made yourself. The joy and the misery are both made in the mind. This card is pain with nothing left to lose, pain at its furthest point. And though a ten carries an intensity close to a Major, it is still a Minor — which means the problem still comes mainly from us; it is only that we accumulated it over a long time.'],
    ['other', 'Some sources say it has a positive side?',
     'Some say the positive is that at the Ten of Swords there is nothing left to lose, and that there is light on the horizon — the dark cloud breaking and the sun beginning to show so you can get up again. But the reader finds that reading it as "after the rain the sun returns" leaves the querent thinking they suffered for a while and then the sky cleared of its own accord and everything came right — and they never see that it was down to them. So the Ten of Swords problem is that you have to look inward: why did I take these swords and put them in myself, why did I let it reach this, and if something like it happens again what can I do differently?'],
    ['love', 'Describe this person\'s character',
     'Someone deeply negative, who also spreads that negativity to others. Some people genuinely do meet more misfortune than others, and instead of holding a positive attitude they grow more negative — a closed circle in which the more negative they are the more negative things arrive. Your parents scold you, so you arrive at school irritable and snap at your teacher and your classmates; they dislike you and talk about you, the teacher marks you down — and then it is "why does my family treat me like this, the teacher does not understand me, my classmates gossip and bully me, why am I so wretched" — without ever seeing that your own manner toward them came first.'],
    ['other', 'What is it like talking to someone carrying this card?',
     'You come away tired, even if you are not sensitive to energy at all. the reader calls them energy vampires: we have blood-drinking vampires and we have these. They complain and grumble about one thing after another without ever facing the problem or standing up to it; the second time you meet them they complain about the very same things. They do not sit and listen to you — they only want to unload what is dark in their own life onto you.'],
    ['love', 'What are their feelings toward me?',
     'This person sees love very pessimistically. Even where they like you, from the start they are thinking "she will cheat on me", "she does not want to know me, she only wants to use me" — when the two of you are plainly just getting to know each other and you have no such intention at all.'],
    ['love', 'Should I try to help someone with this energy?',
     'The advice is to keep your distance. You may think, but this is my friend, how can I help them? A Ten of Swords person — having already come through the Eight and the Nine — usually refuses help, refuses change, and only wants to sink further into it. If you want to help, help the people who open a hand to take it, not the one whose fist is closed and who does not want to be given anything. They may well believe it is not their fault, that the fault comes from outside, that they were fated to suffer.'],
    ['other', 'Why does the reader no longer read for them?',
     'People like this, coming for a reading and told the positive things — that they have to change from within — are usually not satisfied with that answer. But tell them "you will never change, you will be wretched like this all your life, however hard you try nothing will improve because this is your karma" and they feel comfortable and satisfied. Because they may be looking for a reason to stop trying: I was born this way, however hard I try nothing improves, so I accept it.'],
    ['love', 'We argue constantly — should we break up?',
     'One of you, or both, is carrying Ten of Swords energy. A relationship carrying it is deeply toxic, and the advice may well be to end it — toxic, and continually making each other suffer.'],
    ['career', 'Will I find the job I want?',
     'Change your own energy first, and then go looking. Turning up to apply with a funereal face, other people feel it immediately — anyone sensitive knows on sight. Who wants to hire that? So work on your mental and psychological state first, settle yourself for a month or two, and go job-hunting after.'],
    ['career', 'Any trouble at work coming?',
     'Your work ahead will be very tense and very toxic. This card alone will not say toxic because of what — colleagues, a manager, or clients; draw more, and draw an advice card too, for how to avoid it or soften it. All you know is that with this card even the reader comes away tired: interpreting the negatives wears you out as well. It is one of the cards the reader wishes she never had to draw.']
  ],
  'cups-10': [
    ['other', 'What is this card\'s keyword?',
     'Happiness, joy, celebration, completeness, a cycle closing. The image is a family — husband, wife and two children in delight, the children holding hands and dancing, and above them ten cups and a rainbow. The card has no negative sense at all. Your feelings may have swung up and down from one to nine, and at last you find the harbour of happiness — mind and spirit settled and balanced.'],
    ['other', 'How strong is a ten?',
     'If you ask which Minors carry the strongest, most intense energy, closest to a Major, it is the tens. And within the Minors the court cards are effectively a separate set: the Minors divide into the run from one to ten, and the sixteen courts. So the ten is the close of that ten-card cycle.'],
    ['love', 'Describe this person\'s character',
     'Positive energy without question. And this type does not only carry it — they can spread it. You know the people at whose house, or at a party, are almost always the centre of it — not because they want attention or dress to be noticed, but because they are cheerful and always laughing, and carry a warmth that makes people want to be near them. Warm, high in emotional intelligence, and knowing how to talk so that the people around them feel at ease.'],
    ['love', 'What are their feelings toward me?',
     'Very positive. The feeling is there, and it is a deeply romantic one — they may be a romantic themselves. With the Ten of Cups you sense at once that this person, and this relationship, belong to people carrying a high frequency. So if you have the affection of a Ten of Cups person, hold on to them; do not let this one slip away. They not only care for you, they want the long term — but not in a way that demands it, that insists on marriage. They want it and still let things run naturally.'],
    ['love', 'We are arguing — what is your advice?',
     'What you are asking about may be a small matter, because the overall energy between the two of you is still beautiful. Do not let a tiny argument touch the relationship. Frankly: if your energy is the Ten of Cups and you have come to a reader over one small row, it is rather a waste of money — or you came about work and asked about love while you were here, because with the Ten of Cups showing, the love side is not grave at all.'],
    ['career', 'Will I find new work soon?',
     'Yes. But once more: in a work spread, Pentacles are the more hoped-for cards, because you work to earn. With the Ten of Cups you find new work and it is work you like, matching your interests and what you wanted. Emotionally it is sound, and this card does not tell you whether you will earn well from it or what the prospects are. To know, draw more — the reader will sometimes ask the deck mid-reading for one more card on advancement and another on the money. Because there is work you love that pays little and leads nowhere, and work you dislike that pays well and leads upward. With the Ten of Cups the nature of the work is that you love it, and the workplace — manager, colleagues — may be very good too. It does not mean a great deal of money.'],
    ['career', 'Anything to watch at work?',
     'Nothing at all. The Ten of Cups energy runs right through it.']
  ],
  'pentacles-10': [
    ['other', 'What is this card\'s keyword?',
     'Abundance and sufficiency. The image suggests a household of three generations — grandparents, parents, children, and the animals too — in a warm house, and these people are well dressed rather than in rags. On the whole it carries more positive than negative.'],
    ['other', 'How does it differ from the Ten of Cups?',
     'By the reader\'s own feel and experience: the Ten of Pentacles does not sit as lightly as the Ten of Cups. The Ten of Cups is abundance and fullness; the Ten of Pentacles is a little constrained, a little stiff — like being born into a complete household with grandparents and parents, a fairly traditional and well-raised family, comfortably off. Born into that, you sometimes feel the family pressure: they want you to do this, they want you to do that. You are in a situation with a great deal of money and you feel hemmed in, and you cannot simply drop the material opportunity to follow what your heart is calling for.'],
    ['love', 'Describe this person\'s character',
     'Fairly stable and practical — this is Pentacles energy, so practical and stable it must be. And they are not tight: they have plenty, or more precisely they do not feel any lack, and because of that they are willing to give to charity or to make gifts. But when they help materially they are very rational about it: "you need help because you are in difficulty? Good, I will help. But if you want to borrow from me to go out enjoying yourself, no." That is the Ten of Pentacles: generous, well provided, decent — and holding on to their reason. Their energy is not outgoing and laughing like the Ten of Cups, and it is still a high energy overall.'],
    ['love', 'What are their feelings toward me?',
     'Fairly steady, and a little cool. This person may want to marry you, and possibly because they feel the two families are well matched. Someone marrying for Ten of Pentacles reasons is not necessarily digging for gold — they are not poor themselves, but they are looking for similarity of starting point, of circumstance, of family. They come from a good family and they look for the same; they saw that in you and liked it before wanting to know your character or your heart. That is not bad as such: a romantic will dislike it, a realist will find it perfectly sound. Whether it is good or bad rests on each person\'s own judgment.'],
    ['love', 'Why are we arguing?',
     'This card alone is hard in a love spread, so draw more — love belongs to Cups, while Pentacles speak more of work. But asked why you argue and given the Ten of Pentacles: it may be a family matter — the two families objecting, differences in family circumstance, their family disliking yours; reasons of family, of tradition, of religion. Or something entirely practical: the two of you married and there is not enough money, or you are together and arguing about money.'],
    ['career', 'Will I find new work?',
     'Not only that — it is work that pays well and brings you stability. To repeat: asked whether pay is high or low, high and low are by the querent\'s standard, not the reader\'s. With the Ten of Pentacles the income is not soaring exactly, but in the upper band — enough to live comfortably with a little to put aside. In this job you have the money and the prospect of material advancement. Whether you like the work, and want to stay in it, is a separate question — plenty of money and no fondness for it is entirely possible.'],
    ['career', 'Any change at work coming?',
     'Your work pays well now; you may be in a well-paid position with a decent title. Ahead, the pay stays high and the title stays as it is — almost no change at all, because the Ten of Pentacles is deeply stable. Any change will be very slow, since Pentacles energy is steady energy. The Ten of Pentacles is a great deal, but not suddenly a great deal: it was built across a process, and now is the harvest.']
  ]
});

/* batch 19 - the four Pages */
Object.assign(KW.vi, {
  'wands-c0': { pos: ['năng lượng dồi dào, mới mẻ','một đam mê mới, một hành động mới, một ngọn lửa mới được nhen nhóm','nhiều ý tưởng mới','ngây thơ theo hướng tốt, không thiển cận'],
                neg: ['non trẻ','khờ dại','ngây ngô','thiếu kinh nghiệm','đôi khi hấp tấp vội vàng','cần ai đó dẫn dắt'] },
  'swords-c0': { pos: ['ý tưởng mới','tư duy mới','trí tuệ mới'],
                 neg: ['nghĩ sao nói vậy, nói chuyện hơi vô duyên','đầu óc và tư duy còn non nớt','ý tưởng thiếu lập luận và bằng chứng','khả năng ra quyết định còn kém','là lá Tiểu Đồng mang nhiều năng lượng tiêu cực nhất trong bốn lá'] },
  'cups-c0': { pos: ['một điều mới mẻ về mặt tình cảm và cảm xúc','tò mò, dễ phấn khích, dễ mở lòng','yêu đời, nhìn cuộc sống dưới góc độ tích cực','tình yêu chân chất, thật lòng, ngây thơ'],
               neg: ['không giỏi xử lý các tình huống trong mối quan hệ','hứng thú với quá nhiều thứ cùng lúc nên khiến người kia bất an'] },
  'pentacles-c0': { pos: ['tin vui về tiền bạc','cơ hội du học, học bổng, cơ hội công việc','một công việc có tiền','thường là người sinh ra đã có sẵn'],
                    neg: ['nhìn người khác dưới góc độ tiền bạc','coi mối quan hệ như một món đồ trang sức cho mình'] }
});

Object.assign(KW.en, {
  'wands-c0': { pos: ['abundant, fresh energy','a new passion, a new action, a new fire being lit','plenty of new ideas','innocent in the good way, and not narrow'],
                neg: ['young and green','naive','inexperienced','at times hasty','needing somebody to lead them'] },
  'swords-c0': { pos: ['new ideas','new thinking','fresh intelligence'],
                 neg: ['says whatever comes into their head, and rather tactlessly','the mind and the thinking still immature','ideas with no reasoning or evidence behind them','poor at deciding','the Page carrying the most negative energy of the four'] },
  'cups-c0': { pos: ['something new in feeling and emotion','curious, easily delighted, quick to open up','glad of life, and seeing it from its positive side','a love that is plain, sincere and innocent'],
               neg: ['not good at handling situations inside a relationship','interested in too many things at once, which leaves a partner uneasy'] },
  'pentacles-c0': { pos: ['good news about money','a chance to study abroad, a scholarship, a job offer','work that pays','usually someone born already provided for'],
                    neg: ['sizing other people up in terms of money','treating the relationship as an ornament for themselves'] }
});

Object.assign(ASK.vi, {
  'wands-c0': [
    ['other', 'Từ khóa của lá này là gì?',
     'Tất cả các lá Tiểu Đồng đều mang cái gì đó mới mẻ và non trẻ; riêng lá này thiên về hành động, đam mê và nhiệt huyết — một đam mê mới, một hành động mới, một ngọn lửa mới được nhen nhóm lên. Từ khóa tiêu cực: non trẻ, khờ dại, ngây ngô, đôi khi hấp tấp vội vàng, vì Gậy là hành động. Và nhớ rằng cả Tiểu Đồng lẫn Kỵ Sĩ đều là những người còn thiếu kinh nghiệm và luôn cần ai đó dẫn dắt.'],
    ['love', 'Miêu tả tính cách một người?',
     'Khá nhiệt huyết, đam mê, là con người của hành động — ra ngoài và làm. Nhìn hình ảnh: anh chàng cầm cây gậy và nhìn xa xăm, như thể lúc nào cũng muốn bắt đầu một hành trình mới. Với người đọc bài thì lá này luôn mang năng lượng tích cực nhiều hơn. Người mang năng lượng Tiểu Đồng Gậy có thể còn khờ dại, còn thiếu kinh nghiệm, hơi giống lá Gã Khờ — nhưng họ không hề thiển cận. Không phải kiểu thiếu kinh nghiệm mà ai giảng cho thì gạt đi "tao biết tao giỏi, tao không muốn nghe mày".'],
    ['love', 'So với Kỵ Sĩ thì ai hấp tấp hơn?',
     'Chắc chắn là Kỵ Sĩ. Kỵ Sĩ mang năng lượng của thanh niên, khỏe hơn; còn Tiểu Đồng thì trẻ con hơn, năng động và nhiệt huyết nhưng vẫn còn ngây thơ. Còn cái tuổi mười bảy mười tám của Kỵ Sĩ thì gọi là trẻ trâu thì đúng hơn — tất cả các lá Kỵ Sĩ đều mang năng lượng trẻ trâu.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Có thể đây là một tình cảm mới. Họ có dành tình cảm cho bạn, và tình cảm này nhiệt huyết, đam mê, nhiều lửa — mà nhiều lửa thì liên tưởng ngay đến sự hấp dẫn về thể xác. Có tình cảm đấy, và tình cảm này mới được hình thành gần đây thôi, còn non trẻ, chứ không phải kiểu họ đã thích bạn từ lâu.'],
    ['love', 'Cãi nhau, thời gian tới nên giải quyết thế nào?',
     'Có thể do cả hai còn trẻ và còn thiếu kinh nghiệm tình trường. Về năng lượng tình cảm thì giữa hai người có nhiệt huyết và đam mê, nhưng cả hai đều còn non — kể cả khi hai bạn đã lớn tuổi thì vẫn là thiếu kinh nghiệm trong chuyện tình cảm. Nên hai bạn làm khổ nhau vì chính sự non nớt ấy. Cảm giác là về tư duy và tâm trí thì mối quan hệ này còn non nên hay cãi nhau, còn về khoản thể xác thì lại bù trừ cho nhau.'],
    ['career', 'Sắp tới tìm được công việc mới không?',
     'Tìm được. Và có thể đó là một trang sách mới — một lĩnh vực mới mà bạn chưa từng thử sức bao giờ. Hoặc là trường hợp bạn phải tự ra ngoài mà tìm: có thể bạn đang mong ai đó đem đến cho mình cơ hội, hỏi gia đình, hỏi bố mẹ, hỏi anh chị em, hỏi bạn bè, mong mọi người đưa việc cho mình — nhưng công việc này bạn phải tự gửi CV mà có. Rồi sẽ có thôi.'],
    ['career', 'Thời gian tới công việc có gì cần lưu ý?',
     'Có thể sẽ có những dự án mới mà bạn chưa làm lần nào, chưa thử sức trong lĩnh vực đó bao giờ — một dự án thuộc ngành hơi khác với những gì bạn đã được học. Và bạn sẽ phải hành động nhiều cho dự án này: học nhiều, tự tìm tòi nhiều, hoặc dự án đòi hỏi bạn phải đi lại và di chuyển nhiều.'],
    ['other', 'Có mẹo nào để nhớ các lá Tiểu Đồng không?',
     'Hãy hình dung lá Gã Khờ kết hợp với năng lượng của từng nguyên tố. Tiểu Đồng Gậy là Gã Khờ trong khía cạnh Gậy; áp dụng tương tự cho ba lá Tiểu Đồng còn lại. Và nhớ rằng không phải lúc nào lá này cũng dùng để miêu tả người: nếu muốn miêu tả năng lượng của một tình huống thì cứ gộp hai thứ lại — Gậy là gì, và Tiểu Đồng là gì.']
  ],
  'swords-c0': [
    ['love', 'Miêu tả tính cách một người?',
     'Cẩn thận khoản giao tiếp. Cách nói chuyện của họ không phải kiểu độc mồm độc miệng như Kỵ Sĩ Kiếm, mà là kiểu nghĩ sao nói vậy, nói chuyện hơi vô duyên. Trong đời bạn chắc cũng gặp ít nhất một người như thế: họ không có ý xấu, nhưng thở ra câu nào là mình thấy vô duyên câu đấy. Người này mà đi tán gái thì chịu chết. Bản chất các lá Tiểu Đồng không xấu — chẳng qua là còn non, và non trong khía cạnh của nguyên tố: với Kiếm thì là đầu óc, tư duy còn non nớt.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Hơi khó, vì trong tình cảm mà lại dùng suy nghĩ và lý trí. Cảm giác là tình cảm họ dành cho bạn không nhiều lắm, và hơi thực dụng: họ dùng đầu óc, dùng lý tính cho mối quan hệ này. Nhưng vì bản thân người này còn ít kinh nghiệm nên cái lý tính và sự tính toán ấy lộ ra hết — ai cũng nhìn ra được mục đích của họ khi tiếp cận người hỏi.'],
    ['other', 'Lá này có gì khác ba lá Tiểu Đồng kia?',
     'Trong bốn lá Tiểu Đồng thì Tiểu Đồng Kiếm là lá mang nhiều năng lượng tiêu cực hơn cả. Không phải là nó xấu, mà là nó trẻ con theo kiểu trẻ con. Mặt tích cực của nó may ra là ý tưởng mới — nhưng ý tưởng này còn non dại, không có nhiều lập luận, luận cứ hay bằng chứng. Kiểu "tôi sẽ thành lập một công ty để mang đến những dịch vụ cho giới trẻ", rồi ai đó hỏi các bước làm như thế nào thì chịu chết. Ý tưởng của Tiểu Đồng Kiếm là như thế.'],
    ['love', 'Cãi nhau, làm sao để giải quyết?',
     'Năng lượng ở đây là năng lượng trẻ, non nớt, thiếu kinh nghiệm tình trường — cho cả hai. Và cả hai đều có xu hướng nói những câu vô duyên làm ảnh hưởng đến người còn lại. Vấn đề của hai bạn nằm ở giao tiếp: cách hai bạn nói chuyện với nhau còn thiếu chín chắn. Hoặc là giao tiếp một chiều — một người cứ nói và từ chối nghe người còn lại; mà trẻ con thì có thích lắng nghe đâu, nó chỉ thích nói những gì nó muốn nói.'],
    ['career', 'Tìm được công việc mới không?',
     'Có thể có. Nhưng nhìn hình ảnh Tiểu Đồng Kiếm thì thấy: chân đang bước về phía trước mà đầu lại ngoái lại. Bạn có thể tìm được một công việc mình yêu thích, nhưng khả năng ra quyết định của bạn còn non. Nên có thể xảy ra trường hợp: rõ ràng là công việc tốt, nhưng đến lúc quyết định đi thử việc thì bạn lại lùi một bước — "thôi tôi không đi nữa". Người này có thể lận đận đường công việc là vì khả năng ra quyết định còn kém, còn thiếu dứt khoát; hoặc lẽ ra nên chọn bên này thì lại chọn bên kia.'],
    ['career', 'Thời gian tới công việc có gì?',
     'Có thể bạn sẽ có rất nhiều ý tưởng mới trong công việc. Nhưng nếu muốn được sếp phê duyệt thì bạn cần điều tra, nghiên cứu nhiều hơn và đưa ra nhiều số liệu, thông tin cụ thể hơn. Cũng có thể thời gian tới sẽ có những cuộc cãi nhau nhỏ với đồng nghiệp, hoặc với một ai đó nói chuyện vô duyên — mà cũng có thể chính bạn mới là người nói chuyện vô duyên.']
  ],
  'cups-c0': [
    ['other', 'Từ khóa của lá này là gì?',
     'Một điều gì đó mới mẻ về mặt tình cảm và cảm xúc. Có thể là một tình yêu mới; hoặc nói chung hơn là một tình huống khiến cảm xúc của bạn dâng trào — không phải mãnh liệt, mà là bắt đầu dâng lên, khiến bạn thấy đam mê, thấy thích thú. Có thể là tình yêu, có thể là một mối quan hệ bạn bè, có thể là một công việc, hoặc bạn phát hiện ra một sở thích mới — như phát hiện ra mình đam mê Tarot trong khi trước đó không hề nghĩ vậy. Lá này thường không có nghĩa tiêu cực.'],
    ['love', 'Miêu tả tính cách một người?',
     'Người tỏa ra năng lượng khá tích cực, có phần trẻ con nhưng không phải trẻ trâu. Luôn tò mò và hứng thú, rất dễ phấn khích, rất dễ thích thú với một thứ gì đó. Ví dụ: ra nước ngoài và gặp bạn bè từ những nền văn hóa và tôn giáo khác, người bình thường thường tránh xa vì con người có xu hướng sợ những gì mình không hiểu; còn người này thì tò mò và rất dễ mở lòng, hỏi han "tại sao ở văn hóa của bạn lại quấn khăn quanh đầu", "tại sao các bạn lại cầu nguyện ba bốn lần một ngày". Họ tò mò về người khác và về cuộc sống nói chung, dễ yêu đời, và thường nhìn cuộc sống dưới góc độ tích cực.'],
    ['love', 'Người này hợp làm bạn hay làm người yêu?',
     'Theo trải nghiệm cá nhân của người đọc bài thì có thể hợp làm bạn hơn là làm người yêu. Vì người yêu thì ta cần một ai đó chỉ yêu mình; còn người này giống như đứa trẻ tung tăng — thấy A thì thích A, chạy qua B lại thích B. Gọi là ngoại tình thì không hẳn: chỉ là người này hứng thú với nhiều thứ. Không nhất thiết là họ yêu bạn rồi lại yêu cô khác, mà là họ yêu bạn và đồng thời yêu game, đồng thời yêu những sở thích khác của họ. Khác hẳn với Kỵ Sĩ Cốc — Kỵ Sĩ Cốc mới đúng là kiểu ngoại tình, hơi sở khanh một chút.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Có thể họ có tình cảm thật, nhưng là tình cảm mới. Lời khuyên là bạn nên tìm hiểu nhau kỹ hơn trước khi nhận lời, bởi tình cảm này mới chỉ chớm nở, và có thể họ vẫn đang ở giai đoạn hứng thú với bạn, thích bạn, chứ chưa thật sự sâu sắc. Không phải khuyên bạn bỏ người này — chỉ là hãy cho thêm thời gian. Dù sao thì tỉ lệ hai người đến được với nhau cũng tầm khoảng tám mươi phần trăm rồi.'],
    ['love', 'Cãi nhau, nên làm gì?',
     'Có thể một trong hai hoặc cả hai mang năng lượng Tiểu Đồng Cốc khiến người kia cứ cảm thấy bất an cho mối quan hệ. Và thứ hai: cả hai đều khá trẻ và còn non. Dù tình cảm dành cho nhau là có thật, nhưng vì trẻ nên có nhiều thứ đáng lẽ giải quyết rất dễ mà hai người lại chọn cách xử lý vụng về, thành ra chẳng đâu vào đâu. Người đọc bài cảm nhận điều này từ chính mình và những người xung quanh: khi còn trẻ, xử lý các tình huống trong quan hệ — kể cả bạn bè lẫn người yêu — ta khờ khạo lắm; đến khi lớn rồi nhìn lại, hoặc nghe những câu chuyện như thế, thì thấy ngay là chuyện này giải quyết rất dễ, chẳng có gì phải lăn tăn.'],
    ['love', 'Vậy tôi phải làm gì bây giờ?',
     'Bạn không thể lớn trong một sớm một chiều được. Đó là lý do vì sao những mối quan hệ khi ta còn trẻ rất dễ đổ vỡ — không phải lỗi của bạn, cũng không phải lỗi của họ; đó là một phần của tuổi trẻ. Nếu chúng ta biết phải làm gì ngay từ khi sinh ra thì đã chẳng có cụm từ "tuổi trẻ", và cũng chẳng có câu "gừng càng già càng cay".'],
    ['career', 'Tìm được công việc mới không?',
     'Chắc chắn tìm được, và là công việc bạn thích. Riêng lá này thì chưa biết được tiền như thế nào hay cơ hội thăng tiến ra sao — nhưng điều đó không quan trọng lắm, vì có đam mê thì những thứ kia sẽ theo sau. Khi bạn làm công việc mình đam mê thì công sức và thời gian bạn bỏ ra cho nó sẽ nhiều hơn một công việc bình thường rất nhiều, và ông trời không bao giờ phụ sự nỗ lực của một người: chỉ cần bạn chăm chỉ thì sớm hay muộn cũng gặt hái được thành quả. Chứ làm sao chúng ta chăm chỉ được với những thứ mình không thích?'],
    ['career', 'Thời gian tới công việc có gì?',
     'Sẽ có một tình huống khiến bạn cảm thấy đam mê và thích thú: có thể bạn gặp một người khiến bạn phải lòng, liên quan đến môi trường công việc; hoặc trong bản chất công việc sẽ có điều gì đó mới — dự án mới, được chuyển bộ phận — khiến bạn vui vẻ hơn và yêu đời hơn.']
  ],
  'pentacles-c0': [
    ['love', 'Miêu tả tính cách một người?',
     'Có thể là người sinh ra trong một gia đình khá giả. Hoặc trong thời gian tới họ sẽ có tin vui, may mắn về mặt tiền bạc, cơ hội du học, học bổng hoặc cơ hội công việc — nhưng thường là họ sinh ra đã có sẵn.'],
    ['love', 'Tình cảm người ấy dành cho tôi thế nào?',
     'Hơi căng. Trong vấn đề tình cảm thì lá này khá khó nói. Có thể người này cũng có tình cảm, nhưng họ đang ngắm nghía bạn dưới góc độ tiền bạc: họ coi bạn như một đồng xu, một thứ họ có thể sở hữu, và coi mối quan hệ này như một món đồ trang sức cho họ. Có thể vì bạn xinh, hoặc vì bố bạn làm to, nên họ cảm thấy khi đi cạnh bạn thì lòng tự tôn của họ được gia tăng — khi ai đó hỏi người yêu của bạn thế nào, làm nghề gì, nhà ở đâu, thì họ nói ra với vẻ tự hào, cái tôi được củng cố. Người này có thể không yêu bạn vì bản chất con người bạn mà vì những thứ nhìn được, cầm được, nắm được ở bạn. Dĩ nhiên nếu chính người hỏi cũng là kiểu người như vậy thì hai bên lại hợp nhau.'],
    ['love', 'Vì sao chúng tôi hay cãi nhau?',
     'Có thể dạo gần đây một trong hai hoặc cả hai đang bắt đầu có những cơ hội công việc mới. Trước đây sự chú ý của hai bạn dành cho nhau, còn bây giờ thì đang hướng ra những con đường khác, những khía cạnh khác của bản thân. Có thể hai bạn yêu nhau suốt thời đại học, và bây giờ ra trường đi làm thì mỗi người phải có sự nghiệp riêng. Người đọc bài thấy rất nhiều bạn trẻ yêu nhau thời đại học và chia tay khi ra trường vì đúng lý do đó: khi đi làm, bạn là kiểu người tham vọng, luôn muốn làm cho doanh nghiệp lớn, gặp gỡ nhiều người tài giỏi — trong khi người yêu bạn thì chỉ thích nằm nhà chơi game, không muốn đi làm, thích được bố mẹ nuôi. Tự động sẽ có khoảng cách giữa hai người.'],
    ['career', 'Sắp tới tìm được công việc mình thích không?',
     'Thích thì cũng không hẳn — nhưng công việc này có tiền. Không nhiều đến mức choáng ngợp, nhưng khá ổn: nếu bạn đang kỳ vọng một công việc lương mười triệu thì bạn sẽ kiếm được một công việc lương mười hai triệu. So sánh cho dễ hình dung: nếu ra Kỵ Sĩ Gậy thì có thể là công việc lương tầm mười tám mười chín triệu dù kỳ vọng của bạn chỉ là mười; còn nếu ra Nữ Hoàng Gậy thì không những nhiều tiền mà vị trí cũng cao. Với Tiểu Đồng và Kỵ Sĩ Tiền thì chỉ là công việc có tiền thôi.'],
    ['career', 'Thời gian tới công việc có gì không?',
     'Sẽ có cơ hội: cơ hội mới, công việc mới, dự án mới. Và cơ hội đó đem lại cho bạn tiền. Cũng có thể bạn được đi học và nhận được học bổng tại công ty đó.']
  ]
});

Object.assign(ASK.en, {
  'wands-c0': [
    ['other', 'What is this card\'s keyword?',
     'Every Page carries something new and young; this one leans toward action, passion and enthusiasm — a new passion, a new undertaking, a new fire being lit. The negative keywords: young, green, naive, and at times hasty, because Wands is action. And remember that both Pages and Knights are the ones still short on experience and always in need of someone to lead them.'],
    ['love', 'Describe this person\'s character',
     'Quite enthusiastic and passionate, a person of action who goes out and does things. Look at the image: he holds his staff and gazes into the distance, as though he always wants to be starting a new journey. For the reader this card always carries more positive energy than not. The Page of Wands may still be naive and inexperienced, a little like the Fool — but they are not narrow-minded. Not the type who lacks experience and, when someone explains, waves it away with "I know I am good, I do not want to hear you."'],
    ['love', 'Who is hastier, the Page or the Knight?',
     'The Knight, without question. A Knight carries the energy of a young man, stronger with it; a Page is more childlike, energetic and enthusiastic while still innocent. The seventeen or eighteen of the Knight is better called cocky — all the Knights carry that.'],
    ['love', 'What are their feelings toward me?',
     'This may be a new feeling. They do feel something for you, and it is enthusiastic, passionate, full of fire — and fire brings physical attraction straight to mind. The feeling is there, and it formed recently; it is young. Not a case of their having liked you for a long time.'],
    ['love', 'We are arguing — what should we do?',
     'Possibly because you are both still young and short on experience in love. In terms of the energy between you there is enthusiasm and passion, and both of you are green — and even if you are older, the reading still says you are inexperienced in matters of the heart. So you make each other suffer through that greenness. The sense is that mentally the relationship is still young, hence the arguing, while physically the two of you balance each other well.'],
    ['career', 'Will I find new work soon?',
     'You will. And it may be a new page altogether — a field you have never tried. Or the case where you must go out and find it yourself: you may be hoping somebody will bring you the opportunity, asking family, parents, siblings, friends, hoping someone hands you a job — but this is work you will have to find by sending the CV yourself. It will come.'],
    ['career', 'Anything to watch at work?',
     'There may be new projects you have never handled, in a field you have never tried — a project in an area rather unlike what you trained in. And you will have to act a great deal on it: study a lot, research it yourself, or travel and move about for it.'],
    ['other', 'Is there a trick for remembering the Pages?',
     'Picture the Fool combined with the energy of each element. The Page of Wands is the Fool in the Wands aspect; do the same for the other three. And remember it is not always used to describe a person: to describe the energy of a situation, simply put the two together — what Wands is, and what a Page is.']
  ],
  'swords-c0': [
    ['love', 'Describe this person\'s character',
     'Be careful about how they communicate. Their manner of speaking is not venomous the way the Knight of Swords is; it is the type who says whatever comes to mind, rather tactlessly. You have surely met at least one: they mean no harm, and every sentence out of them lands badly. This one going courting is hopeless. There is nothing bad in the Pages as such — only that they are green, and green in the aspect of their element: for Swords, it is the mind and the thinking that are still immature.'],
    ['love', 'What are their feelings toward me?',
     'Rather difficult, because here reason and calculation are being applied to love. The sense is that what they feel for you is not much, and is somewhat pragmatic: they are using their head on this relationship. But because they have so little experience, the calculation shows completely — everyone can see the purpose behind their approach.'],
    ['other', 'How does this differ from the other three Pages?',
     'Of the four Pages, the Page of Swords carries the most negative energy. Not that it is bad — it is childish in the way a child is. Its positive side, at best, is new ideas — and those ideas are still green, with little reasoning or evidence behind them. The sort of "I will found a company to bring services to young people", and asked what the steps are, nothing at all. That is a Page of Swords idea.'],
    ['love', 'We are arguing — how do we fix it?',
     'The energy here is young, green, and short on experience in love — for both of you. And both tend to say tactless things that land on the other. Your problem is in the communication: the way the two of you talk to each other is immature. Or it runs one way — one talks and refuses to hear the other. Children do not care to listen; they only care to say what they want to say.'],
    ['career', 'Will I find new work?',
     'Possibly. But look at the image: his feet walk forward while his head turns back. You may find work you like, and your capacity to decide is still green. So this can happen: it is plainly a good job, and at the point of committing to the trial you step back — no, I will not go after all. This person\'s career may be a bumpy one precisely because the deciding is weak and never quite firm; or where they should have chosen one they take the other.'],
    ['career', 'Anything coming at work?',
     'You may have a great many new ideas. But to get one approved you will need more research behind it, and more concrete figures and information. There may also be small arguments with a colleague, or with someone who speaks tactlessly — and the tactless one may well be you.']
  ],
  'cups-c0': [
    ['other', 'What is this card\'s keyword?',
     'Something new in feeling and emotion. It may be a new love; or more broadly, a situation that lifts your feelings — not violently, but beginning to rise, leaving you enthusiastic and interested. It could be love, a friendship, a job, or discovering a new passion — finding that you love tarot when you had never thought so. The card usually carries no negative meaning.'],
    ['love', 'Describe this person\'s character',
     'Someone radiating quite positive energy, childlike without being childish. Always curious and interested, easily delighted, easily taken with something. An example: abroad, meeting people from other cultures and religions, most people keep their distance because we tend to be wary of what we do not understand — while this person is curious and opens up easily, asking why your culture wraps the head, why you pray three or four times a day. They are curious about people and about life, easily excited, quick to love living, and they usually see life from its positive side.'],
    ['love', 'Are they better as a friend or a partner?',
     'By the reader\'s own experience, possibly better as a friend. Because in a partner we want someone who loves us; and this person is like a child skipping about — sees A and loves A, runs to B and loves B. Not infidelity exactly: it is that they are interested in a great many things. Not that they love you and also love another woman, but that they love you and at the same time love their games and their other interests. Quite unlike the Knight of Cups — the Knight is the one who really is the unfaithful type, a little of the philanderer about him.'],
    ['love', 'What are their feelings toward me?',
     'The feeling may be genuine, and it is new. The advice is to get to know each other better before you accept them, because it is only budding, and they may still be at the stage of being interested in you and liking you rather than anything deeper. Not a reason to drop them — only to give it more time. And in any case the odds of the two of you coming together sit at around eighty per cent.'],
    ['love', 'We are arguing — what should we do?',
     'One of you, or both, may be carrying Page of Cups energy that leaves the other feeling permanently unsettled. And second: you are both quite young and green. The feeling between you may be entirely real, and because you are young there are things that would be very easy to resolve and that the two of you handle clumsily instead, so nothing comes right. the reader sees it in herself and in those around her: young, handling situations in any relationship — friends as much as lovers — we are clumsy; and later, grown, looking back or hearing such a story, you see at once how simply it could be solved.'],
    ['love', 'So what do I do now?',
     'You cannot grow up overnight. That is why relationships formed young break so easily — it is not your fault and not theirs; it is part of being young. If we knew what to do from the moment we were born there would be no such phrase as youth, and no saying about ginger growing hotter with age.'],
    ['career', 'Will I find new work?',
     'Certainly, and work you like. This card will not tell you the money or the prospects — and that matters less, because with passion the rest follows. Doing work you love, the time and effort you put in are far greater than for ordinary work; and heaven never turns its back on a person\'s effort. Be diligent and sooner or later you reap it. How could we ever be diligent at something we dislike?'],
    ['career', 'Anything coming at work?',
     'A situation is coming that will leave you enthusiastic and interested: you may meet someone you fall for through work; or something new appears in the work itself — a new project, a move to another department — that makes you happier and gladder of life.']
  ],
  'pentacles-c0': [
    ['love', 'Describe this person\'s character',
     'Possibly someone born into a fairly comfortable family. Or in the period ahead they will have good news and luck about money, a chance to study abroad, a scholarship, a job offer — though usually it is that they were born already provided for.'],
    ['love', 'What are their feelings toward me?',
     'Rather concerning; this card is difficult in love. They may have feelings, and they are sizing you up in terms of money: they see you as a coin, as something they can hold, and this relationship as an ornament for themselves. Perhaps you are beautiful, or your father is somebody, so walking beside you raises their own standing — and when someone asks what their partner is like, what they do, where their family is from, they say it with pride, and the ego is shored up. They may not love you for who you are but for what can be seen and held and grasped about you. Of course, if the querent is the same sort of person, then the two of them suit each other exactly.'],
    ['love', 'Why do we argue so much?',
     'Recently one of you, or both, may be starting to get new work opportunities. Where your attention used to be on each other, it is now turning toward other roads and other parts of yourselves. Perhaps you loved through university, and now, graduated and working, each of you needs a career of your own. the reader sees a great many young couples who loved at university part on graduating for precisely this: at work you are the ambitious sort who wants to be at a big firm, meeting able people — while your partner would rather lie at home playing games, does not want to work, and likes being kept by their parents. A gap opens between you by itself.'],
    ['career', 'Will I find work I like?',
     'Like it, not necessarily — but the work pays. Not overwhelmingly, but decently: if you are hoping for something paying ten, you will find something paying twelve. For comparison: the Knight of Wands might be eighteen or nineteen where you expected ten; and the Queen of Wands would be not only good money but a high position with it. With the Page and the Knight of Pentacles it is simply work that pays.'],
    ['career', 'Anything coming at work?',
     'An opportunity: something new, new work, a new project. And it brings money with it. You may also be sent to study, and given a scholarship by that company.']
  ]
});

/* batch 20 - the four Knights */
Object.assign(KW.vi, {
  'wands-c1': { pos: ['lửa của tuổi trẻ, nhiệt huyết dồi dào','cần thiết khi bạn đang trong trạng thái lười biếng, ì ạch','dám lao đi và bắt đầu ngay','năng động, môi trường trẻ, di chuyển nhiều'],
                neg: ['trẻ trâu, nghịch dại','vội vội vàng vàng, hấp tấp dẫn đến sai','ham muốn và đam mê nhất thời — ngọn lửa dễ bùng thì cũng dễ tắt','nóng, không ai chịu nhường ai','lạm dụng lửa thì tự đốt cháy chính mình'] },
  'swords-c1': { pos: ['rất thông minh, nhanh, lý trí','thẳng thắn và thành thật','quyết đoán, có mục tiêu là tiến thẳng tới'],
                 neg: ['vô duyên, không khéo mồm','kém về cảm xúc, lòng trắc ẩn và sự đồng cảm','khẩu chiến, chiến đấu bằng lời nói, nói lời lăng mạ','tầm nhìn như một đường thẳng — nhìn xa nhưng chỉ một mục tiêu duy nhất','vì thiếu cảm xúc nên khó lên làm lãnh đạo'] },
  'cups-c1': { pos: ['lãng mạn, ngọt ngào, đậm chất thơ','bạch mã hoàng tử — đi chậm rãi và tận hưởng cuộc sống','nhẹ nhàng, bình tĩnh, yêu đời hơn hai anh Kỵ Sĩ kia','có phần nghệ sĩ'],
               neg: ['đa tình — từ khóa lớn nhất của lá này','để cảm xúc lấn át và kiểm soát mình','thất thường: vui thì cả phòng vui, buồn thì cả phòng buồn','hành động theo cảm thấy tốt hay không tốt, chứ không theo lẽ đúng sai','có thể là cấp độ tiêu cực nhất trong bốn cấp độ Hoàng Gia','cái tôi cao một cách không cần thiết'] },
  'pentacles-c1': { pos: ['chăm chỉ, cần cù, có mục tiêu là làm đến cùng','chung thủy, chung thành trong tình cảm','đáng tin, có trách nhiệm — sếp giao gì là làm','ổn về tiền bạc, lương thưởng và thăng tiến'],
                    neg: ['nhạt nhẽo','cứng đầu, không chịu lắng nghe','thiển cận và nông cạn — khác mình là sai','đã tin thì không tự hỏi mình đang làm đúng hay sai'] }
});

Object.assign(KW.en, {
  'wands-c1': { pos: ['the fire of youth, abundant enthusiasm','exactly what you need if you have gone lazy and stagnant','willing to charge off and start right now','dynamic, a young environment, a lot of moving about'],
                neg: ['cocky and immature, reckless for the fun of it','rushed and hasty, and the haste causes mistakes','desire and passion of the moment — a flame that flares easily goes out easily','hot-headed, with neither side willing to give way','abuse the fire and you burn yourself with the fire you made'] },
  'swords-c1': { pos: ['very intelligent, very quick, very rational','blunt and sincere','decisive — once there is a target, straight at it'],
                 neg: ['tactless, not smooth-tongued','poor at emotion, compassion and empathy','fights with words, insults, cutting remarks','vision like a single straight line — sees far, but only one target','because the feeling side is missing, it is hard to rise to leadership'] },
  'cups-c1': { pos: ['romantic, sweet, poetic','the prince on the white horse — riding slowly and enjoying life','gentler, calmer and more life-loving than the other two Knights','something of the artist about them'],
               neg: ['amorous — the single biggest keyword of this card','lets emotion take over and run them','moody: happy and the whole room is happy, upset and the whole room is upset','acts on what feels good, not on right and wrong','arguably the most negative of the four royal ranks','an ego that is high for no good reason'] },
  'pentacles-c1': { pos: ['hard-working and diligent — once there is a goal, they see it through','faithful and loyal in a relationship','dependable and responsible: the boss says do it, they do it','sound on money, pay and promotion'],
                    neg: ['dull','stubborn, unwilling to listen','narrow and shallow — different from me means wrong','once they believe something they never ask whether what they are doing is right'] }
});

Object.assign(ASK.vi, {
  'wands-c1': [
    ['other', 'Từ khóa của lá này là gì?',
     'Lửa của tuổi trẻ. Nhưng cái năng lượng này không có nghĩa là xấu — nó tùy. Nếu bạn hỏi khi đang trong trạng thái lười biếng, ì ạch thì cái lửa nhiệt huyết này là cần thiết cho bạn. Nhưng nếu bạn đang quá lạm dụng cái lửa tuổi trẻ này thì bạn sẽ đốt cháy chính mình, tự bị bỏng bởi ngọn lửa mình tạo ra vì không kiểm soát được nó.'],
    ['other', 'Kỵ Sĩ khác Tiểu Đồng và Hoàng Hậu, Vua ở chỗ nào?',
     'Nhớ cho Người đọc bài: Kỵ Sĩ trong cả bốn nguyên tố đều là kiểu người chưa thật sự kiểm soát được nguyên tố của mình, còn Hoàng Hậu và Vua thì kiểm soát được rồi. Cậu bé Tiểu Đồng thì mới chỉ bắt đầu tìm hiểu nên chưa kịp nghịch dại; còn Kỵ Sĩ mới chính là anh chàng nghịch dại, nghịch ngu — cái mình gọi là trẻ trâu. Còn cậu bé thì mới mười một mười hai, nhi đồng thôi, chưa biết gì cả.'],
    ['love', 'Tình cảm anh ta / cô ta dành cho tôi thế nào?',
     'Tình cảm họ dành cho bạn là một cái ham muốn, một đam mê nhất thời. Nó cho mình cái cảm giác ngọn lửa dễ bùng thì cũng sẽ dễ tắt. Nên với mối quan hệ này bạn đừng kỳ vọng cao quá. Nhưng cũng đừng gạt người ta ra ngay — cứ tìm hiểu nhau thêm một hai tháng, nếu người ta vẫn giữ được cái nhiệt đó thì hãy mở lòng với người ta nhiều hơn.'],
    ['love', 'Có ví dụ nào cho kiểu tình cảm này không?',
     'Có những người, nhất là những bạn cô đơn lâu năm, tự dưng có ai đó bùm một cái bước vào cuộc sống của bạn: "chúng mình làm tri kỷ của nhau đi", "anh viết thơ tặng em này", rất lãng mạn. Mà mình thì độc thân từ hồi sinh ra tới giờ, tự dưng có anh chàng lãng mạn thế thì thích lắm. Xong sau một tháng anh ta quay ngoắt 180 độ: "anh chán em rồi". Kiểu như vậy đấy.'],
    ['love', 'Vì sao hai đứa tôi hay cãi nhau?',
     'Vì nóng quá. Có thể một trong hai, hoặc cả hai, đều nóng quá — nóng và không ai chịu nhường ai. Ai cũng muốn nhanh nhanh chóng chóng giải quyết vấn đề của mối quan hệ theo cách của mình. Mà trong một mối quan hệ thì chúng mình nên lắng nghe cả bên kia nữa, tìm được tiếng nói chung và chọn ra phương án hòa hợp cho cả hai. Chứ nếu bạn giải quyết theo cách của bạn, họ giải quyết theo cách của họ, thì chẳng đi vào đâu cả, và mối quan hệ cũng sẽ chẳng đi đến đâu cả.'],
    ['other', 'Tôi nên đi xem bài về người yêu mình không?',
     'Nếu bạn đang có người yêu rồi mà cảm thấy có vấn đề, thì đừng phí tiền đi tìm reader để hỏi "chị ơi người yêu em thế này thế kia, em nên làm gì". Tốt nhất là hỏi thẳng người yêu bạn về mối quan hệ của hai người. Có gì thì hỏi thẳng luôn.'],
    ['career', 'Thời gian tới tôi có tìm được công việc ưng ý không?',
     'Cũng chưa nói trước được. Có thể là có, nhưng kiểu công việc này là bạn bắt đầu hơi nhanh, hơi vội — nếu xem xét kỹ thì vẫn còn nhiều cơ hội khác đang chờ bạn. Hoặc là bạn chưa hỏi rõ lương, chưa đọc kỹ bản thỏa thuận mà đã ký hợp đồng rồi. Hoặc công việc này có tính chất năng động, môi trường trẻ, và có thể vì công việc mà bạn phải di chuyển nhiều, đi đi lại lại nhiều — khác với trước là công việc ngồi lì một chỗ.'],
    ['career', 'Cách tôi đi tìm việc có vấn đề gì không?',
     'Có thể cách tìm việc của bạn đang vội vội vàng vàng: một ngày bạn sắp xếp ba buổi phỏng vấn, cho xong chỗ này để vội đi chỗ kia. Nhà tuyển dụng hỏi "em còn câu hỏi gì không", bạn bảo "không còn câu hỏi gì ạ, em đi phỏng vấn chỗ khác đây". Kiểu như thế. Rơi vào trường hợp nào thì còn phụ thuộc vào các lá đi kèm và trực giác của bạn tại thời điểm đó — nhưng cứ nhớ năng lượng chung: đây là một anh chàng vội vội vàng vàng, mặc dù bên trong rất nhiều nhiệt, rất nhiều năng lượng.'],
    ['career', 'Tôi đang làm văn phòng bình thường, thời gian tới công việc có gì không?',
     'Cẩn thận cái xu hướng vội vàng dẫn đến sai sót. Hoặc là trong thời gian tới bạn sẽ tìm được một đam mê mới trong công việc — nhưng phải tìm hiểu cái đam mê này từ từ, từ tốn thôi, để không ảnh hưởng đến công việc chính.']
  ],
  'swords-c1': [
    ['other', 'Miêu tả tính cách một người?',
     'Có thể rất thông minh, rất nhanh, rất lý trí. Nhưng trong những trường hợp yêu cầu cảm xúc, yêu cầu lòng trắc ẩn hay sự đồng cảm thì anh này không giỏi mảng đó. Mà nếu không giỏi mảng đó thì dù giỏi đến mấy cũng rất khó để lên làm lãnh đạo. Đó là lý do vì sao Hoàng Hậu và Vua mới là người lãnh đạo: cùng là năng lượng Kiếm đấy, nhưng cách hành xử và cách họ kiểm soát năng lượng Kiếm bên trong họ là khác nhau.'],
    ['other', 'Kỵ Sĩ và Tiểu Đồng có điểm gì chung?',
     'Cả cậu bé lẫn hiệp sĩ đều là những kiểu người vẫn cần người dẫn dắt. Hiệp sĩ nhận lệnh từ nhà vua hay từ tướng chứ không phải là người ra lệnh cho người khác — nhận lệnh rồi đi chiến đấu.'],
    ['love', 'Anh ta / cô ta nghĩ gì về tôi?',
     'Ngoài mặt họ có thể nói những câu khiến bạn nghĩ "người này nói chuyện vô duyên, không khéo mồm". Nhưng Người đọc bài nghĩ Kỵ Sĩ Kiếm có thể là người khá thành thật, thật lòng với bạn. Những người vô duyên thường là thật lòng; còn ai lẻo mép quá, khéo mồm quá thì mình mới cần chú ý. Nếu bạn chịu được cái tính đó của họ, hoặc nói để họ hiểu và mềm tính ra, thì có thể sẽ có một mối quan hệ bền vững.'],
    ['love', 'Đây có phải người dành cho tôi không?',
     'Nếu bạn là kiểu người thích được yêu bằng lời nói, thích nghe những lời mật ngọt, hay thích một người quan tâm đến cảm xúc của bạn, thì đây không phải là người dành cho bạn. Người này khá vô duyên trong chuyện tình cảm: thích ai là nói thẳng luôn, kiểu "hai bên chưa tương tác nhiều, làm người yêu đi thì anh sẽ nuôi em" — khá là tuyệt. Nhưng quyết đoán và quyết tâm thì là điểm tốt.'],
    ['love', 'Vì sao hai đứa tôi hay cãi nhau?',
     'Cái này hiển nhiên quá rồi: một trong hai hoặc cả hai, trong lúc cãi nhau, các bạn chiến đấu bằng lời nói. Tức là những lời khiến mình cảm thấy bị lăng mạ, hay quá chì chiết, hay rất khó nghe. Mỗi lần điên lên cãi nhau có thể không chỉ là chửi bậy mà còn lôi cả gia đình hai bên vào để mỉa mai, để đá xoáy. Năng lượng Kỵ Sĩ Kiếm tiêu cực là như thế. Mối quan hệ như vậy là đã độc hại rồi — sửa được thì tốt, không thì rất mệt mỏi cho cả hai bên.'],
    ['career', 'Thời gian tới tôi có tìm được công việc ưng ý không?',
     'Người này có thể gặp vấn đề trong chuyện đi phỏng vấn: có thể trong lúc phỏng vấn bạn nói những câu, hoặc cái cách phỏng vấn của bạn, khiến nhà tuyển dụng không thích. Bạn nên xem xét lại, tự đánh giá lại quá trình phỏng vấn và cách mình trả lời câu hỏi.'],
    ['career', 'Tôi tìm mãi không ra việc thì phải làm sao?',
     'Kỵ Sĩ Kiếm là "em có mục tiêu là tiến thẳng về mục tiêu", nên có thể bạn chỉ thích làm cho một lĩnh vực nào đó và chỉ tìm việc trong lĩnh vực đấy. Bây giờ thời buổi khó tìm việc thì bạn nên mở rộng vùng tìm việc ra, đừng chỉ tập trung vào một mục tiêu nữa. Tầm nhìn của anh Kỵ Sĩ Kiếm hơi bị theo kiểu một đường thẳng dài: anh ấy nhìn xa nhưng chỉ một mục tiêu duy nhất, thay vì nhìn rộng ra.'],
    ['career', 'Tôi đang làm văn phòng bình thường, thời gian tới có thay đổi gì không?',
     'Có thể năng lực hiện giờ của bạn đang là Kỵ Sĩ Kiếm, nên bạn cần chậm lại một chút: có ý tưởng, có mục tiêu cũng được, nhưng chậm lại một chút để để ý những thứ xung quanh. Hoặc là trong thời gian tới bạn sẽ khẩu chiến với ai đó ở chỗ làm — hoặc mình bị chửi, hoặc mình đi chửi người ta, hoặc cả hai bên chửi nhau. Cụ thể là cái nào thì phụ thuộc vào trực giác của reader tại thời điểm đó và vào những lá đi kèm.'],
    ['other', 'Học lá bài như thế nào cho đúng?',
     'Ở đây mình chỉ dạy về những năng lượng cốt lõi nhất của từng lá thôi. Sau đó tự bạn hãy dùng khả năng sáng tạo cùng kiến thức và kinh nghiệm sống của bạn để có được một trải bài của riêng bạn. Với bộ Hoàng Gia thì đầu tiên là học bốn cấp Hoàng Gia, thuộc làu về nguyên tố, cộng thêm hình ảnh nữa — thế là xong.']
  ],
  'cups-c1': [
    ['other', 'Nhìn hình ảnh lá bài thấy gì?',
     'Một anh chàng hiệp sĩ còn trẻ đang cầm ly tình yêu, cưỡi ngựa bạch — bạch mã hoàng tử. Nếu bạn nhớ hình ảnh Kỵ Sĩ Kiếm và Kỵ Sĩ Gậy, hai anh đó cưỡi ngựa xông pha phi rất nhanh; còn con ngựa này thì đi chậm rãi, nên cảm giác là anh này vừa đi vừa tận hưởng cuộc sống, tận hưởng cái đẹp của cuộc sống và của tình yêu. Anh này nhẹ nhàng hơn, bình tĩnh hơn, yêu đời hơn hai anh Kỵ Sĩ kia, và có cái gì đó đậm chất nghệ sĩ, đậm chất thơ hơn.'],
    ['other', 'Từ khóa lớn nhất của lá này là gì?',
     'Sự đa tình. Ly là cảm xúc, tình cảm, đam mê; Kỵ Sĩ là cái tầm tuổi mười bảy mười tám đôi mươi — nhiều sức khỏe, nhiều lửa, nhiều nhiệt huyết bên trong nhưng còn thiếu kinh nghiệm sống, cái tuổi mà người ta hay nói "nhiệt tình cộng ngu dốt bằng phá hoại". Anh ta chưa thuần thục nguyên tố Ly, tức là chưa thuần thục chuyện tình cảm, mà lại rất nhiều nhiệt huyết bên trong. Nên đôi khi họ để cảm xúc lấn át, để cảm xúc kiểm soát họ thay vì họ kiểm soát cảm xúc.'],
    ['other', 'Miêu tả tính cách một người?',
     'Khá thất thường: vui thì khiến cả phòng vui theo, mà buồn bực thì thái độ và hành động khiến cả phòng buồn bực theo. Trong tình cảm thì rất lãng mạn, rất ngọt ngào — nhưng cũng vì lãng mạn ngọt ngào quá mà dẫn đến đa tình, mà không biết là mình đang làm sai. Đây là kiểu người hành động theo bản năng, theo cảm xúc, và hành động theo những gì họ cảm thấy tốt hay không tốt chứ không theo lẽ đúng lẽ sai. Nếu họ cảm thấy tốt khi yêu hai người cùng một lúc thì họ sẽ yêu hai người cùng một lúc, không hề có một sự đánh giá lý trí nào về hành động của mình.'],
    ['other', 'Vì sao đây là cấp độ tiêu cực nhất trong bốn cấp Hoàng Gia?',
     'Bởi vì năng lượng thì thừa mà lại không biết cách kiểm soát nguyên tố mình đại diện. Cậu bé Tiểu Đồng cũng không biết cách kiểm soát nguyên tố, nhưng có phần ngây thơ hơn và năng lượng cũng không nhiều bằng thanh niên — nhi đồng thì còn ngây thơ khờ dại, bảo là nghe. Còn thanh niên thì bảo cũng không nghe: cái tôi rất cao, cao một cách không cần thiết.'],
    ['love', 'Anh ta / cô ta nghĩ gì về tôi, thái độ thế nào với mối quan hệ này?',
     'Có thể tại thời điểm hiện tại thì họ yêu thương bạn thật. Nhưng họ khá là kiểu nhà thơ hay nghệ sĩ: lúc này thì họ yêu bạn lắm, họ làm thơ gửi bạn, viết thư gửi bạn, vẽ tranh tặng bạn — nhưng vài tháng sau, khi cái nhiệt huyết dành cho bạn hết rồi, thì thôi, họ đi làm thơ vẽ tranh tặng người khác. Kỵ Sĩ Ly là như thế: yêu nhiều một cách không cần thiết.'],
    ['love', 'Hồi trẻ tôi thấy kiểu người này lãng mạn lắm mà?',
     'Đúng, hồi còn trẻ bạn sẽ thấy "anh này lãng mạn quá, anh ấy viết thư tặng mình, vẽ tranh tặng mình, thích thế". Nhưng càng có tuổi bạn sẽ nhận ra trong một mối quan hệ thì cái bạn cần nhất là sự ổn định và cân bằng, chứ không phải kiểu người quá cảm xúc như thế này. Kể cả trong quan hệ bạn bè hay gia đình cũng vậy, quan trọng nhất vẫn là sự ổn định. Đó là lý do vì sao những cung Đất tuy nhạt nhẽo nhưng chúng ta nên có một người bạn mang năng lượng Đất, hoặc yêu một người mang năng lượng Đất: nhạt nhẽo đấy, nhưng ở bên cạnh họ bạn cảm thấy rất an toàn, an tâm.'],
    ['love', 'Hai đứa tôi hay cãi nhau, cần làm thế nào?',
     'Một trong hai hoặc cả hai là kiểu để cảm xúc dẫn dắt. Ai chả có cảm xúc, nhưng đây là kiểu mà khi cảm xúc đến thì lý trí, logic dẹp hết sang một bên, cứ bay theo cảm xúc của mình đã. Cách khắc phục: dẹp cảm xúc sang một bên, ngồi nói chuyện chân thành với nhau, dẹp cái tôi và lòng tự tôn không cần thiết lại. Đôi khi vấn đề của hai bạn có thể được giải quyết rất nhanh bằng một cuộc hội thoại chân thật như thế, thay vì bực tức lên rồi bắt đầu chửi rủa người kia, thậm chí xông vào đánh nhau.'],
    ['love', 'Cả hai đứa tôi đều mang năng lượng này thì sao?',
     'Thì mối quan hệ này lúc vui thì rất vui, thậm chí chuyện chăn gối cũng tốt, cũng hợp nhau, cả hai đều có cái gì đó hơi điên rồ. Nhưng lúc không vui thì tương đối độc hại.'],
    ['other', 'Có nên để cảm xúc bộc lộ hết ra không?',
     'Đôi khi chúng mình phải xuôi theo cảm xúc của mình: buồn thì phải khóc, vui thì cười. Nhưng nếu bạn không có sự cân bằng, không biết cách kiểm soát cảm xúc và để nó bộc lộ một cách thái quá thì cuộc sống của bạn sẽ cực kỳ khổ sở và vật vã — nhất là trong môi trường chuyên nghiệp như học tập hay công việc. Bạn buồn thì sếp có quan tâm không? Bạn vẫn phải làm việc, vẫn phải hoàn thành đúng hạn. Bạn không thể nhắn tin cho giáo viên của mình rằng "thầy ơi hôm qua em mới chia tay người yêu, thầy cho em nộp trễ một tuần nhé" — bạn nghĩ thầy cô có đồng ý không?'],
    ['career', 'Thời gian tới tôi có tìm được công việc mới ưng ý không?',
     'Hơi khó, và có hai trường hợp. Một là bạn tìm được công việc bạn cũng khá thích, nhưng lá này chưa nói lên được vấn đề tài chính hay khả năng thăng tiến của bạn. Hai là bạn vẫn chưa tìm được việc, bởi vì cái thái độ và cách tìm việc của bạn: bạn để cảm xúc lên đầu, nên lúc phỏng vấn — nơi cần sự chuyên nghiệp — bạn lại nói chuyện theo kiểu cảm xúc. Bạn cảm thấy không thích công ty này, cảm thấy không hợp, thế là thôi không đi phỏng vấn nữa, mặc dù đã tốt nghiệp sáu tháng và sắp hết tiền tiêu.']
  ],
  'pentacles-c1': [
    ['other', 'Miêu tả tính cách một người?',
     'Khi sếp bảo làm gì, hay ai đó bảo phải đi, hay khi anh ta có một mục tiêu, thì anh ta sẽ làm đến cùng. Và được cái là trong mối quan hệ thì đây là người chung thủy, chung thành — tuy có phần nhạt nhẽo. Trái ngược hẳn với anh Kỵ Sĩ Ly: rất vui, rất lãng mạn nhưng lại không chung thủy.'],
    ['other', 'Mặt tiêu cực của lá này là gì?',
     'Những người mang năng lượng kiểu này, một khi đã tin thì họ không question, không tự hỏi "những gì mình đang làm là đúng hay sai nhỉ". Mình được dạy như thế thì mình biết như thế thôi. Nói một cách nặng nề hơn thì Kỵ Sĩ Xu là người thiển cận và nông cạn.'],
    ['love', 'Anh ta / cô ta muốn gì ở tôi và ở mối quan hệ này?',
     'Với Kỵ Sĩ Xu thì người ta muốn kết hôn, và họ là người khá chung thủy trong tình cảm. Tuy nhiên họ cứng đầu, họ nông cạn, họ nhạt nhẽo. Còn bạn có thích người như thế hay không thì nằm ở bạn. Người đọc bài chỉ phân tích người này cho bạn chứ không khuyên bạn nên hay không nên yêu người này, vì lúc đấy sẽ bị ảnh hưởng bởi điểm nhìn cá nhân, chủ quan của reader: nếu reader thích kiểu người này thì sẽ bảo bạn yêu đi, còn nếu không thích thì sẽ bảo "chán lắm, yêu làm gì".'],
    ['love', 'Vì sao hai đứa tôi hay cãi nhau?',
     'Một trong hai hoặc cả hai có xu hướng không chịu lắng nghe, không chịu mở lòng và luôn cho rằng quan điểm của mình là đúng. Có những người từ chối nhìn cuộc sống, nhìn tình huống dưới góc độ của người khác, mà không nhận ra rằng mỗi chúng ta sinh ra trong một môi trường khác nhau, nhận được nền giáo dục khác nhau, thậm chí tính cách vốn đã khác — rất nhiều yếu tố hình thành nên những quan điểm sống khác nhau.'],
    ['other', 'Ví dụ về sự thiển cận của lá này?',
     'Kiểu như một anh người Việt Nam ra nước ngoài, sang phương Tây, thấy văn hóa khác mình thì kết luận luôn "đúng là cái bọn abc". Anh ta không nhận ra rằng mỗi đất nước có một nền văn hóa khác nhau nên cư xử khác nhau; anh ta chỉ hiểu là khác mình tức là xấu. Trong mối quan hệ hai bạn cũng có thể đang như thế: cho rằng người kia cư xử khác mình tức là xấu, khác mình là sai và phải thay đổi. Đó là thiếu đi sự mở lòng, thiếu tư duy rộng mở để chấp nhận và để nhìn tình huống từ điểm nhìn của người khác — mặc dù hai bạn vẫn rất chung thành với nhau.'],
    ['career', 'Tôi thất nghiệp mấy tháng rồi, có tìm được công việc như ý không?',
     'Có thể tìm được công việc, có thể có được công việc; còn có "như ý", có thích lắm hay không thì chưa biết. Chỉ biết là trong công việc này, nếu nói về mức độ tiền bạc thì cũng tạm ổn. Cứ có Xu là ngay lập tức mình hiểu là khoản tiền bạc cũng tạm ổn.'],
    ['money', 'Kỵ Sĩ Xu có kém về tiền bạc không?',
     'Không hề kém đâu nhé. Kỵ Sĩ Xu là kiểu người khi đã có mục tiêu tài chính, mục tiêu vật chất là làm đến cùng để đạt được mục tiêu đấy. Thế nên về khoản vật chất, lương thưởng hay khả năng thăng tiến trong công việc mới này thì không đến nỗi nào. Còn môi trường như thế nào, ở lâu được hay không, bạn có thích công việc đó không thì phải rút thêm lá — đôi khi có những công việc lương rất cao, cơ hội thăng tiến tốt, nhưng mình không thích, đơn giản vì mình cảm thấy không được là chính mình trong công việc này.'],
    ['career', 'Tôi đang làm văn phòng bình thường, thời gian tới có thay đổi gì không?',
     'Có thể thời gian tới bạn sẽ tìm được hoặc xác định được một mục tiêu nào đó trong công việc, và bạn chăm chỉ để đạt được mục tiêu đó. Cũng có thể là bây giờ đã tìm được rồi, đang chăm chỉ rồi, thì thời gian tới tiếp tục chăm chỉ thôi. Kỵ Sĩ Xu là người rất chăm, không hề lười — chỉ là khoản đầu óc tư duy thì không sáng sủa cho lắm.'],
    ['other', 'Kỵ Sĩ Xu khác Kỵ Sĩ Gậy ở chỗ nào trong công việc?',
     'Kỵ Sĩ Xu là kiểu người mà vua bảo hay sếp bảo "bây giờ mày làm cái này cho tao" thì sẽ làm, gần như không hỏi tại sao. Còn anh Kỵ Sĩ Gậy thì nhiều suy nghĩ hơn, có thể sẽ hỏi. Kỵ Sĩ Xu thì "okay, đây là trọng trách, trách nhiệm của mình". Vì thế nên có mặt tích cực mà cũng có mặt tiêu cực, tùy vào những lá đi kèm, tùy vào tình huống và câu hỏi, và tùy vào trực giác của reader.']
  ]
});

Object.assign(ASK.en, {
  'wands-c1': [
    ['other', 'What are the keywords for this card?',
     'The fire of youth. But that energy does not automatically mean something bad — it depends. If you are asking while you have gone lazy and stagnant, then this fiery enthusiasm is exactly what you need. But if you are already over-using that youthful fire, you will burn yourself: scorched by the very flame you made, because you could not control it.'],
    ['other', 'How does a Knight differ from a Page, a Queen or a King?',
     'Remember this from the reader: the Knight in all four elements is the type who has not truly mastered their element, whereas the Queen and the King have. The Page has only just begun exploring, so he has not had time to do anything reckless yet. The Knight is the one who does the reckless, stupid things — what we call being a cocky kid. The Page is only eleven or twelve, still a child, who does not know anything yet.'],
    ['love', 'What does he or she feel for me?',
     'What they feel for you is a desire, a passion of the moment. It gives the impression of a flame: one that flares up easily will also go out easily. So do not put high hopes on this relationship. But do not push the person away either — keep getting to know each other for another month or two, and if they still hold that heat, then open your heart to them more.'],
    ['love', 'Is there an example of this kind of feeling?',
     'There are people — especially those who have been lonely for years — for whom someone suddenly bursts into their life: "let us be soulmates", "I wrote you a poem", very romantic. And you have been single since the day you were born, so suddenly having someone this romantic is wonderful. Then after a month he turns 180 degrees: "I am bored of you." That is the pattern.'],
    ['love', 'Why do the two of us argue so much?',
     'Because it is too hot. One of you, or both, is running too hot — hot, and neither will give way. Each of you wants to solve the relationship problem your own way, and fast. But in a relationship we should listen to the other side too, find common ground, and choose a solution that works for both. If you fix it your way and they fix it their way, it goes nowhere at all, and the relationship will go nowhere either.'],
    ['other', 'Should I get a reading about my partner?',
     'If you already have a partner and feel there is a problem, do not waste money going to a reader to ask "my partner is doing this and that, what should I do?" The best thing is to ask your partner directly about the relationship between the two of you. If something is wrong, ask them straight out.'],
    ['career', 'Will I find a job I like in the coming period?',
     'It cannot be said for certain. Possibly yes, but this is the kind of job you go into rather fast, rather hastily — if you looked more carefully there are still other opportunities waiting for you. Or you did not ask clearly about the pay, did not read the agreement properly, and signed the contract anyway. Or the job itself has a dynamic quality: a young environment, and possibly a job that has you moving around a great deal, unlike your previous job where you sat in one place.'],
    ['career', 'Is there something wrong with how I am job-hunting?',
     'Your way of looking for work may be all rush: you schedule three interviews in one day, and you hurry through this one so you can dash to the next. The interviewer asks "do you have any questions", and you say "no questions, I am off to another interview." That sort of thing. Which reading applies depends on the accompanying cards and on your intuition at that moment — but hold on to the general energy: this is a man in a great hurry, even though inside there is a lot of heat and a lot of energy.'],
    ['career', 'I have an ordinary office job — what is coming up at work?',
     'Be careful of the tendency to rush and make mistakes. Or in the coming period you will find a new passion at work — but explore that passion slowly and steadily, so it does not affect your main job.']
  ],
  'swords-c1': [
    ['other', 'Describe this person’s character.',
     'Possibly very intelligent, very quick, very rational. But in situations that call for emotion, for compassion or for empathy, he is not good at that side. And if you are not good at that, then however clever you are it is very hard to rise into leadership. That is why the Queen and the King are the ones who lead: the same Swords energy, but the way they behave and the way they control that Swords energy inside them is different.'],
    ['other', 'What do the Knight and the Page have in common?',
     'Both the Page and the Knight are still the type who need someone to lead them. The Knight takes his orders from the king or from a general — he is not the one giving orders to others; he receives the order and goes off to fight.'],
    ['love', 'What does he or she think of me?',
     'On the surface they may say things that make you think "this person is tactless, they have no way with words." But the reader thinks the Knight of Swords can be quite honest, quite sincere with you. Tactless people are usually the sincere ones; it is the excessively glib, excessively smooth-tongued that you need to watch. If you can bear that quality of theirs, or talk to them so they understand and soften a little, then this can be a durable relationship.'],
    ['love', 'Is this the right person for me?',
     'If you are the type who likes to be loved through words, who likes to hear sweet things, or who likes someone attentive to your feelings, then this is not the person for you. This person is quite graceless in matters of love: if they like you they simply say so — "we have not interacted much, be my partner and I will take care of you" — which is rather blunt. But being decisive and determined is a good point.'],
    ['love', 'Why do the two of us argue so much?',
     'This one is obvious: one of you, or both, fights with words when you argue. Words that feel like insults, or that are too cutting, or simply very hard to hear. Every time you flare up you may not only swear but drag both families in, to mock and to needle. That is the negative Knight of Swords energy. A relationship like that is already toxic — good if you can fix it, and if not it is exhausting for both sides.'],
    ['career', 'Will I find a job I like in the coming period?',
     'This person may run into trouble at interviews: things you say during the interview, or your whole manner of interviewing, may be what the interviewer does not like. You should look back at it, reassess your interview process and the way you answer questions.'],
    ['career', 'I keep looking and cannot find work — what should I do?',
     'The Knight of Swords is "I have a target and I go straight at it", so it may be that you only want to work in one particular field and only look for jobs there. In a market this hard you should widen your search area and stop focusing on a single target. The Knight of Swords’ vision is rather like one long straight line: he sees far, but only one target, instead of looking wide.'],
    ['career', 'I have an ordinary office job — will anything change soon?',
     'Your current energy may be the Knight of Swords, so you need to slow down a little: having ideas and targets is fine, but slow down enough to notice what is around you. Or in the coming period you will get into a shouting match with someone at work — either you are the one being shouted at, or you are the one doing the shouting, or both of you at each other. Which one it is depends on the reader’s intuition at that moment and on the accompanying cards.'],
    ['other', 'How should I actually study these cards?',
     'Here I only teach the most core energies of each card. After that, use your own creativity together with your own knowledge and life experience to build a reading of your own. For the court cards: first learn the four royal ranks, know the element by heart, add the imagery — and that is it.']
  ],
  'cups-c1': [
    ['other', 'What do you see in the image?',
     'A young knight holding the cup of love, riding a white horse — the prince on the white horse. If you remember the Knight of Swords and the Knight of Wands, those two are charging along at speed; but this horse walks slowly, so the feeling is of a man who is enjoying life as he rides, enjoying the beauty of life and of love. He is gentler, calmer and more life-loving than the other two Knights, and there is something more of the artist and the poet about him.'],
    ['other', 'What is the single biggest keyword here?',
     'Being amorous. Cups is emotion, feeling, passion; the Knight is around seventeen, eighteen, twenty — plenty of health, plenty of fire, plenty of enthusiasm inside, but short on life experience, the age about which people say "enthusiasm plus ignorance equals destruction." He has not mastered the element of Cups, which is to say he has not mastered matters of the heart, while carrying a great deal of heat inside. So sometimes they let emotion take over, and emotion controls them rather than the other way round.'],
    ['other', 'Describe this person’s character.',
     'Quite moody: when they are happy they make the whole room happy, and when they are upset their attitude and their actions make the whole room upset with them. In love they can be very romantic, very sweet — and precisely because they are so romantic and sweet, it leads to being amorous, without their realising they are doing anything wrong. This is the type who acts on instinct and on feeling, and who acts according to what they feel is good or not good rather than according to right and wrong. If they feel good loving two people at once, they will love two people at once, with no rational assessment of their own behaviour at all.'],
    ['other', 'Why is this the most negative of the four royal ranks?',
     'Because the energy is in excess while they still do not know how to control the element they represent. The Page does not know how to control the element either, but the Page is more innocent and does not have as much energy as a young adult — a child is still innocent and naive, and if you tell them something they listen. Tell a young man something and he will not listen: the ego is very high, high for no good reason.'],
    ['love', 'What does he or she think of me and of this relationship?',
     'At this moment in time they may genuinely love you. But they are rather like a poet or an artist: right now they love you very much, they write poems for you, write you letters, paint pictures for you — and then a few months later, when the enthusiasm for you has burned out, they will go and write poems and paint pictures for somebody else. That is the Knight of Cups: loving in a plural way, quite unnecessarily.'],
    ['love', 'When I was younger I found this type very romantic — what changed?',
     'Yes, when you are young you will think "he is so romantic, he writes me letters, he paints pictures for me, how lovely." But the older you get, the more you realise that what you need most in a relationship is stability and balance, not this excessively emotional type. The same is true of friendships and of family: what matters most is stability. That is why, dull as the Earth signs are, we ought to have a friend who carries Earth energy, or love someone who carries Earth energy — dull, yes, but beside them you feel very safe and at ease.'],
    ['love', 'We argue a lot — what should we do?',
     'One of you, or both, is the type who lets emotion lead. Everyone has emotions, but this is the type where, once the emotion arrives, reason and logic are swept aside and they fly off with the feeling. The remedy: set the emotion aside, sit down and talk sincerely with each other, put down the ego and the unnecessary pride. Sometimes the problem between you can be solved very quickly by an honest conversation like that, instead of flaring up and cursing the other person, or even coming to blows.'],
    ['love', 'What if we both carry this energy?',
     'Then when this relationship is good it is very good — even the bedroom side works and suits you both, and there is something a bit crazy in both of you. But when it is not good, it is fairly toxic.'],
    ['other', 'Should I let all my feelings out?',
     'Sometimes we do have to go with our feelings: sad, we cry; happy, we laugh. But if you have no balance, do not know how to control your emotions, and let them out excessively, then life becomes extremely miserable and exhausting — especially in professional settings like study or work. You are sad, so does your manager care? You still have to do the work and still have to hit the deadline. You cannot message your teacher saying "sir, I broke up with my partner yesterday, let me submit a week late" — do you think the teacher agrees to that?'],
    ['career', 'Will I find a new job I like in the coming period?',
     'It is rather difficult, and there are two cases. One: you find a job you quite like, but this card does not tell you anything about the money side or your prospects for promotion. Two: you still have not found work, because of your attitude and your approach to the search — you put feeling first, so at the interview, where professionalism is required, you talk in an emotional way. You feel you do not like this company, feel it is not a fit, and so you do not go to the interview at all, even though you graduated six months ago and are running out of money.']
  ],
  'pentacles-c1': [
    ['other', 'Describe this person’s character.',
     'When the boss says do something, or someone says go, or when he has a target of his own, he will see it through to the end. And the good part is that in a relationship this is a faithful, loyal person — dull, admittedly. The exact opposite of the Knight of Cups, who is great fun and very romantic but not faithful at all.'],
    ['other', 'What is the negative side of this card?',
     'People carrying this kind of energy, once they believe something, do not question it — they never stop to ask "is what I am doing right or wrong?" I was taught it this way, so this is what I know. Put more harshly, the Knight of Pentacles is narrow and shallow.'],
    ['love', 'What does he or she want from me and from this relationship?',
     'With the Knight of Pentacles the person wants marriage, and they are quite faithful in a relationship. However, they are stubborn, they are shallow, they are dull. Whether you like that kind of person is up to you. the reader only analyses the person for you and does not advise you whether or not to love them, because at that point the reader’s personal, subjective view creeps in: if the reader likes this type they will tell you to go for it, and if they do not, they will say "how boring, why bother."'],
    ['love', 'Why do the two of us argue so much?',
     'One of you, or both, tends not to listen, not to open up, and to insist that your own point of view is the right one. Some people refuse to look at life, or at a situation, from anyone else’s point of view, without recognising that each of us was born into a different environment, received a different education, and even started with a different temperament — a great many factors that build different outlooks on life.'],
    ['other', 'Can you give an example of that narrowness?',
     'Like a Vietnamese man who goes abroad, goes to the West, sees a culture unlike his own and concludes on the spot that "these people really are such-and-such." He does not recognise that each country has a different culture and therefore behaves differently; he only understands that different from me means bad. The two of you may be doing the same thing in your relationship: assuming that because the other behaves differently they are bad, that different from me is wrong and must change. What is missing is openness — an open enough mind to accept another point of view and to look at the situation from where the other person is standing — even though the two of you are still very loyal to each other.'],
    ['career', 'I have been unemployed for months — will I find the job I want?',
     'You may well find a job, you may well get the job; whether it is truly the one you wanted, whether you will like it a great deal, is not yet clear. What is clear is that as far as money goes, this job is reasonably all right. Whenever there is a Pentacle we understand immediately that the money side is more or less fine.'],
    ['money', 'Is the Knight of Pentacles bad with money?',
     'Not at all. The Knight of Pentacles is the type who, once he has a financial or material goal, works at it to the end to reach it. So on the material side — the pay, the bonuses, the promotion prospects in this new job — things are not bad at all. As for what the environment is like, whether you can stay long, whether you will actually like the work, you would need to draw more cards: sometimes a job pays very well and has good promotion prospects, and still you do not like it, simply because you feel you cannot be yourself in it.'],
    ['career', 'I have an ordinary office job — will anything change soon?',
     'In the coming period you may find or settle on some goal at work, and you will work hard to reach it. Or you may already have found it and already be working hard, in which case the coming period is simply more of that hard work. The Knight of Pentacles is a very hard worker and not lazy at all — it is only the thinking side that is not especially bright.'],
    ['other', 'How does the Knight of Pentacles differ from the Knight of Wands at work?',
     'The Knight of Pentacles is the type who, when the king or the boss says "do this for me now", does it, and almost never asks why. The Knight of Wands thinks more and may well ask. The Knight of Pentacles says "all right, this is my charge, my responsibility." So there is a positive side and a negative side, depending on the accompanying cards, on the situation and the question, and on the reader’s intuition.']
  ]
});

/* batch 21 - the four Queens */
Object.assign(KW.vi, {
  'wands-c2': { pos: ['tự tin, có phong thái tự tin','biết mình là ai, giỏi cái gì và kém cái gì','có tài lãnh đạo, biết lúc nào mềm mỏng lúc nào cương','cân bằng được năng lượng nam và nữ tính','thật lòng, thẳng thắn với cảm xúc của mình','biết lúc nào cần hành động, lúc nào cần ngồi yên quan sát'],
                neg: ['thiếu năng lượng Nữ Hoàng thì thành nóng tính với nhau','có điều không ưa nhau nhưng không dám nói ra'] },
  'swords-c2': { pos: ['thông minh, IQ cao, ăn nói sắc sảo, tư duy sắc bén','biết lúc nào nên nói lúc nào nên im lặng lắng nghe','giữ được sự khiêm tốn','thật lòng theo kiểu thực tế, không lợi dụng ai','công việc mang tính đầu óc, học thuật, nghiên cứu'],
                 neg: ['quá thực tế trong chuyện tình cảm','không lãng mạn, không hợp với người cần kết nối sâu sắc','giận cá chém thớt: bắt lỗi vặt thay vì nói ra vấn đề thật','có thể lạnh lùng cắt đứt liên lạc'] },
  'cups-c2': { pos: ['đã làm chủ được cảm xúc của mình, EQ cao','đã chữa lành cho bản thân xong','không ngại bộc lộ điểm yếu của mình cho thế giới thấy','biết yêu thương và chăm sóc người khác','nghiêm túc trong chuyện tình cảm','từ chối khéo, nhẹ nhàng, tinh tế','công việc mang năng lượng chăm sóc, chữa lành'],
               neg: ['gần như không có nghĩa tiêu cực khi đứng một mình','chỉ mềm quá, yếu quá khi tình huống cần năng lượng Kiếm hoặc Gậy'] },
  'pentacles-c2': { pos: ['có tiền, biết kiếm tiền, hoặc sinh ra đã có điều kiện','tự thấy mình sung túc, đủ đầy','rộng lượng trong việc trao đi nguồn lực để giúp người khác','sẵn sàng chăm sóc người khác bằng nguồn lực của mình','thật thà','công việc tốt, thu nhập ổn, nhiều cơ hội vật chất'],
                    neg: ['thực tế trong tình cảm, không xuất phát từ trái tim','dễ rơi vào mối quan hệ một chiều: một người cho, một người chỉ biết nhận'] }
});

Object.assign(KW.en, {
  'wands-c2': { pos: ['confident, with a confident bearing','knows who they are, what they are good at and what they are not','a natural leader who knows when to be soft and when to be firm','balances masculine and feminine energy','sincere, and straightforward about their feelings','knows when to act and when to sit still and observe'],
                neg: ['without the Queen’s energy it turns into two hot tempers','things you dislike about each other that neither dares say'] },
  'swords-c2': { pos: ['intelligent, high IQ, sharp of speech, sharp of mind','knows when to speak and when to be quiet and listen','keeps their humility','sincere in a practical way, not out to use anyone','work of the mind: academic, scientific, research'],
                 neg: ['too practical about love','not romantic, and wrong for anyone who needs a deep connection','takes it out on small things instead of naming the real problem','can go cold and cut contact'] },
  'cups-c2': { pos: ['has mastered their own emotions; high EQ','has finished the work of healing themselves','not afraid to show the world their weak side','knows how to love and care for other people','serious about a relationship','refuses gracefully, gently, with tact','work that carries the energy of caring and healing'],
               neg: ['almost no negative meaning when it stands alone','only too soft, too weak where the situation calls for Swords or Wands'] },
  'pentacles-c2': { pos: ['has money, knows how to make money, or was born with means','sees themselves as well-off and having enough','generous in giving their resources to help people','ready to take care of others with what they have','honest','a good job, steady income, plenty of material opportunity'],
                    neg: ['practical about love rather than coming from the heart','can slide into a one-sided relationship: one gives, the other only takes'] }
});

Object.assign(ASK.vi, {
  'wands-c2': [
    ['other', 'Nhìn hình ảnh lá bài thấy gì?',
     'Một Nữ Hoàng ngồi trên ngai vàng, một tay cầm gậy, một tay cầm hoa hướng dương. Để hiểu bộ Hoàng Gia một cách dễ nhất thì đầu tiên bạn nhớ cho mình ý nghĩa năng lượng của từng nguyên tố — Gậy, Kiếm, Xu, Ly — tiếp theo là nhớ ý nghĩa của từng cấp độ: Tiểu Đồng, Kỵ Sĩ, Nữ Hoàng, Vua.'],
    ['other', 'Nữ Hoàng khác Vua ở chỗ nào?',
     'Nữ Hoàng và Vua là hai cấp độ đã thuần thục nguyên tố mà nó đại diện. Không phải ai cấp độ cao hơn ai — Nữ Hoàng và Vua thật ra đứng cạnh nhau, chỉ khác ở chỗ Nữ Hoàng thì nữ tính hơn, hướng nội hơn, còn Vua thì nam tính, mạnh mẽ và chủ động hơn. Bạn cứ tưởng tượng Nữ Hoàng giống lá Nữ Tư Tế hay Hoàng Hậu cộng thêm năng lượng của nguyên tố, còn Vua thì giống lá Hoàng Đế cộng thêm nguyên tố.'],
    ['other', 'Vì sao Nữ Hoàng Gậy cân bằng hơn Vua Gậy?',
     'Gậy là năng lượng nam tính, Nữ Hoàng là năng lượng nữ tính, nên Nữ Hoàng Gậy cân bằng được năng lượng nam nữ trong người nhiều hơn Vua Gậy. Vua Gậy là nam tính cộng nam tính nên đôi khi nóng quá, hơi áp chế người khác. Cả Vua Gậy và Nữ Hoàng Gậy đều có tài lãnh đạo, nhưng Vua Gậy thì kiểu cầm đầu kéo mọi người đi, còn Nữ Hoàng Gậy cũng cầm đầu kéo đi nhưng biết lúc nào cần mềm mỏng, lúc nào để cho người khác đi phía trước. Nữ Hoàng luôn biết cách mềm mỏng, dịu dàng, biết lúc nào nhu lúc nào cương.'],
    ['other', 'Miêu tả tính cách một người?',
     'Không quan trọng nam hay nữ: người này tự tin, có phong thái tự tin, và bản thân họ biết họ là ai, biết họ giỏi cái gì, kém cái gì. Nói về tài năng thì có thể cũng bình thường thôi, nhưng chính vì cái phong thái tự tin đó mà mọi người đi theo họ, ngưỡng mộ họ, tôn trọng họ và để họ lên làm lãnh đạo — bởi họ biết họ đang làm gì. Người làm lãnh đạo chưa chắc đã là người giỏi nhất, nhưng họ biết họ đang đi đâu nên mới có người đi theo sau. Có những người rất giỏi nhưng bản thân không biết nên đi đâu về đâu, nên phải làm cấp dưới. Người này thì biết cần đi đâu, lúc nào cần đi lúc nào cần dừng, rẽ trái rẽ phải, tiến hay lùi.'],
    ['other', 'Phong thái của Nữ Hoàng Gậy là như thế nào?',
     'Nhìn cái dáng ngồi là thấy tự tin — không phải kiểu đứng lên đi lại lo lắng, mà ngồi một chỗ quan sát xung quanh, vẫn ngồi thẳng lưng, biết mình là Nữ Hoàng, biết mọi người phải nghe theo mình nhưng lại không cần phải ép ai. Trước hết đây là người có nhiệt huyết, có đam mê, nhưng biết lúc nào cần hành động lúc nào không, mà vẫn giữ được sự hướng nội và nữ tính của mình.'],
    ['love', 'Anh ta / cô ta có tình cảm với tôi không?',
     'Có. Và đây là một tình cảm khá thành thật, không vụ lợi. Người này cũng khá thẳng thắn với cảm xúc của họ: họ yêu bạn thì họ nói là yêu, nói A là A, nói B là B. Thế nên nếu ra lá này cho tình cảm người ta dành cho bạn thì Người đọc bài nói luôn: bạn gặp được người này là may mắn rồi.'],
    ['love', 'Hai đứa tôi hay cãi nhau, cần làm gì để cải thiện?',
     'Đây là lời khuyên từ lá bài. Có thể hai bạn đang ở trong trạng thái thiếu năng lượng Nữ Hoàng: hơi nóng tính với nhau quá, cả hai đều là kiểu nóng tính, nên cần năng lượng nữ tính của Nữ Hoàng để kìm cái nóng bỏng của Gậy xuống — nếu không thì một khi đã nóng lên là lao vào nhau chửi bới, ném đồ đạc, đánh nhau. Trường hợp thứ hai: Nữ Hoàng Gậy là lá của sự tự tin, nên có thể cặp đôi này có những điều không ưa về nhau mà lại không dám nói ra. Cần sự thẳng thắn — thẳng thắn chứ không phải chỉ trích — cần giao tiếp thẳng thắn, nói chuyện thẳng thắn với nhau.'],
    ['career', 'Thời gian tới tôi có tìm được công việc như ý không?',
     'Trong thời gian vừa rồi bạn đã chủ động rải CV rồi, và bây giờ là lúc bạn nên ngồi chờ — ngồi chờ như Nữ Hoàng ngồi, chờ người ta gọi đi phỏng vấn chỗ này chỗ kia. Có thể người ta bảo sang năm họ mới bắt đầu phỏng vấn. Cứ ngồi chờ và quan sát. Không phải là bạn không hành động nữa — bạn cứ tiếp tục rải CV — nhưng thời gian qua bạn hành động đủ rồi.'],
    ['career', 'Tôi thất nghiệp mãi mà chưa ai gọi, phải làm sao?',
     'Nếu bạn cảm thấy khó khăn thì cũng đừng sồn sồn lên khi chưa nhận được một thông báo hay một cuộc gọi phỏng vấn nào. Cứ bình tĩnh, và bạn phải tự tin — đây là lá Nữ Hoàng, bạn phải tự tin. Bạn biết rằng bạn giỏi, CV của bạn đẹp, khả năng phỏng vấn của bạn tốt; bạn phải tự tin vào điều đó. Việc bạn thất nghiệp chẳng qua là đen đủi, không may mắn thôi, chứ có ai muốn đâu.'],
    ['career', 'Tôi đang làm văn phòng bình thường, thời gian tới công việc có gì thay đổi không?',
     'Có thể trong thời gian tới bạn có khả năng lên làm lãnh đạo, hoặc được đề bạt vào một vị trí có chức có quyền — không nhất thiết là sếp hay trưởng phòng, mà có thể chỉ là trưởng nhóm dự án, và hết dự án đấy thì bạn lại trở thành nhân viên bình thường. Hoặc là bạn được sếp cử đi chỉ bảo cho nhân viên mới: có hai ba bạn nhân viên mới kém bạn mấy tuổi, và sếp bảo "bây giờ bạn là mentor cho chúng nó, bạn là người hướng dẫn cho chúng nó".']
  ],
  'swords-c2': [
    ['other', 'Nhìn hình ảnh lá bài thấy gì?',
     'Một Nữ Hoàng tay cầm kiếm, ngồi trên ghế đá trên đỉnh núi, trông có vẻ rất cứng rắn. Kiếm là năng lượng của tư duy, đầu óc, phân tích, logic, giao tiếp, trí tuệ. Nữ Hoàng và Vua là hai cấp độ trong bộ Hoàng Gia đã có khả năng kiểm soát và giỏi trong các lĩnh vực liên quan đến nguyên tố của nó — nhưng Nữ Hoàng thì nữ tính hơn, hướng nội hơn, mang năng lượng chăm sóc và duy trì nhiều hơn là năng lượng hành động.'],
    ['other', 'Miêu tả tính cách một người?',
     'Không quan trọng trai hay gái: người này có đầu óc, có khả năng ăn nói, tư duy tốt. Thậm chí có thể nói người này thông minh, có trí tuệ, IQ cao, ăn nói sắc sảo, tư duy sắc bén nhạy bén — không còn gì để chê.'],
    ['other', 'Người này có độc mồm không?',
     'Không. Cái người hay làm phật lòng người khác là Kỵ Sĩ Kiếm hoặc Vua Kiếm, vì Kiếm vẫn là năng lượng nam tính và Vua cũng là năng lượng nam tính — nam tính cộng nam tính thì đôi khi thiếu sự tinh tế trong lời nói, trong suy nghĩ. May là Nữ Hoàng là năng lượng nữ tính, cân bằng lại năng lượng nam tính của Kiếm. Nên Nữ Hoàng Kiếm ăn nói sắc bén nhưng vẫn biết lúc nào nên nói, lúc nào nên im lặng lắng nghe. Trừ khi đi kèm những lá xấu thì mới khác. Đây là một người thông minh, có tài ăn nói nhưng giữ được sự khiêm tốn: không phải là không biết mình thông minh, họ biết mình giỏi, nhưng không phải kiểu thích thể hiện, kiểu ra vẻ "tôi đây tôi biết". Và họ biết lời nói của mình có thể làm tổn thương người khác nên không phải cứ nghĩ gì là nói nấy.'],
    ['love', 'Tình cảm người này dành cho tôi thế nào?',
     'Họ có tình cảm đấy, nhưng tình cảm của họ không phải theo kiểu lãng mạn, mà cũng không phải là lợi dụng bạn. Có thể là họ quá thực tế trong chuyện tình cảm: họ thích bạn, và ngoài việc thích bạn ra họ sẽ liệt kê một loạt lý do nữa — mình với họ có hoàn cảnh gia đình giống nhau, môn đăng hộ đối, thế thì kết hôn sẽ hạnh phúc hơn, yên bình hơn; mình với họ học vấn ngang nhau, thế thì kết hôn cũng sẽ hợp hơn về khoản đầu óc, nói chuyện.'],
    ['love', 'Người này có thật lòng không?',
     'Người mang năng lượng Nữ Hoàng Kiếm có thể đang tìm kiếm một người bạn đời có đầu óc, nhưng người này hoàn toàn không phải muốn lợi dụng bạn — họ chỉ đang xét những gạch đầu dòng mang tính thực tế trong mối quan hệ mà thôi. Còn người mang năng lượng Ly thì đơn giản là "trái tim tôi đập bùm bùm khi đứng trước cô ấy, tôi muốn cưới". Nữ Hoàng Kiếm thì đơn giản là lý tính, chứ không phải xấu, không phải theo nghĩa lợi dụng. Người này có thật lòng, nhưng cái thật lòng của họ có thể hơi khác với thật lòng của bạn.'],
    ['love', 'Đây có phải người dành cho tôi không?',
     'Nếu bạn là kiểu vừa muốn tìm một người có kết nối sâu sắc, nhìn thấy nhau là không cần biết hoàn cảnh gia đình như thế nào, hai trái tim cùng một nhịp đập là yêu nhau, thì người này không dành cho bạn.'],
    ['love', 'Vì sao hai đứa tôi hay cãi nhau?',
     'Có cãi nhau, nhưng có vẻ như vấn đề thật thì lại không nói ra. Có thể hai bạn đang cãi nhau những chuyện rất nhỏ nhặt vụn vặt, mà có xu hướng giận cá chém thớt: bạn không thích một điểm nào đó ở đối phương nhưng vì lý do gì đó lại không dám nói thẳng với họ, mà trong lòng vẫn bực bội, nên bạn bắt lỗi cái này bắt lỗi cái kia, còn người ta thì không hiểu tại sao cứ bị bắt lỗi như thế — trong khi vấn đề thật sự thì chưa được giải quyết. Nữ Hoàng Kiếm ở đây khuyên hai bạn hãy thành thật với nhau hơn và nói ra điều thật sự trong lòng.'],
    ['love', 'Có ví dụ nào cho kiểu cãi nhau đó không?',
     'Ví dụ người yêu bạn có một người bạn thân, bạn có ghen đấy nhưng bạn cảm thấy mình không có tư cách để ghen vì hai người đó đã chơi với nhau từ lâu lắm rồi. Thế là bạn dỗi, nhưng bạn lại không nói là "em đang dỗi", mà bạn đi bắt lỗi những thứ khác người ta làm, và nhìn cái gì cũng thấy ngứa mắt. Xu hướng này rất hay gặp ở các bạn trẻ; còn những bạn đã có tình trường dài, có kinh nghiệm trong tình cảm hoặc đã lớn tuổi rồi thì thường không mất thời gian cho những chuyện như thế — không thích thì nói thẳng ra, đỡ tốn thời gian của nhau.'],
    ['career', 'Thời gian tới tôi có tìm được công việc như ý không?',
     'Có thể tìm được, và lá này sẽ miêu tả luôn công việc của bạn: công việc mang tính đầu óc nhiều, mang tính học tập, học thuật, nghiên cứu nhiều hơn là công việc hành chính. Và trong công việc bạn phải giao tiếp nhiều — không phải giao tiếp kiểu truyền thông marketing, mà là giao tiếp trên nền tảng lập luận, cơ sở khoa học.'],
    ['career', 'Tôi đang làm văn phòng bình thường, thời gian tới có thay đổi gì không?',
     'Có thể trong thời gian tới bạn sẽ được cất nhắc lên vị trí lãnh đạo, có chức có quyền — dù sao đây cũng là lá Nữ Hoàng. Và ở vị trí này thì bạn phải nghĩ nhiều hơn, phải nói nhiều hơn, phải dùng não và dùng mồm nhiều hơn, hoặc cả hai. Hoặc là thời gian tới bạn sẽ phải đi chỉ bảo, hướng dẫn nhiều hơn.']
  ],
  'cups-c2': [
    ['other', 'Nhìn hình ảnh lá bài thấy gì?',
     'Một Nữ Hoàng ngồi trên ngai vàng, tay cầm ly, nhìn cái ly có vẻ rất âu yếm trìu mến. Bạn nào nhớ bài giảng của hai Nữ Hoàng trước — Nữ Hoàng Gậy và Nữ Hoàng Kiếm — thì cả hai nàng đó trông có vẻ sắc sảo và khó tính hơn, còn Nữ Hoàng này thì mềm mỏng hơn. Kể cả cái ghế nàng ngồi cũng được trang trí hình các thiên thần, các em bé thiên thần; nàng ngồi trên một thảo nguyên, có cây cối mọc dưới chân, có nước chảy. Tất cả những chi tiết nhỏ đó đều gợi cho chúng ta cảm giác nữ tính và nhẹ nhàng.'],
    ['other', 'Miêu tả tính cách một người?',
     'Người này đã làm chủ được cảm xúc của mình rồi: họ biết thứ gì khiến họ vui, thứ gì khiến họ buồn, và họ cũng sẵn sàng trao đi tình cảm, trao đi trái tim của mình cho người khác. Về lĩnh vực cảm xúc thì người này EQ cao. Cả Nữ Hoàng Ly và Vua Ly đều là những người EQ cao, khác với Tiểu Đồng Ly và nhất là khác với Kỵ Sĩ Ly — anh Kỵ Sĩ Ly thì có cái gì đấy trăng hoa một chút.'],
    ['other', 'Vì sao nói người này đã chữa lành cho bản thân?',
     'Ở người Nữ Hoàng Ly mình luôn cảm nhận được đây là một người đã hoàn thành công tác chữa lành cho bản thân. Thứ nhất, họ biết họ có những điểm nào yếu đuối và họ không ngần ngại bộc lộ điểm yếu đó ra cho thế giới thấy. Bạn đừng nghĩ những người mạnh mẽ đều là những người tỏ ra cứng rắn — người mạnh mẽ nhất là người không ngại thể hiện mặt yếu đuối, mặt xấu xí của mình cho người khác thấy, bởi họ biết kể cả khi để lộ mặt đó ra thì người khác cũng không thể làm đau hay làm tổn thương họ, vì họ biết họ là ai. Họ làm chủ cảm xúc của họ rồi, họ không ngại bị chê, không sợ bị chỉ trích. Và họ cũng rất biết cách yêu thương chăm sóc người khác — biết yêu thương chăm sóc bản thân là một chuyện, biết cách yêu thương chăm sóc người khác lại là chuyện khác. Bạn nào mà có được người yêu mang năng lượng của Nữ Hoàng Ly thì không còn gì để chê.'],
    ['love', 'Tình cảm anh ta / cô ta dành cho tôi thế nào?',
     'Không có gì để chê. Có thật lòng không? Có thật lòng. Mà trong chuyện tình cảm, muốn biết người khác thật lòng hay không chẳng phải là quan trọng nhất hay sao? Có thật lòng, và người này biết cách thể hiện cảm xúc của họ, biết cách chăm sóc bạn.'],
    ['love', 'Vì sao hai đứa tôi hay cãi nhau?',
     'Có vẻ như một người thì mang năng lượng của Nữ Hoàng Ly còn người kia thì ngược lại — tức là một người thật sự nghiêm túc và muốn đầu tư cho mối quan hệ. Nhớ rằng Nữ Hoàng Ly là người nghiêm túc trong chuyện tình cảm: những người này không muốn trò chơi, không muốn đùa giỡn, không muốn tốn thời gian. Thế nên trong mối quan hệ hay cãi nhau thì có thể một người thì muốn lâu dài bền vững, còn một người thì chỉ muốn chơi bời, chỉ muốn yêu tại thời điểm này thôi. Đó là lý do vì sao hai bạn không thể tìm được tiếng nói chung: một người thì cố gắng và sẵn sàng thay đổi trong mối quan hệ cho người còn lại, còn người kia thì coi việc đối phương thay đổi là điều nghiễm nhiên, mà bản thân thì không có ý định thay đổi, không có ý định nghiêm túc.'],
    ['love', 'Người này từ chối người khác như thế nào?',
     'Không phải kiểu lạnh lùng cắt đứt liên lạc đột ngột giống Nữ Hoàng Kiếm. Người này kể cả khi biết là bạn đang chơi đùa với họ và họ không muốn đáp lại, thì họ cũng từ chối khéo, từ chối nhẹ nhàng. Vua Ly thì có thể thẳng thắn hơn một chút, còn Nữ Hoàng Ly thì rất nhẹ nhàng, rất khéo léo và tinh tế.'],
    ['career', 'Thời gian tới tôi có tìm được công việc ưng ý không?',
     'Có tìm được, và ra lá này thì có hai hướng. Thứ nhất: bạn thích công việc của bạn — đây là năng lượng của cảm xúc mà — nhưng công việc đó có đem lại nhiều tiền hay không, thăng tiến tốt hay không thì chưa biết, vì nó phụ thuộc vào tiêu chuẩn của bạn. Nếu tiêu chuẩn của bạn là "tôi thích công việc và công việc phải nhiều tiền" thì lại là chuyện khác; còn nếu tiêu chuẩn của bạn là "tôi chỉ cần một công việc hợp với sở thích của tôi" thì bạn tìm được công việc đúng sở thích, nhưng lương chưa chắc đã cao.'],
    ['career', 'Hướng thứ hai của công việc là gì?',
     'Là công việc của bạn mang tính chất của Nữ Hoàng Ly: công việc mang tính cảm xúc nhiều, hoặc mang năng lượng chăm sóc người khác — bạn làm cho lĩnh vực dịch vụ, chăm sóc, chữa lành; công việc của bạn có thể là kiểu y tá, điều dưỡng viên; hoặc là bạn đặt rất nhiều cảm xúc của bạn vào công việc.'],
    ['career', 'Tôi đang làm văn phòng bình thường, thời gian tới có gì thay đổi không?',
     'Có thể tại thời điểm hiện tại bạn đã tận hưởng và đã thích công việc của bạn rồi, thì thời gian tiếp theo bạn vẫn tiếp tục thích công việc này, không có gì đáng để bàn cãi — hoặc thời gian tiếp theo bạn còn yêu công việc hơn nữa. Hoặc, trên thực tế Người đọc bài đã gặp một trường hợp như thế này: ra lá này cho câu hỏi dự đoán công việc thì thời gian tới bạn ấy sẽ có cấp dưới, sẽ có nhân viên mới, và bạn ấy đóng vai trò người hướng dẫn, chỉ bảo tận tình cho bạn nhân viên mới đó.'],
    ['other', 'Lá này có mặt tiêu cực nào không?',
     'Lá này rất đơn giản, mình thấy là không có ý nghĩa tiêu cực — trừ khi bạn là người xem bài ngược, hoặc bạn rút lá này ra kèm với những lá tiêu cực, hoặc trong những trường hợp cần phải mạnh mẽ, cần năng lượng của Kiếm và Gậy để giải quyết tình hình. Lúc đó thì năng lượng của Ly có thể mềm mỏng quá, yếu quá. Tùy trường hợp và tùy câu hỏi.']
  ],
  'pentacles-c2': [
    ['other', 'Nhìn hình ảnh lá bài thấy gì?',
     'Một Nữ Hoàng đang cầm Xu và ngồi trên thảo nguyên xanh tốt um tùm, gợi nhớ đến hình ảnh lá Hoàng Hậu — Empress, số 3 trong bộ Ẩn Chính — có cái gì đấy rất sung túc, đầy đủ, no ấm. Xu là tất tần tật những gì thuộc thế giới vật chất, những gì sờ được, nắm được, thấy được: cơ hội vật chất, tiền bạc, học tập, công việc. Xu là Đất.'],
    ['other', 'Miêu tả tính cách một người?',
     'Không quan trọng bạn là trai hay gái: nếu bạn mang năng lượng Nữ Hoàng Xu thì bạn là người có tiền, biết kiếm tiền, hoặc bản thân sinh ra đã có tiền, có điều kiện vật chất. Có thể chẳng nhiều đâu, nhưng đối với bạn, tự bạn nhìn nhận: tôi là người sung túc, tôi là người sung sướng, tôi là người đủ đầy. Có những người lương tháng kiếm được 100 triệu mà vẫn thấy không đủ; còn người Nữ Hoàng Xu có thể ở thái cực kia, kiếm được 10 triệu mà họ thấy đủ — thì tức là đủ. Bạn giàu khi bạn nghĩ bạn giàu, bạn đẹp khi bạn nghĩ bạn đẹp, chứ không phải dựa trên tiêu chuẩn của ai khác hay của xã hội; bạn hạnh phúc khi bạn nghĩ bạn hạnh phúc. Cuộc sống đơn giản thế thôi.'],
    ['other', 'Nữ Hoàng Xu khác Vua Xu ở chỗ nào?',
     'Nữ Hoàng và Vua là hai cấp độ đã làm chủ được nguyên tố mình đại diện — Nữ Hoàng Xu làm chủ được năng lượng vật chất — chỉ khác ở chỗ Nữ Hoàng thì nữ tính hơn. Khi họ có, họ muốn chăm sóc người khác bằng nguồn lực của mình. Còn Vua Xu là người nam tính, nên với họ thì tiếp tục là tìm kiếm thêm cơ hội, tìm kiếm thêm tiền, tìm kiếm thêm nguồn lực, dành thời gian công sức ra để kiếm thêm, kiếm thêm, kiếm thêm. Vua Xu cũng có gì đấy khắt khe hơn, nghiêm khắc hơn trong việc trao cho người khác nguồn lực của mình, còn Nữ Hoàng Xu thì rộng lượng hơn trong việc trao đi nguồn lực của mình để giúp đỡ mọi người.'],
    ['love', 'Người này nghĩ gì về tôi, có yêu tôi thật lòng không?',
     'Đây không phải là người ham vật chất hay thực dụng theo nghĩa xấu. Có thể cách tiếp cận tình cảm của họ là thực tế: họ thấy là bây giờ họ và tôi môn đăng hộ đối, họ có nguồn lực tài chính, tôi cũng có đủ nguồn lực tài chính, thế thì chúng tôi nên đến với nhau — và họ cũng sẵn sàng chăm sóc tôi, họ có nguồn lực và họ sẵn sàng chia sẻ cho tôi. Thế thì không phải là xấu. Tóm lại, người này không phải thật lòng xuất phát từ trái tim giống Nữ Hoàng Ly, nhưng cũng là người thật thà.'],
    ['other', 'Lá Xu có ý nghĩa tiêu cực không?',
     'Xu không xấu, không có ý nghĩa tiêu cực — trừ khi bạn đọc bài ngược, hoặc nó đi kèm với những lá tiêu cực khác. Còn nó đứng một mình thì ít khi đọc theo hướng tiêu cực; cá nhân Người đọc bài thì chưa thấy bao giờ.'],
    ['love', 'Vì sao hai đứa tôi hay cãi nhau?',
     'Có thể là do một người luôn sẵn sàng trao đi nguồn lực của mình cho đối phương, còn người kia thì chỉ biết nhận. Mối quan hệ này có thể hơi bị một chiều: một người thì cứ cho, cho, cho, còn người kia thì chỉ biết nhận. Lưu ý phân biệt: với Nữ Hoàng Ly cho câu hỏi cãi nhau thì đó là một người luôn quan tâm đến việc trao đi tình cảm của mình; còn lá này là một người luôn quan tâm đến việc trao đi nguồn lực của mình — tôi giúp được gì cho người yêu tôi, tôi mua quà cho người yêu tôi như thế nào; mà người yêu tôi không trân trọng điều đó, người yêu tôi cho rằng tất cả những thứ đó là điều nghiễm nhiên, đến khi tôi không giúp được nữa thì lại quay sang chửi tôi.'],
    ['career', 'Thời gian tới tôi có tìm được công việc ưng ý không?',
     'Có. Công việc mình thấy là tốt, thu nhập tài chính ổn. Còn bạn có thích không? Mình nghĩ là cũng có thích nữa, bởi vì năng lượng Nữ Hoàng Xu vẫn là năng lượng mang tính tích cực: thích và có tiền, thích và nhiều tiền.'],
    ['money', 'Tôi đang làm văn phòng bình thường, thời gian tới công việc thế nào?',
     'Trong thời gian tới công việc có tiền — công việc hiện tại đang bao nhiêu tiền thì thời gian tới vẫn nhiều tiền như thế. Công việc tốt, cơ hội thăng tiến, cơ hội tài chính, cơ hội vật chất, cơ hội đi học đều có. Bởi vì Xu không chỉ là tiền mà còn là tất tần tật cơ hội của thế giới vật chất: được cử đi học, được cử đi hội thảo, rồi cơ hội thăng tiến thăng chức, dự án mới — đều tốt hết.'],
    ['other', 'Trong bốn lá Nữ Hoàng thì lá nào tích cực nhất?',
     'Nhìn chung các lá Nữ Hoàng, đặc biệt là Nữ Hoàng Xu và Nữ Hoàng Ly, thì năng lượng tích cực hơn — với Người đọc bài thì tích cực hơn Nữ Hoàng Kiếm và Nữ Hoàng Gậy một chút. Lý do là bởi vì Xu và Ly là hai năng lượng nữ tính, mà Queen cũng là năng lượng nữ tính, nên có sự hòa hợp: tất cả đều nữ tính nên bổ trợ và hòa hợp với nhau. Còn Nữ Hoàng Kiếm và Nữ Hoàng Gậy thì Gậy và Kiếm là năng lượng nam tính nằm trong một lá Queen nữ tính, nên thành ra sẽ có chút xung đột từ hai lá này.']
  ]
});

Object.assign(ASK.en, {
  'wands-c2': [
    ['other', 'What do you see in the image?',
     'A Queen on her throne, one hand holding a wand, the other holding a sunflower. The easiest way into the court cards is to first fix in your mind the energy of each element — Wands, Swords, Pentacles, Cups — and then the meaning of each rank: Page, Knight, Queen, King.'],
    ['other', 'How does a Queen differ from a King?',
     'The Queen and the King are the two ranks that have mastered the element they represent. Neither outranks the other — they really stand side by side. The difference is that the Queen is more feminine and more introverted, while the King is more masculine, stronger and more proactive. Picture the Queen as the High Priestess or the Empress with the energy of an element added, and the King as the Emperor with an element added.'],
    ['other', 'Why is the Queen of Wands more balanced than the King of Wands?',
     'Wands is masculine energy and the Queen is feminine energy, so the Queen of Wands balances the masculine and the feminine within herself better than the King of Wands does. The King of Wands is masculine plus masculine, so he can run too hot and rather overwhelm other people. Both have leadership talent, but the King leads in the manner of "I am at the head, follow me", whereas the Queen also leads from the front yet knows when to be soft and when to let someone else go first. The Queen always knows how to be gentle, when to yield and when to be firm.'],
    ['other', 'Describe this person’s character.',
     'Man or woman, it does not matter: this person is confident, carries a confident bearing, and knows who they are — what they are good at and what they are not. Their actual talent may be quite ordinary, but because of that confident bearing people follow them, admire them, respect them and let them lead, because they know what they are doing. Leaders are not necessarily the most capable people; but they know where they are going, which is why others walk behind them. Some very capable people have no idea where they are going, and so they stay subordinates. This person knows where to go, when to move and when to stop, when to turn left or right, when to advance and when to fall back.'],
    ['other', 'What is her bearing like?',
     'You can see the confidence in the way she sits — not standing up and pacing about anxiously, but sitting in one place observing what is around her, back straight, knowing that she is the Queen and that people will listen to her without her having to force anyone. Above all this is a person with enthusiasm and passion who knows when action is needed and when it is not, and who still holds on to her own inwardness and femininity.'],
    ['love', 'Does he or she have feelings for me?',
     'Yes. And it is quite a sincere feeling, with nothing self-serving in it. This person is also quite straightforward about their emotions: if they love you they say they love you; A is A and B is B. So if this card comes up for what they feel for you, the reader will say it outright: you are lucky to have met this person.'],
    ['love', 'We argue a lot — what should we do to improve things?',
     'This is advice from the card. The two of you may be in a state of missing the Queen’s energy: too hot-tempered with each other, both of you the hot-tempered type, so you need the Queen’s feminine energy to hold down the heat of Wands — otherwise, once tempers flare, you fly at each other cursing, throwing things, coming to blows. The second case: the Queen of Wands is the card of confidence, so this couple may have things they dislike about each other and not dare to say them. What is needed is frankness — frankness, not criticism — straightforward communication, talking to each other plainly.'],
    ['career', 'Will I find the job I want in the coming period?',
     'Over the past while you have already been proactive, sending your CV out; now is the time to sit and wait — to wait the way the Queen sits and waits, for people to call you in for interviews here and there. They may well say they will only start interviewing next year. Just sit, wait and observe. It is not that you stop acting — keep sending the CV out — but you have acted enough already.'],
    ['career', 'I have been unemployed and nobody has called — what should I do?',
     'If it feels hard, do not get flustered just because you have not received a single notice or interview call yet. Stay calm, and be confident — this is a Queen, you must be confident. Know that you are good, that your CV is good, that you interview well; you have to be confident in that. Being unemployed is simply bad luck, and nobody wants it.'],
    ['career', 'I have an ordinary office job — will anything change soon?',
     'In the coming period you may be capable of stepping up to lead, or be promoted into a position with some title and authority — not necessarily the boss or a department head, possibly just a project team lead, and once that project ends you are back to being an ordinary employee. Or your manager sends you to guide the new hires: two or three new people a few years younger than you, and the boss says "you are their mentor now, you are the one who shows them how."']
  ],
  'swords-c2': [
    ['other', 'What do you see in the image?',
     'A Queen holding a sword, seated on a stone throne at the top of a mountain, looking very firm. Swords is the energy of thought, of the mind, of analysis, logic, communication and intelligence. The Queen and the King are the two court ranks that can control and are genuinely good in the domains of their element — but the Queen is more feminine, more introverted, carrying more of the caring and sustaining energy than the energy of action.'],
    ['other', 'Describe this person’s character.',
     'Man or woman, it does not matter: this person has a mind, has a way with words, thinks well. You could even say they are intelligent, that they have a high IQ, that they speak sharply and think sharply and quickly — there is nothing to fault.'],
    ['other', 'Does this person have a poisonous tongue?',
     'No. The ones who offend people are the Knight of Swords or the King of Swords, because Swords is masculine energy and the King is masculine too — masculine plus masculine sometimes lacks refinement in speech and in thought. Fortunately the Queen is feminine energy, balancing out the masculine energy of Swords. So the Queen of Swords speaks sharply and still knows when to speak and when to be quiet and listen. Only accompanying bad cards would change that. This is an intelligent person with a gift for words who keeps their humility: not that they are unaware of being clever — they know they are good — but they are not the type who likes to show off, not the "look at me, I know things" type. And they know their words can hurt, so they do not simply say whatever comes to mind.'],
    ['love', 'What does this person feel for me?',
     'They do have feelings, but their feelings are not the romantic kind — nor are they out to use you. They may simply be too practical about love: they like you, and beyond liking you they will list a whole set of reasons — we come from similar family backgrounds, we are well matched, so marrying will be happier and more peaceful; we have similar education, so the marriage will fit better in terms of mind and conversation.'],
    ['love', 'Are they sincere?',
     'Someone carrying Queen of Swords energy may be looking for a partner with a mind — but this person is absolutely not trying to use you; they are only weighing the practical bullet points of the relationship. Someone with Cups energy simply says "my heart goes boom boom in front of her, I want to marry her." The Queen of Swords is just rational; it is not bad and it is not exploitation. This person is sincere, but their sincerity may look rather different from yours.'],
    ['love', 'Is this the right person for me?',
     'If you are the type who wants a deep connection — who wants to look at someone and not care what family they come from, two hearts beating to the same rhythm and that is love — then this person is not for you.'],
    ['love', 'Why do the two of us argue so much?',
     'You do argue, but the real problem seems never to be said aloud. You may be arguing about very small, trivial things, with a tendency to take it out on the wrong target: there is something about the other person you dislike, but for some reason you do not dare say it straight, and the resentment stays inside, so you pick fault with this and pick fault with that, while the other has no idea why they keep being picked at — and the real problem goes unresolved. What the Queen of Swords advises here is that the two of you be more honest with each other and say what is actually in your heart.'],
    ['love', 'Can you give an example of that kind of arguing?',
     'Say your partner has a close friend. You are jealous, but you feel you have no right to be, since those two have been friends far longer than you have been around. So you sulk — but you do not say "I am sulking"; instead you start picking fault with other things they do, and everything they do irritates you. This tendency is very common among younger couples; people with a long romantic history, or with experience, or who are older, usually do not waste time on it — if they do not like something they say so straight out, so as not to waste each other’s time.'],
    ['career', 'Will I find the job I want in the coming period?',
     'You may well find one, and this card will describe the work too: a job of the mind, more academic, scholarly or research-oriented than administrative. And a job in which you have to communicate a great deal — not communication in the media or marketing sense, but communication built on reasoning and on a scientific basis.'],
    ['career', 'I have an ordinary office job — will anything change soon?',
     'In the coming period you may be lifted into a leadership position with some title and authority — this is a Queen, after all. And in that position you will have to think more, speak more, use your head and your mouth more, or both. Or in the coming period you will be doing more instructing and guiding.']
  ],
  'cups-c2': [
    ['other', 'What do you see in the image?',
     'A Queen on her throne holding a cup, gazing at it very tenderly and fondly. If you remember the two previous Queens — Wands and Swords — both of those look sharper and more difficult; this one is softer. Even the throne she sits on is decorated with angels, little cherubs; she sits on what looks like a meadow, with plants growing at her feet and water flowing. All these small details give us a feeling of femininity and gentleness.'],
    ['other', 'Describe this person’s character.',
     'This person has mastered their own emotions: they know what makes them happy and what makes them sad, and they are also ready to give their feeling, to give their heart, to another. In the emotional domain this person has a high EQ. Both the Queen and the King of Cups are high-EQ people, unlike the Page of Cups and especially unlike the Knight of Cups — there is something of the philanderer about that Knight.'],
    ['other', 'Why do you say this person has healed themselves?',
     'With the Queen of Cups you always sense someone who has finished the work of healing themselves. First, they know where their weaknesses are and they do not hesitate to show those weaknesses to the world. Do not assume that strong people are the ones who act tough — the strongest person is the one who is not afraid to show their weak side, their ugly side, to others, because they know that even when it is exposed nobody can hurt or wound them, because they know who they are. They have mastered their emotions; they do not fear being disliked or criticised. And they know very well how to love and care for other people — knowing how to love and care for yourself is one thing, knowing how to love and care for someone else is another. Anyone whose partner carries Queen of Cups energy has nothing to complain about.'],
    ['love', 'What does he or she feel for me?',
     'There is nothing to fault. Are they sincere? Yes. And in matters of the heart, is knowing whether the other person is sincere not the most important thing of all? They are sincere, and this person knows how to express what they feel and how to take care of you.'],
    ['love', 'Why do the two of us argue so much?',
     'It looks as though one of you carries Queen of Cups energy and the other is the opposite — that is, one of you is genuinely serious and wants to invest in the relationship. Remember that the Queen of Cups is serious about love: these people do not want games, do not want to fool around, do not want to waste time. So in a relationship that argues a lot, one may want something lasting and durable while the other only wants to play, only wants to be in love for right now. That is why you cannot find common ground: one keeps trying and is willing to change within the relationship for the other, while the other treats their partner’s changing as a matter of course and has no intention of changing themselves, no serious intention at all.'],
    ['love', 'How does this person turn someone down?',
     'Not by going cold and cutting contact abruptly the way the Queen of Swords does. Even when they know you are playing with them and they do not want to reciprocate, they refuse gracefully and gently. The King of Cups may be somewhat more blunt; the Queen of Cups is very gentle, very deft and subtle.'],
    ['career', 'Will I find a job I like in the coming period?',
     'You will find one, and there are two directions here. First: you like your work — this is the energy of feeling, after all — but whether that work brings in much money, or good promotion, is not yet known, because it depends on your standards. If your standard is "I want work I like that also pays well", that is one thing; if your standard is "I only need work that matches what I love", then you will find work that matches it, though the pay may not yet be high.'],
    ['career', 'What is the second direction?',
     'That your work itself takes on the character of the Queen of Cups: work with a great deal of feeling in it, or work carrying the energy of caring for others — you work in service, care or healing; your job might be something like a nurse or a carer; or you simply put a great deal of your own emotion into your work.'],
    ['career', 'I have an ordinary office job — will anything change soon?',
     'At present you may already be enjoying and liking your work, in which case you will go on liking it in the period ahead, with nothing to argue about — or you will come to love it even more. Or, in real practice the reader has met a case like this: for a question predicting how work would go, this card meant that in the coming period the querent would have people under them, would get a new member of staff, and would take the role of the guide, patiently showing that new person the ropes.'],
    ['other', 'Does this card have a negative side?',
     'This card is very simple, and I see no negative meaning in it — unless you read reversals, or you draw it alongside negative cards, or the situation is one that calls for strength, that needs the energy of Swords and Wands to resolve. In that case the energy of Cups may be too soft, too weak. It depends on the case and on the question.']
  ],
  'pentacles-c2': [
    ['other', 'What do you see in the image?',
     'A Queen holding a pentacle, seated on a lush, thickly green meadow — which recalls the Empress, number three of the Major Arcana: something very abundant, full and well provided for. Pentacles is everything belonging to the material world, everything that can be touched, held and seen: material opportunity, money, study, work. Pentacles is Earth.'],
    ['other', 'Describe this person’s character.',
     'Man or woman, it does not matter: if you carry Queen of Pentacles energy you are someone who has money, who knows how to make money, or who was born with money and material comfort. It may not even be much, but in your own eyes you see it this way: I am well off, I am comfortable, I have enough. Some people earn a hundred million a month and still feel it is not enough; the Queen of Pentacles can be at the other extreme, earning ten million and feeling it is enough — and so it is enough. You are rich when you think you are rich, you are beautiful when you think you are beautiful, not by anyone else’s standard or society’s; you are happy when you think you are happy. Life is that simple.'],
    ['other', 'How does the Queen of Pentacles differ from the King?',
     'The Queen and the King are the two ranks that have mastered the element they represent — the Queen of Pentacles has mastered material energy — and the difference is that the Queen is more feminine. When she has, she wants to take care of others with her resources. The King of Pentacles, being the masculine one, is about seeking more: another opportunity, more money, more resources, spending time and effort earning more and more and more. The King is also somewhat stricter, more severe about handing his resources to others, while the Queen of Pentacles is more generous in giving hers away to help people.'],
    ['love', 'What does this person think of me — do they truly love me?',
     'This is not a materialistic or mercenary person in the bad sense. Their approach to love may simply be practical: they see that the two of us are well matched, that they have financial resources and I have enough of my own, and so we ought to be together — and they are also ready to take care of me; they have the resources and they are willing to share them with me. That is not a bad thing. In sum, this person is not sincere in the way that comes straight from the heart like the Queen of Cups, but they are still an honest person.'],
    ['other', 'Does the Pentacles suit carry a negative meaning?',
     'Pentacles is not bad and has no negative meaning — unless you read reversals, or it comes alongside other negative cards. Standing alone it is rarely read negatively; personally the reader has never seen it read that way.'],
    ['love', 'Why do the two of us argue so much?',
     'It may be because one of you is always ready to give away your resources to the other, while the other only knows how to receive. This relationship may be rather one-sided: one keeps giving and giving, and the other only takes. Note the distinction: with the Queen of Cups on a conflict question, it is one person always concerned with giving away their feeling; with this card it is one person always concerned with giving away their resources — what can I do for my partner, what presents have I bought them — and the partner does not value it, the partner takes all of it as a matter of course, and the day I can no longer help, they turn round and berate me.'],
    ['career', 'Will I find a job I like in the coming period?',
     'Yes. The work looks good and the income is steady. Will you like it? I think you will like it too, because Queen of Pentacles energy is still positive energy: like it and have money, like it and have plenty of money.'],
    ['money', 'I have an ordinary office job — how will work go from here?',
     'In the coming period the work has money in it — whatever the job pays now, it will keep paying that well. The work is good; there are chances of promotion, financial chances, material chances, chances to study. Because Pentacles is not only money but every opportunity of the material world: being sent to study, sent to a conference, a promotion, a step up, a new project — all of it good.'],
    ['other', 'Which of the four Queens is the most positive?',
     'On the whole the Queens, and especially the Queen of Pentacles and the Queen of Cups, carry more positive energy — for the reader, a little more positive than the Queen of Swords and the Queen of Wands. The reason is that Pentacles and Cups are both feminine energies, and the Queen is feminine energy too, so there is harmony: all of it feminine, supporting and agreeing with itself. Whereas in the Queen of Swords and the Queen of Wands, Wands and Swords are masculine energies sitting inside a feminine Queen, so there is a little conflict coming out of those two cards.']
  ]
});

/* batch 22 - the four Kings */
Object.assign(KW.vi, {
  'wands-c3': { pos: ['tự tin, biết mình làm gì và phải làm như thế nào','có tài lãnh đạo theo kiểu điển hình: đi trước, mọi người theo sau','thiên về hành động, gần như không gì làm chùn bước','sợ nhưng vẫn hành động','rất giỏi, mạnh mẽ, nhiều lửa nhiều nhiệt huyết','mong muốn chinh phục cao'],
                neg: ['nóng tính, có thể khá nóng tính vì là hai năng lượng nam tính','lấn át người khác, hơi ích kỷ','đi quá nhanh khiến người khác không theo kịp','tốt trong công việc, học tập, chạy đua — nhưng không tốt trong tình cảm','nếu đang làm nhân viên thì thường xuyên xung đột với cấp trên'] },
  'swords-c3': { pos: ['thông minh, khả năng tư duy phân tích tuyệt vời','rất dứt khoát, rất quyết đoán','nói thẳng nói thật, đi thẳng vào vấn đề để bạn biết mình cần sửa gì','tiếp cận mối quan hệ rất lý trí, rất tỉnh táo','không lươn lẹo, không lợi dụng ai'],
                 neg: ['lạnh lùng, logic, lý trí, thực tế','quá nghiêm khắc, khắc nghiệt, kỷ luật, khó tính','thậm chí có phần tàn nhẫn: sẵn sàng đóng vai ác vì mục tiêu lớn hơn','không giỏi những thứ lãng mạn','không muốn tốn thời gian vào trò chơi tình ái'] },
  'cups-c3': { pos: ['dạt dào cảm xúc, EQ cao','đã làm chủ được cảm xúc của mình','rất rõ ràng với tình cảm của mình','thể hiện tình cảm một cách chín chắn, trưởng thành','chủ động, mạnh mẽ, quyết liệt nhưng không khiến bạn khó xử','rất biết cách cư xử trong các tình huống xã hội','công việc chữa lành, tinh thần, chăm sóc con người'],
               neg: ['ra cho câu hỏi tiền bạc thì chưa chắc đã có tiền','có thể là mối quan hệ mất cân bằng: một bên trao đi, một bên chỉ biết nhận'] },
  'pentacles-c3': { pos: ['giàu có, sung túc, giỏi về mặt vật chất và tiền bạc','có thể nói là người thực tế nhất trong 78 lá','đưa ra những quyết định cực kỳ đúng đắn, không để cảm xúc dẫn lối','chung thủy, không đa tình','đã ngắm bạn thì sẽ đầu tư cho bạn và cho mối quan hệ','ổn định, an toàn, không thất thường','công việc có tiền, có chức có quyền'],
                    neg: ['khô khan, thậm chí thực dụng','tình cảm không xuất phát từ trái tim mà từ tiêu chuẩn','để kết hôn thì tốt hơn là để yêu theo kiểu tuổi trẻ','không cho bạn cảm giác của tuổi trẻ'] }
});

Object.assign(KW.en, {
  'wands-c3': { pos: ['confident: knows what he is doing and how it must be done','the textbook leader — out in front, everyone behind','action-first; almost nothing makes him falter','afraid, and acts anyway','very capable, strong, full of fire and enthusiasm','a strong drive to conquer'],
                neg: ['hot-tempered, and possibly very — two masculine energies at once','overwhelms other people; a little selfish','moves so fast that others cannot keep up','good at work, study and racing — not good inside a relationship','if he is somebody’s employee he keeps clashing with his superiors'] },
  'swords-c3': { pos: ['intelligent, with superb analytical thinking','decisive and definite','speaks straight and true, right at the problem, so you know what to fix','approaches a relationship very rationally and clear-headedly','not devious, not out to use anyone'],
                 neg: ['cold, logical, rational, practical','too strict, too harsh, too disciplined, hard to please','even somewhat ruthless: willing to play the villain for the larger goal','not good at anything romantic','unwilling to spend time on the games of courtship'] },
  'cups-c3': { pos: ['overflowing with feeling; high EQ','has mastered his own emotions','completely clear about what he feels','shows affection in a mature, grown-up way','proactive, strong and decisive without leaving you awkward','knows exactly how to behave in social situations','healing, spiritual and people-caring work'],
               neg: ['on a money question it does not promise money','can be an unbalanced relationship: one gives, the other only receives'] },
  'pentacles-c3': { pos: ['rich and well provided for; good with the material world and with money','arguably the most practical person in all 78 cards','makes extremely sound decisions and does not let emotion lead','faithful, not the amorous type','once he has set his sights on you he invests in you and in the relationship','stable, safe, never erratic','work with money in it, and with title and authority'],
                    neg: ['dry, even utilitarian','affection that starts from criteria rather than from the heart','better for marriage than for young love','will never give you the feeling of being young'] }
});

Object.assign(ASK.vi, {
  'wands-c3': [
    ['other', 'Nhìn hình ảnh lá bài thấy gì?',
     'Một vị vua trông rất quyền lực, tay cầm trượng, và người này mang lại cho mình cảm giác rất tự tin, biết mình làm gì, biết mình phải làm như thế nào. Ông vua này mặc áo đỏ, tóc cũng màu đỏ — nhìn là thấy hừng hực lửa. Gậy là hành động, nhiệt huyết, đam mê, lửa. Vua và Nữ Hoàng là hai cấp bậc có khả năng điều khiển, kiểm soát nguyên tố mà nó đại diện và mang tính lãnh đạo, lấn át người khác, trong khi Kỵ Sĩ và Tiểu Đồng thì bị chỉ đạo, nhận lệnh từ người khác. Vua mang năng lượng nam tính, mà Gậy cũng là nguyên tố nam tính — nên ở đây chúng ta có double nam tính: hai cái nam tính cạnh nhau thì càng bùng nổ hơn, càng mãnh liệt hơn.'],
    ['other', 'Miêu tả tính cách một người?',
     'Trước hết là người có tài lãnh đạo. Nữ Hoàng Gậy cũng có tài lãnh đạo — thật ra tất cả các lá Vua và Nữ Hoàng đều có khả năng lãnh đạo — nhưng nếu nói lãnh đạo theo kiểu chuẩn mực điển hình trong công ty, trong doanh nghiệp lớn, cái người đi trước và mọi người theo sau, thì chính là Vua Gậy. Ông ấy tự tin, biết mình làm gì, và là kiểu người thiên về hành động, gần như không thứ gì làm ông ấy chùn bước.'],
    ['other', 'Người này không biết sợ à?',
     'Không phải là không biết sợ. Họ sợ, nhưng thay vì gặm nhấm nỗi sợ, thay vì để nỗi sợ ngáng đường, họ bảo: tôi sợ, nhưng tôi vẫn phải hành động, tôi vẫn phải làm những gì tôi cần làm. Và bởi vì một người luôn biết mình phải làm gì, luôn có phong thái tự tin tiến về phía trước như thế, thì tất nhiên mọi người sẽ theo sau thôi — mọi người luôn muốn theo sau những người biết họ đang đi đâu, biết rẽ trái hay rẽ phải, giống con chim đầu đàn luôn hướng cả đàn đi theo một đường nhất định.'],
    ['other', 'Vua Gậy khác Nữ Hoàng Gậy thế nào?',
     'Nữ Hoàng Gậy là năng lượng nữ tính nên sự lãnh đạo của nàng có gì đấy mềm mỏng hơn, dịu dàng hơn một chút. Còn Vua Gậy đúng là kiểu cầm đầu người khác kéo đi, hoặc kiểu "tao đang đứng đây, viên đá kia là mục tiêu của tao, tao sẽ chạy nhanh hết mức về cái viên đá đó, chúng mày theo được thì theo, không theo được thì thôi". Hơi ích kỷ một chút. Nhưng được cái là rất giỏi, mạnh mẽ, nhiều lửa nhiều nhiệt huyết. Nói chung là mạnh mẽ, giỏi giang, có tài lãnh đạo, hơi lấn át người khác và khá nóng tính.'],
    ['career', 'Ra lá Vua thì có nghĩa người đó đang làm lãnh đạo à?',
     'Không. Trong bộ Hoàng Gia, một người là Vua Gậy không có nghĩa người này nghiễm nhiên là lãnh đạo — tính cách của người này thích làm lãnh đạo, còn trong tình huống thực tế họ có đang là lãnh đạo hay không lại là chuyện khác. Nếu họ đang làm lãnh đạo thì tốt quá, phù hợp với tính cách của họ. Nhưng nếu họ đang làm nhân viên thì họ cần phấn đấu lên làm lãnh đạo, nếu không thì người này thường xuyên xung đột với cấp trên — tính cách như vậy làm sao mà hòa hợp được với cấp trên, họ phải là người đi đầu, phải là người dẫn đầu.'],
    ['love', 'Anh ta / cô ta nghĩ gì về tôi?',
     'Thì cũng có thích bạn. Nhưng với một vài bạn thì cách tiếp cận hay tình cảm của người này nhiều nhiệt, nhiều lửa quá, sồn sồn quá, muốn đánh nhanh thắng nhanh: "tao thích mày, tao tán mày, mày đổ hộ tao". Kiểu của người này sẽ là như vậy. Nếu bạn là người thích mọi thứ nhiệt huyết, nhiều lửa, đam mê như thế thì người này hợp với bạn. Còn nếu bạn thích mọi thứ chậm rãi, lãng mạn, hai người cùng viết thư tình hay làm thơ gửi cho nhau, thì người này không dành cho bạn. Người này có mong muốn chinh phục khá cao, không quan trọng nam hay nữ — họ đều có mong muốn chinh phục đối phương.'],
    ['love', 'Vì sao hai đứa tôi hay cãi nhau?',
     'Cái này quá đơn giản: một trong hai hoặc cả hai đều có xu hướng quá nóng tính và lấn át người còn lại, muốn kiểm soát người còn lại, hoặc là đi quá nhanh khiến người còn lại không theo kịp. Nói chung ông Vua Gậy làm tốt khi ở trong môi trường công việc, học tập, hoặc liên quan đến chạy đua. Nhưng trong mối quan hệ tình cảm thì bạn có chiến đấu với ai đâu, bạn có chạy đua với ai đâu — nên năng lượng này lại mang đến những điều tiêu cực.'],
    ['career', 'Thời gian tới tôi có tìm được công việc ưng ý không?',
     'Có tìm được việc, và công việc này có thể là bạn sẽ được ở trong vị trí có chức có quyền ngay lập tức — nghĩa là bạn gửi CV vào vị trí quản lý, vị trí phó giám đốc, vị trí trưởng nhóm dự án. Nói chung là vị trí có chức có quyền, có cấp dưới, có đòi hỏi khả năng lãnh đạo.'],
    ['career', 'Tôi đang làm văn phòng bình thường, thời gian tới cần lưu ý gì?',
     'Hoặc là bạn được cất nhắc lên vị trí có chức có quyền, hoặc là sẽ có chuyện gì đó xảy ra với một người mang năng lượng Vua Gậy trong công việc của bạn. Nếu bản thân bạn là Vua Gậy rồi thì thôi không nói; nhưng nếu mình miêu tả lá này mà bạn bảo "giống sếp của tao" thì mình hiểu là sắp tới sẽ có chuyện gì đó liên quan đến sếp, và cụ thể thế nào thì rút thêm một hai lá nữa để biết chuyện gì xảy ra, tốt hay xấu, liên quan đến người mang năng lượng này.'],
    ['other', 'Lá này tích cực hay tiêu cực?',
     'Tùy vào hoàn cảnh, tùy vào tình huống. Trong công việc, trong học tập thì tốt. Nhưng trong mối quan hệ tình cảm thì lại không tốt.']
  ],
  'swords-c3': [
    ['other', 'Nhìn hình ảnh lá bài thấy gì?',
     'Một ông vua đang cầm kiếm. Kiếm là tri thức, là đầu óc, là giao tiếp, là ý tưởng mới, là tất cả những gì dùng đầu — và giao tiếp ở đây không chỉ là nói mà còn là viết lách, gửi mail. Kiếm thì dùng để chiến đấu, mà chúng ta thường chiến đấu với người khác nhiều nhất bằng lời nói, bằng ngôn từ, nhất là trong thời không đấm nhau đánh nhau được thì xúc phạm người khác bằng lời nói. Kiếm cũng là thể hiện trí thông minh.'],
    ['other', 'Vua Kiếm khác Nữ Hoàng Kiếm ở chỗ nào?',
     'Vua Kiếm mang năng lượng nam tính mà Kiếm cũng là năng lượng nam tính, tức là Vua Kiếm là nam cộng nam, trong khi Nữ Hoàng Kiếm là một nam một nữ. Nên Nữ Hoàng Kiếm cũng rất thông minh, rất sắc sảo nhưng vẫn giữ được sự dịu dàng hiền lành của năng lượng nữ; còn Vua Kiếm thông minh sắc sảo nhưng đôi khi có phần quá nghiêm khắc, khắc nghiệt, kỷ luật, khó tính, thậm chí có phần tàn nhẫn.'],
    ['other', 'Tàn nhẫn nghĩa là sao?',
     'Người này rất dứt khoát, rất quyết đoán, nhưng cũng sẵn sàng đóng vai ác, sẵn sàng ra những quyết định tàn nhẫn để phục vụ cho mục tiêu lớn hơn — sẵn sàng giết năm người để cứu sống một trăm người. Trong khi Nữ Hoàng Kiếm thì sẽ cố gắng cân bằng, cứu hết cả 105 người.'],
    ['other', 'Vua Kiếm có độc mồm như Kỵ Sĩ Kiếm không?',
     'Kỵ Sĩ Kiếm là cái người nói những câu gây tổn thương người khác mà bản thân không nhận ra. Còn người này thì biết, họ không cố ý nói lời làm tổn thương người khác, nhưng họ sẽ nói thẳng nói thật, đi thẳng vào vấn đề để bạn biết là bạn đang sai, bạn đang cần phải sửa điều gì. Vua Kiếm và Kỵ Sĩ Kiếm nhìn qua thì đều thấy độc mồm, nhưng Kỵ Sĩ mới là độc mồm, còn người này là nghiêm khắc và thẳng thắn. Về tính cách thì đây là một người lạnh lùng, logic, lý trí, thực tế.'],
    ['love', 'Người này nghĩ gì về tôi và về mối quan hệ này?',
     'Người này tiếp cận mối quan hệ rất lý trí, rất tỉnh táo. Vua Kiếm có thật lòng không? Năng lượng của Kiếm không phải là kiểu người lươn lẹo — Kỵ Sĩ Kiếm thì độc mồm một tí thôi chứ cũng không lươn lẹo. Vua Kiếm cũng thế: không phải đến với tôi để lợi dụng tôi, hay vì thấy tôi có nhà mặt phố bố làm to. Họ có thích bạn, nhưng cách họ thể hiện ra thì hơi kém một chút — họ không giỏi những thứ lãng mạn.'],
    ['love', 'Người này tỏ tình kiểu gì?',
     'Người này sẽ không muốn tốn quá nhiều thời gian vào việc đuổi bắt, vào trò chơi tình ái. Có thể họ thích bạn thì họ nói thẳng: "tao thích mày, mày có muốn tính chuyện lâu dài với tao không?" Và họ cần một câu trả lời có hoặc không. Nếu bạn trả lời ấp úng, làm tốn thời gian của họ, thì chính họ có thể là người nói "thôi tao bận lắm, tao không có nhiều thời gian để chơi đùa với mày" — dù thật sự họ có thích bạn. Rất lạnh lùng, rất quyết đoán. Nhưng trong chuyện tình cảm thì chúng mình cần năng lượng nước, năng lượng của sự lãng mạn, hoặc năng lượng lửa của nhiệt huyết đam mê chứ có cần lý trí đâu. Nếu ai cũng lý trí hết thì chúng mình đã không còn thơ tình.'],
    ['love', 'Vì sao hai đứa tôi hay cãi nhau?',
     'Một người thì quá lý trí và có thể người kia thì lại đòi hỏi sự lãng mạn. Người Vua Kiếm không hẳn là vô tâm đâu, chẳng qua là họ quá logic. Thật ra nếu đối phương của Vua Kiếm là người trưởng thành và hiểu chuyện thì sẽ hòa hợp được. Nhưng nếu đối phương lại là kiểu trẻ con mè nheo, thích lãng mạn, thích mấy trò sến súa thì sẽ không hợp với người Vua Kiếm — và có thể đó là lý do vì sao hai bạn hay cãi nhau.'],
    ['career', 'Tôi thất nghiệp mấy tháng rồi, có tìm được việc không?',
     'Có tìm được việc. Và công việc này mang tính chất của Kiếm: công việc đòi hỏi giao tiếp nhiều, hoặc công việc dùng đầu óc — chứ không phải số má theo kiểu kế toán kiểm toán, mà là đầu óc kiểu nghiên cứu, phân tích, IT công nghệ, hoặc làm kỹ sư kỹ thuật, hoàn toàn thiên về đầu óc.'],
    ['career', 'Vị trí của tôi trong công việc mới sẽ như thế nào?',
     'Dù sao thì cấp độ này cũng là cấp độ Vua, nên vị trí bạn xin được có thể là khá cao, không phải là nhân viên quèn nữa — không nhất thiết là giám đốc, có thể là trưởng nhóm dự án, trưởng bộ phận. Kể cả là công việc mang tính giao tiếp thì cũng là giao tiếp kiểu nghiêm túc chứ không phải giao tiếp bán hàng, không phải đi sale. Có thể là công việc mà bạn phải thường xuyên thuyết trình, thuyết trình về các vấn đề khoa học, hoặc những vấn đề dùng đầu óc rất nhiều.'],
    ['career', 'Tôi đang làm văn phòng bình thường, thời gian tới có thay đổi gì không?',
     'Có thể bạn có một dự án mới và công việc của dự án mới đó bắt bạn phải dùng đầu óc nhiều hơn. Hoặc bạn được cất nhắc lên vị trí có chức có quyền, và vị trí mới này yêu cầu bạn dùng đầu óc nhiều hoặc giao tiếp nhiều — giao tiếp kiểu nghiêm túc với khách hàng, đối tác. Hoặc là trong công việc sẽ có chuyện gì đó với một người mang năng lượng Vua Kiếm: mình miêu tả năng lượng đó ra, nếu bạn nghe xong và bảo "tôi biết người này, đây là đồng nghiệp của tôi" thì chúng ta rút thêm một hai lá nữa để làm rõ cụ thể có vấn đề gì, tốt hay xấu, với người Vua Kiếm này.']
  ],
  'cups-c3': [
    ['other', 'Nhìn hình ảnh lá bài thấy gì?',
     'Một người đàn ông tay cầm ly, ngồi trên có vẻ như là mặt nước. Bởi vì bản chất là Ly nên người này có phần mềm mỏng, dễ chịu hơn hai ông Vua Kiếm và Vua Gậy mà chúng mình đã học. Ly thuộc về phạm trù cảm xúc, tinh thần, đam mê; còn Vua là năng lượng nam tính, là người lãnh đạo, người ra lệnh cho người khác, người có quyền lực. Thế nên lá Vua Ly là hai năng lượng mix vào nhau: năng lượng nam tính của Vua và năng lượng nữ tính của Ly.'],
    ['other', 'Miêu tả tính cách một người?',
     'Không quan trọng nam hay nữ: người này dạt dào cảm xúc, EQ cao, khía cạnh tinh thần và cảm xúc của họ khá là mạnh mẽ, và họ đã làm chủ được cảm xúc của mình rồi. Vua Ly và Nữ Hoàng Ly là hai người có EQ khá cao. Nếu họ thích bạn thì họ sẽ thể hiện ra — không phải thể hiện theo kiểu vô duyên "tao thích mày đấy, mày có thích tao không, không thích tao đánh mày", mà là thể hiện cảm xúc: tao thích mày, tao thương mày, tao quý mày, và tao sẽ thể hiện cho mày thấy.'],
    ['love', 'Người này có tỏ tình với tôi không?',
     'Chắc là có tỏ tình, nhưng sự tỏ tình của họ sẽ không khiến cho bạn bị bối rối, bị khó xử, vì dù sao người này vẫn là người có EQ cao. Nhìn chung Vua Ly và Nữ Hoàng Ly là những người rất biết cách cư xử trong các tình huống xã hội.'],
    ['love', 'Tình cảm anh ta / cô ta dành cho tôi thế nào?',
     'Chắc chắn là có tình cảm. Và không những có tình cảm mà người này sẽ thể hiện, sẽ cho bạn thấy họ yêu bạn, thương bạn nhiều như thế nào — nhưng không phải theo cách xấu, không phải theo cách tiêu cực, mà họ sẽ thể hiện một cách chín chắn, trưởng thành. Họ rất rõ ràng với tình cảm của họ. Và dù sao đây cũng là năng lượng nam tính, chủ động, mạnh mẽ, quyết liệt, nên nếu họ thích bạn thì họ cũng sẽ tấn công bạn trước, mà không để cho bạn cảm thấy khó chịu hay ngượng ngùng.'],
    ['love', 'Hai đứa tôi yêu nhau lâu năm mà hay cãi nhau, vì sao?',
     'Thương nhau lắm cắn nhau đau. Ra lá này thì có nhiều hướng diễn giải. Một là trong mối quan hệ đó có một người thật lòng thương người kia và trao đi tình cảm, trao cái ly của mình cho người kia, còn người kia thì chỉ biết nhận — tình cảm của hai bên bị mất cân bằng, một bên yêu nhiều hơn bên còn lại: một bên thì chán lắm rồi, một bên thì vẫn muốn đầu tư cho mối quan hệ. Hai là ra lá này thì hiểu là hai bạn chắc chỉ cãi nhau nhẹ thôi, không có gì đâu — bạn ấy đi xem tarot, hỏi xong công việc thì hỏi thêm phần tình cảm thế thôi; Vua Ly cho thấy hai bạn vẫn còn thương nhau nhiều, chẳng có vấn đề gì. Rơi vào tình huống nào thì phụ thuộc vào trực giác của bạn và những lá đi kèm.'],
    ['career', 'Thời gian tới tôi có tìm được công việc như ý không?',
     'Có, tìm được và như ý — bạn thích công việc đấy. Tuy nhiên trong công việc này khía cạnh tiền bạc, lương thưởng, thăng tiến như thế nào thì mình chưa thấy được, vì Ly chỉ thuộc về khía cạnh cảm xúc thôi. Biết đâu chính người hỏi là người không quan tâm đến tiền, rất giàu rồi, chủ sở hữu của mấy căn biệt thự, bây giờ chỉ đi làm vì đam mê và lại thích làm nhân viên văn phòng — thì bạn sẽ tìm được công việc mà bạn thích nhưng chưa thấy tiền đâu. Không nói được, chứ không phải là không có tiền.'],
    ['other', 'Làm sao để biết công việc đó có tiền hay không?',
     'Bạn có thể rút thêm một lá nữa và chỉ định là lá này sẽ nói về tiền. Rút ra đúng những lá Xu đẹp thì công việc này vừa thích vừa có tiền; còn ra lá Xu xấu thì công việc này bạn thích nhưng không có tiền.'],
    ['career', 'Hướng thứ hai của công việc là gì?',
     'Là công việc của bạn có tính chất liên quan nhiều đến cảm xúc và con người. Có thể bạn là người đi chữa lành tinh thần cho người khác — có thể là tarot reader, hoặc bác sĩ tâm lý — hoặc một công việc mang tính cảm xúc nhiều, tinh thần nhiều. Mấy ngành nghề dịch vụ, dịch vụ chăm sóc người khác, cả massage, thì cũng mang năng lượng của Ly.'],
    ['career', 'Tôi đang làm văn phòng bình thường, thời gian tới có gì thay đổi không?',
     'Có thể là bạn vẫn đang yêu thích công việc của mình và thời gian tới vẫn tiếp tục yêu thích công việc, thế thôi. Còn nếu bản thân bạn hỏi là thời gian tới có tiền không mà ra Vua Ly thì chưa chắc — chỉ là bạn thích công việc, nó mang lại cho bạn cảm giác thoải mái vậy thôi.'],
    ['other', 'Lá này có thể miêu tả một người cụ thể không?',
     'Có. Một trường hợp nữa là trong thời gian tới bạn sẽ có chuyện gì đó liên quan đến một người mang năng lượng Vua Ly. Mình miêu tả người đó ra: EQ cao, thể hiện tình cảm và những gì họ nghĩ, họ cảm thấy cho người khác, nhưng thể hiện một cách rất trưởng thành — chứ không phải cứ giận là chửi, mà giận thì sẽ nói "mày làm thế là tao khó chịu đấy". Bạn nghe xong mà bảo "tôi biết người này, tôi nhận ra người này" thì sau đó chuyện gì với người này, tốt hay xấu, mình phải rút thêm. Dù sao thì bộ Hoàng Gia đôi khi vừa miêu tả năng lượng của tình huống vừa miêu tả một ai đó cụ thể trong cuộc sống của bạn — và nếu mình miêu tả mà bạn bảo "đây là tôi" thì cũng không sao, mình sẽ xem tiếp chuyện gì xảy ra với bạn trong công việc thời gian tới.']
  ],
  'pentacles-c3': [
    ['other', 'Nhìn hình ảnh lá bài thấy gì?',
     'Một người đàn ông tay cầm Xu, đang ngồi trên ngai vàng, xung quanh cây cối mọc tốt tươi, và quần áo người này khiến mình có cảm giác đây là người rất giàu có và sung túc. Và đúng là như vậy: người mang năng lượng Vua Xu là người rất giàu có và sung túc, lý do là bởi vì họ giỏi về mặt vật chất, về khía cạnh vật chất tiền bạc — không quan trọng nam hay nữ. Xu là vật chất, của cải, tất cả những giá trị vật chất mà cầm được, sờ được, nắm được, thấy được; cơ hội công việc, cơ hội du học cũng là Xu.'],
    ['other', 'Miêu tả tính cách một người?',
     'Trước hết họ rất thực tế — có thể nói là người thực tế nhất trong 78 lá Tarot. Họ có sự thực tế của Xu cộng với sự nam tính, lý tính của Vua. Nữ Hoàng Xu thì còn có chút cảm tính, còn có sự nữ tính của một Nữ Hoàng; còn Vua thì rất lý tính và thực tế. Người này đôi khi có thể coi là khô khan, thậm chí thực dụng. Nhưng bởi họ lý tính và thực tế nên họ đưa ra những quyết định cực kỳ đúng đắn trong cuộc sống của họ, và họ thường không để cảm xúc dẫn lối. Thế nên việc người này giàu có, sung túc đầy đủ, có được một cuộc sống yên ổn là chuyện bình thường, là chuyện dĩ nhiên.'],
    ['love', 'Tình cảm anh ta / cô ta dành cho tôi thế nào?',
     'Cái tình cảm này không phải là một thứ tình yêu thuần túy đến từ trái tim. Người này đến với bạn bởi bạn có những điều kiện phù hợp tiêu chuẩn của họ. Tuy nhiên điều này chưa chắc đã là xấu, bởi họ rất thực tế, và thường thì Vua Xu và Nữ Hoàng Xu đều là những người chung thủy — chẳng qua là họ có tiêu chuẩn rõ ràng, cách họ tiếp cận hôn nhân, cách họ tiếp cận mối quan hệ dựa trên các yếu tố khác chứ không phải tình cảm. Tính cách của họ là vậy. Có người thì bảo "người này thực dụng quá, tôi không thích"; nhưng có người lại thấy ở người này cảm giác yên ổn, yên bình, ổn định — bởi họ đã ngắm bạn, đã thích bạn thì họ sẽ đầu tư cho bạn, đầu tư cho mối quan hệ này. Và Vua Xu, Nữ Hoàng Xu thường không phải là người đa tình.'],
    ['love', 'Yêu người này có gì khác?',
     'Mối quan hệ với họ thì không đam mê nhiệt huyết giống mấy anh Ly, nhất là Kỵ Sĩ Ly. Những người này sẽ không cho bạn cái cảm giác của tuổi trẻ, không phải kiểu cùng nhau yêu đến phát điên. Tình yêu của họ có thể nhạt, nhưng rất ổn định, rất an toàn, và cách họ cư xử, cách họ hành động, tình cảm họ dành cho bạn thì không bị thất thường. Người này để kết hôn thì tốt hơn là để yêu theo kiểu tuổi trẻ. Nếu bạn vẫn còn trẻ và muốn một tình yêu sống chết đi sống lại thì người này không dành cho bạn; nhưng nếu bạn đã có tuổi và muốn một người ổn định, một tình yêu an toàn, một hôn nhân an toàn, thì đây là người dành cho bạn.'],
    ['love', 'Hai đứa tôi yêu nhau lâu năm mà hay cãi nhau, có đến mức phải chia tay không?',
     'Mình nghĩ là không phải chia tay đâu. Có thể là một trong hai bạn mang xu hướng của Vua Xu — ổn định, an toàn, muốn lâu dài, muốn kết hôn — còn người kia thì lại muốn bay nhảy, muốn chơi. Thành ra một bên muốn ổn định, một bên muốn chơi: xung đột về mong muốn, xung đột về cách nhìn nhận cuộc sống, nên hay cãi nhau. Cái này thì hai bạn tự giải quyết với nhau thôi.'],
    ['love', 'Khi nào thì buộc phải chia tay?',
     'Đôi khi nếu không giải quyết được thì buộc phải chia tay trong hòa bình, khi mà có những khác biệt về giá trị cốt lõi. Ví dụ hai người yêu nhau, một người thì muốn có con nhưng một người nhất quyết không muốn, không ai chịu nhường ai, không tìm được giải pháp chung, thì đành phải chia tay thôi — mặc dù rõ ràng ở cạnh nhau rất hợp, rất thương nhau, nhưng khác nhau về giá trị cốt lõi như vậy thì phải chấp nhận. Hoặc một người thì rất muốn kết hôn, con đàn cháu đống, rồi ở chung với gia đình, ở chung với bố mẹ; còn một người thì nhất quyết không kết hôn, chỉ ở cạnh nhau vậy thôi và không ở chung với cha mẹ của ai hết. Mặc dù tính cách rất hòa hợp thì cũng không thể đến được với nhau.'],
    ['money', 'Thời gian tới tôi có tìm được công việc không?',
     'Nói thật, ra lá này trong công việc thì các bạn mãn nguyện được rồi. Cứ ra Xu — Vua Xu, Nữ Hoàng Xu, Mười Xu, Chín Xu — cho câu hỏi công việc, tài chính, học tập thì mãn nguyện rồi (riêng học tập thì Người đọc bài thích Kiếm hơn một chút). Bạn sẽ tìm được việc, và công việc nhiều tiền. Thậm chí trong công việc này bạn có thể ở vị trí lãnh đạo, có chức có quyền; về mặt tài chính thì ổn.'],
    ['money', 'Tôi đang làm văn phòng bình thường, thời gian tới công việc có gì thay đổi không?',
     'Có thể là thời gian tới nhiều tiền, hoặc thời gian tới lên chức. Hoặc là trong thời gian tới sẽ có một sự kiện nào đó xảy ra với người mang năng lượng Vua Xu — mình miêu tả người đó ra: thực tế, nam tính, hơi thực dụng, hơi khô khan. Miêu tả xong mà bạn bảo "tôi nhận ra người này rồi, đây là sếp của tôi", thì rốt cuộc sự kiện gì xảy ra với ông này mà ảnh hưởng đến bạn thì mình rút thêm lá bài.'],
    ['other', 'Ví dụ về việc rút thêm lá để đào sâu?',
     'Ví dụ ra ông Vua Xu và bạn bảo đó là ông sếp tổng của bạn. Mình rút thêm một lá như Tám Gậy — lá của sự di chuyển — thì có thể là ông sếp tổng của bạn sẽ không làm ở đấy nữa, ông ấy chuyển qua công ty khác hoặc về nước; thế thì sẽ thay sếp tổng, và người sếp mới có thể sẽ mang đến cơ chế mới, luật lệ mới cho công ty, và điều này có ảnh hưởng đến công việc của bạn. Ảnh hưởng tốt hay xấu thì chúng mình lại rút tiếp — cứ đào sâu như vậy thôi.']
  ]
});

Object.assign(ASK.en, {
  'wands-c3': [
    ['other', 'What do you see in the image?',
     'A king who looks very powerful, holding his staff, and who gives the impression of great confidence: he knows what he is doing and how it has to be done. This king wears red and his hair is red too — you can see the fire blazing off him. Wands is action, enthusiasm, passion, fire. The King and the Queen are the two ranks able to command and control the element they represent, and they carry leadership energy that overrides other people, while the Knight and the Page are directed and take orders. The King is masculine energy, and Wands is a masculine element too — so here we have double masculine, and two masculine energies side by side do not cancel out, they explode: fiercer, more intense, more masculine.'],
    ['other', 'Describe this person’s character.',
     'First of all, a person with a talent for leadership. The Queen of Wands has it too — in fact every King and Queen has leadership ability — but if you mean the standard, textbook leader in a company or a large business, the one who walks in front while everyone follows behind, that is the King of Wands. He is confident, he knows what he is doing, and he is the action-first type: almost nothing can make him falter.'],
    ['other', 'Does he not know fear?',
     'It is not that he knows no fear. He is afraid — but instead of chewing over the fear, instead of letting it block his road, he says: I am afraid, and I still have to act, I still have to do what needs doing. And because someone always knows what to do and always carries himself confidently forward like that, of course people fall in behind him. People always want to follow those who know where they are going, who know whether to turn left or right — the lead bird takes the whole flock along one set route.'],
    ['other', 'How does the King of Wands differ from the Queen?',
     'The Queen of Wands is feminine energy, so her leadership has something softer and gentler in it. The King of Wands is exactly the type who takes the lead and drags everyone along, or who says "I am standing here, that rock over there is my target, I am going to run at it as fast as I possibly can — keep up if you can, and if you cannot, never mind." A little selfish. But he is very capable, strong, and full of fire and enthusiasm. In sum: strong, able, a natural leader, somewhat overwhelming to others, and quite hot-tempered.'],
    ['career', 'If this card comes up, does it mean the person is a leader?',
     'No. Within the court cards, being a King of Wands does not automatically make someone a leader — their character wants to lead, but whether they actually are one in real life is another matter. If they are leading, wonderful, it suits them. But if they are somebody’s employee, they need to push to become a leader, otherwise this person will be in constant conflict with their superiors — how could a character like that get along with a boss? They have to be the one out in front, the one who leads.'],
    ['love', 'What does he or she think of me?',
     'They do like you. But for some people this person’s approach, or the feeling itself, has too much heat and too much fire in it, too pushy, wanting to win fast: "I like you, I am courting you, so fall for me." That is their manner. If you like everything enthusiastic, fiery and passionate, this person suits you. If you like everything slow and romantic, the two of you writing love letters or poems to each other, this person is not for you. This person also has a strong drive to conquer — man or woman, they want to win the other person over.'],
    ['love', 'Why do the two of us argue so much?',
     'This one is very simple: one of you, or both, tends to be too hot-tempered and to overwhelm the other, wanting to control them, or moving so fast that the other cannot keep up. Broadly, the King of Wands does well in work or study, or in anything that involves racing. But in a relationship, who are you fighting? Who are you racing against? So here the energy brings out the negative things.'],
    ['career', 'Will I find a job I like in the coming period?',
     'You will find work, and this job may put you straight into a position with title and authority — meaning you send your CV in for a manager’s role, a deputy director’s role, a project team lead, and so on. In short, a position with authority, with people under you, that calls for leadership ability.'],
    ['career', 'I have an ordinary office job — what should I watch for?',
     'Either you are promoted into a position with title and authority, or something is going to happen involving a person who carries King of Wands energy in your work. If you yourself are the King of Wands, then never mind. But if I describe this card and you say "that sounds like my boss", then I understand that something involving the boss is coming, and we draw one or two more cards to see what exactly it is, and whether it is good or bad for you.'],
    ['other', 'Is this card positive or negative?',
     'It depends on the circumstances and the situation. In work and in study, good. In a romantic relationship, not good.']
  ],
  'swords-c3': [
    ['other', 'What do you see in the image?',
     'A king holding a sword. Swords is knowledge, the mind, communication, new ideas, everything that uses the head — and communication here is not only speaking but writing and sending emails too. A sword is for fighting, and what we most often fight other people with is words, language — especially in an age when we cannot punch each other, so we insult each other instead. Swords is also the showing of intelligence.'],
    ['other', 'How does the King of Swords differ from the Queen?',
     'The King is masculine energy and Swords is masculine energy, so the King of Swords is masculine plus masculine, while the Queen of Swords is one masculine and one feminine. So the Queen of Swords is also very intelligent and very sharp, yet keeps the gentleness and mildness of the feminine; whereas the King of Swords is intelligent and sharp but at times excessively strict, harsh, disciplined, hard to please, and even somewhat ruthless.'],
    ['other', 'What do you mean by ruthless?',
     'This person is very decisive and very definite, and is also willing to play the villain, willing to make ruthless decisions in service of a larger goal — willing to kill five people to save a hundred lives. The Queen of Swords, by contrast, would try to balance it and save all one hundred and five.'],
    ['other', 'Is he poison-tongued like the Knight of Swords?',
     'The Knight of Swords is the one who says things that hurt other people without realising it. This person does realise: he does not mean to say things that wound, but he will speak straight and speak plainly, going right at the problem so that you know where you are wrong and what you need to fix. At first glance the King of Swords and the Knight of Swords both look poison-tongued, but the Knight is the poison-tongued one, while this person is strict and frank. As a character: cold, logical, rational, practical.'],
    ['love', 'What does this person think of me and of this relationship?',
     'This person approaches a relationship very rationally, very clear-headedly. Is the King of Swords sincere? Swords energy is not the devious type — the Knight of Swords is a little poison-tongued but he is not devious either, and neither is the King. He is not coming to you in order to use you, or because he noticed you own a house on the main street and your father is somebody important. They do like you, but the way they show it falls a little short: they are not good at anything romantic.'],
    ['love', 'How does this person confess their feelings?',
     'This person will not spend much time on the chase, on the games of courtship. If they like you, they may say so outright: "I like you; do you want something long-term with me or not?" And they need a yes or a no. If you answer vaguely and waste their time, they may be the one to say "I am busy, I do not have much time to play games with you" — even though they genuinely do like you. Very cold, very decisive. But in matters of the heart what we need is water energy, the energy of romance, or the fire energy of enthusiasm and passion — we do not need Swords, we do not need rationality. If everybody were that rational, we would have no love poems left.'],
    ['love', 'Why do the two of us argue so much?',
     'One of you is too rational and the other perhaps wants romance. The King of Swords is not exactly heartless; he is simply too logical. In truth, if the King of Swords’ partner is mature and understanding, the two can harmonise. But if the partner is the childish, whiny type who wants romance and sentimental gestures, that will not fit a King of Swords — and that may be why the two of you keep arguing.'],
    ['career', 'I have been unemployed for months — will I find work?',
     'You will find work. And this job carries the character of Swords: work that demands a lot of communication, or work that uses the head — not figures in the accounting or auditing sense, but the head in the sense of research, analysis, IT and technology, or engineering and technical work: entirely head-oriented.'],
    ['career', 'What position will I get in this new job?',
     'This rank is the King, after all, so the position you land may be fairly senior, no longer a rank-and-file employee — not necessarily a director, perhaps a project team lead or a department head. And even if the work involves communication, it is serious communication, not sales communication, not going out to sell. It may be work where you present often, present on scientific matters, or on problems that use the head a great deal.'],
    ['career', 'I have an ordinary office job — will anything change soon?',
     'You may take on a new project whose work forces you to use your head more. Or you are promoted into a position with title and authority, and this new position requires you to use your head a lot or to communicate a lot — serious communication with clients and partners. Or something at work will happen with a person carrying King of Swords energy: I describe that energy, and if you hear it and say "I know this person, this is my colleague", then we draw one or two more cards to clarify what exactly the issue with this King of Swords is, and whether it is good or bad.']
  ],
  'cups-c3': [
    ['other', 'What do you see in the image?',
     'A man holding a cup, seated on what looks like the surface of water. Because the nature here is Cups, this person is somewhat softer and easier-going than the two Kings we have already studied, Swords and Wands. Cups belongs to the domain of emotion, spirit and passion; the King is masculine energy, the leader, the one who gives orders, the one with power. So the King of Cups is two energies mixed together: the masculine of the King and the feminine of Cups.'],
    ['other', 'Describe this person’s character.',
     'Man or woman, it does not matter: this person is overflowing with feeling, has a high EQ, has a strong spiritual and emotional side, and has already mastered their own emotions. The King and the Queen of Cups are two people with a fairly high EQ. If they like you they will show it — not in a tactless way, not "I like you, do you like me, and if not I will thump you" — but by expressing the feeling: I like you, I care for you, I value you, and I am going to show you that.'],
    ['love', 'Will this person confess their feelings to me?',
     'Probably yes — but their confession will not leave you flustered or in an awkward spot, because this is still a person with a high EQ. On the whole the King of Cups and the Queen of Cups know very well how to conduct themselves in social situations.'],
    ['love', 'What does he or she feel for me?',
     'There is certainly feeling. And not only is there feeling — this person will show you, will let you see how much they love and care for you, though not in a bad or negative way: they will show it in a mature, grown-up manner. They are very clear about what they feel. And since this is still masculine energy — proactive, strong, decisive — if they like you they will make the first move, without leaving you uncomfortable or embarrassed.'],
    ['love', 'We have been together for years and argue a lot — why?',
     'The harder you love, the harder you bite. With this card there are several ways to read it. First: in that relationship one person truly cares for the other and gives their feeling, gives their cup, to the other, while the other only knows how to receive — the feeling between the two is out of balance, one side loves more than the other: one side is thoroughly fed up while the other still wants to invest in the relationship. Second: this card may mean the two of you are only bickering lightly, nothing serious — the querent went for a tarot reading, asked about work, and then asked about love as well. The King of Cups shows the two of you still care for each other a great deal and there is no real problem. Which case it is depends on your intuition and on the accompanying cards.'],
    ['career', 'Will I find the job I want in the coming period?',
     'Yes — you find it and it is what you wanted: you like the work. However, in this job the money side, the pay, the bonuses, the promotion, I cannot see, because Cups belongs only to the emotional side. For all we know the querent is someone who does not care about money, who is already rich, who owns several villas and now works purely out of passion and happens to enjoy being an ordinary office employee. So you find work you like, with no money visible — which is not the same as there being no money.'],
    ['other', 'How do I find out whether the job pays?',
     'You can draw one more card and designate it to speak about money. Draw a good Pentacles card and this job is both liked and well paid; draw a bad Pentacles card and it is a job you like without money behind it.'],
    ['career', 'What is the second direction here?',
     'That your work has a character closely tied to emotion and to people. You might be someone who heals other people’s spirits — a tarot reader, or a psychologist — or in work with a great deal of emotional and spiritual character. The service trades, work caring for other people, massage included, also carry the energy of Cups.'],
    ['career', 'I have an ordinary office job — will anything change soon?',
     'You may already love your work, and in the coming period you simply go on loving it. But if what you asked was whether there will be money in the coming period, the King of Cups does not promise it — you like the work, it gives you a comfortable feeling, and that is all.'],
    ['other', 'Can this card describe a specific person?',
     'Yes. Another case is that in the coming period something will happen involving someone who carries King of Cups energy. I describe that person: a high EQ, someone who shows their feelings and what they think to others, but expresses it in a very mature way — not cursing whenever they are angry, but saying "what you did upset me." If you hear that and say "I know this person, I recognise them", then what happens with them, good or bad, needs more cards. The court cards sometimes describe both the energy of a situation and a specific person in your life — and if the description matches you yourself, that is fine too; we simply go on to look at what is coming in your work.']
  ],
  'pentacles-c3': [
    ['other', 'What do you see in the image?',
     'A man holding a pentacle, seated on his golden throne with plants growing thick and green all around it, and his clothes give the feeling that this person is very rich and very well provided for. And that is exactly right: a person carrying King of Pentacles energy is very rich and comfortable, because they are good at the material side, at material and financial matters — man or woman alike. Pentacles is matter, wealth, every material value that can be held, touched, grasped and seen; a job opportunity or a chance to study abroad is Pentacles too.'],
    ['other', 'Describe this person’s character.',
     'Above all they are practical — you could call them the most practical person in all seventy-eight cards of the tarot. They have the practicality of Pentacles plus the masculine rationality of the King. The Queen of Pentacles still has some feeling in her, still the femininity of a queen; the King is purely rational and practical. This person can sometimes be seen as dry, even mercenary. But precisely because they are rational and practical, they make extremely sound decisions in their life, and they generally do not let emotion lead the way. So it is entirely ordinary, entirely natural, that this person is rich, comfortable and living a settled life.'],
    ['love', 'What does he or she feel for me?',
     'This feeling is not a pure love that comes from the heart. This person came to you because you have conditions that fit their criteria. That is not necessarily a bad thing, though, given the kind of person they are: they are very practical, and the King and Queen of Pentacles are usually faithful people. It is simply that they have clear standards, and the way they approach marriage and relationships rests on other factors than feeling. That is their character. Some will say "this person is too mercenary, I do not like it"; others find that a person like this gives them a sense of calm, peace and stability — because once they have set their sights on you, once they like you, they will invest in you and in the relationship. And the King and Queen of Pentacles are usually not the amorous type.'],
    ['love', 'What is it like to love this person?',
     'A relationship with them is not passionate and fiery the way it is with the Cups people, above all the Knight of Cups. These people will not give you the feeling of being young; this is not loving each other to the point of madness. Their love may be dull, but it is very stable and very safe, and the way they behave, the way they act, the affection they give you, is never erratic. This person is better for marriage than for young-style romance. If you are still young and want a love you would die and come back to life for, this person is not for you. But if you are older and want someone stable, a safe love and a safe marriage, this is the one for you.'],
    ['love', 'We have been together for years and argue a lot — is it bad enough to break up?',
     'I do not think you need to break up. It may be that one of you carries the King of Pentacles tendency — stable, safe, wanting the long term, wanting marriage — while the other wants to roam and to play. So one of you wants stability and the other wants to play: a conflict of wants, a conflict in how you see life, and hence the arguing. That is something the two of you have to work out between yourselves.'],
    ['love', 'When is breaking up unavoidable?',
     'Sometimes, if it cannot be worked out, you have to part in peace — when the difference is in core values. For example, two people love each other but one wants children and the other absolutely does not; neither will give way and no common solution appears, and so they have to part, obviously, even though they clearly suit each other and love each other, because the core values differ. Or one very much wants to marry, wants a house full of children, wants to live with the family, with the parents; and the other absolutely will not marry, wants only to be together, and will not live with anyone’s parents. Even with characters that fit each other beautifully, they cannot come together.'],
    ['money', 'Will I find work in the coming period?',
     'Honestly, when this card comes up for work you can be content. Any Pentacle at all — King, Queen, Ten, Nine — on a question of work, finance or study is satisfying (for study, the reader does prefer Swords a little more). You will find work, and work with a lot of money in it. In this job you may even sit in a leadership position with title and authority; financially it is fine.'],
    ['money', 'I have an ordinary office job — will anything change soon?',
     'It may be more money in the coming period, or a step up in rank. Or some event is coming involving a person who carries King of Pentacles energy — I describe that person: practical, masculine, a little mercenary, a little dry. And if once I have described them you say "I recognise this person, this is my boss", then to find out what event involving them will affect you, we draw more cards.'],
    ['other', 'Can you give an example of drawing more to dig deeper?',
     'Say the King of Pentacles comes up and you tell me it is your managing director. I draw one more card, say the Eight of Wands — the card of movement — so it may be that your managing director is leaving, transferring to another company or going back to his own country. There will then be a new managing director, who may bring a new structure and new rules into the company, and that affects your work. Whether the effect is good or bad, we draw again — you simply keep digging deeper like that.']
  ]
});

/* keywords batch 1 - all 22 Majors.
   the reader teaches every card as a positive keyword set and a negative one, and
   says outright that she does not read reversals -- she learns both senses of
   the upright card instead. Where she says a card has no negative (or no
   positive) sense at all, that side is simply left out here.
   Her own trick for deriving the negatives: put "quá" (too) in front of the
   positives. Too capable, too masculine, too active. */
Object.assign(KW.vi, {
  'major-0': { pos: ['khởi đầu','không sợ hãi','bước vào một trải nghiệm mới','dũng cảm','háo hức với hành trình mới','lạc quan','hồn nhiên vô tư'],
               neg: ['không lên kế hoạch trước','bất cần','thiếu cẩn trọng','ngây thơ quá','trẻ trâu'] },
  'major-1': { pos: ['nam tính','chủ động','biết nắm bắt cơ hội','nắm bắt thời cơ','giỏi và biết mình giỏi','hành động'],
               neg: ['kiêu ngạo','kiêu kỳ','kiêu căng','chỉ thiên về hành động','không biết lúc nào cần bình tĩnh xem xét'] },
  'major-2': { pos: ['trực giác','bị động','nữ tính','tâm linh','tiềm thức'],
               neg: ['bị ẩn giấu','bị giấu đi','tình đơn phương','thông tin bị giấu','ngồi một chỗ không hành động'] },
  'major-3': { pos: ['đầy đủ','sung túc','thoải mái','dễ chịu','bình yên','tiện nghi','ấm áp','có bầu'],
               neg: ['bao bọc quá đà','vùng an toàn','chiều chuộng thái quá'] },
  'major-4': { pos: ['cấu trúc','hệ thống','quyền lực','luật lệ','lãnh đạo','trụ cột','đáng tin cậy','vững vàng','nghiêm khắc'],
               neg: ['cứng nhắc','bảo thủ','kiểm soát quá đà','lạm quyền'] },
  'major-5': { pos: ['tôn giáo','nhà trường','giáo dục','học vấn','kiến thức','hệ thống','truyền thống','văn hóa','làm việc nhóm'],
               neg: ['mất đi sự sáng tạo','cứng nhắc','làm theo khuôn khổ','làm theo luật lệ của người khác'] },
  'major-6': { pos: ['tình yêu','cơ hội mới','hai cơ hội đến cùng một lúc'],
               neg: ['ngã ba đường','phân vân không biết chọn cái nào','có thể là tình tay ba'] },
  'major-7': { pos: ['quyết tâm cao độ','tập trung vào mục tiêu','ý chí mãnh liệt','tiến thẳng về phía trước','không sợ hãi','mạnh mẽ'],
               neg: ['nhanh quá','ám ảnh mục tiêu','không biết tận hưởng quá trình','sẵn sàng đạp đổ mọi thứ xung quanh'] },
  'major-8': { pos: ['sức mạnh','mạnh mẽ','kiên trì','biết mình là ai','biết điểm mạnh điểm yếu của mình','dùng yêu thương và kiên nhẫn để hóa giải vấn đề'] },
  'major-9': { pos: ['ở ẩn','muốn ở một mình','nhìn vào bên trong','đi tìm câu trả lời cho những câu hỏi triết lý','người thầy tinh thần','người thầy hướng dẫn'],
               neg: ['tự cô lập','tự thu mình','khá khó tính','vẫn đang tìm chứ chưa tìm được câu trả lời'] },
  'major-10': { pos: ['thay đổi mang tính bước ngoặt','chu kỳ','vòng quay số phận'],
                neg: ['không kiểm soát được cục diện','xấu hay tốt thì tùy — bản thân lá này trung lập'] },
  'major-11': { pos: ['cân bằng','công bằng','sáng suốt','tỉnh táo','lý trí','giấy tờ, thủ tục, pháp lý'],
                neg: ['tỉnh táo quá','thiếu cảm xúc','trục trặc giấy tờ'] },
  'major-12': { pos: ['thay đổi góc nhìn','giác ngộ','chấp nhận điều khác người ở mình','buông bỏ kiểm soát'],
                neg: ['bị người khác đánh giá, soi xét','bị coi là lập dị','cô độc trên hành trình của chính mình'] },
  'major-13': { pos: ['kết thúc chủ động','lột xác','sống đi chết lại','con người mới phù hợp hơn'],
                neg: ['thời điểm chuyển mình rất đau đớn','thường phải có biến cố mới chịu thay đổi','phải buông bỏ một số thứ cũ'] },
  'major-14': { pos: ['tiết độ','điều độ','cân bằng','hài hòa','yên bình'],
                neg: ['dậm chân tại chỗ','không có chuyển biến rõ rệt','hơi yên bình quá'] },
  'major-15': { neg: ['cám dỗ','dục vọng','nghiện ngập','phần con lấn át phần người','bị mờ mắt vì cám dỗ','không kiểm soát được hành vi và cảm xúc của chính mình'] },
  'major-16': { pos: ['sau sụp đổ thì xây lại được cái mới — ngay sau Tòa Tháp là Ngôi Sao'],
                neg: ['sụp đổ đột ngột','biến cố bất ngờ đến từ bên ngoài','sốc, sang chấn tâm lý','đau đớn hơn lá Tử Thần nhiều lần'] },
  'major-17': { pos: ['hi vọng','tương lai tươi sáng','sau cơn mưa trời lại sáng','cơ hội mới'],
                neg: ['bị lý tưởng hóa','kỳ vọng đặt quá cao','chỉ ngồi hi vọng mà không hành động'] },
  'major-18': { neg: ['hoang mang','lo lắng','sợ hãi','một viễn cảnh không có thật','một tương lai không có thật'] },
  'major-19': { pos: ['chiến thắng vẻ vang','sáng tỏ','sáng rõ','nhiều năng lượng','hạnh phúc'],
                neg: ['đến gần quá thì bị thiêu đốt','cái tôi quá cao','muốn một mình đứng dưới ánh đèn'] },
  'major-20': { pos: ['nhìn về bên trong','xem lại bộ phim cuộc đời','xem xét lại những gì mình đã trải qua','chín chắn','trưởng thành','thông thái'] },
  'major-21': { pos: ['kết thúc một chu kỳ','kết thúc một hành trình','kết thúc trong mãn nguyện','vui vẻ hài lòng','yếu tố nước ngoài','di chuyển địa lý'],
                neg: ['chưa chắc đã là chiến thắng — có thể bạn thua, nhưng chấp nhận được điều đó'] }
});

Object.assign(KW.en, {
  'major-0': { pos: ['a beginning','without fear','stepping into a new experience','courage','eager for the journey','optimistic','carefree and innocent'],
               neg: ['no plan made in advance','devil-may-care','careless','far too naive','immature'] },
  'major-1': { pos: ['masculine','active','takes the opportunity','catches the moment','capable, and knows it','action'],
               neg: ['arrogant','haughty','conceited','all action and nothing else','never knowing when to stop and weigh things calmly'] },
  'major-2': { pos: ['intuition','receptive','feminine','the spiritual','the subconscious'],
               neg: ['hidden','kept concealed','one-sided love','information withheld','sitting still and not acting'] },
  'major-3': { pos: ['plenty','abundance','comfort','ease','peace','convenience','warmth','pregnancy'],
               neg: ['smothering protection','a comfort zone','indulgence taken far too far'] },
  'major-4': { pos: ['structure','system','power','rules','leadership','the pillar of the house','dependable','solid','strict'],
               neg: ['rigid','conservative','controlling to excess','abuse of authority'] },
  'major-5': { pos: ['religion','school','education','learning','knowledge','system','tradition','culture','group work'],
               neg: ['loss of creativity','rigid','working to a set frame','following other people\'s rules'] },
  'major-6': { pos: ['love','a new opportunity','two opportunities arriving at once'],
               neg: ['a fork in the road','unable to choose between them','possibly a love triangle'] },
  'major-7': { pos: ['high determination','focused on the goal','fierce will','driving straight ahead','fearless','strong'],
               neg: ['too fast','obsessed with the target','never enjoying the process','ready to trample everything around to get there'] },
  'major-8': { pos: ['strength','strong','persistent','knowing who you are','knowing your own strengths and weaknesses','using love and patience to resolve a problem'] },
  'major-9': { pos: ['withdrawal','wanting to be alone','looking inward','seeking answers to the philosophical questions','a spiritual teacher','a guide'],
               neg: ['self-isolating','closing in on yourself','rather hard to please','still searching, not yet having found the answer'] },
  'major-10': { pos: ['a turning-point change','cycles','the turn of fate'],
                neg: ['the situation is out of your hands','good or bad depends — the card itself is neutral'] },
  'major-11': { pos: ['balance','fairness','clear sight','level-headed','rational','paperwork, procedure, the legal'],
                neg: ['too level-headed','short on feeling','trouble with documents'] },
  'major-12': { pos: ['a change of angle','waking up to something','accepting what is different in yourself','letting go of control'],
                neg: ['judged and scrutinised by others','seen as eccentric','alone on your own journey'] },
  'major-13': { pos: ['an ending you choose','shedding your skin','dying and living again','a new self that fits better'],
                neg: ['the moment of change is painful','it usually takes an upheaval before you will change','some old things have to be let go'] },
  'major-14': { pos: ['temperance','moderation','balance','harmony','peace'],
                neg: ['marking time','no visible change','a little too quiet'] },
  'major-15': { neg: ['temptation','craving','addiction','the animal overriding the person','blinded by temptation','no control over your own behaviour or feeling'] },
  'major-16': { pos: ['after the collapse you rebuild — the Star comes directly after the Tower'],
                neg: ['sudden collapse','an unexpected blow from outside','shock and trauma','many times more painful than Death'] },
  'major-17': { pos: ['hope','a bright future','sunshine after the rain','a new opportunity'],
                neg: ['being idealised','expectations pitched far too high','sitting in hope without acting'] },
  'major-18': { neg: ['bewilderment','worry','fear','a scene that is not real','a future that is not real'] },
  'major-19': { pos: ['victory with glory','clarity','brightness','abundant energy','happiness'],
                neg: ['come too close and you are scorched','an ego pitched too high','wanting the spotlight alone'] },
  'major-20': { pos: ['looking inward','watching the film of your life again','weighing up what you have been through','settled','mature','wise'] },
  'major-21': { pos: ['the close of a cycle','the end of a journey','ending in contentment','glad and satisfied','a foreign element','movement across geography'],
                neg: ['not necessarily victory — you may have lost, and be at peace with that'] }
});

/* keywords batch 2 - the four Threes */
Object.assign(KW.vi, {
  'wands-3': { pos: ['tham vọng','nhiều đam mê','đã nhìn ra chân trời mới','chờ thời điểm chín muồi'],
               neg: ['nhiều tham vọng quá mà không chịu làm','trì hoãn','chần chừ','sợ hãi','sợ thất bại','không chịu ra khỏi vùng an toàn','không biến ước mơ thành hành động'] },
  'swords-3': { pos: ['chỉ là chuyện nhỏ nhặt — vài ngày rồi quên, không phải Mười Kiếm','hoàn toàn nằm trong tầm kiểm soát của bạn vì là Ẩn Phụ'],
                neg: ['đau khổ','buồn bực','tâm trạng thất thường','để cảm xúc lấn át lý trí','tổn thương tình cảm cũ chưa được chữa lành'] },
  'cups-3': { pos: ['vui vẻ','ăn mừng','chúc tụng','chúc mừng','nhóm bạn bè','tụ tập','hướng ngoại'],
              neg: ['trong tình cảm thì mới dừng ở mức bạn bè','có thể có sự xuất hiện của người thứ ba'] },
  'pentacles-3': { pos: ['làm việc nhóm (từ khóa duy nhất)','cùng nhau giải quyết một vấn đề','hướng đến mục đích chung','nghiêm túc','hợp môi trường công sở đông người'],
                   neg: ['bản thân lá này trung lập — lợi hay hại thì tùy lá đi kèm','trong tình cảm thì chỉ ở mức đồng nghiệp, và mang tính vật chất'] }
});

Object.assign(KW.en, {
  'wands-3': { pos: ['ambition','plenty of passion','having seen the new horizon','waiting for the ripe moment'],
               neg: ['far too much ambition and no willingness to act','delay','hesitation','fear','fear of failing','refusing to leave the comfort zone','never turning the dream into action'] },
  'swords-3': { pos: ['only a small hurt — forgotten in a few days; this is not the Ten of Swords','entirely within your control, because it is a Minor'],
                neg: ['pain','distress','moodiness','letting feeling override reason','an old wound in love not yet healed'] },
  'cups-3': { pos: ['gladness','celebration','toasting','congratulation','a group of friends','gathering','outgoing'],
              neg: ['in love, still only at the level of friendship','a third person may have appeared'] },
  'pentacles-3': { pos: ['group work (her single keyword for it)','solving a problem together','working toward a common goal','serious','suited to a busy workplace'],
                   neg: ['the card itself is neutral — help or hindrance depends on the cards beside it','in love, only at the level of a colleague, and material in nature'] }
});

/* keywords batch 3 - the four Fours */
Object.assign(KW.vi, {
  'wands-4': { pos: ['ổn định','an toàn','vững chãi','ăn mừng và chúc mừng một thành tựu','kết hôn','nghiêm túc, lâu dài'],
               neg: ['vì muốn chắc chắn nên chưa chắc đã vui, chưa chắc đã lãng mạn'] },
  'swords-4': { pos: ['nghỉ ngơi','không hành động','sắp xếp lại những suy nghĩ hỗn độn trong đầu','suy xét kỹ trước khi bắt tay làm'],
                neg: ['giậm chân tại chỗ','không ra được quyết định khi cần quyết ngay lập tức','đôi khi là lười'] },
  'cups-4': { pos: ['vẫn là Ẩn Phụ số thấp — vấn đề nhỏ và hoàn toàn thay đổi được'],
              neg: ['thiển cận','chỉ nhìn thấy những gì trước mắt','đứng núi này trông núi nọ','không nhìn được bức tranh toàn cảnh','bỏ lỡ cơ hội ngay bên cạnh'] },
  'pentacles-4': { pos: ['bài học của lá: buông bỏ thì cánh cửa tốt hơn mới mở ra được'],
                   neg: ['tham lam','ích kỷ','giữ khư khư','không chịu buông bỏ','không chịu buông bỏ kiểm soát','sống với tâm thức thiếu thốn dù không hề thiếu'] }
});

Object.assign(KW.en, {
  'wands-4': { pos: ['stability','safety','solidity','celebrating an achievement','marriage','serious, for the long term'],
               neg: ['wanting certainty so much that it may not be much fun, and may not be romantic'] },
  'swords-4': { pos: ['rest','not acting','putting the tangle of thoughts back in order','weighing things carefully before starting'],
                neg: ['marking time','unable to decide when a decision is needed on the spot','sometimes simply laziness'] },
  'cups-4': { pos: ['still a low-numbered Minor — the problem is small and entirely changeable'],
              neg: ['short-sighted','seeing only what is directly in front','standing on one hill eyeing the next','missing the whole picture','overlooking the opportunity right beside you'] },
  'pentacles-4': { pos: ['the lesson of the card: only by letting go does the better door open'],
                   neg: ['greed','selfishness','clutching','refusing to let go','refusing to release control','living in a mindset of lack while lacking nothing'] }
});

/* keywords batch 4 - the four Fives */
Object.assign(KW.vi, {
  'wands-5': { pos: ['trung lập — tùy tình huống và lá đi kèm mà đọc','có thể tiêu cực lúc này nhưng về lâu dài lại tốt cho người hỏi'],
               neg: ['xung đột','tranh cãi','mâu thuẫn nội tâm','nhưng tất cả đều ở cường độ thấp, không lớn, không quá đau đớn'] },
  'swords-5': { pos: ['bài học: mọi cuộc tranh cãi để bảo vệ quan điểm đều là vô nghĩa'],
                neg: ['thắng bằng lời nói','thắng mà chẳng vẻ vang gì','thỏa mãn bản ngã nhất thời','dùng lời nói làm tổn thương người khác','khẩu nghiệp','năng lượng còn trẻ con'] },
  'cups-5': { pos: ['vẫn còn hai chiếc cốc đứng vững phía sau','giống một lời khuyên hơn là một sự kiện','hỏi xem mình học được bài học gì từ lần đổ vỡ này'],
              neg: ['thất bại','đổ vỡ','chỉ nhìn vào phần đã đổ','cường độ nhỏ — thất bại nhỏ, đổ vỡ nhỏ'] },
  'pentacles-5': { pos: ['vẫn là Ẩn Phụ — sự thiếu thốn này hoàn toàn thay đổi được, và nằm trong tầm tay người hỏi'],
                   neg: ['thiếu thốn','thảm hại','khổ sở','nghèo đói','tự ti','đôi khi chỉ là do người hỏi nghĩ rằng mình thiếu'] }
});

Object.assign(KW.en, {
  'wands-5': { pos: ['neutral — read it by the situation and the cards beside it','it may look negative now and prove good for the querent in the long run'],
               neg: ['conflict','argument','inner contradiction','but all of it at low intensity: not large, not deeply painful'] },
  'swords-5': { pos: ['the lesson: every argument fought to defend your own position is meaningless'],
                neg: ['winning by words','a win with no glory in it','a momentary satisfying of the ego','using words to wound','the karma carried by speech','the energy is still childish'] },
  'cups-5': { pos: ['two cups are still standing behind you','more a piece of advice than an event','ask what you learned from this breakage'],
              neg: ['failure','breakage','looking only at what spilled','small in intensity — a small failure, a small loss'] },
  'pentacles-5': { pos: ['still a Minor — this lack is entirely changeable, and the change is within the querent\'s hands'],
                   neg: ['lack','wretchedness','hardship','poverty','self-doubt','sometimes only because the querent believes they lack'] }
});

/* keywords batch 5 - the four Sixes */
Object.assign(KW.vi, {
  'wands-6': { pos: ['chiến thắng','thành tựu — nhưng là thành tựu nhỏ, ngắn hạn','được khen ngợi, được công nhận'],
               neg: ['kiêu ngạo','kiêu căng','ngạo mạn','tự phụ','chủ quan vì mới thắng một trận nhỏ'] },
  'swords-6': { pos: ['rời khỏi một tình huống xấu để đến một tình huống tốt hơn','di chuyển','quyết định của lý trí chứ không phải của cảm xúc'],
                neg: ['tại thời điểm rời đi vẫn rất buồn và luyến tiếc','cơn đau dai dẳng ngày qua ngày','bám vào vùng an toàn dù nó không còn phục vụ mình'] },
  'cups-6': { pos: ['tình cảm thuần khiết, đơn thuần','ngây thơ','tươi mới','niềm vui trẻ con','kỷ niệm và cảm xúc thuở ban đầu'],
              neg: ['nếu là mối quan hệ lâu năm thì đang thiếu lửa, thiếu lãng mạn, chỉ còn trách nhiệm và nghĩa vụ'] },
  'pentacles-6': { pos: ['rộng lượng','cho đi','hào phóng','công bằng — cho đi và nhận lại tương xứng','lý trí trong chuyện tiền bạc'],
                   neg: ['tính toán, cân đo đong đếm thiệt hơn','đánh bóng tên tuổi','giúp đỡ vì mong nhận lại điều gì đó','khiến người xung quanh cảm thấy thiếu chân thành'] }
});

Object.assign(KW.en, {
  'wands-6': { pos: ['victory','an achievement — but a small, short-term one','being praised, being recognised'],
               neg: ['arrogance','conceit','hubris','self-importance','complacency after winning one small round'] },
  'swords-6': { pos: ['leaving a bad situation for a better one','moving on','a decision made by reason rather than feeling'],
                neg: ['at the moment of leaving you are still sad and full of regret','a nagging ache that goes on day after day','clinging to a comfort zone that no longer serves you'] },
  'cups-6': { pos: ['a pure, simple feeling','innocence','freshness','a childlike gladness','the memories and feelings of the beginning'],
              neg: ['in a long relationship, the fire and the romance have gone and only duty and obligation are left'] },
  'pentacles-6': { pos: ['generosity','giving','open-handedness','fairness — giving and receiving in equal measure','rationality about money'],
                   neg: ['calculating, weighing gain against loss','burnishing a reputation','helping in the hope of something back','leaving those around them feeling the sincerity is thin'] }
});

/* keywords batch 6 - the four Sevens */
Object.assign(KW.vi, {
  'wands-7': { pos: ['giống một bài học cần học hơn là một nghĩa tiêu cực','giữ vững vị trí của mình'],
               neg: ['chiến đấu không cần thiết','dành công sức, năng lượng và thời gian cho những thứ vô bổ','sân si','luôn nghĩ người khác đang muốn tấn công mình','thiếu sự nhìn nhận bản thân'] },
  'swords-7': { neg: ['lén lút','tham lam','làm gì đó sau lưng người khác','nói xấu sau lưng','ngoại tình','thị phi, drama','thao túng cảm xúc'] },
  'cups-7': { pos: ['có rất nhiều lựa chọn đến với bạn'],
              neg: ['nhưng bạn chẳng thích lựa chọn nào','phân vân, lưỡng lự, thiếu quyết đoán','để người khác quyết định hộ mình','mông lung, u ám'] },
  'pentacles-7': { pos: ['kiên trì','bền bỉ','nhẫn nại','công sức bỏ ra sẽ được đền đáp xứng đáng','chậm mà chắc'],
                   neg: ['hơi bị động','hơi chậm','không quyết đoán khi cần quyết định nhanh','thành quả đến chậm hơn bạn mong muốn'] }
});

Object.assign(KW.en, {
  'wands-7': { pos: ['more a lesson to be learned than a negative meaning','holding your own ground'],
               neg: ['fighting battles that do not need fighting','spending effort, energy and time on the pointless','contentiousness','always believing others are out to attack you','no capacity for looking at yourself'] },
  'swords-7': { neg: ['furtiveness','greed','doing something behind someone\'s back','talking about people behind their backs','infidelity','gossip and drama','emotional manipulation'] },
  'cups-7': { pos: ['a great many choices are arriving'],
              neg: ['and you want none of them','wavering, hesitant, indecisive','letting other people decide for you','murky and overcast'] },
  'pentacles-7': { pos: ['persistence','endurance','patience','the effort you put in will be repaid in kind','slow but sure'],
                   neg: ['somewhat passive','somewhat slow','not decisive when a fast decision is needed','the result arrives more slowly than you want'] }
});

/* keywords batch 07 - the four Aces and the four Twos */
Object.assign(KW.vi, {
  'wands-1': { pos: ['một khởi đầu mới','sự chủ động — từ khóa rất quan trọng của tất cả các lá Ace','chủ động nắm bắt cơ hội, chủ động tự tạo ra cơ hội cho bản thân','bắt đầu một hành động, một đam mê, một nhiệt huyết','ra ngoài để làm một cái gì đấy'],
               neg: ['không có nghĩa tiêu cực gì cả','nếu ra khi xin lời khuyên thì là người hỏi đang thiếu năng lượng này — đang lười, đang bất cần đời','miêu tả người thì hơi nóng tính một chút'] },
  'swords-1': { pos: ['một suy nghĩ mới, một ý tưởng mới','tư duy mới, quan điểm sống mới, điểm nhìn mới','sáng tỏ một vấn đề','chém đứt mọi lời nói dối và những suy nghĩ vớ vẩn, thiển cận để đến được kết luận cuối cùng','sự tỉnh ngộ — tự mình tỉnh ra','nhìn được bức tranh toàn cảnh thay vì chỉ một điểm không vừa mắt'],
                neg: ['tất cả các lá Ace đều không mang nghĩa tiêu cực','nếu thiếu năng lượng này thì đang mông lung, lo lắng, tự nghĩ ra những viễn cảnh tồi tệ chưa hề xảy ra'] },
  'cups-1': { pos: ['một khởi đầu mới về mặt tình cảm, một cảm xúc mới','người tràn đầy cảm xúc tích cực','yêu bản thân, yêu quý những người xung quanh và sẵn sàng giúp đỡ mọi người','luôn nhìn đời bằng lăng kính tích cực','ra cho câu hỏi tình cảm thì quá viên mãn'],
              neg: ['thường không có nghĩa tiêu cực — Người đọc bài chưa gặp nghĩa tiêu cực bao giờ'] },
  'pentacles-1': { pos: ['một cơ hội vật chất, một cơ hội hữu hình mới','những gì cầm được, sờ được, làm được, thấy được','người thực tế mà vẫn rất tích cực','thêm một nhánh mới để có thêm thu nhập cho bản thân'],
                   neg: ['không có nghĩa tiêu cực, trừ khi bạn là kiểu người đọc bài ngược','một Xu không cho thấy sự thực tế của họ có đến mức lươn lẹo, thực dụng quá hay đào mỏ hay không'] },
  'wands-2': { pos: ['tham vọng — từ khóa lớn nhất của lá này','tầm nhìn: nhìn xa trông rộng','khá giỏi','muốn làm nhiều thứ'],
               neg: ['tham vọng quá đà thì phải trả giá cho lòng tham của mình','đạt được mục tiêu rồi lại mất hết những gì xung quanh','có thể chỉ nghĩ chứ chưa chắc đã hành động — phải nhìn thêm các lá đi kèm'] },
  'swords-2': { pos: ['không hẳn là xấu — không tàn bạo như Ác Quỷ hay Tòa Tháp','là tình huống tạm thời: hôm nay bạn hèn không có nghĩa nghe xong trải bài bạn vẫn còn hèn'],
                neg: ['hai luồng suy nghĩ trong đầu: phải chọn A hay B mà chưa chọn','hoang mang, phân vân, không biết phải làm gì tại thời điểm này','tự che mắt bản thân, làm việc khác để sao nhãng, để không phải nhìn vào vấn đề','trốn tránh thực tế, tạm thời trốn tránh việc phải ra quyết định','thiếu quyết đoán, hèn'] },
  'cups-2': { pos: ['sự hợp tác hơn là tình yêu','sự kết hợp, kết nối giữa hai bên: làm ăn, kinh doanh, tình bạn, tình cảm','gặp được một người tri kỷ, một người phù hợp với mình','mang năng lượng cung Thiên Bình: giỏi cân bằng, giỏi thương thảo, thuyết phục người khác, giỏi bán hàng'],
              neg: ['thường được diễn giải theo hướng tích cực nhiều hơn — chưa thấy nghĩa tiêu cực của lá này'] },
  'pentacles-2': { pos: ['cân bằng, linh hoạt, mềm dẻo — từ khóa chính của lá này','biết cách chèo lái suôn sẻ qua tình huống','lá ở giữa, không tiêu cực cũng không tích cực'],
                   neg: ['bận rộn hơn bình thường, phải làm hai việc cùng một lúc','tình huống khá hỗn loạn, không ổn định và không yên bình — phía sau anh chàng là sóng gió','nếu bài khuyên bạn linh hoạt hơn thì tức là hiện tại bạn đang thiếu linh hoạt, đang quá cứng nhắc và chưa biết cân bằng cuộc sống'] }
});

Object.assign(KW.en, {
  'wands-1': { pos: ['a new beginning','being proactive — the key keyword of every Ace','seizing an opportunity, and making an opportunity for yourself','the start of an action, of a passion, of enthusiasm','going out to do something'],
               neg: ['no negative meaning at all','if it comes up as advice, the querent is missing this energy — lazy right now, past caring','describing a person: a little hot-tempered'] },
  'swords-1': { pos: ['a new thought, a new idea','new thinking, a new outlook, a new point of view','a matter becoming clear','cutting away every lie and every idle, narrow thought to reach the final conclusion','waking up — coming to your senses by yourself','seeing the whole picture instead of the one detail that offends the eye'],
                neg: ['no Ace carries a negative meaning','if this energy is missing you are lost and anxious, inventing worst-case scenarios that have not happened'] },
  'cups-1': { pos: ['a new beginning in feeling; a new emotion','a person overflowing with positive feeling','loves themselves, loves the people around them, ready to help anyone','always looks at life through a positive lens','on a love question, as complete as it gets'],
              neg: ['usually no negative meaning — the reader has never met one'] },
  'pentacles-1': { pos: ['a material opportunity, a new tangible opportunity','whatever can be held, touched, done and seen','practical, and still very positive','a new branch of income opening up for you'],
                   neg: ['no negative meaning, unless you are a reader who reads reversals','one Pentacle does not tell you whether their practicality has tipped into slyness, greed or gold-digging'] },
  'wands-2': { pos: ['ambition — the biggest keyword of this card','vision: seeing far and seeing wide','quite capable','wanting to do a great many things'],
               neg: ['ambition carried too far, and the price paid for that greed','reaching the goal and losing everything around you','they may only be thinking it, not doing it — check the accompanying cards'] },
  'swords-2': { pos: ['not exactly bad — nothing as brutal as the Devil or the Tower','a temporary state: being a coward today does not mean you are still one once the reading ends'],
                neg: ['two lines of thought in one head: choose A or B, and no choice made','confused and torn, not knowing what to do at this moment','blindfolding yourself, doing something else as a distraction so you never look at the problem','avoiding reality; avoiding, for now, the decision that has to be made','indecisive, cowardly'] },
  'cups-2': { pos: ['partnership rather than love','a joining, a connection between two sides: business, trade, friendship, romance','finding a kindred spirit, someone who fits you','the energy of Libra: good at balance, good at negotiating and persuading, good at selling'],
              neg: ['usually read positively — the reader has not found a negative meaning for this card'] },
  'pentacles-2': { pos: ['balance, flexibility, suppleness — the main keyword here','knowing how to steer smoothly through the situation','a card in the middle: neither negative nor positive'],
                   neg: ['busier than usual, having to do two jobs at once','a fairly chaotic, unstable and far from peaceful situation — behind the juggler the sea is rough','if the cards are advising you to be more flexible, then right now you are not: too rigid, and not yet balancing your life'] }
});
