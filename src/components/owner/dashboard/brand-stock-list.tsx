import { formatNumber } from "@/lib/dashboard-utils";

export function BrandStockList({ stock }: { stock: any[] }) {
  const maxStock = Math.max(...stock.map(s => s.currentStock), 1);

  return (
    <div className="bg-white rounded-[clamp(10px,1.5vw,16px)] p-[clamp(1.25rem,2vw,2rem)] h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 px-1">
        <h3 className="font-bold text-[#0A2540]" style={{ fontSize: "clamp(1rem, 1.5vw, 1.25rem)" }}>
          Brand-Wise Stock
        </h3>
        <span className="text-[#64748B] font-bold uppercase tracking-widest" style={{ fontSize: "clamp(9px, 1vw, 11px)" }}>
          Current Units
        </span>
      </div>
      
      <div className="flex-1 flex flex-col gap-5 overflow-y-auto pr-2 scrollbar-hide">
        {stock.map((item, i) => {
          const percentage = Math.min(100, Math.max(0, (item.currentStock / maxStock) * 100));
          return (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex justify-between items-end px-1">
                <span className="text-[#0A2540] font-bold" style={{ fontSize: "clamp(0.85rem, 1.2vw, 0.95rem)" }}>
                  {item.brandName}
                </span>
                <span className="text-[#053B70] font-bold" style={{ fontSize: "clamp(0.8rem, 1.1vw, 0.9rem)" }}>
                  {formatNumber(item.currentStock)}
                </span>
              </div>
              <div className="w-full bg-[#F1F5F9] h-[clamp(6px,0.8vw,8px)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#0D3E8D] rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
        {stock.length === 0 && (
          <p className="text-gray-400 text-sm italic text-center mt-4">No stock records found</p>
        )}
      </div>
    </div>
  );
}
