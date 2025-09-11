'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { getForcedChoiceItems } from '@/lib/items/forced'
import { useAssessmentStore } from '@/store/useAssessmentStore'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function AdventureQuickStartCard() {
  const [currentItem, setCurrentItem] = useState(0)
  const [isStarted, setIsStarted] = useState(false)
  const [selectedBest, setSelectedBest] = useState<number | null>(null)
  const [selectedWorst, setSelectedWorst] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  
  const { addForcedChoiceAnswer } = useAssessmentStore()
  
  // Get first 3 forced choice items for quick start
  const items = getForcedChoiceItems().slice(0, 3)
  const currentQuestionItem = items[currentItem]

  // Dynamic background gradients
  const getBackgroundGradient = (itemIndex: number) => {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Purple-blue
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', // Pink-red
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // Blue-cyan
    ]
    return gradients[itemIndex % gradients.length]
  }

  const handleOptionClick = (index: number) => {
    if (isAnswered) return

    if (selectedBest === null) {
      setSelectedBest(index)
    } else if (selectedWorst === null && index !== selectedBest) {
      setSelectedWorst(index)
      setIsAnswered(true)
      
      // Save the answer
      addForcedChoiceAnswer({
        itemId: currentQuestionItem.id,
        best: selectedBest,
        worst: index
      })
      
      // Auto-advance after delay
      setTimeout(() => {
        if (currentItem < items.length - 1) {
          handleNext()
        }
      }, 1500)
    } else if (selectedBest === index) {
      setSelectedBest(null)
      setSelectedWorst(null)
    } else if (selectedWorst === index) {
      setSelectedWorst(null)
    } else {
      setSelectedWorst(index)
      setIsAnswered(true)
      
      addForcedChoiceAnswer({
        itemId: currentQuestionItem.id,
        best: selectedBest,
        worst: index
      })
      
      setTimeout(() => {
        if (currentItem < items.length - 1) {
          handleNext()
        }
      }, 1500)
    }
  }

  const handleNext = () => {
    setCurrentItem(prev => prev + 1)
    setSelectedBest(null)
    setSelectedWorst(null)
    setIsAnswered(false)
  }

  const handleStart = () => {
    setIsStarted(true)
  }

  const getOptionStatus = (index: number) => {
    if (selectedBest === index) return 'best'
    if (selectedWorst === index) return 'worst'
    return 'unselected'
  }

  if (!isStarted) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Adventure Preview Card */}
        <div 
          className="relative rounded-2xl p-8 shadow-2xl border border-amber-500/30 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/60" />
          
          {/* Content */}
          <div className="relative z-10 text-center space-y-6">
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 bg-amber-500/20 border border-amber-400/30 rounded-full">
                <span className="text-amber-300 text-sm font-semibold">✨ ADVENTURE PREVIEW ✨</span>
              </div>
              
              <h2 className="text-3xl font-bold text-amber-300">
                Experience Epic Arcana
              </h2>
              
              <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
                Journey through mystical realms and discover your true nature with our 
                immersive choose-your-own-adventure assessment.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              <div className="p-6 bg-black/40 backdrop-blur-sm rounded-xl border border-amber-500/20">
                <div className="text-3xl mb-3">🏰</div>
                <div className="font-bold text-amber-300 mb-2">Immersive Stories</div>
                <div className="text-gray-300 text-sm">Experience interactive storytelling through mystical locations</div>
              </div>
              <div className="p-6 bg-black/40 backdrop-blur-sm rounded-xl border border-amber-500/20">
                <div className="text-3xl mb-3">🎯</div>
                <div className="font-bold text-amber-300 mb-2">Auto-Scroll Questions</div>
                <div className="text-gray-300 text-sm">Seamlessly flows from question to question like an adventure</div>
              </div>
              <div className="p-6 bg-black/40 backdrop-blur-sm rounded-xl border border-amber-500/20">
                <div className="text-3xl mb-3">✨</div>
                <div className="font-bold text-amber-300 mb-2">Visual Storytelling</div>
                <div className="text-gray-300 text-sm">Beautiful backgrounds and immersive atmosphere</div>
              </div>
            </div>

            <Button 
              onClick={handleStart}
              className="bg-gradient-to-r from-amber-600 to-amber-400 hover:from-amber-500 hover:to-amber-300 text-black font-bold px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              🎲 Begin Your Adventure
            </Button>
            
            <p className="text-amber-200/80 text-sm">
              Experience 3 sample questions • No signup required
            </p>
          </div>
        </div>
      </div>
    )
  }

  const isLastItem = currentItem === items.length - 1
  const canProceed = selectedBest !== null && selectedWorst !== null

  return (
    <div className="max-w-4xl mx-auto">
      {/* Adventure Question Card */}
      <div 
        className="relative rounded-2xl p-8 shadow-2xl border border-amber-500/30 overflow-hidden min-h-[600px] flex items-center"
        style={{
          background: getBackgroundGradient(currentItem),
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70" />
        
        {/* Progress indicator */}
        <div className="absolute top-4 left-4 right-4 z-20">
          <div className="flex items-center justify-between text-amber-300 text-sm">
            <span>Preview Progress</span>
            <span>{currentItem + 1} of {items.length}</span>
          </div>
          <div className="w-full bg-amber-900/30 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-amber-600 to-amber-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentItem + 1) / items.length) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Question Content */}
        <div className="relative z-10 w-full pt-16">
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-amber-300">
                {currentQuestionItem.location}
              </h2>
              <p className="text-xl text-gray-200 leading-relaxed font-serif italic">
                "{currentQuestionItem.vignette}"
              </p>
            </div>
            
            {/* Instructions */}
            <div className="text-amber-200/80 text-sm border-t border-amber-500/20 pt-4">
              Choose the action that appeals to you <span className="text-green-400 font-semibold">MOST</span> and the one that appeals <span className="text-red-400 font-semibold">LEAST</span>
              {selectedBest !== null && selectedWorst === null && (
                <div className="mt-2 text-yellow-400">
                  Now choose which action appeals to you LEAST
                </div>
              )}
            </div>

            {/* Options */}
            <div className="space-y-4 mt-8">
              {currentQuestionItem.options.map((option, index) => {
                const status = getOptionStatus(index)
                
                return (
                  <button
                    key={index}
                    className={cn(
                      "w-full text-left p-6 rounded-xl transition-all duration-300 border-2",
                      "hover:scale-[1.02] transform",
                      status === 'best' && "border-green-500 bg-green-500/20 shadow-green-500/25",
                      status === 'worst' && "border-red-500 bg-red-500/20 shadow-red-500/25",
                      status === 'unselected' && "border-amber-500/30 bg-amber-500/10 hover:border-amber-400 hover:bg-amber-500/20"
                    )}
                    onClick={() => handleOptionClick(index)}
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

            {/* Status/Next */}
            {isAnswered && (
              <div className="pt-6">
                {!isLastItem ? (
                  <div className="text-amber-300 text-sm">
                    ✨ Excellent choice! Moving to the next adventure...
                  </div>
                ) : (
                  <div className="space-y-4 p-6 bg-black/40 backdrop-blur-sm rounded-xl border border-amber-500/20">
                    <div className="text-amber-300 text-lg font-bold">
                      🎉 Adventure Preview Complete!
                    </div>
                    <p className="text-gray-200">
                      Ready to discover your full Epic Arcana destiny? The complete assessment includes 54 immersive questions revealing one of 360 unique archetypes.
                    </p>
                    <Link href="/assessment">
                      <Button className="bg-gradient-to-r from-amber-600 to-amber-400 hover:from-amber-500 hover:to-amber-300 text-black font-bold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105">
                        🚀 Begin Full Adventure Assessment
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}