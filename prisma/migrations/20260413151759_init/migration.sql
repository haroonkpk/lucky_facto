/*
  Warnings:

  - You are about to drop the column `brand` on the `distributions` table. All the data in the column will be lost.
  - You are about to drop the column `brand` on the `inventory_balance` table. All the data in the column will be lost.
  - You are about to drop the column `brand` on the `inventory_intakes` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `shops` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[brandId]` on the table `inventory_balance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `brandId` to the `distributions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brandId` to the `inventory_balance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brandId` to the `inventory_intakes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `regionId` to the `shops` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "inventory_balance_brand_key";

-- AlterTable
ALTER TABLE "distributions" DROP COLUMN "brand",
ADD COLUMN     "brandId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "inventory_balance" DROP COLUMN "brand",
ADD COLUMN     "brandId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "inventory_intakes" DROP COLUMN "brand",
ADD COLUMN     "brandId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "shops" DROP COLUMN "region",
ADD COLUMN     "regionId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Brand";

-- DropEnum
DROP TYPE "Region";

-- CreateTable
CREATE TABLE "regions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "regions_name_key" ON "regions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "brands_name_key" ON "brands"("name");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_balance_brandId_key" ON "inventory_balance"("brandId");

-- AddForeignKey
ALTER TABLE "shops" ADD CONSTRAINT "shops_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_intakes" ADD CONSTRAINT "inventory_intakes_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distributions" ADD CONSTRAINT "distributions_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_balance" ADD CONSTRAINT "inventory_balance_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
