"use client";

import { useEffect, useRef, useState } from "react";
import type { SectionId } from "./blade-menu";
import { useSite } from "./providers";

/** Tilted section title over its hour on the midnight clock. The title cuts in once, on a diagonal. */
export function SectionHead({ id, hour, title, children }: { id: SectionId; hour: string; title: string; children?: React.ReactNode }) {
  const { t } = useSite();
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(true);

  useEffect(() => {
    const el = ref.current!;
    // Only hide what's still below the fold, so content is visible by default.
    if (el.getBoundingClientRect().top < innerHeight) return;
    setSeen(false);
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setSeen(true);
        io.disconnect();
      }
    }, { rootMargin: "0px 0px -15% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative mb-12 md:mb-16">
      <span aria-hidden className="display pointer-events-none mb-2 block select-none text-right text-[clamp(5rem,16vw,15rem)] text-deep md:absolute md:-top-14 md:right-0 md:mb-0">
        {hour}
      </span>
      <h2 id={`${id}-title`} className="display wipe tilt relative origin-left text-[clamp(3.25rem,8vw,7rem)]" data-hidden={!seen}>
        {title}
      </h2>
      <p className="mono relative mt-5 text-sm uppercase text-accent-ink">{t.nav.sub[id]}</p>
      {children && <div className="relative mt-8 max-w-[60ch] text-ink-dim">{children}</div>}
    </div>
  );
}
