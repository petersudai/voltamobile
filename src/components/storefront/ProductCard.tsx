"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Smartphone, ArrowUpRight } from "lucide-react";
import { ConditionBadge } from "./ConditionBadge";
import { BatteryBadge } from "./BatteryBadge";
import { formatKES, formatUSD, discount } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  className?: string;
  /** Pass true for above-the-fold cards to skip lazy loading */
  priority?: boolean;
}

export function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const hasDiscount = product.marketPriceKES && product.marketPriceKES > product.priceKES;
  const discountPct = hasDiscount ? discount(product.marketPriceKES!, product.priceKES) : 0;
  const showBattery =
    product.batteryHealth && ["EX_UK", "REFURBISHED", "USED"].includes(product.condition);

  return (
    <Link
      href={`/phones/${product.slug}`}
      className={cn(
        "group relative bg-[#0e0e12] rounded-2xl overflow-hidden border border-white/[0.07] hover:border-white/[0.16] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/60 flex flex-col",
        !product.isAvailable && "opacity-60 pointer-events-none",
        className
      )}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] bg-[#0e0e12]">
        {imgError || !product.images[0] ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#111116]">
            <Smartphone className="w-10 h-10 text-gray-800" />
          </div>
        ) : (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            priority={priority}
            onError={() => setImgError(true)}
          />
        )}

        {/* Gradient — from-color must match bg-[#0e0e12] exactly so the seam is invisible */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e12] via-[#0e0e12]/30 to-transparent" />

        {/* Condition + discount — top left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <ConditionBadge condition={product.condition} />
          {discountPct > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-red-500/90 text-white backdrop-blur-sm">
              -{discountPct}%
            </span>
          )}
        </div>

        {/* Battery — bottom left */}
        {showBattery && (
          <div className="absolute bottom-3 left-3">
            <BatteryBadge health={product.batteryHealth!} size="sm" />
          </div>
        )}

        {/* View arrow — bottom right, reveals on hover */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
          <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-full p-1.5">
            <ArrowUpRight className="w-3.5 h-3.5 text-white" />
          </div>
        </div>

        {/* Sold-out overlay */}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-[#0e0e12]/80 flex items-center justify-center backdrop-blur-[2px]">
            <span className="border border-white/15 text-white/60 font-semibold text-xs px-4 py-1.5 rounded-full">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 gap-2 sm:gap-3">
        {/* Brand + name */}
        <div>
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.18em] mb-0.5 sm:mb-1">
            {product.brand.name}
          </p>
          <h3 className="text-white/85 font-semibold text-[13px] sm:text-sm leading-snug line-clamp-2 group-hover:text-white transition-colors duration-200">
            {product.name}
          </h3>
        </div>

        {/* Spec chips — hide RAM on smallest screens to save space */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
          <span className="text-[10px] sm:text-[11px] text-gray-600 bg-white/[0.04] border border-white/[0.05] px-1.5 sm:px-2 py-0.5 rounded-md">
            {product.storageCapacity}
          </span>
          <span className="text-[10px] sm:text-[11px] text-gray-600 bg-white/[0.04] border border-white/[0.05] px-1.5 sm:px-2 py-0.5 rounded-md">
            {product.color}
          </span>
          {product.ram && (
            <span className="hidden sm:inline-flex text-[11px] text-gray-600 bg-white/[0.04] border border-white/[0.05] px-2 py-0.5 rounded-md">
              {product.ram}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mt-auto flex items-end justify-between gap-1 sm:gap-2">
          <div>
            <p className="text-base sm:text-lg font-black text-amber-400 leading-none">
              {formatKES(product.priceKES)}
            </p>
            {product.priceUSD && (
              <p className="hidden sm:block text-[11px] text-gray-600 mt-1">{formatUSD(product.priceUSD)}</p>
            )}
          </div>
          {hasDiscount && (
            <p className="text-[10px] sm:text-xs text-gray-700 line-through pb-0.5">
              {formatKES(product.marketPriceKES!)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
