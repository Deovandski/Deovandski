#!/usr/bin/env node
/**
 * Imports Xbox hours for the Gamer tab from a download made by scripts/xbox-fetch.mjs
 * (reference only: Deo is Steam-only now; see content/gaming/README.md).
 *
 *   node scripts/xbox-games.mjs ~/Downloads/xbox-download.json
 *
 * Writes content/gaming/xbox-games.json: each game Xbox has hours for (titleId, name, minutes),
 * plus the download's date. Games with no hours (Xbox 360, PC games Xbox only saw launched) are
 * left out. Then it checks content/gaming/categories.md like scripts/steam-games.mjs does.
 * The download holds no key, so the saved file is safe to commit.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { checkCategories } from './gamer-check.mjs';

const src = process.argv[2];
if (!src) {
  console.error('Usage: node scripts/xbox-games.mjs <path to the download from scripts/xbox-fetch.mjs>');
  process.exit(1);
}
const raw = JSON.parse(readFileSync(resolve(src), 'utf8'));
if (!Array.isArray(raw?.games)) {
  console.error('That file has no games list. Make it with scripts/xbox-fetch.mjs (see content/gaming/README.md).');
  process.exit(1);
}

const games = raw.games
  .filter((g) => g.minutes > 0)
  .map((g) => ({ titleId: String(g.titleId), name: String(g.name ?? '').trim(), minutes: g.minutes }))
  .sort((a, b) => b.minutes - a.minutes || a.name.localeCompare(b.name));
const out = {
  _about: 'Hours for the Gamer tab, from Xbox (OpenXBL, MinutesPlayed). Only games Xbox has hours for. Refresh with scripts/xbox-fetch.mjs and scripts/xbox-games.mjs; see content/gaming/README.md.',
  exported: raw.exported || new Date().toISOString().slice(0, 10),
  gamertag: raw.gamertag ?? '',
  games,
};
// One game per line, so a refresh shows up in git as a readable diff.
const lines = games.map((g) => '  ' + JSON.stringify(g)).join(',\n');
writeFileSync(
  resolve('content/gaming/xbox-games.json'),
  `{\n "_about": ${JSON.stringify(out._about)},\n "exported": ${JSON.stringify(out.exported)},\n "gamertag": ${JSON.stringify(out.gamertag)},\n "games": [\n${lines}\n ]\n}\n`,
);

const total = games.reduce((s, g) => s + g.minutes, 0);
const pending = raw.games.filter((g) => g.minutes === undefined).length;
console.log(`Saved content/gaming/xbox-games.json: ${games.length} games with hours (of ${raw.games.length}), ${Math.round(total / 60).toLocaleString('en-US')} hours, exported ${out.exported}.`);
if (pending) console.log(`${pending} games were still waiting for their hours: run scripts/xbox-fetch.mjs again after an hour, then this.`);

checkCategories();
