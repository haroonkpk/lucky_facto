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
    <div className="min-h-screen bg-[var(--color-page-bg)] p-[clamp(1rem,3vw,2.5rem)] pb-24">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-[clamp(2rem,4vw,3rem)]">
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
          <p
            className="text-[#94A3B8] mt-1.5"
            style={{ fontSize: "clamp(13px, 1.6vw, 15px)" }}
          >
            Real-time overview of your distribution network&lsquo;s pulse.
          </p>
        </div>
        <div className="shrink-0 pt-2">
          <LogoutButton />
        </div>
      </div>

      <div className="flex flex-col gap-[clamp(1.5rem,3vw,2.5rem)]">
        {/* ROW 1: Pulse Cards */}
        <section>
          <PulseCards pulse={data.pulse} />
        </section>

        {/* ROW 2: KPIs & Chart Block*/}
        <div className="bg-[#E5F0F6] rounded-[clamp(12px,2vw,20px)] p-[clamp(12px,2vw,24px)] flex flex-col gap-[clamp(1.25rem,2.5vw,1.75rem)]">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-1">
              <h2 className="text-[#053B70] font-bold" style={{ fontSize: "clamp(16px, 2.2vw, 20px)" }}>
                Core Performance Metrics
              </h2>
              <span className="text-[#64748B] font-medium" style={{ fontSize: "clamp(11px, 1.2vw, 13px)" }}>
                Last 30 Days Activity
              </span>
           </div>
           
           <section className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,1.5fr)] gap-[clamp(1.25rem,2vw,1.75rem)] items-stretch">
            <div className="flex flex-col gap-[clamp(1rem,2vw,1.5rem)]">
              <KPICards kpis={data.kpis} />
            </div>
            <div className="bg-white rounded-[clamp(10px,1.5vw,16px)] p-[clamp(1.25rem,2.5vw,2rem)] flex flex-col">
              <div>
                <h3 className="font-bold text-[#0A2540]" style={{ fontSize: "clamp(1.125rem, 1.5vw, 1.25rem)" }}>
                  Sales vs Payments Trend
                </h3>
                <p className="text-[#94A3B8] mt-1" style={{ fontSize: "clamp(0.8rem, 1.2vw, 0.9rem)" }}>
                  Comparative analysis of distributions and collections
                </p>
              </div>
              <div className="flex-1 min-h-[300px]">
                <DashboardChart data={data.chartData} />
              </div>
            </div>
          </section>
        </div>

        {/* ROW 3: Domain Metrics (Stock & Region) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(1.5rem,3vw,2.5rem)]">
          <BrandStockList stock={data.brandWiseStock} />
          <RegionPerformanceList performance={data.regionPerformance} />
        </section>

        {/* ROW 4: Table & Feed */}
        <section className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-[clamp(1.5rem,3vw,2.5rem)] items-start">
          <OverdueShopsTable shops={data.overdueShopsList} />
          <RecentActivityFeed activities={data.activities} />
        </section>
      </div>
    </div>
  );
}
