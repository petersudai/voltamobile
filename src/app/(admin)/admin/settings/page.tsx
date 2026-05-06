export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getHeroImageUrl } from "@/lib/settings";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { HeroSettings } from "@/components/admin/HeroSettings";

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const heroImageUrl = await getHeroImageUrl();

  return (
    <AdminLayout>
      <div className="p-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">Store Settings</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Manage site-wide content like the homepage hero image.
          </p>
        </div>

        <section>
          <div className="mb-5">
            <h2 className="text-base font-bold text-gray-800">Hero Image</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              The phone shown on the right side of the homepage banner.
              Upload from your computer or paste an Unsplash URL.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <HeroSettings currentImageUrl={heroImageUrl} />
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
