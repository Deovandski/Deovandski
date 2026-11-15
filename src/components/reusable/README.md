# Reusable components

Components in this folder are built to be copied into other projects as they are. Each one is a
single `.astro` file (plus a folder for any font or image it needs). It takes everything as props,
imports nothing from this site, and themes itself with CSS custom properties. It also works when
used several times on one page. See the componentization rule in [CLAUDE.md](../../../CLAUDE.md).

| Component | What it is | Used on |
|---|---|---|
| [SplitFlap.astro](SplitFlap.astro) | Split-flap (Solari board) display for a number or short word. It flips into place the first time it scrolls into view. | MTG tab (Win vs Loss) |
| [LedClock.astro](LedClock.astro) + [fonts/](fonts/) | Countdown in red LED digits: years, days, hours, minutes, seconds. It blinks and shows a message at zero. | Death tab |
| [IconMeter.astro](IconMeter.astro) | A quantity shown as a row of icons, with the last one partly filled (650 lb ÷ 500 lb per cow = 1.3 cows). | Churrasco tab (cow-meter) |
| [OrgChart.astro](OrgChart.astro) | A top-down organization chart. Each row of people or roles is joined to the row above, with optional portraits. | Churrasco tab (The Holy Order) |

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

## Copying a component into another repo

1. Copy the `.astro` file (and its asset folder) into that repo's reusable components folder.
2. Add a row to that repo's list of reusable components saying where it was copied from (for
   example, "from Deovandski/Deovandski `src/components/reusable/`").
3. Improvements go back to the source too, so the copies don't drift apart.
