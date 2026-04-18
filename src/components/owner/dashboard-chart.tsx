"use client";

import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { BrandRevenueEntry } from "@/types/chart";

const COLORS = [
  "#0053da",
  "#93cbff",
  "#ea580c",
  "#9333ea",
  "#e11d48",
  "#0891b2",
  "#ca8a04",
];

interface DashboardChartProps {
  data: BrandRevenueEntry[];
  brands: string[];
}
export function DashboardChart({ data, brands }: DashboardChartProps) {
  const safeBrands = useMemo(
    () =>
      brands.map((brand) => ({
        original: brand,
        safe: brand.replace(/\s+/g, "_"),
      })),
    [brands],
  );

  const safeData = useMemo(
    () =>
      data.map((item) => {
        const newItem = { ...item };
        safeBrands.forEach(({ original, safe }) => {
          if (original !== safe) newItem[safe] = newItem[original];
        });
        return newItem;
      }),
    [data, safeBrands],
  );

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    safeBrands.forEach(({ original, safe }, index) => {
      config[safe] = {
        label: original,
        color: COLORS[index % COLORS.length],
      };
    });
    return config;
  }, [safeBrands]);

  const xAxisTicks = useMemo(() => {
    return safeData
      .filter((item) => {
        const day = Number(String(item.date).split("-")[2]);
        return day % 5 === 1;
      })
      .map((item) => item.date);
  }, [safeData]);

  const formatXAxis = (value: string) => {
    const [year, month, day] = value.split("-");
    if (!year || !month || !day) return value;
    const d = new Date(Number(year), Number(month) - 1, Number(day));
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(d);
  };

  const formatTooltipLabel = (value: string) => {
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-36">
        <p className="text-slate-500 text-sm">No revenue data available.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-44 sm:h-56">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <AreaChart
          data={safeData}
          margin={{ top: 6, right: 12, left: 0, bottom: 0 }}
        >
          <defs>
            {safeBrands.map(({ safe }, index) => {
              const color = COLORS[index % COLORS.length];
              return (
                <linearGradient
                  key={`color-${safe}`}
                  id={`color-${safe}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={color} stopOpacity={0.7} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.05} />
                </linearGradient>
              );
            })}
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E2E8F0"
          />

          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            ticks={xAxisTicks}
            tickFormatter={formatXAxis}
            tick={{ fontSize: 11 }}
            stroke="#64748B"
          />

          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 11 }}
            width={42}
            stroke="#64748B"
            tickFormatter={(v) =>
              `$${Intl.NumberFormat("en-US", {
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(v)}`
            }
          />

          <ChartTooltip
            cursor={{
              stroke: "#94A3B8",
              strokeWidth: 1,
              strokeDasharray: "3 3",
            }}
            content={
              <ChartTooltipContent
                indicator="dot"
                labelFormatter={(label) => formatTooltipLabel(label)}
              />
            }
          />

          {safeBrands.map(({ safe }, index) => {
            const color = COLORS[index % COLORS.length];
            return (
              <Area
                key={safe}
                type="monotone"
                dataKey={safe}
                stackId="1"
                stroke={color}
                strokeWidth={1.5}
                fill={`url(#color-${safe})`}
                activeDot={{ r: 4, strokeWidth: 0, fill: color }}
                dot={false}
              />
            );
          })}

          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
