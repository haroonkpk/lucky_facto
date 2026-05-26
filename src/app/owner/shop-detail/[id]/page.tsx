import { notFound } from "next/navigation";
import { formatPKR } from "@/lib/dashboard-utils";
import { Edit2, MapPin, Phone, Building2, AlertTriangle } from "lucide-react";
import { getShopLedgerData } from "@/actions/owner.actions";
import { getBrands } from "@/actions/salesman.actions";
import { LedgerSection } from "@/components/owner";
import { Metadata } from "next";
import { ActivityFilter } from "@/components/shared";
import { Card } from "@/components/ui";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const startDate = resolvedSearchParams.startDate
    ? new Date(resolvedSearchParams.startDate as string)
    : undefined;
  const endDate = resolvedSearchParams.endDate
    ? new Date(resolvedSearchParams.endDate as string)
    : undefined;

  const data = await getShopLedgerData(
    resolvedParams.id,
    startDate,
    endDate,
    resolvedSearchParams.brandId as string,
    resolvedSearchParams.transactionType as string,
  );

  return {
    title: data ? `Ledger: ${data.shop.name}` : "Shop Not Found",
  };
}

export default async function ShopDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  const startDate = resolvedSearchParams.startDate
    ? new Date(resolvedSearchParams.startDate as string)
    : undefined;
  const endDate = resolvedSearchParams.endDate
    ? new Date(resolvedSearchParams.endDate as string)
    : undefined;

  const [data, brands] = await Promise.all([
    getShopLedgerData(
      resolvedParams.id,
      startDate,
      endDate,
      resolvedSearchParams.brandId as string,
      resolvedSearchParams.transactionType as string,
    ),
    getBrands(),
  ]);

  if (!data) return notFound();

  // Serialize to plain objects to handle Prisma.Decimal
  const serializedData = JSON.parse(JSON.stringify(data));
  const { shop, metrics } = serializedData;



  const lastPaymentDaysAgo = (() => {
    if (!metrics.lastPaymentDate) return null;
    const paymentDate = new Date(metrics.lastPaymentDate);
    const today = new Date();
    paymentDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - paymentDate.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  })();

  return (
    <div
      className="min-h-screen bg-(--color-page-bg) font-sans"
      style={{ padding: "clamp(1px, 3vw, 40px)" }}
    >
      {/* ── Top Header Section ── */}
      <div
        className="flex flex-col md:flex-row mb-8"
        style={{ gap: "clamp(16px, 2.5vw, 24px)" }}
      >
        {/* Left: Profile Card */}
        <div
          className="w-full md:max-w-md xl:max-w-lg flex-shrink-0 bg-(--color-primary) flex justify-between items-start"
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
        </div>

        {/* Right: Payment Balances Card */}
        <div
          className="w-full grow bg-(--color-secondary-bg) flex flex-col justify-center"
          style={{
            padding: "clamp(16px, 3vw, 24px)",
            borderRadius: "clamp(12px, 2vw, 16px)",
          }}
        >
          <div className="flex flex-col gap-3">
            {/* Row 1: Pending & Advance Payment */}
            <div className="w-full overflow-x-auto">
              <div className="grid grid-cols-2 gap-4 divide-x divide-slate-200 min-w-max sm:min-w-0 w-full">
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left pr-4">
                  <p className="font-bold text-[#64748B] uppercase tracking-widest mb-1 whitespace-nowrap" style={{ fontSize: "clamp(10px, 1.2vw, 12px)" }}>
                    Pending Payment
                  </p>
                  <h2 className="font-extrabold text-(--color-pending) tracking-tight whitespace-nowrap" style={{ fontSize: "clamp(20px, 2.8vw, 32px)" }}>
                    {metrics.currentBalance > 0 ? formatPKR(metrics.currentBalance) : formatPKR(0)}
                  </h2>
                </div>
                
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left pl-4">
                  <p className="font-bold text-[#64748B] uppercase tracking-widest mb-1 whitespace-nowrap" style={{ fontSize: "clamp(10px, 1.2vw, 12px)" }}>
                    Advance Payment
                  </p>
                  <h2 className="font-extrabold text-[#28A745] tracking-tight whitespace-nowrap" style={{ fontSize: "clamp(20px, 2.8vw, 32px)" }}>
                    {metrics.currentBalance < 0 ? formatPKR(Math.abs(metrics.currentBalance)) : formatPKR(0)}
                  </h2>
                </div>
              </div>
            </div>

            {/* Divider between rows */}
            <hr className="border-t border-slate-200" />

            {/* Row 2: Last Payment */}
            <div className="flex flex-row items-center justify-center sm:justify-start gap-2 text-[11px] sm:text-xs">
              <span className="font-bold text-[#64748B] uppercase tracking-widest">
                Last Payment:
              </span>
              <span className="font-bold text-slate-700 px-2.5 py-0.5 ">
                {lastPaymentDaysAgo !== null
                  ? lastPaymentDaysAgo === 0
                    ? "Today"
                    : lastPaymentDaysAgo === 1
                    ? "Yesterday"
                    : `${lastPaymentDaysAgo} days ago`
                  : "None"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* History Card Section */}
      <Card variant="secondary" className="flex flex-col gap-8 px-3">
     
          <div className="w-full">
            <ActivityFilter
              showBrandFilter
              showTransactionTypeFilter
              brands={brands}
            />
          </div>
       

        <LedgerSection
          ledgers={shop.ledgers}
          metrics={metrics}
          shopName={shop.name}
        />
      </Card>

      {/* Metrics Summary Card */}
      <Card variant="secondary" className="my-8 py-6 sm:py-8 overflow-x-auto">
        <div className="flex flex-row divide-x divide-slate-100 min-w-max sm:min-w-0 px-2 sm:px-0">
          <div className="flex flex-col items-center justify-center px-6 sm:px-2 flex-1">
            <p className="text-[#64748B] font-bold uppercase tracking-widest mb-2 text-[10px] sm:text-xs whitespace-nowrap">
              Total Payments
            </p>
            <p className="text-[#28A745] font-extrabold text-2xl sm:text-3xl tracking-tight">
              {formatPKR(metrics.totalPayments)}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center px-6 sm:px-2 flex-1">
            <p className="text-[#64748B] font-bold uppercase tracking-widest mb-2 text-[10px] sm:text-xs whitespace-nowrap">
              Total Billing
            </p>
            <p className="text-(--color-primary) font-extrabold text-2xl sm:text-3xl tracking-tight">
              {formatPKR(metrics.totalBilling)}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center px-6 sm:px-2 flex-1">
            <p className="text-[#64748B] font-bold uppercase tracking-widest mb-2 text-[10px] sm:text-xs whitespace-nowrap">
              Balance Owed
            </p>
            <p className="text-(--color-pending) font-extrabold text-2xl sm:text-3xl tracking-tight">
              {formatPKR(Math.abs(metrics.periodBalanceOwed))}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
