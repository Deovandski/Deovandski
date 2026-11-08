import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export type Game = { rank: number; game: string; hours: number };

const FILE = 'content/gaming/top10.md';

/** Reads the Rank | Game | Hours table from content/gaming/top10.md. */
export function loadTopGames(): Game[] {
  const text = readFileSync(resolve(FILE), 'utf8');
  const rows = text
    .split(/\r?\n/)
    .map((line, i) => ({ line: line.trim(), n: i + 1 }))
    .filter(({ line }) => line.startsWith('|'));

  if (rows.length < 3) throw new Error(`${FILE}: no table found. Expected a "| Rank | Game | Hours |" table.`);

  const header = cells(rows[0].line).map((c) => c.toLowerCase());
  const col = { rank: header.indexOf('rank'), game: header.indexOf('game'), hours: header.indexOf('hours') };
  for (const [name, idx] of Object.entries(col)) {
    if (idx === -1) throw new Error(`${FILE}: the table header needs a "${name}" column.`);
  }

  const games: Game[] = [];
  const errors: string[] = [];
  for (const { line, n } of rows.slice(2)) {
    const c = cells(line);
    const rank = Number(c[col.rank]);
    const game = (c[col.game] ?? '').trim();
    const hours = Number((c[col.hours] ?? '').replace(/[,_\s]/g, ''));
    if (!Number.isInteger(rank) || rank < 1) errors.push(`line ${n}: rank "${c[col.rank]}" must be a whole number from 1.`);
    if (!game) errors.push(`line ${n}: game name is empty.`);
    if (!Number.isFinite(hours) || hours < 0) errors.push(`line ${n}: hours "${c[col.hours]}" must be a number.`);
    games.push({ rank, game, hours: Math.round(hours) });
  }

  const seen = new Set<number>();
  for (const g of games) {
    if (seen.has(g.rank)) errors.push(`rank ${g.rank} is used more than once.`);
    seen.add(g.rank);
  }
  if (errors.length) throw new Error(`${FILE} has problems:\n- ${errors.join('\n- ')}`);

  return games.sort((a, b) => a.rank - b.rank);
}

function cells(line: string): string[] {
  return line.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
}
