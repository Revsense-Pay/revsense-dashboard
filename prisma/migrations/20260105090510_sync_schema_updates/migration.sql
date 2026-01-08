-- CreateEnum
CREATE TYPE "BillingStatus" AS ENUM ('INACTIVE', 'ACTIVE', 'SUSPENDED');

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "billingAuthCode" TEXT,
ADD COLUMN     "billingCustomerCode" TEXT,
ADD COLUMN     "billingStatus" "BillingStatus" NOT NULL DEFAULT 'INACTIVE';
