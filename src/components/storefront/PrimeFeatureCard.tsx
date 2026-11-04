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
      className="group relative flex flex-col rounded-3xl overflow-hidden border border-blue-400/20 hover:border-blue-400/50 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_-20px_rgba(37,99,235,0.55)] shadow-[0_20px_60px_-30px_rgba(37,99,235,0.45)] bg-surface h-full"
    >
      {/* ── Image section ────────────────────────────────────────────── */}
      <div className="relative flex-1 min-h-[240px] sm:min-h-[300px] overflow-hidden bg-surface bg-[radial-gradient(ellipse_at_50%_45%,rgba(37,99,235,0.4),rgba(37,99,235,0.1)_45%,transparent_70%)]">
        {/* Condition + battery badges */}
        <div className="absolute top-4 left-4 z-10 flex items-start gap-2 flex-wrap">
          <ConditionBadge condition={product.condition} />
          {showBattery && <BatteryBadge health={product.batteryHealth!} size="sm" />}
        </div>

        {imgError || !product.images[0] ? (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-2">
            <Smartphone className="w-16 h-16 text-ink-3" />
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
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface to-transparent pointer-events-none" />
      </div>

      {/* ── Info section ─────────────────────────────────────────────── */}
      <div className="relative p-5 sm:p-6 bg-surface">
        {/* Brand */}
        <p className="text-[10px] font-black text-ink-3 uppercase tracking-[0.22em] mb-1.5">
          {product.brand.name}
        </p>

        {/* Name */}
        <h3 className="text-xl sm:text-2xl font-black text-ink leading-tight line-clamp-2 group-hover:text-ink transition-colors">
          {product.name}
        </h3>

        {/* Spec chips */}
        <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
          <span className="text-xs text-ink-2 bg-ink/[0.07] border border-line px-2 py-0.5 rounded-md">
            {product.storageCapacity}
          </span>
          <span className="text-xs text-ink-2 bg-ink/[0.07] border border-line px-2 py-0.5 rounded-md">
            {product.color}
          </span>
          {product.ram && (
            <span className="text-xs text-ink-2 bg-ink/[0.07] border border-line px-2 py-0.5 rounded-md">
              {product.ram}
            </span>
          )}
        </div>

        {/* Price row */}
        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-2xl font-black text-price leading-none tabular">
              {formatKES(product.priceKES)}
            </p>
            {product.marketPriceKES && product.marketPriceKES > product.priceKES && (
              <p className="text-xs text-ink-3 line-through mt-1">
                {formatKES(product.marketPriceKES)}
              </p>
            )}
          </div>

          {/* CTA button */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ink text-page text-sm font-bold group-hover:bg-amber-400 group-hover:text-gray-950 transition-colors duration-200 flex-shrink-0">
            View Phone
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
