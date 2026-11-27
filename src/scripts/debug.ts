// "Stats for nerds" (/debug/, #306): fills every [data-v] value of the terminal in src/pages/debug.astro, then starts the
// typing. Build facts come from stats.json (scripts/stats.mjs); the rest is what this browser tells the page.
// Copied from Deovandski-repo-template's src/scripts/debug.ts (template#19); this site adds the data refresh dates, the
// facet tree, the reusable parts and Vraki mode. Nothing is
// saved or sent anywhere: the only requests are stats.json itself (once, plus three timed HEAD requests for "Ping").
// A browser that doesn't share something shows "n/a". After the typing ends, a few values keep updating (clock,
// uptime, frame rate, JS heap, viewport, online status).

export {}; // a module, so its names stay its own

interface Stats {
  code: {
    builtAt: string; builtBy: string; public: boolean | null; run: number | null; runUrl: string | null;
    repo?: string | null; repoUrl?: string | null; branch?: string | null; commit?: string | null; commitUrl?: string | null;
    commitDate?: string | null; commitSubject?: string | null; pr?: number | null; prUrl?: string | null;
    tools: Record<string, string | null>;
  };
  site: {
    url: string | null; pages: number; languages: number; branches: number; tabs: number; subTabs: number; reusable: number;
    files: number; bytes: number; byType: Record<string, { files: number; bytes: number }>; serviceWorker: string | null;
  };
  data: { steam: string | null; xbox: string | null; takeout: string | null };
  i18n: {
    english: { pages: number; segments: number; words: number }; indexCoverage: number;
    languages: { code: string; name: string; dir: string; percent: number; words: number; segments: number; pagesIndexed: number }[];
  };
}
type Nav = Navigator & {
  deviceMemory?: number;
  connection?: { effectiveType?: string; type?: string; downlink?: number; rtt?: number; saveData?: boolean };
  userAgentData?: { brands: { brand: string; version: string }[]; mobile: boolean; platform: string };
  getBattery?: () => Promise<{ level: number; charging: boolean }>;
  gpu?: unknown;
  standalone?: boolean;
};

const root = document.documentElement;
const BASE = root.dataset.base ?? '';
const nav = navigator as Nav;
const term = document.querySelector<HTMLElement>('.debug-terminal');
const word = (k: string): string => document.querySelector(`.debug-words [data-k="${k}"]`)?.textContent ?? k;
const NA = word('na');

// ---------------------------------------------------------------- formatting
const bytes = (n: number | null | undefined): string => {
  if (n == null || !isFinite(n)) return NA;
  const u = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
  return `${n.toFixed(i && n < 10 ? 1 : 0)} ${u[i]}`;
};
const ms = (n: number | null | undefined): string => (n == null || !isFinite(n) || n < 0 ? NA : `${Math.round(n)} ms`);
const when = (iso: string | null | undefined): string => (iso ? new Date(iso).toLocaleString('en-CA', { hour12: false }).replace(',', '') : NA);
const yesNo = (b: boolean): string => word(b ? 'yes' : 'no');
const bar = (pct: number, width = 12): string => {
  const full = Math.round((pct / 100) * width);
  return `[${'█'.repeat(full)}${'░'.repeat(width - full)}]`;
};

/** Put text (or a link) in a value. */
function set(key: string, text: string, href?: string | null): void {
  const el = term?.querySelector<HTMLElement>(`[data-v="${key}"]`);
  if (!el) return;
  if (href) {
    const a = document.createElement('a');
    a.href = href;
    a.rel = 'noopener';
    a.textContent = text;
    el.replaceChildren(a);
  } else el.textContent = text;
}
const timeout = <T>(p: Promise<T>, t = 1500): Promise<T | null> =>
  Promise.race([p.catch(() => null), new Promise<null>((r) => setTimeout(() => r(null), t))]);

