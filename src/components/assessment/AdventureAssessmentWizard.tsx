'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useUser, SignInButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { useAssessmentStore } from '@/store/useAssessmentStore'
import { getForcedChoiceItems } from '@/lib/items/forced'
import { getLikertItems } from '@/lib/items/likert'
import { ForcedChoiceItem as ForcedChoiceItemType, LikertItem as LikertItemType } from '@/lib/assessment/types'
import { AssessmentProgress } from '@/components/assessment/AssessmentProgress'
import { AuthGate } from '@/components/assessment/AuthGate'
import { AssessmentNavbar } from '@/components/assessment/AssessmentNavbar'
import { MagicalLoadingScreen } from '@/components/assessment/MagicalLoadingScreen'
import { cn } from '@/lib/utils'
import { useAssessmentPersistence } from '@/hooks/useAssessmentPersistence'
import Image from 'next/image'

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
  initialAnswer?: any
}

// Props for question content components
interface QuestionContentProps {
  item: ForcedChoiceItemType | LikertItemType
  isForcedChoice: boolean
  selectedBest: number | null
  selectedWorst: number | null
  likertRating: number | null
  getOptionStatus: (index: number) => string
  handleForcedChoiceClick: (index: number) => void
  handleLikertClick: (rating: number) => void
  handleContinue: () => void
  canContinue: boolean
  isAnswered: boolean
  questionNumber: number
}

