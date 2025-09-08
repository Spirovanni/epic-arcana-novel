'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAssessmentStore } from '@/store/useAssessmentStore'
import { ClientWrapper } from '@/components/ClientWrapper'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { AssessmentNavbar } from '@/components/assessment/AssessmentNavbar'
import Link from 'next/link'

// Dynamically import the AssessmentWizard to avoid SSR issues
const AssessmentWizard = dynamic(
  () => import('@/components/assessment/AssessmentWizard').then(mod => ({ default: mod.AssessmentWizard })),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <AssessmentNavbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading assessment...</p>
          </div>
        </div>
      </div>
    )
  }
)

function AssessmentContent() {
  const { resetAssessment } = useAssessmentStore()
  const searchParams = useSearchParams()
  const [hasExistingResult, setHasExistingResult] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const isRetake = searchParams.get('retake') === 'true'
  
  useEffect(() => {
    const checkExistingAssessment = async () => {
      // If this is a retake, skip the existing result check
      if (isRetake) {
        resetAssessment()
        setLoading(false)
        return
      }
      
      try {
        const response = await fetch('/api/assessment/result')
        if (response.ok) {
          // User already has a result, redirect to dashboard
          setHasExistingResult(true)
        } else if (response.status === 404) {
          // No existing result, proceed with assessment
          resetAssessment()
        } else if (response.status === 401) {
          // Not authenticated, proceed with assessment
          resetAssessment()
        }
      } catch (error) {
        console.error('Error checking existing assessment:', error)
        // On error, proceed with assessment
        resetAssessment()
      } finally {
        setLoading(false)
      }
    }
    
    checkExistingAssessment()
  }, [resetAssessment, isRetake])
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <AssessmentNavbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Checking your profile...</p>
          </div>
        </div>
      </div>
    )
  }
  
  if (hasExistingResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <AssessmentNavbar />
        <div className="flex items-center justify-center h-screen">
          <div className="max-w-md mx-auto text-center px-4">
            <div className="bg-slate-800/50 rounded-xl p-8 border border-purple-500/30">
              <h2 className="text-2xl font-bold text-white mb-4">Assessment Complete</h2>
              <p className="text-gray-300 mb-6">
                You've already completed your Player Type & Role Assessment. View your results and personalized dashboard below.
              </p>
              <div className="flex gap-3 justify-center">
                <Link 
                  href="/dashboard"
                  className="bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 hover:from-violet-400 hover:via-indigo-400 hover:to-blue-400 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105"
                >
                  View Dashboard
                </Link>
                <Link 
                  href="/"
                  className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors"
                >
                  Go Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  return <AssessmentWizard />
}

export default function AssessmentPage() {
  return (
    <ErrorBoundary>
      <ClientWrapper>
        <AssessmentContent />
      </ClientWrapper>
    </ErrorBoundary>
  )
}