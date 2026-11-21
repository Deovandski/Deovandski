# Reusable components

Components in this folder are built to be copied into other projects as they are. Each one is a
single `.astro` file (plus a folder for any font or image it needs). It takes everything as props,
imports nothing from this site, and themes itself with CSS custom properties. It also works when
used several times on one page. See the componentization rule in [CLAUDE.md](../../../CLAUDE.md).

| Component | What it is | Used on |
|---|---|---|
| [SplitFlap.astro](SplitFlap.astro) | Split-flap (Solari board) display for a number or short word. It flips into place the first time it scrolls into view. | MTG tab (Win vs Loss) |
| [LedClock.astro](LedClock.astro) + [fonts/](fonts/) | Countdown in red LED digits: years, days, hours, minutes, seconds. It blinks and shows a message at zero. | Death tab |
| [EasterEggBanner.astro](EasterEggBanner.astro) | A hidden banner (picture, title, message, Close) that your script shows when a visitor does something. In the page, or floating at the bottom of the screen. | Lust tab (Ara ara~ / didn't take the bait), the 10- and 20-facets easter eggs |
| [IconMeter.astro](IconMeter.astro) | A quantity shown as a row of icons, with the last one partly filled (650 lb ÷ 500 lb per cow = 1.3 cows). | Churrasco tab (cow-meter) |
| [OrgChart.astro](OrgChart.astro) | A top-down organization chart. Each row of people or roles is joined to the row above, with optional portraits. | Churrasco tab (The Holy Order) |
| [RouteMap.astro](RouteMap.astro) | A map that joins places with a curved great-circle line, kept inside the area you choose, with pinch and button zoom. Leaflet plus your own outline file: no API key, no tile server, no tracking. | Family tab (Itaituba → Fargo) |
| [PhotoGrid.astro](PhotoGrid.astro) | A grid of square photo cards, each captioned with a short description or the date the photo was taken (`--/--/----` when unknown). Photos carry data attributes for one shared lightbox. | Pets, Fishing, Family (descriptions), Painting/Drawing (dates) |
| [QrCode.astro](QrCode.astro) | A QR code drawn as SVG when the site builds (no JavaScript in the browser), with an optional title above it and the encoded link below it. | QR Code page (`/qr/`) |
| [VhsPile.astro](VhsPile.astro) | A pile of VHS tapes holding a number of hours of video. Visitors pick the recording speed (SP, LP, EP) and the tapes fall from the top and pile up; they shrink to fit, so it can show a couple of thousand. Canvas, no libraries. | BOTW tab (watch time) |
| [PaperPlane.astro](PaperPlane.astro) | Fold a paper plane, then throw it: precision decides the distance | Aviation tab |
| [StageDancer.astro](StageDancer.astro) | A chibi pixel character (drawn in code, colours as props) dancing the Saturday Night Fever routine under spotlights, a mirror ball and a light-up floor. | Concert tab |
| [IsoDarts.astro](IsoDarts.astro) | An on-rails darts scene in an isometric room: scripted speech bubbles, then a timed round on a board of coloured territories (claim, cancel, smaller is worth more) with a swaying aim. | Board Games tab (Territory Snipping) |
| [IsoFarm.astro](IsoFarm.astro) | A Colheita Feliz-style farming loop: isometric plots, seeds with timers and random harvests, fertilizer, energy and a market. The whole economy is one config object; saves in the browser. | Mentor tab (the Balls farm) |
| [DinoAmbush.astro](DinoAmbush.astro) | The endless-runner dino, reversed: the dino dodges on its own, you spend mana throwing cactus, birds, rocks and dinos at it. Win or get flipped off. | Gamer tab |
| [PixelPet.astro](PixelPet.astro) | A little virtual pet in an egg-shaped handheld: feed, pet, play and clean up poop. Drawn from shapes on a 32×32 pixel grid; saves in the browser. | Pets tab (Bidu, Fluffy, Peeta) |
| [KitKot.astro](KitKot.astro) | A parody social app idle game on a phone: post for views, likes and followers on a slot-machine schedule (near misses, a hidden hot post type, fatigue, streaks, energy). "Under the hood" names each trick, with sources. | Influencer tab |
| [FireMeter.astro](FireMeter.astro) | A fireplace with bellows and a meter: each pump grows the fire, climbs the meter and shows a phrase for that level; maxing out "bonks" and resets. | Lust tab (ecchi-meter) |
| [WhackAMole.astro](WhackAMole.astro) | Whack-a-mole in the corners of the screen: a character pops up, you whack it (click, tap or keys 1–4) before it hides, faster and faster for 30 s. | Miku tab (Whack-a-Miku) |
| [DrawingPad.astro](DrawingPad.astro) | A surface to draw on with a pen: ink colours, needle sizes, eraser, clear and download. Ships as a tattoo practice skin; the surface, colours and sizes are props. | Tattoo tab |
| [DrumKit.astro](DrumKit.astro) | A drum kit seen from above: tap or click (multi-touch) or use the keyboard. Sounds made with the Web Audio API, no samples. | Musician tab |

## SplitFlap

```astro
---
import SplitFlap from './reusable/SplitFlap.astro';
---
<SplitFlap value={1} digits={2} label="Wins" size="lg" />
<SplitFlap value={650} label="lb of beef grilled" separator="," />
<SplitFlap value="GATE 9" size="sm" />
```

| Prop | Default | |
|---|---|---|
| `value` | (required) | A number or short text. Text is shown in capitals. |
| `digits` | `0` | Minimum number of tiles; shorter values are padded on the left. |
| `pad` | `"0"` for numbers, `" "` for text | The padding character. |
| `label` | none | Caption under the tiles, also read out by screen readers. |
| `size` | `"md"` | `"sm"`, `"md"` or `"lg"`. |
| `separator` | none | Thousands separator for numbers, e.g. `","`. |
| `animate` | `true` | `false` skips the flip. Reduced-motion visitors never see it. |
| `class` | none | Extra class, e.g. to theme it. |

Theme it from outside: `.my-board :global(.split-flap) { --split-flap-ink: gold; }`. The available
properties are `--split-flap-size`, `--split-flap-ink`, `--split-flap-tile`, `--split-flap-tile-2`,
`--split-flap-hinge` and `--split-flap-label`.

## LedClock

```astro
---
import LedClock from './reusable/LedClock.astro';
---
<LedClock
  target="2076-03-09T03:39:39-05:00"
  label="Time left until March 9, 2076, 3:39:39 AM Central"
  caption="Counting down to March 9, 2076, at 3:39:39 AM."
  expired="Time's up!"
  preview="deathclock"
/>
```

| Prop | Default | |
|---|---|---|
| `target` | (required) | ISO date with its UTC offset. |
| `label` | (required) | What screen readers announce. |
| `caption` | none | Line under the clock. |
| `expired` | none | Shown instead of the caption at zero. |
| `preview` | none | URL parameter name; `?<name>=0` shows the zero state. |
| `class` | none | Extra class. |

Theme it from outside with `--led-clock-ink`, `--led-clock-glow` and `--led-clock-size`. Copy the
`fonts/` folder too: the clock needs DSEG7 Classic (SIL Open Font License, see
[fonts/README.md](fonts/README.md)).

## EasterEggBanner

```astro
<EasterEggBanner name="ara-ara" image={url('/ara-ara.webp')} imageWidth={159} imageHeight={229}
  title="Ara ara~ That's the first thing you click?">
  <p>Don't worry. You're human and curious.</p>
</EasterEggBanner>
```

It starts hidden. Show it from your own script by name, and its picture downloads only then:
`document.querySelector('[data-egg="ara-ara"]').hidden = false;`

| Prop | Default | |
|---|---|---|
| `name` | (required) | The name your script uses: `data-egg="<name>"`. |
| `image`, `imageWidth`, `imageHeight` | (required) | The picture (often a GIF) and its size. |
| `imageAlt` | `""` | Leave empty when the picture is decoration. |
| `title` | (required) | The headline. The message goes inside the tag. |
| `floating` | `false` | Pin it to the bottom of the screen. It then takes keyboard focus and closes with Escape. |
| `closeLabel` | `"Close"` | Text on the button. |
| `class` | none | Extra class. |

Theme it with `--egg-accent`, `--egg-accent-2`, `--egg-bg` and `--egg-ink`.

## IconMeter

```astro
<IconMeter value={650} per={500} icon="🐄" unit="cow" units="cows" label="Cow-meter" />
```

| Prop | Default | |
|---|---|---|
| `value` | (required) | The amount, e.g. pounds of beef. |
| `per` | (required) | How much one icon stands for. |
| `icon` | (required) | An emoji or single character. |
| `unit` / `units` | (required) / `unit + "s"` | Names for the readout ("≈ 1.3 cows"). |
| `label` | none | Small heading above the icons. |
| `note` | none | Extra line under the readout. |
| `decimals` | `1` | Decimal places in the readout. |
| `maxIcons` | `40` | Most icons drawn; the readout still shows the full number. |
| `class` | none | Extra class. |

The icons fill in the first time the meter scrolls into view. Theme it with `--icon-meter-size`,
`--icon-meter-ghost`, `--icon-meter-accent` and `--icon-meter-muted`.

## OrgChart

```astro
<OrgChart
  title="The team"
  levels={[
    [{ title: 'Ada', subtitle: 'Lead', text: 'Runs the show.', image: adaPhoto, imageAlt: 'Ada smiling' }],
    [{ title: 'Grace', subtitle: 'Backend' }, { title: 'Linus', subtitle: 'Kernel' }],
  ]}
/>
```

| Prop | Default | |
|---|---|---|
| `levels` | (required) | Rows from the top down. Each row is a list of `{ title, subtitle?, text?, image?, imageAlt? }`. `image` is an imported image. |
| `title` | none | Name of the chart, for screen readers (shown when `showTitle`). |
| `showTitle` | `false` | Show the title above the chart. |
| `inlineMarkdown` | `false` | Allow `**bold**` and `*italic*` in `text`. |
| `class` | none | Extra class. |

Theme it with `--org-chart-line`, `--org-chart-card`, `--org-chart-border`, `--org-chart-ink`,
`--org-chart-accent`, `--org-chart-muted`, `--org-chart-font-title` and `--org-chart-gap`.

## RouteMap

```astro
<RouteMap
  outlines={url('/world.json')}
  points={[
    { name: 'Itaituba, Pará', lat: -4.2761, lng: -55.9836 },
    { name: 'Fargo, North Dakota', lat: 46.8772, lng: -96.7898 },
  ]}
  bounds={[[-56, -128], [62, -32]]}
  label="Map: from Itaituba, Pará, Brazil, to Fargo, North Dakota, USA"
/>
```

| Prop | Default | |
|---|---|---|
| `outlines` | (required) | URL of a GeoJSON file of country or land outlines. This site serves Natural Earth at `/world.json` (`src/pages/world.json.ts`). |
| `points` | (required) | The places in order, `{ name, lat, lng }`. Each pair is joined by a curved line. |
| `bounds` | (required) | The area to show and stay inside: `[[south, west], [north, east]]`. You can't zoom out past it. |
| `label` | (required) | What screen readers hear. The place names are listed for them too. |
| `caption` | none | Line under the map. |
| `height` | tall box | CSS height of the map. Set the width with the element around it. |
| `attribution` | `"Outlines: Natural Earth"` | Credit in the corner. |
| `class` | none | Extra class. |

Needs `leaflet` from npm. The map builds itself the first time it's visible, so it works inside
hidden tabs. Scroll-wheel zoom turns on only after a click, so it never takes over page scrolling;
pinch and the +/− buttons always work. Theme it with `--route-map-sea`, `--route-map-land`,
`--route-map-border`, `--route-map-line`, `--route-map-pin`, `--route-map-label-bg` and
`--route-map-label-ink`.

## PhotoGrid

```astro
---
import PhotoGrid from './reusable/PhotoGrid.astro';
---
<PhotoGrid photos={[{ src: catJpg, alt: 'Peeta in a box' }]} name="cat" caption="text" empty="Photos are on their way." />
<PhotoGrid photos={[{ src: paintingJpg, alt: 'Painting', date: '2013-01-15' }]} name="painting" caption="date" />
```

| Prop | Default | |
|---|---|---|
| `photos` | (required) | `{ src, alt, date?, dateLabel? }[]`: `src` an imported image, `alt` what's in it, `date` the ISO day it was taken (`null` = unknown), `dateLabel` text shown instead when the date is only approximate (e.g. `"Circa Q1 2013"`). |
| `name` | (required) | Groups the photos for the page's lightbox (`data-gallery`). |
| `caption` | `"none"` | `"text"` shows `alt` above each photo; `"date"` shows the date as MM/DD/YYYY. |
| `intro` | `[]` | Paragraphs shown above the grid. |
| `empty` | none | Shown when there are no photos. |
| `unknownDate` | `"--/--/----"` | What a `"date"` caption shows when the date isn't known. Screen readers hear "date unknown". |
| `class` | none | Extra class, e.g. to theme it. |

Each photo is a `<button>` with `data-gallery`, `data-index`, `data-full` (a large webp), `data-alt`
and `data-caption`: the page brings its own lightbox (this site's is the `.viewer` dialog in
`src/pages/index.astro`). Theme it from outside with `--photo-grid-card-border`,
`--photo-grid-card-bg`, `--photo-grid-tile-bg`, `--photo-grid-caption`, `--photo-grid-empty` and
`--photo-grid-min`. Extracted from this site's old `Gallery.astro`; it doesn't read dates itself,
so pass them in (this site uses `src/lib/photoDate.ts`: EXIF, then the filename).


## Copying a component into another repo

1. Copy the `.astro` file (and its asset folder) into that repo's reusable components folder.
2. Add a row to that repo's list of reusable components saying where it was copied from (for
   example, "from Deovandski/Deovandski `src/components/reusable/`").
