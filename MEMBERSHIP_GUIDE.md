# Membership System Guide

This guide explains how to use the membership tier system to control content visibility and feature access in your application.

## Overview

The membership system provides **four tiers** with progressively more features:

- **Free**: Limited access (3 chapters, basic features)
- **Basic**: Moderate access (10 chapters, most features)
- **Premium**: Full access (unlimited chapters, all features except ultimate-only)
- **Ultimate**: Complete access (everything + exclusive features)

## Quick Start

### 1. Database Migration

First, run the database migration to add the membership tier to your users table:

```bash
npx drizzle-kit push
```

This will add:
- `membership_tier` enum column to users table
- `membership_expires_at` timestamp column (for subscription tracking)

### 2. Set User Membership Tier in Clerk

Users' membership tiers are stored in Clerk's `publicMetadata`. To set a user's tier:

```javascript
// In your Clerk dashboard or API:
await clerkClient.users.updateUserMetadata(userId, {
  publicMetadata: {
    membershipTier: 'premium' // or 'free', 'basic', 'ultimate'
  }
});
```

## Usage Examples

### In Client Components

Use the `useMembership` hook:

```tsx
'use client';

import { useMembership } from '@/hooks/useMembership';
import { MembershipGuard } from '@/components/MembershipGuard';

export function MyComponent() {
  const membership = useMembership();

  // Check chapter access
  const canReadChapter5 = membership.canAccessChapter(5);

  // Check feature access
  const canUseTimeline = membership.canAccessFeature('canAccessTimeline');

  return (
    <div>
      <h1>Your Tier: {membership.membershipTier}</h1>

      {/* Protect specific content */}
      <MembershipGuard
        feature="canAccessTimeline"
        currentTier={membership.membershipTier}
        hasAccess={canUseTimeline}
      >
        <TimelineComponent />
      </MembershipGuard>

      {/* Protect chapters */}
      <MembershipGuard
        chapterNumber={10}
        currentTier={membership.membershipTier}
        hasAccess={membership.canAccessChapter(10)}
      >
        <ChapterContent chapterNumber={10} />
      </MembershipGuard>
    </div>
  );
}
```

### In Server Components

Use server-side auth functions:

```tsx
import { getUserPermissions, canUserAccessChapter } from '@/lib/auth';
import { MembershipGuard } from '@/components/MembershipGuard';

export default async function ServerPage() {
  const permissions = await getUserPermissions();
  const canAccessChapter10 = await canUserAccessChapter(10);

  return (
    <div>
      <h1>Tier: {permissions.membershipTier}</h1>

      <MembershipGuard
        chapterNumber={10}
        currentTier={permissions.membershipTier}
        hasAccess={canAccessChapter10}
      >
        <ChapterContent />
      </MembershipGuard>
    </div>
  );
}
```

### In API Routes

Use middleware helpers:

```typescript
// Method 1: Using protectedRoute wrapper
import { protectedRoute } from '@/lib/membership-middleware';

export const GET = protectedRoute(
  async (req, permissions) => {
    // permissions.membershipTier, permissions.features available
    return NextResponse.json({ data: 'protected' });
  },
  { requireAuth: true }
);

// Method 2: Using featureProtectedRoute
import { featureProtectedRoute } from '@/lib/membership-middleware';

export const GET = featureProtectedRoute(
  'canAccessTimeline',
  async (req, permissions) => {
    // Only users with timeline access can reach this
    return NextResponse.json({ timeline: [...] });
  }
);

// Method 3: Manual check
import { requireFeature, requireChapter } from '@/lib/membership-middleware';

export async function POST(req: NextRequest) {
  const access = await requireFeature('canExportContent');

  if (!access.allowed) {
    return access.response; // Returns 403 with error message
  }

  // Your logic here
  return NextResponse.json({ success: true });
}

// Method 4: Chapter protection
export async function GET(req: NextRequest) {
  const chapterNumber = 15;
  const access = await requireChapter(chapterNumber);

  if (!access.allowed) {
    return access.response;
  }

  return NextResponse.json({ chapter: {...} });
}
```

