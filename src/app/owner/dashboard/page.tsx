import { getOwnerDashboardData } from "@/actions/dashboard.actions";
import { LogoutButton } from "@/components/auth/logout-button";
import { PulseCards } from "@/components/owner/dashboard/pulse-cards";
import { KPICards } from "@/components/owner/dashboard/kpi-cards";
import { BrandStockList } from "@/components/owner/dashboard/brand-stock-list";
import { RegionPerformanceList } from "@/components/owner/dashboard/region-performance-list";
import { OverdueShopsTable } from "@/components/owner/dashboard/overdue-shops-table";
import { RecentActivityFeed } from "@/components/owner/dashboard/recent-activity-feed";
import { DashboardChart } from "@/components/owner/dashboard-chart";

export const revalidate = 60; 

export default async function DashboardPage() {
  const data = await getOwnerDashboardData();

  return (
    <div className="min-h-screen bg-[var(--color-page-bg)] p-[clamp(0.75rem,3vw,2.5rem)] pb-20">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-[clamp(1.5rem,3vw,2.5rem)]">
        <div className="min-w-0">
          <p
            className="text-[#64748B] font-bold uppercase tracking-widest"
            style={{ fontSize: "clamp(10px, 1.2vw, 12px)" }}
          >
            Tracking & Analytics
          </p>
          <h1
            className="text-[#0A2540] font-bold truncate"
            style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)" }}
          >
            Owner Dashboard
          </h1>
          <p
            className="text-[#94A3B8] mt-1"
            style={{ fontSize: "clamp(12px, 1.5vw, 14px)" }}
          >
            Overview of sales, payments, stock, and network activity.
          </p>
        </div>
        <div className="shrink-0 pt-1">
          <LogoutButton />
        </div>
      </div>

      <div className="flex flex-col gap-[clamp(1.5rem,3vw,2rem)]">
        {/* ROW 1: Pulse Cards */}
        <section>
          <PulseCards pulse={data.pulse} />
        </section>

        {/* ROW 2: KPIs & Chart Block */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,1.5fr)] gap-[clamp(1.5rem,3vw,2rem)] items-stretch">
          <div className="flex flex-col gap-[clamp(1.5rem,3vw,2rem)]">
            <KPICards kpis={data.kpis} />
          </div>
          <div className="bg-white rounded-xl p-[clamp(1rem,2vw,1.5rem)] shadow-sm border border-slate-100 h-full flex flex-col">
            <div>
              <h2 className="font-bold text-[#0A2540]" style={{ fontSize: "clamp(1.125rem, 1.5vw, 1.25rem)" }}>
                Sales vs Payments Trend
              </h2>
              <p className="text-[#94A3B8] mt-1" style={{ fontSize: "clamp(0.75rem, 1.2vw, 0.875rem)" }}>
                Tracking distributions and collections over 3 months
              </p>
            </div>
            <div className="flex-1 min-h-[250px]">
              <DashboardChart data={data.chartData} />
            </div>
          </div>
        </section>

        {/* ROW 3: Domain Metrics (Stock & Region) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(1.5rem,3vw,2rem)]">
          <BrandStockList stock={data.brandWiseStock} />
          <RegionPerformanceList performance={data.regionPerformance} />
        </section>

        {/* ROW 4: Table & Feed */}
        <section className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-[clamp(1.5rem,3vw,2rem)] items-start">
          <OverdueShopsTable shops={data.overdueShopsList} />
          <RecentActivityFeed activities={data.activities} />
        </section>
      </div>
    </div>
  );
}
