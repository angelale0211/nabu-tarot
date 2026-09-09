# -*- coding: utf-8 -*-
"""fortune.js: section 9 (VI/EN wording + safety) and section 28 (German pack)."""
import io, re, sys

p = 'src/fortune.js'
s = io.open(p, encoding='utf-8').read()
errors = []


def sub1(old, new):
    global s
    if s.count(old) != 1:
        errors.append('COUNT %d :: %s' % (s.count(old), old[:100]))
        return
    s = s.replace(old, new)


def add_de_to_line(prefix, de_src):
    """Append `, de: <de_src>` to the entry whose line starts with `prefix`."""
    global s
    lines = s.split('\n')
    hits = [i for i, l in enumerate(lines) if l.startswith(prefix)]
    if len(hits) != 1:
        errors.append('LINE %d :: %s' % (len(hits), prefix[:70]))
        return
    i = hits[0]
    j = lines[i].rfind('] }')
    if j < 0:
        errors.append('no "] }" on line for %s' % prefix[:70]); return
    lines[i] = lines[i][:j + 1] + ', de: ' + de_src + lines[i][j + 1:]
    s = '\n'.join(lines)


# ============================ 9. VI / EN revisions ============================
sub1("vi: ['Bói bài Tây', '52 lá, nghĩa truyền thống + tarot'], en: ['Playing cards', '52 cards, traditional meanings + tarot'] }",
     "vi: ['Bói bài Tây', '52 lá · nghĩa truyền thống & đối chiếu Tarot'], en: ['Playing cards', '52 cards · traditional meanings & Tarot comparison'], de: ['Spielkarten deuten', '52 Karten · traditionelle Deutung & Tarot-Vergleich'] }")

# animal keywords (Dragon / Goat / Dog)
sub1("['tự tin', 'may mắn', 'kiêu', 'Rồng nổi bật", "['tự tin', 'may mắn', 'tự tôn', 'Rồng nổi bật")
sub1("['hiền', 'sáng tạo', 'hay lo', 'Dê dịu dàng", "['hiền', 'sáng tạo', 'nhạy cảm', 'Dê dịu dàng")
sub1("['trung thành', 'công bằng', 'hay lo', 'Chó tận tuỵ", "['trung thành', 'công bằng', 'cẩn trọng', 'Chó tận tuỵ")
sub1("['gentle', 'creative', 'worried', 'The Goat", "['gentle', 'creative', 'sensitive', 'The Goat")
sub1("['loyal', 'fair', 'anxious', 'The Dog", "['loyal', 'fair', 'cautious', 'The Dog")

# palm: life line, first two bullets
sub1("'Rõ và sâu: nhiều sức sống, hồi phục nhanh.', 'Mờ hoặc mảnh: dễ mệt, cần chăm cơ thể.'",
     "'Rõ và sâu: theo cách xem truyền thống, thường gắn với sức sống và sức bền tốt.', 'Mờ hoặc mảnh: theo cách xem truyền thống, thường gắn với nhịp năng lượng nhẹ hơn.'")
sub1("'Clear and deep: strong vitality, quick recovery.', 'Faint or thin: tires easily, should care for the body.'",
     "'Clear and deep: in traditional palmistry, often associated with vitality and stamina.', 'Faint or thin: in traditional palmistry, often associated with a gentler energy level.'")

# palm: mercury line, bullets two and three
sub1("'Gợn sóng hoặc đứt: cơ thể hay báo động khi căng thẳng, cần nghỉ đủ.', 'Không có: theo cách xem truyền thống, đây là dấu hiệu tốt về sức khỏe.'",
     "'Gợn sóng hoặc đứt: theo cách xem truyền thống, thường được liên hệ với giai đoạn căng thẳng và thiếu nghỉ ngơi.', 'Không có: trong cách xem truyền thống, điều này thường được xem là dấu hiệu thuận lợi.'")
sub1("'Wavy or broken: the body signals under stress, so rest enough.', 'Absent: in the traditional reading this is a good sign for health.'",
     "'Wavy or broken: in traditional palmistry, often associated with periods of stress and insufficient rest.', 'Absent: in traditional palmistry, this is often regarded as a favourable sign.'")

# tea: the snake
sub1("'coi chừng người xấu', 'beware a false friend'",
     "'thận trọng với một người hoặc tình huống thiếu rõ ràng', 'be cautious with a person or situation that is not fully clear'")

