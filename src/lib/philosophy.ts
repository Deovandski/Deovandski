import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export type Philosophy = {
  mantras: { text: string; isNew: boolean }[];
  lessons: { text: string; source?: string }[];
  closing: string[][]; // stanzas -> lines
  closingCredit?: string;
};

const FILE = 'content/philosophy.md';

/** Parses content/philosophy.md (## Mantras, ## Lessons, ## Closing). */
export function loadPhilosophy(): Philosophy {
  const text = readFileSync(resolve(FILE), 'utf8');
  const sections: Record<string, string> = {};
  for (const part of text.split(/^## +/m).slice(1)) {
    const nl = part.indexOf('\n');
    sections[part.slice(0, nl).trim().toLowerCase()] = part.slice(nl + 1);
  }
  const bullets = (s = '') =>
    s
      .split(/\r?\n/)
      .filter((l) => /^\s*[-*] +/.test(l))
      .map((l) => l.replace(/^\s*[-*] +/, '').trim());

  const mantras = bullets(sections['mantras']).map((b) => ({
    isNew: /^\[new\]\s*/i.test(b),
    text: b.replace(/^\[new\]\s*/i, ''),
  }));
  const lessons = bullets(sections['lessons']).map((b) => {
    const [quote, source] = b.split(/\s+\|\s+/);
    return { text: quote.trim(), source: source?.trim() };
  });

  const closingRaw = (sections['closing'] ?? '').trim();
  const stanzas = closingRaw.split(/\r?\n\s*\r?\n/).map((s) => s.trim()).filter(Boolean);
  let closingCredit: string | undefined;
  if (stanzas.length && /^[—–-]/.test(stanzas[stanzas.length - 1])) {
    closingCredit = stanzas.pop()!.replace(/^[—–-]\s*/, '');
  }
  const closing = stanzas.map((s) => s.split(/\r?\n/).map((l) => l.trim()));

  if (mantras.length === 0) throw new Error(`${FILE}: add at least one bullet under "## Mantras".`);
  return { mantras, lessons, closing, closingCredit };
}
