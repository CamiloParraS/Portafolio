// Procedural illustrations, one per project and off-code tile. Each is a tone function in
// dither cells; coordinates are centred and normalised by height so shapes keep their
// proportions at any tile size.

import type { ArtId } from "./content";
import { hash } from "./dither";

type Art = (x: number, y: number, w: number, h: number) => number;

const norm = (x: number, y: number, w: number, h: number) => [(x - w / 2) / h, (y - h / 2) / h] as const;
const gauss = (d2: number, s: number) => Math.exp(-d2 / (2 * s * s));

/** The car used in the hero scene and the garage tile. `lx`/`ly` are in car lengths; -1 means empty. */
export function carTone(lx: number, ly: number, lightsOn: boolean): number {
  // Wheels first, so they sit over the sill.
  for (const wx of [0.2, 0.8]) {
    const d = Math.hypot(lx - wx, ly - 0.12);
    if (d < 0.11) return d < 0.05 ? 0.5 : 1;
  }
  if (lx >= 0 && lx <= 1 && ly >= 0.12 && ly <= 0.3) {
    if (lx > 0.92 && ly > 0.24) return 0; // rounded nose
    if (lx < 0.03 && ly > 0.18 && ly < 0.26 && lightsOn) return 0.55; // tail light
    if (Math.abs(lx - 0.5) < 0.01 && ly < 0.27) return 0.55; // door shut line
    return 0.95;
  }
  if (ly > 0.3 && ly <= 0.46) {
    const k = ly - 0.3;
    const left = 0.24 + k * 0.9;
    const right = 0.7 - k * 1.1;
    if (lx >= left && lx <= right) {
      const frame = lx - left < 0.025 || right - lx < 0.025 || ly > 0.43 || Math.abs(lx - 0.47) < 0.012;
      return frame ? 0.95 : 0.4;
    }
  }
  return -1;
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

/** Side profile of the car parked on a road line. */
export const garageArt: Art = (x, y, w, h) => {
  const L = Math.min(w * 0.62, h * 1.5);
  const base = h * 0.78;
  const t = carTone((x - (w - L) / 2) / L, (base - y) / L, false);
  if (t >= 0) return t;
  if (Math.abs(y - base) < 1) return 0.55;
  if (y > base) return (x % 10 < 5 && Math.abs(y - h * 0.9) < 1) ? 0.6 : 0.08;
  return 0.03;
};

/** A cartridge: grip ridges up top, a gradient label, no logos. */
export const cartridgeArt: Art = (x, y, w, h) => {
  const [u, v] = norm(x, y, w, h);
  const top = -0.36;
  const bottom = 0.36;
  const half = v < -0.2 ? 0.36 : 0.3;
  if (Math.abs(u) <= half && v >= top && v <= bottom) {
    if (Math.abs(u) > half - 0.015 || v - top < 0.015 || bottom - v < 0.015) return 1;
    if (v < -0.22) return Math.abs(((u + 4) % 0.05) - 0.025) < 0.008 ? 0.9 : 0.5;
    if (Math.abs(u) < 0.22 && v > -0.14 && v < 0.24) return 0.15 + (0.24 - v) * 1.6;
    return 0.5;
  }
  return 0.03;
};

/** A quiet frame for photos that haven't been added yet. */
export const placeholderArt: Art = (x, y, w, h) => 0.06 + 0.22 * (1 - y / h) * (0.6 + 0.4 * Math.sin(x / w * 3.1));
