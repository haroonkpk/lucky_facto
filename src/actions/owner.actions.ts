"use server";

import { Role } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SalesmanWithStats = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  totalSales: number;
  regions: string[];
};

// ─── Actions ──────────────────────────────────────────────────────────────────

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