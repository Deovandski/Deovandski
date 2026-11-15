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
 */
export const PETS: { id: string; name: string; cover?: string; coverPosition?: string; hero?: string; heroAlt?: string }[] = [
  { id: 'bidu', name: 'Bidu' },
  { id: 'fluffy', name: 'Fluffy' },
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
const byName = (id: string, part?: string) =>
  part ? inFolder(id).find(([path]) => path.split('/').pop()!.toLowerCase().includes(part.toLowerCase()))?.[1] : undefined;

export type Pet = {
  id: string;
  name: string;
  gallery: Gallery;
  cover?: ImageMetadata;
  coverPosition?: string;
  hero?: ImageMetadata;
  heroAlt?: string;
};

/**
 * Each pet's photos and intro, plus the round portrait: the photo named by `cover` in PETS,
 * else _cover.* if present, else the first photo.
 */
export function loadPets(): Pet[] {
  return PETS.map(({ id, name, cover: coverName, coverPosition, hero: heroName, heroAlt }) => {
    const gallery = loadGallery(`content/pets/${id}`, name);
    const cover = byName(id, coverName) ?? byName(id, '_cover.') ?? gallery.photos[0]?.src;
    const hero = byName(id, heroName);
    return { id, name, gallery, cover, coverPosition, hero, heroAlt: heroAlt ?? name };
  });
}
