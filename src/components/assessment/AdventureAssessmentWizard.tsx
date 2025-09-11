'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAssessmentStore } from '@/store/useAssessmentStore'
import { getForcedChoiceItems } from '@/lib/items/forced'
import { getLikertItems } from '@/lib/items/likert'
import { ForcedChoiceItem as ForcedChoiceItemType, LikertItem as LikertItemType } from '@/lib/assessment/types'
import { AssessmentProgress } from '@/components/assessment/AssessmentProgress'
import { AuthGate } from '@/components/assessment/AuthGate'
import { AssessmentNavbar } from '@/components/assessment/AssessmentNavbar'
import { cn } from '@/lib/utils'

const ITEMS_PER_STEP = {
  1: { forced: 3, likert: 0 },
  2: { forced: 3, likert: 0 },
  3: { forced: 3, likert: 0 },
  4: { forced: 3, likert: 12 },
  5: { forced: 3, likert: 12 },
  6: { forced: 3, likert: 12 },
}

// Adventure-style question wrapper
interface AdventureQuestionProps {
  item: ForcedChoiceItemType | LikertItemType
  onAnswer: (answer: any) => void
  isAnswered: boolean
  questionNumber: number
}

function AdventureQuestion({ item, onAnswer, isAnswered, questionNumber }: AdventureQuestionProps) {
  const questionRef = useRef<HTMLDivElement>(null)
  const isForcedChoice = 'options' in item
  const [selectedBest, setSelectedBest] = useState<number | null>(null)
  const [selectedWorst, setSelectedWorst] = useState<number | null>(null)
  const [likertRating, setLikertRating] = useState<number | null>(null)

  const handleForcedChoiceClick = (index: number) => {
    if (selectedBest === null) {
      setSelectedBest(index)
    } else if (selectedWorst === null && index !== selectedBest) {
      setSelectedWorst(index)
      // Auto-submit when both selections are made
      setTimeout(() => {
        onAnswer({ best: selectedBest, worst: index })
      }, 300)
    } else if (selectedBest === index) {
      setSelectedBest(null)
      setSelectedWorst(null)
    } else if (selectedWorst === index) {
      setSelectedWorst(null)
    } else {
      setSelectedWorst(index)
      setTimeout(() => {
        onAnswer({ best: selectedBest, worst: index })
      }, 300)
    }
  }

  const handleLikertClick = (rating: number) => {
    setLikertRating(rating)
    setTimeout(() => {
      onAnswer({ rating })
    }, 300)
  }

  const getOptionStatus = (index: number) => {
    if (selectedBest === index) return 'best'
    if (selectedWorst === index) return 'worst'
    return 'unselected'
  }

  // Dynamic background gradients for each question
  const getBackgroundGradient = (questionNumber: number) => {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Purple-blue
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', // Pink-red
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // Blue-cyan
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', // Green-mint
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', // Pink-yellow
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', // Mint-pink
      'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)', // Purple-cream
      'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', // Light blue
    ]
    return gradients[questionNumber % gradients.length]
  }

  return (
    <div 
      ref={questionRef}
      className="min-h-screen flex items-center justify-center p-6 relative"
      style={{
        background: getBackgroundGradient(questionNumber),
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70" />
      
      {/* Question Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Story/Question Card */}
        <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-8 border border-amber-500/30 shadow-2xl">
          {isForcedChoice ? (
            <div className="space-y-6">
              {/* Location and Vignette */}
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-amber-300">
                  {(item as ForcedChoiceItemType).location}
                </h2>
                <div className="text-lg text-gray-200 leading-relaxed font-serif">
                  "{(item as ForcedChoiceItemType).vignette}"
                </div>
              </div>
              
              {/* Instructions */}
              <div className="text-center text-amber-200/80 text-sm border-t border-amber-500/20 pt-4">
                Choose the action that appeals to you <span className="text-green-400 font-semibold">MOST</span> and the one that appeals <span className="text-red-400 font-semibold">LEAST</span>
                {selectedBest !== null && selectedWorst === null && (
                  <div className="mt-2 text-yellow-400">
                    Now choose which action appeals to you LEAST
                  </div>
                )}
              </div>

              {/* Options as Adventure Choices */}
              <div className="space-y-4 mt-8">
                {(item as ForcedChoiceItemType).options.map((option, index) => {
                  const status = getOptionStatus(index)
                  
                  return (
                    <button
                      key={index}
                      className={cn(
                        "w-full text-left p-6 rounded-xl transition-all duration-300 border-2",
                        "hover:scale-[1.02] hover:shadow-xl transform",
                        status === 'best' && "border-green-500 bg-green-500/20 shadow-green-500/25",
                        status === 'worst' && "border-red-500 bg-red-500/20 shadow-red-500/25",
                        status === 'unselected' && "border-amber-500/30 bg-amber-500/10 hover:border-amber-400 hover:bg-amber-500/20"
                      )}
                      onClick={() => handleForcedChoiceClick(index)}
                      disabled={isAnswered}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-gray-100 text-lg">
                          {option.label}
                        </div>
                        {status !== 'unselected' && (
                          <div className={cn(
                            "px-3 py-1 rounded-full text-sm font-bold ml-4",
                            status === 'best' && "bg-green-600 text-white",
                            status === 'worst' && "bg-red-600 text-white"
                          )}>
                            {status === 'best' ? 'MOST APPEALING' : 'LEAST APPEALING'}
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Likert Question */}
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-amber-300">
                  Personal Reflection
                </h2>
                <div className="text-xl text-gray-200 leading-relaxed">
                  "{(item as LikertItemType).text}"
                </div>
              </div>
              
              {/* Rating Scale */}
              <div className="text-center">
                <div className="text-amber-200/80 text-sm mb-6">
                  How much does this resonate with you?
                </div>
                
                <div className="flex justify-between items-center max-w-2xl mx-auto">
                  <span className="text-red-400 text-sm font-medium">Strongly Disagree</span>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5, 6, 7].map((rating) => (
                      <button
                        key={rating}
                        className={cn(
                          "w-12 h-12 rounded-full border-2 transition-all duration-300",
                          "hover:scale-110 font-bold",
                          likertRating === rating 
                            ? "border-amber-400 bg-amber-400 text-black shadow-amber-400/50 shadow-lg" 
                            : "border-amber-500/40 bg-amber-500/10 text-amber-200 hover:border-amber-400 hover:bg-amber-500/20"
                        )}
                        onClick={() => handleLikertClick(rating)}
                        disabled={isAnswered}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                  <span className="text-green-400 text-sm font-medium">Strongly Agree</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Question Progress */}
          <div className="mt-8 pt-6 border-t border-amber-500/20 text-center">
            <div className="text-amber-300/60 text-sm">
              Question {questionNumber}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AdventureAssessmentWizard() {
  const router = useRouter()
  const [showAuthGate, setShowAuthGate] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set())
  
  const {
    currentStep,
    totalSteps,
    forcedChoiceAnswers,
    likertAnswers,
    addForcedChoiceAnswer,
    updateLikertAnswer,
    completeAssessment,
    setResult,
    getAnswersForApi,
    startAssessment
  } = useAssessmentStore()
  
  // Initialize assessment
  useEffect(() => {
    if (currentStep === 0) {
      startAssessment()
    }
  }, [currentStep, startAssessment])
  
  const forcedChoiceItems = getForcedChoiceItems()
  const likertItems = getLikertItems()
  const allItems = [...forcedChoiceItems, ...likertItems]
  
  const handleComplete = useCallback(async () => {
    setIsSubmitting(true)
    
    try {
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
      setShowAuthGate(true)
      
    } catch (error) {
      console.error('Error completing assessment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [getAnswersForApi, setResult, completeAssessment])
  
  const handleAnswer = useCallback((answer: any) => {
    const currentItem = allItems[currentQuestionIndex]
    
    if ('options' in currentItem) {
      // Forced choice
      addForcedChoiceAnswer({ 
        itemId: currentItem.id, 
        best: answer.best, 
        worst: answer.worst 
      })
    } else {
      // Likert
      updateLikertAnswer(currentItem.id, answer.rating)
    }
    
    setAnsweredQuestions(prev => new Set([...prev, currentQuestionIndex]))
    
    // Auto-scroll to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < allItems.length - 1) {
        const nextIndex = currentQuestionIndex + 1
        setCurrentQuestionIndex(nextIndex)
        
        // Smooth scroll to next question with multiple fallback methods
        setTimeout(() => {
          const nextQuestionElement = document.querySelector(`[data-question="${nextIndex}"]`)
          if (nextQuestionElement) {
            // Try scrollIntoView first
            nextQuestionElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start',
              inline: 'nearest'
            })
          } else {
            // Fallback to calculating position
            const windowHeight = window.innerHeight
            const targetPosition = nextIndex * windowHeight
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            })
          }
        }, 100)
      } else {
        // Assessment complete - scroll to completion screen
        setTimeout(() => {
          const completionElement = document.querySelector('[data-completion]')
          if (completionElement) {
            completionElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)
        handleComplete()
      }
    }, 1000)
  }, [currentQuestionIndex, allItems, addForcedChoiceAnswer, updateLikertAnswer, handleComplete])
  
  const handleAuthSuccess = useCallback(async (resultId: string) => {
    router.push(`/results/${resultId}`)
  }, [router])
  
  if (showAuthGate) {
    return <AuthGate onSuccess={handleAuthSuccess} />
  }
  
  if (allItems.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-amber-300 text-xl">Loading your adventure...</div>
      </div>
    )
  }
  
  return (
    <div className="bg-black">
      {/* Fixed Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm">
        <AssessmentNavbar />
        <div className="px-4 pb-2">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between text-amber-300 text-sm mb-2">
              <span>Your Journey Progress</span>
              <span>{currentQuestionIndex + 1} of {allItems.length}</span>
            </div>
            <div className="w-full bg-amber-900/30 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-amber-600 to-amber-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentQuestionIndex + 1) / allItems.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Questions Container */}
      <div className="pt-24">
        {allItems.map((item, index) => (
          <div key={item.id} data-question={index}>
            <AdventureQuestion
              item={item}
              onAnswer={handleAnswer}
              isAnswered={answeredQuestions.has(index)}
              questionNumber={index + 1}
            />
          </div>
        ))}
        
        {/* Completion Screen */}
        {currentQuestionIndex >= allItems.length && (
          <div data-completion className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-purple-900 to-black">
            <div className="text-center max-w-2xl mx-auto">
              <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-12 border border-amber-500/30">
                <h2 className="text-4xl font-bold text-amber-300 mb-6">
                  Journey Complete!
                </h2>
                <p className="text-xl text-gray-200 mb-8">
                  Your adventure through the realms of personality has concluded. 
                  The oracle is now calculating your destiny...
                </p>
                {isSubmitting && (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
                    <span className="text-amber-300">Revealing your Player Type...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}