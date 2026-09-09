# -*- coding: utf-8 -*-
"""Structural parity of the three STR blocks, plus a look for Vietnamese
diacritics that escaped into the English or German blocks."""
import io, re, sys
sys.path.insert(0, '_patch')
from str_lib import blocks, obj_end, read_str

src = io.open('src/strings.js', encoding='utf-8').read()
bl = blocks(src)


def keys(s, a, b, path=''):
    out = set()
    i = a + 1
    key = None
    while i < b:
        c = s[i]
        if c == "'" or c == '"':
            _, i = read_str(s, i)
            i += 1
            continue
        if c in '{[':
            end = obj_end(s, i)
            if key:
                out.add(path + '.' + key)
                out |= keys(s, i, end, path + '.' + key)
            key = None
            i = end + 1
            continue
        m = re.match(r'([A-Za-z_$][\w$]*): ', s[i:])
        if m:
            key = m.group(1)
            out.add(path + '.' + key)
            i += m.end()
            continue
        if c == ',':
            key = None
        i += 1
    return out


k = {lg: keys(src, src.index('{', bl[lg][0]), bl[lg][1]) for lg in bl}
for lg in ('en', 'de'):
    print('keys vi %d, %s %d' % (len(k['vi']), lg, len(k[lg])))
    only_vi = sorted(k['vi'] - k[lg])
    only_lg = sorted(k[lg] - k['vi'])
    print('  missing from %s: %s' % (lg, only_vi or 'none'))
    print('  extra in %s:   %s' % (lg, only_lg or 'none'))

VN = re.compile('[ăâđêôơưĂÂĐÊÔƠƯáàảãạắằẳẵặấầẩẫậéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]')
KEEP = ('Tử vi', 'Nabu', 'Can chi', 'Cần', 'Tarot')
for lg in ('en', 'de'):
    a, b = bl[lg]
    bad = []
    i = a
    while i < b:
        if src[i] == "'" or src[i] == '"':
            val, i = read_str(src, i)
            if VN.search(val) and not any(t in val for t in KEEP):
                bad.append(val[:90])
        i += 1
    print('%s block: %d strings with Vietnamese diacritics outside the kept terms' % (lg, len(bad)))
    for x in bad[:20]:
        print('   ' + x)
