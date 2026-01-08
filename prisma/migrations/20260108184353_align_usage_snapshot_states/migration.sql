/*
  Warnings:

  - The values [PENDING,BILLED,FAILED] on the enum `UsageSnapshotStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `paystackReference` on the `Charge` table. All the data in the column will be lost.
  - You are about to drop the column `billedAt` on the `UsageSnapshot` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paystackRef]` on the table `Charge` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UsageSnapshotStatus_new" AS ENUM ('DRAFT', 'FINALISED', 'CHARGED');
ALTER TABLE "UsageSnapshot" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "UsageSnapshot" ALTER COLUMN "status" TYPE "UsageSnapshotStatus_new" USING ("status"::text::"UsageSnapshotStatus_new");
ALTER TYPE "UsageSnapshotStatus" RENAME TO "UsageSnapshotStatus_old";
ALTER TYPE "UsageSnapshotStatus_new" RENAME TO "UsageSnapshotStatus";
DROP TYPE "UsageSnapshotStatus_old";
ALTER TABLE "UsageSnapshot" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- AlterTable
ALTER TABLE "Charge" DROP COLUMN "paystackReference",
ADD COLUMN     "paystackRef" TEXT;

-- AlterTable
ALTER TABLE "UsageSnapshot" DROP COLUMN "billedAt",
ADD COLUMN     "chargedAt" TIMESTAMP(3),
ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- CreateIndex
CREATE UNIQUE INDEX "Charge_paystackRef_key" ON "Charge"("paystackRef");
