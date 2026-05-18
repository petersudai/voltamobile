import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductForm } from "@/components/admin/ProductForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function NewProductPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });

  return (
    <AdminLayout>
      <div className="p-4 sm:p-8">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <h1 className="text-2xl font-black text-gray-900 mb-8">Add New Product</h1>

        <ProductForm brands={brands} mode="create" />
      </div>
    </AdminLayout>
  );
}
