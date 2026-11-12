# Running and editing the site

The site is built with [Astro](https://astro.build) and published to GitHub
Pages by `.github/workflows/deploy.yml` on every push to `main`.

## Where things live

| What | File or folder |
|---|---|
| Home page tabs (Dev, Author, Influencer life) | `src/pages/index.astro` |
| Mentor tab | `content/mentor.md` (plain Markdown) |
| King of Hues photo | `src/assets/king-of-hues.jpg` |
| Contact page (emails) | `src/pages/contact.astro` |
| Traveler tab (map pins and photos) | `content/travel/` (see its README, COUNTRY_CODES.md and SUBDIVISION_CODES.md) |
| Multilingual tab (language equalizer) | `content/languages.md` |
| Tattoo tab | `content/tattoos.md`, photos in `content/tattoos/<area>/` |
| Gym tab (chart + story) | `content/gym/weights.md`, `content/gym/story.md`, photos in `content/gym/photos/<year>.jpg` |
| 初音ミク tab (Miku concerts) | `content/miku.md`, photos in `content/miku/<concert>/` |
| Concert tab | `content/concerts.md`, photos in `content/concerts/<section>/` |
| D&D tab (cards, 2 photos each) | `content/dnd.md` |
| Fishing and Camping tabs (location cards, 2 photos each) | `content/fishing.md`, `content/camping.md` |
| Theater & Opera tab | `content/theater.md` |
| Gamer tab (top 39 games) | `content/gaming/top39.md` |
| Weeb tab (top 39 anime, with descriptions) | `content/anime/top39.md` (numbered list) |
| Potato tab (top 39 movies/TV) | `content/screen/top39.md` |
| Cat Dad tab (Peeta photos) | `content/peeta/` (see its README) |
| Sex tab (and the first-click banner) | `content/sex.md`, `src/components/SexLife.astro` |
| Miku Day dates and message | `src/components/MikuDay.astro` (`DATES` near the top) |
| Colors and fonts | `src/styles/global.css` |
| Logo | `src/assets/logo.png` |

## Local preview

```sh
npm install
npm run dev          # http://localhost:4321
```

No tab opens by default. Link straight to a home tab with `#dev`, `#author`, `#mentor`, `#influencer`, `#traveler`, `#fishing`, `#dnd`, `#camping`, `#multilingual`, `#tattoo`, `#gym`, `#miku`, `#concert`, `#theater`, `#gamer`, `#weeb`, `#potato`, `#cat` or `#sex`.
Add `?miku` to any URL to preview the Miku Day confetti.

## One-time GitHub setup

Settings → Pages → Build and deployment → Source: **GitHub Actions**.
