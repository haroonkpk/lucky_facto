"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { CalendarDays, Loader2, X } from "lucide-react";
import { Button, Input } from "@/components/ui";

export function DateRangeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const now = new Date();
  const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const defaultEnd = now;

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

  const hasFilter =
    searchParams.has("startDate") || searchParams.has("endDate");

  return (
    <div className=" w-full max-w-xl flex flex-col sm:flex-row items-end justify-end gap-4 cursor-pointer bg-white backdrop-blur-sm p-3 rounded-xl border border-white/20">
      <Input
        id="startDate"
        label="From"
        type="date"
        value={startDate}
        max={formatDate(now)}
        onChange={(e) => setStartDate(e.target.value)}
        className="cursor-pointer"
      />

      <Input
        id="endDate"
        label="To"
        type="date"
        value={endDate}
        max={formatDate(now)}
        onChange={(e) => setEndDate(e.target.value)}
        className="cursor-pointer"
      />

      <div className="flex items-center gap-3 ">
        <Button
          variant="primary"
          icon={<CalendarDays size={16} />}
          onClick={handleApply}
          disabled={isPending}
          className="cursor-pointer"
        >
          {isPending ? <div className="flex items-center gap-2"><Loader2 size={16} className="animate-spin" />{" "}Filtering...</div> : "Apply"}
        </Button>

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
