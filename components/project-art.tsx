"use client";

import { projectArt } from "@/lib/art";
import type { ArtId } from "@/lib/content";
import { DitherCanvas } from "./dither-canvas";

/**
 * A project's procedural illustration, filling its (relatively positioned) parent. While the
 * enclosing `[data-art-host]` is hovered or focused, a soft diagonal highlight sweeps across it.
 */
export function ProjectArt({ id, cell = 3 }: { id: ArtId; cell?: number }) {
  const art = projectArt[id];
  return (
    <DitherCanvas
      hover
      tone={(x, y, w, h, time) => {
        const base = art(x, y, w, h);
        if (!time) return base;
        const pos = ((time * 0.3) % 1.6) - 0.3; // band centre, in tile widths, across the diagonal
        const d = Math.abs((x + y * 0.5) / (w + h * 0.5) - pos);
        return d < 0.05 ? Math.min(1, base + 0.12 * (1 - d / 0.05)) : base;
      }}
      cell={cell}
      className={`ink-${id}`}
    />
  );
}
