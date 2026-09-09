# -*- coding: utf-8 -*-
"""kb-questions.js — sections 20 and 22.

Three things happen here:
  1. the 36 Vietnamese answers listed in 20.10-20.13 are replaced;
  2. the 16 court cards get the reviewed Vietnamese copy from section 22;
  3. ASK.en and ASK.de are added for all 78 cards (540 Q&A each).

Every piece of copy is lifted out of the review file verbatim rather than
retyped, so the source ends up with exactly the approved wording.
"""
import io, json, os, re, sys

SPEC = os.path.expanduser('~/Downloads/NABU_TEXT_REVIEW_100_PERCENT_COMPLETE.md')
P = 'src/kb-questions.js'
errors = []
spec = io.open(SPEC, encoding='utf-8').read()
packs = json.load(io.open('_patch/ask_packs.json', encoding='utf-8'))


def obj_end(s, pos):
    depth = 0
    i = pos
    while i < len(s):
        c = s[i]
        if c == '"' or c == "'":
            qc = c
            i += 1
            while i < len(s) and s[i] != qc:
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
    raise ValueError('unbalanced')


def js_str(t):
    return "'" + t.replace('\\', '\\\\').replace("'", "\\'") + "'"


def read_str(s, i):
    """Read the JS string literal starting at s[i]; return (value, end index)."""
    qc = s[i]
    j = i + 1
    buf = []
    while s[j] != qc:
        if s[j] == '\\':
            buf.append(s[j + 1])
            j += 2
            continue
        buf.append(s[j])
        j += 1
    return ''.join(buf), j


def card_span(s, cid):
    """(start, end) of the [ ... ] array belonging to card id `cid` in ASK.vi."""
    m = re.search(r"^ *'%s': \[" % re.escape(cid), s, re.M)
    if not m:
        return None
    start = s.index('[', m.end() - 1)
    return start, obj_end(s, start)


def triples(s, start, end):
    """Yield (open, close, category, question) for each Q&A triple."""
    i = start + 1
    while i < end:
        if s[i] == '[':
            close = obj_end(s, i)
            cat, j = read_str(s, s.index("'", i + 1))
            qn, _ = read_str(s, s.index("'", j + 1))
            yield i, close, cat, qn
            i = close
        i += 1


s = io.open(P, encoding='utf-8').read()

# ---- ASK gains a German column ----
old = 'const ASK = { vi: {}, en: {} };'
if s.count(old) != 1:
    errors.append('ASK declaration not found')
else:
    s = s.replace(old, 'const ASK = { vi: {}, en: {}, de: {} };')

# ---- 1. the 36 Vietnamese answer replacements of 20.10-20.13 ----
vi_sec = spec[spec.index('# 20.10 Minor Arcana'):spec.index('# 21. Historical checkpoint')]
fixes = re.findall(r'^- `([\w-]+) / (\w+) / (.+?)\.\.\.`\s*→\s*\*\*(.+?)\*\*$', vi_sec, re.M)
if len(fixes) != 36:
    errors.append('found %d VI corrections, expected 36' % len(fixes))

for cid, cat, prefix, new in fixes:
    span = card_span(s, cid)
    if not span:
        errors.append('VI fix: card %s missing' % cid)
        continue
    rows = list(triples(s, span[0], span[1]))
    hits = [(a, b) for a, b, c, qn in rows if c == cat and qn.startswith(prefix)]
    if not hits:
        # a few quotations in the review file shorten the question slightly
        # ("Có người nói lá này..." for "Có người nói rằng lá này..."), so fall
        # back to the opening words, which stay unique inside one category.
        hits = [(a, b) for a, b, c, qn in rows if c == cat and qn.startswith(prefix[:12])]
    if len(hits) != 1:
        errors.append('VI fix %s/%s/%s: %d matches' % (cid, cat, prefix[:30], len(hits)))
        continue
    a, b = hits[0]
    one = s[a:b + 1]
    # the answer is the third string in the triple; rebuild the triple around it
    i1 = one.index("'")
    cat_v, j1 = read_str(one, i1)
    i2 = one.index("'", j1 + 1)
    q_v, j2 = read_str(one, i2)
    i3 = one.index("'", j2 + 1)
    _, j3 = read_str(one, i3)
    one = one[:i3] + js_str(new) + one[j3 + 1:]
    s = s[:a] + one + s[b + 1:]

# ---- 2. the reviewed Vietnamese court copy ----
court = {}
for t in packs['vi']:
    for m in re.finditer(r'^ *"([\w-]+)": \[', t, re.M):
        start = t.index('[', m.end() - 1)
        court[m.group(1)] = t[start:obj_end(t, start) + 1]
if len(court) != 16:
    errors.append('section 22 supplied %d court cards' % len(court))
for cid, body in court.items():
    span = card_span(s, cid)
    if not span:
        errors.append('court: %s missing from ASK.vi' % cid)
        continue
    s = s[:span[0]] + body + s[span[1] + 1:]

# ---- 3. ASK.en and ASK.de ----
if 'Object.assign(ASK.en' in s or 'Object.assign(ASK.de' in s:
    errors.append('English or German Q&A already present')
else:
    out = ['\n/* ---- the same 540 questions in English (review sections 20 and 22) ---- */']
    for t in packs['en']:
        out.append('Object.assign(ASK.en, ' + t + ');')
    out.append('\n/* ---- and in German ---- */')
    for t in packs['de']:
        out.append('Object.assign(ASK.de, ' + t + ');')
    s = s.rstrip('\n') + '\n' + '\n\n'.join(out) + '\n'

io.open(P, 'w', encoding='utf-8', newline='').write(s)
if errors:
    sys.stderr.write('\n'.join(errors) + '\n')
    sys.exit(1)
print('kb-questions.js: 36 VI answers revised, 16 court cards replaced, EN + DE added')
