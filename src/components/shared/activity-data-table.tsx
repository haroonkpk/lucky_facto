"use client";

import { useState } from "react";
import { DataTable, TableHeader, Modal, Button } from "@/components/ui";
import { ActivityDetailsModal } from "./activity-details-modal";
import { deleteActivityAction } from "@/actions/salesman.actions";
import { useRouter, useSearchParams } from "next/navigation";
import { Activity } from "@/types/activity";
import { formatPKR } from "@/lib/dashboard-utils";
import { Eye, Trash2, AlertTriangle } from "lucide-react";

interface ActivityDataTableProps {
  activities: Activity[];
  headers: TableHeader[];
  currentPage?: number;
  totalPages?: number;
  title?: string;
  showPagination?: boolean;
  showDelete?: boolean;
}

export function ActivityDataTable({
  activities,
  headers,
  currentPage = 1,
  totalPages = 1,
  title = "Recent Activity",
  showPagination = true,
  showDelete = false,
}: ActivityDataTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // New state for custom delete confirmation
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(
    null,
  );

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleViewDetails = (row: { id: string }) => {
    const activity = activities.find((a) => a.id === row.id);
    if (activity) {
      setSelectedActivity(activity);
      setIsModalOpen(true);
    }
  };

  const handleDeleteClick = (row: { id: string }) => {
    const activity = activities.find((a) => a.id === row.id);
    if (activity) {
      setActivityToDelete(activity);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!activityToDelete) return;

    setIsDeleting(true);
    try {
      const result = await deleteActivityAction(
        activityToDelete.id,
        activityToDelete.type,
      );
      if (result.success) {
        setIsDeleteModalOpen(false);
        setActivityToDelete(null);
      } else {
        alert(result.error || "Failed to delete the record.");
      }
    } catch (err) {
      console.error("Delete Error:", err);
      alert("An unexpected error occurred while deleting.");
    } finally {
      setIsDeleting(false);
    }
  };

  const tableData = activities.map((activity) => {
    const quantityDetail = activity.details.find(
      (d) =>
        d.label.toLowerCase().includes("quantity") ||
        d.label.toLowerCase().includes("bags"),
    );
    const targetDetail = activity.details.find(
      (d) =>
        d.label.toLowerCase().includes("shop") ||
        d.label.toLowerCase().includes("brand") ||
        d.label.toLowerCase().includes("method"),
    );

    return {
      id: activity.id,
      date: new Date(activity.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      title: activity.title,
      subtitle: targetDetail?.value?.toString() || activity.subtitle || "—",
      details: quantityDetail?.value?.toString() || "—",
      amount:
        activity.amount && activity.amount > 0
          ? formatPKR(activity.amount)
          : "—",
    };
  });

  return (
    <>
      <DataTable
        heading={title}
        TableHeaders={headers}
        TableData={tableData}
        currentPage={currentPage}
        totalPages={showPagination ? totalPages : 0}
        onPageChange={handlePageChange}
        HeaderBgColor="bg-[#E5F0F6]"
        BorderColor="border-blue-100"
        TableButtons={[
          {
            icon: <Eye size={18} />,
            text: "View Details",
            className: "text-(--color-primary)",
            onClick: handleViewDetails,
          },
          ...(showDelete
            ? [
                {
                  icon: <Trash2 size={18} />,
                  text: "Delete",
                  className: "text-red-500 hover:text-red-700",
                  onClick: handleDeleteClick,
                },
              ]
            : []),
        ]}
      />

      {/* View Details Modal */}
      <ActivityDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activity={selectedActivity}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        className="max-w-md"
      >
        <div className="flex flex-col gap-[clamp(1.25rem,3vw,2rem)]">
          <div className="flex items-center gap-[clamp(0.75rem,2vw,1.25rem)] text-red-600 bg-red-50 p-[clamp(0.75rem,2vw,1.25rem)] rounded-xl border border-red-100">
            <div className="bg-red-100 p-[clamp(0.4rem,1vw,0.6rem)] rounded-lg shrink-0">
              <AlertTriangle size={24} className="w-[clamp(20px,2vw,24px)] h-[clamp(20px,2vw,24px)]" />
            </div>
            <div>
              <h4 className="font-bold text-red-900 text-[clamp(0.9rem,1.2vw,1.1rem)]">Warning</h4>
              <p className="text-[clamp(0.75rem,1vw,0.875rem)] text-red-700 leading-snug">
                This action is permanent and will also revert ledger entries and
                balances.
              </p>
            </div>
          </div>

          <div className="space-y-[clamp(0.4rem,1vw,0.6rem)]">
            <p className="text-slate-600 text-[clamp(0.875rem,1.1vw,1rem)]">
              Are you sure you want to delete this{" "}
              <span className="font-bold text-slate-900 capitalize">
                {activityToDelete?.type}
              </span>{" "}
              entry?
            </p>
            {activityToDelete && (
              <div className="bg-slate-50 p-[clamp(0.75rem,2vw,1rem)] rounded-lg border border-slate-100">
                <p className="text-[clamp(0.875rem,1.1vw,1rem)] font-bold text-slate-900">
                  {activityToDelete.title}
                </p>
                <p className="text-[clamp(0.7rem,1vw,0.8rem)] text-slate-500 mt-1">
                  {activityToDelete.subtitle} •{" "}
                  {new Date(activityToDelete.date).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-[clamp(0.5rem,1.5vw,1rem)] pt-2">
            <Button
              variant="outline"
              className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50 text-[clamp(0.8rem,1vw,0.95rem)]"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white text-[clamp(0.8rem,1vw,0.95rem)]"
              onClick={confirmDelete}
              isLoading={isDeleting}
            >
              Delete Entry
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}


