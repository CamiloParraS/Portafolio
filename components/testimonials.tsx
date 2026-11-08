"use client";

import { Quote } from "lucide-react";
import { DitherImage } from "./dither-image";
import { useSite } from "./providers";
import { Section } from "./section";

// Photos live in /public/img, keyed by position in content `testimonials.items`. Never invent testimonials.
const PHOTOS = ["/img/francisco-sinesterra.jpg"];
const SLOTS = 2; // the featured tile spans two of the three columns

export function Testimonials() {
  const { t } = useSite();
  const s = t.testimonials;
  const open = Math.max(0, SLOTS - s.items.length);

  return (
    <Section id="testimonials" title={s.title} intro={s.intro}>
      <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
        {s.items.map((q, i) => (
          <figure key={q.name} className="tile grid overflow-hidden sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:col-span-2">
            <DitherImage color cover src={PHOTOS[i]} alt={q.photoAlt} cell={3} className="photo-inks aspect-square sm:aspect-auto sm:min-h-72" />
            <div className="flex flex-col p-6 sm:p-8">
              <Quote className="size-6 text-accent-ink" aria-hidden />
              <blockquote className="mt-4 text-xl leading-snug sm:text-2xl">{q.quote}</blockquote>
              {q.original && (
                <p className="mt-4 text-sm text-dim">
                  <span className="font-semibold">{q.translated}: </span>
                  <span lang="es">&ldquo;{q.original}&rdquo;</span>
                </p>
              )}
              <figcaption className="mt-auto pt-6">
                <span className="block font-semibold">{q.name}</span>
                <span className="text-dim">{q.role}</span>
              </figcaption>
            </div>
          </figure>
        ))}
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
