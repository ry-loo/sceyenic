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
  getLandingNode,
  LANDING_CAMERA_OFFSET,
  type GraphNode,
} from "@/data/graph";
import { Lightbox } from "@/components/Lightbox";
import type { PortfolioImage } from "@/data/portfolio";

type HoverInfo = {
  node: GraphNode;
  x: number;
  y: number;
};

/**
 * Only the top + bottom chrome bands — center stays free for the landing photo.
 * Normalized coords: x 0–1 left→right, y 0–1 top→bottom.
 */
function textSafeZoneFactor(sx: number, sy: number, pad = 0) {
  const inTopBand =
    sy >= 0.06 && sy <= 0.22 + pad * 0.5 && sx >= 0.08 && sx <= 0.92;
  const inBottomBand =
    sy >= 0.78 - pad * 0.5 && sy <= 0.96 && sx >= 0.2 && sx <= 0.8;

  if (!inTopBand && !inBottomBand) return 0;

  if (inTopBand) {
    const ny = (sy - 0.06) / (0.16 + pad * 0.5);
    const edge = Math.min(ny, 1 - ny);
    return THREE.MathUtils.clamp(1 - edge / 0.35, 0, 1) * 0.85;
  }

  const ny = (sy - (0.78 - pad * 0.5)) / (0.18 + pad * 0.5);
  const edge = Math.min(ny, 1 - ny);
  return THREE.MathUtils.clamp(1 - edge / 0.35, 0, 1) * 0.7;
}

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

  const groupRef = useRef<THREE.Group>(null);
  const photoMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const glowMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const coreMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const photoMeshRef = useRef<THREE.Mesh>(null);
  const worldPos = useRef(new THREE.Vector3());
  const ndcPos = useRef(new THREE.Vector3());
  const { camera, size } = useThree();

  const aspect = node.image.width / Math.max(node.image.height, 1);
  const base = 2.4;
  const w = aspect >= 1 ? base : base * aspect;
  const h = aspect >= 1 ? base / aspect : base;
  const scale = highlighted ? 1.35 : 1;
  const glow = getCategoryColor(node.category);

  useFrame(() => {
    if (!groupRef.current || !photoMatRef.current) return;
    groupRef.current.getWorldPosition(worldPos.current);
    const dist = camera.position.distanceTo(worldPos.current);

    // Depth haze
    const t = THREE.MathUtils.clamp((dist - 24) / 60, 0, 1);
    const haze = t * t;
    let opacity = highlighted ? 1 : 1 - haze * 0.22;

    // Keep hero title clear — hide photos that sit under the text
    ndcPos.current.copy(worldPos.current).project(camera);
    if (ndcPos.current.z < 1) {
      const sx = ndcPos.current.x * 0.5 + 0.5;
      const sy = 1 - (ndcPos.current.y * 0.5 + 0.5);
      const pad = dist < 22 ? 0.06 : 0.02;
      const cover = textSafeZoneFactor(sx, sy, pad);
      // Never suppress the landing photo itself — it is the focal point
      const visibleSize = node.isLanding ? 0 : dist < 75 ? 1 : 0;
      opacity *= 1 - cover * visibleSize;
    }

    const show = opacity > 0.05;
    photoMatRef.current.opacity = opacity;
    photoMatRef.current.visible = show;
    if (photoMeshRef.current) {
      photoMeshRef.current.visible = show;
    }
    if (glowMatRef.current) {
      glowMatRef.current.opacity =
        (highlighted ? 0.5 : 0.16) * (1 - haze * 0.35) * (show ? 1 : 0);
      glowMatRef.current.visible = show;
    }
    if (coreMatRef.current) {
      coreMatRef.current.opacity = 0.85 * (1 - haze * 0.4) * (show ? 1 : 0);
      coreMatRef.current.visible = show;
    }

    void size.width;
  });

  return (
    <group ref={groupRef} position={[node.x, node.y, node.z]}>
      <Billboard follow>
        <mesh scale={[scale * 1.1, scale * 1.1, 1]} position={[0, 0, -0.03]}>
          <planeGeometry args={[w + 0.4, h + 0.4]} />
          <meshBasicMaterial
            ref={glowMatRef}
            color={glow}
            transparent
            opacity={highlighted ? 0.5 : 0.16}
            depthWrite={false}
            fog
          />
        </mesh>
        <mesh
          ref={photoMeshRef}
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
            ref={photoMatRef}
            map={texture}
            toneMapped={false}
            transparent
            opacity={1}
            depthWrite
            fog
          />
        </mesh>
      </Billboard>
      <mesh>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshBasicMaterial
          ref={coreMatRef}
          color={glow}
          transparent
          opacity={0.85}
          fog
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
        fog
      />
    </lineSegments>
  );
}

