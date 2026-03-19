import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import { db } from "@/lib/db"
import { stripe, PLANS } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (error: any) {
    console.error("Webhook signature verification failed:", error.message)
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
    const organizationId = session.metadata?.organizationId

    if (!organizationId) {
      console.error("No organization ID in session metadata")
      return NextResponse.json({ error: "Missing organization ID" }, { status: 400 })
    }

    let plan: "FREE" | "PRO" | "ENTERPRISE" = "PRO"
    let agentLimit = PLANS.PRO.agentLimit
    let scanLimit = PLANS.PRO.scanLimit

    if (subscription.items.data[0].price.id === PLANS.ENTERPRISE.priceId) {
      plan = "ENTERPRISE"
      agentLimit = PLANS.ENTERPRISE.agentLimit
      scanLimit = PLANS.ENTERPRISE.scanLimit
    }

    await db.organization.update({ where: { id: organizationId }, data: { stripeCustomerId: subscription.customer as string, stripeSubscriptionId: subscription.id, stripePriceId: subscription.items.data[0].price.id, stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000), plan, agentLimit, scanLimit } })
  }

  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice
    if (invoice.subscription) {
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
      await db.organization.updateMany({ where: { stripeSubscriptionId: subscription.id }, data: { stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000), scansUsed: 0 } })
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription
    await db.organization.updateMany({ where: { stripeSubscriptionId: subscription.id }, data: { plan: "FREE", stripeSubscriptionId: null, stripePriceId: null, stripeCurrentPeriodEnd: null, agentLimit: PLANS.FREE.agentLimit, scanLimit: PLANS.FREE.scanLimit } })
  }

  return NextResponse.json({ received: true })
}
