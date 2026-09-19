/* ---- the wardrobe ----
   Before this file a companion wore one thing at a time: a hat took off the
   jumper, nine items shared a single slot, and people said dressing up was
   boring. They were right, and the reason was structural rather than a want of
   items. So the one slot became seven, worn together.

   Two decisions are worth knowing before reading the drawings.

   There is no footwear. Shoes need feet, and eleven of the eighteen companions
   draw none - the birds, the shelled ones, the phoenix. A shoe would have been
   a slot hidden for most of the household. In its place the lower slot is the
   hem: the bottom border of the drawing, a band or a bow or trailing silk,
   which sits on the body and so belongs to every one of them.

   And every item is drawn once, in the companion's own 120x120 space. The
   shelf tile is the same drawing seen through a smaller window - each slot
   carries the crop that frames it. One drawing, two places, and a tile that
   cannot lie about what you are going to get. */

/* Slot order is draw order: first in this list is furthest back. `crop` is the
   window the shelf tile looks through, in the same coordinates as the art. */
const PET_SLOTS = [
  { id: 'back', ic: '🪽', crop: '8 46 104 74', behind: true },
  { id: 'bottom', ic: '👖', crop: '22 82 76 42' },
  { id: 'top', ic: '👕', crop: '22 60 76 56' },
  { id: 'hem', ic: '🎗️', crop: '18 94 84 30' },
  { id: 'neck', ic: '🎀', crop: '28 62 64 36' },
  { id: 'face', ic: '🕶️', crop: '30 38 60 32' },
  { id: 'head', ic: '👑', crop: '24 -6 72 54' }
];
const PET_SLOT_IDS = PET_SLOTS.map((s) => s.id);
/* PET_SLOTS is draw order, which runs back to front and starts at the wings.
   Nobody dresses that way round: the rail shows the body top down instead. */
const PET_SLOT_RAIL = ['head', 'face', 'neck', 'top', 'bottom', 'hem', 'back']
  .map((id) => PET_SLOTS.filter((s) => s.id === id)[0]);
const petSlot = (id) => PET_SLOTS.filter((s) => s.id === id)[0] || PET_SLOTS[0];

/* Collections exist so a slot reads as a few named wardrobes rather than one
   long list. The accent colour rides the ribbon above each group. */
const PET_COLS = [
  { id: 'cosy', accent: '#E1607F', soft: '#FDEBF0' },
  { id: 'lunar', accent: '#C6485C', soft: '#FDEAEC' },
  { id: 'scholar', accent: '#4A6FA8', soft: '#E9F0FA' },
  { id: 'garden', accent: '#7FBF95', soft: '#EBF7EF' },
  { id: 'snow', accent: '#6E9AC4', soft: '#EAF2FA' },
  { id: 'market', accent: '#B45FA8', soft: '#F8EBF6' },
  { id: 'celestial', accent: '#5E4F9E', soft: '#EFEBFB' },
  { id: 'imperial', accent: '#B9913B', soft: '#FBF3E2' },
  { id: 'guardian', accent: '#8A6B22', soft: '#F8F1DF' }
];
const petCol = (id) => PET_COLS.filter((c) => c.id === id)[0] || PET_COLS[0];

/* ---- what there is to wear ----
   Sixty-nine pieces. Two are free so that nobody meets an empty wardrobe;
   forty-four come with Plus, which until now gave a subscriber nothing here at
   all; twenty-three belong to the three legendary collections and to Pro.

   `add` is what the piece is worth at a meal, and it is deliberately equal
   across every paid piece: nothing here should be worn because it pays better
   than the thing you actually liked. */
const PET_WARDROBE = [
  /* head - fifteen, and no two share a silhouette: a round knit dome, a floppy
     cone, a cone of straw, open petals, a flat board, a low circlet, a small
     side clip, a band with side pads, a fur cap with ear flaps, a brim thrown
     sideways, a spiked tiara, a ring touching nothing, tall plumes, a hanging
     bead curtain, and a closed helm. */
  { id: 'bobble', slot: 'head', col: 'cosy', tier: 'plus', add: 4, name: { vi: 'Mũ chóp bông', en: 'Bobble hat', de: 'Bommelmütze' } },
  { id: 'sleepcap', slot: 'head', col: 'cosy', tier: 'plus', add: 4, name: { vi: 'Mũ ngủ', en: 'Night cap', de: 'Schlafmütze' } },
  { id: 'hat', slot: 'head', col: 'lunar', tier: 'plus', add: 4, name: { vi: 'Nón lá', en: 'Conical hat', de: 'Kegelhut' } },
  { id: 'lotuscrown', slot: 'head', col: 'lunar', tier: 'plus', add: 4, name: { vi: 'Mũ sen', en: 'Lotus headpiece', de: 'Lotus-Kopfschmuck' } },
  { id: 'scholarcap', slot: 'head', col: 'scholar', tier: 'plus', add: 4, name: { vi: 'Mũ nho sinh', en: "Scholar's cap", de: 'Gelehrtenkappe' } },
  { id: 'crown', slot: 'head', col: 'garden', tier: 'plus', add: 4, name: { vi: 'Vòng hoa', en: 'Flower crown', de: 'Blumenkranz' } },
  { id: 'daisyclip', slot: 'head', col: 'garden', tier: 'plus', add: 4, name: { vi: 'Kẹp cúc trắng', en: 'Daisy clip', de: 'Gänseblümchen-Spange' } },
  { id: 'earmuffs', slot: 'head', col: 'snow', tier: 'plus', add: 4, name: { vi: 'Bịt tai', en: 'Earmuffs', de: 'Ohrenwärmer' } },
  { id: 'ushanka', slot: 'head', col: 'snow', tier: 'plus', add: 4, name: { vi: 'Mũ lông tai bèo', en: 'Fur trapper hat', de: 'Fellmütze' } },
  { id: 'cap', slot: 'head', col: 'market', tier: 'plus', add: 4, name: { vi: 'Mũ lưỡi trai', en: 'Backwards cap', de: 'Cap verkehrt herum' } },
  { id: 'mooncrown', slot: 'head', col: 'celestial', tier: 'pro', add: 4, name: { vi: 'Vương miện trăng', en: 'Moon crown', de: 'Mondkrone' } },
  { id: 'halo', slot: 'head', col: 'celestial', tier: 'pro', add: 4, name: { vi: 'Vòng sáng', en: 'Halo', de: 'Lichtkranz' } },
  { id: 'phoenixcrown', slot: 'head', col: 'imperial', tier: 'pro', add: 4, name: { vi: 'Mũ phượng', en: 'Phoenix headdress', de: 'Phönix-Kopfschmuck' } },
  { id: 'emperorcrown', slot: 'head', col: 'imperial', tier: 'pro', add: 4, name: { vi: 'Miện vua', en: "Emperor's crown", de: 'Kaiserkrone' } },
  { id: 'warhelm', slot: 'head', col: 'guardian', tier: 'pro', add: 4, name: { vi: 'Mũ trụ', en: 'War helm', de: 'Kriegshelm' } },
  /* face - twelve. Two lenses, one lens, a full mask, a single wide visor, a
     heart pair, a domino, a slatted plate, painted opera halves, a patch over
     one eye, a curtain of beads, petals across a cheek, two painted stripes. */
  { id: 'glasses', slot: 'face', col: 'scholar', tier: 'plus', add: 4, name: { vi: 'Kính tròn', en: 'Round glasses', de: 'Runde Brille' } },
  { id: 'monocle', slot: 'face', col: 'scholar', tier: 'plus', add: 4, name: { vi: 'Kính một mắt', en: 'Monocle', de: 'Monokel' } },
  { id: 'foxmask', slot: 'face', col: 'lunar', tier: 'plus', add: 4, name: { vi: 'Mặt nạ cáo', en: 'Fox mask', de: 'Fuchsmaske' } },
  { id: 'operamask', slot: 'face', col: 'lunar', tier: 'plus', add: 4, name: { vi: 'Mặt nạ tuồng', en: 'Opera face', de: 'Opernmaske' } },
  { id: 'goggles', slot: 'face', col: 'snow', tier: 'plus', add: 4, name: { vi: 'Kính tuyết', en: 'Snow goggles', de: 'Schneebrille' } },
  { id: 'shades', slot: 'face', col: 'market', tier: 'plus', add: 4, name: { vi: 'Kính trái tim', en: 'Heart sunglasses', de: 'Herz-Sonnenbrille' } },
  { id: 'eyepatch', slot: 'face', col: 'market', tier: 'plus', add: 4, name: { vi: 'Miếng che mắt', en: 'Eye patch', de: 'Augenklappe' } },
  { id: 'blossomface', slot: 'face', col: 'garden', tier: 'plus', add: 4, name: { vi: 'Hoa bên mắt', en: 'Blossom at the eye', de: 'Blüte am Auge' } },
  { id: 'starmask', slot: 'face', col: 'celestial', tier: 'pro', add: 4, name: { vi: 'Mặt nạ chòm sao', en: 'Constellation mask', de: 'Sternbildmaske' } },
  { id: 'veil', slot: 'face', col: 'imperial', tier: 'pro', add: 4, name: { vi: 'Mành châu', en: 'Beaded veil', de: 'Perlenschleier' } },
  { id: 'visor', slot: 'face', col: 'guardian', tier: 'pro', add: 4, name: { vi: 'Che mặt giáp', en: 'Guardian visor', de: 'Wächtervisier' } },
  { id: 'warpaint', slot: 'face', col: 'guardian', tier: 'pro', add: 4, name: { vi: 'Vệt sơn trận', en: 'War paint', de: 'Kriegsbemalung' } },
  /* neck - thirteen. The three scarves are deliberately different garments: a
     thin silk one with a single tail thrown to the side, a chunky knit with two
     fringed ends down the front, and a closed tube that has no ends at all. */
  { id: 'woolscarf', slot: 'neck', col: 'cosy', tier: 'plus', add: 4, name: { vi: 'Khăn len tua', en: 'Fringed wool scarf', de: 'Fransen-Wollschal' } },
  { id: 'scarf', slot: 'neck', col: 'lunar', tier: 'plus', add: 4, name: { vi: 'Khăn lụa', en: 'Silk scarf', de: 'Seidenschal' } },
  { id: 'bell', slot: 'neck', col: 'lunar', tier: 'plus', add: 4, name: { vi: 'Chuông vàng', en: 'Gold bell', de: 'Goldglöckchen' } },
  { id: 'jade', slot: 'neck', col: 'lunar', tier: 'plus', add: 4, name: { vi: 'Ngọc bội', en: 'Jade pendant', de: 'Jade-Anhänger' } },
  { id: 'brushpend', slot: 'neck', col: 'scholar', tier: 'plus', add: 4, name: { vi: 'Bút treo cổ', en: 'Brush pendant', de: 'Pinsel-Anhänger' } },
  { id: 'bowtie', slot: 'neck', col: 'scholar', tier: 'plus', add: 4, name: { vi: 'Nơ cổ', en: 'Bow tie', de: 'Fliege' } },
  { id: 'vinechoker', slot: 'neck', col: 'garden', tier: 'plus', add: 4, name: { vi: 'Vòng cổ dây leo', en: 'Vine choker', de: 'Ranken-Halsband' } },
  { id: 'muffler', slot: 'neck', col: 'snow', tier: 'plus', add: 4, name: { vi: 'Khăn ống', en: 'Closed snood', de: 'Loopschal' } },
  { id: 'boba', slot: 'neck', col: 'market', tier: 'plus', add: 4, name: { vi: 'Móc trà sữa', en: 'Bubble-tea charm', de: 'Bubble-Tea-Anhänger' } },
  { id: 'comet', slot: 'neck', col: 'celestial', tier: 'pro', add: 4, name: { vi: 'Ngọc sao băng', en: 'Comet pendant', de: 'Kometen-Anhänger' } },
  { id: 'pearls', slot: 'neck', col: 'imperial', tier: 'pro', add: 4, name: { vi: 'Chuỗi ngọc trai', en: 'Pearl strand', de: 'Perlenkette' } },
  { id: 'jadecollar', slot: 'neck', col: 'imperial', tier: 'pro', add: 4, name: { vi: 'Vòng cổ ngọc', en: 'Jade collar', de: 'Jadekragen' } },
  { id: 'gorget', slot: 'neck', col: 'guardian', tier: 'pro', add: 4, name: { vi: 'Hộ cổ', en: 'Gorget', de: 'Halsberge' } },
  /* top - twelve. The jumper is closed and ribbed; the cardigan hangs open with
     buttons down a visible placket; the waistcoat has lapels and bare shoulders;
     the sailor top is all collar. They are not one shape in four colours. */
  { id: 'jumper', slot: 'top', col: 'cosy', tier: 'free', add: 0, name: { vi: 'Áo len', en: 'Knitted jumper', de: 'Strickpullover' } },
  { id: 'cardigan', slot: 'top', col: 'cosy', tier: 'plus', add: 4, name: { vi: 'Áo cardigan', en: 'Cardigan', de: 'Strickjacke' } },
  { id: 'aodai', slot: 'top', col: 'lunar', tier: 'plus', add: 4, name: { vi: 'Áo dài lụa', en: 'Silk áo dài', de: 'Seidenes Áo Dài' } },
  { id: 'inkrobe', slot: 'top', col: 'scholar', tier: 'plus', add: 4, name: { vi: 'Áo mực', en: 'Ink-blue robe', de: 'Tintenblaue Robe' } },
  { id: 'vest', slot: 'top', col: 'scholar', tier: 'plus', add: 4, name: { vi: 'Áo gi-lê', en: 'Waistcoat', de: 'Weste' } },
  { id: 'petalblouse', slot: 'top', col: 'garden', tier: 'plus', add: 4, name: { vi: 'Áo cánh hoa', en: 'Petal blouse', de: 'Blütenbluse' } },
  { id: 'puffer', slot: 'top', col: 'snow', tier: 'plus', add: 4, name: { vi: 'Áo phao', en: 'Puffer coat', de: 'Daunenjacke' } },
  { id: 'hoodie', slot: 'top', col: 'market', tier: 'plus', add: 4, name: { vi: 'Áo hoodie', en: 'Hoodie', de: 'Hoodie' } },
  { id: 'sailor', slot: 'top', col: 'market', tier: 'plus', add: 4, name: { vi: 'Áo cổ thuỷ thủ', en: 'Sailor collar', de: 'Matrosenkragen' } },
  { id: 'starrobe', slot: 'top', col: 'celestial', tier: 'pro', add: 4, name: { vi: 'Áo ánh sao', en: 'Starlight robe', de: 'Sternenlichtrobe' } },
  { id: 'dragonrobe', slot: 'top', col: 'imperial', tier: 'pro', add: 4, name: { vi: 'Long bào', en: 'Dragon robe', de: 'Drachenrobe' } },
  { id: 'armour', slot: 'top', col: 'guardian', tier: 'pro', add: 4, name: { vi: 'Giáp vàng', en: 'Gold armour', de: 'Goldene Rüstung' } },
  /* bottom - twelve, and the three plain bands that used to be here are gone.
     A skirt, a wrap, a sash: never a trouser leg and never an ankle, because
     eleven of the eighteen companions draw no legs to put one on. */
  { id: 'woolwrap', slot: 'bottom', col: 'cosy', tier: 'plus', add: 4, name: { vi: 'Quây len cuộn', en: 'Cabled wool wrap', de: 'Zopfmuster-Wickel' } },
  { id: 'apron', slot: 'bottom', col: 'cosy', tier: 'plus', add: 4, name: { vi: 'Tạp dề', en: 'Pinafore', de: 'Schürze' } },
  { id: 'silkwrap', slot: 'bottom', col: 'lunar', tier: 'plus', add: 4, name: { vi: 'Quây lụa lệch', en: 'Asymmetric silk wrap', de: 'Asymmetrischer Seidenwickel' } },
  { id: 'hakama', slot: 'bottom', col: 'scholar', tier: 'plus', add: 4, name: { vi: 'Quần chùng', en: 'Hakama', de: 'Hakama' } },
  { id: 'petalskirt', slot: 'bottom', col: 'garden', tier: 'plus', add: 4, name: { vi: 'Váy cánh hoa', en: 'Petal skirt', de: 'Blütenrock' } },
  { id: 'leafskirt', slot: 'bottom', col: 'garden', tier: 'plus', add: 4, name: { vi: 'Váy lá', en: 'Leaf skirt', de: 'Blattrock' } },
  { id: 'snowpuff', slot: 'bottom', col: 'snow', tier: 'plus', add: 4, name: { vi: 'Váy phao', en: 'Quilted snow skirt', de: 'Stepprock' } },
  { id: 'denimskirt', slot: 'bottom', col: 'market', tier: 'plus', add: 4, name: { vi: 'Váy jean', en: 'Denim skirt', de: 'Jeansrock' } },
  { id: 'pleated', slot: 'bottom', col: 'market', tier: 'plus', add: 4, name: { vi: 'Váy xếp ly', en: 'Pleated skirt', de: 'Faltenrock' } },
  { id: 'nebula', slot: 'bottom', col: 'celestial', tier: 'pro', add: 4, name: { vi: 'Váy tinh vân', en: 'Nebula skirt', de: 'Nebelrock' } },
  { id: 'courtskirt', slot: 'bottom', col: 'imperial', tier: 'pro', add: 4, name: { vi: 'Váy triều phục', en: 'Court skirt', de: 'Hofrock' } },
  { id: 'faulds', slot: 'bottom', col: 'guardian', tier: 'pro', add: 4, name: { vi: 'Giáp hông', en: 'Armoured faulds', de: 'Beintaschen' } },
  /* hem - twelve, and each one gives the bottom edge a different shape: round
     bobbles, hanging strands, a zigzag, swinging bells, a soft wash with no
     edge at all, a wandering vine, crystal spikes, a glowing line, scattered
     dust, pointed feathers, a medallion band, and a mesh of rings. */
  { id: 'pompom', slot: 'hem', col: 'cosy', tier: 'free', add: 0, name: { vi: 'Viền bông', en: 'Pom-pom hem', de: 'Bommelsaum' } },
  { id: 'fringe', slot: 'hem', col: 'cosy', tier: 'plus', add: 4, name: { vi: 'Viền tua rua', en: 'Tassel fringe', de: 'Fransensaum' } },
  { id: 'goldthread', slot: 'hem', col: 'lunar', tier: 'plus', add: 4, name: { vi: 'Viền chỉ vàng', en: 'Gold-thread hem', de: 'Goldfadensaum' } },
  { id: 'bells', slot: 'hem', col: 'lunar', tier: 'plus', add: 4, name: { vi: 'Viền chuông nhỏ', en: 'Little bells', de: 'Glöckchensaum' } },
  { id: 'inkborder', slot: 'hem', col: 'scholar', tier: 'plus', add: 4, name: { vi: 'Viền thuỷ mặc', en: 'Ink-wash border', de: 'Tuschesaum' } },
  { id: 'vinehem', slot: 'hem', col: 'garden', tier: 'plus', add: 4, name: { vi: 'Viền hoa lá', en: 'Vine-and-petal hem', de: 'Ranken-und-Blüten-Saum' } },
  { id: 'frostlace', slot: 'hem', col: 'snow', tier: 'plus', add: 4, name: { vi: 'Viền băng', en: 'Frost-lace hem', de: 'Frostspitzensaum' } },
  { id: 'neonhem', slot: 'hem', col: 'market', tier: 'plus', add: 4, name: { vi: 'Viền neon', en: 'Neon hem', de: 'Neonsaum' } },
  { id: 'starhem', slot: 'hem', col: 'celestial', tier: 'pro', add: 4, name: { vi: 'Viền bụi sao', en: 'Stardust hem', de: 'Sternenstaubsaum' } },
  { id: 'feathertrim', slot: 'hem', col: 'celestial', tier: 'pro', add: 4, name: { vi: 'Viền lông vũ', en: 'Feather trim', de: 'Federsaum' } },
  { id: 'brocade', slot: 'hem', col: 'imperial', tier: 'pro', add: 4, name: { vi: 'Viền gấm', en: 'Brocade hem', de: 'Brokatsaum' } },
  { id: 'chainmail', slot: 'hem', col: 'guardian', tier: 'pro', add: 4, name: { vi: 'Viền giáp lưới', en: 'Chainmail hem', de: 'Kettensaum' } },
  /* back - thirteen. Four of these used to be the same cape in four colours.
     Now the blanket is draped and rounded, the star cloak hangs straight from a
     clasp, the imperial mantle has a fur collar and a train, and the war cape
     is torn along the bottom - and the rest are not capes at all. */
  { id: 'quiltcape', slot: 'back', col: 'cosy', tier: 'plus', add: 4, name: { vi: 'Chăn choàng', en: 'Draped quilt', de: 'Deckenumhang' } },
  { id: 'lantern', slot: 'back', col: 'lunar', tier: 'plus', add: 4, name: { vi: 'Đèn lồng', en: 'Paper lantern', de: 'Papierlaterne' } },
  { id: 'fan', slot: 'back', col: 'lunar', tier: 'plus', add: 4, name: { vi: 'Quạt tròn', en: 'Round fan', de: 'Rundfächer' } },
  { id: 'satchel', slot: 'back', col: 'scholar', tier: 'plus', add: 4, name: { vi: 'Túi sách', en: 'Satchel of scrolls', de: 'Schriftrollentasche' } },
  { id: 'kite', slot: 'back', col: 'scholar', tier: 'plus', add: 4, name: { vi: 'Cánh diều', en: 'Paper kite', de: 'Papierdrachen' } },
  { id: 'flutterwings', slot: 'back', col: 'garden', tier: 'plus', add: 4, name: { vi: 'Cánh bướm', en: 'Butterfly wings', de: 'Schmetterlingsflügel' } },
  { id: 'dragonflywings', slot: 'back', col: 'garden', tier: 'plus', add: 4, name: { vi: 'Cánh chuồn chuồn', en: 'Dragonfly wings', de: 'Libellenflügel' } },
  { id: 'parasol', slot: 'back', col: 'market', tier: 'plus', add: 4, name: { vi: 'Dù giấy', en: 'Paper parasol', de: 'Papierschirm' } },
  { id: 'cloak', slot: 'back', col: 'celestial', tier: 'pro', add: 4, name: { vi: 'Áo choàng sao', en: 'Star cloak', de: 'Sternenumhang' } },
  { id: 'wings', slot: 'back', col: 'celestial', tier: 'pro', add: 4, name: { vi: 'Đôi cánh thần', en: 'Feathered wings', de: 'Federflügel' } },
  { id: 'mantle', slot: 'back', col: 'imperial', tier: 'pro', add: 4, name: { vi: 'Hậu bào', en: 'Imperial mantle', de: 'Kaisermantel' } },
  { id: 'warcape', slot: 'back', col: 'guardian', tier: 'pro', add: 4, name: { vi: 'Chiến bào', en: 'War cape', de: 'Kriegsumhang' } },
  { id: 'banner', slot: 'back', col: 'guardian', tier: 'pro', add: 4, name: { vi: 'Cờ trận', en: 'War banner', de: 'Kriegsbanner' } }
];

