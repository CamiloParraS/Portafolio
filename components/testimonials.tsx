"use client";

import { Quote } from "lucide-react";
import { useSite } from "./providers";
import { Section } from "./section";

// Real testimonials go here when they arrive: { quote, name, role }. Never invent them.
const testimonials: { quote: string; name: string; role: string }[] = [];
const SLOTS = 3;

export function Testimonials() {
  const { t } = useSite();
  const s = t.testimonials;

  return (
    <Section id="testimonials" title={s.title} intro={s.intro}>
      <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
        {testimonials.map((q) => (
          <figure key={q.name} className="tile flex flex-col p-6 sm:p-8">
            <Quote className="size-6 text-accent-ink" aria-hidden />
            <blockquote className="mt-4 text-lg leading-relaxed">{q.quote}</blockquote>
            <figcaption className="mt-auto pt-6">
              <span className="block font-semibold">{q.name}</span>
              <span className="text-dim">{q.role}</span>
            </figcaption>
          </figure>
        ))}
        {Array.from({ length: Math.max(0, SLOTS - testimonials.length) }, (_, i) => (
          <div key={i} className="flex min-h-56 flex-col rounded-[28px] border border-dashed border-line p-6 sm:p-8">
            <Quote className="size-6 text-line" aria-hidden />
            <p className="mt-auto font-semibold">{s.pending}</p>
            <p className="mt-1 text-dim">{s.pendingBody}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
