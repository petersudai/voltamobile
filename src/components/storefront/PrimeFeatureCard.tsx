"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Smartphone } from "lucide-react";
import { ConditionBadge } from "./ConditionBadge";
import { BatteryBadge } from "./BatteryBadge";
import { formatKES } from "@/lib/format";
import type { Product } from "@/types";

interface PrimeFeatureCardProps {
  product: Product;
}

/**
 * Large editorial card for the prime (2-column) slot in the featured bento grid.
 * The product image fills the entire card; product info is overlaid at the bottom.
 * This eliminates dead space and the blurriness caused by a small image in a tall card.
 */
export function PrimeFeatureCard({ product }: PrimeFeatureCardProps) {
  const [imgError, setImgError] = useState(false);
  const showBattery =
    product.batteryHealth &&
    ["EX_UK", "REFURBISHED", "USED"].includes(product.condition);

  return (
    <Link
      href={`/phones/${product.slug}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden border border-white/[0.07] hover:border-white/[0.18] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/70 bg-[#0e0e12] h-full min-h-[420px]"
    >
      {/* Full-bleed image */}
      <div className="absolute inset-0">
        {imgError || !product.images[0] ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#111116]">
            <Smartphone className="w-16 h-16 text-gray-800" />
          </div>
        ) : (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            priority
            onError={() => setImgError(true)}
          />
        )}

        {/* Bottom gradient — darkens lower 60% so text is always readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        {/* Subtle top vignette for badge legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent h-1/3" />
      </div>

      {/* Top-left: condition + battery */}
      <div className="relative p-5 flex items-start gap-2 flex-wrap">
        <ConditionBadge condition={product.condition} />
        {showBattery && <BatteryBadge health={product.batteryHealth!} size="sm" />}
      </div>

      {/* Spacer — pushes content to bottom */}
      <div className="flex-1" />

      {/* Bottom overlay — product info */}
      <div className="relative p-5 sm:p-6">
        {/* Brand */}
        <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.22em] mb-1.5">
          {product.brand.name}
        </p>

        {/* Name */}
        <h3 className="text-xl sm:text-2xl font-black text-white leading-tight line-clamp-2 group-hover:text-white transition-colors">
          {product.name}
        </h3>

        {/* Spec chips */}
        <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
          <span className="text-[11px] text-gray-400 bg-white/[0.07] border border-white/[0.08] px-2 py-0.5 rounded-md">
            {product.storageCapacity}
          </span>
          <span className="text-[11px] text-gray-400 bg-white/[0.07] border border-white/[0.08] px-2 py-0.5 rounded-md">
            {product.color}
          </span>
          {product.ram && (
            <span className="text-[11px] text-gray-400 bg-white/[0.07] border border-white/[0.08] px-2 py-0.5 rounded-md">
              {product.ram}
            </span>
          )}
        </div>

        {/* Price row */}
        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-2xl font-black text-amber-400 leading-none">
              {formatKES(product.priceKES)}
            </p>
            {product.marketPriceKES && product.marketPriceKES > product.priceKES && (
              <p className="text-xs text-gray-600 line-through mt-1">
                {formatKES(product.marketPriceKES)}
              </p>
            )}
          </div>

          {/* CTA button */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-gray-900 text-sm font-bold group-hover:bg-amber-400 transition-colors duration-200 flex-shrink-0">
            View Phone
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
