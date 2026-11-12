import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export type BotwEpisode = { rank: number; title: string; url: string; description?: string };

/**
 * Reads content/botw.md: "> intro" lines, then numbered entries:
 *   1. [Episode title](https://www.youtube.com/watch?v=...)
 *   2. https://youtu.be/...            (a bare link works too)
 * Lines under an entry (until the next number) are its description.
 */
export function loadBotw(file = 'content/botw.md'): { intro: string[]; episodes: BotwEpisode[] } {
  const text = readFileSync(resolve(file), 'utf8').replace(/<!--[\s\S]*?-->/g, '');
  const intro: string[] = [];
  const episodes: BotwEpisode[] = [];
  const errors: string[] = [];
  let desc: string[] = [];
  const flush = () => {
    const last = episodes[episodes.length - 1];
    if (last && desc.length) last.description = desc.join(' ');
    desc = [];
  };

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    const entry = line.match(/^(\d+)\.\s+(.+)$/);
    if (entry) {
      flush();
      const rank = Number(entry[1]);
      const md = entry[2].match(/^\[(.+?)\]\((https?:\/\/[^)\s]+)\)\s*$/);
      const bare = entry[2].match(/^(https?:\/\/\S+)$/);
      if (md) episodes.push({ rank, title: md[1].trim(), url: md[2] });
      else if (bare) episodes.push({ rank, title: `Best of the Worst #${rank}`, url: bare[1] });
      else errors.push(`entry ${rank}: expected "[Title](https://...)" or a link, got "${entry[2]}".`);
    } else if (line.startsWith('>')) {
      intro.push(line.replace(/^>\s?/, ''));
    } else if (episodes.length && line && !line.startsWith('#') && !line.startsWith('- ')) {
      desc.push(line);
    }
  }
  flush();

  const seen = new Set<number>();
  for (const e of episodes) {
    if (seen.has(e.rank)) errors.push(`number ${e.rank} is used more than once.`);
    seen.add(e.rank);
  }
  if (errors.length) throw new Error(`${file} has problems:\n- ${errors.join('\n- ')}`);
  return { intro, episodes: episodes.sort((a, b) => a.rank - b.rank) };
}