# ============================ 28. FT / FT_CARDS ==============================
add_de_to_line("  numbers: { ic: '🔢'", "['Numerologie', 'Deine Zahlen aus Geburtsdatum und Name']")
add_de_to_line("  palm: { ic: '🖐️'", "['Handlesendeutung', 'Handkarte — tipp auf jede Linie']")
add_de_to_line("  tea: { ic: '🍵'", "['Teeblätter lesen', 'Tassenkarte und typische Formen']")
add_de_to_line("  animals: { ic: '🐉'", "['12 Tierkreis-Tiere', 'Tierkreisrad, harmonische Gruppen und Spannungen']")

# ============================ 28. NUM_KW =====================================
sub1("  en: { 1: 'lead', 2: 'connect', 3: 'express', 4: 'build', 5: 'freedom', 6: 'care', 7: 'seek', 8: 'master', 9: 'give', 11: 'inspire', 22: 'build big', 33: 'heal' }",
     "  en: { 1: 'lead', 2: 'connect', 3: 'express', 4: 'build', 5: 'freedom', 6: 'care', 7: 'seek', 8: 'master', 9: 'give', 11: 'inspire', 22: 'build big', 33: 'heal' },\n  de: { 1: 'führen', 2: 'verbinden', 3: 'ausdrücken', 4: 'aufbauen', 5: 'Freiheit', 6: 'fürsorgen', 7: 'erforschen', 8: 'meistern', 9: 'geben', 11: 'inspirieren', 22: 'Großes aufbauen', 33: 'heilen' }")

# ============================ 28. ANIMAL_INFO ================================
ANIMAL_DE = [
 ("schnell", "einfallsreich", "sparsam", "Die Ratte gilt als schnell, clever und anpassungsfähig. Traditionell passt sie zu Aufgaben, die Köpfchen und gute Kontakte verlangen."),
 ("beständig", "ehrlich", "langsam, aber sicher", "Der Büffel gilt als fleißig, verlässlich und ausdauernd. Traditionell passt er zu Arbeit, die Geduld braucht."),
 ("mutig", "feurig", "führungsstark", "Der Tiger gilt als kraftvoll, mutig und manchmal impulsiv. Traditionell passt er zu Situationen, in denen Entschlossenheit gefragt ist."),
 ("sanft", "taktvoll", "vorsichtig", "Die Katze gilt in der vietnamesischen Tierkreis-Tradition als feinfühlig, höflich und umsichtig. Sie wird mit Geschick und Diplomatie verbunden."),
 ("selbstbewusst", "glücklich", "stolz", "Der Drache gilt als auffällig, energiegeladen und ehrgeizig. Traditionell wird er mit großen Vorhaben und sichtbarer Verantwortung verbunden."),
 ("tiefgründig", "geheimnisvoll", "intuitiv", "Die Schlange gilt als klug, zurückhaltend und überlegt. Traditionell wird sie mit Tiefe und sorgfältigem Denken verbunden."),
 ("freiheitsliebend", "schnell", "begeisterungsfähig", "Das Pferd liebt Bewegung und Freiheit. Traditionell wird es mit Reisen, Kommunikation und einem aktiven Leben verbunden."),
 ("sanft", "kreativ", "sensibel", "Die Ziege gilt als feinfühlig, kreativ und friedliebend. Traditionell passt sie zu künstlerischen oder fürsorglichen Tätigkeiten."),
 ("clever", "fröhlich", "verspielt", "Der Affe werden Einfallsreichtum, Humor und schnelle Reaktionen zugeschrieben. Sie passt symbolisch zu Aufgaben, die Improvisation verlangen."),
 ("fleißig", "direkt", "genau", "Der Hahn gilt als arbeitsam, klar und detailorientiert. Traditionell wird er mit Aufgaben verbunden, bei denen Genauigkeit wichtig ist."),
 ("loyal", "fair", "vorsichtig", "Der Hund gilt als treu, ehrlich und beschützend. Traditionell wird er mit Verantwortung und Dienst an anderen verbunden."),
 ("großzügig", "freundlich", "vertrauensvoll", "Das Schwein gilt als sanft, großzügig und lebensfroh. Traditionell wird es mit Fürsorge, Genuss und Gastfreundschaft verbunden."),
]
de_rows = ', '.join("['%s', '%s', '%s', '%s']" % a for a in ANIMAL_DE)
lines = s.split('\n')
for i, l in enumerate(lines):
    if l.startswith("  en: [['quick', 'resourceful'"):
        lines[i] = l.rstrip() + '\n  de: [' + de_rows + ']'
        break
