"use client";

import { Quote } from "lucide-react";
import { DitherImage } from "./dither-image";
import { useSite } from "./providers";
import { Section } from "./section";

/**
 * Photos live in /public/img, keyed by the person's `name` exactly as written in content `testimonials.items`
 * (same in en.ts and es.ts). `focusY` is where the face sits in the photo, 0 (top) to 1 (bottom): raise it if the
 * crop cuts off a chin, lower it if it cuts off a forehead. A person with no entry gets a text-only card.
 * Never invent testimonials.
 */
const PHOTOS: Record<string, { src: string; focusY: number }> = {
  "Francisco Sinisterra": { src: "/img/francisco-sinesterra.jpg", focusY: 0.3 },
  "Angel Sosa": { src: "/img/angel-sosa.jpg", focusY: 0.3 },
  "Miguel Alejandro Urbano": { src: "/img/miguel-urbano.jpg", focusY: 0.45 },
};
const SLOTS = 3; // a pending card fills any slot left open

/**
 * A static grid: quotes are meant to be read, so nothing moves. Three or more cards: photo-left below `lg`,
 * photo-on-top in three columns from `lg` up. Exactly four: a 2×2 grid that keeps the photo-left layout, so no card
 * is left alone on its row.
 */
export function Testimonials() {
  const { t } = useSite();
  const s = t.testimonials;
  const open = Math.max(0, SLOTS - s.items.length);
  const twoByTwo = s.items.length + open === 4;

  return (
    <Section id="testimonials" title={s.title} intro={s.intro}>
      <div className={`grid gap-3 sm:gap-4 ${twoByTwo ? "lg:grid-cols-2" : "lg:grid-cols-3"}`}>
        {s.items.map((q) => {
          const photo = PHOTOS[q.name];
          return (
            <figure
              key={q.name}
              className={`tile grid overflow-hidden ${photo ? "sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]" : ""} ${twoByTwo ? "" : "lg:grid-cols-1 lg:grid-rows-[auto_1fr]"}`}
            >
              {photo && (
                <DitherImage
                  color
                  cover
                  focusY={photo.focusY}
                  src={photo.src}
                  alt={q.photoAlt}
                  className={`photo-inks h-64 sm:h-full sm:min-h-56 ${twoByTwo ? "" : "lg:aspect-[4/3] lg:h-auto lg:min-h-0"}`}
                />
              )}
              <div className="flex flex-col p-5 sm:p-6">
                <Quote className="size-5 text-accent-ink" aria-hidden />
                <blockquote className="mt-3 leading-relaxed">{q.quote}</blockquote>
                {q.original && (
                  <p className="mt-3 text-sm leading-relaxed text-dim">
                    <span className="font-semibold">{q.translated}: </span>
                    <span lang="es">&ldquo;{q.original}&rdquo;</span>
                  </p>
                )}
                <figcaption className="mt-auto pt-5 text-sm">
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
            className="flex min-h-56 flex-col rounded-[28px] border border-dashed border-line p-6 sm:p-8"
          >
            <Quote className="slot-pulse size-6 text-line" aria-hidden />
            <p className="mt-auto font-semibold">{s.pending}</p>
            <p className="mt-1 text-dim">{s.pendingBody}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
