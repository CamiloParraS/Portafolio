"use client";

import { useSite } from "./providers";
import { SectionHead } from "./section-head";

// Real testimonials go here: { quote, name, role }. Until then each slot renders as pending.
const testimonials: { quote: string; name: string; role: string }[] = [];
const ARCANA = ["I", "II", "III"];

export function Bonds() {
  const { t } = useSite();
  // Until a real quote exists, one pending card stands in for the three.
  const slots = (testimonials.length ? ARCANA : ARCANA.slice(0, 1)).map((numeral, i) => ({ numeral, item: testimonials[i] }));

  return (
    <section id="bonds" aria-labelledby="bonds-title" className="relative mx-auto max-w-[90rem] px-(--gutter) py-28 md:py-40">
      <SectionHead id="bonds" hour="00:30" title={t.bonds.title}>
        <p>{t.bonds.intro}</p>
      </SectionHead>

      <ul className={`grid gap-24 pt-12 md:gap-8 md:pt-16 ${testimonials.length ? "md:grid-cols-3" : "max-w-xl"}`}>
        {slots.map(({ numeral, item }, i) => (
          <li key={numeral} className={`relative ${["md:mt-0 md:-rotate-2", "md:mt-24 md:rotate-1", "md:mt-12 md:-rotate-1"][i]}`}>
            <span aria-hidden className="display absolute -top-20 right-2 text-[7rem] text-deep">
              {numeral}
            </span>
            <figure className={`relative bg-ground/85 p-7 ${item ? "" : "pending"}`}>
              <blockquote className={`text-xl leading-snug ${item ? "" : "text-ink-dim"}`}>“{item?.quote ?? t.bonds.pendingQuote}”</blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <span className="blade block h-10 w-12 shrink-0 bg-deep" aria-hidden />
                <span>
                  <span className="block font-semibold">{item?.name ?? t.bonds.pendingName}</span>
                  <span className="mono block text-xs uppercase text-ink-dim">{item?.role ?? t.bonds.pendingRole}</span>
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
