"use client";

import { useEffect, useRef } from "react";
import { paintColor } from "@/lib/dither";
import { useSite } from "./providers";

const SLUGS: Record<string, string> = {
  Rust: "rust",
  TypeScript: "typescript",
  Kotlin: "kotlin",
  Python: "python",
  Java: "openjdk",
  GDScript: "godotengine",
  "C++": "cplusplus",
  React: "react",
  "Next.js": "nextdotjs",
  Spring: "spring",
  Android: "android",
  Godot: "godotengine",
  "Tailwind CSS": "tailwindcss",
  Git: "git",
  GitHub: "github",
  Vercel: "vercel",
  Arduino: "arduino",
  Gradle: "gradle",
  "Node.js": "nodedotjs",
  NestJS: "nestjs",
  Docker: "docker",
  PostgreSQL: "postgresql",
  AWS: "amazonwebservices",
  ESP32: "espressif",
  Zed: "zedindustries",
  JetBrains: "jetbrains",
  "VS Code": "visualstudiocode",
  "Android Studio": "androidstudio",
};

const SIZE = 16;

/** A tiny brand glyph in its own colours, ordered-dithered like the rest of the page. */
export function TechIcon({ name }: { name: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const { theme } = useSite();
  const slug = SLUGS[name];

  useEffect(() => {
    if (!slug) return;
    const canvas = ref.current!;
    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.drawImage(img, 0, 0, SIZE, SIZE);
      const px = ctx.getImageData(0, 0, SIZE, SIZE);
      const alpha = Uint8ClampedArray.from({ length: SIZE * SIZE }, (_, i) => px.data[i * 4 + 3]);
      // Dark brand marks (GitHub, Vercel, Next.js) would vanish on the dark theme.
      for (let i = 0; i < alpha.length; i++) {
        const d = px.data;
        if (theme === "dark" && d[i * 4] + d[i * 4 + 1] + d[i * 4 + 2] < 150) d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = 235;
      }
      paintColor(px, 5);
      for (let i = 0; i < alpha.length; i++) px.data[i * 4 + 3] = alpha[i] > 100 ? 255 : 0;
      ctx.putImageData(px, 0, 0);
    };
    img.src = `/icons/${slug}.svg`;
  }, [slug, theme]);

  if (!slug) return null;
  return <canvas ref={ref} width={SIZE} height={SIZE} aria-hidden className="pixel size-4" />;
}
