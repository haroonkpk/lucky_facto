import { formatPKR } from "@/lib/dashboard-utils";

export function OverdueShopsTable({ shops }: { shops: any[] }) {
  const getBadgeStyle = (days: number) => {
    if (days >= 90) return "bg-[#FEF2F2] text-[#991B1B]";
    if (days >= 60) return "bg-[#FFF7ED] text-[#9A3412]";
    if (days >= 30) return "bg-[#FEFCE8] text-[#854D0E]";
    return "bg-[#F8FAFC] text-[#475569]";
  };

  return (
    <div className="bg-white rounded-[clamp(10px,1.5vw,16px)] p-[clamp(1.25rem,2vw,2rem)] overflow-hidden flex flex-col h-full">
      <div className="flex justify-between items-center mb-6 px-1">
        <h3 className="font-bold text-[#0A2540]" style={{ fontSize: "clamp(1rem, 1.5vw, 1.25rem)" }}>
          Overdue Shops
        </h3>
        <span className="text-[#64748B] font-bold uppercase tracking-widest" style={{ fontSize: "clamp(9px, 1vw, 11px)" }}>
          Top Offenders
        </span>
      </div>
      
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#F1F5F9]">
              <th className="pb-4 font-bold text-[#64748B] uppercase tracking-wider" style={{ fontSize: "clamp(10px, 1.1vw, 11px)" }}>Shop Name</th>
              {/* <th className="pb-4 font-bold text-[#64748B] uppercase tracking-wider" style={{ fontSize: "clamp(10px, 1.1vw, 11px)" }}>Region</th> */}
              <th className="pb-4 text-right font-bold text-[#64748B] uppercase tracking-wider" style={{ fontSize: "clamp(10px, 1.1vw, 11px)" }}>Outstanding</th>
              <th className="pb-4 text-center font-bold text-[#64748B] uppercase tracking-wider" style={{ fontSize: "clamp(10px, 1.1vw, 11px)" }}>Latency</th>
            </tr>
          </thead>
          <tbody>
            {shops.map((shop, i) => (
              <tr key={i} className="border-b border-[#F8FAFC] last:border-0 hover:bg-[#F8FAFC]/50 transition-colors">
                <td className="py-4 pr-4 font-bold text-[#0A2540]" style={{ fontSize: "clamp(0.85rem, 1.2vw, 0.95rem)" }}>
                  {shop.name}
                </td>
                {/* <td className="py-4 px-2 text-[#64748B] font-medium" style={{ fontSize: "clamp(0.8rem, 1.1vw, 0.9rem)" }}>
                  {shop.region}
                </td> */}
                <td className="py-4 px-2 text-right font-bold text-[#C0392B]" style={{ fontSize: "clamp(0.85rem, 1.2vw, 0.95rem)" }}>
                  {formatPKR(shop.balance)}
                </td>
                <td className="py-4 pl-4 text-center">
                  <span 
                    className={`inline-block px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider ${getBadgeStyle(shop.daysOverdue)}`}
                  >
                    {shop.daysOverdue} Days
                  </span>
                </td>
              </tr>
            ))}
            {shops.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-[#94A3B8] font-medium text-sm italic">No overdue accounts detected</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
