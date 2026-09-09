# -*- coding: utf-8 -*-
"""astro-kb.js, section 27: German for the planets, houses, aspects and the
moon phases."""
import io, re, sys

p = 'src/astro-kb.js'
s = io.open(p, encoding='utf-8').read()
errors = []

PLANETS_DE = {
 'sun': ('Sonne', 'Ich, Lebenskraft und bewusste Lebensrichtung. Dein Sonnenzeichen ist das Zeichen, das du normalerweise nennst, wenn du nach deinem Sternzeichen gefragt wirst. Die Sonne durchläuft den Tierkreis in einem Jahr und bleibt ungefähr einen Monat in jedem Zeichen.'),
 'moo': ('Mond', 'Gefühle, Gewohnheiten, Sicherheitsbedürfnis sowie Themen rund um Fürsorge und frühe Prägungen. Der Mond wechselt ungefähr alle zweieinhalb Tage das Zeichen, deshalb hilft eine möglichst genaue Geburtszeit bei der Berechnung.'),
 'mer': ('Merkur', 'Denken, Sprechen, Schreiben, Lernen und kurze Wege. Merkur bleibt am Himmel immer relativ nah an der Sonne und steht deshalb im Geburtshoroskop höchstens wenige Zeichen von ihr entfernt.'),
 'ven': ('Venus', 'Liebe, Schönheit, Genuss, Werte und die Art, wie du Zuneigung zeigst und empfängst. Venus wird außerdem mit Geld, Geschmack und dem verbunden, wozu du dich hingezogen fühlst.'),
 'mar': ('Mars', 'Handlung, Antrieb, Begehren, Ärger und die Art, wie du etwas verfolgst oder dich in Konflikten behauptest.'),
 'jup': ('Jupiter', 'Expansion, Zuversicht, Glaubenssysteme, höhere Bildung und weite Reisen. Jupiter bleibt ungefähr ein Jahr in einem Tierkreiszeichen und wird in der Astrologie oft mit Wachstum und Möglichkeiten verbunden.'),
 'sat': ('Saturn', 'Grenzen, Disziplin, Verantwortung, Zeit und langfristige Lektionen. Saturn bleibt ungefähr zweieinhalb Jahre pro Zeichen. Die sogenannte Saturn-Rückkehr um das 29. Lebensjahr wird astrologisch häufig als Übergang in eine reifere Lebensphase gedeutet.'),
 'ura': ('Uranus', 'Umbruch, Unabhängigkeit, Erfindung, Technik und überraschende Veränderungen. Uranus bleibt ungefähr sieben Jahre in einem Zeichen; seine Zeichenstellung wird deshalb eher als Generationsthema als als rein persönliche Eigenschaft gelesen.'),
 'nep': ('Neptun', 'Träume, Spiritualität, Kunst, Idealismus, Illusion und das Auflösen von Grenzen. Neptun bleibt ungefähr vierzehn Jahre in einem Zeichen und wird deshalb ebenfalls stark generationenbezogen gelesen.'),
 'plu': ('Pluto', 'Transformation, Macht, verborgene Themen, Krise und Erneuerung. Pluto bewegt sich sehr langsam und bleibt je nach Abschnitt seiner Bahn etwa zwölf bis mehr als dreißig Jahre in einem Zeichen.'),
}

