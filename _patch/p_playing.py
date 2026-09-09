# -*- coding: utf-8 -*-
import io, sys

p = 'src/playing.js'
s = io.open(p, encoding='utf-8').read()
R = []

# ======================= 6.1 + 29.1 : PC_SUIT_TEXT =======================
old_suits = """const PC_SUIT_TEXT = {
  h: { vi: ['Cơ', 'Chất này nói về tình cảm, gia đình, niềm vui và những gì bạn yêu, và tương ứng với Cốc trong tarot. Người của Cơ thường da sáng, tóc sáng, tính ấm áp. Mùa của Cơ là xuân.', '♥ = Cốc · nước · cảm xúc'],
       en: ['Hearts', 'Love, family, joy and what you care for. The tarot twin is Cups. People: fair, warm-natured. Season: spring.', '♥ = Cups · water · feeling'] },
  d: { vi: ['Rô', 'Chất này nói về tiền bạc, công việc, tin tức và chuyện thực tế, và tương ứng với Tiền. Người của Rô thường tóc rất sáng hoặc hung, và nhanh nhẹn. Mùa của Rô là thu.', '♦ = Tiền · đất · vật chất'],
       en: ['Diamonds', 'Money, work, news and practical matters. The tarot twin is Pentacles. People: very fair or red-haired, quick. Season: autumn.', '♦ = Pentacles · earth · the material'] },
  c: { vi: ['Chuồn', 'Chất này nói về hành động, việc làm ăn, bạn bè và may mắn, và tương ứng với Gậy. Người của Chuồn thường tóc nâu, cởi mở, năng động. Mùa của Chuồn là hè.', '♣ = Gậy · lửa · hành động'],
       en: ['Clubs', 'Action, business, friends and luck. The tarot twin is Wands. People: brown-haired, open, energetic. Season: summer.', '♣ = Wands · fire · action'] },
  s: { vi: ['Bích', 'Chất này nói về thử thách, lo âu, tin không vui và những quyết định khó, và tương ứng với Kiếm. Người của Bích thường tóc sẫm, kín đáo, nghiêm. Mùa của Bích là đông.', '♠ = Kiếm · khí · suy nghĩ'],
       en: ['Spades', 'Challenges, worry, unwelcome news and hard decisions. The tarot twin is Swords. People: dark-haired, reserved, serious. Season: winter.', '♠ = Swords · air · thought'] }
};"""

new_suits = """const PC_SUIT_TEXT = {
  h: { vi: ['Cơ', 'Cơ nói về tình cảm, gia đình, niềm vui và những gì bạn trân trọng. Khi đối chiếu với Tarot, Cơ tương ứng với Cốc. Mùa: xuân.', '♥ = Cốc · nước · cảm xúc'],
       en: ['Hearts', 'Hearts speak of love, family, joy and what you cherish. When compared with Tarot, Hearts correspond to Cups. Season: spring.', '♥ = Cups · water · feeling'],
       de: ['Herz', 'Herz steht für Liebe, Familie, Freude und das, was dir am Herzen liegt. Im Vergleich mit Tarot entspricht Herz den Kelchen. Jahreszeit: Frühling.', '♥ = Kelche · Wasser · Gefühl'] },
  d: { vi: ['Rô', 'Rô nói về tiền bạc, công việc, tin tức và chuyện thực tế. Khi đối chiếu với Tarot, Rô tương ứng với Tiền. Mùa: thu.', '♦ = Tiền · đất · vật chất'],
       en: ['Diamonds', 'Diamonds speak of money, work, news and practical matters. When compared with Tarot, Diamonds correspond to Pentacles. Season: autumn.', '♦ = Pentacles · earth · the material'],
       de: ['Karo', 'Karo steht für Geld, Arbeit, Nachrichten und praktische Themen. Im Vergleich mit Tarot entspricht Karo den Münzen. Jahreszeit: Herbst.', '♦ = Münzen · Erde · Materielles'] },
  c: { vi: ['Chuồn', 'Chuồn nói về hành động, công việc, bạn bè và may mắn. Khi đối chiếu với Tarot, Chuồn tương ứng với Gậy. Mùa: hè.', '♣ = Gậy · lửa · hành động'],
       en: ['Clubs', 'Clubs speak of action, work, friends and luck. When compared with Tarot, Clubs correspond to Wands. Season: summer.', '♣ = Wands · fire · action'],
       de: ['Kreuz', 'Kreuz steht für Handlung, Arbeit, Freundschaften und Glück. Im Vergleich mit Tarot entspricht Kreuz den Stäben. Jahreszeit: Sommer.', '♣ = Stäbe · Feuer · Handlung'] },
  s: { vi: ['Bích', 'Bích nói về thử thách, lo âu, tin không vui và những quyết định khó. Khi đối chiếu với Tarot, Bích tương ứng với Kiếm. Mùa: đông.', '♠ = Kiếm · khí · suy nghĩ'],
       en: ['Spades', 'Spades speak of challenges, worry, unwelcome news and difficult decisions. When compared with Tarot, Spades correspond to Swords. Season: winter.', '♠ = Swords · air · thought'],
       de: ['Pik', 'Pik steht für Herausforderungen, Sorgen, unerfreuliche Nachrichten und schwierige Entscheidungen. Im Vergleich mit Tarot entspricht Pik den Schwertern. Jahreszeit: Winter.', '♠ = Schwerter · Luft · Denken'] }
};"""
R.append((old_suits, new_suits))

