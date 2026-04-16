"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { TransactionType, DealType } from "@/lib/generated/prisma/enums";

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
  return shops.map(shop => ({
    ...shop,
    currentBalance: Number(shop.currentBalance)
  }));
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
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Unauthorized: session not found." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Create the intake entry
      await tx.inventoryIntake.create({
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
    });

    revalidatePath("/salesman/factory-intake");
    return { success: true, error: null };
  } catch (err) {
    console.error("Intake Error:", err);
    return { success: false, error: "Failed to record factory intake." };
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

  if (!brandId || !shopId || isNaN(quantity) || quantity <= 0 || isNaN(unitPrice)) {
    return { success: false, error: "All fields are required and must be valid." };
  }

  const totalAmount = quantity * unitPrice;

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Unauthorized: session not found." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Create Distribution record
      const distribution = await tx.distribution.create({
        data: {
          brandId,
          shopId,
          quantity,
          unitPrice,
          totalAmount,
          distributionDate: distributionDate ? new Date(distributionDate) : new Date(),
          notes,
          recordedById: user.id,
          dealType: DealType.VIA_SALESMAN,
        },
      });

      // 2. Create Ledger entry (DEBIT for the shop)
      await tx.ledger.create({
        data: {
          shopId,
          transactionType: TransactionType.DEBIT,
          amount: totalAmount,
          description: `Distribution of brand (${brandId}) - Qty: ${quantity}`,
          distributionId: distribution.id,
        },
      });

      // 3. Update Inventory Balance
      await tx.inventoryBalance.upsert({
        where: { brandId },
        update: {
          totalDistributed: { increment: quantity },
          currentStock: { decrement: quantity },
        },
        create: {
          brandId,
          totalIntake: 0,
          totalDistributed: quantity,
          currentStock: -quantity, 
        },
      });
      
      // 4. Update Shop Balance
      await tx.shop.update({
        where: { id: shopId },
        data: {
          currentBalance: { increment: totalAmount }
        }
      });

    });

    revalidatePath("/salesman/distribution");
    return { success: true, error: null };
  } catch (err) {
    console.error("Distribution Error:", err);
    return { success: false, error: "Failed to record distribution." };
  }
}
