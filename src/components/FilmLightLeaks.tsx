"use client";

import { useEffect, useRef } from "react";

type Blob = {
  x: number;
  y: number;
  rx: number;
  ry: number;
  rot: number;
  hue: number;
  sat: number;
  light: number;
  alpha: number;
  // morph velocities
  vx: number;
  vy: number;
  vrx: number;
  vry: number;
  vrot: number;
  vhue: number;
};

function rand(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function makeBlob(kind: "edge" | "diagonal" | "orb" | "wash"): Blob {
  if (kind === "edge") {
    return {
      x: rand(0.05, 0.25),
      y: rand(0.35, 0.85),
      rx: rand(0.28, 0.55),
      ry: rand(0.18, 0.45),
      rot: rand(-40, 25),
      hue: rand(12, 28),
      sat: rand(80, 100),
      light: rand(42, 58),
      alpha: rand(0.18, 0.32),
      vx: rand(-0.00002, 0.00002),
      vy: rand(-0.000025, 0.000025),
      vrx: rand(-0.00003, 0.00003),
      vry: rand(-0.00003, 0.00003),
      vrot: rand(-0.004, 0.004),
      vhue: rand(-0.002, 0.002),
    };
  }
  if (kind === "diagonal") {
    return {
      x: rand(0.25, 0.55),
      y: rand(0.45, 0.75),
      rx: rand(0.55, 0.95),
      ry: rand(0.08, 0.18),
      rot: rand(-50, -25),
      hue: rand(18, 38),
      sat: rand(75, 100),
      light: rand(48, 62),
      alpha: rand(0.14, 0.26),
      vx: rand(-0.000015, 0.000015),
      vy: rand(-0.00002, 0.00002),
      vrx: rand(-0.00004, 0.00004),
      vry: rand(-0.00002, 0.00002),
      vrot: rand(-0.003, 0.003),
      vhue: rand(-0.003, 0.004),
    };
  }
  if (kind === "orb") {
    return {
      x: rand(0.55, 0.92),
      y: rand(0.15, 0.7),
      rx: rand(0.08, 0.2),
      ry: rand(0.12, 0.32),
      rot: rand(-20, 20),
      hue: rand(8, 22),
      sat: rand(70, 95),
      light: rand(38, 52),
      alpha: rand(0.16, 0.28),
      vx: rand(-0.00003, 0.00003),
      vy: rand(-0.00003, 0.00003),
      vrx: rand(-0.000025, 0.000025),
      vry: rand(-0.00003, 0.00003),
      vrot: rand(-0.005, 0.005),
      vhue: rand(-0.002, 0.002),
    };
  }
  // wash — soft corner spill
  return {
    x: rand(0.0, 0.2),
    y: rand(0.0, 0.25),
    rx: rand(0.35, 0.7),
    ry: rand(0.25, 0.5),
    rot: rand(-15, 30),
    hue: rand(25, 45),
    sat: rand(85, 100),
    light: rand(50, 65),
    alpha: rand(0.12, 0.22),
    vx: rand(-0.00002, 0.00002),
    vy: rand(-0.00002, 0.00002),
    vrx: rand(-0.00003, 0.00003),
    vry: rand(-0.00003, 0.00003),
    vrot: rand(-0.003, 0.003),
    vhue: rand(-0.004, 0.004),
  };
}

/**
 * Generative film light leaks — soft orange forms that slowly morph
 * into blob / streak / flare-like shapes (not photo overlays).
 */
export function FilmLightLeaks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;

    const blobs: Blob[] = [
      makeBlob("edge"),
      makeBlob("edge"),
      makeBlob("diagonal"),
      makeBlob("orb"),
      makeBlob("orb"),
      makeBlob("wash"),
      makeBlob("wash"),
    ];

    // Occasional teal fringe on the diagonal streak (like ref 1)
    let tealPulse = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const stepBlob = (b: Blob, dt: number) => {
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.rx += b.vrx * dt;
      b.ry += b.vry * dt;
      b.rot += b.vrot * dt;
      b.hue += b.vhue * dt;

      // Soft bounds + morph limits (keeps shapes leak-like)
      if (b.x < -0.1 || b.x > 1.1) b.vx *= -1;
      if (b.y < -0.1 || b.y > 1.1) b.vy *= -1;
      if (b.rx < 0.06 || b.rx > 1.1) b.vrx *= -1;
      if (b.ry < 0.05 || b.ry > 0.7) b.vry *= -1;
      b.rx = Math.min(1.15, Math.max(0.05, b.rx));
      b.ry = Math.min(0.75, Math.max(0.04, b.ry));
      b.hue = ((b.hue % 60) + 60) % 60; // stay in warm orange/yellow/red range

      // Rare velocity nudges so forms reinvent themselves
      if (Math.random() < 0.002) {
        b.vx += rand(-0.00002, 0.00002);
        b.vy += rand(-0.00002, 0.00002);
        b.vrx += rand(-0.00004, 0.00004);
        b.vry += rand(-0.00004, 0.00004);
      }
    };

    const drawBlob = (b: Blob, breath: number) => {
      const cx = b.x * w;
      const cy = b.y * h;
      const rx = b.rx * w;
      const ry = b.ry * h;
      const alpha = Math.max(0, Math.min(0.45, b.alpha * breath));

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((b.rot * Math.PI) / 180);
      ctx.scale(rx, ry);

      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
      g.addColorStop(
        0,
        `hsla(${b.hue}, ${b.sat}%, ${b.light + 12}%, ${alpha})`,
      );
      g.addColorStop(
        0.35,
        `hsla(${b.hue + 4}, ${b.sat}%, ${b.light}%, ${alpha * 0.75})`,
      );
      g.addColorStop(
        0.7,
        `hsla(${b.hue - 6}, ${Math.max(40, b.sat - 15)}%, ${b.light - 10}%, ${alpha * 0.28})`,
      );
      g.addColorStop(1, `hsla(${b.hue}, 60%, 20%, 0)`);

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(40, now - last);
      last = now;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      const breath =
        0.85 +
        Math.sin(now * 0.00015) * 0.08 +
        Math.sin(now * 0.00007) * 0.06;

      tealPulse = 0.5 + Math.sin(now * 0.00012) * 0.5;

      for (const b of blobs) {
        stepBlob(b, dt);
        drawBlob(b, breath);
      }

      // Soft cyan fringe along one diagonal form (ref 1 vibe)
      const fringe = blobs[2];
      if (fringe) {
        ctx.save();
        ctx.translate(fringe.x * w, fringe.y * h + fringe.ry * h * 0.35);
        ctx.rotate(((fringe.rot + 8) * Math.PI) / 180);
        ctx.scale(fringe.rx * w * 0.85, fringe.ry * h * 0.55);
        const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
        const ca = 0.06 * tealPulse * breath;
        cg.addColorStop(0, `hsla(185, 55%, 55%, ${ca})`);
        cg.addColorStop(0.55, `hsla(190, 40%, 40%, ${ca * 0.35})`);
        cg.addColorStop(1, "hsla(190, 40%, 30%, 0)");
        ctx.fillStyle = cg;
        ctx.beginPath();
        ctx.arc(0, 0, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Tiny flare core occasionally (ref 3)
      const flare = 0.5 + Math.sin(now * 0.00009) * 0.5;
      if (flare > 0.72) {
        const fx = blobs[5].x * w;
        const fy = blobs[5].y * h;
        const fg = ctx.createRadialGradient(fx, fy, 0, fx, fy, Math.min(w, h) * 0.18);
        const fa = (flare - 0.72) * 0.55;
        fg.addColorStop(0, `hsla(48, 100%, 85%, ${fa})`);
        fg.addColorStop(0.2, `hsla(28, 100%, 55%, ${fa * 0.45})`);
        fg.addColorStop(1, "hsla(15, 90%, 40%, 0)");
        ctx.fillStyle = fg;
        ctx.beginPath();
        ctx.arc(fx, fy, Math.min(w, h) * 0.18, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="film-leaks pointer-events-none absolute inset-0 z-[5]"
      aria-hidden
    />
  );
}
