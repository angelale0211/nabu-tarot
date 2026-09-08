/* ============================ boot ============================ */
window.APP_VERSION = 'v180';
window.NABU = { CONFIG: CONFIG, SALE: SALE, salePrice: salePrice, loadActs: loadActs, BACK: BACK, LESSONS: LESSONS, localAnswer: localAnswer, compatVerdict: compatVerdict, numerologyOf: numerologyOf, ZDEEP: ZDEEP, lunarToday: lunarToday, solarToLunar: solarToLunar, DECK: DECK, INSIGHT: INSIGHT, KW: KW, ASK: ASK, TOPICS: TOPICS, GUIDES: GUIDES, SERVICES: SERVICES, COURSES: COURSES, ACCESS: ACCESS, plusOn: () => plusOn(), proOn: () => proOn(), luckUnlimited: () => luckUnlimited(), ZODIAC: ZODIAC, pick: pick, book: book,
  insightHTML: insightHTML, insightOf: insightOf, sunSignIndex: sunSignIndex, lifePath: lifePath, PROFILE: () => PROFILE, BE: BE, ACTS: ACTS,
  ANGELS: ANGELS, angelRead: angelRead, CODEBOOK: CODEBOOK, redeemCode: redeemCode, loadCodebook: loadCodebook, petHomeSVG: petHomeSVG, PET_HOMES: PET_HOMES, PET_WEARS: PET_WEARS, codeDigest: codeDigest, randomCode: randomCode, BANK: BANK, PETS: PETS, petSVG: petSVG, PET_COATS: PET_COATS, PET_KINDS: PET_KINDS, luckCut: luckCut, petLevel: petLevel, petStep: petStep, VOUCHERS: VOUCHERS, levelCoins: levelCoins, LOOKS: LOOKS,
  LOVE: LOVE, LOVEDB: LOVEDB, HANDLE_RE: HANDLE_RE, loveBadgeHTML: loveBadgeHTML,
  loveMarkSVG: loveMarkSVG, QUIZ: QUIZ, QSCORE: QSCORE, QUIZ_PASS: QUIZ_PASS, QUIZ_LEN: QUIZ_LEN, pileArtSVG: pileArtSVG, PILE_ARTS: PILE_ARTS, threadSVG: threadSVG, petParentsHTML: petParentsHTML, GIFTS: GIFTS, ALERTS: ALERTS, alertsStart: alertsStart, alertWas: alertWas,
  WED: WED, WED_STEPS: WED_STEPS, wedStep: wedStep, cupidSVG: cupidSVG, shareLine: shareLine };
/* ---- German reads English where German does not exist yet ----
   Every table in the app that is written per language is keyed 'vi' and 'en'.
   Adding a third language to LANGS without this makes each of them answer
   undefined for German, and the app stops on the first one it touches. Rather
   than a check at every lookup, each table is pointed at its English half once,
   here, after they are all defined.

   Some tables carry the language at the top (`KW.en`), others one record at a
   time (`ZODIAC.aries.en`, `TOUR[0].en`). So this walks a few levels down and
   fills in German wherever English exists without it. Translating a table is
   still a matter of filling it in - a real `de` is never overwritten. */
