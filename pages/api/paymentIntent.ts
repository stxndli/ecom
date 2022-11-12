// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const stripe = require('stripe')(process.env.STRIPE_SECRET);
type Data = {
  clientSecret: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const paymentIntent = await stripe.paymentIntents.create({
  amount: Math.floor(req.body.amount),
  currency: 'usd',
  metadata: {integration_check: 'accept_a_payment'},
  })
  const clientSecret = paymentIntent.client_secret
  res.status(200).json({ clientSecret: clientSecret })
}
