import axios from 'axios'

type ChargeAuthParams = {
  authorizationCode: string
  email: string
  amount: number // cents
}

export async function paystackChargeAuthorization({
  authorizationCode,
  email,
  amount,
}: ChargeAuthParams) {
  const res = await axios.post(
    'https://api.paystack.co/transaction/charge_authorization',
    {
      authorization_code: authorizationCode,
      email,
      amount,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  )

  if (!res.data?.status) {
    throw new Error(res.data?.message || 'Paystack charge failed')
  }

  return res.data.data
}