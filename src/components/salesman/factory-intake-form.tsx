"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  createInventoryIntakeAction,
  ActionState,
} from "@/actions/salesman.actions";
import { Button, Input, Select, Textarea } from "@/components/ui";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FactoryIntakeFormProps {
  brands: { id: string; name: string }[];
}

const initialState: ActionState = {
  success: false,
  error: null,
};

export const FactoryIntakeForm = ({ brands }: FactoryIntakeFormProps) => {
  const [state, formAction, isPending] = useActionState(
    createInventoryIntakeAction,
    initialState,
  );

  const formRef = useRef<HTMLFormElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  const brandOptions = [
    { value: "", label: "Select Brand" },
    ...brands.map((b) => ({ value: b.id, label: b.name })),
  ];

  return (
    <div
      className={cn(
        "rounded-xl transition-all duration-200 ease-in-out mb-20 mx-auto",
        "bg-white shadow-xs w-full 2xl:p-[clamp(1.5rem,3vw,2.5rem)]",
        isOpen
          ? "bg-white shadow-xs w-full p-[clamp(1.5rem,3vw,2.5rem)]"
          : "bg-transparent shadow-none w-full p-3",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-start justify-between w-full",
          isOpen && "mb-[clamp(1.5rem,3vw,2rem)]",
          "2xl:mb-[clamp(1.5rem,3vw,2rem)]",
        )}
      >
        <div className={cn( isOpen ? "block" : "hidden")}>
          <h2 className="text-[clamp(1.25rem,2vw,1.5rem)] font-bold text-[#111827] mb-1">
            Add Stock
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
          <div className="mb-5 rounded-lg bg-green-50 border border-green-200 px-4 py-3 flex items-center gap-2">
            <span className="text-green-600 font-semibold text-sm">
              ✓ Stock intake recorded successfully!
            </span>
          </div>
        )}

        {/* Form */}
        <form ref={formRef} action={formAction}>
          <div className="flex flex-col gap-[clamp(1rem,2vw,1.5rem)]">
            <Select
              id="brandId"
              name="brandId"
              label="Brand"
              options={brandOptions}
              required
              className="bg-[var(--color-secondary-bg)] text-[#1E293B] border-transparent focus:border-[var(--color-primary)] focus:bg-white"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                id="quantity"
                name="quantity"
                label="Total Quantity"
                type="number"
                placeholder="0"
                required
                min="1"
                className="bg-[var(--color-secondary-bg)] text-[#1E293B] border-transparent focus:border-[var(--color-primary)] focus:bg-white"
              />

              <Input
                id="unitPrice"
                name="unitPrice"
                label="Unit Price"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="bg-[var(--color-secondary-bg)] text-[#1E293B] border-transparent focus:border-[var(--color-primary)] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                id="vehicleNumber"
                name="vehicleNumber"
                label="Vehicle Number"
                type="text"
                placeholder="ABC-123"
                className="bg-[var(--color-secondary-bg)] text-[#1E293B] border-transparent focus:border-[var(--color-primary)] focus:bg-white"
              />

              <Input
                id="intakeDate"
                name="intakeDate"
                label="Date"
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                required
                className="bg-[var(--color-secondary-bg)] text-[#1E293B] border-transparent focus:border-[var(--color-primary)] focus:bg-white"
              />
            </div>

            <Textarea
              id="notes"
              name="notes"
              label="Notes"
              placeholder="Notes"
              className="bg-[var(--color-secondary-bg)] text-[#1E293B] border-transparent focus:border-[var(--color-primary)] focus:bg-white"
            />

            {/* Error Message */}
            {state.error && (
              <p className="text-[clamp(0.8rem,1vw,0.875rem)] text-red-500 font-medium font-bold">
                {state.error}
              </p>
            )}

            {/* Submit */}
            <Button type="submit" className="w-full mt-2" disabled={isPending}>
              {isPending ? "Loading..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
