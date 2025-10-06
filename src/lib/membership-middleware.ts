/**
 * Membership Middleware
 *
 * Utilities for protecting API routes and server components based on membership tiers
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserPermissions, canUserAccessChapter, canUserAccessFeature } from './auth';
import { type MembershipFeatures } from './membership';

/**
 * Middleware to check if user has access to a feature
 * Usage in API routes:
 *
 * export async function GET(req: NextRequest) {
 *   const access = await requireFeature('canAccessTimeline');
 *   if (!access.allowed) {
 *     return access.response;
 *   }
 *   // ... rest of your code
 * }
 */
export async function requireFeature(feature: keyof MembershipFeatures): Promise<
  | { allowed: true; permissions: Awaited<ReturnType<typeof getUserPermissions>> }
  | { allowed: false; response: NextResponse }
> {
  try {
    const permissions = await getUserPermissions();

    if (!permissions.canRead) {
      return {
        allowed: false,
        response: NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        ),
      };
    }

    const hasAccess = permissions.features[feature];

    // Handle different types of feature values
    let allowed = false;
    if (typeof hasAccess === 'boolean') {
      allowed = hasAccess;
    } else if (typeof hasAccess === 'number') {
      allowed = hasAccess > 0;
    } else if (hasAccess === 'unlimited') {
      allowed = true;
    }

    if (!allowed) {
      return {
        allowed: false,
        response: NextResponse.json(
          {
            error: 'Insufficient permissions',
            feature,
            currentTier: permissions.membershipTier,
            message: `This feature requires a higher membership tier`,
          },
          { status: 403 }
        ),
      };
    }

    return {
      allowed: true,
      permissions,
    };
  } catch (error) {
    console.error('Error in requireFeature middleware:', error);
    return {
      allowed: false,
      response: NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      ),
    };
  }
}

/**
 * Middleware to check if user has access to a specific chapter
 */
export async function requireChapter(chapterNumber: number): Promise<
  | { allowed: true; permissions: Awaited<ReturnType<typeof getUserPermissions>> }
  | { allowed: false; response: NextResponse }
> {
  try {
    const permissions = await getUserPermissions();

    if (!permissions.canRead) {
      return {
        allowed: false,
        response: NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        ),
      };
    }

    const hasAccess = await canUserAccessChapter(chapterNumber);

    if (!hasAccess) {
      const maxChapters = permissions.features.maxChaptersAccess;

      return {
        allowed: false,
        response: NextResponse.json(
          {
            error: 'Insufficient permissions',
            chapterNumber,
            currentTier: permissions.membershipTier,
            maxChaptersAllowed: maxChapters,
            message: `Chapter ${chapterNumber} requires a higher membership tier`,
          },
          { status: 403 }
        ),
      };
    }

    return {
      allowed: true,
      permissions,
    };
  } catch (error) {
    console.error('Error in requireChapter middleware:', error);
    return {
      allowed: false,
      response: NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      ),
    };
  }
}

/**
 * Helper to get user permissions in a Server Component
 * Returns permissions or redirects to login
 */
export async function getPermissionsOrRedirect() {
  const permissions = await getUserPermissions();

  if (!permissions.canRead) {
    return null; // Component should redirect to sign-in
  }

  return permissions;
}

/**
 * Create a protected API handler
 *
 * Example usage:
 * export const GET = protectedRoute(
 *   async (req, permissions) => {
 *     // Your handler code with guaranteed permissions
 *     return NextResponse.json({ data: 'protected data' });
 *   },
 *   { requireAuth: true }
 * );
 */
export function protectedRoute(
  handler: (
    req: NextRequest,
    permissions: Awaited<ReturnType<typeof getUserPermissions>>
  ) => Promise<NextResponse>,
  options: {
    requireAuth?: boolean;
    requireAdmin?: boolean;
  } = {}
) {
  return async (req: NextRequest, context?: any) => {
    try {
      const permissions = await getUserPermissions();

      // Check authentication
      if (options.requireAuth && !permissions.canRead) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      // Check admin
      if (options.requireAdmin && !permissions.canAdmin) {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        );
      }

      // Call the actual handler with permissions
      return await handler(req, permissions);
    } catch (error) {
      console.error('Error in protected route:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Create a feature-protected API handler
 *
 * Example:
 * export const GET = featureProtectedRoute(
 *   'canAccessTimeline',
 *   async (req, permissions) => {
 *     // Handler code
 *   }
 * );
 */
export function featureProtectedRoute(
  feature: keyof MembershipFeatures,
  handler: (
    req: NextRequest,
    permissions: Awaited<ReturnType<typeof getUserPermissions>>
  ) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: any) => {
    const access = await requireFeature(feature);

    if (!access.allowed) {
      return access.response;
    }

    // TypeScript now knows permissions exists because allowed is true
    return await handler(req, access.permissions);
  };
}
