# -*- coding: utf-8 -*-
"""Section 29.6: the small UI/data modules.

config.js (tzLabel, tagline, INTERESTS), strings.js (TOPICS), services.js
(SERVICES, COURSES, BOOK_WHERE, PAYMENT_NOTE), looks.js (LOOK_SETS),
love.js (GIFTS) and pet.js (PET_NAMES, PET_LINES, LUCKS, PET_FOODS,
PET_HOMES, PET_WEARS).  PET_BLESS is protected and is not touched.
"""
import io, re, sys

errors = []


def q(t):
    return "'" + t.replace('\\', '\\\\').replace("'", "\\'") + "'"


def arr(xs):
    return '[' + ', '.join(q(x) for x in xs) + ']'


def obj_end(s, pos):
    """pos is the index of an opening { or [. Returns the index of its match."""
    depth = 0
    i = pos
    n = len(s)
    while i < n:
        c = s[i]
        if c == "'" or c == '"':
            quote = c
            i += 1
            while i < n and s[i] != quote:
                if s[i] == '\\':
                    i += 1
                i += 1
        elif c in '{[':
            depth += 1
        elif c in '}]':
            depth -= 1
            if depth == 0:
                return i
        i += 1
    raise ValueError('unbalanced from %d' % pos)


def add_de(s, pos, deval):
    """pos = index of the { that opens a { vi:, en: } object. Insert de."""
    close = obj_end(s, pos)
    inner = s[pos + 1:close].rstrip()
    if re.search(r"\bde:", inner):
        return s, False
    return s[:pos + 1] + inner + ', de: ' + deval + ' ' + s[close:], True


def key_at(s, key, frm, upto=None):
    """Index of the { opening `key: {` at or after frm."""
    m = re.compile(r'\b' + key + r':\s*\{').search(s, frm, upto if upto is not None else len(s))
    return m.end() - 1 if m else -1


# ============================== config.js ==============================
p = 'src/config.js'
s = io.open(p, encoding='utf-8').read()

for key, de in [('tzLabel', 'vietnamesische Zeit'), ('tagline', 'Zuhören und verstehen')]:
    i = key_at(s, key, 0)
    if i < 0:
        errors.append('config.js: %s not found' % key)
    else:
        s, ok = add_de(s, i, q(de))
        if not ok:
            errors.append('config.js: %s already has de' % key)

INTERESTS_DE = {
    'love': 'Liebe', 'ex': 'Ex-Partner', 'crush': 'Crush / Kennenlernphase', 'work': 'Arbeit',
    'study': 'Lernen', 'money': 'Geld', 'astro': 'Astrologie', 'tarot': 'Tarot lernen',
    'lenormand': 'Lenormand', 'manifest': 'Manifestation', 'fortune': 'Divination'
}
n = [0]


def interest(m):
    d = INTERESTS_DE.get(m.group(1))
    if d is None:
        errors.append('config.js: no German interest %s' % m.group(1))
        return m.group(0)
    n[0] += 1
    return m.group(0)[:-len(m.group(2)) - 2].rstrip() + ', de: ' + q(d) + ' }' + m.group(2)


s = re.sub(r"^  \{ id: '(\w+)', vi: '(?:[^'\\]|\\.)*', en: '(?:[^'\\]|\\.)*' \}(,?)$",
           interest, s, flags=re.M)
if n[0] != 11:
    errors.append('config.js: %d of 11 interests' % n[0])
io.open(p, 'w', encoding='utf-8', newline='').write(s)

