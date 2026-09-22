/* Checks on the wardrobe that do not need a browser.
   The repo has no JS unit runner, so this is a plain node script: it loads the
   two wardrobe files with the few globals they ask of the app stubbed out, then
   asserts the things that would be expensive to notice by eye.

   Run:  node test/wardrobe_check.js       (exits non-zero on any failure) */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
let tier = 'pro';                       // flipped per case below
const sandbox = {
  plusOn: () => tier === 'plus' || tier === 'pro',
  proOn: () => tier === 'pro',
  store: { get: (k, d) => d, set: () => {} },
  esc: (x) => String(x),
  L: (x) => (x && x.en) || x,
  T: () => ({}),
  console: console,
  Math: Math,
  Object: Object,
  Number: Number,
  String: String,
  Array: Array,
  JSON: JSON
};
vm.createContext(sandbox);
/* The app declares everything with const, which is lexical and so never lands on
   the sandbox object. The epilogue runs in the same script and therefore the same
   scope, which is the only way to get a handle on any of it. */
const EXPORTS = ['PET_WARDROBE', 'PET_SLOTS', 'PET_SLOT_IDS', 'PET_COLS', 'PET_SKIES', 'PET_FX',
  'WEAR_DEF', 'SKY_ADD', 'FX_ADD', 'FIT_FULL_AT', 'FIT_FULL_BONUS', 'FIT_CAP',
  'petSlot', 'petCol', 'wearOf', 'wearIn', 'wearOn', 'wearDraw', 'wearTile',
  'fitBlank', 'fitMigrate', 'fitOf', 'fitCount', 'fitGain', 'fitDraw',
  'skyOf', 'skyWorn', 'fxOf', 'fxWorn', 'petSkySVG', 'petFxSVG', 'tierOn'];
vm.runInContext(
  fs.readFileSync(path.join(root, 'src/pet-wardrobe.js'), 'utf8')
    + '\n;(function(){' + EXPORTS.map((n) => 'globalThis.' + n + ' = ' + n + ';').join('') + '})();',
  sandbox, { filename: 'src/pet-wardrobe.js' });

let fails = 0;
const ok = (cond, label, detail) => {
  if (cond) { console.log('  ok   ' + label); return; }
  fails++;
  console.log('  FAIL ' + label + (detail ? '  -> ' + detail : ''));
};

const W = sandbox.PET_WARDROBE, SLOTS = sandbox.PET_SLOT_IDS;

console.log('\ncatalogue');
ok(W.length === 89, 'eighty-nine pieces', 'found ' + W.length);
const ids = W.map((x) => x.id);
const dupes = ids.filter((v, i) => ids.indexOf(v) !== i);
ok(!dupes.length, 'every id unique', dupes.join(', '));
const badSlot = W.filter((x) => SLOTS.indexOf(x.slot) < 0);
ok(!badSlot.length, 'every piece names a real slot', badSlot.map((x) => x.id).join(', '));
const badTier = W.filter((x) => ['free', 'plus', 'pro'].indexOf(x.tier) < 0);
ok(!badTier.length, 'every piece names a real tier', badTier.map((x) => x.id).join(', '));

console.log('\nthree languages');
const missing = W.filter((x) => !x.name || !x.name.vi || !x.name.en || !x.name.de);
ok(!missing.length, 'every piece is named in vi, en and de', missing.map((x) => x.id).join(', '));

console.log('\ntier split');
const by = (t) => W.filter((x) => x.tier === t).length;
ok(by('free') === 2, 'two free pieces', String(by('free')));
ok(by('plus') === 59, 'fifty-nine with Plus', String(by('plus')));
ok(by('pro') === 28, 'twenty-eight with Pro', String(by('pro')));
const proCols = {};
W.filter((x) => x.tier === 'pro').forEach((x) => { proCols[x.col] = 1; });
ok(Object.keys(proCols).sort().join(',') === 'celestial,guardian,imperial',
  'Pro is exactly the three legendary collections', Object.keys(proCols).join(','));

