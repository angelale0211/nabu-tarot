# -*- coding: utf-8 -*-
"""Review sections 7 and 8: the targeted Tarot and Lenormand revisions, in all
three languages, plus the Vietnamese court rank rename Đức Vua → Vua.

Tarot text lives in positional arrays:
  MAJORS[i]  = [name, keywords, imagery, upright, reversed]
  MINORS[suit].pips[i] / .court[i] = [imagery, upright, reversed]
Lenormand cards are objects with named fields and a parallel `combo` list.
"""
import io, os, re, sys
sys.path.insert(0, '_patch')
from str_lib import js, obj_end, read_str

SPEC = os.path.expanduser('~/Downloads/NABU_TEXT_REVIEW_100_PERCENT_COMPLETE.md')
errors = []
spec = io.open(SPEC, encoding='utf-8').read()


def rows(a, b):
    sec = spec[spec.index(a):spec.index(b)]
    return [m.groups() for m in re.finditer(r'^\| `([^`]+)` \| (.*?) \| (.*?) \| (.*?) \|$', sec, re.M)]


# ---------------------------------------------------------------- tarot ----
# review key -> (table, path into it, slot in the 3- or 5-item record)
TAROT = {
    'major-00 · core': ('majors', 0, 3),
    'major-01 · core': ('majors', 1, 3),
    'major-02 · upright': ('majors', 2, 3),
    'major-10 · upright': ('majors', 10, 3),
    'wands-10 · upright': ('wands.pips', 9, 1),
    'cups-ace · upright': ('cups.pips', 0, 1),
    'cups-4 · upright': ('cups.pips', 3, 1),
    'cups-7 · upright': ('cups.pips', 6, 1),
    'cups-8 · upright': ('cups.pips', 7, 1),
    'swords-6 · reversed': ('swords.pips', 5, 2),
    'swords-7 · upright': ('swords.pips', 6, 1),
    'swords-9 · upright': ('swords.pips', 8, 1),
    'swords-knight · reversed': ('swords.court', 1, 2),
    'swords-queen · upright': ('swords.court', 2, 1),
    'pentacles-ace · upright': ('pentacles.pips', 0, 1),
}
FILES = {'vi': ('src/tarot-vi.js', 'MAJORS_VI', 'MINORS_VI'),
         'en': ('src/tarot-en.js', 'MAJORS', 'MINORS'),
         'de': ('src/tarot-de.js', 'MAJORS_DE', 'MINORS_DE')}


def list_items(s, start):
    """(open, close) index pairs for the direct [...] children of the list at
    `start`."""
    out = []
    i = start + 1
    end = obj_end(s, start)
    while i < end:
        c = s[i]
        if c == '[':
            j = obj_end(s, i)
            out.append((i, j))
            i = j
        elif c == "'" or c == '"':
            _, i = read_str(s, i)
        i += 1
    return out


def set_slot(s, open_i, close_i, slot, text):
    """Replace the `slot`-th string literal of one record."""
    i = open_i + 1
    k = 0
    while i < close_i:
        if s[i] == "'" or s[i] == '"':
            _, end = read_str(s, i)
            if k == slot:
                return s[:i] + js(text) + s[end + 1:], True
            k += 1
            i = end
        i += 1
    return s, False


done = 0
for lg, (path, majors, minors) in FILES.items():
    s = io.open(path, encoding='utf-8').read()
    for key, vi, en, de in rows('# 7. `src/tarot-vi.js`', '# 8. `src/len-vi.js`'):
        table, idx, slot = TAROT[key]
        text = {'vi': vi, 'en': en, 'de': de}[lg]
        if table == 'majors':
            start = s.index('[', s.index('const %s' % majors))
        else:
            suit, kind = table.split('.')
            m = re.search(r'\b%s\s*:\s*\{' % suit, s[s.index('const %s' % minors):])
            base = s.index('const %s' % minors) + m.end() - 1
            mm = re.search(r'\b%s\s*:\s*\[' % kind, s[base:obj_end(s, base) + 1])
            if not mm:
                errors.append('%s [%s]: no %s' % (key, lg, table))
                continue
            start = base + mm.end() - 1
        items = list_items(s, start)
        if idx >= len(items):
            errors.append('%s [%s]: only %d records' % (key, lg, len(items)))
            continue
        s, ok = set_slot(s, items[idx][0], items[idx][1], slot, text)
        if not ok:
            errors.append('%s [%s]: slot %d missing' % (key, lg, slot))
        else:
            done += 1
    io.open(path, 'w', encoding='utf-8', newline='').write(s)
