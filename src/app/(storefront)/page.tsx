export const dynamic = "force-dynamic";

import { Hero } from "@/components/storefront/Hero";
import { TrustBar } from "@/components/storefront/TrustBar";
import { BrandShowcase } from "@/components/storefront/BrandShowcase";
import { FeaturedProducts } from "@/components/storefront/FeaturedProducts";
import { getHeroImageUrl, HERO_IMAGE_DEFAULT } from "@/lib/settings";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import type { Product } from "@/types";

async function getHeroProduct() {
  return prisma.product.findFirst({
    where: { isHero: true, isAvailable: true },
    include: { brand: true },
  }) as Promise<Product | null>;
}

export default async function HomePage() {
  const [heroProduct, fallbackImageUrl] = await Promise.all([
    getHeroProduct(),
    getHeroImageUrl(),
  ]);

  // If a hero product is set, use its first image; otherwise fall back to the
  // Settings-uploaded image (or the built-in default).
  const heroImageUrl =
    heroProduct?.images?.[0] ?? fallbackImageUrl ?? HERO_IMAGE_DEFAULT;

  return (
    <>
      <Hero heroImageUrl={heroImageUrl} heroProduct={heroProduct} />
      <TrustBar />
      <Suspense
        fallback={
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        }
      >
        <FeaturedProducts />
      </Suspense>
      <BrandShowcase />
      <WhyVoltaSection />
    </>
  );
}

function WhyVoltaSection() {
  const reasons = [
    {
      num: "01",
      emoji: "🔋",
      title: "Battery Health First",
      body: "Every Ex-UK and refurbished phone is tested. The exact battery percentage is shown on each listing — no surprises after purchase.",
    },
    {
      num: "02",
      emoji: "🇬🇧",
      title: "Authentic Ex-UK Stock",
      body: "Sourced directly from the UK market — genuine devices, not Chinese replicas. The condition you see is exactly what you get.",
    },
    {
      num: "03",
      emoji: "🏪",
      title: "Walk In, Walk Out",
      body: "Our physical store in Nairobi CBD lets you inspect the device before buying. No blind purchases, ever.",
    },
    {
      num: "04",
      emoji: "⚡",
      title: "Same-Day Delivery",
      body: "Order before 2 PM and we deliver within Nairobi the same day. In CBD? Just walk in — we'll be ready.",
    },
    {
      num: "05",
      emoji: "💰",
      title: "Honest Pricing",
      body: "We show you both the market price and our price. What you see is what you pay — no hidden fees, no tricks.",
    },
    {
      num: "06",
      emoji: "🤝",
      title: "After-Sales Support",
      body: "WhatsApp us any time after purchase. Every device we sell is backed by our 7-Day Exchange Guarantee.",
    },
  ];

  return (
    <section className="bg-[#050508] border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="mb-16 max-w-xl">
          <p className="text-blue-500 text-xs font-bold uppercase tracking-[0.2em] mb-4">
            Our Promise
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">
            Why Nairobi<br />Trusts Volta
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.05] rounded-3xl overflow-hidden border border-white/[0.05]">
          {reasons.map((r) => (
            <div
              key={r.title}
              className="p-8 bg-[#050508] hover:bg-[#0a0a10] transition-colors duration-300 group"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="text-3xl">{r.emoji}</span>
                <span className="text-5xl font-black text-white/[0.04] group-hover:text-white/[0.07] transition-colors leading-none">
                  {r.num}
                </span>
              </div>
              <h3 className="font-bold text-white text-base mb-2">{r.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{r.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
