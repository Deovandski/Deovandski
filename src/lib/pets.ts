import type { ImageMetadata } from 'astro';
import { loadGallery, type Gallery } from './gallery';

/** The pet shown when the Pets tab opens (plain #pets link). */
export const DEFAULT_PET = 'peeta';

/**
 * The pets on the Pets tab, in the order they appear. Each has a folder in content/pets/<id>/.
 * `cover` (optional) picks the round portrait by part of a photo's filename, case ignored;
 * `coverPosition` (optional) is the CSS object-position that keeps the face in the circle.
 */
export const PETS: { id: string; name: string; cover?: string; coverPosition?: string }[] = [
  { id: 'bidu', name: 'Bidu' },
  { id: 'fluffy', name: 'Fluffy' },
  { id: 'peeta', name: 'Peeta', cover: 'lord-peeta-of-tuxford', coverPosition: '50% 18%' },
];

const covers = import.meta.glob<ImageMetadata>('/content/pets/*/_cover.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}', {
  eager: true,
  import: 'default',
});

export type Pet = { id: string; name: string; gallery: Gallery; cover?: ImageMetadata; coverPosition?: string };

/**
 * Each pet's photos and intro, plus the round portrait: the photo named by `cover` in PETS,
 * else _cover.* if present, else the first photo.
 */
export function loadPets(): Pet[] {
  return PETS.map(({ id, name, cover: coverName, coverPosition }) => {
    const gallery = loadGallery(`content/pets/${id}`, name);
    const named = coverName && gallery.photos.find((p) => p.file.toLowerCase().includes(coverName.toLowerCase()))?.src;
    const cover = named || (Object.entries(covers).find(([path]) => path.startsWith(`/content/pets/${id}/`))?.[1] ?? gallery.photos[0]?.src);
    return { id, name, gallery, cover, coverPosition };
  });
}
