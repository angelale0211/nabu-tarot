# -*- coding: utf-8 -*-
"""Mirror the dashboard content (posts, availability) from the app cloud into
the repo files. The app reads the cloud first; these files are the fallback for
first loads and offline, and they let the repo show what Nabu has posted.
Reads are public (Firestore rules: content/* readable by everyone), so no
secret is needed.  Run: python scripts/posts_sync.py"""
import io, json, os, sys, urllib.request

PROJECT = 'nabutarot'
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS = {'posts': 'posts.json', 'schedule': 'schedule.json', 'activities': 'activities.json'}


def plain(v):
    """Firestore REST value -> plain JSON."""
    if 'mapValue' in v:
        return {k: plain(x) for k, x in (v['mapValue'].get('fields') or {}).items()}
    if 'arrayValue' in v:
        return [plain(x) for x in (v['arrayValue'].get('values') or [])]
    for k in ('stringValue', 'booleanValue', 'doubleValue'):
        if k in v:
            return v[k]
    if 'integerValue' in v:
        return int(v['integerValue'])
    if 'nullValue' in v:
        return None
    if 'timestampValue' in v:
        return v['timestampValue']
    return None


def fetch(name):
    url = 'https://firestore.googleapis.com/v1/projects/%s/databases/(default)/documents/content/%s' % (PROJECT, name)
    try:
        j = json.loads(urllib.request.urlopen(url, timeout=30).read().decode('utf-8'))
    except Exception as e:  # 404 = never saved from the dashboard yet
        print(name, 'not in the cloud:', e)
        return None
    d = {k: plain(v) for k, v in (j.get('fields') or {}).items()}
    d.pop('updatedAt', None)
    return d


changed = 0
for name, path in DOCS.items():
    d = fetch(name)
    if d is None:
        continue
    full = os.path.join(ROOT, path)
    new = json.dumps(d, ensure_ascii=False, indent=1) + '\n'
    old = io.open(full, encoding='utf-8').read() if os.path.exists(full) else ''
    if json.loads(old or '{}') == d:
        print(path, 'unchanged')
        continue
    io.open(full, 'w', encoding='utf-8', newline='\n').write(new)
    changed += 1
    print(path, 'written:', (len(d.get('posts', [])) if name == 'posts' else 'availability'))
print('changed files:', changed)
