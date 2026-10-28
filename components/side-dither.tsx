"use client";

import { hash } from "@/lib/dither";
import { DitherCanvas, type Tone } from "./dither-canvas";

// Broken scan bars, densest at the screen edge and gone by the time they reach the tiles.
// Each band breathes on its own slow phase, so the pattern drifts instead of sitting still.
const bars =
  (flip: boolean): Tone =>
  (x, y, w, _h, time) => {
    const u = (flip ? w - 1 - x : x) / w;
    const band = Math.floor(y / 7);
    const amp = 0.5 + 0.5 * Math.sin(time * 0.45 + band * 0.35 + hash(band, 3) * 6.28);
    return (1 - u) ** 1.6 * (0.01 + 0.1 * amp * amp);
  };

const left = bars(false);
const right = bars(true);

/** Faint dither in the page gutters, so wide screens don't read as empty. Hidden once there is no gutter. */
export function SideDither() {
  const strip = "absolute inset-y-0 w-[calc((100%-72rem)/2)]";
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 hidden [--dither-ground:var(--ground)] min-[1380px]:block">
      <div className={`${strip} left-0`}>
        <DitherCanvas tone={left} cell={4} animate />
      </div>
      <div className={`${strip} right-0`}>
        <DitherCanvas tone={right} cell={4} animate />
      </div>
    </div>
  );
}
