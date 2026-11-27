import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { ImageMetadata } from 'astro';

// Every photo under content/; each gallery picks its own folder (top level only).
const photoModules = import.meta.glob<ImageMetadata>('/content/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}', {
  eager: true,
  import: 'default',
});

// dateLabel: "Circa 2013" for a file named with only its year (2013-Frosted-tree.jpg), shown by the photo viewer.
export type GalleryPhoto = { src: ImageMetadata; alt: string; file: string; dateLabel?: string };
export type Gallery = { photos: GalleryPhoto[]; intro: string[] };

/**
 * "2024-10-13-I-wanna-play.jpg" -> "I wanna play", "2024-05-04-134837-rueiro.jpg" -> "Rueiro",
 * "2026-04-lord-peeta.jpeg" -> "Lord peeta", "03-peeta_in-a-box.jpg" -> "Peeta in a box",
 * "2017-11-19-093022-Black--eyed-peas.jpg" -> "Black-eyed peas" (a double dash keeps a hyphen):
 * a leading date (month, day, or day plus HHMMSS time) or number is dropped.
 */
function altFromFile(file: string, fallback: string) {
  const words = file
    .replace(/\.[^.]+$/, '')
    .replace(/^(?:\d{4}-\d{2}(?:-\d{2}(?:-\d{6})?)?(?=[-_ ]|$)|\d+)[-_ ]*/, '')
    .replace(/--/g, '\u0000') // a double dash is a real hyphen: "Black--eyed-peas" -> "Black-eyed peas"
    .replace(/[-_]+/g, ' ')
    .replace(/\u0000/g, '-')
    .trim();
  return words ? words[0].toUpperCase() + words.slice(1) : fallback;
}

/**
 * A photo folder like content/pets/peeta/ or content/fishing/: photos straight in the folder,
 * in filename order (start names with the date, 2024-10-13-..., or a number, 01-, 02-, ...),
 * each described by its filename, plus an
 * optional _intro.md shown above them.
 */
export function loadGallery(dir: string, fallbackAlt: string): Gallery {
  const prefix = `/${dir.replace(/^\/|\/$/g, '')}/`;
  const photos = Object.entries(photoModules)
    .filter(([path]) => {
      const name = path.slice(prefix.length);
      return path.startsWith(prefix) && !name.includes('/') && !name.startsWith('_'); // _cover.jpg etc. aren't gallery photos
    })
    .map(([path, src]) => {
      const file = path.split('/').pop()!;
      const year = file.match(/^(\d{4})-(?!\d{2}(?:[-_ ]|\.|$))/)?.[1];
      return { src, file, alt: altFromFile(file, fallbackAlt), ...(year ? { dateLabel: `Circa ${year}` } : {}) };
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

export type GalleryTheme = { id: string; label: string; photos: GalleryPhoto[]; cover: GalleryPhoto | undefined };

/**
 * A photo folder split into themes (#316): each subfolder of `dir` is a theme, in folder-name order, named after the
 * folder ("01-Fog-and-smoke" -> "Fog and smoke"), with its photos loaded like loadGallery. An optional `themes.json`
 * in `dir` picks each theme's cover by the end of a photo's file name: { "01-Fog-and-smoke": "Godrays-at-the-concert",
 * "all": "..." }; otherwise the theme's first photo is its cover. `all` holds every theme's photos, in date order.
 */
export function loadThemes(dir: string, fallbackAlt: string) {
  const root = `/${dir.replace(/^\/|\/$/g, '')}/`;
  const folders = [
    ...new Set(
      Object.keys(photoModules)
        .filter((p) => p.startsWith(root) && p.slice(root.length).split('/').length === 2)
        .map((p) => p.slice(root.length).split('/')[0]),
    ),
  ].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const coverFile = resolve(dir, 'themes.json');
  const covers: Record<string, string> = existsSync(coverFile) ? JSON.parse(readFileSync(coverFile, 'utf8')) : {};
  const pick = (photos: GalleryPhoto[], key: string) =>
    (covers[key] && photos.find((p) => p.file.replace(/\.[^.]+$/, '').endsWith(covers[key]))) || photos[0];
  const themes: GalleryTheme[] = folders.map((folder) => {
    const { photos } = loadGallery(`${dir}/${folder}`, fallbackAlt);
    return { id: folder.replace(/^\d+[-_ ]*/, '').toLowerCase(), label: altFromFile(folder, folder), photos, cover: pick(photos, folder) };
  });
  const everything = themes.flatMap((t) => t.photos).sort((a, b) => a.file.localeCompare(b.file, undefined, { numeric: true }));
  return { themes, all: { id: 'all', label: 'All', photos: everything, cover: pick(everything, 'all') } as GalleryTheme };
}
