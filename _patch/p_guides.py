# -*- coding: utf-8 -*-
"""kb-guides.js: the complete German guide pack (section 24) plus the two
editorial VI/EN/DE revisions of section 10.

The German pack is read straight out of the review file, so the wording in the
source is the wording in the spec rather than a retyped copy of it.
"""
import io, json, os, re, sys

SPEC = os.path.expanduser('~/Downloads/NABU_TEXT_REVIEW_100_PERCENT_COMPLETE.md')
p = 'src/kb-guides.js'
errors = []

spec = io.open(SPEC, encoding='utf-8').read()
sec = spec[spec.index('# 24. `src/kb-guides.js`'):spec.index('# 25. `src/angel.js`')]
DE = {}
for b in re.findall(r'```json\n(.*?)\n```', sec, re.S):
    DE.update(json.loads(b))

s = io.open(p, encoding='utf-8').read()


def q(t):
    return "'" + t.replace('\\', '\\\\').replace("'", "\\'") + "'"


def obj_end(s, pos):
    depth = 0
    i = pos
    while i < len(s):
        c = s[i]
        if c == "'" or c == '"':
            quote = c
            i += 1
            while i < len(s) and s[i] != quote:
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


def add_de(s, pos, deval):
    close = obj_end(s, pos)
    inner = s[pos + 1:close].rstrip()
    if re.search(r"\bde:", inner):
        return s, False
    return s[:pos + 1] + inner + ', de: ' + deval + ' ' + s[close:], True


ids = re.findall(r"^\{ id: '([\w-]+)'", s, re.M)
if len(ids) != 26:
    errors.append('guides: %d records, expected 26' % len(ids))

# Work backwards so the offsets of the records still to do never move.
for gid in reversed(ids):
    de = DE.get(gid)
    if de is None:
        errors.append('%s: no German' % gid)
        continue
    rstart = s.index("\n{ id: '%s'" % gid) + 1
    rend = obj_end(s, s.index('{', rstart))
    rec = s[rstart:rend + 1]

    # sections last-to-first for the same reason
    heads = [m.start() for m in re.finditer(r'\{ h: \{', rec)]
    if len(heads) != len(de['sections']):
        errors.append('%s: %d sections, German has %d' % (gid, len(heads), len(de['sections'])))
        continue
    for n in range(len(heads) - 1, -1, -1):
        h_de, p_de = de['sections'][n]
        sec_start = heads[n]
        sec_end = obj_end(rec, sec_start)
        one = rec[sec_start:sec_end + 1]
        for key, val in [('p', p_de), ('h', h_de)]:
            m = re.search(r'\b' + key + r': \{', one)
            if not m:
                errors.append('%s: section %d has no %s' % (gid, n, key))
                continue
            one, ok = add_de(one, m.end() - 1, q(val))
            if not ok:
                errors.append('%s: section %d %s already de' % (gid, n, key))
        rec = rec[:sec_start] + one + rec[sec_end + 1:]

    for key, val in [('intro', de['intro']), ('title', de['title'])]:
        m = re.search(r'\n  ' + key + r': \{', rec)
        if not m:
            errors.append('%s: no %s' % (gid, key))
            continue
        rec, ok = add_de(rec, m.end() - 1, q(val))
        if not ok:
            errors.append('%s: %s already de' % (gid, key))
    s = s[:rstart] + rec + s[rend + 1:]

# ---- section 10: the two editorial replacements, VI / EN / DE ----
REPLACE = {
    'mani-action': (
        'Khoảng cách lớn nhất trong manifest không nằm giữa bạn và vũ trụ, mà giữa ý định và hành động đầu tiên. Ba công cụ dưới đây — kế hoạch nếu-thì, bước hai phút và chuỗi ngày — đều dựa trên những nguyên tắc đã được nghiên cứu rộng rãi trong tâm lý học hành vi.',
        'The biggest gap in manifestation is not between you and the universe, but between intention and the first action. The three tools below — if-then plans, the two-minute step and streaks — draw on principles widely studied in behavioural psychology.',
        'Die größte Lücke beim Manifestieren liegt nicht zwischen dir und dem Universum, sondern zwischen Absicht und dem ersten Schritt. Die drei Werkzeuge unten — Wenn-dann-Pläne, der Zwei-Minuten-Schritt und Serien — greifen auf Prinzipien zurück, die in der Verhaltenspsychologie breit untersucht wurden.'),
    'mani-tools': (
        'Nến và đá không có phép màu. Giá trị của chúng nằm ở việc tạo tín hiệu tập trung và nhắc bạn về điều mình đã chọn.',
        'Candles and stones are not magic. Their value is in creating a cue for focus and reminding you of the intention you chose.',
        'Kerzen und Steine sind keine Magie. Ihr Wert liegt darin, einen Fokusreiz zu setzen und dich an deine gewählte Absicht zu erinnern.'),
}
for gid, (vi, en, de) in REPLACE.items():
    rstart = s.index("\n{ id: '%s'" % gid) + 1
    m = re.search(r'\n  intro: \{', s[rstart:])
    istart = rstart + m.end() - 1
    iend = obj_end(s, istart)
    s = s[:istart] + '{ vi: %s, en: %s, de: %s }' % (q(vi), q(en), q(de)) + s[iend + 1:]

io.open(p, 'w', encoding='utf-8', newline='').write(s)
if errors:
    sys.stderr.write('\n'.join(errors) + '\n')
    sys.exit(1)
print('kb-guides.js: 26 German guides + 2 editorial revisions')