function Scene({
  nodes,
  links,
  hoverId,
  onHover,
  onSelect,
  focusRef,
}: {
  nodes: GraphNode[];
  links: { source: string; target: string }[];
  hoverId: string | null;
  onHover: (node: GraphNode | null, event?: PointerEvent) => void;
  onSelect: (node: GraphNode) => void;
  focusRef: MutableRefObject<GraphNode | null>;
}) {
  const controls = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const framedLanding = useRef(false);
  const landing = useMemo(() => getLandingNode(nodes), [nodes]);

  // Frame the labeled landing photo dead-center on first load
  useFrame(() => {
    if (framedLanding.current || !landing || !controls.current) return;
    const look = new THREE.Vector3(landing.x, landing.y, landing.z);
    camera.position.set(
      landing.x + LANDING_CAMERA_OFFSET.x,
      landing.y + LANDING_CAMERA_OFFSET.y,
      landing.z + LANDING_CAMERA_OFFSET.z,
    );
    controls.current.target.copy(look);
    controls.current.update();
    framedLanding.current = true;
  });

  useFrame((_, delta) => {
    const target = focusRef.current;
    if (!target || !controls.current) return;
    const look = new THREE.Vector3(target.x, target.y, target.z);
    const desiredCam = new THREE.Vector3(
      target.x + LANDING_CAMERA_OFFSET.x,
      target.y + LANDING_CAMERA_OFFSET.y,
      target.z + LANDING_CAMERA_OFFSET.z,
    );
    camera.position.lerp(desiredCam, 1 - Math.exp(-2.4 * delta));
    controls.current.target.lerp(look, 1 - Math.exp(-2.4 * delta));
    controls.current.update();
  });

  return (
    <>
      {/* Soft depth haze — distant nodes gently fade into the dark */}
      <fog attach="fog" args={["#080706", 38, 105]} />
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
        ref={controls}
        makeDefault
        enableDamping
        dampingFactor={0.06}
        minDistance={3}
        maxDistance={95}
        zoomSpeed={1.15}
        rotateSpeed={0.55}
        panSpeed={0.75}
      />
    </>
  );
}

function TextureCache({ urls }: { urls: string[] }) {
  useTexture(urls);
  return null;
}

export function PhotoGraph() {
  const { nodes, links } = useMemo(() => buildPhotoGraph(), []);
  const urls = useMemo(() => nodes.map((n) => n.image.src), [nodes]);
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const focusRef = useRef<GraphNode | null>(null);

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

  const onSelect = useCallback(
    (node: GraphNode) => {
      focusRef.current = node;
      const idx = nodes.findIndex((n) => n.id === node.id);
      if (idx >= 0) setLightboxIndex(idx);
    },
    [nodes],
  );

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-transparent">
      <Canvas
        camera={{ position: [0, 10, 55], fov: 48, near: 0.1, far: 300 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, premultipliedAlpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
        onPointerMissed={() => setHover(null)}
      >
        <TextureCache urls={urls} />
        <Scene
          nodes={nodes}
          links={links}
          hoverId={hover?.node.id ?? null}
          onHover={onHover}
          onSelect={onSelect}
          focusRef={focusRef}
        />
      </Canvas>

      <div className="pointer-events-none absolute inset-0 z-10">
        {/* Title sits above the centered landing photo */}
        <div className="absolute top-16 left-1/2 w-[min(92vw,640px)] -translate-x-1/2 text-center sm:top-[4.5rem]">
          <div className="pointer-events-none absolute inset-x-8 -inset-y-4 -z-10 rounded-full bg-black/40 blur-2xl" />
          <h1 className="font-display text-[clamp(2.25rem,6vw,4.25rem)] leading-[0.95] font-semibold tracking-[-0.05em] text-white">
            sceyenic
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[13px] leading-relaxed text-white/55 sm:text-[14px]">
            Scroll into the graph. Drag to move around. Click any photo to open
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
