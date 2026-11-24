# Gamer tab

The Gamer tab groups my Steam games into categories, with the hours each one took.

| File | What it holds |
|---|---|
| `categories.md` | The intro, the categories and which games go in each. Edit it by hand. |
| `steam-games.json` | Every game I own on Steam and its minutes played, plus the day it was exported. Written by the script below; don't edit it by hand. |

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
   then lists:
   - **games with 10+ hours in no category:** add each one under a `##` heading in
     `categories.md`, or leave it out on purpose;
   - **listed games that aren't in the export:** usually a game Steam renamed. Fix the name in
     `categories.md` to match.

   Run it again until both lists say everything matches (or only shows what you chose to leave out).
4. **Check it:** `npm run build`, then open the Gamer tab: the new totals, the category bars and
   "Show all" on a couple of cards.
5. **Open a PR** with both files. Translations of any new categories or notes come in the next
   translation batch (see CLAUDE.md); game names stay as written.

Done for the year. Claude can do steps 3 to 5 for you: send it the downloaded file (never the key).

## Editing categories

- A category is a `## Heading` line. Add `{idle}` after it for games that mostly ran in the
  background (`## Idle & clickers {idle}`).
- A game is a `- Bullet`, named as Steam names it. ™ and ® can be left out, and capitals don't
  matter. Moving a game to another category is moving its line.
- A plain line under a heading is that category's note (the idle one explains its hours).
- The site sorts categories, and the games in each, by hours, so the order in the file doesn't
  matter.
- Games under 10 hours aren't listed today. Any game can be added, whatever its hours.