else:
    errors.append('ANIMAL_INFO en row not found')
s = '\n'.join(lines)
s = s.replace("""  de: [%s]
};""" % de_rows, """  de: [%s]
};""" % de_rows)
# the en row ended without a comma; make sure the object stays valid
s = s.replace("The Pig is gentle, giving, fond of fun. Suits care and food.']]\n  de: [", "The Pig is gentle, giving, fond of fun. Suits care and food.']],\n  de: [")

# ============================ 28. PALM =======================================
PALM_DE = {
 'heart': "['Herzlinie', 'Die oberste große Linie unter den Fingern. Traditionell wird sie mit Gefühlen, Liebesstil und der Art, Zuneigung anzunehmen, verbunden.', ['Lang und gebogen: wird traditionell mit Offenheit und leichterem Gefühlsausdruck verbunden.', 'Gerade und kurz: wird eher mit Zurückhaltung und einem praktischen Liebesstil verbunden.', 'Endet unter dem Zeigefinger: wird oft als idealistischer Anspruch an Liebe gelesen.', 'Endet unter dem Mittelfinger: wird eher als nüchterner, stärker auf Eigenständigkeit gerichteter Liebesstil gelesen.', 'Kleine Äste nach oben werden traditionell positiv für Beziehungen gelesen; Äste nach unten eher als Hinweis auf vergangene Enttäuschungen.']]",
 'head': "['Kopflinie', 'Die Linie durch die Mitte der Handfläche. Traditionell wird sie mit Denken, Lernen und Entscheidungsstil verbunden.', ['Lang: wird mit gründlichem Denken und Analyse verbunden.', 'Kurz: wird mit schnellen, praktischen Entscheidungen verbunden.', 'Zum Mondberg hin gebogen: wird mit Vorstellungskraft und Kreativität verbunden.', 'Gerade: wird eher mit Logik und strukturiertem Denken verbunden.', 'Am Anfang von der Lebenslinie getrennt: wird mit früher Eigenständigkeit verbunden; ein längerer gemeinsamer Abschnitt eher mit Vorsicht und enger Familienbindung.']]",
 'life': "['Lebenslinie', 'Die Linie, die sich um den Daumenballen zieht. In der Handlesekunst steht sie für Vitalität, Belastbarkeit und große Veränderungen — nicht für die Lebensdauer.', ['Klar und tief: in der traditionellen Handlesekunst oft mit Vitalität und Ausdauer verbunden.', 'Blass oder fein: in der traditionellen Handlesekunst oft mit einem ruhigeren Energieniveau verbunden.', 'Ein weiter Bogen um den Venusberg wird oft mit Offenheit und viel Lebensenergie verbunden.', 'Nah am Daumen verlaufend: wird eher mit Zurückhaltung und sparsamem Umgang mit Energie verbunden.', 'Unterbrechung oder Gabelung: wird traditionell als Wendepunkt gelesen, etwa Umzug oder beruflicher Wechsel.']]",
 'fate': "['Schicksalslinie', 'Eine senkrechte Linie durch die Mitte der Hand in Richtung Mittelfinger. Nicht jeder Mensch hat sie deutlich. Traditionell wird sie mit Berufsweg, Richtung und Sinn verbunden.', ['Klar von unten nach oben: wird mit früher Orientierung und einem beständigeren Berufsweg verbunden.', 'Beginnt erst in der Handmitte: wird oft als später gefundene Richtung gedeutet.', 'Beginnt an der Lebenslinie: wird traditionell mit selbst aufgebautem Weg verbunden.', 'Beginnt am Mondberg: kann symbolisch für Unterstützung durch andere oder öffentlich ausgerichtete Arbeit stehen.', 'Unterbrochen und danach fortgesetzt: wird häufig als Wechsel von Berufsfeld oder Richtung gelesen.']]",
 'sun': "['Sonnenlinie', 'Eine senkrechte Linie in Richtung Ringfinger. Traditionell wird sie mit Kreativität, Anerkennung und Zufriedenheit im eigenen Wirken verbunden.', ['Klar und lang: wird mit sichtbarem Talent und Anerkennung verbunden.', 'Kurz und nur im oberen Bereich: wird oft als später, aber stabiler Erfolg gelesen.', 'Mehrere kleine Linien: können für viele Interessen und eine schwerere Schwerpunktwahl stehen.', 'Nicht vorhanden: wird nicht negativ gelesen; Zufriedenheit muss nicht von äußerer Aufmerksamkeit abhängen.']]",
 'mercury': "['Merkurlinie', 'Eine diagonale Linie vom unteren Handbereich zum kleinen Finger. Je nach Schule wird sie mit Kommunikation, Geschäft und Gesundheitsthemen verbunden.', ['Klar und gerade: wird traditionell mit klarer Kommunikation und Geschäftssinn verbunden.', 'Wellig oder unterbrochen: in der traditionellen Handlesekunst oft mit Stressphasen und zu wenig Erholung verbunden.', 'Nicht vorhanden: In der traditionellen Handlesekunst gilt das häufig als günstiges Zeichen.']]",
 'marriage': "['Beziehungslinien', 'Kurze waagerechte Linien an der Handkante unter dem kleinen Finger. Traditionell werden sie mit tiefen Bindungen verbunden.', ['Eine klare, längere Linie: wird oft als eine besonders bedeutende, länger anhaltende Bindung gelesen.', 'Zwei oder drei Linien: können für mehrere wichtige Beziehungen im Leben stehen — nicht zwingend für Ehen.', 'Nach unten gebogen: wird traditionell als Beziehung gelesen, die besondere Aufmerksamkeit braucht.', 'Am Ende gegabelt: kann als Phase von Distanz, Trennung oder späterer Annäherung gedeutet werden.']]",
}
for k, v in PALM_DE.items():
    add_de_to_line('  %s: { d:' % k, v)

