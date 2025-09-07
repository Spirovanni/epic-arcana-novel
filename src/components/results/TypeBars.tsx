'use client'

import { AssessmentResult } from '@/lib/assessment/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FAMILY_LABELS } from '@/lib/assessment/mapping'

interface TypeBarsProps {
  result: AssessmentResult
}

export function TypeBars({ result }: TypeBarsProps) {
  const sortedTypes = Object.entries(result.type_probs)
    .map(([type, prob]) => ({
      type: parseInt(type),
      probability: prob,
      label: FAMILY_LABELS[parseInt(type)],
      percentage: Math.round(prob * 100)
    }))
    .sort((a, b) => b.probability - a.probability)
  
  const maxProb = sortedTypes[0]?.probability || 1
  
  return (
    <Card className="bg-slate-800/50 border-purple-500/30">
      <CardHeader>
        <CardTitle className="text-xl text-purple-300">
          Enneagram Type Probabilities
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {sortedTypes.map(({ type, probability, label, percentage }) => {
          const width = (probability / maxProb) * 100
          const isDominant = type === result.dominant_type
          
          return (
            <div key={type} className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className={`font-medium ${isDominant ? 'text-purple-300' : 'text-gray-300'}`}>
                  Type {type}: {label}
                  {isDominant && ' ← Dominant'}
                </span>
                <span className={isDominant ? 'text-purple-300 font-bold' : 'text-gray-400'}>
                  {percentage}%
                </span>
              </div>
              
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    isDominant 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
                      : 'bg-slate-500'
                  }`}
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}