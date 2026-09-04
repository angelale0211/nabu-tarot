/* Card artwork -- drawn SVG, shared with The Learner's Deck. */
/* ============================ palette ============================ */
const IK   = 'var(--card-ink)';
const BG   = 'var(--card-bg)';
const RED='#BE3D28', BLU='#245F94', STL='#8792A3', GRN='#456E3E', VIO='#5B4B8A';
const GOLD='#E8BC33', WHT='#F7F5EC', SKIN='#EFD9B6', DRK='#242433', STEEL='#CBD2DA',
      WOOD='#96693C', STONE='#BFB9A4', ROSE='#D4869B';
const SKY_Y='#F2E1AC', SKY_B='#C2DAEC', SKY_N='#242C57', SKY_G='#D3D9CE', SKY_R='#E8A97C';
const GR_GRN='#6E8F52', GR_SND='#D6C79F', GR_SNW='#E2E6E9', GR_DRK='#3D4159', GR_STN='#ADA792';

const SUIT_COLOR = {
  major: VIO, wands: RED, cups: BLU, swords: STL, pentacles: GRN
};

/* ============================ drawing helpers ============================ */
function scene(sky, ground){
  return `<rect x="5" y="5" width="90" height="119" fill="${sky}" stroke="none"/>`
       + `<rect x="5" y="124" width="90" height="16" fill="${ground}" stroke="none"/>`;
}
function starPts(cx,cy,ro,ri,n,rot){
  rot = (rot===undefined? -90 : rot);
  let p=[];
  for(let i=0;i<n*2;i++){
    const r = i%2 ? ri : ro;
    const a = (rot + i*180/n) * Math.PI/180;
    p.push((cx+r*Math.cos(a)).toFixed(2)+','+(cy+r*Math.sin(a)).toFixed(2));
  }
  return p.join(' ');
}
function star(cx,cy,ro,n,fill,sw){
  return `<polygon points="${starPts(cx,cy,ro,ro*0.42,n||5)}" fill="${fill||GOLD}" stroke-width="${sw||0.8}"/>`;
}
function sun(cx,cy,r,fill,nray,len){
  fill=fill||GOLD; nray=nray||14; len=len||r*0.75;
  let rays='';
  for(let i=0;i<nray;i++){
    const a=i*2*Math.PI/nray;
    rays += `<line x1="${(cx+Math.cos(a)*r).toFixed(2)}" y1="${(cy+Math.sin(a)*r).toFixed(2)}" x2="${(cx+Math.cos(a)*(r+len)).toFixed(2)}" y2="${(cy+Math.sin(a)*(r+len)).toFixed(2)}" stroke-width="1.1"/>`;
  }
  return rays + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke-width="1.3"/>`;
}
function pentagram(cx,cy,r,stroke,sw){
  const pts=[];
  for(let i=0;i<5;i++){const a=(-90+i*72)*Math.PI/180; pts.push([cx+r*Math.cos(a), cy+r*Math.sin(a)]);}
  const o=[0,2,4,1,3];
  return `<polygon points="${o.map(i=>pts[i][0].toFixed(2)+','+pts[i][1].toFixed(2)).join(' ')}" fill="none" stroke="${stroke||IK}" stroke-width="${sw||1}"/>`;
}
function tower(x,y,w,h,fill){
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill||STONE}" stroke-width="1.2"/>`;
}

/* ---- the four suit emblems, drawn centred on the origin ---- */
function emblem(suit,x,y,s){
  const g=`transform="translate(${x},${y}) scale(${s})"`;
  if(suit==='wands') return `<g ${g}>
    <path d="M-2.4 5 C-8.5 3 -11 -2 -9.4 -5 C-4.6 -4.4 -2.4 -0.4 -2.4 2 Z" fill="${GRN}" stroke-width="1.2"/>
    <path d="M2.4 -4 C8.5 -6 11 -11 9.4 -14 C4.6 -13.4 2.4 -9.4 2.4 -7 Z" fill="${GRN}" stroke-width="1.2"/>
    <rect x="-2.4" y="-16.5" width="4.8" height="33" rx="1.8" fill="${WOOD}" stroke-width="1.4"/></g>`;
  if(suit==='cups') return `<g ${g}>
    <path d="M-9.4 -14 L9.4 -14 L6.6 -3.4 Q0 3.4 -6.6 -3.4 Z" fill="${BLU}" stroke-width="1.4"/>
    <rect x="-1.7" y="1.6" width="3.4" height="6.6" fill="${BLU}" stroke-width="1.2"/>
    <path d="M-8 14.4 L8 14.4 L5.2 8.2 L-5.2 8.2 Z" fill="${BLU}" stroke-width="1.3"/></g>`;
  if(suit==='swords') return `<g ${g}>
    <path d="M0 -17.5 L3.3 -10 L3.3 3 L-3.3 3 L-3.3 -10 Z" fill="${STEEL}" stroke-width="1.3"/>
    <rect x="-8.4" y="3" width="16.8" height="3.4" rx="1.2" fill="${STL}" stroke-width="1.3"/>
    <rect x="-1.8" y="6.4" width="3.6" height="7" fill="${STL}" stroke-width="1.2"/>
    <circle cx="0" cy="15" r="2.7" fill="${STL}" stroke-width="1.2"/></g>`;
  return `<g ${g}>
    <circle cx="0" cy="0" r="12.6" fill="${GOLD}" stroke-width="1.5"/>
    ${pentagram(0,0,8.8,GRN,1.2)}</g>`;
}

