import { Card } from "@/components/shared";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-(--color-page-bg) sm:p-[clamp(1rem,3vw,2.5rem)] pb-24 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-start justify-between p-2 sm:p-0 gap-4 mb-[clamp(1.5rem,3vw,2.5rem)]">
        <div className="min-w-0 flex flex-col gap-2">
          <div className="h-3 bg-slate-200 rounded w-24 mb-1"></div>
          <div className="h-[40px] bg-slate-200 rounded w-64 md:w-80"></div>
        </div>
        <div className="shrink-0 w-10 h-10 bg-slate-200 rounded-lg pt-2"></div>
      </div>

      <div className="flex flex-col gap-[clamp(1.5rem,3vw,2.5rem)]">
        {/* SECTION 1: TOP (Static Metrics & Global Status) */}
        <section className="grid p-2 sm:p-2 grid-cols-1 lg:grid-cols-[1fr_2fr] gap-[clamp(1.5rem,3vw,2.5rem)] items-stretch">
          {/* StaticSummarySection Skeleton (PendingReceivableCard) */}
          <Card
            variant="pending"
            className="flex flex-col justify-between min-h-32 md:min-h-36 opacity-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-200/50 rounded-lg"></div>
              <div className="h-3 bg-slate-200 rounded w-24"></div>
            </div>
            <div className="flex flex-col mt-4 gap-2">
              <div className="h-8 bg-slate-200 rounded w-1/2"></div>
              <div className="h-3 bg-slate-200/50 rounded w-1/3"></div>
            </div>
          </Card>

          {/* BrandStockList Skeleton */}
          <Card variant="white" className="h-full flex flex-col min-h-[370px]">
            <div className="flex justify-between items-center mb-6">
              <div className="h-5 bg-slate-200 rounded w-32"></div>
              <div className="h-3 bg-slate-100 rounded w-20"></div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border-8 border-slate-100 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-8 border-slate-50"></div>
              </div>
            </div>
          </Card>
        </section>

        {/* SECTION 2: MIDDLE (Filterable Performance) */}
        <div className="bg-[#E5F0F6] rounded-[clamp(12px,2vw,20px)] p-[clamp(12px,2vw,24px)] flex flex-col gap-[clamp(1.25rem,2.5vw,1.75rem)]">
          <div className="flex justify-between items-center px-1">
            <div className="flex flex-col gap-2">
              <div className="h-5 bg-slate-300/50 rounded w-48"></div>
              <div className="h-3 bg-slate-300/30 rounded w-64"></div>
            </div>
            <div className="h-10 bg-white/50 rounded-lg w-40"></div>
          </div>

          {/* FilteredPerformanceSection Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[clamp(1rem,2vw,1.5rem)]">
            {[...Array(3)].map((_, i) => (
              <Card
                key={i}
                variant="white"
                className="flex flex-col justify-between min-h-32 md:min-h-36"
              >
                <div className="h-3 bg-slate-100 rounded w-24"></div>
                <div className="h-8 bg-slate-200 rounded w-1/2"></div>
              </Card>
            ))}
          </div>

          {/* Charts Row Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-[clamp(1.25rem,2vw,1.75rem)] items-stretch">
            {/* DashboardChart Skeleton */}
            <Card variant="white" className="flex flex-col min-h-[400px]">
              <div className="flex flex-col gap-2 mb-8">
                <div className="h-5 bg-slate-200 rounded w-48"></div>
                <div className="h-3 bg-slate-100 rounded w-64"></div>
              </div>
              <div className="flex-1 bg-slate-50/50 rounded-lg"></div>
            </Card>

            {/* RegionPerformanceChart Skeleton */}
            <Card variant="white" className="h-full min-h-[400px]">
              <div className="h-5 bg-slate-200 rounded w-40 mb-6"></div>
              <div className="flex flex-col gap-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <div className="h-3 bg-slate-100 rounded w-20"></div>
                      <div className="h-3 bg-slate-200 rounded w-12"></div>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-200 w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* SECTION 3: BOTTOM (Activity & Overdue Shops) */}
        <section className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-[clamp(1.5rem,3vw,2.5rem)] items-start">
          {/* ActivityDataTable Skeleton */}
          <Card variant="white" className="min-h-[500px]">
            <div className="h-6 bg-slate-200 rounded w-48 mb-6"></div>
            <div className="flex flex-col gap-4">
              <div className="h-10 bg-slate-50 rounded w-full"></div>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 border-b border-slate-50 flex items-center px-2"
                >
                  <div className="h-4 bg-slate-100 rounded w-full"></div>
                </div>
              ))}
            </div>
          </Card>

          {/* OverdueShopsTable Skeleton */}
          <Card
            variant="pending"
            className="flex flex-col h-[420px] opacity-70"
          >
            <div className="flex flex-col gap-2 mb-6">
              <div className="h-5 bg-slate-200 rounded w-48"></div>
              <div className="h-3 bg-slate-200/50 rounded w-32"></div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="h-8 border-b border-amber-200/50 flex items-center">
                <div className="h-3 bg-slate-200/30 rounded w-full"></div>
              </div>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-3 border-b border-amber-100/30"
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="h-4 bg-slate-200 rounded w-24"></div>
                    <div className="h-3 bg-slate-100 rounded w-16"></div>
                  </div>
                  <div className="h-4 bg-slate-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
