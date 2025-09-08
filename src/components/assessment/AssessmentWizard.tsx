'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAssessmentStore } from '@/store/useAssessmentStore'
import { getForcedChoiceItems } from '@/lib/items/forced'
import { getLikertItems } from '@/lib/items/likert'
import { ForcedChoiceItem } from '@/components/assessment/ForcedChoiceItem'
import { LikertItem } from '@/components/assessment/LikertItem'
import { AssessmentProgress } from '@/components/assessment/AssessmentProgress'
import { AuthGate } from '@/components/assessment/AuthGate'
import { AssessmentNavbar } from '@/components/assessment/AssessmentNavbar'

const ITEMS_PER_STEP = {
  1: { forced: 3, likert: 0 }, // 3 forced choice
  2: { forced: 3, likert: 0 }, // 3 forced choice  
  3: { forced: 3, likert: 0 }, // 3 forced choice
  4: { forced: 3, likert: 12 }, // 3 forced choice + 12 likert
  5: { forced: 3, likert: 12 }, // 3 forced choice + 12 likert
  6: { forced: 3, likert: 12 }, // 3 forced choice + 12 likert
}

export function AssessmentWizard() {
  const router = useRouter()
  const [showAuthGate, setShowAuthGate] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    currentStep,
    totalSteps,
    forcedChoiceAnswers,
    likertAnswers,
    addForcedChoiceAnswer,
    updateLikertAnswer,
    setStep,
    completeAssessment,
    setResult,
    getAnswersForApi,
    canProceedToStep,
    startAssessment
  } = useAssessmentStore()
  
  // Initialize assessment if not started
  useEffect(() => {
    if (currentStep === 0) {
      startAssessment()
    }
  }, [currentStep]) // Only depend on currentStep
  
  const forcedChoiceItems = getForcedChoiceItems()
  const likertItems = getLikertItems()
  
  // Get items for current step
  const getItemsForStep = (step: number) => {
    const stepConfig = ITEMS_PER_STEP[step as keyof typeof ITEMS_PER_STEP]
    if (!stepConfig) return { forced: [], likert: [] }
    
    const forcedStartIndex = (step - 1) * 3
    const likertStartIndex = Math.max(0, (step - 4) * 12)
    
    return {
      forced: forcedChoiceItems.slice(forcedStartIndex, forcedStartIndex + stepConfig.forced),
      likert: likertItems.slice(likertStartIndex, likertStartIndex + stepConfig.likert)
    }
  }
  
  const { forced: currentForcedItems, likert: currentLikertItems } = getItemsForStep(currentStep)
  const allCurrentItems = [...currentForcedItems, ...currentLikertItems]
  
  // Check if current step is complete
  const isStepComplete = useMemo(() => {
    const stepConfig = ITEMS_PER_STEP[currentStep as keyof typeof ITEMS_PER_STEP]
    if (!stepConfig) return false
    
    const forcedComplete = currentForcedItems.every(item => {
      const answer = forcedChoiceAnswers.find(a => a.itemId === item.id)
      return answer && answer.best !== undefined && answer.worst !== undefined
    })
    
    const likertComplete = currentLikertItems.every(item => {
      const answer = likertAnswers.find(a => a.itemId === item.id)
      return answer && answer.rating !== undefined
    })
    
    return forcedComplete && likertComplete
  }, [currentStep, currentForcedItems, currentLikertItems, forcedChoiceAnswers, likertAnswers])
  
  const handleComplete = useCallback(async () => {
    setIsSubmitting(true)
    
    try {
      // Score the assessment
      const answers = getAnswersForApi()
      const response = await fetch('/api/assessment/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers),
      })
      
      if (!response.ok) {
        throw new Error('Failed to score assessment')
      }
      
      const result = await response.json()
      setResult(result)
      completeAssessment()
      
      // Show auth gate for saving results
      setShowAuthGate(true)
      
    } catch (error) {
      console.error('Error completing assessment:', error)
      // Handle error state
    } finally {
      setIsSubmitting(false)
    }
  }, [getAnswersForApi, setResult, completeAssessment])
  
  const handleNext = useCallback(async () => {
    if (currentStep < totalSteps) {
      setStep(currentStep + 1)
    } else {
      // Assessment complete
      await handleComplete()
    }
  }, [currentStep, totalSteps, setStep, handleComplete])
  
  const handleAuthSuccess = useCallback(async (resultId: string) => {
    router.push(`/results/${resultId}`)
  }, [router])
  
  if (showAuthGate) {
    return <AuthGate onSuccess={handleAuthSuccess} />
  }
  
  if (allCurrentItems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Loading assessment...</p>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <AssessmentNavbar />
      <div className="container mx-auto px-4 py-8">
        {/* Progress Header - Sticky */}
        <div className="sticky top-20 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-purple-500/20 pb-4 mb-8">
          <AssessmentProgress 
            currentStep={currentStep} 
            totalSteps={totalSteps}
            className="max-w-4xl mx-auto"
          />
        </div>
        
        {/* Assessment Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Step Title */}
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              {currentStep <= 3 ? 'Story Scenarios' : 'Personal Reflections'}
            </h1>
            <p className="text-gray-400">
              {currentStep <= 3 
                ? 'Choose your most and least preferred responses to each scenario'
                : 'Rate how much each statement resonates with you'
              }
            </p>
          </div>
          
          {/* Items */}
          <div className="space-y-8">
            {currentForcedItems.map(item => (
              <Card key={item.id} className="bg-slate-800/50 border-purple-500/30">
                <CardContent className="p-6">
                  <ForcedChoiceItem
                    item={item}
                    answer={forcedChoiceAnswers.find(a => a.itemId === item.id)}
                    onAnswer={(best, worst) => addForcedChoiceAnswer({ itemId: item.id, best, worst })}
                  />
                </CardContent>
              </Card>
            ))}
            
            {currentLikertItems.map(item => (
              <Card key={item.id} className="bg-slate-800/50 border-purple-500/30">
                <CardContent className="p-6">
                  <LikertItem
                    item={item}
                    answer={likertAnswers.find(a => a.itemId === item.id)}
                    onAnswer={(rating) => updateLikertAnswer(item.id, rating)}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(1, currentStep - 1))}
              disabled={currentStep <= 1}
              className="border-purple-500/50 hover:bg-purple-500/10"
            >
              Previous
            </Button>
            
            <div className="text-center text-sm text-gray-400">
              {isStepComplete 
                ? '✓ Step complete' 
                : `Answer all questions to continue`
              }
            </div>
            
            <Button
              onClick={handleNext}
              disabled={!isStepComplete || isSubmitting}
              variant="mystical"
              className="min-w-[120px]"
            >
              {isSubmitting 
                ? 'Processing...'
                : currentStep < totalSteps 
                  ? 'Next Step' 
                  : 'Complete'
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}