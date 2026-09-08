/* ============ quiz bank: the tarot course — German ============
   Stage 2 of the German translation.

   The questions themselves live in quiz-tarot.js, one object per question with
   a `vi` and an `en` in each field. Rather than editing forty objects in that
   file, the German is written here as plain rows and folded in afterwards:

       [question, [answer, answer, answer, answer], why]

   Row order matches the English exactly, and the first answer is always the
   correct one — the screen shuffles them, so the order here is only for
   reading. The fold below asserts that shape before it writes anything, so a
   row that has drifted out of step is caught here rather than showing a German
   question with the wrong answers under it. */

const QUIZ_TAROT_DE = {
  1: [
    ['Wie viele Karten hat ein vollständiges Tarotdeck?',
     ['78', '52', '36', '22'],
     '78 Karten: 22 Große Arkana und 56 Kleine Arkana.'],
    ['Aus wie vielen Karten besteht die Große Arkana?',
     ['22', '16', '40', '56'],
     'Die Große Arkana läuft von 0 bis 21, das sind 22 Karten.'],
    ['Welche Zahl trägt der Narr?',
     ['0', '1', '21', '22'],
     'Der Narr ist die 0: Die Reise hat noch nicht begonnen.'],
    ['Die Kleine Arkana hat 56 Karten. Was macht neben den 40 Zahlenkarten den Rest aus?',
     ['16 Hofkarten', '16 weitere Karten der Großen Arkana', '14 Hofkarten', '12 Hofkarten'],
     '40 Zahlenkarten (Ass bis Zehn in vier Farben) und 16 Hofkarten (vier Ränge in vier Farben) ergeben 56.'],
    ['Welche Karten tragen in der Reihenfolge nach Rider–Waite die Zahlen 8 und 11?',
     ['Die Kraft ist 8, Die Gerechtigkeit ist 11', 'Die Gerechtigkeit ist 8, Die Kraft ist 11',
      'Der Eremit ist 8, Das Rad ist 11', 'Der Wagen ist 8, Der Gehängte ist 11'],
     'Waite hat die beiden gegenüber der Marseille-Ordnung getauscht, damit die Kraft zum Löwen passt und die Gerechtigkeit zur Waage. Diese App folgt Waite.']
  ],
  2: [
    ['Welche Karte ist die Nummer 3 der Großen Arkana?',
     ['Die Herrscherin', 'Die Hohepriesterin', 'Der Herrscher', 'Der Hierophant'],
     'Die Herrscherin ist die 3, zwischen der Hohepriesterin (2) und dem Herrscher (4).'],
    ['Welche Zahl haben die Liebenden?',
     ['6', '2', '7', '5'],
     'Die Liebenden sind die 6, direkt vor dem Wagen.'],
    ['Wovon spricht die Hohepriesterin am deutlichsten?',
     ['Von Intuition und dem, was noch nicht gesagt ist', 'Von Macht und Regeln',
      'Von Geld und Arbeit', 'Von einer weiten Reise'],
     'Die Hohepriesterin hält, was noch nicht ausgesprochen ist: Sie weiß es, aber sie antwortet noch nicht.'],
    ['Welcher Planet gehört zum Magier?',
     ['Merkur', 'Der Mond', 'Venus', 'Die Sonne'],
     'Der Magier bekommt Merkur: Sprache, Handwerk und Geschick. Das steht auch im Astrologie-Feld der Karte.'],
    ['Welches Sternzeichen gehört zum Wagen?',
     ['Krebs', 'Widder', 'Löwe', 'Schütze'],
     'Der Wagen ist der Krebs: eine harte Schale um etwas Weiches, und genau das ist ein Wagen.']
  ],
  3: [
    ['Welche Zahl hat der Eremit?',
     ['9', '8', '10', '12'],
     'Der Eremit ist die 9, direkt vor dem Rad des Schicksals.'],
    ['Welche Karte ist die Nummer 13?',
     ['Der Tod', 'Die Mäßigkeit', 'Der Gehängte', 'Der Teufel'],
     'Der Tod ist die 13, und im Tarot spricht er von einem entschiedenen Ende, nicht vom wirklichen Sterben.'],
    ['Was lehrt der Gehängte?',
     ['Anhalten, und die Dinge andersherum sehen', 'Schnell handeln',
      'Geld anhäufen', 'Streiten, bis man gewinnt'],
     'Der Gehängte hängt freiwillig: Der Preis für eine neue Sicht ist, dafür still zu halten.'],
    ['Welcher Planet gehört zum Rad des Schicksals?',
     ['Jupiter', 'Saturn', 'Mars', 'Venus'],
     'Das Rad bekommt Jupiter: den Planeten der Ausdehnung und des Glücks, das von außen kommt.'],
    ['Welches Sternzeichen gehört zur Mäßigkeit?',
     ['Schütze', 'Wassermann', 'Jungfrau', 'Waage'],
     'Die Mäßigkeit ist der Schütze: ein weit gezielter Pfeil, der zwei Dinge mischt, um dorthin zu tragen.']
  ],
  4: [
    ['Welche Karte ist die Nummer 16?',
     ['Der Turm', 'Der Teufel', 'Der Stern', 'Der Mond'],
     'Der Turm ist die 16, direkt nach dem Teufel und direkt vor dem Stern.'],
    ['Welche Karte schließt die Große Arkana ab?',
     ['Die Welt', 'Das Gericht', 'Die Sonne', 'Der Narr'],
     'Die Welt ist die 21, die letzte Karte: Der Kreis ist geschlossen.'],
    ['Welche Karte kommt unmittelbar vor dem Stern, und warum ist das wichtig?',
     ['Der Turm — Hoffnung kommt gleich nach dem Einsturz', 'Der Mond — Licht kommt nach dem Nebel',
      'Die Sonne — eine Freude folgt der anderen', 'Das Gericht — erst erwachen, dann hoffen'],
     'Der Stern (17) folgt auf den Turm (16). Diese Reihenfolge ist die ganze Lektion: Hoffnung kommt nach dem Einsturz, nicht davor.'],
    ['Welcher Planet gehört zum Turm?',
     ['Mars', 'Uranus', 'Saturn', 'Pluto'],
     'Der Turm bekommt Mars: den Schlag, der gerade, schnell und unangekündigt trifft.'],
    ['Welcher Planet gehört zur Welt?',
     ['Saturn', 'Jupiter', 'Die Sonne', 'Neptun'],
     'Die Welt bekommt Saturn: den Planeten der Grenzen, der Zeit und des Fertigwerdens.']
  ],
  5: [
    ['Welches Element gehört zu den Stäben?',
     ['Feuer', 'Wasser', 'Luft', 'Erde'],
     'Stäbe sind Feuer: Handeln, Leidenschaft und Wille.'],
    ['Welches Element gehört zu den Kelchen?',
     ['Wasser', 'Feuer', 'Erde', 'Luft'],
     'Kelche sind Wasser: Gefühl, Liebe und Beziehungen.'],
    ['Wo beginnt und wo endet die Reihe der Zahlenkarten in jeder Farbe?',
     ['Vom Ass bis zur Zehn', 'Von der Zwei bis zum König',
      'Vom Ass bis zum König', 'Von Eins bis Einundzwanzig'],
     'Das Ass ist der Samen der Farbe, die Zehn ist die Farbe in ihrer vollsten Form. Die vier Hofkarten stehen für sich.'],
    ['Welchen Dekan bekommt die Zwei der Stäbe?',
     ['Mars im Widder', 'Venus im Stier', 'Die Sonne im Löwen', 'Merkur in den Zwillingen'],
     'Die Zwei der Stäbe ist Mars im Widder, der erste Dekan des Tierkreises, und ihr alter Titel lautet „Herrschaft". Das steht auch im Astrologie-Feld der Karte.'],
    ['Die vier Asse bekommen keinen Dekan. Was bekommen sie stattdessen?',
     ['Das Element ihrer Farbe selbst', 'Die ersten drei Dekane der Farbe',
      'Einen eigenen Planeten', 'Eine passende Karte der Großen Arkana'],
     'Die sechsunddreißig Zahlenkarten von der Zwei bis zur Zehn decken alle sechsunddreißig Dekane ab. Die vier Asse stehen außerhalb dieses Systems und tragen das reine Element ihrer Farbe: Feuer, Wasser, Luft, Erde.']
  ],
  6: [
    ['Welches Element gehört zu den Schwertern?',
     ['Luft', 'Feuer', 'Erde', 'Wasser'],
     'Schwerter sind Luft: Denken, Sprache und Konflikt.'],
    ['Welches Element gehört zu den Münzen?',
     ['Erde', 'Luft', 'Wasser', 'Feuer'],
     'Münzen sind Erde: Geld, Gesundheit und praktische Arbeit.'],
    ['Warum gelten die Schwerter als die Farbe, die am schwersten zu lesen ist?',
     ['Weil die meisten von ihnen von Schwierigkeiten im Denken und Reden sprechen',
      'Weil es mehr von ihnen gibt als in den anderen Farben',
      'Weil sie keine Hofkarten haben', 'Weil sie nie von Menschen sprechen'],
     'Jede Farbe hat dieselben zehn Zahlenkarten. Die Schwerter sind schwer wegen dessen, was sie tragen: Sorge, Streit und Entscheidungen, die etwas kosten.'],
    ['Welchen Dekan bekommt die Zehn der Schwerter?',
     ['Die Sonne in den Zwillingen', 'Saturn in den Fischen', 'Mars im Skorpion', 'Merkur in der Jungfrau'],
     'Die Zehn der Schwerter ist die Sonne in den Zwillingen, der letzte Dekan der Zwillinge, und ihr alter Titel lautet „Untergang".'],
    ['Über welche drei Sternzeichen laufen die zehn Zahlenkarten der Schwerter?',
     ['Waage, Wassermann, Zwillinge', 'Widder, Löwe, Schütze',
      'Krebs, Skorpion, Fische', 'Stier, Jungfrau, Steinbock'],
     'Schwerter sind Luft, sie laufen also über die drei Luftzeichen: Waage, Wassermann und Zwillinge, drei Karten auf jedes.']
  ],
  7: [
    ['Wie viele Hofkarten gibt es?',
     ['16', '12', '4', '22'],
     'Vier Ränge in vier Farben ergeben 16.'],
    ['Welches sind die vier Ränge der Hofkarten?',
     ['Bube, Ritter, Königin, König', 'Ass, Königin, König, Joker',
      'Bube, Prinz, Prinzessin, König', 'Ritter, König, Königin, Eremit'],
     'Bube, Ritter, Königin und König, in allen vier Farben wiederholt.'],
    ['Worauf zeigt ein König in einer Legung meistens?',
     ['Auf einen erwachsenen Menschen, bei dem die Entscheidung liegt', 'Auf eine Nachricht, die unterwegs ist',
      'Auf eine Geldsumme', 'Auf einen langen Zeitraum'],
     'Der König ist der Rang der Autorität und der gereiften Entscheidung. Eine Nachricht ist meist der Bube.'],
    ['Welchen Abschnitt des Tierkreises deckt eine Hofkarte im System der Golden Dawn ab?',
     ['Die letzten zehn Grad eines Zeichens und die ersten zwanzig des nächsten', 'Ein ganzes Zeichen',
      'Zwei ganze aufeinanderfolgende Zeichen', 'Einen einzelnen Dekan'],
     'Jede Hofkarte überbrückt zwei Zeichen: den letzten Dekan des einen und die ersten zwei des nächsten. Deshalb trägt sie von beiden etwas.'],
    ['Welcher Rang der Hofkarten bekommt überhaupt keinen Abschnitt des Tierkreises?',
     ['Der Bube', 'Der Ritter', 'Die Königin', 'Der König'],
     'Die anderen drei Ränge decken den Tierkreis unter sich ab. Der Bube steht außerhalb: In diesem System bekommt er ein Viertel der Erde statt eines Stücks Himmel.']
  ],
  8: [
    ['In welcher Reihenfolge liest man eine Legung aus drei Karten gewöhnlich?',
     ['Vergangenheit – Gegenwart – Zukunft', 'Gut – schlecht – neutral',
      'Geld – Liebe – Gesundheit', 'Morgen – Mittag – Abend'],
     'Drei Karten entlang einer Zeitlinie sind die erste Legung, die man lernt, und die, die sich am leichtesten am Leben überprüfen lässt.'],
    ['Was ist das Wichtigste, bevor überhaupt eine Karte liegt?',
     ['Sich auf eine klare Frage festzulegen', 'Lange zu mischen',
      'Das richtige Tuch zu wählen', 'So viele Karten wie möglich zu ziehen'],
     'Eine vage Frage kann nur eine vage Antwort hervorbringen. Die Frage ist der schwerste Teil jeder Legung.'],
    ['Wenn eine Legung eine Antwort gibt, die du nicht hören wolltest — was ist das Richtige?',
     ['Sie aufschreiben und später mit dem vergleichen, was geschieht', 'Noch einmal ziehen, bis sie sich ändert',
      'Die unerwünschte Karte herausnehmen', 'Zu einem anderen Deck wechseln'],
     'Dieselbe Frage so lange neu zu ziehen, bis sie gefällt, ist der schnellste Weg, das Lesen ganz zu verlernen. Aufschreiben und vergleichen ist der Weg, auf dem das Können wächst.'],
    ['Aus wie vielen Positionen besteht das Keltische Kreuz?',
     ['10', '7', '12', '5'],
     'Das Keltische Kreuz hat 10: sechs bilden das Kreuz selbst, vier stehen als Stab an der rechten Seite.'],
    ['Was ist in den älteren Legungen ein Signifikator?',
     ['Eine im Voraus gewählte Karte, die für den Fragenden steht', 'Die zuletzt gezogene Karte',
      'Eine Karte, die beim Mischen herausfällt', 'Die erste Karte der Großen Arkana, die auftaucht'],
     'Der Signifikator wird mit Absicht gewählt, meist eine Hofkarte, die zum Fragenden passt, und zuerst gelegt, damit der Rest der Legung um sie herum gelesen wird.']
  ]
};

/* Folded in beside the Vietnamese and the English. The shape is checked first:
   eight lessons, five questions each, four answers each. A row out of step
   would attach a German question to the wrong answers, which is worse than no
   German at all. */
(function () {
  const lessons = Object.keys(QUIZ_TAROT_DE);
  lessons.forEach((k) => {
    const rows = QUIZ_TAROT_DE[k], set = QUIZ.tarot[k];
    if (!set || rows.length !== set.length) return;
    rows.forEach((row, i) => {
      const item = set[i];
      if (!item || !Array.isArray(row[1]) || row[1].length !== item.a.length) return;
      item.q.de = row[0];
      item.a.forEach((ans, j) => { ans.de = row[1][j]; });
      item.why.de = row[2];
    });
  });
}());
