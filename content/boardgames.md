# Board Games

Edit and push; the Board Games tab rebuilds from this file.

- Each `##` heading is one card (a game, a game night, a group...).
- The plain text under it is the short description.
- Optional lines right under the heading: `kicker: ...` (small label
  above the title) and `subtitle: ...` (italic line under it), e.g. `kicker: Game night #1`, `subtitle: Who flipped the table`.
- One picture per card: put it in `content/boardgames/<title>/`, using the title in
  lower case with dashes ("&" becomes "and"). Example: "## Catan" goes in
  `content/boardgames/catan/`.
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
