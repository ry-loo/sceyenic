import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PhotoGrid } from "@/components/PhotoGrid";
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
    <div className="bg-[#f5f5f7] pt-24 pb-20 sm:pt-28 sm:pb-28">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <div className="mb-10 max-w-2xl sm:mb-14">
          <Link
            href="/#work"
            className="text-[13px] text-[#86868b] transition-colors hover:text-[#1d1d1f]"
          >
            ← Work
          </Link>
          <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1] font-semibold tracking-[-0.045em] text-[#1d1d1f]">
            {category.title}
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-[#86868b]">
            {category.description}
          </p>
        </div>

        <PhotoGrid images={category.images} />

        <div className="mt-16 flex flex-wrap gap-3">
          {categories
            .filter((c) => c.slug !== category.slug)
            .map((c) => (
              <Link
                key={c.slug}
                href={`/work/${c.slug}`}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-[13px] text-[#1d1d1f] transition-colors hover:border-black/25"
              >
                {c.title}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
