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
  /** Frame-rate cap for running art; slow-moving art can go well below the default. */
  fps?: number;
  /** Runs only while the nearest `[data-art-host]` ancestor is hovered or focused; time is 0 when idle. */
  hover?: boolean;
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
export function DitherCanvas({ tone, cell = 3, animate = false, fps = 30, hover = false, onFrame, palette, label, className = "" }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const toneRef = useRef(tone);
  const frameRef = useRef(onFrame);
  // Survives the effect re-running on a theme change, so visible art repaints at once instead of going blank.
  const onScreen = useRef(false);
  const { theme, paused } = useSite();

  useEffect(() => {
    toneRef.current = tone;
    frameRef.current = onFrame;
  });

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const inks = readInks(canvas);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const host = hover ? canvas.closest<HTMLElement>("[data-art-host]") : null;
    let hot = false;
    const runs = () => !paused && !reduced && (animate || (hot && !!host));
    let img: ImageData | null = null;
    let raf = 0;
    let visible = onScreen.current;
    let last = 0;
    const interval = 1000 / fps - 1;

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
      if (visible) draw(last / 1000);
    };

    // The rAF loop only exists while the canvas is on screen and the tab is visible.
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < interval) return;
      last = now;
      draw(now / 1000);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const sync = () => {
      stop();
      if (visible && runs() && !document.hidden) raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);
    resize();

    // Nothing is painted until the canvas is near the viewport, so below-the-fold art costs nothing up front.
    const io = new IntersectionObserver(
      ([e]) => {
        const was = visible;
        visible = onScreen.current = e.isIntersecting;
        if (visible && !was) draw(last / 1000);
        sync();
      },
      { rootMargin: "200px" },
    );
    io.observe(canvas);
    document.addEventListener("visibilitychange", sync);

    const warm = () => {
      hot = true;
      sync();
    };
    const cool = () => {
      hot = false;
      last = 0;
      if (visible) draw(0);
      sync();
    };
    host?.addEventListener("pointerenter", warm);
    host?.addEventListener("pointerleave", cool);
    host?.addEventListener("focusin", warm);
    host?.addEventListener("focusout", cool);

    return () => {
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      host?.removeEventListener("pointerenter", warm);
      host?.removeEventListener("pointerleave", cool);
      host?.removeEventListener("focusin", warm);
      host?.removeEventListener("focusout", cool);
      stop();
    };
  }, [animate, fps, hover, paused, cell, theme, palette]);

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
