import { formatPKR } from "@/lib/dashboard-utils";

interface OverdueShop {
  id: string;
  name: string;
  region: string;
  balance: number;
  daysOverdue: number;
}

export function OverdueShopsTable({ shops }: { shops: OverdueShop[] }) {
  const getBadgeStyle = (days: number) => {
    if (days >= 90) return "bg-[#FEF2F2] text-[#991B1B]";
    if (days >= 60) return "bg-[#FFF7ED] text-[#9A3412]";
    if (days >= 30) return "bg-[#FEFCE8] text-[#854D0E]";
    return "bg-[#F8FAFC] text-[#475569]";
  };

  const filteredShops = shops.filter((shop) => shop.balance >= 300000);

  return (
    <div className="bg-amber-50 rounded-[clamp(10px,1.5vw,16px)] p-[clamp(1.25rem,2vw,2rem)] overflow-hidden flex flex-col h-[420px] order-1 xl:order-2">
      <div className="flex justify-between items-center mb-6 px-1">
        <h3
          className="font-bold text-[#0A2540]"
          style={{ fontSize: "clamp(1rem, 1.5vw, 1.25rem)" }}
        >
          Overdue Shops
        </h3>
      </div>

      <div className="overflow-y-auto scrollbar-hide flex-1">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-amber-50 z-10">
            <tr className="border-b border-[#F1F5F9]">
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
                Outstanding
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
            {filteredShops.map((shop, i) => (
              <tr
                key={i}
                className="border-b border-[#F8FAFC] last:border-0 hover:bg-amber-600/10 transition-colors"
              >
                <td
                  className="py-4 pr-4 font-bold text-amber-600"
                  style={{ fontSize: "clamp(0.75rem, 1vw, 0.95rem)" }}
                >
                  {shop.name}
                </td>
                <td
                  className="py-4 px-2 text-right font-bold text-red-600"
                  style={{ fontSize: "clamp(0.85rem, 1.2vw, 0.95rem)" }}
                >
                  {formatPKR(shop.balance)}
                </td>
                <td className="py-4 pl-4 text-center">
                  <span
                    className={`inline-block px-3 py-1 rounded-lg text-[8px] font-bold uppercase tracking-wider ${getBadgeStyle(shop.daysOverdue)}`}
                  >
                    {shop.daysOverdue} Days
                  </span>
                </td>
              </tr>
            ))}
            {filteredShops.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="py-8 text-center text-[#94A3B8] font-medium text-sm italic"
                >
                  No overdue accounts above PKR 3,00,000
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
