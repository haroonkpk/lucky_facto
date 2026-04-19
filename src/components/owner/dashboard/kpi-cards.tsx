import { formatNumber } from "@/lib/dashboard-utils";
import { cn } from "@/lib/utils";

export function KPICards({ kpis }: { kpis: any }) {
  const cards = [
    {
      title: "Pending Receivable",
      value: kpis.totalPendingReceivable,
      desc: "Total shop balance > 0",
      colorClass: "text-[#C0392B]",
    },
    {
      title: "Collection Efficiency",
      value: `${kpis.collectionEfficiency.toFixed(1)}%`,
      desc: "Payments / Distribution Ratio",
      colorClass: "text-[#053B70]",
    },
    {
      title: "Stock in Hand",
      value: formatNumber(kpis.totalStockCount),
      desc: "Units across all brands",
      colorClass: "text-[#0D3E8D]",
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3 gap-[clamp(1rem,2vw,1.5rem)]">
      {cards.map((card, i) => (
        <div 
          key={i} 
          className="bg-white rounded-[clamp(10px,1.5vw,16px)] p-[clamp(1.25rem,2.5vw,1.75rem)] flex flex-col justify-center"
        >
          <p className="text-[#64748B] font-bold uppercase tracking-wider mb-2" style={{ fontSize: "clamp(10px, 1.2vw, 11px)" }}>
            {card.title}
          </p>
          <h3 className={cn("font-bold", card.colorClass)} style={{ fontSize: "clamp(1.5rem, 2.5vw, 1.875rem)" }}>
            {card.value}
          </h3>
          <p className="text-[#94A3B8] mt-2 font-medium" style={{ fontSize: "clamp(12px, 1vw, 13px)" }}>
            {card.desc}
          </p>
        </div>
      ))}
    </div>
  );
}
