// The Cycling tab's numbers, in one place: the tab (src/components/CyclingFacet.astro) and its ▶ Play map
// (the "around-the-world" gimmick in src/components/Gimmick.astro) both read them.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// ---- data: content/cycling/rides.json (from scripts/cycling-from-takeout.mjs) + content/cycling/estimated.md ----
export type Ride = { date: string; hour: number; km: number; minutes: number; kind: 'outdoor' | 'mountain' | 'indoor'; how?: 'logged' | 'auto'; source: string; estimated?: boolean };
export const log = JSON.parse(readFileSync(resolve('content/cycling/rides.json'), 'utf8')) as { exported: string | null; medianKmh?: number; rides: Ride[] };
export const MILE = 1.609344;
export const estimates = readFileSync(resolve('content/cycling/estimated.md'), 'utf8')
  .split(/\r?\n/)
  .map((l) => l.match(/^-\s+(.+?):\s*([\d.,]+)\s*(mi|km)\s*$/i))
  .filter((m): m is RegExpMatchArray => !!m && !m[1].startsWith('<'))
  .map((m) => ({ what: m[1], km: Number(m[2].replace(/,/g, '')) * (m[3].toLowerCase() === 'mi' ? MILE : 1) }));

// Rides the watch caught on its own (how: 'auto') don't count: most were Peeta's stroller or the elliptical
// ("Ridin' with Peeta" below). Only rides I logged as bike rides count.
const all = log.rides ?? [];
export const rides = all.filter((r) => r.how !== 'auto');
export const caught = all.filter((r) => r.how === 'auto');
export const caughtHours = caught.reduce((s, r) => s + r.minutes, 0) / 60;
export const outdoor = rides.filter((r) => r.kind !== 'indoor');
const trackedKm = outdoor.reduce((s, r) => s + r.km, 0);
// Rides the watch logged without GPS get a distance estimated from their time (scripts/cycling-from-takeout.mjs).
export const guessed = outdoor.filter((r) => r.estimated);
export const guessedKm = guessed.reduce((s, r) => s + r.km, 0);
export const estimatedKm = estimates.reduce((s, e) => s + e.km, 0);
export const totalKm = trackedKm + estimatedKm;
export const star = estimatedKm > 0 || guessedKm > 0 ? '*' : '';
export const EARTH_MI = 24901; // the Earth round the equator (40,075 km)

// The planet starts at Fargo, with cities along the way as comparisons, as the crow flies (content/cycling/cities.json).
type Place = { name: string; lat: number; lon: number };
export const places = JSON.parse(readFileSync(resolve('content/cycling/cities.json'), 'utf8')) as { start: Place; cities: Place[] };
const crowMi = (a: Place, b: Place) => {
  const r = (d: number) => (d * Math.PI) / 180;
  const c = Math.sin(r(a.lat)) * Math.sin(r(b.lat)) + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.cos(r(b.lon - a.lon));
  return 3958.8 * Math.acos(Math.min(1, Math.max(-1, c)));
};
export const cities = places.cities.map((c) => ({ label: c.name, distance: crowMi(places.start, c) })).sort((a, b) => a.distance - b.distance);
export const totalMi = totalKm / MILE;
export const passed = [...cities].reverse().find((c) => c.distance <= totalMi);
export const ahead = cities.find((c) => c.distance > totalMi);
