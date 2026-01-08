export const REVSENSE_FEE_PERCENT = 0.0075 // 0.75%

export function calculateUsageFee(grossAmountCents: number) {
  return Math.round(grossAmountCents * REVSENSE_FEE_PERCENT)
}