"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "./card";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  showHeader = true,
}: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-[clamp(1rem,3vw,2rem)]">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/50 transition-opacity"
        onClick={onClose}
      />

      <Card
        variant="white"
        className={cn(
          "relative w-full transform overflow-hidden transition-all",
          className,
        )}
      >
        {/* Header */}
        {showHeader && (
          <div className="flex items-center justify-between border-b border-slate-100 py-[clamp(1rem,2vw,1.5rem)]">
            <h3 className="text-[clamp(1.1rem,1.5vw,1.25rem)] font-bold text-slate-900">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="w-[clamp(18px,2vw,22px)] h-[clamp(18px,2vw,22px)]" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="overflow-y-auto">{children}</div>
      </Card>
    </div>
  );
}
