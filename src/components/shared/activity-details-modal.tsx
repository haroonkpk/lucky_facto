"use client";

import { Modal } from "./modal";
import { Activity } from "@/types/activity";
import { formatPKR } from "@/lib/dashboard-utils";
import { cn } from "@/lib/utils";
import {
  Truck,
  Banknote,
  PackagePlus,
  X,
  Activity as ActivityIcon,
  MapPin,
} from "lucide-react";

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
          headerBg: "bg-[var(--color-primary)]",
        };
      case "payment":
        return {
          icon: Banknote,
          accent: "text-emerald-600",
          headerBg: "bg-emerald-600",
        };
      case "intake":
        return {
          icon: PackagePlus,
          accent: "text-amber-600",
          headerBg: "bg-amber-500",
        };
      default:
        return {
          icon: ActivityIcon,
          accent: "text-slate-600",
          headerBg: "bg-slate-600",
        };
    }
  };

  const { icon: Icon, accent, headerBg } = getThemeProps();

  const modalDetails = activity.details.filter((d) => {
    const labelLower = d.label.toLowerCase();
    const isExcludedLabel = TABLE_DETAIL_LABELS.has(labelLower);
    if (isExcludedLabel) return false;

    const optionalFields = ["notes", "remarks", "description", "note"];
    if (optionalFields.includes(labelLower)) {
      return (
        d.value !== null &&
        d.value !== undefined &&
        d.value !== "" &&
        d.value !== "None"
      );
    }

    return true;
  });

  const isPayment = activity.type === "payment";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showHeader={false}
      className={cn(
        "w-full overflow-hidden bg-white",
        isPayment ? "max-w-4xl" : "max-w-lg",
      )}
    >
      {/* Header */}
      <div
        className={cn("flex items-center justify-between", headerBg)}
        style={{
          padding: "clamp(10px, 2vw, 16px) clamp(14px, 3vw, 24px)",
        }}
      >
        <div
          className="flex items-center"
          style={{ gap: "clamp(6px, 1vw, 10px)" }}
        >
          <Icon
            className="text-white"
            style={{
              width: "clamp(14px, 2vw, 20px)",
              height: "clamp(14px, 2vw, 20px)",
            }}
          />
          <span
            className="text-white font-medium capitalize"
            style={{ fontSize: "clamp(11px, 1.5vw, 14px)" }}
          >
            Activity Details
          </span>
        </div>
        <button onClick={onClose} className="text-white/80 hover:text-white">
          <X
            style={{
              width: "clamp(16px, 2vw, 22px)",
              height: "clamp(16px, 2vw, 22px)",
            }}
          />
        </button>
      </div>

      {/* Scrollable Body */}
      <div
        className="overflow-y-auto"
        style={{ maxHeight: "calc(85vh - 70px)" }}
      >
        <div className="flex flex-col md:flex-row h-full">
          {/* Left Side */}
          <div
            className="flex-1"
            style={{
              padding: "clamp(16px, 3vw, 28px)",
              display: "flex",
              flexDirection: "column",
              gap: "clamp(16px, 2.5vw, 28px)",
            }}
          >
            {/* Title & Meta */}
            <div>
              <div
                className="text-slate-500 capitalize"
                style={{
                  fontSize: "clamp(10px, 1.2vw, 13px)",
                  marginBottom: "clamp(2px, 0.4vw, 6px)",
                }}
              >
                {activity.type} •{" "}
                {new Date(activity.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>

              <h2
                className="font-semibold text-slate-900"
                style={{ fontSize: "clamp(16px, 2.5vw, 26px)" }}
              >
                {activity.title}
              </h2>

              {activity.subtitle && (
                <div
                  className="flex items-center text-slate-600"
                  style={{
                    gap: "clamp(4px, 0.5vw, 8px)",
                    marginTop: "clamp(4px, 0.6vw, 10px)",
                  }}
                >
                  <MapPin
                    className="shrink-0"
                    style={{
                      width: "clamp(12px, 1.5vw, 18px)",
                      height: "clamp(12px, 1.5vw, 18px)",
                    }}
                  />
                  <span style={{ fontSize: "clamp(11px, 1.3vw, 14px)" }}>
                    {activity.subtitle}
                  </span>
                </div>
              )}
            </div>

            {/* Amount */}
            {activity.amount !== undefined && activity.amount > 0 && (
              <div>
                <p
                  className="text-slate-500"
                  style={{
                    fontSize: "clamp(10px, 1.2vw, 13px)",
                    marginBottom: "clamp(2px, 0.4vw, 6px)",
                  }}
                >
                  Net Amount
                </p>
                <p
                  className={cn("font-bold tabular-nums", accent)}
                  style={{ fontSize: "clamp(18px, 3vw, 28px)" }}
                >
                  {activity.type === "payment" ? "+" : ""}
                  {formatPKR(activity.amount)}
                </p>
              </div>
            )}

            {/* Details Grid */}
            <div
              className="grid grid-cols-2 bg-(--color-secondary-bg) rounded"
              style={{
                gap: "clamp(10px, 1.5vw, 18px)",
                padding: "clamp(12px, 2vw, 20px)",
              }}
            >
              {modalDetails.map((detail, idx) => {
                const isFullWidth =
                  detail.label.length > 12 ||
                  String(detail.value).length > 25 ||
                  ["notes", "remarks", "description"].includes(
                    detail.label.toLowerCase(),
                  );

                return (
                  <div
                    key={idx}
                    className={isFullWidth ? "col-span-2" : "col-span-1"}
                  >
                    <p
                      className="text-slate-500 capitalize"
                      style={{
                        fontSize: "clamp(9px, 1vw, 12px)",
                        marginBottom: "clamp(2px, 0.3vw, 5px)",
                      }}
                    >
                      {detail.label}
                    </p>
                    <p
                      className="text-slate-900 font-medium"
                      style={{ fontSize: "clamp(11px, 1.3vw, 14px)" }}
                    >
                      {typeof detail.value === "number" &&
                      (detail.label.toLowerCase().includes("price") ||
                        detail.label.toLowerCase().includes("amount"))
                        ? formatPKR(detail.value)
                        : detail.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side: Attachment (Payment only) */}
          {isPayment && (
            <div
              className="w-full md:w-[320px] bg-slate-50 shrink-0"
              style={{ padding: "clamp(14px, 2.5vw, 24px)" }}
            >
              <h3
                className="font-medium text-slate-700"
                style={{
                  fontSize: "clamp(11px, 1.3vw, 14px)",
                  marginBottom: "clamp(10px, 1.5vw, 18px)",
                }}
              >
                Attachment
              </h3>
             
                <img
                  src={activity.imageUrl || "/receptPlaceholder.png"}
                  alt="Receipt"
                  className="max-w-full h-auto object-contain border border-slate-200 rounded"
                />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
