'use client'

import { AssessmentResult } from '@/lib/assessment/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getChapterIconPath } from '@/lib/icons'
import Image from 'next/image'

interface ResultHeaderProps {
  result: AssessmentResult
}

export function ResultHeader({ result }: ResultHeaderProps) {
  return (
    <Card className="bg-gradient-to-r from-slate-800/80 to-purple-800/80 backdrop-blur-md border-purple-500/30 text-white">
      <CardHeader className="text-center pb-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white/20"
              style={{ backgroundColor: result.color.rgb_hex }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 relative">
                <Image
                  src={getChapterIconPath(result.chapter)}
                  alt={`Chapter ${result.chapter} Icon`}
                  fill
                  className="object-contain filter brightness-0 invert"
                />
              </div>
            </div>
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent mb-2">
            {result.ea_id}
          </CardTitle>
          <p className="text-xl text-gray-300">
            Chapter {result.chapter}
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="text-center space-y-6">
        {/* Color Swatch */}
        <div className="flex flex-col items-center space-y-3">
          <div 
            className="w-24 h-24 rounded-full shadow-2xl border-4 border-white/20"
            style={{ backgroundColor: result.color.rgb_hex }}
          ></div>
          <div className="text-sm text-gray-400">
            {result.color.hsl} • {result.color.rgb_hex}
          </div>
        </div>
        
        {/* Profile Info */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-200">
            {result.profile.display_name}
          </h2>
          <p className="text-gray-400 italic">
            {result.profile.theme}
          </p>
          <p className="text-lg text-purple-300">
            {result.profile.family}
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="text-center">
            <div className="text-sm text-gray-400">Dominant Type</div>
            <div className="text-xl font-bold text-purple-300">
              Type {result.dominant_type}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400">Assessment Time</div>
            <div className="text-xl font-bold text-blue-300">
              {Math.floor(result.meta.duration_sec / 60)}:{(result.meta.duration_sec % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}