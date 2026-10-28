// Procedural illustrations, one per project and off-code tile. Each is a tone function in
// dither cells; coordinates are centred and normalised by height so shapes keep their
// proportions at any tile size.

import type { ArtId } from "./content";
import { type Inks, hash, hexToRgb } from "./dither";

type Art = (x: number, y: number, w: number, h: number) => number;

const norm = (x: number, y: number, w: number, h: number) => [(x - w / 2) / h, (y - h / 2) / h] as const;
const gauss = (d2: number, s: number) => Math.exp(-d2 / (2 * s * s));

// Palette regions for tones of `2 * region + t` (see paintOrdered). Car parts take 1-9.
const GLASS = 1;
const TIRE = 2;
const HUB = 3;
const HEAD = 4;
const TAIL = 5;
export const PAINT = 6; // 6-9: the four first-gen colours

const ink = (ground: string, mid: string, hi: string): Inks => [hexToRgb(ground), hexToRgb(mid), hexToRgb(hi)];
export const CAR_PALETTES: Inks[] = [
  ink("#1d3b52", "#5aa9d6", "#a9dcf5"), // glass
  ink("#0a0a0a", "#1c1c1c", "#262626"), // tire
  ink("#6b7280", "#aab0b8", "#e5e7eb"), // hub
  ink("#ffffff", "#ffffff", "#ffffff"), // headlight
  ink("#7f1d1d", "#b91c1c", "#ef4444"), // tail light
  ink("#3a2c00", "#d4a017", "#ffd21f"), // Twingo yellow
  ink("#3b0a0a", "#a11d1d", "#e53935"), // red
  ink("#052e16", "#15803d", "#34b45a"), // green
  ink("#0b1e4a", "#1d4ed8", "#4f8cf0"), // indigo blue
];

// 0 = outside, otherwise what part of a first-gen Twingo profile covers this point.
// `lx` runs rear (0) to nose (1), `ly` is height in car lengths: a short, tall, rounded one-box.
function twingo(lx: number, ly: number): number {
  for (const wx of [0.18, 0.8]) {
    const d = Math.hypot(lx - wx, ly - 0.1);
    if (d < 0.04) return HUB;
    if (d < 0.098) return TIRE;
  }
  if (Math.hypot(lx - 0.945, ly - 0.2) < 0.042) return HEAD;
  if (lx > 0.02 && lx < 0.06 && ly > 0.15 && ly < 0.25) return TAIL;
  // Lower body: rounded box, nose and tail both bluff.
  const bx = Math.max(Math.abs(lx - 0.505) - 0.425, 0);
  const by = Math.max(Math.abs(ly - 0.18) - 0.04, 0);
  const body = Math.hypot(bx, by) < 0.07;
  // Cabin: near-vertical hatch, steep windscreen, domed roof.
  const t = Math.min(1, Math.max(0, (ly - 0.25) / 0.25));
  const dome = Math.max(0, ly - 0.44);
  const left = 0.07 + 0.1 * t + dome;
  const right = 0.88 - 0.3 * t - dome;
  const cabin = ly > 0.25 && ly <= 0.5 && lx >= left && lx <= right;
  if (cabin && ly > 0.31 && ly < 0.46 && lx > left + 0.035 && lx < right - 0.035 && Math.abs(lx - 0.47) > 0.014) return GLASS;
  return body || cabin ? PAINT : 0;
}

/** The car used in the hero scene and the garage tile: a first-gen Twingo. Returns -1 off the car. */
export function carTone(lx: number, ly: number, lightsOn: boolean, paint = PAINT, e = 0.02): number {
  if (lx < -0.05 || lx > 1.05 || ly < -0.02 || ly > 0.52) return -1;
  const part = twingo(lx, ly);
  if (!part) return -1;
  const body = part === PAINT ? paint : part;
  // Dark rim wherever the silhouette ends, and a ring around each wheel, so the car reads on any ground.
  const rim =
    !twingo(lx - e, ly) || !twingo(lx + e, ly) || !twingo(lx, ly - e) || !twingo(lx, ly + e) ||
    (part === PAINT && [0.18, 0.8].some((wx) => Math.hypot(lx - wx, ly - 0.1) < 0.118)) ||
    (part === PAINT && Math.abs(lx - 0.47) < e * 0.5 && ly < 0.27 && ly > 0.1);
  if (rim && part !== TIRE) return paint * 2;
  if (part === PAINT) return body * 2 + (ly < 0.115 ? 0.5 : 1); // shaded sill
  if (part === TAIL) return body * 2 + (lightsOn ? 1 : 0.5);
  return body * 2 + 1;
}

const CLUSTERS = [
  [-0.55, -0.12, 0.09],
  [0.05, -0.24, 0.07],
  [0.45, 0.14, 0.1],
  [-0.15, 0.24, 0.08],
  [0.8, -0.22, 0.06],
];

