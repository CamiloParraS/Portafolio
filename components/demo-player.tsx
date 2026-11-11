"use client";

/**
 * Reusable demo-video modal for any project.
 *
 * To add a demo to another project, drop `<name>.mp4` (and an optional poster
 * `<name>.jpg` next to it) in `public/videos/` and set that project's `demo`
 * field in `lib/content.ts`, per language if the video is localised. The
 * description, tags and repo link come from the project itself.
 */

import { ArrowUpRight, Maximize, Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Content } from "@/lib/content";
import { GitHub } from "./brand-icons";
import { TechIcon } from "./tech-icon";
import { useSite } from "./providers";

type Project = Content["work"]["projects"][number];

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export function DemoPlayer({ p, src: base, onClose }: { p: Project; src: string; onClose: () => void }) {
  const name = p.name;
  const { t, theme } = useSite();
  // A `<name>-light.mp4` variant is expected next to `<name>.mp4` for the light theme.
  const [noLight, setNoLight] = useState(false);
  const src = theme === "light" && !noLight ? base.replace(/\.mp4$/, "-light.mp4") : base;
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [closing, setClosing] = useState(false);
  const poster = src.replace(/\.mp4$/, ".jpg");

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (!d.open) d.showModal();
    video.current?.play().catch(() => {});
    document.documentElement.style.overflow = "hidden";
    // No d.close() here: it fires a "close" event that would call onClose and
    // immediately dismiss the modal under React strict-mode double mounting.
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  // Close with a short exit (Escape, backdrop and the X all come through here); reduced motion closes at once.
  const dismiss = () => {
    if (closing) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return onClose();
    setClosing(true);
  };

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = video.current;
    if (v) v.currentTime = Number(e.target.value);
  };

  const label = t.work.demoLabel.replace("{name}", name);
  const pct = duration ? (time / duration) * 100 : 0;
  const ctl =
    "grid size-10 place-items-center rounded-full text-ink transition-[background-color,scale] duration-150 ease-out hover:bg-ink/10 active:scale-95 focus-visible:outline-2 focus-visible:outline-accent";
  const l = t.work.player;

  return (
    <dialog
      ref={dialog}
      aria-label={label}
      data-closing={closing || undefined}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        dismiss();
      }}
      onAnimationEnd={(e) => e.target === e.currentTarget && e.animationName === "demo-out" && onClose()}
      onClick={(e) => e.target === e.currentTarget && dismiss()}
      className="demo-dialog m-auto w-[min(62rem,calc(100vw-1.5rem),calc((100dvh-7rem)*16/9+19rem))] max-w-none overflow-visible bg-transparent p-0 backdrop:bg-black/35 backdrop:backdrop-blur-[3px]"
    >
      <div className="tile grid max-h-[calc(100dvh-1.5rem)] gap-x-6 gap-y-5 overflow-y-auto border border-line p-2 shadow-[0_30px_90px_-10px_rgb(0_0_0/0.6),0_0_0_1px_rgb(255_255_255/0.04)] sm:p-3 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0">
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
            <video
              ref={video}
              src={src}
              onError={() => theme === "light" && setNoLight(true)}
              poster={poster}
              playsInline
              preload="metadata"
              muted={muted}
              onClick={toggle}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              className="size-full cursor-pointer object-contain"
            />
            {!playing && (
              <button
                type="button"
                onClick={toggle}
                aria-label={l.play}
                className="absolute inset-0 grid place-items-center bg-black/30"
              >
                <span className="grid size-16 place-items-center rounded-full bg-accent text-on-accent transition-transform hover:scale-105 active:scale-95">
                  <Play className="ml-1 size-6 fill-current" />
                </span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 pt-2 sm:gap-2">
            <button type="button" onClick={toggle} aria-label={playing ? l.pause : l.play} className={ctl}>
              {playing ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current" />}
            </button>
            <span className="w-10 text-right text-sm tabular-nums text-dim">{fmt(time)}</span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={time}
              onChange={seek}
              aria-label={l.seek}
              className="h-1.5 min-w-0 flex-1 cursor-pointer appearance-none rounded-full accent-[var(--accent)]"
              style={{ background: `linear-gradient(to right, var(--accent) ${pct}%, var(--line) ${pct}%)` }}
            />
            <span className="w-10 text-sm tabular-nums text-dim">{fmt(duration)}</span>
            <button type="button" onClick={() => setMuted((m) => !m)} aria-label={muted ? l.unmute : l.mute} className={ctl}>
              {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
            </button>
            <button type="button" onClick={() => video.current?.requestFullscreen?.()} aria-label={l.fullscreen} className={ctl}>
              <Maximize className="size-5" />
            </button>
          </div>
        </div>

        <aside className="flex min-w-0 flex-col px-2 pb-3 sm:px-1 lg:py-2 lg:pr-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-3xl font-bold leading-none tracking-[-0.03em]">{name}</h3>
            <button type="button" onClick={dismiss} aria-label={t.work.demoClose} className={`${ctl} -mr-2 -mt-2 shrink-0`}>
              <X className="size-5" />
            </button>
          </div>
          <p className="mt-3 font-medium leading-snug">{p.tagline}</p>
          <p className="mt-3 text-sm leading-relaxed text-dim">{p.body}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {p.tags.map((tag) => (
              <li key={tag} className="inline-flex items-center gap-1.5 rounded-full bg-ground px-2.5 py-1 text-xs text-dim">
                <TechIcon name={tag} />
                {tag}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-2 lg:mt-auto lg:pt-6">
            <a href={p.repo} target="_blank" rel="noreferrer" className="btn btn-primary justify-between py-3 text-sm">
              <span className="inline-flex items-center gap-2">
                <GitHub />
                {t.work.code}
              </span>
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </aside>
      </div>
    </dialog>
  );
}
