# -*- coding: utf-8 -*-
"""strings.js — review sections 11, 12 and 13: the English text left behind in
the German block. Each entry is the finished German value for that key, in the
same shape the key already has (plain string, array, object or arrow function).
"""
import io, re, sys
sys.path.insert(0, '_patch')
from str_lib import blocks, find_key, read_str

P = 'src/strings.js'
errors = []

DE = {
    # ---- section 11: daily draw, AI, angel numbers, lessons, quiz ----
    'aiSugFocus': "(f) => 'Was sagt diese Karte über mein Thema \\u201E' + f + '\\u201C?'",
    'aiLiteRedirect': "(n, f) => 'Bei der Tageskarte deute ich ' + n + ' nur für den gewählten Schwerpunkt \\u201E' + f + '\\u201C. Die Bedeutungen für andere Themen sowie die aufrechte und umgekehrte Deutung findest du im Tarot-Kurs; für deine persönliche Situation kannst du eine Legung bei Nabu buchen.'",
    'energyLine': "(kws) => 'Gerade trägst du diese Energie in dir: ' + kws + '.'",
    'shadowLine': "(kws) => 'Wenn diese Energie zu stark wird, kann sie sich so zeigen: ' + kws + '.'",
    'focusHead': "(f) => 'Wenn dich gerade ' + f + ' beschäftigt'",
    'shareText': "(name, kws) => 'Meine Karte heute: ' + name + '. Energie: ' + kws + '. Schau dir die Karte an und zieh deine eigene bei '",
    'angelTop': "(n, c) => n + ' begegnet dir am häufigsten: ' + c + '-mal.'",
    'angelWhySame': "(n) => n + ' besteht aus derselben wiederholten Ziffer und wird daher über diese Ziffer gedeutet.'",
    'angelWhyRoot': "(r) => 'Addiert und reduziert ergibt sich die Wurzelzahl ' + r + '; deshalb wird sie der Gruppe ' + r + ' zugeordnet.'",
    'lessonsIntro': "(n) => 'Der Kurs hat ' + n + ' Einheiten. Geh sie der Reihe nach durch, ungefähr eine pro Woche.'",
    'aiSugCard': "['Was sagt diese Karte über mein Liebesleben?', 'Soll ich weitermachen?', 'Wann könnte das passieren?']",
    'aiSugLesson': "['Was ist der Unterschied zwischen Großen und Kleinen Arkana?', 'Für wen stehen die Hofkarten?', 'Was, wenn ich eine Karte nicht verstehe?']",
    'aiSugSign': "['Mit welchen Sternzeichen passt dieses Zeichen gut zusammen?', 'Wie ist dieses Sternzeichen in der Liebe?', 'Was bedeutet der Mond in diesem Sternzeichen?']",
    'aiSugNumbers': "['Was sagt meine Lebenswegzahl über mich?', 'Welches persönliche Jahr habe ich dieses Jahr?', 'Wie lautet meine Ausdruckszahl aus meinem Namen?']",
    'aiSugGeneral': "['Was bedeutet Der Narr?', 'Passen Löwe und Wassermann zusammen?', 'Wie lautet meine Lebenswegzahl?']",
    'aiCardGeneral': "(n) => n + ' beschreibt deine allgemeine Energie im Moment.'",
    'aiCardFocus': "(n, f) => 'Für deine Frage zu ' + f + ' sagt ' + n + ' Folgendes:'",
    'aiYes': "(n) => 'Als Ja-Nein-Tendenz neigt ' + n + ' zu JA. Eine einzelne Karte entscheidet die Frage aber nicht; für eine genauere Deutung kannst du eine Legung buchen.'",
    'aiNo': "(n) => 'Als Ja-Nein-Tendenz neigt ' + n + ' zu NEIN oder \\u201Enoch nicht\\u201C. Eine einzelne Karte entscheidet die Frage aber nicht; für eine genauere Deutung kannst du eine Legung buchen.'",
    'aiMaybe': "(n) => 'Als Ja-Nein-Tendenz legt sich ' + n + ' nicht eindeutig fest. Viel hängt davon ab, was du als Nächstes tust.'",
    'aiChem': "(a, b) => a + ' und ' + b + ':'",
    'aiAbout': "(n) => 'Über ' + n + ':'",
    'quizHow': "(n, p) => n + ' Multiple-Choice-Fragen. Zum Bestehen brauchst du mindestens ' + p + ' %. Du kannst den Test beliebig oft wiederholen.'",
    'quizFailed': "(p) => 'Du brauchst mindestens ' + p + ' %. Lies die Hinweise unten und versuch es noch einmal.'",
    'needWhereId': "(n) => 'Schick Nabu dein ' + n + '-Profil, damit Nabu das richtige Konto findet.'",
    'accessUntil': "(d) => 'Dein Zugang läuft bis ' + d + '.'",
    'courseExpired': "(d) => 'Dein Zugang ist am ' + d + ' abgelaufen. Verlängere ihn, um weiterzulernen.'",
    'buyMsg': "(n, p, m) => 'Hallo Nabu, ich möchte ' + n + ' kaufen (' + p + ', ' + m + ' Monate).'",
    'timeHint': "(tz) => 'Wähl einen Tag mit rosa Punkt und danach eine Uhrzeit in ' + tz + '. Bereits belegte Zeiten sind durchgestrichen.'",
    'actPicked': "(n) => 'Du hast Stapel ' + n + ' gewählt.'",
    'actComeBack': "(d) => 'Komm am ' + d + ' zurück, um ihn umzudrehen.'",
    'actWishCount': "(n) => 'Du hast hier ' + n + ' Wünsche abgeschickt.'",
    'loveAskSentHint': "(n) => 'Warte auf die Antwort von ' + n + '.'",
    'loveAskGot': "(n) => n + ' hat dir einen Heiratsantrag gemacht.'",
    'perYear': "(p) => p + ' / Jahr'",
    'releasedTimes': "(n) => 'Du hast ' + n + '-mal losgelassen.'",
    'aiDrew': "(n) => 'Ich habe eine Karte für dich gezogen: ' + n + '.'",
    'aiSignOf': "(s) => 'Zu deinem Sternzeichen ' + s + ':'",
    'aiTodayMoon': "(m) => 'Heute befindet sich der Mond in der Phase ' + m + '.'",
    'remindTitle': "(w) => 'Legung mit Nabu ' + w",
    'inHours': "(h) => 'in ' + h + ' Stunden'",
    'inMinutes': "(m) => 'in ' + m + ' Minuten'",
    'bkOn': "(d) => 'Termine am ' + d",
    'allPostsBtn': "(n) => 'Alle Beiträge ansehen (' + n + ')'",
    'watchOn': "(s) => 'Auf ' + s + ' ansehen'",
    'dateFmt': "(d) => d.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })",
    'dow': "['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']",
    'months': "['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']",
    'instAndroidSteps': "['Tipp oben auf den Download-Button. Wenn Chrome nachfragt, wähle Herunterladen.', 'Öffne nabu-tarot.apk über die Benachrichtigung oder deinen Download-Ordner.', 'Wenn dein Gerät \\u201EAus dieser Quelle zulassen?\\u201C fragt, erlaube es und geh zurück.', 'Tipp auf Installieren. Danach erscheint Nabu Tarot auf deinem Startbildschirm.']",
    'instIosSteps': "['Öffne diese Seite in Safari, nicht im Browser von Instagram oder Facebook.', 'Tipp unten auf Teilen (das Quadrat mit dem Pfeil nach oben).', 'Scrolle nach unten, wähle \\u201EZum Home-Bildschirm\\u201C und tipp auf Hinzufügen.']",
    'maniIncl': "['WOOP, Wenn-dann-Pläne und ein Vision Board mit deinen eigenen Fotos', 'Rituale zu Neu- und Vollmond sowie ein Tool zum Loslassen', 'Kerzen und Steine nach Anliegen, mit sicheren Anwendungshinweisen']",

    # ---- section 12: the wedding ----
    'wedPayList': "['Ein eigener Hochzeitsraum, der 15 Minuten vor Beginn öffnet.', 'Einladungen per Link, ohne Begrenzung der Gästezahl.', 'Nabu Cupid führt die Zeremonie und fragt euch beide nach eurem Eheversprechen.', 'Musik, fallende Blüten und Effekte während der ganzen Zeremonie.', 'Gäste können kostenlos Glückwünsche und Geschenke senden.', 'Ein Brautstraußwurf bestimmt einen glücklichen Gast.']",
    'wedTerms': "[\n      'Die Zeremonie beginnt zur gewählten Uhrzeit. Einer von euch muss anwesend sein und innerhalb von 15 Minuten auf \\u201EZeremonie beginnen\\u201C tippen.',\n      'Wenn nach 15 Minuten niemand begonnen hat, schließt sich der Hochzeitsraum automatisch und die Gäste werden informiert, dass die Zeremonie nicht stattfindet.',\n      'Datum und Uhrzeit können einmal geändert werden, spätestens eine Stunde vor Beginn.',\n      'Wird die Zeremonie innerhalb der letzten Stunde abgesagt, währenddessen abgebrochen oder wegen Nichterscheinens automatisch geschlossen, gilt sie als genutzt; die Gebühr von 30.000đ wird nicht erstattet. Für einen neuen Termin ist eine neue Buchung und Zahlung erforderlich.'\n    ]",
    'wedHow': "[\n      'Die Zeremonie beginnt erst, wenn ihr beide bestätigt: Eine Person tippt auf \\u201EZeremonie beginnen\\u201C, die andere auf \\u201EIch bin bereit\\u201C.',\n      'Auf dem Bildschirm siehst du, ob die andere Person schon im Raum ist und wie viele Gäste anwesend sind.',\n      'Ihr habt einen privaten Chat, den Gäste nicht lesen können.',\n      'Weitere Gäste kannst du jederzeit über den Bereich am Seitenende einladen \\u2014 auch während ihr schon im Raum seid.',\n      'Nabu Cupid stellt die Fragen, ihr antwortet nacheinander vor euren Gästen. Danach folgt der Brautstraußwurf.',\n      'Wenn 15 Minuten nach der vereinbarten Zeit niemand begonnen hat, schließt sich der Raum automatisch und die Zeremonie gilt als genutzt.'\n    ]",
    'wedRules': "[\n      'Die Zeremonie beginnt zur gewählten Uhrzeit \\u2014 einer von euch muss innerhalb der ersten 15 Minuten auf \\u201EBeginnen\\u201C tippen.',\n      'Datum oder Uhrzeit können einmal geändert werden, spätestens eine Stunde vor Beginn.',\n      'Bei später Absage oder Nichterscheinen gilt die Zeremonie als genutzt; die Gebühr wird nicht erstattet.'\n    ]",
    'wedShareMine': "(n) => n + ' und ich haben auf Nabu Tarot geheiratet \\uD83D\\uDC92'",
    'wedStartsAt': "(when) => 'Die Zeremonie beginnt um ' + when + '. Der Button funktioniert erst ab diesem Zeitpunkt.'",
    'wedGuestWait': "(when) => 'Die Zeremonie beginnt um ' + when + '. Bleib einfach hier \\u2014 gleich geht es los.'",
    'wedInviteText': "(a, b, when) => 'Du bist zur Hochzeit von ' + a + ' und ' + b + ' auf Nabu Tarot eingeladen \\u2014 ' + when + ' \\uD83D\\uDC92'",
    'wedGuests': "(n) => 'Gäste (' + n + ')'",
    'wedCalTitle': "(a, b) => 'Hochzeit von ' + a + ' und ' + b + ' auf Nabu'",
    'wedWaitingFor': "(n) => 'Warte auf die Antwort von ' + n + '\\u2026'",
    'wedBqReady': "(n) => n + ' Gäste sind im Raum.'",
    'wedCaught': "(n) => n + ' hat den Brautstrauß gefangen! \\uD83D\\uDC90'",
    'wedShareGuest': "(a, b) => 'Ich war gerade bei der Hochzeit von ' + a + ' und ' + b + ' auf Nabu Tarot \\uD83D\\uDC92'",
    'wedSay': "{\n      gather: () => 'Willkommen, ihr Lieben. Ich bin Nabu Cupid und hüte den Roten Faden. Heute darf ich etwas ganz Besonderes bezeugen.',\n      thread: (a, b) => 'Der Faden zwischen ' + a + ' und ' + b + ' wurde schon vor langer Zeit geknüpft. Heute verbinden sie ihn vor euch allen noch einmal.',\n      askA: (a, b) => a + ', möchtest du ' + b + ' an deiner Seite haben und den weiteren Weg mit ' + b + ' teilen?',\n      askB: (a, b) => b + ', möchtest du ' + a + ' an deiner Seite haben und den weiteren Weg mit ' + a + ' teilen?',\n      promiseA: (a) => a + ', versprichst du, an den schönen Tagen an ihrer Seite zu stehen \\u2014 und auch an den Tagen, die schwerer sind?',\n      promiseB: (a, b) => b + ', versprichst du, an den schönen Tagen an ihrer Seite zu stehen \\u2014 und auch an den Tagen, die schwerer sind?',\n      bind: () => 'Dann darf ich diesen Faden für euch knüpfen. Von hier an gehören beide Enden zu derselben Geschichte.',\n      declare: (a, b) => 'Vor allen, die heute hier sind, erkläre ich ' + a + ' und ' + b + ' zu einem Ehepaar auf Nabu. Ich wünsche euch von Herzen alles Glück! \\uD83C\\uDF8A'\n    }",

    # ---- section 13: the alerts ----
    'alertOfferGone': "(n) => '\\uD83C\\uDF43 ' + n + ' hat die Einladung zurückgezogen'",
    'alertOffer': "(n) => '\\uD83D\\uDC8C ' + n + ' möchte mit dir einen Roten Faden knüpfen'",
    'alertTied': "(n) => '\\uD83E\\uDDE7 Du und ' + n + ' seid jetzt verbunden!'",
    'alertAsked': "(n) => '\\uD83D\\uDC8D ' + n + ' hat dir einen Antrag gemacht!'",
    'alertNo': "(n) => '\\uD83C\\uDF3F ' + n + ' ist diesmal noch nicht bereit'",
    'alertWed': "(n) => '\\uD83D\\uDC92 Du und ' + n + ' habt geheiratet!'",
    'alertGift': "(n, g) => '\\uD83C\\uDF81 ' + n + ' hat dir ' + g + ' geschenkt'",
    'alertAnniv': "(n, y) => '\\uD83C\\uDF8A Heute feiert ihr ' + y + (y > 1 ? ' Jahre' : ' Jahr') + ' \\u2014 du und ' + n + '!'",
    'alertMark': "(n, d) => '\\u2728 Heute ist Tag ' + d + ' für dich und ' + n + '!'",
    'alertPet': "(n) => '\\uD83C\\uDF5A ' + n + ' hat Hunger'",
    'alertPetMany': "(k) => '\\uD83C\\uDF5A ' + k + ' Begleiter haben Hunger'",
    'alertUp': "(v) => '\\u2728 Nabu wurde aktualisiert (' + v + ')'",
}


def value_end(s, i):
    """End index (exclusive) of the value that starts at s[i]."""
    depth = 0
    while i < len(s):
        c = s[i]
        if c == "'" or c == '"':
            _, i = read_str(s, i)
        elif c in '([{':
            depth += 1
        elif c in ')]}':
            if depth == 0:
                return i
            depth -= 1
        elif c == ',' and depth == 0:
            return i
        i += 1
    return i


src = io.open(P, encoding='utf-8').read()
done = 0
for key, val in DE.items():
    span = blocks(src)['de']
    hits = len(re.findall(r'(?<![\w.$])' + re.escape(key) + r': ', src[span[0]:span[1]]))
    if hits != 1:
        errors.append('%s: %d matches in the German block' % (key, hits))
        continue
    i = find_key(src, span, key)
    src = src[:i] + val + src[value_end(src, i):]
    done += 1

io.open(P, 'w', encoding='utf-8', newline='').write(src)
if errors:
    sys.stderr.write('\n'.join(errors) + '\n')
    sys.exit(1)
print('strings.js sections 11-13: %d German values replaced' % done)
