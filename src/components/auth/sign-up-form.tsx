"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Input, Button } from "@/components/ui";
import {
  registerSalesmanAction,
  type RegisterSalesmanState,
} from "@/actions/auth";
import { Plus, X } from "lucide-react";
import toast from "react-hot-toast";

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
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (state.success) {
      toast.success("Salesman registered successfully!");
      formRef.current?.reset();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state.success, state.error]);

  return (
    <div
      className={cn(
        "rounded-xl transition-all duration-200 ease-in-out",
        "xl:bg-white xl:shadow-xs xl:w-[440px] xl:p-[clamp(1.5rem,3vw,2.5rem)]",
        isOpen
          ? "bg-white shadow-xs p-[clamp(1.5rem,3vw,2.5rem)] w-full md:w-[440px]"
          : "bg-transparent shadow-none w-full p-3 md:w-auto",
        className,
      )}
      {...props}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-start justify-between w-full",
          isOpen && "mb-[clamp(1.5rem,3vw,2rem)]",
          "xl:mb-[clamp(1.5rem,3vw,2rem)]",
        )}
      >
        {/* Title */}
        <div className={cn("xl:block", isOpen ? "block" : "hidden")}>
          <h2 className="text-[clamp(1.25rem,2vw,1.5rem)] font-bold text-[#111827] mb-1">
            Add Salesman
          </h2>
        </div>

        {/* Toggle button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            "xl:hidden flex-shrink-0 w-16 h-12 rounded-md flex items-center justify-center ml-auto",
            "transition-colors duration-150 ease-in-out",
            isOpen
              ? "text-(--color-primary) bg-transparent"
              : "bg-(--color-primary) text-white",
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
      <div className={cn("xl:block", isOpen ? "block" : "hidden")}>
        <form ref={formRef} action={formAction}>
          <div className="flex flex-col gap-[clamp(1rem,2vw,1.5rem)]">
            <Input
              id="full-name"
              name="full-name"
              label="Full Name"
              type="text"
              placeholder="John Doe"
              required
              className="bg-[var(--color-secondary-bg)] text-[#1E293B] border-transparent focus:border-[var(--color-primary)] focus:bg-white"
            />

            <Input
              id="email"
              name="email"
              label="Email"
              type="email"
              placeholder="salesman@example.com"
              required
              className="bg-[var(--color-secondary-bg)] text-[#1E293B] border-transparent focus:border-[var(--color-primary)] focus:bg-white"
            />

            <Input
              id="password"
              name="password"
              label="Password"
              type="password"
              required
              placeholder="Min. 6 characters"
              className="bg-[var(--color-secondary-bg)] text-[#1E293B] border-transparent focus:border-[var(--color-primary)] focus:bg-white"
            />

            <Button type="submit" className="w-full mt-2" disabled={isPending}>
              {isPending ? "Loading..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { RegisterSalesmanForm as SignUpForm };
