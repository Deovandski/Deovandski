# Pets tab

One folder per pet. The Pets tab shows them as a row of round portraits
(Bidu, Fluffy, Peeta, in that order); picking one shows that pet's photos below.

    content/pets/bidu/
    content/pets/fluffy/
    content/pets/peeta/

In each folder:

- Drop photos straight in and push. They're shown in filename order, so start
  each name with the day it was taken: `2022-04-02-first-day-home.jpg`,
  `2024-10-13-I-wanna-play.jpg`, … (`2026-04-…` when you only know the month;
  plain numbers like `01-…` still work too). Several photos on one day? Add the
  time as HHMMSS: `2024-05-04-134837-Rueiro.jpg`.
- The rest of the filename becomes the photo's caption (on the grid, in the zoomed
  view and for screen readers): `2024-10-13-I-wanna-play.jpg` shows as "I wanna play".
- `_intro.md` is the text shown above that pet's photos.
- The round portrait in the selector: set `cover` for that pet in `PETS`
  (`src/lib/pets.ts`) to part of a photo's filename, or add a `_cover.jpg`
  (or .png/.webp). Without either, the pet's first photo is used.
- Formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif` (iPhone `.heic` saved as
  `.jpg` is converted automatically at build time). Full-size originals are fine.

To add, remove or reorder pets, edit `PETS` in `src/lib/pets.ts`. `DEFAULT_PET` there is the pet
shown when the tab opens (Peeta for now).
