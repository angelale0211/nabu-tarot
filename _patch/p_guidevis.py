# -*- coding: utf-8 -*-
"""guide-visuals.js, section 30.6: TV() gains a German arm, and the direct
two-way ternaries get a German branch."""
import io, re, sys

p = 'src/guide-visuals.js'
s = io.open(p, encoding='utf-8').read()
errors = []

# ---- TV() itself ----
old = "const TV = (vi, en) => lang === 'vi' ? vi : en;"
new = "const TV = (vi, en, de) => lang === 'vi' ? vi : (lang === 'de' ? (de === undefined ? en : de) : en);"
if s.count(old) != 1:
    errors.append('TV definition not found once')
else:
    s = s.replace(old, new)

# ---- every VI/EN pair used in a TV() call, with its German ----
DE = {
 'Write yours here…': 'Schreib hier…',
 'Your three intentions': 'Deine drei Absichten',
 'I am…': 'ich …',
 'What I release this time': 'Was ich dieses Mal loslasse',
 'write it, then tear it up…': 'schreib es auf und zerreiß es dann…',
 'Tear it up': 'Zerreißen',
 'What I let go of today': 'Was ich heute loslasse',
 'a person, a matter, an expectation…': 'eine Person, eine Sache, eine Erwartung…',
 'White': 'Weiß',
 'any intention, cleansing': 'jede Absicht, Reinigung',
 'Green': 'Grün',
 'money, growth': 'Geld, Wachstum',
 'Pink': 'Rosa',
 'love, self-love': 'Liebe, Selbstliebe',
 'Red': 'Rot',
 'passion, courage': 'Leidenschaft, Mut',
 'Yellow': 'Gelb',
 'success, confidence': 'Erfolg, Selbstvertrauen',
 'Purple': 'Violett',
 'intuition, spirit': 'Intuition, Spiritualität',
 'Blue': 'Blau',
 'calm, healing': 'Ruhe, Heilung',
 'Orange': 'Orange',
 'creativity': 'Kreativität',
 'Black': 'Schwarz',
 'protection, release': 'Schutz, Loslassen',
 'Rose quartz': 'Rosenquarz',
 'love, gentleness': 'Liebe, Sanftheit',
 'abundance, joy': 'Fülle, Freude',
 'Clear quartz': 'Bergkristall',
 'amplify, clarity': 'Verstärkung, Klarheit',
 'Amethyst': 'Amethyst',
 'calm, intuition': 'Ruhe, Intuition',
 'Green aventurine': 'Grüner Aventurin',
 'luck, chances': 'Glück, Chancen',
 'money, will': 'Geld, Willenskraft',
 'Black tourmaline': 'Schwarzer Turmalin',
 'protection': 'Schutz',
 'cleanses other stones': 'reinigt andere Steine',
 'energy, courage': 'Energie, Mut',
 'Moonstone': 'Mondstein',
 'new beginnings': 'Neuanfang',
 'Candles by colour': 'Kerzen nach Farbe',
 'Stones by purpose': 'Steine nach Absicht',
 'Wish': 'Wunsch',
 'Outcome': 'Ergebnis',
 'Obstacle': 'Hindernis',
 'Plan': 'Plan',
 'Love': 'Liebe',
 'Work and money': 'Arbeit und Geld',
 'Health': 'Gesundheit',
 'Family and friends': 'Familie und Freunde',
 'Learning': 'Lernen',
 'Rest': 'Erholung',
 'New Moon: plant': 'Neumond: säen',
 'write 3 intentions · read aloud · put away': '3 Absichten aufschreiben · laut lesen · weglegen',
 'days': 'Tage',
 'Full Moon: release': 'Vollmond: loslassen',
 'reread · note the lesson · tear up the release note': 'noch einmal lesen · Erkenntnis notieren · Loslass-Zettel zerreißen',
 'Three New Moon intentions': 'Drei Absichten zum Neumond',
 'If it is 7 a.m. on Monday': 'Wenn Montag um 7 Uhr ist',
 'then I open the application': 'dann öffne ich meine Bewerbung',
 'If I reach for the phone after dinner': 'Wenn ich nach dem Abendessen zum Handy greife',
 'then I put my shoes on first': 'dann ziehe ich zuerst meine Schuhe an',
 'If I feel scared before the call': 'Wenn ich vor dem Anruf Angst bekomme',
 'then I take 3 breaths and dial': 'dann atme ich dreimal tief durch und wähle',
 'Morning': 'Morgen',
 'Afternoon': 'Nachmittag',
 'Night': 'Abend',
 'Tap once for each line you write. Resets every day.': 'Nach jeder geschriebenen Zeile einmal tippen. Wird täglich auf null zurückgesetzt.',
 'Three things I am grateful for today': 'Drei Dinge, für die ich heute dankbar bin',
 'be specific…': 'bitte konkret…',
}

