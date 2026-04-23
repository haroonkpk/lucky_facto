"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { formatPKR } from "@/lib/dashboard-utils";
import { Card } from "@/components/shared";

interface SalesCardProps {
  monthlySales: number;
  todaySales: number;
}

export const SalesCard = ({ monthlySales, todaySales }: SalesCardProps) => {
  const [showToday, setShowToday] = useState(false);

  const currentAmount = showToday ? todaySales : monthlySales;
  const label = showToday ? "Today's Sales" : "This Month's Sales";

  return (
    <Card
      variant="primary"
      className="h-full sm:w-full flex flex-col justify-between"
    >
      {/* Top row */}
      <div
        className="flex items-center justify-between relative z-10 mb-8"
        style={{
          marginBottom: "clamp(20px, 3vw, 32px)",
        }}
      >
        <p
          className="text-white/80 font-bold uppercase tracking-widest"
          style={{ fontSize: "clamp(10px, 1.6vw, 18px)" }}
        >
          {label}
        </p>
        <button
          onClick={() => setShowToday((v) => !v)}
          className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm transition-all duration-200 active:scale-95"
          style={{
            borderRadius: "clamp(6px, 1vw, 10px)",
            padding: "clamp(6px, 1vw, 8px) clamp(10px, 1.5vw, 14px)",
            fontSize: "clamp(10px, 1.2vw, 12px)",
          }}
          aria-label="Toggle sales period"
        >
          <CalendarDays size={14} />
          <span className="font-semibold">
            {showToday ? "This Month" : "Today"}
          </span>
        </button>
      </div>

      {/* Amount */}
      <div className="relative sm:mb-5 z-10">
        <p
          className="font-bold tracking-tight transition-all duration-300"
          style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)" }}
          key={label}
        >
          {formatPKR(currentAmount)}
        </p>
        <p
          className="text-white/60 mt-1"
          style={{ fontSize: "clamp(11px, 1.3vw, 13px)" }}
        >
          Total distribution value
        </p>
      </div>
    </Card>
  );
};
