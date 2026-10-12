// Writes assets/cards/cards.json for the app's own (native) screens, from the
// site's sources, so both always say the same thing:
//   node tool/export_cards.js          (from app/; rerun when card texts change)
// For each of the 78 tarot cards: id, suit, and per language (vi, en, de) the
// name, meta line, keywords, upright and reversed meaning, and the quick
// reading the Draw screen gives (energy, love, work, study, money, advice).
// The picture is the site's own card drawing, as a standalone SVG.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..', '..');
const build = fs.readFileSync(path.join(ROOT, 'build.py'), 'utf8');
const list = build.match(/SCRIPTS = \[([\s\S]*?)\]/)[1].match(/'([^']+\.js)'/g).map((s) => s.slice(1, -1));
const upto = list.slice(0, list.indexOf('core.js') + 1);

// A browser that answers everything and does nothing.
const nothing = new Proxy(function () {}, {
  get: (t, k) => (k === Symbol.toPrimitive ? () => '' : k === 'length' ? 0 : nothing),
  apply: () => nothing, construct: () => nothing, set: () => true,
});
const mem = {};
const box = {
  console, Math, Date, JSON, Object, Array, String, Number, Boolean, RegExp, Error, Promise, Set, Map, Symbol, Intl, parseInt, parseFloat, isNaN, encodeURIComponent, decodeURIComponent, setTimeout: () => 0, clearTimeout: () => {},
  localStorage: { getItem: (k) => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: (k) => { delete mem[k]; } },
  navigator: { userAgent: 'node', language: 'vi' }, location: { hash: '', href: 'https://nabutarot.com/', search: '' },
  document: nothing, matchMedia: () => ({ matches: false, addEventListener() {} }), addEventListener() {}, fetch: () => new Promise(() => {}),
};
box.window = box; box.self = box; box.globalThis = box;
vm.createContext(box);
const code = upto.map((f) => fs.readFileSync(path.join(ROOT, 'src', f), 'utf8')).join('\n;\n')
  + '\n;this.__out = { DECK, buildDeck, insightOf, faceSVG, LEX, DECKTEXT, STR };';
vm.runInContext(code, box, { filename: 'site.js' });
const { buildDeck, insightOf, faceSVG, DECKTEXT, STR } = box.__out;

const LANGS = ['vi', 'en', 'de'].filter((l) => DECKTEXT[l]);
const decks = Object.fromEntries(LANGS.map((l) => [l, buildDeck(l)]));
const INK = '#3B2A5E', BG = '#FBF6F1';
const svgOf = (card) => faceSVG(card).replace(/var\(--card-ink\)/g, INK).replace(/var\(--card-bg\)/g, BG)
  .replace(/ role="img" aria-label="[^"]*"/, ' xmlns="http://www.w3.org/2000/svg"');

const cards = decks.vi.map((c0, i) => {
  const per = {};
  for (const l of LANGS) {
    const c = decks[l][i];
    const I = insightOf(c.id, l) || insightOf(c.id, 'en');
    per[l] = { name: c.name, meta: c.meta, kw: c.kw, up: c.up, rev: c.rev,
      read: I ? { pos: I.pos, neg: I.neg, now: I.now, love: I.love, work: I.work, study: I.study, money: I.money, advice: I.advice } : null };
  }
  return { id: c0.id, suit: c0.suit, svg: svgOf(decks.en[i]), text: per };
});
const out = path.join(__dirname, '..', 'assets', 'cards', 'cards.json');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify({ langs: LANGS, cards }));
// The site's own words for the screens the app draws natively. A sentence
// the site builds with a function is kept with {0} where the value goes.
const UI_KEYS = ['nav', 'focus', 'focusLabel', 'energyNow', 'energyLine', 'adviceHead', 'focusHead', 'pickTitle', 'pickIntro',
  'tapACard', 'yourCard', 'redraw', 'learnCard', 'pickTeaser', 'pickTeaserBtn', 'quickNote'];
const ui = {};
for (const l of LANGS) {
  ui[l] = {};
  for (const k of UI_KEYS) {
    const v = STR[l] && STR[l][k];
    if (v === undefined) continue;
    ui[l][k] = typeof v === 'function' ? v('{0}') : v;
  }
}
fs.writeFileSync(path.join(path.dirname(out), 'ui.json'), JSON.stringify(ui));
console.log('wrote', cards.length, 'cards in', LANGS.join('/'), '->', out, Math.round(fs.statSync(out).size / 1024) + ' KB');
