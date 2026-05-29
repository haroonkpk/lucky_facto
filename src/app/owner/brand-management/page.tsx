import { prisma } from "@/lib/prisma";
import { BrandManagementClient } from "@/components/owner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brand Management",
};

export const dynamic = "force-dynamic";

export default async function BrandManagementPage() {
  const brandsRaw = await prisma.brand.findMany({
    orderBy: { name: "asc" },
  });

  // Serialize Decimal types to regular numbers/null for Next.js Server Components
  const brands = brandsRaw.map((b) => ({
    ...b,
    pricePerTon: b.pricePerTon ? Number(b.pricePerTon) : null,
    pricePerBag: b.pricePerBag ? Number(b.pricePerBag) : null,
  }));

  return (
    <div className="min-h-screen bg-(--color-page-bg) sm:p-[clamp(1rem,3vw,2.5rem)] pb-24 relative">
      {/* Page Header */}
      <div className="sm:mb-8 p-2">
        <h1 className="text-3xl font-bold text-[#0A2540] mb-2">
          Brand Management
        </h1>
      </div>

      {/* Brand Management Dashboard Client */}
      <BrandManagementClient initialBrands={brands} />
    </div>
  );
}
