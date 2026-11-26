# Biomarker Lab tab

The Biomarker Lab tab (Hearth) shows what my watch logs every day: heart, sleep, breathing, steps and more, in five views
(timeline, after exercise, calendar, seasons, compare) under group boxes of checkboxes (years, seasons, days of the
week, nights after exercise or a rest day, and which kinds of exercise count). The views are the reusable
`MetricLab` component (`src/components/reusable/MetricLab.astro`).

| File | What it holds |
|---|---|
| `story.md` | The tab's text ("The body is the temple"). Edit it by hand. |
| `daily.json` | One line per day: the numbers below. Written by `scripts/biomarkers-from-takeout.mjs`; don't edit it by hand. |
| `norms.json` | The dashed "men my age" lines: for each metric, [age, value] points from a study, the line's label, and the study's link (shown in the tab's Links box). Ages count from the middle of `bornYear`: the exact birthday stays out of the repo. Edit it by hand. |

The page gets the data from `/biomarkers.json` (`src/pages/biomarkers.json.ts`), which adds each day's total exercise
(`exMin`) to `daily.json`. The lab marks exercise days (any ticked kind) and the nights after them. The lab only downloads it
the first time it's opened, so the home page stays light.

## What's in daily.json

| Key | What | From (in the export) |
|---|---|---|
| `rhr` | Resting heart rate, bpm | `Physical Activity_GoogleData/Daily Resting Heart Rate/` |
| `hrv` | Heart rate variability, ms | `Daily Heart Rate Variability/` |
| `spo2` | Blood oxygen, % | `Daily Oxygen Saturation/` |
| `resp` | Breathing rate while asleep, breaths a minute | `Daily Respiratory Rate/` |
| `ready` | Readiness score (from September 2024) | `Daily Readiness/` |
| `vo2` | Cardio fitness (VO₂ max) | `Demographic Vo2max/` |
| `skinC` | Skin temperature at night, °C (the tab shows °F) | `Daily Sleep Temperature Derivations/` |
| `stress` | Stress score | `Stress Score/Stress Score.csv` |
| `sleepMin`, `bedH` | Minutes asleep and bedtime (hour of the day; past midnight counts on, so 1 am is 25) | `Health Fitness Data_GoogleData/UserSleeps_*.csv` |
| `sleepScore`, `deep`, `rem` | Sleep score, deep sleep minutes, REM % | `Health Fitness Data_GoogleData/UserSleepScores_*.csv` |
| `steps`, `azm` | Steps and active zone minutes, added up by local day | `Steps/`, `Active Zone Minutes/` (per minute) |
| `exWalk`, `exBike`, `exCardio`, `exRun`, `exStrength`, `exOther` | Minutes of exercise that day by kind: walks; bike rides I logged; the elliptical, rowing and aerobics; runs; strength training; everything else (rides the watch caught on its own, sports, swims). Sessions of 10 minutes to 6 hours. | `Health Fitness Data_GoogleData/UserExercises_*.csv` (only the activity name, log type and start and end times; never `location_metadata`) |

Gym sessions only count if the watch logged them (as "Strength training" or "Weights"); until late 2026 almost none
were, so the gym mostly isn't in "exercise" yet.

A night belongs to the day you wake up. Times, checked against the November 2026 export: the daily files are one row
per day; steps and zone minutes are per minute in UTC (the script adds them up by day in `America/Chicago`, or
`BIOMARKERS_TZ`); a sleep with a `+00:00` offset is already in local time (2023 to mid 2025), any other offset means UTC.

**Body fat** isn't in the lab: the script writes one average per year to `content/gym/body-fat.json`, and the Gym tab
draws it under the weight chart. Weight stays the Gym tab's own hand-written table.

## Updating it

Get a Takeout export as in [content/cycling/README.md](../cycling/README.md) (the same export does both tabs), unzip it
**outside the repo**, then from the repo's folder:

```sh
npm run takeout -- ~/Downloads/Takeout   # both scripts, then the privacy check
npm run build
```

Claude can do it too: [TAKEOUT.md](../../TAKEOUT.md) has the steps. Open a PR with `content/biomarkers/daily.json`, `content/gym/body-fat.json` (and `content/cycling/rides.json`).

## Privacy: what never goes in the repo

The script reads an **allowlist**: only the folders and files in the table above, plus `Body Fat/`. It never opens
anything else, so these stay out of the repo, the data files and the site, now and in later exports:

- **Blood glucose** (`Biometrics/Glucose *.csv`), **insulin resistance** (`general_DailyInsulinResistance`) and
  **blood pressure** (`general_BloodPressureAssessment`).
- **Surveys** (`SURVEYS_GoogleData`, `LabsSurveyAnswerRecords.csv`), **moods**, **journal entries** and **food and
  nutrition logs**.
- **ECG and AFib** records, and the raw heart rate, SpO₂ and temperature readings behind the daily numbers.
- **GPS points, routes and places** of any kind.

To add a metric, add its folder to the allowlist in the script on purpose, and check with Deo first. The export itself
stays outside the repo.
