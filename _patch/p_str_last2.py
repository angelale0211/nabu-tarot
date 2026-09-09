# -*- coding: utf-8 -*-
"""Two more English leftovers in STR.de that the leaf audit turned up."""
import io, sys
sys.path.insert(0, '_patch')
from str_lib import blocks, find_key

P = 'src/strings.js'
s = io.open(P, encoding='utf-8').read()

pairs = [('accessOnTitle', "(n) => 'Unlocked: ' + n", "(n) => 'Freigeschaltet: ' + n"),
         ('wedAskDone', "(n) => 'Invited ' + n", "(n) => n + ' eingeladen'")]
for key, old, new in pairs:
    i = find_key(s, blocks(s)['de'], key)
    if not s.startswith(old, i):
        sys.stderr.write('%s: unexpected value %r\n' % (key, s[i:i + 40]))
        sys.exit(1)
    s = s[:i] + new + s[i + len(old):]

io.open(P, 'w', encoding='utf-8', newline='').write(s)
print('accessOnTitle and wedAskDone are German now')
