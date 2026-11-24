/**
 * Shared by scripts/steam-games.mjs and scripts/xbox-games.mjs: compares the saved hours with
 * content/gaming/categories.md and prints what needs a decision. Changes nothing.
 *   - games with 10+ hours that no category lists yet (add them, or leave them out on purpose)
 *   - listed games with no hours in either export or estimated.md (renamed, or a typo)
 *   - games in estimated.md that no category lists
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

export const norm = (s) => s.replace(/[™®©]/g, '').normalize('NFKC').replace(/\s+/g, ' ').trim().toLowerCase();
const hours = (m) => Math.round(m / 60);
const load = (f) => (existsSync(resolve(f)) ? JSON.parse(readFileSync(resolve(f), 'utf8')).games : []);

export function checkCategories() {
  const steam = load('content/gaming/steam-games.json');
  const xbox = load('content/gaming/xbox-games.json');
  // Each bullet: "- Name | Other name {same}". Every name on the line counts as listed.
  const bullets = readFileSync(resolve('content/gaming/categories.md'), 'utf8')
    .replace(/<!--[\s\S]*?-->/g, '')
    .split(/^## /m)
    .slice(1) // bullets before the first category heading are the file's own instructions
    .join('\n')
    .split(/\r?\n/)
    .filter((l) => /^[-*] +/.test(l))
    .map((l) => l.replace(/^[-*] +/, '').replace(/\{[^}]*\}/g, '').split('|').map((n) => n.trim()).filter(Boolean));
  const listed = new Set(bullets.flat().map(norm));
  // content/gaming/estimated.md: "- Game: hours" bullets under platform headings.
  const estimated = existsSync(resolve('content/gaming/estimated.md'))
    ? readFileSync(resolve('content/gaming/estimated.md'), 'utf8')
        .split(/\r?\n/)
        .map((l) => l.match(/^[-*] +(.+):\s*[\d.,]+\s*h?\s*$/)?.[1])
        .filter(Boolean)
    : [];
  const known = new Set([...steam, ...xbox].map((g) => norm(g.name)).concat(estimated.map(norm)));

  const unlisted = [
    ...steam.map((g) => ({ ...g, from: 'Steam' })),
    ...xbox.map((g) => ({ ...g, from: 'Xbox' })),
  ].filter((g) => hours(g.minutes) >= 10 && !listed.has(norm(g.name)));
  console.log(unlisted.length ? `\n10+ hours but in no category (${unlisted.length}):` : '\nEvery game with 10+ hours is in a category.');
  for (const g of unlisted) console.log(`  - ${g.name}  (${hours(g.minutes)} h, ${g.from})`);

  const orphans = estimated.filter((n) => !listed.has(norm(n)));
  if (orphans.length) {
    console.log(`\nIn estimated.md but in no category (${orphans.length}):`);
    for (const n of orphans) console.log(`  - ${n}`);
  }

  const missing = bullets.filter((names) => !names.some((n) => known.has(norm(n)))).map((names) => names.join(' | '));
  console.log(missing.length ? `\nListed in categories.md but with no hours anywhere (${missing.length}):` : '\nEvery listed game has hours.');
  for (const n of missing) console.log(`  - ${n}`);
}

// The roll-up to series (content/gaming/README.md, "Roll up series"): games that look like they
// belong to the same series, so a refresh can fold them into one "… series" line.
const ROMAN = /\b(i{1,3}|iv|v|vi{0,3}|ix|x{1,3})\b/g;
export function franchiseKey(name) {
  return norm(name)
    .replace(/\s+series$/, '')
    .split(/[:(\-–]/)[0]
    .replace(ROMAN, ' ')
    .replace(/\b\d+\b/g, ' ')
    .replace(/\b(the|game of the year|goty|enhanced|remastered|legacy|definitive|edition|windows|special|anniversary)\b/g, ' ')
    .replace(/[^a-z0-9&' ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
export function checkSeries() {
  const steam = load('content/gaming/steam-games.json');
  const xbox = load('content/gaming/xbox-games.json');
  const lines = readFileSync(resolve('content/gaming/categories.md'), 'utf8')
    .replace(/<!--[\s\S]*?-->/g, '')
    .split(/^## /m)
    .slice(1)
    .join('\n')
    .split(/\r?\n/)
    .filter((l) => /^[-*] +/.test(l))
    .map((l) => l.replace(/^[-*] +/, ''));
  // {solo} on a line: never suggest rolling it into a series.
  const solo = new Set(lines.filter((l) => /\{solo\}/i.test(l)).map((l) => norm(l.replace(/\{[^}]*\}/g, '').split('|')[0].trim())));
  const names = lines.map((l) => l.replace(/\{[^}]*\}/g, '').split('|').map((n) => n.trim()).filter(Boolean));
  const listed = new Set(names.flat().map(norm));
  // Every listed line, plus every game with 10+ hours that no line lists yet.
  const entries = [
    ...names.filter((n) => !solo.has(norm(n[0]))).map((n) => ({ shown: n[0], series: /\bseries$/i.test(n[0]) })),
    ...[...steam, ...xbox].filter((g) => hours(g.minutes) >= 10 && !listed.has(norm(g.name))).map((g) => ({ shown: `${g.name} (not listed yet)`, series: false, raw: g.name })),
  ];
  const seriesKeys = entries.filter((e) => e.series).map((e) => franchiseKey(e.shown));
  const groups = new Map();
  for (const e of entries) {
    let k = franchiseKey(e.raw ?? e.shown);
    // "Assassin's Creed Valhalla" joins an existing "Assassin's Creed series".
    if (!e.series) k = seriesKeys.find((s) => k === s || k.startsWith(s + ' ')) ?? k;
    if (k.length < 3) continue;
    groups.set(k, [...(groups.get(k) ?? []), e]);
  }
  const found = [...groups.values()].filter((g) => g.length > 1);
  const hits = found.filter((g) => g.some((e) => !e.series));
  console.log(hits.length ? `\nMight belong in one series line (${hits.length}); see "Roll up series" in content/gaming/README.md:` : '\nNo new series to roll up.');
  for (const g of hits) console.log('  - ' + g.map((e) => e.shown).join(' + '));
}
