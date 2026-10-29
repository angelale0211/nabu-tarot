const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const files = (name) => fs.readFileSync(path.join(__dirname, '../src/', name), 'utf8');
const saved = new Map();
let failWrites = false;
const ctx = vm.createContext({ console, lang:'en', WIPED:false, ROUTES:{},
  BE:{enabled:true,ready:true,user:null}, ACCESS:{has:()=>false},
  store:{get:(k,d)=>saved.has(k)?JSON.parse(saved.get(k)):d,
    set:(k,v)=>{if(failWrites)return false;saved.set(k,JSON.stringify(v));return true;}} });
const run=(code)=>vm.runInContext(code,ctx);
run(files('study.js')); run(files('workshop.js'));
run(`const PRACTICE=[
 {id:'first',free:true,cards:[1,2],rev:[false,false],frames:['state','advice'],traps:[]},
 {id:'new',free:true,cards:[1],rev:[true],frames:['outcome'],traps:[]},
 {id:'locked',free:false,course:'tarot',cards:[1,2],rev:[true,false],frames:['state','outcome'],traps:[]}
]; function practiceById(id){return PRACTICE.find(x=>x.id===id)};
const entry={id:'original-1',at:10,lang:'en',exercise:'first',title:'Test',question:'Question',answers:['Answer'],synth:'Synthesis',rubric:'1',pct:55,model:'Model',needs:['words'],feedback:[],cards:[{name:'Fool',position:'Now',reversed:false,got:[],missed:[]}],reasoning:['Because'],selfReview:{at:12,checks:[true,false,false,true],plan:'Review'}};
const backup={version:1,attempts:[entry],reflections:[],drafts:{injected:{secret:'never import'}}};`);
assert.equal(run('workshopRestore("guest",JSON.stringify(backup))'), '');
assert.equal(run('STUDY.read("guest").attempts[0].reasoning[0]'), 'Because');
assert.equal(run('STUDY.read("guest").attempts[0].selfReview.checks[0]'), true);
assert.equal(run('Object.keys(STUDY.read("guest").drafts).length'), 0);
assert.equal(run('workshopRestore("guest",JSON.stringify(backup))'), '');
assert.equal(run('STUDY.read("guest").attempts.length'), 1, 'duplicate import is idempotent');
run('backup.attempts[0].answers[0]="Different text"');
assert.equal(run('workshopRestore("guest",JSON.stringify(backup))'), '');
assert.equal(run('STUDY.read("guest").attempts.length'), 2, 'ID conflict preserves both texts');
assert.equal(run('STUDY.read("guest").attempts[0].answers[0]'), 'Answer');
assert.equal(run('workshopRestore("guest","{bad")'), 'invalid');
run('backup.attempts[0].id="bad\\\" onclick=alert(1)"');
assert.equal(run('workshopRestore("guest",JSON.stringify(backup))'), 'invalid', 'unsafe IDs rejected');
run('backup.attempts[0].id="safe"; backup.attempts[0].exercise="../bad"');
assert.equal(run('workshopRestore("guest",JSON.stringify(backup))'), 'invalid');
run('backup.attempts[0].exercise="first"; backup.attempts[0].pct=200');
assert.equal(run('workshopRestore("guest",JSON.stringify(backup))'), 'invalid');
run('backup.attempts[0].pct=55');
failWrites=true;
assert.equal(run('workshopRestore("guest",JSON.stringify(backup))'), 'failed');
failWrites=false;
assert.equal(run('STUDY.read("guest").attempts.length'), 2, 'failed or invalid imports never partly write');
run('STUDY.draft("guest","current",{text:"keep"})');
assert.equal(run('workshopRestore("guest",JSON.stringify(backup))'), '');
assert.equal(run('STUDY.read("guest").drafts.current.text'), 'keep');
assert.equal(run('workshopNext(STUDY.read("guest"),"words")[0].id'), 'new', 'untried eligible exercise first');
assert.equal(run('workshopNext(STUDY.read("guest"),"synth","first").length'), 0, 'exclude current and locked exercises');
run('const full=STUDY.read("guest"); full.attempts=Array.from({length:100},(_,i)=>Object.assign({},entry,{id:"full-"+i})); STUDY.write("guest",full)');
assert.equal(run('workshopRestore("guest",JSON.stringify(backup))'), 'capacity');
assert.equal(run('STUDY.read("guest").attempts.length'), 100);
run('BE.user={uid:"other"}');
assert.equal(run('workshopRestore("guest",JSON.stringify(backup))'), 'changed');
assert.equal(run('STUDY.read(studyOwner()).attempts.length'), 0);
for(const lg of ['vi','de']) assert.equal(run(`Object.keys(WORKSHOP_TEXT.${lg}).sort().join(',')`),run("Object.keys(WORKSHOP_TEXT.en).sort().join(',')"));
console.log('PASS workshop: backup validation, safe IDs, duplicates/conflicts, atomic failures, capacity, account boundaries, access-aware next exercises, translations');

// Reports cannot claim delivery on local fallback, rejection or timeout.
(async()=>{
 let calls=0, reject=false, timeout=false, pending=false;
 const reportCtx=vm.createContext({lang:'en', BE:{enabled:true,user:{uid:'alice'},db:{collection:()=>({add:()=>{calls++;return reject?Promise.reject(Error('denied')):pending?new Promise(()=>{}):Promise.resolve({id:'ack'});}})}},
 firebase:{firestore:{FieldValue:{serverTimestamp:()=>123}}},
 setTimeout:(f)=>{if(timeout)queueMicrotask(f);return 1}, clearTimeout:()=>{}});
 vm.runInContext(files('ai.js').split('async function flagAnswer')[1].split('function bindAI')[0].replace(/^/, 'async function flagAnswer'), reportCtx);
 const flag=()=>vm.runInContext('flagAnswer("question","answer")',reportCtx);
 assert.equal(await flag(),'sent');
 reject=true;assert.equal(await flag(),'unconfirmed');reject=false;
 pending=true;timeout=true;assert.equal(await flag(),'unconfirmed');pending=false;timeout=false;
 vm.runInContext('BE.user=null',reportCtx);
 const previous=calls;assert.equal(await flag(),'signin');assert.equal(calls,previous);
 console.log('PASS reports: server acknowledgement, rejection, timeout, guest does not send');
})().catch(e=>{console.error(e);process.exitCode=1});
