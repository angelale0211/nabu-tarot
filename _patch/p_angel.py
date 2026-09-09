# -*- coding: utf-8 -*-
"""angel.js, section 25: the complete German column for all twelve groups."""
import io, re, sys

p = 'src/angel.js'
s = io.open(p, encoding='utf-8').read()
errors = []

DE = {
 'n0': {
  'name': 'Wiederkehrende Nullen', 'short': 'Ein Kreis öffnet sich',
  'keys': ['Anfang', 'Rückkehr', 'Loslassen'],
  'body': [
   'Die Null hat weder Anfang noch Ende. Wenn dir 000 oder 0000 immer wieder begegnet, wird das oft als Zwischenraum zwischen zwei Kapiteln gedeutet: Das alte ist abgeschlossen, das neue noch nicht ganz geöffnet. Das Gefühl von Leere dazwischen ist normal und bedeutet nicht, dass du falsch abgebogen bist.',
   'Oft passt diese Zahl zu einer Phase, in der alte Gewohnheiten nicht mehr richtig sitzen. Vielleicht verlierst du das Interesse an etwas, dem du lange hinterhergelaufen bist, oder brauchst eine Pause, bevor du dich entscheidest. Die Null erinnert daran, dass auch eine Pause Teil des Weges sein kann.',
   'In vielen Zahlensymboliken steht die Null außerdem für Ganzheit: Es fehlt nicht unbedingt etwas — vielleicht schaust du nur aus einer anderen Perspektive darauf. Wenn sie auftaucht, geh zurück zu deinen eigenen Grundlagen.'],
  'todo': 'Räum diese Woche eine alte Sache auf: einen Gegenstand, eine Gewohnheit oder ein Gespräch, das nie richtig beendet wurde.'},
 'n1': {
  'name': 'Wiederkehrende Einsen', 'short': 'Eine Tür steht offen',
  'keys': ['Anfang', 'Gedanken werden konkret', 'den ersten Schritt machen'],
  'body': [
   '111 und 1111 gehören zu den bekanntesten Engelszahlen. Sie werden oft wie eine offene Tür gelesen: Was dir in diesem Moment durch den Kopf geht, bekommt besondere Aufmerksamkeit — daher kommt auch die Gewohnheit, sich um 11:11 etwas zu wünschen.',
   'Praktischer betrachtet steht die Eins für Anfang und Eigeninitiative. Wenn du etwas Neues abwägst, kann diese Zahlenfolge eine schöne Erinnerung sein, dass irgendwann nicht noch mehr Denken, sondern ein erster Schritt nötig ist.',
   'Sie lenkt den Blick auch auf deine innere Stimme. Die Art, wie du jetzt mit dir selbst sprichst, beeinflusst, wie du in den nächsten Wochen und Monaten handelst. Wähl deine Worte deshalb freundlich.'],
  'todo': 'Schreib in einem Satz im Präsens auf, was du möchtest, und tu danach die kleinste Sache, mit der es beginnen kann.'},
 'n2': {
  'name': 'Wiederkehrende Zweien', 'short': 'Gib ihm Zeit',
  'keys': ['Balance', 'Partnerschaft', 'Timing'],
  'body': [
   'Die Zwei handelt von zwei Seiten: dir und einem anderen Menschen, Arbeit und Privatleben, Wunsch und Wirklichkeit. Wenn 222 immer wieder auftaucht, wird sie oft als Hinweis gelesen, irgendwo wieder mehr Gleichgewicht herzustellen.',
   'Sie ist außerdem eine Zahl der Geduld. Was du gesät hast, ist vielleicht noch nicht sichtbar. Die Zwei erinnert daran, nicht ständig nachzugraben, ob schon etwas wächst. Manches braucht eher mehr Zeit als mehr Druck.',
   'In Liebe und Zusammenarbeit wird 222 traditionell häufig positiv gelesen: als Bild für eine Verbindung, die sich entwickeln darf, oder für Unterstützung, die zu dem hinzukommt, was du gerade aufbaust.'],
  'todo': 'Schreib der Person, auf deren Antwort du wartest — oder gib der Sache bewusst noch eine Woche Zeit, ohne erneut nachzufragen.'},
 'n3': {
  'name': 'Wiederkehrende Dreien', 'short': 'Sag, was gesagt werden will',
  'keys': ['Kreativität', 'sich ausdrücken', 'Unterstützung'],
  'body': [
   'Die Drei steht für Ausdruck: schreiben, zeichnen, singen oder einfach etwas aussprechen, das du schon zu lange zurückhältst. Wenn 333 auftaucht, kann sie dich daran erinnern, einer Idee oder einem Gefühl endlich eine Form zu geben.',
   'Sie wird auch mit Unterstützung verbunden. Vielleicht hilft dir eine Lehrperson, ein alter Freund oder jemand Unerwartetes dabei, etwas wieder aufzunehmen, das liegen geblieben ist.',
   'Wenn du kreativ arbeitest, kann 333 eine Einladung sein, kurz zu dem Teil zurückzukehren, den du wirklich liebst — nicht nur zu dem, der sich am leichtesten messen oder verkaufen lässt.'],
  'todo': 'Schick eine Nachricht oder teile eine Arbeit, die schon länger als Entwurf auf dich wartet.'},
 'n4': {
  'name': 'Wiederkehrende Vieren', 'short': 'Du hast Halt',
  'keys': ['Fundament', 'Schutz', 'Beständigkeit'],
  'body': [
   '444 ist die ruhige, stabile Zahlenfolge. Sie wird oft als Bild dafür gelesen, dass du auch durch eine schwierige Phase getragen wirst und dein Fundament fester ist, als es sich gerade anfühlt.',
   'Die Vier steht für Grundlagen: Gesundheit, Rücklagen, Zuhause und Beziehungen, die sich über Zeit bewährt haben. Sie eignet sich deshalb gut als Erinnerung, erst die Basis zu prüfen, bevor du dem nächsten neuen Ziel hinterherläufst.',
   'Wenn dich eine bestimmte Sache beschäftigt, kann 444 wie ein beruhigender Hinweis wirken: Nicht alles muss sofort sichtbar werden. Beständigkeit ist manchmal wichtiger als Geschwindigkeit.'],
  'todo': 'Prüf heute eine Sache an deiner Basis: wichtige Unterlagen, einen Gesundheitstermin oder eine regelmäßige Zahlung.'},
 'n5': {
  'name': 'Wiederkehrende Fünfen', 'short': 'Veränderung kommt in Bewegung',
  'keys': ['Veränderung', 'Freiheit', 'lockerlassen'],
  'body': [
   '555 wird traditionell mit Veränderung verbunden — bei Arbeit, Wohnort, Gewohnheiten oder der Sicht auf eine Beziehung. Oft hat diese Veränderung schon begonnen, bevor du sie bewusst benennst.',
   'Wenn die Folge auftaucht, kann sie dich daran erinnern, sehr starre Pläne etwas lockerer zu halten. Übergangsphasen verlaufen selten exakt nach Zeitplan, und manche guten Möglichkeiten kommen aus einer Richtung, die du nicht eingeplant hattest.',
   'Wenn Veränderung dir Angst macht, verspricht die Fünf nicht, dass alles leicht wird. Sie kann vielmehr zeigen, dass Stillstand inzwischen ebenfalls unbequem geworden ist.'],
  'todo': 'Verändere diese Woche eine kleine Gewohnheit: nimm einen anderen Weg oder beginne etwas eine halbe Stunde früher.'},
 'n6': {
  'name': 'Wiederkehrende Sechsen', 'short': 'Zuhause und Materielles neu ausbalancieren',
  'keys': ['Familie', 'Fürsorge', 'materielle Balance'],
  'body': [
   'Anders als viele erwarten, wird 666 hier nicht als böses Omen gelesen. In der Zahlensymbolik kann die Sechs für das Gleichgewicht zwischen materiellen Themen und den anderen Bereichen des Lebens stehen.',
   'Die Sechs wird mit Zuhause, Familie und Fürsorge verbunden. Wenn sie häufig auftaucht, kann das eine Einladung sein zu prüfen, ob du gerade zu viel in eine Richtung gibst: nur arbeiten und Menschen zuhause vergessen — oder dich um alle kümmern und dich selbst dabei übergehen.',
   'Sie kann auch ganz praktisch an Zahlen erinnern: Ausgaben, Schulden oder kleine regelmäßige Beträge, die unbemerkt abfließen. Es geht nicht darum, Materielles abzulehnen, sondern ihm einen passenden Platz zu geben.'],
  'todo': 'Schenk einen Abend den Menschen zuhause — und einen zweiten einem ruhigen Blick auf deine Ausgaben des letzten Monats.'},
 'n7': {
  'name': 'Wiederkehrende Siebenen', 'short': 'Vertrau deinem Weg',
  'keys': ['Glück', 'Intuition', 'Lernen'],
  'body': [
   '777 wird oft mit einer leichteren Phase verbunden — weniger mit Lotterieglück als mit dem Gefühl, dass Dinge nach längerer Unordnung wieder besser zusammenpassen.',
   'Die Sieben steht für Tiefe: lesen, lernen, nachdenken oder einer Frage folgen, deren Faszination du selbst noch nicht ganz erklären kannst. Was du jetzt lernst, kann später nützlicher werden, als es zunächst aussieht.',
   'Sie wird außerdem gern als Erinnerung an die eigene Intuition gelesen. Wenn du bei einer Person oder Gelegenheit ein klares Gefühl hast, schreib es auf, statt es sofort wegzuerklären.'],
  'todo': 'Notiere heute eine Ahnung mit Datum und lies sie in einem Monat noch einmal.'},
 'n8': {
  'name': 'Wiederkehrende Achten', 'short': 'Fülle und Rückfluss',
  'keys': ['Geld', 'Zyklen', 'Geben und Nehmen'],
  'body': [
   'Eine liegende Acht erinnert an das Unendlichkeitszeichen, weshalb 888 oft als Bild für Kreisläufe und Fluss gelesen wird: Was hinausgeht, kann auf andere Weise zurückkommen. In chinesischen und vietnamesischen Zahlentraditionen wird die Acht außerdem häufig mit Wohlstand verbunden.',
   'Wenn sie auftaucht, kann sie symbolisch zu einer Phase passen, in der frühere Mühe erste Ergebnisse zeigt — manchmal aus einer ganz anderen Richtung als der, in die du ursprünglich investiert hast.',
   'Die Acht stellt auch die Frage nach Fairness im Austausch. Wenn du deutlich mehr gibst als zurückbekommst — oder umgekehrt —, kann jetzt ein guter Zeitpunkt sein, das Verhältnis neu auszubalancieren.'],
  'todo': 'Schick die offene Rechnung, frag nach einem Betrag, der dir zusteht, oder begleiche etwas, das du selbst noch schuldest.'},
 'n9': {
  'name': 'Wiederkehrende Neunen', 'short': 'Ein Kapitel schließt sich',
  'keys': ['Abschluss', 'Loslassen', 'Raum schaffen'],
  'body': [
   '999 wird mit Vollendung verbunden. Etwas in deinem Leben kann einen ganzen Zyklus durchlaufen haben: ein Job, eine Beziehung oder eine Lebensweise, die lange zu dir gehört hat.',
   'Ein Ende muss in dieser Lesart nicht nur Verlust bedeuten. Es kann auch heißen, dass ein Abschnitt seine Aufgabe erfüllt hat und weiteres Festhalten mehr Kraft kostet, als es dir gibt.',
   'Die Neun wird außerdem mit Weitergeben verbunden. Nach einem langen Weg besitzt du oft genau die Erfahrung, die jemand hinter dir gebrauchen kann — nicht unbedingt als große Lebensweisheit, sondern als konkrete Hilfe.'],
  'todo': 'Schließ eine Sache ab, die lange offen war, und erzähl jemandem am Anfang des Weges, was du daraus gelernt hast.'},
 'mirror': {
  'name': 'Spiegel- und Paarzahlen', 'short': 'Zwei Hälften finden zusammen',
  'keys': ['Spiegelung', 'Ausrichtung', 'weitergehen'],
  'body': [
   'Spiegelzahlen wiederholen sich in Paaren — etwa 1010, 1212 oder 1313 — oder lesen sich vorwärts und rückwärts ähnlich, wie 1221. Sie werden oft als Symbol für Ausrichtung gelesen: das, was du denkst, und das, was außen geschieht, scheinen sich stärker zu spiegeln.',
   'Innerhalb dieser Gruppe wird 1010 häufig mit einem neuen Zyklus und einem Moment des Erwachens verbunden. 1212 wird oft als Ermutigung gelesen, auf dem gewählten Weg weiterzugehen, auch wenn du noch nicht jede Etappe sehen kannst.',
   'Spiegelzahlen werden in manchen modernen Deutungen auch mit Begegnungen verbunden, die sich sofort vertraut oder leicht anfühlen. Du kannst das als schönes Bild für Menschen sehen, die eine Strecke deines Weges mit dir teilen.'],
  'todo': 'Mach zwei Spalten: Was denke ich gerade — und was passiert tatsächlich? Schau, wo beides zusammenpasst und wo nicht.'},
 'ladder': {
  'name': 'Treppenzahlen', 'short': 'Schritt für Schritt',
  'keys': ['Reihenfolge', 'Fortschritt', 'Dranbleiben'],
  'body': [
   'Aufsteigende Folgen wie 123, 1234 oder 2345 werden als Fortschritt in einer klaren Reihenfolge gelesen. Du musst keinen Schritt überspringen — und meistens hilft es auch nicht.',
   'Solche Folgen fallen oft besonders auf, wenn du an etwas Langfristigem arbeitest und langsam ungeduldig wirst. Sie können dich daran erinnern, dass der bereits zurückgelegte Weg zählt und der nächste sinnvolle Schritt direkt vor dir liegt.',
   '1234 wird manchmal ganz schlicht als Aufforderung zum Vereinfachen gelesen: Lass Nebensachen weg und behalte die wenigen Schritte, die wirklich zum Ziel gehören.'],
  'todo': 'Schreib die nächsten vier Schritte deines Vorhabens auf — und erledige heute nur den ersten.'},
}


