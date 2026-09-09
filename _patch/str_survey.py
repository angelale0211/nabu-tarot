# -*- coding: utf-8 -*-
"""Show how every key named in review section 2 is currently written in each
of the three STR blocks, so the replacement can be shaped per key."""
import io, os, re

SPEC = os.path.expanduser('~/Downloads/NABU_TEXT_REVIEW_100_PERCENT_COMPLETE.md')
spec = io.open(SPEC, encoding='utf-8').read()
sec = spec[spec.index('# 2. `src/strings.js`'):spec.index('### Notes for dynamic placeholders')]
rows = []
for line in sec.split('\n'):
    m = re.match(r'^\| `([^`]+)` \| (.*?) \| (.*?) \| (.*?) \|$', line)
    if m:
        rows.append(m.groups())
print('rows in section 2:', len(rows))

src = io.open('src/strings.js', encoding='utf-8').read()
blocks = {}
for lg in ('vi', 'en', 'de'):
    a = src.index('\n  %s: {' % lg)
    depth = 0
    i = src.index('{', a)
    while True:
        c = src[i]
        if c == "'":
            i += 1
            while src[i] != "'":
                if src[i] == '\\':
                    i += 1
                i += 1
        elif c in '{[':
            depth += 1
        elif c in '}]':
            depth -= 1
            if depth == 0:
                break
        i += 1
    blocks[lg] = (a, i)

for key, vi, en, de in rows:
    base = re.split(r'[.(\[]', key)[0]
    found = {}
    for lg, (a, b) in blocks.items():
        m = re.search(r'(?<![\w.])%s: ' % re.escape(base), src[a:b])
        if not m:
            found[lg] = None
            continue
        line = src[a + m.start():src.index('\n', a + m.end())]
        found[lg] = line.strip()
    if not all(found.values()):
        print('MISSING', key, {k: (v is None) for k, v in found.items()})
    else:
        print('---', key)
        for lg in ('vi', 'en', 'de'):
            print('   %s %s' % (lg, found[lg][:190]))
