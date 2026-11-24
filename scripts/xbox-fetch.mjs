#!/usr/bin/env node
/**
 * Downloads Xbox games (hours played + achievements) from OpenXBL (xbl.io) for the Gamer tab.
 *
 * Reference only: Deo no longer has an Xbox (Steam only now), so a normal refresh skips this.
 * It's here for anyone who clones the project and wants Xbox hours too. Steps: content/gaming/README.md.
 *
 * Run it on your own computer, with the OpenXBL key in an environment variable so it never lands in a file:
 *
 *   XBL_KEY=your-openxbl-key node scripts/xbox-fetch.mjs ~/Downloads/xbox-download.json
 *   $env:XBL_KEY="your-openxbl-key"; node scripts/xbox-fetch.mjs $HOME\Downloads\xbox-download.json   (PowerShell)
 *
 * Save the download outside the repo. It uses 2 requests for the game list, then 1 per game for its
 * hours (Xbox's MinutesPlayed stat). It stops at 140 requests (the free plan allows 150 an hour) and
 * saves what it has; run it again after an hour and it picks up where it left off. Then import it with
 * scripts/xbox-games.mjs. Xbox has no hours for Xbox 360 games, and none for PC games it only saw
 * launched (devices "Win32"); those come back as null.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

if (typeof fetch !== 'function') { console.error(`This needs Node 18 or newer (you have ${process.version}).`); process.exit(1); }
const KEY = process.env.XBL_KEY;
if (!KEY) { console.error('Set XBL_KEY first (see the top of this file).'); process.exit(1); }
const OUT = process.argv[2] || 'xbox-download.json';
const BUDGET = 140;
let used = 0;

async function get(path) {
  if (used >= BUDGET) throw Object.assign(new Error('budget'), { budget: true });
  used++;
  const r = await fetch(`https://xbl.io/api/v2/${path}`, { headers: { 'X-Authorization': KEY, Accept: 'application/json', 'Accept-Language': 'en-US' } });
  if (r.status === 429) throw Object.assign(new Error('Rate limit reached'), { budget: true });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText} on ${path}: ${(await r.text()).slice(0, 300)}`);
  const j = await r.json();
  return j && typeof j === 'object' && 'content' in j ? j.content : j; // OpenXBL wraps answers in { content }
}

// Finds a stat by name anywhere in OpenXBL's answer (the stats come back nested).
function findStat(obj, name) {
  if (!obj || typeof obj !== 'object') return undefined;
  if (obj.name === name && 'value' in obj) return obj.value;
  for (const v of Object.values(obj)) { const f = findStat(v, name); if (f !== undefined) return f; }
}

const data = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : null;
const out = data ?? { _about: 'Deo\'s Xbox games from OpenXBL (xbl.io). minutes = MinutesPlayed; null = Xbox has no time for that game.', exported: '', gamertag: '', xuid: '', games: [] };
const save = () => { if (!out.games.length) return; out.exported = new Date().toISOString().slice(0, 10); writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n'); };

try {
  if (!out.games.length) {
    const acct = await get('account');
    const user = acct.profileUsers?.[0];
    if (!user) throw new Error(`Unexpected answer from /account: ${JSON.stringify(acct).slice(0, 400)}`);
    out.xuid = user?.id ?? '';
    out.gamertag = user?.settings?.find(s => s.id === 'Gamertag')?.value ?? '';
    const th = await get('player/titleHistory');
    if (!Array.isArray(th.titles)) throw new Error(`Unexpected answer from /player/titleHistory: ${JSON.stringify(th).slice(0, 400)}`);
    for (const t of th.titles ?? []) {
      out.games.push({
        titleId: t.titleId, name: t.name,
        devices: t.devices ?? [],
        lastPlayed: t.titleHistory?.lastTimePlayed ?? null,
        gamerscore: t.achievement?.currentGamerscore ?? 0,
        totalGamerscore: t.achievement?.totalGamerscore ?? 0,
        achievements: t.achievement?.currentAchievements ?? 0,
        progress: t.achievement?.progressPercentage ?? 0,
        minutes: undefined,
      });
    }
    save();
    console.log(`${out.gamertag}: ${out.games.length} games in your Xbox history.`);
  }
  let shown = false;
  for (const g of out.games) {
    if (g.minutes !== undefined) continue;
    const s = await get(`achievements/stats/${g.titleId}`);
    const m = findStat(s, 'MinutesPlayed');
    g.minutes = m === undefined ? null : Number(m);
    if (!shown) { console.log(`First game checked: ${g.name} = ${g.minutes ?? 'no time from Xbox'} minutes.`); shown = true; }
    save();
  }
  const withTime = out.games.filter(g => g.minutes).length;
  console.log(`Done. ${withTime} of ${out.games.length} games have hours. Now run: node scripts/xbox-games.mjs ${OUT}`);
} catch (e) {
  save();
  if (e.budget) {
    const left = out.games.filter(g => g.minutes === undefined).length;
    console.log(`Stopped to stay under your hourly limit. ${left} games still need their hours: run this again in an hour.`);
  } else { console.error(`Stopped: ${e.message}`); process.exit(1); }
}
