"use client";

import { useEffect, useRef } from "react";
import { readColor } from "./providers";

// Moon over a night sea, ordered-dithered (Bayer 8x8) into three tones:
// ground -> deep -> accent. Renders at half resolution and is scaled up pixelated,
// so every dither dot is a crisp 2x2 block. The pointer drops ripples into the sea.
const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uScroll;
uniform vec3 uGround, uDeep, uAccent;

float b2(vec2 a){ a = floor(a); return fract(dot(a, vec2(0.5, a.y * 0.75))); }
float b4(vec2 a){ return b2(0.5 * a) * 0.25 + b2(a); }
float b8(vec2 a){ return b4(0.5 * a) * 0.25 + b2(a); }
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main(){
  vec2 frag = gl_FragCoord.xy;
  float m = min(uRes.x, uRes.y);
  vec2 p = (frag - 0.5 * uRes) / m;              // centred, aspect-correct
  float horizon = -0.12 + uScroll * 0.35;
  vec2 moonC = vec2(0.42 * uRes.x / m, max(0.24, 0.5 * uRes.y / m - 0.3) + uScroll * 0.55); // hugs the top on tall screens
  float r = 0.17;
  float lum = 0.0;

  if (p.y > horizon) {
    float d = length(p - moonC);
    float craters = 0.08 * sin(p.x * 40.0) * sin(p.y * 37.0);
    lum = d < r ? 0.88 + craters : 0.5 * exp(-(d - r) * 6.0);
    lum += 0.06 * (p.y - horizon);                 // sky lifts toward the top
    if (hash(floor(frag / 3.0)) > 0.996) lum = 1.0; // stars
  } else {
    float depth = horizon - p.y;
    float wave = sin(p.x * 18.0 / (depth + 0.08) + uTime * 0.8) * sin(depth * 60.0 - uTime * 1.3);
    float path = exp(-pow((p.x - moonC.x) * 3.2 / (depth + 0.15), 2.0));   // moonlight on water
    lum = 0.08 + 0.55 * path * (0.6 + 0.4 * wave) + 0.12 * max(wave, 0.0);
    vec2 mp = (uMouse - 0.5 * uRes) / m;
    float md = length((p - mp) * vec2(1.0, 2.6));
    lum += 0.35 * sin(md * 70.0 - uTime * 5.0) * exp(-md * 7.0);
  }

  lum *= 1.0 - uScroll * 0.55;                     // calmer once you leave the hero
  float t = clamp(lum, 0.0, 1.0) * 2.0;
  float th = b8(frag);
  vec3 c = t < 1.0 ? (t > th ? uDeep : uGround) : (t - 1.0 > th ? uAccent : uDeep);
  gl_FragColor = vec4(c, 1.0);
}`;

const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;

export function DitherSea() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return; // the solid ground colour stays as the fallback

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(prog, n);

    const SCALE = 2;
    const mouse = { x: -9999, y: -9999 };
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let visible = true;

    const setColors = () => {
      const f = (n: string) => readColor(n).map((v) => v / 255) as [number, number, number];
      gl.uniform3f(u("uGround"), ...f("--ground"));
      gl.uniform3f(u("uDeep"), ...f("--deep"));
      gl.uniform3f(u("uAccent"), ...f("--accent"));
    };
    const resize = () => {
      canvas.width = Math.ceil(innerWidth / SCALE);
      canvas.height = Math.ceil(innerHeight / SCALE);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(u("uRes"), canvas.width, canvas.height);
    };
    const draw = (time: number) => {
      gl.uniform1f(u("uTime"), time / 1000);
      gl.uniform2f(u("uMouse"), mouse.x / SCALE, canvas.height - mouse.y / SCALE);
      gl.uniform1f(u("uScroll"), Math.min(scrollY / innerHeight, 1));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = (time: number) => {
      draw(time);
      raf = visible && !reduce.matches ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    setColors();
    resize();
    kick();

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onResize = () => {
      resize();
      kick();
    };
    const onVis = () => {
      visible = !document.hidden;
      kick();
    };
    const themeObs = new MutationObserver(() => {
      setColors();
      kick();
    });
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("resize", onResize);
    addEventListener("scroll", kick, { passive: true }); // keeps the static frame in sync under reduced motion
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      themeObs.disconnect();
      removeEventListener("pointermove", onMove);
      removeEventListener("resize", onResize);
      removeEventListener("scroll", kick);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
