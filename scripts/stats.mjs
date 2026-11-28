// Writes dist/stats.json: facts about this build that the /debug/ page ("Stats for nerds", #306) reads, so the browser
// never has to work them out. It runs last in `npm run build` (npm's postbuild, after scripts/i18n.mjs build).
//   code       which commit and pull request this build came from, when, and with which tools
//   site       pages, languages, tabs, reusable components, files and size of what gets deployed
//   data       when the Steam, Xbox and Google Takeout numbers were last refreshed
//   i18n       how much of each language is translated (the same counting as `node scripts/i18n.mjs status`)
// Commit, branch, pull request and repository are left out when the repo is private (GitHub Actions says so in its
// event file); a local build reads them from git.
// Adapted from Deovandski-repo-template's tools/stats.ts (template#19); the data and tab counts are this site's own.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { languageStats } from './i18n.mjs';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(ROOT, 'dist');
const env = process.env;
const readJson = (p) => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8')); } catch { return null; } };
const git = (...args) => {
  try { return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() || null; } catch { return null; }
};
const version = (pkg) => readJson(`node_modules/${pkg}/package.json`)?.version ?? null;

if (!fs.existsSync(OUT)) { console.error('No dist/ yet: run `npm run build`.'); process.exit(2); }

// ---------------------------------------------------------------- code
const ci = env.GITHUB_ACTIONS === 'true';
let event = null;
try { event = env.GITHUB_EVENT_PATH ? JSON.parse(fs.readFileSync(env.GITHUB_EVENT_PATH, 'utf8')) : null; } catch { /* no event file */ }
const isPrivate = ci ? event?.repository?.private !== false : false; // unknown in CI counts as private
const commit = env.GITHUB_SHA || git('rev-parse', 'HEAD');
const message = event?.head_commit?.message ?? git('log', '-1', '--format=%B');
const subject = message?.split('\n')[0] ?? null;
// "Merge pull request #18 from …" (merge) or "Title (#18)" (squash).
const pr = Number(subject?.match(/Merge pull request #(\d+)/)?.[1] ?? subject?.match(/\(#(\d+)\)\s*$/)?.[1]) || null;
const remote = git('config', '--get', 'remote.origin.url');
const repo = env.GITHUB_REPOSITORY || remote?.match(/github\.com[/:]([^/]+\/[^/.]+?)(\.git)?$/)?.[1] || null;
const server = env.GITHUB_SERVER_URL || 'https://github.com';
const repoUrl = repo ? `${server}/${repo}` : null;

const code = {
  builtAt: new Date().toISOString(),
  builtBy: ci ? 'GitHub Actions' : 'local build',
  public: ci ? !isPrivate : null,
  run: ci ? Number(env.GITHUB_RUN_NUMBER) || null : null,
  runUrl: ci && !isPrivate && repoUrl && env.GITHUB_RUN_ID ? `${repoUrl}/actions/runs/${env.GITHUB_RUN_ID}` : null,
  ...(isPrivate ? {} : {
    repo, repoUrl,
    branch: env.GITHUB_REF_NAME || git('rev-parse', '--abbrev-ref', 'HEAD'),
    commit,
    commitUrl: repoUrl && commit ? `${repoUrl}/commit/${commit}` : null,
    commitDate: event?.head_commit?.timestamp ?? git('log', '-1', '--format=%cI'),
    commitSubject: subject,
    pr,
    prUrl: repoUrl && pr ? `${repoUrl}/pull/${pr}` : null,
  }),
  tools: { node: process.version, astro: version('astro'), typescript: version('typescript'), linkedom: version('linkedom') },
};

// ---------------------------------------------------------------- site
const i18n = languageStats();
let files = 0;
let bytes = 0;
const byType = {};
for (const f of fs.readdirSync(OUT, { recursive: true })) {
  const st = fs.statSync(path.join(OUT, f));
  if (!st.isFile()) continue;
  files++;
  bytes += st.size;
  const ext = path.extname(f).slice(1).toLowerCase() || '(none)';
  const t = (byType[ext] ??= { files: 0, bytes: 0 });
  t.files++;
  t.bytes += st.size;
}
// The facet tree on the home page: branches, tabs and sub-tabs (#296), counted from the built page.
const home = fs.readFileSync(path.join(OUT, 'index.html'), 'utf8');
const count = (re) => (home.match(re) ?? []).length;
const swVersion = fs.readFileSync(path.join(ROOT, 'public', 'sw.js'), 'utf8').match(/const VERSION = '([^']+)'/)?.[1] ?? null;
const site = {
  url: (env.SITE_URL || 'https://deovandski.com').replace(/\/+$/, '') + (env.BASE_PATH || '').replace(/\/+$/, ''),
  pages: i18n.english.pages,
  languages: i18n.languages.length + 1,
  branches: count(/data-branch="/g),
  tabs: count(/data-tab="/g),
  subTabs: count(/data-sub="/g),
  reusable: fs.readdirSync(path.join(ROOT, 'src', 'components', 'reusable')).filter((f) => f.endsWith('.astro')).length,
  files, bytes,
  byType: Object.fromEntries(Object.entries(byType).sort(([, a], [, b]) => b.bytes - a.bytes)),
  serviceWorker: swVersion,
};

// ---------------------------------------------------------------- data refreshes (the "exported" day each file keeps)
const data = {
  steam: readJson('content/gaming/steam-games.json')?.exported ?? null,
  xbox: readJson('content/gaming/xbox-games.json')?.exported ?? null,
  takeout: readJson('content/biomarkers/daily.json')?.exported ?? readJson('content/cycling/rides.json')?.exported ?? null,
  github: readJson('content/pm/github-stats.json')?.fetched?.slice(0, 10) ?? null,
};

fs.writeFileSync(path.join(OUT, 'stats.json'), JSON.stringify({ code, site, data, i18n }, null, 1) + '\n');
console.log(`stats.json: ${code.builtBy}${code.commit ? ` @ ${code.commit.slice(0, 7)}` : ''}${pr ? ` (PR #${pr})` : ''} · ${files} files, ${(bytes / 1048576).toFixed(1)} MB`);
