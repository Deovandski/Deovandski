# Pets tab

One folder per pet. The Pets tab shows them as a row of round portraits
(Bidu, Fluffy, Peeta, in that order); picking one shows that pet's photos below.

    content/pets/bidu/
    content/pets/fluffy/
    content/pets/peeta/

In each folder:

- Drop photos straight in and push. They're shown in filename order, so number
  them: `01-first-day-home.jpg`, `02-asleep-on-keyboard.jpg`, …
- The filename becomes the photo's caption (on the grid, in the zoomed view and
  for screen readers): `02-asleep-on-keyboard.jpg` shows as "Asleep on keyboard".
- `_intro.md` is the text shown above that pet's photos.
- Optional `_cover.jpg` (or .png/.webp) is the round portrait in the selector.
  Without one, the pet's first photo is used.
- Formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif` (iPhone `.heic` saved as
  `.jpg` is converted automatically at build time). Full-size originals are fine.

To add, remove or reorder pets, edit `PETS` in `src/lib/pets.ts`. `DEFAULT_PET` there is the pet
shown when the tab opens (Peeta for now).
