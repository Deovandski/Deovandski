# Privacy

This website has no accounts, no ads, no analytics and no cookies. It doesn't send anything about you anywhere. What it
keeps, it keeps in your own browser, and clearing the site's data removes all of it.

**Settings.** The Settings menu (the gear, top right) saves your Language and Vraki mode choices in your browser's local
storage, under `deovandski-site`, so they stick between visits.

**Games.** Games behind ▶ Play keep what's worth keeping (high scores, progress, their own settings) in local storage,
in this browser only: never in a cookie, never sent anywhere. Today that's:
- the paper plane's best distance (`paper-plane-best`);
- the Balls farm (`balls-farm`);
- the pixel pets (`pixel-pet:<name>`);
- Cook the perfect egg's best rating per egg and its sound setting (`perfect-egg`);
- Whack-a-Miku's best score (`whack-a-miku`);
- Where in the World Was Deo?'s best score (`where-was-deo`);
- Ice fishing's count of fish caught, the biggest one, and its Sound and Reverse scroll buttons (`ice-fishing`);
- Saturday Night Fever's best on-beat streak per routine and its music button (`saturday-night-fever`);
- Dino Ambush's rounds won and lost (`dino-ambush`).

Stats for nerds (Settings › DEBUG, `/debug/`) lists every one of
them, with what this browser holds for each.

**Where you came from.** A link with `?src=…` (like `?src=LinkedIn`) is remembered for the visit in session storage
(`src`), so the page can show or hide a few things for that audience. It's forgotten when you close the tab.

**Offline copies.** So the site (and the app, if you install it) opens without a connection, a service worker saves
copies of the home page and the QR Code and Playground pages, with their styles, scripts and fonts, in your browser's Cache
Storage. Gallery photos and anything from other websites are never saved. The copies stay on your device.

**Videos.** Embedded YouTube videos load nothing from YouTube until you press play; then they play from
youtube-nocookie.com.

**Photo shoot.** The camera on the Photographer tab keeps the photos you take only in the open page, until you leave it.
Saving a photo or the roll (.zip) downloads it to your device. Nothing is stored in the browser or sent anywhere.

**Stats for nerds.** The debug page (Settings › DEBUG, `/debug/`) shows what your browser tells the page about itself:
browser and device, screen, storage use, connection, page timings. It reads this only to show it to you on that page.
Nothing is saved and nothing is sent anywhere; the page only asks this website for its build file (`stats.json`) and
times three small requests to it.

The website is also offered in other languages. Those versions were translated ahead of time by AI (Claude) from the
English original and say so in a banner at the top.
