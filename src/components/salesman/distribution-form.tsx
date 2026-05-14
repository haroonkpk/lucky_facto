"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import {
  createDistributionAction,
  ActionState,
} from "@/actions/salesman.actions";
import { Button, Input, Select, Textarea } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";

interface DistributionFormProps {
  brands: { id: string; name: string }[];
  shops: { id: string; name: string }[];
  inventoryBalances: {
    brandId: string;
    currentStock: number;
    brand: { name: string };
  }[];
}

const initialState: ActionState = {
  success: false,
  error: null,
};

export const DistributionForm = ({
  brands,
  shops,
  inventoryBalances,
}: DistributionFormProps) => {
  const [state, formAction, isPending] = useActionState(
    createDistributionAction,
    initialState,
  );

  const formRef = useRef<HTMLFormElement>(null);
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);

  const availableStock = inventoryBalances.find(b => b.brandId === selectedBrandId)?.currentStock ?? 0;
  const isOverStock = selectedBrandId !== "" && quantity > availableStock;

  useEffect(() => {
    setTotal(quantity * unitPrice);
  }, [quantity, unitPrice]);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setQuantity(0);
      setUnitPrice(0);
      setTotal(0);
      setSelectedBrandId("");
    }
  }, [state.success]);

  const brandOptions = [
    { value: "", label: "Select Brand" },
    ...brands.map((b) => ({ value: b.id, label: b.name })),
  ];

  const shopOptions = [
    { value: "", label: "Select Shop" },
    ...shops.map((s) => ({ value: s.id, label: s.name })),
  ];

  return (
    <div
      className={cn(
        "rounded-xl transition-all duration-200 ease-in-out mb-20 mx-auto",
        "2xl:w-full 2xl:p-[clamp(1.5rem,3vw,2.5rem)]",
        isOpen
          ? "bg-white shadow-xs w-full p-[clamp(1.5rem,3vw,2.5rem)]"
          : "bg-transparent shadow-none w-full p-3",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-start justify-between w-full border-slate-100",
          isOpen ? "mb-[clamp(1.5rem,3vw,2rem)] border-b pb-5" : "border-b-0 pb-0",
          "2xl:mb-[clamp(1.5rem,3vw,2rem)] 2xl:border-b 2xl:pb-5",
        )}
      >
        <div className={cn( isOpen ? "block" : "hidden")}>
          <h2 className="text-[clamp(1.25rem,2vw,1.5rem)] font-bold text-[#111827] mb-1">
            Add Distribution
          </h2>
        </div>

        {/* Toggle button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            "flex-shrink-0 w-16 h-12 rounded-md flex items-center justify-center ml-auto",
            "text-white",
            "transition-colors duration-150 ease-in-out",
            isOpen ? "text-(--color-primary)" : "bg-(--color-primary)",
          )}
          aria-label={isOpen ? "Collapse form" : "Expand form"}
        >
          {isOpen ? (
            <X size={28} strokeWidth={2.5} />
          ) : (
            <Plus size={28} strokeWidth={2.5} />
          )}
        </button>
      </div>

      {/* Form body */}
      <div className={cn( isOpen ? "block" : "hidden")}>

      {/* Success Banner */}
      {state.success && (
        <div className="mb-6 rounded-lg bg-green-50 border border-green-200 px-4 py-3 flex items-center gap-2">
          <span className="text-green-600 font-semibold text-sm">
            ✓ Distribution authorized and ledger updated.
          </span>
        </div>
      )}

      {/* Form */}
      <form ref={formRef} action={formAction}>
        <div className="flex flex-col gap-[clamp(1rem,2vw,1.5rem)]">
          <div className="grid grid-cols-2 gap-4">
            <Select
              id="shopId"
              name="shopId"
              label="Shop"
              options={shopOptions}
              required
              className="bg-[var(--color-secondary-bg)] border-transparent focus:border-[var(--color-primary)]"
            />
            <Select
              id="brandId"
              name="brandId"
              label="Brand"
              options={brandOptions}
              required
              onChange={(e) => setSelectedBrandId(e.target.value)}
              className="bg-[var(--color-secondary-bg)] border-transparent focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Input
                id="quantity"
                name="quantity"
                label="Release Qty"
                type="number"
                placeholder="0"
                required
                min="1"
                onChange={(e) => setQuantity(Number(e.target.value))}
                className={cn(
                  "bg-[var(--color-secondary-bg)] border-transparent focus:border-[var(--color-primary)]",
                  isOverStock && "border-red-500!"
                )}
              />
              {selectedBrandId && (
                <p className={cn(
                  "text-[10px] font-bold uppercase tracking-wider",
                  isOverStock ? "text-red-500" : "text-slate-400"
                )}>
                  {isOverStock 
                    ? `Max: ${availableStock}` 
                    : `Stock: ${availableStock}`}
                </p>
              )}
            </div>
            
            <Input
              id="unitPrice"
              name="unitPrice"
              label="Unit Price"
              type="number"
              step="0.01"
              placeholder="0.00"
              required
              onChange={(e) => setUnitPrice(Number(e.target.value))}
              className="bg-[var(--color-secondary-bg)] border-transparent focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-[clamp(0.3rem,1vw,0.5rem)]">
              <label className="text-[clamp(0.7rem,1vw,0.8rem)] font-bold text-[#475569] uppercase tracking-wide">
                Total Amount
              </label>
              <div className="flex-1 bg-slate-100 rounded-md flex items-center px-4 font-bold text-slate-700 min-h-[48px]">
                RS.{" "}
                {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>
            <Input
              id="distributionDate"
              name="distributionDate"
              label="Date"
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
              required
              className="bg-[var(--color-secondary-bg)] border-transparent focus:border-[var(--color-primary)]"
            />
          </div>

          <Textarea
            id="notes"
            name="notes"
            label="Notes"
            placeholder="Driver details, vehicle number, or special terms..."
            className="bg-[var(--color-secondary-bg)] border-transparent focus:border-[var(--color-primary)]"
          />

          {/* Error Message */}
          {state.error && (
            <p className="text-[clamp(0.8rem,1vw,0.875rem)] text-red-500 font-bold">
              {state.error}
            </p>
          )}

          {/* Submit */}
          <Button
            type="submit"
            className="w-full mt-4 h-12"
            disabled={isPending || isOverStock || (selectedBrandId !== "" && availableStock <= 0)}
          >
            {isPending ? "Loading..." : isOverStock ? "Insufficient Stock" : "Submit"}
          </Button>
        </div>
      </form>
      </div>
    </div>
  );
}
