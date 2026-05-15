"use client";

import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Printer, Download } from "lucide-react";
import { Button } from "@/components/ui";

export interface PrintPdfButtonProps {
  headers: { key: string; label: string }[];
  data: any[];
  title: string;
  subtitle?: string;
  summary?: Record<string, string | number>;
  fileName?: string;
  variant?: "outline" | "primary" | "success" | "danger";
  iconOnly?: boolean;
}

export function PrintPdfButton({
  headers,
  data,
  title,
  subtitle,
  summary,
  fileName,
  variant = "outline",
  iconOnly = false,
}: PrintPdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = () => {
    try {
      setIsGenerating(true);
      const doc = new jsPDF();

      let currentY = 22;

      // Add Title
      doc.setFontSize(18);
      doc.text(title, 14, currentY);
      currentY += 8;

      if (subtitle) {
        doc.setFontSize(14);
        doc.setTextColor(50);
        doc.text(subtitle, 14, currentY);
        currentY += 8;
      }
      
      // Add Generated Date
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, currentY);
      currentY += 10;

      // Add Summary
      if (summary && Object.keys(summary).length > 0) {
        doc.setFontSize(11);
        doc.setTextColor(20);
        Object.entries(summary).forEach(([key, value]) => {
          doc.text(`${key}: ${value}`, 14, currentY);
          currentY += 6;
        });
        currentY += 4;
      }

      // Prepare Table Data
      const tableColumn = ["#", ...headers.map((h) => h.label)];
      const tableRows = data.map((row, index) => {
        const rowData = headers.map((h) => {
          const value = row[h.key];
          return value !== null && value !== undefined ? String(value) : "—";
        });
        return [index + 1, ...rowData];
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: currentY,
        theme: "grid",
        styles: {
          fontSize: 9,
          cellPadding: 4,
        },
        headStyles: {
          fillColor: [5, 59, 112],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 248, 250],
        },
      });

      const finalFileName = fileName ? `${fileName}.pdf` : `${title.replace(/\s+/g, "_").toLowerCase()}_${new Date().getTime()}.pdf`;
      
      doc.save(finalFileName);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (iconOnly) {
    return (
      <button
        onClick={generatePDF}
        disabled={isGenerating}
        className="p-2 text-gray-500 hover:text-(--color-primary) transition-colors rounded-md hover:bg-gray-100 disabled:opacity-50"
        title="Download PDF"
      >
        <Printer size={20} />
      </button>
    );
  }

  return (
    <Button
      variant={variant}
      onClick={generatePDF}
      isLoading={isGenerating}
      className="px-3 py-1.5 text-sm h-auto"
      icon={<Download size={16} />}
    >
      PDF
    </Button>
  );
}
