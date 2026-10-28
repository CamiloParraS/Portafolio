// Three-ink dithering shared by every canvas on the page. A "tone" is ink density in
// 0..1: 0 paints the ground ink, 0.5 the mid ink, 1 the high ink. The inks come from
// CSS custom properties, so each theme repaints the same art in its own colours.

export type Rgb = [number, number, number];
export type Inks = [Rgb, Rgb, Rgb];

// 4x4 Bayer matrix, normalised to thresholds in (0, 1).
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

export const hexToRgb = (value: string): Rgb => {
  const hex = value.trim().replace("#", "");
  const n = parseInt(hex.length === 3 ? hex.replace(/./g, "$&$&") : hex, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export function readInks(el: Element = document.documentElement): Inks {
  const s = getComputedStyle(el);
  return [
    hexToRgb(s.getPropertyValue("--dither-ground")),
    hexToRgb(s.getPropertyValue("--dither-mid")),
    hexToRgb(s.getPropertyValue("--dither-hi")),
  ];
}

const put = (data: Uint8ClampedArray, i: number, [r, g, b]: Rgb) => {
  data[i] = r;
  data[i + 1] = g;
  data[i + 2] = b;
  data[i + 3] = 255;
};

/** Ordered dither: stable patterns, so animated art doesn't shimmer. */
// A tone of `2 * region + t` paints with `palette[region - 1]` instead of the theme inks.
export function paintOrdered(img: ImageData, tone: (x: number, y: number) => number, inks: Inks, palette: Inks[] = []) {
  const { width: w, height: h, data } = img;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const v = Math.max(0, tone(x, y));
      const region = Math.floor(v / 2);
      const t = Math.min(1, v - region * 2);
      const th = BAYER[(y & 3) * 4 + (x & 3)];
      const k = t < 0.5 ? (t * 2 > th ? 1 : 0) : (t - 0.5) * 2 > th ? 2 : 1;
      put(data, (y * w + x) * 4, (region ? palette[region - 1] : inks)[k]);
    }
  }
}

/** Atkinson error diffusion into three levels: the classic look for photographs. */
export function paintDiffused(img: ImageData, tones: Float32Array, inks: Inks) {
  const { width: w, height: h, data } = img;
  const buf = Float32Array.from(tones);
  const spread = [
    [1, 0],
    [2, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
    [0, 2],
  ];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const t = buf[i];
      const k = t < 0.25 ? 0 : t < 0.75 ? 1 : 2;
      const err = (t - k / 2) / 8;
      for (const [dx, dy] of spread) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < w && ny < h) buf[ny * w + nx] += err;
      }
      put(data, i * 4, inks[k]);
    }
  }
}

/** Cheap deterministic hash in 0..1, for stars, lights and noise. */
export const hash = (x: number, y: number) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/** Colour-preserving ordered dither: each channel snaps to `levels` steps, with the Bayer pattern hiding the banding. */
export function paintColor(img: ImageData, levels = 6) {
  const { width: w, height: h, data } = img;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const th = BAYER[(y & 3) * 4 + (x & 3)];
      for (let c = 0; c < 3; c++) {
        const i = (y * w + x) * 4 + c;
        const v = (data[i] / 255) * (levels - 1);
        const lo = Math.floor(v);
        data[i] = ((lo + (v - lo > th ? 1 : 0)) / (levels - 1)) * 255;
      }
    }
  }
}
