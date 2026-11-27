// Every interactive gimmick on the site, in one list. The home page reads it for each tab's ▶ Play button
// (src/components/GimmickPlay.astro), and the Playground page (/playground/) lists them all as FastTabs.
// To add one: a row here, its component in src/components/Gimmick.astro, and <GimmickPlay tab="…" /> in its panel.
//
// id       the gimmick's anchor and save-free name (/playground/#paper-plane).
// title    the FastTab header.
// tab      the home page tab it plays on (`#<tab>-play` opens it straight away).
// tabName  how the tab is called in text ("From the Aviation tab").
// inline   true for gimmicks that open on phones exactly as on desktop, in the FastTab under the title
//          (no full screen, no turning sideways). Leave it out and phones turn the gimmick sideways on Play.
// n        its permanent number in the Playground's share code (?open=…, #316): which FastTabs are open. Never
//          change or reuse one, or old links open the wrong games; a new gimmick takes the next free number.
export type GimmickInfo = { id: string; title: string; tab: string; tabName: string; inline?: boolean; n: number };

export const GIMMICKS: GimmickInfo[] = [
  { id: 'around-the-world', title: 'Around the World in 80 Gears', tab: 'cycling', tabName: 'Cycling', inline: true, n: 1 },
  { id: 'balls-farm', title: 'Balls farm', tab: 'mentor', tabName: 'Mentor', n: 2 },
  { id: 'dice-tray', title: 'Dice tray', tab: 'dnd', tabName: 'D&D', inline: true, n: 3 },
  { id: 'dino-ambush', title: 'Dino Ambush', tab: 'gamer', tabName: 'Gamer', n: 4 },
  { id: 'drum-kit', title: 'Drum kit', tab: 'musician', tabName: 'Musician', n: 5 },
  { id: 'ecchi-meter', title: 'Ecchi-meter', tab: 'lust', tabName: 'Lust', n: 6 },
  { id: 'ice-fishing', title: 'Ice fishing', tab: 'fishing', tabName: 'Fishing', inline: true, n: 7 },
  { id: 'kitkot', title: 'KitKot', tab: 'influencer', tabName: 'Influencer', inline: true, n: 8 },
  { id: 'led-painting', title: 'LED painting', tab: 'painting', tabName: 'Painting', n: 9 },
  { id: 'paper-plane', title: 'Paper plane', tab: 'aviation', tabName: 'Aviation', n: 10 },
  { id: 'pixel-pets', title: 'Pixel pets', tab: 'pets', tabName: 'Pets', n: 11 },
  { id: 'saturday-night-fever', title: 'Saturday Night Fever', tab: 'concert', tabName: 'Concert', inline: true, n: 12 },
  { id: 'tattoo-skin', title: 'Tattoo practice skin', tab: 'tattoo', tabName: 'Tattoo', n: 13 },
  { id: 'vhs-pile', title: 'VHS pile', tab: 'botw', tabName: 'BOTW', inline: true, n: 14 },
  { id: 'where-was-deo', title: 'Where in the World Was Deo?', tab: 'traveler', tabName: 'Traveler', inline: true, n: 15 },
  { id: 'whack-a-miku', title: 'Whack-a-Miku', tab: 'miku', tabName: 'Miku', inline: true, n: 16 },
];

// The share code depends on every number being unique.
const seen = new Set<number>();
for (const g of GIMMICKS) {
  if (seen.has(g.n)) throw new Error(`gimmicks.ts: number ${g.n} is used twice (${g.id})`);
  seen.add(g.n);
}

export const gimmickForTab = (tab: string) => GIMMICKS.find((g) => g.tab === tab);
