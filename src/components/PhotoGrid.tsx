"use client";

import { useState } from "react";
import Image from "next/image";
import type { PortfolioImage } from "@/data/portfolio";
import { Lightbox } from "./Lightbox";

type PhotoGridProps = {
  images: PortfolioImage[];
};

export function PhotoGrid({ images }: PhotoGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <p className="text-[15px] text-[#86868b]">No images yet.</p>
    );
  }

  return (
    <>
      <div className="animate-stagger grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
        {images.map((image, index) => (
          <button
            key={`${image.src}-${index}`}
            type="button"
            className="group relative aspect-[4/5] overflow-hidden rounded-[22px] bg-[#e8e8ed] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d1d1f]"
            onClick={() => setActiveIndex(index)}
            aria-label={`View ${image.alt}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <Lightbox
          images={images}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onChange={setActiveIndex}
        />
      )}
    </>
  );
}
