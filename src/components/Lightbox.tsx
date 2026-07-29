"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";
import type { PortfolioImage } from "@/data/portfolio";

type LightboxProps = {
  images: PortfolioImage[];
  index: number;
  onClose: () => void;
  onChange: (index: number) => void;
};

export function Lightbox({ images, index, onClose, onChange }: LightboxProps) {
  const image = images[index];

  const prev = useCallback(() => {
    onChange((index - 1 + images.length) % images.length);
  }, [index, images.length, onChange]);

  const next = useCallback(() => {
    onChange((index + 1) % images.length);
  }, [index, images.length, onChange]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/92 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute top-5 right-5 z-10 rounded-full bg-white/10 px-4 py-2 text-[13px] text-white/90 backdrop-blur-md transition-colors hover:bg-white/20"
        onClick={onClose}
        aria-label="Close lightbox"
      >
        Close
      </button>

      <button
        type="button"
        className="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-white/10 px-4 py-2 text-[13px] text-white/90 backdrop-blur-md transition-colors hover:bg-white/20 sm:left-6"
        onClick={(e) => {
          e.stopPropagation();
          prev();
        }}
        aria-label="Previous image"
      >
        Prev
      </button>

      <button
        type="button"
        className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-white/10 px-4 py-2 text-[13px] text-white/90 backdrop-blur-md transition-colors hover:bg-white/20 sm:right-6"
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
        aria-label="Next image"
      >
        Next
      </button>

      <div
        className="relative mx-auto flex max-h-[88dvh] max-w-[90vw] items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className="max-h-[88dvh] w-auto max-w-full rounded-lg object-contain"
          sizes="90vw"
          priority
        />
      </div>

      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[13px] text-white/45">
        {index + 1} / {images.length}
      </p>
    </div>
  );
}
