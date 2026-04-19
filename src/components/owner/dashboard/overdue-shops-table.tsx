import { formatPKR } from "@/lib/dashboard-utils";

export function OverdueShopsTable({ shops }: { shops: any[] }) {
  const getBadgeStyle = (days: number) => {
    if (days >= 90) return "bg-red-100 text-red-700 border-red-200";
    if (days >= 60) return "bg-orange-100 text-orange-700 border-orange-200";
    if (days >= 30) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <div className="bg-white rounded-xl p-[clamp(1rem,2vw,1.5rem)] shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
      <h3 className="font-bold text-[#0A2540] mb-4" style={{ fontSize: "clamp(1rem, 1.5vw, 1.125rem)" }}>
        Overdue Shops (Worst Offenders)
      </h3>
      
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-3 font-medium text-[#64748B]" style={{ fontSize: "clamp(0.75rem, 1.1vw, 0.875rem)" }}>Shop Name</th>
              <th className="pb-3 font-medium text-[#64748B]" style={{ fontSize: "clamp(0.75rem, 1.1vw, 0.875rem)" }}>Region</th>
              <th className="pb-3 text-right font-medium text-[#64748B]" style={{ fontSize: "clamp(0.75rem, 1.1vw, 0.875rem)" }}>Outstanding</th>
              <th className="pb-3 text-center font-medium text-[#64748B]" style={{ fontSize: "clamp(0.75rem, 1.1vw, 0.875rem)" }}>Days Overdue</th>
            </tr>
          </thead>
          <tbody>
            {shops.map((shop, i) => (
              <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                <td className="py-3 pr-4 font-semibold text-[#0A2540]" style={{ fontSize: "clamp(0.8rem, 1.2vw, 0.9rem)" }}>
                  {shop.name}
                </td>
                <td className="py-3 px-2 text-[#64748B]" style={{ fontSize: "clamp(0.75rem, 1.1vw, 0.85rem)" }}>
                  {shop.region}
                </td>
                <td className="py-3 px-2 text-right font-bold text-red-600" style={{ fontSize: "clamp(0.8rem, 1.2vw, 0.9rem)" }}>
                  {formatPKR(shop.balance)}
                </td>
                <td className="py-3 pl-4 text-center">
                  <span 
                    className={`inline-block px-2.5 py-1 rounded-full border text-xs font-semibold ${getBadgeStyle(shop.daysOverdue)}`}
                  >
                    {shop.daysOverdue} Days
                  </span>
                </td>
              </tr>
            ))}
            {shops.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-400 italic">No overdue shops found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
