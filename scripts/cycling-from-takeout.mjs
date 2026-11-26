#!/usr/bin/env node
// Builds content/cycling/rides.json (the Cycling tab's ride log) from a Google Takeout export of Google Health
// (the app that used to be Fitbit) and, if you have one, of Google Fit. See content/cycling/README.md for how to get
// the export.
//
//   node scripts/cycling-from-takeout.mjs ~/Downloads/Takeout [more folders…]
//
// Give it the unzipped Takeout folder (or several: Google Health and Google Fit come as separate exports). It reads,
// wherever they sit inside:
//   - Fitbit/Google Health exercise logs: exercise-*.json (activityName "Bike", "Outdoor Bike", "Mountain Bike"…)
//   - Google Health exercise CSVs with an activity_name column (UserExercises*.csv, exercises*.csv)
//   - Google Fit sessions: Fit/All Sessions/*.json (fitnessActivity "biking", "biking.mountain"…)
//   - TCX workout files (Sport="Biking"), from Takeout or exported one by one from the app
// and keeps only the bike rides. The same ride found twice (a TCX and its log entry) counts once.
//
// Privacy: only each ride's day, start hour, distance, time and kind are kept. No GPS points, no routes, no start
// places, no heart rate: rides.json goes into a public repo. The export itself stays outside the repo.
import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';

const OUT = 'content/cycling/rides.json';
const folders = process.argv.slice(2);
if (!folders.length) {
  console.error('Usage: node scripts/cycling-from-takeout.mjs <unzipped Takeout folder> [more folders…]');
  process.exit(1);
}

