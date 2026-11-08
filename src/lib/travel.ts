import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { ImageMetadata } from 'astro';
import countries from 'world-countries';

export const TRAVEL_DIR = 'content/travel';
const COUNTRY_DIR = /^([a-z]{2})-[a-z0-9-]+$/;
const IMAGE = /\.(jpe?g|png|webp|avif)$/i;

// Vite bundles every photo so Astro can resize it at build time.
const photoModules = import.meta.glob<ImageMetadata>('/content/travel/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}', {
  eager: true,
  import: 'default',
});

export type Country = {
  code: string; // ISO 3166-1 alpha-2, lower case
  name: string;
  region: string; // folder name, e.g. "north-america"
  regionName: string;
  lat: number;
  lng: number;
  years?: string;
  caption?: string;
  photos: { src: ImageMetadata; file: string }[];
};

export function prettyRegion(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function readInfo(dir: string): { name?: string; years?: string; caption?: string } {
  const file = join(dir, '_info.md');
  if (!existsSync(file)) return {};
  const raw = readFileSync(file, 'utf8');
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const data: Record<string, string> = {};
  if (fm) {
    for (const line of fm[1].split(/\r?\n/)) {
      const m = line.match(/^(\w+):\s*(.*)$/);
      if (m) data[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
    }
  }
  const body = (fm ? raw.slice(fm[0].length) : raw).trim();
  return { name: data.name, years: data.years, caption: body || undefined };
}

/** Every country folder that has at least one photo. Folders without photos get no pin. */
export function loadCountries(): Country[] {
  const root = resolve(TRAVEL_DIR);
  if (!existsSync(root)) return [];
  const result: Country[] = [];
  const problems: string[] = [];

  for (const region of readdirSync(root).sort()) {
    const regionPath = join(root, region);
    if (region.startsWith('.') || !statSync(regionPath).isDirectory()) continue;

    for (const folder of readdirSync(regionPath).sort()) {
      const countryPath = join(regionPath, folder);
      if (folder.startsWith('.') || !statSync(countryPath).isDirectory()) continue;

      const match = folder.match(COUNTRY_DIR);
      if (!match) {
        problems.push(`${region}/${folder}: name it "<two-letter code>-<country>", e.g. "jp-japan".`);
        continue;
      }
      const code = match[1];
      const ref = countries.find((c) => c.cca2.toLowerCase() === code);
      if (!ref) {
        problems.push(`${region}/${folder}: "${code}" is not an ISO country code.`);
        continue;
      }

      const files = readdirSync(countryPath).filter((f) => IMAGE.test(f)).sort();
      const photos = files
        .map((file) => ({ file, src: photoModules[`/${TRAVEL_DIR}/${region}/${folder}/${file}`] }))
        .filter((p) => p.src);
      if (photos.length === 0) continue;

      const info = readInfo(countryPath);
      result.push({
        code,
        name: info.name || ref.name.common,
        region,
        regionName: prettyRegion(region),
        lat: ref.latlng[0],
        lng: ref.latlng[1],
        years: info.years,
        caption: info.caption,
        photos,
      });
    }
  }

  if (problems.length) throw new Error(`Travel folders need fixing:\n- ${problems.join('\n- ')}`);
  return result;
}
