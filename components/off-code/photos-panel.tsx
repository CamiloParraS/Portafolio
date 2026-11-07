"use client";

import { DitherImage } from "../dither-image";
import { useSite } from "../providers";

// Drop photos in public/img/ and list their paths here.
const photos: string[] = [];

export function PhotosPanel() {
  const { t } = useSite();
  const m = t.offcode.more;
  return (
    <>
      <h3 className="text-3xl font-bold tracking-tight">{m.photosTitle}</h3>
      <p className="mt-2 text-dim">{m.photosBody}</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {(photos.length ? photos : [null, null, null]).map((src, i) =>
          src ? (
            <div key={src} className={`overflow-hidden rounded-2xl ${i === 0 ? "col-span-2 aspect-video" : "aspect-square"}`}>
              <div className="zoom size-full">
                <DitherImage src={src} alt="" color cell={2} className="size-full bg-white" />
              </div>
            </div>
          ) : (
            <div key={i} className={`rounded-2xl border border-dashed border-line ${i === 0 ? "col-span-2 aspect-video" : "aspect-square"}`} />
          ),
        )}
      </div>
      {!photos.length && <p className="mt-4 text-dim">{m.photosPending}</p>}
    </>
  );
}
