"use client";

import { useActionState, useEffect, useRef, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Input, Button, DataTable, Modal, Card } from "@/components/ui";
import {
  createBrandAction,
  updateBrandAction,
  deleteBrandAction,
  type BrandState,
} from "@/actions/owner.actions";
import { Tag, Edit2, Trash2, Plus, X } from "lucide-react";
import toast from "react-hot-toast";

const initialFormState: BrandState = { success: false, error: null };

interface Brand {
  id: string;
  name: string;
  isActive: boolean;
  pricePerTon: number | null;
  pricePerBag: number | null;
  defaultUnit: string | null;
  createdAt: Date;
}

interface BrandManagementClientProps {
  initialBrands: Brand[];
}

export function BrandManagementClient({ initialBrands }: BrandManagementClientProps) {
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Server Action States
  const [createState, createAction, isCreatePending] = useActionState(
    createBrandAction,
    initialFormState,
  );

  const [updateState, updateAction, isUpdatePending] = useActionState(
    updateBrandAction,
    initialFormState,
  );

  const addFormRef = useRef<HTMLFormElement>(null);
  const editFormRef = useRef<HTMLFormElement>(null);

  // Handle create response
  useEffect(() => {
    if (createState.success) {
      toast.success("Brand added successfully!");
      addFormRef.current?.reset();
      setIsOpen(false);
    } else if (createState.error) {
      toast.error(createState.error);
    }
  }, [createState]);

  // Handle update response
  useEffect(() => {
    if (updateState.success) {
      toast.success("Brand updated successfully!");
      setSelectedBrand(null);
      setIsModalOpen(false);
      editFormRef.current?.reset();
    } else if (updateState.error) {
      toast.error(updateState.error);
    }
  }, [updateState]);

  // Handle edit click
  const handleEditClick = (brand: Brand) => {
    setSelectedBrand(brand);
    setIsModalOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = async (brandId: string) => {
    if (confirm("Are you sure you want to delete this brand?")) {
      const loadingToast = toast.loading("Deleting brand...");
      try {
        const result = await deleteBrandAction(brandId);
        toast.dismiss(loadingToast);
        if (result.success) {
          toast.success("Brand deleted successfully!");
        } else {
          toast.error(result.error || "Failed to delete brand.");
        }
      } catch (err) {
        toast.dismiss(loadingToast);
        toast.error("An error occurred while deleting the brand.");
      }
    }
  };

  // Format table data for project DataTable
  const tableData = useMemo(() => {
    return initialBrands.map((b) => ({
      id: b.id,
      name: b.name,
      pricePerTonFormatted: b.pricePerTon
        ? `Rs. ${Number(b.pricePerTon).toLocaleString("en-PK", { minimumFractionDigits: 2 })}`
        : "Not Configured",
      pricePerBagFormatted: b.pricePerBag
        ? `Rs. ${Number(b.pricePerBag).toLocaleString("en-PK", { minimumFractionDigits: 2 })}`
        : "Not Configured",
    }));
  }, [initialBrands]);

  const tableHeaders = [
    { key: "name", label: "Brand Name" },
    { key: "pricePerTonFormatted", label: "Price Per Ton" },
    { key: "pricePerBagFormatted", label: "Price Per Bag" },
  ];

  const tableButtons = [
    {
      icon: <Edit2 size={18} />,
      text: "Edit",
      className: "text-(--color-primary)",
      onClick: (row: { id: string }) => {
        const brand = initialBrands.find((b) => b.id === row.id);
        if (brand) handleEditClick(brand);
      },
    },
    {
      icon: <Trash2 size={18} />,
      text: "Delete",
      className: "text-red-500 hover:text-red-700",
      onClick: (row: { id: string }) => {
        handleDeleteClick(row.id);
      },
    },
  ];

  return (
    <div className="flex flex-col-reverse xl:flex-row sm:gap-8 items-start w-full">
      <div className="flex-1 w-full lg:min-w-2xl">
        <Card variant="secondary" className="flex flex-col gap-6">
          <div className="px-1">
            <h2 className="text-[#053B70] font-bold text-xl">Registered Brands</h2>
          </div>
          <div className="flex flex-col gap-4">
            <DataTable
              heading="Brands List"
              variant="white"
              TableHeaders={tableHeaders}
              TableData={tableData}
              TableButtons={tableButtons}
              currentPage={1}
              totalPages={1}
              onPageChange={() => {}}
              HeaderBgColor="bg-[#E5F0F6]"
              BorderColor="border-blue-100"
            />
          </div>
        </Card>
      </div>

      {/* ── RIGHT: Add Brand Expandable Form ── */}
      <div className="w-full xl:w-fit">
        <div
          className={cn(
            "rounded-xl transition-all duration-200 ease-in-out mb-2 mx-auto",
            "xl:bg-white xl:shadow-xs xl:w-[440px] xl:p-[clamp(1.5rem,3vw,2.5rem)]",
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
              "xl:mb-[clamp(1.5rem,3vw,2rem)]",
            )}
          >
            <div className={cn("xl:block", isOpen ? "block" : "hidden")}>
              <h2 className="text-[clamp(1.25rem,2vw,1.5rem)] font-bold text-[#111827] mb-1">
                Add Brand
              </h2>
            </div>

            {/* Toggle button */}
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className={cn(
                "xl:hidden flex-shrink-0 w-16 h-12 rounded-md flex items-center justify-center ml-auto",
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
          <div className={cn("xl:block", isOpen ? "block" : "hidden")}>
            <form ref={addFormRef} action={createAction}>
              <div className="flex flex-col gap-[clamp(1rem,2vw,1.5rem)]">
                <Input
                  id="name"
                  name="name"
                  label="Brand Name"
                  type="text"
                  placeholder="e.g. Lucky Cement"
                  required
                />

                <Input
                  id="pricePerTon"
                  name="pricePerTon"
                  label="Price Per Ton "
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  required
                />

                <Input
                  id="pricePerBag"
                  name="pricePerBag"
                  label="Price Per Bag "
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  required
                />

                <Button
                  type="submit"
                  className="w-full mt-2"
                  disabled={isCreatePending}
                >
                  {isCreatePending ? "Creating..." : "Create Brand"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ── REUSABLE MODAL: Edit Brand Form ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Brand Predefined Price"
        className="max-w-[480px]"
      >
        <div className="flex flex-col gap-[clamp(1.25rem,3vw,2rem)] ">
          {selectedBrand && (
            <form ref={editFormRef} action={updateAction}>
              <input type="hidden" name="id" value={selectedBrand.id} />
              
              <input type="hidden" name="defaultUnit" value="BAGS" />
              <input type="hidden" name="isActive" value="true" />

              <div className="flex flex-col gap-[clamp(1rem,2vw,1.5rem)]">
                <Input
                  id="edit-name"
                  name="name"
                  label="Brand Name"
                  type="text"
                  placeholder="e.g. Lucky Cement"
                  required
                  defaultValue={selectedBrand.name}
                />

                <Input
                  id="edit-pricePerTon"
                  name="pricePerTon"
                  label="Price Per Ton "
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  required
                  defaultValue={selectedBrand.pricePerTon !== null ? selectedBrand.pricePerTon.toString() : ""}
                />

                <Input
                  id="edit-pricePerBag"
                  name="pricePerBag"
                  label="Price Per Bag "
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  required
                  defaultValue={selectedBrand.pricePerBag !== null ? selectedBrand.pricePerBag.toString() : ""}
                />

                <div className="flex gap-[clamp(0.5rem,1.5vw,1rem)] pt-2">
                  <Button
                    type="submit"
                    disabled={isUpdatePending}
                    className="w-full"
                  >
                    {isUpdatePending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
}
