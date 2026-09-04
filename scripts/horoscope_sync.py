# -*- coding: utf-8 -*-
"""Pull the weekly and monthly horoscope for the 12 signs from Horoscope.com
(the general forecasts), translate them to Vietnamese, and write
horoscope.json for the app's home screen. Standard library only; runs in
GitHub Actions once a day."""
import io, json, os, re, sys, time, urllib.parse, urllib.request, html as htmlmod

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'horoscope.json')
SIGNS = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces']
UA = {'User-Agent': 'Mozilla/5.0 (compatible; NabuTarot/1.0; +https://angelale0211.github.io/nabu-tarot/)'}


def fetch(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode('utf-8', 'replace')


def clean(text):
    text = re.sub(r'<[^>]+>', ' ', text)
    text = htmlmod.unescape(text)
    return re.sub(r'\s+', ' ', text).strip()


def horoscope_com(period, i):
    url = 'https://www.horoscope.com/us/horoscopes/general/horoscope-general-%s.aspx?sign=%d' % (period, i + 1)
    page = fetch(url)
    m = re.search(r'<div class="main-horoscope">(.*?)</div>\s*</div>', page, re.S) or re.search(r'<div class="main-horoscope">(.*?)</div>', page, re.S)
    if not m:
        raise ValueError('no horoscope block')
    block = m.group(1)
    pm = re.search(r'<p>(.*?)</p>', block, re.S)
    text = clean(pm.group(1) if pm else block)
    dm = re.search(r'<strong>(.*?)</strong>', block, re.S)
    rng = clean(dm.group(1)) if dm else ''
    text = text.replace(rng, '', 1).strip(' -–') if rng else text
    return {'range': rng, 'en': text}


def fallback_api(period, sign):
    url = 'https://horoscope-app-api.vercel.app/api/v1/get-horoscope/%s?sign=%s' % (period, sign)
    j = json.loads(fetch(url))
    d = j.get('data', {})
    return {'range': d.get('week') or d.get('month') or '', 'en': d.get('horoscope_data', '')}


def translate(text):
    if not text:
        return ''
    try:
        url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=' + urllib.parse.quote(text)
        j = json.loads(fetch(url))
        return ''.join(seg[0] for seg in j[0] if seg and seg[0])
    except Exception as e:  # keep English if translation is unavailable
        print('translate failed:', e)
        return ''


out = {'updated': time.strftime('%Y-%m-%d'), 'source': 'Horoscope.com', 'weekly': {}, 'monthly': {}}
for period in ('weekly', 'monthly'):
    for i, sign in enumerate(SIGNS):
        entry = None
        for attempt in (lambda: horoscope_com(period, i), lambda: fallback_api(period, sign)):
            try:
                entry = attempt()
                if entry and entry.get('en'):
                    break
            except Exception as e:
                print(period, sign, 'failed:', e)
        if not entry or not entry.get('en'):
            continue
        entry['vi'] = translate(entry['en'])
        out[period][sign] = entry
        time.sleep(0.4)

if not out['weekly'] and not out['monthly']:
    print('nothing fetched; keeping the previous file')
    sys.exit(0)
io.open(OUT, 'w', encoding='utf-8', newline='\n').write(json.dumps(out, ensure_ascii=False, indent=1) + '\n')
print('wrote', len(out['weekly']), 'weekly and', len(out['monthly']), 'monthly forecasts')
