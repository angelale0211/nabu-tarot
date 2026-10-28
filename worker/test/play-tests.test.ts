import { test } from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index";
import { checkPurchase, checkSubscription } from "../src/play";
import { applySubscription } from "../src/entitle";
import { sweepPlayTests, revokeVerifiedPlayTest } from "../src/play-tests";
import { tokenId } from "../src/refunds";
import { itemByKey } from "../src/catalog";
import { decode, encode } from "../src/fs";
import { makeKeys, env, ctx, mockFetch, json, idToken } from "./util";
const K = await makeKeys();
const E = env(K);
function world(purchases:Record<string,unknown>, initial:Record<string,Record<string,unknown>>={}, failUserWrites=0) {
  const docs = structuredClone(initial);
  const m = mockFetch(K, {
    'androidpublisher.googleapis.com': (url,init) => {
      if (init.method==='POST') return json({});
      const token=decodeURIComponent(url.split('/tokens/')[1]);
      const got=purchases[token]; return got instanceof Response ? got : got ? json(got) : json({},404);
    },
    ':runQuery': (_url,init) => {
      const q=JSON.parse(String(init.body)).structuredQuery;
      let keys=Object.keys(docs).filter(k=>k.startsWith('purchases/')).sort();
      if(q.where) keys=keys.filter(k=>docs[k].uid===q.where.fieldFilter.value.stringValue);
      if(q.startAt) keys=keys.filter(k=>'projects/nabutarot/databases/(default)/documents/'+k>q.startAt.values[0].referenceValue);
      return json(keys.slice(0,q.limit).map(k=>({document:{name:'projects/nabutarot/databases/(default)/documents/'+k,fields:encode(docs[k])}})));
    },
    'firestore.googleapis.com': (url,init) => {
      const key=url.split('/documents/')[1].split('?')[0];
      if(init.method==='PATCH') {
        if (key.startsWith('users/') && failUserWrites-- > 0) return json({},503);
        docs[key]={...(docs[key]||{}),...decode(JSON.parse(String(init.body)))}; return json({});
      }
      return docs[key]?json({fields:encode(docs[key])}):json({},404);
    }
  }); return {docs,m};
}
async function bill(token:string,sku='tarot') {
  const c=ctx();
  const r=await worker.fetch(new Request('https://worker.test/billing',{method:'POST',headers:{Authorization:'Bearer '+await idToken(K,'u'), 'Content-Type':'application/json'},body:JSON.stringify({token,sku})}),E as never,c as never);
  await c.done(); return {status:r.status,body:await r.json()};
}
test('only Google test classification is rejected; real and promotional purchases remain valid',async()=>{
 const w=world({test:{purchaseState:0,consumptionState:1,purchaseType:0},real:{purchaseState:0,consumptionState:0},promo:{purchaseState:0,consumptionState:0,purchaseType:1}});
 try {
  assert.equal((await checkPurchase(E,'tarot','test')).testPurchase,true);
  assert.equal((await checkPurchase(E,'tarot','real')).ok,true);
  assert.equal((await checkPurchase(E,'tarot','promo')).ok,true);
  assert.equal((await bill('test')).status,403);
  assert.deepEqual(w.docs,{});
  assert.equal(w.m.log.filter(x=>x.url.includes('androidpublisher')&&x.method==='POST').length,0);
 }finally{w.m.restore();}
});

test('paged audit finds grants after the first 100 rows and removes overlapping test-only grants',async()=>{
 const initial:Record<string,Record<string,unknown>>={};
 for(let i=0;i<101;i++) initial['purchases/000'+String(i).padStart(3,'0')]={token:'apple:'+i};
 for(const token of ['T1','T2']) initial['purchases/'+await tokenId(token)]={uid:'u',sku:'tarot',kind:'inapp',ids:['tarot'],state:'granted',token,until:'2030-01-01'};
 initial['users/u']={access:{tarot:'2030-01-01',playing:'2030-01-01'}};
 const testPurchase={purchaseType:0,purchaseState:0,consumptionState:1};
 const w=world({T1:testPurchase,T2:testPurchase},initial);
 try{
  const result=await sweepPlayTests(E,true);
  assert.deepEqual(result,{checked:2,tests:2,revoked:2,failed:0,complete:true});
  assert.deepEqual(w.docs['users/u'].access,{playing:'2030-01-01'});
  assert.equal((await sweepPlayTests(E,true)).checked,0);
 }finally{w.m.restore();}
});

test('a failed account write is not marked complete and a later audit retries it',async()=>{
 const hash=await tokenId('T');
 const w=world({T:{purchaseType:0,purchaseState:0,consumptionState:1}},{
  ['purchases/'+hash]:{uid:'u',sku:'tarot',kind:'inapp',ids:['tarot'],token:'T',until:'2030-01-01'},
  'users/u':{access:{tarot:'2030-01-01'}}
 },1);
 try{
  const first=await sweepPlayTests(E,true);
  assert.equal(first.failed,1);assert.equal(first.revoked,0);
  assert.equal(w.docs['purchases/'+hash].testAccessRemoved,false);
  assert.deepEqual(w.docs['users/u'].access,{tarot:'2030-01-01'});
  assert.equal((await sweepPlayTests(E,true)).revoked,1);
  assert.deepEqual(w.docs['users/u'].access,{});
 }finally{w.m.restore();}
});

