"use client";

import React from "react";
import { Card } from "./card";
import { cn } from "@/lib/utils";

export interface TableHeader {
  key: string;
  label: string;
}

interface TableButton<T> {
  icon: React.ReactNode;
  text: string;
  className: string;
  onClick: (row: T) => void;
}

interface DataTableProps<T extends { id: string }> {
  heading: string;
  variant?: "white" | "primary" | "pending" | "secondary";
  TableHeaders: TableHeader[];
  TableData: T[];
  TableButtons?: TableButton<T>[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  HeaderBgColor?: string;
  BorderColor?: string;
}

export const DataTable = <T extends { id: string }>({
  heading,
  variant = "white",
  TableHeaders,
  TableData,
  TableButtons,
  currentPage,
  totalPages,
  onPageChange,
  HeaderBgColor = "bg-[#FFE8D7]",
  BorderColor = "border-gray-200",
}: DataTableProps<T>) => {
  return (
    <Card variant={variant} className={cn("p-4", BorderColor)}>
      {/* Heading */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="truncate text-[clamp(17px,2vw,20px)] font-bold text-gray-800">
          {heading}
        </h2>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className={`w-full border-collapse border ${BorderColor}`}>
          <thead className={`${HeaderBgColor} font-bold text-gray-900`}>
            <tr>
              {TableHeaders.map((header) => (
                <th
                  key={header.key}
                  className={`border ${BorderColor} px-[clamp(12px,1.5vw,16px)] py-[clamp(10px,1vw,12px)] text-start text-[clamp(13px,1.2vw,14px)] font-bold whitespace-nowrap`}
                >
                  {header.label}
                </th>
              ))}
              {TableButtons?.length ? (
                <th
                  className={`border ${BorderColor} px-[clamp(12px,1.5vw,16px)] py-[clamp(10px,1vw,12px)] text-left text-[clamp(13px,1.2vw,14px)]`}
                >
                  Actions
                </th>
              ) : null}
            </tr>
          </thead>

          <tbody>
            {TableData.length > 0 ? (
              TableData.map((row) => (
                <tr
                  key={row.id}
                  className={`border ${BorderColor} hover:bg-gray-100 even:bg-gray-50`}
                >
                  {TableHeaders.map((header) => (
                    <td
                      key={`${row.id}-${header.key}`}
                      className={`border ${BorderColor} px-[clamp(12px,1.5vw,16px)] py-[clamp(10px,1vw,12px)] text-[clamp(13px,1.2vw,14px)]`}
                    >
                      {row[header.key as keyof T] as React.ReactNode}
                    </td>
                  ))}
                  {TableButtons?.length ? (
                    <td
                      className={`border ${BorderColor} px-[clamp(12px,1.5vw,16px)] py-[clamp(10px,1vw,12px)]`}
                    >
                      <div className="flex justify-center gap-2">
                        {TableButtons.map((button) => (
                          <button
                            key={button.text}
                            onClick={() => button.onClick(row)}
                            className={`${button.className} group relative rounded-md p-[clamp(6px,0.6vw,8px)] hover:opacity-80`}
                            title={button.text}
                          >
                            {button.icon}
                          </button>
                        ))}
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={TableHeaders.length + (TableButtons?.length ? 1 : 0)}
                  className="py-6 text-center text-[clamp(13px,1.2vw,14px)] text-gray-500"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className={`flex flex-col items-center justify-between gap-2 border-t ${BorderColor} bg-white p-3 sm:flex-row`}
        >
          <div className="text-[clamp(12px,1.1vw,13px)] text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className="mx-1 rounded-md bg-gray-100 px-[clamp(10px,1vw,12px)] py-[clamp(5px,0.5vw,6px)] text-[clamp(12px,1.1vw,13px)] font-medium text-gray-800 hover:bg-gray-200 disabled:opacity-50"
            >
              «
            </button>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="mx-1 rounded-md bg-gray-100 px-[clamp(10px,1vw,12px)] py-[clamp(5px,0.5vw,6px)] text-[clamp(12px,1.1vw,13px)] font-medium text-gray-800 hover:bg-gray-200 disabled:opacity-50"
            >
              ‹
            </button>
            <span className="mx-1 rounded-md bg-[#FF6A00] px-[clamp(10px,1vw,12px)] py-[clamp(5px,0.5vw,6px)] text-[clamp(12px,1.1vw,13px)] font-medium text-white">
              {currentPage}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="mx-1 rounded-md bg-gray-100 px-[clamp(10px,1vw,12px)] py-[clamp(5px,0.5vw,6px)] text-[clamp(12px,1.1vw,13px)] font-medium text-gray-800 hover:bg-gray-200 disabled:opacity-50"
            >
              ›
            </button>
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage >= totalPages}
              className="mx-1 rounded-md bg-gray-100 px-[clamp(10px,1vw,12px)] py-[clamp(5px,0.5vw,6px)] text-[clamp(12px,1.1vw,13px)] font-medium text-gray-800 hover:bg-gray-200 disabled:opacity-50"
            >
              »
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};
