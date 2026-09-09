# -*- coding: utf-8 -*-
"""strings.js — two last things in the German block.

`zodiac` is the list review section 3 specifies for STR.de. The rest are
English fragments a leaf-by-leaf comparison of STR.en against STR.de still
turned up after sections 2, 11-13 and 35 had been applied. The review file
does not give wording for them, so they are translated here in the register
the surrounding German already uses; they are listed in the final report.
"""
import io, re, sys
sys.path.insert(0, '_patch')
from str_lib import blocks, find_key, read_str

P = 'src/strings.js'
errors = []

DE = {
    # review section 3
    'zodiac': "['Widder', 'Stier', 'Zwillinge', 'Krebs', 'Löwe', 'Jungfrau', 'Waage', 'Skorpion', 'Schütze', 'Steinbock', 'Wassermann', 'Fische']",
    # residual English fragments
    'actArts': "['Kerze', 'Blüte', 'Mondsichel', 'Amethyst', 'Sonne', 'Schlüssel', 'Feder', 'Wellen', 'Lotus', 'Diamant']",
    'actMore': "(n) => 'Weitere ' + n + ' anzeigen'",
    'actPileN': "(n) => 'Stapel ' + n",
    'actVotes': "(n) => n + ' Stimmen'",
    'activeUntil': "(d) => 'aktiv bis ' + d",
    'expiredOn': "(d) => 'abgelaufen am ' + d",
    'codeAdded': "(n) => n + ' Codes hinzugefügt.'",
    'errHint': "(n) => n + ' erfasst, neueste zuerst.'",
    'diaryCount': "(n) => n + ' Tage geschrieben'",
    'diaryShareAsk': "(n) => n + ' mein Tagebuch lesen lassen'",
    'diaryTheirs': "(n) => 'Tagebuch von ' + n",
    'lifePathOf': "(n) => 'Lebenszahl ' + n",
    'loveDaysN': "(n) => n + ' Tage'",
    'loveEngagedOn': "(d) => 'Seit ' + d",
    'loveMarriedOn': "(d) => 'Seit ' + d",
    'loveSince': "(d) => 'Seit ' + d",
    'luckCoinsUsed': "(n) => n + ' Nabu-Münzen eingesetzt'",
    'luckGaveBack': "(n) => n + ' Münzen zurückgegeben.'",
    'luckVoucherOf': "(p) => p + '%-Gutschein'",
    'luckWorth': "(s) => 'Entspricht ' + s + ' bei allem, was es hier gibt.'",
    'petFeedWith': "(n) => 'Füttern mit ' + n.toLowerCase()",
    'petMeals': "(n) => n + ' Mahlzeiten'",
    'petRoomLeft': "(n) => n + ' Plätze frei'",
    'petStreak': "(n) => n + ' Tage in Folge'",
    'wedCannotCome': "(n) => n + ' können nicht kommen:'",
    'wedGiftsTotal': "(n) => n + ' insgesamt'",
    'quizIntro': "(n, p) => n + ' Fragen · bestanden ab ' + p + ' %'",
    'quizProgress': "(d, t) => d + ' von ' + t + ' Tests bestanden.'",
}


def value_end(s, i):
    depth = 0
    while i < len(s):
        c = s[i]
        if c == "'" or c == '"':
            _, i = read_str(s, i)
        elif c in '([{':
            depth += 1
        elif c in ')]}':
            if depth == 0:
                return i
            depth -= 1
        elif c == ',' and depth == 0:
            return i
        i += 1
    return i


src = io.open(P, encoding='utf-8').read()
done = 0
for key, val in DE.items():
    span = blocks(src)['de']
    hits = len(re.findall(r'(?<![\w.$])' + re.escape(key) + r': ', src[span[0]:span[1]]))
    if hits != 1:
        errors.append('%s: %d matches in the German block' % (key, hits))
        continue
    i = find_key(src, span, key)
    src = src[:i] + val + src[value_end(src, i):]
    done += 1

io.open(P, 'w', encoding='utf-8', newline='').write(src)
if errors:
    sys.stderr.write('\n'.join(errors) + '\n')
    sys.exit(1)
print('strings.js: STR.de zodiac + %d residual English fragments translated' % (done - 1))
