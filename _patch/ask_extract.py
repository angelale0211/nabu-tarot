# -*- coding: utf-8 -*-
"""Pull the ASK.vi / ASK.en / ASK.de packs out of the review file and check
them against the Vietnamese data already in src/kb-questions.js."""
import io, json, os, re

SPEC = os.path.expanduser('~/Downloads/NABU_TEXT_REVIEW_100_PERCENT_COMPLETE.md')
spec = io.open(SPEC, encoding='utf-8').read()


def blocks(a, b):
    return re.findall(r'```js\n(.*?)\n```', spec[spec.index(a):spec.index(b)], re.S)


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


def split_assigns(bl):
    out = {}
    for m in re.finditer(r'Object\.assign\(ASK\.(\w+), \{', bl):
        start = bl.index('{', m.end() - 1)
        out.setdefault(m.group(1), []).append(bl[start:obj_end(bl, start) + 1])
    return out


s20 = blocks('# 20. COMPLETE LOCALIZATION PACK', '# 21. Historical checkpoint')
s22 = blocks('# 22. COMPLETE REMAINING TAROT COURT-CARD Q&A', '# 23. COMPLETE GERMAN TAROT INSIGHT DATA')
s22a = blocks('# 22. `src/kb-questions.js` — Court cards', '# 23. Tarot card insight layer')
print('the two copies of section 22 are identical:', s22a == s22)

packs = {}
for bl in s20 + s22:
    for lg, texts in split_assigns(bl).items():
        packs.setdefault(lg, []).extend(texts)


def ids_of(text):
    return re.findall(r'^ *["\']([\w-]+)["\']: \[', text, re.M)


def entries_of(text):
    """Count the [category, question, answer] triples per card id."""
    out = {}
    for m in re.finditer(r'^ *["\']([\w-]+)["\']: \[', text, re.M):
        start = text.index('[', m.end() - 1)
        body = text[start:obj_end(text, start) + 1]
        n = 0
        i = 1
        while i < len(body) - 1:
            if body[i] == '[':
                n += 1
                i = obj_end(body, i)
            i += 1
        out[m.group(1)] = n
    return out


counts = {}
for lg, texts in packs.items():
    ids = []
    per = {}
    for t in texts:
        ids += ids_of(t)
        per.update(entries_of(t))
    counts[lg] = per
    print('ASK.%s: %d ids (%d unique), %d Q&A' % (lg, len(ids), len(set(ids)), sum(per.values())))

src = io.open('src/kb-questions.js', encoding='utf-8').read()
vi_now = entries_of(src)
print('current ASK.vi: %d ids, %d Q&A' % (len(vi_now), sum(vi_now.values())))

for lg in ('en', 'de'):
    missing = [i for i in vi_now if i not in counts[lg]]
    print('ASK.%s missing ids: %s' % (lg, missing or 'none'))
    bad = [(i, vi_now[i], counts[lg][i]) for i in vi_now if i in counts[lg] and counts[lg][i] != vi_now[i]]
    print('ASK.%s count mismatches vs current VI: %s' % (lg, bad or 'none'))

print('section 22 VI ids:', sorted(counts.get('vi', {})))
print('VI count changes from section 22:',
      [(i, vi_now[i], counts['vi'][i]) for i in counts.get('vi', {}) if vi_now.get(i) != counts['vi'][i]] or 'none')

json.dump(packs, io.open('_patch/ask_packs.json', 'w', encoding='utf-8'), ensure_ascii=False)
print('packs saved to _patch/ask_packs.json')
