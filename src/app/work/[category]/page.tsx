import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MasonryGallery } from "@/components/MasonryGallery";
import { categories, getCategory } from "@/data/portfolio";

type PageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: "Work" };
  return {
    title: category.title,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  return <MasonryGallery images={category.images} />;
}
