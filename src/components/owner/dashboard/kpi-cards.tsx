import { formatNumber } from "@/lib/dashboard-utils";
import { formatPKR } from "@/lib/helper";
import { cn } from "@/lib/utils";

interface KPIData {
  totalPendingReceivable: number;
  collectionEfficiency: number;
  totalStockCount: number;
}

export function KPICards({ kpis }: { kpis: KPIData }) {
  const cards = [
    {
      title: "Pending Payments",
      value: formatPKR(kpis.totalPendingReceivable),
      desc: "Outstanding shop balances",
      colorClass: "text-amber-600",
      bgClass: "bg-amber-50",
    },
    {
      title: "Collection Efficiency",
      value: `${kpis.collectionEfficiency.toFixed(1)}%`,
      desc: "Payments / Distribution Ratio",
      colorClass: "text-[#053B70]",
      bgClass: "bg-white",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-full lg:grid-cols-1 gap-[clamp(1rem,2vw,1.5rem)]">
      {cards.map((card, i) => (
        <div
          key={i}
          className={cn(
            "rounded-[clamp(10px,1.5vw,16px)] p-[clamp(1.25rem,2.5vw,1.75rem)] flex flex-col justify-center transition-colors",
            card.bgClass,
          )}
        >
          <p
            className={cn(
              "font-bold uppercase tracking-wider mb-2",
              card.colorClass,
            )}
            style={{ fontSize: "clamp(10px, 1.2vw, 11px)", opacity: 0.8 }}
          >
            {card.title}
          </p>
          <h3
            className={cn("font-bold", card.colorClass)}
            style={{ fontSize: "clamp(1.5rem, 2.5vw, 1.875rem)" }}
          >
            {typeof card.value === "number"
              ? formatNumber(card.value)
              : card.value}
          </h3>
          <p
            className="text-[#64748B] mt-2 font-medium"
            style={{ fontSize: "clamp(12px, 1vw, 13px)" }}
          >
            {card.desc}
          </p>
        </div>
      ))}
    </div>
  );
}
