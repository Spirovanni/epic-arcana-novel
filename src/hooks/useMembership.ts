/**
 * Custom hook for accessing membership information in client components
 */

'use client';

import { useUser } from '@clerk/nextjs';
import { type MembershipTier, getMembershipFeatures, canAccessChapter, canAccessFeature } from '@/lib/membership';
import type { MembershipFeatures } from '@/lib/membership';

export function useMembership() {
  const { user, isLoaded } = useUser();

  // Get membership tier from Clerk user metadata
  const membershipTier = (user?.publicMetadata?.membershipTier as MembershipTier) || 'free';

  // Get features for current tier
  const features = getMembershipFeatures(membershipTier);

  // Check if user is admin (has full access)
  const isAdmin =
    user?.publicMetadata?.role === 'admin' ||
    user?.emailAddresses?.[0]?.emailAddress?.includes('@gmail.com'); // Temporary admin check

  return {
    isLoaded,
    membershipTier,
    features,
    isAdmin,

    /**
     * Check if user can access a specific chapter
     */
    canAccessChapter: (chapterNumber: number) => {
      if (isAdmin) return true;
      return canAccessChapter(membershipTier, chapterNumber);
    },

    /**
     * Check if user can access a specific feature
     */
    canAccessFeature: (feature: keyof MembershipFeatures) => {
      if (isAdmin) return true;
      return canAccessFeature(membershipTier, feature);
    },

    /**
     * Get the maximum number of chapters accessible
     */
    getMaxChaptersAccess: () => {
      if (isAdmin) return 'unlimited';
      return features.maxChaptersAccess;
    },

    /**
     * Check if user has any paid tier
     */
    isPaidMember: membershipTier !== 'free',

    /**
     * Check if user has premium or higher
     */
    isPremium: membershipTier === 'premium' || membershipTier === 'ultimate' || isAdmin,

    /**
     * Check if user has ultimate tier
     */
    isUltimate: membershipTier === 'ultimate' || isAdmin,
  };
}
