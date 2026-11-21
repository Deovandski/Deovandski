# Family tab

`header/` holds the two photos shown side by side at the top of the Family tab:
`familyHeader_1.jpg` (left) and `familyHeader_2.jpg` (right). Swap either file to change it.

`_intro.md` is the text under them. Links are written `[text](https://…)`, and a picture between paragraphs is a line
of its own, `![alt text](name)`, with the file in `inline/` (`inline/familyChimarraoGather.jpg` is the chimarrão photo). The Itaituba → Fargo map sits after its first paragraph
(the map's places and area are in `src/components/FamilyFacet.astro`). Photos go straight in this
folder and appear below the text (the plan is three), in filename order:
`01-mom-and-dad.jpg`, `02-….jpg`, `03-….jpg`. Each filename becomes the photo's
caption, so `01-mom-and-dad.jpg` shows as "Mom and dad". Formats: .jpg, .jpeg,
.png, .webp, .avif.
