"use client";

import { useActionState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import Input from "@/components/ui/input";
import Button from "../ui/button";
import {
  registerSalesmanAction,
  type RegisterSalesmanState,
} from "@/actions/auth";

const initialState: RegisterSalesmanState = { success: false, error: null };

export function RegisterSalesmanForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [state, formAction, isPending] = useActionState(
    registerSalesmanAction,
    initialState,
  );

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <div
      className={cn(
       "bg-white p-[clamp(1.5rem,3vw,2.5rem)] rounded-xl shadow-xs w-full md:w-[clamp(16rem,35vw,32rem)]  mx-auto",
        className,
      )}
      {...props}
    >
      {/* Header */}
      <div className="mb-[clamp(1.5rem,3vw,2rem)]">
        <h2 className="text-[clamp(1.25rem,2vw,1.5rem)] font-bold text-[#111827] mb-1">
          Register Salesman
        </h2>
        <p className="text-[#64748B] text-[clamp(0.875rem,1vw,1rem)]">
          Add a new salesman account to the team
        </p>
      </div>

      {/* Success Banner */}
      {state.success && (
        <div className="mb-5 rounded-lg bg-green-50 border border-green-200 px-4 py-3 flex items-center gap-2">
          <span className="text-green-600 font-semibold text-sm">
            ✓ Salesman registered successfully!
          </span>
        </div>
      )}

      {/* Form */}
      <form ref={formRef} action={formAction}>
        <div className="flex flex-col gap-[clamp(1rem,2vw,1.5rem)]">
          {/* Full Name */}
          <Input
            id="full-name"
            name="full-name"
            label="Full Name"
            type="text"
            placeholder="John Doe"
            required
            className="bg-[var(--color-secondary-bg)] text-[#1E293B] border-transparent focus:border-[var(--color-primary)] focus:bg-white"
          />

          {/* Email */}
          <Input
            id="email"
            name="email"
            label="Email"
            type="email"
            placeholder="salesman@example.com"
            required
            className="bg-[var(--color-secondary-bg)] text-[#1E293B] border-transparent focus:border-[var(--color-primary)] focus:bg-white"
          />

          {/* Temporary Password */}
          <Input
            id="password"
            name="password"
            label="Temporary Password"
            type="password"
            required
            placeholder="Min. 6 characters"
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
            {isPending ? "Registering..." : "Register Salesman"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export { RegisterSalesmanForm as SignUpForm };