## Membership Features Configuration

Edit [src/lib/membership.ts](src/lib/membership.ts) to modify what each tier can access:

```typescript
export const MEMBERSHIP_CONFIG: Record<MembershipTier, MembershipFeatures> = {
  free: {
    canAccessChapters: true,
    maxChaptersAccess: 3, // First 3 chapters only
    canAccessTimeline: false,
    canAccess3DVisualization: false,
    // ... more features
  },
  basic: {
    canAccessChapters: true,
    maxChaptersAccess: 10,
    canAccessTimeline: true,
    // ... more features
  },
  // ... premium and ultimate tiers
};
```

## Available Features

The following features can be controlled per tier:

### Content Access
- `canAccessChapters` - Can read chapters
- `maxChaptersAccess` - Number or 'unlimited'
- `canAccessCharacters` - Character profiles
- `canAccessLocations` - Location explorer
- `canAccessTimeline` - Timeline feature
- `canAccessWorldMap` - World map

### Features
- `canTakeAssessment` - Assessment quiz
- `canViewDetailedAssessmentResults` - Full assessment results
- `canAccess3DVisualization` - 3D character arcs
- `canExportContent` - Export/download
- `canViewWritingGuidance` - Writing guides

### Community & AI
- `canComment` - Leave comments
- `canRequestAIContent` - AI features
- `maxAIRequestsPerDay` - Daily AI limit

### Advanced
- `canAccessAnalytics` - Analytics dashboard
- `canCustomizeUI` - UI customization
- `canDownloadOffline` - Offline mode

## Components

### MembershipGuard

Wraps content that requires specific access:

```tsx
<MembershipGuard
  feature="canAccessTimeline"
  currentTier={membership.membershipTier}
  hasAccess={hasAccess}
  fallback={<CustomUpgradePrompt />} // optional
>
  <ProtectedContent />
</MembershipGuard>
```

### BlurredContent

Shows blurred preview of locked content:

```tsx
<BlurredContent message="Premium feature">
  <ExpensiveFeature />
</BlurredContent>
```

### LockedBadge

Small indicator for locked items:

```tsx
<div>
  Chapter 15 {!canAccess && <LockedBadge requiredTier="premium" />}
</div>
```

## Testing Different Tiers

To test different membership tiers:

1. **Using Clerk Dashboard**: Update user's `publicMetadata.membershipTier`
2. **Locally**: Temporarily modify the `getUserMembershipTier` function
3. **Example Page**: Visit `/examples/membership-example` to see all tiers in action

## Pricing Display

Show pricing information:

```tsx
import { MEMBERSHIP_PRICING } from '@/lib/membership';

const premiumInfo = MEMBERSHIP_PRICING.premium;
// { name: 'Premium', price: 19.99, interval: 'month', description: '...' }
```

## Admin Override

Users marked as admin (in Clerk or via email check) automatically bypass all membership restrictions.

## Next Steps

1. **Payment Integration**: Connect with Stripe/Paddle to handle subscriptions
2. **Subscription Management**: Track `membershipExpiresAt` field
3. **Webhooks**: Update Clerk metadata when subscription changes
4. **UI Polish**: Customize upgrade prompts and pricing pages

## Files Created

- [`src/lib/membership.ts`](src/lib/membership.ts) - Tier configuration
- [`src/lib/membership-middleware.ts`](src/lib/membership-middleware.ts) - API protection
- [`src/lib/auth.ts`](src/lib/auth.ts) - Updated with membership checks
- [`src/hooks/useMembership.ts`](src/hooks/useMembership.ts) - Client hook
- [`src/components/MembershipGuard.tsx`](src/components/MembershipGuard.tsx) - UI components
- [`drizzle/schema.ts`](drizzle/schema.ts) - Database schema updates
- Example implementations in `src/app/examples/`

## Support

For questions or issues with the membership system, refer to the example implementations or check the inline documentation in each file.
