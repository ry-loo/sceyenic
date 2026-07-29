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
          {categories.map((category) => (
            <div key={category.slug} className="mt-20 first:mt-0">
              <div className="mb-6 flex items-end justify-between sm:mb-8">
                <div>
                  <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.1] font-semibold tracking-[-0.04em] text-white">
                    {category.title}
                  </h2>
                  <p className="mt-2 text-[15px] text-white/45">
                    {category.description}
                  </p>
                </div>
                <Link
                  href={`/work/${category.slug}`}
                  className="hidden shrink-0 text-[13px] text-white/50 transition-colors hover:text-white sm:block"
                >
                  View all →
                </Link>
              </div>

              {category.images[0] && (
                <Link
                  href={`/work/${category.slug}`}
                  className="group relative block aspect-[16/9] overflow-hidden rounded-[20px] bg-white/5 sm:rounded-[24px]"
                >
                  <Image
                    src={category.images[0].src}
                    alt={category.images[0].alt}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    sizes="100vw"
                  />
                </Link>
              )}

              <Link
                href={`/work/${category.slug}`}
                className="mt-5 block text-center text-[13px] text-white/50 transition-colors hover:text-white sm:hidden"
              >
                View all →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
