'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { GoalsPlanning } from '@/components/dashboard/GoalsPlanning'
import { useAssessmentDataRefresh } from '@/utils/assessmentEvents'
import { AssessmentResult } from '@/lib/assessment/types'

export default function GoalsPage() {
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
      <DashboardLayout title="Goals & Action Plans" subtitle="Generating your personalized goals...">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Creating your action plan...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout 
      title="Goals & Action Plans" 
      subtitle={result ? `Personality-driven goals based on your Epic Arcana profile` : "Complete an assessment to generate personalized goals"}
    >
      <GoalsPlanning result={result} />
    </DashboardLayout>
  )
}