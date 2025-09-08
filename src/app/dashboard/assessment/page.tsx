'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { AssessmentBreakdown } from '@/components/dashboard/AssessmentBreakdown'
import { AssessmentResult, AssessmentAnswers } from '@/lib/assessment/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAssessmentDataRefresh } from '@/utils/assessmentEvents'
import Link from 'next/link'

export default function DashboardAssessmentPage() {
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [answers, setAnswers] = useState<AssessmentAnswers | null>(null)
  const [loading, setLoading] = useState(true)

  const loadAssessmentData = async () => {
    try {
      // Load assessment result
      const resultResponse = await fetch('/api/assessment/result')
      let resultData = null
      if (resultResponse.ok) {
        resultData = await resultResponse.json()
        setResult(resultData)
      } else {
        setResult(null)
      }

      // Load assessment answers
      const answersResponse = await fetch('/api/assessment/answers')
      if (answersResponse.ok) {
        const answersData = await answersResponse.json()
        setAnswers(answersData)
      } else {
        setAnswers(null)
      }

      setLoading(false)
    } catch (error) {
      console.error('Error loading assessment data:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAssessmentData()
  }, [])

  // Set up refresh listener
  useAssessmentDataRefresh(loadAssessmentData)

  if (loading) {
    return (
      <DashboardLayout title="Assessment Analysis" subtitle="Loading your assessment data...">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading assessment breakdown...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!result) {
    return (
      <DashboardLayout title="Assessment Analysis" subtitle="Complete your assessment to see detailed results">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-slate-800/50 border-purple-500/30">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                🔮 Assessment Not Found
              </CardTitle>
              <CardDescription className="text-gray-300">
                Take your Epic Arcana personality assessment to unlock detailed analysis and insights.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-gray-400">
                Once you complete the assessment, this page will show:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="space-y-2">
                  <h4 className="font-semibold text-purple-300">Response Analysis</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Your answer to each question</li>
                    <li>• Response patterns and themes</li>
                    <li>• Time spent per section</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-300">Scoring Breakdown</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Dimensional scoring methodology</li>
                    <li>• Type probability calculations</li>
                    <li>• Instinct ranking analysis</li>
                  </ul>
                </div>
              </div>
              <Link href="/assessment">
                <Button variant="mystical" size="lg" className="mt-6">
                  Take Assessment
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout 
      title="Assessment Analysis" 
      subtitle={`Detailed breakdown for ${result.profile.display_name} (${result.ea_id})`}
    >
      <AssessmentBreakdown result={result} answers={answers} />
    </DashboardLayout>
  )
}