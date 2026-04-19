import { formatPKR, calcDeltaPercentage } from "@/lib/dashboard-utils";
import { CircleDollarSign, TrendingUp, Users, Package } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-[clamp(1rem,2vw,1.5rem)]">
      {cards.map((card, i) => (
        <div 
          key={i} 
          className="bg-white rounded-[clamp(10px,1.5vw,16px)] p-[clamp(1.25rem,2.5vw,1.75rem)] flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-4">
            <p className="text-[#64748B] font-bold uppercase tracking-wider" style={{ fontSize: "clamp(10px, 1.2vw, 11px)" }}>
              {card.label}
            </p>
            <div className="bg-[#F1F5F9] p-[clamp(8px,1vw,10px)] rounded-[clamp(6px,1vw,10px)]">
              {card.icon}
            </div>
          </div>
          <div className="flex items-end justify-between">
            <h3 className="text-[#0A2540] font-bold" style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)" }}>
              {card.value}
            </h3>
            {card.delta !== null && (
              <div 
                className={cn(
                  "flex items-center gap-1 font-bold rounded-lg px-2 py-1",
                  card.delta >= 0 ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                )}
                style={{ fontSize: "clamp(11px, 1.2vw, 13px)" }}
              >
                {card.delta >= 0 ? "+" : ""}{card.delta}%
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
