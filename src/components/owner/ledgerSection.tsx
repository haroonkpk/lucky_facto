"use client";

import { formatPKR } from "@/lib/dashboard-utils";
import { Prisma } from "@/lib/generated/prisma/client";
import { ActivityDataTable } from "@/components/shared";
import { Activity, ActivityDetail } from "@/types/activity";
import { useSearchParams } from "next/navigation";

type TransactionType = "DEBIT" | "CREDIT";

interface Ledger {
  id: string;
  shopId: string;
  transactionType: TransactionType;
  amount: Prisma.Decimal;
  description: string | null;
  paymentId: string | null;
  payment: {
    id: string;
    paymentMethod: string;
    cashNote?: string | null;
    receiptUrl?: string | null;
    recordedBy: { name: string; role: string };
  } | null;
  distributionId: string | null;
  distribution: {
    id: string;
    quantity: number;
    unitPrice: Prisma.Decimal | number | string;
    brand: { name: string };
    recordedBy: { name: string; role: string };
  } | null;
  createdAt: Date | string;
}

interface LedgerSectionProps {
  ledgers: Ledger[];
  shopName: string;
  metrics: {
    totalPayments: number;
    totalBilling: number;
    balanceOwed: number;
    currentBalance: number;
    lastPaymentDate: Date | string | null;
  };
}

export const LedgerSection = ({
  ledgers,
  metrics,
  shopName,
}: LedgerSectionProps) => {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = 5;

  const tableHeaders = [
    { key: "date", label: "Date(DD/MM/YYYY)" },
    { key: "subtitle", label: "Target/Shop" },
    { key: "title", label: "Type/Activity" },
    { key: "details", label: "Details/Qty" },
    { key: "amount", label: "Amount" },
  ];

  const allActivities: Activity[] = ledgers.map((entry) => {
    const isDebit = entry.transactionType === "DEBIT";
    const recordedBy =
      entry.distribution?.recordedBy?.name ||
      entry.payment?.recordedBy?.name ||
      "System";
    const role =
      entry.distribution?.recordedBy?.role ||
      entry.payment?.recordedBy?.role ||
      "UNKNOWN";

    const details: ActivityDetail[] = [
      {
        label: "Date & Time",
        value: new Date(entry.createdAt).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      },
      { label: "Type", value: isDebit ? "Distribution" : "Collection" },
      { label: "Shop", value: shopName },
      { label: "Recorded By", value: recordedBy },
    ];

    if (entry.distribution) {
      details.push({
        label: "Quantity",
        value: `${entry.distribution.quantity} bags`,
      });
      details.push({
        label: "Unit Price",
        value: formatPKR(Number(entry.distribution.unitPrice)),
      });
      details.push({ label: "Brand", value: entry.distribution.brand.name });
    } else if (entry.payment) {
      details.push({ label: "Method", value: entry.payment.paymentMethod });
      details.push({
        label: "Remarks",
        value: entry.payment.cashNote || "None",
      });
    }

    return {
      id: entry.id,
      type: isDebit ? "distribution" : "payment",
      title: isDebit
        ? `${entry.distribution?.brand?.name || "Unknown"} Distribution`
        : "Shop Collection",
      subtitle: shopName,
      amount: Number(entry.amount),
      date: entry.createdAt,
      recordedBy: recordedBy,
      role: role,
      imageUrl: entry.payment?.receiptUrl || undefined,
      details,
    };
  });

  const totalPages = Math.ceil(allActivities.length / pageSize);
  const pagedActivities = allActivities.slice(
    (currentPage - 1) * pageSize,
    (currentPage - 1) * pageSize + pageSize,
  );

  return (
    <div className="space-y-6">
      {/* Ledger Footer (Totals) */}
      <div
        className="bg-[#E7F1F8] flex items-center md:justify-end border-t border-(--color-secondary-bg) overflow-x-auto scrollbar-hide md:overflow-visible"
        style={{
          gap: "clamp(16px, 3vw, 48px)",
          padding: "clamp(16px, 3vw, 32px)",
          borderRadius: "clamp(12px, 2vw, 16px)",
        }}
      >
        <div
          className="flex items-center min-w-max md:min-w-0"
          style={{ gap: "clamp(16px, 3vw, 48px)" }}
        >
          <div>
            <p
              className="font-bold text-[#64748B] uppercase tracking-widest mb-1"
              style={{ fontSize: "clamp(8px, 1.2vw, 12px)" }}
            >
              Total Payments
            </p>
            <p
              className="font-extrabold text-[#28A745] tracking-tight"
              style={{ fontSize: "clamp(15px, 3vw, 30px)" }}
            >
              {formatPKR(metrics.totalPayments)}
            </p>
          </div>
          <div>
            <p
              className="font-bold text-[#64748B] uppercase tracking-widest mb-1"
              style={{ fontSize: "clamp(8px, 1.2vw, 12px)" }}
            >
              Total Billing
            </p>
            <p
              className="font-extrabold text-(--color-primary) tracking-tight"
              style={{ fontSize: "clamp(15px, 3vw, 30px)" }}
            >
              {formatPKR(metrics.totalBilling)}
            </p>
          </div>
          <div>
            <p
              className="font-bold text-[#64748B] uppercase tracking-widest mb-1"
              style={{ fontSize: "clamp(8px, 1.2vw, 12px)" }}
            >
              Balance Owed
            </p>
            <p
              className="font-extrabold text-(--color-pending) tracking-tight"
              style={{ fontSize: "clamp(15px, 3vw, 30px)" }}
            >
              {formatPKR(Math.abs(metrics.balanceOwed))}
            </p>
          </div>
        </div>
      </div>

      <ActivityDataTable
        title="Statement of Account (Ledger)"
        activities={pagedActivities}
        headers={tableHeaders}
        currentPage={currentPage}
        totalPages={totalPages}
        showPagination={true}
        pageSize={pageSize}
      />
    </div>
  );
};
