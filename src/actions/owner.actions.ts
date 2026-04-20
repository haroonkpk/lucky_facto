"use server";

import { Role } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { BrandRevenueData, BrandRevenueEntry } from "@/types/chart";
import { revalidatePath } from "next/cache";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SalesmanWithStats = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  totalSales: number;
  regions: string[];
  /** Sales total (sum of totalAmount) for each of the last 7 days, oldest first */
  dailySales: number[];
};

export type ShopWithStats = {
  id: string;
  name: string;
  address: string | null;
  phoneNumber: string | null;
  isActive: boolean;
  region: string;
  totalPayments: number;
  totalBilling: number;
  balanceOwed: number;
};

// ─── Actions ──────────────────────────────────────────────────────────────────

export async function getShops(): Promise<ShopWithStats[]> {
  const [shops, ledgerAggregates] = await Promise.all([
    prisma.shop.findMany({
      orderBy: { createdAt: "desc" },
      include: { region: { select: { name: true } } },
    }),
    prisma.ledger.groupBy({
      by: ["shopId", "transactionType"],
      _sum: { amount: true },
    }),
  ]);

  const statsMap = new Map<
    string,
    { totalPayments: number; totalBilling: number }
  >();
  ledgerAggregates.forEach((agg) => {
    const entry = statsMap.get(agg.shopId) || {
      totalPayments: 0,
      totalBilling: 0,
    };
    if (agg.transactionType === "CREDIT")
      entry.totalPayments = Number(agg._sum.amount || 0);
    if (agg.transactionType === "DEBIT")
      entry.totalBilling = Number(agg._sum.amount || 0);
    statsMap.set(agg.shopId, entry);
  });

  return shops.map((s) => {
    const stats = statsMap.get(s.id) || { totalPayments: 0, totalBilling: 0 };
    return {
      id: s.id,
      name: s.name,
      address: s.address,
      phoneNumber: s.phoneNumber,
      isActive: s.isActive,
      region: s.region.name,
      totalPayments: stats.totalPayments,
      totalBilling: stats.totalBilling,
      balanceOwed: Number(s.currentBalance),
    };
  });
}

export async function getSalesmen(): Promise<SalesmanWithStats[]> {
  // Build the last-7-days date range (start of 6 days ago → end of today)
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(todayStart);
  sevenDaysAgo.setDate(todayStart.getDate() - 6);

  const [salesmen, totalSalesAgg, last7DaysDistributions] = await Promise.all([
    prisma.user.findMany({
      where: { role: Role.SALESMAN },
      orderBy: { createdAt: "asc" },
    }),
    prisma.distribution.groupBy({
      by: ["recordedById"],
      _sum: { totalAmount: true },
    }),
    prisma.distribution.findMany({
      where: { distributionDate: { gte: sevenDaysAgo } },
      select: {
        recordedById: true,
        totalAmount: true,
        distributionDate: true,
        shop: { select: { region: { select: { name: true } } } },
      },
    }),
  ]);

  const totalSalesMap = new Map(
    totalSalesAgg.map((a) => [a.recordedById, Number(a._sum.totalAmount || 0)]),
  );

  return salesmen.map((s) => {
    const salesmanDists = last7DaysDistributions.filter(
      (d) => d.recordedById === s.id,
    );

    // Regions
    const regionSet = new Set<string>();
    salesmanDists.forEach((d) => {
      if (d.shop?.region?.name) regionSet.add(d.shop.region.name.toUpperCase());
    });

    // Daily Sales (last 7 days)
    const dailyMap = new Map<string, number>();
    salesmanDists.forEach((d) => {
      const dateKey = new Date(d.distributionDate).toISOString().split("T")[0];
      dailyMap.set(
        dateKey,
        (dailyMap.get(dateKey) || 0) + Number(d.totalAmount),
      );
    });

    const dailySales: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(todayStart);
      d.setDate(todayStart.getDate() - i);
      const key = d.toISOString().split("T")[0];
      dailySales.push(dailyMap.get(key) || 0);
    }

    return {
      id: s.id,
      name: s.name,
      email: s.email,
      isActive: s.isActive,
      totalSales: totalSalesMap.get(s.id) || 0,
      regions: Array.from(regionSet),
      dailySales,
    };
  });
}