console.log('\nevery slot is wearable, and has something in it');
SLOTS.forEach((s) => {
  const n = sandbox.wearIn(s).length;
  ok(n >= 12, 'slot ' + s + ' offers at least twelve', String(n));
});
const freeSlots = {};
W.filter((x) => x.tier === 'free').forEach((x) => { freeSlots[x.slot] = 1; });
ok(Object.keys(freeSlots).length === 2, 'the free pieces are spread over two slots');

console.log('\nevery piece actually draws something');
const blank = W.filter((x) => {
  const svg = sandbox.wearDraw(x.id, sandbox.WEAR_DEF);
  return !svg || svg.length < 40;
});
ok(!blank.length, 'no piece draws an empty string', blank.map((x) => x.id).join(', '));
const unbalanced = W.filter((x) => {
  const svg = sandbox.wearDraw(x.id, sandbox.WEAR_DEF);
  return (svg.match(/</g) || []).length !== (svg.match(/>/g) || []).length;
});
ok(!unbalanced.length, 'no piece emits unbalanced markup', unbalanced.map((x) => x.id).join(', '));
/* Nothing may animate with a filter: the pet art comments record a drop-shadow
   that forced the whole drawing to rasterise and went soft in motion. */
const filtered = W.filter((x) => sandbox.wearDraw(x.id, sandbox.WEAR_DEF).indexOf('filter') > -1);
ok(!filtered.length, 'no piece uses a filter', filtered.map((x) => x.id).join(', '));
/* The hem replaced footwear, so no piece may reach for a foot. */
const footed = W.filter((x) => /class="ft/.test(sandbox.wearDraw(x.id, sandbox.WEAR_DEF)));
ok(!footed.length, 'no piece draws onto a foot', footed.map((x) => x.id).join(', '));

/* ---- nothing may be a recolour of its neighbour ----
   The first catalogue had four capes that were one outline in four colours and
   three skirts that were one rectangle in three. Colour is the cheapest thing
   to change and the easiest way to fake variety, so the guard ignores it: two
   pieces are compared on their geometry alone - the path commands and the
   shapes, with every number rounded and every fill dropped. */
console.log('\nno piece is a recolour of another');
const shapeOf = (id) => {
  const svg = sandbox.wearDraw(id, sandbox.WEAR_DEF);
  const marks = (svg.match(/<(path|circle|ellipse|rect|g)\b[^>]*>/g) || []).map((tag) => {
    const d = (tag.match(/\sd="([^"]*)"/) || [, ''])[1];
    const geo = (tag.match(/\s(c?[xy]|r[xy]?|width|height|transform|points)="([^"]*)"/g) || []).join(' ');
    return (tag.match(/^<(\w+)/)[1] + ' ' + d + ' ' + geo)
      .replace(/-?\d+(\.\d+)?/g, (n) => String(Math.round(Number(n) / 3)))  // coarse, so a nudge is not "different"
      .replace(/\s+/g, ' ').trim();
  });
  return marks;
};
const overlap = (a, b) => {
  if (!a.length || !b.length) return 0;
  const set = new Set(b);
  let hit = 0;
  a.forEach((m) => { if (set.has(m)) hit++; });
  return hit / Math.max(a.length, b.length);
};
const shapes = {};
W.forEach((x) => { shapes[x.id] = shapeOf(x.id); });
const twins = [];
SLOTS.forEach((slot) => {
  const mine = sandbox.wearIn(slot);
  for (let i = 0; i < mine.length; i++) {
    for (let j = i + 1; j < mine.length; j++) {
      const sim = overlap(shapes[mine[i].id], shapes[mine[j].id]);
      if (sim >= 0.6) twins.push(slot + ': ' + mine[i].id + ' ~ ' + mine[j].id + ' (' + Math.round(sim * 100) + '% same geometry)');
    }
  }
});
ok(!twins.length, 'no two pieces in a slot reuse the same geometry', twins.join('; '));
const identical = [];
W.forEach((a, i) => W.slice(i + 1).forEach((b) => {
  if (sandbox.wearDraw(a.id, sandbox.WEAR_DEF) === sandbox.wearDraw(b.id, sandbox.WEAR_DEF)) identical.push(a.id + ' = ' + b.id);
}));
ok(!identical.length, 'no two pieces anywhere draw exactly the same markup', identical.join(', '));

console.log('\nthe old single wear slot is carried across');
const OLD = ['none', 'scarf', 'bell', 'crown', 'hat', 'jumper', 'armour', 'cloak', 'wings'];
OLD.forEach((was) => {
  const p = { kind: 'cat', wear: was };
  sandbox.fitMigrate(p);
  const worn = SLOTS.filter((s) => p.fit[s] !== 'none');
  if (was === 'none') { ok(!worn.length, 'old "none" leaves every slot empty'); return; }
  ok(worn.length === 1 && p.fit[worn[0]] === was, 'old "' + was + '" lands in ' + (worn[0] || 'nowhere'));
});
const twice = { kind: 'cat', wear: 'hat' };
sandbox.fitMigrate(twice);
twice.fit.head = 'bobble';
sandbox.fitMigrate(twice);
ok(twice.fit.head === 'bobble', 'migration runs once and never overwrites');
const noWear = { kind: 'cat' };
sandbox.fitMigrate(noWear);
ok(noWear.fit && sandbox.fitCount(noWear.fit) === 0, 'a companion with no wear at all migrates cleanly');

console.log('\nwhat an outfit pays');
const wear = (n) => { const f = sandbox.fitBlank(); SLOTS.slice(0, n).forEach((s) => { f[s] = sandbox.wearIn(s)[0].id; }); return f; };
const pays = [0, 1, 2, 3, 4, 5, 6, 7].map((n) => sandbox.fitGain(wear(n)));
ok(pays[0] === 0, 'nothing on pays nothing', String(pays[0]));
ok(pays[1] === 4, 'one piece pays four', String(pays[1]));
ok(pays[4] === 10, 'four pieces pay ten', String(pays[4]));
ok(pays[5] === 18, 'five pieces pay twelve plus the six-point full look', String(pays[5]));
ok(pays[7] === 20, 'all seven stop at the ceiling plus the bonus', String(pays[7]));
ok(pays[7] + sandbox.SKY_ADD + sandbox.FX_ADD === 25, 'outfit, sky and effect top out at twenty-five',
  String(pays[7] + sandbox.SKY_ADD + sandbox.FX_ADD));
let rising = true;
for (let i = 1; i < pays.length; i++) if (pays[i] < pays[i - 1]) rising = false;
ok(rising, 'wearing more never pays less');

console.log('\nwhat lapsing does');
tier = 'free';
const dressed = { kind: 'cat', fit: sandbox.fitBlank() };
dressed.fit.top = 'dragonrobe';   // Pro
dressed.fit.head = 'bobble';      // Plus
dressed.fit.hem = 'pompom';       // free
let seen = sandbox.fitOf(dressed);
ok(seen.top === 'none' && seen.head === 'none' && seen.hem === 'pompom',
  'a free visitor keeps only the free piece', JSON.stringify(seen));
ok(sandbox.skyWorn('aurora').id === 'clear', 'a locked sky falls back to clear');
ok(sandbox.fxWorn('twinkle').id === 'none', 'a locked effect falls back to none');
tier = 'plus';
seen = sandbox.fitOf(dressed);
ok(seen.head === 'bobble' && seen.top === 'none', 'Plus keeps its own pieces and not the Pro one');
ok(sandbox.skyWorn('sakura').id === 'sakura', 'Plus keeps a Plus sky');
ok(sandbox.fxWorn('twinkle').id === 'none', 'Plus does not get the effects');
tier = 'pro';
seen = sandbox.fitOf(dressed);
ok(seen.top === 'dragonrobe', 'Pro keeps everything');
ok(sandbox.fxWorn('twinkle').id === 'twinkle', 'Pro gets the effects');

console.log('\nskies and effects');
ok(sandbox.PET_SKIES.length === 10, 'ten skies', String(sandbox.PET_SKIES.length));
ok(sandbox.PET_FX.length === 10, 'ten effects', String(sandbox.PET_FX.length));
ok(sandbox.petSkySVG('clear') === '', 'the clear sky draws nothing at all');
const skyBad = sandbox.PET_SKIES.filter((s) => {
  if (s.id === 'clear') return false;
  const svg = sandbox.petSkySVG(s.id);
  return !svg || svg.indexOf('filter') > -1
    || (svg.match(/</g) || []).length !== (svg.match(/>/g) || []).length;
});
ok(!skyBad.length, 'every sky draws, is balanced and uses no filter', skyBad.map((s) => s.id).join(', '));
const fxBad = sandbox.PET_FX.filter((f) => {
  if (f.id === 'none') return false;
  const a = sandbox.petFxSVG(f.id), svg = a.back + a.front;
  return !svg || svg.indexOf('filter') > -1
    || (svg.match(/</g) || []).length !== (svg.match(/>/g) || []).length;
});
ok(!fxBad.length, 'every effect draws, is balanced and uses no filter', fxBad.map((f) => f.id).join(', '));
/* Twelve moving nodes is the ceiling the design set itself. */
const heavy = sandbox.PET_FX.filter((f) => {
  const a = sandbox.petFxSVG(f.id), svg = a.back + a.front;
  return (svg.match(/class="[^"]*(twinkle|fx[a-z]+)/g) || []).length > 12;
});
ok(!heavy.length, 'no effect animates more than twelve nodes', heavy.map((f) => f.id).join(', '));
ok(sandbox.petFxSVG('none').back === '' && sandbox.petFxSVG('none').front === '', 'no effect means no markup');

