/* ============================ boot ============================ */
window.NABU = { DECK: DECK, INSIGHT: INSIGHT, KW: KW, ASK: ASK, TOPICS: TOPICS, GUIDES: GUIDES, SERVICES: SERVICES, ZODIAC: ZODIAC, pick: pick, book: book,
  insightHTML: insightHTML, insightOf: insightOf, sunSignIndex: sunSignIndex, lifePath: lifePath, PROFILE: () => PROFILE, BE: BE };
BE.init().catch(() => { /* backend unreachable: the app runs device-only */ });
boot();
