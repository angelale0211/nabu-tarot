# Pet wardrobe: layered outfits, collections and backdrops

Date: 2026-09-19
Status: built and verified 2026-09-19 on branch feature/pet-wardrobe

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
4. A **Pro-only effects layer**: blinking stars, falling stars and eight more.
5. A **new wardrobe screen** replacing the flat four-tab sheet.
6. Pet gating moves from `proOn()` to a three-way tier, so Plus gains a wardrobe.

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

| slot | icon | drawn | anchored to |
|---|---|---|---|
| `back` | wings | behind the companion | shoulder, `bodyRX` |
| `bottom` | skirt | over the lower body | body ellipse, `bodyRY` |
| `top` | shirt | chest and shoulders | body ellipse |
| `hem` | ribbon | the bottom border of the drawing | base of the body |
| `neck` | ribbon | at the throat | `charmY` |
| `face` | glasses | over the face | `eyeY` |
| `head` | crown | over the head | head ellipse, `headY` |

**There is no footwear slot.** Shoes would need feet, and 11 of the 18 kinds
draw none. In its place `hem` decorates **the bottom border of the drawing** - a
band, a bow, trailing silk, a pedestal ring - which sits on the body ellipse and
so works on every kind. Decision taken 2026-09-19, replacing an earlier `shoes`
slot that would have been hidden for 11 kinds.

`bottom` and `hem` are distinct and layer together: `bottom` is a skirt, wrap,
hakama or sash **covering** the lower body, `hem` is the trim **along its
edge**. Neither may draw trouser legs or ankles, for the same reason.

The table above is **draw order**, which runs back to front. The wardrobe rail
shows the body **top down** instead - head, face, neck, top, bottom, hem, back -
because nobody dresses starting at the wings. `PET_SLOT_RAIL` holds that order.

### Every slot works on every kind

The art was surveyed rather than assumed. Of the 18 kinds:

- **11 draw no feet** (`feet: false`): fox, turtle, swallow, phoenix, ninetails,
  owl, toad, crane, kimquy, pegasus, eagle.
- **4 draw their own face** (`noFace: true`) in `art.front`: fox, ninetails,
  owl, eagle.
- **0 use `art.only`.** That branch exists in `petSVG` but no kind sets it, so
  every companion shares one composition: a body ellipse at `cy=88` and a head
  ellipse at `cy=56`, differing only in radii and a few offsets.

Because the composition is shared, and because `hem` replaced footwear, **no
slot needs hiding for any kind**. Items are placed against the anchors the art
already publishes - `eyeY`, `charmY`, `bodyRX`, `bodyRY`, `headY` - exactly as
the throat charm does today. A custom face moves `eyeY`, so the glasses move
with it.

This removes the per-kind slot gating an earlier draft of this spec called for,
and with it a whole class of "why can my crane not wear this" support question.

### Storage

    p.fit = { back:'none', bottom:'none', top:'none', hem:'none',
              neck:'none',  face:'none',  head:'none' }
    p.sky = 'clear'      // the backdrop, section 3
    p.fx  = 'none'       // the Pro effect, section 4

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
| Cosy Home `cosy` | 2 free, rest Plus | ~8 | knits, bobble hat, pom-pom hem |
| Lunar Festival `lunar` | Plus | ~8 | ao dai, silk sash, lantern, moon hat, gold-thread hem |
| Scholar's Study `scholar` | Plus | ~7 | scholar cap, ink robe, round glasses |
| Flower Garden `garden` | Plus | ~8 | flower crown, petal skirt, butterfly wings |
| Winter `snow` | Plus | ~8 | earmuffs, puffer coat, goggles, frost-lace hem |
| Night Market `market` | Plus | ~7 | hoodie, bubble-tea charm, shades, neon hem |
| **Celestial** `celestial` | **Pro** | ~9 | star cloak, moon crown, comet pendant, halo |
| **Imperial Court** `imperial` | **Pro** | ~7 | dragon robe, phoenix headdress, jade collar, brocade hem |
| **Guardian** `guardian` | **Pro** | ~7 | gold armour, war helm, war cape, chainmail hem |

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

