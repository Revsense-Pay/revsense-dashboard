/*
  Warnings:

  - Added the required column `webhookSecretEncrypted` to the `PaystackKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaystackKey" ADD COLUMN     "webhookSecretEncrypted" TEXT NOT NULL;
