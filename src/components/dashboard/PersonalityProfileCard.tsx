'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AssessmentResult } from '@/lib/assessment/types'
import Link from 'next/link'

interface PersonalityProfileCardProps {
  result: AssessmentResult
}

const ENNEAGRAM_NAMES: Record<number, string> = {
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

const INSTINCT_LABELS: Record<string, { name: string; color: string }> = {
  SP: { name: 'Self-Preservation', color: 'bg-red-500' },
  SO: { name: 'Social', color: 'bg-blue-500' },
  SX: { name: 'Sexual/One-to-One', color: 'bg-purple-500' },
}

export function PersonalityProfileCard({ result }: PersonalityProfileCardProps) {
  const topDimensions = Object.entries(result.dimensions)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  const dominantInstinct = Object.entries(result.instincts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 1)

  const matchScore = result.profile.matchScore || 75

  return (
    <Link href={`/results/${result.ea_id}`}>
      <Card
        className="border-2 hover:shadow-lg transition-all cursor-pointer h-full"
        style={{ borderColor: result.profile.rgbHex || result.color.rgb_hex }}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg line-clamp-2">
                {result.profile.display_name || `Epic Arcana ${result.ea_id}`}
              </CardTitle>
              <CardDescription className="text-xs mt-1 line-clamp-2">
                {result.profile.theme}
              </CardDescription>
            </div>
            <div
              className="w-10 h-10 rounded-lg border-2 flex-shrink-0 ml-2"
              style={{
                backgroundColor: result.profile.rgbHex || result.color.rgb_hex,
                borderColor: result.profile.rgbHex || result.color.rgb_hex
              }}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Match Score */}
          {matchScore && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">Match Confidence</span>
                <span className="text-xs font-semibold">{matchScore}%</span>
              </div>
              <Progress value={matchScore} className="h-1.5" />
            </div>
          )}

          {/* Type & Family */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-muted-foreground">Type</p>
              <p className="text-sm font-semibold">
                {result.dominant_type} - {ENNEAGRAM_NAMES[result.dominant_type as keyof typeof ENNEAGRAM_NAMES]}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Family</p>
              <p className="text-sm font-semibold truncate">{result.profile.family}</p>
            </div>
          </div>

          {/* Wing & Development */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-secondary rounded p-2">
              <p className="text-muted-foreground">Wing</p>
              <p className="font-semibold">Level {result.wing_bin}</p>
            </div>
            <div className="bg-secondary rounded p-2">
              <p className="text-muted-foreground">Development</p>
              <p className="font-semibold">Level {result.development_bin}</p>
            </div>
          </div>

          {/* Top Dimensions */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Key Dimensions</p>
            {topDimensions.map(([dimension, value]) => (
              <div key={dimension} className="flex items-center gap-2">
                <span className="text-xs truncate capitalize">
                  {dimension.replace(/_/g, ' ')}
                </span>
                <div className="flex-1 h-1.5 bg-secondary rounded overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                    style={{ width: `${value * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Primary Instinct */}
          {dominantInstinct.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Primary Instinct</p>
              <Badge className="text-xs">
                {INSTINCT_LABELS[dominantInstinct[0][0] as keyof typeof INSTINCT_LABELS]?.name}
              </Badge>
            </div>
          )}

          {/* View Full Profile */}
          <p className="text-xs text-primary hover:text-primary/80 font-medium">
            View Full Profile →
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
