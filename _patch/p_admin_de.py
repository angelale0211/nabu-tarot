# -*- coding: utf-8 -*-
"""German in the two things Nabu writes in: the post composer and the
activity editor.

Both already take Vietnamese and English. This adds a German box beside each
of them — post title and body; activity title, intro, poll options and every
pile message — and carries the value through save and reload. Nothing about
how a post or an activity is published changes; there is simply one more
language in the record.

The activity editor also gains a button that fills any missing German on the
published activities from the two files in the repository, because the live
list is read from the cloud first (`loadContent`) and the files are only the
fallback.
"""
import io, re, sys

errors = []


def sub1(path, old, new, note):
    s = io.open(path, encoding='utf-8').read()
    if s.count(old) != 1:
        errors.append('%s: %d matches for %s' % (path, s.count(old), note))
        return
    io.open(path, 'w', encoding='utf-8', newline='').write(s.replace(old, new))


# ------------------------------------------------- strings, all three ------
LABELS = {
    'vi': {'postTitleDe': 'Tiêu đề (tiếng Đức)', 'postBodyDe': 'Nội dung (tiếng Đức)',
           'actOptionsDe': 'Lựa chọn (tiếng Đức, mỗi dòng một lựa chọn)',
           'actIntroDe': 'Lời dẫn (tiếng Đức)', 'actPileMsgDe': 'Thông điệp tiếng Đức',
           'actFillDe': '🇩🇪 Lấy bản tiếng Đức từ tệp',
           'actFillDeHint': 'Điền phần tiếng Đức còn thiếu cho các hoạt động đã đăng, lấy từ activities.json và activities-stock.json.'},
    'en': {'postTitleDe': 'Title (German)', 'postBodyDe': 'Body (German)',
           'actOptionsDe': 'Options in German, one per line',
           'actIntroDe': 'Intro (German)', 'actPileMsgDe': 'German message',
           'actFillDe': '🇩🇪 Fill German from the files',
           'actFillDeHint': 'Fills any missing German on the published activities from activities.json and activities-stock.json.'},
    'de': {'postTitleDe': 'Titel (Deutsch)', 'postBodyDe': 'Text (Deutsch)',
           'actOptionsDe': 'Antworten auf Deutsch, eine pro Zeile',
           'actIntroDe': 'Einleitung (Deutsch)', 'actPileMsgDe': 'Deutsche Botschaft',
           'actFillDe': '🇩🇪 Deutsch aus den Dateien übernehmen',
           'actFillDeHint': 'Ergänzt fehlendes Deutsch bei den veröffentlichten Aktivitäten aus activities.json und activities-stock.json.'},
}
P = 'src/strings.js'
s = io.open(P, encoding='utf-8').read()
if 'postTitleDe' in s:
    print('strings.js: the German composer labels are already there')
else:
    for lg, keys in LABELS.items():
        m = re.search(r'(?<![\w.$])postTitleEn: ', s[s.index('\n  %s: {' % lg):])
        if not m:
            errors.append('strings.js: postTitleEn missing from %s' % lg)
            continue
        at = s.index('\n  %s: {' % lg) + m.start() + 1
        line = ''.join("%s: '%s', " % (k, v.replace("'", "\\'")) for k, v in keys.items())
        s = s[:at] + line + s[at:]
    io.open(P, 'w', encoding='utf-8', newline='').write(s)
    print('strings.js: 6 composer labels added in VI/EN/DE')

# --------------------------------------------------- admin.js: posts ------
sub1('src/admin.js',
     "+ '<label class=\"f\" for=\"pbody_en\">' + esc(S.postBodyEn) + '</label><textarea id=\"pbody_en\"></textarea>'",
     "+ '<label class=\"f\" for=\"pbody_en\">' + esc(S.postBodyEn) + '</label><textarea id=\"pbody_en\"></textarea>'\n"
     "    + '<label class=\"f\" for=\"ptitle_de\">' + esc(S.postTitleDe) + '</label><input id=\"ptitle_de\">'\n"
     "    + '<label class=\"f\" for=\"pbody_de\">' + esc(S.postBodyDe) + '</label><textarea id=\"pbody_de\"></textarea>'",
     'the post form')

sub1('src/admin.js',
     "title: { vi: v('#ptitle'), en: v('#ptitle_en') }, body: { vi: v('#pbody'), en: v('#pbody_en') }, cards: admin.cards.slice(),",
     "title: { vi: v('#ptitle'), en: v('#ptitle_en'), de: v('#ptitle_de') }, body: { vi: v('#pbody'), en: v('#pbody_en'), de: v('#pbody_de') }, cards: admin.cards.slice(),",
     'formPost')

sub1('src/admin.js',
     "$('#pbody').value = post ? L2(post.body, 'vi') : ''; $('#pbody_en').value = post ? L2(post.body, 'en') : '';",
     "$('#pbody').value = post ? L2(post.body, 'vi') : ''; $('#pbody_en').value = post ? L2(post.body, 'en') : '';\n"
     "    $('#ptitle_de').value = post ? L2(post.title, 'de') : ''; $('#pbody_de').value = post ? L2(post.body, 'de') : '';",
     'fillForm')

