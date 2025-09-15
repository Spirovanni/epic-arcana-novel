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
    <div className="bg-black/60 backdrop-blur-sm rounded-2xl border border-amber-500/30 shadow-2xl w-full h-[600px] flex flex-col">
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
              
              {/* Continue Button for Forced Choice */}
              {canContinue && (
                <div className="pt-3 lg:pt-4 border-t border-amber-500/20 text-center">
                  <button
                    onClick={handleContinue}
                    className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 px-4 sm:px-6 py-2 rounded-lg text-black font-bold text-xs sm:text-sm lg:text-base transition-all duration-300 hover:scale-105 shadow-md shadow-amber-500/25"
                  >
                    Continue Journey
                  </button>
                </div>
              )}
            </div>
          </div>
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
                className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 px-8 py-4 rounded-xl text-black font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-amber-500/25"
              >
                Continue Journey
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
                className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 px-8 py-4 rounded-xl text-black font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-amber-500/25"
              >
                Continue Journey
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
                className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 px-8 py-4 rounded-xl text-black font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-amber-500/25"
              >
                Continue Journey
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

function AdventureQuestion({ item, onAnswer, isAnswered, questionNumber }: AdventureQuestionProps) {
  const questionRef = useRef<HTMLDivElement>(null)
  const isForcedChoice = 'options' in item
  const [selectedBest, setSelectedBest] = useState<number | null>(null)
  const [selectedWorst, setSelectedWorst] = useState<number | null>(null)
  const [likertRating, setLikertRating] = useState<number | null>(null)
  const [canContinue, setCanContinue] = useState(false)

  // Reset selections when question changes (for retake scenarios)
  useEffect(() => {
    if (!isAnswered) {
      setSelectedBest(null)
      setSelectedWorst(null)
      setLikertRating(null)
      setCanContinue(false)
    }
  }, [questionNumber, isAnswered])

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

  
  // Questions with image layout (1-19)
  const hasImageLayout = questionNumber >= 1 && questionNumber <= 19
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
        src: "/images/assessment/Question_9..png",
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
      className="h-full w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-12 relative"
      style={{
        background: getBackgroundGradient(questionNumber),
        minHeight: 'calc(100vh - 120px)',
        marginTop: '120px',
        transform: 'translateY(-10%)'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70" />
      
      {/* Question Content */}
      <div className={cn(
        "relative z-10 mx-auto w-full",
        hasImageLayout ? "max-w-7xl" : "max-w-4xl"
      )}>
        {hasImageLayout ? (
          <>
            {isQuestion19 ? (
              // Question 19 - Epic finale with side-by-side layout
              <>
                {/* Desktop Layout */}
                <div className="hidden lg:flex lg:items-start lg:gap-8 xl:gap-16">
                  {/* Left side - Enhanced Image Card for finale */}
                  <div className="flex-shrink-0">
                    <div className="relative w-[600px] h-[600px]">
                      {/* Enhanced glowing backdrop for finale */}
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/40 to-orange-600/40 rounded-2xl blur-3xl scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-600/20 rounded-2xl blur-2xl scale-105" />
                      
                      <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-400/50 bg-black/20 w-full h-full flex flex-col">
                        <div className="flex-1 relative">
                          <Image
                            src={getImageDetails(questionNumber).src}
                            alt={getImageDetails(questionNumber).alt}
                            width={600}
                            height={600}
                            className="object-cover w-full h-full"
                            priority
                            sizes="600px"
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
                    <div className="relative bg-gradient-to-br from-black/70 via-slate-900/70 to-black/70 rounded-2xl border-2 border-amber-400/40 shadow-2xl overflow-hidden">
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
                    <div className="absolute top-1/2 -right-4 w-3 h-3 bg-purple-400/40 rounded-full animate-pulse" style={{animationDelay: '0.7s'}}></div>
                    <div className="absolute bottom-1/4 -left-4 w-3 h-3 bg-orange-400/40 rounded-full animate-pulse" style={{animationDelay: '1.4s'}}></div>
                  </div>
                </div>
                
                {/* Mobile Layout */}
                <div className="block lg:hidden">
                  <div className="flex justify-center mb-6">
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
                <div className="hidden lg:flex lg:items-start lg:gap-8 xl:gap-16">
                  {/* Left side - Image Card */}
                  <div className="flex-shrink-0">
                    <div className="relative w-[600px] h-[600px]">
                      {/* Glowing backdrop for the image */}
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-orange-600/30 rounded-2xl blur-2xl scale-105" />
                      <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/30 bg-black/20 w-full h-full flex flex-col">
                        <div className="flex-1 relative">
                          <Image
                            src={getImageDetails(questionNumber).src}
                            alt={getImageDetails(questionNumber).alt}
                            width={600}
                            height={600}
                            className="object-cover w-full h-full"
                            priority
                            sizes="600px"
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
                  </div>
                  
                  {/* Right side - Question Card */}
                  <div className="flex-1 max-w-2xl">
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
                  <div className="flex justify-center mb-6">
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set())
  const [isTransitioning, setIsTransitioning] = useState(false)
  
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
    if (currentStep === 0 && !isSubmitting) {
      startAssessment()
    }
  }, [currentStep, startAssessment, isSubmitting])

  // Prevent body scroll during assessment
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])
  
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
  }, [currentQuestionIndex, allItems, addForcedChoiceAnswer, updateLikertAnswer, handleComplete])

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
    router.push(`/results/${resultId}`)
  }, [router])
  
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
              </div>
            </div>
            <div className="w-full bg-amber-900/30 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-amber-600 to-amber-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(Math.min(currentQuestionIndex + 1, allItems.length) / allItems.length) * 100}%` }}
              />
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