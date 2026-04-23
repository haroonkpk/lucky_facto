"use server";

import { prisma } from "@/lib/prisma";
import { Activity } from "@/types/activity";
import { unstable_cache } from "next/cache";

export async function getSalesmanSales(userId: string) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [monthlyAgg, todayAgg] = await Promise.all([
    prisma.distribution.aggregate({
      where: {
        recordedById: userId,
        distributionDate: { gte: startOfMonth },
      },
      _sum: { totalAmount: true },
    }),
    prisma.distribution.aggregate({
      where: {
        recordedById: userId,
        distributionDate: { gte: startOfDay },
      },
      _sum: { totalAmount: true },
    }),
  ]);

  return {
    monthlySales: Number(monthlyAgg._sum.totalAmount || 0),
    todaySales: Number(todayAgg._sum.totalAmount || 0),
  };
}


const getProcessedPendingShops = unstable_cache(
  async (userId: string) => {
    const now = new Date();

    const shopsWithBalance = await prisma.shop.findMany({
      where: { currentBalance: { gt: 0 } },
      select: {
        id: true,
        name: true,
        currentBalance: true,
        createdAt: true,
        ledgers: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { createdAt: true },
        },
      },
    });

    if (shopsWithBalance.length === 0) return [];

    const shopIds = shopsWithBalance.map((s) => s.id);

    const allDistributions = await prisma.distribution.findMany({
      where: { shopId: { in: shopIds } },
      orderBy: { createdAt: "desc" },
      select: { shopId: true, totalAmount: true, recordedById: true },
    });

    const shopDistributionsMap = new Map();
    allDistributions.forEach((d) => {
      const list = shopDistributionsMap.get(d.shopId) || [];
      list.push(d);
      shopDistributionsMap.set(d.shopId, list);
    });

    const pendingShops = [];

    for (const shop of shopsWithBalance) {
      const distributions = shopDistributionsMap.get(shop.id) || [];
      let remainingBalance = Number(shop.currentBalance);
      let shopPendingForUser = 0;

      for (const dist of distributions) {
        if (remainingBalance <= 0) break;
        const distAmount = Number(dist.totalAmount);
        const unpaidAmount = Math.min(distAmount, remainingBalance);
        if (dist.recordedById === userId) shopPendingForUser += unpaidAmount;
        remainingBalance -= unpaidAmount;
      }

      if (shopPendingForUser > 0) {
        pendingShops.push({
          id: shop.id,
          name: shop.name,
          amount: shopPendingForUser,
          daysOverdue: Math.max(
            0,
            Math.floor(
              (now.getTime() -
                new Date(shop.ledgers[0]?.createdAt || shop.createdAt).getTime()) /
                (1000 * 3600 * 24),
            ),
          ),
        });
      }
    }

    pendingShops.sort((a, b) => b.amount - a.amount);
    return pendingShops;
  },
  ["pending-shops"],
  {
    revalidate: 60,
    tags: ["pending-payments"],
  },
);

export async function getSalesmanPendingPayments(
  userId: string,
  page: number = 1,
  pageSize: number = 3,
) {
  const allShops = await getProcessedPendingShops(userId);

  const totalShops = allShops.length;
  const totalPending = allShops.reduce((sum, s) => sum + s.amount, 0);
  const totalPages = Math.ceil(totalShops / pageSize);
  const paginatedShops = allShops.slice((page - 1) * pageSize, page * pageSize);

  return {
    totalPending,
    shopCount: totalShops,
    shops: paginatedShops,
    totalPages,
    currentPage: page,
  };
}

export async function getSalesmanLatestActivity(
  userId: string,
): Promise<Activity[]> {
  const [distributions, payments, intakes] = await Promise.all([
    prisma.distribution.findMany({
      where: { recordedById: userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        brand: { select: { name: true } },
        shop: { select: { name: true } },
        recordedBy: { select: { name: true, role: true } },
      },
    }),
    prisma.payment.findMany({
      where: { recordedById: userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        shop: { select: { name: true } },
        recordedBy: { select: { name: true, role: true } },
      },
    }),
    prisma.inventoryIntake.findMany({
      where: { recordedById: userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        brand: { select: { name: true } },
        recordedBy: { select: { name: true, role: true } },
      },
    }),
  ]);

  const activities: Activity[] = [
    // 1. Distributions
    ...distributions.map((d) => ({
      id: d.id,
      type: "distribution" as const,
      title: `${d.brand.name} Distribution`,
      subtitle: d.shop.name,
      amount: Number(d.totalAmount),
      date: d.createdAt.toISOString(),
      recordedBy: d.recordedBy?.name || "System",
      role: d.recordedBy?.role || "SALESMAN",
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
        { label: "Unit Price", value: Number(d.unitPrice) },
        { label: "Shop", value: d.shop.name },
        { label: "Recorded By", value: d.recordedBy?.name || "System" },
      ],
    })),
    // 2. Payments
    ...payments.map((p) => ({
      id: p.id,
      type: "payment" as const,
      title:
        p.type === "SHOP_COLLECTION" ? "Shop Collection" : "Factory Payment",
      subtitle: `${p.shop?.name || "Factory"} via ${p.paymentMethod.replace("_", " ")}`,
      amount: Number(p.amount),
      date: p.createdAt.toISOString(),
      recordedBy: p.recordedBy?.name || "System",
      role: p.recordedBy?.role || "SALESMAN",
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
        { label: "Method", value: p.paymentMethod.replace("_", " ") },
        { label: "Amount", value: Number(p.amount) },
        { label: "Shop", value: p.shop?.name || "Factory" },
        { label: "Recorded By", value: p.recordedBy?.name || "System" },
      ],
    })),
    // 3. Inventory Intakes
    ...intakes.map((i) => ({
      id: i.id,
      type: "intake" as const,
      title: "Factory Intake",
      subtitle: `${i.brand.name} stock increase`,
      amount: 0,
      date: i.createdAt.toISOString(),
      recordedBy: i.recordedBy?.name || "System",
      role: i.recordedBy?.role || "SALESMAN",
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
        { label: "Brand", value: i.brand.name },
        { label: "Quantity", value: `${i.quantity} bags` },
        { label: "Recorded By", value: i.recordedBy?.name || "System" },
        { label: "Notes", value: i.notes || "None" },
      ],
    })),
  ];

  activities.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  return activities.slice(0, 10);
}

