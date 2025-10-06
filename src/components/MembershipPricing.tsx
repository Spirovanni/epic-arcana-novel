/**
 * Membership Pricing Component
 *
 * Displays pricing cards for all membership tiers
 */

'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { MEMBERSHIP_PRICING, MEMBERSHIP_CONFIG, type MembershipTier } from '@/lib/membership';
import { useMembership } from '@/hooks/useMembership';

interface MembershipPricingProps {
  onSelectTier?: (tier: MembershipTier) => void;
  highlightTier?: MembershipTier;
}

export function MembershipPricing({ onSelectTier, highlightTier = 'premium' }: MembershipPricingProps) {
  const membership = useMembership();
  const currentTier = membership.membershipTier;

  const tiers: MembershipTier[] = ['free', 'basic', 'premium', 'ultimate'];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {tiers.map((tier) => {
        const pricing = MEMBERSHIP_PRICING[tier];
        const features = MEMBERSHIP_CONFIG[tier];
        const isCurrentTier = tier === currentTier;
        const isHighlighted = tier === highlightTier;

        return (
          <Card
            key={tier}
            className={`relative flex flex-col ${
              isHighlighted ? 'border-primary shadow-lg' : ''
            } ${isCurrentTier ? 'ring-2 ring-primary' : ''}`}
          >
            {isHighlighted && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
            )}
            {isCurrentTier && (
              <Badge variant="secondary" className="absolute -top-3 right-4">
                Current Plan
              </Badge>
            )}

            <CardHeader>
              <CardTitle className="text-2xl capitalize">{pricing.name}</CardTitle>
              <CardDescription>{pricing.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">${pricing.price}</span>
                {pricing.interval && <span className="text-muted-foreground">/{pricing.interval}</span>}
              </div>
            </CardHeader>

            <CardContent className="flex-1">
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm">
                    {features.maxChaptersAccess === 'unlimited'
                      ? 'Unlimited chapters'
                      : `${features.maxChaptersAccess} chapters`}
                  </span>
                </li>

                {features.canAccessTimeline && (
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm">Timeline access</span>
                  </li>
                )}

                {features.canAccessWorldMap && (
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm">World map explorer</span>
                  </li>
                )}

                {features.canAccess3DVisualization && (
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm">3D character arcs</span>
                  </li>
                )}

                {features.canExportContent && (
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm">Export content</span>
                  </li>
                )}

                {features.maxAIRequestsPerDay > 0 && (
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm">{features.maxAIRequestsPerDay} AI requests/day</span>
                  </li>
                )}

                {features.canAccessAnalytics && (
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm">Analytics dashboard</span>
                  </li>
                )}

                {features.canDownloadOffline && (
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm">Offline access</span>
                  </li>
                )}
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                variant={isHighlighted ? 'default' : 'outline'}
                disabled={isCurrentTier}
                onClick={() => onSelectTier?.(tier)}
              >
                {isCurrentTier ? 'Current Plan' : tier === 'free' ? 'Get Started' : 'Upgrade'}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

/**
 * Feature comparison table
 */
export function MembershipFeatureComparison() {
  const features = [
    { name: 'Chapters Access', key: 'maxChaptersAccess' },
    { name: 'Timeline', key: 'canAccessTimeline' },
    { name: 'World Map', key: 'canAccessWorldMap' },
    { name: 'Character Profiles', key: 'canAccessCharacters' },
    { name: 'Locations', key: 'canAccessLocations' },
    { name: '3D Visualization', key: 'canAccess3DVisualization' },
    { name: 'Export Content', key: 'canExportContent' },
    { name: 'AI Requests/Day', key: 'maxAIRequestsPerDay' },
    { name: 'Comments', key: 'canComment' },
    { name: 'Analytics', key: 'canAccessAnalytics' },
    { name: 'Offline Access', key: 'canDownloadOffline' },
  ] as const;

  const tiers: MembershipTier[] = ['free', 'basic', 'premium', 'ultimate'];

  const formatValue = (value: any) => {
    if (typeof value === 'boolean') return value ? '✓' : '✗';
    if (value === 'unlimited') return '∞';
    if (typeof value === 'number' && value === 0) return '✗';
    return String(value);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-4 text-left font-medium">Feature</th>
            {tiers.map((tier) => (
              <th key={tier} className="p-4 text-center font-medium capitalize">
                {MEMBERSHIP_PRICING[tier].name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((feature, idx) => (
            <tr key={feature.key} className={idx % 2 === 0 ? 'bg-muted/50' : ''}>
              <td className="p-4 font-medium">{feature.name}</td>
              {tiers.map((tier) => {
                const config = MEMBERSHIP_CONFIG[tier];
                const value = config[feature.key as keyof typeof config];
                return (
                  <td key={tier} className="p-4 text-center">
                    {formatValue(value)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