// ---------------------------------------------------------------- code, site, languages (stats.json)
async function fromStats(): Promise<void> {
  const res = await timeout(fetch(`${BASE}/stats.json`, { cache: 'no-cache' }));
  const stats = res?.ok ? ((await res.json()) as Stats) : null;
  if (!stats) {
    for (const k of ['repo', 'build', 'i18nSummary']) set(k, word('noStats'));
    return;
  }
  const { code, site, data, i18n } = stats;
  if (code.repo) set('repo', code.repo, code.repoUrl); else set('repo', NA);
  set('visibility', code.public === null ? word('local') : word(code.public ? 'public' : 'private'));
  set('build', code.run ? `#${code.run} · ${code.builtBy}` : code.builtBy, code.runUrl);
  set('builtAt', when(code.builtAt));
  set('branch', code.branch ?? NA);
  set('commit', code.commit ? `${code.commit.slice(0, 7)} ${code.commitSubject ?? ''}`.trim() : NA, code.commitUrl);
  set('commitDate', when(code.commitDate));
  set('pr', code.pr ? `#${code.pr}` : NA, code.prUrl);
  set('run', code.run ? `#${code.run}` : NA, code.runUrl);
  set('tools', Object.entries(code.tools).filter(([, v]) => v).map(([k, v]) => `${k} ${String(v).replace(/^v/, '')}`).join(' · '));
  set('data', [['Steam', data.steam], ['Xbox', data.xbox], ['Google Takeout', data.takeout]].map(([k, v]) => `${k} ${v ?? NA}`).join(' · '));

  set('siteUrl', site.url ?? NA, site.url);
  set('pages', `${site.pages} × ${site.languages} languages`);
  set('tree', `${site.branches} branches · ${site.tabs} tabs · ${site.subTabs} sub-tabs`);
  set('reusable', `${site.reusable} components (src/components/reusable/)`);
  set('deployed', `${site.files} files · ${bytes(site.bytes)}`);
  set('types', Object.entries(site.byType).slice(0, 4).map(([ext, t]) => `${ext} ${bytes(t.bytes)}`).join(' · '));
  const sw = term?.querySelector('[data-v="sw"]');
  if (sw && site.serviceWorker) sw.setAttribute('data-version', site.serviceWorker);

  const e = i18n.english;
  set('i18nSummary', `English: ${e.pages} pages · ${e.segments} segments · ${e.words.toLocaleString('en')} words · indexed at ${Math.round(i18n.indexCoverage * 100)}%`);
  const marker = term?.querySelector('[data-langs-list]');
  const here = root.dataset.lang || 'en';
  for (const l of i18n.languages) {
    const row = document.createElement('div');
    row.className = 'term-row';
    const k = document.createElement('span');
    k.className = 'term-k';
    k.textContent = `${l.code} ${l.name}`;
    const v = document.createElement('span');
    v.className = 'term-v';
    const b = document.createElement('span');
    b.className = 'term-bar';
    b.textContent = `${bar(l.percent)} ${l.percent.toFixed(1).padStart(5)}%`;
    v.append(b, ` ${l.segments}/${e.segments} seg · ${word('indexed')} ${l.pagesIndexed}/${e.pages}`);
    if (l.percent < 50) b.classList.add('term-dim');
    if (l.code === here) { row.classList.add('term-hi'); v.append(` ${word('current')}`); }
    row.append(k, v);
    marker?.before(row);
  }
}

// ---------------------------------------------------------------- this page and the browser
function webgl(): string {
  try {
    const gl = document.createElement('canvas').getContext('webgl');
    if (!gl) return NA;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    return String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
  } catch { return NA; }
}
function storageSummary(s: Storage | null): string {
  try {
    if (!s) return NA;
    let size = 0;
    const keys: string[] = [];
    for (let i = 0; i < s.length; i++) { const k = s.key(i)!; keys.push(k); size += k.length + (s.getItem(k)?.length ?? 0); }
    return keys.length ? `${keys.length} key${keys.length > 1 ? 's' : ''} · ${bytes(size * 2)} · ${keys.join(', ')}` : word('none');
  } catch { return NA; }
}
function browserName(): string {
  const b = nav.userAgentData?.brands?.filter((x) => !/not.?a.?brand/i.test(x.brand));
  if (b?.length) return b.map((x) => `${x.brand} ${x.version}`).join(' · ');
  const m = navigator.userAgent.match(/(Firefox|Edg|OPR|SamsungBrowser|Chrome|Version)\/([\d.]+)/);
  if (!m) return NA;
  const name = m[1] === 'Version' ? 'Safari' : m[1] === 'Edg' ? 'Edge' : m[1] === 'OPR' ? 'Opera' : m[1];
  return `${name} ${m[2]}`;
}

