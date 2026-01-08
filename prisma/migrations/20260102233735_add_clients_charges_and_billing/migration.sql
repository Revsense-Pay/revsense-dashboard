/*
  Warnings:

  - You are about to drop the column `webhookSecretEncrypted` on the `PaystackKey` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PaystackKey" DROP COLUMN "webhookSecretEncrypted";

-- CreateIndex
CREATE INDEX "Charge_clientId_idx" ON "Charge"("clientId");

-- CreateIndex
CREATE INDEX "Charge_accountId_idx" ON "Charge"("accountId");
