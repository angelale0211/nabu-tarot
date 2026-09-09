# -*- coding: utf-8 -*-
"""astro-deep.js, section 26: ZDEEP rewritten in VI/EN (appearance and body
descriptions removed) with a German column, plus German CHEM_TEXT."""
import io, re, sys

p = 'src/astro-deep.js'
s = io.open(p, encoding='utf-8').read()

COMPAT = {
 'ari': ['leo', 'sag', 'gem', 'aqu'], 'tau': ['vir', 'cap', 'can', 'pis'],
 'gem': ['lib', 'aqu', 'ari', 'leo'], 'can': ['sco', 'pis', 'tau', 'vir'],
 'leo': ['ari', 'sag', 'gem', 'lib'], 'vir': ['tau', 'cap', 'can', 'sco'],
 'lib': ['gem', 'aqu', 'leo', 'sag'], 'sco': ['can', 'pis', 'vir', 'cap'],
 'sag': ['ari', 'leo', 'lib', 'aqu'], 'cap': ['tau', 'vir', 'sco', 'pis'],
 'aqu': ['gem', 'lib', 'ari', 'sag'], 'pis': ['can', 'sco', 'tau', 'cap'],
}

D = {
 'ari': {
  'vi': (['chủ động', 'thẳng thắn', 'nhiệt huyết'], ['dễ nôn nóng', 'nhanh chán', 'phản ứng nhanh'],
   'Mặt Trăng Bạch Dương: cảm xúc thường đến nhanh và cũng nguôi khá nhanh. Bạn cần được phản ứng thật với điều mình cảm thấy, có không gian riêng và một việc gì đó để dồn năng lượng vào. Khi bực, hãy cho mình một nhịp trước khi hành động.',
   'Cung Mọc Bạch Dương: bạn thường tạo ấn tượng nhanh, thẳng và chủ động. Người khác có thể thấy bạn là người sẵn sàng bắt đầu trước, nói điều mình nghĩ và không thích vòng vo.'),
  'en': (['proactive', 'direct', 'enthusiastic'], ['impatient', 'bored quickly', 'reactive'],
   'Moon in Aries: feelings often arrive quickly and can pass just as quickly. You need room to react honestly, a sense of independence and something constructive to pour your energy into. When anger rises, giving yourself one beat before acting can help.',
   'Aries rising: you often come across as quick, direct and ready to act. Others may see you as someone who starts first, says what they mean and has little patience for unnecessary detours.'),
  'de': (['initiativ', 'direkt', 'begeisterungsfähig'], ['ungeduldig', 'schnell gelangweilt', 'reaktiv'],
   'Mond im Widder: Gefühle kommen oft schnell und können ebenso schnell wieder abklingen. Du brauchst Raum, ehrlich zu reagieren, ein Gefühl von Eigenständigkeit und etwas Sinnvolles, in das du deine Energie stecken kannst. Wenn Ärger hochkommt, hilft oft ein kurzer Moment, bevor du handelst.',
   'Aszendent Widder: Du wirkst häufig schnell, direkt und handlungsbereit. Andere können dich als jemanden erleben, der gern den ersten Schritt macht, klar sagt, was er meint, und wenig Geduld für unnötige Umwege hat.')},
 'tau': {
  'vi': (['ổn định', 'đáng tin', 'biết tận hưởng'], ['cứng đầu', 'ngại thay đổi', 'dễ bám chặt'],
   'Mặt Trăng Kim Ngưu: bạn thường thấy yên khi cuộc sống có nền tảng rõ ràng — ăn ngủ đủ, tài chính có kế hoạch và ở cạnh những người quen thuộc. Bạn không nhất thiết bộc lộ cảm xúc ngay, nhưng điều khiến bạn tổn thương có thể cần nhiều thời gian để nguôi.',
   'Cung Mọc Kim Ngưu: bạn thường tạo cảm giác điềm tĩnh, ấm áp và không vội vàng. Người khác có thể thấy ở bạn sự ổn định và đáng tin ngay từ lần đầu gặp.'),
  'en': (['steady', 'reliable', 'knows how to enjoy life'], ['stubborn', 'resists change', 'holds on too tightly'],
   'Moon in Taurus: you tend to feel safest when life has solid ground — enough rest, practical security and familiar people around you. You may not show every feeling immediately, but hurts can take time to soften.',
   'Taurus rising: you often come across as calm, warm and unhurried. People may notice a grounded quality and find you dependable from the start.'),
  'de': (['beständig', 'zuverlässig', 'genussfähig'], ['stur', 'veränderungsscheu', 'hält zu lange fest'],
   'Mond im Stier: Du fühlst dich meist dann am sichersten, wenn dein Leben festen Boden hat — genug Ruhe, praktische Sicherheit und vertraute Menschen um dich herum. Du zeigst nicht jedes Gefühl sofort, und Verletzungen brauchen manchmal Zeit, bis sie weicher werden.',
   'Aszendent Stier: Du wirkst häufig ruhig, warm und unaufgeregt. Andere nehmen oft etwas Bodenständiges an dir wahr und erleben dich von Anfang an als verlässlich.')},
 'gem': {
  'vi': (['học nhanh', 'giao tiếp tốt', 'linh hoạt'], ['hay đổi ý', 'dễ lướt bề mặt', 'dễ bồn chồn'],
   'Mặt Trăng Song Tử: bạn thường xử lý cảm xúc bằng cách nói, viết hoặc suy nghĩ thành lời. Khi buồn, một cuộc trò chuyện, một góc nhìn mới hay đổi không khí có thể giúp bạn hơn là ngồi im với cảm xúc quá lâu.',
   'Cung Mọc Song Tử: bạn thường tạo ấn tượng tò mò, nhanh nhạy và dễ bắt chuyện. Người khác có thể thấy bạn linh hoạt, nhiều ý tưởng và luôn để ý những gì đang diễn ra xung quanh.'),
  'en': (['quick learner', 'communicative', 'adaptable'], ['changes direction often', 'skims the surface', 'restless'],
   'Moon in Gemini: you often process feelings by talking, writing or thinking them into words. When you are low, a conversation, a fresh perspective or a change of scene may help more than sitting still with the feeling for too long.',
   'Gemini rising: you often come across as curious, quick and easy to talk to. Others may notice your flexibility, your many ideas and how alert you are to what is happening around you.'),
  'de': (['lernt schnell', 'kommunikativ', 'anpassungsfähig'], ['wechselt oft die Richtung', 'bleibt manchmal an der Oberfläche', 'unruhig'],
   'Mond in den Zwillingen: Du verarbeitest Gefühle oft, indem du darüber sprichst, schreibst oder sie in Gedanken in Worte fasst. Wenn es dir nicht gut geht, können ein Gespräch, eine neue Perspektive oder ein Tapetenwechsel hilfreicher sein, als zu lange still im Gefühl zu sitzen.',
   'Aszendent Zwillinge: Du wirkst häufig neugierig, schnell und zugänglich. Andere bemerken oft deine Flexibilität, deine vielen Ideen und wie aufmerksam du deine Umgebung wahrnimmst.')},
 'can': {
  'vi': (['quan tâm', 'trực giác tốt', 'trung thành'], ['dễ thu mình', 'hay nhớ chuyện cũ', 'khó nói thẳng khi tổn thương'],
   'Mặt Trăng Cự Giải: cảm xúc là một phần rất lớn trong cách bạn định hướng cuộc sống. Bạn cần một nơi an toàn để quay về, những mối quan hệ có cảm giác thuộc về và thời gian để chăm sóc cả mình lẫn người mình thương.',
   'Cung Mọc Cự Giải: bạn thường tạo ấn tượng dịu dàng, biết quan tâm và hơi dè dặt lúc đầu. Người khác dễ cảm thấy được lắng nghe khi ở cạnh bạn.'),
  'en': (['caring', 'intuitive', 'loyal'], ['withdraws when hurt', 'dwells on the past', 'can be indirect'],
   'Moon in Cancer: feelings play a large part in how you navigate life. You need a safe place to return to, relationships that feel like home and enough time to care for both yourself and the people you love.',
   'Cancer rising: you often come across as gentle, caring and a little guarded at first. People may find it easy to open up around you because they feel listened to.'),
  'de': (['fürsorglich', 'intuitiv', 'loyal'], ['zieht sich bei Verletzung zurück', 'hängt an Vergangenem', 'manchmal indirekt'],
   'Mond im Krebs: Gefühle spielen eine große Rolle dabei, wie du dich im Leben orientierst. Du brauchst einen sicheren Ort zum Zurückkehren, Beziehungen mit einem Gefühl von Zuhause und genügend Zeit, dich sowohl um dich selbst als auch um geliebte Menschen zu kümmern.',
   'Aszendent Krebs: Du wirkst oft sanft, fürsorglich und zunächst etwas vorsichtig. Andere öffnen sich dir häufig leichter, weil sie sich bei dir gehört fühlen.')},
 'leo': {
  'vi': (['ấm áp', 'hào phóng', 'tự tin'], ['cần được công nhận', 'dễ tự ái', 'đôi lúc kịch tính'],
   'Mặt Trăng Sư Tử: bạn cần cảm thấy mình được nhìn thấy và trân trọng. Bạn yêu rất hết lòng, nên sự thờ ơ dễ chạm vào lòng tự trọng. Khi được tự do thể hiện tình cảm và sáng tạo, bạn thường trở nên rộng rãi và ấm áp nhất.',
   'Cung Mọc Sư Tử: bạn thường tạo ấn tượng nổi bật, ấm áp và có sức hiện diện. Người khác có thể thấy bạn tự tin hoặc dễ thu hút sự chú ý, kể cả khi bên trong bạn không phải lúc nào cũng chắc chắn như vậy.'),
  'en': (['warm', 'generous', 'confident'], ['needs recognition', 'pride can be tender', 'can be dramatic'],
   'Moon in Leo: you need to feel seen and appreciated. You love wholeheartedly, so indifference can touch your pride quickly. When you have room to express affection and creativity, your warmest and most generous side tends to come forward.',
   'Leo rising: you often make a noticeable, warm impression and carry a strong presence. Others may read you as confident or naturally attention-drawing, even when you do not always feel that certain inside.'),
  'de': (['warmherzig', 'großzügig', 'selbstbewusst'], ['braucht Anerkennung', 'empfindlicher Stolz', 'manchmal dramatisch'],
   'Mond im Löwen: Du möchtest gesehen und wertgeschätzt werden. Du liebst mit ganzem Herzen, deshalb kann Gleichgültigkeit deinen Stolz schnell treffen. Wenn du Zuneigung und Kreativität frei ausdrücken kannst, zeigt sich meist deine wärmste und großzügigste Seite.',
   'Aszendent Löwe: Du hinterlässt oft einen auffälligen, warmen Eindruck und hast eine starke Präsenz. Andere können dich als selbstbewusst oder von Natur aus aufmerksamkeitsstark wahrnehmen, auch wenn du dich innerlich nicht immer so sicher fühlst.')},
 'vir': {
  'vi': (['tỉ mỉ', 'hay giúp đỡ', 'thực tế'], ['hay lo', 'dễ soi xét', 'khắt khe với bản thân'],
   'Mặt Trăng Xử Nữ: bạn thường bình tâm hơn khi mọi thứ có trật tự và bạn biết mình có thể làm gì tiếp theo. Bạn dễ biến sự quan tâm thành việc sửa chữa hoặc giúp đỡ; điều cần học là không phải cảm xúc nào cũng cần được giải quyết ngay.',
   'Cung Mọc Xử Nữ: bạn thường tạo ấn tượng gọn gàng, quan sát kỹ và hơi thận trọng. Người khác có thể xem bạn là người đáng tin, thực tế và có mắt nhìn chi tiết.'),
  'en': (['meticulous', 'helpful', 'practical'], ['worries', 'can be critical', 'hard on self'],
   'Moon in Virgo: you often feel calmer when things are organised and you know what the next useful step is. You may turn care into fixing or helping; one lesson is that not every feeling needs to be solved immediately.',
   'Virgo rising: you often come across as neat, observant and a little cautious. Others may see you as dependable, practical and attentive to detail.'),
  'de': (['gründlich', 'hilfsbereit', 'praktisch'], ['sorgt sich viel', 'kritisch', 'streng mit sich selbst'],
   'Mond in der Jungfrau: Du wirst oft ruhiger, wenn Dinge geordnet sind und du weißt, was der nächste sinnvolle Schritt ist. Fürsorge wird bei dir leicht zu Helfen oder Reparieren; eine wichtige Lektion kann sein, dass nicht jedes Gefühl sofort gelöst werden muss.',
   'Aszendent Jungfrau: Du wirkst häufig ordentlich, aufmerksam und etwas vorsichtig. Andere erleben dich oft als verlässlich, praktisch und detailorientiert.')},
 'lib': {
  'vi': (['công bằng', 'duyên dáng', 'biết lắng nghe'], ['khó quyết', 'né xung đột', 'dễ dựa vào phản ứng của người khác'],
   'Mặt Trăng Thiên Bình: bạn cần sự hài hòa để thấy lòng mình yên. Xung đột kéo dài dễ làm bạn mệt, và bạn thường hiểu cảm xúc của mình rõ hơn khi được nói chuyện với một người tin cậy. Cái đẹp và không gian dễ chịu cũng giúp bạn cân bằng.',
   'Cung Mọc Thiên Bình: bạn thường tạo ấn tượng lịch sự, dễ gần và biết cân nhắc người khác. Người ta có thể tìm đến bạn khi cần một người nhìn được cả hai phía.'),
  'en': (['fair-minded', 'charming', 'good listener'], ['indecisive', 'avoids conflict', 'can lean on others’ reactions'],
   'Moon in Libra: you need harmony to feel settled. Prolonged conflict can drain you, and you often understand your own feelings more clearly when you can talk them through with someone you trust. Beauty and a pleasant environment can help you rebalance too.',
   'Libra rising: you often come across as polite, approachable and considerate. People may turn to you when they need someone who can see more than one side.'),
  'de': (['fair', 'charmant', 'guter Zuhörer'], ['unentschlossen', 'meidet Konflikte', 'orientiert sich leicht an Reaktionen anderer'],
   'Mond in der Waage: Du brauchst Harmonie, um dich innerlich ausgeglichen zu fühlen. Längerer Streit kann dich stark erschöpfen, und oft verstehst du deine eigenen Gefühle besser, wenn du sie mit einem vertrauten Menschen besprechen kannst. Auch Schönheit und eine angenehme Umgebung helfen dir, wieder Balance zu finden.',
   'Aszendent Waage: Du wirkst häufig höflich, zugänglich und rücksichtsvoll. Andere kommen gern auf dich zu, wenn sie jemanden brauchen, der mehrere Seiten einer Situation sehen kann.')},
 'sco': {
  'vi': (['sâu sắc', 'trung thành', 'bền bỉ'], ['dễ ghen', 'kín đáo', 'khó buông tổn thương'],
   'Mặt Trăng Bọ Cạp: cảm xúc của bạn thường sâu và riêng tư. Bạn cần sự thật, lòng tin và cảm giác rằng mối quan hệ đủ an toàn để mình không phải đề phòng. Khi bị tổn thương, bạn có thể cần nhiều thời gian để thật sự buông xuống.',
   'Cung Mọc Bọ Cạp: bạn thường tạo ấn tượng mạnh, kín đáo và khó đọc ngay từ đầu. Người khác có thể cảm nhận ở bạn sự tập trung và chiều sâu trước khi họ biết nhiều về bạn.'),
  'en': (['deep', 'loyal', 'resilient'], ['jealous', 'private', 'slow to release hurt'],
   'Moon in Scorpio: your feelings tend to run deep and stay private. You need truth, trust and a sense that a relationship is safe enough for you to lower your guard. When hurt, you may need more time than others expect to truly let it go.',
   'Scorpio rising: you often make a strong, private and hard-to-read first impression. Others may sense your focus and depth before they know very much about you.'),
  'de': (['tiefgründig', 'loyal', 'widerstandsfähig'], ['eifersüchtig', 'verschlossen', 'lässt Verletzungen langsam los'],
   'Mond im Skorpion: Deine Gefühle gehen meist tief und bleiben zunächst privat. Du brauchst Wahrheit, Vertrauen und das Gefühl, dass eine Beziehung sicher genug ist, um deine Wachsamkeit zu senken. Nach einer Verletzung brauchst du vielleicht länger, als andere erwarten, um wirklich loszulassen.',
   'Aszendent Skorpion: Du hinterlässt oft einen starken, zurückhaltenden und zunächst schwer lesbaren Eindruck. Andere spüren deine Konzentration und Tiefe häufig, bevor sie viel über dich wissen.')},
 'sag': {
  'vi': (['lạc quan', 'thành thật', 'ham học'], ['dễ nói quá thẳng', 'hay hứa nhiều', 'sợ bị bó buộc'],
   'Mặt Trăng Nhân Mã: bạn cần tự do và một điều gì đó để tin rằng ngày mai còn rộng. Khi buồn, việc đổi không khí, học điều mới hoặc nhìn câu chuyện từ xa thường giúp bạn lấy lại tinh thần. Cảm giác bị mắc kẹt dễ làm bạn nặng nề nhất.',
   'Cung Mọc Nhân Mã: bạn thường tạo ấn tượng cởi mở, thẳng thắn và dễ kết bạn. Người khác có thể thấy ở bạn sự lạc quan, tò mò và thích mở rộng trải nghiệm.'),
  'en': (['optimistic', 'honest', 'loves learning'], ['can be tactless', 'over-promises', 'dislikes feeling tied down'],
   'Moon in Sagittarius: you need freedom and something that helps you believe tomorrow can still be wider. When you are low, a change of scene, learning something new or stepping back for perspective often lifts you. Feeling trapped tends to weigh on you most.',
   'Sagittarius rising: you often come across as open, direct and easy to befriend. Others may notice your optimism, curiosity and appetite for new experiences.'),
  'de': (['optimistisch', 'ehrlich', 'lernt gern'], ['manchmal taktlos', 'verspricht zu viel', 'mag keine Enge'],
   'Mond im Schützen: Du brauchst Freiheit und etwas, das dich daran glauben lässt, dass morgen wieder mehr Raum möglich ist. Wenn es dir schlecht geht, helfen dir oft ein Ortswechsel, etwas Neues zu lernen oder mehr Abstand zur Situation. Das Gefühl, festzustecken, belastet dich besonders.',
   'Aszendent Schütze: Du wirkst häufig offen, direkt und leicht zugänglich. Andere bemerken oft deinen Optimismus, deine Neugier und deine Lust auf neue Erfahrungen.')},
 'cap': {
  'vi': (['kỷ luật', 'có trách nhiệm', 'kiên trì'], ['dễ tỏ ra lạnh', 'nghiêm khắc', 'khó nhờ giúp đỡ'],
   'Mặt Trăng Ma Kết: bạn thường giữ cảm xúc khá kín và thấy an tâm hơn khi mọi thứ có cấu trúc. Bạn cần cảm giác mình có ích và được tôn trọng. Một bài học quan trọng là cho phép mình nghỉ ngơi trước khi cơ thể buộc bạn phải dừng.',
   'Cung Mọc Ma Kết: bạn thường tạo ấn tượng điềm tĩnh, nghiêm túc và có trách nhiệm. Người khác có thể nhanh chóng xem bạn là người đáng tin hoặc người có khả năng giữ mọi thứ trong tầm kiểm soát.'),
  'en': (['disciplined', 'responsible', 'persistent'], ['can seem cold', 'stern', 'finds it hard to ask for help'],
   'Moon in Capricorn: you tend to keep feelings well guarded and feel safer when life has structure. You need to feel useful and respected. One important lesson is allowing yourself to rest before your body has to force a stop.',
   'Capricorn rising: you often come across as composed, serious and responsible. Others may quickly see you as dependable or as someone who can keep things under control.'),
  'de': (['diszipliniert', 'verantwortungsbewusst', 'ausdauernd'], ['wirkt manchmal kühl', 'streng', 'bittet ungern um Hilfe'],
   'Mond im Steinbock: Du hältst Gefühle häufig gut geschützt und fühlst dich sicherer, wenn dein Leben Struktur hat. Du möchtest dich nützlich und respektiert fühlen. Eine wichtige Lektion kann sein, dir Ruhe zu erlauben, bevor dein Körper dich zum Anhalten zwingt.',
   'Aszendent Steinbock: Du wirkst oft gefasst, ernst und verantwortungsbewusst. Andere sehen dich schnell als verlässlich oder als jemanden, der Dinge gut unter Kontrolle halten kann.')},
 'aqu': {
  'vi': (['độc lập', 'sáng tạo', 'công bằng'], ['dễ xa cách', 'cứng đầu', 'khó nói cảm xúc'],
   'Mặt Trăng Bảo Bình: bạn thường cần một chút khoảng cách để hiểu mình đang cảm thấy gì. Không gian riêng, bạn bè và những cuộc trò chuyện có ý nghĩa giúp bạn cân bằng. Người khác có thể nhầm sự cần thời gian của bạn với lạnh lùng.',
   'Cung Mọc Bảo Bình: bạn thường tạo ấn tượng khác biệt, thân thiện nhưng vẫn có khoảng riêng. Người khác có thể thấy bạn thú vị, độc lập và khó đoán theo cách riêng của mình.'),
  'en': (['independent', 'inventive', 'fair-minded'], ['can seem aloof', 'stubborn', 'struggles to voice feelings'],
   'Moon in Aquarius: you often need a little distance before you understand what you are feeling. Personal space, friendship and meaningful conversation help you rebalance. Others may mistake your need for processing time for coldness.',
   'Aquarius rising: you often come across as distinctive, friendly but still self-contained. Others may find you interesting, independent and pleasantly difficult to predict.'),
  'de': (['unabhängig', 'erfinderisch', 'fair'], ['wirkt manchmal distanziert', 'stur', 'spricht Gefühle schwer aus'],
   'Mond im Wassermann: Du brauchst oft etwas Abstand, bevor du verstehst, was du eigentlich fühlst. Eigener Raum, Freundschaften und bedeutungsvolle Gespräche helfen dir, wieder Balance zu finden. Andere können deinen Bedarf an Verarbeitungszeit mit Kälte verwechseln.',
   'Aszendent Wassermann: Du wirkst häufig eigenständig, freundlich und dennoch in dir selbst verankert. Andere finden dich oft interessant, unabhängig und auf angenehme Weise schwer vorhersehbar.')},
 'pis': {
  'vi': (['đồng cảm', 'sáng tạo', 'dễ tha thứ'], ['dễ trốn tránh', 'mơ hồ', 'khó giữ ranh giới'],
   'Mặt Trăng Song Ngư: bạn rất dễ bị bầu không khí và cảm xúc xung quanh chạm vào. Bạn cần thời gian ở một mình để phân biệt điều gì là của mình, cùng những khoảng nghỉ, nghệ thuật hoặc không gian yên tĩnh để hồi phục. Ranh giới là một kỹ năng quan trọng.',
   'Cung Mọc Song Ngư: bạn thường tạo ấn tượng mềm mại, giàu cảm nhận và dễ thích nghi với người đối diện. Người khác có thể thấy bạn dịu dàng và dễ đồng cảm, nhưng bạn vẫn cần giữ một phần mình thật rõ.'),
  'en': (['empathetic', 'creative', 'forgiving'], ['escapes when overwhelmed', 'vague', 'struggles with boundaries'],
   'Moon in Pisces: you can be highly sensitive to the atmosphere and emotions around you. You need time alone to sort out what is yours, plus rest, art or quiet space to recover. Boundaries are an important skill rather than a sign of distance.',
   'Pisces rising: you often come across as gentle, receptive and adaptable to the person in front of you. Others may find you soft and empathetic, while you still need to keep a clear sense of what belongs to you.'),
  'de': (['einfühlsam', 'kreativ', 'verzeihend'], ['weicht bei Überforderung aus', 'manchmal unklar', 'hat Mühe mit Grenzen'],
   'Mond in den Fischen: Du reagierst oft sehr sensibel auf die Stimmung und Gefühle um dich herum. Du brauchst Zeit allein, um zu unterscheiden, was wirklich zu dir gehört, sowie Ruhe, Kunst oder stille Räume zum Erholen. Grenzen sind dabei eine wichtige Fähigkeit und kein Zeichen von Kälte.',
   'Aszendent Fische: Du wirkst häufig sanft, empfänglich und anpassungsfähig an dein Gegenüber. Andere erleben dich oft als weich und einfühlsam; trotzdem ist es wichtig, ein klares Gefühl dafür zu behalten, was wirklich deins ist.')},
}

