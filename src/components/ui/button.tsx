import React, { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "success" | "danger" | "outline";
  icon?: ReactNode;
  children?: ReactNode;
  isLoading?: boolean;
}

export const Button = ({
  variant = "primary",
  icon,
  children,
  className = "",
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 outline-none
    hover:opacity-90 active:scale-95
    text-[clamp(0.875rem,1vw+0.5rem,1rem)]
    px-[clamp(1rem,2.5vw,1.5rem)]
    py-[clamp(0.6rem,1.5vw,0.875rem)]
    gap-[clamp(0.4rem,1vw,0.75rem)]
  `;

  const variants = {
    primary:
      "bg-[var(--color-primary)] text-[var(--color-white)] focus:ring-[var(--color-primary)]",
    success:
      "bg-[var(--color-success-bg)] text-[var(--color-success-text)] focus:ring-[var(--color-success-bg)]",
    danger: "bg-red-600 text-white focus:ring-red-500",
    outline: "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={20} />
      ) : (
        icon && (
          <span className="flex-shrink-0 flex items-center">{icon}</span>
        )
      )}
      {children && <span>{children}</span>}
    </button>
  );
};