-- CreateTable
CREATE TABLE "UsageSnapshot" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "grossCents" INTEGER NOT NULL,
    "feeCents" INTEGER NOT NULL,
    "feePercent" DOUBLE PRECISION NOT NULL,
    "charged" BOOLEAN NOT NULL DEFAULT false,
    "chargeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsageSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UsageSnapshot_accountId_idx" ON "UsageSnapshot"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "UsageSnapshot_accountId_period_key" ON "UsageSnapshot"("accountId", "period");
