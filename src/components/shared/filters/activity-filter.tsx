"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, X, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { Button, Input, Select } from "@/components/ui";
import { cn } from "@/lib/utils";

interface FilterOption {
  id: string;
  name: string;
}

interface ActivityFilterProps {
  /** Show brand filter dropdown */
  showBrandFilter?: boolean;
  /** Show shop filter dropdown */
  showShopFilter?: boolean;
  /** Show payment type filter (Factory Payment / Shop Collection) */
  showPaymentTypeFilter?: boolean;
  /** Brands list passed from server component */
  brands?: FilterOption[];
  /** Shops list passed from server component */
  shops?: FilterOption[];
}

export function ActivityFilter({
  showBrandFilter = false,
  showShopFilter = false,
  showPaymentTypeFilter = false,
  brands = [],
  shops = [],
}: ActivityFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const now = new Date();
  const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const defaultEnd = now;

  const [startDate, setStartDate] = useState(
    searchParams.get("startDate") || formatDate(defaultStart),
  );
  const [endDate, setEndDate] = useState(
    searchParams.get("endDate") || formatDate(defaultEnd),
  );
  const [paymentType, setPaymentType] = useState(
    searchParams.get("paymentType") || "",
  );
  const [brandId, setBrandId] = useState(searchParams.get("brandId") || "");
  const [shopId, setShopId] = useState(searchParams.get("shopId") || "");

  const handleApply = () => {
    const params = new URLSearchParams(searchParams);
    params.set("startDate", startDate);
    params.set("endDate", endDate);

    if (showPaymentTypeFilter && paymentType) params.set("paymentType", paymentType);
    else params.delete("paymentType");

    if (showBrandFilter && brandId) params.set("brandId", brandId);
    else params.delete("brandId");

    if (showShopFilter && shopId && paymentType !== "FACTORY_PAYMENT") params.set("shopId", shopId);
    else params.delete("shopId");

    params.set("page", "1");

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const handleClear = () => {
    setStartDate(formatDate(defaultStart));
    setEndDate(formatDate(defaultEnd));
    setPaymentType("");
    setBrandId("");
    setShopId("");
    startTransition(() => {
      router.push("?");
    });
  };

  const hasFilter =
    searchParams.has("startDate") ||
    searchParams.has("endDate") ||
    searchParams.has("paymentType") ||
    searchParams.has("brandId") ||
    searchParams.has("shopId");

  return (
    <div className="w-full flex flex-col gap-4 bg-white/50 p-3 sm:p-4 rounded-[clamp(0.5rem,1.25vw,0.75rem)] border border-slate-200">
      {/* ── Mobile Toggle Header ── */}
      <div className="flex items-center justify-between sm:hidden px-1">
        <div className="flex items-center gap-2 text-[#0A2540] font-semibold">
          <Filter size={18} className="text-[var(--color-primary)]" />
          <span>Quick Filters</span>
          {hasFilter && (
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
          )}
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
          aria-label={isOpen ? "Close filters" : "Open filters"}
        >
          {isOpen ? (
            <ChevronUp size={20} className="text-[#64748B]" />
          ) : (
            <ChevronDown size={20} className="text-[#64748B]" />
          )}
        </button>
      </div>

      <div
        className={cn(
          "grid gap-4 items-end transition-all duration-300 overflow-hidden",
          isOpen ? "grid opacity-100 mt-2" : "hidden sm:grid opacity-100"
        )}
        style={{
          gridTemplateColumns: `repeat(auto-fit, minmax(160px, 1fr))`,
        }}
      >
        <Input
          id="startDate"
          label="From"
          type="date"
          value={startDate}
          max={formatDate(now)}
          onChange={(e) => setStartDate(e.target.value)}
          className="bg-white "
        />

        <Input
          id="endDate"
          label="To"
          type="date"
          value={endDate}
          max={formatDate(now)}
          onChange={(e) => setEndDate(e.target.value)}
          className="bg-white"
        />

        {showPaymentTypeFilter && (
          <Select
            id="paymentType"
            label="Payment Category"
            value={paymentType}
            onChange={(e) => {
              setPaymentType(e.target.value);
              if (e.target.value === "FACTORY_PAYMENT") {
                setShopId("");
              }
            }}
            options={[
              { value: "", label: "All Payments" },
              { value: "FACTORY_PAYMENT", label: "Factory Payment" },
              { value: "SHOP_COLLECTION", label: "Shop Collection" },
            ]}
            className="bg-white"
          />
        )}

        {showBrandFilter && (
          <Select
            id="brandId"
            label="Brand"
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
            options={[
              { value: "", label: "All Brands" },
              ...brands.map((b) => ({ value: b.id, label: b.name })),
              { value: "OTHER", label: "Other" },
            ]}
            className="bg-white"
          />
        )}

        {showShopFilter && paymentType !== "FACTORY_PAYMENT" && (
          <Select
            id="shopId"
            label="Shop"
            value={shopId}
            onChange={(e) => setShopId(e.target.value)}
            options={[
              { value: "", label: "All Shops" },
              ...shops.map((s) => ({ value: s.id, label: s.name })),
            ]}
            className="bg-white"
          />
        )}

        <div className="flex items-center gap-2 pt-2 sm:pt-0">
          <Button
            variant="primary"
            icon={<Filter size={16} />}
            onClick={handleApply}
            disabled={isPending}
            className="flex-1"
          >
            {isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Apply"
            )}
          </Button>

          {hasFilter && (
            <Button
              variant="outline"
              onClick={handleClear}
              disabled={isPending}
              className="px-2"
              title="Clear all filters"
            >
              <X size={18} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
