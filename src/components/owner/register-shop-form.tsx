"use client";

import { useActionState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import Button from "@/components/ui/button";
import {
  registerShopAction,
  type RegisterShopState,
} from "@/actions/owner.actions";

const initialState: RegisterShopState = { success: false, error: null };

interface RegisterShopFormProps extends React.ComponentPropsWithoutRef<"div"> {
  regions: { id: string; name: string }[];
}

export function RegisterShopForm({
  regions,
  className,
  ...props
}: RegisterShopFormProps) {
  const [state, formAction, isPending] = useActionState(
    registerShopAction,
    initialState,
  );

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  const regionOptions = [
    { value: "", label: "Select Region" },
    ...regions.map((r) => ({ value: r.id, label: r.name })),
  ];

  return (
    <div
      className={cn(
        "bg-white p-[clamp(1.5rem,3vw,2.5rem)] rounded-xl shadow-xs w-full mx-auto",
        className,
      )}
      {...props}
    >
      {/* Header */}
      <div className="mb-[clamp(1.5rem,3vw,2rem)]">
        <h2 className="text-[clamp(1.25rem,2vw,1.5rem)] font-bold text-[#111827] mb-1">
          Register Shop
        </h2>
        <p className="text-[#64748B] text-[clamp(0.875rem,1vw,1rem)]">
          Add a new commercial client to the regional distribution ledger.
        </p>
      </div>

      {/* Success Banner */}
      {state.success && (
        <div className="mb-5 rounded-lg bg-green-50 border border-green-200 px-4 py-3 flex items-center gap-2">
          <span className="text-green-600 font-semibold text-sm">
            ✓ Shop registered successfully!
          </span>
        </div>
      )}

      {/* Form */}
      <form ref={formRef} action={formAction}>
        <div className="flex flex-col gap-[clamp(1rem,2vw,1.5rem)]">
          {/* Shop Name */}
          <Input
            id="name"
            name="name"
            label="Shop Name"
            type="text"
            placeholder="e.g. Al-Noor Traders"
            required
            className="bg-[var(--color-secondary-bg)] text-[#1E293B] border-transparent focus:border-[var(--color-primary)] focus:bg-white"
          />

          {/* Region */}
          <Select
            id="regionId"
            name="regionId"
            label="Region Selection"
            options={regionOptions}
            required
            className="bg-[var(--color-secondary-bg)] text-[#1E293B] border-transparent focus:border-[var(--color-primary)] focus:bg-white"
          />

          {/* Contact Information */}
          <Input
            id="phoneNumber"
            name="phoneNumber"
            label="Contact Information"
            type="text"
            placeholder="+92 3XX XXXXXXX"
            className="bg-[var(--color-secondary-bg)] text-[#1E293B] border-transparent focus:border-[var(--color-primary)] focus:bg-white"
          />

          {/* Address */}
          <Textarea
            id="address"
            name="address"
            label="Physical Address"
            placeholder="Enter precise landmark-based address..."
            className="bg-[var(--color-secondary-bg)] text-[#1E293B] border-transparent focus:border-[var(--color-primary)] focus:bg-white"
          />

          {/* Error Message */}
          {state.error && (
            <p className="text-[clamp(0.8rem,1vw,0.875rem)] text-red-500 font-medium">
              {state.error}
            </p>
          )}

          {/* Submit */}
          <Button type="submit" className="w-full mt-2" disabled={isPending}>
            {isPending ? "Registering..." : "Confirm Registration"}
          </Button>
        </div>
      </form>
    </div>
  );
}
