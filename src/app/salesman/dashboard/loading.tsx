export default function SalesmanDashboardLoading() {
  return (
    <div className="min-h-screen bg-[var(--color-page-bg)] p-3 lg:p-10 md:pl-20! animate-pulse pt-20">
      <div
        className="max-w-4xl mx-auto flex flex-col mb-20"
        style={{ gap: "clamp(16px, 2.5vw, 24px)" }}
      >
        {/* Header Skeleton */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex flex-col gap-2">
            <div className="h-3 bg-slate-200 rounded w-20 mb-1"></div>
            <div className="h-8 bg-slate-200 rounded w-48 md:w-64"></div>
            <div className="h-4 bg-slate-200 rounded w-32 md:w-40 mt-1"></div>
          </div>
          <div className="shrink-0 w-10 h-10 bg-slate-200 rounded-lg"></div>
        </div>

        {/* Sales + Pending Payments */}
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: "clamp(12px, 2vw, 20px)" }}
        >
          {/* Sales Card Skeleton (Blue themed) */}
          <div
            className="bg-[var(--color-primary)] rounded-[clamp(12px,2vw,20px)] p-[clamp(20px,3vw,32px)] h-[180px] flex flex-col justify-between opacity-80"
          >
            <div className="flex justify-between items-start">
              <div className="h-3 bg-white/20 rounded w-24"></div>
              <div className="h-8 bg-white/20 rounded w-16"></div>
            </div>
            <div>
              <div className="h-10 bg-white/20 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-white/10 rounded w-1/3"></div>
            </div>
          </div>

          {/* Pending Payments Card Skeleton (Amber gradient) */}
          <div
            className="bg-amber-100 rounded-[clamp(12px,2vw,20px)] p-[clamp(20px,3vw,32px)] h-[180px] flex flex-col justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-200/50 rounded-lg"></div>
              <div className="h-3 bg-amber-300/30 rounded w-24"></div>
            </div>
            <div>
              <div className="h-8 bg-amber-900/10 rounded w-2/3 mb-2"></div>
              <div className="h-3 bg-amber-800/10 rounded w-1/2"></div>
            </div>
          </div>
        </div>

        {/* Stock Overview Skeleton */}
        <div
          className="bg-[var(--color-secondary-bg)] rounded-[clamp(12px,2vw,20px)] p-[clamp(20px,3vw,28px)]"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-slate-200/50 rounded-lg"></div>
              <div className="h-5 bg-slate-300/50 rounded w-32"></div>
            </div>
            <div className="h-5 bg-white/60 rounded w-16"></div>
          </div>
          <div className="flex flex-col gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-md"></div>
                  <div className="h-4 bg-slate-200 rounded w-24"></div>
                </div>
                <div className="h-4 bg-slate-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity List Skeleton */}
        <div className="bg-white rounded-[clamp(10px,1.5vw,16px)] p-[clamp(16px,2.5vw,28px)]">
          <div className="flex items-center justify-between mb-6">
            <div className="h-5 bg-slate-200 rounded w-32"></div>
            <div className="h-5 bg-slate-100 rounded w-20"></div>
          </div>
          <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4 p-2 bg-slate-50 rounded-lg">
                <div className="w-10 h-10 bg-slate-200 rounded-lg shrink-0"></div>
                <div className="flex flex-col gap-2 w-full justify-center">
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
