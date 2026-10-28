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
 * screen, and stays on its first frame under reduced motion.
 */
export function DitherCanvas({ tone, cell = 3, animate = false, onFrame, palette, label, className = "" }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const toneRef = useRef(tone);
  const frameRef = useRef(onFrame);
  const { theme } = useSite();

  useEffect(() => {
    toneRef.current = tone;
    frameRef.current = onFrame;
  });

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const inks = readInks(canvas);
    const still = !animate || matchMedia("(prefers-reduced-motion: reduce)").matches;
    let img: ImageData | null = null;
    let raf = 0;
    let visible = true;
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
      draw(last);
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden || now - last < 33) return;
      last = now;
      draw(now / 1000);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);
    resize();

    let io: IntersectionObserver | undefined;
    if (!still) {
      io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
      io.observe(canvas);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      ro.disconnect();
      io?.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [animate, cell, theme, palette]);

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
