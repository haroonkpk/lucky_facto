import { formatNumber } from "@/lib/dashboard-utils";

export function KPICards({ kpis }: { kpis: any }) {
  const cards = [
    {
      title: "Pending Receivable",
      value: kpis.totalPendingReceivable,
      desc: "Total shop balance > 0",
      colorClass: "text-red-600",
    },
    {
      title: "Collection Efficiency",
      value: `${kpis.collectionEfficiency.toFixed(1)}%`,
      desc: "Payments / Distrib. (Last 30 days)",
      colorClass: "text-[#0A2540]",
    },
    {
      title: "Total Stock",
      value: formatNumber(kpis.totalStockCount),
      desc: "Units across all brands",
      colorClass: "text-[var(--color-primary)]",
    }
  ];

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-[clamp(1rem,2vw,1.5rem)]">
      {cards.map((card, i) => (
        <div key={i} className="bg-white rounded-xl p-[clamp(1rem,1.5vw,1.5rem)] shadow-sm border border-slate-100 flex flex-col justify-center text-center">
          <p className="text-[#64748B] font-medium mb-1" style={{ fontSize: "clamp(0.75rem, 1.2vw, 0.875rem)" }}>
            {card.title}
          </p>
          <h3 className={`font-bold ${card.colorClass}`} style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)" }}>
            {card.value}
          </h3>
          <p className="text-[#94A3B8] mt-1" style={{ fontSize: "clamp(0.7rem, 1vw, 0.8rem)" }}>
            {card.desc}
          </p>
        </div>
      ))}
    </div>
  );
}
