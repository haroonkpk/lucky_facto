-- CreateEnum
CREATE TYPE "InventoryTransactionType" AS ENUM ('STOCK_IN', 'STOCK_OUT');

-- CreateTable
CREATE TABLE "inventory_ledgers" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "type" "InventoryTransactionType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referenceId" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_ledgers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "inventory_ledgers" ADD CONSTRAINT "inventory_ledgers_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
