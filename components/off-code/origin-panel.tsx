"use client";

import { DitherImage } from "../dither-image";
import { useSite } from "../providers";

export function OriginPanel() {
  const { t } = useSite();
  const o = t.offcode;

  return (
    <article className="tile grid overflow-hidden sm:grid-cols-3">
      <DitherImage
        src="/img/Nintedo64.jpg"
        alt={o.originAlt}
        color
        cell={2}
        className="min-h-48 bg-white"
      />
      <div className="flex flex-col justify-center p-6 sm:col-span-2 sm:p-10">
        <h3 className="text-3xl font-bold tracking-tight">
          {o.originTitle}
        </h3>
        <p className="mt-3 max-w-[56ch] text-lg leading-relaxed text-dim">
          {o.originBody}
        </p>
      </div>
    </article>
  );
}
