import { notFound } from "next/navigation";
import { formatPKR } from "@/lib/dashboard-utils";
import { Edit2, MapPin, Phone, Building2, AlertTriangle } from "lucide-react";
import { getShopLedgerData } from "@/actions/owner.actions";
import LedgerSection from "@/components/owner/ledgerSection";

export default async function ShopDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const data = await getShopLedgerData(resolvedParams.id);

  if (!data) return notFound();

  const { shop, metrics } = data;

  const isDebt = metrics.totalPayments < metrics.totalBilling;
  const statusColor = isDebt ? "#C0392B" : "#28A745";
  const statusBg = isDebt ? "#FBE9E9" : "#D4EDDA";
  
  const lastPaymentDaysAgo = metrics.lastPaymentDate 
    ? Math.floor((new Date().getTime() - new Date(metrics.lastPaymentDate).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div
      className="min-h-screen bg-(--color-page-bg) font-sans"
      style={{ padding: "clamp(16px, 3vw, 40px)" }}
    >
      {/* ── Top Header Section ── */}
      <div
        className="flex flex-col md:flex-row mb-8"
        style={{ gap: "clamp(16px, 2.5vw, 24px)" }}
      >
        {/* Left: Profile Card */}
        <div
          className="grow bg-(--color-primary) flex justify-between items-start"
          style={{
            padding: "clamp(16px, 3vw, 32px)",
            borderRadius: "clamp(12px, 2vw, 16px)",
          }}
        >
          <div>
            {/* Region Badge */}
            <div
              className="inline-flex items-center bg-[#BFDCF0] text-[#0A2540] font-bold rounded-full mb-5"
              style={{
                gap: "clamp(4px, 1vw, 6px)",
                fontSize: "clamp(10px, 1.2vw, 12px)",
                padding: "clamp(4px, 0.8vw, 6px) clamp(8px, 1.5vw, 12px)",
              }}
            >
              <MapPin size={14} className="text-[#053B70]" />
              <span className="uppercase tracking-wider">
                {shop.region.name}
              </span>
            </div>

            {/* Shop Name & Details */}
            <h1
              className="font-extrabold text-blue-50 tracking-tight mb-4"
              style={{ fontSize: "clamp(24px, 4vw, 36px)" }}
            >
              {shop.name}
            </h1>

            <div
              className="flex flex-col text-blue-200 font-medium"
              style={{ gap: "clamp(8px, 1.5vw, 12px)" }}
            >
              <div className="flex items-center gap-3">
                <Building2 size={16} className="text-blue-200" />
                <p style={{ fontSize: "clamp(12px, 1.5vw, 14px)" }}>
                  {shop.address || "Main Bazaar, Sector 4, Near Clock Tower"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-blue-200" />
                <p style={{ fontSize: "clamp(12px, 1.5vw, 14px)" }}>
                  {shop.phoneNumber || "+92 300 1234567"}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <button
            className="flex items-center bg-white/10 text-white font-bold rounded-sm hover:bg-gray-50/30 transition"
            style={{
              gap: "clamp(4px, 1vw, 8px)",
              fontSize: "clamp(10px, 1.2vw, 12px)",
              padding: "clamp(8px, 1.5vw, 10px) clamp(12px, 2vw, 20px)",
            }}
          >
            <Edit2 size={14} className="text-white" />
            Edit
          </button>
        </div>

        {/* Right: Balance Card  */}
        <div
          className="w-full md:w-[360px] flex-shrink-0 transition-colors duration-300 flex flex-col"
          style={{
            padding: "clamp(16px, 3vw, 32px)",
            borderRadius: "clamp(12px, 2vw, 16px)",
            backgroundColor: statusBg,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <p
              className="font-bold text-[#64748B] uppercase tracking-widest"
              style={{ fontSize: "clamp(10px, 1.2vw, 12px)" }}
            >
              Current Balance
            </p>
            <Building2 size={24} style={{ color: statusColor }} className="opacity-40" />
          </div>

          <h2
            className="font-extrabold tracking-tight mb-5"
            style={{ 
              fontSize: "clamp(32px, 5vw, 48px)",
              color: statusColor
            }}
          >
            {formatPKR(Math.abs(metrics.balanceOwed))}
          </h2>

          <div className="pt-5 mt-auto flex flex-col gap-2">
            <div className="flex items-center gap-2.5" style={{ color: statusColor }}>
              {isDebt ? (
                <AlertTriangle size={18} fill={statusBg} />
              ) : (
                <Building2 size={18} />
              )}
              <p
                className="font-bold"
                style={{ fontSize: "clamp(12px, 1.5vw, 14px)" }}
              >
                {isDebt ? "Pending Debt" : metrics.balanceOwed < 0 ? "Advance Balance" : "Fully Paid"}
              </p>
            </div>
            <p
              className="text-[#64748B] font-medium pl-8"
              style={{ fontSize: "clamp(10px, 1.2vw, 12px)" }}
            >
              {lastPaymentDaysAgo !== null 
                ? `Last payment received ${lastPaymentDaysAgo === 0 ? "today" : `${lastPaymentDaysAgo} days ago`}`
                : "No payments yet"}
            </p>
          </div>
        </div>
      </div>

      {/* Ledger Section */}
      <LedgerSection ledgers={shop.ledgers} metrics={metrics} />
      
    </div>
  );
}