## 4. Pro effects layer

Skies set the weather. **Effects are the showpiece, and they are Pro only** -
the thing that makes a subscriber's companion read as different across a room.
Stored as `p.fx`, default `none`, ten options, all `tier: 'pro'`:

| id | what it does |
|---|---|
| `none` | nothing (the default, and what a lapsed Pro falls back to) |
| `twinkle` | **blinking stars** scattered over the scene, each on its own delay |
| `shooting` | **falling stars** crossing the sky on a slow loop |
| `motes` | slow golden motes drifting upward |
| `petals` | petals falling and turning as they fall |
| `fireflies` | a few lights wandering on soft curves |
| `runering` | a ring of runes turning under the companion |
| `butterfly` | one butterfly circling the companion on a figure-of-eight |
| `ripple` | rings spreading out from the feet, as if on water |
| `shimmer` | a slow rainbow sheen passing across the whole drawing |

Rendered in **two passes** so an effect can sit both behind and in front: a
`fxBack` layer under the companion and a `fxFront` layer over it, the same
split `wornBack` / `worn` already uses in `petSVG`.

Implementation notes:

- `twinkle` reuses the existing `.twinkle` CSS animation that the homes and the
  spirit-beast sparks already share - no new animation for the commonest case.
- Everything is **CSS animation on SVG nodes**, never a JS timer, so it costs
  nothing when the tab is hidden and does not fight the existing pat-and-stroke
  handlers.
- Hard ceiling of **12 animated nodes** per effect. The comments in `petSVG`
  record that an earlier drop-shadow forced the whole drawing to rasterise and
  went soft as soon as it moved; effects must not reintroduce that, so no
  `filter`, no `backdrop-filter`, and no animation of anything but `transform`
  and `opacity`.
- Every effect is disabled under `prefers-reduced-motion`, which leaves the
  static form of it (the stars still there, simply not blinking).
- `aria-hidden` throughout: an effect is decoration and must not be announced.

Effects are chosen on their own tab in the wardrobe, next to the sky. For a free
or Plus visitor the tab still lists all ten, locked, because seeing what Pro
looks like is the argument for it.

## 5. Economy

Today `gain()` adds a flat `+4` when anything paid is worn. With seven slots
that would become `+28`. Instead:

- **+4** for the first dressed slot
- **+2** for each further dressed slot
- **capped at +14**
- **+6 full-look bonus** when five or more slots are filled
- the sky contributes **+2** when it is not `clear`
- a Pro effect contributes **+3** when it is not `none`

Worst case is `+25` from clothing, sky and effect against a base meal of 10. The
existing `PET_DAY_XP = 400` daily ceiling (in `src/luck.js`) already clamps the
total, so level pacing holds. The earn grid on the pet card gains a row for the
sky and one for the effect, and the wear row is relabelled to cover the whole
outfit.

## 6. Wardrobe screen

Replaces the four-tab sheet for clothing. Food, home and coat keep their sheets.

It is a **full-height sheet on the pet screen, not a new route**: it reuses the
existing `.sheet` markup and close behaviour so the back button and the
backdrop tap already work, and `src/main.js` routing is left alone.

- **Live preview** at the top: the companion in its home and sky, the outfit
  updating on equip by swapping the SVG rather than redrawing the screen.
- **Slot rail**: seven round buttons - the same seven for every kind - each
  showing a thumbnail of what is equipped and reading hollow when empty, plus
  two scene tabs for **sky** and **effect**.
- **Collection ribbons** inside the open slot: a gradient header per collection,
  items two-up on a phone and four-up when wide, each drawn on a soft tinted
  tile with a tier badge, and a shimmer over locked ones.
- **Take it all off** and **Surprise me** - a random complete look, drawn only
  from items the visitor owns.
