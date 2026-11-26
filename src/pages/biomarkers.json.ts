import type { APIRoute } from 'astro';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// The Biomarker Lab's data (Hearth › Biomarker Lab), one column per metric, for MetricLab. Built from
// content/biomarkers/daily.json (written by scripts/biomarkers-from-takeout.mjs) and the Cycling tab's rides
// (content/cycling/rides.json): "event" is the miles ridden that day (rides the watch caught on its own don't count,
// as on the Cycling tab). Dates and numbers only. Served as its own file so the home page stays light: the lab
// fetches it the first time it's opened.
type Day = { date: string } & Record<string, number>;
const KEYS = ['rhr', 'hrv', 'sleepMin', 'bedH', 'sleepScore', 'deep', 'rem', 'resp', 'spo2', 'skinC', 'steps', 'azm', 'stress', 'vo2', 'ready'];

export const GET: APIRoute = () => {
  const { days } = JSON.parse(readFileSync(resolve('content/biomarkers/daily.json'), 'utf8')) as { days: Day[] };
  const { rides } = JSON.parse(readFileSync(resolve('content/cycling/rides.json'), 'utf8')) as { rides: { date: string; km: number; how: string }[] };
  const miles = new Map<string, number>();
  for (const r of rides) if (r.how !== 'auto') miles.set(r.date, (miles.get(r.date) ?? 0) + r.km / 1.609344);
  const out: Record<string, (number | null)[] | string[]> = { dates: days.map((d) => d.date) };
  for (const k of KEYS) {
    out[k] = days.map((d) => {
      const v = d[k];
      if (v == null) return null;
      return k === 'skinC' ? Math.round((v * 9) / 5 * 100 + 3200) / 100 : v; // shown in °F
    });
  }
  out.event = days.map((d) => Math.round((miles.get(d.date) ?? 0) * 100) / 100);
  return new Response(JSON.stringify(out), { headers: { 'Content-Type': 'application/json' } });
};
