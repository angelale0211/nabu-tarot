# -*- coding: utf-8 -*-
"""fortune.js PC_TRAD: section 9 VI/EN revisions, then the German column."""
import io, re, sys

p = 'src/fortune.js'
s = io.open(p, encoding='utf-8').read()
errors = []


def sub1(old, new):
    global s
    if s.count(old) != 1:
        errors.append('COUNT %d :: %s' % (s.count(old), old[:90])); return
    s = s.replace(old, new)


# ---- 9. the four cards whose wording was too medical / too fixed ----
sub1("  s4: ['Ốm đau, thụt lùi; cần nghỉ ngơi để hồi phục', 'Illness, a setback; rest to recover'],",
     "  s4: ['Một bước chững lại; hãy nghỉ và hồi sức trước khi đi tiếp.', 'A setback or pause; rest and recover before moving on.'],")
sub1("  s8: ['Rắc rối, thất vọng, nguy cơ bệnh tật hay kiện tụng', 'Trouble, disappointment, a risk of illness or a lawsuit'],",
     "  s8: ['Rắc rối kéo dài, áp lực hoặc chuyện pháp lý cần thận trọng.', 'Ongoing trouble, pressure or a legal matter that calls for care.'],")
sub1("  sQ: ['Người phụ nữ lạnh lùng hoặc góa bụa; lời phê bình gắt', 'A cold or widowed woman; harsh criticism'],",
     "  sQ: ['Người phụ nữ sắc sảo, độc lập; lời phê bình gắt.', 'A sharp, independent woman; harsh criticism.'],")
sub1("  sK: ['Luật sư, quan tòa, người có quyền và tham vọng', 'A lawyer, a judge, an ambitious man of authority']",
     "  sK: ['Luật sư, thẩm phán hoặc người có quyền; lý trí và nghiêm.', 'A lawyer, judge or person in authority; rational and serious.']")

