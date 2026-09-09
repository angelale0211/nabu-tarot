# -*- coding: utf-8 -*-
"""strings.js — review section 35, the canonical last pass over STR.de.

The section is a tab-separated list of `key<TAB>value`. A value that starts
with `(` is a finished arrow function and goes in as written; anything else is
plain user-facing text and becomes a quoted string. Keys may name an array
element (`wedPayList[0]`) or a nested key (`wedSay.gather`).

Section 35 says explicitly that it wins over any earlier section, so this runs
last of the strings.js passes.
"""
import io, os, re, sys
sys.path.insert(0, '_patch')
from str_lib import blocks, find_key, js, obj_end, read_str

SPEC = os.path.expanduser('~/Downloads/NABU_TEXT_REVIEW_100_PERCENT_COMPLETE.md')
P = 'src/strings.js'
errors = []
missing = []

spec = io.open(SPEC, encoding='utf-8').read()
sec = spec[spec.index('# 35. `src/strings.js`'):spec.index('### 35.1 Entries intentionally left as-is')]
body = re.search(r'```text\n(.*?)\n```', sec, re.S).group(1)

rows = []
for line in body.split('\n'):
    line = line.strip('﻿')
    if not line.strip() or line.lstrip().startswith('#'):
        continue
    if '\t' not in line:
        errors.append('unparsed line: %s' % line[:60])
        continue
    k, v = line.split('\t', 1)
    rows.append((k.strip(), v.strip()))
print('section 35 rows: %d' % len(rows))


def value_end(s, i):
    depth = 0
    while i < len(s):
        c = s[i]
        if c == "'" or c == '"':
            _, i = read_str(s, i)
        elif c in '([{':
            depth += 1
        elif c in ')]}':
            if depth == 0:
                return i
            depth -= 1
        elif c == ',' and depth == 0:
            return i
        i += 1
    return i


def as_value(text):
    return text if text.startswith('(') else js(text)


src = io.open(P, encoding='utf-8').read()
done = 0
for key, val in rows:
    span = blocks(src)['de']
    base = re.split(r'[.\[]', key)[0]
    hits = len(re.findall(r'(?<![\w.$])' + re.escape(base) + r': ', src[span[0]:span[1]]))
    if hits == 0:
        missing.append(key)
        continue
    if hits > 1:
        errors.append('%s: %d matches in the German block' % (key, hits))
        continue
    i = find_key(src, span, base)

    if '[' in key:
        n = int(key[key.index('[') + 1:key.index(']')])
        if src[i] != '[':
            errors.append('%s: not an array' % key)
            continue
        end = obj_end(src, i)
        inner = src[i:end + 1]
        pos, k = 1, 0
        hit = False
        while pos < len(inner) - 1:
            if inner[pos] in "'\"":
                _, se = read_str(inner, pos)
                if k == n:
                    inner = inner[:pos] + js(val) + inner[se + 1:]
                    hit = True
                    break
                k += 1
                pos = se
            pos += 1
        if not hit:
            errors.append('%s: index out of range' % key)
            continue
        src = src[:i] + inner + src[end + 1:]

    elif '.' in key:
        sub = key.split('.', 1)[1]
        if src[i] != '{':
            errors.append('%s: not an object' % key)
            continue
        end = obj_end(src, i)
        inner = src[i:end + 1]
        m = re.search(r'(?<![\w.$])' + re.escape(sub) + r': ', inner)
        if not m:
            missing.append(key)
            continue
        j = m.end()
        inner = inner[:j] + as_value(val) + inner[value_end(inner, j):]
        src = src[:i] + inner + src[end + 1:]

    else:
        src = src[:i] + as_value(val) + src[value_end(src, i):]
    done += 1

io.open(P, 'w', encoding='utf-8', newline='').write(src)
print('strings.js section 35: %d German values replaced' % done)
if missing:
    print('keys not present in STR.de (%d): %s' % (len(missing), ', '.join(missing)))
if errors:
    sys.stderr.write('\n'.join(errors) + '\n')
    sys.exit(1)
