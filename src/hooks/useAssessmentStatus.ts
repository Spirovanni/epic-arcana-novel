'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

export function useAssessmentStatus() {
  const { isSignedIn } = useUser()
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false)
  const [loading, setLoading] = useState(true)

  const checkAssessmentStatus = async () => {
    if (!isSignedIn) {
      setHasCompletedAssessment(false)
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/assessment/result')
      if (response.ok) {
        setHasCompletedAssessment(true)
      } else if (response.status === 404) {
        setHasCompletedAssessment(false)
      } else {
        console.error('Error checking assessment status')
        setHasCompletedAssessment(false)
      }
    } catch (error) {
      console.error('Error checking assessment status:', error)
      setHasCompletedAssessment(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAssessmentStatus()
  }, [isSignedIn])

  return { hasCompletedAssessment, loading, refresh: checkAssessmentStatus }
}