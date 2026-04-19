import { formatPKR, calcDeltaPercentage } from "@/lib/dashboard-utils";
import { CircleDollarSign, TrendingUp, TrendingDown, Users, Package } from "lucide-react";

export function PulseCards({ pulse }: { pulse: any }) {
  const cards = [
    {
      label: "Distributed Today",
      value: formatPKR(pulse.todayDistributed),
      delta: calcDeltaPercentage(pulse.todayDistributed, pulse.yesterdayDistributed),
      icon: <Package className="text-[var(--color-primary)] w-5 h-5" />
    },
    {
      label: "Payments Today",
      value: formatPKR(pulse.todayPayments),
      delta: calcDeltaPercentage(pulse.todayPayments, pulse.yesterdayPayments),
      icon: <CircleDollarSign className="text-green-600 w-5 h-5" />
    },
    {
      label: "Active Salesmen",
      value: `${pulse.activeSalesmenCount} / ${pulse.totalSalesmenCount}`,
      delta: null,
      icon: <Users className="text-orange-500 w-5 h-5" />
    },
    {
      label: "Deliveries Today",
      value: pulse.todayDeliveriesCount.toString(),
      delta: null,
      icon: <TrendingUp className="text-blue-500 w-5 h-5" />
    }
  ];

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[clamp(1rem,2vw,1.5rem)]">
      {cards.map((card, i) => (
        <div key={i} className="bg-white rounded-xl p-[clamp(1rem,2vw,1.5rem)] shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[#64748B] font-medium" style={{ fontSize: "clamp(0.75rem, 1.2vw, 0.875rem)" }}>
              {card.label}
            </p>
            <div className="bg-[#F8FAFC] p-2 rounded-lg">
              {card.icon}
            </div>
          </div>
          <div className="flex items-end justify-between">
            <h3 className="text-[#0A2540] font-bold" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
              {card.value}
            </h3>
            {card.delta !== null && (
              <p 
                className={`font-semibold ${card.delta >= 0 ? "text-green-600" : "text-red-600"}`}
                style={{ fontSize: "clamp(0.75rem, 1.2vw, 0.875rem)" }}
              >
                {card.delta >= 0 ? "+" : ""}{card.delta}%
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
