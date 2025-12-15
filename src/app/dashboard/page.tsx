'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AssessmentButton } from '@/components/ui/AssessmentButton'
import { Progress } from '@/components/ui/progress'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { PersonalityProfileCard } from '@/components/dashboard/PersonalityProfileCard'
import { TypeBars } from '@/components/results/TypeBars'
import { ColorSwatch } from '@/components/results/ColorSwatch'
import { useAssessmentDataRefresh } from '@/utils/assessmentEvents'
import Link from 'next/link'
import { AssessmentResult } from '@/lib/assessment/types'
import { ArrowUpRight, Download } from 'lucide-react'

type DashboardAssessmentResult = AssessmentResult & {
  resultId?: string
  assessmentId?: string
  completedAt?: string
}

const formatInstinctStack = (instincts?: DashboardAssessmentResult['instincts']) => {
  if (!instincts) return '—'
  return Object.entries(instincts)
    .sort(([, a], [, b]) => b - a)
    .map(([key, value]) => `${key} ${Math.round(value * 100)}%`)
    .join(' · ')
}

const formatCompletedAt = (timestamp?: string) => {
  if (!timestamp) return 'Just completed'
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) return 'Just completed'
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

const formatDuration = (seconds?: number) => {
  if (!seconds && seconds !== 0) return '—'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins <= 0) return `${secs}s`
  return `${mins}m ${secs.toString().padStart(2, '0')}s`
}

const getDominantProbability = (result?: DashboardAssessmentResult | null) => {
  if (!result) return null
  const key = String(result.dominant_type)
  const probability = result.type_probs?.[key as keyof typeof result.type_probs]
  if (typeof probability !== 'number') return null
  return Math.round(probability * 100)
}

const getReportPath = (result?: DashboardAssessmentResult | null) => {
  if (!result) return null
  if (result.resultId) return `/results/${result.resultId}`
  if (result.assessmentId) return `/results/${result.assessmentId}`
  return null
}

interface AssessmentHistoryItem {
  id: string
  chapter: number
  color: {
    rgb_hex: string
  }
  dominant_type: number
  completedAt: string
}

