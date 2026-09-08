/* German card names and text (The Learner's Deck).

   Stage 2 of the German translation. The deck is built from LEX[lg] and
   DECKTEXT[lg], so German needs both: LEX.de for the names the app assembles
   (Ass der Kelche, Ritter der Stäbe), DECKTEXT.de for the words on the card
   pages.

   Terminology follows GERMAN-GLOSSARY.md and is fixed: Große Arkana, Stäbe,
   Kelche, Schwerter, Münzen; Bube, Ritter, Königin, König; Der Gehängte,
   Die Mäßigkeit, Das Gericht.

   The genitive plural is 'der' for all four suits, so one pipName covers
   them all. */

LEX.de = {
  numbers: ['Ass', 'Zwei', 'Drei', 'Vier', 'Fünf', 'Sechs', 'Sieben', 'Acht', 'Neun', 'Zehn'],
  courts: ['Bube', 'Ritter', 'Königin', 'König'],
  suitNames: { major: 'Große Arkana', wands: 'Stäbe', cups: 'Kelche', swords: 'Schwerter', pentacles: 'Münzen' },
  elements: { wands: 'Feuer', cups: 'Wasser', swords: 'Luft', pentacles: 'Erde' },
  courtTag: 'Hofkarte',
  pipName: (n, s) => `${n} der ${s}`,
  courtName: (c, s) => `${c} der ${s}`
};

