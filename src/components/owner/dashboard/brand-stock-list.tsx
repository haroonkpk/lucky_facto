"use client";
import { formatNumber } from "@/lib/dashboard-utils";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface BrandStock {
  brandName: string;
  currentStock: number;
}

const COLORS = [
  "#0D3E8D",
  "#1A56DB",
  "#3B82F6",
  "#60A5FA",
  "#93C5FD",
  "#1E3A8A",
  "#1E40AF",
  "#2563EB",
];

export function BrandStockList({ stock }: { stock: BrandStock[] }) {
  return (
    <div className="bg-white rounded-[clamp(10px,1.5vw,16px)] p-[clamp(1.25rem,2vw,2rem)] h-full flex flex-col min-h-[370px]">
      <div className="flex justify-between items-center mb-6 px-1">
        <h3
          className="font-bold text-[#0A2540]"
          style={{ fontSize: "clamp(1rem, 1.5vw, 1.25rem)" }}
        >
          Brand-Wise Stock
        </h3>
        <span
          className="text-[#64748B] font-bold uppercase tracking-widest"
          style={{ fontSize: "clamp(9px, 1vw, 11px)" }}
        >
          Current Units
        </span>
      </div>

      <div className="flex-1 w-full relative">
        {stock.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stock}
                dataKey="currentStock"
                nameKey="brandName"
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="75%"
                paddingAngle={2}
                stroke="none"
                label={({ value }: { value: number }) => formatNumber(value)}
                labelLine={{ stroke: "#94A3B8", strokeWidth: 1 }}
              >
                {stock.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(
                  value:
                    | number
                    | string
                    | readonly (number | string)[]
                    | undefined,
                ) => {
                  const val = Array.isArray(value) ? value[0] : value;
                  return [formatNumber(Number(val) || 0), "Stock"];
                }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: "12px", color: "#64748B" }}
                formatter={(value: string, entry: { payload?: object }) => {
                  const payload = entry.payload as BrandStock | undefined;
                  const stockValue = payload?.currentStock || 0;

                  return (
                    <span className="text-[#0A2540] ml-1">
                      {value}{" "}
                      <span className="font-bold">
                        ({formatNumber(stockValue)})
                      </span>
                    </span>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-400 text-sm italic">
              No stock records found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
