import { formatPKR } from "@/lib/dashboard-utils";

export function RegionPerformanceList({ performance }: { performance: any[] }) {
  const maxAmount = Math.max(...performance.map(p => p.amount), 1);

  return (
    <div className="bg-white rounded-[clamp(10px,1.5vw,16px)] p-[clamp(1.25rem,2vw,2rem)] h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 px-1">
        <h3 className="font-bold text-[#0A2540]" style={{ fontSize: "clamp(1rem, 1.5vw, 1.25rem)" }}>
          Region Performance
        </h3>
        <span className="text-[#64748B] font-bold uppercase tracking-widest" style={{ fontSize: "clamp(9px, 1vw, 11px)" }}>
          Month to Date
        </span>
      </div>
      
      <div className="flex-1 flex flex-col gap-5 overflow-y-auto pr-2 scrollbar-hide">
        {performance.map((item, i) => {
          const percentage = Math.min(100, Math.max(0, (item.amount / maxAmount) * 100));
          return (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex justify-between items-end px-1">
                <span className="text-[#0A2540] font-bold" style={{ fontSize: "clamp(0.85rem, 1.2vw, 0.95rem)" }}>
                  {item.name}
                </span>
                <span className="text-green-600 font-bold" style={{ fontSize: "clamp(0.8rem, 1.1vw, 0.9rem)" }}>
                  {formatPKR(item.amount)}
                </span>
              </div>
              <div className="w-full bg-[#F1F5F9] h-[clamp(6px,0.8vw,8px)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
        {performance.length === 0 && (
          <p className="text-gray-400 text-sm italic text-center mt-4">No performance data found</p>
        )}
      </div>
    </div>
  );
}
