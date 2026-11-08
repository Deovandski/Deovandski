# Where has Deo been? (travel photos)

```
content/travel/
  <region>/
    <code>-<country>/
      any-photo.jpg     → a pin for the whole country
      _info.md          (optional)
      <code>-<state>/   → a pin for that state, province or prefecture
        photo.jpg
        _info.md        (optional)
```

- **A pin appears only when a country folder has at least one photo.** Empty
  folders are ignored, so you can create them ahead of time.
- Folder names: two-letter country code, a dash, then the name in lower case,
  e.g. `jp-japan`, `br-brazil`, `us-united-states`. The full list, with the
  exact folder path for every country, is in [COUNTRY_CODES.md](./COUNTRY_CODES.md).
- States, provinces and prefectures: make a subfolder inside the country
  folder, named with its code, e.g. `us-united-states/tx-texas/`,
  `jp-japan/13-tokyo/`, `vn-vietnam/26-thua-thien-hue/`. Each gets its own pin.
  Codes and exact folder names for the US, Canada, Brazil, Vietnam and Japan are
  in [SUBDIVISION_CODES.md](./SUBDIVISION_CODES.md).
- Region folders: `africa`, `antarctica`, `asia`, `europe`, `north-america`,
  `oceania`, `south-america`. They're for your own organizing and group the
  list under the map. The pin position comes from the country code.
- Photo formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`. iPhone `.heic`
  files won't work; export them as JPG first. Photos are shown in filename
  order, so prefix with `01-`, `02-` to control it. The site makes small,
  fast copies automatically; you can upload full-size originals.
- If a folder name is wrong (bad code or format), the build stops and tells
  you which folder to fix.

## Optional `_info.md`

```md
---
name: Japan
years: 2019, 2024
---
Ramen in Osaka, temples in Kyoto, and far too many arcades.
```

`name` overrides the country name, `years` shows under the title, and the
text below the `---` is shown as a caption.
