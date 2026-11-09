"use client";

import { Pause, Play, Quote } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { DitherImage } from "./dither-image";
import { useSite } from "./providers";
import { Section } from "./section";

// Photos live in /public/img, keyed by position in content `testimonials.items`. Never invent testimonials.
const PHOTOS = ["/img/francisco-sinesterra.jpg", "/img/angel-sosa.jpg", "/img/miguel-urbano.jpg"];
const SLOTS = 3; // a pending card fills any slot left open
const GAP = 16; // px, matches gap-4
const SPEED = 36; // px per second the ring travels

const slide =
  "grid shrink-0 snap-start grid-cols-[minmax(0,1fr)_minmax(0,2fr)] overflow-hidden tile";

// Edges fade smoothly to transparent over FADE % of the width on each side.
const EDGE_MASK = "linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)";

const reducedMotion = (notify: () => void) => {
  const mq = matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", notify);
  return () => mq.removeEventListener("change", notify);
};

/**
 * Testimonials run as an endless ring, like the off-code section but never stopping: the set is written twice and the
 * track moves by exactly one set, so the last card flows straight into the first. It pauses on hover or focus and on its
 * pause button. Under reduced motion the ring stands still and the row scrolls by hand.
 */
export function Testimonials() {
  const { t } = useSite();
  const s = t.testimonials;
  const open = Math.max(0, SLOTS - s.items.length);
  const region = useRef<HTMLDivElement>(null);
  const [cardW, setCardW] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reduced = useSyncExternalStore(reducedMotion, () => matchMedia("(prefers-reduced-motion: reduce)").matches, () => false);

  // Two cards per view on desktop, one and a peek on phones; re-measured when the frame changes size.
  useEffect(() => {
    const el = region.current!;
    const measure = () => {
      const w = el.clientWidth;
      const twoUp = matchMedia("(min-width: 768px)").matches;
      setCardW(twoUp ? (w - GAP) / 2 : Math.round(w * 0.86));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const n = s.items.length + open;
  const setWidth = n * (cardW + GAP); // one full set, trailing gap included, so the second set starts where the first ends
  const paused = !playing || hovered || focused;
  const animate = !reduced && cardW > 0;

  const cards = (
    <>
      {s.items.map((q, i) => {
        const photo = PHOTOS[i];
        return (
          <figure key={q.name} style={{ width: cardW }} className={slide}>
            {photo && <DitherImage color cover focusY={0.3} src={photo} alt={q.photoAlt} cell={3} className="photo-inks h-full min-h-44" />}
            <div className="flex flex-col p-4 sm:p-5">
              <Quote className="size-5 text-accent-ink" aria-hidden />
              <blockquote className="mt-2 text-[0.8125rem] leading-snug sm:text-sm">{q.quote}</blockquote>
              {q.original && (
                <p className="mt-2 text-xs text-dim">
                  <span className="font-semibold">{q.translated}: </span>
                  <span lang="es">&ldquo;{q.original}&rdquo;</span>
                </p>
              )}
              <figcaption className="mt-auto pt-4 text-sm">
                <span className="block font-semibold">{q.name}</span>
                <span className="text-dim">{q.role}</span>
              </figcaption>
            </div>
          </figure>
        );
      })}
      {Array.from({ length: open }, (_, i) => (
        <div
          key={`pending-${i}`}
          style={{ width: cardW }}
          className="flex min-h-56 shrink-0 snap-start flex-col rounded-[28px] border border-dashed border-line p-6 sm:p-8"
        >
          <Quote className="slot-pulse size-6 text-line" aria-hidden />
          <p className="mt-auto font-semibold">{s.pending}</p>
          <p className="mt-1 text-dim">{s.pendingBody}</p>
        </div>
      ))}
    </>
  );

  return (
    <Section id="testimonials" title={s.title} intro={s.intro}>
      <div
        ref={region}
        role="region"
        aria-roledescription="carousel"
        aria-label={s.title}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
        }}
      >
        {!reduced && (
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              className="btn btn-ghost grid size-8 place-items-center p-0 pointer-coarse:size-10"
              aria-label={playing ? s.pause : s.play}
              aria-pressed={!playing}
              onClick={() => setPlaying((p) => !p)}
            >
              {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
            </button>
          </div>
        )}
        <div
          className={reduced ? "snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" : "overflow-hidden"}
          style={{ maskImage: EDGE_MASK, WebkitMaskImage: EDGE_MASK }}
          tabIndex={reduced ? 0 : undefined}
        >
          <div
            className="flex w-max gap-4"
            style={
              animate
                ? {
                    animation: `testimonial-marquee ${setWidth / SPEED}s linear infinite`,
                    animationPlayState: paused ? "paused" : "running",
                  }
                : undefined
            }
          >
            <div className="flex shrink-0 gap-4">{cards}</div>
            <div className="flex shrink-0 gap-4" aria-hidden inert>
              {cards}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