# ------------------------------------------------ play.js: activities ------
sub1('src/play.js',
     "<input id=\"atitle_en\" value=\"' + esc(L2(a.title, 'en')) + '\">'",
     "<input id=\"atitle_en\" value=\"' + esc(L2(a.title, 'en')) + '\"><label class=\"f\" for=\"atitle_de\">' + esc(S.postTitleDe) + '</label><input id=\"atitle_de\" value=\"' + esc(L2(a.title, 'de')) + '\">'",
     'activity title')

sub1('src/play.js',
     "+ '<label class=\"f\" for=\"aintro\">' + esc(S.actIntroLabel) + '</label><textarea id=\"aintro\">' + esc(L2(a.intro, 'vi')) + '</textarea>'",
     "+ '<label class=\"f\" for=\"aintro\">' + esc(S.actIntroLabel) + '</label><textarea id=\"aintro\">' + esc(L2(a.intro, 'vi')) + '</textarea>'\n"
     "      + '<label class=\"f\" for=\"aintro_de\">' + esc(S.actIntroDe) + '</label><textarea id=\"aintro_de\">' + esc(L2(a.intro, 'de')) + '</textarea>'",
     'activity intro')

sub1('src/play.js',
     "<textarea data-pmsgen=\"' + i + '\" placeholder=\"' + esc(S.actPileMsgEn) + '\" style=\"min-height:60px;margin-top:6px\">' + esc(L2(pl.msg, 'en')) + '</textarea></div>'",
     "<textarea data-pmsgen=\"' + i + '\" placeholder=\"' + esc(S.actPileMsgEn) + '\" style=\"min-height:60px;margin-top:6px\">' + esc(L2(pl.msg, 'en')) + '</textarea>"
     "<textarea data-pmsgde=\"' + i + '\" placeholder=\"' + esc(S.actPileMsgDe) + '\" style=\"min-height:60px;margin-top:6px\">' + esc(L2(pl.msg, 'de')) + '</textarea></div>'",
     'pile rows')

sub1('src/play.js',
     "<textarea id=\"aopts\">' + esc((a.options || []).map((o) => L2(o, 'vi')).join('\\n')) + '</textarea>",
     "<textarea id=\"aopts\">' + esc((a.options || []).map((o) => L2(o, 'vi')).join('\\n')) + '</textarea>"
     "<label class=\"f\" for=\"aopts_de\">' + esc(S.actOptionsDe) + '</label><textarea id=\"aopts_de\">' + esc((a.options || []).map((o) => L2(o, 'de')).join('\\n')) + '</textarea>",
     'poll options')

sub1('src/play.js',
     "title: { vi: $('#atitle').value.trim(), en: $('#atitle_en').value.trim() }, intro: { vi: $('#aintro').value.trim(), en: (cur && cur.intro && cur.intro.en) || '' },",
     "title: { vi: $('#atitle').value.trim(), en: $('#atitle_en').value.trim(), de: $('#atitle_de').value.trim() }, intro: { vi: $('#aintro').value.trim(), en: (cur && cur.intro && cur.intro.en) || '', de: $('#aintro_de').value.trim() },",
     'read(): title and intro')

sub1('src/play.js',
     "const o = { label: inp.value.trim(), msg: { vi: $('[data-pmsg=\"' + i + '\"]', p).value.trim(), en: $('[data-pmsgen=\"' + i + '\"]', p).value.trim() } };",
     "const o = { label: inp.value.trim(), msg: { vi: $('[data-pmsg=\"' + i + '\"]', p).value.trim(), en: $('[data-pmsgen=\"' + i + '\"]', p).value.trim(), de: $('[data-pmsgde=\"' + i + '\"]', p).value.trim() } };",
     'read(): pile messages')

# German options are read line for line beside the Vietnamese ones.
sub1('src/play.js',
     "if (type === 'poll') a.options = $('#aopts').value.split('\\n').map((x) => x.trim()).filter(Boolean).map((x) => { const old = ((cur && cur.options) || []).filter((o) => L2(o, 'vi') === x)[0]; return old && old.en ? { vi: x, en: old.en } : { vi: x }; });",
     "if (type === 'poll') {\n"
     "        const de = $('#aopts_de').value.split('\\n').map((x) => x.trim());\n"
     "        a.options = $('#aopts').value.split('\\n').map((x) => x.trim()).filter(Boolean).map((x, i) => {\n"
     "          const old = ((cur && cur.options) || []).filter((o) => L2(o, 'vi') === x)[0], o = { vi: x };\n"
     "          if (old && old.en) o.en = old.en;\n"
     "          /* The German list is read line for line against the Vietnamese one; a\n"
     "             line left blank keeps whatever that option already had. */\n"
     "          if (de[i]) o.de = de[i]; else if (old && old.de) o.de = old.de;\n"
     "          return o;\n"
     "        });\n"
     "      }",
     'read(): poll options')

io.open('src/play.js', 'a', encoding='utf-8').write('')
if errors:
    sys.stderr.write('\n'.join(errors) + '\n')
    sys.exit(1)
print('admin.js and play.js: German boxes added to both composers')