# ---- 28. the German column ----
DE = {
 'hA': 'Zuhause, neue Liebe, Freude in der Familie',
 'h2': 'Paar, erwiderte Gefühle, Aussicht auf Bindung',
 'h3': 'Vorsicht in Liebesdingen, Dreieckssituation oder Herzensentscheidung',
 'h4': 'Veränderung zuhause, eine Reise oder verzögerte Bindung',
 'h5': 'Eifersucht, Zögern oder eine Entscheidung in der Liebe',
 'h6': 'Erinnerungen, jemand aus der Vergangenheit, Großzügigkeit',
 'h7': 'Enttäuschung, ein nicht gehaltenes Versprechen oder wechselhafte Haltung',
 'h8': 'Einladung, Besuch, Geschenk oder Feier',
 'h9': 'Wunschkarte: ein Herzenswunsch kann Erfüllung finden',
 'h10': 'Großes Glück, harmonisches Familienleben, Erfolg',
 'hJ': 'Ein enger Freund oder ein freundlicher, aufrichtiger junger Mensch',
 'hQ': 'Eine sanfte, liebevolle Frau oder eine mütterliche Person',
 'hK': 'Ein warmer, großzügiger Mann oder hilfreicher Rat',
 'dA': 'Brief, Nachricht, Ring oder Neuigkeit über Geld',
 'd2': 'Eine Beziehung unter äußerem Druck, Geldstreit oder Wahl zwischen zwei Möglichkeiten',
 'd3': 'Unterlagen, rechtliche Themen, Streit oder Diskussionen zuhause',
 'd4': 'Erbe, beständige Finanzen und Sicherheit',
 'd5': 'Gute Nachricht, Verbesserung und günstige Geschäftsentwicklung',
 'd6': 'Frühe Bindung, zweite Chance und ein Hinweis, Ausgaben im Blick zu behalten',
 'd7': 'Gerede, Kritik, Geldsorgen oder ein kleiner Verlust',
 'd8': 'Spätere Bindung, kurze Reise oder Geld, das schnell kommt und geht',
 'd9': 'Überraschung, Abenteuer, unerwartetes Geld oder Unruhe',
 'd10': 'Geld, weite Reise, Hochzeit oder günstige Entwicklung',
 'dJ': 'Ein Bote oder junger Mensch mit Nachrichten; Hilfe, auf die man nicht blind vertrauen sollte',
 'dQ': 'Eine weltgewandte, gesprächige Frau; Einmischung oder Ablenkung',
 'dK': 'Ein Geschäftsmann oder eine Autoritätsperson; durchsetzungsstark und manchmal stur',
 'cA': 'Wohlstand, Erfolg und ein guter Anfang',
 'c2': 'Widerstand, Gerüchte, Enttäuschung oder Streit',
 'c3': 'Ehe, langfristige Zusammenarbeit oder zweite Chance',
 'c4': 'Veränderung und unerwartete Schwierigkeit; Konflikte möglichst nicht zusätzlich anheizen',
 'c5': 'Neue Freunde, hilfreiche Allianz oder Bindung',
 'c6': 'Gute Geschäftsentwicklung oder finanzielle Unterstützung',
 'c7': 'Wohlstand und ein guter Freund; zugleich auf Konkurrenz achten',
 'c8': 'Überarbeitung, riskantes Spiel mit dem Glück oder ein Angebot',
 'c9': 'Neue Romanze oder Meinungsverschiedenheit mit Freunden',
 'c10': 'Reise, beruflicher Erfolg und Glück nach eigener Anstrengung',
 'cJ': 'Ein verlässlicher Freund oder aufrichtiger junger Mensch',
 'cQ': 'Eine selbstbewusste, warme und hilfsbereite Frau',
 'cK': 'Ein großzügiger, loyaler Mann oder guter Berater',
 'sA': 'Ein Ende, eine schwierige Entscheidung oder eine belastende Wendung',
 's2': 'Trennung, Pause, schwierige Wahl oder Unwahrheit',
 's3': 'Herzschmerz, Verrat oder Tränen',
 's4': 'Ein Rückschritt oder eine Pause; ruh dich aus und komm wieder zu Kräften, bevor du weitergehst.',
 's5': 'Hindernisse oder Sorge; Fortschritt wird möglich, wenn sie bearbeitet werden',
 's6': 'Kleiner Fortschritt oder eine Reise, um Schwierigkeiten hinter sich zu lassen',
 's7': 'Verlust oder Warnung; Vertrauen nicht vorschnell schenken',
 's8': 'Anhaltende Schwierigkeiten, Druck oder eine rechtliche Angelegenheit, bei der Vorsicht gefragt ist.',
 's9': 'Schwere Nachricht, Sorge oder Kummer; traditionell eine der belastendsten Karten des Blatts',
 's10': 'Sorge, Gefühl von Enge und eine schwierige Phase, die sich dem Ende nähert',
 'sJ': 'Ein unzuverlässiger junger Mensch oder Konkurrent',
 'sQ': 'Eine scharfsinnige, unabhängige Frau; harte Kritik.',
 'sK': 'Ein Anwalt, Richter oder eine Autoritätsperson; rational und ernst.',
}

lines = s.split('\n')
done = set()
for i, l in enumerate(lines):
    m = re.match(r'^  ([hdcs](?:10|[2-9AJQK])): \[(.*)\](,?)$', l)
    if not m:
        continue
    key = m.group(1)
    if key not in DE:
        errors.append('unexpected PC_TRAD key %s' % key); continue
    de = DE[key].replace("'", "\\'")
    lines[i] = "  %s: [%s, '%s']%s" % (key, m.group(2), de, m.group(3))
    done.add(key)
s = '\n'.join(lines)

missing = sorted(set(DE) - done)
if missing:
    errors.append('PC_TRAD keys not rewritten: %s' % ', '.join(missing))

# the two readers of PC_TRAD in fortune.js itself
s = s.replace("const trad = PC_TRAD[suit + rank] || ['', ''];",
              "const trad = PC_TRAD[suit + rank] || ['', '', ''];")

io.open(p, 'w', encoding='utf-8', newline='').write(s)
if errors:
    sys.stderr.write('\n'.join(errors) + '\n'); sys.exit(1)
print('PC_TRAD: %d entries given a German column' % len(done))
