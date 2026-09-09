# -*- coding: utf-8 -*-
"""Soft hyphens in the long German design names.

`hyphens: auto` only works where the browser carries a hyphenation dictionary
for the language. Safari has German; the Chromium used to measure this layout
does not, and Chrome on Android may not either, so a compound noun in a narrow
tile breaks with no hyphen at all — Kirschblüt / en.

A soft hyphen (U+00AD) does not depend on any dictionary. It is invisible
until the line actually breaks there, and then it prints as a hyphen. So the
seams of the compounds that have to break are marked by hand, once. Vietnamese
and English are untouched: none of their names are long enough to break.
"""
import io, sys

P = 'src/looks.js'
SHY = '­'
SEAMS = {
    'Goldmond': 'Gold|mond',
    'Sternenhimmel': 'Ster|nen|him|mel',
    'Damastblüte': 'Damast|blüte',
    'Kirschblüten': 'Kirsch|blüten',
    'Glühwürmchennacht': 'Glüh|würm|chen|nacht',
    'Galaxienbaum': 'Ga|la|xien|baum',
    'Schmetterlingsgarten': 'Schmet|ter|lings|gar|ten',
    'Mondsilber': 'Mond|silber',
    'Roségold': 'Rosé|gold',
    'Obsidian': 'Obsi|dian',
    'Altes Linienpapier': 'Altes Linien|papier',
    'Blumenrand': 'Blumen|rand',
    'Sternennacht': 'Sternen|nacht',
}

s = io.open(P, encoding='utf-8').read()
if SHY in s:
    print('looks.js: the soft hyphens are already there')
    sys.exit(0)

errors = []
done = 0
for word, seam in SEAMS.items():
    old = "de: '%s'" % word
    if s.count(old) != 1:
        errors.append('%d matches for %s' % (s.count(old), word))
        continue
    s = s.replace(old, "de: '%s'" % seam.replace('|', SHY), 1)
    done += 1

io.open(P, 'w', encoding='utf-8', newline='').write(s)
if errors:
    sys.stderr.write('\n'.join(errors) + '\n')
    sys.exit(1)
print('looks.js: %d German design names carry their break points' % done)
