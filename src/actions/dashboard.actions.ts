"use server";

import { prisma } from "@/lib/prisma";
import { Activity } from "@/types/activity";

export async function getOwnerDashboardData() {
  const now = new Date();

  // Daily Dates
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(todayStart.getDate() + 1);
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(todayStart.getDate() - 1);

  // Other Dates
  const thirtyDaysAgo = new Date(todayStart);
  thirtyDaysAgo.setDate(todayStart.getDate() - 30);

  // 90 Days ago for 7-day interval chart
  const ninetyDaysAgo = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 90,
  );
  ninetyDaysAgo.setHours(0, 0, 0, 0);

  // Monthly Dates
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [
    todayDistributions,
    yesterdayDistributions,
    todayPayments,
    yesterdayPayments,
    todayDeliveriesCount,
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
    yesterdayDeliveriesCount,
    thisMonthDistributions,
    lastMonthDistributions,
    thisMonthPayments,
    lastMonthPayments,
    thisMonthDeliveriesCount,
    lastMonthDeliveriesCount,
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
    // Shops for overdue calculation
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
        totalAmount: true,
        unitPrice: true,
        createdAt: true,
        brand: { select: { name: true } },
        shop: { select: { name: true } },
        recordedBy: { select: { name: true, role: true } },
      },
    }),
    prisma.payment.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        amount: true,
        type: true,
        paymentMethod: true,
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
        notes: true,
      },
    }),
    // Chart Data - Using ninetyDaysAgo instead of 3 months
    prisma.distribution.findMany({
      where: { createdAt: { gte: ninetyDaysAgo } },
      select: { totalAmount: true, createdAt: true },
    }),
    prisma.payment.findMany({
      where: { type: "SHOP_COLLECTION", createdAt: { gte: ninetyDaysAgo } },
      select: { amount: true, createdAt: true },
    }),
    prisma.distribution.groupBy({
      by: ["shopId"],
      _sum: { totalAmount: true },
    }),
    prisma.payment.groupBy({
      by: ["shopId"],
      _sum: { amount: true },
      where: { type: "SHOP_COLLECTION", shopId: { not: null } },
    }),

    // --- QUERIES FOR MONTHLY TOGGLE ---

    // Yesterday Deliveries Count
    prisma.distribution.count({
      where: { createdAt: { gte: yesterdayStart, lt: todayStart } },
    }),
    // This Month Distributions
    prisma.distribution.aggregate({
      _sum: { totalAmount: true },
      where: { createdAt: { gte: startOfMonth, lt: startOfNextMonth } },
    }),
    // Last Month Distributions
    prisma.distribution.aggregate({
      _sum: { totalAmount: true },
      where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } },
    }),
    // This Month Payments
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        type: "SHOP_COLLECTION",
        createdAt: { gte: startOfMonth, lt: startOfNextMonth },
      },
    }),
    // Last Month Payments
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        type: "SHOP_COLLECTION",
        createdAt: { gte: startOfLastMonth, lt: startOfMonth },
      },
    }),
    // This Month Deliveries Count
    prisma.distribution.count({
      where: { createdAt: { gte: startOfMonth, lt: startOfNextMonth } },
    }),
    // Last Month Deliveries Count
    prisma.distribution.count({
      where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } },
    }),
  ]);

  // Aggregate Data Formats
  const totalDistributions30 = Number(
    distributionsLast30Days._sum.totalAmount || 0,
  );
  const totalPayments30 = Number(paymentsLast30Days._sum.amount || 0);
  const collectionEfficiency =
    totalDistributions30 > 0
      ? (totalPayments30 / totalDistributions30) * 100
      : 0;

  // Shared Shop Balance Aggregation
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
  const activities: Activity[] = [
    ...recentDistributions.map((d) => ({
      id: d.id,
      type: "distribution" as const,
      title: `${d.brand?.name || "Unknown"} Distribution`,
      subtitle: `${d.shop?.name || "Unknown"}`,
      amount: Number(d.totalAmount),
      date: d.createdAt,
      recordedBy: d.recordedBy?.name || "System",
      role: d.recordedBy?.role || "UNKNOWN",
      details: [
        { label: "Quantity", value: `${d.quantity} bags` },
        { label: "Unit Price", value: Number(d.unitPrice) },
        { label: "Shop", value: d.shop?.name || "N/A" },
        { label: "Recorded By", value: d.recordedBy?.name || "System" }
      ]
    })),
    ...recentPayments.map((p) => ({
      id: p.id,
      type: "payment" as const,
      title: p.type === "SHOP_COLLECTION" ? "Shop Collection" : "Factory Payment",
      subtitle: `${p.shop?.name || "Factory"} via ${p.paymentMethod.replace("_", " ")}`,
      amount: Number(p.amount),
      date: p.createdAt,
      recordedBy: p.recordedBy?.name || "System",
      role: p.recordedBy?.role || "UNKNOWN",
      details: [
        { label: "Payment Type", value: p.type.replace("_", " ") },
        { label: "Method", value: p.paymentMethod.replace("_", " ") },
        { label: "Amount", value: Number(p.amount) },
        { label: "Shop", value: p.shop?.name || "Factory" },
        { label: "Recorded By", value: p.recordedBy?.name || "System" }
      ]
    })),
    ...recentIntakes.map((i) => ({
      id: i.id,
      type: "intake" as const,
      title: "Factory Intake",
      subtitle: `${i.brand?.name || "Unknown"} stock increase`,
      date: i.createdAt,
      recordedBy: i.recordedBy?.name || "System",
      role: i.recordedBy?.role || "UNKNOWN",
      details: [
        { label: "Brand", value: i.brand?.name || "N/A" },
        { label: "Quantity", value: `${i.quantity} bags` },
        { label: "Recorded By", value: i.recordedBy?.name || "System" },
        { label: "Notes", value: i.notes || "None" }
      ]
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  // ---7-DAY INTERVAL CHART DATA PREPARATION ---
  const chartIntervals: {
    start: Date;
    end: Date;
    label: string;
    distribution: number;
    payment: number;
  }[] = [];

  const currentIntervalStart = new Date(ninetyDaysAgo);

  while (currentIntervalStart <= now) {
    const currentIntervalEnd = new Date(currentIntervalStart);
    currentIntervalEnd.setDate(currentIntervalEnd.getDate() + 6);
    currentIntervalEnd.setHours(23, 59, 59, 999);

    chartIntervals.push({
      start: new Date(currentIntervalStart),
      end: new Date(currentIntervalEnd),
      label: currentIntervalStart.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      }),
      distribution: 0,
      payment: 0,
    });

    currentIntervalStart.setDate(currentIntervalStart.getDate() + 7);
    currentIntervalStart.setHours(0, 0, 0, 0);
  }

  allDistributionsForChart.forEach((d) => {
    const interval = chartIntervals.find(
      (i) => d.createdAt >= i.start && d.createdAt <= i.end,
    );
    if (interval) {
      interval.distribution += Number(d.totalAmount);
    }
  });

  allPaymentsForChart.forEach((p) => {
    const interval = chartIntervals.find(
      (i) => p.createdAt >= i.start && p.createdAt <= i.end,
    );
    if (interval) {
      interval.payment += Number(p.amount);
    }
  });

  const chartData = chartIntervals.map(({ label, distribution, payment }) => ({
    label,
    distribution,
    payment,
  }));

  let totalPending = 0;
  shopTotalsMap.forEach(({ billing, collection }) => {
    const pending = billing - collection;
    if (pending > 0) totalPending += pending;
  });

  return {
    pulse: {
      distributed: {
        daily: {
          current: Number(todayDistributions._sum.totalAmount || 0),
          previous: Number(yesterdayDistributions._sum.totalAmount || 0),
        },
        monthly: {
          current: Number(thisMonthDistributions._sum.totalAmount || 0),
          previous: Number(lastMonthDistributions._sum.totalAmount || 0),
        },
      },
      payments: {
        daily: {
          current: Number(todayPayments._sum.amount || 0),
          previous: Number(yesterdayPayments._sum.amount || 0),
        },
        monthly: {
          current: Number(thisMonthPayments._sum.amount || 0),
          previous: Number(lastMonthPayments._sum.amount || 0),
        },
      },
      deliveries: {
        daily: {
          current: todayDeliveriesCount,
          previous: yesterdayDeliveriesCount,
        },
        monthly: {
          current: thisMonthDeliveriesCount,
          previous: lastMonthDeliveriesCount,
        },
      },
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
