# Pet wardrobe: layered outfits, collections and backdrops

Date: 2026-09-19
Status: approved, ready for an implementation plan

## Why

Players say dressing the companion is boring. The cause is structural, not
cosmetic: `PET_WEARS` holds **nine items in a single slot**, so putting on a hat
takes off the jumper. There is no combination to discover and nothing to come
back for. A second problem is commercial: every paid pet item is gated on
`proOn()`, so **Nabu Plus subscribers can see the wardrobe but own none of it**.

## Scope

1. One `wear` slot becomes **seven outfit slots**, worn together.
2. Roughly **69 items in nine named collections**, tiered free / Plus / Pro.
3. A **backdrop layer** over the existing homes: 9 homes x 10 skies = 90 scenes.
4. A **new wardrobe screen** replacing the flat four-tab sheet.
5. Pet gating moves from `proOn()` to a three-way tier, so Plus gains a wardrobe.

Out of scope: new billing SKUs, new pet kinds, new homes, changes to feeding,
praying, playing or grooming.

## Platforms

One codebase covers all three. The website (`src/*.js` then `build.py` then
`index.html`) is the only thing that changes. Android is `app.nabutarot.twa`, a
Trusted Web Activity that opens nabutarot.com full screen and holds no app code,
so it needs **no bundle rebuild and no Play review**. iOS has no native app; it
is the PWA, so it needs **no App Store submission**. See the
`nabu-play-billing` skill: content changes ship on a normal website push.

## 1. Data model

### Slots

Seven slots, listed in SVG draw order (first drawn is furthest back):

| slot | icon | drawn | needs legs |
|---|---|---|---|
| `back` | wings | behind the companion | no |
| `bottom` | trousers | over the legs | **yes** |
| `top` | shirt | chest and shoulders | no |
| `shoes` | shoe | on the feet | **yes** |
| `neck` | ribbon | at the throat | no |
| `face` | glasses | over the face | no |
| `head` | crown | over the head | no |

### Per-kind slot gating

**11 of the 18 pet kinds carry `feet: false`** - the birds, the shelled
creatures and the serpents. Those have no legs drawn, so `bottom` and `shoes`
are **hidden entirely** for them: not greyed out, not shown at all. The wardrobe
asks the kind's art record for `feet !== false` and renders five slots instead
of seven.

A companion whose art sets `noFace` likewise hides the `face` slot.

Consequence for the catalogue: `bottom` and `shoes` apply to only 7 of 18 pets,
so those two slots stay deliberately small (about 8 items each) and the
head / top / neck / face / back slots carry the bulk.

### Storage

    p.fit = { back:'none', bottom:'none', top:'none', shoes:'none',
              neck:'none',  face:'none',  head:'none' }

`p.wear` is removed after a one-time migration that runs the first time a pet is
read. The nine old ids map as:

| old `wear` | new slot | new id |
|---|---|---|
| `none` | - | nothing equipped |
| `scarf` | `neck` | `scarf` |
| `bell` | `neck` | `bell` |
| `crown` | `head` | `crown` |
| `hat` | `head` | `hat` |
| `jumper` | `top` | `jumper` |
| `armour` | `top` | `armour` |
| `cloak` | `back` | `cloak` |
| `wings` | `back` | `wings` |

Nobody loses what they were wearing. The migration is idempotent: it only runs
when `p.fit` is absent.

### Tiers

Items carry `tier: 'free' | 'plus' | 'pro'` instead of the boolean `pro`.

    const itemOn = (x) => x.tier === 'free' ? true
                        : x.tier === 'plus' ? plusOn()
                        : proOn();

`plusOn()` is `ACCESS.has('plus') || ACCESS.has('pro')`, so Pro keeps everything
Plus has. This is a deliberate monetisation change, approved 2026-09-19: Plus
subscribers gain access to items they cannot reach today.

As `pickFrom` does today, an item whose tier lapses falls back to nothing in
that slot rather than leaving the companion looking broken.

## 2. Catalogue

Nine collections. Counts are targets, not contracts; the plan may move an item
between slots where the drawing reads better elsewhere.

| collection | tier | items | character |
|---|---|---|---|
| Cosy Home `cosy` | 2 free, rest Plus | ~8 | knits, slippers, bobble hat |
| Lunar Festival `lunar` | Plus | ~8 | ao dai, silk sash, lantern, moon hat |
| Scholar's Study `scholar` | Plus | ~7 | scholar cap, ink robe, round glasses |
| Flower Garden `garden` | Plus | ~8 | flower crown, petal skirt, butterfly wings |
| Winter `snow` | Plus | ~8 | earmuffs, puffer coat, snow boots, goggles |
| Night Market `market` | Plus | ~7 | hoodie, sneakers, bubble-tea charm, shades |
| **Celestial** `celestial` | **Pro** | ~9 | star cloak, moon crown, comet pendant, halo |
| **Imperial Court** `imperial` | **Pro** | ~7 | dragon robe, phoenix headdress, jade collar |
| **Guardian** `guardian` | **Pro** | ~7 | gold armour, war helm, greaves, war cape |

