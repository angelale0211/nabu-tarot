# -*- coding: utf-8 -*-
"""Walk STR.en and STR.de leaf by leaf and report every German leaf whose text
is byte-identical to the English one — the shape an English fallback takes."""
import io, re, sys
sys.path.insert(0, '_patch')
from str_lib import blocks, obj_end, read_str

src = io.open('src/strings.js', encoding='utf-8').read()
bl = blocks(src)


def leaves(s, a, b, path=''):
    """Yield (path, literal-string) for every string literal, keyed by the
    surrounding key names and array indices."""
    i = a + 1
    idx = 0
    key = None
    while i < b:
        c = s[i]
        if c == "'" or c == '"':
            val, end = read_str(s, i)
            name = path + ('.' + key if key else '[%d]' % idx)
            if not key:
                idx += 1
            yield name, val
            i = end + 1
            continue
        if c == '{' or c == '[':
            end = obj_end(s, i)
            sub = path + ('.' + key if key else '[%d]' % idx)
            if not key:
                idx += 1
            for r in leaves(s, i, end, sub):
                yield r
            key = None
            i = end + 1
            continue
        m = re.match(r'([A-Za-z_$][\w$]*): ', s[i:])
        if m:
            key = m.group(1)
            i += m.end()
            continue
        if c == ',':
            key = None
        i += 1


en = dict(leaves(src, src.index('{', bl['en'][0]), bl['en'][1]))
de = dict(leaves(src, src.index('{', bl['de'][0]), bl['de'][1]))
print('leaves: en %d, de %d' % (len(en), len(de)))

same = [k for k in de if k in en and de[k] == en[k] and re.search(r'[A-Za-z]{3}', de[k])]
# brand names, single words and shared tokens are not fallbacks
KEEP = re.compile(r'^(Nabu|Tarot|Lenormand|Instagram|Facebook|Zalo|Oracle|WOOP|VI|EN|DE)[\w \-·+]*$')
flag = [k for k in same if not KEEP.match(de[k])]
print('identical en/de leaves: %d (%d after dropping brand/one-word)' % (len(same), len(flag)))
for k in sorted(flag):
    print('  %-42s %s' % (k, de[k][:110]))
