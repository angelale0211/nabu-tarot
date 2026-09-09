# -*- coding: utf-8 -*-
"""Bring six checks in test/test.html up to the reviewed copy.

Each of these asserted wording the localization review replaces, or assumed
the old behaviour where German fell back to English. The behaviour they guard
is kept; only the expected text and the language they read it in change.
"""
import io, sys

P = 'test/test.html'
s = io.open(P, encoding='utf-8').read()
errors = []

EDITS = [
    # The lunar animal now follows the active locale (review 30.2), and the
    # suite reads it from a Vietnamese page.
    ("ok(lt.yearAn === 'Horse' && lt.monthAn === 'Monkey' && lt.dayAn === 'Horse' && /Bính Ngọ/.test(lt.yearCC), 'English lunar names use the animal: 5/9/2026 is a Horse day in the Monkey month of the Horse year');",
     "ok(lt.yearAn === 'Ngọ (Ngựa)' && lt.monthAn === 'Thân (Khỉ)' && lt.dayAn === 'Ngọ (Ngựa)' && /Bính Ngọ/.test(lt.yearCC), 'lunar animal names follow the language on screen: 5/9/2026 is a Horse day in the Monkey month of the Horse year');"),

    # One press of the pill lands on German, which is now really German, so
    # walk the pill round to English before reading an English insight.
    ("    d.querySelector('#lang').click(); await sleep(150);\n"
     "    await waitFor(() => d.querySelector('#reveal .hero'), 4000);",
     "    for (let i = 0; i < 4 && d.querySelector('#lang').textContent.trim() !== 'EN'; i++) {\n"
     "      d.querySelector('#lang').click(); await sleep(150);\n"
     "    }\n"
     "    await waitFor(() => d.querySelector('#reveal .hero'), 4000);"),

    # Review section 4 renames life path 7.
    ("ok(/Người tìm hiểu/.test(d.querySelector('#numout').textContent), 'tapping a number explains it');",
     "ok(/Người tìm kiếm/.test(d.querySelector('#numout').textContent), 'tapping a number explains it');"),

    # Review section 2 rewrites serviceHint.
    ("/chạm thêm một lần nữa/.test(d.querySelector('#svcwrap').parentNode.textContent)",
     "/chạm lại để bỏ chọn/.test(d.querySelector('#svcwrap').parentNode.textContent)"),

    # Review section 2 renames the footer link to Quyền riêng tư.
    ("/Riêng tư/.test(d.querySelector('#foot').textContent)",
     "/Quyền riêng tư/.test(d.querySelector('#foot').textContent)"),
]

for old, new in EDITS:
    if s.count(old) != 1:
        errors.append('%d matches for %s' % (s.count(old), old[:70]))
        continue
    s = s.replace(old, new)

io.open(P, 'w', encoding='utf-8', newline='').write(s)
if errors:
    sys.stderr.write('\n'.join(errors) + '\n')
    sys.exit(1)
print('test/test.html: %d checks updated to the reviewed copy' % len(EDITS))
