import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// The Gamer tab: categories from content/gaming/categories.md, hours from content/gaming/steam-games.json.
// How to refresh the hours: content/gaming/README.md.

export type GameItem = { name: string; value: number };
export type GameCategory = { id: string; name: string; note?: string; excludable: boolean; items: GameItem[] };
export type GamerData = {
  intro: string[];
  updated: string; // the export's date, MM/DD/YYYY
  categories: GameCategory[];
  totalHours: number; // every game in the export, listed or not
  played: number;
  owned: number;
};

const norm = (s: string) => s.replace(/[™®©]/g, '').normalize('NFKC').replace(/\s+/g, ' ').trim().toLowerCase();
const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export function loadGamer(categoriesFile = 'content/gaming/categories.md', steamFile = 'content/gaming/steam-games.json'): GamerData {
  const steam = JSON.parse(readFileSync(resolve(steamFile), 'utf8')) as {
    exported: string;
    games: { appid: number; name: string; minutes: number }[];
  };
  const minutes = new Map<string, number>();
  for (const g of steam.games) minutes.set(norm(g.name), Math.max(minutes.get(norm(g.name)) ?? 0, g.minutes));

  const [y, m, d] = steam.exported.split('-');
  const updated = `${m}/${d}/${y}`;

  const text = readFileSync(resolve(categoriesFile), 'utf8').replace(/<!--[\s\S]*?-->/g, '');
  const [preamble, ...parts] = text.split(/^## +/m);
  const intro = preamble
    .split(/\r?\n/)
    .filter((l) => l.startsWith('>'))
    .map((l) => l.replace(/^>\s?/, '').trim().replace(/\{updated\}/g, updated))
    .filter(Boolean);

  const categories = parts.map((part) => {
    const nl = part.indexOf('\n');
    let title = (nl === -1 ? part : part.slice(0, nl)).trim();
    const excludable = /\{idle\}/i.test(title);
    title = title.replace(/\s*\{idle\}\s*/i, '').trim();
    const notes: string[] = [];
    const items: GameItem[] = [];
    for (const line of (nl === -1 ? '' : part.slice(nl + 1)).split(/\r?\n/)) {
      if (!line.trim()) continue;
      if (/^[-*] +/.test(line)) {
        const name = line.replace(/^[-*] +/, '').trim();
        const min = minutes.get(norm(name));
        if (min !== undefined) items.push({ name, value: Math.round(min / 60) });
      } else notes.push(line.trim());
    }
    items.sort((a, b) => b.value - a.value || a.name.localeCompare(b.name));
    return { id: slug(title), name: title, note: notes.join(' ') || undefined, excludable, items };
  });

  return {
    intro,
    updated,
    categories: categories.filter((c) => c.items.length),
    totalHours: Math.round(steam.games.reduce((s, g) => s + g.minutes, 0) / 60),
    played: steam.games.filter((g) => g.minutes > 0).length,
    owned: steam.games.length,
  };
}
