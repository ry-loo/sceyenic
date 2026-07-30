"use client";

import {
  useMemo,
  useRef,
  useState,
  useCallback,
  type MutableRefObject,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Billboard,
  useTexture,
  Stars,
} from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {
  buildPhotoGraph,
  getCategoryColor,
  LANDING_CAMERA_OFFSET,
  LANDING_LOOK_BIAS,
  type GraphNode,
} from "@/data/graph";
import { Lightbox } from "@/components/Lightbox";
import type { PortfolioImage } from "@/data/portfolio";

type HoverInfo = {
  node: GraphNode;
  x: number;
  y: number;
};

function PhotoNode({
  node,
  highlighted,
  onHover,
  onClick,
}: {
  node: GraphNode;
  highlighted: boolean;
  onHover: (node: GraphNode | null, event?: PointerEvent) => void;
  onClick: (node: GraphNode) => void;
}) {
  const texture = useTexture(node.image.src);
  texture.colorSpace = THREE.SRGBColorSpace;

  const aspect = node.image.width / Math.max(node.image.height, 1);
  const base = 2.4;
  const w = aspect >= 1 ? base : base * aspect;
  const h = aspect >= 1 ? base / aspect : base;
  const scale = highlighted ? 1.35 : 1;
  const glow = getCategoryColor(node.category);

  return (
    <group position={[node.x, node.y, node.z]}>
      <Billboard follow>
        <mesh scale={[scale * 1.1, scale * 1.1, 1]} position={[0, 0, -0.03]}>
          <planeGeometry args={[w + 0.4, h + 0.4]} />
          <meshBasicMaterial
            color={glow}
            transparent
            opacity={highlighted ? 0.5 : 0.16}
            depthWrite={false}
            fog={false}
          />
        </mesh>
        <mesh
          scale={[scale, scale, 1]}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
            onHover(node, e.nativeEvent);
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "auto";
            onHover(null);
          }}
          onPointerMove={(e) => {
            e.stopPropagation();
            onHover(node, e.nativeEvent);
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClick(node);
          }}
        >
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial
            map={texture}
            toneMapped={false}
            depthWrite
            fog={false}
          />
        </mesh>
      </Billboard>
      <mesh>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshBasicMaterial
          color={glow}
          transparent
          opacity={0.85}
          fog={false}
        />
      </mesh>
    </group>
  );
}

function EdgeLines({
  nodes,
  links,
}: {
  nodes: GraphNode[];
  links: { source: string; target: string }[];
}) {
  const positions = useMemo(() => {
    const map = new Map(nodes.map((n) => [n.id, n]));
    const pts: number[] = [];
    for (const link of links) {
      const a = map.get(link.source);
      const b = map.get(link.target);
      if (!a || !b) continue;
      pts.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
    return new Float32Array(pts);
  }, [nodes, links]);

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  return (
    <lineSegments geometry={geom}>
      <lineBasicMaterial
        color="#e8e2d8"
        transparent
        opacity={0.55}
        depthWrite={false}
        fog={false}
      />
    </lineSegments>
  );
}

const MAX_DISTANCE = 95;
const PASSTHROUGH_THRESHOLD = 82;
const FULLY_OUT_EPSILON = 1.25;
const AUTOROTATE_IDLE_MS = 7000;

/** Fully zoomed-out start (same view direction as [-50,36,-36]). */
const INITIAL_CAMERA_POSITION: [number, number, number] = [
  -66.57, 47.93, -47.93,
];

function isFullyZoomedOut(distance: number) {
  return distance >= MAX_DISTANCE - FULLY_OUT_EPSILON;
}

function Scene({
  nodes,
  links,
  hoverId,
  onHover,
  onSelect,
  focusRef,
  cameraDistRef,
  controlsRef,
  lastInteractRef,
}: {
  nodes: GraphNode[];
  links: { source: string; target: string }[];
  hoverId: string | null;
  onHover: (node: GraphNode | null, event?: PointerEvent) => void;
  onSelect: (node: GraphNode) => void;
  focusRef: MutableRefObject<GraphNode | null>;
  cameraDistRef: MutableRefObject<number>;
  controlsRef: MutableRefObject<OrbitControlsImpl | null>;
  lastInteractRef: MutableRefObject<number>;
}) {
  const { camera } = useThree();
  const bootstrappedRef = useRef(false);

  useFrame((state, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    const dist = camera.position.distanceTo(controls.target);
    cameraDistRef.current = dist;

    const target = focusRef.current;
    if (target) {
      controls.autoRotate = false;
      const look = new THREE.Vector3(
        target.x + LANDING_LOOK_BIAS.x * 0.4,
        target.y + LANDING_LOOK_BIAS.y * 0.4,
        target.z + LANDING_LOOK_BIAS.z * 0.4,
      );
      const desiredCam = new THREE.Vector3(
        target.x + LANDING_CAMERA_OFFSET.x,
        target.y + LANDING_CAMERA_OFFSET.y,
        target.z + LANDING_CAMERA_OFFSET.z,
      );
      camera.position.lerp(desiredCam, 1 - Math.exp(-2.4 * delta));
      controls.target.lerp(look, 1 - Math.exp(-2.4 * delta));
      controls.update();
      return;
    }

    const fullyOut = isFullyZoomedOut(dist);
    if (!fullyOut) {
      controls.autoRotate = false;
      return;
    }

    // Let the graph settle before orbiting (avoids the flash-then-blank GPU stall).
    if (!bootstrappedRef.current) {
      if (state.clock.elapsedTime >= 1.5) {
        bootstrappedRef.current = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.35;
      }
      return;
    }

    if (
      !controls.autoRotate &&
      performance.now() - lastInteractRef.current >= AUTOROTATE_IDLE_MS
    ) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.35;
    }
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <Stars
        radius={120}
        depth={50}
        count={900}
        factor={2.4}
        saturation={0}
        fade
        speed={0.2}
      />
      <EdgeLines nodes={nodes} links={links} />
      {nodes.map((node) => (
        <PhotoNode
          key={node.id}
          node={node}
          highlighted={hoverId === node.id}
          onHover={onHover}
          onClick={onSelect}
        />
      ))}
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.06}
        minDistance={3}
        maxDistance={MAX_DISTANCE}
        zoomSpeed={1.15}
        rotateSpeed={0.55}
        panSpeed={0.75}
      />
    </>
  );
}

