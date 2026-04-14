"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  exact?: boolean;
}

export interface SidebarProps {
  brandName?: string;
  brandTier?: string;
  items: NavItem[];
  primaryAction?: {
    label: string;
    href: string;
    icon: ReactNode;
  };
  onLogout?: () => void;
}

export function Sidebar({
  brandName = "",
  brandTier = "",
  items,
}: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        // MOBILE
        "fixed bottom-0 left-0 right-0 w-full z-50 bg-white border-t border-gray-200/80 shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.05)]",
        // DESKTOP
        "md:static md:flex md:flex-col md:h-screen md:w-[clamp(14rem,18vw,18rem)] md:border-t-0 md:border-r md:shadow-none transition-all duration-300 ease-in-out shrink-0",
      )}
    >
      {/* Brand Section */}
      <div className="hidden md:block px-[clamp(1.25rem,2vw,1.5rem)] py-[clamp(1.25rem,2vw,1.5rem)] border-b border-gray-200/50 mt-12 md:mt-0">
        <p className="text-[clamp(1rem,1.25vw,1.125rem)] font-bold tracking-wide text-gray-900">
          {brandName}
        </p>
        {brandTier && (
          <p className="text-[clamp(0.6rem,0.8vw,0.7rem)] text-gray-500 mt-0.5 uppercase tracking-widest">
            {brandTier}
          </p>
        )}
      </div>

      {/* Navigation Links */}
      <nav
        className={cn(
          // MOBILE
          "flex flex-row justify-around items-center px-[clamp(0.25rem,1vw,0.5rem)] py-[clamp(0.25rem,1vw,0.5rem)] mb-safe",
          // DESKTOP
          "md:flex-col md:justify-start md:items-stretch md:flex-1 md:px-[clamp(0.5rem,1vw,0.75rem)] md:py-[clamp(1rem,1.5vw,1.25rem)] md:space-y-1 md:overflow-y-auto",
        )}
      >
        {items.map(({ label, href, icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex transition-all duration-200",
                // MOBILE 
                "flex-col items-center justify-center gap-[clamp(0.15rem,1vw,0.25rem)] min-w-[clamp(3.5rem,15vw,4.5rem)] py-[clamp(0.35rem,1.5vw,0.5rem)] px-1 rounded-xl text-[clamp(0.55rem,2.5vw,0.625rem)] font-semibold uppercase tracking-wider",
                // DESKTOP
                "md:flex-row md:justify-start md:w-full md:gap-[clamp(0.5rem,1vw,0.75rem)] md:px-[clamp(0.75rem,1vw,1rem)] md:py-[clamp(0.5rem,0.8vw,0.75rem)] md:rounded-lg md:text-[clamp(0.875rem,1vw,0.95rem)] md:font-medium md:capitalize md:tracking-normal",
                // Active State Colors
                active
                  ? "bg-blue-50 md:bg-[var(--color-secondary-bg)] text-[var(--color-primary)]"
                  : "text-gray-400 hover:text-gray-900 md:text-gray-600 md:hover:bg-gray-100 md:hover:text-gray-900",
              )}
            >
              <span
                className={cn(
                  "flex-shrink-0 flex items-center justify-center transition-transform",
                  // MOBILE
                  "[&>svg]:w-[clamp(1.15rem,5vw,1.5rem)] [&>svg]:h-[clamp(1.15rem,5vw,1.5rem)] md:[&>svg]:w-6 md:[&>svg]:h-6",
                  active
                    ? "text-[var(--color-primary)] scale-110 md:scale-100"
                    : "text-gray-400 group-hover:text-gray-600 md:text-gray-500 md:group-hover:text-gray-900",
                )}
              >
                {icon}
              </span>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
