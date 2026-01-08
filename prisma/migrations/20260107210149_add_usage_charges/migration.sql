-- CreateEnum
CREATE TYPE "ChargeSource" AS ENUM ('CLIENT', 'USAGE');

-- DropForeignKey
ALTER TABLE "Charge" DROP CONSTRAINT "Charge_clientId_fkey";

-- AlterTable
ALTER TABLE "Charge" ADD COLUMN     "source" "ChargeSource" NOT NULL DEFAULT 'CLIENT',
ALTER COLUMN "clientId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Charge_source_idx" ON "Charge"("source");

-- AddForeignKey
ALTER TABLE "Charge" ADD CONSTRAINT "Charge_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Charge" ADD CONSTRAINT "Charge_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
