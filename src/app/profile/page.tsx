"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

interface AssessmentResult {
  id: string;
  primaryPlayerType: string;
  secondaryPlayerType: string | null;
  bigFiveScores: Record<string, number>;
  enneagramType: number;
  heroJourneyStage: string;
  colorCyclePosition: number;
  trionfiCard: string;
  personalityProfile: any;
  completedAt: string;
}

// Dimension display helper
const DIMENSION_LABELS: Record<string, string> = {
  agency: 'Agency',
  stability: 'Emotional Stability',
  empathy: 'Empathy',
  openness: 'Openness',
  orderliness: 'Orderliness',
  novelty_seeking: 'Novelty Seeking',
  abstract_reasoning: 'Abstract Reasoning',
  emotional_intensity: 'Emotional Intensity',
  social_dominance: 'Social Dominance',
  cooperativeness: 'Cooperativeness',
  risk_tolerance: 'Risk Tolerance',
  conscientiousness: 'Conscientiousness',
  adaptability: 'Adaptability',
  imagination: 'Imagination',
};

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      fetchAssessmentResults();
    }
  }, [isLoaded, user]);

  const fetchAssessmentResults = async () => {
    try {
      const response = await fetch('/api/assessment/results');

      if (!response.ok) {
        if (response.status === 404) {
          setError('No assessment results found. Please complete the assessment first.');
        } else {
          throw new Error('Failed to fetch assessment results');
        }
        return;
      }

      const data = await response.json();
      setAssessmentResult(data.result);
    } catch (error) {
      console.error('Error fetching assessment results:', error);
      setError('Failed to load assessment results');
    } finally {
      setLoading(false);
    }
  };

  const generateFullReport = () => {
    if (!assessmentResult) return;
    const profile = assessmentResult.personalityProfile || {};
    const traits = profile?.profile?.traits || {};
    const dimensions = profile?.dimensions || assessmentResult.bigFiveScores || {};

    const report = `
══════════════════════════════════════════════════════════════════
              EPIC ARCANA PERSONALITY EVALUATION
══════════════════════════════════════════════════════════════════

PROFILE SUMMARY
───────────────────────────────────────────────────────────────────
Display Name:        ${assessmentResult.primaryPlayerType}
Personality Family:  ${assessmentResult.secondaryPlayerType || 'Not specified'}
Archetype ID:        ${profile?.ea_id || profile?.profile?.id || 'EA-Unknown'}
Theme:               ${assessmentResult.heroJourneyStage}
Enneagram Type:      Type ${assessmentResult.enneagramType}
Color Position:      ${assessmentResult.colorCyclePosition}
Trionfi Card:        ${assessmentResult.trionfiCard || 'Not assigned'}
Completed:           ${new Date(assessmentResult.completedAt).toLocaleDateString()}


CORE STRENGTHS
───────────────────────────────────────────────────────────────────
${(traits?.strengths || ['Strategic thinking', 'Natural leadership', 'Adaptability']).map((s: string, i: number) => `${i + 1}. ${s}`).join('\n')}


SHADOW ASPECTS (Growth Opportunities)
───────────────────────────────────────────────────────────────────
${(traits?.shadow || traits?.shadows || ['Overthinking', 'Perfectionism', 'Impatience']).map((s: string, i: number) => `${i + 1}. ${s}`).join('\n')}


GROWTH FOCUS AREAS
───────────────────────────────────────────────────────────────────
${(traits?.growth_focus || traits?.growthFocus || ['Mindfulness practice', 'Active listening', 'Emotional regulation']).map((g: string, i: number) => `${i + 1}. ${g}`).join('\n')}


PSYCHOLOGICAL DIMENSIONS
───────────────────────────────────────────────────────────────────
${Object.entries(dimensions).map(([key, value]) => {
      const label = DIMENSION_LABELS[key] || key;
      const score = typeof value === 'number' ? (value * 100).toFixed(0) : 'N/A';
      return `${label.padEnd(25)} ${'█'.repeat(Math.round(Number(score) / 10))} ${score}%`;
    }).join('\n')}


INTERPRETATION
───────────────────────────────────────────────────────────────────
Your assessment results reveal a unique psychological fingerprint. The combination
of your dominant type (${assessmentResult.enneagramType}) with your specific wing and development
level places you at Chapter ${assessmentResult.colorCyclePosition} of The Human Framework.

This archetype, "${assessmentResult.primaryPlayerType}", represents individuals who:
- Approach challenges with a blend of ${traits?.strengths?.[0] || 'strategic thinking'} and ${traits?.strengths?.[1] || 'adaptability'}
- May struggle with ${traits?.shadow?.[0] || 'overthinking'} under stress
- Find fulfillment through ${assessmentResult.heroJourneyStage || 'personal growth'}-related activities

Your growth journey focuses on developing greater ${traits?.growth_focus?.[0] || 'self-awareness'}
while maintaining your core strengths.


══════════════════════════════════════════════════════════════════
           Generated by Epic Arcana Assessment System
══════════════════════════════════════════════════════════════════
`;
    const element = document.createElement("a");
    const file = new Blob([report], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `EpicArcana_${assessmentResult.primaryPlayerType.replace(/\s+/g, '_')}_Report.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
            <p className="text-amber-200">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || error || !assessmentResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <Card className="max-w-md mx-auto bg-black/40 border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-amber-300">
                {!user ? 'Authentication Required' : 'No Assessment Results'}
              </CardTitle>
              <CardDescription className="text-center text-amber-100/80">
                {error || 'Please complete the assessment to view your profile.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild className="bg-amber-600 hover:bg-amber-500">
                <Link href="/assessment">Take Assessment</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const profile = assessmentResult.personalityProfile || {};
  const traits = profile?.profile?.traits || {};
  const dimensions = profile?.dimensions || assessmentResult.bigFiveScores || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1 bg-amber-500/20 rounded-full text-amber-300 text-sm mb-4">
            {profile?.ea_id || profile?.profile?.id || 'Epic Arcana'}
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent mb-3">
            {assessmentResult.primaryPlayerType}
          </h1>
          <p className="text-xl text-amber-100/80">{assessmentResult.heroJourneyStage}</p>
          <p className="text-amber-200/60 mt-2">Welcome back, {user.firstName}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-black/40 border-amber-500/30 text-center">
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-amber-300">{assessmentResult.enneagramType}</p>
              <p className="text-sm text-amber-100/60">Enneagram</p>
            </CardContent>
          </Card>
          <Card className="bg-black/40 border-purple-500/30 text-center">
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-purple-300">{assessmentResult.colorCyclePosition}</p>
              <p className="text-sm text-purple-100/60">Chapter</p>
            </CardContent>
          </Card>
          <Card className="bg-black/40 border-blue-500/30 text-center">
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-blue-300">{profile?.wing_bin ?? 'N/A'}</p>
              <p className="text-sm text-blue-100/60">Wing Bin</p>
            </CardContent>
          </Card>
          <Card className="bg-black/40 border-green-500/30 text-center">
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-green-300">{profile?.development_bin ?? 'N/A'}</p>
              <p className="text-sm text-green-100/60">Dev Level</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Strengths */}
          <Card className="bg-black/40 border-emerald-500/30">
            <CardHeader>
              <CardTitle className="text-emerald-300 flex items-center gap-2">
                <span className="text-2xl">💪</span> Core Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {(traits?.strengths || ['Strategic thinking', 'Natural leadership', 'Adaptability', 'Problem solving', 'Communication']).map((strength: string, i: number) => (
                  <li key={i} className="flex items-center gap-3 text-emerald-100">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                    {strength}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Shadow */}
          <Card className="bg-black/40 border-rose-500/30">
            <CardHeader>
              <CardTitle className="text-rose-300 flex items-center gap-2">
                <span className="text-2xl">🌑</span> Shadow Aspects
              </CardTitle>
              <CardDescription className="text-rose-100/60">Areas for self-awareness</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {(traits?.shadow || traits?.shadows || ['Overthinking', 'Perfectionism', 'Impatience', 'Self-doubt', 'Control tendencies']).map((shadow: string, i: number) => (
                  <li key={i} className="flex items-center gap-3 text-rose-100">
                    <span className="w-2 h-2 bg-rose-400 rounded-full"></span>
                    {shadow}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Growth Focus */}
          <Card className="bg-black/40 border-sky-500/30">
            <CardHeader>
              <CardTitle className="text-sky-300 flex items-center gap-2">
                <span className="text-2xl">🌱</span> Growth Focus Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {(traits?.growth_focus || traits?.growthFocus || ['Mindfulness practice', 'Active listening', 'Emotional regulation', 'Boundary setting', 'Patience cultivation']).map((growth: string, i: number) => (
                  <li key={i} className="flex items-center gap-3 text-sky-100">
                    <span className="w-2 h-2 bg-sky-400 rounded-full"></span>
                    {growth}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Dimensions */}
          <Card className="bg-black/40 border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-amber-300 flex items-center gap-2">
                <span className="text-2xl">📊</span> Psychological Dimensions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(dimensions).slice(0, 8).map(([key, value]) => {
                const score = typeof value === 'number' ? Math.round(value * 100) : 50;
                return (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-amber-100">{DIMENSION_LABELS[key] || key}</span>
                      <span className="text-amber-300">{score}%</span>
                    </div>
                    <div className="h-2 bg-amber-900/50 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500" style={{ width: `${score}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Download Button */}
        <div className="flex justify-center mb-8">
          <Button onClick={generateFullReport} className="bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black font-semibold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-amber-500/30 transition-all duration-300 flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Download Complete Evaluation Report
          </Button>
        </div>

        {/* Footer */}
        <Card className="bg-black/20 border-white/10">
          <CardContent className="pt-6 text-center">
            <Badge variant="outline" className="mb-2 border-amber-500/50 text-amber-300">Assessment Completed</Badge>
            <p className="text-white/60 text-sm">
              {new Date(assessmentResult.completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