ORDER = ['ari', 'tau', 'gem', 'can', 'leo', 'vir', 'lib', 'sco', 'sag', 'cap', 'aqu', 'pis']


def q(t):
    return "'" + t.replace('\\', '\\\\').replace("'", "\\'") + "'"


def lang_block(name, v):
    return ("    %s: { strengths: [%s], challenges: [%s],\n"
            "      moon: %s,\n"
            "      rising: %s }") % (
        name, ', '.join(q(x) for x in v[0]), ', '.join(q(x) for x in v[1]), q(v[2]), q(v[3]))


rows = []
for k in ORDER:
    d = D[k]
    rows.append("  %s: { compat: [%s],\n%s,\n%s,\n%s }" % (
        k, ', '.join(q(x) for x in COMPAT[k]),
        lang_block('vi', d['vi']), lang_block('en', d['en']), lang_block('de', d['de'])))
block = 'const ZDEEP = {\n' + ',\n'.join(rows) + '\n};'

m = re.search(r'^const ZDEEP = \{.*?^\};$', s, re.S | re.M)
if not m:
    sys.stderr.write('ZDEEP not found\n'); sys.exit(1)
s = s[:m.start()] + block + s[m.end():]

# ---- CHEM_TEXT ----
chem = """const CHEM_TEXT = {
  same: { vi: 'cùng nguyên tố: hai bạn dễ hiểu nhịp sống của nhau, nhưng cũng có thể cùng khuếch đại những điểm yếu giống nhau', en: 'same element: you understand each other\\'s basic rhythm easily, but can also amplify the same weaknesses', de: 'gleiches Element: Ihr versteht den Grundrhythmus des anderen leicht, könnt aber auch ähnliche Schwächen verstärken' },
  support: { vi: 'hai nguyên tố bổ trợ nhau: một bên mang năng lượng hoặc chuyển động, một bên mang nền tảng và sự vững chãi', en: 'two elements that complement each other: one brings energy or movement, the other steadiness and ground', de: 'zwei Elemente, die sich ergänzen: eines bringt Energie oder Bewegung, das andere Halt und Boden' },
  work: { vi: 'hai nguyên tố khác nhịp; mối quan hệ vẫn có thể tốt nếu cả hai chủ động học cách của nhau', en: 'two elements with a different rhythm; the connection can work well when both deliberately learn the other\\'s language', de: 'zwei Elemente mit unterschiedlichem Rhythmus; die Verbindung kann gut funktionieren, wenn beide bewusst die Sprache des anderen lernen' }
};"""
m = re.search(r'^const CHEM_TEXT = \{.*?^\};$', s, re.S | re.M)
if not m:
    sys.stderr.write('CHEM_TEXT not found\n'); sys.exit(1)
s = s[:m.start()] + chem + s[m.end():]

io.open(p, 'w', encoding='utf-8', newline='').write(s)
print('astro-deep.js: 12 deep profiles in three languages, CHEM_TEXT localized')
