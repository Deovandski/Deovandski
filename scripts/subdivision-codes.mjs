// Regenerates content/travel/SUBDIVISION_CODES.md (states, provinces, prefectures).
// Run with: npm run travel:codes
import { writeFileSync } from 'node:fs';
import { State } from 'country-state-city';

const COUNTRIES = [
  ['US', 'north-america/us-united-states', 'United States'],
  ['CA', 'north-america/ca-canada', 'Canada'],
  ['BR', 'south-america/br-brazil', 'Brazil'],
  ['VN', 'asia/vn-vietnam', 'Vietnam'],
  ['JP', 'asia/jp-japan', 'Japan'],
];

const slug = (s) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase()
    .replace(/\s+(prefecture|province)$/, '').replace(/['’.]/g, '').replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

let md = `# State, province and prefecture codes

Inside a country folder, make one subfolder per state, province or prefecture
and drop photos in it. Each one gets its own pin on the map. The code before the
first dash decides where the pin goes; the rest of the name is just for you.

Photos directly in the country folder still get a pin for the whole country.

Example: \`content/travel/asia/jp-japan/13-tokyo/\` and
\`content/travel/north-america/us-united-states/tx-texas/\`.

Any other country works the same way; ask for its list if you need it.

`;

for (const [cc, folder, name] of COUNTRIES) {
  const states = State.getStatesOfCountry(cc).sort((a, b) => a.name.localeCompare(b.name));
  md += `## ${name}\n\n| Name | Folder |\n|---|---|\n`;
  for (const s of states) md += `| ${s.name} | \`${folder}/${s.isoCode.toLowerCase()}-${slug(s.name)}\` |\n`;
  md += '\n';
}
writeFileSync('content/travel/SUBDIVISION_CODES.md', md);
console.log('Wrote content/travel/SUBDIVISION_CODES.md');
