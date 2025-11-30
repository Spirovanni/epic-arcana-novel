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

const ENNEAGRAM_TO_FAMILIES: Record<number, { family: string; theme: string }> = {
  1: { family: 'Order / Systems', theme: 'Reformer' },
  2: { family: 'Belonging / Care', theme: 'Helper' },
  3: { family: 'Leadership / Mastery', theme: 'Achiever' },
  4: { family: 'Authenticity / Self-Expression', theme: 'Individualist' },
  5: { family: 'Knowledge / Understanding', theme: 'Investigator' },
  6: { family: 'Security / Loyalty', theme: 'Loyalist' },
  7: { family: 'Exploration / Freedom', theme: 'Enthusiast' },
  8: { family: 'Power / Control', theme: 'Challenger' },
  9: { family: 'Acceptance / Peace', theme: 'Peacemaker' },
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
  const familyInfo = ENNEAGRAM_TO_FAMILIES[result.dominant_type as keyof typeof ENNEAGRAM_TO_FAMILIES]
  const rgbColor = result.profile.rgbHex || result.color.rgb_hex

  return (
    <Link href={`/results/${result.ea_id}`}>
      <Card
        className="border-2 hover:shadow-xl transition-all cursor-pointer h-full overflow-hidden group"
        style={{ borderColor: rgbColor }}
      >
        {/* Color Bar Header */}
        <div
          className="h-1.5 w-full transition-all group-hover:h-2"
          style={{ backgroundColor: rgbColor }}
        />

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {/* EA-XXX Badge */}
              <Badge variant="outline" className="mb-2 text-xs font-mono">
                {result.ea_id}
              </Badge>

              <CardTitle className="text-lg line-clamp-2 leading-tight">
                {result.profile.display_name || `Epic Arcana ${result.ea_id}`}
              </CardTitle>

              {/* Family Breakdown */}
              <div className="mt-2 space-y-1">
                <p className="text-xs text-muted-foreground font-medium">
                  {familyInfo.family}
                </p>
                <p className="text-xs text-muted-foreground">
                  Type {result.dominant_type} • {ENNEAGRAM_NAMES[result.dominant_type as keyof typeof ENNEAGRAM_NAMES]}
                </p>
              </div>
            </div>

            {/* Stylish Color Circle */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div
                className="w-12 h-12 rounded-full border-2 shadow-md transition-transform group-hover:scale-110"
                style={{
                  backgroundColor: rgbColor,
                  borderColor: rgbColor,
                  opacity: 0.9
                }}
              />
              <div className="text-center">
                <p className="text-xs font-mono text-muted-foreground leading-none">
                  {result.chapter}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Match Score with Accent Color */}
          {matchScore && (
            <div className="pt-1 pb-2 border-b" style={{ borderColor: `${rgbColor}20` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold">Profile Alignment</span>
                <span className="text-sm font-bold" style={{ color: rgbColor }}>
                  {matchScore}%
                </span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full transition-all"
                  style={{ width: `${matchScore}%`, backgroundColor: rgbColor }}
                />
              </div>
            </div>
          )}

          {/* Wing & Development Profile */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-secondary/50 rounded p-2 text-center">
              <p className="text-muted-foreground text-xs">Wing</p>
              <p className="font-semibold text-base">{result.wing_bin + 1}</p>
            </div>
            <div className="bg-secondary/50 rounded p-2 text-center">
              <p className="text-muted-foreground text-xs">Dev</p>
              <p className="font-semibold text-base">{result.development_bin + 1}</p>
            </div>
            <div className="rounded p-2 text-center" style={{ backgroundColor: `${rgbColor}15` }}>
              <p className="text-muted-foreground text-xs">Chapter</p>
              <p className="font-semibold text-base">{result.chapter}</p>
            </div>
          </div>

          {/* Top Dimensions */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground">Key Traits</p>
            {topDimensions.map(([dimension, value]) => (
              <div key={dimension} className="flex items-center gap-2">
                <span className="text-xs truncate capitalize flex-1">
                  {dimension.replace(/_/g, ' ')}
                </span>
                <div className="w-12 h-1.5 bg-secondary rounded-full overflow-hidden flex-shrink-0">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${value * 100}%`,
                      backgroundColor: rgbColor
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Primary Instinct */}
          {dominantInstinct.length > 0 && (
            <div className="pt-1">
              <p className="text-xs font-semibold text-muted-foreground mb-1.5">Instinct Drive</p>
              <Badge
                variant="secondary"
                className="text-xs font-medium"
                style={{ backgroundColor: `${rgbColor}20`, color: rgbColor }}
              >
                {INSTINCT_LABELS[dominantInstinct[0][0] as keyof typeof INSTINCT_LABELS]?.name}
              </Badge>
            </div>
          )}

          {/* CTA */}
          <div className="pt-2 text-center">
            <p className="text-xs font-semibold transition-colors" style={{ color: rgbColor }}>
              View Full Profile →
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
