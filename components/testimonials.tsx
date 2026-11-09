"use client";

import { Quote } from "lucide-react";
import { DitherImage } from "./dither-image";
import { useSite } from "./providers";
import { Section } from "./section";

// Photos live in /public/img, keyed by position in content `testimonials.items`. Never invent testimonials.
const PHOTOS = ["/img/francisco-sinesterra.jpg", "/img/angel-sosa.jpg"];
const SLOTS = 2; // the featured tile spans two of the three columns

export function Testimonials() {
  const { t } = useSite();
  const s = t.testimonials;
  const open = Math.max(0, SLOTS - s.items.length);

  return (
    <Section id="testimonials" title={s.title} intro={s.intro}>
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        {s.items.map((q, i) => {
          const photo = PHOTOS[i];
          return (
          <figure key={q.name} className="tile grid overflow-hidden grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            {photo && <DitherImage color cover src={photo} alt={q.photoAlt} cell={3} className="photo-inks h-full min-h-44" />}
            <div className="flex flex-col p-4 sm:p-5">
              <Quote className="size-5 text-accent-ink" aria-hidden />
              <blockquote className="mt-2 text-sm leading-snug sm:text-base">{q.quote}</blockquote>
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
          <div key={i} className="flex min-h-56 flex-col rounded-[28px] border border-dashed border-line p-6 sm:p-8">
            <Quote className="slot-pulse size-6 text-line" aria-hidden />
            <p className="mt-auto font-semibold">{s.pending}</p>
            <p className="mt-1 text-dim">{s.pendingBody}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
