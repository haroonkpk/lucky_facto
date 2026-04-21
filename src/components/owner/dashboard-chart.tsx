"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatPKR, formatNumber } from "@/lib/dashboard-utils";

export interface ChartData {
  label: string;
  distribution: number;
  payment: number;
}

export function DashboardChart({ data }: { data: ChartData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-44 sm:h-56">
        <p className="text-slate-500 text-[clamp(0.75rem,2vw,0.875rem)]">
          No revenue data available.
        </p>
      </div>
    );
  }

  const formatTooltip = (
    value: number | string | readonly (number | string)[] | undefined,
    name: number | string | undefined,
  ) => {
    const val = Array.isArray(value) ? value[0] : value;
    return [formatPKR(Number(val) || 0), name];
  };

  const formatYAxis = (value: number) => {
    return formatNumber(value);
  };

  return (
    <div className="w-full h-64 sm:h-72 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorDistribution" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-primary, #3B82F6)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-primary, #3B82F6)"
                stopOpacity={0}
              />
            </linearGradient>
            <linearGradient id="colorPayment" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E2E8F0"
          />

          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            minTickGap={15}
            tick={{ fontSize: 11, fill: "#64748B" }}
          />

          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tick={{ fontSize: 12, fill: "#64748B" }}
            tickFormatter={formatYAxis}
            width={85}
          />

          <Tooltip
            formatter={formatTooltip}
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            labelStyle={{
              fontWeight: "bold",
              color: "#0A2540",
              marginBottom: "4px",
            }}
          />

          <Legend
            wrapperStyle={{
              paddingTop: "20px",
              fontSize: "12px",
              color: "#64748B",
            }}
            iconType="circle"
          />

          {/* Distribution Area */}
          <Area
            type="monotone"
            dataKey="distribution"
            name="Distribution"
            stroke="var(--color-primary, #3B82F6)"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorDistribution)"
          />

          {/* Payment Collected Area */}
          <Area
            type="monotone"
            dataKey="payment"
            name="Payment Collected"
            stroke="#22c55e"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorPayment)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
