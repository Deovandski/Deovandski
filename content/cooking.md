# Cooking

Edit and push; the Cooking tab rebuilds from this file.

- Each `##` heading is one card (a dish, a recipe, a cook-off...).
- The plain text under it is the short description.
- Optional lines right under the heading: `kicker: ...` (small label
  above the title) and `subtitle: ...` (italic line under it), e.g. `kicker: Family recipe`, `subtitle: Vó's feijoada`.
- One picture per card: put it in `content/cooking/<title>/`, using the title in
  lower case with dashes ("&" becomes "and"). Example: "## Feijoada" goes in
  `content/cooking/feijoada/`.
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
