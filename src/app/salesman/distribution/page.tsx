import {
  getBrands,
  getShops,
  getInventoryBalances,
} from "@/actions/salesman.actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Distribution",
};

import { getFilteredActivities } from "@/actions/salesmanDashboard.actions";
import { DistributionForm } from "@/components/salesman";
import { ActivityDataTable, ActivityFilter } from "@/components/shared";
import { Card } from "@/components/ui";
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
      brandId: params.brandId as string,
      shopId: params.shopId as string,
      page,
      pageSize: 10,
    }),
  ]);

  return (
    <div className="min-h-screen bg-(--color-page-bg) sm:p-[clamp(1rem,3vw,2.5rem)] pb-24 relative">
      {/* Page Header */}
      <div className="mb-8 p-2">
        <h1 className="text-3xl font-bold text-[#0A2540] mb-2">
          Distribution
        </h1>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col-reverse xl:flex-row gap-8 items-start">
        {/* ── RIGHT: History Section ── */}
        <div className="flex-1 w-full lg:min-w-2xl">
          <Card variant="secondary" className="flex flex-col gap-6 px-2 sm:px-0 sm:p-[clamp(1.25rem,2.5vw,2rem)]">
            <div className="flex flex-col justify-between items-start gap-4 px-1">
              <div>
                <h2 className="text-[#053B70] font-bold text-xl">
                  History
                </h2>
              </div>
              <div className="w-full flex justify-end ">
                <ActivityFilter
                  showBrandFilter
                  showShopFilter
                  brands={brands}
                  shops={shops}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <ActivityDataTable
                activities={activityData.activities}
                currentPage={activityData.currentPage}
                totalPages={activityData.totalPages}
                totalEntries={activityData.total}
                showDelete={true}
                headers={[
                  { key: "date", label: "Date" },
                  { key: "subtitle", label: "Shop" },
                  { key: "title", label: "Distribution" },
                  { key: "details", label: "bags" },
                  { key: "amount", label: "Amount" },
                ]}
              />
            </div>
          </Card>
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
