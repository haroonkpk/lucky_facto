import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "white" | "primary" | "pending" | "secondary";
  children: React.ReactNode;
}

export const Card = ({
  variant = "white",
  children,
  className,
  ...props
}: CardProps) => {
  const variantStyles = {
    white: "bg-white text-[#0A2540]",
    primary: "bg-[var(--color-primary)] text-white",
    pending: "bg-[var(--color-pending-bg)] text-[var(--color-pending)]",
    secondary: "bg-[var(--color-secondary-bg)] text-[#053B70]",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[clamp(8px,1vw,10px)] p-[clamp(1.25rem,2.5vw,2rem)]",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
