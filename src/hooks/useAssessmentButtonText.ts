'use client'

import { useAssessmentStatus } from './useAssessmentStatus'

export function useAssessmentButtonText() {
  const { hasCompletedAssessment, loading, refresh } = useAssessmentStatus()
  
  const buttonText = loading 
    ? 'Loading...' 
    : hasCompletedAssessment 
      ? 'Retake Assessment' 
      : 'Take Assessment'

  return { buttonText, hasCompletedAssessment, loading, refresh }
}