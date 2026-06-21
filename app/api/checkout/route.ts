import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

const PRICE_IDS: Record<string, { amount: number, interval: 'month' | 'year', interval_count: number }> = {
  monthly: { amount: 350, interval: 'month', interval_count: 1 },
  '6months': { amount: 1900, interval: 'month', interval_count: 6 },
  yearly: { amount: 3500, interval: 'year', interval_count: 1 },
}

export async function POST(req: Request) {
  try {
    const { plan } = await req.json()
    const config = PRICE_IDS[plan] || PRICE_IDS.monthly

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'bancontact', 'sepa_debit'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `PantrySnap Premium — ${plan}`,
            description: 'AI recipe suggestions from your fridge photo'
          },
          unit_amount: config.amount,
          recurring: {
            interval: config.interval,
            interval_count: config.interval_count,
          },
        },
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: 'http://localhost:3000?success=true',
      cancel_url: 'http://localhost:3000?cancelled=true',
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json({ error: 'Payment failed' }, { status: 500 })
  }
}