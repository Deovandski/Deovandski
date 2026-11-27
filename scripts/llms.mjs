// Writes the files AI tools and search engines read. Runs after `astro build` (npm "postbuild").
// Same idea as the #HusbandOutWorld site's llms.txt.
//   dist/llms.txt         an index of the home tabs, per https://llmstxt.org/
//   dist/llms-full.txt    the text of every home tab, as visitors see it
//   dist/facets/<id>.md   one tab per file, so each tab has its own URL. Links like /#death all
//                         fetch the same home page, and readers drop its hidden panels.
//   dist/sitemap.xml      every page and every file above, for search engines
//   dist/robots.txt       points search engines to the sitemap (only when the site is at a domain root)
// Anything in the page marked data-llms-skip (like the LED clock's digits) is left out of the text.
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

// Tabs left out of the AI files on purpose.
const SKIP = new Set(['lust']);

const site = (process.env.SITE_URL || 'https://deovandski.com').replace(/\/+$/, '');
const base = (process.env.BASE_PATH || '/').replace(/\/+$/, '');
const root = `${site}${base}`;

const html = readFileSync('dist/index.html', 'utf8');

const decode = (s) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));

const INLINE = /<\/?(em|strong|b|i|abbr|span|code|small|sup|sub|mark|time)\b[^>]*>/gi;

/** One list item -> one line: "Name — note — description". */
const flat = (inner) =>
  inner
    .replace(/⟧\s*⟦/g, ', ') // nested items: "Japan — Tokyo, Ōsaka"
    .replace(/[⟦⟧]/g, '')
    .replace(/<\/(h[1-6]|p|div|figcaption)>/gi, ' — ')
    .replace(INLINE, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/(\s*—\s*)+/g, ' — ')
    .replace(/^\s*—\s*|\s*—\s*$/g, '')
    .trim();

/** Innermost <li> first, so nested lists fold into their parent's line. */
function lists(html) {
  const innermost = /<li\b[^>]*>((?:(?!<li\b)[\s\S])*?)<\/li>/i;
  while (innermost.test(html)) html = html.replace(innermost, (_, inner) => `⟦${flat(inner)}⟧`);
  return html.replace(/⟦([^⟧]*)⟧/g, '\n- $1\n');
}

/** Removes every element whose opening tag has data-llms-skip, nested tags included. */
function skipMarked(html) {
  const open = /<([a-z][a-z0-9-]*)\b[^>]*\sdata-llms-skip\b[^>]*>/i;
  let m;
  while ((m = open.exec(html))) {
    const tag = m[1].toLowerCase();
    const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'gi');
    re.lastIndex = m.index + m[0].length;
    let depth = 1;
    let t;
    while (depth > 0 && (t = re.exec(html))) depth += t[1] ? -1 : 1;
    html = html.slice(0, m.index) + html.slice(t ? t.index + t[0].length : html.length);
  }
  return html;
}

/** HTML fragment -> readable plain text: headings and paragraphs on their own lines, one line per list item. */
function toText(fragment) {
  return decode(
    lists(skipMarked(fragment)
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<(script|style|svg|noscript|template|dialog)\b[\s\S]*?<\/\1>/gi, '')
      .replace(/<(span|p|div)\b[^>]*aria-hidden="true"[^>]*>[\s\S]*?<\/\1>/gi, '') // decorative: ranks, initials, glyph copies
      .replace(/<span class="sr-only"[^>]*>[\s\S]*?<\/span>/gi, '')
      .replace(/<span class="(?:tag|newest)"[^>]*>([\s\S]*?)<\/span>/gi, ' [$1]')
      .replace(/\s+/g, ' ')
      .replace(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, label) => {
        const text = label.replace(/<[^>]+>/g, '').trim();
        return /^(https?:|mailto:)/.test(href) && text ? `[${text}](${href})` : text;
      })
      )
      .replace(/<h[1-6]\b[^>]*>/gi, '\n\n### ')
      .replace(/<\/(p|div|h[1-6]|ul|ol|section|figure|figcaption|summary|details|blockquote|dl|dt|dd)>/gi, '\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(INLINE, '')
      .replace(/<[^>]+>/g, ' '),
  )
    .split('\n')
    .map((l) => l.replace(/[ \t]+/g, ' ').trim())
    .filter((l) => l !== '-')
    .join('\n')
    .replace(/\n{2,}(?=- )/g, (m, off, str) => (str[off - 1] === '\n' || /\n- [^\n]*$/.test(str.slice(0, off)) ? '\n' : m))
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Facet labels, in the order visitors see them in the facet tree (branch by branch).
const tabs = [...html.matchAll(/<button[^>]*data-tab="([^"]+)"[^>]*>([\s\S]*?)<\/button>/g)].map((m) => ({
  id: m[1],
  label: decode(m[2].replace(/<span class="tree__disc"[\s\S]*?<\/span>/, '').replace(/<[^>]+>/g, '')).trim(),
}));