# ======================= PC_RANK_TEXT : de (+ 6.2 rank 3) ================
rank_de = {
 'A': "['Anfang', 'Das Ass ist der Samen der Farbe: ihre reinste Form, die gerade erst erscheint.']",
 '2': "['Paar, Entscheidung', 'Die Zwei steht für zwei Menschen oder zwei Wege: für Gleichgewicht oder eine Entscheidung.']",
 '4': "['Stabilität', 'Die Vier ist ein Fundament: fest, ruhig und manchmal etwas unbeweglich.']",
 '5': "['Veränderung, Reibung', 'Die Fünf durchbricht die Ruhe der Vier: Unruhe, Konflikt oder eine Entscheidung.']",
 '6': "['Harmonie, Anpassung', 'Die Sechs ordnet nach der Fünf neu: Versöhnung, Erinnerungen oder angebotene Hilfe.']",
 '7': "['Prüfung, Abwägen', 'Die Sieben ist eine Prüfung: Einschätzung, eine kleine Enttäuschung oder eine Versuchung.']",
 '8': "['Bewegung', 'Die Acht steht für Bewegung und Veränderung: Reise, Fortschritt oder Nachrichten auf dem Weg.']",
 '9': "['Fast vollendet', 'Die Neun steht für Wunsch und Ergebnis: Bei Herz ist sie die Wunschkarte, bei Pik die Karte der Enttäuschung.']",
 '10': "['Vollendung, Fülle', 'Die Zehn zeigt die stärkste Ausprägung der Farbe: große Freude bei Herz, viel Geld bei Karo, Erfolg bei Kreuz und ein Ende bei Pik.']",
 'J': "['Junger Mensch, Nachricht', 'Der Bube kann für einen jungen Menschen oder eine Nachricht stehen, die den Charakter der Farbe trägt.']",
 'Q': "['Frau, reife Energie', 'Die Dame kann für eine erwachsene Frau oder für eine fürsorgliche, wahrnehmende Seite in dir stehen.']",
 'K': "['Mann, Autorität', 'Der König kann für einen erwachsenen Mann, eine Autoritätsperson oder deine entschlossene Seite stehen.']",
}
rank_en_tail = {
 'A': "en: ['Beginning', 'The Ace is the seed of the suit: its purest form, just appearing.'] }",
 '2': "en: ['A pair, a choice', 'Two is two people or two roads. Balance, or a choice to make.'] }",
 '4': "en: ['Stability', 'Four is a foundation: solid, quiet, sometimes a little stiff.'] }",
 '5': "en: ['Change, friction', 'Five breaks the calm of Four: disruption, argument, or a decision.'] }",
 '6': "en: ['Harmony, adjustment', 'Six repairs after Five: reconciliation, memories, help offered.'] }",
 '7': "en: ['A test, a weighing up', 'Seven is the examination: assessment, a small disappointment, or a temptation.'] }",
 '8': "en: ['Movement', 'Eight is going and changing: a journey, progress, news on the way.'] }",
 '9': "en: ['Nearly complete', 'Nine is the wish and the result: in Hearts the wish card, in Spades the disappointment.'] }",
 '10': "en: ['Complete, full', 'Ten is the suit at its fullest: full happiness (Hearts), big money (Diamonds), success (Clubs), an ending (Spades).'] }",
 'J': "en: ['A young person, a message', 'The Jack is a young person, or a message carrying the suit’s character.'] }",
 'Q': "en: ['A woman', 'The Queen is a grown woman, or the caring, sensing side of you.'] }",
 'K': "en: ['A man, authority', 'The King is a grown man, someone in charge, or the decisive side of you.'] }",
}
for k, tail in rank_en_tail.items():
    R.append((tail, tail[:-2] + ', de: ' + rank_de[k] + ' }'))

