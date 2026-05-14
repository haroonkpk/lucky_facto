import { getBrands } from "@/actions/salesman.actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Factory Intake",
};

import { getFilteredActivities } from "@/actions/salesmanDashboard.actions";
import { FactoryIntakeForm } from "@/components/salesman";
import { ActivityDataTable, ActivityFilter } from "@/components/shared";
import { Card } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function FactoryIntakePage({ searchParams }: PageProps) {
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

  const [brands, activityData] = await Promise.all([
    getBrands(),
    getFilteredActivities({
      userId: user.id,
      type: "intake",
      startDate,
      endDate,
      brandId: params.brandId as string,
      page,
      pageSize: 10,
    }),
  ]);

  return (
    <div className="min-h-screen bg-(--color-page-bg) sm:p-[clamp(1rem,3vw,2.5rem)] pb-24 relative">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0A2540] mb-2">
          Factory Intake
        </h1>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col-reverse xl:flex-row gap-8 items-start">
        {/* ── RIGHT: History Section ── */}
        <div className="flex-1 w-full lg:min-w-2xl">
          <Card variant="secondary" className="flex flex-col gap-6">
            <div className="flex flex-col justify-between items-start gap-4 px-1">
              <div>
                <h2 className="text-[#053B70] font-bold text-xl">
                  History
                </h2>
              </div>
              <div className="w-full flex justify-end ">
                <ActivityFilter
                  showBrandFilter
                  brands={brands}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <ActivityDataTable
                activities={activityData.activities}
                currentPage={activityData.currentPage}
                totalPages={activityData.totalPages}
                totalEntries={activityData.total}
                title="Intake Logs"
                showDelete={true}
                headers={[
                  { key: "date", label: "Date" },
                  { key: "subtitle", label: "Brand" },
                  { key: "details", label: "Bags" },
                ]}
              />
            </div>
          </Card>
        </div>

        {/* ── LEFT: Intake Form ── */}
        <div className="w-full xl:w-fit">
          <FactoryIntakeForm brands={brands} />
        </div>
      </div>
    </div>
  );
}
