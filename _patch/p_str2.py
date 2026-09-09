# -*- coding: utf-8 -*-
"""strings.js — review section 2: the Vietnamese copy revisions with their
English and German columns. 79 keys, three languages each."""
import io, os, re, sys
sys.path.insert(0, '_patch')
from str_lib import blocks, find_key, js, obj_end, read_str

SPEC = os.path.expanduser('~/Downloads/NABU_TEXT_REVIEW_100_PERCENT_COMPLETE.md')
P = 'src/strings.js'
errors = []

spec = io.open(SPEC, encoding='utf-8').read()
sec = spec[spec.index('# 2. `src/strings.js`'):spec.index('### Notes for dynamic placeholders')]
rows = [m.groups() for m in re.finditer(r'^\| `([^`]+)` \| (.*?) \| (.*?) \| (.*?) \|$', sec, re.M)]
if len(rows) != 79:
    errors.append('section 2 gave %d rows, expected 79' % len(rows))

src = io.open(P, encoding='utf-8').read()

# The five arrow-function keys keep their signature; the variable is spliced
# back in where the review file writes the bare letter.
FUNCS = {'angelWhySame': 'n', 'timeHint': 'tz', 'needWhereId': 'n',
         'courseExpired': 'd', 'loveGiftChosen': 'n'}


def fn_body(text, var):
    m = re.search(r'(?<![\w])' + var + r'(?![\w])', text)
    if not m:
        return None
    pre, post = text[:m.start()], text[m.end():]
    parts = ([js(pre)] if pre else []) + [var] + ([js(post)] if post else [])
    return ' + '.join(parts)


def one_key(src, span, key, value):
    """Rewrite `key: '...'` (or a nested / arrow / array form) in one block."""
    a, b = span
    hits = len(re.findall(r'(?<![\w.$])' + re.escape(key.split('.')[0].split('(')[0].split('[')[0]) + r': ',
                          src[a:b]))
    base = re.split(r'[.(\[]', key)[0]
    if hits != 1:
        return src, '%s: %d matches in the block' % (key, hits)
    i = find_key(src, span, base)

    if '.' in key:                                   # catSub.angel, status.cancelled
        sub = key.split('.', 1)[1]
        end = obj_end(src, i)
        inner = src[i:end + 1]
        m = re.search(r'(?<![\w.$])' + re.escape(sub) + r': ', inner)
        if not m or inner[m.end()] not in "'\"":
            return src, '%s: sub-key not a plain string' % key
        _, se = read_str(inner, m.end())
        inner = inner[:m.end()] + js(value) + inner[se + 1:]
        return src[:i] + inner + src[end + 1:], None

    if '[' in key:                                   # aiSugLesson[1]
        n = int(key[key.index('[') + 1:key.index(']')])
        end = obj_end(src, i)
        inner = src[i:end + 1]
        pos, k = 1, 0
        while pos < len(inner) - 1:
            if inner[pos] in "'\"":
                sv, se = read_str(inner, pos)
                if k == n:
                    inner = inner[:pos] + js(value) + inner[se + 1:]
                    return src[:i] + inner + src[end + 1:], None
                k += 1
                pos = se
            pos += 1
        return src, '%s: index out of range' % key

    if base in FUNCS:                                # arrow functions
        var = FUNCS[base]
        if not src.startswith('(%s) => ' % var, i):
            return src, '%s: unexpected signature' % key
        body = fn_body(value, var)
        if body is None:
            return src, '%s: review text has no %s placeholder' % (key, var)
        # the body runs to the end of this key's value: scan forward to the
        # comma that closes the entry at bracket depth zero
        j = i + len('(%s) => ' % var)
        depth = 0
        while j < len(src):
            c = src[j]
            if c == "'" or c == '"':
                _, j = read_str(src, j)
            elif c in '([{':
                depth += 1
            elif c in ')]}':
                if depth == 0:
                    break
                depth -= 1
            elif c == ',' and depth == 0:
                break
            j += 1
        return src[:i] + '(%s) => ' % var + body + src[j:], None

    if src[i] not in "'\"":
        return src, '%s: value is not a plain string' % key
    _, end = read_str(src, i)
    return src[:i] + js(value) + src[end + 1:], None


done = 0
for key, vi, en, de in rows:
    for lg, val in (('de', de), ('en', en), ('vi', vi)):
        src, err = one_key(src, blocks(src)[lg], key, val)
        if err:
            errors.append('%s [%s]: %s' % (key, lg, err))
        else:
            done += 1

io.open(P, 'w', encoding='utf-8', newline='').write(src)
if errors:
    sys.stderr.write('\n'.join(errors) + '\n')
    sys.exit(1)
print('strings.js section 2: %d values rewritten across VI/EN/DE' % done)
