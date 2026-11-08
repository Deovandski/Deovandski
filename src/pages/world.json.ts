import type { APIRoute } from 'astro';
import { feature } from 'topojson-client';
import world from 'world-atlas/countries-110m.json';
import countries from 'world-countries';

// Country outlines for the travel map, tagged with ISO alpha-2 codes.
// Served from this site, so the map needs no third-party tile server.
export const GET: APIRoute = () => {
  const byNumeric = new Map(countries.map((c) => [String(c.ccn3), c.cca2.toLowerCase()]));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const geo = feature(world as any, (world as any).objects.countries) as any;
  for (const f of geo.features) {
    const code = byNumeric.get(String(f.id)) ?? null;
    f.properties = { code };
    delete f.id;
    if (code === 'aq') continue; // Antarctica wraps the whole globe on purpose
    const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
    for (const poly of polys) for (const ring of poly) unwrap(ring);
  }
  return new Response(JSON.stringify(geo), { headers: { 'Content-Type': 'application/json' } });
};

/** Shift western points of a ring east by 360° when the ring jumps across the date line. */
function unwrap(ring: number[][]) {
  let jumps = false;
  for (let i = 1; i < ring.length; i++) if (Math.abs(ring[i][0] - ring[i - 1][0]) > 180) jumps = true;
  if (!jumps) return;
  for (const pt of ring) if (pt[0] < 0) pt[0] += 360;
}
