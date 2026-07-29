export type PortfolioImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Category = {
  slug: string;
  title: string;
  description: string;
  images: PortfolioImage[];
};

export const categories: Category[] = [
  {
    slug: "street",
    title: "Street",
    description: "Unscripted moments from the sidewalk.",
    images: [
      { src: "/images/street/01.jpg", alt: "Street photograph 1", width: 800, height: 1200 },
      { src: "/images/street/02.jpg", alt: "Street photograph 2", width: 1200, height: 800 },
      { src: "/images/street/03.jpg", alt: "Street photograph 3", width: 900, height: 900 },
      { src: "/images/street/04.jpg", alt: "Street photograph 4", width: 800, height: 1100 },
      { src: "/images/street/05.jpg", alt: "Street photograph 5", width: 1100, height: 750 },
      { src: "/images/street/06.jpg", alt: "Street photograph 6", width: 850, height: 1200 },
    ],
  },
  {
    slug: "photojournalism",
    title: "Photojournalism",
    description: "Stories told through still frames.",
    images: [
      { src: "/images/photojournalism/01.jpg", alt: "Photojournalism 1", width: 1200, height: 800 },
      { src: "/images/photojournalism/02.jpg", alt: "Photojournalism 2", width: 800, height: 1200 },
      { src: "/images/photojournalism/03.jpg", alt: "Photojournalism 3", width: 1000, height: 700 },
      { src: "/images/photojournalism/04.jpg", alt: "Photojournalism 4", width: 900, height: 1200 },
      { src: "/images/photojournalism/05.jpg", alt: "Photojournalism 5", width: 1100, height: 900 },
      { src: "/images/photojournalism/06.jpg", alt: "Photojournalism 6", width: 800, height: 1000 },
    ],
  },
  {
    slug: "graduation",
    title: "Graduation",
    description: "Milestones, portraits, and celebration.",
    images: [
      { src: "/images/graduation/01.jpg", alt: "Graduation photograph 1", width: 900, height: 1200 },
      { src: "/images/graduation/02.jpg", alt: "Graduation photograph 2", width: 1200, height: 800 },
      { src: "/images/graduation/03.jpg", alt: "Graduation photograph 3", width: 900, height: 900 },
      { src: "/images/graduation/04.jpg", alt: "Graduation photograph 4", width: 800, height: 1100 },
      { src: "/images/graduation/05.jpg", alt: "Graduation photograph 5", width: 1100, height: 750 },
      { src: "/images/graduation/06.jpg", alt: "Graduation photograph 6", width: 850, height: 1200 },
    ],
  },
  {
    slug: "headshots",
    title: "Headshots",
    description: "Clean, considered portraits for work and life.",
    images: [
      { src: "/images/headshots/01.jpg", alt: "Headshot 1", width: 800, height: 1000 },
      { src: "/images/headshots/02.jpg", alt: "Headshot 2", width: 900, height: 900 },
      { src: "/images/headshots/03.jpg", alt: "Headshot 3", width: 800, height: 1100 },
      { src: "/images/headshots/04.jpg", alt: "Headshot 4", width: 1000, height: 800 },
      { src: "/images/headshots/05.jpg", alt: "Headshot 5", width: 850, height: 1100 },
      { src: "/images/headshots/06.jpg", alt: "Headshot 6", width: 900, height: 1200 },
    ],
  },
  {
    slug: "event",
    title: "Event",
    description: "Atmosphere, detail, and energy from the room.",
    images: [
      { src: "/images/event/01.jpg", alt: "Event photograph 1", width: 1200, height: 800 },
      { src: "/images/event/02.jpg", alt: "Event photograph 2", width: 800, height: 1200 },
      { src: "/images/event/03.jpg", alt: "Event photograph 3", width: 1100, height: 750 },
      { src: "/images/event/04.jpg", alt: "Event photograph 4", width: 900, height: 1200 },
      { src: "/images/event/05.jpg", alt: "Event photograph 5", width: 1000, height: 900 },
      { src: "/images/event/06.jpg", alt: "Event photograph 6", width: 850, height: 1100 },
    ],
  },
];

export const categorySlugs = categories.map((c) => c.slug);

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getAllImages(): PortfolioImage[] {
  return categories.flatMap((c) => c.images);
}

export const navLinks = [
  ...categories.map((c) => ({
    href: `/work/${c.slug}`,
    label: c.title,
  })),
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const socialLinks = [
  { href: "https://instagram.com", label: "Instagram", icon: "instagram" as const },
  { href: "https://linkedin.com", label: "LinkedIn", icon: "linkedin" as const },
];

export const site = {
  name: "sceyenic",
  email: "hello@sceyenic.com",
  tagline: "Photography",
};
