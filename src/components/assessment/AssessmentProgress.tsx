'use client'

import { Progress } from '@/components/ui/progress'
import { useAssessmentStore } from '@/store/useAssessmentStore'

interface AssessmentProgressProps {
  currentStep: number
  totalSteps: number
  className?: string
}

export function AssessmentProgress({ 
  currentStep, 
  totalSteps, 
  className 
}: AssessmentProgressProps) {
  const progress = (currentStep / totalSteps) * 100
  
  return (
    <div className={`space-y-2 ${className || ''}`}>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-300">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-gray-300">
          {Math.round(progress)}% Complete
        </span>
      </div>
      
      <Progress 
        value={progress} 
        className="w-full h-2"
      />
      
      <div className="flex justify-between text-xs text-gray-400">
        <span>Story Scenarios</span>
        <span>Personal Statements</span>
        <span>Results</span>
      </div>
    </div>
  )
}