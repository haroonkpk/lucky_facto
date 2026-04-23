import { getInventoryBalances } from "@/actions/salesman.actions";
import {
  getSalesmanSales,
  getSalesmanPendingPayments,
  getSalesmanLatestActivity,
} from "@/actions/salesmanDashboard.actions";

import {
  DashboardHeader,
  SalesCard,
  PendingPaymentsCard,
  DetailedPendingPayments,
} from "@/components/salesman/dashboard";
import { BrandStockList } from "@/components/owner/dashboard";
import { ActivityDataTable } from "@/components/shared";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const revalidate = 60;

export default async function SalesmanDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

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
    <div className="min-h-screen bg-(--color-page-bg)">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 lg:py-10 pb-24 flex flex-col gap-6 lg:gap-8">
        {/* Header */}
        <DashboardHeader salesmanName={salesmanName} />

        {/* ROW 1: Sales Card + Brand Stock */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          <SalesCard
            monthlySales={sales.monthlySales}
            todaySales={sales.todaySales}
          />
          <BrandStockList
            stock={inventoryBalances.map((item) => ({
              brandName: item.brand.name,
              currentStock: item.currentStock,
            }))}
          />
        </div>

        {/* ROW 2: Pending Summary + Detailed Pending */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 lg:gap-8 items-stretch">
          <PendingPaymentsCard
            totalPending={pendingPayments.totalPending}
            shopCount={pendingPayments.shopCount}
          />
          {pendingPayments.shops?.length > 0 ? (
            <DetailedPendingPayments shops={pendingPayments.shops} />
          ) : (
            <div className="bg-white rounded-[clamp(10px,1.5vw,16px)] p-[clamp(1.25rem,2vw,2rem)] flex items-center justify-center">
              <p className="text-gray-400 text-sm italic">
                No pending payments
              </p>
            </div>
          )}
        </div>

        {/* ROW 3: Activity */}
        <ActivityDataTable
          activities={activities}
          title="Last 10 Activities"
          showPagination={false}
        />
      </div>
    </div>
  );
}