# ============================ 28. MOUNTS =====================================
MOUNTS_DE = {
 'jupiter': "['Jupiterberg', 'Unter dem Zeigefinger. Traditionell mit Ehrgeiz, Selbstvertrauen und Führung verbunden.', ['Gut ausgeprägt: wird mit Selbstvertrauen und Führungsbereitschaft verbunden.', 'Flach: wird eher mit Bescheidenheit oder Zurückhaltung verbunden.', 'Sehr stark ausgeprägt: kann symbolisch auf Stolz oder Dominanz hinweisen.']]",
 'saturn': "['Saturnberg', 'Unter dem Mittelfinger. Traditionell mit Disziplin, Verantwortung und Ernsthaftigkeit verbunden.', ['Mäßig ausgeprägt: wird mit Reife und Verlässlichkeit verbunden.', 'Flach: wird eher mit Leichtigkeit und Ungezwungenheit verbunden.', 'Sehr stark ausgeprägt: kann auf übermäßige Sorge, Schwere oder Rückzug hinweisen.']]",
 'apollo': "['Apolloberg', 'Unter dem Ringfinger. Traditionell mit Kreativität, Geschmack und Ausstrahlung verbunden.', ['Gut ausgeprägt: wird mit Sinn für Schönheit und Freude an Ausdruck verbunden.', 'Flach: wird eher mit Pragmatismus und geringerem Interesse an Außenwirkung verbunden.', 'Sehr stark ausgeprägt: kann auf ein starkes Bedürfnis nach Glanz oder Anerkennung hinweisen.']]",
 'mercury': "['Merkurberg', 'Unter dem kleinen Finger. Traditionell mit Kommunikation, schneller Auffassung und Handel verbunden.', ['Gut ausgeprägt: wird mit Sprachgewandtheit, schnellem Lernen und Geschäftssinn verbunden.', 'Flach: wird eher mit ruhigem, handlungsorientiertem Stil verbunden.', 'Sehr stark ausgeprägt: kann symbolisch für Übertreibung oder zu taktisches Verhalten stehen.']]",
 'venus': "['Venusberg', 'Der Daumenballen innerhalb der Lebenslinie. Traditionell mit Zuneigung, Vitalität und Wärme verbunden.', ['Gut ausgeprägt: wird mit Herzlichkeit, Genuss und Lebensfreude verbunden.', 'Flach: wird eher mit Ruhe und zurückhaltendem Ausdruck verbunden.', 'Sehr stark ausgeprägt: kann auf starke Leidenschaften und emotionale Impulsivität hinweisen.']]",
 'luna': "['Mondberg', 'Der äußere untere Bereich der Handfläche. Traditionell mit Vorstellungskraft, Intuition und Tagträumen verbunden.', ['Gut ausgeprägt: wird mit Fantasie, Sensibilität und Reiselust verbunden.', 'Flach: wird eher mit Pragmatismus und wenig Tagträumerei verbunden.', 'Sehr stark ausgeprägt: kann auf übermäßiges Grübeln oder Flucht in Gedanken hinweisen.']]",
 'mars': "['Marsberg', 'Im inneren Bereich zwischen Daumenbasis und Zeigefinger. Traditionell mit Mut und Widerstandskraft verbunden.', ['Gut ausgeprägt: wird mit Mut und Konfliktfähigkeit verbunden.', 'Flach: wird eher mit Konfliktvermeidung und Nachgiebigkeit verbunden.', 'Sehr stark ausgeprägt: kann auf Reizbarkeit oder Streitlust hinweisen.']]",
}
for k, v in MOUNTS_DE.items():
    add_de_to_line('  %s: { x:' % k, v)

