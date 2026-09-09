# -*- coding: utf-8 -*-
"""numerology.js, section 5: NUM and PYEAR rewritten in VI/EN (the old
'born to…' wording was too deterministic) and given a German column."""
import io, re, sys

p = 'src/numerology.js'
s = io.open(p, encoding='utf-8').read()

NUM = {
 1: (("Năng lượng số 1 thiên về dẫn dắt, độc lập và khởi xướng.",
      "Bên trong, bạn muốn tự quyết và được công nhận cho điều mình làm được.",
      "Người khác thường thấy bạn tự tin, quyết đoán và khá mạnh."),
     ("Number 1 energy leans toward leadership, independence and initiative.",
      "Deep down, you want to make your own choices and be recognised for what you can do.",
      "Others often see you as confident, decisive and strong."),
     ("Die Energie der 1 steht eher für Führung, Unabhängigkeit und Initiative.",
      "Im Inneren möchtest du selbst entscheiden und für das anerkannt werden, was du kannst.",
      "Andere erleben dich oft als selbstbewusst, entschlossen und stark.")),
 2: (("Số 2 thiên về kết nối, hợp tác và dung hòa.",
      "Bên trong, bạn cần cảm giác được yêu thương và có người đồng hành.",
      "Người khác thường thấy bạn dịu dàng, dễ gần và đáng tin."),
     ("Number 2 leans toward connection, cooperation and harmony.",
      "Deep down, you need to feel loved and to have someone beside you.",
      "Others often see you as gentle, approachable and trustworthy."),
     ("Die 2 steht eher für Verbindung, Zusammenarbeit und Ausgleich.",
      "Im Inneren brauchst du das Gefühl, geliebt zu werden und jemanden an deiner Seite zu haben.",
      "Andere erleben dich oft als sanft, zugänglich und vertrauenswürdig.")),
 3: (("Số 3 thiên về biểu đạt, sáng tạo và truyền niềm vui.",
      "Bên trong, bạn muốn được sáng tạo và được lắng nghe.",
      "Người khác thường thấy bạn vui vẻ, có duyên và nhiều ý tưởng."),
     ("Number 3 leans toward expression, creativity and bringing joy.",
      "Deep down, you want room to create and to be heard.",
      "Others often see you as lively, charming and full of ideas."),
     ("Die 3 steht eher für Ausdruck, Kreativität und Lebensfreude.",
      "Im Inneren möchtest du kreativ sein dürfen und gehört werden.",
      "Andere erleben dich oft als fröhlich, charmant und ideenreich.")),
 4: (("Số 4 thiên về xây nền, trật tự và những điều bền lâu.",
      "Bên trong, bạn cần sự ổn định và cảm giác mọi thứ có chỗ của nó.",
      "Người khác thường thấy bạn thực tế, chắc chắn và đáng tin."),
     ("Number 4 leans toward foundations, order and things built to last.",
      "Deep down, you need stability and the sense that things have their place.",
      "Others often see you as practical, steady and reliable."),
     ("Die 4 steht eher für Fundament, Ordnung und Dauerhaftigkeit.",
      "Im Inneren brauchst du Stabilität und das Gefühl, dass alles seinen Platz hat.",
      "Andere erleben dich oft als praktisch, beständig und verlässlich.")),
 5: (("Số 5 thiên về trải nghiệm, thay đổi và tự do.",
      "Bên trong, bạn cần không gian, sự mới mẻ và cảm giác được tự chọn đường đi.",
      "Người khác thường thấy bạn năng động, cuốn hút và khó đoán."),
     ("Number 5 leans toward experience, change and freedom.",
      "Deep down, you need space, novelty and the freedom to choose your own direction.",
      "Others often see you as lively, magnetic and hard to pin down."),
     ("Die 5 steht eher für Erfahrung, Veränderung und Freiheit.",
      "Im Inneren brauchst du Raum, Neues und das Gefühl, deinen Weg selbst wählen zu können.",
      "Andere erleben dich oft als lebendig, anziehend und schwer festzulegen.")),
 6: (("Số 6 thiên về chăm sóc, trách nhiệm, gia đình và cái đẹp.",
      "Bên trong, bạn mong một nơi ấm áp và cảm giác mình có ý nghĩa với người khác.",
      "Người khác thường thấy bạn ấm áp, chu đáo và biết quan tâm."),
     ("Number 6 leans toward care, responsibility, family and beauty.",
      "Deep down, you want warmth and the sense that you matter to the people around you.",
      "Others often see you as warm, thoughtful and caring."),
     ("Die 6 steht eher für Fürsorge, Verantwortung, Familie und Schönheit.",
      "Im Inneren wünschst du dir Wärme und das Gefühl, für andere wichtig zu sein.",
      "Andere erleben dich oft als warmherzig, aufmerksam und fürsorglich.")),
 7: (("Số 7 thiên về tìm hiểu, phân tích, chiều sâu và đời sống nội tâm.",
      "Bên trong, bạn muốn hiểu sự thật và có đủ khoảng riêng để suy nghĩ.",
      "Người khác thường thấy bạn kín đáo, thông minh và hơi khó đọc."),
     ("Number 7 leans toward inquiry, analysis, depth and inner life.",
      "Deep down, you want to understand the truth and have enough private space to think.",
      "Others often see you as private, intelligent and a little hard to read."),
     ("Die 7 steht eher für Forschung, Analyse, Tiefe und Innenleben.",
      "Im Inneren möchtest du die Wahrheit verstehen und genug Raum für deine Gedanken haben.",
      "Andere erleben dich oft als zurückhaltend, klug und nicht ganz leicht zu lesen.")),
 8: (("Số 8 thiên về thành tựu, tổ chức, tiền bạc và khả năng quản lý.",
      "Bên trong, bạn muốn thành công và được tôn trọng.",
      "Người khác thường thấy bạn mạnh mẽ, có uy và biết mình muốn gì."),
     ("Number 8 leans toward achievement, organisation, money and management.",
      "Deep down, you want success and respect.",
      "Others often see you as strong, authoritative and clear about what you want."),
     ("Die 8 steht eher für Leistung, Organisation, Geld und Führung.",
      "Im Inneren möchtest du erfolgreich sein und respektiert werden.",
      "Andere erleben dich oft als stark, souverän und klar in dem, was du willst.")),
 9: (("Số 9 thiên về lòng nhân ái, nghệ thuật và những điều lớn hơn lợi ích cá nhân.",
      "Bên trong, bạn muốn giúp ích và học cách buông những gì đã qua.",
      "Người khác thường thấy bạn rộng lượng, giàu cảm xúc và lý tưởng."),
     ("Number 9 leans toward compassion, art and causes larger than personal gain.",
      "Deep down, you want to be useful and learn to release what has passed.",
      "Others often see you as generous, emotional and idealistic."),
     ("Die 9 steht eher für Mitgefühl, Kunst und Anliegen, die größer sind als der eigene Vorteil.",
      "Im Inneren möchtest du etwas beitragen und lernen, Vergangenes loszulassen.",
      "Andere erleben dich oft als großzügig, gefühlvoll und idealistisch.")),
 11: (("Số bậc thầy 11 gắn với trực giác, cảm hứng và độ nhạy cao.",
       "Bên trong, bạn muốn truyền một điều có ý nghĩa cho người khác.",
       "Người khác thường thấy bạn tinh tế, khác biệt và có sức hút riêng."),
      ("Master number 11 is associated with intuition, inspiration and heightened sensitivity.",
       "Deep down, you want to pass something meaningful on to others.",
       "Others often see you as perceptive, distinctive and quietly magnetic."),
      ("Die Meisterzahl 11 wird mit Intuition, Inspiration und hoher Sensibilität verbunden.",
       "Im Inneren möchtest du anderen etwas Bedeutungsvolles weitergeben.",
       "Andere erleben dich oft als feinfühlig, besonders und auf eigene Art anziehend.")),
 22: (("Số bậc thầy 22 gắn với khả năng biến tầm nhìn lớn thành điều thực tế và bền vững.",
       "Bên trong, bạn muốn tạo ra thứ có giá trị lâu dài.",
       "Người khác thường thấy bạn vững vàng, có tầm và đáng tin."),
      ("Master number 22 is associated with turning a large vision into something practical and lasting.",
       "Deep down, you want to create something with enduring value.",
       "Others often see you as grounded, far-sighted and dependable."),
      ("Die Meisterzahl 22 wird damit verbunden, große Visionen praktisch und dauerhaft umzusetzen.",
       "Im Inneren möchtest du etwas schaffen, das langfristigen Wert hat.",
       "Andere erleben dich oft als gefestigt, weitsichtig und verlässlich.")),
 33: (("Số bậc thầy 33 gắn với chăm sóc, dẫn dắt và lòng trắc ẩn.",
       "Bên trong, bạn muốn nâng đỡ người khác, đôi khi đến mức quên mình.",
       "Người khác thường thấy bạn ấm áp, bao dung và dễ tạo cảm giác an toàn."),
      ("Master number 33 is associated with care, guidance and compassion.",
       "Deep down, you want to support others, sometimes to the point of forgetting yourself.",
       "Others often see you as warm, generous-hearted and reassuring."),
      ("Die Meisterzahl 33 wird mit Fürsorge, Begleitung und Mitgefühl verbunden.",
       "Im Inneren möchtest du andere tragen und unterstützen, manchmal so sehr, dass du dich selbst vergisst.",
       "Andere erleben dich oft als warm, großzügig und beruhigend.")),
}

