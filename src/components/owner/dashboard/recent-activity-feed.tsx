import { timeAgo } from "@/lib/dashboard-utils";

export function RecentActivityFeed({ activities }: { activities: any[] }) {
  const getIconColor = (type: string) => {
    switch(type) {
      case "distribution": return "bg-blue-500";
      case "payment": return "bg-green-500";
      case "intake": return "bg-amber-500";
      default: return "bg-slate-400";
    }
  };

  return (
    <div className="bg-white rounded-[clamp(10px,1.5vw,16px)] p-[clamp(1.25rem,2vw,2rem)] h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 px-1">
        <h3 className="font-bold text-[#0A2540]" style={{ fontSize: "clamp(1rem, 1.5vw, 1.125rem)" }}>
          Network Activity
        </h3>
        <span className="text-[#64748B] font-bold uppercase tracking-widest" style={{ fontSize: "clamp(9px, 1vw, 11px)" }}>
          Recent Logs
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide flex flex-col gap-5">
        {activities.map((activity, i) => (
          <div key={i} className="flex gap-4 relative group">
            {/* Timeline line */}
            {i !== activities.length - 1 && (
              <div className="absolute top-[22px] left-[7px] w-px h-[calc(100%+20px)] bg-[#F1F5F9] -translate-x-1/2 group-hover:bg-[#E2E8F0] transition-colors"></div>
            )}
            
            <div className="shrink-0 mt-1.5 relative z-10">
              <div className={`w-[14px] h-[14px] rounded-full ring-4 ring-white ${getIconColor(activity.type)}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-[#0A2540] font-bold leading-snug" style={{ fontSize: "clamp(0.85rem, 1.2vw, 0.95rem)" }}>
                {activity.text}
              </p>
              <div className="flex flex-wrap gap-x-2 gap-y-1 items-center mt-1.5 text-[#94A3B8] font-medium" style={{ fontSize: "clamp(11px, 1vw, 12px)" }}>
                <span>{timeAgo(activity.date)}</span>
                <span className="text-[#E2E8F0]">•</span>
                <span className="truncate">{activity.recordedBy}</span>
                <span className="text-[#D1E3EF] px-1.5 py-0.5 rounded-md bg-[#F1F5F9] text-[9px] font-bold uppercase tracking-wider">{activity.role}</span>
              </div>
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <p className="text-gray-400 text-sm italic text-center mt-6">No recent activity logs available</p>
        )}
      </div>
    </div>
  );
}
