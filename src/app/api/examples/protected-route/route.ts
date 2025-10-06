/**
 * Example: Protected API Route
 *
 * Demonstrates different ways to protect API routes based on membership tier
 */

import { NextRequest, NextResponse } from 'next/server';
import { protectedRoute, featureProtectedRoute, requireFeature, requireChapter } from '@/lib/membership-middleware';

/**
 * Example 1: Basic protected route (requires authentication)
 */
export const GET = protectedRoute(
  async (req, permissions) => {
    return NextResponse.json({
      message: 'You are authenticated!',
      membershipTier: permissions.membershipTier,
      features: permissions.features,
    });
  },
  { requireAuth: true }
);

/**
 * Example 2: Admin-only route
 */
export async function DELETE(req: NextRequest) {
  const handler = protectedRoute(
    async (req, permissions) => {
      return NextResponse.json({
        message: 'Admin action completed',
        userId: permissions.userId,
      });
    },
    { requireAuth: true, requireAdmin: true }
  );

  return handler(req);
}

/**
 * Example 3: Feature-protected route (requires specific feature)
 * This route requires the user to have access to the timeline feature
 */
export async function POST(req: NextRequest) {
  // Method 1: Using helper function
  const access = await requireFeature('canAccessTimeline');

  if (!access.allowed) {
    return access.response;
  }

  // Your business logic here
  return NextResponse.json({
    message: 'Timeline data fetched successfully',
    data: {
      // ... timeline data
    },
  });
}

/**
 * Example 4: Chapter-protected route
 * Protects access to a specific chapter
 */
export async function PATCH(req: NextRequest) {
  // Get chapter number from request body
  const body = await req.json();
  const { chapterNumber } = body;

  if (!chapterNumber) {
    return NextResponse.json({ error: 'Chapter number required' }, { status: 400 });
  }

  // Check if user can access this chapter
  const access = await requireChapter(chapterNumber);

  if (!access.allowed) {
    return access.response;
  }

  // Your business logic here
  return NextResponse.json({
    message: `Chapter ${chapterNumber} content fetched successfully`,
    data: {
      // ... chapter data
    },
  });
}
