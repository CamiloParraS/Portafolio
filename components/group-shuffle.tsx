"use client";

import { useEffect, useState } from "react";
import { DitherImage } from "./dither-image";

const SRCS = ["/img/group-perficient.jpg", "/img/group-cit.jpg", "/img/group-guatape.jpg"];
const INTERVAL = 4500;

function shuffled(): number[] {
  const a = SRCS.map((_, i) => i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Group photos that crossfade in a random order. Server and first render use the fixed order; the shuffle runs on mount. */
export function GroupShuffle({ alts }: { alts: readonly string[] }) {
  const [order, setOrder] = useState<number[]>(() => SRCS.map((_, i) => i));
  const [pos, setPos] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setOrder(shuffled()));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setPos((p) => (p + 1) % SRCS.length), INTERVAL);
    return () => clearInterval(id);
  }, []);

  const current = order[pos];
  return (
    <>
      {SRCS.map((src, i) => (
        <div key={src} className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0"}`} aria-hidden={i !== current}>
          <DitherImage color cover src={src} alt={alts[i] ?? ""} className="photo-inks size-full" />
        </div>
      ))}
    </>
  );
}
