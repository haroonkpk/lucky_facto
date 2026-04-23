import {
  getBrands,
  getShops,
  getInventoryBalances,
} from "@/actions/salesman.actions";
import { getFilteredActivities } from "@/actions/salesmanDashboard.actions";
import { DistributionForm } from "@/components/salesman";
import { ActivityDataTable } from "@/components/shared";
import { DateRangeFilter } from "@/components/owner/dashboard/filters";
import { createClient } from "@/lib/supabase/server";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DistributionPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string) : 1;
  const startDate = params.startDate
    ? new Date(params.startDate as string)
    : undefined;
  const endDate = params.endDate
    ? new Date(params.endDate as string)
    : undefined;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [brands, shops, inventoryBalances, activityData] = await Promise.all([
    getBrands(),
    getShops(),
    getInventoryBalances(),
    getFilteredActivities({
      userId: user.id,
      type: "distribution",
      startDate,
      endDate,
      page,
      pageSize: 10,
    }),
  ]);

  return (
    <div className="min-h-screen bg-(--color-page-bg) sm:p-[clamp(1rem,3vw,2.5rem)] pb-24 relative">
      {/* Page Header */}
      <div className="mb-8">
        <p className="text-[#64748B] text-xs font-bold tracking-widest uppercase mb-1">
          Revenue & Logistics
        </p>
        <h1 className="text-3xl font-bold text-[#0A2540] mb-2">
          New Distribution
        </h1>
        <p className="text-gray-500 text-[clamp(14px,1vw,16px)]">
          Authorize stock delivery to shops and record immediate ledger entries
          for accurate billing.
        </p>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col-reverse xl:flex-row gap-8 items-start">
        {/* ── RIGHT: History Section ── */}
        <div className="flex-1 w-full lg:min-w-2xl">
          <div className="bg-[#E5F0F6] rounded-[clamp(12px,2vw,20px)] p-[clamp(12px,2vw,24px)] flex flex-col gap-6">
            <div className="flex flex-col justify-between items-start gap-4 px-1">
              <div>
                <h2 className="text-[#053B70] font-bold text-xl">
                  Distributions
                </h2>
                <p className="text-[#64748B] text-sm font-medium mt-0.5">
                  History of items recorded by you
                </p>
              </div>
              <div className="w-full flex justify-end ">
                <DateRangeFilter />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <ActivityDataTable
                activities={activityData.activities}
                currentPage={activityData.currentPage}
                totalPages={activityData.totalPages}
              />
            </div>
          </div>
        </div>

        {/* ── LEFT: Distribution Form ── */}
        <div className="w-full xl:w-fit">
          <DistributionForm
            brands={brands}
            shops={shops}
            inventoryBalances={inventoryBalances}
          />
        </div>
      </div>
    </div>
  );
}