# ============================== strings.js TOPICS ==============================
TOPICS_DE = {
    1: ('Aktuelle Beziehung', ['Welche Energie prägt diese Beziehung gerade?', 'Was empfindet diese Person im Moment für mich?', 'Wie sieht sie mich und diese Beziehung?', 'Was ist derzeit das größte Hindernis zwischen uns?', 'Wie könnte sich die Beziehung in den nächsten 1–3 Monaten entwickeln?']),
    2: ('Ex-Partner', ['Was denkt diese Person im Moment über mich?', 'Hat sie noch Gefühle für mich?', 'Warum hat sie bisher keinen Kontakt aufgenommen?', 'Besteht die Möglichkeit, dass wir wieder Kontakt haben oder uns sehen?', 'Sollte ich weiter warten oder loslassen?']),
    3: ('Crush / Kennenlernphase', ['Was empfindet diese Person für mich?', 'Hat sie meine Gefühle bemerkt?', 'Welche Absicht hat sie mir gegenüber?', 'Was hindert diese Verbindung gerade daran, sich weiterzuentwickeln?', 'Wie wahrscheinlich ist es, dass wir in nächster Zeit ein Paar werden?']),
    4: ('Arbeit', ['Wo stehe ich beruflich gerade?', 'Welche Stärke sollte ich jetzt nutzen?', 'Was ist derzeit mein größtes Hindernis bei der Arbeit?', 'Welche bemerkenswerte Chance könnte sich bald zeigen?', 'Was kann ich tun, um mich beruflich besser weiterzuentwickeln?']),
    5: ('Lernen', ['Wie läuft mein Lernen im Moment?', 'Welche Schwäche beeinträchtigt meine Ergebnisse gerade?', 'Welche Stärke sollte ich nutzen?', 'Welcher Lernweg passt besser zu mir?', 'Was sollte ich verändern, um bessere Ergebnisse zu erzielen?'])
}
p = 'src/strings.js'
s = io.open(p, encoding='utf-8').read()
start = s.find('const TOPICS = [')
if start < 0:
    errors.append('strings.js: TOPICS not found')
else:
    end = obj_end(s, s.index('[', start))
    block = s[start:end + 1]
    for tid in sorted(TOPICS_DE, reverse=True):
        m = re.search(r"\{ id: %d, icon:" % tid, block)
        if not m:
            errors.append('strings.js: TOPICS %d not found' % tid)
            continue
        name, qs = TOPICS_DE[tid]
        i = key_at(block, 'q', m.start())
        block, ok = add_de(block, i, arr(qs))
        if not ok:
            errors.append('strings.js: TOPICS %d q already de' % tid)
        i = key_at(block, 'name', m.start())
        block, ok = add_de(block, i, q(name))
        if not ok:
            errors.append('strings.js: TOPICS %d name already de' % tid)
    s = s[:start] + block + s[end + 1:]
io.open(p, 'w', encoding='utf-8', newline='').write(s)

# ============================== services.js ==============================
SERVICES_DE = {
    'tarot': {'name': 'Tarot', 'tagline': 'Wenn du eine Frage hast, kann Tarot dir eine neue Perspektive darauf geben.',
              'packages': {'yn': '1 Ja/Nein-Frage', 'q1': '1 ausführliche Frage', 'q3': '3 ausführliche Fragen', 'topic': '1 festes Thema (aus 5 Themen wählen)', 't40': '40 Minuten'}},
    'lenormand': {'name': 'Lenormand', 'tagline': 'Konkrete Frage, konkrete Deutung.',
                  'packages': {'yn': '1 Ja/Nein-Frage', 'q1': '1 ausführliche Frage', 'q3': '3 ausführliche Fragen', 'topic': '1 festes Thema (aus 5 Themen wählen)', 't40': '40 Minuten'}},
    'tea': {'name': 'Teeblattdeutung', 'tagline': 'Eine Tasse Tee, eine kleine Geschichte.',
            'packages': {'q1': '1 Frage', 'q3': '3 Fragen', 't30': '30 Minuten'}},
    'tarot-oracle': {'name': 'Tarot + Oracle', 'tagline': 'Tarot deutet die Frage, Oracle gibt eine zusätzliche Botschaft.',
                     'packages': {'q1': '1 ausführliche Frage', 'q3': '3 ausführliche Fragen', 'topic': '1 festes Thema (aus 5 Themen wählen)', 't60': '60 Minuten'}},
    'lenormand-oracle': {'name': 'Lenormand + Oracle', 'tagline': 'Eine konkrete Deutung, ergänzt um eine Botschaft.',
                         'packages': {'q1': '1 ausführliche Frage', 'q3': '3 ausführliche Fragen', 'topic': '1 festes Thema (aus 5 Themen wählen)', 't60': '60 Minuten'}},
    'tuvi': {'name': 'Tử vi (vietnamesische Astrologie)', 'tagline': 'Nicht nur der heutige Tag, sondern der längere Weg.',
             'note': 'Benötigt dein genaues Geburtsdatum und möglichst die genaue Geburtszeit.',
             'packages': {'one': '1 Thema', 'year': 'Das kommende Jahr', 'all': 'Gesamtüberblick'}},
    'talk': {'name': 'Einfach reden', 'tagline': 'Keine Kartenlegung, keine Vorhersagen – einfach ein offenes Ohr.',
             'packages': {'t30': '30 Minuten', 't60': '1 Stunde'}}
}

