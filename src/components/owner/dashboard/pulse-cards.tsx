import { formatPKR, calcDeltaPercentage } from "@/lib/dashboard-utils";
import { CircleDollarSign, TrendingUp, Users, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

export function PulseCards({ pulse }: { pulse: any }) {
  const cards = [
    {
      label: "Distributed Today",
      value: formatPKR(pulse.todayDistributed),
      delta: calcDeltaPercentage(pulse.todayDistributed, pulse.yesterdayDistributed),
      Icon: Truck,
      iconColor: "text-white/5" 
    },
    {
      label: "Payments Today",
      value: formatPKR(pulse.todayPayments),
      delta: calcDeltaPercentage(pulse.todayPayments, pulse.yesterdayPayments),
      Icon: CircleDollarSign,
      iconColor: "text-green-500/10"
    },
    {
      label: "Active Salesmen",
      value: `${pulse.activeSalesmenCount} / ${pulse.totalSalesmenCount}`,
      delta: null,
      Icon: Users,
      iconColor: "text-orange-500/10"
    },
    {
      label: "Deliveries Today",
      value: pulse.todayDeliveriesCount.toString(),
      delta: null,
      Icon: TrendingUp,
      iconColor: "text-blue-300/10"
    }
  ];

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-[clamp(1rem,2vw,1.5rem)]">
      {cards.map((card, i) => (
        <div 
          key={i} 
          className="relative overflow-hidden bg-(--color-primary) rounded-[clamp(10px,1.5vw,16px)] p-[clamp(1.25rem,2.5vw,1.75rem)] flex flex-col justify-between min-h-35 md:min-h-40"
        >
          <card.Icon 
            className={cn(
              "absolute -top-4 -right-4 w-28 h-28 -rotate-12 pointer-events-none z-0",
              card.iconColor
            )} 
          />

          <div className="relative z-10 flex justify-between items-start mb-4">
            <p className="text-blue-300 font-bold uppercase tracking-wider" style={{ fontSize: "clamp(10px, 1.2vw, 11px)" }}>
              {card.label}
            </p>
          </div>
          
          <div className="relative z-10 flex items-end justify-between">
            <h3 className="text-blue-100 font-bold" style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.25rem)" }}>
              {card.value}
            </h3>
            {card.delta !== null && (
              <div 
                className={cn(
                  "flex items-center gap-1 font-bold px-2 py-1",
                  card.delta >= 0 ? "text-green-600 bg-white/10" : "text-red-600 bg-red-50"
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