// Panel bodies: from each panel's opening tag to the next panel (or the end of the tab container).
const starts = [...html.matchAll(/<section[^>]*id="panel-([^"]+)"[^>]*>/g)].map((m) => ({ id: m[1], at: m.index + m[0].length }));
const end = html.indexOf('<dialog');
const panels = new Map(
  starts.map((s, i) => [s.id, html.slice(s.at, i + 1 < starts.length ? starts[i + 1].at : end > 0 ? end : html.length)]),
);

const kept = tabs.filter((t) => !SKIP.has(t.id) && panels.has(t.id));
// Index blurb: the tab's first sentence-like line; tabs without one list their section headings.
const firstLine = (t) => {
  const lines = toText(panels.get(t.id)).split('\n');
  const text = lines.find((l) => l && !l.startsWith('#') && !l.startsWith('-') && !l.startsWith('['));
  if (text) return text;
  const heads = lines.filter((l) => l.startsWith('### ')).map((l) => l.slice(4));
  return heads.length ? `${heads.slice(0, 6).join(', ')}${heads.length > 6 ? ', …' : ''}` : '';
};
const short = (s) => (s.length > 160 ? `${s.slice(0, 157).replace(/\s+\S*$/, '')}…` : s);

const intro = [
  "# Deovandski's Blog",
  '',
  '> Personal hub of Deovandski (Deovandski Skibinski Junior): founder & CEO of Wizard Deo Solutions, technical architect',
  '> (Dynamics 365 F&O, integrations, cloud, AI, full stack), and author of the #HusbandOutWorld light novel series.',
  '> The home page is split into tabs ("facets"), one per side of his life.',
  '',
  `Contact: Deovandski@outlook.com (personal and #HusbandOutWorld), Deovandski@wizarddeosolutions.com (Wizard Deo Solutions), LinkedIn https://www.linkedin.com/in/deovandski/.`,
  `Source: https://github.com/Deovandski/Deovandski. Built with AI assistance (Claude) under Deovandski's direction.`,
  '',
];

const index = [
  ...intro,
  '## Full text',
  '',
  `- [Everything on the home page](${root}/llms-full.txt): every tab below as plain text`,
  '',
  '## Facets (home page tabs)',
  '',
  'Each link is that tab as its own Markdown file. On the site, the same tab opens at /#<id>.',
  '',
  ...kept.map((t) => `- [${t.label}](${root}/facets/${t.id}.md): ${short(firstLine(t))}`),
  '',
  '## Related',
  '',
  '- [#HusbandOutWorld](https://www.husbandoutworld.com/llms.txt): the light novel series, with its own llms.txt',
  '- [Wizard Deo Solutions](https://www.wizarddeosolutions.com/): his company',
  '',
];
writeFileSync('dist/llms.txt', index.join('\n'));

const texts = new Map(kept.map((t) => [t.id, toText(panels.get(t.id))]));

const full = [...intro, ...kept.flatMap((t) => [`## ${t.label}`, '', `URL: ${root}/#${t.id}`, '', texts.get(t.id), ''])];
writeFileSync('dist/llms-full.txt', full.join('\n'));

// One Markdown file per tab.
mkdirSync('dist/facets', { recursive: true });
for (const t of kept) {
  const md = [
    `# ${t.label}: Deovandski's Blog`,
    '',
    `> One facet (home page tab) of Deovandski's personal hub. On the site: ${root}/#${t.id}`,
    `> Every facet: ${root}/llms.txt`,
    '',
    texts.get(t.id),
    '',
  ];
  writeFileSync(`dist/facets/${t.id}.md`, md.join('\n'));
}

// sitemap.xml: every built page, plus the AI files. Also submit it in Search Console and Bing Webmaster.
const pages = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    // Hidden pages (Base's noindex, like /qr/) stay out of the sitemap.
    else if (name === 'index.html' && !/<meta name="robots" content="noindex/.test(readFileSync(p, 'utf8')))
      pages.push(relative('dist', dir).split(sep).join('/'));
  }
})('dist');
const urls = [
  ...pages.sort().map((p) => `${root}/${p ? `${p}/` : ''}`),
  `${root}/llms.txt`,
  `${root}/llms-full.txt`,
  ...kept.map((t) => `${root}/facets/${t.id}.md`),
];
const xmlEscape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
writeFileSync(
  'dist/sitemap.xml',
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((u) => `  <url><loc>${xmlEscape(u)}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n'),
);

// robots.txt lives at the domain root, so it's only written when the site is there (deovandski.com).
// On deovandski.github.io/Deovandski/ it would sit at the wrong address and do nothing.
if (base === '') writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${root}/sitemap.xml\n`);

console.log(
  `llms.txt: ${kept.length} tabs (${tabs.length - kept.length} skipped); llms-full.txt: ${full.join('\n').length} chars; ` +
    `facets/: ${kept.length} files; sitemap.xml: ${urls.length} URLs`,
);
