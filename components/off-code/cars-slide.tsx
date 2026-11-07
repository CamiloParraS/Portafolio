"use client";

import { ArrowUpRight } from "lucide-react";
import { CAR_PALETTES, garageArt } from "@/lib/art";
import { DitherCanvas } from "../dither-canvas";
import { useSite } from "../providers";
import { slideClass } from "./carousel";

export function CarsSlide() {
  const { t } = useSite();
  const o = t.offcode;

  return (
    <div className={`${slideClass} flex flex-col overflow-hidden`}>
      <div className="relative h-36">
        <DitherCanvas tone={garageArt} palette={CAR_PALETTES} />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-3xl font-bold tracking-tight">{o.carsTitle}</h3>
        <p className="mt-3 max-w-[48ch] leading-relaxed text-dim">
          {o.carsBody}
        </p>
        <ul className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-4">
          {o.carsRepos.map((r) => (
            <li key={r.name}>
              <a
                href={r.href}
                target="_blank"
                rel="noreferrer"
                className="link inline-flex items-center gap-1 font-medium"
              >
                {r.name}
                <ArrowUpRight className="size-4 text-accent-ink" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
