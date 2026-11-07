"use client";

import { useSite } from "../providers";
import { Section } from "../section";
import { OffCodeCarousel } from "./carousel";
import { CarsSlide } from "./cars-slide";
import { GamesSlide } from "./games-slide";
import { OriginPanel } from "./origin-panel";

/** Off-code: an endless carousel (Hot Wheels, games, music, GitHub, now playing, photos) and the origin story. */
export function OffCode() {
  const { t } = useSite();
  const o = t.offcode;

  return (
    <Section id="offcode" title={o.title} intro={o.intro} tight>
      <OffCodeCarousel>
        <CarsSlide />
        <GamesSlide />
      </OffCodeCarousel>

      <div className="mt-3 sm:mt-4">
        <OriginPanel />
      </div>
    </Section>
  );
}
