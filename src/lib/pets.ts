import type { ImageMetadata } from 'astro';
import { loadGallery, type Gallery } from './gallery';

/** The pet shown when the Pets tab opens (plain #pets link). */
export const DEFAULT_PET = 'peeta';

/** The pets on the Pets tab, in the order they appear. Each has a folder in content/pets/<id>/. */
export const PETS = [
  { id: 'bidu', name: 'Bidu' },
  { id: 'fluffy', name: 'Fluffy' },
  { id: 'peeta', name: 'Peeta' },
];

const covers = import.meta.glob<ImageMetadata>('/content/pets/*/_cover.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}', {
  eager: true,
  import: 'default',
});

export type Pet = { id: string; name: string; gallery: Gallery; cover?: ImageMetadata };

/** Each pet's photos and intro, plus the round portrait: _cover.* if present, else the first photo. */
export function loadPets(): Pet[] {
  return PETS.map(({ id, name }) => {
    const gallery = loadGallery(`content/pets/${id}`, name);
    const cover = Object.entries(covers).find(([path]) => path.startsWith(`/content/pets/${id}/`))?.[1] ?? gallery.photos[0]?.src;
    return { id, name, gallery, cover };
  });
}
