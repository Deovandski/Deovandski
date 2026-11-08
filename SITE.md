# Running and editing the site

The site is built with [Astro](https://astro.build) and published to GitHub
Pages by `.github/workflows/deploy.yml` on every push to `main`.

## Where things live

| What | File or folder |
|---|---|
| Home page tabs (Dev, Author, Influencer life) | `src/pages/index.astro` |
| Mentor Life tab | `content/mentor.md` (plain Markdown) |
| King of Hues photo | `src/assets/king-of-hues.jpg` |
| Blog posts | `content/blog/<post-name>/index.md` (copy `hello-github` as a template) |
| Traveler Life tab (map pins and photos) | `content/travel/` (see its README and COUNTRY_CODES.md) |
| Gamer Life tab (top 10 games) | `content/gaming/top10.md` |
| Weeb Life tab (top 20 anime) | `content/anime/top20.md` |
| Cat Dad Life tab (Peeta photos) | `content/peeta/` (see its README) |
| Miku Day dates and message | `src/components/MikuDay.astro` (`DATES` near the top) |
| Colors and fonts | `src/styles/global.css` |
| Logo | `src/assets/logo.png` |

## Local preview

```sh
npm install
npm run dev          # http://localhost:4321
```

Link straight to a home tab with `#dev`, `#author`, `#mentor`, `#influencer`, `#traveler`, `#gamer`, `#weeb` or `#cat`.
Add `?miku` to any URL to preview the Miku Day confetti.

## One-time GitHub setup

Settings → Pages → Build and deployment → Source: **GitHub Actions**.