COURSES_DE = {
    'tarot': {'sum': '78 Karten, 8 Legungen und ausführliche Guides.', 'name': 'Tarot-Kurs',
              'blurb': 'Alle 78 Karten mit Bild, Stichworten, aufrechter und umgekehrter Bedeutung sowie Deutungen für Liebe, Arbeit, Lernen und Geld. Dazu häufige Fragen, 8 Legungen und ausführliche Guides.',
              'includes': ['78 Karten, jede mit eigener Seite', '8 Legungen mit Diagrammen', 'Guides: Einstieg, umgekehrte Karten, Hofkarten', '6 Monate Zugriff, auch offline']},
    'lenormand': {'sum': '36 Karten, 7 Legungen und Kartenkombinationen.', 'name': 'Lenormand-Kurs',
                  'blurb': 'Alle 36 Karten mit Bild, Grundton, Kernbedeutung sowie Deutungen für Liebe, Arbeit, Personen, Zeit und Kartenpaare. Dazu 7 Legungen und ausführliche Guides.',
                  'includes': ['36 Karten, jede mit eigener Seite', 'Häufige Kartenpaare', '7 Legungen inklusive Grand Tableau', '6 Monate Zugriff, auch offline']},
    'playing': {'sum': '52 Spielkarten, 9 Lektionen und 4 Legungen.', 'name': 'Kurs Kartenlegen mit Spielkarten',
                'blurb': 'Traditionelles Kartenlegen mit 52 Spielkarten: vier Farben, die Entwicklung vom Ass bis zur Zehn, 12 Hofkarten, Kartenpaare, Zeitdeutung und vier Legungen. Jede Karte zeigt ihre traditionelle Bedeutung, den Hintergrund dieser Deutung und die Tarot-Entsprechung.',
                'includes': ['9 bebilderte Lektionen', '52 Karten, jede mit eigener Seite', 'Kartenpaare, Zeitdeutung und Wunschlegung', '6 Monate Zugriff, auch offline']},
    'manifest': {'sum': '7 Methoden, jeweils mit einem Werkzeug zum Ausprobieren.', 'name': 'Manifestation-Set',
                 'blurb': 'Sieben Methoden mit Werkzeugen direkt in der App: WOOP, Vision Board mit Bildern, Mondrituale, Wenn-dann-Pläne, Loslassen, Grenzen sowie Kerzen und Steine. Deine Einträge werden auf deinem Gerät gespeichert und können jederzeit gelöscht oder neu begonnen werden.',
                 'includes': ['7 vertiefende Guides', 'Vision Board, Pläne, Rituale und Loslassen', 'Kerzen und Steine nach Absicht', '12 Monate Zugriff, auch offline']},
    'plus': {'sum': 'Unbegrenzt Münze werfen und den Botschaftsbaum schütteln – plus alle Designs.', 'name': 'Nabu Plus',
             'blurb': 'Nabu Plus schaltet alle Bereiche außerhalb der Begleiterwelt frei. Du kannst die Münze und den Botschaftsbaum unbegrenzt nutzen und alle Designs verwenden: Kartenrückseiten, Botschaftsbäume, Münzen und Tagebuchseiten.',
             'includes': ['Unbegrenzte Münzwürfe', 'Unbegrenztes Schütteln des Botschaftsbaums', '3 Kartenrückseiten, 3 Botschaftsbäume, 3 Münzen, 3 Tagebuchseiten', '12 Monate Zugriff']},
    'pro6': {'sum': 'Alles aus Nabu Plus, dazu Begleiter und ihre Gegenstände.', 'name': 'Nabu Pro · 6 Monate',
             'blurb': 'Nabu Pro enthält alles aus Nabu Plus und zusätzlich die Begleiterwelt: zwölf mythische Begleiter, bis zu sechs gleichzeitig, alle Futtersorten, Zuhause und Kleidungsstücke, nur zwei statt sechs Stunden Wartezeit zwischen den Mahlzeiten und doppelte Erfahrungspunkte.',
             'includes': ['Alle Vorteile von Nabu Plus', '12 Begleiter, bis zu 6 gleichzeitig', '9 Futtersorten, 8 Zuhause, 9 Kleidungsstücke', '2 Stunden zwischen Mahlzeiten, 3 Spiele pro Tag, doppelte Erfahrungspunkte', 'Gutscheine mit 15 % und 20 % Rabatt', '6 Monate Zugriff']},
    'pro': {'sum': 'Dieselben Vorteile wie im 6-Monats-Paket, für ein ganzes Jahr und 49.000đ günstiger als zweimal 6 Monate.', 'name': 'Nabu Pro · 12 Monate',
            'blurb': 'Nabu Pro enthält alles aus Nabu Plus und zusätzlich die Begleiterwelt: zwölf mythische Begleiter, bis zu sechs gleichzeitig, alle Futtersorten, Zuhause und Kleidungsstücke, nur zwei statt sechs Stunden Wartezeit zwischen den Mahlzeiten und doppelte Erfahrungspunkte. Die Jahreszahlung ist günstiger als zwei 6-Monats-Pakete.',
            'includes': ['49.000đ günstiger als zweimal 6 Monate', 'Alle Vorteile von Nabu Plus', '12 Begleiter, bis zu 6 gleichzeitig', '9 Futtersorten, 8 Zuhause, 9 Kleidungsstücke', '2 Stunden zwischen Mahlzeiten, 3 Spiele pro Tag, doppelte Erfahrungspunkte', 'Gutscheine mit 15 % und 20 % Rabatt', '12 Monate Zugriff']},
    'wedding': {'sum': 'Eine Zeremonie in der App – mit Gästen und Nabu Cupid als Zeremonienmeister.', 'name': 'Hochzeit auf Nabu',
                'blurb': 'Wenn ihr euch über den Roten Faden verlobt habt, könnt ihr eine Zeremonie direkt in der App feiern. Ihr wählt Datum und Uhrzeit, verschickt Einladungen und Nabu Cupid führt euch durch die Zeremonie: Eure Versprechen werden nacheinander gefragt, ihr antwortet vor euren Gästen und werdet anschließend als verheiratet erklärt. Gäste können zuschauen, kostenlose Glückwünsche und Geschenke senden und am Ende beim Brautstraußwurf mitmachen.',
                'includes': ['Eigener Hochzeitsraum zu eurem gewählten Termin', 'Einladungslink für beliebig viele Gäste', 'Nabu Cupid führt durch eure Versprechen', 'Musik und Effekte während der Zeremonie', 'Kostenlose Glückwünsche und Geschenke von Gästen', 'Brautstraußwurf für einen glücklichen Gast', '12 Monate Zeit, die Zeremonie zu feiern']}
}