/* Lookup built once. Sixty-nine linear scans per redraw is not a real cost, but
   the wardrobe screen asks for items far more often than that. */
const PET_WEAR_BY = {};
PET_WARDROBE.forEach((x) => { PET_WEAR_BY[x.id] = x; });
const wearOf = (id) => PET_WEAR_BY[id] || null;
const wearIn = (slot) => PET_WARDROBE.filter((x) => x.slot === slot);

/* ---- who may wear what ----
   Until now every paid pet item asked proOn(), so a Plus subscriber could see
   the wardrobe and own none of it. Three tiers instead, and Pro contains Plus,
   so the legendary collections stay the reason to go up. */
const tierOn = (tier) => tier === 'free' ? true : (tier === 'plus' ? plusOn() : proOn());
const wearOn = (x) => !!x && tierOn(x.tier);
/* A subscription that lapses must never leave a companion looking broken, so a
   piece that is no longer owned simply is not worn. */
const wearWorn = (id) => { const x = wearOf(id); return wearOn(x) ? x : null; };

/* ---- what a companion is wearing ----
   Seven slots on one object. Before this, one string called `wear`; the nine
   ids it could hold each belong somewhere, so they are carried across rather
   than dropped on the floor. */
const WEAR_WAS = { scarf: 'neck', bell: 'neck', crown: 'head', hat: 'head',
  jumper: 'top', armour: 'top', cloak: 'back', wings: 'back' };
const fitBlank = () => { const f = {}; PET_SLOT_IDS.forEach((s) => { f[s] = 'none'; }); return f; };

/* Runs the first time a companion is read and never again: the presence of
   `fit` is the flag. Old `wear` is left in place rather than deleted, so a
   half-written save cannot lose the piece. */
function fitMigrate(p) {
  if (!p || (p.fit && typeof p.fit === 'object')) return p;
  const f = fitBlank(), was = String(p.wear || 'none');
  const slot = WEAR_WAS[was];
  if (slot && wearOf(was)) f[slot] = was;
  p.fit = f;
  return p;
}

/* What to draw, slot by slot, with anything unowned left off. */
function fitOf(p) {
  const f = (p && p.fit) || fitBlank(), out = {};
  PET_SLOT_IDS.forEach((s) => {
    const x = wearWorn(f[s]);
    out[s] = x ? x.id : 'none';
  });
  return out;
}
const fitCount = (fit) => PET_SLOT_IDS.filter((s) => fit[s] && fit[s] !== 'none').length;
const fitEmpty = (fit) => fitCount(fit) === 0;

/* ---- what the outfit is worth at a meal ----
   One slot used to pay a flat four. Seven slots paying four each would pay
   twenty-eight, which would make the wardrobe the fastest way to level and
   turn dressing up into arithmetic. So: four for the first piece, two for each
   piece after it, and a ceiling. The bonus for a full look is the one place
   where wearing more is deliberately rewarded, because finishing an outfit is
   the thing worth coming back for. */
const FIT_FIRST = 4;
const FIT_MORE = 2;
const FIT_CAP = 14;
const FIT_FULL_AT = 5;
const FIT_FULL_BONUS = 6;
const SKY_ADD = 2;
const FX_ADD = 3;
function fitGain(fit) {
  const n = fitCount(fit);
  if (!n) return 0;
  const worn = Math.min(FIT_CAP, FIT_FIRST + (n - 1) * FIT_MORE);
  return worn + (n >= FIT_FULL_AT ? FIT_FULL_BONUS : 0);
}

/* ---- the drawings ----
   Each takes the anchors the companion's own art publishes, so a piece finds
   the face it is actually put on rather than the average of eighteen faces. A
   fox draws its own eyes higher than a cat does; the glasses follow.

   Coordinates are the companion's: the head sits at (60,56), the body at
   (60,88), and the drawing runs 0..120 both ways. */
const wStar = (x, y, r, col) => {
  const k = (r * 0.3).toFixed(1), o = r.toFixed ? r : r;
  return '<path d="M' + x + ' ' + (y - o) + ' L' + (x + Number(k)) + ' ' + (y - Number(k))
    + ' L' + (x + o) + ' ' + y + ' L' + (x + Number(k)) + ' ' + (y + Number(k))
    + ' L' + x + ' ' + (y + o) + ' L' + (x - Number(k)) + ' ' + (y + Number(k))
    + ' L' + (x - o) + ' ' + y + ' L' + (x - Number(k)) + ' ' + (y - Number(k)) + ' Z" fill="' + col + '"/>';
};
const wHeart = (x, y, s) => 'M' + x + ' ' + (y + s * 0.68) + ' C' + (x - s) + ' ' + (y - s * 0.2)
  + ' ' + (x - s * 0.55) + ' ' + (y - s) + ' ' + x + ' ' + (y - s * 0.34)
  + ' C' + (x + s * 0.55) + ' ' + (y - s) + ' ' + (x + s) + ' ' + (y - s * 0.2)
  + ' ' + x + ' ' + (y + s * 0.68) + ' Z';
/* A row of small arcs along a line: the scallop that makes a petal edge, a
   lace edge and a pom-pom row all read as the same family. */
const wScallop = (y, from, to, n, r, col) => {
  let out = '', step = (to - from) / n;
  for (let i = 0; i < n; i++) out += '<circle cx="' + (from + step * (i + 0.5)).toFixed(1) + '" cy="' + y + '" r="' + r + '" fill="' + col + '"/>';
  return out;
};
const wRibs = (d, col, w) => '<g stroke="' + col + '" stroke-width="' + (w || 1.5) + '" fill="none" opacity=".85"><path d="' + d + '"/></g>';
const wTassel = (x, y, col) => '<path d="M' + (x - 3) + ' ' + y + ' l3 8 3 -8 Z" fill="' + col + '"/>';

