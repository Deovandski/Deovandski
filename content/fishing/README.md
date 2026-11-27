# Fishing photos

The Fishing tab (#111): text, a YouTube Short, more text, then the photos. The photos work like a pet's gallery on the
Pets tab (`content/pets/peeta/`): drop them straight into this folder and push.

- Formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif` (iPhone `.heic` saved as
  `.jpg` is converted automatically at build time).
- Order: photos are shown in filename order, so start each name with the day it was taken (and the time, HHMMSS, when
  there are several that day): `2023-02-07-125838-Saying-hi-to-Willie-Walleye-in-Baudette.jpg`.
- Descriptions: the filename becomes the photo's caption on the grid
  (above the photo), in the zoomed view and for screen readers, and the date shows under it in the zoomed view:
  `2023-02-08-094825-Fillets-ready.jpg` shows as "Fillets ready".
- Full-size originals are fine; the site makes small, fast copies.
- Strip the photo's location data before pushing (phones save GPS in every picture).
- `story.md` is the text above the YouTube Short, `more.md` the text below it. Edit them freely.
