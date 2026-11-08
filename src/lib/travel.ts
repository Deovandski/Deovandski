import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { ImageMetadata } from 'astro';
import countries from 'world-countries';
import { State } from 'country-state-city';

export const TRAVEL_DIR = 'content/travel';
const COUNTRY_DIR = /^([a-z]{2})-[a-z0-9-]+$/;
const SUBDIVISION_DIR = /^([a-z0-9]{1,3})-[a-z0-9-]+$/;
const IMAGE = /\.(jpe?g|png|webp|avif)$/i;

// Vite bundles every photo so Astro can resize it at build time.
const photoModules = import.meta.glob<ImageMetadata>('/content/travel/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}', {
  eager: true,
  import: 'default',
});

export type Place = {
  key: string; // unique id, e.g. "jp" or "jp-13"
  country: string; // ISO 3166-1 alpha-2, lower case
  countryName: string;
  name: string; // what the pin and gallery show: "Japan" or "Tokyo"
  sub?: string; // subdivision name when this is a state/province pin
  region: string; // folder name, e.g. "north-america"
  regionName: string;
  lat: number;
  lng: number;
  years?: string;
  caption?: string;
  photos: { src: ImageMetadata; file: string }[];
};
/** @deprecated use Place */
export type Country = Place;

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

const photosIn = (dir: string, relDir: string) =>
  readdirSync(dir)
    .filter((f) => IMAGE.test(f))
    .sort()
    .map((file) => ({ file, src: photoModules[`/${relDir}/${file}`] }))
    .filter((p) => p.src);

const cleanSubName = (n: string) => n.replace(/\s+(Prefecture|Province)$/i, '');

/**
 * Every country or state/province folder that has at least one photo.
 * content/travel/<region>/<cc-country>/            photos → a pin for the country
 * content/travel/<region>/<cc-country>/<code-name>/ photos → a pin for that state/province
 */
export function loadPlaces(): Place[] {
  const root = resolve(TRAVEL_DIR);
  if (!existsSync(root)) return [];
  const result: Place[] = [];
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
      const countryInfo = readInfo(countryPath);
      const countryName = countryInfo.name || ref.name.common;
      const base = { country: code, countryName, region, regionName: prettyRegion(region) };

      const photos = photosIn(countryPath, `${TRAVEL_DIR}/${region}/${folder}`);
      if (photos.length) {
        result.push({ ...base, key: code, name: countryName, lat: ref.latlng[0], lng: ref.latlng[1], years: countryInfo.years, caption: countryInfo.caption, photos });
      }

      for (const subFolder of readdirSync(countryPath).sort()) {
        const subPath = join(countryPath, subFolder);
        if (subFolder.startsWith('.') || !statSync(subPath).isDirectory()) continue;
        const sm = subFolder.match(SUBDIVISION_DIR);
        const state = sm ? State.getStateByCodeAndCountry(sm[1].toUpperCase(), code.toUpperCase()) : undefined;
        if (!state) {
          problems.push(`${region}/${folder}/${subFolder}: use a code from SUBDIVISION_CODES.md, e.g. "tx-texas" or "13-tokyo".`);
          continue;
        }
        const subPhotos = photosIn(subPath, `${TRAVEL_DIR}/${region}/${folder}/${subFolder}`);
        if (!subPhotos.length) continue;
        const info = readInfo(subPath);
        const sub = info.name || cleanSubName(state.name);
        result.push({
          ...base,
          key: `${code}-${sm![1]}`,
          name: sub,
          sub,
          lat: Number(state.latitude),
          lng: Number(state.longitude),
          years: info.years,
          caption: info.caption,
          photos: subPhotos,
        });
      }
    }
  }

  if (problems.length) throw new Error(`Travel folders need fixing:\n- ${problems.join('\n- ')}`);
  return result;
}
