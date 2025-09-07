'use client'

import { AssessmentResult } from '@/lib/assessment/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'

interface TraitListsProps {
  result: AssessmentResult
}

interface ProfileTraits {
  strengths: string[]
  shadows: string[]
  growth_focus: string[]
}

export function TraitLists({ result }: TraitListsProps) {
  const [traits, setTraits] = useState<ProfileTraits | null>(null)
  
  useEffect(() => {
    const loadTraits = async () => {
      try {
        const response = await fetch(`/api/profiles/${result.chapter}`)
        
        if (response.ok) {
          const profile = await response.json()
          setTraits({
            strengths: profile.strengths || [],
            shadows: profile.shadows || [],
            growth_focus: profile.growth_focus || []
          })
        } else {
          // Fallback traits
          setTraits({
            strengths: ['Adaptable nature', 'Strong intuition', 'Balanced perspective'],
            shadows: ['Over-analysis', 'Perfectionism', 'Self-doubt'],
            growth_focus: ['Embrace vulnerability', 'Trust the process', 'Balance action with reflection']
          })
        }
      } catch (error) {
        console.error('Error loading traits:', error)
        setTraits({
          strengths: ['Unique perspective', 'Personal authenticity', 'Growth mindset'],
          shadows: ['Internal conflicts', 'Overthinking', 'Self-criticism'],
          growth_focus: ['Self-acceptance', 'Clear communication', 'Consistent action']
        })
      }
    }
    
    loadTraits()
  }, [result.chapter])
  
  if (!traits) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="bg-slate-800/50 border-purple-500/30">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-slate-600 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-600 rounded"></div>
                  <div className="h-4 bg-slate-600 rounded"></div>
                  <div className="h-4 bg-slate-600 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
  
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Strengths */}
      <Card className="bg-slate-800/50 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-xl text-green-300 flex items-center gap-2">
            ✨ Top Strengths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {traits.strengths.slice(0, 3).map((strength, index) => (
              <li key={index} className="text-gray-300 flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                {strength}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      {/* Shadow Aspects */}
      <Card className="bg-slate-800/50 border-amber-500/30">
        <CardHeader>
          <CardTitle className="text-xl text-amber-300 flex items-center gap-2">
            🌙 Shadow Aspects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {traits.shadows.slice(0, 3).map((shadow, index) => (
              <li key={index} className="text-gray-300 flex items-start gap-2">
                <span className="text-amber-400 mt-1">•</span>
                {shadow}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      {/* Growth Focus */}
      <Card className="bg-slate-800/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-xl text-purple-300 flex items-center gap-2">
            🌱 Growth Focus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {traits.growth_focus.slice(0, 3).map((focus, index) => (
              <li key={index} className="text-gray-300 flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                {focus}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}