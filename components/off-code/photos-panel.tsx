"use client";

import { useEffect, useState } from "react";
import { DitherImage } from "../dither-image";
import { useSite } from "../providers";

// Drop photos in public/img/ and add them here, in the same order as content `offcode.more.photoAlts`.
// `wide: true` marks a landscape original that may fill a full-width frame; the rest are square crops.
const photos = [
  { src: "/img/gallery-renault-meetup.jpg", wide: true },
  { src: "/img/gallery-beetle.jpg", wide: true },
  { src: "/img/gallery-cat.jpg", wide: true },
  { src: "/img/gallery-mustang-mach1.jpg", wide: false },
  { src: "/img/gallery-rally-fiesta.jpg", wide: false },
  { src: "/img/gallery-dodge-ram.jpg", wide: false },
  { src: "/img/gallery-mitsubishi-3000gt.jpg", wide: false },
  { src: "/img/gallery-nissan-300zx.jpg", wide: false },
  { src: "/img/gallery-propeller-cap.jpg", wide: false },
  { src: "/img/gallery-hot-wheels.jpg", wide: true },
].map((p, alt) => ({ ...p, alt }));

type Photo = (typeof photos)[number];

function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Random order, but the wide frames (first, and last when the count is even) only ever get landscape photos. */
function shuffled(): Photo[] {
  const landscape = shuffle(photos.filter((p) => p.wide));
  const ends = photos.length % 2 === 0 ? 2 : 1;
  const middle = shuffle([...landscape.slice(ends), ...photos.filter((p) => !p.wide)]);
  return ends === 2 ? [landscape[0], ...middle, landscape[1]] : [landscape[0], ...middle];
}

export function PhotosPanel() {
  const { t } = useSite();
  const m = t.offcode.more;
  // Server and first client render keep the fixed order (no hydration mismatch); the shuffle runs once on mount.
  const [order, setOrder] = useState<Photo[]>(photos);
  useEffect(() => {
    const id = requestAnimationFrame(() => setOrder(shuffled()));
    return () => cancelAnimationFrame(id);
  }, []);

  // The first photo runs wide; with an even count the last does too, so the squares always pair up.
  const wide = (i: number) => i === 0 || (order.length % 2 === 0 && i === order.length - 1);
  return (
    <>
      <h3 className="text-3xl font-bold tracking-tight">{m.photosTitle}</h3>
      <p className="mt-2 text-dim">{m.photosBody}</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {order.map((p, i) => (
          <div key={p.src} className={`overflow-hidden rounded-2xl ${wide(i) ? "col-span-2 aspect-video" : "aspect-square"}`}>
            <div className="zoom size-full">
              <DitherImage src={p.src} alt={m.photoAlts[p.alt] ?? ""} color cover cell={2} className="size-full" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
