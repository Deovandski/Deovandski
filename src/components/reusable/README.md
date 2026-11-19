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
