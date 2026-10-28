"use client";

import { NightDrive } from "./night-drive";
import { useSite } from "./providers";
import { SectionHead } from "./section-head";

// Real picks will become a list here; until then each shelf is one pending line.
function Shelf({ title, pending }: { title: string; pending: string }) {
  return (
    <div>
      <h3 className="display text-4xl">{title}</h3>
      <p className="mt-5 border-y border-line py-3 text-ink-dim">
        <span className="pending">{pending}</span>
      </p>
    </div>
  );
}

export function AfterHours() {
  const { t } = useSite();
  return (
    <section id="after" aria-labelledby="after-title" className="relative mx-auto max-w-[90rem] px-(--gutter) py-28 md:py-40">
      <SectionHead id="after" hour="00:50" title={t.after.title}>
        <p className="text-xl text-ink">{t.after.intro}</p>
      </SectionHead>
      <div className="grid gap-14 lg:grid-cols-[1.6fr_1fr]">
        <NightDrive />
        <div className="space-y-12 bg-ground/80 p-6">
          <Shelf title={t.after.garage} pending={t.after.garagePending} />
          <Shelf title={t.after.library} pending={t.after.libraryPending} />
        </div>
      </div>
    </section>
  );
}
