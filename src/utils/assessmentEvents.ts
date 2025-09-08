'use client'

import React from 'react'

// Custom event system for assessment updates
class AssessmentEventManager {
  private listeners: Set<() => void> = new Set()

  subscribe(callback: () => void): () => void {
    this.listeners.add(callback)
    return () => {
      this.listeners.delete(callback)
    }
  }

  emit(): void {
    this.listeners.forEach(callback => {
      try {
        callback()
      } catch (error) {
        console.error('Error in assessment refresh callback:', error)
      }
    })
  }
}

export const assessmentEvents = new AssessmentEventManager()

// Hook to trigger assessment data refresh across the app
export function useAssessmentRefresh() {
  return {
    triggerRefresh: () => assessmentEvents.emit()
  }
}

// Hook for components that need to refresh when assessment data changes
export function useAssessmentDataRefresh(refreshCallback: () => void) {
  React.useEffect(() => {
    const unsubscribe = assessmentEvents.subscribe(refreshCallback)
    return unsubscribe
  }, [refreshCallback])
}