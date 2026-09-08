/* ==================== question-specific readings ====================
   For each tarot card, the questions people most often bring to a reading
   (love, career, money, health, timing, yes/no) and the course's answer:
   how the card leans, what it describes, and when one card is not enough
   and more cards should be drawn. Vietnamese only (shown in the course).
   [category, question, answer] -- unbounded per card. */
const ASK = { vi: {}, en: {}, de: {} };

const KW = { vi: {}, en: {} };

/* batch 1 - Majors 0-3 (The Fool, Magician, High Priestess, Empress) */
Object.assign(ASK.vi, {
'major-0': [
      ['love', 'Người yêu tiếp theo của tôi là người như thế nào?',
       'Người yêu tiếp theo của bạn nhiều khả năng là một người thích khám phá. Họ luôn muốn thử những điều chưa từng làm và không chịu được cảm giác ngày nào cũng giống ngày nào. Ở bên họ, bạn sẽ thấy vui, nhưng bạn cũng cần chuẩn bị tinh thần rằng họ có thể chưa nghĩ đến chuyện cam kết lâu dài hay kết hôn sớm. Một lá bài chưa đủ để nói rõ điều này, nên bạn hãy rút thêm lá nếu muốn biết chắc. Nếu bản thân bạn cũng có tính cách tương tự, hai người sẽ có một mối quan hệ rất sôi nổi và có phần liều lĩnh. Để đi cùng nhau lâu dài, hai người nên chia sẻ những giá trị nền tảng và khác nhau ở tính cách để bổ sung cho nhau. Khi hai người quá giống nhau, những điểm yếu cũng được nhân đôi và không ai có thể kéo người kia lại.'],
      ['love', 'Chúng tôi đang trong lúc cãi nhau, tôi có nên chia tay không?',
       'Chia tay hay không là một câu hỏi tế nhị. Theo nguyên tắc chung khi đọc bài, bạn nên tìm hiểu hoàn cảnh của người hỏi và rút thêm lá trước khi đưa ra lời khuyên. Với những cặp đôi chỉ mâu thuẫn vì những chuyện nhỏ nhặt, Gã Khờ không khuyên chia tay. Lá này gợi ý rằng mối quan hệ đang thiếu sự mới mẻ, và nhiều cặp đôi cãi nhau chỉ vì cuộc sống chung đã trở nên quá đều đặn. Hai người có thể làm mới tình cảm bằng một hoạt động chưa từng làm cùng nhau, ví dụ như một chuyến đi ngắn hay một sở thích mới. Ngược lại, nếu mối quan hệ đã gây tổn thương thật sự, lá này ủng hộ bạn rời khỏi vùng quen thuộc để tìm một trải nghiệm khác, kể cả việc sống một mình một thời gian.'],
      ['career', 'Tôi đang thất nghiệp, sắp tới tôi có tìm được việc không?',
       'Câu trả lời nghiêng về có. Tuy nhiên, công việc sắp đến nhiều khả năng nằm ngoài chuyên môn và kinh nghiệm hiện có của bạn, vì Gã Khờ thường mang đến một khởi đầu hoàn toàn mới. Ví dụ, một người từng làm bán hàng có thể nhận được lời mời làm thiết kế dù chưa từng học qua. Bạn nên sẵn sàng đón nhận một hướng đi khác với những gì mình đã dự tính.'],
      ['career', 'Tôi đang đi làm, sắp tới công việc của tôi có gì mới?',
       'Trong thời gian tới, bạn có thể được giao một dự án thuộc lĩnh vực hoàn toàn mới. Đây là việc bạn chưa có kinh nghiệm, nên bạn sẽ phải học từ đầu.'],
      ['career', 'Tôi vừa nhận công việc mới, tôi nên làm gì?',
       'Khi bắt đầu một việc chưa quen, bạn rất dễ mắc lỗi. Vì vậy, bạn hãy dành nhiều thời gian để học, mạnh dạn hỏi đồng nghiệp và người quản lý, và tiến từng bước thay vì muốn giỏi ngay. Trong khóa học này, bạn cần nhớ rằng ý nghĩa của lá bài chỉ là phần mở đầu của một lần đọc. Phần quan trọng hơn là lời khuyên mà bạn rút ra sau khi suy luận từ lá bài và hoàn cảnh của người hỏi.'],
      ['other', 'Khi hỏi về năng lượng hiện tại, lá này nói gì?',
       'Gã Khờ nói rằng bạn cần tự mình bước đi. Năng lượng của lá này là sự tò mò và tinh thần chủ động khám phá. Nếu bạn đang chờ mọi thứ tự đến, lá này khuyên bạn đứng dậy và đi tìm.']
    ],

    'major-1': [
      ['love', 'Người yêu tiếp theo của tôi là người như thế nào?',
       'Người này có năng lực thật sự và tự tin về năng lực đó. Trong lĩnh vực của mình, họ làm việc rất tốt. Trong cuộc sống hằng ngày, họ nhanh nhạy nắm bắt cơ hội và biết cách xử lý tình huống. Nếu xét về mặt công việc, bạn khó tìm ra điểm nào để chê ở người này.'],
      ['love', 'Người ấy có yêu tôi nhiều không?',
       'Với câu hỏi này, một lá Nhà Ảo Thuật không đủ để trả lời. Lá này chủ yếu mô tả con người và cách hành động của người ấy, chứ không đo được mức độ tình cảm. Bạn cần rút thêm lá để biết họ yêu bạn nhiều hay ít.'],
      ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
       'Nhà Ảo Thuật nói về hành động nhiều hơn cảm xúc, nên lá này chưa cho biết tình cảm của người ấy sâu đậm đến đâu. Điều bạn có thể chắc chắn là người ấy đang chủ động tiếp cận bạn. Sự chủ động đó có xuất phát từ tình yêu thật sự hay không thì bạn cần xem thêm lá khác. Khi lá này xuất hiện cùng Át Cốc, bạn có thể tin rằng người ấy có tình cảm và sẵn sàng thể hiện. Người mang năng lượng Nhà Ảo Thuật thường nói thẳng điều mình cảm thấy và không để cảm xúc chờ đợi lâu.'],
      ['love', 'Chúng tôi đang cãi nhau, lá này khuyên gì cho mối quan hệ?',
       'Lời khuyên của lá này là bạn hãy là người mở lời. Bạn nên trực tiếp gặp người ấy, chủ động trò chuyện và cùng nhau tìm cách giải quyết. Mọi giải pháp cần đến từ hai người, nên bạn không cần tìm câu trả lời ở người ngoài.'],
      ['love', 'Tôi có nên chia tay không?',
       'Nhà Ảo Thuật khuyên bạn hãy hành động, nhưng hành động ở đây không nhất thiết là chia tay. Đó có thể là việc bạn chủ động ngồi lại với người ấy để nói chuyện rõ ràng. Nhiều cặp đôi sau một cuộc trò chuyện thẳng thắn lại hiểu nhau hơn và tiếp tục ở bên nhau. Vì chia tay hay nghỉ việc đều là những quyết định nhạy cảm, bạn nên rút thêm lá để có câu trả lời rõ hơn.'],
      ['career', 'Tôi đã thất nghiệp sáu tháng, sắp tới tôi có tìm được việc không?',
       'Bạn có thể tìm được việc, nhưng chỉ khi bạn tự đi tìm thay vì chờ đợi. Lá này cũng cho bạn một gợi ý về hoàn cảnh của người hỏi. Nhiều khả năng họ đang khá thụ động, ở nhà và mong một lời mời làm việc tự tìm đến. Nhà Ảo Thuật nhắc rằng cơ hội chỉ đến khi bạn ra ngoài và hành động.'],
      ['money', 'Tháng này tôi có gì mới không?',
       'Tháng này, bạn sẽ tự tạo ra một cơ hội về công việc hoặc tiền bạc. Cơ hội đó không do ai mang đến, mà do chính bạn mở ra cho mình. Bạn có thể tự tìm được một cách kiếm tiền mới.'],
      ['verdict', 'Tôi có nên nghỉ việc không?',
       'Một lá Nhà Ảo Thuật chưa đủ để trả lời có hay không, và bạn cần xét theo hoàn cảnh của người hỏi. Nếu môi trường làm việc hoặc mối quan hệ đang gây hại cho bạn, lá này khuyên bạn chủ động rời đi. Nếu bạn chỉ đang chán trong một giai đoạn, bạn nên bắt đầu bằng những thay đổi trong tầm tay. Bạn có thể sắp xếp lại cách làm việc, nói chuyện với những người liên quan, và thay đổi chính mình trước. Chỉ khi những cách đó không hiệu quả, bạn mới nên nghĩ đến việc kết thúc.']
    ],

    'major-2': [
      ['love', 'Người yêu tiếp theo của tôi là người như thế nào?',
       'Người yêu tiếp theo của bạn là một người có trực giác nhạy bén và khả năng quan sát tinh tế. Dù là nam hay nữ, phần năng lượng âm trong họ chiếm ưu thế, kể cả khi vẻ ngoài của họ rất mạnh mẽ. Thay vì hành động ngay, họ thường lùi lại để quan sát. Sau đó, họ dựa vào cảm nhận bên trong để đưa ra nhận định về một người hay một tình huống.'],
      ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
       'Nữ Tư Tế chưa cho biết tình cảm đó nhiều hay ít. Lá này chỉ nói rằng người ấy hiện đang đứng yên và quan sát bạn từ xa. Có thể họ có cảm tình với bạn, nhưng đó là tình cảm một phía, và họ chọn cách giữ kín thay vì nói ra. Vì sao họ giấu thì bạn cần nhìn sang các lá khác. Có thể họ sợ bị từ chối, có thể họ là người thích giữ vẻ bí ẩn, hoặc họ đang chờ thời điểm thích hợp vì một trong hai người đang có mối quan hệ khác. Điều quan trọng nhất là cho đến lúc này, họ chưa có hành động nào.'],
      ['love', 'Chúng tôi đang trong lúc cãi nhau, tôi có nên chia tay không?',
       'Lá này khuyên bạn khoan chia tay. Bạn hãy giữ bình tĩnh, cho mình thời gian và lắng nghe cảm nhận bên trong. Nếu sau khi tĩnh tâm, trực giác của bạn vẫn nói rằng nên dừng lại, khi đó bạn có thể quyết định. Một quyết định đưa ra ngay trong lúc nóng giận sẽ mang tính bốc đồng, và bạn có thể hối tiếc về sau.'],
      ['love', 'Chúng tôi đang cãi nhau, lá này khuyên gì cho mối quan hệ?',
       'Nữ Tư Tế khuyên hai người tạm lùi lại một chút. Mỗi người nên có thời gian và không gian riêng để suy ngẫm. Có những cặp đôi càng ở gần và nói chuyện nhiều thì càng dễ va chạm, và một khoảng cách vừa phải lại giúp tình cảm dịu xuống. Bạn cũng không nên cố phân tích từng câu nói của nhau để tìm xem ai đúng ai sai, vì cách đó chỉ khiến cả hai mệt mỏi. Câu trả lời cho mối quan hệ nằm ở bên trong mỗi người, không nằm ở những ý kiến từ bên ngoài.'],
      ['career', 'Tôi đã thất nghiệp sáu tháng, sắp tới tôi có tìm được việc không?',
       'Lá này nghiêng về khả năng bạn chưa tìm được việc trong thời gian tới. Nữ Tư Tế mang năng lượng của những điều còn ẩn giấu và chưa thành hình. Có thể hướng tìm việc hiện tại của bạn chưa phù hợp. Cũng có thể bạn chưa thật sự biết mình hợp với ngành nào, nên bạn gửi hồ sơ đi khắp nơi mà không có trọng tâm. Thay vì tiếp tục như vậy, bạn hãy dừng lại và tự hỏi mình muốn làm công việc như thế nào. Khi câu trả lời bên trong đã rõ, việc tìm kiếm bên ngoài sẽ dễ hơn.'],
      ['career', 'Tôi đang đi làm bình thường, thời gian tới công việc của tôi có gì mới không?',
       'Với người hỏi đang đi làm ổn định, bạn không nên vội khuyên họ tĩnh tâm để cân nhắc nghỉ việc, vì họ không có ý định đó. Lớp nghĩa phù hợp hơn của Nữ Tư Tế trong trường hợp này là thông tin đang được giữ kín. Có thể một việc gì đó đang diễn ra mà bạn chưa biết, và việc đó không nhất thiết là xấu. Ví dụ, cấp trên có thể đang cân nhắc giao cho bạn một vai trò mới nhưng chưa nói ra. Điều gì đang bị giấu, ai đang giữ kín, và điều đó tốt hay xấu cho bạn thì bạn cần xem những lá tiếp theo.'],
      ['other', 'Khi chỉ rút được một mình lá này, tôi nên đọc thế nào?',
       'Nữ Tư Tế là một trong những lá khó đọc nhất khi đứng một mình, vì ý nghĩa của nó thường ẩn và chưa rõ. Theo nguyên tắc chung khi đọc bài, nếu lá này xuất hiện một mình, bạn nên rút thêm ít nhất một lá nữa để có đủ thông tin trước khi diễn giải.']
    ],

    'major-3': [
      ['love', 'Lá này miêu tả một người như thế nào?',
       'Hoàng Hậu mô tả một người có năng lượng của người mẹ. Họ thích chăm lo cho người khác và làm việc đó rất khéo, từ bữa ăn đến việc nhà. Vẻ ngoài của họ thường chỉn chu, mềm mại và có nét nữ tính, ngay cả khi họ là nam giới. Bạn cần phân biệt lá này với Nữ Tư Tế. Nữ tính của Nữ Tư Tế nằm ở bên trong và thể hiện qua trực giác cùng tiềm thức. Nữ tính của Hoàng Hậu hiện ra bên ngoài, ở những gì bạn có thể nhìn thấy và chạm vào.'],
      ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
       'Hoàng Hậu thường mang năng lượng tích cực, nên nhiều khả năng người ấy có tình cảm với bạn. Tuy nhiên, tình cảm này mang màu sắc của sự bao bọc. Người ấy yêu bạn và muốn lo cho bạn từng việc nhỏ. Sự chăm sóc đó đang ở mức lành mạnh hay đã thành quá mức thì bạn cần xem thêm các lá xung quanh.'],
      ['love', 'Chúng tôi cãi nhau nhiều, tôi có nên chia tay không?',
       'Trong đa số trường hợp, câu trả lời là không nên chia tay. Hai người có thể đang quá quan tâm đến nhau, đến mức những chuyện nhỏ cũng trở thành lý do để tranh cãi. Mối quan hệ này cần giảm bớt phần bao bọc như mẹ với con và trả lại cho nhau vai trò của hai người yêu nhau.'],
      ['love', 'Chúng tôi hay cãi nhau, lời khuyên cho mối quan hệ này là gì?',
       'Hai người nên nới lỏng khoảng cách và dành cho nhau chút không gian riêng. Hoàng Hậu gợi ý rằng một trong hai người đang cho đi quá nhiều và chăm sóc quá dày, đến mức người kia cảm thấy bị bao vây. Khi mỗi người có thêm chỗ để thở, mối quan hệ sẽ nhẹ nhàng hơn.'],
      ['money', 'Tiền bạc của tôi tháng này thế nào?',
       'Tài chính tháng này của bạn khá dồi dào. Bạn không chỉ đủ chi tiêu mà còn có phần dư ra. Hoàng Hậu là lá của sự sung túc, nên khi lá này xuất hiện, mọi thứ thường nhiều hơn mức cần thiết một chút.'],
      ['career', 'Trong thời gian tới, tôi có tìm được việc làm không?',
       'Câu trả lời là có. Công việc sắp tới còn mang lại cho bạn sự thoải mái, hoặc đưa bạn vào một môi trường có nhiều năng lượng nữ. Đó có thể là ngành dịch vụ, làm đẹp, y tế, điều dưỡng, kinh doanh nhỏ, hoặc bất kỳ việc gì gắn với chăm sóc con người. Cũng có thể đó là một công việc có thu nhập tốt, hoặc một nơi mà phần lớn cấp trên và đồng nghiệp là phụ nữ. Nhìn chung, đây sẽ là một môi trường dễ chịu để bạn làm việc.'],
      ['career', 'Tôi đang làm văn phòng bình thường, thời gian tới công việc của tôi có biến chuyển gì không?',
       'Công việc của bạn sắp có thêm lộc. Bạn sẽ nhận nhiều dự án hơn, và thu nhập của bạn cũng tăng theo.'],
      ['other', 'Lá này nói gì về chuyện con cái?',
       'Trong bộ bài 78 lá, Hoàng Hậu gần như là lá duy nhất nói thẳng về việc mang thai và sinh con. Chuyện kết hôn lại được thể hiện qua những lá khác, không phải lá này.']
    ]
});

/* batch 2 - Majors 4-6 (Emperor, Hierophant, Lovers) */
Object.assign(ASK.vi, {
  'major-4': [
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Nếu hai người mới quen nhau khoảng một tháng và bạn muốn biết người ấy có nghiêm túc hay không, Hoàng Đế cho thấy họ có ý định lâu dài thật. Tuy nhiên, cách yêu của họ mang nhiều tính kiểm soát. Họ muốn mọi việc diễn ra theo ý mình và có khí chất áp đảo người khác, dù họ không phải người xấu. Sống cùng người này, bạn sẽ thường phải nhường. Nếu bạn cũng là người thích làm chủ, hai người khó tránh khỏi xung đột, vì một mối quan hệ không thể có hai người cùng cầm quyền. Tóm lại, người ấy nghiêm túc với bạn, nhưng họ cứng nhắc và hay áp đặt.'],
    ['love', 'Chúng tôi đang cãi nhau to, lời khuyên cho mối quan hệ này là gì?',
     'Hoàng Đế khuyên bạn dừng việc kiểm soát. Bạn hãy thôi điều khiển người kia và thôi điều khiển mối quan hệ. Có thể bạn mong họ cư xử đúng như bạn muốn, nhưng một mối quan hệ chỉ bền khi cả hai biết nhường nhịn, thỏa hiệp và chấp nhận con người thật của nhau. Người bạn yêu là một người trưởng thành, không phải một đứa trẻ để bạn dạy dỗ.'],
    ['career', 'Trong ba tháng tới, công việc của tôi có điều gì cần lưu ý?',
     'Điểm bạn cần chú ý trong ba tháng tới là người có quyền. Lá này mở ra hai khả năng. Thứ nhất, bạn có thể gặp chuyện với cấp trên. Một lá Hoàng Đế chưa nói được họ quý hay ghét bạn, mà chỉ báo rằng một nhân vật có quyền lực sẽ đóng vai trò quan trọng. Thứ hai, chính bạn có thể được đưa lên một vị trí có quyền quyết định. Vị trí đó chưa hẳn là trưởng phòng hay giám đốc, có thể chỉ là người dẫn dắt một nhóm nhỏ, nhưng bạn sẽ có người dưới quyền để phân việc.'],
    ['career', 'Tôi đã thất nghiệp sáu tháng, sắp tới tôi có tìm được việc không?',
     'Lá này không nghiêng hẳn về tốt hay xấu, nên câu trả lời chưa rõ ràng. Có thể bạn tìm được việc, nhưng ở nơi mới bạn sẽ gặp một người mang năng lượng Hoàng Đế. Người này khắt khe, hay xét nét và ít linh hoạt. Bù lại, họ công bằng. Khi bạn làm tốt, họ không ngại ghi nhận và thưởng cho bạn. Điều kiện duy nhất là bạn phải tuân theo nguyên tắc của họ.'],
    ['career', 'Người mang năng lượng của lá này hợp với công việc gì?',
     'Một cách đọc là người này nên tự gây dựng công việc riêng thay vì tiếp tục đi làm thuê. Họ khó hòa hợp với bất kỳ cấp trên nào, vì bản chất của họ là muốn đứng ở vị trí cao nhất. Tất nhiên, không ai vừa vào một công ty đã được làm quản lý ngay. Nhưng nếu người hỏi còn trẻ, chỉ mới ngoài hai mươi tuổi, mà đã mang năng lượng này, con đường tự làm chủ sẽ phù hợp với họ hơn.'],
    ['other', 'Lá này còn báo hiệu vấn đề với ai?',
     'Hoàng Đế tượng trưng cho quyền lực và bộ máy chính quyền. Khi lá này xuất hiện, bạn có thể đang gặp khó khăn với cha, với gia đình, với chồng nếu bạn đã kết hôn, với cấp trên, hoặc với cơ quan công quyền. Những rắc rối như bị xử phạt vì vi phạm giao thông cũng thuộc nhóm này. Bạn cần phân biệt lá này với Công Lý. Công Lý thiên về giấy tờ, thủ tục và pháp lý, và đôi khi chỉ là chuyện giữa hai cá nhân với nhau.']
  ],

  'major-5': [
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Nếu hai người mới hẹn hò khoảng một tháng và bạn băn khoăn về sự chân thành của người ấy, Giáo Hoàng cho thấy họ nghiêm túc, thậm chí đang nghĩ đến chuyện kết hôn. Dù vậy, bạn nên rút thêm lá để xem có lá Cốc nào đi kèm không. Một trải bài tình cảm mà thiếu bộ Cốc thì phần cảm xúc chưa thật sự nhiều. Người ấy muốn cưới, nhưng lá này chưa cho biết động cơ là tình yêu hay là những điều kiện bên ngoài, ví dụ như gia đình bạn có của cải hoặc địa vị.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Có thể bạn đang bám vào những nguyên tắc của mình đến mức không nhìn được toàn cảnh. Bạn tin rằng mình đúng và người kia sai, chỉ vì bạn được dạy như vậy. Người mang năng lượng Giáo Hoàng rất tuân thủ quy tắc, và đó là một điểm mạnh. Nhưng cũng vì thế, họ ít khi tìm ra một lối đi mới cho vấn đề.'],
    ['love', 'Lời khuyên cho một mối quan hệ đang cãi nhau là gì?',
     'Giáo Hoàng khuyên bạn đầu tư vào việc học. Thay vì dồn toàn bộ tâm trí vào mối quan hệ, bạn hãy chọn một môn học hay một kỹ năng cho riêng mình để nâng cao giá trị và hiểu biết của bản thân. Khi bạn có việc riêng để tập trung, bạn sẽ bớt nghĩ quá nhiều về mối quan hệ, và những cuộc cãi vã cũng giảm đi.'],
    ['career', 'Thời gian tới công việc của tôi có gì mới?',
     'Thời gian tới, bạn có thể gặp một người dẫn dắt trong công việc, hoặc được cơ quan cử đi hội thảo hay khóa đào tạo để nâng cao chuyên môn. Cũng có thể bạn tự đăng ký học thêm, lấy một chứng chỉ mới hoặc một bằng ngoại ngữ phục vụ công việc. Nói rộng ra, Giáo Hoàng gắn với việc học và làm việc theo nhóm. Bạn có thể được đưa vào một nhóm dự án mới với vai trò thành viên. Lá này chưa nói rằng bạn sẽ đứng đầu nhóm đó.'],
    ['other', 'Lá này khác Hoàng Đế ở chỗ nào?',
     'Hai lá này cùng nói về luật lệ, hệ thống và sự nghiêm khắc. Điểm khác biệt nằm ở chỗ ai là người đặt ra luật. Hoàng Đế là người tạo ra quy tắc và muốn người khác theo quy tắc của mình. Giáo Hoàng là người sống theo quy tắc đã có sẵn và làm đúng những gì hệ thống cùng người đi trước chỉ dạy.'],
    ['other', 'Lá này còn nói về điều gì?',
     'Giáo Hoàng gắn với tôn giáo, trường học, giáo dục, tri thức, hệ thống, truyền thống và văn hóa. Lá này cũng nói về hôn nhân, vì bản thân hôn nhân là một truyền thống. Ngoài ra, lá này còn chỉ những ảnh hưởng vô thức của nền văn hóa mà bạn lớn lên trong đó. Bạn thường mặc định rằng mọi người đều suy nghĩ giống mình, cho đến khi bạn sống trong một nền văn hóa khác. Trong bộ bài 78 lá, Giáo Hoàng và Ba Tiền là hai lá duy nhất nói về làm việc nhóm.']
  ],

  'major-6': [
    ['love', 'Có ai thích tôi không?',
     'Có thể hai người sẽ để ý đến bạn cùng lúc, và bạn cũng có cảm tình với cả hai nên khó chọn. Bạn cần phân biệt lá này với Bảy Cốc. Ở Bảy Cốc, nhiều người vây quanh bạn nhưng bạn không thấy ai phù hợp. Ở lá này, bạn có hai lựa chọn và bạn thích cả hai, nên bạn phân vân.'],
    ['love', 'Người ấy có thích tôi không?',
     'Câu trả lời là có. Tuy nhiên, người ấy có thể đang để ý thêm một người khác ngoài bạn, nên bạn nên rút thêm lá để kiểm tra. Nếu những lá đi kèm đều tốt, bạn có thể yên tâm rằng người ấy chỉ hướng về bạn và tình cảm đó là thật lòng.'],
    ['love', 'Một cặp đôi hay cãi nhau thì có nên chia tay không?',
     'Bạn không nên vội khuyên họ chia tay, vì lá này có hai hướng đọc. Theo hướng tích cực, hai người vẫn còn nhiều tình cảm dành cho nhau. Họ nên tận dụng chính tình cảm đó để ngồi lại, nói chuyện và sửa chữa mối quan hệ, thay vì kết thúc quá sớm. Theo hướng còn lại, một trong hai người đã chán, đã có người mới, và đang phân vân giữa hai người. Để chọn hướng đọc, bạn hãy dựa vào các lá đi kèm và vào trực giác của mình, tức là thông điệp đầu tiên hiện lên trong đầu khi bạn lật lá bài.'],
    ['career', 'Tôi đang thất nghiệp, thời gian tới tôi có việc không?',
     'Câu trả lời là có. Không chỉ một, mà bạn có thể nhận được hai cơ hội việc làm trong cùng một thời điểm.'],
    ['career', 'Tôi đang đi làm bình thường, ba tháng tới công việc của tôi có biến chuyển gì không?',
     'Trong khi bạn vẫn đang có việc, một lời mời làm việc khác có thể xuất hiện. Khi đó, bạn sẽ phải cân nhắc giữa việc ở lại nơi cũ và việc chuyển sang nơi mới.'],
    ['love', 'Tôi đang độc thân, sắp tới tôi có người yêu không?',
     'Bạn có thể gặp hai người cùng lúc, và cả hai đều có thể trở thành một mối quan hệ. Vì vậy, bạn sẽ phải suy nghĩ kỹ và đưa ra lựa chọn.']
  ]
});

/* batch 3 - Majors 7-9 (Chariot, Strength, Hermit) */
Object.assign(ASK.vi, {
  'major-7': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Người này có ý chí rất lớn và luôn đặt mục tiêu lên hàng đầu. Họ làm việc không ngừng, ít khi lùi bước và thường được đánh giá là mạnh mẽ, quyết đoán. Mặt trái của tính cách này là sự mải mê với công việc. Khi đã lao vào một mục tiêu, họ dễ bỏ quên gia đình, bạn bè và cả người yêu.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Câu trả lời nghiêng về có, nhưng tình cảm này đến quá nhanh và khá nóng vội. Người ấy theo đuổi bạn như một người đã đặt mục tiêu và nhất định phải đạt được, đến mức việc trở thành người yêu của bạn gần như là một nỗi ám ảnh. Với những người quen chinh phục bằng mọi giá, tình cảm có thể nguội đi nhanh sau khi họ đã có được điều mình muốn. Bạn hãy cân nhắc điểm này.'],
    ['love', 'Một cặp đôi hay cãi nhau thì có nên chia tay không?',
     'Lá này phản ánh tâm trạng hiện tại của bạn hơn là kết cục của mối quan hệ. Bạn đang mệt mỏi vì cãi vã và muốn kết thúc thật nhanh cho nhẹ lòng, nhưng đó là một quyết định nóng vội. Theo nguyên tắc chung khi đọc bài, việc chia tay chỉ nên được cân nhắc khi mối quan hệ đã trở nên độc hại, khi hai người làm khổ nhau đến kiệt sức, hoặc khi một trong hai không còn tình cảm. Nếu chưa đến mức đó, bạn hãy bình tĩnh lại rồi cùng người ấy ngồi xuống trao đổi. Mối quan hệ này vẫn còn cơ hội hàn gắn.'],
    ['love', 'Người ấy không thay đổi theo ý tôi, tôi phải làm sao?',
     'Khi mối quan hệ gặp trục trặc, phản ứng quen thuộc của nhiều người là tìm cách sửa đối phương. Có thể bạn đã thử đủ cách để người ấy nhắn tin nhiều hơn hay quan tâm hơn, nhưng họ không thay đổi, và bạn bực bội rồi tự trách mình. Lá này gợi ý một hướng khác. Trước khi tìm giải pháp từ bên ngoài, bạn hãy thử đổi cách nhìn. Chẳng hạn, người ấy ít nhắn tin có thể không phải vì thiếu tình cảm, mà vì họ đang dồn sức lo cho tương lai chung. Bạn hãy nhắc nhở nhẹ nhàng và đồng thời thông cảm với họ.'],
    ['career', 'Tôi đang thất nghiệp, sắp tới tôi có tìm được việc không?',
     'Lá này cho một câu trả lời có điều kiện. Bạn có thể tìm được việc, nhưng chỉ khi bạn quyết tâm và chủ động hơn hiện tại. Nếu bạn đã thất nghiệp nhiều tháng mà chưa có kết quả, lá này cho thấy năng lượng của bạn đang chùng xuống. Có thể bạn gửi hồ sơ một cách chiếu lệ, đang dựa vào sự bao bọc của gia đình nên chưa sốt ruột, hoặc có nhiều dự định nhưng vì sợ thất bại nên chưa dám bắt đầu dự định nào.'],
    ['career', 'Tôi đang đi làm bình thường, ba tháng tới có gì mới không?',
     'Ba tháng tới sẽ là một giai đoạn bận rộn với bạn. Công việc có thể vào mùa cao điểm, hoặc bạn được giao thêm một dự án đòi hỏi nhiều thời gian và sự tập trung. Bạn sẽ dồn phần lớn năng lượng cho công việc. Tuy nhiên, lá này kèm theo một lời nhắc. Bạn hãy ăn uống đầy đủ, ngủ đủ giấc, giữ nhịp sinh hoạt điều độ, và dành thời gian cho gia đình và người yêu để không bị kiệt sức.'],
    ['other', 'Lá này khác Mặt Trời ở chỗ nào?',
     'Cỗ Chiến Xa và Mặt Trời đều nói về chiến thắng, nhưng chúng nằm ở hai chặng khác nhau trên hành trình của bộ Ẩn Chính. Số 7 là một chặng khá sớm, còn số 19 nằm gần cuối. Chiến thắng của Cỗ Chiến Xa là chiến thắng của người dồn hết sức để về đích, nhưng khi nhìn lại thì thấy mình đã đánh rơi nhiều thứ dọc đường. Bạn có thể đạt được mục tiêu mà đánh mất các mối quan hệ xung quanh. Chiến thắng của Mặt Trời trọn vẹn hơn. Ở đó, bạn đạt được vị trí mình mong muốn mà vẫn giữ được gia đình, người yêu, đồng nghiệp và những người từng dìu dắt mình. Bài học rút ra là nếu muốn mọi mặt của cuộc sống cùng tiến, bạn không thể đi quá nhanh. Đi nhanh thường là đi một mình, còn đi xa thì cần có người đồng hành.']
  ],

  'major-8': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Sức mạnh của người này không nằm ở vẻ ngoài mà nằm ở sự tự chủ. Họ hiểu rõ bản thân, biết mình giỏi ở điểm nào và còn yếu ở điểm nào, và họ làm chủ được cơn giận cũng như nguồn năng lượng dồi dào bên trong. Vì tự tin, họ dễ dàng thừa nhận khi mình sai và không cần phản ứng gay gắt mỗi khi bị góp ý. Bạn có thể phân biệt họ với những người chỉ cố tỏ ra mạnh mẽ. Người phải gồng lên để chứng tỏ thường đang che giấu sự yếu đuối bên trong, còn người mang năng lượng của lá này không cần khoe kiến thức hay của cải. Họ điềm tĩnh và vững chãi như một ngọn núi.'],
    ['love', 'Người ấy có thích tôi không?',
     'Câu trả lời là có. Tuy nhiên, bạn đừng chờ đợi một màn theo đuổi ồn ào. Người này tự tin vào giá trị của mình, nên họ bày tỏ tình cảm một cách thẳng thắn và bình thản. Họ sẽ nói ra khi thích bạn, nhưng không thúc ép bạn phải trả lời ngay và cũng không bám riết lấy bạn. Nếu bạn không có tình cảm đáp lại, họ sẽ rút lui một cách lịch sự và để bạn được yên. Cách yêu của họ trưởng thành và tôn trọng đối phương.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Từ khóa của lá này trong tình huống cãi vã là sự mềm mỏng. Mâu thuẫn không được giải quyết bằng cách to tiếng hay lấn át nhau, mà bằng sự dịu dàng và yêu thương. Vì vậy, bạn chưa nên nghĩ đến chuyện chia tay. Theo nguyên tắc chung khi đọc bài, lời khuyên chia tay chỉ được đưa ra trong những trường hợp thật sự nặng nề, ví dụ khi mối quan hệ đã trở nên độc hại, khi trải bài xuất hiện những lá như Tòa Tháp, Mười Kiếm hay Chín Kiếm, hoặc khi một trong hai người đã cạn tình cảm. Nếu chưa rơi vào những trường hợp đó, hai bạn hãy ngồi lại, lắng nghe nhau và cùng tìm cách tháo gỡ.'],
    ['career', 'Tôi đang thất nghiệp, sắp tới tôi có tìm được việc mới không?',
     'Rào cản lớn nhất của bạn lúc này không phải là năng lực, mà là sự tự tin. Sau một thời gian dài tìm việc và nhận về nhiều lời từ chối, bạn có thể đã bắt đầu tin rằng mình không đủ giỏi. Niềm tin đó âm thầm chi phối cách bạn thể hiện trong buổi phỏng vấn. Chẳng hạn, một người từng trả lời trôi chảy nay lại ngập ngừng vì lo nói sai. Lá này khẳng định rằng kỹ năng của bạn không hề thua kém người khác. Kết quả chưa đến có thể chỉ vì thời điểm chưa thuận lợi, hoặc vì bạn đang nộp hồ sơ vào những nơi không thật sự phù hợp với thế mạnh của mình. Khi bạn lấy lại được sự tự tin, cơ hội việc làm sẽ đến.'],
    ['career', 'Trong thời gian tới, công việc của tôi cần lưu ý điều gì?',
     'Thời gian tới, công việc của bạn sẽ tiếp tục ổn định. Bạn đang làm tốt phần việc của mình, yêu thích công việc, hoàn thành trôi chảy những gì được giao và hiểu rõ điểm mạnh, điểm yếu của bản thân. Trạng thái thuận lợi đó sẽ được duy trì, không có biến cố lớn nhưng cũng không có bước nhảy vọt. Nếu bạn đang mong một cơ hội bất ngờ xuất hiện, lá này không hứa hẹn điều đó.'],
    ['career', 'Sắp tới tôi có một dự án mới, tôi có nên nhận không?',
     'Bạn nên nhận dự án này. Bạn có đủ bản lĩnh, kỹ năng và chuyên môn để đảm đương nó.'],
    ['other', 'Khi lá này ra ở vị trí lời khuyên, tôi nên đọc như thế nào?',
     'Khóa học này không đọc bài ngược, và lá này được xem là chỉ mang nghĩa tích cực. Khi lá này xuất hiện ở vị trí lời khuyên, bạn hãy hiểu rằng bài đang chỉ ra một điều bạn đang thiếu. Đó có thể là sự vững vàng, sự bình tĩnh hoặc khả năng kiểm soát bản thân. Có lẽ những cảm xúc bản năng đang lấn át lý trí và khiến bạn hành động thiếu tỉnh táo. Lời khuyên của bài là bạn hãy làm chủ cơn giận và giữ cho mình một tinh thần điềm tĩnh, mạnh mẽ hơn.']
  ],

  'major-9': [
    ['love', 'Người yêu tiếp theo của tôi là người như thế nào?',
     'Người yêu tiếp theo của bạn có thể là một người từng trải và hiểu biết sâu sắc. Họ có thể hơn bạn khá nhiều tuổi, hoặc nếu cùng lứa thì cách suy nghĩ của họ cũng chín chắn hơn hẳn những người xung quanh. Tuy nhiên, bạn nên chuẩn bị tinh thần rằng đây không phải là một người lãng mạn. Những bữa tiệc bất ngờ, những món quà gây ngạc nhiên hay một lời cầu hôn được dàn dựng công phu không phải là phong cách của họ. Họ cũng có thể khá kỹ tính và cần nhiều thời gian ở một mình.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Tình cảm có thể có, nhưng người ấy đang ở trong một giai đoạn hướng vào bên trong. Họ bận đi tìm câu trả lời cho những thắc mắc của riêng mình, nên thời gian và sự chú ý dành cho bạn sẽ bị hạn chế. Chẳng hạn, khi bạn muốn cùng đi chơi cuối tuần, họ có thể từ chối để ở nhà nghiền ngẫm một cuốn sách hay hoàn thành một việc riêng. Những lần như vậy sẽ khiến bạn cảm thấy bị bỏ rơi. Năng lượng của Ẩn Sĩ không phải là năng lượng xấu, nhưng nó không thuận lợi cho một mối quan hệ tình cảm đang cần sự gắn kết.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Lá này khuyên bạn chưa nên chia tay. Khi cứ gặp mặt là lại tranh cãi, hai bạn hãy cho nhau một chút thời gian và không gian riêng để bình tâm. Trong khoảng lặng đó, mỗi người nên quay vào bên trong và tự hỏi mâu thuẫn bắt nguồn từ đâu, bản thân có góp phần gây ra nó hay không, và nếu có thì mình cần điều chỉnh điều gì.'],
    ['love', 'Vấn đề là do đối phương hay do tôi?',
     'Khi cãi nhau, phần lớn chúng ta có xu hướng cho rằng lỗi thuộc về đối phương và tìm cách bắt họ thay đổi. Lá này gợi ý bạn đi theo hướng ngược lại. Theo nguyên tắc chung, trong bất kỳ mối quan hệ nào, dù với gia đình, bạn bè hay người yêu, bạn hãy tự hỏi trước xem bản thân có điều gì cần điều chỉnh hay không. Tự thay đổi để tốt hơn không phải là hạ thấp mình hay đánh mất cá tính, mà là món quà bạn dành cho chính mình. Bạn cũng có thể hỏi thẳng người kia xem họ mong bạn thay đổi điều gì. Khi nhận được góp ý, bạn hãy lắng nghe, xin lỗi nếu cần, cảm ơn họ và bắt tay vào sửa.'],
    ['career', 'Tôi đã thất nghiệp mấy tháng, sắp tới tôi có tìm được công việc như ý không?',
     'Lá này khuyên bạn tiếp tục tìm kiếm, nhưng đồng thời đặt ra một câu hỏi lớn hơn. Có thể bạn đang chỉ nhắm đến những công việc đáp ứng mức lương mong muốn, trong khi điều bạn thật sự cần là một công việc mang lại ý nghĩa. Chẳng hạn, một người học ngành kỹ thuật có thể chỉ tìm việc trong đúng ngành của mình, mà không nhận ra niềm vui lớn nhất của họ là được hỗ trợ và giúp đỡ người khác. Bạn hãy dành thời gian lắng nghe bản thân để tìm ra câu trả lời thật sự. Nếu giúp đỡ người khác là điều bạn hướng tới, bạn có thể vẫn làm một công việc ổn định và tham gia các hoạt động thiện nguyện bên cạnh, hoặc chọn hẳn con đường làm việc trong các tổ chức xã hội và phi lợi nhuận.'],
    ['career', 'Trong thời gian tới, tôi cần lưu ý điều gì trong công việc?',
     'Thời gian tới, có thể bạn sẽ gặp một người thầy hoặc một người đi trước trong nghề, và người này sẽ giúp bạn mở rộng kiến thức chuyên môn.'],
    ['timing', 'Bao giờ tôi mới tìm được câu trả lời?',
     'Câu trả lời sẽ không đến nhanh, và quá trình tìm kiếm đòi hỏi sự kiên nhẫn. Với nhiều người, hành trình này mất khoảng một năm, và với một số người khác thì còn lâu hơn.']
  ]
});

/* batch 4 - Majors 10-12 (Wheel of Fortune, Justice, Hanged Man) */
Object.assign(ASK.vi, {
  'major-10': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Riêng lá này không đủ để miêu tả tính cách của một người, nên bạn hãy rút thêm lá để có thêm dữ liệu. Nếu chỉ dựa vào một lá, bạn có thể hiểu rằng cuộc gặp gỡ giữa bạn và người ấy không phải là ngẫu nhiên. Hai người đến với nhau để cùng học một bài học, và với Bánh Xe Số Phận thì bài học đó khá lớn. Tuy nhiên, bạn không nên hiểu lớn là xấu. Người ấy có thể mang đến cho bạn những điều tốt đẹp bằng những cách nhẹ nhàng, chứ không nhất thiết phải thông qua mâu thuẫn hay chia ly.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Với câu hỏi này, Bánh Xe Số Phận cũng khó cho một câu trả lời trực tiếp. Điều bạn đọc được là sự xuất hiện của người ấy trong đời bạn mang tính duyên số, và việc họ vẫn ở bên bạn đến hôm nay cũng vậy. Có thể chính họ cũng xem mối quan hệ này là một mối duyên đã được sắp đặt. Còn cụ thể họ nghĩ gì về bạn thì bạn cần rút thêm lá.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Bạn không nên kết luận chỉ với một lá này, vì Bánh Xe Số Phận mang tính trung lập và ý nghĩa của nó phụ thuộc nhiều vào các lá đi kèm. Nếu bên cạnh là Mười Cốc hay Bốn Gậy, mối quan hệ này có thể đi đến một kết thúc tốt đẹp, thậm chí là hôn nhân. Trong trường hợp đó, bạn hãy gác lại ý định chia tay và ngồi xuống trò chuyện với người ấy. Ngược lại, nếu bên cạnh là Ác Quỷ và Tòa Tháp, bài không nói thẳng rằng bạn phải chia tay, nhưng cho thấy hai người đã làm tổn thương nhau quá nhiều, và dù bạn cố gắng cứu vãn thì sự chia ly vẫn có thể xảy ra như một phần đã được sắp đặt. Việc gặp nhau, làm khổ nhau rồi rời xa nhau cũng là một phần của số phận. Điều quan trọng bạn cần ghi nhớ là bạn không thể một mình thay đổi đối phương hay xoay chuyển cả mối quan hệ.'],
    ['career', 'Trong thời gian tới, tôi có tìm được công việc mới không?',
     'Khả năng bạn tìm được việc mới là có, và công việc đó sẽ không phải là một công việc bình thường. Từ khóa của lá này là bước ngoặt. Công việc mới có thể kéo theo những thay đổi lớn trong cuộc sống của bạn, chẳng hạn bạn phải chuyển ra nước ngoài, chuyển đến một nơi ở mới, hoặc được tiếp xúc với những điều giúp bạn mở rộng tầm nhìn và thay đổi cách suy nghĩ.'],
    ['career', 'Tôi đang làm văn phòng bình thường, ba tháng tới tôi có gì cần lưu ý?',
     'Ba tháng tới, công việc của bạn sẽ có một thay đổi lớn mang tính bước ngoặt. Bản thân lá này là trung lập, nên nó chỉ báo rằng thay đổi sẽ xảy ra chứ không cho biết thay đổi đó tốt hay xấu. Để biết cụ thể, bạn cần xem các lá đi kèm. Thay đổi có thể là việc bạn được chuyển sang bộ phận khác, được thăng chức hoặc tăng lương, được điều đi công tác ở một thành phố khác, hoặc cả công ty chuyển sang địa điểm mới. Cũng có thể cấp trên của bạn thay đổi, chẳng hạn người quản lý cũ nghỉ và một người mới đến thay.'],
    ['other', 'Khi trải bài ra nhiều lá Ẩn Chính, tôi nên hiểu như thế nào?',
     'Tỷ lệ giữa Ẩn Chính và Ẩn Phụ trong một trải bài cho bạn biết vấn đề nằm ở đâu. Khi Ẩn Chính chiếm số lượng áp đảo rõ rệt, chứ không chỉ nhỉnh hơn một chút, vấn đề đang hỏi thuộc về những sắp đặt lớn của số phận và rất khó thay đổi bằng ý muốn cá nhân. Khi Ẩn Phụ chiếm đa số, vấn đề chủ yếu xuất phát từ chính người hỏi, từ tính cách, tâm trạng và thái độ của họ. Trong trường hợp này, chỉ cần họ điều chỉnh thái độ và hành động thì kết quả có thể tốt hơn.'],
    ['other', 'Vậy số phận có thay đổi được không?',
     'Bạn có thể hình dung số phận như một khoảng dao động đã được định sẵn cho mỗi người, ví dụ từ 30 đến 80. Nếu bạn sống tử tế và nỗ lực phát huy hết khả năng, bạn sẽ chạm đến mức cao nhất là 80, nhưng không thể vượt quá ngưỡng đó. Nếu bạn buông xuôi, bạn sẽ rơi xuống mức 30, nhưng cũng không thấp hơn được nữa. Nói cách khác, số phận không thay đổi hoàn toàn theo ý muốn, nhưng bạn quyết định mình sẽ đứng ở đâu trong khoảng đã cho. Không phải ai nỗ lực cũng trở thành thiên tài, nhưng chỉ khi nỗ lực hết sức, bạn mới khai thác trọn vẹn những gì mình vốn có.']
  ],

  'major-11': [
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Trong một trải bài về tình cảm, những lá Cốc mới là điều bạn mong đợi. Công Lý xuất hiện ở đây cho thấy tình cảm người ấy dành cho bạn có phần thực tế và tính toán hơn là một tình yêu thuần túy. Họ là người tỉ mỉ, hay cân nhắc, và có thể đang âm thầm so sánh xem ai yêu ai nhiều hơn, hoặc họ được gì và mất gì khi ở bên bạn. Chẳng hạn, họ có thể thấy mình được lợi về danh tiếng hay điều kiện, nhưng lại lo mất đi tiếng nói trong gia đình hay quyền quyết định chuyện tiền bạc. Vì mối quan hệ chỉ mới bắt đầu, lá này chưa thể trả lời liệu nó có bền lâu hay không, và cũng chưa khẳng định được người ấy thật lòng đến mức nào.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Lá này nghiêng về hướng chưa nên chia tay. Công Lý là lá của sự cân bằng và lý trí, thậm chí có phần lý trí quá mức. Khi nó xuất hiện cho câu hỏi này, rất có thể chính bạn đang mất cân bằng và để cảm xúc dẫn dắt, nên bạn chưa nhìn nhận tình huống, mối quan hệ và cả con người đối phương một cách rõ ràng. Việc cảm xúc chi phối trong chuyện tình cảm là điều tự nhiên. Điều bạn cần học là nhận ra ranh giới giữa mức độ hợp lý và mức độ bắt đầu gây hại. Khi nhìn lại và thấy một khuôn mẫu cứ lặp đi lặp lại ở bản thân, bạn sẽ biết mình cần điều chỉnh điều gì trước khi đưa ra bất kỳ quyết định lớn nào.'],
    ['career', 'Tôi đã thất nghiệp mấy tháng, thời gian tới tôi có tìm được công việc ưng ý không?',
     'Một lá Công Lý chưa đủ để trả lời dứt khoát, nên bạn hãy rút thêm lá. Dù vậy, lá này mở ra vài hướng đọc. Thứ nhất, công việc bạn sắp tìm được có thể thuộc lĩnh vực hành chính, giấy tờ hoặc quy trình, tức là công việc thiên về đầu óc và tính chính xác, chẳng hạn ngân hàng, kế toán, xử lý số liệu hay pháp lý. Thứ hai, người quản lý ở nơi làm mới có thể rất nguyên tắc và khắt khe, đúng với tinh thần của lá này. Thứ ba, có thể chính hồ sơ của bạn đang là vấn đề. Có thể bạn đang gặp vướng mắc về giấy tờ, hoặc CV của bạn chưa đủ thuyết phục nên mãi chưa được gọi. Nếu vậy, bạn hãy rà soát lại hồ sơ, bổ sung những phần còn thiếu, lược bỏ những phần thừa, và nhờ một người có kinh nghiệm góp ý.'],
    ['career', 'Trong thời gian tới, công việc của tôi có điều gì cần lưu ý?',
     'Điều bạn cần lưu ý trong thời gian tới là giấy tờ và thủ tục hành chính. Có thể một quyết định có lợi cho bạn đã được đưa ra, nhưng lại bị tắc ở khâu hồ sơ. Chẳng hạn, cấp trên đồng ý tăng lương hoặc thăng chức cho bạn, nhưng vì thiếu một chứng chỉ hay một loại giấy tờ nào đó nên bộ phận nhân sự chưa thể phê duyệt. Bạn hãy chủ động kiểm tra và hoàn thiện các giấy tờ liên quan đến công việc của mình từ sớm để tránh bị chậm trễ.'],
    ['other', 'Khi có chuyện không hay, tôi nên nhìn vào đâu trước?',
     'Nơi đầu tiên bạn nên nhìn vào là chính bản thân mình. Bạn hãy xem xét mình đã làm đúng những gì, sai ở đâu, và đã làm tròn phần việc của mình hay chưa. Chỉ sau khi đã phân tích kỹ về bản thân, bạn mới nên nhìn sang người khác. Trong hầu hết mọi trường hợp, thay đổi chính mình là con đường ngắn nhất để có một cuộc sống bình an. Ngược lại, nếu bạn luôn cho rằng lỗi thuộc về người khác và chờ họ xin lỗi, thì bản ngã và lòng tự ái đang điều khiển bạn. Khi lời xin lỗi không đến, bạn sẽ mắc kẹt mãi trong vòng luẩn quẩn của sự bực bội.'],
    ['other', 'Nếu bài trả lời không đúng câu tôi hỏi thì tôi nên làm gì?',
     'Điều này xảy ra khá thường xuyên và bạn không cần lo lắng. Có những lúc người hỏi hỏi về một chuyện nhưng các lá bài lại kể về một chuyện khác, chẳng hạn bạn hỏi về triển vọng công việc mà bài lại mô tả tính cách của người quản lý. Khi đó, bạn hãy tin vào trực giác và nói ra đúng những gì hiện lên trong đầu ở thời điểm đó, vì Tarot là một bộ môn dựa rất nhiều vào trực giác.']
  ],

  'major-12': [
    ['love', 'Lá này miêu tả một người như thế nào?',
     'Người này có phần khác biệt so với số đông. Sự khác biệt thể hiện ở cách ăn mặc, cách suy nghĩ hoặc cách họ nhìn nhận cuộc sống. Tuy nhiên, Người Treo Ngược nói về một sự khác biệt lành mạnh, tức là không giống mọi người nhưng không hề xấu. Họ có thể mang một đặc điểm mà đa số không có, hoặc thuộc cộng đồng LGBT. Bạn có thể hình dung điều này qua một người bỏ công việc văn phòng ổn định để theo đuổi một nghề mà gia đình chưa từng nghĩ tới. Trong mắt người xung quanh họ có vẻ lạ lùng, nhưng họ đang sống đúng với con người mình.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Trong trải bài tình yêu, Người Treo Ngược không cung cấp nhiều thông tin. Người ấy có thể có tình cảm với bạn, nhưng lý do khiến họ bị thu hút không giống người khác. Trong khi người khác để ý đến ngoại hình, vóc dáng hay sự thân thiện của bạn, thì người này thích bạn vì một điều gì đó khá đặc biệt. Cũng có thể lá này đang nói về chính bạn, một người có nét khác biệt so với số đông.'],
    ['love', 'Chúng tôi đang cãi nhau, lá này có lời khuyên gì cho mối quan hệ?',
     'Lời khuyên của lá này là tạm dừng việc đi tìm giải pháp và thay đổi góc nhìn về vấn đề. Để làm được điều đó, bạn cần một khoảng thời gian ở một mình, vì chỉ khi tĩnh lặng bạn mới có thể quay vào bên trong và suy nghĩ thấu đáo. Nếu khó tự làm, bạn hãy tìm đến một người có lối tư duy rất khác mình và lắng nghe cách họ nhìn sự việc. Khi đã nhìn từ một góc độ mới, bạn có thể nhận ra rằng những cuộc tranh cãi này không lớn và không độc hại như bạn tưởng, thậm chí còn cần thiết để hai người hiểu nhau hơn. Lúc đó bạn không cần thay đổi bất cứ điều gì trong mối quan hệ. Chỉ riêng việc thay đổi cách nghĩ đã đủ mang lại cho bạn sự bình yên.'],
    ['career', 'Sắp tới tôi có tìm được công việc mới không?',
     'Lá này có thể được đọc theo hai hướng. Hướng thứ nhất là bạn sẽ tìm được việc, nhưng công việc đó khác với kỳ vọng ban đầu hoặc khác với chuyên ngành bạn đã học. Hướng thứ hai là bài khuyên bạn mở rộng cách nghĩ. Có thể bạn đang bó hẹp việc tìm kiếm trong một lĩnh vực hay một địa điểm duy nhất. Chẳng hạn, nếu bạn chỉ tìm việc ở các công ty lớn trong thành phố, bạn có thể thử cân nhắc các doanh nghiệp nhỏ hơn hoặc một địa phương khác.'],
    ['career', 'Trong ba đến sáu tháng tới, tôi cần lưu ý điều gì trong công việc?',
     'Với câu hỏi này, Người Treo Ngược không có nhiều cách diễn giải, nên bạn hãy rút thêm lá để có bức tranh đầy đủ. Từ riêng lá này, có hai khả năng đáng chú ý. Thứ nhất, bạn có thể được giao một dự án khác hẳn những gì bạn đã quen làm. Dự án đó sẽ giúp bạn tiếp cận lĩnh vực của mình từ một góc độ mới và hiểu công việc sâu hơn. Thứ hai, bạn có thể gặp một người hướng dẫn có phong cách khác thường. Lời khuyên của họ thoạt nghe có vẻ lạ, nhưng khi suy ngẫm kỹ, bạn sẽ thấy nó thật sự hữu ích.'],
    ['other', 'Ý nghĩa cốt lõi của lá này là gì?',
     'Người Treo Ngược đánh dấu một bước chuyển trong hành trình của Gã Khờ. Sau khi đi qua Bánh Xe Số Phận và Công Lý, anh ta nhận ra ở mình có một điều gì đó vốn không giống mọi người, và anh ta quyết định chấp nhận nó thay vì cố sửa. Từ sự chấp nhận này, anh ta bắt đầu nhìn cuộc sống bằng một con mắt khác và thấy rằng bấy lâu nay mình đã cố ép bản thân vào cái khuôn mà xã hội mong đợi. Thông điệp cốt lõi của lá này là khi gặp khó khăn, bạn hãy tìm lời giải từ bên trong thay vì chạy ra bên ngoài. Thay đổi góc nhìn chính là một trong những lời giải đó.'],
    ['other', 'Tôi nên chọn bạn bè như thế nào?',
     'Bạn nên có trong vòng bạn bè của mình những người nhìn cuộc sống khác với bạn. Họ không phải là những người thích tranh cãi hay gây hấn, mà là những người có quan điểm và trải nghiệm khác biệt. Nhờ họ, bạn sẽ thấy rằng một vấn đề luôn có nhiều cách nhìn. Khi quen với việc nhìn cuộc sống đa chiều, bạn sẽ trở nên bao dung hơn. Trước một tình huống, thay vì vội phán xét, bạn sẽ hiểu rằng người đối diện lớn lên trong hoàn cảnh khác và có góc nhìn khác, nên cách cư xử của họ không giống điều bạn mong đợi. Từ đó, bạn có thể chấp nhận sự khác biệt và tìm cách dung hòa thay vì ép họ theo ý mình.']
  ]
});

/* batch 5 - Majors 13-15 (Death, Temperance, Devil) */
Object.assign(ASK.vi, {
  'major-13': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Người mang năng lượng của lá Tử Thần thường có một cuộc đời nhiều thăng trầm. Họ đã trải qua không ít biến cố, có lúc đứng trên đỉnh cao, có lúc rơi xuống đáy. Điều đáng chú ý là mỗi biến cố lại buộc họ phải thay đổi cách nghĩ và làm mới chính mình để thích nghi với hoàn cảnh. Trong khi nhiều người giữ nguyên cách nhìn cuộc sống suốt hàng chục năm, người này lớn lên qua từng lần thay đổi, và mỗi lần thay đổi đều đưa họ đến một phiên bản tốt hơn của bản thân, giống như cái cây rụng lá vào mùa đông để đâm chồi mới vào mùa xuân. Về mặt chiêm tinh, năng lượng này gần với cung Thần Nông, một cung nổi tiếng với khả năng tái sinh.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Với câu hỏi này, một lá Tử Thần đứng riêng chưa đủ để kết luận, nên bạn cần rút thêm bài để nhìn rõ hơn. Tuy vậy, nếu lá này nằm ở vị trí đầu tiên của trải bài, cách hiểu thường gặp là người ấy có cảm tình với bạn, nhưng họ vẫn còn một chuyện cũ cần khép lại. Có thể đó là một mối quan hệ trước đây mà họ muốn chấm dứt cho trọn vẹn, để sau này đến với bạn bằng một trái tim không còn vướng bận. Trong trường hợp đó, sự kiên nhẫn của bạn sẽ có ích: bạn hãy cho họ một khoảng thời gian để hoàn tất việc kết thúc ấy.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Lá Tử Thần trong câu hỏi này không hẳn đang khuyên bạn chia tay, và nó cũng không nói rằng mối quan hệ của hai bạn độc hại. Điều lá bài muốn kết thúc là cách hai bạn đang đối xử với nhau ở hiện tại, chứ không phải bản thân mối quan hệ. Hai bạn có thể dành một buổi tối yên tĩnh để nói với nhau tất cả những điều còn giữ trong lòng, kể cả những điều khó nói. Khi giai đoạn cũ được khép lại một cách trọn vẹn như vậy, mối quan hệ có cơ hội bước sang một chương mới với những thói quen tốt hơn.'],
    ['career', 'Tôi đã thất nghiệp ba, bốn tháng. Sắp tới tôi có tìm được việc mới không?',
     'Thông điệp của lá bài là bạn cần chấm dứt cách tìm việc hiện nay, vì cách đó chưa đưa bạn đến đâu. Có hai khả năng đáng xem xét. Thứ nhất, bạn có thể đang thiếu tự tin, và điều đó thể hiện rõ trong các buổi phỏng vấn. Thứ hai, và đây là khả năng thường gặp hơn, bạn đang nộp hồ sơ vào những vị trí không thật sự khớp với ngành học và thế mạnh của mình. Ví dụ, một người giỏi giao tiếp và thích làm việc với con người lại chỉ nộp đơn vào các vị trí nhập liệu ngồi một mình cả ngày; khi được hỏi, họ trả lời không đúng trọng tâm mà nhà tuyển dụng mong đợi và bị đánh giá là không phù hợp. Bạn hãy dừng hướng đi chưa đúng và xác định lại con đường phù hợp với năng lực thật của mình. Khi hướng đi đã đúng, cơ hội việc làm sẽ đến gần hơn.'],
    ['career', 'Trong sáu tháng tới, công việc của tôi có gặp vấn đề gì không?',
     'Bạn không cần lo rằng lá này báo hiệu mất việc. Theo nguyên tắc chung khi đọc bài, Tử Thần nên được hiểu là một sự kết thúc do chính bạn chủ động, chứ không phải một tai họa ập đến. Trong sáu tháng tới, có thể một dự án bạn đang phụ trách sẽ hoàn tất để nhường chỗ cho dự án khác, hoặc chính bạn sẽ quyết định khép lại một vai trò không còn phù hợp với mình. Còn sự kết thúc đó diễn ra trong niềm vui hay trong sự tiếc nuối thì một lá bài không thể trả lời; bạn hãy rút thêm để biết rõ.'],
    ['other', 'Vì sao tôi phải buông bỏ khi tôi vẫn còn tiếc?',
     'Sự tiếc nuối là điều tự nhiên, nhưng bạn hãy tự hỏi một điều: nếu người đó, mối quan hệ đó hay hoàn cảnh đó thật sự tốt đẹp, liệu bạn có phải suy nghĩ về việc rời bỏ nó hay không? Chính vì nó có những điểm không ổn mà ý định buông bỏ mới xuất hiện trong bạn. Cuộc sống giống như một chuyến đi dài: sức người có hạn, nên đến một lúc nào đó bạn phải đặt xuống những thứ không còn cần thiết để có thể đi tiếp. Nỗi sợ rằng sau này sẽ không tìm được điều gì tốt hơn là nỗi sợ mà ai cũng từng trải qua. Bạn hãy học cách buông bỏ ngay cả khi vẫn còn buồn, và hãy tin rằng khi một cánh cửa khép lại, một cánh cửa khác tốt hơn sẽ mở ra ở phía trước.']
  ],

  'major-14': [
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Tình cảm ở đây nhiều khả năng là có, nhưng nó được thể hiện theo cách rất chừng mực. Người ấy không vồ vập, không dồn dập theo đuổi bạn, nhưng cũng không hề hờ hững. Mọi thứ diễn ra đều đặn, nhẹ nhàng và theo nhịp riêng của họ. Điều này không có gì tiêu cực, nhưng bạn cần biết trước một điểm: nếu bạn mong đợi một người yêu sôi nổi, cuồng nhiệt và luôn bùng cháy, thì lá Tiết Chế không hứa hẹn điều đó, và đôi lúc bạn có thể cảm thấy hụt hẫng. Nhiệt độ tình cảm của họ luôn ở mức cân bằng, không quá nóng và cũng không quá lạnh.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Lời khuyên của lá Tiết Chế là bạn đừng vội đưa ra quyết định chia tay lúc này. Trước hết, bạn hãy nhìn lại nhịp sống của chính mình, vì nhiều khi nguyên nhân của những cuộc cãi vã không nằm ở người kia mà nằm ở sự mất cân bằng mà bạn không nhận ra. Một lịch làm việc quá tải kéo theo việc thiếu ngủ, thiếu ngủ kéo theo ăn uống thất thường, và cuối cùng đầu óc trở nên nặng nề đến mức bạn không còn nhìn nhận mọi chuyện một cách sáng suốt. Bạn hãy dành ít nhất một đến hai tuần để sống điều độ trở lại, vì việc này không thể hoàn thành trong một hai ngày. Khi tinh thần đã ổn định, bạn sẽ tự thấy chuyện cãi nhau vừa rồi không đáng để chia tay, và hướng giải quyết sẽ tự hiện ra.'],
    ['career', 'Tôi đã thất nghiệp sáu tháng. Tôi có tìm được công việc như ý không?',
     'Trong trường hợp này, lá bài không nói về thị trường việc làm mà nói về chính bạn. Tiết Chế là một lá tốt, nhưng nó thiếu lửa và thiếu sự chủ động, và đó dường như cũng là trạng thái của bạn suốt thời gian qua. Bạn có tìm việc, nhưng tìm một cách thong thả, theo tinh thần được thì tốt mà không được cũng không sao. Nếu trong nửa năm bạn chỉ nộp một vài hồ sơ, thì kết quả hiện tại là điều dễ hiểu. Trong khi đó, không có việc làm đồng nghĩa với không có thu nhập. Câu trả lời cho câu hỏi của bạn phụ thuộc vào việc bạn có thay đổi thái độ hay không: bạn cần năng nổ hơn, chủ động liên hệ nhiều nơi hơn và hành động nhiều hơn.'],
    ['career', 'Trong ba đến sáu tháng tới, công việc của tôi có gặp vấn đề gì không?',
     'Công việc của bạn hiện đang ở trạng thái ổn định, và trong ba đến sáu tháng tới, trạng thái đó gần như không thay đổi. Nếu bạn đang chờ một lời mời bất ngờ hay một bước ngoặt giúp bạn tiến xa về chuyên môn và con người, thì lá Tiết Chế không hứa hẹn điều đó. Mặt chưa tích cực của lá này chính là cảm giác giẫm chân tại chỗ. Tuy nhiên, bạn nên nhìn nhận điều này một cách công bằng. Không phải lúc nào tiến lên thật nhanh cũng là tốt; có những giai đoạn bạn cần nghỉ ngơi để lấy lại cân bằng. Dĩ nhiên, nghỉ quá lâu cũng có hại, giống như trường hợp người thất nghiệp nửa năm mà không hành động. Cuộc sống cần cả lúc chạy và lúc dừng: chạy mãi thì kiệt sức, còn ngồi mãi thì cơ thể và tinh thần đều trì trệ.']
  ],

  'major-15': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Đây là hình ảnh của một người đang để bản năng dẫn dắt và không làm chủ được hành vi của mình. Điểm nổi bật của họ là sự lệ thuộc vào một thứ gì đó. Thứ đó không nhất thiết là rượu hay chất kích thích; nó có thể là thuốc lá, thói quen ăn uống vô độ hoặc nhịn ăn quá mức, giấc ngủ, trò chơi điện tử, mạng xã hội hay việc mua sắm trực tuyến. Ví dụ, họ dự định chỉ xem một tập phim rồi đi ngủ, nhưng khi nhìn lên đồng hồ thì đã gần sáng và cả bộ phim đã hết. Hoặc họ cầm điện thoại lên để kiểm tra một tin nhắn, rồi trôi theo những nội dung vô nghĩa suốt vài giờ trong khi công việc trong ngày vẫn chưa được đụng đến.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Lá Ác Quỷ cho thấy thứ tình cảm mà người ấy dành cho bạn không xuất phát từ con người thật của bạn. Có thể điều họ muốn chỉ là sự gần gũi về thể xác. Cũng có thể họ bị hấp dẫn bởi cảm giác vượt qua một giới hạn nào đó, chẳng hạn khi bạn đang trong một mối quan hệ khác hoặc đã có gia đình, và họ muốn nếm thử cảm giác ấy. Dù lý do là gì, đó không phải là tình yêu thuần khiết. Bạn nên tỉnh táo nhận ra rằng họ đến với bạn vì một động cơ khác chứ không phải vì chính bạn.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Với lá Ác Quỷ, khả năng cao là mối quan hệ này đã trở nên độc hại từ gốc, và lời khuyên nghiêng về phía chia tay. Bạn có thể nhận ra một mối quan hệ độc hại qua cơ chế rất giống với sự nghiện ngập. Khi ở bên nhau, hai bạn cảm thấy dễ chịu dù trong lòng biết rằng chuyện này không đúng. Khi xa nhau, bạn bồn chồn, không làm được việc gì và chỉ mong gặp lại. Nhưng mỗi lần gặp lại, những cuộc cãi vã, những lời xúc phạm và sự ghen tuông lại tiếp diễn. Người nghiện cũng vậy: họ chỉ thấy dễ chịu trong khoảnh khắc thỏa mãn, còn phần thời gian còn lại là sự khó chịu và nỗi ám ảnh về lần tiếp theo. Vòng lặp này khiến bạn dần đánh mất chính mình, và bạn hãy tự hỏi mình còn là chính mình trong mối quan hệ này hay không.'],
    ['love', 'Nhưng nếu tôi không bỏ được người ấy thì sao?',
     'Trước hết, bạn hãy đổi lại cách diễn đạt của chính mình. Điều bạn đang trải qua không phải là "không bỏ được", mà là "chưa muốn bỏ". Hai chữ "không thể" chỉ nên dành cho những việc trái với quy luật tự nhiên, chẳng hạn như tự bay lên không trung hay sống mà không cần thở. Rời khỏi một mối quan hệ không nằm trong nhóm việc ấy. Nó khó, nó đau, nhưng nó hoàn toàn có thể làm được, và rất nhiều người đã làm được dù hoàn cảnh của họ còn phức tạp hơn của bạn. Khi bạn thừa nhận rằng vấn đề nằm ở ý muốn chứ không phải ở khả năng, bạn sẽ thấy quyết định thực ra nằm trong tay mình.'],
    ['career', 'Sắp tới tôi có tìm được công việc như ý không?',
     'Câu trả lời nghiêng về có, nhưng đi kèm một lời cảnh báo rõ ràng: bạn hãy đề phòng những lời mời quá hấp dẫn. Công việc sắp tới có thể được giới thiệu với mức đãi ngộ rất tốt, nhưng khi bước vào, bạn nhận ra nó nằm trong vùng không minh bạch, có những phần hơi lách luật, hoặc đòi hỏi bạn làm những điều đi ngược lại giá trị sống của mình. Bản thân công việc đó không nhất thiết là xấu, nhưng nó có thể khiến bạn thấy như đang đánh đổi lương tâm để lấy thu nhập. Một khả năng khác là nơi làm việc có cấp trên hoặc đồng nghiệp mang năng lượng cám dỗ. Vì vậy, trước khi ký nhận, bạn hãy đọc kỹ từng điều khoản và cân nhắc thật kỹ.'],
    ['career', 'Trong ba đến sáu tháng tới, công việc của tôi có điều gì cần lưu ý?',
     'Trong giai đoạn này, môi trường làm việc sẽ đặt bạn trước những cám dỗ, và chúng có thể đến từ hai hướng. Hướng thứ nhất là chuyện tình cảm nơi công sở: bạn có thể nảy sinh tình cảm với một người đã có gia đình, hoặc ngược lại, một người đã có gia đình chủ động tiếp cận bạn. Đây là tình huống khá phổ biến, nhất là với những người trẻ mới rời gia đình để đi làm ở nơi xa. Hướng thứ hai là cám dỗ trong chính công việc. Ví dụ, một người phụ trách mua hàng có thể được nhà cung cấp gợi ý một khoản hoa hồng riêng để chọn họ; hoặc một người giữ tiền thấy một khoản chênh lệch nhỏ mà không ai kiểm tra. Những nghề liên quan đến tiền bạc và giấy tờ đặc biệt dễ vướng vào rắc rối pháp lý theo cách này. Khóa học không quyết định thay bạn, nhưng bạn hãy nhớ rằng lá đứng ngay sau Ác Quỷ là Tòa Tháp, và lá đó nói về sự sụp đổ cùng một kết cục rất đau đớn.']
  ]
});

/* batch 6 - Majors 16-17 (Tower, Star) */
Object.assign(ASK.vi, {
  'major-16': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Khi Tòa Tháp xuất hiện cho câu hỏi về tính cách, đó thường không phải là một tín hiệu dễ chịu. Người này có thể nóng nảy, bốc đồng và thiếu tinh tế trong cách cư xử. Cũng có khả năng họ vừa đi qua một cú sốc lớn trong đời, chẳng hạn một sự đổ vỡ bất ngờ, và tinh thần của họ vẫn còn ngổn ngang. Tuy nhiên, việc họ đã thật sự gượng dậy hay chưa thì một lá bài không đủ để trả lời, và bạn cần rút thêm để nhìn rõ hơn.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Đây cũng là một câu hỏi mà Tòa Tháp không trả lời trực tiếp. Lá này thường không nói về hiện tại của hai bạn mà nói về một vết thương cũ trong lòng người ấy. Bạn hãy hình dung hai bạn vừa bắt đầu tìm hiểu, mọi thứ đang êm đềm, nhưng lá này lại xuất hiện. Cách hiểu hợp lý là trước đây họ từng bị tổn thương nặng trong tình cảm, ví dụ bị phản bội một cách bất ngờ hoặc bị người yêu rời bỏ để đến với người khác, và biến cố đó để lại trong họ cảm giác hỗn loạn. Việc họ đã vượt qua hay chưa phụ thuộc vào các lá xung quanh. Nếu bài cho thấy vết thương vẫn còn, bạn hãy xem đây là một lời nhắc: bạn vẫn có thể yêu, nhưng trên đường đi, bạn sẽ bắt gặp những hành vi phản ánh nỗi đau chưa lành ấy.'],
    ['love', 'Khi tôi chưa chữa lành thì tôi có nên yêu không?',
     'Câu trả lời có hai mặt. Một mặt, những tổn thương cũ chưa được chữa lành, nhất là những tổn thương từ thời thơ ấu, có xu hướng lặp lại: bạn sẽ vô tình gây ra cho người yêu đúng nỗi đau mà mình từng chịu. Nhìn từ góc độ này, ý kiến cho rằng nên chữa lành trước rồi mới yêu là có cơ sở, vì nếu không thì cả hai cùng khổ. Mặt khác, có những vết thương chỉ lộ ra khi bạn ở trong một mối quan hệ tình cảm. Bạn có thể hoàn toàn ổn trong công việc, tài chính và các mối quan hệ bạn bè, nhưng chỉ khi bắt đầu yêu ai đó, bạn mới nhận ra trong mình vẫn còn một chỗ đau. Nếu bạn tránh mọi mối quan hệ, vết thương đó không bao giờ có dịp lộ ra và cũng không bao giờ được chữa lành. Điều quan trọng là bạn chọn ai. Một người đủ trưởng thành sẽ nhận ra bạn đang tổn thương, thấy được thiện chí muốn chữa lành của bạn và ở lại đồng hành. Một người chưa trưởng thành thì mang theo nỗi đau riêng của họ và thường sẽ rời đi.'],
    ['love', 'Chúng tôi cãi nhau và xung đột lớn, tôi có nên chia tay không?',
     'Tòa Tháp đứng ngay sau Ác Quỷ, và bạn nên đọc hai lá này cùng nhau: mối quan hệ của hai bạn có thể đã nhiễm nhiều yếu tố độc hại. Năng lượng của lá này cho thấy hai người đang làm tổn thương nhau, có thể một người dùng đến bạo lực thể xác, còn người kia dùng những lời nói cay nghiệt để gây tổn thương về tinh thần và cảm xúc. Nếu hai bạn không sớm chia tay hoặc không tìm được một cách giải quyết tận gốc, một biến cố lớn sẽ xảy ra và để lại vết thương sâu cho cả hai. Bạn cũng cần hiểu rằng làm đau một người bằng lời nói đáng bị lên án không kém gì làm đau họ bằng hành động.'],
    ['love', 'Người ấy đánh tôi, nhưng ngoài chuyện đó ra thì vẫn rất thương tôi. Như vậy có sao không?',
     'Suy nghĩ này rất phổ biến ở những người đang ở trong một mối quan hệ bạo hành, và nó cũng là suy nghĩ nguy hiểm nhất. Nhiều người chịu đựng những trận đòn ngày càng nặng mà vẫn tự thuyết phục mình rằng người kia thương mình, chỉ có lúc nóng giận là không kiềm chế được. Đến khi sức khỏe và cuộc đời đã bị tổn hại nghiêm trọng, họ mới nhận ra sự thật rằng tình thương đó chưa bao giờ là thật. Một người yêu bạn sẽ không đánh bạn và cũng không hạ nhục bạn. Ngoài kia có nhiều người sẵn sàng trân trọng bạn theo đúng nghĩa của từ đó.'],
    ['career', 'Tôi đã thất nghiệp ba tháng. Sắp tới tôi có tìm được việc không?',
     'Lá Tòa Tháp không hứa hẹn một công việc trong thời gian gần, và nó còn cảnh báo rằng một biến cố có thể xảy đến. Khi không có việc, bạn thường cũng không có dự phòng tài chính, và đúng lúc đó, một chuyện ngoài ý muốn ập tới, chẳng hạn xe hỏng nặng hoặc một người thân phải nhập viện mà bạn không có tiền lo. Chính lúc ấy bạn mới cảm nhận rõ giá trị của một khoản thu nhập ổn định. Về nguyên nhân, bạn nên xem lại toàn bộ cách tìm việc của mình: hướng đi có đúng ngành không, bạn có thật sự nỗ lực không, hồ sơ có được chuẩn bị chỉn chu không, và thái độ của bạn trong phỏng vấn đã đủ nghiêm túc chưa.'],
    ['career', 'Trong ba đến sáu tháng tới, công việc của tôi có gì mới?',
     'Trong giai đoạn này, một sự kiện bất ngờ và có sức ảnh hưởng lớn có thể xảy ra trong công việc của bạn. Để hiểu vì sao, bạn hãy nhớ rằng Tòa Tháp đi liền sau Ác Quỷ. Bài tarot thường phản ánh năng lượng thật xung quanh người hỏi, kể cả khi họ không kể ra vấn đề của mình. Một người có thể khẳng định rằng công việc và cuộc sống của họ đều ổn, nhưng thực tế họ đang vướng vào một mối quan hệ không nên có với cấp trên, đang dính líu đến một người đã có gia đình, hoặc đơn giản là đã ở quá lâu trong vùng an toàn. Biến cố sắp tới có tác dụng như một hồi chuông đánh thức: nó cho họ thấy rằng tình trạng hiện tại không thể tiếp tục kéo dài thêm nữa.'],
    ['other', 'Vì sao có người tiền vận tệ mà hậu vận lại tốt?',
     'Cách giải thích này dựa trên quan điểm về nhân quả. Theo quan điểm đó, mọi việc bạn làm, dù tốt hay xấu, đều được ghi nhận ngay cả khi không ai chứng kiến, và đến cuối đời, những điều tốt sẽ được đem ra bù trừ cho những điều xấu. Nếu phần tốt vượt trội, phần dư sẽ trở thành phúc đức để lại cho con cháu hoặc được tích lũy cho kiếp sau. Khoảng ba mươi đến ba mươi lăm năm đầu đời được xem là giai đoạn trả những món nợ từ kiếp trước, vì thế nhiều người gặp nhiều khó khăn ở tuổi trẻ. Hậu vận là lúc họ bắt đầu gặt hái thành quả của những điều tốt đã làm trong nửa đầu cuộc đời. Hoàn cảnh gia đình mà mỗi người sinh ra, dù thuận lợi hay khắc nghiệt, là điều không ai chọn được, và theo quan điểm này, nó cũng bắt nguồn từ nhân quả của kiếp trước.']
  ],

  'major-17': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Ngôi Sao mô tả một người có niềm tin bền bỉ vào cuộc sống và vào chính mình. Trước một việc khó, họ nghĩ rằng mình sẽ làm được, và chính thái độ lạc quan ấy thường kéo may mắn đến với họ, vì người tích cực có xu hướng thu hút những điều tích cực. Tuy nhiên, lá này cũng đặt ra một điều kiện: sự lạc quan chỉ có giá trị khi đi kèm với hành động và không biến thành mơ mộng viển vông. Một người tin rằng mình sẽ tìm được việc tốt nhưng không bao giờ gửi đi một hồ sơ nào, hay tin rằng tình yêu sẽ đến nhưng không bao giờ gặp gỡ ai, thì dù có niềm tin lớn đến đâu, cuộc sống cũng không thể đáp lại.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Người ấy có tình cảm với bạn, và tình cảm đó khá rõ. Điểm cần lưu ý là họ đang nhìn bạn qua một lớp kính lý tưởng: trong mắt họ, bạn đẹp hơn, giỏi hơn và hoàn hảo hơn con người thật của bạn. Khi còn trẻ, nhiều người thích được yêu theo cách ấy, được nâng niu như một nhân vật trong truyện cổ tích. Nhưng theo thời gian, điều phần lớn mọi người mong muốn lại là một mối quan hệ thực tế và giản dị, nơi hai người chia sẻ gánh nặng cuộc sống với nhau, tôn trọng nhau và đứng ngang hàng với nhau. Một tình yêu như vậy mới bền, và như vậy là đủ.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Ngôi Sao là một lá của hi vọng, và trong câu hỏi này, nó cho thấy mối quan hệ của hai bạn vẫn còn tương lai. Cuộc cãi vã hiện tại nhiều khả năng chỉ là một cơn sóng nhất thời, và ý định chia tay nảy sinh trong lúc nóng giận cũng sẽ qua đi. Thay vì quyết định dứt khoát lúc này, hai bạn hãy tìm cách giải quyết mâu thuẫn, vì lá bài cho thấy lối ra vẫn còn đó.'],
    ['career', 'Tôi đã thất nghiệp ba tháng. Trong tương lai tôi có tìm được công việc phù hợp không?',
     'Câu trả lời là có: bạn sẽ tìm được công việc phù hợp, và bạn nên giữ niềm tin đó. Nhưng niềm tin phải đi cùng hành động, vì luật hấp dẫn không vận hành với người ngồi yên. Bạn hãy hình dung một người muốn có sức khỏe tốt nhưng không bao giờ tập luyện và cũng không thay đổi cách ăn uống; niềm tin của họ không thể tự biến thành kết quả. Tìm việc cũng vậy. Nếu ngày nào bạn cũng chỉ ở nhà, không mở rộng quan hệ, không cập nhật kỹ năng và không chủ động tìm kiếm cơ hội, mà vẫn chờ một công việc trong mơ tự đến, thì bạn đang rơi vào mặt tiêu cực của lá Ngôi Sao: sự ảo tưởng. Lạc quan đúng cách là tin rằng cơ hội sẽ đến và làm mọi việc để sẵn sàng đón nó.'],
    ['career', 'Trong ba đến sáu tháng tới, công việc của tôi có gì mới?',
     'Trong ba đến sáu tháng tới, một cơ hội mới có thể mở ra trước mắt bạn. Nhưng lá bài chỉ nói rằng cơ hội sẽ đến; việc bạn có nắm lấy nó hay không lại là chuyện khác. Có thể hiểu cuộc đời mỗi người gồm hai phần: phần thứ nhất là những gì ta nhận được do nhân quả từ quá khứ, và phần thứ hai là ý chí tự do của chính ta. Cơ hội sắp tới thuộc về phần thứ nhất, như một sự đền đáp cho điều tốt bạn từng làm. Còn quyết định đón nhận hay bỏ qua thuộc về phần thứ hai, và mỗi lựa chọn sẽ dẫn bạn đến một kết quả rất khác nhau.'],
    ['other', 'Khi lá này xuất hiện thì có chắc chắn là có hi vọng không?',
     'Không hẳn là như vậy. Ở mặt tích cực, Ngôi Sao mang ý nghĩa của hi vọng, của một tương lai sáng sủa hơn sau giai đoạn khó khăn và của những cơ hội mới. Nhưng ở mặt tiêu cực, lá này nói về sự lý tưởng hóa và những kỳ vọng vượt quá thực tế. Theo nguyên tắc chung khi đọc bài, bạn nên rút thêm một lá để trả lời câu hỏi liệu người hỏi có thật sự hành động hay không. Nếu lá rút thêm là một lá xấu, thì nhiều khả năng họ chỉ ngồi chờ và hi vọng. Khi cơ hội đến mà không ai đưa tay ra đón, hi vọng dù lớn đến đâu cũng không mang lại kết quả.']
  ]
});

/* batch 7 - Majors 18-19 (Moon, Sun) */
Object.assign(ASK.vi, {
  'major-18': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Người mang năng lượng Mặt Trăng đang sống trong trạng thái mơ hồ và bất an. Họ lo lắng về hầu hết mọi thứ, và nỗi sợ khiến họ khó bắt tay vào bất cứ việc gì. Năng lượng của họ rất thấp, đến mức một người vốn tích cực khi ở gần họ lâu cũng dễ bị kéo xuống theo. Bạn có thể nhận ra kiểu người này qua những cuộc trò chuyện không có lối ra. Họ than rằng muốn đổi việc; khi bạn gợi ý một cách làm, họ nói rằng cách đó khiến họ sợ; khi bạn bảo vậy thì đừng làm, họ lại nói rằng họ vẫn muốn. Câu chuyện quay vòng như thế mà không đi đến đâu. Đó là một vòng luẩn quẩn mà chỉ chính họ mới phá vỡ được, vì không ai có thể quyết định thay họ.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Nhiều khả năng người ấy có cảm tình với bạn, nhưng một nỗi lo nào đó đang giữ chân họ, khiến họ chưa dám tiến tới. Điều đáng nói là nỗi lo ấy phần lớn không có thật; nó chỉ là một hình ảnh do chính họ tưởng tượng ra. Tuy nhiên, việc nhận ra và bước qua ảo ảnh đó là bài học riêng của họ. Bạn không nên cố gắng thúc đẩy hay can thiệp, mà hãy để họ tự tìm đường ra khỏi nỗi sợ của mình.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Với lá Mặt Trăng, ý định chia tay của bạn có thể bắt nguồn từ những nỗi sợ và những giả định không có thật, chứ không phải từ một vấn đề có thật. Ghen tuông là ví dụ điển hình. Dĩ nhiên, không ai muốn thấy người yêu mình thân mật với người khác, nhưng phần lớn cơn ghen lại xuất phát từ những kịch bản mà ta tự dựng lên trong đầu. Chẳng hạn, người yêu bạn đi ăn tối với đồng nghiệp và về muộn, và bạn lập tức cho rằng họ đang giấu bạn một mối quan hệ khác. Nếu ngày nào bạn cũng nói ra nghi ngờ ấy, mối quan hệ sẽ dần rạn nứt, và điều bạn sợ có thể trở thành sự thật dù ban đầu nó không hề tồn tại. Nói cách khác, bạn đang vô tình kéo điều xấu vào cuộc sống của mình.'],
    ['love', 'Vậy tôi nên nghĩ thế nào cho đúng?',
     'Việc tự nhủ rằng bạn tin người yêu không có ai khác là một cách nghĩ ổn. Nhưng có một cách nghĩ nhẹ nhàng hơn nữa: bạn không cần bận tâm đến chuyện đó. Nếu họ chung thủy thì tốt, còn nếu một ngày sự thật cho thấy họ phản bội, khi đó bạn sẽ hiểu rõ và rời đi. Kinh nghiệm chung cho thấy khi bạn bớt bám chặt vào một khía cạnh nào đó của cuộc sống, khía cạnh đó lại thường diễn ra tốt đẹp hơn. Những người có cuộc sống bình yên thường là những người không để tâm trí bị cuốn vào ganh đua và nghi ngờ.'],
    ['career', 'Tôi đã thất nghiệp hai, ba tháng. Sắp tới tôi có tìm được việc không?',
     'Có thể chính bạn đang vô tình tạo ra kết quả không mong muốn. Bạn vẫn gửi hồ sơ, nhưng trước mỗi buổi phỏng vấn, bạn đã tự thuyết phục mình rằng lần này chắc cũng không thành, rằng mình không đủ giỏi, rằng người ta sẽ không ưa mình. Những suy nghĩ đó xuất hiện trước khi có bất kỳ kết quả nào, và chúng âm thầm rút cạn sự tự tin của bạn. Kết quả là khi ngồi trước nhà tuyển dụng, bạn nói năng lúng túng, không thể hiện được năng lực thật, và họ đánh giá bạn thấp hơn khả năng của bạn. Cảm thấy sợ không có gì sai, ai cũng có lúc như vậy. Điều làm nên sự khác biệt là bạn có để nỗi sợ điều khiển hành động của mình hay không. Nếu bạn thay đổi được điều này, cơ hội tìm được việc sẽ tăng lên rõ rệt.'],
    ['career', 'Trong ba đến sáu tháng tới, công việc của tôi có điều gì cần lưu ý?',
     'Một thay đổi trong thời gian này có thể khiến bạn thấy bất an về tương lai của mình trong công việc. Ví dụ, công ty cơ cấu lại phòng ban: người quản lý quen thuộc chuyển sang bộ phận khác hoặc nghỉ việc, một người mới đến thay, và các vị trí xung quanh bạn cũng xáo trộn. Điều đáng chú ý là nỗi lo của bạn thường đi trước sự việc. Bạn có thể đã bắt đầu lo rằng người quản lý mới sẽ không hài lòng về mình, dù bạn còn chưa gặp họ lần nào. Lá Mặt Trăng nhắc bạn phân biệt giữa một khó khăn có thật và một nỗi sợ do chính mình tưởng tượng ra.'],
    ['other', 'Có phải tôi càng sợ điều gì thì điều đó càng dễ xảy ra thật không?',
     'Câu trả lời là có, và có thể giải thích điều này một cách hợp lý chứ không cần đến yếu tố huyền bí. Khi bạn sợ một điều gì đó, bạn vô thức hành xử theo cách đưa bạn đến gần điều ấy hơn. Bạn hãy hình dung một người sợ bị muộn giờ trong một cuộc hẹn quan trọng: cả đêm họ trằn trọc, sáng dậy trong trạng thái mệt mỏi, cuống quýt quên đồ và cuối cùng lại đến muộn thật. Đó là lý do những người sống trong lo sợ thường gặp nhiều chuyện không may hơn người khác. Cách tốt nhất để đón điều tốt không phải là liên tục ép mình nghĩ tích cực, mà là buông bớt sự bận tâm về kết quả. Bạn làm phần việc của mình một cách trọn vẹn, rồi để mọi thứ diễn ra; nếu kết quả tốt thì bạn vui, nếu chưa tốt thì bạn buồn một chút, và điều đó cũng không sao.']
  ],

  'major-19': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Mặt Trời mô tả một người có sức hút tự nhiên. Họ tỏa sáng ở bất cứ đâu, lạc quan, yêu đời, có tố chất lãnh đạo và dễ được mọi người yêu mến. Nhưng chính điểm sáng đó cũng có mặt trái. Người này có thể không có một người bạn thân thật sự, vì cái tôi của họ khá lớn và họ quen với việc luôn là trung tâm của sự chú ý. Một tình bạn lâu dài đòi hỏi mỗi bên phải biết lùi lại và nhường nhịn, trong khi đây không phải là điều người mang năng lượng Mặt Trời làm tốt. Theo thời gian, những người bạn thân có thể dần rời xa họ.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Trong chuyện tình cảm, Mặt Trời gần như luôn là một lá tích cực. Nếu hai bạn đang trong giai đoạn tìm hiểu và chưa chính thức yêu nhau, lá này cho thấy bạn là nguồn sáng trong mắt người ấy. Điểm nổi bật ở họ là sự rõ ràng: họ biết mình cảm thấy gì với bạn, biết mình muốn gì ở bạn và hình dung được mối quan hệ này nên đi đến đâu. Bạn không phải đoán mò về thái độ của họ, vì họ sẽ thể hiện điều đó một cách minh bạch.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Thay vì trả lời có hay không, lá Mặt Trời đưa ra một lời khuyên: hai bạn cần nhiều ánh sáng hơn trong mối quan hệ này, tức là nhiều sự rõ ràng và minh bạch hơn. Rất có thể tình trạng hiện tại đang ngược lại: mỗi người giữ mong muốn của mình trong lòng và không ai biết chính xác người kia cần gì. Phần lớn xung đột trong tình yêu bắt nguồn từ chỗ đó. Một người im lặng và mong người kia tự hiểu, trong khi người kia phải đoán ý qua từng hành động và thường đoán sai. Bạn hãy chủ động ngồi xuống, nói thẳng điều mình mong muốn, rồi lắng nghe điều họ mong muốn. Khi cả hai đã hiểu nhau, câu hỏi chia tay có thể không còn cần đặt ra nữa.'],
    ['career', 'Tôi đã thất nghiệp ba tháng. Tôi có tìm được công việc như ý không?',
     'Câu trả lời nghiêng mạnh về có. Mặt Trời báo hiệu một tương lai sáng sủa trong sự nghiệp của bạn: công việc sắp tới có thể chính là công việc bạn mong đợi từ lâu, một nơi bạn có thể gắn bó lâu dài. Khi nhận được nó, bạn sẽ có cảm giác như vừa giành được một chiến thắng sau thời gian chờ đợi.'],
    ['career', 'Trong sáu tháng đến một năm tới, công việc của tôi sẽ như thế nào?',
     'Công việc của bạn hiện đang thuận lợi, và lá Mặt Trời cho thấy sự thuận lợi đó sẽ tiếp tục trong sáu tháng đến một năm tới. Không có điều gì đặc biệt cần bạn phải đề phòng. Tuy nhiên, bạn nên nhớ rằng kết luận này chỉ đúng khi bạn rút duy nhất một lá. Nếu bạn trải thêm những lá khác, bức tranh có thể thay đổi ít nhiều.'],
    ['other', 'Lá này có phải lúc nào cũng tốt không?',
     'Phần lớn thời gian, Mặt Trời mang ý nghĩa tích cực, và chỉ thỉnh thoảng nó mới nghiêng về mặt tiêu cực. Cách bạn cảm nhận lá bài phụ thuộc nhiều vào trực giác và cả tâm trạng của bạn: một người hay nhìn đời bằng con mắt bi quan sẽ thấy phần tiêu cực nhiều hơn. Vì thế, khi đọc bài cho người khác, bạn cần giữ một cái nhìn khách quan, không tô hồng nhưng cũng không bôi đen. Người nghe chịu ảnh hưởng rất lớn từ lời của bạn; nếu bạn khiến họ thêm hoang mang, lời nói ấy có thể gây hại cho họ, và theo quan niệm dân gian, đó là khẩu nghiệp. Từ góc nhìn chiêm tinh, còn một lưu ý nữa: mặt trời là nguồn sống rực rỡ, nhưng ai đến quá gần cũng có thể bị thiêu cháy.']
  ]
});

/* batch 8 - Majors 20-21 (Judgement, World) -- completes the Major Arcana */
Object.assign(ASK.vi, {
  'major-20': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Người này đã tích lũy được một sự hiểu biết sâu sắc về cuộc đời. Cần phân biệt rõ: sự hiểu biết này không phải là trí thông minh hay lượng kiến thức trong sách vở, mà là sự thấu hiểu được rút ra từ chính những biến cố họ đã trải qua. Nhờ vậy, họ hiểu điều gì thật sự có ý nghĩa trong cuộc sống và điều gì không. Nếu người này còn trẻ, lá Phán Xét cho thấy họ chín chắn hơn nhiều so với tuổi của mình.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Đây là một năng lượng tích cực. Người ấy yêu bạn, và tình yêu này thiên về sự kết nối tâm hồn hơn là những yếu tố bề ngoài. Họ không bị thu hút bởi vẻ ngoài hay điều kiện tài chính của bạn, mà bởi tính cách và thế giới nội tâm của bạn, như thể giữa hai người có một sợi dây liên kết đặc biệt. Tình yêu này không vụ lợi, không tính toán, và cũng không có sự ghen tuông bùng cháy. Họ có thể nói thẳng cảm xúc của mình với bạn, nhưng nếu bạn từ chối, họ sẽ chấp nhận và tôn trọng quyết định đó thay vì tìm mọi cách để giữ bạn lại.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Lá Phán Xét mời bạn nhìn lại toàn bộ chặng đường của hai người thay vì chỉ nhìn vào cuộc cãi vã trước mắt. Hai bạn đã bên nhau bao lâu? Điều gì ở người ấy đã khiến bạn yêu họ ngay từ đầu? Những kỷ niệm đẹp và những phẩm chất tốt của họ vẫn còn đó. Một sự việc đơn lẻ không nên là lý do để chấm dứt tất cả. Ngoài ra, chính việc lá bài đưa ra lời khuyên này cũng cho thấy mâu thuẫn hiện tại chỉ là chuyện nhỏ. Nếu đây là một vấn đề nghiêm trọng, một mối quan hệ độc hại hay một sự phản bội, thì lá xuất hiện đã là một lá khác.'],
    ['career', 'Tôi đã thất nghiệp ba tháng. Thời gian tới tôi có tìm được việc mới không?',
     'Câu hỏi này được lá Phán Xét trả lời bằng một lời mời quay vào bên trong. Có thể bạn đang nộp đơn vào bất cứ vị trí nào mình thấy, kể cả những công việc bạn không hề mong muốn, chỉ vì cảm thấy không còn lựa chọn khác. Khi hướng đi không đúng, các cánh cửa thường vẫn đóng, và cảm giác hoang mang kéo dài chính là dấu hiệu cho thấy điều đó. Bạn hãy dành thời gian nhớ lại những mong muốn thật sự của mình, kể cả những ước mơ từ thời thơ ấu mà bạn đã gác lại. Khi bạn đi đúng hướng, bạn sẽ nhận ra ngay: bước đầu tiên tuy không dễ, nhưng khi bước xong, bạn tự nhìn thấy bước tiếp theo cần làm gì. Việc làm sẽ đến khi bạn đã xác định đúng con đường.'],
    ['career', 'Đến cuối năm, công việc của tôi có gì thay đổi và có cơ hội mới không?',
     'Bạn đang làm công việc mình yêu thích, và năng lượng hiện tại của bạn đã ở mức tốt. Từ nay đến cuối năm, mọi thứ sẽ tiếp tục thuận lợi theo đà đó, và một cơ hội mới có thể xuất hiện trên đường đi. Lá bài không có lời khuyên nào khác ngoài một điều: bạn hãy duy trì trạng thái tinh thần cao và ổn định như bây giờ.'],
    ['other', 'Thế nào là "tần số cao"?',
     'Tần số cao là một trạng thái tinh thần ổn định, trong đó cảm xúc của bạn không dao động quá mạnh theo những gì xảy đến. Khi nhận được tin vui, chẳng hạn một lời mời làm việc tốt, bạn mỉm cười và thấy lòng bình yên chứ không cần reo hò hay nhảy cẫng lên. Khi gặp chuyện buồn, bạn ghi nhận nó, cho phép mình buồn một lúc, rồi tiếp tục sống. Ngược lại, người mà niềm vui khiến họ bay bổng tột độ thì nỗi buồn cũng thường kéo họ xuống tận đáy. Biên độ cảm xúc càng lớn, điều đó càng cho thấy họ chưa làm chủ được cảm xúc và chưa thật sự trưởng thành. Sự trưởng thành thể hiện ở chỗ khoảng cách giữa phản ứng trước tin xấu và tin tốt không còn quá xa nhau. Bạn vẫn có đầy đủ cảm xúc và không hề vô cảm, nhưng bạn hiểu rằng mọi việc, dù vui hay buồn, đều chỉ là một phần của dòng chảy cuộc sống, đến rồi đi.'],
    ['other', 'Nếu tôi làm một công việc mình không thích thì có sao không?',
     'Không có gì sai khi làm một công việc mình không thích, và rất nhiều người đang làm như vậy để có thu nhập. Tuy nhiên, bạn nên nhớ rằng cách sống là do chính bạn lựa chọn. Việc số đông chấp nhận một cuộc sống như thế không có nghĩa là bạn buộc phải đi theo, và thực tế không ai ép bạn cả. Mỗi người vừa là nhân vật chính, vừa là người viết kịch bản cho cuộc đời mình. Vì vậy, bạn hoàn toàn có thể tự hỏi: tại sao mình không chọn một công việc mình yêu thích và tìm cách kiếm sống từ chính công việc đó?']
  ],

  'major-21': [
    ['career', 'Trong thời gian tới, tôi có tìm được công việc mới không?',
     'Thế Giới nghiêng về câu trả lời có, và nó còn gợi ý về tính chất của công việc đó. Công việc sắp tới nhiều khả năng gắn với yếu tố quốc tế: bạn có thể ra nước ngoài làm việc, gia nhập một công ty đa quốc gia, hoặc làm trong một môi trường thường xuyên tiếp xúc với đối tác và đồng nghiệp nước ngoài. Nếu không phải như vậy, lá này cũng cho thấy một sự dịch chuyển về địa lý, chẳng hạn bạn chuyển đến sinh sống và làm việc ở một thành phố khác.'],
    ['career', 'Tôi đang làm một công việc văn phòng bình thường. Trong thời gian tới, công việc có thay đổi gì không?',
     'Trong câu hỏi này, Thế Giới không báo hiệu một sự kết thúc. Năng lực của bạn vẫn đang tốt, nên công việc sẽ tiếp tục ổn định như hiện nay. Thậm chí, đây có thể là lĩnh vực mà bạn gắn bó đến tận khi nghỉ hưu và cống hiến lâu dài. Sau này bạn có thể đổi công ty, nhưng bạn vẫn sẽ ở trong ngành này, và đó mới là điều đáng giá nhất. Theo cách nhìn chung về sự nghiệp, tìm được lĩnh vực mà mình muốn theo đuổi suốt đời quan trọng hơn nhiều so với việc mình làm ở công ty nào hay ở quốc gia nào.'],
    ['love', 'Hai người hợp nhau nghĩa là hợp ở điểm gì?',
     'Sự hòa hợp thật sự nằm ở giá trị cốt lõi, chứ không nằm ở tính cách hay sở thích. Hai người có thể khác nhau về tính khí và cách giải quyết vấn đề; sự khác biệt ấy thậm chí còn có ích, vì mỗi người giúp người kia nhìn sự việc từ một góc khác. Nhưng đích đến thì phải giống nhau. Ví dụ, một người mong muốn xây dựng gia đình ổn định và có con, còn người kia chỉ muốn tự do đi đây đi đó và không có ý định ràng buộc; dù họ hợp nhau đến đâu về sở thích, mối quan hệ đó khó có thể đi xa. Ngược lại, hai người có tính cách trái ngược như nước với lửa nhưng cùng hướng về một mái ấm sẽ bù đắp được cho nhau, và đó là hình mẫu của một mối quan hệ lý tưởng. Còn khi cả giá trị lẫn tính cách đều giống nhau, hai người thường hợp để làm bạn hơn là làm người yêu, vì họ không có nhiều điều để bổ sung cho nhau.']
  ]
});

/* batch 9 - the four Aces */
Object.assign(ASK.vi, {
  'wands-1': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Đây là một người hướng ngoại và giàu năng lượng. Họ chọn hành động trước khi ngồi lại suy nghĩ hay đọc sách, luôn muốn ra ngoài và bắt tay vào một việc gì đó. Bạn có thể mô tả họ là người tham vọng, nhiều nhiệt huyết và nhiều lửa. Với những người mang năng lượng này, việc ngồi yên một chỗ là rất khó chịu; khi không có việc để làm, họ thường giải tỏa bằng thể thao hoặc vận động. Nếu nguồn năng lượng đó không có lối thoát nào, nó dễ chuyển thành các biểu hiện tiêu cực như tranh cãi, xô xát, xung đột với người xung quanh, hoặc hành vi tự làm tổn thương bản thân.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Tổng thể là tích cực. Ngoài ra, lá bài cho thấy người ấy có sức hút mạnh về mặt sinh lý với bạn: chỉ cần nhìn thấy bạn hoặc tiếp xúc với bạn, họ đã cảm nhận rõ sự hấp dẫn giới tính. Bản thân sức hút này không phải là điều xấu. Vấn đề nằm ở cách họ bộc lộ mong muốn đó, và điều này phụ thuộc vào các lá đi kèm. Nếu họ vẫn tôn trọng bạn, giữ khoảng cách và biết chờ đợi thì đó là dấu hiệu tốt. Ngược lại, nếu họ rời đi ngay sau khi đạt được điều mình muốn thì đó là dấu hiệu xấu.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Năng lượng của lá này nghiêng về hướng tích cực, vì vậy hai bạn có thể chưa cần đi đến quyết định chia tay. Bạn nên chủ động ngồi xuống trò chuyện, hoặc giữ vai trò chủ động hơn trong mối quan hệ. Nguyên nhân mâu thuẫn có thể đến từ nhiều phía: người ấy đã mệt vì luôn phải là người bắt đầu mọi thứ, trong khi bạn luôn chờ đối phương đến phá bỏ lớp phòng thủ của mình. Theo nguyên tắc chung khi đọc bài, bạn nên trả lời các câu hỏi dạng "có nên chia tay không" một cách thận trọng.'],
    ['career', 'Trong thời gian tới, tôi có tìm được công việc mới không?',
     'Khả năng là có. Tuy nhiên, cơ hội này đến từ sự chủ động tìm kiếm của chính bạn, chứ không phải do ai đó mang tới cho bạn. Bên cạnh đó, công việc mới nhiều khả năng mang tính năng động và nhiều lửa, đòi hỏi bạn di chuyển nhiều hoặc tiếp xúc với nhiều người, thay vì ngồi cố định một chỗ trong phòng nghiên cứu suốt cả ngày.'],
    ['career', 'Từ nay đến hết năm, công việc của tôi có điều gì cần lưu ý?',
     'Bức tranh chung khá thuận lợi. Trong khoảng thời gian này có thể xuất hiện những cơ hội công việc mới, và bạn hoàn toàn có quyền quyết định nắm bắt hay bỏ qua chúng; cánh cửa đó chỉ mở khi chính bạn muốn mở. Một khả năng khác là bạn tự tạo ra cho mình một nguồn thu nhập mới.'],
    ['other', 'Nhóm bốn lá Át nói chung mang năng lượng gì?',
     'Cả bốn lá Át đều tượng trưng cho sự khởi đầu mới, cho năng lượng tươi mới và cho bước chân đầu tiên vào một hành trình. Đây là nhóm lá mang ý nghĩa tích cực.']
  ],
  'swords-1': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Người này thông minh và sắc sảo, có lời nói sắc bén, tư duy nhanh nhạy và giàu tính lôgic. Bạn có thể liên hệ ngay với năng lượng Song Tử. Năng lượng Xử Nữ cũng phù hợp một phần: Xử Nữ không thật sự sắc bén nhưng rất lôgic, bởi cung này được Sao Thủy cai quản, hành tinh đại diện cho khả năng tư duy phân tích.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Câu trả lời ở đây không dễ đưa ra. Theo nguyên tắc chung khi đọc bài, trong chuyện tình cảm thì các lá Cốc vẫn thuận lợi hơn những chất khác, cũng như trong công việc thì các lá Tiền là tốt nhất. Với Át Kiếm, nhiều khả năng người ấy có tình cảm với bạn, nhưng bản chất của họ là rất lý trí, lôgic và sắc bén. Sự sắc bén đó có lợi cho họ nhưng chưa chắc có lợi cho bạn hay cho mối quan hệ, bởi chỉ cần cảm thấy không còn phù hợp là họ có thể cắt đứt và rời đi ngay. Trong tình cảm, chất Cốc mới là tốt nhất, vì Cốc đại diện cho nước, cho cảm xúc và cho sự lãng mạn. Tóm lại, người ấy có thể thích bạn, nhưng họ vẫn đặt việc bảo vệ bản thân lên trước.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Át Kiếm vẫn là lá mang năng lượng tích cực, nên nếu các lá đi kèm thuận lợi thì hai bạn chưa chắc phải chia tay. Điều lá bài chỉ ra là mối quan hệ đang thiếu năng lượng của giao tiếp rõ ràng. Một trong những lỗi phổ biến nhất của các cặp đôi là giấu đi những điều mình không hài lòng, chịu đựng trong im lặng, rồi chuyển sang nghi ngờ và soi xét đối phương thay vì nói thẳng. Khi những điều đó tích tụ đủ lâu, chỉ một nguyên cớ rất nhỏ cũng đủ làm bùng lên một trận cãi vã lớn kèm theo việc nhắc lại toàn bộ chuyện cũ. Đến lúc đó, lời nói không còn giá trị với đối phương nữa, vì họ cho rằng những chuyện ấy lẽ ra phải được giải quyết ngay từ khi xảy ra.'],
    ['love', 'Liệu có tồn tại một người hiểu được tôi mà tôi không cần nói ra hay không?',
     'Bạn không nên trông đợi vào một người hòa hợp với bạn đến mức đọc được suy nghĩ của bạn và hiểu ý bạn mà bạn không cần nói ra. Không có mối quan hệ nào hoàn hảo ngay từ đầu. Mọi mối quan hệ đều được xây dựng trên nền tảng của sự thỏa hiệp, của lòng tin và của giao tiếp rõ ràng.'],
    ['career', 'Tôi đã thất nghiệp hai ba tháng, liệu tôi có tìm được công việc như ý không?',
     'Có hai hướng đọc. Hướng thứ nhất là bạn tìm được việc mới, và công việc đó liên quan đến các mối quan hệ, đến giao tiếp hoặc đến lao động trí óc. Hướng thứ hai là lá bài muốn bạn xem lại định hướng tìm việc của mình có đúng hay không. Nhiều bạn trẻ mong có việc nhưng chưa biết mình thích gì, nên gửi hồ sơ đi khắp nơi. Nhà tuyển dụng nhận ra rất nhanh rằng ứng viên không thật sự yêu thích công việc mà chỉ đang cần một chỗ làm. Vì thiếu định hướng, bạn cũng không đầu tư học về ngành đó, và kiến thức của bạn kém hơn các ứng viên khác. Bạn hãy dành thời gian ngồi lại để xác định mình thật sự cần gì và muốn theo ngành nào.'],
    ['career', 'Trong ba đến sáu tháng tới, công việc của tôi có điều gì cần lưu ý?',
     'Trong giai đoạn này có thể xuất hiện một dự án mới. Dự án đó đòi hỏi bạn học hỏi nhiều, sử dụng đầu óc nhiều và tiếp thu nhiều kiến thức mới. Nhìn chung đây là tín hiệu tốt.']
  ],
  'cups-1': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Đây là một người ấm áp và tràn đầy cảm xúc, và cảm xúc đó thuộc về phía tích cực. Họ yêu bản thân và yêu những người xung quanh. Họ không để cảm xúc điều khiển mình và cũng không thuộc nhóm người buồn bã, tiêu cực, bị cảm xúc nắm giữ. Họ trân trọng mọi người, sẵn sàng giúp đỡ người khác và luôn nhìn cuộc sống bằng một lăng kính tích cực.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Tình cảm ở đây rất viên mãn, gần như không còn gì để bàn thêm. Người ấy yêu bạn nhiều và tràn đầy cảm xúc. Nếu trải bài chỉ có một mình Át Cốc thì tình yêu này tuy lớn nhưng vẫn lành mạnh, khác với thứ tình yêu nhiều đến mức trở thành ám ảnh và chiếm hữu. Ở đây, họ sẵn sàng trao trái tim và chiếc cốc cảm xúc của mình cho bạn mà không rơi vào ám ảnh, đồng thời cũng không đòi hỏi bạn phải trao lại một chiếc cốc tương đương. Có những người khi cho đi rất nhiều mà không nhận lại được điều tương tự thì trở nên tức giận. Người thật sự mạnh mẽ là người dám đặt trái tim mình ra ngoài, sẵn sàng nói rằng họ yêu và sẵn sàng trao đi, còn đối phương làm gì với tình cảm đó không phải là điều họ bận tâm quá mức.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Với năng lượng tình cảm dạt dào như thế này, việc chia tay là không cần thiết. Bạn thậm chí có thể hỏi ngược lại người đến xem rằng mâu thuẫn của hai người liệu có thật sự lớn hay không, bởi tình cảm còn nhiều như vậy thì xung đột thường chỉ ở mức nhỏ. Hai bạn chỉ cần ngồi lại trò chuyện vài lần là mọi chuyện trở về như cũ. Theo nguyên tắc chung khi đọc bài, chừng nào tình cảm còn tồn tại, nghĩa là bên trong bạn vẫn muốn ở cạnh người đó, thì hai bạn sẽ tìm được cách hòa giải. Ngược lại, khi hai người ở cạnh nhau với đầy đủ điều kiện gia đình và hoàn cảnh tương xứng nhưng không còn tình cảm, thì mọi lời khuyên cũng không giữ họ lại được. Khi tình cảm vẫn còn, những yếu tố bên ngoài như gia cảnh, văn hóa hay tôn giáo đều có thể dung hòa.'],
    ['career', 'Tôi đang thất nghiệp, thời gian tới tôi có tìm được công việc mới không?',
     'Câu trả lời là có, và đó là công việc bạn yêu thích, công việc mà bạn có cảm xúc khi làm. Tuy nhiên, Át Cốc chưa cho biết nhiều về khía cạnh tiền bạc của công việc đó. Bạn chưa xác định được thu nhập cao hay thấp và cơ hội thăng tiến ra sao, mà chỉ biết chắc rằng bạn rất thích nó. Nếu muốn biết về tiền bạc, bạn cần rút thêm lá.'],
    ['career', 'Trong sáu tháng tới, công việc của tôi có tiến triển gì không?',
     'Một khả năng là bạn gặp được tình yêu ngay trong môi trường làm việc. Khả năng còn lại là công việc xuất hiện những dự án mới, mang đến cho bạn thêm việc để làm, và phần việc mới đó khiến bạn rất hào hứng, giống như một dự án bạn đã mong được tham gia từ lâu.'],
    ['other', 'Vì sao tôi hỏi về lương mà bài lại ra lá này?',
     'Có những trường hợp công việc mới trả lương cao, khả năng thăng tiến tốt và chức vụ đầy đủ, nhưng lá rút ra vẫn là Át Cốc. Lý do là với người hỏi, cảm xúc và niềm đam mê dành cho công việc mới là điều quan trọng nhất, và niềm đam mê đó lấn át mọi yếu tố còn lại. Điều này không có nghĩa là các yếu tố kia không tồn tại. Thông thường, khi bạn làm công việc mình đam mê thì tiền bạc sẽ tự đến, bởi bạn dành nhiều thời gian và công sức để học hỏi và hoàn thiện sản phẩm của mình, và sự chăm chỉ hiếm khi không được đền đáp. Trải bài phản ánh cảm xúc của người hỏi chứ không chỉ phản ánh sự việc bên ngoài.']
  ],
  'pentacles-1': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Đây là một người thực tế, và sự thực tế đó theo hướng tích cực. Họ có đầu óc phân tích chi tiết, tỉ mỉ, luôn giữ cho chân chạm đất. Họ không bay bổng và cũng không lãng mạn hóa cảnh sống thiếu thốn, nhưng họ sẵn sàng làm việc chăm chỉ để cùng bạn xây dựng tương lai, chứ không yêu bạn vì túi tiền hay gia cảnh của bạn. Người này sống thực tế, thường có lối sống lành mạnh và biết rõ điều gì tốt, điều gì nên làm. Khi yêu một người mang năng lượng Át Tiền, bạn sẽ không cảm nhận được nhiệt huyết như ở Át Gậy, sự nhanh trí mới mẻ như ở Át Kiếm, hay tình yêu mềm mại tràn trề như ở Át Cốc. Bù lại, họ có thế mạnh riêng: họ rất thực tế và sẵn sàng nói thẳng cho bạn biết một việc có hợp lý hay không.'],
    ['love', 'Người ấy đang nghĩ gì về tôi và về mối quan hệ này?',
     'Nhiều khả năng người ấy có tình cảm với bạn, đồng thời họ cũng nhận thấy giữa hai người có sự tương xứng: hoàn cảnh gia đình, trình độ và những điều kiện khác của bạn đều phù hợp với họ. Tình cảm là một chuyện, nhưng khi tính đến hôn nhân và những mối quan hệ lâu dài thì các yếu tố mang tính chất Tiền cũng khá quan trọng. Người xưa nói đến chuyện môn đăng hộ đối cũng vì lẽ đó.'],
    ['love', 'Khác biệt về gia cảnh có thật sự quan trọng trong một mối quan hệ không?',
     'Thực tế cho thấy khi hai người xuất thân từ hai hoàn cảnh quá cách biệt, chẳng hạn một bên lớn lên trong điều kiện rất đầy đủ còn bên kia lớn lên trong thiếu thốn, thì tình cảm vẫn có thể tồn tại nhưng việc đi đường dài là rất khó. Lý do nằm ở chỗ hai người sinh ra trong môi trường khác nhau và được nuôi dạy khác nhau, nên cách nhìn về cuộc sống và về tiền bạc cũng khác nhau. Một người lớn lên trong sung túc khó có cùng quan niệm về tiền bạc với một người lớn lên dưới đáy xã hội, kể cả khi người sau về sau làm việc chăm chỉ và đạt tới vị trí đầy đủ, bởi tuổi thơ vẫn giữ vai trò rất quan trọng. Vẫn có những trường hợp hòa hợp được, nhưng thường chỉ xảy ra khi cả hai đã trưởng thành ở mức rất cao, hiểu rõ vấn đề của bản thân và chủ động tìm cách dung hòa. Những trường hợp như vậy không nhiều.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Hai bạn chưa nên vội. Điều lá bài yêu cầu là cả hai cần thực tế hơn. Nguyên nhân cãi vã có thể khá vụn vặt, và Át Tiền muốn hai bạn đưa chân chạm đất, bớt lãng mạn hóa mọi chuyện, tiếp cận vấn đề một cách lý trí, tỉnh táo và lôgic hơn. Khi Át Tiền xuất hiện trong trải bài của một cặp đôi đang mâu thuẫn, bạn có thể cảm nhận rằng hai người còn khá trẻ, hoặc năng lượng của họ thiên về phần trẻ con và bay bổng, tức là ngược lại với năng lượng của chất Tiền.'],
    ['career', 'Trong thời gian tới, tôi có tìm được việc làm không?',
     'Nhiều khả năng là có. Át Tiền báo hiệu một công việc tốt, một công việc bạn cũng yêu thích, với thu nhập và khả năng thăng tiến đều ổn định. Trong trải bài về công việc, các lá Tiền thường mang tin tốt, đặc biệt là Át Tiền và Mười Tiền.'],
    ['career', 'Trong thời gian tới, công việc của tôi có thay đổi gì không?',
     'Công việc của bạn có thể có thêm thu nhập, được tăng lương, có thêm dự án để làm, được cấp trên giao việc mới, được luân chuyển bộ phận hoặc được thăng chức. Một khả năng khác là chính bạn mở ra một nguồn kiếm tiền mới, chẳng hạn bạn đang làm văn phòng nhưng muốn kinh doanh hoặc đầu tư thêm một nhánh nữa để tăng thu nhập.']
  ]
});

/* batch 10 - the four Twos */
Object.assign(ASK.vi, {
  'wands-2': [
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Trong mối quan hệ này, người ấy nhìn khá xa và có tầm nhìn rõ ràng. Có thể ngay từ sớm họ đã hình dung ra một viễn cảnh lâu dài và một sự cam kết với bạn. Trước mắt, mong muốn cam kết đó là thật. Tuy nhiên, lá bài chưa cho biết họ cam kết vì yêu bạn hay vì một lý do khác. Nếu trải bài có thêm những lá Cốc đẹp như Át Cốc, Hai Cốc, Sáu Cốc hay Mười Cốc thì bạn đọc theo hướng tình yêu thuần túy. Nếu lá này đi kèm Công Lý hoặc Vua Kiếm, tức là những lá thiên về lý trí, thì họ muốn cam kết nhưng còn có thêm một lý do nào đó nữa.'],
    ['love', 'Nếu người ấy cam kết vì một lý do khác, điều đó có phải là xấu không?',
     'Điều đó không hẳn là xấu. Trong nhiều trường hợp, người ấy không nhắm đến tài chính hay vật chất của bạn. Họ có thể nhìn thấy ở bạn một tính cách hoặc một đặc điểm khiến họ tin rằng hai người đi đường dài được. Có người yêu bằng trọn vẹn trái tim, cũng có người yêu bằng một phần trái tim và một phần lý trí, và cách yêu thứ hai không phải là dấu hiệu xấu. Trên thực tế, những người giữ được lý trí trong tình cảm đôi khi lại chung thủy hơn những người yêu hoàn toàn bằng cảm xúc. Chẳng hạn, một người xác định dành phần lớn thời gian cho sự nghiệp sẽ tìm một bạn đời chăm lo cho gia đình; họ thấy bạn có những đặc điểm đó và bản thân bạn cũng mong muốn như vậy, nên họ chọn gắn bó lâu dài với bạn. Cảm xúc họ dành cho bạn có thể không quá mãnh liệt, nhưng họ vẫn chung thủy và đối xử tốt với bạn.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Thay vì nghĩ đến chia tay, bạn nên nhìn xa hơn và nhìn vào bức tranh tổng thể. Chính lời khuyên đó cho thấy mâu thuẫn giữa hai người đang là chuyện nhỏ và khá vụn vặt, chẳng hạn những giận hờn quanh việc nhắn tin chậm hay việc tương tác với người khác trên mạng xã hội. Đó là những phản ứng còn trẻ con và thiếu cái nhìn toàn cảnh. Cả hai đều bận rộn, thời gian dành cho nhau vốn đã hiếm, nên việc mỗi lần gặp nhau lại xảy ra tranh cãi là điều đáng tiếc.'],
    ['career', 'Thời gian tới, tôi có tìm được công việc ưng ý không?',
     'Chỉ với một lá này thì chưa nói được nhiều, và bạn có thể chia thành hai trường hợp. Trường hợp thứ nhất là bạn còn phải chờ khá lâu mới tìm được việc, bởi Hai Gậy là lá của tầm nhìn xa, hướng về một tương lai còn cách một quãng; bạn vẫn cần luyện tập thêm, học thêm và chuẩn bị hồ sơ kỹ hơn. Trường hợp thứ hai là bạn tìm được việc, và công việc đó liên quan đến yếu tố nước ngoài hoặc đòi hỏi bạn đi xa để làm. Vị trí của bạn cũng có thể là người lập kế hoạch, người tạo ra tầm nhìn cho tổ chức.'],
    ['career', 'Từ nay đến cuối năm, công việc của tôi có điều gì cần lưu ý?',
     'Bạn có thể bất ngờ thấy mình tham vọng hơn trước: muốn làm được nhiều việc hơn, muốn thăng chức, muốn tăng lương. Việc bạn đạt được tham vọng đó hay để nó biến thành lòng tham vô đáy còn phụ thuộc vào các lá khác trong trải bài. Một khả năng khác là công việc đưa bạn đi xa, đi nước ngoài, tức là có sự di chuyển về mặt địa lý.']
  ],
  'swords-2': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Đây là một người thiếu quyết đoán, và chính sự thiếu quyết đoán đó kéo theo nhiều chuyện không hay. Họ tự đặt mình vào thế bị động: trong tình cảm thì không biết nên đi tiếp hay dừng lại, trong công việc thì không biết nên nghỉ hay ở lại. Những người như vậy thường để cuộc sống của mình bị các yếu tố bên ngoài điều khiển mà không tự làm chủ được. Có hai thái cực trong chuyện này, một bên tìm cách kiểm soát mọi thứ và một bên buông cho mọi thứ trôi đi. Điểm cân bằng nằm ở giữa, khi bạn biết lúc nào nên kiểm soát và lúc nào nên buông. Người mang năng lượng Hai Kiếm nghiêng hoàn toàn về phía buông trôi.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Nhiều khả năng người ấy đang phân vân và lưỡng lự về mối quan hệ này. Họ có thể có tình cảm với bạn, nhưng vì một lý do nào đó mà chưa thật sự tiến tới, chưa đưa ra được quyết định dứt khoát. Muốn biết lý do đó là gì, bạn cần rút thêm lá.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Với Hai Kiếm, cả hai bạn đang mang năng lượng che mắt: có những vấn đề thật sự tồn tại nhưng không ai nói thẳng ra. Nhiều cặp đôi không hài lòng về một điểm nào đó ở đối phương nhưng không dám nói, nên cơn bực vẫn giữ lại trong lòng rồi trút sang một chuyện khác. Ví dụ, bạn không thoải mái khi người ấy có bạn thân khác giới, nhưng bạn tự thấy khó nói vì chính mình cũng có bạn khác giới; cơn bực vì thế vẫn còn, và bạn quay sang bắt lỗi họ ở những chuyện nhỏ như chuyện nhắn tin hay chuyện nghe điện thoại, trong khi nguyên nhân gốc rễ vẫn là người bạn kia. Lá này còn mang lớp nghĩa ngoảnh mặt làm ngơ, từ chối nhìn thẳng vào sự thật. Nếu bạn nhận ra sự thật đó ở chính mình và ngồi xuống nói rõ ràng, hai bạn không nhất thiết phải chia tay.'],
    ['career', 'Thời gian tới, tôi có tìm được công việc phù hợp không?',
     'Nhiều khả năng là chưa. Lý do nằm ở chỗ bạn chưa thật sự xác định đúng hướng đi cho công việc của mình. Bạn biết mình cần làm gì, cần thay đổi điều gì, cần học thêm kỹ năng nào và hồ sơ nên trình bày ra sao, nhưng bạn chưa bắt tay vào làm, có thể vì lười, cũng có thể vì ngại thay đổi. Chẳng hạn, bạn được đào tạo về một ngành kỹ thuật nhưng biết rõ mình muốn theo hướng sáng tạo, vậy mà khi tìm việc bạn vẫn nộp hồ sơ vào đúng ngành cũ, nên kết quả không bao giờ đến, bởi đó không phải con đường của bạn.'],
    ['career', 'Trong thời gian tới, công việc của tôi có vấn đề gì không?',
     'Ngay tại thời điểm hiện tại có thể đã tồn tại một chuyện không hay ở chỗ làm cần được giải quyết, và phản ứng đầu tiên của bạn là né tránh, ngoảnh mặt làm ngơ. Lời khuyên ở đây là bạn nên xử lý càng sớm càng tốt. Ví dụ, môi trường làm việc vẫn ổn nhưng bạn luôn cảm thấy cấp trên quý người mới hơn quý bạn; bề ngoài mọi thứ không có gì nghiêm trọng, nhưng để lâu thì sự khó chịu tích tụ dần cho đến lúc bùng nổ.'],
    ['other', 'Nếu để lâu không giải quyết, năng lượng của lá này sẽ chuyển thành gì?',
     'Năng lượng Hai Kiếm nếu kéo dài có thể chuyển thành Ác Quỷ, và sau Ác Quỷ là Tòa Tháp. Theo quan sát chung, những người mang năng lượng thiếu quyết đoán thường chỉ dứt ra được khi cuộc sống gặp một biến cố quá lớn; khi mọi thứ đã tan hoang và sụp đổ, họ mới buộc phải đưa ra quyết định. Bản thân năng lượng Hai Kiếm còn thấp và chưa đủ sức làm bạn sụp đổ, nhưng về lâu dài thì không ai đoán trước được.']
  ],
  'cups-2': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Lá này gợi ngay đến cung Thiên Bình: rất giỏi cân bằng, giỏi thương thảo, giỏi thuyết phục người khác và giỏi bán hàng. Cái cân của Thiên Bình không phải cán cân công lý mà là cân của người bán hàng, dùng để đo xem thứ này có tương xứng với thứ kia hay không. Hai Cốc mang đúng năng lượng đó, tức là cho đi và nhận lại tương xứng. Nguyên tắc này đúng với quan hệ đối tác làm ăn và cũng đúng với chuyện tình cảm, bởi mọi mối quan hệ đều dựa trên việc cho đi và nhận lại. Tóm lại, đây là một người thích sự công bằng, giữ được quan hệ tốt với những người xung quanh, giỏi ngoại giao và có tính cách khá dễ chịu.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Đây là một tín hiệu rất tốt. Người ấy có tình cảm với bạn và muốn trao đi chiếc cốc tình yêu của mình, đồng thời cũng mong nhận lại một điều tương tự. Theo nguyên tắc chung khi đọc bài, trong chuyện tình cảm mà rút được Át Cốc, Hai Cốc, Sáu Cốc hay Mười Cốc thì đều là kết quả đẹp.'],
    ['love', 'Chúng tôi hay cãi nhau, tôi phải làm thế nào để cải thiện mối quan hệ?',
     'Hai bạn chưa chắc phải chia tay, bởi tình cảm giữa hai người vẫn còn tràn đầy. Việc cãi nhau có thể chỉ xuất phát từ sự khác biệt về tính cách, trong khi tình yêu thì vẫn nguyên vẹn. Bạn hãy dùng chính nền tảng tình cảm đó để trò chuyện thẳng thắn, cùng tìm ra vấn đề của cả hai và cùng giải quyết. Thay vì mỗi người tự xoay xở theo cách riêng, hai bạn nên ngồi lại với nhau, bởi đây là mối quan hệ của cả hai người.'],
    ['love', 'Khi muốn cải thiện mối quan hệ, tôi nên hỏi ai?',
     'Trong thực tế, khá nhiều người đang ở trong một mối quan hệ của hai người nhưng lại tự mình đi tìm hướng giải quyết, hoặc mang câu hỏi đó đến một bên thứ ba, chẳng hạn hỏi làm thế nào để thay đổi đối phương hoặc bản thân cần thay đổi điều gì. Cách tốt nhất là bạn hỏi thẳng người yêu của mình, đề nghị họ góp ý cho bạn về những điều bạn cần thay đổi, rồi bạn cũng góp ý lại cho họ. Khi gặp vấn đề, đặc biệt là vấn đề tình cảm, hai bạn nên ngồi xuống nói với nhau thay vì đi hỏi lời khuyên bên ngoài.']
  ],
  'pentacles-2': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Bạn không nên gọi người này là người cân bằng, mà nên gọi là người luôn cố gắng cân bằng mọi thứ. Bản thân cuộc sống của họ có thể chưa cân bằng, nhưng họ luôn nỗ lực. Đây là người linh hoạt và thích làm nhiều việc cùng một lúc. Năng lượng này gợi đến cung Song Tử: họ không chịu được việc chỉ ở yên trong một góc hay chỉ làm một công việc, và sự cân bằng trong cảm xúc cùng tâm trí của họ đến từ chính việc xoay xở nhiều thứ song song.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Tín hiệu ở đây không mấy tích cực. Người ấy có thể đang phải cân bằng giữa mối quan hệ này với công việc, với việc học và với những chuyện riêng của họ, nên không thể toàn tâm toàn ý với bạn. Nếu bạn muốn biết lá này có ám chỉ người thứ ba hay không thì câu trả lời là không. Hai Cốc còn có thể gợi đến khả năng đó, nhưng Hai Tiền giống một người đang tung hứng các yếu tố vật chất, công việc, học tập và tiền bạc hơn là chuyện tình cảm. Người ấy có thể rất bận; tình cảm thì vẫn có, nhưng vì phải tung hứng như vậy nên thời gian họ dành cho bạn giảm xuống. Việc bạn có chấp nhận được sự vô tâm và thờ ơ đó trong mối quan hệ hay không là lựa chọn của riêng bạn.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Nguyên nhân khiến hai bạn cãi nhau có thể là một trong hai người đang quá bận rộn. Có một xu hướng rất thường gặp khi áp lực công việc lên cao: người ta bị cấp trên, đồng nghiệp hoặc khách hàng trách móc mà không thể đáp trả ở nơi làm việc, nên khi về nhà lại cáu gắt với cha mẹ và với người yêu. Nghe có vẻ vô lý, nhưng chúng ta thường trút những điều tiêu cực nhất lên chính những người mình yêu quý nhất, và phần lớn là một cách vô thức. Hướng giải quyết là cân bằng lại công việc: nếu công việc đang khiến bạn căng thẳng và bạn mang áp lực đó về nhà, bạn nên tìm cách giảm bớt khối lượng công việc.'],
    ['health', 'Làm sao tôi biết mình đang mất cân bằng?',
     'Mỗi người đều có sức khỏe thể chất và sức khỏe tinh thần. Sức khỏe thể chất dễ nhận ra, vì khi mệt bạn biết mình mệt, khi ốm bạn biết cơ thể đang cần nghỉ ngơi. Sức khỏe tinh thần thì khó thấy hơn, và người ta thường chỉ đo được nó qua mức độ vui vẻ của chính mình. Nếu không chú ý, bạn có thể đến khi mắc bệnh tâm lý mới nhận ra rằng đời sống tinh thần của mình cần được quan tâm.'],
    ['career', 'Tôi đã thất nghiệp vài tháng, thời gian tới tôi có tìm được việc không?',
     'Chỉ với một lá này thì khó trả lời dứt khoát, vì khả năng chia gần như đều cho cả hai hướng. Nếu bạn biết thu vén và sắp xếp lại cuộc sống thì bạn có thể tìm được việc. Hiện tại, dù đang thất nghiệp, cuộc sống của bạn vẫn khá lộn xộn và thiếu gọn gàng. Một môi trường xung quanh bừa bộn sẽ ảnh hưởng đến suy nghĩ và đến khả năng ra quyết định. Bạn cần một không gian gọn gàng hơn để đầu óc sáng suốt hơn, để khi đi phỏng vấn bạn trả lời tốt hơn và biết rõ mình nên theo hướng công việc nào.'],
    ['other', 'Việc dọn dẹp có liên quan gì đến chuyện tìm việc?',
     'Nhiều người không quan tâm đến việc giữ cho môi trường sống, các mối quan hệ và cả bản thân mình được gọn gàng. Họ chạy theo những mục tiêu lớn và bỏ qua những việc đơn giản như dọn nhà hay chăm sóc chính mình. Bạn hãy bắt đầu bằng việc dọn nhà, đặc biệt là phòng ngủ: phòng có đủ ánh sáng không, có gọn gàng không, màu sơn tường và màu rèm có quá tối không. Những chi tiết tưởng như đơn giản đó lại ảnh hưởng nhiều đến tâm sinh lý. Bạn hãy tự hỏi vì sao mình ngại về nhà và vì sao ngôi nhà mang lại cảm giác nặng nề. Tiếp theo là cơ thể của bạn: đã bao lâu rồi bạn chưa chăm sóc da, chưa chăm sóc tóc, chưa mua cho mình một bộ quần áo mới. Môi trường bạn tiếp xúc trực tiếp cần sạch sẽ thì bên trong bạn mới thấy gọn gàng và bình yên. Nguyên tắc này cũng đúng với các mối quan hệ: bạn hãy xem có mối quan hệ nào độc hại hay không, và bạn không nhất thiết phải cắt bỏ hoàn toàn, nhưng nên biết giữ khoảng cách.'],
    ['other', 'Vì sao bài lại không trả lời đúng câu hỏi tôi đưa ra?',
     'Người hỏi thường đặt những câu mang tính bề nổi, nhưng lá bài rút ra lại trả lời cái vấn đề gốc rễ đã dẫn đến bề nổi đó. Theo nguyên tắc chung khi đọc bài, bạn cần giải thích cho người hỏi từng bước một, cho họ thấy vấn đề gốc rễ đã dẫn đến biểu hiện bên ngoài như thế nào. Mức độ tiếp nhận cũng tùy từng người: người đã lớn tuổi và chín chắn sẽ hiểu nhanh, còn người còn quá trẻ sẽ thấy khó hiểu hơn.']
  ]
});

/* batch 11 - the four Threes */
Object.assign(ASK.vi, {
  'wands-3': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Đây là một người muốn làm rất nhiều thứ nhưng chưa dám đi những bước đầu tiên. Họ có nhiều đam mê và nhiều tham vọng, nhưng bước khởi đầu thì không dám thực hiện, vì sợ thất bại nên thà không làm còn hơn. Người mang năng lượng này sẽ kể cho bạn nghe rất nhiều dự định, rồi vài tháng sau khi bạn hỏi lại, họ có sẵn đủ lý do giải thích và đã chuyển sang một dự định khác.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Nếu hai người mới yêu nhau khoảng một tháng thì tình cảm của họ có thể là thật, và những suy nghĩ về việc gắn bó lâu dài cũng là thật. Tuy nhiên, hành động cụ thể để biến mối quan hệ thành một cam kết lâu dài thì chưa xuất hiện. Họ nói rằng muốn đi đường dài với bạn, nhưng vẫn chưa quan tâm đến sự nghiệp, chưa có ý định đưa bạn về ra mắt gia đình, cũng chưa bàn với bạn về việc sau này cưới nhau thì cuộc sống sẽ ra sao. Mọi thứ mới chỉ nằm trong suy nghĩ của họ.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Chỉ riêng lá này thì khá khó kết luận. Một trong những lý do khiến hai bạn hay cãi nhau có thể là một trong hai người, hoặc cả hai, chưa thật sự sẵn sàng cho một mối quan hệ lâu dài. Điều này rất hay gặp khi cả hai còn trẻ: hai người yêu nhau và nói với nhau về chuyện cưới xin, nhưng chưa hình dung được để cam kết lâu dài thì mỗi bên cần làm những gì. Bạn đã biết thỏa hiệp chưa, tài chính đã ổn định chưa, công việc đã vững chưa, bạn đã sẵn sàng trở thành một người của gia đình chưa? Có thể bạn vẫn muốn vui chơi, vẫn muốn đi du lịch cùng bạn bè, vẫn muốn sống cho riêng mình, và khi đó người yêu chỉ đang là một niềm vui.'],
    ['love', 'Tôi phải làm thế nào để thay đổi người ấy?',
     'Bạn không bao giờ thay đổi được bất cứ ai nếu chính họ không muốn. Ngay cả khi họ yêu bạn và thương bạn, việc họ có thay đổi hay không vẫn phụ thuộc vào ý chí chủ động của họ chứ không phụ thuộc vào bạn. Nếu họ thấy cần thay đổi để tiếp tục mối quan hệ này thì quyết định đó là của họ. Bạn chỉ nên góp ý ở một mức độ nhất định.'],
    ['career', 'Tôi đã thất nghiệp mấy tháng, sắp tới tôi có tìm được việc không?',
     'Bạn có thể đang ấp ủ nhiều dự định, nhưng hành động của bạn lại chưa tương xứng với những dự định đó. Chẳng hạn, bạn muốn vào làm ở những tập đoàn lớn, nhưng để được nhận vào đó thì bạn cần kiến thức và kinh nghiệm, trong khi bạn chưa chịu trau dồi và rèn giũa bản thân. Có những trường hợp còn khó hiểu hơn: người ta muốn có việc nhưng ngại cả việc gửi hồ sơ và ngại cả việc lên mạng tìm tin tuyển dụng. Cũng có khả năng bạn muốn khởi nghiệp nhưng còn chần chừ vì sợ hãi.'],
    ['career', 'Trong thời gian tới, công việc của tôi có điều gì cần lưu ý?',
     'Trong đầu bạn hiện có nhiều ý tưởng muốn thực hiện nhưng bạn chưa dám bắt tay vào vì còn nhiều nỗi sợ. Thông điệp của lá bài là bạn hãy bớt sợ hãi và bước ra khỏi vùng an toàn của mình.'],
    ['other', 'Nếu tôi thất bại rồi bị người khác chê cười thì sao?',
     'Trên thực tế, hầu như không ai cười bạn, bởi không mấy ai quan tâm đến bạn tới mức đó, và cũng ít người thật sự để tâm việc bạn thành công hay thất bại. Bạn thử nghĩ xem, nếu một người bạn của bạn thất bại thì bạn sẽ cười họ hay sẽ an ủi họ? Bạn có thể cười thầm trong lòng, nhưng ngay ngày hôm sau bạn đã quên. Nếu bạn luôn sống trong nỗi sợ, bạn sẽ không bao giờ dám làm điều gì lớn lao trong đời; bạn sẽ sống ngày qua ngày và mặc nhiên trở thành một người thất bại.']
  ],
  'swords-3': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Đây là một người hay đau khổ, hay buồn bực và rất nặng về tâm trạng. Họ để cảm xúc lấn át lý trí và nghiêng nhiều về phía tiêu cực. Nói chung, khi lá này xuất hiện thì đó không phải chân dung của một người vui vẻ.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Tín hiệu ở đây không vui. Người ấy có thể còn mang những tổn thương tình cảm trong quá khứ chưa được chữa lành, nên chưa thật sự sẵn sàng cho một mối quan hệ. Tuy nhiên, mức độ đau khổ trong năng lượng Ba Kiếm không quá lớn, và một người mang tổn thương của Ba Kiếm vẫn có thể tự chữa lành mà không nhất thiết phải chia tay, dù vẫn có những trường hợp phải chia tay thì họ mới nhận ra được điều gì đó.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Chuyện cãi vã này đúng là mệt mỏi và có phần độc hại, nhưng nó hoàn toàn nằm trong tầm kiểm soát của bạn, bởi đây là một lá thuộc bộ Ẩn Phụ, mà những lá Ẩn Phụ nói về các vấn đề người hỏi có thể thay đổi được và năng lượng của chúng ở mức thấp. Nhiều khả năng hai bạn cãi nhau vì những chuyện rất vặt vãnh và trẻ con, chẳng hạn việc buổi sáng không nhắn tin cho nhau hay việc bấm thích ảnh của người khác trên mạng xã hội.'],
    ['love', 'Tôi có nên kiểm soát người ấy hay không?',
     'Bạn không nên làm như vậy. Bạn không cần biết mật khẩu của nhau, không cần để ý họ bấm thích ảnh của ai, không cần theo dõi họ trên mạng xã hội và không cần giám sát mọi việc họ làm. Khi họ muốn ở cạnh bạn thì họ sẽ ở, còn khi họ không muốn thì họ sẽ rời đi. Bạn thử nghĩ xem, khi bạn đuổi theo một người thì người đó tìm cách chạy, còn khi bạn thôi bận tâm thì họ lại muốn ở gần; điều này đúng cả trong tình cảm lẫn trong quan hệ bạn bè. Bạn hãy tự soi lại mình và đặt câu hỏi vì sao mình cần biết hôm nay họ đi đâu, gặp ai và làm gì.'],
    ['career', 'Thời gian tới, tôi có tìm được công việc như ý không?',
     'Nhiều khả năng bạn vẫn chưa tìm được công việc phù hợp. Ba Kiếm chưa nói rõ lý do, nên bạn cần xem thêm các lá khác. Một khả năng là bạn đang đi theo hướng không hợp với mình, chẳng hạn bạn mong muốn theo đuổi một nghề tự do nhưng vì áp lực gia đình và xã hội mà vẫn nộp hồ sơ vào những vị trí ổn định trong công sở. Khi bạn gửi hồ sơ theo một hướng sai, kết quả sẽ không đến, bởi vũ trụ đang từ chối để bạn quay lại đúng con đường của mình.'],
    ['career', 'Trong thời gian tới, công việc của tôi có thay đổi gì không?',
     'Tín hiệu ở đây cũng không vui. Trong công việc, bạn có thể gặp một chuyện hơi buồn, chẳng hạn dự án của bạn không thành công như bạn kỳ vọng, dù cũng chưa đến mức thất bại. Một khả năng khác là quan hệ với đồng nghiệp có phần trục trặc, nhưng chưa đến mức ồn ào và chưa đến mức Tòa Tháp, vì đây mới chỉ là Ba Kiếm.']
  ],
  'cups-3': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Đây là một người hướng ngoại. Họ thích bạn bè, thích tụ tập, thích đi chơi và thích những cuộc vui đông người.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Lá này chưa cho biết nhiều. Cảm xúc người ấy dành cho bạn có thể mới dừng ở mức bạn bè, nghĩa là họ xem bạn là một trong những người bạn của họ. Nếu hai người đã ở trong một mối quan hệ mà vẫn rút được lá này thì tín hiệu hơi căng, bởi niềm vui vẫn còn nhưng đó là niềm vui của tình bạn. Trong tình yêu, bạn cần đến tình cảm của Át Cốc, của lá Tình Nhân hoặc của Mười Cốc, tức là một điều gì đó độc nhất, hoặc ổn định và vững chắc hơn. Dù vậy, đây chưa chắc đã là tín hiệu xấu: mức độ hiện tại vẫn là tình bạn hoặc trên mức tình bạn một chút, hoặc trong mối quan hệ với bạn thì họ vẫn thích đi chơi và vẫn có nhiều bạn khác giới.'],
    ['love', 'Chúng tôi cãi nhau nhiều, tôi có nên chia tay không?',
     'Với câu hỏi này, bạn nên rút thêm lá. Cảm nhận ban đầu là lý do khiến hai người hay cãi nhau có thể liên quan đến sự xuất hiện của người thứ ba. Tuy nhiên, có một lưu ý rất quan trọng: người thứ ba không phải lúc nào cũng nằm ở phía đối phương. Khi một cô gái đến hỏi bạn, người thứ ba chưa chắc đã ở phía chàng trai kia mà có thể ở ngay phía cô ấy. Người hỏi cũng không phải lúc nào cũng cung cấp cho bạn toàn bộ thông tin. Bạn hãy nói thẳng với người hỏi rằng câu trả lời có thể mang tính hai chiều: điều lá bài cho thấy là có sự xuất hiện của người thứ ba khiến mối quan hệ hay xung đột, và người đó có thể ở phía đối phương, cũng có thể ở phía chính người hỏi.']
  ],
  'pentacles-3': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Đây là một người tương đối nghiêm túc. Nếu Ba Cốc là người thích ở bên người khác để tụ tập vui chơi, thì Ba Tiền cũng thích ở bên người khác nhưng là để cùng nhau làm một việc có ích. Trong công việc, đây là người thích làm việc nhóm và thích môi trường công sở, chứ không phải người thích làm việc một mình. Năng lượng này gợi đến cung Bảo Bình, tức là mong muốn tập hợp nhiều người lại để cùng làm điều có ích, chứ không phải tập hợp để vui chơi.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Tín hiệu ở đây hơi buồn. Nó không hẳn là xấu, nhưng cũng không vui: người ấy chỉ xem bạn là bạn bè, thậm chí chỉ là đồng nghiệp, người làm cùng hoặc người học cùng, giống như họ muốn giữ một mối quan hệ mang tính chuyên nghiệp với bạn. Nếu hai bạn đã yêu nhau cả năm mà vẫn rút được lá này thì nó vẫn giữ tính chất của chất Tiền, bởi Tiền là những gì cầm được, sờ được và nhìn thấy được, tức là vật chất. Vì vậy, điều họ muốn ở bạn trong mối quan hệ này có thể là một thứ mang tính vật chất chứ không chỉ là tình cảm của bạn. Chẳng hạn, gia đình bạn có điều kiện, cha bạn giữ vị trí cao, và họ biết rằng khi yêu bạn thì vị thế của họ được nâng lên; hoặc bạn đang ở nước ngoài và đã có tư cách cư dân, nên kết hôn với bạn sẽ giúp họ được định cư.'],
    ['love', 'Vậy tôi có nên rời bỏ người đó ngay không?',
     'Bạn không nên vội kết luận rằng người kia đã như vậy thì bạn phải rời bỏ ngay. Anh ta có thể không thật lòng, nhưng chúng ta cũng chưa biết liệu chính người hỏi có thật lòng hay không. Ngoài ra, vẫn có những người chấp nhận một mối quan hệ như thế, nhất là khi bản thân họ cũng mang năng lượng của chất Tiền: họ cần ở bạn địa vị và tài chính, còn bạn cần ở họ một điều khác, và cả hai ở trong mối quan hệ để đáp ứng những nhu cầu đó chứ không phải vì cảm xúc.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Từ khóa của lá này là làm việc nhóm, vì vậy hai bạn khoan hãy chia tay. Điều cần làm trước tiên là ngồi xuống bàn bạc và giải quyết vấn đề bằng lời nói. Một trong những lý do khiến hai bạn hay cãi nhau có thể là những vấn đề về vật chất và tài chính, hoặc là hai người chưa tìm được tiếng nói chung về cam kết trong tương lai: yêu nhau đã lâu nhưng có cưới hay không, cưới vào thời điểm nào, cưới xong có sinh con ngay không, sau đó sẽ sống ở đâu. Những chuyện thuộc khía cạnh vật chất như vậy chưa được hai bạn bàn bạc thấu đáo, khi một người muốn bàn còn người kia luôn né tránh.'],
    ['career', 'Tôi đã thất nghiệp ba tháng, thời gian tới tôi có tìm được việc không?',
     'Nhiều khả năng là có, và bạn có thể chia thành hai trường hợp. Trường hợp thứ nhất là bạn tìm được việc, và công việc đó đòi hỏi làm việc nhóm nhiều, phối hợp với người khác nhiều. Trường hợp thứ hai là bạn cần hỏi những người xung quanh và cần dùng đến các mối quan hệ của mình để có được cơ hội. Bạn hãy chủ động ra ngoài, nhờ sự trợ giúp từ người khác và hỏi bạn bè, người thân xem có công việc nào phù hợp để giới thiệu cho bạn không.'],
    ['career', 'Trong thời gian tới, công việc của tôi có điều gì cần lưu ý?',
     'Thông điệp ở đây khá đơn giản: thời gian tới bạn sẽ làm việc nhóm. Nếu hiện tại bạn đang làm một mình thì sắp tới bạn sẽ phải phối hợp với người khác, còn nếu bạn đã làm nhóm thì mọi thứ vẫn tiếp tục như vậy. Việc làm nhóm này mang lại lợi ích hay khó khăn thì còn tùy vào bạn. Nếu bạn hướng nội và thích làm việc một mình, đây sẽ là một thử thách. Nếu bạn thích tương tác, thích giao tiếp và hướng ngoại, bạn hãy đọc năng lượng làm việc nhóm này theo hướng tích cực.'],
    ['other', 'Lá này khác Ba Cốc và Giáo Hoàng ở điểm nào?',
     'Trong bộ bài 78 lá có hai lá nói về làm việc nhóm là Ba Tiền và Giáo Hoàng. Giáo Hoàng thiên về giáo dục, bởi khi đi học thì mọi người phải làm việc cùng nhau. Ba Tiền thì thuần túy là làm việc nhóm, với hình ảnh ba người đang cùng bàn bạc công việc. Ba Cốc cũng là một nhóm, nhưng đó là nhóm để vui chơi và tụ tập. Còn nhóm để cùng giải quyết một vấn đề và hướng đến mục đích chung thì đó là Ba Tiền.']
  ]
});

/* batch 12 - the four Fours */
Object.assign(ASK.vi, {
  'wands-4': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Với câu hỏi về tính cách, một lá bài đơn lẻ chỉ phác được vài nét chính, và Bốn Gậy không mang ý nghĩa xấu. Nét nổi bật nhất là sự vững vàng: người này có nền tảng tâm lý ổn định và nhìn cuộc sống bằng con mắt lạc quan, tích cực.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Đối với câu hỏi này, Bốn Gậy là một trong những lá đẹp nhất. Người ấy nhìn bạn như một người bạn đời tiềm năng, chứ không phải một mối quan hệ để giải trí hay để lấp chỗ trống. Ngay cả khi hôn nhân chưa nằm trong tầm tay, họ vẫn muốn cùng bạn xây một mối quan hệ nghiêm túc, cùng nhau trưởng thành và nâng đỡ nhau. Tuy vậy, bạn nên nhìn thêm mặt còn lại của sự ổn định. Một người coi trọng sự an toàn và bền vững thường không phải là người hay tạo bất ngờ. Họ có thể ít lãng mạn, ít thích phiêu lưu và không hứng thú với những chuyến đi bốc đồng. Nếu bạn muốn biết họ có lãng mạn hay bay bổng hay không, một lá này chưa đủ; bạn hãy rút thêm lá để làm rõ.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Ở vị trí này, Bốn Gậy gợi nhắc rằng hai bạn đã đến với nhau bằng một ý định nghiêm túc: cả hai từng muốn cam kết và tính đến chuyện kết hôn. Điều thường xảy ra sau nhiều năm bên nhau là người ta quên mất vì sao mình chọn người này. Vì vậy, thay vì trả lời ngay câu hỏi chia tay, bạn nên quay lại điểm xuất phát. Bạn hãy dành thời gian nhớ lại điều gì ở họ đã khiến bạn rung động, có thể bằng cách ghi ra giấy hoặc tự đối thoại với bản thân. Sau đó, bạn cân nhắc xem lý do đó còn đủ sức giữ mối quan hệ hay không, hay những va chạm hằng ngày đã làm nó mòn đi đến mức bạn không còn muốn gắn bó. Một mối quan hệ lâu dài luôn đòi hỏi sự thỏa hiệp từ hai phía. Nếu một trong hai người luôn muốn đối phương nhường mình và luôn muốn thắng trong mỗi lần tranh cãi, mối quan hệ sẽ khó bền, và hôn nhân càng khó hơn.'],
    ['career', 'Tôi đã thất nghiệp lâu, thời gian tới tôi có tìm được việc không?',
     'Câu trả lời nghiêng về có. Bốn Gậy mang hình ảnh của một buổi lễ mừng, nên công việc bạn sắp tìm được không chỉ là một chỗ làm bất kỳ. Đó là công việc bạn thật sự thích, đúng lĩnh vực bạn theo đuổi và phù hợp với hướng đi bạn đang xây dựng. Đây cũng là một chỗ làm bạn có thể gắn bó nhiều năm, chứ không phải một việc tạm bợ để cầm cự qua giai đoạn khó khăn rồi lại đi tìm việc khác. Người ta không ăn mừng vì một công việc mình không ưa hay chỉ làm cho có.'],
    ['career', 'Trong thời gian tới, công việc của tôi có điều gì cần lưu ý?',
     'Nhiều khả năng bạn đã đang sống trong năng lượng của Bốn Gậy: bạn hài lòng với công việc hiện tại, không có ý định rời đi và muốn gắn bó lâu dài. Trong thời gian tới, trạng thái này vẫn được duy trì. Điểm đáng lưu ý nằm ở bản chất của sự ổn định. Sự ổn định không xuất hiện trong một ngày; nó được xây dựng qua nhiều tháng liên tiếp. Vì thế, lá này không báo rằng bạn sắp chuyển từ hoang mang sang ổn định, mà cho thấy nền tảng vốn có của bạn sẽ tiếp tục vững chắc, thậm chí trong một chặng đường dài phía trước. Bạn có thể yên tâm rằng mình đã chọn đúng ngành và đúng hướng.'],
    ['other', 'Ở trong vùng an toàn có phải là điều xấu không?',
     'Câu trả lời là không hẳn. Sự an toàn và ổn định là điều mà ai cũng nỗ lực để đạt tới, nên bản thân vùng an toàn không xấu. Vấn đề chỉ nằm ở mục đích của việc bước ra khỏi nó. Chúng ta rời vùng an toàn để khám phá, rồi dựng nên một vùng an toàn mới rộng hơn. Khi còn sức lực và tuổi trẻ, chúng ta lại bước ra một lần nữa và lại mở rộng nó thêm. Cuộc sống không phải là một cuộc chạy không ngừng về phía trước. Có những giai đoạn con người cần dừng lại để nghỉ, và khoảng nghỉ đó chính là lúc bạn tận hưởng thành quả mình vừa tạo ra. Nếu bạn vừa trải qua một chặng dài phải nỗ lực và đấu tranh, việc nghỉ ngơi trước khi bước vào chặng tiếp theo là điều hoàn toàn lành mạnh.']
  ],
  'swords-4': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Bốn Kiếm mô tả một người thận trọng chứ không phải một người lười biếng. Trước khi hành động, họ cân nhắc kỹ, xem xét vấn đề từ nhiều phía và chỉ bắt tay vào việc khi đã thấy đủ rõ. Bốc đồng hay vội vàng không phải là tính cách của họ. Mặt trái của tính cách này là sự chậm trễ khi hoàn cảnh đòi hỏi một quyết định tức thì. Ví dụ, nếu người yêu yêu cầu họ trả lời ngay lập tức rằng tiếp tục hay dừng lại, họ sẽ lúng túng và không đưa ra được câu trả lời.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Lá này cho thấy người ấy chưa muốn đẩy mối quan hệ đi nhanh hơn. Họ thích giữ mọi thứ ở trạng thái hiện tại, êm đềm và không có thay đổi lớn, để có thêm thời gian quan sát và cân nhắc. Nếu bạn rút được Bốn Kiếm trong lúc đang chờ một lời tỏ tình hay một lời cầu hôn, thì câu trả lời có thể sẽ khiến bạn thất vọng, vì họ chưa sẵn sàng cho bước tiến đó.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Với Bốn Kiếm, câu trả lời là chưa nên chia tay. Điều hai bạn cần là một khoảng lặng ngắn, khoảng một đến hai ngày, để mỗi người tự nhìn lại: mình đã sai ở đâu, đối phương đã sai ở đâu, và mình muốn nói điều gì. Tiếp tục nhắn tin hay gặp mặt trong lúc cả hai còn nóng giận chỉ dẫn đến một trận cãi vã mới. Tuy nhiên, khoảng lặng này phải ngắn. Bạn không nên biến nó thành một kỳ "tạm dừng" kéo dài hàng tuần hay hàng tháng, vì trong tình yêu, kiểu tạm dừng đó gần như luôn kết thúc bằng chia tay thật sự.'],
    ['career', 'Tôi đã thất nghiệp sáu tháng, thời gian tới tôi có tìm được công việc phù hợp không?',
     'Lá này nói khá thẳng rằng vấn đề nằm ở động lực của bạn chứ không phải ở thị trường việc làm. Có thể bạn không thật sự muốn đi làm lúc này, và việc tìm việc chỉ để đáp lại kỳ vọng của gia đình và xã hội. Sâu bên trong, bạn có thể đang cần một khoảng nghỉ để làm những điều mình thích, chẳng hạn như học một kỹ năng mới, đi tình nguyện hoặc dành thời gian cho một dự án cá nhân, trước khi quay lại con đường sự nghiệp chính. Vì mục tiêu bên ngoài không khớp với mong muốn bên trong, bạn làm mọi thứ một cách hời hợt: hồ sơ gửi đi không được chăm chút, và khi phỏng vấn, bạn mang theo thái độ được cũng tốt mà không được cũng không sao. Với năng lượng này, việc tìm được công việc phù hợp trong thời gian tới là khó.'],
    ['career', 'Người phỏng vấn có nhận ra điều đó không?',
     'Có, thái độ đó thường không giấu được. Một buổi phỏng vấn không chỉ kiểm tra kiến thức; nhà tuyển dụng còn quan sát mức độ hứng thú và sự nghiêm túc của ứng viên với công việc. Ví dụ, một người đi phỏng vấn cho có thường trả lời chung chung, ít hỏi lại về công việc và không thể hiện mong muốn gắn bó. Người phỏng vấn có kinh nghiệm sẽ nhận ra ngay rằng ứng viên này chỉ đến để hoàn thành một thủ tục, và họ có thể nói thẳng điều đó với bạn.'],
    ['career', 'Trong thời gian tới, công việc của tôi có thay đổi gì không?',
     'Trong thời gian tới, và có thể ngay lúc này, công việc của bạn gần như đứng yên, không có bước tiến rõ rệt. Điều này tốt hay xấu tùy thuộc vào mong muốn của bạn. Với người thích sự yên ổn, chỉ cần một công việc đều đặn, đi làm rồi về nhà và không đặt nặng thăng tiến, Bốn Kiếm là một lá dễ chịu. Ngược lại, nếu bạn là người có tham vọng và muốn được thử thách, giai đoạn giậm chân này sẽ khiến bạn khó chịu và lá này không phải là tin tốt.']
  ],
  'cups-4': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Bốn Cốc mô tả một người có tầm nhìn hẹp. Họ chỉ tin vào những gì tai nghe mắt thấy và đánh giá mọi thứ theo hai thái cực rõ ràng, đúng hoặc sai, trắng hoặc đen. Trực giác và cảm nhận gần như không có chỗ trong cách họ nhìn nhận. Vì vậy, họ khó hình dung ra một khả năng khác ngoài những gì đang bày ra trước mắt, và càng khó theo đuổi một viễn cảnh mà họ chưa từng thấy.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Một lá Bốn Cốc chưa đủ để kết luận về tình cảm của họ, nhưng nó gợi ý một xu hướng đáng chú ý. Tình cảm bạn dành cho họ giống chiếc cốc đang được đưa tới trong hình, còn ánh mắt của họ lại hướng về những chiếc cốc khác. Đây có thể là kiểu người đã có người bên cạnh nhưng vẫn để ý những lựa chọn khác, thậm chí vẫn nghĩ về người cũ. Điều họ chưa nhận ra là mối quan hệ với bạn mới là thứ đáng để họ đầu tư thời gian và công sức ở thời điểm hiện tại. Thay vào đó, họ tiếp tục mải nhìn theo những gì ngoài tầm với.'],
    ['love', 'Vậy chuyện này có thể thay đổi được không?',
     'Có, và lý do nằm ở bản chất của lá bài. Bốn Cốc là một lá Ẩn Phụ số thấp, cùng nhóm với các lá từ số 2 đến số 7. Theo nguyên tắc chung khi đọc bài, những lá số thấp báo hiệu hai điều: vấn đề chưa lớn, và nó có thể được giải quyết bằng chính ý chí của người đứng ở vị trí đó trong trải bài. Hiện tại người ấy chưa nhìn thấy giá trị của bạn, nhưng nhận thức đó có thể thay đổi. Một cuộc trò chuyện thẳng thắn, hoặc thậm chí một lần tranh cãi rõ ràng để nói hết ra, có thể là bước ngoặt.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Điểm mấu chốt của những trận cãi vã này là góc nhìn. Mối quan hệ của hai bạn giống một bức tranh rộng, nhưng bạn chỉ chăm chú vào một chi tiết nhỏ để bắt lỗi. Người ấy đối xử tốt với bạn, và như bất kỳ ai, họ cũng có những điểm chưa hoàn hảo. Vấn đề là bạn liên tục xoáy vào đúng điểm ấy và trách móc họ vì nó. Trong khi đó, bạn bỏ qua toàn cảnh: những nỗ lực họ đã bỏ ra, những thay đổi họ đã làm vì bạn, và tất cả những điều tốt họ đã dành cho bạn. Trước khi nghĩ đến chia tay, bạn nên lùi lại và nhìn cả bức tranh.'],
    ['career', 'Trong thời gian tới, tôi có tìm được việc không?',
     'Bốn Cốc trả lời khá bất ngờ: cơ hội có thể đang ở rất gần bạn, trên một trang tuyển dụng bạn lướt qua mỗi ngày hoặc qua một người quen, nhưng bạn không nhìn thấy nó vì mải tìm kiếm ở những nơi xa xôi hơn.'],
    ['career', 'Trong thời gian tới, công việc của tôi có thay đổi gì không?',
     'Lá này cảnh báo về việc bỏ lỡ cơ hội ngay trước mắt. Trong công việc hiện tại, có thể đang có những hướng phát triển mới phù hợp với bạn mà bạn chưa để ý, trong khi bạn lại dõi theo những con đường không thuộc về mình. Hãy lấy một ví dụ đơn giản. Một người có khả năng nấu ăn rất tốt lẽ ra nên theo học ẩm thực và phát triển sự nghiệp trong bếp, vì đó là tài năng và sở thích của họ. Nhưng họ lại chọn làm một công việc văn phòng không liên quan, rồi sau vài năm tự hỏi tại sao không ai nhận ra năng lực của mình. Đó là một dạng đi sai hướng mà Bốn Cốc muốn chỉ ra.'],
    ['other', 'Nếu tôi không tự định hướng được cho bản thân thì tôi nên làm gì?',
     'Nếu bạn nhận thấy mình thiếu khả năng tự định hướng, đúng như tinh thần của Bốn Cốc, thì giải pháp là tìm một người dẫn đường. Đây chính là vai trò của một người thầy hay một người cố vấn: họ chỉ cho bạn hướng đi phù hợp, còn phần việc của bạn là kiên trì đi theo con đường đó.']
  ],
  'pentacles-4': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Người mang năng lượng Bốn Tiền thích nắm quyền kiểm soát, muốn mọi việc diễn ra theo ý mình và không sẵn lòng chia sẻ những gì mình có với ai. Điều đáng chú ý là họ không hề thiếu thốn. Vấn đề nằm ở tâm thức: họ luôn tin rằng mình đang thiếu, và niềm tin đó kéo họ vào một thực tại thiếu thốn thật sự. Hãy hình dung một người có thu nhập ổn định nhưng luôn lo rằng tiền hôm nay sẽ biến mất vào ngày mai. Nỗi sợ ấy khiến họ trở nên keo kiệt với người khác và với cả chính mình, đến mức ốm cũng không dám mua thuốc mà chờ cơ thể tự khỏi để tiết kiệm.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Đây không phải là một lá dễ chịu cho câu hỏi này. Tình cảm có thể có, nhưng đi kèm một trong hai điều: hoặc họ muốn kiểm soát bạn, hoặc họ rất dè dặt khi trao đi tình cảm vì sợ bị tổn thương, thường do một vết thương cũ trong quá khứ. Để biết trường hợp nào đang xảy ra, bạn hãy rút thêm lá.'],
    ['love', 'Chúng tôi cãi nhau nhiều, tôi phải làm thế nào để cải thiện?',
     'Nguyên nhân của những trận cãi vã này là sự kiểm soát. Ít nhất một trong hai người, và đôi khi là cả hai, đang cố uốn nắn đối phương theo ý mình, từ cách ăn mặc, cách nói chuyện cho đến cách cư xử. Khi lá này xuất hiện, người có xu hướng đó thường chính là người đặt câu hỏi. Cách cải thiện là nới lỏng sự kiểm soát và học cách yêu người kia đúng với con người thật của họ, thay vì tìm cách biến họ thành một phiên bản khác.'],
    ['love', 'Trong tình cảm, lá này còn nói về chuyện gì khác?',
     'Trong tình cảm, Bốn Tiền còn nói về việc ôm giữ quá khứ. Người hỏi có thể không hề liên lạc hay đeo bám người cũ, nhưng trong tâm trí, họ vẫn giữ nguyên hình ảnh người ấy. Hãy hình dung một người đã chia tay từ nhiều năm trước và hoàn toàn mất liên lạc, nhưng qua thời gian, họ tự tô vẽ người cũ thành một hình mẫu hoàn hảo và tin rằng đó mới là người phù hợp nhất với mình. Hình ảnh ấy chỉ tồn tại trong trí tưởng tượng. Người thật ngoài đời đã thay đổi và không còn khớp với bức chân dung mà bạn tự dựng lên.'],
    ['career', 'Sắp tới tôi có tìm được công việc như ý không?',
     'Câu trả lời nghiêng về chưa, và nguyên nhân một phần nằm ở thái độ của chính bạn. Bốn Tiền cho thấy bạn đang muốn kiểm soát kết quả: phải có việc trong tháng này, lương phải cao và bản thân phải thích công việc đó, tất cả cùng một lúc. Thực tế hiếm khi vận hành theo cách đó. Bạn nên học cách thuận theo dòng chảy hơn là ép mọi thứ vào một khung thời gian cố định. Thay vì ấn định rằng tin vui phải đến ngay, bạn hãy nhìn lại các lần phỏng vấn chưa thành công và tìm ra điều cần cải thiện. Nếu bạn còn thiếu một chứng chỉ và cần vài tháng để hoàn thành, thì hãy chấp nhận bỏ ra vài tháng ấy.'],
    ['career', 'Trong ba tháng tới, công việc của tôi có điều gì cần lưu ý?',
     'Trong ba tháng tới, bạn nên để ý đến xu hướng giữ khư khư trong công việc. Bốn Tiền cho thấy bạn có thể đang bám vào vị trí của mình hoặc trở nên ích kỷ với kiến thức: bạn biết nhiều nhưng không muốn chia sẻ với đồng nghiệp và ngại hướng dẫn người mới. Đây là chuyện quen thuộc ở nhiều nơi làm việc, khi người làm lâu năm giữ kinh nghiệm cho riêng mình vì sợ người khác giỏi lên. Lá này nhắc rằng cách nghĩ đó là một dạng thiển cận cần được nhận ra.'],
    ['other', 'Vì sao tôi nên buông bỏ?',
     'Bài học của Bốn Tiền là buông bỏ lòng tham và buông bỏ nhu cầu kiểm soát. Khi bạn giữ chặt một thứ mình không còn dùng đến, bạn tự đóng cánh cửa dẫn đến những thứ tốt hơn đang chờ mình. Nhiều người có trải nghiệm tương tự: họ từng muốn mọi việc trong học tập, công việc và tình cảm đều diễn ra theo đúng kế hoạch, nhưng cuộc sống liên tục rẽ sang hướng khác. Ở thời điểm thất bại, họ chỉ thấy đau khổ và thất vọng. Nhưng khi nhìn lại một chặng đường dài, họ nhận ra mỗi cánh cửa đóng lại đều có lý do, vì phía sau nó thường là một cơ hội tốt hơn. Nếu không mất đi điều cũ, họ đã không bao giờ biết đến điều mới.']
  ]
});

/* batch 13 - the four Fives */
Object.assign(ASK.vi, {
  'wands-5': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Năm Gậy gợi ra hai kiểu người. Kiểu thứ nhất thích châm chọc và nói những lời mỉa mai. Họ không có ý xấu và không muốn hại ai; đó chỉ là thói quen trong cách nói chuyện, và họ dừng lại ở lời nói chứ không đi xa hơn thành hành động. Kiểu thứ hai là người thường xuyên giằng co với chính mình: muốn làm rồi lại không muốn, muốn yêu rồi lại ngập ngừng. Mâu thuẫn nội tâm là đặc điểm nổi bật của họ.'],
    ['love', 'Một người thích tranh luận có phải là người xấu không?',
     'Không hẳn. Bạn cần phân biệt hai kiểu người. Người tranh luận để hạ thấp người khác và nâng mình lên là một chuyện. Còn người tranh luận để phản biện ý kiến của bạn lại là chuyện khác: họ không ghét bạn và không muốn dìm bạn. Với họ, điều quan trọng nhất là đi đến sự thật, nên họ tìm những chỗ chưa hợp lý trong lập luận. Nếu bạn đáp lại bằng lý lẽ chặt chẽ, chính họ sẽ giúp bạn rèn khả năng tư duy. Những bài học từ kiểu người này thường khô khan và không dễ tiếp thu, nhưng về lâu dài, chúng có lợi cho bạn.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Tình cảm có thể có, nhưng nó đang bị kẹt trong một cuộc giằng co nội tâm: người ấy thích bạn nhưng lại có điều gì đó khiến họ tự kìm mình lại. Lý do đằng sau khá phức tạp và một lá Năm Gậy không nói hết được, nên bạn cần rút thêm lá.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Lá này khuyên bạn chưa nên chia tay, vì vấn đề thật sự chưa được gọi tên. Những gì hai bạn tranh cãi thường là chuyện vụn vặt, chẳng hạn ai phải nhắn tin trước hay tại sao về đến nhà mà không báo. Nhưng phía sau các chuyện nhỏ đó là một nỗi bất an lớn hơn: bạn lo mối quan hệ không chắc chắn, có thể lo có người thứ ba, nên bạn tìm cách kiểm soát. Bạn lại không nói ra những điều thật lòng ấy, và khi bạn im lặng, người kia không thể hiểu tại sao bạn cư xử như vậy. Năm Gậy yêu cầu sự thẳng thắn. Bạn hãy một lần nói hết những gì mình nghĩ và những gì mình sợ.'],
    ['career', 'Thời gian tới, tôi có tìm được công việc như ý không?',
     'Năm Gậy cho thấy chuyện tìm việc bị chậm lại vì một mâu thuẫn bên trong bạn. Có thể bạn thật sự thích một lĩnh vực nhưng lại đi xin việc ở một lĩnh vực khác, vì áp lực từ gia đình hoặc vì tấm bằng bạn đang có. Ví dụ, một người đam mê làm bánh nhưng vẫn gửi hồ sơ vào các vị trí hành chính chỉ vì gia đình mong như vậy. Đi ngược với mong muốn thật của mình là đi sai hướng, và cơ hội hiếm khi mở ra ở hướng đó. Việc cần làm trước là giải quyết mâu thuẫn ấy: nhìn thẳng vào điều mình muốn và chấp nhận con đường đó. Khi bên trong đã thống nhất, chuyện tìm việc sẽ đơn giản hơn nhiều.'],
    ['career', 'Trong thời gian tới, công việc của tôi có vấn đề gì không?',
     'Trong thời gian tới, bạn có thể gặp một va chạm nhỏ với đồng nghiệp. Cường độ của Năm Gậy thấp, nên đây chỉ là xung đột không đáng kể. Tuy nhiên, bạn nên rút thêm lá hỗ trợ để xem va chạm nhỏ này có nguy cơ lớn lên hay không nếu bị xử lý vụng về. Một bất đồng nhỏ được giải quyết thiếu tế nhị có thể khiến đối phương để bụng, và về sau, họ có thể tìm cách đáp trả nặng nề hơn nhiều so với chuyện ban đầu.'],
    ['other', 'Vì sao người ta nói rằng tương lai trong Tarot có thể thay đổi được?',
     'Tarot cho bạn thấy những khả năng có thể xảy ra, chứ không phải một số phận đã định sẵn. Khi bạn hành động theo hướng ngược lại, viễn cảnh trong trải bài sẽ không thành hiện thực nữa, và đó là lý do tương lai trong Tarot có thể thay đổi. Tuy nhiên, sự thay đổi chỉ nằm trong một phạm vi nhất định, đúng như câu "đức năng thắng số": bạn điều chỉnh được trong khoảng cho phép, nhưng không vượt ra ngoài.']
  ],
  'swords-5': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Năm Kiếm mô tả một người ưa tranh cãi, nhưng cãi mà không nhằm mục đích gì rõ ràng. Họ muốn thắng trong từng câu nói, và cái thắng đó không mang lại điều gì ngoài việc thỏa mãn cái tôi trong chốc lát. Đó không phải là một chiến thắng đáng tự hào.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Một lá Năm Kiếm khó trả lời trọn vẹn câu hỏi này, nên bạn hãy rút thêm. Điều lá này gợi ý là tình cảm có thể có thật, nhưng cách người ấy thể hiện lại làm bạn khó chịu. Có những người yêu quý bạn thật lòng nhưng luôn ra lệnh và áp đặt trong lời nói. Tình cảm của họ là thật, còn cách họ giao tiếp, từ lời nói cho đến cách nhắn tin, lại thường xuyên khiến bạn bực bội.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Ở đây, vấn đề không chỉ là cãi nhau mà là hai bạn dùng lời nói làm tổn thương nhau vì những chuyện không đáng, chẳng hạn cãi nhau chỉ vì mỗi người có thói quen sinh hoạt khác nhau. Năng lượng của Năm Kiếm khá trẻ con, và chia tay không phải là câu trả lời đầu tiên. Bạn nên xử lý cách giao tiếp này trước. Chỉ khi bạn đã thật sự cố gắng mà người kia vẫn tiếp tục lối cư xử đó, bạn mới nên tính đến chuyện dừng lại.'],
    ['career', 'Tôi đã thất nghiệp vài tháng, thời gian tới tôi có tìm được việc không?',
     'Riêng về câu hỏi có hay không, một lá Năm Kiếm chưa đưa ra được câu trả lời rõ ràng. Điều lá này cho thấy là môi trường xung quanh bạn. Có thể đang có một người thường xuyên nói những lời làm bạn thấy mình kém cỏi: rằng bạn không đủ khả năng, rằng bạn sẽ không làm nên chuyện, hoặc nhắc đi nhắc lại những lần thất bại trước đây của bạn. Người đó có thể là người thân, bạn bè hay người yêu. Dù là ai, bạn đang chịu ảnh hưởng của một năng lượng Năm Kiếm, và bạn cần cẩn trọng để nó không làm suy giảm sự tự tin trong quá trình tìm việc.'],
    ['career', 'Trong thời gian tới, công việc của tôi có điều gì cần lưu ý?',
     'Điều cần lưu ý là những lời nói gây tổn thương ở nơi làm việc. Có hai khả năng: hoặc bạn là người phải hứng chịu, chẳng hạn bị cấp trên xúc phạm hay nói những lời không đúng mực, hoặc chính bạn là người đang nói những lời như vậy với người khác. Nếu bạn ở phía bị tổn thương, lời khuyên là đáp lại bằng sự tử tế, lòng tốt và sự bao dung, thay vì trả đũa theo cách tương tự.'],
    ['other', 'Lá này nói gì về việc tranh cãi trên mạng?',
     'Năm Kiếm mô tả rất đúng những cuộc tranh cãi trên mạng. Bạn cãi nhau với một người lạ, quyết thắng cho bằng được, viết những bình luận dài để đáp trả, và coi người im lặng trước là người thua. Khi họ ngừng trả lời và bình luận của bạn nhận được nhiều sự đồng tình hơn, bạn cảm thấy mình đã thắng. Nhưng chiến thắng đó không có giá trị thực. Việc họ im lặng không có nghĩa là họ chịu thua; có thể họ chỉ bận với công việc, gia đình hay những việc quan trọng hơn. Cuộc sống của bạn cũng không thay đổi chút nào nhờ thắng một cuộc tranh luận vô nghĩa. Mỗi người có quan điểm riêng, việc họ nghĩ khác bạn là chuyện bình thường, và bạn không thể ép ai nghĩ giống mình.'],
    ['other', 'Khẩu nghiệp là gì?',
     'Khẩu nghiệp là nghiệp tạo ra từ lời nói. Mỗi lần bạn xúc phạm hay làm tổn thương ai đó bằng lời lẽ, bạn đang tạo thêm nghiệp xấu, và nó tích tụ dần theo thời gian chứ không biến mất. Một cách nhìn phổ biến là xem những lời sỉ nhục mình phải nhận như hệ quả của những lời mình từng nói ra, trong quá khứ gần hoặc xa. Vì vậy, khi bạn định nói điều gì nặng nề, dù bạn ghét người đó đến đâu, bạn hãy dừng lại. Mọi cảm xúc tiêu cực bạn gây ra cho người khác đều là nghiệp bạn phải mang.']
  ],
  'cups-5': [
    ['other', 'Lá này là tích cực hay tiêu cực?',
     'Năm Cốc nên được đọc như một lời khuyên hơn là một sự kiện tốt hay xấu. Từ khóa của lá là mất mát, đổ vỡ và thất bại, nhưng ở cường độ nhỏ, vì đây là một lá Ẩn Phụ số thấp. Việc một đổ vỡ nhỏ trở thành nỗi đau để đời hay chỉ là một bài học thoáng qua phụ thuộc hoàn toàn vào cách người hỏi nhìn nhận nó.'],
    ['other', 'Vì sao cùng nói về thất bại mà Ẩn Phụ lại nhẹ hơn?',
     'Theo nguyên tắc chung khi đọc bài, các sự kiện do Ẩn Phụ mô tả thường nhẹ hơn về cả cường độ lẫn tần suất so với Ẩn Chính. Cùng nói về thất bại, một lá Ẩn Chính chỉ một thất bại lớn, giống như được sắp đặt bởi những lực nằm ngoài tầm kiểm soát của con người. Trong bộ Ẩn Phụ, chỉ các lá số 9 và đặc biệt là số 10 mới có sức nặng gần bằng Ẩn Chính. Các lá từ số 2 đến số 7 mang năng lượng thấp, và kết quả tốt hay xấu phần lớn do chính người hỏi tạo ra.'],
    ['love', 'Tôi vừa thất bại và đổ vỡ, tôi nên nhìn nhận chuyện này như thế nào?',
     'Hình ảnh của lá này chứa sẵn câu trả lời. Nhân vật trong tranh chỉ nhìn vào ba chiếc cốc đã đổ, trong khi hai chiếc cốc phía sau vẫn đứng nguyên. Anh ta chọn nhìn vào phần mất đi thay vì phần còn lại, giống như nhìn một ly nước và chỉ thấy chỗ vơi. Cuộc sống không bao giờ hoàn toàn theo ý chúng ta; thất bại và chia ly là những điều ai cũng phải trải qua. Nhưng điều đó không có nghĩa là bạn phải mang nỗi buồn này suốt đời. Bạn vẫn cần bước tiếp, và cách để bước tiếp là quay lại nhìn hai chiếc cốc còn đầy bằng câu hỏi: lần đổ vỡ này dạy cho mình điều gì?'],
    ['love', 'Nếu tôi vừa chia tay người yêu thì tôi áp dụng bài học này như thế nào?',
     'Sau chia tay, người ta dễ rơi vào những suy nghĩ như mình không xứng đáng được yêu hay mình sẽ không bao giờ yêu ai nữa. Năm Cốc khuyên bạn thay thế những suy nghĩ ấy bằng một góc nhìn khác: chính lần chia tay này cho bạn biết kiểu quan hệ nào không phù hợp với mình và bạn cần điều chỉnh điều gì ở bản thân. Khi bạn nhìn được như vậy, bạn đang hướng về hai chiếc cốc còn lại, và sự lạc quan bắt đầu quay về.']
  ],
  'pentacles-5': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Năm Tiền mô tả một người mang mặc cảm tự ti. Gốc rễ thường nằm ở tuổi thơ: họ lớn lên trong hoàn cảnh thiếu thốn về vật chất, và trải nghiệm đó định hình cách họ nhìn cuộc đời. Điều đáng nói là mặc cảm này không tự mất đi khi hoàn cảnh thay đổi. Dù hiện tại họ đã trưởng thành, có vị trí trong xã hội, được tôn trọng và tự chủ về tài chính, vết thương cũ vẫn đi theo họ. Nếu họ không tự quan sát bản thân và chủ động thay đổi, sự tự ti ấy sẽ tiếp tục bộc lộ qua những hành động và thái độ vô thức.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Từ khóa của Năm Tiền là sự thiếu thốn, và với câu hỏi này, đó là thiếu thốn về tình cảm. Người ấy có thể đã lớn lên trong một gia đình mà cha mẹ vắng mặt hoặc thờ ơ, nên cảm giác không được yêu thương theo họ đến tận bây giờ. Một người thiếu tình yêu từ nhỏ thường không biết cách trao đi tình yêu khi trưởng thành. Họ sợ rằng nếu mở lòng, họ sẽ lại bị tổn thương và bị bỏ rơi thêm một lần nữa. Vì vậy, họ có thể có tình cảm với bạn, nhưng vết thương bên trong là thứ họ phải tự chữa trước khi có thể yêu một cách trọn vẹn.'],
    ['love', 'Có nên bắt đầu một mối quan hệ với người mang lá này không?',
     'Lời khuyên của lá này là không nên. Với những vấn đề chưa được giải quyết bên trong họ, một mối quan hệ dù có bắt đầu cũng khó đi được xa.'],
    ['love', 'Tôi có thể chữa lành cho họ không?',
     'Năm Tiền nhắc một điều quan trọng về ranh giới. Bạn không nên tự xem mình là người có thể chữa lành cho ai đó hay là vị cứu tinh của họ. Tương tự, bạn cũng không nên chờ một ai đó xuất hiện để mang vấn đề của bạn đi. Những vết thương tinh thần thuộc về ai thì người ấy phải tự chữa. Việc đọc bài giống như việc khám bệnh: người xem bài cho bạn chỉ có thể chỉ ra vấn đề và gợi ý hướng đi, tương tự bác sĩ chẩn đoán và kê đơn. Còn uống thuốc hay không là lựa chọn của người bệnh. Không ai có thể ép người khác chữa lành thay cho họ.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên tiếp tục mối quan hệ này không?',
     'Tiếp tục mà không thay đổi gì chỉ dẫn đến những trận cãi vã tiếp theo. Năm Tiền đề nghị bạn dừng lại và hỏi chính mình: mình đang thiếu điều gì trong mối quan hệ này, và vì sao mình luôn cảm thấy không được đáp ứng? Sau đó, bạn cần đặt câu hỏi tương tự với người kia, bằng cách ngồi xuống và nói rõ vấn đề của cả hai. Sự thẳng thắn là chìa khóa. Im lặng và mong đối phương tự đoán là con đường dẫn đến rất nhiều hiểu lầm. Khi họ không đoán được, bạn lại dùng sự im lặng như một hình phạt và tin rằng họ đáng bị như vậy vì không hiểu mình. Vòng lặp đó cần được cắt đứt bằng một cuộc nói chuyện thật.'],
    ['career', 'Thời gian tới tôi có tìm được công việc như ý muốn không?',
     'Rất tiếc, câu trả lời nghiêng về không. Hoặc nếu bạn tìm được việc, thu nhập từ công việc đó sẽ thấp hơn nhiều so với kỳ vọng. Năm Tiền báo hiệu một giai đoạn tài chính eo hẹp: bạn mong kiếm được mười phần thì thực tế có thể chỉ được một phần nhỏ. Vì thế, đây là thời điểm để bạn tiết kiệm, rà soát lại chi tiêu và chuẩn bị cho một quãng khó khăn về tiền bạc.'],
    ['career', 'Trong thời gian tới, công việc của tôi có điều gì cần lưu ý?',
     'Điều cần lưu ý trong thời gian tới là tiền bạc. Năm Tiền báo trước những trục trặc tài chính trong công việc, chẳng hạn lương tháng này chỉ được trả một phần hoặc khoản thanh toán cho một dự án bị chậm lại.'],
    ['other', 'Tôi kiềm chế phản ứng của mình bằng cách nào?',
     'Bạn không thể thay đổi những gì người khác nói hay làm với mình. Bạn cũng không kiểm soát được cảm xúc và suy nghĩ đầu tiên nảy lên trong đầu, vì đó là phản ứng tự nhiên. Nhưng mọi thứ sau khoảnh khắc đó, lời nói và hành động, đều nằm trong tay bạn. Dù đang rất bực bội hay tức giận, bạn vẫn có quyền chọn giữ bình tĩnh thay vì để cơn giận dẫn dắt. Đó là ý nghĩa của lời khuyên cân nhắc kỹ trước khi nói. Trước khi làm một điều mà bạn biết là tiêu cực, bạn hãy dừng lại vài giây và tự hỏi: vì sao mình muốn phản ứng như vậy, và mình có thật sự muốn sự việc đi theo hướng đó không?']
  ]
});

/* batch 14 - the four Sixes */
Object.assign(ASK.vi, {
  'wands-6': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Sáu Gậy thường chỉ một người có phần kiêu ngạo và tự mãn. Tuy nhiên, bạn cần đọc lá này cùng các lá xung quanh. Khi Sáu Gậy đi cùng Mặt Trời, cách hiểu thay đổi: đây là người thật sự có năng lực, đặt ra mục tiêu nào là đạt được mục tiêu đó, và gặt hái thành tựu thực sự trong cuộc sống. Mặt Trời mang năng lượng tích cực và truyền sang Sáu Gậy. Trong trường hợp đó, họ có thể vẫn kiêu ngạo, nhưng sự kiêu ngạo ấy có cơ sở.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Với câu hỏi này, Sáu Gậy không phải là dấu hiệu tốt. Người ấy có thể xem việc chinh phục bạn như một trò chơi, và sự thật lòng của họ vẫn là dấu hỏi.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Điều Sáu Gậy chỉ ra là cái tôi đang chen vào giữa hai bạn. Các cuộc cãi vã đã biến thành cuộc đua hơn thua: hôm qua họ nói bạn một câu, hôm nay bạn phải tìm cho được lỗi của họ để đáp lại. Bạn cãi với tâm thế phải thắng trong mỗi tranh luận, phải ở thế trên trong mối quan hệ và không bao giờ cho phép mình nhún nhường. Nhưng thứ hiếu thắng ấy thường chỉ là sự trẻ con và một lòng tự tôn không cần thiết. Trước khi nghĩ đến chia tay, bạn nên nhìn lại xem mình đang bảo vệ mối quan hệ hay chỉ đang bảo vệ cái tôi.'],
    ['career', 'Tôi đang thất nghiệp, thời gian tới tôi có tìm được việc không?',
     'Câu trả lời nghiêng về có, nhưng lá này kèm theo một lời cảnh báo. Người mang năng lượng Sáu Gậy dễ xem việc có được công việc là đích đến cuối cùng. Sau vài ngày đầu hào hứng, họ bắt đầu lơ là, không trau dồi kỹ năng, không học thêm điều mới, làm việc qua loa và chủ quan. Hậu quả là họ có thể mất việc thêm một lần nữa. Vì vậy, bạn hãy nhớ rằng tìm được việc chỉ là bước đầu. Không có vị trí nào là vĩnh viễn, và sự ổn định chỉ đến khi bạn tiếp tục nỗ lực sau khi đã được nhận.'],
    ['career', 'Trong thời gian tới, công việc của tôi có điều gì cần lưu ý?',
     'Thời gian tới, bạn sẽ đạt được một thành tựu nhất định trong công việc, nhưng đó là thành tựu ở quy mô nhỏ. Bạn có thể được cấp trên ghi nhận vì hoàn thành tốt một dự án hoặc được giao vai trò dẫn dắt một nhóm nhỏ, chứ không phải một bước nhảy vọt lên vị trí lãnh đạo. Điều cần lưu ý là cơ hội này đi kèm trách nhiệm và thử thách. Nếu bạn không đáp ứng được, bạn hoàn toàn có thể bị đưa trở lại vị trí cũ. Vì thế, bạn đừng chủ quan sau thành công nhỏ này mà hãy tiếp tục cố gắng.'],
    ['other', 'Chiến thắng của lá này khác gì so với Cỗ Chiến Xa và Mặt Trời?',
     'Trong bộ Ẩn Chính, có hai lá nói về chiến thắng. Cỗ Chiến Xa là chiến thắng phải trả giá: bạn đạt được điều mình muốn nhưng hy sinh những mặt khác của cuộc sống, chẳng hạn bỏ bê gia đình và người thân để theo đuổi sự nghiệp. Mặt Trời là thành công lớn và trọn vẹn. Sáu Gậy, với tư cách một lá Ẩn Phụ, chỉ là một thắng lợi nhỏ trên chặng đường. Hãy hình dung một người đang chuẩn bị cho một kỳ thi quan trọng: đỗ kỳ thi ấy là Mặt Trời, còn đạt điểm cao trong một bài kiểm tra thử là Sáu Gậy. Kết quả nhỏ đó mang lại niềm vui, lời khen và sự tự tin, nhưng nó không đảm bảo kết quả cuối cùng. Bạn vẫn phải tiếp tục nỗ lực cho đến ngày thi thật.'],
    ['other', 'Khi hai lá có cùng một từ khóa thì lá nào mạnh hơn?',
     'Theo nguyên tắc chung khi đọc bài, nếu hai lá mang cùng một từ khóa mà một lá thuộc Ẩn Chính và một lá thuộc Ẩn Phụ, thì lá Ẩn Phụ luôn nhẹ hơn về cả cường độ lẫn tần suất. Trong nội bộ Ẩn Phụ, số càng cao thì năng lượng càng mạnh. Như vậy, một lá số 3 nhẹ hơn một lá số 10, và ngay cả lá số 10 vẫn đứng dưới một lá Ẩn Chính.']
  ],
  'swords-6': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Sáu Kiếm không đủ để mô tả trọn vẹn tính cách một người, nên bạn hãy rút thêm lá. Điều lá này nói được là hoàn cảnh hiện tại của họ: họ vừa tự mình bước ra khỏi một tình huống, chẳng hạn chủ động kết thúc một mối quan hệ hoặc tự xin nghỉ việc. Vì vậy, tâm trạng của họ lúc này khá nặng nề và có phần cực đoan. Việc họ sớm hồi phục hay không tùy vào các lá đi kèm. Những lá tươi sáng cho thấy họ sẽ dần yêu đời trở lại; nếu không, giai đoạn u ám này có thể còn kéo dài.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Ở thời điểm này, chính người ấy có thể là người đang chủ động rời đi. Họ nhận ra mối quan hệ đã trở nên quá độc hại và đang muốn buông tay để thoát ra.'],
    ['love', 'Khi cãi nhau, tôi nên làm gì?',
     'Sáu Kiếm khuyên hai bạn nên tách ra một thời gian, và nói thẳng thì đó là chia tay. Lá này cho thấy mối quan hệ chỉ còn lại sự giày vò lẫn nhau. Hai bạn ở bên nhau vì thói quen chứ không phải vì tình cảm; những gì từng là yêu thương giờ đã nhạt thành nếp cũ, và thay vào đó là sự khó chịu, bắt lỗi và làm khổ nhau. Triển vọng của mối quan hệ này không sáng sủa.'],
    ['love', 'Nếu tôi rời đi rồi lại quay về thì sao?',
     'Đây là tình huống khá phổ biến. Nhiều người đã làm được bước khó nhất là rời khỏi một mối quan hệ độc hại, nhưng rồi không chịu nổi sự cô đơn và không vượt qua được chính mình, nên quay lại chốn cũ. Với họ, một mối quan hệ tồi vẫn dễ chịu hơn việc ở một mình. Chuyện công việc cũng vậy: người ta chấp nhận ở lại một môi trường độc hại vì sợ cảm giác thất nghiệp, sợ chỗ mới không bằng chỗ cũ, sợ người mới không tốt bằng người cũ. Nhưng bạn hãy suy nghĩ thế này. Nếu người cũ hay công việc cũ thật sự tốt, bạn đã không nảy ra ý định rời đi ngay từ đầu. Và nếu điều mới tệ hơn, bạn hoàn toàn có thể rời đi thêm một lần nữa. Buông bỏ một người hay một công việc không phải là tận cùng của cuộc sống.'],
    ['career', 'Tôi đã thất nghiệp mấy tháng, tôi có tìm được công việc như ý không?',
     'Sáu Kiếm chỉ ra rằng bạn đang tìm việc trong vùng an toàn quen thuộc của mình, và chính điều đó khiến bạn bị từ chối hết lần này đến lần khác. Ví dụ, một người có bằng cấp trong một ngành nhất định liên tục nộp hồ sơ vào đúng ngành ấy mà không nhận ra con đường của mình đã nằm ở nơi khác. Lá này yêu cầu bạn nhận ra và buông bỏ: lĩnh vực bạn đang bám vào không còn dành cho bạn, và bạn cần rời khỏi nó. Đôi khi tình huống đảo ngược cũng xảy ra, khi bạn thật sự giỏi ở lĩnh vực của mình nhưng lại bị cuốn theo một nghề khác trông hào nhoáng hơn, dù lý trí đã cho biết rằng nó không hợp với bạn.'],
    ['career', 'Thời gian tới, công việc của tôi có thay đổi gì không?',
     'Có thể bạn sẽ phải di chuyển hoặc rời khỏi vị trí hiện tại. Bên ngoài, bạn nói rằng công việc không có biến động gì, nhưng Sáu Kiếm nói về một sự bất an âm ỉ trong lòng bạn từ lâu. Bạn đã cảm thấy công việc không còn phù hợp và muốn thoát ra, nhưng bạn vẫn chờ một biến cố đủ lớn để có cớ rời đi. Câu hỏi đặt ra là: nếu biến cố ấy không bao giờ đến, bạn sẽ ở lại mãi sao? Điều bạn đang chịu đựng không phải là một cơn đau lớn mà là một cơn đau dai dẳng ngày này qua ngày khác, đủ để làm bạn mệt mỏi và ảnh hưởng đến mọi mặt của cuộc sống. Lá này khuyên bạn chấp nhận đau một lần để chấm dứt hẳn.']
  ],
  'cups-6': [
    ['other', 'Lá này có phải là "người cũ quay về" không?',
     'Trong hệ thống Tarot gốc, không có lá nào được định nghĩa là "người cũ quay về". Việc nhiều người đọc Sáu Cốc theo hướng đó xuất phát từ quy ước riêng của họ, và điều này hoàn toàn bình thường. Khi học Tarot, bạn bắt đầu bằng từ khóa của người khác, nhưng qua thời gian và qua trải nghiệm thực tế, bạn sẽ hình thành những từ khóa và nguyên tắc của riêng mình cho từng lá. Không ai có quyền cấm bạn sáng tạo trong Tarot. Thước đo duy nhất là kết quả: cả trải bài truyền tải đúng thông điệp, và người hỏi được chữa lành sau buổi đọc. Đó mới là mục đích quan trọng nhất.'],
    ['other', 'Vậy ý nghĩa thật sự của lá này là gì?',
     'Ý nghĩa cốt lõi của Sáu Cốc là một tình cảm trong trẻo và đơn thuần, và thường là một tình cảm mới. Nếu người cũ có quay lại thật, thì theo tinh thần của lá này, tình cảm giữa hai người phải được xây lại từ đầu như một khởi đầu hoàn toàn mới. Cả hai như thể gác lại quá khứ, đã thay đổi sâu sắc và trở thành hai con người khác so với trước. Lá này không nói về việc quay lại rồi tiếp tục lặp lại những tổn thương và độc hại cũ.'],
    ['other', 'Khi tôi tự xem bài cho mình thì kết quả có chính xác không?',
     'Bạn cần hết sức thận trọng. Khi bạn chưa được chữa lành, đang mất cân bằng hoặc đang đau khổ vì tình cảm, trải bài tự đọc sẽ bị nhuốm màu chủ quan. Chẳng hạn, một người đang mong người cũ quay lại sẽ có xu hướng đọc bất kỳ lá nào rút được, không riêng gì Sáu Cốc, thành dấu hiệu rằng người ấy sắp trở về. Vì lý do đó, khi học ý nghĩa các lá, bạn nên giữ nghĩa rộng và trung lập, thay vì gắn mỗi lá vào một tình huống quá cụ thể.'],
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Sáu Cốc mô tả một người trong sáng và ngây thơ, có phần khờ khạo theo nghĩa đáng yêu chứ không phải nông nổi. Tình cảm họ dành cho bạn cũng thuần khiết như vậy và không có tính toán. Có thể bạn là mối tình đầu của họ, hoặc việc yêu bạn khiến họ bồi hồi như lần đầu biết yêu. Điều chắc chắn là họ không đến với bạn vì địa vị, hoàn cảnh gia đình hay tài sản của bạn.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Thay vì chia tay, Sáu Cốc gợi ý hai bạn làm mới mối quan hệ. Lá này mô tả một cặp đôi đã ở bên nhau lâu và đã đánh mất sự lãng mạn cùng những bất ngờ nhỏ. Hãy hình dung sự thay đổi: ngày trước, một người sẵn sàng bỏ nhiều ngày để chuẩn bị một buổi tối kỷ niệm, còn bây giờ, món quà chỉ là một khoản tiền kèm câu "em tự mua gì em thích". Sự chân thành và vô tư như thuở ban đầu đã nhường chỗ cho trách nhiệm và nghĩa vụ, và khi mối quan hệ chỉ còn là nghĩa vụ, hai người dễ thấy khó chịu với nhau. Lời khuyên là tìm lại cảm xúc của những ngày đầu.'],
    ['career', 'Trong thời gian sắp tới, tôi có tìm được công việc như ý không?',
     'Câu trả lời nghiêng về có, và hơn thế, công việc này còn hợp với sở thích của bạn. Tuy nhiên, bạn cần nhớ đặc điểm chung của bộ Cốc: nó nói về sự yêu thích và thỏa mãn, chứ không nói về tiền bạc hay danh tiếng. Muốn biết thu nhập và địa vị có đi kèm hay không, bạn phải xem thêm các lá khác. Điều ngược lại cũng đúng. Nếu một trải bài về công việc chỉ toàn lá Tiền, thì thu nhập có thể cao nhưng bạn chưa chắc thích công việc đó. Một người có thể giữ vị trí lương cao mà không hề hạnh phúc, trong khi một người khác làm nghề thu nhập khiêm tốn hơn nhưng yêu thích nó mỗi ngày.'],
    ['career', 'Trong thời gian tới, công việc của tôi có thay đổi gì không?',
     'Sáu Cốc cho thấy bạn vẫn yêu thích công việc hiện tại, và cảm giác ấy sẽ được duy trì trong thời gian tới. Công việc này từ đầu đã mang lại cho bạn một niềm vui rất hồn nhiên, giống như niềm vui của một đứa trẻ khi được làm điều nó thích: nó chỉ đơn giản là say sưa làm mà không cần lý do.']
  ],
  'pentacles-6': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Sáu Tiền thuộc bộ Tiền, bộ của những thứ hữu hình và đo đếm được, nên người mang năng lượng này rất thực tế. Họ cẩn trọng, cân nhắc thiệt hơn trong mọi việc, và khi giúp ai, họ cũng xem xét liệu mình có nhận lại được gì hay không. Người khác có thể chê họ tính toán. Nhưng hãy nhìn từ một góc khác: một gia đình có người quản lý chi tiêu như vậy sẽ hiếm khi rơi vào cảnh thiếu thốn. Ngược lại, một người hào phóng đến mức cho đi tất cả những gì mình có, rồi để người thân ở nhà chịu thiếu thốn, chưa chắc đã tốt cho gia đình. Người Sáu Tiền vẫn cho, nhưng họ chỉ cho một phần nhỏ trong những gì mình có, và họ thường muốn việc cho đi ấy được người khác nhìn thấy.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Người ấy vẫn đối xử tốt với bạn, vẫn yêu thương và chiều chuộng bạn. Nhưng bạn cảm nhận được rằng phía sau sự chiều chuộng đó có một động cơ nào đó, và tình cảm này không hoàn toàn vô điều kiện. Có thể họ nhìn thấy ở bạn một điều gì đó mà họ sẽ nhận lại được, chẳng hạn hoàn cảnh gia đình hay tài sản. Tuy nhiên, bạn không nên vội lên án, vì mức độ mới là điều quan trọng. Người Sáu Tiền không đến mức lợi dụng bạn. Với họ, một mối quan hệ phải là sự trao đổi công bằng: tôi cho bạn sự quan tâm và tình cảm, thì tôi cũng mong nhận lại sự tôn trọng và quan tâm tương xứng. Bản chất của Sáu Tiền là công bằng. Chỉ có điều sự tính toán tỉ mỉ ấy đôi khi khiến người xung quanh cảm thấy họ thiếu chân thành.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Trước khi quyết định chia tay, Sáu Tiền khuyên bạn đặt mọi thứ lên bàn cân. Có thể bạn đang chỉ nhìn vào những điểm tiêu cực của mối quan hệ. Bạn hãy so sánh một cách công bằng: những gì họ đã làm cho bạn và những gì họ gây ra cho bạn, bên nào nặng hơn? Một thói quen nhỏ gây khó chịu, chẳng hạn hay quên trả lời tin nhắn, không phải là lý do đủ lớn để rời bỏ một người luôn quan tâm và cố gắng ở bên bạn. Đó chỉ là một khuyết điểm nhỏ trong một bức tranh lớn hơn nhiều.'],
    ['love', 'Còn nếu mối quan hệ đã quá độc hại thì sao?',
     'Khi đó, lời khuyên của lá này vẫn là đặt lên bàn cân, nhưng kết quả sẽ khác. Bạn hãy so sánh những điều tốt họ làm cho bạn với những tổn thương họ gây ra. Nếu sự chiều chuộng chỉ là vài món quà, còn phía bên kia là bạo lực hay những tổn hại nghiêm trọng đến thể chất và tinh thần, thì cán cân đã rất rõ ràng và không có món quà nào bù đắp được. Sáu Tiền khuyên người hỏi hãy lý trí. Trong cuộc sống, sự tính toán thiệt hơn đôi khi là cần thiết. Người sống hoàn toàn theo cảm tính thường gặp nhiều rắc rối và dễ đưa ra quyết định sai lầm, còn người biết cân nhắc một chút sẽ có cuộc sống an toàn hơn.'],
    ['career', 'Tôi đã thất nghiệp vài tháng, thời gian tới tôi có tìm được việc không?',
     'Câu trả lời nghiêng về có, và cơ hội đến qua sự giúp đỡ của một người khác. Điểm cần lưu ý là người giúp bạn mong đợi bạn sẽ đền đáp về sau. Điều này không có nghĩa là bạn phải từ chối. Bạn hãy đón nhận sự giúp đỡ, và khi có điều kiện, hãy đáp lại một cách xứng đáng.'],
    ['career', 'Trong thời gian tới, công việc của tôi có điều gì cần lưu ý?',
     'Thời gian tới, bạn sẽ nhận được sự giúp đỡ hoặc một cơ hội từ người khác. Tuy nhiên, Sáu Tiền cho thấy cơ hội này không hoàn toàn miễn phí: về sau, bạn sẽ được kỳ vọng đáp lại điều gì đó. Ví dụ, một người có thể giúp bạn vì biết gia đình bạn có mối quan hệ với cấp trên của họ, với hy vọng rằng sự giúp đỡ ấy sẽ được ghi nhận và sau này mang lại lợi ích cho con đường thăng tiến của họ.']
  ]
});

/* batch 15 - the four Sevens */
Object.assign(ASK.vi, {
  'wands-7': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Bảy Gậy có thể mô tả một người luôn trong thế phòng thủ. Họ dễ cảm thấy mình bị soi xét hoặc phải tự bảo vệ, nên đôi khi phản ứng mạnh trước khi hiểu rõ ý của người khác. Ở mặt bóng, trạng thái này khiến họ dễ tranh cãi, căng thẳng và tiêu tốn năng lượng vào những cuộc đối đầu không cần thiết.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Lá này không cho biết rõ họ yêu bạn nhiều hay ít. Nó nói nhiều hơn về trạng thái của họ: đang căng thẳng, phòng thủ hoặc mang theo những tổn thương chưa được xử lý. Điều đáng nhìn không phải là “họ có vết thương hay không”, mà là họ có nhận ra và chịu trách nhiệm cho cách mình cư xử hay không. Bạn không có trách nhiệm chữa lành thay cho họ.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Những cuộc cãi vã mà lá bài nói đến thường xoay quanh những chuyện rất nhỏ. Một bên trách móc đối phương về việc đi chơi về muộn, quên nhắn tin hay không gọi điện đúng lúc, và đòi hỏi người kia phải thay đổi hết điều này đến điều khác. Trong khi đó, bên trách móc lại quên nhìn lại chính mình, dù bản thân cũng nhiều lần bỏ lỡ tin nhắn hoặc đi chơi với người khác mà không báo trước. Lá bài không khuyên chia tay ngay. Thay vào đó, bạn hãy thử là người thay đổi trước. Nếu đối phương nhận ra sự thay đổi đó, trân trọng nó và thay đổi theo, mối quan hệ này xứng đáng để đi tiếp. Nếu họ nhìn thấy nhưng vẫn giữ nguyên cách cư xử, khi đó bạn có đủ cơ sở để tự quyết định dừng lại.'],
    ['career', 'Trong thời gian tới, tôi có tìm được việc không?',
     'Bạn hãy nhớ lại một nguyên tắc chung của bộ Ẩn Phụ: các lá này nói về những vấn đề nhỏ do chính người hỏi tạo ra, nên người hỏi cũng có thể tự giải quyết. Theo Bảy Gậy, lý do bạn chưa tìm được việc nằm ở cách bạn dùng thời gian và sức lực của mình. Có thể bạn đang dồn năng lượng vào những chuyện không mang lại kết quả và chưa thật sự tập trung cho việc tìm việc. Cũng có thể bạn đang nộp hồ sơ vào những ngành không phù hợp với mình. Mỗi người chỉ có một quỹ thời gian và năng lượng nhất định. Khi bạn phân bổ quỹ đó hiệu quả hơn, cơ hội việc làm sẽ đến gần hơn.'],
    ['career', 'Trong thời gian tới, công việc của tôi có gì mới không?',
     'Điều mới ở đây có thể là những chuyện thị phi nơi công sở, và có người sẽ tìm cách kéo bạn vào. Lời khuyên của lá bài là bạn đừng để mình bị cuốn theo. Người khác có thể lôi kéo, nhưng quyền quyết định tham gia hay không vẫn thuộc về bạn. Khi nghe thấy mình bị nói xấu, phản ứng đầu tiên của nhiều người là muốn đáp trả bằng cách nói xấu lại. Một người bình tĩnh hơn sẽ bỏ ngoài tai, vì lời bàn tán đó không làm thu nhập của họ thay đổi và không đáng để họ bận tâm. Bạn đến công ty để làm việc và kiếm tiền, không phải để tham gia vào những cuộc xung đột nội bộ hay gây chiến với ai.'],
    ['other', 'Vậy tôi cần phải chiến đấu với ai?',
     'Câu trả lời là bạn không cần chiến đấu với bất kỳ ai bên ngoài. Đối thủ lớn nhất trong đời bạn chính là bản thân bạn, chứ không phải cấp trên, đồng nghiệp, bạn học hay một người cụ thể nào. Bạn không nên tự nhủ rằng mình phải đối đầu với cả thế giới. Thay vì luôn tìm nguyên nhân và giải pháp ở bên ngoài, bạn hãy thử thay đổi chính mình trước. Nếu ở nơi làm việc nào bạn cũng gặp đúng một loại rắc rối, việc nhảy việc để tìm một chỗ hoàn hảo sẽ không giải quyết được gì, và điều đáng thử là thay đổi cách cư xử của mình. Tương tự, nếu bạn liên tục thay người yêu với hy vọng một ngày sẽ gặp người phù hợp, bạn cũng nên xem lại bản thân trước.']
  ],
  'swords-7': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Bảy Kiếm thường gợi đến sự kín đáo, né tránh hoặc hành động không hoàn toàn minh bạch. Ở mặt bóng, người mang năng lượng này có thể giấu thông tin, nói một đằng làm một nẻo hoặc chọn đường vòng thay vì đối thoại thẳng. Lá bài không tự động có nghĩa là ngoại tình hay lừa dối; cần nhìn thêm hoàn cảnh và các lá đi cùng.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Bảy Kiếm khiến câu hỏi này cần được kiểm chứng bằng thực tế hơn là suy đoán. Có thể người ấy đang giữ lại một phần thông tin, chưa nói hết về hoàn cảnh của mình hoặc chưa sẵn sàng minh bạch. Điều đó không đồng nghĩa chắc chắn có người thứ ba. Nếu mối quan hệ còn mơ hồ, hỏi thẳng về tình trạng hiện tại và quan sát sự nhất quán giữa lời nói với hành động sẽ hữu ích hơn việc tự kết luận.'],
    ['love', 'Chúng tôi cãi nhau nhiều, tôi có nên chia tay không?',
     'Bảy Kiếm gợi ra hai khả năng cho câu hỏi này. Khả năng thứ nhất là phía đối phương có người thứ ba. Khả năng thứ hai là không có người thứ ba trong tình cảm, nhưng có một bên thứ ba đang tác động từ phía sau. Đó có thể là bạn bè hoặc gia đình, những người liên tục khuyên bạn chia tay với lý do bạn xứng đáng với một người tốt hơn. Cả hai khả năng đều bắt nguồn từ bản chất của lá bài: mọi việc diễn ra ở phía sau hậu trường chứ không diễn ra trước mặt. Người mang năng lượng này khi không hài lòng với ai sẽ nói sau lưng chứ không nói thẳng.'],
    ['career', 'Tôi đã thất nghiệp lâu, sắp tới tôi có tìm được việc mới không?',
     'Lá này gợi ý có một yếu tố “ẩn” đang làm quá trình tìm việc kém hiệu quả. Đó có thể là lời khuyên từ người khác khiến bạn mất tự tin, một chiến lược tìm việc chưa phù hợp hoặc chính bạn đang né một bước cần làm. Hãy kiểm tra lại hồ sơ, cách ứng tuyển và những niềm tin đang ảnh hưởng đến bạn trước khi cho rằng có ai đó cố tình cản trở.'],
    ['career', 'Trong thời gian tới, công việc của tôi có biến cố gì không?',
     'Lá bài báo hiệu là có. Biến cố này mang tính chất bị chơi xấu từ phía sau: bạn có thể bị nói xấu sau lưng hoặc bị lôi vào chuyện thị phi. Một tình huống khác là bạn đang phấn đấu cho một vị trí quản lý hoặc trưởng nhóm, và có người cạnh tranh với bạn bằng những thủ đoạn thiếu lành mạnh thay vì cạnh tranh công khai và sòng phẳng. Đó chính là năng lượng của Bảy Kiếm. Một lá bài chỉ cho thấy một phần của bức tranh, nên nếu bạn muốn biết người đó là ai và mình nên làm gì, bạn cần rút thêm bài.'],
    ['other', 'Thao túng cảm xúc được hiểu như thế nào?',
     'Thao túng cảm xúc là khi một người cố tác động vào suy nghĩ, cảm giác hoặc quyết định của người khác để đạt mục đích cho mình, thường bằng cách che giấu ý định, gây tội lỗi, bóp méo sự việc hoặc tạo áp lực. Người thao túng không nhất thiết có “EQ cao”; họ chỉ có thể rất giỏi quan sát phản ứng của người khác. Dấu hiệu quan trọng là bạn liên tục cảm thấy bị ép, bị làm cho nghi ngờ chính mình hoặc khó nói “không” mà không bị trừng phạt về cảm xúc.']
  ],
  'cups-7': [
    ['other', 'Từ khóa của lá này là gì?',
     'Từ khóa của Bảy Cốc là có nhiều lựa chọn nhưng không có lựa chọn nào thật sự khiến bạn hài lòng. Hình ảnh trên lá bài đã gợi ý điều đó: những chiếc cốc hiện ra từ đám mây tối, và tổng thể lá bài khá trầm và u ám chứ không rực rỡ. Bạn có thể hình dung một người độc thân được nhiều người theo đuổi. Ngày nào cũng có người nhắn tin và muốn làm quen, nhưng người đó lại không có cảm tình với ai và không thể chọn ra một người để nghiêm túc.'],
    ['other', 'Lá này khác lá Tình Nhân và lá Hai Kiếm ở điểm nào?',
     'Trong bộ bài 78 lá, có ba lá cùng nói về trạng thái mông lung, nhưng nguyên nhân của mỗi lá khác nhau. Với Tình Nhân, bạn đứng trước hai lựa chọn và thích cả hai nên khó quyết. Với Hai Kiếm, bạn chần chừ và lưỡng lự vì không biết mình nên làm gì tiếp theo. Với Bảy Cốc, bạn có quá nhiều lựa chọn nhưng không lựa chọn nào khiến bạn thật sự muốn theo đuổi.'],
    ['other', 'Bạn có thể cho một ví dụ khác để dễ nhớ hơn không?',
     'Bạn có thể nghĩ đến một người trẻ đang chọn ngành học trước kỳ thi đại học. Trước mắt người đó có nhiều hướng đi, nhưng không hướng nào khiến họ thật sự khao khát. Mỗi lựa chọn chỉ có một lý do bên ngoài: một ngành làm vui lòng cha mẹ, một ngành có vẻ dễ xin việc, một ngành hợp với sở thích thuở nhỏ nhưng họ lại không muốn kiếm sống bằng nó. Rất nhiều cánh cửa mở ra, nhưng không cánh cửa nào khiến họ cảm thấy đây chính là con đường của mình. Đó là năng lượng của Bảy Cốc.'],
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Người mang năng lượng Bảy Cốc thiếu quyết đoán và hay phân vân. Họ thường để người khác quyết định thay mình vì không dám tự chọn con đường cho bản thân. Bản thân việc nghe theo quyết định của người khác không có gì sai. Vấn đề nằm ở chỗ khi đã đi trên con đường mà người khác chọn, họ lại cảm thấy không thỏa mãn. Vì vậy, người này cần chọn dứt khoát một trong hai hướng. Nếu họ muốn đi theo cách an toàn và để người khác quyết định, họ cần học cách bằng lòng với điều đó. Nếu họ không thể bằng lòng, họ cần tự chọn lấy con đường của riêng mình và chịu trách nhiệm với lựa chọn đó.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Với câu hỏi này, Bảy Cốc không phải là một lá bài đáng mừng. Nhiều khả năng bạn chỉ là một trong nhiều lựa chọn của họ ở thời điểm hiện tại, và họ đến với bạn với tâm thế tạm thời. Lá bài cũng gợi ý rằng tình cảm trong mối quan hệ này đang lệch về phía bạn. Có thể bạn là người có cảm tình trước, còn họ nhận lời chỉ vì lúc đó chưa có ai khác và muốn có người để khuây khỏa.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Bảy Cốc không đưa ra câu trả lời nên chia tay hay không. Lá bài chỉ phản ánh một xu hướng, và xu hướng này có thể đến từ bạn, từ đối phương hoặc từ cả hai. Cả hai đã khá mệt mỏi với mối quan hệ và bắt đầu nhìn ra bên ngoài để tìm người mới hoặc cơ hội mới. Vì chưa tìm được gì, hai người vẫn tiếp tục ở bên nhau. Một cách đọc đơn giản hơn là cả hai đang phân vân, lo lắng và cảm thấy mối quan hệ hiện tại thiếu chắc chắn. Dù đọc theo cách nào, khi Bảy Cốc xuất hiện, bạn vẫn nên lưu ý đến khả năng có sự để ý sang một người khác.']
  ],
  'pentacles-7': [
    ['other', 'Từ khóa của lá này là gì?',
     'Bảy Tiền nói về sự kiên trì, bền bỉ và nhẫn nại. Trên lá bài, một người đang đứng ngắm cái cây mà mình đã chăm sóc suốt một thời gian dài, và cây đó nay đã lớn và kết thành bảy đồng tiền. Đây là một lá bài trung lập, nên bạn có thể đọc theo hai hướng. Hướng thứ nhất là bài đang khuyên người hỏi cần kiên trì hơn, và lời khuyên đó thường có nghĩa là người hỏi đang thiếu kiên trì. Hướng thứ hai là bài xác nhận rằng bạn đang đi đúng hướng, nên bạn hãy tiếp tục cố gắng thêm một thời gian nữa để nhận được kết quả như ý.'],
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Đây là một người bền bỉ, nhẫn nại và có sức chịu đựng tốt. Điểm hạn chế của họ là đôi khi họ hơi chậm và thiếu chủ động. Trong những tình huống cần quyết định nhanh, họ thường lúng túng và không đủ dứt khoát.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Câu trả lời nghiêng về hướng có. Hơn thế nữa, lá bài cho thấy họ đã để ý và theo đuổi bạn từ rất lâu. Với họ, việc chinh phục bạn giống như chăm sóc một cái cây từ lúc gieo hạt. Khi hai người đến được với nhau, đó là lúc họ được hưởng thành quả của những gì mình đã vun đắp trong quá khứ.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Nguyên nhân mà Bảy Tiền chỉ ra là hai bạn đang thiếu nhẫn nại với nhau. Lá bài cũng gợi ý rằng mối quan hệ này đã kéo dài khá lâu và sự hào hứng ban đầu đã phai nhạt. Khi mới yêu, chúng ta thường bỏ qua mọi tính xấu của đối phương. Theo thời gian, chúng ta bắt đầu nhìn thấy những điểm đó rõ hơn và mất dần sự kiên nhẫn. Một phần nguyên nhân nằm ở sự chưa đủ chín chắn và chưa đủ trân trọng người kia. Chúng ta mong đối phương thay đổi vì mình, rồi bực bội khi họ không thay đổi nhiều như kỳ vọng, và cuối cùng trút sự cáu giận lên họ.'],
    ['love', 'Nếu người kia không thể thay đổi thì tôi nên làm gì?',
     'Trước hết, bạn nên tự đặt câu hỏi này một cách nghiêm túc, vì có những điều thuộc về bản chất của một con người. Những điều đó rất khó thay đổi, cần nhiều thời gian và phụ thuộc vào ý chí của chính người đó. Lời khuyên của Bảy Tiền là bạn hãy kiên nhẫn hơn với họ và với cả bản thân mình, đồng thời cho họ thêm thời gian. Nếu họ thấy yêu cầu của bạn là vô lý và chỉ đang cố gắng để làm bạn hài lòng, bạn không nên ép buộc. Thay vào đó, bạn hãy giúp họ nhìn thấy việc thay đổi đó mang lại lợi ích gì cho chính họ. Trong lúc bình tĩnh chờ đợi, bạn cũng nên suy nghĩ xem mình thật sự cần gì ở người kia và mình có thể đóng góp gì cho mối quan hệ này.'],
    ['career', 'Trong thời gian sắp tới, tôi có tìm được công việc như ý không?',
     'Câu trả lời nghiêng về hướng có. Những nỗ lực của bạn trong việc tìm việc, học tập và trau dồi bản thân sẽ được đền đáp xứng đáng. Tuy nhiên, công việc có thể chưa đến ngay, nên bạn cần giữ thêm một chút kiên nhẫn nữa.'],
    ['career', 'Trong thời gian tới, công việc của tôi sẽ thế nào?',
     'Bảy Tiền hứa hẹn thành quả, nhưng thành quả đó đến chậm và chắc chắn. Bạn cũng nên hiểu rằng đây không phải là lá bài của may mắn bất ngờ. Bạn bỏ ra bao nhiêu công sức thì sẽ nhận về đúng bấy nhiêu, chứ không nhận về gấp đôi. Chẳng hạn, nếu bạn đang mong được thăng chức ở công ty hiện tại, cơ hội đó sẽ đến nhưng không nhanh như bạn mong muốn. Bài học của lá bài là bạn hãy tiếp tục chăm chỉ và nhẫn nại ngay cả khi chưa nhìn thấy kết quả.'],
    ['other', 'Vì sao tôi phải kiên trì đến như vậy?',
     'Bảy Tiền nói về sự đều đặn hơn là bùng nổ. Hình ảnh trồng cây trên lá bài rất dễ nhớ: có những kết quả cần được chăm trong nhiều tuần hoặc nhiều tháng trước khi nhìn thấy rõ. Thay đổi thói quen cũng vậy; không có một con số ngày cố định đúng cho tất cả mọi người. Điều quan trọng là lặp lại đủ lâu và điều chỉnh cách làm khi cần.']
  ]
});

/* batch 16 - the four Eights (keywords and readings together) */

Object.assign(ASK.vi, {
  'wands-8': [
    ['other', 'Từ khóa của lá này là gì?',
     'Tám Gậy có hai ý nghĩa chính, và cả hai đều bắt nguồn từ hình ảnh tám cây gậy đang bay vút trên bầu trời. Ý thứ nhất là tốc độ: điều gì sắp đến sẽ đến rất nhanh. Ý thứ hai là sự di chuyển và thay đổi về khoảng cách địa lý. Bạn có thể so sánh lá này với lá Thế Giới trong bộ Ẩn Chính, vì cả hai đều nói về việc đi lại. Thế Giới thường được hiểu là đi ra nước ngoài, còn Tám Gậy chỉ nói rằng có sự di chuyển, có thể gần hoặc xa, chẳng hạn từ thành phố này sang một thành phố khác trong nước. Bản thân lá bài mang tính trung lập, vì có lúc chúng ta cần nhanh và có lúc chúng ta cần chậm lại.'],
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Đặc điểm nổi bật nhất của người này là tốc độ. Họ suy nghĩ nhanh, nói nhanh, đi lại nhanh và làm việc gì cũng nhanh. Đây cũng có thể là người thích làm nhiều việc cùng lúc vì muốn mọi thứ xong sớm, chẳng hạn vừa trả lời tin nhắn công việc vừa họp vừa xử lý một việc khác. Điểm yếu của họ nằm ở chính tốc độ đó, vì làm việc quá nhanh thì rất dễ sai sót. Các nghiên cứu cho thấy khi tập trung vào một việc, chúng ta làm nhanh hơn và ít lỗi hơn. Nếu làm nhiều việc cùng lúc và mắc nhiều lỗi, chúng ta phải quay lại làm từ đầu và cuối cùng tốn thời gian hơn. Vì vậy, người này cần học cách chậm lại.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Tình cảm ở đây có thể đến rất nhanh và rất mạnh, nhưng tốc độ không cho biết nó sẽ bền hay chóng tàn. Hai người có thể đang bị cuốn bởi sự mới mẻ và hình ảnh mình tưởng tượng về nhau. Hãy cho mối quan hệ thêm thời gian để xem cảm xúc đó có đi cùng sự hiểu biết, nhất quán và cam kết hay không.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Lời khuyên của lá bài không phải là chia tay, mà là cả hai cần bình tĩnh lại. Gậy mang năng lượng của lửa, và Tám Gậy còn cộng thêm tốc độ. Lửa cháy nhanh có nghĩa là cả hai đều có thể nóng nảy, bốc đồng và không ai chịu lắng nghe ai. Người mang năng lượng này thường kết luận rất vội. Chỉ từ một hai dấu hiệu nhỏ, họ đã cho rằng đối phương hết yêu mình hoặc đang muốn phản bội mình, rồi thay đổi cách cư xử cho khớp với kết luận đó, dù sự thật có thể hoàn toàn khác. Một người điềm tĩnh hơn sẽ quan sát, thu thập đủ thông tin và thậm chí hỏi thẳng đối phương trước khi kết luận. Vì vậy, hai bạn nên nhìn lại bản thân và mối quan hệ, rồi ngồi xuống nói chuyện một cách bình tĩnh thay vì to tiếng với nhau.'],
    ['career', 'Tôi đang thất nghiệp, thời gian tới tôi có tìm được việc không?',
     'Câu trả lời nghiêng về hướng có, và Tám Gậy nói thêm hai điều về công việc này. Thứ nhất, tin tốt có thể đến rất nhanh, thậm chí chỉ trong vài ngày sau khi bạn đặt câu hỏi. Thứ hai, công việc này gắn với sự di chuyển. Nó có thể ở một thành phố khác, hoặc đòi hỏi bạn phải đi lại nhiều, chẳng hạn quãng đường đi làm mỗi ngày khá xa. Cũng có thể đó là một công việc mà bản chất của nó là di chuyển thường xuyên.'],
    ['career', 'Trong thời gian tới, công việc của tôi có vấn đề gì không?',
     'Trong thời gian tới, có thể một sự kiện nào đó sẽ đến với bạn rất nhanh. Một lá bài chưa đủ để nói sự kiện đó là gì, nên bạn cần rút thêm bài để biết cụ thể. Ngoài ra, lá bài còn gợi ý về sự di chuyển trong công việc. Bạn có thể có một chuyến công tác trong nước, được luân chuyển sang bộ phận khác, hoặc đơn giản là đổi chỗ ngồi, chẳng hạn chuyển sang ngồi cạnh để hướng dẫn một nhân viên mới.']
  ],
  'swords-8': [
    ['other', 'Từ khóa của lá này là gì?',
     'Ba từ khóa của Tám Kiếm là bế tắc, trói buộc và mất tự do. Nhân vật trên lá bài bị bịt mắt, bị trói và bị tám thanh kiếm vây quanh. Người đó muốn đi làm, đi học hay yêu đương đều cảm thấy không thể. Tuy nhiên, khi nhìn kỹ, bạn sẽ thấy dây trói rất lỏng và có thể tuột ra bất cứ lúc nào. Vòng kiếm cũng chỉ vây một nửa, còn phía trước vẫn có lối đi. Điều đó có nghĩa là người này hoàn toàn có thể tự cởi trói, tháo băng bịt mắt và bước ra ngoài. Việc họ có làm vậy hay không lại là một chuyện khác.'],
    ['other', 'Vậy ai là người đã trói người đó?',
     'Tám Kiếm thường nói về cảm giác bị mắc kẹt và những niềm tin khiến ta khó nhìn thấy lối ra. Đôi khi rào cản nằm trong suy nghĩ của chính mình, nhưng cũng có lúc hoàn cảnh bên ngoài là có thật. Lá bài không bảo bạn tự trách mình; nó hỏi phần nào bạn có thể tác động, phần nào cần hỗ trợ, và bước nhỏ nào giúp bạn lấy lại quyền lựa chọn.'],
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Lá này có thể mô tả một người hay lo và dễ mắc kẹt trong những suy nghĩ giới hạn bản thân. Khi căng thẳng, họ có xu hướng nhìn thấy rủi ro trước cơ hội và khó tin rằng mình có lựa chọn. Đây là một trạng thái có thể thay đổi, không phải bản chất cố định của một con người.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Câu trả lời nghiêng về hướng họ có tình cảm với bạn. Vấn đề là họ đang tự ngăn mình đến với bạn, vì một tổn thương trong quá khứ hoặc vì những suy nghĩ tiêu cực của chính họ. Bạn có thể hình dung một người tin rằng hoàn cảnh của mình là một nhược điểm lớn và mình sẽ không bao giờ xứng đáng được yêu. Khi gặp một người thật lòng quan tâm và không hề để ý đến hoàn cảnh đó, họ vẫn tự nhủ rằng người kia sẽ không yêu mình được lâu. Với suy nghĩ đó, chính họ là người đẩy đối phương ra xa.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Lá bài chưa nói hai bạn phải chia tay. Nó nhấn mạnh cảm giác bế tắc và cách suy nghĩ có thể làm vấn đề trông tuyệt vọng hơn thực tế. Hãy tách điều bạn biết chắc khỏi điều bạn đang suy đoán, nhìn cả phần trách nhiệm của mình lẫn những giới hạn thật từ phía đối phương. Nếu có kiểm soát, đe dọa hoặc bạo lực, vấn đề không chỉ nằm ở “cách nhìn”; an toàn và hỗ trợ bên ngoài cần được ưu tiên.'],
    ['love', 'Bạn có thể cho một ví dụ về việc thay đổi cách nhìn không?',
     'Bạn hãy hình dung một tình huống ở nơi làm việc: một đồng nghiệp nói xấu bạn dù bạn chưa từng làm gì họ. Có người sẽ tự dằn vặt rằng mình đã sai ở đâu, rồi kết luận rằng mình phải trả đũa bằng cách nói xấu lại. Có người lại chìm trong buồn bực, luôn tự hỏi tại sao mọi người đối xử với mình như vậy và tại sao ai cũng muốn hại mình. Cả hai cách phản ứng đều khiến bạn bị trói bởi chính suy nghĩ tiêu cực của mình. Ngược lại, một người khác có thể tự thoát ra khỏi sợi dây đó bằng một cách nhìn nhẹ nhàng hơn. Họ xem đó là chuyện nhân quả, tin rằng điều gì đến thì sẽ đến, và nếu mình không làm gì sai mà vẫn bị hại thì người kia sẽ tự nhận lấy hậu quả của họ. Với cách nhìn này, họ không thấy cần phải trả thù.'],
    ['career', 'Trong thời gian tới, tôi có tìm được việc mới không?',
     'Lá bài nghiêng về một giai đoạn tìm việc còn vướng, nhưng không có nghĩa nguyên nhân hoàn toàn nằm ở bạn. Có thể bạn đang tự giới hạn lựa chọn vì thiếu tự tin, đồng thời thị trường hoặc hoàn cảnh thực tế cũng chưa thuận. Hãy kiểm tra lại những vị trí bạn đang tự loại mình khỏi, xin phản hồi về hồ sơ và mở rộng hướng tìm kiếm nếu phù hợp.'],
    ['career', 'Trong thời gian tới, công việc của tôi có điều gì cần lưu ý?',
     'Bạn nói rằng công việc vẫn bình thường, nhưng lá bài cho thấy có điều gì đó đang khiến bạn cảm thấy bế tắc ở nơi làm việc. Một ví dụ thường gặp là mối quan hệ với cấp trên. Bạn đã thử nhiều cách, từ mềm mỏng đến cứng rắn, nhưng vẫn không được người đó quý mến, và suy nghĩ về chuyện này đeo bám bạn suốt một thời gian dài. Với Tám Kiếm, thời gian tới nhiều khả năng sẽ không có sự kiện nào đáng kể. Thay vào đó, lá bài muốn bạn nhìn lại bản thân để xem có vấn đề nào cần giải quyết hoặc suy nghĩ nào cần buông bỏ. Khi tự cởi trói cho mình, bạn sẽ có một môi trường làm việc tích cực hơn.']
  ],
  'cups-8': [
    ['other', 'Từ khóa của lá này là gì?',
     'Từ khóa của Tám Cốc là chủ động rời đi. Điều đặc biệt là bạn rời đi khi mọi thứ vẫn đang tốt đẹp. Mọi người đối xử tốt với bạn, môi trường không có gì đáng chê, và bạn còn được hứa hẹn cơ hội thăng tiến mà bạn biết sẽ thành hiện thực. Dù vậy, bạn vẫn chọn ra đi vì bạn hiểu rằng con đường của mình rẽ sang một hướng khác. Bạn tạm biệt họ với sự trân trọng và có thể gặp lại nhau khi rảnh rỗi, nhưng thời điểm rời đi đã đến.'],
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Tám Cốc không phải là lá bài dễ dùng để mô tả tính cách, nên bạn nên rút thêm bài. Nếu chỉ có một lá này, bạn có thể đọc theo hướng sự kiện: gần đây người đó vừa trải qua một chuyện mang năng lượng Tám Cốc. Họ đã phải bỏ lại sau lưng những điều từng rất quan trọng với mình để bắt đầu một hành trình mới. Ở thời điểm rời đi, bất kỳ ai cũng buồn, nuối tiếc và do dự, nhưng họ vẫn quyết định bước tiếp. Sự kiện đó có thể đang ảnh hưởng đến tính cách và tâm trạng của họ ở hiện tại.'],
    ['love', 'Tình cảm của người đó dành cho tôi có thật lòng hay không?',
     'Tình cảm của họ có thể là thật, nhưng ở thời điểm này họ đang hướng về một con đường khác. Hình ảnh của lá bài giống như bạn đang đứng nhìn người đó quay lưng bước đi và để bạn ở lại. Vì vậy, dù có tình cảm, họ sẽ không tiến tới với bạn lúc này. Họ biết mình có một ước mơ hoặc một hành trình riêng, và hành trình đó không thể gắn với bạn. Chẳng hạn, một người muốn bắt đầu mối quan hệ nhưng sắp phải đi làm việc ở nơi xa trong nhiều năm, nên chọn không bắt đầu để không làm khổ cả hai.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Tám Cốc cho thấy ít nhất một người đang nghĩ nghiêm túc về việc rời đi hoặc cần một hướng sống khác. Điều đó làm khả năng chia xa cao hơn, nhưng không biến chia tay thành kết cục chắc chắn. Hai người cần nói thẳng về điều mỗi người đang muốn, phần nào còn có thể cùng xây và phần nào đã khác nhau quá xa.'],
    ['career', 'Tôi đã thất nghiệp ba tháng, tôi có tìm được công việc như ý không?',
     'Điều kiện để bạn tìm được công việc như ý là bạn phải buông bỏ cảm giác tiếc nuối mà lá bài đang chỉ ra. Có thể bạn chỉ tìm việc trong một vài ngành nhất định, vì bạn đã học ngành đó và đã bỏ nhiều thời gian cho nó, nên bạn không muốn chuyển hướng. Cảm giác đó rất dễ hiểu, bởi những chiếc cốc trong Tám Cốc vẫn còn đầy và việc bỏ lại chúng đương nhiên gây tiếc nuối. Tuy nhiên, nếu bạn tiếp tục giữ nguyên cách tìm việc như hiện nay, bạn sẽ khó tìm được việc.']
  ],
  'pentacles-8': [
    ['other', 'Từ khóa của lá này là gì?',
     'Tám Tiền nói về sự chăm chỉ, tỉ mỉ, kỹ lưỡng và cẩn thận, và thường là làm việc một mình. Hình ảnh trên lá bài là một người thợ đang chạm khắc từng đồng tiền. Loại công việc này không thể làm vội cho xong, mà đòi hỏi sự tỉ mỉ trong từng chi tiết. Để hoàn thành cả tám đồng tiền, người thợ phải có sự bền bỉ và kiên trì rất lớn.'],
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Đây là một người tỉ mỉ, chăm chỉ và cầu toàn, có thể đến mức theo chủ nghĩa hoàn hảo. Họ làm việc một mình hiệu quả hơn là làm việc với nhiều người, và năng lượng này thường được liên hệ với cung Xử Nữ. Nhược điểm của họ là đôi khi không nhìn được bức tranh toàn cảnh. Họ có xu hướng soi lỗi, chỉ thấy phần còn thiếu và phần sai sót, nên không thể tận hưởng toàn bộ những gì mình đang có.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Câu trả lời nghiêng về hướng có, nhưng người này có xu hướng phân tích rất kỹ trước khi tiến tới. Họ để ý đến sự phù hợp trong đời sống thực tế, thói quen và tương lai lâu dài. Sự cẩn thận có thể hữu ích, nhưng nếu biến thành việc soi từng khuyết điểm thì mối quan hệ sẽ khó có cơ hội phát triển tự nhiên.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Nguyên nhân của những cuộc cãi vã là một trong hai người, hoặc cả hai, có xu hướng soi lỗi của nhau thay vì nhìn vào những điều đối phương đã làm cho mình. Họ giận hờn vì những chuyện rất nhỏ, chẳng hạn cách ăn mặc của đối phương hay một nụ cười xã giao với người khác. Đó là những chuyện không đáng để tranh cãi. Bên cạnh đó, một hoặc cả hai người còn để ý quá mức đến đời tư của nhau, từ việc ai đã thích một bức ảnh trên mạng xã hội cho đến việc đối phương xem bài đăng mà không nhắn tin.'],
    ['career', 'Trong thời gian tới, tôi có tìm được việc không?',
     'Câu trả lời là có, và công việc mới sẽ mang những đặc điểm của lá bài. Thứ nhất, bạn sẽ có xu hướng làm việc độc lập. Thứ hai, công việc đòi hỏi sự tỉ mỉ cao và tinh thần chăm chỉ. Đó là loại công việc không thể hoàn thành trong một lần, mà bạn phải làm cẩn thận từng chút một trong nhiều ngày liền, giống như người thợ đang chạm khắc. Công việc này cũng có thể liên quan đến con số và sổ sách, chẳng hạn kế toán hoặc kiểm toán. Những công việc như vậy cần nhiều sức bền, và bạn phải tiến từng bước một.'],
    ['career', 'Trong thời gian tới, công việc của tôi có thay đổi gì không?',
     'Với Tám Tiền, thời gian tới sẽ không có nhiều thay đổi. Công việc của bạn vốn đã đòi hỏi sự tỉ mỉ và chăm chỉ, và nó là loại công việc cần cả một quá trình dài. Thông điệp của lá bài là bạn đừng bỏ cuộc. Có thể bạn đang cảm thấy mệt mỏi, và điều đó dễ hiểu vì con đường này còn dài. Tuy nhiên, khi người thợ kiên nhẫn hoàn thành công việc, đồng tiền được chạm khắc sẽ rất hoàn chỉnh. Bạn hãy tiếp tục chăm chỉ và bền bỉ thêm một thời gian nữa để nhìn thấy thành quả cuối cùng.']
  ]
});

/* batch 17 - the four Nines */

Object.assign(ASK.vi, {
  'wands-9': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Chín Gậy mô tả một người bền bỉ, đã đi qua nhiều thử thách nên thường cảnh giác hơn người khác. Họ không dễ bỏ cuộc, nhưng đôi khi sự kiên cường biến thành việc lúc nào cũng chuẩn bị cho điều xấu xảy ra. Điểm mạnh là sức chịu đựng; điều cần học là biết khi nào nên cố thêm và khi nào nên nghỉ hoặc đổi cách.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Một lá Chín Gậy rất khó khẳng định có hay không, nên bạn nên rút thêm bài. Nếu chỉ dựa vào lá này, bạn có thể đọc rằng họ có tình cảm với bạn, nhưng có một trở ngại đi kèm. Trở ngại đó có thể là những thử thách khác mà họ đang phải đối mặt trong cuộc sống và công việc hiện tại. Nó cũng có thể là những tổn thương trong quá khứ, chẳng hạn họ từng bị phản bội hoặc bị bỏ rơi nhiều lần. Dù là trường hợp nào, quá khứ và hoàn cảnh của họ đều là chướng ngại cho mối quan hệ giữa hai bạn.'],
    ['love', 'Vì sao họ bảo tôi hãy chờ đợi?',
     'Tình huống ở đây là họ có cảm tình với bạn nhưng lại xin bạn thêm thời gian, và bạn muốn biết lý do. Chín Gậy đưa ra hai cách giải thích. Thứ nhất, họ đang phải đương đầu với khá nhiều khó khăn khác trong cuộc sống. Thứ hai, họ từng bị phản bội trong quá khứ nên muốn tiến chậm và chắc trong tình cảm. Nếu bạn muốn ở bên người này, bạn cần học cách đồng cảm, thấu hiểu và kiên nhẫn hơn với họ. Việc bạn có chấp nhận nhịp độ chậm đó hay không là quyết định của riêng bạn.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Chín Gậy gợi ý rằng mối quan hệ của hai bạn đã khó khăn hơn các mối quan hệ khác ngay từ điểm xuất phát. Sự khó khăn đó có thể đến từ khác biệt về ngôn ngữ, vùng miền hay tôn giáo, hoặc từ việc gia đình hai bên không ưa nhau ngay từ đầu. Lá bài không trả lời thay bạn rằng nên chia tay hay không. Câu hỏi thật sự là hai bạn có cùng nhau vượt qua được hay sẽ để khó khăn đánh bại mình, và câu trả lời thuộc về chính bạn. Dù vậy, bạn hãy luôn nhớ từ khóa của lá bài này là đừng bỏ cuộc.'],
    ['career', 'Tôi đang tìm việc, sắp tới việc này sẽ thế nào?',
     'Có thể bạn đã nhận nhiều lời từ chối trong thời gian qua. Tuy nhiên, Chín Gậy cho thấy bạn đang đi đúng hướng, chỉ là con đường của bạn gập ghềnh hơn người khác. Khó khăn hiện tại có thể chỉ mang tính giai đoạn. Vì vậy, bạn hãy tiếp tục cố gắng và đừng bỏ cuộc.'],
    ['career', 'Trong thời gian tới, công việc của tôi có điều gì cần lưu ý?',
     'Bạn có thể nói rằng công việc không có vấn đề gì, nhưng bản chất công việc của bạn là thỉnh thoảng lại có chuyện bực mình cần xử lý. Những khó khăn mà Chín Gậy mang đến không mang tính toàn cục. Chúng giống như một hòn đá trên đường: bạn phải dừng lại một lúc để nhấc nó ra rồi đi tiếp. Đó không phải là một tảng đá lớn chặn hẳn lối đi, nhưng cũng không phải một viên sỏi nhỏ có thể bỏ qua. Nó gây phiền phức nhưng không đủ lớn để cản bước bạn. Điều dễ xảy ra là khi gặp nhiều hòn đá liên tiếp, bạn sẽ nản lòng. Bạn đừng vì thế mà nghỉ việc hay nghĩ đến chuyện nhảy việc. Cùng một loại khó khăn, lần trước bạn đã giải quyết được thì lần này bạn cũng sẽ làm được.'],
    ['other', 'Lá bài này mang lại bài học nào?',
     'Bài học của Chín Gậy là sự kiên trì và kiên nhẫn. Bạn hãy hình dung rằng thành công nằm sau mười hòn đá trên đường. Không nhiều người đủ kiên trì để đi qua cả mười hòn. Có người bỏ cuộc ngay ở hòn đá đầu tiên, và cũng có người bỏ cuộc ở hòn đá thứ chín, khi đích đến chỉ còn cách một bước. Đó chính là thông điệp sâu xa mà lá bài muốn gửi đến bạn.']
  ],
  'swords-9': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Chín Kiếm nói nhiều về trạng thái tinh thần hơn là “tính cách” cố định. Người này có thể đang lo âu, mất ngủ, tự trách hoặc nhìn mọi chuyện qua lăng kính rất nặng nề. Khi tâm trí quá tải, họ dễ cảm thấy mình cô độc hoặc không còn lối thoát, dù thực tế vẫn có thể có người và nguồn hỗ trợ ở quanh mình.'],
    ['love', 'Tôi có nên yêu một người mang năng lượng của lá này không?',
     'Đừng quyết định có nên yêu ai chỉ dựa vào một lá bài. Nếu người ấy đang ở giai đoạn lo âu hoặc tổn thương, điều quan trọng là họ có nhận ra tình trạng của mình, biết tìm hỗ trợ và vẫn tôn trọng ranh giới của bạn hay không. Bạn có thể đồng hành, nhưng không cần trở thành người chữa lành thay cho họ.'],
    ['love', 'Chúng tôi cãi nhau nhiều, tôi có nên chia tay không?',
     'Hai bạn có thể có tính cách rất trái ngược nhau, và thay vì tìm tiếng nói chung, mỗi người lại đòi hỏi người kia phải thay đổi. Chẳng hạn, một người hay ghen còn người kia lại thích dành thời gian cho bạn bè hơn là cho người yêu. Một bên cấm đối phương đi chơi, bên kia yêu cầu đối phương bỏ tính ghen tuông, và cả hai rơi vào một vòng luẩn quẩn ngày càng độc hại. Vấn đề của hai bạn lúc đầu chỉ ở mức Tám Kiếm, nhưng dần dần đã bị đẩy lên thành chuyện lớn. Dù vậy, Chín Kiếm vẫn thuộc bộ Ẩn Phụ, và điều đó có nghĩa là người hỏi hoàn toàn có khả năng tự giải quyết. Ở mức chín hay mười, việc giải quyết đương nhiên khó hơn ở mức ba hay bốn, nhưng không phải là không thể.'],
    ['love', 'Vậy tôi nên làm gì trong tình huống này?',
     'Bạn nên tỉnh táo hơn và cố gắng thỏa hiệp để tìm tiếng nói chung với đối phương. Tuy nhiên, sự thỏa hiệp chỉ từ một phía sẽ không đi đến đâu. Bạn có thể thử theo cách này: bạn là người nhượng bộ trước, và nếu họ đáp lại thì hai bạn tiếp tục mối quan hệ. Nếu bạn đã xuống nước mà họ không trân trọng nỗ lực đó, bạn hoàn toàn có quyền rời đi. Bạn cũng cần nhìn nhận thực tế rằng một mối quan hệ đã ở mức Chín Kiếm thì khá độc hại và mệt mỏi.'],
    ['career', 'Tôi đã thất nghiệp lâu, sắp tới tôi có tìm được việc không?',
     'Chín Kiếm cho thấy việc tìm việc đang khiến bạn lo lắng và dễ mất tự tin. Sau nhiều lần bị từ chối, bạn có thể bước vào phỏng vấn với tâm thế đã nghĩ mình sẽ thất bại, và điều đó ảnh hưởng đến cách bạn thể hiện. Đây không phải chuyện “tần số thấp thu hút thất bại”. Hãy tập trung vào những thứ có thể kiểm soát: chuẩn bị, luyện phỏng vấn, xin phản hồi và chăm sóc giấc ngủ, tinh thần trong giai đoạn tìm việc.'],
    ['career', 'Trong thời gian tới, công việc của tôi có điều gì cần lưu ý?',
     'Trong thời gian tới, vẫn sẽ có những sự kiện khiến bạn khổ sở vì công việc. Có thể bạn đã quá chán công việc này, và vì cách nhìn của bạn vốn bi quan nên bạn thường xuyên gặp rắc rối: thỉnh thoảng bị cấp trên khiển trách, thỉnh thoảng bị đồng nghiệp góp ý. Khi đó, bạn tự hỏi tại sao mọi người luôn nhắm vào mình và liệu cả thế giới có ghét mình không. Trong khi đó, lý do có thể đơn giản là bạn đã làm sai, làm chưa tốt hoặc làm cẩu thả. Bạn cần phân biệt hai trường hợp. Nếu bản chất công việc vốn nhiều áp lực và bạn không chịu được, bạn có thể nghỉ. Nếu vấn đề đến từ lỗi của bạn, bạn hãy tìm cách khắc phục.'],
    ['other', 'Việc đọc bài cho một người mang năng lượng của lá này sẽ diễn ra như thế nào?',
     'Một buổi xem bài với người đang rất lo âu hoặc buồn bã có thể khiến reader mệt về mặt cảm xúc, nhất là khi phải tập trung và đồng cảm trong thời gian dài. Hãy đặt giới hạn thời gian, nghỉ giữa các buổi và nhớ rằng bạn không cần gánh cảm xúc của người khác sau khi buổi xem kết thúc.']
  ],
  'cups-9': [
    ['other', 'Từ khóa của lá này là gì?',
     'Từ khóa của Chín Cốc là sự thỏa mãn, tức là hài lòng với những gì mình đang có. Ở nghĩa tích cực, việc bạn thỏa mãn cho thấy hoàn cảnh của bạn đang tốt, vì người ta chỉ hài lòng khi điều kiện đủ tốt. Ở nghĩa tiêu cực, lá bài nói về sự chủ quan. Đây mới là Chín Cốc chứ chưa phải Mười Cốc, nghĩa là chưa phải sự trọn vẹn, nhưng người này đã cảm thấy đủ. Vẫn còn những điều bạn có thể cải thiện, nhưng bạn lại nghĩ rằng không cần cố gắng thêm. Nếu bạn nỗ lực thêm một chút, kết quả sẽ còn tốt hơn nữa.'],
    ['other', 'Bạn có thể cho một ví dụ để dễ hiểu hơn không?',
     'Bạn hãy hình dung một học sinh hỏi về kết quả kỳ thi thử và rút được Chín Cốc. Lá bài cho biết kết quả sẽ tốt, vì chỉ khi kết quả tốt thì người đó mới cảm thấy thỏa mãn. Tuy nhiên, thi thử tốt không đồng nghĩa với việc kỳ thi thật cũng đạt điểm cao. Chính kết quả tốt đó có thể khiến người này chủ quan, cho rằng mình đã đủ giỏi và không cần ôn tập kỹ nữa. Ở khía cạnh tự mãn này, Chín Cốc có phần giống với Sáu Gậy.'],
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Người này mang năng lượng lạc quan và yêu đời, nhưng đôi khi sự lạc quan đó hơi thái quá và có thể chuyển thành kiêu căng, ngạo mạn. Hình ảnh trên lá bài mô tả họ khá chính xác: một người khoanh tay ngồi trước hàng cốc với nụ cười đắc thắng trên mặt.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Câu trả lời nghiêng về hướng có, nhưng cách họ cư xử với bạn mang một sự đắc thắng nhất định. Có thể họ là người chủ động theo đuổi và chinh phục bạn, và sau khi chinh phục xong thì trở nên vô tâm. Kiểu người này coi bạn như một chiến tích. Khi đã có được bạn và vượt qua thử thách đó, họ đi tìm thử thách mới thay vì trân trọng những gì đang có. Họ cũng khá chủ quan, tin rằng bạn sẽ không bao giờ là người rời đi trước. Vì niềm tin đó, nhiều lúc họ đối xử với bạn thiếu tôn trọng và không trân trọng bạn đúng mức.'],
    ['love', 'Chúng tôi cãi nhau, tôi cần giải quyết chuyện này như thế nào?',
     'Lá bài chưa cho thấy chuyện chia tay. Điều nó cho thấy là cả hai bạn đang chủ quan trong mối quan hệ, hoặc cả hai đều quá kiêu hãnh và tự đắc. Mỗi người đều tin rằng mình đúng, đối phương sai, và mình không có lý do gì để xin lỗi trước. Khi cả hai cùng mang năng lượng đó, cuộc cãi vã sẽ không có hồi kết. Bạn cần nhận ra rằng mọi mối quan hệ, dù là tình yêu, tình bạn hay quan hệ làm ăn, đều được xây dựng trên sự thỏa hiệp và lợi ích của cả hai bên. Khi Chín Cốc xuất hiện trong câu hỏi tình cảm, bạn nên rút thêm bài, vì ý nghĩa của lá này không nghiêng hẳn về tích cực hay tiêu cực và một lá đơn lẻ khó nói được nhiều.'],
    ['career', 'Sắp tới tôi có tìm được công việc ưng ý không?',
     'Chín Cốc có thể nhắc bạn kiểm tra xem kỳ vọng hiện tại có phù hợp với kinh nghiệm, thị trường và ưu tiên thật sự của mình hay không. Điều này không có nghĩa bạn đang “đánh giá mình quá cao”. Hãy giữ tiêu chuẩn quan trọng với bạn, đồng thời xem đâu là điểm có thể linh hoạt để mở rộng cơ hội.'],
    ['career', 'Trong thời gian tới, tôi cần lưu ý điều gì trong công việc?',
     'Bạn đang làm tốt và trong thời gian tới vẫn sẽ làm tốt. Điều cần lưu ý là thái độ của bạn. Bạn có xu hướng cho rằng mình giỏi hơn người khác nên không cần học hỏi thêm, và kiến thức mới là không cần thiết. Người mang năng lượng Chín Cốc có thể giỏi thật, vì đạt đến mức này không phải là điều dễ. Tuy nhiên, sự cần cù, chăm chỉ và khiêm tốn không bao giờ là thừa. Hôm nay bạn có thành tích, nhưng điều đó không có nghĩa là ngày mai sẽ không xuất hiện người giỏi hơn. Nếu học được cách khiêm tốn, người này sẽ trở nên hoàn thiện, vì điểm thiếu duy nhất của họ là sự khiêm tốn.']
  ],
  'pentacles-9': [
    ['other', 'Từ khóa của lá này là gì?',
     'Chín Tiền nói về việc tận hưởng cuộc sống, đặc biệt là ở khía cạnh vật chất, vì bộ Tiền vốn mang năng lượng của vật chất. Việc tận hưởng cuộc sống theo hướng vật chất là tốt hay không tốt phụ thuộc vào quan điểm của mỗi người, và lá bài không đưa ra phán xét.'],
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Người này yêu thích cảm giác được tận hưởng vật chất và sự thoải mái trong cuộc sống. Điều đó không có nghĩa là họ phải giàu có, dùng hàng hiệu hay ăn uống đắt tiền. Họ có thể mua những món đồ rất rẻ, nhưng họ thích được vây quanh bởi những thứ mình sở hữu. Bạn cũng không nên nghĩ rằng người Chín Tiền chỉ muốn dựa dẫm vào người khác, vì họ sẵn sàng làm việc chăm chỉ để tự mua những gì mình muốn. Mỗi người tìm thấy sự thỏa mãn ở một nơi khác nhau: có người ở kiến thức, có người ở đời sống tinh thần, và có người ở vật chất như trường hợp này. Đó là lựa chọn cách sống của mỗi người, và bạn không cần phán xét.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Chín Tiền cho thấy người này coi trọng sự độc lập và thế giới riêng của mình. Họ có thể có tình cảm với bạn nhưng vẫn cần nhiều không gian, hoặc chưa muốn hòa mọi phần của cuộc sống vào một mối quan hệ. Điều cần quan sát là sự độc lập đó có đi cùng sự quan tâm và trao đổi hai chiều hay biến thành xa cách, chỉ nhận mà không cho.'],
    ['love', 'Chúng tôi cãi nhau, liệu chúng tôi có phải chia tay không?',
     'Chín Tiền là một lá tốt trong trải bài về tài chính và công việc, nhưng trong tình cảm thì chưa chắc. Tình yêu cần sự thỏa hiệp từ cả hai phía, trong khi người mang năng lượng này chỉ muốn sống cuộc sống vui vẻ của riêng mình. Vì vậy, nguyên nhân của những cuộc cãi vã có thể là sự ích kỷ của một trong hai người hoặc của cả hai, khi ai cũng hướng về bản thân quá nhiều. Lá bài cũng gợi ý rằng người mang lá này có thể chưa sẵn sàng cho chuyện tình cảm và không phù hợp với những mối quan hệ cần sự cam kết.'],
    ['career', 'Sắp tới, tôi có tìm được công việc mới không?',
     'Câu trả lời là có. Công việc mới sẽ mang lại cho bạn điều kiện tài chính đủ để sống thoải mái, ăn ngon và mặc đẹp.'],
    ['career', 'Cụ thể thì mức lương đó là bao nhiêu tiền?',
     'Tarot không cho một con số lương đáng tin cậy. Chín Tiền chỉ gợi đến cảm giác đủ đầy, độc lập và thoải mái về vật chất. Muốn biết mức lương có phù hợp hay không, hãy đối chiếu với thị trường, chi phí sống, kinh nghiệm và mục tiêu tài chính thực tế của bạn.'],
    ['career', 'Trong thời gian tới, công việc của tôi sẽ thế nào?',
     'Trong thời gian tới, công việc của bạn vẫn rất tốt. Chỉ khi công việc và thu nhập ổn định và dư dả, bạn mới có thể tận hưởng cuộc sống theo cách mà lá bài mô tả. Tuy nhiên, bạn cần lưu ý một điều: nếu bạn có nhiều tiền nhưng không thích công việc của mình, bạn cũng sẽ không tận hưởng được số tiền đó. Những người làm việc mười sáu tiếng mỗi ngày có thể kiếm rất nhiều tiền, nhưng họ không còn thời gian để tiêu, và vì thế họ cũng không có được năng lượng của Chín Tiền.']
  ]
});

/* batch 18 - the four Tens (completes the pip cards) */

Object.assign(ASK.vi, {
  'wands-10': [
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Mười Gậy thường mô tả một người có xu hướng ôm quá nhiều trách nhiệm. Họ có thể khó từ chối, quen tự làm mọi thứ hoặc chưa sắp xếp được thứ tự ưu tiên. Đôi khi khối lượng việc thật sự đến từ hoàn cảnh, chứ không phải do họ “tự tạo ra”. Điểm cần nhìn là gánh nặng nào bắt buộc, gánh nặng nào có thể chia sẻ và việc nào nên được đặt xuống.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Người ấy có thể thật lòng có cảm tình với bạn. Vấn đề không nằm ở tình cảm mà nằm ở hoàn cảnh: hiện tại họ đang bị cuốn vào quá nhiều mối bận tâm cùng lúc, từ công việc, tiền bạc, gia đình cho đến bạn bè, học hành và những sở thích riêng. Trong bức tranh đó, bạn chỉ là một trong rất nhiều thứ họ đang cố gắng giữ trên tay. Bạn cần tự hỏi mình có chấp nhận được vị trí như vậy hay không. Nếu bạn thấy ổn khi chỉ chiếm một phần nhỏ trong sự quan tâm của họ, mối quan hệ vẫn có thể tiếp tục. Nếu bạn cần được đặt ở vị trí quan trọng hơn, hãy nói rõ mong muốn đó ngay từ đầu. Khi ấy, người kia sẽ tự quyết định họ có thể đáp ứng hay không, và hai bạn tiến tới hoặc dừng lại dựa trên câu trả lời đó.'],
    ['love', 'Chúng tôi đang cãi nhau, tôi có nên chia tay không?',
     'Rất có thể cả hai bạn đều đang ở trong trạng thái Mười Gậy, nghĩa là mỗi người đều bận đến mức không còn thời gian và tâm trí dành cho nhau. Khi một người bị quá tải, sự kiên nhẫn của họ với người thân cũng cạn dần, và đôi khi chỉ một lời hỏi han của người yêu cũng đủ khiến họ bực bội. Đây là hiện tượng khá phổ biến: với người ngoài ta vẫn giữ được vẻ hòa nhã, nhưng với người gần gũi nhất ta lại dễ nổi nóng. Lá này chưa nói rằng hai bạn nên chia tay. Nó cho thấy mâu thuẫn xuất phát từ sự bận rộn, và có những giai đoạn bận rộn không thể tránh, chẳng hạn khi một người đang dồn sức cho một kỳ thi hay một đợt chuyển việc.'],
    ['love', 'Tôi đang ở trong giai đoạn bận rộn như vậy thì nên làm gì?',
     'Hãy nói rõ với người yêu về giới hạn thời gian và năng lượng của mình thay vì im lặng chịu đựng rồi cáu gắt. Hai người có thể thống nhất những cách kết nối nhỏ nhưng đều đặn trong giai đoạn bận rộn. Khi áp lực giảm, hãy chủ động trả lại sự cân bằng cho mối quan hệ. Nếu quá tải kéo dài, đó là dấu hiệu cần xem lại cách phân việc, kỳ vọng hoặc nguồn hỗ trợ — không phải lý do để tự trách mình.'],
    ['career', 'Sắp tới tôi có tìm được công việc như ý không?',
     'Mười Gậy cho thấy việc tìm việc đang cạnh tranh với quá nhiều đầu việc khác, nên tiến độ có thể chậm hơn bạn muốn. Thay vì coi đây là một câu “không”, hãy xem nó như lời nhắc thu gọn ưu tiên: dành thời gian riêng cho hồ sơ, phỏng vấn và nghiên cứu công ty, đồng thời tạm hoãn những việc chưa cần thiết nếu có thể.'],
    ['career', 'Trong thời gian tới, công việc của tôi có chuyện gì không?',
     'Thời gian tới của bạn có thể tóm gọn trong một chữ: bận. Ngoài phần việc của riêng mình, bạn còn được giao thêm nhiều dự án chồng chéo, cấp trên nhờ giải quyết việc ngoài phạm vi, đồng nghiệp cũng nhờ bạn gánh hộ những phần việc của họ với đủ lý do. Đặc trưng của Mười Gậy là nhiều đầu việc không liên quan đến nhau đổ về cùng một lúc. Bạn sẽ có cảm giác ôm quá nhiều thứ mà không giữ nổi thứ nào, và đến một lúc mọi việc có thể cùng đổ vỡ. Lá này không báo hiệu tai họa, nhưng nó cảnh báo rằng bạn sắp bị quá tải.'],
    ['other', 'Vậy tôi phải làm gì?',
     'Mười Gậy có thể xếp vào nhóm lá tiêu cực, nhưng mức độ của nó chưa đến mức làm bạn gục ngã. Bước đầu tiên và quan trọng nhất là bạn phải thừa nhận rằng mình đang ôm quá nhiều việc. Chỉ khi nhìn thấy rõ tình trạng đó, bạn mới có thể ngồi lại, liệt kê mọi việc đang có và xếp chúng theo thứ tự ưu tiên. Việc nào nên làm trước, việc nào có thể lùi lại, đó là quyết định thuộc về bạn và phụ thuộc vào hoàn cảnh riêng của bạn. Trải bài chỉ ra vấn đề, còn cách sắp xếp cụ thể là kỹ năng mà mỗi người phải tự rèn luyện.']
  ],
  'swords-10': [
    ['other', 'Từ khóa của lá này là gì?',
     'Mười Kiếm nói về cảm giác một chu kỳ đau đớn đã đi đến giới hạn: kiệt sức, thất vọng hoặc tin rằng mình không thể chịu thêm. Một phần nỗi đau có thể bị khuếch đại bởi suy nghĩ, nhưng hoàn cảnh bên ngoài cũng có thể rất thật. Điểm tích cực của lá nằm ở chỗ một kết thúc đã lộ rõ; từ đây, câu hỏi chuyển từ “chịu thêm bao lâu” sang “mình cần làm gì để hồi phục và bắt đầu lại”.'],
    ['other', 'Có người nói rằng lá này vẫn có mặt tích cực, điều đó có đúng không?',
     'Có. Mười Kiếm thường được đọc như khoảnh khắc chạm đáy của một chu kỳ, nên nó cũng chứa ý nghĩa kết thúc và hồi phục. Tuy nhiên, “mọi chuyện rồi tự qua” không phải toàn bộ thông điệp. Hãy nhìn xem điều gì cần kết thúc, điều gì cần được hỗ trợ và bài học nào giúp bạn không lặp lại cùng một mô thức.'],
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Mười Kiếm không nên dùng để đóng khung tính cách một người. Nó thường mô tả một giai đoạn họ đang kiệt sức, bi quan hoặc cảm thấy bị dồn đến giới hạn. Khi ở trạng thái này, họ có thể khó nhìn thấy điều tích cực và dễ phản ứng nặng nề hơn bình thường. Trạng thái đó có thể thay đổi khi hoàn cảnh và sức khỏe tinh thần được cải thiện.'],
    ['other', 'Khi nói chuyện với người mang năng lượng của lá này, tôi sẽ cảm thấy thế nào?',
     'Trò chuyện lâu với một người đang liên tục tuyệt vọng hoặc khủng hoảng có thể khiến bạn mệt về mặt cảm xúc. Điều đó không biến họ thành “người hút năng lượng”. Bạn có thể lắng nghe mà vẫn đặt giới hạn: không phải lúc nào bạn cũng có đủ sức để tiếp nhận, và trong những vấn đề vượt quá khả năng của mình, khuyến khích họ tìm người thân hoặc hỗ trợ chuyên môn là phù hợp.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Người này nhìn tình yêu qua một lăng kính rất u ám. Họ có thể thích bạn, nhưng ngay từ khi mới bắt đầu tìm hiểu, trong đầu họ đã dựng sẵn những kịch bản xấu: rằng bạn rồi sẽ phản bội, rằng bạn tiếp cận họ chỉ vì muốn lợi dụng, rằng bạn không thật lòng. Những nghi ngờ này không dựa trên bất cứ điều gì bạn đã làm. Hai người mới chỉ đang làm quen một cách bình thường, và bạn không hề có ý định như họ tưởng. Lá này vì thế cho thấy tình cảm của họ, nếu có, đã bị chính sự bi quan của họ bóp méo ngay từ đầu.'],
    ['love', 'Tôi có nên giúp người mang năng lượng này không?',
     'Bạn có thể giúp trong giới hạn của mình, nhưng không thể ép một người thay đổi hoặc nhận sự giúp đỡ khi họ chưa sẵn sàng. Hãy nói rõ bạn có thể làm gì, không thể làm gì và khuyến khích nguồn hỗ trợ phù hợp. Nếu mối quan hệ khiến bạn liên tục kiệt sức hoặc bị tổn thương, giữ khoảng cách cũng là một lựa chọn hợp lý.'],
    ['other', 'Vì sao việc xem bài cho những người mang năng lượng này thường không có tác dụng?',
     'Khi người hỏi đang ở trạng thái tuyệt vọng, một trải bài có thể khó giúp họ nếu họ chỉ muốn một câu trả lời khẳng định rằng mọi thứ đã được định sẵn. Reader nên tránh củng cố cảm giác bất lực. Hãy dùng bài như công cụ gợi mở, tập trung vào lựa chọn thực tế và giới hạn của Tarot; với khủng hoảng tâm lý nghiêm trọng, trải bài không thay thế hỗ trợ chuyên môn.'],
    ['love', 'Chúng tôi cãi nhau nhiều, tôi có nên chia tay không?',
     'Mười Kiếm cho thấy mối quan hệ đang ở mức kiệt sức hoặc tổn thương nặng. Lá bài nghiêng về việc một chu kỳ hiện tại cần kết thúc, nhưng “kết thúc” có thể là chấm dứt cách hai người đang đối xử với nhau, một khoảng cách để hồi phục, hoặc kết thúc hẳn mối quan hệ. Nếu có bạo lực, đe dọa hoặc sợ hãi, ưu tiên an toàn và hỗ trợ bên ngoài thay vì dùng Tarot để quyết định.'],
    ['career', 'Tôi có tìm được công việc ưng ý không?',
     'Mười Kiếm cho thấy bạn có thể đang quá kiệt sức hoặc mất tinh thần vì quá trình tìm việc. Không cần mặc định rằng nhà tuyển dụng sẽ “cảm nhận năng lượng xấu”. Nếu có thể, hãy cho mình thời gian hồi phục, đồng thời tiếp tục những bước nhỏ như chỉnh hồ sơ, luyện phỏng vấn và tìm hỗ trợ. Thời điểm quay lại mạnh hơn tùy hoàn cảnh của bạn, không cần chờ đúng một hay hai tháng.'],
    ['career', 'Trong thời gian tới, công việc của tôi có biến cố gì không?',
     'Thời gian tới, môi trường làm việc của bạn sẽ rất căng thẳng và mang nhiều yếu tố độc hại. Tuy nhiên, chỉ với một lá thì chưa thể xác định sự độc hại đến từ đâu: đó có thể là đồng nghiệp, cấp trên hoặc khách hàng. Bạn nên rút thêm lá để làm rõ nguồn gốc, đồng thời rút một lá lời khuyên để biết cách né tránh hoặc giảm nhẹ tác động. Cần nói thêm rằng đây là một trong những lá nặng nề nhất của bộ bài. Việc diễn giải nó đòi hỏi người đọc phải giữ được sự bình tĩnh, vì khi nói về những điều tiêu cực, chính người diễn giải cũng dễ bị cuốn theo tâm trạng đó.']
  ],
  'cups-10': [
    ['other', 'Từ khóa của lá này là gì?',
     'Từ khóa của Mười Cốc là hạnh phúc trọn vẹn, niềm vui được sẻ chia và sự khép lại êm đẹp của một chu kỳ. Hình ảnh trên lá gợi lên một mái ấm: một cặp vợ chồng đứng bên nhau, hai đứa trẻ nắm tay nhảy múa, và trên đầu họ là mười chiếc cốc xếp thành hình cầu vồng. Đây là lá hiếm hoi trong bộ bài gần như không có mặt tiêu cực. Nếu nhìn cả hành trình của bộ Cốc từ lá số 1 đến lá số 9, ta thấy cảm xúc đã trải qua nhiều thăng trầm. Đến lá số 10, mọi dao động lắng xuống, và tâm trí cũng như tinh thần đều tìm được sự cân bằng.'],
    ['other', 'Năng lượng của các lá số 10 mạnh đến mức nào?',
     'Trong toàn bộ Ẩn Phụ, các lá số 10 là những lá có năng lượng mạnh nhất và gần với cường độ của Ẩn Chính nhất. Để hiểu vị trí của chúng, bạn cần nhớ rằng Ẩn Phụ thực chất gồm hai nhóm: bốn dãy số từ 1 đến 10 và mười sáu lá Hoàng gia. Nhóm Hoàng gia gần như là một bộ riêng với cách đọc riêng. Vì vậy, lá số 10 chính là điểm kết của chu kỳ mười lá đánh số, nơi năng lượng của mỗi nguyên tố đạt đến mức đầy đủ nhất.'],
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Người mang năng lượng Mười Cốc tỏa ra sự tích cực rõ rệt, và điều đặc biệt là họ có khả năng truyền sự tích cực đó sang người khác. Trong một buổi gặp gỡ, họ thường tự nhiên trở thành trung tâm của sự chú ý. Điều này không xuất phát từ việc họ cố tình gây ấn tượng hay ăn mặc nổi bật, mà từ nụ cười, sự vui vẻ và thứ năng lượng ấm áp khiến mọi người muốn ở gần. Họ có trí tuệ cảm xúc cao, biết cách trò chuyện sao cho người đối diện cảm thấy được lắng nghe và thoải mái. Ở bên cạnh một người như vậy, bạn thường thấy tâm trạng của mình cũng nhẹ nhàng hơn.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Đây là một lá rất tích cực cho tình cảm. Nó gợi đến sự gắn bó, cảm giác thuộc về nhau và mong muốn xây một tương lai hài hòa. Tuy vậy, không nên coi một lá bài là bằng chứng chắc chắn về ý định kết hôn hay mức độ cam kết của người khác. Hãy để hành động, lời nói và kế hoạch thực tế xác nhận điều đó.'],
    ['love', 'Chúng tôi đang cãi nhau, lá này cho lời khuyên gì?',
     'Khi Mười Cốc xuất hiện cho câu hỏi về mâu thuẫn, điều đầu tiên cần thấy là nền tảng tình cảm giữa hai bạn vẫn rất tốt. Chuyện cãi vã bạn đang lo lắng nhiều khả năng chỉ là một va chạm nhỏ trong một bức tranh chung rất đẹp. Lời khuyên vì thế rất đơn giản: bạn đừng để một bất đồng nhỏ làm lung lay mối quan hệ. Nói thẳng thắn hơn, một cặp đôi có năng lượng Mười Cốc thường không cần đến trải bài chỉ vì một lần giận dỗi. Có thể bạn đi xem bài vì một vấn đề khác và tiện thể hỏi thêm về tình cảm, và trong trường hợp đó, câu trả lời là chuyện tình cảm của bạn không có gì đáng lo.'],
    ['career', 'Trong thời gian tới, tôi có tìm được công việc mới không?',
     'Câu trả lời là có, bạn sẽ tìm được việc mới. Nhưng bạn cần nhớ một nguyên tắc chung khi đọc bài về công việc: các lá thuộc bộ Tiền thường được mong đợi hơn, vì mục đích chính của việc đi làm là thu nhập. Mười Cốc cho biết bạn sẽ tìm được một công việc mà bạn thật sự yêu thích, phù hợp với sở thích và nguyện vọng của mình, trong một môi trường có cấp trên và đồng nghiệp dễ chịu. Về mặt cảm xúc, đó là một câu trả lời trọn vẹn. Tuy nhiên, lá này không nói gì về mức thu nhập hay cơ hội thăng tiến. Bạn nên rút thêm một lá cho khả năng thăng tiến và một lá cho khía cạnh tài chính, bởi trên thực tế có những công việc bạn yêu thích nhưng lương thấp, và ngược lại có những công việc nhiều tiền nhưng bạn không hề thích. Công việc bạn thích không tự động đồng nghĩa với công việc nhiều tiền.'],
    ['career', 'Trong thời gian tới, công việc của tôi có điều gì cần lưu ý?',
     'Lá này cho thấy thời gian tới không có điều gì bạn cần đặc biệt lưu ý. Năng lượng của Mười Cốc là năng lượng hài hòa và ổn định, và nó sẽ bao trùm suốt giai đoạn sắp tới trong công việc của bạn.']
  ],
  'pentacles-10': [
    ['other', 'Từ khóa của lá này là gì?',
     'Mười Tiền mang ý nghĩa sung túc và đầy đủ. Hình ảnh trên lá là một gia đình nhiều thế hệ, từ người già đến trẻ nhỏ và cả vật nuôi, quây quần trong một ngôi nhà ấm cúng. Trang phục của họ chỉn chu và đẹp đẽ, cho thấy một cuộc sống không thiếu thốn về vật chất. Xét tổng thể, lá này nghiêng về nghĩa tích cực nhiều hơn tiêu cực.'],
    ['other', 'Lá này khác Mười Cốc ở điểm nào?',
     'Hai lá này đều nói về sự đủ đầy, nhưng sắc thái khác nhau. Mười Cốc mang cảm giác nhẹ nhõm và thoải mái, còn Mười Tiền có phần gò bó và cứng nhắc hơn. Bạn có thể hình dung một người lớn lên trong một gia đình nề nếp, truyền thống và khá giả, có đủ ông bà cha mẹ bên cạnh. Bề ngoài, đó là một hoàn cảnh đáng mơ ước. Nhưng người trong cuộc thường chịu áp lực từ kỳ vọng của gia đình về việc phải học gì, làm nghề gì, sống ra sao. Họ có mọi điều kiện vật chất, song lại không dễ dàng gạt bỏ tất cả để đi theo mong muốn riêng của mình. Chính sự ràng buộc đi kèm với sự sung túc này là điểm khiến Mười Tiền nặng nề hơn Mười Cốc.'],
    ['love', 'Lá này miêu tả tính cách của một người như thế nào?',
     'Đây là một người ổn định và thực tế, đúng với bản chất của bộ Tiền. Họ không keo kiệt. Vì có của cải, hay chính xác hơn là vì không cảm thấy thiếu thốn, họ sẵn lòng làm từ thiện hoặc tặng quà cho người xung quanh. Tuy nhiên, sự hào phóng của họ luôn đi kèm với lý trí. Khi một người thật sự gặp khó khăn, họ sẵn sàng giúp đỡ. Khi ai đó chỉ muốn vay tiền để tiêu xài hoang phí, họ sẽ từ chối một cách dứt khoát. Nói cách khác, người Mười Tiền vừa rộng rãi vừa tỉnh táo. Năng lượng của họ không sôi nổi và cởi mở như người Mười Cốc, nhưng vẫn là một dạng năng lượng cao và lành mạnh.'],
    ['love', 'Người ấy dành cho tôi tình cảm như thế nào?',
     'Mười Tiền cho thấy người này có thể nhìn tình yêu theo hướng lâu dài và thực tế: gia đình, nơi ở, tài chính, lối sống và khả năng xây dựng một cuộc sống chung. Họ có thể coi trọng sự tương đồng về nền tảng hoặc giá trị, nhưng lá bài không có nghĩa họ chọn bạn vì địa vị hay điều kiện gia đình. Hãy nhìn xem sự thực tế đó có đi cùng tình cảm, tôn trọng và sự hiểu nhau hay không.'],
    ['love', 'Vì sao chúng tôi cãi nhau?',
     'Với câu hỏi về tình cảm, một lá Mười Tiền đơn lẻ khó đưa ra câu trả lời đầy đủ, vì bộ Tiền nghiêng về công việc và vật chất hơn là cảm xúc. Bạn nên rút thêm lá để làm rõ. Dù vậy, khi lá này xuất hiện cho câu hỏi về nguyên nhân cãi vã, nó thường chỉ về phía gia đình. Có thể gia đình hai bên không ủng hộ, có sự chênh lệch về hoàn cảnh, hoặc những khác biệt về truyền thống và tôn giáo đang tạo ra căng thẳng. Một hướng khác rất thực tế là tiền bạc: hai người đã về chung một nhà nhưng thu nhập không đủ trang trải, hoặc đang yêu nhau nhưng bất đồng trong cách chi tiêu.'],
    ['career', 'Tôi có tìm được công việc mới không?',
     'Mười Tiền là tín hiệu tích cực cho sự ổn định và nền tảng tài chính, nhưng không thể đảm bảo một mức lương cụ thể hay chắc chắn bạn sẽ tìm được việc. Nếu có cơ hội mới, hãy đánh giá mức lương, phúc lợi, độ ổn định và khả năng phát triển bằng thông tin thực tế.'],
    ['career', 'Thời gian tới, công việc của tôi có thay đổi gì không?',
     'Công việc hiện tại của bạn đang mang lại thu nhập tốt, và có thể bạn đang giữ một vị trí khá cao với mức lương tương xứng. Trong thời gian tới, tình hình này gần như sẽ được giữ nguyên. Mười Tiền là lá của sự ổn định, nên nếu có thay đổi thì thay đổi đó cũng diễn ra rất chậm. Bạn không nên chờ đợi một bước ngoặt đột ngột. Sự sung túc của Mười Tiền không đến trong một sớm một chiều mà được tích lũy qua cả một quá trình dài, và giai đoạn sắp tới là lúc bạn thu hoạch thành quả của quá trình đó.']
  ]
});

/* batch 19 - the four Pages */

Object.assign(ASK.vi, {
  'wands-c0': [
    [
      "other",
      "Từ khóa của lá này là gì?",
      "Tiểu Đồng Gậy nói về một ngọn lửa vừa được nhóm lên: tò mò, nhiệt huyết, ham khám phá và sẵn sàng thử điều mới. Mặt trái là hấp tấp, thiếu kinh nghiệm hoặc bắt đầu rất hăng nhưng chưa biết đi đường dài. Hãy nhớ: Tiểu Đồng là năng lượng đang học cách dùng nguyên tố của mình."
    ],
    [
      "love",
      "Lá này miêu tả tính cách của một người như thế nào?",
      "Người mang năng lượng Tiểu Đồng Gậy thường cởi mở, nhiều năng lượng và thích hành động. Họ dễ hào hứng với điều mới, đôi khi hơi bốc đồng vì chưa có nhiều kinh nghiệm. Điểm đẹp là họ thường thật lòng với sự tò mò của mình và sẵn sàng học khi được góp ý."
    ],
    [
      "love",
      "So với Kỵ Sĩ Gậy, lá nào hấp tấp hơn?",
      "Kỵ Sĩ Gậy thường bốc đồng và lao nhanh hơn. Tiểu Đồng Gậy vẫn nhiều lửa, nhưng giống người mới bắt đầu: háo hức, tò mò và còn biết dừng lại để học. Kỵ Sĩ lại có xu hướng muốn hành động ngay và nghĩ sau."
    ],
    [
      "love",
      "Người ấy dành cho tôi tình cảm như thế nào?",
      "Lá này thường gợi một cảm xúc mới chớm: người ấy có thể thấy bạn thú vị, hấp dẫn và muốn tiến gần hơn. Năng lượng khá nhiệt thành nhưng còn mới, nên chưa nói được tình cảm sẽ sâu đến đâu. Hãy nhìn thêm vào cách họ chủ động và duy trì sự quan tâm."
    ],
    [
      "love",
      "Chúng tôi đang cãi nhau, trong thời gian tới nên giải quyết thế nào?",
      "Mâu thuẫn có thể đến từ việc cả hai phản ứng quá nhanh hoặc chưa biết cách xử lý cảm xúc khi nóng lên. Hãy giảm nhịp, nói từng chuyện một và tránh biến tranh luận thành cuộc thi ai thắng. Sự nhiệt tình giữa hai bạn vẫn có thể là điểm mạnh nếu được dùng để cùng giải quyết vấn đề."
    ],
    [
      "career",
      "Sắp tới, tôi có tìm được công việc mới không?",
      "Tiểu Đồng Gậy ủng hộ việc mở một hướng mới, nhưng không phải lời đảm bảo rằng công việc sẽ tự đến. Hợp nhất lúc này là chủ động tìm, nộp hồ sơ, thử lĩnh vực mới và chấp nhận giai đoạn vừa làm vừa học. Cơ hội thường xuất hiện khi bạn bắt đầu di chuyển."
    ],
    [
      "career",
      "Trong thời gian tới, công việc của tôi có điều gì cần lưu ý?",
      "Bạn có thể gặp một nhiệm vụ, dự án hoặc kỹ năng hoàn toàn mới. Đừng ngại mình chưa biết đủ; lá này hợp với việc học trong lúc làm. Điều cần tránh là nhận quá nhiều chỉ vì đang hào hứng rồi bỏ dở khi hết hứng."
    ],
    [
      "other",
      "Có mẹo nào để nhớ các lá Tiểu Đồng không?",
      "Hãy xem Tiểu Đồng như “người mới” của từng nguyên tố. Tiểu Đồng Gậy học cách hành động và theo đuổi đam mê; Tiểu Đồng Cốc học về cảm xúc; Tiểu Đồng Kiếm học về tư duy và giao tiếp; Tiểu Đồng Xu học về kỹ năng và vật chất. Cách này giúp bạn nhớ vai trò trước rồi mới ghép với nguyên tố."
    ]
  ],
  'swords-c0': [
    [
      "love",
      "Lá này miêu tả tính cách của một người như thế nào?",
      "Tiểu Đồng Kiếm thường nhanh trí, tò mò và thích quan sát, nhưng cách nói chuyện có thể còn vụng. Họ dễ nói quá thẳng, hỏi quá nhiều hoặc phản ứng trước khi nghĩ kỹ người khác sẽ cảm thấy thế nào. Đây là sự non kinh nghiệm trong tư duy và giao tiếp, không phải bản chất xấu."
    ],
    [
      "love",
      "Người ấy dành cho tôi tình cảm như thế nào?",
      "Lá này cho thấy người ấy đang quan sát và suy nghĩ về bạn nhiều, nhưng cảm xúc chưa chắc đã rõ hoặc sâu. Họ có thể tò mò, muốn tìm hiểu thêm và phân tích mối quan hệ bằng lý trí. Đừng vội kết luận rằng họ thực dụng hay không thật lòng chỉ từ một lá bài; hãy nhìn cách họ cư xử thực tế."
    ],
    [
      "other",
      "Lá này có gì khác ba lá Tiểu Đồng kia?",
      "Tiểu Đồng Kiếm đặt sự mới mẻ vào thế giới của ý tưởng, câu hỏi và giao tiếp. Vì vậy, nó thường nói về một ý tưởng mới nhưng chưa được kiểm chứng, hoặc một người đang học cách dùng lời nói và lý trí. Điểm mạnh là ham học; điểm yếu là dễ kết luận quá nhanh."
    ],
    [
      "love",
      "Chúng tôi đang cãi nhau, làm sao để giải quyết?",
      "Trọng tâm của lá này là giao tiếp. Hai bạn có thể đang nghe để phản bác chứ chưa thật sự nghe để hiểu, hoặc nói quá nhanh khi đang khó chịu. Hãy hỏi lại điều mình chưa chắc, tránh suy diễn và cho nhau thời gian hoàn thành câu nói trước khi đáp."
    ],
    [
      "career",
      "Tôi có tìm được công việc mới không?",
      "Lá này cho thấy giai đoạn tìm việc cần nhiều thông tin, học hỏi và quyết định tỉnh táo. Bạn có thể gặp cơ hội mới, nhưng hãy đọc kỹ mô tả công việc, hỏi rõ điều kiện và tránh đổi ý chỉ vì lo lắng nhất thời. Kết quả phụ thuộc nhiều vào cách bạn thu thập thông tin và hành động."
    ],
    [
      "career",
      "Thời gian tới, công việc của tôi có điều gì đáng chú ý?",
      "Nhiều ý tưởng, tin nhắn hoặc cuộc trao đổi mới có thể xuất hiện. Hãy kiểm chứng dữ kiện trước khi trình bày và chú ý cách nói để tránh hiểu lầm nơi công sở. Một câu hỏi đúng lúc có thể hữu ích hơn một kết luận vội."
    ]
  ],
  'cups-c0': [
    [
      "other",
      "Từ khóa của lá này là gì?",
      "Tiểu Đồng Cốc nói về một cảm xúc mới chớm: rung động, tò mò, sáng tạo, sự dịu dàng và khả năng mở lòng. Nó có thể là tình cảm, một tình bạn, một sở thích hay nguồn cảm hứng mới. Mặt trái là lý tưởng hóa, dễ bị cảm xúc cuốn đi hoặc chưa biết mình thật sự muốn gì."
    ],
    [
      "love",
      "Lá này miêu tả tính cách của một người như thế nào?",
      "Người này thường nhạy cảm, cởi mở, giàu tưởng tượng và dễ rung động trước điều mới. Họ có nét trẻ trung, tò mò về con người và thường tiếp cận cuộc sống bằng cảm xúc. Khi chưa trưởng thành, họ có thể mơ mộng hoặc đổi hứng nhanh."
    ],
    [
      "love",
      "Người này hợp làm bạn hay làm người yêu?",
      "Lá bài không quyết định ai “hợp làm bạn hơn làm người yêu”. Nó chỉ cho thấy một người nhiều cảm xúc mới mẻ, tò mò và còn đang khám phá bản thân. Một mối quan hệ có bền hay không phụ thuộc vào sự nhất quán, ranh giới và cách hai người giao tiếp, không phải chỉ vào lá bài này."
    ],
    [
      "love",
      "Người ấy dành cho tôi tình cảm như thế nào?",
      "Có thể đang có một rung động chân thành nhưng còn mới và nhẹ. Người ấy thấy bạn thú vị, dễ thương hoặc khiến họ muốn mở lòng hơn. Hãy cho cảm xúc thời gian phát triển thay vì vội đặt tên cho nó."
    ],
    [
      "love",
      "Khi cãi nhau, tôi nên làm gì?",
      "Đừng cố thắng bằng cảm xúc. Hãy nói rõ điều khiến bạn buồn hoặc thiếu an toàn, rồi hỏi đối phương đang cảm thấy gì thay vì đoán. Tiểu Đồng Cốc khuyên hai bạn quay lại sự mềm mại và tò mò với nhau."
    ],
    [
      "love",
      "Vậy tôi phải làm gì bây giờ?",
      "Cho mình một chút thời gian để nhận ra cảm xúc thật trước khi phản ứng. Nếu cần nói chuyện, hãy dùng những câu bắt đầu bằng “mình cảm thấy…” thay vì quy lỗi. Một cuộc trò chuyện nhẹ nhàng nhưng thật lòng thường phù hợp hơn một quyết định vội."
    ],
    [
      "career",
      "Tôi có tìm được công việc mới không?",
      "Lá này có thể gợi một công việc khiến bạn thấy hứng thú hoặc có cảm xúc tích cực, đặc biệt ở lĩnh vực sáng tạo, chăm sóc hay giao tiếp với con người. Tuy vậy, nó không đảm bảo kết quả tuyển dụng. Hãy dùng sự tò mò để khám phá cơ hội và kiểm tra các điều kiện thực tế trước khi nhận."
    ],
    [
      "career",
      "Thời gian tới, công việc của tôi có điều gì đáng chú ý?",
      "Một ý tưởng, lời mời hoặc hứng thú mới có thể xuất hiện và khiến công việc bớt khô khan. Hãy cho nó cơ hội thử nghiệm nhưng đừng để cảm hứng thay thế kế hoạch. Nếu công việc liên quan con người, sự tinh tế trong giao tiếp sẽ là điểm mạnh."
    ]
  ],
  'pentacles-c0': [
    [
      "love",
      "Lá này miêu tả tính cách của một người như thế nào?",
      "Tiểu Đồng Xu thường thực tế, chăm chỉ và thích học bằng cách làm. Họ quan tâm đến kỹ năng, tiền bạc, học tập hoặc một mục tiêu có thể đo đếm được. Điểm yếu là đôi khi quá thận trọng, chậm bắt đầu hoặc chỉ tin vào điều mình nhìn thấy ngay trước mắt."
    ],
    [
      "love",
      "Người ấy dành cho tôi tình cảm như thế nào?",
      "Người ấy có thể đang nghiêm túc tìm hiểu bạn theo cách chậm và thực tế. Họ thường thể hiện sự quan tâm bằng hành động nhỏ, thời gian hoặc sự ổn định hơn là lời lẽ lãng mạn. Cảm xúc còn ở giai đoạn đầu, nhưng có tiềm năng nếu cả hai tiếp tục vun đắp."
    ],
    [
      "love",
      "Vì sao chúng tôi hay cãi nhau?",
      "Hai bạn có thể khác nhau về nhịp sống, tiền bạc, kế hoạch hoặc mức độ thực tế. Một người muốn chắc chắn từng bước, người kia lại muốn tiến nhanh hơn. Hãy nói rõ điều mỗi người cần để cảm thấy an toàn thay vì xem sự chậm rãi là thiếu tình cảm."
    ],
    [
      "career",
      "Sắp tới tôi có tìm được công việc mình thích không?",
      "Tiểu Đồng Xu là tín hiệu tốt cho việc học nghề, thực tập, vị trí mới hoặc công việc giúp bạn xây kỹ năng. Nó không hứa một công việc hoàn hảo ngay lập tức, nhưng ủng hộ cơ hội có nền tảng để phát triển. Hãy ưu tiên nơi cho bạn học được điều thật sự có giá trị."
    ],
    [
      "career",
      "Trong thời gian tới, công việc của tôi có chuyện gì không?",
      "Bạn có thể bước vào giai đoạn học thêm, nhận nhiệm vụ mới hoặc bắt đầu một mục tiêu thực tế hơn. Công việc tiến chậm nhưng chắc sẽ hợp với lá này. Đừng xem tiến độ nhỏ là vô nghĩa; đây là kiểu năng lượng xây nền từng viên một."
    ]
  ]
});

/* batch 20 - the four Knights */

Object.assign(ASK.vi, {
  'wands-c1': [
    [
      "other",
      "Từ khóa của lá này là gì?",
      "Kỵ Sĩ Gậy là chuyển động nhanh, đam mê, liều lĩnh và khát khao trải nghiệm. Đây là người muốn đi ngay khi thấy điều mình thích. Mặt trái là nóng vội, thiếu ổn định và dễ bỏ cuộc khi cảm giác hứng thú ban đầu qua đi."
    ],
    [
      "other",
      "Kỵ Sĩ khác Tiểu Đồng, Hoàng Hậu và Vua ở điểm nào?",
      "Tiểu Đồng đang học; Kỵ Sĩ đã có đủ năng lượng để lao vào hành động nhưng chưa thật sự làm chủ nó; Nữ Hoàng và Vua trưởng thành và biết điều tiết nguyên tố của mình hơn. Vì vậy, Kỵ Sĩ thường là cấp bậc nhiều chuyển động nhất và cũng dễ đi quá đà nhất."
    ],
    [
      "love",
      "Anh ấy hoặc cô ấy dành cho tôi tình cảm như thế nào?",
      "Người ấy có thể bị bạn thu hút rất mạnh và muốn tiến tới nhanh. Đây là năng lượng của đam mê, chủ động và sự háo hức, nhưng chưa chắc đồng nghĩa với cam kết lâu dài. Hãy xem họ có giữ được sự quan tâm khi giai đoạn mới mẻ qua đi hay không."
    ],
    [
      "love",
      "Có ví dụ nào cho kiểu tình cảm này không?",
      "Ví dụ điển hình là một người chủ động nhắn nhiều, muốn gặp sớm, rủ bạn đi đây đó và khiến mọi thứ tiến rất nhanh. Điều đó có thể rất cuốn hút, nhưng hãy phân biệt giữa nhiệt tình nhất thời và sự nhất quán. Kỵ Sĩ Gậy mạnh ở khởi động, còn bền bỉ cần được chứng minh bằng thời gian."
    ],
    [
      "love",
      "Vì sao chúng tôi hay cãi nhau?",
      "Hai bạn có thể phản ứng quá nhanh, tranh quyền chủ động hoặc dễ bùng lên rồi mới nghĩ lại. Mâu thuẫn thường lớn hơn vì cả hai đang nói khi còn nóng. Hãy tạm dừng trước khi trả lời và dành chỗ cho một người nói hết trước khi người kia phản ứng."
    ],
    [
      "other",
      "Tôi có nên đi xem bài về người yêu của mình không?",
      "Bạn có thể xem bài để phản chiếu cảm xúc và lựa chọn của mình, nhưng đừng dùng Tarot để theo dõi hay kết luận chắc chắn về suy nghĩ của người khác. Nếu điều bạn cần thật sự là sự rõ ràng, một cuộc trò chuyện trực tiếp thường đáng tin hơn một lần rút bài."
    ],
    [
      "career",
      "Trong thời gian tới, tôi có tìm được công việc ưng ý không?",
      "Kỵ Sĩ Gậy ủng hộ một giai đoạn tìm việc chủ động, nhiều cuộc hẹn, di chuyển hoặc cơ hội đến nhanh. Bạn có thể gặp một công việc hấp dẫn, nhưng hãy đọc kỹ điều kiện trước khi nhận chỉ vì đang hứng. Tốc độ là lợi thế nếu đi cùng sự tỉnh táo."
    ],
    [
      "career",
      "Cách tôi đi tìm việc có vấn đề gì không?",
      "Bạn có thể đang làm rất nhiều nhưng thiếu chiến lược: gửi hồ sơ hàng loạt, đổi hướng liên tục hoặc nhận lời quá nhanh. Hãy chọn vài mục tiêu rõ ràng, theo dõi từng hồ sơ và chuẩn bị kỹ cho từng cuộc phỏng vấn. Ít hơn nhưng có chủ đích thường hiệu quả hơn."
    ],
    [
      "career",
      "Tôi đang làm công việc văn phòng bình thường, thời gian tới công việc của tôi có gì mới không?",
      "Công việc có thể trở nên bận hơn, có dự án gấp, chuyến đi hoặc nhiệm vụ cần phản ứng nhanh. Đây là lúc tốt để chủ động nhận thử thách, nhưng đừng để nhịp nhanh biến thành kiệt sức. Hãy biết việc nào thật sự đáng để lao vào."
    ]
  ],
  'swords-c1': [
    [
      "other",
      "Lá này miêu tả tính cách của một người như thế nào?",
      "Kỵ Sĩ Kiếm nhanh trí, quyết liệt, thích tranh luận và thường đi thẳng vào vấn đề. Họ có thể rất hiệu quả khi cần phản ứng nhanh, nhưng dễ trở nên sắc lời, nóng nảy hoặc quá chắc rằng mình đúng. Bài học của lá này là dùng tốc độ của trí óc mà không biến nó thành vũ khí."
    ],
    [
      "other",
      "Kỵ Sĩ và Tiểu Đồng có điểm gì chung?",
      "Cả hai đều chưa hoàn toàn làm chủ nguyên tố của mình. Tiểu Đồng còn đang học và đặt câu hỏi; Kỵ Sĩ đã có niềm tin và lao về phía trước, nên dễ đi quá đà hơn. Với bộ Kiếm, điều này thể hiện rõ qua suy nghĩ nhanh, lời nói mạnh và quyết định vội."
    ],
    [
      "love",
      "Anh ấy hoặc cô ấy nghĩ gì về tôi?",
      "Người ấy có thể đang suy nghĩ rất nhiều về bạn và muốn có câu trả lời rõ ràng. Họ dễ tiếp cận mối quan hệ bằng lý trí, hỏi trực tiếp và muốn biết hai người đang ở đâu. Điều đó chưa cho biết họ yêu sâu đến mức nào; nó chỉ cho thấy tâm trí họ đang hoạt động rất mạnh quanh câu chuyện này."
    ],
    [
      "love",
      "Đây có phải là người dành cho tôi không?",
      "Một lá bài không thể quyết định ai là “người dành cho bạn”. Kỵ Sĩ Kiếm hợp với người thích sự thẳng thắn, tốc độ và tranh luận trí tuệ, nhưng có thể mệt với người cần nhiều sự mềm mại. Hãy nhìn cách hai bạn xử lý bất đồng ngoài đời."
    ],
    [
      "love",
      "Vì sao chúng tôi hay cãi nhau?",
      "Hai bạn có thể tranh luận để thắng hơn là để hiểu. Một người cắt lời, phản bác quá nhanh hoặc dùng sự thật như cách gây tổn thương. Hãy giảm tốc, tách sự kiện khỏi diễn giải và tránh nhắn tin dài khi đang tức giận."
    ],
    [
      "career",
      "Trong thời gian tới, tôi có tìm được công việc ưng ý không?",
      "Lá này ủng hộ tiến triển nhanh, đặc biệt với công việc cần tư duy, giao tiếp, phân tích hoặc xử lý tình huống. Tuy nhiên, đừng nhận việc chỉ vì muốn thoát khỏi tình trạng hiện tại. Hãy hỏi kỹ về vai trò, khối lượng công việc và kỳ vọng trước khi quyết định."
    ],
    [
      "career",
      "Tôi tìm mãi mà không ra việc, tôi phải làm sao?",
      "Đừng biến sự sốt ruột thành việc gửi hồ sơ thiếu chọn lọc. Hãy rà lại CV, luyện cách trả lời phỏng vấn và nhờ một người đáng tin xem giúp chiến lược tìm việc. Kỵ Sĩ Kiếm cần một mục tiêu rõ để tốc độ không bị tản ra."
    ],
    [
      "career",
      "Tôi đang làm công việc văn phòng bình thường, thời gian tới công việc của tôi có thay đổi gì không?",
      "Bạn có thể bước vào giai đoạn nhiều quyết định, trao đổi gấp hoặc dự án cần phân tích nhanh. Có thể xuất hiện một người rất thẳng và quyết liệt trong công việc. Hãy giữ dữ kiện rõ ràng và đừng để nhịp căng biến thành xung đột không cần thiết."
    ],
    [
      "other",
      "Tôi nên học lá bài như thế nào cho đúng?",
      "Đừng học Kỵ Sĩ Kiếm thành một nhãn “độc miệng”. Hãy nhớ cấu trúc: Kỵ Sĩ là hành động và chuyển động; Kiếm là tư duy, lời nói và quyết định. Ghép lại, bạn có tốc độ trí óc rất cao — tích cực khi cần dứt khoát, tiêu cực khi thiếu kiểm soát."
    ]
  ],
  'cups-c1': [
    [
      "other",
      "Hình ảnh trên lá bài cho thấy điều gì?",
      "Kỵ Sĩ Cốc cưỡi ngựa và đưa chiếc cốc ra phía trước, như mang theo một lời mời, cảm xúc hoặc đề nghị. So với những Kỵ Sĩ khác, chuyển động của lá này mềm và chậm hơn. Nó nhấn vào cách một cảm xúc được mang đến cho người khác."
    ],
    [
      "other",
      "Từ khóa lớn nhất của lá này là gì?",
      "Từ khóa nổi bật nhất là lãng mạn. Ngoài ra còn có lời mời, quyến rũ, tưởng tượng, theo đuổi cảm xúc và lý tưởng hóa. Mặt trái là yêu cảm giác yêu hơn là thực sự hiểu người trước mặt."
    ],
    [
      "other",
      "Lá này miêu tả tính cách của một người như thế nào?",
      "Người này thường duyên dáng, biết bày tỏ cảm xúc và có xu hướng sống theo cảm hứng. Họ có thể rất lãng mạn và tinh tế, nhưng nếu chưa trưởng thành thì dễ hứa theo cảm xúc rồi đổi ý khi cảm xúc thay đổi."
    ],
    [
      "other",
      "Vì sao đây là cấp độ tiêu cực nhất trong bốn cấp Hoàng Gia?",
      "Không nên coi Kỵ Sĩ Cốc là “cấp tiêu cực nhất”. Mỗi Hofkarte có mặt sáng và mặt bóng. Với Kỵ Sĩ Cốc, rủi ro nằm ở việc bị cảm xúc và lý tưởng dẫn đi quá xa; điểm mạnh là khả năng chủ động mang tình cảm, nghệ thuật và sự dịu dàng đến cho người khác."
    ],
    [
      "love",
      "Anh ấy hoặc cô ấy nghĩ gì về tôi, và có thái độ như thế nào với mối quan hệ này?",
      "Người ấy có thể đang nhìn bạn qua một lăng kính khá lãng mạn và muốn tiến gần hơn. Họ dễ thể hiện bằng lời ngọt ngào, lời mời hoặc cử chỉ tình cảm. Hãy tận hưởng sự đẹp đẽ đó, nhưng để thời gian cho biết cảm xúc có đi kèm sự ổn định hay không."
    ],
    [
      "love",
      "Hồi còn trẻ, tôi thấy kiểu người này rất lãng mạn, điều đó có đúng không?",
      "Đúng, đây là một trong những hình ảnh lãng mạn nhất của bộ Hoàng Gia. Nhưng sự lãng mạn không tự động đồng nghĩa với một mối quan hệ lành mạnh hay bền vững. Hãy nhìn thêm vào sự nhất quán, tôn trọng ranh giới và khả năng giữ lời."
    ],
    [
      "love",
      "Hai chúng tôi hay cãi nhau, chúng tôi cần làm gì?",
      "Một hoặc cả hai có thể đang phản ứng theo cảm xúc rồi mong người kia tự hiểu. Hãy nói rõ nhu cầu thay vì thử lòng, im lặng để được dỗ hay dùng những cử chỉ lớn để che một vấn đề chưa giải quyết. Sự chân thành đơn giản sẽ hiệu quả hơn kịch tính."
    ],
    [
      "love",
      "Nếu cả hai chúng tôi đều mang năng lượng này thì sao?",
      "Hai bạn có thể tạo ra rất nhiều cảm xúc đẹp, nhưng cũng dễ cùng nhau lý tưởng hóa và né phần thực tế. Hãy giữ sự lãng mạn, đồng thời bàn rõ về thời gian, tiền bạc, ranh giới và cam kết. Cảm xúc càng đẹp càng cần một chiếc khung đủ chắc."
    ],
    [
      "other",
      "Tôi có nên để cảm xúc bộc lộ hết ra ngoài không?",
      "Bộc lộ cảm xúc không có nghĩa là phải nói hoặc làm mọi thứ ngay lúc cảm xúc vừa xuất hiện. Hãy cho mình quyền cảm nhận, rồi chọn cách thể hiện không làm tổn thương mình hay người khác. Trưởng thành cảm xúc là thành thật mà vẫn có tự điều chỉnh."
    ],
    [
      "career",
      "Thời gian tới tôi có tìm được công việc mới ưng ý không?",
      "Kỵ Sĩ Cốc có thể gợi một lời mời hoặc công việc khiến bạn thấy hứng thú, đặc biệt trong lĩnh vực sáng tạo, nghệ thuật, chăm sóc hay giao tiếp. Hãy kiểm tra thêm lương, điều kiện và đường phát triển, vì lá này nói nhiều về cảm giác phù hợp hơn là sự ổn định vật chất."
    ]
  ],
  'pentacles-c1': [
    [
      "other",
      "Lá này miêu tả tính cách của một người như thế nào?",
      "Kỵ Sĩ Xu là người bền bỉ, thực tế và có tinh thần trách nhiệm. Họ không cần đi nhanh; họ thích biết rõ mục tiêu rồi làm đều từng bước. Mặt trái là quá cứng nhắc, chỉ làm theo thói quen hoặc tiếp tục một con đường dù đã cần điều chỉnh."
    ],
    [
      "other",
      "Mặt tiêu cực của lá này là gì?",
      "Sự kiên trì có thể biến thành cố chấp, còn tính thực tế có thể biến thành tầm nhìn quá hẹp. Kỵ Sĩ Xu dễ tập trung vào việc trước mắt đến mức quên hỏi liệu mục tiêu ban đầu còn phù hợp hay không. Đôi khi cần dừng lại để kiểm tra hướng đi, không chỉ kiểm tra tiến độ."
    ],
    [
      "love",
      "Anh ấy hoặc cô ấy muốn gì ở tôi và ở mối quan hệ này?",
      "Người ấy có thể muốn một mối quan hệ ổn định, rõ ràng và có thể xây dần theo thời gian. Họ thường chứng minh sự quan tâm bằng việc có mặt, giữ lời và làm những điều thiết thực. Nhịp có thể chậm, nhưng chậm không đồng nghĩa với thiếu tình cảm."
    ],
    [
      "love",
      "Vì sao chúng tôi hay cãi nhau?",
      "Một người có thể cần sự ổn định và kế hoạch, trong khi người kia muốn linh hoạt hoặc nhiều cảm xúc hơn. Kỵ Sĩ Xu cũng có thể bám vào “cách vẫn làm” và khó đổi khi đối phương góp ý. Hãy phân biệt điều nào là giá trị cốt lõi và điều nào chỉ là thói quen có thể thương lượng."
    ],
    [
      "other",
      "Có ví dụ nào về sự thiển cận của lá này không?",
      "Ví dụ, bạn rất chăm chỉ tiết kiệm cho một mục tiêu nhưng không nhận ra mục tiêu ấy đã không còn phù hợp với cuộc sống hiện tại. Hoặc bạn hoàn thành mọi nhiệm vụ đúng quy trình nhưng không hỏi liệu có cách tốt hơn. Vấn đề không phải thiếu nỗ lực, mà là thiếu bước lùi để nhìn toàn cảnh."
    ],
    [
      "career",
      "Tôi đã thất nghiệp mấy tháng, tôi có tìm được công việc như ý không?",
      "Kỵ Sĩ Xu ủng hộ một con đường ổn định hơn là một bước ngoặt tức thời. Hãy kiên trì nộp hồ sơ, nâng kỹ năng và theo dõi từng cơ hội. Công việc phù hợp có thể đến qua quá trình đều đặn; lá bài không hứa thời điểm hay mức lương cụ thể."
    ],
    [
      "money",
      "Kỵ Sĩ Xu có kém về tiền bạc không?",
      "Không. Đây là một trong những năng lượng thực tế và có kỷ luật nhất khi nói về tiền. Điểm mạnh là tích lũy đều, lập kế hoạch và theo đuổi mục tiêu; điểm yếu là có thể quá thận trọng hoặc chỉ nhìn vào an toàn mà bỏ qua cơ hội hợp lý."
    ],
    [
      "career",
      "Tôi đang làm công việc văn phòng bình thường, thời gian tới công việc của tôi có thay đổi gì không?",
      "Bạn có thể bước vào giai đoạn cần làm đều, theo quy trình và hoàn thành một mục tiêu dài hơi. Sự thay đổi có thể không ồn ào mà đến từ trách nhiệm tăng dần, kỹ năng chắc hơn hoặc một mục tiêu rõ hơn. Đừng đánh giá thấp tiến bộ nhỏ nhưng bền."
    ],
    [
      "other",
      "Kỵ Sĩ Xu khác Kỵ Sĩ Gậy ở chỗ nào trong công việc?",
      "Kỵ Sĩ Gậy ưu tiên tốc độ, thử nghiệm và hứng thú; Kỵ Sĩ Xu ưu tiên độ chắc, quy trình và hoàn thành. Một người khởi động nhanh, người kia giữ nhịp tốt. Trong thực tế, công việc khỏe nhất thường cần cả hai: đủ lửa để bắt đầu và đủ bền để đi đến cuối."
    ]
  ]
});

/* batch 21 - the four Queens */

Object.assign(ASK.vi, {
  'wands-c2': [
    [
      "other",
      "Hình ảnh trên lá bài cho thấy điều gì?",
      "Nữ Hoàng Gậy ngồi thẳng trên ngai, tay cầm gậy và hoa hướng dương. Hình ảnh kết hợp lửa của Gậy với sự điềm tĩnh của một Nữ Hoàng: tự tin, ấm áp, sáng tạo và có khả năng dẫn dắt mà không cần lúc nào cũng áp đảo."
    ],
    [
      "other",
      "Nữ Hoàng khác Vua ở chỗ nào?",
      "Cả Nữ Hoàng và Vua đều tượng trưng cho mức độ trưởng thành với nguyên tố của mình. Nữ Hoàng thường thể hiện năng lượng theo hướng tiếp nhận, nuôi dưỡng và ảnh hưởng từ bên trong; Vua thiên về hành động, quyết định và tạo cấu trúc bên ngoài. Đây là hai kiểu biểu hiện, không phải thứ bậc hơn kém."
    ],
    [
      "other",
      "Vì sao Nữ Hoàng Gậy cân bằng hơn Vua Gậy?",
      "Trong nhiều cách đọc truyền thống, Nữ Hoàng Gậy pha sự nhiệt thành của Lửa với khả năng giữ nhịp và quan sát. Vì vậy nàng có thể vừa chủ động vừa biết lùi lại đúng lúc. Tuy nhiên, “cân bằng hơn” chỉ là một cách học biểu tượng, không phải quy luật cứng cho mọi trải bài."
    ],
    [
      "other",
      "Lá này miêu tả tính cách của một người như thế nào?",
      "Người này thường tự tin, nhiệt tình, có sức hút và biết tạo động lực cho người khác. Họ không nhất thiết giỏi nhất phòng, nhưng thường dám đứng lên, thử trước và khiến mọi người tin rằng việc đó có thể làm được. Mặt trái là dễ tự ái hoặc muốn kiểm soát hình ảnh của mình."
    ],
    [
      "other",
      "Phong thái của Nữ Hoàng Gậy là như thế nào?",
      "Phong thái của lá này là ấm áp nhưng vững vàng. Người mang năng lượng này thường không cần nói quá nhiều để chứng minh mình có mặt; họ tạo cảm giác tự tin qua cách đứng, nói và quyết định. Sự cuốn hút đến từ việc họ thoải mái với chính mình."
    ],
    [
      "love",
      "Anh ấy hoặc cô ấy có tình cảm với tôi không?",
      "Nữ Hoàng Gậy là tín hiệu tích cực cho sự thu hút, thiện cảm và hứng thú. Người ấy có thể thấy bạn nổi bật hoặc rất muốn ở gần bạn. Tuy nhiên, một lá bài không thể xác nhận chắc chắn tình cảm của người khác; hãy để hành động và sự rõ ràng ngoài đời bổ sung cho trải bài."
    ],
    [
      "love",
      "Hai chúng tôi hay cãi nhau, chúng tôi cần làm gì để cải thiện?",
      "Lá này khuyên hai bạn vừa thẳng thắn vừa giữ sự tôn trọng. Đừng biến tự tin thành hơn thua, nhưng cũng đừng im lặng chỉ để tránh xung đột. Nói rõ nhu cầu, giữ ranh giới và nhớ rằng một mối quan hệ tốt không cần ai phải thu nhỏ mình."
    ],
    [
      "career",
      "Trong thời gian tới, tôi có tìm được công việc như ý không?",
      "Nữ Hoàng Gậy ủng hộ việc thể hiện bản thân tốt trong hồ sơ, phỏng vấn và networking. Bạn có thể thu hút một cơ hội phù hợp nếu chủ động và cho người khác thấy mình làm được gì. Hãy tiếp tục ứng tuyển thay vì chỉ chờ, nhưng tránh gửi hồ sơ tràn lan thiếu chọn lọc."
    ],
    [
      "career",
      "Tôi thất nghiệp đã lâu mà chưa có ai gọi, tôi phải làm sao?",
      "Đừng để thời gian thất nghiệp biến thành câu chuyện rằng bạn “không đủ tốt”. Hãy kiểm tra lại CV, hồ sơ, cách tìm việc và nhờ người khác góp ý. Nữ Hoàng Gậy nhắc bạn giữ sự tự tin dựa trên năng lực thật, rồi thể hiện nó rõ hơn."
    ],
    [
      "career",
      "Tôi đang làm công việc văn phòng bình thường, thời gian tới công việc có gì thay đổi không?",
      "Bạn có thể được giao vai trò cần chủ động hơn: dẫn một nhóm nhỏ, hướng dẫn người mới, trình bày ý tưởng hoặc đại diện cho nhóm. Không nhất thiết là thăng chức chính thức. Điểm chính là người khác bắt đầu trông vào khả năng dẫn dắt và tạo động lực của bạn."
    ]
  ],
  'swords-c2': [
    [
      "other",
      "Hình ảnh trên lá bài cho thấy điều gì?",
      "Nữ Hoàng Kiếm ngồi trên ngai, một tay cầm kiếm thẳng và tay kia mở ra phía trước. Hình ảnh gợi sự sáng suốt, ranh giới rõ và khả năng nhìn thẳng vào sự thật mà vẫn sẵn sàng lắng nghe."
    ],
    [
      "other",
      "Lá này miêu tả tính cách của một người như thế nào?",
      "Người này thường thông minh, độc lập, quan sát tốt và giao tiếp rõ ràng. Họ đánh giá vấn đề bằng lý trí nhưng không nhất thiết lạnh lùng. Trải nghiệm đã giúp họ biết điều gì đáng nói, điều gì nên bỏ qua và ranh giới nào cần giữ."
    ],
    [
      "other",
      "Người này có độc mồm không?",
      "Không nhất thiết. Nữ Hoàng Kiếm nói về sự thẳng và sắc hơn là cố ý làm đau người khác. Ở mặt sáng, họ nói điều cần nói với sự chính xác và biết lắng nghe; ở mặt bóng, sự phòng thủ hoặc thất vọng có thể khiến lời nói lạnh và cắt."
    ],
    [
      "love",
      "Tình cảm người này dành cho tôi thế nào?",
      "Người ấy có thể có tình cảm nhưng muốn hiểu mối quan hệ bằng cả trái tim lẫn lý trí. Họ quan tâm đến sự tương thích, cách giao tiếp, giá trị và khả năng tôn trọng nhau. Tình cảm có thể kín đáo hơn kiểu lãng mạn, nhưng không vì thế mà thiếu chân thành."
    ],
    [
      "love",
      "Người này có thật lòng không?",
      "Lá này không cho phép kết luận chắc chắn về sự thật lòng. Nó cho thấy một người có xu hướng cân nhắc kỹ và cần sự rõ ràng trước khi mở lòng hoàn toàn. Hãy nhìn xem lời nói có đi cùng hành động và họ có tôn trọng ranh giới của bạn hay không."
    ],
    [
      "love",
      "Đây có phải là người dành cho tôi không?",
      "Điều đó phụ thuộc vào điều bạn cần trong một mối quan hệ. Nếu bạn coi trọng sự rõ ràng, độc lập và giao tiếp thẳng, năng lượng này có thể rất hợp. Nếu bạn cần nhiều biểu hiện tình cảm, hai người có thể phải học cách dịch “ngôn ngữ yêu” của nhau."
    ],
    [
      "love",
      "Vì sao chúng tôi hay cãi nhau?",
      "Có thể hai bạn đều đưa lý lẽ ra trước cảm xúc, hoặc một người thấy mình đang “nói sự thật” trong khi người kia cảm thấy bị phán xét. Hãy nói cả sự kiện lẫn cảm xúc, và phân biệt giữa ranh giới rõ ràng với cách nói lạnh lùng."
    ],
    [
      "love",
      "Có ví dụ nào cho kiểu cãi nhau đó không?",
      "Ví dụ, một người nói “việc này không hợp lý” trong khi điều họ thật sự muốn nói là “mình thấy không được coi trọng”. Người kia đáp lại bằng thêm lý lẽ và cuộc nói chuyện càng xa cảm xúc gốc. Nữ Hoàng Kiếm khuyên gọi đúng vấn đề mà không bỏ phần con người ra ngoài."
    ],
    [
      "career",
      "Trong thời gian tới, tôi có tìm được công việc như ý không?",
      "Lá này phù hợp với công việc cần phân tích, giao tiếp, viết, nghiên cứu, luật, chiến lược hoặc ra quyết định độc lập. Cơ hội có thể đến khi bạn trình bày năng lực rõ ràng và chọn lọc. Hãy đánh giá bằng tiêu chí thực tế thay vì chỉ vì một buổi phỏng vấn có cảm giác tốt."
    ],
    [
      "career",
      "Tôi đang làm công việc văn phòng bình thường, thời gian tới công việc của tôi có thay đổi gì không?",
      "Bạn có thể phải đưa ra quyết định rõ hơn, đặt ranh giới trong công việc hoặc trở thành người được hỏi ý kiến vì khả năng phân tích. Một cuộc trao đổi thẳng có thể cần thiết. Hãy chuẩn bị dữ kiện và giữ cách nói bình tĩnh, chính xác."
    ]
  ],
  'cups-c2': [
    [
      "other",
      "Hình ảnh trên lá bài cho thấy điều gì?",
      "Nữ Hoàng Cốc ngồi bên nước và nhìn chăm chú vào chiếc cốc được trang trí kín. Hình ảnh gợi một đời sống cảm xúc sâu, trực giác mạnh và khả năng giữ không gian cho cảm xúc mà không cần phô bày tất cả ra ngoài."
    ],
    [
      "other",
      "Lá này miêu tả tính cách của một người như thế nào?",
      "Người này thường đồng cảm, tinh tế, giàu trực giác và dễ nhận ra cảm xúc của người khác. Họ có thể lắng nghe rất tốt và tạo cảm giác an toàn. Mặt trái là hấp thụ quá nhiều cảm xúc xung quanh hoặc quên ranh giới của mình."
    ],
    [
      "other",
      "Vì sao nói người này đã chữa lành cho bản thân?",
      "Không nên mặc định rằng cứ rút Nữ Hoàng Cốc là người đó đã “chữa lành xong”. Lá bài mô tả khả năng nhận biết và chăm sóc cảm xúc khá trưởng thành. Họ có thể đã học được nhiều từ trải nghiệm, nhưng vẫn là con người và vẫn có những phần cần được chăm sóc."
    ],
    [
      "love",
      "Anh ấy hoặc cô ấy dành cho tôi tình cảm như thế nào?",
      "Đây là một lá ấm áp cho sự quan tâm, đồng cảm và tình cảm sâu. Người ấy có thể thật sự để ý đến cảm xúc của bạn và muốn bạn cảm thấy an toàn. Tuy nhiên, hãy nhìn cả cách họ thể hiện và giữ ranh giới, vì tình cảm tốt vẫn cần hành động rõ ràng."
    ],
    [
      "love",
      "Vì sao chúng tôi hay cãi nhau?",
      "Một người có thể đang cảm quá nhiều nhưng nói quá ít, còn người kia lại không biết mình cần đáp ứng điều gì. Cũng có thể hai bạn dễ hấp thụ tâm trạng của nhau. Hãy nói rõ nhu cầu và đừng biến sự đồng cảm thành việc phải đoán suy nghĩ."
    ],
    [
      "love",
      "Người này từ chối người khác như thế nào?",
      "Ở mặt trưởng thành, họ thường cố từ chối với sự tử tế và để ý cảm xúc của người kia. Họ có thể nói mềm nhưng vẫn giữ ranh giới. Mặt trái là vì sợ làm ai buồn mà trì hoãn câu trả lời hoặc gửi tín hiệu mơ hồ."
    ],
    [
      "career",
      "Trong thời gian tới, tôi có tìm được công việc ưng ý không?",
      "Nữ Hoàng Cốc có thể phù hợp với công việc chăm sóc, tư vấn, sáng tạo, nghệ thuật, dịch vụ hoặc bất cứ nơi nào cần sự tinh tế với con người. Nó gợi cảm giác phù hợp hơn là mức lương cụ thể. Hãy kiểm tra cả điều kiện thực tế để cảm xúc và nhu cầu vật chất cùng được đáp ứng."
    ],
    [
      "career",
      "Hướng đi thứ hai trong công việc của tôi là gì?",
      "Một hướng khác là dùng khả năng lắng nghe, sáng tạo hoặc hiểu con người nhiều hơn trong công việc hiện tại. Bạn không nhất thiết phải đổi nghề hoàn toàn; đôi khi chỉ cần chuyển sang vai trò có nhiều tư vấn, chăm sóc khách hàng, thiết kế trải nghiệm hoặc làm việc với cộng đồng."
    ],
    [
      "career",
      "Tôi đang làm công việc văn phòng bình thường, thời gian tới có điều gì thay đổi không?",
      "Bạn có thể được giao phần việc cần nhiều sự khéo léo với con người hoặc trở thành người mà đồng nghiệp tìm đến để chia sẻ. Hãy dùng sự đồng cảm nhưng đừng nhận hết cảm xúc của tập thể vào mình. Ranh giới tốt giúp bạn hỗ trợ người khác mà không kiệt sức."
    ],
    [
      "other",
      "Lá này có mặt tiêu cực nào không?",
      "Có. Đồng cảm quá mức có thể thành dễ bị cuốn vào cảm xúc của người khác, lý tưởng hóa, khó nói không hoặc tự bỏ quên nhu cầu của mình. Mặt sáng của Nữ Hoàng Cốc là cảm sâu nhưng vẫn biết đâu là cảm xúc của mình và đâu là của người khác."
    ]
  ],
  'pentacles-c2': [
    [
      "other",
      "Hình ảnh trên lá bài cho thấy điều gì?",
      "Nữ Hoàng Xu ngồi giữa một khung cảnh xanh tốt, nâng đồng Xu trong tay như đang chăm một thứ có giá trị. Hình ảnh gắn vật chất với sự nuôi dưỡng: xây sự ổn định, chăm cơ thể, nhà cửa, tiền bạc và những gì cần thời gian để lớn."
    ],
    [
      "other",
      "Lá này miêu tả tính cách của một người như thế nào?",
      "Người này thường thực tế, đáng tin, biết chăm lo và có khả năng biến sự quan tâm thành việc cụ thể. Họ nghĩ đến tiền, sức khỏe, nhà cửa và những nhu cầu đời thường mà không xem chúng là chuyện nhỏ. Mặt trái là ôm quá nhiều trách nhiệm hoặc đo giá trị bản thân bằng việc mình hữu ích đến đâu."
    ],
    [
      "other",
      "Nữ Hoàng Xu khác Vua Xu ở chỗ nào?",
      "Cả hai đều thực tế và quan tâm đến sự ổn định. Nữ Hoàng Xu thường thể hiện qua chăm sóc, nuôi dưỡng và quản lý nguồn lực gần gũi; Vua Xu thiên về xây hệ thống, sở hữu, quản trị và thành quả dài hạn. Đây là hai sắc thái bổ sung cho nhau."
    ],
    [
      "love",
      "Người này nghĩ gì về tôi, và có yêu tôi thật lòng không?",
      "Người ấy có thể nhìn mối quan hệ theo hướng nghiêm túc và thực tế: liệu hai bạn có chăm được cho nhau và xây được đời sống ổn định hay không. Điều đó không có nghĩa tình cảm chỉ dựa trên điều kiện. Hãy nhìn xem sự thực tế có đi cùng sự ấm áp, tôn trọng và đầu tư đều đặn hay không."
    ],
    [
      "other",
      "Lá Xu có ý nghĩa tiêu cực không?",
      "Có. Mọi chất đều có mặt bóng. Với Xu, sự ổn định có thể thành bám víu, thực tế thành thực dụng, tiết kiệm thành sợ thiếu, chăm sóc thành kiểm soát. Hãy đọc mức độ và bối cảnh thay vì mặc định Xu luôn tốt về tiền."
    ],
    [
      "love",
      "Vì sao chúng tôi hay cãi nhau?",
      "Mâu thuẫn có thể xoay quanh tiền bạc, việc nhà, thời gian, trách nhiệm hoặc cảm giác một người đang gánh quá nhiều. Có khi cả hai đều yêu theo kiểu “làm cho nhau” nhưng quên nói lời cần nói. Hãy chia việc rõ và hỏi nhau điều gì thật sự khiến mỗi người cảm thấy được quan tâm."
    ],
    [
      "career",
      "Trong thời gian tới, tôi có tìm được công việc ưng ý không?",
      "Nữ Hoàng Xu là tín hiệu tốt cho một môi trường ổn định, thực tế và có thể nuôi dưỡng cuộc sống của bạn. Tuy nhiên, đừng dùng lá bài để hứa mức lương hay kết quả tuyển dụng. Hãy ưu tiên nơi có điều kiện rõ, văn hóa bền và khối lượng công việc bạn thực sự duy trì được."
    ],
    [
      "money",
      "Tôi đang làm công việc văn phòng bình thường, thời gian tới công việc của tôi sẽ thế nào?",
      "Bạn có thể được tin tưởng giao quản lý nguồn lực, khách hàng, ngân sách hoặc một phần việc cần sự ổn định. Tài chính có thể trở nên có tổ chức hơn nếu bạn làm đều và quản lý tốt. Đừng nhận thêm mọi việc chỉ vì người khác biết bạn đáng tin."
    ],
    [
      "other",
      "Trong bốn lá Nữ Hoàng thì lá nào tích cực nhất?",
      "Không có Nữ Hoàng nào “tích cực nhất” trong mọi câu hỏi. Mỗi lá mạnh ở một lĩnh vực: Gậy ở tự tin và hành động, Kiếm ở sáng suốt, Cốc ở cảm xúc, Xu ở sự ổn định và chăm lo. Lá phù hợp nhất phụ thuộc vào câu hỏi và vị trí trong trải bài."
    ]
  ]
});

/* batch 22 - the four Kings */

Object.assign(ASK.vi, {
  'wands-c3': [
    [
      "other",
      "Hình ảnh trên lá bài cho thấy điều gì?",
      "Vua Gậy ngồi trên ngai với cây gậy trong tay, xung quanh là biểu tượng của Lửa. Hình ảnh nói về một người đã biết dùng nhiệt huyết để dẫn đường: nhìn xa, quyết đoán và sẵn sàng chịu trách nhiệm cho hướng đi mình chọn."
    ],
    [
      "other",
      "Lá này miêu tả tính cách của một người như thế nào?",
      "Người này thường tự tin, nhiều tham vọng, có tầm nhìn và thích chủ động. Họ dễ trở thành người khởi xướng hoặc lãnh đạo vì có khả năng truyền năng lượng cho người khác. Mặt trái là nóng tính, áp đặt hoặc quá tin vào ý mình."
    ],
    [
      "other",
      "Người này có phải là người không biết sợ không?",
      "Không. Dũng cảm không có nghĩa là không biết sợ. Vua Gậy thường nhận ra rủi ro nhưng vẫn quyết định hành động khi thấy mục tiêu xứng đáng. Mặt trưởng thành của lá này là biết dùng nỗi sợ như thông tin, không để nó cầm lái."
    ],
    [
      "other",
      "Vua Gậy khác Nữ Hoàng Gậy như thế nào?",
      "Cả hai đều tự tin và có sức hút. Nữ Hoàng Gậy thường dẫn dắt bằng ảnh hưởng, sự ấm áp và khả năng khích lệ; Vua Gậy thiên về đặt hướng, ra quyết định và kéo mọi người tiến về phía mục tiêu. Đây là hai phong cách, không phải ai cao hơn ai."
    ],
    [
      "career",
      "Khi rút được lá Vua, có phải người đó đang làm lãnh đạo không?",
      "Không nhất thiết. Lá Vua có thể mô tả một người có quyền quyết định, một vai trò cần tinh thần làm chủ, hoặc đơn giản là cách bạn nên tiếp cận tình huống. Đừng biến cấp bậc biểu tượng thành chức danh nghề nghiệp cố định."
    ],
    [
      "love",
      "Anh ấy hoặc cô ấy nghĩ gì về tôi?",
      "Người ấy có thể thấy bạn hấp dẫn và muốn chủ động đưa mối quan hệ tiến lên. Họ thường biết mình muốn gì và có thể khá rõ ràng về ý định. Tuy nhiên, hãy để ý xem sự chủ động đó có tôn trọng nhịp và lựa chọn của bạn hay không."
    ],
    [
      "love",
      "Vì sao chúng tôi hay cãi nhau?",
      "Mâu thuẫn dễ xảy ra khi một hoặc cả hai đều muốn cầm lái. Sự tự tin có thể biến thành cố chấp, và quyết đoán có thể nghe như mệnh lệnh. Hãy thống nhất chuyện nào cần người dẫn, chuyện nào cần hai người cùng quyết."
    ],
    [
      "career",
      "Trong thời gian tới, tôi có tìm được công việc ưng ý không?",
      "Vua Gậy ủng hộ vai trò có nhiều chủ động, sáng tạo, lãnh đạo hoặc cơ hội xây thứ gì đó của riêng bạn. Hãy nhắm tới nơi cho phép bạn dùng tầm nhìn và chịu trách nhiệm. Lá bài không đảm bảo kết quả tuyển dụng, nhưng khuyên bạn thể hiện rõ giá trị và định hướng của mình."
    ],
    [
      "career",
      "Tôi đang làm công việc văn phòng bình thường, thời gian tới tôi cần lưu ý điều gì?",
      "Bạn có thể được yêu cầu dẫn một dự án, đưa ra quyết định lớn hơn hoặc làm việc với một người có phong cách rất mạnh. Hãy chủ động nhưng đừng ôm hết quyền kiểm soát. Lãnh đạo tốt là tạo hướng rõ và để người khác có chỗ đóng góp."
    ],
    [
      "other",
      "Lá này tích cực hay tiêu cực?",
      "Vua Gậy không tự động tốt hay xấu. Mặt sáng là tầm nhìn, bản lĩnh và khả năng dẫn dắt; mặt bóng là cái tôi lớn, nóng nảy và áp đặt. Câu hỏi, vị trí và các lá đi kèm cho biết năng lượng đang được dùng theo hướng nào."
    ]
  ],
  'swords-c3': [
    [
      "other",
      "Hình ảnh trên lá bài cho thấy điều gì?",
      "Vua Kiếm ngồi thẳng trên ngai, cầm kiếm dựng đứng. Hình ảnh nhấn mạnh lý trí, quyền quyết định, nguyên tắc và khả năng nhìn vấn đề một cách có hệ thống. Đây là trí tuệ được dùng để đưa ra phán đoán, không chỉ để quan sát."
    ],
    [
      "other",
      "Vua Kiếm khác Nữ Hoàng Kiếm ở chỗ nào?",
      "Cả hai đều sắc sảo và coi trọng sự thật. Nữ Hoàng Kiếm thường nhấn vào nhận biết, ranh giới và sự độc lập; Vua Kiếm thiên về ra quyết định, xây quy tắc và chịu trách nhiệm cho phán đoán. Sự khác nhau nằm ở cách dùng trí tuệ, không phải ai thông minh hơn."
    ],
    [
      "other",
      "Sự tàn nhẫn ở đây có nghĩa là gì?",
      "Từ “tàn nhẫn” dễ làm lá bài bị hiểu quá nặng. Mặt bóng của Vua Kiếm đúng hơn là quá lạnh, quá nguyên tắc hoặc đặt hiệu quả lên trên cảm xúc con người. Mặt sáng là có thể đưa ra quyết định khó mà vẫn dựa trên bằng chứng và đạo đức."
    ],
    [
      "other",
      "Vua Kiếm có độc mồm như Kỵ Sĩ Kiếm không?",
      "Vua Kiếm có thể rất thẳng, nhưng ở mức trưởng thành họ biết chọn từ và hiểu hậu quả của lời nói. Kỵ Sĩ dễ phản ứng nhanh; Vua thiên về nói có chủ đích. Mặt bóng xuất hiện khi sự thẳng thắn biến thành coi thường hoặc dùng lý lẽ để áp đảo."
    ],
    [
      "love",
      "Người này nghĩ gì về tôi và về mối quan hệ này?",
      "Người ấy có thể đang đánh giá mối quan hệ rất nghiêm túc bằng lý trí: hai bạn có cùng giá trị, giao tiếp được và xây được tương lai hay không. Họ có thể ít phô bày cảm xúc, nhưng điều đó không tự động nghĩa là không thật lòng. Hãy nhìn sự nhất quán và mức độ tôn trọng."
    ],
    [
      "love",
      "Người này tỏ tình theo cách nào?",
      "Họ thường thích sự rõ ràng hơn trò đoán ý. Nếu muốn tiến tới, họ có thể nói thẳng mình muốn gì và hỏi bạn nghĩ sao. Cách này có thể ít hoa mỹ nhưng vẫn ấm áp nếu họ biết lắng nghe câu trả lời thay vì chỉ yêu cầu một quyết định."
    ],
    [
      "love",
      "Vì sao chúng tôi hay cãi nhau?",
      "Một người có thể đang biến mọi vấn đề thành bài toán cần giải trong khi người kia cần được lắng nghe trước. Hoặc cả hai tranh luận dựa trên “đúng–sai” quá mạnh. Hãy phân biệt lúc nào cần giải pháp và lúc nào chỉ cần xác nhận cảm xúc của nhau."
    ],
    [
      "career",
      "Tôi đã thất nghiệp mấy tháng, tôi có tìm được việc không?",
      "Vua Kiếm hợp với việc rà chiến lược tìm việc bằng lý trí: chọn ngành, chỉnh CV, luyện phỏng vấn và dùng dữ liệu để biết phần nào đang không hiệu quả. Những công việc thiên về phân tích, công nghệ, nghiên cứu, luật hoặc giao tiếp chuyên môn có thể hợp, nhưng lá bài không đảm bảo bạn sẽ được tuyển."
    ],
    [
      "career",
      "Vị trí của tôi trong công việc mới sẽ như thế nào?",
      "Lá này có thể gợi một vai trò cần quyền phán đoán, trách nhiệm, tư duy chiến lược hoặc giao tiếp chuyên môn. Điều đó không nhất thiết là chức danh quản lý. Hãy xem mô tả công việc thực tế để biết mức quyền hạn thay vì suy ra từ cấp “Vua”."
    ],
    [
      "career",
      "Tôi đang làm công việc văn phòng bình thường, thời gian tới công việc của tôi có thay đổi gì không?",
      "Bạn có thể phải xử lý một quyết định quan trọng, quy trình mới hoặc vấn đề cần phân tích kỹ. Một người có quyền quyết định và phong cách rất lý trí cũng có thể trở nên quan trọng. Chuẩn bị dữ kiện, ghi lại thỏa thuận và giữ trao đổi chuyên nghiệp."
    ]
  ],
  'cups-c3': [
    [
      "other",
      "Hình ảnh trên lá bài cho thấy điều gì?",
      "Vua Cốc ngồi trên ngai giữa mặt nước đang chuyển động. Hình ảnh cho thấy cảm xúc vẫn tồn tại quanh ông, nhưng ông không bị chúng cuốn đi. Đây là biểu tượng của sự trưởng thành cảm xúc, bình tĩnh và khả năng giữ vững mình khi hoàn cảnh dao động."
    ],
    [
      "other",
      "Lá này miêu tả tính cách của một người như thế nào?",
      "Người này thường điềm tĩnh, biết lắng nghe, giàu cảm xúc nhưng không để cảm xúc điều khiển mọi quyết định. Họ có thể rất ấm áp và biết nâng đỡ người khác. Mặt trái là giấu cảm xúc quá kỹ hoặc dùng sự bình tĩnh để né một cuộc nói chuyện cần thiết."
    ],
    [
      "love",
      "Người này có tỏ tình với tôi không?",
      "Vua Cốc có thể gợi một người biết mình cảm thấy gì và đủ trưởng thành để bày tỏ, nhưng Tarot không thể chắc chắn rằng họ sẽ tỏ tình. Hãy nhìn những dấu hiệu thật: sự chủ động, nhất quán và cách họ nói về mối quan hệ."
    ],
    [
      "love",
      "Anh ấy hoặc cô ấy dành cho tôi tình cảm như thế nào?",
      "Đây là một lá đẹp cho tình cảm sâu, sự quan tâm và khả năng yêu theo cách chín chắn. Người ấy có thể thật sự muốn hiểu và chăm sóc cảm xúc của bạn. Tuy nhiên, độ sâu của tình cảm vẫn cần được xác nhận bằng hành động và giao tiếp ngoài đời."
    ],
    [
      "love",
      "Hai chúng tôi yêu nhau nhiều năm nhưng hay cãi nhau, vì sao lại như vậy?",
      "Cãi nhau không có nghĩa là không còn thương. Với Vua Cốc, vấn đề có thể là một người đang giữ quá nhiều cảm xúc trong lòng để “giữ bình tĩnh”, hoặc một người luôn đóng vai người điều hòa đến mức nhu cầu riêng bị bỏ quên. Hai bạn cần nói cả những điều khó nói, không chỉ cố giữ hòa khí."
    ],
    [
      "career",
      "Trong thời gian tới, tôi có tìm được công việc như ý không?",
      "Vua Cốc phù hợp với công việc cần sự điềm tĩnh, giao tiếp với con người, cố vấn, sáng tạo, chăm sóc hoặc quản lý cảm xúc trong tình huống áp lực. Nó có thể cho thấy sự phù hợp về môi trường nhưng không nói chắc về lương hay kết quả tuyển dụng."
    ],
    [
      "other",
      "Làm sao để tôi biết công việc đó có mang lại tiền hay không?",
      "Tarot có thể giúp bạn đặt thêm câu hỏi về tài chính, nhưng để biết công việc có “mang lại tiền” hay không, hãy kiểm tra mức lương, phụ cấp, chi phí đi lại và cơ hội tăng thu nhập thực tế. Một lá Cốc nói về trải nghiệm cảm xúc nhiều hơn con số."
    ],
    [
      "career",
      "Hướng đi thứ hai trong công việc của tôi là gì?",
      "Một hướng khác là những vai trò cần trí tuệ cảm xúc: tư vấn, chăm sóc khách hàng, quản lý con người, giáo dục, nghệ thuật, dịch vụ hoặc công việc hỗ trợ. Bạn cũng có thể mang kỹ năng này vào nghề hiện tại thay vì phải đổi ngành hoàn toàn."
    ],
    [
      "career",
      "Tôi đang làm công việc văn phòng bình thường, thời gian tới có điều gì thay đổi không?",
      "Bạn có thể được giao tình huống cần sự bình tĩnh, xử lý con người hoặc làm trung gian giữa các bên. Đây là lúc tốt để dùng sự điềm tĩnh, nhưng đừng biến mình thành người phải gánh cảm xúc của cả đội. Giúp đỡ và giữ ranh giới có thể cùng tồn tại."
    ],
    [
      "other",
      "Lá này có thể miêu tả một người cụ thể không?",
      "Có. Hofkarte thường có thể mô tả một người, một vai trò hoặc một cách hành xử. Vua Cốc có thể là người điềm tĩnh, biết lắng nghe và xử lý cảm xúc tốt. Chỉ nên gắn lá với một người cụ thể khi bối cảnh trải bài và thực tế thật sự khớp."
    ]
  ],
  'pentacles-c3': [
    [
      "other",
      "Hình ảnh trên lá bài cho thấy điều gì?",
      "Vua Xu ngồi trên ngai giữa những biểu tượng của sự sung túc và thiên nhiên. Hình ảnh nói về thành quả được xây lâu dài: quản lý tiền bạc, nguồn lực, công việc và những giá trị có thể duy trì qua thời gian."
    ],
    [
      "other",
      "Lá này miêu tả tính cách của một người như thế nào?",
      "Người này thường thực tế, ổn định, kiên nhẫn và giỏi quản lý nguồn lực. Họ thích kết quả bền hơn cảm giác nhất thời và thường nghĩ theo đường dài. Mặt trái là quá coi trọng địa vị, tiền bạc, kiểm soát hoặc sự an toàn."
    ],
    [
      "love",
      "Anh ấy hoặc cô ấy dành cho tôi tình cảm như thế nào?",
      "Người ấy có thể nhìn mối quan hệ theo hướng lâu dài và thực tế: cùng xây cuộc sống, tài chính, nhà cửa hoặc kế hoạch chung. Sự thực tế không có nghĩa tình yêu kém chân thành. Hãy nhìn xem họ có ấm áp, tôn trọng và đầu tư cảm xúc chứ không chỉ cung cấp vật chất hay không."
    ],
    [
      "love",
      "Yêu người này có gì khác so với yêu người khác?",
      "Năng lượng này thường ít phô trương và ổn định hơn kiểu tình yêu bùng cháy. Họ có thể thể hiện bằng việc giữ lời, có mặt, lập kế hoạch và xây sự an toàn. Điều quan trọng là đừng nhầm sự ổn định với quyền kiểm soát hoặc xem vật chất là thay thế cho sự gần gũi."
    ],
    [
      "love",
      "Hai chúng tôi yêu nhau nhiều năm nhưng hay cãi nhau, liệu có đến mức phải chia tay không?",
      "Một lá bài không thể quyết định hai bạn có chia tay hay không. Vua Xu thường đưa câu chuyện về giá trị lâu dài: tiền bạc, gia đình, nơi sống, mức độ cam kết và cách xây tương lai. Nếu xung đột nằm ở đây, hai bạn cần nói rõ điều nào có thể thỏa hiệp và điều nào là giá trị cốt lõi."
    ],
    [
      "love",
      "Khi nào thì hai người buộc phải chia tay?",
      "Không có lá bài nào quy định rằng hai người “buộc phải” chia tay. Tuy nhiên, nếu các giá trị cốt lõi như con cái, hôn nhân, an toàn, tôn trọng hoặc cách sống hoàn toàn không thể dung hòa, kết thúc mối quan hệ có thể là một lựa chọn lành mạnh. Quyết định đó thuộc về hai người, không thuộc về Tarot."
    ],
    [
      "money",
      "Thời gian tới tôi có tìm được công việc không?",
      "Vua Xu là biểu tượng tốt cho sự ổn định và năng lực vật chất, nhưng không đảm bảo một công việc hay mức lương cụ thể. Hãy ưu tiên cơ hội có thu nhập, điều kiện và đường phát triển rõ ràng. Nếu bạn nhắm vai trò có trách nhiệm quản lý hoặc kinh doanh, lá này đặc biệt phù hợp về mặt biểu tượng."
    ],
    [
      "money",
      "Tôi đang làm công việc văn phòng bình thường, thời gian tới công việc có gì thay đổi không?",
      "Bạn có thể được giao thêm trách nhiệm, quản lý nguồn lực hoặc nhìn thấy cơ hội tăng thu nhập theo hướng bền vững. Một người có ảnh hưởng về tài chính hoặc quản lý cũng có thể xuất hiện. Hãy kiểm tra mọi thay đổi bằng thông tin thật thay vì coi lá bài là lời hứa thăng chức."
    ],
    [
      "other",
      "Có ví dụ nào về việc rút thêm lá để đào sâu không?",
      "Có. Nếu Vua Xu khiến bạn nghĩ đến một cấp trên, lá tiếp theo có thể được quy định trước để hỏi “người này ảnh hưởng thế nào đến công việc của mình?”. Ví dụ Ba Xu có thể gợi hợp tác hoặc xây dựng nhóm. Cách tốt nhất là đặt câu hỏi cụ thể cho từng lá thêm, thay vì rút liên tục cho đến khi gặp câu trả lời mình thích."
    ]
  ]
});

/* keywords batch 1 - all 22 Majors.
   the reader teaches every card as a positive keyword set and a negative one, and
   says outright that she does not read reversals -- she learns both senses of
   the upright card instead. Where she says a card has no negative (or no
   positive) sense at all, that side is simply left out here.
   Her own trick for deriving the negatives: put "quá" (too) in front of the
   positives. Too capable, too masculine, too active. */

/* keywords batch 2 - the four Threes */

/* keywords batch 3 - the four Fours */

/* keywords batch 4 - the four Fives */

/* keywords batch 5 - the four Sixes */

/* keywords batch 6 - the four Sevens */

/* keywords batch 07 - the four Aces and the four Twos */

/* ---- the same 540 questions in English (review sections 20 and 22) ---- */

Object.assign(ASK.en, {
'major-0': [
  ['love', 'What will my next partner be like?',
   'Your next partner is likely to be someone who loves exploring. They are drawn to new experiences and dislike the feeling that every day looks the same. Life with them can feel exciting, but they may not be thinking about long-term commitment or marriage yet. One card is not enough to confirm that, so draw more if you want a clearer answer. If you are similar, the relationship could be lively and adventurous, but also a little reckless. For something lasting, it helps to share core values while having enough differences to balance each other. When two people are too alike, their weak spots can be doubled as well.'],
  ['love', 'We are arguing. Should I break up with them?',
   'Whether to end a relationship is a sensitive question. As a general reading principle, understand the situation and draw more cards before giving firm advice. If the conflict is mostly about small things, The Fool does not automatically point to a breakup. It can suggest that the relationship has become too repetitive and needs something fresh. Trying a new activity together, a short trip or a new shared interest may help. If the relationship is genuinely harmful, however, The Fool can support stepping outside what is familiar and choosing a different path, even if that means spending some time on your own.'],
  ['career', 'I am unemployed. Will I find a job soon?',
   'The answer leans yes. The next opportunity may be outside your current field or experience, because The Fool often brings a completely new beginning. Someone with a sales background, for example, might be offered work in design despite having no formal experience there. Stay open to a direction you had not originally planned.'],
  ['career', 'I am currently working. What may change in my job soon?',
   'You may be given a project in a completely new area. Because it is unfamiliar, you may need to learn from the beginning.'],
  ['career', 'I have just started a new job. What should I do?',
   'Mistakes are normal when you begin something unfamiliar. Give yourself time to learn, ask colleagues and managers when you are unsure, and take things step by step instead of expecting yourself to be excellent immediately. In this course, remember that a card meaning is only the beginning of a reading. The more important part is the advice you build from the card together with the person’s real situation.'],
  ['other', 'What does this card say about my current energy?',
   'The Fool says it is time to take the first step yourself. Its energy is curiosity, openness and active exploration. If you have been waiting for life to come to you, this card encourages you to get up and go looking.']
],
'major-1': [
  ['love', 'What will my next partner be like?',
   'This person is genuinely capable and confident in what they can do. They tend to be very competent in their field, quick to notice opportunities and good at handling situations as they arise. In work and practical matters, they are likely to be impressive.'],
  ['love', 'Do they love me a lot?',
   'The Magician alone cannot measure how deep someone’s feelings are. This card describes the person and the way they act more than the intensity of their emotions. Draw more cards if you want to explore how strong their feelings are.'],
  ['love', 'What kind of feelings do they have for me?',
   'The Magician speaks more about action than emotion, so it does not tell you how deep the feeling is by itself. What it does show is initiative: this person is actively moving toward you. Whether that initiative comes from genuine love needs more cards. If the Magician appears with the Ace of Cups, the combination gives much stronger support for real feelings and a willingness to show them. People with Magician energy are often direct and do not leave what they feel unspoken for long.'],
  ['love', 'We are arguing. What does this card advise for the relationship?',
   'Be the one who opens the conversation. Meet them directly if you can, talk honestly and work on a solution together. The answer needs to come from the two people in the relationship rather than from outsiders.'],
  ['love', 'Should I break up with them?',
   'The Magician asks for action, but action does not automatically mean ending the relationship. It may mean taking the initiative to sit down and talk clearly. Many couples understand each other better after an honest conversation. Because ending a relationship or leaving a job are both sensitive decisions, draw more cards before treating one card as a final answer.'],
  ['career', 'I have been unemployed for six months. Will I find a job soon?',
   'You can find work, but this card emphasises taking action rather than waiting. It may also describe a period of passivity, where the person is hoping an opportunity will simply arrive. The Magician reminds you that chances become more likely when you actively search, contact people and put yourself forward.'],
  ['money', 'What is new for me this month?',
   'This month, you may create a work or money opportunity for yourself. It is less about someone handing you a chance and more about you opening one. You may discover a new way to earn or use a skill you already have.'],
  ['verdict', 'Should I leave my job?',
   'The Magician alone is not enough for a simple yes or no; the real circumstances matter. If the workplace is genuinely harmful, the card can support taking the initiative to leave. If you are mainly bored or frustrated with a temporary phase, begin with changes you can control: reorganise your work, speak to the people involved and adjust your own approach. If those efforts do not help, then consider whether ending the job is the next step.']
],
'major-2': [
  ['love', 'What will my next partner be like?',
   'Your next partner may be highly intuitive and observant. Regardless of gender, they are likely to carry a quieter, receptive kind of energy even if they appear strong on the outside. Rather than acting immediately, they often step back, watch and then trust their inner sense of a person or situation.'],
  ['love', 'What kind of feelings do they have for me?',
   'The High Priestess does not tell you how strong the feelings are. It shows someone holding still, watching from a distance and keeping something private. They may feel drawn to you, but they are not acting on it yet. The reason for the silence needs more cards: fear of rejection, a private personality, poor timing or another relationship could all be possibilities. The key point is that, for now, there has been little or no action.'],
  ['love', 'We are arguing. Should I break up with them?',
   'This card suggests not rushing the decision. Give yourself time, calm down and listen to what you feel once the heat has passed. If, after some distance and reflection, your inner sense still tells you the relationship should end, you can decide from a clearer place. Decisions made in the middle of an argument are more likely to be impulsive and regretted later.'],
  ['love', 'We are arguing. What does this card advise for the relationship?',
   'The High Priestess suggests taking a small step back. Give each other some room to think. Some couples clash more when they keep talking while emotions are high, and a little distance can help the situation settle. Try not to dissect every sentence just to decide who was right. The most useful answer here comes from what each person honestly feels and needs, not from outside opinions.'],
  ['career', 'I have been unemployed for six months. Will I find a job soon?',
   'This card leans toward a delay rather than an immediate job. The High Priestess represents things that are still hidden or not fully formed. Your current search may not be focused in the right direction, or you may not yet know what kind of work suits you, so applications are going everywhere without a clear aim. Pause and ask what kind of work you actually want. Once that inner answer becomes clearer, the external search can become more focused too.'],
  ['career', 'I am working normally. What may change at work soon?',
   'For someone who is already working steadily, it would not make sense to turn this card into advice about quitting. A better layer of the High Priestess here is information that has not yet been revealed. Something may be developing behind the scenes, and it is not necessarily negative. A manager, for example, may be considering you for a new role without having said so yet. What is being kept quiet, who is involved and whether it helps you will need the surrounding cards.'],
  ['other', 'How should I read this card when it appears on its own?',
   'The High Priestess is one of the harder cards to read alone because its meaning is often hidden or unfinished. As a general reading practice, draw at least one more card before making a detailed interpretation.']
],
'major-3': [
  ['love', 'What kind of person does this card describe?',
   'The Empress describes someone with nurturing, maternal energy. They tend to care for people naturally and often do practical things well, from food to making a home feel comfortable. Their appearance or manner may feel polished, soft or feminine regardless of gender. This is different from the High Priestess: the High Priestess expresses femininity inwardly through intuition and the unconscious, while the Empress shows it outwardly through care, beauty, the senses and tangible life.'],
  ['love', 'What kind of feelings do they have for me?',
   'The Empress is usually a warm, positive card, so it often suggests genuine affection. The feeling comes with a protective, caring quality: this person wants to look after you and make life easier for you. Whether that care is healthy or becoming too much depends on the surrounding cards and the real relationship.'],
  ['love', 'We argue a lot. Should I break up with them?',
   'In many cases, this card does not point straight to a breakup. The two of you may care so much that small things turn into arguments. The relationship may need less parent-and-child style caretaking and more room for both people to meet as equal partners.'],
  ['love', 'We argue a lot. What is the advice for this relationship?',
   'Loosen the grip a little and give each other some personal space. The Empress can suggest that one person is giving or caring so intensely that the other feels crowded. More breathing room can make the relationship feel lighter.'],
  ['money', 'How do my finances look this month?',
   'Finances look relatively abundant this month. The Empress is traditionally linked with growth and plenty, so the picture is more about having enough and perhaps a little extra than about scarcity.'],
  ['career', 'Will I find a job in the near future?',
   'The answer leans yes. The next job may also feel comfortable or place you in an environment with strong nurturing or feminine themes. That could include service work, beauty, health care, nursing, a small business or any role centred on caring for people. It may also simply be a pleasant workplace with good material support or many women among colleagues and managers.'],
  ['career', 'I work a normal office job. What may change soon?',
   'Work may become more fruitful. You could receive more projects, more responsibility or more income as a result.'],
  ['other', 'What does this card say about children or pregnancy?',
   'The Empress is one of Tarot’s strongest traditional symbols of fertility, pregnancy, motherhood and creation. In an actual pregnancy question, however, a Tarot card is symbolic and cannot confirm a medical fact; use an appropriate test or medical advice for that. Marriage is usually read through other cards rather than the Empress alone.']
]
});

Object.assign(ASK.en, {
'major-4': [
  ['love', 'What kind of feelings do they have for me?',
   'If you have only been seeing each other for about a month and want to know whether they are serious, The Emperor suggests genuine long-term intent. Their way of loving can be controlling, though. They may want things to happen on their terms and can have a dominant presence without being a bad person. In a relationship with them, compromise will matter. If you also need to be in charge, clashes are more likely. In short, they may be serious about you, but they can also be rigid and imposing.'],
  ['love', 'We are having a serious argument. What is the advice for this relationship?',
   'The Emperor asks you to loosen the need for control. Stop trying to manage the other person or the relationship itself. You may want them to behave exactly as you think they should, but a lasting relationship needs compromise, mutual respect and acceptance of each other as adults. The person you love is a partner, not someone you need to raise or discipline.'],
  ['career', 'What should I pay attention to at work over the next three months?',
   'Pay attention to people with authority. This card opens two main possibilities. First, a manager or senior person may become important in your work; The Emperor alone does not say whether they favour or dislike you, only that their authority matters. Second, you may be given more decision-making power yourself. It may not be a formal management title, but you could lead a small group or become responsible for assigning work.'],
  ['career', 'I have been unemployed for six months. Will I find a job soon?',
   'This card is not strongly positive or negative, so the answer is not fully clear. You may find a job, but the new workplace could involve someone with Emperor energy: strict, demanding and not very flexible, yet potentially fair. If you do your work well, they may recognise it. The key is that they expect rules and standards to be followed.'],
  ['career', 'What kind of work suits someone with this card’s energy?',
   'One possible reading is that this person may eventually suit building something of their own rather than always working under someone else. They tend to want responsibility, authority and room to make decisions. That does not mean a young person should immediately become a manager, but over time entrepreneurship, leadership or a role with real ownership may fit them better than a position with little autonomy.'],
  ['other', 'What other kinds of issues can this card point to?',
   'The Emperor is linked with authority, hierarchy and formal systems. Depending on the question, it may point to a father figure, family authority, a spouse, a manager, an institution or public authority. Fines or administrative trouble can also fit this theme. Distinguish it from Justice: Justice leans more toward documents, procedures, fairness and legal matters, including disputes between individuals.']
],
'major-5': [
  ['love', 'What kind of feelings do they have for me?',
   'If you have been dating for only a short time and wonder whether the person is sincere, The Hierophant suggests seriousness and may even point to thoughts of formal commitment or marriage. Still, it helps to look for Cups or other emotional cards around it. The Hierophant can show a wish to make the relationship official, but by itself it does not explain whether the motivation is love, family expectations, social values or practical considerations.'],
  ['love', 'We are arguing. Should I break up with them?',
   'You may be holding so tightly to your own rules or beliefs that you cannot see the whole situation. It is easy to think, “I am right and they are wrong,” simply because that is how you were taught. Hierophant energy is good at respecting structure and principles, but its shadow is difficulty imagining another way. Before deciding to leave, ask whether the conflict is really about harm or incompatibility, or about two people treating their own rules as the only correct ones.'],
  ['love', 'What is the advice for a relationship that keeps arguing?',
   'The Hierophant can redirect some of your attention toward learning and personal growth. Choose a course, subject or skill that belongs to you rather than letting the relationship take up all your mental space. Having something meaningful of your own can reduce overthinking and give the relationship more breathing room.'],
  ['career', 'What may be new at work soon?',
   'You may meet a mentor, be sent to a workshop or training programme, or decide to study for a certificate or language qualification that supports your work. More broadly, The Hierophant is linked with learning, institutions and structured teamwork. You may join a new project group as a member; this card alone does not say that you will lead it.'],
  ['other', 'How is this card different from The Emperor?',
   'Both cards deal with rules, systems and authority. The difference is where the rules come from. The Emperor tends to create structure and expects others to follow it. The Hierophant works inside an existing tradition or institution and follows what the system, teachers or predecessors have established.'],
  ['other', 'What else does this card represent?',
   'The Hierophant is associated with religion, schools, education, knowledge, institutions, tradition and culture. It can also relate to marriage because marriage is a social and cultural institution. Another layer is the set of assumptions we absorb from the culture we grew up in and do not notice until we meet people who were taught differently. In teamwork questions, it is one of the cards that can emphasise learning and working within a group.']
],
'major-6': [
  ['love', 'Does anyone like me?',
   'There may be two people interested in you at the same time, and you may feel drawn to both, which makes the choice difficult. This differs from the Seven of Cups. With the Seven of Cups there can be many options but none feels quite right; with The Lovers, the tension is often that two choices both matter to you.'],
  ['love', 'Do they like me?',
   'The answer leans yes. However, The Lovers can also describe a choice, so the person may be considering more than one romantic option. Draw more cards before assuming what that choice is. If the surrounding cards are supportive, the reading can simply describe genuine attraction and connection between the two of you.'],
  ['love', 'A couple argues a lot. Should they break up?',
   'Do not rush to recommend a breakup from this card alone. There are two common directions. Positively, the two people still care deeply about each other and can use that bond as a reason to talk and repair things rather than end them too quickly. In another context, one person may be torn between the relationship and someone or something else. The surrounding cards and the real situation should decide which reading fits.'],
  ['career', 'I am unemployed. Will I find work soon?',
   'The answer leans yes, and you may even receive two opportunities close together and need to choose between them.'],
  ['career', 'I am working normally. Will anything change in the next three months?',
   'Another job offer or professional option may appear while you are still employed. You may then need to weigh staying where you are against moving somewhere new.'],
  ['love', 'I am single. Will I meet someone soon?',
   'You may meet more than one promising person in the same period. The important part of this card is not simply “two people,” but the need to make a choice that matches your real values.']
],
'major-7': [
  ['love', 'What kind of personality does this card describe?',
   'This person has strong willpower and tends to put goals first. They work hard, rarely back down and often come across as decisive and driven. The shadow of that strength is becoming so focused on achievement that family, friends or a partner are pushed into the background.'],
  ['love', 'What kind of feelings do they have for me?',
   'The answer leans toward attraction, but the approach may be fast and intense. This person can pursue romance like a goal they are determined to achieve. For some people, the thrill of pursuit is stronger than what comes after, so it is worth watching whether their interest remains steady once the chase is over.'],
  ['love', 'A couple argues a lot. Should they break up?',
   'This card may describe your current state more than the final outcome. You may be exhausted by the arguments and want to end everything quickly just to feel relief, but that can be a rushed decision. Breakup advice should depend on the actual health of the relationship: harm, persistent toxicity, or a clear loss of feeling matter more than one card. If the relationship is not at that point, calm down first and talk when both of you can think clearly. There may still be room to repair it.'],
  ['love', 'They will not change the way I want. What should I do?',
   'When a relationship feels difficult, many people instinctively try to fix the other person. You may have tried to make them text more or show more attention, then felt frustrated when nothing changed. The Chariot suggests changing your own perspective before trying to control the outside situation. For example, fewer messages may not mean less love; the person may be concentrating on work or a shared future. State what you need clearly, but also leave room to understand their reasons.'],
  ['career', 'I am unemployed. Will I find a job soon?',
   'This is a conditional yes. You can find work, but the card asks for more determination and initiative. After months without results, your energy may have dropped. Perhaps you are applying half-heartedly, feeling too comfortable to push, or carrying many plans but avoiding the first step because failure feels frightening. The Chariot says progress comes when you choose a direction and move.'],
  ['career', 'I am working normally. What is new over the next three months?',
   'The next three months may be busy. Your field could enter a peak period, or you may receive an additional project that needs a lot of time and focus. You may pour most of your energy into work. The reminder is to protect your basic rhythm: eat properly, sleep enough and leave room for family, friends or a partner so that progress does not turn into burnout.'],
  ['other', 'How is this card different from The Sun?',
   'The Chariot and The Sun can both speak about success, but they sit at different stages of the Major Arcana journey. The Chariot is an earlier victory driven by will and momentum; it can show reaching a target while neglecting things along the way. The Sun is a fuller kind of success, where achievement is accompanied by openness, support and joy. The lesson is that moving very fast can make the road lonely, while going far usually requires people and parts of life to travel with you.']
],
'major-8': [
  ['love', 'What kind of personality does this card describe?',
   'This person’s strength comes less from appearance and more from self-command. They understand their abilities and limits, and they can manage anger and strong impulses instead of being ruled by them. Because their confidence is secure, they can admit mistakes without becoming defensive. This is different from someone who performs strength to hide insecurity. Strength energy is quieter: steady, self-aware and difficult to shake.'],
  ['love', 'Do they like me?',
   'The answer leans yes, but do not expect a noisy chase. This person is secure enough to express interest calmly and directly. They may tell you they like you without pressuring you for an immediate answer. If you do not feel the same, they are more likely to step back respectfully than to keep pushing. Their style of affection is mature and considerate.'],
  ['love', 'We are arguing. Should I break up with them?',
   'The key word here is gentleness. Conflict is not solved by shouting or overpowering each other, but by patience, care and self-control. This card does not by itself point to a breakup. Decisions about leaving should be based on the real relationship, especially whether there is harm, persistent toxicity or no remaining willingness to repair things. If that is not the case, try listening and working through the issue from a calmer place.'],
  ['career', 'I am unemployed. Will I find a new job soon?',
   'The biggest barrier may be confidence rather than ability. After a long job search and repeated rejection, you may have started to believe you are not good enough, and that belief can show up in interviews. Someone who once answered fluently may begin hesitating because they are afraid of being wrong. Strength reminds you that your skills have not disappeared. The delay may be timing or a mismatch between the roles you are applying for and your actual strengths. Rebuilding confidence can change how you meet the next opportunity.'],
  ['career', 'What should I pay attention to at work in the near future?',
   'Work looks steady. You seem to understand your role, your strengths and your limits, and you are handling what is given to you competently. That stable period may continue without a major crisis or a dramatic leap. If you are hoping for a sudden breakthrough, this card does not promise one; its strength is consistency.'],
  ['career', 'I have a new project coming up. Should I take it?',
   'The card supports saying yes. You appear to have the resilience, skill and professional ability to handle it.'],
  ['other', 'How should I read this card in an advice position?',
   'In this course, Strength is read as a constructive upright energy rather than through reversals. In an advice position, it often points to a quality you need to bring forward: steadiness, patience, self-trust or emotional self-control. Strong instinctive feelings may be overpowering clear thought. The advice is to hold your centre rather than react from anger or fear.']
],
'major-9': [
  ['love', 'What will my next partner be like?',
   'Your next partner may be experienced, thoughtful and deeply reflective. They could be older than you, or simply more mature than people of the same age. Do not expect an especially theatrical kind of romance, though. Surprise parties, elaborate gifts or a highly staged proposal may not be their style. They can also be particular about things and need a lot of time alone.'],
  ['love', 'What kind of feelings do they have for me?',
   'There may be genuine feeling, but the person is in an inward-looking phase. They are busy searching for answers to their own questions, so the time and attention available for the relationship may be limited. You may want a weekend together while they would rather stay home, read or finish something personal. That can leave you feeling neglected. The Hermit is not a negative card, but its energy is not naturally easy for a relationship that currently needs more closeness.'],
  ['love', 'We are arguing. Should I break up with them?',
   'This card suggests not rushing into a breakup. If every meeting turns into another argument, give each other some time and space to settle. In that quiet period, look inward and ask where the conflict began, what part you may be contributing and what you can realistically change.'],
  ['love', 'Is the problem them or me?',
   'During conflict, most of us instinctively focus on what the other person is doing wrong. The Hermit turns the question inward first. In any relationship — family, friendship or romance — ask whether there is something in your own behaviour that could be adjusted. Improving yourself does not mean making yourself smaller or losing your identity. It can simply mean listening to feedback, apologising when appropriate and changing what you genuinely agree needs changing.'],
  ['career', 'I have been unemployed for months. Will I find a job I like?',
   'The card encourages you to keep searching while asking a deeper question about what you actually want. You may be focusing only on roles that meet a salary or qualification target while overlooking work that feels meaningful. Someone trained in engineering, for example, might discover that helping people is what gives them the strongest sense of purpose. Take time to listen to yourself. You can still keep a stable profession and meet that need through volunteering, or you may eventually choose social, educational or nonprofit work more directly.'],
  ['career', 'What should I pay attention to at work soon?',
   'You may meet a mentor, teacher or experienced professional who helps you deepen your knowledge.'],
  ['timing', 'When will I finally find the answer?',
   'This is not a fast card. The search may take time and asks for patience. Rather than treating a specific number of months as fixed, read The Hermit as a slower process in which clarity develops through sustained reflection and experience.']
]
});

Object.assign(ASK.en, {
'major-10': [
  ['love', 'What kind of personality does this card describe?',
   'The Wheel of Fortune is not a strong personality card on its own, so draw more cards if you want to describe a person. If you read only this card, it can suggest that meeting them feels meaningful rather than random: the two of you may have something important to learn through the connection. “Important” does not have to mean painful. The relationship can bring growth and good things in gentle ways as well as through challenge.'],
  ['love', 'What kind of feelings do they have for me?',
   'The Wheel of Fortune is also indirect when it comes to feelings. What it can show is that the person may see your meeting and the fact that you are still in each other’s lives as significant or “meant to happen.” That does not tell you exactly what they think or how deeply they feel, so draw more cards for the emotional part.'],
  ['love', 'We are arguing. Should I break up with them?',
   'Do not decide from this card alone. The Wheel of Fortune is neutral and depends heavily on the surrounding cards. Supportive cards such as the Ten of Cups or Four of Wands can show that the relationship still has strong potential and is worth talking through before ending it. Harder cards such as The Devil or The Tower can show a pattern that is becoming difficult to sustain. Even then, Tarot should not dictate a breakup; the real level of harm, trust, safety and willingness to change matters more than the card. One person cannot single-handedly control or repair an entire relationship.'],
  ['career', 'Will I find a new job soon?',
   'The answer leans yes, and the new job may feel like a turning point rather than an ordinary change. It could bring a move, work abroad, a new environment or experiences that broaden your perspective and change the way you think about your career.'],
  ['career', 'I work a normal office job. What should I watch over the next three months?',
   'A major change or turning point may appear at work. The Wheel itself is neutral: it shows movement but not whether the outcome is good or bad. The change could be a transfer, promotion, pay rise, work trip, office move or a change of manager. Use the surrounding cards to see the tone and the part you can influence.'],
  ['other', 'What does it mean when a spread contains many Major Arcana cards?',
   'The balance between Major and Minor Arcana can show the scale of the issue. When the Majors clearly dominate, the reading often feels connected to larger life themes, transitions or lessons that are not easily changed overnight. When the Minors dominate, everyday choices, habits, moods and practical actions usually play a bigger role. This is a reading convention rather than a fixed law of fate.'],
  ['other', 'Can fate be changed?',
   'One useful way to think about fate in Tarot is as a range rather than a single fixed outcome. Some circumstances are outside our control, while our choices, effort and responses still shape where we land within them. Not every person who works hard becomes a genius or gets every result they want, but effort can help us make fuller use of the abilities and opportunities we actually have.']
],
'major-11': [
  ['love', 'What kind of feelings do they have for me?',
   'In an emotional reading, Justice is more measured and rational than romantic. This person may be weighing the relationship carefully: what feels fair, what each person gives, and what the practical consequences of being together would be. That does not mean the feelings are false, only that emotion is not the whole picture. If the relationship is new, this card alone cannot tell you how deep or lasting the love will become.'],
  ['love', 'We are arguing. Should I break up with them?',
   'Justice leans toward slowing down before making a breakup decision. The card asks for balance and a clear look at the facts. Strong feelings are natural in relationships, but they can make the situation harder to judge in the middle of a conflict. Look for repeated patterns, what is fair to both people, and where your own behaviour may need adjustment before making a major decision.'],
  ['career', 'I have been unemployed for months. Will I find a job I like?',
   'Justice alone is not enough for a firm yes or no, so draw more cards. It does suggest several practical directions. The next role may involve administration, documents, procedures, accuracy, numbers or law — for example banking, accounting, data work or legal support. A new manager may also be very principled and demanding. Another possibility is that your application materials are part of the problem. Review your CV and documents, add what is missing, remove what is not useful and ask someone experienced to give you feedback.'],
  ['career', 'What should I pay attention to at work in the near future?',
   'Pay close attention to paperwork and administrative procedures. A decision that benefits you may already have been made but could be delayed because a certificate, form or approval is missing. If a raise or promotion is being processed, for example, HR may be unable to complete it until the documentation is correct. Check important work documents early rather than waiting until they become a bottleneck.'],
  ['other', 'When something goes wrong, where should I look first?',
   'Start with an honest look at your own part: what you handled well, what you could have done differently, and whether you completed your responsibilities. After that, look at the other people and circumstances involved. Self-reflection is useful because it gives you something you can actually change. It should not become self-blame, and it does not mean other people are never responsible. The aim is a fair assessment rather than automatically assigning all fault to one side.'],
  ['other', 'What should I do if the cards seem to answer a different question?',
   'This happens fairly often. You may ask about career prospects and find that the cards seem to describe a manager or another issue instead. First check whether you framed the question clearly and whether the cards actually connect to a hidden part of the situation. If the message still seems unrelated, say so rather than forcing a fit. Intuition matters in Tarot, but it works best alongside a clear question and honest interpretation.']
],
'major-12': [
  ['love', 'What kind of person does this card describe?',
   'The Hanged Man can describe someone who does not fit neatly into the usual mould. Their difference may show in the way they dress, think or choose to live. The point is not that being different is bad, but that they are willing to see life from another angle. They may have a background, identity or path that is less common, including being part of the LGBTQ+ community. Imagine someone leaving a secure office job for a vocation their family never expected: others may find the choice unusual, but the person is living more honestly as themselves.'],
  ['love', 'What kind of feelings do they have for me?',
   'The Hanged Man does not give a very direct emotional answer. The person may be attracted to you for something unusual or deeply personal rather than the qualities everyone else notices first. It can also describe you as someone whose difference is part of what draws them in. Draw more cards if you want to know how strong the feelings are or whether they will act on them.'],
  ['love', 'We are arguing. What advice does this card give for the relationship?',
   'Stop chasing a solution for a moment and change the angle from which you are looking at the problem. Some quiet time alone can help you think without the pressure of the argument. If you are stuck, speak with someone who sees life very differently from you and listen without immediately defending your own position. A new perspective may show that the conflict is smaller than it felt, or that it is revealing something the two of you needed to understand. Sometimes the first useful change is not the relationship itself, but the way you are seeing it.'],
  ['career', 'Will I find a new job soon?',
   'There are two useful ways to read this card. You may find work that is different from what you first expected or outside the field you studied. Or the card may be asking you to widen your search. If you are looking only at large companies in one city, for example, consider smaller organisations, another location or a role that uses your skills in a different way.'],
  ['career', 'What should I pay attention to at work over the next three to six months?',
   'The Hanged Man is not very specific here, so draw more cards for a fuller picture. Two possibilities stand out. You may be given a project unlike your usual work, which helps you understand your field from a new angle. Or you may meet a mentor with an unconventional style whose advice sounds strange at first but becomes useful once you think it through.'],
  ['other', 'What is the core meaning of this card?',
   'The Hanged Man marks a shift in perspective. In the Fool’s Journey, the traveller reaches a point where forcing himself into the expected shape no longer works. The card is about pausing, accepting what is true and looking from another angle. When you are stuck, the answer may not be another external action; it may begin with changing the way you understand the situation.'],
  ['other', 'What kind of friends should I choose?',
   'It is healthy to have people around you who see life differently from you. That does not mean people who enjoy fighting or provoking you, but people with different backgrounds, experiences and viewpoints. They remind you that one situation can be seen in more than one way. Learning to hold several perspectives can make you less quick to judge and better able to accept differences without trying to force everyone into your own mould.']
],
'major-13': [
  ['love', 'What kind of personality does this card describe?',
   'Death can describe someone whose life has contained major changes and reinventions. They may have experienced both highs and lows, with each turning point forcing them to rethink, adapt and become a different version of themselves. Rather than keeping one worldview for decades, they tend to grow through endings and new beginnings, like a tree shedding leaves before new growth. In Tarot astrology, this theme is traditionally associated with Scorpio and its symbolism of transformation.'],
  ['love', 'What kind of feelings do they have for me?',
   'Death alone is not enough for a firm emotional conclusion, so draw more cards. One possible reading, especially when it appears early in a spread, is that the person has feelings for you but still has something from the past to close properly. That may be a previous relationship or another chapter they do not want to carry into something new. If that fits the real situation, patience may be useful while they complete the ending — without putting your own life on indefinite hold.'],
  ['love', 'We are arguing. Should I break up with them?',
   'Death does not automatically mean “break up.” It can point to ending the way the relationship has been functioning rather than ending the relationship itself. A quiet, honest conversation about what has been left unsaid can help close an old pattern. If both people are willing to change, the relationship may move into a different chapter. If the harmful pattern cannot or will not change, then the ending may eventually need to be more literal.'],
  ['career', 'I have been unemployed for three or four months. Will I find a new job soon?',
   'The card says the current approach may need to end because it is not producing results. Two possibilities are worth checking. You may have lost confidence, and that is showing in interviews. Or you may be applying for roles that do not really match your training, strengths or preferred way of working. Someone who is strong with people, for example, may struggle if they only apply for isolated data-entry roles. Stop repeating a direction that is not working and redefine the kind of role that actually fits you.'],
  ['career', 'Will I have problems at work over the next six months?',
   'Do not assume this card predicts job loss. Death is more usefully read as the end of a phase or role. A project may finish and make room for another, or you may choose to close a position that no longer fits. One card cannot tell you whether the ending will feel welcome or difficult, so draw more if that distinction matters.'],
  ['other', 'Why do I have to let go when I still feel attached?',
   'Regret and attachment are normal. Letting go does not mean pretending something never mattered. It means recognising when a person, relationship or situation no longer works well enough to carry forward in the same form. Life has limited time and energy, so some things eventually have to be put down to make room for what comes next. Fear that nothing better will appear is common, but it is not proof that you should keep holding on.']
],
'major-14': [
  ['love', 'What kind of feelings do they have for me?',
   'There is likely affection here, but it is expressed in a measured way. The person is neither rushing toward you nor acting cold. Their feelings unfold steadily and at their own pace. If you want a highly dramatic, intense romance, Temperance may feel too quiet; its emotional temperature is balanced rather than extreme.'],
  ['love', 'We are arguing. Should I break up with them?',
   'Temperance advises against making a rushed breakup decision while everything feels out of balance. First look at your own rhythm. Overwork can lead to poor sleep, poor sleep can affect eating and mood, and exhaustion can make every conflict feel larger. Give yourself enough time to return to a steadier routine before deciding what the argument means. Once you are calmer, you may see the problem — and the available solutions — more clearly.'],
  ['career', 'I have been unemployed for six months. Will I find the job I want?',
   'Here, Temperance may say more about your pace than about the job market. You may be searching, but without much urgency or initiative. If only a handful of applications have gone out in six months, the slow result is understandable. The answer depends partly on whether you change the rhythm: contact more places, apply more consistently and take more active steps while still choosing roles thoughtfully.'],
  ['career', 'Will I have problems at work over the next three to six months?',
   'Work looks relatively stable, and the next few months may continue at a similar pace. Temperance does not promise a sudden offer or dramatic breakthrough. Its less exciting side can feel like standing still, but not every quiet period is bad. Some phases are for recovery and consolidation. The key is balance: constant rushing burns you out, while endless waiting can become stagnation.']
],
'major-15': [
  ['love', 'What kind of personality does this card describe?',
   'The Devil can describe someone who is being driven by impulses or a pattern they find hard to control. The dependence does not have to involve alcohol or drugs; it can be smoking, overeating or restrictive eating, sleep habits, gaming, social media, shopping or any behaviour that keeps taking more time and control than intended. The familiar pattern is “just one episode” turning into the whole night, or checking one message and then losing hours to the phone while important tasks stay untouched.'],
  ['love', 'What kind of feelings do they have for me?',
   'The Devil asks you to examine what is driving the attraction rather than assume it is pure love. Physical desire, secrecy, the thrill of crossing a boundary, jealousy, power or another unmet need may be mixed in. That does not prove the person has no real feelings, but it is a warning not to romanticise a connection that is being held together by compulsion or temptation. Use the surrounding cards and, more importantly, the person’s actual behaviour.'],
  ['love', 'We are arguing. Should I break up with them?',
   'The Devil can point to an unhealthy cycle, but a card alone cannot diagnose a relationship as toxic. Look at the real pattern. If being together repeatedly brings insults, control, jealousy, fear or loss of yourself, while distance produces panic and a strong pull back into the same cycle, that deserves serious attention. Ask whether you can still be yourself in the relationship and whether both people are willing and able to change the harmful behaviour. If there is abuse or you feel unsafe, seek support outside the relationship.'],
  ['love', 'What if I feel like I cannot leave them?',
   'Try changing the sentence from “I cannot leave” to “leaving feels extremely hard right now.” That wording makes room for both the pain and your agency. Ending a relationship can be difficult, frightening and complicated, especially when love, dependence, housing, money or family are involved. You do not have to do it alone. If you decide to leave, support from trusted people or appropriate services can make the process safer and more manageable.'],
  ['career', 'Will I find a job I like soon?',
   'The answer can lean yes, but with a clear warning: be cautious about offers that look almost too attractive. A role may promise excellent benefits while hiding unclear practices, grey legal areas or expectations that conflict with your values. The job itself is not automatically bad, but you should read every term carefully, ask direct questions and make sure the compensation is not being used to distract you from conditions you would otherwise reject.'],
  ['career', 'What should I pay attention to at work over the next three to six months?',
   'Watch for temptation and blurred boundaries. One form may be an office relationship that creates secrecy or conflicts of interest. Another may involve money, gifts, commissions, documents or shortcuts that put your integrity or legal position at risk. The card does not decide for you; it reminds you that a tempting short-term gain can carry a much larger cost. Keep professional boundaries clear and do not agree to anything you would be uncomfortable explaining openly.']
]
});

Object.assign(ASK.en, {
'major-16': [
  ['love', 'What kind of person does this card describe?',
   'When The Tower appears for a personality question, it often describes someone whose inner world is unsettled. They may be quick-tempered, impulsive or blunt, or they may simply be coming out of a major shock or sudden loss and still feel emotionally scattered. One card cannot tell you whether they have already rebuilt themselves after that experience, so draw more if you need a clearer picture.'],
  ['love', 'What kind of feelings do they have for me?',
   'The Tower does not answer this question directly. It often points less to the present connection and more to an old wound the person still carries. Imagine that the two of you have only just started getting to know each other and everything seems calm, yet The Tower appears. A reasonable reading is that they may have experienced a sudden betrayal, breakup or other emotional shock in the past, and some of that disruption still affects how they approach closeness. Whether they have healed enough to build something new depends on the surrounding cards and, more importantly, on their actual behaviour.'],
  ['love', 'Should I date if I have not fully healed yet?',
   'You do not have to become perfectly healed before you are allowed to love. Some wounds do repeat themselves in relationships when they are ignored, so self-awareness and responsibility matter. At the same time, certain patterns only become visible when intimacy brings them to the surface. The healthier question is not “Am I completely healed?” but “Can I recognise my wounds, take responsibility for them and avoid making another person responsible for fixing me?” A mature relationship can support growth, but it should not replace the work each person needs to do for themselves.'],
  ['love', 'We are having a serious conflict. Should I break up with them?',
   'The Tower says the current pattern cannot simply continue unchanged. It can point to a relationship in crisis, especially when conflict has become frightening, humiliating or destructive. Do not use one card to decide whether a relationship is abusive or whether you must leave; look at what is actually happening. If there is physical violence, threats, coercion or fear for your safety, prioritise safety and seek support outside the relationship. If the conflict is not abusive, the card still asks for an honest reset: either the underlying problem is addressed at its root, or the structure of the relationship may eventually break down.'],
  ['love', 'They hit me, but apart from that they say they love me. Is that still a problem?',
   'Yes. Being hit by a partner is physical violence, and love does not make violence acceptable. Abuse can coexist with apologies, affection and periods of calm, which is one reason it can be difficult to recognise or leave. You do not need to prove that the situation is “bad enough” before seeking help. If you feel unsafe, contact someone you trust or a local domestic-violence service and make safety the priority.'],
  ['career', 'I have been unemployed for three months. Will I find work soon?',
   'The Tower is not a promise of an immediate job. Instead, it asks you to rebuild the search from the ground up. Review whether you are targeting the right roles, whether your CV and applications are strong enough, whether you are preparing seriously for interviews and whether you are putting consistent effort into the search. Unemployment can make unexpected expenses feel especially stressful, so protecting whatever financial buffer you have is also sensible while you look.'],
  ['career', 'What may change in my work over the next three to six months?',
   'A sudden change may disrupt the structure you are used to. That could be a reorganisation, a manager leaving, a project ending, a policy change or another event that forces people to adjust quickly. The Tower does not mean disaster is guaranteed; it means something unstable may be exposed or something outdated may need to be rebuilt. Pay attention to real warning signs rather than inventing a crisis before it happens.'],
  ['other', 'Why do some people have a difficult early life but a better later life?',
   'There are many ways to understand this. In spiritual traditions that believe in karma and rebirth, hardship in one period of life may be interpreted as part of a longer cycle of causes, consequences and growth. That is a belief, not something Tarot can prove. From a practical point of view, people can also become more stable later because experience, relationships, skills and earlier choices accumulate over time. The useful message of The Tower is that a difficult beginning does not have to define the rest of a life.']
],
'major-17': [
  ['love', 'What kind of person does this card describe?',
   'The Star describes someone with steady faith in life and in their own ability to keep going. Faced with something difficult, they are inclined to believe that a way forward exists. That hope becomes valuable when it is paired with action. Optimism without effort can drift into wishful thinking: believing a good job will appear without applying anywhere, or believing love will arrive while never allowing yourself to meet anyone. The Star is strongest when hope gives you the courage to participate in your own future.'],
  ['love', 'What kind of feelings do they have for me?',
   'There is likely genuine affection here, but this person may also be idealising you. In their eyes, you can seem more beautiful, capable or perfect than any real person can consistently be. That can feel romantic at first, but lasting love usually becomes healthier when two people can see each other clearly, share ordinary burdens and meet as equals. Admiration is lovely; putting someone on a pedestal is harder to sustain.'],
  ['love', 'We are arguing. Should I break up with them?',
   'The Star is a hopeful card, so it suggests there may still be room to repair the relationship. The current conflict may be temporary rather than a final ending. Instead of deciding in the heat of the moment, look for what can realistically be repaired and whether both people are willing to do that work. Hope is useful when it is supported by real change.'],
  ['career', 'I have been unemployed for three months. Will I find a suitable job?',
   'The answer leans yes, but The Star pairs hope with participation. Keep applying, develop the skills that strengthen your position, widen your network and make yourself available to opportunities. Hope is not a substitute for action; it is what helps you continue acting when results have been slow.'],
  ['career', 'What may change in my work over the next three to six months?',
   'A new opportunity may come into view. The card does not guarantee that you will take it, only that there may be something worth noticing. Your part is to recognise the opening, check whether it fits your direction and act while the opportunity is real.'],
  ['other', 'Does this card always mean there is hope?',
   'Usually The Star carries hope, renewal and the sense that a difficult period can become lighter. Its shadow side is idealisation: expecting a future so perfect that you stop dealing with the present. Draw another card if you need to know whether the hope is being supported by action. A possibility can exist, but someone still has to meet it halfway.']
],
'major-18': [
  ['love', 'What kind of person does this card describe?',
   'The Moon can describe someone living with uncertainty, anxiety or a lack of clarity. Fear may make it difficult for them to act, and conversations can circle around the same worries without reaching a decision. That does not mean they are a negative person by nature; it may simply describe a period when they cannot yet see the road clearly. No one else can make their choices for them, but support, reflection and concrete information can help separate real problems from imagined ones.'],
  ['love', 'What kind of feelings do they have for me?',
   'They may have feelings for you, but uncertainty or fear is holding them back. The concern may be based on something real, or it may be a scenario they have built in their own mind; one card cannot tell you which. Give them room to work through that uncertainty instead of trying to force a decision. What matters is whether their eventual actions become clear and consistent.'],
  ['love', 'We are arguing. Should I break up with them?',
   'The Moon asks you to check whether the conflict is based on facts or on assumptions. Jealousy is a common example: a late dinner with colleagues can become an entire story in the mind before any evidence exists. Repeated suspicion can damage trust even when the feared event never happened. At the same time, do not dismiss genuine warning signs as “just anxiety.” Slow down, verify what you actually know, speak directly and make decisions from reality rather than from imagined scenarios.'],
  ['love', 'So what is a healthier way to think about it?',
   'You do not need to control every possible outcome. Trust can mean giving the relationship room while staying willing to respond if real information changes. If your partner is faithful, constant suspicion only exhausts both of you. If clear evidence of betrayal appears one day, you can deal with that reality then. The goal is not blind trust; it is to stop treating every fear as if it were already a fact.'],
  ['career', 'I have been unemployed for two or three months. Will I find work soon?',
   'Fear may be affecting the way you present yourself. If you walk into every interview already convinced you will fail, that anxiety can make it harder to show what you actually know. Feeling nervous is normal; the important part is not letting the fear decide your behaviour. Prepare carefully, practise your answers and judge each interview by what actually happens rather than by the worst outcome you imagined beforehand.'],
  ['career', 'What should I watch for at work over the next three to six months?',
   'A change may create uncertainty — for example, a reorganisation, a new manager or shifting responsibilities. The Moon reminds you not to let worry run ahead of the facts. You may fear that a new manager will dislike you before you have even met them. Separate what has actually changed from what your mind predicts might happen, and respond to the real situation as it develops.'],
  ['other', 'If I fear something a lot, does that make it more likely to happen?',
   'Fear does not magically cause events, but it can influence behaviour. Someone terrified of being late may sleep badly, rush in the morning, forget something and end up late partly because anxiety disrupted their preparation. The useful lesson is not to force yourself to “think positive” all the time. Do what you can, prepare well and leave room for outcomes you cannot control. If things go well, enjoy it; if they do not, you can feel disappointed and still move forward.']
],
'major-19': [
  ['love', 'What kind of person does this card describe?',
   'The Sun describes someone with natural presence. They tend to be optimistic, expressive and easy to notice, with the confidence to lead or bring energy into a room. The shadow side can be a strong need for attention or difficulty stepping out of the spotlight. Warmth becomes more sustainable when confidence is paired with the ability to listen, share space and let other people shine too.'],
  ['love', 'What kind of feelings do they have for me?',
   'The Sun is usually very positive in a love reading. If you are still getting to know each other, it suggests you bring genuine happiness and warmth into this person’s life. Their strongest quality here is clarity: they are more likely to know what they feel, know what they want and show it openly instead of leaving you to guess.'],
  ['love', 'We are arguing. Should I break up with them?',
   'Rather than giving a simple yes or no, The Sun asks for more light in the relationship: more honesty, clarity and direct communication. Conflict often grows when each person keeps their needs hidden and expects the other to guess. Say what you actually want, listen to what they need and see whether the two of you can meet each other in the open. Once things are clear, the decision may become much easier.'],
  ['career', 'I have been unemployed for three months. Will I find the job I want?',
   'The answer leans strongly yes. The Sun suggests a brighter period in your career and a role that may feel like a real win after a difficult wait. Keep doing the practical work of searching, because the card describes favourable energy, not a contract that arrives without action.'],
  ['career', 'What will work be like over the next six months to a year?',
   'Work looks relatively positive and stable. If things are already going well, The Sun suggests that momentum can continue. A single card cannot account for every event in an entire year, so treat it as the overall tone rather than a guarantee that nothing difficult will happen.'],
  ['other', 'Is this card always positive?',
   'Most of the time, The Sun is read positively: clarity, vitality, confidence and success. Its shadow can be overconfidence, ego or too much exposure. When reading for someone else, keep the interpretation balanced. A reader’s job is not to frighten the person or promise perfection, but to describe the card honestly and leave room for the person’s real circumstances.']
],
'major-20': [
  ['love', 'What kind of person does this card describe?',
   'Judgement can describe someone who has gained perspective through lived experience. This is not the same as being academically clever or knowing many facts. Their understanding comes from having gone through turning points, reflecting on them and learning what truly matters. If the person is young, the card may suggest a level of maturity beyond their years.'],
  ['love', 'What kind of feelings do they have for me?',
   'The energy is positive and can point to a connection that feels deeper than surface attraction. This person may value your character, inner world and the sense of recognition they feel with you. At its healthiest, the affection is respectful rather than possessive: they can express what they feel while still accepting your answer and your boundaries.'],
  ['love', 'We are arguing. Should I break up with them?',
   'Judgement asks you to look at the whole relationship, not only at the argument happening today. What brought you together? What has been good, and what patterns keep returning? A single conflict does not necessarily erase everything that came before, but serious harm, betrayal or abuse should never be minimised just because there were good memories too. Make the decision by looking at the full pattern and what both people are willing to change.'],
  ['career', 'I have been unemployed for three months. Will I find a new job?',
   'Judgement turns the question inward before it turns outward. You may be applying everywhere because you feel you have no other choice, even when many of those roles do not suit you. Take some time to review what you actually want, what you are good at and what kind of work you can realistically build toward. Once the direction becomes clearer, your applications can become much more focused and effective.'],
  ['career', 'What may change in my work by the end of the year? Is there a new opportunity?',
   'If you already feel engaged and aligned with your work, the overall direction remains positive. A new opportunity may appear along the way. Keep doing what is working, stay open to feedback and make sure enthusiasm is supported by consistent effort rather than assuming good momentum will maintain itself automatically.'],
  ['other', 'What does “high frequency” mean here?',
   'In Nabu’s spiritual language, “high frequency” is best understood as a metaphor for a relatively steady, grounded state of mind — not a scientifically measurable vibration. You still feel happiness, disappointment, excitement and sadness, but you are less likely to be thrown completely off balance by every event. Emotional maturity is not feeling less; it is being able to feel fully and still return to yourself.'],
  ['other', 'Is it wrong to do a job I do not like?',
   'Not at all. Many people do work they do not love because it provides income, stability or a bridge to something else. The useful question is whether the arrangement still serves you. You are allowed to keep a practical job while building another direction, or to decide that stability matters more to you than passion. The point is to make the choice consciously rather than assuming there is only one acceptable way to live.']
],
'major-21': [
  ['career', 'Will I find a new job in the near future?',
   'The World leans toward yes and may also describe the nature of the opportunity. The next role could involve international work, another country, a multinational company or regular contact with people abroad. If not, the card can still point to geographical movement, such as relocating to another city for work.'],
  ['career', 'I have a normal office job. Will anything change soon?',
   'Here The World does not necessarily mean an ending. It can show completion and competence within a field you already know well. Your work may remain stable, and this could be an industry you stay connected to for a long time even if you change companies later. Finding a field that fits you can matter more than staying with one employer forever.'],
  ['love', 'What does it actually mean for two people to be compatible?',
   'Compatibility is less about having identical personalities or hobbies and more about whether your core values and long-term direction can live together. Two people can think very differently and still complement each other if they want a similar kind of life. By contrast, shared interests may not be enough if one person wants a settled family life and the other wants complete independence with no long-term commitment. Differences can enrich a relationship; the important question is whether the two of you are ultimately trying to build toward the same horizon.']
]
});

Object.assign(ASK.en, {
'wands-1': [
  ['love', 'What kind of person does this card describe?', 'This is an outgoing, energetic person who prefers doing to sitting still and overthinking. They are ambitious, enthusiastic and full of fire. Movement, sport or a busy schedule often gives that energy a healthy outlet. When it has nowhere to go, it can spill into impatience, arguments or reckless behaviour.'],
  ['love', 'What kind of feelings do they have for me?', 'The overall energy is positive and there is likely strong physical attraction. Attraction itself is not a problem; what matters is how the person handles it. Respect, patience and clear boundaries are good signs. Pressure, entitlement or disappearing as soon as they get what they want are not.'],
  ['love', 'We are arguing. Should I break up with them?', 'This card does not point straight to a breakup. It suggests bringing more initiative into the relationship: start the conversation, name what is happening and see whether both of you are willing to work on it. One person may be tired of always having to make the first move while the other waits behind their guard. As with any breakup question, judge the real pattern of the relationship rather than letting one card make the decision for you.'],
  ['career', 'Will I find a new job soon?', 'The answer leans yes, especially through your own initiative rather than someone simply handing you an opportunity. The next role may also be active and people-facing, involving movement, communication or fast-paced work rather than sitting alone in one place all day.'],
  ['career', 'What should I watch for at work between now and the end of the year?', 'The overall picture is favourable. New work opportunities may appear, and you will have a real choice about whether to pursue them. You may also create an additional source of income yourself.'],
  ['other', 'What do the four Aces generally represent?', 'All four Aces represent beginnings: fresh energy, a new opening and the first step of a journey. They are generally positive cards, but an Ace is potential rather than a finished result.']
],
'swords-1': [
  ['love', 'What kind of person does this card describe?', 'This person is sharp-minded, articulate and analytical. They think quickly, value logic and tend to notice contradictions fast. In astrological symbolism, this can resemble Mercury-ruled energy such as Gemini or Virgo: curious, observant and mentally active.'],
  ['love', 'What kind of feelings do they have for me?', 'There may be interest, but the Ace of Swords describes clarity and thought more strongly than emotion. This person may approach the connection with a rational mind and strong self-protection. That is not automatically cold or bad; it simply means they may make decisions quickly when something no longer feels right. Draw more cards if you want to know how deep the emotional bond is.'],
  ['love', 'We are arguing. Should I break up with them?', 'The Ace of Swords points to a need for clear communication before a final decision. Couples often store up small frustrations, say nothing, then explode over something minor because the real issue was never addressed. Name the actual problem while it is still manageable, listen to the other person and deal with one issue at a time instead of turning the conversation into a list of every old mistake.'],
  ['love', 'Is there someone who will understand me without me having to say anything?', 'Do not build a relationship around the expectation that another person should read your mind. Even very compatible people need words. Trust, compromise and clear communication are what allow two people to understand each other more deeply over time.'],
  ['career', 'I have been unemployed for two or three months. Will I find a job I like?', 'There are two useful readings. You may find a role involving communication, relationships, analysis or other mental work. Or the card may be asking you to clarify your direction first. Applying everywhere without knowing what you want can make it difficult to build the knowledge and enthusiasm employers are looking for. Decide what field you want to move toward, then make your applications more focused.'],
  ['career', 'What should I watch for at work over the next three to six months?', 'A new project may appear that asks you to learn quickly, think more deeply and absorb unfamiliar information. Overall, this is a constructive sign.']
],
'cups-1': [
  ['love', 'What kind of person does this card describe?', 'This is a warm, emotionally open person whose feelings generally flow in a healthy direction. They care about themselves and the people around them, are willing to help, and tend to approach life with kindness rather than letting every emotion control them.'],
  ['love', 'What kind of feelings do they have for me?', 'The Ace of Cups is one of the clearest cards for genuine affection. Feelings are abundant and heartfelt. On its own, the card suggests emotional openness rather than obsession or possession: the person is willing to offer love without treating your response as something they are entitled to control.'],
  ['love', 'We are arguing. Should I break up with them?', 'This card suggests that affection is still present, so the conflict may be repairable. Sit down, speak honestly and see whether the two of you can return to what you care about in each other. Strong feelings do not solve every incompatibility, however, so if the real issue involves harm, broken trust or incompatible values, those still need to be addressed directly.'],
  ['career', 'I am unemployed. Will I find a new job soon?', 'The answer leans yes, and the next role may be something you genuinely enjoy or feel emotionally connected to. The Ace of Cups says little about salary or advancement by itself, so draw another card if those details are the focus.'],
  ['career', 'Will my work progress over the next six months?', 'One possibility is a meaningful new connection through work. Another is a new project that gives you something fresh to care about and brings back enthusiasm you may have been missing.'],
  ['other', 'Why did I ask about salary and get this card?', 'Sometimes a reading highlights what matters most to the person rather than answering only the surface wording of the question. The Ace of Cups may be saying that enjoyment and emotional fulfilment will stand out more than money in this role. That does not guarantee that passion will automatically produce income, so practical questions about pay and conditions still deserve their own cards and real-world checking.']
],
'pentacles-1': [
  ['love', 'What kind of person does this card describe?', 'This is a grounded, practical person in a positive sense. They notice details, think realistically and prefer building something solid to romanticising instability. They may not show the fire of the Ace of Wands or the overflowing emotion of the Ace of Cups, but they are often dependable, willing to work for a shared future and comfortable saying what is or is not realistic.'],
  ['love', 'What are they thinking about me and this relationship?', 'They likely have feelings for you and also see practical compatibility between you. They may be considering whether your lifestyles, values, finances and long-term expectations can fit together. In a serious relationship, affection matters deeply, but practical compatibility matters too.'],
  ['love', 'Does a difference in family background really matter in a relationship?', 'It can matter, but it does not decide the relationship by itself. People raised in very different financial or cultural environments may develop different assumptions about money, family roles, security and daily life. Those differences become a problem only when they cannot be discussed or negotiated. Maturity, curiosity and shared values can bridge a great deal, so do not treat family background as a fixed measure of whether two people belong together.'],
  ['love', 'We are arguing. Should I break up with them?', 'Do not rush. The Ace of Pentacles asks both of you to become more grounded and practical. The conflict may be smaller than it feels in the moment. Step away from romantic expectations or dramatic interpretations and ask what concrete problem actually needs solving.'],
  ['career', 'Will I find a job soon?', 'The answer leans yes. The Ace of Pentacles is especially favourable in work and money questions and can point to a solid opportunity with reasonable income, stability or room to grow.'],
  ['career', 'What may change in my work soon?', 'You may receive additional income, a raise, a new project, a transfer, a promotion or another concrete opportunity. You may also create a new source of income yourself, such as a side business or investment.']
],
'wands-2': [
  ['love', 'What kind of feelings do they have for me?', 'This person appears to be thinking beyond the present and may already imagine a longer-term future with you. The intention to commit can be real, but this card alone does not tell you whether it comes purely from emotion or also from practical reasoning. Warm Cups cards would strengthen the emotional reading; more rational cards may suggest that long-term compatibility is part of the decision too.'],
  ['love', 'If they want commitment for practical reasons too, is that bad?', 'Not necessarily. A person may love with both heart and judgment. They can see qualities in you that make a long-term partnership feel workable, such as shared values, complementary strengths or similar plans for family and career. Practical thinking is only a problem when the relationship becomes transactional or one person is being used. A calm, deliberate kind of love can be just as sincere as a dramatic one.'],
  ['love', 'We are arguing. Should I break up with them?', 'Instead of focusing only on the current argument, look at the larger picture. If the conflict is about small things such as slow replies or social-media interactions, ask whether those details are truly worth losing sight of the relationship as a whole. If the issue is serious, however, “looking at the big picture” should include the harm as well, not erase it.'],
  ['career', 'Will I find a job I like soon?', 'One card leaves two main possibilities. You may still need more time to prepare, learn or strengthen your applications because the Two of Wands looks toward a future that is not here yet. Or the next role may involve international work, travel, relocation, planning or strategic thinking.'],
  ['career', 'What should I watch for at work between now and the end of the year?', 'You may feel more ambitious than before: wanting greater responsibility, a promotion or better pay. Ambition can be useful when it gives you direction; it becomes a problem only when nothing ever feels enough. The card can also point to travel or geographical movement connected with work.']
],
'swords-2': [
  ['love', 'What kind of person does this card describe?', 'This person tends to delay decisions, especially when both options feel uncomfortable. They may become passive in relationships or work because choosing one path means giving up another. The lesson of the Two of Swords is not that control is always good, but that avoiding a decision is still a decision with consequences.'],
  ['love', 'What kind of feelings do they have for me?', 'They are likely undecided about the connection. Feelings may exist, but something is preventing a clear step forward. Draw more cards if you want to understand whether the hesitation comes from fear, circumstances, another priority or uncertainty about the relationship itself.'],
  ['love', 'We are arguing. Should I break up with them?', 'The Two of Swords suggests that an important issue is being avoided. One or both of you may be irritated about something but expressing it through smaller complaints instead of naming the real problem. If you can identify the underlying issue and speak about it directly, a breakup may not be necessary. If the truth you uncover is serious, then let the real situation — not avoidance — guide the decision.'],
  ['career', 'Will I find a suitable job soon?', 'The answer may be delayed because your direction is still unclear or because you know what needs changing but have not acted on it yet. If your training is in one field but your real interest lies elsewhere, continuing to apply only to the old field may keep you stuck. Make a decision about the direction you want to test, then take concrete steps toward it.'],
  ['career', 'Is there anything I should address at work soon?', 'There may already be an uncomfortable issue at work that you would rather ignore. Deal with it while it is still small. A quiet feeling that a manager favours someone else, for example, may not be a crisis, but resentment can grow if you never clarify expectations or ask for feedback.'],
  ['other', 'What happens if I keep avoiding the issue?', 'Avoidance tends to make unresolved problems harder, not easier. In Tarot, the progression from the Two of Swords toward heavier cards can be read as a symbolic warning: what you refuse to face may eventually force a decision through consequences. You do not need to wait for a crisis. A small honest decision now is often easier than a dramatic one later.']
],
'cups-2': [
  ['love', 'What kind of person does this card describe?', 'This card describes someone who values reciprocity and is good at meeting people halfway. They tend to negotiate well, communicate diplomatically and notice whether giving and receiving feel balanced. In relationships, they usually care about fairness, cooperation and maintaining good connections with the people around them.'],
  ['love', 'What kind of feelings do they have for me?', 'This is a very positive sign. There is mutuality in the energy: the person wants to offer affection and also hopes to receive affection in return. The Two of Cups is one of the clearest cards for connection and emotional reciprocity.'],
  ['love', 'We argue a lot. How can I improve the relationship?', 'The feelings between you may still be strong, while the arguments come from differences in personality or communication. Use the bond itself as a reason to work together. Name the problem, listen to each other and look for a solution as a pair rather than each person trying to fix the relationship alone.'],
  ['love', 'Who should I ask when I want to improve my relationship?', 'Advice from trusted people can sometimes help, but the most important conversation is usually with the person you are actually in the relationship with. Ask what they need from you, explain what you need from them and see whether both of you are willing to adjust. A third party cannot replace a conversation the couple themselves need to have.']
],
'pentacles-2': [
  ['love', 'What kind of person does this card describe?', 'This is not necessarily someone who is already balanced; it is someone constantly trying to keep many things in balance. They are adaptable, busy and often happiest when handling several tasks at once. Their challenge is learning when flexibility is useful and when juggling too much starts to cost them stability.'],
  ['love', 'What kind of feelings do they have for me?', 'Feelings may be present, but this person is dividing attention between the relationship and work, study, money or other responsibilities. The card does not automatically mean a third person. It is more often about practical juggling. The real question is whether the amount of time and attention they can offer is enough for the kind of relationship you want.'],
  ['love', 'We are arguing. Should I break up with them?', 'The conflict may be connected to overload. Stress from work or other responsibilities can spill into the relationship, especially when someone suppresses frustration all day and releases it at home. Before deciding on a breakup, see whether the pattern improves when workload, rest and boundaries are managed better. Stress explains irritability, but it does not excuse mistreatment.'],
  ['health', 'How do I know if I am out of balance?', 'Look at both body and mind. Physical exhaustion is often easier to recognise, while emotional strain can show up as persistent irritability, low mood, anxiety, poor sleep, loss of interest or feeling unable to recover. You do not need to wait until things become severe before taking your mental health seriously. If symptoms persist or interfere with daily life, professional support is appropriate.'],
  ['career', 'I have been unemployed for a few months. Will I find work soon?', 'The answer is not fixed. The Two of Pentacles suggests first creating enough structure to make good decisions. If your days, applications and priorities are scattered, organising them can make the search more effective. A tidy environment may help some people think more clearly, but the important part is the practical system: know what roles you are targeting, keep track of applications and prepare consistently.'],
  ['other', 'What does tidying up have to do with finding work?', 'Tidying is useful here as a symbol of creating order, not as a magical cause of employment. A calmer environment, regular routine and basic self-care can make it easier to focus, prepare and make decisions. The same idea applies to relationships and commitments: notice what drains you, set boundaries where needed and reduce unnecessary clutter in your life.'],
  ['other', 'Why does the card sometimes seem to answer a different question?', 'A reading can point to a factor underneath the surface question. If that happens, explain the connection clearly rather than forcing an unrelated meaning. Show how the underlying issue could affect the question the person actually asked, and leave room for them to decide whether the interpretation fits their real situation.']
]
});

Object.assign(ASK.en, {
'wands-3': [
  ['love', 'What kind of person does this card describe?', 'This person has many plans, passions and ambitions, but may hesitate at the first real step because they are afraid of failing. They can talk enthusiastically about what they want to do, then months later explain why they have not begun and move on to a new idea. The challenge is turning vision into action.'],
  ['love', 'What kind of feelings do they have for me?', 'If the relationship is still new, their feelings and thoughts about a long-term future may be sincere. What is missing is concrete action. They may talk about going far together without yet making practical choices around work, family, living arrangements or commitment. For now, the future exists more strongly in their imagination than in their plans.'],
  ['love', 'We are arguing. Should I break up with them?', 'This card alone is not enough to decide. One possible source of conflict is that one or both of you like the idea of a long-term relationship but are not yet ready for what it requires. Commitment involves compromise, financial and practical planning, responsibility and room for both individual freedom and shared life. Talk about what “long term” actually means to each of you before making a final decision.'],
  ['love', 'How can I change them?', 'You cannot change another person who does not want to change. You can explain what affects you, set boundaries and ask for specific changes, but the decision to grow has to belong to them. Love does not give you control over someone else’s choices.'],
  ['career', 'I have been unemployed for a few months. Will I find work soon?', 'You may have strong plans but too little action behind them. If you want a competitive role, you may need to build skills, experience and stronger applications first. If fear has made you avoid even searching or sending applications, begin with one concrete step. The card can also point to an idea for a business or independent path that you have not yet dared to test.'],
  ['career', 'What should I watch for in my work soon?', 'You may have several ideas you want to pursue but still be hesitating because of fear. The Three of Wands encourages you to move beyond planning and take a realistic first step outside your comfort zone.'],
  ['other', 'What if I fail and people laugh at me?', 'Most people are far less focused on your mistakes than your fear suggests. They have their own lives, and even when someone notices a failure, their attention usually moves on quickly. Failure can feel embarrassing, but avoiding every meaningful attempt because of imagined judgment costs much more over time. Let other people have their opinions while you keep learning.']
],
'swords-3': [
  ['love', 'What kind of person does this card describe?', 'The Three of Swords can describe someone carrying sadness, disappointment or emotional pain. They may currently be seeing life through a more negative lens because something still hurts. Treat it as a picture of their present emotional state, not a permanent personality label.'],
  ['love', 'What kind of feelings do they have for me?', 'This is a difficult emotional signal. The person may still be carrying unresolved hurt from the past and may not be fully ready for a new relationship. That does not mean they are incapable of loving or that a breakup is inevitable. What matters is whether they recognise the wound and are willing to deal with it rather than making the new relationship carry all of it.'],
  ['love', 'We are arguing. Should I break up with them?', 'The conflict is painful, but the Three of Swords does not automatically mean the relationship is beyond repair. Look at what is actually causing the hurt. If the arguments are about repeated small wounds, honest communication may still change the pattern. If the real issue is betrayal, abuse or serious harm, do not minimise it just because this is a Minor Arcana card. Real-life severity matters more than the card category.'],
  ['love', 'Should I monitor or control my partner?', 'No. Healthy closeness does not require passwords, constant location checks or monitoring every like and message. If you need information because something specific has damaged trust, discuss that openly rather than turning the relationship into surveillance. Ask what fear is driving the need for control and whether trust can actually be rebuilt.'],
  ['career', 'Will I find a job I like soon?', 'You may still face disappointment or delay. The card does not explain the whole reason by itself, so draw more if needed. One possibility is that you are applying in a direction that does not fit you because family, social pressure or fear is pulling you away from the work you actually want. Rather than treating rejection as proof that “the universe” is blocking you, use it as information and review your direction, skills and strategy.'],
  ['career', 'What may change at work soon?', 'You may experience a disappointment: a project may underperform, feedback may sting or a relationship with a colleague may become uncomfortable. The card suggests hurt rather than total collapse, so address the issue early instead of letting resentment grow.']
],
'cups-3': [
  ['love', 'What kind of person does this card describe?', 'This is a sociable person who enjoys friends, gatherings, celebrations and being around other people.'],
  ['love', 'What kind of feelings do they have for me?', 'This card alone may point more clearly to friendship, enjoyment and companionship than to exclusive romantic commitment. If you are already together, it can simply mean the relationship still contains fun and a strong friendship base. Draw more cards before turning it into a negative conclusion.'],
  ['love', 'We argue a lot. Should I break up with them?', 'Draw more before deciding. The Three of Cups can sometimes raise a question about a third person, but it does not prove cheating. The “third” influence could be a friend, family member, social circle or someone on either side of the relationship. Ask what outside influence is actually affecting the two of you instead of accusing anyone from one card.']
],
'pentacles-3': [
  ['love', 'What kind of person does this card describe?', 'This is a fairly serious, cooperative person. Like the Three of Cups, they enjoy being with others, but usually around a shared task or useful goal rather than only for fun. They tend to appreciate teamwork, collaboration and environments where people build something together.'],
  ['love', 'What kind of feelings do they have for me?', 'The energy may be more practical or professional than romantic. The person could see you as a friend, colleague, classmate or someone they work well with. If you are already in a relationship, the card can also point to the practical value you bring into each other’s lives. Do not assume they are using you materially from one card alone; look at whether affection, reciprocity and respect are actually present.'],
  ['love', 'Should I leave them immediately if the relationship feels practical?', 'Not necessarily. Some relationships contain practical considerations as well as emotion, and that is not automatically dishonest. The important questions are whether both people understand the arrangement, whether anyone is being manipulated and whether the relationship meets both people’s real needs. If one person is secretly using the other for status, money or access, that is very different from two adults openly valuing practical compatibility.'],
  ['love', 'We are arguing. Should I break up with them?', 'The Three of Pentacles says to try working on the problem together first. Money, living arrangements, marriage plans, children or other practical commitments may be the real source of tension. Sit down and make the unspoken expectations explicit. If one person refuses every attempt at a real conversation, that itself becomes useful information.'],
  ['career', 'I have been unemployed for three months. Will I find work soon?', 'The answer leans yes, especially through collaboration or your network. The next job may involve teamwork, or the opportunity may come through someone who knows you. Tell trusted friends and former colleagues what you are looking for, ask for introductions and be willing to work with others rather than keeping the search completely private.'],
  ['career', 'What should I watch for at work soon?', 'Teamwork is likely to become more important. If you currently work alone, you may soon need to coordinate with others; if you already work in a team, collaboration remains central. Whether that feels energising or challenging depends on your working style, but the skill to practise is clear: communicate, divide responsibilities and build something together.'],
  ['other', 'How is this card different from the Three of Cups and The Hierophant?', 'All three can involve groups, but the purpose is different. The Three of Cups is the group that celebrates and socialises. The Three of Pentacles is the group that collaborates on a concrete task. The Hierophant is more connected with shared systems, teaching, institutions and established traditions.']
]
});

Object.assign(ASK.en, {
'wands-4': [
  ['love', 'What kind of person does this card describe?', 'One card only sketches a few traits, and the Four of Wands is generally favourable. The clearest quality is steadiness: this person tends to have a stable emotional base and approaches life with optimism.'],
  ['love', 'What kind of feelings do they have for me?', 'The Four of Wands is one of the stronger cards for serious intentions. This person is likely to see you as someone they could build a real partnership with rather than a temporary distraction. Even if marriage is not immediate, they may want stability, growth and mutual support. The other side of that steadiness is that they may not be highly spontaneous or dramatic. Draw more cards if you want to know how romantic or adventurous they are.'],
  ['love', 'We are arguing. Should I break up with them?', 'The Four of Wands reminds you that this relationship may have been built with serious intentions. Before making a final decision, remember why you chose each other and then compare that foundation with the pattern you live in now. Long-term relationships require compromise from both sides. If one person always has to win and the other always has to give way, stability becomes difficult no matter how strong the beginning was.'],
  ['career', 'I have been unemployed for a long time. Will I find work soon?', 'The answer leans yes. The Four of Wands can point to a role worth celebrating: something that fits your direction and could offer more stability than a temporary stopgap. Keep the reading realistic, though — a card can describe the quality of an opportunity, while the actual job still depends on applications, timing and circumstances.'],
  ['career', 'What should I watch for at work soon?', 'If you already feel settled in your current work, that stability is likely to continue. The Four of Wands is less about an overnight transformation and more about a foundation that has been built over time and can keep supporting you.'],
  ['other', 'Is staying in my comfort zone always bad?', 'No. Safety and stability are things people work hard to create. Leaving a comfort zone is useful when it helps you grow, not because you must constantly be uncomfortable. A healthy rhythm is often expansion, then rest; build a larger safe base, enjoy what you have created, and step outward again when you are ready.']
],
'swords-4': [
  ['love', 'What kind of person does this card describe?', 'The Four of Swords describes someone cautious rather than lazy. They prefer to think before acting, look at an issue from several angles and move once they have enough clarity. The downside is that they may be slow when a situation genuinely requires a quick decision.'],
  ['love', 'What kind of feelings do they have for me?', 'This person may not want to move the relationship forward quickly. They prefer keeping things calm and unchanged while they observe and think. If you are waiting for a confession, proposal or another major step, the card suggests they may not be ready yet.'],
  ['love', 'We are arguing. Should I break up with them?', 'Do not decide in the middle of the argument. A short pause can help both of you cool down, reflect and return with clearer words. The point is to create breathing room, not to use silence as punishment or leave the relationship suspended indefinitely. Agree on when you will talk again so the pause has a purpose.'],
  ['career', 'I have been unemployed for six months. Will I find the right job soon?', 'The card may be pointing to a genuine need for rest or reflection before pushing harder. You might be applying mainly because of outside expectations while part of you wants time to recover, learn, volunteer or work on a personal project. If that is true and your circumstances allow it, name the need honestly. If you do need work now, build enough rest into the process that exhaustion does not make every application half-hearted.'],
  ['career', 'Can interviewers tell when I am not really interested?', 'Often, yes. Interviews test more than technical knowledge. Employers also notice preparation, curiosity and whether you can explain why the role interests you. You do not need to perform exaggerated enthusiasm, but vague answers, no questions and no understanding of the role can make disengagement obvious.'],
  ['career', 'What may change at work soon?', 'Work may enter a quiet phase with little visible movement. That can feel comfortable if you value routine and stability, or frustrating if you want rapid growth and challenge. The card is not inherently good or bad; its meaning depends on what you need from work right now.']
],
'cups-4': [
  ['love', 'What kind of person does this card describe?', 'The Four of Cups can describe someone who has become narrow in perspective or emotionally disengaged. They may focus so strongly on what is already familiar that they struggle to notice a different possibility. This is better read as a current habit of perception than as a permanent inability to use intuition or imagination.'],
  ['love', 'What kind of feelings do they have for me?', 'One Four of Cups is not enough to define their feelings, but it can show someone overlooking what is being offered because their attention is elsewhere. They may be comparing the present with an old relationship, other possibilities or an ideal they cannot reach. The important question is whether they can recognise and value the connection that is actually in front of them.'],
  ['love', 'Can this situation change?', 'Yes. The Four of Cups describes a pattern of attention, and patterns can change. An honest conversation may help the person notice what they have been taking for granted. But change still requires willingness; you cannot make someone value a relationship if they repeatedly choose not to engage with it.'],
  ['love', 'We are arguing. Should I break up with them?', 'The card asks you to widen the frame. You may be focusing intensely on one flaw or one recent disappointment while overlooking the rest of the relationship. Step back and consider the full pattern: the effort, care and changes that have happened as well as the problem that hurts. Looking at the whole picture does not mean excusing serious harm; it means making the decision with complete information.'],
  ['career', 'Will I find work soon?', 'An opportunity may be closer than you think — perhaps in a listing you keep overlooking or through someone already in your network. The Four of Cups suggests checking what is in front of you before assuming the answer must come from somewhere far away.'],
  ['career', 'What may change at work soon?', 'Be careful not to miss an opportunity because you are fixated on a different path. There may be a project, skill or role in your current environment that fits you better than you realise. The card encourages you to notice what is genuinely available rather than chasing only what looks impressive from a distance.'],
  ['other', 'What should I do if I cannot find my own direction?', 'Find guidance. A teacher, mentor, counsellor or experienced person can help you see options you are currently missing. Their role is not to choose your life for you, but to help you see the path more clearly so you can make your own decision.']
],
'pentacles-4': [
  ['love', 'What kind of person does this card describe?', 'The Four of Pentacles can describe someone who holds tightly to control, possessions or security. The issue is not necessarily actual lack; it may be fear of losing what they have. That fear can make a person overly restrictive with money, affection or even basic needs. Prudence is healthy, but security becomes costly when it prevents reasonable spending, sharing or self-care.'],
  ['love', 'What kind of feelings do they have for me?', 'Feelings may be present, but they come with guardedness. The person might try to control the relationship, or they may hold back because they are afraid of being hurt. Draw more cards and, more importantly, look at their real behaviour to tell the difference.'],
  ['love', 'We argue a lot. How can we improve the relationship?', 'Control may be at the heart of the conflict. One or both of you may be trying to shape how the other dresses, speaks, behaves or spends time. Improvement begins by loosening unnecessary control and distinguishing between a healthy boundary and an attempt to manage another adult. Love needs room for the other person to remain themselves.'],
  ['love', 'What else can this card mean in relationships?', 'The Four of Pentacles can also describe holding on to the past. You may no longer contact an ex, yet still preserve an idealised version of them in your mind. Years later, that image may have little to do with the real person they have become. Letting go can mean releasing the imagined version, not denying that the relationship once mattered.'],
  ['career', 'Will I find the job I want soon?', 'The answer may be delayed, partly because you are trying to control every condition at once: the exact timing, salary, title and feeling of the role. It is good to have standards, but rigid expectations can make the search harder. Review what you can improve from previous interviews and accept that some useful steps — such as finishing a qualification — simply take time.'],
  ['career', 'What should I watch for at work over the next three months?', 'Watch for holding too tightly to your role, information or expertise. You may be reluctant to teach a new colleague or share what you know because you fear becoming less valuable. Healthy professional security comes from continuing to grow, not from making other people dependent on information you keep to yourself.'],
  ['other', 'Why should I let go?', 'The lesson of the Four of Pentacles is not to throw away everything you value. It is to notice what you are holding only because you are afraid. Sometimes a plan, role, possession or old story has stopped serving you, and keeping it leaves no room for anything new. Letting go is useful when it creates flexibility, not when it becomes another rule you force on yourself.']
]
});

Object.assign(ASK.en, {
'wands-5': [
  ['love', 'What kind of person does this card describe?', 'The Five of Wands can describe two patterns. One is playful or provocative debate: someone who teases, argues and challenges ideas without necessarily wanting to hurt anyone. The other is inner conflict: they want one thing and then pull themselves in the opposite direction. In both cases, friction is the defining theme.'],
  ['love', 'Is someone who likes to argue a bad person?', 'Not necessarily. There is a difference between arguing to humiliate someone and challenging an idea because you care about whether it makes sense. Constructive debate can sharpen your thinking when both people stay respectful. Once the goal becomes winning, belittling or provoking rather than understanding, the same habit stops being useful.'],
  ['love', 'What kind of feelings do they have for me?', 'Feelings may be present, but the person seems internally conflicted. Part of them is drawn toward you while another part holds back. One card does not reveal the reason, so draw more if you need to understand what they are wrestling with.'],
  ['love', 'We are arguing. Should I break up with them?', 'Do not rush to a breakup before naming the real issue. The arguments may be about small things while a larger insecurity sits underneath — uncertainty about the relationship, fear of losing the person or suspicion that has never been spoken aloud. The Five of Wands asks for honesty. Say what you are actually afraid of instead of fighting only about the surface details.'],
  ['career', 'Will I find the job I want soon?', 'The search may be slowed by an inner conflict about direction. You may genuinely want one field while applying in another because of family expectations, your degree or fear of starting again. First work out which direction you are willing to test in real life. Once your effort and your actual goal point the same way, the search becomes much clearer.'],
  ['career', 'Is there anything I should watch for at work soon?', 'A minor clash with a colleague may arise. The Five of Wands is usually manageable, but a small disagreement can grow when handled carelessly. Stay direct without becoming personal, clear up misunderstandings early and do not turn competition into a grudge.'],
  ['other', 'Why do people say the future in Tarot can change?', 'Tarot is better used as a picture of current patterns and possibilities than as a fixed script. If behaviour, circumstances or choices change, the likely outcome can change too. Some things are outside your control, so the point is not that you can force any future you want; it is that a reading should leave room for agency rather than presenting fate as completely sealed.']
],
'swords-5': [
  ['love', 'What kind of person does this card describe?', 'The Five of Swords can describe someone who turns conversations into contests. They want to win the exchange even when the victory accomplishes nothing beyond feeding the ego for a moment. Being right is not the same as communicating well.'],
  ['love', 'What kind of feelings do they have for me?', 'One Five of Swords cannot fully answer the emotional question. Feelings may be real, while the way this person communicates still hurts or frustrates you. Some people care deeply and yet speak in a commanding, dismissive or combative way. Do not confuse affection with healthy communication; both matter.'],
  ['love', 'We are arguing. Should I break up with them?', 'The main issue is how the two of you use words when you are upset. If ordinary differences become opportunities to insult, score points or reopen old wounds, work on the communication pattern first. A breakup is not automatically the first answer, but repeated contempt, humiliation or verbal abuse should be taken seriously rather than dismissed as “just arguing.”'],
  ['career', 'I have been unemployed for a few months. Will I find work soon?', 'This card does not give a clean yes or no. It may instead be pointing to a discouraging voice around you — someone who repeatedly tells you that you are not capable or keeps bringing up past failures. Notice whose opinions are shaping your confidence. Useful feedback is specific and helps you improve; constant belittling is not the same thing.'],
  ['career', 'What should I watch for at work soon?', 'Watch the way words are being used at work. You may be on the receiving end of disrespectful communication, or you may be the one speaking too sharply under pressure. If someone crosses a professional boundary, respond calmly, document serious incidents and use appropriate workplace channels rather than assuming you must simply tolerate it.'],
  ['other', 'What does this card say about arguing online?', 'The Five of Swords fits many online arguments: long replies to strangers, a need to have the last word and the feeling that silence means defeat. Most of those “wins” change nothing meaningful. Someone may stop replying because they are busy, bored or simply done with the conversation. Different opinions can coexist, and not every disagreement deserves your time.'],
  ['other', 'What does “karma of speech” mean?', 'In some Buddhist and folk traditions, “karma of speech” refers to the consequences created by the way we use words. The spiritual idea is that speech that humiliates, deceives or harms others has moral consequences. Even without taking karma literally, the practical lesson is useful: words shape trust, relationships and the kind of environment you create around yourself. Pause before saying something meant only to wound.']
],
'cups-5': [
  ['other', 'Is this card positive or negative?', 'The Five of Cups works best as guidance rather than a simple good-or-bad event. Its themes include disappointment, loss and grief, but the image also contains what remains. The important question is whether the person becomes defined by the loss or eventually turns toward what can still be carried forward.'],
  ['other', 'Why are Minor Arcana setbacks usually read as lighter?', 'As a reading convention, Minor Arcana often describe more everyday, changeable circumstances, while Major Arcana point to broader themes or turning points. That does not mean a Minor card can never accompany a serious real-life event. The actual situation always matters more than a hierarchy imposed by the deck.'],
  ['love', 'I have just gone through a failure or breakup. How should I look at it?', 'The picture gives you the lesson: the figure looks at the spilled cups while two still stand behind them. Grief deserves to be felt, and you do not need to rush yourself into positivity. When you are ready, also ask what remains — your relationships, abilities, lessons, values and future choices. Moving forward does not erase the loss; it means allowing the loss to become one part of the story rather than the whole story.'],
  ['love', 'How do I apply this after a breakup?', 'After a breakup, thoughts such as “I am unlovable” or “I will never love again” can feel convincing even though they are not facts. The Five of Cups asks you to separate the pain of this ending from your entire future. Over time, you can learn what kind of relationship does not suit you, what you want to do differently and what you now understand about your own needs.']
],
'pentacles-5': [
  ['love', 'What kind of person does this card describe?', 'The Five of Pentacles can describe someone carrying a deep sense of scarcity or not being enough. That feeling may be connected with childhood hardship, exclusion or instability, but one card cannot determine its origin. Even after circumstances improve, old insecurity can continue to shape behaviour until the person notices and works with it.'],
  ['love', 'What kind of feelings do they have for me?', 'This card can point to emotional scarcity: a person who wants closeness but is afraid there will never be enough love or that opening up will end in abandonment. They may have feelings for you while still struggling to give or receive affection safely. That history can explain a pattern, but it does not excuse harmful behaviour; healing remains their responsibility.'],
  ['love', 'Should I start a relationship with someone carrying this energy?', 'Do not decide from the card alone. Ask whether the person recognises their difficulties, takes responsibility for them and can still offer respect, consistency and emotional safety. Everyone has wounds. The concern is not that someone is imperfect, but whether unresolved patterns repeatedly harm the relationship and the person refuses to address them.'],
  ['love', 'Can I heal them?', 'You can support someone, but you cannot do their healing for them. You are not required to become a rescuer, therapist or proof that they are lovable. Encourage appropriate support, communicate your limits and remember that the person has to choose their own work. The same principle applies to you: other people can accompany you, but they cannot take over your inner work.'],
  ['love', 'We keep arguing. Should I continue this relationship?', 'Continuing without changing the pattern will probably produce the same arguments. Ask yourself what feels missing and why you keep feeling unmet, then invite the other person into the same conversation. Clear words are kinder than expecting someone to guess and then punishing them with silence when they fail. Whether the relationship continues should depend on what happens after both people understand the problem.'],
  ['career', 'Will I find the job I want soon?', 'The card suggests a financially tight period or an opportunity that may pay less than you hoped. Treat that as a prompt to review expenses, strengthen your search and keep realistic backup options rather than as a guaranteed prediction of hardship.'],
  ['career', 'What should I watch for at work soon?', 'Pay attention to cash flow and payment timing. Salary, invoices, project payments or budgets may be tighter or slower than expected. Check the facts early and plan around confirmed numbers rather than relying on assumptions.'],
  ['other', 'How can I control my reaction?', 'You cannot control everything another person does, and your first emotion may arise automatically. What you can influence is what happens next: the words you choose, the action you take and whether you give yourself a few seconds before reacting. When anger rises, pause and ask what outcome you actually want before you speak.']
]
});

Object.assign(ASK.en, {
'wands-6': [
  ['love', 'What kind of person does this card describe?', 'The Six of Wands can describe someone proud of what they have achieved and, at times, a little self-satisfied. Surrounding cards matter. With a strong card such as The Sun, the confidence may be well earned: this is someone capable who sets goals and actually reaches them. Healthy pride celebrates achievement; the shadow appears when recognition becomes something they constantly need from other people.'],
  ['love', 'What kind of feelings do they have for me?', 'This card is not the clearest sign of emotional sincerity. The person may enjoy the feeling of winning your attention or being admired. That does not prove the feelings are fake, but it is worth asking whether they are interested in you as a person or mainly in the validation of being chosen. Draw more cards and watch what happens after the “chase” is over.'],
  ['love', 'We are arguing. Should I break up with them?', 'The Six of Wands suggests that ego has entered the conflict. Arguments may have become contests where each person keeps score, needs the last word or refuses to give way. Before thinking about a breakup, ask whether you are protecting the relationship or protecting your pride. If both people can stop trying to win and return to the actual problem, the dynamic may change.'],
  ['career', 'I am unemployed. Will I find a job soon?', 'The answer leans yes, with one reminder: getting the job is the beginning, not the finish line. Early success can turn into complacency if you stop learning or assume the role is permanently secure. Keep developing after you are hired so the opportunity becomes something stable rather than a short victory.'],
  ['career', 'What should I watch for at work soon?', 'You may receive recognition for a successful project or be trusted with a small leadership role. Enjoy the achievement, but treat it as a step rather than proof that you have nothing left to learn. New visibility usually brings more responsibility too.'],
  ['other', 'How is this victory different from The Chariot and The Sun?', 'As a reading convention, the Six of Wands is a smaller milestone. The Chariot can describe winning through discipline, drive and sacrifice, while The Sun points to a broader sense of success and clarity. Think of the Six of Wands as a strong result in a practice test: worth celebrating, but not the same as completing the whole journey.'],
  ['other', 'When two cards share a keyword, which one is stronger?', 'A common Tarot convention is to give Major Arcana broader weight than Minor Arcana, while higher-numbered Minor cards can feel more developed than lower ones. Treat this as a reading framework rather than a law. Context, card position and the real-life situation should still guide the interpretation.']
],
'swords-6': [
  ['love', 'What kind of person does this card describe?', 'The Six of Swords says more about what someone is moving through than about their whole personality. They may have recently chosen to leave a relationship, job or difficult situation and still feel emotionally heavy. Draw more cards to see whether they are beginning to recover or still carrying much of that darkness with them.'],
  ['love', 'What kind of feelings do they have for me?', 'This person may currently be moving away from the connection. They may feel that the relationship has become too painful or exhausting and want distance. One card cannot tell you whether that distance is temporary, permanent or the right decision for both of you, so look at the surrounding cards and the actual conversation between you.'],
  ['love', 'What should I do when we keep arguing?', 'The Six of Swords can suggest creating distance from a relationship that has become repeatedly painful. That does not always have to mean an immediate permanent breakup; it can mean stepping out of the conflict long enough to decide clearly. If the relationship involves abuse, threats or fear, prioritise safety and outside support rather than treating separation as a Tarot experiment.'],
  ['love', 'What if I leave and then go back?', 'Returning to something familiar after leaving is common, especially when loneliness or uncertainty feels harder than the old pattern. Before going back, remember why you left and ask what has actually changed. Familiarity is not the same as safety or compatibility. If you do return, let it be because there is evidence of meaningful change, not only because the unknown feels frightening.'],
  ['career', 'I have been unemployed for a few months. Will I find the job I want?', 'The Six of Swords suggests reconsidering the direction you keep returning to. Perhaps you are applying only inside a familiar field that no longer suits you, or chasing a glamorous alternative that does not fit your real strengths. The card asks for a thoughtful transition: identify what you are leaving, what you are moving toward and what evidence tells you the new direction fits better.'],
  ['career', 'What may change at work soon?', 'You may be preparing to leave a role, team or location, even if nothing dramatic has happened yet. Sometimes a low, persistent sense of mismatch is enough to deserve attention. You do not need to wait for a crisis to justify a change. Explore options, protect your finances and make the move deliberately rather than forcing yourself to endure indefinitely.']
],
'cups-6': [
  ['other', 'Does this card mean “an ex is coming back”?', 'Traditional Tarot does not define one single card as “the ex returns.” Some readers use the Six of Cups that way as a personal convention, and personal associations can be valid when they are tested consistently. Start from the broader themes — memory, familiarity, innocence and the past — then let context decide whether an actual return is relevant.'],
  ['other', 'So what is the core meaning of this card?', 'The Six of Cups centres on tenderness, familiarity and a simple, sincere kind of affection. It can connect with the past, but not necessarily with repeating the past unchanged. If an old relationship does return, a healthy Six of Cups reading would ask whether both people can meet again as changed people rather than recreate the same old wounds.'],
  ['other', 'Is a reading accurate when I read for myself?', 'Self-reading can be useful, but bias becomes stronger when you are emotionally invested. If you desperately want an ex to return, almost any card can start looking like confirmation. Keep card meanings broad, write down the question before you draw, and consider waiting until you are calmer or asking another reader when the subject is especially charged.'],
  ['love', 'What kind of person does this card describe?', 'The Six of Cups describes someone gentle, sincere and a little innocent in the best sense. Their affection can feel uncomplicated and free from obvious calculation. They may remind you of first love or bring out a softer, younger part of you.'],
  ['love', 'We are arguing. Should I break up with them?', 'Rather than ending things immediately, the Six of Cups asks whether the relationship needs renewal. Long-term couples can lose the small gestures, playfulness and thoughtfulness that once made them feel close. Revisit something you used to enjoy together, bring back a little intentional romance and see whether warmth returns. If the relationship is harmful, nostalgia should not be used to excuse it.'],
  ['career', 'Will I find a job I like soon?', 'The answer leans yes, especially toward work you genuinely enjoy. Cups describe emotional satisfaction more clearly than money, status or advancement, so draw more cards if those practical details matter. Enjoying a role and being well paid can coexist, but one does not automatically guarantee the other.'],
  ['career', 'What may change at work soon?', 'You seem to retain genuine affection for your current work, and that enjoyment may continue. The Six of Cups can describe the simple pleasure of doing something because the activity itself still feels meaningful or fun to you.']
],
'pentacles-6': [
  ['love', 'What kind of person does this card describe?', 'The Six of Pentacles describes someone practical about giving and receiving. They are usually willing to help, but they also notice balance, resources and whether support is sustainable. That can look calculating to some people, yet generosity without limits can harm the giver and the people who depend on them. The healthier expression is measured generosity rather than either hoarding or giving everything away.'],
  ['love', 'What kind of feelings do they have for me?', 'This person may care for you and still think consciously about reciprocity. They want attention, respect and effort to move in both directions. That is not automatically selfish or transactional. The concern arises only if affection is being used to buy influence, status or control. Look at whether the exchange feels mutual and freely chosen.'],
  ['love', 'We are arguing. Should I break up with them?', 'Before deciding, the Six of Pentacles asks for a fair assessment of the whole relationship. Do not let one small irritation erase a long pattern of care, but do not let gifts or good moments erase serious harm either. Weigh what is happening honestly and pay attention to proportionality.'],
  ['love', 'What if the relationship is genuinely toxic or abusive?', 'Then the balance is not ambiguous. Gifts, apologies or affectionate periods do not cancel violence, coercion, threats or serious emotional harm. If you are being abused or feel unsafe, prioritise safety and seek support. You do not owe someone continued access to you because they have also done kind things.'],
  ['career', 'I have been unemployed for a few months. Will I find work soon?', 'The answer leans yes, possibly through help, a referral or an introduction from someone else. Accepting support is fine. If the person later expects a reasonable favour in return, you can decide then what feels appropriate; help should not create an unlimited debt or pressure you into something unethical.'],
  ['career', 'What should I watch for at work soon?', 'You may receive help, access or an opportunity through another person. Be clear about expectations. Professional reciprocity is normal, but assistance should not require secrecy, unethical favours or obligations you never agreed to.']
]
});

Object.assign(ASK.en, {
'wands-7': [
  ['love', 'What kind of person does this card describe?', 'The Seven of Wands can describe someone who is often on the defensive. They may feel watched, judged or forced to protect themselves, and sometimes react strongly before they understand what another person meant. In its shadow form, this can turn into unnecessary arguments and a lot of energy spent fighting battles that did not need to happen.'],
  ['love', 'What kind of feelings do they have for me?', 'This card does not show clearly how much they love you. It says more about their current state: tense, defensive or carrying hurt that has not been fully dealt with. The important question is not whether they have wounds, but whether they recognise them and take responsibility for how they behave. You are not responsible for healing them for them.'],
  ['love', 'We are arguing. Should I break up with them?', 'The conflict shown by this card often grows from small things that become repeated battles: late replies, missed calls, different expectations or one person demanding changes without looking at their own behaviour. The card does not automatically advise a breakup. Try changing the part you genuinely own, then watch whether the other person notices, values the effort and meets you halfway. If the pattern stays one-sided, you will have clearer information for deciding what you want next.'],
  ['career', 'Will I find a job soon?', 'The Seven of Wands suggests looking at how you are using your time and energy. You may be putting effort into things that do not move the search forward, or applying in directions that do not fit you well. Your resources are limited, so use them deliberately: focus your applications, strengthen the weak points and protect time for the steps that actually improve your chances.'],
  ['career', 'What may be new at work soon?', 'There may be tension, gossip or office politics around you, and someone may try to pull you into it. You still get to choose whether you participate. Protect your energy, keep your communication professional and focus on the work that matters instead of turning every comment into a battle.'],
  ['other', 'So who am I supposed to fight?', 'This card does not require you to fight everyone around you. Often the more useful challenge is to notice your own defensive habits, assumptions and repeated patterns. If the same kind of conflict follows you from one workplace or relationship to another, changing the setting alone may not solve it. Ask what is yours to adjust while still keeping clear boundaries with genuinely harmful behaviour.']
],
'swords-7': [
  ['love', 'What kind of person does this card describe?', 'The Seven of Swords often points to secrecy, avoidance or behaviour that is not fully transparent. In its shadow form, someone may hide information, say one thing and do another, or take a side route instead of speaking directly. The card does not automatically mean cheating or deception; context and surrounding cards matter.'],
  ['love', 'What kind of feelings do they have for me?', 'The Seven of Swords makes this a question to verify in real life rather than answer through suspicion. The person may be withholding part of the story, unclear about their circumstances or not ready to be fully transparent. That does not automatically mean there is a third person. If the situation is vague, ask directly about their relationship status and watch whether their words and actions stay consistent.'],
  ['love', 'We argue a lot. Should I break up with them?', 'The Seven of Swords suggests that something important may not be getting said openly. That could be another person, outside influence from friends or family, or simply one partner avoiding an honest conversation. Before deciding, find out what is actually happening rather than building the answer from hints. If secrecy, lying or manipulation is confirmed and does not change, that is a real relationship issue — not merely a Tarot symbol.'],
  ['career', 'I have been unemployed for a long time. Will I find a job soon?', 'This card suggests that a hidden factor may be making your job search less effective. It could be discouraging advice from other people, a strategy that is not working or a step you keep avoiding. Review your CV, applications, interview approach and the beliefs affecting your confidence before assuming that someone is deliberately standing in your way.'],
  ['career', 'Will anything difficult happen at work soon?', 'The Seven of Swords can warn about poor transparency: gossip, withheld information or unfair competition. Treat that as a prompt to stay observant rather than a prediction that someone will betray you. Keep records of important work, communicate clearly and rely on evidence before accusing anyone of acting against you.'],
  ['other', 'What does emotional manipulation mean?', 'Emotional manipulation is an attempt to influence another person’s thoughts, feelings or decisions for one’s own ends, often through hidden motives, guilt, distortion or pressure. A manipulative person does not necessarily have high emotional intelligence; they may simply be skilled at reading reactions. A useful warning sign is repeatedly feeling pressured, made to doubt your own memory or punished emotionally for saying no.']
],
'cups-7': [
  ['other', 'What is the key meaning of this card?', 'The Seven of Cups is about having many possibilities without feeling genuinely satisfied by any of them. The image itself supports this: several cups appear in a cloud, but not every option is solid, useful or even real. The card asks you to separate fantasy from the choices you would actually be willing to live with.'],
  ['other', 'How is this different from The Lovers and the Two of Swords?', 'All three can involve uncertainty, but for different reasons. The Lovers can show a meaningful choice between values or paths. The Two of Swords is hesitation because a decision feels blocked or difficult. The Seven of Cups is overload: too many options, fantasies or possibilities, with no clear preference yet.'],
  ['other', 'Can you give me another example that is easy to remember?', 'Imagine a student choosing a university subject. Several paths are available, but none feels truly theirs: one pleases the family, another looks practical, and another matches an old hobby they do not want as a career. Many doors are open, yet none feels convincing. That is the Seven of Cups: options are not the same thing as clarity.'],
  ['love', 'What kind of person does this card describe?', 'This card can describe someone who struggles to choose and keeps several possibilities alive for too long. They may let other people decide because committing to one path feels risky. Listening to advice is not the problem; the problem is living by someone else’s choice and then resenting it. The lesson is to choose consciously and take responsibility for what follows.'],
  ['love', 'What kind of feelings do they have for me?', 'The Seven of Cups suggests uncertainty rather than a clear commitment. They may be exploring what they want, idealising possibilities or keeping more than one option in mind. That does not prove you are “one of many”, but it does mean clarity is missing. Look for whether they are willing to choose, communicate and show up consistently.'],
  ['love', 'We are arguing. Should I break up with them?', 'This card does not give a simple yes or no. It shows confusion, dissatisfaction or attention drifting toward imagined alternatives. One or both of you may be wondering whether something else would feel better. Before ending the relationship, name what is actually missing and ask whether either of you still wants to work on it.']
],
'pentacles-7': [
  ['other', 'What is the key meaning of this card?', 'The Seven of Pentacles is patience, steady effort and assessing what your work is producing. It can say either “keep going; the result needs more time” or “pause and check whether this is still worth your effort”. The difference comes from the question and the surrounding cards.'],
  ['love', 'What kind of person does this card describe?', 'This is someone patient, persistent and able to stay with a process for a long time. The shadow is moving so cautiously that decisions become slow or overly passive, especially when a situation needs a timely response.'],
  ['love', 'What kind of feelings do they have for me?', 'The answer leans positive. The Seven of Pentacles suggests feelings that have been built gradually rather than appearing overnight. This person may have invested time, attention and patience in the connection and wants to see whether what has been nurtured can grow into something lasting.'],
  ['love', 'We are arguing. Should I break up with them?', 'This card points first to patience and long-term effort. A relationship that has lasted for some time can lose the easy excitement of the beginning, and both people may become less tolerant of each other’s habits. Before deciding to leave, ask whether the issue is a true incompatibility or whether both of you have simply stopped tending the relationship with the same care.'],
  ['love', 'What should I do if the other person cannot change?', 'Some traits change slowly, and some may never change in the way you hope. Give reasonable time when change is genuinely possible, but do not turn patience into endless waiting. Ask what you actually need, whether the other person wants the same change for themselves, and whether the relationship still works if this trait remains.'],
  ['career', 'Will I find a job I like soon?', 'The answer leans yes, but probably not immediately. The effort you have put into searching, learning and improving yourself can pay off. Keep going, while also checking which actions are producing results and which ones need to change.'],
  ['career', 'How will my work develop in the near future?', 'The Seven of Pentacles promises gradual rather than sudden progress. It is not the card of effortless luck; it is the card of return on sustained work. If you are waiting for promotion or growth, expect it to take time and keep building evidence that you are ready.'],
  ['other', 'Why do I have to be so persistent?', 'The Seven of Pentacles is about consistency rather than one burst of effort. The image of tending a plant is useful: some results need weeks or months of care before they become visible. Habits are similar; there is no single number of days that works for everyone. What matters is repeating the behaviour long enough, and adjusting the method when needed.']
]
});

Object.assign(ASK.en, {
'wands-8': [
  ['other', 'What is the key meaning of this card?', 'The Eight of Wands has two main themes, both suggested by the wands flying through the air: speed and movement. Something may develop quickly, or distance and travel may become relevant. Unlike The World, which often points to a larger completion or wider horizon, the Eight of Wands can describe movement on any scale. The card itself is neutral: sometimes speed helps, and sometimes it is the reason to slow down.'],
  ['love', 'What kind of person does this card describe?', 'This card can describe someone who thinks, speaks and acts quickly. They may enjoy handling several things at once because they like momentum. The shadow is rushing: speed can create avoidable mistakes, missed details and decisions made before enough information is available. Their lesson is not to become slow, but to know when speed is useful and when focus matters more.'],
  ['love', 'What kind of feelings do they have for me?', 'The feelings may have arrived quickly and intensely, but speed does not tell you whether they will last. The two of you may be caught up in novelty or in an image you have built of each other. Give the relationship enough time to see whether the attraction is joined by real understanding, consistency and commitment.'],
  ['love', 'We are arguing. Should I break up with them?', 'The Eight of Wands points more to speed and reactivity than to a breakup. Both people may be making fast conclusions from small signs, speaking before listening or escalating before checking what actually happened. Slow the exchange down, ask direct questions and separate facts from assumptions before making a permanent decision in the heat of the moment.'],
  ['career', 'I am unemployed. Will I find a job soon?', 'The answer leans yes, and the card adds two possible themes. News may arrive quickly, and the opportunity may involve movement: another area, a longer commute, frequent travel or a role that keeps you on the move. Treat the timing as symbolic rather than a guaranteed number of days.'],
  ['career', 'What should I watch for at work soon?', 'Something may develop quickly, so be ready to respond without rushing your judgment. The card can also point to movement at work: a business trip, a transfer, a new team or simply a change in where and how you work. Draw more cards if you need detail about whether the change is helpful or difficult.']
],
'swords-8': [
  ['other', 'What is the key meaning of this card?', 'The Eight of Swords is the feeling of being trapped, restricted or unable to choose. In the image, the bindings are loose and the swords do not fully close the way out, which is why the card often asks whether fear or assumptions are making the situation feel more fixed than it is. It does not mean every obstacle is imaginary; it asks where you still have room to move.'],
  ['other', 'So who tied this person up?', 'The Eight of Swords often points to beliefs that make an already difficult situation feel even narrower. Sometimes the barrier is internal, but external limits can be real too. The card is not asking you to blame yourself. Ask which part you can influence, which part needs support or resources, and what small step would return some choice to you.'],
  ['love', 'What kind of person does this card describe?', 'This card can describe someone who worries easily and gets caught in limiting thoughts. Under stress, they may see risks before possibilities and struggle to believe that they have choices. Treat this as a state that can change, not as a fixed definition of the person.'],
  ['love', 'What kind of feelings do they have for me?', 'The answer can lean toward feelings being present while the person holds themselves back. Fear, past hurt, insecurity or a belief that the relationship cannot work may be stronger than their willingness to act. What matters is whether they can recognise those fears and communicate rather than repeatedly pushing you away.'],
  ['love', 'We are arguing. Should I break up with them?', 'The card does not say you must break up. It highlights a sense of being stuck and the way fearful thinking can make a problem look more hopeless than it is. Separate what you know from what you are assuming, and look at both your own part and the other person’s real limitations. If there is control, threat or abuse, the issue is not merely a mindset; safety and outside support come first.'],
  ['love', 'Can you give an example of changing perspective?', 'Imagine a colleague says something unkind about you. One response is to obsess over what you did wrong; another is to retaliate and create a larger conflict. A different response is to check the facts, decide whether the comment needs a direct boundary or no attention at all, and then return your focus to what matters. Changing perspective does not mean pretending harm is fine. It means choosing a response that does not keep you trapped in the same conflict.'],
  ['career', 'Will I find a new job soon?', 'The card suggests the search may still feel blocked, but that does not mean the cause is entirely you. You may be ruling yourself out of good roles because confidence is low, while the market or your circumstances may also be difficult. Review the jobs you automatically dismiss, ask for feedback on your applications and widen the search where it makes sense.'],
  ['career', 'What should I watch for at work soon?', 'Something at work may be making you feel boxed in even if no dramatic event occurs. Ask whether the issue is a real structural limit, a difficult relationship, or a belief that you have no alternatives. Naming the kind of constraint matters, because each one needs a different response: a conversation, a boundary, a practical plan or a change of direction.']
],
'cups-8': [
  ['other', 'What is the key meaning of this card?', 'The Eight of Cups is choosing to leave something that may still contain value because your path is moving elsewhere. You do not have to hate a place, person or chapter in order to outgrow it. The card carries both sadness and intention: you can appreciate what was good and still know that it is time to continue.'],
  ['love', 'What kind of person does this card describe?', 'The Eight of Cups is easier to read as a life phase than as a fixed personality. This person may recently have left something meaningful behind in order to begin a different journey. That choice can bring sadness, relief and uncertainty at the same time, and the transition may still be shaping how they relate to people now.'],
  ['love', 'Are their feelings for me genuine?', 'The feelings may be genuine, but the person may currently be moving toward a path that does not leave much room for the relationship. They could care about you and still decide not to begin or continue because of distance, timing or a different life direction. Feelings and availability are not the same thing.'],
  ['love', 'We are arguing. Should I break up with them?', 'The Eight of Cups shows that at least one person is seriously thinking about leaving or needs a different direction in life. That raises the possibility of separation, but it does not make a breakup inevitable. Talk honestly about what each of you wants, what can still be built together and what may have become too different to reconcile.'],
  ['career', 'I have been unemployed for three months. Will I find a job I like?', 'This card asks what you may need to release before the search can move. You might be limiting yourself to a field because you have already invested years in it, even though it no longer fits. Past effort is not wasted simply because you change direction. Consider which skills can travel with you into a different kind of work.']
],
'pentacles-8': [
  ['other', 'What is the key meaning of this card?', 'The Eight of Pentacles is craftsmanship: careful work, repetition, patience and attention to detail. The person in the image improves one piece at a time. The card favours practice and consistency over shortcuts.'],
  ['love', 'What kind of person does this card describe?', 'This is someone diligent, detail-oriented and often perfectionistic. They may work very well independently and take pride in doing things properly. The shadow is focusing so closely on flaws that they miss the whole picture or struggle to enjoy what is already good.'],
  ['love', 'What kind of feelings do they have for me?', 'The answer leans positive, but this person tends to analyse carefully before moving forward. They may think about practical compatibility, habits and the long-term future rather than simply following attraction. Care can be useful; if it turns into inspecting every flaw, however, the relationship may never get room to develop naturally.'],
  ['love', 'We are arguing. Should I break up with them?', 'The conflict may come from one or both of you focusing on small faults while overlooking what the other person contributes. Tiny habits, social-media behaviour or harmless details can become symbols of a much larger worry. Talk about the real need underneath the criticism instead of repeatedly policing each other’s minor behaviour.'],
  ['career', 'Will I find a job soon?', 'The answer leans yes, especially for work that rewards skill, concentration and careful repetition. The role may involve independent work, numbers, craft, analysis or any process where quality grows through consistent practice. Accounting and auditing are examples, but the card is broader than those fields.'],
  ['career', 'Will anything change in my work soon?', 'The Eight of Pentacles usually shows continuation rather than sudden change. Your progress comes from improving the work piece by piece. If you are tired, rest and adjust your pace, but do not mistake the absence of a dramatic breakthrough for the absence of progress.']
]
});

Object.assign(ASK.en, {
'wands-9': [
  ['love', 'What kind of person does this card describe?', 'The Nine of Wands describes someone resilient who has already been through enough difficulty to become cautious. They do not give up easily, but resilience can turn into always expecting another problem. Their strength is endurance; their lesson is knowing when to keep going and when to rest or change approach.'],
  ['love', 'What kind of feelings do they have for me?', 'One Nine of Wands is not enough for a clear yes or no. Feelings may be present, but something is making the person guarded: current pressures, old disappointment or fear of being hurt again. Draw more cards if you want to distinguish between genuine interest, caution and simple emotional unavailability.'],
  ['love', 'Why are they asking me to wait?', 'The Nine of Wands can suggest that they like you but are moving slowly because they are dealing with other pressures or because past hurt has made them more cautious. If you choose to wait, make sure the pace also works for you. Patience should not mean putting your own needs on hold indefinitely.'],
  ['love', 'We are arguing. Should I break up with them?', 'This card can describe a relationship that has required more effort than usual from the beginning, perhaps because of distance, family pressure, cultural differences or repeated stress. It does not decide the breakup for you. Ask whether both of you are still working on the same side and whether the effort is building something healthier, rather than treating “never give up” as a rule that applies to every relationship.'],
  ['career', 'I am looking for work. How will the search go?', 'You may have faced several rejections already, but the Nine of Wands asks you not to treat them as proof that nothing will work. Keep going, while learning from each attempt. Persistence is most useful when it includes adjustment: refine the CV, practise interviews and change the search strategy when the evidence says you should.'],
  ['career', 'What should I watch for at work soon?', 'You may run into a manageable but tiring obstacle: a difficult task, delay or recurring problem that needs attention before you can move on. The card favours endurance, not martyrdom. If the same issue keeps returning, solve the cause or ask for help instead of simply proving that you can tolerate it again.'],
  ['other', 'What is the lesson of this card?', 'The Nine of Wands teaches persistence after difficulty. It is the moment when you are tired but not necessarily finished. The deeper lesson is to distinguish persistence from stubbornness: keep going when the goal still matters and the path is workable, but do not stay on a harmful path merely because you have already come far.']
],
'swords-9': [
  ['love', 'What kind of person does this card describe?', 'The Nine of Swords speaks more about a mental state than a fixed personality. Someone may be anxious, losing sleep, blaming themselves or seeing everything through a very heavy lens. When the mind is overloaded, it can feel as though nobody understands and there is no way out, even when support and options still exist.'],
  ['love', 'Should I date someone who carries this energy?', 'Do not decide whether to love someone from one card. If they are going through anxiety or emotional pain, look at whether they recognise it, seek appropriate support and still respect your boundaries. You can care about someone without becoming responsible for fixing their mental health.'],
  ['love', 'We argue a lot. Should I break up with them?', 'The Nine of Swords suggests that the conflict has become emotionally exhausting. One or both of you may be stuck in fear, jealousy, resentment or repeated demands that the other person change. The card does not guarantee that the relationship can or cannot be repaired. What matters is whether both people can take responsibility, communicate safely and change the pattern rather than only promising to.'],
  ['love', 'What should I do in this situation?', 'Look for a solution that is mutual rather than one-sided. You can make the first calm move, but a relationship cannot be repaired by one person repeatedly surrendering while the other changes nothing. If the dynamic is causing ongoing fear, humiliation or emotional harm, you are allowed to step away and seek support.'],
  ['career', 'I have been unemployed for a long time. Will I find a job soon?', 'The Nine of Swords shows how stressful the search has become. After repeated rejection, you may enter interviews already expecting failure, and that can affect how confidently you present yourself. This is not about a “low frequency attracting failure”. Focus on what you can influence: preparation, practice, feedback, sleep and mental wellbeing while you continue the search.'],
  ['career', 'What should I watch for at work soon?', 'Work may be feeding worry, but separate the source carefully. Is the job itself unreasonably stressful, are expectations unclear, or are you reacting strongly to normal feedback because you are already exhausted? The answer may be a boundary, a conversation, better systems, time off or a different job. Do not assume every criticism is persecution, but do not dismiss a genuinely unhealthy workplace either.'],
  ['other', 'What is it like to read for someone with this energy?', 'A reading with someone who is very anxious or distressed can be emotionally tiring, especially when you are concentrating and empathising for a long time. Set time limits, take breaks between readings and remember that you do not have to carry another person’s emotions after the session ends.']
],
'cups-9': [
  ['other', 'What is the key meaning of this card?', 'The Nine of Cups is satisfaction: enjoying what you have and feeling that something has gone well. Its shadow is complacency — treating a good result as if there is nothing left to learn or improve. The card asks you to enjoy the win without turning comfort into stagnation.'],
  ['other', 'Can you give me an example?', 'Imagine a student gets an excellent result in a mock exam. The Nine of Cups fits the pleasure and confidence that follow. The caution is assuming that one good practice result guarantees the final exam. Celebrate, then keep the habits that produced the result.'],
  ['love', 'What kind of person does this card describe?', 'This card can describe someone optimistic, pleasure-loving and comfortable with themselves. In the shadow, confidence can become self-satisfaction or a need to be admired. Look at whether they can enjoy their own success without making other people feel smaller.'],
  ['love', 'What kind of feelings do they have for me?', 'The answer can lean positive, but the Nine of Cups asks whether the person values the relationship itself or mainly enjoys the attention and satisfaction it gives them. Attraction and pleasure can be genuine while still being self-focused. Watch what happens once they no longer need to “win” you: do care, respect and effort remain?'],
  ['love', 'We are arguing. How should we handle it?', 'Pride may be keeping the argument alive. Each person may feel too certain that they are right to apologise or listen first. The Nine of Cups asks you to value the relationship more than the satisfaction of winning the disagreement. If the issue is important, draw more cards or, better still, talk about the actual need underneath it.'],
  ['career', 'Will I find a job I like soon?', 'The Nine of Cups suggests checking whether your expectations match your experience, the market and what you actually value. This does not mean you are “overrating yourself”. Keep the standards that matter, but identify where you can be flexible enough to widen the opportunities available to you.'],
  ['career', 'What should I watch for at work soon?', 'Things may be going well, and that is exactly why complacency is the caution. Enjoy recognition without assuming you have nothing left to learn. Keep asking questions, improving your craft and noticing what the next level requires.']
],
'pentacles-9': [
  ['other', 'What is the key meaning of this card?', 'The Nine of Pentacles is material independence, comfort and enjoying the life you have built. It does not judge whether someone prefers simple pleasures or expensive ones. The important theme is being able to appreciate what you have without needing another person to provide your sense of security.'],
  ['love', 'What kind of person does this card describe?', 'This person values comfort, independence and having a life that feels like their own. They may enjoy possessions, good food, a peaceful home or simply the freedom to choose how they live. The healthy form is self-sufficiency; the shadow is becoming so self-contained that partnership feels like an intrusion.'],
  ['love', 'What kind of feelings do they have for me?', 'The Nine of Pentacles shows someone who values independence and their own world. They may care for you while still needing plenty of personal space, or they may not want to merge every part of life into a relationship. Watch whether independence still comes with mutual care and giving, or whether it becomes distance and one-sided receiving.'],
  ['love', 'We are arguing. Does this mean we have to break up?', 'The tension may come from different needs for independence and togetherness. One person may want more shared time and commitment while the other protects a strong private life. Neither need is automatically wrong. The question is whether you can agree on a balance that leaves both people cared for rather than controlled or neglected.'],
  ['career', 'Will I find a new job soon?', 'The answer leans positive, especially toward work that improves your financial independence or gives you more control over your life. Do not treat the card as a guarantee of luxury; use the actual offer, salary and conditions to judge whether the role gives you the stability you need.'],
  ['career', 'Exactly how much will the salary be?', 'Tarot cannot give a reliable salary figure. The Nine of Pentacles points to comfort, independence and material sufficiency. To judge whether an offer is truly good, compare it with the market, your cost of living, your experience and your real financial goals.'],
  ['career', 'How will my work go in the near future?', 'Work can remain stable enough to support a comfortable life, but the card also asks whether you have time to enjoy what you earn. More income is not the same as a better life if the job consumes every hour. Look at money, autonomy, time and wellbeing together.']
]
});

Object.assign(ASK.en, {
'wands-10': [
  ['love', 'What kind of person does this card describe?', 'The Ten of Wands often describes someone who carries too many responsibilities. They may find it hard to say no, be used to doing everything themselves or struggle to prioritise. Sometimes the workload genuinely comes from circumstances rather than being self-created. The useful question is which burdens are necessary, which can be shared and which can be put down.'],
  ['love', 'What kind of feelings do they have for me?', 'They may genuinely care about you, but their attention is divided across many responsibilities. The issue is not necessarily lack of feeling; it may be lack of capacity. Ask yourself whether the amount of time and attention they can realistically offer works for you, and say clearly what you need instead of hoping they will guess.'],
  ['love', 'We are arguing. Should I break up with them?', 'The conflict may be coming from overload rather than lack of love. When both people are exhausted, patience disappears quickly and small requests can feel like extra weight. The card does not automatically advise a breakup. First ask whether this is a temporary busy period and whether both of you can protect some connection while the pressure lasts.'],
  ['love', 'What should I do while I am this busy?', 'Tell your partner clearly what your limits are instead of staying silent until you snap. Agree on small, realistic ways to stay connected during the busy period. When pressure eases, actively restore balance to the relationship. If overload never ends, review workload, expectations and support rather than turning it into a reason to blame yourself.'],
  ['career', 'Will I find a job I like soon?', 'The Ten of Wands shows that the job search is competing with too many other demands, so progress may be slower than you want. Rather than treating this as a flat no, narrow your priorities: protect time for applications, interviews and company research, and postpone what is not urgent where you can.'],
  ['career', 'What may happen at work soon?', 'The near future may simply be busy. Projects can overlap, people may ask for extra help and tasks outside your usual role may accumulate. The warning is overload, not disaster. Clarify priorities early, negotiate deadlines and ask what can be delegated before everything becomes urgent at once.'],
  ['other', 'So what should I do?', 'Start by admitting that the load is too large. Write down everything you are carrying, separate urgent from important and decide what can be delayed, delegated or declined. Tarot can point to the pattern; the practical solution is prioritisation, boundaries and asking for help where appropriate.']
],
'swords-10': [
  ['other', 'What is the key meaning of this card?', 'The Ten of Swords is the feeling that a painful cycle has reached its limit: exhaustion, disappointment or the sense that you cannot take any more. Thoughts can intensify pain, but outside circumstances can be very real too. The constructive side is that an ending has become visible. The question shifts from “how much longer can I endure this?” to “what needs to end, and how do I recover?”'],
  ['other', 'Some people say this card has a positive side. Is that true?', 'Yes. The Ten of Swords is often read as the bottom of a cycle, so it also contains ending and recovery. But “time will fix everything” is not the whole message. Look at what needs to stop, what support is needed and what lesson could prevent the same pattern from repeating.'],
  ['love', 'What kind of person does this card describe?', 'The Ten of Swords should not be used to label someone’s whole personality. It often describes a period of exhaustion, pessimism or feeling pushed to the limit. In that state, someone may struggle to see positive possibilities and react more heavily than usual. The state can change as circumstances and mental wellbeing improve.'],
  ['other', 'What might it feel like to talk with someone in this energy?', 'Long conversations with someone who is in constant despair or crisis can be emotionally tiring. That does not make them an “energy vampire”. You can listen while keeping limits: you will not always have the capacity to take everything in, and when the issue is beyond what you can hold, encouraging trusted people or professional support is appropriate.'],
  ['love', 'What kind of feelings do they have for me?', 'The person may care about you while viewing the relationship through fear, distrust or expectations of being hurt. Those fears can distort how they interpret ordinary behaviour. Instead of trying to prove yourself endlessly, look for whether they can talk about their fears, check assumptions and build trust with you in a mutual way.'],
  ['love', 'Should I help someone in this state?', 'You can help within your limits, but you cannot force another person to change or accept support before they are ready. Be clear about what you can and cannot offer and encourage appropriate support. If the relationship is repeatedly exhausting or harmful to you, creating distance is also a reasonable choice.'],
  ['other', 'Why can a reading be unhelpful for someone in this state?', 'When someone feels hopeless, a reading may not help if they only want confirmation that everything is fixed by fate. A reader should avoid reinforcing helplessness. Use Tarot to open questions and practical choices, and be clear about its limits. In a serious mental-health crisis, a reading is not a substitute for professional support.'],
  ['love', 'We argue constantly. Should I break up with them?', 'The Ten of Swords suggests that the current form of the relationship has become deeply exhausting or painful. Something in the cycle needs to end, but that may mean ending the harmful pattern, taking space to recover or ending the relationship itself. If there is violence, threats or fear, prioritise safety and outside support rather than using Tarot to decide.'],
  ['career', 'Will I find a job I like?', 'You may be too exhausted or discouraged by the search to show your best self right now. That does not mean employers can magically “sense bad energy”. If possible, give yourself some recovery while continuing small practical steps: improve the CV, practise interviews and ask for support. There is no required one- or two-month waiting period.'],
  ['career', 'Will anything difficult happen at work soon?', 'The Ten of Swords can reflect a workplace situation that already feels close to breaking point: burnout, a project ending, conflict or the need to leave a bad setup. One card cannot tell you who is at fault. Look at concrete facts, protect your wellbeing and draw more cards only as a reflective tool, not as evidence against colleagues or managers.']
],
'cups-10': [
  ['other', 'What is the key meaning of this card?', 'The Ten of Cups is shared happiness, emotional belonging and a cycle reaching a harmonious completion. The family scene in the image is symbolic rather than a rule about what happiness must look like. At its best, the card describes connection, gratitude and the feeling of being at home with other people.'],
  ['other', 'How strong are the Tens in the Minor Arcana?', 'Within many Tarot teaching systems, Tens represent the fullest development of their numbered suit before the court cards are considered separately. That makes them useful for reading completion or culmination. Treat this as a structural convention of the deck, not a measurable force stronger or weaker in an objective sense.'],
  ['love', 'What kind of person does this card describe?', 'This card can describe someone warm, emotionally generous and comfortable creating a sense of belonging around them. They may be good at making others feel included and heard. The card does not guarantee high emotional intelligence, but it does favour openness, connection and shared joy.'],
  ['love', 'What kind of feelings do they have for me?', 'This is a very positive card for love. It suggests affection, belonging and the wish to build a harmonious future together. Still, one card is not proof of marriage plans or another person’s exact level of commitment. Let their words, actions and real plans confirm what the card symbolises.'],
  ['love', 'We are arguing. What does this card advise?', 'The Ten of Cups suggests that the relationship may have a strong emotional foundation even if you are currently upset. Do not let one small conflict erase the whole picture, but do not use a “good card” to dismiss a serious issue either. Return to what you value together and talk about the specific disagreement.'],
  ['career', 'Will I find a new job soon?', 'The answer can lean positive for finding work that feels emotionally satisfying or socially supportive. The Ten of Cups says more about enjoyment, belonging and a good environment than about salary or promotion. Use another card or, better, the actual offer details to evaluate money and career growth.'],
  ['career', 'What should I watch for at work soon?', 'The card points toward harmony and support rather than a particular warning. Enjoy a cooperative period, strengthen good relationships and do not assume that “nothing to worry about” means there is nothing to maintain. Healthy teams stay healthy because people keep contributing to them.']
],
'pentacles-10': [
  ['other', 'What is the key meaning of this card?', 'The Ten of Pentacles is long-term material stability, family resources, inheritance of values and the structures that support a life over time. Its abundance is broader than cash: home, security, networks and what one generation passes to the next can all belong here.'],
  ['other', 'How is this different from the Ten of Cups?', 'Both cards can show fulfilment, but the emphasis differs. The Ten of Cups centres emotional belonging and shared happiness. The Ten of Pentacles centres the structures around that life: family systems, money, home, tradition and long-term security. Those structures can support you, but they can also carry expectations that feel restrictive.'],
  ['love', 'What kind of person does this card describe?', 'This is someone stable and practical who often thinks in long timeframes. They may value family, security, savings and helping people in ways that are sustainable. Their generosity tends to be considered rather than impulsive. The shadow is allowing tradition or material security to become more important than flexibility and individual choice.'],
  ['love', 'What kind of feelings do they have for me?', 'The Ten of Pentacles can show someone thinking about love in long-term, practical terms: family, home, finances, lifestyle and whether a shared life could work. They may value similar backgrounds or values, but the card does not mean they chose you for status or family conditions. Look for whether practicality is joined by affection, respect and genuine understanding.'],
  ['love', 'Why are we arguing?', 'A single Ten of Pentacles does not explain every relationship conflict, but it often points toward family systems or practical life. Pressure from relatives, differences in tradition or religion, housing, money and spending can all become sources of tension. Draw more cards if you need to see which part is actually active.'],
  ['career', 'Will I find a new job?', 'The Ten of Pentacles is a positive symbol for stability and a solid financial foundation, but it cannot guarantee a job or a particular salary. If a new opportunity appears, judge pay, benefits, security and development with real information. The card is best read as a preference for something sustainable rather than a promise of wealth.'],
  ['career', 'Will my work change soon?', 'The Ten of Pentacles usually favours continuity and slow development rather than sudden change. If your current work is stable, that stability may continue. If growth comes, it is more likely to be built through accumulated experience, responsibility and resources than through an overnight leap.']
]
});

Object.assign(ASK.en, {
  "wands-c0": [
    [
      "other",
      "What are the keywords for this card?",
      "Page of Wands is a newly lit spark: curiosity, enthusiasm, exploration and the urge to try something new. Its shadow is impulsiveness, inexperience, or starting with great energy without yet knowing how to sustain it. Think of every Page as someone learning how to use the element of their suit."
    ],
    [
      "love",
      "What kind of personality does this card describe?",
      "A Page of Wands person is usually open, energetic and action-oriented. They get excited by new experiences and can be impulsive because they are still learning. Their strength is genuine curiosity and a willingness to learn from feedback."
    ],
    [
      "love",
      "Which is more impulsive, the Page or the Knight of Wands?",
      "The Knight of Wands is usually more impulsive and moves faster. The Page still has plenty of fire, but feels like a beginner: excited, curious and more able to pause and learn. The Knight is more likely to act first and think later."
    ],
    [
      "love",
      "How does this person feel about me?",
      "This card often suggests a new spark. They may find you exciting, attractive and worth getting closer to. The interest can be sincere and lively, but it is still young, so the card cannot tell you how deep it will become. Watch whether their actions stay consistent."
    ],
    [
      "love",
      "We are arguing. How should we handle it?",
      "The conflict may come from reacting too quickly or not yet knowing how to handle strong feelings when things get heated. Slow the conversation down, deal with one issue at a time and do not turn it into a contest. The same passion that fuels the argument can also help you solve it together."
    ],
    [
      "career",
      "Will I find a new job soon?",
      "Page of Wands supports opening a new direction, but it does not promise that a job will simply appear. Be proactive: apply, explore unfamiliar fields and accept a period of learning as you go. Opportunities are more likely to show up once you start moving."
    ],
    [
      "career",
      "What should I watch for at work in the near future?",
      "A new task, project or skill may land in front of you. Do not worry about not knowing everything yet; this card is good for learning on the job. The main caution is taking on too much while excited and then losing momentum."
    ],
    [
      "other",
      "Is there an easy way to remember the Pages?",
      "Think of each Page as the beginner of its element. Page of Wands learns action and passion; Page of Cups learns emotion; Page of Swords learns thought and communication; Page of Pentacles learns skills and the material world. Remember the role first, then combine it with the suit."
    ]
  ],
  "swords-c0": [
    [
      "love",
      "What kind of personality does this card describe?",
      "Page of Swords is often quick-minded, curious and observant, but still learning how to communicate well. They may speak too bluntly, ask too many questions or react before considering how their words land. This is inexperience in thought and communication, not bad character."
    ],
    [
      "love",
      "How does this person feel about me?",
      "This card shows a lot of watching and thinking, but the feelings may not be clear or deep yet. They can be curious about you, want to learn more and analyse the connection logically. Do not label them calculating or insincere from one card; look at how they actually behave."
    ],
    [
      "other",
      "How is this Page different from the other three?",
      "Page of Swords brings newness into the world of ideas, questions and communication. It often points to a new idea that has not been tested yet, or someone learning how to use words and reason. The strength is curiosity; the weakness is jumping to conclusions."
    ],
    [
      "love",
      "We are arguing. How can we resolve it?",
      "Communication is the main issue here. You may be listening in order to argue back rather than to understand, or speaking too quickly while upset. Ask when you are unsure, avoid assumptions and let each other finish before responding."
    ],
    [
      "career",
      "Will I find a new job?",
      "This card makes the job search a matter of information, learning and clear decisions. New opportunities may appear, but read the details, ask about conditions and do not change direction only because of a moment of anxiety. The outcome depends heavily on how well you gather information and act on it."
    ],
    [
      "career",
      "What should I pay attention to at work soon?",
      "New ideas, messages or discussions may arrive quickly. Check your facts before presenting them and mind your tone so small misunderstandings do not grow. One good question can be more useful than a rushed conclusion."
    ]
  ],
  "cups-c0": [
    [
      "other",
      "What are the keywords for this card?",
      "Page of Cups is a new feeling beginning: tenderness, curiosity, imagination, creativity and emotional openness. It can be a crush, a friendship, a new interest or a fresh source of inspiration. Its shadow is idealising, being swept away by emotion or not yet knowing what you truly want."
    ],
    [
      "love",
      "What kind of personality does this card describe?",
      "This person is often sensitive, open, imaginative and easily moved by new experiences. They have a youthful quality, are curious about people and tend to meet life through feeling. When immature, they may daydream or change interests quickly."
    ],
    [
      "love",
      "Is this person better as a friend or a partner?",
      "The card cannot decide that someone is “better as a friend than a partner”. It shows a person with fresh emotions and curiosity who is still learning about themselves. Whether a relationship lasts depends on consistency, boundaries and communication, not this card alone."
    ],
    [
      "love",
      "How does this person feel about me?",
      "There may be a sincere but still gentle and new attraction. They can find you interesting, sweet or emotionally inviting. Give the feeling time to develop instead of rushing to define it."
    ],
    [
      "love",
      "What should I do when we argue?",
      "Do not try to win through emotion. Say what made you sad or insecure, then ask what the other person is feeling instead of guessing. Page of Cups asks both of you to return to softness and curiosity."
    ],
    [
      "love",
      "So what should I do now?",
      "Give yourself a little time to identify the real feeling before reacting. If you need to talk, use “I feel…” language rather than blame. A gentle but honest conversation suits this card better than a rushed decision."
    ],
    [
      "career",
      "Will I find a new job?",
      "This card can point toward work that genuinely interests you, especially creative, caring or people-focused roles, but it does not guarantee a hiring result. Use your curiosity to explore opportunities and check the practical conditions before accepting."
    ],
    [
      "career",
      "What should I pay attention to at work soon?",
      "A new idea, invitation or interest may make work feel fresher. Give it room to be tested, but do not let inspiration replace a plan. If your work involves people, emotional sensitivity can be a real strength."
    ]
  ],
  "pentacles-c0": [
    [
      "love",
      "What kind of personality does this card describe?",
      "Page of Pentacles is usually practical, diligent and comfortable learning by doing. They care about skills, money, study or a goal they can measure. Their weakness can be excessive caution, a slow start or trusting only what is immediately tangible."
    ],
    [
      "love",
      "How does this person feel about me?",
      "They may be taking you seriously in a slow, practical way. Interest is more likely to show through small actions, time and reliability than dramatic romance. The feeling is still at an early stage, but it can grow if both of you keep investing in it."
    ],
    [
      "love",
      "Why do we argue so often?",
      "You may differ in pace, money habits, plans or how practical you want the relationship to be. One person needs certainty at every step while the other wants to move faster. Talk about what each of you needs to feel secure instead of treating slowness as lack of love."
    ],
    [
      "career",
      "Will I find a job I like soon?",
      "Page of Pentacles is encouraging for training, internships, a new position or work that builds useful skills. It does not promise a perfect job immediately, but it supports an opportunity with room to grow. Prioritise a place where you can learn something valuable."
    ],
    [
      "career",
      "What may happen at work in the near future?",
      "You may enter a period of learning, take on a new task or begin a more concrete goal. Slow, steady progress suits this card. Do not dismiss small gains; this is the kind of energy that builds a foundation one piece at a time."
    ]
  ]
});

Object.assign(ASK.en, {
  "wands-c1": [
    [
      "other",
      "What are the keywords for this card?",
      "Knight of Wands is fast movement, passion, risk-taking and the urge to experience life. This is the person who wants to go as soon as something excites them. The shadow is impatience, inconsistency and losing interest once the first rush fades."
    ],
    [
      "other",
      "How is a Knight different from a Page, Queen or King?",
      "The Page is learning. The Knight has enough energy to charge into action but has not fully mastered it yet. Queens and Kings regulate their element more maturely. Knights are therefore the most mobile court cards and often the most likely to overdo their suit."
    ],
    [
      "love",
      "How does this person feel about me?",
      "They may feel a strong attraction and want things to move quickly. This is passionate, proactive and excited energy, but it does not automatically mean long-term commitment. Watch whether the interest remains once the novelty wears off."
    ],
    [
      "love",
      "What is an example of this kind of attraction?",
      "A typical example is someone who messages often, wants to meet quickly, invites you out and speeds the connection along. That can feel exciting, but distinguish a rush from consistency. Knight of Wands is excellent at starting; staying power has to be shown over time."
    ],
    [
      "love",
      "Why do we argue so often?",
      "You may both react too quickly, compete for control or flare up before thinking things through. Arguments grow because you are talking while still heated. Pause before responding and let one person finish before the other jumps in."
    ],
    [
      "other",
      "Should I get a reading about my partner?",
      "You can use Tarot to reflect on your own feelings and choices, but do not use it to monitor someone or claim certainty about what is in their mind. If what you truly need is clarity, a direct conversation is usually more reliable than a card pull."
    ],
    [
      "career",
      "Will I find a job I like soon?",
      "Knight of Wands supports an active job-search period with interviews, travel or opportunities that arrive quickly. An exciting role may appear, but read the conditions before accepting purely on adrenaline. Speed helps when it is paired with judgement."
    ],
    [
      "career",
      "Is there a problem with the way I am looking for work?",
      "You may be doing a lot without enough strategy: sending applications everywhere, changing direction constantly or saying yes too fast. Choose a few clear targets, track each application and prepare properly for each interview. Less activity with more intention can work better."
    ],
    [
      "career",
      "I have a normal office job. What may change soon?",
      "Work may become busier through an urgent project, travel or a task that needs a quick response. It is a good time to take initiative, but do not let a fast pace become burnout. Choose carefully what is actually worth charging into."
    ]
  ],
  "swords-c1": [
    [
      "other",
      "What kind of personality does this card describe?",
      "Knight of Swords is quick-minded, decisive, argumentative and direct. They can be excellent when fast action is needed, but may become sharp-tongued, impatient or overly certain they are right. The lesson is to use mental speed without turning it into a weapon."
    ],
    [
      "other",
      "What do the Knight and Page have in common?",
      "Neither has fully mastered the suit yet. The Page is learning and asking questions; the Knight has formed an opinion and charges forward, so excess is more likely. In Swords, this shows up as fast thinking, strong words and rushed decisions."
    ],
    [
      "love",
      "What does this person think of me?",
      "They may be thinking about you intensely and want a clear answer about where things stand. They approach the connection through logic, direct questions and a need for definition. That does not tell you how deep the love is; it shows that their mind is very active around the relationship."
    ],
    [
      "love",
      "Is this person right for me?",
      "One card cannot decide who is “meant for you”. Knight of Swords may suit someone who likes directness, speed and intellectual debate, but can feel exhausting to someone who needs a softer pace. Look at how the two of you actually handle disagreement."
    ],
    [
      "love",
      "Why do we argue so often?",
      "You may be debating to win rather than to understand. Someone may interrupt, counter too quickly or use facts in a cutting way. Slow down, separate facts from interpretations and avoid long angry messages."
    ],
    [
      "career",
      "Will I find a job I like soon?",
      "This card supports fast movement, especially in roles involving thinking, communication, analysis or rapid problem-solving. Still, do not accept a job only because you want to escape your current situation. Ask about the role, workload and expectations before deciding."
    ],
    [
      "career",
      "I have been searching for ages with no result. What should I do?",
      "Do not let impatience turn into unfocused applications. Review your CV, practise interview answers and ask someone you trust to look at your search strategy. Knight of Swords needs a clear target so its speed does not scatter."
    ],
    [
      "career",
      "I have a normal office job. What may change soon?",
      "You may enter a period of quick decisions, urgent conversations or projects that need fast analysis. A very direct, driven person may also become important at work. Keep facts clear and do not let a tense pace turn into unnecessary conflict."
    ],
    [
      "other",
      "How should I learn this card properly?",
      "Do not memorise Knight of Swords as simply “sharp-tongued”. Use the structure: Knight is action and movement; Swords are thought, speech and decisions. Together they create very high mental speed — useful when decisiveness is needed, difficult when it is uncontrolled."
    ]
  ],
  "cups-c1": [
    [
      "other",
      "What does the image on this card show?",
      "Knight of Cups rides forward while offering a cup, as if carrying an invitation, feeling or proposal. Compared with the other Knights, his movement is gentler and slower. The image emphasises the act of bringing an emotion toward someone."
    ],
    [
      "other",
      "What is the main keyword for this card?",
      "The strongest keyword is romance. Other themes are invitations, charm, imagination, emotional pursuit and idealisation. Its shadow is falling in love with the feeling of being in love instead of really knowing the person in front of you."
    ],
    [
      "other",
      "What kind of personality does this card describe?",
      "This person is often charming, emotionally expressive and guided by inspiration. They can be romantic and sensitive, but when immature may make promises in a feeling and change direction when the feeling changes."
    ],
    [
      "other",
      "Why is this the most negative level of the court cards?",
      "It is better not to call Knight of Cups the “most negative” court level. Every court card has light and shadow. Here the risk is being carried too far by emotion and ideals; the strength is actively bringing affection, art and gentleness into the world."
    ],
    [
      "love",
      "What does this person think of me, and how do they approach the relationship?",
      "They may see you through a romantic lens and want to move closer. Sweet words, invitations and affectionate gestures can come easily. Enjoy that beauty, but let time show whether the feeling is supported by consistency."
    ],
    [
      "love",
      "I used to find this kind of person very romantic. Is that accurate?",
      "Yes. This is one of the most romantic images among the court cards. Romance, however, does not automatically make a relationship healthy or lasting. Look for consistency, respect for boundaries and the ability to keep promises as well."
    ],
    [
      "love",
      "We argue a lot. What should we do?",
      "One or both of you may react emotionally and expect the other person to understand without being told. State your needs instead of testing each other, going silent for reassurance or using grand gestures to cover an unresolved issue. Simple honesty works better than drama."
    ],
    [
      "love",
      "What if both of us carry this energy?",
      "You can create a lot of beautiful emotion together, but may also idealise the relationship and avoid practical matters. Keep the romance while talking clearly about time, money, boundaries and commitment. Beautiful feelings still need a solid frame."
    ],
    [
      "other",
      "Should I let all my emotions show?",
      "Expressing emotion does not mean saying or doing everything the moment a feeling appears. Let yourself feel it, then choose an expression that does not harm you or someone else. Emotional maturity means honesty with self-regulation."
    ],
    [
      "career",
      "Will I find a new job I like soon?",
      "Knight of Cups can suggest an invitation or role that genuinely appeals to you, especially in creative, artistic, caring or people-focused work. Check salary, conditions and growth as well, because this card says more about emotional fit than material stability."
    ]
  ],
  "pentacles-c1": [
    [
      "other",
      "What kind of personality does this card describe?",
      "Knight of Pentacles is persistent, practical and responsible. They do not need to move quickly; they prefer a clear goal and steady steps. The shadow is rigidity, doing things only from habit or staying on a path after it already needs adjusting."
    ],
    [
      "other",
      "What is the negative side of this card?",
      "Persistence can become stubbornness, and practicality can become tunnel vision. Knight of Pentacles may focus so hard on the task in front of them that they forget to ask whether the original goal still fits. Sometimes you need to review the direction, not only the progress."
    ],
    [
      "love",
      "What does this person want from me and from the relationship?",
      "They may want something stable, clear and buildable over time. Interest is often shown by being present, keeping promises and doing practical things. The pace can be slow, but slow does not mean uncaring."
    ],
    [
      "love",
      "Why do we argue so often?",
      "One person may need stability and plans while the other wants more flexibility or emotional expression. Knight of Pentacles can also cling to “the way we always do it” and resist feedback. Separate true core values from habits that can be negotiated."
    ],
    [
      "other",
      "Can you give an example of this card becoming narrow-minded?",
      "You may save diligently for a goal without noticing that the goal no longer fits your life, or complete every task exactly by procedure without asking whether there is a better way. The problem is not lack of effort; it is lack of distance to see the whole picture."
    ],
    [
      "career",
      "I have been unemployed for months. Will I find a job I like?",
      "Knight of Pentacles supports a stable path rather than an overnight turnaround. Keep applying, building skills and following up on opportunities. A suitable role may come through consistent effort; the card does not promise a date or salary."
    ],
    [
      "money",
      "Is Knight of Pentacles bad with money?",
      "No. This is one of the most practical and disciplined energies for money. Its strengths are steady saving, planning and following a goal; its weakness is becoming so cautious that sensible opportunities are missed."
    ],
    [
      "career",
      "I have a normal office job. What may change soon?",
      "You may enter a phase of steady work, clear procedures and a longer-term target. Change may be quiet: gradually more responsibility, stronger skills or a clearer goal. Do not underestimate progress simply because it is not dramatic."
    ],
    [
      "other",
      "How does Knight of Pentacles differ from Knight of Wands at work?",
      "Knight of Wands prioritises speed, experimentation and excitement; Knight of Pentacles prioritises reliability, process and completion. One starts quickly, the other keeps the pace. Healthy work often needs both: enough fire to begin and enough endurance to finish."
    ]
  ]
});

Object.assign(ASK.en, {
  "wands-c2": [
    [
      "other",
      "What does the image on this card show?",
      "Queen of Wands sits upright on her throne holding a wand and a sunflower. The image combines the fire of Wands with the composure of a Queen: confidence, warmth, creativity and leadership without needing to dominate every moment."
    ],
    [
      "other",
      "How is a Queen different from a King?",
      "Both Queens and Kings represent a mature relationship with their element. Queens often express it through receptivity, nurture and influence from within; Kings lean toward action, decision and outer structure. These are different modes, not a hierarchy of better and worse."
    ],
    [
      "other",
      "Why is Queen of Wands considered more balanced than King of Wands?",
      "In many teaching traditions, Queen of Wands blends Fire’s enthusiasm with the ability to hold steady and observe. She can act boldly and still know when to step back. “More balanced” is a useful symbolic teaching device, not a fixed law for every reading."
    ],
    [
      "other",
      "What kind of personality does this card describe?",
      "This person is often confident, enthusiastic, magnetic and good at motivating others. They do not have to be the most skilled person in the room; they are often the one willing to step up, try first and make others believe something is possible. The shadow can be pride or over-managing their image."
    ],
    [
      "other",
      "What is the Queen of Wands’ presence like?",
      "Her presence is warm but grounded. A person with this energy rarely needs to prove they are in the room; confidence shows in how they stand, speak and decide. Their magnetism comes from being comfortable in themselves."
    ],
    [
      "love",
      "Does this person have feelings for me?",
      "Queen of Wands is positive for attraction, warmth and interest. They may find you striking or enjoy being close to you. One card cannot confirm another person’s feelings with certainty, so let real-life actions and clarity support the reading."
    ],
    [
      "love",
      "We argue a lot. What should we do to improve things?",
      "This card asks for both honesty and respect. Do not turn confidence into a power struggle, but do not stay silent simply to avoid conflict either. State your needs, hold your boundaries and remember that a healthy relationship does not require either person to shrink."
    ],
    [
      "career",
      "Will I find a job I like soon?",
      "Queen of Wands favours showing yourself well in applications, interviews and networking. A suitable opportunity may respond to confidence and visible initiative. Keep applying instead of only waiting, but avoid scattering your effort across roles you do not really want."
    ],
    [
      "career",
      "I have been unemployed for a long time and no one calls. What should I do?",
      "Do not let unemployment become a story that you are “not good enough”. Review your CV, portfolio and search strategy, and ask someone for honest feedback. Queen of Wands asks for confidence rooted in real ability, then clearer self-presentation."
    ],
    [
      "career",
      "I have a normal office job. What may change soon?",
      "You may be given a more proactive role: leading a small group, mentoring someone new, presenting an idea or representing the team. It does not have to be a formal promotion. The main theme is that others begin to rely on your ability to lead and energise people."
    ]
  ],
  "swords-c2": [
    [
      "other",
      "What does the image on this card show?",
      "Queen of Swords sits on her throne with one hand holding the sword upright and the other open in front of her. The image suggests clarity, firm boundaries and the ability to face truth while remaining willing to listen."
    ],
    [
      "other",
      "What kind of personality does this card describe?",
      "This person is often intelligent, independent, observant and clear in communication. They use reason without necessarily being cold. Experience has taught them what is worth saying, what can be released and which boundaries matter."
    ],
    [
      "other",
      "Is this person sharp-tongued?",
      "Not necessarily. Queen of Swords is about directness and precision more than deliberately hurting people. At her best she says what needs to be said and still listens; in shadow, defensiveness or disappointment can make her words cold and cutting."
    ],
    [
      "love",
      "How does this person feel about me?",
      "They may have feelings but want to understand the relationship with both heart and reason. Compatibility, communication, values and mutual respect matter to them. The affection can be quieter than overt romance without being less sincere."
    ],
    [
      "love",
      "Is this person sincere?",
      "This card cannot prove sincerity. It suggests someone who weighs things carefully and needs clarity before opening fully. Look for whether words match actions and whether your boundaries are respected."
    ],
    [
      "love",
      "Is this person right for me?",
      "That depends on what you need in a relationship. If you value clarity, independence and direct communication, this energy may suit you very well. If you need frequent emotional reassurance, both of you may need to learn each other’s language of care."
    ],
    [
      "love",
      "Why do we argue so often?",
      "You may both lead with arguments instead of feelings, or one person may believe they are “just telling the truth” while the other feels judged. Name both the facts and the feelings, and distinguish a clear boundary from a cold delivery."
    ],
    [
      "love",
      "Can you give an example of that kind of conflict?",
      "One person says, “That makes no sense,” when what they actually mean is, “I feel unimportant.” The other responds with more logic and the conversation moves even further away from the real feeling. Queen of Swords asks you to name the issue accurately without removing the human part."
    ],
    [
      "career",
      "Will I find a job I like soon?",
      "This card suits work involving analysis, communication, writing, research, law, strategy or independent judgement. Opportunities can respond to clear self-presentation and selective applications. Evaluate a role by real criteria, not only by whether an interview felt good."
    ],
    [
      "career",
      "I have a normal office job. What may change soon?",
      "You may need to make a clearer decision, set a boundary at work or become the person others consult for analysis. A direct conversation may be necessary. Prepare your facts and keep the delivery calm and precise."
    ]
  ],
  "cups-c2": [
    [
      "other",
      "What does the image on this card show?",
      "Queen of Cups sits by the water and studies an ornate, closed cup. The image suggests a deep emotional life, strong intuition and the ability to hold space for feelings without displaying everything outwardly."
    ],
    [
      "other",
      "What kind of personality does this card describe?",
      "This person is often empathetic, perceptive, intuitive and quick to notice other people’s feelings. They can listen very well and make others feel safe. The shadow is absorbing too much emotion around them or forgetting their own boundaries."
    ],
    [
      "other",
      "Why do people say this person has healed themselves?",
      "Do not assume that Queen of Cups means someone is completely “healed”. The card describes a relatively mature ability to recognise and care for emotion. They may have learned a great deal from experience, but they are still human and can still have tender places."
    ],
    [
      "love",
      "How does this person feel about me?",
      "This is a warm card for care, empathy and deep affection. They may genuinely pay attention to your feelings and want you to feel safe. Still, look at how they express that care and hold boundaries, because good feelings need clear action too."
    ],
    [
      "love",
      "Why do we argue so often?",
      "One person may feel a great deal but say too little, leaving the other unsure what is needed. You may also absorb each other’s moods too easily. State your needs and do not turn empathy into mind-reading."
    ],
    [
      "love",
      "How does this person reject someone?",
      "At their mature best, they try to say no kindly and consider the other person’s feelings while keeping the boundary. The shadow is delaying the answer or giving mixed signals because they are afraid of hurting someone."
    ],
    [
      "career",
      "Will I find a job I like soon?",
      "Queen of Cups can suit caring, counselling, creative, artistic, service or people-sensitive work. It speaks more about emotional fit than a specific salary. Check practical conditions too so both emotional and material needs are met."
    ],
    [
      "career",
      "What is a second possible career direction for me?",
      "Another direction is to use more listening, creativity or understanding of people within the work you already do. You do not always need a complete career change; a role in advising, customer care, experience design or community work may bring more of this energy in."
    ],
    [
      "career",
      "I have a normal office job. What may change soon?",
      "You may receive work that needs more people skills or become someone colleagues come to for support. Use empathy without taking the whole team’s emotions into yourself. Good boundaries let you help without burning out."
    ],
    [
      "other",
      "Does this card have a negative side?",
      "Yes. Too much empathy can become emotional absorption, idealisation, difficulty saying no or neglect of your own needs. Queen of Cups at her best feels deeply while still knowing which feelings belong to her and which belong to someone else."
    ]
  ],
  "pentacles-c2": [
    [
      "other",
      "What does the image on this card show?",
      "Queen of Pentacles sits in a lush setting holding a pentacle as if caring for something valuable. The image joins the material world with nurture: building stability and tending the body, home, money and things that need time to grow."
    ],
    [
      "other",
      "What kind of personality does this card describe?",
      "This person is often practical, reliable, caring and good at turning concern into concrete action. Money, health, home and ordinary needs matter to them. The shadow is carrying too much responsibility or measuring self-worth by how useful they are."
    ],
    [
      "other",
      "How is Queen of Pentacles different from King of Pentacles?",
      "Both are practical and value stability. Queen of Pentacles often expresses this through care, nurture and hands-on management of nearby resources; King of Pentacles leans toward systems, ownership, management and long-term results. They are complementary shades of the same suit."
    ],
    [
      "love",
      "What does this person think of me, and do they truly love me?",
      "They may view the relationship seriously and practically: can the two of you care for each other and build a stable life? That does not mean the affection is based only on conditions. Look for whether practicality is accompanied by warmth, respect and steady investment."
    ],
    [
      "other",
      "Can Pentacles have negative meanings?",
      "Yes. Every suit has a shadow. Stability can become clinging, practicality can become materialism, saving can become fear of scarcity and care can become control. Read the degree and context instead of assuming Pentacles are always “good for money”."
    ],
    [
      "love",
      "Why do we argue so often?",
      "The conflict may involve money, housework, time, responsibility or the feeling that one person carries too much. You may both show love by doing things but forget to say what needs saying. Divide responsibilities clearly and ask what actually makes each person feel cared for."
    ],
    [
      "career",
      "Will I find a job I like soon?",
      "Queen of Pentacles is encouraging for a stable, practical environment that can support your life. It should not be used to promise a salary or hiring result. Prioritise clear conditions, a sustainable culture and a workload you can genuinely maintain."
    ],
    [
      "money",
      "I have a normal office job. What may happen with work soon?",
      "You may be trusted with resources, clients, a budget or work that needs consistency. Finances can become more organised if you work steadily and manage well. Do not accept every extra task simply because people know you are reliable."
    ],
    [
      "other",
      "Which of the four Queens is the most positive?",
      "No Queen is “the most positive” for every question. Each has a strength: Wands in confidence and action, Swords in clarity, Cups in emotion, Pentacles in stability and care. The most useful card depends on the question and position in the spread."
    ]
  ]
});

Object.assign(ASK.en, {
  "wands-c3": [
    [
      "other",
      "What does the image on this card show?",
      "King of Wands sits on his throne holding a wand, surrounded by symbols of Fire. The image suggests someone who has learned to use passion as direction: visionary, decisive and willing to take responsibility for the path they choose."
    ],
    [
      "other",
      "What kind of personality does this card describe?",
      "This person is often confident, ambitious, visionary and proactive. They naturally initiate or lead because they can energise other people. The shadow is impatience, domination or becoming too convinced that their own way is the right one."
    ],
    [
      "other",
      "Is this a person who is never afraid?",
      "No. Courage is not the absence of fear. King of Wands tends to recognise risk and still act when the goal feels worthwhile. At his best, he uses fear as information instead of letting it drive the decision."
    ],
    [
      "other",
      "How is King of Wands different from Queen of Wands?",
      "Both are confident and magnetic. Queen of Wands often leads through influence, warmth and encouragement; King of Wands leans toward setting direction, making decisions and moving people toward a goal. These are two leadership styles, not a hierarchy."
    ],
    [
      "career",
      "If I draw a King, does it mean that person is a manager?",
      "Not necessarily. A King can describe someone with decision-making authority, a role that requires ownership, or simply the approach you need to take. Do not turn a symbolic rank into a fixed job title."
    ],
    [
      "love",
      "What does this person think of me?",
      "They may find you attractive and want to take the relationship forward actively. They often know what they want and can be clear about their intentions. Watch whether that initiative also respects your pace and choices."
    ],
    [
      "love",
      "Why do we argue so often?",
      "Conflict can arise when one or both of you wants to steer. Confidence turns into stubbornness, and decisiveness can sound like an order. Agree on which matters need one person to lead and which need a shared decision."
    ],
    [
      "career",
      "Will I find a job I like soon?",
      "King of Wands favours roles with initiative, creativity, leadership or the chance to build something of your own. Aim for places where you can use vision and take responsibility. The card does not guarantee hiring, but it encourages you to present your value and direction clearly."
    ],
    [
      "career",
      "I have a normal office job. What should I watch for soon?",
      "You may be asked to lead a project, make bigger decisions or work closely with a strong-willed person. Be proactive without taking control of everything. Good leadership gives clear direction and leaves room for others to contribute."
    ],
    [
      "other",
      "Is this card positive or negative?",
      "King of Wands is not automatically good or bad. Its light is vision, courage and leadership; its shadow is ego, impatience and domination. The question, position and surrounding cards show how the energy is being used."
    ]
  ],
  "swords-c3": [
    [
      "other",
      "What does the image on this card show?",
      "King of Swords sits upright on his throne holding the sword vertically. The image emphasises reason, decision-making authority, principles and systematic thinking. This is intelligence used to judge and decide, not only to observe."
    ],
    [
      "other",
      "How is King of Swords different from Queen of Swords?",
      "Both value truth and clear thinking. Queen of Swords often emphasises perception, boundaries and independence; King of Swords leans toward decisions, rules and responsibility for judgement. The difference is how intelligence is used, not who is smarter."
    ],
    [
      "other",
      "What does “ruthless” mean here?",
      "“Ruthless” can make this card sound harsher than it needs to. The shadow is better described as being too cold, too rule-bound or valuing efficiency over human feeling. At its best, King of Swords can make difficult decisions while still using evidence and ethics."
    ],
    [
      "other",
      "Is King of Swords as sharp-tongued as Knight of Swords?",
      "King of Swords can be very direct, but in mature form chooses words deliberately and understands their impact. The Knight reacts quickly; the King speaks with intention. The shadow appears when directness becomes contempt or logic is used to dominate."
    ],
    [
      "love",
      "What does this person think of me and of the relationship?",
      "They may be evaluating the relationship seriously and logically: do your values align, can you communicate, and can a future be built? They may show less emotion outwardly, but that does not automatically mean they are insincere. Look for consistency and respect."
    ],
    [
      "love",
      "How would this person confess their feelings?",
      "They usually prefer clarity to guessing games. If they want to move forward, they may say what they want directly and ask what you think. It may be less poetic, but it can still be warm if they truly listen to your answer instead of demanding a decision."
    ],
    [
      "love",
      "Why do we argue so often?",
      "One person may turn every issue into a problem to solve while the other needs to be heard first. Or both of you may become too focused on who is right. Learn to tell the difference between a moment that needs a solution and one that first needs emotional acknowledgement."
    ],
    [
      "career",
      "I have been unemployed for months. Will I find work?",
      "King of Swords suits a strategic review of your job search: target roles, revise the CV, practise interviews and use evidence to see what is not working. Analytical, technical, research, legal or specialist communication roles may fit this energy, but the card cannot guarantee a hire."
    ],
    [
      "career",
      "What kind of position will I have in a new job?",
      "This card can suggest work requiring judgement, responsibility, strategy or specialist communication. It does not necessarily mean a management title. Use the actual job description to understand authority rather than inferring it from the rank “King”."
    ],
    [
      "career",
      "I have a normal office job. What may change soon?",
      "You may face an important decision, a new procedure or a problem requiring careful analysis. A highly rational decision-maker may also become important. Prepare your facts, document agreements and keep communication professional."
    ]
  ],
  "cups-c3": [
    [
      "other",
      "What does the image on this card show?",
      "King of Cups sits on a throne surrounded by moving water. Emotion is still present around him, but he is not swept away by it. The image symbolises emotional maturity, calm and the ability to stay centred while circumstances move."
    ],
    [
      "other",
      "What kind of personality does this card describe?",
      "This person is often calm, a good listener and emotionally rich without letting every feeling make the decision. They can be warm and supportive. The shadow is hiding emotion too thoroughly or using calmness to avoid a conversation that needs to happen."
    ],
    [
      "love",
      "Will this person confess their feelings to me?",
      "King of Cups can suggest someone who understands their feelings and is mature enough to express them, but Tarot cannot guarantee a confession. Look at real signs: initiative, consistency and how they speak about the relationship."
    ],
    [
      "love",
      "How does this person feel about me?",
      "This is a strong card for deep affection, care and emotionally mature love. They may genuinely want to understand and support your feelings. The depth still needs to be confirmed by actions and real communication."
    ],
    [
      "love",
      "We have loved each other for years but argue often. Why?",
      "Arguing does not mean the love is gone. With King of Cups, one person may be holding too much inside in order to “stay calm”, or always playing the peacemaker until their own needs disappear. You may need to say the difficult things, not only preserve harmony."
    ],
    [
      "career",
      "Will I find a job I like soon?",
      "King of Cups suits work requiring calmness, people skills, counselling, creativity, care or emotional steadiness under pressure. It can suggest good environmental fit but does not promise a salary or hiring outcome."
    ],
    [
      "other",
      "How can I tell whether that job will pay well?",
      "Tarot can prompt more questions about money, but to know whether a job pays well, check salary, benefits, travel costs and realistic growth. A Cups card says more about the emotional experience than the number on the payslip."
    ],
    [
      "career",
      "What is a second possible career direction for me?",
      "Another direction is work that relies on emotional intelligence: counselling, customer care, people management, education, art, service or support. You can also bring these skills into your current profession rather than changing industries completely."
    ],
    [
      "career",
      "I have a normal office job. What may change soon?",
      "You may face a situation that needs calm people-management or mediation. Use your steadiness, but do not become responsible for the whole team’s emotions. Support and boundaries can exist together."
    ],
    [
      "other",
      "Can this card describe a specific person?",
      "Yes. Court cards can describe a person, a role or a way of behaving. King of Cups may represent someone calm, attentive and emotionally skilled. Link the card to a specific person only when both the spread and real context genuinely fit."
    ]
  ],
  "pentacles-c3": [
    [
      "other",
      "What does the image on this card show?",
      "King of Pentacles sits on a throne surrounded by symbols of abundance and nature. The image speaks of results built over time: managing money, resources, work and values that can be sustained."
    ],
    [
      "other",
      "What kind of personality does this card describe?",
      "This person is often practical, stable, patient and skilled at managing resources. They prefer durable results to temporary excitement and tend to think long term. The shadow is overvaluing status, money, control or safety."
    ],
    [
      "love",
      "How does this person feel about me?",
      "They may view the relationship in long-term, practical terms: building a life, finances, a home or shared plans. Practicality does not make the love less sincere. Look for warmth, respect and emotional investment as well as material support."
    ],
    [
      "love",
      "What is different about loving this kind of person?",
      "This energy is often less showy and more stable than a highly dramatic romance. Care may appear through keeping promises, being present, planning and building security. The important distinction is between stability and control, and between material provision and emotional closeness."
    ],
    [
      "love",
      "We have been together for years but argue often. Does it mean we will break up?",
      "One card cannot decide whether you will break up. King of Pentacles brings attention to long-term values: money, family, where to live, commitment and how you build a future. If those are the conflict, identify what can be negotiated and what is truly non-negotiable."
    ],
    [
      "love",
      "When are two people forced to break up?",
      "No card can decree that two people are “forced” to separate. If core values such as children, marriage, safety, respect or way of life cannot be reconciled, ending the relationship may be a healthy choice. That decision belongs to the people involved, not to Tarot."
    ],
    [
      "money",
      "Will I find a job soon?",
      "King of Pentacles is a positive symbol for stability and material competence, but it cannot guarantee a job or salary. Prioritise opportunities with clear pay, conditions and development. Symbolically, the card fits especially well with management, business or roles carrying material responsibility."
    ],
    [
      "money",
      "I have a normal office job. What may change soon?",
      "You may take on more responsibility, manage resources or see a sustainable opportunity to improve income. A financially influential or managerial person may also become relevant. Verify any change through real information rather than treating the card as a promise of promotion."
    ],
    [
      "other",
      "Can you give an example of drawing another card to go deeper?",
      "Yes. If King of Pentacles makes you think of a manager, define the next card as “How will this person affect my work?”. Three of Pentacles might then suggest cooperation or team-building. Ask one clear question for each extra card instead of drawing until you get an answer you prefer."
    ]
  ]
});


/* ---- and in German ---- */

Object.assign(ASK.de, {
'major-0': [
  ['love', 'Wie könnte mein nächster Partner sein?',
   'Dein nächster Partner ist wahrscheinlich jemand, der gern Neues entdeckt. Diese Person probiert gern Dinge aus, die sie noch nie gemacht hat, und mag es nicht, wenn jeder Tag gleich aussieht. Mit ihr kann das Leben sehr lebendig sein, aber sie denkt vielleicht noch nicht an eine frühe Ehe oder eine feste langfristige Bindung. Eine Karte allein reicht dafür nicht aus; zieh weitere Karten, wenn du es genauer wissen möchtest. Wenn du ähnlich tickst, kann die Beziehung aufregend und abenteuerlich, aber auch etwas ungestüm sein. Für etwas Dauerhaftes helfen gemeinsame Grundwerte und zugleich genug Unterschiede, damit ihr euch ergänzt. Wenn zwei Menschen sich zu sehr ähneln, verdoppeln sich manchmal auch ihre Schwächen.'],
  ['love', 'Wir streiten gerade. Soll ich mich trennen?',
   'Ob eine Beziehung beendet werden sollte, ist eine sensible Frage. Als allgemeine Regel beim Kartenlegen solltest du die tatsächliche Situation kennen und weitere Karten ziehen, bevor du eine feste Empfehlung gibst. Wenn es vor allem um Kleinigkeiten geht, deutet Der Narr nicht automatisch auf eine Trennung. Die Karte kann zeigen, dass der Beziehung etwas Neues fehlt und der Alltag zu gleichförmig geworden ist. Eine gemeinsame neue Aktivität, ein kurzer Ausflug oder ein neues Hobby kann frischen Wind bringen. Wenn die Beziehung jedoch wirklich schädlich ist, kann Der Narr auch dafür stehen, das Vertraute zu verlassen und einen anderen Weg zu wählen — selbst wenn das zunächst bedeutet, eine Weile allein zu sein.'],
  ['career', 'Ich bin arbeitslos. Finde ich bald eine Stelle?',
   'Die Tendenz geht eher zu Ja. Die nächste Möglichkeit kann außerhalb deines bisherigen Fachgebiets oder deiner Erfahrung liegen, denn Der Narr steht oft für einen völlig neuen Anfang. Jemand aus dem Verkauf könnte zum Beispiel eine Chance im Design bekommen, obwohl bisher keine formale Erfahrung vorhanden ist. Bleib offen für eine Richtung, die du ursprünglich nicht geplant hattest.'],
  ['career', 'Ich arbeite bereits. Was könnte sich bald im Job verändern?',
   'Du könntest ein Projekt aus einem völlig neuen Bereich bekommen. Weil dir dort noch Erfahrung fehlt, wirst du vieles von Grund auf lernen müssen.'],
  ['career', 'Ich habe gerade einen neuen Job angefangen. Was sollte ich tun?',
   'Fehler gehören dazu, wenn etwas noch ungewohnt ist. Nimm dir Zeit zum Lernen, frag Kolleginnen, Kollegen oder Vorgesetzte, wenn dir etwas unklar ist, und geh Schritt für Schritt vor, statt sofort perfekt sein zu wollen. In diesem Kurs ist wichtig: Die Kartenbedeutung ist nur der Anfang einer Legung. Entscheidend ist, welchen Rat du aus der Karte zusammen mit der tatsächlichen Situation der fragenden Person ableitest.'],
  ['other', 'Was sagt diese Karte über meine aktuelle Energie?',
   'Der Narr sagt: Mach den ersten Schritt selbst. Seine Energie ist neugierig, offen und bereit, etwas zu entdecken. Wenn du darauf wartest, dass alles von allein zu dir kommt, ermutigt dich diese Karte, aufzustehen und selbst loszugehen.']
],
'major-1': [
  ['love', 'Wie könnte mein nächster Partner sein?',
   'Diese Person ist wirklich kompetent und vertraut den eigenen Fähigkeiten. In ihrem Bereich ist sie meist sehr gut, erkennt Chancen schnell und weiß im Alltag, wie sie mit Situationen umgehen kann. Beruflich und praktisch dürfte sie einiges mitbringen.'],
  ['love', 'Liebt mich diese Person sehr?',
   'Der Magier allein kann nicht messen, wie tief die Gefühle eines Menschen sind. Die Karte beschreibt eher die Person und ihre Art zu handeln als die Stärke ihrer Emotionen. Zieh weitere Karten, wenn du die Gefühle genauer betrachten möchtest.'],
  ['love', 'Welche Gefühle hat diese Person für mich?',
   'Der Magier spricht stärker über Handeln als über Gefühl. Allein zeigt er deshalb nicht, wie tief die Zuneigung ist. Was er deutlich macht, ist Initiative: Diese Person bewegt sich aktiv auf dich zu. Ob dahinter echte Liebe steht, braucht weitere Karten. Erscheint Der Magier zusammen mit dem Ass der Kelche, unterstützt die Kombination deutlich stärker echte Gefühle und den Wunsch, sie zu zeigen. Menschen mit Magier-Energie sprechen oft direkt aus, was sie empfinden, und lassen Gefühle nicht lange in der Schwebe.'],
  ['love', 'Wir streiten. Was rät diese Karte für unsere Beziehung?',
   'Sei die Person, die das Gespräch eröffnet. Wenn möglich, trefft euch direkt, sprecht ehrlich miteinander und sucht gemeinsam nach einer Lösung. Die Antwort sollte von euch beiden kommen und nicht von außen.'],
  ['love', 'Soll ich mich trennen?',
   'Der Magier fordert zum Handeln auf, aber Handeln bedeutet nicht automatisch Trennung. Es kann heißen, selbst das Gespräch zu suchen und Dinge klar auszusprechen. Viele Paare verstehen einander nach einem offenen Gespräch besser. Weil eine Trennung oder auch eine Kündigung sensible Entscheidungen sind, sollte eine einzelne Karte nicht als endgültige Antwort behandelt werden. Zieh weitere Karten und bezieh die reale Situation mit ein.'],
  ['career', 'Ich bin seit sechs Monaten arbeitslos. Finde ich bald eine Stelle?',
   'Du kannst Arbeit finden, aber diese Karte betont eigenes Handeln statt Warten. Sie kann auch eine Phase beschreiben, in der jemand sehr passiv geworden ist und hofft, dass ein Angebot einfach auftaucht. Der Magier erinnert daran, dass Chancen wahrscheinlicher werden, wenn du aktiv suchst, Kontakte ansprichst und dich selbst ins Spiel bringst.'],
  ['money', 'Was gibt es diesen Monat Neues für mich?',
   'Diesen Monat könntest du dir selbst eine berufliche oder finanzielle Chance schaffen. Es geht weniger darum, dass jemand dir etwas anbietet, sondern darum, dass du selbst eine Tür öffnest. Vielleicht findest du eine neue Einnahmequelle oder nutzt eine Fähigkeit auf eine neue Weise.'],
  ['verdict', 'Soll ich meinen Job kündigen?',
   'Der Magier allein reicht nicht für ein schlichtes Ja oder Nein; die tatsächlichen Umstände sind entscheidend. Wenn der Arbeitsplatz dir ernsthaft schadet, kann die Karte dafür sprechen, selbst die Initiative zum Gehen zu ergreifen. Wenn du vor allem von einer vorübergehenden Phase gelangweilt oder frustriert bist, beginn mit Veränderungen, die du beeinflussen kannst: Ordne deine Arbeitsweise neu, sprich mit den Beteiligten und verändere zunächst deinen eigenen Umgang damit. Wenn das nichts verbessert, kannst du danach überlegen, ob ein Ende der richtige nächste Schritt ist.']
],
'major-2': [
  ['love', 'Wie könnte mein nächster Partner sein?',
   'Dein nächster Partner könnte sehr intuitiv und aufmerksam sein. Unabhängig vom Geschlecht trägt diese Person wahrscheinlich eine eher stille, aufnehmende Energie in sich, selbst wenn sie nach außen stark wirkt. Statt sofort zu handeln, tritt sie häufig erst zurück, beobachtet und verlässt sich dann auf ihr inneres Gefühl für Menschen und Situationen.'],
  ['love', 'Welche Gefühle hat diese Person für mich?',
   'Die Hohepriesterin zeigt nicht, wie stark die Gefühle sind. Sie beschreibt eher jemanden, der stillhält, aus der Distanz beobachtet und etwas für sich behält. Es kann Zuneigung da sein, ohne dass bisher gehandelt wird. Warum die Person schweigt, muss durch weitere Karten geklärt werden: Angst vor Zurückweisung, ein sehr privater Charakter, ungünstiges Timing oder eine andere Beziehung wären mögliche Erklärungen. Entscheidend ist: Bis jetzt gibt es wenig oder keine konkrete Handlung.'],
  ['love', 'Wir streiten gerade. Soll ich mich trennen?',
   'Diese Karte rät dazu, die Entscheidung nicht zu überstürzen. Gib dir Zeit, beruhige dich und hör auf dein Gefühl, sobald die erste Hitze vorbei ist. Wenn dein inneres Empfinden auch nach etwas Abstand klar sagt, dass die Beziehung enden sollte, kannst du aus einer ruhigeren Position entscheiden. Entscheidungen mitten im Streit sind eher impulsiv und werden später leichter bereut.'],
  ['love', 'Wir streiten. Was rät diese Karte für unsere Beziehung?',
   'Die Hohepriesterin empfiehlt etwas Abstand. Gebt euch beide Raum zum Nachdenken. Manche Paare geraten umso stärker aneinander, je länger sie im aufgeheizten Zustand weiterreden; ein wenig Distanz kann die Lage beruhigen. Zerlegt nicht jeden Satz nur, um festzustellen, wer recht hatte. Die hilfreichste Antwort liegt darin, was ihr beide wirklich fühlt und braucht — nicht in den Meinungen anderer.'],
  ['career', 'Ich bin seit sechs Monaten arbeitslos. Finde ich bald eine Stelle?',
   'Diese Karte deutet eher auf Verzögerung als auf eine sofortige Stelle. Die Hohepriesterin steht für Dinge, die noch verborgen oder nicht vollständig geformt sind. Vielleicht ist deine aktuelle Suche nicht klar genug ausgerichtet, oder du weißt noch nicht genau, welche Arbeit zu dir passt, sodass Bewerbungen in viele Richtungen gehen. Halt kurz inne und frag dich, welche Art von Arbeit du wirklich möchtest. Wenn die innere Richtung klarer wird, kann auch die äußere Suche gezielter werden.'],
  ['career', 'Ich arbeite ganz normal. Was könnte sich bald im Job verändern?',
   'Bei jemandem, der stabil arbeitet, wäre es unpassend, diese Karte plötzlich als Rat zur Kündigung zu lesen. Eine sinnvollere Ebene der Hohepriesterin ist hier Information, die noch nicht offengelegt wurde. Hinter den Kulissen kann sich etwas entwickeln, ohne dass es negativ sein muss. Eine Führungskraft könnte zum Beispiel über eine neue Rolle für dich nachdenken, ohne es schon ausgesprochen zu haben. Was verborgen ist, wer beteiligt ist und ob es dir hilft, zeigen erst die umliegenden Karten.'],
  ['other', 'Wie lese ich diese Karte, wenn sie allein fällt?',
   'Die Hohepriesterin gehört zu den schwierigeren Karten, wenn sie allein liegt, weil ihre Bedeutung oft verborgen oder noch nicht fertig ist. Als allgemeine Praxis solltest du mindestens eine weitere Karte ziehen, bevor du eine ausführliche Deutung daraus machst.']
],
'major-3': [
  ['love', 'Was für eine Person beschreibt diese Karte?',
   'Die Herrscherin beschreibt jemanden mit fürsorglicher, mütterlicher Energie. Diese Person kümmert sich oft ganz selbstverständlich um andere und ist praktisch darin, eine angenehme Umgebung zu schaffen — vom Essen bis zum Zuhause. Auftreten oder Stil können gepflegt, weich oder feminin wirken, unabhängig vom Geschlecht. Das unterscheidet sie von der Hohepriesterin: Bei der Hohepriesterin zeigt sich Weiblichkeit stärker nach innen, über Intuition und Unterbewusstsein; bei der Herrscherin wird sie nach außen sichtbar, durch Fürsorge, Schönheit, Sinnlichkeit und greifbares Leben.'],
  ['love', 'Welche Gefühle hat diese Person für mich?',
   'Die Herrscherin ist meist eine warme, positive Karte und spricht daher oft für echte Zuneigung. Die Gefühle haben eine beschützende, fürsorgliche Seite: Diese Person möchte sich kümmern und dir Dinge erleichtern. Ob diese Fürsorge gesund ist oder schon zu viel wird, hängt von den umliegenden Karten und der wirklichen Beziehung ab.'],
  ['love', 'Wir streiten viel. Soll ich mich trennen?',
   'In vielen Fällen zeigt diese Karte nicht direkt auf eine Trennung. Vielleicht kümmert ihr euch so stark umeinander, dass selbst Kleinigkeiten zu Streit werden. Die Beziehung braucht womöglich weniger Fürsorge im Stil von Eltern und Kind und mehr Raum dafür, dass ihr euch als gleichwertige Partner begegnet.'],
  ['love', 'Wir streiten viel. Was ist der Rat für unsere Beziehung?',
   'Locker etwas und gebt euch mehr persönlichen Raum. Die Herrscherin kann zeigen, dass eine Person so viel gibt oder umsorgt, dass die andere sich eingeengt fühlt. Mehr Luft für beide kann die Beziehung leichter machen.'],
  ['money', 'Wie sehen meine Finanzen diesen Monat aus?',
   'Finanziell wirkt dieser Monat eher reichhaltig. Die Herrscherin wird traditionell mit Wachstum und Fülle verbunden, daher geht es hier eher um genügend Mittel und vielleicht etwas mehr als um Knappheit.'],
  ['career', 'Finde ich in nächster Zeit eine Stelle?',
   'Die Tendenz geht zu Ja. Der nächste Job kann sich angenehm anfühlen oder dich in ein Umfeld mit fürsorglichen oder stark weiblich geprägten Themen führen. Das kann Dienstleistung, Beauty, Gesundheitswesen, Pflege, ein kleines Unternehmen oder eine andere Tätigkeit mit Menschen sein. Möglich ist auch einfach ein angenehmer Arbeitsplatz mit guter materieller Unterstützung oder vielen Frauen im Team und in Führungsrollen.'],
  ['career', 'Ich habe einen normalen Bürojob. Was könnte sich bald verändern?',
   'Die Arbeit könnte ertragreicher werden. Du könntest mehr Projekte, mehr Verantwortung oder dadurch auch mehr Einkommen bekommen.'],
  ['other', 'Was sagt diese Karte über Kinder oder Schwangerschaft?',
   'Die Herrscherin gehört im Tarot zu den stärksten traditionellen Symbolen für Fruchtbarkeit, Schwangerschaft, Mutterschaft und schöpferisches Entstehen. Bei einer konkreten Schwangerschaftsfrage bleibt Tarot jedoch symbolisch und kann keine medizinische Tatsache bestätigen; dafür sind ein geeigneter Test oder medizinischer Rat zuständig. Eine Eheschließung wird meist über andere Karten gelesen und nicht über die Herrscherin allein.']
]
});

Object.assign(ASK.de, {
'major-4': [
  ['love', 'Welche Gefühle hat diese Person für mich?',
   'Wenn ihr euch erst seit ungefähr einem Monat kennt und du wissen möchtest, ob die Person es ernst meint, spricht Der Herrscher für echte langfristige Absichten. Die Art zu lieben kann allerdings kontrollierend sein. Diese Person möchte Dinge gern nach den eigenen Vorstellungen gestalten und kann sehr dominant wirken, ohne deshalb ein schlechter Mensch zu sein. In einer Beziehung mit ihr wird Kompromiss wichtig. Wenn auch du gern das Kommando hast, sind Reibungen wahrscheinlicher. Kurz gesagt: Die Person kann es ernst mit dir meinen, zugleich aber starr und bestimmend sein.'],
  ['love', 'Wir haben einen heftigen Streit. Was rät diese Karte für unsere Beziehung?',
   'Der Herrscher fordert dazu auf, Kontrolle etwas loszulassen. Versuch nicht, die andere Person oder die ganze Beziehung zu steuern. Vielleicht möchtest du, dass sie sich genau so verhält, wie du es für richtig hältst. Eine dauerhafte Beziehung braucht jedoch Kompromisse, gegenseitigen Respekt und die Bereitschaft, einander als erwachsene Menschen anzunehmen. Dein Partner ist kein Kind, das du erziehen musst.'],
  ['career', 'Worauf sollte ich in den nächsten drei Monaten bei der Arbeit achten?',
   'Achte auf Menschen mit Autorität. Die Karte eröffnet zwei Hauptmöglichkeiten. Erstens kann eine Führungskraft oder ranghöhere Person wichtig werden; Der Herrscher allein sagt nicht, ob sie dir wohlgesinnt ist, sondern nur, dass ihre Macht eine Rolle spielt. Zweitens kannst du selbst mehr Entscheidungsbefugnis bekommen. Das muss kein offizieller Führungstitel sein; vielleicht leitest du ein kleines Team oder verteilst Aufgaben.'],
  ['career', 'Ich bin seit sechs Monaten arbeitslos. Finde ich bald eine Stelle?',
   'Die Karte ist weder klar positiv noch klar negativ, deshalb bleibt die Antwort offen. Du kannst eine Stelle finden, aber am neuen Arbeitsplatz könnte jemand mit Herrscher-Energie wichtig sein: streng, anspruchsvoll und wenig flexibel, dafür möglicherweise fair. Gute Arbeit wird anerkannt, doch Regeln und Standards sollen eingehalten werden.'],
  ['career', 'Welche Arbeit passt zu jemandem mit der Energie dieser Karte?',
   'Eine mögliche Deutung ist, dass diese Person langfristig gut darin sein kann, etwas Eigenes aufzubauen, statt immer nur unter anderen zu arbeiten. Sie möchte Verantwortung, Entscheidungsraum und Einfluss. Das bedeutet nicht, dass ein junger Mensch sofort Führungskraft sein sollte; mit der Zeit können Selbstständigkeit, Leitung oder Rollen mit echter Eigenverantwortung jedoch besser passen als eine Stelle ohne Spielraum.'],
  ['other', 'Auf welche anderen Probleme kann diese Karte hinweisen?',
   'Der Herrscher ist mit Autorität, Hierarchie und formalen Systemen verbunden. Je nach Frage kann er einen Vater, eine Autorität in der Familie, einen Ehepartner, eine Führungskraft, eine Institution oder eine Behörde anzeigen. Auch Bußgelder oder Verwaltungsprobleme können zu diesem Thema gehören. Unterscheide ihn von Der Gerechtigkeit: Diese Karte betont stärker Dokumente, Verfahren, Fairness und rechtliche Fragen, auch zwischen Privatpersonen.']
],
'major-5': [
  ['love', 'Welche Gefühle hat diese Person für mich?',
   'Wenn ihr erst seit kurzer Zeit zusammen seid und du dich fragst, ob die Person es ernst meint, spricht Der Hierophant für Ernsthaftigkeit und kann sogar an formelle Bindung oder Ehe denken lassen. Trotzdem lohnt es sich, auf Kelche oder andere Gefühlskarten in der Umgebung zu achten. Der Hierophant kann den Wunsch zeigen, eine Beziehung offiziell zu machen; allein erklärt er aber nicht, ob Liebe, familiäre Erwartungen, gesellschaftliche Werte oder praktische Gründe dahinterstehen.'],
  ['love', 'Wir streiten. Soll ich mich trennen?',
   'Vielleicht hältst du so stark an deinen eigenen Regeln oder Überzeugungen fest, dass du das Ganze nicht mehr siehst. Man denkt leicht: „Ich habe recht und du liegst falsch“, nur weil man es so gelernt hat. Hierophant-Energie ist gut darin, Strukturen und Prinzipien zu respektieren; ihre Schattenseite ist, sich schwer einen anderen Weg vorstellen zu können. Bevor du gehst, frag dich, ob es wirklich um Schaden oder Unvereinbarkeit geht — oder darum, dass zwei Menschen ihre eigenen Regeln für die einzig richtigen halten.'],
  ['love', 'Was rät diese Karte einer Beziehung, in der viel gestritten wird?',
   'Der Hierophant kann einen Teil deiner Aufmerksamkeit auf Lernen und persönliche Entwicklung lenken. Such dir einen Kurs, ein Thema oder eine Fähigkeit, die nur dir gehört, statt die Beziehung deinen ganzen Kopf einnehmen zu lassen. Etwas Sinnvolles für dich selbst kann Grübeln reduzieren und der Beziehung mehr Luft geben.'],
  ['career', 'Was könnte sich beruflich bald verändern?',
   'Du könntest einen Mentor treffen, zu einem Seminar oder einer Fortbildung geschickt werden oder selbst eine zusätzliche Qualifikation beginnen, etwa ein Zertifikat oder einen Sprachkurs. Allgemein steht Der Hierophant für Lernen, Institutionen und strukturierte Zusammenarbeit. Vielleicht kommst du als Mitglied in ein neues Projektteam; die Karte allein sagt nicht, dass du es leitest.'],
  ['other', 'Wie unterscheidet sich diese Karte von Der Herrscher?',
   'Beide Karten handeln von Regeln, Systemen und Autorität. Der Unterschied liegt darin, woher die Regeln kommen. Der Herrscher schafft Struktur und erwartet, dass andere ihr folgen. Der Hierophant bewegt sich innerhalb einer bestehenden Tradition oder Institution und orientiert sich an dem, was das System, Lehrende oder Vorgänger festgelegt haben.'],
  ['other', 'Wofür steht diese Karte außerdem?',
   'Der Hierophant ist mit Religion, Schule, Bildung, Wissen, Institutionen, Tradition und Kultur verbunden. Auch Ehe kann dazugehören, weil sie eine gesellschaftliche und kulturelle Institution ist. Eine weitere Ebene sind die Annahmen, die wir unbewusst aus unserer Herkunftskultur übernehmen und oft erst bemerken, wenn wir Menschen treffen, die anders geprägt wurden. Bei Teamfragen kann die Karte außerdem Lernen und Arbeiten innerhalb einer Gruppe betonen.']
],
'major-6': [
  ['love', 'Mag mich jemand?',
   'Es können sich zwei Menschen gleichzeitig für dich interessieren, und vielleicht fühlst du dich ebenfalls zu beiden hingezogen. Das macht die Wahl schwierig. Das unterscheidet sich von Sieben der Kelche: Dort gibt es oft viele Möglichkeiten, von denen keine richtig passt; bei Die Liebenden liegt die Spannung häufiger darin, dass zwei Optionen dir beide etwas bedeuten.'],
  ['love', 'Mag mich diese Person?',
   'Die Tendenz geht zu Ja. Die Liebenden können jedoch auch eine Wahl darstellen, daher könnte die Person mehr als eine romantische Möglichkeit abwägen. Zieh weitere Karten, bevor du annimmst, worum diese Wahl genau geht. Wenn die umliegenden Karten unterstützend sind, kann die Karte auch einfach echte Anziehung und Verbindung zwischen euch zeigen.'],
  ['love', 'Ein Paar streitet viel. Sollte es sich trennen?',
   'Aus dieser Karte allein solltest du keine vorschnelle Trennung ableiten. Es gibt zwei häufige Richtungen. Positiv gesehen sind noch starke Gefühle vorhanden, und genau diese Bindung kann ein Grund sein, miteinander zu reden und die Beziehung zu reparieren. In einem anderen Kontext kann eine Person zwischen der Beziehung und jemandem oder etwas anderem schwanken. Welche Deutung passt, zeigen die umliegenden Karten und die reale Situation.'],
  ['career', 'Ich bin arbeitslos. Finde ich bald Arbeit?',
   'Die Tendenz geht zu Ja. Es können sogar zwei Möglichkeiten fast gleichzeitig auftauchen, zwischen denen du wählen musst.'],
  ['career', 'Ich arbeite ganz normal. Verändert sich in den nächsten drei Monaten etwas?',
   'Während du noch angestellt bist, kann ein anderes Stellenangebot oder eine berufliche Möglichkeit auftauchen. Dann musst du vielleicht abwägen, ob du bleibst oder wechselst.'],
  ['love', 'Ich bin Single. Lerne ich bald jemanden kennen?',
   'Du könntest in derselben Zeit mehr als eine interessante Person kennenlernen. Der Kern der Karte ist nicht nur „zwei Menschen“, sondern die Notwendigkeit, eine Wahl zu treffen, die wirklich zu deinen Werten passt.']
],
'major-7': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?',
   'Diese Person hat einen starken Willen und stellt Ziele oft an erste Stelle. Sie arbeitet viel, gibt selten schnell auf und wirkt entschlossen und leistungsorientiert. Die Schattenseite dieser Stärke ist, sich so stark auf Erfolg zu konzentrieren, dass Familie, Freundschaften oder Partnerschaft in den Hintergrund geraten.'],
  ['love', 'Welche Gefühle hat diese Person für mich?',
   'Die Tendenz geht zu Anziehung, aber die Annäherung kann schnell und intensiv sein. Diese Person verfolgt Romantik manchmal wie ein Ziel, das unbedingt erreicht werden soll. Bei manchen Menschen ist der Reiz der Eroberung stärker als das, was danach kommt. Beobachte deshalb, ob das Interesse stabil bleibt, wenn der erste Jagdtrieb vorbei ist.'],
  ['love', 'Ein Paar streitet viel. Sollte es sich trennen?',
   'Diese Karte kann eher deinen aktuellen Zustand als das endgültige Ergebnis beschreiben. Vielleicht bist du von den Streits erschöpft und möchtest alles schnell beenden, nur um Ruhe zu haben. Das kann eine überhastete Entscheidung sein. Ob eine Trennung sinnvoll ist, hängt von der wirklichen Qualität der Beziehung ab: Schaden, anhaltende Toxizität oder klar verlorene Gefühle wiegen mehr als eine einzelne Karte. Wenn es nicht so weit ist, beruhigt euch zuerst und redet, wenn ihr beide wieder klar denken könnt. Es kann noch Raum für Reparatur geben.'],
  ['love', 'Die andere Person verändert sich nicht so, wie ich es möchte. Was soll ich tun?',
   'Wenn eine Beziehung schwierig wird, versuchen viele zuerst, den anderen Menschen zu „reparieren“. Vielleicht hast du versucht, mehr Nachrichten oder mehr Aufmerksamkeit zu bekommen, und warst frustriert, weil sich nichts änderte. Der Wagen schlägt vor, zunächst deine eigene Sicht zu verändern, statt die äußere Situation kontrollieren zu wollen. Weniger Nachrichten müssen zum Beispiel nicht weniger Liebe bedeuten; vielleicht konzentriert sich die Person stark auf Arbeit oder eine gemeinsame Zukunft. Sag klar, was du brauchst, und lass zugleich Raum für ihre Gründe.'],
  ['career', 'Ich bin arbeitslos. Finde ich bald einen Job?',
   'Das ist ein bedingtes Ja. Du kannst Arbeit finden, aber die Karte fordert mehr Entschlossenheit und Eigeninitiative. Nach Monaten ohne Ergebnis kann deine Energie abgesunken sein. Vielleicht bewirbst du dich nur noch halbherzig, fühlst wenig Druck oder hast viele Pläne, setzt aber aus Angst vor dem Scheitern keinen davon um. Der Wagen sagt: Fortschritt beginnt, wenn du eine Richtung wählst und dich bewegst.'],
  ['career', 'Ich arbeite ganz normal. Was ist in den nächsten drei Monaten neu?',
   'Die nächsten drei Monate können arbeitsreich werden. Vielleicht beginnt eine Hochphase, oder du bekommst ein zusätzliches Projekt, das viel Zeit und Konzentration verlangt. Ein großer Teil deiner Energie kann in die Arbeit fließen. Die Erinnerung dieser Karte: Schütze deinen Grundrhythmus. Iss vernünftig, schlaf genug und lass Platz für Familie, Freundschaften oder Partnerschaft, damit Fortschritt nicht in Erschöpfung kippt.'],
  ['other', 'Wie unterscheidet sich diese Karte von Die Sonne?',
   'Der Wagen und Die Sonne können beide Erfolg zeigen, stehen aber an unterschiedlichen Stellen der Reise durch die Großen Arkana. Der Wagen ist ein früherer Sieg, getragen von Willenskraft und Tempo; man kann ein Ziel erreichen und unterwegs anderes vernachlässigen. Die Sonne zeigt eine umfassendere Form von Erfolg, bei der Leistung mit Offenheit, Unterstützung und Freude zusammenkommt. Die Lehre: Sehr schnelles Vorankommen kann einsam machen, während ein langer Weg meist Menschen und andere Lebensbereiche mitnehmen muss.']
],
'major-8': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?',
   'Die Stärke dieser Person liegt weniger im Auftreten als in Selbstbeherrschung. Sie kennt die eigenen Fähigkeiten und Grenzen und kann Ärger und starke Impulse steuern, statt von ihnen beherrscht zu werden. Weil ihr Selbstvertrauen stabil ist, kann sie Fehler eingestehen, ohne sofort defensiv zu reagieren. Das unterscheidet sie von Menschen, die Stärke spielen, um Unsicherheit zu verdecken. Die Kraft ist leiser: ruhig, selbstbewusst und schwer aus dem Gleichgewicht zu bringen.'],
  ['love', 'Mag mich diese Person?',
   'Die Tendenz geht zu Ja, aber erwarte keine laute Verfolgungsjagd. Diese Person ist sicher genug, Interesse ruhig und direkt zu zeigen. Sie kann sagen, dass sie dich mag, ohne sofort eine Antwort zu verlangen. Wenn du nicht dasselbe empfindest, zieht sie sich eher respektvoll zurück, als weiter Druck zu machen. Ihre Art zu lieben ist erwachsen und rücksichtsvoll.'],
  ['love', 'Wir streiten. Soll ich mich trennen?',
   'Das Schlüsselwort ist Sanftheit. Konflikte werden hier nicht durch Lautstärke oder Dominanz gelöst, sondern durch Geduld, Fürsorge und Selbstbeherrschung. Die Karte allein weist nicht auf eine Trennung. Ob Gehen sinnvoll ist, sollte an der realen Beziehung entschieden werden — besonders daran, ob Schaden, anhaltende Toxizität oder keinerlei Bereitschaft zur Reparatur vorhanden sind. Wenn das nicht der Fall ist, versucht zuzuhören und das Problem ruhiger zu lösen.'],
  ['career', 'Ich bin arbeitslos. Finde ich bald einen neuen Job?',
   'Das größte Hindernis kann gerade Selbstvertrauen statt Fähigkeit sein. Nach einer langen Suche und vielen Absagen beginnt man leicht zu glauben, nicht gut genug zu sein, und dieser Gedanke zeigt sich dann im Vorstellungsgespräch. Jemand, der früher flüssig geantwortet hat, zögert plötzlich aus Angst, etwas Falsches zu sagen. Die Kraft erinnert dich daran, dass deine Fähigkeiten nicht verschwunden sind. Die Verzögerung kann am Timing oder daran liegen, dass die Stellen nicht gut zu deinen echten Stärken passen. Mehr Selbstvertrauen kann verändern, wie du der nächsten Chance begegnest.'],
  ['career', 'Worauf sollte ich bei der Arbeit in nächster Zeit achten?',
   'Die Arbeit wirkt stabil. Du scheinst deine Rolle, deine Stärken und Grenzen zu kennen und erledigst deine Aufgaben kompetent. Diese ruhige Phase kann weitergehen, ohne große Krise, aber auch ohne dramatischen Sprung. Wenn du auf einen plötzlichen Durchbruch hoffst, verspricht die Karte ihn nicht; ihre Stärke liegt in Beständigkeit.'],
  ['career', 'Ich bekomme bald ein neues Projekt. Soll ich es annehmen?',
   'Die Karte unterstützt ein Ja. Du scheinst die Belastbarkeit, Fähigkeiten und fachliche Kompetenz dafür zu haben.'],
  ['other', 'Wie lese ich diese Karte in einer Ratgeber-Position?',
   'In diesem Kurs wird Die Kraft als konstruktive aufrechte Energie gelesen und nicht über Umkehrungen. Als Ratgeber weist sie oft auf eine Qualität hin, die du stärker einsetzen solltest: Ruhe, Geduld, Selbstvertrauen oder emotionale Selbststeuerung. Starke spontane Gefühle können klares Denken überlagern. Der Rat ist, bei dir zu bleiben, statt aus Ärger oder Angst zu reagieren.']
],
'major-9': [
  ['love', 'Wie könnte mein nächster Partner sein?',
   'Dein nächster Partner kann erfahren, nachdenklich und sehr reflektiert sein. Vielleicht ist diese Person älter als du oder einfach reifer als Gleichaltrige. Eine besonders theatralische Romantik solltest du jedoch nicht erwarten. Überraschungspartys, aufwendig inszenierte Geschenke oder ein spektakulärer Antrag sind vermutlich nicht ihr Stil. Sie kann außerdem recht genau sein und viel Zeit allein brauchen.'],
  ['love', 'Welche Gefühle hat diese Person für mich?',
   'Echte Gefühle können vorhanden sein, doch die Person befindet sich in einer nach innen gerichteten Phase. Sie sucht Antworten auf eigene Fragen, deshalb bleiben weniger Zeit und Aufmerksamkeit für die Beziehung. Du möchtest vielleicht am Wochenende etwas unternehmen, während sie lieber zu Hause liest oder etwas Persönliches erledigt. Das kann sich für dich wie Vernachlässigung anfühlen. Der Eremit ist keine negative Karte, aber seine Energie ist für eine Beziehung, die gerade mehr Nähe braucht, nicht besonders leicht.'],
  ['love', 'Wir streiten. Soll ich mich trennen?',
   'Diese Karte rät dazu, eine Trennung nicht zu überstürzen. Wenn jedes Treffen wieder in Streit endet, gebt euch etwas Zeit und Raum, um zur Ruhe zu kommen. Nutzt diese Stille, um nach innen zu schauen: Wo begann der Konflikt, welchen Anteil hast du selbst daran und was kannst du realistisch verändern?'],
  ['love', 'Liegt das Problem bei der anderen Person oder bei mir?',
   'Im Streit schauen die meisten zuerst darauf, was der andere falsch macht. Der Eremit dreht die Frage zunächst nach innen. In jeder Beziehung — Familie, Freundschaft oder Liebe — kannst du dich fragen, ob es im eigenen Verhalten etwas zu verändern gibt. An sich zu arbeiten bedeutet nicht, sich kleinzumachen oder die eigene Persönlichkeit zu verlieren. Es kann einfach heißen, Feedback anzuhören, sich bei Bedarf zu entschuldigen und das zu verändern, was du selbst für sinnvoll hältst.'],
  ['career', 'Ich bin seit Monaten arbeitslos. Finde ich einen Job, der zu mir passt?',
   'Die Karte ermutigt dich, weiterzusuchen und zugleich eine tiefere Frage zu stellen: Was willst du eigentlich? Vielleicht konzentrierst du dich nur auf Stellen, die ein bestimmtes Gehalt oder deine bisherige Ausbildung erfüllen, und übersiehst Arbeit, die dir Sinn gibt. Jemand mit technischem Hintergrund kann zum Beispiel entdecken, dass die größte Zufriedenheit darin liegt, anderen zu helfen. Hör dir selbst eine Weile zu. Du kannst einen stabilen Beruf behalten und dieses Bedürfnis durch Ehrenamt leben, oder später direkter in soziale, pädagogische oder gemeinnützige Arbeit wechseln.'],
  ['career', 'Worauf sollte ich bei der Arbeit bald achten?',
   'Du könntest einem Mentor, Lehrer oder erfahrenen Menschen begegnen, der dein Fachwissen vertieft.'],
  ['timing', 'Wann finde ich endlich die Antwort?',
   'Das ist keine schnelle Karte. Die Suche kann Zeit brauchen und verlangt Geduld. Statt eine feste Zahl von Monaten daraus abzuleiten, lies den Eremiten als langsameren Prozess, in dem Klarheit durch anhaltende Reflexion und Erfahrung entsteht.']
]
});

Object.assign(ASK.de, {
'major-10': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?',
   'Das Rad des Schicksals ist allein keine besonders starke Persönlichkeitskarte. Zieh weitere Karten, wenn du einen Menschen genauer beschreiben möchtest. Liest du nur diese Karte, kann sie zeigen, dass sich eure Begegnung bedeutsam statt zufällig anfühlt: Vielleicht gibt es etwas Wichtiges, das ihr durch diese Verbindung lernt. „Wichtig“ muss dabei nicht schmerzhaft bedeuten. Wachstum und gute Veränderungen können auch auf sanfte Weise entstehen.'],
  ['love', 'Welche Gefühle hat diese Person für mich?',
   'Auch bei Gefühlen antwortet Das Rad des Schicksals eher indirekt. Es kann zeigen, dass die Person eure Begegnung und die Tatsache, dass ihr noch im Leben des anderen seid, als bedeutsam oder „schicksalhaft“ empfindet. Was sie konkret über dich denkt und wie tief ihre Gefühle sind, zeigt die Karte allein nicht. Dafür solltest du weitere Karten ziehen.'],
  ['love', 'Wir streiten. Soll ich mich trennen?',
   'Entscheide das nicht aus dieser Karte allein. Das Rad des Schicksals ist neutral und hängt stark von den umliegenden Karten ab. Unterstützende Karten wie Zehn der Kelche oder Vier der Stäbe können zeigen, dass die Beziehung noch viel Potenzial hat und ein Gespräch sinnvoll ist, bevor du sie beendest. Schwierige Karten wie Der Teufel oder Der Turm können auf ein Muster hinweisen, das immer schwerer zu tragen ist. Auch dann sollte Tarot keine Trennung vorschreiben; tatsächlicher Schaden, Vertrauen, Sicherheit und die Bereitschaft zur Veränderung sind wichtiger als eine Karte. Eine Person kann eine ganze Beziehung nicht allein kontrollieren oder reparieren.'],
  ['career', 'Finde ich bald einen neuen Job?',
   'Die Tendenz geht zu Ja, und die neue Stelle kann sich eher wie ein Wendepunkt als wie ein gewöhnlicher Wechsel anfühlen. Sie könnte einen Umzug, Arbeit im Ausland, ein neues Umfeld oder Erfahrungen mit sich bringen, die deinen Blick auf Beruf und Leben erweitern.'],
  ['career', 'Ich habe einen normalen Bürojob. Worauf sollte ich in den nächsten drei Monaten achten?',
   'Bei der Arbeit kann eine größere Veränderung oder ein Wendepunkt auftauchen. Das Rad selbst ist neutral: Es zeigt Bewegung, aber nicht automatisch, ob das Ergebnis gut oder schlecht ist. Möglich sind Versetzung, Beförderung, Gehaltserhöhung, Dienstreise, Standortwechsel oder ein neuer Vorgesetzter. Die umliegenden Karten zeigen den Ton und den Teil, den du beeinflussen kannst.'],
  ['other', 'Was bedeutet es, wenn in einer Legung viele Große Arkana liegen?',
   'Das Verhältnis von Großen und Kleinen Arkana kann die Größenordnung des Themas anzeigen. Wenn die Großen Arkana deutlich überwiegen, fühlt sich die Legung oft mit größeren Lebensphasen, Übergängen oder Lektionen verbunden an, die sich nicht über Nacht verändern. Wenn die Kleinen Arkana dominieren, spielen alltägliche Entscheidungen, Gewohnheiten, Stimmungen und praktische Handlungen meist eine größere Rolle. Das ist eine Deutungskonvention und kein festes Gesetz des Schicksals.'],
  ['other', 'Kann man das Schicksal verändern?',
   'Eine hilfreiche Tarot-Sicht ist, Schicksal eher als Spielraum denn als einzig festgelegtes Ergebnis zu verstehen. Manche Umstände liegen außerhalb unserer Kontrolle, während Entscheidungen, Einsatz und Reaktionen weiterhin beeinflussen, wo wir innerhalb dieses Spielraums landen. Nicht jeder Mensch, der sich anstrengt, wird ein Genie oder erreicht jedes gewünschte Ziel. Einsatz kann uns aber helfen, die Fähigkeiten und Chancen, die tatsächlich vorhanden sind, besser zu nutzen.']
],
'major-11': [
  ['love', 'Welche Gefühle hat diese Person für mich?',
   'In einer Gefühlslegung ist Die Gerechtigkeit eher abwägend und vernünftig als romantisch. Die Person kann die Beziehung sehr genau prüfen: Was ist fair, was gibt jeder, und welche praktischen Folgen hätte ein gemeinsamer Weg? Das bedeutet nicht, dass die Gefühle falsch sind; nur ist Emotion hier nicht das ganze Bild. Bei einer neuen Beziehung kann diese Karte allein nicht sagen, wie tief oder dauerhaft die Liebe werden wird.'],
  ['love', 'Wir streiten. Soll ich mich trennen?',
   'Die Gerechtigkeit spricht eher dafür, vor einer Trennungsentscheidung langsamer zu werden. Sie fordert Balance und einen klaren Blick auf die Fakten. Starke Gefühle sind in Beziehungen normal, können aber mitten im Konflikt die Einschätzung erschweren. Achte auf wiederkehrende Muster, darauf, was für beide fair ist, und darauf, wo du selbst etwas verändern kannst, bevor du eine große Entscheidung triffst.'],
  ['career', 'Ich bin seit Monaten arbeitslos. Finde ich einen Job, der mir gefällt?',
   'Die Gerechtigkeit allein reicht nicht für ein festes Ja oder Nein; zieh weitere Karten. Sie eröffnet aber einige praktische Richtungen. Die nächste Stelle könnte mit Verwaltung, Dokumenten, Verfahren, Genauigkeit, Zahlen oder Recht zu tun haben — etwa Bankwesen, Buchhaltung, Datenarbeit oder juristische Unterstützung. Auch eine sehr prinzipientreue und anspruchsvolle Führungskraft ist möglich. Eine weitere Möglichkeit: Deine Bewerbungsunterlagen bremsen dich. Prüf Lebenslauf und Dokumente, ergänze Fehlendes, streich Unnötiges und lass jemanden mit Erfahrung darübersehen.'],
  ['career', 'Worauf sollte ich bei der Arbeit in nächster Zeit achten?',
   'Achte besonders auf Unterlagen und Verwaltungsabläufe. Eine für dich günstige Entscheidung kann bereits gefallen sein und trotzdem an einem fehlenden Zertifikat, Formular oder einer Genehmigung hängen. Bei einer Gehaltserhöhung oder Beförderung kann die Personalabteilung zum Beispiel erst weiterarbeiten, wenn alles vollständig ist. Prüfe wichtige Unterlagen lieber früh, bevor sie zum Engpass werden.'],
  ['other', 'Wenn etwas schiefläuft, worauf sollte ich zuerst schauen?',
   'Schau zuerst ehrlich auf deinen eigenen Anteil: Was hast du gut gemacht, was hättest du anders tun können, und hast du deine Verantwortung erfüllt? Danach betrachtest du die anderen Menschen und Umstände. Selbstreflexion ist hilfreich, weil sie dir etwas gibt, das du tatsächlich verändern kannst. Sie soll aber nicht zu Selbstbeschuldigung werden und bedeutet nicht, dass andere nie verantwortlich sind. Ziel ist eine faire Einschätzung statt reflexhaft alle Schuld einer Seite zu geben.'],
  ['other', 'Was mache ich, wenn die Karten scheinbar eine andere Frage beantworten?',
   'Das passiert relativ häufig. Du fragst vielleicht nach Berufsaussichten, während die Karten scheinbar eine Führungskraft oder ein anderes Thema beschreiben. Prüf zuerst, ob die Frage klar gestellt war und ob die Karten vielleicht einen verborgenen Teil der Situation berühren. Wenn die Botschaft weiterhin nicht passt, sag das offen, statt zwanghaft eine Verbindung herzustellen. Intuition ist im Tarot wichtig, funktioniert aber am besten zusammen mit einer klaren Frage und ehrlicher Deutung.']
],
'major-12': [
  ['love', 'Was für eine Person beschreibt diese Karte?',
   'Der Gehängte kann einen Menschen beschreiben, der nicht sauber in die üblichen Schubladen passt. Die Besonderheit kann sich in Kleidung, Denken oder Lebensentscheidungen zeigen. Der Punkt ist nicht, dass Anderssein schlecht wäre, sondern dass diese Person bereit ist, das Leben aus einem anderen Winkel zu sehen. Sie kann einen weniger verbreiteten Hintergrund, eine besondere Identität oder einen ungewöhnlichen Weg haben, einschließlich einer Zugehörigkeit zur LGBTQ+-Community. Stell dir jemanden vor, der einen sicheren Bürojob verlässt, um einem Beruf zu folgen, den die Familie nie erwartet hätte: Für andere wirkt das ungewöhnlich, für die Person selbst ist es ehrlicher.'],
  ['love', 'Welche Gefühle hat diese Person für mich?',
   'Der Gehängte gibt keine besonders direkte Gefühlsantwort. Die Person kann sich aus einem ungewöhnlichen oder sehr persönlichen Grund zu dir hingezogen fühlen und nicht wegen der Eigenschaften, die andere zuerst bemerken. Die Karte kann auch dich als jemanden zeigen, dessen Besonderheit Teil der Anziehung ist. Zieh weitere Karten, wenn du wissen möchtest, wie stark die Gefühle sind oder ob die Person handeln wird.'],
  ['love', 'Wir streiten. Welchen Rat gibt diese Karte für unsere Beziehung?',
   'Hör für einen Moment auf, krampfhaft nach einer Lösung zu suchen, und ändere den Blickwinkel. Etwas stille Zeit allein kann helfen, ohne den Druck des Streits nachzudenken. Wenn du festhängst, sprich mit jemandem, der das Leben ganz anders sieht als du, und hör zu, ohne sofort deine eigene Position zu verteidigen. Eine neue Sicht kann zeigen, dass der Konflikt kleiner war, als er sich anfühlte, oder dass er etwas sichtbar macht, das ihr verstehen musstet. Manchmal ist die erste hilfreiche Veränderung nicht die Beziehung selbst, sondern die Art, wie du sie gerade siehst.'],
  ['career', 'Finde ich bald einen neuen Job?',
   'Es gibt zwei sinnvolle Lesarten. Du kannst Arbeit finden, die anders ist als ursprünglich erwartet oder außerhalb deines Studienfachs liegt. Oder die Karte fordert dich auf, die Suche zu erweitern. Wenn du nur große Firmen in einer einzigen Stadt anschaust, könntest du zum Beispiel kleinere Unternehmen, einen anderen Ort oder Rollen prüfen, die deine Fähigkeiten auf andere Weise nutzen.'],
  ['career', 'Worauf sollte ich in den nächsten drei bis sechs Monaten bei der Arbeit achten?',
   'Der Gehängte ist hier nicht besonders konkret, deshalb sind weitere Karten sinnvoll. Zwei Möglichkeiten stechen hervor. Du könntest ein Projekt bekommen, das ganz anders ist als deine übliche Arbeit und dir dein Fachgebiet aus einem neuen Winkel zeigt. Oder du triffst einen Mentor mit unkonventionellem Stil, dessen Rat zunächst seltsam klingt, aber nach längerem Nachdenken sehr nützlich wird.'],
  ['other', 'Was ist die Kernbedeutung dieser Karte?',
   'Der Gehängte markiert einen Perspektivwechsel. In der Reise des Narren kommt ein Punkt, an dem es nicht mehr funktioniert, sich in die erwartete Form zu pressen. Die Karte handelt vom Innehalten, vom Annehmen dessen, was wahr ist, und vom Blick aus einem anderen Winkel. Wenn du feststeckst, muss die Antwort nicht in einer weiteren äußeren Handlung liegen; sie kann damit beginnen, die Situation anders zu verstehen.'],
  ['other', 'Wie sollte ich meine Freunde auswählen?',
   'Es ist gesund, Menschen um dich zu haben, die das Leben anders sehen als du. Damit sind keine Leute gemeint, die gern streiten oder provozieren, sondern Menschen mit anderen Hintergründen, Erfahrungen und Perspektiven. Sie erinnern dich daran, dass eine Situation mehrere Blickwinkel hat. Wer verschiedene Sichtweisen aushält, urteilt oft weniger schnell und kann Unterschiede eher akzeptieren, ohne alle in die eigene Form pressen zu wollen.']
],
'major-13': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?',
   'Der Tod kann einen Menschen beschreiben, dessen Leben von großen Veränderungen und Neuerfindungen geprägt war. Vielleicht gab es deutliche Hochs und Tiefs, und jeder Wendepunkt zwang die Person, umzudenken, sich anzupassen und eine neue Version ihrer selbst zu entwickeln. Statt jahrzehntelang dieselbe Weltsicht zu behalten, wächst sie durch Enden und Neuanfänge — wie ein Baum, der Blätter verliert und später neu austreibt. In der Tarot-Astrologie wird dieses Thema traditionell mit Skorpion und seiner Symbolik der Transformation verbunden.'],
  ['love', 'Welche Gefühle hat diese Person für mich?',
   'Der Tod allein reicht nicht für eine feste emotionale Schlussfolgerung. Zieh weitere Karten. Eine mögliche Deutung, besonders am Anfang einer Legung, ist, dass Gefühle da sind, die Person aber noch etwas Altes sauber abschließen muss. Das kann eine frühere Beziehung oder ein anderes Kapitel sein, das sie nicht in etwas Neues hineintragen möchte. Wenn das zur tatsächlichen Situation passt, kann Geduld sinnvoll sein — ohne dass du dein eigenes Leben auf unbestimmte Zeit anhältst.'],
  ['love', 'Wir streiten. Soll ich mich trennen?',
   'Der Tod bedeutet nicht automatisch „Trennung“. Die Karte kann zeigen, dass die bisherige Art, wie eure Beziehung funktioniert, enden muss, nicht zwingend die Beziehung selbst. Ein ruhiges, ehrliches Gespräch über Dinge, die bisher unausgesprochen blieben, kann ein altes Muster abschließen. Wenn beide bereit sind, etwas zu verändern, kann ein neues Kapitel entstehen. Wenn ein schädliches Muster weder verändert werden kann noch verändert werden will, kann das Ende irgendwann auch wörtlicher werden.'],
  ['career', 'Ich bin seit drei oder vier Monaten arbeitslos. Finde ich bald einen neuen Job?',
   'Die Karte sagt, dass die bisherige Suchstrategie möglicherweise beendet werden muss, weil sie keine Ergebnisse bringt. Zwei Möglichkeiten solltest du prüfen. Vielleicht hat dein Selbstvertrauen gelitten und das zeigt sich in Gesprächen. Oder du bewirbst dich auf Stellen, die nicht gut zu Ausbildung, Stärken oder Arbeitsweise passen. Jemand, der stark im Umgang mit Menschen ist, kann zum Beispiel Schwierigkeiten haben, wenn er sich ausschließlich auf isolierte Dateneingabe bewirbt. Wiederhole nicht einfach einen Weg, der nicht funktioniert, sondern definiere neu, welche Rolle wirklich zu dir passt.'],
  ['career', 'Bekomme ich in den nächsten sechs Monaten Probleme bei der Arbeit?',
   'Nimm diese Karte nicht automatisch als Vorhersage eines Jobverlusts. Der Tod lässt sich sinnvoller als Ende einer Phase oder Rolle lesen. Ein Projekt kann abgeschlossen werden und Platz für ein neues machen, oder du entscheidest selbst, eine Position zu beenden, die nicht mehr passt. Eine einzelne Karte sagt nicht, ob sich dieses Ende erleichternd oder schwer anfühlen wird; dafür brauchst du weitere Karten.'],
  ['other', 'Warum soll ich loslassen, wenn ich noch daran hänge?',
   'Bedauern und Bindung sind normal. Loslassen bedeutet nicht, so zu tun, als hätte etwas nie Bedeutung gehabt. Es bedeutet zu erkennen, wenn ein Mensch, eine Beziehung oder eine Situation in der bisherigen Form nicht mehr gut genug weitergetragen werden kann. Zeit und Energie sind begrenzt; manches muss irgendwann abgelegt werden, damit etwas Neues Platz bekommt. Die Angst, dass nichts Besseres kommt, ist verständlich, aber kein Beweis dafür, dass du festhalten solltest.']
],
'major-14': [
  ['love', 'Welche Gefühle hat diese Person für mich?',
   'Wahrscheinlich ist Zuneigung da, aber sie wird sehr maßvoll gezeigt. Die Person stürmt weder auf dich zu noch verhält sie sich kalt. Die Gefühle entwickeln sich gleichmäßig und in ihrem eigenen Tempo. Wenn du eine sehr dramatische, intensive Liebesgeschichte erwartest, kann Die Mäßigkeit dir zu ruhig vorkommen; ihre emotionale Temperatur bleibt eher ausgeglichen als extrem.'],
  ['love', 'Wir streiten. Soll ich mich trennen?',
   'Die Mäßigkeit rät davon ab, mitten in einem unausgeglichenen Zustand vorschnell eine Trennung zu beschließen. Schau zuerst auf deinen eigenen Rhythmus. Überarbeitung kann Schlaf verschlechtern, Schlafmangel kann Essen und Stimmung verändern, und Erschöpfung lässt jeden Konflikt größer wirken. Gib dir genug Zeit, wieder in einen ruhigeren Alltag zu finden, bevor du entscheidest, was der Streit wirklich bedeutet. Wenn du stabiler bist, siehst du das Problem und mögliche Lösungen oft klarer.'],
  ['career', 'Ich bin seit sechs Monaten arbeitslos. Finde ich den Job, den ich möchte?',
   'Hier kann Die Mäßigkeit mehr über dein Tempo als über den Arbeitsmarkt sagen. Vielleicht suchst du zwar, aber ohne viel Dringlichkeit oder Eigeninitiative. Wenn in sechs Monaten nur wenige Bewerbungen rausgegangen sind, ist ein langsames Ergebnis verständlich. Die Antwort hängt teilweise davon ab, ob du den Rhythmus änderst: mehr Kontakte, regelmäßigere Bewerbungen und mehr konkrete Schritte — ohne wahllos jede Stelle anzunehmen.'],
  ['career', 'Bekomme ich in den nächsten drei bis sechs Monaten Probleme bei der Arbeit?',
   'Die Arbeit wirkt relativ stabil, und die nächsten Monate können ähnlich weiterlaufen. Die Mäßigkeit verspricht weder ein plötzliches Angebot noch einen dramatischen Durchbruch. Ihre weniger aufregende Seite kann sich wie Stillstand anfühlen, aber nicht jede ruhige Phase ist schlecht. Manche Zeiten dienen der Erholung und Festigung. Entscheidend ist die Balance: ständiges Rennen macht müde, endloses Warten wird irgendwann zu Stagnation.']
],
'major-15': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?',
   'Der Teufel kann einen Menschen beschreiben, der stark von Impulsen oder einem Muster getrieben wird, das schwer zu kontrollieren ist. Diese Abhängigkeit muss nichts mit Alkohol oder Drogen zu tun haben; sie kann Rauchen, übermäßiges oder stark eingeschränktes Essen, Schlafgewohnheiten, Gaming, soziale Medien, Shopping oder jedes Verhalten betreffen, das mehr Zeit und Kontrolle übernimmt als geplant. Typisch ist „nur eine Folge“ und plötzlich ist die ganze Nacht vorbei — oder eine Nachricht prüfen und danach Stunden am Handy verlieren, während wichtige Aufgaben liegen bleiben.'],
  ['love', 'Welche Gefühle hat diese Person für mich?',
   'Der Teufel fordert dazu auf, die treibende Kraft hinter der Anziehung zu prüfen, statt sie automatisch für reine Liebe zu halten. Körperliches Verlangen, Geheimhaltung, der Reiz einer Grenzüberschreitung, Eifersucht, Macht oder ein anderes ungestilltes Bedürfnis können mitmischen. Das beweist nicht, dass keine echten Gefühle vorhanden sind, ist aber eine Warnung, eine Verbindung nicht zu romantisieren, wenn sie vor allem von Zwang oder Versuchung zusammengehalten wird. Schau auf die umliegenden Karten und vor allem auf das tatsächliche Verhalten.'],
  ['love', 'Wir streiten. Soll ich mich trennen?',
   'Der Teufel kann auf einen ungesunden Kreislauf hinweisen, aber eine Karte allein kann eine Beziehung nicht als toxisch diagnostizieren. Schau auf das echte Muster. Wenn Zusammensein wiederholt Beleidigungen, Kontrolle, Eifersucht, Angst oder den Verlust des eigenen Selbst mit sich bringt und Distanz gleichzeitig Panik und einen starken Zug zurück in denselben Kreislauf auslöst, verdient das ernsthafte Aufmerksamkeit. Frag dich, ob du in der Beziehung noch du selbst sein kannst und ob beide Menschen bereit und fähig sind, schädliches Verhalten zu verändern. Bei Missbrauch oder wenn du dich unsicher fühlst, such Unterstützung außerhalb der Beziehung.'],
  ['love', 'Was ist, wenn ich das Gefühl habe, die Person nicht verlassen zu können?',
   'Versuch den Satz von „Ich kann nicht gehen“ zu „Gehen fühlt sich gerade extrem schwer an“ zu verändern. So bleibt Platz für den Schmerz und gleichzeitig für deine Handlungsmöglichkeit. Eine Beziehung zu beenden kann schwierig, beängstigend und kompliziert sein — besonders wenn Liebe, Abhängigkeit, Wohnung, Geld oder Familie daran hängen. Du musst das nicht allein schaffen. Wenn du gehen möchtest, können vertraute Menschen oder passende Beratungsstellen den Weg sicherer und überschaubarer machen.'],
  ['career', 'Finde ich bald einen Job, der mir gefällt?',
   'Die Tendenz kann zu Ja gehen, aber mit einer klaren Warnung: Sei vorsichtig bei Angeboten, die fast zu gut klingen. Eine Stelle kann sehr gute Leistungen versprechen und gleichzeitig unklare Praktiken, rechtliche Grauzonen oder Erwartungen verstecken, die deinen Werten widersprechen. Der Job ist nicht automatisch schlecht. Lies jedoch jede Bedingung sorgfältig, stell direkte Fragen und prüf, ob gute Bezahlung dich von Dingen ablenken soll, die du sonst ablehnen würdest.'],
  ['career', 'Worauf sollte ich in den nächsten drei bis sechs Monaten bei der Arbeit achten?',
   'Achte auf Versuchung und unscharfe Grenzen. Eine Form kann eine Beziehung am Arbeitsplatz sein, die Geheimnisse oder Interessenkonflikte erzeugt. Eine andere betrifft Geld, Geschenke, Provisionen, Dokumente oder Abkürzungen, die Integrität oder rechtliche Sicherheit gefährden. Die Karte entscheidet nicht für dich; sie erinnert daran, dass ein reizvoller kurzfristiger Vorteil einen viel größeren Preis haben kann. Halte berufliche Grenzen klar und stimme nichts zu, was du nicht offen erklären möchtest.']
]
});

Object.assign(ASK.de, {
'major-16': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?',
   'Wenn Der Turm bei einer Persönlichkeitsfrage erscheint, beschreibt er oft jemanden, dessen innere Welt gerade erschüttert ist. Die Person kann schnell aufbrausen, impulsiv oder sehr direkt sein — oder sie kommt erst aus einem großen Schock, einem plötzlichen Verlust oder einem anderen Umbruch und fühlt sich noch ungeordnet. Eine Karte allein zeigt nicht, ob sie sich davon bereits wieder aufgebaut hat. Zieh weitere Karten, wenn du ein klareres Bild brauchst.'],
  ['love', 'Welche Gefühle hat diese Person für mich?',
   'Der Turm beantwortet diese Frage nicht direkt. Oft spricht er weniger über eure aktuelle Verbindung als über eine alte Wunde, die die Person noch mit sich trägt. Stell dir vor, ihr lernt euch gerade erst kennen und alles wirkt ruhig, trotzdem erscheint Der Turm. Eine plausible Deutung ist, dass sie früher einen plötzlichen Verrat, eine Trennung oder einen anderen emotionalen Schock erlebt hat und diese Erfahrung Nähe bis heute beeinflusst. Ob genug Heilung für etwas Neues da ist, zeigen die umliegenden Karten und vor allem das tatsächliche Verhalten.'],
  ['love', 'Soll ich eine Beziehung eingehen, obwohl ich noch nicht vollständig geheilt bin?',
   'Du musst nicht vollkommen „geheilt“ sein, bevor du lieben darfst. Unbeachtete Wunden können sich in Beziehungen wiederholen, deshalb sind Selbstreflexion und Verantwortung wichtig. Gleichzeitig werden manche Muster erst sichtbar, wenn echte Nähe sie berührt. Die hilfreichere Frage lautet nicht „Bin ich völlig geheilt?“, sondern „Kann ich meine Wunden erkennen, Verantwortung dafür übernehmen und vermeiden, dass die andere Person sie für mich reparieren muss?“ Eine reife Beziehung kann Entwicklung unterstützen, aber sie ersetzt nicht die eigene Arbeit.'],
  ['love', 'Wir haben einen schweren Konflikt. Soll ich mich trennen?',
   'Der Turm sagt, dass das bisherige Muster nicht einfach unverändert weiterlaufen kann. Er kann auf eine Beziehung in einer Krise hinweisen, besonders wenn Konflikte beängstigend, erniedrigend oder zerstörerisch geworden sind. Eine Karte allein kann weder Missbrauch diagnostizieren noch dir die Entscheidung abnehmen. Schau auf das, was wirklich geschieht. Bei körperlicher Gewalt, Drohungen, Zwang oder Angst um deine Sicherheit hat Schutz Vorrang; such Unterstützung außerhalb der Beziehung. Wenn kein Missbrauch vorliegt, fordert die Karte trotzdem einen ehrlichen Neustart: Das Grundproblem muss angegangen werden, sonst kann die bisherige Struktur irgendwann zusammenbrechen.'],
  ['love', 'Die Person schlägt mich, sagt aber, dass sie mich liebt. Ist das trotzdem ein Problem?',
   'Ja. Wenn ein Partner dich schlägt, ist das körperliche Gewalt, und Liebe macht Gewalt nicht akzeptabel. Missbrauch kann neben Entschuldigungen, Zärtlichkeit und ruhigen Phasen bestehen — gerade deshalb ist er manchmal schwer zu erkennen oder zu verlassen. Du musst nicht erst beweisen, dass es „schlimm genug“ ist, bevor du Hilfe suchst. Wenn du dich unsicher fühlst, wende dich an eine vertraute Person oder eine Beratungsstelle für häusliche Gewalt und stell deine Sicherheit an erste Stelle.'],
  ['career', 'Ich bin seit drei Monaten arbeitslos. Finde ich bald Arbeit?',
   'Der Turm verspricht keinen sofortigen Job. Stattdessen fordert er dich auf, die Suche von Grund auf zu überprüfen. Bewirbst du dich auf passende Rollen? Sind Lebenslauf und Unterlagen stark genug? Bereitest du dich ernsthaft auf Gespräche vor und suchst du regelmäßig? Arbeitslosigkeit macht unerwartete Ausgaben besonders belastend, deshalb ist es außerdem sinnvoll, vorhandene finanzielle Reserven während der Suche möglichst zu schützen.'],
  ['career', 'Was kann sich in den nächsten drei bis sechs Monaten bei der Arbeit verändern?',
   'Eine plötzliche Veränderung kann die gewohnte Struktur durcheinanderbringen. Das kann eine Umorganisation, ein Wechsel der Führungskraft, das Ende eines Projekts, eine neue Regel oder etwas anderes sein, das schnelle Anpassung verlangt. Der Turm bedeutet nicht, dass eine Katastrophe sicher kommt. Er zeigt eher, dass etwas Instabiles sichtbar werden oder etwas Überholtes neu aufgebaut werden muss. Achte auf echte Warnzeichen, statt eine Krise vorwegzunehmen.'],
  ['other', 'Warum haben manche Menschen eine schwere erste Lebenshälfte und später ein besseres Leben?',
   'Dafür gibt es unterschiedliche Deutungen. In spirituellen Traditionen, die an Karma und Wiedergeburt glauben, können schwere Lebensphasen als Teil eines längeren Kreislaufs von Ursache, Wirkung und Entwicklung verstanden werden. Das ist eine Glaubensvorstellung und nichts, was Tarot beweisen kann. Praktisch gesehen kann das Leben später auch stabiler werden, weil Erfahrung, Beziehungen, Fähigkeiten und frühere Entscheidungen sich mit der Zeit ansammeln. Die hilfreiche Botschaft des Turms ist: Ein schwieriger Anfang muss nicht den Rest deines Lebens bestimmen.']
],
'major-17': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?',
   'Der Stern beschreibt jemanden mit beständigem Vertrauen ins Leben und in die eigene Fähigkeit weiterzugehen. Vor einer schwierigen Aufgabe glaubt diese Person eher daran, dass es einen Weg gibt. Wertvoll wird diese Hoffnung, wenn sie mit Handeln verbunden ist. Optimismus ohne Einsatz kann in Wunschdenken kippen: an einen guten Job glauben, ohne Bewerbungen zu schicken, oder auf Liebe hoffen, ohne je jemanden kennenzulernen. Der Stern ist am stärksten, wenn Hoffnung dir Mut gibt, an deiner eigenen Zukunft mitzuwirken.'],
  ['love', 'Welche Gefühle hat diese Person für mich?',
   'Wahrscheinlich ist echte Zuneigung da, aber die Person könnte dich zugleich idealisieren. In ihren Augen wirkst du vielleicht schöner, fähiger oder perfekter, als ein realer Mensch dauerhaft sein kann. Das fühlt sich anfangs romantisch an, doch langfristige Liebe wird meist gesünder, wenn zwei Menschen einander klar sehen, den Alltag teilen und sich auf Augenhöhe begegnen. Bewunderung ist schön; jemanden auf ein Podest zu stellen, ist schwer auf Dauer zu tragen.'],
  ['love', 'Wir streiten. Soll ich mich trennen?',
   'Der Stern ist eine hoffnungsvolle Karte und zeigt, dass noch Raum für Heilung in der Beziehung vorhanden sein kann. Der aktuelle Streit muss kein endgültiges Ende bedeuten. Statt mitten in der Hitze zu entscheiden, schau darauf, was sich realistisch reparieren lässt und ob beide bereit sind, daran zu arbeiten. Hoffnung hilft besonders dann, wenn sie von tatsächlicher Veränderung getragen wird.'],
  ['career', 'Ich bin seit drei Monaten arbeitslos. Finde ich einen passenden Job?',
   'Die Antwort tendiert zu Ja, aber Der Stern verbindet Hoffnung mit Eigeninitiative. Bewirb dich weiter, entwickle Fähigkeiten, die deine Chancen stärken, erweitere dein Netzwerk und mach dich für Möglichkeiten sichtbar. Hoffnung ersetzt kein Handeln; sie hilft dir, weiterzumachen, wenn Ergebnisse länger auf sich warten lassen.'],
  ['career', 'Was kann sich in den nächsten drei bis sechs Monaten bei der Arbeit verändern?',
   'Eine neue Möglichkeit kann in Sicht kommen. Die Karte garantiert nicht, dass du sie annimmst, sondern nur, dass etwas Beachtenswertes auftauchen kann. Deine Aufgabe ist, die Chance zu erkennen, zu prüfen, ob sie zu deiner Richtung passt, und zu handeln, solange sie wirklich offensteht.'],
  ['other', 'Bedeutet diese Karte immer, dass es Hoffnung gibt?',
   'Meist steht Der Stern für Hoffnung, Erneuerung und das Gefühl, dass eine schwierige Zeit leichter werden kann. Seine Schattenseite ist Idealisierung: eine Zukunft so perfekt zu erwarten, dass du die Gegenwart nicht mehr gestaltest. Zieh eine weitere Karte, wenn du wissen möchtest, ob die Hoffnung durch Handeln getragen wird. Eine Möglichkeit kann vorhanden sein — aber jemand muss ihr auch entgegengehen.']
],
'major-18': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?',
   'Der Mond kann jemanden beschreiben, der gerade mit Unsicherheit, Ängsten oder fehlender Klarheit lebt. Furcht kann Handlungen blockieren, und Gespräche drehen sich womöglich immer wieder um dieselben Sorgen, ohne zu einer Entscheidung zu führen. Das bedeutet nicht, dass die Person grundsätzlich negativ ist; vielleicht sieht sie den Weg im Moment einfach nicht klar. Niemand kann ihre Entscheidungen für sie treffen, doch Unterstützung, Reflexion und konkrete Informationen können helfen, echte Probleme von vorgestellten zu unterscheiden.'],
  ['love', 'Welche Gefühle hat diese Person für mich?',
   'Gefühle können vorhanden sein, aber Unsicherheit oder Angst hält die Person zurück. Die Sorge kann auf etwas Realem beruhen oder nur auf einem Szenario im eigenen Kopf — eine Karte allein sagt nicht, was davon zutrifft. Gib ihr Raum, diese Unsicherheit selbst zu klären, statt eine Entscheidung zu erzwingen. Entscheidend ist, ob ihr späteres Verhalten klar und beständig wird.'],
  ['love', 'Wir streiten. Soll ich mich trennen?',
   'Der Mond fordert dich auf zu prüfen, ob der Konflikt auf Tatsachen oder auf Annahmen beruht. Eifersucht ist ein typisches Beispiel: Ein spätes Abendessen mit Kollegen kann im Kopf zu einer ganzen Geschichte werden, bevor überhaupt Beweise existieren. Wiederholtes Misstrauen kann Vertrauen beschädigen, selbst wenn das Befürchtete nie passiert ist. Gleichzeitig solltest du echte Warnzeichen nicht als „nur Angst“ abtun. Werde langsamer, prüfe, was du wirklich weißt, sprich direkt darüber und entscheide nach der Realität statt nach vorgestellten Szenarien.'],
  ['love', 'Was wäre eine gesündere Art, darüber zu denken?',
   'Du musst nicht jedes mögliche Ergebnis kontrollieren. Vertrauen kann bedeuten, der Beziehung Raum zu geben und gleichzeitig bereit zu sein, auf neue echte Informationen zu reagieren. Ist dein Partner treu, erschöpft ständiger Verdacht euch beide. Tauchen eines Tages klare Beweise für einen Verrat auf, kannst du dich dann mit dieser Realität auseinandersetzen. Das Ziel ist kein blindes Vertrauen, sondern nicht jede Angst so zu behandeln, als wäre sie bereits eine Tatsache.'],
  ['career', 'Ich bin seit zwei oder drei Monaten arbeitslos. Finde ich bald Arbeit?',
   'Angst kann beeinflussen, wie du dich präsentierst. Wenn du schon vor jedem Gespräch überzeugt bist, dass du scheitern wirst, kann diese Anspannung verhindern, dass du wirklich zeigst, was du kannst. Nervosität ist normal. Wichtig ist, dass sie nicht dein Verhalten bestimmt. Bereite dich gut vor, übe deine Antworten und bewerte jedes Gespräch nach dem, was tatsächlich passiert, statt nach dem schlimmsten Ergebnis, das du dir vorher vorgestellt hast.'],
  ['career', 'Worauf sollte ich in den nächsten drei bis sechs Monaten bei der Arbeit achten?',
   'Eine Veränderung kann Unsicherheit auslösen — zum Beispiel eine Umorganisation, eine neue Führungskraft oder veränderte Aufgaben. Der Mond erinnert dich daran, Sorgen nicht schneller laufen zu lassen als die Fakten. Vielleicht fürchtest du schon, dass eine neue Leitung dich nicht mag, bevor ihr euch überhaupt begegnet seid. Trenne das, was sich wirklich verändert hat, von dem, was dein Kopf nur vorhersagt, und reagiere auf die reale Situation, sobald sie sich entwickelt.'],
  ['other', 'Wenn ich vor etwas große Angst habe, passiert es dann eher?',
   'Angst lässt Ereignisse nicht magisch entstehen, aber sie kann dein Verhalten beeinflussen. Wer panische Angst hat, zu spät zu kommen, schläft vielleicht schlecht, hetzt am Morgen, vergisst etwas und kommt am Ende teilweise wegen der eigenen Anspannung wirklich zu spät. Die hilfreiche Lehre ist nicht, dich ständig zu „positivem Denken“ zu zwingen. Tu, was du kannst, bereite dich gut vor und lass Raum für Ergebnisse, die du nicht kontrollierst. Läuft es gut, freu dich. Läuft es anders, darfst du enttäuscht sein und trotzdem weitergehen.']
],
'major-19': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?',
   'Die Sonne beschreibt jemanden mit natürlicher Ausstrahlung. Die Person ist oft optimistisch, offen und leicht wahrzunehmen und bringt genug Selbstvertrauen mit, um zu führen oder einem Raum Energie zu geben. Die Schattenseite kann ein starkes Bedürfnis nach Aufmerksamkeit oder Schwierigkeiten damit sein, aus dem Mittelpunkt zu treten. Wärme wird nachhaltiger, wenn Selbstvertrauen auch mit Zuhören, Teilen und dem Wunsch verbunden ist, andere ebenfalls glänzen zu lassen.'],
  ['love', 'Welche Gefühle hat diese Person für mich?',
   'Die Sonne ist in Liebesfragen meistens sehr positiv. Wenn ihr euch noch kennenlernt, deutet sie darauf hin, dass du echte Freude und Wärme in das Leben dieser Person bringst. Besonders auffällig ist die Klarheit: Sie weiß eher, was sie fühlt und was sie möchte, und zeigt es offen, statt dich ständig rätseln zu lassen.'],
  ['love', 'Wir streiten. Soll ich mich trennen?',
   'Statt eines einfachen Ja oder Nein fordert Die Sonne mehr Licht in der Beziehung: mehr Ehrlichkeit, Klarheit und direkte Kommunikation. Konflikte wachsen oft, wenn beide ihre Bedürfnisse für sich behalten und erwarten, dass der andere sie errät. Sag, was du wirklich möchtest, hör dir an, was die andere Person braucht, und prüft, ob ihr euch offen begegnen könnt. Wenn alles klarer ist, wird auch die Entscheidung meist leichter.'],
  ['career', 'Ich bin seit drei Monaten arbeitslos. Finde ich den Job, den ich möchte?',
   'Die Antwort tendiert deutlich zu Ja. Die Sonne deutet auf eine hellere berufliche Phase und auf eine Stelle hin, die sich nach einer schwierigen Wartezeit wie ein echter Erfolg anfühlen kann. Mach mit der praktischen Suche weiter, denn die Karte beschreibt günstige Energie und keinen Arbeitsvertrag, der ganz ohne Handeln von selbst auftaucht.'],
  ['career', 'Wie entwickelt sich meine Arbeit in den nächsten sechs bis zwölf Monaten?',
   'Die Arbeit wirkt insgesamt positiv und relativ stabil. Wenn es bereits gut läuft, kann Die Sonne darauf hinweisen, dass dieser Schwung anhält. Eine einzelne Karte kann jedoch nicht jedes Ereignis eines ganzen Jahres abbilden. Lies sie deshalb als Grundton und nicht als Garantie dafür, dass überhaupt nichts Schwieriges passieren wird.'],
  ['other', 'Ist diese Karte immer positiv?',
   'Meist wird Die Sonne positiv gelesen: Klarheit, Vitalität, Selbstvertrauen und Erfolg. Ihre Schattenseite kann Übermut, Ego oder zu viel Sichtbarkeit sein. Wenn du für jemand anderen liest, halte die Deutung ausgewogen. Die Aufgabe eines Readers ist weder, Angst zu machen, noch Perfektion zu versprechen, sondern die Karte ehrlich zu beschreiben und Raum für die tatsächliche Situation zu lassen.']
],
'major-20': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?',
   'Das Gericht kann jemanden beschreiben, der durch eigene Erfahrungen viel Perspektive gewonnen hat. Das ist nicht dasselbe wie schulische Intelligenz oder großes Faktenwissen. Das Verständnis kommt aus Wendepunkten, Reflexion und der Erkenntnis, was im Leben wirklich wichtig ist. Bei einem jungen Menschen kann die Karte auf eine Reife hinweisen, die über das Alter hinausgeht.'],
  ['love', 'Welche Gefühle hat diese Person für mich?',
   'Die Energie ist positiv und kann auf eine Verbindung hinweisen, die tiefer als reine äußerliche Anziehung wirkt. Die Person schätzt womöglich deinen Charakter, deine innere Welt und das besondere Gefühl von Wiedererkennen zwischen euch. In ihrer gesündesten Form ist diese Zuneigung respektvoll statt besitzergreifend: Sie kann ihre Gefühle aussprechen und gleichzeitig deine Antwort und deine Grenzen akzeptieren.'],
  ['love', 'Wir streiten. Soll ich mich trennen?',
   'Das Gericht fordert dich auf, die ganze Beziehung zu betrachten und nicht nur den heutigen Streit. Was hat euch zusammengebracht? Was war gut, und welche Muster wiederholen sich? Ein einzelner Konflikt löscht nicht automatisch alles davor aus. Schwere Verletzungen, Verrat oder Missbrauch sollten aber auch nicht heruntergespielt werden, nur weil es schöne Erinnerungen gibt. Entscheide anhand des Gesamtmusters und danach, was beide wirklich bereit sind zu verändern.'],
  ['career', 'Ich bin seit drei Monaten arbeitslos. Finde ich eine neue Stelle?',
   'Das Gericht richtet die Frage zuerst nach innen. Vielleicht bewirbst du dich überall, weil du glaubst, keine andere Wahl zu haben, obwohl viele Stellen gar nicht zu dir passen. Nimm dir Zeit zu prüfen, was du wirklich möchtest, was du gut kannst und welche Art von Arbeit du realistisch aufbauen kannst. Sobald die Richtung klarer ist, können auch deine Bewerbungen gezielter und wirksamer werden.'],
  ['career', 'Was verändert sich bis Jahresende beruflich? Gibt es eine neue Chance?',
   'Wenn du dich mit deiner Arbeit bereits verbunden und auf dem richtigen Weg fühlst, bleibt die Grundrichtung positiv. Unterwegs kann eine neue Chance auftauchen. Mach weiter mit dem, was funktioniert, bleib offen für Feedback und stütze den guten Schwung durch beständige Arbeit, statt anzunehmen, dass er sich von allein erhält.'],
  ['other', 'Was bedeutet hier „hohe Frequenz“?',
   'In Nabūs spiritueller Sprache ist „hohe Frequenz“ am besten als Bild für einen relativ stabilen, geerdeten inneren Zustand zu verstehen — nicht als wissenschaftlich messbare Schwingung. Du fühlst weiterhin Freude, Enttäuschung, Aufregung und Traurigkeit, wirst aber nicht von jedem Ereignis völlig aus der Mitte gerissen. Emotionale Reife bedeutet nicht, weniger zu fühlen, sondern vollständig fühlen zu können und trotzdem wieder zu dir zurückzufinden.'],
  ['other', 'Ist es schlimm, einen Job zu machen, den ich nicht mag?',
   'Nein. Viele Menschen machen Arbeit, die sie nicht lieben, weil sie Einkommen, Stabilität oder eine Brücke zu etwas anderem bietet. Die hilfreiche Frage lautet, ob diese Lösung dir noch dient. Du darfst einen praktischen Job behalten und parallel eine andere Richtung aufbauen, oder entscheiden, dass Sicherheit dir wichtiger ist als Leidenschaft. Wichtig ist, bewusst zu wählen, statt zu glauben, es gäbe nur eine richtige Art zu leben.']
],
'major-21': [
  ['career', 'Finde ich in nächster Zeit eine neue Stelle?',
   'Die Welt tendiert zu Ja und kann zugleich etwas über die Art der Gelegenheit sagen. Die nächste Stelle könnte internationale Arbeit, ein anderes Land, ein multinationales Unternehmen oder regelmäßigen Kontakt mit Menschen im Ausland beinhalten. Wenn nicht, kann die Karte trotzdem auf räumliche Bewegung hinweisen, etwa einen Umzug in eine andere Stadt wegen der Arbeit.'],
  ['career', 'Ich habe einen normalen Bürojob. Verändert sich demnächst etwas?',
   'Hier muss Die Welt kein Ende bedeuten. Sie kann Abschluss und Kompetenz in einem Gebiet zeigen, das du bereits gut kennst. Deine Arbeit kann stabil bleiben, und vielleicht ist das eine Branche, mit der du lange verbunden bleibst, selbst wenn du später das Unternehmen wechselst. Ein Feld zu finden, das wirklich zu dir passt, kann wichtiger sein, als für immer bei demselben Arbeitgeber zu bleiben.'],
  ['love', 'Was bedeutet es eigentlich, wenn zwei Menschen gut zusammenpassen?',
   'Echte Kompatibilität hat weniger mit identischer Persönlichkeit oder gleichen Hobbys zu tun als damit, ob eure Grundwerte und langfristigen Richtungen miteinander leben können. Zwei Menschen können sehr unterschiedlich denken und sich trotzdem wunderbar ergänzen, wenn sie eine ähnliche Art von Zukunft aufbauen möchten. Umgekehrt reichen gemeinsame Interessen oft nicht, wenn eine Person ein stabiles Familienleben möchte und die andere völlige Unabhängigkeit ohne langfristige Bindung. Unterschiede können eine Beziehung bereichern; entscheidend ist, ob ihr letztlich auf denselben Horizont zugeht.']
]
});

Object.assign(ASK.de, {
'wands-1': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Das ist ein kontaktfreudiger, energiegeladener Mensch, der lieber handelt, als stillzusitzen und alles zu zerdenken. Die Person ist ehrgeizig, begeistert und voller Feuer. Bewegung, Sport oder ein aktiver Alltag geben dieser Energie oft einen gesunden Ausweg. Fehlt ein Ventil, kann sie sich als Ungeduld, Streit oder unüberlegtes Verhalten zeigen.'],
  ['love', 'Welche Gefühle hat diese Person für mich?', 'Die Grundenergie ist positiv, und wahrscheinlich besteht eine starke körperliche Anziehung. Anziehung selbst ist kein Problem; entscheidend ist, wie die Person damit umgeht. Respekt, Geduld und klare Grenzen sind gute Zeichen. Druck, Anspruchsdenken oder sofortiges Verschwinden, sobald sie bekommen hat, was sie wollte, sind es nicht.'],
  ['love', 'Wir streiten. Soll ich mich trennen?', 'Diese Karte deutet nicht direkt auf eine Trennung. Sie fordert mehr Eigeninitiative in der Beziehung: Eröffne das Gespräch, benenne das Problem und schau, ob ihr beide daran arbeiten wollt. Vielleicht ist eine Person müde davon, immer den ersten Schritt machen zu müssen, während die andere hinter ihrer Schutzmauer wartet. Bei Trennungsfragen sollte immer das echte Beziehungsmuster entscheiden und nicht eine einzelne Karte.'],
  ['career', 'Finde ich bald eine neue Stelle?', 'Die Antwort tendiert zu Ja, besonders durch deine eigene Initiative und weniger dadurch, dass dir jemand einfach eine Chance bringt. Die nächste Rolle kann außerdem aktiv und menschenbezogen sein, mit Bewegung, Kommunikation oder einem schnellen Arbeitsrhythmus statt einem ganzen Tag allein am selben Platz.'],
  ['career', 'Worauf sollte ich bis zum Jahresende beruflich achten?', 'Das Gesamtbild ist günstig. Neue berufliche Möglichkeiten können auftauchen, und du kannst selbst entscheiden, ob du sie verfolgst. Vielleicht erschließt du dir auch eine zusätzliche Einnahmequelle.'],
  ['other', 'Welche Grundenergie haben die vier Asse?', 'Alle vier Asse stehen für Anfänge: frische Energie, eine neue Öffnung und den ersten Schritt eines Weges. Sie gelten grundsätzlich als positive Karten, aber ein Ass ist zunächst Potenzial und noch kein fertiges Ergebnis.']
],
'swords-1': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Diese Person ist geistig schnell, sprachlich präzise und analytisch. Sie denkt logisch und bemerkt Widersprüche rasch. In astrologischer Symbolik kann das an merkurbetonte Energie wie Zwillinge oder Jungfrau erinnern: neugierig, aufmerksam und mental sehr aktiv.'],
  ['love', 'Welche Gefühle hat diese Person für mich?', 'Interesse kann vorhanden sein, aber das Ass der Schwerter beschreibt Klarheit und Denken stärker als Gefühle. Die Person nähert sich der Verbindung womöglich sehr rational und schützt sich selbst deutlich. Das ist nicht automatisch kalt oder schlecht; es bedeutet nur, dass sie bei fehlender Passung schnell klare Entscheidungen treffen kann. Zieh weitere Karten, wenn du die emotionale Tiefe genauer sehen möchtest.'],
  ['love', 'Wir streiten. Soll ich mich trennen?', 'Das Ass der Schwerter weist zuerst auf die Notwendigkeit klarer Kommunikation hin. Paare sammeln oft kleine Frustrationen, sagen lange nichts und explodieren später wegen einer Kleinigkeit, weil das eigentliche Thema nie angesprochen wurde. Benenne das wirkliche Problem, solange es noch überschaubar ist, hör zu und bearbeitet ein Thema nach dem anderen, statt im Streit jede alte Verletzung wieder hervorzuholen.'],
  ['love', 'Gibt es jemanden, der mich versteht, ohne dass ich etwas sagen muss?', 'Erwarte nicht, dass ein anderer Mensch deine Gedanken lesen muss. Selbst sehr gut passende Menschen brauchen Worte. Vertrauen, Kompromisse und klare Kommunikation lassen zwei Menschen mit der Zeit immer tiefer verstehen, was im anderen vorgeht.'],
  ['career', 'Ich bin seit zwei oder drei Monaten arbeitslos. Finde ich einen Job, der mir gefällt?', 'Es gibt zwei hilfreiche Lesarten. Du könntest eine Stelle finden, die Kommunikation, Beziehungen, Analyse oder andere geistige Arbeit beinhaltet. Oder die Karte fordert dich zuerst auf, deine Richtung zu klären. Wer sich überall bewirbt, ohne zu wissen, wohin er eigentlich möchte, baut oft weder das nötige Fachwissen noch glaubwürdige Begeisterung auf. Entscheide, welches Feld du testen willst, und richte deine Bewerbungen gezielter darauf aus.'],
  ['career', 'Worauf sollte ich in den nächsten drei bis sechs Monaten beruflich achten?', 'Ein neues Projekt kann auftauchen, das schnelles Lernen, viel Denken und den Umgang mit unbekannten Informationen verlangt. Insgesamt ist das ein konstruktives Zeichen.']
],
'cups-1': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Das ist ein warmer, emotional offener Mensch, dessen Gefühle meist in eine gesunde Richtung fließen. Die Person kümmert sich um sich selbst und um andere, hilft gern und begegnet dem Leben eher mit Freundlichkeit, ohne sich von jeder Emotion vollständig steuern zu lassen.'],
  ['love', 'Welche Gefühle hat diese Person für mich?', 'Das Ass der Kelche ist eine der klarsten Karten für echte Zuneigung. Die Gefühle sind reich und aufrichtig. Allein gelesen zeigt die Karte eher emotionale Offenheit als Besessenheit oder Besitzdenken: Die Person ist bereit, Liebe anzubieten, ohne deine Reaktion kontrollieren zu wollen.'],
  ['love', 'Wir streiten. Soll ich mich trennen?', 'Diese Karte zeigt, dass Zuneigung noch vorhanden ist und der Konflikt daher reparierbar sein kann. Setzt euch zusammen, sprecht ehrlich und erinnert euch daran, was ihr aneinander schätzt. Starke Gefühle lösen jedoch nicht jede Unvereinbarkeit. Wenn es um Verletzungen, zerstörtes Vertrauen oder gegensätzliche Grundwerte geht, müssen diese Themen trotzdem direkt bearbeitet werden.'],
  ['career', 'Ich bin arbeitslos. Finde ich bald eine neue Stelle?', 'Die Antwort tendiert zu Ja, und die nächste Rolle kann etwas sein, das dir wirklich Freude macht oder zu dem du eine emotionale Verbindung spürst. Über Gehalt oder Aufstieg sagt das Ass der Kelche allein wenig. Zieh dafür eine weitere Karte, wenn diese Details im Mittelpunkt stehen.'],
  ['career', 'Entwickelt sich meine Arbeit in den nächsten sechs Monaten weiter?', 'Eine Möglichkeit ist eine bedeutungsvolle neue Verbindung über die Arbeit. Eine andere ist ein neues Projekt, das dir wieder etwas gibt, wofür du dich begeistern kannst.'],
  ['other', 'Warum bekomme ich diese Karte, wenn ich nach dem Gehalt frage?', 'Manchmal hebt eine Legung hervor, was für die Person am wichtigsten sein wird, statt nur die Oberfläche der Frage zu beantworten. Das Ass der Kelche kann sagen, dass Freude und Erfüllung in dieser Rolle stärker ins Gewicht fallen als Geld. Das garantiert nicht, dass Leidenschaft automatisch Einkommen bringt. Gehalt und Bedingungen sollten deshalb weiterhin praktisch geprüft und bei Bedarf mit weiteren Karten betrachtet werden.']
],
'pentacles-1': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Das ist ein geerdeter, praktischer Mensch im positiven Sinn. Die Person achtet auf Details, denkt realistisch und baut lieber etwas Solides auf, als Unsicherheit romantisch zu verklären. Vielleicht zeigt sie weniger Feuer als das Ass der Stäbe oder weniger überschäumende Gefühle als das Ass der Kelche, dafür ist sie oft verlässlich, bereit für eine gemeinsame Zukunft zu arbeiten und spricht offen darüber, was realistisch ist.'],
  ['love', 'Was denkt diese Person über mich und über unsere Beziehung?', 'Wahrscheinlich sind Gefühle da, und gleichzeitig sieht die Person praktische Kompatibilität zwischen euch. Sie kann überlegen, ob Lebensstil, Werte, Finanzen und langfristige Vorstellungen zusammenpassen. In einer ernsthaften Beziehung sind Gefühle zentral, doch praktische Vereinbarkeit spielt ebenfalls eine Rolle.'],
  ['love', 'Ist ein unterschiedlicher familiärer Hintergrund in einer Beziehung wirklich wichtig?', 'Er kann eine Rolle spielen, entscheidet die Beziehung aber nicht allein. Menschen aus sehr unterschiedlichen finanziellen oder kulturellen Umfeldern entwickeln möglicherweise andere Vorstellungen über Geld, Familienrollen, Sicherheit und Alltag. Zum Problem werden diese Unterschiede vor allem dann, wenn man nicht darüber sprechen oder verhandeln kann. Reife, Neugier und gemeinsame Werte können viel überbrücken. Herkunft sollte deshalb nicht als starres Maß dafür behandelt werden, ob zwei Menschen zusammengehören.'],
  ['love', 'Wir streiten. Soll ich mich trennen?', 'Überstürze nichts. Das Ass der Münzen fordert euch auf, geerdeter und praktischer zu werden. Der Konflikt kann kleiner sein, als er sich im Moment anfühlt. Leg romantische Erwartungen oder dramatische Deutungen kurz beiseite und fragt euch, welches konkrete Problem tatsächlich gelöst werden muss.'],
  ['career', 'Finde ich bald eine Stelle?', 'Die Antwort tendiert zu Ja. Das Ass der Münzen ist besonders bei Arbeit und Geld günstig und kann auf eine solide Chance mit vernünftigem Einkommen, Stabilität oder Entwicklungsmöglichkeiten hinweisen.'],
  ['career', 'Was kann sich beruflich bald verändern?', 'Du könntest mehr Einkommen, eine Gehaltserhöhung, ein neues Projekt, eine Versetzung, eine Beförderung oder eine andere konkrete Chance bekommen. Vielleicht eröffnest du dir auch selbst eine neue Einnahmequelle, etwa ein Nebengeschäft oder eine Investition.']
],
'wands-2': [
  ['love', 'Welche Gefühle hat diese Person für mich?', 'Die Person scheint über die Gegenwart hinauszudenken und kann sich bereits eine längerfristige Zukunft mit dir vorstellen. Der Wunsch nach Bindung kann echt sein, doch die Karte allein sagt nicht, ob er nur aus Gefühlen oder auch aus praktischen Überlegungen entsteht. Schöne Kelchkarten würden die emotionale Seite verstärken; rationalere Karten können zeigen, dass langfristige Passung ebenfalls Teil der Entscheidung ist.'],
  ['love', 'Ist es schlecht, wenn die Person sich auch aus praktischen Gründen binden möchte?', 'Nicht unbedingt. Jemand kann mit Herz und Verstand zugleich lieben. Die Person kann Eigenschaften in dir sehen, die eine langfristige Partnerschaft tragfähig machen, etwa gemeinsame Werte, ergänzende Stärken oder ähnliche Vorstellungen von Familie und Beruf. Praktisches Denken wird erst problematisch, wenn die Beziehung rein transaktional wird oder jemand ausgenutzt wird. Ruhige, bewusste Liebe kann genauso ehrlich sein wie dramatische Leidenschaft.'],
  ['love', 'Wir streiten. Soll ich mich trennen?', 'Statt nur auf den aktuellen Streit zu schauen, betrachte das größere Bild. Geht es um Kleinigkeiten wie späte Antworten oder Social-Media-Interaktionen, frag dich, ob diese Details wirklich den Blick auf die ganze Beziehung bestimmen sollten. Ist das Problem ernst, gehört allerdings auch der tatsächliche Schaden zum großen Bild und darf nicht kleingeredet werden.'],
  ['career', 'Finde ich bald einen Job, der mir gefällt?', 'Mit nur einer Karte bleiben zwei Hauptmöglichkeiten. Vielleicht brauchst du noch Zeit, um dich vorzubereiten, zu lernen oder deine Bewerbungen zu stärken, weil die Zwei der Stäbe in eine Zukunft blickt, die noch nicht ganz da ist. Oder die nächste Rolle beinhaltet internationale Arbeit, Reisen, einen Umzug, Planung oder strategisches Denken.'],
  ['career', 'Worauf sollte ich bis zum Jahresende beruflich achten?', 'Du könntest ehrgeiziger werden als zuvor und mehr Verantwortung, eine Beförderung oder besseres Gehalt wollen. Ehrgeiz ist hilfreich, wenn er dir Richtung gibt; problematisch wird er erst, wenn nichts jemals genug ist. Die Karte kann außerdem auf Reisen oder räumliche Veränderungen durch die Arbeit hinweisen.']
],
'swords-2': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Diese Person neigt dazu, Entscheidungen aufzuschieben, besonders wenn beide Möglichkeiten unangenehm wirken. In Beziehungen oder im Beruf kann sie dadurch passiv werden, weil jede Wahl bedeutet, auf etwas anderes zu verzichten. Die Lehre der Zwei der Schwerter ist nicht, dass Kontrolle immer gut ist, sondern dass auch das Vermeiden einer Entscheidung Folgen hat.'],
  ['love', 'Welche Gefühle hat diese Person für mich?', 'Wahrscheinlich ist die Person unentschlossen. Gefühle können vorhanden sein, doch etwas verhindert einen klaren Schritt nach vorn. Zieh weitere Karten, wenn du verstehen möchtest, ob die Zurückhaltung aus Angst, äußeren Umständen, anderen Prioritäten oder Unsicherheit über die Beziehung selbst kommt.'],
  ['love', 'Wir streiten. Soll ich mich trennen?', 'Die Zwei der Schwerter deutet darauf hin, dass ein wichtiges Thema vermieden wird. Einer oder beide ärgern sich vielleicht über etwas, sprechen aber nur über kleinere Nebensachen statt über das eigentliche Problem. Wenn ihr den Kern erkennt und direkt darüber redet, muss eine Trennung nicht nötig sein. Ist die Wahrheit dahinter ernst, dann lass diese reale Situation entscheiden und nicht das Vermeiden.'],
  ['career', 'Finde ich bald eine passende Stelle?', 'Die Antwort kann sich verzögern, weil deine Richtung noch unklar ist oder weil du zwar weißt, was du ändern solltest, aber noch nicht gehandelt hast. Wenn deine Ausbildung in einem Feld liegt, dein echtes Interesse aber in einem anderen, hält dich die ausschließliche Bewerbung im alten Bereich womöglich fest. Entscheide, welche Richtung du ausprobieren möchtest, und mach konkrete Schritte dorthin.'],
  ['career', 'Gibt es beruflich etwas, das ich bald angehen sollte?', 'Vielleicht gibt es am Arbeitsplatz bereits ein unangenehmes Thema, das du lieber ignorieren würdest. Kümmere dich darum, solange es noch klein ist. Das Gefühl, dass eine Führungskraft jemanden bevorzugt, muss zum Beispiel keine Krise sein, aber stiller Groll wächst leicht, wenn du nie nach Erwartungen oder Feedback fragst.'],
  ['other', 'Was passiert, wenn ich das Problem weiter vermeide?', 'Vermeidung macht ungelöste Probleme meistens schwerer statt leichter. Im Tarot kann die Entwicklung von der Zwei der Schwerter zu schwereren Karten als symbolische Warnung gelesen werden: Was du nicht ansehen willst, kann dich später durch Konsequenzen zu einer Entscheidung zwingen. Du musst nicht auf eine Krise warten. Eine kleine ehrliche Entscheidung heute ist oft leichter als eine dramatische später.']
],
'cups-2': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Diese Karte beschreibt jemanden, der Gegenseitigkeit schätzt und anderen gut auf halbem Weg entgegenkommen kann. Die Person verhandelt meist geschickt, kommuniziert diplomatisch und merkt, ob Geben und Nehmen ausgewogen wirken. In Beziehungen sind Fairness, Zusammenarbeit und gute Verbindungen zu anderen oft wichtig.'],
  ['love', 'Welche Gefühle hat diese Person für mich?', 'Das ist ein sehr positives Zeichen. In der Energie liegt Gegenseitigkeit: Die Person möchte Zuneigung geben und hofft zugleich, Zuneigung zurückzubekommen. Die Zwei der Kelche ist eine der klarsten Karten für Verbindung und emotionales Entgegenkommen.'],
  ['love', 'Wir streiten oft. Wie kann ich die Beziehung verbessern?', 'Die Gefühle können weiterhin stark sein, während die Konflikte eher aus Unterschieden in Persönlichkeit oder Kommunikation entstehen. Nutzt eure Verbindung als Grund, gemeinsam daran zu arbeiten. Benennt das Problem, hört einander zu und sucht als Paar nach einer Lösung, statt dass jeder die Beziehung allein reparieren will.'],
  ['love', 'Wen sollte ich fragen, wenn ich meine Beziehung verbessern möchte?', 'Rat von vertrauten Menschen kann manchmal helfen, doch das wichtigste Gespräch ist meistens das mit der Person, mit der du tatsächlich zusammen bist. Frag, was sie von dir braucht, sag, was du von ihr brauchst, und prüft, ob ihr beide bereit seid, etwas anzupassen. Eine dritte Person kann ein Gespräch nicht ersetzen, das das Paar selbst führen muss.']
],
'pentacles-2': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Das ist nicht unbedingt jemand, der bereits völlig ausgeglichen ist, sondern jemand, der ständig versucht, viele Dinge in Balance zu halten. Die Person ist anpassungsfähig, beschäftigt und oft am zufriedensten, wenn mehrere Aufgaben gleichzeitig laufen. Die Herausforderung ist zu erkennen, wann Flexibilität hilft und wann zu viel Jonglieren die Stabilität kostet.'],
  ['love', 'Welche Gefühle hat diese Person für mich?', 'Gefühle können vorhanden sein, aber die Aufmerksamkeit wird zwischen Beziehung, Arbeit, Studium, Geld oder anderen Verpflichtungen aufgeteilt. Die Karte bedeutet nicht automatisch eine dritte Person. Meist geht es um praktisches Jonglieren. Die eigentliche Frage ist, ob die Zeit und Aufmerksamkeit, die die Person geben kann, für die Art von Beziehung ausreichen, die du möchtest.'],
  ['love', 'Wir streiten. Soll ich mich trennen?', 'Der Konflikt kann mit Überlastung zusammenhängen. Stress aus Arbeit oder anderen Pflichten kann in die Beziehung überschwappen, besonders wenn jemand tagsüber Frust schluckt und ihn zu Hause herauslässt. Bevor du über eine Trennung entscheidest, prüf, ob sich das Muster verbessert, wenn Arbeitsmenge, Erholung und Grenzen besser geregelt werden. Stress erklärt Gereiztheit, entschuldigt aber keine schlechte Behandlung.'],
  ['health', 'Woran merke ich, dass ich aus dem Gleichgewicht bin?', 'Achte auf Körper und Psyche. Körperliche Erschöpfung ist oft leichter zu erkennen, während seelische Belastung sich etwa durch anhaltende Gereiztheit, Niedergeschlagenheit, Angst, schlechten Schlaf, Interessenverlust oder das Gefühl zeigen kann, sich nicht mehr zu erholen. Du musst nicht warten, bis es sehr schlimm wird, bevor du deine psychische Gesundheit ernst nimmst. Bleiben Beschwerden bestehen oder beeinträchtigen sie deinen Alltag, ist professionelle Unterstützung sinnvoll.'],
  ['career', 'Ich bin seit ein paar Monaten arbeitslos. Finde ich bald Arbeit?', 'Die Antwort ist nicht festgelegt. Die Zwei der Münzen empfiehlt zuerst genug Struktur zu schaffen, um gute Entscheidungen treffen zu können. Sind deine Tage, Bewerbungen und Prioritäten ungeordnet, kann ein klares System die Suche wirksamer machen. Eine aufgeräumte Umgebung hilft manchen Menschen beim Denken, doch entscheidend ist die praktische Ordnung: Zielrollen kennen, Bewerbungen verfolgen und sich regelmäßig vorbereiten.'],
  ['other', 'Was hat Aufräumen mit der Jobsuche zu tun?', 'Aufräumen funktioniert hier als Bild für Ordnung und nicht als magische Ursache für einen Job. Eine ruhigere Umgebung, ein regelmäßiger Tagesablauf und grundlegende Selbstfürsorge können Konzentration, Vorbereitung und Entscheidungen erleichtern. Dasselbe gilt für Beziehungen und Verpflichtungen: Erkenne, was dich auslaugt, setz nötige Grenzen und reduziere unnötigen Ballast.'],
  ['other', 'Warum scheint die Karte manchmal eine andere Frage zu beantworten?', 'Eine Legung kann auf einen Faktor unterhalb der Oberflächenfrage hinweisen. Wenn das passiert, erkläre die Verbindung klar, statt eine unpassende Bedeutung zu erzwingen. Zeig, wie das zugrunde liegende Thema die eigentliche Frage beeinflussen könnte, und lass der Person Raum zu entscheiden, ob die Deutung zu ihrer realen Situation passt.']
]
});

Object.assign(ASK.de, {
'wands-3': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Diese Person hat viele Pläne, Leidenschaften und Ziele, zögert aber beim ersten echten Schritt, weil sie Angst vor dem Scheitern hat. Sie erzählt begeistert, was sie alles machen möchte, erklärt Monate später, warum sie noch nicht angefangen hat, und wechselt vielleicht schon zur nächsten Idee. Die Herausforderung lautet, Vision in Handlung zu verwandeln.'],
  ['love', 'Welche Gefühle hat diese Person für mich?', 'Wenn die Beziehung noch neu ist, können die Gefühle und Gedanken über eine gemeinsame Zukunft durchaus ehrlich sein. Was fehlt, sind konkrete Schritte. Die Person spricht vielleicht davon, langfristig mit dir zusammenzubleiben, ohne schon praktische Entscheidungen zu Arbeit, Familie, Wohnsituation oder Bindung zu treffen. Im Moment lebt die Zukunft stärker in ihrer Vorstellung als in einem wirklichen Plan.'],
  ['love', 'Wir streiten. Soll ich mich trennen?', 'Diese Karte allein reicht für die Entscheidung nicht aus. Eine mögliche Konfliktquelle ist, dass einer oder beide die Idee einer langfristigen Beziehung mögen, aber noch nicht bereit für das sind, was sie verlangt. Bindung bedeutet Kompromisse, praktische und finanzielle Planung, Verantwortung und Platz für individuelles wie gemeinsames Leben. Sprecht darüber, was „langfristig“ für euch konkret bedeutet, bevor ihr endgültig entscheidet.'],
  ['love', 'Wie kann ich die andere Person verändern?', 'Du kannst keinen Menschen verändern, der sich selbst nicht verändern möchte. Du kannst erklären, was dich verletzt, Grenzen setzen und um konkrete Veränderungen bitten. Die Entscheidung zu wachsen muss aber von der Person selbst kommen. Liebe gibt dir keine Kontrolle über die Entscheidungen eines anderen.'],
  ['career', 'Ich bin seit ein paar Monaten arbeitslos. Finde ich bald Arbeit?', 'Du hast vielleicht große Pläne, aber noch zu wenig Handlung dahinter. Für eine begehrte Stelle musst du womöglich erst Fähigkeiten, Erfahrung und stärkere Bewerbungen aufbauen. Wenn Angst dich sogar vom Suchen oder Absenden abhält, beginne mit einem konkreten Schritt. Die Karte kann auch auf eine Geschäftsidee oder einen selbstständigen Weg hinweisen, den du bisher nicht zu testen wagst.'],
  ['career', 'Worauf sollte ich beruflich in nächster Zeit achten?', 'Du hast womöglich mehrere Ideen, zögerst aber aus Angst, sie umzusetzen. Die Drei der Stäbe fordert dich auf, über das Planen hinauszugehen und einen realistischen ersten Schritt aus deiner Komfortzone zu machen.'],
  ['other', 'Was ist, wenn ich scheitere und andere über mich lachen?', 'Die meisten Menschen achten viel weniger auf deine Fehler, als deine Angst dir erzählt. Sie haben ihr eigenes Leben, und selbst wenn jemand ein Scheitern bemerkt, wandert die Aufmerksamkeit meist schnell weiter. Scheitern kann peinlich sein, aber jede wichtige Chance aus Angst vor fremden Urteilen zu vermeiden, kostet langfristig mehr. Lass andere ihre Meinung haben und lern weiter.']
],
'swords-3': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Die Drei der Schwerter kann jemanden beschreiben, der Traurigkeit, Enttäuschung oder emotionalen Schmerz mit sich trägt. Vielleicht sieht die Person das Leben im Moment negativer, weil etwas noch weh tut. Lies das als Bild ihres aktuellen Zustands und nicht als unveränderliches Persönlichkeitsmerkmal.'],
  ['love', 'Welche Gefühle hat diese Person für mich?', 'Das ist ein schwieriges emotionales Signal. Die Person kann noch unverarbeiteten Schmerz aus der Vergangenheit tragen und deshalb nicht vollständig bereit für eine neue Beziehung sein. Das bedeutet weder, dass sie nicht lieben kann, noch dass eine Trennung unvermeidlich ist. Wichtig ist, ob sie die Wunde erkennt und bereit ist, sich darum zu kümmern, statt die neue Beziehung alles tragen zu lassen.'],
  ['love', 'Wir streiten. Soll ich mich trennen?', 'Der Konflikt tut weh, aber die Drei der Schwerter bedeutet nicht automatisch, dass nichts mehr zu retten ist. Schau darauf, was den Schmerz tatsächlich verursacht. Geht es um wiederkehrende kleine Verletzungen, kann ehrliche Kommunikation das Muster noch verändern. Geht es um Verrat, Missbrauch oder schweren Schaden, darfst du das nicht herunterspielen, nur weil es eine Karte der Kleinen Arkana ist. Die reale Schwere der Situation ist wichtiger als die Kartenkategorie.'],
  ['love', 'Soll ich meinen Partner kontrollieren?', 'Nein. Gesunde Nähe braucht keine Passwörter, ständige Standortkontrolle oder Überwachung jedes Likes und jeder Nachricht. Wenn etwas Konkretes Vertrauen beschädigt hat und du Informationen brauchst, sprecht offen darüber, statt die Beziehung in Überwachung zu verwandeln. Frag dich, welche Angst hinter dem Kontrollbedürfnis steht und ob Vertrauen tatsächlich wieder aufgebaut werden kann.'],
  ['career', 'Finde ich bald einen Job, der mir gefällt?', 'Es kann noch Enttäuschung oder Verzögerung geben. Die Karte erklärt den ganzen Grund nicht allein, deshalb zieh bei Bedarf weiter. Vielleicht bewirbst du dich in eine Richtung, die nicht zu dir passt, weil Familie, gesellschaftlicher Druck oder Angst dich von der Arbeit wegziehen, die du eigentlich willst. Betrachte Absagen nicht als Beweis, dass „das Universum“ dich blockiert, sondern als Information und überprüfe Richtung, Fähigkeiten und Strategie.'],
  ['career', 'Was kann sich beruflich bald verändern?', 'Eine Enttäuschung kann auftreten: Ein Projekt bleibt hinter den Erwartungen zurück, Feedback trifft dich oder das Verhältnis zu einem Kollegen wird unangenehm. Die Karte zeigt eher Verletzung als völligen Zusammenbruch. Kümmere dich früh darum, bevor stiller Groll wächst.']
],
'cups-3': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Das ist ein geselliger Mensch, der Freunde, Treffen, Feiern und das Zusammensein mit anderen genießt.'],
  ['love', 'Welche Gefühle hat diese Person für mich?', 'Allein gelesen spricht diese Karte deutlicher von Freundschaft, Freude und Gesellschaft als von exklusiver romantischer Bindung. Wenn ihr bereits zusammen seid, kann sie einfach bedeuten, dass eure Beziehung weiterhin Spaß und eine starke Freundschaftsbasis enthält. Zieh weitere Karten, bevor du daraus ein negatives Urteil machst.'],
  ['love', 'Wir streiten oft. Soll ich mich trennen?', 'Zieh weitere Karten, bevor du entscheidest. Die Drei der Kelche kann manchmal die Frage nach einem dritten Einfluss aufwerfen, beweist aber keinen Betrug. Dieser Einfluss kann ein Freund, ein Familienmitglied, ein sozialer Kreis oder jemand auf beiden Seiten der Beziehung sein. Frag, welcher äußere Faktor euch wirklich beeinflusst, statt aufgrund einer Karte jemanden zu beschuldigen.']
],
'pentacles-3': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Das ist ein eher ernsthafter, kooperativer Mensch. Wie bei der Drei der Kelche ist die Person gern mit anderen zusammen, aber häufiger rund um eine gemeinsame Aufgabe oder ein nützliches Ziel statt nur zum Vergnügen. Sie schätzt Teamarbeit, Zusammenarbeit und Umgebungen, in denen Menschen gemeinsam etwas aufbauen.'],
  ['love', 'Welche Gefühle hat diese Person für mich?', 'Die Energie kann praktischer oder professioneller als romantisch sein. Die Person sieht dich vielleicht als Freund, Kollegen, Mitschüler oder jemanden, mit dem sie gut zusammenarbeitet. In einer bestehenden Beziehung kann die Karte auch auf den praktischen Wert hinweisen, den ihr einander gebt. Nimm nicht aufgrund einer einzigen Karte an, dass die Person dich materiell ausnutzt. Schau darauf, ob echte Zuneigung, Gegenseitigkeit und Respekt vorhanden sind.'],
  ['love', 'Soll ich sofort gehen, wenn sich die Beziehung sehr praktisch anfühlt?', 'Nicht unbedingt. Manche Beziehungen enthalten praktische Überlegungen neben Gefühlen, und das ist nicht automatisch unehrlich. Entscheidend ist, ob beide verstehen, worauf sie sich einlassen, ob jemand manipuliert wird und ob die Beziehung die echten Bedürfnisse beider erfüllt. Heimliche Nutzung für Status, Geld oder Zugang ist etwas völlig anderes als zwei Erwachsene, die praktische Kompatibilität offen mitbewerten.'],
  ['love', 'Wir streiten. Soll ich mich trennen?', 'Die Drei der Münzen sagt, dass ihr zuerst versuchen solltet, gemeinsam am Problem zu arbeiten. Geld, Wohnen, Heiratspläne, Kinder oder andere praktische Verpflichtungen können die eigentliche Spannung auslösen. Setzt euch zusammen und sprecht unausgesprochene Erwartungen aus. Wenn eine Person jedes ernsthafte Gespräch verweigert, ist auch das eine wichtige Information.'],
  ['career', 'Ich bin seit drei Monaten arbeitslos. Finde ich bald Arbeit?', 'Die Antwort tendiert zu Ja, besonders über Zusammenarbeit oder dein Netzwerk. Die nächste Stelle kann Teamarbeit verlangen, oder die Gelegenheit kommt durch jemanden, der dich kennt. Sag vertrauten Freunden und früheren Kollegen, wonach du suchst, bitte um Kontakte und sei bereit, mit anderen zusammenzuarbeiten, statt die Suche völlig für dich zu behalten.'],
  ['career', 'Worauf sollte ich beruflich bald achten?', 'Teamarbeit wird wahrscheinlich wichtiger. Arbeitest du bisher allein, musst du vielleicht bald stärker koordinieren; bist du schon im Team, bleibt Zusammenarbeit zentral. Ob das angenehm oder herausfordernd ist, hängt von deinem Stil ab, aber die Übung ist klar: kommunizieren, Aufgaben verteilen und gemeinsam etwas aufbauen.'],
  ['other', 'Wie unterscheidet sich diese Karte von der Drei der Kelche und dem Hierophanten?', 'Alle drei können Gruppen zeigen, doch der Zweck ist unterschiedlich. Die Drei der Kelche ist die Gruppe, die feiert und sich trifft. Die Drei der Münzen ist die Gruppe, die an einer konkreten Aufgabe zusammenarbeitet. Der Hierophant hängt stärker mit gemeinsamen Systemen, Lehre, Institutionen und etablierten Traditionen zusammen.']
]
});

Object.assign(ASK.de, {
'wands-4': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Eine einzelne Karte zeigt nur einige Züge, und die Vier der Stäbe ist grundsätzlich günstig. Am deutlichsten ist Beständigkeit: Diese Person hat meist eine stabile emotionale Basis und blickt eher optimistisch auf das Leben.'],
  ['love', 'Welche Gefühle hat diese Person für mich?', 'Die Vier der Stäbe ist eine der stärkeren Karten für ernsthafte Absichten. Die Person sieht dich wahrscheinlich als jemanden, mit dem sie eine echte Partnerschaft aufbauen könnte, und nicht als vorübergehende Ablenkung. Auch wenn Heirat noch nicht unmittelbar ansteht, kann sie Stabilität, gemeinsames Wachstum und gegenseitige Unterstützung wollen. Die andere Seite dieser Beständigkeit: Sie ist vielleicht nicht besonders spontan oder dramatisch. Zieh weitere Karten, wenn du wissen willst, wie romantisch oder abenteuerlustig sie ist.'],
  ['love', 'Wir streiten. Soll ich mich trennen?', 'Die Vier der Stäbe erinnert daran, dass diese Beziehung womöglich mit ernsthaften Absichten aufgebaut wurde. Bevor du endgültig entscheidest, erinnere dich daran, warum ihr euch gewählt habt, und vergleiche diese Grundlage mit dem Muster, das ihr heute lebt. Langfristige Beziehungen brauchen Kompromisse von beiden Seiten. Muss immer einer gewinnen und der andere nachgeben, wird Stabilität schwierig — egal wie stark der Anfang war.'],
  ['career', 'Ich bin schon lange arbeitslos. Finde ich bald Arbeit?', 'Die Antwort tendiert zu Ja. Die Vier der Stäbe kann auf eine Stelle hinweisen, die wirklich Grund zur Freude gibt: etwas, das zu deiner Richtung passt und mehr Stabilität bietet als eine reine Übergangslösung. Bleib dennoch realistisch. Eine Karte kann die Qualität einer Chance beschreiben; ob der Job tatsächlich entsteht, hängt weiterhin von Bewerbungen, Timing und Umständen ab.'],
  ['career', 'Worauf sollte ich beruflich bald achten?', 'Wenn du dich in deiner aktuellen Arbeit bereits gefestigt fühlst, kann diese Stabilität weitergehen. Bei der Vier der Stäbe geht es weniger um eine Veränderung über Nacht als um ein Fundament, das über Zeit entstanden ist und dich weiterhin tragen kann.'],
  ['other', 'Ist es immer schlecht, in der Komfortzone zu bleiben?', 'Nein. Sicherheit und Stabilität sind Dinge, für die Menschen oft lange arbeiten. Die Komfortzone zu verlassen ist sinnvoll, wenn es Wachstum ermöglicht, nicht weil du dich ständig unwohl fühlen musst. Ein gesunder Rhythmus kann so aussehen: erweitern, ausruhen, eine größere sichere Basis genießen und erst wieder nach außen gehen, wenn du bereit bist.']
],
'swords-4': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Die Vier der Schwerter beschreibt einen vorsichtigen und nicht unbedingt faulen Menschen. Die Person denkt lieber nach, betrachtet ein Thema aus mehreren Blickwinkeln und handelt, wenn genug Klarheit da ist. Der Nachteil: Wenn eine Situation wirklich eine schnelle Entscheidung braucht, kann sie zu lange zögern.'],
  ['love', 'Welche Gefühle hat diese Person für mich?', 'Die Person möchte die Beziehung womöglich nicht schnell vorantreiben. Sie hält die Dinge lieber ruhig und unverändert, während sie beobachtet und nachdenkt. Wenn du auf ein Geständnis, einen Antrag oder einen anderen großen Schritt wartest, deutet die Karte darauf hin, dass sie noch nicht bereit ist.'],
  ['love', 'Wir streiten. Soll ich mich trennen?', 'Entscheide nicht mitten im Streit. Eine kurze Pause kann euch helfen, herunterzukommen, nachzudenken und mit klareren Worten zurückzukehren. Der Sinn ist Raum zum Atmen, nicht Schweigen als Strafe oder eine Beziehung, die auf unbestimmte Zeit in der Schwebe bleibt. Vereinbart am besten, wann ihr wieder miteinander sprecht.'],
  ['career', 'Ich bin seit sechs Monaten arbeitslos. Finde ich bald den passenden Job?', 'Die Karte kann auf ein echtes Bedürfnis nach Erholung oder Neuorientierung hinweisen, bevor du noch mehr Druck machst. Vielleicht bewirbst du dich vor allem wegen äußerer Erwartungen, während ein Teil von dir erst Kraft sammeln, etwas lernen, sich engagieren oder ein eigenes Projekt verfolgen möchte. Wenn das stimmt und deine Situation es erlaubt, benenne dieses Bedürfnis ehrlich. Wenn du jetzt Arbeit brauchst, plane trotzdem genug Erholung ein, damit Erschöpfung nicht jede Bewerbung halbherzig macht.'],
  ['career', 'Merken Interviewer, wenn ich eigentlich gar nicht interessiert bin?', 'Oft ja. In Gesprächen geht es nicht nur um Fachwissen. Arbeitgeber bemerken Vorbereitung, Neugier und ob du erklären kannst, warum dich die Stelle interessiert. Du musst keine übertriebene Begeisterung spielen, aber vage Antworten, keine Rückfragen und fehlendes Verständnis für die Rolle lassen Desinteresse schnell sichtbar werden.'],
  ['career', 'Was kann sich beruflich bald verändern?', 'Die Arbeit kann in eine ruhige Phase mit wenig sichtbarer Bewegung eintreten. Das kann angenehm sein, wenn du Routine und Stabilität schätzt, oder frustrierend, wenn du schnelle Entwicklung und neue Herausforderungen möchtest. Die Karte ist nicht an sich gut oder schlecht; entscheidend ist, was du gerade von deiner Arbeit brauchst.']
],
'cups-4': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Die Vier der Kelche kann jemanden beschreiben, dessen Blick gerade eng geworden ist oder der emotional auf Abstand steht. Die Person konzentriert sich womöglich so stark auf das Vertraute, dass sie andere Möglichkeiten kaum bemerkt. Lies das besser als momentane Wahrnehmungsgewohnheit und nicht als dauerhaft fehlende Intuition oder Fantasie.'],
  ['love', 'Welche Gefühle hat diese Person für mich?', 'Eine Vier der Kelche allein reicht nicht, um die Gefühle festzulegen. Sie kann aber jemanden zeigen, der das Angebot vor sich übersieht, weil die Aufmerksamkeit woanders liegt. Vielleicht vergleicht die Person die Gegenwart mit einer früheren Beziehung, anderen Möglichkeiten oder einem unerreichbaren Ideal. Entscheidend ist, ob sie die Verbindung, die tatsächlich da ist, erkennen und wertschätzen kann.'],
  ['love', 'Kann sich diese Situation verändern?', 'Ja. Die Vier der Kelche beschreibt ein Aufmerksamkeitsmuster, und Muster können sich ändern. Ein ehrliches Gespräch kann helfen, etwas wahrzunehmen, das bisher als selbstverständlich galt. Veränderung braucht jedoch Bereitschaft. Du kannst niemanden dazu zwingen, eine Beziehung zu schätzen, wenn die Person sich immer wieder entscheidet, sich nicht darauf einzulassen.'],
  ['love', 'Wir streiten. Soll ich mich trennen?', 'Die Karte fordert einen weiteren Blick. Vielleicht konzentrierst du dich sehr auf einen Fehler oder eine aktuelle Enttäuschung und übersiehst den Rest der Beziehung. Geh einen Schritt zurück und betrachte das ganze Muster: Mühe, Fürsorge und Veränderungen ebenso wie das Problem, das weh tut. Das Gesamtbild zu sehen bedeutet nicht, schweren Schaden zu entschuldigen; es bedeutet, mit vollständigen Informationen zu entscheiden.'],
  ['career', 'Finde ich bald Arbeit?', 'Eine Chance kann näher sein, als du denkst — vielleicht in einer Anzeige, die du immer wieder übergehst, oder durch jemanden, den du bereits kennst. Die Vier der Kelche empfiehlt, zuerst genauer auf das zu schauen, was vor dir liegt, bevor du annimmst, die Antwort müsse weit weg sein.'],
  ['career', 'Was kann sich beruflich bald verändern?', 'Pass auf, dass du keine Chance direkt vor dir verpasst, weil du auf einen anderen Weg fixiert bist. In deinem aktuellen Umfeld kann ein Projekt, eine Fähigkeit oder eine Rolle liegen, die besser zu dir passt, als du bisher bemerkt hast. Die Karte fordert dich auf, reale Möglichkeiten zu sehen, statt nur dem hinterherzulaufen, was aus der Ferne beeindruckend aussieht.'],
  ['other', 'Was soll ich tun, wenn ich meine Richtung nicht selbst finde?', 'Such dir Orientierung. Eine Lehrperson, ein Mentor, eine Beraterin oder ein erfahrener Mensch kann dir Optionen zeigen, die du gerade nicht siehst. Diese Person soll dein Leben nicht für dich wählen, sondern deinen Blick klären, damit du selbst entscheiden kannst.']
],
'pentacles-4': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Die Vier der Münzen kann jemanden beschreiben, der Kontrolle, Besitz oder Sicherheit sehr festhält. Das Problem ist nicht unbedingt echter Mangel, sondern vielleicht die Angst, etwas zu verlieren. Diese Angst kann eine Person bei Geld, Zuneigung oder sogar grundlegenden Bedürfnissen übermäßig einschränken. Vorsicht ist gesund; Sicherheit wird teuer, wenn sie vernünftiges Ausgeben, Teilen oder Selbstfürsorge verhindert.'],
  ['love', 'Welche Gefühle hat diese Person für mich?', 'Gefühle können vorhanden sein, kommen aber mit Vorsicht. Vielleicht versucht die Person, die Beziehung zu kontrollieren, oder sie hält sich zurück, weil sie Angst vor Verletzung hat. Zieh weitere Karten und achte vor allem auf ihr echtes Verhalten, um den Unterschied zu erkennen.'],
  ['love', 'Wir streiten oft. Wie können wir die Beziehung verbessern?', 'Kontrolle kann im Zentrum des Konflikts stehen. Einer oder beide versuchen vielleicht zu bestimmen, wie der andere sich kleidet, spricht, verhält oder seine Zeit verbringt. Verbesserung beginnt damit, unnötige Kontrolle zu lockern und eine gesunde Grenze von dem Versuch zu unterscheiden, einen erwachsenen Menschen zu steuern. Liebe braucht Raum, damit der andere er selbst bleiben kann.'],
  ['love', 'Was kann diese Karte in Beziehungen noch bedeuten?', 'Die Vier der Münzen kann auch das Festhalten an der Vergangenheit zeigen. Vielleicht hast du keinen Kontakt mehr zu einer früheren Liebe und bewahrst trotzdem eine idealisierte Version dieser Person im Kopf. Jahre später hat dieses Bild womöglich kaum noch etwas mit dem Menschen zu tun, der sie heute ist. Loslassen kann heißen, die Vorstellung freizugeben, ohne zu leugnen, dass die Beziehung einmal Bedeutung hatte.'],
  ['career', 'Finde ich bald den Job, den ich möchte?', 'Die Antwort kann sich verzögern, teilweise weil du jedes Detail gleichzeitig kontrollieren möchtest: Zeitpunkt, Gehalt, Titel und Gefühl der Stelle. Standards sind gut, aber starre Erwartungen können die Suche erschweren. Schau, was du aus vergangenen Gesprächen verbessern kannst, und akzeptiere, dass manche sinnvollen Schritte — etwa ein Abschluss oder Zertifikat — einfach Zeit brauchen.'],
  ['career', 'Worauf sollte ich in den nächsten drei Monaten beruflich achten?', 'Achte darauf, Rolle, Wissen oder Erfahrung nicht zu fest zu verteidigen. Vielleicht willst du einen neuen Kollegen ungern einarbeiten oder Wissen teilen, weil du Angst hast, dadurch weniger wertvoll zu werden. Berufliche Sicherheit entsteht gesünder dadurch, dass du selbst weiterlernst, statt andere von Informationen abhängig zu machen, die du zurückhältst.'],
  ['other', 'Warum sollte ich loslassen?', 'Die Lehre der Vier der Münzen lautet nicht, alles Wertvolle wegzuwerfen. Sie fordert dich auf zu erkennen, was du nur aus Angst festhältst. Manchmal dient dir ein Plan, eine Rolle, ein Besitz oder eine alte Geschichte nicht mehr, und das Festhalten lässt keinen Platz für Neues. Loslassen ist hilfreich, wenn es Flexibilität schafft — nicht wenn es zu einer weiteren Regel wird, die du dir aufzwingst.']
]
});

Object.assign(ASK.de, {
'wands-5': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Die Fünf der Stäbe kann zwei Muster beschreiben. Das eine ist spielerische oder provozierende Diskussion: jemand neckt, widerspricht und fordert Ideen heraus, ohne unbedingt verletzen zu wollen. Das andere ist innerer Konflikt: Die Person möchte etwas und zieht sich im nächsten Moment selbst in die Gegenrichtung. In beiden Fällen ist Reibung das Hauptthema.'],
  ['love', 'Ist jemand, der gern diskutiert, ein schlechter Mensch?', 'Nicht unbedingt. Es ist ein Unterschied, ob jemand diskutiert, um andere kleinzumachen, oder eine Idee hinterfragt, weil sie logisch geprüft werden soll. Konstruktive Debatte kann dein Denken schärfen, solange beide respektvoll bleiben. Sobald es nur noch ums Gewinnen, Herabsetzen oder Provozieren geht, verliert dieselbe Gewohnheit ihren Wert.'],
  ['love', 'Welche Gefühle hat diese Person für mich?', 'Gefühle können da sein, doch die Person wirkt innerlich zerrissen. Ein Teil zieht zu dir hin, ein anderer hält sich zurück. Eine Karte zeigt den Grund nicht vollständig. Zieh weitere, wenn du verstehen möchtest, womit sie ringt.'],
  ['love', 'Wir streiten. Soll ich mich trennen?', 'Überstürze keine Trennung, bevor das eigentliche Thema benannt ist. Ihr streitet vielleicht über Kleinigkeiten, während darunter eine größere Unsicherheit liegt — Angst um die Beziehung, Verlustangst oder ein Verdacht, der nie offen ausgesprochen wurde. Die Fünf der Stäbe fordert Ehrlichkeit. Sag, wovor du wirklich Angst hast, statt nur über die Oberfläche zu kämpfen.'],
  ['career', 'Finde ich bald den Job, den ich möchte?', 'Die Suche kann durch einen inneren Richtungskonflikt gebremst werden. Vielleicht möchtest du eigentlich in ein bestimmtes Feld, bewirbst dich aber wegen Familie, Abschluss oder Angst weiterhin in einem anderen. Kläre zuerst, welche Richtung du wirklich im Alltag testen willst. Wenn Einsatz und Ziel in dieselbe Richtung zeigen, wird auch die Suche klarer.'],
  ['career', 'Worauf sollte ich beruflich bald achten?', 'Ein kleiner Konflikt mit einem Kollegen kann auftauchen. Die Fünf der Stäbe ist meist gut handhabbar, doch ein kleines Missverständnis kann wachsen, wenn man ungeschickt damit umgeht. Bleib direkt, ohne persönlich zu werden, kläre Dinge früh und lass Konkurrenz nicht zu einem Groll werden.'],
  ['other', 'Warum sagt man, dass sich die Zukunft im Tarot verändern kann?', 'Tarot eignet sich besser als Bild aktueller Muster und Möglichkeiten als als festgeschriebenes Drehbuch. Wenn Verhalten, Umstände oder Entscheidungen sich ändern, kann sich auch ein wahrscheinlicher Ausgang verändern. Manche Dinge liegen außerhalb deiner Kontrolle. Es geht also nicht darum, jede gewünschte Zukunft erzwingen zu können, sondern darum, in einer Legung Raum für Handlungsmöglichkeiten zu lassen.']
],
'swords-5': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Die Fünf der Schwerter kann jemanden beschreiben, der Gespräche in Wettkämpfe verwandelt. Die Person will jeden Wortwechsel gewinnen, obwohl dieser Sieg oft nichts bringt außer einem kurzen Ego-Schub. Recht zu haben ist nicht dasselbe wie gut zu kommunizieren.'],
  ['love', 'Welche Gefühle hat diese Person für mich?', 'Eine Fünf der Schwerter allein beantwortet die Gefühlsfrage nicht vollständig. Gefühle können echt sein, während die Art zu kommunizieren dich trotzdem verletzt oder frustriert. Manche Menschen kümmern sich sehr und sprechen dennoch befehlend, abwertend oder kämpferisch. Verwechsle Zuneigung nicht mit gesunder Kommunikation; beides zählt.'],
  ['love', 'Wir streiten. Soll ich mich trennen?', 'Das Hauptproblem ist, wie ihr Worte benutzt, wenn ihr wütend seid. Werden normale Unterschiede zu Gelegenheiten für Beleidigungen, Punktegewinne oder alte Verletzungen, solltet ihr zuerst dieses Kommunikationsmuster bearbeiten. Eine Trennung ist nicht automatisch die erste Antwort, aber wiederholte Verachtung, Erniedrigung oder verbale Gewalt sollte ernst genommen und nicht als „nur Streit“ abgetan werden.'],
  ['career', 'Ich bin seit ein paar Monaten arbeitslos. Finde ich bald Arbeit?', 'Die Karte gibt kein klares Ja oder Nein. Vielleicht weist sie eher auf eine entmutigende Stimme in deinem Umfeld hin — jemanden, der dir ständig sagt, du seist unfähig oder alte Misserfolge wiederholt. Achte darauf, wessen Meinung dein Selbstvertrauen prägt. Hilfreiches Feedback ist konkret und hilft dir besser zu werden; ständiges Herabsetzen ist etwas anderes.'],
  ['career', 'Worauf sollte ich beruflich bald achten?', 'Achte darauf, wie Worte am Arbeitsplatz verwendet werden. Vielleicht wirst du respektlos behandelt, oder du selbst sprichst unter Druck zu scharf mit anderen. Überschreitet jemand eine berufliche Grenze, antworte ruhig, dokumentiere ernsthafte Vorfälle und nutze passende betriebliche Wege, statt anzunehmen, du müsstest alles einfach hinnehmen.'],
  ['other', 'Was sagt diese Karte über Streit im Internet?', 'Die Fünf der Schwerter passt zu vielen Online-Streits: lange Antworten an Fremde, das Bedürfnis nach dem letzten Wort und die Vorstellung, Schweigen bedeute Niederlage. Die meisten dieser „Siege“ verändern nichts Wichtiges. Jemand hört vielleicht auf zu antworten, weil er beschäftigt, gelangweilt oder einfach fertig mit der Diskussion ist. Unterschiedliche Meinungen dürfen existieren, und nicht jeder Streit verdient deine Zeit.'],
  ['other', 'Was bedeutet „Karma der Sprache“?', 'In manchen buddhistischen und volkstümlichen Traditionen bezeichnet „Karma der Sprache“ die Folgen, die durch unseren Umgang mit Worten entstehen. Die spirituelle Vorstellung lautet, dass Sprache, die erniedrigt, täuscht oder verletzt, moralische Konsequenzen hat. Auch ohne Karma wörtlich zu verstehen, bleibt die praktische Lehre sinnvoll: Worte prägen Vertrauen, Beziehungen und das Umfeld, das du um dich herum schaffst. Halt kurz inne, bevor du etwas sagst, das nur verletzen soll.']
],
'cups-5': [
  ['other', 'Ist diese Karte positiv oder negativ?', 'Die Fünf der Kelche funktioniert besser als Rat denn als einfach gutes oder schlechtes Ereignis. Ihre Themen sind Enttäuschung, Verlust und Trauer, doch im Bild bleibt auch etwas erhalten. Die wichtige Frage ist, ob die Person vom Verlust dauerhaft bestimmt wird oder sich irgendwann wieder dem zuwendet, was noch da ist.'],
  ['other', 'Warum werden Rückschläge der Kleinen Arkana meist leichter gelesen?', 'Als Deutungskonvention beschreiben die Kleinen Arkana häufig alltäglichere und veränderbarere Umstände, während die Großen Arkana eher größere Themen oder Wendepunkte markieren. Das bedeutet nicht, dass eine Karte der Kleinen Arkana niemals neben einem ernsten realen Ereignis auftauchen kann. Die tatsächliche Situation ist immer wichtiger als eine Rangordnung des Decks.'],
  ['love', 'Ich habe gerade eine Niederlage oder Trennung erlebt. Wie soll ich damit umgehen?', 'Das Bild trägt die Lehre bereits in sich: Die Figur schaut auf die verschütteten Kelche, während zwei hinter ihr noch stehen. Trauer darf gefühlt werden, und du musst dich nicht sofort zu Optimismus zwingen. Wenn du bereit bist, frag auch, was geblieben ist — Beziehungen, Fähigkeiten, Erfahrungen, Werte und zukünftige Entscheidungen. Weiterzugehen löscht den Verlust nicht aus; es macht ihn zu einem Teil der Geschichte statt zur ganzen Geschichte.'],
  ['love', 'Wie wende ich diese Lehre nach einer Trennung an?', 'Nach einer Trennung können Gedanken wie „Ich bin nicht liebenswert“ oder „Ich werde nie wieder lieben“ sehr überzeugend wirken, obwohl sie keine Tatsachen sind. Die Fünf der Kelche fordert dich auf, den Schmerz dieses Endes von deiner gesamten Zukunft zu trennen. Mit der Zeit kannst du erkennen, welche Beziehung nicht zu dir passt, was du anders machen möchtest und was du über deine eigenen Bedürfnisse gelernt hast.']
],
'pentacles-5': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Die Fünf der Münzen kann jemanden beschreiben, der ein tiefes Gefühl von Mangel oder Nicht-genug-Sein trägt. Dieses Gefühl kann mit schwieriger Kindheit, Ausgrenzung oder Instabilität zusammenhängen, doch eine Karte allein bestimmt seinen Ursprung nicht. Selbst wenn sich die äußeren Umstände verbessern, kann alte Unsicherheit das Verhalten weiter prägen, bis die Person sie erkennt und bearbeitet.'],
  ['love', 'Welche Gefühle hat diese Person für mich?', 'Die Karte kann auf emotionales Mangelgefühl hinweisen: Jemand möchte Nähe, hat aber Angst, dass Liebe nie ausreicht oder Öffnung wieder zu Verlassenwerden führt. Gefühle können vorhanden sein, während Geben und Annehmen von Zuneigung schwerfallen. Diese Geschichte kann ein Muster erklären, entschuldigt aber kein verletzendes Verhalten; Heilung bleibt die Verantwortung der Person.'],
  ['love', 'Sollte ich mit jemandem eine Beziehung beginnen, der diese Energie trägt?', 'Entscheide das nicht anhand der Karte allein. Frag, ob die Person ihre Schwierigkeiten erkennt, Verantwortung übernimmt und trotzdem Respekt, Verlässlichkeit und emotionale Sicherheit bieten kann. Jeder Mensch hat Wunden. Entscheidend ist nicht Unvollkommenheit, sondern ob ungelöste Muster die Beziehung wiederholt verletzen und die Person sich weigert, daran zu arbeiten.'],
  ['love', 'Kann ich diese Person heilen?', 'Du kannst jemanden unterstützen, aber du kannst seine Heilung nicht für ihn erledigen. Du musst weder Retter noch Therapeutin oder Beweis für seine Liebenswürdigkeit werden. Ermutige passende Unterstützung, kommuniziere deine Grenzen und denk daran, dass die Person ihre Arbeit selbst wählen muss. Dasselbe gilt für dich: Andere können dich begleiten, aber deine innere Arbeit nicht übernehmen.'],
  ['love', 'Wir streiten ständig. Soll ich diese Beziehung fortsetzen?', 'Wenn sich nichts verändert, wird dasselbe Muster wahrscheinlich dieselben Streitigkeiten hervorbringen. Frag dich, was dir fehlt und warum du dich immer wieder nicht erfüllt fühlst, und lade die andere Person in dasselbe Gespräch ein. Klare Worte sind freundlicher, als jemanden raten zu lassen und ihn später mit Schweigen zu bestrafen. Ob die Beziehung weitergeht, sollte davon abhängen, was passiert, nachdem beide das Problem verstanden haben.'],
  ['career', 'Finde ich bald den Job, den ich möchte?', 'Die Karte deutet auf eine finanziell engere Phase oder auf eine Gelegenheit hin, die weniger zahlt als erhofft. Nimm das als Anlass, Ausgaben zu prüfen, deine Suche zu stärken und realistische Alternativen bereitzuhalten — nicht als garantierte Vorhersage einer finanziellen Krise.'],
  ['career', 'Worauf sollte ich beruflich bald achten?', 'Achte auf Cashflow und Zahlungsfristen. Gehalt, Rechnungen, Projektzahlungen oder Budgets könnten knapper oder langsamer sein als erwartet. Prüf die Fakten früh und plane mit bestätigten Zahlen statt mit Annahmen.'],
  ['other', 'Wie kann ich meine Reaktion kontrollieren?', 'Du kannst nicht alles kontrollieren, was andere tun, und das erste Gefühl entsteht oft automatisch. Beeinflussen kannst du, was danach passiert: welche Worte du wählst, was du tust und ob du dir vor der Reaktion ein paar Sekunden gibst. Wenn Ärger hochkommt, halt kurz inne und frag dich, welches Ergebnis du eigentlich willst, bevor du sprichst.']
]
});

Object.assign(ASK.de, {
'wands-6': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Die Sechs der Stäbe kann jemanden beschreiben, der stolz auf Erreichtes ist und manchmal etwas selbstzufrieden wirkt. Die umliegenden Karten sind wichtig. Zusammen mit einer starken Karte wie Der Sonne kann das Selbstvertrauen gut begründet sein: Die Person ist fähig, setzt sich Ziele und erreicht sie tatsächlich. Gesunder Stolz feiert Leistung; die Schattenseite beginnt, wenn Anerkennung ständig von anderen kommen muss.'],
  ['love', 'Welche Gefühle hat diese Person für mich?', 'Diese Karte ist kein besonders klares Zeichen für emotionale Aufrichtigkeit. Die Person kann das Gefühl genießen, deine Aufmerksamkeit zu gewinnen oder bewundert zu werden. Das beweist nicht, dass die Gefühle unecht sind, aber frag dich, ob sie an dir als Mensch interessiert ist oder vor allem an der Bestätigung, gewählt zu werden. Zieh weitere Karten und beobachte, was passiert, wenn die „Eroberung“ vorbei ist.'],
  ['love', 'Wir streiten. Soll ich mich trennen?', 'Die Sechs der Stäbe deutet darauf hin, dass Ego in den Konflikt geraten ist. Streit kann zu einem Wettkampf werden, bei dem jeder Punkte zählt, das letzte Wort braucht oder niemals nachgeben will. Bevor du an Trennung denkst, frag dich, ob du gerade die Beziehung oder deinen Stolz verteidigst. Wenn beide aufhören können zu gewinnen und zum eigentlichen Problem zurückkehren, kann sich die Dynamik verändern.'],
  ['career', 'Ich bin arbeitslos. Finde ich bald eine Stelle?', 'Die Antwort tendiert zu Ja, mit einer Erinnerung: Den Job zu bekommen ist der Anfang und nicht die Ziellinie. Früher Erfolg kann in Nachlässigkeit kippen, wenn du nicht weiterlernst oder die Stelle für dauerhaft sicher hältst. Entwickle dich auch nach der Einstellung weiter, damit aus der Chance Stabilität wird und nicht nur ein kurzer Sieg.'],
  ['career', 'Worauf sollte ich beruflich bald achten?', 'Du kannst Anerkennung für ein gelungenes Projekt bekommen oder eine kleine Führungsaufgabe übernehmen. Freu dich über den Erfolg, aber sieh ihn als Schritt und nicht als Beweis, dass du nichts mehr lernen musst. Mehr Sichtbarkeit bringt meist auch mehr Verantwortung.'],
  ['other', 'Wie unterscheidet sich dieser Sieg vom Wagen und von der Sonne?', 'Als Deutungskonvention ist die Sechs der Stäbe eher ein kleinerer Meilenstein. Der Wagen kann Erfolg durch Disziplin, Antrieb und Opfer beschreiben, während Die Sonne für ein umfassenderes Gefühl von Erfolg und Klarheit steht. Denk bei der Sechs der Stäbe an ein starkes Ergebnis in einer Probeprüfung: Es darf gefeiert werden, ist aber noch nicht das Ende der ganzen Reise.'],
  ['other', 'Wenn zwei Karten dasselbe Stichwort haben, welche ist stärker?', 'Eine verbreitete Tarot-Konvention gibt den Großen Arkana mehr übergeordnetes Gewicht als den Kleinen Arkana, während höhere Zahlen innerhalb der Kleinen Arkana weiter entwickelte Themen zeigen können. Behandle das als Leserahmen und nicht als Gesetz. Kontext, Kartenposition und reale Situation bleiben entscheidend.']
],
'swords-6': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Die Sechs der Schwerter sagt mehr darüber, was jemand gerade durchmacht, als über die gesamte Persönlichkeit. Die Person hat vielleicht selbst eine Beziehung, einen Job oder eine schwierige Situation verlassen und trägt emotional noch viel davon mit. Zieh weitere Karten, um zu sehen, ob sie sich bereits erholt oder noch stark in dieser Schwere steckt.'],
  ['love', 'Welche Gefühle hat diese Person für mich?', 'Die Person kann sich gerade von der Verbindung entfernen. Vielleicht erlebt sie die Beziehung als zu schmerzhaft oder erschöpfend und möchte Abstand. Eine Karte allein sagt nicht, ob dieser Abstand vorübergehend, endgültig oder für euch beide richtig ist. Schau auf die umliegenden Karten und vor allem auf das tatsächliche Gespräch zwischen euch.'],
  ['love', 'Was soll ich tun, wenn wir ständig streiten?', 'Die Sechs der Schwerter kann Abstand von einer Beziehung empfehlen, die immer wieder schmerzhaft geworden ist. Das muss nicht automatisch eine sofortige endgültige Trennung sein; es kann bedeuten, aus dem Konflikt herauszugehen, bis du klar entscheiden kannst. Bei Missbrauch, Drohungen oder Angst sollte Sicherheit und Unterstützung von außen Vorrang haben, statt eine Trennung wie ein Tarot-Experiment zu behandeln.'],
  ['love', 'Was ist, wenn ich gehe und später wieder zurückkomme?', 'Nach dem Gehen zu etwas Vertrautem zurückzukehren ist häufig, besonders wenn Einsamkeit oder Unsicherheit schwerer wirken als das alte Muster. Bevor du zurückgehst, erinnere dich daran, warum du gegangen bist, und frag, was sich tatsächlich verändert hat. Vertrautheit ist nicht dasselbe wie Sicherheit oder Passung. Wenn du zurückkehrst, dann möglichst wegen echter Veränderung und nicht nur, weil das Unbekannte Angst macht.'],
  ['career', 'Ich bin seit ein paar Monaten arbeitslos. Finde ich den Job, den ich möchte?', 'Die Sechs der Schwerter fordert dich auf, die Richtung zu prüfen, zu der du immer wieder zurückkehrst. Vielleicht bewirbst du dich nur in einem vertrauten Feld, das nicht mehr passt, oder jagst einer glänzenden Alternative nach, die nicht zu deinen echten Stärken passt. Die Karte empfiehlt einen überlegten Übergang: Was lässt du zurück, wohin gehst du, und welche Hinweise zeigen, dass die neue Richtung besser zu dir passt?'],
  ['career', 'Was kann sich beruflich bald verändern?', 'Du bereitest dich vielleicht darauf vor, eine Stelle, ein Team oder einen Ort zu verlassen, auch wenn noch nichts Dramatisches passiert ist. Ein leises, anhaltendes Gefühl von Nicht-Passen kann bereits Aufmerksamkeit verdienen. Du musst nicht auf eine Krise warten, um Veränderung zu rechtfertigen. Erkunde Optionen, schütze deine Finanzen und geh bewusst, statt dich endlos zum Aushalten zu zwingen.']
],
'cups-6': [
  ['other', 'Bedeutet diese Karte „der Ex kommt zurück“?', 'Im traditionellen Tarot ist keine einzelne Karte fest als „der Ex kommt zurück“ definiert. Manche Reader verwenden die Sechs der Kelche als persönliche Konvention dafür, und eigene Zuordnungen können sinnvoll sein, wenn sie konsequent geprüft werden. Beginne mit den breiteren Themen — Erinnerung, Vertrautheit, Unschuld und Vergangenheit — und lass den Kontext entscheiden, ob eine tatsächliche Rückkehr relevant ist.'],
  ['other', 'Was ist dann die eigentliche Kernbedeutung dieser Karte?', 'Die Sechs der Kelche steht im Kern für Zärtlichkeit, Vertrautheit und eine einfache, aufrichtige Art von Zuneigung. Sie kann mit der Vergangenheit verbunden sein, muss aber nicht bedeuten, die Vergangenheit unverändert zu wiederholen. Kehrt eine alte Beziehung zurück, würde eine gesunde Deutung fragen, ob beide sich als veränderte Menschen neu begegnen können, statt dieselben alten Wunden wieder aufzubauen.'],
  ['other', 'Ist eine Legung zuverlässig, wenn ich für mich selbst lese?', 'Selbstlegungen können hilfreich sein, doch Voreingenommenheit wird stärker, wenn du emotional sehr beteiligt bist. Wenn du dir verzweifelt wünschst, dass ein Ex zurückkommt, kann fast jede Karte wie eine Bestätigung aussehen. Halte Bedeutungen breit, schreib die Frage vor dem Ziehen auf und warte bei sehr aufgeladenen Themen eventuell, bis du ruhiger bist, oder bitte jemand anderen um eine zweite Sicht.'],
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Die Sechs der Kelche beschreibt jemanden, der sanft, aufrichtig und im besten Sinn ein wenig unschuldig ist. Die Zuneigung kann unkompliziert und frei von offensichtlicher Berechnung wirken. Vielleicht erinnert die Person an erste Liebe oder bringt eine weichere, jüngere Seite in dir hervor.'],
  ['love', 'Wir streiten. Soll ich mich trennen?', 'Statt sofort zu beenden, fragt die Sechs der Kelche, ob die Beziehung Erneuerung braucht. Langjährige Paare verlieren manchmal kleine Gesten, Verspieltheit und Aufmerksamkeit, die sie früher verbunden haben. Greift etwas auf, das ihr früher gern zusammen gemacht habt, bringt bewusst etwas Romantik zurück und schaut, ob Wärme wiederkommt. Ist die Beziehung schädlich, sollte Nostalgie jedoch nichts entschuldigen.'],
  ['career', 'Finde ich bald einen Job, der mir gefällt?', 'Die Antwort tendiert zu Ja, besonders zu Arbeit, die dir wirklich Freude macht. Kelche beschreiben emotionale Erfüllung klarer als Geld, Status oder Aufstieg. Zieh weitere Karten, wenn diese praktischen Details wichtig sind. Eine Arbeit zu lieben und gut bezahlt zu werden kann zusammengehen, aber das eine garantiert nicht automatisch das andere.'],
  ['career', 'Was kann sich beruflich bald verändern?', 'Du scheinst weiterhin echte Freude an deiner aktuellen Arbeit zu haben, und dieses Gefühl kann anhalten. Die Sechs der Kelche kann die einfache Freude beschreiben, etwas zu tun, weil die Tätigkeit selbst dir noch immer Sinn oder Spaß gibt.']
],
'pentacles-6': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Die Sechs der Münzen beschreibt jemanden, der beim Geben und Nehmen praktisch denkt. Die Person hilft meist gern, achtet aber auch auf Balance, Ressourcen und darauf, ob Unterstützung nachhaltig ist. Manche empfinden das als berechnend, doch grenzenlose Großzügigkeit kann den Gebenden und Menschen, die von ihm abhängen, ebenfalls schaden. Die gesunde Form ist maßvolle Großzügigkeit statt Horten oder Alles-verschenken.'],
  ['love', 'Welche Gefühle hat diese Person für mich?', 'Die Person kann sich um dich kümmern und gleichzeitig bewusst auf Gegenseitigkeit achten. Sie möchte Aufmerksamkeit, Respekt und Einsatz in beide Richtungen fließen sehen. Das ist nicht automatisch egoistisch oder geschäftsmäßig. Problematisch wird es erst, wenn Zuneigung benutzt wird, um Einfluss, Status oder Kontrolle zu kaufen. Schau, ob der Austausch freiwillig und gegenseitig ist.'],
  ['love', 'Wir streiten. Soll ich mich trennen?', 'Bevor du entscheidest, fordert die Sechs der Münzen eine faire Betrachtung der ganzen Beziehung. Lass nicht eine kleine Irritation ein langes Muster von Fürsorge auslöschen, aber lass auch Geschenke oder gute Momente schweren Schaden nicht verdecken. Wiege ehrlich ab und achte auf Verhältnismäßigkeit.'],
  ['love', 'Und wenn die Beziehung wirklich toxisch oder gewalttätig ist?', 'Dann ist die Bilanz nicht unklar. Geschenke, Entschuldigungen oder liebevolle Phasen heben Gewalt, Zwang, Drohungen oder schwere seelische Verletzungen nicht auf. Wenn du misshandelt wirst oder dich unsicher fühlst, hat Sicherheit Vorrang und du solltest Unterstützung suchen. Du schuldest niemandem dauerhaften Zugang zu dir, nur weil die Person auch nette Dinge getan hat.'],
  ['career', 'Ich bin seit ein paar Monaten arbeitslos. Finde ich bald Arbeit?', 'Die Antwort tendiert zu Ja, möglicherweise durch Hilfe, eine Empfehlung oder eine Vorstellung über jemand anderen. Unterstützung anzunehmen ist in Ordnung. Erwartet die Person später eine vernünftige Gegenleistung, kannst du dann entscheiden, was angemessen ist. Hilfe sollte keine unbegrenzte Schuld erzeugen und dich nicht zu etwas Unethischem drängen.'],
  ['career', 'Worauf sollte ich beruflich bald achten?', 'Du kannst Hilfe, Zugang oder eine Chance über jemand anderen bekommen. Kläre Erwartungen. Berufliche Gegenseitigkeit ist normal, aber Unterstützung sollte keine Geheimhaltung, unethischen Gefallen oder Verpflichtungen verlangen, denen du nie zugestimmt hast.']
]
});

Object.assign(ASK.de, {
'wands-7': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Die Sieben der Stäbe kann jemanden beschreiben, der oft in Abwehrhaltung ist. Die Person fühlt sich vielleicht schnell beobachtet, beurteilt oder gezwungen, sich zu schützen, und reagiert manchmal stark, bevor sie die Absicht des anderen wirklich verstanden hat. In der Schattenseite entstehen daraus unnötige Streitigkeiten und viel Energie für Kämpfe, die gar nicht nötig wären.'],
  ['love', 'Welche Gefühle hat diese Person für mich?', 'Diese Karte zeigt nicht klar, wie stark die Gefühle für dich sind. Sie sagt mehr über den aktuellen Zustand der Person: angespannt, defensiv oder mit Verletzungen beschäftigt, die noch nicht verarbeitet sind. Entscheidend ist nicht, ob jemand Wunden hat, sondern ob er sie erkennt und Verantwortung für sein Verhalten übernimmt. Du bist nicht dafür verantwortlich, jemanden für ihn selbst zu heilen.'],
  ['love', 'Wir streiten. Soll ich mich trennen?', 'Die Konflikte dieser Karte entstehen oft aus kleinen Dingen, die zu wiederkehrenden Kämpfen werden: späte Antworten, verpasste Anrufe, unterschiedliche Erwartungen oder Forderungen nach Veränderung, ohne das eigene Verhalten anzuschauen. Die Karte rät nicht automatisch zur Trennung. Verändere zuerst den Teil, für den du wirklich verantwortlich bist, und beobachte dann, ob die andere Person das sieht, wertschätzt und dir entgegenkommt. Bleibt alles einseitig, hast du eine klarere Grundlage für deine Entscheidung.'],
  ['career', 'Finde ich bald einen Job?', 'Die Sieben der Stäbe lenkt den Blick darauf, wie du Zeit und Energie einsetzt. Vielleicht steckst du Kraft in Dinge, die die Suche kaum voranbringen, oder bewirbst dich in Richtungen, die nicht gut zu dir passen. Deine Ressourcen sind begrenzt: Bündele Bewerbungen, verbessere Schwachstellen und reserviere Zeit für Schritte, die deine Chancen tatsächlich erhöhen.'],
  ['career', 'Was kann beruflich bald neu sein?', 'Es kann Spannungen, Gerede oder Büropolitik geben, und jemand versucht vielleicht, dich hineinzuziehen. Du entscheidest trotzdem selbst, ob du mitmachst. Schütze deine Energie, kommuniziere professionell und konzentriere dich auf die Arbeit, statt aus jedem Kommentar einen Kampf zu machen.'],
  ['other', 'Gegen wen soll ich also kämpfen?', 'Diese Karte verlangt nicht, dass du gegen alle um dich herum kämpfst. Oft ist es hilfreicher, die eigenen Abwehrmuster, Annahmen und wiederkehrenden Konflikte zu erkennen. Wenn dieselbe Art von Problem dich von Arbeitsplatz zu Arbeitsplatz oder Beziehung zu Beziehung begleitet, löst ein Ortswechsel allein es vielleicht nicht. Frag, was du selbst verändern kannst, und behalte zugleich klare Grenzen gegenüber wirklich schädlichem Verhalten.']
],
'swords-7': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Die Sieben der Schwerter weist oft auf Heimlichkeit, Vermeidung oder Verhalten hin, das nicht völlig transparent ist. In der Schattenseite kann jemand Informationen zurückhalten, etwas anderes sagen als tun oder Umwege wählen, statt direkt zu sprechen. Die Karte bedeutet nicht automatisch Betrug oder Untreue; Kontext und umliegende Karten sind wichtig.'],
  ['love', 'Welche Gefühle hat diese Person für mich?', 'Bei der Sieben der Schwerter sollte diese Frage eher in der Realität überprüft als aus Verdacht beantwortet werden. Die Person hält vielleicht einen Teil der Geschichte zurück, ist über ihre Situation unklar oder noch nicht bereit, völlig offen zu sein. Das bedeutet nicht automatisch, dass es eine dritte Person gibt. Wenn die Lage vage ist, frag direkt nach dem Beziehungsstatus und achte darauf, ob Worte und Handlungen zusammenpassen.'],
  ['love', 'Wir streiten oft. Soll ich mich trennen?', 'Die Sieben der Schwerter deutet darauf hin, dass etwas Wichtiges nicht offen ausgesprochen wird. Das kann eine andere Person sein, Einfluss von Freunden oder Familie oder schlicht das Vermeiden eines ehrlichen Gesprächs. Bevor du entscheidest, finde heraus, was tatsächlich passiert, statt aus Andeutungen eine Antwort zu bauen. Werden Heimlichkeit, Lügen oder Manipulation bestätigt und ändern sich nicht, ist das ein reales Beziehungsproblem und nicht nur ein Tarot-Symbol.'],
  ['career', 'Ich bin schon lange arbeitslos. Finde ich bald einen neuen Job?', 'Die Karte deutet auf einen verborgenen Faktor hin, der deine Jobsuche weniger wirksam macht. Das können entmutigende Stimmen anderer, eine ungeeignete Strategie oder ein Schritt sein, den du selbst vermeidest. Prüfe Lebenslauf, Bewerbungen, Vorstellungsgespräche und die Überzeugungen, die dein Selbstvertrauen beeinflussen, bevor du annimmst, jemand halte dich absichtlich zurück.'],
  ['career', 'Passiert beruflich bald etwas Schwieriges?', 'Die Sieben der Schwerter kann vor mangelnder Transparenz warnen: Gerede, zurückgehaltene Informationen oder unfairer Wettbewerb. Nimm das als Anlass, aufmerksam zu bleiben, nicht als Vorhersage eines Verrats. Dokumentiere wichtige Arbeit, kommuniziere klar und stütze dich auf Fakten, bevor du jemandem schlechte Absichten unterstellst.'],
  ['other', 'Was bedeutet emotionale Manipulation?', 'Emotionale Manipulation bedeutet, Gedanken, Gefühle oder Entscheidungen eines anderen Menschen zum eigenen Vorteil beeinflussen zu wollen, oft durch versteckte Absichten, Schuldgefühle, Verdrehungen oder Druck. Manipulative Menschen haben nicht automatisch eine hohe emotionale Intelligenz; manche sind lediglich gut darin, Reaktionen zu lesen. Ein Warnzeichen ist, wenn du dich wiederholt gedrängt fühlst, an deiner eigenen Wahrnehmung zweifelst oder für ein Nein emotional bestraft wirst.']
],
'cups-7': [
  ['other', 'Was ist die Kernbedeutung dieser Karte?', 'Die Sieben der Kelche steht für viele Möglichkeiten, ohne dass eine davon wirklich zufriedenstellt. Das Bild unterstützt diese Bedeutung: Mehrere Kelche erscheinen in einer Wolke, aber nicht jede Option ist greifbar, sinnvoll oder überhaupt realistisch. Die Karte fordert dich auf, Fantasie von Entscheidungen zu trennen, mit denen du tatsächlich leben würdest.'],
  ['other', 'Wie unterscheidet sich diese Karte von den Liebenden und der Zwei der Schwerter?', 'Alle drei können Unsicherheit zeigen, aber aus unterschiedlichen Gründen. Die Liebenden können eine bedeutende Wahl zwischen Werten oder Wegen darstellen. Die Zwei der Schwerter zeigt Zögern, weil eine Entscheidung blockiert oder schwierig wirkt. Die Sieben der Kelche ist Überforderung durch zu viele Optionen, Vorstellungen oder Möglichkeiten, ohne klare Präferenz.'],
  ['other', 'Kannst du ein leicht merkbares Beispiel geben?', 'Stell dir jemanden vor, der ein Studienfach wählen muss. Mehrere Wege stehen offen, aber keiner fühlt sich wirklich wie der eigene an: Einer gefällt der Familie, einer wirkt praktisch und einer passt zu einem alten Hobby, das nicht zum Beruf werden soll. Viele Türen sind offen, doch keine überzeugt. Das ist die Sieben der Kelche: Möglichkeiten sind nicht dasselbe wie Klarheit.'],
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Diese Karte kann jemanden beschreiben, der sich schwer entscheidet und zu viele Möglichkeiten zu lange offenhält. Vielleicht lässt die Person andere entscheiden, weil eine eigene Festlegung riskant wirkt. Rat anzunehmen ist nicht das Problem; problematisch wird es, nach der Entscheidung eines anderen zu leben und sie später übelzunehmen. Die Lektion lautet, bewusst zu wählen und Verantwortung für die Wahl zu übernehmen.'],
  ['love', 'Welche Gefühle hat diese Person für mich?', 'Die Sieben der Kelche zeigt eher Unklarheit als feste Bindung. Die Person erkundet vielleicht noch, was sie will, idealisiert Möglichkeiten oder hält mehrere Optionen gedanklich offen. Das beweist nicht, dass du „nur eine von vielen“ bist, aber Klarheit fehlt. Achte darauf, ob sie bereit ist, sich zu entscheiden, offen zu kommunizieren und verlässlich da zu sein.'],
  ['love', 'Wir streiten. Soll ich mich trennen?', 'Diese Karte gibt kein einfaches Ja oder Nein. Sie zeigt Verwirrung, Unzufriedenheit oder den Blick auf vorgestellte Alternativen. Einer von euch oder beide fragen sich vielleicht, ob etwas anderes besser wäre. Bevor ihr beendet, benennt, was tatsächlich fehlt, und fragt euch, ob ihr noch gemeinsam daran arbeiten wollt.']
],
'pentacles-7': [
  ['other', 'Was ist die Kernbedeutung dieser Karte?', 'Die Sieben der Münzen steht für Geduld, stetige Arbeit und die Prüfung dessen, was die eigene Mühe hervorbringt. Sie kann entweder sagen: „Bleib dran, das Ergebnis braucht Zeit“ oder: „Halt kurz inne und prüfe, ob sich dieser Einsatz noch lohnt.“ Frage und umliegende Karten entscheiden über die Nuance.'],
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Das ist ein geduldiger, ausdauernder Mensch, der lange bei einem Prozess bleiben kann. Die Schattenseite ist so viel Vorsicht, dass Entscheidungen langsam oder zu passiv werden, besonders wenn eine Situation rechtzeitiges Handeln verlangt.'],
  ['love', 'Welche Gefühle hat diese Person für mich?', 'Die Antwort tendiert positiv. Die Sieben der Münzen zeigt Gefühle, die sich eher langsam aufgebaut haben als plötzlich entstanden sind. Diese Person hat vielleicht Zeit, Aufmerksamkeit und Geduld investiert und möchte sehen, ob aus dem Gepflegten etwas Dauerhaftes wachsen kann.'],
  ['love', 'Wir streiten. Soll ich mich trennen?', 'Diese Karte lenkt zuerst auf Geduld und langfristige Pflege. In einer langen Beziehung kann die Leichtigkeit des Anfangs nachlassen, und beide werden weniger tolerant gegenüber den Gewohnheiten des anderen. Bevor du gehst, frag, ob es echte Unvereinbarkeit ist oder ob ihr beide aufgehört habt, die Beziehung mit derselben Sorgfalt zu pflegen.'],
  ['love', 'Was soll ich tun, wenn die andere Person sich nicht ändern kann?', 'Manche Eigenschaften verändern sich langsam, andere vielleicht nie so, wie du es hoffst. Gib vernünftig Zeit, wenn Veränderung wirklich möglich ist, aber verwandle Geduld nicht in endloses Warten. Frag, was du tatsächlich brauchst, ob die andere Person diese Veränderung auch für sich selbst will und ob die Beziehung noch funktioniert, wenn dieser Punkt bleibt.'],
  ['career', 'Finde ich bald einen Job, der zu mir passt?', 'Die Antwort tendiert zu Ja, aber wahrscheinlich nicht sofort. Die Mühe, die du in Suche, Lernen und Weiterentwicklung gesteckt hast, kann sich auszahlen. Bleib dran und prüfe zugleich, welche Schritte Ergebnisse bringen und welche angepasst werden sollten.'],
  ['career', 'Wie entwickelt sich meine Arbeit in nächster Zeit?', 'Die Sieben der Münzen verspricht eher schrittweisen als plötzlichen Fortschritt. Sie ist keine Karte mühelosen Glücks, sondern der Ertrag beständiger Arbeit. Wartest du auf Beförderung oder Wachstum, rechne mit Zeit und sammle weiter Belege dafür, dass du bereit bist.'],
  ['other', 'Warum muss ich so geduldig sein?', 'Die Sieben der Münzen handelt von Beständigkeit statt von einem kurzen Kraftschub. Das Bild einer gepflegten Pflanze ist hilfreich: Manche Ergebnisse brauchen Wochen oder Monate, bevor man sie klar sieht. Bei Gewohnheiten ist es ähnlich; es gibt keine feste Zahl von Tagen, die für alle gilt. Wichtig ist, das Verhalten lange genug zu wiederholen und die Methode bei Bedarf anzupassen.']
]
});

Object.assign(ASK.de, {
'wands-8': [
  ['other', 'Was ist die Kernbedeutung dieser Karte?', 'Die Acht der Stäbe hat zwei Hauptthemen, die beide aus den fliegenden Stäben im Bild kommen: Geschwindigkeit und Bewegung. Etwas kann sich schnell entwickeln, oder Entfernung und Reisen werden wichtig. Anders als Die Welt, die oft einen größeren Abschluss oder weiteren Horizont zeigt, kann die Acht der Stäbe Bewegung in jeder Größenordnung beschreiben. Die Karte ist neutral: Manchmal hilft Tempo, manchmal ist es der Grund, langsamer zu werden.'],
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Diese Karte kann jemanden beschreiben, der schnell denkt, spricht und handelt. Die Person erledigt vielleicht gern mehrere Dinge gleichzeitig, weil sie Schwung mag. Die Schattenseite ist Hast: Tempo kann vermeidbare Fehler, übersehene Details und Entscheidungen erzeugen, bevor genug Informationen da sind. Die Lektion ist nicht, langsam zu werden, sondern zu wissen, wann Tempo nützt und wann Fokus wichtiger ist.'],
  ['love', 'Welche Gefühle hat diese Person für mich?', 'Die Gefühle können schnell und intensiv entstanden sein, doch Geschwindigkeit sagt nichts darüber aus, ob sie bleiben. Ihr seid vielleicht von Neuheit oder von einem Bild fasziniert, das ihr euch voneinander gemacht habt. Gebt der Verbindung genug Zeit, damit sich zeigt, ob zur Anziehung auch echtes Verstehen, Beständigkeit und Verbindlichkeit kommen.'],
  ['love', 'Wir streiten. Soll ich mich trennen?', 'Die Acht der Stäbe spricht eher von Tempo und schnellen Reaktionen als von einer Trennung. Vielleicht zieht ihr aus kleinen Zeichen vorschnelle Schlüsse, sprecht, bevor ihr zuhört, oder steigert euch hinein, bevor klar ist, was wirklich passiert ist. Verlangsamt das Gespräch, fragt direkt nach und trennt Tatsachen von Annahmen, bevor ihr im Affekt eine dauerhafte Entscheidung trefft.'],
  ['career', 'Ich bin arbeitslos. Finde ich bald einen Job?', 'Die Antwort tendiert zu Ja, und die Karte bringt zwei mögliche Themen mit. Nachrichten können schnell kommen, und die Chance kann Bewegung verlangen: ein anderer Ort, ein längerer Arbeitsweg, häufiges Reisen oder eine Tätigkeit, bei der du viel unterwegs bist. Behandle die Zeitangabe symbolisch und nicht als Garantie für eine bestimmte Zahl von Tagen.'],
  ['career', 'Worauf sollte ich beruflich bald achten?', 'Etwas kann sich schnell entwickeln, also sei bereit zu reagieren, ohne vorschnell zu urteilen. Die Karte kann auch Bewegung im Beruf anzeigen: Dienstreise, Versetzung, neues Team oder schlicht eine Veränderung darin, wo und wie du arbeitest. Zieh weitere Karten, wenn du wissen willst, ob die Veränderung eher hilfreich oder schwierig ist.']
],
'swords-8': [
  ['other', 'Was ist die Kernbedeutung dieser Karte?', 'Die Acht der Schwerter ist das Gefühl, festzustecken, eingeschränkt zu sein oder keine Wahl zu haben. Im Bild sind die Fesseln locker und die Schwerter schließen den Weg nicht vollständig. Deshalb fragt die Karte oft, ob Angst oder Annahmen die Lage fester erscheinen lassen, als sie ist. Sie behauptet nicht, jedes Hindernis sei eingebildet; sie fragt, wo noch Bewegung möglich ist.'],
  ['other', 'Wer hat diese Person also gefesselt?', 'Die Acht der Schwerter weist oft auf Überzeugungen hin, die eine ohnehin schwierige Lage noch enger wirken lassen. Manchmal liegt die Barriere im Inneren, doch äußere Grenzen können ebenfalls real sein. Die Karte fordert keine Selbstbeschuldigung. Frag, welchen Teil du beeinflussen kannst, wo du Unterstützung oder Ressourcen brauchst und welcher kleine Schritt dir wieder etwas Wahlfreiheit gibt.'],
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Diese Karte kann jemanden beschreiben, der sich leicht sorgt und in begrenzenden Gedanken festhängt. Unter Stress sieht die Person Risiken oft vor Möglichkeiten und glaubt schwer daran, überhaupt eine Wahl zu haben. Das ist ein veränderbarer Zustand und keine feste Definition eines Menschen.'],
  ['love', 'Welche Gefühle hat diese Person für mich?', 'Die Antwort kann darauf hindeuten, dass Gefühle vorhanden sind, während die Person sich selbst zurückhält. Angst, alte Verletzungen, Unsicherheit oder die Überzeugung, dass es nicht funktionieren kann, können stärker sein als die Bereitschaft zu handeln. Entscheidend ist, ob sie diese Ängste erkennt und darüber spricht, statt dich immer wieder wegzustoßen.'],
  ['love', 'Wir streiten. Soll ich mich trennen?', 'Die Karte sagt nicht, dass ihr euch trennen müsst. Sie betont das Gefühl von Ausweglosigkeit und wie ängstliche Gedanken ein Problem hoffnungsloser erscheinen lassen können, als es ist. Trenne Wissen von Vermutung und schau sowohl auf deinen Anteil als auch auf reale Grenzen der anderen Person. Gibt es Kontrolle, Drohungen oder Gewalt, ist das nicht nur eine Frage der Perspektive; Sicherheit und Unterstützung von außen gehen vor.'],
  ['love', 'Kannst du ein Beispiel für einen Perspektivwechsel geben?', 'Stell dir vor, ein Kollege sagt etwas Unfreundliches über dich. Du könntest dich endlos fragen, was du falsch gemacht hast, oder zurückschlagen und den Konflikt vergrößern. Eine andere Reaktion ist, die Fakten zu prüfen, zu entscheiden, ob eine klare Grenze nötig ist oder ob der Kommentar keine weitere Energie verdient, und dann zum Wesentlichen zurückzukehren. Perspektivwechsel heißt nicht, Schaden schönzureden, sondern eine Reaktion zu wählen, die dich nicht im selben Konflikt festhält.'],
  ['career', 'Finde ich bald einen neuen Job?', 'Die Karte deutet darauf hin, dass die Suche noch blockiert wirken kann, ohne dass die Ursache vollständig bei dir liegt. Vielleicht schließt du dich wegen mangelnden Selbstvertrauens selbst aus guten Stellen aus, während Markt oder Lebensumstände ebenfalls schwierig sind. Prüfe Jobs, die du automatisch verwirfst, hol dir Feedback zu Bewerbungen und erweitere die Suche dort, wo es sinnvoll ist.'],
  ['career', 'Worauf sollte ich beruflich bald achten?', 'Etwas bei der Arbeit kann dich eingeengt fühlen lassen, auch wenn kein dramatisches Ereignis passiert. Frag, ob es eine echte strukturelle Grenze, eine schwierige Beziehung oder die Überzeugung ist, keine Alternative zu haben. Die Art der Einschränkung zu benennen ist wichtig, weil jede eine andere Antwort braucht: Gespräch, Grenze, praktischen Plan oder Richtungswechsel.']
],
'cups-8': [
  ['other', 'Was ist die Kernbedeutung dieser Karte?', 'Die Acht der Kelche bedeutet, etwas zu verlassen, das noch Wert haben kann, weil dein Weg woanders weitergeht. Du musst einen Ort, Menschen oder Lebensabschnitt nicht hassen, um ihm entwachsen zu sein. Die Karte trägt Traurigkeit und Entschlossenheit zugleich: Du kannst das Gute würdigen und trotzdem wissen, dass es Zeit ist weiterzugehen.'],
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Die Acht der Kelche lässt sich besser als Lebensphase denn als feste Persönlichkeit lesen. Die Person hat vielleicht kürzlich etwas Wichtiges zurückgelassen, um einen anderen Weg zu beginnen. Eine solche Entscheidung kann gleichzeitig Traurigkeit, Erleichterung und Unsicherheit bringen und noch beeinflussen, wie sie heute Beziehungen erlebt.'],
  ['love', 'Sind die Gefühle dieser Person für mich ehrlich?', 'Die Gefühle können echt sein, während die Person gerade einem Weg folgt, der wenig Raum für die Beziehung lässt. Sie kann dich mögen und sich trotzdem wegen Entfernung, Timing oder einer anderen Lebensrichtung gegen einen Anfang oder eine Fortsetzung entscheiden. Gefühle und Verfügbarkeit sind nicht dasselbe.'],
  ['love', 'Wir streiten. Soll ich mich trennen?', 'Die Acht der Kelche zeigt, dass mindestens eine Person ernsthaft ans Gehen denkt oder eine andere Lebensrichtung braucht. Dadurch wird eine Trennung wahrscheinlicher, aber nicht unvermeidlich. Sprecht offen darüber, was jeder von euch will, was ihr noch gemeinsam aufbauen könnt und welche Unterschiede vielleicht zu groß geworden sind.'],
  ['career', 'Ich bin seit drei Monaten arbeitslos. Finde ich einen Job, der zu mir passt?', 'Diese Karte fragt, was du möglicherweise loslassen musst, damit die Suche weitergeht. Vielleicht begrenzt du dich auf ein Feld, weil du bereits Jahre hineingesteckt hast, obwohl es nicht mehr passt. Vergangene Mühe ist nicht verschwendet, nur weil du die Richtung änderst. Überleg, welche Fähigkeiten du in eine andere Art von Arbeit mitnehmen kannst.']
],
'pentacles-8': [
  ['other', 'Was ist die Kernbedeutung dieser Karte?', 'Die Acht der Münzen steht für Handwerk: sorgfältige Arbeit, Wiederholung, Geduld und Liebe zum Detail. Die Person im Bild verbessert Stück für Stück. Die Karte bevorzugt Übung und Beständigkeit gegenüber Abkürzungen.'],
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Das ist ein fleißiger, detailorientierter und oft perfektionistischer Mensch. Die Person arbeitet vielleicht sehr gut allein und ist stolz darauf, Dinge ordentlich zu machen. Die Schattenseite ist, Fehler so genau zu betrachten, dass das Gesamtbild verloren geht oder das bereits Gute kaum noch genossen werden kann.'],
  ['love', 'Welche Gefühle hat diese Person für mich?', 'Die Antwort tendiert positiv, aber diese Person analysiert genau, bevor sie weitergeht. Vielleicht denkt sie über praktische Passung, Gewohnheiten und die langfristige Zukunft nach, statt nur der Anziehung zu folgen. Sorgfalt kann hilfreich sein; wird daraus das Prüfen jedes Mangels, bekommt die Beziehung kaum Raum, sich natürlich zu entwickeln.'],
  ['love', 'Wir streiten. Soll ich mich trennen?', 'Der Konflikt kann entstehen, weil einer von euch oder beide kleine Fehler stärker sehen als das, was der andere beiträgt. Kleine Gewohnheiten, Verhalten in sozialen Medien oder harmlose Details werden dann zum Symbol einer größeren Sorge. Sprecht über das eigentliche Bedürfnis unter der Kritik, statt euch gegenseitig ständig bei Kleinigkeiten zu kontrollieren.'],
  ['career', 'Finde ich bald einen Job?', 'Die Antwort tendiert zu Ja, besonders bei Arbeit, die Können, Konzentration und sorgfältige Wiederholung belohnt. Die Tätigkeit kann eigenständiges Arbeiten, Zahlen, Handwerk, Analyse oder jeden Prozess umfassen, bei dem Qualität durch Übung wächst. Buchhaltung und Prüfung sind Beispiele, aber die Karte ist nicht darauf beschränkt.'],
  ['career', 'Verändert sich beruflich bald etwas?', 'Die Acht der Münzen zeigt meist Fortsetzung statt plötzlichen Wandel. Dein Fortschritt entsteht, indem du die Arbeit Stück für Stück verbesserst. Wenn du müde bist, ruh dich aus und passe das Tempo an, aber verwechsle das Fehlen eines dramatischen Durchbruchs nicht mit fehlendem Fortschritt.']
]
});

Object.assign(ASK.de, {
'wands-9': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Die Neun der Stäbe beschreibt einen widerstandsfähigen Menschen, der schon genug Schwierigkeiten erlebt hat, um vorsichtiger zu sein. Die Person gibt nicht leicht auf, doch Stärke kann in ständige Erwartung des nächsten Problems kippen. Ihre Kraft ist Ausdauer; ihre Lektion ist zu erkennen, wann weiteres Durchhalten sinnvoll ist und wann Ruhe oder ein anderer Weg besser wäre.'],
  ['love', 'Welche Gefühle hat diese Person für mich?', 'Eine einzelne Neun der Stäbe reicht nicht für ein klares Ja oder Nein. Gefühle können vorhanden sein, während etwas die Person vorsichtig macht: aktueller Druck, frühere Enttäuschung oder Angst vor neuer Verletzung. Zieh weitere Karten, wenn du zwischen echtem Interesse, Vorsicht und emotionaler Nicht-Verfügbarkeit unterscheiden möchtest.'],
  ['love', 'Warum bittet die Person mich zu warten?', 'Die Neun der Stäbe kann zeigen, dass die Person dich mag, aber langsam vorgeht, weil sie andere Belastungen trägt oder vergangene Verletzungen vorsichtiger gemacht haben. Wenn du wartest, sollte das Tempo auch für dich passen. Geduld bedeutet nicht, die eigenen Bedürfnisse unbegrenzt auf Eis zu legen.'],
  ['love', 'Wir streiten. Soll ich mich trennen?', 'Diese Karte kann eine Beziehung beschreiben, die von Anfang an mehr Kraft verlangt hat, etwa wegen Entfernung, Familiendruck, kultureller Unterschiede oder wiederkehrender Belastungen. Sie entscheidet die Trennung nicht für dich. Frag, ob ihr noch auf derselben Seite arbeitet und ob die Mühe etwas Gesünderes aufbaut, statt „niemals aufgeben“ als Regel für jede Beziehung zu benutzen.'],
  ['career', 'Ich suche Arbeit. Wie wird die Suche weitergehen?', 'Vielleicht hast du schon mehrere Absagen erlebt, doch die Neun der Stäbe bittet dich, sie nicht als Beweis dafür zu sehen, dass nichts funktionieren wird. Mach weiter und lerne aus jedem Versuch. Ausdauer ist am hilfreichsten, wenn sie Anpassung einschließt: Lebenslauf verbessern, Gespräche üben und die Strategie ändern, wenn die Ergebnisse dafür sprechen.'],
  ['career', 'Worauf sollte ich beruflich bald achten?', 'Es kann ein lösbares, aber ermüdendes Hindernis auftauchen: eine schwierige Aufgabe, Verzögerung oder ein wiederkehrendes Problem. Die Karte steht für Ausdauer, nicht für Märtyrertum. Wenn dasselbe Thema immer wiederkommt, geh an die Ursache oder hol Hilfe, statt nur erneut zu beweisen, dass du es aushältst.'],
  ['other', 'Welche Lehre trägt diese Karte?', 'Die Neun der Stäbe lehrt Ausdauer nach Schwierigkeiten. Es ist der Moment, in dem du müde bist, aber nicht unbedingt am Ende. Die tiefere Lektion ist, Ausdauer von Sturheit zu unterscheiden: Geh weiter, wenn das Ziel noch wichtig und der Weg tragbar ist, aber bleib nicht nur deshalb auf einem schädlichen Weg, weil du schon weit gekommen bist.']
],
'swords-9': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Die Neun der Schwerter spricht eher über einen seelischen Zustand als über eine feste Persönlichkeit. Jemand kann ängstlich sein, schlecht schlafen, sich selbst Vorwürfe machen oder alles durch eine sehr schwere Brille sehen. Wenn der Kopf überlastet ist, kann es sich anfühlen, als würde niemand verstehen und es gäbe keinen Ausweg, obwohl Unterstützung und Möglichkeiten noch vorhanden sind.'],
  ['love', 'Sollte ich jemanden daten, der diese Energie trägt?', 'Entscheide nicht anhand einer Karte, ob du jemanden lieben solltest. Wenn die Person gerade unter Angst oder emotionalem Schmerz leidet, schau darauf, ob sie das erkennt, passende Unterstützung sucht und deine Grenzen trotzdem respektiert. Du kannst jemanden lieben, ohne für seine psychische Gesundheit verantwortlich zu werden.'],
  ['love', 'Wir streiten viel. Soll ich mich trennen?', 'Die Neun der Schwerter zeigt, dass der Konflikt emotional sehr erschöpfend geworden ist. Einer von euch oder beide stecken vielleicht in Angst, Eifersucht, Groll oder wiederholten Forderungen fest, der andere müsse sich ändern. Die Karte garantiert weder Reparatur noch Scheitern. Entscheidend ist, ob beide Verantwortung übernehmen, sicher kommunizieren und das Muster tatsächlich verändern statt nur Versprechen zu machen.'],
  ['love', 'Was soll ich in dieser Situation tun?', 'Such nach einer Lösung, die gegenseitig ist und nicht nur von einer Seite getragen wird. Du kannst den ersten ruhigen Schritt machen, aber eine Beziehung lässt sich nicht reparieren, wenn eine Person ständig nachgibt und die andere nichts verändert. Verursacht die Dynamik anhaltende Angst, Erniedrigung oder seelischen Schaden, darfst du Abstand nehmen und Unterstützung suchen.'],
  ['career', 'Ich bin schon lange arbeitslos. Finde ich bald einen Job?', 'Die Neun der Schwerter zeigt, wie belastend die Suche geworden ist. Nach mehreren Absagen gehst du vielleicht schon mit der Erwartung des Scheiterns ins Gespräch, und das kann dein Auftreten beeinflussen. Es geht nicht darum, dass eine „niedrige Frequenz Misserfolg anzieht“. Konzentriere dich auf Beeinflussbares: Vorbereitung, Übung, Feedback, Schlaf und psychisches Wohlbefinden während der Suche.'],
  ['career', 'Worauf sollte ich beruflich bald achten?', 'Die Arbeit kann Sorgen verstärken, doch trenne die Ursache sorgfältig. Ist der Job selbst unverhältnismäßig belastend, sind Erwartungen unklar, oder reagierst du auf normales Feedback besonders stark, weil du bereits erschöpft bist? Die Antwort kann eine Grenze, ein Gespräch, bessere Systeme, Erholung oder ein anderer Job sein. Unterstelle nicht jeder Kritik Verfolgung, aber rede einen wirklich ungesunden Arbeitsplatz auch nicht klein.'],
  ['other', 'Wie ist eine Legung für jemanden mit dieser Energie?', 'Eine Legung mit einer sehr ängstlichen oder belasteten Person kann emotional ermüden, besonders wenn du lange konzentriert zuhörst und mitfühlst. Setz Zeitgrenzen, mach Pausen zwischen Legungen und erinnere dich daran, dass du die Gefühle eines anderen nach dem Termin nicht weitertragen musst.']
],
'cups-9': [
  ['other', 'Was ist die Kernbedeutung dieser Karte?', 'Die Neun der Kelche steht für Zufriedenheit: das Vorhandene genießen und spüren, dass etwas gut gelaufen ist. Ihre Schattenseite ist Selbstzufriedenheit — ein gutes Ergebnis so zu behandeln, als gäbe es nichts mehr zu lernen oder zu verbessern. Die Karte lädt dazu ein, den Erfolg zu genießen, ohne Bequemlichkeit in Stillstand kippen zu lassen.'],
  ['other', 'Kannst du ein Beispiel geben?', 'Stell dir vor, jemand erzielt in einer Probeprüfung ein hervorragendes Ergebnis. Die Neun der Kelche passt zur Freude und zum Selbstvertrauen danach. Die Warnung ist, aus einem guten Übungsergebnis eine Garantie für die Abschlussprüfung zu machen. Feier den Erfolg und behalte dann die Gewohnheiten bei, die ihn möglich gemacht haben.'],
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Diese Karte kann jemanden beschreiben, der optimistisch ist, Genuss mag und sich in seiner Haut wohlfühlt. In der Schattenseite wird Selbstvertrauen zu Selbstgefälligkeit oder dem Bedürfnis nach Bewunderung. Achte darauf, ob die Person den eigenen Erfolg genießen kann, ohne andere kleiner zu machen.'],
  ['love', 'Welche Gefühle hat diese Person für mich?', 'Die Antwort kann positiv ausfallen, doch die Neun der Kelche fragt, ob die Person die Beziehung selbst schätzt oder vor allem die Aufmerksamkeit und Befriedigung genießt, die sie daraus bekommt. Anziehung und Freude können echt und trotzdem selbstbezogen sein. Beobachte, was passiert, wenn sie dich nicht mehr „gewinnen“ muss: Bleiben Fürsorge, Respekt und Einsatz?'],
  ['love', 'Wir streiten. Wie sollen wir damit umgehen?', 'Stolz kann den Streit am Leben halten. Jeder fühlt sich vielleicht zu sicher, im Recht zu sein, um zuerst zuzuhören oder sich zu entschuldigen. Die Neun der Kelche fordert euch auf, die Beziehung höher zu gewichten als die Befriedigung, den Streit zu gewinnen. Wenn das Thema wichtig ist, sprecht über das eigentliche Bedürfnis darunter.'],
  ['career', 'Finde ich bald einen Job, der mir gefällt?', 'Die Neun der Kelche empfiehlt zu prüfen, ob deine Erwartungen zu Erfahrung, Markt und deinen tatsächlichen Prioritäten passen. Das bedeutet nicht, dass du dich „zu hoch einschätzt“. Behalte Standards, die dir wichtig sind, und finde gleichzeitig heraus, wo du flexibel genug sein kannst, um mehr Möglichkeiten zu öffnen.'],
  ['career', 'Worauf sollte ich beruflich bald achten?', 'Die Dinge können gut laufen, und genau deshalb ist Selbstzufriedenheit die Warnung. Freu dich über Anerkennung, ohne anzunehmen, du hättest nichts mehr zu lernen. Stell weiter Fragen, entwickle dein Können und achte darauf, was die nächste Stufe verlangt.']
],
'pentacles-9': [
  ['other', 'Was ist die Kernbedeutung dieser Karte?', 'Die Neun der Münzen steht für materielle Unabhängigkeit, Komfort und das Genießen eines Lebens, das du dir aufgebaut hast. Sie bewertet nicht, ob jemand einfache oder teure Freuden bevorzugt. Wichtig ist, das Eigene schätzen zu können, ohne dass ein anderer Mensch das Gefühl von Sicherheit liefern muss.'],
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Diese Person schätzt Komfort, Unabhängigkeit und ein Leben, das sich wirklich wie das eigene anfühlt. Sie genießt vielleicht Besitz, gutes Essen, ein ruhiges Zuhause oder schlicht die Freiheit, selbst zu entscheiden. Die gesunde Form ist Selbstständigkeit; die Schattenseite ist so viel Eigenständigkeit, dass Partnerschaft wie ein Eindringen wirkt.'],
  ['love', 'Welche Gefühle hat diese Person für mich?', 'Die Neun der Münzen zeigt jemanden, der Unabhängigkeit und die eigene Welt sehr schätzt. Die Person kann Gefühle für dich haben und trotzdem viel Raum brauchen oder nicht jedes Lebensgebiet in die Beziehung integrieren wollen. Achte darauf, ob Eigenständigkeit mit gegenseitiger Fürsorge und Geben verbunden bleibt oder in Distanz und einseitiges Nehmen kippt.'],
  ['love', 'Wir streiten. Müssen wir uns trennen?', 'Die Spannung kann aus unterschiedlichen Bedürfnissen nach Unabhängigkeit und Nähe entstehen. Eine Person möchte vielleicht mehr gemeinsame Zeit und Verbindlichkeit, während die andere ihr starkes Privatleben schützt. Keines der Bedürfnisse ist automatisch falsch. Die Frage ist, ob ihr eine Balance findet, in der sich beide umsorgt fühlen, ohne kontrolliert oder vernachlässigt zu werden.'],
  ['career', 'Finde ich bald einen neuen Job?', 'Die Antwort tendiert positiv, besonders bei Arbeit, die deine finanzielle Unabhängigkeit stärkt oder dir mehr Kontrolle über dein Leben gibt. Behandle die Karte nicht als Luxus-Garantie; beurteile anhand von Angebot, Gehalt und Bedingungen, ob die Stelle wirklich die Stabilität bietet, die du brauchst.'],
  ['career', 'Wie hoch wird das Gehalt genau sein?', 'Tarot kann keine verlässliche Gehaltszahl nennen. Die Neun der Münzen steht für Komfort, Unabhängigkeit und materielle Auskömmlichkeit. Ob ein Angebot wirklich gut ist, solltest du mit Markt, Lebenshaltungskosten, Erfahrung und deinen realen finanziellen Zielen vergleichen.'],
  ['career', 'Wie wird meine Arbeit in nächster Zeit laufen?', 'Die Arbeit kann stabil genug bleiben, um ein angenehmes Leben zu tragen, doch die Karte fragt auch, ob du Zeit hast, das Verdiente zu genießen. Mehr Einkommen ist nicht automatisch ein besseres Leben, wenn der Job jede Stunde verbraucht. Betrachte Geld, Freiheit, Zeit und Wohlbefinden gemeinsam.']
]
});

Object.assign(ASK.de, {
'wands-10': [
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Die Zehn der Stäbe beschreibt oft jemanden, der zu viele Verantwortungen trägt. Die Person sagt vielleicht schwer Nein, ist daran gewöhnt, alles selbst zu machen, oder hat Mühe mit Prioritäten. Manchmal kommt die Last tatsächlich aus den Umständen und ist nicht selbst geschaffen. Die hilfreiche Frage lautet: Was ist notwendig, was kann geteilt werden und was darf abgelegt werden?'],
  ['love', 'Welche Gefühle hat diese Person für mich?', 'Die Person kann echte Gefühle für dich haben, während ihre Aufmerksamkeit auf viele Verantwortungen verteilt ist. Das Problem muss nicht fehlende Zuneigung sein, sondern fehlende Kapazität. Frag dich, ob die Zeit und Aufmerksamkeit, die sie realistisch geben kann, für dich ausreichen, und sag klar, was du brauchst.'],
  ['love', 'Wir streiten. Soll ich mich trennen?', 'Der Konflikt kann aus Überlastung statt aus fehlender Liebe entstehen. Wenn beide erschöpft sind, geht Geduld schnell verloren und kleine Wünsche fühlen sich wie zusätzliche Last an. Die Karte rät nicht automatisch zur Trennung. Prüft zuerst, ob dies eine vorübergehende stressige Phase ist und ob ihr währenddessen etwas Verbindung schützen könnt.'],
  ['love', 'Was soll ich tun, solange ich so beschäftigt bin?', 'Sag deinem Partner klar, wo deine Grenzen liegen, statt zu schweigen, bis du gereizt reagierst. Vereinbart kleine, realistische Wege, während der stressigen Zeit verbunden zu bleiben. Wenn der Druck nachlässt, stell die Balance aktiv wieder her. Hört die Überlastung nie auf, prüfe Aufgaben, Erwartungen und Unterstützung, statt dir allein die Schuld zu geben.'],
  ['career', 'Finde ich bald einen Job, der zu mir passt?', 'Die Zehn der Stäbe zeigt, dass die Jobsuche mit zu vielen anderen Anforderungen konkurriert, sodass der Fortschritt langsamer sein kann als gewünscht. Lies das nicht als schlichtes Nein. Begrenze Prioritäten: Schütze Zeit für Bewerbungen, Gespräche und Firmenrecherche und verschiebe Unwichtiges, wenn möglich.'],
  ['career', 'Was kann beruflich bald passieren?', 'Die nächste Zeit kann vor allem eines sein: voll. Projekte überschneiden sich, andere bitten um Hilfe und zusätzliche Aufgaben sammeln sich an. Die Warnung ist Überlastung, keine Katastrophe. Kläre Prioritäten früh, verhandle Fristen und frag, was delegiert werden kann, bevor alles gleichzeitig dringend wird.'],
  ['other', 'Was soll ich also tun?', 'Beginne damit anzuerkennen, dass die Last zu groß geworden ist. Schreib alles auf, trenne Dringendes von Wichtigem und entscheide, was warten, delegiert oder abgelehnt werden kann. Tarot kann das Muster zeigen; die praktische Lösung heißt Prioritäten, Grenzen und Hilfe, wo sie sinnvoll ist.']
],
'swords-10': [
  ['other', 'Was ist die Kernbedeutung dieser Karte?', 'Die Zehn der Schwerter ist das Gefühl, dass ein schmerzhafter Zyklus an seine Grenze gekommen ist: Erschöpfung, Enttäuschung oder der Gedanke, nichts mehr aushalten zu können. Gedanken können Schmerz verstärken, doch äußere Umstände können ebenfalls sehr real sein. Die konstruktive Seite ist, dass ein Ende sichtbar wird. Die Frage wechselt von „Wie lange halte ich noch durch?“ zu „Was muss enden und wie erhole ich mich?“'],
  ['other', 'Manche sagen, diese Karte habe auch eine positive Seite. Stimmt das?', 'Ja. Die Zehn der Schwerter wird oft als Tiefpunkt eines Zyklus gelesen und enthält deshalb auch Ende und Erholung. Aber „die Zeit heilt alles von allein“ ist nicht die ganze Botschaft. Schau, was aufhören muss, welche Unterstützung gebraucht wird und welche Lehre helfen kann, dasselbe Muster nicht zu wiederholen.'],
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Die Zehn der Schwerter sollte nicht benutzt werden, um die gesamte Persönlichkeit eines Menschen festzulegen. Sie beschreibt oft eine Phase von Erschöpfung, Pessimismus oder dem Gefühl, an die Grenze gedrängt zu sein. In diesem Zustand sieht jemand positive Möglichkeiten schwerer und reagiert stärker als sonst. Der Zustand kann sich verändern, wenn sich Umstände und psychisches Wohlbefinden verbessern.'],
  ['other', 'Wie kann es sich anfühlen, mit jemandem in dieser Energie zu sprechen?', 'Lange Gespräche mit jemandem, der ständig verzweifelt oder in einer Krise ist, können emotional ermüden. Das macht die Person nicht zu einem „Energievampir“. Du kannst zuhören und trotzdem Grenzen haben: Nicht immer hast du Kraft, alles aufzunehmen, und wenn das Problem deine Möglichkeiten übersteigt, ist es sinnvoll, vertraute Menschen oder professionelle Hilfe zu empfehlen.'],
  ['love', 'Welche Gefühle hat diese Person für mich?', 'Die Person kann Gefühle für dich haben und die Beziehung trotzdem durch Angst, Misstrauen oder die Erwartung von Verletzung betrachten. Solche Ängste können gewöhnliches Verhalten verzerren. Statt dich endlos beweisen zu müssen, schau darauf, ob sie über ihre Ängste sprechen, Annahmen überprüfen und gemeinsam mit dir Vertrauen aufbauen kann.'],
  ['love', 'Sollte ich jemandem in diesem Zustand helfen?', 'Du kannst im Rahmen deiner Möglichkeiten helfen, aber du kannst niemanden zwingen, sich zu verändern oder Hilfe anzunehmen, bevor er bereit ist. Sag klar, was du geben kannst und was nicht, und ermutige passende Unterstützung. Wenn die Beziehung dich wiederholt erschöpft oder verletzt, ist Abstand ebenfalls eine vernünftige Möglichkeit.'],
  ['other', 'Warum kann eine Legung für jemanden in diesem Zustand wenig helfen?', 'Wenn jemand hoffnungslos ist, hilft eine Legung möglicherweise wenig, wenn nur Bestätigung gesucht wird, dass alles vom Schicksal festgelegt sei. Ein Reader sollte Hilflosigkeit nicht verstärken. Nutze Tarot, um Fragen und praktische Wahlmöglichkeiten zu öffnen, und benenne seine Grenzen. Bei einer ernsthaften psychischen Krise ersetzt eine Legung keine professionelle Unterstützung.'],
  ['love', 'Wir streiten ständig. Soll ich mich trennen?', 'Die Zehn der Schwerter zeigt, dass die aktuelle Form der Beziehung tief erschöpfend oder schmerzhaft geworden ist. Etwas in diesem Zyklus muss enden, doch das kann das schädliche Muster, eine Pause zur Erholung oder die Beziehung selbst sein. Bei Gewalt, Drohungen oder Angst haben Sicherheit und Unterstützung von außen Vorrang vor einer Tarot-Entscheidung.'],
  ['career', 'Finde ich einen Job, der mir gefällt?', 'Du bist durch die Suche vielleicht zu erschöpft oder entmutigt, um dich gerade von deiner besten Seite zu zeigen. Das bedeutet nicht, dass Arbeitgeber magisch „schlechte Energie spüren“. Wenn möglich, gönn dir etwas Erholung und geh gleichzeitig kleine praktische Schritte weiter: Lebenslauf verbessern, Gespräche üben und Hilfe holen. Es gibt keine vorgeschriebene Wartezeit von ein oder zwei Monaten.'],
  ['career', 'Passiert beruflich bald etwas Schwieriges?', 'Die Zehn der Schwerter kann eine Arbeitssituation spiegeln, die bereits nahe am Bruchpunkt ist: Burnout, Projektende, Konflikt oder die Notwendigkeit, eine schlechte Konstellation zu verlassen. Eine Karte sagt nicht, wer schuld ist. Schau auf konkrete Fakten, schütze dein Wohlbefinden und nutze weitere Karten nur zur Reflexion, nicht als Beweis gegen Kollegen oder Vorgesetzte.']
],
'cups-10': [
  ['other', 'Was ist die Kernbedeutung dieser Karte?', 'Die Zehn der Kelche steht für geteiltes Glück, emotionale Zugehörigkeit und einen harmonischen Abschluss eines Zyklus. Die Familienszene im Bild ist symbolisch und keine Vorschrift dafür, wie Glück aussehen muss. In ihrer besten Form beschreibt die Karte Verbindung, Dankbarkeit und das Gefühl, bei anderen Menschen zuhause zu sein.'],
  ['other', 'Wie stark sind die Zehnen in den Kleinen Arkana?', 'In vielen Tarot-Lehrsystemen stellen die Zehnen die vollste Entwicklung ihrer nummerierten Farbe dar, bevor die Hofkarten separat betrachtet werden. Deshalb eignen sie sich gut für Abschluss und Kulmination. Behandle das als strukturelle Konvention des Decks und nicht als objektiv messbare „stärkere Energie“.'],
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Diese Karte kann einen warmen, emotional großzügigen Menschen beschreiben, der leicht ein Gefühl von Zugehörigkeit schafft. Die Person kann gut darin sein, andere einzubeziehen und ihnen das Gefühl zu geben, gehört zu werden. Die Karte garantiert keine hohe emotionale Intelligenz, begünstigt aber Offenheit, Verbindung und geteilte Freude.'],
  ['love', 'Welche Gefühle hat diese Person für mich?', 'Das ist eine sehr positive Karte für Liebe. Sie deutet auf Zuneigung, Zugehörigkeit und den Wunsch nach einer harmonischen gemeinsamen Zukunft. Eine einzelne Karte ist trotzdem kein Beweis für Heiratspläne oder den genauen Grad der Bindung. Lass Worte, Handlungen und reale Pläne bestätigen, was die Karte symbolisiert.'],
  ['love', 'Wir streiten. Welchen Rat gibt diese Karte?', 'Die Zehn der Kelche deutet darauf hin, dass die Beziehung trotz des aktuellen Ärgers eine gute emotionale Grundlage haben kann. Lass einen kleinen Streit nicht das gesamte Bild auslöschen, aber benutze eine „gute Karte“ auch nicht, um ein ernstes Problem kleinzureden. Kehrt zu dem zurück, was euch verbindet, und sprecht über den konkreten Konflikt.'],
  ['career', 'Finde ich bald einen neuen Job?', 'Die Antwort kann positiv ausfallen für Arbeit, die emotional zufriedenstellt oder ein unterstützendes Umfeld bietet. Die Zehn der Kelche sagt mehr über Freude, Zugehörigkeit und Atmosphäre als über Gehalt oder Beförderung. Nutze eine weitere Karte oder besser die tatsächlichen Angebotsdetails, um Geld und Entwicklung zu bewerten.'],
  ['career', 'Worauf sollte ich beruflich bald achten?', 'Die Karte zeigt eher Harmonie und Unterstützung als eine konkrete Warnung. Genieße eine kooperative Phase, stärke gute Beziehungen und nimm nicht an, dass „nichts zu befürchten“ bedeutet, es müsse nichts gepflegt werden. Gesunde Teams bleiben gesund, weil Menschen weiter zu ihnen beitragen.']
],
'pentacles-10': [
  ['other', 'Was ist die Kernbedeutung dieser Karte?', 'Die Zehn der Münzen steht für langfristige materielle Stabilität, familiäre Ressourcen, weitergegebene Werte und Strukturen, die ein Leben über längere Zeit tragen. Wohlstand bedeutet hier mehr als Bargeld: Zuhause, Sicherheit, Netzwerke und das, was eine Generation an die nächste weitergibt, gehören ebenfalls dazu.'],
  ['other', 'Wie unterscheidet sich diese Karte von der Zehn der Kelche?', 'Beide Karten können Erfüllung zeigen, aber der Schwerpunkt ist anders. Die Zehn der Kelche betont emotionale Zugehörigkeit und geteiltes Glück. Die Zehn der Münzen betont die Strukturen darum herum: Familie, Geld, Zuhause, Tradition und langfristige Sicherheit. Diese Strukturen können tragen, aber auch Erwartungen mitbringen, die einengend wirken.'],
  ['love', 'Welche Persönlichkeit beschreibt diese Karte?', 'Das ist ein stabiler, praktischer Mensch, der oft langfristig denkt. Familie, Sicherheit, Rücklagen und nachhaltige Hilfe können wichtig sein. Die Großzügigkeit ist eher überlegt als impulsiv. Die Schattenseite ist, Tradition oder materielle Sicherheit wichtiger werden zu lassen als Flexibilität und individuelle Wahl.'],
  ['love', 'Welche Gefühle hat diese Person für mich?', 'Die Zehn der Münzen kann jemanden zeigen, der Liebe langfristig und praktisch betrachtet: Familie, Zuhause, Finanzen, Lebensstil und die Frage, ob ein gemeinsames Leben funktionieren könnte. Ähnliche Hintergründe oder Werte können wichtig sein, aber die Karte bedeutet nicht, dass du wegen Status oder Familienbedingungen gewählt wurdest. Achte darauf, ob zur Vernunft auch Zuneigung, Respekt und echtes Verstehen kommen.'],
  ['love', 'Warum streiten wir?', 'Eine einzelne Zehn der Münzen erklärt nicht jeden Beziehungskonflikt, weist aber oft auf Familiensysteme oder praktische Lebensfragen. Druck von Verwandten, Unterschiede in Tradition oder Religion, Wohnen, Geld und Ausgaben können Spannung erzeugen. Zieh weitere Karten, wenn du klären möchtest, welcher Bereich tatsächlich aktiv ist.'],
  ['career', 'Finde ich einen neuen Job?', 'Die Zehn der Münzen ist ein positives Symbol für Stabilität und eine solide finanzielle Grundlage, kann aber weder einen Job noch ein bestimmtes Gehalt garantieren. Wenn eine neue Chance auftaucht, beurteile Bezahlung, Leistungen, Sicherheit und Entwicklung anhand realer Informationen. Die Karte steht eher für Nachhaltigkeit als für ein Versprechen von Reichtum.'],
  ['career', 'Verändert sich meine Arbeit bald?', 'Die Zehn der Münzen bevorzugt meist Kontinuität und langsame Entwicklung statt plötzlicher Veränderung. Ist deine aktuelle Arbeit stabil, kann diese Stabilität anhalten. Wachstum entsteht eher durch gesammelte Erfahrung, Verantwortung und Ressourcen als durch einen Sprung über Nacht.']
]
});

Object.assign(ASK.de, {
  "wands-c0": [
    [
      "other",
      "Was sind die Stichworte dieser Karte?",
      "Der Bube der Stäbe ist ein frisch entzündeter Funke: Neugier, Begeisterung, Entdeckergeist und Lust auf etwas Neues. Die Schattenseite sind Impulsivität, Unerfahrenheit oder ein starker Start ohne Ausdauer. Denk bei jedem Buben an jemanden, der erst lernt, mit dem Element seiner Farbe umzugehen."
    ],
    [
      "love",
      "Was für eine Persönlichkeit beschreibt diese Karte?",
      "Ein Mensch mit der Energie des Buben der Stäbe ist meist offen, lebhaft und handlungsorientiert. Neues begeistert ihn schnell; aus Unerfahrenheit kann er manchmal impulsiv sein. Seine Stärke ist echte Neugier und die Bereitschaft, aus Rückmeldungen zu lernen."
    ],
    [
      "love",
      "Wer ist impulsiver: der Bube oder der Ritter der Stäbe?",
      "Der Ritter der Stäbe ist meist impulsiver und schneller unterwegs. Der Bube hat ebenfalls viel Feuer, wirkt aber eher wie ein Anfänger: begeistert, neugierig und noch eher bereit, kurz anzuhalten und zu lernen. Der Ritter handelt häufiger zuerst und denkt später."
    ],
    [
      "love",
      "Was empfindet diese Person für mich?",
      "Diese Karte deutet oft auf einen neuen Funken hin. Die Person kann dich spannend und anziehend finden und dir näherkommen wollen. Das Interesse kann ehrlich und lebendig sein, ist aber noch jung; wie tief es wird, zeigt die Karte allein nicht. Achte darauf, ob die Aufmerksamkeit auch beständig bleibt."
    ],
    [
      "love",
      "Wir streiten. Wie sollten wir damit umgehen?",
      "Der Streit kann daher kommen, dass ihr zu schnell reagiert oder starke Gefühle noch nicht gut auffangt, wenn es heiß wird. Verlangsamt das Gespräch, klärt ein Thema nach dem anderen und macht daraus keinen Wettbewerb. Dieselbe Leidenschaft, die den Streit antreibt, kann euch auch helfen, gemeinsam eine Lösung zu finden."
    ],
    [
      "career",
      "Finde ich bald einen neuen Job?",
      "Der Bube der Stäbe unterstützt einen neuen Weg, verspricht aber nicht, dass ein Job von allein auftaucht. Werde aktiv: Bewirb dich, probier neue Bereiche aus und rechne damit, unterwegs zu lernen. Chancen zeigen sich eher, wenn du in Bewegung kommst."
    ],
    [
      "career",
      "Worauf sollte ich beruflich in nächster Zeit achten?",
      "Eine neue Aufgabe, ein Projekt oder eine ungewohnte Fähigkeit kann auf dich zukommen. Du musst noch nicht alles können; diese Karte passt gut zum Lernen während der Arbeit. Achte nur darauf, aus Begeisterung nicht zu viel anzunehmen und später die Energie zu verlieren."
    ],
    [
      "other",
      "Wie kann ich mir die Buben leichter merken?",
      "Denk bei jedem Buben an den Anfänger seines Elements. Der Bube der Stäbe lernt Handeln und Leidenschaft, der Bube der Kelche Gefühle, der Bube der Schwerter Denken und Kommunikation, der Bube der Münzen Fähigkeiten und die materielle Welt. Merk dir zuerst die Rolle und verbinde sie dann mit der Farbe."
    ]
  ],
  "swords-c0": [
    [
      "love",
      "Was für eine Persönlichkeit beschreibt diese Karte?",
      "Der Bube der Schwerter ist oft schnell im Kopf, neugierig und aufmerksam, lernt aber noch, gut zu kommunizieren. Er kann zu direkt sprechen, zu viel fragen oder reagieren, bevor er bedenkt, wie seine Worte ankommen. Das ist Unerfahrenheit im Denken und Sprechen, kein schlechter Charakter."
    ],
    [
      "love",
      "Was empfindet diese Person für mich?",
      "Diese Karte zeigt viel Beobachten und Nachdenken, doch die Gefühle müssen noch nicht klar oder tief sein. Die Person kann neugierig auf dich sein, mehr erfahren wollen und die Verbindung stark mit dem Verstand betrachten. Nenn sie nicht allein wegen einer Karte berechnend oder unehrlich; schau auf ihr tatsächliches Verhalten."
    ],
    [
      "other",
      "Worin unterscheidet sich dieser Bube von den anderen drei?",
      "Der Bube der Schwerter bringt das Neue in die Welt von Ideen, Fragen und Kommunikation. Er kann auf eine frische, noch ungeprüfte Idee hinweisen oder auf jemanden, der erst lernt, mit Worten und Logik umzugehen. Seine Stärke ist Neugier, seine Schwäche vorschnelles Urteilen."
    ],
    [
      "love",
      "Wir streiten. Wie können wir das lösen?",
      "Hier steht die Kommunikation im Mittelpunkt. Vielleicht hört ihr zu, um sofort zu widersprechen, statt wirklich zu verstehen, oder ihr redet im Ärger zu schnell. Frag nach, wenn etwas unklar ist, vermeide Vermutungen und lass den anderen ausreden."
    ],
    [
      "career",
      "Finde ich einen neuen Job?",
      "Diese Karte macht die Jobsuche zu einer Frage von Informationen, Lernen und klaren Entscheidungen. Neue Möglichkeiten können auftauchen, doch lies die Details, frag nach den Bedingungen und ändere nicht nur aus momentaner Unsicherheit die Richtung. Viel hängt davon ab, wie gut du Informationen sammelst und danach handelst."
    ],
    [
      "career",
      "Worauf sollte ich beruflich bald achten?",
      "Neue Ideen, Nachrichten oder Gespräche können schnell aufkommen. Prüfe Fakten, bevor du sie präsentierst, und achte auf deinen Ton, damit kleine Missverständnisse nicht größer werden. Eine gute Frage ist oft hilfreicher als ein vorschnelles Urteil."
    ]
  ],
  "cups-c0": [
    [
      "other",
      "Was sind die Stichworte dieser Karte?",
      "Der Bube der Kelche steht für ein neu entstehendes Gefühl: Zartheit, Neugier, Fantasie, Kreativität und emotionale Offenheit. Das kann ein Schwarm, eine Freundschaft, ein neues Interesse oder frische Inspiration sein. Die Schattenseite sind Idealisierung, sich von Gefühlen mitreißen zu lassen oder noch nicht zu wissen, was man wirklich möchte."
    ],
    [
      "love",
      "Was für eine Persönlichkeit beschreibt diese Karte?",
      "Diese Person ist oft sensibel, offen, fantasievoll und leicht von Neuem berührt. Sie wirkt jugendlich, interessiert sich für Menschen und erlebt vieles zuerst über Gefühle. Unreif gelebt kann die Energie zu Tagträumen oder schnell wechselnden Interessen führen."
    ],
    [
      "love",
      "Passt diese Person besser als Freund oder als Partner?",
      "Die Karte kann nicht entscheiden, dass jemand „besser als Freund als als Partner“ geeignet ist. Sie zeigt einen Menschen mit frischen Gefühlen und Neugier, der sich selbst noch entdeckt. Ob eine Beziehung trägt, hängt von Beständigkeit, Grenzen und Kommunikation ab, nicht von dieser Karte allein."
    ],
    [
      "love",
      "Was empfindet diese Person für mich?",
      "Es kann eine ehrliche, aber noch zarte und neue Anziehung da sein. Die Person findet dich vielleicht interessant, liebenswert oder emotional einladend. Gib dem Gefühl Zeit, sich zu entwickeln, statt es sofort festzulegen."
    ],
    [
      "love",
      "Was sollte ich tun, wenn wir streiten?",
      "Versuch nicht, über Gefühle zu gewinnen. Sag, was dich traurig oder unsicher gemacht hat, und frag dann, was die andere Person empfindet, statt es zu erraten. Der Bube der Kelche lädt euch ein, wieder weicher und neugieriger miteinander zu werden."
    ],
    [
      "love",
      "Was soll ich jetzt konkret tun?",
      "Gib dir etwas Zeit, das eigentliche Gefühl zu erkennen, bevor du reagierst. Wenn ihr reden müsst, sprich eher mit „Ich fühle…“ als mit Vorwürfen. Ein sanftes, ehrliches Gespräch passt besser zu dieser Karte als eine vorschnelle Entscheidung."
    ],
    [
      "career",
      "Finde ich einen neuen Job?",
      "Diese Karte kann auf Arbeit hinweisen, die dich wirklich interessiert, besonders in kreativen, betreuenden oder menschenbezogenen Bereichen. Sie garantiert aber keine Einstellung. Nutze deine Neugier, um Chancen zu erkunden, und prüfe die praktischen Bedingungen, bevor du zusagst."
    ],
    [
      "career",
      "Worauf sollte ich beruflich bald achten?",
      "Eine neue Idee, Einladung oder Begeisterung kann frischen Wind in die Arbeit bringen. Probier sie aus, aber ersetze einen Plan nicht durch bloße Inspiration. Wenn du mit Menschen arbeitest, kann emotionale Feinfühligkeit eine echte Stärke sein."
    ]
  ],
  "pentacles-c0": [
    [
      "love",
      "Was für eine Persönlichkeit beschreibt diese Karte?",
      "Der Bube der Münzen ist meist praktisch, fleißig und lernt gern durch eigenes Tun. Fähigkeiten, Geld, Ausbildung oder ein messbares Ziel sind ihm wichtig. Seine Schwäche kann übermäßige Vorsicht, ein langsamer Start oder die Tendenz sein, nur dem unmittelbar Greifbaren zu vertrauen."
    ],
    [
      "love",
      "Was empfindet diese Person für mich?",
      "Die Person kann dich auf eine langsame, praktische Weise ernsthaft kennenlernen wollen. Interesse zeigt sich eher durch kleine Taten, Zeit und Verlässlichkeit als durch große Romantik. Das Gefühl ist noch jung, kann aber wachsen, wenn ihr beide weiter investiert."
    ],
    [
      "love",
      "Warum streiten wir so oft?",
      "Ihr könnt euch beim Tempo, bei Geld, Plänen oder der Frage unterscheiden, wie praktisch die Beziehung sein soll. Einer braucht bei jedem Schritt Sicherheit, der andere möchte schneller vorankommen. Sprecht darüber, was jeder braucht, um sich sicher zu fühlen, statt Langsamkeit als fehlende Liebe zu deuten."
    ],
    [
      "career",
      "Finde ich bald einen Job, der mir gefällt?",
      "Der Bube der Münzen ist günstig für Ausbildung, Praktikum, eine neue Stelle oder Arbeit, in der du nützliche Fähigkeiten aufbaust. Er verspricht nicht sofort den perfekten Job, unterstützt aber eine Chance mit Entwicklungspotenzial. Bevorzuge einen Ort, an dem du wirklich etwas Wertvolles lernen kannst."
    ],
    [
      "career",
      "Was könnte sich beruflich in nächster Zeit tun?",
      "Du kannst in eine Lernphase kommen, eine neue Aufgabe übernehmen oder ein konkreteres Ziel beginnen. Langsamer, stetiger Fortschritt passt zu dieser Karte. Unterschätze kleine Schritte nicht; diese Energie baut ein Fundament Stück für Stück."
    ]
  ]
});

Object.assign(ASK.de, {
  "wands-c1": [
    [
      "other",
      "Was sind die Stichworte dieser Karte?",
      "Der Ritter der Stäbe steht für schnelle Bewegung, Leidenschaft, Risikobereitschaft und Lust auf Erfahrung. Er will los, sobald ihn etwas begeistert. Die Schattenseite sind Ungeduld, Unbeständigkeit und nachlassendes Interesse, sobald der erste Reiz vorbei ist."
    ],
    [
      "other",
      "Worin unterscheidet sich ein Ritter von Bube, Königin und König?",
      "Der Bube lernt noch. Der Ritter hat schon genug Energie, um loszustürmen, beherrscht sein Element aber noch nicht vollständig. Königin und König gehen reifer damit um. Deshalb sind Ritter die beweglichsten Hofkarten und zugleich besonders anfällig dafür, ihre Farbe zu übertreiben."
    ],
    [
      "love",
      "Was empfindet diese Person für mich?",
      "Die Person kann sich stark zu dir hingezogen fühlen und möchte vielleicht schnell vorankommen. Die Energie ist leidenschaftlich, aktiv und begeistert, bedeutet aber nicht automatisch langfristige Bindung. Achte darauf, ob das Interesse bleibt, wenn die Neuheit nachlässt."
    ],
    [
      "love",
      "Wie sieht so eine Anziehung konkret aus?",
      "Typisch wäre jemand, der viel schreibt, dich schnell treffen will, Unternehmungen vorschlägt und die Verbindung beschleunigt. Das kann sehr aufregend sein, doch unterscheide einen Rausch von Beständigkeit. Der Ritter der Stäbe startet stark; Ausdauer zeigt sich erst mit der Zeit."
    ],
    [
      "love",
      "Warum streiten wir so oft?",
      "Vielleicht reagiert ihr beide zu schnell, kämpft um die Führung oder werdet laut, bevor ihr nachdenkt. Streit wird größer, weil ihr noch im Ärger redet. Mach eine Pause vor der Antwort und lass jeweils eine Person ausreden."
    ],
    [
      "other",
      "Sollte ich wegen meines Partners eine Legung machen lassen?",
      "Tarot kann dir helfen, deine eigenen Gefühle und Entscheidungen zu reflektieren. Nutze es aber nicht, um jemanden zu überwachen oder sicher zu behaupten, was in seinem Kopf vorgeht. Wenn du Klarheit brauchst, ist ein direktes Gespräch meist verlässlicher als eine Karte."
    ],
    [
      "career",
      "Finde ich bald einen Job, der mir gefällt?",
      "Der Ritter der Stäbe unterstützt eine aktive Jobsuche mit Gesprächen, Bewegung oder schnell auftauchenden Chancen. Eine spannende Stelle kann kommen, doch lies die Bedingungen genau, bevor du nur aus Begeisterung zusagst. Tempo ist ein Vorteil, wenn Urteilskraft dazukommt."
    ],
    [
      "career",
      "Mache ich bei der Jobsuche etwas falsch?",
      "Vielleicht tust du sehr viel, aber ohne klare Strategie: Bewerbungen überallhin, ständige Richtungswechsel oder zu schnelle Zusagen. Wähl einige klare Ziele, verfolge jede Bewerbung und bereite dich gezielt auf Gespräche vor. Weniger Aktivität mit mehr Absicht kann wirksamer sein."
    ],
    [
      "career",
      "Ich habe einen normalen Bürojob. Was könnte sich bald ändern?",
      "Die Arbeit kann durch ein dringendes Projekt, Reisen oder eine Aufgabe mit schnellem Reaktionsbedarf hektischer werden. Initiative ist jetzt gut, aber Tempo darf nicht in Erschöpfung kippen. Entscheide bewusst, wofür sich der volle Einsatz lohnt."
    ]
  ],
  "swords-c1": [
    [
      "other",
      "Was für eine Persönlichkeit beschreibt diese Karte?",
      "Der Ritter der Schwerter ist schnell im Denken, entschlossen, streitlustig und direkt. Wenn rasches Handeln gefragt ist, kann das sehr hilfreich sein; im Übermaß wird er scharf, ungeduldig oder zu sicher, recht zu haben. Die Aufgabe ist, geistige Geschwindigkeit zu nutzen, ohne sie zur Waffe zu machen."
    ],
    [
      "other",
      "Was haben Ritter und Bube gemeinsam?",
      "Beide beherrschen ihre Farbe noch nicht vollständig. Der Bube lernt und stellt Fragen; der Ritter hat sich schon eine Meinung gebildet und stürmt los, deshalb ist Übertreibung wahrscheinlicher. Bei den Schwertern zeigt sich das in schnellem Denken, starken Worten und vorschnellen Entscheidungen."
    ],
    [
      "love",
      "Was denkt diese Person über mich?",
      "Die Person kann sehr viel über dich nachdenken und möchte Klarheit darüber, wo ihr steht. Sie nähert sich der Verbindung über Logik, direkte Fragen und den Wunsch nach Definition. Das sagt noch nicht, wie tief die Liebe ist; es zeigt vor allem, wie aktiv ihr Kopf bei diesem Thema ist."
    ],
    [
      "love",
      "Ist diese Person die richtige für mich?",
      "Eine Karte kann nicht entscheiden, wer „für dich bestimmt“ ist. Der Ritter der Schwerter kann gut zu jemandem passen, der Direktheit, Tempo und geistige Debatten mag, für einen Menschen mit Bedürfnis nach Sanftheit aber anstrengend sein. Entscheidend ist, wie ihr im echten Leben mit Konflikten umgeht."
    ],
    [
      "love",
      "Warum streiten wir so oft?",
      "Vielleicht diskutiert ihr, um zu gewinnen, statt um zu verstehen. Jemand unterbricht, kontert zu schnell oder benutzt Fakten auf verletzende Weise. Werdet langsamer, trennt Tatsachen von Deutungen und vermeidet lange Nachrichten im Ärger."
    ],
    [
      "career",
      "Finde ich bald einen Job, der mir gefällt?",
      "Diese Karte unterstützt schnelle Bewegung, besonders bei Tätigkeiten mit Denken, Kommunikation, Analyse oder rascher Problemlösung. Nimm trotzdem nicht nur deshalb eine Stelle an, weil du aus deiner jetzigen Situation herauswillst. Frag vorher nach Rolle, Arbeitsmenge und Erwartungen."
    ],
    [
      "career",
      "Ich suche schon lange erfolglos. Was soll ich tun?",
      "Lass Ungeduld nicht zu wahllosen Bewerbungen führen. Überarbeite deinen Lebenslauf, übe Gespräche und bitte eine vertrauenswürdige Person, deine Suchstrategie anzusehen. Der Ritter der Schwerter braucht ein klares Ziel, damit seine Geschwindigkeit nicht verpufft."
    ],
    [
      "career",
      "Ich habe einen normalen Bürojob. Was könnte sich bald ändern?",
      "Eine Phase mit schnellen Entscheidungen, dringenden Gesprächen oder Projekten mit viel Analyse kann beginnen. Auch eine sehr direkte, zielstrebige Person kann beruflich wichtiger werden. Halte Fakten klar und lass ein hohes Tempo nicht in unnötigen Streit kippen."
    ],
    [
      "other",
      "Wie sollte ich diese Karte richtig lernen?",
      "Lern den Ritter der Schwerter nicht einfach als „scharfzüngig“. Denk an die Struktur: Ritter bedeutet Handlung und Bewegung, Schwerter bedeuten Denken, Sprache und Entscheidungen. Zusammen entsteht sehr hohe geistige Geschwindigkeit — stark bei Entschlossenheit, schwierig ohne Kontrolle."
    ]
  ],
  "cups-c1": [
    [
      "other",
      "Was zeigt das Bild auf dieser Karte?",
      "Der Ritter der Kelche reitet vorwärts und hält einen Kelch nach vorn, als würde er eine Einladung, ein Gefühl oder ein Angebot bringen. Im Vergleich zu den anderen Rittern ist seine Bewegung sanfter und langsamer. Das Bild betont, wie ein Gefühl zu jemandem getragen wird."
    ],
    [
      "other",
      "Was ist das wichtigste Stichwort dieser Karte?",
      "Das stärkste Stichwort ist Romantik. Dazu kommen Einladung, Charme, Fantasie, emotionale Annäherung und Idealisierung. Die Schattenseite ist, sich in das Gefühl des Verliebtseins zu verlieben, statt den Menschen vor sich wirklich kennenzulernen."
    ],
    [
      "other",
      "Was für eine Persönlichkeit beschreibt diese Karte?",
      "Diese Person ist oft charmant, gefühlsbetont und lässt sich von Inspiration leiten. Sie kann romantisch und feinfühlig sein, macht unreif gelebt aber vielleicht Versprechen aus einem Gefühl heraus und ändert die Richtung, wenn sich das Gefühl ändert."
    ],
    [
      "other",
      "Warum soll dies die negativste Stufe der Hofkarten sein?",
      "Der Ritter der Kelche sollte nicht pauschal als „negativste“ Hofkarte gelten. Jede Hofkarte hat Licht und Schatten. Hier liegt das Risiko darin, sich zu weit von Gefühlen und Idealen tragen zu lassen; die Stärke ist, Zuneigung, Kunst und Sanftheit aktiv nach außen zu bringen."
    ],
    [
      "love",
      "Was denkt diese Person über mich und wie geht sie mit der Beziehung um?",
      "Die Person kann dich durch eine romantische Brille sehen und dir näherkommen wollen. Süße Worte, Einladungen und liebevolle Gesten fallen ihr leicht. Genieß das Schöne daran, aber lass die Zeit zeigen, ob das Gefühl auch von Beständigkeit getragen wird."
    ],
    [
      "love",
      "Ich fand solche Menschen früher sehr romantisch. Passt das?",
      "Ja. Das ist eines der romantischsten Bilder unter den Hofkarten. Romantik allein macht eine Beziehung aber weder gesund noch dauerhaft. Achte ebenso auf Beständigkeit, Respekt vor Grenzen und darauf, ob Versprechen gehalten werden."
    ],
    [
      "love",
      "Wir streiten oft. Was sollten wir tun?",
      "Vielleicht reagiert einer oder ihr beide stark aus dem Gefühl und erwartet, dass der andere ohne Worte versteht. Sag klar, was du brauchst, statt zu testen, dich zur Beruhigung zurückzuziehen oder ungelöste Themen mit großen Gesten zu überdecken. Einfache Ehrlichkeit wirkt besser als Drama."
    ],
    [
      "love",
      "Was ist, wenn wir beide diese Energie tragen?",
      "Ihr könnt gemeinsam sehr schöne Gefühle erzeugen, aber die Beziehung auch idealisieren und praktische Themen meiden. Bewahrt die Romantik und sprecht zugleich über Zeit, Geld, Grenzen und Bindung. Auch schöne Gefühle brauchen einen stabilen Rahmen."
    ],
    [
      "other",
      "Sollte ich alle Gefühle einfach zeigen?",
      "Gefühle auszudrücken heißt nicht, alles sofort zu sagen oder zu tun, sobald ein Gefühl auftaucht. Erlaub dir das Gefühl und wähl dann eine Form, die weder dich noch andere verletzt. Emotionale Reife bedeutet Ehrlichkeit plus Selbstregulation."
    ],
    [
      "career",
      "Finde ich bald einen neuen Job, der mir gefällt?",
      "Der Ritter der Kelche kann auf eine Einladung oder Stelle hinweisen, die dich emotional anspricht, besonders in kreativen, künstlerischen, betreuenden oder menschenbezogenen Bereichen. Prüfe trotzdem Gehalt, Bedingungen und Entwicklung, denn die Karte spricht stärker über Passung als über materielle Stabilität."
    ]
  ],
  "pentacles-c1": [
    [
      "other",
      "Was für eine Persönlichkeit beschreibt diese Karte?",
      "Der Ritter der Münzen ist ausdauernd, praktisch und verantwortungsbewusst. Er muss nicht schnell sein; ein klares Ziel und gleichmäßige Schritte sind ihm wichtiger. Die Schattenseite sind Starrheit, reines Gewohnheitshandeln oder das Festhalten an einem Weg, der längst angepasst werden müsste."
    ],
    [
      "other",
      "Was ist die negative Seite dieser Karte?",
      "Ausdauer kann zu Sturheit werden und Praxisnähe zu Tunnelblick. Der Ritter der Münzen konzentriert sich manchmal so stark auf die aktuelle Aufgabe, dass er nicht mehr fragt, ob das ursprüngliche Ziel noch passt. Manchmal muss man die Richtung prüfen, nicht nur den Fortschritt."
    ],
    [
      "love",
      "Was möchte diese Person von mir und von der Beziehung?",
      "Die Person kann etwas Stabiles und Klares wollen, das sich mit der Zeit aufbauen lässt. Interesse zeigt sich oft durch Anwesenheit, eingehaltene Versprechen und praktische Taten. Das Tempo kann langsam sein, doch langsam bedeutet nicht lieblos."
    ],
    [
      "love",
      "Warum streiten wir so oft?",
      "Einer braucht vielleicht Stabilität und Planung, während der andere mehr Flexibilität oder Gefühlsausdruck möchte. Der Ritter der Münzen kann außerdem an „so machen wir es immer“ festhalten und Rückmeldungen schwer annehmen. Trennt echte Grundwerte von Gewohnheiten, über die man verhandeln kann."
    ],
    [
      "other",
      "Hast du ein Beispiel für den Tunnelblick dieser Karte?",
      "Du sparst vielleicht sehr diszipliniert für ein Ziel, ohne zu merken, dass es gar nicht mehr zu deinem Leben passt. Oder du erledigst jede Aufgabe exakt nach Vorschrift, ohne nach einer besseren Methode zu fragen. Das Problem ist nicht fehlender Einsatz, sondern fehlender Abstand zum Gesamtbild."
    ],
    [
      "career",
      "Ich bin seit Monaten arbeitslos. Finde ich einen Job, der mir gefällt?",
      "Der Ritter der Münzen unterstützt eher einen stabilen Weg als eine Veränderung über Nacht. Bewirb dich weiter, baue Fähigkeiten aus und bleib an Chancen dran. Eine passende Stelle kann durch beständige Arbeit entstehen; die Karte verspricht weder Zeitpunkt noch Gehalt."
    ],
    [
      "money",
      "Ist der Ritter der Münzen schlecht mit Geld?",
      "Nein. Das ist eine der praktischsten und diszipliniertesten Energien für Geld. Ihre Stärken sind regelmäßiges Sparen, Planung und das Verfolgen eines Ziels; die Schwäche ist so viel Vorsicht, dass vernünftige Chancen verpasst werden."
    ],
    [
      "career",
      "Ich habe einen normalen Bürojob. Was könnte sich bald ändern?",
      "Du kannst in eine Phase mit gleichmäßiger Arbeit, klaren Abläufen und einem längerfristigen Ziel kommen. Die Veränderung kann leise sein: mehr Verantwortung, stärkere Fähigkeiten oder ein klarerer Fokus. Unterschätze Fortschritt nicht, nur weil er nicht spektakulär ist."
    ],
    [
      "other",
      "Wie unterscheidet sich der Ritter der Münzen vom Ritter der Stäbe bei der Arbeit?",
      "Der Ritter der Stäbe setzt auf Tempo, Ausprobieren und Begeisterung; der Ritter der Münzen auf Verlässlichkeit, Prozess und Abschluss. Einer startet schnell, der andere hält den Rhythmus. Gute Arbeit braucht oft beides: genug Feuer zum Beginnen und genug Ausdauer zum Fertigwerden."
    ]
  ]
});

Object.assign(ASK.de, {
  "wands-c2": [
    [
      "other",
      "Was zeigt das Bild auf dieser Karte?",
      "Die Königin der Stäbe sitzt aufrecht auf ihrem Thron und hält einen Stab und eine Sonnenblume. Das Bild verbindet das Feuer der Stäbe mit der Ruhe einer Königin: Selbstvertrauen, Wärme, Kreativität und Führung, ohne ständig dominieren zu müssen."
    ],
    [
      "other",
      "Worin unterscheidet sich eine Königin von einem König?",
      "Königin und König stehen beide für einen reifen Umgang mit ihrem Element. Königinnen drücken es oft durch Aufnahmefähigkeit, Fürsorge und Einfluss von innen aus; Könige eher durch Handeln, Entscheidungen und äußere Struktur. Das sind unterschiedliche Ausdrucksweisen, keine Rangordnung von besser und schlechter."
    ],
    [
      "other",
      "Warum gilt die Königin der Stäbe als ausgeglichener als der König der Stäbe?",
      "In vielen Lehrtraditionen verbindet die Königin der Stäbe die Begeisterung des Feuers mit der Fähigkeit, ruhig zu bleiben und zu beobachten. Sie kann mutig handeln und trotzdem wissen, wann ein Schritt zurück sinnvoll ist. „Ausgeglichener“ ist eine hilfreiche Lernidee, kein starres Gesetz jeder Legung."
    ],
    [
      "other",
      "Was für eine Persönlichkeit beschreibt diese Karte?",
      "Diese Person ist oft selbstbewusst, begeistert, charismatisch und kann andere gut motivieren. Sie muss nicht die fachlich stärkste im Raum sein; häufig ist sie diejenige, die aufsteht, zuerst ausprobiert und andere an die Möglichkeit glauben lässt. Die Schattenseite kann Stolz oder zu viel Kontrolle über das eigene Bild sein."
    ],
    [
      "other",
      "Wie wirkt die Königin der Stäbe nach außen?",
      "Ihre Präsenz ist warm und zugleich gefestigt. Menschen mit dieser Energie müssen selten laut beweisen, dass sie da sind; Selbstvertrauen zeigt sich in Haltung, Sprache und Entscheidungen. Die Ausstrahlung kommt aus dem Gefühl, mit sich selbst im Reinen zu sein."
    ],
    [
      "love",
      "Hat diese Person Gefühle für mich?",
      "Die Königin der Stäbe ist positiv für Anziehung, Wärme und Interesse. Die Person kann dich auffällig finden oder gern in deiner Nähe sein. Eine einzelne Karte kann die Gefühle eines anderen nicht sicher bestätigen; lass Handlungen und klare Worte im echten Leben die Legung ergänzen."
    ],
    [
      "love",
      "Wir streiten oft. Was können wir verbessern?",
      "Diese Karte verlangt Ehrlichkeit und Respekt zugleich. Mach aus Selbstvertrauen keinen Machtkampf, aber schweig auch nicht nur, um Konflikte zu vermeiden. Sag, was du brauchst, wahre Grenzen und denk daran: Eine gesunde Beziehung verlangt von keinem, sich kleiner zu machen."
    ],
    [
      "career",
      "Finde ich bald einen Job, der mir gefällt?",
      "Die Königin der Stäbe unterstützt eine starke Selbstdarstellung in Bewerbungen, Gesprächen und Netzwerken. Eine passende Chance kann auf sichtbare Initiative und Selbstvertrauen reagieren. Bewirb dich weiter, statt nur zu warten, aber verteile deine Energie nicht auf Stellen, die du eigentlich gar nicht willst."
    ],
    [
      "career",
      "Ich bin schon lange arbeitslos und niemand meldet sich. Was soll ich tun?",
      "Mach aus der Arbeitslosigkeit nicht die Geschichte, du seist „nicht gut genug“. Prüfe Lebenslauf, Portfolio und Suchstrategie und hol dir ehrliches Feedback. Die Königin der Stäbe erinnert an Selbstvertrauen, das auf echter Fähigkeit beruht, und daran, diese Fähigkeit klarer zu zeigen."
    ],
    [
      "career",
      "Ich habe einen normalen Bürojob. Was könnte sich bald ändern?",
      "Du kannst eine aktivere Rolle bekommen: eine kleine Gruppe führen, neue Kollegen einarbeiten, eine Idee präsentieren oder das Team vertreten. Das muss keine formelle Beförderung sein. Entscheidend ist, dass andere stärker auf deine Fähigkeit setzen, zu führen und Energie zu geben."
    ]
  ],
  "swords-c2": [
    [
      "other",
      "Was zeigt das Bild auf dieser Karte?",
      "Die Königin der Schwerter sitzt auf ihrem Thron, hält das Schwert aufrecht und streckt die andere Hand offen nach vorn. Das Bild steht für Klarheit, deutliche Grenzen und die Fähigkeit, Wahrheit anzusehen und trotzdem zuzuhören."
    ],
    [
      "other",
      "Was für eine Persönlichkeit beschreibt diese Karte?",
      "Diese Person ist oft intelligent, unabhängig, aufmerksam und kommuniziert klar. Sie nutzt den Verstand, ohne deshalb kalt sein zu müssen. Erfahrung hat ihr gezeigt, was gesagt werden sollte, was man loslassen kann und welche Grenzen wichtig sind."
    ],
    [
      "other",
      "Ist diese Person scharfzüngig?",
      "Nicht unbedingt. Bei der Königin der Schwerter geht es mehr um Direktheit und Präzision als darum, andere absichtlich zu verletzen. In ihrer starken Form sagt sie Notwendiges und hört trotzdem zu; im Schatten können Abwehr oder Enttäuschung die Worte kalt und schneidend machen."
    ],
    [
      "love",
      "Was empfindet diese Person für mich?",
      "Die Person kann Gefühle haben und die Beziehung zugleich mit Herz und Verstand prüfen wollen. Vereinbarkeit, Kommunikation, Werte und gegenseitiger Respekt sind ihr wichtig. Zuneigung kann stiller sein als offene Romantik, ohne weniger ehrlich zu sein."
    ],
    [
      "love",
      "Ist diese Person aufrichtig?",
      "Diese Karte kann Aufrichtigkeit nicht beweisen. Sie zeigt eher jemanden, der sorgfältig abwägt und Klarheit braucht, bevor er sich ganz öffnet. Achte darauf, ob Worte und Handlungen zusammenpassen und deine Grenzen respektiert werden."
    ],
    [
      "love",
      "Ist diese Person die richtige für mich?",
      "Das hängt davon ab, was du in einer Beziehung brauchst. Wenn du Klarheit, Unabhängigkeit und direkte Kommunikation schätzt, kann diese Energie sehr gut passen. Brauchst du viel sichtbare emotionale Bestätigung, müsst ihr vielleicht lernen, die Fürsorge des anderen richtig zu lesen."
    ],
    [
      "love",
      "Warum streiten wir so oft?",
      "Vielleicht beginnt ihr beide mit Argumenten statt mit Gefühlen, oder einer glaubt, er sage „nur die Wahrheit“, während der andere sich verurteilt fühlt. Benennt Fakten und Gefühle und unterscheidet eine klare Grenze von einer kalten Art, sie auszusprechen."
    ],
    [
      "love",
      "Hast du ein Beispiel für so einen Streit?",
      "Eine Person sagt: „Das ist unlogisch“, obwohl sie eigentlich meint: „Ich fühle mich nicht wichtig.“ Die andere antwortet mit noch mehr Logik, und das Gespräch entfernt sich weiter vom eigentlichen Gefühl. Die Königin der Schwerter lädt dazu ein, das Problem präzise zu benennen, ohne den menschlichen Teil herauszunehmen."
    ],
    [
      "career",
      "Finde ich bald einen Job, der mir gefällt?",
      "Diese Karte passt zu Arbeit mit Analyse, Kommunikation, Schreiben, Forschung, Recht, Strategie oder eigenständigem Urteil. Chancen reagieren oft auf eine klare Darstellung deiner Fähigkeiten und gezielte Bewerbungen. Bewerte eine Stelle nach echten Kriterien, nicht nur danach, ob sich ein Gespräch gut angefühlt hat."
    ],
    [
      "career",
      "Ich habe einen normalen Bürojob. Was könnte sich bald ändern?",
      "Du musst vielleicht eine klarere Entscheidung treffen, beruflich eine Grenze setzen oder wirst zur Ansprechperson für Analyse und Urteil. Ein direktes Gespräch kann nötig sein. Bereite Fakten vor und bleib in der Formulierung ruhig und präzise."
    ]
  ],
  "cups-c2": [
    [
      "other",
      "Was zeigt das Bild auf dieser Karte?",
      "Die Königin der Kelche sitzt am Wasser und betrachtet einen kunstvoll geschlossenen Kelch. Das Bild deutet auf ein tiefes Gefühlsleben, starke Intuition und die Fähigkeit hin, Gefühle zu halten, ohne alles nach außen zu tragen."
    ],
    [
      "other",
      "Was für eine Persönlichkeit beschreibt diese Karte?",
      "Diese Person ist oft empathisch, feinfühlig, intuitiv und bemerkt schnell, wie andere sich fühlen. Sie kann sehr gut zuhören und Sicherheit vermitteln. Die Schattenseite ist, zu viele fremde Gefühle aufzunehmen oder die eigenen Grenzen zu vergessen."
    ],
    [
      "other",
      "Warum sagt man, diese Person habe sich selbst geheilt?",
      "Zieh aus der Königin der Kelche nicht den Schluss, jemand sei vollständig „geheilt“. Die Karte beschreibt eher eine reife Fähigkeit, Gefühle wahrzunehmen und zu versorgen. Erfahrung kann viel gelehrt haben, doch auch dieser Mensch bleibt verletzlich und hat weiterhin Themen, die Fürsorge brauchen."
    ],
    [
      "love",
      "Was empfindet diese Person für mich?",
      "Das ist eine warme Karte für Fürsorge, Empathie und tiefe Zuneigung. Die Person kann deine Gefühle ernst nehmen und möchte vielleicht, dass du dich sicher fühlst. Achte trotzdem darauf, wie diese Zuneigung gezeigt wird und ob Grenzen respektiert werden; gute Gefühle brauchen auch klare Handlungen."
    ],
    [
      "love",
      "Warum streiten wir so oft?",
      "Einer fühlt vielleicht sehr viel, sagt aber zu wenig, sodass der andere nicht weiß, was gebraucht wird. Vielleicht übernehmt ihr auch zu schnell die Stimmung des anderen. Sag klar, was du brauchst, und mach aus Empathie kein Gedankenlesen."
    ],
    [
      "love",
      "Wie weist diese Person jemanden zurück?",
      "In reifer Form versucht sie freundlich Nein zu sagen, die Gefühle des anderen zu beachten und die Grenze trotzdem zu halten. Die Schattenseite ist, eine Antwort hinauszuzögern oder gemischte Signale zu senden, weil sie niemanden verletzen möchte."
    ],
    [
      "career",
      "Finde ich bald einen Job, der mir gefällt?",
      "Die Königin der Kelche passt zu betreuender, beratender, kreativer, künstlerischer oder menschenbezogener Arbeit. Sie sagt mehr über emotionale Passung als über ein bestimmtes Gehalt. Prüfe deshalb auch die praktischen Bedingungen, damit Gefühl und materielle Bedürfnisse zusammenpassen."
    ],
    [
      "career",
      "Was könnte eine zweite berufliche Richtung für mich sein?",
      "Eine weitere Richtung wäre, in deiner jetzigen Arbeit mehr Zuhören, Kreativität oder Menschenverständnis einzusetzen. Du musst nicht zwingend den Beruf wechseln; Beratung, Kundenbetreuung, Experience Design oder Community-Arbeit können diese Energie stärker einbringen."
    ],
    [
      "career",
      "Ich habe einen normalen Bürojob. Was könnte sich bald ändern?",
      "Du kannst Aufgaben bekommen, die mehr Fingerspitzengefühl mit Menschen verlangen, oder Kollegen suchen häufiger deine Unterstützung. Nutze Empathie, ohne die Gefühle des ganzen Teams in dich aufzunehmen. Gute Grenzen helfen dir, zu unterstützen, ohne auszubrennen."
    ],
    [
      "other",
      "Hat diese Karte auch eine negative Seite?",
      "Ja. Zu viel Empathie kann dazu führen, fremde Gefühle aufzusaugen, zu idealisieren, schwer Nein zu sagen oder die eigenen Bedürfnisse zu vernachlässigen. In ihrer starken Form fühlt die Königin der Kelche tief und weiß trotzdem, was zu ihr gehört und was nicht."
    ]
  ],
  "pentacles-c2": [
    [
      "other",
      "Was zeigt das Bild auf dieser Karte?",
      "Die Königin der Münzen sitzt in einer üppigen Landschaft und hält eine Münze, als würde sie etwas Wertvolles versorgen. Das Bild verbindet Materielles mit Fürsorge: Stabilität aufbauen und sich um Körper, Zuhause, Geld und alles kümmern, was Zeit zum Wachsen braucht."
    ],
    [
      "other",
      "Was für eine Persönlichkeit beschreibt diese Karte?",
      "Diese Person ist oft praktisch, verlässlich, fürsorglich und setzt Anteilnahme gern in konkrete Taten um. Geld, Gesundheit, Zuhause und alltägliche Bedürfnisse sind ihr wichtig. Die Schattenseite ist, zu viel Verantwortung zu tragen oder den eigenen Wert daran zu messen, wie nützlich man für andere ist."
    ],
    [
      "other",
      "Worin unterscheidet sich die Königin der Münzen vom König der Münzen?",
      "Beide sind praktisch und schätzen Stabilität. Die Königin der Münzen zeigt das häufig durch Fürsorge, Pflege und den unmittelbaren Umgang mit Ressourcen; der König eher durch Systeme, Besitz, Verwaltung und langfristige Ergebnisse. Es sind zwei ergänzende Ausdrucksformen derselben Farbe."
    ],
    [
      "love",
      "Was denkt diese Person über mich, und liebt sie mich wirklich?",
      "Die Person kann die Beziehung ernst und praktisch betrachten: Könnt ihr füreinander sorgen und ein stabiles Leben aufbauen? Das bedeutet nicht, dass Zuneigung nur an Bedingungen hängt. Achte darauf, ob zur Vernunft auch Wärme, Respekt und beständiger Einsatz kommen."
    ],
    [
      "other",
      "Können Münzen auch negative Bedeutungen haben?",
      "Ja. Jede Farbe hat eine Schattenseite. Stabilität kann zu Festhalten werden, Praxisnähe zu Materialismus, Sparen zu Mangelangst und Fürsorge zu Kontrolle. Lies Intensität und Kontext, statt Münzen pauschal als „gut für Geld“ zu behandeln."
    ],
    [
      "love",
      "Warum streiten wir so oft?",
      "Der Konflikt kann Geld, Haushalt, Zeit, Verantwortung oder das Gefühl betreffen, dass einer zu viel trägt. Vielleicht zeigt ihr beide Liebe durch Taten und vergesst dabei, Wichtiges auszusprechen. Teilt Aufgaben klar und fragt einander, wodurch sich jeder wirklich umsorgt fühlt."
    ],
    [
      "career",
      "Finde ich bald einen Job, der mir gefällt?",
      "Die Königin der Münzen ist ermutigend für ein stabiles, praktisches Umfeld, das dein Leben tragen kann. Sie sollte aber kein bestimmtes Gehalt oder Einstellungsergebnis versprechen. Achte auf klare Bedingungen, eine nachhaltige Kultur und eine Arbeitsmenge, die du wirklich halten kannst."
    ],
    [
      "money",
      "Ich habe einen normalen Bürojob. Was könnte sich bald tun?",
      "Dir können Ressourcen, Kunden, ein Budget oder Aufgaben anvertraut werden, die Verlässlichkeit brauchen. Finanzen können geordneter werden, wenn du stetig arbeitest und gut verwaltest. Nimm nicht jede Zusatzaufgabe nur deshalb an, weil andere wissen, dass sie sich auf dich verlassen können."
    ],
    [
      "other",
      "Welche der vier Königinnen ist am positivsten?",
      "Keine Königin ist bei jeder Frage „am positivsten“. Jede hat ihre Stärke: Stäbe bei Selbstvertrauen und Handeln, Schwerter bei Klarheit, Kelche bei Gefühlen, Münzen bei Stabilität und Fürsorge. Welche am hilfreichsten ist, hängt von Frage und Position in der Legung ab."
    ]
  ]
});

Object.assign(ASK.de, {
  "wands-c3": [
    [
      "other",
      "Was zeigt das Bild auf dieser Karte?",
      "Der König der Stäbe sitzt mit einem Stab auf seinem Thron, umgeben von Feuersymbolen. Das Bild zeigt jemanden, der gelernt hat, Leidenschaft in Richtung zu verwandeln: visionär, entschlossen und bereit, Verantwortung für den gewählten Weg zu tragen."
    ],
    [
      "other",
      "Was für eine Persönlichkeit beschreibt diese Karte?",
      "Diese Person ist oft selbstbewusst, ehrgeizig, visionär und handelt gern aus eigener Initiative. Sie übernimmt leicht die Führung, weil sie andere mit Energie anstecken kann. Die Schattenseite sind Ungeduld, Dominanz oder die Überzeugung, nur der eigene Weg sei richtig."
    ],
    [
      "other",
      "Ist das jemand, der keine Angst kennt?",
      "Nein. Mut bedeutet nicht, keine Angst zu haben. Der König der Stäbe erkennt Risiken meist und handelt trotzdem, wenn das Ziel es wert ist. In reifer Form nutzt er Angst als Information, statt sie die Entscheidung steuern zu lassen."
    ],
    [
      "other",
      "Wie unterscheidet sich der König der Stäbe von der Königin der Stäbe?",
      "Beide sind selbstbewusst und charismatisch. Die Königin der Stäbe führt oft über Einfluss, Wärme und Ermutigung; der König setzt eher Richtung, trifft Entscheidungen und bewegt Menschen auf ein Ziel zu. Das sind zwei Führungsstile, keine Rangordnung."
    ],
    [
      "career",
      "Bedeutet ein König, dass die Person eine Führungskraft ist?",
      "Nicht unbedingt. Ein König kann jemanden mit Entscheidungsmacht beschreiben, eine Rolle mit viel Eigenverantwortung oder einfach die Haltung, die du in der Situation brauchst. Mach aus einem symbolischen Rang keinen festen Berufstitel."
    ],
    [
      "love",
      "Was denkt diese Person über mich?",
      "Die Person kann dich anziehend finden und die Beziehung aktiv voranbringen wollen. Sie weiß häufig, was sie möchte, und kann ihre Absicht klar zeigen. Achte darauf, ob diese Initiative auch dein Tempo und deine Entscheidungen respektiert."
    ],
    [
      "love",
      "Warum streiten wir so oft?",
      "Konflikte entstehen leicht, wenn einer oder beide das Steuer übernehmen wollen. Selbstvertrauen wird zu Sturheit, Entschlossenheit klingt wie ein Befehl. Klärt, wo einer führen kann und wo Entscheidungen gemeinsam getroffen werden müssen."
    ],
    [
      "career",
      "Finde ich bald einen Job, der mir gefällt?",
      "Der König der Stäbe passt zu Rollen mit Initiative, Kreativität, Führung oder der Chance, etwas Eigenes aufzubauen. Such nach einem Umfeld, in dem du Vision und Verantwortung einbringen kannst. Die Karte garantiert keine Einstellung, ermutigt aber dazu, deinen Wert und deine Richtung klar zu zeigen."
    ],
    [
      "career",
      "Ich habe einen normalen Bürojob. Worauf sollte ich bald achten?",
      "Du kannst gebeten werden, ein Projekt zu führen, größere Entscheidungen zu treffen oder eng mit einer sehr willensstarken Person zu arbeiten. Sei aktiv, ohne alles kontrollieren zu wollen. Gute Führung gibt Richtung und lässt anderen Raum für ihren Beitrag."
    ],
    [
      "other",
      "Ist diese Karte positiv oder negativ?",
      "Der König der Stäbe ist nicht automatisch gut oder schlecht. Seine helle Seite sind Vision, Mut und Führung; seine Schattenseite Ego, Ungeduld und Dominanz. Frage, Position und Nachbarkarten zeigen, wie die Energie gerade gelebt wird."
    ]
  ],
  "swords-c3": [
    [
      "other",
      "Was zeigt das Bild auf dieser Karte?",
      "Der König der Schwerter sitzt aufrecht auf seinem Thron und hält das Schwert senkrecht. Das Bild betont Vernunft, Entscheidungsmacht, Prinzipien und systematisches Denken. Hier wird Intelligenz zum Urteilen und Entscheiden eingesetzt, nicht nur zum Beobachten."
    ],
    [
      "other",
      "Worin unterscheidet sich der König der Schwerter von der Königin der Schwerter?",
      "Beide schätzen Wahrheit und klares Denken. Die Königin der Schwerter betont häufig Wahrnehmung, Grenzen und Unabhängigkeit; der König eher Entscheidungen, Regeln und Verantwortung für ein Urteil. Der Unterschied liegt in der Anwendung des Verstands, nicht darin, wer klüger ist."
    ],
    [
      "other",
      "Was bedeutet „rücksichtslos“ hier?",
      "„Rücksichtslos“ lässt diese Karte schnell härter wirken als nötig. Treffender ist als Schatten: zu kalt, zu regelgebunden oder Effizienz wichtiger nehmen als menschliche Gefühle. In reifer Form kann der König der Schwerter schwierige Entscheidungen treffen und trotzdem auf Fakten und Ethik achten."
    ],
    [
      "other",
      "Ist der König der Schwerter so scharfzüngig wie der Ritter der Schwerter?",
      "Der König der Schwerter kann sehr direkt sein, wählt in reifer Form seine Worte aber bewusst und kennt ihre Wirkung. Der Ritter reagiert schnell; der König spricht mit Absicht. Die Schattenseite beginnt, wenn Direktheit zu Geringschätzung wird oder Logik zum Überwältigen benutzt wird."
    ],
    [
      "love",
      "Was denkt diese Person über mich und die Beziehung?",
      "Die Person kann die Beziehung ernsthaft und logisch prüfen: Passen eure Werte, könnt ihr kommunizieren und lässt sich eine Zukunft aufbauen? Sie zeigt Gefühle vielleicht weniger offen, doch das bedeutet nicht automatisch Unaufrichtigkeit. Achte auf Beständigkeit und Respekt."
    ],
    [
      "love",
      "Wie würde diese Person ihre Gefühle gestehen?",
      "Sie bevorzugt meist Klarheit statt Ratespiele. Wenn sie vorankommen möchte, sagt sie vielleicht direkt, was sie will, und fragt nach deiner Sicht. Das kann weniger poetisch sein und trotzdem warm, wenn sie deine Antwort wirklich hört, statt nur eine Entscheidung zu verlangen."
    ],
    [
      "love",
      "Warum streiten wir so oft?",
      "Vielleicht verwandelt einer jedes Thema sofort in ein Problem, das gelöst werden muss, während der andere erst gehört werden möchte. Oder ihr hängt beide zu stark daran, wer recht hat. Lernt zu unterscheiden, wann eine Lösung nötig ist und wann zuerst ein Gefühl anerkannt werden muss."
    ],
    [
      "career",
      "Ich bin seit Monaten arbeitslos. Finde ich Arbeit?",
      "Der König der Schwerter passt zu einer strategischen Prüfung der Jobsuche: Zielrollen wählen, Lebenslauf überarbeiten, Gespräche üben und anhand von Rückmeldungen sehen, was nicht funktioniert. Analyse, Technik, Forschung, Recht oder fachliche Kommunikation können gut passen, doch die Karte garantiert keine Einstellung."
    ],
    [
      "career",
      "Welche Position werde ich in einem neuen Job haben?",
      "Die Karte kann eine Rolle mit Urteilskraft, Verantwortung, Strategie oder fachlicher Kommunikation anzeigen. Das muss kein Führungstitel sein. Verlass dich auf die echte Stellenbeschreibung, um Befugnisse zu verstehen, statt sie aus dem Rang „König“ abzuleiten."
    ],
    [
      "career",
      "Ich habe einen normalen Bürojob. Was könnte sich bald ändern?",
      "Eine wichtige Entscheidung, ein neuer Ablauf oder ein Problem mit hohem Analysebedarf kann anstehen. Auch eine sehr rationale Person mit Entscheidungsmacht kann wichtiger werden. Bereite Fakten vor, dokumentiere Absprachen und halte die Kommunikation professionell."
    ]
  ],
  "cups-c3": [
    [
      "other",
      "Was zeigt das Bild auf dieser Karte?",
      "Der König der Kelche sitzt auf einem Thron, umgeben von bewegtem Wasser. Gefühle sind weiterhin um ihn herum, reißen ihn aber nicht mit. Das Bild steht für emotionale Reife, Ruhe und die Fähigkeit, bei sich zu bleiben, während sich die Umstände bewegen."
    ],
    [
      "other",
      "Was für eine Persönlichkeit beschreibt diese Karte?",
      "Diese Person ist oft ruhig, hört gut zu und hat ein reiches Gefühlsleben, ohne jede Entscheidung vom jeweiligen Gefühl abhängig zu machen. Sie kann warm und unterstützend sein. Die Schattenseite ist, Gefühle zu stark zu verbergen oder Ruhe zu benutzen, um ein nötiges Gespräch zu vermeiden."
    ],
    [
      "love",
      "Wird diese Person mir ihre Gefühle gestehen?",
      "Der König der Kelche kann jemanden zeigen, der seine Gefühle versteht und reif genug ist, sie auszudrücken. Tarot kann ein Geständnis aber nicht garantieren. Achte auf echte Zeichen: Initiative, Beständigkeit und darauf, wie die Person über eure Verbindung spricht."
    ],
    [
      "love",
      "Was empfindet diese Person für mich?",
      "Das ist eine starke Karte für tiefe Zuneigung, Fürsorge und emotional reife Liebe. Die Person kann deine Gefühle wirklich verstehen und unterstützen wollen. Wie tief das geht, muss sich trotzdem in Handlungen und echter Kommunikation zeigen."
    ],
    [
      "love",
      "Wir lieben uns seit Jahren, streiten aber oft. Warum?",
      "Streit bedeutet nicht, dass die Liebe verschwunden ist. Beim König der Kelche hält vielleicht einer zu viel zurück, um „ruhig zu bleiben“, oder übernimmt ständig die Rolle des Friedensstifters, bis eigene Bedürfnisse verschwinden. Ihr müsst möglicherweise auch Schwieriges aussprechen, nicht nur Harmonie bewahren."
    ],
    [
      "career",
      "Finde ich bald einen Job, der mir gefällt?",
      "Der König der Kelche passt zu Arbeit, die Ruhe, Menschenkenntnis, Beratung, Kreativität, Fürsorge oder emotionale Stabilität unter Druck braucht. Er kann auf eine gute atmosphärische Passung hinweisen, verspricht aber weder Gehalt noch Einstellung."
    ],
    [
      "other",
      "Wie erkenne ich, ob der Job gut bezahlt wird?",
      "Tarot kann weitere Fragen zu Geld anstoßen. Ob eine Stelle gut bezahlt wird, prüfst du aber über Gehalt, Zusatzleistungen, Fahrtkosten und realistische Entwicklung. Eine Kelchkarte sagt mehr über die emotionale Erfahrung als über die Zahl auf der Abrechnung."
    ],
    [
      "career",
      "Was könnte eine zweite berufliche Richtung für mich sein?",
      "Eine weitere Richtung sind Tätigkeiten mit viel emotionaler Intelligenz: Beratung, Kundenbetreuung, Personalführung, Bildung, Kunst, Service oder Unterstützung. Du kannst solche Fähigkeiten auch stärker in deinen jetzigen Beruf einbringen, ohne die Branche komplett zu wechseln."
    ],
    [
      "career",
      "Ich habe einen normalen Bürojob. Was könnte sich bald ändern?",
      "Eine Situation kann kommen, die ruhigen Umgang mit Menschen oder Vermittlung verlangt. Nutze deine Gelassenheit, aber mach dich nicht für die Gefühle des ganzen Teams verantwortlich. Unterstützung und Grenzen schließen einander nicht aus."
    ],
    [
      "other",
      "Kann diese Karte eine konkrete Person beschreiben?",
      "Ja. Hofkarten können einen Menschen, eine Rolle oder eine Verhaltensweise beschreiben. Der König der Kelche kann für jemanden stehen, der ruhig, aufmerksam und emotional kompetent ist. Ordne die Karte nur dann einer konkreten Person zu, wenn Legung und reale Situation wirklich zusammenpassen."
    ]
  ],
  "pentacles-c3": [
    [
      "other",
      "Was zeigt das Bild auf dieser Karte?",
      "Der König der Münzen sitzt auf einem Thron, umgeben von Symbolen für Fülle und Natur. Das Bild spricht von Ergebnissen, die über Zeit aufgebaut wurden: Geld, Ressourcen, Arbeit und Werte verwalten, die Bestand haben können."
    ],
    [
      "other",
      "Was für eine Persönlichkeit beschreibt diese Karte?",
      "Diese Person ist oft praktisch, stabil, geduldig und gut im Umgang mit Ressourcen. Dauerhafte Ergebnisse sind ihr wichtiger als kurzfristige Aufregung, und sie denkt häufig langfristig. Die Schattenseite ist, Status, Geld, Kontrolle oder Sicherheit zu stark zu gewichten."
    ],
    [
      "love",
      "Was empfindet diese Person für mich?",
      "Die Person kann die Beziehung langfristig und praktisch betrachten: gemeinsames Leben, Finanzen, Zuhause oder Pläne. Praxisnähe macht Liebe nicht weniger ehrlich. Achte neben materieller Unterstützung auch auf Wärme, Respekt und emotionale Investition."
    ],
    [
      "love",
      "Was ist anders daran, so einen Menschen zu lieben?",
      "Diese Energie ist oft weniger spektakulär und dafür beständiger als eine sehr dramatische Romanze. Fürsorge zeigt sich durch eingehaltene Versprechen, Anwesenheit, Planung und Sicherheit. Wichtig ist, Stabilität von Kontrolle und materielle Versorgung von emotionaler Nähe zu unterscheiden."
    ],
    [
      "love",
      "Wir sind seit Jahren zusammen, streiten aber oft. Bedeutet das eine Trennung?",
      "Eine Karte kann nicht entscheiden, ob ihr euch trennt. Der König der Münzen richtet den Blick auf langfristige Werte: Geld, Familie, Wohnort, Bindung und Zukunftsplanung. Wenn dort der Konflikt liegt, klärt, was verhandelbar ist und was wirklich nicht."
    ],
    [
      "love",
      "Wann müssen sich zwei Menschen trennen?",
      "Keine Karte kann festlegen, dass zwei Menschen sich „trennen müssen“. Wenn Grundwerte wie Kinderwunsch, Ehe, Sicherheit, Respekt oder Lebensform nicht vereinbar sind, kann eine Trennung eine gesunde Entscheidung sein. Diese Entscheidung gehört den Beteiligten, nicht dem Tarot."
    ],
    [
      "money",
      "Finde ich bald einen Job?",
      "Der König der Münzen ist ein positives Symbol für Stabilität und materielle Kompetenz, kann aber weder Stelle noch Gehalt garantieren. Achte auf klare Bezahlung, Bedingungen und Entwicklung. Symbolisch passt die Karte besonders zu Management, Geschäft oder Rollen mit materieller Verantwortung."
    ],
    [
      "money",
      "Ich habe einen normalen Bürojob. Was könnte sich bald ändern?",
      "Du kannst mehr Verantwortung übernehmen, Ressourcen verwalten oder eine nachhaltige Möglichkeit zur Einkommensverbesserung sehen. Auch eine finanziell einflussreiche oder leitende Person kann wichtig werden. Prüfe Veränderungen mit echten Informationen statt die Karte als Beförderungsversprechen zu lesen."
    ],
    [
      "other",
      "Hast du ein Beispiel dafür, mit einer weiteren Karte tieferzugehen?",
      "Ja. Wenn dich der König der Münzen an einen Vorgesetzten erinnert, leg vorher fest, dass die nächste Karte fragt: „Wie beeinflusst diese Person meine Arbeit?“. Die Drei der Münzen könnte dann zum Beispiel Zusammenarbeit oder Teambildung anzeigen. Stell pro Zusatzkarte eine klare Frage, statt so lange zu ziehen, bis dir eine Antwort gefällt."
    ]
  ]
});
