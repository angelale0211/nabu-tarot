/* ============================ zodiac + numbers ============================
   Sign characters follow the way the signs are commonly described; they are
   not a documented tradition the way the Book T links in astro.js are, and the
   Learn tab says so. Plain language, short sentences. */

/* Sun-sign boundaries (month, day the sign starts). Same order as ZSIGN keys
   and STR.zodiac. Tropical, common almanac dates. */
const ZKEYS = ['ari', 'tau', 'gem', 'can', 'leo', 'vir', 'lib', 'sco', 'sag', 'cap', 'aqu', 'pis'];
const ZSTART = [[3, 21], [4, 20], [5, 21], [6, 21], [7, 23], [8, 23], [9, 23], [10, 23], [11, 22], [12, 22], [1, 20], [2, 19]];
function sunSignIndex(month, day) { // month 1-12 -> index into ZKEYS
  for (let i = 0; i < 12; i++) {
    const s = ZSTART[i], e = ZSTART[(i + 1) % 12];
    const after = month > s[0] || (month === s[0] && day >= s[1]);
    const before = month < e[0] || (month === e[0] && day < e[1]);
    if (s[0] < e[0] ? (after && before) : (after || before)) return i;
  }
  return 9;
}
const ZRULER = { ari: 'mar', tau: 'ven', gem: 'mer', can: 'moo', leo: 'sun', vir: 'mer', lib: 'ven', sco: 'plu', sag: 'jup', cap: 'sat', aqu: 'ura', pis: 'nep' };

