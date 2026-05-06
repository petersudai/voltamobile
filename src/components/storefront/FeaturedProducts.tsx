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
    <section className="py-16 sm:py-24 bg-gray-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-end justify-between mb-8 sm:mb-12">
          <div>
            <p className="text-blue-500 text-xs font-bold uppercase tracking-[0.2em] mb-2 sm:mb-3">
              Handpicked
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-none">
              Featured<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                This Week
              </span>
            </h2>
          </div>
          <Link
            href="/phones"
            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-white transition-colors group"
          >
            View all
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Prime card — full width on mobile, 2-col on lg */}
          {hero && (
            <div className="col-span-2 lg:col-span-2">
              <PrimeFeatureCard product={hero} />
            </div>
          )}

          {/* Side stack — stacks below prime on mobile, column on lg */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-1 grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-4">
            {rest.slice(0, 2).map((p) => (
              <ProductCard key={p.id} product={p} className="flex-1" />
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
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400"
          >
            View all phones <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