# 6.2 rank 3 (VI + EN revised) + DE
R.append((
 "3: { vi: ['Mọc lên, nhóm nhỏ', 'Ba là điều gì đó bắt đầu lớn lên, hoặc là một người thứ ba xuất hiện.'], en: ['Growth, a small group', 'Three is something starting to grow, or a third person joining.'] },",
 "3: { vi: ['Mọc lên, nhóm nhỏ', 'Ba là điều gì đó bắt đầu lớn lên, hoặc một yếu tố thứ ba xuất hiện.'], en: ['Growth, a small group', 'Three is something beginning to grow, or a third factor entering the picture.'], de: ['Wachstum, kleine Gruppe', 'Die Drei steht für etwas, das zu wachsen beginnt, oder für einen dritten Faktor, der ins Bild kommt.'] },"))

# ======================= PC_COURT_TEXT : de (+ 6.2 sQ, sK) ===============
court = [
 ("hJ", "en: 'A close friend, a young lover, a gentle and affectionate person. Good news in love.' }",
  "Ein enger Freund, eine junge Liebe oder ein sanfter, herzlicher Mensch. Oft verbunden mit erfreulichen Nachrichten in Herzensdingen."),
 ("hQ", "en: 'A warm, trustworthy woman, often a mother figure. Someone on your side.' }",
  "Eine warme, verlässliche Frau, manchmal eine mütterliche Figur. Jemand, der auf deiner Seite steht."),
 ("hK", "en: 'A kind, generous man, sometimes soft-hearted. Gentle advice.' }",
  "Ein freundlicher, großzügiger Mann, manchmal etwas weichherzig. Er bringt eher einen wohlwollenden Rat als Druck."),
 ("dJ", "en: 'A young person bringing news about money or work, sometimes not quite reliable.' }",
  "Ein junger Mensch, der Nachrichten über Geld oder Arbeit bringt; seine Verlässlichkeit sollte geprüft werden."),
 ("dQ", "en: 'A practical, calculating woman, sometimes the one who gossips.' }",
  "Eine praktische, rechnerisch starke Frau; im Schatten kann sie sich zu sehr in die Angelegenheiten anderer einmischen."),
 ("dK", "en: 'A man with money or position, decisive in business.' }",
  "Ein Mann mit Geld, Einfluss oder geschäftlicher Verantwortung; entschlossen und praktisch orientiert."),
 ("cJ", "en: 'A loyal friend, an energetic young person, an invitation.' }",
  "Ein loyaler Freund, ein energiegeladener junger Mensch oder eine Einladung, die Bewegung bringt."),
 ("cQ", "en: 'A confident, helpful woman with a voice in the group.' }",
  "Eine selbstbewusste, hilfsbereite Frau, deren Stimme in einer Gruppe Gewicht hat."),
 ("cK", "en: 'A straight, dependable man who builds things. A mentor.' }",
  "Ein direkter, verlässlicher Mann, der etwas aufbauen kann; häufig eine Mentor- oder Führungsperson."),
 ("sJ", "en: 'An unpredictable young person, unwelcome news, or someone watching you.' }",
  "Ein schwer einzuschätzender junger Mensch, eine unerfreuliche Nachricht oder jemand, der sehr genau beobachtet."),
]
for _id, tail, de in court:
    R.append((tail, tail[:-2] + ", de: '" + de + "' }"))

# 6.2 sQ / sK: VI + EN revised, plus DE
R.append((
 "sQ: { vi: 'Lá này chỉ người phụ nữ sắc sảo, từng trải, có thể goá hoặc cô đơn, và đôi khi khắt khe.', en: 'A sharp, experienced woman, perhaps widowed or alone, sometimes harsh.' },",
 "sQ: { vi: 'Lá này chỉ một người phụ nữ sắc sảo, từng trải, độc lập; đôi khi lạnh hoặc khắt khe.', en: 'A sharp, experienced and independent woman; sometimes cool or demanding.', de: 'Eine scharfsinnige, erfahrene und unabhängige Frau; manchmal kühl oder streng.' },"))