async function fromBrowser(): Promise<void> {
  const mq = (q: string): boolean => matchMedia(q).matches;
  set('path', location.pathname);
  set('pageLang', `${root.lang}${root.dir === 'rtl' ? ' (right to left)' : ''}`);
  set('readyLangs', root.dataset.langs?.trim() || word('none'));
  set('storeKey', root.dataset.store ?? NA);
  let savedVraki = false;
  try { savedVraki = !!JSON.parse(localStorage.getItem(root.dataset.store ?? '') || '{}').vraki; } catch { /* private mode */ }
  set('vraki', root.dataset.lang ? word(savedVraki ? 'vrakiNa' : 'vrakiOff') : word(root.classList.contains('vraki') ? 'vrakiOn' : 'vrakiOff'));
  try { set('saved', localStorage.getItem(root.dataset.store ?? '') ?? word('none')); } catch { set('saved', NA); }
  set('display', word(mq('(display-mode: standalone)') || nav.standalone ? 'standalone' : 'tab'));

  set('browser', browserName());
  set('platform', `${nav.userAgentData?.platform || navigator.platform || NA}${nav.userAgentData?.mobile ? ' (mobile)' : ''}`);
  set('ua', navigator.userAgent);
  set('cpu', navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} logical cores` : NA);
  set('deviceMemory', nav.deviceMemory ? `≥ ${nav.deviceMemory} GB (rounded by the browser)` : NA);
  const cookies = document.cookie ? document.cookie.split(';').map((c) => c.split('=')[0].trim()) : [];
  set('cookies', `${navigator.cookieEnabled ? 'enabled' : 'blocked'} · ${cookies.length ? cookies.join(', ') : 'none set by this site'}`);
  set('local', storageSummary(localStorage));
  set('session', storageSummary(sessionStorage));
  set('screen', `${screen.width}×${screen.height} · ${screen.colorDepth}-bit colour${screen.orientation ? ` · ${screen.orientation.type}` : ''}`);
  set('dpr', `${devicePixelRatio}×`);
  set('scheme', `${mq('(prefers-color-scheme: dark)') ? 'dark' : 'light'}${mq('(prefers-contrast: more)') ? ' · more contrast' : ''}`);
  set('motion', word(mq('(prefers-reduced-motion: reduce)') ? 'reduce' : 'full'));
  set('input', `${mq('(pointer: coarse)') ? 'touch' : mq('(pointer: fine)') ? 'mouse' : NA}${navigator.maxTouchPoints ? ` · ${navigator.maxTouchPoints} touch points` : ''}`);
  set('gpu', webgl());
  set('webgpu', yesNo(!!nav.gpu));
  const tz = Intl.DateTimeFormat().resolvedOptions();
  set('tz', `${tz.timeZone} (UTC${-new Date().getTimezoneOffset() >= 0 ? '+' : ''}${-new Date().getTimezoneOffset() / 60}) · ${tz.locale}`);
  set('langs', (navigator.languages ?? [navigator.language]).join(', '));
  set('secure', yesNo(isSecureContext));
  set('isolated', yesNo(crossOriginIsolated));

  const c = nav.connection;
  set('connection', c ? [c.type, c.effectiveType].filter(Boolean).join(' · ') || NA : NA);
  set('downlink', c?.downlink != null ? `${c.downlink} Mbps (estimate)` : NA);
  set('rtt', c?.rtt != null ? `${c.rtt} ms (estimate)` : NA);
  set('saveData', c?.saveData != null ? yesNo(c.saveData) : NA);

  const est = await timeout(navigator.storage?.estimate?.() ?? Promise.reject());
  const persisted = await timeout(navigator.storage?.persisted?.() ?? Promise.reject());
  set('storage', est ? `${bytes(est.usage)} used of ${bytes(est.quota)}${persisted != null ? ` · persistent: ${yesNo(persisted)}` : ''}` : NA);

  if (!('serviceWorker' in navigator)) set('sw', word('noWorker'));
  else {
    const reg = await timeout(navigator.serviceWorker.getRegistration());
    const version = term?.querySelector('[data-v="sw"]')?.getAttribute('data-version');
    set('sw', reg ? `${word(navigator.serviceWorker.controller ? 'controlled' : 'notControlled')}${version ? ` · ${version}` : ''} · scope ${new URL(reg.scope).pathname}` : word('none'));
  }
  if ('caches' in window) {
    const names = (await timeout(caches.keys())) ?? [];
    const counts = await Promise.all(names.map(async (n) => (await timeout((await caches.open(n)).keys()))?.length ?? 0));
    set('caches', names.length ? names.map((n, i) => `${n}: ${counts[i]} files`).join(' · ') : word('none'));
  } else set('caches', NA);

  const bat = nav.getBattery ? await timeout(nav.getBattery()) : null;
  set('battery', bat ? `${Math.round(bat.level * 100)}% · ${word(bat.charging ? 'charging' : 'unplugged')}` : NA);
}

// ---------------------------------------------------------------- network and performance
async function fromNetwork(): Promise<void> {
  const nt = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  if (nt) {
    set('protocol', nt.nextHopProtocol || NA);
    set('servedFrom', word(nt.workerStart > 0 && nt.transferSize === 0 ? 'worker' : nt.transferSize === 0 ? 'memcache' : 'network'));
    set('dns', ms(nt.domainLookupEnd - nt.domainLookupStart));
    set('connect', ms(nt.connectEnd - nt.connectStart));
    set('tls', nt.secureConnectionStart > 0 ? ms(nt.connectEnd - nt.secureConnectionStart) : NA);
    set('ttfb', ms(nt.responseStart - nt.startTime));
    set('download', ms(nt.responseEnd - nt.responseStart));
    set('domReady', ms(nt.domContentLoadedEventEnd - nt.startTime));
    set('load', nt.loadEventEnd ? ms(nt.loadEventEnd - nt.startTime) : NA);
    set('transfer', `${bytes(nt.transferSize)} over the wire · ${bytes(nt.decodedBodySize)} HTML`);
  }
  const res = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  set('resources', `${res.length} files · ${bytes(res.reduce((n, r) => n + (r.transferSize || 0), 0))} over the wire`);
  set('nodes', `${document.getElementsByTagName('*').length} elements`);
  const fcp = performance.getEntriesByName('first-contentful-paint')[0];
  set('fcp', ms(fcp?.startTime));
  // Largest paint and layout shift arrive as buffered observer entries; take what's there now.
  const observed = (type: string): PerformanceEntry[] => {
    let got: PerformanceEntry[] = [];
    try {
      const o = new PerformanceObserver(() => {});
      o.observe({ type, buffered: true });
      got = o.takeRecords();
      o.disconnect();
    } catch { /* not supported */ }
    return got;
  };
  const lcp = observed('largest-contentful-paint').at(-1);
  set('lcp', ms(lcp?.startTime));
  const shifts = observed('layout-shift') as (PerformanceEntry & { value: number; hadRecentInput: boolean })[];
  set('cls', shifts.length || PerformanceObserver.supportedEntryTypes?.includes('layout-shift') ? shifts.filter((s) => !s.hadRecentInput).reduce((n, s) => n + s.value, 0).toFixed(3) : NA);

  // Ping: three HEAD requests for stats.json, straight to the server (no-store skips every cache).
  const times: number[] = [];
  let headers: Headers | null = null;
  for (let i = 0; i < 3; i++) {
    const t0 = performance.now();
    const r = await timeout(fetch(`${BASE}/stats.json?ping=${Date.now()}`, { method: 'HEAD', cache: 'no-store' }), 3000);
    if (!r) break;
    times.push(performance.now() - t0);
    headers ??= r.headers;
  }
  set('ping', times.length ? `min ${ms(Math.min(...times))} · avg ${ms(times.reduce((a, b) => a + b, 0) / times.length)} (${times.length} HEAD requests)` : NA);
  set('server', headers?.get('server') ?? NA);
  set('cdn', headers?.get('x-served-by') ?? headers?.get('via') ?? NA);
  set('cdnCache', [headers?.get('x-cache'), headers?.get('cache-control'), headers?.get('age') ? `age ${headers.get('age')}s` : null].filter(Boolean).join(' · ') || NA);
}

// ---------------------------------------------------------------- live values
let frameCount = 0;
let fps = 0;
const countFrames = (): void => { frameCount++; requestAnimationFrame(countFrames); };
function live(): void {
  const heap = (performance as Performance & { memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
  set('heap', heap ? `${bytes(heap.usedJSHeapSize)} used · ${bytes(heap.totalJSHeapSize)} allocated · ${bytes(heap.jsHeapSizeLimit)} limit` : NA);
  set('viewport', `${innerWidth}×${innerHeight}`);
  set('clock', new Date().toLocaleString('en-CA', { hour12: false }).replace(',', ''));
  const s = Math.floor(performance.now() / 1000);
  set('uptime', `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s on this page`);
  set('fps', fps ? `${fps} fps` : '…');
  set('online', word(navigator.onLine ? 'online' : 'offline'));
}

async function main(): Promise<void> {
  set('now', when(new Date().toISOString()));
  set('memtest', nav.deviceMemory ? `${nav.deviceMemory * 1024 * 1024}K` : '640K');
  live();
  requestAnimationFrame(countFrames);
  await Promise.all([fromStats(), fromBrowser(), timeout(fromNetwork(), 2500)]);
  live();
  term?.addEventListener('terminal:done', () => {
    setInterval(() => { fps = frameCount; frameCount = 0; live(); }, 1000);
  }, { once: true });
  term?.dispatchEvent(new CustomEvent('terminal:start'));
}

if (document.readyState === 'complete') void main();
else addEventListener('load', () => setTimeout(() => void main()), { once: true }); // after load ends, so "Load" has its time
