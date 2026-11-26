import type { APIRoute } from 'astro';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// The Biomarker Lab's data (Hearth › Biomarker Lab), one column per metric, for MetricLab. Built from
// content/biomarkers/daily.json (written by scripts/biomarkers-from-takeout.mjs). The "event" is exercise: minutes per
// day by kind (exWalk, exBike, …) from the watch's exercise log, which the lab adds up for the kinds a visitor ticks,
// plus exMin, the day's total, as a metric of its own. Dates and numbers only. Served as its own file so the home page
// stays light: the lab fetches it the first time it's opened.
type Day = { date: string } & Record<string, number>;
const KEYS = ['rhr', 'hrv', 'sleepMin', 'bedH', 'sleepScore', 'deep', 'rem', 'resp', 'spo2', 'skinC', 'steps', 'azm', 'stress', 'ready'];
const KINDS = ['exWalk', 'exBike', 'exCardio', 'exRun', 'exStrength', 'exOther'];

export const GET: APIRoute = () => {
  const { days } = JSON.parse(readFileSync(resolve('content/biomarkers/daily.json'), 'utf8')) as { days: Day[] };
  const out: Record<string, (number | null)[] | string[]> = { dates: days.map((d) => d.date) };
  for (const k of KEYS) {
    out[k] = days.map((d) => {
      const v = d[k];
      if (v == null) return null;
      return k === 'skinC' ? Math.round(((v * 9) / 5) * 100 + 3200) / 100 : v; // shown in °F
    });
  }
  for (const k of KINDS) out[k] = days.map((d) => d[k] ?? 0);
  // Cardio fitness, estimated each day from that day's resting heart rate (the heart rate ratio method, Uth et al. 2004:
  // VO2 max ≈ 15.3 × HRmax / HRrest for men), with HRmax from age (Tanaka et al. 2001: 208 − 0.7 × age). Age counts
  // from the middle of the birth year in content/biomarkers/norms.json; the exact birthday stays out of the repo.
  const { bornYear } = JSON.parse(readFileSync(resolve('content/biomarkers/norms.json'), 'utf8')) as { bornYear: number };
  const born = Date.UTC(bornYear, 6, 1);
  out.vo2 = days.map((d) => {
    if (!d.rhr) return null;
    const age = (Date.parse(`${d.date}T00:00:00Z`) - born) / (365.25 * 864e5);
    return Math.round(((15.3 * (208 - 0.7 * age)) / d.rhr) * 10) / 10;
  });
  out.exMin = days.map((d) => KINDS.reduce((s, k) => s + (d[k] ?? 0), 0));
  out.event = out.exMin;
  return new Response(JSON.stringify(out), { headers: { 'Content-Type': 'application/json' } });
};
