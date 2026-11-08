import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { ImageMetadata } from 'astro';

const FILE = 'content/tattoos.md';

const photoModules = import.meta.glob<ImageMetadata>('/content/tattoos/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}', {
  eager: true,
  import: 'default',
});

export type Tattoo = { symbol?: string; name: string; meaning: string };
export type TattooArea = { title: string; slug: string; tattoos: Tattoo[]; photos: { src: ImageMetadata; file: string }[] };

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Reads content/tattoos.md: "## Area" headings with "- [symbol] Name: meaning" bullets. */
export function loadTattoos(): TattooArea[] {
  const text = readFileSync(resolve(FILE), 'utf8');
  const areas: TattooArea[] = [];

  for (const part of text.split(/^## +/m).slice(1)) {
    const nl = part.indexOf('\n');
    const title = part.slice(0, nl).trim();
    const slug = slugify(title);
    const tattoos = part
      .slice(nl + 1)
      .split(/\r?\n/)
      .filter((l) => /^\s*[-*] +/.test(l))
      .map((l) => {
        const body = l.replace(/^\s*[-*] +/, '').trim();
        const colon = body.indexOf(':');
        if (colon === -1) throw new Error(`${FILE}: "${body}" needs a colon between the name and the meaning.`);
        const head = body.slice(0, colon).trim();
        const meaning = body.slice(colon + 1).trim();
        // A leading token with no Latin letters (a rune, kanji, etc.) is the symbol.
        const m = head.match(/^(\S+)\s+(.+)$/);
        if (m && !/[A-Za-z]/.test(m[1])) return { symbol: m[1], name: m[2], meaning };
        return { name: head, meaning };
      });

    const photos = Object.entries(photoModules)
      .filter(([path]) => path.startsWith(`/content/tattoos/${slug}/`))
      .map(([path, src]) => ({ src, file: path.split('/').pop()! }))
      .sort((a, b) => a.file.localeCompare(b.file, undefined, { numeric: true }));

    areas.push({ title, slug, tattoos, photos });
  }
  return areas;
}
