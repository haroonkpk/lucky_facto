"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createPaymentAction, ActionState } from "@/actions/salesman.actions";
import { Button, Input, Select, Textarea, Card } from "@/components/ui";
import { PaymentType, PaymentMethod } from "@/lib/generated/prisma/enums";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface PaymentFormProps {
  shops: any[];
  brands: { id: string; name: string }[];
  regions: { id: string; name: string }[];
}

const initialState: ActionState = {
  success: false,
  error: null,
};

export const PaymentForm = ({ shops, brands, regions }: PaymentFormProps) => {
  const [state, formAction, isPending] = useActionState(
    createPaymentAction,
    initialState,
  );

  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>(
    PaymentType.SHOP_COLLECTION,
  );

  const [selectedRegion, setSelectedRegion] = useState<string>(
    regions[0]?.id || "",
  );
  const [selectedShop, setSelectedShop] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");

  useEffect(() => {
    if (state.success) {
      toast.success("Payment recorded and balances synchronized.");
      formRef.current?.reset();
      Promise.resolve().then(() => {
        setImagePreview(null);
        setSelectedType(PaymentType.SHOP_COLLECTION);
        setSelectedShop("");
        setSelectedBrand("");
        setSelectedRegion(regions[0]?.id || "");
      });
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state.success, state.error, regions]);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedType(val);
    if (val === PaymentType.FACTORY_PAYMENT) {
      setSelectedShop("");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const filteredShops = shops.filter((s) => s.regionId === selectedRegion);

  const regionOptions = regions.map((r) => ({ value: r.id, label: r.name }));

  const shopOptions = [
    { value: "", label: "Select Shop" },
    ...filteredShops.map((s) => ({ value: s.id, label: s.name })),
  ];

  const brandOptions = [
    { value: "", label: "Select Brand" },
    ...brands.map((b) => ({ value: b.id, label: b.name })),
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
    <Card
      variant="white"
      className={cn(
        "transition-all duration-200 ease-in-out mb-20 mx-auto",
        "shadow-xs w-full 2xl:p-[clamp(1.5rem,3vw,2.5rem)]",
        isOpen
          ? "shadow-xs w-full p-[clamp(1.5rem,3vw,2.5rem)]"
          : "bg-transparent shadow-none w-full p-3 border-none",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-start justify-between w-full border-slate-100",
          isOpen
            ? "mb-[clamp(1.5rem,3vw,2rem)] border-b pb-5"
            : "border-b-0 pb-0",
          "2xl:mb-[clamp(1.5rem,3vw,2rem)] 2xl:border-b 2xl:pb-5",
        )}
      >
        <div className={cn(isOpen ? "block" : "hidden")}>
          <h2 className="text-[clamp(1.25rem,2vw,1.5rem)] font-bold text-[#111827] mb-1">
            Add Payment
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
      <div className={cn(isOpen ? "block" : "hidden")}>
        {/* Form */}
        <form ref={formRef} action={formAction}>
          <div className="flex flex-col gap-[clamp(1rem,2vw,1.5rem)]">
            <div className="grid grid-cols-2 gap-4">
              <Select
                id="type"
                name="type"
                label="Payment Category"
                options={typeOptions}
                value={selectedType}
                onChange={handleTypeChange}
                required
                className="bg-[var(--color-secondary-bg)] border-transparent focus:border-[var(--color-primary)]"
              />
              <Select
                id="brandId"
                name="brandId"
                label="Brand"
                options={brandOptions}
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="bg-[var(--color-secondary-bg)] border-transparent focus:border-[var(--color-primary)]"
              />
            </div>

            {selectedType === PaymentType.SHOP_COLLECTION && (
              <div className="grid grid-cols-2 gap-4">
                <Select
                  id="regionId"
                  name="regionId"
                  label="Region"
                  options={regionOptions}
                  value={selectedRegion}
                  onChange={(e) => {
                    setSelectedRegion(e.target.value);
                    setSelectedShop(""); // Reset shop when region changes
                  }}
                  required
                  className="bg-[var(--color-secondary-bg)] border-transparent focus:border-[var(--color-primary)]"
                />
                <Select
                  id="shopId"
                  name="shopId"
                  label="Shop"
                  options={shopOptions}
                  value={selectedShop}
                  onChange={(e) => setSelectedShop(e.target.value)}
                  required={selectedType === PaymentType.SHOP_COLLECTION}
                  className="bg-[var(--color-secondary-bg)] border-transparent focus:border-[var(--color-primary)]"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Select
                id="paymentMethod"
                name="paymentMethod"
                label="Method"
                options={methodOptions}
                required
                className="bg-[var(--color-secondary-bg)] border-transparent focus:border-[var(--color-primary)]"
              />
              <Input
                id="paymentDate"
                name="paymentDate"
                label="Date"
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                required
                className="bg-[var(--color-secondary-bg)] border-transparent focus:border-[var(--color-primary)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                id="amount"
                name="amount"
                label="Amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                required
                className="bg-[var(--color-secondary-bg)] border-transparent focus:border-[var(--color-primary)]"
              />
              <div className="flex flex-col gap-2">
                {imagePreview && (
                  // ── Preview State
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#374151]">
                      Receipt Image
                    </label>
                    <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-200">
                      <img
                        src={imagePreview}
                        alt="Receipt preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 text-red-500 p-1.5 "
                        aria-label="Remove image"
                      >
                        <X size={18} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                )}
                <div className={imagePreview ? "hidden" : "block"}>
                  {/* ── Upload State */}
                  <Input
                    ref={fileInputRef}
                    id="receipt"
                    name="receipt"
                    label="Receipt Image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={cn(
                      "bg-[var(--color-secondary-bg)] border-transparent focus:border-[var(--color-primary)]",
                      "file:mr-3 file:py-1.5 file:px-4",
                      "file:rounded-sm file:border-0",
                      "file:text-sm file:font-medium",
                      "file:bg-[var(--color-primary)] file:text-white",
                      "file:cursor-pointer hover:file:opacity-90",
                      "file:transition-opacity",
                      "text-slate-400 text-sm",
                    )}
                  />
                </div>
              </div>
            </div>

            <Textarea
              id="cashNote"
              name="cashNote"
              label="Additional Remarks"
              placeholder="Reference numbers, cheque details, or other notes..."
              className="bg-[var(--color-secondary-bg)] border-transparent focus:border-[var(--color-primary)]"
            />

            {/* Submit */}
            <Button
              type="submit"
              className="w-full mt-4 h-12"
              disabled={isPending}
            >
              {isPending ? "Loading..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};