R.append((
 "sK: { vi: 'Lá này chỉ người đàn ông có quyền và lạnh, như luật sư, sếp, hay người phán xét.', en: 'A cold man with power: a lawyer, a boss, a judge.' }",
 "sK: { vi: 'Lá này chỉ người có quyền, lý trí và nghiêm; có thể gợi tới luật sư, lãnh đạo hoặc người phán xét.', en: 'A person with authority, rational and serious; it may point to a lawyer, leader or judge.', de: 'Eine autoritäre, rationale und ernste Person; sie kann auf einen Anwalt, eine Führungskraft oder einen Richter hinweisen.' }"))

# ======================= PC_COMBOS : de =================================
combos = [
 ("en: 'A wish coming true, happiness at home.' }", "Ein Wunsch rückt näher; Freude oder Harmonie im Zuhause."),
 ("en: 'A couple, a marriage, a settled home.' }", "Ein Paar, eine feste Verbindung oder ein ruhigeres Familienleben."),
 ("en: 'An engagement, a promise to commit.' }", "Verlobung, Bindungswunsch oder ein ernst gemeintes Versprechen."),
 ("en: 'Good news about money, a sum arriving.' }", "Gute Nachrichten rund um Geld; ein Betrag oder eine Zahlung kann eintreffen."),
 ("en: 'A big contract, a journey for work.' }", "Ein größerer Vertrag oder eine Reise im Zusammenhang mit Arbeit."),
 ("en: 'Business succeeding, success through friends.' }", "Ein Vorhaben kann gelingen; Unterstützung durch Freunde oder Kontakte spielt eine Rolle."),
 ("en: 'Luck plus joy: an expectation met.' }", "Glück trifft auf Freude: Eine Hoffnung kann sich erfüllen."),
 ("en: 'A big ending; closing to open again.' }", "Ein deutlicher Abschluss; etwas endet, damit Raum für Neues entsteht."),
 ("en: 'A wish not yet granted: wait, or change the wish.' }", "Ein Wunsch ist noch nicht reif: Warte etwas oder prüfe, ob du ihn neu formulieren möchtest."),
 ("en: 'Worry on worry; rest, decide nothing now.' }", "Sorge verstärkt Sorge. Ruhe dich aus und triff wichtige Entscheidungen nicht aus Überforderung heraus."),
 ("en: 'Money and work being weighed: a practical decision.' }", "Geld und Arbeit werden abgewogen; eine praktische Entscheidung steht an."),
 ("en: 'Two young friends, a cheerful invitation.' }", "Zwei junge Menschen oder Freunde; eine fröhliche Einladung oder Begegnung."),
]
for tail, de in combos:
    R.append((tail, tail[:-2] + ", de: '" + de + "' }"))

# ======================= PC_SPECIAL : de ================================
R.append((
 "const PC_SPECIAL = { h9: { vi: 'Lá ước nguyện', en: 'The wish card' }, s9: { vi: 'Lá thất vọng', en: 'The disappointment card' }, sA: { vi: 'Lá kết thúc', en: 'The ending card' }, d10: { vi: 'Lá tiền lớn', en: 'The big-money card' }, c10: { vi: 'Lá thành công', en: 'The success card' }, h10: { vi: 'Lá hạnh phúc', en: 'The happiness card' } };",
 "const PC_SPECIAL = { h9: { vi: 'Lá ước nguyện', en: 'The wish card', de: 'Die Wunschkarte' }, s9: { vi: 'Lá thất vọng', en: 'The disappointment card', de: 'Die Karte der Enttäuschung' }, sA: { vi: 'Lá kết thúc', en: 'The ending card', de: 'Die Karte des Endes' }, d10: { vi: 'Lá tiền lớn', en: 'The big-money card', de: 'Die Karte des großen Geldes' }, c10: { vi: 'Lá thành công', en: 'The success card', de: 'Die Erfolgskarte' }, h10: { vi: 'Lá hạnh phúc', en: 'The happiness card', de: 'Die Glückskarte' } };"))