# ============================ 28. HAND_SHAPES ================================
SHAPES_DE = [
 ("earth", "['Erdhand', 'Quadratische Handfläche, kurze Finger', 'Traditionell mit Bodenständigkeit, Praxisnähe und Freude an greifbaren Aufgaben verbunden.']"),
 ("air", "['Lufthand', 'Quadratische Handfläche, lange Finger', 'Traditionell mit Denken, Kommunikation und Neugier verbunden. Braucht geistige Anregung und Austausch.']"),
 ("fire", "['Feuerhand', 'Lange Handfläche, kurze Finger', 'Traditionell mit Begeisterung, Tempo und Führungsdrang verbunden. Langsamer Stillstand kann schnell langweilen.']"),
 ("water", "['Wasserhand', 'Lange Handfläche, lange Finger', 'Traditionell mit Sensibilität, Intuition und einem starken Gefühlsleben verbunden. Braucht Rückzug und ruhigen Raum.']"),
]
for el, v in SHAPES_DE:
    add_de_to_line("  { el: '%s'" % el, v)

# ============================ 28. TEA ========================================
TEA_DE = [
 ('Vogel', 'Nachrichten sind unterwegs'), ('Herz', 'Liebe, ein Herzensmensch'),
 ('Ring', 'Bindung, Versprechen oder Ehe'), ('Schlüssel', 'eine Tür öffnet sich, eine Lösung'),
 ('Gerade Linie', 'Reise oder klarer Plan'), ('Baum', 'langsames, stetiges Wachstum'),
 ('Wolke', 'Unklarheit, etwas ist noch nicht deutlich'), ('Buchstabe', 'ein Name oder Initial'),
 ('Zahl', 'Tage, Monate oder eine Menge'), ('Stern', 'Hoffnung und günstige Entwicklung'),
 ('Mond', 'Veränderung und Gefühlsthemen'), ('Schlange', 'Vorsicht bei einer Person oder Situation, die nicht ganz klar ist'),
 ('Fisch', 'gute Nachricht oder Geldbewegung'), ('Haus', 'Sicherheit, Zuhause und Familie'),
 ('Anker', 'Stabilität und beständige Arbeit'), ('Tür', 'etwas Neues beginnt sich zu öffnen'),
]
m = re.search(r'^const TEA = \[(.*)\];$', s, re.M)
if not m:
    errors.append('TEA not found')
else:
    items = re.findall(r"\[('(?:[^'\\]|\\.)*'(?:, *'(?:[^'\\]|\\.)*'){4})\]", m.group(1))
    if len(items) != 16:
        errors.append('TEA parsed %d items' % len(items))
    else:
        rebuilt = ', '.join("[%s, '%s', '%s']" % (items[i], TEA_DE[i][0], TEA_DE[i][1]) for i in range(16))
        s = s[:m.start()] + 'const TEA = [' + rebuilt + '];' + s[m.end():]

# TEA lookups become three-way
s = s.replace("esc(lang === 'vi' ? t[1] : t[2])", "esc(lang === 'vi' ? t[1] : (lang === 'de' ? t[5] : t[2]))")
s = s.replace("esc(lang === 'vi' ? t[3] : t[4])", "esc(lang === 'vi' ? t[3] : (lang === 'de' ? t[6] : t[4]))")
s = s.replace("esc((lang === 'vi' ? t[3] : t[4]) + ' · '", "esc((lang === 'vi' ? t[3] : (lang === 'de' ? t[6] : t[4])) + ' · '")

io.open(p, 'w', encoding='utf-8', newline='').write(s)
if errors:
    sys.stderr.write('\n'.join(errors) + '\n')
    sys.exit(1)
print('fortune.js: stage 1 (sections 9 + 28 except PC_TRAD) applied')
