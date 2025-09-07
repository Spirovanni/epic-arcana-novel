'use client'

import { AssessmentResult } from '@/lib/assessment/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ColorSwatchProps {
  result: AssessmentResult
}

export function ColorSwatch({ result }: ColorSwatchProps) {
  return (
    <Card className="bg-slate-800/50 border-purple-500/30">
      <CardHeader>
        <CardTitle className="text-xl text-purple-300">
          Your Arcana Color
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center">
          <div 
            className="w-32 h-32 rounded-full shadow-2xl border-4 border-white/20"
            style={{ backgroundColor: result.color.rgb_hex }}
          />
        </div>
        
        <div className="text-center space-y-2">
          <div className="text-2xl font-bold text-gray-200">
            {result.color.rgb_hex}
          </div>
          <div className="text-gray-400">
            {result.color.hsl}
          </div>
          <div className="text-sm text-gray-500">
            Hue Index: {result.color.hue_index}/359
          </div>
        </div>
        
        <div className="text-sm text-gray-400 text-center">
          <p>
            Your color is generated from your unique combination of 
            dominant type ({result.dominant_type}), 
            wing pattern ({result.wing_bin}), 
            and development stage ({result.development_bin}).
          </p>
        </div>
      </CardContent>
    </Card>
  )
}