"use client";

import { formatPKR } from "@/lib/dashboard-utils";
import { CircleDollarSign, TrendingUp, Truck, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface PulseCardProps {
  title: string;
  value: string | number;
  Icon: LucideIcon;
  iconColor: string;
  bgColor?: string;
  isCurrency?: boolean;
}

export function PulseCard({
  title,
  value,
  Icon,
  iconColor,
  bgColor = "bg-[var(--color-primary)]",
  isCurrency = true,
}: PulseCardProps) {
  const displayValue = isCurrency
    ? formatPKR(Number(value))
    : value.toLocaleString();

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[clamp(10px,1.5vw,16px)] p-[clamp(1.25rem,2.5vw,1.75rem)] flex flex-col justify-between min-h-32 md:min-h-36",
        bgColor,
      )}
    >
      <Icon
        className={cn(
          "absolute -top-4 -right-4 w-28 h-28 -rotate-12 pointer-events-none z-0 opacity-10",
          iconColor,
        )}
      />

      <div className="relative z-10 flex justify-between items-start mb-2">
        <p
          className="text-white/70 font-bold uppercase tracking-wider mt-1"
          style={{ fontSize: "clamp(10px, 1.2vw, 11px)" }}
        >
          {title}
        </p>
      </div>

      <div className="relative z-10 flex items-end justify-between">
        <h3
          className="text-white font-bold"
          style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
        >
          {displayValue}
        </h3>
      </div>
    </div>
  );
}

export function PendingReceivableCard({
  value,
  shopCount,
}: {
  value: number;
  shopCount: number;
}) {
  return (
    <div 
      className="relative overflow-hidden rounded-[clamp(10px,1.5vw,16px)] p-[clamp(1.25rem,2.5vw,1.75rem)] flex flex-col justify-between h-full min-h-32 md:min-h-36"
      style={{ backgroundColor: "var(--color-pending-bg)" }}
    >
      {/* BG Icon */}
      <CircleDollarSign className="absolute -top-4 -right-4 w-28 h-28 -rotate-12 pointer-events-none z-0 opacity-10 text-amber-900" />

      <div className="relative z-10 flex items-center gap-3">
        <div className="bg-amber-600/15 p-2 rounded-lg">
          <AlertCircle size={18} className="text-amber-700" />
        </div>
        <p className="text-amber-800 font-bold uppercase tracking-wider text-[clamp(10px,1.2vw,11px)]">
          Pending Receivable
        </p>
      </div>

      <div className="relative z-10 flex flex-col mt-4">
        <h3 
          className="font-bold text-[clamp(1.8rem,3.5vw,2.4rem)] leading-none tracking-tight"
          style={{ color: "var(--color-pending)" }}
        >
          {formatPKR(value)}
        </h3>
        <p className="text-amber-800/70 font-bold text-[clamp(11px,1.3vw,13px)] mt-2 uppercase tracking-widest">
          From {shopCount} {shopCount === 1 ? "Shop" : "Shops"}
        </p>
      </div>
    </div>
  );
}

export function StaticSummarySection({
  pending,
  pendingShopsCount,
}: {
  pending: number;
  pendingShopsCount: number;
}) {
  return (
    <div className="h-full">
      <PendingReceivableCard value={pending} shopCount={pendingShopsCount} />
    </div>
  );
}

export function FilteredPerformanceSection({
  distributed,
  payments,
  deliveries,
}: {
  distributed: number;
  payments: number;
  deliveries: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-[clamp(1rem,2vw,1.5rem)]">
      <PulseCard
        title="Total Distributed"
        value={distributed}
        Icon={TrendingUp}
        iconColor="text-white"
        bgColor="bg-[var(--color-primary)]"
      />
      <PulseCard
        title="Total Payments"
        value={payments}
        Icon={CircleDollarSign}
        iconColor="text-white"
        bgColor="bg-[var(--color-primary)]"
      />
      <PulseCard
        title="Total Deliveries"
        value={deliveries}
        Icon={Truck}
        iconColor="text-white"
        bgColor="bg-[var(--color-primary)]"
        isCurrency={false}
      />
    </div>
  );
}
