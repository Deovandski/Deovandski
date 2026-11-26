#!/usr/bin/env node
// Builds the Biomarker Lab's data (content/biomarkers/daily.json) and the Gym tab's yearly body fat
// (content/gym/body-fat.json) from a Google Takeout export of Google Health. See content/biomarkers/README.md.
//
//   node scripts/biomarkers-from-takeout.mjs ~/Downloads/Takeout [more folders…]
//
// It reads ONLY the folders and files in READ below (an allowlist). Everything else in the export is never opened:
// blood glucose (Biometrics/Glucose *.csv), insulin resistance, blood pressure, ECG and AFib, surveys, moods, journal,
// food and nutrition logs, and every GPS file. None of that goes in the repo, not even through this script.
//
// What it writes, one line per day: resting heart rate, heart rate variability, blood oxygen, breathing rate, readiness,
// cardio fitness (VO2 max), skin temperature, stress score, sleep (minutes, bedtime, score, deep, REM), steps, active
// zone minutes, and minutes of exercise by kind (walk, bike, cardio machine, run, strength, other) from the watch's
// exercise log. Dates and numbers only: no places (the exercise log's location_metadata column is never read). Weight and body fat stay out of daily.json; body fat leaves the
// script only as one average per year, for the Gym chart.
//
// Times, checked against the November 2026 export:
//   - Daily summaries (resting heart rate, HRV, …) are one row per day, stamped "YYYY-MM-DDT00:00:00Z": that date is the day.
//   - Steps and active zone minutes are per minute, in real UTC: they're added up by local day in TZ.
//   - Sleeps and sleep scores carry a utc_offset. When it's "+00:00" the times are already local (2023 to mid 2025);
//     otherwise they're UTC and the offset makes them local. A night belongs to the day you wake up.
import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';

const OUT = process.env.BIOMARKERS_OUT || 'content/biomarkers/daily.json';
const FAT_OUT = process.env.BODY_FAT_OUT || 'content/gym/body-fat.json';
const TZ = process.env.BIOMARKERS_TZ || 'America/Chicago';
const folders = process.argv.slice(2);
if (!folders.length) {
  console.error('Usage: node scripts/biomarkers-from-takeout.mjs <unzipped Takeout folder> [more folders…]');
  process.exit(1);
}

// The allowlist: a folder name (any depth) and the column to take, or a file-name pattern.
const DAILY = {
  'Daily Resting Heart Rate': ['rhr', 'beats per minute', 1],
  'Daily Heart Rate Variability': ['hrv', 'average heart rate variability milliseconds', 1],
  'Daily Oxygen Saturation': ['spo2', 'average percentage', 1],
  'Daily Respiratory Rate': ['resp', 'breaths per minute', 1],
  'Daily Readiness': ['ready', 'score', 0],
  'Demographic Vo2max': ['vo2', 'demographic vo2max', 1],
  'Daily Sleep Temperature Derivations': ['skinC', 'nightly temperature celsius', 2],
};
const PER_MINUTE = { Steps: ['steps', 'steps'], 'Active Zone Minutes': ['azm', 'total minutes'] };
const READ = new Set([...Object.keys(DAILY), ...Object.keys(PER_MINUTE), 'Body Fat']);
const FILES = [/^Stress Score\.csv$/i, /^UserSleeps_.*\.csv$/i, /^UserSleepScores_.*\.csv$/i, /^UserExercises_.*\.csv$/i];

// Exercise kinds, from the log's activity_name. Bike rides count as "bike" only when logged (TRACKER), as on the Cycling
// tab: the ones the watch caught on its own were mostly Peeta's stroller or the elliptical, so they're "other".
// Sessions under 10 minutes or over 6 hours (a log left running) don't count.
function exerciseKind(name, logType) {
  const n = String(name ?? '').toLowerCase();
  if (/bik|cycl|spin/.test(n)) return logType === 'AUTO_DETECTED' ? 'exOther' : 'exBike';
  if (/run|jog/.test(n)) return 'exRun';
  if (/walk|hike/.test(n)) return 'exWalk';
  if (/ellipt|rowing|stair|aerobic|cardio/.test(n)) return 'exCardio';
  if (/strength|weight|lift|crossfit|circuit/.test(n)) return 'exStrength';
  return 'exOther';
}

// Lists file names only; a file is opened only if it passes the allowlist.
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}
function csv(text) {
  const rows = [];
  let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [head, ...body] = rows.filter((r) => r.some((x) => x !== ''));
  return body.map((r) => Object.fromEntries((head ?? []).map((h, i) => [h.trim(), r[i]])));
}
const val = (x) => {
  const v = Number(x);
  return x !== '' && x != null && Number.isFinite(v) ? v : null;
};
const round = (v, d) => Math.round(v * 10 ** d) / 10 ** d;
const fmtDay = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' });
const localDay = (iso) => fmtDay.format(new Date(iso)); // a real-UTC moment → its day in TZ
// A sleep or exercise time with its offset → local { date, hour }. "+00:00" means the time is already local.
function sleepLocal(iso, off) {
  const m = String(off ?? '').match(/([+-])(\d{2}):?(\d{2})/);
  const mins = m ? (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3])) : 0;
  const d = new Date(Date.parse(iso.replace(/Z$/, '') + 'Z') + mins * 60000);
  return { date: d.toISOString().slice(0, 10), hour: d.getUTCHours() + d.getUTCMinutes() / 60 };
}

