"use client";

import React from "react";
import { formatPKR } from "@/lib/dashboard-utils";
import { DataTable, TableHeader } from "@/components/ui";
import { useRouter, useSearchParams } from "next/navigation";

interface DetailedPendingPaymentsProps {
  shops: {
    id: string;
    name: string;
    amount: number;
    daysOverdue: number;
  }[];
  currentPage: number;
  totalPages: number;
}

export const DetailedPendingPayments = ({
  shops,
  currentPage,
  totalPages,
}: DetailedPendingPaymentsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
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
    { key: "amount", label: "Pending Amount" },
    { key: "latency", label: "Latency" },
  ];

  const tableData = shops.map((shop) => ({
    id: shop.id,
    name: (
      <span className="font-bold text-amber-600">
        {shop.name}
      </span>
    ),
    amount: (
      <span className="font-bold" style={{ color: "var(--color-pending)" }}>
        {formatPKR(shop.amount)}
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
    <div className="w-full">
      <DataTable
        heading="Pending Payments Detail"
        TableHeaders={headers}
        TableData={tableData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        HeaderBgColor="bg-[#FEF3C7]"
        BorderColor="border-amber-100"
        pageSize={3}
      />
    </div>
  );
};
