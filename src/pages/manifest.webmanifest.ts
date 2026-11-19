import type { APIRoute } from 'astro';

// The web app manifest: what Android (and desktop Chrome) need to install the site as an app.
// Every address starts with the base path (/Deovandski/ on GitHub Pages), so it's built here, not in public/.
// Long-pressing the installed app's icon shows the shortcuts (QR Code → /qr/).
export const GET: APIRoute = () => {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  const manifest = {
    id: base,
    name: "Deovandski's Blog",
    short_name: 'Deovandski',
    description: "Deovandski's hub: software, books, travel and games.",
    start_url: base,
    scope: base,
    display: 'standalone',
    background_color: '#070b1f',
    theme_color: '#070b1f',
    icons: [
      { src: `${base}icons/icon-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: `${base}icons/icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: `${base}icons/icon-maskable-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      {
        name: 'QR Code',
        short_name: 'QR Code',
        description: 'QR codes for sharing contact info (works offline)',
        url: `${base}qr/`,
        icons: [{ src: `${base}icons/shortcut-qr-96.png`, sizes: '96x96', type: 'image/png' }],
      },
    ],
  };
  return new Response(JSON.stringify(manifest, null, 2), { headers: { 'Content-Type': 'application/manifest+json' } });
};
