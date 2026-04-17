import {
  getSalesmanSales,
  getSalesmanPendingPayments,
  getSalesmanLatestActivity,
  getInventoryBalances,
} from "@/actions/salesman.actions";

import DashboardHeader from "@/components/salesman/dashboard/dashboard-header";
import SalesCard from "@/components/salesman/dashboard/sales-card";
import PendingPaymentsCard from "@/components/salesman/dashboard/pending-payments-card";
import StockOverviewCard from "@/components/salesman/dashboard/stock-overview-card";
import LatestActivityList from "@/components/salesman/dashboard/latest-activity-list";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function SalesmanDashboardPage() {
 const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login"); 
  }

  const salesmanName = user.user_metadata?.full_name || user.email;

  const [sales, pendingPayments, activities, inventoryBalances] =
    await Promise.all([
      getSalesmanSales(user.id),
      getSalesmanPendingPayments(user.id),
      getSalesmanLatestActivity(user.id),
      getInventoryBalances(),
    ]);
  return (
    <div className="min-h-screen bg-(--color-page-bg) p-3 lg:p-10 md:pl-20!">
      <div
        className="max-w-4xl mx-auto flex flex-col mb-20"
        style={{ gap: "clamp(16px, 2.5vw, 24px)" }}
      >
        {/* Header */}
        <DashboardHeader salesmanName={salesmanName} />

        {/* Sales + Pending Payments*/}
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: "clamp(12px, 2vw, 20px)" }}
        >
          <SalesCard
            monthlySales={sales.monthlySales}
            todaySales={sales.todaySales}
          />
          <PendingPaymentsCard
            totalPending={pendingPayments.totalPending}
            shopCount={pendingPayments.shopCount}
          />
        </div>

        {/* Stock Overview */}
        <StockOverviewCard inventoryBalances={inventoryBalances} />

        {/* Latest Activity */}
        <LatestActivityList activities={activities} />
      </div>
    </div>
  );
}
