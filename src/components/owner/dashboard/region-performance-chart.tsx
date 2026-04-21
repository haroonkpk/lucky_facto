"use client";
import { formatPKR } from "@/lib/dashboard-utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RegionData {
  name: string;
  distributed: number;
  pending: number;
}

const DIST_COLOR = "var(--color-primary)";
const PENDING_COLOR = "var(--color-pending)";

const BAR_MIN_WIDTH = 80;
const FIT_THRESHOLD = 6;

export function RegionPerformanceChart({
  performance,
}: {
  performance: RegionData[];
}) {
  const shouldScroll = performance.length > FIT_THRESHOLD;
  const chartWidth = shouldScroll
    ? performance.length * BAR_MIN_WIDTH
    : undefined;

  return (
    <div className="bg-white rounded-2xl p-6 h-full flex flex-col min-h-[350px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-5 px-1">
        <h3 className="font-bold text-[#0A2540] text-lg">Region Performance</h3>
        <span className="text-slate-400 font-semibold uppercase tracking-widest text-[10px]">
          Month to Date
        </span>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-4 px-1">
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="w-2.5 h-2.5 bg-[#185FA5]" />
          Distributed
        </span>
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="w-2.5 h-2.5 bg-[#BA7517]" />
          Pending
        </span>
      </div>

      <div
        className="flex-1 pb-2 custom-scrollbar"
        style={{
          overflowX: shouldScroll ? "auto" : "hidden",
          overflowY: "hidden",
        }}
      >
        <div
          style={{
            width: shouldScroll ? `${chartWidth}px` : "100%",
            height: "100%",
            minHeight: 260,
          }}
        >
          {performance.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={performance}
                margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                barCategoryGap="35%"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F0"
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 11 }}
                  interval={0}
                  angle={-35}
                  textAnchor="end"
                  height={50}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 11 }}
                  tickFormatter={(value: number) => formatPKR(value)}
                  width={70}
                />

                <Tooltip
                  cursor={{ fill: "#F8FAFC" }}
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const distributed = Number(
                      payload.find((p) => p.dataKey === "distributed")?.value ||
                        0,
                    );
                    const pending = Number(
                      payload.find((p) => p.dataKey === "pending")?.value || 0,
                    );

                    return (
                      <div className="bg-white border border-slate-100 rounded-md shadow-lg p-3 min-w-[180px]">
                        <p className="font-semibold text-[#0A2540] text-sm mb-2">
                          {label}
                        </p>
                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between items-center gap-4 text-xs">
                            <span className="flex items-center gap-1.5 text-slate-400">
                              <span className="w-2 h-2 rounded-sm bg-[#185FA5] inline-block" />
                              Distributed
                            </span>
                            <span className="font-medium text-slate-700">
                              {formatPKR(distributed)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center gap-4 text-xs">
                            <span className="flex items-center gap-1.5 text-slate-400">
                              <span className="w-2 h-2 rounded-sm bg-[#BA7517] inline-block" />
                              Pending
                            </span>
                            <span className="font-medium text-amber-700">
                              {formatPKR(pending)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />

                <Bar
                  dataKey="distributed"
                  stackId="a"
                  fill={DIST_COLOR}
                  barSize={performance.length > 10 ? 20 : 36}
                />
                <Bar
                  dataKey="pending"
                  stackId="a"
                  fill={PENDING_COLOR}
                  barSize={performance.length > 10 ? 20 : 36}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-slate-400 text-sm italic">
                No performance data found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
