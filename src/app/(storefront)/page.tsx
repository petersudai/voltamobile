export const dynamic = "force-dynamic";

import { Hero } from "@/components/storefront/Hero";
import { BrandShowcase } from "@/components/storefront/BrandShowcase";
import { FeaturedProducts } from "@/components/storefront/FeaturedProducts";
import { getHeroImageUrl, HERO_IMAGE_DEFAULT } from "@/lib/settings";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import { BatteryCharging, Loader2, Plane, ShieldCheck, Store, Tag, Truck } from "lucide-react";
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
      Icon: BatteryCharging,
      tint: "from-emerald-400 to-cyan-400",
      title: "Battery health on every listing",
      body: "Ex-UK and refurbished phones are tested, and the exact battery percentage is on the listing.",
    },
    {
      Icon: Plane,
      tint: "from-blue-400 to-indigo-400",
      title: "Imported from the UK",
      body: "Genuine devices from the UK market. The condition on the listing is the condition of the phone.",
    },
    {
      Icon: Store,
      tint: "from-amber-300 to-orange-400",
      title: "Inspect it in the shop",
      body: "Visit us on Moi Avenue and check the phone before you buy it.",
    },
    {
      Icon: Truck,
      tint: "from-cyan-300 to-blue-400",
      title: "Same-day delivery",
      body: "Order before 2 PM and it reaches you in Nairobi the same day. In the CBD, walk in.",
    },
    {
      Icon: Tag,
      tint: "from-rose-400 to-orange-300",
      title: "Market price next to ours",
      body: "Each listing shows the market price beside our price. The price you see is the price you pay.",
    },
    {
      Icon: ShieldCheck,
      tint: "from-emerald-300 to-teal-400",
      title: "Support after the sale",
      body: "WhatsApp us any time after you buy. Every phone comes with a 7-Day Exchange Guarantee.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#06060a] border-t border-white/[0.06]">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -bottom-40 left-[-10%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.2),transparent_65%)]" />
        <div className="absolute -top-32 right-[-8%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.1),transparent_65%)]" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h2 className="mb-10 sm:mb-14 max-w-xl text-3xl sm:text-5xl font-extrabold text-white leading-tight">
          How we{" "}
          <span className="bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
            sell phones
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {reasons.map(({ Icon, tint, title, body }) => (
            <div
              key={title}
              className="group rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.015] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:from-white/[0.09]"
            >
              <div
                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tint} shadow-lg shadow-black/40`}
              >
                <Icon className="h-6 w-6 text-gray-950" strokeWidth={2.25} />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
              <p className="text-gray-400 text-base leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