export function PhotoGraph() {
  const { nodes, links } = useMemo(() => buildPhotoGraph(), []);
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const focusRef = useRef<GraphNode | null>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const cameraDistRef = useRef(MAX_DISTANCE);
  const lastInteractRef = useRef(0);

  const images: PortfolioImage[] = useMemo(
    () => nodes.map((n) => n.image),
    [nodes],
  );

  const onHover = useCallback((node: GraphNode | null, event?: PointerEvent) => {
    if (!node || !event) {
      setHover(null);
      return;
    }
    setHover({ node, x: event.clientX, y: event.clientY });
  }, []);

  const stopAutoRotate = useCallback(() => {
    lastInteractRef.current = performance.now();
    if (controlsRef.current) controlsRef.current.autoRotate = false;
  }, []);

  const onSelect = useCallback(
    (node: GraphNode) => {
      stopAutoRotate();
      focusRef.current = node;
      const idx = nodes.findIndex((n) => n.id === node.id);
      if (idx >= 0) setLightboxIndex(idx);
    },
    [nodes, stopAutoRotate],
  );

  return (
    <div
      className="relative h-dvh w-full overflow-hidden bg-transparent"
      onPointerDown={stopAutoRotate}
      onWheelCapture={(e) => {
        if (!controlsRef.current) return;
        stopAutoRotate();
        const shouldPassThrough =
          e.deltaY > 0 && cameraDistRef.current >= PASSTHROUGH_THRESHOLD;

        if (shouldPassThrough) {
          const cameraObject = controlsRef.current.object;
          const direction = new THREE.Vector3()
            .subVectors(cameraObject.position, controlsRef.current.target)
            .normalize();

          cameraObject.position
            .copy(controlsRef.current.target)
            .addScaledVector(direction, MAX_DISTANCE);
          cameraDistRef.current = MAX_DISTANCE;
          controlsRef.current.enableZoom = false;
          controlsRef.current.update();
          return;
        }

        controlsRef.current.enableZoom = true;
      }}
    >
      <Canvas
        camera={{
          position: INITIAL_CAMERA_POSITION,
          fov: 48,
          near: 0.1,
          far: 300,
        }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, premultipliedAlpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
        onPointerMissed={() => setHover(null)}
      >
        <Scene
          nodes={nodes}
          links={links}
          hoverId={hover?.node.id ?? null}
          onHover={onHover}
          onSelect={onSelect}
          focusRef={focusRef}
          cameraDistRef={cameraDistRef}
          controlsRef={controlsRef}
          lastInteractRef={lastInteractRef}
        />
      </Canvas>

      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute top-20 left-5 max-w-md sm:top-24 sm:left-10">
          <div className="pointer-events-none absolute -inset-10 -z-10 rounded-3xl bg-gradient-to-br from-black/80 via-black/65 to-black/20 blur-2xl" />
          <h1 className="font-display text-[clamp(2.75rem,9vw,5.75rem)] leading-[0.9] font-semibold tracking-[-0.05em] text-white">
            sceyenic
          </h1>
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-white/55 sm:text-[15px]">
            Scroll into the graph. Follow the threads. Click any photo to open
            it.
          </p>
        </div>

        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
          <span className="text-[11px] tracking-[0.22em] text-white/35 uppercase">
            Scroll
          </span>
          <span className="h-9 w-px bg-gradient-to-b from-white/35 to-transparent" />
        </div>
      </div>

      {hover && (
        <div
          className="pointer-events-none fixed z-20 rounded-md border border-white/10 bg-black/85 px-3 py-2 shadow-lg backdrop-blur-md"
          style={{
            left: Math.min(hover.x + 14, (typeof window !== "undefined" ? window.innerWidth : 800) - 190),
            top: Math.min(hover.y + 14, (typeof window !== "undefined" ? window.innerHeight : 600) - 72),
          }}
        >
          <p className="text-[12px] font-medium text-white">
            {hover.node.image.alt}
          </p>
          <p className="mt-0.5 text-[11px] text-white/50">
            {hover.node.categoryTitle}
          </p>
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={() => {
            setLightboxIndex(null);
            focusRef.current = null;
          }}
          onChange={setLightboxIndex}
        />
      )}
    </div>
  );
}
