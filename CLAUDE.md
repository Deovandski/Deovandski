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

**Everything behind a tab's ▶ Play is also on the Playground.** A tab's Play only ever opens an entry of
`src/lib/gimmicks.ts` (through `<GimmickPlay tab="…" />`), and the Playground lists every entry there, so adding a
gimmick to a tab adds it to the Playground in the same PR. Never put a game, toy or animation behind Play another way.

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
- **Text a script writes at run time** (game messages, counters) must be in the built page to be translated. Each reusable
  game keeps its words in a hidden `<div class="<name>__strings" hidden data-llms-skip>` of `<span data-k="key">` elements
  (with `{name}` slots) and reads them with a small `msg(key, vars)` helper; do the same for new script text (#234).
- **The banner** on translated pages comes from `content/i18n/<lang>/meta.json`: "AI-Translated to <language> from
  Original work by Deovandski", with a one-click English link.
- A language is offered to search engines (`hreflang`, the sitemap) and to the browser-language auto-select only once a
  page is 90% translated (`index_coverage` in `content/i18n/config.json`); until then its pages are `noindex`.
- **Adding a language:** create `content/i18n/<code>/meta.json` and `glossary.json` (copy another language's), add the code
  to `content/i18n/config.json`, then run the loop. Requests come in on #87, linked from Settings › "Want a language added?".
- `npm run dev` shows English only. Translated pages exist only after `npm run build`.

## Tab order: A to Z

The facet tree is in alphabetical order at both levels (#280): the branches (Craft, Explorer, Front Row, Hearth,
Philosophy, Play) and the tabs inside each branch.

- **Sub-tabs are A to Z too,** under their tab, by the same rule.
- **It goes by the English label,** ignoring case, accents, emoji and punctuation ("D&D" sorts as "dd"). A label in
  another script sorts by its `sortAs` (`初音ミク` sorts as "Hatsune Miku").
- **The code sorts the tree** (`byAlpha` in `src/pages/index.astro`), so a new tab or branch only needs its entry in
  `facets` and `branches`. Still write the entries there in A to Z order, so the lists read the same as the site.
- **Renaming a tab can move it.** That's expected; don't reorder by hand or pin a tab to a spot.
- Translated pages keep the English order.

## Tab links

A tab's link buttons (profiles, projects, trackers) live in one **Links** box, opened from the tab's header, never as
loose buttons in the tab (#260).

- **The header** is the breadcrumb (`src/components/reusable/Breadcrumb.astro`), with no title under it (#264): its last
  item names the tab. It stays on one line, shrinking its text down to 11px and then cutting it with "…" (#266).
  ▶ Play and Links sit at the right end of the breadcrumb's row on desktop (the left end in Arabic).
- Put a `LinksMenu` (`src/components/reusable/LinksMenu.astro`) with `toggle="external"` at the top of the tab's panel,
  after its `GimmickPlay` if it has one. The **Links** button, right of ▶ Play, opens the box under the header, like
  Play's box. It starts closed on every visit.
- **Every tab shows both ▶ Play and Links** (#262). A tab with no gimmick or no links box gets that button disabled
  (faded), so every tab's header looks the same. On phones (640px and narrower) the two buttons sit in a row under the
  breadcrumb, each centred in half the header's width.
- Build the box from `items`: groups of buttons (`style: 'primary'`, filled, for the main links; `'secondary'`,
  outlined, for the rest) and separators between them (`{ separator: 'Heading' }`, or `{ separator: true }` for a
  plain line). The link list itself lives once, at the top of `src/pages/index.astro` (like `devLinks`), or in the
  tab's own data.
- A box can also hold its own layout in `LinksMenu`'s slot instead of button groups: Death and Mentor put their
  "Shoulders I stand on" reading list there, as a `SourceList` (#268); Aviation and Tattoo put one after their buttons.
- **Links in the text go in the box too** (#328): a link written into a tab's text (Markdown or HTML) moves to its Links
  box, and the text keeps the words. Cards, buttons and links to other tabs stay where they are (Cooking's Churrasco),
  and so do crisis helplines (Death's 988 and findahelpline.com), which must stay in plain sight.
- Today: Developer, Author, Gamer, Influencer, Musician, Anime, BOTW, Death, Mentor, Lust, D&D, Cycling, Biomarker Lab, Aviation, Traveler, Tattoo, Fishing, Photographer, Cooking, Family, Gym, Concert and Management. Elsewhere (another page or repo) `toggle="own"` gives the box its own Links button.

## Sub-tabs (the tree's third level)

A tab that shows one of two or more lists gets **sub-tabs** in the facet tree, not a switch inside the tab (#296): Games |
Software on Developer, Life hacks | Project Management on Management, Seen live | Wishlist on Concert and Theater & Opera, Movies | TV shows
on Potato.

- **Data:** list them in the tab's entry in `facets` (`src/pages/index.astro`) as `subs: [{ id, icon, label, hash }]`, 2 to
  6 of them. `hash` is the link that opens one (`#potato-movies`). Exactly one uses the tab's own link (`#potato`): it opens
  when the tab does, unless the visitor already picked another one on this visit. The build stops if these rules break.
- **Panels:** inside the tab's panel, one `<div id="<tab>-<sub>" role="region" aria-labelledby="sub-<tab>-<sub>" data-sub-panel>`
  per sub-tab, `hidden` on all but the default. The tab's ▶ Play and Links stay at the tab level, shared by its sub-tabs.
- **How it looks:** on desktop a row of smaller nodes hangs from the tab on its own wire; on phones the sub-tabs are a third
  indent on a pink rail. A tab with sub-tabs shows "N sub-facets" under its name, like a branch's "N facets". The breadcrumb gains a fourth item.
- **Phones fold the tree** to the open path (its branch, the tab and its sub-tabs) whenever a tab is open; pressing the
  branch shows the rest again, and pressing it once more folds everything up.
- `PillSwitch` (#272) is still the switch *inside* a component, like the Biomarker Lab's views in `MetricLab`.

## Saved in the browser

Anything a game or setting keeps between visits (high scores, progress, a sound on/off) is saved in the browser's local
storage, never in a cookie, and never sent anywhere (Deo, #142).

- **One list:** every key is in `src/lib/saves.ts` (`SAVES`), with what it holds.
- **Transparent:** each key is named in [PRIVACY.md](PRIVACY.md), and /debug/ shows each one with what's saved in this
  browser. The build stops if a key in `SAVES` is missing from PRIVACY.md.
- **New game?** If it has a high score or progress worth keeping, save it: add its key to `SAVES` and PRIVACY.md, take
  the key as a `saveKey` prop (`''` saves nothing), wrap reads and writes in try/catch (private mode), and give it a
  live summary in `src/scripts/gimmickSummaries.ts`.

## Website settings

The gear (top right of the header, `src/components/SettingsMenu.astro`) opens Settings: **Language**, "Want a language
added?", **Vraki mode** (the English page in the Vraki script, like husbandoutworld.com; it's off on translated pages,
because the Vraki script spells English letters), **App** (the Install app button, `src/components/reusable/InstallApp.astro`, #292) and, last, **Stats for nerds**: a black
DEBUG button (green text) that opens `/debug/` (see below). The × at the top right closes the menu (there is no Done button),
and so does Esc. `src/scripts/settings.ts` saves the choices in `localStorage` under
`deovandski-site` (`lang`, `vraki`); the inline script in `Base.astro` applies them before the page paints. The Multilingual
tab's columns pick a language (or Vraki mode) too, with a cyan box on the current one. Add more settings to the same menu
and the same storage key.

## Stats for nerds (/debug/)

`src/pages/debug.astro` (#306, from Deovandski-repo-template#19): the header and footer stay, the page turns black, and a
terminal (`src/components/reusable/TerminalScreen.astro`, copied unchanged from the template) types out, fast and one
character at a time, green with amber section headings: **Code** (repository, build, branch, commit, pull request, workflow
run, tool versions, when the Steam, Xbox and Takeout data were refreshed), **Site** (pages, the facet tree's branches, tabs
and sub-tabs, reusable parts, files and size, languages, Vraki mode, settings, offline worker), **Runtime**, **Network**,
**Performance** and **Languages** (every language, % translated, pages ready).

- **Build facts come from `stats.json`**, written by `scripts/stats.mjs` at the end of `npm run build` (npm's postbuild,
  after `scripts/i18n.mjs build`), so the browser never works them out. Commit, branch, pull request and repository are left
  out when the repo is private. The translation numbers come from `languageStats()` in `scripts/i18n.mjs`, the same
  counting as `node scripts/i18n.mjs status`.
- **Browser facts** are read by `src/scripts/debug.ts`, which fills every `[data-v]` value and then starts the typing. It
  saves nothing and sends nothing (it fetches `stats.json`, plus three timed HEAD requests for Ping). A browser that doesn't
  share something shows "n/a" (so does a local build, for the workflow run and the CDN).
- **To add a line:** a build fact goes in `scripts/stats.mjs` first. Then add `['Label', 'key']` to its section in
  `debug.astro` and `set('key', value)` in `debug.ts`. Words the script writes go in `.debug-words` on the page.
- **Not indexed:** `<Base noindex>` adds `<meta name="robots" content="noindex, nofollow">`, and `scripts/llms.mjs` and
  `scripts/i18n.mjs` leave noindex pages out of `sitemap.xml` (llms.txt only lists the home page's tabs). The terminal is
  `translate="no"` (machine output); the page's title and description are translated.
- **Privacy:** listed in [PRIVACY.md](PRIVACY.md), with everything else the site keeps in the browser.

## Google Takeout data (Cycling, Biomarker Lab, Gym)

The health numbers come from Deo's Google Health export, refreshed about once a year with `npm run takeout`.
[TAKEOUT.md](TAKEOUT.md) has the steps, including how Claude runs it on Deo's computer.

- **The export never enters the repo,** and nothing from it but `content/cycling/rides.json`,
  `content/biomarkers/daily.json` and `content/gym/body-fat.json`.
- **No places:** no GPS points, routes, addresses or place names.
- **No medical records:** blood glucose, insulin, blood pressure, ECG/AFib, surveys, moods, journal and food logs stay
  out, even if a future export makes them easy. Adding any metric is Deo's call.
- **The privacy check must pass** (`npm run takeout -- --check`) before those files are committed.

## GitHub stats (Management ▶ Play)

The Management tab's GitHub mission control (`RepoPulse`, #334) reads `content/pm/github-stats.json`, a data pull like
Steam, Xbox and Takeout: run `npm run github` (it uses `$GITHUB_TOKEN`, or your `gh` login) and commit the file. Nothing
calls GitHub at build time; the dashboard shows "As of …" and /debug/ shows when it was pulled.

- **Which repos:** every repo Deo owns, forks left out. `content/pm/github-repos.json` sets the order and is the whole list
  when the token can't list an account's repos (a Claude session). Repos pushed in the last 12 months are active; the rest
  are History.
- **Public numbers only:** counts, dates, languages and weekly totals. No code, no file names, nobody else's details.
- **Kanban board columns** would need a token with `read:project`; not pulled today.

## Building

```sh
npm install
npm run build        # builds dist/, llms.txt, the translated pages (dist/<lang>/) and stats.json
```

The build ends with `scripts/prune-originals.mjs`, which deletes the original photos Astro copies into
`dist/_astro/` that no page uses. GitHub Pages refuses sites over 1 GB, and those originals were most of it.
So never link or show an imported picture's original (`photo.src`). Use `<Image>` for the page and a
`getImage()` webp copy (up to 1800px) for a link or the photo viewer's `data-full`. That copy is what ships.

Check changes at desktop (1280px) and phone (412px) widths before opening a PR.
