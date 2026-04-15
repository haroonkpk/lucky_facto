import { getShops, getRegions } from "@/actions/owner.actions";
import { ShopsList } from "@/components/owner/shops-list";
import { RegisterShopForm } from "@/components/owner/register-shop-form";

export default async function ShopsPage() {
  const [shops, regions] = await Promise.all([getShops(), getRegions()]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[#64748B] text-xs font-bold tracking-widest uppercase mb-1">
          Distribution Network
        </p>
        <h1 className="text-3xl font-bold text-[#0A2540] mb-2">
          Shop Management
        </h1>
        <p className="text-gray-500 text-[clamp(14px,1vw,16px)]">
          Orchestrate your distribution reach across regional hubs with
          precision ledger tracking.
        </p>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* ── LEFT: Shops List */}
        <div className="w-full lg:flex-1 min-w-0">
          <ShopsList shops={shops} regions={regions} />
        </div>

        {/* ── RIGHT: Register Form ── */}
        <div className="w-full lg:w-[400px] xl:w-[440px] shrink-0">
          <RegisterShopForm regions={regions} />
        </div>
      </div>
    </div>
  );
}
