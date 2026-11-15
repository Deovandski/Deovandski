# Peeta's photos (Pets tab)

Drop photos of Peeta straight into this folder and push. They appear in the
Pets tab on the home page, under Peeta. See ../README.md for how the Pets tab works.

- Formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif` (export iPhone `.heic` as JPG).
- Order: photos are shown oldest first, so start each filename with the day it
  was taken: `2022-04-02-first-day-home.jpg`, `2024-10-13-I-wanna-play.jpg`, …
  If you only know the month, `2025-05-did-I-undersleep-or-oversleep.jpg` works too
  (it lands after that month's dated photos). When several photos share a day,
  add the time as HHMMSS so they stay in the order they were taken:
  `2024-05-04-134837-Rueiro.jpg`, `2024-05-04-135318-King-of-the-trail.jpg`.
- Descriptions: the rest of the filename becomes the photo's caption on the grid,
  in the zoomed view and for screen readers. `2024-10-13-I-wanna-play.jpg` shows as
  "I wanna play", so name files after what's in them.
- **Lord Peeta of Tuxford** (`_lord-peeta-of-tuxford.jpeg`, AI-generated) is the round portrait in the
  Pets picker and the big picture above the grid, under the title in `_intro.md`. The leading "_"
  keeps it out of the grid and the photo count (`cover` and `hero` for Peeta in `src/lib/pets.ts`).
- Full-size originals are fine; the site makes small, fast copies.
- `_intro.md` is the centered title above the big picture. Edit it freely.
