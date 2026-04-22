import { Package } from "lucide-react";

interface StockItem {
  brandId: string;
  currentStock: number;
  brand: { name: string };
}

interface StockOverviewCardProps {
  inventoryBalances: StockItem[];
}

export const StockOverviewCard = ({
  inventoryBalances,
}: StockOverviewCardProps) => {
  return (
    <div
      style={{
        background: "var(--color-secondary-bg)",
        borderRadius: "clamp(12px, 2vw, 20px)",
        padding: "clamp(20px, 3vw, 28px)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center bg-[var(--color-primary)]/10"
            style={{
              width: "clamp(32px, 4vw, 40px)",
              height: "clamp(32px, 4vw, 40px)",
              borderRadius: "clamp(6px, 1vw, 10px)",
              background: "rgba(13, 62, 141, 0.1)",
            }}
          >
            <Package size={18} className="text-[var(--color-primary)]" />
          </div>
          <h3
            className="font-bold text-[#0A2540]"
            style={{ fontSize: "clamp(14px, 1.8vw, 17px)" }}
          >
            Stock Overview
          </h3>
        </div>
        <span
          className="bg-white/60 text-[#475569] font-bold uppercase tracking-wider"
          style={{
            fontSize: "clamp(9px, 1vw, 11px)",
            padding: "clamp(3px, 0.5vw, 5px) clamp(8px, 1vw, 12px)",
            borderRadius: "clamp(4px, 0.8vw, 6px)",
          }}
        >
          {inventoryBalances.length} Items
        </span>
      </div>

      {/* Stock list */}
      <div
        className="flex flex-col"
        style={{ gap: "clamp(6px, 1vw, 10px)" }}
      >
        {inventoryBalances.length === 0 ? (
          <div
            className="bg-white/50 text-center"
            style={{
              borderRadius: "clamp(8px, 1.2vw, 12px)",
              padding: "clamp(20px, 3vw, 32px)",
            }}
          >
            <Package size={28} className="mx-auto text-[#94A3B8] mb-2" />
            <p
              className="text-[#94A3B8] font-medium"
              style={{ fontSize: "clamp(12px, 1.4vw, 14px)" }}
            >
              No inventory data
            </p>
          </div>
        ) : (
          inventoryBalances.map((item) => {
            const isLow = item.currentStock <= 10;
            return (
              <div
                key={item.brandId}
                className="bg-white flex items-center justify-between"
                style={{
                  borderRadius: "clamp(8px, 1.2vw, 12px)",
                  padding: "clamp(12px, 1.5vw, 16px) clamp(14px, 2vw, 20px)",
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="shrink-0 flex items-center justify-center"
                    style={{
                      width: "clamp(28px, 3.5vw, 36px)",
                      height: "clamp(28px, 3.5vw, 36px)",
                      borderRadius: "clamp(6px, 0.8vw, 8px)",
                      background: isLow ? "#FEF2F2" : "#F0F9FF",
                    }}
                  >
                    <Package
                      size={14}
                      className={isLow ? "text-red-500" : "text-[var(--color-primary)]"}
                    />
                  </div>
                  <p
                    className="font-semibold text-[#1E293B] truncate"
                    style={{ fontSize: "clamp(13px, 1.5vw, 15px)" }}
                  >
                    {item.brand.name}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-3">
                  <span
                    className={`font-bold ${isLow ? "text-red-500" : "text-[#0A2540]"}`}
                    style={{ fontSize: "clamp(14px, 1.6vw, 16px)" }}
                  >
                    {item.currentStock}
                  </span>
                  <span
                    className="text-[#94A3B8] font-medium"
                    style={{ fontSize: "clamp(10px, 1.1vw, 12px)" }}
                  >
                    bags
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
