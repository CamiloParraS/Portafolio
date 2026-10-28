"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { readColor } from "./providers";

const BAYER = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
].map((r) => r.map((v) => (v + 0.5) / 64));

type Field = (x: number, y: number) => number; // luminance 0..1 for x,y in 0..1

/** Paints a luminance field as accent-coloured Bayer dots on a transparent canvas. */
function useDitherCanvas(field: Field | null, px: number) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !field) return;
    const paint = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth / px));
      const h = Math.max(1, Math.round(canvas.clientHeight / px));
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      const img = ctx.createImageData(w, h);
      const [r, g, b] = readColor("--accent");
      for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {
          if (field(x / w, y / h) <= BAYER[y & 7][x & 7]) continue;
          const i = (y * w + x) * 4;
          img.data[i] = r;
          img.data[i + 1] = g;
          img.data[i + 2] = b;
          img.data[i + 3] = 255;
        }
      ctx.putImageData(img, 0, 0);
    };
    paint();
    const ro = new ResizeObserver(paint);
    ro.observe(canvas);
    const mo = new MutationObserver(paint);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, [field, px]);

  return ref;
}

/** Samples an image into a luminance field once it loads. */
function useImageField(src: string) {
  const [field, setField] = useState<{ fn: Field; aspect: number } | null>(null);
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const S = 200;
      const c = document.createElement("canvas");
      c.width = S;
      c.height = Math.round((S * img.height) / img.width);
      const ctx = c.getContext("2d", { willReadFrequently: true })!;
      ctx.drawImage(img, 0, 0, c.width, c.height);
      const d = ctx.getImageData(0, 0, c.width, c.height).data;
      const fn: Field = (x, y) => {
        const i = (Math.floor(y * c.height) * c.width + Math.floor(x * c.width)) * 4;
        return (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255;
      };
      setField({ fn, aspect: c.height / c.width });
    };
  }, [src]);
  return field;
}

/** `invert` dots the dark strokes rather than the light areas: right for line art on white, wrong for real photos. */
export function DitherImage({ src, alt, px = 3, invert = false, className = "" }: { src: string; alt: string; px?: number; invert?: boolean; className?: string }) {
  const field = useImageField(src);
  const fn = useMemo<Field | null>(() => (field && invert ? (x, y) => 0.1 + 0.9 * (1 - field.fn(x, y)) : (field?.fn ?? null)), [field, invert]);
  const ref = useDitherCanvas(fn, px);
  return <canvas ref={ref} role="img" aria-label={alt} className={className} style={{ imageRendering: "pixelated" }} />;
}

const RAMP = " .:-=+*%#@";

export function AsciiImage({ src, alt, cols = 72, className = "" }: { src: string; alt: string; cols?: number; className?: string }) {
  const field = useImageField(src);
  let text = "";
  if (field) {
    const rows = Math.round(cols * field.aspect * 0.5); // mono cells are ~2x taller than wide
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) text += RAMP[Math.min(RAMP.length - 1, Math.floor((1 - field.fn(x / cols, y / rows)) * RAMP.length))];
      text += "\n";
    }
  }
  return (
    <pre role="img" aria-label={alt} className={`mono select-none overflow-hidden leading-[1.05] ${className}`}>
      {text}
    </pre>
  );
}

// Authored illustrations of each project's mechanism, drawn as fields.
const g = (x: number, y: number, cx: number, cy: number, s: number) => Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / s);
const rand = (i: number) => {
  const v = Math.sin(i * 127.1) * 43758.5453;
  return v - Math.floor(v);
};

export const plates: Record<string, Field> = {
  // Embedding space: clusters of files, a query probe and its search radius.
  magi: (x, y) => {
    let v = 0;
    for (let i = 0; i < 70; i++) {
      const cl = i % 4;
      const cx = [0.25, 0.7, 0.4, 0.78][cl] + (rand(i) - 0.5) * 0.22;
      const cy = [0.3, 0.25, 0.72, 0.7][cl] + (rand(i + 99) - 0.5) * 0.22;
      v += g(x, y, cx, cy, 0.0004);
    }
    const d = Math.hypot(x - 0.42, y - 0.68);
    v += Math.abs(d - 0.16) < 0.006 ? 1 : 0;
    v += Math.abs(d - 0.26) < 0.004 ? 0.6 : 0;
    v += g(x, y, 0.42, 0.68, 0.001) * 2;
    return v + 0.06;
  },
  // Three IMU axes while washing: x, y, z traces.
  wave: (x, y) => {
    let v = 0.04;
    for (let k = 0; k < 3; k++) {
      const base = 0.25 + k * 0.25;
      const s = base + 0.08 * Math.sin(x * (14 + k * 5)) * Math.sin(x * 3.1 + k) * (0.5 + 0.5 * Math.sin(x * 7));
      v += Math.exp(-(((y - s) / 0.012) ** 2)) * (1 - k * 0.2);
    }
    return v + (Math.abs(x % 0.2) < 0.003 ? 0.25 : 0);
  },
  // A grid of captured frames; two are masked solid by the overlay.
  mask: (x, y) => {
    const cx = Math.floor(x * 5);
    const cy = Math.floor(y * 3);
    const fx = (x * 5) % 1;
    const fy = (y * 3) % 1;
    if (fx < 0.08 || fy < 0.1) return 0;
    if ((cx === 1 && cy === 1) || (cx === 3 && cy === 0)) return 0.95;
    return 0.12 + 0.3 * Math.sin(fx * 9 + cx) * Math.cos(fy * 7 + cy) ** 2;
  },
  // Stacked document templates with ruled lines.
  sheets: (x, y) => {
    let v = 0.04;
    for (let k = 0; k < 3; k++) {
      const ox = 0.18 + k * 0.12;
      const oy = 0.12 + k * 0.1;
      if (x > ox && x < ox + 0.45 && y > oy && y < oy + 0.62) {
        v = 0.18 + k * 0.08;
        const ly = (y - oy) / 0.62;
        if (k === 2 && x > ox + 0.05 && x < ox + 0.4 && Math.abs((ly * 12) % 1 - 0.5) < 0.12 && ly > 0.15) v = 0.75;
        if (k === 2 && ly < 0.1 && x < ox + 0.25) v = 1;
      }
    }
    return v;
  },
};

export function DitherPlate({ kind, px = 3, className = "" }: { kind: keyof typeof plates; px?: number; className?: string }) {
  const ref = useDitherCanvas(plates[kind], px);
  return <canvas ref={ref} aria-hidden className={className} style={{ imageRendering: "pixelated" }} />;
}