const WEAR_ART = {
  /* ---- head ---- */
  bobble: () => '<path d="M34 38 Q34 13 60 11 Q86 13 86 38 Z" fill="#E1607F"/>'
    + wRibs('M44 15 v23 M60 11 v27 M76 15 v23', '#F5A6BF', 1.8)
    + '<path d="M31 37 q29 9 58 0 q2 6 -1 9 q-28 8 -56 0 q-3 -3 -1 -9 Z" fill="#C94C6C"/>'
    + '<circle cx="60" cy="7" r="7" fill="#FFF7EE"/><circle cx="57.6" cy="5" r="2.4" fill="#FFFFFF" opacity=".7"/>',
  sleepcap: () => '<path d="M34 38 Q36 14 58 10 Q78 7 93 3 Q84 19 76 38 Z" fill="#C9B0EA"/>'
    + wRibs('M46 14 v23 M60 11 v26', '#DCCBF5', 1.6)
    + '<path d="M31 37 q26 8 50 0 q2 6 -1 9 q-24 7 -48 0 q-3 -3 -1 -9 Z" fill="#F1E9FF"/>'
    + '<circle cx="93" cy="7" r="5.6" fill="#FFF7EE"/>',
  hat: () => '<ellipse cx="60" cy="34" rx="30" ry="7" fill="#E8CFA0"/><path d="M38 34 L60 6 L82 34 Z" fill="#F0DFC8" stroke="#C6A98A" stroke-width="1.6"/>'
    + '<path d="M46 28 q14 -6 28 0" fill="none" stroke="#C6A98A" stroke-width="1.4"/>'
    + '<path d="M60 8 A9 9 0 1 0 60 26 A7 7 0 1 1 60 8 Z" fill="#E5BE5E"/>',
  lotuscrown: () => '<path d="M60 31 Q51 12 60 3 Q69 12 60 31 Z" fill="#FFF0F5"/>'
    + '<path d="M46 33 Q33 18 35 7 Q50 19 46 33 Z" fill="#FBC7DA"/><path d="M74 33 Q87 18 85 7 Q70 19 74 33 Z" fill="#FBC7DA"/>'
    + '<path d="M52 32 Q44 17 47 9 Q57 20 52 32 Z" fill="#F7A9C6"/><path d="M68 32 Q76 17 73 9 Q63 20 68 32 Z" fill="#F7A9C6"/>'
    + '<ellipse cx="60" cy="32" rx="19" ry="4.4" fill="#7FBF95"/><circle cx="60" cy="25" r="3.4" fill="#E5BE5E"/>',
  scholarcap: () => '<rect x="35" y="20" width="50" height="12" rx="3" fill="#2E3E60"/>'
    + '<path d="M36 31 q24 8 48 0 l-1 9 q-23 7 -46 0 Z" fill="#3A4E78"/>'
    + '<path d="M85 23 q11 -5 15 2 q-9 5 -15 2 Z" fill="#4A6FA8"/>'
    + '<path d="M35 23 q-11 -5 -15 2 q9 5 15 2 Z" fill="#4A6FA8"/>'
    + '<circle cx="60" cy="19" r="2.8" fill="#E5BE5E"/>',
  crown: () => {
    const bud = (x, y, col) => [0, 72, 144, 216, 288].map((ang) => '<ellipse cx="' + x + '" cy="' + (y - 3.4) + '" rx="2.2" ry="3.4" fill="' + col + '" transform="rotate(' + ang + ' ' + x + ' ' + y + ')"/>').join('') + '<circle cx="' + x + '" cy="' + y + '" r="1.6" fill="#FFE9A8"/>';
    return '<path d="M34 36 Q60 22 86 36" fill="none" stroke="#8FBF7F" stroke-width="2.4"/>'
      + bud(38, 35, '#F7A9C6') + bud(52, 28, '#FFF3C4') + bud(68, 28, '#F7A9C6') + bud(82, 35, '#C9B0EA');
  },
  daisyclip: () => '<path d="M34 38 q8 -6 16 -3" fill="none" stroke="#8FBF7F" stroke-width="2.2" stroke-linecap="round"/>'
    + [0, 60, 120, 180, 240, 300].map((ang) => '<ellipse cx="40" cy="28.4" rx="3" ry="5" fill="#FFFFFF" stroke="#E8E2D6" stroke-width="0.8" transform="rotate(' + ang + ' 40 33)"/>').join('')
    + '<circle cx="40" cy="33" r="3.2" fill="#E5BE5E"/>'
    + '<path d="M48 36 q7 -3 10 2 q-7 3 -10 -2 Z" fill="#7FBF95"/>',
  earmuffs: () => '<path d="M34 48 Q33 16 60 13 Q87 16 86 48" fill="none" stroke="#4A6FA8" stroke-width="5" stroke-linecap="round"/>'
    + '<ellipse cx="33" cy="52" rx="9.5" ry="11.5" fill="#EAF2FA" stroke="#9CBCE6" stroke-width="2.2"/>'
    + '<ellipse cx="87" cy="52" rx="9.5" ry="11.5" fill="#EAF2FA" stroke="#9CBCE6" stroke-width="2.2"/>'
    + '<ellipse cx="33" cy="52" rx="5" ry="6.5" fill="#FFFFFF" opacity=".6"/><ellipse cx="87" cy="52" rx="5" ry="6.5" fill="#FFFFFF" opacity=".6"/>',
  /* Was a second knit dome, which is what the bobble hat already is. A fur cap
     with flaps down over the ears is a different shape from across a room. */
  ushanka: () => '<path d="M36 34 Q36 14 60 12 Q84 14 84 34 Z" fill="#6E5A48"/>'
    + '<path d="M30 40 q-4 18 4 24 q10 2 12 -8 q-2 -12 -6 -18 Z" fill="#E8DCC8"/>'
    + '<path d="M90 40 q4 18 -4 24 q-10 2 -12 -8 q2 -12 6 -18 Z" fill="#E8DCC8"/>'
    + '<path d="M28 30 q32 -12 64 0 q3 8 -2 12 q-30 10 -60 0 q-5 -4 -2 -12 Z" fill="#F2E8D8"/>'
    + '<path d="M28 30 q32 -12 64 0 q1 3 1 5 q-33 -9 -66 0 q0 -2 1 -5 Z" fill="#FFFAF0"/>'
    + '<circle cx="60" cy="20" r="3.4" fill="#C6485C"/>',
  cap: () => '<path d="M37 34 Q39 13 60 12 Q83 13 85 34 Z" fill="#B45FA8"/>'
    + '<path d="M37 33 q-17 -1 -21 7 q11 5 21 1 Z" fill="#8F4585"/>'
    + '<rect x="35" y="31" width="52" height="6.5" rx="3.2" fill="#D68BCA"/>'
    + '<path d="M60 12 v20" stroke="#9B4E90" stroke-width="1.4"/><circle cx="60" cy="12" r="3.2" fill="#FFF3C4"/>',
  mooncrown: () => '<path d="M36 37 L45 21 L53 31 L60 15 L67 31 L75 21 L84 37 Z" fill="#C9B0EA"/>'
    + '<path d="M33 36 q27 8 54 0 q2 6 -1 9 q-26 7 -52 0 q-3 -3 -1 -9 Z" fill="#7C63B8"/>'
    + '<path d="M60 6 A8.5 8.5 0 1 0 60 23 A6.5 6.5 0 1 1 60 6 Z" fill="#FFF3C4"/>'
    + wStar(45, 20, 3, '#FFE9A8') + wStar(75, 20, 3, '#FFE9A8')
    + '<circle cx="60" cy="41" r="2.6" fill="#FFF3C4"/>',
  halo: () => '<ellipse cx="60" cy="16" rx="25" ry="7.4" fill="none" stroke="#E5BE5E" stroke-width="7" opacity=".35"/>'
    + '<ellipse cx="60" cy="16" rx="24" ry="6.8" fill="none" stroke="#E5BE5E" stroke-width="3.4"/>'
    + '<ellipse cx="60" cy="16" rx="24" ry="6.8" fill="none" stroke="#FFF3C4" stroke-width="1.6"/>'
    + wStar(37, 16, 2.6, '#FFF3C4') + wStar(83, 16, 2.6, '#FFF3C4'),
  phoenixcrown: () => '<path d="M60 31 Q53 11 60 1 Q67 11 60 31 Z" fill="#F2789F"/>'
    + '<path d="M47 33 Q36 15 39 5 Q52 18 47 33 Z" fill="#E5BE5E"/><path d="M73 33 Q84 15 81 5 Q68 18 73 33 Z" fill="#E5BE5E"/>'
    + '<path d="M53 32 Q45 18 48 10 Q58 20 53 32 Z" fill="#C6485C" opacity=".8"/><path d="M67 32 Q75 18 72 10 Q62 20 67 32 Z" fill="#C6485C" opacity=".8"/>'
    + '<path d="M34 35 q26 -11 52 0 q2 7 -2 10 q-24 7 -48 0 q-4 -3 -2 -10 Z" fill="#E5BE5E"/>'
    + '<circle cx="60" cy="38" r="4.2" fill="#C6485C"/><circle cx="60" cy="38" r="1.8" fill="#FFF3C4"/>'
    + '<path d="M39 46 v7 M81 46 v7" stroke="#E5BE5E" stroke-width="2"/><circle cx="39" cy="55" r="2.8" fill="#C6485C"/><circle cx="81" cy="55" r="2.8" fill="#C6485C"/>',
  emperorcrown: () => '<rect x="29" y="17" width="62" height="7" rx="3" fill="#2E2A46"/>'
    + '<rect x="29" y="17" width="62" height="2.6" rx="1.3" fill="#4A3E80"/>'
    + '<path d="M38 24 q22 9 44 0 l-2 12 q-20 7 -40 0 Z" fill="#E5BE5E"/>'
    + wRibs('M47 27 v11 M60 29 v11 M73 27 v11', '#B9913B', 1.4)
    + '<circle cx="60" cy="24" r="3" fill="#C6485C"/>'
    + '<path d="M32 24 v10 M88 24 v10" stroke="#E5BE5E" stroke-width="1.6"/>'
    + '<circle cx="32" cy="37" r="2.4" fill="#7FBF95"/><circle cx="88" cy="37" r="2.4" fill="#7FBF95"/>',
  warhelm: () => '<path d="M34 42 Q34 13 60 11 Q86 13 86 42 Z" fill="#EDD08A"/>'
    + '<path d="M60 11 Q86 13 86 42 L78 42 Q78 16 60 14 Z" fill="#D4B25F"/>'
    + '<path d="M31 40 q29 9 58 0 q2 6 -1 9 q-28 8 -56 0 q-3 -3 -1 -9 Z" fill="#D4B25F"/>'
    + '<rect x="56.5" y="40" width="7" height="17" rx="2.6" fill="#EDD08A" stroke="#B9913B" stroke-width="1.1"/>'
    + '<path d="M55 11 h10 l2 -7 -7 -4 -7 4 Z" fill="#8A6B22"/>'
    + '<path d="M60 0 q12 7 7 16 q-7 -7 -7 -16 Z" fill="#C6485C"/>',

  /* ---- face: everything hangs off eyeY, which the art may move ---- */
  glasses: (a) => {
    const y = a.eyeY;
    return '<g fill="#FFFFFF" opacity=".28"><circle cx="50" cy="' + y + '" r="7.6"/><circle cx="70" cy="' + y + '" r="7.6"/></g>'
      + '<g fill="none" stroke="#3A4E78" stroke-width="2.3"><circle cx="50" cy="' + y + '" r="8"/><circle cx="70" cy="' + y + '" r="8"/>'
      + '<path d="M58 ' + y + ' q2 -2 4 0"/><path d="M42 ' + (y - 2) + ' q-7 -2 -9 3"/><path d="M78 ' + (y - 2) + ' q7 -2 9 3"/></g>'
      + '<path d="M45 ' + (y - 4) + ' q4 -3 8 -1" stroke="#FFFFFF" stroke-width="1.6" fill="none" opacity=".75"/>';
  },
  monocle: (a) => {
    const y = a.eyeY;
    return '<circle cx="70" cy="' + y + '" r="8.4" fill="#FFFFFF" opacity=".3"/>'
      + '<circle cx="70" cy="' + y + '" r="8.4" fill="none" stroke="#B9913B" stroke-width="2.4"/>'
      + '<path d="M70 ' + (y + 9) + ' q3 10 -4 16" fill="none" stroke="#B9913B" stroke-width="1.4"/>'
      + '<path d="M65 ' + (y - 4) + ' q4 -3 8 -1" stroke="#FFFFFF" stroke-width="1.6" fill="none" opacity=".8"/>';
  },
  foxmask: (a) => {
    const y = a.eyeY;
    return '<path d="M40 ' + (y - 9) + ' q20 -7 40 0 q3 17 -20 21 q-23 -4 -20 -21 Z" fill="#FFF7EE" stroke="#C6485C" stroke-width="1.8"/>'
      + '<path d="M43 ' + (y - 9) + ' q-8 -20 0 -24 q11 7 13 22 Z" fill="#FFF7EE" stroke="#C6485C" stroke-width="1.4"/>'
      + '<path d="M77 ' + (y - 9) + ' q8 -20 0 -24 q-11 7 -13 22 Z" fill="#FFF7EE" stroke="#C6485C" stroke-width="1.4"/>'
      + '<g fill="#C6485C"><ellipse cx="50" cy="' + y + '" rx="4.2" ry="2.6"/><ellipse cx="70" cy="' + y + '" rx="4.2" ry="2.6"/></g>'
      + '<path d="M52 ' + (y + 8) + ' q8 4 16 0" stroke="#C6485C" stroke-width="1.6" fill="none"/>'
      + '<circle cx="60" cy="' + (y + 3) + '" r="2" fill="#2E2A46"/>';
  },
  goggles: (a) => {
    const y = a.eyeY;
    return '<path d="M30 ' + (y - 4) + ' q-7 5 0 9" stroke="#3A4E78" stroke-width="3.4" fill="none"/>'
      + '<path d="M90 ' + (y - 4) + ' q7 5 0 9" stroke="#3A4E78" stroke-width="3.4" fill="none"/>'
      + '<rect x="35" y="' + (y - 9) + '" width="50" height="18" rx="9" fill="#CFE4EE" stroke="#4A6FA8" stroke-width="2.4"/>'
      + '<rect x="40" y="' + (y - 5.5) + '" width="17" height="11" rx="5.5" fill="#8FB4D4" opacity=".85"/>'
      + '<rect x="63" y="' + (y - 5.5) + '" width="17" height="11" rx="5.5" fill="#8FB4D4" opacity=".85"/>'
      + '<path d="M43 ' + (y - 3) + ' q4 -2 7 0 M66 ' + (y - 3) + ' q4 -2 7 0" stroke="#FFFFFF" stroke-width="1.5" fill="none" opacity=".8"/>';
  },
  shades: (a) => {
    const y = a.eyeY;
    return '<g fill="#B45FA8"><path d="' + wHeart(50, y, 9) + '"/><path d="' + wHeart(70, y, 9) + '"/></g>'
      + '<path d="M58 ' + (y - 2) + ' q2 -2 4 0" stroke="#B45FA8" stroke-width="2.6" fill="none"/>'
      + '<path d="M41 ' + (y - 3) + ' q-8 -1 -9 4 M79 ' + (y - 3) + ' q8 -1 9 4" stroke="#B45FA8" stroke-width="2" fill="none"/>'
      + '<path d="M46 ' + (y - 3) + ' q3 -3 6 -1" stroke="#FFFFFF" stroke-width="1.6" fill="none" opacity=".7"/>';
  },
  starmask: (a) => {
    const y = a.eyeY;
    return '<path d="M37 ' + (y - 9) + ' q23 -6 46 0 q3 13 -9 15 q-15 2 -14 -5 q1 7 -14 5 q-12 -2 -9 -15 Z" fill="#4A3E80"/>'
      + '<path d="M37 ' + (y - 9) + ' q23 -6 46 0 q0 3 -1 5 q-22 -5 -44 0 q-1 -2 -1 -5 Z" fill="#5E4F9E"/>'
      + wStar(44, y - 2, 2.6, '#FFF3C4') + wStar(60, y - 5, 2, '#FFE9A8') + wStar(76, y - 2, 2.6, '#FFF3C4')
      + '<g stroke="#FFF3C4" stroke-width="0.8" opacity=".7"><path d="M44 ' + (y - 2) + ' L60 ' + (y - 5) + ' L76 ' + (y - 2) + '"/></g>';
  },
  visor: (a) => {
    const y = a.eyeY;
    return '<path d="M35 ' + (y - 8) + ' q25 -6 50 0 l0 13 q-25 7 -50 0 Z" fill="#D4B25F"/>'
      + '<path d="M35 ' + (y - 8) + ' q25 -6 50 0 q0 3 -1 4 q-24 -5 -48 0 q-1 -1 -1 -4 Z" fill="#FFF3C4"/>'
      + wRibs('M45 ' + (y - 4) + ' v10 M56 ' + (y - 5) + ' v11 M68 ' + (y - 5) + ' v11 M79 ' + (y - 4) + ' v10', '#8A6B22', 1.5)
      + '<circle cx="35" cy="' + (y - 1) + '" r="2.4" fill="#B9913B"/><circle cx="85" cy="' + (y - 1) + '" r="2.4" fill="#B9913B"/>';
  },
  /* Painted rather than worn: the face itself is the costume, split down the
     middle the way a tuong player's is. Nothing sits proud of the head. */
  operamask: (a) => {
    const y = a.eyeY;
    return '<path d="M38 ' + (y - 12) + ' q22 -6 44 0 q2 22 -22 28 q-24 -6 -22 -28 Z" fill="#FFF7EE" opacity=".92"/>'
      + '<path d="M38 ' + (y - 12) + ' q11 -3 22 -3 l0 31 q-20 -6 -22 -28 Z" fill="#C6485C"/>'
      + '<path d="M44 ' + (y - 6) + ' q8 -4 14 1 q-7 5 -14 -1 Z" fill="#2E2A46"/>'
      + '<path d="M62 ' + (y - 5) + ' q8 -5 15 1 q-8 5 -15 -1 Z" fill="#2E2A46"/>'
      + '<path d="M60 ' + (y - 15) + ' v34" stroke="#E5BE5E" stroke-width="1.6"/>'
      + '<path d="M50 ' + (y + 10) + ' q10 5 20 0" stroke="#8A2F3E" stroke-width="2" fill="none" stroke-linecap="round"/>';
  },
  eyepatch: (a) => {
    const y = a.eyeY;
    return '<path d="M34 ' + (y - 7) + ' q26 -5 52 2" stroke="#3A3348" stroke-width="2.6" fill="none"/>'
      + '<path d="M60 ' + (y - 8) + ' q12 -2 13 8 q1 10 -13 9 Z" fill="#2E2A46"/>'
      + '<path d="M64 ' + (y - 3) + ' q5 -1 5 4" stroke="#5E5670" stroke-width="1.4" fill="none"/>';
  },
  blossomface: (a) => {
    const y = a.eyeY;
    return [0, 60, 120, 180, 240, 300].map((ang) =>
      '<ellipse cx="44" cy="' + (y - 7.2) + '" rx="3.4" ry="5.2" fill="#FBC7DA" transform="rotate(' + ang + ' 44 ' + (y - 2) + ')"/>').join('')
      + '<circle cx="44" cy="' + (y - 2) + '" r="3" fill="#E5BE5E"/>'
      + '<path d="M50 ' + (y + 2) + ' q8 4 6 12 q-7 -2 -6 -12 Z" fill="#7FBF95"/>'
      + '<g fill="#F7A9C6" opacity=".9"><circle cx="70" cy="' + (y + 4) + '" r="2"/><circle cx="78" cy="' + (y - 2) + '" r="1.6"/><circle cx="74" cy="' + (y + 11) + '" r="1.4"/></g>';
  },
  /* A curtain of beads hanging off the crown, not a plate across the eyes. */
  veil: (a) => {
    const y = a.eyeY;
    const strand = (x, n) => '<path d="M' + x + ' ' + (y - 16) + ' v' + (n * 5 + 4) + '" stroke="#E5BE5E" stroke-width="1"/>'
      + new Array(n).fill(0).map((z, i) => '<circle cx="' + x + '" cy="' + (y - 12 + i * 5) + '" r="2" fill="#F7EAD0"/>').join('');
    return '<path d="M34 ' + (y - 17) + ' q26 -7 52 0" stroke="#E5BE5E" stroke-width="2.6" fill="none"/>'
      + strand(40, 4) + strand(50, 6) + strand(60, 7) + strand(70, 6) + strand(80, 4);
  },
  warpaint: (a) => {
    const y = a.eyeY;
    return '<g fill="#C6485C" opacity=".88">'
      + '<path d="M36 ' + (y - 4) + ' q8 -3 14 1 l-2 6 q-7 -4 -14 -1 Z"/>'
      + '<path d="M84 ' + (y - 4) + ' q-8 -3 -14 1 l2 6 q7 -4 14 -1 Z"/></g>'
      + '<g fill="#8A2F3E" opacity=".8">'
      + '<path d="M36 ' + (y + 5) + ' q8 -3 13 1 l-1 4 q-6 -3 -12 -1 Z"/>'
      + '<path d="M84 ' + (y + 5) + ' q-8 -3 -13 1 l1 4 q6 -3 12 -1 Z"/></g>'
      + '<path d="M60 ' + (y - 12) + ' l3 6 -3 6 -3 -6 Z" fill="#C6485C"/>';
  }
};

