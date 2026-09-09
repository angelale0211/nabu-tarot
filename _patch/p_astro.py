# -*- coding: utf-8 -*-
"""astro.js, sections 27 + 30.1: German names/labels for the shared tables, and
German date ranges and titles on every decan so learn.js never falls back."""
import io, re, sys

p = 'src/astro.js'
s = io.open(p, encoding='utf-8').read()
errors = []

SIGN_DE = {
 'ari': ('Widder', '21. März – 19. April'), 'tau': ('Stier', '20. April – 20. Mai'),
 'gem': ('Zwillinge', '21. Mai – 20. Juni'), 'can': ('Krebs', '21. Juni – 22. Juli'),
 'leo': ('Löwe', '23. Juli – 22. August'), 'vir': ('Jungfrau', '23. August – 22. September'),
 'lib': ('Waage', '23. September – 22. Oktober'), 'sco': ('Skorpion', '23. Oktober – 21. November'),
 'sag': ('Schütze', '22. November – 21. Dezember'), 'cap': ('Steinbock', '22. Dezember – 19. Januar'),
 'aqu': ('Wassermann', '20. Januar – 18. Februar'), 'pis': ('Fische', '19. Februar – 20. März'),
}
PLANET_DE = {'sun': 'Sonne', 'moo': 'Mond', 'mer': 'Merkur', 'ven': 'Venus', 'mar': 'Mars',
             'jup': 'Jupiter', 'sat': 'Saturn', 'ura': 'Uranus', 'nep': 'Neptun', 'plu': 'Pluto'}
ELEM_DE = {'fire': 'Feuer', 'water': 'Wasser', 'air': 'Luft', 'earth': 'Erde'}
MODE_DE = {'card': 'Kardinal', 'fix': 'Fix', 'mut': 'Veränderlich'}
PIP_DE = {'h': 'Herz', 'd': 'Karo', 'c': 'Kreuz', 's': 'Pik'}

DECAN_DE = {
 'wands-2': 'Herrschaft', 'wands-3': 'Gefestigte Stärke', 'wands-4': 'Vollendetes Werk',
 'wands-5': 'Streit', 'wands-6': 'Sieg', 'wands-7': 'Tapferkeit', 'wands-8': 'Schnelligkeit',
 'wands-9': 'Große Stärke', 'wands-10': 'Unterdrückung',
 'cups-2': 'Liebe', 'cups-3': 'Fülle', 'cups-4': 'Gemischte Freude', 'cups-5': 'Verlust in der Freude',
 'cups-6': 'Freude', 'cups-7': 'Illusorischer Erfolg', 'cups-8': 'Aufgegebener Erfolg',
 'cups-9': 'Materielles Glück', 'cups-10': 'Beständiger Erfolg',
 'swords-2': 'Wiederhergestellter Frieden', 'swords-3': 'Kummer', 'swords-4': 'Ruhe nach dem Streit',
 'swords-5': 'Niederlage', 'swords-6': 'Erarbeiteter Erfolg', 'swords-7': 'Unbeständige Anstrengung',
 'swords-8': 'Eingeschränkte Kraft', 'swords-9': 'Verzweiflung und Grausamkeit', 'swords-10': 'Ruin',
 'pentacles-2': 'Harmonischer Wandel', 'pentacles-3': 'Materielles Wirken', 'pentacles-4': 'Irdische Macht',
 'pentacles-5': 'Materielle Schwierigkeiten', 'pentacles-6': 'Materieller Erfolg',
 'pentacles-7': 'Unerfüllter Erfolg', 'pentacles-8': 'Umsicht', 'pentacles-9': 'Materieller Gewinn',
 'pentacles-10': 'Wohlstand',
}
COURT_DE = {
 'wands-c1': 'Prinz der Stäbe', 'wands-c2': 'Königin der Stäbe', 'wands-c3': 'Ritter der Stäbe',
 'cups-c1': 'Prinz der Kelche', 'cups-c2': 'Königin der Kelche', 'cups-c3': 'Ritter der Kelche',
 'swords-c1': 'Prinz der Schwerter', 'swords-c2': 'Königin der Schwerter', 'swords-c3': 'Ritter der Schwerter',
 'pentacles-c1': 'Prinz der Münzen', 'pentacles-c2': 'Königin der Münzen', 'pentacles-c3': 'Ritter der Münzen',
}

