import { currentUser } from '@clerk/nextjs/server';
import { type MembershipTier, getMembershipFeatures, canAccessChapter, canAccessFeature } from './membership';

export async function isAdmin() {
  try {
    const user = await currentUser();

    if (!user) {
      return false;
    }

    // Check if user has admin role or specific email
    const isAdminUser = user.publicMetadata?.role === 'admin' ||
                       user.emailAddresses?.[0]?.emailAddress === 'admin@epicarcana.com' ||
                       user.emailAddresses?.[0]?.emailAddress === 'your-admin-email@example.com' ||
                       user.emailAddresses?.[0]?.emailAddress?.includes('@gmail.com'); // Temporary: allow gmail users admin access

    return isAdminUser;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

export async function requireAdmin() {
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    throw new Error('Admin access required');
  }
  return true;
}

/**
 * Get the user's membership tier from Clerk metadata
 */
export async function getUserMembershipTier(): Promise<MembershipTier> {
  try {
    const user = await currentUser();

    if (!user) {
      return 'free';
    }

    // Get membership tier from Clerk public metadata
    const membershipTier = user.publicMetadata?.membershipTier as MembershipTier | undefined;

    // Default to 'free' if not set
    return membershipTier || 'free';
  } catch (error) {
    console.error('Error getting membership tier:', error);
    return 'free';
  }
}

/**
 * Get comprehensive user permissions based on membership tier
 */
export async function getUserPermissions() {
  try {
    const user = await currentUser();

    if (!user) {
      return {
        canRead: false,
        canWrite: false,
        canAdmin: false,
        membershipTier: 'free' as MembershipTier,
        features: getMembershipFeatures('free')
      };
    }

    const isAdminUser = await isAdmin();
    const membershipTier = await getUserMembershipTier();
    const features = getMembershipFeatures(membershipTier);

    return {
      canRead: true, // All authenticated users can read
      canWrite: isAdminUser, // Only admins can write
      canAdmin: isAdminUser,
      membershipTier,
      features,
      userId: user.id,
      email: user.emailAddresses?.[0]?.emailAddress
    };
  } catch (error) {
    console.error('Error getting user permissions:', error);
    return {
      canRead: false,
      canWrite: false,
      canAdmin: false,
      membershipTier: 'free' as MembershipTier,
      features: getMembershipFeatures('free')
    };
  }
}

/**
 * Check if the current user can access a specific chapter
 */
export async function canUserAccessChapter(chapterNumber: number): Promise<boolean> {
  const membershipTier = await getUserMembershipTier();
  const isAdminUser = await isAdmin();

  // Admins can access everything
  if (isAdminUser) {
    return true;
  }

  return canAccessChapter(membershipTier, chapterNumber);
}

/**
 * Check if the current user can access a specific feature
 */
export async function canUserAccessFeature(feature: keyof ReturnType<typeof getMembershipFeatures>): Promise<boolean> {
  const membershipTier = await getUserMembershipTier();
  const isAdminUser = await isAdmin();

  // Admins can access everything
  if (isAdminUser) {
    return true;
  }

  return canAccessFeature(membershipTier, feature);
}

/**
 * Require a specific feature or throw an error
 */
export async function requireFeatureAccess(feature: keyof ReturnType<typeof getMembershipFeatures>) {
  const hasAccess = await canUserAccessFeature(feature);

  if (!hasAccess) {
    throw new Error(`This feature requires a higher membership tier`);
  }

  return true;
}

/**
 * Require access to a specific chapter or throw an error
 */
export async function requireChapterAccess(chapterNumber: number) {
  const hasAccess = await canUserAccessChapter(chapterNumber);

  if (!hasAccess) {
    throw new Error(`Chapter ${chapterNumber} requires a higher membership tier`);
  }

  return true;
}