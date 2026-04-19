export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[var(--color-page-bg)] p-[clamp(1rem,3vw,2.5rem)] pb-24 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-start justify-between gap-4 mb-[clamp(2rem,4vw,3rem)]">
        <div className="min-w-0 flex flex-col gap-2">
          <div className="h-3 bg-slate-200 rounded w-24 mb-1"></div>
          <div className="h-[40px] bg-slate-200 rounded w-64 md:w-80"></div>
          <div className="h-4 bg-slate-200 rounded w-48 md:w-64 mt-1.5"></div>
        </div>
        <div className="shrink-0 w-10 h-10 bg-slate-200 rounded-lg pt-2"></div>
      </div>

      <div className="flex flex-col gap-[clamp(1.5rem,3vw,2.5rem)]">
        {/* ROW 1: Pulse Cards */}
        <section className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[clamp(1.25rem,2.5vw,1.75rem)]">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-[clamp(20px,3vw,32px)] flex flex-col justify-between h-[140px]"
            >
              <div className="flex justify-between items-start">
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
              </div>
              <div className="flex items-end justify-between mt-4">
                <div className="h-8 bg-slate-200 rounded w-1/2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </section>

        {/* ROW 2: KPIs & Chart Block - Tinted Container */}
        <div className="bg-[#E5F0F6] rounded-[clamp(12px,2vw,20px)] p-[clamp(12px,2vw,24px)] flex flex-col gap-[clamp(1.25rem,2.5vw,1.75rem)]">
          <div className="flex justify-between items-center px-1">
            <div className="h-6 bg-slate-300/50 rounded w-48"></div>
            <div className="h-4 bg-slate-300/50 rounded w-32"></div>
          </div>

          <section className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,1.5fr)] gap-[clamp(1.25rem,2vw,1.75rem)] items-stretch">
            <div className="grid grid-cols-1 gap-[clamp(1rem,2vw,1.5rem)] h-full">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-[clamp(1.25rem,2vw,1.5rem)] flex flex-col justify-center h-[120px]"
                >
                  <div className="h-3 bg-slate-100 rounded w-1/3 mb-3"></div>
                  <div className="h-7 bg-slate-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-slate-100 rounded w-3/4"></div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-[clamp(10px,1.5vw,16px)] p-[clamp(1.25rem,2.5vw,2rem)] h-[400px]">
              <div className="h-6 bg-slate-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-slate-100 rounded w-1/4 mb-10"></div>
              <div className="w-full h-[250px] bg-slate-50 rounded-lg"></div>
            </div>
          </section>
        </div>

        {/* ROW 3: Domain Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(1.5rem,3vw,2.5rem)]">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-[clamp(16px,2.5vw,28px)] h-[350px]"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                <div className="h-5 bg-slate-100 rounded-md w-20"></div>
              </div>
              <div className="flex flex-col gap-5">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                      <div className="h-4 bg-slate-200 rounded w-1/6"></div>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* ROW 4: Table & Feed (Reversed Order) */}
        <section className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-[clamp(1.5rem,3vw,2.5rem)] items-start">
          {/* Activity List Skeleton */}
          <div className="bg-white rounded-[clamp(10px,1.5vw,16px)] p-[clamp(16px,2.5vw,28px)] h-[550px]">
            <div className="flex justify-between items-center mb-8">
              <div className="h-6 bg-slate-200 rounded w-1/4"></div>
              <div className="h-5 bg-slate-100 rounded-md w-24"></div>
            </div>
            <div className="flex flex-col gap-4">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="flex gap-4 p-3 bg-slate-50/50 rounded-lg">
                  <div className="w-10 h-10 bg-slate-200 rounded-lg shrink-0"></div>
                  <div className="flex flex-col gap-2 w-full justify-center">
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    <div className="h-3 bg-slate-100 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overdue Shops Table Skeleton */}
          <div className="bg-white rounded-xl p-[clamp(1rem,2vw,1.5rem)] h-[550px]">
            <div className="h-6 bg-slate-200 rounded w-1/2 mb-8"></div>
            <div className="flex flex-col gap-4">
              <div className="h-10 bg-slate-100/80 rounded w-full mb-2"></div>
              {[...Array(6)].map((_, j) => (
                <div key={j} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                  <div className="flex flex-col gap-1.5">
                    <div className="h-4 bg-slate-200 rounded w-24"></div>
                    <div className="h-3 bg-slate-100 rounded w-16"></div>
                  </div>
                  <div className="h-4 bg-slate-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