/* ---- neck ----
   The throat is where the luck charm already hangs, so these hang off the same
   charmY. A companion whose shell covers its throat wears that charm lower, and
   so does its scarf. */
Object.assign(WEAR_ART, {
  woolscarf: () => '<path d="M36 71 q24 13 48 0 q4 10 -2 16 q-22 10 -44 0 q-6 -6 -2 -16 Z" fill="#C94C6C"/>'
    + wRibs('M38 78 q22 7 44 0 M37 84 q23 7 46 0', '#F5A6BF', 2)
    + '<path d="M74 84 q11 9 7 21 q-9 2 -13 -5 Z" fill="#E1607F"/>'
    + '<g stroke="#F5A6BF" stroke-width="1.6"><path d="M70 104 v6 M75 105 v6 M80 104 v6"/></g>',
  scarf: () => '<path d="M38 72 q22 14 44 0 q2 8 -4 12 q-18 9 -36 0 q-6 -4 -4 -12 Z" fill="#E1607F"/>'
    + '<path d="M74 82 q10 8 6 20 q-8 2 -12 -4 Z" fill="#C94C6C"/>',
  bell: (a) => '<circle cx="60" cy="' + a.charmY + '" r="6.4" fill="#E5BE5E" stroke="#B9913B" stroke-width="1.4"/>'
    + '<path d="M55 ' + a.charmY + ' h10" stroke="#B9913B" stroke-width="1.4"/><circle cx="60" cy="' + (a.charmY + 4) + '" r="1.6" fill="#8A6B22"/>',
  jade: (a) => '<path d="M44 73 q16 9 32 0" fill="none" stroke="#8A6B22" stroke-width="1.8"/>'
    + '<circle cx="60" cy="' + (a.charmY + 1) + '" r="7.6" fill="#7FBF95" stroke="#5E9E76" stroke-width="1.6"/>'
    + '<circle cx="60" cy="' + (a.charmY + 1) + '" r="2.8" fill="#EBF7EF"/>'
    + wTassel(60, a.charmY + 9, '#C6485C'),
  brushpend: (a) => '<path d="M45 73 q15 9 30 0" fill="none" stroke="#3A4E78" stroke-width="1.6"/>'
    + '<rect x="57" y="' + (a.charmY - 5) + '" width="6" height="12" rx="2.4" fill="#8F4A38"/>'
    + '<path d="M57 ' + (a.charmY + 7) + ' q3 9 6 0 Z" fill="#2E3E60"/>'
    + '<rect x="56.4" y="' + (a.charmY - 6) + '" width="7.2" height="3" rx="1.5" fill="#E5BE5E"/>',
  vinechoker: () => '<path d="M40 73 q20 12 40 0" fill="none" stroke="#5E9E76" stroke-width="3.4" stroke-linecap="round"/>'
    + '<path d="M46 76 q-5 -5 -1 -8 q6 2 5 8 Z" fill="#7FBF95"/><path d="M74 76 q5 -5 1 -8 q-6 2 -5 8 Z" fill="#7FBF95"/>'
    + [0, 72, 144, 216, 288].map((ang) => '<ellipse cx="60" cy="76.6" rx="2" ry="3.2" fill="#F7A9C6" transform="rotate(' + ang + ' 60 80)"/>').join('')
    + '<circle cx="60" cy="80" r="1.6" fill="#FFE9A8"/>',
  muffler: () => '<path d="M38 71 q22 12 44 0 l0 22 q-22 10 -44 0 Z" fill="#AFCEDF"/>'
    + wRibs('M43 74 v21 M51 77 v21 M60 79 v21 M69 77 v21 M77 74 v21', '#8FB4D4', 2.2)
    + '<path d="M38 71 q22 12 44 0 q0 3 -1 4 q-21 11 -42 0 q-1 -1 -1 -4 Z" fill="#CFE4EE"/>',
  boba: (a) => {
    const y = a.charmY;
    return '<path d="M46 73 q14 9 28 0" fill="none" stroke="#B45FA8" stroke-width="1.6"/>'
      + '<path d="M54 ' + (y - 5) + ' h12 l-1.6 15 h-8.8 Z" fill="#F3D9C4" stroke="#C6A98A" stroke-width="1.1"/>'
      + '<path d="M54.6 ' + (y + 2) + ' h10.8 l-1 8 h-8.8 Z" fill="#8F6A52"/>'
      + '<g fill="#3A2A1E"><circle cx="57.4" cy="' + (y + 8) + '" r="1.5"/><circle cx="61" cy="' + (y + 9) + '" r="1.5"/><circle cx="64" cy="' + (y + 8) + '" r="1.5"/></g>'
      + '<rect x="53" y="' + (y - 7) + '" width="14" height="2.8" rx="1.4" fill="#B45FA8"/>'
      + '<path d="M64 ' + (y - 6) + ' l2 -2" stroke="#E1607F" stroke-width="2.2" stroke-linecap="round"/>';
  },
  comet: (a) => {
    const y = a.charmY;
    return '<path d="M44 73 q16 8 32 0" fill="none" stroke="#9E82D2" stroke-width="1.6"/>'
      + '<path d="M36 ' + (y + 10) + ' q16 -13 25 -8 q-9 12 -25 8 Z" fill="#9E82D2" opacity=".8"/>'
      + '<path d="M43 ' + (y + 13) + ' q13 -11 19 -8 q-7 10 -19 8 Z" fill="#C9B0EA" opacity=".85"/>'
      + '<circle cx="63" cy="' + (y + 1) + '" r="7" fill="#E5BE5E"/>'
      + '<circle cx="63" cy="' + (y + 1) + '" r="3.6" fill="#FFF3C4"/>'
      + wStar(78, y - 6, 3.4, '#E5BE5E') + wStar(48, y - 4, 2.6, '#C9B0EA');
  },
  jadecollar: () => '<path d="M35 69 q25 15 50 0 q3 11 -4 17 q-21 11 -42 0 q-7 -6 -4 -17 Z" fill="#7FBF95"/>'
    + '<path d="M35 69 q25 15 50 0 q1 4 0 6 q-25 14 -50 0 q-1 -2 0 -6 Z" fill="#96D3AB"/>'
    + '<path d="M38 84 q22 10 44 0" fill="none" stroke="#E5BE5E" stroke-width="2.4"/>'
    + '<g fill="#E5BE5E"><circle cx="48" cy="80" r="2.4"/><circle cx="60" cy="83" r="2.8"/><circle cx="72" cy="80" r="2.4"/></g>',
  gorget: () => '<path d="M40 70 q20 11 40 0 q3 9 -3 14 q-17 9 -34 0 q-6 -5 -3 -14 Z" fill="#EDD08A" stroke="#B9913B" stroke-width="1.4"/>'
    + '<path d="M40 70 q20 11 40 0 q0 3 -1 5 q-19 10 -38 0 q-1 -2 -1 -5 Z" fill="#FFF3C4"/>'
    + '<g fill="#B9913B"><circle cx="46" cy="80" r="1.6"/><circle cx="60" cy="83" r="1.6"/><circle cx="74" cy="80" r="1.6"/></g>',
  bowtie: (a) => '<path d="M42 73 q18 9 36 0" fill="none" stroke="#2E3E60" stroke-width="2.4"/>'
    + '<path d="M60 ' + (a.charmY - 2) + ' l-15 -7 v14 Z" fill="#4A6FA8"/>'
    + '<path d="M60 ' + (a.charmY - 2) + ' l15 -7 v14 Z" fill="#4A6FA8"/>'
    + '<path d="M60 ' + (a.charmY - 2) + ' l-15 -7 v4 l11 3 Z" fill="#6E8FBD"/>'
    + '<path d="M60 ' + (a.charmY - 2) + ' l15 -7 v4 l-11 3 Z" fill="#6E8FBD"/>'
    + '<rect x="56" y="' + (a.charmY - 7) + '" width="8" height="10" rx="3" fill="#2E3E60"/>',
  /* A single strand that follows the throat, not a slab across it: the jade
     collar is the wide one, and two wide collars would be one idea twice. */
  pearls: (a) => '<path d="M40 72 q20 13 40 0" fill="none" stroke="#E8DCC8" stroke-width="1"/>'
    + [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
      const t = i / 8, x = 40 + t * 40, y = 72 + Math.sin(t * Math.PI) * 13;
      return '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (2.8 + Math.sin(t * Math.PI) * 1.4).toFixed(1) + '" fill="#FFFAF0" stroke="#B9913B" stroke-width="1"/>';
    }).join('')
    + '<circle cx="60" cy="' + (a.charmY + 7) + '" r="3.6" fill="#7FBF95" stroke="#5E9E76" stroke-width="1"/>'
});

