import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { ImageMetadata } from 'astro';
import { loadGallery, type Gallery } from './gallery';

/** The pet shown when the Pets tab opens (plain #pets link). */
export const DEFAULT_PET = 'peeta';

/**
 * The pets on the Pets tab, in the order they appear. Each has a folder in content/pets/<id>/.
 * `cover` (optional) picks the round portrait by part of a filename in the pet's folder, case ignored
 * (files starting with "_" count too, so a portrait can stay out of the grid);
 * `coverPosition` (optional) is the CSS object-position that keeps the face in the circle;
 * `hero` (optional) is a picture shown large above the grid, under the intro as a centered title.
 * It's picked the same way as `cover`; name it with a leading "_" to keep it out of the grid.
 * An optional `_outro.md` in the pet's folder is shown centered after the photos.
 */
export const PETS: { id: string; name: string; cover?: string; coverPosition?: string; hero?: string; heroAlt?: string }[] = [
  {
    id: 'bidu',
    name: 'Bidu',
    cover: 'captain-bidu',
    coverPosition: '50% 70%',
    hero: 'captain-bidu',
    heroAlt: 'Captain Bidu: Bidu wearing a blue military officer cap with a gold winged badge',
  },
  {
    id: 'fluffy',
    name: 'Fluffy',
    cover: 'princess-fluffy-of-guama',
    coverPosition: '50% 22%',
    hero: 'princess-fluffy-of-guama',
    heroAlt: 'Princess Fluffy of Guamá: Fluffy in a pink princess dress and a jeweled tiara, sitting in the back seat of a car',
  },
  {
    id: 'peeta',
    name: 'Peeta',
    cover: 'lord-peeta-of-tuxford',
    coverPosition: '50% 18%',
    hero: 'lord-peeta-of-tuxford',
    heroAlt: 'Lord Peeta of Tuxford: Peeta as a king in a royal red, blue and gold robe with an ermine-trimmed cape (AI-generated)',
  },
];

// Every picture in the pet folders, including "_" files (which the grid skips).
const files = import.meta.glob<ImageMetadata>('/content/pets/*/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}', {
  eager: true,
  import: 'default',
});
const inFolder = (id: string) => Object.entries(files).filter(([path]) => path.startsWith(`/content/pets/${id}/`));
// A file whose name (minus extension and any leading "_") is exactly `part` wins; otherwise the
// first file whose name contains it.
const byName = (id: string, part?: string) => {
  if (!part) return undefined;
  const want = part.toLowerCase();
  const stem = (path: string) => path.split('/').pop()!.replace(/\.[^.]+$/, '').replace(/^_/, '').toLowerCase();
  const files = inFolder(id);
  return (files.find(([path]) => stem(path) === want) ?? files.find(([path]) => path.split('/').pop()!.toLowerCase().includes(want)))?.[1];
};

export type Pet = {
  id: string;
  name: string;
  gallery: Gallery;
  cover?: ImageMetadata;
  coverPosition?: string;
  hero?: ImageMetadata;
  heroAlt?: string;
  outro: string[];
};

/** Paragraphs of content/pets/<id>/_outro.md (comments dropped), or none. */
function readOutro(id: string): string[] {
  const file = resolve(`content/pets/${id}/_outro.md`);
  if (!existsSync(file)) return [];
  return readFileSync(file, 'utf8')
    .replace(/<!--[\s\S]*?-->/g, '')
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

/**
 * Each pet's photos and intro, plus the round portrait: the photo named by `cover` in PETS,
 * else _cover.* if present, else the first photo.
 */
export function loadPets(): Pet[] {
  return PETS.map(({ id, name, cover: coverName, coverPosition, hero: heroName, heroAlt }) => {
    const gallery = loadGallery(`content/pets/${id}`, name);
    const cover = byName(id, coverName) ?? byName(id, '_cover.') ?? gallery.photos[0]?.src;
    const hero = byName(id, heroName);
    return { id, name, gallery, cover, coverPosition, hero, heroAlt: heroAlt ?? name, outro: readOutro(id) };
  });
}
