/*
  Warnings:

  - You are about to drop the column `publicKey` on the `PaystackKey` table. All the data in the column will be lost.
  - You are about to drop the column `secretKey` on the `PaystackKey` table. All the data in the column will be lost.
  - Added the required column `publicKeyEncrypted` to the `PaystackKey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secretKeyEncrypted` to the `PaystackKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaystackKey" DROP COLUMN "publicKey",
DROP COLUMN "secretKey",
ADD COLUMN     "publicKeyEncrypted" TEXT NOT NULL,
ADD COLUMN     "secretKeyEncrypted" TEXT NOT NULL;