/* ---- held still ----
   A picker tile draws the scene without animating it. Ten live scenes in a
   grid put the main thread at about half of every frame on a mid-range
   Android, which is the fault the whole still mode exists to cure - so a
   class that names a keyframe, or an animation-delay, is a regression. */
const ANI = /class="(?:twinkle|skfall|skrise|skwander|skaurora|sway|fx[a-z]+|fly)/;
const skyMoves = sandbox.PET_SKIES.filter((s) => {
  const svg = sandbox.petSkySVG(s.id, true);
  return ANI.test(svg) || svg.indexOf('animation-delay') > -1;
}).map((s) => s.id);
ok(!skyMoves.length, 'every sky can be held still', skyMoves.join(','));
const fxMoves = sandbox.PET_FX.filter((f) => {
  const a = sandbox.petFxSVG(f.id, true), svg = a.back + a.front;
  return ANI.test(svg) || svg.indexOf('animation-delay') > -1;
}).map((f) => f.id);
ok(!fxMoves.length, 'every effect can be held still', fxMoves.join(','));
/* And held still it must still show something: three of the effects begin at
   opacity 0 off the frame, and frozen on their start mark they were a black
   tile with nothing in it. */
const skyThin = sandbox.PET_SKIES.filter((s) => s.id !== 'clear' && sandbox.petSkySVG(s.id, true).length < 200).map((s) => s.id);
ok(!skyThin.length, 'a still sky still draws a sky', skyThin.join(','));
const fxThin = sandbox.PET_FX.filter((f) => {
  if (f.id === 'none') return false;
  const a = sandbox.petFxSVG(f.id, true);
  return (a.back + a.front).length < 160;
}).map((f) => f.id);
ok(!fxThin.length, 'a still effect still draws an effect', fxThin.join(','));
/* A still node that is only a class away from its running twin has not been
   held anywhere: it needs a transform saying where in the flight it was
   caught. Only the three that start off the frame are checked. */
const uncaught = ['shooting', 'motes', 'petals'].filter((id) => {
  const a = sandbox.petFxSVG(id, true);
  return (a.back + a.front).indexOf('transform:transl') < 0;
});
ok(!uncaught.length, 'an effect that starts off the frame is caught mid-flight', uncaught.join(','));

console.log('\nthe shelf tile and the companion cannot disagree');
const tileBad = W.filter((x) => {
  const t = sandbox.wearTile(x.id);
  return t.indexOf(sandbox.petSlot(x.slot).crop) < 0 || t.indexOf('<svg') !== 0;
});
ok(!tileBad.length, 'every tile is the piece seen through its own slot window', tileBad.map((x) => x.id).join(', '));

console.log(fails ? '\n' + fails + ' check(s) failed\n' : '\nall checks passed\n');
process.exit(fails ? 1 : 0);
