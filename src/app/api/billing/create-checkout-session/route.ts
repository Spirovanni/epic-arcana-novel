import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { stripe, getOrCreateStripeCustomer, mapTierToPriceId } from '@/lib/stripe';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import type { MembershipTier } from '@/lib/membership';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();
    const { tier } = body as { tier?: MembershipTier };

    if (!tier || !['basic', 'premium', 'ultimate'].includes(tier)) {
      return NextResponse.json(
        { error: 'Valid tier required (basic, premium, or ultimate)' },
        { status: 400 }
      );
    }

    // Get price ID for the tier
    const priceId = mapTierToPriceId(tier);
    if (!priceId) {
      return NextResponse.json(
        { error: `Price ID not configured for tier: ${tier}` },
        { status: 500 }
      );
    }

    // Get user email
    const email = user.emailAddresses[0]?.emailAddress;
    if (!email) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    const customer = await getOrCreateStripeCustomer(
      email,
      user.id,
      `${user.firstName || ''} ${user.lastName || ''}`.trim() || undefined
    );

    // Get base URL for redirects
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                    request.headers.get('origin') || 
                    'http://localhost:3000';

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/account?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${baseUrl}/account?canceled=true`,
      metadata: {
        clerkUserId: user.id,
        tier,
      },
    });

    // Update user record with Stripe customer ID if not present
    const dbUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, user.id))
      .limit(1);

    if (dbUser.length > 0) {
      // Note: We'll add stripeCustomerId field to schema if needed
      // For now, we can store it in a JSON field or add it later via migration
    }

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

