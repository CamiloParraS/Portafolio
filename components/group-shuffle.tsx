"use client";

import { useEffect, useRef, useState } from "react";
import { DitherImage } from "./dither-image";

const SRCS = ["/img/group-perficient.jpg", "/img/group-cit.jpg", "/img/group-guatape.jpg"];
const INTERVAL = 7000;

function shuffled(): number[] {
  const a = SRCS.map((_, i) => i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Group photos that crossfade in a random order. Server and first render use the fixed order; the shuffle runs on mount.
 * It only advances while on screen, with the tab visible, and with no pointer or focus on it, so it never swaps a photo
 * out from under someone looking at (or flipping) it. Hidden slides are inert: not clickable, not focusable.
 */
export function GroupShuffle({ alts }: { alts: readonly string[] }) {
  const host = useRef<HTMLDivElement>(null);
  const [order, setOrder] = useState<number[]>(() => SRCS.map((_, i) => i));
  const [pos, setPos] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setOrder(shuffled()));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const el = host.current!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = false;
    let hovered = false;
    let focused = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const enter = () => (hovered = true);
    const leave = () => (hovered = false);
    const focusIn = () => (focused = true);
    const focusOut = (e: FocusEvent) => (focused = el.contains(e.relatedTarget as Node | null));
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("focusin", focusIn);
    el.addEventListener("focusout", focusOut);
    const id = setInterval(() => {
      if (visible && !hovered && !focused && !document.hidden) setPos((p) => (p + 1) % SRCS.length);
    }, INTERVAL);
    return () => {
      clearInterval(id);
      io.disconnect();
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("focusin", focusIn);
      el.removeEventListener("focusout", focusOut);
    };
  }, []);

  const current = order[pos];
  return (
    <div ref={host} className="absolute inset-0">
      {SRCS.map((src, i) => {
        const shown = i === current;
        return (
          <div
            key={src}
            inert={!shown}
            className={`absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] motion-reduce:transition-none ${shown ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <DitherImage color cover src={src} alt={alts[i] ?? ""} className="photo-inks size-full" />
          </div>
        );
      })}
    </div>
  );
}
