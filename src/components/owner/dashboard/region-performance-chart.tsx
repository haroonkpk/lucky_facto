"use client";
import { formatPKR, formatNumber } from "@/lib/dashboard-utils";
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
  amount: number;
}

export function RegionPerformanceChart({
  performance,
}: {
  performance: RegionData[];
}) {
  return (
    <div className="bg-white rounded-[clamp(10px,1.5vw,16px)] p-[clamp(1.25rem,2vw,2rem)] h-full flex flex-col min-h-[350px]">
      <div className="flex justify-between items-center mb-6 px-1">
        <h3
          className="font-bold text-[#0A2540]"
          style={{ fontSize: "clamp(1rem, 1.5vw, 1.25rem)" }}
        >
          Region Performance
        </h3>
        <span
          className="text-[#64748B] font-bold uppercase tracking-widest"
          style={{ fontSize: "clamp(9px, 1vw, 11px)" }}
        >
          Month to Date
        </span>
      </div>

      <div className="flex-1 w-full overflow-x-auto overflow-y-hidden pb-2 custom-scrollbar">
        <div 
          className="h-full" 
          style={{ minWidth: performance.length > 5 ? `${performance.length * 60}px` : "100%" }}
        >
          {performance.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={performance}
                margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
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
                  tick={{ fill: "#64748B", fontSize: 11 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748B", fontSize: 11 }}
                  tickFormatter={(value: number) => formatNumber(value)}
                  width={80}
                />

                <Tooltip
                  cursor={{ fill: "#F8FAFC" }}
                  formatter={(
                    value:
                      | number
                      | string
                      | readonly (number | string)[]
                      | undefined,
                  ) => {
                    const val = Array.isArray(value) ? value[0] : value;
                    return [formatPKR(Number(val) || 0), "Revenue"];
                  }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                  labelStyle={{
                    fontWeight: "bold",
                    color: "#0A2540",
                    marginBottom: "4px",
                  }}
                />

                <Bar
                  dataKey="amount"
                  fill="#22C55E"
                  radius={[4, 4, 0, 0]}
                  barSize={performance.length > 10 ? 25 : 40}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-400 text-sm italic">
                No performance data found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
