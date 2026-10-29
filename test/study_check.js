/* Storage failures and account boundaries need no browser or live account. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const saved = new Map();
let failWrites = false;
const context = vm.createContext({
  console, lang: 'en', WIPED: false, BE: { enabled: true, ready: true, user: null },
  ROUTES: {}, ACCESS: { has: () => false },
  practiceById: (id) => id === 'free' ? { free: true } : { free: false, course: 'tarot' },
  store: {
    get: (k, d) => saved.has(k) ? JSON.parse(saved.get(k)) : d,
    set: (k, v) => { if (failWrites) return false; saved.set(k, JSON.stringify(v)); return true; }
  }
});
vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/study.js'), 'utf8'), context);
const run = (code) => vm.runInContext(code, context);
assert.equal(run('studyOwner()'), 'guest');
assert.equal(run("STUDY.draft('guest', 'exercise:free:en', {answers:['original'], synth:'draft'})"), '');
assert.equal(run("STUDY.read('guest').drafts['exercise:free:en'].answers[0]"), 'original');
run("BE.user = {uid:'alice'}");
assert.equal(run("STUDY.read(studyOwner()).attempts.length"), 0);
assert.equal(run("Object.keys(STUDY.read('guest').drafts).length"), 0);
assert.equal(run("STUDY.draft('guest', 'x', {text:'must not leak'})"), 'changed');
assert.equal(run("STUDY.draft(studyOwner(), 'x', {text:'Alice private'})"), '');
run("BE.user = {uid:'bob'}");
assert.equal(run("Object.keys(STUDY.read(studyOwner()).drafts).length"), 0);
assert.equal(run("STUDY.read('user:alice').drafts.x"), undefined);
run("BE.user = {uid:'alice'}");
assert.equal(run("STUDY.read(studyOwner()).drafts.x.text"), 'Alice private');
failWrites = true;
assert.equal(run("STUDY.add(studyOwner(),'attempts',{id:'lost'},'x')"), 'failed');
assert.equal(run("STUDY.read(studyOwner()).drafts.x.text"), 'Alice private');
assert.equal(run("STUDY.read(studyOwner()).attempts.length"), 0);
failWrites = false;
assert.equal(run("STUDY.add(studyOwner(),'attempts',{id:'one',exercise:'free',needs:['words'],at:1,pct:20},'x')"), '');
assert.equal(run("STUDY.read(studyOwner()).drafts.x"), undefined);
assert.equal(run("STUDY.add(studyOwner(),'attempts',{id:'two',exercise:'free',needs:[],at:2,pct:90},'x')"), '');
assert.equal(run("STUDY.read(studyOwner()).attempts[0].pct"), 20);
assert.equal(run("studySuggestions(STUDY.read(studyOwner())).length"), 0);
run("STUDY.add(studyOwner(),'attempts',{id:'paid',exercise:'paid',needs:['words'],at:3,pct:20},'x')");
assert.equal(run("studySuggestions(STUDY.read(studyOwner())).length"), 0, 'locked exercises are not suggested');
run("BE.ready = false");
assert.equal(run('studyOwner()'), null);
assert.equal(run("STUDY.write('user:alice', {})"), 'changed');
run("BE.initFailed = true");
assert.equal(run('studyOwner()'), 'guest', 'failed initialization never guesses the saved account');
assert.equal(run("STUDY.read('user:alice').attempts.length"), 0);
run("BE.initFailed = false");
run("BE.ready = true; WIPED = true");
assert.equal(run("STUDY.draft('user:alice','x',{text:'restore after deletion'})"), 'changed');
run("WIPED = false");
const en = run('Object.keys(STUDY_TEXT.en).sort().join(",")');
for (const lg of ['vi', 'de']) assert.equal(run(`Object.keys(STUDY_TEXT.${lg}).sort().join(",")`), en);
run("const full = STUDY.read(studyOwner()); full.attempts = Array.from({length:100},(_,i)=>({id:String(i)})); STUDY.write(studyOwner(),full)");
assert.equal(run("STUDY.add(studyOwner(),'attempts',{id:'overflow'},'x')"), 'full');
assert.equal(run("STUDY.read(studyOwner()).attempts[0].id"), '0');
assert.equal(run("STUDY.remove(studyOwner(),'attempts','0')"), '');
assert.equal(run("STUDY.read(studyOwner()).attempts.length"), 99);
console.log('PASS study storage: account isolation, drafts, atomic failures, immutable attempts, latest-work suggestions, access, deletion lock, capacity, translations');
