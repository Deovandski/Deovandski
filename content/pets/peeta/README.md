# Peeta's photos (Pets tab)

Drop photos of Peeta straight into this folder and push. They appear in the
Pets tab on the home page, under Peeta. See ../README.md for how the Pets tab works.

- Formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif` (export iPhone `.heic` as JPG).
- Order: photos are shown oldest first, so start each filename with the day it
  was taken: `2022-04-02-first-day-home.jpg`, `2024-10-13-I-wanna-play.jpg`, …
  If you only know the month, `2026-04-Lord-Peeta-of-Tuxford.jpeg` works too
  (it lands after that month's dated photos). When several photos share a day,
  add the time as HHMMSS so they stay in the order they were taken:
  `2024-05-04-134837-Rueiro.jpg`, `2024-05-04-135318-King-of-the-trail.jpg`.
- Descriptions: the rest of the filename becomes the photo's caption on the grid,
  in the zoomed view and for screen readers. `2024-10-13-I-wanna-play.jpg` shows as
  "I wanna play", so name files after what's in them.
- The round portrait in the Pets picker is the Lord Peeta of Tuxford photo
  (`cover` for Peeta in `src/lib/pets.ts`).
- Full-size originals are fine; the site makes small, fast copies.
- `_intro.md` holds the text shown above the photos. Edit it freely.
