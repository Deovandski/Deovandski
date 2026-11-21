// Runs after `astro build` (see "build" in package.json). Astro copies the original of every imported
// picture into dist/_astro/, even when pages only show its resized webp copies. Those originals (full-size
// phone photos, up to ~11 MB each) made the site over 1 GB, past GitHub Pages' artifact limit (#211).
// This deletes every picture in dist/_astro/ that no built page, script, stylesheet or text file uses.
// The originals in content/ are never touched.
import { readdirSync, readFileSync, statSync, unlinkSync } from 'node:fs';
import { join, extname } from 'node:path';

const DIST = 'dist';
const ASSETS = join(DIST, '_astro');
const PICTURE = /\.(jpe?g|png|gif|webp|avif|heic|tiff?)$/i;
const TEXT = /\.(html|js|mjs|css|json|md|txt|xml|svg|webmanifest)$/i;

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]));

const files = walk(DIST);
const text = files.filter((f) => TEXT.test(f)).map((f) => readFileSync(f, 'utf8')).join('\n');
// A picture counts as used if its file name appears in any text file, as is or URL-encoded.
const used = (name) => text.includes(name) || text.includes(encodeURIComponent(name)) || text.includes(encodeURI(name));

let count = 0;
let bytes = 0;
for (const f of files) {
  if (!f.startsWith(ASSETS) || !PICTURE.test(extname(f))) continue;
  const name = f.slice(ASSETS.length + 1);
  if (used(name)) continue;
  bytes += statSync(f).size;
  unlinkSync(f);
  count++;
}
const left = walk(DIST).reduce((n, f) => n + statSync(f).size, 0);
console.log(`prune-originals: removed ${count} unused pictures (${(bytes / 1e6).toFixed(0)} MB); the site is now ${(left / 1e6).toFixed(0)} MB.`);
