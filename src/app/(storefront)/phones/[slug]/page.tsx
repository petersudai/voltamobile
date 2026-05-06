export const dynamic = "force-dynamic";

import { cache } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductImageGallery } from "@/components/storefront/ProductImageGallery";
import { ConditionBadge } from "@/components/storefront/ConditionBadge";
import { BatteryBadge } from "@/components/storefront/BatteryBadge";
import { WhatsAppButton } from "@/components/storefront/WhatsAppButton";
import { formatKES, formatUSD, discount } from "@/lib/format";
import { MapPin, Clock, ShieldCheck, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/types";

type Props = { params: Promise<{ slug: string }> };

// React cache() deduplicates the DB query when both generateMetadata and the
// page component call getProduct with the same slug in the same request.
const getProduct = cache(async (slug: string) => {
  return prisma.product.findUnique({
    where: { slug },
    include: { brand: true },
  });
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name} — ${product.condition.replace("_", " ")}`,
    description: `Buy ${product.name} in Nairobi CBD. ${product.condition === "EX_UK" ? "Ex-UK import, " : ""}${product.batteryHealth ? `Battery: ${product.batteryHealth}%, ` : ""}Price: ${formatKES(product.priceKES)}.`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const p = product as unknown as Product;
  const hasDiscount = p.marketPriceKES && p.marketPriceKES > p.priceKES;
  const discountPct = hasDiscount ? discount(p.marketPriceKES!, p.priceKES) : 0;
  const showBattery = p.batteryHealth && ["EX_UK", "REFURBISHED", "USED"].includes(p.condition);

  return (
    <div className="min-h-screen bg-[#09090c] pt-20 pb-24 sm:pb-0">
      {/* Breadcrumbs */}
      <div className="border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-700" />
            <Link href="/phones" className="hover:text-gray-300 transition-colors">Phones</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-700" />
            <Link href={`/phones?brand=${p.brand.slug}`} className="hover:text-gray-300 transition-colors">
              {p.brand.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-700" />
            <span className="text-gray-400 font-medium truncate max-w-48">{p.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16">
          {/* Left: Image gallery */}
          <div>
            <ProductImageGallery images={p.images} alt={p.name} />
          </div>

          {/* Right: Product info */}
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <ConditionBadge condition={p.condition} />
                {showBattery && <BatteryBadge health={p.batteryHealth!} size="md" />}
                {discountPct > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white">
                    -{discountPct}% OFF
                  </span>
                )}
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.18em] mb-1">
                {p.brand.name}
              </p>
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {p.name}
              </h1>
            </div>

            {/* Specs chips */}
            <div className="flex flex-wrap gap-2">
              {[
                p.storageCapacity,
                p.ram,
                p.color,
                ...(p.batteryHealth ? [`🔋 ${p.batteryHealth}% Battery`] : []),
              ]
                .filter(Boolean)
                .map((spec) => (
                  <span
                    key={spec}
                    className="px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-gray-400 text-sm font-medium"
                  >
                    {spec}
                  </span>
                ))}
            </div>

            {/* Price block */}
            <div className="bg-white/[0.03] rounded-2xl border border-white/[0.08] p-5">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-black text-amber-400 leading-none">
                  {formatKES(p.priceKES)}
                </span>
                {p.priceUSD && (
                  <span className="text-lg text-gray-400 font-medium">
                    {formatUSD(p.priceUSD)}
                  </span>
                )}
              </div>
              {hasDiscount && (
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-400 line-through">
                    Market: {formatKES(p.marketPriceKES!)}
                  </span>
                  <span className="text-sm font-semibold text-emerald-400">
                    You save {formatKES(p.marketPriceKES! - p.priceKES)}
                  </span>
                </div>
              )}
              {p.marketPriceUSD && (
                <p className="text-xs text-gray-500 mt-1">
                  Market USD: {formatUSD(p.marketPriceUSD)}
                </p>
              )}
            </div>

            {/* WhatsApp CTA — sticky bottom bar on mobile, inline on desktop */}
            <div className="flex flex-col gap-3">
              {/* Desktop CTA (hidden on mobile — the sticky bar below handles it) */}
              <div className="hidden sm:block">
                <WhatsAppButton
                  productName={p.name}
                  condition={p.condition}
                  priceKES={p.priceKES}
                  size="lg"
                  fullWidth
                />
              </div>
              <div className="flex items-center gap-3 sm:gap-4 text-xs text-gray-400 justify-center flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Nairobi CBD
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Same-day delivery
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified stock
                </span>
              </div>
            </div>

            {/* Description */}
            {p.description && (
              <div className="border-t border-white/[0.06] pt-5">
                <h2 className="font-bold text-white mb-3">Device Notes</h2>
                <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {p.description}
                </div>
              </div>
            )}

            {/* Trust signals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 border-t border-white/[0.06] pt-5">
              {[
                { icon: "🏪", label: "Physical store", sub: "Inspect in person" },
                { icon: "🔋", label: "Battery certified", sub: "Health tested & shown" },
                { icon: "🇬🇧", label: "Genuine Ex-UK", sub: "Not a Chinese replica" },
                { icon: "🤝", label: "7-day concern policy", sub: "We stand behind it" },
              ].map((t) => (
                <div key={t.label} className="flex items-start gap-2.5 p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                  <span className="text-xl flex-shrink-0">{t.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-white/85">{t.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{t.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile sticky CTA bar ─────────────────────────────────────────────── */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#09090c]/95 backdrop-blur-xl border-t border-white/[0.08] px-4 py-3" style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}>
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-gray-500 leading-none mb-0.5 truncate">{p.name}</p>
            <p className="text-lg font-black text-amber-400 leading-none">{formatKES(p.priceKES)}</p>
          </div>
          <WhatsAppButton
            productName={p.name}
            condition={p.condition}
            priceKES={p.priceKES}
            size="md"
          />
        </div>
      </div>
    </div>
  );
}
