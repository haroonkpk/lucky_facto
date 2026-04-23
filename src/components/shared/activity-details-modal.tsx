"use client";

import { Modal } from "./modal";
import { Activity } from "@/types/activity";
import { formatPKR } from "@/lib/dashboard-utils";
import { 
  Truck, 
  Banknote, 
  PackagePlus, 
  Layers, 
  Calendar, 
  User, 
  Tag
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityDetailsModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ActivityDetailsModal({
  activity,
  isOpen,
  onClose,
}: ActivityDetailsModalProps) {
  if (!activity) return null;

  const getIconProps = () => {
    switch (activity.type) {
      case "distribution":
        return { icon: Truck, color: "text-blue-600", bg: "bg-blue-50" };
      case "payment":
        return { icon: Banknote, color: "text-emerald-600", bg: "bg-emerald-50" };
      case "intake":
        return { icon: PackagePlus, color: "text-amber-600", bg: "bg-amber-50" };
      default:
        return { icon: Layers, color: "text-slate-600", bg: "bg-slate-50" };
    }
  };

  const { icon: Icon, color, bg } = getIconProps();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={activity.title}
      className="max-w-2xl px-0 py-0 overflow-hidden"
    >
      {/* Premium Header Accent */}
      <div className={cn("h-2 w-full", bg.replace("bg-", "bg-opacity-100 bg-"))} 
           style={{ backgroundColor: activity.type === 'distribution' ? '#053B70' : undefined }} />
      
      <div className="p-6 sm:p-8">
        {/* Header Info */}
        <div className="flex items-start gap-5 mb-8">
          <div className={cn("p-4 rounded-2xl shrink-0", bg)}>
            <Icon size={28} className={color} />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-[#0A2540] font-bold text-xl leading-tight mb-1 truncate">
              {activity.subtitle || activity.title}
            </h4>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[#64748B]">
              <div className="flex items-center gap-1.5 ">
                <Calendar size={14} className="text-slate-400" />
                <span className="text-xs font-medium">
                  {new Date(activity.date).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Tag size={14} className="text-slate-400" />
                <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                  {activity.type}
                </span>
              </div>
            </div>
          </div>
          {activity.amount && activity.amount > 0 && (
            <div className="text-right shrink-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                Total Value
              </p>
              <p className={cn(
                "text-2xl font-black",
                activity.type === 'payment' ? "text-emerald-600" : "text-[#0A2540]"
              )}>
                {activity.type === 'payment' ? "+" : ""}{formatPKR(activity.amount)}
              </p>
            </div>
          )}
        </div>

        {/* Details Grid */}
        <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-200/60 pb-3">
             <Layers size={16} className="text-slate-400" />
             <h5 className="font-bold text-[#053B70] uppercase tracking-widest text-[11px]">
               Technical Specifications
             </h5>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
            {activity.details.map((detail, idx) => (
              <div key={idx} className="flex flex-col gap-1 group transition-all">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-500">
                  {detail.label}
                </span>
                <span className="text-[clamp(13px,1.2vw,14.5px)] font-bold text-[#0A2540] transition-colors">
                  {typeof detail.value === "number" &&
                  (detail.label.toLowerCase().includes("price") ||
                    detail.label.toLowerCase().includes("amount"))
                    ? formatPKR(detail.value)
                    : detail.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Meta */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm">
              {activity.recordedBy.charAt(0)}
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Recorded By
              </p>
              <p className="text-sm font-bold text-[#0A2540]">
                {activity.recordedBy} <span className="text-slate-400 font-medium ml-1">({activity.role || 'SALESMAN'})</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
