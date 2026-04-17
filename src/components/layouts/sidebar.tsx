"use client";

import { ReactNode, useState } from "react";
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
  primaryAction?: { label: string; href: string; icon: ReactNode };
  onLogout?: () => void;
}

export function Sidebar({
  brandName = "",
  brandTier = "",
  items,
}: SidebarProps) {
  const pathname = usePathname();
  const [hovered, setHovered] = useState(false);

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href);

  const expanded = hovered;

  return (
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        // MOBILE — bottom nav
        "fixed bottom-0 left-0 right-0 w-full z-50 bg-white border-t border-gray-200/80",
        // DESKTOP — left sidebar
        "md:fixed md:left-0 md:top-0 md:bottom-0 md:right-auto md:h-screen md:z-50",
        "md:bg-white md:border-r md:border-gray-200/80",
        "md:flex md:flex-col md:overflow-hidden",
        "md:transition-[width] md:duration-300 md:ease-in-out",
        expanded ? "md:w-[clamp(14rem,18vw,18rem)]" : "md:w-16",
      )}
    >
      {/* Brand */}
      <div className="hidden md:flex items-center h-16 border-b border-gray-200/50 overflow-hidden">
        <div
          className={cn(
            "flex items-center gap-3 px-4 transition-opacity duration-200 whitespace-nowrap",
            expanded ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
        >
          <div className="flex flex-col min-w-0">
            <p className="text-[clamp(1rem,1.25vw,1.125rem)] font-bold text-gray-900 truncate">
              {brandName}
            </p>
            {brandTier && (
              <p className="text-[0.65rem] text-gray-400 uppercase tracking-widest truncate">
                {brandTier}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav
        className={cn(
          // MOBILE
          "flex flex-row justify-around items-center px-2 py-2 mb-safe",
          // DESKTOP
          "md:flex-col md:justify-start md:flex-1 md:py-3 md:overflow-y-auto md:overflow-x-hidden md:space-y-0.5 md:px-2",
        )}
      >
        {items.map(({ label, href, icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center transition-all duration-200",
                // MOBILE
                "flex-col justify-center gap-1 min-w-14 py-2 px-1 rounded-xl",
                "text-[0.08rem] font-semibold uppercase tracking-wider",
                // DESKTOP
                "md:flex-row md:justify-start md:w-full md:rounded-lg md:px-3 md:py-2.5",
                "md:text-[clamp(0.875rem,1vw,0.95rem)] md:font-medium md:capitalize md:tracking-normal",
                active
                  ? "text-[var(--color-primary)]"
                  : "text-gray-400 hover:text-gray-900 md:text-gray-600 md:hover:bg-gray-100 md:hover:text-gray-900",
              )}
            >
              {/* Icon */}
              <span
                className={cn(
                  "flex-shrink-0 flex items-center justify-center",
                  "[&>svg]:w-5 [&>svg]:h-5",
                  active
                    ? "text-[var(--color-primary)]"
                    : "text-gray-400 group-hover:text-gray-700 md:text-gray-500 md:group-hover:text-gray-900",
                )}
              >
                {icon}
              </span>

              {/* Label mobile */}
              <span className="md:hidden text-[10px]">{label}</span>

              {/* Label desktop — slides in */}
              <span
                className={cn(
                  "hidden md:block overflow-hidden whitespace-nowrap",
                  "transition-[max-width,opacity,margin] duration-300 ease-in-out",
                  expanded
                    ? "max-w-[180px] opacity-100 ml-2.5"
                    : "max-w-0 opacity-0 ml-0",
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
