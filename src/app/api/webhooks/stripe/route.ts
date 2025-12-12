import { NextRequest, NextResponse } from 'next/server';
import { stripe, mapPriceIdToTier } from '@/lib/stripe';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

// Disable body parsing for webhook signature verification
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('Missing stripe-signature header');
    return NextResponse.json(
      { error: 'Missing signature' },
      { status: 400 }
    );
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const error = err as Error;
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  // Handle subscription events
  if (
    event.type === 'customer.subscription.created' ||
    event.type === 'customer.subscription.updated' ||
    event.type === 'customer.subscription.deleted'
  ) {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    try {
      // Get customer from Stripe to find email
      const customer = await stripe.customers.retrieve(customerId);
      
      if (customer.deleted) {
        console.error('Customer was deleted');
        return NextResponse.json({ received: true });
      }

      const email = (customer as Stripe.Customer).email;
      const clerkUserId = (customer as Stripe.Customer).metadata?.clerkUserId;

      if (!email) {
        console.error('Customer email not found');
        return NextResponse.json({ received: true });
      }

      // Determine membership tier based on subscription status
      let membershipTier: 'free' | 'basic' | 'premium' | 'ultimate' = 'free';

      if (event.type === 'customer.subscription.deleted') {
        // Subscription deleted, set to free
        membershipTier = 'free';
      } else if (subscription.status === 'active' || subscription.status === 'trialing') {
        // Active subscription - get tier from price ID
        if (subscription.items.data.length > 0) {
          const priceId = subscription.items.data[0].price.id;
          membershipTier = mapPriceIdToTier(priceId);
        }
      } else {
        // Subscription is past_due, canceled, etc. - set to free
        membershipTier = 'free';
      }

      // Update user in database
      // Try to find by email first
      const dbUsers = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (dbUsers.length > 0) {
        // Update existing user
        await db
          .update(users)
          .set({
            membershipTier,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(users.id, dbUsers[0].id));
      } else if (clerkUserId) {
        // Try to find by Clerk ID
        const dbUsersByClerk = await db
          .select()
          .from(users)
          .where(eq(users.clerkId, clerkUserId))
          .limit(1);

        if (dbUsersByClerk.length > 0) {
          await db
            .update(users)
            .set({
              membershipTier,
              updatedAt: new Date().toISOString(),
            })
            .where(eq(users.id, dbUsersByClerk[0].id));
        }
      }

      // Also update Clerk metadata if clerkUserId is available
      if (clerkUserId) {
        // Note: This would require Clerk server-side SDK
        // For now, we'll update the database and let the user refresh
        // You can add Clerk metadata update here if needed
      }

      console.log(`Updated membership tier for ${email} to ${membershipTier}`);
    } catch (error) {
      console.error('Error processing subscription event:', error);
      // Return 200 to Stripe even on error to prevent retries
      return NextResponse.json({ received: true });
    }
  }

  // Return 200 to acknowledge receipt
  return NextResponse.json({ received: true });
}