print('section 7: %d Tarot meanings rewritten' % done)

# ------------------------------------------------------------ lenormand ----
LEN = {
    '5 · Cái Cây · core': (5, 'core'),
    '5 · Cái Cây + Quan Tài': (5, 'combo:+ Quan Tài'),
    '5 · Cái Cây + Mặt Trời': (5, 'combo:+ Mặt Trời'),
    '13 · Đứa Trẻ · love': (13, 'love'),
    '13 · Đứa Trẻ + Con Cò': (13, 'combo:+ Con Cò'),
    '17 · Con Cò + Đứa Trẻ': (17, 'combo:+ Đứa Trẻ'),
    '23 · Đàn Chuột + Cái Cây': (23, 'combo:+ Cái Cây'),
}
LEN_FILES = {'vi': 'src/len-vi.js', 'en': 'src/len-en.js', 'de': 'src/len-de.js'}


def card_span(s, n):
    m = re.search(r'^%d: \{' % n, s, re.M)
    if not m:
        return None
    a = s.index('{', m.end() - 1)
    return a, obj_end(s, a)


def combo_index(s, n, label):
    """Position of `label` in card n's combo list, read from the Vietnamese."""
    a, b = card_span(s, n)
    m = re.search(r'\bcombo: \[', s[a:b])
    start = a + m.end() - 1
    for k, (i, j) in enumerate(list_items(s, start)):
        val, _ = read_str(s, s.index("'", i))
        if val == label:
            return k
    return -1


vi_src = io.open(LEN_FILES['vi'], encoding='utf-8').read()
lrows = rows('# 8. `src/len-vi.js`', '# 9. `src/fortune.js`')
done = 0
for lg, path in LEN_FILES.items():
    s = io.open(path, encoding='utf-8').read()
    for key, vi, en, de in lrows:
        n, field = LEN[key]
        text = {'vi': vi, 'en': en, 'de': de}[lg]
        span = card_span(s, n)
        if not span:
            errors.append('%s [%s]: card %d missing' % (key, lg, n))
            continue
        a, b = span
        if field.startswith('combo:'):
            k = combo_index(vi_src, n, field.split(':', 1)[1])
            if k < 0:
                errors.append('%s: combo label not found in Vietnamese' % key)
                continue
            m = re.search(r'\bcombo: \[', s[a:b])
            items = list_items(s, a + m.end() - 1)
            if k >= len(items):
                errors.append('%s [%s]: combo %d of %d' % (key, lg, k, len(items)))
                continue
            s, ok = set_slot(s, items[k][0], items[k][1], 1, text)
        else:
            m = re.search(r'\b%s: ' % field, s[a:b])
            if not m:
                errors.append('%s [%s]: field %s missing' % (key, lg, field))
                continue
            i = a + m.end()
            _, end = read_str(s, i)
            s = s[:i] + js(text) + s[end + 1:]
            ok = True
        if ok:
            done += 1
        else:
            errors.append('%s [%s]: not written' % (key, lg))
    io.open(path, 'w', encoding='utf-8', newline='').write(s)
print('section 8: %d Lenormand meanings rewritten' % done)

# ------------------------------------------- the Vietnamese court rename ----
n = 0
for f in ('tarot-vi.js', 'kb-guides.js', 'kb-questions.js'):
    p = 'src/' + f
    s = io.open(p, encoding='utf-8').read()
    n += s.count('Đức Vua')
    io.open(p, 'w', encoding='utf-8', newline='').write(s.replace('Đức Vua', 'Vua'))
print('court rank: %d occurrences of Đức Vua renamed to Vua' % n)

if errors:
    sys.stderr.write('\n'.join(errors) + '\n')
    sys.exit(1)