export default function DashboardPage() {
  const [latestResult, setLatestResult] = useState<DashboardAssessmentResult | null>(null)
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentHistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  // Load assessment data from API
  const loadAssessmentData = async () => {
    try {
      const response = await fetch('/api/assessment/results')
      if (response.ok) {
        const data = await response.json()
        // The results API returns { success: true, result: {...} }
        if (data.success && data.result) {
          // Map the result to match our expected format
          const result = data.result
          const mappedResult: DashboardAssessmentResult = {
            // Core fields from personalityProfile
            ...(result.personalityProfile || {}),
            // Fallback mappings from top-level fields
            ea_id: result.personalityProfile?.ea_id || result.trionfiCard || 'EA-Unknown',
            chapter: result.personalityProfile?.chapter || result.colorCyclePosition || 1,
            dominant_type: result.personalityProfile?.dominant_type || result.enneagramType || 1,
            profile: result.personalityProfile?.profile || {
              display_name: result.primaryPlayerType || 'Explorer',
              family: result.secondaryPlayerType || 'Unknown',
              theme: result.heroJourneyStage || 'The Journey Begins',
              matchScore: 75
            },
            color: result.personalityProfile?.color || { rgb_hex: '#7B68EE' },
            instincts: result.personalityProfile?.instincts || { SP: 0.33, SO: 0.33, SX: 0.34 },
            dimensions: result.personalityProfile?.dimensions || result.bigFiveScores || {},
            type_probs: result.personalityProfile?.type_probs || {},
            meta: result.personalityProfile?.meta || { version: '1.0.0', duration_sec: 0 },
            // IDs for linking
            resultId: result.id,
            completedAt: result.completedAt
          }
          setLatestResult(mappedResult)
        } else {
          setLatestResult(null)
        }
      } else if (response.status === 404) {
        // No assessment result found - this is fine
        setLatestResult(null)
      } else if (response.status === 401) {
        // Not authenticated - this shouldn't happen in dashboard but handle it
        setLatestResult(null)
      } else {
        console.error('Error loading assessment result')
      }

      // TODO: Load assessment history from API when available
      setAssessmentHistory([])
    } catch (error) {
      console.error('Error loading assessment data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAssessmentData()
  }, [])

  // Set up refresh listener
  useAssessmentDataRefresh(loadAssessmentData)

  const getWelcomeMessage = () => {
    if (latestResult) {
      return {
        title: `Welcome back, ${latestResult.profile.family} Explorer!`,
        subtitle: `Chapter ${latestResult.chapter} • ${latestResult.profile.display_name}`,
        hasResult: true
      }
    }
    return {
      title: "Welcome to Your Epic Arcana Dashboard",
      subtitle: "Discover your personality and unlock your potential",
      hasResult: false
    }
  }

  const reportPath = getReportPath(latestResult)
  const dominantProbability = getDominantProbability(latestResult)
  const instinctStack = formatInstinctStack(latestResult?.instincts)
  const completedAtLabel = formatCompletedAt(latestResult?.completedAt)
  const durationLabel = formatDuration(latestResult?.meta?.duration_sec)

  const handleDownloadReport = () => {
    if (!reportPath) return
    const url = `${reportPath}?download=1`
    const newWindow = window.open(url, '_blank')
    newWindow?.focus()
  }

  const welcome = getWelcomeMessage()

  if (loading) {
    return (
      <DashboardLayout title="Dashboard" subtitle="Loading your profile...">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title={welcome.title} subtitle={welcome.subtitle}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* User Profile Info (only show if has result) */}
        {latestResult && (
          <div className="text-center space-y-4 mb-8">
            <div className="flex items-center justify-center gap-4">
              <div
                className="w-12 h-12 rounded-full border-2 border-border shadow-lg"
                style={{ backgroundColor: latestResult.color.rgb_hex }}
              />
              <div className="text-left">
                <div className="text-primary font-semibold text-lg">{latestResult.ea_id}</div>
                <div className="text-muted-foreground text-sm">Chapter {latestResult.chapter} • {latestResult.profile.family}</div>
              </div>
            </div>
          </div>
        )}

        {!welcome.hasResult ? (
          /* No Assessment State */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-primary/30 hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  🔮 Take Assessment
                </CardTitle>
                <CardDescription>
                  Discover your unique Epic Arcana personality profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Journey through mystical Laurasia with 54 story-driven questions to unlock one of 360 personality archetypes.
                </p>
                <AssessmentButton variant="mystical" className="w-full" />
              </CardContent>
            </Card>

            <Card className="border-blue-500/30 hover:border-blue-400/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  ⚡ Quick Preview
                </CardTitle>
                <CardDescription>
                  Get a taste with just 3 story scenarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Experience the Epic Arcana assessment style with a shortened version perfect for first-time explorers.
                </p>
                <AssessmentButton
                  href="/assessment?mode=quick"
                  variant="outline"
                  className="w-full border-blue-500/50 hover:bg-blue-500/10"
                >
                  Try Quick Preview
                </AssessmentButton>
              </CardContent>
            </Card>

            <Card className="border-green-500/30 hover:border-green-400/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-green-600 dark:text-green-400 flex items-center gap-2">
                  📚 Learn More
                </CardTitle>
                <CardDescription>
                  Understand the Human Framework
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Explore the science and methodology behind Epic Arcana personality profiling.
                </p>
                <Button variant="outline" className="w-full border-green-500/50 hover:bg-green-500/10">
                  Explore Framework
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Assessment Complete State */
          <>
            {latestResult && (
              <Card className="border-primary/40 bg-gradient-to-r from-slate-900/70 via-purple-900/30 to-slate-900/70 shadow-lg">
                <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-primary">Personality Assessment</CardTitle>
                    <CardDescription>
                      Latest Epic Arcana profile with a downloadable report
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {reportPath && (
                      <Button
                        asChild
                        variant="outline"
                        className="border-primary/60 text-primary hover:bg-primary/10"
                      >
                        <Link href={reportPath}>
                          View full report
                          <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    <Button
                      variant="mystical"
                      className="flex items-center gap-2"
                      onClick={handleDownloadReport}
                      disabled={!reportPath}
                    >
                      <Download className="h-4 w-4" />
                      Download report
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="rounded-lg border border-white/10 bg-slate-900/40 p-4">
                      <p className="text-xs text-muted-foreground">EA Profile</p>
                      <p className="text-lg font-semibold">{latestResult.profile.display_name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <span
                          className="inline-block h-3 w-3 rounded-full border border-white/20"
                          style={{ backgroundColor: latestResult.color.rgb_hex }}
                        />
                        EA ID {latestResult.ea_id} • Chapter {latestResult.chapter}
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-slate-900/40 p-4">
                      <p className="text-xs text-muted-foreground">Dominant Type</p>
                      <p className="text-lg font-semibold">Type {latestResult.dominant_type}</p>
                      <p className="text-sm text-muted-foreground">
                        {latestResult.profile.family}
                        {dominantProbability !== null ? ` • ${dominantProbability}% likelihood` : ''}
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-slate-900/40 p-4">
                      <p className="text-xs text-muted-foreground">Instinct Stack</p>
                      <p className="text-lg font-semibold">{instinctStack}</p>
                      <p className="text-sm text-muted-foreground">
                        SP {Math.round(latestResult.instincts.SP * 100)}% • SO {Math.round(latestResult.instincts.SO * 100)}% • SX {Math.round(latestResult.instincts.SX * 100)}%
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-slate-900/40 p-4">
                      <p className="text-xs text-muted-foreground">Report</p>
                      <p className="text-lg font-semibold">{completedAtLabel}</p>
                      <p className="text-sm text-muted-foreground">
                        {durationLabel} • v{latestResult.meta.version}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Personality Profile Card */}
            {latestResult && (
              <div className="grid lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                  <PersonalityProfileCard result={latestResult} />
                </div>

                {/* Secondary Stats */}
                <div className="space-y-4">
                  <Card className="bg-gradient-to-br from-primary/10 to-purple-600/10 border-primary/30">
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground mb-2">Match Confidence</div>
                      <div className="text-3xl font-bold text-primary mb-2">{latestResult.profile.matchScore || 75}%</div>
                      <Progress value={latestResult.profile.matchScore || 75} className="h-2" />
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border-blue-500/30">
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground mb-2">Enneagram Type</div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">{latestResult.dominant_type}</div>
                      <div className="text-xs text-muted-foreground">Chapter {latestResult.chapter}</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-amber-600/10 to-orange-600/10 border-amber-500/30">
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground mb-2">Assessment ID</div>
                      <div className="text-lg font-mono font-bold text-amber-600 dark:text-amber-400">{latestResult.ea_id}</div>
                      <div className="text-xs text-muted-foreground mt-1">Assessment complete</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {latestResult && (
              <div className="grid lg:grid-cols-2 gap-6">
                <TypeBars result={latestResult} />
                <ColorSwatch result={latestResult} />
              </div>
            )}

            {/* Action Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/dashboard/strengths">
                <Card className="border-green-500/30 hover:border-green-400/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-green-600 dark:text-green-400 flex items-center gap-2">
                      💪 Strengths Analysis
                    </CardTitle>
                    <CardDescription>
                      Explore your core strengths and talents
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Core Strengths</span>
                        <span className="text-green-600 dark:text-green-400">Identified</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/dashboard/growth">
                <Card className="border-yellow-500/30 hover:border-yellow-400/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-yellow-600 dark:text-yellow-400 flex items-center gap-2">
                      🌱 Growth Areas
                    </CardTitle>
                    <CardDescription>
                      Development opportunities and improvement areas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Development Plan</span>
                        <span className="text-yellow-600 dark:text-yellow-400">Ready</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/dashboard/goals">
                <Card className="border-primary/30 hover:border-primary/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-primary flex items-center gap-2">
                      🎯 Goals & Plans
                    </CardTitle>
                    <CardDescription>
                      Personality-driven goals and action plans
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Action Plan</span>
                        <span className="text-primary">Generate</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Mini Insights */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-primary/30">
                <CardHeader>
                  <CardTitle className="text-primary">Quick Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span className="text-foreground text-sm">Strong leadership qualities identified</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-yellow-600 dark:text-yellow-400">⚡</span>
                    <span className="text-foreground text-sm">Growth opportunity in risk-taking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-600 dark:text-blue-400">🎯</span>
                    <span className="text-foreground text-sm">Optimal for structured environments</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-blue-600 dark:text-blue-400">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-foreground">Assessment completed</span>
                      <span className="text-muted-foreground">Today</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Profile updated</span>
                      <span className="text-muted-foreground">Today</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Goals available</span>
                      <span className="text-primary">New</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