# ======================= PC_TIMING : 6.2 VI/EN + de =====================
R.append((
 "const PC_TIMING = { vi: ['Bạn hãy chốt đơn vị trước khi xào: ngày, tuần hay tháng.', 'Số trên lá là số đơn vị đó: Ba Cơ trong khung tuần là khoảng ba tuần.', 'Cơ và Rô thường đến nhanh hơn Chuồn và Bích.', 'Mùa đi theo chất: Cơ là xuân, Chuồn là hè, Rô là thu, Bích là đông.', 'Không có quy ước nào được mọi sách đồng ý, nên bạn hãy giữ một cách và dùng đều.'],\n                    en: ['Fix the unit before you shuffle: days, weeks or months.', 'The number on the card is that many units: a Three of Hearts in a weekly frame is about three weeks.', 'Hearts and Diamonds tend to arrive faster than Clubs and Spades.', 'Seasons by suit: Hearts spring, Clubs summer, Diamonds autumn, Spades winter.', 'No convention is shared by every book; keep one and use it consistently.'] };",
 "const PC_TIMING = { vi: ['Chọn đơn vị trước khi xào bài: ngày, tuần hoặc tháng.', 'Số trên lá là số đơn vị đó: Ba Cơ trong khung tuần là khoảng ba tuần.', 'Cơ và Rô thường đến nhanh hơn Chuồn và Bích.', 'Mùa đi theo chất: Cơ là xuân, Chuồn là hè, Rô là thu, Bích là đông.', 'Không có một quy ước thời gian duy nhất cho mọi trường phái; hãy chọn một cách và dùng nhất quán.'],\n                    en: ['Choose the unit before shuffling: days, weeks or months.', 'The number on the card is that many units: a Three of Hearts in a weekly frame is about three weeks.', 'Hearts and Diamonds tend to arrive faster than Clubs and Spades.', 'Seasons by suit: Hearts spring, Clubs summer, Diamonds autumn, Spades winter.', 'There is no single timing convention shared by every tradition; choose one method and use it consistently.'],\n                    de: ['Leg vor dem Mischen die Einheit fest: Tage, Wochen oder Monate.', 'Die Zahl auf der Karte steht für entsprechend viele Einheiten: Eine Herz Drei in einem Wochenrahmen bedeutet etwa drei Wochen.', 'Herz und Karo werden traditionell oft schneller gelesen als Kreuz und Pik.', 'Jahreszeiten nach Farben: Herz Frühling, Kreuz Sommer, Karo Herbst, Pik Winter.', 'Es gibt keine einzige Zeitregel, die alle Traditionen teilen; wähl eine Methode und bleib dabei.'] };"))

# ======================= PC_SPREADS : de ================================
spreads = [
 ("en: ['Three cards', 'Past, present, future. The daily spread.'] }",
  "de: ['Drei Karten', 'Vergangenheit, Gegenwart, Zukunft. Eine einfache Legung für den Alltag.']"),
 ("en: ['Five cards', 'Past, present, what blocks, advice, outcome. Read left to right as a sentence.'] }",
  "de: ['Fünf Karten', 'Vergangenheit, Gegenwart, Hindernis, Rat und mögliche Entwicklung. Lies die Karten von links nach rechts wie einen Satz.']"),
 ("en: ['Nine cards', 'Three rows: the situation above, you now in the middle, the outcome below. The centre card is the heart.'] }",
  "de: ['Neun Karten', 'Drei Reihen: oben die Situation, in der Mitte dein jetziger Stand, unten die mögliche Entwicklung. Die mittlere Karte bildet den Schwerpunkt.']"),
 ("en: ['The wish spread', 'Think of a wish, shuffle, deal 15 cards. The Nine of Hearts present: the wish comes. The Nine of Spades: not now. Neither: it is up to you.'] }",
  "de: ['Wunschlegung', 'Denk an einen Wunsch, misch und zieh 15 Karten. Traditionell gilt Herz Neun als günstiges Zeichen und Pik Neun als Hinweis auf Verzögerung. Fehlen beide, bleibt die Entwicklung offen. Sieh diese Legung spielerisch, nicht als Garantie.']"),
]
for tail, de in spreads:
    R.append((tail, tail[:-2] + ', ' + de + ' }'))

