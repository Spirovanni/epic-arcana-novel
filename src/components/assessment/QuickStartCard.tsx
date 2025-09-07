'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { getForcedChoiceItems } from '@/lib/items/forced'
import { useAssessmentStore } from '@/store/useAssessmentStore'
import { ForcedChoiceItem } from '@/components/assessment/ForcedChoiceItem'
import { useRouter } from 'next/navigation'

const QUICK_START_ITEMS = 3 // Show first 3 forced choice items

export function QuickStartCard() {
  const router = useRouter()
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const { 
    forcedChoiceAnswers, 
    addForcedChoiceAnswer, 
    startAssessment 
  } = useAssessmentStore()
  
  const forcedChoiceItems = getForcedChoiceItems().slice(0, QUICK_START_ITEMS)
  const currentItem = forcedChoiceItems[currentItemIndex]
  const progress = ((currentItemIndex + 1) / QUICK_START_ITEMS) * 100
  
  const currentAnswer = forcedChoiceAnswers.find(a => a.itemId === currentItem?.id)
  const canProceed = currentAnswer && currentAnswer.best !== undefined && currentAnswer.worst !== undefined
  
  const handleNext = () => {
    if (currentItemIndex < QUICK_START_ITEMS - 1) {
      setCurrentItemIndex(currentItemIndex + 1)
    } else {
      // Quick start complete, go to full assessment
      startAssessment()
      router.push('/assessment')
    }
  }
  
  const handleAnswer = (best: number, worst: number) => {
    if (currentItem) {
      addForcedChoiceAnswer({
        itemId: currentItem.id,
        best,
        worst
      })
    }
  }
  
  if (!currentItem) return null
  
  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-slate-900/80 to-purple-900/80 backdrop-blur-md border-purple-500/30 text-white">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Quick Start: Discover Your Arcana
        </CardTitle>
        <CardDescription className="text-gray-300">
          Answer just 3 questions to get a preview of your Epic Arcana profile
        </CardDescription>
        <div className="mt-4">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-400 mt-2">
            Question {currentItemIndex + 1} of {QUICK_START_ITEMS}
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <ForcedChoiceItem
          item={currentItem}
          answer={currentAnswer}
          onAnswer={handleAnswer}
          showLocationHeader={true}
        />
        
        <div className="flex justify-between items-center pt-4">
          <Button
            variant="outline"
            onClick={() => router.push('/assessment')}
            className="border-purple-500/50 hover:bg-purple-500/10"
          >
            Skip to Full Assessment
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed}
            variant="mystical"
            className="min-w-[120px]"
          >
            {currentItemIndex < QUICK_START_ITEMS - 1 ? 'Next' : 'Continue'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}