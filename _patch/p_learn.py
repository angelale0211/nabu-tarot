# -*- coding: utf-8 -*-
"""learn.js, section 30.4: the Q&A renderer reads the active locale, the
category names are localized, and the astrology labels get a German arm."""
import io, sys

p = 'src/learn.js'
s = io.open(p, encoding='utf-8').read()
errors = []


def sub1(old, new):
    global s
    if s.count(old) != 1:
        errors.append('COUNT %d :: %s' % (s.count(old), old[:100])); return
    s = s.replace(old, new)


# ---- the Q&A lookup and its categories ----
sub1("  const asks = lang === 'vi' ? (ASK.vi[id] || []) : [];",
     "  const asks = (ASK[lang] && ASK[lang][id]) ? ASK[lang][id] : (ASK.vi[id] || []);")

sub1("  const catName = { love: 'Tình cảm', career: 'Công việc', money: 'Tiền bạc', health: 'Sức khỏe', timing: 'Thời gian', verdict: 'Có / không', other: 'Khác' };",
     """  const ASK_CAT = {
    love: { vi: 'Tình cảm', en: 'Love', de: 'Liebe' },
    career: { vi: 'Công việc', en: 'Career', de: 'Arbeit' },
    work: { vi: 'Công việc', en: 'Work', de: 'Arbeit' },
    study: { vi: 'Học tập', en: 'Study', de: 'Lernen' },
    money: { vi: 'Tiền bạc', en: 'Money', de: 'Geld' },
    health: { vi: 'Sức khỏe', en: 'Health', de: 'Gesundheit' },
    timing: { vi: 'Thời gian', en: 'Timing', de: 'Zeit' },
    verdict: { vi: 'Có / không', en: 'Yes / no', de: 'Ja / Nein' },
    other: { vi: 'Khác', en: 'Other', de: 'Sonstiges' }
  };
  const catName = {};
  Object.keys(ASK_CAT).forEach((k) => { catName[k] = ASK_CAT[k][lang] || ASK_CAT[k].en; });""")

# ---- decan / court spans ----
sub1("  if (a.k === 'decan') return nm(planet) + ' ' + (lang === 'vi' ? 'trong' : 'in') + ' ' + nm(sign) + ' · ' + (lang === 'vi' ? a.dvi : a.den) + ' · ' + (lang === 'vi' ? a.tvi : a.ten);",
     "  if (a.k === 'decan') return nm(planet) + ' ' + (lang === 'vi' ? 'trong' : (lang === 'de' ? 'in' : 'in')) + ' ' + nm(sign) + ' · ' + (lang === 'vi' ? a.dvi : (lang === 'de' ? (a.dde || a.den) : a.den)) + ' · ' + (lang === 'vi' ? a.tvi : (lang === 'de' ? (a.tde || a.ten) : a.ten));")

sub1("  if (a.k === 'court') return nm(sign) + ' (' + (lang === 'vi' ? 'cuối ' : 'late ') + ZSIGN[a.prev][lang] + ' → ' + sign[lang] + ')';",
     "  if (a.k === 'court') return nm(sign) + ' (' + (lang === 'vi' ? 'cuối ' : (lang === 'de' ? 'Ende ' : 'late ')) + ZSIGN[a.prev][lang] + ' → ' + sign[lang] + ')';")

# ---- astrology tabs ----
for vi, en, de in [('12 cung', '12 signs', '12 Zeichen'), ('Hành tinh', 'Planets', 'Planeten'),
                   ('12 nhà', '12 houses', '12 Häuser'), ('Góc chiếu', 'Aspects', 'Aspekte')]:
    sub1("(lang === 'vi' ? '%s' : '%s')" % (vi, en),
         "(lang === 'vi' ? '%s' : (lang === 'de' ? '%s' : '%s'))" % (vi, de, en))

# ---- house wheel hint ----
sub1("esc(lang === 'vi' ? 'Chạm vào một nhà trên bánh xe. Nhà 1 bắt đầu ở bên trái, chỗ cung Mọc.' : 'Tap a house on the wheel. House 1 starts on the left, at the Ascendant.')",
     "esc(lang === 'vi' ? 'Chạm vào một nhà trên bánh xe. Nhà 1 bắt đầu ở bên trái, chỗ cung Mọc.' : (lang === 'de' ? 'Tipp auf ein Haus im Rad. Haus 1 beginnt links am Aszendenten.' : 'Tap a house on the wheel. House 1 starts on the left, at the Ascendant.'))")

# ---- sign detail: secondary name and the date range ----
sub1("esc(lang === 'vi' ? z.en : z.vi)", "esc(lang === 'vi' ? z.en : (lang === 'de' ? z.en : z.vi))")
sub1("esc(lang === 'vi' ? z.dvi : z.den)", "esc(lang === 'vi' ? z.dvi : (lang === 'de' ? (z.dde || z.den) : z.den))")

# ---- spread card count (two call sites) ----
old_c = "+ s.n + (lang === 'vi' ? ' lá' : ' cards')"
new_c = "+ s.n + (lang === 'vi' ? ' lá' : (lang === 'de' ? ' Karten' : ' cards'))"
if s.count(old_c) != 2:
    errors.append('card-count sites: %d' % s.count(old_c))
else:
    s = s.replace(old_c, new_c)

# ---- the Vietnamese-zodiac year line ----
sub1("(lang === 'vi' ? esc(animalOf(b.y).vi) + ' · ' + esc(canChi(b.y)) : 'Year of the ' + esc(animalOf(b.y).en) + ' (' + b.y + ')')",
     "(lang === 'vi' ? esc(animalOf(b.y).vi) + ' · ' + esc(canChi(b.y)) : (lang === 'de' ? 'Jahrestier: ' + esc(animalOf(b.y).de || animalOf(b.y).en) + ' (' + b.y + ')' : 'Year of the ' + esc(animalOf(b.y).en) + ' (' + b.y + ')'))")

io.open(p, 'w', encoding='utf-8', newline='').write(s)
if errors:
    sys.stderr.write('\n'.join(errors) + '\n'); sys.exit(1)
print('learn.js: section 30.4 applied')
