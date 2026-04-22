import { formatPKR } from "@/lib/dashboard-utils";

interface DetailedPendingPaymentsProps {
  shops: {
    id: string;
    name: string;
    amount: number;
    daysOverdue: number;
  }[];
}

export const DetailedPendingPayments = ({ shops }: DetailedPendingPaymentsProps) => {
  const getBadgeStyle = (days: number) => {
    if (days >= 90) return "bg-[#FEF2F2] text-[#991B1B]";
    if (days >= 60) return "bg-[#FFF7ED] text-[#9A3412]";
    if (days >= 30) return "bg-[#FEFCE8] text-[#854D0E]";
    return "bg-[#F8FAFC] text-[#475569]";
  };

  return (
    <div 
      className="rounded-[clamp(12px,2vw,20px)] p-[clamp(20px,3vw,32px)] overflow-hidden flex flex-col"
      style={{ backgroundColor: "var(--color-pending-bg)" }}
    >
      <div className="flex justify-between items-center mb-6 px-1">
        <h3 
          className="font-bold text-[#0A2540]" 
          style={{ fontSize: "clamp(1rem, 1.5vw, 1.25rem)" }}
        >
          Pending Payments Detail
        </h3>
        <span 
          className="text-[#64748B] font-bold uppercase tracking-widest text-right" 
          style={{ fontSize: "clamp(9px, 1vw, 11px)" }}
        >
          By Shop
        </span>
      </div>
      
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-amber-200/50">
              <th 
                className="pb-4 font-bold text-[#64748B] uppercase tracking-wider" 
                style={{ fontSize: "clamp(10px, 1.1vw, 11px)" }}
              >
                Shop Name
              </th>
              <th 
                className="pb-4 text-right font-bold text-[#64748B] uppercase tracking-wider" 
                style={{ fontSize: "clamp(10px, 1.1vw, 11px)" }}
              >
                Pending Amount
              </th>
              <th 
                className="pb-4 text-center font-bold text-[#64748B] uppercase tracking-wider" 
                style={{ fontSize: "clamp(10px, 1.1vw, 11px)" }}
              >
                Latency
              </th>
            </tr>
          </thead>
          <tbody>
            {shops.map((shop) => (
              <tr 
                key={shop.id} 
                className="border-b border-amber-100/30 last:border-0 hover:bg-amber-600/5 transition-colors"
              >
                <td 
                  className="py-4 pr-4 font-bold text-amber-600" 
                  style={{ fontSize: "clamp(0.85rem, 1.2vw, 0.95rem)" }}
                >
                  {shop.name}
                </td>
                <td 
                  className="py-4 px-2 text-right font-bold" 
                  style={{ 
                    fontSize: "clamp(0.85rem, 1.2vw, 0.95rem)",
                    color: "var(--color-pending)"
                  }}
                >
                  {formatPKR(shop.amount)}
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
                <td 
                  colSpan={3} 
                  className="py-8 text-center text-[#94A3B8] font-medium text-sm italic"
                >
                  No pending payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
