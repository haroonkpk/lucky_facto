import { formatPKR } from "@/lib/dashboard-utils";
import { Card } from "@/components/ui";

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
    <Card
      variant="pending"
      className="flex flex-col h-[420px] order-1 xl:order-2"
    >
      <div className="flex flex-col mb-6 px-1">
        <h3
          className="font-bold text-[#0A2540]"
          style={{ fontSize: "clamp(1rem, 1.5vw, 1.25rem)" }}
        >
          Critical Overdue Shops
        </h3>
        <p className="text-xs text-[#94A3B8] mt-0.5">
          Pending balance ≥ PKR 3,00,000
        </p>
      </div>

      <div className="overflow-y-auto scrollbar-hide flex-1">
        <table className="w-full text-left border-collapse">
          <thead
            className="sticky top-0 z-10"
            style={{ backgroundColor: "var(--color-pending-bg)" }}
          >
            <tr className="border-b border-[#ffe588]/50">
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
                className="border-b border-[#742302] last:border-0 hover:bg-amber-600/10 transition-colors"
              >
                <td
                  className="py-4 pr-4 font-bold text-amber-600"
                  style={{ fontSize: "clamp(0.75rem, 1vw, 0.95rem)" }}
                >
                  {shop.name}
                </td>
                <td
                  className="py-4 px-2 text-right font-bold"
                  style={{
                    fontSize: "clamp(0.85rem, 1.2vw, 0.95rem)",
                    color: "#C0392B",
                  }}
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
    </Card>
  );
}
