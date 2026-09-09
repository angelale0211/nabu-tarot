# -*- coding: utf-8 -*-
"""Two leftovers.

Section 14 gives the in-app reading option its Vietnamese and English wording
(the German came with the 29.6 pack). Section 31.2 asks for the privacy file's
Vietnamese spelling to be normalised now that the file has been edited.
"""
import io, re, sys

errors = []

# ---- section 14: BOOK_WHERE 'app' ----
P = 'src/services.js'
s = io.open(P, encoding='utf-8').read()
pairs = [
    ("vi: 'Nabu nhắn thẳng vào mục Hồ sơ của bạn. Bạn mở trên máy tính hay trên điện thoại đều thấy.'",
     "vi: 'Nabu nhắn trực tiếp trong mục Hồ sơ. Bạn có thể xem lại trên cả điện thoại và máy tính.'"),
    ("en: 'Nabu replies straight into your Profile tab. You see it on the website and in the app.'",
     "en: 'Nabu replies directly under Profile. You can revisit the reading on both phone and computer.'"),
]
for old, new in pairs:
    if s.count(old) != 1:
        errors.append('services.js: %d matches for %s' % (s.count(old), old[:40]))
        continue
    s = s.replace(old, new)
io.open(P, 'w', encoding='utf-8', newline='').write(s)
print('services.js: the in-app reading option now uses the section 14 wording')

# ---- section 31.2: Vietnamese spelling in the privacy file ----
P = 'privacy.json'
s = io.open(P, encoding='utf-8').read()
n = len(re.findall('xoá|khoá', s))
s = s.replace('xoá', 'xóa').replace('khoá', 'khóa')
io.open(P, 'w', encoding='utf-8', newline='\n').write(s)
print('privacy.json: %d Vietnamese spellings normalised' % n)

if errors:
    sys.stderr.write('\n'.join(errors) + '\n')
    sys.exit(1)