p = 'src/services.js'
s = io.open(p, encoding='utf-8').read()


def patch_list(s, listname, table, keys, idpat, subkey=None):
    """Walk one top-level array and add `de` to the named keys of every record."""
    start = s.index('const ' + listname + ' = [')
    end = obj_end(s, s.index('[', start))
    block = s[start:end + 1]
    seen = []
    # records are found afresh after every edit, so work from the end backwards
    ids = [m.group(1) for m in re.finditer(idpat, block)]
    for rid in reversed(ids):
        de = table.get(rid)
        if de is None:
            errors.append('%s: no German for %s' % (listname, rid))
            continue
        seen.append(rid)
        m = re.search(idpat.replace(r"([\w-]+)", re.escape(rid)), block)
        rstart = m.start()
        rend = obj_end(block, rstart)
        rec = block[rstart:rend + 1]
        for k in keys:
            if k not in de:
                continue
            i = key_at(rec, k, 0)
            if i < 0:
                errors.append('%s/%s: key %s missing' % (listname, rid, k))
                continue
            val = de[k]
            rec, ok = add_de(rec, i, arr(val) if isinstance(val, list) else q(val))
            if not ok:
                errors.append('%s/%s: %s already de' % (listname, rid, k))
        if subkey:
            for pid, ptext in de[subkey].items():
                pm = re.search(r"\{ id: '%s', name: \{" % re.escape(pid), rec)
                if not pm:
                    errors.append('%s/%s: package %s missing' % (listname, rid, pid))
                    continue
                i = key_at(rec, 'name', pm.start())
                rec, ok = add_de(rec, i, q(ptext))
                if not ok:
                    errors.append('%s/%s/%s already de' % (listname, rid, pid))
        block = block[:rstart] + rec + block[rend + 1:]
    return s[:start] + block + s[end + 1:], seen


