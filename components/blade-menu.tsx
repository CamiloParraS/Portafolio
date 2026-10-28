"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSite } from "./providers";

export const sections = [
  { id: "status", hour: "00:10" },
  { id: "work", hour: "00:20" },
  { id: "bonds", hour: "00:30" },
  { id: "record", hour: "00:40" },
  { id: "after", hour: "00:50" },
  { id: "contact", hour: "00:59" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

/** The section currently crossing the upper third of the viewport, or null in the hero. */
export function useActiveSection() {
  const [active, setActive] = useState<SectionId | null>(null);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id as SectionId);
      },
      { rootMargin: "-30% 0px -65% 0px" },
    );
    const hero = new IntersectionObserver(([e]) => e.isIntersecting && setActive(null), { rootMargin: "-30% 0px -65% 0px" });
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    const top = document.getElementById("top");
    if (top) hero.observe(top);
    return () => {
      io.disconnect();
      hero.disconnect();
    };
  }, []);
  return active;
}

/**
 * The pause-menu list. A cyan blade slices to whichever command is hovered or focused,
 * and rests on the active section otherwise.
 */
export function BladeMenu({
  vertical = false,
  subs = false,
  className = "",
  itemClassName = "",
  onPick,
}: {
  vertical?: boolean;
  /** Show the plain meaning ("About me", "Testimonials") under each command. */
  subs?: boolean;
  className?: string;
  itemClassName?: string;
  onPick?: () => void;
}) {
  const { t } = useSite();
  const active = useActiveSection();
  const [hover, setHover] = useState<number | null>(null);
  const list = useRef<HTMLUListElement>(null);
  const items = useRef<(HTMLAnchorElement | null)[]>([]);
  const [box, setBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  // At rest in the hero the blade sits on Work, so the menu always shows a selection.
  const target = hover ?? sections.findIndex((s) => s.id === (active ?? "work"));

  const measure = useCallback(() => {
    const el = target >= 0 ? items.current[target] : null;
    setBox(el?.offsetWidth ? { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight } : null);
  }, [target]);

  useLayoutEffect(measure, [measure, t]);

  // A closed <dialog> measures 0×0; measure again once the list actually has a size.
  useEffect(() => {
    const ro = new ResizeObserver(measure);
    if (list.current) ro.observe(list.current);
    return () => ro.disconnect();
  }, [measure]);

  return (
    <ul
      ref={list}
      className={`relative flex ${vertical ? "flex-col items-start" : "items-center"} ${className}`}
      onPointerLeave={() => setHover(null)}
    >
      <span
        aria-hidden
        className="blade absolute left-0 top-0 bg-accent transition-[transform,width,height,opacity] duration-500 ease-out-expo"
        style={{
          transform: box ? `translate(${box.x}px, ${box.y}px)` : undefined,
          width: box?.w ?? 0,
          height: box?.h ?? 0,
          opacity: box ? 1 : 0,
        }}
      />
      {sections.map((s, i) => {
        const on = i === target && box !== null;
        return (
          <li key={s.id}>
            <a
              ref={(el) => {
                items.current[i] = el;
              }}
              href={`#${s.id}`}
              aria-current={s.id === active ? "location" : undefined}
              onPointerEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              onClick={onPick}
              className={`display relative block px-[0.7em] py-[0.2em] no-underline transition-colors duration-300 focus-visible:outline-none ${
                on ? "text-on-accent" : "text-ink hover:text-on-accent"
              } ${itemClassName}`}
            >
              {t.nav[s.id]}
              {subs && <span className="mono mt-1 block text-xs font-normal not-italic normal-case tracking-normal opacity-80">{t.nav.sub[s.id]}</span>}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