export const projectArt: Record<ArtId, Art> = {
  // An embedding space: files as points, a query ring landing on its nearest cluster.
  magi(x, y, w, h) {
    // Normalised by width too, so the whole space (and the query ring) fits narrow tiles.
    const n = Math.max(w / 1.75, h * 0.55);
    const [u, v] = [(x - w / 2) / n, (y - h / 2) / n];
    const [qx, qy] = [0.45, 0.14];
    const dq = Math.hypot(u - qx, v - qy);
    if (Math.abs(dq - 0.19) < 1.4 / n) return 1;
    let density = 0;
    for (const [cx, cy, s] of CLUSTERS) density += gauss((u - cx) ** 2 + (v - cy) ** 2, s);
    if (hash(x, y) < density * 0.55) return dq < 0.19 ? 1 : 0.75;
    return 0.06;
  },
  // A guard's vision cone sweeping rooms, the player slipping past its edge.
  ghost(x, y, w, h) {
    const [u, v] = norm(x, y, w, h);
    const wall = Math.abs(((u + 2) % 0.55) - 0.275) > 0.268 || Math.abs(((v + 2) % 0.5) - 0.25) > 0.243;
    const doorway = Math.abs(((v + 2) % 0.5) - 0.25) < 0.07 || Math.abs(((u + 2) % 0.55) - 0.275) < 0.08;
    if (wall && !doorway) return 0.55;
    const [gx, gy] = [0.3, -0.05];
    if (Math.hypot(u - gx, v - gy) < 0.035) return 1;
    if (Math.hypot(u + 0.42, v - 0.22) < 0.03) return 1;
    const dx = gx - u;
    const dy = v - gy;
    const ang = Math.abs(Math.atan2(dy, dx));
    const dist = Math.hypot(dx, dy);
    if (dx > 0 && ang < 0.42 && dist < 0.75) return 0.6 * (1 - dist / 0.75) + 0.1;
    return 0.04;
  },
  // Wrist motion as three signal traces over a faint grid.
  haptic(x, y, w, h) {
    const [u, v] = norm(x, y, w, h);
    for (const [off, amp, f] of [
      [-0.22, 0.07, 9],
      [0, 0.1, 5.5],
      [0.22, 0.05, 14],
    ]) {
      if (Math.abs(v - (off + amp * Math.sin(u * f) * Math.cos(u * 1.3))) < 0.014) return 1;
    }
    const grid = Math.abs(((u + 4) % 0.125) - 0.0625) > 0.058 || Math.abs(((v + 4) % 0.125) - 0.0625) > 0.058;
    return grid ? 0.3 : 0.04;
  },
  // An eye behind protective hatching.
  sophiel(x, y, w, h) {
    const [u, v] = norm(x, y, w, h);
    const lid = 0.26 * (1 - (u / 0.62) ** 2);
    if (Math.abs(v) < lid) {
      const d = Math.hypot(u, v);
      if (d < 0.06) return 0;
      if (d < 0.17) return 1;
      return Math.abs(Math.abs(v) - lid) < 0.02 ? 1 : 0.12;
    }
    return (x + y) % 6 === 0 ? 0.55 : 0.04;
  },
  // A stack of institutional templates.
  laaf(x, y, w, h) {
    const [u, v] = norm(x, y, w, h);
    for (let i = 2; i >= 0; i--) {
      const ox = -0.14 + i * 0.1;
      const oy = -0.1 + i * -0.06;
      const left = ox - 0.22;
      const right = ox + 0.22;
      const top = oy - 0.3;
      const bottom = oy + 0.3;
      if (u >= left && u <= right && v >= top && v <= bottom) {
        if (u - left < 0.012 || right - u < 0.012 || v - top < 0.012 || bottom - v < 0.012) return 1;
        if (i === 0) {
          const row = (v - top) / 0.06;
          if (row > 1.4 && Math.abs((row % 1) - 0.5) < 0.18 && u < right - 0.05 - (Math.floor(row) % 3) * 0.06) return 0.6;
          if (row < 1.2 && u < left + 0.2) return 0.9;
        }
        return 0.06;
      }
    }
    return 0.02;
  },
};

/** A collector's wall: three shelves of the scene car, each one a different paint (needs CAR_PALETTES). */
export const garageArt: Art = (x, y, w, h) => {
  const row = h / 3;
  const r = Math.floor(y / row);
  const base = (r + 1) * row - 3;
  if (Math.abs(y - base) < 1) return 0.55; // shelf
  const L = row * 1.15;
  const slot = L * 1.3;
  const c = Math.floor((x + (r % 2) * slot * 0.5) / slot);
  const lx = ((x + (r % 2) * slot * 0.5) % slot - (slot - L) / 2) / L;
  const t = carTone(lx, (base - 1 - y) / L, false, PAINT + Math.floor(hash(c, r) * 4), 1.2 / L);
  return t >= 0 ? t : 0.03;
};

/** A quiet frame for photos that haven't been added yet. */
export const placeholderArt: Art = (x, y, w, h) => 0.06 + 0.22 * (1 - y / h) * (0.6 + 0.4 * Math.sin(x / w * 3.1));
