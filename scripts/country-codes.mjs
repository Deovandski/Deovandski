// Regenerates content/travel/COUNTRY_CODES.md from the world-countries package.
// Run with: npm run travel:codes
import { writeFileSync } from 'node:fs';
import countries from 'world-countries';

const slug = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’.]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

function regionOf(c) {
  if (c.region === 'Americas') return c.subregion === 'South America' ? 'south-america' : 'north-america';
  if (c.region === 'Antarctic') return 'antarctica';
  return c.region.toLowerCase();
}

const order = ['africa', 'antarctica', 'asia', 'europe', 'north-america', 'oceania', 'south-america'];
const groups = Object.fromEntries(order.map((r) => [r, []]));
for (const c of countries) groups[regionOf(c)].push(c);

let md = `# Country codes for travel folders

Each country folder is named \`<code>-<name>\`, where the code is the two-letter
ISO 3166-1 code. The code decides where the pin goes. The name after it is only
there to make the folder readable, and the site shows the official country name
unless you set \`name:\` in \`_info.md\`.

Copy the folder path from the tables below, e.g.
\`content/travel/asia/jp-japan/\`. Drop photos (.jpg, .png, .webp, .avif) in it
and the pin appears on the next build.

`;

for (const region of order) {
  const list = groups[region].sort((a, b) => a.name.common.localeCompare(b.name.common));
  md += `## ${region}\n\n| Country | Code | Folder |\n|---|---|---|\n`;
  for (const c of list) {
    const code = c.cca2.toLowerCase();
    md += `| ${c.name.common} | ${code} | \`${region}/${code}-${slug(c.name.common)}\` |\n`;
  }
  md += '\n';
}

writeFileSync('content/travel/COUNTRY_CODES.md', md);
console.log(`Wrote ${countries.length} countries to content/travel/COUNTRY_CODES.md`);
