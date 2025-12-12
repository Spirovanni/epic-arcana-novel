# Stripe Integration Setup Guide

This guide explains how to set up Stripe billing for the Epic Arcana membership tiers.

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Access to Stripe Dashboard
3. Environment variables configured

## Step 1: Create Products and Prices in Stripe

1. Log in to your Stripe Dashboard
2. Navigate to **Products** → **Add Product**

Create the following products with recurring prices:

### Basic Tier
- **Product Name**: Basic Membership
- **Price**: $9.99/month (recurring)
- **Billing Period**: Monthly
- **Copy the Price ID** (starts with `price_...`)

### Premium Tier
- **Product Name**: Premium Membership
- **Price**: $19.99/month (recurring)
- **Billing Period**: Monthly
- **Copy the Price ID** (starts with `price_...`)

### Ultimate Tier
- **Product Name**: Ultimate Membership
- **Price**: $49.99/month (recurring)
- **Billing Period**: Monthly
- **Copy the Price ID** (starts with `price_...`)

**Note**: The Free tier doesn't need a Stripe product since it's free.

## Step 2: Configure Environment Variables

Add the following to your `.env.local` file:

```env
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_... # Your Stripe Secret Key (from Dashboard → Developers → API keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... # Your Stripe Publishable Key
STRIPE_WEBHOOK_SECRET=whsec_... # Will be generated in Step 3

# Stripe Price IDs (from Step 1)
STRIPE_PRICE_ID_BASIC=price_...
STRIPE_PRICE_ID_PREMIUM=price_...
STRIPE_PRICE_ID_ULTIMATE=price_...

# App URL (for redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000 # Change to your production URL in production
```

## Step 3: Set Up Webhook Endpoint

### For Local Development

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login to Stripe CLI: `stripe login`
3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
4. Copy the webhook signing secret (starts with `whsec_...`) and add it to `.env.local` as `STRIPE_WEBHOOK_SECRET`

### For Production

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set endpoint URL to: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen for:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the **Signing secret** and add it to your production environment variables

## Step 4: Test the Integration

### Test Mode

1. Use Stripe test cards:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Use any future expiry date and any CVC

2. Test the flow:
   - Visit `/account`
   - Click "Upgrade" on a tier
   - Complete checkout with test card
   - Verify webhook updates membership tier in database
   - Check that user can access tier-specific features

### Verify Webhook Events

Check Stripe Dashboard → **Developers** → **Events** to see webhook events being sent and their status.

## Architecture Overview

### API Routes

- **`/api/billing/create-checkout-session`**: Creates a Stripe Checkout session for new subscriptions
- **`/api/billing/create-portal-session`**: Creates a Stripe Customer Portal session for managing subscriptions
- **`/api/webhooks/stripe`**: Handles Stripe webhook events to sync subscription status

### Database Updates

The webhook handler automatically updates the `users.membershipTier` field when:
- A subscription is created
- A subscription is updated (upgrade/downgrade)
- A subscription is canceled (downgrades to 'free')

### Customer Management

Stripe customers are created automatically on first checkout and linked to users via:
- Email address (primary lookup)
- Clerk User ID (stored in Stripe customer metadata)

## Troubleshooting

### Webhook Not Receiving Events

1. Check webhook endpoint URL is correct
2. Verify `STRIPE_WEBHOOK_SECRET` matches the signing secret from Stripe
3. Check Stripe Dashboard → Events for webhook delivery status
4. For local development, ensure Stripe CLI is running

### Membership Tier Not Updating

1. Check webhook events in Stripe Dashboard
2. Verify database connection
3. Check server logs for errors
4. Ensure user exists in database with matching email

### Checkout Session Not Creating

1. Verify `STRIPE_SECRET_KEY` is set correctly
2. Check that Price IDs are valid and active in Stripe
3. Verify user is authenticated (Clerk)
4. Check browser console and server logs for errors

## Security Notes

- Never expose `STRIPE_SECRET_KEY` in client-side code
- Always verify webhook signatures using `STRIPE_WEBHOOK_SECRET`
- Use environment variables for all sensitive keys
- In production, use HTTPS for webhook endpoints

## Next Steps

After setup:
1. Test all subscription flows (upgrade, downgrade, cancel)
2. Set up email notifications (optional, via Stripe)
3. Configure tax settings if needed
4. Set up production webhook endpoint
5. Switch to live mode keys when ready

