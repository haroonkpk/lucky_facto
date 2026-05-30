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
      where: { role: Role.SALESMAN, isActive: true },
      orderBy: { createdAt: "desc" },
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


// get-shop-ledgre data
export async function getShopLedgerData(
  shopId: string,
  startDate?: Date,
  endDate?: Date,
  brandId?: string,
  transactionType?: string,
) {
  const globalWhere = { shopId };
  const ledgerWhere: any = { shopId };

  if (startDate || endDate) {
    ledgerWhere.createdAt = {};
    if (startDate) ledgerWhere.createdAt.gte = startDate;
    if (endDate) {
      const end = new Date(endDate);
      end.setUTCHours(23, 59, 59, 999);
      ledgerWhere.createdAt.lte = end;
    }
  }

  if (brandId) {
    ledgerWhere.OR = [
      { distribution: { brandId } },
      { payment: { brandId } },
    ];
  }

  if (transactionType) {
    ledgerWhere.transactionType = transactionType;
  }

  const [shop, aggregates, lastPaymentEntry] = await Promise.all([
    prisma.shop.findUnique({
      where: { id: shopId },
      include: {
        region: true,
        ledgers: {
          where: ledgerWhere,
          orderBy: { createdAt: "desc" },
          include: {
            payment: { include: { recordedBy: true } },
            distribution: { include: { recordedBy: true, brand: true } },
          },
        },
      },
    }),
    prisma.ledger.groupBy({
      where: ledgerWhere,
      by: ["transactionType"],
      _sum: { amount: true },
    }),
    prisma.ledger.findFirst({
      where: {
        shopId,
        transactionType: "CREDIT",
      },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),
  ]);

  if (!shop) return null;

  const totalPayments = Number(
    aggregates.find((a) => a.transactionType === "CREDIT")?._sum.amount || 0,
  );
  const totalBilling = Number(
    aggregates.find((a) => a.transactionType === "DEBIT")?._sum.amount || 0,
  );

  return {
    shop,
    metrics: {
      currentBalance: Number(shop.currentBalance),
      totalPayments,
      totalBilling,
      periodBalanceOwed: totalBilling - totalPayments,
      balanceOwed: Number(shop.currentBalance),
      lastPaymentDate: lastPaymentEntry ? lastPaymentEntry.createdAt : null,
    },
  };
}

export type BrandState = {
  success: boolean;
  error: string | null;
};

export async function createBrandAction(
  _prevState: BrandState,
  formData: FormData,
): Promise<BrandState> {
  const name = formData.get("name") as string;
  const pricePerTonInput = formData.get("pricePerTon") as string;
  const pricePerBagInput = formData.get("pricePerBag") as string;
  const defaultUnit = formData.get("defaultUnit") as string;

  if (!name) {
    return { success: false, error: "Brand name is required." };
  }

  const pricePerTon = pricePerTonInput && !isNaN(parseFloat(pricePerTonInput)) ? parseFloat(pricePerTonInput) : null;
  const pricePerBag = pricePerBagInput && !isNaN(parseFloat(pricePerBagInput)) ? parseFloat(pricePerBagInput) : null;

  try {
    const existing = await prisma.brand.findUnique({
      where: { name },
    });

    if (existing) {
      return { success: false, error: "Brand with this name already exists." };
    }

    await prisma.brand.create({
      data: {
        name,
        pricePerTon,
        pricePerBag,
        defaultUnit: defaultUnit || "BAGS",
      },
    });

    revalidatePath("/owner/brand-management");
    revalidatePath("/salesman/factory-intake");
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: "Failed to create brand." };
  }
}

export async function updateBrandAction(
  _prevState: BrandState,
  formData: FormData,
): Promise<BrandState> {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const pricePerTonInput = formData.get("pricePerTon") as string;
  const pricePerBagInput = formData.get("pricePerBag") as string;
  const defaultUnit = formData.get("defaultUnit") as string;
  const isActiveStr = formData.get("isActive") as string;

  if (!id || !name) {
    return { success: false, error: "Brand ID and name are required." };
  }

  const pricePerTon = pricePerTonInput && !isNaN(parseFloat(pricePerTonInput)) ? parseFloat(pricePerTonInput) : null;
  const pricePerBag = pricePerBagInput && !isNaN(parseFloat(pricePerBagInput)) ? parseFloat(pricePerBagInput) : null;
  const isActive = isActiveStr !== "false"; // Default to true if not "false"

  try {
    await prisma.brand.update({
      where: { id },
      data: {
        name,
        pricePerTon,
        pricePerBag,
        defaultUnit: defaultUnit || "BAGS",
        isActive,
      },
    });

    revalidatePath("/owner/brand-management");
    revalidatePath("/salesman/factory-intake");
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: "Failed to update brand." };
  }
}

export async function deleteBrandAction(brandId: string): Promise<BrandState> {
  if (!brandId) {
    return { success: false, error: "Brand ID is required." };
  }

  try {
    const distCount = await prisma.distribution.count({ where: { brandId } });
    const intakeCount = await prisma.inventoryIntake.count({ where: { brandId } });
    if (distCount > 0 || intakeCount > 0) {
      return {
        success: false,
        error: "This brand has active intakes or distributions and cannot be deleted.",
      };
    }

    await prisma.brand.delete({
      where: { id: brandId },
    });

    revalidatePath("/owner/brand-management");
    revalidatePath("/salesman/factory-intake");
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: "Failed to delete brand." };
  }
}
