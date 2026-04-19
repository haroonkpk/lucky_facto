"use client";

import { useState } from "react";
import { formatPKR, calcDeltaPercentage } from "@/lib/dashboard-utils";
import {
  CircleDollarSign,
  TrendingUp,
  Truck,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PulseCardsProps, SinglePulseCardProps } from "@/types/dsahboard";




function SinglePulseCard({
  title,
  data,
  isCurrency,
  Icon,
  iconColor,
}: SinglePulseCardProps) {
  const [view, setView] = useState<"daily" | "monthly">("daily");

  const currentData = data[view];
  const value = isCurrency
    ? formatPKR(currentData.current)
    : currentData.current.toString();
  const delta = calcDeltaPercentage(currentData.current, currentData.previous);

  return (
    <div className="relative overflow-hidden bg-[var(--color-primary)] rounded-[clamp(10px,1.5vw,16px)] p-[clamp(1.25rem,2.5vw,1.75rem)] flex flex-col justify-between min-h-35 md:min-h-40">
      <Icon
        className={cn(
          "absolute -top-4 -right-4 w-28 h-28 -rotate-12 pointer-events-none z-0",
          iconColor,
        )}
      />

      <div className="relative z-10 flex justify-between items-start mb-4">
        <p
          className="text-blue-300 font-bold uppercase tracking-wider mt-1"
          style={{ fontSize: "clamp(10px, 1.2vw, 11px)" }}
        >
          {title} ({view === "daily" ? "Today" : "This Month"})
        </p>

        {/* Calendar Toggle Button */}
        <button
          onClick={() => setView(view === "daily" ? "monthly" : "daily")}
          className="bg-white/10 hover:bg-white/20 text-blue-100 px-2 py-1.5 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer z-20 border border-white/5"
          title={`Switch to ${view === "daily" ? "Monthly" : "Daily"} view`}
        >
          <CalendarDays size={14} />
          <span className="text-[10px] font-bold tracking-wider uppercase">
            {view === "daily" ? "Daily" : "Monthly"}
          </span>
        </button>
      </div>

      <div className="relative z-10 flex items-end justify-between">
        <h3
          className="text-blue-100 font-bold"
          style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.25rem)" }}
        >
          {value}
        </h3>
        {delta !== null && (
          <div
            className={cn(
              "flex items-center gap-1 font-bold px-2 py-1 rounded",
              delta >= 0
                ? "text-green-600 bg-white/10"
                : "text-red-600 bg-red-50",
            )}
            style={{ fontSize: "clamp(11px, 1.2vw, 13px)" }}
          >
            {delta >= 0 ? "+" : ""}
            {delta}%
          </div>
        )}
      </div>
    </div>
  );
}

export function PulseCards({ pulse }: PulseCardsProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-[clamp(1rem,2vw,1.5rem)]">
      <SinglePulseCard
        title="Distributed"
        data={pulse.distributed}
        isCurrency={true}
        Icon={Truck}
        iconColor="text-white/5"
      />
      <SinglePulseCard
        title="Payments"
        data={pulse.payments}
        isCurrency={true}
        Icon={CircleDollarSign}
        iconColor="text-green-500/10"
      />
      <SinglePulseCard
        title="Deliveries"
        data={pulse.deliveries}
        isCurrency={false}
        Icon={TrendingUp}
        iconColor="text-blue-300/10"
      />
    </div>
  );
}
