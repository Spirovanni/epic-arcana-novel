'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useMembership } from '@/hooks/useMembership';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import { MEMBERSHIP_PRICING, type MembershipTier } from '@/lib/membership';
import { Loader2, Check, Crown, BookOpen, Sparkles, Building2 } from 'lucide-react';

export default function AccountPage() {
  const { user, isLoaded } = useUser();
  const { membershipTier, features, isPaidMember } = useMembership();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check for success/cancel from Stripe redirect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('success') === 'true') {
        setSuccess('Subscription activated successfully!');
        // Clean up URL
        window.history.replaceState({}, '', '/account');
      } else if (params.get('canceled') === 'true') {
        setError('Subscription canceled');
        window.history.replaceState({}, '', '/account');
      }
    }
  }, []);

  const handleCheckout = async (tier: MembershipTier) => {
    if (tier === 'free') return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/billing/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tier }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create checkout session');
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/billing/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create portal session');
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No portal URL returned');
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      setLoading(false);
    }
  };

  const getTierIcon = (tier: MembershipTier) => {
    switch (tier) {
      case 'free':
        return <BookOpen className="w-5 h-5" />;
      case 'basic':
        return <BookOpen className="w-5 h-5" />;
      case 'premium':
        return <Sparkles className="w-5 h-5" />;
      case 'ultimate':
        return <Crown className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const tiers: MembershipTier[] = ['free', 'basic', 'premium', 'ultimate'];

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Authentication Required</CardTitle>
              <CardDescription className="text-center">
                Please sign in to view your account
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Account Settings</h1>
          <p className="text-muted-foreground text-lg">Manage your membership and billing</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <Card className="mb-6 border-green-500 bg-green-50 dark:bg-green-950">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <Check className="w-5 h-5" />
                <p>{success}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="mb-6 border-red-500 bg-red-50 dark:bg-red-950">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Membership Card */}
        <Card className="mb-8 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {getTierIcon(membershipTier)}
              Current Membership
            </CardTitle>
            <CardDescription>Your current subscription plan and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant={membershipTier === 'free' ? 'secondary' : 'default'} className="text-lg px-3 py-1">
                    {MEMBERSHIP_PRICING[membershipTier].name}
                  </Badge>
                  {membershipTier !== 'free' && (
                    <span className="text-sm text-muted-foreground">
                      ${MEMBERSHIP_PRICING[membershipTier].price}/{MEMBERSHIP_PRICING[membershipTier].interval}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {MEMBERSHIP_PRICING[membershipTier].description}
                </p>
              </div>
              {isPaidMember && (
                <Button
                  onClick={handleManageSubscription}
                  disabled={loading}
                  variant="outline"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Manage Subscription'
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Membership Tiers */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tiers.map((tier) => {
              const pricing = MEMBERSHIP_PRICING[tier];
              const isCurrentTier = tier === membershipTier;
              const isUpgrade = !isCurrentTier && (
                (tier === 'basic' && membershipTier === 'free') ||
                (tier === 'premium' && ['free', 'basic'].includes(membershipTier)) ||
                (tier === 'ultimate' && tier !== membershipTier)
              );

              return (
                <Card
                  key={tier}
                  className={`relative ${
                    isCurrentTier ? 'border-primary border-2' : ''
                  }`}
                >
                  {isCurrentTier && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="default">Current</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getTierIcon(tier)}
                      {pricing.name}
                    </CardTitle>
                    <CardDescription>{pricing.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="text-3xl font-bold">
                        {pricing.price === 0 ? 'Free' : `$${pricing.price}`}
                      </div>
                      {pricing.interval && (
                        <div className="text-sm text-muted-foreground">
                          per {pricing.interval}
                        </div>
                      )}
                    </div>
                    {isCurrentTier ? (
                      <Button disabled variant="outline" className="w-full">
                        Current Plan
                      </Button>
                    ) : isUpgrade ? (
                      <Button
                        onClick={() => handleCheckout(tier)}
                        disabled={loading || tier === 'free'}
                        className="w-full"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Upgrade'
                        )}
                      </Button>
                    ) : (
                      <Button disabled variant="outline" className="w-full">
                        Downgrade
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Card>

        {/* Features Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Comparison</CardTitle>
            <CardDescription>See what's included in each plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Feature</th>
                    {tiers.map((tier) => (
                      <th key={tier} className="text-center p-2">
                        {MEMBERSHIP_PRICING[tier].name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">Max Chapters</td>
                    {tiers.map((tier) => {
                      const tierFeatures = features;
                      return (
                        <td key={tier} className="text-center p-2">
                          {tier === 'free' ? '3' : tier === 'basic' ? '10' : 'Unlimited'}
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">3D Visualization</td>
                    {tiers.map((tier) => (
                      <td key={tier} className="text-center p-2">
                        {['premium', 'ultimate'].includes(tier) ? (
                          <Check className="w-4 h-4 mx-auto text-green-500" />
                        ) : (
                          '-'
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">AI Requests/Day</td>
                    {tiers.map((tier) => (
                      <td key={tier} className="text-center p-2">
                        {tier === 'free' ? '0' : tier === 'basic' ? '5' : tier === 'premium' ? '25' : '100'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2">Export Content</td>
                    {tiers.map((tier) => (
                      <td key={tier} className="text-center p-2">
                        {['premium', 'ultimate'].includes(tier) ? (
                          <Check className="w-4 h-4 mx-auto text-green-500" />
                        ) : (
                          '-'
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

