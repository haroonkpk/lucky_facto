"use server";

import { prisma } from "@/lib/prisma";
import { Activity } from "@/types/activity";

export async function getOwnerDashboardData() {
  const now = new Date();

  // Date ranges
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

  // Consolidated parallel queries for dashboard metrics
  const [
    todayDistributions,
    yesterdayDistributions,
    todayPayments,
    yesterdayPayments,
    todayDeliveriesCount,
    yesterdayDeliveriesCount,
    monthDistributions,
    lastMonthDistributions,
    monthPayments,
    lastMonthPayments,
    thisMonthDeliveriesCount,
    lastMonthDeliveriesCount,
    thirtyDaysDistributions,
    thirtyDaysPayments,
    inventoryBalances,
    regionPerformanceRaw,
    overdueShopsRaw,
    totalPendingReceivableRaw,
    dailyDistributionTotals,
    dailyPaymentTotals,
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
    prisma.distribution.count({
      where: { createdAt: { gte: yesterdayStart, lt: todayStart } },
    }),

    // Monthly Metrics
    prisma.distribution.aggregate({
      _sum: { totalAmount: true },
      where: { createdAt: { gte: startOfMonth, lt: startOfNextMonth } },
    }),
    prisma.distribution.aggregate({
      _sum: { totalAmount: true },
      where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } },
    }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        type: "SHOP_COLLECTION",
        createdAt: { gte: startOfMonth, lt: startOfNextMonth },
      },
    }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        type: "SHOP_COLLECTION",
        createdAt: { gte: startOfLastMonth, lt: startOfMonth },
      },
    }),
    prisma.distribution.count({
      where: { createdAt: { gte: startOfMonth, lt: startOfNextMonth } },
    }),
    prisma.distribution.count({
      where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } },
    }),

    // Collection Efficiency (last 30 days)
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

    // Overdue Shop Analysis (Using currentBalance and latest ledger)
    prisma.shop.findMany({
      where: { isActive: true, currentBalance: { gt: 0 } },
      select: {
        id: true,
        name: true,
        createdAt: true, 
        currentBalance: true,
        region: { select: { name: true } },
        ledgers: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { createdAt: true },
        },
      },
      orderBy: { currentBalance: "desc" },
      take: 20,
    }),

    // Financial Health 
    prisma.shop.aggregate({
      _sum: { currentBalance: true },
      where: { currentBalance: { gt: 0 } },
    }),

    prisma.$queryRaw<{ date: Date; total: number }[]>`
      SELECT date_trunc('day', "createdAt") as date, SUM("totalAmount")::float as total
      FROM distributions
      WHERE "createdAt" >= ${ninetyDaysAgo}
      GROUP BY date
      ORDER BY date ASC
    `,
    prisma.$queryRaw<{ date: Date; total: number }[]>`
      SELECT date_trunc('day', "createdAt") as date, SUM("amount")::float as total
      FROM payments
      WHERE "type" = 'SHOP_COLLECTION' AND "createdAt" >= ${ninetyDaysAgo}
      GROUP BY date
      ORDER BY date ASC
    `,
  ]);

  // Recent Activity Feed
  const [recentDistributions, recentPayments, recentIntakes] =
    await Promise.all([
      prisma.distribution.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { brand: true, shop: true, recordedBy: true },
      }),
      prisma.payment.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { shop: true, recordedBy: true },
      }),
      prisma.inventoryIntake.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { brand: true, recordedBy: true },
      }),
    ]);

  // Calculations & Formatting
  const totalDistributions30 = Number(
    thirtyDaysDistributions._sum.totalAmount || 0,
  );
  const totalPayments30 = Number(thirtyDaysPayments._sum.amount || 0);
  const collectionEfficiency =
    totalDistributions30 > 0
      ? (totalPayments30 / totalDistributions30) * 100
      : 0;

  const regionMap = new Map<string, number>();
  regionPerformanceRaw.forEach((d) => {
    const rName = d.shop?.region?.name || "Unknown";
    regionMap.set(rName, (regionMap.get(rName) || 0) + Number(d.totalAmount));
  });

  const regionPerformance = Array.from(regionMap.entries())
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);

  const overdueShopsList = overdueShopsRaw
    .map((shop) => ({
      id: shop.id,
      name: shop.name,
      region: shop.region?.name || "N/A",
      balance: Number(shop.currentBalance),
      daysOverdue: Math.max(
        0,
        Math.floor(
          (now.getTime() -
            new Date(shop.ledgers[0]?.createdAt || shop.createdAt).getTime()) /
            (1000 * 3600 * 24),
        ),
      ),
    }))
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
        {
          label: "Date & Time",
          value: new Date(d.createdAt).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
        },
        { label: "Quantity", value: `${d.quantity} bags` },
        {
          label: "Unit Price",
          value: `PKR ${Number(d.unitPrice).toLocaleString()}`,
        },
        { label: "Shop", value: d.shop?.name || "N/A" },
        { label: "Recorded By", value: d.recordedBy?.name || "System" },
        { label: "Notes", value: d.notes || "None" },
      ],
    })),
    ...recentPayments.map((p) => ({
      id: p.id,
      type: "payment" as const,
      title:
        p.type === "SHOP_COLLECTION" ? "Shop Collection" : "Factory Payment",
      subtitle: `${p.shop?.name || "Factory"} via ${p.paymentMethod}`,
      amount: Number(p.amount),
      date: p.createdAt,
      recordedBy: p.recordedBy?.name || "System",
      role: p.recordedBy?.role || "UNKNOWN",
      details: [
        {
          label: "Date & Time",
          value: new Date(p.createdAt).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
        },
        { label: "Payment Type", value: p.type.replace("_", " ") },
        { label: "Method", value: p.paymentMethod },
        { label: "Amount", value: `PKR ${Number(p.amount).toLocaleString()}` },
        { label: "Shop/Source", value: p.shop?.name || "Factory" },
        { label: "Recorded By", value: p.recordedBy?.name || "System" },
        { label: "Remarks", value: p.cashNote || "None" },
      ],
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
        {
          label: "Date & Time",
          value: new Date(i.createdAt).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
        },
        { label: "Brand", value: i.brand?.name || "N/A" },
        { label: "Quantity", value: `${i.quantity} bags` },
        { label: "Recorded By", value: i.recordedBy?.name || "System" },
        { label: "Notes", value: i.notes || "None" },
      ],
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
  const chartCursor = new Date(ninetyDaysAgo);
  while (chartCursor <= now) {
    const end = new Date(chartCursor);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    chartIntervals.push({
      start: new Date(chartCursor),
      end: new Date(end),
      label: chartCursor.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      }),
      distribution: 0,
      payment: 0,
    });
    chartCursor.setDate(chartCursor.getDate() + 7);
    chartCursor.setHours(0, 0, 0, 0);
  }

  dailyDistributionTotals.forEach((d) => {
    const interval = chartIntervals.find((i) => {
      const dDate = new Date(d.date);
      return dDate >= i.start && dDate <= i.end;
    });
    if (interval) interval.distribution += d.total;
  });

  dailyPaymentTotals.forEach((p) => {
    const interval = chartIntervals.find((i) => {
      const pDate = new Date(p.date);
      return pDate >= i.start && pDate <= i.end;
    });
    if (interval) interval.payment += p.total;
  });

  const chartData = chartIntervals.map(({ label, distribution, payment }) => ({
    label,
    distribution,
    payment,
  }));

  return {
    pulse: {
      distributed: {
        daily: {
          current: Number(todayDistributions._sum.totalAmount || 0),
          previous: Number(yesterdayDistributions._sum.totalAmount || 0),
        },
        monthly: {
          current: Number(monthDistributions._sum.totalAmount || 0),
          previous: Number(lastMonthDistributions._sum.totalAmount || 0),
        },
      },
      payments: {
        daily: {
          current: Number(todayPayments._sum.amount || 0),
          previous: Number(yesterdayPayments._sum.amount || 0),
        },
        monthly: {
          current: Number(monthPayments._sum.amount || 0),
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
      totalPendingReceivable: Number(
        totalPendingReceivableRaw._sum.currentBalance || 0,
      ),
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
