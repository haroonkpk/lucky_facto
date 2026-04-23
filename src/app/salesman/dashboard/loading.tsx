export default function SalesmanDashboardLoading() {
  return (
    <div className="min-h-screen bg-(--color-page-bg) animate-pulse">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 lg:py-10 pb-24 flex flex-col gap-6 lg:gap-8">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
          <div className="flex flex-col gap-2">
            <div className="h-4 bg-slate-200 rounded w-48"></div>
            <div className="h-8 bg-slate-300/50 rounded w-64 md:w-80"></div>
          </div>
          <div className="h-10 bg-slate-200 rounded-lg w-32"></div>
        </div>

        {/* ROW 1: Sales Card + Brand Stock Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* SalesCard Skeleton */}
          <div
            className="rounded-[clamp(12px,2vw,20px)] p-[clamp(20px,3vw,32px)] h-full flex flex-col justify-between min-h-[180px]"
            style={{ background: "var(--color-primary)", opacity: 0.8 }}
          >
            <div className="flex justify-between items-start mb-8">
              <div className="h-4 bg-white/20 rounded w-32"></div>
              <div className="h-8 bg-white/20 rounded w-24"></div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-10 bg-white/30 rounded w-1/2"></div>
              <div className="h-4 bg-white/20 rounded w-1/3"></div>
            </div>
          </div>

          {/* BrandStockList Skeleton */}
          <div className="bg-white rounded-[clamp(10px,1.5vw,16px)] p-[clamp(1.25rem,2vw,2rem)] h-full flex flex-col min-h-[370px]">
            <div className="flex justify-between items-center mb-6">
              <div className="h-5 bg-slate-200 rounded w-32"></div>
              <div className="h-3 bg-slate-100 rounded w-20"></div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border-8 border-slate-100 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-8 border-slate-50"></div>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: Pending Summary + Detailed Pending Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 lg:gap-8 items-stretch">
          {/* PendingPaymentsCard Skeleton */}
          <div
            className="rounded-[clamp(12px,2vw,20px)] p-[clamp(20px,3vw,32px)] h-full min-h-[180px] flex flex-col justify-between"
            style={{ background: "var(--color-pending-bg)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-slate-200/50 rounded-lg"></div>
              <div className="h-4 bg-slate-200 rounded w-32"></div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-8 bg-slate-200 rounded w-1/2"></div>
              <div className="h-4 bg-slate-200/50 rounded w-1/3"></div>
            </div>
          </div>

          {/* DetailedPendingPayments Skeleton */}
          <div
            className="rounded-[clamp(12px,2vw,20px)] p-[clamp(20px,3vw,32px)] flex flex-col min-h-[300px]"
            style={{ backgroundColor: "var(--color-pending-bg)" }}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="h-5 bg-slate-200 rounded w-48"></div>
              <div className="h-3 bg-slate-200/50 rounded w-16"></div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="h-8 border-b border-amber-200/50 flex items-center">
                <div className="h-3 bg-slate-200/30 rounded w-full"></div>
              </div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between items-center py-4 border-b border-amber-100/30">
                  <div className="h-4 bg-slate-200 rounded w-32"></div>
                  <div className="h-4 bg-slate-200 rounded w-24"></div>
                  <div className="h-6 bg-slate-100 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 3: Activity DataTable Skeleton */}
        <div className="bg-white rounded-lg border border-slate-100 p-4 min-h-[400px]">
          <div className="h-6 bg-slate-200 rounded w-48 mb-6"></div>
          <div className="flex flex-col gap-4">
            <div className="h-10 bg-slate-50 rounded w-full"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 border-b border-slate-50 flex items-center px-2">
                <div className="h-4 bg-slate-100 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

