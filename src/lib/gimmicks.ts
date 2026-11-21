// Every interactive gimmick on the site, in one list. The home page reads it for each tab's ▶ Play button
// (src/components/GimmickPlay.astro), and the hidden Gaming page (/gaming/) lists them all as FastTabs.
// To add one: a row here, its component in src/components/Gimmick.astro, and <GimmickPlay tab="…" /> in its panel.
//
// id       the gimmick's anchor and save-free name (/gaming/#paper-plane).
// title    the FastTab header.
// tab      the home page tab it plays on (`#<tab>-play` opens it straight away).
// tabName  how the tab is called in text ("From the Aviation tab").
// upright  true for gimmicks shaped for a phone held upright (they don't turn sideways on Play).
export type GimmickInfo = { id: string; title: string; tab: string; tabName: string; upright?: boolean };

export const GIMMICKS: GimmickInfo[] = [
  { id: 'balls-farm', title: 'Balls farm', tab: 'mentor', tabName: 'Mentor' },
  { id: 'dice-tray', title: 'Dice tray', tab: 'dnd', tabName: 'D&D' },
  { id: 'dino-ambush', title: 'Dino Ambush', tab: 'gamer', tabName: 'Gamer' },
  { id: 'drum-kit', title: 'Drum kit', tab: 'musician', tabName: 'Musician' },
  { id: 'ecchi-meter', title: 'Ecchi-meter', tab: 'lust', tabName: 'Lust' },
  { id: 'kitkot', title: 'KitKot', tab: 'influencer', tabName: 'Influencer', upright: true },
  { id: 'led-painting', title: 'LED painting', tab: 'painting', tabName: 'Painting' },
  { id: 'paper-plane', title: 'Paper plane', tab: 'aviation', tabName: 'Aviation' },
  { id: 'pixel-pets', title: 'Pixel pets', tab: 'pets', tabName: 'Pets', upright: true },
  { id: 'saturday-night-fever', title: 'Saturday Night Fever', tab: 'concert', tabName: 'Concert' },
  { id: 'tattoo-skin', title: 'Tattoo practice skin', tab: 'tattoo', tabName: 'Tattoo' },
  { id: 'territory-snipping', title: 'Territory Snipping', tab: 'boardgames', tabName: 'Board Games' },
  { id: 'vhs-pile', title: 'VHS pile', tab: 'botw', tabName: 'BOTW' },
  { id: 'whack-a-miku', title: 'Whack-a-Miku', tab: 'miku', tabName: 'Miku' },
];

export const gimmickForTab = (tab: string) => GIMMICKS.find((g) => g.tab === tab);
