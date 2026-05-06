import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductForm } from "@/components/admin/ProductForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const { id } = await params;

  const [product, brands] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <AdminLayout>
      <div className="p-8">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">Edit Product</h1>
          <p className="text-gray-500 text-sm mt-0.5">{product.name}</p>
        </div>

        <ProductForm
          brands={brands}
          mode="edit"
          initialData={{
            id: product.id,
            name: product.name,
            brandId: product.brandId,
            modelName: product.modelName,
            storageCapacity: product.storageCapacity,
            color: product.color,
            condition: product.condition,
            isAvailable: product.isAvailable,
            isFeatured: product.isFeatured,
            batteryHealth: product.batteryHealth ?? undefined,
            priceKES: product.priceKES,
            priceUSD: product.priceUSD ?? undefined,
            marketPriceKES: product.marketPriceKES ?? undefined,
            marketPriceUSD: product.marketPriceUSD ?? undefined,
            ram: product.ram ?? undefined,
            description: product.description ?? undefined,
            images: product.images,
          }}
        />
      </div>
    </AdminLayout>
  );
}
