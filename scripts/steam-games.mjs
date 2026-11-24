#!/usr/bin/env node
/**
 * Refreshes the Gamer tab's hours from a Steam export (see content/gaming/README.md).
 *
 *   node scripts/steam-games.mjs ~/Downloads/steam-games.json
 *
 * Reads the GetOwnedGames answer you saved, writes content/gaming/steam-games.json (each game's
 * appid, name and minutes, plus today's date as "exported"), then checks it against
 * content/gaming/categories.md and prints:
 *   - games with 10+ hours that no category lists yet (add them, or leave them out on purpose)
 *   - listed games that aren't in the export (renamed on Steam, or a typo in categories.md)
 * Nothing in categories.md is changed: sorting games into categories stays your call.
 * The export holds no API key, so the saved file is safe to commit.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const src = process.argv[2];
if (!src) {
  console.error('Usage: node scripts/steam-games.mjs <path to the saved GetOwnedGames JSON>');
  process.exit(1);
}
const raw = JSON.parse(readFileSync(resolve(src), 'utf8'));
const games = raw?.response?.games;
if (!Array.isArray(games)) {
  console.error('That file has no response.games list. Save the whole page the API link opens (see content/gaming/README.md).');
  process.exit(1);
}

const out = {
  _about: 'Hours for the Gamer tab, from Steam (GetOwnedGames). Refresh with scripts/steam-games.mjs; see content/gaming/README.md.',
  exported: new Date().toISOString().slice(0, 10),
  games: games
    .map((g) => ({ appid: g.appid, name: String(g.name ?? '').trim(), minutes: g.playtime_forever ?? 0 }))
    .sort((a, b) => b.minutes - a.minutes || a.name.localeCompare(b.name)),
};
// One game per line, so a refresh shows up in git as a readable diff.
const lines = out.games.map((g) => '  ' + JSON.stringify(g)).join(',\n');
writeFileSync(
  resolve('content/gaming/steam-games.json'),
  `{\n "_about": ${JSON.stringify(out._about)},\n "exported": ${JSON.stringify(out.exported)},\n "games": [\n${lines}\n ]\n}\n`,
);

const norm = (s) => s.replace(/[™®©]/g, '').normalize('NFKC').replace(/\s+/g, ' ').trim().toLowerCase();
const listed = readFileSync(resolve('content/gaming/categories.md'), 'utf8')
  .replace(/<!--[\s\S]*?-->/g, '')
  .split(/^## /m)
  .slice(1) // bullets before the first category heading are the file's own instructions
  .join('\n')
  .split(/\r?\n/)
  .filter((l) => /^[-*] +/.test(l))
  .map((l) => l.replace(/^[-*] +/, '').trim());
const byName = new Map(out.games.map((g) => [norm(g.name), g]));
const listedSet = new Set(listed.map(norm));

const hours = (m) => Math.round(m / 60);
const total = out.games.reduce((s, g) => s + g.minutes, 0);
console.log(`Saved content/gaming/steam-games.json: ${out.games.length} games, ${hours(total).toLocaleString('en-US')} hours, exported ${out.exported}.`);

const unlisted = out.games.filter((g) => Math.round(g.minutes / 60) >= 10 && !listedSet.has(norm(g.name)));
console.log(unlisted.length ? `\n10+ hours but in no category (${unlisted.length}):` : '\nEvery game with 10+ hours is in a category.');
for (const g of unlisted) console.log(`  - ${g.name}  (${hours(g.minutes)} h)`);

const missing = listed.filter((n) => !byName.has(norm(n)));
console.log(missing.length ? `\nListed in categories.md but not in the export (${missing.length}):` : '\nEvery listed game is in the export.');
for (const n of missing) console.log(`  - ${n}`);
