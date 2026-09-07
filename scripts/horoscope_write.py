# -*- coding: utf-8 -*-
"""Write Nabu's own weekly and monthly horoscopes, from astronomy, in both
languages. Standard library only; runs in GitHub Actions once a day.

Why this exists
---------------
The forecasts used to be scraped from Horoscope.com and translated. That worked,
but it republished somebody else's writing without a licence, which is a real
exposure once the app is listed on a store and sells anything. This file removes
the dependency: nothing is fetched, nothing is translated, and every sentence
here was written for Nabu.

How the text is arrived at
--------------------------
It is not random, and it is not a fortune cookie machine. It uses the oldest
method behind sun-sign columns, the one honest astrologers use when they write
them: solar houses.

Take where the Sun actually is on the date. Count from each sign to the Sun's
sign, and that count is the house the Sun is lighting for that sign - the Sun in
Virgo sits in the sixth house of an Aries and the fifth of a Taurus. The house
gives the subject: work, money, home, love. Then the sign's own element gives
the manner - fire moves first, earth builds, air talks it through, water feels
its way. Then the Moon's phase on the day gives the timing: a new Moon starts
things, a full Moon shows them.

So the three paragraphs are: what this period is about for you, how you are
likely to go at it, and when to move. Three real inputs, composed - which is why
Aries and Taurus never read the same, and why September never reads like
October.

The Sun's position is computed from the date, the Moon's phase from the standard
synodic cycle. Neither needs a network."""
import io, json, math, os, sys, datetime

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'horoscope.json')

SIGNS = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
         'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces']
SIGN_VI = {'aries': 'Bạch Dương', 'taurus': 'Kim Ngưu', 'gemini': 'Song Tử', 'cancer': 'Cự Giải',
           'leo': 'Sư Tử', 'virgo': 'Xử Nữ', 'libra': 'Thiên Bình', 'scorpio': 'Bọ Cạp',
           'sagittarius': 'Nhân Mã', 'capricorn': 'Ma Kết', 'aquarius': 'Bảo Bình', 'pisces': 'Song Ngư'}
SIGN_EN = {s: s.capitalize() for s in SIGNS}
ELEM = {'aries': 'fire', 'leo': 'fire', 'sagittarius': 'fire',
        'taurus': 'earth', 'virgo': 'earth', 'capricorn': 'earth',
        'gemini': 'air', 'libra': 'air', 'aquarius': 'air',
        'cancer': 'water', 'scorpio': 'water', 'pisces': 'water'}

# The day the Sun leaves each sign, near enough for a column: tropical dates.
SUN_INTO = [(3, 21, 'aries'), (4, 20, 'taurus'), (5, 21, 'gemini'), (6, 21, 'cancer'),
            (7, 23, 'leo'), (8, 23, 'virgo'), (9, 23, 'libra'), (10, 23, 'scorpio'),
            (11, 22, 'sagittarius'), (12, 22, 'capricorn'), (1, 20, 'aquarius'), (2, 19, 'pisces')]


def sun_sign(d):
    """Which sign the Sun stands in on a date."""
    out = 'capricorn'
    for m, day, s in sorted(SUN_INTO, key=lambda x: (x[0], x[1])):
        if (d.month, d.day) >= (m, day):
            out = s
    # January before the 20th belongs to the previous December's Capricorn
    if (d.month, d.day) < (1, 20):
        out = 'capricorn'
    return out


def moon_phase(d):
    """0..7 around the synodic month, from a known new Moon (6 Jan 2000, 18:14 UT)."""
    known = datetime.datetime(2000, 1, 6, 18, 14)
    days = (datetime.datetime(d.year, d.month, d.day) - known).total_seconds() / 86400.0
    age = days % 29.530588853
    return int((age / 29.530588853) * 8 + 0.5) % 8


