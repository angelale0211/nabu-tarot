# -*- coding: utf-8 -*-
"""Pull the weekly and monthly horoscope for the 12 signs from Horoscope.com
(the general forecasts), translate them to Vietnamese, and write
horoscope.json for the app's home screen. Standard library only; runs in
GitHub Actions once a day.

Text is stored as short paragraphs separated by blank lines, each opening
with one small emoji, so the home screen can show it without a wall of text.
Translation: Gemini (natural Vietnamese) when GEMINI_API_KEY is set,
otherwise Google Translate per paragraph with an astrology glossary applied
before and after, so "your third house of communication" comes out as
"nhà số 3 (khu vực giao tiếp)" and not a literal word-for-word phrase."""
import io, json, os, re, sys, time, urllib.parse, urllib.request, html as htmlmod

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'horoscope.json')
SIGNS = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces']
UA = {'User-Agent': 'Mozilla/5.0 (compatible; NabuTarot/1.0; +https://angelale0211.github.io/nabu-tarot/)'}
GEMINI_KEY = os.environ.get('GEMINI_API_KEY', '').strip()


def fetch(url, data=None, headers=None):
    h = dict(UA)
    if headers:
        h.update(headers)
    req = urllib.request.Request(url, data=data, headers=h)
    with urllib.request.urlopen(req, timeout=90) as r:
        return r.read().decode('utf-8', 'replace')


def clean(text):
    text = re.sub(r'<[^>]+>', ' ', text)
    text = htmlmod.unescape(text)
    return re.sub(r'\s+', ' ', text).strip()


# ---------------------------------------------------------------- sources
def horoscope_com(period, i):
    url = 'https://www.horoscope.com/us/horoscopes/general/horoscope-general-%s.aspx?sign=%d' % (period, i + 1)
    page = fetch(url)
    m = re.search(r'<div class="main-horoscope">(.*?)</div>\s*</div>', page, re.S) or re.search(r'<div class="main-horoscope">(.*?)</div>', page, re.S)
    if not m:
        raise ValueError('no horoscope block')
    block = m.group(1)
    # The page drops an advert for its paid horoscope into the middle of the
    # text ("September Premium Horoscope ..."). Cut every such link out.
    block = re.sub(r'<a[^>]*upsell[^>]*>.*?</a>', ' ', block, flags=re.S | re.I)
    block = re.sub(r'<(?:div|span)[^>]*upsell[^>]*>.*?</(?:div|span)>', ' ', block, flags=re.S | re.I)
    pm = re.search(r'<p>(.*?)</p>', block, re.S)
    raw = pm.group(1) if pm else block
    dm = re.search(r'<strong>(.*?)</strong>', raw, re.S)
    rng = clean(dm.group(1)) if dm else ''
    raw = re.sub(r'<strong>.*?</strong>', ' ', raw, count=1, flags=re.S) if dm else raw
    # Keep the author's paragraph breaks.
    raw = re.sub(r'(?:<br\s*/?>\s*){2,}', '\n\n', raw, flags=re.I)
    paras = [clean(p) for p in raw.split('\n\n')]
    paras = [p.strip(' -–') for p in paras if clean(p)]
    return {'range': rng, 'en': '\n\n'.join(paras)}


def fallback_api(period, sign):
    url = 'https://horoscope-app-api.vercel.app/api/v1/get-horoscope/%s?sign=%s' % (period, sign)
    j = json.loads(fetch(url))
    d = j.get('data', {})
    return {'range': d.get('week') or d.get('month') or '', 'en': d.get('horoscope_data', '')}


# ---------------------------------------------------------------- shaping
AD = re.compile(r'\b\w+ Premium Horoscope\b.*?(?:on your toes\.|\.)(?:\s|$)', re.I)
DAYS = re.compile(r'\s*(Standout days?|Best days?|Lucky days?|Challenging days?|Difficult days?|Tricky days?)\s*:\s*([\d, ]+)', re.I)
ORD = {'first': 1, 'second': 2, 'third': 3, 'fourth': 4, 'fifth': 5, 'sixth': 6, 'seventh': 7, 'eighth': 8, 'ninth': 9, 'tenth': 10, 'eleventh': 11, 'twelfth': 12,
       '1st': 1, '2nd': 2, '3rd': 3, '4th': 4, '5th': 5, '6th': 6, '7th': 7, '8th': 8, '9th': 9, '10th': 10, '11th': 11, '12th': 12}
