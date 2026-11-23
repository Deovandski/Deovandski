// Translations of the website, written ahead of time and kept in content/i18n/<lang>/ (#87).
// Ported from Deovandski-repo-template's tools/i18n.ts, itself a port of HusbandOutWorld's tools/i18n.py, so all
// the sites store translations the same way. English is the source: `astro build` writes it into dist/, and
// `node scripts/i18n.mjs build` (run by npm's postbuild) adds a translated copy of every page at dist/<lang>/<path>/.
//
// How it works
// - Each built page is split into segments: every element that holds text directly (a paragraph, heading, list
//   item, button, label, option, caption, ...) plus a few attributes (alt, title, aria-label, placeholder) and the
//   page description. Each segment is keyed by a short hash of its English HTML.
// - A segment's translation is looked up by that hash. A segment with no translation stays in English, marked
//   lang="en", so a half-translated language still works.
// - English that doesn't change keeps its hash, so it is never translated twice. Only new or edited segments
//   show up in `todo`.
// - Anything with translate="no" (or inside it) is left alone: Vraki-typeface text, names in a logo, code.
//   <textarea>, <pre>, <code>, <script>, <style> and <svg> are never translated.
// - Text a script writes at run time (game messages and the like) is translated only if it's in the built page: the
//   reusable games keep theirs in a hidden `.<name>__strings` block of `<span data-k>` elements and read it from there.
//
// Store layout (content/i18n/)
//   config.json              the language order, the 90% rule and the "Want a language added?" link
//   <lang>/meta.json         the language's name, <html lang>, direction and the banner
//   <lang>/glossary.json     how names and recurring terms are written in this language (read by whoever translates)
//   <lang>/_shared.json      segments in the header, footer and Settings dialog, and any on 5+ pages
//   <lang>/pages/<page>.json everything else, one file per page: {"<hash>": {"en": "<English HTML>", "t": "<translation>"}}
//
// Command line (run `npm run build` first)
//   node scripts/i18n.mjs build                       adds dist/<lang>/ for every language (npm run build does it)
//   node scripts/i18n.mjs status                      what's translated, per language
//   node scripts/i18n.mjs todo --lang ja [--page contact/] [--shared] [--max-words 6000] > work.json
//                                                     only the segments that still need translating
//   node scripts/i18n.mjs apply work.json             save the "t" fields of a work file into the store
//   node scripts/i18n.mjs prune                       drop translations whose English no longer exists
//   node scripts/i18n.mjs rehash                      re-key stored translations from their "en" (after a find/replace
//                                                     that touched the English, like changing a link everywhere)
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHTML } from 'linkedom';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DIST = path.join(ROOT, 'dist');
const STORE = path.join(ROOT, 'content', 'i18n');
const CONFIG = JSON.parse(fs.readFileSync(path.join(STORE, 'config.json'), 'utf8'));
// The deploy passes the real address (configure-pages): "" base for deovandski.com, "/Deovandski" on github.io.
const BASE = (process.env.BASE_PATH || '').replace(/\/+$/, '');
const SITE_URL = (process.env.SITE_URL || 'https://deovandski.com').replace(/\/+$/, '') + BASE;
export const INDEX_COVERAGE = CONFIG.index_coverage ?? 0.9;

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'SVG', 'NOSCRIPT', 'TEMPLATE', 'CODE', 'PRE', 'TEXTAREA']);
const ATTRS = ['alt', 'title', 'aria-label', 'placeholder'];
const SHARED_SELECTOR = '.site-header, .site-footer, #site-settings, .skip, .i18n-shared';
const SHARED_MIN_PAGES = 5;
const LETTER = /\p{L}/u;

// ---------------------------------------------------------------- store

/** Whitespace and quote style don't change a segment's meaning, so they don't change its hash. */
export function norm(s) {
  return s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();
}
export const segHash = (en) => createHash('sha1').update(norm(en), 'utf8').digest('hex').slice(0, 12);

const readJson = (p, fallback) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : fallback);
function writeJson(p, data) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 1) + '\n');
}
const sortKeys = (o) => Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b)));

/** Language codes with a folder in content/i18n/, in the order of config.json. */
export function languages() {
  if (!fs.existsSync(STORE)) return [];
  const have = fs.readdirSync(STORE).filter((d) => fs.statSync(path.join(STORE, d)).isDirectory());
  const order = CONFIG.languages || [];
  return [...order.filter((c) => have.includes(c)), ...have.filter((c) => !order.includes(c)).sort()];
}
const loadMeta = (code) => readJson(path.join(STORE, code, 'meta.json'), {});

function shardFiles(code) {
  const base = path.join(STORE, code);
  const out = [path.join(base, '_shared.json')];
  const pages = path.join(base, 'pages');
  if (fs.existsSync(pages)) for (const f of fs.readdirSync(pages, { recursive: true })) if (f.endsWith('.json')) out.push(path.join(pages, f));
  return out.filter((p) => fs.existsSync(p));
}

