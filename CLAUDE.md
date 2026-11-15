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

## Building

```sh
npm install
npm run build        # builds dist/ and llms.txt
```

Check changes at desktop (1280px) and phone (412px) widths before opening a PR.
