"use client";

import { useSite } from "./providers";
import { SectionHead } from "./section-head";

type Entry = { when: string; what: string; where: string; note: string };

function Timeline({ title, items, pending }: { title: string; items: Entry[]; pending?: boolean }) {
  return (
    <div>
      <h3 className="display tilt origin-left text-5xl">{title}</h3>
      <ol className="mt-10 border-l border-line">
        {items.map((e) => (
          <li key={e.what + e.when} className={`relative pb-10 pl-8 last:pb-0 ${pending ? "text-ink-dim" : ""}`}>
            <span aria-hidden className="blade absolute -left-2 top-1.5 block h-3 w-4 bg-accent" />
            <p className={`display text-3xl ${pending ? "pending inline-block" : ""}`}>{e.what}</p>
            <p className="mt-1 font-semibold">{e.where}</p>
            <p className="mono mt-1 text-xs uppercase text-accent-ink">{e.when}</p>
            <p className="mt-2 max-w-[52ch] text-ink-dim">{e.note}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function Record() {
  const { t } = useSite();
  return (
    <section id="record" aria-labelledby="record-title" className="relative mx-auto max-w-[90rem] px-(--gutter) py-28 md:py-40">
      <SectionHead id="record" hour="00:40" title={t.record.title} />
      <div className="grid gap-20 bg-ground/80 p-6 md:grid-cols-2 md:p-10">
        <Timeline title={t.record.experience} items={t.record.expPending} pending />
        <Timeline title={t.record.education} items={t.record.eduItems} />
      </div>
    </section>
  );
}
