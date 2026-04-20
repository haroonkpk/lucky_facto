"use server";

import { prisma } from "@/lib/prisma";
import { Activity } from "@/types/activity";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  TransactionType,
  DealType,
  PaymentType,
  PaymentMethod,
  InventoryTransactionType,
} from "@/lib/generated/prisma/enums";

// ─── Fetchers

export async function getBrands() {
  return prisma.brand.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}

export async function getShops() {
  const shops = await prisma.shop.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  // Convert Decimal to number for serialization
  return shops.map((shop) => ({
    ...shop,
    currentBalance: Number(shop.currentBalance),
  }));
}

export async function getInventoryBalances() {
  return prisma.inventoryBalance.findMany({
    include: {
      brand: {
        select: { name: true },
      },
    },
  });
}

// ─── State Types

export type ActionState = {
  success: boolean;
  error: string | null;
};

// ─── Inventory Intake Action

export async function createInventoryIntakeAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const brandId = formData.get("brandId") as string;
  const quantity = parseInt(formData.get("quantity") as string);
  const intakeDate = formData.get("intakeDate") as string;
  const notes = formData.get("notes") as string;

  if (!brandId || isNaN(quantity) || quantity <= 0) {
    return { success: false, error: "Invalid brand or quantity." };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Unauthorized: session not found." };
  }

  try {
    await prisma.$transaction(
      async (tx) => {
        // 1. Create the intake entry
        const intake = await tx.inventoryIntake.create({
          data: {
            brandId,
            quantity,
            intakeDate: intakeDate ? new Date(intakeDate) : new Date(),
            notes,
            recordedById: user.id,
          },
        });

        // 2. Update the balance
        await tx.inventoryBalance.upsert({
          where: { brandId },
          update: {
            totalIntake: { increment: quantity },
            currentStock: { increment: quantity },
          },
          create: {
            brandId,
            totalIntake: quantity,
            currentStock: quantity,
            totalDistributed: 0,
          },
        });

        // Record in Inventory Ledger
        await tx.inventoryLedger.create({
          data: {
            brandId,
            quantity,
            type: InventoryTransactionType.STOCK_IN,
            referenceId: intake.id,
            description: "Factory Intake",
            date: intakeDate ? new Date(intakeDate) : new Date(),
          },
        });
      },
      { timeout: 15000 },
    );

    revalidatePath("/salesman/factory-intake");
    return { success: true, error: null };
  } catch (err) {
    console.error("Intake Error:", err);
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Failed to record factory intake.",
    };
  }
}

// ─── Distribution Action

export async function createDistributionAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const brandId = formData.get("brandId") as string;
  const shopId = formData.get("shopId") as string;
  const quantity = parseInt(formData.get("quantity") as string);
  const unitPrice = parseFloat(formData.get("unitPrice") as string);
  const distributionDate = formData.get("distributionDate") as string;
  const notes = formData.get("notes") as string;

  if (
    !brandId ||
    !shopId ||
    isNaN(quantity) ||
    quantity <= 0 ||
    isNaN(unitPrice)
  ) {
    return {
      success: false,
      error: "All fields are required and must be valid.",
    };
  }

  const totalAmount = quantity * unitPrice;

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Unauthorized: session not found." };
  }

  try {
    await prisma.$transaction(
      async (tx) => {
        // 0. Check Stock Availability
        const balance = await tx.inventoryBalance.findUnique({
          where: { brandId },
        });

        if (!balance || balance.currentStock < quantity) {
          throw new Error(
            `Insufficient stock. Maximum available is ${balance?.currentStock || 0} bags.`,
          );
        }

        // 1. Create Distribution record
        const distribution = await tx.distribution.create({
          data: {
            brandId,
            shopId,
            quantity,
            unitPrice,
            totalAmount,
            distributionDate: distributionDate
              ? new Date(distributionDate)
              : new Date(),
            notes,
            recordedById: user.id,
            dealType: DealType.VIA_SALESMAN,
          },
        });

        // 2. Create financial Ledger entry (DEBIT for the shop)
        await tx.ledger.create({
          data: {
            shopId,
            transactionType: TransactionType.DEBIT,
            amount: totalAmount,
            description: `Distribution: ${brandId} - Qty: ${quantity}`,
            distributionId: distribution.id,
          },
        });

        // 3. Update Inventory Balance (Atomic decrement)
        await tx.inventoryBalance.update({
          where: { brandId },
          data: {
            totalDistributed: { increment: quantity },
            currentStock: { decrement: quantity },
          },
        });

        // 4. Update Shop Balance (Atomic increment of balance owed)
        await tx.shop.update({
          where: { id: shopId },
          data: { currentBalance: { increment: totalAmount } },
        });

        // 5. Create InventoryLedger entry (STOCK_OUT)
        await tx.inventoryLedger.create({
          data: {
            brandId,
            quantity,
            type: InventoryTransactionType.STOCK_OUT,
            referenceId: distribution.id,
            description: `Distribution to Shop ID: ${shopId}`,
            date: distributionDate ? new Date(distributionDate) : new Date(),
          },
        });
      },
      { timeout: 15000 },
    );

    revalidatePath("/salesman/distribution");
    return { success: true, error: null };
  } catch (err) {
    console.error("Distribution Error:", err);
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Failed to record distribution.",
    };
  }
}

