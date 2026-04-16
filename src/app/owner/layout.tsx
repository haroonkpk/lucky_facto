import { ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  Store,
} from "lucide-react";
import { Sidebar } from "@/components/layouts/sidebar";
interface OwnerDashboardLayoutProps {
  children: ReactNode;
}

const ownerNavItems = [
  {
    label: "Overview",
    href: "/owner/dashboard",
    icon: <LayoutDashboard size={18} />,
    exact: true,
  },
  {
    label: "Salesmans",
    href: "/owner/salesman-management",
    icon: <Users size={18} />,
  },
  {
    label: "Shops",
    href: "/owner/shop-management",
    icon: <Store size={18} />,
  },
];

export default function OwnerDashboardLayout({
  children,
}: OwnerDashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
      brandName="helo"
      brandTier="helo"
        items={ownerNavItems}
      />

      <main className="flex-1 overflow-y-auto pb-10 md:pb-0 md:pl-14">{children}</main>
    </div>
  );
}
