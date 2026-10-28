"use client";

import { portrait, stack } from "@/lib/content";
import { AsciiImage } from "./dither";
import { useSite } from "./providers";
import { SectionHead } from "./section-head";

export function Status() {
  const { t } = useSite();
  const s = t.status;

  return (
    <section id="status" aria-labelledby="status-title" className="relative mx-auto max-w-[90rem] px-(--gutter) py-28 md:py-40">
      <SectionHead id="status" hour="00:10" title={s.title} />

      <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6 text-lg leading-relaxed">
          {s.bio.map((p, i) => (
            <p key={i} className={`max-w-[62ch] ${i === s.bio.length - 1 ? "text-accent-ink" : ""}`}>
              {p}
            </p>
          ))}

          <dl className="mt-14 grid grid-cols-1 border-t border-line sm:grid-cols-2">
            {s.stats.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4 border-b border-line py-3 sm:odd:pr-6 sm:even:pl-6">
                <dt className="mono text-xs uppercase text-ink-dim">{k}</dt>
                <dd className="text-right font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="space-y-10">
          <figure className="bg-ground/70 p-4 text-accent-ink">
            <AsciiImage src={portrait} alt={s.photoAlt} cols={64} className="text-[clamp(5px,0.95vw,10px)]" />
          </figure>
          <div className="pending grid aspect-[16/9] place-items-center bg-deep/60">
            <span className="mono text-xs uppercase text-ink-dim">{s.photoPending}</span>
          </div>
        </div>
      </div>

      <div className="mt-24">
        <h3 className="display tilt origin-left text-5xl md:text-6xl">{s.stackTitle}</h3>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {(Object.keys(stack) as (keyof typeof stack)[]).map((group) => (
            <div key={group}>
              <p className="mono mb-4 text-xs uppercase text-ink-dim">{s.stackGroups[group]}</p>
              <ul className="flex flex-wrap gap-2">
                {stack[group].map((item) => (
                  <li key={item} className="blade bg-deep px-4 py-1.5 font-semibold transition-colors duration-300 hover:bg-accent hover:text-on-accent">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
