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
 * Layout: flex-col with a dedicated image section (flex-1) above a fixed info section.
 * This eliminates the black gap that appeared with the previous all-absolute approach.
 */
export function PrimeFeatureCard({ product }: PrimeFeatureCardProps) {
  const [imgError, setImgError] = useState(false);
  const showBattery =
    product.batteryHealth &&
    ["EX_UK", "REFURBISHED", "USED"].includes(product.condition);

  return (
    <Link
      href={`/phones/${product.slug}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden border border-white/[0.07] hover:border-white/[0.18] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/70 bg-[#0e0e12] h-full"
    >
      {/* ── Image section ────────────────────────────────────────────── */}
      <div className="relative flex-1 min-h-[240px] sm:min-h-[300px] overflow-hidden bg-[#0e0e12]">
        {/* Condition + battery badges */}
        <div className="absolute top-4 left-4 z-10 flex items-start gap-2 flex-wrap">
          <ConditionBadge condition={product.condition} />
          {showBattery && <BatteryBadge health={product.batteryHealth!} size="sm" />}
        </div>

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
            className="object-contain p-6 sm:p-10 transition-transform duration-700 group-hover:scale-[1.03]"
            priority
            onError={() => setImgError(true)}
          />
        )}

        {/* Fade into the info section below */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0e0e12] to-transparent pointer-events-none" />
      </div>

      {/* ── Info section ─────────────────────────────────────────────── */}
      <div className="relative p-5 sm:p-6 bg-[#0e0e12]">
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
