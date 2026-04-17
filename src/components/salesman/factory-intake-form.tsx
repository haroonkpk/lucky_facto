"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  createInventoryIntakeAction,
  ActionState,
} from "@/actions/salesman.actions";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";

interface FactoryIntakeFormProps {
  brands: { id: string; name: string }[];
}

const initialState: ActionState = {
  success: false,
  error: null,
};

export default function FactoryIntakeForm({ brands }: FactoryIntakeFormProps) {
  const [state, formAction, isPending] = useActionState(
    createInventoryIntakeAction,
    initialState,
  );

  const formRef = useRef<HTMLFormElement>(null);

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
    <div className="bg-white p-[clamp(1.5rem,3vw,2.5rem)] rounded-xl shadow-xs w-full mb-20 mx-auto">
      {/* Header */}
      <div className="mb-[clamp(1.5rem,3vw,2rem)]">
        <h2 className="text-[clamp(1.25rem,2vw,1.5rem)] font-bold text-[#111827] mb-1">
          Stock Submission
        </h2>
        <p className="text-[#64748B] text-[clamp(0.875rem,1vw,1rem)]">
          Enter factory shipment details to synchronize physical inventory.
        </p>
      </div>

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
            label="Product Brand"
            options={brandOptions}
            required
            className="bg-[var(--color-secondary-bg)] text-[#1E293B] border-transparent focus:border-[var(--color-primary)] focus:bg-white"
          />

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
            id="intakeDate"
            name="intakeDate"
            label="Date of Intake"
            type="date"
            defaultValue={new Date().toISOString().split("T")[0]}
            required
            className="bg-[var(--color-secondary-bg)] text-[#1E293B] border-transparent focus:border-[var(--color-primary)] focus:bg-white"
          />

          <Textarea
            id="notes"
            name="notes"
            label="Inventory Notes"
            placeholder="Batch numbers, quality notes, etc..."
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
            {isPending ? "Recording Submission..." : "Complete Submission"}
          </Button>
        </div>
      </form>
    </div>
  );
}