def moon_sign(d):
    """Which sign the Moon stands in, from its mean longitude. The Moon crosses a
    sign every two or three days, which is what gives a week its own subject
    rather than repeating the month's."""
    j2000 = datetime.datetime(2000, 1, 1, 12, 0)
    days = (datetime.datetime(d.year, d.month, d.day) - j2000).total_seconds() / 86400.0
    lon = (218.316 + 13.176396 * days) % 360.0
    return SIGNS[int(lon // 30)]


def house_of(sign, sun):
    """Counting from a sign to the Sun's sign gives the solar house it lights."""
    return (SIGNS.index(sun) - SIGNS.index(sign)) % 12 + 1


# ---------------------------------------------------------------- the writing
# What each house is about. One subject sentence and one thing to do with it.
HOUSE = {
    1:  {'vi': ('Ánh sáng đang rơi thẳng vào chính bạn: cách bạn xuất hiện, cách bạn mở lời, cách người khác nhớ về bạn.',
                'Bạn thử đổi một thứ nhỏ thuộc về mình — kiểu tóc, giờ dậy, cách bạn trả lời tin nhắn — rồi xem nó đi tới đâu.'),
         'en': ('The light falls on you: how you appear, how you open a conversation, what people remember you by.',
                'Change one small thing that is yours — how you wake, how you answer a message — and watch where it leads.')},
    2:  {'vi': ('Chuyện tiền bạc và chuyện bạn thấy mình đáng giá bao nhiêu nằm chung một chỗ, và cả hai đang được soi rõ.',
                'Bạn ngồi xuống viết ra những gì mình đang trả hằng tháng. Con số nói thật hơn cảm giác.'),
         'en': ('Money and what you believe you are worth sit in the same place, and both are lit.',
                'Write down what you pay out each month. The number is more honest than the feeling.')},
    3:  {'vi': ('Lời nói, tin nhắn và những chuyến đi ngắn chiếm phần lớn thời gian của bạn.',
                'Có một cuộc trò chuyện bạn đang trì hoãn. Bạn nhắn trước một câu thôi cũng đủ.'),
         'en': ('Words, messages and short journeys take up most of your time.',
                'There is a conversation you keep putting off. One first sentence is enough.')},
    4:  {'vi': ('Nhà cửa, gia đình và những gì bạn gọi là chốn về được đưa lên trước.',
                'Bạn dọn một góc trong nhà mình. Đầu óc thường theo tay mà nhẹ đi.'),
         'en': ('Home, family and whatever you call your own place come first.',
                'Clear one corner of where you live. The mind usually follows the hands.')},
    5:  {'vi': ('Đây là khu vực của yêu đương, của sáng tạo và của việc chơi cho ra chơi.',
                'Bạn làm một việc không có ích gì cả, chỉ vì thấy vui. Đó chính là phần đang thiếu.'),
         'en': ('This is the ground of romance, of making things, and of playing properly.',
                'Do one thing with no use at all, purely because it pleases you. That is the part that is missing.')},
    6:  {'vi': ('Công việc hằng ngày, sức khỏe và những thói quen nhỏ được đem ra soi.',
                'Bạn sửa một thói quen thôi, thứ nhỏ nhất trong danh sách. Thứ lớn nhất sẽ không nhúc nhích.'),
         'en': ('Daily work, health and the small habits are under examination.',
                'Fix one habit, the smallest on the list. The largest one will not move.')},
    7:  {'vi': ('Người khác — bạn đời, cộng sự, cả người đang làm bạn khó chịu — là chủ đề của kỳ này.',
                'Bạn hỏi thẳng một câu thay vì đoán. Phần lớn hiểu lầm chỉ sống được nhờ sự im lặng.'),
         'en': ('Other people — a partner, a colleague, even the one annoying you — are the subject.',
                'Ask the plain question instead of guessing. Most misunderstandings live on silence alone.')},
    8:  {'vi': ('Những gì sâu và ít nói ra: tiền chung, nợ nần, tin tưởng, và điều bạn chưa buông được.',
                'Bạn nhìn thẳng vào một con số hoặc một chuyện cũ mà bạn vẫn tránh. Nhìn xong thường nhẹ hơn.'),
         'en': ('What is deep and rarely said: shared money, debt, trust, and what you have not let go of.',
                'Look straight at one number, or one old matter, that you keep avoiding. Looking is usually lighter than avoiding.')},
    9:  {'vi': ('Tầm nhìn mở ra: chuyện học, chuyện đi xa, và niềm tin của bạn về cách đời vận hành.',
                'Bạn học một thứ mới trong ba mươi phút. Không cần thành thạo, chỉ cần bắt đầu.'),
         'en': ('The view widens: study, distance, and what you believe about how life works.',
                'Learn one new thing for half an hour. Not to master it, only to begin.')},
    10: {'vi': ('Sự nghiệp và tiếng tăm được đưa lên cao nhất trong lá số của bạn lúc này.',
                'Bạn nói ra điều mình muốn với đúng người có thể quyết. Không ai đoán giúp bạn được.'),
         'en': ('Work and reputation stand at the top of your chart.',
                'Say what you want to the person who can actually decide it. Nobody guesses that for you.')},
    11: {'vi': ('Bạn bè, nhóm và những dự định dài hơi là nơi mọi thứ đang diễn ra.',
                'Bạn nhắn lại cho một người đã lâu không nói chuyện. Mạng lưới cũ thường mở cửa nhanh hơn mạng lưới mới.'),
         'en': ('Friends, groups and long plans are where things are happening.',
                'Write back to someone you have not spoken to in a while. Old networks open faster than new ones.')},
    12: {'vi': ('Đây là khoảng lặng trước một vòng mới: nghỉ ngơi, buông bớt, và những gì diễn ra bên trong.',
                'Bạn cho phép mình không làm gì trong một buổi tối. Nghỉ không phải là lười, nghỉ là chuẩn bị.'),
         'en': ('This is the quiet before a new round: rest, release, and what happens out of sight.',
                'Give yourself one evening of nothing. Rest is not idleness; it is preparation.')}
}

# The element gives the manner - how this sign is likely to go at it.
ELEM_WAY = {
    'fire':  {'vi': 'Bạn thuộc nhóm lửa, nên bạn sẽ muốn làm ngay. Cứ làm, nhưng chọn một việc thôi thay vì năm việc.',
              'en': 'You are of fire, so you will want to move at once. Move — but pick one thing rather than five.'},
    'earth': {'vi': 'Bạn thuộc nhóm đất, nên bạn sẽ muốn chắc chắn trước. Được, nhưng đừng đợi tới lúc chắc chắn tuyệt đối, vì lúc đó không tới.',
              'en': 'You are of earth, so you will want to be sure first. Fair enough — but do not wait for certainty, because it does not arrive.'},
    'air':   {'vi': 'Bạn thuộc nhóm khí, nên bạn sẽ nghĩ và nói về nó rất nhiều. Đến một lúc thì phải chuyển từ nói sang làm.',
              'en': 'You are of air, so you will think it through and talk it out. At some point the talking has to become doing.'},
    'water': {'vi': 'Bạn thuộc nhóm nước, nên bạn sẽ cảm nhận trước khi hiểu. Cảm giác của bạn thường đúng, chỉ là nó tới trước lời giải thích.',
              'en': 'You are of water, so you will feel it before you understand it. Your sense is usually right; it simply arrives before the reason.'}
}

# The Moon's phase gives the timing.
PHASE = [
    {'vi': 'Trăng non đầu kỳ: đây là lúc bắt đầu, không phải lúc kết thúc. Bạn gieo, đừng đòi gặt.',
     'en': 'A new Moon opens this stretch: a time to begin, not to finish. Sow; do not ask to harvest yet.'},
    {'vi': 'Trăng đang lớn dần: việc bạn vừa bắt đầu cần được nuôi mỗi ngày một chút.',
     'en': 'The Moon is filling: whatever you have just begun needs feeding a little each day.'},
    {'vi': 'Trăng bán nguyệt đầu: đây là chỗ gặp trở ngại đầu tiên. Gặp là đúng lịch, không phải là điềm xấu.',
     'en': 'The first quarter: this is where the first obstacle shows up. On schedule, not a bad omen.'},
    {'vi': 'Trăng gần tròn: mọi thứ đang dồn lại. Bạn giữ nhịp thêm vài ngày nữa.',
     'en': 'The Moon is nearly full: things are gathering. Hold the pace a few days more.'},
    {'vi': 'Trăng tròn giữa kỳ: điều gì đang thật sẽ lộ ra rõ nhất lúc này, kể cả điều bạn không muốn nhìn.',
     'en': 'A full Moon falls in the middle: what is real shows itself now, including what you would rather not see.'},
    {'vi': 'Trăng bắt đầu khuyết: đây là lúc bỏ bớt, không phải lúc thêm vào.',
     'en': 'The Moon is waning: a time to take away, not to add.'},
    {'vi': 'Trăng bán nguyệt cuối: bạn dọn dẹp và kết lại những gì còn dở.',
     'en': 'The last quarter: tidy up and close what is still half-done.'},
    {'vi': 'Trăng tàn cuối kỳ: nghỉ, nhìn lại, rồi đợi vòng sau. Không cần cố lúc này.',
     'en': 'The old Moon closes this stretch: rest, look back, and wait for the next round. Nothing needs forcing now.'}
]

# Each sign's own planet - the other half of what a sun-sign column is built on.
RULER = {'aries': 'mars', 'taurus': 'venus', 'gemini': 'mercury', 'cancer': 'moon',
         'leo': 'sun', 'virgo': 'mercury', 'libra': 'venus', 'scorpio': 'mars',
         'sagittarius': 'jupiter', 'capricorn': 'saturn', 'aquarius': 'saturn', 'pisces': 'jupiter'}
RULER_LINE = {
    'mars':    {'vi': 'Sao Hỏa cai quản bạn, nên bạn tiến bằng cách đẩy. Tháng này cái cần đẩy là một việc, không phải một người.',
                'en': 'Mars rules you, so you get through things by pushing. This month, push the task and not the person.'},
    'venus':   {'vi': 'Sao Kim cai quản bạn, nên bạn đi xa nhất bằng sự dễ chịu chứ không phải bằng sức. Cái gì càng gồng càng chậm.',
                'en': 'Venus rules you, so you get furthest by ease rather than force. Whatever you strain at will move slowest.'},
    'mercury': {'vi': 'Sao Thủy cai quản bạn, nên chữ nghĩa là công cụ của bạn. Viết ra thì rõ, giữ trong đầu thì rối.',
                'en': 'Mercury rules you, so words are your tool. Written down it is clear; kept in your head it tangles.'},
    'moon':    {'vi': 'Mặt Trăng cai quản bạn, nên bạn lên xuống theo chu kỳ và điều đó bình thường. Bạn đừng quyết chuyện lớn vào ngày mình xuống.',
                'en': 'The Moon rules you, so you rise and fall in cycles, and that is normal. Do not decide anything large on a low day.'},
    'sun':     {'vi': 'Mặt Trời cai quản bạn, nên bạn sống được khi được nhìn thấy. Bạn cứ nhận lấy chỗ đứng của mình, đừng đợi ai mời.',
                'en': 'The Sun rules you, so you need to be seen to feel alive. Take your place; do not wait to be invited to it.'},
    'jupiter': {'vi': 'Sao Mộc cai quản bạn, nên bạn hay nghĩ lớn. Tháng này bạn thu nhỏ lại một chút thì lại đi được xa hơn.',
                'en': 'Jupiter rules you, so you think big. Scaling down a little this month will take you further.'},
    'saturn':  {'vi': 'Sao Thổ cai quản bạn, nên bạn đi chậm mà chắc, và bạn hay khắt khe với chính mình. Chậm là được, khắt khe thì bớt.',
                'en': 'Saturn rules you, so you go slowly and surely, and you are hard on yourself. Slow is fine; hard is optional.'}
}

# How a week leans, from where the Moon stands in its round.
WEEK_SHAPE = [
    {'vi': 'Đầu tuần nhẹ, cuối tuần mới rõ. Bạn để việc quan trọng vào thứ Năm, thứ Sáu.',
     'en': 'The start is light and the end is clearer. Put the important thing on Thursday or Friday.'},
    {'vi': 'Tuần này dồn về giữa. Thứ Ba tới thứ Năm là chỗ đáng dùng nhất.',
     'en': 'This week gathers in the middle. Tuesday to Thursday is the part worth using.'},
    {'vi': 'Đầu tuần mạnh nhất. Bạn làm việc khó vào thứ Hai, thứ Ba, rồi thả lỏng dần.',
     'en': 'The start is strongest. Do the hard thing on Monday or Tuesday, then let it ease off.'},
    {'vi': 'Tuần này đều, không có ngày nào nổi bật. Bạn giữ nhịp nhỏ mỗi ngày thì hơn dồn một hôm.',
     'en': 'An even week with no standout day. A small amount daily beats one long push.'}
]

OPENERS = ['✨', '🌙', '💗', '🌿', '🕯️', '🔮', '⭐', '🌸']


DAY_VI = ['thứ Hai', 'thứ Ba', 'thứ Tư', 'thứ Năm', 'thứ Sáu', 'thứ Bảy', 'Chủ nhật']
DAY_EN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']


def week_days(sign, monday):
    """Which days of the week run easily and which take more, from where the Moon
    stands against the reader's own sign on each one.

    Four signs apart is a trine and nothing has to be forced; on the sign itself
    it is a conjunction and the day belongs to them. Three, six or nine apart is
    a square or an opposition and the day asks for more. The rest are ordinary
    and go unlisted - a forecast that marks every day marks none."""
    good, hard = [], []
    for i in range(7):
        d = monday + datetime.timedelta(days=i)
        gap = (SIGNS.index(moon_sign(d)) - SIGNS.index(sign)) % 12
        if gap in (0, 4, 8):
            good.append(i)
        elif gap in (3, 6, 9):
            hard.append(i)
    return good, hard


def days_line(sign, monday, lang):
    good, hard = week_days(sign, monday)
    names = DAY_VI if lang == 'vi' else DAY_EN
    bits = []
    if good:
        bits.append(('Ngày thuận lợi: ' if lang == 'vi' else 'Easier days: ') + ', '.join(names[i] for i in good) + '.')
    if hard:
        bits.append(('Ngày cần cẩn thận: ' if lang == 'vi' else 'Days that ask more: ') + ', '.join(names[i] for i in hard) + '.')
    if not bits:
        bits.append('Tuần này không có ngày nào nổi bật hẳn lên.' if lang == 'vi'
                    else 'No day this week stands out sharply from the others.')
    return ' '.join(bits)


def compose(sign, when, period, monday=None):
    """Three paragraphs: the subject, the manner, the timing.

    A month is the Sun's: it stays in one sign for about thirty days, which is
    the length of the thing being described. A week is the Moon's: it crosses a
    sign every two or three days, so it has a subject of its own rather than
    repeating the month's in shorter words."""
    body = moon_sign(when) if period == 'weekly' else sun_sign(when)
    h = house_of(sign, body)
    e = ELEM[sign]
    ph = moon_phase(when)
    out = {}
    for lang in ('vi', 'en'):
        subject, todo = HOUSE[h][lang]
        name = (SIGN_VI if lang == 'vi' else SIGN_EN)[sign]
        bodyname = (SIGN_VI if lang == 'vi' else SIGN_EN)[body]
        if lang == 'vi':
            who = 'mặt trăng' if period == 'weekly' else 'mặt trời'
            lead = '%s thân mến, %s đang đi qua cung %s, tức nhà số %d của bạn. %s' % (name, who, bodyname, h, subject)
        else:
            who = 'The Moon' if period == 'weekly' else 'The Sun'
            lead = '%s is crossing %s, which is your %s house, %s. %s' % (
                who, bodyname, {1: 'first', 2: 'second', 3: 'third', 4: 'fourth', 5: 'fifth', 6: 'sixth',
                                7: 'seventh', 8: 'eighth', 9: 'ninth', 10: 'tenth', 11: 'eleventh', 12: 'twelfth'}[h],
                name, subject)
        mid = '%s %s' % (ELEM_WAY[e][lang], todo)
        # The Moon is the same for everybody, so it closes the weekly, where
        # timing is the question. The monthly closes on the sign's own planet,
        # which is different for each of the twelve.
        if period == 'weekly':
            tail = '%s %s' % (PHASE[ph][lang], WEEK_SHAPE[ph % len(WEEK_SHAPE)][lang])
        else:
            tail = RULER_LINE[RULER[sign]][lang]
        o = OPENERS
        out[lang] = '%s %s\n\n%s %s\n\n%s %s' % (o[h % len(o)], lead, o[(h + 3) % len(o)], mid, o[(h + 5) % len(o)], tail)
        if period == 'weekly' and monday is not None:
            out[lang] += '\n\n%s %s' % (o[(h + 6) % len(o)], days_line(sign, monday, lang))
    return out


def week_range(d):
    """Monday to Sunday, labelled the way the old feed labelled it."""
    start = d - datetime.timedelta(days=d.weekday())
    end = start + datetime.timedelta(days=6)
    fmt = lambda x: '%s %d, %d' % (x.strftime('%b'), x.day, x.year)
    return start, end, '%s - %s' % (fmt(start), fmt(end))


def build(today=None):
    d = today or datetime.date.today()
    wstart, wend, wlabel = week_range(d)
    mlabel = d.strftime('%B %Y')
    out = {'updated': d.isoformat(), 'source': 'Nabu Tarot', 'weekly': {}, 'monthly': {}}
    mid_month = datetime.date(d.year, d.month, 15)
    for s in SIGNS:
        w = compose(s, wstart + datetime.timedelta(days=3), 'weekly', monday=wstart)
        m = compose(s, mid_month, 'monthly')
        out['weekly'][s] = {'range': wlabel, 'vi': w['vi'], 'en': w['en']}
        out['monthly'][s] = {'range': mlabel, 'vi': m['vi'], 'en': m['en']}
    return out


if __name__ == '__main__':
    data = build()
    io.open(OUT, 'w', encoding='utf-8', newline='\n').write(
        json.dumps(data, ensure_ascii=False, indent=1) + '\n')
    print('wrote', OUT, '-', len(data['weekly']), 'weekly and', len(data['monthly']), 'monthly, by Nabu')
