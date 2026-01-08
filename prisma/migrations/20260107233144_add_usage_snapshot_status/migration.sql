/*
  Warnings:

  - You are about to drop the column `charged` on the `UsageSnapshot` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UsageSnapshotStatus" AS ENUM ('PENDING', 'BILLED', 'FAILED');

-- AlterTable
ALTER TABLE "UsageSnapshot" DROP COLUMN "charged",
ADD COLUMN     "billedAt" TIMESTAMP(3),
ADD COLUMN     "status" "UsageSnapshotStatus" NOT NULL DEFAULT 'PENDING';