Split: 2 free, about 44 Plus, 23 Pro. The three Pro collections are the upgrade
argument and are described as legendary in the copy.

Every item keeps the existing inline shape, with names in all three languages:

    { id:'aodai', slot:'top', col:'lunar', tier:'plus', add:4,
      name:{ vi:'Ao dai lua', en:'Silk ao dai', de:'Seidenes Ao Dai' } }

Each item needs two drawings: one at the 120x120 stage scale for `petSVG`, and
one at 60x60 for the wardrobe tile, following the existing `petWearArt` pattern.

## 3. Backdrops

The nine hand-drawn homes are **not touched**. A new `PET_SKIES` layer renders
over the home and under the companion: a tint gradient plus animated particles.

- free: `clear`, `fireflies`
- Plus: `dawn`, `dusk`, `starry`, `snow`, `sakura`, `rain`
- Pro: `aurora`, `lanterns`

Ten skies over nine homes gives 90 scenes for roughly fifteen lines of SVG each.
Stored as `p.sky`, defaulting to `clear`, and falling back to `clear` when a
tier lapses.

## 4. Economy

Today `gain()` adds a flat `+4` when anything paid is worn. With seven slots
that would become `+28`. Instead:

- **+4** for the first dressed slot
- **+2** for each further dressed slot
- **capped at +14**
- **+6 full-look bonus** when five or more slots are filled
- the sky contributes **+2** when it is not `clear`

Worst case is `+22` from clothing and sky against a base meal of 10. The
existing `PET_DAY_XP = 400` daily ceiling (in `src/luck.js`) already clamps the
total, so level pacing holds. The earn grid on the pet card gains a row for the
sky, and the wear row is relabelled to cover the whole outfit.

## 5. Wardrobe screen

Replaces the four-tab sheet for clothing. Food, home and coat keep their sheets.

It is a **full-height sheet on the pet screen, not a new route**: it reuses the
existing `.sheet` markup and close behaviour so the back button and the
backdrop tap already work, and `src/main.js` routing is left alone.

- **Live preview** at the top: the companion in its home and sky, the outfit
  updating on equip by swapping the SVG rather than redrawing the screen.
- **Slot rail**: seven (or five) round buttons, each showing a thumbnail of what
  is equipped and reading hollow when empty.
- **Collection ribbons** inside the open slot: a gradient header per collection,
  items two-up on a phone and four-up when wide, each drawn on a soft tinted
  tile with a tier badge, and a shimmer over locked ones.
- **Take it all off** and **Surprise me** - a random complete look, drawn only
  from items the visitor owns.
- **Three saved looks**: store and restore a whole `fit` object plus the sky.
  Saving is free at every tier - a look can only hold items the visitor
  already owns, so it grants nothing.
- A sparkle burst on equip.
- A locked item explains itself in place, the way `shelfsay` does now, rather
  than throwing the visitor at the price list.

Accessibility: every tile is a real button with an accessible name, the slot rail
is arrow-key navigable, and the sparkle and particle animations respect
`prefers-reduced-motion`.

## 6. Files

`src/pet.js` is 1789 lines already; this work would push it past 3000.

| file | change |
|---|---|
| `src/pet-wardrobe.js` | **new** - slots, catalogue, item art, skies, migration, XP maths |
| `src/pet-dress.js` | **new** - the wardrobe screen and its events |
| `src/pet.js` | keeps household, feeding, praying, homes, coats; loses `PET_WEARS` and `petWearArt`; `petSVG` takes a `fit` object |
| `src/play.js:598` | updated for the new `petSVG` signature |
| `src/main.js:5` | exports the new catalogue; keeps a flattened `PET_WEARS` alias so the existing probe scripts still run |
| `src/strings.js` | slot, collection and sky titles plus wardrobe copy, in vi, en and de; `petWearNote` is rewritten and `earnWear` relabelled |
| `src/shell.html` | wardrobe styles |
| `build.py` | both new files added to `FILES`, after `looks.js` |

Load order: `pet-wardrobe.js` before `pet.js`, `pet-dress.js` after it. Only
`const` initialisation is order-sensitive in the concatenated bundle, and the
catalogue is read at render time, so this is safe.

## 7. Verification

No JS unit tests exist in this repo; `test/` holds Playwright and Python layout
probes with screenshots.

- **A new probe** renders every item in every slot across three pet kinds - one
  footed, one footless, one spirit beast - and screenshots the grid. SVG
  geometry faults are only catchable by eye; the code comments record one where
  feathers came out twice their intended length.
- **Pure-function checks**: the migration covers all nine old ids and is
  idempotent; the XP cap holds at its ceiling; every item carries vi, en and de;
  every item id is unique; footless kinds expose no `bottom` or `shoes`.
- **Manual pass**: as free, as Plus and as Pro, confirm each sees the right
  locks, and the right fallbacks when a tier lapses.

## 8. Layers touched

From the sixteen-layer checklist: **3 frontend**, **5 databases and storage**
(the localStorage shape and its migration), **6 auth and permissions** (the
Plus/Pro gate), **14 testing**. Billing is untouched - no new SKUs, so no
Android bundle and no store review.
