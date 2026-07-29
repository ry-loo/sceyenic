"use client";

import {
  useMemo,
  useRef,
  useState,
  useCallback,
  type MutableRefObject,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Billboard, useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {
  buildPhotoGraph,
  getCategoryColor,
  type GraphNode,
} from "@/data/graph";
import { Lightbox } from "@/components/Lightbox";
import { SceneLightLeaks } from "@/components/SceneLightLeaks";
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
  const base = 2.2;
  const w = aspect >= 1 ? base : base * aspect;
  const h = aspect >= 1 ? base / aspect : base;
  const scale = highlighted ? 1.4 : 1;
  const glow = getCategoryColor(node.category);

  return (
    <group position={[node.x, node.y, node.z]}>
      <Billboard follow>
        <mesh scale={[scale * 1.08, scale * 1.08, 1]} position={[0, 0, -0.03]}>
          <planeGeometry args={[w + 0.28, h + 0.28]} />
          <meshBasicMaterial
            color={glow}
            transparent
            opacity={highlighted ? 0.45 : 0.12}
            depthWrite={false}
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
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
      </Billboard>
      <mesh>
        <sphereGeometry args={[0.08, 10, 10]} />
        <meshBasicMaterial color={glow} transparent opacity={0.75} />
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
        color="#5c5c66"
        transparent
        opacity={0.32}
        depthWrite={false}
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

  useFrame((_, delta) => {
    const target = focusRef.current;
    if (!target || !controls.current) return;
    const goal = new THREE.Vector3(target.x, target.y, target.z);
    const desiredCam = goal.clone().add(new THREE.Vector3(0, 0.8, 7));
    camera.position.lerp(desiredCam, 1 - Math.exp(-2.4 * delta));
    controls.current.target.lerp(goal, 1 - Math.exp(-2.4 * delta));
    controls.current.update();
  });

  return (
    <>
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={0.75} />
      <SceneLightLeaks />
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
    <div className="relative h-dvh w-full overflow-hidden bg-black">
      <Canvas
        camera={{ position: [0, 10, 55], fov: 48, near: 0.1, far: 300 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: false }}
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
        <div className="absolute top-20 left-5 max-w-md sm:top-24 sm:left-10">
          <h1 className="font-display text-[clamp(2.75rem,9vw,5.75rem)] leading-[0.9] font-semibold tracking-[-0.05em] text-white">
            sceyenic
          </h1>
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-white/55 sm:text-[15px]">
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
            left: Math.min(
              hover.x + 14,
              (typeof window !== "undefined" ? window.innerWidth : 800) - 190,
            ),
            top: Math.min(
              hover.y + 14,
              (typeof window !== "undefined" ? window.innerHeight : 600) - 72,
            ),
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
