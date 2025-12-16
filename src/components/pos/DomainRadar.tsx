'use client'

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { formatFacetLabel } from '@/lib/assessment/pos60_scoring'
import { PosDomainKey } from '@/lib/assessment/pos60_v1'

type Props = {
  domain: PosDomainKey
  facets: Record<string, number>
  color?: string
}

export function DomainRadar({ domain, facets, color = '#0f172a' }: Props) {
  const data = Object.entries(facets).map(([facet, score]) => ({
    label: formatFacetLabel(domain, facet),
    score,
  }))

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="label" tick={{ fill: '#475569', fontSize: 11 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <Radar dataKey="score" stroke={color} fill={color} fillOpacity={0.2} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
