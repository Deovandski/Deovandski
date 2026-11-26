# Cycling tab

The Cycling tab (Philosophy) shows my rides: totals, distance by year, and how far around the world they add up to
(the half-planet, like the game Reus).

| File | What it holds |
|---|---|
| `story.md` | The tab's text. Edit it by hand. (The "Ridin' with Peeta" section, with its count and video, is in `src/components/CyclingFacet.astro`.) |
| `rides.json` | One line per ride: day, start hour, minutes, distance (km, `estimated` when there was no GPS), kind (`outdoor`, `mountain`, `indoor`), whether the watch caught it on its own (`how: auto`), where it came from, and the watch's average heart rate, calories and climb. Written by `scripts/cycling-from-takeout.mjs`; don't edit it by hand. |
| `estimated.md` | Riding from before the tracking, with distances I estimated: `- Summer 2019 rides: 300 mi`. Edit it by hand. |
| `sources.md` | The studies in the tab's Links box ("Shoulders I stand on"). |

Indoor rides count as rides and time, not distance: a stationary bike goes nowhere. Outdoor, mountain and estimated
rides go round the planet.

## Getting the rides out of Google Health

Google Health is the app the Fitbit app became in 2026; Google Fit's APIs shut down at the end of 2026. Of the ways to
get the data out, **Google Takeout** is the one that gets everything in one go, with no developer setup:

| Way | What you get | Good for |
|---|---|---|
| **Google Takeout** (takeout.google.com) | Every exercise, with distance and time, as JSON (and CSV), plus GPS workouts as TCX files | The whole history, once a year. **Use this.** |
| One workout's **Export as TCX** (Google Health app → Fitness → the ride → ⋮) | That ride's GPS route and heart rate | A single ride you want to map |
| **Google Health API** (`exercise` data points, `exportExerciseTcx`) | The same data, live, over OAuth | Only if the tab ever updates itself; it needs a Google Cloud project and sign-in, so not worth it for a yearly refresh |
| **Health Connect** | What's on the phone | Phone apps only; no way to read it from a website |

### Steps (about once a year, 15 minutes plus Google's wait)

1. Open <https://takeout.google.com>, signed in with the account Google Health uses.
2. **Deselect all**, then tick **Google Health** (on older accounts it may still say **Fitbit**). If you ever used
   **Google Fit**, tick it too: its history has rides from before.
3. **Next step** → export once, `.zip`, then **Create export**. Google emails you when it's ready (minutes to a day).
4. Download and unzip it anywhere **outside the repo** (it holds health data and GPS routes).
5. From the repo's folder:

   ```sh
   node scripts/cycling-from-takeout.mjs ~/Downloads/Takeout
   ```

   (Several folders are fine, if Google split the export: `node scripts/cycling-from-takeout.mjs ~/Downloads/Takeout ~/Downloads/Takeout-2`.)
   It finds the bike rides wherever they are, counts a ride found twice only once, and writes
   `content/cycling/rides.json`. It prints how many rides it found, how many it left out (0-minute logs, or one left
   running for 16 hours) and how much distance it estimated.

### What's in the export (checked against the November 2026 one)

| Where | What the script takes from it |
|---|---|
| `Google Health/Health Fitness Data_GoogleData/UserExercises_<date>.csv` | Every exercise, one CSV per year. Rides are **Bike** and **Outdoor Bike**, either logged on the watch (`TRACKER`) or caught by it on its own (`AUTO_DETECTED`). Times are UTC plus a `utc_offset` column; distance is in millimetres. |
| `Google Health/Physical Activity_GoogleData/Gps Location/gps_location_<date>.csv` | The watch's GPS points (exact places: **never copied**). Only read to measure a ride whose log has no distance; just the total leaves the script. |
| `Fit/All Sessions/*_BIKING.json` and `Fit/Activities/*_Biking.tcx` | A few 2020 rides from Google Fit (a TicWatch), the same rides in both. |

**Rides the watch caught on its own (`AUTO_DETECTED`, `"how": "auto"`) don't count as rides on the tab:** most were me
pushing Peeta in his stroller, or the elliptical when it's too cold outside. The tab counts them only in its
"Ridin' with Peeta" section. The script still writes them, so that section can count them.

Only rides recorded with GPS have a distance. Logged rides without one get a distance estimated from their time at the
median speed of the measured rides (about 13.9 km/h, 8.6 mph); they're marked `"estimated": true`, drawn lighter in the
tab's bars, and explained in its footnote.
6. `npm run build` and open the Cycling tab. Then open a PR with `rides.json`.

**Privacy:** `rides.json` keeps each ride's day, start hour, time, distance, kind and the watch's summary numbers
(average heart rate, calories, climb). No GPS points, routes or places: the export itself never goes in the repo.

Claude can do steps 5 and 6: send it the unzipped export's exercise files (the `exercise-*.json` files, or the Google
Fit `All Sessions` folder), not the whole archive.

## Sleep and heart rate

The same export's sleep and heart rate are on the Biomarker Lab tab (Hearth), with the nights after a ride marked:
see [content/biomarkers/README.md](../biomarkers/README.md).
