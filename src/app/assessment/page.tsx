'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { useAssessmentStore } from '@/store/useAssessmentStore'
import { ClientWrapper } from '@/components/ClientWrapper'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { AssessmentNavbar } from '@/components/assessment/AssessmentNavbar'

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
  
  // Reset assessment state when visiting the page
  useEffect(() => {
    resetAssessment()
  }, [])
  
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