HOUSES_DE = [
 ('Selbst', 'Erscheinung, erster Eindruck und die Art, wie du in die Welt trittst. Der Aszendent beginnt hier.'),
 ('Geld und Werte', 'Einkommen, Besitz, persönliche Werte und Selbstwert.'),
 ('Kommunikation', 'Sprechen, Schreiben, Lernen, Geschwister, Nachbarschaft und kurze Wege.'),
 ('Zuhause und Wurzeln', 'Familie, Zuhause, Herkunft, frühe Prägungen und privates Leben.'),
 ('Freude und Kreativität', 'Romantik, Kinder, Kunst, Spiel, Selbstausdruck und Vergnügen.'),
 ('Alltag, Arbeit und Gesundheit', 'Routinen, tägliche Arbeit, Kolleginnen und Kollegen, Gewohnheiten und der Umgang mit dem Körper.'),
 ('Partnerschaft', 'Ehe, enge Partnerschaften, geschäftliche Verbindungen und offene Gegenspieler; wie du dich in Beziehungen auf Augenhöhe verhältst.'),
 ('Teilen und Transformation', 'Gemeinsame Finanzen, Erbschaften, Schulden, Intimität, Krisen und tiefgreifende Veränderung.'),
 ('Weite Horizonte', 'Hochschulbildung, Philosophie, Religion, Ausland, lange Reisen und Publizieren.'),
 ('Beruf und Öffentlichkeit', 'Karriere, Ruf, Status, öffentliche Ziele sowie Autoritäts- oder Mentorfiguren.'),
 ('Freunde und Gemeinschaft', 'Gruppen, Netzwerke, langfristige Hoffnungen und gesellschaftliche Anliegen.'),
 ('Innere Welt', 'Unbewusstes, Rückzug, Geheimnisse, Spiritualität und Themen, die du vor dir selbst schwer erkennst.'),
]

ASPECTS_DE = [
 ('Konjunktion', 'Zwei Planeten stehen sehr nah beieinander. Ihre Energien verbinden und verstärken sich; das ist nicht automatisch gut oder schlecht.'),
 ('Opposition', 'Zwei Planeten stehen sich gegenüber. Das kann sich wie ein Zug in zwei Richtungen anfühlen; astrologisch liegt die Aufgabe häufig im Ausgleich, oft über Beziehungen oder Gegenüber.'),
 ('Trigon', 'Ein harmonischer Winkel, häufig zwischen Zeichen desselben Elements. Er wird mit natürlichem Fluss und vorhandenen Talenten verbunden — manchmal so selbstverständlich, dass man sie übersieht.'),
 ('Quadrat', 'Spannung und Reibung. Der Winkel kann unbequem wirken, wird astrologisch aber auch mit starkem Entwicklungsdruck und Motivation verbunden.'),
 ('Sextil', 'Eine unterstützende Gelegenheit. Die Verbindung gilt als relativ leicht, entfaltet sich aber meist stärker, wenn du selbst aktiv damit arbeitest.'),
]

MOON_NAMES_DE = ['Neumond', 'Zunehmende Sichel', 'Erstes Viertel', 'Zunehmender Mond',
                 'Vollmond', 'Abnehmender Mond', 'Letztes Viertel', 'Abnehmende Sichel']

MOON_TEXT_DE = [
 'Der Mond steht zwischen Erde und Sonne, sodass von seiner beleuchteten Seite fast nichts zu sehen ist. Symbolisch beginnt hier ein neuer Zyklus — ein guter Moment, um eine neue Absicht zu setzen und aufzuschreiben, was du beginnen möchtest.',
 'Nach der Dunkelheit erscheint wieder eine schmale Lichtkante. Deine Absicht bekommt erste konkrete Form; jetzt passt ein kleiner erster Schritt besser als ein perfekter Plan.',
 'Eine Hälfte ist beleuchtet, die andere dunkel. Diese Phase wird oft mit dem ersten Widerstand verbunden: Du prüfst, ob du deinen Kurs hältst oder etwas an deiner Vorgehensweise änderst.',
 'Mehr als die Hälfte ist beleuchtet und der Mond wächst weiter zum Vollmond. Jetzt geht es um Verfeinern, Verbessern und darum, mit Unfertigem geduldig weiterzuarbeiten.',
 'Der Mond ist vollständig beleuchtet und steht der Sonne gegenüber. Symbolisch wird diese Phase mit Sichtbarkeit und Erkenntnis verbunden: mit dem, was Freude macht, ebenso wie mit dem, was du bisher lieber übersehen hast. Ein guter Moment zum ehrlichen Zurückblicken und für Dankbarkeit.',
 'Nach dem Vollmond nimmt das sichtbare Licht wieder ab. Diese Phase wird gern genutzt, um Gelerntes weiterzugeben und Dinge abzugeben, die du nicht länger tragen möchtest.',
 'Wieder ist nur eine Hälfte beleuchtet, diesmal auf dem Weg zur Dunkelheit. Symbolisch passt diese Phase zum Loslassen einer Gewohnheit, Bindung oder Erwartung, die nicht mehr zu dir passt.',
 'Die letzte schmale Sichel vor dem nächsten Neumond. Jetzt darf es ruhiger werden: ausruhen, mehr schlafen, abschließen und innerlich Platz für den nächsten Zyklus schaffen.',
]


