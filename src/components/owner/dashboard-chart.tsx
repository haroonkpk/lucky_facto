"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatPKR } from "@/lib/dashboard-utils";

interface ChartData {
  month: string;
  distribution: number;
  payment: number;
}

export function DashboardChart({ data }: { data: ChartData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-44 sm:h-56">
        <p className="text-slate-500 text-[clamp(0.75rem,2vw,0.875rem)]">No revenue data available.</p>
      </div>
    );
  }

  const formatTooltip = (value: any) => {
    return formatPKR(Number(value));
  };

  const formatYAxis = (value: number) => {
    if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  return (
    <div className="w-full h-64 sm:h-72 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis 
            dataKey="month" 
            tickLine={false} 
            axisLine={false} 
            tickMargin={10} 
            tick={{ fontSize: 12, fill: "#64748B" }} 
          />
          <YAxis 
            tickLine={false} 
            axisLine={false} 
            tickMargin={10} 
            tick={{ fontSize: 12, fill: "#64748B" }} 
            tickFormatter={formatYAxis}
            width={60}
          />
          <Tooltip 
            formatter={formatTooltip} 
            cursor={{ fill: "#F1F5F9" }}
            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: "20px", fontSize: "12px", color: "#64748B" }} 
            iconType="circle"
          />
          
          <Bar 
            dataKey="distribution" 
            name="Distribution" 
            fill="var(--color-primary)" 
            radius={[4, 4, 0, 0]} 
            maxBarSize={40}
          />
          <Bar 
            dataKey="payment" 
            name="Payment Collected" 
            fill="#22c55e" 
            radius={[4, 4, 0, 0]} 
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
