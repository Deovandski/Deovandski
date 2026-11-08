import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { ImageMetadata } from 'astro';

// Every photo under content/, so any sections file can pick up its own folder.
const photoModules = import.meta.glob<ImageMetadata>('/content/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}', {
  eager: true,
  import: 'default',
});

export type SectionItem = { symbol?: string; vraki: boolean; name: string; meaning: string[] };
export type Section = {
  title: string;
  slug: string;
  intro: string[];
  items: SectionItem[];
  photos: { src: ImageMetadata; file: string }[];
  hasSlot: boolean; // show a photo box (folder exists or has photos)
};
export type Sections = { intro: string[]; sections: Section[] };

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

function parseItem(body: string): SectionItem {
  const vraki = /^\[vraki\]\s*/i.test(body);
  const rest = body.replace(/^\[vraki\]\s*/i, '');
  // Split at the first colon followed by a space; the meaning may contain more colons.
  const m = rest.match(/^(.*?):\s+(.*)$/);
  const head = (m ? m[1] : rest).trim();
  const meaning = m ? [m[2].trim()] : [];
  const sym = head.match(/^(\S+)\s+(.+)$/);
  // A leading token with no Latin letters or digits (a rune, kanji, etc.) is the symbol.
  if (sym && !/[A-Za-z0-9]/.test(sym[1])) return { symbol: sym[1], vraki, name: sym[2], meaning };
  return { vraki, name: head, meaning };
}

/**
 * Reads a sections file (content/tattoos.md, content/miku.md, content/concerts.md):
 * "> intro" lines before the first "## Section"; under each section, plain lines are its
 * intro, "- [symbol] Name: meaning" bullets are items, and indented lines add paragraphs
 * to the item above. Photos come from <photoDir>/<section-slug>/.
 */
export function loadSections(file: string, photoDir: string): Sections {
  const text = readFileSync(resolve(file), 'utf8').replace(/<!--[\s\S]*?-->/g, '');
  const [preamble, ...parts] = text.split(/^## +/m);
  const intro = preamble
    .split(/\r?\n/)
    .filter((l) => l.startsWith('>'))
    .map((l) => l.replace(/^>\s?/, '').trim())
    .filter(Boolean);

  const sections = parts.map((part) => {
    const nl = part.indexOf('\n');
    const title = (nl === -1 ? part : part.slice(0, nl)).trim();
    const slug = slugify(title);
    const sectionIntro: string[] = [];
    const items: SectionItem[] = [];

    for (const line of (nl === -1 ? '' : part.slice(nl + 1)).split(/\r?\n/)) {
      if (!line.trim()) continue;
      if (/^[-*] +/.test(line)) items.push(parseItem(line.replace(/^[-*] +/, '').trim()));
      else if (/^\s{2,}\S/.test(line) && items.length) items[items.length - 1].meaning.push(line.trim());
      else sectionIntro.push(line.trim());
    }

    const folder = `/${photoDir}/${slug}/`;
    const photos = Object.entries(photoModules)
      .filter(([path]) => path.startsWith(folder))
      .map(([path, src]) => ({ src, file: path.split('/').pop()! }))
      .sort((a, b) => a.file.localeCompare(b.file, undefined, { numeric: true }));

    return { title, slug, intro: sectionIntro, items, photos, hasSlot: photos.length > 0 || existsSync(resolve(`${photoDir}/${slug}`)) };
  });

  return { intro, sections };
}