PYEAR = {
 1: ("Năm khởi đầu: gieo hạt, mở việc mới, tự đứng trên đôi chân mình.",
     "A year of beginnings: plant seeds, start something new and stand on your own feet.",
     "Ein Jahr des Anfangs: Samen setzen, Neues beginnen und auf eigenen Beinen stehen."),
 2: ("Năm hợp tác: chậm lại, nuôi các mối quan hệ và kiên nhẫn với tiến độ.",
     "A year of partnership: slow down, nurture relationships and be patient with the pace.",
     "Ein Jahr der Zusammenarbeit: langsamer werden, Beziehungen pflegen und Geduld mit dem Tempo haben."),
 3: ("Năm nở hoa: sáng tạo, giao tiếp, vui chơi và đưa mình ra ngoài nhiều hơn.",
     "A year of blossoming: create, communicate, enjoy yourself and show more of who you are.",
     "Ein Jahr des Aufblühens: kreativ sein, kommunizieren, Freude haben und dich mehr zeigen."),
 4: ("Năm xây nền: kỷ luật, công việc, sức khỏe và những việc cần sắp xếp.",
     "A year of foundations: discipline, work, wellbeing and things that need organising.",
     "Ein Jahr des Fundaments: Disziplin, Arbeit, Wohlbefinden und Dinge, die geordnet werden müssen."),
 5: ("Năm thay đổi: dịch chuyển, đổi hướng, tự do và những điều bất ngờ.",
     "A year of change: movement, new directions, freedom and surprises.",
     "Ein Jahr der Veränderung: Bewegung, neue Richtungen, Freiheit und Überraschungen."),
 6: ("Năm của gia đình: tình yêu, trách nhiệm, nhà cửa và chăm sóc.",
     "A year of home and family: love, responsibility, home matters and care.",
     "Ein Jahr von Zuhause und Familie: Liebe, Verantwortung, Wohnen und Fürsorge."),
 7: ("Năm hướng vào trong: học hỏi, nghỉ ngơi, chiêm nghiệm và bớt ồn ào.",
     "A year of looking inward: learning, rest, reflection and less noise.",
     "Ein Jahr des Rückzugs nach innen: Lernen, Ruhe, Reflexion und weniger Lärm."),
 8: ("Năm gặt hái: tiền bạc, quyền hạn và kết quả của những gì đã xây trước đó.",
     "A year of harvest: money, authority and the results of what you built before.",
     "Ein Jahr der Ernte: Geld, Verantwortung und die Ergebnisse dessen, was du zuvor aufgebaut hast."),
 9: ("Năm khép vòng: dọn dẹp, buông bỏ, tha thứ và chuẩn bị cho chu kỳ mới.",
     "A year of closure: clear out, let go, forgive and prepare for the next cycle.",
     "Ein Jahr des Abschlusses: aufräumen, loslassen, vergeben und den nächsten Zyklus vorbereiten."),
}


