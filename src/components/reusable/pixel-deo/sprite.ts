/**
 * pixel-deo/sprite.ts: chibi pixel Deo in the yellow king's robes and crown hat, drawn in code.
 * One source for every reusable part that shows him: StageDancer (Saturday Night Fever) and PhotoShoot (the
 * Photographer tab's camera). Moved here out of StageDancer.astro (#318); what it draws for StageDancer is unchanged.
 *
 *   import { render, GW, GH, DEFAULT_COLORS, type Pose } from './pixel-deo/sprite';
 *   const grid = render({ r: { hand: [9, -11], point: true }, l: { hand: [-4, 10] }, hip: 0, lean: 0, legs: 2 }, DEFAULT_COLORS);
 *   // grid[y][x] is a colour or null, GW x GH, outlined in black.
 *
 * No imports and no DOM, so it works in a <script> or at build time.
 */
export type Colors = Record<'hat' | 'hatTrim' | 'skin' | 'beard' | 'robe' | 'pattern' | 'hem' | 'boots', string>;
// An arm: the hand's end point relative to the shoulder (elbow optional). point: a pointing finger; thumb: a thumb up;
// front: drawn over the head (a hand on the face, the dab's elbow).
export type Arm = { hand: [number, number]; elbow?: [number, number]; point?: boolean; thumb?: boolean; front?: boolean };
// A pose: arms, hip shift, head lean, leg spread, whether we see the back (the turn), a bob up or down;
// kick: which leg (1 right, -1 left) swings out and up; toe: up on the toes (the body rises);
// look: the eyes glance left (-1) or right (1); grin: a wide, toothy smile.
export type Pose = {
  r: Arm;
  l: Arm;
  hip: number;
  lean: number;
  legs: number;
  back?: boolean;
  bob?: number;
  kick?: 1 | -1;
  toe?: boolean;
  look?: number;
  grin?: boolean;
};
export const GW = 40;
export const GH = 54;
export const DEFAULT_COLORS: Colors = {
  hat: '#1c1a1d',
  hatTrim: '#e2b33c',
  skin: '#f0c8a8',
  beard: '#3b2a20',
  robe: '#f5c518',
  pattern: '#2f5fbf',
  hem: '#ffffff',
  boots: '#f2b705',
};

