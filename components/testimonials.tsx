"use client";

import { useState } from "react";
import { Languages, Quote } from "lucide-react";
import { DitherImage } from "./dither-image";
import { useSite } from "./providers";
import { Section } from "./section";

/**
 * Photos live in /public/img, keyed by the person's `name` exactly as written in content `testimonials.items`
 * (same in en.ts and es.ts). `focusY` is where the face sits in the photo, 0 (top) to 1 (bottom): raise it if the
 * crop cuts off a chin, lower it if it cuts off a forehead. A person with no entry gets initials-free text only.
 * Never invent testimonials.
 */
const PHOTOS: Record<string, { src: string; focusY: number }> = {
  "Francisco Sinisterra": { src: "/img/francisco-sinesterra.jpg", focusY: 0.3 },
  "Angel Sosa": { src: "/img/angel-sosa.jpg", focusY: 0.3 },
  "Miguel Alejandro Urbano": { src: "/img/miguel-urbano.jpg", focusY: 0.45 },
  "Ivonne Barco": { src: "/img/ivonne-barco.jpg", focusY: 0.4 },
};
const SLOTS = 3; // a pending card fills any slot left open

type Item = ReturnType<typeof useSite>["t"]["testimonials"]["items"][number];

/** Quote first, person last: the portrait is a small signature, not the card's hero. */
function Card({ q }: { q: Item }) {
  const { t } = useSite();
  const s = t.testimonials;
  const [showOriginal, setShowOriginal] = useState(false);
  const photo = PHOTOS[q.name];
  // Only the English site carries a translation; the Spanish site already shows the original.
  const hasOriginal = Boolean(q.original);
  const original = hasOriginal && showOriginal;

  return (
    <figure className="tile flex flex-col p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <Quote className="size-6 text-accent-ink" aria-hidden />
        {hasOriginal && (
          <button
            type="button"
            aria-pressed={showOriginal}
            onClick={() => setShowOriginal((v) => !v)}
            className="chip -mt-1 -mr-1 inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-semibold text-dim focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink aria-pressed:border-accent-ink aria-pressed:text-accent-ink"
          >
            <Languages className="size-3.5" aria-hidden />
            {showOriginal ? s.showTranslation : s.showOriginal}
          </button>
        )}
      </div>
      <blockquote
        lang={original ? "es" : undefined}
        className="mt-4 mb-6 text-pretty text-[1.0625rem] leading-relaxed"
      >
        {original ? q.original : q.quote}
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-3 border-t border-line pt-5 text-sm">
        {photo && (
          <DitherImage
            color
            cover
            cell={2}
            focusY={photo.focusY}
            src={photo.src}
            alt={q.photoAlt}
            className="photo-inks size-12 shrink-0 rounded-full"
          />
        )}
        <span className="min-w-0">
          <span className="block font-semibold">{q.name}</span>
          <span className="text-dim">{q.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

/** A static grid: quotes are meant to be read, so nothing moves. Exactly four cards make a 2×2, otherwise three across. */
export function Testimonials() {
  const { t } = useSite();
  const s = t.testimonials;
  const open = Math.max(0, SLOTS - s.items.length);
  const twoByTwo = s.items.length + open === 4;

  return (
    <Section id="testimonials" title={s.title} intro={s.intro}>
      <div className={`grid gap-3 sm:gap-4 ${twoByTwo ? "lg:grid-cols-2" : "lg:grid-cols-3"}`}>
        {s.items.map((q) => (
          <Card key={q.name} q={q} />
        ))}
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
