"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import * as THREE from "three";

type LeakSpec = {
  /** Rest position in world space */
  pos: [number, number, number];
  /** Base scale [width, height] */
  scale: [number, number];
  /** Warm color (RGB 0–1) — only lerped, never jumped */
  color: THREE.Color;
  /** Soft opacity peak */
  opacity: number;
  /** Slow autonomous morph phase offsets */
  phase: number;
  /** How strongly camera motion reshapes this leak */
  react: number;
};

function makeGlowTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.18, "rgba(255,255,255,0.85)");
  g.addColorStop(0.45, "rgba(255,255,255,0.35)");
  g.addColorStop(0.72, "rgba(255,255,255,0.08)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Continuous warm palette anchors — we only blend between these */
const WARM_A = new THREE.Color("#ff6a2a");
const WARM_B = new THREE.Color("#ff9a3c");
const WARM_C = new THREE.Color("#ff3d2e");
const WARM_D = new THREE.Color("#ffc56a");
const TEAL_SOFT = new THREE.Color("#3aa8a0");

function LeakSprite({
  spec,
  texture,
  motion,
}: {
  spec: LeakSpec;
  texture: THREE.Texture;
  motion: MutableRefObject<{ speed: number; dir: THREE.Vector3 }>;
}) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const color = useRef(spec.color.clone());
  const targetColor = useRef(spec.color.clone());
  const tRef = useRef(0);

  useFrame((_, delta) => {
    tRef.current += delta;
    const t = tRef.current;
    const g = groupRef.current;
    const mat = matRef.current;
    if (!g || !mat) return;

    const m = motion.current.speed;
    const react = spec.react * Math.min(1, m * 1.8);

    // Slow continuous morph of silhouette (elongation / breathing)
    const breathe = 0.92 + Math.sin(t * 0.22 + spec.phase) * 0.08;
    const stretchX =
      1 +
      Math.sin(t * 0.13 + spec.phase * 1.3) * 0.18 +
      react * (0.35 + Math.abs(motion.current.dir.x) * 0.5);
    const stretchY =
      1 +
      Math.cos(t * 0.11 + spec.phase * 0.9) * 0.16 +
      react * (0.2 + Math.abs(motion.current.dir.y) * 0.45);
    const rot =
      Math.sin(t * 0.08 + spec.phase) * 0.25 +
      motion.current.dir.x * react * 0.4;

    // Drift slightly in world space, nudged by camera motion
    const dx =
      Math.sin(t * 0.07 + spec.phase) * 2.5 +
      motion.current.dir.x * react * -8;
    const dy =
      Math.cos(t * 0.06 + spec.phase * 1.1) * 2 +
      motion.current.dir.y * react * -6;
    const dz =
      Math.sin(t * 0.05 + spec.phase * 0.7) * 1.5 +
      motion.current.dir.z * react * -5;

    g.position.set(spec.pos[0] + dx, spec.pos[1] + dy, spec.pos[2] + dz);
    g.rotation.z = rot;
    g.scale.set(
      spec.scale[0] * stretchX * breathe,
      spec.scale[1] * stretchY * breathe,
      1,
    );

    // Continuous color: sine-blend between warm anchors only (no jumps)
    const u = 0.5 + 0.5 * Math.sin(t * 0.05 + spec.phase);
    const v = 0.5 + 0.5 * Math.sin(t * 0.037 + spec.phase * 1.7);
    targetColor.current.copy(WARM_A).lerp(WARM_B, u).lerp(WARM_C, v * 0.35);
    // Tiny teal fringe only on high-react diagonal-ish leaks, gently
    if (spec.react > 0.7) {
      const tealMix = (0.5 + 0.5 * Math.sin(t * 0.04 + spec.phase)) * 0.12;
      targetColor.current.lerp(TEAL_SOFT, tealMix);
    }
    // Always smooth toward target — never snap
    color.current.lerp(targetColor.current, 1 - Math.exp(-1.2 * delta));
    mat.color.copy(color.current);

    const opacityTarget =
      spec.opacity *
      (0.75 + Math.sin(t * 0.15 + spec.phase) * 0.15 + react * 0.2);
    mat.opacity += (opacityTarget - mat.opacity) * (1 - Math.exp(-2 * delta));
  });

  return (
    <group ref={groupRef} position={spec.pos}>
      <Billboard follow>
        <mesh>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            ref={matRef}
            map={texture}
            color={spec.color}
            transparent
            opacity={spec.opacity}
            depthWrite={false}
            depthTest={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      </Billboard>
    </group>
  );
}

/**
 * Soft orange light-leak "objects" in world space.
 * Orbiting / zooming the graph changes their on-screen shape;
 * colors only ever lerp continuously between warm tones.
 */
export function SceneLightLeaks() {
  const texture = useMemo(() => makeGlowTexture(), []);
  const { camera } = useThree();
  const prevCam = useRef(new THREE.Vector3());
  const motion = useRef({
    speed: 0,
    dir: new THREE.Vector3(),
  });
  const tmp = useRef(new THREE.Vector3());

  const specs = useMemo<LeakSpec[]>(
    () => [
      {
        pos: [-48, -10, -30],
        scale: [90, 70],
        color: WARM_A.clone(),
        opacity: 0.28,
        phase: 0.2,
        react: 0.85,
      },
      {
        pos: [40, 18, -40],
        scale: [55, 80],
        color: WARM_C.clone(),
        opacity: 0.22,
        phase: 1.4,
        react: 0.7,
      },
      {
        pos: [-20, 35, -25],
        scale: [100, 36],
        color: WARM_B.clone(),
        opacity: 0.2,
        phase: 2.6,
        react: 1,
      },
      {
        pos: [25, -28, -20],
        scale: [70, 45],
        color: WARM_D.clone(),
        opacity: 0.18,
        phase: 3.8,
        react: 0.6,
      },
      {
        pos: [0, 0, -55],
        scale: [120, 90],
        color: WARM_A.clone(),
        opacity: 0.12,
        phase: 5.1,
        react: 0.45,
      },
      {
        pos: [-35, 5, 20],
        scale: [40, 55],
        color: WARM_B.clone(),
        opacity: 0.16,
        phase: 0.9,
        react: 0.9,
      },
    ],
    [],
  );

  useFrame((_, delta) => {
    const prev = prevCam.current;
    const deltaPos = tmp.current.copy(camera.position).sub(prev);
    const instant = deltaPos.length() / Math.max(delta, 0.001);
    // Smooth the motion signal so reshaping stays continuous
    motion.current.speed +=
      (Math.min(instant * 0.02, 1.2) - motion.current.speed) *
      (1 - Math.exp(-3 * delta));
    if (deltaPos.lengthSq() > 1e-8) {
      motion.current.dir.lerp(deltaPos.normalize(), 1 - Math.exp(-4 * delta));
    } else {
      motion.current.dir.lerp(
        tmp.current.set(0, 0, 0),
        1 - Math.exp(-2 * delta),
      );
    }
    prev.copy(camera.position);
  });

  return (
    <group>
      {specs.map((spec, i) => (
        <LeakSprite
          key={i}
          spec={spec}
          texture={texture}
          motion={motion}
        />
      ))}
    </group>
  );
}
