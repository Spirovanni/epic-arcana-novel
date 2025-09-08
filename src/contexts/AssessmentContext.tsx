'use client'

import React, { createContext, useContext, useCallback } from 'react'

interface AssessmentContextType {
  triggerRefresh: () => void
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined)

interface AssessmentProviderProps {
  children: React.ReactNode
}

export function AssessmentProvider({ children }: AssessmentProviderProps) {
  const refreshCallbacks = React.useRef<Set<() => void>>(new Set())

  const triggerRefresh = useCallback(() => {
    refreshCallbacks.current.forEach(callback => callback())
  }, [])

  const registerRefreshCallback = useCallback((callback: () => void) => {
    refreshCallbacks.current.add(callback)
    return () => {
      refreshCallbacks.current.delete(callback)
    }
  }, [])

  return (
    <AssessmentContext.Provider value={{ triggerRefresh }}>
      {children}
    </AssessmentContext.Provider>
  )
}

export function useAssessmentRefresh() {
  const context = useContext(AssessmentContext)
  if (context === undefined) {
    throw new Error('useAssessmentRefresh must be used within an AssessmentProvider')
  }
  return context
}

// Hook for components that need to refresh their data when assessment changes
export function useAssessmentDataRefresh(refreshCallback: () => void) {
  const context = useContext(AssessmentContext)
  
  React.useEffect(() => {
    if (context) {
      // Add this component's refresh callback to the global list
      const callbacks = (context as any).refreshCallbacks?.current
      if (callbacks) {
        callbacks.add(refreshCallback)
        return () => callbacks.delete(refreshCallback)
      }
    }
  }, [refreshCallback, context])
}