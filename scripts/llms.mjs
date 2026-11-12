// Writes dist/llms.txt (an index for AI tools, per https://llmstxt.org/) and dist/llms-full.txt
// (the text of every home tab as visitors see it). Runs after `astro build` (npm "postbuild").
// Same idea as the #HusbandOutWorld site's llms.txt.
import { readFileSync, writeFileSync } from 'node:fs';

// Tabs left out of the AI files on purpose.
const SKIP = new Set(['sex']);

const site = (process.env.SITE_URL || 'https://deovandski.github.io').replace(/\/+$/, '');
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

/** HTML fragment -> readable plain text: headings and paragraphs on their own lines, one line per list item. */
function toText(fragment) {
  return decode(
    lists(fragment
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

// Tab labels, in the order visitors see them.
const tabs = [...html.matchAll(/<button[^>]*role="tab"[^>]*data-tab="([^"]+)"[^>]*>([\s\S]*?)<\/button>/g)].map((m) => ({
  id: m[1],
  label: decode(m[2].replace(/<span class="tabs__icon"[\s\S]*?<\/span>/, '').replace(/<[^>]+>/g, '')).trim(),
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
  ...kept.map((t) => `- [${t.label}](${root}/#${t.id}): ${short(firstLine(t))}`),
  '',
  '## Related',
  '',
  '- [#HusbandOutWorld](https://www.husbandoutworld.com/llms.txt): the light novel series, with its own llms.txt',
  '- [Wizard Deo Solutions](https://www.wizarddeosolutions.com/): his company',
  '',
];
writeFileSync('dist/llms.txt', index.join('\n'));

const full = [...intro, ...kept.flatMap((t) => [`## ${t.label}`, '', `URL: ${root}/#${t.id}`, '', toText(panels.get(t.id)), ''])];
writeFileSync('dist/llms-full.txt', full.join('\n'));

console.log(`llms.txt: ${kept.length} tabs (${tabs.length - kept.length} skipped); llms-full.txt: ${full.join('\n').length} chars`);
