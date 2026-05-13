import { getShops, getRegions } from "@/actions/owner.actions";
import { ShopsList, RegisterShopForm } from "@/components/owner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Management",
};


export const dynamic = "force-dynamic";

export default async function ShopsPage() {
  const [shops, regions] = await Promise.all([getShops(), getRegions()]);
  return (
    <div className="min-h-screen bg-(--color-page-bg) mb-20 p-3 lg:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0A2540] mb-2">
          Shops
        </h1>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col-reverse lg:flex-row gap-8">
        {/* ── LEFT: Shops List */}
        <div className="w-full lg:flex-1 min-w-0">
          <ShopsList shops={shops} regions={regions} />
        </div>

        {/* ── RIGHT: Register Form ── */}
        <div className="shrink-0">
          <RegisterShopForm regions={regions} />
        </div>
      </div>
    </div>
  );
}