const MAJORS_DE = [
["Der Narr","Anfang · Vertrauen · Unschuld · der Sprung",
 "Ein junger Mensch in einem gemusterten Gewand geht auf eine Klippe zu, das Gesicht einer weißen Sonne zugewandt. In der einen Hand eine weiße Rose, über der Schulter ein Bündel an einem Stock, und ein kleiner weißer Hund springt an seinen Fersen.",
 'Diese Karte handelt davon, etwas zu beginnen, bevor du Beweise dafür hast, dass es gelingt. Vertrauen kommt hier vor Gewissheit – mit der besonderen Freiheit eines Menschen, der wenig zu verlieren hat.',
 "Leichtsinn — oder genau das Gegenteil: sich gar nicht zu bewegen, weil der Abgrund zu tief aussieht."],
["Der Magier","Wille · Konzentration · Mittel · Verwirklichung",
 "Eine Hand zum Himmel erhoben, eine zur Erde gerichtet, ein Unendlichkeitszeichen über dem Kopf. Auf dem Tisch vor ihm liegen ein Stab, ein Kelch, ein Schwert und eine Münze — alle vier Farben.",
 'Du hast bereits die Werkzeuge, die diese Situation verlangt. Es geht nicht darum, noch mehr zu sammeln, sondern das Vorhandene auf ein Ziel zu richten.',
 "Talent, das sich auf zu viele Dinge verteilt, oder Überzeugungskraft, die zur Manipulation wird."],
["Die Hohepriesterin","Intuition · das Unenthüllte · inneres Wissen",
 "Sie sitzt zwischen einer schwarzen und einer weißen Säule, eine Mondsichel zu ihren Füßen, hinter ihr ein Vorhang mit Granatäpfeln, und in ihrem Schoß eine Schriftrolle, die nur halb zu sehen ist.",
 'Die Antwort ist da, aber noch nicht an die Oberfläche gekommen. Warte, hör nach innen und zwing nichts dazu, sich zu zeigen – weder bei dir noch bei jemand anderem.',
 "Das eigene Bauchgefühl übergehen, oder ein Geheimnis, das längst über den Punkt hinaus gehütet wird, an dem es noch jemandem geholfen hat."],
["Die Herrscherin","Fülle · Fürsorge · Schöpfung · die Sinne",
 "Eine gekrönte Frau inmitten reifenden Weizens, über ihr ein Kranz aus zwölf Sternen, an ihrer Seite ein herzförmiger Schild mit dem Zeichen der Venus.",
 "Etwas wächst und braucht vor allem Nahrung, nicht Reparatur. Fruchtbarkeit in jedem Sinn — schöpferisch, körperlich, materielle Behaglichkeit, Genuss ohne schlechtes Gewissen.",
 "Erdrückende Fürsorge, eine schöpferische Blockade, oder Zuwendung für alles außer für dich selbst."],
["Der Herrscher","Struktur · Autorität · Grenze",
 "Ein bärtiger Herrscher auf einem steinernen Thron, in den Widderköpfe gehauen sind, ein Ankh-Zepter in der Hand, karge Berge hinter ihm.",
 "Ordnung, dem Chaos auferlegt: Regeln, Disziplin, Schutz. Die Karte der Person, die entscheidet, und der Grenze, die alles andere erst möglich macht.",
 "Starrheit und Beherrschung — oder gar keine Struktur, sodass alles wackelt."],
["Der Hierophant","Tradition · Lehre · Institution",
 "Eine Gestalt im Gewand mit dreifacher Krone hebt segnend die Hand über zwei Mönche. Zu seinen Füßen liegen gekreuzte Schlüssel.",
 "Der eingeführte Weg, und jemand, der befugt ist, ihn zu lehren. Lernen innerhalb einer Überlieferung, und der Wert, es so zu machen, wie es immer gemacht wurde.",
 "Ein Dogma, das sich überlebt hat, oder ein echter Ruf, mit der Konvention zu brechen."],
["Die Liebenden","Verbindung · Wahl · Werte",
 "Ein Mann und eine Frau stehen nackt unter einem geflügelten Engel im vollen Sonnenlicht. Hinter ihr eine Schlange im Baum, hinter ihm ein Baum aus Flammen.",
 "Eine echte Begegnung zwischen zwei Dingen, und eine Wahl, die zeigt, was dir wirklich wichtig ist — nicht, was du behauptest.",
 "Etwas passt nicht zusammen, eine Entscheidung wird umgangen, oder eine Partnerschaft, in der das Gewicht auf einer Seite liegt."],
["Der Wagen","Antrieb · Kontrolle · Sieg",
 "Eine gerüstete Gestalt steht in einem Wagen unter einem Sternenbaldachin, gezogen von einer schwarzen und einer weißen Sphinx. Zügel gibt es im ganzen Bild keine.",
 "Vorwärtsbewegung, errungen dadurch, dass zwei gegensätzliche Kräfte auf einem Kurs gehalten werden. Wille über die Umstände, zumindest für jetzt.",
 "In zwei Richtungen gezogen, oder Schwung, bei dem niemand steuert."],
["Die Kraft","Mut · Geduld · sanfte Stärke",
 "Eine Frau in Weiß schließt mit bloßen Händen ruhig das Maul eines Löwen, ein Unendlichkeitszeichen über ihrem Kopf. Sie strengt sich nicht an.",
 "Wirkung durch Sanftheit und Ausdauer statt durch Gewalt. Auch die leisere Fassung: das eigene Verlangen zu meistern statt das eines anderen.",
 "Selbstzweifel, oder Gewalt dort, wo Geduld gereicht hätte."],
["Der Eremit","Alleinsein · Suche · inneres Licht",
 "Ein alter Mann im Mantel steht auf einem verschneiten Gipfel und hält eine Laterne hoch, in der ein sechszackiger Stern brennt; er stützt sich auf einen langen Stab.",
 "Bewusster Rückzug, um die eigene Antwort zu finden. Eine Zeit des Lernens, der Stille, und des absichtlichen Nichtfragens der Menge.",
 "Abgeschiedenheit, die zur Vermeidung geworden ist, oder Hilfe abzulehnen, die ernst gemeint war."],
["Das Rad des Schicksals","Zyklen · Wendepunkt · Glück",
 "Ein großes Rad mit den Buchstaben T-A-R-O dreht sich am Himmel. Oben ruht eine Sphinx, an der einen Seite gleitet eine Schlange hinab, an der anderen steigt ein Schakal auf, und in den Ecken lesen vier geflügelte Wesen in Büchern.",
 'Die Umstände verändern sich in ihrem eigenen Rhythmus. Geh mit dem Rad mit, statt dich an einer Position festzuhalten und zu wünschen, dass alles stehen bleibt.',
 "Eine Talfahrt, Widerstand gegen eine Veränderung, die längst läuft, oder schlicht der falsche Zeitpunkt."],
["Die Gerechtigkeit","Fairness · Ursache und Wirkung · Wahrheit",
 "Eine gekrönte Gestalt sitzt zwischen zwei Säulen, in der einen Hand ein aufrechtes Schwert, in der anderen eine vollkommen waagerechte Waage.",
 "Dinge werden genau gewogen, und Folgen treffen ein. Eine Entscheidung, die ehrlich sein muss statt freundlich.",
 "Voreingenommenheit, eine unausgeglichene Rechnung, oder Verantwortung, der jemand erfolgreich ausgewichen ist — vorerst."],
["Der Gehängte","Aufschub · Umkehrung · Hingabe",
 "Ein Mann hängt gelassen an einem Fußgelenk an einem lebenden T-förmigen Baum, das freie Bein dahinter verschränkt, ein Lichtkranz um seinen Kopf.",
 "Eine bewusste Pause. Die Antwort kommt daher, dass du deine Sicht umkehrst, nicht daher, dass du in die alte Richtung stärker drückst.",
 "Hinhalten, das sich als Nachdenken ausgibt, oder ein Opfer, für das nichts zurückkommt."],
["Der Tod","Ende · Übergang · Aufräumen",
 "Ein Skelett in schwarzer Rüstung reitet auf einem weißen Pferd an einem gefallenen König vorbei. Sein Banner trägt eine weiße Rose, und am Horizont geht die Sonne zwischen zwei Türmen auf.",
 "Etwas endet endgültig, damit das Nächste überhaupt sein kann. Fast nie wörtlich, und fast immer nicht verhandelbar.",
 "Sich an das zu klammern, was schon vorbei ist, oder ein Ende, das viel länger hingezogen wird als nötig."],
["Die Mäßigkeit","Ausgleich · Mischung · Maß",
 "Eine geflügelte Gestalt, ein Fuß an Land, einer im Wasser, gießt Flüssigkeit in einem Bogen zwischen zwei Kelchen hin und her, der so gar nicht möglich sein dürfte.",
 "Geduldiges Nachjustieren, bis die Mischung stimmt. Heilung und Erholung, die so lange brauchen, wie sie brauchen.",
 "Übermaß, Ungeduld, oder zwei Bestandteile, die sich einfach nicht verbinden lassen."],
["Der Teufel","Fesselung · Zwang · Schatten",
 "Eine gehörnte Gestalt hockt auf einem Block, ein umgekehrtes Pentagramm auf der Stirn. Darunter stehen ein Mann und eine Frau in Ketten — und die Ketten sind so locker, dass man sie einfach abstreifen könnte.",
 "Eine Bindung, die dich führt: eine Gewohnheit, ein Verlangen, ein Muster, von dem du dir sagst, du kämst nicht heraus. Dass die Ketten locker sind, ist der ganze Punkt.",
 "Die Kette als das zu erkennen, was sie ist, und den ersten Schritt zu machen, sie loszuwerden."],
["Der Turm","plötzlicher Einsturz · Offenbarung",
 "Ein Blitz schlägt die Krone von einem hohen Turm. Aus den Fenstern schlagen Flammen, und zwei Gestalten stürzen kopfüber ins Dunkel.",
 "Ein Bau, der auf etwas Falschem stand, fällt schnell. Schmerzhaft, klärend, und nicht mehr freiwillig, sobald es einmal begonnen hat.",
 "Ein Unglück, das knapp abgewendet wurde, oder ein Einsturz, den du zermürbend in die Länge ziehst."],
["Der Stern","Hoffnung · Erneuerung · Führung",
 "Eine nackte Frau kniet an einem Teich und gießt mit dem einen Krug Wasser auf das Land und mit dem anderen zurück in den Teich. Über ihr brennen ein großer Stern und sieben kleinere.",
 "Ruhe nach dem Trümmerfeld. Zurückgewonnenes Vertrauen und ein klares Gefühl dafür, welche Richtung deine ist — meist gleich nach dem Turm.",
 "Entmutigung, dünn gewordenes Vertrauen, den Faden aus den Augen verlieren, dem du gefolgt bist."],
["Der Mond","Ungewissheit · Traum · Verzerrung",
 "Ein Mond mit Gesicht tropft Tau über einen Weg, der zwischen zwei Türmen verläuft. Ein Hund und ein Wolf heulen ihn an, und ein Krebs kriecht aus dem Teich.",
 "Das Gelände ist nicht klar, und deine Deutung davon kann falsch sein. Angst, Vorstellungskraft und Instinkt reden alle gleichzeitig, im Dunkeln.",
 "Verwirrung, die sich lichtet, oder eine Täuschung, die endlich ans Licht kommt."],
["Die Sonne","Klarheit · Lebenskraft · Erfolg",
 "Ein Kind reitet auf einem weißen Pferd unter einer riesigen strahlenden Sonne, ein rotes Banner weht hinterher, im Rücken eine Wand aus Sonnenblumen.",
 "Die Dinge sind einfach gut, und man sieht es. Kraft, Wärme, schlichte ehrliche Freude — die unkomplizierteste Karte im Deck.",
 "Gedämpfte Begeisterung, verzögerter Erfolg, oder Zuversicht, die eher vorgeführt als gefühlt wird."],
["Das Gericht","Abrechnung · Erwachen · Berufung",
 "Ein Engel bläst durch die Wolken in eine Posaune, und graue Gestalten erheben sich mit weit ausgebreiteten Armen aus offenen Särgen.",
 "Eine Summe. Du siehst den ganzen Bogen einer Sache auf einmal und antwortest auf einen Ruf, den du nicht mehr überhören kannst.",
 "Harte Selbstvorwürfe, oder den Ruf klar zu hören und ihn zu übergehen."],
["Die Welt","Vollendung · Ganzheit · Zusammenführung",
 "Eine tanzende Gestalt, in eine violette Schärpe gehüllt, steht in einem Lorbeerkranz. In den vier Ecken ein Stier, ein Löwe, ein Adler und ein Engel.",
 "Der Kreis schließt sich richtig. Ankommen, und das Können, das nur daher kommt, dass man den ganzen Weg gegangen ist.",
 "So kurz vor dem Ende — ein loser Faden, oder ein Abschluss, den jemand zurückhält."]
];