def q(t):
    return "'" + t.replace('\\', '\\\\').replace("'", "\\'") + "'"


# ---- PLANETS: name.de and a German body ----
cnt = [0]


def planet(m):
    pid = m.group(1)
    if pid not in PLANETS_DE:
        errors.append('no German planet %s' % pid); return m.group(0)
    de_name, de_body = PLANETS_DE[pid]
    cnt[0] += 1
    head = m.group(0)
    head = head.replace("name: { vi: '%s', en: '%s' }" % (m.group(2), m.group(3)),
                        "name: { vi: '%s', en: '%s', de: '%s' }" % (m.group(2), m.group(3), de_name), 1)
    tail = m.group(4)
    return head[:len(head) - len(tail)].rstrip()[:-1].rstrip() + ',\n    de: ' + q(de_body) + ' }' + tail


s = re.sub(r"\{ id: '(\w+)', g: '[^']*', name: \{ vi: '([^']*)', en: '([^']*)' \},.*?\n    en: '(?:[^'\\]|\\.)*' \}(,?)",
           planet, s, flags=re.S)
if cnt[0] != 10:
    errors.append('planets rewritten: %d of 10' % cnt[0])

# ---- HOUSES ----
h = [0]


def house(m):
    i = h[0]
    if i >= 12:
        errors.append('too many houses'); return m.group(0)
    h[0] += 1
    return m.group(1) + ", de: [%s, %s] }%s" % (q(HOUSES_DE[i][0]), q(HOUSES_DE[i][1]), m.group(2))


s = re.sub(r"^(  \{ n: \d+, vi: \[.*?\], en: \[.*?\]) \}(,?)$", house, s, flags=re.M)
if h[0] != 12:
    errors.append('houses rewritten: %d of 12' % h[0])

# ---- ASPECTS ----
a = [0]


def aspect(m):
    i = a[0]
    if i >= 5:
        errors.append('too many aspects'); return m.group(0)
    a[0] += 1
    body = m.group(1).replace("name: { vi: '%s', en: '%s' }" % (m.group(2), m.group(3)),
                              "name: { vi: '%s', en: '%s', de: '%s' }" % (m.group(2), m.group(3), ASPECTS_DE[i][0]), 1)
    return body + ', de: ' + q(ASPECTS_DE[i][1]) + ' }' + m.group(4)


s = re.sub(r"^(  \{ g: '[^']*', deg: '[^']*', name: \{ vi: '([^']*)', en: '([^']*)' \}, vi: '(?:[^'\\]|\\.)*', en: '(?:[^'\\]|\\.)*') \}(,?)$",
           aspect, s, flags=re.M)
if a[0] != 5:
    errors.append('aspects rewritten: %d of 5' % a[0])

# ---- MOON_NAMES / MOON_TEXT ----
mm = re.search(r"^(const MOON_NAMES = \{.*?en: \[.*?\])\n\};$", s, re.S | re.M)
if not mm:
    errors.append('MOON_NAMES not found')
else:
    s = s[:mm.start()] + mm.group(1) + ',\n  de: [' + ', '.join(q(x) for x in MOON_NAMES_DE) + ']\n};' + s[mm.end():]

mm = re.search(r"^(const MOON_TEXT = \{.*?\n  \])\n\};$", s, re.S | re.M)
if not mm:
    errors.append('MOON_TEXT not found')
else:
    s = s[:mm.start()] + mm.group(1) + ',\n  de: [\n    ' + ',\n    '.join(q(x) for x in MOON_TEXT_DE) + '\n  ]\n};' + s[mm.end():]

io.open(p, 'w', encoding='utf-8', newline='').write(s)
if errors:
    sys.stderr.write('\n'.join(errors) + '\n'); sys.exit(1)
print('astro-kb.js: 10 planets, 12 houses, 5 aspects, 8 moon names + texts')