/* ---- top: chest and shoulders, from the body ellipse down ---- */
Object.assign(WEAR_ART, {
  jumper: () => '<path d="M31 84 Q29 74 42 72 Q60 76 78 72 Q91 74 89 84 Q91 98 86 106 L34 106 Q29 98 31 84 Z" fill="#E1607F"/>'
    + '<path d="M42 72 Q60 80 78 72 Q78 78 60 84 Q42 78 42 72 Z" fill="#C94C6C"/>'
    + wRibs('M38 88 q22 -6 44 0 M36 96 q24 -6 48 0 M38 104 q22 -5 44 0', '#F5A6BF', 1.6)
    + wRibs('M46 84 v22 M60 82 v26 M74 84 v22', '#C94C6C', 1.4)
    + '<path d="M32 104 h12 v6 h-12 Z M76 104 h12 v6 h-12 Z" fill="#C94C6C"/>',
  cardigan: () => '<path d="M36 84 Q34 74 45 72 Q60 78 75 72 Q86 74 84 84 Q87 102 81 116 L39 116 Q33 102 36 84 Z" fill="#C9B0EA"/>'
    + '<path d="M43 72 Q60 80 77 72 Q76 78 60 84 Q44 78 43 72 Z" fill="#9E82D2"/>'
    + '<path d="M55 83 q-3 15 -1 28 M65 83 q3 15 1 28" stroke="#7C63B8" stroke-width="2" fill="none"/>'
    + wRibs('M36 90 q10 -4 18 -4 M66 86 q8 0 18 4', '#DCCBF5', 1.6)
    + '<g fill="#FFF3C4"><circle cx="60" cy="86" r="1.8"/><circle cx="60" cy="96" r="1.8"/><circle cx="60" cy="106" r="1.8"/></g>'
    + '<path d="M39 116 h42" stroke="#9E82D2" stroke-width="2"/>',
  aodai: () => '<path d="M43 73 Q60 79 77 73 Q80 94 78 118 L60 114 L42 118 Q40 94 43 73 Z" fill="#FBC7DA"/>'
    + '<path d="M41 73 Q60 79 79 73 Q78 80 60 85 Q42 80 41 73 Z" fill="#F7A9C6"/>'
    + '<path d="M41 73 Q60 79 79 73 Q78 76 77 78 Q60 74 43 78 Q42 76 41 73 Z" fill="#E5BE5E"/>'
    + '<path d="M57.6 85 v27 M62.4 85 v27" stroke="#C6485C" stroke-width="1.2"/>'
    + '<g fill="#FFF0F5" opacity=".9"><circle cx="49" cy="92" r="2.2"/><circle cx="71" cy="99" r="2.2"/><circle cx="47" cy="105" r="1.8"/></g>'
    + '<path d="M40 112 q20 -5 40 0" fill="none" stroke="#E5BE5E" stroke-width="1.6"/>',
  inkrobe: () => '<path d="M40 76 Q60 69 80 76 Q88 96 92 118 L28 118 Q32 96 40 76 Z" fill="#2E3E60"/>'
    + '<path d="M36 76 Q60 68 84 76 Q70 87 60 99 Q50 87 36 76 Z" fill="#4A6FA8"/>'
    + '<path d="M60 99 Q50 87 36 76 Q46 74 54 78 Q60 86 60 99 Z" fill="#3A5680" opacity=".55"/>'
    + '<rect x="37" y="96" width="46" height="7" rx="2" fill="#8A6B22"/>'
    + '<path d="M40 100 q20 5 40 0" fill="none" stroke="#E5BE5E" stroke-width="1.2"/>'
    + '<g fill="#8FB4D4" opacity=".55"><ellipse cx="72" cy="86" rx="5" ry="3" transform="rotate(-20 72 86)"/></g>',
  petalblouse: () => '<path d="M38 78 Q60 70 82 78 Q83 88 80 98 L40 98 Q37 88 38 78 Z" fill="#FFF0F5"/>'
    + '<path d="M38 78 Q60 70 82 78 Q78 85 60 88 Q42 85 38 78 Z" fill="#FBC7DA"/>'
    + wScallop(98, 38, 82, 6, 5.2, '#F7A9C6')
    + wScallop(90, 40, 80, 5, 4.2, '#FFD9E4')
    + '<circle cx="60" cy="85" r="2.6" fill="#E5BE5E"/>',
  puffer: () => '<path d="M60 72 Q46 70 44 74 Q26 76 25 86 Q24 96 30 104 L90 104 Q96 96 95 86 Q94 76 76 74 Q74 70 60 72 Z" fill="#AFCEDF"/>'
    + '<g fill="#CFE4EE"><path d="M26 80 q34 8 68 0 q1 5 0 8 q-34 8 -68 0 q-1 -3 0 -8 Z"/><path d="M28 96 q32 7 64 0 q0 4 0 8 l-64 0 q0 -4 0 -8 Z"/></g>'
    + wRibs('M26 79 q34 8 68 0 M26 88 q34 8 68 0 M27 96 q33 7 66 0', '#8FB4D4', 1.4)
    + '<path d="M44 74 q16 8 32 0 q-2 6 -16 8 q-14 -2 -16 -8 Z" fill="#CFE4EE"/>'
    + '<rect x="58" y="70" width="4" height="34" rx="2" fill="#4A6FA8"/>'
    + '<circle cx="60" cy="74" r="2.4" fill="#EAF2FA"/>',
  hoodie: () => '<path d="M34 74 Q60 80 86 74 Q90 76 88 84 Q90 100 84 112 L36 112 Q30 100 32 84 Q30 76 34 74 Z" fill="#B45FA8"/>'
    /* the hood, bunched behind the shoulders on either side of the head */
    + '<path d="M34 74 Q28 60 36 52 Q46 60 46 76 Z" fill="#8F4585"/>'
    + '<path d="M86 74 Q92 60 84 52 Q74 60 74 76 Z" fill="#8F4585"/>'
    + '<path d="M34 74 Q60 82 86 74 Q84 80 60 86 Q36 80 34 74 Z" fill="#8F4585"/>'
    + '<path d="M54 86 q-2 9 -1 14 M66 86 q2 9 1 14" stroke="#FFF7EE" stroke-width="2" fill="none" stroke-linecap="round"/>'
    + '<circle cx="53" cy="101" r="1.8" fill="#FFF7EE"/><circle cx="67" cy="101" r="1.8" fill="#FFF7EE"/>'
    + '<path d="M44 98 q16 6 32 0 l0 8 q-16 5 -32 0 Z" fill="#9B4E90"/>',
  starrobe: () => '<path d="M38 74 Q60 66 82 74 Q86 90 84 114 L36 114 Q34 90 38 74 Z" fill="#4A3E80"/>'
    + '<path d="M38 76 Q22 88 18 108 Q30 110 36 100 Z" fill="#4A3E80"/>'
    + '<path d="M82 76 Q98 88 102 108 Q90 110 84 100 Z" fill="#4A3E80"/>'
    + '<path d="M36 74 Q60 66 84 74 Q80 83 60 87 Q40 83 36 74 Z" fill="#5E4F9E"/>'
    + '<g fill="#FFF3C4"><circle cx="46" cy="94" r="1.7"/><circle cx="58" cy="103" r="1.4"/><circle cx="72" cy="95" r="1.6"/><circle cx="78" cy="106" r="1.3"/><circle cx="50" cy="108" r="1.2"/></g>'
    + wStar(66, 91, 3.2, '#FFE9A8') + wStar(44, 104, 2.4, '#FFF3C4')
    + '<rect x="37" y="96" width="46" height="6" rx="2" fill="#E5BE5E"/>'
    + '<circle cx="60" cy="99" r="3" fill="#FFF3C4"/>',
  dragonrobe: () => '<path d="M40 74 Q60 66 80 74 Q92 96 100 118 L20 118 Q28 96 40 74 Z" fill="#E5BE5E"/>'
    + '<path d="M36 74 Q60 66 84 74 Q80 83 60 87 Q40 83 36 74 Z" fill="#D4B25F"/>'
    + '<path d="M36 74 Q60 66 84 74 Q83 77 82 79 Q60 72 38 79 Q37 77 36 74 Z" fill="#C6485C"/>'
    /* a coiled dragon down the front: a serpent body, a horned head, one claw */
    + '<path d="M52 92 q14 -6 20 4 q-6 10 -18 6 q-10 -4 -4 -12 Z" fill="none" stroke="#C6485C" stroke-width="3" stroke-linecap="round"/>'
    + '<path d="M70 90 q7 -4 9 2 q-5 4 -9 -2 Z" fill="#C6485C"/><circle cx="76" cy="90" r="1.2" fill="#FFF3C4"/>'
    + '<path d="M50 104 q10 5 20 0" fill="none" stroke="#C6485C" stroke-width="2"/>'
    + '<g fill="#FFF3C4" opacity=".8"><circle cx="44" cy="98" r="1.6"/><circle cx="80" cy="102" r="1.6"/></g>'
    + '<path d="M38 112 q22 -6 44 0" fill="none" stroke="#C6485C" stroke-width="2"/>',
  armour: () => '<path d="M38 76 Q60 70 82 76 Q86 92 80 108 L40 108 Q34 92 38 76 Z" fill="#EDD08A"/>'
    + '<path d="M38 76 Q60 70 82 76 Q80 82 60 86 Q40 82 38 76 Z" fill="#D4B25F"/>'
    + wRibs('M42 92 q18 -6 36 0 M42 100 q18 -6 36 0 M60 86 v22', '#B9913B', 1.5)
    + '<path d="M30 74 q10 -8 18 -2 q-4 10 -18 10 Z" fill="#EDD08A" stroke="#B9913B" stroke-width="1.2"/>'
    + '<path d="M90 74 q-10 -8 -18 -2 q4 10 18 10 Z" fill="#EDD08A" stroke="#B9913B" stroke-width="1.2"/>'
    + '<path d="M60 88 l5 7 -5 7 -5 -7 Z" fill="#FFF3C4"/>',
  /* Bare shoulders and a deep V, so it cannot be mistaken for the cardigan it
     sits next to in the same slot. */
  vest: () => '<path d="M40 72 Q60 68 80 72 Q84 92 79 108 L41 108 Q36 92 40 72 Z" fill="#3A4E78"/>'
    + '<path d="M40 72 Q50 76 60 92 Q70 76 80 72 Q76 70 70 71 Q60 80 50 71 Q44 70 40 72 Z" fill="#FFF7EE"/>'
    + '<path d="M60 92 L52 108 h16 Z" fill="#2E3E60"/>'
    + '<g fill="#E5BE5E"><circle cx="60" cy="97" r="1.8"/><circle cx="60" cy="103" r="1.8"/></g>'
    + '<path d="M41 104 h11 v5 h-11 Z M68 104 h11 v5 h-11 Z" fill="#2E3E60"/>',
  /* All collar: a big square flap over the shoulders and a knotted tie. */
  sailor: () => '<path d="M38 74 Q60 68 82 74 Q84 92 80 108 L40 108 Q36 92 38 74 Z" fill="#FFFAF0"/>'
    + '<path d="M38 74 Q46 72 52 73 L60 90 L68 73 Q74 72 82 74 L82 80 Q72 96 60 100 Q48 96 38 80 Z" fill="#4A6FA8"/>'
    + '<path d="M42 78 q18 14 36 0" fill="none" stroke="#FFFAF0" stroke-width="1.6"/>'
    + '<path d="M60 90 l-6 6 6 5 6 -5 Z" fill="#C6485C"/>'
    + '<path d="M60 101 l-4 7 8 0 Z" fill="#C6485C"/>'
    + '<path d="M40 104 q20 5 40 0" fill="none" stroke="#4A6FA8" stroke-width="2"/>'
});

/* ---- bottom ----
   A skirt, a wrap, a sash. Never a trouser leg and never an ankle: eleven of
   the eighteen companions draw no legs to put one on.

   The three plain bands that used to sit here - wool, silk and snow, the same
   rectangle three times - are gone. Each of these twelve now has a shape of its
   own at the hem: rolled, asymmetric, box-pleated, scalloped, pointed, quilted,
   knife-pleated, panelled, plated. */
