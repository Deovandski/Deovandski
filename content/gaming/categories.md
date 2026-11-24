# Gamer tab

Edit and push; the Gamer tab rebuilds from this file and from `steam-games.json`,
`xbox-games.json` and `estimated.md` (the hours). To refresh the hours, about once a year, follow README.md in this folder.

- Each `##` heading is a category. The site orders categories, and the games in each,
  by hours (most played first), so the order here doesn't matter.
- Each bullet is one game, written as Steam or Xbox names it. ™ and ® can be left out, and
  capitals don't matter. Its hours come from `steam-games.json` and `xbox-games.json`, and it
  gets a Steam and/or Xbox chip for each one it's in. Hours I estimated for older games
  (PlayStation, PC) come from `estimated.md` and are added on, with their own chip and an
  asterisk. A game in none of them is skipped (`node scripts/steam-games.mjs` lists those).
- A game on both adds its Steam and Xbox hours together. Add `{same}` when it's the same play
  counted twice (a Microsoft game on Steam also reports its hours to Xbox), and it uses the
  larger number instead.
- A series is one line naming all its games, series name first: `- Hades series | Hades | Hades II`.
  Its hours are all of theirs added up. Every refresh rolls new games into their series (README.md).
  `{solo}` keeps a game on its own line when it only shares a name with a series.
- When the two stores name a game differently, list every name with `|` between them; the
  first is the one shown: `- Grand Theft Auto V | Grand Theft Auto V Legacy | Grand Theft Auto V (Xbox One)`.
- `{idle}` after a heading marks games that mostly ran in the background. Their hours
  get their own colour, and the "Count idle games" switch takes them out of the total.
- A plain line under a heading is that category's note.
- Lines starting with `>` before the first heading are the tab's intro. `{updated}` is
  replaced by the day the hours were exported.

> I've consciously chosen to spend a decent chunk of my finite life enjoying experiences crafted by the human mind! Gaming isn't just about interacting with the experience itself; it also goes into the technical details. I'm not much of a game dev, but it always fascinates me the way game engines and devs themselves pursue higher and higher fidelity while hardware itself is a bottleneck. This list was updated on {updated}.

## Idle & clickers {idle}

Hours here are mostly the game running in the background.

- AdVenture Capitalist
- Clicker Heroes series | Clicker Heroes | Clicker Heroes 2
- Cookie Clicker
- Dragon Cliff 龙崖
- Guild Quest
- Holyday City: Reloaded
- I Can't Believe It's Not Gambling GOTY Edition
- Idle Evolution
- Idle Waters
- Loading Screen Simulator
- Loot Box Quest
- Midas Gold Plus
- Nova Lands
- PickCrafter
- Plantera
- Realm Grinder
- Rusty's Retirement
- Scream Collector
- Soda Dungeon
- Spirit City: Lofi Sessions
- Squirreled Away
- Tap Tap Infinity
- Time Clickers

## Factory & automation

- Autonauts
- Blueprint Tycoon
- Dyson Sphere Program
- Factorio
- Little Big Workshop
- Oxygen Not Included
- The Planet Crafter

## Space & flight

- ACE COMBAT7: SKIES UNKNOWN
- EVERSPACE 2
- Kerbal Space Program
- Lunar Flight
- No Man's Sky
- Outer Wilds
- The Invincible
- Universe Sandbox Legacy

## Survival & crafting

- ARK: Survival Evolved
- Core Keeper
- Forager
- Garry's Mod
- Gedonia
- Grand Emprise: Time Travel Survival
- Grounded
- Medieval Dynasty
- Minecraft: Xbox One Edition
- Nomad Survival
- Subnautica series | Subnautica | Subnautica: Below Zero
- Terraria

## City, colony & strategy

- Age of Empires II | Age of Empires II (2013) | Age of Empires II: Definitive Edition {same}
- Anno 2070
- Arboria
- Banished
- Before We Leave
- Cities: Skylines
- ENDLESS Space - Definitive Edition
- Frostpunk
- Game Dev Tycoon
- Kingdoms and Castles
- Patron
- Prison Architect
- Reus
- Sid Meier's Civilization V
- Spore | Spore: Galactic Adventures
- The Colonists
- Tropico 4
- Undead Horde

## RPGs & open worlds

- Assassin's Creed series | Assassin's Creed Origins
- Avowed {same}
- CHRONO TRIGGER
- CrossCode
- Cyberpunk 2077
- Diablo series | Diablo II | Diablo III | Diablo III: Reaper of Souls – Ultimate Evil Edition
- Divinity: Original Sin 2
- Eastward
- Fallout series | Fallout 4 | Fallout: New Vegas
- Final Fantasy series | FINAL FANTASY XII | FINAL FANTASY XII THE ZODIAC AGE | FINAL FANTASY XV WINDOWS EDITION
- God of War
- Grand Theft Auto series | Grand Theft Auto III | Grand Theft Auto IV | Grand Theft Auto IV: The Complete Edition | Grand Theft Auto: San Andreas | Grand Theft Auto V | Grand Theft Auto V Legacy | Grand Theft Auto V (Xbox One)
- Grim Dawn
- Hogwarts Legacy
- KINGDOM HEARTS III
- Like a Dragon: Pirate Yakuza in Hawaii
- Little Witch Academia: Chamber of Time
- Mass Effect Legendary Edition
- Path of Exile
- Perfect World
- Ragnarok Online
- Red Dead Redemption 2
- Revenant (1999)
- South Park: The Fractured but Whole
- Tales of ARISE
- The Elder Scrolls series | The Elder Scrolls IV: Oblivion Remastered | The Elder Scrolls Online | The Elder Scrolls V: Skyrim | The Elder Scrolls V: Skyrim Special Edition
- The Outer Worlds
- The Witcher 3: Wild Hunt — Remastered

## Action & adventure

- A Plague Tale series | A Plague Tale: Innocence | A Plague Tale: Requiem
- BLACKTAIL
- Destroy All Humans!
- Dynasty Warriors and Empires series | DW6 Empires
- Ghostbusters: The Video Game Remastered
- Hellblade: Senua's Sacrifice
- High On Life
- Just Cause 3
- LEGO Star Wars: The Skywalker Saga
- Maneater
- Marvel's Guardians of the Galaxy
- Marvel’s Spider-Man Remastered
- MONSTER HUNTER: WORLD
- Ratchet & Clank series | Ratchet & Clank: Rift Apart
- Revenge of the Savage Planet
- Spyro Reignited Trilogy
- STAR WARS Jedi: Fallen Order
- Stray
- Wrongworld

## Roguelites

- Dead Cells
- Hades series | Hades | Hades II
- Halls of Torment
- Vampire Survivors

## Shooters & co-op

- Borderlands series | Borderlands 2 | Borderlands 3 | Borderlands GOTY Enhanced
- Dead Island 2
- Far Cry 5
- Left 4 Dead 2
- PAYDAY 2

## Cozy & life sims

- Bum Simulator
- Cult of the Lamb
- DAVE THE DIVER
- Death and Taxes
- Do No Harm
- DREDGE
- Feel The Snow
- Graveyard Keeper
- Hatsune Miku Logic Paint S {solo}
- Passpartout: The Starving Artist
- Plants vs. Zombies: Game of the Year
- PowerWash Simulator
- Road 96
- Scribblenauts Unlimited
- Scritchy Scratchy
- Slime Rancher
- Spiritfarer: Farewell Edition
- Stardew Valley
- The Stanley Parable

## Rhythm & music

- Hatsune Miku: Project DIVA series | Hatsune Miku: Project DIVA Mega Mix+
