// Service worker: lets the installed app (and the site in Chrome) open the QR Code and Gaming pages with no signal.
//
// What it saves on the phone:
//   - the QR Code and Gaming pages with everything they load (CSS, scripts, images such as the header
//     logo and the Whack-a-Miku sprite), and the home page
//     with its CSS and scripts only, read from their HTML when the worker installs;
//   - afterwards, any CSS, script or font the site loads (small, and the file names change with
//     every build, so old copies are never served by mistake).
// What it never saves: photos from the galleries or anything from other websites, so it can't fill
// the phone's storage.
//
// Pages: the QR Code and Gaming pages open from the saved copy at once and are refreshed in the background.
// Other pages come from the network; if there's no answer within 4 seconds (or no signal), the
// saved copy is used when there is one.
//
// Change VERSION to throw away everything saved and start over.
const VERSION = 'v2';
const CACHE = `deovandski-${VERSION}`;
const SCOPE = new URL(self.registration.scope);
const QR = new URL('qr/', SCOPE).href;
const GAMING = new URL('gaming/', SCOPE).href;
const OFFLINE = [QR, GAMING]; // pages that must work offline
const PAGES = [SCOPE.href, ...OFFLINE];
const EXTRA = ['manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/shortcut-qr-96.png', 'icons/shortcut-gaming-96.png', 'favicon.png'].map(
  (p) => new URL(p, SCOPE).href,
);

// Same-origin files a page needs to draw itself: stylesheets, scripts, preloads, and (only when
// withImages is true) its <img src>. The home page is full of gallery photos, so it never gets images.
function assetsOf(html, pageUrl, withImages) {
  const found = new Set();
  const re = /<(?:link|script|img)\b[^>]*?\s(?:href|src)="([^"]+)"[^>]*>/gi;
  for (const m of html.matchAll(re)) {
    const tag = m[0];
    if (/^<img/i.test(tag) && !withImages) continue;
    if (/^<link/i.test(tag) && !/rel="(?:stylesheet|modulepreload|preload|icon)"/i.test(tag)) continue;
    const url = new URL(m[1].replace(/&amp;/g, '&'), pageUrl);
    if (url.origin === SCOPE.origin && url.href.startsWith(SCOPE.href)) found.add(url.href);
  }
  return [...found];
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      for (const page of PAGES) {
        const res = await fetch(page, { cache: 'no-cache' });
        if (!res.ok) continue;
        const html = await res.clone().text();
        await cache.put(page, res);
        // The offline pages' files must all be saved; the home page's are best effort.
        const offline = OFFLINE.includes(page);
        const files = assetsOf(html, page, offline);
        if (offline) await cache.addAll(files);
        else await Promise.allSettled(files.map((f) => cache.add(f)));
      }
      await Promise.allSettled(EXTRA.map((f) => cache.add(f)));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) if (key.startsWith('deovandski-') && key !== CACHE) await caches.delete(key);
      await self.clients.claim();
    })(),
  );
});

// A page's address without its #hash or ?query, so /qr/?src=x and /qr/#top share one saved copy.
const pageKey = (url) => url.origin + url.pathname;

async function networkFirst(request, key) {
  const cache = await caches.open(CACHE);
  const network = fetch(request).then((res) => {
    if (res.ok) cache.put(key, res.clone());
    return res;
  });
  const timeout = new Promise((resolve) => setTimeout(resolve, 4000));
  try {
    const res = await Promise.race([network, timeout]);
    if (res) return res;
  } catch {
    // offline: fall through to the saved copy
  }
  return (await cache.match(key)) ?? network;
}

async function savedFirst(request, key, event) {
  const cache = await caches.open(CACHE);
  const saved = await cache.match(key);
  const refresh = fetch(request)
    .then((res) => {
      if (res.ok) return cache.put(key, res.clone()).then(() => res);
      return res;
    })
    .catch(() => saved);
  if (saved) {
    event.waitUntil(refresh);
    return saved;
  }
  return refresh;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== SCOPE.origin || !url.href.startsWith(SCOPE.href)) return; // other websites: hands off

  if (request.mode === 'navigate') {
    const key = pageKey(url);
    event.respondWith(OFFLINE.includes(key) ? savedFirst(request, key, event) : networkFirst(request, key));
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const saved = await cache.match(request, { ignoreSearch: true });
      if (saved) return saved;
      const res = await fetch(request);
      if (res.ok && ['style', 'script', 'font', 'manifest'].includes(request.destination)) cache.put(request, res.clone());
      return res;
    })(),
  );
});