HOUSE = re.compile(r'\b(?:your|the)\s+(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth|\d{1,2}(?:st|nd|rd|th))\s+(?:house|sector|zone)\s+of\s+([^,.;!?]+?)(?=\s+(?:on|in|at|until|from|through|this|for|where|which|that|so|as|while|when)\b|[,.;!?]|$)', re.I)
HOUSE2 = re.compile(r'\b(?:your|the)\s+(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth|\d{1,2}(?:st|nd|rd|th))\s+(?:house|sector|zone)\b', re.I)


def split_sentences(text):
    return [s.strip() for s in re.split(r'(?<=[.!?])\s+(?=[A-Z"“(])', text) if s.strip()]


def shape_en(text):
    """Remove leftover adverts, pull the day lists onto their own lines, and
    cut the text into short paragraphs of two or three sentences."""
    text = AD.sub(' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    days = []
    def grab(m):
        days.append((m.group(1).lower(), re.sub(r'\s+', '', m.group(2)).strip(',')))
        return ' '
    text = DAYS.sub(grab, text).strip()
    text = re.sub(r'\b(Good luck this (?:week|month)[^.!?]*[.!?])', r'\n\n\1', text)
    body = []
    for chunk in [c for c in text.split('\n\n') if c.strip()]:
        sents = split_sentences(chunk)
        if len(sents) <= 3:
            body.append(' '.join(sents)); continue
        # Group by 2–3 sentences, starting a new paragraph at a dated event.
        cur = []
        for s in sents:
            starts_event = bool(re.match(r'(On |By |The (?:new|full) moon|That same day|Around |After |Then |Later |Meanwhile|Toward|As )', s)) or bool(re.match(r'(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d', s)) or bool(re.search(r'\b(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b', s))
            dated = bool(re.match(r'(On (?:the )?(?:[A-Z][a-z]+ )?\d|On the [a-z-]+,|The (?:new|full) moon|January|February|March|April|May|June|July|August|September|October|November|December)', s))
            if cur and (len(cur) >= 3 or dated or (starts_event and len(cur) >= 2)):
                body.append(' '.join(cur)); cur = []
            cur.append(s)
        if cur:
            body.append(' '.join(cur))
    return body, days


EMOJI = [(r'new moon', '🌑'), (r'full moon', '🌕'), (r'\bmoon\b|eclipse', '🌙'), (r'\bsun\b|your season|birthday', '☀️'), (r'\bvenus\b|\blove\b|romance|relationship', '💗'),
         (r'\bmars\b|energy|drive|action', '🔥'), (r'\bmercury\b|communicat|conversation|talk', '💬'), (r'\bjupiter\b|luck|expand|growth', '🍀'), (r'\bsaturn\b|discipline|responsib', '🪐'),
         (r'money|finance|income|budget|resources|values', '💰'), (r'\bwork\b|career|job|colleague', '💼'), (r'rest|sleep|solitude|reflect', '🛌'), (r'friend|social|community', '🤝'), (r'home|family', '🏡'), (r'health|body|wellness', '🌿')]


def emoji_for(p, used):
    for pat, e in EMOJI:
        if re.search(pat, p, re.I) and e not in used:
            return e
    return '✨'


# ---------------------------------------------------------------- translation
GLOSSARY_EN = [  # rewrite before translating so the machine has plain words to work with
    (HOUSE, lambda m: 'your house number %d (the area of %s)' % (ORD.get(m.group(1).lower(), 0), m.group(2).strip())),
    (HOUSE2, lambda m: 'your house number %d' % ORD.get(m.group(1).lower(), 0)),
    (re.compile(r'\bretrograde\b', re.I), 'retrograde (moving backwards)'),
    (re.compile(r'\bsquares?\b(?= (?:your|the|with)|\.)', re.I), 'clashes with'),
    (re.compile(r'\btrines?\b(?= (?:your|the|with))', re.I), 'flows with'),
    (re.compile(r'\bopposes\b', re.I), 'faces'),
    (re.compile(r'\bconjuncts?\b', re.I), 'joins'),
    (re.compile(r'\bingress(?:es)?\b', re.I), 'enters'),
]
GLOSSARY_VI = [  # tidy the machine's Vietnamese
    (re.compile(r'(?:ngôi )?nhà (?:số )?(\d{1,2}) của bạn'), r'nhà số \1 của bạn'),
    (re.compile(r'\(khu vực (?:của )?', re.I), '(khu vực '),
    (re.compile(r'\(lĩnh vực (?:của )?', re.I), '(khu vực '),
    (re.compile(r'\bcung (?:thứ )?(?:hoàng đạo )?của (?:riêng )?bạn\b'), 'cung của bạn'),
    (re.compile(r'\bmùa của bạn\b'), 'mùa sinh nhật của bạn'),
    (re.compile(r'\bnăm mới (?:của )?cá nhân (?:của )?bạn\b', re.I), 'năm mới của riêng bạn'),
    (re.compile(r'\bNgày nổi bật\b'), 'Ngày thuận lợi'),
    (re.compile(r'\bNgày thử thách\b|\bNhững ngày thử thách\b|\bNgày đầy thử thách\b'), 'Ngày cần cẩn thận'),
    (re.compile(r'\bTrăng non\b'), 'Trăng non'), (re.compile(r'\bmặt trăng mới\b', re.I), 'trăng non'),
    (re.compile(r'\btrăng tròn\b', re.I), 'trăng tròn'),
    (re.compile(r'\bsao Thủy nghịch hành\b|\bsao Thủy ngược\b|\bsao Thủy lùi\b', re.I), 'sao Thủy nghịch hành'),
    (re.compile(r'\bngược dòng \(di chuyển lùi\)|\bnghịch hành \(di chuyển ngược\)|\bnghịch hành \(đi lùi\)|\bnghịch hành \(chuyển động lùi\)', re.I), 'nghịch hành'),
    (re.compile(r'\bAries\b'), 'Bạch Dương'), (re.compile(r'\bTaurus\b'), 'Kim Ngưu'), (re.compile(r'\bGemini\b'), 'Song Tử'), (re.compile(r'\bCancer\b'), 'Cự Giải'),
    (re.compile(r'\bLeo\b'), 'Sư Tử'), (re.compile(r'\bVirgo\b'), 'Xử Nữ'), (re.compile(r'\bLibra\b'), 'Thiên Bình'), (re.compile(r'\bScorpio\b'), 'Bọ Cạp'),
    (re.compile(r'\bSagittarius\b'), 'Nhân Mã'), (re.compile(r'\bCapricorn\b'), 'Ma Kết'), (re.compile(r'\bAquarius\b'), 'Bảo Bình'), (re.compile(r'\bPisces\b'), 'Song Ngư'),
]
SIGN_VI = {'aries': 'Bạch Dương', 'taurus': 'Kim Ngưu', 'gemini': 'Song Tử', 'cancer': 'Cự Giải', 'leo': 'Sư Tử', 'virgo': 'Xử Nữ', 'libra': 'Thiên Bình', 'scorpio': 'Bọ Cạp', 'sagittarius': 'Nhân Mã', 'capricorn': 'Ma Kết', 'aquarius': 'Bảo Bình', 'pisces': 'Song Ngư'}
DAYS_VI = {'standout day': 'Ngày thuận lợi', 'standout days': 'Ngày thuận lợi', 'best day': 'Ngày thuận lợi', 'best days': 'Ngày thuận lợi', 'lucky day': 'Ngày may mắn', 'lucky days': 'Ngày may mắn',
           'challenging day': 'Ngày cần cẩn thận', 'challenging days': 'Ngày cần cẩn thận', 'difficult day': 'Ngày cần cẩn thận', 'difficult days': 'Ngày cần cẩn thận', 'tricky day': 'Ngày cần cẩn thận', 'tricky days': 'Ngày cần cẩn thận'}
DAYS_EN = {'standout day': 'Standout days', 'standout days': 'Standout days', 'best day': 'Best days', 'best days': 'Best days', 'lucky day': 'Lucky days', 'lucky days': 'Lucky days',
           'challenging day': 'Days to take care', 'challenging days': 'Days to take care', 'difficult day': 'Days to take care', 'difficult days': 'Days to take care', 'tricky day': 'Days to take care', 'tricky days': 'Days to take care'}


def pre_en(p):
    for pat, rep in GLOSSARY_EN:
        p = pat.sub(rep, p)
    return p


def post_vi(p):
    for pat, rep in GLOSSARY_VI:
        p = pat.sub(rep, p)
    p = re.sub(r'\s+([,.!?;:])', r'\1', p)
    p = re.sub(r'\s{2,}', ' ', p).strip()
    return p[:1].upper() + p[1:] if p else p


def gtx(text):
    url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=' + urllib.parse.quote(text)
    j = json.loads(fetch(url))
    return ''.join(seg[0] for seg in j[0] if seg and seg[0])


def translate_paras(paras, sign, period):
    """Return Vietnamese paragraphs aligned with the English ones."""
    if not paras:
        return []
    if GEMINI_KEY:
        # The free tier rate-limits bursts; wait and retry before giving up.
        for attempt in range(4):
            try:
                out = gemini_translate(paras, sign, period)
                time.sleep(4)
                return out
            except Exception as e:
                print('gemini attempt', attempt + 1, 'failed:', e)
                time.sleep(15 * (attempt + 1))
        print('gemini gave up for', period, sign, '- using the glossary translation')
    out = []
    for p in paras:
        try:
            out.append(post_vi(gtx(pre_en(p))))
        except Exception as e:
            print('translate failed:', e)
            return []
        time.sleep(0.2)
    return out


def gemini_translate(paras, sign, period):
    prompt = ('Bạn là biên tập viên chiêm tinh người Việt. Dịch các đoạn dự đoán %s cho cung %s dưới đây sang tiếng Việt tự nhiên, ấm áp, dễ hiểu, xưng "bạn". '
              'Dùng thuật ngữ chiêm tinh tiếng Việt thông dụng: "nhà số 3 (khu vực giao tiếp)" thay vì "cung giao tiếp thứ ba", "trăng non", "trăng tròn", "nghịch hành", "sao Kim đi vào Bọ Cạp". '
              'Không thêm hay bớt ý, không quảng cáo, không bình luận. Trả về DUY NHẤT một mảng JSON gồm đúng %d chuỗi, mỗi chuỗi là bản dịch của một đoạn, đúng thứ tự.\n\n' % ('tuần' if period == 'weekly' else 'tháng', SIGN_VI[sign], len(paras)))
    prompt += json.dumps(paras, ensure_ascii=False)
    body = json.dumps({'contents': [{'parts': [{'text': prompt}]}], 'generationConfig': {'temperature': 0.3, 'responseMimeType': 'application/json'}}).encode('utf-8')
    url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=' + GEMINI_KEY
    j = json.loads(fetch(url, data=body, headers={'Content-Type': 'application/json'}))
    text = j['candidates'][0]['content']['parts'][0]['text'].strip()
    text = re.sub(r'^```(?:json)?\s*|\s*```$', '', text)
    lines = json.loads(text)
    if not isinstance(lines, list) or len(lines) != len(paras):
        raise ValueError('paragraph count mismatch')
    return [post_vi(str(l).strip()) for l in lines]


def build(entry, sign, period):
    body, days = shape_en(entry['en'])
    vi_body = translate_paras(body, sign, period)
    used = set()
    en_out, vi_out = [], []
    for k, p in enumerate(body):
        e = emoji_for(p, used); used.add(e)
        en_out.append(e + ' ' + p)
        if vi_body:
            vi_out.append(e + ' ' + vi_body[k])
    for label, nums in days:
        good = label.startswith(('standout', 'best', 'lucky'))
        e = '📅' if good else '⚠️'
        en_out.append('%s %s: %s' % (e, DAYS_EN.get(label, label.capitalize()), nums.replace(',', ', ')))
        if vi_body:
            vi_out.append('%s %s: %s' % (e, DAYS_VI.get(label, label), nums.replace(',', ', ')))
    entry['en'] = '\n\n'.join(en_out)
    entry['vi'] = '\n\n'.join(vi_out)
    return entry


if __name__ == '__main__':
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
            out[period][sign] = build(entry, sign, period)
            time.sleep(0.4)

    if not out['weekly'] and not out['monthly']:
        print('nothing fetched; keeping the previous file')
        sys.exit(0)
    io.open(OUT, 'w', encoding='utf-8', newline='\n').write(json.dumps(out, ensure_ascii=False, indent=1) + '\n')
    print('wrote', len(out['weekly']), 'weekly and', len(out['monthly']), 'monthly forecasts')