s, got = patch_list(s, 'SERVICES', SERVICES_DE, ['name', 'tagline', 'note'],
                    r"\{ id: '([\w-]+)', icon:", subkey='packages')
if len(got) != 7:
    errors.append('SERVICES: %d of 7' % len(got))
s, got = patch_list(s, 'COURSES', COURSES_DE, ['sum', 'name', 'blurb', 'includes'],
                    r"\{ id: '([\w-]+)', kind:")
if len(got) != 8:
    errors.append('COURSES: %d of 8' % len(got))

# BOOK_WHERE: `app` already carries German from an earlier pass; the review file
# supplies the approved wording, so it is replaced rather than left alone.
s = s.replace("de: 'Hier in Nabu Tarot'", "de: 'In Nabu Tarot'", 1)
s = s.replace("de: 'Nabu antwortet direkt in deinem Profil. Du siehst es auf der Website und in der App.'",
              "de: 'Nabu antwortet direkt im Profil. Du kannst die Legung später auf dem Handy und am Computer wieder ansehen.'", 1)
for wid, nm, sub in [('ig', 'Instagram', 'Nabu schreibt dir per Instagram-Direktnachricht.'),
                     ('fb', 'Facebook', 'Nabu schreibt dir über Messenger.')]:
    m = re.search(r"\{ id: '%s', icon:" % wid, s)
    if not m:
        errors.append('BOOK_WHERE: %s missing' % wid)
        continue
    rend = obj_end(s, m.start())
    rec = s[m.start():rend + 1]
    for k, v in [('sub', sub), ('name', nm)]:
        i = key_at(rec, k, 0)
        rec, ok = add_de(rec, i, q(v))
        if not ok:
            errors.append('BOOK_WHERE/%s: %s already de' % (wid, k))
    s = s[:m.start()] + rec + s[rend + 1:]

i = s.index('const PAYMENT_NOTE = {') + len('const PAYMENT_NOTE = ')
s, ok = add_de(s, i, q('Bitte überweise vor der Legung.'))
if not ok:
    errors.append('PAYMENT_NOTE already de')
io.open(p, 'w', encoding='utf-8', newline='').write(s)

# ============================== looks.js ==============================
LOOK_SETS_DE = {
    'cardback': {'moon': 'Goldmond', 'stars': 'Sternenhimmel', 'bloom': 'Damastblüte', 'eye': 'Das sehende Auge'},
    'tree': {'sakura': 'Kirschblüten', 'night': 'Glühwürmchennacht', 'galaxy': 'Galaxienbaum', 'butterfly': 'Schmetterlingsgarten'},
    'coin': {'gold': 'Gold', 'moonsilver': 'Mondsilber', 'rose': 'Roségold', 'obsidian': 'Obsidian'},
    'diary': {'plain': 'Schlichtes Papier', 'ruled': 'Altes Linienpapier', 'floral': 'Blumenrand', 'starry': 'Sternennacht'}
}
p = 'src/looks.js'
s = io.open(p, encoding='utf-8').read()
start = s.index('const LOOK_SETS = {')
end = obj_end(s, s.index('{', start))
block = s[start:end + 1]
done = 0
for setname, table in LOOK_SETS_DE.items():
    sm = re.search(r'\n  %s: \[' % setname, block)
    if not sm:
        errors.append('looks.js: set %s missing' % setname)
        continue
    sstart = block.index('[', sm.start())
    send = obj_end(block, sstart)
    sub = block[sstart:send + 1]
    for lid, de in table.items():
        rm = re.search(r"\{ id: '%s', pro: (?:true|false), name: \{" % lid, sub)
        if not rm:
            errors.append('looks.js: %s/%s missing' % (setname, lid))
            continue
        i = key_at(sub, 'name', rm.start())
        sub, ok = add_de(sub, i, q(de))
        if ok:
            done += 1
        else:
            errors.append('looks.js: %s/%s already de' % (setname, lid))
    block = block[:sstart] + sub + block[send + 1:]
if done != 16:
    errors.append('looks.js: %d of 16 looks' % done)
s = s[:start] + block + s[end + 1:]
io.open(p, 'w', encoding='utf-8', newline='').write(s)

