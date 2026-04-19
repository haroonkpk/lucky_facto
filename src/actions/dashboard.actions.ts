"use server";

import { prisma } from "@/lib/prisma";
import { Role } from "@/lib/generated/prisma/enums";

export async function getOwnerDashboardData() {
  const now = new Date();

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(todayStart.getDate() + 1);

  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(todayStart.getDate() - 1);

  const thirtyDaysAgo = new Date(todayStart);
  thirtyDaysAgo.setDate(todayStart.getDate() - 30);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);

  const [
    todayDistributions,
    yesterdayDistributions,
    todayPayments,
    yesterdayPayments,
    todayDeliveriesCount,
    salesmen,
    distributionsLast30Days,
    paymentsLast30Days,
    inventoryBalances,
    distributionsThisMonth,
    shopLedgers,
    recentDistributions,
    recentPayments,
    recentIntakes,
    allDistributionsForChart,
    allPaymentsForChart,
    shopBillings,
    shopCollections,
  ] = await Promise.all([
    // Today Distributions
    prisma.distribution.aggregate({
      _sum: { totalAmount: true },
      where: { createdAt: { gte: todayStart, lt: tomorrowStart } },
    }),
    // Yesterday Distributions
    prisma.distribution.aggregate({
      _sum: { totalAmount: true },
      where: { createdAt: { gte: yesterdayStart, lt: todayStart } },
    }),
    // Today Payments
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        type: "SHOP_COLLECTION",
        createdAt: { gte: todayStart, lt: tomorrowStart },
      },
    }),
    // Yesterday Payments
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        type: "SHOP_COLLECTION",
        createdAt: { gte: yesterdayStart, lt: todayStart },
      },
    }),
    // Today Deliveries Count
    prisma.distribution.count({
      where: { createdAt: { gte: todayStart, lt: tomorrowStart } },
    }),
    // Salesmen Count
    prisma.user.findMany({
      where: { role: Role.SALESMAN },
      select: { isActive: true },
    }),
    // Collection Efficiency (30 days)
    prisma.distribution.aggregate({
      _sum: { totalAmount: true },
      where: { createdAt: { gte: thirtyDaysAgo } },
    }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { type: "SHOP_COLLECTION", createdAt: { gte: thirtyDaysAgo } },
    }),
    // Brand Wise Stock
    prisma.inventoryBalance.findMany({
      select: { currentStock: true, brand: { select: { name: true } } },
      orderBy: { currentStock: "desc" },
    }),
    // Region Performance (This month)
    prisma.distribution.findMany({
      where: { createdAt: { gte: startOfMonth } },
      select: {
        totalAmount: true,
        shop: { select: { region: { select: { name: true } } } },
      },
    }),
    // Shops for overdue calculation (Only fetch shops that actually have pending balance)
    prisma.shop.findMany({
      where: { isActive: true, currentBalance: { gt: 0 } },
      select: {
        id: true,
        name: true,
        createdAt: true,
        region: { select: { name: true } },
        distributions: {
          orderBy: { distributionDate: "desc" },
          take: 1,
          select: { distributionDate: true },
        },
        payments: {
          orderBy: { paymentDate: "desc" },
          take: 1,
          where: { type: "SHOP_COLLECTION" },
          select: { paymentDate: true },
        },
      },
    }),
    // Recent Activities
    prisma.distribution.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        quantity: true,
        createdAt: true,
        shop: { select: { name: true } },
        recordedBy: { select: { name: true, role: true } },
      }, 
    }),
    prisma.payment.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        shop: { select: { name: true } },
        recordedBy: { select: { name: true, role: true } },
      }, 
    }),
    prisma.inventoryIntake.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        quantity: true,
        createdAt: true,
        brand: { select: { name: true } },
        recordedBy: { select: { name: true, role: true } },
      }, 
    }),
    // Chart Data (3 Months Distributions)
    prisma.distribution.findMany({
      where: { createdAt: { gte: threeMonthsAgo } },
      select: { totalAmount: true, createdAt: true },
    }),
    // Chart Data (3 Months Payments)
    prisma.payment.findMany({
      where: { type: "SHOP_COLLECTION", createdAt: { gte: threeMonthsAgo } },
      select: { amount: true, createdAt: true },
    }),
    // Total Billing per Shop
    prisma.distribution.groupBy({
      by: ["shopId"],
      _sum: { totalAmount: true },
    }),
    // Total Collections per Shop
    prisma.payment.groupBy({
      by: ["shopId"],
      _sum: { amount: true },
      where: { type: "SHOP_COLLECTION", shopId: { not: null } },
    }),
  ]);

  // Aggregate Data Formats

  const activeSalesmenCount = salesmen.filter((s) => s.isActive).length;
  const totalSalesmenCount = salesmen.length;

  const totalDistributions30 = Number(
    distributionsLast30Days._sum.totalAmount || 0,
  );
  const totalPayments30 = Number(paymentsLast30Days._sum.amount || 0);
  const collectionEfficiency =
    totalDistributions30 > 0
      ? (totalPayments30 / totalDistributions30) * 100
      : 0;

  // ─── Shared Shop Balance Aggregation ───
  const shopTotalsMap = new Map<
    string,
    { billing: number; collection: number }
  >();
  shopBillings.forEach((b) => {
    const entry = shopTotalsMap.get(b.shopId) || { billing: 0, collection: 0 };
    entry.billing += Number(b._sum.totalAmount || 0);
    shopTotalsMap.set(b.shopId, entry);
  });
  shopCollections.forEach((c) => {
    if (!c.shopId) return;
    const entry = shopTotalsMap.get(c.shopId) || { billing: 0, collection: 0 };
    entry.collection += Number(c._sum.amount || 0);
    shopTotalsMap.set(c.shopId, entry);
  });

  // Region performance Map
  const regionMap = new Map<string, number>();
  distributionsThisMonth.forEach((d) => {
    if (d.shop?.region?.name) {
      const current = regionMap.get(d.shop.region.name) || 0;
      regionMap.set(d.shop.region.name, current + Number(d.totalAmount));
    }
  });
  const regionPerformance = Array.from(regionMap.entries())
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);

  // Overdue Shops Calculation
  const overdueShopsList = shopLedgers
    .map((shop) => {
      const totals = shopTotalsMap.get(shop.id) || {
        billing: 0,
        collection: 0,
      };
      const balance = totals.billing - totals.collection;

      if (balance <= 0) return null;

      const lastPaymentDate = shop.payments[0]?.paymentDate;
      const lastDistDate = shop.distributions[0]?.distributionDate;
      const referenceDate = lastPaymentDate || lastDistDate || shop.createdAt;

      const daysOverdue = Math.floor(
        (now.getTime() - new Date(referenceDate).getTime()) /
          (1000 * 3600 * 24),
      );

      return {
        id: shop.id,
        name: shop.name,
        region: shop.region?.name || "N/A",
        balance,
        daysOverdue: Math.max(0, daysOverdue),
      };
    })
    .filter((s): s is NonNullable<typeof s> => s !== null)
    .sort((a, b) => b.daysOverdue - a.daysOverdue)
    .slice(0, 8);

  // Recent Activity Feed
  type Activity = {
    id: string;
    type: "distribution" | "payment" | "intake";
    text: string;
    date: Date;
    recordedBy: string;
    role: string;
  };
  const activities: Activity[] = [
    ...recentDistributions.map((d) => ({
      id: d.id,
      type: "distribution" as const,
      text: `Distributed ${d.quantity} items to ${d.shop?.name || "Unknown"}`,
      date: d.createdAt,
      recordedBy: d.recordedBy?.name || "System",
      role: d.recordedBy?.role || "UNKNOWN",
    })),
    ...recentPayments.map((p) => ({
      id: p.id,
      type: "payment" as const,
      text: `Received payment from ${p.shop?.name || "Factory"}`,
      date: p.createdAt,
      recordedBy: p.recordedBy?.name || "System",
      role: p.recordedBy?.role || "UNKNOWN",
    })),
    ...recentIntakes.map((i) => ({
      id: i.id,
      type: "intake" as const,
      text: `Stock intake of ${i.quantity} for ${i.brand?.name || "Unknown"}`,
      date: i.createdAt,
      recordedBy: i.recordedBy?.name || "System",
      role: i.recordedBy?.role || "UNKNOWN",
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 10);

  // Chart Data Preparation
  const chartMap = new Map<
    string,
    { month: string; distribution: number; payment: number }
  >();
  for (let i = 0; i < 3; i++) {
    const m = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = m.toLocaleString("default", { month: "short" });
    chartMap.set(key, { month: key, distribution: 0, payment: 0 });
  }

  allDistributionsForChart.forEach((d) => {
    const key = d.createdAt.toLocaleString("default", { month: "short" });
    if (chartMap.has(key)) {
      chartMap.get(key)!.distribution += Number(d.totalAmount);
    }
  });

  allPaymentsForChart.forEach((p) => {
    const key = p.createdAt.toLocaleString("default", { month: "short" });
    if (chartMap.has(key)) {
      chartMap.get(key)!.payment += Number(p.amount);
    }
  });

  const chartData = Array.from(chartMap.values()).reverse();

  let totalPending = 0;
  shopTotalsMap.forEach(({ billing, collection }) => {
    const pending = billing - collection;
    if (pending > 0) totalPending += pending;
  });

  return {
    pulse: {
      todayDistributed: Number(todayDistributions._sum.totalAmount || 0),
      yesterdayDistributed: Number(
        yesterdayDistributions._sum.totalAmount || 0,
      ),
      todayPayments: Number(todayPayments._sum.amount || 0),
      yesterdayPayments: Number(yesterdayPayments._sum.amount || 0),
      todayDeliveriesCount,
      activeSalesmenCount,
      totalSalesmenCount,
    },
    kpis: {
      totalPendingReceivable: totalPending,
      collectionEfficiency,
      totalStockCount: inventoryBalances.reduce(
        (acc, curr) => acc + curr.currentStock,
        0,
      ),
    },
    chartData,
    brandWiseStock: inventoryBalances.map((b) => ({
      brandName: b.brand.name,
      currentStock: b.currentStock,
    })),
    regionPerformance,
    overdueShopsList,
    activities,
  };
}