/* ---- pip layouts, in the art area y 30–132 ---- */
const PIPS = {
  1:[[50,84]],
  2:[[50,50],[50,116]],
  3:[[50,42],[50,84],[50,126]],
  4:[[34,50],[66,50],[34,118],[66,118]],
  5:[[34,46],[66,46],[50,84],[34,122],[66,122]],
  6:[[34,42],[66,42],[34,84],[66,84],[34,126],[66,126]],
  7:[[34,42],[66,42],[50,63],[34,84],[66,84],[34,126],[66,126]],
  8:[[34,38],[66,38],[34,68],[66,68],[34,98],[66,98],[34,128],[66,128]],
  9:[[34,38],[66,38],[34,68],[66,68],[50,83],[34,98],[66,98],[34,128],[66,128]],
  10:[[34,38],[66,38],[50,53],[34,68],[66,68],[34,98],[66,98],[50,113],[34,128],[66,128]]
};
const PIPSC = {1:1.55,2:1.15,3:0.98,4:1.0,5:0.9,6:0.86,7:0.8,8:0.75,9:0.72,10:0.7};

function pipArt(suit,n){
  let out='';
  if(n===1){ out += sun(50,84,17,'rgba(232,188,51,.28)',18,10).replace(/stroke-width="1.3"/,'stroke-width="0"'); }
  PIPS[n].forEach(p => { out += emblem(suit,p[0],p[1],PIPSC[n]); });
  return out;
}

/* ---- court figures ---- */
function courtArt(rank,suit){
  const c = SUIT_COLOR[suit];
  const sky = suit==='cups'?SKY_B : suit==='swords'?SKY_G : suit==='pentacles'?SKY_Y : SKY_R;
  const grd = suit==='cups'?'#3E7FA8' : suit==='swords'?'#9AA3AE' : suit==='pentacles'?GR_GRN : GR_SND;
  let art = scene(sky,grd);

  if(rank==='Page'){
    art += `<path d="M40 84 L58 84 L62 128 L36 128 Z" fill="${c}" stroke-width="1.4"/>`
        +  `<circle cx="49" cy="74" r="7.6" fill="${SKIN}" stroke-width="1.3"/>`
        +  `<path d="M40 69 q9 -9 18 -2 z" fill="${c}" stroke-width="1.3"/>`
        +  `<line x1="58" y1="90" x2="70" y2="96" stroke-width="2"/>`
        +  emblem(suit,73,86,0.68);
  } else if(rank==='Knight'){
    art += `<path d="M22 128 L22 112 Q22 104 34 104 L62 104 Q74 104 74 114 L74 128 Z" fill="${WHT}" stroke-width="1.4"/>`
        +  `<path d="M62 106 L74 84 L84 84 L82 96 L74 112 Z" fill="${WHT}" stroke-width="1.4"/>`
        +  `<rect x="27" y="122" width="4" height="10" fill="${WHT}" stroke-width="1.1"/>`
        +  `<rect x="62" y="122" width="4" height="10" fill="${WHT}" stroke-width="1.1"/>`
        +  `<path d="M34 100 L50 100 L54 76 L38 76 Z" fill="${c}" stroke-width="1.4"/>`
        +  `<circle cx="45" cy="68" r="7" fill="${SKIN}" stroke-width="1.3"/>`
        +  `<path d="M38 62 q7 -8 14 -1 z" fill="${c}" stroke-width="1.2"/>`
        +  `<path d="M52 60 q9 -6 12 2" fill="none" stroke-width="1.6"/>`
        +  emblem(suit,72,60,0.6);
  } else if(rank==='Queen'){
    art += `<rect x="26" y="54" width="48" height="74" fill="${STONE}" stroke-width="1.3"/>`
        +  `<path d="M34 128 L38 96 L62 96 L66 128 Z" fill="${c}" stroke-width="1.4"/>`
        +  `<path d="M40 96 L42 78 L58 78 L60 96 Z" fill="${c}" stroke-width="1.3"/>`
        +  `<circle cx="50" cy="70" r="7.6" fill="${SKIN}" stroke-width="1.3"/>`
        +  `<polygon points="${starPts(50,61,6,2.6,3,-90)}" fill="${GOLD}" stroke-width="1.1"/>`
        +  emblem(suit,50,110,0.62);
  } else {
    art += `<rect x="24" y="46" width="52" height="82" fill="${STONE}" stroke-width="1.3"/>`
        +  `<path d="M32 128 L36 94 L64 94 L68 128 Z" fill="${c}" stroke-width="1.4"/>`
        +  `<path d="M38 94 L40 74 L60 74 L62 94 Z" fill="${c}" stroke-width="1.3"/>`
        +  `<circle cx="50" cy="66" r="7.8" fill="${SKIN}" stroke-width="1.3"/>`
        +  `<polygon points="${starPts(50,55,7.5,3,5,-90)}" fill="${GOLD}" stroke-width="1.1"/>`
        +  emblem(suit,72,96,0.6);
  }
  return art;
}