# ============================== love.js ==============================
GIFTS_DE = {'rose': 'Eine rote Rose', 'lotus': 'Eine Lotusblüte', 'daisy': 'Ein Gänseblümchen',
            'tulip': 'Eine Tulpe', 'letter': 'Ein handgeschriebener Brief', 'cake': 'Etwas Süßes',
            'star': 'Ein Stern', 'moon': 'Ein Stück Mond'}
p = 'src/love.js'
s = io.open(p, encoding='utf-8').read()
start = s.index('const GIFTS = [')
end = obj_end(s, s.index('[', start))
block = s[start:end + 1]
done = 0
for gid, de in GIFTS_DE.items():
    m = re.search(r"\{ id: '%s', name: \{" % gid, block)
    if not m:
        errors.append('love.js: gift %s missing' % gid)
        continue
    i = key_at(block, 'name', m.start())
    block, ok = add_de(block, i, q(de))
    if ok:
        done += 1
    else:
        errors.append('love.js: gift %s already de' % gid)
if done != 8:
    errors.append('love.js: %d of 8 gifts' % done)
s = s[:start] + block + s[end + 1:]
io.open(p, 'w', encoding='utf-8', newline='').write(s)

# ============================== pet.js ==============================
PET_NAMES_DE = {
    'cat': 'Mondkatze', 'fox': 'Sternfuchs', 'bunny': 'Wolkenhäschen', 'turtle': 'Jadeschildkröte',
    'deer': 'Sanfter Hirsch', 'swallow': 'Windschwalbe', 'phoenix': 'Phönix',
    'ninetails': 'Neunschwänziger Fuchs', 'dragon': 'Wolkendrache', 'tiger': 'Weißer Tiger',
    'qilin': 'Qilin', 'owl': 'Mondeule', 'pixiu': 'Pixiu', 'toad': 'Geldkröte',
    'crane': 'Weißer Kranich', 'kimquy': 'Goldene Schildkröte', 'pegasus': 'Himmelspferd',
    'eagle': 'Goldener Adler'
}
PET_FOODS_DE = {'rice': 'Weißer Reis', 'carrot': 'Gartenkarotte', 'moon': 'Fünffarbige Reisbällchen',
                'fish': 'Fisch im Bananenblatt', 'honey': 'Waldblütenhonig', 'berry': 'Morgentau-Beeren',
                'cake': 'Vollmondkuchen', 'star': 'Sternenküchlein', 'tea': 'Lotustee mit Morgentau'}
PET_HOMES_DE = {'mat': 'Grasmatte', 'cloud': 'Wolkenhäuschen', 'shrine': 'Kleiner Schrein',
                'moon': 'Mondgarten', 'heaven': 'Himmelstor', 'palace': 'Palast',
                'castle': 'Zauberschloss', 'lotus': 'Lotuspavillon', 'isle': 'Schwebende Insel'}
PET_WEARS_DE = {'none': 'Ohne Accessoire', 'scarf': 'Seidenschal', 'bell': 'Goldglöckchen',
                'crown': 'Blumenkranz', 'hat': 'Mondhut', 'jumper': 'Strickpullover',
                'cloak': 'Sternenumhang', 'armour': 'Goldene Rüstung', 'wings': 'Federflügel'}
