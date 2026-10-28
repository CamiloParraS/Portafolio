"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { readColor, useSite } from "./providers";

const W = 320;
const H = 180;
const HORIZON = 78;
const B4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

const curveAt = (z: number) => Math.sin(z * 0.004) * 0.7 + Math.sin(z * 0.0013 + 1) * 0.5;

/** A pseudo-3D road at midnight, dithered into the site's three tones. */
export function NightDrive() {
  const { t } = useSite();
  const canvas = useRef<HTMLCanvasElement>(null);
  const [running, setRunning] = useState(false);
  const [hud, setHud] = useState({ kmh: 0, km: 0 });
  const state = useRef({ pos: 0, speed: 0.6, x: 0, steer: 0, gas: false });

  useEffect(() => {
    const ctx = canvas.current!.getContext("2d")!;
    const img = ctx.createImageData(W, H);
    let tones = [readColor("--ground"), readColor("--deep"), readColor("--accent")];
    const mo = new MutationObserver(() => {
      tones = [readColor("--ground"), readColor("--deep"), readColor("--accent")];
      draw();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const put = (x: number, y: number, lum: number) => {
      const th = B4[(y & 3) * 4 + (x & 3)];
      const v = Math.max(0, Math.min(1, lum)) * 2;
      const c = v < 1 ? tones[v > th ? 1 : 0] : tones[v - 1 > th ? 2 : 1];
      const i = (y * W + x) * 4;
      img.data[i] = c[0];
      img.data[i + 1] = c[1];
      img.data[i + 2] = c[2];
      img.data[i + 3] = 255;
    };

    function draw() {
      const s = state.current;
      const bend = curveAt(s.pos + 400);
      for (let y = 0; y < HORIZON; y++)
        for (let x = 0; x < W; x++) {
          const mx = 250 - bend * 40;
          const d = Math.hypot(x - mx, y - 34);
          let lum = d < 16 ? 0.9 : 0.45 * Math.exp(-(d - 16) / 22);
          lum += (y / HORIZON) * 0.12;
          if (((x * 7919 + y * 104729) % 997) === 0) lum = 1;
          put(x, y, lum);
        }
      for (let y = HORIZON; y < H; y++) {
        const p = (y - HORIZON) / (H - HORIZON); // 0 at horizon, 1 at the bumper
        const z = 1 / (p + 0.02);
        const wz = s.pos + z * 14;
        const center = W / 2 + curveAt(wz) * (1 - p) ** 2 * W * 0.7 - s.x * W * 0.45 * p;
        const half = W * 0.48 * p + 1;
        const band = Math.floor(wz / 7) & 1;
        const fog = 0.25 + 0.75 * p;
        for (let x = 0; x < W; x++) {
          const dx = Math.abs(x - center);
          let lum: number;
          if (dx < half) {
            lum = 0.32;
            if (dx > half * 0.88) lum = band ? 0.95 : 0.4;
            else if (dx < half * 0.025 + 0.5 && band) lum = 1.1;
            lum += 0.35 * Math.exp(-((x - W / 2) ** 2) / 900 - (1 - p) * 6); // headlights
          } else lum = band ? 0.16 : 0.08;
          put(x, y, lum * fog);
        }
      }
      ctx.putImageData(img, 0, 0);
      // The car, from behind: body, cabin, taillights.
      const [g, d, a] = tones.map((c) => `rgb(${c})`);
      const cx = W / 2 + s.steer * 3;
      ctx.fillStyle = d;
      ctx.fillRect(cx - 26, H - 26, 52, 16);
      ctx.fillRect(cx - 18, H - 36, 36, 11);
      ctx.fillStyle = g;
      ctx.fillRect(cx - 15, H - 34, 30, 7);
      ctx.fillRect(cx - 24, H - 10, 10, 6);
      ctx.fillRect(cx + 14, H - 10, 10, 6);
      ctx.fillStyle = a;
      ctx.fillRect(cx - 24, H - 22, 10, 4);
      ctx.fillRect(cx + 14, H - 22, 10, 4);
    }

    draw();
    if (!running) return () => mo.disconnect();

    const s0 = state.current;
    let raf = 0;
    let km = 0;
    let frame = 0;
    const loop = () => {
      const s = state.current;
      s.speed = s.gas ? Math.min(s.speed + 0.03, 4.2) : Math.max(s.speed - 0.01, 0.6);
      s.x += s.steer * 0.035 * Math.min(s.speed, 2) - curveAt(s.pos + 200) * 0.006 * s.speed;
      if (Math.abs(s.x) > 1.05) s.speed *= 0.95; // gravel
      s.x = Math.max(-1.6, Math.min(1.6, s.x));
      s.pos += s.speed * 6;
      km += s.speed * 0.0004;
      draw();
      if (++frame % 6 === 0) setHud({ kmh: Math.round(s.speed * 52), km: Math.round(km * 10) / 10 });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const keys = (e: KeyboardEvent, down: boolean) => {
      const k = e.key.toLowerCase();
      const s = state.current;
      if (["arrowleft", "a"].includes(k)) s.steer = down ? -1 : 0;
      else if (["arrowright", "d"].includes(k)) s.steer = down ? 1 : 0;
      else if (["arrowup", "w"].includes(k)) s.gas = down;
      else return;
      e.preventDefault();
    };
    const kd = (e: KeyboardEvent) => keys(e, true);
    const ku = (e: KeyboardEvent) => keys(e, false);
    addEventListener("keydown", kd);
    addEventListener("keyup", ku);
    // Stop when it scrolls away so it never burns frames offscreen.
    const io = new IntersectionObserver(([e]) => !e.isIntersecting && setRunning(false));
    io.observe(canvas.current!);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("keydown", kd);
      removeEventListener("keyup", ku);
      io.disconnect();
      mo.disconnect();
      s0.steer = 0;
      s0.gas = false;
    };
  }, [running]);

  const touch = (e: React.PointerEvent<HTMLCanvasElement>, down: boolean) => {
    if (!running) return;
    const r = e.currentTarget.getBoundingClientRect();
    state.current.steer = down ? (e.clientX - r.left < r.width / 2 ? -1 : 1) : 0;
    state.current.gas = down;
  };

  return (
    <div>
      <div className="relative bg-deep">
        <canvas
          ref={canvas}
          width={W}
          height={H}
          aria-label={t.after.drive}
          role="img"
          className="block aspect-video w-full touch-none select-none"
          style={{ imageRendering: "pixelated" }}
          onPointerDown={(e) => touch(e, true)}
          onPointerUp={(e) => touch(e, false)}
          onPointerLeave={(e) => touch(e, false)}
        />
        <div className="mono pointer-events-none absolute left-4 top-3 flex gap-6 text-sm text-ink">
          <span>
            <span className="text-2xl tabular-nums">{hud.kmh}</span> {t.after.speed}
          </span>
          <span>
            <span className="text-2xl tabular-nums">{hud.km.toFixed(1)}</span> {t.after.distance}
          </span>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className="blade inline-flex items-center gap-2 bg-accent px-6 py-2 font-semibold text-on-accent transition-colors duration-300 hover:bg-ink hover:text-ground"
        >
          {running ? <Pause className="size-4" /> : <Play className="size-4" />}
          {running ? t.after.stop : t.after.start}
        </button>
        <p className="text-sm text-ink-dim">{t.after.driveHelp}</p>
      </div>
    </div>
  );
}
