/*
  Warnings:

  - Added the required column `category` to the `Equipment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Equipment" ADD COLUMN     "category" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Equipment_category_idx" ON "Equipment"("category");
