// Live "summary fields" for gimmick FastTabs (F&O style), read from the saves the games already keep in
// this browser. Every FastTab that shows a gimmick carries data-gimmick-id; its data-summary-base is the
// fixed part (nothing today; a page can set one), and the live value is added after it.
const read = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

// The words come from the game's own hidden strings (translated on a translated page), English otherwise.
const word = (el: HTMLElement, key: string, fallback: string, n: string | number) =>
  (el.querySelector(`[data-k="${key}"]`)?.textContent ?? fallback).replace('{n}', String(n));

// A game that saves JSON: one number from it, shown with the game's own "summary" words. Nothing when it's 0.
const fromSave = (el: HTMLElement, key: string, pick: (save: Record<string, unknown>) => unknown) => {
  try {
    const n = Number(pick(JSON.parse(read(key) ?? '{}')));
    return n > 0 ? word(el, 'summary', '{n}', n) : null;
  } catch {
    return null;
  }
};

const live: Record<string, (el: HTMLElement) => string | null> = {
  'paper-plane': (el) => {
    const best = Number(read('paper-plane-best'));
    return best > 0 ? word(el, 'summary', 'Best {n} m', best.toFixed(1)) : null;
  },
  'perfect-egg': (el) => {
    try {
      const best = Object.values(JSON.parse(read('perfect-egg') ?? '{}').best ?? {}).map(Number);
      return best.length ? word(el, 'summary', 'Best egg: {n} of 3 stars', Math.round(Math.max(...best) * 10) / 10) : null;
    } catch {
      return null;
    }
  },
  'whack-a-miku': (el) => fromSave(el, 'whack-a-miku', (s) => s.best),
  'where-was-deo': (el) => fromSave(el, 'where-was-deo', (s) => s.best),
  'ice-fishing': (el) => fromSave(el, 'ice-fishing', (s) => s.total),
  'saturday-night-fever': (el) => fromSave(el, 'saturday-night-fever', (s) => Math.max(0, ...Object.values((s.best ?? {}) as Record<string, number>).map(Number))),
  'dino-ambush': (el) => fromSave(el, 'dino-ambush', (s) => s.won),
  'terminal-typer': (el) =>
    fromSave(el, 'terminal-typer', (s) => Math.max(0, ...Object.values((s.best ?? {}) as Record<string, { wpm: number }>).map((b) => Number(b.wpm)))),
  'balls-farm': (el) => {
    try {
      const farm = JSON.parse(read('balls-farm') ?? 'null');
      const balls = farm ? Object.values(farm.bag ?? {}).reduce((a: number, n) => a + Number(n || 0), 0) : 0;
      return balls > 0 ? (balls === 1 ? word(el, 'bagOne', '{n} ball in the bag', 1) : word(el, 'bagMany', '{n} balls in the bag', balls)) : null;
    } catch {
      return null;
    }
  },
};

export function refreshGimmickSummaries() {
  document.querySelectorAll<HTMLElement>('[data-gimmick-id]').forEach((el) => {
    const out = el.querySelector<HTMLElement>('[data-fasttab-summary]');
    if (!out) return;
    const base = el.dataset.summaryBase ?? '';
    const value = live[el.dataset.gimmickId!]?.(el) ?? null;
    out.textContent = [base, value].filter(Boolean).join(' · ');
  });
}
