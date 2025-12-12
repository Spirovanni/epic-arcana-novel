/**
 * Stripe Integration Utilities
 * 
 * Handles Stripe configuration, customer management, and tier mapping
 */

import Stripe from 'stripe';
import type { MembershipTier } from './membership';

let stripeClient: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
    typescript: true,
  });
} else {
  console.warn('[Stripe] STRIPE_SECRET_KEY not set; Stripe features are disabled.');
}

export const stripe = stripeClient;

export function isStripeConfigured(): boolean {
  return Boolean(stripeClient);
}

function requireStripe(): Stripe {
  if (!stripeClient) {
    throw new Error('Stripe is not configured');
  }
  return stripeClient;
}

/**
 * Map Stripe Price IDs to Membership Tiers
 * These should be set in your .env file and created in Stripe Dashboard
 */
export const TIER_PRICE_IDS: Record<MembershipTier, string | null> = {
  free: null, // Free tier has no price ID
  basic: process.env.STRIPE_PRICE_ID_BASIC || null,
  premium: process.env.STRIPE_PRICE_ID_PREMIUM || null,
  ultimate: process.env.STRIPE_PRICE_ID_ULTIMATE || null,
};

/**
 * Map Price ID to Membership Tier
 * 
 * @param priceId - The Stripe Price ID to map
 * @returns The corresponding MembershipTier, or 'free' if no match found
 */
export function mapPriceIdToTier(priceId: string): MembershipTier {
  // Skip null/empty values to avoid false matches
  for (const [tier, tierPriceId] of Object.entries(TIER_PRICE_IDS)) {
    // Only compare if tierPriceId is a non-empty string
    if (tierPriceId && tierPriceId === priceId) {
      return tier as MembershipTier;
    }
  }
  
  // Log warning if price ID doesn't match (helps with debugging)
  console.warn(
    `[Stripe] Price ID "${priceId}" does not match any configured tier. ` +
    `Ensure STRIPE_PRICE_ID_* environment variables are set correctly. ` +
    `Defaulting to 'free' tier.`
  );
  
  // Default to free if price ID doesn't match
  return 'free';
}

/**
 * Map Membership Tier to Price ID
 */
export function mapTierToPriceId(tier: MembershipTier): string | null {
  return TIER_PRICE_IDS[tier];
}

/**
 * Get or create a Stripe Customer for a user
 */
export async function getOrCreateStripeCustomer(
  email: string,
  clerkUserId: string,
  name?: string
): Promise<Stripe.Customer> {
  const client = requireStripe();

  // First, try to find existing customer by email
  const existingCustomers = await client.customers.list({
    email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    const customer = existingCustomers.data[0];
    // Update metadata to include Clerk user ID if not present
    if (!customer.metadata?.clerkUserId) {
      await client.customers.update(customer.id, {
        metadata: {
          ...customer.metadata,
          clerkUserId,
        },
      });
    }
    return customer;
  }

  // Create new customer
  const customer = await client.customers.create({
    email,
    name: name || email,
    metadata: {
      clerkUserId,
    },
  });

  return customer;
}

/**
 * Get active subscription for a customer
 */
export async function getActiveSubscription(
  customerId: string
): Promise<Stripe.Subscription | null> {
  const client = requireStripe();

  const subscriptions = await client.subscriptions.list({
    customer: customerId,
    status: 'active',
    limit: 1,
  });

  return subscriptions.data.length > 0 ? subscriptions.data[0] : null;
}

/**
 * Get membership tier from active subscription
 */
export async function getTierFromSubscription(
  customerId: string
): Promise<MembershipTier> {
  const subscription = await getActiveSubscription(customerId);
  
  if (!subscription || subscription.items.data.length === 0) {
    return 'free';
  }

  const priceId = subscription.items.data[0].price.id;
  return mapPriceIdToTier(priceId);
}
