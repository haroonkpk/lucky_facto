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
    <div className="bg-white rounded-xl p-[clamp(1rem,2vw,1.5rem)] shadow-sm border border-slate-100 h-full flex flex-col">
      <h3 className="font-bold text-[#0A2540] mb-4" style={{ fontSize: "clamp(1rem, 1.5vw, 1.125rem)" }}>
        Recent Activity
      </h3>
      
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide flex flex-col gap-4">
        {activities.map((activity, i) => (
          <div key={i} className="flex gap-3 relative">
            {/* Timeline line */}
            {i !== activities.length - 1 && (
              <div className="absolute top-6 left-2 w-px h-full bg-slate-100 -translate-x-1/2"></div>
            )}
            
            <div className="shrink-0 mt-1.5 relative z-10">
              <div className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${getIconColor(activity.type)}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-[#0A2540] font-medium leading-snug" style={{ fontSize: "clamp(0.8rem, 1.2vw, 0.9rem)" }}>
                {activity.text}
              </p>
              <div className="flex gap-2 items-center mt-1 text-[#94A3B8]" style={{ fontSize: "clamp(0.7rem, 1vw, 0.75rem)" }}>
                <span>{timeAgo(activity.date)}</span>
                <span>•</span>
                <span className="truncate">{activity.recordedBy} ({activity.role})</span>
              </div>
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <p className="text-gray-400 text-sm italic text-center mt-4">No recent activity</p>
        )}
      </div>
    </div>
  );
}
