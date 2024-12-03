/*
  Warnings:

  - You are about to drop the column `assignedTo` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_assignedTo_fkey";

-- DropIndex
DROP INDEX "Task_assignedTo_idx";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "assignedTo",
DROP COLUMN "notes",
ADD COLUMN     "bookingId" TEXT,
ADD COLUMN     "cleanerId" TEXT;

-- CreateIndex
CREATE INDEX "Task_cleanerId_idx" ON "Task"("cleanerId");

-- CreateIndex
CREATE INDEX "Task_bookingId_idx" ON "Task"("bookingId");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_cleanerId_fkey" FOREIGN KEY ("cleanerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
