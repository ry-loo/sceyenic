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

/** Deterministic pseudo-random from string */
function hash(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function buildPhotoGraph(): { nodes: GraphNode[]; links: GraphLink[] } {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  const clusterRadius = 28;
  const categoryCount = categories.length;

  categories.forEach((category, cIndex) => {
    const angle = (cIndex / categoryCount) * Math.PI * 2;
    const cx = Math.cos(angle) * clusterRadius;
    const cz = Math.sin(angle) * clusterRadius;
    const cy = (hash(cIndex + 3) - 0.5) * 16;

    const ids: string[] = [];

    category.images.forEach((image, iIndex) => {
      const id = `${category.slug}-${iIndex}`;
      ids.push(id);

      const a = hash(cIndex * 50 + iIndex) * Math.PI * 2;
      const b = hash(cIndex * 50 + iIndex + 17) * Math.PI;
      const r = 6 + hash(cIndex * 50 + iIndex + 29) * 10;

      nodes.push({
        id,
        category: category.slug,
        categoryTitle: category.title,
        image,
        x: cx + Math.sin(b) * Math.cos(a) * r,
        y: cy + Math.cos(b) * r * 0.7,
        z: cz + Math.sin(b) * Math.sin(a) * r,
      });
    });

    // Ring links within category
    for (let i = 0; i < ids.length; i++) {
      links.push({
        source: ids[i],
        target: ids[(i + 1) % ids.length],
      });
      if (i + 2 < ids.length) {
        links.push({ source: ids[i], target: ids[i + 2] });
      }
    }

    // Bridge to next category
    const next = categories[(cIndex + 1) % categoryCount];
    if (ids[0] && next.images[0]) {
      links.push({
        source: ids[0],
        target: `${next.slug}-0`,
      });
    }
  });

  // A few longer cross links for that dense web feel
  for (let i = 0; i < nodes.length; i += 5) {
    const j = (i + 7) % nodes.length;
    if (nodes[i] && nodes[j] && nodes[i].category !== nodes[j].category) {
      links.push({ source: nodes[i].id, target: nodes[j].id });
    }
  }

  return { nodes, links };
}
