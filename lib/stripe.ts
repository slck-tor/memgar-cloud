import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
  typescript: true,
})

export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    agentLimit: 1,
    scanLimit: 1000,
    features: [
      "1 agent",
      "1,000 scans/month",
      "CLI access",
      "Community support",
      "7-day data retention",
    ],
  },
  PRO: {
    name: "Pro",
    price: 299,
    priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    agentLimit: 10,
    scanLimit: 50000,
    features: [
      "10 agents",
      "50,000 scans/month",
      "Dashboard + API",
      "Email support",
      "90-day data retention",
      "Slack integration",
      "PagerDuty integration",
    ],
  },
  ENTERPRISE: {
    name: "Enterprise",
    price: 2500,
    priceId: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID,
    agentLimit: -1,
    scanLimit: -1,
    features: [
      "Unlimited agents",
      "Unlimited scans",
      "Custom deployment",
      "SSO/SAML",
      "SLA (99.9%)",
      "Dedicated support",
      "Custom integrations",
      "Unlimited retention",
    ],
  },
} as const

export type PlanType = keyof typeof PLANS

export async function createCheckoutSession(
  organizationId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { organizationId },
  })
  return session
}

export async function createBillingPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
  return session
}

export async function getSubscription(subscriptionId: string) {
  return stripe.subscriptions.retrieve(subscriptionId)
}

export async function cancelSubscription(subscriptionId: string) {
  return stripe.subscriptions.cancel(subscriptionId)
}