export async function getRegions() {
  return prisma.region.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}

export type RegisterShopState = {
  success: boolean;
  error: string | null;
};

export async function registerShopAction(
  _prevState: RegisterShopState,
  formData: FormData,
): Promise<RegisterShopState> {
  const name = formData.get("name") as string;
  const regionId = formData.get("regionId") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const address = formData.get("address") as string;

  if (!name || !regionId) {
    return { success: false, error: "Name and Region are required." };
  }

  try {
    await prisma.shop.create({
      data: {
        name,
        regionId,
        phoneNumber,
        address,
      },
    });
    revalidatePath("/owner/shop-management");
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: "Failed to register shop." };
  }
}

export async function getShopDetails(shopId: string) {
  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
    include: {
      region: true,
      ledgers: {
        orderBy: { createdAt: "asc" },
        include: {
          payment: true,
          distribution: true,
        },
      },
    },
  });

  return shop;
}

// get-shop-ledgre data
export async function getShopLedgerData(shopId: string) {
  const [shop, aggregates] = await Promise.all([
    prisma.shop.findUnique({
      where: { id: shopId },
      include: {
        region: true,
        ledgers: {
          orderBy: { createdAt: "desc" },
          include: { payment: true, distribution: true },
        },
      },
    }),
    prisma.ledger.groupBy({
      where: { shopId },
      by: ["transactionType"],
      _sum: { amount: true },
    }),
  ]);

  if (!shop) return null;

  const totalPayments = Number(
    aggregates.find((a) => a.transactionType === "CREDIT")?._sum.amount || 0,
  );
  const totalBilling = Number(
    aggregates.find((a) => a.transactionType === "DEBIT")?._sum.amount || 0,
  );
  const lastPayment = shop.ledgers.find((l) => l.transactionType === "CREDIT");

  return {
    shop,
    metrics: {
      currentBalance: Number(shop.currentBalance),
      totalPayments,
      totalBilling,
      balanceOwed: Number(shop.currentBalance),
      lastPaymentDate: lastPayment ? lastPayment.createdAt : null,
    },
  };
}

export async function getDailyBrandRevenue(): Promise<BrandRevenueData> {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);

  const [activeBrands, distributions] = await Promise.all([
    prisma.brand.findMany({
      select: { name: true },
      where: { isActive: true },
    }),
    prisma.distribution.findMany({
      where: { distributionDate: { gte: startDate } },
      include: { brand: { select: { name: true } } },
    }),
  ]);

  const brandNames = new Set(activeBrands.map((b) => b.name));
  const revenueMap = new Map<string, BrandRevenueEntry>();

  const cursor = new Date(startDate);
  while (cursor <= now) {
    const dayKey = cursor.toISOString().split("T")[0];
    const entry: BrandRevenueEntry = { date: dayKey };
    for (const b of brandNames) entry[b] = 0;
    revenueMap.set(dayKey, entry);
    cursor.setDate(cursor.getDate() + 1);
  }

  for (const d of distributions) {
    const dayKey = new Date(d.distributionDate).toISOString().split("T")[0];
    const brandName = d.brand.name;
    const amount = Number(d.totalAmount);

    if (revenueMap.has(dayKey)) {
      const entry = revenueMap.get(dayKey)!;
      if (entry[brandName] === undefined) {
        entry[brandName] = 0;
        brandNames.add(brandName);
        revenueMap.forEach((e) => {
          if (e[brandName] === undefined) e[brandName] = 0;
        });
      }
      entry[brandName] = (entry[brandName] as number) + amount;
    }
  }

  return {
    data: Array.from(revenueMap.values()),
    brands: Array.from(brandNames),
  };
}
