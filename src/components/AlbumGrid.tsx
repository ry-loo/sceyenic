"use client";

import { useState } from "react";
import { TornPhoto } from "@/components/TornPhoto";
import { Lightbox } from "@/components/Lightbox";
import type { PortfolioImage } from "@/data/portfolio";

type AlbumGridProps = {
  images: PortfolioImage[];
};

export function AlbumGrid({ images }: AlbumGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <p className="font-caption text-xs tracking-[0.1em] text-[var(--muted)]">
        No prints on this page yet.
      </p>
    );
  }

  return (
    <>
      <div className="animate-stagger grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
        {images.map((image, index) => (
          <TornPhoto
            key={`${image.src}-${index}`}
            image={image}
            index={index}
            onClick={() => setActiveIndex(index)}
            caption={`${String(index + 1).padStart(2, "0")}`}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          />
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
