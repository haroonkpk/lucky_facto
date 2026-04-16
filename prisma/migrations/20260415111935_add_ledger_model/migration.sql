/*
  Warnings:

  - Added the required column `totalAmount` to the `distributions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPrice` to the `distributions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('CREDIT', 'DEBIT');

-- AlterEnum
ALTER TYPE "PaymentType" ADD VALUE 'ADVANCE_PAYMENT';

-- AlterTable
ALTER TABLE "distributions" ADD COLUMN     "totalAmount" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "unitPrice" DECIMAL(12,2) NOT NULL;

-- AlterTable
ALTER TABLE "shops" ADD COLUMN     "currentBalance" DECIMAL(12,2) NOT NULL DEFAULT 0.00;

-- CreateTable
CREATE TABLE "ledgers" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "transactionType" "TransactionType" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "description" TEXT,
    "paymentId" TEXT,
    "distributionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ledgers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ledgers_paymentId_key" ON "ledgers"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "ledgers_distributionId_key" ON "ledgers"("distributionId");

-- AddForeignKey
ALTER TABLE "ledgers" ADD CONSTRAINT "ledgers_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ledgers" ADD CONSTRAINT "ledgers_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ledgers" ADD CONSTRAINT "ledgers_distributionId_fkey" FOREIGN KEY ("distributionId") REFERENCES "distributions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
