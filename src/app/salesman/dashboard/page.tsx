import {
  getInventoryBalances,
} from "@/actions/salesman.actions";
import {
  getSalesmanSales,
  getSalesmanPendingPayments,
  getSalesmanLatestActivity,
} from "@/actions/salesmanDashboard.actions";

import { DashboardHeader, SalesCard, PendingPaymentsCard, DetailedPendingPayments, StockOverviewCard } from "@/components/salesman/dashboard";
import { ActivityList } from "@/components/shared";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const revalidate = 60;

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

        {/* Sales + Pending Payments Summary */}
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

        {/* Detailed Pending Payments */}
        {pendingPayments.shops?.length > 0 && (
          <DetailedPendingPayments shops={pendingPayments.shops} />
        )}

        {/* Latest Activity */}
        <ActivityList activities={activities} title="Last 10 Activities" />
      </div>
    </div>
  );
}
