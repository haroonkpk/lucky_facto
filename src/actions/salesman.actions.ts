"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  TransactionType,
  DealType,
  PaymentType,
  PaymentMethod,
  InventoryTransactionType,
} from "@/lib/generated/prisma/enums";
import { uploadReceipt } from "@/lib/upload-receipt";

// ─── Fetcherss

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
      { maxWait: 15000, timeout: 30000 },
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
      { maxWait: 15000, timeout: 30000 },
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
  const receiptFile = formData.get("receipt") as File | null;

  if (!type || !paymentMethod || isNaN(amount) || amount <= 0) {
    return { success: false, error: "Type, method, and amount are required." };
  }

  let receiptUrl = null;
  if (receiptFile && receiptFile.size > 0) {
    try {
      receiptUrl = await uploadReceipt(receiptFile);
    } catch {
      return { success: false, error: "Failed to upload receipt image." };
    }
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
            receiptUrl,
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
      { maxWait: 15000, timeout: 30000 },
    );

    revalidatePath("/salesman/payments");
    return { success: true, error: null };
  } catch (err) {
    console.error("Payment Error:", err);
    return { success: false, error: "Failed to record payment." };
  }
}

