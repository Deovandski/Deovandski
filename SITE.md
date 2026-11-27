# Running and editing the site

The site is built with [Astro](https://astro.build) and published to GitHub
Pages by `.github/workflows/deploy.yml` on every push to `main`.

## Where things live

| What | File or folder |
|---|---|
| Home page facets (Developer, Author, Influencer) | `src/pages/index.astro` |
| A tab's links (the **Links** button right of ▶ Play, and its box) | a `LinksMenu` with `toggle="external"` at the top of the tab's panel; the lists (`devLinks`, `authorLinks`) at the top of `src/pages/index.astro`. Standard: "Tab links" in CLAUDE.md |
| Influencer tab KitKot game (the phone idle game) | `src/components/reusable/KitKot.astro` (odds and tricks are at the top of its script), behind the tab's ▶ Play button (`src/components/GimmickPlay.astro`; see "Tab ▶ Play gimmicks") |
| Facet tree (which branch each facet sits in, branch blurbs; both levels are A to Z on their own, see CLAUDE.md) | `facets` and `branches` near the top of `src/pages/index.astro`; the build stops if a facet is missing, listed twice, or a branch has more than 6 |
| Family tab (header photos, text, Itaituba → Fargo map, photos) | `content/family/_intro.md`, header photos in `content/family/header/`, photos in `content/family/` (see its README); layout and map in `src/components/FamilyFacet.astro` |
| Aviation tab (text + YouTube video) | `content/aviation.md`; video id in `src/pages/index.astro` (`panel-aviation`), shown by the reusable `src/components/reusable/YouTube.astro` |
| Aviation paper plane | `src/components/reusable/PaperPlane.astro`, behind the tab's ▶ Play button (`src/components/GimmickPlay.astro`; see "Tab ▶ Play gimmicks") |
| Mentor tab | `content/mentor.md` (plain Markdown); its "Shoulders I stand on" list, in the Links box, in `content/mentor-sources.md` |
| Mentor tab Balls farm (seeds, odds, trades, mantra) | `content/mentor-farm.json`; `src/components/reusable/IsoFarm.astro`, behind the tab's ▶ Play button (`src/components/GimmickPlay.astro`; see "Tab ▶ Play gimmicks") |
| Death tab (countdown clock + text) | `content/death.md` (its "Shoulders I stand on" list, in the Links box, in `content/death-sources.md`); clock target in `src/components/DeathFacet.astro` (`TARGET`); the clock itself is the reusable `src/components/reusable/LedClock.astro` |
| Management tab: Project Management sub-tab (public Kanban boards) | `boards` near the top of `src/pages/index.astro` |
| Management tab: Life hacks sub-tab | `src/components/LifeHacksFacet.astro` |
| QR Code page (hidden: `/qr/`, or `#qr` on the home page) | `src/pages/qr.astro`: `contact` (name and phone above the codes) and `codes` (one QR code per row, stacked in order) |
| Playground page (`/playground/`, in the top nav next to Contact; `/gaming/`, `#gaming` and `#playground` land there): every gimmick in a FastTab titled "Name (Tab facet)" | intro text in `src/pages/playground.astro`; one FastTab per row of `src/lib/gimmicks.ts` (sorted A to Z by name; `tabName` is the facet in the title); nav link in `src/layouts/Base.astro`; saved offline by `public/sw.js`; app shortcut in `src/pages/manifest.webmanifest.ts` |
| Photo viewer (every picture opens bigger, with its date) | `src/components/reusable/PhotoViewer.astro`, placed once in `src/layouts/Base.astro`; rules in CLAUDE.md ("Pictures are clickable") |
| Google Search Console verification (**never remove**) | `public/google0c08003a2b869d98.html`, served at `/Deovandski/google0c08003a2b869d98.html`; Search Console re-checks it, and removing it un-verifies the site |
| Tab ▶ Play gimmicks (the Play button on the breadcrumb's row (under it on phones; disabled on tabs without one), the FastTab it opens, phones turning sideways) | the list in `src/lib/gimmicks.ts` (which tab, the title, `inline`); each gimmick's props in `src/components/Gimmick.astro`; the button and FastTab in `src/components/GimmickPlay.astro`, placed at the top of each tab's panel in `src/pages/index.astro` (intro text goes in its `intro` slot) |
| Installable app (PWA): name, colours, home-screen shortcuts | `src/pages/manifest.webmanifest.ts`, icons in `public/icons/` |
| What the app keeps on the phone for offline use (QR Code page, home page) | `public/sw.js` (change `VERSION` to start over) |
| King of Hues photo | `src/assets/king-of-hues.jpg` |
| Contact page (emails) | `src/pages/contact.astro` |
| Traveler tab (map pins and photos) | `content/travel/` (see its README, COUNTRY_CODES.md and SUBDIVISION_CODES.md) |
| Multilingual tab (language equalizer) | `content/languages.md` |
| Tattoo tab | `content/tattoos.md`, photos in `content/tattoos/<area>/` |
| Tattoo tab Links box (the Vraki site, plus the "AuDHD, ink and grounding" reading list) | the link in `panel-tattoo` in `src/pages/index.astro`; the list in `content/tattoo-sources.md` |
| Tattoo tab practice skin (draw a tattoo) | `src/components/reusable/DrawingPad.astro`, behind the tab's ▶ Play button (`src/components/GimmickPlay.astro`; see "Tab ▶ Play gimmicks") |
| Gym tab (chart + story) | `content/gym/weights.md`, `content/gym/story.md`, photos in `content/gym/photos/<year>.jpg`; body fat by year in `content/gym/body-fat.json` (from the Takeout: [TAKEOUT.md](TAKEOUT.md)) |
| 初音ミク tab (Miku concerts) | `content/miku.md`, photos in `content/miku/<concert>/` |
| Churrasco tab (the Church of Churrasco: pounds grilled (kilograms are worked out from the pounds), cow-meter, papal decree, Holy Order chart, and the Scripture with its PDF export) | `content/churrasco/church.json` (all text and numbers), Pope's portrait `content/churrasco/pope-deo.jpg`, step photos `content/churrasco/steps/step-<n>.jpg`; layout in `src/components/ChurrascoFacet.astro` |
| Musician tab (text and the Suno button) | `src/pages/index.astro` (`panel-musician`, `musicianLinks`) |
| Musician tab drum kit | `src/components/reusable/DrumKit.astro`, behind the tab's ▶ Play button (`src/components/GimmickPlay.astro`; see "Tab ▶ Play gimmicks") |
| Painting/Drawing tab (intro text + picture grid captioned with the date taken) | pictures in `content/painting/` (see its README), approximate dates in `content/painting/_dates.md`; intro text in `src/pages/index.astro` (`panel-painting`) |
| Painting tab LED matrix (click to light LEDs) | `src/components/reusable/LedMatrix.astro`, behind the tab's ▶ Play button (`src/components/GimmickPlay.astro`; see "Tab ▶ Play gimmicks") |
| Board Games tab (one picture + story per card, like D&D) | `content/boardgames.md`, pictures in `content/boardgames/<card>/` |
| MTG tab (Magic: The Gathering; Win vs Loss split-flap score card, then one picture + story per card, like D&D) | `content/mtg.md` (`Wins:` and `Losses:` lines set the score card), pictures in `content/mtg/<card>/` |
| Cooking tab (one picture + story per card, like D&D) | `content/cooking.md`, pictures in `content/cooking/<card>/` |
| Reusable components (split-flap board, LED clock, easter-egg banner, icon meter, org chart, route map), built to copy into other projects | `src/components/reusable/` (see its README and the rule in CLAUDE.md) |
| Concert tab (Seen live and Wishlist sub-tabs) | `content/concerts.md` and `content/concerts-wishlist.md`, band images in `content/concerts/bands/` |
| Concert tab chibi Deo dancing (4 routines on a View-Master plate, each with its own tempo, music and difficulty; beat guide, fever meter) | `src/components/reusable/StageDancer.astro` (routines, tempos and difficulty at the top of the file and its script) with `src/components/reusable/ReelPicker.astro` (the plate) and `src/components/reusable/ArcadeButton.astro` (the 🎵 ⏸️ 💡 buttons), behind the tab's ▶ Play button (`src/components/GimmickPlay.astro`; see "Tab ▶ Play gimmicks") |
| BOTW tab (intro and the ranked picks with watch counts) | `content/botw.md` (refresh from a Google Takeout watch history with `scripts/botw-from-history.mjs`) |
| BOTW tab VHS pile (hours watched, the dates the history covers) | `content/botw-stats.json` (written by the script's `--stats`), video lengths in `content/botw-durations.json`, pile component `src/components/reusable/VhsPile.astro` |
| D&D tab (one picture + story per campaign) | `content/dnd.md`, pictures in `content/dnd/<campaign>/` |
| D&D tab dice (the row of dice under the title) | `src/components/reusable/DiceTray.astro`, behind the tab's ▶ Play button (`src/components/GimmickPlay.astro`; see "Tab ▶ Play gimmicks") |
| Fishing tab (photo gallery, like each pet on the Pets tab) | `content/fishing/` (see its README) |
| Camping tab (location cards, 2 photos each) | `content/camping.md` |
| Theater & Opera tab (Seen live and Wishlist sub-tabs, like Concert) | `content/theater.md` and `content/theater-wishlist.md`, show images in `content/theater/shows/` |
| Gamer tab (games by category, with hours and a Steam/Xbox/PlayStation/PC chip) | categories in `content/gaming/categories.md`, hours in `content/gaming/steam-games.json`, `content/gaming/xbox-games.json` and `content/gaming/estimated.md` (estimates, hand-written) (refresh once a year: `content/gaming/README.md`); `src/components/reusable/HoursByCategory.astro`, with its other views (pie, sphere, orbits, days, shelf; `viewCategories()` in `src/lib/gamerCategories.ts`) and the Links box (`LinksMenu.astro`) |
| Gamer tab Dino Ambush (the reverse dino game above the categories) | `src/components/reusable/DinoAmbush.astro`, behind the tab's ▶ Play button (`src/components/GimmickPlay.astro`; see "Tab ▶ Play gimmicks") |
| Anime tab (top 39 anime, with descriptions) | `content/anime/top39.md` (numbered list) |
| Potato tab, TV shows sub-tab (top 39) | `content/tv/top39.md` (numbered list) |
| Potato tab, Movies sub-tab (top 39) | `content/movies/top39.md` (numbered list) |
| Pets tab (Bidu, Fluffy, Peeta: portrait picker + each pet's gallery) | `content/pets/<pet>/` (see `content/pets/README.md`); order in `src/lib/pets.ts` |
| Pets tab pixel pets (the handhelds next to each big picture) | drawings and device colours in `src/lib/pixelPets.ts`; `src/components/reusable/PixelPet.astro`, behind the tab's ▶ Play button (`src/components/GimmickPlay.astro`; see "Tab ▶ Play gimmicks") |
| Cycling tab (rides, around-the-world planet, "Ridin' with Peeta" and its Short, story) | text in `content/cycling/story.md`; rides in `content/cycling/rides.json` (from a Google Health Takeout export: `content/cycling/README.md`) and `content/cycling/estimated.md`; studies in `content/cycling/sources.md` (its Links box); `src/components/CyclingFacet.astro`; numbers shared in `src/lib/cycling.ts`; its ▶ Play map "Around the World in 80 Gears" is the reusable `PlanetLap.astro` (gimmick `around-the-world`) |
| Biomarker Lab tab (Hearth: "The body is the temple", then the lab) | text in `content/biomarkers/story.md`; daily numbers in `content/biomarkers/daily.json` (from the Takeout: [TAKEOUT.md](TAKEOUT.md), `content/biomarkers/README.md`), served as `/biomarkers.json` by `src/pages/biomarkers.json.ts`; the dashed "men my age" lines and their links (the first group of its Links box) in `content/biomarkers/norms.json`, the "Why HRV matters" links in `hrvLinks` at the top of `src/pages/index.astro`; `src/components/BiomarkersFacet.astro` with the reusable `MetricLab.astro` |
| Lust tab (and the banner for when it's the first facet opened) | `content/lust.md`, `src/components/LustFacet.astro` |
| Lust tab ecchi-meter (bellows, fire, phrases) | phrases and levels in `content/lust-meter.json`; `src/components/reusable/FireMeter.astro`, behind the tab's ▶ Play button (`src/components/GimmickPlay.astro`; see "Tab ▶ Play gimmicks") |
| Facet easter eggs (banners after a visitor opens 10 and 20 different facets) | `src/components/FacetMilestoneEggs.astro`, GIFs `public/tea-sip.gif` and `public/aiight.gif` |
| Miku Day (3/9) and Miku's birthday (8/31): dates, messages and pictures | `src/components/MikuDay.astro` (`DATES` in the script, pictures in `images` at the top), birthday photo `src/assets/miku-birthday-2016-08-31.jpg` |
| Miku tab Whack-a-Miku (the game card at the top) | `src/components/reusable/WhackAMole.astro`, sprite `src/assets/whack-a-miku/whack-a-miku.png` (Deo's original in `whack-a-miku-source.png`), behind the tab's ▶ Play button (`src/components/GimmickPlay.astro`; see "Tab ▶ Play gimmicks") |
| Colors and fonts | `src/styles/global.css` |
| Logo | `src/assets/logo.png` |

## llms.txt (for AI tools)

`npm run build` also writes `llms.txt` (an index of the tabs, per [llmstxt.org](https://llmstxt.org/))
and `llms-full.txt` (every tab's text, as visitors see it) into the site root, the same idea as
the #HusbandOutWorld site. They're generated from the built home page by `scripts/llms.mjs`,
so they never go stale. The Lust tab is left out on purpose (`SKIP` at the top of that script).

The same script also writes:

- `facets/<id>.md`: one tab per file (`/facets/death.md`, `/facets/dev.md`, …). `llms.txt` links to
  these, because `/#death` and the home page are the same URL to a fetcher, and readers drop the
  home page's hidden tab panels.
- `sitemap.xml`: every page plus the files above.

Every page's head links to `llms.txt`, `llms-full.txt` and `sitemap.xml`. Mark anything that reads
as noise in plain text (like the LED clock's digits) with `data-llms-skip`, and the script leaves it out.

### Testing it (#147)

```sh
npm run build && ls dist/llms.txt dist/llms-full.txt dist/sitemap.xml dist/facets/
curl -i https://deovandski.com/llms.txt          # 200, text/plain
curl -i https://deovandski.com/facets/death.md   # 200
```

Then ask a couple of different AI assistants to read `/facets/death.md`. Some can't reach `*.github.io`
at all, and search-based ones only see the site once Bing and Google have indexed it. Submit
`sitemap.xml` in Bing Webmaster Tools and Google Search Console. Since the move to deovandski.com (#222),
the build also writes a `robots.txt` that points to it. It only does that when the site is at a domain root,
because `robots.txt` must live there.

## Translations and Settings (#87)

The site is also built in 14 languages at `/zh/`, `/ja/`, `/pt/`, `/es/`, `/ar/`, `/ko/`, `/ms/`, `/th/`, `/de/`, `/vi/`,
`/it/`, `/fr/`, `/hi/` and `/id/`. Translations live in `content/i18n/<lang>/` and are written ahead of time;
`scripts/i18n.mjs` adds them to the built pages. Text not translated yet shows in English. The rules for translating are in
CLAUDE.md ("Translations").

- **Settings** (the gear, top right): Language, "Want a language added?" (opens #87) and Vraki mode.
- **Multilingual tab:** each language column opens the site in that language (Vraki turns on Vraki mode). The current one
  has a cyan box.
- **See where each language stands:** `node scripts/i18n.mjs status` after a build (the deploy's summary shows it too).

## Local preview

```sh
npm install
npm run dev          # http://localhost:4321
```

No facet opens by default: visitors grow a branch of the facet tree, then pick a facet (and, on Developer, Management, Concert, Theater & Opera and Potato, a sub-tab: the tree's third level, #296). Link straight to a facet (its branch grows too) with `#death`, `#dev` (or `#dev-games`; old `#developer` links still work), `#family`, `#aviation`, `#author`, `#mentor`, `#pm` (or `#life-hacks`), `#influencer`, `#traveler`, `#fishing`, `#dnd`, `#camping`, `#botw`, `#multilingual`, `#tattoo`, `#gym`, `#cycling`, `#biomarkers` (or `#biomarkers-exercise`, `#biomarkers-calendar`, `#biomarkers-seasons`, `#biomarkers-compare`), `#miku`, `#churrasco`, `#cooking`, `#musician` (old `#drummer` links still work), `#painting`, `#boardgames`, `#mtg`, `#concert` (or `#concert-wishlist`), `#theater` (or `#theater-wishlist`), `#gamer`, `#anime`, `#potato` (or `#potato-movies`), `#pets` (opens Peeta; or `#pets-bidu`, `#pets-fluffy`, `#pets-peeta`) or `#lust` (old `#sex` links still work).
Add `?miku` to any URL to preview the Miku Day confetti (3/9), or `?miku=0831` for Miku's birthday (8/31).
Add `?deathclock=0` to preview the Death tab's clock at zero (blinking digits and the "update the clock" message).

## Visitor source (`?src=`)

Links with `?src=LinkedIn` (any case) mark the visit as coming from LinkedIn, and so does
arriving from linkedin.com or lnkd.in. The mark carries over while the visitor clicks around
the site (Home, Contact), but any URL opened directly without `?src` (typed, bookmarked, from
another site) starts clean. LinkedIn visitors don't see the Lust tab.
Per-source rules live at the bottom of `src/styles/global.css`; the value is on
`<html data-src="...">`, so any other `?src=` value can get its own rules.
Use `https://deovandski.com/?src=LinkedIn` on LinkedIn.

## One-time GitHub setup

Settings → Pages → Build and deployment → Source: **GitHub Actions**.
