import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export type Language = { name: string; native: string; level: number; color: 'green' | 'yellow' | 'red'; note: string };

const FILE = 'content/languages.md';
const COLORS = ['green', 'yellow', 'red'] as const;

/** Reads the Language | Native | Level | Color | Note table from content/languages.md. */
export function loadLanguages(): Language[] {
  const rows = readFileSync(resolve(FILE), 'utf8')
    .split(/\r?\n/)
    .map((line, i) => ({ line: line.trim(), n: i + 1 }))
    .filter(({ line }) => line.startsWith('|'));
  if (rows.length < 3) throw new Error(`${FILE}: no table found.`);

  const cells = (l: string) => l.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
  const header = cells(rows[0].line).map((h) => h.toLowerCase());
  const col = (name: string) => {
    const i = header.indexOf(name);
    if (i === -1) throw new Error(`${FILE}: the table header needs a "${name}" column.`);
    return i;
  };
  const c = { name: col('language'), native: col('native'), level: col('level'), color: col('color'), note: col('note') };

  const errors: string[] = [];
  const langs = rows.slice(2).map(({ line, n }) => {
    const r = cells(line);
    const level = Number(r[c.level]);
    const color = (r[c.color] ?? '').toLowerCase() as Language['color'];
    if (!r[c.name]) errors.push(`line ${n}: language is empty.`);
    if (!Number.isInteger(level) || level < 1 || level > 10) errors.push(`line ${n}: level "${r[c.level]}" must be 1 to 10.`);
    if (!COLORS.includes(color)) errors.push(`line ${n}: color "${r[c.color]}" must be green, yellow or red.`);
    return { name: r[c.name], native: r[c.native] || r[c.name], level, color, note: r[c.note] ?? '' };
  });
  if (errors.length) throw new Error(`${FILE} has problems:\n- ${errors.join('\n- ')}`);
  return langs;
}
