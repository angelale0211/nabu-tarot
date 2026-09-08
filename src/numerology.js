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
  1: { vi: { expr: 'Năng lượng số 1 thiên về dẫn dắt, độc lập và khởi xướng.', soul: 'Bên trong, bạn muốn tự quyết và được công nhận cho điều mình làm được.', pers: 'Người khác thường thấy bạn tự tin, quyết đoán và khá mạnh.' },
       en: { expr: 'Number 1 energy leans toward leadership, independence and initiative.', soul: 'Deep down, you want to make your own choices and be recognised for what you can do.', pers: 'Others often see you as confident, decisive and strong.' },
       de: { expr: 'Die Energie der 1 steht eher für Führung, Unabhängigkeit und Initiative.', soul: 'Im Inneren möchtest du selbst entscheiden und für das anerkannt werden, was du kannst.', pers: 'Andere erleben dich oft als selbstbewusst, entschlossen und stark.' } },
  2: { vi: { expr: 'Số 2 thiên về kết nối, hợp tác và dung hòa.', soul: 'Bên trong, bạn cần cảm giác được yêu thương và có người đồng hành.', pers: 'Người khác thường thấy bạn dịu dàng, dễ gần và đáng tin.' },
       en: { expr: 'Number 2 leans toward connection, cooperation and harmony.', soul: 'Deep down, you need to feel loved and to have someone beside you.', pers: 'Others often see you as gentle, approachable and trustworthy.' },
       de: { expr: 'Die 2 steht eher für Verbindung, Zusammenarbeit und Ausgleich.', soul: 'Im Inneren brauchst du das Gefühl, geliebt zu werden und jemanden an deiner Seite zu haben.', pers: 'Andere erleben dich oft als sanft, zugänglich und vertrauenswürdig.' } },
  3: { vi: { expr: 'Số 3 thiên về biểu đạt, sáng tạo và truyền niềm vui.', soul: 'Bên trong, bạn muốn được sáng tạo và được lắng nghe.', pers: 'Người khác thường thấy bạn vui vẻ, có duyên và nhiều ý tưởng.' },
       en: { expr: 'Number 3 leans toward expression, creativity and bringing joy.', soul: 'Deep down, you want room to create and to be heard.', pers: 'Others often see you as lively, charming and full of ideas.' },
       de: { expr: 'Die 3 steht eher für Ausdruck, Kreativität und Lebensfreude.', soul: 'Im Inneren möchtest du kreativ sein dürfen und gehört werden.', pers: 'Andere erleben dich oft als fröhlich, charmant und ideenreich.' } },
  4: { vi: { expr: 'Số 4 thiên về xây nền, trật tự và những điều bền lâu.', soul: 'Bên trong, bạn cần sự ổn định và cảm giác mọi thứ có chỗ của nó.', pers: 'Người khác thường thấy bạn thực tế, chắc chắn và đáng tin.' },
       en: { expr: 'Number 4 leans toward foundations, order and things built to last.', soul: 'Deep down, you need stability and the sense that things have their place.', pers: 'Others often see you as practical, steady and reliable.' },
       de: { expr: 'Die 4 steht eher für Fundament, Ordnung und Dauerhaftigkeit.', soul: 'Im Inneren brauchst du Stabilität und das Gefühl, dass alles seinen Platz hat.', pers: 'Andere erleben dich oft als praktisch, beständig und verlässlich.' } },
  5: { vi: { expr: 'Số 5 thiên về trải nghiệm, thay đổi và tự do.', soul: 'Bên trong, bạn cần không gian, sự mới mẻ và cảm giác được tự chọn đường đi.', pers: 'Người khác thường thấy bạn năng động, cuốn hút và khó đoán.' },
       en: { expr: 'Number 5 leans toward experience, change and freedom.', soul: 'Deep down, you need space, novelty and the freedom to choose your own direction.', pers: 'Others often see you as lively, magnetic and hard to pin down.' },
       de: { expr: 'Die 5 steht eher für Erfahrung, Veränderung und Freiheit.', soul: 'Im Inneren brauchst du Raum, Neues und das Gefühl, deinen Weg selbst wählen zu können.', pers: 'Andere erleben dich oft als lebendig, anziehend und schwer festzulegen.' } },
  6: { vi: { expr: 'Số 6 thiên về chăm sóc, trách nhiệm, gia đình và cái đẹp.', soul: 'Bên trong, bạn mong một nơi ấm áp và cảm giác mình có ý nghĩa với người khác.', pers: 'Người khác thường thấy bạn ấm áp, chu đáo và biết quan tâm.' },
       en: { expr: 'Number 6 leans toward care, responsibility, family and beauty.', soul: 'Deep down, you want warmth and the sense that you matter to the people around you.', pers: 'Others often see you as warm, thoughtful and caring.' },
       de: { expr: 'Die 6 steht eher für Fürsorge, Verantwortung, Familie und Schönheit.', soul: 'Im Inneren wünschst du dir Wärme und das Gefühl, für andere wichtig zu sein.', pers: 'Andere erleben dich oft als warmherzig, aufmerksam und fürsorglich.' } },
  7: { vi: { expr: 'Số 7 thiên về tìm hiểu, phân tích, chiều sâu và đời sống nội tâm.', soul: 'Bên trong, bạn muốn hiểu sự thật và có đủ khoảng riêng để suy nghĩ.', pers: 'Người khác thường thấy bạn kín đáo, thông minh và hơi khó đọc.' },
       en: { expr: 'Number 7 leans toward inquiry, analysis, depth and inner life.', soul: 'Deep down, you want to understand the truth and have enough private space to think.', pers: 'Others often see you as private, intelligent and a little hard to read.' },
       de: { expr: 'Die 7 steht eher für Forschung, Analyse, Tiefe und Innenleben.', soul: 'Im Inneren möchtest du die Wahrheit verstehen und genug Raum für deine Gedanken haben.', pers: 'Andere erleben dich oft als zurückhaltend, klug und nicht ganz leicht zu lesen.' } },
  8: { vi: { expr: 'Số 8 thiên về thành tựu, tổ chức, tiền bạc và khả năng quản lý.', soul: 'Bên trong, bạn muốn thành công và được tôn trọng.', pers: 'Người khác thường thấy bạn mạnh mẽ, có uy và biết mình muốn gì.' },
       en: { expr: 'Number 8 leans toward achievement, organisation, money and management.', soul: 'Deep down, you want success and respect.', pers: 'Others often see you as strong, authoritative and clear about what you want.' },
       de: { expr: 'Die 8 steht eher für Leistung, Organisation, Geld und Führung.', soul: 'Im Inneren möchtest du erfolgreich sein und respektiert werden.', pers: 'Andere erleben dich oft als stark, souverän und klar in dem, was du willst.' } },
  9: { vi: { expr: 'Số 9 thiên về lòng nhân ái, nghệ thuật và những điều lớn hơn lợi ích cá nhân.', soul: 'Bên trong, bạn muốn giúp ích và học cách buông những gì đã qua.', pers: 'Người khác thường thấy bạn rộng lượng, giàu cảm xúc và lý tưởng.' },
       en: { expr: 'Number 9 leans toward compassion, art and causes larger than personal gain.', soul: 'Deep down, you want to be useful and learn to release what has passed.', pers: 'Others often see you as generous, emotional and idealistic.' },
       de: { expr: 'Die 9 steht eher für Mitgefühl, Kunst und Anliegen, die größer sind als der eigene Vorteil.', soul: 'Im Inneren möchtest du etwas beitragen und lernen, Vergangenes loszulassen.', pers: 'Andere erleben dich oft als großzügig, gefühlvoll und idealistisch.' } },
  11: { vi: { expr: 'Số bậc thầy 11 gắn với trực giác, cảm hứng và độ nhạy cao.', soul: 'Bên trong, bạn muốn truyền một điều có ý nghĩa cho người khác.', pers: 'Người khác thường thấy bạn tinh tế, khác biệt và có sức hút riêng.' },
       en: { expr: 'Master number 11 is associated with intuition, inspiration and heightened sensitivity.', soul: 'Deep down, you want to pass something meaningful on to others.', pers: 'Others often see you as perceptive, distinctive and quietly magnetic.' },
       de: { expr: 'Die Meisterzahl 11 wird mit Intuition, Inspiration und hoher Sensibilität verbunden.', soul: 'Im Inneren möchtest du anderen etwas Bedeutungsvolles weitergeben.', pers: 'Andere erleben dich oft als feinfühlig, besonders und auf eigene Art anziehend.' } },
  22: { vi: { expr: 'Số bậc thầy 22 gắn với khả năng biến tầm nhìn lớn thành điều thực tế và bền vững.', soul: 'Bên trong, bạn muốn tạo ra thứ có giá trị lâu dài.', pers: 'Người khác thường thấy bạn vững vàng, có tầm và đáng tin.' },
       en: { expr: 'Master number 22 is associated with turning a large vision into something practical and lasting.', soul: 'Deep down, you want to create something with enduring value.', pers: 'Others often see you as grounded, far-sighted and dependable.' },
       de: { expr: 'Die Meisterzahl 22 wird damit verbunden, große Visionen praktisch und dauerhaft umzusetzen.', soul: 'Im Inneren möchtest du etwas schaffen, das langfristigen Wert hat.', pers: 'Andere erleben dich oft als gefestigt, weitsichtig und verlässlich.' } },
  33: { vi: { expr: 'Số bậc thầy 33 gắn với chăm sóc, dẫn dắt và lòng trắc ẩn.', soul: 'Bên trong, bạn muốn nâng đỡ người khác, đôi khi đến mức quên mình.', pers: 'Người khác thường thấy bạn ấm áp, bao dung và dễ tạo cảm giác an toàn.' },
       en: { expr: 'Master number 33 is associated with care, guidance and compassion.', soul: 'Deep down, you want to support others, sometimes to the point of forgetting yourself.', pers: 'Others often see you as warm, generous-hearted and reassuring.' },
       de: { expr: 'Die Meisterzahl 33 wird mit Fürsorge, Begleitung und Mitgefühl verbunden.', soul: 'Im Inneren möchtest du andere tragen und unterstützen, manchmal so sehr, dass du dich selbst vergisst.', pers: 'Andere erleben dich oft als warm, großzügig und beruhigend.' } }
};
const PYEAR = {
  1: { vi: 'Năm khởi đầu: gieo hạt, mở việc mới, tự đứng trên đôi chân mình.', en: 'A year of beginnings: plant seeds, start something new and stand on your own feet.', de: 'Ein Jahr des Anfangs: Samen setzen, Neues beginnen und auf eigenen Beinen stehen.' },
  2: { vi: 'Năm hợp tác: chậm lại, nuôi các mối quan hệ và kiên nhẫn với tiến độ.', en: 'A year of partnership: slow down, nurture relationships and be patient with the pace.', de: 'Ein Jahr der Zusammenarbeit: langsamer werden, Beziehungen pflegen und Geduld mit dem Tempo haben.' },
  3: { vi: 'Năm nở hoa: sáng tạo, giao tiếp, vui chơi và đưa mình ra ngoài nhiều hơn.', en: 'A year of blossoming: create, communicate, enjoy yourself and show more of who you are.', de: 'Ein Jahr des Aufblühens: kreativ sein, kommunizieren, Freude haben und dich mehr zeigen.' },
  4: { vi: 'Năm xây nền: kỷ luật, công việc, sức khỏe và những việc cần sắp xếp.', en: 'A year of foundations: discipline, work, wellbeing and things that need organising.', de: 'Ein Jahr des Fundaments: Disziplin, Arbeit, Wohlbefinden und Dinge, die geordnet werden müssen.' },
  5: { vi: 'Năm thay đổi: dịch chuyển, đổi hướng, tự do và những điều bất ngờ.', en: 'A year of change: movement, new directions, freedom and surprises.', de: 'Ein Jahr der Veränderung: Bewegung, neue Richtungen, Freiheit und Überraschungen.' },
  6: { vi: 'Năm của gia đình: tình yêu, trách nhiệm, nhà cửa và chăm sóc.', en: 'A year of home and family: love, responsibility, home matters and care.', de: 'Ein Jahr von Zuhause und Familie: Liebe, Verantwortung, Wohnen und Fürsorge.' },
  7: { vi: 'Năm hướng vào trong: học hỏi, nghỉ ngơi, chiêm nghiệm và bớt ồn ào.', en: 'A year of looking inward: learning, rest, reflection and less noise.', de: 'Ein Jahr des Rückzugs nach innen: Lernen, Ruhe, Reflexion und weniger Lärm.' },
  8: { vi: 'Năm gặt hái: tiền bạc, quyền hạn và kết quả của những gì đã xây trước đó.', en: 'A year of harvest: money, authority and the results of what you built before.', de: 'Ein Jahr der Ernte: Geld, Verantwortung und die Ergebnisse dessen, was du zuvor aufgebaut hast.' },
  9: { vi: 'Năm khép vòng: dọn dẹp, buông bỏ, tha thứ và chuẩn bị cho chu kỳ mới.', en: 'A year of closure: clear out, let go, forgive and prepare for the next cycle.', de: 'Ein Jahr des Abschlusses: aufräumen, loslassen, vergeben und den nächsten Zyklus vorbereiten.' }
};
