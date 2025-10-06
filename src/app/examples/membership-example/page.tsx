/**
 * Example Page: Membership-Protected Content
 *
 * This demonstrates how to use the membership system to protect content
 * and show different features based on user's membership tier.
 */

'use client';

import React from 'react';
import { useMembership } from '@/hooks/useMembership';
import { MembershipGuard, LockedBadge, BlurredContent } from '@/components/MembershipGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MEMBERSHIP_PRICING } from '@/lib/membership';

export default function MembershipExamplePage() {
  const membership = useMembership();

  if (!membership.isLoaded) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold">Membership System Example</h1>
        <p className="text-muted-foreground">
          Your current tier: <span className="font-semibold capitalize">{membership.membershipTier}</span>
          {membership.isAdmin && <Badge className="ml-2">Admin</Badge>}
        </p>
      </div>

      {/* Chapter Access Example */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Chapter Access</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 5, 15].map((chapterNum) => {
            const hasAccess = membership.canAccessChapter(chapterNum);
            return (
              <MembershipGuard
                key={chapterNum}
                chapterNumber={chapterNum}
                currentTier={membership.membershipTier}
                hasAccess={hasAccess}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Chapter {chapterNum}</CardTitle>
                    <CardDescription>You have access to this chapter</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      This is the content of chapter {chapterNum}. Only users with appropriate membership can see this.
                    </p>
                  </CardContent>
                </Card>
              </MembershipGuard>
            );
          })}
        </div>
      </section>

      {/* Feature Access Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Feature Access</h2>

        {/* Timeline Feature */}
        <MembershipGuard
          feature="canAccessTimeline"
          currentTier={membership.membershipTier}
          hasAccess={membership.canAccessFeature('canAccessTimeline')}
        >
          <Card>
            <CardHeader>
              <CardTitle>Timeline Feature</CardTitle>
              <CardDescription>Interactive story timeline</CardDescription>
            </CardHeader>
            <CardContent>
              <p>You have access to the timeline feature!</p>
            </CardContent>
          </Card>
        </MembershipGuard>

        {/* 3D Visualization Feature */}
        <MembershipGuard
          feature="canAccess3DVisualization"
          currentTier={membership.membershipTier}
          hasAccess={membership.canAccessFeature('canAccess3DVisualization')}
        >
          <Card>
            <CardHeader>
              <CardTitle>3D Character Arcs</CardTitle>
              <CardDescription>Advanced 3D visualization of character development</CardDescription>
            </CardHeader>
            <CardContent>
              <p>You have access to the 3D visualization feature!</p>
            </CardContent>
          </Card>
        </MembershipGuard>

        {/* Export Feature */}
        <MembershipGuard
          feature="canExportContent"
          currentTier={membership.membershipTier}
          hasAccess={membership.canAccessFeature('canExportContent')}
        >
          <Card>
            <CardHeader>
              <CardTitle>Export Content</CardTitle>
              <CardDescription>Download and export your content</CardDescription>
            </CardHeader>
            <CardContent>
              <p>You can export content in various formats!</p>
            </CardContent>
          </Card>
        </MembershipGuard>
      </section>

      {/* Blurred Content Example */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Blurred Content Example</h2>
        {membership.canAccessFeature('canDownloadOffline') ? (
          <Card>
            <CardHeader>
              <CardTitle>Offline Access Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Configure your offline reading preferences here.</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span>Download chapters automatically</span>
                  <input type="checkbox" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Sync reading progress</span>
                  <input type="checkbox" />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <BlurredContent message="Offline access requires Ultimate membership">
            <Card>
              <CardHeader>
                <CardTitle>Offline Access Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Configure your offline reading preferences here.</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Download chapters automatically</span>
                    <input type="checkbox" disabled />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Sync reading progress</span>
                    <input type="checkbox" disabled />
                  </div>
                </div>
              </CardContent>
            </Card>
          </BlurredContent>
        )}
      </section>

      {/* Feature Comparison Table */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Feature Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Feature</th>
                <th className="p-2 text-center">Free</th>
                <th className="p-2 text-center">Basic</th>
                <th className="p-2 text-center">Premium</th>
                <th className="p-2 text-center">Ultimate</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2">Chapters Access</td>
                <td className="p-2 text-center">3</td>
                <td className="p-2 text-center">10</td>
                <td className="p-2 text-center">Unlimited</td>
                <td className="p-2 text-center">Unlimited</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Timeline</td>
                <td className="p-2 text-center">✗</td>
                <td className="p-2 text-center">✓</td>
                <td className="p-2 text-center">✓</td>
                <td className="p-2 text-center">✓</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">3D Visualization</td>
                <td className="p-2 text-center">✗</td>
                <td className="p-2 text-center">✗</td>
                <td className="p-2 text-center">✓</td>
                <td className="p-2 text-center">✓</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">AI Requests/Day</td>
                <td className="p-2 text-center">0</td>
                <td className="p-2 text-center">5</td>
                <td className="p-2 text-center">25</td>
                <td className="p-2 text-center">100</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Offline Access</td>
                <td className="p-2 text-center">✗</td>
                <td className="p-2 text-center">✗</td>
                <td className="p-2 text-center">✗</td>
                <td className="p-2 text-center">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Current Features */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Your Current Features</h2>
        <Card>
          <CardHeader>
            <CardTitle>Active Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {Object.entries(membership.features).map(([key, value]) => (
                <li key={key} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{key}</span>
                  <span className="font-medium">
                    {typeof value === 'boolean' ? (value ? '✓' : '✗') : String(value)}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
