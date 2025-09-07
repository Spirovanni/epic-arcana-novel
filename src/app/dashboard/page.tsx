'use client'

import { useState, useEffect } from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { StrengthsAnalysis } from '@/components/dashboard/StrengthsAnalysis'
import { GrowthAnalysis } from '@/components/dashboard/GrowthAnalysis'
import Link from 'next/link'
import { AssessmentResult } from '@/lib/assessment/types'

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
  const [latestResult, setLatestResult] = useState<AssessmentResult | null>(null)
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentHistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load assessment data from localStorage
    const loadAssessmentData = () => {
      try {
        const storedResult = localStorage.getItem('lsa-assessment-result')
        if (storedResult) {
          const result = JSON.parse(storedResult)
          setLatestResult(result)
        }
        // TODO: Load assessment history from API when available
        setAssessmentHistory([])
      } catch (error) {
        console.error('Error loading assessment data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAssessmentData()
  }, [])

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

  const welcome = getWelcomeMessage()

  if (loading) {
    return (
      <DashboardLayout title="Dashboard" subtitle="Loading your profile...">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {welcome.title}
          </h1>
          <p className="text-gray-400 text-lg">{welcome.subtitle}</p>
          
          {latestResult && (
            <div className="flex items-center justify-center gap-4">
              <div
                className="w-8 h-8 rounded-full border-2 border-white/20"
                style={{ backgroundColor: latestResult.color.rgb_hex }}
              />
              <span className="text-purple-300 font-semibold">{latestResult.ea_id}</span>
            </div>
          )}
        </div>

        {!welcome.hasResult ? (
          /* No Assessment State */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 border-purple-500/30 hover:border-purple-400/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-purple-300 flex items-center gap-2">
                  🔮 Take Assessment
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Discover your unique Epic Arcana personality profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-4">
                  Journey through mystical Laurasia with 54 story-driven questions to unlock one of 360 personality archetypes.
                </p>
                <Link href="/assessment">
                  <Button variant="mystical" className="w-full">
                    Start Assessment
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-blue-500/30 hover:border-blue-400/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-blue-300 flex items-center gap-2">
                  ⚡ Quick Preview
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Get a taste with just 3 story scenarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-4">
                  Experience the Epic Arcana assessment style with a shortened version perfect for first-time explorers.
                </p>
                <Link href="/assessment?mode=quick">
                  <Button variant="outline" className="w-full border-blue-500/50 hover:bg-blue-500/10">
                    Try Quick Preview
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-green-500/30 hover:border-green-400/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-green-300 flex items-center gap-2">
                  📚 Learn More
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Understand the Human Framework
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-4">
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
            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/30">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-300">{latestResult?.dominant_type || 'N/A'}</div>
                  <div className="text-sm text-gray-400">Dominant Type</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-green-500/30">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-300">
                    {latestResult ? Object.entries(latestResult.instincts)
                      .sort(([,a], [,b]) => b - a)[0][0] : 'N/A'}
                  </div>
                  <div className="text-sm text-gray-400">Primary Instinct</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-blue-500/30">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-300">{latestResult ? latestResult.wing_bin + 1 : 'N/A'}</div>
                  <div className="text-sm text-gray-400">Wing Pattern</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-500/30">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-amber-300">{latestResult ? latestResult.development_bin + 1 : 'N/A'}</div>
                  <div className="text-sm text-gray-400">Development Stage</div>
                </CardContent>
              </Card>
            </div>

            {/* Action Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/dashboard/strengths">
                <Card className="bg-slate-800/50 border-green-500/30 hover:border-green-400/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-green-300 flex items-center gap-2">
                      💪 Strengths Analysis
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Explore your core strengths and talents
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Core Strengths</span>
                        <span className="text-green-300">Identified</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/dashboard/growth">
                <Card className="bg-slate-800/50 border-yellow-500/30 hover:border-yellow-400/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-yellow-300 flex items-center gap-2">
                      🌱 Growth Areas
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Development opportunities and improvement areas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Development Plan</span>
                        <span className="text-yellow-300">Ready</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/dashboard/goals">
                <Card className="bg-slate-800/50 border-purple-500/30 hover:border-purple-400/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-purple-300 flex items-center gap-2">
                      🎯 Goals & Plans
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Personality-driven goals and action plans
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Action Plan</span>
                        <span className="text-purple-300">Generate</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Mini Insights */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-300">Quick Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-gray-300 text-sm">Strong leadership qualities identified</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-yellow-400">⚡</span>
                    <span className="text-gray-300 text-sm">Growth opportunity in risk-taking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-400">🎯</span>
                    <span className="text-gray-300 text-sm">Optimal for structured environments</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-blue-300">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Assessment completed</span>
                      <span className="text-gray-500">Today</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Profile updated</span>
                      <span className="text-gray-500">Today</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Goals available</span>
                      <span className="text-purple-400">New</span>
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