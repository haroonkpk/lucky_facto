import { getBrands, getShops } from "@/actions/salesman.actions";
import DistributionForm from "@/components/salesman/distribution-form";

export default async function DistributionPage() {
  const [brands, shops] = await Promise.all([
    getBrands(),
    getShops(),
  ]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-3 lg:p-10 md:pl-20!">
      <div className="mb-8">
        <p className="text-[#64748B] text-xs font-bold tracking-widest uppercase mb-1">
          Revenue & Logistics
        </p>
        <h1 className="text-3xl font-bold text-[#0A2540] mb-2">
          New Distribution
        </h1>
        <p className="text-gray-500 text-[clamp(14px,1vw,16px)]">
          Authorize stock delivery to shops and record immediate ledger entries for accurate billing.
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:flex-1 shrink-0 max-w-2xl">
          <DistributionForm brands={brands} shops={shops} />
        </div>
      </div>
    </div>
  );
}
