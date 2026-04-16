import { formatPKR } from "@/lib/helper";
import { FileText, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { Prisma } from "@/lib/generated/prisma/client";

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
  } | null;
  distributionId: string | null;
  distribution: {
    id: string;
    quantity: number;
    unitPrice: Prisma.Decimal | number | string;
  } | null;
  createdAt: Date | string;
}

interface LedgerSectionProps {
  ledgers: Ledger[];
  metrics: {
    totalPayments: number;
    totalBilling: number;
    balanceOwed: number;
  };
}

export default function LedgerSection({
  ledgers,
  metrics,
}: LedgerSectionProps) {
  return (
    <div
      className="bg-[#E7F1F8] mb-8"
      style={{
        borderRadius: "clamp(12px, 2vw, 16px)",
      }}
    >
      {/* Ledger Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between bg-(--color-secondary-bg) mb-8"
        style={{
          gap: "clamp(12px, 2vw, 16px)",
          padding: "clamp(16px, 3vw, 32px)",
          borderRadius: "clamp(12px, 2vw, 16px) clamp(12px, 2vw, 16px) 0 0",
        }}
      >
        <div>
          <h3
            className="font-extrabold text-[#053B70]"
            style={{ fontSize: "clamp(16px, 2.5vw, 20px)" }}
          >
            Statement of Account (Ledger)
          </h3>
          <p
            className="text-[#64748B] font-medium mt-1"
            style={{ fontSize: "clamp(10px, 1.2vw, 12px)" }}
          >
            Transaction history for the current financial year
          </p>
        </div>

        <div
          className="flex items-center"
          style={{ gap: "clamp(8px, 1.5vw, 12px)" }}
        >
          <button
            className="flex items-center bg-white text-[#0F172A] font-bold rounded-lg hover:bg-gray-50 transition"
            style={{
              gap: "clamp(4px, 1vw, 8px)",
              fontSize: "clamp(10px, 1.2vw, 12px)",
              padding: "clamp(8px, 1.5vw, 10px) clamp(12px, 2vw, 20px)",
            }}
          >
            <FileText size={16} className="text-[#64748B]" />
            Export PDF
          </button>
          <button
            className="flex items-center bg-white text-[#0F172A] font-bold rounded-lg hover:bg-gray-50 transition"
            style={{
              gap: "clamp(4px, 1vw, 8px)",
              fontSize: "clamp(10px, 1.2vw, 12px)",
              padding: "clamp(8px, 1.5vw, 10px) clamp(12px, 2vw, 20px)",
            }}
          >
            <Printer size={16} className="text-[#64748B]" />
            Print
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div
        className="overflow-x-auto"
        style={{ padding: "0 clamp(16px, 3vw, 32px)" }}
      >
        <table className="w-full text-left font-medium">
          <thead
            className="text-[#94A3B8] font-bold uppercase tracking-widest border-b border-[#D9E9F3]"
            style={{ fontSize: "clamp(10px, 1.2vw, 12px)" }}
          >
            <tr>
              <th className="px-1 py-4">Date</th>
              <th className="px-4 py-4">Description</th>
              <th className="px-4 py-4 text-center">Type</th>
              <th className="px-1 py-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D9E9F3] text-[#0F172A]">
            {ledgers.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-gray-500">
                  No transactions found.
                </td>
              </tr>
            ) : (
              ledgers.map((entry, index) => {
                const isDebit = entry.transactionType === "DEBIT";
                const date = new Date(entry.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  },
                );

                let mainDesc = isDebit ? "Goods Delivered" : "Payment Received";
                let subDesc = entry.description || "";

                if (entry.distribution) {
                  mainDesc = "Goods Restock";
                  subDesc = `${entry.distribution.quantity} Bags x Cement @ ${formatPKR(Number(entry.distribution.unitPrice))}`;
                } else if (entry.payment) {
                  mainDesc =
                    entry.payment.paymentMethod === "BANK_TRANSFER"
                      ? "Bank Transfer - HBL"
                      : "Cash Deposit";
                  subDesc =
                    entry.payment.cashNote ||
                    `Ref #${entry.id.substring(0, 8).toUpperCase()}`;
                }

                return (
                  <tr key={entry.id}>
                    <td
                      className="px-1 py-5 whitespace-nowrap text-[#64748B]"
                      style={{ fontSize: "clamp(12px, 1.5vw, 14px)" }}
                    >
                      {date}
                    </td>
                    <td className="px-4 py-5 max-w-md">
                      <p
                        className="font-bold text-[#1E293B]"
                        style={{ fontSize: "clamp(12px, 1.5vw, 14px)" }}
                      >
                        {mainDesc}
                      </p>
                      <p
                        className="text-[#64748B] mt-1"
                        style={{ fontSize: "clamp(10px, 1.2vw, 12px)" }}
                      >
                        {subDesc}
                      </p>
                    </td>
                    <td className="px-4 py-5 text-center whitespace-nowrap">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 font-bold rounded-full",
                          isDebit
                            ? "bg-[#FBE9E9] text-[#C0392B]"
                            : "bg-[#D4EDDA] text-[#155724]",
                        )}
                        style={{
                          fontSize: "clamp(8px, 1vw, 10px)",
                          padding:
                            "clamp(2px, 0.4vw, 4px) clamp(8px, 1vw, 12px)",
                        }}
                      >
                        <span className="text-lg leading-none">
                          {isDebit ? "−" : "+"}
                        </span>
                        {isDebit ? "GOODS OUT (-)" : "PAYMENT IN (+)"}
                      </span>
                    </td>
                    <td
                      className={cn(
                        "px-1 py-5 text-right font-bold whitespace-nowrap",
                        isDebit ? "text-[#1E293B]" : "text-[#28A745]",
                      )}
                      style={{ fontSize: "clamp(14px, 1.8vw, 16px)" }}
                    >
                      {formatPKR(Number(entry.amount))}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Ledger Footer (Totals) */}
      <div
        className="flex items-center md:justify-end pt-10 mt-5 border-t border-(--color-secondary-bg)"
        style={{
          gap: "clamp(16px, 3vw, 48px)",
          padding: "clamp(16px, 3vw, 32px)",
          borderRadius: "0 0 clamp(12px, 2vw, 16px) clamp(12px, 2vw, 16px)",
        }}
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
            className="font-extrabold text-[#1E293B] tracking-tight"
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
            className="font-extrabold text-[#C0392B] tracking-tight"
            style={{ fontSize: "clamp(15px, 3vw, 30px)" }}
          >
            {formatPKR(Math.abs(metrics.balanceOwed))}
          </p>
        </div>
      </div>
    </div>
  );
}
