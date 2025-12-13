'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useUser, SignInButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useAssessmentStore } from '@/store/useAssessmentStore'
import { getForcedChoiceItems } from '@/lib/items/forced'
import { getLikertItems } from '@/lib/items/likert'
import { ForcedChoiceItem } from '@/components/assessment/ForcedChoiceItem'
import { LikertItem } from '@/components/assessment/LikertItem'
import { AssessmentProgress } from '@/components/assessment/AssessmentProgress'
import { AuthGate } from '@/components/assessment/AuthGate'
import { AssessmentNavbar } from '@/components/assessment/AssessmentNavbar'
import { MagicalLoadingScreen } from '@/components/assessment/MagicalLoadingScreen'
import { useAssessmentPersistence } from '@/hooks/useAssessmentPersistence'

const ITEMS_PER_STEP = {
  1: { forced: 3, likert: 0 }, // 3 forced choice
  2: { forced: 3, likert: 0 }, // 3 forced choice  
  3: { forced: 3, likert: 0 }, // 3 forced choice
  4: { forced: 3, likert: 12 }, // 3 forced choice + 12 likert
  5: { forced: 3, likert: 12 }, // 3 forced choice + 12 likert
  6: { forced: 3, likert: 12 }, // 3 forced choice + 12 likert
  // Step 7 is optional career focus (no forced/likert items)
}

// Configuration for question randomization
const RANDOMIZATION_CONFIG = {
  enabled: true, // Set to false to disable randomization
  useUserSeeding: true, // Different random order per user (but consistent per user)
  seedLength: 8, // How many characters of user ID to use in seed
}