const MINORS_DE={
wands:{
 el:"Feuer", blurb:"Antrieb, Schöpferkraft, Ehrgeiz, der Funke vor dem Plan. Stabkarten bewegen sich schnell und brennen aus.",
 pips:[
 ["Eine Hand reicht aus einer Wolke einen austreibenden Zweig, von dem noch Blätter fallen.","Ein Funke: der erste Schub, etwas machen zu wollen. Rohe Energie, noch auf nichts gerichtet.","Ein Fehlstart, oder Energie, die nirgendwo hin kann."],
 ["Ein Mann auf seiner eigenen Mauer hält eine Weltkugel und blickt über die Mauern hinaus, die er gebaut hat.","Weiter planen als das, was du schon hast. Den größeren Horizont wählen statt den bequemen.","Auf Nummer sicher gehen, oder Pläne, die den Schreibtisch nie verlassen."],
 ["Eine Gestalt auf einer Klippe sieht Schiffen nach, die über das Wasser hinausfahren.","Die ersten Anstrengungen laufen und sind nicht mehr in deiner Hand. Ausweitung, und das Warten, das auf einen Start folgt.","Verzögerungen, schlechtes Warten, oder ein Plan, der zu klein angesetzt ist."],
 ["Vier bekränzte Stäbe bilden ein Tor vor einer Burg; darunter heben Gestalten Blumensträuße.","Eine Schwelle, an der es sich lohnt anzuhalten — Heimkehr, Halt, ein Meilenstein, den du mit anderen erreicht hast.","Dasselbe, nur leiser: ein Fest, das verschoben oder im Kleinen gefeiert wird."],
 ["Fünf junge Leute schwingen ihre Stäbe in einem ungeordneten Scheingefecht.","Reibung und Wettbewerb. Alle reden gleichzeitig; niemand wird wirklich gehört.","Ein Streit, dem ausgewichen wird, oder ein langer Konflikt, der sich endlich legt."],
 ["Ein lorbeergekrönter Reiter wird durch eine jubelnde Menge geführt, ein Kranz an seinem Stab.","Öffentliche Anerkennung. Der Sieg, den andere sehen und würdigen können.","Anerkennung, die ausbleibt, oder ein Erfolg, der sich hohl anfühlt, sobald du ihn hast."],
 ["Ein Mann auf erhöhtem Grund wehrt sechs Stäbe ab, die von unten auf ihn zukommen.","Die eigene Stellung unter Druck halten. Verteidige, was du gebaut hast — du stehst höher.","Überfordert, oder Boden aufgeben, den du hättest halten sollen."],
 ["Acht Stäbe fliegen über einem Fluss durch den offenen Himmel. Kein Mensch zu sehen.","Plötzliches Tempo. Nachrichten, Reisen, und Dinge, die nach langer Stille alle auf einmal ankommen.","Stockungen, oder Energie, die in acht Richtungen zerstreut ist."],
 ["Ein verbundener Mann stützt sich auf seinen Stab und beobachtet den Zaun, bereit für den nächsten.","Zermürbt und immer noch aufrecht. Ein Schub noch, und eine Wachsamkeit, die ehrlich verdient ist.","Misstrauen, oder eine Erschöpfung, die du zu lange übersehen hast."],
 ["Eine Gestalt kämpft sich vorwärts, tief gebeugt unter einem Bündel von zehn Stäben.",'Du trägst zu viel allein, und die Last ist inzwischen größer, als du auf Dauer tragen kannst.',"Etwas ablegen. Endlich abgeben, oder das Nächste ausschlagen."]],
 court:[
 ["Ein junger Mensch mit Federhut steht in der Wüste und betrachtet den Stab in seinen Händen.","Eine neue Begeisterung, oder eine Nachricht, die etwas anstößt. Die Erlaubnis, darin Anfänger zu sein.","Ruhelosigkeit, große Worte, und tatsächlich nichts begonnen."],
 ["Ein Ritter mit Federhelm prescht auf einem sich aufbäumenden Pferd voran, den Stab hoch erhoben.","Mutiges Handeln und Abenteuer. Losgehen, bevor alles geplant ist, und zwar mit Absicht.","Hast und Ausbrennen — anfangen, was du gar nicht zu Ende bringen willst."],
 ["Eine gekrönte Frau hält eine Sonnenblume, eine schwarze Katze sitzt zu ihren Füßen, der Blick geht geradeaus.","Warm, sicher, anziehend. Weiß genau, was sie will, und bringt andere dazu, es auch zu wollen.","Eine Intensität, die fordernd geworden ist, oder Selbstsicherheit, die brüchig wird."],
 ["Ein bärtiger König auf einem Thron mit eingehauenen Salamandern hält einen blühenden Stab.","Vision und dazu die Autorität, andere daran glauben zu lassen. Ein geborener Anführer, ungeduldig mit Einzelheiten.","Impulsivität im großen Maßstab, Tyrannei, oder Versprechen, die schneller sind als das Ergebnis."]]},
cups:{
 el:"Wasser", blurb:"Gefühl, Beziehung, Vorstellungskraft, das Innenleben. Kelchkarten bewegen sich langsam und gehen tief.",
 pips:[
 ["Eine Hand reicht einen überfließenden Kelch, in den eine Taube herabsteigt, fünf Ströme laufen über.",'Diese Karte spricht von einem sich öffnenden Herzen: Zuneigung wird gegeben, eine Bindung beginnt, ein Gefühl ist noch frisch und unversehrt.',"Verschlossen, oder ein Gefühl, das entschlossen wieder hinuntergedrückt wird."],
 ["Ein Mann und eine Frau reichen einander ihre Kelche unter einem geflügelten Caduceus.","Gegenseitiges Erkennen zwischen zwei Menschen. Partnerschaft, Versöhnung, ein Frieden, den beide Seiten ernst meinen.","Ungleichgewicht, ein Riss, oder eine Person, die das Ganze allein trägt."],
 ["Drei Frauen heben ihre Kelche im Kreis und tanzen inmitten der Ernte.","Freundschaft und Feier. Sich in Gesellschaft wirklich freuen statt allein.","Klatsch, Übermaß, oder eine Gruppe, in der die Stimmung gekippt ist."],
 ["Eine Gestalt sitzt mit verschränkten Armen unter einem Baum und beachtet einen Kelch nicht, der ihr aus einer Wolke gereicht wird.",'Du bist unzufrieden oder innerlich abgestumpft. Eine Möglichkeit wird dir angeboten, aber im Moment möchtest du sie nicht wirklich annehmen.',"Aufwachen für das Angebot. Die Teilnahmslosigkeit lässt nach."],
 ["Eine verhüllte Gestalt trauert über drei verschütteten Kelchen. Zwei stehen unbemerkt hinter ihr.","Verlust, und die Art, wie Trauer dich nur auf das schauen lässt, was fort ist. Die zwei aufrechten Kelche sind die ganze Botschaft.","Sich umdrehen. Annehmen beginnt, Hilfe wird angenommen."],
 ["Ein Kind reicht einem anderen in einem ummauerten Garten einen Kelch voller Blumen.","Erinnerung und Unschuld. Freundlichkeit aus der Vergangenheit kommt zurück, oder jemand von damals kehrt wieder.","In alter Erinnerung feststecken — oder sie endlich ablegen."],
 ["Sieben Kelche schweben in Wolken und enthalten eine Burg, Juwelen, einen Kranz, eine Schlange und eine verhüllte Gestalt.",'Du hast zu viele Möglichkeiten, und vieles davon ist Wunschbild. Wähl eine davon und bring sie in die Wirklichkeit; sonst bleiben alle nur Vorstellungen.',"Klarheit kommt an, oder das Wunschdenken zeigt sich als das, was es war."],
 ["Eine Gestalt geht unter einem verfinsterten Mond von acht gestapelten Kelchen fort, den Bergen entgegen.",'Du entscheidest dich, etwas zu verlassen, das nicht schlecht war, dir aber nicht mehr reicht. Der Preis ist, die Leere des Übergangs anzunehmen.',"Zurückgehen, oder es nicht über sich bringen zu gehen."],
 ["Ein zufriedener Mann sitzt mit verschränkten Armen vor einer geschwungenen Reihe von neun Kelchen, sehr mit sich im Reinen.","Zufriedenheit. Ein erfüllter Wunsch und ein Genuss, der verdient ist — überliefert als die Wunschkarte.","Selbstgefälligkeit, oder den Wunsch bekommen und merken, dass er nicht satt macht."],
 ["Ein Paar hebt die Arme zu einem Regenbogen aus zehn Kelchen, während zwei Kinder daneben tanzen.","Erfüllung im Gefühl, im ganzen Bild — Familie, Zugehörigkeit, ein Glück, das über die Zeit trägt.","Eine makellose Oberfläche mit einer echten Lücke darunter."]],
 court:[
 ["Ein junger Mensch in blauem Gewand betrachtet ungerührt einen Fisch, der in seinem Kelch aufgetaucht ist.","Ein zartes neues Gefühl, eine Einladung, oder ein Einfall aus der Vorstellungskraft, dem zu folgen sich lohnt.","Launenhaftigkeit, oder Gefühle, die zurückgehalten wurden und hätten gesagt werden müssen."],
 ["Ein Ritter reitet langsam und hält seinen Kelch wie eine Gabe vor sich her.","Romantik und eine Annäherung mit Anstand. Dem Herzen im Schritttempo folgen.","Ein Angebot, hinter dem nichts steht, oder ein Ideal, das den Boden nie berührt."],
 ["Eine Königin blickt am Wasserrand ganz versunken in einen verzierten Kelch mit Deckel.","Tiefes Mitgefühl und ein feines Gespür. Kann tragen, was andere fühlen, ohne darin unterzugehen.","Überflutung, das Wetter aller anderen aufsaugen, oder Fürsorge, die zur Kontrolle geworden ist."],
 ["Ein König hält Kelch und Zepter auf einem Thron, der auf rauer See treibt, sein Gewand bleibt trocken.","Gefühl, ganz gefühlt und doch nicht am Ruder. Ruhe mitten in den Stürmen anderer.","Unterdrückung, Manipulation, oder eine Ruhe, die nur außen ist."]]},
swords:{
 el:"Luft", blurb:"Verstand, Wahrheit, Sprache, Konflikt. Schwerter schneiden nach beiden Seiten, und die meisten tun weh.",
 pips:[
 ["Eine Hand umfasst ein aufrechtes Schwert, gekrönt von Lorbeer und Palme, sechs Tropfen fallen herab.","Ein harter, klarer Gedanke. Wahrheit, die hindurchschneidet, oder eine Entscheidung, die getroffen und nicht wieder aufgemacht wird.","Verwirrung, oder Klarheit, die als Waffe benutzt wird."],
 ["Eine Frau mit verbundenen Augen hält zwei gekreuzte Schwerter und sitzt an mondbeschienenem Wasser.","Ein Patt, das absichtlich gehalten wird. Sich weigern, eine Wahl direkt anzusehen, von der du längst weißt.","Die Binde fällt; die Blockade löst sich, so oder so."],
 ["Drei Schwerter durchbohren ein rotes Herz vor grauem Regen.","Schlichter Kummer, und meistens die Worte, die ihn verursacht haben. Diese Karte beschönigt nichts.","Der Schmerz lässt nach. Trauer, die durchgearbeitet wird, statt darin sitzen zu bleiben."],
 ["Ein Ritter liegt als Steinfigur auf einem Grab, drei Schwerter hängen über ihm, eines liegt darunter.","Verordnete Ruhe. Erholung, Rückzug, die Pause vor der nächsten Runde — keine Niederlage.","Ruhelosigkeit, Ausbrennen, oder zu früh wieder einsteigen."],
 ["Ein süffisanter Mann sammelt Schwerter ein, während zwei Gestalten mit dem Rücken zu ihm davongehen.","Gewinnen zu einem Preis, der es nicht wert war. Ein Streit, aus dem keine Seite sauber herauskommt.","Wiedergutmachen, oder eine Niederlage annehmen und weitergehen."],
 ["Ein Fährmann stakt ein Boot mit einem verhüllten Fahrgast und sechs Schwertern zu einem ruhigeren Ufer.","Eine schwere Überfahrt fort vom Ärger. Von hier wird es stiller, aber du musstest gehen, um das zu bekommen.",'Du bist gegangen, hast das alte Problem aber mitgenommen. Abstand allein hat daher nichts gelöst.'],
 ["Ein Mann schleicht mit fünf Schwertern aus einem Lager und lässt zwei im Boden stecken.",'Diese Karte spricht von Strategie und Ausweichen. Vielleicht kommst du an der unmittelbaren Situation vorbei, doch ein Teil der Wahrheit bleibt zurück.',"Auffliegen, oder sich entscheiden, reinen Tisch zu machen."],
 ["Eine gefesselte Frau mit verbundenen Augen steht zwischen acht Schwertern, die im Schlamm stecken.","Sich gefangen fühlen in einer Lage, die viel mehr Spielraum hat, als du denkst. Die Schwerter sind kein Käfig.","Den Weg hinaus sehen. Die Fesseln lockern sich."],
 ["Eine Gestalt sitzt im Bett und hält das Gesicht in den Händen; neun Schwerter hängen an der Wand dahinter.",'Das ist die Art von Angst, die mitten in der Nacht alles größer erscheinen lässt. Die Angst ist real, aber das, wovor du dich fürchtest, ist vielleicht nicht so groß, wie dein Kopf es gerade zeichnet.',"Das Schlimmste geht vorbei, oder du sagst es endlich jemandem."],
 ["Eine Gestalt liegt mit dem Gesicht nach unten, zehn Schwerter im Rücken, während über dem Wasser der Morgen anbricht.","Der tiefste Punkt, und zwar theatralisch. Schlimmer geht es wirklich nicht, und die Sonne geht schon auf.","Erholung. Überleben, und sich nicht erledigen lassen."]],
 court:[
 ["Ein junger Mensch schwingt auf windiger Anhöhe ein Schwert und blickt über die Schulter zurück.","Neugier und scharfe Fragen. Informationen sammeln, manchmal bevor klar ist, wofür.","Herumschnüffeln, Zynismus, oder Worte, die verletzen sollen."],
 ["Ein Ritter prescht kopfüber durch einen Sturm, das Schwert erhoben, das Pferd in vollem Lauf.","Schnell, direkt und streitlustig. Geht geradewegs auf den Punkt zu und bremst für Gefühle nicht ab.",'Du gehst vielleicht zu aggressiv vor, handelst zu unüberlegt oder stürzt dich in einen Kampf, der es nicht wert ist.'],
 ["Eine strenge Königin sitzt über den Wolken, das Schwert aufrecht, eine Hand ausgestreckt.",'Die Königin der Schwerter denkt klar und lässt Gefühle die Wahrheit nicht verdecken. Sie spricht direkt, aber fair, weil sie genug erlebt hat, um den Wert von Klarheit zu kennen.',"Kälte, Bitterkeit, oder Kritik, die zur Persönlichkeit geworden ist."],
 ["Ein König hält sein Schwert leicht geneigt, in seinen Thron sind Schmetterlinge geschnitzt.","Urteilskraft und geistige Autorität. Grundsatz vor Vorliebe, und das durchgehend.","Kaltes Regieren, Streit als Sport, oder Macht, die zum Gewinnen statt zum Entscheiden benutzt wird."]]},
pentacles:{
 el:"Erde", blurb:"Arbeit, Geld, der Körper und alles mit einem greifbaren Ergebnis. Münzen sind langsam, und sie halten.",
 pips:[
 ["Eine Hand reicht eine goldene Münze über einem ummauerten Garten, dessen Tor sich zu den Bergen öffnet.",'Diese Karte weist auf eine sehr konkrete Chance hin, die du wirklich ergreifen kannst: ein Angebot, eine Stelle oder einen finanziell soliden Anfang.',"Eine verpasste Chance, oder ein Plan ohne Fundament darunter."],
 ["Ein junger Mann tanzt und jongliert zwei Münzen in einer Unendlichkeitsschleife, während Schiffe auf hohen Wellen reiten.","Anforderungen ausbalancieren und alles in Bewegung halten. Anpassungsfähig, aber gerade so.","Etwas fallen lassen. Zu viel zugesagt und kurz davor, es zu merken."],
 ["Ein Bildhauer steht auf einer Bank in einer Kathedrale und berät sich mit zwei Gestalten, die Pläne halten.","Gekonnte Zusammenarbeit. Arbeit, die von Leuten erkannt und weitergebaut wird, die wissen, worauf sie schauen.","Ungleicher Einsatz, oder ein Team, das in verschiedene Richtungen zieht."],
 ["Eine gekrönte Gestalt drückt eine Münze an die Brust, steht auf zweien und balanciert eine auf dem Kopf.","Festhalten. Sicherheit, Sparen, Kontrolle — bezahlt damit, sich nicht mehr bewegen zu können.","Den Griff lockern, oder es verlieren, ob du wolltest oder nicht."],
 ["Zwei Bettler ziehen im Schnee an einem hell erleuchteten Kirchenfenster vorbei, einer auf Krücken.","Not, und dieses bestimmte Gefühl, draußen zu sein, während andere im Warmen sind. Hilfe ist näher, als es aussieht.","Erholung beginnt, oder endlich um die Hilfe bitten."],
 ["Ein Kaufmann hält in einer Hand eine waagerechte Waage und lässt mit der anderen Münzen in zwei knieende Hände fallen.","Geben und Nehmen. Großzügigkeit, die echt ist, und ein Machtgefälle darin, das ebenso echt ist.","Bedingungen im Kleingedruckten, Schulden, oder ein Geben, das nur in eine Richtung läuft."],
 ["Ein Mann lehnt an seiner Hacke und betrachtet eine Ranke voller Münzen, die er nicht gepflückt hat.","Innehalten, um eine lange Investition zu prüfen. Geduld, und die ehrliche Frage, ob du weitermachst.","Ungeduld, oder Mühe, die ins falsche Feld geflossen ist."],
 ["Ein Handwerker meißelt an seiner Werkbank eine Münze nach der anderen, sieben fertig, eine in der Hand.","Wiederholung, die zur Meisterschaft wird. Das unglamouröse Mittelstück auf dem Weg, wirklich gut zu werden.","Nachlässigkeit, oder Arbeit, aus der aller Sinn herausgelaufen ist."],
 ["Eine Frau in einem ummauerten Garten voller reifer Reben legt eine Hand auf einen verhüllten Falken.","Behaglichkeit, die du dir selbst gemacht hast. Unabhängigkeit, und das Vergnügen, sie zu deinen eigenen Bedingungen zu genießen.","Abhängigkeit, oder Wohlstand, zu dem keine Freiheit gehört."],
 ["Drei Generationen und zwei Hunde stehen unter einem Torbogen; zehn Münzen füllen das Bild.","Dauerhafter Wohlstand — Vermächtnis, Familie, die Gefüge, die den überdauern, der sie gebaut hat.","Streit in der Familie ums Geld, oder nur bis zum Monatsende denken."]],
 court:[
 ["Ein junger Mensch steht auf einem grünen Feld und betrachtet eine Münze, die er sorgfältig in beiden Händen hält.","Ein Lernender. Ein praktisches neues Vorhaben, ernst genug genommen, um es richtig zu lernen.","Aufschieben, oder Gelerntes, das nie angewendet wird."],
 ["Ein gerüsteter Ritter sitzt vollkommen still auf einem schweren schwarzen Pferd und hält eine Münze vor sich.","Methodisch und verlässlich. Langsam, unaufregend, und es wird fertig — der einzige Ritter, der sich nicht bewegt.","Stillstand, Sturheit, oder Arbeit, die stumpf geworden ist."],
 ["Eine Königin auf einem Thron mit eingeschnitzten Früchten und Ziegen hält eine Münze im Arm, ein Hase sitzt zu ihren Füßen.","Praktische Fürsorge. Findig und geerdet; macht die Menschen um sie herum materiell sicher.","Zu viel Arbeit, erdrückende Fürsorge, oder sich um alle kümmern außer um sich selbst."],
 ["Ein König in einem Gewand aus Weinranken legt eine Hand auf eine Münze, seine Burg im Rücken.","Meisterschaft in der materiellen Welt. Wohlstand, Halt und eine Versorgung, auf die du dich wirklich verlassen kannst.","Gier, Kontrolle über Geld, oder sturer Materialismus."]]}
};

/* German joins the table the deck is built from. */
DECKTEXT.de = { majors: MAJORS_DE, minors: MINORS_DE };
