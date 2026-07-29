"use client";

import { useEffect, useRef } from "react";

const LEAKS = [
  {
    src: "/effects/leak-1.png",
    // Diagonal orange→teal wash
    className: "leak-img leak-diagonal",
    baseOpacity: 0.12,
    peak: 0.38,
  },
  {
    src: "/effects/leak-2.png",
    // Soft burnt-orange organic blobs
    className: "leak-img leak-blobs",
    baseOpacity: 0.1,
    peak: 0.42,
  },
  {
    src: "/effects/leak-3.png",
    // Lens flare + sunburst + ghost orbs
    className: "leak-img leak-flare",
    baseOpacity: 0.08,
    peak: 0.36,
  },
  {
    src: "/effects/leak-4.png",
    // Edge burns / horizontal film bands
    className: "leak-img leak-edges",
    baseOpacity: 0.1,
    peak: 0.4,
  },
] as const;

/**
 * Real film light-leak plates (screen-blended) with slow, gentle pulses.
 */
export function FilmLightLeaks() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const layers = Array.from(
      root.querySelectorAll<HTMLElement>("[data-leak]"),
    );

    let frame = 0;
    let raf = 0;
    let nextFocus = 90 + Math.random() * 120;
    let active = Math.floor(Math.random() * layers.length);

    layers.forEach((layer, i) => {
      layer.dataset.burst = "0";
      layer.style.opacity = String(LEAKS[i].baseOpacity);
    });

    const tick = (t: number) => {
      frame++;

      layers.forEach((layer, i) => {
        const cfg = LEAKS[i];
        const isActive = i === active;
        const burst = Number(layer.dataset.burst ?? 0);

        // Slow breathing
        const breath =
          Math.sin(t * 0.00018 + i * 2.1) * 0.035 +
          Math.sin(t * 0.00009 + i * 0.7) * 0.02;

        const target = isActive
          ? cfg.baseOpacity + 0.08 + breath + burst
          : cfg.baseOpacity * 0.35 + breath * 0.4;

        const current = Number(layer.style.opacity || 0);
        // Ease toward target for softness
        const next = current + (Math.min(cfg.peak, Math.max(0, target)) - current) * 0.035;
        layer.style.opacity = String(next);

        // Very slow drift
        const dx = Math.sin(t * 0.00007 + i) * 2.5;
        const dy = Math.cos(t * 0.00005 + i * 1.3) * 2;
        const rot = Math.sin(t * 0.00004 + i) * 1.5;
        const scale = 1.05 + Math.sin(t * 0.00006 + i * 0.9) * 0.03;
        layer.style.transform = `translate(${dx}%, ${dy}%) rotate(${rot}deg) scale(${scale})`;

        if (burst > 0.001) {
          layer.dataset.burst = String(burst * 0.988);
        } else {
          layer.dataset.burst = "0";
        }
      });

      // Occasionally bring another plate forward, gently
      if (frame > nextFocus) {
        active = Math.floor(Math.random() * layers.length);
        const layer = layers[active];
        if (layer) {
          layer.dataset.burst = String(0.06 + Math.random() * 0.1);
        }
        // ~6–14s between focus shifts
        nextFocus = frame + 360 + Math.random() * 480;
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
      {LEAKS.map((leak, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={leak.src}
          data-leak={String(i)}
          src={leak.src}
          alt=""
          className={leak.className}
          draggable={false}
        />
      ))}
    </div>
  );
}
