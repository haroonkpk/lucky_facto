import { getSalesmen } from "@/actions/owner.actions";
import { RegisterSalesmanForm } from "@/components/auth";
import { NumberFormat } from "@/lib/helper";
import { User2 } from "lucide-react";
import Image from "next/image";

// Page
export default async function SalesmenPage() {
  const salesmen = await getSalesmen();

  return (
    <div className="min-h-screen bg-(--color-page-bg) p-3 mb-20 lg:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Team Management
        </h1>
        <p className="text-gray-500">
          Monitoring {salesmen.length} registered salesmen across key regions.
        </p>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col-reverse md:flex-row gap-8">
        {/* ── LEFT ── */}
        <div className=" w-full max-w-3xl flex flex-col gap-4">
          {salesmen.length === 0 ? (
            <div className="bg-[#E5F0F6] rounded-2xl p-12 text-center">
              <User2 size={40} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500 font-medium">No salesmen found</p>
              <p className="text-gray-400 text-sm mt-1">
                Use the form to add your first salesman
              </p>
            </div>
          ) : (
            salesmen.map((salesman) => (
              <div
                key={salesman.id}
                className="w-full max-w-3xl bg-[#E5F0F6] rounded-2xl flex items-center justify-between transition-all hover:bg-[#daeaf3]"
                style={{
                  padding: "clamp(12px, 2vw, 16px) clamp(14px, 2.5vw, 24px)",
                  gap: "clamp(10px, 2vw, 20px)",
                }}
              >
                {/* Profile & Info */}
                <div
                  className="flex items-center"
                  style={{ gap: "clamp(10px, 2vw, 16px)" }}
                >
                  {/* Avatar */}
                  <div
                    className="rounded-2xl flex items-center justify-center shrink-0 overflow-hidden"
                    style={{
                      width: "clamp(48px, 7vw, 72px)",
                      height: "clamp(48px, 7vw, 72px)",
                      borderRadius: "clamp(10px, 1.5vw, 16px)",
                    }}
                  >
                    <Image
                      src="/avatar.png"
                      alt="avatar"
                      width={72}
                      height={72}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-col justify-center">
                    <h3
                      className="font-bold text-[#1A2E44] mb-1"
                      style={{ fontSize: "clamp(13px, 2.8vw, 19px)" }}
                    >
                      {salesman.name}
                    </h3>

                    <p
                      className="text-gray-500 mb-2.5"
                      style={{ fontSize: "clamp(10px, 1.7vw, 13px)" }}
                    >
                      {salesman.email}
                    </p>

                    {salesman.regions.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {salesman.regions.map((region, idx) => (
                          <span
                            key={idx}
                            className="bg-[#D1E3EF] text-[#1A2E44] font-bold uppercase tracking-wider rounded"
                            style={{
                              fontSize: "clamp(8px, 1vw, 10px)",
                              padding:
                                "clamp(2px, 0.4vw, 4px) clamp(6px, 1vw, 10px)",
                            }}
                          >
                            {region}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span
                        className="text-gray-400 italic"
                        style={{ fontSize: "clamp(9px, 1.1vw, 11px)" }}
                      >
                        No regions assigned
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div
                  className="flex flex-col sm:flex-row items-end shrink-0"
                  style={{ gap: "clamp(10px, 2vw, 20px)" }}
                >
                  <div className="text-right">
                    <p
                      className="font-bold text-[#94A3B8] uppercase tracking-widest mb-1.5"
                      style={{ fontSize: "clamp(8px, 1vw, 10px)" }}
                    >
                      Total Sales
                    </p>
                    <p
                      className="font-bold text-[#0A2540] tracking-tight whitespace-nowrap"
                      style={{ fontSize: "clamp(16px, 2.5vw, 24px)" }}
                    >
                      {NumberFormat(salesman.totalSales)}
                    </p>
                  </div>

                  {(() => {
                      const vals = salesman.dailySales;
                      const maxVal = Math.max(...vals, 0);
                      return (
                        <div
                          className="flex items-end"
                          style={{
                            gap: "clamp(2px, 0.4vw, 4px)",
                            height: "clamp(24px, 4vw, 40px)",
                          }}
                        >
                          {vals.map((v, i) => {
                            // normalise: 4% minimum so zero-days still show a tiny bar
                            const pct =
                              maxVal === 0
                                ? 4
                                : Math.max(4, (v / maxVal) * 100);
                            return (
                              <div
                                key={i}
                                className="rounded-[1px]"
                                style={{
                                  width: "clamp(6px, 1vw, 11px)",
                                  height: `${pct}%`,
                                  backgroundColor: salesman.isActive
                                    ? "#053B70"
                                    : "#B8C9D8",
                                }}
                              />
                            );
                          })}
                        </div>
                      );
                    })()}
                </div>
              </div>
            ))
          )}
        </div>

        {/*  RIGHT Side */}
        <div className="lg:col-span-4">
          <RegisterSalesmanForm />
        </div>
      </div>
    </div>
  );
}
