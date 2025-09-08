'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { StrengthsAnalysis } from '@/components/dashboard/StrengthsAnalysis'
import { useAssessmentDataRefresh } from '@/utils/assessmentEvents'
import { AssessmentResult } from '@/lib/assessment/types'

export default function StrengthsPage() {
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [loading, setLoading] = useState(true)

  const loadResult = async () => {
      try {
        const response = await fetch('/api/assessment/result')
        if (response.ok) {
          const result = await response.json()
          setResult(result)
        } else if (response.status === 404) {
          // No assessment result found
          setResult(null)
        } else if (response.status === 401) {
          // Not authenticated
          setResult(null)
        } else {
          console.error('Error loading assessment result')
        }
      } catch (error) {
        console.error('Error loading assessment result:', error)
      } finally {
        setLoading(false)
      }
    }

  useEffect(() => {
    loadResult()
  }, [])

  // Set up refresh listener
  useAssessmentDataRefresh(loadResult)

  if (loading) {
    return (
      <DashboardLayout title="Strengths Analysis" subtitle="Loading your strengths profile...">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Analyzing your strengths...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout 
      title="Your Strengths Profile" 
      subtitle={result ? `Based on Epic Arcana Chapter ${result.chapter}` : "Complete an assessment to see your strengths"}
    >
      <StrengthsAnalysis result={result} />
    </DashboardLayout>
  )
}