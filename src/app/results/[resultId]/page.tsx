import { notFound } from 'next/navigation'
import { AssessmentResult } from '@/lib/assessment/types'
import { db } from '@/lib/db'
import { userAssessmentResults, assessmentSessionsV2, assessmentResultsV2 } from '@/lib/schema'
import { eq, or } from 'drizzle-orm'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Download, Sparkles } from 'lucide-react'
import { PrintOnLoad } from './PrintOnLoad'
import Navbar from '@/components/Navbar'

interface ResultsPageProps {
  params: Promise<{
    resultId: string
  }>
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
}

async function loadResult(resultId: string): Promise<AssessmentResult | null> {
  // First try legacy table
  const rows = await db.select().from(userAssessmentResults)
    .where(
      or(
        eq(userAssessmentResults.assessmentId, resultId),
        eq(userAssessmentResults.id, resultId)
      )
    )
    .limit(1)

  if (rows[0]?.personalityProfile) {
    return rows[0].personalityProfile as AssessmentResult
  }

  // Fallback to V2 results
  const v2Sessions = await db.select().from(assessmentSessionsV2)
    .where(eq(assessmentSessionsV2.id, resultId))
    .limit(1)

  if (v2Sessions.length > 0) {
    const v2Results = await db.select().from(assessmentResultsV2)
      .where(eq(assessmentResultsV2.sessionId, v2Sessions[0].id))
      .limit(1)

    if (v2Results.length > 0) {
      return v2Results[0].result as AssessmentResult
    }
  }

  return null
}

function getInstinctStack(instincts: { SP: number; SO: number; SX: number }): string {
  return Object.entries(instincts)
    .sort(([, a], [, b]) => b - a)
    .map(([key]) => key)
    .join(' → ')
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { resultId } = await params
  const result = await loadResult(resultId)

  if (!result) {
    notFound()
  }

  // Access traits from profile with proper casting (profile may have traits in various locations)
  const profileData = result.profile as Record<string, unknown> || {}
  const traits = (profileData?.traits as Record<string, string[]>) || {}
  const dimensions = result.dimensions || {}
  const instincts = result.instincts || { SP: 0.33, SO: 0.33, SX: 0.33 }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <PrintOnLoad />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <Button asChild variant="ghost" className="text-gray-200 hover:text-white">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <Button
            variant="outline"
            className="border-amber-500/50 bg-amber-600/20 text-amber-300 hover:bg-amber-500/30"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.print()
              }
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Print / Save PDF
          </Button>
        </div>

        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-amber-500/20 rounded-full text-amber-300 text-sm mb-4">
            <Sparkles className="h-4 w-4" />
            {result.ea_id || 'Epic Arcana'}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent mb-3">
            {result.profile?.display_name || 'Your Personality'}
          </h1>
          <p className="text-xl text-amber-100/80">{result.profile?.theme || 'Mystical Archetype'}</p>
          <p className="text-amber-200/60 mt-2">{result.profile?.family || 'Unknown Family'}</p>
        </div>

        {/* Color Badge */}
        <div className="flex justify-center mb-8">
          <div
            className="w-24 h-24 rounded-full shadow-2xl border-4 border-white/20"
            style={{ backgroundColor: result.color?.rgb_hex || '#7B68EE' }}
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-black/40 border-amber-500/30 text-center">
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-amber-300">{result.dominant_type}</p>
              <p className="text-sm text-amber-100/60">Enneagram</p>
            </CardContent>
          </Card>
          <Card className="bg-black/40 border-purple-500/30 text-center">
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-purple-300">{result.chapter}</p>
              <p className="text-sm text-purple-100/60">Chapter</p>
            </CardContent>
          </Card>
          <Card className="bg-black/40 border-blue-500/30 text-center">
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-blue-300">{result.wing_bin}</p>
              <p className="text-sm text-blue-100/60">Wing Bin</p>
            </CardContent>
          </Card>
          <Card className="bg-black/40 border-green-500/30 text-center">
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-green-300">{result.development_bin}</p>
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
                const score = typeof value === 'number' ? Math.round(value * 100) : 50
                return (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-amber-100">{DIMENSION_LABELS[key] || key}</span>
                      <span className="text-amber-300">{score}%</span>
                    </div>
                    <div className="h-2 bg-amber-900/50 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full" style={{ width: `${score}%` }}></div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Instinct Stack */}
        {instincts && (
          <Card className="bg-black/40 border-violet-500/30 mb-8">
            <CardHeader>
              <CardTitle className="text-violet-300 flex items-center gap-2">
                <span className="text-2xl">⚡</span> Instinct Stack
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-white mb-2">
                  {getInstinctStack(instincts)}
                </div>
                <p className="text-violet-200/60">Primary → Secondary → Tertiary</p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <div className="text-lg font-semibold text-blue-300">SP</div>
                  <div className="text-xs text-blue-200/60 mb-2">Self-Preservation</div>
                  <div className="text-2xl font-bold text-white">{Math.round((instincts.SP || 0) * 100)}%</div>
                </div>
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <div className="text-lg font-semibold text-green-300">SO</div>
                  <div className="text-xs text-green-200/60 mb-2">Social</div>
                  <div className="text-2xl font-bold text-white">{Math.round((instincts.SO || 0) * 100)}%</div>
                </div>
                <div className="p-4 bg-rose-500/10 rounded-lg border border-rose-500/30">
                  <div className="text-lg font-semibold text-rose-300">SX</div>
                  <div className="text-xs text-rose-200/60 mb-2">One-to-One</div>
                  <div className="text-2xl font-bold text-white">{Math.round((instincts.SX || 0) * 100)}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Type Probabilities */}
        {result.type_probs && Object.keys(result.type_probs).length > 0 && (
          <Card className="bg-black/40 border-indigo-500/30 mb-8">
            <CardHeader>
              <CardTitle className="text-indigo-300 flex items-center gap-2">
                <span className="text-2xl">🎯</span> Type Probabilities
              </CardTitle>
              <CardDescription className="text-indigo-100/60">Likelihood across all 9 Enneagram types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-9 gap-2">
                {Object.entries(result.type_probs).sort((a, b) => Number(a[0]) - Number(b[0])).map(([type, prob]) => {
                  const probability = typeof prob === 'number' ? Math.round(prob * 100) : 0
                  const isDominant = Number(type) === result.dominant_type
                  return (
                    <div
                      key={type}
                      className={`p-3 rounded-lg text-center ${isDominant ? 'bg-indigo-500/30 border-2 border-indigo-400' : 'bg-white/5'}`}
                    >
                      <div className={`text-lg font-bold ${isDominant ? 'text-indigo-300' : 'text-white'}`}>
                        {type}
                      </div>
                      <div className={`text-sm ${isDominant ? 'text-indigo-200' : 'text-white/60'}`}>
                        {probability}%
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link href="/profile">
            <Button className="bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black font-semibold px-8 py-6 text-lg rounded-xl">
              View My Profile
            </Button>
          </Link>

          <Link href="/assessment">
            <Button variant="outline" size="lg" className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10">
              Retake Assessment
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <footer className="text-center pt-8 border-t border-white/10">
          <Badge variant="outline" className="mb-2 border-amber-500/50 text-amber-300">
            {result.ea_id} • Chapter {result.chapter}
          </Badge>
          <p className="text-white/40 text-sm mt-2">
            Version {result.meta?.version || '1.0.0'}
          </p>
        </footer>
      </div>
    </div>
  )
}