Object.assign(WEAR_ART, {
  woolwrap: () => '<path d="M34 90 q26 9 52 0 q3 14 -2 24 q-25 7 -50 0 q-5 -10 -2 -24 Z" fill="#C94C6C"/>'
    + '<path d="M32 88 q28 10 56 0 q1 5 -1 8 q-27 9 -54 0 q-2 -3 -1 -8 Z" fill="#E1607F"/>'
    /* cable twists rather than straight ribs, so it reads as knitwear */
    + '<g fill="none" stroke="#F5A6BF" stroke-width="2" opacity=".9">'
    + [44, 60, 76].map((x) => '<path d="M' + x + ' 98 q5 5 0 10 q-5 5 0 8"/>').join('')
    + '</g>',
  apron: () => '<path d="M47 86 q13 -4 26 0 l2 22 q-15 4 -30 0 Z" fill="#FFFAF0"/>'
    + '<path d="M46 86 q14 -4 28 0 l1 5 q-15 -3 -30 0 Z" fill="#E1607F"/>'
    + '<path d="M46 88 q-12 2 -14 10 M74 88 q12 2 14 10" fill="none" stroke="#E1607F" stroke-width="2.4"/>'
    + '<rect x="52" y="98" width="16" height="11" rx="2" fill="none" stroke="#F5A6BF" stroke-width="1.6"/>'
    + '<path d="M56 98 v11 M64 98 v11" stroke="#F5A6BF" stroke-width="1.2"/>',
  silkwrap: () => '<path d="M35 90 q25 9 50 0 q8 14 6 28 q-14 4 -26 0 q-16 2 -30 -8 q-3 -10 0 -20 Z" fill="#FBC7DA"/>'
    /* the slit and the sash are what make it asymmetric rather than a band */
    + '<path d="M68 96 q10 8 14 18 q-8 3 -13 -3 Z" fill="#FFF0F5"/>'
    + '<path d="M35 90 q25 9 50 0 q1 3 2 5 q-27 9 -53 0 q0 -2 1 -5 Z" fill="#F7A9C6"/>'
    + '<path d="M40 112 q24 8 46 0" fill="none" stroke="#E5BE5E" stroke-width="1.8"/>'
    + '<path d="M84 94 q10 14 6 26 q-7 -1 -8 -8 Z" fill="#F7A9C6" opacity=".85"/>',
  hakama: () => '<path d="M31 92 q29 9 58 0 q7 13 5 24 q-32 7 -68 0 q-2 -11 5 -24 Z" fill="#3A4E78"/>'
    /* box pleats: wide flat panels with a hard shadow between, not thin lines */
    + '<g fill="#2E3E60" opacity=".55"><path d="M45 95 h4 v22 h-4 Z"/><path d="M58 97 h4 v21 h-4 Z"/><path d="M71 95 h4 v22 h-4 Z"/></g>'
    + '<rect x="33" y="88" width="54" height="8" rx="2" fill="#6E8FBD"/>'
    + '<path d="M52 88 l8 -6 8 6 -8 5 Z" fill="#E5BE5E"/>'
    + '<path d="M33 116 q27 7 54 0" fill="none" stroke="#2E3E60" stroke-width="2"/>',
  petalskirt: () => '<path d="M35 92 q25 9 50 0 q4 10 2 17 q-27 7 -54 0 q-2 -7 2 -17 Z" fill="#FFF0F5"/>'
    + wScallop(112, 33, 87, 6, 6.4, '#F7A9C6')
    + wScallop(105, 36, 84, 5, 5.6, '#FBC7DA')
    + '<path d="M35 92 q25 9 50 0 q0 3 0 5 q-25 8 -50 0 q0 -2 0 -5 Z" fill="#7FBF95"/>',
  /* pointed, where the petal skirt is round: the two garden bottoms must not
     be the same edge in two greens */
  leafskirt: () => '<path d="M35 92 q25 9 50 0 q2 8 1 13 q-26 7 -52 0 q-1 -5 1 -13 Z" fill="#5E9E76"/>'
    + '<g fill="#7FBF95">'
    + [34, 45, 56, 67, 78].map((x, i) => '<path d="M' + x + ' 101 l6.5 ' + (12 + (i % 2) * 4) + ' l6.5 -' + (12 + (i % 2) * 4) + ' Z"/>').join('')
    + '</g>'
    + '<g fill="none" stroke="#3E7A58" stroke-width="0.9">'
    + [42, 53, 64, 75, 86].map((x, i) => '<path d="M' + x + ' 102 v' + (11 + (i % 2) * 4) + '"/>').join('')
    + '</g>'
    + '<path d="M35 92 q25 9 50 0 q0 3 0 5 q-25 8 -50 0 q0 -2 0 -5 Z" fill="#96D3AB"/>',
  snowpuff: () => '<path d="M33 90 q27 10 54 0 q5 12 1 21 q-28 7 -56 0 q-4 -9 1 -21 Z" fill="#AFCEDF"/>'
    /* quilted rolls, matching the puffer coat it is worn with */
    + '<g fill="#CFE4EE"><path d="M34 92 q26 9 52 0 q1 5 0 9 q-26 8 -52 0 q-1 -4 0 -9 Z"/>'
    + '<path d="M35 105 q25 8 50 0 q0 5 -1 8 q-24 7 -48 0 q-1 -3 -1 -8 Z"/></g>'
    + wScallop(113, 32, 88, 8, 5.2, '#FFFFFF')
    + '<path d="M33 90 q27 10 54 0 q0 2 0 4 q-27 9 -54 0 q0 -2 0 -4 Z" fill="#EAF2FA"/>',
  denimskirt: () => '<path d="M38 92 q22 9 44 0 q3 10 1 17 l-48 0 q-2 -7 1 -17 Z" fill="#6E8FBD"/>'
    + '<path d="M35 92 q25 9 50 0 q0 4 0 6 q-25 8 -50 0 q0 -2 0 -6 Z" fill="#4A6FA8"/>'
    + '<rect x="66" y="101" width="12" height="10" rx="2" fill="none" stroke="#E5BE5E" stroke-width="1.2" stroke-dasharray="2 2"/>'
    + '<path d="M38 99 q22 7 44 0" fill="none" stroke="#E5BE5E" stroke-width="1" stroke-dasharray="2.5 2.5"/>'
    + '<circle cx="46" cy="97" r="1.6" fill="#E5BE5E"/>',
  /* knife pleats: many thin sharp folds, against the hakama's few wide ones */
  pleated: () => '<path d="M38 92 q22 9 44 0 q2 8 0 14 q-22 6 -44 0 q-2 -6 0 -14 Z" fill="#B45FA8"/>'
    + '<g fill="#8F4585" opacity=".6">'
    + [39, 47, 55, 63, 71, 79].map((x) => '<path d="M' + x + ' 96 l2.6 0 l1 17 l-2.6 0 Z"/>').join('')
    + '</g>'
    + '<path d="M36 92 q24 9 48 0 q0 3 0 5 q-24 8 -48 0 q0 -2 0 -5 Z" fill="#D68BCA"/>',
  nebula: () => '<path d="M35 92 q25 9 50 0 q2 14 -4 26 q-21 5 -42 0 q-6 -12 -4 -26 Z" fill="#4A3E80"/>'
    + '<path d="M40 96 q20 8 40 0 q2 9 -2 16 q-18 6 -36 0 q-4 -7 -2 -16 Z" fill="#5E4F9E" opacity=".75"/>'
    + '<g fill="#FFF3C4"><circle cx="45" cy="102" r="1.5"/><circle cx="57" cy="110" r="1.3"/><circle cx="70" cy="103" r="1.5"/><circle cx="79" cy="111" r="1.2"/><circle cx="62" cy="99" r="1.1"/></g>'
    + wStar(52, 105, 2.4, '#FFE9A8') + wStar(76, 98, 2, '#FFF3C4'),
  /* panelled: three separate falls of cloth with gold between them */
  /* three panels that hang to different depths, so the hem is stepped rather
     than level - the one thing that told it apart from every other skirt */
  courtskirt: () => '<path d="M34 92 q26 9 52 0 q3 10 2 18 l-14 4 -2 -6 -10 6 -12 -2 -2 6 -14 -4 q-1 -12 0 -22 Z" fill="#C6485C"/>'
    + '<g fill="#A83247"><path d="M34 97 h16 l-2 17 h-14 Z"/><path d="M70 97 h16 l2 17 h-14 Z"/></g>'
    + '<path d="M34 92 q26 9 52 0 q1 4 0 6 q-26 8 -52 0 q-1 -2 0 -6 Z" fill="#E5BE5E"/>'
    + '<g stroke="#E5BE5E" stroke-width="1.6" fill="none"><path d="M51 98 v18 M69 98 v18"/></g>'
    + '<g fill="#E5BE5E"><circle cx="60" cy="104" r="2.4"/><circle cx="60" cy="112" r="1.8"/></g>',
  faulds: () => '<path d="M35 92 q25 9 50 0 q2 8 1 14 q-26 8 -52 0 q-1 -6 1 -14 Z" fill="#EDD08A"/>'
    + '<g fill="#D4B25F" stroke="#B9913B" stroke-width="1"><path d="M36 100 h16 l-1 12 h-14 Z"/><path d="M54 102 h12 l0 12 h-12 Z"/><path d="M68 100 h16 l1 12 h-14 Z"/></g>'
    + '<path d="M35 92 q25 9 50 0 q0 3 0 5 q-25 8 -50 0 q0 -2 0 -5 Z" fill="#FFF3C4"/>'
    + '<g fill="#B9913B"><circle cx="44" cy="104" r="1.4"/><circle cx="60" cy="106" r="1.4"/><circle cx="76" cy="104" r="1.4"/></g>'
});

/* ---- hem: the bottom border of the drawing ----
   This is the slot that stands in place of footwear. It rides the lower edge of
   the body rather than a foot, so it belongs to all eighteen companions - the
   crane and the turtle included, which is the whole reason it exists.

   Twelve, and each gives the edge a different outline: round bobbles, hanging
   strands, a zigzag, swinging bells, a soft wash with no edge at all, a
   wandering vine, crystal spikes, a glowing line, scattered dust, pointed
   feathers, a medallion band and a mesh of rings. */
Object.assign(WEAR_ART, {
  pompom: () => '<path d="M32 106 q28 8 56 0" fill="none" stroke="#C94C6C" stroke-width="2.6"/>'
    + wScallop(110, 32, 88, 7, 4.4, '#FFF7EE')
    + wScallop(110, 32, 88, 7, 2.2, '#F5A6BF'),
  fringe: () => '<path d="M31 104 q29 9 58 0 q0 4 -1 6 q-28 8 -56 0 q-1 -2 -1 -6 Z" fill="#C94C6C"/>'
    + '<g stroke="#F5A6BF" stroke-width="1.8" stroke-linecap="round">'
    + [34, 40, 46, 52, 58, 64, 70, 76, 82, 88].map((x, i) =>
      '<path d="M' + x + ' 109 v' + (5 + (i % 3) * 3) + '"/>').join('')
    + '</g>',
  goldthread: () => '<path d="M32 105 q28 8 56 0" fill="none" stroke="#E5BE5E" stroke-width="2.4"/>'
    + '<path d="M34 110 l6 -5 6 5 6 -5 6 5 6 -5 6 5 6 -5 6 5" fill="none" stroke="#E5BE5E" stroke-width="1.8" stroke-linejoin="round"/>'
    + '<g>' + wTassel(40, 109, '#C6485C') + wTassel(60, 111, '#C6485C') + wTassel(80, 109, '#C6485C') + '</g>',
  bells: () => '<path d="M31 105 q29 9 58 0" fill="none" stroke="#C6485C" stroke-width="2.2"/>'
    + [37, 49, 60, 71, 83].map((x, i) => {
      const y = 110 + (i % 2) * 3;
      return '<path d="M' + x + ' ' + (y - 4) + ' v3" stroke="#B9913B" stroke-width="1"/>'
        + '<path d="M' + (x - 3.6) + ' ' + (y + 4) + ' q0 -6 3.6 -6 q3.6 0 3.6 6 Z" fill="#E5BE5E"/>'
        + '<circle cx="' + x + '" cy="' + (y + 5.6) + '" r="1.4" fill="#8A6B22"/>';
    }).join(''),
  inkborder: () => '<path d="M31 104 q29 9 58 0 q1 7 -2 11 q-27 7 -54 0 q-3 -4 -2 -11 Z" fill="#2E3E60" opacity=".22"/>'
    + '<path d="M33 107 q27 8 54 0" fill="none" stroke="#2E3E60" stroke-width="2.2" opacity=".75"/>'
    + '<path d="M40 113 q8 -4 14 1 q7 -5 14 0 q7 -5 12 -1" fill="none" stroke="#4A6FA8" stroke-width="1.4" opacity=".8"/>',
  vinehem: () => '<path d="M31 106 q14 8 29 8 q15 0 29 -8" fill="none" stroke="#5E9E76" stroke-width="2.4" stroke-linecap="round"/>'
    + '<g fill="#7FBF95"><path d="M42 111 q-5 -5 -1 -8 q6 2 5 8 Z"/><path d="M78 111 q5 -5 1 -8 q-6 2 -5 8 Z"/><path d="M60 115 q-5 -4 -2 -7 q6 2 5 7 Z"/></g>'
    + '<g fill="#F7A9C6"><circle cx="50" cy="113" r="2.4"/><circle cx="70" cy="113" r="2.4"/></g>'
    + '<g fill="#FFE9A8"><circle cx="50" cy="113" r="1"/><circle cx="70" cy="113" r="1"/></g>',
  frostlace: () => '<path d="M32 105 q28 8 56 0" fill="none" stroke="#CFE4EE" stroke-width="2.4"/>'
    + '<g fill="#EAF2FA">'
    + [36, 48, 60, 72, 84].map((x, i) => '<path d="M' + x + ' 108 l5 ' + (9 + (i % 2) * 3) + ' l5 -' + (9 + (i % 2) * 3) + ' Z"/>').join('')
    + '</g>'
    + '<g stroke="#8FB4D4" stroke-width="1" opacity=".9">'
    + [41, 53, 65, 77].map((x) => '<path d="M' + x + ' 108 v9 M' + (x - 3.5) + ' 111 l7 4 M' + (x + 3.5) + ' 111 l-7 4"/>').join('')
    + '</g>',
  neonhem: () => '<path d="M32 106 q28 8 56 0" fill="none" stroke="#B45FA8" stroke-width="7" opacity=".28"/>'
    + '<path d="M32 106 q28 8 56 0" fill="none" stroke="#D96FC4" stroke-width="3"/>'
    + '<path d="M33 111 q27 8 54 0" fill="none" stroke="#2FC9B4" stroke-width="2.6"/>',
  starhem: () => '<path d="M31 104 q29 9 58 0 q1 8 -3 13 q-26 7 -52 0 q-4 -5 -3 -13 Z" fill="#5E4F9E" opacity=".3"/>'
    + '<path d="M33 106 q27 8 54 0" fill="none" stroke="#FFE9A8" stroke-width="1.8"/>'
    + '<g fill="#FFF3C4"><circle cx="41" cy="111" r="1.5"/><circle cx="52" cy="114" r="1.2"/><circle cx="60" cy="116" r="1.5"/><circle cx="69" cy="114" r="1.2"/><circle cx="80" cy="111" r="1.5"/></g>'
    + wStar(46, 109, 2.4, '#FFE9A8') + wStar(74, 109, 2.4, '#FFE9A8'),
  /* the only hem that hangs in long points; everything else is a band */
  feathertrim: () => '<path d="M31 104 q29 9 58 0" fill="none" stroke="#D9C7F2" stroke-width="2.2"/>'
    + '<g>' + [35, 43, 51, 59, 67, 75, 83].map((x, i) =>
      '<path d="M' + x + ' 105 q4.4 ' + (5 + (i % 2) * 2) + ' 0 ' + (10 + (i % 2) * 4)
      + ' q-4.4 -' + (6 + (i % 2) * 2) + ' 0 -' + (10 + (i % 2) * 4) + ' Z" fill="'
      + (i % 2 ? '#FFFDF8' : '#F1E9FF') + '" stroke="#D9C7F2" stroke-width="0.8"/>').join('') + '</g>',
  brocade: () => '<path d="M31 104 q29 9 58 0 q1 7 -1 12 q-28 7 -56 0 q-2 -5 -1 -12 Z" fill="#C6485C"/>'
    + '<path d="M31 104 q29 9 58 0 q0 3 0 4 q-29 8 -58 0 q0 -1 0 -4 Z" fill="#E5BE5E"/>'
    + '<path d="M32 114 q28 7 56 0" fill="none" stroke="#E5BE5E" stroke-width="1.6"/>'
    + '<g fill="#E5BE5E">' + [42, 60, 78].map((x) => '<circle cx="' + x + '" cy="111" r="2.6"/>').join('') + '</g>'
    + '<g fill="#A83247">' + [42, 60, 78].map((x) => '<circle cx="' + x + '" cy="111" r="1.1"/>').join('') + '</g>',
  chainmail: () => '<path d="M31 104 q29 9 58 0 q1 7 -1 12 q-28 7 -56 0 q-2 -5 -1 -12 Z" fill="#D4B25F"/>'
    + '<g fill="none" stroke="#8A6B22" stroke-width="1">'
    + [0, 1, 2].map((r) => [0, 1, 2, 3, 4, 5, 6].map((c) => '<circle cx="' + (37 + c * 7.6 + (r % 2 ? 3.8 : 0)) + '" cy="' + (107 + r * 4) + '" r="2.4"/>').join('')).join('')
    + '</g>'
    + '<path d="M31 104 q29 9 58 0" fill="none" stroke="#FFF3C4" stroke-width="1.6"/>'
});