LUCKS_DE = {
    'love': ('Liebe', 'Die Mondkatze sitzt bei deinen Herzensdingen und hält dein Herz ein bisschen warm.',
             'Der Phönix lässt Altes hinter sich und erinnert dein Herz daran, dass ein neuer Abschnitt beginnen darf.'),
    'career': ('Arbeit', 'Der Sternfuchs läuft einen Schritt voraus und hält nach einem guten Weg für deine Arbeit Ausschau.',
               'Der Wolkendrache trägt deinen Namen mit dem Wind ein Stück weiter – als kleine Erinnerung daran, deine Arbeit sichtbar zu machen.'),
    'study': ('Lernen', 'Das Wolkenhäschen bleibt bei dir, auch wenn die Seiten heute besonders schwer sind.',
              'Der Qilin steht still neben deinem Schreibtisch und erinnert dich daran, dass jeder kleine Lernschritt zählt.'),
    'money': ('Geld', 'Die Jadeschildkröte geht langsam und erinnert dich daran, gut auf das aufzupassen, was du schon hast.',
              'Der Pixiu gilt traditionell als Symbol dafür, Vermögen zu bewahren – heute darf er einfach neben deinem Sparschwein sitzen.'),
    'health': ('Gesundheit', 'Der Sanfte Hirsch erinnert dich daran, heute ein wenig langsamer zu machen, damit dein Körper mitkommt.',
               'Der Weiße Kranich wacht still über deine Ruhe und erinnert dich daran, dass Erholung genauso wichtig ist wie Weitermachen.'),
    'travel': ('Reisen', 'Die Windschwalbe fliegt weit und findet doch zurück. Sie wünscht dir einen ruhigen Weg und eine sichere Heimkehr.',
               'Das Himmelspferd begleitet in Gedanken alle, die weit reisen – für Arbeit oder zum Vergnügen – und wünscht dir eine sichere Hin- und Rückreise.')
}
PET_LINES_DE = {
    'phoenix': 'Der Phönix lässt Altes hinter sich und erinnert dein Herz daran, dass ein neuer Abschnitt beginnen darf.',
    'ninetails': 'Der Neunschwänzige Fuchs hat neun Schwänze und mindestens neun kleine Tricks, um in Erinnerung zu bleiben.',
    'dragon': 'Der Wolkendrache trägt deinen Namen mit dem Wind ein Stück weiter – als kleine Erinnerung daran, deine Arbeit sichtbar zu machen.',
    'tiger': 'Der Weiße Tiger steht bei schwierigen Gesprächen hinter dir und erinnert dich daran, deinen eigenen Wert nicht kleinzureden.',
    'qilin': 'Der Qilin steht still neben deinem Schreibtisch und erinnert dich daran, dass jeder kleine Lernschritt zählt.',
    'owl': 'Die Mondeule bleibt lange wach und hilft dir, noch einmal auf das zu schauen, was du vielleicht übersehen hast.',
    'pixiu': 'Der Pixiu gilt traditionell als Symbol dafür, Vermögen zu bewahren – heute darf er einfach neben deinem Sparschwein sitzen.',
    'toad': 'Die Geldkröte sitzt mit ihrer goldenen Münze an der Tür und wünscht deinem Zuhause ein kleines bisschen Glück.',
    'crane': 'Der Weiße Kranich wacht still über deine Ruhe und erinnert dich daran, dass Erholung genauso wichtig ist wie Weitermachen.',
    'kimquy': 'Die Goldene Schildkröte hat es nie eilig. Neben ihr darf auch Heilung ihre eigene Zeit brauchen.',
    'pegasus': 'Das Himmelspferd begleitet in Gedanken alle, die weit reisen, und wünscht dir eine sichere Hin- und Rückreise.',
    'eagle': 'Der Goldene Adler blickt weit über den Weg hinaus und erinnert dich daran, vor dem Aufbruch noch einmal auf die Richtung zu schauen.'
}
# The targeted VI/EN polish the review file asks for at the end of 29.6.
PET_LINES_VIEN = {
    'tiger': ('Bạch Hổ đứng sau lưng bạn trong những cuộc thương lượng khó, nhắc bạn đừng tự hạ thấp giá trị của mình.',
              'The white tiger stands behind you in difficult negotiations and reminds you not to make yourself smaller.'),
    'qilin': ('Kỳ Lân đứng cạnh bàn học, nhắc bạn rằng mỗi bước nhỏ đều được tính.',
              'The qilin stands beside your desk and reminds you that every small step of learning counts.'),
    'pixiu': ('Tỳ Hưu vốn là biểu tượng giữ tài lộc, hôm nay cứ để bạn ấy ngồi cạnh chiếc ví của bạn.',
              'The pixiu is traditionally a symbol of keeping wealth; today, let it sit beside your wallet.'),
    'toad': ('Thiềm Thừ ngậm đồng tiền vàng ngay cửa, gửi một chút may mắn vào căn nhà của bạn.',
             'The money toad sits at the door with a gold coin and sends a little luck into your home.'),
    'crane': ('Bạch Hạc đứng canh giấc ngủ, nhắc bạn rằng nghỉ ngơi cũng quan trọng như cố gắng.',
              'The white crane watches over your sleep and reminds you that rest matters as much as effort.'),
    'kimquy': ('Kim Quy chẳng bao giờ vội. Ở cạnh bạn ấy, mọi điều cũng được phép lành lại theo nhịp riêng.',
               'The golden turtle is never in a hurry. Beside it, everything is allowed to heal in its own time.'),
    'eagle': ('Đại Bàng Vàng nhìn xa trên cả chặng đường, nhắc bạn xem lại phương hướng trước khi cất bước.',
              'The golden eagle looks far along the road and reminds you to check your direction before setting out.')
}

