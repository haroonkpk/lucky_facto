"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Store, Search, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ShopWithStats } from "@/actions/owner.actions";
import { getInitials } from "@/lib/helper";
import { formatPKR } from "@/lib/dashboard-utils";
import Link from "next/link";

// ─── Props ─────────────────────────────────────────────────────────────────────
interface ShopsListProps {
  shops: ShopWithStats[];
  regions: { id: string; name: string }[];
}

// ─── Component ─────────────────────────────────────────────────────────────────
export function ShopsList({ shops, regions }: ShopsListProps) {
  const [search, setSearch] = useState("");
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const checkOverflow = () => {
      setCanScrollRight(el.scrollWidth > el.clientWidth);
    };

    checkOverflow();
    const ro = new ResizeObserver(checkOverflow);
    ro.observe(el);
    return () => ro.disconnect();
  }, [regions]);

  const handleScrollRight = () => {
    scrollRef.current?.scrollBy({ left: 160, behavior: "smooth" });
  };

  const filtered = useMemo(() => {
    return shops.filter((shop) => {
      const matchesRegion =
        activeRegion === null || shop.region === activeRegion;
      const matchesSearch =
        search.trim() === "" ||
        shop.name.toLowerCase().includes(search.toLowerCase()) ||
        shop.id.toLowerCase().includes(search.toLowerCase());
      return matchesRegion && matchesSearch;
    });
  }, [shops, search, activeRegion]);

  return (
    <div
      className="w-full flex flex-col"
      style={{ gap: "clamp(12px, 1.5vw, 20px)" }}
    >
      {/* ── Top Row: Search ───────────────────────────── */}
      <div className="flex justify-end">
        <div className="w-full md:w-80 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={18}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by shop name"
            className="w-full bg-white focus:outline-none focus:ring-2 focus:ring-[#053B70]"
            style={{
              borderRadius: "clamp(6px, 1vw, 8px)",
              padding:
                "clamp(8px, 1.2vw, 12px) clamp(12px, 1.5vw, 20px) clamp(8px, 1.2vw, 12px) clamp(32px, 3.5vw, 40px)",
              fontSize: "clamp(12px, 1.5vw, 14px)",
            }}
          />
        </div>
      </div>

      {/* ── Region Filter: Scrollable Row ─────────────── */}
      <div
        className="flex items-center"
        style={{ gap: "clamp(6px, 1vw, 10px)" }}
      >
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide flex-1"
          style={{
            gap: "clamp(6px, 1vw, 10px)",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <button
            onClick={() => setActiveRegion(null)}
            className={cn(
              "shrink-0 font-medium whitespace-nowrap",
              activeRegion === null
                ? "bg-[#053B70] text-white"
                : "bg-[#E2E8F0] text-[#0F172A]",
            )}
            style={{
              borderRadius: "clamp(6px, 1vw, 8px)",
              padding: "clamp(6px, 1vw, 8px) clamp(10px, 1.5vw, 16px)",
              fontSize: "clamp(11px, 1.5vw, 13px)",
            }}
          >
            All Regions
          </button>
          {regions.map((region) => (
            <button
              key={region.id}
              onClick={() =>
                setActiveRegion(
                  activeRegion === region.name ? null : region.name,
                )
              }
              className={cn(
                "shrink-0 font-medium whitespace-nowrap",
                activeRegion === region.name
                  ? "bg-[#053B70] text-white"
                  : "bg-[#E2E8F0] text-[#0F172A]",
              )}
              style={{
                borderRadius: "clamp(6px, 1vw, 8px)",
                padding: "clamp(6px, 1vw, 8px) clamp(10px, 1.5vw, 16px)",
                fontSize: "clamp(11px, 1.5vw, 13px)",
              }}
            >
              {region.name}
            </button>
          ))}
        </div>

        {canScrollRight && (
          <button
            onClick={handleScrollRight}
            className="shrink-0 flex items-center justify-center bg-[#E2E8F0] text-[#0F172A]"
            aria-label="Scroll regions right"
            style={{
              width: "clamp(28px, 3.5vw, 36px)",
              height: "clamp(28px, 3.5vw, 36px)",
              borderRadius: "clamp(6px, 1vw, 8px)",
            }}
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      {/* ── List Panel ────────────────────────────────── */}
      <div
        className="bg-[#E5F0F6] flex flex-col"
        style={{
          borderRadius: "clamp(10px, 1.5vw, 16px)",
          padding: "clamp(12px, 2vw, 24px)",
          gap: "clamp(12px, 2vw, 20px)",
        }}
      >
        {/* Panel Header */}
        <div className="flex justify-between items-center px-1">
          <h2
            className="text-[#053B70] font-bold"
            style={{ fontSize: "clamp(14px, 2vw, 18px)" }}
          >
            Registered Shops
          </h2>
          <span
            className="bg-[#D1E3EF] text-[#0A2540] font-bold uppercase tracking-wider"
            style={{
              fontSize: "clamp(8px, 1vw, 11px)",
              padding: "clamp(3px, 0.6vw, 6px) clamp(6px, 1vw, 10px)",
              borderRadius: "clamp(4px, 1vw, 6px)",
            }}
          >
            {filtered.length} Total Units
          </span>
        </div>

        {/* Column Headers */}
        <div
          className="hidden md:flex items-center font-bold text-[#64748B] uppercase tracking-wider"
          style={{
            fontSize: "clamp(10px, 1.2vw, 12px)",
            padding: "0 clamp(16px, 1.5vw, 20px)",
          }}
        >
          <div className="w-[35%] pr-2">Shop Details</div>
          <div className="w-[15%] px-1">Region</div>
          <div className="w-[16.66%] px-1 text-right">Total Billing</div>
          <div className="w-[16.66%] px-1 text-right">Total Payments</div>
          <div className="w-[16.66%] pl-1 text-right">Balance Owed</div>
        </div>

        {/* Rows */}
        <div className="flex flex-col" style={{ gap: "clamp(6px, 1vw, 12px)" }}>
          {filtered.length === 0 ? (
            <div
              className="bg-white text-center"
              style={{
                borderRadius: "clamp(8px, 1.5vw, 12px)",
                padding: "clamp(24px, 4vw, 48px)",
              }}
            >
              <Store size={32} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500 font-medium text-sm">
                No shops found
              </p>
              <p className="text-gray-400 text-xs mt-1">
                {search || activeRegion
                  ? "Try adjusting your search or region filter."
                  : "Use the form to add your first shop."}
              </p>
            </div>
          ) : (
            filtered.map((shop) => (
              <Link
                href={`/owner/shop-detail/${shop.id}`}
                key={shop.id}
                className="w-full bg-white flex flex-col md:flex-row md:items-center cursor-pointer"
                style={{
                  borderRadius: "clamp(8px, 1vw, 12px)",
                  padding: "clamp(12px, 1.5vw, 16px)",
                }}
              >
                
                <div className="flex items-center justify-between w-full md:w-[50%] shrink-0">
                  {/* Shop Details */}
                  <div
                    className="w-[70%] md:w-[70%] flex items-center shrink-0 pr-2 min-w-0"
                    style={{ gap: "clamp(8px, 1vw, 12px)" }}
                  >
                    <div
                      className="bg-[#F1F5F9] text-[#053B70] font-bold flex items-center justify-center shrink-0"
                      style={{
                        width: "clamp(32px, 4vw, 44px)",
                        height: "clamp(32px, 4vw, 44px)",
                        borderRadius: "clamp(6px, 1vw, 10px)",
                        fontSize: "clamp(12px, 1.5vw, 16px)",
                      }}
                    >
                      {getInitials(shop.name)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h3
                        className="font-bold text-[#0F172A] truncate"
                        style={{ fontSize: "clamp(12px, 1.5vw, 15px)" }}
                      >
                        {shop.name}
                      </h3>
                      <p
                        className="text-[#64748B] mt-0.5 truncate"
                        style={{ fontSize: "clamp(10px, 1vw, 12px)" }}
                      >
                        {shop.address || "No address"}
                      </p>
                    </div>
                  </div>

                  {/* Region */}
                  <div className="w-[30%] md:w-[30%] shrink-0 px-1 text-right md:text-left min-w-0">
                    <span
                      className="bg-[#E0F2FE] text-[#0A2540] font-bold tracking-wide truncate inline-block max-w-full"
                      style={{
                        fontSize: "clamp(9px, 1vw, 11px)",
                        padding: "clamp(2px, 0.4vw, 4px) clamp(4px, 1vw, 8px)",
                        borderRadius: "clamp(4px, 1vw, 6px)",
                      }}
                    >
                      {shop.region}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full md:w-[50%] shrink-0 pt-3 md:pt-0 mt-3 md:mt-0 border-t border-[#F1F5F9] md:border-none">
                  {/* Total Billing */}
                  <div className="w-1/3 shrink-0 md:px-1 text-left md:text-right min-w-0">
                    <p className="text-[#94A3B8] font-bold text-[9px] uppercase tracking-widest md:hidden mb-0.5">
                      Total Billing
                    </p>
                    <p
                      className="font-bold text-(--color-primary) truncate"
                      style={{ fontSize: "clamp(12px, 1.5vw, 14px)" }}
                    >
                      {formatPKR(shop.totalBilling)}
                    </p>
                  </div>

                  {/* Total Payments */}
                  <div className="w-1/3 shrink-0 px-1 text-center md:text-right min-w-0">
                    <p className="text-[#94A3B8] font-bold text-[9px] uppercase tracking-widest md:hidden mb-0.5">
                      Total Payments
                    </p>
                    <p
                      className="font-bold text-[#28A745] truncate"
                      style={{ fontSize: "clamp(12px, 1.5vw, 14px)" }}
                    >
                      {formatPKR(shop.totalPayments)}
                    </p>
                  </div>

                  {/* Balance Owed */}
                  <div className="w-1/3 shrink-0 pl-1 text-right min-w-0">
                    <p className="text-[#94A3B8] font-bold text-[9px] uppercase tracking-widest md:hidden mb-0.5">
                      Balance Owed
                    </p>
                    <p
                      className={cn(
                        "font-bold truncate",
                        shop.balanceOwed > 0
                          ? "text-amber-600"
                          : "text-[#94A3B8]",
                      )}
                      style={{ fontSize: "clamp(12px, 1.5vw, 14px)" }}
                    >
                      {formatPKR(Math.abs(shop.balanceOwed))}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
