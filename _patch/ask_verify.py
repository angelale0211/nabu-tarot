# -*- coding: utf-8 -*-
"""Count the cards and Q&A rows sitting in each ASK column in the source."""
import io, re

BS = '\\'


def obj_end(s, pos):
    depth = 0
    i = pos
    while i < len(s):
        c = s[i]
        if c == '"' or c == "'":
            qc = c
            i += 1
            while s[i] != qc:
                if s[i] == BS:
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


s = io.open('src/kb-questions.js', encoding='utf-8').read()
for lg in ('vi', 'en', 'de'):
    cards = {}
    for m in re.finditer(r'Object\.assign\(ASK\.%s, \{' % lg, s):
        start = s.index('{', m.end() - 1)
        body = s[start:obj_end(s, start) + 1]
        for mm in re.finditer(r'^ *["\']([\w-]+)["\']: \[', body, re.M):
            a = body.index('[', mm.end() - 1)
            b = obj_end(body, a)
            n = 0
            i = a + 1
            while i < b:
                if body[i] == '[':
                    n += 1
                    i = obj_end(body, i)
                i += 1
            cards[mm.group(1)] = n
    print('ASK.%s: %d cards, %d Q&A' % (lg, len(cards), sum(cards.values())))
