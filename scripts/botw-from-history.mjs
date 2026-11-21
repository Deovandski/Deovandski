// Ranks Deo's most-watched Best of the Worst videos from a Google Takeout watch history, for the BOTW tab.
//
//   node scripts/botw-from-history.mjs path/to/watch-history.json [--top 39] [--all]
//   node scripts/botw-from-history.mjs path/to/watch-history.html [--top 39] [--all] [--stats content/botw-stats.json]
//
// Get the file from takeout.google.com: only "YouTube and YouTube Music" → history. Takeout's default
// format is HTML (watch-history.html); JSON works too. It's in Takeout/YouTube and YouTube Music/history/.
// Never commit it (.gitignore skips it): it's your whole viewing history. Only the ranked list this
// prints goes into the repo.
//
// Counts each Red Letter Media video whose title is part of the Best of the Worst family
// (Best of the Worst, Wheel of the Worst, Spotlight, Junka, Black Spine): every entry in the
// history is one time you watched it. Prints numbered lines ready for content/botw.md:
//   1. [Best of the Worst: Example](https://www.youtube.com/watch?v=...) - watched 12 times
// --all prints every match with its count (to check what was counted) instead of the top list.
// --stats <file> also writes the numbers behind the VHS pile on the tab: the dates the history covers
// (first to last entry), views, videos, and watch time. Watch time is each video's length (from
// content/botw-durations.json) times the times it was watched, as if every view ran start to finish.
// A video missing from that file is listed, and counts as 0 until its length is added.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith('--'));
if (!file) {
  console.error('Usage: node scripts/botw-from-history.mjs path/to/watch-history.json [--top 39] [--all]');
  process.exit(1);
}
const topAt = args.indexOf('--top');
const TOP = topAt >= 0 ? Number(args[topAt + 1]) : 39;
const ALL = args.includes('--all');
const statsAt = args.indexOf('--stats');
const STATS = statsAt >= 0 ? args[statsAt + 1] : null;

const FAMILY = /best of the worst|wheel of the worst|spotlight|junka|black spine/i;
const CHANNEL = /red\s*letter\s*media/i;

const raw = readFileSync(file, 'utf8');
const history = raw.trimStart().startsWith('<') ? fromHtml(raw) : JSON.parse(raw);

// Takeout's HTML export: one card per viewing, "Watched <a href=video>Title</a><br><a href=channel>Channel</a><br>date".
// Turned into the same shape as the JSON export ({ title, titleUrl, subtitles: [{ name }], time }).
function fromHtml(html) {
  const decode = (t) =>
    t
      .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
      .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&');
  const items = [];
  const re = /Watched\s*<a href="([^"]+)">([\s\S]*?)<\/a><br>(?:<a href="[^"]*">([\s\S]*?)<\/a><br>)?([^<]*)<br>/g;
  for (const m of html.matchAll(re)) {
    const when = new Date(m[4].replace(/\s+[A-Z]{2,5}$/, '').replace(/\u202f/g, ' '));
    items.push({
      title: `Watched ${decode(m[2])}`,
      titleUrl: decode(m[1]),
      subtitles: m[3] ? [{ name: decode(m[3]) }] : [],
      time: Number.isNaN(when.getTime()) ? '' : localStamp(when),
    });
  }
  return items;
}

// The date and time as written in the export (the viewer's own time zone), sortable as text.
function localStamp(d) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}
const byId = new Map();
let first = '';
let last = '';
for (const item of history) {
  if (item.time) {
    if (!first || item.time < first) first = item.time;
    if (!last || item.time > last) last = item.time;
  }
  if (!item.titleUrl || !item.title) continue; // removed or private videos have no link
  const channel = item.subtitles?.[0]?.name ?? '';
  const title = item.title.replace(/^Watched\s+/, '').trim();
  if (!CHANNEL.test(channel) || !FAMILY.test(title)) continue;
  let id = null;
  try {
    id = new URL(item.titleUrl.replace(/\\u003d/g, '=')).searchParams.get('v');
  } catch {
    continue;
  }
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

if (STATS) {
  const durFile = 'content/botw-durations.json';
  const durations = existsSync(durFile) ? JSON.parse(readFileSync(durFile, 'utf8')) : {};
  const missing = ranked.filter((v) => typeof durations[v.id] !== 'number');
  const seconds = ranked.reduce((sum, v) => sum + v.count * (durations[v.id] ?? 0), 0);
  const stats = {
    _about: 'Written by scripts/botw-from-history.mjs --stats. Watch time = each video length x times watched.',
    from: first.slice(0, 10),
    to: last.slice(0, 10),
    videos: ranked.length,
    views: ranked.reduce((sum, v) => sum + v.count, 0),
    hours: Math.round(seconds / 360) / 10,
  };
  writeFileSync(STATS, JSON.stringify(stats, null, 2) + '\n');
  console.error(`Wrote ${STATS}: ${stats.views} views of ${stats.videos} videos, ${stats.hours} hours, ${stats.from} to ${stats.to}.`);
  if (missing.length) console.error(`No length in ${durFile} for: ${missing.map((v) => v.id).join(', ')}`);
}
