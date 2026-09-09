# -*- coding: utf-8 -*-
import io, sys

p = 'src/spreads.js'
s = io.open(p, encoding='utf-8').read()

old = "const SPREADS = { en: [], vi: [] };"
new = "const SPREADS = { en: [], vi: [], de: [] };"
if s.count(old) != 1:
    sys.stderr.write('initializer not found once\n'); sys.exit(1)
s = s.replace(old, new)

if 'SPREADS.de = [' in s:
    sys.stderr.write('SPREADS.de already present\n'); sys.exit(1)

block = io.open('_patch/spreads_de.txt', encoding='utf-8').read()
s = s.rstrip('\n') + '\n' + block

io.open(p, 'w', encoding='utf-8', newline='').write(s)

# sanity: every id in en must exist in de
import re
def ids(name):
    m = re.search(r'SPREADS\.' + name + r' = \[(.*?)\n\];', s, re.S)
    return re.findall(r"id: '([a-z0-9-]+)'", m.group(1))
en, de = ids('en'), ids('de')
print('en ids: %d, de ids: %d' % (len(en), len(de)))
missing = [i for i in en if i not in de]
extra = [i for i in de if i not in en]
print('missing in de:', missing)
print('extra in de:', extra)