export function AssessmentWizard() {
  const router = useRouter()
  const [showAuthGate, setShowAuthGate] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showMagicalLoading, setShowMagicalLoading] = useState(false)
  const [careerInterests, setCareerInterests] = useState<string[]>([])
  const [careerMustHaves, setCareerMustHaves] = useState<string[]>([])
  const [careerNotes, setCareerNotes] = useState('')

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
    startAssessment,
    resetAssessment,
    setAnswers,
    sessionId
  } = useAssessmentStore()
  const { user, isLoaded, isSignedIn } = useUser()

  // Initialize assessment if not started
  useEffect(() => {
    if (currentStep === 0) {
      startAssessment()
    }
  }, [currentStep, startAssessment])

  const forcedChoiceItems = getForcedChoiceItems()
  const likertItems = getLikertItems()
  const totalQuestionCount = forcedChoiceItems.length + likertItems.length
  const isCareerStep = currentStep === totalSteps

  // Deterministic shuffle function using seeded random
  const shuffleArray = function <T>(array: T[], seed: string): T[] {
    const arr = [...array] // Create a copy
    let hash = 0
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }

    // Use the hash as seed for deterministic randomization
    let randomSeed = Math.abs(hash)
    const random = () => {
      randomSeed = (randomSeed * 9301 + 49297) % 233280
      return randomSeed / 233280
    }

    // Fisher-Yates shuffle with seeded random
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1))
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }

    return arr
  }

  // Get items for current step with randomization
  const getItemsForStep = (step: number) => {
    const stepConfig = ITEMS_PER_STEP[step as keyof typeof ITEMS_PER_STEP]
    if (!stepConfig) return { forced: [], likert: [] }

    const forcedStartIndex = (step - 1) * 3
    const likertStartIndex = Math.max(0, (step - 4) * 12)

    // Get the original slices
    const forcedSlice = forcedChoiceItems.slice(forcedStartIndex, forcedStartIndex + stepConfig.forced)
    const likertSlice = likertItems.slice(likertStartIndex, likertStartIndex + stepConfig.likert)

    // Apply randomization if enabled
    if (RANDOMIZATION_CONFIG.enabled && RANDOMIZATION_CONFIG.useUserSeeding) {
      // Create deterministic seeds based on step number and user ID
      // This ensures each user gets a different random order, but consistent across sessions
      const userSeed = user?.id || 'anonymous'
      const seedSubstring = userSeed.slice(0, RANDOMIZATION_CONFIG.seedLength)
      const forcedSeed = `forced-step-${step}-${seedSubstring}`
      const likertSeed = `likert-step-${step}-${seedSubstring}`

      return {
        forced: shuffleArray(forcedSlice, forcedSeed),
        likert: shuffleArray(likertSlice, likertSeed)
      }
    }

    // Return original order if randomization is disabled
    return {
      forced: forcedSlice,
      likert: likertSlice
    }
  }

  const getStepFromAnsweredCount = (count: number, total: number) => {
    if (count <= 3) return 1
    if (count <= 6) return 2
    if (count <= 9) return 3
    if (count <= 24) return 4
    if (count <= 39) return 5
    if (count < total) return 6
    return totalSteps
  }

  const {
    saveStatus,
    lastSavedAt,
    persistAnswer,
    requireAuth,
    reloadSession,
    flushPending,
    saveMessage,
  } = useAssessmentPersistence({
    forcedChoiceItems,
    likertItems,
    totalQuestionCount,
    getStepFromAnsweredCount,
  })

  const { forced: currentForcedItems, likert: currentLikertItems } = getItemsForStep(currentStep)
  const allCurrentItems = [...currentForcedItems, ...currentLikertItems]

  // Check if current step is complete
  const isStepComplete = useMemo(() => {
    if (isCareerStep) return true // optional step

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
  }, [currentStep, currentForcedItems, currentLikertItems, forcedChoiceAnswers, likertAnswers, isCareerStep])

  const handleComplete = useCallback(async () => {
    setIsSubmitting(true)
    setShowMagicalLoading(true)

    try {
      await flushPending()
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

    } catch (error) {
      console.error('Error completing assessment:', error)
      setShowMagicalLoading(false)
      setIsSubmitting(false)
    }
  }, [flushPending, getAnswersForApi, setResult, completeAssessment])

  const handleReset = useCallback(async () => {
    const confirmReset = typeof window !== 'undefined'
      ? window.confirm('Reset your assessment? This will clear your saved answers.')
      : false
    if (!confirmReset) return
    
    resetAssessment()
    startAssessment()
    await reloadSession()
  }, [resetAssessment, startAssessment, reloadSession])

  const handleMagicalLoadingComplete = useCallback(() => {
    setShowMagicalLoading(false)
    setIsSubmitting(false)
    setShowAuthGate(true)
  }, [])

  const handleNext = useCallback(async () => {
    if (currentStep < totalSteps) {
      setStep(currentStep + 1)
    } else {
      // Assessment complete
      await handleComplete()
    }
  }, [currentStep, totalSteps, setStep, handleComplete])

  const handleAuthSuccess = useCallback(async (resultId: string) => {
    router.push(`/results/${resultId}?download=1`)
  }, [router])

  if (isLoaded && requireAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <AssessmentNavbar />
        {saveMessage && (
          <div className="mx-auto max-w-3xl px-4 pt-6">
            <div className="rounded-md border border-red-500/40 bg-red-500/10 text-red-200 px-4 py-3 text-sm">
              {saveMessage}
            </div>
          </div>
        )}
        <div className="flex items-center justify-center py-24 px-4">
          <Card className="w-full max-w-xl bg-slate-800/80 backdrop-blur-md border-purple-500/30">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Sign in to start your assessment
              </CardTitle>
              <CardDescription className="text-gray-300">
                We save each answer automatically so you can resume anytime and download your full report.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <SignInButton mode="modal">
                <Button variant="mystical" size="lg">
                  Sign in with Clerk
                </Button>
              </SignInButton>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (showMagicalLoading) {
    return <MagicalLoadingScreen onComplete={handleMagicalLoadingComplete} />
  }

  if (showAuthGate) {
    return <AuthGate onSuccess={handleAuthSuccess} />
  }

  if (allCurrentItems.length === 0 && !isCareerStep) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Loading assessment...</p>
      </div>
    )
  }

  const careerInterestOptions = [
    "Product & strategy",
    "Research & insights",
    "Learning & enablement",
    "Operations & systems",
    "Creative direction",
    "Data & analytics",
    "People leadership",
    "Independent / consulting",
  ]

  const careerMustHaveOptions = [
    "Remote-first flexibility",
    "High collaboration",
    "Deep focus time",
    "User-facing",
    "Fast-paced experimentation",
    "Clear career ladder",
    "Mission-driven work",
    "Strong mentorship",
  ]

  const toggleSelection = (value: string, list: string[], setter: (v: string[]) => void) => {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <AssessmentNavbar />
      <div className="container mx-auto px-4 py-8">
        {/* Progress Header - Sticky */}
        <div className="sticky top-20 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-purple-500/20 pb-4 mb-8">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <AssessmentProgress
              currentStep={currentStep}
              totalSteps={totalSteps}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={handleReset}
              className="border-red-500/50 text-red-100 hover:bg-red-500/10"
            >
              Reset
            </Button>
          </div>
          <div className="max-w-4xl mx-auto flex justify-between items-center text-xs text-gray-300 mt-2">
            <div>
              {saveStatus === 'auth' && 'Sign in to save your progress after each question.'}
              {saveStatus === 'error' && 'Auto-save failed. We will retry on your next answer.'}
              {saveStatus === 'saved' && lastSavedAt && `Saved at ${lastSavedAt}`}
              {saveStatus === 'saving' && 'Saving...'}
              {saveStatus === 'idle' && (isSignedIn ? 'Progress auto-saves after each question.' : 'Sign in to save your progress.')}
            </div>
            {!isSignedIn && (
              <div className="text-amber-300 font-semibold">
                Not signed in
              </div>
            )}
          </div>
        </div>

        {/* Assessment Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Step Title */}
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              {isCareerStep
                ? 'Career fit (optional)'
                : currentStep <= 3
                  ? 'Story Scenarios'
                  : 'Personal Reflections'}
            </h1>
            <p className="text-gray-400">
              {isCareerStep
                ? 'Share what matters for your career so we can tailor suggestions. You can skip this and finish now.'
                : currentStep <= 3
                  ? 'Choose your most and least preferred responses to each scenario'
                  : 'Rate how much each statement resonates with you'}
            </p>
          </div>

          {/* Items or optional career step */}
          {!isCareerStep ? (
            <div className="space-y-8">
              {currentForcedItems.map(item => (
                <Card key={item.id} className="bg-slate-800/50 border-purple-500/30">
                  <CardContent className="p-6">
                    <ForcedChoiceItem
                      item={item}
                      answer={forcedChoiceAnswers.find(a => a.itemId === item.id)}
                      onAnswer={(best, worst) => {
                        addForcedChoiceAnswer({ itemId: item.id, best, worst })
                        persistAnswer({ type: 'forced', itemId: item.id, best, worst })
                      }}
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
                      onAnswer={(rating) => {
                        updateLikertAnswer(item.id, rating)
                        persistAnswer({ type: 'likert', itemId: item.id, rating })
                      }}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-xl">What sounds exciting?</CardTitle>
                  <CardDescription className="text-slate-300">
                    Pick any paths that you’d like us to emphasize in career suggestions (optional).
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {careerInterestOptions.map((option) => (
                    <Badge
                      key={option}
                      className={`cursor-pointer ${careerInterests.includes(option) ? 'bg-purple-500 text-white' : 'bg-slate-900 text-slate-200 border border-purple-500/40'}`}
                      onClick={() => toggleSelection(option, careerInterests, setCareerInterests)}
                    >
                      {option}
                    </Badge>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Non‑negotiables</CardTitle>
                  <CardDescription className="text-slate-300">
                    Choose the conditions that help you thrive (optional).
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {careerMustHaveOptions.map((option) => (
                    <Badge
                      key={option}
                      className={`cursor-pointer ${careerMustHaves.includes(option) ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-200 border border-amber-500/40'}`}
                      onClick={() => toggleSelection(option, careerMustHaves, setCareerMustHaves)}
                    >
                      {option}
                    </Badge>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Add context (optional)</CardTitle>
                  <CardDescription className="text-slate-300">
                    Tell us about industries, roles, or constraints to sharpen recommendations.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    value={careerNotes}
                    onChange={(e) => setCareerNotes(e.target.value)}
                    placeholder="e.g., Interested in climate or education; prefer remote teams; want more stakeholder-facing work."
                    className="bg-slate-900/80 border-purple-500/30 text-white"
                  />
                  <p className="text-xs text-slate-400">Optional — you can finish without filling this out.</p>
                </CardContent>
              </Card>
            </div>
          )}

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
              className={`min-w-[120px] ${currentStep >= totalSteps
                  ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-500 animate-pulse'
                  : ''
                }`}
            >
              {isSubmitting
                ? 'Channeling Magic...'
                : currentStep < totalSteps
                  ? 'Next Step'
                  : '✨ Complete Assessment ✨'
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
