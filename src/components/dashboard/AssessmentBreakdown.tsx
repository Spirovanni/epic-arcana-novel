'use client'

import { useState } from 'react'
import { AssessmentResult, AssessmentAnswers } from '@/lib/assessment/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface AssessmentBreakdownProps {
  result: AssessmentResult
  answers: AssessmentAnswers | null
}

export function AssessmentBreakdown({ result, answers }: AssessmentBreakdownProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const getDimensionColor = (value: number) => {
    if (value >= 0.7) return 'text-green-400'
    if (value >= 0.4) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getInstinctRanking = () => {
    return Object.entries(result.instincts)
      .sort(([,a], [,b]) => b - a)
      .map(([instinct, score], index) => ({
        instinct,
        score,
        rank: index + 1,
        label: instinct === 'SP' ? 'Self-Preservation' : 
               instinct === 'SO' ? 'Social' : 'Sexual/One-to-One'
      }))
  }

  const getTypeProbabilities = () => {
    return Object.entries(result.type_probs)
      .map(([type, prob]) => ({ type: parseInt(type), prob }))
      .sort((a, b) => b.prob - a.prob)
      .slice(0, 5) // Top 5 types
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const getCompletionDate = () => {
    if (answers?.meta?.endTime) {
      return new Date(answers.meta.endTime).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    return 'Unknown'
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div
                className="w-20 h-20 rounded-full border-4 border-white/20"
                style={{ backgroundColor: result.color.rgb_hex }}
              />
              <div>
                <CardTitle className="text-3xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {result.ea_id}
                </CardTitle>
                <h2 className="text-xl text-white font-semibold mt-1">
                  {result.profile.display_name}
                </h2>
                <p className="text-gray-300">
                  Chapter {result.chapter} • {result.profile.family} • {result.profile.theme}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-300">
                Type {result.dominant_type}
              </div>
              <div className="text-sm text-gray-400">
                Completed: {getCompletionDate()}
              </div>
              <div className="text-sm text-gray-400">
                Duration: {formatDuration(result.meta.duration_sec)}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
          <TabsTrigger value="methodology">Methodology</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Type Probabilities */}
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-300 flex items-center gap-2">
                  🎯 Type Probabilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {getTypeProbabilities().map(({ type, prob }) => (
                  <div key={type} className="flex justify-between items-center">
                    <span className={`font-medium ${type === result.dominant_type ? 'text-green-400' : 'text-gray-300'}`}>
                      Type {type}
                    </span>
                    <div className="flex items-center gap-2">
                      <Progress value={prob * 100} className="w-16 h-2" />
                      <span className="text-sm text-gray-400 w-12">
                        {(prob * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Instinct Stack */}
            <Card className="bg-slate-800/50 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-300 flex items-center gap-2">
                  ⚡ Instinct Stack
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {getInstinctRanking().map(({ instinct, score, rank, label }) => (
                  <div key={instinct} className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-gray-200">{rank}. {label}</span>
                      <div className="text-xs text-gray-500">{instinct}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={score * 100} className="w-16 h-2" />
                      <span className="text-sm text-gray-400 w-12">
                        {(score * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Wing & Development */}
            <Card className="bg-slate-800/50 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-green-300 flex items-center gap-2">
                  🌱 Development Pattern
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    Wing {result.wing_bin + 1}
                  </div>
                  <div className="text-xs text-gray-500">Wing Pattern</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400 mb-1">
                    Level {result.development_bin + 1}
                  </div>
                  <div className="text-xs text-gray-500">Development Stage</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Assessment Insights */}
          <Card className="bg-slate-800/50 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-purple-300">Assessment Insights</CardTitle>
              <CardDescription>
                Key findings from your personality assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-200">Strongest Dimensions</h4>
                  {Object.entries(result.dimensions)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 3)
                    .map(([dim, score]) => (
                      <div key={dim} className="flex justify-between items-center">
                        <span className="text-gray-300 capitalize">{dim.replace('_', ' ')}</span>
                        <Badge className={getDimensionColor(score)}>
                          {(score * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    ))}
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-200">Development Areas</h4>
                  {Object.entries(result.dimensions)
                    .sort(([,a], [,b]) => a - b)
                    .slice(0, 3)
                    .map(([dim, score]) => (
                      <div key={dim} className="flex justify-between items-center">
                        <span className="text-gray-300 capitalize">{dim.replace('_', ' ')}</span>
                        <Badge className={getDimensionColor(score)}>
                          {(score * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dimensions" className="space-y-6">
          <Card className="bg-slate-800/50 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-purple-300">Dimensional Analysis</CardTitle>
              <CardDescription>
                Your scores across all personality dimensions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {Object.entries(result.dimensions)
                  .sort(([,a], [,b]) => b - a)
                  .map(([dimension, score]) => (
                    <div key={dimension} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-200 capitalize">
                          {dimension.replace('_', ' ')}
                        </span>
                        <span className={`font-semibold ${getDimensionColor(score)}`}>
                          {(score * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={score * 100} className="h-3" />
                      <div className="text-xs text-gray-500">
                        {score >= 0.7 ? 'Strong presence in your personality' :
                         score >= 0.4 ? 'Moderate influence on behavior' :
                         'Area for potential development'}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responses" className="space-y-6">
          {answers ? (
            <>
              {/* Response Summary */}
              <Card className="bg-slate-800/50 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-blue-300">Response Summary</CardTitle>
                  <CardDescription>
                    Overview of your assessment responses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {answers.forcedChoice.length}
                      </div>
                      <div className="text-sm text-gray-400">Scenario Questions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {answers.likert.length}
                      </div>
                      <div className="text-sm text-gray-400">Rating Questions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {answers.forcedChoice.length + answers.likert.length}
                      </div>
                      <div className="text-sm text-gray-400">Total Responses</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Response Patterns */}
              <Card className="bg-slate-800/50 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-green-300">Response Patterns</CardTitle>
                  <CardDescription>
                    Analysis of your response behavior
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-200">Likert Scale Distribution</h4>
                    {[1, 2, 3, 4, 5].map(rating => {
                      const count = answers.likert.filter(a => a.rating === rating).length
                      const percentage = (count / answers.likert.length) * 100
                      return (
                        <div key={rating} className="flex items-center gap-4">
                          <span className="w-16 text-gray-300">Rating {rating}</span>
                          <Progress value={percentage} className="flex-1 h-2" />
                          <span className="w-16 text-sm text-gray-400">
                            {count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-slate-800/50 border-yellow-500/30">
              <CardHeader>
                <CardTitle className="text-yellow-300">Response Data Unavailable</CardTitle>
                <CardDescription>
                  Response details are not available for this assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  This assessment was completed before response tracking was implemented. 
                  Future assessments will include detailed response analysis.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="methodology" className="space-y-6">
          <Card className="bg-slate-800/50 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-purple-300">Scoring Methodology</CardTitle>
              <CardDescription>
                How your Epic Arcana profile was calculated
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-200 mb-2">Dimensional Scoring</h4>
                  <p className="text-gray-400 text-sm">
                    Your responses to scenario-based questions and rating scales are weighted across 
                    multiple personality dimensions. Each dimension represents a core aspect of behavior 
                    and motivation, scored from 0-100%.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-200 mb-2">Type Determination</h4>
                  <p className="text-gray-400 text-sm">
                    Your dominant Enneagram type (Type {result.dominant_type}) was determined by analyzing 
                    probability distributions across all nine types. The highest probability type becomes 
                    your dominant type, with secondary patterns informing wing and development levels.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-200 mb-2">Instinct Stack</h4>
                  <p className="text-gray-400 text-sm">
                    Your instinctual variant stack (SP, SO, SX) is calculated based on specific response 
                    patterns that indicate your primary survival strategies and areas of focus in different 
                    life contexts.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-200 mb-2">360 Profile System</h4>
                  <p className="text-gray-400 text-sm">
                    Your unique Chapter {result.chapter} profile ({result.ea_id}) represents one of 360 
                    possible personality combinations, determined by your type, wing pattern, development 
                    level, and instinctual variant configuration.
                  </p>
                </div>
              </div>
              
              <div className="p-4 bg-purple-600/10 rounded-lg border border-purple-500/20">
                <h4 className="font-semibold text-purple-300 mb-2">Assessment Version</h4>
                <p className="text-gray-400 text-sm">
                  Version: {result.meta.version} • Completed in {formatDuration(result.meta.duration_sec)}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}