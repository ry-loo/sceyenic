"use client";

import { useState } from "react";
import Image from "next/image";
import type { PortfolioImage } from "@/data/portfolio";
import { Lightbox } from "./Lightbox";

type MasonryGalleryProps = {
  images: PortfolioImage[];
};

export function MasonryGallery({ images }: MasonryGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <p className="font-mono text-xs tracking-[0.12em] text-[#888] uppercase">
        No images yet
      </p>
    );
  }

  return (
    <>
      <div className="masonry columns-1 gap-6 sm:columns-2 xl:columns-3 2xl:columns-4">
        {images.map((image, index) => (
          <button
            key={`${image.src}-${index}`}
            type="button"
            className="masonry-item mb-6 block w-full break-inside-avoid overflow-hidden text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111]"
            onClick={() => setActiveIndex(index)}
            style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
            aria-label={`View ${image.alt}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="h-auto w-full object-cover transition-opacity duration-300 hover:opacity-85"
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, (max-width: 1536px) 33vw, 25vw"
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
