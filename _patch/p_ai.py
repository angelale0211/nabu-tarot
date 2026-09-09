# -*- coding: utf-8 -*-
"""ai.js, section 30.7: German output, the reworded Major Arcana timing line in
all three languages, and a German system prompt."""
import io, re, sys

p = 'src/ai.js'
s = io.open(p, encoding='utf-8').read()
errors = []


def sub1(old, new):
    global s
    if s.count(old) != 1:
        errors.append('COUNT %d :: %s' % (s.count(old), old[:110])); return
    s = s.replace(old, new)


# ---- moon prefix ----
sub1("(lang === 'vi' ? 'Hôm nay là ' : 'Today is ')",
     "(lang === 'vi' ? 'Hôm nay là ' : (lang === 'de' ? 'Heute ist ' : 'Today is '))")

# ---- SUIT_TIMING: replace the whole table (the Major line is reworded in all
#      three languages; Wands/Cups/Swords/Pentacles keep their wording) ----
m = re.search(r'^const SUIT_TIMING = \{.*?^\};$', s, re.S | re.M)
if not m:
    errors.append('SUIT_TIMING not found')
else:
    table = """const SUIT_TIMING = {
  vi: { wands: 'Gậy đi nhanh: vài ngày đến vài tuần.', cups: 'Cốc đi theo cảm xúc: vài tuần, đôi khi một mùa.', swords: 'Kiếm đi rất nhanh, thường tính bằng ngày, nhưng hay đến bất ngờ.', pentacles: 'Tiền đi chậm: tính bằng tháng, có khi cả năm.', major: 'Ẩn Chính thường không hợp để chốt thời gian cụ thể. Hãy đọc chúng như những giai đoạn hoặc bài học lớn hơn là một mốc lịch chính xác.' },
  en: { wands: 'Wands move fast: days to a few weeks.', cups: 'Cups move with feeling: weeks, sometimes a season.', swords: 'Swords move very fast, usually days, and often arrive unexpectedly.', pentacles: 'Pentacles are slow: months, sometimes a year.', major: 'Major Arcana are usually poor tools for exact timing. Read them as larger phases or lessons rather than a precise date.' },
  de: { wands: 'Stäbe sind schnell: wenige Tage bis einige Wochen.', cups: 'Kelche folgen Gefühlen: einige Wochen, manchmal eine Jahreszeit.', swords: 'Schwerter sind sehr schnell, oft nur Tage, und kommen häufig unerwartet.', pentacles: 'Münzen sind langsam: Monate, manchmal ein Jahr.', major: 'Die Große Arkana eignet sich meist nicht für genaue Zeitangaben. Lies sie eher als größere Phasen oder Themen als als konkretes Datum.' }
};"""
    s = s[:m.start()] + table + s[m.end():]

# ---- sign date range ----
sub1("(lang === 'vi' ? z.dvi : z.den)", "(lang === 'vi' ? z.dvi : (lang === 'de' ? (z.dde || z.den) : z.den))")

# ---- house label ----
sub1("(lang === 'vi' ? 'nhà ' : 'house ')", "(lang === 'vi' ? 'nhà ' : (lang === 'de' ? 'Haus ' : 'house '))")

# ---- sources label ----
sub1("(lang === 'vi' ? 'Tham khảo: ' : 'Sources: ')",
     "(lang === 'vi' ? 'Tham khảo: ' : (lang === 'de' ? 'Quellen: ' : 'Sources: '))")

# ---- German system prompt ----
DE_PROMPT = ("Du bist Nabu AI, der Assistent in der Nabu-Tarot-App einer vietnamesischen Tarot-Readerin. "
             "Du beantwortest allgemeine Fragen ebenso wie Fragen zu Tarot, Lenormand, Astrologie und Numerologie. "
             "Antworte auf einfache Fragen direkt und präzise; nutze aktuelle Informationen, wenn sie nötig und verfügbar sind. "
             "Schreib in natürlichem, warmem Deutsch, sprich die Person mit \\'du\\' an und halte dich meist an 2–8 kurze Sätze. "
             "Wenn die Frage zu dem Inhalt gehört, den die Person gerade in der App sieht, nutze zuerst das bereitgestellte WISSEN. "
             "Stelle keine medizinischen Diagnosen, gib keine konkrete Rechts- oder Anlageberatung und versprich keine sicheren "
             "zukünftigen Ereignisse. Bei wichtigen persönlichen Themen kannst du eine private Legung bei Nabu empfehlen.")
sub1("function aiSystemPrompt() {\n  return lang === 'vi'",
     "function aiSystemPrompt() {\n  if (lang === 'de') return '" + DE_PROMPT + "';\n  return lang === 'vi'")

io.open(p, 'w', encoding='utf-8', newline='').write(s)
if errors:
    sys.stderr.write('\n'.join(errors) + '\n'); sys.exit(1)
print('ai.js: section 30.7 applied')
