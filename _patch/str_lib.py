# -*- coding: utf-8 -*-
"""Shared helpers for the strings.js passes: locating the three STR blocks and
rewriting one key's value inside them."""
import io, re

BS = '\\'


def obj_end(s, pos):
    depth = 0
    i = pos
    while i < len(s):
        c = s[i]
        if c == "'" or c == '"':
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


def js(t):
    return "'" + t.replace(BS, BS + BS).replace("'", BS + "'").replace('\n', BS + 'n') + "'"


def read_str(s, i):
    qc = s[i]
    j = i + 1
    buf = []
    while s[j] != qc:
        if s[j] == BS:
            buf.append(s[j + 1])
            j += 2
            continue
        buf.append(s[j])
        j += 1
    return ''.join(buf), j


def blocks(src):
    """{lang: (start, end)} for the three STR language objects."""
    out = {}
    for lg in ('vi', 'en', 'de'):
        a = src.index('\n  %s: {' % lg)
        out[lg] = (a, obj_end(src, src.index('{', a)))
    return out


def find_key(src, span, key):
    """Index just past `key: ` inside one language block, or -1."""
    a, b = span
    m = re.search(r'(?<![\w.$])' + re.escape(key) + r': ', src[a:b])
    return a + m.end() if m else -1


def set_string(src, span, key, value):
    """Replace a plain `key: '...'` value. Returns (src, ok)."""
    i = find_key(src, span, key)
    if i < 0 or src[i] not in "'\"":
        return src, False
    _, end = read_str(src, i)
    return src[:i] + js(value) + src[end + 1:], True
