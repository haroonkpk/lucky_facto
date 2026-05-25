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
    periodBalanceOwed: number;
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
    { key: "date", label: "Date & Time" },
    { key: "title", label: "Type" },
    { key: "details", label: "Units" },
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

      <ActivityDataTable
        title="Statement of Account (Ledger)"
        activities={pagedActivities}
        headers={tableHeaders}
        currentPage={currentPage}
        totalPages={totalPages}
        totalEntries={allActivities.length}
        allActivities={allActivities}
        showPrintButton={true}
        pdfSubtitle={`Shop: ${shopName}`}
        pdfSummary={{
          "Total Payments": formatPKR(metrics.totalPayments),
          "Total Billing": formatPKR(metrics.totalBilling),
          "Balance Owed": formatPKR(Math.abs(metrics.periodBalanceOwed)),
          "Status": metrics.periodBalanceOwed < 0 ? "Advance" : "Pending Debt"
        }}
        showPagination={true}
        pageSize={pageSize}
      />
    </div>
  );
};