def q(t):
    return "'" + t.replace('\\', '\\\\').replace("'", "\\'") + "'"


# split the ANGELS array into per-entry slices
starts = [m.start() for m in re.finditer(r"^    id: '", s, re.M)]
if len(starts) != 12:
    sys.stderr.write('expected 12 angel entries, found %d\n' % len(starts)); sys.exit(1)
starts.append(len(s))

out, done = s[:starts[0]], []
for i in range(12):
    seg = s[starts[i]:starts[i + 1]]
    key = re.match(r"    id: '([a-z0-9]+)'", seg).group(1)
    if key not in DE:
        errors.append('no German for %s' % key); out += seg; continue
    d = DE[key]

    # single-line objects: name, short, keys, todo
    for field, val in (('name', q(d['name'])), ('short', q(d['short'])),
                       ('keys', '[' + ', '.join(q(x) for x in d['keys']) + ']'),
                       ('todo', q(d['todo']))):
        mm = re.search(r'^(    %s: \{.*)\}(,?)$' % field, seg, re.M)
        if not mm:
            errors.append('%s: %s not on one line' % (key, field)); continue
        seg = seg[:mm.start()] + mm.group(1).rstrip() + ', de: ' + val + ' }' + mm.group(2) + seg[mm.end():]

    # body: the en array closes just before the line that ends the body object
    anchor = '\n    },\n    todo:'
    if seg.count(anchor) != 1:
        errors.append('%s: body close not unique' % key)
    else:
        de_body = ',\n      de: [' + ',\n        '.join(q(x) for x in d['body']) + ']'
        seg = seg.replace(anchor, de_body + anchor)
    out += seg
    done.append(key)

s = out
io.open(p, 'w', encoding='utf-8', newline='').write(s)
if errors:
    sys.stderr.write('\n'.join(errors) + '\n'); sys.exit(1)
print('angel.js: German added to %d groups (%s)' % (len(done), ', '.join(done)))
