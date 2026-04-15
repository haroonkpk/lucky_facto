"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Store, Search, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ShopWithStats } from "@/actions/owner.actions";
import { formatPKR, getInitials } from "@/lib/helper";




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

  // Check overflow on mount and resize
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
    <div className="w-full flex flex-col gap-4">
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
            placeholder="Search by shop name or ID..."
            className="w-full bg-white rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#053B70] shadow-sm border border-transparent transition-all"
          />
        </div>
      </div>

      {/* ── Region Filter: Scrollable Row ─────────────── */}
      <div className="flex items-center gap-2">
        {/* Scrollable pill row */}
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide flex-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <button
            onClick={() => setActiveRegion(null)}
            className={cn(
              "shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
              activeRegion === null
                ? "bg-[#053B70] text-white"
                : "bg-[#E2E8F0] text-[#0F172A] hover:bg-[#CBD5E1]",
            )}
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
                "shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                activeRegion === region.name
                  ? "bg-[#053B70] text-white"
                  : "bg-[#E2E8F0] text-[#0F172A] hover:bg-[#CBD5E1]",
              )}
            >
              {region.name}
            </button>
          ))}
        </div>

        {/* Scroll indicator arrow */}
        {canScrollRight && (
          <button
            onClick={handleScrollRight}
            className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-[#E2E8F0] hover:bg-[#CBD5E1] text-[#0F172A] transition-colors"
            aria-label="Scroll regions right"
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>

      {/* ── List Panel ────────────────────────────────── */}
      <div className="bg-[#E5F0F6] rounded-2xl p-4 md:p-6 flex flex-col gap-4">
        {/* Panel Header */}
        <div className="flex justify-between items-center px-2">
          <h2 className="text-[#053B70] text-lg font-bold">Registered Shops</h2>
          <span className="bg-[#D1E3EF] text-[#0A2540] text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-wider">
            {filtered.length} Total Units
          </span>
        </div>

        {/* Column Headers */}
        <div className="hidden md:flex items-center text-[10px] font-bold text-[#64748B] uppercase tracking-wider px-4">
          <div className="w-[40%]">Shop Details</div>
          <div className="w-[30%]">Region</div>
          <div className="w-[15%] text-right">Total (PKR)</div>
          <div className="w-[15%] text-right">Pending (PKR)</div>
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm">
              <Store size={40} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500 font-medium">No shops found</p>
              <p className="text-gray-400 text-sm mt-1">
                {search || activeRegion
                  ? "Try adjusting your search or region filter."
                  : "Use the form to add your first shop."}
              </p>
            </div>
          ) : (
            filtered.map((shop) => (
              <div
                key={shop.id}
                className="w-full bg-white rounded-xl shadow-sm flex flex-col md:flex-row items-start md:items-center p-4 gap-y-3 gap-x-4 transition-all hover:shadow-md"
              >
                {/* Shop Details — 40% */}
                <div className="flex items-center gap-4 w-full md:w-[40%] shrink-0">
                  <div className="bg-[#F1F5F9] text-[#053B70] font-bold text-base rounded-xl flex items-center justify-center shrink-0 w-[48px] h-[48px]">
                    {getInitials(shop.name)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3
                      className="font-bold text-[#0F172A] truncate"
                      style={{ fontSize: "clamp(13px, 2vw, 15px)" }}
                    >
                      {shop.name}
                    </h3>
                    <p className="text-[#64748B] text-xs mt-0.5 truncate">
                      {shop.address || "No address"}
                    </p>
                  </div>
                </div>

                {/* Region — 30% */}
                <div className="w-full md:w-[30%] shrink-0">
                  <span className="bg-[#E0F2FE] text-[#0A2540] font-bold text-[11px] px-2.5 py-1 rounded">
                    {shop.region}
                  </span>
                </div>

                {/* Total Payments — 15% */}
                <div className="w-full md:w-[15%] shrink-0 flex flex-col md:items-end">
                  <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest md:hidden mb-0.5">
                    Total Payments
                  </p>
                  <p
                    className="font-bold text-[#0A2540] whitespace-nowrap"
                    style={{ fontSize: "clamp(12px, 1.5vw, 14px)" }}
                  >
                    {formatPKR(shop.totalPayments)}
                  </p>
                </div>

                {/* Pending Payments — 15% */}
                <div className="w-full md:w-[15%] shrink-0 flex flex-col md:items-end">
                  <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest md:hidden mb-0.5">
                    Pending Payments
                  </p>
                  <p
                    className={cn(
                      "font-bold whitespace-nowrap",
                      shop.pendingPayments > 0
                        ? "text-red-500"
                        : "text-[#94A3B8]",
                    )}
                    style={{ fontSize: "clamp(12px, 1.5vw, 14px)" }}
                  >
                    {shop.pendingPayments > 0
                      ? formatPKR(shop.pendingPayments)
                      : "0"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
