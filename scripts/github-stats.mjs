// GitHub stats for the Management tab's ▶ Play (#334): a data pull, like Steam, Xbox and Google Takeout. Run it by hand
// (or ask Claude to): it lists every repo Deo owns (forks left out; content/pm/github-repos.json is the fallback list, and
// its order comes first), reads each one from GitHub's REST API, crunches the numbers and
// writes content/pm/github-stats.json, which is committed. The build only reads that file (no network at build time),
// and the dashboard shows when it was pulled ("As of …"). Repos pushed in the last 12 months are "active"; the rest
// make the History section. All the repos are public; one pull uses about 100 requests.
//
//   npm run github            uses $GITHUB_TOKEN, or your `gh` login when it isn't set
//
// When GitHub fails for one repo, its last numbers are kept (marked stale); when everything fails, the file isn't touched.
//
// What it keeps per repo (public data only): stars, forks, languages, issues and pull requests (open, closed, merged,
// and the median hours to close or merge), commits (all time and per week for 52 weeks, merge commits left out), lines
// added and deleted per week, when commits happen (weekday × hour, Central time), the longest streak of days with commits,
// and how many commits carry a "Co-Authored-By: Claude" line; commits and lines per year and the first commit's date.
// Plus a year of daily commit counts across all the repos.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const OUT = resolve('content/pm/github-stats.json');
const TZ = 'America/Chicago'; // Deo's time, for the weekday × hour chart, the weeks and the days
const API = 'https://api.github.com';
const ghToken = () => {
  try {
    return execFileSync('gh', ['auth', 'token'], { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
};
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || ghToken();

const config = JSON.parse(readFileSync(resolve('content/pm/github-repos.json'), 'utf8'));
const previous = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : null;

if (!token) {
  console.error('github-stats: no token. Set GITHUB_TOKEN, or log in with `gh auth login`.');
  process.exit(1);
}

let calls = 0;
async function get(path, { retry202 = false } = {}) {
  for (let attempt = 0; attempt < 10; attempt++) {
    calls++;
    const res = await fetch(path.startsWith('http') ? path : `${API}${path}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'deovandski-site' },
    });
    // Statistics are worked out in the background the first time: 202 means "ask again in a moment".
    if (res.status === 202 && retry202) {
      await new Promise((r) => setTimeout(r, Math.min(3000 * (attempt + 1), 15000)));
      continue;
    }
    if (res.status === 202 || res.status === 204) return { data: null, next: null };
    if (!res.ok) throw new Error(`${res.status} ${path}`);
    const next = /<([^>]+)>;\s*rel="next"/.exec(res.headers.get('link') ?? '')?.[1] ?? null;
    return { data: await res.json(), next };
  }
  return { data: null, next: null };
}
async function all(path) {
  const out = [];
  let url = path;
  while (url) {
    const { data, next } = await get(url);
    if (Array.isArray(data)) out.push(...data);
    url = next;
  }
  return out;
}

// Dates in Deo's time zone.
const parts = new Intl.DateTimeFormat('en-US', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23', weekday: 'short' });
const WD = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
function local(iso) {
  const p = Object.fromEntries(parts.formatToParts(new Date(iso)).map((x) => [x.type, x.value]));
  return { day: `${p.year}-${p.month}-${p.day}`, hour: Number(p.hour) % 24, weekday: WD[p.weekday] };
}
const dayNum = (day) => Math.round(Date.parse(`${day}T00:00:00Z`) / 86400000);
const dayStr = (n) => new Date(n * 86400000).toISOString().slice(0, 10);
// The year shown: 53 weeks of days, Sunday to Saturday, ending with this week (like GitHub's contribution grid).
const todayLocal = dayNum(local(new Date().toISOString()).day);
const lastSat = todayLocal + (6 - new Date(todayLocal * 86400000).getUTCDay());
const firstDay = lastSat - 53 * 7 + 1;
const median = (xs) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const round1 = (x) => (x == null ? null : Math.round(x * 10) / 10);
function longestStreak(days) {
  const nums = [...new Set(days)].map(dayNum).sort((a, b) => a - b);
  let best = { days: 0, from: null, to: null };
  let start = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > 0 && nums[i] !== nums[i - 1] + 1) start = i;
    const len = nums[i] - nums[start] + 1;
    if (len > best.days) best = { days: len, from: dayStr(nums[start]), to: dayStr(nums[i]) };
  }
  return best;
}

const CLAUDE = /co-authored-by:\s*claude/i;
const allDays = new Map(); // day -> commits across every repo
const closeHours = []; // hours to close each issue, active repos (for the overall median)
const mergeHours = []; // hours to merge each pull request, active repos
const everyDay = []; // every commit day across every repo, for the overall streak

async function repoStats(name) {
  const full = `${config.owner}/${name}`;
  const { data: repo } = await get(`/repos/${full}`);
  const [{ data: langs }, commits, issues, { data: freq }] = await Promise.all([
    get(`/repos/${full}/languages`),
    all(`/repos/${full}/commits?per_page=100`),
    all(`/repos/${full}/issues?state=all&per_page=100`),
    get(`/repos/${full}/stats/code_frequency`, { retry202: true }),
  ]);

  const weeks = Array(52).fill(0);
  const punch = Array.from({ length: 7 }, () => Array(24).fill(0));
  const days = [];
  const years = {}; // year -> { commits, add, del }
  const year = (y) => (years[y] ??= { commits: 0, add: 0, del: 0 });
  let count = 0;
  let claude = 0;
  for (const c of commits) {
    if ((c.parents?.length ?? 1) > 1) continue; // merge commits, as GitHub's own graphs leave them out
    count++;
    if (CLAUDE.test(c.commit?.message ?? '')) claude++;
    const when = local(c.commit?.author?.date ?? c.commit?.committer?.date);
    days.push(when.day);
    everyDay.push(when.day);
    punch[when.weekday][when.hour]++;
    year(when.day.slice(0, 4)).commits++;
    const n = dayNum(when.day);
    if (n >= firstDay && n <= lastSat) allDays.set(when.day, (allDays.get(when.day) ?? 0) + 1);
    const w = Math.floor((lastSat - n) / 7); // 0 = this week
    if (w >= 0 && w < 52) weeks[51 - w]++;
  }

  // Lines added and deleted per week: GitHub's weeks start on Sunday (UTC), the same shape as ours.
  const lines = Array.from({ length: 52 }, () => ({ add: 0, del: 0 }));
  for (const [ts, add, del] of Array.isArray(freq) ? freq : []) {
    const y = year(new Date(ts * 1000).toISOString().slice(0, 4));
    y.add += add;
    y.del += Math.abs(del);
    const w = Math.floor((lastSat - Math.floor(ts / 86400)) / 7);
    if (w >= 0 && w < 52) lines[51 - w] = { add, del: Math.abs(del) };
  }

  const isPr = (i) => !!i.pull_request;
  const onlyIssues = issues.filter((i) => !isPr(i));
  const prs = issues.filter(isPr);
  const hours = (a, b) => (Date.parse(b) - Date.parse(a)) / 3600000;
  const merged = prs.filter((p) => p.pull_request?.merged_at);
  if (Date.now() - Date.parse(repo.pushed_at) < 365 * 86400000) {
    closeHours.push(...onlyIssues.filter((i) => i.closed_at).map((i) => hours(i.created_at, i.closed_at)));
    mergeHours.push(...merged.map((p) => hours(p.created_at, p.pull_request.merged_at)));
  }
  return {
    name,
    url: repo.html_url,
    description: repo.description ?? '',
    homepage: repo.homepage || null,
    archived: !!repo.archived,
    active: Date.now() - Date.parse(repo.pushed_at) < 365 * 86400000,
    created: repo.created_at,
    pushed: repo.pushed_at,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    languages: Object.entries(langs ?? {})
      .sort((a, b) => b[1] - a[1])
      .map(([lang, bytes]) => ({ name: lang, bytes })),
    commits: count,
    claude,
    weeks,
    lines,
    punch,
    streak: longestStreak(days),
    lastCommit: commits[0]?.commit?.author?.date ?? null,
    firstCommit: commits.at(-1)?.commit?.author?.date ?? null,
    years: Object.fromEntries(Object.entries(years).filter(([, v]) => v.commits || v.add || v.del)),
    issues: {
      open: onlyIssues.filter((i) => i.state === 'open').length,
      closed: onlyIssues.filter((i) => i.state === 'closed').length,
      medianCloseHours: round1(median(onlyIssues.filter((i) => i.closed_at).map((i) => hours(i.created_at, i.closed_at)))),
    },
    prs: {
      open: prs.filter((p) => p.state === 'open').length,
      merged: merged.length,
      closed: prs.filter((p) => p.state === 'closed' && !p.pull_request?.merged_at).length,
      medianMergeHours: round1(median(merged.map((p) => hours(p.created_at, p.pull_request.merged_at)))),
    },
  };
}

// Every repo Deo owns (no forks), the listed ones first in their order. Some tokens can't list an account's repos (a
// Claude session, say): then the list in content/pm/github-repos.json is the whole list.
let names = [...config.repos];
try {
  const owned = (await all(`/users/${config.owner}/repos?type=owner&per_page=100`)).filter((r) => !r.fork).map((r) => r.name);
  const known = new Set(names.map((n) => n.toLowerCase()));
  names = [...names.filter((n) => owned.some((o) => o.toLowerCase() === n.toLowerCase())), ...owned.filter((o) => !known.has(o.toLowerCase()))];
} catch (err) {
  console.warn(`github-stats: couldn't list ${config.owner}'s repos (${err.message}); using content/pm/github-repos.json.`);
}

const repos = [];
for (const name of names) {
  try {
    repos.push(await repoStats(name));
  } catch (err) {
    const old = previous?.repos?.find((r) => r.name === name);
    console.warn(`github-stats: ${name} failed (${err.message})${old ? ', keeping the last numbers' : ''}.`);
    if (old) repos.push({ ...old, stale: true });
  }
}
if (!repos.length) {
  console.warn('github-stats: nothing fetched; keeping the last file.');
  process.exit(0);
}

const out = {
  fetched: new Date().toISOString(),
  tz: TZ,
  owner: config.owner,
  calls,
  days: { from: dayStr(firstDay), counts: Array.from({ length: lastSat - firstDay + 1 }, (_, i) => allDays.get(dayStr(firstDay + i)) ?? 0) },
  streak: longestStreak(everyDay),
  medianCloseHours: round1(median(closeHours)),
  medianMergeHours: round1(median(mergeHours)),
  repos,
};
writeFileSync(OUT, `${JSON.stringify(out)}\n`);
console.log(`github-stats: ${repos.length} repos, ${repos.reduce((a, r) => a + r.commits, 0)} commits, ${calls} API calls → ${OUT}`);
