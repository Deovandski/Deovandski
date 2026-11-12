# Running and editing the site

The site is built with [Astro](https://astro.build) and published to GitHub
Pages by `.github/workflows/deploy.yml` on every push to `main`.

## Where things live

| What | File or folder |
|---|---|
| Home page tabs (Dev, Author, Influencer) | `src/pages/index.astro` |
| Mentor tab | `content/mentor.md` (plain Markdown) |
| PM tab (public Kanban boards) | `boards` near the top of `src/pages/index.astro` |
| King of Hues photo | `src/assets/king-of-hues.jpg` |
| Contact page (emails) | `src/pages/contact.astro` |
| Traveler tab (map pins and photos) | `content/travel/` (see its README, COUNTRY_CODES.md and SUBDIVISION_CODES.md) |
| Multilingual tab (language equalizer) | `content/languages.md` |
| Tattoo tab | `content/tattoos.md`, photos in `content/tattoos/<area>/` |
| Gym tab (chart + story) | `content/gym/weights.md`, `content/gym/story.md`, photos in `content/gym/photos/<year>.jpg` |
| 初音ミク tab (Miku concerts) | `content/miku.md`, photos in `content/miku/<concert>/` |
| Concert tab | `content/concerts.md`, photos in `content/concerts/<section>/` |
| BOTW tab (Best of the Worst picks) | `content/botw.md` |
| D&D tab (one picture + story per campaign) | `content/dnd.md`, pictures in `content/dnd/<campaign>/` |
| Fishing tab (photo gallery, like Cat Dad) | `content/fishing/` (see its README) |
| Camping tab (location cards, 2 photos each) | `content/camping.md` |
| Theater & Opera tab (works like Concert) | `content/theater.md`, show images in `content/theater/shows/` |
| Gamer tab (top 39 games, numbered list with optional `Hours:` lines) | `content/gaming/top39.md` |
| Anime tab (top 39 anime, with descriptions) | `content/anime/top39.md` (numbered list) |
| TV Potato tab (top 39 TV shows) | `content/tv/top39.md` (numbered list) |
| Movie Potato tab (top 39 movies) | `content/movies/top39.md` (numbered list) |
| Cat Dad tab (Peeta photos) | `content/peeta/` (see its README) |
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

No tab opens by default. Link straight to a home tab with `#dev`, `#author`, `#mentor`, `#pm`, `#influencer`, `#traveler`, `#fishing`, `#dnd`, `#camping`, `#botw`, `#multilingual`, `#tattoo`, `#gym`, `#miku`, `#concert`, `#theater`, `#gamer`, `#anime`, `#tv`, `#movie`, `#cat` or `#sex`.
Add `?miku` to any URL to preview the Miku Day confetti.

## Visitor source (`?src=`)

Links with `?src=LinkedIn` (any case) mark the visit as coming from LinkedIn, and so does
arriving from linkedin.com or lnkd.in. The mark lasts for the browser tab's visit, so
it survives clicking Home or Contact. LinkedIn visitors don't see the Sex tab.
Per-source rules live at the bottom of `src/styles/global.css`; the value is on
`<html data-src="...">`, so any other `?src=` value can get its own rules.
Use `https://deovandski.github.io/Deovandski/?src=LinkedIn` on LinkedIn.

## One-time GitHub setup

Settings → Pages → Build and deployment → Source: **GitHub Actions**.
