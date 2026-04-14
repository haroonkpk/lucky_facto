import { ReactNode } from "react";
import { LayoutDashboard, Users } from "lucide-react";
import { Sidebar } from "@/components/layouts/sidebar";

interface OwnerDashboardLayoutProps {
  children: ReactNode;
}

const ownerNavItems = [
  {
    label: "Overview",
    href: "/salesman-dashboard",
    icon: <LayoutDashboard size={18} />,
    exact: true,
  },
  {
    label: "dummy",
    href: "/stock",
    icon: <Users size={18} />,
  },
];

export default function OwnerDashboardLayout({
  children,
}: OwnerDashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar items={ownerNavItems} />

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
