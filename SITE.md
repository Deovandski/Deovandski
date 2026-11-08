# Running and editing the site

The site is built with [Astro](https://astro.build) and published to GitHub
Pages by `.github/workflows/deploy.yml` on every push to `main`.

## Where things live

| What | File or folder |
|---|---|
| Home page tabs (Dev, Author, Influencer life) | `src/pages/index.astro` |
| Mentor Life tab | `content/mentor.md` (plain Markdown) |
| King of Hues photo | `src/assets/king-of-hues.jpg` |
| Contact page (emails) | `src/pages/contact.astro` |
| Traveler Life tab (map pins and photos) | `content/travel/` (see its README and COUNTRY_CODES.md) |
| Multilingual Life tab (language equalizer) | `content/languages.md` |
| Tattoo Life tab | `content/tattoos.md`, photos in `content/tattoos/<area>/` |
| Gym Life tab (chart + story) | `content/gym/weights.md`, `content/gym/story.md`, photos in `content/gym/photos/<year>.jpg` |
| 初音ミク Life tab (Miku concerts) | `content/miku.md`, photos in `content/miku/<concert>/` |
| Concert Life tab | `content/concerts.md`, photos in `content/concerts/<section>/` |
| Theater & Opera Life tab | `content/theater.md` |
| Gamer Life tab (top 39 games) | `content/gaming/top39.md` |
| Weeb Life tab (top 39 anime) | `content/anime/top39.md` |
| Potato Life tab (top 39 movies/TV) | `content/screen/top39.md` |
| Cat Dad Life tab (Peeta photos) | `content/peeta/` (see its README) |
| Sex Life tab (and the first-click banner) | `content/sex.md`, `src/components/SexLife.astro` |
| Miku Day dates and message | `src/components/MikuDay.astro` (`DATES` near the top) |
| Colors and fonts | `src/styles/global.css` |
| Logo | `src/assets/logo.png` |

## Local preview

```sh
npm install
npm run dev          # http://localhost:4321
```

Link straight to a home tab with `#dev`, `#author`, `#mentor`, `#influencer`, `#traveler`, `#multilingual`, `#tattoo`, `#gym`, `#miku`, `#concert`, `#theater`, `#gamer`, `#weeb`, `#potato`, `#cat` or `#sex`.
Add `?miku` to any URL to preview the Miku Day confetti.

## One-time GitHub setup

Settings → Pages → Build and deployment → Source: **GitHub Actions**.
