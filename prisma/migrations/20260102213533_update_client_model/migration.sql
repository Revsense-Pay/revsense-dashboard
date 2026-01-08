/*
  Warnings:

  - You are about to drop the column `paystackAuthorizationCode` on the `Client` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "paystackAuthorizationCode",
ADD COLUMN     "authorizationCode" TEXT,
ADD COLUMN     "status" "ClientStatus" NOT NULL DEFAULT 'PENDING';