p = 'src/pet.js'
s = io.open(p, encoding='utf-8').read()


def patch_map(s, mapname, table, expect):
    """A `const NAME = { key: { vi, en }, ... }` map."""
    start = s.index('const ' + mapname + ' = {')
    end = obj_end(s, s.index('{', start))
    block = s[start:end + 1]
    done = 0
    for k, de in table.items():
        m = re.search(r"\n  %s: \{" % re.escape(k), block)
        if not m:
            errors.append('%s: %s missing' % (mapname, k))
            continue
        i = block.index('{', m.start() + 1)
        block, ok = add_de(block, i, q(de))
        if ok:
            done += 1
        else:
            errors.append('%s: %s already de' % (mapname, k))
    if done != expect:
        errors.append('%s: %d of %d' % (mapname, done, expect))
    return s[:start] + block + s[end + 1:]


def patch_items(s, listname, table, expect):
    """A `const NAME = [ { id, ..., name: { vi, en } } ]` list."""
    start = s.index('const ' + listname + ' = [')
    end = obj_end(s, s.index('[', start))
    block = s[start:end + 1]
    done = 0
    for k, de in table.items():
        m = re.search(r"\{ id: '%s', pro:" % re.escape(k), block)
        if not m:
            errors.append('%s: %s missing' % (listname, k))
            continue
        i = key_at(block, 'name', m.start())
        block, ok = add_de(block, i, q(de))
        if ok:
            done += 1
        else:
            errors.append('%s: %s already de' % (listname, k))
    if done != expect:
        errors.append('%s: %d of %d' % (listname, done, expect))
    return s[:start] + block + s[end + 1:]


s = patch_map(s, 'PET_NAMES', PET_NAMES_DE, 18)

# PET_LINES: the seven revised VI/EN pairs first, then German for all twelve.
start = s.index('const PET_LINES = {')
end = obj_end(s, s.index('{', start))
block = s[start:end + 1]
for k, (vi, en) in PET_LINES_VIEN.items():
    m = re.search(r"\n  %s: \{ vi: '((?:[^'\\]|\\.)*)', en: '((?:[^'\\]|\\.)*)' \}" % k, block)
    if not m:
        errors.append('PET_LINES: %s not matched for VI/EN revision' % k)
        continue
    block = block[:m.start()] + "\n  %s: { vi: %s, en: %s }" % (k, q(vi), q(en)) + block[m.end():]
s = s[:start] + block + s[end + 1:]
s = patch_map(s, 'PET_LINES', PET_LINES_DE, 12)

# LUCKS: name, line and proLine on each of the six.
start = s.index('const LUCKS = {')
end = obj_end(s, s.index('{', start))
block = s[start:end + 1]
for k, (nm, line, pro) in LUCKS_DE.items():
    m = re.search(r"\n  %s: \{" % k, block)
    if not m:
        errors.append('LUCKS: %s missing' % k)
        continue
    rstart = block.index('{', m.start() + 1)
    rend = obj_end(block, rstart)
    rec = block[rstart:rend + 1]
    for key, val in [('proLine', pro), ('line', line), ('name', nm)]:
        i = key_at(rec, key, 0)
        if i < 0:
            errors.append('LUCKS/%s: %s missing' % (k, key))
            continue
        rec, ok = add_de(rec, i, q(val))
        if not ok:
            errors.append('LUCKS/%s: %s already de' % (k, key))
    block = block[:rstart] + rec + block[rend + 1:]
s = s[:start] + block + s[end + 1:]

s = patch_items(s, 'PET_FOODS', PET_FOODS_DE, 9)
s = patch_items(s, 'PET_HOMES', PET_HOMES_DE, 9)
s = patch_items(s, 'PET_WEARS', PET_WEARS_DE, 9)
io.open(p, 'w', encoding='utf-8', newline='').write(s)

if errors:
    sys.stderr.write('\n'.join(errors) + '\n')
    sys.exit(1)
print('29.6 applied: config, TOPICS, services, looks, love, pet')
