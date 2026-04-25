"use client";

import React from "react";
import { formatPKR } from "@/lib/dashboard-utils";
import { DataTable, TableHeader } from "@/components/ui";
import { useRouter, useSearchParams } from "next/navigation";

interface OverdueShop {
  id: string;
  name: string;
  region: string;
  balance: number;
  daysOverdue: number;
}

interface OverdueShopsTableProps {
  shops: OverdueShop[];
  currentPage?: number;
  totalPages?: number;
}

export function OverdueShopsTable({
  shops,
  currentPage = 1,
  totalPages = 1,
}: OverdueShopsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("overduePage", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const getBadgeStyle = (days: number) => {
    if (days >= 90) return "bg-[#FEF2F2] text-[#991B1B]";
    if (days >= 60) return "bg-[#FFF7ED] text-[#9A3412]";
    if (days >= 30) return "bg-[#FEFCE8] text-[#854D0E]";
    return "bg-[#F8FAFC] text-[#475569]";
  };

  const headers: TableHeader[] = [
    { key: "name", label: "Shop Name" },
    { key: "balance", label: "Outstanding" },
    { key: "latency", label: "Latency" },
  ];

  const tableData = shops.map((shop) => ({
    id: shop.id,
    name: (
      <span className="font-bold text-amber-600">
        {shop.name}
      </span>
    ),
    balance: (
      <span className="font-bold" style={{ color: "#C0392B" }}>
        {formatPKR(shop.balance)}
      </span>
    ),
    latency: (
      <div className="text-center">
        <span
          className={`inline-block px-3 py-1 rounded-lg font-bold uppercase tracking-wider ${getBadgeStyle(shop.daysOverdue)}`}
          style={{ fontSize: "clamp(0.45rem, 0.8vw, 0.65rem)" }}
        >
          {shop.daysOverdue} Days
        </span>
      </div>
    ),
  }));

  return (
    <div className="w-full order-1 xl:order-2">
      <DataTable
        heading="Critical Overdue Shops (Rs 3 Lakh+)"
        TableHeaders={headers}
        TableData={tableData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        HeaderBgColor="bg-[#FEF3C7]"
        BorderColor="border-amber-100"
      />
    </div>
  );
}

