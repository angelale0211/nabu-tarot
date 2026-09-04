/* ============================ Lenormand artwork ============================ */
/* Drawn in the same idiom as the tarot faces, reusing the same helpers, so the
   two decks read as one family even though they are kept apart everywhere else.
   Lenormand images are single objects rather than scenes, which is the whole
   point of the system: the picture is a noun, and meaning arrives from the
   nouns standing next to it. */

const LEN_ART = {

/* 1 Rider */
1: scene(SKY_Y, GR_GRN)
  + `<path d="M24 108 L30 92 L44 88 L62 90 L74 82 L78 88 L66 98 L64 110 L58 110 L58 100 L40 100 L38 112 L32 112 L34 100 Z" fill="${WOOD}" stroke-width="1.4"/>`
  + `<path d="M74 82 L82 78 L84 84 L76 88 Z" fill="${WOOD}" stroke-width="1.2"/>`
  + `<path d="M30 92 L20 84 L22 96 Z" fill="${DRK}" stroke-width="1.1"/>`
  + `<path d="M44 88 L46 66 L56 66 L58 88 Z" fill="${RED}" stroke-width="1.4"/>`
  + `<circle cx="51" cy="59" r="6.4" fill="${SKIN}" stroke-width="1.3"/>`
  + `<path d="M44 55 q7 -6 14 -1 z" fill="${DRK}" stroke-width="1.1"/>`
  + `<line x1="56" y1="70" x2="70" y2="78" stroke-width="1.9"/>`,

/* 2 Clover */
2: scene(SKY_Y, GR_GRN)
  + `<path d="M50 84 q-16 -14 -4 -22 q10 -6 4 12 Z" fill="${GRN}" stroke-width="1.3"/>`
  + `<path d="M50 84 q-18 6 -12 -14 q5 -11 12 3 Z" fill="${GRN}" stroke-width="1.3"/>`
  + `<path d="M50 84 q18 6 12 -14 q-5 -11 -12 3 Z" fill="${GRN}" stroke-width="1.3"/>`
  + `<path d="M50 84 q2 22 -8 30" fill="none" stroke-width="1.7"/>`
  + `<circle cx="50" cy="80" r="2.6" fill="${GOLD}" stroke-width="1"/>`
  + `<path d="M30 120 q6 -8 11 0 M60 122 q5 -7 9 0" fill="none" stroke-width="1.1"/>`,

/* 3 Ship */
3: scene(SKY_B, '#4E7FA8')
  + `<rect x="5" y="104" width="90" height="36" fill="#4E7FA8" stroke="none"/>`
  + `<path d="M24 104 L76 104 L68 118 L32 118 Z" fill="${WOOD}" stroke-width="1.5"/>`
  + `<line x1="50" y1="104" x2="50" y2="40" stroke-width="1.8"/>`
  + `<path d="M52 44 L52 98 L80 98 Z" fill="${WHT}" stroke-width="1.4"/>`
  + `<path d="M48 52 L48 98 L26 98 Z" fill="${WHT}" stroke-width="1.4"/>`
  + `<path d="M50 40 L62 44 L50 48 Z" fill="${RED}" stroke-width="1.1"/>`
  + `<path d="M14 124 q9 -5 18 0 t18 0 t18 0 t18 0" fill="none" stroke-width="1.2"/>`
  + `<path d="M14 132 q9 -5 18 0 t18 0 t18 0 t18 0" fill="none" stroke-width="1.2"/>`,

/* 4 House */
4: scene(SKY_Y, GR_GRN)
  + `<path d="M18 74 L50 46 L82 74 Z" fill="${RED}" stroke-width="1.6"/>`
  + `<rect x="26" y="74" width="48" height="50" fill="${STONE}" stroke-width="1.6"/>`
  + `<rect x="43" y="96" width="14" height="28" fill="${WOOD}" stroke-width="1.4"/>`
  + `<circle cx="54" cy="110" r="1.5" fill="${GOLD}" stroke="none"/>`
  + `<rect x="31" y="83" width="11" height="10" fill="${SKY_B}" stroke-width="1.2"/>`
  + `<rect x="58" y="83" width="11" height="10" fill="${SKY_B}" stroke-width="1.2"/>`
  + `<rect x="64" y="52" width="8" height="16" fill="${STONE}" stroke-width="1.3"/>`,

/* 5 Tree */
5: scene(SKY_Y, GR_GRN)
  + `<circle cx="50" cy="62" r="21" fill="${GR_GRN}" stroke-width="1.5"/>`
  + `<circle cx="33" cy="76" r="13" fill="${GR_GRN}" stroke-width="1.4"/>`
  + `<circle cx="67" cy="76" r="13" fill="${GR_GRN}" stroke-width="1.4"/>`
  + `<path d="M45 124 L46 86 L54 86 L55 124 Z" fill="${WOOD}" stroke-width="1.5"/>`
  + `<path d="M46 100 L36 90 M54 96 L64 88" fill="none" stroke-width="1.3"/>`
  + `<path d="M38 124 q12 -8 24 0" fill="none" stroke-width="1.1"/>`,

/* 6 Clouds */
6: scene(SKY_G, GR_STN)
  + `<path d="M18 74 q-2 -13 11 -13 q4 -11 16 -7 q10 -6 16 5 q13 -1 12 12 q3 8 -7 10 L26 81 q-9 -1 -8 -7 Z" fill="${DRK}" stroke-width="1.5"/>`
  + `<path d="M40 104 q-2 -11 10 -11 q4 -9 14 -5 q11 -4 11 10 q4 7 -5 9 L48 108 q-8 -1 -8 -4 Z" fill="${WHT}" stroke-width="1.4"/>`
  + `<line x1="24" y1="92" x2="21" y2="100" stroke-width="1.1"/>`
  + `<line x1="32" y1="93" x2="29" y2="101" stroke-width="1.1"/>`,

/* 7 Snake */
7: scene(SKY_G, GR_SND)
  + `<path d="M74 52 q-24 2 -22 18 q2 15 22 16 q20 1 20 16 q0 15 -24 16" fill="none" stroke-width="6.4" stroke="${GRN}"/>`
  + `<path d="M74 52 q-24 2 -22 18 q2 15 22 16 q20 1 20 16 q0 15 -24 16" fill="none" stroke-width="1.4"/>`
  + `<path d="M74 52 q-8 -6 -16 -2 q6 5 4 8 Z" fill="${GRN}" stroke-width="1.3"/>`
  + `<circle cx="66" cy="50" r="1.3" fill="${IK}" stroke="none"/>`
  + `<path d="M58 50 l-8 -3 l6 5 Z" fill="${RED}" stroke-width="0.9"/>`,

/* 8 Coffin */
8: scene(SKY_N, GR_DRK)
  + `<path d="M38 40 L62 40 L70 74 L66 124 L34 124 L30 74 Z" fill="${DRK}" stroke-width="1.7"/>`
  + `<line x1="30" y1="74" x2="70" y2="74" stroke-width="1.2"/>`
  + `<path d="M50 84 L50 106 M42 92 L58 92" fill="none" stroke-width="1.6" stroke="${STONE}"/>`
  + `<path d="M22 128 q10 -5 20 0 M58 128 q10 -5 20 0" fill="none" stroke-width="1.1"/>`,

/* 9 Bouquet */
9: scene(SKY_Y, GR_SND)
  + `<path d="M42 92 L58 92 L54 124 L46 124 Z" fill="${STONE}" stroke-width="1.4"/>`
  + `<circle cx="50" cy="56" r="8.4" fill="${ROSE}" stroke-width="1.3"/>`
  + `<circle cx="33" cy="70" r="7.4" fill="${GOLD}" stroke-width="1.3"/>`
  + `<circle cx="67" cy="70" r="7.4" fill="${VIO}" stroke-width="1.3"/>`
  + `<circle cx="50" cy="56" r="2.6" fill="${GOLD}" stroke-width="0.9"/>`
  + `<path d="M50 64 L50 92 M36 76 L48 92 M64 76 L52 92" fill="none" stroke-width="1.4" stroke="${GRN}"/>`
  + `<path d="M44 80 q-9 -4 -10 4 q8 3 10 -4 Z" fill="${GRN}" stroke-width="1.1"/>`,

/* 10 Scythe */
10: scene(SKY_R, GR_SND)
  + `<path d="M18 46 q44 -6 62 34" fill="none" stroke-width="7" stroke="${STEEL}"/>`
  + `<path d="M18 46 q44 -6 62 34" fill="none" stroke-width="1.4"/>`
  + `<path d="M22 54 q40 -4 56 30" fill="none" stroke-width="1" stroke="${WHT}"/>`
  + `<rect x="72" y="76" width="6" height="48" rx="2.4" fill="${WOOD}" stroke-width="1.5" transform="rotate(9 75 100)"/>`
  + `<rect x="56" y="96" width="22" height="5" rx="2" fill="${WOOD}" stroke-width="1.3"/>`,

/* 11 Whip */
11: scene(SKY_R, GR_SND)
  + `<rect x="26" y="42" width="6" height="82" rx="2.6" fill="${WOOD}" stroke-width="1.5" transform="rotate(-16 29 83)"/>`
  + `<rect x="68" y="42" width="6" height="82" rx="2.6" fill="${WOOD}" stroke-width="1.5" transform="rotate(16 71 83)"/>`
  + `<path d="M38 60 q14 8 26 0 M38 106 q14 -8 26 0" fill="none" stroke-width="1.3"/>`
  + `<circle cx="50" cy="83" r="4.6" fill="${RED}" stroke-width="1.2"/>`,

/* 12 Birds */
12: scene(SKY_B, GR_GRN)
  + `<ellipse cx="36" cy="80" rx="11" ry="8.4" fill="${STL}" stroke-width="1.4"/>`
  + `<circle cx="27" cy="71" r="5.4" fill="${STL}" stroke-width="1.3"/>`
  + `<path d="M22 70 l-6 2 l6 2 Z" fill="${GOLD}" stroke-width="0.9"/>`
  + `<path d="M36 76 q9 -9 15 1 q-9 5 -15 -1 Z" fill="${WHT}" stroke-width="1.2"/>`
  + `<ellipse cx="66" cy="94" rx="11" ry="8.4" fill="${STL}" stroke-width="1.4"/>`
  + `<circle cx="75" cy="85" r="5.4" fill="${STL}" stroke-width="1.3"/>`
  + `<path d="M80 84 l6 2 l-6 2 Z" fill="${GOLD}" stroke-width="0.9"/>`
  + `<path d="M66 90 q-9 -9 -15 1 q9 5 15 -1 Z" fill="${WHT}" stroke-width="1.2"/>`
  + `<line x1="32" y1="88" x2="30" y2="96" stroke-width="1.1"/><line x1="70" y1="102" x2="72" y2="110" stroke-width="1.1"/>`,

/* 13 Child */
13: scene(SKY_Y, GR_GRN)
  + `<path d="M40 92 L60 92 L62 124 L38 124 Z" fill="${SKY_B}" stroke-width="1.5"/>`
  + `<circle cx="50" cy="76" r="11" fill="${SKIN}" stroke-width="1.5"/>`
  + `<path d="M39 72 q11 -12 22 0 q-11 -5 -22 0 Z" fill="${WOOD}" stroke-width="1.2"/>`
  + `<circle cx="46" cy="77" r="1.3" fill="${IK}" stroke="none"/><circle cx="54" cy="77" r="1.3" fill="${IK}" stroke="none"/>`
  + `<path d="M46 82 q4 3 8 0" fill="none" stroke-width="1.1"/>`
  + `<line x1="40" y1="98" x2="30" y2="106" stroke-width="1.7"/><line x1="60" y1="98" x2="70" y2="106" stroke-width="1.7"/>`
  + `<circle cx="73" cy="110" r="6" fill="${RED}" stroke-width="1.3"/>`,

/* 14 Fox */
14: scene(SKY_R, GR_SND)
  + `<path d="M28 104 q6 -26 26 -26 q18 0 20 20 q1 14 -10 18 L34 116 Z" fill="#C4622E" stroke-width="1.5"/>`
  + `<path d="M34 84 L28 62 L44 74 Z" fill="#C4622E" stroke-width="1.3"/>`
  + `<path d="M66 82 L74 62 L76 82 Z" fill="#C4622E" stroke-width="1.3"/>`
  + `<circle cx="45" cy="90" r="1.6" fill="${IK}" stroke="none"/><circle cx="62" cy="90" r="1.6" fill="${IK}" stroke="none"/>`
  + `<path d="M28 104 q-14 4 -14 18 q10 4 16 -8 Z" fill="#C4622E" stroke-width="1.3"/>`
  + `<circle cx="53" cy="101" r="2.4" fill="${DRK}" stroke="none"/>`,

/* 15 Bear */
15: scene(SKY_G, GR_GRN)
  + `<ellipse cx="52" cy="98" rx="26" ry="24" fill="${WOOD}" stroke-width="1.6"/>`
  + `<circle cx="52" cy="66" r="16" fill="${WOOD}" stroke-width="1.6"/>`
  + `<circle cx="38" cy="53" r="6.4" fill="${WOOD}" stroke-width="1.3"/>`
  + `<circle cx="66" cy="53" r="6.4" fill="${WOOD}" stroke-width="1.3"/>`
  + `<circle cx="46" cy="65" r="1.7" fill="${IK}" stroke="none"/><circle cx="58" cy="65" r="1.7" fill="${IK}" stroke="none"/>`
  + `<ellipse cx="52" cy="74" rx="7" ry="5.4" fill="${SKIN}" stroke-width="1.2"/>`
  + `<circle cx="52" cy="72" r="2.4" fill="${DRK}" stroke="none"/>`,

/* 16 Stars */
16: scene(SKY_N, GR_DRK)
  + star(50, 56, 12, 8, GOLD, 1.3)
  + star(26, 40, 6, 6, GOLD, 1)
  + star(76, 42, 6.4, 6, GOLD, 1)
  + star(32, 84, 5.4, 6, WHT, 1)
  + star(70, 88, 6, 6, WHT, 1)
  + star(50, 106, 5, 6, GOLD, 1)
  + `<circle cx="20" cy="66" r="1.4" fill="${WHT}" stroke="none"/><circle cx="86" cy="70" r="1.4" fill="${WHT}" stroke="none"/>`
  + `<circle cx="60" cy="30" r="1.2" fill="${WHT}" stroke="none"/><circle cx="38" cy="112" r="1.2" fill="${WHT}" stroke="none"/>`,

/* 17 Stork */
17: scene(SKY_B, GR_GRN)
  + `<ellipse cx="50" cy="76" rx="16" ry="11" fill="${WHT}" stroke-width="1.5"/>`
  + `<path d="M56 68 q6 -22 4 -30" fill="none" stroke-width="3.4" stroke="${WHT}"/>`
  + `<path d="M56 68 q6 -22 4 -30" fill="none" stroke-width="1.2"/>`
  + `<circle cx="60" cy="36" r="5.4" fill="${WHT}" stroke-width="1.3"/>`
  + `<path d="M65 35 l12 3 l-12 3 Z" fill="${RED}" stroke-width="1"/>`
  + `<path d="M40 72 q12 -12 22 2 q-12 8 -22 -2 Z" fill="${DRK}" stroke-width="1.2"/>`
  + `<line x1="45" y1="86" x2="43" y2="112" stroke-width="1.6"/><line x1="55" y1="86" x2="57" y2="112" stroke-width="1.6"/>`
  + `<path d="M38 112 l10 0 M52 112 l10 0" fill="none" stroke-width="1.3"/>`,

/* 18 Dog */
18: scene(SKY_Y, GR_GRN)
  + `<ellipse cx="46" cy="96" rx="24" ry="15" fill="${WOOD}" stroke-width="1.5"/>`
  + `<circle cx="72" cy="80" r="13" fill="${WOOD}" stroke-width="1.5"/>`
  + `<path d="M62 70 q-4 -14 6 -12 q3 6 0 13 Z" fill="${WOOD}" stroke-width="1.3"/>`
  + `<path d="M84 78 l7 2 l-7 4 Z" fill="${DRK}" stroke-width="1"/>`
  + `<circle cx="76" cy="76" r="1.6" fill="${IK}" stroke="none"/>`
  + `<path d="M22 92 q-8 -14 2 -18 q6 6 2 18 Z" fill="${WOOD}" stroke-width="1.3"/>`
  + `<line x1="34" y1="108" x2="34" y2="122" stroke-width="1.9"/><line x1="56" y1="108" x2="56" y2="122" stroke-width="1.9"/>`
  + `<circle cx="72" cy="93" r="3.4" fill="${RED}" stroke-width="1.1"/>`,

/* 19 Tower */
19: scene(SKY_G, GR_STN)
  + `<path d="M38 44 L62 44 L66 124 L34 124 Z" fill="${STONE}" stroke-width="1.7"/>`
  + `<path d="M34 44 L50 28 L66 44 Z" fill="${STL}" stroke-width="1.4"/>`
  + `<line x1="36" y1="64" x2="64" y2="64" stroke-width="1.1"/>`
  + `<line x1="35" y1="88" x2="65" y2="88" stroke-width="1.1"/>`
  + `<path d="M45 70 L55 70 L55 84 Q50 88 45 84 Z" fill="${SKY_N}" stroke-width="1.3"/>`
  + `<path d="M45 102 L56 102 L56 124 L45 124 Z" fill="${DRK}" stroke-width="1.3"/>`
  + `<line x1="50" y1="28" x2="50" y2="18" stroke-width="1.3"/><path d="M50 18 l10 3 l-10 3 Z" fill="${RED}" stroke-width="1"/>`,

/* 20 Garden */
20: scene(SKY_B, GR_GRN)
  + `<path d="M5 124 L45 92 L55 92 L95 124 Z" fill="${GR_SND}" stroke="none"/>`
  + `<line x1="24" y1="124" x2="46" y2="92" stroke-width="1.1"/><line x1="76" y1="124" x2="54" y2="92" stroke-width="1.1"/>`
  + `<circle cx="22" cy="72" r="12" fill="${GR_GRN}" stroke-width="1.4"/><rect x="19" y="82" width="6" height="14" fill="${WOOD}" stroke-width="1.2"/>`
  + `<circle cx="78" cy="72" r="12" fill="${GR_GRN}" stroke-width="1.4"/><rect x="75" y="82" width="6" height="14" fill="${WOOD}" stroke-width="1.2"/>`
  + `<path d="M38 78 L62 78 L62 66 Q50 56 38 66 Z" fill="${WHT}" stroke-width="1.4"/>`
  + `<line x1="42" y1="78" x2="42" y2="92" stroke-width="1.3"/><line x1="58" y1="78" x2="58" y2="92" stroke-width="1.3"/>`
  + `<line x1="30" y1="104" x2="42" y2="104" stroke-width="1.1"/><line x1="58" y1="104" x2="70" y2="104" stroke-width="1.1"/>`,

/* 21 Mountain */
21: scene(SKY_G, GR_STN)
  + `<path d="M5 124 L34 58 L58 124 Z" fill="${GR_STN}" stroke-width="1.6"/>`
  + `<path d="M34 58 L24 82 L44 82 Z" fill="${GR_SNW}" stroke-width="1.2"/>`
  + `<path d="M42 124 L70 44 L95 124 Z" fill="${STL}" stroke-width="1.6"/>`
  + `<path d="M70 44 L58 74 L82 74 Z" fill="${GR_SNW}" stroke-width="1.2"/>`
  + `<path d="M16 36 q10 -6 18 2 M64 26 q10 -5 16 2" fill="none" stroke-width="1.1"/>`,

/* 22 Crossroads */
22: scene(SKY_Y, GR_GRN)
  + `<path d="M42 124 L46 84 L54 84 L58 124 Z" fill="${GR_SND}" stroke-width="1.3"/>`
  + `<path d="M46 84 L18 50 L26 46 L52 80 Z" fill="${GR_SND}" stroke-width="1.3"/>`
  + `<path d="M54 84 L82 50 L74 46 L48 80 Z" fill="${GR_SND}" stroke-width="1.3"/>`
  + `<rect x="48" y="60" width="4" height="26" fill="${WOOD}" stroke-width="1.2"/>`
  + `<path d="M52 62 L70 62 L74 66 L52 66 Z" fill="${WOOD}" stroke-width="1.2"/>`
  + `<path d="M48 70 L30 70 L26 74 L48 74 Z" fill="${WOOD}" stroke-width="1.2"/>`,

/* 23 Mice */
23: scene(SKY_G, GR_SND)
  + `<ellipse cx="38" cy="94" rx="16" ry="11" fill="${STL}" stroke-width="1.4"/>`
  + `<circle cx="52" cy="86" r="8" fill="${STL}" stroke-width="1.3"/>`
  + `<circle cx="48" cy="77" r="5" fill="${STL}" stroke-width="1.2"/>`
  + `<circle cx="55" cy="85" r="1.4" fill="${IK}" stroke="none"/>`
  + `<path d="M22 92 q-12 4 -10 16" fill="none" stroke-width="1.4"/>`
  + `<ellipse cx="70" cy="112" rx="11" ry="7.4" fill="${STL}" stroke-width="1.3"/>`
  + `<circle cx="79" cy="107" r="5.4" fill="${STL}" stroke-width="1.2"/>`
  + `<circle cx="76" cy="101" r="3.4" fill="${STL}" stroke-width="1.1"/>`
  + `<path d="M60 114 q-9 3 -8 10" fill="none" stroke-width="1.2"/>`
  + `<path d="M28 60 q6 -8 12 0 q-6 6 -12 0 Z" fill="${WOOD}" stroke-width="1.2"/>`
  + `<path d="M62 56 q7 -9 14 0 q-7 7 -14 0 Z" fill="${WOOD}" stroke-width="1.2"/>`,

/* 24 Heart */
24: scene(SKY_R, GR_SND)
  + `<path d="M50 118 C18 92 22 56 40 52 C48 50 50 60 50 64 C50 60 52 50 60 52 C78 56 82 92 50 118 Z" fill="${RED}" stroke-width="1.8"/>`
  + `<path d="M38 68 q4 -9 12 -8" fill="none" stroke-width="1.3" stroke="${WHT}"/>`,

/* 25 Ring */
25: scene(SKY_Y, GR_SND)
  + `<circle cx="50" cy="90" r="25" fill="none" stroke-width="7.4" stroke="${GOLD}"/>`
  + `<circle cx="50" cy="90" r="25" fill="none" stroke-width="1.3"/>`
  + `<circle cx="50" cy="90" r="18.4" fill="none" stroke-width="1.1"/>`
  + `<path d="M50 50 L58 62 L50 70 L42 62 Z" fill="${SKY_B}" stroke-width="1.4"/>`
  + `<line x1="42" y1="62" x2="58" y2="62" stroke-width="1"/>`,

/* 26 Book */
26: scene(SKY_G, GR_SND)
  + `<path d="M22 62 L50 70 L78 62 L78 112 L50 120 L22 112 Z" fill="${WOOD}" stroke-width="1.6"/>`
  + `<line x1="50" y1="70" x2="50" y2="120" stroke-width="1.4"/>`
  + `<path d="M26 68 L46 74 M26 76 L46 82 M54 74 L74 68 M54 82 L74 76" fill="none" stroke-width="1" stroke="${GR_SND}"/>`
  + `<circle cx="50" cy="94" r="6" fill="${GOLD}" stroke-width="1.3"/>`
  + `<rect x="48" y="94" width="4" height="8" fill="${GOLD}" stroke-width="1.1"/>`,

/* 27 Letter */
27: scene(SKY_Y, GR_SND)
  + `<rect x="20" y="62" width="60" height="42" fill="${WHT}" stroke-width="1.7"/>`
  + `<path d="M20 62 L50 88 L80 62" fill="none" stroke-width="1.4"/>`
  + `<path d="M20 104 L42 82 M80 104 L58 82" fill="none" stroke-width="1.1"/>`
  + `<circle cx="50" cy="98" r="6.4" fill="${RED}" stroke-width="1.3"/>`
  + `<path d="M47 96 l6 4 M53 96 l-6 4" fill="none" stroke-width="0.9" stroke="${WHT}"/>`,

/* 28 Man */
28: scene(SKY_B, GR_GRN)
  + `<path d="M34 84 L66 84 L70 124 L30 124 Z" fill="${SKY_N}" stroke-width="1.6"/>`
  + `<path d="M44 84 L50 100 L56 84 Z" fill="${WHT}" stroke-width="1.2"/>`
  + `<path d="M50 100 L50 112" fill="none" stroke-width="1.6" stroke="${RED}"/>`
  + `<circle cx="50" cy="66" r="12" fill="${SKIN}" stroke-width="1.5"/>`
  + `<path d="M38 62 q12 -13 24 0 q-12 -6 -24 0 Z" fill="${DRK}" stroke-width="1.2"/>`
  + `<circle cx="45" cy="66" r="1.4" fill="${IK}" stroke="none"/><circle cx="55" cy="66" r="1.4" fill="${IK}" stroke="none"/>`
  + `<path d="M45 73 q5 3 10 0" fill="none" stroke-width="1.1"/>`,

/* 29 Woman */
29: scene(SKY_R, GR_GRN)
  + `<path d="M38 84 L62 84 L74 124 L26 124 Z" fill="${ROSE}" stroke-width="1.6"/>`
  + `<circle cx="50" cy="66" r="12" fill="${SKIN}" stroke-width="1.5"/>`
  + `<path d="M36 68 q-2 -20 14 -20 q16 0 14 20 q-4 -12 -14 -10 q-10 -2 -14 10 Z" fill="${WOOD}" stroke-width="1.3"/>`
  + `<path d="M38 66 q-4 16 0 24 M62 66 q4 16 0 24" fill="none" stroke-width="1.3" stroke="${WOOD}"/>`
  + `<circle cx="45" cy="67" r="1.4" fill="${IK}" stroke="none"/><circle cx="55" cy="67" r="1.4" fill="${IK}" stroke="none"/>`
  + `<path d="M46 74 q4 3 8 0" fill="none" stroke-width="1.1"/>`,

/* 30 Lily */
30: scene(SKY_G, GR_SND)
  + `<path d="M50 96 L50 58" fill="none" stroke-width="1.7" stroke="${GRN}"/>`
  + `<path d="M50 62 q-20 -8 -22 -26 q16 2 22 26 Z" fill="${WHT}" stroke-width="1.4"/>`
  + `<path d="M50 62 q20 -8 22 -26 q-16 2 -22 26 Z" fill="${WHT}" stroke-width="1.4"/>`
  + `<path d="M50 60 q-9 -20 0 -34 q9 14 0 34 Z" fill="${WHT}" stroke-width="1.4"/>`
  + `<circle cx="50" cy="58" r="3.4" fill="${GOLD}" stroke-width="1.1"/>`
  + `<path d="M50 78 q-16 2 -18 12 q14 2 18 -12 Z" fill="${GRN}" stroke-width="1.2"/>`
  + `<path d="M50 88 q16 2 18 12 q-14 2 -18 -12 Z" fill="${GRN}" stroke-width="1.2"/>`
  + `<path d="M40 96 L60 96 L57 124 L43 124 Z" fill="${STONE}" stroke-width="1.4"/>`,

/* 31 Sun */
31: scene(SKY_Y, GR_SND)
  + sun(50, 76, 20, GOLD, 16, 15)
  + `<circle cx="43" cy="71" r="1.7" fill="${IK}" stroke="none"/><circle cx="57" cy="71" r="1.7" fill="${IK}" stroke="none"/>`
  + `<path d="M42 82 q8 7 16 0" fill="none" stroke-width="1.3"/>`
  + `<path d="M18 124 q10 -9 20 0 M62 124 q10 -9 20 0" fill="none" stroke-width="1.1"/>`,

/* 32 Moon */
32: scene(SKY_N, GR_DRK)
  + `<path d="M62 34 a34 34 0 1 0 0 68 a27 27 0 1 1 0 -68 Z" fill="${GOLD}" stroke-width="1.6"/>`
  + `<circle cx="50" cy="56" r="3.4" fill="${SKY_Y}" stroke-width="0.9"/>`
  + `<circle cx="44" cy="76" r="4.6" fill="${SKY_Y}" stroke-width="0.9"/>`
  + star(24, 44, 5.4, 6, WHT, 1)
  + star(80, 108, 4.6, 6, WHT, 1)
  + `<circle cx="30" cy="98" r="1.4" fill="${WHT}" stroke="none"/><circle cx="76" cy="42" r="1.4" fill="${WHT}" stroke="none"/>`,

/* 33 Key */
33: scene(SKY_G, GR_SND)
  + `<circle cx="50" cy="52" r="14" fill="none" stroke-width="5.4" stroke="${GOLD}"/>`
  + `<circle cx="50" cy="52" r="14" fill="none" stroke-width="1.3"/>`
  + `<circle cx="50" cy="52" r="6.4" fill="none" stroke-width="1.1"/>`
  + `<rect x="46" y="66" width="8" height="52" fill="${GOLD}" stroke-width="1.4"/>`
  + `<rect x="54" y="96" width="13" height="7" fill="${GOLD}" stroke-width="1.3"/>`
  + `<rect x="54" y="108" width="9" height="7" fill="${GOLD}" stroke-width="1.3"/>`,

/* 34 Fish */
34: scene(SKY_B, '#4E7FA8')
  + `<rect x="5" y="5" width="90" height="135" fill="#4E7FA8" stroke="none"/>`
  + `<path d="M30 78 q22 -22 44 0 q-22 22 -44 0 Z" fill="${BLU}" stroke-width="1.6"/>`
  + `<path d="M30 78 L14 62 L18 78 L14 94 Z" fill="${BLU}" stroke-width="1.4"/>`
  + `<circle cx="64" cy="73" r="2.4" fill="${WHT}" stroke-width="1"/>`
  + `<path d="M50 62 q4 8 0 16 M58 64 q4 7 0 14" fill="none" stroke-width="1.1"/>`
  + `<circle cx="34" cy="46" r="3.4" fill="none" stroke-width="1.1" stroke="${WHT}"/>`
  + `<circle cx="46" cy="36" r="2.4" fill="none" stroke-width="1" stroke="${WHT}"/>`
  + `<circle cx="70" cy="106" r="7.4" fill="${GOLD}" stroke-width="1.3"/>`
  + `<circle cx="52" cy="114" r="5.4" fill="${GOLD}" stroke-width="1.2"/>`
  + `<circle cx="34" cy="108" r="6.4" fill="${GOLD}" stroke-width="1.2"/>`,

/* 35 Anchor */
35: scene(SKY_B, '#4E7FA8')
  + `<rect x="5" y="112" width="90" height="28" fill="#4E7FA8" stroke="none"/>`
  + `<circle cx="50" cy="38" r="7.4" fill="none" stroke-width="3.4" stroke="${STL}"/>`
  + `<circle cx="50" cy="38" r="7.4" fill="none" stroke-width="1.2"/>`
  + `<rect x="46" y="46" width="8" height="66" fill="${STL}" stroke-width="1.4"/>`
  + `<rect x="26" y="56" width="48" height="7" rx="3" fill="${STL}" stroke-width="1.4"/>`
  + `<path d="M20 88 q0 34 30 34 q30 0 30 -34 q-8 22 -30 22 q-22 0 -30 -22 Z" fill="${STL}" stroke-width="1.6"/>`
  + `<path d="M14 84 l6 6 l7 -5 Z" fill="${STL}" stroke-width="1.2"/>`
  + `<path d="M86 84 l-6 6 l-7 -5 Z" fill="${STL}" stroke-width="1.2"/>`,

/* 36 Cross */
36: scene(SKY_N, GR_STN)
  + `<rect x="43" y="30" width="14" height="94" fill="${WOOD}" stroke-width="1.7"/>`
  + `<rect x="20" y="58" width="60" height="14" fill="${WOOD}" stroke-width="1.7"/>`
  + `<line x1="46" y1="36" x2="46" y2="118" stroke-width="0.9" stroke="${DRK}"/>`
  + `<line x1="26" y1="65" x2="74" y2="65" stroke-width="0.9" stroke="${DRK}"/>`
  + `<path d="M18 124 q12 -7 24 0 M58 124 q12 -7 24 0" fill="none" stroke-width="1.1"/>`

};
