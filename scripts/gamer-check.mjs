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