/* ---- back: drawn behind the companion ----
   Four of these were one cape in four colours. They are now told apart by
   outline before colour: the quilt is a rounded blanket with a folded corner,
   the star cloak hangs straight from a clasp, the imperial mantle carries a fur
   collar and a train wider than the rest, and the war cape is torn along the
   bottom. The other nine are not capes at all. */
Object.assign(WEAR_ART, {
  quiltcape: () => '<path d="M30 76 Q12 92 12 112 Q12 118 20 118 L100 118 Q108 118 108 112 Q108 92 90 76 Q60 86 30 76 Z" fill="#E1607F"/>'
    + '<g fill="#F5A6BF" opacity=".85"><path d="M16 94 h22 v16 h-22 Z"/><path d="M82 98 h22 v16 h-22 Z"/><path d="M44 104 h20 v14 h-20 Z"/></g>'
    + '<g stroke="#C94C6C" stroke-width="1.3" fill="none" opacity=".7"><path d="M16 94 h88 M14 108 h92 M38 82 v36 M82 84 v34"/></g>'
    /* the turned-back corner is what says blanket rather than cloak */
    + '<path d="M12 112 q0 6 8 6 l14 0 q-16 -4 -22 -6 Z" fill="#FFF7EE"/>'
    + '<path d="M30 76 Q60 86 90 76 Q92 71 86 69 Q60 78 34 69 Q28 71 30 76 Z" fill="#FFF7EE"/>',
  lantern: () => '<path d="M86 108 L78 44" stroke="#8F4A38" stroke-width="3.4" stroke-linecap="round"/>'
    + '<path d="M78 46 q8 -4 13 2" fill="none" stroke="#8F4A38" stroke-width="2.4"/>'
    + '<path d="M91 50 v6" stroke="#C6485C" stroke-width="1.6"/>'
    + '<ellipse cx="91" cy="68" rx="11" ry="13" fill="#F2789F"/>'
    + '<ellipse cx="91" cy="68" rx="11" ry="13" fill="none" stroke="#C6485C" stroke-width="1.6"/>'
    + '<path d="M80 68 h22" stroke="#C6485C" stroke-width="1.2"/>'
    + '<rect x="86" y="54" width="10" height="3" rx="1.5" fill="#E5BE5E"/><rect x="86" y="79" width="10" height="3" rx="1.5" fill="#E5BE5E"/>'
    + '<ellipse cx="91" cy="68" rx="5" ry="7" fill="#FFF3C4" opacity=".7"/>'
    + wTassel(91, 82, '#C6485C'),
  /* a disc of folded paper standing behind the head, like a peacock */
  fan: () => '<g transform="translate(60,64)">'
    + '<path d="M-42 6 A42 42 0 0 1 42 6 Z" fill="#FFF0F5" stroke="#C6485C" stroke-width="1.6"/>'
    + '<g stroke="#F7A9C6" stroke-width="1.4">'
    + [-60, -30, 0, 30, 60].map((ang) => '<path d="M0 6 L' + (Math.sin(ang * Math.PI / 180) * 41).toFixed(1) + ' ' + (6 - Math.cos(ang * Math.PI / 180) * 41).toFixed(1) + '"/>').join('')
    + '</g>'
    + '<path d="M-42 6 A42 42 0 0 1 42 6" fill="none" stroke="#C6485C" stroke-width="2.4"/>'
    + '<path d="M-24 -6 A26 26 0 0 1 24 -6" fill="none" stroke="#E5BE5E" stroke-width="2"/>'
    + '<circle cx="0" cy="6" r="4" fill="#E5BE5E"/></g>',
  satchel: () => '<path d="M30 72 q30 12 60 0" fill="none" stroke="#8F4A38" stroke-width="3.4"/>'
    + '<rect x="20" y="82" width="26" height="24" rx="4" fill="#A85B45"/>'
    + '<path d="M20 88 h26 v6 h-26 Z" fill="#8F4A38"/>'
    + '<rect x="29" y="90" width="8" height="6" rx="2" fill="#E5BE5E"/>'
    + '<g><rect x="22" y="72" width="5" height="14" rx="2.5" fill="#F0DFC8" stroke="#C6A98A" stroke-width="1"/>'
    + '<rect x="30" y="68" width="5" height="18" rx="2.5" fill="#FFF7EE" stroke="#C6A98A" stroke-width="1"/>'
    + '<rect x="38" y="71" width="5" height="15" rx="2.5" fill="#F0DFC8" stroke="#C6A98A" stroke-width="1"/></g>',
  /* a diamond on a string, well clear of the body - nothing else up there */
  kite: () => '<path d="M46 92 Q34 74 30 52" fill="none" stroke="#C6A98A" stroke-width="1.2"/>'
    + '<g transform="translate(30,34)">'
    + '<path d="M0 -20 L13 0 L0 20 L-13 0 Z" fill="#4A6FA8"/>'
    + '<path d="M0 -20 L13 0 L0 0 Z" fill="#6E8FBD"/><path d="M0 20 L-13 0 L0 0 Z" fill="#6E8FBD"/>'
    + '<path d="M0 -20 v40 M-13 0 h26" stroke="#2E3E60" stroke-width="1"/>'
    + '<path d="M0 20 q6 8 -2 14 q8 4 4 12" fill="none" stroke="#E5BE5E" stroke-width="1.4"/></g>',
  flutterwings: () => {
    const wing = (flip) => '<g transform="translate(' + (flip ? 74 : 46) + ',84)' + (flip ? ' scale(-1,1)' : '') + '">'
      + '<path d="M0 0 Q-26 -30 -32 -8 Q-34 10 -6 6 Z" fill="#C9B0EA" opacity=".85"/>'
      + '<path d="M0 4 Q-22 14 -24 30 Q-10 34 -2 14 Z" fill="#F7A9C6" opacity=".85"/>'
      + '<path d="M0 0 Q-26 -30 -32 -8 Q-34 10 -6 6 Z" fill="none" stroke="#9E82D2" stroke-width="1.2"/>'
      + '<path d="M0 4 Q-22 14 -24 30 Q-10 34 -2 14 Z" fill="none" stroke="#E1607F" stroke-width="1.1"/>'
      + '<circle cx="-20" cy="-8" r="2.6" fill="#FFF3C4"/><circle cx="-14" cy="20" r="2.2" fill="#FFF7EE"/></g>';
    return '<g class="wingpair">' + wing(false) + wing(true) + '</g>';
  },
  /* long, narrow and see-through, where the butterfly's are broad and opaque */
  dragonflywings: () => {
    const pair = (flip) => '<g transform="translate(' + (flip ? 72 : 48) + ',78)' + (flip ? ' scale(-1,1)' : '') + '">'
      + '<ellipse cx="-22" cy="-8" rx="23" ry="6.5" fill="#CFE4EE" opacity=".62" stroke="#9EC2F0" stroke-width="1" transform="rotate(-14)"/>'
      + '<ellipse cx="-20" cy="6" rx="20" ry="5.5" fill="#EAF2FA" opacity=".62" stroke="#9EC2F0" stroke-width="1" transform="rotate(12)"/>'
      + '<g stroke="#9EC2F0" stroke-width="0.6" opacity=".8">'
      + '<path d="M-40 -13 q19 4 36 0 M-38 -4 q19 4 34 0" transform="rotate(-14)"/></g></g>';
    return '<g class="wingpair">' + pair(false) + pair(true) + '</g>';
  },
  parasol: () => '<path d="M66 96 L86 50" stroke="#8F4A38" stroke-width="2.4" stroke-linecap="round"/>'
    + '<g transform="translate(88,44)">'
    + '<path d="M-28 4 A28 28 0 0 1 28 4 Z" fill="#E1607F"/>'
    + '<path d="M-28 4 A28 28 0 0 1 -14 -20 L-14 4 Z" fill="#FFF0F5"/>'
    + '<path d="M0 -24 A28 28 0 0 1 14 -20 L14 4 L0 4 Z" fill="#FFF0F5"/>'
    + '<path d="M-28 4 A28 28 0 0 1 28 4" fill="none" stroke="#C6485C" stroke-width="1.8"/>'
    + '<path d="M-28 4 h56" stroke="#C6485C" stroke-width="1.4"/>'
    + '<path d="M0 -28 v6" stroke="#8F4A38" stroke-width="2"/><circle cx="0" cy="-30" r="2.4" fill="#E5BE5E"/></g>',
  cloak: () => '<path d="M36 70 Q14 94 9 118 L111 118 Q106 94 84 70 Q60 82 36 70 Z" fill="#4A3E80"/>'
    + '<path d="M36 70 Q20 92 15 116 L38 116 Q36 92 42 74 Z" fill="#5E4F9E" opacity=".85"/>'
    + '<path d="M84 70 Q100 92 105 116 L82 116 Q84 92 78 74 Z" fill="#5E4F9E" opacity=".85"/>'
    + '<g fill="#FFF3C4"><circle cx="22" cy="100" r="1.9"/><circle cx="16" cy="112" r="1.5"/><circle cx="98" cy="102" r="1.7"/><circle cx="104" cy="113" r="1.6"/><circle cx="60" cy="88" r="1.3"/></g>'
    + '<circle cx="60" cy="70" r="5" fill="#E5BE5E"/><circle cx="60" cy="70" r="2.2" fill="#4A3E80"/>',
  wings: () => {
    const fan = (flip) => {
      const feath = [[-70, 42], [-56, 48], [-42, 50], [-28, 44], [-15, 34]].map((f, i) =>
        '<ellipse cx="0" cy="' + (-f[1] / 2) + '" rx="8" ry="' + (f[1] / 2) + '" fill="' + (i % 2 ? '#FFFDF8' : '#F1E9FF')
        + '" stroke="#D9C7F2" stroke-width="1" transform="rotate(' + f[0] + ')"/>').join('');
      return '<g transform="translate(' + (flip ? 68 : 52) + ',84)' + (flip ? ' scale(-1,1)' : '') + '">' + feath + '</g>';
    };
    return '<g class="wingpair">' + fan(false) + fan(true) + '</g>';
  },
  mantle: () => '<path d="M34 70 Q8 98 3 118 L117 118 Q112 98 86 70 Q60 84 34 70 Z" fill="#C6485C"/>'
    + '<path d="M34 70 Q16 96 11 116 L34 116 Q32 94 40 74 Z" fill="#A83247" opacity=".85"/>'
    + '<path d="M86 70 Q104 96 109 116 L86 116 Q88 94 80 74 Z" fill="#A83247" opacity=".85"/>'
    + '<g fill="#E5BE5E" opacity=".92"><circle cx="18" cy="100" r="2.4"/><circle cx="12" cy="112" r="2"/><circle cx="102" cy="100" r="2.4"/><circle cx="108" cy="112" r="2"/><circle cx="60" cy="112" r="2.2"/></g>'
    /* the fur collar, which is the thing that says court rather than cape */
    + wScallop(70, 26, 94, 9, 7, '#FFF7EE')
    + '<path d="M34 70 Q60 84 86 70 Q88 64 82 62 Q60 72 38 62 Q32 64 34 70 Z" fill="#E5BE5E"/>',
  warcape: () => '<path d="M36 70 Q16 94 11 118 Q24 113 32 119 Q42 110 52 117 Q62 108 72 117 Q82 110 92 119 Q102 113 109 118 Q104 94 84 70 Q60 82 36 70 Z" fill="#8A2F3E"/>'
    + '<path d="M36 70 Q20 94 15 116 L38 114 Q36 92 42 74 Z" fill="#A83247" opacity=".85"/>'
    + '<g stroke="#6E2231" stroke-width="1.3" fill="none" opacity=".8"><path d="M30 84 v30 M50 88 v28 M70 88 v28 M90 84 v30"/></g>'
    + '<path d="M36 70 Q60 82 84 70 Q86 64 80 62 Q60 72 40 62 Q34 64 36 70 Z" fill="#D4B25F"/>'
    + '<circle cx="42" cy="66" r="4" fill="#EDD08A" stroke="#8A6B22" stroke-width="1.2"/>'
    + '<circle cx="78" cy="66" r="4" fill="#EDD08A" stroke="#8A6B22" stroke-width="1.2"/>',
  /* a pole and a hanging flag, so the guardian set is not two capes */
  banner: () => '<path d="M96 116 L92 26" stroke="#6E5A48" stroke-width="3.4" stroke-linecap="round"/>'
    + '<path d="M92 24 l3 -8 3 8 -3 4 Z" fill="#E5BE5E"/>'
    + '<path d="M92 32 L60 38 L60 78 L92 72 Z" fill="#8A2F3E"/>'
    + '<path d="M92 32 L60 38 L60 46 L92 40 Z" fill="#D4B25F"/>'
    + '<path d="M60 78 l8 6 8 -6 8 6 8 -6" fill="none" stroke="#8A2F3E" stroke-width="5" stroke-linejoin="round"/>'
    + '<circle cx="76" cy="58" r="8" fill="none" stroke="#E5BE5E" stroke-width="2"/>'
    + '<path d="M76 52 l2 5 5 1 -4 4 1 5 -4 -3 -4 3 1 -5 -4 -4 5 -1 Z" fill="#E5BE5E"/>'
});

/* ---- putting an outfit on a particular companion ----
   The anchors are the ones the art already publishes for its own face and its
   own throat. Reading them here rather than assuming 54 and 80 is what lets the
   fox keep its glasses on its own eyes. */
const wearAnchors = (art) => ({
  eyeY: (art && art.eyeY) || 54,
  charmY: (art && art.charmY) || 80,
  bodyRX: (art && art.bodyRX) || 30,
  bodyRY: (art && art.bodyRY) || 23,
  headY: (art && art.headY) || 0
});
const WEAR_DEF = wearAnchors(null);
function wearDraw(id, a) {
  const f = WEAR_ART[id];
  return f ? f(a || WEAR_DEF) : '';
}
/* Two passes, because the back slot belongs behind the companion and everything
   else in front of it - the same split the old single wear slot needed for its
   one pair of wings. */
function fitDraw(fit, a) {
  let back = '', front = '';
  PET_SLOTS.forEach((s) => {
    const id = fit && fit[s.id];
    if (!id || id === 'none') return;
    const svg = wearDraw(id, a);
    if (s.behind) back += svg; else front += svg;
  });
  return { back: back, front: front };
}
/* The shelf tile. One drawing, seen through the window its slot carries, so a
   tile cannot promise something the companion will not actually wear. */
