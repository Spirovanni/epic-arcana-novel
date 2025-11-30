'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AssessmentResult } from '@/lib/assessment/types'

interface PersonalityInsightsProps {
  result: AssessmentResult
}

const ENNEAGRAM_NAMES = {
  1: 'The Reformer',
  2: 'The Helper',
  3: 'The Achiever',
  4: 'The Individualist',
  5: 'The Investigator',
  6: 'The Loyalist',
  7: 'The Enthusiast',
  8: 'The Challenger',
  9: 'The Peacemaker',
}

const INSTINCT_NAMES = {
  SP: 'Self-Preservation',
  SO: 'Social',
  SX: 'One-to-One',
}

const DIMENSION_DESCRIPTIONS = {
  agency: 'Taking action and asserting will',
  stability: 'Emotional regulation and calm',
  empathy: 'Understanding and feeling for others',
  openness: 'Willingness to explore new ideas',
  orderliness: 'Preference for structure and rules',
  novelty_seeking: 'Attraction to new experiences',
  abstract_reasoning: 'Analytical and theoretical thinking',
  emotional_intensity: 'Depth of emotional experience',
  social_dominance: 'Leadership and influence orientation',
  cooperativeness: 'Teamwork and collaboration tendency',
  risk_tolerance: 'Comfort with uncertainty',
  conscientiousness: 'Diligence and responsibility',
  adaptability: 'Flexibility in changing situations',
  imagination: 'Creative and visionary thinking',
}

export function PersonalityInsights({ result }: PersonalityInsightsProps) {
  const [dominantInstinct, setDominantInstinct] = useState<'SP' | 'SO' | 'SX'>('SO')

  useEffect(() => {
    const instincts = result.instincts
    if (instincts.SP >= instincts.SO && instincts.SP >= instincts.SX) {
      setDominantInstinct('SP')
    } else if (instincts.SO >= instincts.SP && instincts.SO >= instincts.SX) {
      setDominantInstinct('SO')
    } else {
      setDominantInstinct('SX')
    }
  }, [result.instincts])

  // Get top 5 dimensions
  const topDimensions = Object.entries(result.dimensions)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  // Get match confidence
  const matchScore = result.profile.matchScore || 75

  return (
    <div className="space-y-6">
      {/* Primary Match Card */}
      <Card className="border-2" style={{ borderColor: result.profile.rgbHex || '#8B5CF6' }}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{result.profile.display_name}</CardTitle>
              <CardDescription className="mt-2 text-sm">
                {result.profile.theme}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-lg">
              {matchScore}% Match
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Personality Family
            </p>
            <Badge className="bg-blue-100 text-blue-900">
              {result.profile.family}
            </Badge>
          </div>

          {result.profile.matchReason && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Why This Match
              </p>
              <p className="text-sm text-foreground">
                {result.profile.matchReason}
              </p>
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Match Confidence
            </p>
            <Progress value={matchScore} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Enneagram Type & Instinct Stack */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Enneagram Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl">
                {result.dominant_type}
              </div>
              <div>
                <p className="font-semibold text-lg">
                  {ENNEAGRAM_NAMES[result.dominant_type as keyof typeof ENNEAGRAM_NAMES]}
                </p>
                <p className="text-sm text-muted-foreground">
                  Wing: {result.wing_bin} • Development: {result.development_bin}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Instinct Stack</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(result.instincts)
              .sort(([, a], [, b]) => b - a)
              .map(([instinct, value]) => (
                <div key={instinct}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">
                      {INSTINCT_NAMES[instinct as keyof typeof INSTINCT_NAMES]}
                    </span>
                    <span className="text-sm font-semibold">
                      {Math.round(value * 100)}%
                    </span>
                  </div>
                  <Progress value={value * 100} className="h-2" />
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      {/* Top Dimensions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Key Psychological Dimensions</CardTitle>
          <CardDescription>
            Your strongest traits and tendencies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {topDimensions.map(([dimension, value]) => (
            <div key={dimension}>
              <div className="flex items-start justify-between mb-1">
                <div>
                  <p className="text-sm font-medium capitalize">
                    {dimension.replace(/_/g, ' ')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {DIMENSION_DESCRIPTIONS[dimension as keyof typeof DIMENSION_DESCRIPTIONS]}
                  </p>
                </div>
                <span className="text-sm font-semibold ml-2">
                  {Math.round(value * 100)}
                </span>
              </div>
              <Progress value={value * 100} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Alternative Matches */}
      {result.alternativeMatches && result.alternativeMatches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Other Matching Archetypes</CardTitle>
            <CardDescription>
              Personalities that align with your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.alternativeMatches.map((match) => (
                <div
                  key={match.canonicalId}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div>
                    <p className="font-medium text-sm">{match.displayName}</p>
                    <p className="text-xs text-muted-foreground">{match.family}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{match.matchScore}%</p>
                    <p className="text-xs text-muted-foreground">{match.canonicalId}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
