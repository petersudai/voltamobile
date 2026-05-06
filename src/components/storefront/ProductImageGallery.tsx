"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Smartphone } from "lucide-react";

interface ProductImageGalleryProps {
  images: string[];
  alt: string;
}

export function ProductImageGallery({ images, alt }: ProductImageGalleryProps) {
  const [active, setActive] = useState(0);
  const [errors, setErrors] = useState<Record<number, boolean>>({});
  const markError = (i: number) => setErrors((e) => ({ ...e, [i]: true }));

  const prev = () => setActive((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActive((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative rounded-2xl overflow-hidden bg-[#111116] aspect-square border border-white/[0.07]">
        {errors[active] ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#111116]">
            <Smartphone className="w-16 h-16 text-gray-800" />
          </div>
        ) : (
          <Image
            src={images[active]}
            alt={`${alt} — photo ${active + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-opacity duration-300"
            priority
            onError={() => markError(active)}
          />
        )}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 border border-white/10 backdrop-blur-sm shadow-lg transition-all"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-4 h-4 text-white/80" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 border border-white/10 backdrop-blur-sm shadow-lg transition-all"
              aria-label="Next photo"
            >
              <ChevronRight className="w-4 h-4 text-white/80" />
            </button>
          </>
        )}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white/70 text-xs px-2.5 py-1 rounded-full border border-white/10">
          {active + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "flex-shrink-0 relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all",
                i === active
                  ? "border-amber-400/70 opacity-100"
                  : "border-white/[0.08] opacity-50 hover:opacity-75 hover:border-white/20"
              )}
            >
              {errors[i] ? (
                <div className="absolute inset-0 flex items-center justify-center bg-[#111116]">
                  <Smartphone className="w-5 h-5 text-gray-700" />
                </div>
              ) : (
                <Image
                  src={img}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                  onError={() => markError(i)}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
