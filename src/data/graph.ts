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

  const clusterRadius = 36;
  const categoryCount = categories.length;

  categories.forEach((category, cIndex) => {
    const angle = (cIndex / categoryCount) * Math.PI * 2;
    const cx = Math.cos(angle) * clusterRadius;
    const cz = Math.sin(angle) * clusterRadius;
    const cy = (hash(cIndex + 3) - 0.5) * 20;

    const ids: string[] = [];

    category.images.forEach((image, iIndex) => {
      const id = `${category.slug}-${iIndex}`;
      ids.push(id);

      const a = hash(cIndex * 80 + iIndex) * Math.PI * 2;
      const b = hash(cIndex * 80 + iIndex + 17) * Math.PI;
      const r = 5 + hash(cIndex * 80 + iIndex + 29) * 14;

      nodes.push({
        id,
        category: category.slug,
        categoryTitle: category.title,
        image,
        x: cx + Math.sin(b) * Math.cos(a) * r,
        y: cy + Math.cos(b) * r * 0.75,
        z: cz + Math.sin(b) * Math.sin(a) * r,
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

  return { nodes, links };
}
