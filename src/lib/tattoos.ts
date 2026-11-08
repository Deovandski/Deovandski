import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { ImageMetadata } from 'astro';

const FILE = 'content/tattoos.md';

const photoModules = import.meta.glob<ImageMetadata>('/content/tattoos/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}', {
  eager: true,
  import: 'default',
});

export type Tattoo = { symbol?: string; vraki: boolean; name: string; meaning: string[] };
export type TattooArea = {
  title: string;
  slug: string;
  intro: string[];
  tattoos: Tattoo[];
  photos: { src: ImageMetadata; file: string }[];
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

function parseTattoo(body: string): Tattoo {
  let rest = body;
  const vraki = /^\[vraki\]\s*/i.test(rest);
  rest = rest.replace(/^\[vraki\]\s*/i, '');
  // Split at the first colon followed by a space; the meaning may contain more colons.
  const m = rest.match(/^(.*?):\s+(.*)$/);
  if (!m) throw new Error(`${FILE}: "${body}" needs a colon and a space between the name and the meaning.`);
  const head = m[1].trim();
  const meaning = [m[2].trim()];
  const sym = head.match(/^(\S+)\s+(.+)$/);
  // A leading token with no Latin letters (a rune, kanji, etc.) is the symbol.
  if (sym && !/[A-Za-z]/.test(sym[1])) return { symbol: sym[1], vraki, name: sym[2], meaning };
  return { vraki, name: head, meaning };
}

/** Reads content/tattoos.md (see the notes at the top of that file). */
export function loadTattoos(): { intro: string[]; areas: TattooArea[] } {
  const text = readFileSync(resolve(FILE), 'utf8');
  const [preamble, ...parts] = text.split(/^## +/m);
  const intro = preamble
    .split(/\r?\n/)
    .filter((l) => l.startsWith('>'))
    .map((l) => l.replace(/^>\s?/, '').trim())
    .filter(Boolean);

  const areas = parts.map((part) => {
    const nl = part.indexOf('\n');
    const title = part.slice(0, nl).trim();
    const slug = slugify(title);
    const areaIntro: string[] = [];
    const tattoos: Tattoo[] = [];

    for (const line of part.slice(nl + 1).split(/\r?\n/)) {
      if (!line.trim()) continue;
      if (/^\s*[-*] +/.test(line) && !/^\s{2,}/.test(line)) {
        tattoos.push(parseTattoo(line.replace(/^\s*[-*] +/, '').trim()));
      } else if (/^\s{2,}\S/.test(line) && tattoos.length) {
        tattoos[tattoos.length - 1].meaning.push(line.trim());
      } else {
        areaIntro.push(line.trim());
      }
    }

    const photos = Object.entries(photoModules)
      .filter(([path]) => path.startsWith(`/content/tattoos/${slug}/`))
      .map(([path, src]) => ({ src, file: path.split('/').pop()! }))
      .sort((a, b) => a.file.localeCompare(b.file, undefined, { numeric: true }));

    return { title, slug, intro: areaIntro, tattoos, photos };
  });

  return { intro, areas };
}
