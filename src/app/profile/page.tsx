"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { DomainRadar } from '@/components/pos/DomainRadar';
import { PosDomainKey } from '@/lib/assessment/pos60_v1';
import { formatFacetLabel } from '@/lib/assessment/pos60_scoring';

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

type PosLatest = {
  assessmentId: string;
  completedAt: string | null;
  domainScores: Record<PosDomainKey, number>;
  facetScores: Record<PosDomainKey, Record<string, number>>;
  insights: {
    strengths: string[];
    leverage_points: string[];
    seven_day_plan: Array<{ day: number; focus: string; action: string }>;
  };
};

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

const POS_DOMAIN_LABELS: Record<PosDomainKey, string> = {
  focus: 'Focus',
  planning: 'Planning',
  execution: 'Execution',
  collaboration: 'Collaboration',
  resilience: 'Resilience',
};

const POS_DOMAIN_COLORS: Record<PosDomainKey, string> = {
  focus: '#0ea5e9',
  planning: '#6366f1',
  execution: '#22c55e',
  collaboration: '#f59e0b',
  resilience: '#ef4444',
};

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [posLatest, setPosLatest] = useState<PosLatest | null>(null);
  const [posInProgress, setPosInProgress] = useState<{ assessmentId: string } | null>(null);
  const [posLoading, setPosLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      fetchAssessmentResults();
      fetchPosLatest();
    } else if (isLoaded && !user) {
      setPosLoading(false);
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

  const fetchPosLatest = async () => {
    try {
      const response = await fetch('/api/pos/latest');
      if (!response.ok) {
        if (response.status === 401) {
          return;
        }
        throw new Error('Failed to fetch POS-60 results');
      }
      const data = await response.json();
      setPosLatest(data.latest);
      setPosInProgress(data.inProgress);
    } catch (err) {
      console.error('Error fetching POS-60 results:', err);
    } finally {
      setPosLoading(false);
    }
  };

  const generateFullReport = () => {
    if (!assessmentResult) return;
    const profile = assessmentResult.personalityProfile || {};
    const traits = profile?.profile?.traits || {};
    const dimensions = profile?.dimensions || assessmentResult.bigFiveScores || {};
    const userColor = profile?.color?.rgb_hex || '#7B68EE';

    // Generate styled HTML for print
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Epic Arcana - ${assessmentResult.primaryPlayerType}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Open+Sans:wght@400;600&display=swap');
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      font-family: 'Open Sans', sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
      color: #f5f5f5;
      min-height: 100vh;
      padding: 40px;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: rgba(0,0,0,0.4);
      border-radius: 20px;
      padding: 40px;
      border: 2px solid ${userColor}40;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    }
    
    /* Header */
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 2px solid ${userColor}60;
    }
    
    .logo {
      font-size: 14px;
      color: ${userColor};
      letter-spacing: 4px;
      text-transform: uppercase;
      margin-bottom: 20px;
    }
    
    .title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 48px;
      font-weight: 700;
      background: linear-gradient(135deg, ${userColor}, #ffd700);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 10px;
    }
    
    .subtitle {
      font-size: 20px;
      color: #b8b8b8;
      font-style: italic;
    }
    
    .color-badge {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: ${userColor};
      margin: 20px auto;
      border: 4px solid rgba(255,255,255,0.2);
      box-shadow: 0 0 30px ${userColor}60;
    }
    
    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin-bottom: 40px;
    }
    
    .stat-card {
      background: rgba(255,255,255,0.05);
      border-radius: 12px;
      padding: 20px 15px;
      text-align: center;
      border: 1px solid rgba(255,255,255,0.1);
    }
    
    .stat-value {
      font-size: 32px;
      font-weight: 700;
      color: ${userColor};
    }
    
    .stat-label {
      font-size: 12px;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 5px;
    }
    
    /* Sections */
    .section {
      margin-bottom: 35px;
    }
    
    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 15px;
    }
    
    .section-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
    
    .section-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 24px;
      font-weight: 600;
    }
    
    .strengths .section-icon { background: rgba(16, 185, 129, 0.2); }
    .strengths .section-title { color: #10b981; }
    
    .shadows .section-icon { background: rgba(244, 63, 94, 0.2); }
    .shadows .section-title { color: #f43f5e; }
    
    .growth .section-icon { background: rgba(14, 165, 233, 0.2); }
    .growth .section-title { color: #0ea5e9; }
    
    .dimensions .section-icon { background: rgba(251, 191, 36, 0.2); }
    .dimensions .section-title { color: #fbbf24; }
    
    /* Lists */
    .trait-list {
      list-style: none;
      padding-left: 48px;
    }
    
    .trait-list li {
      padding: 8px 0;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .trait-list li::before {
      content: '◆';
      font-size: 8px;
    }
    
    .strengths .trait-list li::before { color: #10b981; }
    .shadows .trait-list li::before { color: #f43f5e; }
    .growth .trait-list li::before { color: #0ea5e9; }
    
    /* Dimension Bars */
    .dimension-item {
      margin-bottom: 12px;
      padding-left: 48px;
    }
    
    .dimension-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      font-size: 14px;
    }
    
    .dimension-label { color: #ccc; }
    .dimension-value { color: #fbbf24; font-weight: 600; }
    
    .dimension-bar {
      height: 8px;
      background: rgba(255,255,255,0.1);
      border-radius: 4px;
      overflow: hidden;
    }
    
    .dimension-fill {
      height: 100%;
      background: linear-gradient(90deg, #fbbf24, #f59e0b);
      border-radius: 4px;
    }
    
    /* Footer */
    .footer {
      text-align: center;
      padding-top: 30px;
      margin-top: 40px;
      border-top: 2px solid ${userColor}40;
    }
    
    .footer-badge {
      display: inline-block;
      padding: 8px 20px;
      border: 1px solid ${userColor};
      border-radius: 20px;
      color: ${userColor};
      font-size: 14px;
      margin-bottom: 15px;
    }
    
    .footer-date {
      color: #666;
      font-size: 13px;
    }
    
    /* Print styles */
    @media print {
      body {
        background: white;
        color: #1a1a1a;
        padding: 20px;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .container {
        box-shadow: none;
        border: 2px solid #ddd;
        background: white;
      }
      .stat-card {
        background: #f5f5f5;
      }
    }
    
    .print-button {
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, ${userColor}, #ffd700);
      color: #000;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      font-size: 14px;
    }
    
    .print-button:hover { opacity: 0.9; }
    
    @media print {
      .print-button { display: none; }
    }
  </style>
</head>
<body>
  <button class="print-button" onclick="window.print()">📄 Save as PDF</button>
  
  <div class="container">
    <div class="header">
      <div class="logo">✦ EPIC ARCANA ✦</div>
      <h1 class="title">${assessmentResult.primaryPlayerType}</h1>
      <p class="subtitle">${assessmentResult.heroJourneyStage}</p>
      <div class="color-badge"></div>
    </div>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">${assessmentResult.enneagramType}</div>
        <div class="stat-label">Enneagram</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${assessmentResult.colorCyclePosition}</div>
        <div class="stat-label">Chapter</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${profile?.wing_bin ?? 'N/A'}</div>
        <div class="stat-label">Wing Bin</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${profile?.development_bin ?? 'N/A'}</div>
        <div class="stat-label">Dev Level</div>
      </div>
    </div>
    
    <div class="section strengths">
      <div class="section-header">
        <div class="section-icon">💪</div>
        <h2 class="section-title">Core Strengths</h2>
      </div>
      <ul class="trait-list">
        ${(traits?.strengths || ['Strategic thinking', 'Natural leadership', 'Adaptability', 'Problem solving', 'Communication']).map((s: string) => `<li>${s}</li>`).join('')}
      </ul>
    </div>
    
    <div class="section shadows">
      <div class="section-header">
        <div class="section-icon">🌑</div>
        <h2 class="section-title">Shadow Aspects</h2>
      </div>
      <ul class="trait-list">
        ${(traits?.shadow || traits?.shadows || ['Overthinking', 'Perfectionism', 'Impatience', 'Self-doubt', 'Control tendencies']).map((s: string) => `<li>${s}</li>`).join('')}
      </ul>
    </div>
    
    <div class="section growth">
      <div class="section-header">
        <div class="section-icon">🌱</div>
        <h2 class="section-title">Growth Focus Areas</h2>
      </div>
      <ul class="trait-list">
        ${(traits?.growth_focus || traits?.growthFocus || ['Mindfulness practice', 'Active listening', 'Emotional regulation', 'Boundary setting', 'Patience cultivation']).map((g: string) => `<li>${g}</li>`).join('')}
      </ul>
    </div>
    
    <div class="section dimensions">
      <div class="section-header">
        <div class="section-icon">📊</div>
        <h2 class="section-title">Psychological Dimensions</h2>
      </div>
      ${Object.entries(dimensions).slice(0, 8).map(([key, value]) => {
      const label = DIMENSION_LABELS[key] || key;
      const score = typeof value === 'number' ? Math.round(value * 100) : 50;
      return `
        <div class="dimension-item">
          <div class="dimension-header">
            <span class="dimension-label">${label}</span>
            <span class="dimension-value">${score}%</span>
          </div>
          <div class="dimension-bar">
            <div class="dimension-fill" style="width: ${score}%"></div>
          </div>
        </div>`;
    }).join('')}
    </div>
    
    <div class="footer">
      <div class="footer-badge">${profile?.ea_id || 'EA-Unknown'} • Chapter ${assessmentResult.colorCyclePosition}</div>
      <p class="footer-date">Assessment completed on ${new Date(assessmentResult.completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>
  </div>
</body>
</html>`;

    // Open in new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    }
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
          <div className="w-full max-w-3xl px-4 space-y-4">
            <Card className="bg-black/40 border-amber-500/30">
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

            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-xl text-white">Personal Operating System Report</CardTitle>
                <CardDescription className="text-amber-100/80">
                  Opt in to POS-60 for a 10-minute view of your focus, planning, execution, collaboration, and resilience.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Button asChild className="bg-white text-slate-900 hover:bg-slate-200">
                  <Link href="/pos">Take POS-60 (10 min)</Link>
                </Button>
                <Button asChild variant="outline" className="border-white/40 text-white hover:bg-white/10">
                  <Link href="/pos?retake=true">Start fresh</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
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

        {/* Personal Operating System */}
        <Card className="mb-10 bg-white/90 border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-900">Personal Operating System Report</CardTitle>
            <CardDescription className="text-slate-600">
              POS-60 measures focus, planning, execution, collaboration, and resilience. Your answers persist after refresh.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {posLoading ? (
              <div className="text-slate-600">Loading POS-60 status...</div>
            ) : !posLatest ? (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-slate-700">
                  <p className="font-semibold text-slate-900 mb-1">Unlock your POS report</p>
                  <p className="text-sm text-slate-600">
                    Take the 10-minute POS-60 to see your operating strengths, leverage points, and a 7-day action plan.
                  </p>
                </div>
                <div className="flex gap-3">
                  {posInProgress ? (
                    <Button asChild>
                      <Link href="/pos">Continue</Link>
                    </Button>
                  ) : (
                    <Button asChild>
                      <Link href="/pos">Take POS-60 (10 min)</Link>
                    </Button>
                  )}
                  <Button variant="outline" asChild>
                    <Link href="/pos?retake=true">Start fresh</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3 justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Completed</p>
                    <p className="text-slate-900 font-semibold">
                      {posLatest.completedAt
                        ? new Date(posLatest.completedAt).toLocaleDateString()
                        : 'Recently'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" asChild>
                      <Link href="/pos">Review</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/pos?retake=true">Retake POS-60</Link>
                    </Button>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  {(Object.keys(POS_DOMAIN_LABELS) as PosDomainKey[]).map((domain) => (
                    <Card key={domain} className="border-slate-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-slate-900 flex items-center justify-between">
                          <span>{POS_DOMAIN_LABELS[domain]}</span>
                          <span className="text-2xl font-bold" style={{ color: POS_DOMAIN_COLORS[domain] }}>
                            {posLatest.domainScores[domain]?.toFixed(1) ?? '—'}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <DomainRadar domain={domain} facets={posLatest.facetScores[domain] || {}} color={POS_DOMAIN_COLORS[domain]} />
                        <ul className="mt-4 space-y-2 text-sm text-slate-700">
                          {Object.entries(posLatest.facetScores[domain] || {}).map(([facet, score]) => (
                            <li key={facet} className="flex items-center justify-between">
                              <span>{formatFacetLabel(domain, facet)}</span>
                              <span className="font-semibold text-slate-900">{score.toFixed(1)}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="border-slate-200">
                    <CardHeader>
                      <CardTitle className="text-slate-900 text-base">Strengths</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-emerald-700">
                        {(posLatest.insights?.strengths || []).map((s, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200">
                    <CardHeader>
                      <CardTitle className="text-slate-900 text-base">Leverage Points</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-amber-700">
                        {(posLatest.insights?.leverage_points || []).map((s, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200">
                    <CardHeader>
                      <CardTitle className="text-slate-900 text-base">7-Day Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-slate-700">
                        {(posLatest.insights?.seven_day_plan || []).map((item) => (
                          <li key={item.day}>
                            <span className="font-semibold text-slate-900">Day {item.day}:</span> {item.action}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

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
