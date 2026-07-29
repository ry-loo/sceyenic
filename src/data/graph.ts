import { categories, type PortfolioImage } from "@/data/portfolio";

export type GraphNode = {
  id: string;
  category: string;
  categoryTitle: string;
  image: PortfolioImage;
  x: number;
  y: number;
  z: number;
};

export type GraphLink = {
  source: string;
  target: string;
};

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

function hash(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

type Point2 = { x: number; y: number };

function cubic(
  p0: Point2,
  p1: Point2,
  p2: Point2,
  p3: Point2,
  t: number,
): Point2 {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  return {
    x: uu * u * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + tt * t * p3.x,
    y: uu * u * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + tt * t * p3.y,
  };
}

function lerp(a: Point2, b: Point2, t: number): Point2 {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

/** Centerline samples for a readable lowercase r */
function rCenterline(count: number): Point2[] {
  const stemCount = Math.round(count * 0.55);
  const earCount = count - stemCount;
  const pts: Point2[] = [];

  const stemBottom = { x: 0, y: -1 };
  const stemTop = { x: 0, y: 0.95 };
  for (let i = 0; i < stemCount; i++) {
    pts.push(lerp(stemBottom, stemTop, i / Math.max(stemCount - 1, 1)));
  }

  // Ear peels off mid-upper stem
  const earStart = { x: 0.04, y: 0.48 };
  const c1 = { x: 0.18, y: 1.02 };
  const c2 = { x: 0.55, y: 0.92 };
  const earEnd = { x: 0.78, y: 0.32 };
  for (let i = 0; i < earCount; i++) {
    pts.push(cubic(earStart, c1, c2, earEnd, i / Math.max(earCount - 1, 1)));
  }

  return pts;
}

/**
 * Place nodes along a thickened lowercase "r" so the silhouette reads
 * when zoomed out.
 */
export function buildPhotoGraph(): { nodes: GraphNode[]; links: GraphLink[] } {
  const images = categories.flatMap((category) =>
    category.images.map((image, iIndex) => ({
      category,
      image,
      iIndex,
    })),
  );

  const n = images.length;
  const center = rCenterline(n);

  const scaleX = 42;
  const scaleY = 52;
  const stemHalfWidth = 0.09;
  const earHalfWidth = 0.07;

  const nodes: GraphNode[] = images.map((item, i) => {
    const p = center[i] ?? { x: 0, y: 0 };
    const onStem = p.x < 0.12;
    const half = onStem ? stemHalfWidth : earHalfWidth;

    // Offset perpendicular-ish: stem → horizontal; ear → toward inside of curve
    const side = hash(i * 2.3) > 0.5 ? 1 : -1;
    const spread = (hash(i * 4.1) * 0.85 + 0.15) * half * side;
    const along = (hash(i * 6.7) - 0.5) * 0.04;

    const lx = onStem ? spread : p.x + spread * 0.55 + along;
    const ly = onStem ? p.y + along : p.y + spread * 0.35;

    return {
      id: `${item.category.slug}-${item.iIndex}`,
      category: item.category.slug,
      categoryTitle: item.category.title,
      image: item.image,
      x: lx * scaleX,
      y: ly * scaleY,
      z: (hash(i * 9.2) - 0.5) * 2.8,
    };
  });

  const links: GraphLink[] = [];

  for (let i = 0; i < nodes.length - 1; i++) {
    links.push({ source: nodes[i].id, target: nodes[i + 1].id });
    if (i + 2 < nodes.length) {
      links.push({ source: nodes[i].id, target: nodes[i + 2].id });
    }
  }

  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    const near: { j: number; d: number }[] = [];
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 14) near.push({ j, d });
    }
    near.sort((p, q) => p.d - q.d);
    for (const n of near.slice(0, 2)) {
      links.push({ source: a.id, target: nodes[n.j].id });
    }
  }

  return { nodes, links };
}
