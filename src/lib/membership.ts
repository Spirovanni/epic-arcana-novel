/**
 * Membership Tier System
 *
 * Defines what content and features are accessible to different membership tiers.
 */

export type MembershipTier = 'free' | 'basic' | 'premium' | 'ultimate';

export interface MembershipFeatures {
  // Content Access
  canAccessChapters: boolean;
  maxChaptersAccess: number | 'unlimited'; // Number of chapters or unlimited
  canAccessCharacters: boolean;
  canAccessLocations: boolean;
  canAccessTimeline: boolean;
  canAccessWorldMap: boolean;

  // Features
  canTakeAssessment: boolean;
  canViewDetailedAssessmentResults: boolean;
  canAccess3DVisualization: boolean;
  canExportContent: boolean;
  canViewWritingGuidance: boolean;

  // Community & AI
  canComment: boolean;
  canRequestAIContent: boolean;
  maxAIRequestsPerDay: number;

  // Advanced Features
  canAccessAnalytics: boolean;
  canCustomizeUI: boolean;
  canDownloadOffline: boolean;
}

export const MEMBERSHIP_CONFIG: Record<MembershipTier, MembershipFeatures> = {
  free: {
    // Content Access - Very Limited
    canAccessChapters: true,
    maxChaptersAccess: 3, // First 3 chapters only
    canAccessCharacters: true, // Can view main characters only
    canAccessLocations: false,
    canAccessTimeline: false,
    canAccessWorldMap: false,

    // Features - Basic Only
    canTakeAssessment: true,
    canViewDetailedAssessmentResults: false, // Only see basic results
    canAccess3DVisualization: false,
    canExportContent: false,
    canViewWritingGuidance: false,

    // Community & AI - Very Limited
    canComment: false,
    canRequestAIContent: false,
    maxAIRequestsPerDay: 0,

    // Advanced Features - None
    canAccessAnalytics: false,
    canCustomizeUI: false,
    canDownloadOffline: false,
  },

  basic: {
    // Content Access - Moderate
    canAccessChapters: true,
    maxChaptersAccess: 10, // First 10 chapters
    canAccessCharacters: true,
    canAccessLocations: true,
    canAccessTimeline: true,
    canAccessWorldMap: true,

    // Features - Some Advanced
    canTakeAssessment: true,
    canViewDetailedAssessmentResults: true,
    canAccess3DVisualization: false,
    canExportContent: false,
    canViewWritingGuidance: true,

    // Community & AI - Limited
    canComment: true,
    canRequestAIContent: true,
    maxAIRequestsPerDay: 5,

    // Advanced Features - Limited
    canAccessAnalytics: false,
    canCustomizeUI: false,
    canDownloadOffline: false,
  },

  premium: {
    // Content Access - Almost Full
    canAccessChapters: true,
    maxChaptersAccess: 'unlimited',
    canAccessCharacters: true,
    canAccessLocations: true,
    canAccessTimeline: true,
    canAccessWorldMap: true,

    // Features - Most Available
    canTakeAssessment: true,
    canViewDetailedAssessmentResults: true,
    canAccess3DVisualization: true,
    canExportContent: true,
    canViewWritingGuidance: true,

    // Community & AI - Good Limits
    canComment: true,
    canRequestAIContent: true,
    maxAIRequestsPerDay: 25,

    // Advanced Features - Some
    canAccessAnalytics: true,
    canCustomizeUI: true,
    canDownloadOffline: false,
  },

  ultimate: {
    // Content Access - Full
    canAccessChapters: true,
    maxChaptersAccess: 'unlimited',
    canAccessCharacters: true,
    canAccessLocations: true,
    canAccessTimeline: true,
    canAccessWorldMap: true,

    // Features - All
    canTakeAssessment: true,
    canViewDetailedAssessmentResults: true,
    canAccess3DVisualization: true,
    canExportContent: true,
    canViewWritingGuidance: true,

    // Community & AI - Unlimited
    canComment: true,
    canRequestAIContent: true,
    maxAIRequestsPerDay: 100,

    // Advanced Features - All
    canAccessAnalytics: true,
    canCustomizeUI: true,
    canDownloadOffline: true,
  },
};

/**
 * Get features for a specific membership tier
 */
export function getMembershipFeatures(tier: MembershipTier): MembershipFeatures {
  return MEMBERSHIP_CONFIG[tier];
}

/**
 * Check if a user can access a specific chapter based on their membership
 */
export function canAccessChapter(
  membershipTier: MembershipTier,
  chapterNumber: number
): boolean {
  const features = getMembershipFeatures(membershipTier);

  if (!features.canAccessChapters) {
    return false;
  }

  if (features.maxChaptersAccess === 'unlimited') {
    return true;
  }

  return chapterNumber <= features.maxChaptersAccess;
}

/**
 * Check if a user can access a specific feature
 */
export function canAccessFeature(
  membershipTier: MembershipTier,
  feature: keyof MembershipFeatures
): boolean {
  const features = getMembershipFeatures(membershipTier);
  const featureValue = features[feature];

  // Handle boolean features
  if (typeof featureValue === 'boolean') {
    return featureValue;
  }

  // For numeric features, check if > 0
  if (typeof featureValue === 'number') {
    return featureValue > 0;
  }

  // For 'unlimited' string
  if (featureValue === 'unlimited') {
    return true;
  }

  return false;
}

/**
 * Get upgrade message for a specific feature
 */
export function getUpgradeMessage(
  currentTier: MembershipTier,
  feature: keyof MembershipFeatures
): string {
  const messages: Partial<Record<keyof MembershipFeatures, string>> = {
    canAccessChapters: 'Upgrade to access more chapters',
    canAccessLocations: 'Upgrade to explore locations',
    canAccessTimeline: 'Upgrade to view the timeline',
    canAccessWorldMap: 'Upgrade to explore the world map',
    canAccess3DVisualization: 'Upgrade to Premium for 3D character arc visualization',
    canExportContent: 'Upgrade to Premium to export content',
    canRequestAIContent: 'Upgrade to request AI-generated content',
    canAccessAnalytics: 'Upgrade to Premium to view analytics',
    canDownloadOffline: 'Upgrade to Ultimate for offline access',
  };

  return messages[feature] || `Upgrade your membership to access this feature`;
}

/**
 * Get the next tier that would unlock a feature
 */
export function getRequiredTierForFeature(
  feature: keyof MembershipFeatures
): MembershipTier | null {
  const tiers: MembershipTier[] = ['free', 'basic', 'premium', 'ultimate'];

  for (const tier of tiers) {
    if (canAccessFeature(tier, feature)) {
      return tier;
    }
  }

  return null;
}

/**
 * Pricing information for display
 */
export const MEMBERSHIP_PRICING = {
  free: {
    name: 'Free',
    price: 0,
    interval: null,
    description: 'Get started with basic access',
  },
  basic: {
    name: 'Basic',
    price: 9.99,
    interval: 'month',
    description: 'Access more chapters and features',
  },
  premium: {
    name: 'Premium',
    price: 19.99,
    interval: 'month',
    description: 'Full access to all content and features',
  },
  ultimate: {
    name: 'Ultimate',
    price: 49.99,
    interval: 'month',
    description: 'Everything in Premium plus priority support and early access',
  },
} as const;
