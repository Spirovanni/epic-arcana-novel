'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser, SignInButton } from '@clerk/nextjs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAssessmentStore } from '@/store/useAssessmentStore'
import { useAssessmentRefresh } from '@/utils/assessmentEvents'

interface AuthGateProps {
  onSuccess: (resultId: string) => void
}

export function AuthGate({ onSuccess }: AuthGateProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showJourneyStartQuestion, setShowJourneyStartQuestion] = useState(false)
  const [journeyStartDate, setJourneyStartDate] = useState('')
  const [autoSaveTriggered, setAutoSaveTriggered] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const { isSignedIn, isLoaded } = useUser()
  const { result } = useAssessmentStore()
  const { triggerRefresh } = useAssessmentRefresh()
  
  // Save result and answers, then redirect
  const handleSaveResult = useCallback(async (overrideJourneyStartDate?: string) => {
    if (!result) return
    
    setSaveError(null)
    setIsSaving(true)
    
    try {
      // Save answers first (if available)
      const answersData = useAssessmentStore.getState().getAnswersForApi()
      if (answersData.forced.length > 0 || answersData.likert.length > 0) {
        await fetch('/api/assessment/answers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(answersData),
        })
      }

      // Save result with journey start date
      const resolvedJourneyStart = overrideJourneyStartDate || journeyStartDate || undefined
      const resultWithJourneyStart = resolvedJourneyStart
        ? { ...result, journeyStartDate: resolvedJourneyStart }
        : result
      
      const response = await fetch('/api/assessment/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resultWithJourneyStart),
      })
      
      if (response.status === 409) {
        // User already has an assessment
        const { resultId } = await response.json()
        triggerRefresh() // Trigger refresh of assessment data across the app
        onSuccess(resultId)
      } else if (!response.ok) {
        throw new Error('Failed to save result')
      } else {
        const { resultId } = await response.json()
        triggerRefresh() // Trigger refresh of assessment data across the app
        onSuccess(resultId)
      }
      
    } catch (error) {
      console.error('Error saving assessment data:', error)
      setSaveError('We could not save your results. Please try again.')
      setShowJourneyStartQuestion(true)
    } finally {
      setIsSaving(false)
    }
  }, [result, journeyStartDate, onSuccess, triggerRefresh])
  
  // Auto-save and redirect when signed in so users hit results immediately
  useEffect(() => {
    if (isLoaded && isSignedIn && result && !isSaving && !autoSaveTriggered) {
      setAutoSaveTriggered(true)
      handleSaveResult()
    }
  }, [isLoaded, isSignedIn, result, isSaving, autoSaveTriggered, handleSaveResult])
  
  // Prefill journey start date for users who want to schedule immediately
  useEffect(() => {
    if (showJourneyStartQuestion && !journeyStartDate) {
      setJourneyStartDate(new Date().toISOString().split('T')[0])
    }
  }, [showJourneyStartQuestion, journeyStartDate])
  
  if (!isLoaded) {
    return (
      <Dialog open={isOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Loading...</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
  
  if (isSaving) {
    return (
      <Dialog open={isOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Saving Your Results...</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Processing your Epic Arcana profile and preparing your printable report...</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
  
  // Journey Start Date Question for signed-in users
  if (showJourneyStartQuestion && isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center px-4">
        <Card className="w-full max-w-2xl bg-slate-800/80 backdrop-blur-md border-purple-500/30">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              🗓️ When Will You Begin Your Journey?
            </CardTitle>
            <CardDescription className="text-gray-300">
              Choose the date you want to start your personalized Epic Arcana calendar assignments. This will be Day 1 of your Human Framework Calendar journey.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Preview of Results */}
            {result && (
              <div className="text-center space-y-4 p-6 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg border border-purple-500/30">
                <div className="text-4xl mb-2">{result.ea_id}</div>
                <div 
                  className="w-16 h-16 mx-auto rounded-full shadow-lg"
                  style={{ backgroundColor: result.color.rgb_hex }}
                ></div>
                <div className="text-lg font-semibold text-gray-200">
                  {result.profile.display_name}
                </div>
                <div className="text-sm text-gray-400">
                  Chapter {result.chapter} • {result.profile.family}
                </div>
              </div>
            )}
            
            {/* Journey Start Date Selection */}
            <div className="space-y-4">
              <label htmlFor="journey-start" className="block text-sm font-medium text-gray-300">
                Journey Start Date
              </label>
              <input
                id="journey-start"
                type="date"
                value={journeyStartDate}
                onChange={(e) => setJourneyStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-400">
                Your calendar will begin on this date with Day 1 assignments tailored to your {result?.profile.display_name} personality type.
              </p>
            </div>
            
            {saveError && (
              <div className="text-sm text-red-400 bg-red-900/20 border border-red-500/40 rounded-md p-3">
                {saveError}
              </div>
            )}
            
            <Button 
              onClick={() => handleSaveResult(journeyStartDate || undefined)}
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3"
            >
              Save & View My Results
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleSaveResult()}
              disabled={isSaving}
              className="w-full border-purple-500/40 text-purple-100 hover:bg-purple-500/10"
            >
              Skip scheduling for now
            </Button>
            
            <div className="text-center text-sm text-gray-400">
              <p>
                Once you begin, you'll receive daily assignments designed to help you explore and develop your unique personality traits through the Human Framework Calendar. You can also skip scheduling and jump straight to your report.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl bg-slate-800/80 backdrop-blur-md border-purple-500/30">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            ✨ Assessment Complete!
          </CardTitle>
          <CardDescription className="text-gray-300">
            Your Epic Arcana profile is ready. Sign in to instantly open your results with a printable report.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Preview of Results */}
          {result && (
            <div className="text-center space-y-4 p-6 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg border border-purple-500/30">
              <div className="text-4xl mb-2">{result.ea_id}</div>
              <div 
                className="w-16 h-16 mx-auto rounded-full shadow-lg"
                style={{ backgroundColor: result.color.rgb_hex }}
              ></div>
              <div className="text-lg font-semibold text-gray-200">
                {result.profile.display_name}
              </div>
              <div className="text-sm text-gray-400">
                Chapter {result.chapter} • {result.profile.family}
              </div>
            </div>
          )}
          
          {/* Sign In Options */}
          <div className="space-y-4">
            <SignInButton mode="modal">
              <Button variant="mystical" size="lg" className="w-full">
                Sign in to view results
              </Button>
            </SignInButton>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full border-purple-500/50 hover:bg-purple-500/10"
              onClick={() => {
                // Download results as JSON for guests
                if (result) {
                  const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `epic-arcana-${result.ea_id}.json`
                  a.click()
                  URL.revokeObjectURL(url)
                }
              }}
            >
              Download Results (Guest)
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-400">
            <p>
              By signing in, you'll gain access to your personal dashboard,
              detailed insights, and the ability to retake the assessment.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
