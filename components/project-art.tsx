"use client";

import { projectArt } from "@/lib/art";
import type { ArtId } from "@/lib/content";
import { DitherCanvas } from "./dither-canvas";

/** A project's procedural illustration, filling its (relatively positioned) parent. */
export function ProjectArt({ id, cell = 3 }: { id: ArtId; cell?: number }) {
  const art = projectArt[id];
  return <DitherCanvas tone={(x, y, w, h) => art(x, y, w, h)} cell={cell} />;
}
