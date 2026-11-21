# Working in this repo

Deovandski's personal site (Astro). [SITE.md](SITE.md) says where every tab's content lives.
Issues are worked one PR per issue, with `Closes #N` in the body.

## Build reusable components

If a piece of UI could be useful twice, in this repo or in another of Deovandski's repos, build it
as a reusable component instead of inline in a page. Examples: a clock, a counter or score card,
a board, a gallery, a map, a picker.

- **Where:** `src/components/reusable/`, listed in its [README](src/components/reusable/README.md).
- **Self-contained:** one `.astro` file, plus a folder for any font or image it needs. Everything
  comes in as props. It imports nothing from the site, and its scoped styles use CSS custom
  properties (with fallbacks) for theming. It must work when used several times on one page.
- **Accessible:** text for screen readers, keyboard-friendly, and it respects
  `prefers-reduced-motion`.
- **Documented:** a comment at the top of the file with a usage example, plus a row and a props
  table in the folder README.
- **Look before you build:** check the reusable folders here and in the other repos (the same
  rule is in HusbandOutWorld, Deovandski-repo-template, vraki-windows and
  Vraki-West-March-Campaign-D-D). Copy and adapt an existing component instead of starting over,
  and note where it came from.
- **Extract when you touch it:** when you change one-off UI that fits this rule, pull it out into
  a reusable component in the same PR. That's how the Death tab clock became `LedClock`.

## Pictures are clickable

Every picture on the site opens bigger when pressed, in the one photo viewer
(`src/components/reusable/PhotoViewer.astro`, already in `src/layouts/Base.astro`). Nothing to wire
up: any `<img>` with alt text opens by itself, and so does a link straight to an image file.

- **Give every content picture real alt text.** The alt is the viewer's caption. `alt=""` means
  decorative, and those don't open.
- **Dates:** the viewer shows a date under the caption when it knows one: `data-date="YYYY-MM-DD"`
  (or `data-date-label="Circa 2013"`) on the picture, or a `YYYY-MM-DD` at the start of its file name.
- **Bigger copy:** pass `data-full` with a large `getImage()` copy when the page only ships a small
  size (as `FamilyFacet.astro` does). Otherwise the viewer uses the largest size in the srcset.
- **Galleries** use `PhotoGrid` (its buttons carry `data-gallery`, so ‹ › step through the grid).
- **Opt out** with `data-no-zoom` on a picture or its container (game sprites, decorations). Pictures in
  links, buttons, the header, maps and games are already skipped.

## Building

```sh
npm install
npm run build        # builds dist/ and llms.txt
```

The build ends with `scripts/prune-originals.mjs`, which deletes the original photos Astro copies into
`dist/_astro/` that no page uses. GitHub Pages refuses sites over 1 GB, and those originals were most of it.
So never link or show an imported picture's original (`photo.src`). Use `<Image>` for the page and a
`getImage()` webp copy (up to 1800px) for a link or the photo viewer's `data-full`. That copy is what ships.

Check changes at desktop (1280px) and phone (412px) widths before opening a PR.
