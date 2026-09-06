/* ============================ boot ============================ */
window.APP_VERSION = 'v85';
window.NABU = { CONFIG: CONFIG, loadActs: loadActs, BACK: BACK, LESSONS: LESSONS, localAnswer: localAnswer, compatVerdict: compatVerdict, numerologyOf: numerologyOf, ZDEEP: ZDEEP, lunarToday: lunarToday, solarToLunar: solarToLunar, DECK: DECK, INSIGHT: INSIGHT, KW: KW, ASK: ASK, TOPICS: TOPICS, GUIDES: GUIDES, SERVICES: SERVICES, COURSES: COURSES, ACCESS: ACCESS, makeCode: makeCode, parseCode: parseCode, ZODIAC: ZODIAC, pick: pick, book: book,
  insightHTML: insightHTML, insightOf: insightOf, sunSignIndex: sunSignIndex, lifePath: lifePath, PROFILE: () => PROFILE, BE: BE, ACTS: ACTS };
BE.initP = BE.init().catch(() => { /* backend unreachable: the app runs device-only */ });
// The Gemini key is a dashboard setting kept in the app cloud (content/ai), never in the source.
loadContent('ai', 'ai.json', 'nabu-ai').then((r) => { if (r && r.data && typeof r.data.geminiKey === 'string') { CONFIG.geminiKey = r.data.geminiKey.trim(); if (CONFIG.geminiKey) $$('.ai .ai-h .faint').forEach((el) => { el.textContent = T().aiOnline; }); } }).catch(() => {});
// The app is not a web page: no pinch or double-tap zoom.
document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });
let lastTouch = 0; document.addEventListener('touchend', (e) => { const now = Date.now(); if (now - lastTouch < 300 && !(e.target.closest && e.target.closest('input,textarea'))) e.preventDefault(); lastTouch = now; }, { passive: false });
// Signing in can unlock things (admin sees every course), so redraw the open screen.
BE.onAuth(() => { if (['learn', 'me', 'home'].indexOf(parseHash().route) > -1) route(); });
boot();
