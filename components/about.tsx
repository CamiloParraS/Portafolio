"use client";

import { placeholderArt } from "@/lib/art";
import { DitherCanvas } from "./dither-canvas";
import { DitherImage } from "./dither-image";
import { useSite } from "./providers";
import { Section } from "./section";
import { TechIcon } from "./tech-icon";

// Stack groups before this index sit in the left card; the rest continue under Quick facts.
const SPLIT = 3;

export function About() {
  const { t } = useSite();
  const a = t.about;

  return (
    <Section id="about" title={a.title} intro={a.intro}>
      <div className="grid gap-3 sm:gap-4 md:grid-cols-6">
        <div className="tile p-6 sm:p-10 md:col-span-4 md:row-span-2">
          <div className="max-w-[62ch] space-y-5 text-lg leading-relaxed">
            {a.bio.map((p, i) => (
              <p key={i} className={i === 0 ? "text-xl text-ink sm:text-2xl sm:leading-snug" : "text-dim"}>
                {p}
              </p>
            ))}
          </div>
        </div>

        <figure className="tile relative min-h-48 overflow-hidden md:col-span-2">
          <div className="absolute inset-0">
            <DitherImage color cover src="/img/about-1.jpg" alt={a.photoAlt} className="photo-inks size-full" />
          </div>
        </figure>

        {[2].map((n) => (
          <figure key={n} className="tile relative min-h-48 overflow-hidden md:col-span-2">
            <DitherCanvas tone={placeholderArt} cell={4} />
            <figcaption className="absolute inset-x-4 bottom-4 rounded-2xl border border-dashed border-line bg-tile/90 px-4 py-3 text-sm backdrop-blur-sm">
              <span className="font-semibold">{a.photoSlot}</span>
              <span className="block text-dim">{a.photoHint.replace("{n}", String(n))}</span>
            </figcaption>
          </figure>
        ))}

        <div className="tile group flex flex-col overflow-hidden p-6 pb-0 sm:p-8 sm:pb-0 md:col-span-3 md:row-span-2">
          <h3 className="text-2xl font-bold tracking-tight">{a.stackTitle}</h3>
          <dl className="mt-5 space-y-5">
            {a.stack.slice(0, SPLIT).map((g) => (
              <div key={g.group}>
                <dt className="text-sm text-dim">{g.group}</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {g.items.map((item) => (
                    <span key={item} className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-sm font-medium">
                      <TechIcon name={item} />
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
          {/* Decorative mascot peeking up from the bottom edge of the card. */}
          <div className="pointer-events-none mt-auto flex h-[5.5rem] justify-end overflow-hidden pr-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/mascot.png" alt="" width={160} height={160} className="h-24 w-auto translate-y-[18%] motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:translate-y-[6%]" />
          </div>
        </div>

        <div className="tile p-6 sm:p-8 md:col-span-3">
          <h3 className="text-2xl font-bold tracking-tight">{a.factsTitle}</h3>
          <dl className="mt-5 divide-y divide-line">
            {a.facts.map((f) => (
              <div key={f.k} className="flex flex-wrap justify-between gap-x-6 gap-y-1 py-3">
                <dt className="text-dim">{f.k}</dt>
                <dd className="tabular font-medium">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="tile p-6 sm:p-8 md:col-span-3">
          <dl className="space-y-5">
            {a.stack.slice(SPLIT).map((g) => (
              <div key={g.group}>
                <dt className="text-sm text-dim">{g.group}</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {g.items.map((item) => (
                    <span key={item} className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-sm font-medium">
                      <TechIcon name={item} />
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
