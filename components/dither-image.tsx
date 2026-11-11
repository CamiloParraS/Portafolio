"use client";

import { useEffect, useRef, useState } from "react";
import { paintColor, paintDiffused, readInks } from "@/lib/dither";
import { useSite } from "./providers";

type Props = {
  src: string;
  alt: string;
  cell?: number;
  /** Dither in the photo's own colours (soft), showing the original on hover; `contain` shows the whole frame on white. */
  color?: boolean;
  /** With `color`: crop to fill the frame (object-fit: cover), showing the original first and the colour dither on hover, instead of the whole photo on white. */
  cover?: boolean;
  /** With `cover`: vertical focus of the crop, 0 (top) to 1 (bottom). Keeps faces in frame. Default 0.5. */
  focusY?: number;
  /** Above-the-fold image: fetch it eagerly at high priority instead of lazily. */
  priority?: boolean;
  /** A small corner label naming what a press will show, so the swap is discoverable: [before swap, after swap]. */
  className?: string;
};

/** A real photo; hover, focus or tap swaps between the original and its dither (theme inks, or `color`). */
export function DitherImage({ src, alt, cell = 3, color = false, cover = false, focusY = 0.5, priority = false, className = "" }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const { theme } = useSite();
  // Hover or keyboard focus swaps the view; a click or tap flips whatever is showing, so it always visibly responds.
  const [hot, setHot] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const swapped = hot !== flipped;
  const cool = () => {
    setHot(false);
    setFlipped(false);
  };

  useEffect(() => {
    const canvas = ref.current!;
    const photo = new Image();
    if (src.startsWith("http")) photo.crossOrigin = "anonymous";
    let cancelled = false;

    const draw = () => {
      if (cancelled || !photo.naturalWidth) return;
      const box = canvas.parentElement!.getBoundingClientRect();
      const w = Math.max(1, Math.ceil(box.width / cell));
      const h = Math.max(1, Math.ceil(box.height / cell));
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
      // object-fit: cover, or contain on white for colour photos
      const fit = color && !cover ? Math.min : Math.max;
      const scale = fit(w / photo.naturalWidth, h / photo.naturalHeight);
      const dw = photo.naturalWidth * scale;
      const dh = photo.naturalHeight * scale;
      if (color && !cover) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, w, h);
      }
      ctx.drawImage(photo, (w - dw) / 2, (h - dh) * focusY, dw, dh);
      const px = ctx.getImageData(0, 0, w, h);
      if (color) {
        paintColor(px);
        ctx.putImageData(px, 0, 0);
        return;
      }
      const tones = new Float32Array(w * h);
      // Dark theme lights the face in cyan; light theme inks the shadows.
      const invert = theme === "light";
      let lo = 1;
      let hi = 0;
      for (let i = 0; i < tones.length; i++) {
        const lum = (0.2126 * px.data[i * 4] + 0.7152 * px.data[i * 4 + 1] + 0.0722 * px.data[i * 4 + 2]) / 255;
        tones[i] = lum;
        lo = Math.min(lo, lum);
        hi = Math.max(hi, lum);
      }
      // Stretch to the full range so pale photos still reach the deepest ink.
      const span = Math.max(0.05, hi - lo);
      for (let i = 0; i < tones.length; i++) {
        const t = Math.min(1, Math.max(0, ((tones[i] - lo) / span - 0.5) * 1.2 + 0.5));
        tones[i] = invert ? 1 - t : t;
      }
      paintDiffused(px, tones, readInks(canvas));
      ctx.putImageData(px, 0, 0);
    };

    photo.onload = draw;
    // Below-the-fold photos only start loading and dithering when they are about to show.
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      photo.src = src;
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          start();
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(canvas.parentElement!);
    const ro = new ResizeObserver(draw);
    ro.observe(canvas.parentElement!);
    return () => {
      cancelled = true;
      io.disconnect();
      ro.disconnect();
    };
  }, [src, cell, color, cover, focusY, theme]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={swapped}
      onClick={() => setFlipped((v) => !v)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setFlipped((v) => !v);
        }
      }}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHot(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && cool()}
      onFocus={(e) => e.currentTarget.matches(":focus-visible") && setHot(true)}
      onBlur={cool}
      className={`relative cursor-pointer overflow-hidden ${className}`}
    >
      <canvas ref={ref} aria-hidden className="pixel absolute inset-0 h-full w-full" />
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, no image optimizer */}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        style={cover ? { objectPosition: `50% ${focusY * 100}%` } : undefined}
        className={`absolute inset-0 h-full w-full transition-opacity duration-200 ease-out ${
          color && !cover ? `object-contain ${swapped ? "opacity-100" : "opacity-0"}` : `object-cover ${swapped ? "opacity-0" : "opacity-100"}`
        }`}
      />
    </div>
  );
}
