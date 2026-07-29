"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { categories } from "@/data/portfolio";

const PhotoGraph = dynamic(
  () => import("@/components/PhotoGraph").then((m) => m.PhotoGraph),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-dvh w-full items-center justify-center bg-transparent">
        <p className="text-[13px] tracking-[0.18em] text-white/40 uppercase">
          Loading graph…
        </p>
      </div>
    ),
  },
);

export default function HomePage() {
  return (
    <>
      <PhotoGraph />

      <section className="relative z-10 bg-black">
        <div className="mx-auto max-w-[1400px] px-5 pt-20 pb-24 sm:px-8 sm:pt-28 sm:pb-32 lg:px-10">
          <div className="mb-8 max-w-2xl">
            <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.1] font-semibold tracking-[-0.04em] text-white">
              Explore my work
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category) =>
              category.images[0] ? (
                <Link
                  key={category.slug}
                  href={`/work/${category.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-white/5">
                    <Image
                      src={category.images[0].src}
                      alt={category.images[0].alt}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    />
                  </div>
                  <div className="mt-3">
                    <h3 className="text-[15px] font-medium text-white">
                      {category.title}
                    </h3>
                  </div>
                </Link>
              ) : null,
            )}
          </div>
        </div>
      </section>
    </>
  );
}
