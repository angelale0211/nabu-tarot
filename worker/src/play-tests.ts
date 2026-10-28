/* Retire free Play test-card access. Never infer testing from an email, track,
   price, client flag or an API failure. Google must positively identify it. */
import { PlayEnv, checkPurchase, checkSubscription, serviceToken, FS_SCOPE } from "./play";
import { ledgerGet, ledgerSet, removeAccessFor, tokenId, LedgerRow } from "./refunds";
import { dropSubscriptionFrom, unpayRoom } from "./entitle";
import { decode } from "./fs";

// Call only after a successful Google response identifying this token as a test.
export async function revokeVerifiedPlayTest(env: PlayEnv, token: string): Promise<boolean> {
  if (!token || token.startsWith("apple:")) return false;
  const hash = await tokenId(token), row = await ledgerGet(env, hash);
  if (!row || !row.uid) return false;
  // Record classification first so other test purchases cannot preserve this
  // one's access as a surviving paid grant. Failed removals are retried.
  await ledgerSet(env, hash, { state: "test_revoked", testPurchase: true, testAccessRemoved: false });
  if (row.kind === "subs") await dropSubscriptionFrom(env, row.uid, hash);
  else if (row.wid) await unpayRoom(env, row.wid, hash);
  else if (row.ids?.length) await removeAccessFor(env, row.uid, row.ids, hash);
  await ledgerSet(env, hash, { testAccessRemoved: true });
  return true;
}

/* A bounded, paged audit is also usable as a dry run. One-time test purchases
   were consumed immediately and will not appear in the phone's restore list,
   so rejecting new /billing requests alone cannot retire old course grants. */
export async function sweepPlayTests(env: PlayEnv, apply = false): Promise<{ checked:number; tests:number; revoked:number; failed:number; complete:boolean }> {
  const out = { checked:0, tests:0, revoked:0, failed:0, complete:false };
  if (!env.PLAY_SERVICE_ACCOUNT || !env.FIREBASE_PROJECT_ID) return out;
  const at = await serviceToken(env, FS_SCOPE);
  let after = "";
  for (let page=0; page<100; page++) {
    const query = { from:[{collectionId:"purchases"}], orderBy:[{field:{fieldPath:"__name__"},direction:"ASCENDING"}], limit:100,
      ...(after ? {startAt:{values:[{referenceValue:after}],before:false}} : {}) };
    const r = await fetch("https://firestore.googleapis.com/v1/projects/" + encodeURIComponent(env.FIREBASE_PROJECT_ID) + "/databases/(default)/documents:runQuery", {
      method:"POST", headers:{Authorization:"Bearer " + at,"Content-Type":"application/json"}, body:JSON.stringify({structuredQuery:query})
    });
    if (!r.ok) throw Error("test-purchase audit query " + r.status);
    const rows = ((await r.json()) as {document?:{name:string;fields?:Record<string,Record<string,unknown>>}}[]).filter(x=>x.document);
    for (const x of rows) {
      const row = decode(x.document!) as unknown as LedgerRow & {testAccessRemoved?:boolean};
      if (!row.token || row.token.startsWith("apple:") || row.state === "voided" || row.testAccessRemoved) continue;
      out.checked++;
      try {
        const got = row.kind === "subs" ? await checkSubscription(env,row.token) : await checkPurchase(env,row.sku,row.token);
        const isTest = "sub" in got ? !!got.sub?.testPurchase : !!("testPurchase" in got && got.testPurchase);
        if (isTest) { out.tests++; if (apply && await revokeVerifiedPlayTest(env,row.token)) out.revoked++; }
        else if (!got.ok && got.why !== "already used" && got.why !== "not bought") out.failed++;
      } catch { out.failed++; } // unavailable evidence never revokes anything
    }
    if (rows.length < 100) { out.complete = true; break; }
    const next = rows[rows.length-1].document!.name;
    if (next === after) { out.failed++; break; }
    after = next;
  }
  return out;
}
