import { categories, type PortfolioImage } from "@/data/portfolio";

export type GraphNode = {
  id: string;
  category: string;
  categoryTitle: string;
  image: PortfolioImage;
  x: number;
  y: number;
  z: number;
  /** True when this node is the page-load framing target */
  isLanding: boolean;
};

export type GraphLink = {
  source: string;
  target: string;
};

/** Camera offset from the landing photo — centered focal with room for the left title. */
export const LANDING_CAMERA_OFFSET = { x: 0, y: 0.55, z: 10.2 } as const;
/** Look directly at the landing node. */
export const LANDING_LOOK_BIAS = { x: 0, y: 0, z: 0 } as const;

/** Node whose layout position defines the entry camera angle (street photograph 4). */
const LANDING_ANCHOR_ID = "street-3";

const CATEGORY_COLORS: Record<string, string> = {
  street: "#ff4d6d",
  photojournalism: "#ff8fab",
  graduation: "#ffb3c1",
  headshots: "#ffffff",
  event: "#ff758f",
};

export function getCategoryColor(slug: string) {
  return CATEGORY_COLORS[slug] ?? "#ff6b8a";
}

export function getLandingNode(nodes: GraphNode[]): GraphNode | undefined {
  return nodes.find((n) => n.isLanding) ?? nodes[0];
}

export function getLandingCamera(nodes: GraphNode[]) {
  const landing = getLandingNode(nodes);
  if (!landing) {
    return {
      position: [0, 10, 55] as [number, number, number],
      target: [0, 0, 0] as [number, number, number],
    };
  }
  return {
    position: [
      landing.x + LANDING_CAMERA_OFFSET.x,
      landing.y + LANDING_CAMERA_OFFSET.y,
      landing.z + LANDING_CAMERA_OFFSET.z,
    ] as [number, number, number],
    target: [
      landing.x + LANDING_LOOK_BIAS.x,
      landing.y + LANDING_LOOK_BIAS.y,
      landing.z + LANDING_LOOK_BIAS.z,
    ] as [number, number, number],
  };
}

function swapNodePositions(a: GraphNode, b: GraphNode) {
  const tx = a.x;
  const ty = a.y;
  const tz = a.z;
  a.x = b.x;
  a.y = b.y;
  a.z = b.z;
  b.x = tx;
  b.y = ty;
  b.z = tz;
}

/** Deterministic pseudo-random from string */
function hash(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function buildPhotoGraph(): { nodes: GraphNode[]; links: GraphLink[] } {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  const clusterRadius = 22;
  const categoryCount = categories.length;

  categories.forEach((category, cIndex) => {
    const angle = (cIndex / categoryCount) * Math.PI * 2;
    const cx = Math.cos(angle) * clusterRadius;
    const cz = Math.sin(angle) * clusterRadius;
    const cy = (hash(cIndex + 3) - 0.5) * 12;

    const ids: string[] = [];

    category.images.forEach((image, iIndex) => {
      const id = `${category.slug}-${iIndex}`;
      ids.push(id);

      const a = hash(cIndex * 80 + iIndex) * Math.PI * 2;
      const b = hash(cIndex * 80 + iIndex + 17) * Math.PI;
      // Spread farther from each hub so clusters reach toward the center
      const r = 7 + hash(cIndex * 80 + iIndex + 29) * 16;

      // Slight pull toward origin so the core isn't hollow
      const localX = Math.sin(b) * Math.cos(a) * r;
      const localY = Math.cos(b) * r * 0.7;
      const localZ = Math.sin(b) * Math.sin(a) * r;
      const inward = 0.22;

      nodes.push({
        id,
        category: category.slug,
        categoryTitle: category.title,
        image,
        isLanding: image.label === "landing photo",
        x: cx * (1 - inward) + localX,
        y: cy * (1 - inward) + localY,
        z: cz * (1 - inward) + localZ,
      });
    });

    // Dense web within category
    for (let i = 0; i < ids.length; i++) {
      links.push({ source: ids[i], target: ids[(i + 1) % ids.length] });
      links.push({ source: ids[i], target: ids[(i + 2) % ids.length] });
      if (i % 3 === 0) {
        links.push({ source: ids[i], target: ids[(i + 5) % ids.length] });
      }
    }

    // Bridge to neighboring categories
    const next = categories[(cIndex + 1) % categoryCount];
    const mid = Math.floor(ids.length / 2);
    if (ids[0]) {
      links.push({ source: ids[0], target: `${next.slug}-0` });
    }
    if (ids[mid]) {
      links.push({
        source: ids[mid],
        target: `${next.slug}-${Math.min(mid, next.images.length - 1)}`,
      });
    }
  });

  // Longer cross-category strands
  for (let i = 0; i < nodes.length; i += 3) {
    const j = (i + 11) % nodes.length;
    const k = (i + 19) % nodes.length;
    if (nodes[i].category !== nodes[j].category) {
      links.push({ source: nodes[i].id, target: nodes[j].id });
    }
    if (nodes[i].category !== nodes[k].category) {
      links.push({ source: nodes[i].id, target: nodes[k].id });
    }
  }

  // Place the landing photo at the anchor that defines the entry camera angle
  const landing = nodes.find((n) => n.isLanding);
  const anchor = nodes.find((n) => n.id === LANDING_ANCHOR_ID);
  if (landing && anchor && landing.id !== anchor.id) {
    swapNodePositions(landing, anchor);
  }

  return { nodes, links };
}
