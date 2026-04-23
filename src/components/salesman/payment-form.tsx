"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createPaymentAction, ActionState } from "@/actions/salesman.actions";
import { Button, Input, Select, Textarea } from "@/components/ui";
import { PaymentType, PaymentMethod } from "@/lib/generated/prisma/enums";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentFormProps {
  shops: { id: string; name: string }[];
}

const initialState: ActionState = {
  success: false,
  error: null,
};

export const PaymentForm = ({ shops }: PaymentFormProps) => {
  const [state, formAction, isPending] = useActionState(
    createPaymentAction,
    initialState
  );

  const formRef = useRef<HTMLFormElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  const shopOptions = [
    { value: "", label: "Select Shop (Optional)" },
    ...shops.map((s) => ({ value: s.id, label: s.name })),
  ];

  const typeOptions = [
    { value: PaymentType.SHOP_COLLECTION, label: "Shop Collection" },
    { value: PaymentType.FACTORY_PAYMENT, label: "Factory Payment" },
  ];

  const methodOptions = [
    { value: PaymentMethod.CASH, label: "Cash" },
    { value: PaymentMethod.BANK_TRANSFER, label: "Bank Transfer" },
    { value: PaymentMethod.CHEQUE, label: "Cheque" },
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
          "flex items-start justify-between w-full border-slate-100",
          isOpen ? "mb-[clamp(1.5rem,3vw,2rem)] border-b pb-5" : "border-b-0 pb-0",
          "2xl:mb-[clamp(1.5rem,3vw,2rem)] 2xl:border-b 2xl:pb-5",
        )}
      >
        <div className={cn( isOpen ? "block" : "hidden")}>
          <h2 className="text-[clamp(1.25rem,2vw,1.5rem)] font-bold text-[#111827] mb-1">
            Record Payment
          </h2>
          <p className="text-[#64748B] text-[clamp(0.875rem,1vw,1rem)]">
            Log financial transactions and update client ledgers instantly.
          </p>
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
            ✓ Payment recorded and balances synchronized.
          </span>
        </div>
      )}

      {/* Form */}
      <form ref={formRef} action={formAction}>
        <div className="flex flex-col gap-[clamp(1rem,2vw,1.5rem)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              id="type"
              name="type"
              label="Payment Category"
              options={typeOptions}
              required
              className="bg-[var(--color-secondary-bg)] border-transparent focus:border-[var(--color-primary)]"
            />
            <Select
              id="shopId"
              name="shopId"
              label="Assigned Shop"
              options={shopOptions}
              className="bg-[var(--color-secondary-bg)] border-transparent focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              id="paymentMethod"
              name="paymentMethod"
              label="Transaction Method"
              options={methodOptions}
              required
              className="bg-[var(--color-secondary-bg)] border-transparent focus:border-[var(--color-primary)]"
            />
            <Input
              id="amount"
              name="amount"
              label="Amount (PKR)"
              type="number"
              step="0.01"
              placeholder="0.00"
              required
              className="bg-[var(--color-secondary-bg)] border-transparent focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              id="paymentDate"
              name="paymentDate"
              label="Transaction Date"
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
              required
              className="bg-[var(--color-secondary-bg)] border-transparent focus:border-[var(--color-primary)]"
            />
          </div>

          <Textarea
            id="cashNote"
            name="cashNote"
            label="Additional Remarks"
            placeholder="Reference numbers, cheque details, or other notes..."
            className="bg-[var(--color-secondary-bg)] border-transparent focus:border-[var(--color-primary)]"
          />

          {/* Error Message */}
          {state.error && (
            <p className="text-[clamp(0.8rem,1vw,0.875rem)] text-red-500 font-bold">
              {state.error}
            </p>
          )}

          {/* Submit */}
          <Button type="submit" className="w-full mt-4 h-12" disabled={isPending}>
            {isPending ? "Recording Transaction..." : "Submit Payment Entry"}
          </Button>
        </div>
      </form>
      </div>
    </div>
  );
}
