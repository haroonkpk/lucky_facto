"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { CalendarDays, X } from "lucide-react";

export function DateRangeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Helper to format date to YYYY-MM-DD
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  // Get dates from search params or default to current month
  const now = new Date();
  const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const defaultEnd = now; // Today

  const [startDate, setStartDate] = useState(
    searchParams.get("startDate") || formatDate(defaultStart),
  );
  const [endDate, setEndDate] = useState(
    searchParams.get("endDate") || formatDate(defaultEnd),
  );

  const handleApply = () => {
    const params = new URLSearchParams(searchParams);
    params.set("startDate", startDate);
    params.set("endDate", endDate);

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const handleClear = () => {
    setStartDate(formatDate(defaultStart));
    setEndDate(formatDate(defaultEnd));
    startTransition(() => {
      router.push("?");
    });
  };

  const hasFilter = searchParams.has("startDate") || searchParams.has("endDate");

  return (
    <div className="flex flex-wrap items-center gap-4 bg-white backdrop-blur-sm p-3 rounded-xl border border-white/20">
      <div className="flex items-center gap-2">
        <label
          htmlFor="startDate"
          className="text-xs font-bold text-[#64748B] uppercase tracking-wider"
        >
          From
        </label>
        <input
          id="startDate"
          type="date"
          value={startDate}
          max={formatDate(now)}
          onChange={(e) => setStartDate(e.target.value)}
          className=" border-none rounded-lg px-3 py-1.5 text-sm font-medium text-[#0A2540] focus:ring-2 focus:ring-blue-500/20 outline-none transition-shadow cursor-pointer"
        />
      </div>

      <div className="flex items-center gap-2">
        <label
          htmlFor="endDate"
          className="text-xs font-bold text-[#64748B] uppercase tracking-wider"
        >
          To
        </label>
        <input
          id="endDate"
          type="date"
          value={endDate}
          max={formatDate(now)}
          onChange={(e) => setEndDate(e.target.value)}
          className=" border-none rounded-lg px-3 py-1.5 text-sm font-medium text-[#0A2540] focus:ring-2 focus:ring-blue-500/20 outline-none transition-shadow cursor-pointer"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleApply}
          disabled={isPending}
          className="bg-[#053B70] hover:bg-[#0A2540] disabled:bg-gray-400 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
        >
          <CalendarDays size={16} />
          {isPending ? "Filtering..." : "Apply Filter"}
        </button>

        {hasFilter && (
          <button
            onClick={handleClear}
            disabled={isPending}
            title="Clear Filter"
            className="text-[#64748B] hover:text-[#DC2626] transition-colors cursor-pointer disabled:opacity-50 p-1 rounded-full"
          >
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
