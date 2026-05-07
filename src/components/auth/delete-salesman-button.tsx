"use client";

import { deleteSalesmanAction } from "@/actions/auth";
import { Trash2, AlertTriangle } from "lucide-react";
import { useState, useTransition } from "react";
import { Modal, Button } from "@/components/ui";

export function DeleteSalesmanButton({ userId, userName }: { userId: string, userName: string }) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteSalesmanAction(userId);
      if (result.success) {
        setIsModalOpen(false);
      } else {
        alert(result.error || "Failed to delete salesman");
        setIsModalOpen(false);
      }
    });
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsModalOpen(true)}
        title="Delete salesman"
        icon={<Trash2 size={18} className="text-red-500" />}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Deletion"
        className="max-w-md"
      >
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <AlertTriangle className="text-red-600" size={24} />
          </div>
          
          <h4 className="text-lg font-bold text-center text-slate-900 mb-2">
            Delete Salesman?
          </h4>
          <p className="text-center text-slate-500 mb-6">
            Are you sure you want to delete <span className="font-bold text-slate-900">{userName}</span>? This action cannot be undone if they have no records.
          </p>

          <div className="flex gap-3 mt-8">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={handleDelete}
              isLoading={isPending}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
