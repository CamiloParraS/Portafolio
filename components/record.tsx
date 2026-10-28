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
      <ol className="mt-6 divide-y divide-line">
        {entries.map((e) => (
          <li key={e.role} className="py-5 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="text-lg font-semibold">{e.role}</p>
              <p className="tabular text-sm text-dim">{e.when}</p>
            </div>
            <p className="text-accent-ink">{e.where}</p>
            <p className="mt-2 leading-relaxed text-dim">{e.body}</p>
          </li>
        ))}
      </ol>
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
