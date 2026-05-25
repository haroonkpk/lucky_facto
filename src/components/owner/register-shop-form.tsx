"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Input, Select, Textarea, Button } from "@/components/ui";
import {
  registerShopAction,
  type RegisterShopState,
} from "@/actions/owner.actions";
import { Plus, X } from "lucide-react";
import toast from "react-hot-toast";

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
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (state.success) {
      toast.success("Shop registered successfully!");
      formRef.current?.reset();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state.success, state.error]);

  const regionOptions = [
    { value: "", label: "Select Region" },
    ...regions.map((r) => ({ value: r.id, label: r.name })),
  ];

  return (
    <div
      className={cn(
        "rounded-xl transition-all duration-200 ease-in-out",
        "2xl:bg-white 2xl:shadow-xs 2xl:w-[440px] 2xl:p-[clamp(1.5rem,3vw,2.5rem)]",
        isOpen
          ? "bg-white shadow-xs w-full p-[clamp(1.5rem,3vw,2.5rem)]"
          : "bg-transparent shadow-none w-full p-3",
        className,
      )}
      {...props}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-start justify-between w-full",
          isOpen && "mb-[clamp(1.5rem,3vw,2rem)]",
          "2xl:mb-[clamp(1.5rem,3vw,2rem)]",
        )}
      >
        <div className={cn("2xl:block", isOpen ? "block" : "hidden")}>
          <h2 className="text-[clamp(1.25rem,2vw,1.5rem)] font-bold text-[#111827] mb-1">
            Add Shop
          </h2>
        </div>

        {/* Toggle button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            "2xl:hidden flex-shrink-0 w-16 h-12 rounded-md flex items-center justify-center ml-auto",
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
      <div className={cn("2xl:block", isOpen ? "block" : "hidden")}>
        <form ref={formRef} action={formAction}>
          <div className="flex flex-col gap-[clamp(1rem,2vw,1.5rem)]">
            <Input
              id="name"
              name="name"
              label="Shop Name"
              type="text"
              placeholder="e.g. Al-Noor Traders"
              required
              className="bg-[var(--color-secondary-bg)] text-[#1E293B] border-transparent focus:border-[var(--color-primary)] focus:bg-white"
            />
            <Select
              id="regionId"
              name="regionId"
              label="Region Selection"
              options={regionOptions}
              required
              className="bg-[var(--color-secondary-bg)] text-[#1E293B] border-transparent focus:border-[var(--color-primary)] focus:bg-white"
            />
            <Input
              id="phoneNumber"
              name="phoneNumber"
              label="Contact Information"
              type="text"
              placeholder="+92 3XX XXXXXXX"
              className="bg-[var(--color-secondary-bg)] text-[#1E293B] border-transparent focus:border-[var(--color-primary)] focus:bg-white"
            />
            <Textarea
              id="address"
              name="address"
              label="Physical Address"
              placeholder="Enter precise landmark-based address..."
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