// What kind of ride an activity name is: mountain, indoor (no real distance travelled) or outdoor. null: not a bike.
function kindOf(name) {
  const n = String(name ?? '').toLowerCase();
  if (!/bik|cycl|spin/.test(n)) return null;
  if (/mountain|mtb/.test(n)) return 'mountain';
  if (/stationary|indoor|spin|virtual|trainer|ergometer|peloton/.test(n)) return 'indoor';
  return 'outdoor';
}
const MILE = 1.609344;
function toKm(value, unit) {
  const v = Number(value);
  if (!Number.isFinite(v) || v <= 0) return 0;
  const u = String(unit ?? '').toLowerCase();
  if (u.startsWith('mi')) return v * MILE;
  if (u === 'm' || u.startsWith('meter') || u.startsWith('metre')) return v / 1000;
  if (u === 'mm' || u.startsWith('millim')) return v / 1e6;
  return v; // Fitbit's default: kilometres
}
// Fitbit writes "MM/DD/YY HH:MM:SS"; everything else is ISO.
function toDate(s) {
  if (!s) return null;
  const m = String(s).match(/^(\d{2})\/(\d{2})\/(\d{2,4}) (\d{2}):(\d{2})/);
  const d = m ? new Date(`${m[3].length === 2 ? '20' + m[3] : m[3]}-${m[1]}-${m[2]}T${m[4]}:${m[5]}:00`) : new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

const rides = [];
const add = (start, km, minutes, kind, source) => {
  const d = toDate(start);
  if (!d || !kind || !(minutes > 0 || km > 0)) return;
  const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; // local day
  rides.push({ t: d.getTime(), date, hour: d.getHours(), km: Math.round(km * 100) / 100, minutes: Math.round(minutes), kind, source });
};

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

// A tiny CSV reader (quoted fields, commas inside quotes).
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

const seen = { fitbit: 0, csv: 0, fit: 0, tcx: 0 };
for (const folder of folders) {
  for (const file of walk(folder)) {
    const name = basename(file);
    try {
      if (/^exercise-.*\.json$/i.test(name)) {
        for (const e of JSON.parse(readFileSync(file, 'utf8'))) {
          const kind = kindOf(e.activityName);
          if (!kind) continue;
          const ms = Number(e.activeDuration ?? e.duration) || 0;
          add(e.startTime ?? e.originalStartTime, toKm(e.distance, e.distanceUnit), ms / 60000, kind, 'Google Health');
          seen.fitbit++;
        }
      } else if (/\.csv$/i.test(name) && /exercise/i.test(name)) {
        for (const r of csv(readFileSync(file, 'utf8'))) {
          const kind = kindOf(r.activity_name ?? r.activityName ?? r['Activity name']);
          if (!kind) continue;
          const start = r.exercise_start ?? r.start_time ?? r.startTime;
          const end = r.exercise_end ?? r.end_time ?? r.endTime;
          const ms = Number(r.active_duration_ms ?? r.duration_ms) || (toDate(end) && toDate(start) ? toDate(end) - toDate(start) : 0);
          const km = r.tracker_total_distance_mm ? toKm(r.tracker_total_distance_mm, 'mm') : toKm(r.distance ?? r.distance_km, r.distance_units ?? r.distanceUnit);
          add(start, km, ms / 60000, kind, 'Google Health');
          seen.csv++;
        }
      } else if (/\.json$/i.test(name) && /All Sessions/i.test(dirname(file))) {
        const s = JSON.parse(readFileSync(file, 'utf8'));
        const kind = kindOf(s.fitnessActivity);
        if (!kind) continue;
        const meters = (s.aggregate ?? []).find((a) => /distance/.test(a.metricName ?? ''))?.floatValue ?? 0;
        const secs = parseFloat(s.duration) || (toDate(s.endTime) - toDate(s.startTime)) / 1000 || 0;
        add(s.startTime, meters / 1000, secs / 60, kind, 'Google Fit');
        seen.fit++;
      } else if (/\.tcx$/i.test(name)) {
        const x = readFileSync(file, 'utf8');
        const sport = x.match(/<Activity\s+Sport="([^"]+)"/i)?.[1];
        const kind = kindOf(sport === 'Biking' ? 'bike' : sport);
        if (!kind) continue;
        const start = x.match(/<Id>([^<]+)<\/Id>/)?.[1] ?? x.match(/<Lap\s+StartTime="([^"]+)"/)?.[1];
        // Lap totals only (not the per-trackpoint distances, which are running totals).
        const laps = [...x.matchAll(/<Lap[\s\S]*?<\/Lap>/g)].map((l) => l[0]);
        let meters = 0, secs = 0;
        for (const lap of laps) {
          const head = lap.split('<Track>')[0];
          meters += Number(head.match(/<DistanceMeters>([\d.]+)<\/DistanceMeters>/)?.[1] ?? 0);
          secs += Number(head.match(/<TotalTimeSeconds>([\d.]+)<\/TotalTimeSeconds>/)?.[1] ?? 0);
        }
        add(start, meters / 1000, secs / 60, kind, 'TCX');
        seen.tcx++;
      }
    } catch (err) {
      console.warn(`Skipped ${file}: ${err.message}`);
    }
  }
}

// The same ride from two places (a TCX and its log entry, or Fit and Fitbit both recording): starts within
// 3 minutes of each other. Keep the one with a distance, then the longer one.
rides.sort((a, b) => a.t - b.t);
const kept = [];
for (const r of rides) {
  const twin = kept.find((k) => Math.abs(k.t - r.t) < 3 * 60000);
  if (!twin) kept.push(r);
  else if ((r.km > 0 && !(twin.km > 0)) || (r.km > 0 && r.minutes > twin.minutes)) Object.assign(twin, r);
}
const out = kept.map(({ t, ...r }) => r);

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify({ exported: new Date().toISOString().slice(0, 10), rides: out }, null, 1) + '\n');
const km = out.reduce((s, r) => s + (r.kind === 'indoor' ? 0 : r.km), 0);
console.log(`Read ${seen.fitbit} Google Health log rides, ${seen.csv} CSV rides, ${seen.fit} Google Fit rides and ${seen.tcx} TCX rides.`);
console.log(`Wrote ${OUT}: ${out.length} rides (${out.filter((r) => r.kind === 'indoor').length} indoor), ${Math.round(km)} km outdoors.`);
if (!out.length) console.log('No bike rides found. Check the folder is the unzipped export (it has a Fitbit, Google Health or Fit folder inside).');