const ZODIAC = {
  ari: {
    vi: { kw: ['thẳng thắn', 'nhanh', 'dám làm', 'nóng tính'],
      about: 'Bạch Dương đi trước, nghĩ sau. Bạn thích bắt đầu, thích được là người đầu tiên. Năng lượng của bạn nóng và nhanh, nên bạn dễ chán khi mọi thứ chậm lại.',
      love: 'Bạn theo đuổi rõ ràng, không úp mở. Người yêu bạn cần chịu được sự thẳng thắn và cần giữ chút thử thách, vì bạn dễ mất hứng khi mọi thứ quá dễ.',
      work: 'Hợp việc cần khởi động, dẫn dắt, cạnh tranh. Bạn giỏi mở đường, nhưng khâu hoàn thiện nên giao cho người khác hoặc tự ép mình kiên nhẫn hơn.',
      tip: 'Đếm đến ba trước khi nói điều gì đó lúc nóng. Ba giây đó cứu được nhiều mối quan hệ.' },
    en: { kw: ['direct', 'fast', 'bold', 'quick-tempered'],
      about: 'Aries moves first and thinks after. You like starting things and being first. Your energy runs hot and fast, so you get bored when things slow down.',
      love: 'You pursue openly, no games. Your partner has to handle honesty and keep a little challenge alive, because you lose interest when it gets too easy.',
      work: 'Good at launching, leading, competing. You open the road; finishing is best handed to someone else or forced through with patience.',
      tip: 'Count to three before speaking while angry. Those three seconds save a lot of relationships.' } },
  tau: {
    vi: { kw: ['bền', 'thực tế', 'thích dễ chịu', 'bướng'],
      about: 'Kim Ngưu cần cảm giác chắc chắn: tiền trong tài khoản, người bên cạnh, bữa ăn ngon. Bạn chậm mà chắc, đã quyết thì khó đổi.',
      love: 'Bạn yêu bằng sự có mặt, bằng chăm sóc và đồ ăn ngon hơn là lời hoa mỹ. Bạn cần thời gian để tin, nhưng khi đã tin thì rất chung thủy. Điểm yếu là ghen và giữ chặt.',
      work: 'Hợp việc cần kiên nhẫn, làm lâu dài, có kết quả sờ được: tài chính, ẩm thực, thiết kế, đất đai. Bạn không thích thay đổi liên tục.',
      tip: 'Bướng không phải lúc nào cũng là kiên định. Thỉnh thoảng hãy hỏi mình: mình đang giữ vì đúng, hay vì quen?' },
    en: { kw: ['steady', 'practical', 'comfort-loving', 'stubborn'],
      about: 'Taurus needs to feel safe: money in the account, someone beside you, a good meal. Slow but sure, and once decided, hard to move.',
      love: 'You love by being there, by caring and cooking, more than by pretty words. You take time to trust, then stay loyal. The weak spot is jealousy and holding on too tight.',
      work: 'Suited to patient, long-term work with results you can touch: finance, food, design, property. You dislike constant change.',
      tip: 'Stubborn is not always steadfast. Now and then ask: am I holding on because it is right, or because it is familiar?' } },
  gem: {
    vi: { kw: ['tò mò', 'nói giỏi', 'hai mặt', 'hay đổi'],
      about: 'Song Tử sống bằng thông tin và trò chuyện. Bạn học nhanh, hỏi nhiều, chán cũng nhanh. Trong bạn thường có hai ý cùng lúc, và cả hai đều thật.',
      love: 'Bạn cần người nói chuyện được với mình trước, rồi mới đến chuyện khác. Sự nhàm chán là kẻ thù lớn nhất. Người yêu bạn hay hỏi "rốt cuộc bạn muốn gì?" và bạn cũng chưa chắc biết.',
      work: 'Hợp việc dùng lời và chữ: viết, bán hàng, truyền thông, dạy học, sáng tạo nội dung. Làm nhiều việc một lúc thì vui, nhưng cần một việc làm tới cùng.',
      tip: 'Chọn một việc trong tuần này và làm xong nó. Cảm giác làm xong sẽ cho bạn thứ mà sự mới mẻ không cho được.' },
    en: { kw: ['curious', 'talkative', 'two-sided', 'changeable'],
      about: 'Gemini lives on information and conversation. You learn fast, ask a lot, and get bored fast. Two ideas at once is normal for you, and both are true.',
      love: 'You need someone you can talk to first; everything else comes after. Boredom is the biggest enemy. Partners ask "what do you actually want?" and you may not know either.',
      work: 'Suited to words: writing, sales, media, teaching, content. Juggling many things is fun, but keep one thing you finish.',
      tip: 'Pick one task this week and complete it. Finishing gives you something novelty cannot.' } },
  can: {
    vi: { kw: ['nhạy cảm', 'che chở', 'nhớ lâu', 'hay lo'],
      about: 'Cự Giải cảm nhận trước khi hiểu. Bạn nhớ rất lâu, cả điều tốt lẫn điều làm bạn tổn thương. Nhà, gia đình và người thân là trung tâm của bạn.',
      love: 'Bạn yêu sâu và chăm người yêu như người nhà. Nhưng bạn dễ rút vào vỏ khi bị tổn thương và ít khi nói thẳng mình đang buồn. Người yêu bạn cần học đọc dấu hiệu.',
      work: 'Hợp việc chăm sóc, nuôi dưỡng, xây dựng: y tế, giáo dục, nhà hàng, bất động sản, quản lý đội nhóm. Bạn làm việc tốt nhất khi thấy an toàn.',
      tip: 'Nói ra điều bạn cần thay vì đợi người khác đoán. Họ không thấy được bên trong vỏ.' },
    en: { kw: ['sensitive', 'protective', 'long memory', 'worrier'],
      about: 'Cancer feels before understanding. You remember for a long time, the good and the hurt. Home, family and close people are your centre.',
      love: 'You love deeply and care for a partner like family. But you retreat into your shell when hurt and rarely say you are sad. Partners have to learn the signs.',
      work: 'Suited to caring, nurturing, building: health, education, food, property, leading a team. You do your best work when you feel safe.',
      tip: 'Say what you need instead of waiting for people to guess. They cannot see inside the shell.' } },
  leo: {
    vi: { kw: ['ấm áp', 'tự tin', 'hào phóng', 'cần được thấy'],
      about: 'Sư Tử sáng khi có người nhìn. Bạn ấm áp, rộng rãi, thích làm người khác vui. Bạn cũng cần được công nhận, và im lặng của người khác làm bạn khó chịu hơn bạn tưởng.',
      love: 'Bạn yêu như một buổi biểu diễn: quà, lời khen, sự chú ý. Bạn cho nhiều và mong được đáp lại cùng mức. Người yêu bạn cần biết khen thật lòng.',
      work: 'Hợp việc đứng trước đám đông, dẫn dắt, sáng tạo, giải trí, thương hiệu. Bạn là người làm cho đội nhóm có tinh thần.',
      tip: 'Không phải ai im lặng cũng là không quan tâm. Hãy hỏi trước khi buồn.' },
    en: { kw: ['warm', 'confident', 'generous', 'needs to be seen'],
      about: 'Leo shines when someone is watching. You are warm, generous, and like making people happy. You also need recognition, and other people\'s silence bothers you more than you admit.',
      love: 'You love like a performance: gifts, compliments, attention. You give a lot and expect the same back. Your partner needs to know how to praise sincerely.',
      work: 'Suited to being in front of people, leading, creating, entertainment, branding. You are the one who gives a team its spirit.',
      tip: 'Silence is not always indifference. Ask before you feel hurt.' } },
  vir: {
    vi: { kw: ['kỹ', 'giúp ích', 'phân tích', 'tự trách'],
      about: 'Xử Nữ nhìn thấy chi tiết mà người khác bỏ qua. Bạn thích sửa, thích làm cho tốt hơn. Bạn thể hiện quan tâm bằng việc làm, không bằng lời.',
      love: 'Bạn yêu bằng cách để ý: nhớ người kia thích gì, sửa cái ghế gãy, nhắc uống thuốc. Điểm yếu là hay chê, cả người khác lẫn chính mình.',
      work: 'Hợp việc cần chính xác: y tế, kế toán, biên tập, phân tích, kỹ thuật, tổ chức. Bạn là người làm cho hệ thống chạy.',
      tip: 'Tốt đủ là tốt rồi. Hoàn hảo thường chỉ là cách trì hoãn.' },
    en: { kw: ['meticulous', 'helpful', 'analytical', 'self-critical'],
      about: 'Virgo sees the details other people miss. You like fixing things and making them better. You show care through actions, not words.',
      love: 'You love by noticing: what they like, the broken chair, the medicine reminder. The weak spot is criticism, of others and of yourself.',
      work: 'Suited to precision: health, accounting, editing, analysis, engineering, organising. You keep the system running.',
      tip: 'Good enough is good. Perfect is often just a way to delay.' } },
  lib: {
    vi: { kw: ['hòa nhã', 'công bằng', 'thẩm mỹ', 'khó quyết'],
      about: 'Thiên Bình cần sự cân bằng và cái đẹp. Bạn nhìn được cả hai phía, nên bạn hay do dự. Bạn ghét xung đột và sẽ nhường để giữ hòa khí.',
      love: 'Bạn sinh ra để ở trong một mối quan hệ. Bạn lịch sự, biết chiều, biết làm người kia thấy dễ chịu. Điểm yếu là nói "ừ" khi trong lòng là "không".',
      work: 'Hợp việc cần ngoại giao, thẩm mỹ, công bằng: luật, thiết kế, nhân sự, tư vấn, ngoại giao. Bạn làm việc tốt khi có người đồng hành.',
      tip: 'Quyết định sai còn hơn không quyết định. Bạn sửa được sai, nhưng không sửa được thời gian đã trôi.' },
    en: { kw: ['gracious', 'fair', 'aesthetic', 'indecisive'],
      about: 'Libra needs balance and beauty. You see both sides, so you hesitate. You hate conflict and will give way to keep the peace.',
      love: 'You are made for partnership. Polite, accommodating, good at making someone comfortable. The weak spot is saying "yes" when you mean "no".',
      work: 'Suited to diplomacy, aesthetics, fairness: law, design, HR, consulting. You work best with a partner.',
      tip: 'A wrong decision beats no decision. You can fix a mistake, not lost time.' } },
  sco: {
    vi: { kw: ['sâu', 'kín', 'trung thành', 'không quên'],
      about: 'Bọ Cạp không làm gì nửa vời. Bạn cảm nhận mạnh, giữ kín, và nhìn thấu người khác. Bạn cần sự thật, ngay cả khi nó đau.',
      love: 'Bạn yêu là hết mình và đòi hỏi sự hết mình từ người kia. Sự phản bội là điều bạn không bỏ qua. Bạn cần người không sợ chiều sâu của bạn.',
      work: 'Hợp việc cần đào sâu: điều tra, tâm lý, nghiên cứu, tài chính, y khoa, khủng hoảng. Bạn giỏi trong việc người khác né tránh.',
      tip: 'Không phải mọi bí mật đều cần giữ. Thử nói ra một điều nhỏ với người bạn tin.' },
    en: { kw: ['deep', 'private', 'loyal', 'never forgets'],
      about: 'Scorpio does nothing halfway. You feel intensely, keep things private, and see through people. You need the truth even when it hurts.',
      love: 'You love all in and expect the same. Betrayal is what you do not forgive. You need someone unafraid of your depth.',
      work: 'Suited to digging: investigation, psychology, research, finance, medicine, crisis work. You are good at what others avoid.',
      tip: 'Not every secret needs keeping. Try telling one small thing to someone you trust.' } },
  sag: {
    vi: { kw: ['tự do', 'lạc quan', 'thẳng', 'thiếu kiên nhẫn'],
      about: 'Nhân Mã cần chân trời. Bạn tin ngày mai sẽ tốt hơn, thích đi, thích học điều mới, thích nói thật. Bạn không chịu được bị bó buộc.',
      love: 'Bạn yêu vui vẻ, không ghen nhiều, nhưng khó cam kết sớm. Người yêu bạn phải là bạn đồng hành, không phải người giữ bạn lại.',
      work: 'Hợp việc có di chuyển, học hỏi, chia sẻ: du lịch, giáo dục, xuất bản, luật, ngoại thương. Bạn làm việc tốt khi thấy ý nghĩa lớn.',
      tip: 'Thật thà là tốt. Nhưng thật thà mà không khéo thì người ta chỉ nhớ cái đau, không nhớ cái đúng.' },
    en: { kw: ['free', 'optimistic', 'blunt', 'impatient'],
      about: 'Sagittarius needs a horizon. You believe tomorrow will be better, love travel, new ideas and plain truth. You cannot stand being tied down.',
      love: 'You love cheerfully, without much jealousy, but commit slowly. Your partner must be a travel companion, not someone holding you back.',
      work: 'Suited to movement, learning, sharing: travel, education, publishing, law, trade. You work best when you see the bigger meaning.',
      tip: 'Honesty is good. Honesty without tact leaves people remembering the hurt, not the truth.' } },
  cap: {
    vi: { kw: ['kỷ luật', 'tham vọng', 'chịu khó', 'khô'],
      about: 'Ma Kết leo núi từng bước. Bạn nghĩ dài hạn, chịu được khổ, và không thích phô trương. Bạn tin vào kết quả hơn lời hứa.',
      love: 'Bạn yêu chậm và chắc, hay lo cho tương lai chung hơn là lãng mạn hiện tại. Người yêu bạn cần hiểu rằng bạn thể hiện tình cảm bằng sự ổn định.',
      work: 'Hợp việc cần bền bỉ và đi lên: quản lý, kinh doanh, kiến trúc, tài chính, chính sách. Bạn thường thành công muộn hơn nhưng lâu hơn.',
      tip: 'Nghỉ ngơi cũng là một phần của kế hoạch. Núi vẫn ở đó ngày mai.' },
    en: { kw: ['disciplined', 'ambitious', 'hard-working', 'dry'],
      about: 'Capricorn climbs the mountain step by step. You think long term, endure hardship, and dislike showing off. You trust results more than promises.',
      love: 'You love slowly and surely, worrying about the shared future more than present romance. Your partner has to see that stability is your affection.',
      work: 'Suited to endurance and climbing: management, business, architecture, finance, policy. You often succeed later, but for longer.',
      tip: 'Rest is part of the plan. The mountain will still be there tomorrow.' } },
  aqu: {
    vi: { kw: ['khác biệt', 'lý trí', 'bạn bè', 'xa cách'],
      about: 'Bảo Bình nghĩ khác đám đông và thấy thoải mái với điều đó. Bạn quý tự do, lý tưởng và bạn bè. Cảm xúc riêng thì bạn giữ ở khoảng cách.',
      love: 'Bạn cần được là chính mình trong tình yêu, và cần người yêu cũng là bạn thân. Bạn dễ có vẻ lạnh, không phải vì không yêu mà vì không quen thể hiện.',
      work: 'Hợp việc đổi mới: công nghệ, khoa học, cộng đồng, thiết kế mới, hoạt động xã hội. Bạn nhìn thấy tương lai trước người khác.',
      tip: 'Người thân không cần bạn đúng. Họ cần bạn có mặt.' },
    en: { kw: ['different', 'rational', 'friend-first', 'detached'],
      about: 'Aquarius thinks differently from the crowd and is fine with that. You value freedom, ideals and friends. Your own feelings you keep at a distance.',
      love: 'You need to stay yourself in love, and your partner must also be your best friend. You can seem cold, not from lack of love but from being unused to showing it.',
      work: 'Suited to innovation: technology, science, community, new design, activism. You see the future before others do.',
      tip: 'The people close to you do not need you to be right. They need you to be there.' } },
  pis: {
    vi: { kw: ['mơ mộng', 'thấu cảm', 'nghệ sĩ', 'trốn tránh'],
      about: 'Song Ngư cảm được cảm xúc của cả phòng. Bạn giàu trí tưởng tượng, dễ thương người, dễ mất ranh giới giữa mình và người khác.',
      love: 'Bạn yêu như trong phim: hy sinh, mơ mộng, tha thứ. Điểm yếu là yêu hình ảnh mình tưởng tượng về người kia hơn là con người thật.',
      work: 'Hợp việc sáng tạo và chữa lành: nghệ thuật, âm nhạc, tâm lý, chăm sóc, tâm linh. Bạn cần môi trường không quá khắc nghiệt.',
      tip: 'Đặt một ranh giới nhỏ trong tuần này. Giúp người khác không có nghĩa là mất mình.' },
    en: { kw: ['dreamy', 'empathetic', 'artistic', 'escapist'],
      about: 'Pisces feels the mood of the whole room. Imaginative, easily moved, and quick to lose the line between yourself and others.',
      love: 'You love like a film: sacrifice, dreams, forgiveness. The weak spot is loving the image you imagine rather than the real person.',
      work: 'Suited to creating and healing: art, music, psychology, care, spiritual work. You need a setting that is not too harsh.',
      tip: 'Set one small boundary this week. Helping others does not mean losing yourself.' } }
};