/** hash -> translated HTML, from every shard of one language. */
function loadStore(code) {
  const out = new Map();
  for (const p of shardFiles(code)) for (const [h, v] of Object.entries(readJson(p, {}))) if (v?.t) out.set(h, v.t);
  return out;
}

/** "contact/index.html" -> "pages/contact.json"; "index.html" -> "pages/home.json". */
function pageShard(page) {
  const slug = page.replace(/(^|\/)index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '') || 'home';
  return path.join('pages', slug + '.json');
}

// ---------------------------------------------------------------- segments

const skipped = (el) => SKIP_TAGS.has(el.tagName) || el.getAttribute('translate') === 'no';

/** Text right inside the element (not only in its children). Separators like " · " don't count. */
function hasDirectText(el) {
  for (const n of el.childNodes) if (n.nodeType === 3 && LETTER.test(n.textContent ?? '')) return true;
  return false;
}

/** Every translatable piece of a page. */
function* segments(document) {
  for (const m of document.querySelectorAll('head meta')) {
    const c = m.getAttribute('content');
    if (c && (m.getAttribute('name') === 'description' || ['og:title', 'og:description'].includes(m.getAttribute('property') ?? ''))) {
      yield { el: m, attr: 'content', en: c };
    }
  }
  const title = document.querySelector('head title');
  if (title && LETTER.test(title.textContent)) yield { el: title, attr: null, en: title.innerHTML };
  function* walk(el) {
    if (skipped(el)) return;
    for (const a of ATTRS) {
      const v = el.getAttribute(a);
      if (v && LETTER.test(v)) yield { el, attr: a, en: v };
    }
    if (!['HTML', 'HEAD', 'BODY'].includes(el.tagName) && hasDirectText(el)) {
      yield { el, attr: null, en: el.innerHTML };
      return; // attributes of descendants (an alt inside a paragraph) are part of that paragraph's HTML
    }
    for (const c of el.children) yield* walk(c);
  }
  const body = document.querySelector('body');
  if (body) yield* walk(body);
}

const textWords = (s) => s.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
const isShared = (el) => !!el.closest?.(SHARED_SELECTOR);

/** Pages Astro built: every index.html under dist/, except the language copies this script writes. */
function builtPages() {
  if (!fs.existsSync(DIST)) die('No dist/ yet: run `npm run build` first.');
  const langs = languages();
  return fs
    .readdirSync(DIST, { recursive: true })
    .map((f) => f.split(path.sep).join('/'))
    .filter((f) => f.endsWith('index.html') && !langs.includes(f.split('/')[0]))
    .sort();
}
const readPage = (page) => fs.readFileSync(path.join(DIST, page), 'utf8');

/** hash -> {en, words, pages[], shared} for every segment of every built page. */
function inventory() {
  const segs = new Map();
  for (const page of builtPages()) {
    const { document } = parseHTML(readPage(page));
    for (const { el, en } of segments(document)) {
      const h = segHash(en);
      const s = segs.get(h) ?? { en, words: textWords(en), pages: [], shared: false };
      if (!s.pages.includes(page)) s.pages.push(page);
      s.shared ||= isShared(el);
      segs.set(h, s);
    }
  }
  for (const s of segs.values()) if (s.pages.length >= SHARED_MIN_PAGES) s.shared = true;
  return segs;
}

// ---------------------------------------------------------------- pages

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** "contact/index.html" -> "/contact/" (the path after the base). */
const pagePath = (page) => '/' + page.replace(/index\.html$/, '');
const pageUrl = (page, code) => `${SITE_URL}${code && code !== 'en' ? '/' + code : ''}${pagePath(page)}`;

