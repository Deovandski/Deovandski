import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export type RankedItem = { rank: number; name: string; value: number };

/**
 * Reads a "| Rank | <item> | <value> |" Markdown table, e.g.
 * content/gaming/top39.md (Game, Hours) or content/anime/top39.md (Anime, Episodes).
 * Throws a readable error listing every bad line so the build tells you what to fix.
 */
export function loadRanking(file: string, itemColumn: string, valueColumn: string): RankedItem[] {
  const text = readFileSync(resolve(file), 'utf8');
  const rows = text
    .split(/\r?\n/)
    .map((line, i) => ({ line: line.trim(), n: i + 1 }))
    .filter(({ line }) => line.startsWith('|'));

  if (rows.length < 3) throw new Error(`${file}: no table found. Expected a "| Rank | ${itemColumn} | ${valueColumn} |" table.`);

  const header = cells(rows[0].line).map((c) => c.toLowerCase());
  const col = {
    rank: header.indexOf('rank'),
    name: header.indexOf(itemColumn.toLowerCase()),
    value: header.indexOf(valueColumn.toLowerCase()),
  };
  const labels = { rank: 'Rank', name: itemColumn, value: valueColumn };
  for (const [key, idx] of Object.entries(col)) {
    if (idx === -1) throw new Error(`${file}: the table header needs a "${labels[key as keyof typeof labels]}" column.`);
  }

  const items: RankedItem[] = [];
  const errors: string[] = [];
  for (const { line, n } of rows.slice(2)) {
    const c = cells(line);
    const rank = Number(c[col.rank]);
    const name = (c[col.name] ?? '').trim();
    const value = Number((c[col.value] ?? '').replace(/[,_\s]/g, ''));
    if (!Number.isInteger(rank) || rank < 1) errors.push(`line ${n}: rank "${c[col.rank]}" must be a whole number from 1.`);
    if (!name) errors.push(`line ${n}: ${itemColumn.toLowerCase()} name is empty.`);
    if (!Number.isFinite(value) || value < 0) errors.push(`line ${n}: ${valueColumn.toLowerCase()} "${c[col.value]}" must be a number.`);
    items.push({ rank, name, value: Math.round(value) });
  }

  const seen = new Set<number>();
  for (const item of items) {
    if (seen.has(item.rank)) errors.push(`rank ${item.rank} is used more than once.`);
    seen.add(item.rank);
  }
  if (errors.length) throw new Error(`${file} has problems:\n- ${errors.join('\n- ')}`);

  return items.sort((a, b) => a.rank - b.rank);
}

function cells(line: string): string[] {
  return line.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
}
