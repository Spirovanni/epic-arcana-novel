'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ForcedChoiceItem } from '@/components/assessment/ForcedChoiceItem'
import { getForcedChoiceItems } from '@/lib/items/forced'
import { useAssessmentStore } from '@/store/useAssessmentStore'
import Link from 'next/link'

export function QuickStartCard() {
  const [currentItem, setCurrentItem] = useState(0)
  const [isStarted, setIsStarted] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<{ best?: number; worst?: number }>({})
  
  const { addForcedChoiceAnswer } = useAssessmentStore()
  
  // Get first 3 forced choice items for quick start
  const items = getForcedChoiceItems().slice(0, 3)
  const currentQuestionItem = items[currentItem]

  const handleAnswer = (best: number, worst: number) => {
    setSelectedAnswers({ best, worst })
    
    // Save the answer to store
    addForcedChoiceAnswer({
      itemId: currentQuestionItem.id,
      best,
      worst
    })
  }

  const handleNext = () => {
    if (currentItem < items.length - 1) {
      setCurrentItem(currentItem + 1)
      setSelectedAnswers({})
    }
  }

  const handleStart = () => {
    setIsStarted(true)
  }

  if (!isStarted) {
    return (
      <Card className="bg-slate-800/50 border-purple-500/30 hover:border-purple-400/50 transition-colors">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/50">
              Quick Start Preview
            </Badge>
          </div>
          <CardTitle className="text-2xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Experience Epic Arcana
          </CardTitle>
          <CardDescription className="text-gray-300 text-lg">
            Get a taste of our story-driven assessment with 3 sample questions from the mystical realm of Laurasia.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preview Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-700/50 rounded-lg">
              <div className="text-2xl mb-2">🏰</div>
              <div className="font-semibold text-purple-300 mb-1">Immersive Stories</div>
              <div className="text-sm text-gray-400">Journey through Laurasia's mystical locations</div>
            </div>
            <div className="text-center p-4 bg-slate-700/50 rounded-lg">
              <div className="text-2xl mb-2">⚖️</div>
              <div className="font-semibold text-blue-300 mb-1">Meaningful Choices</div>
              <div className="text-sm text-gray-400">Select your best and worst responses</div>
            </div>
            <div className="text-center p-4 bg-slate-700/50 rounded-lg">
              <div className="text-2xl mb-2">🔍</div>
              <div className="font-semibold text-green-300 mb-1">Deep Insights</div>
              <div className="text-sm text-gray-400">Reveal your personality patterns</div>
            </div>
          </div>

          <div className="text-center">
            <Button 
              onClick={handleStart}
              variant="mystical" 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
            >
              Start Quick Preview
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const isLastItem = currentItem === items.length - 1
  const canProceed = selectedAnswers.best !== undefined && selectedAnswers.worst !== undefined

  return (
    <Card className="bg-slate-800/50 border-purple-500/30">
      <CardHeader>
        <div className="flex justify-between items-center">
          <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/50">
            Question {currentItem + 1} of {items.length}
          </Badge>
          <div className="text-sm text-gray-400">
            Quick Preview
          </div>
        </div>
        <CardTitle className="text-xl text-purple-300">
          {currentQuestionItem.location}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-gray-300 leading-relaxed">
          {currentQuestionItem.vignette}
        </div>

        <ForcedChoiceItem
          item={currentQuestionItem}
          onAnswer={handleAnswer}
          answer={selectedAnswers.best !== undefined && selectedAnswers.worst !== undefined ? {
            itemId: currentQuestionItem.id,
            best: selectedAnswers.best,
            worst: selectedAnswers.worst
          } : undefined}
        />

        <div className="flex justify-between items-center pt-4">
          <div className="text-sm text-gray-400">
            Choose your best and worst responses
          </div>
          
          {canProceed && (
            <div className="flex gap-2">
              {!isLastItem ? (
                <Button onClick={handleNext} variant="mystical">
                  Next Question
                </Button>
              ) : (
                <Link href="/assessment">
                  <Button variant="mystical">
                    Continue Full Assessment
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>

        {isLastItem && canProceed && (
          <div className="text-center p-4 bg-purple-600/10 rounded-lg border border-purple-500/30">
            <p className="text-gray-300 mb-3">
              🎉 You've completed the quick preview! Ready to discover your full Epic Arcana profile?
            </p>
            <p className="text-sm text-gray-400">
              The complete assessment includes 54 story-driven questions and reveals one of 360 unique personality archetypes.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}