test('incomplete surviving purchase evidence leaves account access untouched',async()=>{
 const hash=await tokenId('T');
 const initial:Record<string,Record<string,unknown>>={
  ['purchases/'+hash]:{uid:'u',sku:'tarot',kind:'inapp',ids:['tarot'],token:'T',until:'2030-01-01'},
  'users/u':{access:{tarot:'2030-01-01'}}
 };
 for(let i=0;i<500;i++) initial['purchases/other'+i]={uid:'u',sku:'playing',kind:'inapp',ids:['playing'],until:'2030-01-01'};
 const w=world({},initial);
 try{
  await assert.rejects(revokeVerifiedPlayTest(E,'T'),/history incomplete/);
  assert.deepEqual(w.docs['users/u'].access,{tarot:'2030-01-01'});
  assert.equal(w.docs['purchases/'+hash].testAccessRemoved,false);
 }finally{w.m.restore();}
});
test('restoring a consumed old test course removes only its grant and retains real purchase and manual grants',async()=>{
 const hash=await tokenId('old');
 const w=world({old:{purchaseState:0,consumptionState:1,purchaseType:0}}, {
  ['purchases/'+hash]:{uid:'u',sku:'tarot',kind:'inapp',ids:['tarot'],state:'granted',token:'old',until:'2030-12-31'},
  'purchases/real':{uid:'u',sku:'tarot',kind:'inapp',ids:['tarot'],state:'granted',token:'paid',until:'2029-06-30'},
  'users/u':{access:{tarot:'2030-12-31',playing:'2031-01-01'},granted:{tarot:'2029-07-31'}}
 });
 try {
  assert.equal((await bill('old')).status,403);
  assert.deepEqual(w.docs['users/u'].access,{tarot:'2029-07-31',playing:'2031-01-01'});
  assert.equal(w.docs['purchases/'+hash].testAccessRemoved,true);
  assert.equal((await bill('old')).status,403);
  assert.deepEqual(w.docs['users/u'].access,{tarot:'2029-07-31',playing:'2031-01-01'});
 }finally{w.m.restore();}
});
test('test subscriptions are classified and cannot overwrite a later paid subscription during RTDN/reconciliation',async()=>{
 const item=itemByKey('plus')!;
 const w=world({T:{subscriptionState:'SUBSCRIPTION_STATE_ACTIVE',testPurchase:{},lineItems:[{productId:item.sku,expiryTime:'2031-01-01T00:00:00Z'}]}}, {
 'users/u':{access:{plus:'2030-01-01'},subs:{plus:{sku:item.sku,plan:'paid',state:'SUBSCRIPTION_STATE_ACTIVE',until:'2030-01-01',tok:'real-hash',opens:['plus'],grant:true}},granted:{}}
 });
 try{
  const got=await checkSubscription(E,'T'); assert.equal(got.sub?.testPurchase,true);
  assert.equal((await bill('T',item.sku)).status,403);
  await applySubscription(E,'u',item,got.sub!,'test-hash');
  assert.deepEqual(w.docs['users/u'].access,{plus:'2030-01-01'});
  assert.equal((w.docs['users/u'].subs as any).plus.tok,'real-hash');
 }finally{w.m.restore();}
});
test('an old test subscription expires only its token and retains unrelated legitimate grants',async()=>{
 const item=itemByKey('plus')!, hash=await tokenId('T');
 const w=world({T:{subscriptionState:'SUBSCRIPTION_STATE_ACTIVE',testPurchase:{},lineItems:[{productId:item.sku,expiryTime:'2031-01-01T00:00:00Z'}]}},{
 ['purchases/'+hash]:{uid:'u',sku:item.sku,kind:'subs',token:'T',ids:['plus'],state:'SUBSCRIPTION_STATE_ACTIVE'},
 'users/u':{access:{plus:'2031-01-01',tarot:'2030-01-01'},subs:{plus:{tok:hash,opens:['plus'],grant:true,until:'2031-01-01'}},granted:{plus:'2029-01-01'}}
 });
 try{
  assert.equal((await bill('T',item.sku)).status,403);
  assert.deepEqual(w.docs['users/u'].access,{plus:'2029-01-01',tarot:'2030-01-01'});
  assert.equal((w.docs['users/u'].subs as any).plus.grant,false);
 }finally{w.m.restore();}
});
test('audit defaults to dry run; explicit sweep retires old consumed test courses, skips Apple and does not infer testing on API failure',async()=>{
 const h1=await tokenId('T'),h2=await tokenId('unknown'),h3=await tokenId('apple:A');
 const w=world({T:{purchaseState:0,consumptionState:1,purchaseType:0},unknown:json({},503)}, {
 ['purchases/'+h1]:{uid:'u',sku:'tarot',kind:'inapp',ids:['tarot'],state:'granted',token:'T',until:'2030-01-01'},
 ['purchases/'+h2]:{uid:'v',sku:'tarot',kind:'inapp',ids:['tarot'],state:'granted',token:'unknown',until:'2030-01-01'},
 ['purchases/'+h3]:{uid:'a',sku:'tarot',kind:'inapp',ids:['tarot'],state:'granted',token:'apple:A',until:'2030-01-01'},
 'users/u':{access:{tarot:'2030-01-01'}},'users/v':{access:{tarot:'2030-01-01'}}
 });
 try{
  const before=JSON.stringify(w.docs),dry=await sweepPlayTests(E);
  assert.equal(dry.tests,1);assert.equal(dry.revoked,0);assert.equal(JSON.stringify(w.docs),before);
  const applied=await sweepPlayTests(E,true);
  assert.equal(applied.revoked,1);assert.equal(applied.failed,1);assert.equal(applied.complete,true);
  assert.deepEqual(w.docs['users/u'].access,{});assert.deepEqual(w.docs['users/v'].access,{tarot:'2030-01-01'});
  assert.equal(w.m.log.some(x=>x.url.includes('/tokens/apple')),false);
 }finally{w.m.restore();}
});
