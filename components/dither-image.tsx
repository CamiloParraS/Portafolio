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
  className?: string;
};

/** A real photo; hover, focus or tap swaps between the original and its dither (theme inks, or `color`). */
export function DitherImage({ src, alt, cell = 3, color = false, className = "" }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const { theme } = useSite();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const canvas = ref.current!;
    const photo = new Image();
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
      const fit = color ? Math.min : Math.max;
      const scale = fit(w / photo.naturalWidth, h / photo.naturalHeight);
      const dw = photo.naturalWidth * scale;
      const dh = photo.naturalHeight * scale;
      if (color) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, w, h);
      }
      ctx.drawImage(photo, (w - dw) / 2, (h - dh) / 2, dw, dh);
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
    photo.src = src;
    const ro = new ResizeObserver(draw);
    ro.observe(canvas.parentElement!);
    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, [src, cell, color, theme]);

  return (
    <div
      tabIndex={0}
      onClick={() => setShown((v) => !v)}
      className={`group relative cursor-pointer overflow-hidden ${className}`}
    >
      <canvas ref={ref} aria-hidden className="pixel absolute inset-0 h-full w-full" />
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, no image optimizer */}
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 h-full w-full transition-opacity duration-500 ease-out ${
          color
            ? `object-contain group-hover:opacity-100 group-focus-visible:opacity-100 ${shown ? "opacity-100" : "opacity-0"}`
            : `object-cover group-hover:opacity-0 group-focus-visible:opacity-0 ${shown ? "opacity-0" : "opacity-100"}`
        }`}
      />
    </div>
  );
}