export function render(pose: Pose, c: Colors): (string | null)[][] {
  const g: (string | null)[][] = Array.from({ length: GH }, () => Array(GW).fill(null));
  const set = (x: number, y: number, col: string) => {
    x = Math.round(x);
    y = Math.round(y);
    if (x >= 0 && y >= 0 && x < GW && y < GH) g[y][x] = col;
  };
  const rect = (x: number, y: number, w: number, h: number, col: string) => {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) set(x + i, y + j, col);
  };
  const ellipse = (cx: number, cy: number, rx: number, ry: number, col: string, from = -99, to = 99) => {
    for (let y = Math.floor(cy - ry); y <= cy + ry; y++)
      for (let x = Math.floor(cx - rx); x <= cx + rx; x++) {
        if (y < from || y > to) continue;
        if (((x - cx) / (rx + 0.4)) ** 2 + ((y - cy) / (ry + 0.4)) ** 2 <= 1) set(x, y, col);
      }
  };
  const line = (x0: number, y0: number, x1: number, y1: number, w: number, col: string) => {
    const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 2);
    for (let i = 0; i <= n; i++) {
      const x = x0 + ((x1 - x0) * i) / n;
      const y = y0 + ((y1 - y0) * i) / n;
      rect(x - w / 2, y - w / 2, w, w, col);
    }
  };
  const bob = (pose.bob ?? 0) - (pose.toe ? 2 : 0);
  const cx = 20;
  const hip = pose.hip;
  // Legs and boots.
  const legY = 41 + bob;
  for (const side of [-1, 1]) {
    const kicking = pose.kick === side;
    const fx = cx + side * (kicking ? pose.legs + 6 : pose.legs) + hip * 0.5;
    const fy = kicking ? 45 + bob : 49 - (pose.toe ? 2 : 0);
    line(cx + side * 2 + hip, legY, fx, fy, 3, c.robe);
    if (pose.toe && !kicking) rect(fx - 1, fy, 3, 4, c.boots); // on tiptoe: a narrow boot standing up
    else rect(fx - 2, fy, 5, 3, c.boots);
  }
  // Robe: a trapezoid from the shoulders to a hem that swings with the hips, blue pattern, striped hem.
  const top = 24 + bob;
  const bottom = 44 + bob;
  for (let y = top; y <= bottom; y++) {
    const k = (y - top) / (bottom - top);
    const half = 6 + k * 4.5;
    const shift = hip * k;
    for (let x = Math.round(cx - half + shift); x <= Math.round(cx + half + shift); x++) {
      let col = c.robe;
      if (y >= bottom - 2) col = (x + y) % 2 ? c.hem : c.pattern; // striped hem
      else if ((x * 7 + y * 3) % 11 === 0 || (y === top + 6 && Math.abs(x - cx - shift) < 3)) col = c.pattern; // dragon and cloud dots
      set(x, y, col);
    }
  }
  // Arms: wide yellow sleeves with a hand; the pointing hand has a finger.
  const drawArm = (side: number, arm: Arm) => {
    const sx = cx + side * 6 + hip * 0.1;
    const sy = top + 2;
    const hx = sx + arm.hand[0];
    const hy = sy + arm.hand[1];
    if (arm.elbow) {
      const ex = sx + arm.elbow[0];
      const ey = sy + arm.elbow[1];
      line(sx, sy, ex, ey, 4, c.robe);
      line(ex, ey, hx, hy, 3, c.robe);
    } else line(sx, sy, hx, hy, 4, c.robe);
    rect(hx - 1, hy - 1, 3, 3, c.skin);
    if (arm.point) {
      const dx = Math.sign(arm.hand[0]) || 1;
      const dy = Math.sign(arm.hand[1]) || -1;
      set(hx + dx * 2, hy + dy * 2, c.skin);
      set(hx + dx * 3, hy + dy * 3, c.skin);
    }
    if (arm.thumb) {
      set(hx, hy - 2, c.skin);
      set(hx, hy - 3, c.skin);
    }
  };
  for (const [side, arm] of [[1, pose.r], [-1, pose.l]] as [number, Arm][]) if (!arm.front) drawArm(side, arm);
  // Big chibi head with the crown hat.
  const hx = cx + pose.lean + hip * 0.2;
  const hy = 14 + bob;
  ellipse(hx, hy, 8, 8, c.skin);
  if (pose.back) {
    ellipse(hx, hy, 8, 8, c.beard, hy - 2, hy + 6); // the back of the head
  } else {
    // Short dark beard around the jaw, a moustache, eyes and brows.
    ellipse(hx, hy + 1, 8, 7, c.beard, hy + 3, hy + 9);
    rect(hx - 2, hy + 3, 5, 1, c.beard);
    const look = pose.look ?? 0;
    if (pose.grin) {
      rect(hx - 2, hy + 5, 5, 1, '#b24a3a');
      rect(hx - 1, hy + 5, 3, 1, '#ffffff');
    } else rect(hx - 1, hy + 5, 3, 1, '#b24a3a');
    rect(hx - 4 + look, hy, 2, 2, '#1b1b1b');
    rect(hx + 3 + look, hy, 2, 2, '#1b1b1b');
    rect(hx - 5, hy - 2, 3, 1, c.beard);
    rect(hx + 3, hy - 2, 3, 1, c.beard);
  }
  // Crown hat: black with gold trim and studs, a little gold top.
  rect(hx - 7, hy - 10, 15, 5, c.hat);
  rect(hx - 8, hy - 6, 17, 2, c.hatTrim);
  rect(hx - 1, hy - 13, 3, 3, c.hatTrim);
  for (let i = -6; i <= 6; i += 3) set(hx + i, hy - 8, c.hatTrim);
  // Arms marked front go over the face (the dab, a hand on the face).
  for (const [side, arm] of [[1, pose.r], [-1, pose.l]] as [number, Arm][]) if (arm.front) drawArm(side, arm);
  // Outline.
  const out = g.map((row) => row.slice());
  for (let y = 0; y < GH; y++)
    for (let x = 0; x < GW; x++) {
      if (g[y][x]) continue;
      if (g[y - 1]?.[x] || g[y + 1]?.[x] || g[y][x - 1] || g[y][x + 1]) out[y][x] = '#0d0b10';
    }
  return out;
}