# ======================= PC_LESSONS : de titles + intros ================
lessons = [
 ("en: 'The deck at a glance: 52 cards, four suits' }", "Überblick: 52 Karten und vier Farben", None),
 ("en: 'Ace to Ten: one story' }", "Ass bis Zehn: eine gemeinsame Geschichte", None),
 ("en: 'The ten numbers tell the same story in all four suits: seed, pair, growth, stability, friction, repair, test, movement, nearly complete, complete. Know this story and you can guess 40 cards before looking anything up.' }",
  None, "Die zehn Zahlen erzählen in allen vier Farben eine ähnliche Entwicklung: Samen, Paar, Wachstum, Stabilität, Reibung, Ausgleich, Prüfung, Bewegung, fast vollendet, vollendet. Wenn du dieses Muster kennst, kannst du viele Karten schon einordnen, bevor du nachschlägst."),
 ("en: 'Hearts: love and family' }", "Herz: Liebe und Familie", None),
 ("en: 'The thirteen Hearts, from the new home of the Ace to the full happiness of the Ten. The Nine of Hearts is the wish card, the most hoped-for card in the deck.' }",
  None, "Die dreizehn Herzkarten reichen vom neuen emotionalen Anfang des Asses bis zur Fülle der Zehn. Herz Neun gilt traditionell als Wunschkarte."),
 ("en: 'Diamonds: money and news' }", "Karo: Geld und Nachrichten", None),
 ("en: 'Diamonds speak about what can be counted: money, papers, journeys, news. Read Diamonds literally first, then more widely.' }",
  None, "Karo spricht über greifbare Dinge wie Geld, Dokumente, Reisen und Nachrichten. Lies die Karte zunächst konkret und erweitere die Bedeutung erst danach."),
 ("en: 'Clubs: work and luck' }", "Kreuz: Arbeit und Glück", None),
 ("en: 'Clubs are the suit of action, friends and opportunity. Many Clubs in a spread means things are moving.' }",
  None, "Kreuz ist die Farbe von Handlung, Arbeit, Freunden und Chancen. Viele Kreuzkarten können darauf hinweisen, dass die Angelegenheit in Bewegung kommt."),
 ("en: 'Spades: challenges and decisions' }", "Pik: Herausforderungen und Entscheidungen", None),
 ("en: 'Spades are the hardest suit and the most honest: they name what is in the way. Read Spades as a useful warning, never a curse.' }",
  None, "Pik benennt eher schwierige Themen, Sorgen und Entscheidungen. Lies die Farbe als hilfreichen Hinweis auf das, was Aufmerksamkeit braucht — nicht als Fluch oder festgeschriebenes Schicksal."),
 ("en: 'The court: 12 people' }", "Hofkarten: zwölf Personen und Rollen", None),
 ("en: 'The Jack, Queen and King of each suit are three people: young, a woman, a man, with the suit’s character. A court card can also be a side of you or a way of acting.' }",
  None, "Bube, Dame und König jeder Farbe können Menschen, Rollen oder Verhaltensweisen darstellen. Das Geschlecht der traditionellen Kartenbezeichnung muss nicht mit der tatsächlichen Person übereinstimmen."),
 ("en: 'Pairs and timing' }", "Kartenpaare und Zeit", None),
 ("en: 'Playing cards are read in pairs and by majority: two neighbours change each other’s meaning, and the suit that dominates says where the matter lives. Timing is the number on the card inside the frame you fixed.' }",
  None, "Beim Kartenlegen werden Nachbarkarten oft zusammen gelesen, und die häufigste Farbe kann das Hauptthema anzeigen. Für Zeitangaben legst du vor dem Mischen einen Rahmen fest und verwendest ihn anschließend konsequent."),
 ("en: 'Spreads and practice' }", "Legungen und Übung", None),
 ("en: 'Start with three cards each morning. Five when the question is clear. Nine for a big matter. The wish spread for fun, and to remember that the deck speaks about tendencies, not fate.' }",
  None, "Beginne zum Üben mit drei Karten. Fünf Karten eignen sich für eine klare Frage, neun für ein größeres Thema. Die Wunschlegung darf spielerisch bleiben: Karten zeigen Deutungsmöglichkeiten und Tendenzen, keine garantierte Zukunft."),
]
for tail, title, intro in lessons:
    de = title if title is not None else intro
    R.append((tail, tail[:-2] + ", de: '" + de.replace("'", "\\'") + "' }"))

