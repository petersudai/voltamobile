export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/ProductCard";
import { FilterSidebar } from "@/components/storefront/FilterSidebar";
import { Package } from "lucide-react";
import type { Product } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Phones",
  description:
    "Browse our full stock of Ex-UK, Brand New, Refurbished & Used smartphones in Nairobi CBD.",
};

type SearchParams = Promise<{
  brand?: string;
  condition?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
  storage?: string;
  color?: string;
  page?: string;
}>;

async function getProducts(filters: Awaited<SearchParams>) {
  const where: Record<string, unknown> = {};

  if (filters.brand) where.brand = { slug: filters.brand };
  if (filters.condition) where.condition = filters.condition;
  if (filters.storage) where.storageCapacity = filters.storage;
  if (filters.color) where.color = { contains: filters.color, mode: "insensitive" };
  if (filters.minPrice || filters.maxPrice) {
    where.priceKES = {
      ...(filters.minPrice ? { gte: parseInt(filters.minPrice) } : {}),
      ...(filters.maxPrice ? { lte: parseInt(filters.maxPrice) } : {}),
    };
  }
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { modelName: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const page = parseInt(filters.page ?? "1");
  const pageSize = 12;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { brand: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, page, totalPages: Math.ceil(total / pageSize) };
}

async function getBrands() {
  return prisma.brand.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
}

export default async function PhonesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters = await searchParams;
  const [{ products, total, page, totalPages }, brands] = await Promise.all([
    getProducts(filters),
    getBrands(),
  ]);

  return (
    <div className="min-h-screen bg-[#09090c] pt-20">
      {/* Page header */}
      <div className="border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {filters.brand
              ? brands.find((b) => b.slug === filters.brand)?.name + " Phones"
              : filters.condition
                ? filters.condition.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()) + " Phones"
                : "All Phones"}
          </h1>
          <p className="mt-1 text-gray-400 text-sm">
            {total} device{total !== 1 ? "s" : ""} available
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter sidebar */}
          <Suspense
            fallback={
              <div className="w-60 h-96 bg-[#0e0e12] rounded-3xl border border-white/[0.06] animate-pulse" />
            }
          >
            <FilterSidebar brands={brands as never} />
          </Suspense>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {products.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product as unknown as Product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination page={page} totalPages={totalPages} filters={filters} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Package className="w-10 h-10 text-gray-800 mb-4" />
      <h3 className="text-base font-semibold text-gray-500 mb-1">No phones found</h3>
      <p className="text-gray-700 text-sm">Try adjusting your filters or browse all phones.</p>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  filters,
}: {
  page: number;
  totalPages: number;
  filters: Awaited<SearchParams>;
}) {
  const buildHref = (p: number) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v && k !== "page") params.set(k, v);
    });
    params.set("page", p.toString());
    return `/phones?${params.toString()}`;
  };

  return (
    <div className="mt-10 flex justify-center items-center gap-2">
      {page > 1 && (
        <a
          href={buildHref(page - 1)}
          className="px-4 py-2 rounded-xl border border-white/[0.08] text-sm font-medium text-gray-400 hover:border-white/20 hover:text-white transition-all"
        >
          Previous
        </a>
      )}
      <span className="px-4 py-2 text-sm text-gray-600">
        Page {page} of {totalPages}
      </span>
      {page < totalPages && (
        <a
          href={buildHref(page + 1)}
          className="px-4 py-2 rounded-xl border border-white/[0.08] text-sm font-medium text-gray-400 hover:border-white/20 hover:text-white transition-all"
        >
          Next
        </a>
      )}
    </div>
  );
}