MONTH = {'Jan': 'Januar', 'Feb': 'Februar', 'Mar': 'März', 'Apr': 'April', 'May': 'Mai', 'Jun': 'Juni',
         'Jul': 'Juli', 'Aug': 'August', 'Sep': 'September', 'Oct': 'Oktober', 'Nov': 'November', 'Dec': 'Dezember'}


def de_range(en):
    """'21-30 Mar' -> '21.-30. Marz'; '31 Mar - 9 Apr' -> '31. Marz - 9. April'."""
    m = re.match(r'^(\d+)–(\d+) (\w+)$', en)
    if m:
        return '%s.–%s. %s' % (m.group(1), m.group(2), MONTH[m.group(3)])
    m = re.match(r'^(\d+) (\w+) – (\d+) (\w+)$', en)
    if m:
        return '%s. %s – %s. %s' % (m.group(1), MONTH[m.group(2)], m.group(3), MONTH[m.group(4)])
    errors.append('cannot render German date range for %r' % en)
    return en


# ---- ZSIGN ----
def zsign(m):
    k = m.group(1)
    de, dde = SIGN_DE[k]
    return "%s, de:'%s', dde:'%s'}" % (m.group(0)[:-1].rstrip(), de, dde)


n = len(re.findall(r"^  (ari|tau|gem|can|leo|vir|lib|sco|sag|cap|aqu|pis): \{g:.*\},$", s, re.M))
if n != 12:
    errors.append('ZSIGN rows found: %d' % n)
s = re.sub(r"^  (ari|tau|gem|can|leo|vir|lib|sco|sag|cap|aqu|pis): (\{g:.*)\},$",
           lambda m: "  %s: %s, de:'%s', dde:'%s'}," % (m.group(1), m.group(2), SIGN_DE[m.group(1)][0], SIGN_DE[m.group(1)][1]),
           s, flags=re.M)

# ---- ZPLANET / ZELEM / ZMODE / ZPIPSUIT ----
for table, mapping in (('ZPLANET', PLANET_DE), ('ZELEM', ELEM_DE), ('ZMODE', MODE_DE), ('ZPIPSUIT', PIP_DE)):
    mm = re.search(r'^const %s = \{.*?^\};$' % table, s, re.S | re.M)
    if not mm:
        errors.append('%s not found' % table); continue
    blk = mm.group(0)
    for k, de in mapping.items():
        r = re.compile(r"^  %s: (\{.*)\},$" % re.escape(k), re.M)
        if not r.search(blk):
            errors.append('%s.%s not matched' % (table, k)); continue
        blk = r.sub(lambda m, d=de: "  %s: %s, de:'%s'}," % (k, m.group(1), d), blk, count=1)
    s = s[:mm.start()] + blk + s[mm.end():]

# ---- decans: dde + tde ----
def decan(m):
    body, cid = m.group(2), m.group(1)
    den = re.search(r"den:'([^']*)'", body).group(1)
    tde = DECAN_DE.get(cid)
    if not tde:
        errors.append('no German decan title for %s' % cid); return m.group(0)
    return "  '%s': %s, dde:'%s', tde:'%s'}," % (cid, body, de_range(den), tde)


cnt = [0]


def decan_wrap(m):
    cnt[0] += 1
    return decan(m)


s = re.sub(r"^  '([a-z]+-\d+)': (\{k:'decan'.*)\},$", decan_wrap, s, flags=re.M)
if cnt[0] != 36:
    errors.append('decans rewritten: %d of 36' % cnt[0])

# ---- court: German book title (data only; nothing renders bookt today) ----
c2 = [0]


def court(m):
    c2[0] += 1
    cid = m.group(1)
    return "  '%s': %s, booktde:'%s'}," % (cid, m.group(2), COURT_DE[cid])


s = re.sub(r"^  '([a-z]+-c[123])': (\{k:'court'.*)\},$", court, s, flags=re.M)
if c2[0] != 12:
    errors.append('court rows rewritten: %d of 12' % c2[0])

io.open(p, 'w', encoding='utf-8', newline='').write(s)
if errors:
    sys.stderr.write('\n'.join(errors) + '\n'); sys.exit(1)
print('astro.js: 12 signs, planets/elements/modes/suits, 36 decans, 12 court rows')
