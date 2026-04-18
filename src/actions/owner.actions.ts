"use server";

import { Role } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
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
  const shops = await prisma.shop.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      region: { select: { name: true } },
      ledgers: { select: { amount: true, transactionType: true } },
    },
  });

  return shops.map((s) => {
    const totalPayments = s.ledgers
      .filter((l) => l.transactionType === "CREDIT")
      .reduce((sum, entry) => sum + Number(entry.amount), 0);

    const totalBilling = s.ledgers
      .filter((l) => l.transactionType === "DEBIT")
      .reduce((sum, entry) => sum + Number(entry.amount), 0);

    const balanceOwed = totalBilling - totalPayments;

    return {
      id: s.id,
      name: s.name,
      address: s.address,
      phoneNumber: s.phoneNumber,
      isActive: s.isActive,
      region: s.region.name,
      totalPayments,
      totalBilling,
      balanceOwed,
    };
  });
}

export async function getSalesmen(): Promise<SalesmanWithStats[]> {
  // Build the last-7-days date range (start of 6 days ago → end of today)
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(todayStart);
  sevenDaysAgo.setDate(todayStart.getDate() - 6); // inclusive: day-6 … today = 7 days

  const salesmen = await prisma.user.findMany({
    where: { role: Role.SALESMAN },
    orderBy: { createdAt: "asc" },
    include: {
      distributions: {
        where: { distributionDate: { gte: sevenDaysAgo } },
        include: {
          shop: {
            include: {
              region: { select: { name: true } },
            },
          },
        },
      },
      // Also fetch all distributions (without date filter) for totalSales
      _count: false,
    },
  });

  // Separately fetch totalSales for all time (no date filter)
  const allDistributions = await prisma.distribution.findMany({
    select: { recordedById: true, totalAmount: true },
  });

  // Group all-time sales by salesman id
  const totalSalesMap = new Map<string, number>();
  allDistributions.forEach((d) => {
    const prev = totalSalesMap.get(d.recordedById) ?? 0;
    totalSalesMap.set(d.recordedById, prev + Number(d.totalAmount));
  });

  return salesmen.map((s) => {
    // ── Regions ────────────────────────────────────────────────
    const regionSet = new Set<string>();
    s.distributions.forEach((d) => {
      if (d.shop?.region?.name) {
        regionSet.add(d.shop.region.name.toUpperCase());
      }
    });

    // ── Daily sales for last 7 days ────────────────────────────
    // Build a map: "YYYY-MM-DD" → total sales amount
    const dailyMap = new Map<string, number>();
    s.distributions.forEach((d) => {
      const date = new Date(d.distributionDate);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      const prev = dailyMap.get(key) ?? 0;
      dailyMap.set(key, prev + Number(d.totalAmount));
    });

    // Generate ordered array of 7 values (oldest → newest)
    const dailySales: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(todayStart);
      d.setDate(todayStart.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      dailySales.push(dailyMap.get(key) ?? 0);
    }

    return {
      id: s.id,
      name: s.name,
      email: s.email,
      isActive: s.isActive,
      totalSales: totalSalesMap.get(s.id) ?? 0,
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
  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
    include: {
      region: true,
      ledgers: {
        orderBy: { createdAt: "desc" },
        include: {
          payment: true,
          distribution: true,
        },
      },
    },
  });

  if (!shop) return null;

  const totalPayments = shop.ledgers
    .filter((l) => l.transactionType === "CREDIT")
    .reduce((sum, entry) => sum + Number(entry.amount), 0);

  const totalBilling = shop.ledgers
    .filter((l) => l.transactionType === "DEBIT")
    .reduce((sum, entry) => sum + Number(entry.amount), 0);

  const balanceOwed = totalBilling - totalPayments;

  const lastPayment = shop.ledgers.find((l) => l.transactionType === "CREDIT");

  return {
    shop,
    metrics: {
      currentBalance: Number(shop.currentBalance),
      totalPayments,
      totalBilling,
      balanceOwed,
      lastPaymentDate: lastPayment ? lastPayment.createdAt : null,
    },
  };
}
