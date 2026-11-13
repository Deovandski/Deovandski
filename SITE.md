# Running and editing the site

The site is built with [Astro](https://astro.build) and published to GitHub
Pages by `.github/workflows/deploy.yml` on every push to `main`.

## Where things live

| What | File or folder |
|---|---|
| Home page tabs (Dev, Author, Influencer) | `src/pages/index.astro` |
| Mentor tab | `content/mentor.md` (plain Markdown) |
| Death tab (countdown clock + text) | `content/death.md`; clock target in `src/components/DeathFacet.astro` (`TARGET`) |
| PM tab (public Kanban boards) | `boards` near the top of `src/pages/index.astro` |
| King of Hues photo | `src/assets/king-of-hues.jpg` |
| Contact page (emails) | `src/pages/contact.astro` |
| Traveler tab (map pins and photos) | `content/travel/` (see its README, COUNTRY_CODES.md and SUBDIVISION_CODES.md) |
| Multilingual tab (language equalizer) | `content/languages.md` |
| Tattoo tab | `content/tattoos.md`, photos in `content/tattoos/<area>/` |
| Gym tab (chart + story) | `content/gym/weights.md`, `content/gym/story.md`, photos in `content/gym/photos/<year>.jpg` |
| 初音ミク tab (Miku concerts) | `content/miku.md`, photos in `content/miku/<concert>/` |
| Churrasco tab (one photo + description per panel, like 初音ミク) | `content/churrasco.md`, photos in `content/churrasco/<panel>/` |
| Drummer tab (a backlog note for now) | `src/pages/index.astro` (`panel-drummer`) |
| Concert tab | `content/concerts.md`, photos in `content/concerts/<section>/` |
| BOTW tab (Best of the Worst picks) | `content/botw.md` |
| D&D tab (one picture + story per campaign) | `content/dnd.md`, pictures in `content/dnd/<campaign>/` |
| Fishing tab (photo gallery, like each pet on the Pets tab) | `content/fishing/` (see its README) |
| Camping tab (location cards, 2 photos each) | `content/camping.md` |
| Theater & Opera tab (works like Concert) | `content/theater.md`, show images in `content/theater/shows/` |
| Gamer tab (top 39 games, numbered list with optional `Hours:` lines) | `content/gaming/top39.md` |
| Anime tab (top 39 anime, with descriptions) | `content/anime/top39.md` (numbered list) |
| Potato tab, TV shows side (top 39) | `content/tv/top39.md` (numbered list) |
| Potato tab, Movies side (top 39) | `content/movies/top39.md` (numbered list) |
| Pets tab (Bidu, Fluffy, Peeta: portrait picker + each pet's gallery) | `content/pets/<pet>/` (see `content/pets/README.md`); order in `src/lib/pets.ts` |
| Sex tab (and the first-click banner) | `content/sex.md`, `src/components/SexFacet.astro` |
| Miku Day dates and message | `src/components/MikuDay.astro` (`DATES` near the top) |
| Colors and fonts | `src/styles/global.css` |
| Logo | `src/assets/logo.png` |

## llms.txt (for AI tools)

`npm run build` also writes `llms.txt` (an index of the tabs, per [llmstxt.org](https://llmstxt.org/))
and `llms-full.txt` (every tab's text, as visitors see it) into the site root, the same idea as
the #HusbandOutWorld site. They're generated from the built home page by `scripts/llms.mjs`,
so they never go stale. The Sex tab is left out on purpose (`SKIP` at the top of that script).

## Local preview

```sh
npm install
npm run dev          # http://localhost:4321
```

No tab opens by default. Link straight to a home tab with `#death`, `#dev`, `#author`, `#mentor`, `#pm`, `#influencer`, `#traveler`, `#fishing`, `#dnd`, `#camping`, `#botw`, `#multilingual`, `#tattoo`, `#gym`, `#miku`, `#churrasco`, `#drummer`, `#concert`, `#theater`, `#gamer`, `#anime`, `#potato`, `#potato-movies`, `#pets` (opens Peeta; or `#pets-bidu`, `#pets-fluffy`, `#pets-peeta`) or `#sex`.
Add `?miku` to any URL to preview the Miku Day confetti.
Add `?deathclock=0` to preview the Death tab's clock at zero (blinking digits and the "update the clock" message).

## Visitor source (`?src=`)

Links with `?src=LinkedIn` (any case) mark the visit as coming from LinkedIn, and so does
arriving from linkedin.com or lnkd.in. The mark carries over while the visitor clicks around
the site (Home, Contact), but any URL opened directly without `?src` (typed, bookmarked, from
another site) starts clean. LinkedIn visitors don't see the Sex tab.
Per-source rules live at the bottom of `src/styles/global.css`; the value is on
`<html data-src="...">`, so any other `?src=` value can get its own rules.
Use `https://deovandski.github.io/Deovandski/?src=LinkedIn` on LinkedIn.

## One-time GitHub setup

Settings → Pages → Build and deployment → Source: **GitHub Actions**.