/* Life path number (numerology): reduce the full birth date to one digit,
   keeping 11, 22 and 33 as they are. Common practice, no single source. */
function lifePath(y, m, d) {
  const red = (n) => { while (n > 9 && n !== 11 && n !== 22 && n !== 33) n = String(n).split('').reduce((a, c) => a + Number(c), 0); return n; };
  return red(red(y) + red(m) + red(d));
}
const LIFEPATH = {
  1: { vi: 'Người mở đường. Độc lập, có ý chí, thích tự làm. Bài học: biết nhờ người khác.', en: 'The pioneer. Independent, strong-willed, likes doing it alone. Lesson: learn to ask for help.' },
  2: { vi: 'Người kết nối. Nhạy cảm, hợp tác, giỏi làm dịu. Bài học: nói lên ý mình.', en: 'The connector. Sensitive, cooperative, a peacemaker. Lesson: speak your own mind.' },
  3: { vi: 'Người biểu đạt. Sáng tạo, vui, nói giỏi. Bài học: làm tới cùng.', en: 'The expresser. Creative, cheerful, good with words. Lesson: finish what you start.' },
  4: { vi: 'Người xây dựng. Chăm, thực tế, đáng tin. Bài học: mềm với thay đổi.', en: 'The builder. Hard-working, practical, reliable. Lesson: bend with change.' },
  5: { vi: 'Người tự do. Thích đi, thích mới, nhiều trải nghiệm. Bài học: cam kết.', en: 'The free spirit. Loves travel, novelty, experience. Lesson: commitment.' },
  6: { vi: 'Người chăm sóc. Yêu gia đình, có trách nhiệm, ấm áp. Bài học: đừng ôm hết.', en: 'The carer. Family-first, responsible, warm. Lesson: do not carry everything.' },
  7: { vi: 'Người tìm hiểu. Sâu, thích một mình, hay hỏi vì sao. Bài học: tin người.', en: 'The seeker. Deep, solitary, always asking why. Lesson: trusting people.' },
  8: { vi: 'Người dẫn dắt. Tham vọng, giỏi tiền bạc và quyền lực. Bài học: dùng sức mạnh tử tế.', en: 'The leader. Ambitious, good with money and power. Lesson: use power kindly.' },
  9: { vi: 'Người cho đi. Rộng lượng, nhân ái, nhìn xa. Bài học: buông bỏ.', en: 'The giver. Generous, humane, far-seeing. Lesson: letting go.' },
  11: { vi: 'Số bậc thầy 11: trực giác mạnh, truyền cảm hứng. Bài học: giữ chân trên đất.', en: 'Master number 11: strong intuition, inspiring. Lesson: keep your feet on the ground.' },
  22: { vi: 'Số bậc thầy 22: người xây điều lớn. Bài học: kiên nhẫn với chính mình.', en: 'Master number 22: builder of big things. Lesson: patience with yourself.' },
  33: { vi: 'Số bậc thầy 33: người chữa lành, dạy dỗ. Bài học: chăm mình trước.', en: 'Master number 33: healer and teacher. Lesson: care for yourself first.' }
};

/* Vietnamese zodiac animals by calendar year (Tết boundary noted in the UI). */
const ANIMALS = [
  { vi: 'Tý (Chuột)', en: 'Rat' }, { vi: 'Sửu (Trâu)', en: 'Ox' }, { vi: 'Dần (Hổ)', en: 'Tiger' }, { vi: 'Mão (Mèo)', en: 'Cat' },
  { vi: 'Thìn (Rồng)', en: 'Dragon' }, { vi: 'Tỵ (Rắn)', en: 'Snake' }, { vi: 'Ngọ (Ngựa)', en: 'Horse' }, { vi: 'Mùi (Dê)', en: 'Goat' },
  { vi: 'Thân (Khỉ)', en: 'Monkey' }, { vi: 'Dậu (Gà)', en: 'Rooster' }, { vi: 'Tuất (Chó)', en: 'Dog' }, { vi: 'Hợi (Lợn)', en: 'Pig' }
];
const animalOf = (year) => ANIMALS[((year - 4) % 12 + 12) % 12];
