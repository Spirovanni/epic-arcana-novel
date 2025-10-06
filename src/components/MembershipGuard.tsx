/**
 * MembershipGuard Component
 *
 * Protects content based on user's membership tier.
 * Shows upgrade prompt if user doesn't have access.
 */

'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import type { MembershipTier, MembershipFeatures } from '@/lib/membership';
import { getUpgradeMessage, getRequiredTierForFeature, MEMBERSHIP_PRICING } from '@/lib/membership';

interface MembershipGuardProps {
  children: React.ReactNode;
  feature?: keyof MembershipFeatures;
  chapterNumber?: number;
  currentTier: MembershipTier;
  hasAccess: boolean;
  fallback?: React.ReactNode;
}

export function MembershipGuard({
  children,
  feature,
  chapterNumber,
  currentTier,
  hasAccess,
  fallback,
}: MembershipGuardProps) {
  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  // Default upgrade prompt
  const requiredTier = feature ? getRequiredTierForFeature(feature) : 'basic';
  const upgradeMessage = feature
    ? getUpgradeMessage(currentTier, feature)
    : `Unlock chapter ${chapterNumber} with a membership upgrade`;

  const tierInfo = requiredTier ? MEMBERSHIP_PRICING[requiredTier] : null;

  return (
    <Card className="border-2 border-dashed">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
        <CardTitle>Premium Content</CardTitle>
        <CardDescription>{upgradeMessage}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        {tierInfo && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Requires <span className="font-semibold">{tierInfo.name}</span> tier
            </p>
            <p className="text-2xl font-bold">
              ${tierInfo.price}
              {tierInfo.interval && <span className="text-sm font-normal">/{tierInfo.interval}</span>}
            </p>
          </div>
        )}
        <Button asChild>
          <a href="/dashboard/membership">Upgrade Now</a>
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * Simple inline locked content indicator
 */
interface LockedBadgeProps {
  requiredTier?: MembershipTier;
  className?: string;
}

export function LockedBadge({ requiredTier, className = '' }: LockedBadgeProps) {
  return (
    <div className={`inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs ${className}`}>
      <Lock className="h-3 w-3" />
      {requiredTier && <span className="capitalize">{requiredTier}</span>}
    </div>
  );
}

/**
 * Blur overlay for locked content
 */
interface BlurredContentProps {
  children: React.ReactNode;
  message?: string;
  onUpgrade?: () => void;
}

export function BlurredContent({ children, message = 'Upgrade to view', onUpgrade }: BlurredContentProps) {
  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-sm">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
        <div className="text-center">
          <Lock className="mx-auto mb-2 h-8 w-8" />
          <p className="mb-4 font-medium">{message}</p>
          <Button onClick={onUpgrade} asChild>
            <a href="/dashboard/membership">Upgrade</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
