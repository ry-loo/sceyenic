"use client";

import { useEffect, useRef } from "react";

/**
 * Soft, slow film light-leak flickers over pure black.
 * Screen blend keeps black until a gentle flare appears.
 */
export function FilmLightLeaks() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    let raf = 0;
    // Wait longer between bursts
    let nextBurst = 180 + Math.random() * 240;

    const leaks = [
      el.querySelector<HTMLElement>("[data-leak='0']"),
      el.querySelector<HTMLElement>("[data-leak='1']"),
      el.querySelector<HTMLElement>("[data-leak='2']"),
      el.querySelector<HTMLElement>("[data-leak='3']"),
    ];

    const tick = (t: number) => {
      frame++;

      leaks.forEach((leak, i) => {
        if (!leak) return;
        // Very low idle shimmer
        const idle =
          0.008 +
          Math.sin(t * 0.00025 + i * 1.7) * 0.006 +
          Math.sin(t * 0.00055 + i * 4.1) * 0.004;
        const burst = Number(leak.dataset.burst ?? 0);
        // Cap opacity lower for gentler flares
        const opacity = Math.min(0.28, idle + burst);
        leak.style.opacity = String(opacity);
        // Slower decay
        if (burst > 0.0005) {
          leak.dataset.burst = String(burst * 0.985);
        } else {
          leak.dataset.burst = "0";
        }
      });

      if (frame > nextBurst) {
        const idx = Math.floor(Math.random() * leaks.length);
        const leak = leaks[idx];
        if (leak) {
          // Softer peak intensity
          leak.dataset.burst = String(0.1 + Math.random() * 0.16);
          const rot = -18 + Math.random() * 36;
          const x = -8 + Math.random() * 30;
          const y = -10 + Math.random() * 40;
          leak.style.setProperty("--leak-rot", `${rot}deg`);
          leak.style.setProperty("--leak-x", `${x}%`);
          leak.style.setProperty("--leak-y", `${y}%`);
        }
        // 4–12 seconds between bursts at ~60fps
        nextBurst = frame + 240 + Math.random() * 480;
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
            "radial-gradient(ellipse 90% 60% at 0% 35%, rgba(255,110,70,0.55), rgba(255,60,80,0.18) 45%, transparent 75%)",
          ["--leak-x" as string]: "-5%",
          ["--leak-y" as string]: "10%",
          ["--leak-rot" as string]: "-14deg",
        }}
      />
      <div
        data-leak="1"
        className="film-leak"
        style={{
          background:
            "radial-gradient(ellipse 80% 65% at 100% 65%, rgba(255,80,100,0.5), rgba(255,150,60,0.15) 48%, transparent 78%)",
          ["--leak-x" as string]: "12%",
          ["--leak-y" as string]: "18%",
          ["--leak-rot" as string]: "16deg",
        }}
      />
      <div
        data-leak="2"
        className="film-leak"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 0%, rgba(255,190,90,0.4), rgba(255,90,60,0.12) 55%, transparent 80%)",
          ["--leak-x" as string]: "0%",
          ["--leak-y" as string]: "-18%",
          ["--leak-rot" as string]: "6deg",
        }}
      />
      <div
        data-leak="3"
        className="film-leak"
        style={{
          background:
            "radial-gradient(ellipse 55% 75% at 88% 18%, rgba(255,50,90,0.42), rgba(160,50,200,0.08) 42%, transparent 75%)",
          ["--leak-x" as string]: "8%",
          ["--leak-y" as string]: "-4%",
          ["--leak-rot" as string]: "-10deg",
        }}
      />
    </div>
  );
}
