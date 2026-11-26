#!/usr/bin/env node
// The yearly Google Takeout refresh in one command (see TAKEOUT.md):
//
//   npm run takeout -- ~/Downloads/Takeout [more folders…]
//
// 1. scripts/cycling-from-takeout.mjs    → content/cycling/rides.json      (Cycling tab)
// 2. scripts/biomarkers-from-takeout.mjs → content/biomarkers/daily.json   (Biomarker Lab tab)
//                                        → content/gym/body-fat.json       (Gym chart)
// 3. A privacy check on those three files: only the keys we expect, nothing that looks like a place. If anything
//    else turns up (a new field, a latitude), it stops with an error and the files must not be committed.
//
// npm run takeout -- --check runs only step 3, on the files already there.
//
// TAKEOUT_OUT=<folder> writes the three files into that folder instead of content/ (for a run outside the repo,
// e.g. Claude running it on Deo's computer next to the export). The three scripts only need each other: copy them
// together.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const checkOnly = process.argv[2] === '--check';
const folders = process.argv.slice(2).filter((a) => a !== '--check');
if (!folders.length && !checkOnly) {
  console.error('Usage: npm run takeout -- <unzipped Takeout folder> [more folders…]   (see TAKEOUT.md)');
  process.exit(1);
}
const outDir = process.env.TAKEOUT_OUT;
const out = {
  rides: outDir ? join(outDir, 'rides.json') : 'content/cycling/rides.json',
  daily: outDir ? join(outDir, 'daily.json') : 'content/biomarkers/daily.json',
  fat: outDir ? join(outDir, 'body-fat.json') : 'content/gym/body-fat.json',
};
const env = { ...process.env, CYCLING_OUT: out.rides, BIOMARKERS_OUT: out.daily, BODY_FAT_OUT: out.fat };

for (const script of checkOnly ? [] : ['cycling-from-takeout.mjs', 'biomarkers-from-takeout.mjs']) {
  console.log(`\n== ${script}`);
  const r = spawnSync(process.execPath, [join(here, script), ...folders], { stdio: 'inherit', env });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

// ---- privacy check ----
const ALLOWED = {
  rides: { top: ['exported', 'medianKmh', 'rides'], item: ['date', 'hour', 'minutes', 'km', 'kind', 'how', 'source', 'estimated', 'hr', 'kcal', 'climbM'], list: 'rides' },
  daily: { top: ['exported', 'tz', 'days'], item: ['date', 'rhr', 'hrv', 'spo2', 'resp', 'ready', 'skinC', 'stress', 'sleepMin', 'bedH', 'sleepScore', 'deep', 'rem', 'steps', 'azm', 'exWalk', 'exBike', 'exCardio', 'exRun', 'exStrength', 'exOther'], list: 'days' },
  fat: { top: ['note', 'years'], item: ['year', 'percent', 'readings'], list: 'years' },
};
const problems = [];
for (const [k, rule] of Object.entries(ALLOWED)) {
  const file = out[k];
  const text = readFileSync(file, 'utf8');
  const data = JSON.parse(text);
  for (const key of Object.keys(data)) if (!rule.top.includes(key)) problems.push(`${file}: unexpected field "${key}"`);
  const extra = new Set();
  for (const item of data[rule.list] ?? []) for (const key of Object.keys(item)) if (!rule.item.includes(key)) extra.add(key);
  for (const key of extra) problems.push(`${file}: unexpected field "${key}" in ${rule.list}`);
  if (/"(lat|lng|lon|latitude|longitude|location|place|route|address|glucose|insulin)"\s*:/i.test(text)) problems.push(`${file}: has a location or medical field`);
}
if (problems.length) {
  console.error(`\nPRIVACY CHECK FAILED. Don't commit these files:\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log(`\nPrivacy check passed: ${Object.values(out).join(', ')} hold dates and numbers only.`);
if (!outDir && !checkOnly) console.log('Next: npm run build, look at the Cycling, Biomarker Lab and Gym tabs, then open a PR with those three files.');
