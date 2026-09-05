/* ============================ boot ============================ */
window.APP_VERSION = 'v39';
window.NABU = { CONFIG: CONFIG, LESSONS: LESSONS, localAnswer: localAnswer, compatVerdict: compatVerdict, numerologyOf: numerologyOf, ZDEEP: ZDEEP, lunarToday: lunarToday, solarToLunar: solarToLunar, DECK: DECK, INSIGHT: INSIGHT, KW: KW, ASK: ASK, TOPICS: TOPICS, GUIDES: GUIDES, SERVICES: SERVICES, COURSES: COURSES, ACCESS: ACCESS, makeCode: makeCode, parseCode: parseCode, ZODIAC: ZODIAC, pick: pick, book: book,
  insightHTML: insightHTML, insightOf: insightOf, sunSignIndex: sunSignIndex, lifePath: lifePath, PROFILE: () => PROFILE, BE: BE };
BE.init().catch(() => { /* backend unreachable: the app runs device-only */ });
boot();
