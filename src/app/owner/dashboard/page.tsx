import { getOwnerDashboardData } from "@/actions/ownerDashboard.actions";
import { LogoutButton } from "@/components/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Owner Dashboard",
};

import {
  StaticSummarySection,
  FilteredPerformanceSection,
  BrandStockList,
  RegionPerformanceChart,
  OverdueShopsTable,
} from "@/components/owner/dashboard";
import { ActivityDataTable, DateRangeFilter } from "@/components/shared";
import { Card } from "@/components/ui";
import { DashboardChart } from "@/components/owner";

export const revalidate = 60;

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const startDate = params.startDate
    ? new Date(params.startDate as string)
    : undefined;
  const endDate = params.endDate
    ? new Date(params.endDate as string)
    : undefined;

  const overduePage = Number(params.overduePage) || 1;

  const data = await getOwnerDashboardData(
    startDate,
    endDate,
    overduePage,
    4, // pageSize for overdue shops
  );

  return (
    <div className="min-h-screen bg-(--color-page-bg) sm:p-[clamp(1rem,3vw,2.5rem)] pb-24">
      {/* Header */}
      <div className="flex items-start justify-between p-2 sm:p-0 gap-4 mb-[clamp(1.5rem,3vw,2.5rem)]">
        <div className="min-w-0">
          <p
            className="text-[#64748B] font-bold uppercase tracking-widest mb-1"
            style={{ fontSize: "clamp(10px, 1.2vw, 12px)" }}
          >
            Tracking & Analytics
          </p>
          <h1
            className="text-[#0A2540] font-bold truncate leading-tight"
            style={{ fontSize: "clamp(1.3rem, 4.5vw, 2.5rem)" }}
          >
            Owner Dashboard
          </h1>
        </div>
        <div className="shrink-0 pt-2">
          <LogoutButton />
        </div>
      </div>

      <div className="flex flex-col gap-[clamp(1.5rem,3vw,2.5rem)]">
        {/* SECTION 1: TOP (Static Metrics & Global Status) */}
        <section className="grid p-2 sm:p-2 grid-cols-1 lg:grid-cols-[1fr_2fr] gap-[clamp(1.5rem,3vw,2.5rem)] items-stretch">
          <StaticSummarySection
            pending={data.staticMetrics.pendingPayments}
            pendingShopsCount={data.staticMetrics.pendingShopsCount}
          />
          <BrandStockList stock={data.brandWiseStock} />
        </section>

        {/* SECTION 2: MIDDLE (Filterable Performance) */}
        <Card
          variant="secondary"
          className="flex flex-col gap-[clamp(1.25rem,2.5vw,1.75rem)]"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 px-1">
            <div>
              <h2
                className="text-[#053B70] font-bold"
                style={{ fontSize: "clamp(16px, 2.2vw, 20px)" }}
              >
                Performance Metrics
              </h2>
              <p className="text-[#64748B] text-sm font-medium mt-0.5">
                Filtered analysis of distributions and collections
              </p>
            </div>
            <DateRangeFilter />
          </div>

          {/* Filtered KPIs - Redesigned as Pulse Cards */}
          <FilteredPerformanceSection
            distributed={data.filteredMetrics.distributed}
            payments={data.filteredMetrics.payments}
            deliveries={data.filteredMetrics.deliveries}
          />

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-[clamp(1.25rem,2vw,1.75rem)] items-stretch">
            {/* Sales vs Payments Trend */}
            <Card variant="white" className="flex flex-col">
              <div>
                <h3
                  className="font-bold text-[#0A2540]"
                  style={{ fontSize: "clamp(1.125rem, 1.5vw, 1.25rem)" }}
                >
                  Sales vs Payments Trend
                </h3>
                <p
                  className="text-[#94A3B8] mt-1"
                  style={{ fontSize: "clamp(0.8rem, 1.2vw, 0.9rem)" }}
                >
                  Comparative analysis for selected period
                </p>
              </div>
              <div className="flex-1 min-h-75 mt-6">
                <DashboardChart data={data.chartData} />
              </div>
            </Card>

            {/* Region Performance */}
            <RegionPerformanceChart performance={data.regionPerformance} />
          </div>
        </Card>

        {/* SECTION 3: BOTTOM (Activity & Overdue Shops) */}
        <section className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-[clamp(1.5rem,3vw,2.5rem)] items-start">
          <ActivityDataTable
            activities={data.activities}
            title="Latest 10 Activity"
            showPagination={false}
            headers={[
              { key: "date", label: "Date" },
              { key: "subtitle", label: "Target/Shop" },
              { key: "title", label: "Type/Activity" },
              { key: "details", label: "Details/Qty" },
              { key: "amount", label: "Amount" },
            ]}
          />
          <OverdueShopsTable
            shops={data.overdueShopsList}
            currentPage={data.overduePagination.currentPage}
            totalPages={data.overduePagination.totalPages}
          />
        </section>
      </div>
    </div>
  );
}
