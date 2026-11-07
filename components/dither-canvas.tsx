"use client";

import { useEffect, useRef } from "react";
import { type Inks, paintOrdered, readInks } from "@/lib/dither";
import { useSite } from "./providers";

export type Tone = (x: number, y: number, w: number, h: number, time: number) => number;

type Props = {
  tone: Tone;
  /** CSS pixels per dither cell. */
  cell?: number;
  animate?: boolean;
  /** Runs once per frame before painting, with the grid size in cells. */
  onFrame?: (time: number, w: number, h: number) => void;
  /** Extra ink sets a tone can pick with `2 * region + t`; region 1 is `palette[0]`. */
  palette?: Inks[];
  label?: string;
  className?: string;
};

/**
 * Fills its parent with ordered-dither art. Animated art runs at ~30fps, only while on
 * screen, and stays on its first frame under reduced motion or when the visitor pauses it.
 */
export function DitherCanvas({ tone, cell = 3, animate = false, onFrame, palette, label, className = "" }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const toneRef = useRef(tone);
  const frameRef = useRef(onFrame);
  const { theme, paused } = useSite();

  useEffect(() => {
    toneRef.current = tone;
    frameRef.current = onFrame;
  });

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const inks = readInks(canvas);
    const still = !animate || paused || matchMedia("(prefers-reduced-motion: reduce)").matches;
    let img: ImageData | null = null;
    let raf = 0;
    let visible = false;
    let last = 0;

    const draw = (time: number) => {
      if (!img) return;
      const { width: w, height: h } = img;
      frameRef.current?.(time, w, h);
      paintOrdered(img, (x, y) => toneRef.current(x, y, w, h, time), inks, palette);
      ctx.putImageData(img, 0, 0);
    };

    const resize = () => {
      const box = canvas.parentElement!.getBoundingClientRect();
      const w = Math.max(1, Math.ceil(box.width / cell));
      const h = Math.max(1, Math.ceil(box.height / cell));
      if (img && img.width === w && img.height === h) return;
      canvas.width = w;
      canvas.height = h;
      img = ctx.createImageData(w, h);
      if (visible) draw(last);
    };

    // The rAF loop only exists while the canvas is on screen and the tab is visible.
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 33) return;
      last = now;
      draw(now / 1000);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const sync = () => {
      stop();
      if (visible && !still && !document.hidden) raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);
    resize();

    // Nothing is painted until the canvas is near the viewport, so below-the-fold art costs nothing up front.
    const io = new IntersectionObserver(
      ([e]) => {
        const was = visible;
        visible = e.isIntersecting;
        if (visible && !was) draw(last);
        sync();
      },
      { rootMargin: "200px" },
    );
    io.observe(canvas);
    document.addEventListener("visibilitychange", sync);

    return () => {
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      stop();
    };
  }, [animate, paused, cell, theme, palette]);

  return (
    <canvas
      ref={ref}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`pixel absolute inset-0 h-full w-full ${className}`}
    />
  );
}
