import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlbumGrid } from "@/components/AlbumGrid";
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

  return (
    <div className="px-3 pt-20 pb-12 sm:px-6 sm:pt-24 sm:pb-16 lg:px-10">
      <div className="album-page album-spine relative mx-auto max-w-[1180px] overflow-hidden rounded-sm px-5 py-10 sm:px-10 sm:py-14 lg:px-14">
        <div className="mb-10 sm:mb-12">
          <Link
            href="/#album"
            className="font-caption text-[10px] tracking-[0.16em] text-[var(--muted)] uppercase transition-colors hover:text-[var(--ink)]"
          >
            ← Back to album
          </Link>
          <h1 className="mt-4 text-3xl tracking-wide text-[var(--ink)] sm:text-4xl">
            {category.title}
          </h1>
          <p className="mt-3 max-w-md font-caption text-[11px] leading-relaxed tracking-[0.04em] text-[var(--muted)]">
            {category.description}
          </p>
        </div>

        <AlbumGrid images={category.images} />

        <div className="mt-14 flex flex-wrap gap-3 border-t border-[rgba(60,50,30,0.2)] pt-8">
          {categories
            .filter((c) => c.slug !== category.slug)
            .map((c) => (
              <Link
                key={c.slug}
                href={`/work/${c.slug}`}
                className="font-caption border border-[rgba(60,50,30,0.25)] px-3 py-1.5 text-[10px] tracking-[0.12em] text-[var(--muted)] uppercase transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
              >
                {c.title}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