const days = new Map();
const day = (d) => days.get(d) ?? days.set(d, {}).get(d);
const perMinute = { steps: new Map(), azm: new Map() };
const fat = new Map(); // year → [percent…]
const sleepLen = new Map();
const read = { files: 0, skipped: 0 };

for (const folder of folders) {
  for (const file of walk(folder)) {
    const name = basename(file), parent = basename(dirname(file));
    const allowed = (READ.has(parent) && /\.csv$/i.test(name)) || FILES.some((re) => re.test(name));
    if (!allowed) { read.skipped++; continue; }
    read.files++;
    const rows = csv(readFileSync(file, 'utf8'));
    if (DAILY[parent]) {
      const [key, col, d] = DAILY[parent];
      for (const r of rows) { const v = val(r[col]); if (v != null && r.timestamp) day(r.timestamp.slice(0, 10))[key] = round(v, d); }
    } else if (PER_MINUTE[parent]) {
      const [key, col] = PER_MINUTE[parent];
      for (const r of rows) { const v = val(r[col]); if (v && r.timestamp) { const d = localDay(r.timestamp); perMinute[key].set(d, (perMinute[key].get(d) ?? 0) + v); } }
    } else if (parent === 'Body Fat') {
      for (const r of rows) { const v = val(r['body fat percentage']); if (v && r.timestamp) { const y = Number(localDay(r.timestamp).slice(0, 4)); (fat.get(y) ?? fat.set(y, []).get(y)).push(v); } }
    } else if (/^Stress Score/i.test(name)) {
      for (const r of rows) { const v = val(r.STRESS_SCORE); if (v && r.DATE) day(r.DATE.slice(0, 10)).stress = v; }
    } else if (/^UserSleeps_/i.test(name)) {
      for (const r of rows) {
        const mins = val(r.minutes_asleep);
        if (!mins || !r.sleep_start || !r.sleep_end) continue;
        const wake = sleepLocal(r.sleep_end, r.end_utc_offset).date;
        if (mins <= (sleepLen.get(wake) ?? 0)) continue; // a nap: the day keeps its main sleep
        sleepLen.set(wake, mins);
        const bed = sleepLocal(r.sleep_start, r.start_utc_offset).hour;
        Object.assign(day(wake), { sleepMin: mins, bedH: round(bed < 12 ? bed + 24 : bed, 2) }); // 1 am → 25
      }
    } else if (/^UserExercises_/i.test(name)) {
      for (const r of rows) {
        if (!r.exercise_start || !r.exercise_end) continue;
        const mins = (Date.parse(r.exercise_end) - Date.parse(r.exercise_start)) / 60000;
        if (!(mins >= 10 && mins <= 360)) continue;
        const d = day(sleepLocal(r.exercise_start, r.utc_offset).date), k = exerciseKind(r.activity_name, r.log_type);
        d[k] = Math.round((d[k] ?? 0) + mins);
      }
    } else if (/^UserSleepScores_/i.test(name)) {
      for (const r of rows) {
        if (!r.score_time) continue;
        const d = day(sleepLocal(r.score_time, r.score_utc_offset).date);
        const s = val(r.overall_score), deep = val(r.deep_sleep_minutes), rem = val(r.rem_sleep_percent);
        if (s) d.sleepScore = Math.round(s);
        if (deep) d.deep = deep;
        if (rem) d.rem = round(rem, 1);
      }
    }
  }
}
for (const [key, m] of Object.entries(perMinute)) for (const [d, v] of m) day(d)[key] = Math.round(v);

const ORDER = ['rhr', 'hrv', 'spo2', 'resp', 'ready', 'vo2', 'skinC', 'stress', 'sleepMin', 'bedH', 'sleepScore', 'deep', 'rem', 'steps', 'azm', 'exWalk', 'exBike', 'exCardio', 'exRun', 'exStrength', 'exOther'];
const list = [...days].filter(([, v]) => Object.keys(v).length).sort(([a], [b]) => a.localeCompare(b));
// Leading days with only a few steps (the watch's first hours) don't start the record.
while (list.length && Object.keys(list[0][1]).length < 2) list.shift();
const lines = list.map(([date, v]) => JSON.stringify({ date, ...Object.fromEntries(ORDER.filter((k) => v[k] != null).map((k) => [k, v[k]])) }));
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, `{"exported":"${new Date().toISOString().slice(0, 10)}","tz":"${TZ}","days":[\n${lines.join(',\n')}\n]}\n`);

const years = [...fat].sort(([a], [b]) => a - b).map(([year, a]) => ({ year, percent: round(a.reduce((s, v) => s + v, 0) / a.length, 1), readings: a.length }));
mkdirSync(dirname(FAT_OUT), { recursive: true });
writeFileSync(FAT_OUT, JSON.stringify({ note: 'Yearly average of the smart scale body fat readings. Written by scripts/biomarkers-from-takeout.mjs.', years }, null, 2) + '\n');

console.log(`Read ${read.files} files (${read.skipped} others never opened). ${lines.length} days, ${list[0]?.[0]} to ${list.at(-1)?.[0]} → ${OUT}`);
for (const k of ORDER) console.log(`  ${k.padEnd(10)} ${list.filter(([, v]) => v[k] != null).length} days`);
console.log(`Body fat by year → ${FAT_OUT}: ${years.map((y) => `${y.year} ${y.percent}% (${y.readings})`).join(', ') || 'none'}`);
