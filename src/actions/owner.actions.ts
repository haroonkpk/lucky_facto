"use server";

import { Role, PaymentType } from "@/lib/generated/prisma/enums";
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
};

export type ShopWithStats = {
  id: string;
  name: string;
  address: string | null;
  phoneNumber: string | null;
  isActive: boolean;
  region: string;
  totalPayments: number;  // sum of SHOP_COLLECTION payments
  pendingPayments: number; // sum of FACTORY_PAYMENT entries linked to shop
};

// ─── Actions ──────────────────────────────────────────────────────────────────

export async function getShops(): Promise<ShopWithStats[]> {
  const shops = await prisma.shop.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      region: { select: { name: true } },
      payments: { select: { amount: true, type: true } },
    },
  });

  return shops.map((s) => ({
    id: s.id,
    name: s.name,
    address: s.address,
    phoneNumber: s.phoneNumber,
    isActive: s.isActive,
    region: s.region.name,
    totalPayments: s.payments
      .filter((p) => p.type === PaymentType.SHOP_COLLECTION)
      .reduce((acc, p) => acc + Number(p.amount), 0),
    pendingPayments: s.payments
      .filter((p) => p.type === PaymentType.FACTORY_PAYMENT)
      .reduce((acc, p) => acc + Number(p.amount), 0),
  }));
}


export async function getSalesmen(): Promise<SalesmanWithStats[]> {
  const salesmen = await prisma.user.findMany({
    where: { role: Role.SALESMAN },
    orderBy: { createdAt: "desc" },
    include: {
      payments: {
        select: { amount: true },
      },
      distributions: {
        include: {
          shop: {
            include: {
              region: {
                select: { name: true },
              },
            },
          },
        },
      },
    },
  });

  return salesmen.map((s) => {
    const regionSet = new Set<string>();
    s.distributions.forEach((d) => {
      if (d.shop?.region?.name) {
        regionSet.add(d.shop.region.name.toUpperCase());
      }
    });

    return {
      id: s.id,
      name: s.name,
      email: s.email,
      isActive: s.isActive,
      totalSales: s.payments.reduce((acc, p) => acc + Number(p.amount), 0),
      regions: Array.from(regionSet),
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
    revalidatePath("/shop-management");
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


// ─── Data Fetching ─────────────────────────────────────────────────────────
export async function getShopLedgerData(shopId: string) {
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

  if (!shop) return null;

  const totalPayments = shop.ledgers
    .filter((l) => l.transactionType === "CREDIT")
    .reduce((sum, entry) => sum + Number(entry.amount), 0);

  const totalBilling = shop.ledgers
    .filter((l) => l.transactionType === "DEBIT")
    .reduce((sum, entry) => sum + Number(entry.amount), 0);

  const balanceOwed = totalBilling - totalPayments;

  return {
    shop,
    metrics: {
      currentBalance: Number(shop.currentBalance),
      totalPayments,
      totalBilling,
      balanceOwed,
    },
  };
}