// ─── Payment Action

export async function createPaymentAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const type = formData.get("type") as PaymentType;
  const paymentMethod = formData.get("paymentMethod") as PaymentMethod;
  const amount = parseFloat(formData.get("amount") as string);
  const paymentDate = formData.get("paymentDate") as string;
  const shopId = formData.get("shopId") as string;
  const cashNote = formData.get("cashNote") as string;

  if (!type || !paymentMethod || isNaN(amount) || amount <= 0) {
    return { success: false, error: "Type, method, and amount are required." };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Unauthorized: session not found." };
  }

  try {
    await prisma.$transaction(
      async (tx) => {
        // 1. Create Payment record
        const payment = await tx.payment.create({
          data: {
            type,
            paymentMethod,
            amount,
            paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
            shopId: shopId || null,
            cashNote,
            recordedById: user.id,
            dealType: DealType.VIA_SALESMAN,
          },
        });

        // 2. If it's a shop collection, update ledger and balance
        if (type === PaymentType.SHOP_COLLECTION && shopId) {
          await tx.ledger.create({
            data: {
              shopId,
              transactionType: TransactionType.CREDIT,
              amount,
              description: `Payment received via ${paymentMethod}`,
              paymentId: payment.id,
            },
          });

          await tx.shop.update({
            where: { id: shopId },
            data: {
              currentBalance: { decrement: amount },
            },
          });
        }
      },
      { timeout: 15000 },
    );

    revalidatePath("/salesman/payments");
    return { success: true, error: null };
  } catch (err) {
    console.error("Payment Error:", err);
    return { success: false, error: "Failed to record payment." };
  }
}

// ─── Dashboard Actions ────────────────────────────────────────────────────────

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

export async function getSalesmanPendingPayments(userId: string) {
  const now = new Date();
  
  // 1. Fetch shops with positive balance and their latest activity
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

  if (shopsWithBalance.length === 0) return { totalPending: 0, shopCount: 0, shops: [] };

  const shopIds = shopsWithBalance.map((s) => s.id);

  const allDistributions = await prisma.distribution.findMany({
    where: { shopId: { in: shopIds } },
    orderBy: { createdAt: "desc" },
    select: { shopId: true, totalAmount: true, recordedById: true },
  });

  // Group distributions by shopId in memory for efficient processing
  const shopDistributionsMap = new Map<string, typeof allDistributions>();
  allDistributions.forEach((d) => {
    const list = shopDistributionsMap.get(d.shopId) || [];
    list.push(d);
    shopDistributionsMap.set(d.shopId, list);
  });

  let totalPending = 0;
  let shopCount = 0;
  const pendingShops = [];

  // 3. Process each shop's pending balance
  for (const shop of shopsWithBalance) {
    const distributions = shopDistributionsMap.get(shop.id) || [];
    let remainingBalance = Number(shop.currentBalance);
    let shopPendingForUser = 0;

    for (const dist of distributions) {
      if (remainingBalance <= 0) break;

      const distAmount = Number(dist.totalAmount);
      const unpaidAmountOfThisDist = Math.min(distAmount, remainingBalance);

      if (dist.recordedById === userId) {
        shopPendingForUser += unpaidAmountOfThisDist;
      }

      remainingBalance -= unpaidAmountOfThisDist;
    }

    if (shopPendingForUser > 0) {
      totalPending += shopPendingForUser;
      shopCount++;
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

  // Sort by amount descending
  pendingShops.sort((a, b) => b.amount - a.amount);

  return { totalPending, shopCount, shops: pendingShops };
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
