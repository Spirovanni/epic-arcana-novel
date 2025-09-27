'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAssessmentStore } from '@/store/useAssessmentStore'
import { ClientWrapper } from '@/components/ClientWrapper'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { AssessmentNavbar } from '@/components/assessment/AssessmentNavbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// Dynamically import the AssessmentWizard components to avoid SSR issues
const AssessmentWizard = dynamic(
  () => import('@/components/assessment/AssessmentWizard').then(mod => ({ default: mod.AssessmentWizard })),
  { ssr: false }
)

const AdventureAssessmentWizard = dynamic(
  () => import('@/components/assessment/AdventureAssessmentWizard').then(mod => ({ default: mod.AdventureAssessmentWizard })),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your adventure...</p>
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
  const useAdventure = searchParams.get('style') !== 'classic' // Default to adventure mode
  
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
      <div className="min-h-screen bg-background">
        <AssessmentNavbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Checking your profile...</p>
          </div>
        </div>
      </div>
    )
  }
  
  if (hasExistingResult) {
    return (
      <div className="min-h-screen bg-background">
        <AssessmentNavbar />
        <div className="flex items-center justify-center h-screen">
          <div className="max-w-md mx-auto text-center px-4">
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Assessment Complete</CardTitle>
                <CardDescription className="text-base">
                  You've already completed your Player Type & Role Assessment. View your results and personalized dashboard below.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 justify-center">
                  <Button asChild className="bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 hover:from-violet-400 hover:via-indigo-400 hover:to-blue-400">
                    <Link href="/dashboard">
                      View Dashboard
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/">
                      Go Home
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }
  
  return useAdventure ? <AdventureAssessmentWizard /> : <AssessmentWizard />
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