/* ============================ Major Arcana artwork ============================ */
const MAJOR_ART = {
0:  scene(SKY_Y,GR_SND)
    + sun(74,32,8)
    + `<path d="M64 124 L95 124 L95 140 L64 140 Z" fill="#8B8470" stroke="none"/>`
    + `<line x1="64" y1="124" x2="64" y2="140" stroke-width="1.2"/>`
    + `<path d="M42 82 L56 82 L60 124 L38 124 Z" fill="${RED}" stroke-width="1.4"/>`
    + `<circle cx="48" cy="72" r="7.4" fill="${SKIN}" stroke-width="1.3"/>`
    + `<path d="M41 67 q8 -8 15 -2 z" fill="${RED}" stroke-width="1.2"/>`
    + `<line x1="28" y1="64" x2="46" y2="92" stroke-width="2.1"/>`
    + `<circle cx="26" cy="61" r="4.8" fill="${GRN}" stroke-width="1.2"/>`
    + `<circle cx="63" cy="96" r="3.8" fill="${WHT}" stroke-width="1.2"/>`
    + `<path d="M19 124 L19 115 Q24 110 29 116 L31 124 Z" fill="${WHT}" stroke-width="1.2"/>`,
1:  scene(SKY_Y,GR_GRN)
    + `<circle cx="44" cy="50" r="4.6" fill="none" stroke-width="1.4"/><circle cx="54" cy="50" r="4.6" fill="none" stroke-width="1.4"/>`
    + `<rect x="24" y="104" width="52" height="5" fill="${WOOD}" stroke-width="1.3"/>`
    + `<line x1="30" y1="96" x2="30" y2="104" stroke-width="1.6"/>`
    + `<path d="M39 98 L46 98 L44.6 104 L40.4 104 Z" fill="${BLU}" stroke-width="1.1"/>`
    + `<line x1="55" y1="96" x2="55" y2="104" stroke-width="1.6"/><line x1="52" y1="99" x2="58" y2="99" stroke-width="1.3"/>`
    + `<circle cx="68" cy="100" r="4" fill="${GOLD}" stroke-width="1.1"/>`
    + `<path d="M40 80 L60 80 L64 104 L36 104 Z" fill="${WHT}" stroke-width="1.4"/>`
    + `<path d="M58 80 L66 80 L70 104 L62 104 Z" fill="${RED}" stroke-width="1.3"/>`
    + `<circle cx="50" cy="71" r="7" fill="${SKIN}" stroke-width="1.3"/>`
    + `<line x1="56" y1="78" x2="68" y2="60" stroke-width="2"/><line x1="66" y1="64" x2="72" y2="52" stroke-width="2.6" stroke="${WHT}"/>`
    + `<line x1="44" y1="80" x2="34" y2="98" stroke-width="2"/>`,
2:  scene(SKY_N,GR_DRK)
    + `<rect x="26" y="50" width="48" height="74" fill="#3A5687" stroke-width="1.2"/>`
    + `<circle cx="38" cy="66" r="2.4" fill="${RED}" stroke="none"/><circle cx="62" cy="66" r="2.4" fill="${RED}" stroke="none"/><circle cx="50" cy="58" r="2.4" fill="${RED}" stroke="none"/>`
    + tower(13,46,13,78,DRK) + tower(74,46,13,78,WHT)
    + `<path d="M40 84 L60 84 L66 124 L34 124 Z" fill="${SKY_B}" stroke-width="1.4"/>`
    + `<circle cx="50" cy="75" r="7.2" fill="${SKIN}" stroke-width="1.3"/>`
    + `<path d="M42 68 Q50 61 58 68" fill="none" stroke-width="1.5"/><circle cx="50" cy="66" r="2.6" fill="${GOLD}" stroke-width="1"/>`
    + `<rect x="43" y="96" width="15" height="9" fill="${WHT}" stroke-width="1.2"/>`
    + `<path d="M43 132 a7.5 7.5 0 1 0 8.5 8 a5.6 5.6 0 1 1 -8.5 -8 Z" fill="${WHT}" stroke-width="1.1"/>`,
3:  scene(SKY_Y,GR_GRN)
    + `<g stroke-width="1">${[36,42,48,54,60,66].map((x,i)=>star(x,32+(i===0||i===5?5:i===1||i===4?1:0),2.6,5,GOLD,0.7)).join('')}</g>`
    + `<path d="M32 128 L38 88 L62 88 L68 128 Z" fill="#D9CBE4" stroke-width="1.4"/>`
    + `<path d="M42 88 L44 74 L56 74 L58 88 Z" fill="#D9CBE4" stroke-width="1.2"/>`
    + `<circle cx="50" cy="66" r="7.4" fill="${SKIN}" stroke-width="1.3"/>`
    + `<path d="M20 108 L32 108 L32 122 Q26 130 20 122 Z" fill="${WHT}" stroke-width="1.3"/>`
    + `<circle cx="26" cy="113" r="3.2" fill="none" stroke="${GRN}" stroke-width="1.2"/><line x1="26" y1="116" x2="26" y2="122" stroke="${GRN}" stroke-width="1.2"/><line x1="23" y1="119" x2="29" y2="119" stroke="${GRN}" stroke-width="1.2"/>`
    + `<g stroke="${GOLD}" stroke-width="1.5">${[74,79,84].map(x=>`<line x1="${x}" y1="124" x2="${x}" y2="102"/><circle cx="${x}" cy="99" r="2.6" fill="${GOLD}" stroke-width="0.8"/>`).join('')}</g>`,
4:  scene(SKY_R,GR_STN)
    + `<path d="M22 124 L22 52 L78 52 L78 124 Z" fill="${STONE}" stroke-width="1.3"/>`
    + `<circle cx="27" cy="48" r="5" fill="${STONE}" stroke-width="1.2"/><circle cx="73" cy="48" r="5" fill="${STONE}" stroke-width="1.2"/>`
    + `<path d="M22 44 q5 -6 10 0" fill="none" stroke-width="1.2"/><path d="M68 44 q5 -6 10 0" fill="none" stroke-width="1.2"/>`
    + `<path d="M32 124 L36 90 L64 90 L68 124 Z" fill="${RED}" stroke-width="1.4"/>`
    + `<path d="M38 90 L40 72 L60 72 L62 90 Z" fill="${RED}" stroke-width="1.3"/>`
    + `<circle cx="50" cy="64" r="7.6" fill="${SKIN}" stroke-width="1.3"/>`
    + `<path d="M40 68 q10 10 20 0" fill="${WHT}" stroke-width="1.1"/>`
    + `<polygon points="${starPts(50,53,7,3,5,-90)}" fill="${GOLD}" stroke-width="1"/>`
    + `<circle cx="70" cy="84" r="3.4" fill="none" stroke="${GOLD}" stroke-width="1.4"/><line x1="70" y1="87" x2="70" y2="98" stroke="${GOLD}" stroke-width="1.6"/><line x1="65" y1="91" x2="75" y2="91" stroke="${GOLD}" stroke-width="1.6"/>`,
5:  scene(SKY_G,GR_STN)
    + tower(20,44,12,80,STONE) + tower(68,44,12,80,STONE)
    + `<path d="M34 124 L38 88 L62 88 L66 124 Z" fill="${RED}" stroke-width="1.4"/>`
    + `<path d="M42 88 L43 74 L57 74 L58 88 Z" fill="${WHT}" stroke-width="1.2"/>`
    + `<circle cx="50" cy="66" r="7.2" fill="${SKIN}" stroke-width="1.3"/>`
    + `<path d="M43 58 L57 58 L55 48 L45 48 Z" fill="${GOLD}" stroke-width="1.2"/>`
    + `<path d="M45 48 L55 48 L53.5 40 L46.5 40 Z" fill="${GOLD}" stroke-width="1.1"/>`
    + `<path d="M46.5 40 L53.5 40 L52 33 L48 33 Z" fill="${GOLD}" stroke-width="1"/>`
    + `<line x1="62" y1="88" x2="70" y2="76" stroke-width="2"/>`
    + `<g stroke="${GOLD}" stroke-width="1.4"><line x1="40" y1="112" x2="52" y2="120"/><circle cx="38" cy="111" r="2.6" fill="none"/><line x1="60" y1="112" x2="48" y2="120"/><circle cx="62" cy="111" r="2.6" fill="none"/></g>`,
6:  scene(SKY_Y,GR_GRN)
    + sun(50,26,7.5)
    + `<path d="M26 46 Q50 34 74 46 Q50 42 26 46 Z" fill="${WHT}" stroke-width="1.2"/>`
    + `<circle cx="50" cy="42" r="5.4" fill="${SKIN}" stroke-width="1.2"/>`
    + `<path d="M28 124 L32 84 L44 84 L46 124 Z" fill="${SKIN}" stroke-width="1.3"/>`
    + `<circle cx="37" cy="76" r="6.4" fill="${SKIN}" stroke-width="1.2"/>`
    + `<path d="M54 124 L56 84 L68 84 L72 124 Z" fill="${SKIN}" stroke-width="1.3"/>`
    + `<circle cx="63" cy="76" r="6.4" fill="${SKIN}" stroke-width="1.2"/>`
    + `<g stroke="${RED}" stroke-width="1.6"><line x1="20" y1="124" x2="20" y2="96"/><path d="M16 96 q4 -8 8 0" fill="${RED}"/><path d="M17 88 q3 -6 6 0" fill="${RED}"/></g>`
    + `<g><line x1="80" y1="124" x2="80" y2="94" stroke="${GRN}" stroke-width="1.6"/><path d="M80 94 q-8 -4 -4 -12 q6 4 4 12" fill="${GRN}" stroke-width="1.1"/><path d="M76 106 q6 -6 10 -1" fill="none" stroke="${GRN}" stroke-width="1.3"/></g>`,
7:  scene(SKY_Y,GR_SND)
    + `<rect x="30" y="46" width="40" height="4" fill="${SKY_N}" stroke-width="1.1"/>`
    + `<g fill="${GOLD}" stroke-width="0.7">${star(38,44,2,5,GOLD)+star(50,42,2,5,GOLD)+star(62,44,2,5,GOLD)}</g>`
    + `<line x1="32" y1="50" x2="32" y2="86" stroke-width="1.5"/><line x1="68" y1="50" x2="68" y2="86" stroke-width="1.5"/>`
    + `<rect x="28" y="86" width="44" height="26" fill="${STONE}" stroke-width="1.4"/>`
    + `<circle cx="50" cy="99" r="6" fill="${GOLD}" stroke-width="1.2"/>`
    + `<path d="M42 86 L46 62 L58 62 L60 86 Z" fill="${STEEL}" stroke-width="1.3"/>`
    + `<circle cx="52" cy="55" r="6.6" fill="${SKIN}" stroke-width="1.2"/>`
    + `<path d="M14 124 L14 112 Q20 106 30 110 L34 124 Z" fill="${WHT}" stroke-width="1.3"/><circle cx="16" cy="107" r="4.4" fill="${WHT}" stroke-width="1.2"/>`
    + `<path d="M86 124 L86 112 Q80 106 70 110 L66 124 Z" fill="${DRK}" stroke-width="1.3"/><circle cx="84" cy="107" r="4.4" fill="${DRK}" stroke-width="1.2"/>`,
8:  scene(SKY_Y,GR_GRN)
    + `<circle cx="42" cy="46" r="4.4" fill="none" stroke-width="1.4"/><circle cx="52" cy="46" r="4.4" fill="none" stroke-width="1.4"/>`
    + `<circle cx="62" cy="98" r="18" fill="${GOLD}" stroke-width="1.4"/>`
    + `<circle cx="62" cy="98" r="11" fill="#D89A2E" stroke-width="1.2"/>`
    + `<circle cx="58" cy="95" r="1.6" fill="${IK}" stroke="none"/><path d="M56 104 q6 5 11 0" fill="none" stroke-width="1.3"/>`
    + `<path d="M30 124 L34 84 L50 84 L52 124 Z" fill="${WHT}" stroke-width="1.4"/>`
    + `<circle cx="41" cy="76" r="7" fill="${SKIN}" stroke-width="1.3"/>`
    + `<path d="M48 88 Q58 88 56 100" fill="none" stroke-width="2"/>`,
9:  scene(SKY_N,GR_SNW)
    + `<path d="M5 124 L28 96 L48 124 Z" fill="${GR_SNW}" stroke-width="1.2"/>`
    + `<path d="M36 128 L42 66 L58 66 L68 128 Z" fill="${STL}" stroke-width="1.4"/>`
    + `<path d="M42 66 Q50 54 58 66 Z" fill="${STL}" stroke-width="1.3"/>`
    + `<circle cx="50" cy="70" r="5.6" fill="${SKIN}" stroke-width="1.2"/>`
    + `<path d="M46 74 q4 8 8 0" fill="${WHT}" stroke-width="1"/>`
    + `<line x1="34" y1="70" x2="34" y2="128" stroke-width="2.2"/>`
    + `<line x1="66" y1="80" x2="74" y2="76" stroke-width="1.8"/>`
    + `<rect x="68" y="60" width="14" height="16" fill="${GOLD}" stroke-width="1.3"/><line x1="75" y1="60" x2="75" y2="52" stroke-width="1.3"/>`
    + `<polygon points="${starPts(75,68,4.6,2.3,6,-90)}" fill="${WHT}" stroke-width="0.8"/>`,
10: scene(SKY_B,'#8FA8BE')
    + `<circle cx="50" cy="78" r="30" fill="${GOLD}" stroke-width="1.6"/>`
    + `<circle cx="50" cy="78" r="19" fill="none" stroke-width="1.2"/><circle cx="50" cy="78" r="7" fill="${BG}" stroke-width="1.2"/>`
    + `<g stroke-width="1.2">${[0,45,90,135].map(a=>{const r=a*Math.PI/180;return `<line x1="${(50-30*Math.cos(r)).toFixed(1)}" y1="${(78-30*Math.sin(r)).toFixed(1)}" x2="${(50+30*Math.cos(r)).toFixed(1)}" y2="${(78+30*Math.sin(r)).toFixed(1)}"/>`}).join('')}</g>`
    + `<path d="M62 48 Q50 40 38 48" fill="none" stroke="${GRN}" stroke-width="1.6"/>`
    + `<g fill="${STONE}" stroke-width="1.1"><rect x="8" y="14" width="12" height="10"/><rect x="80" y="14" width="12" height="10"/><rect x="8" y="126" width="12" height="10"/><rect x="80" y="126" width="12" height="10"/></g>`,
11: scene(SKY_Y,GR_STN)
    + tower(18,40,10,84,STONE) + tower(72,40,10,84,STONE)
    + `<rect x="28" y="40" width="44" height="26" fill="#8E1F1F" stroke-width="1.2"/>`
    + `<path d="M34 124 L38 88 L62 88 L66 124 Z" fill="${RED}" stroke-width="1.4"/>`
    + `<circle cx="50" cy="76" r="7.2" fill="${SKIN}" stroke-width="1.3"/>`
    + `<polygon points="${starPts(50,66,6.4,2.8,3,-90)}" fill="${GOLD}" stroke-width="1"/>`
    + `<line x1="64" y1="96" x2="64" y2="62" stroke-width="2.4"/><path d="M64 62 L67 68 L61 68 Z" fill="${STEEL}" stroke-width="1.1"/>`
    + `<line x1="26" y1="92" x2="46" y2="92" stroke-width="1.4"/><line x1="36" y1="92" x2="36" y2="82" stroke-width="1.4"/>`
    + `<path d="M22 92 q4 7 8 0 Z" fill="${GOLD}" stroke-width="1.1"/><path d="M42 92 q4 7 8 0 Z" fill="${GOLD}" stroke-width="1.1"/>`,
12: scene(SKY_G,GR_GRN)
    + `<rect x="18" y="34" width="64" height="5" fill="${WOOD}" stroke-width="1.3"/>`
    + `<rect x="22" y="39" width="5" height="85" fill="${WOOD}" stroke-width="1.3"/><rect x="73" y="39" width="5" height="85" fill="${WOOD}" stroke-width="1.3"/>`
    + `<line x1="50" y1="39" x2="50" y2="52" stroke-width="1.6"/>`
    + `<path d="M44 52 L56 52 L60 92 L40 92 Z" fill="${BLU}" stroke-width="1.4"/>`
    + `<path d="M44 52 L38 52 L36 68 L44 66 Z" fill="${RED}" stroke-width="1.3"/>`
    + `<circle cx="50" cy="100" r="7.4" fill="${SKIN}" stroke-width="1.3"/>`
    + sun(50,100,9.2,'none',14,5)
    + `<line x1="56" y1="52" x2="66" y2="60" stroke-width="2"/>`,
13: scene(SKY_G,GR_STN)
    + tower(16,72,10,52,STONE) + tower(74,72,10,52,STONE) + sun(50,96,7,GOLD,10,4)
    + `<path d="M22 128 L22 110 Q26 100 44 100 L64 100 Q74 100 74 112 L74 128 Z" fill="${WHT}" stroke-width="1.4"/>`
    + `<path d="M62 102 L74 82 L84 82 L82 94 L74 108 Z" fill="${WHT}" stroke-width="1.4"/>`
    + `<path d="M34 98 L48 98 L50 70 L36 70 Z" fill="${DRK}" stroke-width="1.4"/>`
    + `<circle cx="43" cy="62" r="7" fill="${WHT}" stroke-width="1.3"/>`
    + `<circle cx="40" cy="61" r="1.7" fill="${IK}" stroke="none"/><circle cx="46" cy="61" r="1.7" fill="${IK}" stroke="none"/>`
    + `<line x1="26" y1="40" x2="26" y2="80" stroke-width="1.6"/><path d="M26 40 L52 44 L52 58 L26 54 Z" fill="${DRK}" stroke-width="1.3"/>`
    + `<circle cx="39" cy="49" r="4.4" fill="${WHT}" stroke-width="1.1"/>`,
14: scene(SKY_Y,GR_GRN)
    + `<path d="M14 124 Q30 116 46 124 Z" fill="${BLU}" stroke-width="1.2"/>`
    + `<path d="M20 60 Q34 54 42 72 Q30 68 20 60 Z" fill="${WHT}" stroke-width="1.3"/>`
    + `<path d="M80 60 Q66 54 58 72 Q70 68 80 60 Z" fill="${WHT}" stroke-width="1.3"/>`
    + `<path d="M38 124 L42 74 L58 74 L62 124 Z" fill="${WHT}" stroke-width="1.4"/>`
    + `<circle cx="50" cy="66" r="7.2" fill="${SKIN}" stroke-width="1.3"/>`
    + `<polygon points="${starPts(50,86,5,2.2,3,-90)}" fill="${GOLD}" stroke-width="1"/>`
    + `<path d="M28 90 L38 90 L36 100 L30 100 Z" fill="${GOLD}" stroke-width="1.2"/>`
    + `<path d="M62 100 L72 100 L70 110 L64 110 Z" fill="${GOLD}" stroke-width="1.2"/>`
    + `<path d="M35 90 Q50 84 65 100" fill="none" stroke="${BLU}" stroke-width="1.8"/>`,
15: scene(SKY_N,GR_DRK)
    + `<rect x="34" y="98" width="32" height="26" fill="#4A3B2C" stroke-width="1.3"/>`
    + `<path d="M38 98 L42 68 L58 68 L62 98 Z" fill="#7A4A2E" stroke-width="1.4"/>`
    + `<circle cx="50" cy="58" r="9" fill="#7A4A2E" stroke-width="1.3"/>`
    + `<path d="M41 54 L36 40 L46 50 Z" fill="#7A4A2E" stroke-width="1.2"/><path d="M59 54 L64 40 L54 50 Z" fill="#7A4A2E" stroke-width="1.2"/>`
    + `<circle cx="46" cy="58" r="1.7" fill="${GOLD}" stroke="none"/><circle cx="54" cy="58" r="1.7" fill="${GOLD}" stroke="none"/>`
    + `<polygon points="${starPts(50,42,5,2.1,5,90)}" fill="${GOLD}" stroke-width="0.8"/>`
    + `<path d="M16 128 L18 104 L28 104 L30 128 Z" fill="${SKIN}" stroke-width="1.3"/><circle cx="23" cy="98" r="5" fill="${SKIN}" stroke-width="1.2"/>`
    + `<path d="M70 128 L72 104 L82 104 L84 128 Z" fill="${SKIN}" stroke-width="1.3"/><circle cx="77" cy="98" r="5" fill="${SKIN}" stroke-width="1.2"/>`
    + `<path d="M23 104 Q50 118 77 104" fill="none" stroke-width="1.4" stroke-dasharray="2.4 2"/>`,
16: scene(SKY_N,GR_DRK)
    + `<rect x="36" y="46" width="28" height="78" fill="${STONE}" stroke-width="1.4"/>`
    + `<path d="M34 46 L66 46 L62 36 L38 36 Z" fill="#8E7F63" stroke-width="1.3"/>`
    + `<path d="M38 30 L62 30 L58 22 L42 22 Z" fill="${GOLD}" stroke-width="1.3"/>`
    + `<path d="M78 14 L58 40 L68 40 L52 62 L64 40 L54 40 Z" fill="${GOLD}" stroke-width="1.2"/>`
    + `<path d="M40 56 q5 -10 10 0 q-5 6 -10 0 Z" fill="${RED}" stroke-width="1.1"/>`
    + `<path d="M52 74 q5 -10 10 0 q-5 6 -10 0 Z" fill="${RED}" stroke-width="1.1"/>`
    + `<path d="M12 96 L22 96 L26 116 L14 118 Z" fill="${BLU}" stroke-width="1.3"/><circle cx="14" cy="90" r="5" fill="${SKIN}" stroke-width="1.2"/>`
    + `<path d="M78 106 L88 106 L86 126 L74 124 Z" fill="${RED}" stroke-width="1.3"/><circle cx="87" cy="100" r="5" fill="${SKIN}" stroke-width="1.2"/>`,
17: scene(SKY_N,GR_GRN)
    + star(50,32,10,8,GOLD,1.1)
    + `<g>${[[22,26],[34,18],[66,18],[78,26],[26,48],[74,48],[50,54]].map(p=>star(p[0],p[1],3.6,8,GOLD,0.7)).join('')}</g>`
    + `<path d="M5 118 Q28 110 52 118 L52 124 L5 124 Z" fill="${BLU}" stroke-width="1.2"/>`
    + `<path d="M40 124 L44 92 L58 92 L64 124 Z" fill="${SKIN}" stroke-width="1.3"/>`
    + `<circle cx="51" cy="84" r="6.6" fill="${SKIN}" stroke-width="1.2"/>`
    + `<path d="M28 92 L38 92 L36 102 L30 102 Z" fill="${GOLD}" stroke-width="1.2"/><path d="M31 102 Q26 112 22 118" fill="none" stroke="${BLU}" stroke-width="1.6"/>`
    + `<path d="M64 96 L74 96 L72 106 L66 106 Z" fill="${GOLD}" stroke-width="1.2"/><path d="M70 106 Q74 116 78 124" fill="none" stroke="${BLU}" stroke-width="1.6"/>`,
18: scene(SKY_N,GR_DRK)
    + `<circle cx="50" cy="40" r="15" fill="${GOLD}" stroke-width="1.4"/>`
    + `<path d="M50 25 A15 15 0 0 0 50 55 A11 11 0 0 1 50 25 Z" fill="#D8A93A" stroke-width="1"/>`
    + `<circle cx="46" cy="38" r="1.6" fill="${IK}" stroke="none"/><path d="M43 45 q5 4 9 -1" fill="none" stroke-width="1.1"/>`
    + `<g fill="${GOLD}" stroke-width="0.7">${[[30,64],[38,72],[62,72],[70,64],[50,68]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="2" />`).join('')}</g>`
    + tower(14,72,12,52,STONE) + tower(74,72,12,52,STONE)
    + `<path d="M30 124 L30 112 Q36 104 42 112 L44 124 Z" fill="${WHT}" stroke-width="1.3"/><path d="M30 112 L27 104 L33 108 Z" fill="${WHT}" stroke-width="1"/>`
    + `<path d="M58 124 L58 112 Q64 104 70 112 L72 124 Z" fill="#6E6552" stroke-width="1.3"/><path d="M58 112 L55 104 L61 108 Z" fill="#6E6552" stroke-width="1"/>`
    + `<path d="M44 132 q6 -8 12 0 Z" fill="${RED}" stroke-width="1.1"/>`,
19: scene('#F5D97A',GR_GRN)
    + sun(50,52,20,GOLD,20,9)
    + `<circle cx="44" cy="49" r="1.8" fill="${IK}" stroke="none"/><circle cx="56" cy="49" r="1.8" fill="${IK}" stroke="none"/><path d="M43 58 q7 6 14 0" fill="none" stroke-width="1.3"/>`
    + `<rect x="10" y="104" width="80" height="20" fill="${STONE}" stroke-width="1.3"/>`
    + `<g>${[20,36,64,80].map(x=>sun(x,98,4.4,GOLD,8,3.4)).join('')}</g>`
    + `<path d="M40 124 L44 96 L56 96 L60 124 Z" fill="${SKIN}" stroke-width="1.3"/>`
    + `<circle cx="50" cy="89" r="6.4" fill="${SKIN}" stroke-width="1.2"/>`
    + `<path d="M56 100 L74 96 L74 106 Z" fill="${RED}" stroke-width="1.2"/>`,
20: scene('#A8B6C4','#7C8894')
    + `<path d="M22 46 Q50 32 78 46 Q50 42 22 46 Z" fill="${WHT}" stroke-width="1.3"/>`
    + `<circle cx="50" cy="40" r="6.4" fill="${SKIN}" stroke-width="1.2"/>`
    + `<path d="M56 48 L84 40 L84 54 Z" fill="${GOLD}" stroke-width="1.3"/>`
    + `<rect x="60" y="52" width="14" height="10" fill="${WHT}" stroke-width="1.1"/><path d="M64 54 L64 60 M70 54 L70 60" stroke="${RED}" stroke-width="1.3"/>`
    + `<g fill="${STL}" stroke-width="1.2"><rect x="14" y="112" width="22" height="14"/><rect x="40" y="116" width="22" height="12"/><rect x="66" y="112" width="22" height="14"/></g>`
    + `<circle cx="25" cy="104" r="5" fill="${SKIN}" stroke-width="1.2"/><path d="M19 100 L25 90 M31 100 L25 90" stroke-width="1.6"/>`
    + `<circle cx="51" cy="108" r="5" fill="${SKIN}" stroke-width="1.2"/><path d="M45 104 L51 94 M57 104 L51 94" stroke-width="1.6"/>`
    + `<circle cx="77" cy="104" r="5" fill="${SKIN}" stroke-width="1.2"/><path d="M71 100 L77 90 M83 100 L77 90" stroke-width="1.6"/>`,
21: scene(SKY_G,GR_GRN)
    + `<ellipse cx="50" cy="80" rx="30" ry="42" fill="none" stroke="${GRN}" stroke-width="5.5"/>`
    + `<ellipse cx="50" cy="80" rx="32.8" ry="44.8" fill="none" stroke-width="0.9"/>`
    + `<ellipse cx="50" cy="80" rx="27.2" ry="39.2" fill="none" stroke-width="0.9"/>`
    + `<path d="M38 38 L62 38 L58 30 L42 30 Z" fill="${RED}" stroke-width="1.2"/>`
    + `<path d="M42 118 L46 88 L56 88 L62 118 Z" fill="${SKIN}" stroke-width="1.3"/>`
    + `<circle cx="50" cy="80" r="6.4" fill="${SKIN}" stroke-width="1.2"/>`
    + `<path d="M46 88 Q34 92 30 74" fill="none" stroke="${VIO}" stroke-width="2"/><path d="M56 88 Q66 92 70 74" fill="none" stroke="${VIO}" stroke-width="2"/>`
    + `<g fill="${GOLD}" stroke-width="1.1"><circle cx="14" cy="24" r="6"/><circle cx="86" cy="24" r="6"/><circle cx="14" cy="130" r="6"/><circle cx="86" cy="130" r="6"/></g>`
};

const SUIT_KEYS = ['wands', 'cups', 'swords', 'pentacles'];
const ART_CACHE = {};
SUIT_KEYS.forEach((s) => {
  for (let i = 1; i <= 10; i++) ART_CACHE[s + '-' + i] = pipArt(s, i);
  ['Page', 'Knight', 'Queen', 'King'].forEach((c, i) => { ART_CACHE[s + '-c' + i] = courtArt(c, s); });
});
