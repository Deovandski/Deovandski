# Refreshing the health data from Google Takeout

Three tabs read numbers from my Google Health (ex-Fitbit) export: **Cycling** (Philosophy), **Biomarker Lab** (Hearth)
and the body fat chart on **Gym** (Philosophy). About once a year, get a new export and run one command.

| Script | Writes | Details |
|---|---|---|
| `scripts/takeout.mjs` (`npm run takeout`) | runs the two below, then a privacy check | this file |
| `scripts/cycling-from-takeout.mjs` | `content/cycling/rides.json` | [content/cycling/README.md](content/cycling/README.md) |
| `scripts/biomarkers-from-takeout.mjs` | `content/biomarkers/daily.json`, `content/gym/body-fat.json` | [content/biomarkers/README.md](content/biomarkers/README.md) |

## Steps (15 minutes, plus Google's wait)

1. Open <https://takeout.google.com>, signed in with the account Google Health uses.
2. **Deselect all**, then tick **Google Health** (on older accounts it may say **Fitbit**). Tick **Google Fit** too if
   it's there: it has rides from 2020.
3. **Next step** → export once, `.zip`, **Create export**. Google emails you when it's ready.
4. Download and unzip it **outside the repo**, e.g. `~/Downloads/Takeout`. It holds health records and GPS routes.
5. From the repo's folder:

   ```sh
   npm run takeout -- ~/Downloads/Takeout
   ```

   It prints what it found (rides, days, body fat by year) and ends with **"Privacy check passed"**. If it says
   **PRIVACY CHECK FAILED**, don't commit anything: a script picked up a field it shouldn't have.
6. `npm run build`, open the three tabs, and open a PR with the three files.

## What never goes in the repo

- **The export itself**, or any file copied out of it.
- **GPS points, routes and places.** `cycling-from-takeout.mjs` reads the GPS files only to measure a ride with no
  distance, on your computer. Only the total leaves it.
- **Medical records:** blood glucose, insulin resistance, blood pressure, ECG and AFib, surveys, moods, journal, food
  and nutrition logs. `biomarkers-from-takeout.mjs` reads an allowlist of folders and never opens these.
- Weight stays the Gym tab's own hand-written table. Body fat leaves the scripts only as one average per year.

The privacy check (`npm run takeout -- --check` on its own) fails on any field it doesn't know, or anything named like a
place or a medical record.

## When Claude does it

Claude works in the cloud; the export stays on Deo's computer. So the scripts go to the export, not the other way round.

1. **Get to the export.** Ask Deo for the unzipped folder through the desktop app's folder access (on Windows it has
   been `C:\Users\Deova\Downloads\Takeout`). Never stage the zip, the GPS files or the medical folders into the cloud.
2. **Copy the three scripts to Deo's computer** (`scripts/takeout.mjs`, `scripts/cycling-from-takeout.mjs`,
   `scripts/biomarkers-from-takeout.mjs`) into a scratch folder there, **not inside the export**. The device shell
   has Node; a small file goes across as `base64 -w0` of a gzip, decoded with `base64 -d | gunzip` on the other side.
3. **Run it there**, writing next to the scripts:

   ```sh
   TAKEOUT_OUT="$HOME/takeout-out" node takeout.mjs "$HOME/mnt/Takeout"
   ```

   Read its output: rides, days, the body fat years, and "Privacy check passed".
4. **Bring back only the three output files.** Copy them into a `_for-claude` folder inside the export (so they can
   be staged), stage those three, and put them in `content/cycling/rides.json`, `content/biomarkers/daily.json` and
   `content/gym/body-fat.json`. Run `npm run takeout -- --check` in the repo too.
5. **Build and look:** compare the counts with the last PR (rides, days, years), open the Cycling, Biomarker Lab and
   Gym tabs at 1280px and 412px, then open the PR. Tell Deo the `_for-claude` folder can be deleted.

### If the export changed

Google changes the export now and then. If a script finds nothing (0 rides, 0 days), look at the folder and file
names and the first lines of the CSVs, fix the script, and update the "checked against" notes in the two READMEs.
Things already learned:

- Exercises: `Health Fitness Data_GoogleData/UserExercises_<date>.csv`, UTC times plus a `utc_offset`, distance in mm.
- Steps and active zone minutes are per minute in **real UTC**: add them up by local day.
- Sleeps and sleep scores: a `+00:00` offset means the time is **already local** (2023 to mid 2025); any other offset
  means UTC.
- Daily summaries (resting heart rate, HRV, …) are one row per day stamped `T00:00:00Z`: that date is the day.

**A new metric is Deo's call.** Ask before adding a folder to the biomarkers allowlist, and never add the medical ones.
