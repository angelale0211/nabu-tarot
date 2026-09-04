# -*- coding: utf-8 -*-
"""Pull the Nabu Tarot Page's posts (and the linked Instagram account's
media) through the Meta Graph API into fb.json. Runs in GitHub Actions; no
dependencies beyond the standard library."""
import io, json, os, sys, urllib.parse, urllib.request

PAGE = os.environ.get('FB_PAGE_ID', '').strip()
TOKEN = os.environ.get('FB_PAGE_TOKEN', '').strip()
IG = os.environ.get('IG_USER_ID', '').strip()
API = 'https://graph.facebook.com/v21.0/'
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'fb.json')


def get(path, params):
    params = dict(params, access_token=TOKEN)
    with urllib.request.urlopen(API + path + '?' + urllib.parse.urlencode(params), timeout=60) as r:
        return json.loads(r.read().decode('utf-8'))


def title_of(text):
    first = (text or '').strip().split('\n')[0].strip()
    return first[:80] + ('…' if len(first) > 80 else '')


posts = []
if PAGE and TOKEN:
    data = get(PAGE + '/posts', {'fields': 'id,message,created_time,permalink_url,full_picture', 'limit': 25})
    for p in data.get('data', []):
        if not p.get('message'):
            continue
        posts.append({'id': 'fb-' + p['id'], 'date': p['created_time'][:10], 'source': 'Facebook',
                      'title': {'vi': title_of(p['message'])}, 'body': {'vi': p['message']},
                      'link': p.get('permalink_url', ''), 'image': p.get('full_picture', '')})
if IG and TOKEN:
    data = get(IG + '/media', {'fields': 'id,caption,permalink,media_url,thumbnail_url,timestamp,media_type', 'limit': 25})
    for p in data.get('data', []):
        if not p.get('caption'):
            continue
        img = p.get('thumbnail_url') if p.get('media_type') == 'VIDEO' else p.get('media_url', '')
        posts.append({'id': 'ig-' + p['id'], 'date': p['timestamp'][:10], 'source': 'Instagram',
                      'title': {'vi': title_of(p['caption'])}, 'body': {'vi': p['caption']},
                      'link': p.get('permalink', ''), 'image': img or ''})

if not (PAGE and TOKEN) and not (IG and TOKEN):
    print('no secrets set; leaving fb.json unchanged')
    sys.exit(0)

posts.sort(key=lambda p: p['date'], reverse=True)
io.open(OUT, 'w', encoding='utf-8', newline='\n').write(json.dumps({'posts': posts}, ensure_ascii=False, indent=1) + '\n')
print('wrote %d posts' % len(posts))
