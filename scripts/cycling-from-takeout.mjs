#!/usr/bin/env node
// Builds content/cycling/rides.json (the Cycling tab's ride log) from a Google Takeout export of Google Health (the
// app that used to be Fitbit) and, if it's there, Google Fit. See content/cycling/README.md for how to get the export.
//
//   node scripts/cycling-from-takeout.mjs ~/Downloads/Takeout [more folders…]
//
// Give it the unzipped Takeout folder (or several, if Google split the export). What it reads, checked against a real
// export (November 2026):
//   - Google Health/Health Fitness Data_GoogleData/UserExercises_<date>.csv: every exercise, one CSV per year of
//     history. Bike rides are "Bike" and "Outdoor Bike", logged on the watch (TRACKER) or spotted by it on its own
//     (AUTO_DETECTED). Times are UTC with a utc_offset column. Distance is in millimetres
//     (tracker_total_distance_mm, summary_distance_mm or manually_logged_total_distance_mm), and only rides recorded with
//     GPS have one.
//   - Google Health/Physical Activity_GoogleData/Gps Location/gps_location_<date>.csv: the watch's GPS points. Used
//     only to measure a ride's distance when the exercise log has none; no point leaves this script.
//   - Fit/All Sessions/*.json: Google Fit sessions (fitnessActivity "biking"…), with the local offset in the file name.
//   - Older formats too: Fitbit exercise-*.json logs and TCX files (Sport="Biking").
//
// A ride with no distance at all (most auto-detected ones: no GPS) gets one estimated from its time, at the median speed
// of the rides that were measured; it's marked "estimated": true.
//
// Privacy: rides.json keeps each ride's day, start hour, minutes, distance, kind, and the watch's summary numbers (average
// heart rate, calories, elevation gain). No GPS points, routes or places: it goes into a public repo. The export itself
// stays outside the repo.
import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';

const OUT = process.env.CYCLING_OUT || 'content/cycling/rides.json';
const TZ = process.env.CYCLING_TZ || 'America/Chicago'; // for the few sources without an offset (TCX, old Fitbit JSON)
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
const num = (x) => (Number.isFinite(Number(x)) ? Number(x) : 0);
// Local day and hour of a moment: from a known offset (minutes east of UTC), or else in TZ.
function local(ms, offsetMin) {
  if (Number.isFinite(offsetMin)) {
    const d = new Date(ms + offsetMin * 60000);
    return { date: d.toISOString().slice(0, 10), hour: d.getUTCHours() };
  }
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(ms)).map((x) => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, hour: Number(p.hour) };
}
const offsetOf = (s) => {
  const m = String(s ?? '').match(/([+-])(\d{2})[:_]?(\d{2})/);
  return m ? (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3])) : NaN;
};

