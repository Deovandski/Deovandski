import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { ImageMetadata } from 'astro';

// Every photo under content/; each gallery picks its own folder (top level only).
const photoModules = import.meta.glob<ImageMetadata>('/content/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}', {
  eager: true,
  import: 'default',
});

export type GalleryPhoto = { src: ImageMetadata; alt: string; file: string };
export type Gallery = { photos: GalleryPhoto[]; intro: string[] };

/** "03-peeta_in-a-box.jpg" -> "Peeta in a box" */
function altFromFile(file: string, fallback: string) {
  const words = file
    .replace(/\.[^.]+$/, '')
    .replace(/^\d+[-_ ]*/, '')
    .replace(/[-_]+/g, ' ')
    .trim();
  return words ? words[0].toUpperCase() + words.slice(1) : fallback;
}

/**
 * A photo folder like content/peeta/ or content/fishing/: photos straight in the folder,
 * in filename order (number them 01-, 02-, ...), each described by its filename, plus an
 * optional _intro.md shown above them.
 */
export function loadGallery(dir: string, fallbackAlt: string): Gallery {
  const prefix = `/${dir.replace(/^\/|\/$/g, '')}/`;
  const photos = Object.entries(photoModules)
    .filter(([path]) => path.startsWith(prefix) && !path.slice(prefix.length).includes('/'))
    .map(([path, src]) => {
      const file = path.split('/').pop()!;
      return { src, file, alt: altFromFile(file, fallbackAlt) };
    })
    .sort((a, b) => a.file.localeCompare(b.file, undefined, { numeric: true }));

  const introFile = resolve(dir, '_intro.md');
  const intro = existsSync(introFile)
    ? readFileSync(introFile, 'utf8')
        .replace(/<!--[\s\S]*?-->/g, '')
        .split(/\r?\n\s*\r?\n/)
        .map((p) => p.replace(/\s+/g, ' ').trim())
        .filter(Boolean)
    : [];

  return { photos, intro };
}
