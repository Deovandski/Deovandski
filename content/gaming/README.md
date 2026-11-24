# Gamer tab

The Gamer tab groups my games into categories, with the hours each one took and a chip for where
those hours come from: Steam, Xbox, or (estimated by me) PlayStation and PC.

| File | What it holds |
|---|---|
| `categories.md` | The intro, the categories and which games go in each. Edit it by hand. |
| `steam-games.json` | Every game I own on Steam and its minutes played, plus the day it was exported. Written by the script below; don't edit it by hand. |
| `xbox-games.json` | Every Xbox game with minutes played, from the last Xbox pull (November 2026). Written by `scripts/xbox-games.mjs`; don't edit it by hand. See "Xbox hours" below. |
| `estimated.md` | Hours I estimated for games from before playtime tracking (PlayStation, PC, and Xbox games Xbox kept no hours for). Edit it by hand; no refresh needed. Each game also needs its line in `categories.md`. These games get an asterisk and the tab's footnote. |

The site works out everything else: each category's hours, the totals, the order, and the
"Count idle games" switch (for categories marked `{idle}`).

## Refresh the hours (about once a year)

It takes about 10 minutes.

1. **Get a Steam Web API key** at <https://steamcommunity.com/dev/apikey>, signed in as
   Deovandski. Any domain name works (`deovandski.com`). If you made one before, the same page
   shows it.
2. **Download your games.** Open this link in a browser, with `YOUR_KEY` replaced by the key:

   ```
   https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=YOUR_KEY&steamid=76561198027257062&include_appinfo=1&include_played_free_games=1&format=json
   ```

   `76561198027257062` is my Steam ID (the number behind `steamcommunity.com/id/Deovandski`).
   Save the page as `steam-games.json` anywhere outside the repo, such as Downloads. That download
   doesn't contain the key, but keep the key itself out of the repo: never paste it into a file here.
3. **Update the repo** from its folder:

   ```sh
   node scripts/steam-games.mjs ~/Downloads/steam-games.json
   ```

   It writes `content/gaming/steam-games.json` with today's date (the intro's "updated on"),
   then lists (checking the Xbox hours too):
   - **games with 10+ hours in no category:** add each one under a `##` heading in
     `categories.md`, or leave it out on purpose;
   - **listed games found in neither export:** usually a game Steam renamed. Fix the name in
     `categories.md` to match.

   Run it again until both lists say everything matches (or only shows what you chose to leave out).
4. **Check it:** `npm run build`, then open the Gamer tab: the new totals, the category bars and
   "Show all" on a couple of cards.
5. **Open a PR** with both files. New hours and the new date change most of the tab's text, so
   it shows in English on the translated pages until the next translation batch (see CLAUDE.md).
   That batch is usually done in the same PR. Game names use their official local title where one
   exists (mostly in Chinese, Japanese and Korean). Otherwise they keep the Steam name.

Done for the year. Claude can do steps 3 to 5 for you: send it the downloaded file (never the key).

## Xbox hours (reference only)

I don't have an Xbox anymore; I live and breathe Steam (#PCMASTERRACE). The Xbox hours were pulled
once, in November 2026, and stay as they are, so a normal refresh skips this section.
It's here for anyone who clones the project and wants their Xbox hours on it too.

Xbox has no public API for hours, so this goes through [OpenXBL](https://xbl.io), a free service
that reads your Xbox Live data once you sign in with your Microsoft account. Its free plan allows
150 requests an hour.

1. **Sign in at <https://xbl.io>** with the Microsoft account of your gamertag and copy your API
   key. It's a key to your account: keep it out of the repo, and delete it on xbl.io when you're done.
2. **Download your games** from the repo's folder, with the key in an environment variable:

   ```sh
   XBL_KEY=your-key node scripts/xbox-fetch.mjs ~/Downloads/xbox-download.json
   ```

   On Windows PowerShell: `$env:XBL_KEY="your-key"; node scripts/xbox-fetch.mjs $HOME\Downloads\xbox-download.json`.
   It uses 2 requests for the game list and 1 per game for its hours, and stops at 140 to stay under
   the limit. If it says games are still waiting, run the same command again after an hour; it
   picks up where it left off.
3. **Import it:**

   ```sh
   node scripts/xbox-games.mjs ~/Downloads/xbox-download.json
   ```

   It writes `content/gaming/xbox-games.json` with the games Xbox has hours for, then shows the same
   two lists as the Steam script. Xbox has no hours for Xbox 360 games or for PC games it only saw
   launched; those are left out.
4. **Sort the new games** into `categories.md`, then build and open a PR as in steps 4 and 5 above.

What to watch for in `categories.md`:

- A game on both stores adds its Steam and Xbox hours together (No Man's Sky, Skyrim Special
  Edition: different playthroughs).
- Some Microsoft games on Steam report their hours to Xbox too, so the same play shows up twice.
  Mark those `{same}` and the larger number is used instead (Avowed).
- When the two stores name a game differently, list both names with `|`, shown name first
  (`- Grand Theft Auto V | Grand Theft Auto V Legacy | Grand Theft Auto V (Xbox One)`).
- A **series** is one line naming every game in it, with the series name first
  (`- Hades series | Hades | Hades II`): its hours are all of theirs added up, and an estimate under
  the series name in `estimated.md` adds the games that have no tracked hours.

## Editing categories

- A category is a `## Heading` line. Add `{idle}` after it for games that mostly ran in the
  background (`## Idle & clickers {idle}`).
- A game is a `- Bullet`, named as Steam or Xbox names it. ™ and ® can be left out, and capitals
  don't matter. Moving a game to another category is moving its line. `{same}` and `|` are
  explained under "Xbox hours".
- A plain line under a heading is that category's note (the idle one explains its hours).
- The site sorts categories, and the games in each, by hours, so the order in the file doesn't
  matter.
- Games under 10 hours aren't listed today. Any game can be added, whatever its hours.
