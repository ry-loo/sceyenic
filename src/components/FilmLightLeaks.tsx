"use client";

import { useEffect, useRef } from "react";

/**
 * Fullscreen film light-leak flickers over a pure black void.
 * Uses screen blending so black stays black until a leak flares.
 */
export function FilmLightLeaks() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    let raf = 0;
    let nextBurst = 400 + Math.random() * 1200;

    const leaks = [
      el.querySelector<HTMLElement>("[data-leak='0']"),
      el.querySelector<HTMLElement>("[data-leak='1']"),
      el.querySelector<HTMLElement>("[data-leak='2']"),
      el.querySelector<HTMLElement>("[data-leak='3']"),
    ];

    const tick = (t: number) => {
      frame++;
      // Idle shimmer — very low
      leaks.forEach((leak, i) => {
        if (!leak) return;
        const idle =
          0.02 +
          Math.sin(t * 0.0007 + i * 1.7) * 0.015 +
          Math.sin(t * 0.0023 + i * 4.1) * 0.01;
        const burst = Number(leak.dataset.burst ?? 0);
        const opacity = Math.min(0.85, idle + burst);
        leak.style.opacity = String(opacity);
        if (burst > 0.001) {
          leak.dataset.burst = String(burst * 0.92);
        } else {
          leak.dataset.burst = "0";
        }
      });

      if (frame > nextBurst) {
        const idx = Math.floor(Math.random() * leaks.length);
        const leak = leaks[idx];
        if (leak) {
          leak.dataset.burst = String(0.35 + Math.random() * 0.55);
          // Randomize position / angle slightly each burst
          const rot = -25 + Math.random() * 50;
          const x = -10 + Math.random() * 40;
          const y = -15 + Math.random() * 50;
          leak.style.setProperty("--leak-rot", `${rot}deg`);
          leak.style.setProperty("--leak-x", `${x}%`);
          leak.style.setProperty("--leak-y", `${y}%`);
        }
        nextBurst = frame + 30 + Math.random() * 90;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={ref}
      className="film-leaks pointer-events-none absolute inset-0 z-[5] overflow-hidden"
      aria-hidden
    >
      <div
        data-leak="0"
        className="film-leak"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 0% 30%, rgba(255,90,40,0.95), rgba(255,40,60,0.35) 40%, transparent 70%)",
          ["--leak-x" as string]: "-5%",
          ["--leak-y" as string]: "10%",
          ["--leak-rot" as string]: "-18deg",
        }}
      />
      <div
        data-leak="1"
        className="film-leak"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 100% 70%, rgba(255,60,90,0.9), rgba(255,140,40,0.3) 45%, transparent 72%)",
          ["--leak-x" as string]: "15%",
          ["--leak-y" as string]: "20%",
          ["--leak-rot" as string]: "22deg",
        }}
      />
      <div
        data-leak="2"
        className="film-leak"
        style={{
          background:
            "radial-gradient(ellipse 55% 40% at 50% 0%, rgba(255,180,60,0.75), rgba(255,70,50,0.25) 50%, transparent 75%)",
          ["--leak-x" as string]: "0%",
          ["--leak-y" as string]: "-20%",
          ["--leak-rot" as string]: "8deg",
        }}
      />
      <div
        data-leak="3"
        className="film-leak"
        style={{
          background:
            "radial-gradient(ellipse 50% 70% at 85% 15%, rgba(255,30,80,0.8), rgba(180,40,255,0.15) 40%, transparent 70%)",
          ["--leak-x" as string]: "10%",
          ["--leak-y" as string]: "-5%",
          ["--leak-rot" as string]: "-12deg",
        }}
      />
    </div>
  );
}
