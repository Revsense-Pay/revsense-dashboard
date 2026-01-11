// src/lib/billing/isBillingActive.ts
import type { Account } from '@prisma/client'

export function isBillingActive(account: Account) {
  return (
    account.billingStatus === 'ACTIVE' &&
    !!account.billingCustomerCode &&
    !!account.billingAuthCode
  )
}