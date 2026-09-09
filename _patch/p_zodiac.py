# -*- coding: utf-8 -*-
"""zodiac.js: section 3 (all 12 sign profiles, VI/EN rewritten + German),
section 4 (Life Path in three languages) and section 30.2 (German animals)."""
import io, re, sys

p = 'src/zodiac.js'
s = io.open(p, encoding='utf-8').read()
errors = []

# ---------------- 3. the twelve sun-sign profiles ----------------
block = io.open('_patch/zodiac_block.txt', encoding='utf-8').read().rstrip('\n')
m = re.search(r'^const ZODIAC = \{.*?^\};$', s, re.S | re.M)
if not m:
    errors.append('ZODIAC block not found')
else:
    s = s[:m.start()] + block + s[m.end():]

# ---------------- 4. Life Path ----------------
LIFEPATH = {
 1: ("Người mở đường. Độc lập, có ý chí, thích tự làm. Bài học: biết nhờ giúp đỡ.",
     "The pioneer. Independent, strong-willed and comfortable doing things alone. Lesson: learn to ask for help.",
     "Der Wegbereiter. Unabhängig, willensstark und gern selbstständig. Lektion: lernen, um Hilfe zu bitten."),
 2: ("Người kết nối. Nhạy cảm, hợp tác, giỏi dung hòa. Bài học: nói rõ tiếng nói của mình.",
     "The connector. Sensitive, cooperative and good at finding common ground. Lesson: make your own voice heard.",
     "Der Verbinder. Sensibel, kooperativ und gut darin, Ausgleich zu schaffen. Lektion: die eigene Stimme klar einbringen."),
 3: ("Người biểu đạt. Sáng tạo, vui vẻ, có duyên với lời nói. Bài học: đưa điều đã bắt đầu tới cùng.",
     "The expresser. Creative, lively and gifted with words. Lesson: carry what you start through to the end.",
     "Der Ausdrucksmensch. Kreativ, lebendig und sprachlich begabt. Lektion: Begonnenes zu Ende bringen."),
 4: ("Người xây dựng. Thực tế, bền bỉ, đáng tin. Bài học: linh hoạt hơn trước thay đổi.",
     "The builder. Practical, persistent and reliable. Lesson: become more flexible when things change.",
     "Der Erbauer. Praktisch, ausdauernd und verlässlich. Lektion: bei Veränderungen beweglicher werden."),
 5: ("Người tự do. Thích trải nghiệm, dịch chuyển và điều mới. Bài học: biết cam kết khi điều đó xứng đáng.",
     "The free spirit. Drawn to experience, movement and novelty. Lesson: know when something is worth committing to.",
     "Der Freigeist. Liebt Erfahrung, Bewegung und Neues. Lektion: erkennen, wann sich Verbindlichkeit lohnt."),
 6: ("Người chăm sóc. Ấm áp, trách nhiệm, coi trọng gia đình. Bài học: đừng ôm hết mọi thứ.",
     "The carer. Warm, responsible and family-minded. Lesson: do not carry everything yourself.",
     "Der Fürsorgliche. Warm, verantwortungsbewusst und familienverbunden. Lektion: nicht alles allein tragen."),
 7: ("Người tìm kiếm. Sâu sắc, thích suy ngẫm và muốn hiểu tới gốc. Bài học: học cách tin và mở lòng.",
     "The seeker. Reflective, deep and driven to understand what lies beneath. Lesson: learn to trust and open up.",
     "Der Suchende. Tiefgründig, nachdenklich und auf der Suche nach dem Kern. Lektion: Vertrauen und Öffnung lernen."),
 8: ("Người làm chủ. Tham vọng, có năng lực tổ chức và quản lý nguồn lực. Bài học: dùng sức mạnh có trách nhiệm.",
     "The achiever. Ambitious, organised and good at managing resources. Lesson: use power responsibly.",
     "Der Gestalter. Ehrgeizig, organisiert und gut im Umgang mit Ressourcen. Lektion: Einfluss verantwortungsvoll einsetzen."),
 9: ("Người cho đi. Rộng lượng, nhân ái, nhìn được bức tranh lớn. Bài học: biết buông những gì đã hết.",
     "The giver. Generous, compassionate and able to see the bigger picture. Lesson: let go of what has run its course.",
     "Der Gebende. Großzügig, mitfühlend und mit Blick fürs große Ganze. Lektion: loslassen, was seinen Lauf beendet hat."),
 11: ("Số bậc thầy 11: trực giác, cảm hứng và độ nhạy cao. Bài học: giữ mình vững trong thực tế.",
      "Master number 11: intuition, inspiration and heightened sensitivity. Lesson: stay grounded in practical reality.",
      "Meisterzahl 11: Intuition, Inspiration und hohe Sensibilität. Lektion: im Alltag gut geerdet bleiben."),
 22: ("Số bậc thầy 22: biến tầm nhìn lớn thành điều có cấu trúc và bền vững. Bài học: kiên nhẫn với quá trình.",
      "Master number 22: turning a large vision into something structured and lasting. Lesson: be patient with the process.",
      "Meisterzahl 22: eine große Vision in etwas Strukturiertes und Dauerhaftes verwandeln. Lektion: Geduld mit dem Prozess."),
 33: ("Số bậc thầy 33: năng lượng chăm sóc, dẫn dắt và nâng đỡ. Bài học: chăm mình trước khi chăm tất cả.",
      "Master number 33: an energy of care, guidance and support. Lesson: care for yourself before trying to carry everyone.",
      "Meisterzahl 33: eine Energie von Fürsorge, Führung und Unterstützung. Lektion: zuerst für dich selbst sorgen, bevor du alle anderen trägst."),
}
lp = 'const LIFEPATH = {\n' + ',\n'.join(
    "  %d: { vi: '%s', en: '%s', de: '%s' }" % (
        k, v[0].replace("'", "\\'"), v[1].replace("'", "\\'"), v[2].replace("'", "\\'"))
    for k, v in LIFEPATH.items()) + '\n};'
m = re.search(r'^const LIFEPATH = \{.*?^\};$', s, re.S | re.M)
if not m:
    errors.append('LIFEPATH block not found')
else:
    s = s[:m.start()] + lp + s[m.end():]

# ---------------- 30.2 German animal names ----------------
ANIMALS_DE = ['Ratte', 'Büffel', 'Tiger', 'Katze', 'Drache', 'Schlange',
              'Pferd', 'Ziege', 'Affe', 'Hahn', 'Hund', 'Schwein']
i = [0]


def add_de(mm):
    if i[0] >= 12:
        errors.append('more than 12 ANIMALS entries'); return mm.group(0)
    out = "{ vi: '%s', en: '%s', de: '%s' }" % (mm.group(1), mm.group(2), ANIMALS_DE[i[0]])
    i[0] += 1
    return out


m = re.search(r'^const ANIMALS = \[.*?^\];$', s, re.S | re.M)
if not m:
    errors.append('ANIMALS block not found')
else:
    blk = re.sub(r"\{ vi: '([^']*)', en: '([^']*)' \}", add_de, m.group(0))
    if i[0] != 12:
        errors.append('ANIMALS rewritten: %d of 12' % i[0])
    s = s[:m.start()] + blk + s[m.end():]

io.open(p, 'w', encoding='utf-8', newline='').write(s)
if errors:
    sys.stderr.write('\n'.join(errors) + '\n'); sys.exit(1)
print('zodiac.js: 12 sign profiles, 12 life paths, 12 German animal names')
