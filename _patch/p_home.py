# -*- coding: utf-8 -*-
"""home.js, section 30.3: date locale, world calendars, quick links, greeting.
The TOUR block and every authored feed/horoscope string are left untouched."""
import io, sys

p = 'src/home.js'
s = io.open(p, encoding='utf-8').read()
errors = []


def sub1(old, new):
    global s
    if s.count(old) != 1:
        errors.append('COUNT %d :: %s' % (s.count(old), old[:100])); return
    s = s.replace(old, new)


# ---- date locale ----
sub1("  const greg = now.toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });",
     "  const dateLocale = lang === 'vi' ? 'vi-VN' : (lang === 'de' ? 'de-DE' : 'en-GB');\n"
     "  const intlLocale = lang === 'vi' ? 'vi' : (lang === 'de' ? 'de' : 'en');\n"
     "  const greg = now.toLocaleDateString(dateLocale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });")

# ---- lunar row ----
sub1("  const leap = lu.leap ? (lang === 'vi' ? ' (nhuận)' : ' (leap)') : '';",
     "  const leap = lu.leap ? (lang === 'vi' ? ' (nhuận)' : (lang === 'de' ? ' · Schaltmonat' : ' (leap)')) : '';")

sub1("""  rows.push([lang === 'vi' ? 'Âm lịch' : 'Lunar (VN)', lang === 'vi'
    ? 'Ngày ' + lu.day + ' tháng ' + lu.month + leap + ' năm ' + lu.yearCC + ' (' + lu.year + ')'
    : 'Day ' + lu.day + ' of lunar month ' + lu.month + leap + ', year of the ' + lu.yearAn + ' (' + lu.year + ')']);""",
     """  rows.push([lang === 'vi' ? 'Âm lịch' : (lang === 'de' ? 'Mondkalender (VN)' : 'Lunar (VN)'), lang === 'vi'
    ? 'Ngày ' + lu.day + ' tháng ' + lu.month + leap + ' năm ' + lu.yearCC + ' (' + lu.year + ')'
    : (lang === 'de'
      ? 'Tag ' + lu.day + ' · Mondmonat ' + lu.month + leap + ' · Jahr ' + lu.year
      : 'Day ' + lu.day + ' of lunar month ' + lu.month + leap + ', year of the ' + lu.yearAn + ' (' + lu.year + ')')]);""")

# ---- can chi / animal signs row ----
sub1("""  rows.push(lang === 'vi' ? ['Can chi', 'Ngày ' + lu.dayCC + ' · tháng ' + lu.monthCC + ' · năm ' + lu.yearCC]
    : ['Animal signs', 'Day of the ' + lu.dayAn + ' · month of the ' + lu.monthAn + ' · year of the ' + lu.yearAn]);""",
     """  rows.push(lang === 'vi' ? ['Can chi', 'Ngày ' + lu.dayCC + ' · tháng ' + lu.monthCC + ' · năm ' + lu.yearCC]
    : (lang === 'de'
      ? ['Tierzeichen', lu.dayAn + ' · ' + lu.monthAn + ' · ' + lu.yearAn]
      : ['Animal signs', 'Day of the ' + lu.dayAn + ' · month of the ' + lu.monthAn + ' · year of the ' + lu.yearAn]));""")

# ---- the other calendars ----
sub1("  const others = [['islamic-umalqura', lang === 'vi' ? 'Hồi giáo (Hijri)' : 'Islamic (Hijri)'], ['hebrew', lang === 'vi' ? 'Do Thái' : 'Hebrew'], ['persian', lang === 'vi' ? 'Ba Tư' : 'Persian'], ['buddhist', lang === 'vi' ? 'Phật lịch (Thái)' : 'Buddhist (Thai)']];",
     "  const calName = (vi, en, de) => lang === 'vi' ? vi : (lang === 'de' ? de : en);\n"
     "  const others = [['islamic-umalqura', calName('Hồi giáo (Hijri)', 'Islamic (Hijri)', 'Islamischer Kalender (Hijri)')], ['hebrew', calName('Do Thái', 'Hebrew', 'Hebräischer Kalender')], ['persian', calName('Ba Tư', 'Persian', 'Persischer Kalender')], ['buddhist', calName('Phật lịch (Thái)', 'Buddhist (Thai)', 'Buddhistischer Kalender (Thailand)')]];")

sub1("const v = calLine(o[0], lang === 'vi' ? 'vi' : 'en', { day: 'numeric', month: 'long', year: 'numeric' });",
     "const v = calLine(o[0], intlLocale, { day: 'numeric', month: 'long', year: 'numeric' });")

# ---- moon row ----
sub1("  rows.push([lang === 'vi' ? 'Trăng' : 'Moon', MOON_ICONS[mp.idx] + ' ' + MOON_NAMES[lang][mp.idx] + ' · ' + (lang === 'vi' ? 'ngày ' : 'day ') + Math.round(mp.age)]);",
     "  rows.push([lang === 'vi' ? 'Trăng' : (lang === 'de' ? 'Mond' : 'Moon'), MOON_ICONS[mp.idx] + ' ' + MOON_NAMES[lang][mp.idx] + ' · ' + (lang === 'vi' ? 'ngày ' : (lang === 'de' ? 'Tag ' : 'day ')) + Math.round(mp.age)]);")

# ---- the sign strip's date range ----
sub1("esc(lang === 'vi' ? z.dvi : z.den)", "esc(lang === 'vi' ? z.dvi : (lang === 'de' ? (z.dde || z.den) : z.den))")

# ---- quick-link subtitles ----
for vi, en, de in [
    ('năng lượng hôm nay', 'your energy today', 'deine Energie heute'),
    ('bài mới của Nabu', 'new posts from Nabu', 'neue Beiträge von Nabu'),
    ('12 cung, hành tinh, nhà', '12 signs, planets, houses', '12 Zeichen, Planeten, Häuser'),
    ('78 lá, ý nghĩa', '78 cards, meanings', '78 Karten, Bedeutungen'),
    ('hẹn giờ với Nabu', 'book a time with Nabu', 'Termin bei Nabu'),
    ('các gói xem bài', 'reading packages', 'Legungspakete')]:
    sub1("lang === 'vi' ? '%s' : '%s'" % (vi, en),
         "lang === 'vi' ? '%s' : (lang === 'de' ? '%s' : '%s')" % (vi, de, en))

# ---- greeting subtitle ----
sub1("esc(lang === 'vi' ? 'Hôm nay bạn muốn làm gì?' : 'What would you like to do today?')",
     "esc(lang === 'vi' ? 'Hôm nay bạn muốn làm gì?' : (lang === 'de' ? 'Was möchtest du heute machen?' : 'What would you like to do today?'))")

io.open(p, 'w', encoding='utf-8', newline='').write(s)
if errors:
    sys.stderr.write('\n'.join(errors) + '\n'); sys.exit(1)
print('home.js: section 30.3 applied')
