# Running and editing the site

The site is built with [Astro](https://astro.build) and published to GitHub
Pages by `.github/workflows/deploy.yml` on every push to `main`.

## Where things live

| What | File or folder |
|---|---|
| Home page facets (Dev, Author, Influencer) | `src/pages/index.astro` |
| Influencer tab KitKot game (the phone idle game) | `src/components/reusable/KitKot.astro` (odds and tricks are at the top of its script), placed under the screenshot in `panel-influencer` in `src/pages/index.astro` |
| Facet tree (which branch each facet sits in, the order, branch blurbs) | `facets` and `branches` near the top of `src/pages/index.astro`; the build stops if a facet is missing, listed twice, or a branch has more than 6 |
| Family tab (header photos, text, Itaituba → Fargo map, photos) | `content/family/_intro.md`, header photos in `content/family/header/`, photos in `content/family/` (see its README); layout and map in `src/components/FamilyFacet.astro` |
| Aviation tab (text + YouTube video) | `content/aviation.md`; video id in `src/pages/index.astro` (`panel-aviation`) |
| Aviation paper plane | `src/components/reusable/PaperPlane.astro`, placed in `panel-aviation` in `src/pages/index.astro` |
| Mentor tab | `content/mentor.md` (plain Markdown) |
| Mentor tab Balls farm (seeds, odds, trades, mantra) | `content/mentor-farm.json`; `src/components/reusable/IsoFarm.astro`, placed in `src/components/MentorFacet.astro` |
| Death tab (countdown clock + text) | `content/death.md`; clock target in `src/components/DeathFacet.astro` (`TARGET`); the clock itself is the reusable `src/components/reusable/LedClock.astro` |
| PM/Life hacks tab: PM side (public Kanban boards) | `boards` near the top of `src/pages/index.astro` |
| PM/Life hacks tab: Life hacks side | `src/components/LifeHacksFacet.astro` |
| QR Code page (hidden: `/qr/`, or `#qr` on the home page) | `src/pages/qr.astro`: `contact` (name and phone above the codes) and `codes` (one QR code per row, stacked in order) |
| Installable app (PWA): name, colours, home-screen shortcuts | `src/pages/manifest.webmanifest.ts`, icons in `public/icons/` |
| What the app keeps on the phone for offline use (QR Code page, home page) | `public/sw.js` (change `VERSION` to start over) |
| King of Hues photo | `src/assets/king-of-hues.jpg` |
| Contact page (emails) | `src/pages/contact.astro` |
| Traveler tab (map pins and photos) | `content/travel/` (see its README, COUNTRY_CODES.md and SUBDIVISION_CODES.md) |
| Multilingual tab (language equalizer) | `content/languages.md` |
| Tattoo tab | `content/tattoos.md`, photos in `content/tattoos/<area>/` |
| Tattoo tab practice skin (draw a tattoo) | `src/components/reusable/DrawingPad.astro`, placed under the tattoos in `panel-tattoo` in `src/pages/index.astro` |
| Gym tab (chart + story) | `content/gym/weights.md`, `content/gym/story.md`, photos in `content/gym/photos/<year>.jpg` |
| 初音ミク tab (Miku concerts) | `content/miku.md`, photos in `content/miku/<concert>/` |
| Churrasco tab (the Church of Churrasco: pounds grilled (kilograms are worked out from the pounds), cow-meter, papal decree, Holy Order chart, and the Scripture with its PDF export) | `content/churrasco/church.json` (all text and numbers), Pope's portrait `content/churrasco/pope-deo.jpg`, step photos `content/churrasco/steps/step-<n>.jpg`; layout in `src/components/ChurrascoFacet.astro` |
| Musician tab (text and the Suno button) | `src/pages/index.astro` (`panel-musician`, `musicianLinks`) |
| Musician tab drum kit | `src/components/reusable/DrumKit.astro`, placed in `panel-musician` in `src/pages/index.astro` |
| Painting/Drawing tab (intro text + picture grid captioned with the date taken) | pictures in `content/painting/` (see its README), approximate dates in `content/painting/_dates.md`; intro text in `src/pages/index.astro` (`panel-painting`) |
| Painting tab LED matrix (click to light LEDs) | `src/components/reusable/LedMatrix.astro`, placed in `panel-painting` in `src/pages/index.astro` |
| Board Games tab (one picture + story per card, like D&D) | `content/boardgames.md`, pictures in `content/boardgames/<card>/` |
| Board Games tab Territory Snipping (the on-rails darts scene) | script, dialogue and settings in `content/territory-snipping.json` (every line is from HusbandOutWorld Vol 2); `src/components/reusable/IsoDarts.astro`, placed at the top of `panel-boardgames` |
| MTG tab (Magic: The Gathering; Win vs Loss split-flap score card, then one picture + story per card, like D&D) | `content/mtg.md` (`Wins:` and `Losses:` lines set the score card), pictures in `content/mtg/<card>/` |
| Cooking tab (one picture + story per card, like D&D) | `content/cooking.md`, pictures in `content/cooking/<card>/` |
| Reusable components (split-flap board, LED clock, easter-egg banner, icon meter, org chart, route map), built to copy into other projects | `src/components/reusable/` (see its README and the rule in CLAUDE.md) |
| Concert tab (Seen live, plus a Wishlist behind a switch) | `content/concerts.md` and `content/concerts-wishlist.md`, band images in `content/concerts/bands/` |
| Concert tab chibi Deo dancing (above the Seen live / Wishlist switch) | `src/components/reusable/StageDancer.astro`, placed at the top of `panel-concert` in `src/pages/index.astro` |
| BOTW tab (intro and the ranked picks with watch counts) | `content/botw.md` (refresh from a Google Takeout watch history with `scripts/botw-from-history.mjs`) |
| BOTW tab VHS pile (hours watched, the dates the history covers) | `content/botw-stats.json` (written by the script's `--stats`), video lengths in `content/botw-durations.json`, pile component `src/components/reusable/VhsPile.astro` |
| D&D tab (one picture + story per campaign) | `content/dnd.md`, pictures in `content/dnd/<campaign>/` |
| Fishing tab (photo gallery, like each pet on the Pets tab) | `content/fishing/` (see its README) |
| Camping tab (location cards, 2 photos each) | `content/camping.md` |
| Theater & Opera tab (Seen live, plus a Wishlist behind a switch, like Concert) | `content/theater.md` and `content/theater-wishlist.md`, show images in `content/theater/shows/` |
| Gamer tab (top 39 games, numbered list with optional `Hours:` lines) | `content/gaming/top39.md` |
| Gamer tab Dino Ambush (the reverse dino game above the ranking) | `src/components/reusable/DinoAmbush.astro`, placed in `panel-gamer` in `src/pages/index.astro` |
| Anime tab (top 39 anime, with descriptions) | `content/anime/top39.md` (numbered list) |
| Potato tab, TV shows side (top 39) | `content/tv/top39.md` (numbered list) |
| Potato tab, Movies side (top 39) | `content/movies/top39.md` (numbered list) |
| Pets tab (Bidu, Fluffy, Peeta: portrait picker + each pet's gallery) | `content/pets/<pet>/` (see `content/pets/README.md`); order in `src/lib/pets.ts` |
| Pets tab pixel pets (the handhelds next to each big picture) | drawings and device colours in `src/lib/pixelPets.ts`; `src/components/reusable/PixelPet.astro`, placed in `src/components/PetsFacet.astro` |
| Lust tab (and the banner for when it's the first facet opened) | `content/lust.md`, `src/components/LustFacet.astro` |
| Lust tab ecchi-meter (bellows, fire, phrases) | phrases and levels in `content/lust-meter.json`; `src/components/reusable/FireMeter.astro`, placed in `src/components/LustFacet.astro` |
| Facet easter eggs (banners after a visitor opens 10 and 20 different facets) | `src/components/FacetMilestoneEggs.astro`, GIFs `public/tea-sip.gif` and `public/aiight.gif` |
| Miku Day (3/9) and Miku's birthday (8/31): dates, messages and pictures | `src/components/MikuDay.astro` (`DATES` in the script, pictures in `images` at the top), birthday photo `src/assets/miku-birthday-2016-08-31.jpg` |
| Miku tab Whack-a-Miku (the game card at the top) | `src/components/reusable/WhackAMole.astro`, sprite `src/assets/whack-a-miku/whack-a-miku.png` (Deo's original in `whack-a-miku-source.png`), placed in `panel-miku` in `src/pages/index.astro` |
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
curl -i https://deovandski.github.io/Deovandski/llms.txt          # 200, text/plain
curl -i https://deovandski.github.io/Deovandski/facets/death.md   # 200
```

Then ask a couple of different AI assistants to read `/facets/death.md`. Some can't reach `*.github.io`
at all, and search-based ones only see the site once Bing and Google have indexed it. Submit
`sitemap.xml` in Bing Webmaster Tools and Google Search Console. A `robots.txt` can't point to it:
on a project site, `robots.txt` lives at the domain root (`deovandski.github.io/robots.txt`).

## Local preview

```sh
npm install
npm run dev          # http://localhost:4321
```

No facet opens by default: visitors grow a branch of the facet tree, then pick a facet. Link straight to a facet (its branch grows too) with `#death`, `#dev`, `#family`, `#aviation`, `#author`, `#mentor`, `#pm` (or `#life-hacks`), `#influencer`, `#traveler`, `#fishing`, `#dnd`, `#camping`, `#botw`, `#multilingual`, `#tattoo`, `#gym`, `#miku`, `#churrasco`, `#cooking`, `#musician` (old `#drummer` links still work), `#painting`, `#boardgames`, `#mtg`, `#concert` (or `#concert-wishlist`), `#theater` (or `#theater-wishlist`), `#gamer`, `#anime`, `#potato`, `#potato-movies`, `#pets` (opens Peeta; or `#pets-bidu`, `#pets-fluffy`, `#pets-peeta`) or `#lust` (old `#sex` links still work).
Add `?miku` to any URL to preview the Miku Day confetti (3/9), or `?miku=0831` for Miku's birthday (8/31).
Add `?deathclock=0` to preview the Death tab's clock at zero (blinking digits and the "update the clock" message).

## Visitor source (`?src=`)

Links with `?src=LinkedIn` (any case) mark the visit as coming from LinkedIn, and so does
arriving from linkedin.com or lnkd.in. The mark carries over while the visitor clicks around
the site (Home, Contact), but any URL opened directly without `?src` (typed, bookmarked, from
another site) starts clean. LinkedIn visitors don't see the Lust tab.
Per-source rules live at the bottom of `src/styles/global.css`; the value is on
`<html data-src="...">`, so any other `?src=` value can get its own rules.
Use `https://deovandski.github.io/Deovandski/?src=LinkedIn` on LinkedIn.

## One-time GitHub setup

Settings → Pages → Build and deployment → Source: **GitHub Actions**.
