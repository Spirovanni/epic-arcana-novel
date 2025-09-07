'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { GrowthAnalysis } from '@/components/dashboard/GrowthAnalysis'
import { AssessmentResult } from '@/lib/assessment/types'

export default function GrowthPage() {
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadResult = () => {
      try {
        const storedResult = localStorage.getItem('lsa-assessment-result')
        if (storedResult) {
          const parsedResult = JSON.parse(storedResult)
          setResult(parsedResult)
        }
      } catch (error) {
        console.error('Error loading assessment result:', error)
      } finally {
        setLoading(false)
      }
    }

    loadResult()
  }, [])

  if (loading) {
    return (
      <DashboardLayout title="Growth Analysis" subtitle="Loading your development areas...">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Analyzing growth opportunities...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout 
      title="Growth & Development" 
      subtitle={result ? `Personalized development plan for Chapter ${result.chapter}` : "Complete an assessment to see your growth opportunities"}
    >
      <GrowthAnalysis result={result} />
    </DashboardLayout>
  )
}