// First Question Content Component
function FirstQuestionContent({
  item, isForcedChoice, selectedBest, selectedWorst, likertRating,
  getOptionStatus, handleForcedChoiceClick, handleLikertClick,
  handleContinue, canContinue, isAnswered, questionNumber
}: QuestionContentProps) {
  return (
    <div className="bg-black/60 backdrop-blur-sm rounded-2xl border border-amber-500/30 shadow-2xl w-full flex flex-col transition-all duration-300 max-h-[calc(100vh-180px)] sm:max-h-[calc(100vh-200px)] lg:min-h-[500px] lg:max-h-[80vh]">
      {isForcedChoice ? (
        <>
          {/* Fixed header - Location and Vignette */}
          <div className="flex-shrink-0 p-3 sm:p-4 lg:p-6 pb-0">
            <div className="text-center space-y-2 lg:space-y-3">
              <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-amber-300 leading-tight">
                {(item as ForcedChoiceItemType).location}
              </h2>
              <div className="text-xs sm:text-sm lg:text-base text-gray-200 leading-relaxed font-serif italic max-w-lg mx-auto px-1">
                "{(item as ForcedChoiceItemType).vignette}"
              </div>
            </div>
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 pt-3">
            <div className="space-y-4 lg:space-y-5">
              {/* Instructions */}
              <div className="text-center border-t border-amber-500/20 pt-3 lg:pt-4">
                <div className="text-amber-200 text-xs sm:text-sm space-y-1">
                  <div>Choose the action that appeals to you <span className="text-green-400 font-bold">MOST</span></div>
                  <div>and the one that appeals <span className="text-red-400 font-bold">LEAST</span></div>
                </div>
                {selectedBest !== null && selectedWorst === null && (
                  <div className="mt-2 text-yellow-400 font-medium text-xs sm:text-sm animate-pulse">
                    Now choose which action appeals to you LEAST
                  </div>
                )}
              </div>

              {/* Options as Adventure Choices */}
              <div className="space-y-2 lg:space-y-3">
                {(item as ForcedChoiceItemType).options.map((option, index) => {
                  const status = getOptionStatus(index)

                  return (
                    <button
                      key={index}
                      className={cn(
                        "w-full text-left p-2 sm:p-3 lg:p-4 rounded-lg transition-all duration-300 border-2",
                        "hover:scale-[1.01] hover:shadow-lg transform",
                        status === 'best' && "border-green-500 bg-green-500/20 shadow-green-500/25 shadow-md",
                        status === 'worst' && "border-red-500 bg-red-500/20 shadow-red-500/25 shadow-md",
                        status === 'unselected' && "border-amber-500/30 bg-amber-500/10 hover:border-amber-400 hover:bg-amber-500/20"
                      )}
                      onClick={() => handleForcedChoiceClick(index)}
                      disabled={isAnswered}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-gray-100 text-xs sm:text-sm lg:text-base leading-snug flex-1">
                          {option.label}
                        </div>
                        {status !== 'unselected' && (
                          <div className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-bold shrink-0",
                            status === 'best' && "bg-green-600 text-white",
                            status === 'worst' && "bg-red-600 text-white"
                          )}>
                            {status === 'best' ? 'MOST' : 'LEAST'}
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>

            </div>
          </div>

          {/* Continue Button - Fixed at bottom on mobile */}
          {canContinue && (
            <div className="flex-shrink-0 p-3 sm:p-4 lg:p-6 pt-0 border-t border-amber-500/20">
              <button
                onClick={handleContinue}
                className={cn(
                  "w-full sm:w-auto px-6 py-3 sm:py-2 rounded-lg text-black font-bold text-sm sm:text-sm lg:text-base transition-all duration-300 hover:scale-105 shadow-md",
                  questionNumber === 54
                    ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-500 shadow-purple-500/40 animate-pulse text-white"
                    : "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 shadow-amber-500/25"
                )}
              >
                {questionNumber === 54 ? "✨ Complete Assessment ✨" : "Continue Journey →"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="h-full flex flex-col justify-between py-8">
          {/* Likert Question - Top section */}
          <div className="text-center space-y-8">
            <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-amber-300">
              Personal Reflection
            </h2>
            <div className="text-xl text-gray-200 leading-relaxed max-w-xl mx-auto">
              "{(item as LikertItemType).statement}"
            </div>
          </div>

          {/* Rating Scale - Middle section */}
          <div className="text-center py-8">
            <div className="text-amber-200/80 text-sm mb-8">
              How much does this resonate with you?
            </div>

            <div className="flex flex-col items-center max-w-2xl mx-auto">
              {/* Number buttons with increased spacing */}
              <div className="flex space-x-4 mb-6">
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

              {/* Labels below the numbers */}
              <div className="flex justify-between w-full max-w-md">
                <span className="text-red-400 text-sm font-medium">Strongly Disagree</span>
                <span className="text-green-400 text-sm font-medium">Strongly Agree</span>
              </div>
            </div>
          </div>

          {/* Continue Button for Likert - Bottom section */}
          {canContinue && (
            <div className="text-center">
              <button
                onClick={handleContinue}
                className={cn(
                  "px-8 py-4 rounded-xl text-black font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg",
                  questionNumber === 54
                    ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-500 shadow-purple-500/40 animate-pulse"
                    : "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 shadow-amber-500/25"
                )}
              >
                {questionNumber === 54 ? "✨ Complete Assessment ✨" : "Continue Journey"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Question Progress */}
      <div className="mt-8 pt-6 border-t border-amber-500/20 text-center">
        <div className="text-amber-300/60 text-sm">
          Question {questionNumber}
        </div>
      </div>
    </div>
  )
}

// Regular Question Content Component
function RegularQuestionContent({
  item, isForcedChoice, selectedBest, selectedWorst, likertRating,
  getOptionStatus, handleForcedChoiceClick, handleLikertClick,
  handleContinue, canContinue, isAnswered, questionNumber
}: QuestionContentProps) {
  return (
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

          {/* Continue Button for Forced Choice */}
          {canContinue && (
            <div className="mt-8 text-center">
              <button
                onClick={handleContinue}
                className={cn(
                  "px-8 py-4 rounded-xl text-black font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg",
                  questionNumber === 54
                    ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-500 shadow-purple-500/40 animate-pulse"
                    : "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 shadow-amber-500/25"
                )}
              >
                {questionNumber === 54 ? "✨ Complete Assessment ✨" : "Continue Journey"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Likert Question */}
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-amber-300">
              Personal Reflection
            </h2>
            <div className="text-xl text-gray-200 leading-relaxed">
              "{(item as LikertItemType).statement}"
            </div>
          </div>

          {/* Rating Scale */}
          <div className="text-center">
            <div className="text-amber-200/80 text-sm mb-6">
              How much does this resonate with you?
            </div>

            <div className="flex flex-col items-center max-w-2xl mx-auto">
              {/* Number buttons with increased spacing */}
              <div className="flex space-x-4 mb-4">
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

              {/* Labels below the numbers */}
              <div className="flex justify-between w-full max-w-md">
                <span className="text-red-400 text-sm font-medium">Strongly Disagree</span>
                <span className="text-green-400 text-sm font-medium">Strongly Agree</span>
              </div>
            </div>
          </div>

          {/* Continue Button for Likert */}
          {canContinue && (
            <div className="mt-8 text-center">
              <button
                onClick={handleContinue}
                className={cn(
                  "px-8 py-4 rounded-xl text-black font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg",
                  questionNumber === 54
                    ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-500 shadow-purple-500/40 animate-pulse"
                    : "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 shadow-amber-500/25"
                )}
              >
                {questionNumber === 54 ? "✨ Complete Assessment ✨" : "Continue Journey"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Question Progress */}
      <div className="mt-8 pt-6 border-t border-amber-500/20 text-center">
        <div className="text-amber-300/60 text-sm">
          Question {questionNumber}
        </div>
      </div>
    </div>
  )
}

// Update AdventureQuestionProps
interface AdventureQuestionProps {
  item: ForcedChoiceItemType | LikertItemType
  onAnswer: (answer: any) => void
  isAnswered: boolean
  questionNumber: number
  initialAnswer?: any // New prop
}

// Regular Question Content Component
interface QuestionContentProps {
  item: ForcedChoiceItemType | LikertItemType
  isForcedChoice: boolean
  selectedBest: number | null
  selectedWorst: number | null
  likertRating: number | null
  getOptionStatus: (index: number) => string
  handleForcedChoiceClick: (index: number) => void
  handleLikertClick: (rating: number) => void
  handleContinue: () => void
  canContinue: boolean
  isAnswered: boolean
  questionNumber: number
}

function AdventureQuestion({ item, onAnswer, isAnswered, questionNumber, initialAnswer }: AdventureQuestionProps) {
  const questionRef = useRef<HTMLDivElement>(null)
  const isForcedChoice = 'options' in item

  // Initialize state from initialAnswer if available
  const [selectedBest, setSelectedBest] = useState<number | null>(() => {
    if (initialAnswer && 'best' in initialAnswer) return initialAnswer.best
    return null
  })
  const [selectedWorst, setSelectedWorst] = useState<number | null>(() => {
    if (initialAnswer && 'worst' in initialAnswer) return initialAnswer.worst
    return null
  })
  const [likertRating, setLikertRating] = useState<number | null>(() => {
    if (initialAnswer && 'rating' in initialAnswer) return initialAnswer.rating
    return null
  })
  const [canContinue, setCanContinue] = useState(false)

  // Initialize canContinue state based on loaded answers
  useEffect(() => {
    if (isForcedChoice) {
      if (selectedBest !== null && selectedWorst !== null) {
        setCanContinue(true)
      }
    } else {
      if (likertRating !== null) {
        setCanContinue(true)
      }
    }
  }, []) // Run once on mount

  // Reset/Update selections when question changes
  useEffect(() => {
    // If we have a new initialAnswer for this question (e.g. navigated back/forward), use it
    if (initialAnswer) {
      if (isForcedChoice) {
        setSelectedBest(initialAnswer.best ?? null)
        setSelectedWorst(initialAnswer.worst ?? null)
        setCanContinue(initialAnswer.best !== null && initialAnswer.worst !== null)
      } else {
        setLikertRating(initialAnswer.rating ?? null)
        setCanContinue(initialAnswer.rating !== null)
      }
    } else if (!isAnswered) {
      // If no answer and not marked as answered, reset
      setSelectedBest(null)
      setSelectedWorst(null)
      setLikertRating(null)
      setCanContinue(false)
    }
    // If isAnswered but no initialAnswer passed, we might be in a weird state, but usually initialAnswer matches
  }, [questionNumber, isAnswered, initialAnswer, isForcedChoice])

  const handleForcedChoiceClick = (index: number) => {
    if (selectedBest === null) {
      setSelectedBest(index)
    } else if (selectedWorst === null && index !== selectedBest) {
      setSelectedWorst(index)
      setCanContinue(true)
    } else if (selectedBest === index) {
      setSelectedBest(null)
      setSelectedWorst(null)
      setCanContinue(false)
    } else if (selectedWorst === index) {
      setSelectedWorst(null)
      setCanContinue(false)
    } else {
      // Change worst selection
      setSelectedWorst(index)
      setCanContinue(true)
    }
  }

  const handleLikertClick = (rating: number) => {
    setLikertRating(rating)
    setCanContinue(true)
  }

  const handleContinue = () => {
    if (isForcedChoice && selectedBest !== null && selectedWorst !== null) {
      onAnswer({ best: selectedBest, worst: selectedWorst })
    } else if (!isForcedChoice && likertRating !== null) {
      onAnswer({ rating: likertRating })
    }
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


  // Questions with image layout (1-54)
  const hasImageLayout = questionNumber >= 1 && questionNumber <= 54
  const isQuestion19 = questionNumber === 19

  // Helper function to get image details for each question
  const getImageDetails = (questionNumber: number) => {
    const imageMap: Record<number, { src: string; alt: string; caption: string }> = {
      1: {
        src: "/images/assessment/Question_1.png",
        alt: "The Journey Begins - A mystical crossroads under starlight",
        caption: "The mystical crossroads await your choice..."
      },
      2: {
        src: "/images/assessment/Question_2.png",
        alt: "The merchant's heartfelt plea - A scene of loss and community support",
        caption: "Compassion calls in the merchant district..."
      },
      3: {
        src: "/images/assessment/Question_3.png",
        alt: "Ancient knowledge awaits - Scrolls and tomes in the archive of stars",
        caption: "Ancient wisdom guides your path..."
      },
      4: {
        src: "/images/assessment/Question_4.png",
        alt: "The tower of echoing winds - Ancient bells await your courage",
        caption: "The winds carry urgent warning..."
      },
      5: {
        src: "/images/assessment/Question_5.png",
        alt: "Question 5 - Adventure scenario",
        caption: "Your journey continues..."
      },
      6: {
        src: "/images/assessment/Question_6.png",
        alt: "Question 6 - Adventure scenario",
        caption: "New challenges await..."
      },
      7: {
        src: "/images/assessment/Question_7.png",
        alt: "Question 7 - Adventure scenario",
        caption: "The path unfolds before you..."
      },
      8: {
        src: "/images/assessment/Question_8.png",
        alt: "Question 8 - Adventure scenario",
        caption: "Deeper into the unknown..."
      },
      9: {
        src: "/images/assessment/Question_9.png",
        alt: "Question 9 - Adventure scenario",
        caption: "Mysteries reveal themselves..."
      },
      10: {
        src: "/images/assessment/Question_10.png",
        alt: "Question 10 - Adventure scenario",
        caption: "Halfway through your journey..."
      },
      11: {
        src: "/images/assessment/Question_11.png",
        alt: "Question 11 - Adventure scenario",
        caption: "The adventure deepens..."
      },
      12: {
        src: "/images/assessment/Question_12.png",
        alt: "Question 12 - Adventure scenario",
        caption: "New realms beckon..."
      },
      13: {
        src: "/images/assessment/Question_13.png",
        alt: "Question 13 - Adventure scenario",
        caption: "The stakes grow higher..."
      },
      14: {
        src: "/images/assessment/Question_14.png",
        alt: "Question 14 - Adventure scenario",
        caption: "Challenges intensify..."
      },
      15: {
        src: "/images/assessment/Question_15.png",
        alt: "Question 15 - Adventure scenario",
        caption: "Nearing the climax..."
      },
      16: {
        src: "/images/assessment/Question_16.png",
        alt: "Question 16 - Adventure scenario",
        caption: "The final stretch begins..."
      },
      17: {
        src: "/images/assessment/Question_17.png",
        alt: "Question 17 - Adventure scenario",
        caption: "Almost to the end..."
      },
      18: {
        src: "/images/assessment/Question_18.png",
        alt: "Question 18 - Adventure scenario",
        caption: "The journey's culmination..."
      },
      19: {
        src: "/images/assessment/Question_19.png",
        alt: "Question 19 - Final adventure scenario",
        caption: "The final chapter unfolds..."
      },
      20: {
        src: "/images/assessment/Question_20.png",
        alt: "Question 20 - Adventure scenario",
        caption: "New paths emerge..."
      },
      21: {
        src: "/images/assessment/Question_21.png",
        alt: "Question 21 - Adventure scenario",
        caption: "The journey evolves..."
      },
      22: {
        src: "/images/assessment/Question_22.png",
        alt: "Question 22 - Adventure scenario",
        caption: "Deeper mysteries await..."
      },
      23: {
        src: "/images/assessment/Question_23.png",
        alt: "Question 23 - Adventure scenario",
        caption: "The adventure continues..."
      },
      24: {
        src: "/images/assessment/Question_24.png",
        alt: "Question 24 - Adventure scenario",
        caption: "New challenges arise..."
      },
      25: {
        src: "/images/assessment/Question_25.png",
        alt: "Question 25 - Adventure scenario",
        caption: "The path winds onward..."
      },
      26: {
        src: "/images/assessment/Question_26.png",
        alt: "Question 26 - Adventure scenario",
        caption: "Unexpected discoveries..."
      },
      27: {
        src: "/images/assessment/Question_27.png",
        alt: "Question 27 - Adventure scenario",
        caption: "The quest deepens..."
      },
      28: {
        src: "/images/assessment/Question_28.png",
        alt: "Question 28 - Adventure scenario",
        caption: "New horizons beckon..."
      },
      29: {
        src: "/images/assessment/Question_29.png",
        alt: "Question 29 - Adventure scenario",
        caption: "The story unfolds..."
      },
      30: {
        src: "/images/assessment/Question_30.png",
        alt: "Question 30 - Adventure scenario",
        caption: "Midway through the quest..."
      },
      31: {
        src: "/images/assessment/Question_31.png",
        alt: "Question 31 - Adventure scenario",
        caption: "The adventure continues..."
      },
      32: {
        src: "/images/assessment/Question_32.png",
        alt: "Question 32 - Adventure scenario",
        caption: "New realms await..."
      },
      33: {
        src: "/images/assessment/Question_33.png",
        alt: "Question 33 - Adventure scenario",
        caption: "The journey progresses..."
      },
      34: {
        src: "/images/assessment/Question_34.png",
        alt: "Question 34 - Adventure scenario",
        caption: "Mysteries deepen..."
      },
      35: {
        src: "/images/assessment/Question_35.png",
        alt: "Question 35 - Adventure scenario",
        caption: "The path reveals secrets..."
      },
      36: {
        src: "/images/assessment/Question_36.png",
        alt: "Question 36 - Adventure scenario",
        caption: "New adventures begin..."
      },
      37: {
        src: "/images/assessment/Question_37.png",
        alt: "Question 37 - Adventure scenario",
        caption: "The quest evolves..."
      },
      38: {
        src: "/images/assessment/Question_38.png",
        alt: "Question 38 - Adventure scenario",
        caption: "Deeper into the unknown..."
      },
      39: {
        src: "/images/assessment/Question_39.png",
        alt: "Question 39 - Adventure scenario",
        caption: "The adventure unfolds..."
      },
      40: {
        src: "/images/assessment/Question_40.png",
        alt: "Question 40 - Adventure scenario",
        caption: "Approaching new heights..."
      },
      41: {
        src: "/images/assessment/Question_41.png",
        alt: "Question 41 - Adventure scenario",
        caption: "The journey continues..."
      },
      42: {
        src: "/images/assessment/Question_42.png",
        alt: "Question 42 - Adventure scenario",
        caption: "New challenges emerge..."
      },
      43: {
        src: "/images/assessment/Question_43.png",
        alt: "Question 43 - Adventure scenario",
        caption: "The path winds forward..."
      },
      44: {
        src: "/images/assessment/Question_44.png",
        alt: "Question 44 - Adventure scenario",
        caption: "Mysteries await..."
      },
      45: {
        src: "/images/assessment/Question_45.png",
        alt: "Question 45 - Adventure scenario",
        caption: "The quest advances..."
      },
      46: {
        src: "/images/assessment/Question_46.png",
        alt: "Question 46 - Adventure scenario",
        caption: "New discoveries..."
      },
      47: {
        src: "/images/assessment/Question_47.png",
        alt: "Question 47 - Adventure scenario",
        caption: "The adventure deepens..."
      },
      48: {
        src: "/images/assessment/Question_48.png",
        alt: "Question 48 - Adventure scenario",
        caption: "Approaching the climax..."
      },
      49: {
        src: "/images/assessment/Question_49.png",
        alt: "Question 49 - Adventure scenario",
        caption: "The journey nears its end..."
      },
      50: {
        src: "/images/assessment/Question_50.png",
        alt: "Question 50 - Adventure scenario",
        caption: "The final stretch begins..."
      },
      51: {
        src: "/images/assessment/Question_51.png",
        alt: "Question 51 - Adventure scenario",
        caption: "Almost at the destination..."
      },
      52: {
        src: "/images/assessment/Question_52.png",
        alt: "Question 52 - Adventure scenario",
        caption: "The end draws near..."
      },
      53: {
        src: "/images/assessment/Question_53.png",
        alt: "Question 53 - Adventure scenario",
        caption: "The penultimate moment..."
      },
      54: {
        src: "/images/assessment/Question_54.png",
        alt: "Question 54 - Final adventure scenario",
        caption: "The ultimate conclusion..."
      }
    }

    return imageMap[questionNumber] || {
      src: "/images/assessment/Question_1.png",
      alt: "Adventure scenario",
      caption: "Your journey continues..."
    }
  }

  return (
    <div
      ref={questionRef}
      className="h-full w-full flex items-center justify-center p-2 sm:p-4 lg:p-6 xl:p-8 relative"
      style={{
        background: getBackgroundGradient(questionNumber),
        minHeight: 'calc(100vh - 80px)',
        marginTop: '60px'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Question Content */}
      <div className={cn(
        "relative z-10 mx-auto w-full h-full",
        hasImageLayout ? "max-w-7xl" : "max-w-4xl"
      )}>
        {hasImageLayout ? (
          <>
            {isQuestion19 ? (
              // Question 19 - Epic finale with side-by-side layout
              <>
                {/* Desktop Layout */}
                <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6 xl:gap-10 h-full">
                  {/* Left side - Enhanced Image Card for finale */}
                  <div className="flex-shrink-0">
                    <div className="relative w-full h-full max-h-[640px]">
                      {/* Enhanced glowing backdrop for finale */}
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/40 to-orange-600/40 rounded-2xl blur-3xl scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-600/20 rounded-2xl blur-2xl scale-105" />

                      <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-400/50 bg-black/20 w-full h-full flex flex-col">
                        <div className="flex-1 relative h-full">
                          <Image
                            src={getImageDetails(questionNumber).src}
                            alt={getImageDetails(questionNumber).alt}
                            fill
                            className="object-cover"
                            priority
                            sizes="(min-width: 1280px) 560px, 50vw"
                          />
                          {/* Enhanced overlay for finale */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-purple-500/10" />
                        </div>

                        {/* Enhanced floating caption for finale */}
                        <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-black/90 via-black/80 to-black/90 backdrop-blur-md rounded-lg p-3 border border-amber-400/40 shadow-xl">
                          <p className="text-amber-200 text-sm text-center font-bold tracking-wide">
                            {getImageDetails(questionNumber).caption}
                          </p>
                          <div className="w-16 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mt-1"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Enhanced Question Card for finale */}
                  <div className="flex-1 max-w-2xl relative">
                    {/* Decorative corner accents */}
                    <div className="absolute -top-2 -left-2 w-16 h-16 bg-gradient-to-br from-amber-400/20 to-transparent rounded-br-2xl"></div>
                    <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-bl from-purple-400/20 to-transparent rounded-bl-2xl"></div>
                    <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-tr from-orange-400/20 to-transparent rounded-tr-2xl"></div>
                    <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-tl from-indigo-400/20 to-transparent rounded-tl-2xl"></div>

                    {/* Enhanced question content */}
                    <div className="relative bg-gradient-to-br from-black/70 via-slate-900/70 to-black/70 rounded-2xl border-2 border-amber-400/40 shadow-2xl overflow-hidden h-full">
                      <FirstQuestionContent
                        item={item}
                        isForcedChoice={isForcedChoice}
                        selectedBest={selectedBest}
                        selectedWorst={selectedWorst}
                        likertRating={likertRating}
                        getOptionStatus={getOptionStatus}
                        handleForcedChoiceClick={handleForcedChoiceClick}
                        handleLikertClick={handleLikertClick}
                        handleContinue={handleContinue}
                        canContinue={canContinue}
                        isAnswered={isAnswered}
                        questionNumber={questionNumber}
                      />
                    </div>

                    {/* Floating decorative elements */}
                    <div className="absolute top-1/4 -left-4 w-3 h-3 bg-amber-400/40 rounded-full animate-pulse"></div>
                    <div className="absolute top-1/2 -right-4 w-3 h-3 bg-purple-400/40 rounded-full animate-pulse" style={{ animationDelay: '0.7s' }}></div>
                    <div className="absolute bottom-1/4 -left-4 w-3 h-3 bg-orange-400/40 rounded-full animate-pulse" style={{ animationDelay: '1.4s' }}></div>
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="block lg:hidden">
                  <div className="flex justify-center mb-4">
                    <div className="relative w-full max-w-sm">
                      {/* Enhanced glowing backdrop for mobile finale */}
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/40 to-orange-600/40 rounded-2xl blur-2xl scale-105" />
                      <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-400/50 bg-black/20">
                        <Image
                          src={getImageDetails(questionNumber).src}
                          alt={getImageDetails(questionNumber).alt}
                          width={600}
                          height={450}
                          className="object-cover w-full h-auto"
                          priority
                          sizes="85vw"
                        />
                        {/* Enhanced overlay for mobile */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      </div>

                      {/* Enhanced caption for mobile */}
                      <div className="absolute bottom-4 left-4 right-4 bg-black/90 backdrop-blur-sm rounded-lg p-3 border border-amber-400/40">
                        <p className="text-amber-200 text-sm text-center font-bold">
                          {getImageDetails(questionNumber).caption}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full max-w-2xl mx-auto relative">
                    {/* Enhanced mobile question card */}
                    <div className="bg-gradient-to-br from-black/70 via-slate-900/70 to-black/70 rounded-2xl border-2 border-amber-400/40 shadow-xl">
                      <FirstQuestionContent
                        item={item}
                        isForcedChoice={isForcedChoice}
                        selectedBest={selectedBest}
                        selectedWorst={selectedWorst}
                        likertRating={likertRating}
                        getOptionStatus={getOptionStatus}
                        handleForcedChoiceClick={handleForcedChoiceClick}
                        handleLikertClick={handleLikertClick}
                        handleContinue={handleContinue}
                        canContinue={canContinue}
                        isAnswered={isAnswered}
                        questionNumber={questionNumber}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // Questions 1-18 - Side by side layout
              <>
                {/* Desktop Layout */}
                <div className="hidden lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-center h-full max-w-7xl mx-auto py-12">
                  {/* Left side - Image Card */}
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="relative w-full max-w-2xl aspect-square shadow-2xl rounded-2xl">
                      {/* Glowing backdrop for the image */}
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-orange-600/30 rounded-2xl blur-3xl scale-105" />
                      <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/30 bg-black/20 w-full h-full flex flex-col">
                        <div className="flex-1 relative h-full">
                          <Image
                            src={getImageDetails(questionNumber).src}
                            alt={getImageDetails(questionNumber).alt}
                            fill
                            className="object-cover"
                            priority
                            sizes="(min-width: 1280px) 600px, 50vw"
                          />
                          {/* Subtle overlay for better text contrast */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                        </div>

                        {/* Optional floating caption */}
                        <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-amber-500/30 shadow-lg transform transition-transform hover:scale-105">
                          <p className="text-amber-200 text-sm text-center font-medium font-serif italic tracking-wide">
                            {getImageDetails(questionNumber).caption}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Question Card */}
                  <div className="w-full flex items-center justify-center">
                    <FirstQuestionContent
                      item={item}
                      isForcedChoice={isForcedChoice}
                      selectedBest={selectedBest}
                      selectedWorst={selectedWorst}
                      likertRating={likertRating}
                      getOptionStatus={getOptionStatus}
                      handleForcedChoiceClick={handleForcedChoiceClick}
                      handleLikertClick={handleLikertClick}
                      handleContinue={handleContinue}
                      canContinue={canContinue}
                      isAnswered={isAnswered}
                      questionNumber={questionNumber}
                    />
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="block lg:hidden">
                  <div className="flex justify-center mb-4">
                    <div className="relative w-full max-w-sm">
                      {/* Glowing backdrop for the image */}
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-orange-600/30 rounded-2xl blur-2xl scale-105" />
                      <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/30 bg-black/20">
                        <Image
                          src={getImageDetails(questionNumber).src}
                          alt={getImageDetails(questionNumber).alt}
                          width={600}
                          height={450}
                          className="object-cover w-full h-auto"
                          priority
                          sizes="85vw"
                        />
                        {/* Subtle overlay for better text contrast */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                      </div>

                      {/* Optional floating caption */}
                      <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-amber-500/30">
                        <p className="text-amber-200 text-sm text-center font-medium">
                          {getImageDetails(questionNumber).caption}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full max-w-2xl mx-auto">
                    <FirstQuestionContent
                      item={item}
                      isForcedChoice={isForcedChoice}
                      selectedBest={selectedBest}
                      selectedWorst={selectedWorst}
                      likertRating={likertRating}
                      getOptionStatus={getOptionStatus}
                      handleForcedChoiceClick={handleForcedChoiceClick}
                      handleLikertClick={handleLikertClick}
                      handleContinue={handleContinue}
                      canContinue={canContinue}
                      isAnswered={isAnswered}
                      questionNumber={questionNumber}
                    />
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          // Regular question layout
          <RegularQuestionContent
            item={item}
            isForcedChoice={isForcedChoice}
            selectedBest={selectedBest}
            selectedWorst={selectedWorst}
            likertRating={likertRating}
            getOptionStatus={getOptionStatus}
            handleForcedChoiceClick={handleForcedChoiceClick}
            handleLikertClick={handleLikertClick}
            handleContinue={handleContinue}
            canContinue={canContinue}
            isAnswered={isAnswered}
            questionNumber={questionNumber}
          />
        )}
      </div>
    </div>
  )
}

export function AdventureAssessmentWizard() {
  const router = useRouter()
  const [showAuthGate, setShowAuthGate] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showMagicalLoading, setShowMagicalLoading] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set())
  const [isTransitioning, setIsTransitioning] = useState(false)
  const { isLoaded, isSignedIn } = useUser()

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
    startAssessment,
    resetAssessment,
    setAnswers,
    setStep,
    sessionId
  } = useAssessmentStore()

  const forcedChoiceItems = getForcedChoiceItems()
  const likertItems = getLikertItems()
  const allItems = [...forcedChoiceItems, ...likertItems]

  // Initialize assessment
  useEffect(() => {
    if (currentStep === 0 && !isSubmitting) {
      startAssessment()
    }
  }, [currentStep, startAssessment, isSubmitting])

  // Sync local state with persisted store answers on load
  useEffect(() => {
    const totalAnsweredCount = forcedChoiceAnswers.length + likertAnswers.length

    // If we have answers but local state is empty (fresh load/refresh), sync up
    if (totalAnsweredCount > 0 && answeredQuestions.size === 0) {
      // 1. Rebuild the set of answered question indices
      const newAnsweredSet = new Set<number>()

      // Map forced choice answers to indices
      forcedChoiceAnswers.forEach(ans => {
        const index = allItems.findIndex(i => i.id === ans.itemId)
        if (index !== -1) newAnsweredSet.add(index)
      })

      // Map likert answers to indices
      likertAnswers.forEach(ans => {
        const index = allItems.findIndex(i => i.id === ans.itemId)
        if (index !== -1) newAnsweredSet.add(index)
      })

      setAnsweredQuestions(newAnsweredSet)

      // 2. Jump to the first unanswered question (which is usually just the count)
      // Only jump if we are currently at 0 (start)
      if (currentQuestionIndex === 0) {
        setCurrentQuestionIndex(totalAnsweredCount)
      }
    }
  }, [forcedChoiceAnswers, likertAnswers, allItems, answeredQuestions.size, currentQuestionIndex])

  // Prevent body scroll during assessment
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])


  const totalQuestionCount = allItems.length
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

  const handleSaveAndExit = useCallback(async () => {
    await flushPending()
    router.push('/dashboard')
  }, [flushPending, router])

  const getAnswerForItem = (itemId: string, isForced: boolean) => {
    if (isForced) {
      return forcedChoiceAnswers.find(a => a.itemId === itemId)
    } else {
      return likertAnswers.find(a => a.itemId === itemId)
    }
  }

  const handleReset = useCallback(async () => {
    const confirmReset = typeof window !== 'undefined'
      ? window.confirm('Reset your assessment? This will clear your saved answers.')
      : false
    if (!confirmReset) return

    resetAssessment()
    setCurrentQuestionIndex(0)
    setAnsweredQuestions(new Set())
    setIsTransitioning(false)
    startAssessment()
    await reloadSession()
  }, [resetAssessment, startAssessment, reloadSession])

  const handleComplete = useCallback(async () => {
    setIsSubmitting(true)
    setShowMagicalLoading(true)

    try {
      await flushPending()
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

  const handleMagicalLoadingComplete = useCallback(() => {
    setShowMagicalLoading(false)
    setIsSubmitting(false)
    setShowAuthGate(true)
  }, [])

  const handleAnswer = useCallback((answer: any) => {
    const currentItem = allItems[currentQuestionIndex]

    if ('options' in currentItem) {
      // Forced choice
      addForcedChoiceAnswer({
        itemId: currentItem.id,
        best: answer.best,
        worst: answer.worst
      })
      persistAnswer({ type: 'forced', itemId: currentItem.id, best: answer.best, worst: answer.worst })
    } else {
      // Likert
      updateLikertAnswer(currentItem.id, answer.rating)
      persistAnswer({ type: 'likert', itemId: currentItem.id, rating: answer.rating })
    }

    setAnsweredQuestions(prev => new Set([...prev, currentQuestionIndex]))
    setIsTransitioning(true)

    // Slide to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < allItems.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        handleComplete()
      }
      setIsTransitioning(false)
    }, 800)
  }, [currentQuestionIndex, allItems, addForcedChoiceAnswer, updateLikertAnswer, handleComplete, persistAnswer])

  const handleGoBack = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex - 1)
        // Remove the current question from answered questions to allow re-answering
        setAnsweredQuestions(prev => {
          const newSet = new Set(prev)
          newSet.delete(currentQuestionIndex)
          return newSet
        })
        setIsTransitioning(false)
      }, 300)
    }
  }, [currentQuestionIndex])

  const handleGoNext = useCallback(() => {
    if (currentQuestionIndex < allItems.length - 1) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setIsTransitioning(false)
      }, 300)
    } else {
      // If on last question, complete the assessment
      handleComplete()
    }
  }, [currentQuestionIndex, allItems.length, handleComplete])

  const handleAuthSuccess = useCallback(async (resultId: string) => {
    router.push('/profile')
  }, [router])

  if (isLoaded && requireAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-slate-900 to-amber-950">
        <AssessmentNavbar />
        {saveMessage && (
          <div className="mx-auto max-w-3xl px-4 pt-6">
            <div className="rounded-md border border-red-500/40 bg-red-500/10 text-red-200 px-4 py-3 text-sm">
              {saveMessage}
            </div>
          </div>
        )}
        <div className="flex items-center justify-center py-16 px-4">
          <div className="max-w-xl w-full bg-black/60 border border-amber-500/40 rounded-2xl p-8 text-center shadow-2xl">
            <h2 className="text-3xl font-bold text-amber-300 mb-3">Sign in to begin your journey</h2>
            <p className="text-amber-100/80 mb-6">
              We’ll save every answer instantly so you can resume anytime and generate your full Epic Arcana report.
            </p>
            <SignInButton mode="modal">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-black font-semibold">
                Sign in with Clerk
              </Button>
            </SignInButton>
          </div>
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

  if (allItems.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <div className="text-amber-300 text-xl mb-2">Loading your adventure...</div>
          <div className="text-amber-500/60 text-sm">Preparing {forcedChoiceItems.length} scenarios and {likertItems.length} reflections</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black overflow-hidden">
      {/* Fixed Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm">
        <AssessmentNavbar />
        <div className="px-4 pb-2">
          {saveStatus === 'error' && saveMessage && (
            <div className="max-w-4xl mx-auto mb-2 rounded-md border border-red-500/40 bg-red-500/10 text-red-100 px-3 py-2 text-sm">
              {saveMessage}
            </div>
          )}
          {saveStatus === 'auth' && (
            <div className="max-w-4xl mx-auto mb-2 rounded-md border border-amber-500/40 bg-amber-500/10 text-amber-50 px-3 py-2 text-sm">
              Sign in to keep your answers saved across refreshes.
            </div>
          )}
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between text-amber-300 text-sm mb-2">
              <div className="flex items-center gap-1">
                {/* Back Button - Only show after question 1 is answered (question 2+) */}
                {currentQuestionIndex >= 1 && (
                  <button
                    onClick={handleGoBack}
                    className="inline-flex items-center hover:bg-amber-600/20 rounded-md p-1 transition-all duration-200 text-amber-300 hover:text-amber-200 mr-1"
                    disabled={isTransitioning}
                    title="Go back to previous question"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                )}
                <span>Your Journey Progress</span>
              </div>

              <div className="flex items-center gap-2">
                <span>{Math.min(currentQuestionIndex + 1, allItems.length)} of {allItems.length}</span>
                {/* Next Button - Show on all questions except the last one */}
                {currentQuestionIndex < allItems.length - 1 && (
                  <button
                    onClick={handleGoNext}
                    className="inline-flex items-center hover:bg-amber-600/20 rounded-md p-1 transition-all duration-200 text-amber-300 hover:text-amber-200 ml-1"
                    disabled={isTransitioning}
                    title="Go to next question"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveAndExit}
                  className="border-amber-500/60 text-amber-100 hover:bg-amber-500/10 ml-2"
                >
                  Save & Exit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="border-red-500/60 text-red-100 hover:bg-red-500/10 ml-2"
                >
                  Reset
                </Button>
              </div>
            </div>
            <div className="w-full bg-amber-900/30 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-amber-600 to-amber-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(Math.min(currentQuestionIndex + 1, allItems.length) / allItems.length) * 100}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-xs text-amber-200/80 mt-1">
              <div>
                {saveStatus === 'auth' && 'Sign in to save your progress after each question.'}
                {saveStatus === 'error' && 'Auto-save failed. We will retry on your next answer.'}
                {saveStatus === 'saved' && lastSavedAt && `Saved at ${lastSavedAt}`}
                {saveStatus === 'saving' && 'Saving...'}
                {saveStatus === 'idle' && (isSignedIn ? 'Progress auto-saves after each question.' : 'Sign in to save your progress.')}
              </div>
              {!isSignedIn && <span className="font-semibold text-amber-300">Not signed in</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Single Question Container */}
      <div className="relative h-screen overflow-hidden">
        {/* Questions Slider */}
        <div
          className={`flex h-full transition-transform duration-700 ease-in-out ${isTransitioning ? 'opacity-75' : 'opacity-100'}`}
          style={{
            transform: `translateX(-${currentQuestionIndex * 100}vw)`,
            width: `${(allItems.length + 1) * 100}vw`
          }}
        >
          {/* Individual Questions */}
          {allItems.map((item, index) => (
            <div
              key={item.id}
              className="w-screen h-full flex-shrink-0"
              data-question={index}
            >
              <AdventureQuestion
                item={item}
                onAnswer={handleAnswer}
                isAnswered={answeredQuestions.has(index)}
                questionNumber={index + 1}
                initialAnswer={getAnswerForItem(item.id, 'options' in item)}
              />
            </div>
          ))}

          {/* Completion Screen */}
          <div className="w-screen h-full flex-shrink-0 flex items-center justify-center p-6 bg-gradient-to-br from-purple-900 to-black">
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
        </div>
      </div>
    </div>
  )
}
