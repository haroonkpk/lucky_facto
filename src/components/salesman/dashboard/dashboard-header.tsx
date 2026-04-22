"use client";

import { LogoutButton } from "@/components/auth";

interface DashboardHeaderProps {
  salesmanName: string;
}

export const DashboardHeader = ({ salesmanName }: DashboardHeaderProps) => {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const today = new Date().toLocaleDateString("en-PK", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p
          className="text-[#64748B] font-bold uppercase tracking-widest"
          style={{ fontSize: "clamp(10px, 1.2vw, 12px)" }}
        >
          {greeting}
        </p>
        <h1
          className="text-[#0A2540] font-bold truncate"
          style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }}
        >
          {salesmanName}
        </h1>
        <p
          className="text-[#94A3B8] mt-0.5"
          style={{ fontSize: "clamp(12px, 1.5vw, 14px)" }}
        >
          {today}
        </p>
      </div>
      <div className="shrink-0 pt-1">
        <LogoutButton />
      </div>
    </div>
  );
}
