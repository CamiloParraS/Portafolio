"use client";

import { BriefcaseBusiness, GraduationCap } from "lucide-react";
import { useSite } from "./providers";
import { Section } from "./section";

type Entry = { role: string; where: string; when: string; body: string };

function Timeline({ title, icon, entries }: { title: string; icon: React.ReactNode; entries: Entry[] }) {
  return (
    <div className="tile p-6 sm:p-8">
      <h3 className="flex items-center gap-3 text-2xl font-bold tracking-tight">
        <span className="grid size-10 place-items-center rounded-xl bg-ground text-accent-ink">{icon}</span>
        {title}
      </h3>
      <div className="relative mt-6">
      <span aria-hidden className="timeline-track">
        <span className="timeline-fill" />
      </span>
      <ol className="divide-y divide-line">
        {entries.map((e) => (
          <li key={e.role} data-reveal className="group/row relative py-5 first:pt-0 last:pb-0 before:absolute before:inset-y-4 before:-left-4 before:w-0.5 before:origin-top before:scale-y-0 before:rounded-full before:bg-accent before:transition-transform before:duration-300 hover:before:scale-y-100 motion-reduce:before:transition-none sm:before:-left-6">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="text-lg font-semibold transition-colors duration-300 group-hover/row:text-accent-ink">{e.role}</p>
              <p className="tabular text-sm text-dim transition-colors duration-300 group-hover/row:text-ink">{e.when}</p>
            </div>
            <p className="text-accent-ink">{e.where}</p>
            <p className="mt-2 leading-relaxed text-dim">{e.body}</p>
          </li>
        ))}
      </ol>
      </div>
    </div>
  );
}

export function Record() {
  const { t } = useSite();
  const r = t.record;
  return (
    <Section id="record" title={r.title} intro={r.intro}>
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        <Timeline title={r.experienceTitle} icon={<BriefcaseBusiness className="size-5" />} entries={r.experience} />
        <Timeline title={r.educationTitle} icon={<GraduationCap className="size-5" />} entries={r.education} />
      </div>
    </Section>
  );
}
