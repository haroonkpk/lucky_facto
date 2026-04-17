import { AlertCircle } from "lucide-react";
import { formatPKR } from "@/lib/helper";

interface PendingPaymentsCardProps {
  totalPending: number;
  shopCount: number;
}

export default function PendingPaymentsCard({
  totalPending,
  shopCount,
}: PendingPaymentsCardProps) {
  const hasPending = totalPending > 0;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: hasPending
          ? "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)"
          : "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
        borderRadius: "clamp(12px, 2vw, 20px)",
        padding: "clamp(20px, 3vw, 32px)",
      }}
    >
      {/* Icon */}
      <div
        className="flex items-center gap-3 mb-3"
      >
        <div
          className="flex items-center justify-center shrink-0"
          style={{
            width: "clamp(36px, 5vw, 44px)",
            height: "clamp(36px, 5vw, 44px)",
            borderRadius: "clamp(8px, 1.2vw, 12px)",
            background: hasPending ? "rgba(245, 158, 11, 0.15)" : "rgba(16, 185, 129, 0.15)",
          }}
        >
          <AlertCircle
            size={20}
            className={hasPending ? "text-amber-600" : "text-emerald-600"}
          />
        </div>
        <p
          className={`font-bold uppercase tracking-widest ${hasPending ? "text-amber-700" : "text-emerald-700"}`}
          style={{ fontSize: "clamp(10px, 1.2vw, 12px)" }}
        >
          Pending Payments
        </p>
      </div>

      {/* Amount */}
      <p
        className={`font-bold tracking-tight ${hasPending ? "text-amber-900" : "text-emerald-900"}`}
        style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }}
      >
        {formatPKR(totalPending)}
      </p>

      {/* Detail */}
      <p
        className={`mt-1 ${hasPending ? "text-amber-700/70" : "text-emerald-700/70"}`}
        style={{ fontSize: "clamp(11px, 1.3vw, 13px)" }}
      >
        {hasPending
          ? `From ${shopCount} shop${shopCount !== 1 ? "s" : ""}`
          : "All payments are cleared"}
      </p>
    </div>
  );
}
