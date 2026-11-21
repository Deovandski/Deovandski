// Live "summary fields" for gimmick FastTabs (F&O style), read from the saves the games already keep in
// this browser. Every FastTab that shows a gimmick carries data-gimmick-id; its data-summary-base is the
// fixed part ("Mentor tab" on the Gaming page, nothing on a tab), and the live value is added after it.
const read = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const live: Record<string, () => string | null> = {
  'paper-plane': () => {
    const best = Number(read('paper-plane-best'));
    return best > 0 ? `Best ${best.toFixed(1)} m` : null;
  },
  'balls-farm': () => {
    try {
      const farm = JSON.parse(read('balls-farm') ?? 'null');
      const balls = farm ? Object.values(farm.bag ?? {}).reduce((a: number, n) => a + Number(n || 0), 0) : 0;
      return balls > 0 ? `${balls} ${balls === 1 ? 'ball' : 'balls'} in the bag` : null;
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
    const value = live[el.dataset.gimmickId!]?.() ?? null;
    out.textContent = [base, value].filter(Boolean).join(' · ');
  });
}
