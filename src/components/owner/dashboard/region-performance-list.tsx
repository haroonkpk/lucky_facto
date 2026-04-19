import { formatPKR } from "@/lib/dashboard-utils";

export function RegionPerformanceList({ performance }: { performance: any[] }) {
  const maxAmount = Math.max(...performance.map(p => p.amount), 1);

  return (
    <div className="bg-white rounded-xl p-[clamp(1rem,2vw,1.5rem)] shadow-sm border border-slate-100 h-full flex flex-col">
      <h3 className="font-bold text-[#0A2540] mb-4" style={{ fontSize: "clamp(1rem, 1.5vw, 1.125rem)" }}>
        Region Performance (This Month)
      </h3>
      
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2 scrollbar-hide">
        {performance.map((item, i) => {
          const percentage = Math.min(100, Math.max(0, (item.amount / maxAmount) * 100));
          return (
            <div key={i} className="flex flex-col gap-1">
              <div className="flex justify-between items-end">
                <span className="text-[#0A2540] font-medium" style={{ fontSize: "clamp(0.8rem, 1.2vw, 0.9rem)" }}>
                  {item.name}
                </span>
                <span className="text-green-700 font-semibold" style={{ fontSize: "clamp(0.75rem, 1.1vw, 0.875rem)" }}>
                  {formatPKR(item.amount)}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
        {performance.length === 0 && (
          <p className="text-gray-400 text-sm italic text-center mt-4">No performance data yet</p>
        )}
      </div>
    </div>
  );
}
