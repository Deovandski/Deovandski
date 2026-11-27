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
export type GimmickInfo = { id: string; title: string; tab: string; tabName: string; inline?: boolean };

export const GIMMICKS: GimmickInfo[] = [
  { id: 'around-the-world', title: 'Around the World in 80 Gears', tab: 'cycling', tabName: 'Cycling', inline: true },
  { id: 'balls-farm', title: 'Balls farm', tab: 'mentor', tabName: 'Mentor' },
  { id: 'dice-tray', title: 'Dice tray', tab: 'dnd', tabName: 'D&D', inline: true },
  { id: 'dino-ambush', title: 'Dino Ambush', tab: 'gamer', tabName: 'Gamer' },
  { id: 'drum-kit', title: 'Drum kit', tab: 'musician', tabName: 'Musician' },
  { id: 'ecchi-meter', title: 'Ecchi-meter', tab: 'lust', tabName: 'Lust' },
  { id: 'ice-fishing', title: 'Ice fishing', tab: 'fishing', tabName: 'Fishing', inline: true },
  { id: 'kitkot', title: 'KitKot', tab: 'influencer', tabName: 'Influencer', inline: true },
  { id: 'led-painting', title: 'LED painting', tab: 'painting', tabName: 'Painting' },
  { id: 'paper-plane', title: 'Paper plane', tab: 'aviation', tabName: 'Aviation' },
  { id: 'pixel-pets', title: 'Pixel pets', tab: 'pets', tabName: 'Pets' },
  { id: 'saturday-night-fever', title: 'Saturday Night Fever', tab: 'concert', tabName: 'Concert', inline: true },
  { id: 'tattoo-skin', title: 'Tattoo practice skin', tab: 'tattoo', tabName: 'Tattoo' },
  { id: 'vhs-pile', title: 'VHS pile', tab: 'botw', tabName: 'BOTW', inline: true },
  { id: 'where-was-deo', title: 'Where in the World Was Deo?', tab: 'traveler', tabName: 'Traveler', inline: true },
  { id: 'whack-a-miku', title: 'Whack-a-Miku', tab: 'miku', tabName: 'Miku', inline: true },
];

export const gimmickForTab = (tab: string) => GIMMICKS.find((g) => g.tab === tab);
