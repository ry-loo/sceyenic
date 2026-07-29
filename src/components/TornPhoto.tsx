"use client";

import Image from "next/image";
import type { PortfolioImage } from "@/data/portfolio";

const rotations = [-3.2, 2.4, -1.6, 3.5, -2.8, 1.9, -3.8, 2.1, -1.2, 3.1];
const tapes = ["tape-amber", "tape-mint", "tape-rose", "tape-clear"] as const;

type TornPhotoProps = {
  image: PortfolioImage;
  index?: number;
  className?: string;
  onClick?: () => void;
  caption?: string;
  showTape?: boolean;
  sizes?: string;
  priority?: boolean;
};

export function TornPhoto({
  image,
  index = 0,
  className = "",
  onClick,
  caption,
  showTape = true,
  sizes = "(max-width: 768px) 90vw, 33vw",
  priority = false,
}: TornPhotoProps) {
  const rotate = rotations[index % rotations.length];
  const tape = tapes[index % tapes.length];
  const variant = (index % 3) + 1;

  const inner = (
    <>
      {showTape && (
        <span
          className={`photo-tape ${tape}`}
          style={{
            left: `${18 + (index % 5) * 8}%`,
            transform: `rotate(${-12 + (index % 4) * 6}deg)`,
          }}
          aria-hidden
        />
      )}
      <span className="torn-frame">
        <span className="torn-print">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className="torn-img"
            sizes={sizes}
            priority={priority}
          />
        </span>
      </span>
      {caption && <span className="photo-caption">{caption}</span>}
    </>
  );

  const sharedClass = `torn-photo torn-v${variant} ${className}`;
  const style = { "--photo-rotate": `${rotate}deg` } as React.CSSProperties;

  if (onClick) {
    return (
      <button
        type="button"
        className={sharedClass}
        style={style}
        onClick={onClick}
        aria-label={`View ${image.alt}`}
      >
        {inner}
      </button>
    );
  }

  return (
    <div className={sharedClass} style={style}>
      {inner}
    </div>
  );
}
