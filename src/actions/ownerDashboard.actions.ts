"use server";
import { prisma } from "@/lib/prisma";
import { Activity } from "@/types/activity";
import { formatPKR } from "@/lib/dashboard-utils";

export async function getOwnerDashboardData(
  startDate?: Date,
  endDate?: Date,
  overduePage: number = 1,
  overduePageSize: number = 4,
  brandId?: string,
  activityType?: string,
  paymentType?: string,
) {
  const now = new Date();

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(todayStart.getDate() + 1);

  // Default filter range: 1st of month to Today
  const filterStart =
    startDate || new Date(now.getFullYear(), now.getMonth(), 1);

  let filterEnd = endDate || tomorrowStart;

  // Restriction: End date cannot go beyond today's data
  if (filterEnd > tomorrowStart) {
    filterEnd = tomorrowStart;
  }

  // Date range for collection efficiency
  const thirtyDaysAgo = new Date(todayStart);
  thirtyDaysAgo.setDate(todayStart.getDate() - 30);
  // Chart range: If filter is provided, use it, otherwise 90 days
  const chartStart =
    startDate ||
    new Date(now.getFullYear(), now.getMonth(), now.getDate() - 90);
  chartStart.setHours(0, 0, 0, 0);
  const chartEnd = endDate || tomorrowStart;

  // Consolidated parallel queries for dashboard metrics
  const [
    filteredDistributions,
    filteredPayments,
    filteredDeliveriesCount,
    inventoryBalances,
    regionPerformanceRaw,
    regionPendingRaw,
    overdueShopsRaw,
    totalPendingReceivableRaw,
    totalOverdueShops,
    dailyDistributionTotals,
    dailyPaymentTotals,
  ] = await Promise.all([
    // Filtered Distributions
    prisma.distribution.aggregate({
      _sum: { totalAmount: true },
      where: { createdAt: { gte: filterStart, lt: filterEnd } },
    }),
    // Filtered Payments
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        type: "SHOP_COLLECTION",
        createdAt: { gte: filterStart, lt: filterEnd },
      },
    }),
    // Filtered Deliveries Count
    prisma.distribution.count({
      where: { createdAt: { gte: filterStart, lt: filterEnd } },
    }),

    // Brand Wise Stock
    prisma.inventoryBalance.findMany({
      select: { currentStock: true, brand: { select: { name: true } } },
      orderBy: { currentStock: "desc" },
    }),
    // Region Performance
    prisma.distribution.findMany({
      where: { createdAt: { gte: filterStart, lt: filterEnd } },
      select: {
        totalAmount: true,
        shop: { select: { region: { select: { name: true } } } },
      },
    }),
    prisma.shop.findMany({
      where: { isActive: true, currentBalance: { gt: 0 } },
      select: {
        currentBalance: true,
        region: { select: { name: true } },
      },
    }),

    // Overdue Shop Analysis
    prisma.shop.findMany({
      where: { isActive: true, currentBalance: { gte: 300000 } },
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
    }),

    // Financial Health
    prisma.shop.aggregate({
      _sum: { currentBalance: true },
      _count: { id: true },
      where: { currentBalance: { gt: 0 } },
    }),

    // Total Overdue Shops Count (for pagination)
    prisma.shop.count({
      where: { isActive: true, currentBalance: { gte: 300000 } },
    }),

    prisma.$queryRaw<{ date: Date; total: number }[]>`
      SELECT date_trunc('day', "createdAt") as date, SUM("totalAmount")::float as total
      FROM distributions
      WHERE "createdAt" >= ${chartStart} AND "createdAt" < ${chartEnd}
      GROUP BY date
      ORDER BY date ASC
    `,
    prisma.$queryRaw<{ date: Date; total: number }[]>`
      SELECT date_trunc('day', "createdAt") as date, SUM("amount")::float as total
      FROM payments
      WHERE "type" = 'SHOP_COLLECTION' AND "createdAt" >= ${chartStart} AND "createdAt" < ${chartEnd}
      GROUP BY date
      ORDER BY date ASC
    `,
  ]);

  // Collection efficiency still based on last 30 days for health check
  const [thirtyDaysDistributions, thirtyDaysPayments] = await Promise.all([
    prisma.distribution.aggregate({
      _sum: { totalAmount: true },
      where: { createdAt: { gte: thirtyDaysAgo } },
    }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { type: "SHOP_COLLECTION", createdAt: { gte: thirtyDaysAgo } },
    }),
  ]);

  // Recent Activity Feed - with optional filters
  const distWhere: any = {};
  const payWhere: any = {};
  const intakeWhere: any = {};

  if (brandId) {
    distWhere.brandId = brandId;
    intakeWhere.brandId = brandId;
    payWhere.brandId = brandId;
  }
  if (paymentType) {
    payWhere.type = paymentType;
  }

  const showDist = !activityType || activityType === "distribution";
  const showPay = !activityType || activityType === "payment";
  const showIntake = !activityType || activityType === "intake";

  const [recentDistributions, recentPayments, recentIntakes] =
    await Promise.all([
      showDist
        ? prisma.distribution.findMany({
            where: distWhere,
            take: 10,
            orderBy: { createdAt: "desc" },
            include: { brand: true, shop: true, recordedBy: true },
          })
        : Promise.resolve([]),
      showPay
        ? prisma.payment.findMany({
            where: payWhere,
            take: 10,
            orderBy: { createdAt: "desc" },
            include: { shop: true, recordedBy: true },
          })
        : Promise.resolve([]),
      showIntake
        ? prisma.inventoryIntake.findMany({
            where: intakeWhere,
            take: 10,
            orderBy: { createdAt: "desc" },
            include: { brand: true, recordedBy: true },
          })
        : Promise.resolve([]),
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

  const regionMap = new Map<string, { distributed: number; pending: number }>();

  regionPerformanceRaw.forEach((d) => {
    const rName = d.shop?.region?.name || "Unknown";
    const existing = regionMap.get(rName) || { distributed: 0, pending: 0 };
    regionMap.set(rName, {
      ...existing,
      distributed: existing.distributed + Number(d.totalAmount),
    });
  });

  regionPendingRaw.forEach((s) => {
    const rName = s.region?.name || "Unknown";
    const existing = regionMap.get(rName) || { distributed: 0, pending: 0 };
    regionMap.set(rName, {
      ...existing,
      pending: existing.pending + Number(s.currentBalance),
    });
  });

  const regionPerformance = Array.from(regionMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.distributed - a.distributed);

  const totalOverduePages = Math.ceil(totalOverdueShops / overduePageSize);

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
    .slice((overduePage - 1) * overduePageSize, overduePage * overduePageSize);

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
          value: formatPKR(Number(d.unitPrice)),
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
      imageUrl: p.receiptUrl || undefined,
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
        { label: "Amount", value: formatPKR(Number(p.amount)) },
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

  // --- INTERVAL CHART DATA PREPARATION ---
  const diffDays = Math.ceil(
    (chartEnd.getTime() - chartStart.getTime()) / (1000 * 3600 * 24),
  );

  const granularities = [
    { type: "day" as const, approxDays: 1 },
    { type: "week" as const, approxDays: 7 },
    { type: "month" as const, approxDays: 30 },
    { type: "quarter" as const, approxDays: 91 },
    { type: "year" as const, approxDays: 365 },
  ];

  const targetBins = 14;
  const bestFit =
    granularities.find((g) => diffDays / g.approxDays <= targetBins) ||
    granularities[granularities.length - 1];
  const intervalType = bestFit.type;

  const chartIntervals: {
    start: Date;
    end: Date;
    label: string;
    distribution: number;
    payment: number;
  }[] = [];

  const chartCursor = new Date(chartStart);
  while (chartCursor < chartEnd) {
    const start = new Date(chartCursor);
    let end: Date;
    let label: string;

    switch (intervalType) {
      case "year":
        end = new Date(start.getFullYear(), 11, 31, 23, 59, 59, 999);
        label = start.getFullYear().toString();
        chartCursor.setFullYear(start.getFullYear() + 1, 0, 1);
        break;
      case "quarter":
        const quarter = Math.floor(start.getMonth() / 3);
        end = new Date(
          start.getFullYear(),
          (quarter + 1) * 3,
          0,
          23,
          59,
          59,
          999,
        );
        label = `Q${quarter + 1} ${start.getFullYear().toString().slice(-2)}`;
        chartCursor.setMonth((quarter + 1) * 3, 1);
        break;
      case "month":
        end = new Date(
          start.getFullYear(),
          start.getMonth() + 1,
          0,
          23,
          59,
          59,
          999,
        );
        label = start.toLocaleDateString("en-GB", {
          month: "short",
          year: "2-digit",
        });
        chartCursor.setMonth(start.getMonth() + 1, 1);
        break;
      case "week":
        end = new Date(start.getTime() + 6 * 24 * 3600 * 1000);
        end.setHours(23, 59, 59, 999);
        label = start.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
        });
        chartCursor.setDate(start.getDate() + 7);
        break;
      default: // day
        end = new Date(start);
        end.setHours(23, 59, 59, 999);
        label = start.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
        });
        chartCursor.setDate(start.getDate() + 1);
    }

    chartIntervals.push({
      start,
      end: end > chartEnd ? chartEnd : end,
      label,
      distribution: 0,
      payment: 0,
    });

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

  const totalStockCount = inventoryBalances.reduce(
    (acc, curr) => acc + curr.currentStock,
    0,
  );

  return {
    staticMetrics: {
      pendingPayments: Number(
        totalPendingReceivableRaw._sum.currentBalance || 0,
      ),
      pendingShopsCount: totalPendingReceivableRaw._count.id || 0,
      totalStock: totalStockCount,
    },
    filteredMetrics: {
      distributed: Number(filteredDistributions._sum.totalAmount || 0),
      payments: Number(filteredPayments._sum.amount || 0),
      deliveries: filteredDeliveriesCount,
    },
    kpis: {
      totalPendingReceivable: Number(
        totalPendingReceivableRaw._sum.currentBalance || 0,
      ),
      collectionEfficiency,
      totalStockCount,
    },
    chartData,
    brandWiseStock: inventoryBalances.map((b) => ({
      brandName: b.brand.name,
      currentStock: b.currentStock,
    })),
    regionPerformance,
    overdueShopsList,
    overduePagination: {
      currentPage: overduePage,
      totalPages: totalOverduePages,
      totalEntries: totalOverdueShops,
    },
    activities,
  };
}
