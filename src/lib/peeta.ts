import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { ImageMetadata } from 'astro';

const photoModules = import.meta.glob<ImageMetadata>('/content/peeta/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}', {
  eager: true,
  import: 'default',
});

export type CatPhoto = { src: ImageMetadata; alt: string; file: string };

/** "03-peeta_in-a-box.jpg" -> "Peeta in a box" */
function altFromFile(file: string) {
  const words = file
    .replace(/\.[^.]+$/, '')
    .replace(/^\d+[-_ ]*/, '')
    .replace(/[-_]+/g, ' ')
    .trim();
  return words ? words[0].toUpperCase() + words.slice(1) : 'Peeta';
}

/** Photos in content/peeta/, newest filename last (so number them 01-, 02-, ...). */
export function loadPeeta(): { photos: CatPhoto[]; intro: string[] } {
  const photos = Object.entries(photoModules)
    .map(([path, src]) => {
      const file = path.split('/').pop()!;
      return { src, file, alt: altFromFile(file) };
    })
    .sort((a, b) => a.file.localeCompare(b.file, undefined, { numeric: true }));

  const introFile = resolve('content/peeta/_intro.md');
  const intro = existsSync(introFile)
    ? readFileSync(introFile, 'utf8')
        .split(/\r?\n\s*\r?\n/)
        .map((p) => p.replace(/\s+/g, ' ').trim())
        .filter(Boolean)
    : [];

  return { photos, intro };
}
