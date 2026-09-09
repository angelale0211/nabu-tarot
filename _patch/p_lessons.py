# -*- coding: utf-8 -*-
import io, sys

p = 'src/lessons.js'
s = io.open(p, encoding='utf-8').read()

R = [
# ---- 29.3 tarot titles + intros ----
("en: 'The deck at a glance and the Fool\\'s Journey' }",
 "en: 'The deck at a glance and the Fool\\'s Journey', de: 'Aufbau des Decks und die Reise des Narren' }"),

("en: 'Majors 0–7: stepping into the world' }",
 "en: 'Majors 0–7: stepping into the world', de: 'Große Arkana 0–7: hinaus in die Welt' }"),

("en: 'The first eight cards are the first teachers on the road. Learn them in order, one a day, and retell why each card follows the last.' }",
 "en: 'The first eight cards are the first teachers on the road. Learn them in order, one a day, and retell why each card follows the last.', de: 'Die ersten acht Karten sind die ersten Lehrmeister auf dem Weg des Narren. Lern sie der Reihe nach, am besten eine pro Tag, und erzähl dir selbst, warum jede Karte auf die vorherige folgt.' }"),

("en: 'Majors 8–14: turning inward' }",
 "en: 'Majors 8–14: turning inward', de: 'Große Arkana 8–14: der Weg nach innen' }"),

("en: 'After the first victory, the Fool learns that real strength is quiet. These seven cards speak of letting go, waiting, owning your actions and finding balance.' }",
 "en: 'After the first victory, the Fool learns that real strength is quiet. These seven cards speak of letting go, waiting, owning your actions and finding balance.', de: 'Nach dem ersten Vorwärtsdrang beginnt die Reise nach innen. Diese sieben Karten handeln von innerer Stärke, Loslassen, Warten, Verantwortung und dem Wiederfinden von Balance.' }"),

("en: 'Majors 15–21: darkness and light' }",
 "en: 'Majors 15–21: darkness and light', de: 'Große Arkana 15–21: von Dunkelheit zu Licht' }"),

("en: 'The last stretch: bound, toppled, then hope, fog, light, awakening and arrival. These are the strongest cards in the deck.' }",
 "en: 'The last stretch: bound, toppled, then hope, fog, light, awakening and arrival. These are the strongest cards in the deck.', de: 'Der letzte Abschnitt führt durch Bindung und Zusammenbruch hin zu Hoffnung, Ungewissheit, Klarheit, Erwachen und Vollendung. Diese Karten markieren besonders große Wendepunkte im symbolischen Weg der Großen Arkana.' }"),

("en: 'Wands and Cups: fire and water' }",
 "en: 'Wands and Cups: fire and water', de: 'Stäbe und Kelche: Feuer und Wasser' }"),

("en: 'The Minors run from Ace (the seed) to Ten (the outcome). Wands are action and passion. Cups are feeling and love. Look at the ten in a row and you see a story that rises and falls.' }",
 "en: 'The Minors run from Ace (the seed) to Ten (the outcome). Wands are action and passion. Cups are feeling and love. Look at the ten in a row and you see a story that rises and falls.', de: 'Jede Farbe der Kleinen Arkana läuft vom Ass, dem Samen, bis zur Zehn, dem Ergebnis. Stäbe stehen für Handlung und Leidenschaft, Kelche für Gefühle und Beziehungen. In der ganzen Reihe erkennst du eine Entwicklung mit Höhen und Tiefen.' }"),

("en: 'Swords and Pentacles: air and earth' }",
 "en: 'Swords and Pentacles: air and earth', de: 'Schwerter und Münzen: Luft und Erde' }"),

("en: 'Swords are thought, words and conflict: the hardest suit in the deck. Pentacles are money, health and practical work: the slow and steady suit.' }",
 "en: 'Swords are thought, words and conflict: the hardest suit in the deck. Pentacles are money, health and practical work: the slow and steady suit.', de: 'Schwerter stehen für Gedanken, Worte, Entscheidungen und Konflikte. Münzen stehen für Geld, Körper, Alltag und praktische Arbeit. Beide Farben werden leichter, wenn du zuerst das Element und dann die Zahl liest.' }"),

("en: 'The court: 16 characters' }",
 "en: 'The court: 16 characters', de: 'Die 16 Hofkarten: Menschen, Rollen und Verhaltensweisen' }"),

("en: 'Four ranks times four suits. Read across a row for the suit, down a column for the rank. A court card can be a person, a part of you, or a way of acting.' }",
 "en: 'Four ranks times four suits. Read across a row for the suit, down a column for the rank. A court card can be a person, a part of you, or a way of acting.', de: 'Vier Ränge mal vier Farben ergeben sechzehn Hofkarten. Lies quer, um die Farbe zu verstehen, und längs, um den Rang zu vergleichen. Eine Hofkarte kann einen Menschen, eine Seite von dir oder eine Art zu handeln beschreiben.' }"),

("en: 'Spreads and reading practice' }",
 "en: 'Spreads and reading practice', de: 'Legungen und Lesepraxis' }"),

("en: 'Start with one card, then three. Save the Celtic Cross for when reading feels natural. Every spread has a diagram and a question for each position.' }",
 "en: 'Start with one card, then three. Save the Celtic Cross for when reading feels natural. Every spread has a diagram and a question for each position.', de: 'Beginne mit einer Karte und geh danach zu drei Karten über. Den Celtic Cross kannst du dir für später aufheben, wenn das Lesen schon vertrauter geworden ist. Jede Legung hat eine eigene Anordnung und eine Frage für jede Position.' }"),

# ---- 29.3 lenormand titles + intros ----
("en: 'What Lenormand is and how to learn it' }",
 "en: 'What Lenormand is and how to learn it', de: 'Was Lenormand ist und wie du es lernen kannst' }"),

("en: 'Cards 1–12: from the Rider to the Birds' }",
 "en: 'Cards 1–12: from the Rider to the Birds', de: 'Karten 1–12: vom Reiter bis zu den Vögeln' }"),

("en: 'Each card is a thing, a noun. Learn the name, the tone (positive, neutral, negative) and one keyword. Do not try to memorise every meaning; meaning comes when you pair cards.' }",
 "en: 'Each card is a thing, a noun. Learn the name, the tone (positive, neutral, negative) and one keyword. Do not try to memorise every meaning; meaning comes when you pair cards.', de: 'Jede Lenormandkarte zeigt zunächst etwas Konkretes, fast wie ein Substantiv. Lern Name, Grundton — positiv, neutral oder herausfordernd — und ein Kernwort. Du musst nicht jede Einzelbedeutung auswendig lernen; die eigentliche Aussage entsteht beim Verbinden der Karten.' }"),

("en: 'Cards 13–24: from the Child to the Heart' }",
 "en: 'Cards 13–24: from the Child to the Heart', de: 'Karten 13–24: vom Kind bis zum Herzen' }"),

("en: 'This group holds many people cards and cards about what happens between people: the Child, Fox, Bear, Mice, Heart.' }",
 "en: 'This group holds many people cards and cards about what happens between people: the Child, Fox, Bear, Mice, Heart.', de: 'In dieser Gruppe liegen viele Karten, die Menschen oder Beziehungen zwischen Menschen beschreiben: etwa Kind, Fuchs, Bär, Mäuse und Herz.' }"),

("en: 'Cards 25–36: from the Ring to the Cross' }",
 "en: 'Cards 25–36: from the Ring to the Cross', de: 'Karten 25–36: vom Ring bis zum Kreuz' }"),

("en: 'The last group has the two significators (Man, Woman), the timing cards and the endings: Moon, Key, Anchor, Cross.' }",
 "en: 'The last group has the two significators (Man, Woman), the timing cards and the endings: Moon, Key, Anchor, Cross.', de: 'Die letzte Gruppe enthält unter anderem die traditionellen Personenkarten Mann und Frau sowie Karten für Bindung, Entwicklung, Stabilität und Abschluss — etwa Mond, Schlüssel, Anker und Kreuz.' }"),

("en: 'Pairs: reading two and three cards' }",
 "en: 'Pairs: reading two and three cards', de: 'Karten verbinden: zwei und drei Karten lesen' }"),

("en: 'This is the core skill of Lenormand. The first card is the subject, the second describes it. Below are common pairs, taken from the card pages.' }",
 "en: 'This is the core skill of Lenormand. The first card is the subject, the second describes it. Below are common pairs, taken from the card pages.', de: 'Das ist die Kerntechnik im Lenormand. Die erste Karte setzt das Thema, die zweite verändert oder beschreibt es. Bei drei Karten entsteht bereits ein kleiner Satz. Unten findest du häufige Kombinationen aus den einzelnen Kartenseiten.' }"),

("en: 'Spreads: from three cards to the Grand Tableau' }",
 "en: 'Spreads: from three cards to the Grand Tableau', de: 'Lenormand-Legungen: von drei Karten bis zum Grand Tableau' }"),

("en: 'Three cards is the daily exercise. Nine cards (the 3×3 box) is the first full spread. Save the 36-card Grand Tableau for when you read pairs without looking them up.' }",
 "en: 'Three cards is the daily exercise. Nine cards (the 3×3 box) is the first full spread. Save the 36-card Grand Tableau for when you read pairs without looking them up.', de: 'Drei Karten eignen sich gut als tägliche Übung. Die Neunerlegung im 3×3-Feld ist eine erste vollständige Legung. Das Grand Tableau mit 36 Karten lohnt sich, wenn du Kartenpaare schon sicher lesen kannst, ohne ständig nachzuschlagen.' }"),

# ---- 30.5 renderer labels ----
("  const stages = [[lang === 'vi' ? 'Chặng một · bước ra thế giới' : 'Part one · into the world', 0, 7], [lang === 'vi' ? 'Chặng hai · quay vào bên trong' : 'Part two · turning inward', 8, 14], [lang === 'vi' ? 'Chặng ba · bóng tối và ánh sáng' : 'Part three · darkness and light', 15, 21]];",
 "  const stageT = (vi, en, de) => lang === 'vi' ? vi : (lang === 'de' ? de : en);\n  const stages = [[stageT('Chặng một · bước ra thế giới', 'Part one · into the world', 'Teil eins · hinaus in die Welt'), 0, 7], [stageT('Chặng hai · quay vào bên trong', 'Part two · turning inward', 'Teil zwei · nach innen'), 8, 14], [stageT('Chặng ba · bóng tối và ánh sáng', 'Part three · darkness and light', 'Teil drei · Dunkelheit und Licht'), 15, 21]];"),

("esc(lang === 'vi' ? '56 lá Ẩn Phụ · bốn nguyên tố' : 'The 56 Minor Arcana · four elements')",
 "esc(lang === 'vi' ? '56 lá Ẩn Phụ · bốn nguyên tố' : (lang === 'de' ? '56 Karten der Kleinen Arkana · vier Elemente' : 'The 56 Minor Arcana · four elements'))"),

("'</b><span>' + s.n + (lang === 'vi' ? ' lá' : ' cards') + '</span></a>'",
 "'</b><span>' + s.n + (lang === 'vi' ? ' lá' : (lang === 'de' ? ' Karten' : ' cards')) + '</span></a>'"),

("'</div><b>Grand Tableau</b><span>36 ' + (lang === 'vi' ? 'lá' : 'cards') + '</span></a>'",
 "'</div><b>Grand Tableau</b><span>36 ' + (lang === 'vi' ? 'lá' : (lang === 'de' ? 'Karten' : 'cards')) + '</span></a>'"),
]

for old, new in R:
    c = s.count(old)
    if c != 1:
        sys.stderr.write('COUNT %d for: %s\n' % (c, old[:100]))
        sys.exit(1)
    s = s.replace(old, new)

io.open(p, 'w', encoding='utf-8', newline='').write(s)
print('lessons.js: %d replacements applied' % len(R))
