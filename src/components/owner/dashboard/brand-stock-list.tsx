import { formatNumber } from "@/lib/dashboard-utils";

export function BrandStockList({ stock }: { stock: any[] }) {
  const maxStock = Math.max(...stock.map(s => s.currentStock), 1);

  return (
    <div className="bg-white rounded-xl p-[clamp(1rem,2vw,1.5rem)] shadow-sm border border-slate-100 h-full flex flex-col">
      <h3 className="font-bold text-[#0A2540] mb-4" style={{ fontSize: "clamp(1rem, 1.5vw, 1.125rem)" }}>
        Brand-Wise Stock
      </h3>
      
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2 scrollbar-hide">
        {stock.map((item, i) => {
          const percentage = Math.min(100, Math.max(0, (item.currentStock / maxStock) * 100));
          return (
            <div key={i} className="flex flex-col gap-1">
              <div className="flex justify-between items-end">
                <span className="text-[#0A2540] font-medium" style={{ fontSize: "clamp(0.8rem, 1.2vw, 0.9rem)" }}>
                  {item.brandName}
                </span>
                <span className="text-[#64748B] font-semibold" style={{ fontSize: "clamp(0.75rem, 1.1vw, 0.875rem)" }}>
                  {formatNumber(item.currentStock)}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
        {stock.length === 0 && (
          <p className="text-gray-400 text-sm italic text-center mt-4">No stock found</p>
        )}
      </div>
    </div>
  );
}
