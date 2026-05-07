"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Smartphone } from "lucide-react";

interface ProductImageGalleryProps {
  images: string[];
  alt: string;
}

export function ProductImageGallery({ images, alt }: ProductImageGalleryProps) {
  const [active, setActive]   = useState(0);
  const [errors, setErrors]   = useState<Record<number, boolean>>({});
  const touchStartX           = useRef<number>(0);
  const touchStartY           = useRef<number>(0);
  const isDragging            = useRef(false);

  const markError = (i: number) => setErrors((e) => ({ ...e, [i]: true }));

  const prev = () => setActive((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActive((i) => (i === images.length - 1 ? 0 : i + 1));

  // ── Touch swipe handlers ────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current  = false;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    // Only mark as horizontal swipe to avoid triggering on scroll
    if (dx > dy && dx > 8) isDragging.current = true;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current || images.length <= 1) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40)  next(); // swipe left  → next image
    if (diff < -40) prev(); // swipe right → previous image
    isDragging.current = false;
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div
        className="relative rounded-2xl overflow-hidden bg-[#111116] aspect-square border border-white/[0.07] touch-pan-y select-none"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
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
            className="object-contain p-4 transition-opacity duration-300"
            priority
            onError={() => markError(active)}
          />
        )}

        {/* Prev / Next arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 border border-white/10 backdrop-blur-sm shadow-lg transition-all active:scale-95"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-4 h-4 text-white/80" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 border border-white/10 backdrop-blur-sm shadow-lg transition-all active:scale-95"
              aria-label="Next photo"
            >
              <ChevronRight className="w-4 h-4 text-white/80" />
            </button>
          </>
        )}

        {/* Counter */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white/70 text-xs px-2.5 py-1 rounded-full border border-white/10">
          {active + 1} / {images.length}
        </div>

        {/* Swipe hint dots (mobile) */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={cn(
                  "rounded-full transition-all duration-200",
                  i === active
                    ? "w-4 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/40 hover:bg-white/60"
                )}
                aria-label={`Go to photo ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "flex-shrink-0 relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all active:scale-95",
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