const rides = [];
function add(r) {
  if (!r.kind || !Number.isFinite(r.start) || !Number.isFinite(r.end)) return;
  rides.push(r);
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

// A small CSV reader (quoted fields, commas and newlines inside quotes).
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

const seen = { csv: 0, json: 0, fit: 0, tcx: 0 };
const gpsFiles = new Map(); // "YYYY-MM-DD" (UTC) -> path; read only for rides that need it
for (const folder of folders) {
  for (const file of walk(folder)) {
    const name = basename(file);
    try {
      if (/^gps_location_(\d{4}-\d{2}-\d{2})\.csv$/i.test(name)) {
        gpsFiles.set(name.match(/(\d{4}-\d{2}-\d{2})/)[1], file);
      } else if (/\.csv$/i.test(name) && /exercise/i.test(name)) {
        for (const r of csv(readFileSync(file, 'utf8'))) {
          const kind = kindOf(r.activity_name);
          if (!kind) continue;
          const mm = Math.max(num(r.summary_distance_mm), num(r.tracker_total_distance_mm), num(r.manually_logged_total_distance_mm));
          add({
            id: r.exercise_id,
            start: Date.parse(r.exercise_start),
            end: Date.parse(r.exercise_end),
            offset: offsetOf(r.utc_offset),
            km: mm / 1e6,
            kind,
            how: r.log_type === 'AUTO_DETECTED' ? 'auto' : 'logged',
            hr: num(r.summary_avg_heart_rate) || num(r.tracker_avg_heart_rate),
            kcal: num(r.summary_calories_kcal) || num(r.tracker_total_calories) || num(r.manually_logged_total_calories),
            climb: (num(r.summary_elevation_gain_mm) || num(r.tracker_total_altitude_mm)) / 1000,
            source: 'Google Health',
          });
          seen.csv++;
        }
      } else if (/^exercise-.*\.json$/i.test(name)) {
        for (const e of JSON.parse(readFileSync(file, 'utf8'))) {
          const kind = kindOf(e.activityName);
          if (!kind) continue;
          const m = String(e.startTime ?? '').match(/^(\d{2})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
          if (!m) continue;
          // Old Fitbit times are local, without an offset: read them in TZ, using the offset at that moment.
          const guess = Date.UTC(2000 + Number(m[3]), Number(m[1]) - 1, Number(m[2]), Number(m[4]), Number(m[5]), Number(m[6]));
          const off = offsetOf(new Intl.DateTimeFormat('en-US', { timeZone: TZ, timeZoneName: 'longOffset' }).format(new Date(guess)));
          const start = guess - (Number.isFinite(off) ? off : 0) * 60000;
          const unit = String(e.distanceUnit ?? '').toLowerCase();
          add({
            id: String(e.logId ?? ''),
            start,
            end: start + num(e.activeDuration ?? e.duration),
            offset: off,
            km: num(e.distance) * (unit.startsWith('mi') ? 1.609344 : 1),
            kind,
            how: e.logType === 'auto_detected' ? 'auto' : 'logged',
            hr: num(e.averageHeartRate),
            kcal: num(e.calories),
            climb: 0,
            source: 'Fitbit',
          });
          seen.json++;
        }
      } else if (/\.json$/i.test(name) && /All Sessions/i.test(dirname(file))) {
        const s = JSON.parse(readFileSync(file, 'utf8'));
        const kind = kindOf(s.fitnessActivity);
        if (!kind) continue;
        const agg = (k) => (s.aggregate ?? []).find((a) => a.metricName === k);
        add({
          id: `fit-${s.startTime}`,
          start: Date.parse(s.startTime),
          end: Date.parse(s.endTime),
          offset: offsetOf(name.slice(19)), // the file name carries the local offset: 2020-06-13T21_08_59.094-05_00_BIKING.json
          km: (agg('com.google.distance.delta')?.floatValue ?? 0) / 1000,
          kind,
          how: 'logged',
          hr: 0,
          kcal: agg('com.google.calories.expended')?.floatValue ?? 0,
          climb: 0,
          source: 'Google Fit',
        });
        seen.fit++;
      } else if (/\.tcx$/i.test(name)) {
        const x = readFileSync(file, 'utf8');
        const sport = x.match(/<Activity\s+Sport="([^"]+)"/i)?.[1];
        const kind = kindOf(sport === 'Biking' ? 'bike' : sport);
        if (!kind) continue;
        const startIso = x.match(/<Id>([^<]+)<\/Id>/)?.[1] ?? x.match(/<Lap\s+StartTime="([^"]+)"/)?.[1];
        let meters = 0, secs = 0;
        for (const lap of x.matchAll(/<Lap[\s\S]*?<\/Lap>/g)) {
          const head = lap[0].split('<Track>')[0]; // lap totals, not the trackpoints' running totals
          meters += num(head.match(/<DistanceMeters>([\d.]+)<\/DistanceMeters>/)?.[1]);
          secs += num(head.match(/<TotalTimeSeconds>([\d.]+)<\/TotalTimeSeconds>/)?.[1]);
        }
        const start = Date.parse(startIso);
        add({ id: `tcx-${startIso}`, start, end: start + secs * 1000, offset: offsetOf(name.slice(19)), km: meters / 1000, kind, how: 'logged', hr: 0, kcal: 0, climb: 0, source: 'TCX' });
        seen.tcx++;
      }
    } catch (err) {
      console.warn(`Skipped ${file}: ${err.message}`);
    }
  }
}

// One ride, once: the same id, or starts within 3 minutes (the same ride from two sources, like a Fit session and its TCX).
rides.sort((a, b) => a.start - b.start);
const kept = [];
for (const r of rides) {
  const twin = kept.find((k) => (r.id && k.id === r.id) || Math.abs(k.start - r.start) < 3 * 60000);
  if (!twin) kept.push(r);
  else {
    // Merge: the longer distance and time, and whatever summary numbers either one has.
    twin.km = Math.max(twin.km, r.km);
    twin.end = Math.max(twin.end, r.end);
    twin.hr ||= r.hr;
    twin.kcal ||= r.kcal;
    twin.climb ||= r.climb;
  }
}

