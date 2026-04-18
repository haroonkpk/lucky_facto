import { getDailyBrandRevenue } from "@/actions/owner.actions";
import { LogoutButton } from "@/components/auth/logout-button";
import { DashboardChart } from "@/components/owner/dashboard-chart";

export default async function DashboardPage() {
  const { data, brands } = await getDailyBrandRevenue();

  return (
    <div className="min-h-screen bg-(--color-page-bg) p-[clamp(0.75rem,2vw,2.5rem)]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
      <div className="min-w-0">
        <p
          className="text-[#64748B] font-bold uppercase tracking-widest"
          style={{ fontSize: "clamp(10px, 1.2vw, 12px)" }}
        >
          Tracking & Analytics
        </p>
        <h1
          className="text-[#0A2540] font-bold truncate"
          style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }}
        >
           Owner Dashboard
        </h1>
        <p
          className="text-[#94A3B8] mt-0.5"
          style={{ fontSize: "clamp(12px, 1.5vw, 14px)" }}
        >
          Overview of brand revenue and performance.
        </p>
      </div>
      <div className="shrink-0 pt-1">
        <LogoutButton />
      </div>
    </div>

      {/* chart*/}
      <div className="w-full bg-white rounded-xl  p-[clamp(1rem,3vw,2.5rem)]">
        <div className="mb-[clamp(1rem,2.5vw,1.5rem)]">
          <h2 className="font-bold text-[#0A2540] text-[clamp(1.125rem,2vw,1.25rem)]">
            Brand Revenue Over Time (last 3 months)
          </h2>
          <p className="text-gray-500 mt-1 text-[clamp(0.75rem,1.5vw,0.875rem)]">
            Tracing Monthly Revenue by Brand
          </p>
        </div>
        

        <DashboardChart data={data} brands={brands} />
      </div>
    </div>
  );
}
