export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductsTable } from "@/components/admin/ProductsTable";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const products = await prisma.product.findMany({
    include: { brand: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminLayout>
      <div className="p-4 sm:p-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">Products</h1>
            <p className="text-gray-500 text-sm mt-0.5">{products.length} devices in stock</p>
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>

        <ProductsTable products={products as never} />
      </div>
    </AdminLayout>
  );
}
