# MTG (Magic: The Gathering)

Edit and push; the MTG tab rebuilds from this file.

- Each `##` heading is one card (a deck, a tournament, a memorable game...).
- The plain text under it is the short description.
- Optional lines right under the heading: `kicker: ...` (small label
  above the title) and `subtitle: ...` (italic line under it), e.g. `kicker: Commander`, `subtitle: Mono-blue, zero friends`.
- One picture per card: put it in `content/mtg/<title>/`, using the title in
  lower case with dashes ("&" becomes "and"). Example: "## Commander Deck" goes in
  `content/mtg/commander-deck/`.
- Each line of plain text under a heading is one paragraph.
- Until a card has a picture, it shows a "Photo coming soon" box.
- With no cards yet, the tab says they're on their way.

Copy this block for each card, remove the "<!--" and "-->" lines, and fill it in:

<!--
## Card title
kicker: Optional small label
subtitle: Optional italic line

A sentence or two about it.
-->