3. Improvements go back to the source too, so the copies don't drift apart.

## QrCode

```astro
---
import QrCode from './reusable/QrCode.astro';
---
<QrCode value="https://deovandski.github.io/Deovandski/" title="Website" />
<QrCode value="mailto:someone@example.com" title="Email" showValue={false} />
```

Needs the `qrcode` npm package (`npm install qrcode`). Phones scan dark-on-light codes best, so keep
`--qr-dark` dark and `--qr-light` light.

| Prop | Default | |
|---|---|---|
| `value` | (required) | Text to encode: a URL, `mailto:`, `tel:` or plain text. |
| `title` | none | Heading above the code. |
| `label` | `"QR code for <value>"` | What screen readers hear for the code. |
| `showValue` | `true` | Show the encoded text under the code (a link when it's a URL, `mailto:` or `tel:`). |
| `level` | `"M"` | Error correction: `"L"`, `"M"`, `"Q"` or `"H"`. |
| `headingLevel` | `2` | Heading tag for the title, 2 to 6. |

Theme with `--qr-dark` (modules, default `#000`), `--qr-light` (tile, default `#fff`), `--qr-size`
(default `min(78vw, 320px)`), `--qr-title-color` and `--qr-value-color`.

## VhsPile

```astro
---
import VhsPile from './reusable/VhsPile.astro';
---
<VhsPile hours={2331.6}>
  <p>About 2,332 hours of Best of the Worst.</p>
</VhsPile>
<VhsPile hours={40} mode="LP" summary="{tapes} tapes in {name}" />
```

| Prop | Default | |
|---|---|---|
| `hours` | (required) | Total hours of video. |
| `modes` | T-120: SP 2 h, LP 4 h, EP 6 h | Recording speeds: `{ key, name, hours }`, with hours per tape. |
| `mode` | the first one | Key of the speed picked at first. |
| `label` | `"Recording speed"` | Legend of the speed picker. |
| `summary` | `"That's {tapes} VHS tapes recorded in {mode} ({perTape} hours per tape)."` | Line under the pile. `{tapes}`, `{mode}`, `{name}` and `{perTape}` are filled in; it's announced when the speed changes. |
| `locale` | `"en-US"` | Number formatting. |
| `class` | none | Extra class, e.g. to theme it. |
| slot | none | Text under the pile, above the summary. |

The tapes fall every time the pile comes into view (opening its tab counts). People who prefer reduced
motion see the finished pile. Theme with `--vhs-pile-height` (default `clamp(220px, 38vw, 360px)`),
`--vhs-pile-accent`, `--vhs-pile-text`, `--vhs-pile-muted`, `--vhs-pile-border` and `--vhs-pile-bg`.

## PaperPlane

Fold a paper plane in five real 2D folds, then throw it with a slingshot drag. Each fold is scored by
how close the corner lands to its target; crisp folds glide further, sloppy ones wobble, and uneven
left/right folds pull it up or down. The personal best is kept in this browser (`localStorage`).
Made for the Aviation tab (#187).

```astro
<PaperPlane />
```

| Prop | Default | What it does |
|---|---|---|
| `title` | `"Fold it, throw it"` | Heading above the canvas |
| `saveKey` | `"paper-plane-best"` | `localStorage` key for the personal best |

Theming: `--plane-accent`, `--plane-text`. Keyboard: arrows move the corner and Enter creases; when
throwing, up/down set the angle, left/right the power, Space throws.

## StageDancer

```astro
---
import StageDancer from './reusable/StageDancer.astro';
---
<StageDancer label="Chibi Deo dancing" />
<StageDancer outfit={{ robe: '#d33', pattern: '#fff' }} bpm={120} />
```

| Prop | Default | |
|---|---|---|
| `outfit` | yellow king's robes, blue pattern, black-and-gold crown hat | Colours: `{ hat, hatTrim, skin, beard, robe, pattern, hem, boots }`. |
| `bpm` | `110` | Dance tempo; one pose per beat. |
| `label` | (describes the scene) | What's on screen, for screen readers. |
| `class` | none | Extra class. |

A chibi pixel character drawn in code, dancing a 12-beat disco routine (the Saturday Night Fever point up
and down, hip rolls, a turn and a finish) under sweeping spotlights, a mirror ball and a light-up floor.
Buttons pause the dance and change the light colours. Lights change on the beat (under 3 a second).
Reduced motion: a still point pose with steady lights. Theme with `--dancer-accent`.

## IsoDarts

```astro
---
import IsoDarts from './reusable/IsoDarts.astro';
import game from '../../content/territory-snipping.json';
---
<IsoDarts game={game} title="Territory Snipping" />
```

| Prop | Default | |
|---|---|---|
| `game` | (required) | `players` (`you` and `rival`: `{ name, color, feather }`), `dartsPerPlayer`, `roundSeconds` and `script`: `[{ who: 'you' \| 'rival', text, do? }]`. |
| `title` | `"Darts"` | Heading of the scene. |
| `class` | none | Extra class. |

An on-rails darts scene in an isometric room: speech bubbles walk through the script, and `do` triggers a
step after a line: `warmup` (the rival's first dart falls, the second lands on green), `practice` (one
throw that flies low), `hiromiMiss` (the rival aims at green, hits purple), `round` (both throw at once
until the darts or time run out) and `end` (the score). The round board's territories: a dart claims
one, a dart where the other player's dart is cancels both, and smaller territories are worth more (yellow
centre 10, inner ring 5, middle 3, outer 1). The visitor's aim sways more with every throw; Space or
Enter throws. Theme with `--darts-accent` and `--darts-text`.

## IsoFarm

```astro
---
import IsoFarm from './reusable/IsoFarm.astro';
import farm from '../../content/mentor-farm.json';
---
<IsoFarm config={farm} saveKey="balls-farm" title="The Balls farm" />
```

| Prop | Default | |
|---|---|---|
| `config` | (required) | The whole economy (below). |
| `saveKey` | `"iso-farm"` | `localStorage` key; one per farm. |
| `title` | `"Farm"` | Heading. |
| `waste` | `"shit"` | Id of the bad harvest that doubles as fertilizer. |
| `class` | none | Extra class. |

`config`: `plots` (number of plots), `energy` `{ max, perSecond }`, `fertilizer` `{ shift, max }` (each
waste put on a growing crop moves `shift` of the odds from bad outcomes to good ones, up to `max` per
crop), `trades` `[{ give, count, get }]` (the market, and how the score values each currency), and
`seeds` `[{ id, ball, crop, colors: { main, accent, leaf }, cost, energy, seconds, outcomes: [{ weight,
give, bad? }] }]`. The crop drawings are built in for the ids `pearl`, `amethyst`, `aquamarine` and
`sapphire` (a radish, grapes, a melon and a rose); other ids get the rose. Crops keep growing while the
page is closed; the outcome is rolled the moment a crop is ripe, and a bad one shows as a wilted plant.
Theme with `--farm-accent`, `--farm-soil`, `--farm-grass` and `--farm-text`.

## DinoAmbush

```astro
---
import DinoAmbush from './reusable/DinoAmbush.astro';
---
<DinoAmbush />
<DinoAmbush pool={40} win="Got it!" lose="Out of mana!" />
```

| Prop | Default | |
|---|---|---|
| `pool` | `30` | Total mana a round can earn (one per second). |
| `maxMana` | `10` | Mana that can be held at once. |
| `win` | `"Winner Winner Chicken Dinner"` | Title when the dino goes down. |
| `lose` | `"You fucking loser!"` | Title when the mana runs out. |
| `class` | none | Extra class. |

The endless-runner dino, reversed: the dino runs and dodges on its own (jumps ground obstacles, ducks
high birds, can't jump again mid-air, fumbles now and then); you throw a cactus (2 mana), bird (3), rock
(2, fast) or another dino charging from behind (5). It often clears two close obstacles with one big
jump, so combos need timing. Once the round's mana is all earned, what's left leaks away. Keys 1 to 4. Win: a sad pixel dino. Lose: the dino
flips you off. Pauses off screen. Theme with `--dino-color` (the dino, green by default), `--dino-accent`,
`--dino-ink` and `--dino-bg`.

## PixelPet

```astro
---
import PixelPet from './reusable/PixelPet.astro';
---
<PixelPet name="Bidu" saveKey="bidu" color="#2f6fd6" shapes={[
  { t: 'ellipse', cx: 16, cy: 22, rx: 9, ry: 7, c: '#c8925a' },
  { t: 'rect', x: 15, y: 15, w: 2, h: 1, c: '#222' },
  { t: 'poly', pts: [[9, 10], [11, 5], [14, 9]], c: '#333' },
  { t: 'px', pts: [[13, 12], [19, 12]], c: '#111' },
]} />
```

| Prop | Default | |
|---|---|---|
| `name` | (required) | The pet's name, used in the text. |
| `shapes` | (required) | The drawing on a 32×32 grid: `ellipse` `{ cx, cy, rx, ry }`, `rect` `{ x, y, w, h }`, `poly` `{ pts }`, `px` `{ pts }`, each with a colour `c`. Later shapes paint over earlier ones; a black outline is added. |
| `color` | `"#2f6fd6"` | The device's shell colour. |
| `saveKey` | the name | Key to save progress under (one per pet). |
| `outline` | `"#111"` | Outline colour, or `"none"`. |
| `class` | none | Extra class. |

An egg-shaped handheld with an LCD-style screen and four buttons: Feed, Pet, Play, Clean. Hunger and
happiness (4 hearts each) drop over real time, even while the page is closed (a heart every 4 and 5
minutes), and poop appears every 3 minutes (up to 3; it makes the pet sad faster). A neglected pet looks
sad but never dies. Saved in `localStorage` under `pixel-pet:<saveKey>`. Theme the screen with `--pet-lcd`.

## KitKot

```astro
---
import KitKot from './reusable/KitKot.astro';
---
<KitKot name="Deovandski Skibinski Junior" handle="deovandski" />
```

| Prop | Default | |
|---|---|---|
| `name`, `handle` | (required) | The profile on the phone. |
| `bio` | `"Posting into the void"` | Line under the name. |
| `start` | `{ following: 39, followers: 39, likes: 39, views: 3900 }` | Numbers at the start. |
| `energyMax` | `10` | Energy bars (1 per post, 1 back per second). |
| `class` | none | Extra class. |

A parody social app ("KitKot") on a phone: four post buttons roll for views, likes and followers on a
variable schedule, with near misses (about 30% of the losses), a secretly "hot" post type that changes,
audience fatigue that turns into losing followers, streaks that warn before they die, likes that drip in,
a fake "Trending" badge and a moving follower goal. "Under the hood" explains each trick as it fires,
with sources. "Log off and touch grass" shows how long you spent and resets. Nothing is saved. Theme with
`--kk-accent`, `--kk-accent-2` and `--kk-bg`.

## FireMeter

```astro
---
import FireMeter from './reusable/FireMeter.astro';
---
<FireMeter label="Ecchi-meter" stages={[
  { name: 'Warm', phrases: ['Kyaa~! (⁄ ⁄>⁄ ▽ ⁄<⁄ ⁄)'] },
  { name: 'Hot', phrases: ['Ara ara~ (◕‿◕✿)'], bonk: 'BONK! Go to horny jail.' },
]} />
```

| Prop | Default | |
|---|---|---|
| `stages` | (required) | Levels from coldest to hottest: `{ name, phrases[], bonk? }`. The last stage's `bonk` shows when the meter maxes out, then the fire resets. |
| `label` | `"Heat"` | Name of the meter. |
| `button` | `"Pump the bellows"` | Text on the bellows button. |
| `pump` | `7` | Heat added per pump (0–100). |
| `cooling` | `5` | Heat lost per second. |
| `class` | none | Extra class. |

A fireplace, a pair of bellows and a thermometer-style meter. Each pump grows the fire and shows a random
phrase from the current level; the fire cools when left alone. Theme with `--fire-accent`, `--fire-hot`,
`--fire-text` and `--fire-bg`.

## WhackAMole

```astro
---
import WhackAMole from './reusable/WhackAMole.astro';
import sprite from '../../assets/whack-a-miku/whack-a-miku.png';
---
<WhackAMole sprite={sprite} name="Miku" title="Whack-a-Miku" bonusDays={['03-09', '08-31']} />
```

| Prop | Default | |
|---|---|---|
| `sprite` | (required) | The character, as an imported image. Pixel art is drawn crisp. |
| `name` | `"mole"` | What to call it in the text ("You whacked 12 Mikus"). |
| `title` | `"Whack-a-mole"` | Heading of the card. |
| `seconds` | `30` | Length of a round. |
| `bonusDays` | `[]` | Dates (`"MM-DD"`) when every whack counts double. |
| `spriteAlt` | `"<name> popped up"` | Text for screen readers when it pops up. |
| `class` | none | Extra class. |

Press Start: the character pops up in the corners of the screen, staying about 1.4 s at first and 0.6 s by
the end, more and more often. Click, tap, or keys 1 to 4 (top left, top right, bottom left, bottom right).
Leaving the tab ends the round. Theme with `--wam-accent`, `--wam-pop`, `--wam-size`, `--wam-bg` and
`--wam-text`. Reduced motion: no sliding or squashing, and pop-ups stay longer.

## DrawingPad

```astro
---
import DrawingPad from './reusable/DrawingPad.astro';
---
<DrawingPad />
<DrawingPad surface="paper" tones={[]} inks={['#222', '#c00']} label="Sketch pad" />
```

| Prop | Default | |
|---|---|---|
| `surface` | `"skin"` | `"skin"` (a forearm-shaped practice skin) or `"paper"` (a rounded sheet). |
| `tones` | five skin tones | Surface colours to pick from; the first is used at the start. `[]` hides the picker. |
| `inks` | black, red, blue, green, purple | Ink colours. |
| `needles` | fine line, bold line, shading | `{ name, size, alpha }`: line width in px and how see-through the ink is. |
| `label` | (describes the pad) | What the pad is, for screen readers. |
| `fileName` | `"tattoo-practice.png"` | Name of the downloaded PNG. |
| `class` | none | Extra class. |

Ink stays inside the surface, strokes are smoothed, and pen pressure widens the line. Tools: laser removal
(eraser), fresh skin (clear) and download. Nothing is saved or sent anywhere. Theme with `--pad-accent`,
`--pad-bg` and `--pad-text`.

## DrumKit

```astro
---
import DrumKit from './reusable/DrumKit.astro';
---
<DrumKit />
<DrumKit label="Practice kit" keys={false} />
```

| Prop | Default | |
|---|---|---|
| `label` | `"Drum kit"` | Name of the kit, for screen readers. |
| `keys` | `true` | Show each piece's keyboard key on it. |
| `class` | none | Extra class. |

A kit seen from above: crash, ride, hi-hat (closed and open), two toms, snare, floor tom and kick. Hits
fire on pointer down, so several fingers play at once. Sounds are synthesized with the Web Audio API
(no sample files). Keys: A hi-hat, Q open hi-hat, S snare, D/F toms, G floor tom, X kick, W crash, E ride;
they only play while the kit is visible. Theme with `--drum-shell`, `--drum-head`, `--drum-metal`,
`--drum-bg` and `--drum-text`.