STR = r"'((?:[^'\\]|\\.)*)'"
call = re.compile(r"TV\(" + STR + r", *" + STR + r"\)")
seen, unknown = set(), set()


def fill(m):
    vi, en = m.group(1), m.group(2)
    if en not in DE:
        unknown.add(en)
        return m.group(0)
    seen.add(en)
    de = DE[en].replace("'", "\\'")
    return "TV('%s', '%s', '%s')" % (vi, en, de)


s = call.sub(fill, s)
if unknown:
    errors.append('TV pairs with no German: ' + ' | '.join(sorted(unknown)))
unused = sorted(set(DE) - seen)
if unused:
    errors.append('German supplied but never used: ' + ' | '.join(unused))

# ---- direct ternaries ----
DIRECT = [
 ("esc(lang === 'vi' ? 'một cảnh, nhiều tầng' : 'a scene, many layers')",
  "esc(lang === 'vi' ? 'một cảnh, nhiều tầng' : (lang === 'de' ? 'eine Szene, viele Ebenen' : 'a scene, many layers'))"),
 ("esc(lang === 'vi' ? 'một vật, một từ' : 'one thing, one word')",
  "esc(lang === 'vi' ? 'một vật, một từ' : (lang === 'de' ? 'ein Gegenstand, ein Wort' : 'one thing, one word'))"),
 ("lang === 'vi' ? 'Mặt Trời' : 'Sun'", "lang === 'vi' ? 'Mặt Trời' : (lang === 'de' ? 'Sonne' : 'Sun')"),
 ("lang === 'vi' ? 'nhập ngày sinh' : 'add your birthday'", "lang === 'vi' ? 'nhập ngày sinh' : (lang === 'de' ? 'Geburtstag eintragen' : 'add your birthday')"),
 ("lang === 'vi' ? 'Mặt Trăng' : 'Moon'", "lang === 'vi' ? 'Mặt Trăng' : (lang === 'de' ? 'Mond' : 'Moon')"),
 ("lang === 'vi' ? 'cần giờ sinh' : 'needs birth time'", "lang === 'vi' ? 'cần giờ sinh' : (lang === 'de' ? 'Geburtszeit nötig' : 'needs birth time')"),
 ("lang === 'vi' ? 'Mọc' : 'Rising'", "lang === 'vi' ? 'Mọc' : (lang === 'de' ? 'Aszendent' : 'Rising')"),
 ("lang === 'vi' ? 'cần giờ + nơi sinh' : 'needs time + place'", "lang === 'vi' ? 'cần giờ + nơi sinh' : (lang === 'de' ? 'Geburtszeit + Geburtsort nötig' : 'needs time + place')"),
 ("esc(lang === 'vi' ? 'Hôm nay: ' : 'Today: ')", "esc(lang === 'vi' ? 'Hôm nay: ' : (lang === 'de' ? 'Heute: ' : 'Today: '))"),
 ("lang === 'vi' ? 'nhìn từ Trái Đất' : 'seen from Earth'", "lang === 'vi' ? 'nhìn từ Trái Đất' : (lang === 'de' ? 'von der Erde aus gesehen' : 'seen from Earth')"),
 ("lang === 'vi' ? 'có vẻ đi lùi' : 'appears to go backwards'", "lang === 'vi' ? 'có vẻ đi lùi' : (lang === 'de' ? 'scheint rückwärtszulaufen' : 'appears to go backwards')"),
]
for old, new in DIRECT:
    if s.count(old) != 1:
        errors.append('DIRECT %d :: %s' % (s.count(old), old[:80]))
    else:
        s = s.replace(old, new)

io.open(p, 'w', encoding='utf-8', newline='').write(s)
if errors:
    sys.stderr.write('\n'.join(errors) + '\n'); sys.exit(1)
print('guide-visuals.js: %d TV pairs localized, %d direct ternaries' % (len(seen), len(DIRECT)))
