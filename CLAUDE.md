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

## One copy of each game

Every game or toy (a "gimmick") exists once: its component in `src/components/reusable/`, one entry in
`src/lib/gimmicks.ts`, and its props in one place, `src/components/Gimmick.astro`. Every page that shows it
(the tab's ▶ Play FastTab through `GimmickPlay.astro`, the Playground) renders that same entry, so a change
shows everywhere at once. Don't copy a game, its props or its data into a page; a copy needs Deo's OK.

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

## Translations (Chinese, Japanese, Portuguese, Spanish, Arabic, Korean, Malay, Thai, German, Vietnamese, Italian, French, Hindi, Indonesian)

The site is also published at `/zh/`, `/ja/`, `/pt/`, `/es/`, `/ar/`, `/ko/`, `/ms/`, `/th/`, `/de/`, `/vi/`, `/it/`, `/fr/`,
`/hi/` and `/id/` (#87), the same way as HusbandOutWorld (HusbandOutWorld#50), vraki-windows and the template. Claude writes the
translations ahead of time and commits them in `content/i18n/<lang>/`; English is the source. `scripts/i18n.mjs` (npm's
postbuild) translates the **built** pages, so tabs, components and data files need nothing special. How it works is at the
top of [scripts/i18n.mjs](scripts/i18n.mjs).

- **Translate only what changed.** Every segment is stored under a hash of its English, so unchanged English is never
  translated again. Never re-translate a segment that already has a translation, and never "improve" one unless Deo asks.
- **The loop:** `npm run build`, then `node scripts/i18n.mjs status`, then for each language
  `node scripts/i18n.mjs todo --lang ja > work.json` (add `--page contact/`, `--shared` or `--max-words 6000` to take a batch).
  Fill in each item's `"t"`, then `node scripts/i18n.mjs apply work.json`. Build again and look at the pages.
  `node scripts/i18n.mjs prune` drops translations whose English is gone; `rehash` re-keys them after a find/replace that
  touched the English.
- **When to translate:** not on every commit. English changes never wait for translations (untranslated text shows in
  English, marked `lang="en"`; the deploy's summary reports the gap and never blocks). Translate in batches, when asked;
  one PR per language.
- **Keep the HTML exactly.** Translate the visible text (and alt/title/aria-label text) only. Every tag, link and attribute
  in `"en"` must appear unchanged in `"t"` (`apply` warns when they differ). Don't translate URLs, file names, code,
  product names or `#HusbandOutWorld`.
- **Names are written by sound, never translated** (Deo's rule): katakana in Japanese; the closest-sounding spelling in
  Chinese, Korean, Arabic, Thai and Hindi; unchanged in the Latin-script languages. Real people and pets (Deovandski, Deo,
  Peeta, family and friends) stay in Latin letters. Follow `content/i18n/<lang>/glossary.json`; series names come from
  HusbandOutWorld's glossaries, so correct a name there and here together. The currency *balls* uses each language's word
  for ball (in the glossary).
- **Titles** in the top-39 lists, concerts and theater use the official local title (Deo, #87): movies and TV use the
  local title or stay English if there is none; anime keeps "Romaji (local title)", and Japanese shows the official
  Japanese title. **Every tab is translated**, Lust, Tattoo and Mentor included.
- **Variants:** Simplified Chinese, Brazilian Portuguese, Spain Spanish, Malaysian Malay, German (Germany, informal *du*),
  French (France), standard Indonesian, standard Hindi. Arabic is right to left (`dir="rtl"`): fix anything placed with
  left/right in the right-to-left block of `src/styles/global.css`.
- **Anything that must not be translated** gets `translate="no"`: Vraki-typeface text, names in a logo, code.
- **Text a script writes at run time** (game messages, counters) isn't in the built page, so it stays English for now.
- **The banner** on translated pages comes from `content/i18n/<lang>/meta.json`: "AI-Translated to <language> from
  Original work by Deovandski", with a one-click English link.
- A language is offered to search engines (`hreflang`, the sitemap) and to the browser-language auto-select only once a
  page is 90% translated (`index_coverage` in `content/i18n/config.json`); until then its pages are `noindex`.
- **Adding a language:** create `content/i18n/<code>/meta.json` and `glossary.json` (copy another language's), add the code
  to `content/i18n/config.json`, then run the loop. Requests come in on #87, linked from Settings › "Want a language added?".
- `npm run dev` shows English only. Translated pages exist only after `npm run build`.

## Website settings

The gear (top right of the header, `src/components/SettingsMenu.astro`) opens Settings: **Language**, "Want a language
added?" and **Vraki mode** (the English page in the Vraki script, like husbandoutworld.com; it's off on translated pages,
because the Vraki script spells English letters). `src/scripts/settings.ts` saves the choices in `localStorage` under
`deovandski-site` (`lang`, `vraki`); the inline script in `Base.astro` applies them before the page paints. The Multilingual
tab's columns pick a language (or Vraki mode) too, with a cyan box on the current one. Add more settings to the same menu
and the same storage key.

## Building

```sh
npm install
npm run build        # builds dist/, llms.txt and the translated pages (dist/<lang>/)
```

The build ends with `scripts/prune-originals.mjs`, which deletes the original photos Astro copies into
`dist/_astro/` that no page uses. GitHub Pages refuses sites over 1 GB, and those originals were most of it.
So never link or show an imported picture's original (`photo.src`). Use `<Image>` for the page and a
`getImage()` webp copy (up to 1800px) for a link or the photo viewer's `data-full`. That copy is what ships.

Check changes at desktop (1280px) and phone (412px) widths before opening a PR.
