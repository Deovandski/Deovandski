# Cycling tab

The Cycling tab (Philosophy) shows my rides: totals, distance by year, and how far around the world they add up to
(the half-planet, like the game Reus).

| File | What it holds |
|---|---|
| `story.md` | The tab's text. Edit it by hand. |
| `rides.json` | One line per ride: day, start hour, distance (km), minutes, kind (`outdoor`, `mountain`, `indoor`) and where it came from. Written by `scripts/cycling-from-takeout.mjs`; don't edit it by hand. |
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
   It finds the bike rides wherever they are (Google Health/Fitbit exercise logs, exercise CSVs, Google Fit sessions,
   TCX files), counts a ride found twice only once, and writes `content/cycling/rides.json`. It prints how many rides it
   found.
6. `npm run build` and open the Cycling tab. Then open a PR with `rides.json`.

**Privacy:** `rides.json` keeps only each ride's day, start hour, distance, time and kind. No GPS points, no routes, no
start places, no heart rate: the export itself never goes in the repo.

Claude can do steps 5 and 6: send it the unzipped export's exercise files (the `exercise-*.json` files, or the Google
Fit `All Sessions` folder), not the whole archive.

## Ideas for later

The same Takeout export also has sleep and heart rate. With them the tab could show, for example, sleep on ride days
against days off, or what time of day the rides happen (the start hour is already in `rides.json`).
