import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { PrimeFeatureCard } from "./PrimeFeatureCard";
import { prisma } from "@/lib/prisma";
import type { Product } from "@/types";

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isFeatured: true, isAvailable: true },
    include: { brand: true },
    orderBy: { priceKES: "desc" },
    take: 6,
  });
}

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();
  if (products.length === 0) return null;

  const [hero, ...rest] = products as unknown as Product[];

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-[#08080c] border-t border-white/5">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-32 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(37,99,235,0.22),transparent_65%)]" />
        <div className="absolute bottom-[-200px] right-[-10%] h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.1),transparent_65%)]" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-end justify-between mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            In stock{" "}
            <span className="bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              this week
            </span>
          </h2>
          <Link
            href="/phones"
            className="hidden sm:flex items-center gap-2 py-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Prime card: full width on mobile, 2-col on lg */}
          {hero && (
            <div className="col-span-2 lg:col-span-2">
              <PrimeFeatureCard product={hero} />
            </div>
          )}

          {/* Side stack: below prime on mobile, column on lg */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-1 grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-4">
            {rest.slice(0, 2).map((p) => (
              <ProductCard key={p.id} product={p} className="flex-1" compactImage />
            ))}
          </div>

          {/* Bottom row */}
          {rest.slice(2).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/phones"
            className="inline-flex items-center gap-2 py-2 text-sm font-semibold text-blue-400"
          >
            View all phones <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
