import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// The Gamer tab: categories from content/gaming/categories.md, hours from content/gaming/steam-games.json
// and content/gaming/xbox-games.json (#250). How to refresh the hours: content/gaming/README.md.

export type GameItem = { name: string; value: number; chips: string[] };
export type GameCategory = { id: string; name: string; note?: string; excludable: boolean; items: GameItem[] };
export type GamerData = {
  intro: string[];
  updated: string; // the export's date, MM/DD/YYYY
  categories: GameCategory[];
  totalHours: number; // every game in both exports, listed or not ({same} games counted once)
  played: number;
  owned: number; // on Steam
};

const norm = (s: string) => s.replace(/[™®©]/g, '').normalize('NFKC').replace(/\s+/g, ' ').trim().toLowerCase();
const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

type Export = { exported: string; games: { name: string; minutes: number }[] };
const readExport = (file: string): Export =>
  existsSync(resolve(file)) ? JSON.parse(readFileSync(resolve(file), 'utf8')) : { exported: '', games: [] };
const byName = (e: Export) => {
  const m = new Map<string, number>();
  for (const g of e.games) m.set(norm(g.name), Math.max(m.get(norm(g.name)) ?? 0, g.minutes));
  return m;
};

export function loadGamer(
  categoriesFile = 'content/gaming/categories.md',
  steamFile = 'content/gaming/steam-games.json',
  xboxFile = 'content/gaming/xbox-games.json',
): GamerData {
  const steam = readExport(steamFile);
  const xbox = readExport(xboxFile);
  const steamMin = byName(steam);
  const xboxMin = byName(xbox);

  // The newer of the two exports, MM/DD/YYYY.
  const [y, m, d] = [steam.exported, xbox.exported].sort().pop()!.split('-');
  const updated = `${m}/${d}/${y}`;

  let doubleCounted = 0; // minutes to take off the total for {same} games
  let merged = 0; // games played on both, counted once in "games played"
  // "- Name | Other name {same}": the first name is shown; any name can match either export.
  const lookup = (line: string): GameItem | undefined => {
    const same = /\{same\}/i.test(line);
    const names = line.replace(/\{[^}]*\}/g, '').split('|').map((n) => n.trim()).filter(Boolean);
    const pick = (map: Map<string, number>) => Math.max(0, ...names.map((n) => map.get(norm(n)) ?? 0));
    const s = pick(steamMin);
    const x = pick(xboxMin);
    if (!s && !x) {
      // Listed but never played (0 minutes) still shows, as on Steam before Xbox.
      const zero = names.some((n) => steamMin.has(norm(n)) || xboxMin.has(norm(n)));
      return zero ? { name: names[0], value: 0, chips: [] } : undefined;
    }
    if (s && x) {
      merged++;
      if (same) doubleCounted += Math.min(s, x);
    }
    const min = s && x && same ? Math.max(s, x) : s + x;
    return { name: names[0], value: Math.round(min / 60), chips: [...(s ? ['Steam'] : []), ...(x ? ['Xbox'] : [])] };
  };

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
        const item = lookup(line.replace(/^[-*] +/, '').trim());
        if (item) items.push(item);
      } else notes.push(line.trim());
    }
    items.sort((a, b) => b.value - a.value || a.name.localeCompare(b.name));
    return { id: slug(title), name: title, note: notes.join(' ') || undefined, excludable, items };
  });

  return {
    intro,
    updated,
    categories: categories.filter((c) => c.items.length),
    totalHours: Math.round(([...steam.games, ...xbox.games].reduce((s, g) => s + g.minutes, 0) - doubleCounted) / 60),
    played: [...steam.games, ...xbox.games].filter((g) => g.minutes > 0).length - merged,
    owned: steam.games.length,
  };
}
