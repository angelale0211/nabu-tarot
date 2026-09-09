# -*- coding: utf-8 -*-
"""German for the polls, the wish posts and the pick-a-pile reading.

Every {vi, en} block in activities.json and activities-stock.json gains a de.
The short strings — titles, poll intros, every option — are matched on their
English text, which is unique across both files. The pick-a-pile intro and its
four long readings are placed by position instead, so no long string has to be
matched character for character.

Nothing else in the files is touched: ids, dates, types, labels, vote counts
and the Vietnamese and English text all stay exactly as they are.
"""
import io, json, sys

SHORT = json.load(io.open('_patch/acts_de.json', encoding='utf-8'))
LONG = json.load(io.open('_patch/acts_de_long.json', encoding='utf-8'))
errors = []
missing = set()
filled = [0]


def walk(o):
    if isinstance(o, dict):
        if 'vi' in o and 'en' in o and isinstance(o['vi'], str):
            if 'de' in o:
                return
            de = SHORT.get(o['en'])
            if de is None:
                missing.add(o['en'][:90])
                return
            o['de'] = de
            filled[0] += 1
            return
        for v in o.values():
            walk(v)
    elif isinstance(o, list):
        for v in o:
            walk(v)


for path in ('activities.json', 'activities-stock.json'):
    doc = json.load(io.open(path, encoding='utf-8'))
    items = doc['items']

    # the pick-a-pile reading first, by position
    for a in items:
        if a.get('type') != 'pile':
            continue
        a['intro']['de'] = LONG['intro']
        piles = a.get('piles') or []
        if len(piles) != len(LONG['piles']):
            errors.append('%s: %d piles, %d German readings' % (path, len(piles), len(LONG['piles'])))
            continue
        for pl, de in zip(piles, LONG['piles']):
            pl['msg']['de'] = de
        filled[0] += 1 + len(piles)

    walk(items)
    io.open(path, 'w', encoding='utf-8', newline='\n').write(
        json.dumps(doc, ensure_ascii=False, indent=1) + '\n')

print('activities: %d German values added' % filled[0])
if missing:
    errors.append('no German for %d strings:\n  %s' % (len(missing), '\n  '.join(sorted(missing))))
if errors:
    sys.stderr.write('\n'.join(errors) + '\n')
    sys.exit(1)
