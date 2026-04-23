import { ReactNode } from "react";
import { LayoutDashboard, Package, Truck, Banknote } from "lucide-react";
import { Sidebar } from "@/components/layouts";

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
  {
    label: "Payments",
    href: "/salesman/payments",
    icon: <Banknote size={18} />,
  },
];

export default function SalesmanDashboardLayout({
  children,
}: SalesmanDashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-(--color-page-bg)">
      <Sidebar items={salesmanNavItems} />

      <main className="flex-1 overflow-y-auto pb-10 bg-(--color-page-bg) md:pb-0 md:pl-14">
        <div className="max-w-400 mx-auto w-full">{children}</div>
      </main>
    </div>
  );
}
