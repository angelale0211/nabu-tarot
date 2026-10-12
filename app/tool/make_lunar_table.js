// Writes ios/TodayWidget/lunar.json for the home-screen widget, from the
// site's own calendar code, so the widget can never disagree with the app.
//   node tool/make_lunar_table.js   (from app/; rerun before 2032)
// Each day: [lunar day, lunar month, leap 0/1, year can chi, animal 0-11 (Rat first), moon phase 0-7].
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const src = (f) => fs.readFileSync(path.join(__dirname, '..', '..', 'src', f), 'utf8');
const box = { Math, Date };
vm.createContext(box);
// What lunar.js needs from astro-kb.js: the stems and branches and the year's name.
const kb = src('astro-kb.js');
const pick = (re) => { const m = kb.match(re); if (!m) throw new Error('not found: ' + re); return m[0]; };
vm.runInContext([
  pick(/const CAN = \[[^\]]*\];/),
  pick(/const CHI = \[[^\]]*\];/),
  pick(/const canChi = \(year\) => [^\n]*/),
  pick(/function moonPhase\(date\) \{[\s\S]*?\n\}/),
  src('lunar.js').replace(/const branchAnimal[\s\S]*$/, ''),
  'this.out = { solarToLunar, canChi, moonPhase };',
].join('\n'), box);
const { solarToLunar, canChi, moonPhase } = box.out;

const FROM = new Date(Date.UTC(2026, 0, 1)), TO = new Date(Date.UTC(2032, 0, 1));
const days = [];
for (let d = new Date(FROM); d < TO; d = new Date(d.getTime() + 86400000)) {
  const l = solarToLunar(d.getUTCDate(), d.getUTCMonth() + 1, d.getUTCFullYear());
  // The phase at noon in Vietnam, the middle of the day the widget shows.
  const noon = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 5));
  days.push([l.day, l.month, l.leap ? 1 : 0, canChi(l.year), (((l.year - 4) % 12) + 12) % 12, moonPhase(noon).idx]);
}
const out = path.join(__dirname, '..', 'ios', 'TodayWidget', 'lunar.json');
fs.writeFileSync(out, JSON.stringify({ from: '2026-01-01', days }));
console.log('wrote', days.length, 'days to', out);
