# -*- coding: utf-8 -*-
"""Which section-2 keys are plain strings and which need hand shaping."""
import io, os, re, sys
sys.path.insert(0, '_patch')
from str_lib import blocks, find_key

SPEC = os.path.expanduser('~/Downloads/NABU_TEXT_REVIEW_100_PERCENT_COMPLETE.md')
spec = io.open(SPEC, encoding='utf-8').read()
sec = spec[spec.index('# 2. `src/strings.js`'):spec.index('### Notes for dynamic placeholders')]
rows = [m.groups() for m in re.finditer(r'^\| `([^`]+)` \| (.*?) \| (.*?) \| (.*?) \|$', sec, re.M)]

src = io.open('src/strings.js', encoding='utf-8').read()
bl = blocks(src)
plain, other = [], []
for key, vi, en, de in rows:
    base = re.split(r'[.(\[]', key)[0]
    kinds = set()
    for lg, span in bl.items():
        i = find_key(src, span, base)
        kinds.add('str' if src[i] in "'\"" else src[i])
    (plain if kinds == {'str'} and key == base else other).append((key, kinds))
print('plain string keys: %d' % len(plain))
print('needing shaping: %d' % len(other))
for k, kinds in other:
    print('   %-22s %s' % (k, sorted(kinds)))