- **Three saved looks**: store and restore a whole `fit` object, the sky and the
  effect.
  Saving is free at every tier - a look can only hold items the visitor
  already owns, so it grants nothing.
- A sparkle burst on equip.
- A locked item explains itself in place, the way `shelfsay` does now, rather
  than throwing the visitor at the price list.

Accessibility: every tile is a real button with an accessible name, the slot rail
is arrow-key navigable, and the sparkle and particle animations respect
`prefers-reduced-motion`.

## 7. Files

`src/pet.js` is 1789 lines already; this work would push it past 3000.

| file | change |
|---|---|
| `src/pet-wardrobe.js` | **new** - slots, catalogue, item art, skies, Pro effects, migration, XP maths |
| `src/pet-dress.js` | **new** - the wardrobe screen and its events |
| `src/pet.js` | keeps household, feeding, praying, homes, coats; loses `PET_WEARS` and `petWearArt`; `petSVG` takes a `fit` object |
| `src/play.js:598` | updated for the new `petSVG` signature |
| `src/main.js:5` | exports the new catalogue; keeps a flattened `PET_WEARS` alias so the existing probe scripts still run |
| `src/strings.js` | slot, collection, sky and effect titles plus wardrobe copy, in vi, en and de; `petWearNote` is rewritten and `earnWear` relabelled |
| `src/shell.html` | wardrobe styles |
| `build.py` | both new files added to `FILES`, after `looks.js` |

Load order: `pet-wardrobe.js` before `pet.js`, `pet-dress.js` after it. Only
`const` initialisation is order-sensitive in the concatenated bundle, and the
catalogue is read at render time, so this is safe.

## 8. Verification

No JS unit tests exist in this repo; `test/` holds Playwright and Python layout
probes with screenshots.

- **A new probe** renders every item in every slot across three pet kinds - one
  footed, one footless, one spirit beast - and screenshots the grid. SVG
  geometry faults are only catchable by eye; the code comments record one where
  feathers came out twice their intended length.
- **Pure-function checks**: the migration covers all nine old ids and is
  idempotent; the XP cap holds at its ceiling; every item carries vi, en and de;
  every item id is unique; all seven slots resolve for all 18 kinds; no item's
  art references a foot.
- **Effects pass**: each of the ten effects checked for the 12-node ceiling, for
  using only `transform` and `opacity`, for stopping under
  `prefers-reduced-motion`, and for not blurring the drawing the way the old
  drop-shadow did.
- **Manual pass**: as free, as Plus and as Pro, confirm each sees the right
  locks, and the right fallbacks when a tier lapses - clothing to nothing, sky
  to `clear`, effect to `none`.

**What was built:** `test/wardrobe_check.js` (57 pure checks, node, no browser),
`test/wardrobe_probe.py` (contact sheets of every piece on a footed, a footless
and a spirit-beast kind, plus all ten effects and all ten skies) and
`test/wardrobe_ui.py` (drives the screen at all three tiers: migration, equip,
locked-piece behaviour, sky and effect tabs, surprise-me, save and restore a
look, take it all off, close).

Three faults the probes caught that the pure checks could not:

1. The sky overlay did not carry the homes' `preserveAspectRatio="xMidYMax
   slice"`, so it was framed differently from the home it lay on and the tints
   barely registered. Every sky now matches the home's framing.
2. Capes stopped at x=20 against a body spanning x=30..90, so ten pixels showed
   and they read as a smudge. All four now run the full width behind the
   companion.
3. Effect tiles drew pale stars on a pale ground and looked empty, which made
   the one Pro-only tab look broken. They get a night sky to be drawn on.

## 9. Layers touched

From the sixteen-layer checklist: **3 frontend**, **5 databases and storage**
(the localStorage shape and its migration), **6 auth and permissions** (the
Plus/Pro gate), **14 testing**. Billing is untouched - no new SKUs, so no
Android bundle and no store review.
