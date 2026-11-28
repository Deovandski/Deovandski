// Everything the site saves in this browser (#142). One list, read by:
//   - src/pages/debug.astro: a SAVES section on /debug/ shows each one, what it holds and how big it is here;
//   - the build: debug.astro stops the build if a key below isn't named in PRIVACY.md.
// The standard: anything worth keeping (high scores, progress, a game's own settings) is saved in the browser's local
// storage, never in a cookie and never sent anywhere (the site has no server to send it to). Add a game's key here,
// name it in PRIVACY.md, and pass it to the game as its saveKey.
export type SaveInfo = {
  key: string; // the local storage key; with `prefix`, every key that starts with it
  label: string; // what it belongs to, as shown on /debug/
  holds: string; // what's in it, in a few words
  prefix?: boolean;
};

export const SAVES: SaveInfo[] = [
  { key: 'deovandski-site', label: 'Settings', holds: 'language and Vraki mode' },
  { key: 'paper-plane-best', label: 'Paper plane', holds: 'best distance' },
  { key: 'balls-farm', label: 'Balls farm', holds: 'the whole farm' },
  { key: 'pixel-pet:', label: 'Pixel pets', holds: 'each pet, one key per pet', prefix: true },
  { key: 'perfect-egg', label: 'Perfect egg', holds: 'best rating per egg, sound on or off' },
];
