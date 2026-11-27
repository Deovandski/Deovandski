# Reusable components

Components in this folder are built to be copied into other projects as they are. Each one is a
single `.astro` file (plus a folder for any font or image it needs). It takes everything as props,
imports nothing from this site, and themes itself with CSS custom properties. It also works when
used several times on one page. See the componentization rule in [CLAUDE.md](../../../CLAUDE.md).

Words a component's script writes while it runs (game messages, scores, labels it swaps) live in the page, in a
hidden `<div class="<name>__strings" hidden data-llms-skip>` of `<span data-k="key">English with {slots}</span>`.
The script reads them with a small `msg(key, vars)` helper, so a translated copy of the page translates them too,
and a project without translations just shows the English.

| Component | What it is | Used on |
|---|---|---|
| [SplitFlap.astro](SplitFlap.astro) | Split-flap (Solari board) display for a number or short word. It flips into place the first time it scrolls into view. | MTG tab (Win vs Loss) |
| [LedClock.astro](LedClock.astro) + [fonts/](fonts/) | Countdown in red LED digits: years, days, hours, minutes, seconds. It blinks and shows a message at zero. | Death tab |
| [EasterEggBanner.astro](EasterEggBanner.astro) | A hidden banner (picture, title, message, Close) that your script shows when a visitor does something. In the page, or floating at the bottom of the screen. | Lust tab (Ara ara~ / didn't take the bait), the 10- and 20-facets easter eggs, Ursu Sintasus in Around the World in 80 Gears |
| [IconMeter.astro](IconMeter.astro) | A quantity shown as a row of icons, with the last one partly filled (650 lb ÷ 500 lb per cow = 1.3 cows). | Churrasco tab (cow-meter) |
| [OrgChart.astro](OrgChart.astro) | A top-down organization chart. Each row of people or roles is joined to the row above, with optional portraits. | Churrasco tab (The Holy Order) |
| [RouteMap.astro](RouteMap.astro) | A map that joins places with a curved great-circle line, kept inside the area you choose, with pinch and button zoom. Leaflet plus your own outline file: no API key, no tile server, no tracking. | Family tab (Itaituba → Fargo) |
| [PhotoGrid.astro](PhotoGrid.astro) | A grid of square photo cards, each captioned with a short description or the date the photo was taken (`--/--/----` when unknown). Photos carry data attributes for one shared lightbox. | Pets, Fishing, Family (descriptions), Painting/Drawing (dates) |
| [QrCode.astro](QrCode.astro) | A QR code drawn as SVG when the site builds (no JavaScript in the browser), with an optional title above it and the encoded link below it. | QR Code page (`/qr/`) |
| [VhsPile.astro](VhsPile.astro) | A pile of VHS tapes holding a number of hours of video. Visitors pick the recording speed (SP, LP, EP) and the tapes fall from the top and pile up; they shrink to fit, so it can show a couple of thousand. Canvas, no libraries. | BOTW tab (watch time) |
| [PaperPlane.astro](PaperPlane.astro) | Fold a paper plane, then throw it: precision decides the distance | Aviation tab |
| [StageDancer.astro](StageDancer.astro) | A chibi pixel character (drawn in code, colours as props) dancing four disco routines (#1 the point, #2 the Night Fever line dance, #3 the hustle, #4 toe stand & point), each with its own tempo, music and difficulty, picked on a View-Master plate (ReelPicker), under spotlights, a mirror ball and a light-up floor, with a beat guide and a fever meter you fill by tapping on the beat and an optional original 8-bit disco loop. | Concert tab, Playground |
| [ReelPicker.astro](ReelPicker.astro) | A View-Master-style picker: cards around the rim of a round plate, seen through a window that shows one card and slivers of its neighbours; drag or swipe to turn the plate, it snaps to a card. Each card has a name, a detail line and an art box for a picture. | Concert tab (Saturday Night Fever routines, inside StageDancer) |
| [PlanetLap.astro](PlanetLap.astro) | How far around a planet a distance goes, Reus-style (the planet cut in half, seen side on), animated like an in-flight map: a little cyclist rides from the start flag, then the map keeps zooming in and out between the nearest places and the far ones, with a next-stop panel and distances to go, fossils under the surface, and an optional chaser that runs after the rider. | Cycling tab (from Fargo, ND), with Ursu Sintasus giving chase |
| [PhotoQuiz.astro](PhotoQuiz.astro) | Guess where a photo was taken: rounds of photos (10 by default) with multiple-choice answers, a score card, and a helper slot under it who gives one freebie per game (narrows the answers to two), chats now and then, and shares fun facts after some answers. Every word is in the page, so it gets translated. | Traveler tab (Where in the World Was Deo?, #290) |
| [PixelHammock.astro](PixelHammock.astro) | The chibi pixel character from StageDancer, chilling in a hammock between two palm trees, swaying; opens its eyes while it talks (`data-awake`). Drawn in code, outfit colours as props. | Traveler tab (the game's helper) |
| [InstallApp.astro](InstallApp.astro) | An "Install app" button for an installable site (PWA): shown only when the browser can install it right now, otherwise a short line on how (open in Chrome on Android, Share → Add to Home Screen on iPhone), and "You're using the installed app" inside the app. | Settings menu (#292) |
| [TerminalScreen.astro](TerminalScreen.astro) | An old-school computer terminal (green on black, amber headings, scan lines, blinking cursor) that types its text out one character at a time, fast. Click or any key shows it all; reduced motion shows it all at once. Copied unchanged from Deovandski-repo-template (template#19). | Stats for nerds (`/debug/`, #306) |
| [ProjectCards.astro](ProjectCards.astro) | A grid of cards, each with a screenshot (or a plain panel), a title with an optional date line, a short explainer and link buttons; the screenshot opens in the photo viewer. | Developer tab (Wizard Deo Solutions, the games, #294) |
| [ArcadeButton.astro](ArcadeButton.astro) | A big, chunky, old-school push button with one emoji on its cap and a click sound; it sinks when pressed, and as a toggle it stays down and lit while on. | Concert tab (Saturday Night Fever: music, pause, lights) |
| [YouTube.astro](YouTube.astro) | A privacy-friendly YouTube embed: nothing loads from YouTube until play is pressed, then it plays from youtube-nocookie.com; pauses itself when hidden. 16:9 videos and 9:16 Shorts. | Aviation tab, Cycling tab ("Ridin' with Peeta") |
| [MetricLab.astro](MetricLab.astro) | Years of daily numbers to slice and dice: group boxes of checkboxes (years, seasons, weekdays and weekends, the nights after an event, which kinds of event count) over five views: small-multiple timelines with a shared hover, the day after an event against the rest, a calendar heatmap, month-by-month lines per year, and a scatter of any two metrics with r. Loads its data file only when first shown. | Biomarker Lab tab (Hearth) |
| IsoDarts (moved) | An on-rails darts scene in an isometric room: scripted speech bubbles, then a timed round on a board of coloured territories (claim, cancel, smaller is worth more) with a swaying aim. | Moved to [HusbandOutWorld](https://github.com/Deovandski/HusbandOutWorld) as `site/js/iso-darts.js` and `site/css/iso-darts.css` (its Playground, Territory Snipping, #245) |
| [IsoFarm.astro](IsoFarm.astro) | A Colheita Feliz-style farming loop: isometric plots, seeds with timers and random harvests, fertilizer, energy and a market. The whole economy is one config object; saves in the browser. | Mentor tab (the Balls farm) |
| [HoursByCategory.astro](HoursByCategory.astro) | Things grouped into categories with their hours: a totals card, one bar per category, then a card per category (most first, "Show all"). A switch takes "excludable" categories (idle games) out of the total. Worked out at build time, so translated pages translate every word. | Gamer tab (Steam, Xbox and estimated hours) |
| [HoursPie.astro](HoursPie.astro) | A pie of hours by category; pressing a slice or its row opens that category's items. Worked out at build time, with and without the excludable categories. | Gamer tab (a view of Hours by category) |
| [ExplodedSphere.astro](ExplodedSphere.astro) | A sphere split into chunks (one per category, sized by hours), pulled apart and slowly turning; drag to turn it, press a chunk to split it into layers (one per item, by volume). Its own tiny SVG 3D renderer, no library. | Gamer tab (a view of Hours by category) |
| [HoursOrbits.astro](HoursOrbits.astro) | Hours as a solar system: the total is the sun, each category a planet sized by its hours with its top items as moons; press a planet to fly in and see every item as a moon. | Gamer tab (a view of Hours by category) |
| [DaysGrid.astro](DaysGrid.astro) | Hours turned into days: one square per day (24 h) of nonstop play, coloured by category and handed out to items in order, with a mark at each full year. | Gamer tab (a view of Hours by category) |
| [CartridgeShelf.astro](CartridgeShelf.astro) | One shelf per category, one cartridge per item, each as wide as its hours (one scale for all); hover pulls a cartridge out, estimated ones are dashed. | Gamer tab (a view of Hours by category) |
| [LinksMenu.astro](LinksMenu.astro) | A drop-down box of link buttons, built from groups of buttons and separators (a line, optionally with a centred heading), opened by its own Links button or by one on the page. Works as an open box without JavaScript. | Every tab's links, from the Links button right of ▶ Play: Developer, Author, Gamer, Influencer, Musician, Anime, BOTW, Death, Mentor, Lust, D&D, Aviation |
| [Breadcrumb.astro](Breadcrumb.astro) | A one-line breadcrumb trail that fits its width: the text shrinks to fit, and below a smallest size (11px) the items are cut with "…" instead (full text on hover). Drawn from `items`, or filled by a script. | The home page tab header (#266) |
| [DinoAmbush.astro](DinoAmbush.astro) | The endless-runner dino, reversed: the dino dodges on its own, you spend mana throwing cactus, birds, rocks and dinos at it. Win or get flipped off. | Gamer tab |
| [IceFlasher.astro](IceFlasher.astro) | Ice fishing with a working three-colour flasher (based on the Vexilar FL-18): the spinning-LED dial (red, orange, green), working Range, Mode and Gain knobs (press Gain for the 10 IR steps), the motor's whir and ping ticks (Web Audio), and the rod over the hole. Scroll or swipe to jig, flick hard when the rod tip flashes (phones buzz), then reel. | Fishing tab (#310) |
| [PixelPet.astro](PixelPet.astro) | A little virtual pet in an egg-shaped handheld: feed, pet, play and clean up poop. Drawn from shapes on a 32×32 pixel grid; saves in the browser. | Pets tab (Bidu, Fluffy, Peeta) |
| [KitKot.astro](KitKot.astro) | A parody social app idle game on a phone: post for views, likes and followers on a slot-machine schedule (near misses, a hidden hot post type, fatigue, streaks, energy). "Under the hood" names each trick, with sources. | Influencer tab |
| [FireMeter.astro](FireMeter.astro) | A fireplace with bellows and a meter: each pump grows the fire, climbs the meter and shows a phrase for that level; maxing out "bonks" and resets. | Lust tab (ecchi-meter) |
| [WhackAMole.astro](WhackAMole.astro) | Whack-a-mole in the corners of the screen: a character pops up, you whack it (click, tap or keys 1–4) before it hides, faster and faster for 30 s. | Miku tab (Whack-a-Miku) |
| [DrawingPad.astro](DrawingPad.astro) | A surface to draw on with a pen: ink colours, needle sizes, eraser, clear and download. Ships as a tattoo practice skin; the surface, colours and sizes are props. | Tattoo tab |
| [DrumKit.astro](DrumKit.astro) | A drum kit seen from above: tap or click (multi-touch) or use the keyboard. Sounds made with the Web Audio API, no samples. | Musician tab |
| [LedMatrix.astro](LedMatrix.astro) | A grid of round LEDs to draw on (click, drag, right-click erases, keyboard too), sized to fit the width. Starts with a stick figure and "Huehuehue" (or "Hue"). From the LED Matrix Manager site. | Painting tab |
| [DiceTray.astro](DiceTray.astro) | A row of dice (d4 to d20), each tumbling in its own sunken pit when clicked, with a Roll all button and total. Miku colours by default. | D&D tab |
| [FastTab.astro](FastTab.astro) | A collapsible section in the style of D365 F&O FastTabs: bold title, summary fields on the right while collapsed, a chevron, and optional Expand all / Collapse all buttons. Built on `<details>`, so it works without JavaScript. | Playground page (one per gimmick, titled "Name (Tab facet)" through the `title` slot) |
| [PhotoViewer.astro](PhotoViewer.astro) | The one photo viewer (lightbox) for a page: every content picture, gallery button and link to an image file opens in it, with its caption and date; ‹ › between pictures. Put it once in the layout. | Every page (in `Base.astro`) |
| [SourceList.astro](SourceList.astro) | A reading list of the people and works a page builds on ("Shoulders I stand on"): name in bold, work in italics, the idea, a link. Takes a Markdown list in its slot. | Death and Mentor tabs, inside their Links boxes |
| [PillSwitch.astro](PillSwitch.astro) | A centred pill switch between two or more views ("📺 TV shows \| 🎬 Movies"): pressing an option shows its panel and hides the others; arrow keys, Home and End move between options. | Biomarker Lab tab (inside `MetricLab`); tabs with two lists use sub-tabs in the facet tree instead (#296) |

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
| `floating` | `false` | Pin it to the bottom of the screen. It then takes keyboard focus and closes with Escape (through CloseWatcher where the browser has it, so Escape closes the banner and not a Play box behind it). |
| `closeLabel` | `"Close"` | Text on the button. |
| `class` | none | Extra class. |

Theme it with `--egg-accent`, `--egg-accent-2`, `--egg-bg` and `--egg-ink`.

## HoursByCategory

```astro
<HoursByCategory
  id="gamer"
  total={30073}
  totalLabel="hours on Steam"
  stats={[{ value: 236, label: 'games played' }]}
  categories={[
    { id: 'rpg', name: 'RPGs & open worlds', items: [{ name: 'Skyrim', value: 187 }] },
    { id: 'idle', name: 'Idle & clickers', excludable: true, note: 'Mostly left running.', items: [{ name: 'Cookie Clicker', value: 4854 }] },
  ]}
/>
```

| Prop | Default | |
|---|---|---|
| `categories` | (required) | `[{ id, name, note?, excludable?, items: [{ name, value, chips?, estimated? }] }]`. Sorted by total, items by value. `chips` are small labels on a line under the name, like `['Steam', 'Xbox']`; `estimated: true` marks the value for a footnote. |
| `id` | `"hbc"` | Prefix for element ids (the rollup links jump to `#<id>-<category id>`). Unique per page. |
| `total` | sum of every item | The big number, e.g. hours including things no category lists. |
| `totalLabel` | `"hours"` | Words under the total. |
| `stats` | `[]` | More numbers beside the total: `[{ value, label }]`. |
| `unit` | `"h"` | Unit after each number. |
| `shown` | `5` | Items per card before "Show all". |
| `rollupTitle` | `"Hours by category"` | Heading over the bars. |
| `excludeLabel` | `"Count idle categories ({value} {unit})"` | The switch, shown only when a category is `excludable`. |
| `shareLabel` / `excludedShareLabel` | `"{share} of the total"` / `"not counted in the total"` | Under each category title. |
| `notCounted` | `"not counted"` | A switched-off bar's number. |
| `countLabel` / `countLabelOne` | `"{n} items"` / countLabel | Under each category title; `countLabelOne` is used for a single item. |
| `showAll` / `showFewer` | `"Show all {n}"` / `"Show fewer"` | The card button. |
| `chipColors` | `{}` | A colour per chip label, like `{ Steam: '#66c0f4' }`. Other chips use `--hbc-chip` (default: the accent). |
| `estimatedMark` / `estimatedLabel` | `"*"` / `"estimated"` | After an estimated item's value, and what screen readers say instead. |
| `excludedByDefault` | `false` | Start with the switch off: excludable categories out of the totals. |
| `views` / `viewsLabel` / `barsLabel` | `[]` / `"See it as"` / `"Bars"` | Other views of the rollup, `[{ id, label }]`, each filled from the named slot `id`; a "See it as" switch picks one, Bars first. |
| `defaultView` | `"bars"` | The view shown first (a `views` id). Without JavaScript the bars show. |
| `locale` | `"en-US"` | How numbers are written. |

Views can follow the switch: the root carries `data-hours-scope`, plus `data-excluded` while the
switch is off, and fires `hours:excluded` (`detail.excluded`) when it flips. HoursPie,
ExplodedSphere, HoursOrbits, DaysGrid and CartridgeShelf all do; outside it, their `excluded` prop
sets the state.

```astro
<HoursByCategory categories={cats} excludedByDefault views={[{ id: 'pie', label: 'Pie' }]}>
  <HoursPie slot="pie" categories={pieCats} excluded />
</HoursByCategory>
```

Every number and label is worked out at build time, with and without the excludable categories;
the script only flips which is shown, so translated pages need nothing extra. Without JavaScript
every item shows and the switch stays hidden. Theme with `--hbc-accent`, `--hbc-chip`, `--hbc-excluded`,
`--hbc-surface`, `--hbc-border`, `--hbc-track`, `--hbc-text`, `--hbc-muted`, `--hbc-note` and
`--hbc-heading-font`.

## The views of Hours by category

HoursPie, ExplodedSphere, HoursOrbits, DaysGrid and CartridgeShelf share one data shape, so one
list feeds them all (`viewCategories()` in `src/lib/gamerCategories.ts` makes it on this site):

```ts
{ id, name, color, value, excludable?, items: [{ name, value, estimated?, chips? }], parts?: [{ name, value, count }] }
```

`parts` is for a category that folds smaller ones together ("Other"): the sphere's layers and the
orbits' moons show its parts instead of its items. Keep to eight colours or fewer, and let colour
never be the only cue: each view has a list or caption with every name and number.

| Component | Props besides `categories`, `id`, `excluded`, `unit`, `locale` | Notes |
|---|---|---|
| HoursPie | `label` ({list}), `hint`, `backLabel`, `shareLabel` ({share}), `countLabel`/`countLabelOne`, `moreLabel` ({n}), `shown` (12), `estimatedMark`/`estimatedLabel`, `chipColors` | Static SVG; the script only shows a category's list and pops its slice out. |
| ExplodedSphere | `layers` (7), `hint`, `openHint`, `backLabel`, `moreLabel`, `chunkCaption` ({name} {hours} {share}), `layerCaption`, `shareLabel`, `countLabel`/`countLabelOne`, `estimatedLabel`, `label` | Drawn each frame as SVG paths, back to front; turns only while on screen and not for reduced motion. `touch-action: pan-y` keeps the page scrolling on phones. |
| HoursOrbits | `sunLabel`, `hint`, `openHint`, `backLabel`, `planetCaption`, `moonCaption`, `countLabel`/`countLabelOne`, `moons` (24), `estimatedLabel`, `label` | Pauses under the pointer; still for reduced motion. |
| DaysGrid | `headline` ({span}), `subline` ({days}), `year`/`years`/`day`/`days` ({n}), `and` ({a} {b}), `hint`, `caption` ({n} {item} {category}), `yearMark`, `label` | Squares drawn to fit the width; a category button lights up only its days. |
| CartridgeShelf | `hint`, `countLabel`/`countLabelOne`, `estimatedLabel`, `label`, `chipColors` | Shelves drawn to fit the width, left to right in every language. |

The runtime ones read every word from the page (their lists and a hidden strings block), so
translated pages need nothing extra. Theming: `--pie-*`, `--sphere-*`, `--orbits-*`, `--days-*`,
`--shelf-*` (see the comment at the top of each file).

## LinksMenu

A drop-down box of link buttons, opened by one "Links" button, built from groups of buttons and
separators. On this site it's the standard for every tab's links ("Tab links" in CLAUDE.md).

```astro
<LinksMenu
  id="gamer-links"
  toggle="external"
  items={[
    { links: [{ href: STEAM, label: 'My profile on Steam' }, { href: XBOX, label: 'My profile on Xbox' }] },
    { separator: 'Third party trackers' },
    { style: 'secondary', links: [{ href: 'https://truesteamachievements.com/gamer/me', label: 'TrueSteamAchievements' }] },
  ]}
/>
```

| Prop | Default | |
|---|---|---|
| `id` | `"links"` | The box's id is `<id>-panel`. |
| `label` | `"Links"` | Its own button's text (`toggle="own"`), and the box's name for screen readers. |
| `items` | `[]` | In order: `{ links: [{ href, label }], style?: 'primary' \| 'secondary' }` for a row of buttons (primary filled, secondary outlined), and `{ separator: 'Heading' }` or `{ separator: true }` for a line between rows, with or without a centred heading. |
| `toggle` | `"own"` | `"own"`: it draws its own Links button, sitting in the parent's flex row with the box on a line of its own under it (the root is `display: contents`). `"external"`: no button; any button with `data-links-toggle="<id>-panel"` opens it. |

With `toggle="external"` the box announces `links:state` (`{ id, open, returnFocus }`) on `document`, so
the page's button can follow it, and `links:close` (`{}` for all, `{ id }` for one) closes it. Esc
closes it from inside. Anything in its slot goes in the box after the items, for links that need a
layout of their own (the Death and Mentor tabs put a `SourceList` there). Without JavaScript the box shows, open. Theme with `--links-accent`,
`--links-surface`, `--links-text`, `--links-muted` and `--links-line`.

## Breadcrumb

A one-line breadcrumb trail ("Deo › 🎟️ Front Row › 🎭 Theater & Opera") that fits its width. A long trail
shrinks its text to fit; if it would have to go below `minSize` pixels, it stops shrinking and cuts the items
with "…" instead: the middle items first, the root never, and a cut item shows its full text on hover. It fits
itself again whenever its width or its items change.

```astro
<Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Notes', href: '/notes/' }, { label: 'This note' }]} />
```

| Prop | Default | |
|---|---|---|
| `items` | `[]` | `{ label, href? }` in order, drawn at build time; the last is the current page. Leave it out to fill the list from a script instead. |
| `label` | `"Breadcrumb"` | The trail's name for screen readers. |
| `minSize` | `11` | The smallest text size, in pixels, before items are cut with "…". |

To fill it from a script, put `<li>` elements in its `[data-breadcrumb-list]`, each holding one `<a>`, `<button>`
or `<span aria-current="location">` (the home page does this as visitors move through the tree). Theme with
`--breadcrumb-size`, `--breadcrumb-color`, `--breadcrumb-current`, `--breadcrumb-current-font`,
`--breadcrumb-accent` and `--breadcrumb-separator`. Without JavaScript the trail still shows, cut with "…" at
full size.

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
<QrCode value="https://deovandski.com/" title="Website" />
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
<StageDancer outfit={{ robe: '#d33', pattern: '#fff' }} />
```

| Prop | Default | |
|---|---|---|
| `outfit` | yellow king's robes, blue pattern, black-and-gold crown hat | Colours: `{ hat, hatTrim, skin, beard, robe, pattern, hem, boots }`. |
| `label` | (describes the scene) | What's on screen, for screen readers. |
| `class` | none | Extra class. |

A chibi pixel character drawn in code, dancing a 12-beat disco routine (the Saturday Night Fever point up
and down, hip rolls, a turn and a finish) under sweeping spotlights, a mirror ball and a light-up floor.
Buttons pause the dance and change the light colours. Lights change on the beat (under 3 a second).
Reduced motion: a still point pose with steady lights. Theme with `--dancer-accent`.

Needs [ReelPicker.astro](ReelPicker.astro) and [ArcadeButton.astro](ArcadeButton.astro) from this folder. Its controls are three arcade buttons on top of the plate (to its left on phones): 🎵 music (on by default, starting when the stage first shows), ⏸️ pause, and 💡 change the lights (not a toggle: press it as often as you like). the routines sit on its View-Master plate (drag or
swipe to turn it; each card shows the routine's signature move). Each routine has its own tempo, 8-bit loop and
difficulty: **#1 Easy, 100 BPM; #2 Medium, 112 BPM; #3 Hard, 122 BPM; #4 Expert, 132 BPM**. Harder routines need taps
closer to the beat, and a **beat guide** on the left scrolls each beat down to a hit line, with the tap window drawn
around it.

Routines: **#1 The point** (the Saturday Night Fever point, hip rolls, a turn); **#2 The line
dance** (the "Night Fever" line dance as the 1978-79 disco books describe it: back three and clap, forward three
and clap, a turn each way, snap kick, the skate, the point with merengue hips, hand roll, funky chicken, pivot);
**#3 The hustle** (side-to-side hip bumps and rope arms); **#4 Toe stand & point** (up on the toes, finger
straight up, a lean, a kick). A **fever meter** on the right fills a little every beat and more when you tap the
stage (or press Space/Enter on it) on the beat; at 100 it hits **FEVER!** and the whole floor lights up for
8 beats. **🎵** plays the routine's own original 8-bit disco loop (Web Audio, no files; not any existing song) in
time with the dance; it stops when the dance pauses or the stage is hidden.

## ReelPicker

A View-Master-style picker. The choices are cards around the rim of a round plate; a window shows one card
fully, plus a sliver of the card before it (above) and after it (below). Drag or swipe up and down to turn the plate
anticlockwise or clockwise; it snaps to the nearest card when you let go. A tap on a peeking card turns to it, and the
▲ ▼ buttons beside the window step one card. Short lists repeat around the plate so it always has at least 8 cards.

```astro
<ReelPicker
  label="Pick a routine"
  items={[
    { label: 'The point', detail: 'Easy · 100 BPM' },
    { label: 'The hustle', detail: 'Hard · 122 BPM' },
  ]}
/>
```

| Prop | Default | |
|---|---|---|
| `items` | (required) | `{ label, detail? }` in order: the card's name and a smaller second line. |
| `label` | (required) | The picker's name for screen readers. |
| `selected` | `0` | The card shown first. |
| `prev`, `next` | `"Previous"`, `"Next"` | The step buttons' names for screen readers. |
| `class` | none | Extra classes. |

Each card has an empty art box, `[data-reel-art][data-index="<n>"]`: put an `<img>` in it, or draw a `<canvas>`
there from your script (StageDancer draws each routine's pose). It fires `reel:change` (bubbling, `{ index, source }`)
when the plate settles on a different card, and turns when you dispatch `reel:select` with `{ index }` on it. ↑ ↓ (and
← →) on the window turn one card, Home goes back to the first; only the first copy of each card is announced. Theme
with `--reel-card` (size, 112px), `--reel-accent`, `--reel-plate`, `--reel-card-bg`, `--reel-text` and `--reel-muted`.
Reduced motion: the plate jumps instead of turning.

## PlanetLap

How far around a planet a distance goes, drawn like the game Reus (the planet cut in half, seen side on in 2D) and
animated like an airliner's in-flight map. A little cyclist rides from the start flag to the distance, then the map keeps
breathing: it zooms in close (the nearest places, the next stop), out to the region, out to the whole half planet (the
far places), and back. A panel names the next stop and how far it is; it changes with the zoom (the nearest place ahead
close in, a farther one zoomed out), and places ahead show their distance to go.

```astro
<PlanetLap distance={551} circumference={24901} unit="mi" summary="{distance} mi: {percent} of the way around the world."
  start="Fargo, ND" markers={[{ label: 'Minneapolis', distance: 214 }, { label: 'Chicago', distance: 569 }]} />
```

| Prop | Default | |
|---|---|---|
| `distance` | (required) | How far, in the same unit as `circumference`. |
| `circumference` | `40075` | The distance round (the Earth at the equator, in km). |
| `summary` | (required) | The caption and screen-reader text. Slots `{distance}`, `{percent}` (of one lap) and `{laps}` are filled in at build time, so it's translated with the page. |
| `unit` | `"km"` | The unit shown on the map. |
| `next` | `"Next stop: {place} · {distance} to go"` | The next-stop panel (kept in the page, so it's translated). |
| `start` | none | A name on the start flag ("Fargo, ND"). |
| `markers` | none | Places along the way, `{ label, distance }`: a labelled pin on the rim at that distance from the start. Labels that would overlap step up a row; on narrow screens only the last place passed and the next one keep their names. |
| `locale` | `"en-US"` | Number format. |
| `surface` | a made-up world, mostly ocean | One biome per slice, clockwise from the start: `ocean`, `plains`, `forest`, `desert`, `mountains`, `ice`. |
| `controls` | `true` | The green ▶️ Play button (an ArcadeButton, on to start with) over the zoom bar, on the right. Moving the bar stops the auto zoom and pops Play up. |
| `zoomLabel` | `"Zoom"` | The zoom bar's name for screen readers. |
| `playLabel` | `"Play"` | The Play button's name. |
| `chaserLabel` | `"Who's that?"` | The name of the button on top of the chaser (see below). |

**Slot `chaser`:** SVG for something that runs after the rider, 70 px behind on the rim: feet at (0, 0), facing right,
with two frames (`<g data-frame="1">` and `<g data-frame="2">`) that take turns while it plays. A see-through button
sits on top of it; pressing it fires `planet:chaser` (it bubbles) for your own script. The Cycling gimmick puts
Ursu Sintasus there (`src/components/UrsuSprite.astro`) and opens an EasterEggBanner (#284).

```astro
<PlanetLap … chaserLabel="Ursu Sintasus"><UrsuSprite slot="chaser" /></PlanetLap>
```

Under the surface lie fossils (dinosaurs, a mammoth, a fish, an ammonite, and a dragon, a sea serpent and a unicorn),
fixed to the world; more turn up as it zooms in, and the crust thickens close in to make room for them.

The script draws the map (without JavaScript only the caption shows) and only moves it while it's on screen. Reduced
motion: the end of the ride, still, zoomed close, with Play off. Theme with `--planet-accent`, `--planet-rider`, `--planet-sky` and
`--planet-text`.

## ArcadeButton

A big, chunky, old-school push button with one emoji on its cap and a satisfying click. It sinks the moment it's
pressed and springs back; as a toggle it stays down, ringed and lit, while it's on.

```astro
<ArcadeButton emoji="🎵" label="Music" toggle pressed />
<ArcadeButton emoji="💡" label="Change the lights" />
```

| Prop | Default | |
|---|---|---|
| `emoji` | (required) | What's on the cap (decorative). |
| `label` | (required) | The name screen readers hear, and the tooltip, since the cap has no words. |
| `toggle` | `false` | Stays down while on (`aria-pressed`). Without it, a plain button you can keep pressing. |
| `pressed` | `false` | A toggle that starts on. |
| `color` | `#39c5bb` | The cap's colour (or `--arcade-color`). |
| `sound` | `true` | Play the click (a tiny Web Audio sound, no files). |
| `class` | none | Extra classes, handy to find it from a script. |

Every press fires `arcade:press` (bubbling, `{ pressed }`). Size it with `--arcade-size` (64px); the bezel colour is
`--arcade-base`. Reduced motion: it brightens instead of sinking.

## YouTube

A privacy-friendly YouTube embed. Nothing loads from YouTube until the visitor presses play; then it plays from
youtube-nocookie.com. When it's hidden (its tab closed), it pauses on its own. A "Watch on YouTube" link sits below it.

```astro
<YouTube id="QprnoS8PatE" title="Capt. Deovandski – Flight Experience Singapore" />
<YouTube id="Ez7ppSYdJmI" title="Ridin' with Peeta" short ratio="1:1" />
```

| Prop | Default | |
|---|---|---|
| `id` | (required) | The video id (`QprnoS8PatE` in `youtu.be/QprnoS8PatE`, `Ez7ppSYdJmI` in `youtube.com/shorts/Ez7ppSYdJmI`). |
| `title` | (required) | Shown on the play button, and the player's title. |
| `short` | `false` | A YouTube Short: 9:16, at most `--yt-short-width` wide, centred; its link goes to `/shorts/`. |
| `ratio` | `'9:16'` for a Short, else `'16:9'` | The frame's shape: `'16:9'`, `'9:16'` or `'1:1'` (square, at most `--yt-square-width`, 24rem, centred). |
| `play` | `"Play video: {title}"` | The play button's name for screen readers. |
| `note` | `"Plays from YouTube when you click"` | The small line under the title. |
| `link` | `"Watch on YouTube"` | The link's text under the video; empty for no link. |

Theme with `--yt-accent`, `--yt-on-accent`, `--yt-text`, `--yt-muted`, `--yt-font`, `--yt-width` (48rem) and
`--yt-short-width` (20rem).

## MetricLab

Years of daily numbers to slice and dice. Group boxes of checkboxes on top: years, seasons, weekdays and weekends,
the nights after an "event" (such as exercise) or not, and which kinds of event count. A box always keeps one box
ticked. Under them, five views, picked with `PillSwitch`:

- **Timeline:** one small chart per metric, by day, week or month, picked in boxes by metric group. Tap or hover one and every
  chart shows the same date.
- **Event** (named by `event.view`): the day after each event against every other day, as a median dot, the middle
  half of the days as a bar, and the difference.
- **Calendar:** one square per day, one row per year, in five steps from dark to bright; event days outlined.
- **Seasons:** month by month, one line per year (older years darker).
- **Compare:** any metric against any other, one dot per day, a trend line and r.

On a touch screen, a tap shows a chart's value and sliding a finger sideways moves it, without selecting the text around it;
the value stays after the finger lifts, until the next touch or a scroll. Up and down still scrolls the page (#299).

It downloads its data only the first time it's shown, so a page can carry it in a closed tab for free.

```astro
<MetricLab
  id="bio"
  src={url('/biomarkers.json')}
  hash="#biomarkers"
  metrics={[{ key: 'rhr', label: 'Resting heart rate', unit: 'bpm', decimals: 1, group: 'Heart' }, { key: 'sleepMin', label: 'Time asleep', format: 'duration', group: 'Overnight' }]}
  event={{ view: 'After exercise', day: 'exercise day', after: 'After exercise', other: 'After a rest day', value: '{n} min of exercise', slug: 'exercise',
           kindsLabel: 'Counts as exercise', kinds: [{ key: 'exWalk', label: 'Walking' }, { key: 'exBike', label: 'Cycling' }] }}
  defaults={{ timeline: ['rhr', 'sleepMin'], calendar: 'rhr', seasons: 'rhr', x: 'rhr', y: 'sleepMin' }}
/>
```

| Prop | Default | |
|---|---|---|
| `id` | (required) | Prefix for its element ids. |
| `src` | (required) | The data's URL: `{ "dates": ["2024-01-31", …], "<key>": [number or null, …], "event": [number, …] }`, one entry per date in every array, with one array per metric and per event kind. |
| `metrics` | (required) | `[{ key, label, unit?, decimals?, format?, group? }]`. `format`: `'number'`, `'duration'` (minutes → 7h 22m) or `'clock'` (hour of the day; 25.5 is 1:30 am). `group` puts it in a box (and a section of the lists). |
| `event` | none | Words for the event: `view`, `day`, `after`, `other`, `value` (`{n}` is the day's event number), `slug` for its view's link, and `kinds` (`[{ key, label }]`, the data arrays added up for the ticked ones) with `kindsLabel` for their box. Without kinds, `event` in the data is the event. Without `event`, the event boxes, view and colours are left out. |
| `defaults` | the first metrics | What's picked first: `timeline` (a list), `calendar`, `seasons`, `x`, `y`. |
| `hash` | none | Link prefix for the views: `hash`, `hash-<slug>`, `hash-calendar`, `hash-seasons`, `hash-compare`. |

Theme with `--lab-accent` (also the checkboxes), `--lab-event`, `--lab-other`, `--lab-surface`, `--lab-line`,
`--lab-text`, `--lab-muted`, `--lab-font`, `--lab-display-font` and `--lab-ramp-1` to `--lab-ramp-5`. Charts draw at
their real size and redraw when the width changes. Words its script writes are in its hidden `.metric-lab__strings`.

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

## IceFlasher

```astro
---
import IceFlasher from './reusable/IceFlasher.astro';
---
<IceFlasher />
<IceFlasher depth={32} />
```

| Prop | Default | |
|---|---|---|
| `depth` | `28` | How deep the hole is, in feet (where the bottom shows). |
| `class` | none | Extra class. |

Ice fishing with a flasher, based on the Vexilar FL-18. The dial is the flasher's LED wheel: 0 at 12 o'clock, depth
clockwise, red for strong returns, orange for medium, green for weak. The jig is the thin mark, the bottom the wide red
band; fish come in green from the edge of the cone and turn red under the hole. The knobs work like the FL-18's: Range
(Off, x1 to x10 of 20 ft; it also switches it on), Mode (Normal, Low Power, Auto Zoom and Bottom Lock, which split the
dial with the bottom 6 ft zoomed on the left) and Gain (0 to 10; pressing it steps through the 10 interference-rejection
settings, for when a "buddy's flasher" starts drawing dashes on the dial). Drag, scroll over or click a knob, or use the
arrow keys and Enter.

Play: the mouse wheel (or a swipe or drag on the flasher or the rod; Up and Down keys) moves the jig. Jig to call a fish
in, twitch or lift slowly while it's on the jig, and when the rod tip flashes (`navigator.vibrate` buzzes phones), flick
up hard: a big, fast scroll or swipe up (or Space). Then reel up, and ease off when it runs, or the line snaps. Six lake
fish of the north with their own depths, sizes and fight; catches are listed for the visit (nothing is saved). Sound is
made with the Web Audio API (motor whir, ping ticks, the drag's buzz, a splash) and starts with the flasher; one mute
button. Pauses and goes quiet off screen. Reduced motion: no flicker or rod shake, and the rod tip glows instead of
blinking. Theme with `--if-case`, `--if-accent`, `--if-sky`, `--if-water` and `--if-text`. Words the script writes live
in `.ice-flasher__strings`.

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

## LedMatrix

```astro
---
import LedMatrix from './reusable/LedMatrix.astro';
---
<LedMatrix />
<LedMatrix rows={12} text="Hi" shortText="Hi" figure={false} />
<LedMatrix pattern={['.#.', '###', '.#.']} />
```

Ported from the [Framework 16 LED Matrix Manager](https://github.com/Deovandski/Deo-s-Framework16-LED-Matrix-Manager)
website's drawing demo (`site/index.html`, MIT).

| Prop | Default | |
|---|---|---|
| `rows` | `20` | Number of rows. |
| `pitch` | `14` | Target LED spacing in px (10 on phones); the columns fit the width. |
| `text` | `"Huehuehue"` | Word drawn next to the figure. |
| `shortText` | `"Hue"` | Word used when `text` doesn't fit. |
| `figure` | `true` | Draw the stick figure. |
| `pattern` | none | Rows of `#` (on) and `.` (off) to start with instead. |
| `label` | (describes the controls) | What the matrix is, for screen readers. |
| `class` | none | Extra class. |

Click or tap toggles an LED, press-and-drag paints, right-click or Ctrl-click erases; arrow keys move a
cursor and Space toggles. Clear and Reset buttons. Theme with `--led-on`, `--led-off`, `--led-glow`,
`--led-bg` and `--led-accent`.

## DiceTray

```astro
---
import DiceTray from './reusable/DiceTray.astro';
---
<DiceTray />
<DiceTray dice={[6, 6, 20]} label="Attack" rollAll={false} />
```

| Prop | Default | |
|---|---|---|
| `dice` | `[4, 6, 8, 10, 12, 20]` | Sides of each die, in order. |
| `label` | `"Dice"` | Name of the group, for screen readers. |
| `rollAll` | `true` | Show a "Roll all" button and the total. |
| `class` | none | Extra class, e.g. to theme it. |

Each die tumbles in its own sunken pit and lands on a result; a natural max or 1 on a d20 gets a pop.
Theme with `--dice-face` (default Miku teal `#39c5bb`), `--dice-edge`, `--dice-ink`, `--dice-crit`
(Miku pink `#e12885`), `--dice-pit` and `--dice-text`. Reduced motion skips the tumble.

## FastTab

```astro
---
import FastTab from './reusable/FastTab.astro';
---
<button type="button" data-fasttabs="open">Expand all</button>
<button type="button" data-fasttabs="close">Collapse all</button>
<FastTab title="Paper plane" summary="Aviation tab" id="paper-plane">
  <PaperPlane />
</FastTab>
```

| Prop | Default | |
|---|---|---|
| `title` | (required) | Header text, in bold. For a header with a link in it, also pass the same words in the `title` slot with the link (`<Fragment slot="title">Paper plane (<a href="…">Aviation</a>)</Fragment>`); clicking the link follows it, anywhere else opens or closes the FastTab. |
| `summary` | `""` | Text on the right of the header while collapsed (F&O "summary fields"). Scripts can update it through `[data-fasttab-summary]`. |
| `open` | `false` | Start expanded. |
| `id` | none | Anchor: `/page/#id` opens this FastTab and scrolls to it. |
| `keepSummary` | `false` | Keep the summary showing while open too (F&O hides it). |
| other attributes | | `data-*`, `aria-*` and the like go on the `<details>` element. |
| `class` | none | Extra class. |

A button with `data-fasttabs="open"` or `"close"` opens or closes every FastTab in its container. Closed
content is `display: none`, so games and canvases inside pause while their FastTab is closed. Theme with
`--fasttab-accent`, `--fasttab-line`, `--fasttab-muted` and `--fasttab-hover`. Reduced motion: the chevron
flips without animating.

## PhotoViewer

```astro
---
import PhotoViewer from './reusable/PhotoViewer.astro';
---
<!-- once, at the end of the layout's <body> -->
<PhotoViewer />
```

| Prop | Default | |
|---|---|---|
| `label` | `"Photo"` | The dialog's name for screen readers. |

What opens in it, with no extra markup:
- **gallery buttons** (`data-gallery`, `data-full`, `data-alt`, `data-date`: what PhotoGrid makes); ‹ › step through the same gallery;
- **any `<img>` with alt text**; ‹ › step through the other visible pictures on the page, or in the nearest `[data-zoom-group]`;
- **links straight to an image file**.

It skips decorative pictures (`alt=""`), pictures inside links or buttons, the header and nav, maps,
games, pictures under 64px, and anything in `[data-no-zoom]`. `data-zoom` forces a picture on.

The caption is the alt text, then the date: `data-date="YYYY-MM-DD"` or `data-date-label`, else a
`YYYY-MM-DD` at the start of the file name. The picture shown is `data-full`, else the largest srcset
size. Theme with `--photo-viewer-accent`, `--photo-viewer-bg`, `--photo-viewer-text`,
`--photo-viewer-muted` and `--photo-viewer-backdrop`. Keyboard: Tab to a picture, then Enter or Space;
← → move between pictures; Esc closes and returns focus.

## SourceList

A reading list of the people and works a page builds on, with an optional title. Each item is one line: the
name in bold, the work in italics, the idea in a few words, then a link. Put a list in its slot; a Markdown
file's list works as it is.

```astro
---
import { Content as Sources } from '../content/death-sources.md';
---
<SourceList title="Shoulders I stand on"><Sources /></SourceList>
```

| Prop | Default | |
|---|---|---|
| `title` | none | The heading above the list. |
| `level` | `4` | That heading's level for screen readers (2 to 6). |

Theme with `--sources-title`, `--sources-title-font`, `--sources-text`, `--sources-name`, `--sources-accent` and
`--sources-line`. No script. On this site it sits in the Death and Mentor tabs' Links boxes (#268).

## PillSwitch

A pill-shaped switch between two (or more) views of the same place. Pressing an option shows its panel and
hides the others. It sits centred in its container. The panels are yours: give each the id in its option's
`controls`, `role="tabpanel"`, and `hidden` on all but the selected one.

```astro
<PillSwitch
  label="TV shows or movies"
  options={[
    { id: 'potato-tab-tv', controls: 'potato-tv', label: '📺 TV shows', hash: '#potato' },
    { id: 'potato-tab-movies', controls: 'potato-movies', label: '🎬 Movies', hash: '#potato-movies' },
  ]}
/>
<div id="potato-tv" role="tabpanel" aria-labelledby="potato-tab-tv">…</div>
<div id="potato-movies" role="tabpanel" aria-labelledby="potato-tab-movies" hidden>…</div>
```

| Prop | Default | |
|---|---|---|
| `label` | (required) | The switch's name for screen readers. |
| `options` | (required) | `{ id, controls, label, hash? }` in order: the button's id, its panel's id, its text, and an optional link that opens it. |
| `selected` | `0` | The option shown first. |

It fires `switch:change` (bubbling, `{ id, hash, source }`, where source is `'user'` or `'script'`) when an
option is picked, and picks one when you dispatch `switch:select` on `document` with `{ hash }` or `{ id }`. The home
page uses those two to keep the address bar and links like `#biomarkers-exercise` in step. ← → move between options
(mirrored right to left), Home and End jump to the ends. Theme with `--switch-accent`, `--switch-surface`,
`--switch-text`, `--switch-text-hover`, `--switch-on-text`, `--switch-font` and `--switch-size`.

## PhotoQuiz

Guess where a photo was taken. Each game draws `rounds` photos from the pool (a different answer group each where it
can), with `choices` answers each: the right one and wrong ones from other groups, so two places in one country never
compete. A score card sits on the side, and under it whatever you put in the `helper` slot: pressing it once per game
narrows the answers down to two. The helper also says a random `chatter` line now and then, and after some answers a fun
fact about that photo's place. Every word (answers, facts, chatter, feedback) is written into a hidden strings block,
so the site's translations reach it.

```astro
<PhotoQuiz questions={[{ src: '/p/tokyo.webp', answer: 'jp-13' }]}
  answers={[{ key: 'jp-13', name: 'Tokyo', within: 'Japan', group: 'jp' }, { key: 'cn', name: 'China', group: 'cn' }]}
  facts={[{ key: 'jp-13', text: 'Shinjuku Station is the busiest in the world.' }]} chatter={['Take your time.']}>
  <PixelHammock slot="helper" />
</PhotoQuiz>
```

| Prop | Default | |
|---|---|---|
| `questions` | (required) | The photo pool: `{ src, answer }` (an image URL and the right answer's key). |
| `answers` | (required) | Every answer: `{ key, name, within?, group? }`, shown as "name" or "name, within". |
| `rounds` | `10` | Photos per game. |
| `choices` | `4` | Answers per photo. |
| `facts` | none | `{ key, text }`: `key` is an answer key or a group. Shared after some answers. |
| `chatter` | none | Lines the helper says now and then. |
| `helperLabel` | `"Ask for a hint (one per game)"` | The helper button's name for screen readers. |
| `text` | | Replace any of the game's words (`question`, `right`, `wrong`, `freebie`, `endTop`…; see the `T` list in the file). |

While the helper talks, the slot's first element gets `data-awake="true"`. Theme with `--quiz-accent`, `--quiz-good`,
`--quiz-bad`, `--quiz-text`, `--quiz-muted` and `--quiz-card`.

## PixelHammock

StageDancer's chibi pixel character, chilling in a hammock between two palm trees, swaying gently, one arm behind the
head. Drawn in code like StageDancer, with the same outfit colours. Its root is a `<span>`, so it can sit inside a
button (PhotoQuiz's helper).

```astro
<PixelHammock label="Chibi Deo chilling in a hammock" />
```

| Prop | Default | |
|---|---|---|
| `outfit` | the yellow king's robes | `{ hat, hatTrim, skin, beard, robe, pattern, hem, boots }` colours. |
| `label` | a description | What's on screen, for screen readers. |
| `awake` | `false` | Start with the eyes open. Scripts set `data-awake="true"` to open them (while it talks). |

Theme with `--hammock-sky`, `--hammock-cloth` and `--hammock-stripe`. Reduced motion: no swaying.

## InstallApp

An "Install app" button for a site that's installable (a web app manifest and a service worker). The browser fires
`beforeinstallprompt` when the site can be installed; a tiny inline script keeps that event, and the button calls its
`prompt()`. When the browser can't install it right now, a short line says how: on Android, open the page in Chrome (links
opened from WhatsApp, Instagram or Gmail land in a viewer with no install option); on iPhone and iPad, Share → Add to
Home Screen; elsewhere, which browsers can. Inside the installed app it says so. Nothing is saved.

```astro
<InstallApp />
```

| Prop | Default | |
|---|---|---|
| `text` | | Replace any of its words: `install`, `installed`, `done`, `android`, `ios`, `other`. |

Theme with `--install-accent`, `--install-ink` and `--install-muted`.

## TerminalScreen

Copied unchanged from Deovandski-repo-template (template#19); change it there first and copy it back.

```astro
<TerminalScreen title="sysinfo" label="Build details">
  <div class="term-h">== CODE ==</div>
  <div class="term-row"><span class="term-k">Commit</span><span class="term-v">abc1234</span></div>
  <div class="term-gap"></div>
  <div class="term-hi">READY.</div>
</TerminalScreen>
```

Each direct child is one line, shown in order as its text is typed. To fill in values first, pass `wait` and fire
`terminal:start` on the element when ready (it fires `terminal:done` at the end). `terminal:start` again types it again.

| Prop | Default | |
|---|---|---|
| `label` | `"Terminal"` | What screen readers call it. |
| `title` | none | Text in a title bar with three dots; no bar without it. |
| `duration` | `1800` | About how long the whole text takes, in ms. Long texts type more characters per frame. |
| `wait` | `false` | Wait for `terminal:start` instead of starting by itself. |
| `class` | none | Extra class. |

Line classes: `.term-h` (amber heading), `.term-row` with `.term-k` and `.term-v` (key and value columns), `.term-dim`,
`.term-hi`, `.term-amber`, `.term-warn`, `.term-gap` (empty line), `.term-bar` and `.term-pre` (keep spaces). It is
always left to right and `translate="no"` (on an Arabic page, also give it `text-align: left`, as `/debug/` does). Theme
with `--term-bg`, `--term-ink`, `--term-dim`, `--term-amber`, `--term-warn`, `--term-font`, `--term-size`,
`--term-size-phone`, `--term-key` and `--term-key-phone`.

## ProjectCards

A grid of cards: a screenshot on top (it opens bigger in the photo viewer), a title with an optional date line, a short
explainer, and link buttons (the first one filled, the rest outlined). Without an image, the card shows a plain panel with
its title.

```astro
<ProjectCards items={[{ title: 'Superb Hawk', date: 'Spring 2014 · back in 2026', image: shot, alt: 'The Superb Hawk website',
  text: 'My 2014 college game, brought back in Godot.', links: [{ href: 'https://…', label: 'Play in your browser' }] }]} />
```

| Prop | Default | |
|---|---|---|
| `items` | (required) | `{ title, date?, image?, alt?, text, links }`: `image` is an imported picture; `links` are `{ href, label }`. |
| `label` | none | What the list is called, for screen readers. |

Theme with `--cards-accent`, `--cards-border`, `--cards-bg`, `--cards-text`, `--cards-muted` and `--cards-ink`.