# ======================= 29.1 renderer / pcName ==========================
R.append((
 "const pcName = (suit, rank) => { const X = LEX[lang], r = /[JQK]/.test(rank) ? (lang === 'vi' ? { J: 'J', Q: 'Q', K: 'K' }[rank] : { J: 'Jack', Q: 'Queen', K: 'King' }[rank]) : (rank === 'A' ? (lang === 'vi' ? 'Át' : 'Ace') : rank); return lang === 'vi' ? r + ' ' + PC_SUIT_TEXT[suit].vi[0] : r + ' of ' + PC_SUIT_TEXT[suit].en[0]; };",
 "const PC_RANK_DE = { A: 'Ass', 2: 'Zwei', 3: 'Drei', 4: 'Vier', 5: 'Fünf', 6: 'Sechs', 7: 'Sieben', 8: 'Acht', 9: 'Neun', 10: 'Zehn', J: 'Bube', Q: 'Dame', K: 'König' };\nconst pcName = (suit, rank) => {\n  if (lang === 'de') return PC_SUIT_TEXT[suit].de[0] + ' ' + (PC_RANK_DE[rank] || rank);\n  const r = /[JQK]/.test(rank) ? (lang === 'vi' ? { J: 'J', Q: 'Q', K: 'K' }[rank] : { J: 'Jack', Q: 'Queen', K: 'King' }[rank]) : (rank === 'A' ? (lang === 'vi' ? 'Át' : 'Ace') : rank);\n  return lang === 'vi' ? r + ' ' + PC_SUIT_TEXT[suit].vi[0] : r + ' of ' + PC_SUIT_TEXT[suit].en[0];\n};"))

# PC_TRAD three-way lookups (PC_TRAD gains a [2] German slot in fortune.js).
# Two occurrences: the suit grid and the card detail page.
MULTI = [("esc(lang === 'vi' ? tr[0] : tr[1])",
          "esc(lang === 'vi' ? tr[0] : (lang === 'de' ? (tr[2] || tr[1]) : tr[1]))", 2)]

# labels
R.append(("esc(lang === 'vi' ? 'Thời gian' : 'Timing')", "esc(lang === 'vi' ? 'Thời gian' : (lang === 'de' ? 'Zeit' : 'Timing'))"))
R.append(("' · ' + s.n + (lang === 'vi' ? ' lá' : ' cards')", "' · ' + s.n + (lang === 'vi' ? ' lá' : (lang === 'de' ? ' Karten' : ' cards'))"))
R.append(("esc(lang === 'vi' ? 'Tra một lá bất kỳ và so với tarot' : 'Look up any card and compare with tarot')",
          "esc(lang === 'vi' ? 'Tra một lá bất kỳ và so với tarot' : (lang === 'de' ? 'Eine Karte nachschlagen und mit Tarot vergleichen' : 'Look up any card and compare with tarot'))"))
R.append(("esc(lang === 'vi' ? 'Vì sao lá này mang nghĩa này' : 'Why the card means this')",
          "esc(lang === 'vi' ? 'Vì sao lá này mang nghĩa này' : (lang === 'de' ? 'Warum diese Karte so gedeutet wird' : 'Why the card means this'))"))
R.append(("esc(lang === 'vi' ? 'Người' : 'The person')",
          "esc(lang === 'vi' ? 'Người' : (lang === 'de' ? 'Die Person' : 'The person'))"))
R.append(("esc(lang === 'vi' ? 'Cặp lá thường gặp' : 'Common pairs')",
          "esc(lang === 'vi' ? 'Cặp lá thường gặp' : (lang === 'de' ? 'Häufige Kartenpaare' : 'Common pairs'))"))

fail = 0
for old, new, n in MULTI:
    c = s.count(old)
    if c != n:
        sys.stderr.write('MULTI COUNT %d (want %d) :: %s\n' % (c, n, old[:110]))
        fail += 1
        continue
    s = s.replace(old, new)
for old, new in R:
    c = s.count(old)
    if c != 1:
        sys.stderr.write('COUNT %d :: %s\n' % (c, old[:110]))
        fail += 1
        continue
    s = s.replace(old, new)
if fail:
    sys.exit(1)

io.open(p, 'w', encoding='utf-8', newline='').write(s)
print('playing.js: %d replacements applied' % len(R))