def q(t):
    return "'" + t.replace('\\', '\\\\').replace("'", "\\'") + "'"


num = 'const NUM = {\n' + ',\n'.join(
    "  %d: { vi: { expr: %s, soul: %s, pers: %s },\n       en: { expr: %s, soul: %s, pers: %s },\n       de: { expr: %s, soul: %s, pers: %s } }" % (
        k, q(v[0][0]), q(v[0][1]), q(v[0][2]), q(v[1][0]), q(v[1][1]), q(v[1][2]), q(v[2][0]), q(v[2][1]), q(v[2][2]))
    for k, v in NUM.items()) + '\n};'

py = 'const PYEAR = {\n' + ',\n'.join(
    "  %d: { vi: %s, en: %s, de: %s }" % (k, q(v[0]), q(v[1]), q(v[2]))
    for k, v in PYEAR.items()) + '\n};'

for name, block in (('NUM', num), ('PYEAR', py)):
    m = re.search(r'^const %s = \{.*?^\};$' % name, s, re.S | re.M)
    if not m:
        sys.stderr.write('%s block not found\n' % name); sys.exit(1)
    s = s[:m.start()] + block + s[m.end():]

io.open(p, 'w', encoding='utf-8', newline='').write(s)
print('numerology.js: NUM (%d) and PYEAR (%d) rewritten in three languages' % (len(NUM), len(PYEAR)))
