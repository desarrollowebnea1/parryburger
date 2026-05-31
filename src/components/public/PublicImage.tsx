"use client";

import Image from "next/image";
import { PLACEHOLDER_FOOD } from "@/lib/format";
import { toObjectPosition } from "@/lib/image-position";

type PublicImageProps = {
  src?: string | null;
  alt: string;
  position?: string | null;
  /** Altura fija (cards, modal) */
  heightClass?: string;
  /** Proporción (hero): ej. aspect-[4/5] */
  aspectClass?: string;
  className?: string;
  roundedClass?: string;
  priority?: boolean;
  sizes?: string;
};

export default function PublicImage({
  src,
  alt,
  position,
  heightClass,
  aspectClass,
  className = "",
  roundedClass = "",
  priority = false,
  sizes = "100vw",
}: PublicImageProps) {
  const imageSrc = src?.trim() || PLACEHOLDER_FOOD;
  const objectPosition = toObjectPosition(position);
  const sizeClass = aspectClass ?? heightClass ?? "h-[135px]";

  return (
    <div
      className={`relative w-full overflow-hidden bg-brand-black2 ${sizeClass} ${roundedClass} ${className}`}
    >
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="h-full w-full object-cover"
        style={{ objectPosition }}
      />
    </div>
  );
}
