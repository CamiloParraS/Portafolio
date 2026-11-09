"use client";

import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DitherImage } from "./dither-image";
import { useSite } from "./providers";
import { Section } from "./section";

// Photos live in /public/img, keyed by position in content `testimonials.items`. Never invent testimonials.
const PHOTOS = ["/img/francisco-sinesterra.jpg", "/img/angel-sosa.jpg", "/img/miguel-urbano.jpg"];
const SLOTS = 3; // one row of three on large screens; fewer items keep the same row

/**
 * Testimonials sit in one row. On large screens all of them fit side by side; when they don't
 * (small screens, or more items than fit), the same row scrolls with snap points and arrows.
 */
export function Testimonials() {
  const { t } = useSite();
  const s = t.testimonials;
  const open = Math.max(0, SLOTS - s.items.length);
  const track = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(false);
  const [edges, setEdges] = useState({ start: true, end: true });

  useEffect(() => {
    const el = track.current!;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setOverflow(max > 4);
      setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft >= max - 4 });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [s.items.length]);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | undefined;
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: reduced ? "auto" : "smooth" });
  };

  const arrow = "btn btn-ghost grid size-8 place-items-center p-0 pointer-coarse:size-10 disabled:opacity-35";

  return (
    <Section id="testimonials" title={s.title} intro={s.intro}>
      <div role="region" aria-roledescription="carousel" aria-label={s.title}>
        <div
          ref={track}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-1 sm:gap-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {s.items.map((q, i) => {
            const photo = PHOTOS[i];
            return (
              <figure
                key={q.name}
                className="tile grid min-w-0 shrink-0 snap-start overflow-hidden grid-cols-[minmax(0,1fr)_minmax(0,2fr)] basis-[86%] sm:basis-[calc((100%-1rem)/2)] lg:basis-[calc((100%-2rem)/3)]"
              >
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
              key={i}
              className="flex min-h-56 min-w-0 shrink-0 snap-start flex-col rounded-[28px] border border-dashed border-line p-6 sm:p-8 basis-[86%] sm:basis-[calc((100%-1rem)/2)] lg:basis-[calc((100%-2rem)/3)]"
            >
              <Quote className="slot-pulse size-6 text-line" aria-hidden />
              <p className="mt-auto font-semibold">{s.pending}</p>
              <p className="mt-1 text-dim">{s.pendingBody}</p>
            </div>
          ))}
        </div>
        {overflow && (
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" className={arrow} aria-label={s.prev} disabled={edges.start} onClick={() => go(-1)}>
              <ChevronLeft className="size-4" aria-hidden />
            </button>
            <button type="button" className={arrow} aria-label={s.next} disabled={edges.end} onClick={() => go(1)}>
              <ChevronRight className="size-4" aria-hidden />
            </button>
          </div>
        )}
      </div>
    </Section>
  );
}
