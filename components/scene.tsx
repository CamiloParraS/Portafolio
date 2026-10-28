"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { CAR_PALETTES, PAINT, carTone } from "@/lib/art";
import { type Inks, hash, hexToRgb } from "@/lib/dither";
import { DitherCanvas, type Tone } from "./dither-canvas";
import { useSite } from "./providers";

const CELL = 3;

type Car = { x: number; v: number; drag: boolean; grab: number; lastPx: number; until: number; w: number; h: number };

const carLength = (h: number) => Math.min(58, Math.max(32, h * 0.32));

// Scenery palette regions follow the car's (1-9); see paintOrdered.
const [MOUNT, HILL, SUN, SKY, ROAD] = [10, 11, 12, 13, 14];
const ink = (g: string, m: string, hi: string): Inks => [hexToRgb(g), hexToRgb(m), hexToRgb(hi)];
const DAY = [
  ink("#3a4a5c", "#6f8aa3", "#a9bfd1"), // Galeras
  ink("#1f6b3a", "#4f9a50", "#9bd06b"), // Pasto's hills
  ink("#f59e0b", "#fcd34d", "#fff3b0"), // sun
  ink("#8fcdf3", "#c3e6fa", "#ffffff"), // sky
  ink("#2b323b", "#454e5a", "#f3f4f6"), // road
];
const NIGHT = [
  ink("#0d1626", "#2a3f5c", "#4d6a8c"),
  ink("#05140c", "#0f3d22", "#1f6e3a"),
  ink("#fde68a", "#f5e9b8", "#ffffff"),
  ink("#050816", "#1a1f4d", "#c7ccff"),
  ink("#080b10", "#1b2431", "#e5e7eb"),
];
const roadOf = (h: number) => [h * 0.82, h * 0.95] as const;

/**
 * Galeras over Pasto, dithered live. The car idles on the road; drag it, tap the scene or
 * press Drive to send it off. Day and night follow the site theme.
 */
