"use client";

import { useState } from "react";
import {
  Truck,
  Banknote,
  PackagePlus,
  ChevronDown,
  Activity as ActivityIcon,
  Layers,
} from "lucide-react";
import { formatPKR, timeAgo } from "@/lib/helper";
import { Activity } from "@/types/activity";
import { cn } from "@/lib/utils";

interface ActivityListProps {
  activities: Activity[];
  title?: string;
  limit?: number;
}

export function ActivityList({
  activities,
  title = "Latest Activity",
  limit,
}: ActivityListProps) {
  const displayActivities = limit ? activities.slice(0, limit) : activities;

  return (
    <div className="bg-white rounded-[clamp(10px,1.5vw,16px)] p-[clamp(16px,2.5vw,28px)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-[clamp(14px,2vw,24px)] px-0.5">
        <div className="flex items-center gap-[clamp(8px,1.2vw,12px)]">
          <h3
            className="font-bold text-[#0A2540]"
            style={{ fontSize: "clamp(14px, 1.8vw, 17px)" }}
          >
            {title}
          </h3>
        </div>
        <span
          className="font-bold uppercase tracking-widest rounded-md px-2 py-1"
          style={{
            fontSize: "clamp(8px, 0.85vw, 10px)",
            background: "var(--color-secondary-bg, #D9E6F2)",
            color: "var(--color-primary, #0D3E8D)",
          }}
        >
          Recent Logs
        </span>
      </div>

      {/* List */}
      <div className="flex flex-col gap-[clamp(10px,1.5vw,16px)]">
        {displayActivities.length === 0 ? (
          <div className="text-center py-10">
            <ActivityIcon size={32} className="mx-auto text-[#CBD5E1] mb-3" />
            <p
              className="text-[#94A3B8] font-medium"
              style={{ fontSize: "clamp(13px, 1.4vw, 15px)" }}
            >
              No activity logs available
            </p>
          </div>
        ) : (
          displayActivities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))
        )}
      </div>
    </div>
  );
}

function ActivityItem({ activity }: { activity: Activity }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getIconProps = () => {
    switch (activity.type) {
      case "distribution":
        return {
          icon: Truck,
          bgColor: "bg-blue-50",
          iconColor: "text-(--color-primary)",
        };
      case "payment":
        return {
          icon: Banknote,
          bgColor: "bg-emerald-50",
          iconColor: "text-emerald-600",
        };
      case "intake":
        return {
          icon: PackagePlus,
          bgColor: "bg-amber-50",
          iconColor: "text-amber-600",
        };
      default:
        return {
          icon: Layers,
          bgColor: "bg-(--color-secondary-bg)",
          iconColor: "text-slate-600",
        };
    }
  };

  const { icon: Icon, bgColor, iconColor } = getIconProps();

  return (
    <div
      className={cn(
        "rounded-[clamp(8px,1vw,12px)] transition-all duration-300",
        isExpanded
          ? "bg-(--color-page-bg) p-[clamp(10px,1.2vw,14px)]"
          : "bg-white p-[clamp(6px,0.8vw,10px)] hover:bg-(--color-page-bg)",
      )}
    >
      {/* Row */}
      <div
        className="flex items-start gap-[clamp(10px,1.5vw,16px)] cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div
          className={cn(
            "shrink-0 flex items-center justify-center rounded-[clamp(6px,1vw,10px)]",
            bgColor,
          )}
          style={{
            width: "clamp(34px, 4.5vw, 44px)",
            height: "clamp(34px, 4.5vw, 44px)",
          }}
        >
          <Icon size={18} className={iconColor} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h4
              className="font-bold text-[#1E293B] truncate"
              style={{ fontSize: "clamp(12px, 1.4vw, 14.5px)" }}
            >
              {activity.title}
            </h4>
            {activity.amount && activity.amount > 0 && (
              <span
                className={cn(
                  "font-bold shrink-0",
                  activity.type === "payment"
                    ? "text-emerald-600"
                    : "text-[#1E293B]",
                )}
                style={{ fontSize: "clamp(12px, 1.4vw, 14.5px)" }}
              >
                {activity.type === "payment" ? "+" : ""}
                {formatPKR(activity.amount)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <p
              className="text-[#64748B] font-medium truncate"
              style={{ fontSize: "clamp(10px, 1.1vw, 12px)" }}
            >
              {activity.subtitle}
            </p>
            <span className="text-[#CBD5E1] text-xs">•</span>
            <p
              className="text-[#94A3B8] shrink-0"
              style={{ fontSize: "clamp(10px, 1.1vw, 11px)" }}
            >
              {timeAgo(new Date(activity.date))}
            </p>
          </div>
        </div>

        <div className="shrink-0 pt-1">
          <ChevronDown
            size={16}
            className="text-[#94A3B8] transition-transform duration-300"
            style={{
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </div>
      </div>

      {/* Expanded */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isExpanded
            ? "max-h-[500px] mt-4 pt-4 border-t border-[#E2E8F0]"
            : "max-h-0",
        )}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[clamp(10px,1.5vw,18px)]">
          {activity.details.map((detail, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <span
                className="text-[#94A3B8] font-bold uppercase tracking-wider"
                style={{ fontSize: "clamp(8px,0.85vw,10px)" }}
              >
                {detail.label}
              </span>
              <span
                className="text-[#1E293B] font-semibold truncate"
                style={{ fontSize: "clamp(11px,1.2vw,13px)" }}
              >
                {typeof detail.value === "number" &&
                (detail.label.toLowerCase().includes("price") ||
                  detail.label.toLowerCase().includes("amount"))
                  ? formatPKR(detail.value)
                  : detail.value}
              </span>
            </div>
          ))}
          <div className="flex flex-col gap-1"></div>
        </div>
      </div>
    </div>
  );
}