// Sanity: a few logs are 0 minutes long, or ran on for hours after the ride (a forgotten stop button).
const MIN_MIN = 5, MAX_MIN = 360;
const dropped = [];
const ok = kept.filter((r) => {
  const minutes = (r.end - r.start) / 60000;
  if (minutes >= MIN_MIN && minutes <= MAX_MIN) return true;
  dropped.push(`${local(r.start, r.offset).date} (${Math.round(minutes)} min)`);
  return false;
});

// Distance from the watch's GPS, for rides that have GPS points but no distance in the log.
const R = 6371;
const toRad = (d) => (d * Math.PI) / 180;
const gpsCache = new Map();
function gpsDay(day) {
  if (!gpsFiles.has(day)) return [];
  if (!gpsCache.has(day)) {
    const pts = csv(readFileSync(gpsFiles.get(day), 'utf8'))
      .map((p) => ({ t: Date.parse(p.timestamp), la: num(p.latitude), lo: num(p.longitude) }))
      .filter((p) => Number.isFinite(p.t) && (p.la || p.lo));
    pts.sort((a, b) => a.t - b.t);
    gpsCache.set(day, pts.filter((p, i) => i === 0 || p.t !== pts[i - 1].t)); // the app and the watch both log each point
  }
  return gpsCache.get(day);
}
let gpsMeasured = 0;
for (const r of ok) {
  if (r.km > 0.3 || r.kind === 'indoor') continue;
  const days = new Set([new Date(r.start).toISOString().slice(0, 10), new Date(r.end).toISOString().slice(0, 10)]);
  const pts = [...days].flatMap(gpsDay).filter((p) => p.t >= r.start && p.t <= r.end);
  let km = 0;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i];
    const h = Math.sin(toRad(b.la - a.la) / 2) ** 2 + Math.cos(toRad(a.la)) * Math.cos(toRad(b.la)) * Math.sin(toRad(b.lo - a.lo) / 2) ** 2;
    const d = 2 * R * Math.asin(Math.sqrt(h));
    const hours = (b.t - a.t) / 3600000;
    if (hours > 0 && d / hours < 60) km += d; // skip GPS jumps
  }
  if (pts.length > 20 && km > 0.3) { r.km = km; gpsMeasured++; }
}

// Rides with no distance: estimated from their time at the median speed of the measured outdoor rides.
const speeds = ok.filter((r) => r.kind !== 'indoor' && r.km > 0.3).map((r) => r.km / ((r.end - r.start) / 3600000)).sort((a, b) => a - b);
const median = speeds.length ? speeds[Math.floor(speeds.length / 2)] : 14;
let estimated = 0;
const out = ok.map((r) => {
  const minutes = (r.end - r.start) / 60000;
  const { date, hour } = local(r.start, r.offset);
  const ride = { date, hour, minutes: Math.round(minutes), km: Math.round(r.km * 100) / 100, kind: r.kind, how: r.how, source: r.source };
  if (r.kind !== 'indoor' && !(r.km > 0.3)) {
    ride.km = Math.round(median * (minutes / 60) * 100) / 100;
    ride.estimated = true;
    estimated++;
  }
  if (r.hr) ride.hr = Math.round(r.hr);
  if (r.kcal) ride.kcal = Math.round(r.kcal);
  if (r.climb > 0) ride.climbM = Math.round(r.climb);
  return ride;
});

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify({ exported: new Date().toISOString().slice(0, 10), medianKmh: Math.round(median * 10) / 10, rides: out }, null, 1) + '\n');
const sum = (f) => out.reduce((s, r) => s + f(r), 0);
console.log(`Read ${seen.csv} Google Health rides, ${seen.json} Fitbit, ${seen.fit} Google Fit and ${seen.tcx} TCX rides (${rides.length - kept.length} were the same ride twice).`);
if (dropped.length) console.log(`Left out ${dropped.length} logs shorter than ${MIN_MIN} min or longer than ${MAX_MIN / 60} h: ${dropped.join(', ')}.`);
console.log(`Wrote ${OUT}: ${out.length} rides, ${Math.round(sum((r) => r.minutes) / 60)} h.`);
console.log(`  Measured: ${out.length - estimated} rides, ${Math.round(sum((r) => (r.estimated ? 0 : r.km)))} km (${gpsMeasured} from the GPS points).`);
console.log(`  Estimated: ${estimated} rides with no distance, ${Math.round(sum((r) => (r.estimated ? r.km : 0)))} km at ${median.toFixed(1)} km/h.`);
