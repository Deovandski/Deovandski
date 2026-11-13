# Churrasco Facet

Edit and push; the Churrasco tab rebuilds from this file. It works like the 初音ミク tab,
with one photo per panel.

- Each `##` heading is one panel (a churrasco, a cut, a gathering...). Its photo goes in
  `content/churrasco/<heading>/`, using the heading in lower case with dashes, e.g.
  `## Picanha Night (2026)` goes in `content/churrasco/picanha-night-2026/`.
- Each panel shows one photo: the first file in its folder, sorted by name.
- Plain text under a heading is shown below the photo as that panel's description.
- `>` lines before the first heading are the text at the top of the tab.

Copy this block for each panel, remove the "<!--" and "-->" lines, and fill it in:

<!--
## Panel title

A sentence or two about it.
-->
