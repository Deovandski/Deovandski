# Running and editing the site

The site is built with [Astro](https://astro.build) and published to GitHub
Pages by `.github/workflows/deploy.yml` on every push to `main`.

## Where things live

| What | File or folder |
|---|---|
| Home page text and links | `src/pages/index.astro` |
| Blog posts | `content/blog/<post-name>/index.md` (copy `hello-github` as a template) |
| Travel photos and map pins | `content/travel/` (see its README and COUNTRY_CODES.md) |
| Top 10 games | `content/gaming/top10.md` |
| Inspiration page | `src/pages/inspiration.astro` |
| Miku Day dates and message | `src/components/MikuDay.astro` (`DATES` near the top) |
| Colors and fonts | `src/styles/global.css` |
| Logo | `src/assets/logo.png` |

## Local preview

```sh
npm install
npm run dev          # http://localhost:4321
```

Add `?miku` to any URL to preview the Miku Day confetti.

## One-time GitHub setup

Settings → Pages → Build and deployment → Source: **GitHub Actions**.