function deDefaults(v, depth) {
  if (!v || typeof v !== 'object' || depth > 4) return;
  if (Array.isArray(v)) { v.forEach((x) => deDefaults(x, depth + 1)); return; }
  if (v.en !== undefined && v.de === undefined) v.de = v.en;
  Object.keys(v).forEach((k) => { if (k !== 'de' && k !== 'en' && k !== 'vi') deDefaults(v[k], depth + 1); });
}
[typeof DECKTEXT !== 'undefined' && DECKTEXT, typeof LEX !== 'undefined' && LEX,
 typeof INSIGHT !== 'undefined' && INSIGHT, typeof ASK !== 'undefined' && ASK,
 typeof KW !== 'undefined' && KW, typeof LEN !== 'undefined' && LEN,
 typeof SPREADS !== 'undefined' && SPREADS, typeof MOON_NAMES !== 'undefined' && MOON_NAMES,
 typeof NUM_KW !== 'undefined' && NUM_KW, typeof SUIT_TIMING !== 'undefined' && SUIT_TIMING,
 typeof ANIMAL_INFO !== 'undefined' && ANIMAL_INFO, typeof PC_TIMING !== 'undefined' && PC_TIMING,
 typeof PAYMENT_NOTE !== 'undefined' && PAYMENT_NOTE,
 /* keyed one record at a time */
 typeof NUM !== 'undefined' && NUM, typeof ZODIAC !== 'undefined' && ZODIAC,
 typeof ZSIGN !== 'undefined' && ZSIGN, typeof ZDEEP !== 'undefined' && ZDEEP,
 typeof ZELEM !== 'undefined' && ZELEM, typeof ZMODE !== 'undefined' && ZMODE,
 typeof ZPLANET !== 'undefined' && ZPLANET, typeof LIFEPATH !== 'undefined' && LIFEPATH,
 typeof PYEAR !== 'undefined' && PYEAR, typeof CHEM_TEXT !== 'undefined' && CHEM_TEXT,
 typeof ANIMALS !== 'undefined' && ANIMALS, typeof HOUSES !== 'undefined' && HOUSES,
 typeof PALM !== 'undefined' && PALM, typeof MOUNTS !== 'undefined' && MOUNTS,
 typeof MOON_TEXT !== 'undefined' && MOON_TEXT, typeof FT_CARDS !== 'undefined' && FT_CARDS,
 typeof PC_RANK_TEXT !== 'undefined' && PC_RANK_TEXT, typeof PC_SUIT_TEXT !== 'undefined' && PC_SUIT_TEXT,
 typeof PC_COURT_TEXT !== 'undefined' && PC_COURT_TEXT, typeof INTERESTS !== 'undefined' && INTERESTS,
 typeof TOPICS !== 'undefined' && TOPICS, typeof TOUR !== 'undefined' && TOUR
].forEach((t) => deDefaults(t, 0));

try { petRemindCheck(); } catch (e) { /* nothing kept yet */ }
/* The bell catches up on what happened while the app was shut, and keeps
   listening while it is open. Signing in or out changes what there is to
   listen to, so it is started again then. */
try { alertsStart(); } catch (e) { /* nothing to catch up on */ }
BE.initP = BE.init().catch(() => { /* backend unreachable: the app runs device-only */ });
// The Gemini key is a dashboard setting kept in the app cloud (content/ai), never in the source.
/* The code book is Nabu's to read; the dashboard loads it when the Codes tab
   opens. A copy an older version kept on this phone is cleared. */
try { localStorage.removeItem('nabu-codes'); } catch (e) { /* fine */ }
loadContent('sale', 'sale.json', 'nabu-sale').then((r) => { SALE.set(r && r.data); renderChrome((ROUTES[parseHash().route] || {}).nav); route(); });
store.set('nabu-ai', null);
/* The AI key is read from the cloud by Nabu only and never cached here. */
loadContent('ai', 'ai.json', '').then((r) => { if (r && r.data && typeof r.data.geminiKey === 'string') { CONFIG.geminiKey = r.data.geminiKey.trim(); if (CONFIG.geminiKey) $$('.ai .ai-h .faint').forEach((el) => { el.textContent = T().aiOnline; }); } }).catch(() => {});
// The app is not a web page: no pinch or double-tap zoom.
document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });
let lastTouch = 0; document.addEventListener('touchend', (e) => { const now = Date.now(); if (now - lastTouch < 300 && !(e.target.closest && e.target.closest('input,textarea'))) e.preventDefault(); lastTouch = now; }, { passive: false });
// Signing in can unlock things (admin sees every course), so redraw the open screen.
BE.onAuth(() => {
  try { alertsStart(); } catch (e) { /* not reachable */ }
  if (['learn', 'me', 'home'].indexOf(parseHash().route) > -1) route();
});
boot();