export async function getFilteredActivities({
  userId,
  type,
  startDate,
  endDate,
  page = 1,
  pageSize = 10,
}: {
  userId: string;
  type?: "distribution" | "payment" | "intake";
  startDate?: Date;
  endDate?: Date;
  page?: number;
  pageSize?: number;
}) {
  const skip = (page - 1) * pageSize;
  const where: {
    recordedById: string;
    createdAt?: {
      gte?: Date;
      lte?: Date;
    };
  } = { recordedById: userId };

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = startDate;
    if (endDate) {
      const end = new Date(endDate);
      end.setUTCHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }

  const [distributions, payments, intakes, totalDist, totalPay, totalIntake] =
    await Promise.all([
      type === "distribution" || !type
        ? prisma.distribution.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: type ? skip : 0,
            take: type ? pageSize : 10,
            include: {
              brand: { select: { name: true } },
              shop: { select: { name: true } },
              recordedBy: { select: { name: true, role: true } },
            },
          })
        : Promise.resolve([]),
      type === "payment" || !type
        ? prisma.payment.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: type ? skip : 0,
            take: type ? pageSize : 10,
            include: {
              shop: { select: { name: true } },
              recordedBy: { select: { name: true, role: true } },
            },
          })
        : Promise.resolve([]),
      type === "intake" || !type
        ? prisma.inventoryIntake.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: type ? skip : 0,
            take: type ? pageSize : 10,
            include: {
              brand: { select: { name: true } },
              recordedBy: { select: { name: true, role: true } },
            },
          })
        : Promise.resolve([]),
      type === "distribution"
        ? prisma.distribution.count({ where })
        : Promise.resolve(0),
      type === "payment" ? prisma.payment.count({ where }) : Promise.resolve(0),
      type === "intake"
        ? prisma.inventoryIntake.count({ where })
        : Promise.resolve(0),
    ]);

  const activities: Activity[] = [
    // 1. Distributions
    ...distributions.map((d) => ({
      id: d.id,
      type: "distribution" as const,
      title: `${d.brand.name} Distribution`,
      subtitle: d.shop.name,
      amount: Number(d.totalAmount),
      date: d.createdAt.toISOString(),
      recordedBy: d.recordedBy?.name || "System",
      role: d.recordedBy?.role || "SALESMAN",
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
        { label: "Unit Price", value: Number(d.unitPrice) },
        { label: "Shop", value: d.shop.name },
        { label: "Recorded By", value: d.recordedBy?.name || "System" },
      ],
    })),
    // 2. Payments
    ...payments.map((p) => ({
      id: p.id,
      type: "payment" as const,
      title:
        p.type === "SHOP_COLLECTION" ? "Shop Collection" : "Factory Payment",
      subtitle: `${p.shop?.name || "Factory"} via ${p.paymentMethod.replace("_", " ")}`,
      amount: Number(p.amount),
      date: p.createdAt.toISOString(),
      recordedBy: p.recordedBy?.name || "System",
      role: p.recordedBy?.role || "SALESMAN",
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
        { label: "Method", value: p.paymentMethod.replace("_", " ") },
        { label: "Amount", value: Number(p.amount) },
        { label: "Shop", value: p.shop?.name || "Factory" },
        { label: "Recorded By", value: p.recordedBy?.name || "System" },
      ],
    })),
    // 3. Inventory Intakes
    ...intakes.map((i) => ({
      id: i.id,
      type: "intake" as const,
      title: "Factory Intake",
      subtitle: `${i.brand.name} stock increase`,
      amount: 0,
      date: i.createdAt.toISOString(),
      recordedBy: i.recordedBy?.name || "System",
      role: i.recordedBy?.role || "SALESMAN",
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
        { label: "Brand", value: i.brand.name },
        { label: "Quantity", value: `${i.quantity} bags` },
        { label: "Recorded By", value: i.recordedBy?.name || "System" },
        { label: "Notes", value: i.notes || "None" },
      ],
    })),
  ];

  activities.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const total =
    type === "distribution"
      ? totalDist
      : type === "payment"
        ? totalPay
        : type === "intake"
          ? totalIntake
          : activities.length;

  return {
    activities: type ? activities : activities.slice(0, 10),
    total,
    totalPages: Math.ceil(total / pageSize),
    currentPage: page,
  };
}
