// Ranks Deo's most-watched Best of the Worst videos from a Google Takeout watch history, for the BOTW tab.
//
//   node scripts/botw-from-history.mjs path/to/watch-history.json [--top 39] [--all]
//
// Get the file from takeout.google.com: only "YouTube and YouTube Music" → history, format JSON.
// It's in Takeout/YouTube and YouTube Music/history/watch-history.json. Never commit it (.gitignore
// skips it): it's your whole viewing history. Only the ranked list this prints goes into the repo.
//
// Counts each Red Letter Media video whose title is part of the Best of the Worst family
// (Best of the Worst, Wheel of the Worst, Spotlight, Junka, Black Spine): every entry in the
// history is one time you watched it. Prints numbered lines ready for content/botw.md:
//   1. [Best of the Worst: Example](https://www.youtube.com/watch?v=...) - watched 12 times
// --all prints every match with its count (to check what was counted) instead of the top list.
import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith('--'));
if (!file) {
  console.error('Usage: node scripts/botw-from-history.mjs path/to/watch-history.json [--top 39] [--all]');
  process.exit(1);
}
const topAt = args.indexOf('--top');
const TOP = topAt >= 0 ? Number(args[topAt + 1]) : 39;
const ALL = args.includes('--all');

const FAMILY = /best of the worst|wheel of the worst|spotlight|junka|black spine/i;
const CHANNEL = /red\s*letter\s*media/i;

const history = JSON.parse(readFileSync(file, 'utf8'));
const byId = new Map();
for (const item of history) {
  if (!item.titleUrl || !item.title) continue; // removed or private videos have no link
  const channel = item.subtitles?.[0]?.name ?? '';
  const title = item.title.replace(/^Watched\s+/, '').trim();
  if (!CHANNEL.test(channel) || !FAMILY.test(title)) continue;
  const id = new URL(item.titleUrl.replace(/\\u003d/g, '=')).searchParams.get('v');
  if (!id) continue;
  const seen = byId.get(id) ?? { id, title, count: 0, last: '' };
  seen.count += 1;
  // Keep the newest title (YouTube titles change; the history holds the title at each viewing).
  if (!seen.last || item.time > seen.last) {
    seen.last = item.time;
    seen.title = title;
  }
  byId.set(id, seen);
}

// Most watched first; ties go to the one watched most recently.
const ranked = [...byId.values()].sort((a, b) => b.count - a.count || b.last.localeCompare(a.last));
const md = (t) => t.replace(/([[\]])/g, '\\$1');
const list = ALL ? ranked : ranked.slice(0, TOP);
list.forEach((v, i) => {
  const url = `https://www.youtube.com/watch?v=${v.id}`;
  console.log(`${i + 1}. [${md(v.title)}](${url}) - watched ${v.count} ${v.count === 1 ? 'time' : 'times'}`);
});
console.error(`${byId.size} Best of the Worst family videos found; printed ${list.length}.`);
