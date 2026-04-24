"use client";

import { useState } from "react";
import { DataTable, TableHeader } from "@/components/ui";
import { ActivityDetailsModal } from "./activity-details-modal";
import { useRouter, useSearchParams } from "next/navigation";
import { Activity } from "@/types/activity";
import { formatPKR } from "@/lib/dashboard-utils";
import { Eye } from "lucide-react";

interface ActivityDataTableProps {
  activities: Activity[];
  headers: TableHeader[];
  currentPage?: number;
  totalPages?: number;
  title?: string;
  showPagination?: boolean;
}

export function ActivityDataTable({
  activities,
  headers,
  currentPage = 1,
  totalPages = 1,
  title = "Recent Activity",
  showPagination = true,
}: ActivityDataTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        ]}
      />

      <ActivityDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activity={selectedActivity}
      />
    </>
  );
}