function wearTile(id) {
  const x = wearOf(id);
  if (!x) return '<svg viewBox="0 0 60 60" class="wearart" aria-hidden="true"><circle cx="30" cy="30" r="16" fill="none" stroke="#C9BFE0" stroke-width="2" stroke-dasharray="4 4"/></svg>';
  return '<svg viewBox="' + petSlot(x.slot).crop + '" class="wearart" aria-hidden="true">' + wearDraw(id, WEAR_DEF) + '</svg>';
}

/* ---- the sky ----
   The nine homes are hand-drawn and stay exactly as they are. This lays a time
   of day and a weather over them instead: a wash of colour and a handful of
   moving things. Nine homes and ten skies is ninety scenes for about fifteen
   lines of drawing each, which is the only reason there are ninety. */
const PET_SKIES = [
  { id: 'clear', tier: 'free' },
  { id: 'fireflies', tier: 'free' },
  { id: 'dawn', tier: 'plus' },
  { id: 'dusk', tier: 'plus' },
  { id: 'starry', tier: 'plus' },
  { id: 'snow', tier: 'plus' },
  { id: 'sakura', tier: 'plus' },
  { id: 'rain', tier: 'plus' },
  { id: 'aurora', tier: 'pro' },
  { id: 'lanterns', tier: 'pro' }
];
const skyOf = (id) => PET_SKIES.filter((s) => s.id === id)[0] || PET_SKIES[0];
const skyWorn = (id) => { const s = skyOf(id); return tierOn(s.tier) ? s : PET_SKIES[0]; };

/* A wash across the whole square, kept faint: the home underneath it is the
   thing worth looking at, and a tint that hides it is a tint that has failed. */
const skyWash = (id, cols, op) => '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1">'
  + '<stop offset="0%" stop-color="' + cols[0] + '"/><stop offset="55%" stop-color="' + cols[1] + '"/>'
  + '<stop offset="100%" stop-color="' + cols[1] + '" stop-opacity=".35"/></linearGradient></defs>'
  + '<rect width="240" height="240" fill="url(#' + id + ')" opacity="' + op + '"/>';
/* Things that fall, drift or wander. The delay spread is what stops a dozen
   identical nodes reading as one blinking row. */
const skyMany = (n, cls, make) => {
  let out = '';
  for (let i = 0; i < n; i++) {
    const x = Math.round(((i * 97) % 100) * 2.3 + 8), d = i * 740;
    out += '<g class="' + cls + '" style="animation-delay:' + d + 'ms">' + make(x, i) + '</g>';
  }
  return out;
};

function petSkySVG(id) {
  /* The homes are drawn with xMidYMax slice, so the square is scaled to cover
     the stage and cropped at the top. A sky framed any other way would drift
     off the home it is supposed to be lying on - which is exactly what the
     first probe run showed. */
  const open = '<svg viewBox="0 0 240 240" class="petsky" preserveAspectRatio="xMidYMax slice" aria-hidden="true">';
  if (id === 'clear' || !id) return '';
  if (id === 'dawn') {
    return open + skyWash('skdawn', ['#FFB877', '#FFE4C4'], '.55')
      + '<circle cx="196" cy="42" r="26" fill="#FFE1B0" opacity=".45"/>'
      + '<g stroke="#FFF3C4" stroke-width="2.4" opacity=".4" stroke-linecap="round">'
      + '<path d="M196 4 v-0 M196 6 v10 M232 42 h10 M160 42 h-10 M222 16 l7 -7 M170 16 l-7 -7"/></g>'
      + '</svg>';
  }
  if (id === 'dusk') {
    return open + skyWash('skdusk', ['#6E4E8E', '#FFAE86'], '.52')
      + '<circle cx="42" cy="50" r="20" fill="#FFB27A" opacity=".4"/>'
      + '<g fill="#FFD9E4" opacity=".35"><ellipse cx="120" cy="34" rx="40" ry="8"/><ellipse cx="200" cy="58" rx="30" ry="6"/></g>'
      + '</svg>';
  }
  if (id === 'starry') {
    return open + skyWash('skstar', ['#1B1440', '#4A3A86'], '.6')
      + '<g fill="#FFF7EE">'
      + [[24, 28], [62, 16], [106, 36], [148, 20], [196, 30], [226, 58], [16, 74], [86, 62], [170, 68]]
        .map((p, k) => '<circle class="twinkle" cx="' + p[0] + '" cy="' + p[1] + '" r="' + (1.3 + (k % 3) * 0.5) + '" style="animation-delay:' + (k * 280) + 'ms"/>').join('')
      + '</g></svg>';
  }
  if (id === 'snow') {
    return open + skyWash('sksnow', ['#BCD6EE', '#F2F8FF'], '.5')
      + skyMany(10, 'skfall', (x, i) => '<circle cx="' + x + '" cy="-8" r="' + (2.4 + (i % 3)) + '" fill="#FFFFFF" opacity=".95"/>')
      + '</svg>';
  }
  if (id === 'sakura') {
    return open + skyWash('sksak', ['#FFBBD0', '#FFE6EE'], '.5')
      + skyMany(10, 'skfall sway', (x, i) => '<ellipse cx="' + x + '" cy="-8" rx="' + (4 + (i % 2) * 1.6) + '" ry="2.6" fill="' + (i % 2 ? '#FFF0F5' : '#FBC7DA') + '" opacity=".95"/>')
      + '</svg>';
  }
  if (id === 'rain') {
    return open + skyWash('skrain', ['#6E869E', '#B8D2E0'], '.5')
      + skyMany(11, 'skfall fast', (x) => '<path d="M' + x + ' -12 v16" stroke="#EAF6FF" stroke-width="2" stroke-linecap="round" opacity=".9"/>')
      + '</svg>';
  }
  if (id === 'fireflies') {
    return open + skyWash('skfly', ['#2E3A58', '#5E6E90'], '.45')
      + skyMany(7, 'skwander', (x, i) => '<circle cx="' + x + '" cy="' + (90 + (i % 4) * 26) + '" r="2.4" fill="#FFF3C4" opacity=".9"/>'
        + '<circle cx="' + x + '" cy="' + (90 + (i % 4) * 26) + '" r="5.5" fill="#FFF3C4" opacity=".2"/>')
      + '</svg>';
  }
  if (id === 'aurora') {
    return open + skyWash('skaur', ['#141E38', '#2A3A5E'], '.6')
      + '<g class="skaurora" fill="none" stroke-width="12" stroke-linecap="round" opacity=".38">'
      + '<path d="M-10 60 Q60 22 120 52 Q186 82 250 44" stroke="#7FE6C0"/>'
      + '<path d="M-10 84 Q70 48 132 76 Q194 102 250 70" stroke="#9EC2F0" style="animation-delay:1400ms"/>'
      + '<path d="M-10 40 Q64 10 126 34 Q190 58 250 28" stroke="#C9B0EA" style="animation-delay:2600ms"/></g>'
      + '<g fill="#FFF7EE">' + [[30, 22], [110, 14], [200, 26]].map((p, k) => '<circle class="twinkle" cx="' + p[0] + '" cy="' + p[1] + '" r="1.5" style="animation-delay:' + (k * 420) + 'ms"/>').join('') + '</g>'
      + '</svg>';
  }
  if (id === 'lanterns') {
    return open + skyWash('sklan', ['#3A1E30', '#7A4A5E'], '.55')
      + skyMany(6, 'skrise', (x, i) => {
        const r = 7 + (i % 3) * 2.4;
        return '<ellipse cx="' + x + '" cy="230" rx="' + r + '" ry="' + (r * 1.24).toFixed(1) + '" fill="#F2789F" opacity=".9"/>'
          + '<ellipse cx="' + x + '" cy="230" rx="' + (r * 0.45).toFixed(1) + '" ry="' + (r * 0.62).toFixed(1) + '" fill="#FFF3C4" opacity=".8"/>'
          + '<ellipse cx="' + x + '" cy="230" rx="' + (r * 1.9).toFixed(1) + '" ry="' + (r * 2.1).toFixed(1) + '" fill="#FFB27A" opacity=".12"/>';
      })
      + '</svg>';
  }
  return '';
}

/* ---- the Pro effects ----
   Skies set the weather; this is the showpiece, and it is the one part of the
   wardrobe reserved for Pro. It is what makes a subscriber's companion read as
   different from across a room.

   Rules held to throughout, and they are not style preferences. Everything is
   a CSS animation on an SVG node, never a timer, so a hidden tab costs nothing
   and none of it fights the stroking handler. Nothing animates but transform
   and opacity, and nothing uses a filter: the comments in petSVG record a
   drop-shadow that forced the whole drawing to rasterise and went soft the
   moment it moved, and an effect that brings that back is worse than no effect.
   Twelve moving nodes is the ceiling. */
const PET_FX = [
  { id: 'none', tier: 'free' },
  { id: 'twinkle', tier: 'pro' },
  { id: 'shooting', tier: 'pro' },
  { id: 'motes', tier: 'pro' },
  { id: 'petals', tier: 'pro' },
  { id: 'fireflies', tier: 'pro' },
  { id: 'runering', tier: 'pro' },
  { id: 'butterfly', tier: 'pro' },
  { id: 'ripple', tier: 'pro' },
  { id: 'shimmer', tier: 'pro' }
];
const fxOf = (id) => PET_FX.filter((f) => f.id === id)[0] || PET_FX[0];
const fxWorn = (id) => { const f = fxOf(id); return tierOn(f.tier) ? f : PET_FX[0]; };

/* Returns the two layers separately: one behind the companion, one in front.
   Coordinates are the companion's 120x120, so an effect sits on the creature
   rather than on the room. */
function petFxSVG(id) {
  const none = { back: '', front: '' };
  if (!id || id === 'none') return none;
  if (id === 'twinkle') {
    const pts = [[14, 24], [102, 20], [24, 98], [106, 94], [60, 8], [8, 60], [112, 54], [42, 14], [80, 110]];
    return { back: '<g class="petfx">' + pts.map((p, k) =>
      '<g class="twinkle" style="animation-delay:' + (k * 380) + 'ms">'
      + wStar(p[0], p[1], 5.2 - (k % 3) * 1.1, '#FFE9A8')
      + wStar(p[0], p[1], 2.4 - (k % 3) * 0.4, '#FFFFFF') + '</g>').join('') + '</g>', front: '' };
  }
  if (id === 'shooting') {
    return { back: '<g class="petfx">' + [0, 1, 2].map((i) =>
      '<g class="fxshoot" style="animation-delay:' + (i * 1800) + 'ms;--fy:' + (14 + i * 26) + '">'
      + '<path d="M0 0 l-34 14" stroke="#FFE9A8" stroke-width="3" stroke-linecap="round" opacity=".55"/>'
      + '<path d="M0 0 l-18 7" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity=".9"/>'
      + wStar(2, -1, 4.4, '#FFFFFF') + '</g>').join('') + '</g>', front: '' };
  }
  if (id === 'motes') {
    return { back: '', front: '<g class="petfx" fill="#FFE9A8">' + [0, 1, 2, 3, 4, 5, 6].map((i) =>
      '<circle class="fxrise" cx="' + (20 + i * 14) + '" cy="114" r="' + (2.2 + (i % 3) * 0.9) + '" opacity=".95" style="animation-delay:' + (i * 620) + 'ms"/>').join('') + '</g>' };
  }
  if (id === 'petals') {
    return { back: '', front: '<g class="petfx">' + [0, 1, 2, 3, 4, 5, 6].map((i) =>
      '<ellipse class="fxfall sway" cx="' + (14 + i * 15) + '" cy="-8" rx="' + (4.4 + (i % 2) * 1.4) + '" ry="2.8" fill="' + (i % 2 ? '#FFF0F5' : '#F7A9C6') + '" opacity=".97" style="animation-delay:' + (i * 700) + 'ms"/>').join('') + '</g>' };
  }
  if (id === 'fireflies') {
    return { back: '', front: '<g class="petfx">' + [0, 1, 2, 3, 4].map((i) =>
      '<g class="fxwander" style="animation-delay:' + (i * 900) + 'ms">'
      + '<circle cx="' + (20 + i * 21) + '" cy="' + (48 + (i % 3) * 24) + '" r="3" fill="#FFFBE8"/>'
      + '<circle cx="' + (20 + i * 21) + '" cy="' + (48 + (i % 3) * 24) + '" r="8" fill="#FFE9A8" opacity=".3"/></g>').join('') + '</g>' };
  }
  if (id === 'runering') {
    const runes = [0, 45, 90, 135, 180, 225, 270, 315].map((ang) =>
      '<rect x="-2.4" y="-42" width="4.8" height="10" rx="2" fill="#C9B0EA" transform="rotate(' + ang + ')"/>').join('');
    return { back: '<g class="petfx" transform="translate(60,108)">'
      + '<ellipse cx="0" cy="0" rx="46" ry="13" fill="#C9B0EA" opacity=".18"/>'
      + '<ellipse cx="0" cy="0" rx="46" ry="13" fill="none" stroke="#9E82D2" stroke-width="2.2" opacity=".8"/>'
      + '<ellipse cx="0" cy="0" rx="34" ry="9.6" fill="none" stroke="#C9B0EA" stroke-width="1.4" opacity=".7"/>'
      + '<g class="fxspin" transform="scale(1,0.3)">' + runes + '</g></g>', front: '' };
  }
  if (id === 'butterfly') {
    return { back: '', front: '<g class="petfx"><g class="fxorbit" transform="translate(60,74)">'
      + '<g transform="translate(48,0)">'
      + '<g class="fxflap"><path d="M0 0 Q-14 -15 -18 -3 Q-18 9 -3 6 Z" fill="#F7A9C6"/>'
      + '<path d="M0 0 Q14 -15 18 -3 Q18 9 3 6 Z" fill="#C9B0EA"/></g>'
      + '<ellipse cx="0" cy="1" rx="1.8" ry="6" fill="#5E4F9E"/></g></g></g>' };
  }
  if (id === 'ripple') {
    return { back: '<g class="petfx" fill="none" stroke="#9EC2F0" stroke-width="2.6">' + [0, 1, 2].map((i) =>
      '<ellipse class="fxripple" cx="60" cy="112" rx="18" ry="5" style="animation-delay:' + (i * 1100) + 'ms"/>').join('') + '</g>', front: '' };
  }
  if (id === 'shimmer') {
    return { back: '', front: '<g class="petfx"><defs><linearGradient id="fxsh" x1="0" y1="0" x2="1" y2="0">'
      + '<stop offset="0%" stop-color="#FFF7EE" stop-opacity="0"/><stop offset="45%" stop-color="#FFF3C4" stop-opacity=".55"/>'
      + '<stop offset="55%" stop-color="#F7A9C6" stop-opacity=".5"/><stop offset="100%" stop-color="#C9B0EA" stop-opacity="0"/>'
      + '</linearGradient></defs>'
      + '<rect class="fxsheen" x="-60" y="26" width="52" height="92" rx="20" fill="url(#fxsh)"/></g>' };
  }
  return none;
}
