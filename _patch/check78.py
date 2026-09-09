# -*- coding: utf-8 -*-
"""Which of the section-7 and section-8 targeted revisions are already in the
source, in each of the three languages?"""
import io, os, re

SPEC = os.path.expanduser('~/Downloads/NABU_TEXT_REVIEW_100_PERCENT_COMPLETE.md')
spec = io.open(SPEC, encoding='utf-8').read()
src = {}
for f in ('tarot-vi', 'tarot-en', 'tarot-de', 'len-vi', 'len-en', 'len-de'):
    src[f] = io.open('src/%s.js' % f, encoding='utf-8').read()

for title, a, b, files in [
        ('7', '# 7. `src/tarot-vi.js`', '# 8. `src/len-vi.js`', ('tarot-vi', 'tarot-en', 'tarot-de')),
        ('8', '# 8. `src/len-vi.js`', '# 9. `src/fortune.js`', ('len-vi', 'len-en', 'len-de'))]:
    sec = spec[spec.index(a):spec.index(b)]
    rows = [m.groups() for m in re.finditer(r'^\| `([^`]+)` \| (.*?) \| (.*?) \| (.*?) \|$', sec, re.M)]
    print('--- section %s: %d rows ---' % (title, len(rows)))
    for key, vi, en, de in rows:
        marks = []
        for f, text in zip(files, (vi, en, de)):
            hits = sum(text in src[g] for g in src if g.startswith(f.split('-')[0]))
            marks.append('%s=%s' % (f[-2:], 'yes' if text in src[f] or hits else 'NO'))
        print('  %-30s %s' % (key, ' '.join(marks)))
