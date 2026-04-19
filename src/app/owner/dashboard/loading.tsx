export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[var(--color-page-bg)] p-[clamp(0.75rem,3vw,2.5rem)] pb-20 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-start justify-between gap-4 mb-[clamp(1.5rem,3vw,2.5rem)]">
        <div className="min-w-0 flex flex-col gap-2 w-full max-w-sm">
          <div className="h-3 bg-slate-200 rounded w-1/3"></div>
          <div className="h-8 bg-slate-200 rounded w-2/3"></div>
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        </div>
        <div className="shrink-0 w-10 h-10 bg-slate-200 rounded-full"></div>
      </div>

      <div className="flex flex-col gap-[clamp(1.5rem,3vw,2rem)]">
        {/* ROW 1: Pulse Cards */}
        <section className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[clamp(1rem,2vw,1.5rem)]">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-[clamp(1rem,2vw,1.5rem)]  flex flex-col justify-between h-[120px]"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
              </div>
              <div className="flex items-end justify-between">
                <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </section>

        {/* ROW 2: KPIs & Chart Block */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,1.5fr)] gap-[clamp(1.5rem,3vw,2rem)] items-stretch">
          <div className="flex flex-col gap-[clamp(1.5rem,3vw,2rem)]">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-[clamp(1rem,2vw,1.5rem)] h-full">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-[clamp(1rem,1.5vw,1.5rem)]  flex flex-col justify-center items-center h-[140px]"
                >
                  <div className="h-4 bg-slate-200 rounded w-2/3 mb-4"></div>
                  <div className="h-8 bg-slate-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl p-[clamp(1rem,2vw,1.5rem)]  h-[350px]">
            <div className="h-6 bg-slate-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/4 mb-6"></div>
            <div className="w-full h-[250px] bg-slate-100 rounded-lg"></div>
          </div>
        </section>

        {/* ROW 3: Domain Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(1.5rem,3vw,2rem)]">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-[clamp(1rem,2vw,1.5rem)]  h-[300px]"
            >
              <div className="h-6 bg-slate-200 rounded w-1/3 mb-6"></div>
              <div className="flex flex-col gap-4">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                      <div className="h-4 bg-slate-200 rounded w-1/6"></div>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* ROW 4: Table & Feed */}
        <section className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-[clamp(1.5rem,3vw,2rem)] items-start">
          <div className="bg-white rounded-xl p-[clamp(1rem,2vw,1.5rem)]  h-[400px]">
            <div className="h-6 bg-slate-200 rounded w-1/4 mb-6"></div>
            <div className="flex flex-col gap-4">
              <div className="h-8 bg-slate-200 rounded w-full"></div>
              {[...Array(5)].map((_, j) => (
                <div key={j} className="h-10 bg-slate-100 rounded w-full"></div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl p-[clamp(1rem,2vw,1.5rem)]  h-[400px]">
            <div className="h-6 bg-slate-200 rounded w-1/2 mb-6"></div>
            <div className="flex flex-col gap-6">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="flex gap-4">
                  <div className="w-4 h-4 bg-slate-200 rounded-full shrink-0"></div>
                  <div className="flex flex-col gap-2 w-full">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