export function Scene() {
  const { t, theme } = useSite();
  const night = theme === "dark";
  const car = useRef<Car>({ x: -1, v: 0, drag: false, grab: 0, lastPx: 0, until: 0, w: 1, h: 1 });
  const wrap = useRef<HTMLDivElement>(null);
  const [version, setVersion] = useState(0);
  const palette = useMemo(() => [...CAR_PALETTES, ...(night ? NIGHT : DAY)], [night]);

  const onFrame = useCallback((time: number, w: number, h: number) => {
    const c = car.current;
    c.w = w;
    c.h = h;
    const L = carLength(h);
    if (c.x < 0 && !c.drag && c.v === 0) c.x = w * 0.16;
    if (c.drag) return;
    c.v = c.until > time ? Math.min(c.v + 0.12, 2.6) : c.v * 0.965;
    if (Math.abs(c.v) < 0.02) c.v = 0;
    c.x += c.v;
    if (c.x > w + L) c.x = -L * 2.4;
    if (c.x < -L * 2.6) c.x = w;
  }, []);

  const scenery: Tone = useCallback(
    (x, y, w, h, time) => {
      const c = car.current;
      const L = carLength(h);
      const [roadTop, roadBot] = roadOf(h);
      const base = roadTop + (roadBot - roadTop) * 0.6;

      const ct = carTone((x - c.x) / L, (base - y) / L, night, PAINT, 1.2 / L);
      if (ct >= 0) return ct;

      // Road.
      if (y >= roadTop && y <= roadBot) {
        if (y - roadTop < 1 || roadBot - y < 1) return ROAD * 2 + 0.7;
        if (Math.abs(y - (roadTop + roadBot) / 2) < 0.6 && x % 14 < 7) return ROAD * 2 + 0.95;
        return ROAD * 2 + (night ? 0.22 : 0.3);
      }
      if (y > roadBot) return HILL * 2 + (night ? 0.4 : 0.5);

      // Pasto's hills, with city lights after dark.
      const hill = h * 0.62 + h * 0.05 * Math.sin(x / (h * 0.35)) + h * 0.025 * Math.sin(x / (h * 0.11) + 1.3);
      if (y > hill) {
        const r = hash(x, y);
        if (night && y > hill + 2 && r > 0.955) return SUN * 2 + 0.6 + 0.4 * Math.sin(time * 3 + r * 90);
        if (!night && r > 0.985) return SUN * 2 + 0.95;
        return HILL * 2 + (night ? 0.5 + (y - hill) / (h * 2) : 0.66);
      }

      // Galeras, with a fumarole drifting off the crater.
      const gx = w * 0.64;
      const dx = x - gx;
      const peak = h * 0.3;
      const slope = peak + Math.abs(dx) * 0.55 + h * 0.035 * Math.exp(-((dx / (h * 0.05)) ** 2));
      if (y > slope) {
        const ridge = Math.sin(dx * 0.35 + (y - slope) * 0.25) > 0.85 ? 0.08 : 0;
        return MOUNT * 2 + (night ? 0.34 : 0.56) + (dx < 0 ? 0.1 : 0) + ridge;
      }
      const rise = peak + h * 0.03 - y;
      if (rise > 0) {
        const px = dx - rise * 0.9;
        const spread = h * 0.025 + rise * 0.22;
        const puff = Math.sin((x + time * 4) / 5) * Math.sin((y + time * 7) / 4);
        const smoke = Math.exp(-((px / spread) ** 2)) * (0.55 + 0.45 * puff) * Math.max(0, 1 - rise / (h * 0.32));
        if (smoke > 0.3) return SKY * 2 + 0.18 + smoke * 0.3;
      }

      // Sky: moon and stars at night, sun and drifting cloud by day.
      const mx = w * 0.15;
      const my = h * 0.24;
      const md = Math.hypot(x - mx, y - my);
      const r = h * 0.085;
      if (night) {
        if (md < r) return Math.hypot(x - mx - r * 0.45, y - my + r * 0.2) < r * 0.85 ? SKY * 2 + 0.12 : SKY * 2 + 1;
        if (y < h * 0.65 && hash(x, y) > 0.992) return SKY * 2 + 0.65 + 0.35 * Math.sin(time * 2 + hash(y, x) * 40);
        return SKY * 2 + 0.04 + 0.16 * (y / h) + 0.18 * Math.exp(-(md - r) / (h * 0.06));
      }
      if (md < r) return SUN * 2 + (md > r - 1.2 ? 0.95 : 0.7);
      const cloud = Math.sin((x + time * 3) / 19) + Math.sin((x * 0.6 - time * 2) / 9 + y / 5) + Math.sin(y / 3.5);
      if (y > h * 0.08 && y < h * 0.36 && cloud > 1.75) return SKY * 2 + 0.8;
      return SKY * 2 + 0.02 + 0.3 * (y / h);
    },
    [night],
  );

  // Headlights add light over whatever the beam crosses.
  const tone: Tone = useCallback(
    (x, y, w, h, time) => {
      const t0 = scenery(x, y, w, h, time);
      if (!night) return t0;
      const c = car.current;
      const L = carLength(h);
      const [roadTop, roadBot] = roadOf(h);
      const lx = (x - c.x) / L - 1;
      const ly = (roadTop + (roadBot - roadTop) * 0.6 - y) / L - 0.2;
      if (lx <= 0 || lx > 1.6 || Math.abs(ly) > lx * 0.2 + 0.03) return t0;
      const region = Math.floor(t0 / 2);
      return region * 2 + Math.min(1, t0 - region * 2 + 0.35 * (1 - lx / 1.6));
    },
    [night, scenery],
  );

  const cellAt = (e: React.PointerEvent) => {
    const box = wrap.current!.getBoundingClientRect();
    const c = car.current;
    return [((e.clientX - box.left) / box.width) * c.w, ((e.clientY - box.top) / box.height) * c.h] as const;
  };

  const onCar = (px: number, py: number) => {
    const c = car.current;
    const L = carLength(c.h);
    const [roadTop, roadBot] = roadOf(c.h);
    const base = roadTop + (roadBot - roadTop) * 0.6;
    return px >= c.x - 2 && px <= c.x + L + 2 && py >= base - L * 0.5 && py <= base + 4;
  };

  const drive = () => {
    const c = car.current;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      c.x = c.x + c.w * 0.3 > c.w ? c.w * 0.1 : c.x + c.w * 0.3;
      setVersion((n) => n + 1);
      return;
    }
    c.until = performance.now() / 1000 + 2.2;
  };

  return (
    <div
      ref={wrap}
      className="absolute inset-0 touch-pan-y select-none"
      onPointerDown={(e) => {
        const [px, py] = cellAt(e);
        const c = car.current;
        if (onCar(px, py)) {
          c.drag = true;
          c.grab = px - c.x;
          c.lastPx = px;
          wrap.current!.setPointerCapture(e.pointerId);
        } else drive();
      }}
      onPointerMove={(e) => {
        const [px, py] = cellAt(e);
        const c = car.current;
        if (c.drag) {
          c.v = px - c.lastPx;
          c.lastPx = px;
          c.x = px - c.grab;
        }
        wrap.current!.style.cursor = c.drag ? "grabbing" : onCar(px, py) ? "grab" : "pointer";
      }}
      onPointerUp={() => (car.current.drag = false)}
      onPointerCancel={() => (car.current.drag = false)}
    >
      <DitherCanvas
        key={version}
        tone={tone}
        palette={palette}
        onFrame={onFrame}
        animate
        cell={CELL}
        label={t.hero.sceneLabel.replace("{time}", night ? t.hero.night : t.hero.day)}
      />
      <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-tile/85 px-3 py-1.5 text-xs text-dim backdrop-blur-sm sm:top-4 sm:left-5">
        <span className="sm:hidden">{t.hero.dragHint}</span>
        <span className="hidden sm:inline">{t.hero.caption}</span>
      </span>
      <div className="pointer-events-none absolute right-3 bottom-3 flex items-center gap-3 sm:right-5 sm:bottom-4">
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={drive}
          className="btn btn-ghost pointer-events-auto bg-tile/85 px-3.5 py-2 text-sm backdrop-blur-sm"
        >
          {t.hero.drive}
        </button>
      </div>
    </div>
  );
}