/** A link to another page stays inside the language; links to files (CSS, images, /_astro/...) don't change. */
function langLink(href, code) {
  if (!href.startsWith(BASE + '/') || href.startsWith('//')) return href;
  const rest = href.slice(BASE.length); // "/contact/#top"
  const bare = rest.split(/[?#]/)[0];
  const first = bare.split('/')[1] ?? '';
  const file = /\.[a-z0-9]+$/i.test(bare) && !bare.endsWith('.html');
  if (file || first.startsWith('_') || languages().includes(first)) return href;
  return `${BASE}/${code}${rest}`;
}

/** English page -> translated document and how much of it is translated. */
function translatePage(src, page, lang) {
  const { code, meta, store } = lang;
  const { document } = parseHTML(src);
  let total = 0;
  let done = 0;
  for (const { el, attr, en } of [...segments(document)]) {
    const w = textWords(en) || 1;
    total += w;
    const t = store.get(segHash(en));
    if (!t) {
      if (!attr && el.tagName !== 'TITLE') {
        el.setAttribute('lang', 'en'); // still English: say so (screen readers, and left to right inside Arabic)
        if (meta.dir === 'rtl') el.setAttribute('dir', 'ltr');
      }
      continue;
    }
    done += w;
    if (attr) el.setAttribute(attr, t);
    else el.innerHTML = t;
  }
  // Links into the site move into the language, except links that pick a language themselves (hreflang).
  for (const el of document.querySelectorAll('[href], [action]')) {
    if (el.hasAttribute('hreflang') || el.getAttribute('rel') === 'canonical') continue;
    for (const a of ['href', 'action']) {
      const v = el.getAttribute(a);
      if (v) el.setAttribute(a, langLink(v, code));
    }
  }
  const root = document.documentElement;
  root.setAttribute('lang', meta.html_lang || code);
  root.setAttribute('dir', meta.dir || 'ltr');
  root.setAttribute('data-lang', code);
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', pageUrl(page, code));
  const top = document.querySelector('.site-header');
  if (top && meta.banner) {
    top.insertAdjacentHTML(
      'afterend',
      `<div class="i18n-banner" role="note"><span>${meta.banner}</span> <a href="${BASE}${pagePath(page)}" class="i18n-en" data-lang-switch="en" hreflang="en" lang="en" translate="no">${esc(meta.english || 'English')}</a></div>`,
    );
  }
  return { document, coverage: total ? done / total : 1 };
}

/** Tell search engines and the auto-select script which language versions are ready. */
function headExtras(document, page, cov, thisCode) {
  const ready = Object.keys(cov).filter((c) => cov[c] >= INDEX_COVERAGE);
  const head = document.querySelector('head');
  if (!head) return;
  if (ready.length) {
    for (const c of ['en', ...ready]) head.insertAdjacentHTML('beforeend', `<link rel="alternate" hreflang="${c}" href="${pageUrl(page, c)}">`);
    head.insertAdjacentHTML('beforeend', `<link rel="alternate" hreflang="x-default" href="${pageUrl(page)}">`);
  }
  if (thisCode && (cov[thisCode] ?? 0) < INDEX_COVERAGE && !head.querySelector('meta[name="robots"]')) {
    head.insertAdjacentHTML('beforeend', '<meta name="robots" content="noindex">');
  }
  document.documentElement.setAttribute('data-langs', ready.join(' '));
}

const noindexed = (html) => /<meta name="robots" content="noindex"/.test(html);

function cmdBuild() {
  const langs = languages().map((code) => ({ code, meta: loadMeta(code), store: loadStore(code) }));
  for (const { code } of langs) fs.rmSync(path.join(DIST, code), { recursive: true, force: true });
  const totals = {};
  const pages = builtPages();
  const sitemapAdds = [];
  for (const page of pages) {
    const src = readPage(page);
    const cov = {};
    const outs = {};
    for (const lang of langs) {
      const r = translatePage(src, page, lang);
      outs[lang.code] = r.document;
      cov[lang.code] = r.coverage;
      const t = (totals[lang.code] ??= [0, 0]);
      t[0] += r.coverage;
      t[1] += 1;
    }
    const { document: en } = parseHTML(src);
    headExtras(en, page, cov);
    fs.writeFileSync(path.join(DIST, page), en.toString());
    for (const { code } of langs) {
      headExtras(outs[code], page, cov, code);
      const dest = path.join(DIST, code, page);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, outs[code].toString());
      if (cov[code] >= INDEX_COVERAGE && !noindexed(src)) sitemapAdds.push(pageUrl(page, code));
    }
  }
  // Language versions that are ready go in the sitemap too (scripts/llms.mjs wrote the English one).
  const sitemap = path.join(DIST, 'sitemap.xml');
  if (sitemapAdds.length && fs.existsSync(sitemap)) {
    const xml = fs.readFileSync(sitemap, 'utf8').replace('</urlset>', sitemapAdds.map((u) => `  <url><loc>${esc(u)}</loc></url>\n`).join('') + '</urlset>');
    fs.writeFileSync(sitemap, xml);
  }
  console.log(`i18n: ${pages.length} pages × ${langs.length} languages written to dist/<lang>/`);
  if (langs.length) console.log('i18n: ' + langs.map(({ code }) => `${code} ${Math.round((100 * totals[code][0]) / totals[code][1])}%`).join(' · '));
}

// ---------------------------------------------------------------- command line

function cmdStatus(args) {
  const segs = inventory();
  const words = [...segs.values()].reduce((n, s) => n + s.words, 0);
  const lines = [`English: ${builtPages().length} pages, ${segs.size} segments, ${words.toLocaleString('en')} words`];
  for (const code of languages()) {
    const st = loadStore(code);
    let dw = 0;
    let waiting = 0;
    for (const [h, s] of segs) if (st.has(h)) dw += s.words; else waiting++;
    lines.push(`${code} (${loadMeta(code).name ?? code}): ${Math.round((100 * dw) / Math.max(1, words))}% · ${waiting} segments waiting`);
  }
  console.log(args.markdown ? ['### Translations', '', ...lines.map((l) => `- ${l}`), '', 'Untranslated text shows in English until the next batch (this never blocks a deploy).'].join('\n') : lines.join('\n'));
}

function cmdTodo(args) {
  const lang = args.lang;
  if (typeof lang !== 'string') die('todo needs --lang <code>');
  const segs = inventory();
  const st = loadStore(lang);
  let budget = Number(args['max-words']) || Infinity;
  const pagePrefix = typeof args.page === 'string' ? args.page : '';
  const items = [];
  for (const [h, s] of segs) {
    if (st.has(h) || (pagePrefix && !s.pages.some((p) => p.startsWith(pagePrefix))) || (args.shared && !s.shared)) continue;
    if (items.length && s.words > budget) break;
    budget -= s.words;
    items.push({ h, page: s.pages[0], en: s.en, t: '' });
  }
  const work = {
    lang,
    glossary: `content/i18n/${lang}/glossary.json`,
    rules:
      'Translate "en" into "t". Keep every HTML tag and attribute exactly (only translate visible text and alt/title/aria-label text). ' +
      'Write names as glossary.json says. Leave "t" empty to skip.',
    items,
  };
  process.stdout.write(JSON.stringify(work, null, 1) + '\n');
  console.error(`${items.length} segments, ${items.reduce((n, i) => n + textWords(i.en), 0)} words`);
}

const tagShape = (s) => (s.match(/<\/?[a-z0-9]+/gi) ?? []).map((t) => t.toLowerCase()).sort().join(' ');

function cmdApply(args) {
  const file = args._[0];
  if (!file) die('apply needs a work file');
  const segs = inventory();
  const work = readJson(path.resolve(file), { lang: '', items: [] });
  if (!work.lang) die(`${file} has no "lang"`);
  const base = path.join(STORE, work.lang);
  const shards = new Map();
  let saved = 0;
  let warned = 0;
  for (const it of work.items) {
    const t = (it.t || '').trim();
    if (!t) continue;
    if (tagShape(t) !== tagShape(it.en)) {
      console.error(`warning: ${it.h} (${it.page}): the HTML tags differ from the English; check it`);
      warned++;
    }
    const s = segs.get(it.h) ?? { pages: [it.page], shared: false };
    const p = path.join(base, s.shared ? '_shared.json' : pageShard(s.pages[0]));
    if (!shards.has(p)) shards.set(p, readJson(p, {}));
    shards.get(p)[it.h] = { en: it.en, t };
    saved++;
  }
  for (const [p, data] of shards) writeJson(p, sortKeys(data));
  console.log(`${work.lang}: saved ${saved} translations into ${shards.size} files` + (warned ? `, ${warned} to check` : ''));
}

function cmdPrune() {
  const segs = inventory();
  for (const code of languages()) {
    let dropped = 0;
    for (const p of shardFiles(code)) {
      const data = readJson(p, {});
      const keep = Object.fromEntries(Object.entries(data).filter(([h]) => segs.has(h)));
      dropped += Object.keys(data).length - Object.keys(keep).length;
      if (Object.keys(keep).length !== Object.keys(data).length) {
        if (Object.keys(keep).length) writeJson(p, keep);
        else fs.rmSync(p);
      }
    }
    console.log(`${code}: dropped ${dropped} translations of English that no longer exists`);
  }
}

/** A find/replace that also changed the stored "en" text leaves old hashes behind: key every entry by its "en" again. */
function cmdRehash() {
  for (const code of languages()) {
    let moved = 0;
    for (const p of shardFiles(code)) {
      const out = {};
      for (const [h, v] of Object.entries(readJson(p, {}))) {
        const k = v?.en ? segHash(v.en) : h;
        if (k !== h) moved++;
        out[k] = v;
      }
      writeJson(p, sortKeys(out));
    }
    console.log(`${code}: re-keyed ${moved} translations`);
  }
}

function die(msg) {
  console.error(msg);
  process.exit(2);
}

function parseArgs(argv) {
  const a = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) a[argv[i].slice(2)] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
    else a._.push(argv[i]);
  }
  return a;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [cmd, ...rest] = process.argv.slice(2);
  const cmds = { build: cmdBuild, status: cmdStatus, todo: cmdTodo, apply: cmdApply, prune: cmdPrune, rehash: cmdRehash };
  const run = cmd ? cmds[cmd] : undefined;
  if (!run) die('usage: node scripts/i18n.mjs build|status|todo|apply|prune|rehash (see the top of scripts/i18n.mjs)');
  run(parseArgs(rest));
}
