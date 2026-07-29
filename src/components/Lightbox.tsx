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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 animate-lightbox-in"
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      onClick={onClose}
    >
      <button
        type="button"
        className="nav-link absolute right-5 top-5 z-10 text-white/80 hover:text-white"
        onClick={onClose}
        aria-label="Close lightbox"
      >
        Close
      </button>

      <button
        type="button"
        className="nav-link absolute left-3 top-1/2 z-10 -translate-y-1/2 text-white/70 hover:text-white sm:left-6"
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
        className="nav-link absolute right-3 top-1/2 z-10 -translate-y-1/2 text-white/70 hover:text-white sm:right-6"
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
        aria-label="Next image"
      >
        Next
      </button>

      <div
        className="relative mx-auto flex max-h-[90dvh] max-w-[92vw] items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className="max-h-[90dvh] w-auto max-w-full object-contain"
          sizes="92vw"
          priority
        />
      </div>

      <p className="nav-link absolute bottom-5 left-1/2 -translate-x-1/2 text-white/50">
        {index + 1} / {images.length}
      </p>
    </div>
  );
}
