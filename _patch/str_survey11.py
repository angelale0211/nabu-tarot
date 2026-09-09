# -*- coding: utf-8 -*-
"""Current German forms of every key named in review sections 11-13."""
import io, os, re, sys
sys.path.insert(0, '_patch')
from str_lib import blocks, find_key, obj_end

KEYS = """aiSugFocus aiLiteRedirect energyLine shadowLine focusHead shareText angelTop
angelWhySame angelWhyRoot lessonsIntro aiSugCard aiSugLesson aiSugSign aiSugNumbers
aiSugGeneral aiCardGeneral aiCardFocus aiYes aiNo aiMaybe aiChem aiAbout quizHow
quizFailed needWhereId accessUntil courseExpired buyMsg timeHint actPicked actComeBack
actWishCount loveAskSentHint loveAskGot perYear releasedTimes aiDrew aiSignOf aiTodayMoon
remindTitle inHours inMinutes bkOn allPostsBtn watchOn dateFmt dow months
instAndroidSteps instIosSteps maniIncl
wedPayList wedTerms wedHow wedRules wedShareMine wedStartsAt wedGuestWait wedInviteText
wedGuests wedCalTitle wedWaitingFor wedBqReady wedCaught wedShareGuest wedCupidLines
alertOfferGone alertOffer alertTied alertAsked alertNo alertWed alertGift alertAnniv
alertMark alertPet alertPetMany alertUp""".split()

src = io.open('src/strings.js', encoding='utf-8').read()
bl = blocks(src)
for k in KEYS:
    i = find_key(src, bl['de'], k)
    if i < 0:
        print('MISSING %s' % k)
        continue
    if src[i] in '[{':
        val = src[i:obj_end(src, i) + 1]
    else:
        val = src[i:src.index('\n', i)]
    print('%-18s %s' % (k, val[:300].replace('\n', ' ')))
