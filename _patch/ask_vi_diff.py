# -*- coding: utf-8 -*-
"""Does the section-22 Vietnamese court copy differ from what is in the file?"""
import io, json, re

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


def strings_of(body):
    out = []
    i = 0
    while i < len(body):
        c = body[i]
        if c == '"' or c == "'":
            qc = c
            j = i + 1
            buf = []
            while body[j] != qc:
                if body[j] == '\\':
                    buf.append(body[j + 1])
                    j += 2
                    continue
                buf.append(body[j])
                j += 1
            out.append(''.join(buf))
            i = j
        i += 1
    return out


def cards(text):
    out = {}
    for m in re.finditer(r'^ *["\']([\w-]+)["\']: \[', text, re.M):
        start = text.index('[', m.end() - 1)
        out[m.group(1)] = strings_of(text[start:obj_end(text, start) + 1])
    return out


now = cards(io.open('src/kb-questions.js', encoding='utf-8').read())
spec = {}
for t in packs['vi']:
    spec.update(cards(t))

same = diff = 0
for cid, vals in spec.items():
    if now.get(cid) == vals:
        same += 1
    else:
        diff += 1
        a, b = now.get(cid, []), vals
        for n, (x, y) in enumerate(zip(a, b)):
            if x != y:
                print('%s [%d]\n  now : %s\n  spec: %s' % (cid, n, x[:150], y[:150]))
                break
print('court cards identical: %d, different: %d' % (same, diff))
