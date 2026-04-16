import { ReactNode } from "react";
import { LayoutDashboard, Users, Package, Truck } from "lucide-react";
import { Sidebar } from "@/components/layouts/sidebar";

interface SalesmanDashboardLayoutProps {
  children: ReactNode;
}

const salesmanNavItems = [
  {
    label: "Overview",
    href: "/salesman/dashboard",
    icon: <LayoutDashboard size={18} />,
    exact: true,
  },
  {
    label: "Factory Intake",
    href: "/salesman/factory-intake",
    icon: <Package size={18} />,
  },
  {
    label: "Distribution",
    href: "/salesman/distribution",
    icon: <Truck size={18} />,
  },
];

export default function SalesmanDashboardLayout({
  children,
}: SalesmanDashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar items={salesmanNavItems} />

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
