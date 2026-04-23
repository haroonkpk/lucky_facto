"use client";

import { Modal } from "./modal";
import { Activity } from "@/types/activity";
import { formatPKR } from "@/lib/dashboard-utils";
import {
  Truck,
  Banknote,
  PackagePlus,
  X,
  Activity as ActivityIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityDetailsModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
}

const TABLE_DETAIL_LABELS = new Set([
  "date & time",
  "shop",
  "quantity",
  "amount",
]);

export function ActivityDetailsModal({
  activity,
  isOpen,
  onClose,
}: ActivityDetailsModalProps) {
  if (!activity) return null;

  const getThemeProps = () => {
    switch (activity.type) {
      case "distribution":
        return {
          icon: Truck,
          accent: "text-[var(--color-primary)]",
          badgeBg: "bg-[var(--color-primary)]/8",
          headerBg: "bg-[var(--color-primary)]",
        };
      case "payment":
        return {
          icon: Banknote,
          accent: "text-emerald-600",
          badgeBg: "bg-emerald-50",
          headerBg: "bg-emerald-600",
        };
      case "intake":
        return {
          icon: PackagePlus,
          accent: "text-amber-600",
          badgeBg: "bg-amber-50",
          headerBg: "bg-amber-500",
        };
      default:
        return {
          icon: ActivityIcon,
          accent: "text-slate-600",
          badgeBg: "bg-slate-50",
          headerBg: "bg-slate-600",
        };
    }
  };

  const { icon: Icon, accent, badgeBg, headerBg } = getThemeProps();

  const modalDetails = activity.details.filter(
    (d) => !TABLE_DETAIL_LABELS.has(d.label.toLowerCase()),
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showHeader={false}
      className="max-w-lg w-full overflow-hidden bg-(--color-page-bg)"
    >
      {/* Header */}
      <div
        className={cn(
          "px-5 py-3.5 flex items-center justify-between",
          headerBg,
        )}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-white/15 flex items-center justify-center shrink-0">
            <Icon size={15} className="text-white" />
          </div>
          <span className="text-white font-semibold text-sm tracking-wide">
            Activity Details
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Title + badge row */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-1">
              {activity.title}
            </p>
            <h2
              className="text-lg font-bold text-[#0A2540] leading-snug truncate"
              title={activity.subtitle || activity.title}
            >
              {activity.subtitle || activity.title}
            </h2>
          </div>
          <span
            className={cn(
              "shrink-0 text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full tracking-wider mt-0.5",
              badgeBg,
              accent,
            )}
          >
            {activity.type}
          </span>
        </div>

        {/* Amount pill */}
        {activity.amount !== undefined && activity.amount > 0 && (
          <div
            className={cn(
              "flex items-center justify-between rounded-xl px-4 py-3",
              badgeBg,
            )}
          >
            <span className="text-xs font-medium text-slate-500">
              Total Amount
            </span>
            <span className={cn("text-base font-bold tabular-nums", accent)}>
              {activity.type === "payment" ? "+" : ""}
              {formatPKR(activity.amount)}
            </span>
          </div>
        )}

        {/* Detail cards  */}
        {modalDetails.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-3.5 w-0.5 bg-[var(--color-primary)] rounded-full" />
              <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                Additional Info
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {modalDetails.map((detail, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "bg-white rounded-xl px-3.5 py-3",
                    detail.label.length > 10 ? "col-span-2" : "",
                  )}
                >
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-1 truncate">
                    {detail.label}
                  </p>
                  <p
                    className="text-sm font-semibold text-[#0A2540] line-clamp-2 leading-snug"
                    title={String(detail.value)}
                  >
                    {typeof detail.value === "number" &&
                    (detail.label.toLowerCase().includes("price") ||
                      detail.label.toLowerCase().includes("amount"))
                      ? formatPKR(detail.value)
                      : detail.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
