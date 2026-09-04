/* ============================ numerology ============================
   Pythagorean system: life path (birth date), expression / destiny (full
   name), soul urge (vowels), personality (consonants), birthday number,
   personal year. Vietnamese names are read without tone marks (Đ = D), which
   is how Vietnamese numerology readers do it. */
const PYTH = { a: 1, j: 1, s: 1, b: 2, k: 2, t: 2, c: 3, l: 3, u: 3, d: 4, m: 4, v: 4, e: 5, n: 5, w: 5, f: 6, o: 6, x: 6, g: 7, p: 7, y: 7, h: 8, q: 8, z: 8, i: 9, r: 9 };
const VOWELS = 'aeiou';
function plainName(name) { return String(name || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd').toLowerCase().replace(/[^a-z]/g, ''); }
function reduceNum(n) { while (n > 9 && n !== 11 && n !== 22 && n !== 33) n = String(n).split('').reduce((a, c) => a + Number(c), 0); return n; }
function sumLetters(name, filter) { let s = 0; for (const ch of plainName(name)) { if (!filter || filter(ch)) s += PYTH[ch] || 0; } return s; }
function numerologyOf(name, birthday) {
  const b = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthday || '');
  const out = {};
  if (b) {
    const y = Number(b[1]), m = Number(b[2]), d = Number(b[3]);
    out.lifePath = lifePath(y, m, d);
    out.birthday = reduceNum(d);
    const now = new Date();
    out.personalYear = reduceNum(reduceNum(m) + reduceNum(d) + reduceNum(now.getFullYear()));
    if (out.personalYear > 9) out.personalYear = reduceNum(String(out.personalYear).split('').reduce((a, c) => a + Number(c), 0));
  }
  if (plainName(name)) {
    out.expression = reduceNum(sumLetters(name));
    out.soul = reduceNum(sumLetters(name, (c) => VOWELS.indexOf(c) > -1));
    out.personality = reduceNum(sumLetters(name, (c) => VOWELS.indexOf(c) < 0));
  }
  return out;
}
const NUM = {
  1: { vi: { expr: 'Sinh ra để dẫn đầu và tự làm. Bạn giỏi khởi xướng, ghét bị sai bảo.', soul: 'Trong lòng bạn muốn được độc lập và được công nhận là người đi đầu.', pers: 'Người ta thấy bạn tự tin, quyết đoán, hơi cứng.' },
       en: { expr: 'Made to lead and do things yourself. Good at starting; dislikes being told what to do.', soul: 'Deep down you want independence and to be recognised as first.', pers: 'People see you as confident, decisive, a little hard.' } },
  2: { vi: { expr: 'Sinh ra để kết nối và làm việc cùng người khác. Nhạy, khéo, giỏi hoà giải.', soul: 'Trong lòng bạn muốn được yêu thương và có ai đó bên cạnh.', pers: 'Người ta thấy bạn dịu dàng, dễ gần, đáng tin.' },
       en: { expr: 'Made to connect and work with others. Sensitive, tactful, a peacemaker.', soul: 'Deep down you want love and someone beside you.', pers: 'People see you as gentle, approachable, trustworthy.' } },
  3: { vi: { expr: 'Sinh ra để biểu đạt: nói, viết, diễn, làm người khác vui.', soul: 'Trong lòng bạn muốn được sáng tạo và được nghe.', pers: 'Người ta thấy bạn vui, có duyên, hơi tản mạn.' },
       en: { expr: 'Made to express: speak, write, perform, make people happy.', soul: 'Deep down you want to create and to be heard.', pers: 'People see you as fun, charming, a bit scattered.' } },
  4: { vi: { expr: 'Sinh ra để xây: hệ thống, gia đình, việc lâu dài. Chăm và đáng tin.', soul: 'Trong lòng bạn muốn sự ổn định và trật tự.', pers: 'Người ta thấy bạn thực tế, chắc chắn, đôi khi cứng nhắc.' },
       en: { expr: 'Made to build: systems, family, lasting work. Hard-working and reliable.', soul: 'Deep down you want stability and order.', pers: 'People see you as practical, solid, sometimes rigid.' } },
  5: { vi: { expr: 'Sinh ra để trải nghiệm: đi, đổi, thử. Thích tự do và nhiều mối quan hệ.', soul: 'Trong lòng bạn muốn tự do và điều mới.', pers: 'Người ta thấy bạn năng động, cuốn hút, khó đoán.' },
       en: { expr: 'Made to experience: travel, change, try. Loves freedom and many connections.', soul: 'Deep down you want freedom and novelty.', pers: 'People see you as lively, magnetic, hard to pin down.' } },
  6: { vi: { expr: 'Sinh ra để chăm sóc: gia đình, cộng đồng, cái đẹp. Có trách nhiệm.', soul: 'Trong lòng bạn muốn một mái nhà ấm và được cần đến.', pers: 'Người ta thấy bạn ấm áp, chu đáo, hơi hay lo cho người khác.' },
       en: { expr: 'Made to care: family, community, beauty. Responsible.', soul: 'Deep down you want a warm home and to be needed.', pers: 'People see you as warm, attentive, a little over-caring.' } },
  7: { vi: { expr: 'Sinh ra để tìm hiểu: nghiên cứu, tâm linh, một mình. Sâu và kín.', soul: 'Trong lòng bạn muốn hiểu sự thật và có thời gian riêng.', pers: 'Người ta thấy bạn bí ẩn, thông minh, hơi xa cách.' },
       en: { expr: 'Made to seek: research, spirituality, solitude. Deep and private.', soul: 'Deep down you want the truth and time to yourself.', pers: 'People see you as mysterious, intelligent, a bit distant.' } },
  8: { vi: { expr: 'Sinh ra để làm chủ: kinh doanh, quyền lực, tiền bạc. Tham vọng và giỏi tổ chức.', soul: 'Trong lòng bạn muốn thành công và được tôn trọng.', pers: 'Người ta thấy bạn mạnh, có uy, đôi khi áp đảo.' },
       en: { expr: 'Made to master: business, power, money. Ambitious and organised.', soul: 'Deep down you want success and respect.', pers: 'People see you as strong, authoritative, sometimes overpowering.' } },
  9: { vi: { expr: 'Sinh ra để cho đi: nghệ thuật, nhân ái, chuyện lớn hơn mình.', soul: 'Trong lòng bạn muốn giúp đời và buông được quá khứ.', pers: 'Người ta thấy bạn rộng lượng, lãng mạn, hơi lý tưởng.' },
       en: { expr: 'Made to give: art, compassion, causes bigger than yourself.', soul: 'Deep down you want to help and to let the past go.', pers: 'People see you as generous, romantic, a little idealistic.' } },
  11: { vi: { expr: 'Số bậc thầy: truyền cảm hứng, trực giác mạnh, nhiều căng thẳng bên trong.', soul: 'Trong lòng bạn muốn thắp sáng điều gì đó cho người khác.', pers: 'Người ta thấy bạn nhạy, khác thường, có sức hút lạ.' },
        en: { expr: 'Master number: inspiring, strong intuition, a lot of inner tension.', soul: 'Deep down you want to light something up for others.', pers: 'People see you as sensitive, unusual, oddly magnetic.' } },
  22: { vi: { expr: 'Số bậc thầy: người xây điều lớn, biến ý tưởng thành công trình.', soul: 'Trong lòng bạn muốn để lại thứ gì bền hơn mình.', pers: 'Người ta thấy bạn vững, có tầm, đáng nể.' },
        en: { expr: 'Master number: the builder of big things, turning vision into structure.', soul: 'Deep down you want to leave something that outlasts you.', pers: 'People see you as solid, far-sighted, impressive.' } },
  33: { vi: { expr: 'Số bậc thầy: dạy dỗ, chữa lành, yêu thương không điều kiện.', soul: 'Trong lòng bạn muốn nâng đỡ mọi người, đôi khi quên mình.', pers: 'Người ta thấy bạn ấm áp lạ thường và rất được tin.' },
        en: { expr: 'Master number: teaching, healing, unconditional love.', soul: 'Deep down you want to lift everyone, sometimes forgetting yourself.', pers: 'People see you as unusually warm and deeply trusted.' } }
};
const PYEAR = {
  1: { vi: 'Năm bắt đầu. Gieo hạt, mở việc mới, tự đứng lên.', en: 'A year of beginnings. Plant seeds, start things, stand on your own.' },
  2: { vi: 'Năm chờ và hợp tác. Chậm lại, xây mối quan hệ, kiên nhẫn.', en: 'A year of waiting and partnership. Slow down, build relationships, be patient.' },
  3: { vi: 'Năm nở hoa. Sáng tạo, giao tiếp, vui chơi, ra mắt.', en: 'A year of blossoming. Create, communicate, play, show your work.' },
  4: { vi: 'Năm làm việc. Xây nền, kỷ luật, sức khỏe, giấy tờ.', en: 'A year of work. Foundations, discipline, health, paperwork.' },
  5: { vi: 'Năm thay đổi. Đi lại, đổi việc, tự do, bất ngờ.', en: 'A year of change. Travel, job moves, freedom, surprises.' },
  6: { vi: 'Năm gia đình. Trách nhiệm, tình yêu, nhà cửa, chăm sóc.', en: 'A year of home. Responsibility, love, house, care.' },
  7: { vi: 'Năm nhìn vào trong. Học, nghỉ, tâm linh, ít ồn ào.', en: 'A year of looking inward. Study, rest, spirit, less noise.' },
  8: { vi: 'Năm gặt. Tiền bạc, quyền hạn, kết quả của những năm trước.', en: 'A year of harvest. Money, authority, the results of earlier years.' },
  9: { vi: 'Năm kết thúc. Dọn dẹp, buông, tha thứ, chuẩn bị vòng mới.', en: 'A year of endings. Clear out, let go, forgive, prepare the next cycle.' }
};
