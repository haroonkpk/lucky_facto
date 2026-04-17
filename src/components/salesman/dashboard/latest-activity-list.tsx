"use client";

import { Truck, Banknote, Activity, PackagePlus } from "lucide-react";
import { formatPKR, timeAgo } from "@/lib/helper";
import type { ActivityItem } from "@/actions/salesman.actions";

interface LatestActivityListProps {
  activities: ActivityItem[];
}

export default function LatestActivityList({
  activities,
}: LatestActivityListProps) {
  return (
    <div
      className="bg-white"
      style={{
        borderRadius: "clamp(12px, 2vw, 20px)",
        padding: "clamp(20px, 3vw, 28px)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center"
            style={{
              width: "clamp(32px, 4vw, 40px)",
              height: "clamp(32px, 4vw, 40px)",
              borderRadius: "clamp(6px, 1vw, 10px)",
              background: "#F1F5F9",
            }}
          >
            <Activity size={18} className="text-[#475569]" />
          </div>
          <h3
            className="font-bold text-[#0A2540]"
            style={{ fontSize: "clamp(14px, 1.8vw, 17px)" }}
          >
            Latest Activity
          </h3>
        </div>
        <span
          className="bg-[#F1F5F9] text-[#475569] font-bold uppercase tracking-wider"
          style={{
            fontSize: "clamp(9px, 1vw, 11px)",
            padding: "clamp(3px, 0.5vw, 5px) clamp(8px, 1vw, 12px)",
            borderRadius: "clamp(4px, 0.8vw, 6px)",
          }}
        >
          Last 10
        </span>
      </div>

      {/* List */}
      {activities.length === 0 ? (
        <div
          className="text-center"
          style={{ padding: "clamp(24px, 4vw, 40px) 0" }}
        >
          <Activity size={32} className="mx-auto text-[#CBD5E1] mb-3" />
          <p
            className="text-[#94A3B8] font-medium"
            style={{ fontSize: "clamp(13px, 1.4vw, 15px)" }}
          >
            No activity yet
          </p>
          <p
            className="text-[#CBD5E1] mt-1"
            style={{ fontSize: "clamp(11px, 1.2vw, 13px)" }}
          >
            Distributions, payments, and intakes will appear here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          {activities.map((item, idx) => {
            const isDistribution = item.type === "distribution";
            const isPayment = item.type === "payment";
            const isIntake = item.type === "intake";

            return (
              <div
                key={item.id}
                className={`flex items-start gap-3 ${
                  idx !== activities.length - 1
                    ? "border-b border-[#F1F5F9]"
                    : ""
                }`}
                style={{
                  padding: "clamp(12px, 1.5vw, 16px) 0",
                }}
              >
                {/* Icon */}
                <div
                  className="shrink-0 flex items-center justify-center mt-0.5"
                  style={{
                    width: "clamp(32px, 4vw, 38px)",
                    height: "clamp(32px, 4vw, 38px)",
                    borderRadius: "clamp(6px, 1vw, 10px)",
                    background: isDistribution
                      ? "#DBEAFE" // Blue for distribution
                      : isPayment
                        ? "#D1FAE5" // Green for payment
                        : "#F3E8FF", // Purple for intake
                  }}
                >
                  {isDistribution && (
                    <Truck size={16} className="text-blue-600" />
                  )}
                  {isPayment && (
                    <Banknote size={16} className="text-emerald-600" />
                  )}
                  {isIntake && (
                    <PackagePlus size={16} className="text-purple-600" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p
                        className="font-semibold text-[#1E293B] truncate"
                        style={{ fontSize: "clamp(13px, 1.4vw, 14px)" }}
                      >
                        {item.description}
                      </p>
                      {item.shopName && (
                        <p
                          className="text-[#94A3B8] truncate mt-0.5"
                          style={{ fontSize: "clamp(11px, 1.2vw, 12px)" }}
                        >
                          {item.shopName}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      {!isIntake && (
                        <p
                          className={`font-bold ${
                            isDistribution
                              ? "text-[#1E293B]"
                              : "text-emerald-600"
                          }`}
                          style={{ fontSize: "clamp(13px, 1.4vw, 14px)" }}
                        >
                          {isPayment ? "+" : ""}
                          {formatPKR(item.amount)}
                        </p>
                      )}
                      <p
                        className="text-[#CBD5E1] mt-0.5"
                        style={{ fontSize: "clamp(10px, 1.1vw, 11px)" }}
                      >
                        {timeAgo(new Date(item.date))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
