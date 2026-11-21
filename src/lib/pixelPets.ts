// The pixel pets next to each pet's big picture on the Pets tab: their drawings (shapes on a 32x32 grid,
// see src/components/reusable/PixelPet.astro) and device colours. Keyed by the pet ids in src/lib/pets.ts.
type Pt = [number, number];
type Shape =
  | { t: 'ellipse'; cx: number; cy: number; rx: number; ry: number; c: string }
  | { t: 'rect'; x: number; y: number; w: number; h: number; c: string }
  | { t: 'poly'; pts: Pt[]; c: string }
  | { t: 'px'; pts: Pt[]; c: string };

export const PIXEL_PETS: Record<string, { color: string; shapes: Shape[] }> = {
  // Captain Bidu: a fat black-and-white dog (black head and back, white blaze, muzzle and belly) in a navy
  // captain's cap with a gold winged badge, like the photo. Blue device.
  bidu: {
    color: '#2f6fd6',
    shapes: [
      { t: 'rect', x: 25, y: 19, w: 4, h: 2, c: '#232326' }, // tail
      { t: 'ellipse', cx: 16, cy: 23, rx: 10, ry: 6, c: '#232326' }, // round body
      { t: 'ellipse', cx: 16, cy: 24, rx: 6, ry: 4, c: '#f2f2f2' }, // white belly
      { t: 'rect', x: 9, y: 28, w: 4, h: 2, c: '#f2f2f2' }, // white feet
      { t: 'rect', x: 19, y: 28, w: 4, h: 2, c: '#f2f2f2' },
      { t: 'ellipse', cx: 8, cy: 14, rx: 2, ry: 4, c: '#3a3a3f' }, // ears
      { t: 'ellipse', cx: 24, cy: 14, rx: 2, ry: 4, c: '#3a3a3f' },
      { t: 'ellipse', cx: 16, cy: 13, rx: 7, ry: 6, c: '#232326' }, // head
      { t: 'rect', x: 15, y: 9, w: 2, h: 6, c: '#f2f2f2' }, // white blaze
      { t: 'ellipse', cx: 16, cy: 16, rx: 3, ry: 2, c: '#f2f2f2' }, // muzzle
      { t: 'rect', x: 15, y: 15, w: 2, h: 1, c: '#111111' }, // nose
      { t: 'px', pts: [[16, 18]], c: '#e86a8a' }, // tongue
      { t: 'rect', x: 12, y: 11, w: 2, h: 2, c: '#c98a3a' }, // eyes (amber, so they show on black fur)
      { t: 'rect', x: 18, y: 11, w: 2, h: 2, c: '#c98a3a' },
      { t: 'px', pts: [[13, 12], [19, 12]], c: '#111111' },
      { t: 'rect', x: 10, y: 4, w: 12, h: 4, c: '#1f2f6b' }, // cap
      { t: 'rect', x: 8, y: 8, w: 16, h: 1, c: '#e2b33c' }, // gold band on the brim
      { t: 'px', pts: [[15, 5], [16, 5], [14, 6], [17, 6], [15, 6], [16, 6], [13, 5], [18, 5]], c: '#e2b33c' }, // winged badge
    ],
  },
  // Princess Fluffy: a white girl dog with brown ears and eye patches, pink cheeks and a gold tiara with a pink gem,
  // like the photo. Pink device.
  fluffy: {
    color: '#e86aa8',
    shapes: [
      { t: 'ellipse', cx: 16, cy: 23, rx: 7, ry: 6, c: '#f7f4ee' }, // body
      { t: 'rect', x: 11, y: 28, w: 3, h: 2, c: '#f7f4ee' }, // feet
      { t: 'rect', x: 18, y: 28, w: 3, h: 2, c: '#f7f4ee' },
      { t: 'ellipse', cx: 22, cy: 22, rx: 2, ry: 2, c: '#f7f4ee' }, // fluffy tail
      { t: 'ellipse', cx: 9, cy: 16, rx: 2, ry: 4, c: '#9a6436' }, // floppy brown ears
      { t: 'ellipse', cx: 23, cy: 16, rx: 2, ry: 4, c: '#9a6436' },
      { t: 'ellipse', cx: 16, cy: 14, rx: 7, ry: 6, c: '#f7f4ee' }, // head
      { t: 'ellipse', cx: 12, cy: 12, rx: 3, ry: 3, c: '#b07a48' }, // brown patches around the eyes
      { t: 'ellipse', cx: 20, cy: 12, rx: 3, ry: 3, c: '#b07a48' },
      { t: 'ellipse', cx: 16, cy: 17, rx: 3, ry: 2, c: '#ffffff' }, // muzzle
      { t: 'rect', x: 15, y: 16, w: 2, h: 1, c: '#1b1b1b' }, // nose
      { t: 'rect', x: 12, y: 13, w: 2, h: 2, c: '#1b1b1b' }, // eyes
      { t: 'rect', x: 18, y: 13, w: 2, h: 2, c: '#1b1b1b' },
      { t: 'px', pts: [[12, 13], [18, 13]], c: '#ffffff' },
      { t: 'px', pts: [[11, 12], [20, 12]], c: '#1b1b1b' }, // lashes
      { t: 'px', pts: [[11, 16], [21, 16]], c: '#f4a6c0' }, // blush
      { t: 'rect', x: 12, y: 7, w: 8, h: 1, c: '#e2b33c' }, // tiara band
      { t: 'px', pts: [[12, 6], [14, 5], [16, 4], [18, 5], [20, 6], [13, 6], [15, 6], [17, 6], [19, 6], [16, 5]], c: '#e2b33c' }, // tiara points
      { t: 'px', pts: [[16, 5]], c: '#e12885' }, // gem
      { t: 'px', pts: [[14, 6], [18, 6]], c: '#7fd7ff' },
    ],
  },
  // Lord Peeta: a black-and-white tuxedo cat with green eyes. Black device.
  peeta: {
    color: '#26262b',
    shapes: [
      { t: 'rect', x: 23, y: 16, w: 2, h: 10, c: '#2b2b30' }, // tail
      { t: 'rect', x: 24, y: 14, w: 2, h: 3, c: '#2b2b30' },
      { t: 'ellipse', cx: 16, cy: 23, rx: 7, ry: 6, c: '#2b2b30' }, // body
      { t: 'ellipse', cx: 16, cy: 23, rx: 3, ry: 4, c: '#f4f4f4' }, // white chest
      { t: 'rect', x: 11, y: 28, w: 3, h: 2, c: '#f4f4f4' }, // white paws
      { t: 'rect', x: 18, y: 28, w: 3, h: 2, c: '#f4f4f4' },
      { t: 'poly', pts: [[8, 11], [10, 4], [14, 9]], c: '#2b2b30' }, // ears
      { t: 'poly', pts: [[18, 9], [22, 4], [24, 11]], c: '#2b2b30' },
      { t: 'px', pts: [[10, 7], [10, 8], [22, 7], [22, 8]], c: '#e88aa8' }, // inner ears
      { t: 'ellipse', cx: 16, cy: 14, rx: 7, ry: 6, c: '#2b2b30' }, // head
      { t: 'ellipse', cx: 16, cy: 17, rx: 3, ry: 2, c: '#f4f4f4' }, // white muzzle
      { t: 'px', pts: [[16, 16]], c: '#e88aa8' }, // nose
      { t: 'rect', x: 12, y: 13, w: 2, h: 2, c: '#b6e04a' }, // green eyes
      { t: 'rect', x: 18, y: 13, w: 2, h: 2, c: '#b6e04a' },
      { t: 'px', pts: [[13, 13], [13, 14], [19, 13], [19, 14]], c: '#111111' }, // slit pupils
      { t: 'px', pts: [[7, 17], [8, 17], [9, 17], [23, 17], [24, 17], [25, 17], [8, 19], [24, 19]], c: '#bdbdbd' }, // whiskers
    ],
  },
};
