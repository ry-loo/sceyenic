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
    <div className="relative pt-24 pb-20 sm:pt-28 sm:pb-28">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <div className="mb-10 max-w-2xl sm:mb-14">
          <Link
            href="/"
            className="text-[13px] text-white/40 transition-colors hover:text-white"
          >
            ← Graph
          </Link>
          <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1] font-semibold tracking-[-0.045em] text-white">
            {category.title}
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-white/50">
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
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[13px] text-white/80 transition-colors hover:border-white/35 hover:bg-white/10"
              >
                {c.title}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
