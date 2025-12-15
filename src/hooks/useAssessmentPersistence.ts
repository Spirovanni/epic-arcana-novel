'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'
import { useAssessmentStore } from '@/store/useAssessmentStore'
import { ForcedChoiceAnswer, LikertAnswer } from '@/lib/assessment/types'

type AnswerPayload =
  | { type: 'forced'; itemId: string; best: number; worst: number }
  | { type: 'likert'; itemId: string; rating: number }

type ServerAnswer = { answerType?: string; value: any }
type PreviousAnswerMap = Record<string, ServerAnswer>

type UseAssessmentPersistenceParams = {
  forcedChoiceItems: Array<{ id: string }>
  likertItems: Array<{ id: string }>
  totalQuestionCount: number
  getStepFromAnsweredCount: (count: number, total: number) => number
}

export function useAssessmentPersistence({
  forcedChoiceItems,
  likertItems,
  totalQuestionCount,
  getStepFromAnsweredCount,
}: UseAssessmentPersistenceParams) {
  const { isLoaded, isSignedIn } = useUser()
  const searchParams = useSearchParams()
  const retake = searchParams.get('retake') === 'true'

  const {
    setAnswers,
    setStep,
    setSessionId,
    sessionId,
    startAssessment,
    currentStep,
  } = useAssessmentStore()

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error' | 'auth' | 'loading'>('loading')
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)
  const [previousAnswers, setPreviousAnswers] = useState<PreviousAnswerMap>({})
  const pendingPayload = useRef<AnswerPayload | null>(null)
  const saveTimer = useRef<NodeJS.Timeout | null>(null)
  const hasLoadedSession = useRef(false)

  const forcedLookup = useMemo(() => new Set(forcedChoiceItems.map(i => i.id)), [forcedChoiceItems])
  const likertLookup = useMemo(() => new Set(likertItems.map(i => i.id)), [likertItems])

  const hydrateAnswers = useCallback((answers: Record<string, ServerAnswer>) => {
    const forced: ForcedChoiceAnswer[] = []
    const likert: LikertAnswer[] = []

    Object.entries(answers || {}).forEach(([questionKey, entry]) => {
    const answerType = entry?.answerType || (forcedLookup.has(questionKey) ? 'forced' : 'likert')
    if (answerType === 'forced') {
      const best = entry?.value?.best
      const worst = entry?.value?.worst
      if (typeof best === 'number' && typeof worst === 'number') {
          forced.push({ itemId: questionKey, best, worst })
        }
      } else {
        const rating = typeof entry?.value === 'number' ? entry?.value : entry?.value?.rating
        if (typeof rating === 'number') {
          likert.push({ itemId: questionKey, rating })
      }
    }
  })

  setAnswers(forced, likert)
    const answeredCount = forced.length + likert.length
    const step = getStepFromAnsweredCount(answeredCount, totalQuestionCount)
    setStep(step)
  }, [forcedLookup, likertLookup, setAnswers, setStep, getStepFromAnsweredCount, totalQuestionCount])

  const loadSession = useCallback(async () => {
    if (!isLoaded) return
    if (!isSignedIn) {
      setSaveStatus('auth')
      return
    }

    try {
      const url = retake ? '/api/assessment/session?retake=true' : '/api/assessment/session'
      const res = await fetch(url, { cache: 'no-store' })

      if (!res.ok) {
        setSaveStatus(res.status === 401 ? 'auth' : 'error')
        return
      }

      const data = await res.json()
      if (data.sessionId) {
        setSessionId(data.sessionId)
      }
      if (data.answers) {
        hydrateAnswers(data.answers)
      }
      if (data.previousAnswers) {
        setPreviousAnswers(data.previousAnswers as PreviousAnswerMap)
      }
      hasLoadedSession.current = true
      setSaveStatus('saved')
      setLastSavedAt(new Date().toLocaleTimeString())
    } catch (error) {
      console.error('Failed to load assessment session', error)
      setSaveStatus('error')
    }
  }, [hydrateAnswers, isLoaded, isSignedIn, retake, setSessionId])

  useEffect(() => {
    if (!hasLoadedSession.current) {
      loadSession()
    }
  }, [loadSession])

  const flushPending = useCallback(async () => {
    if (!pendingPayload.current) return
    if (!sessionId) {
      setSaveStatus('error')
      setSaveMessage('No active session; cannot save answers. Reload the page to start a new session.')
      return
    }
    const payload = pendingPayload.current
    pendingPayload.current = null
    setSaveStatus('saving')
    try {
      const body = {
        sessionId,
        questionKey: payload.itemId,
        value: payload.type === 'forced'
          ? { best: payload.best, worst: payload.worst }
          : { rating: payload.rating },
        answerType: payload.type,
      }
      const res = await fetch('/api/assessment/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        const message = `Save failed (${res.status} ${res.statusText}) ${text ? `- ${text}` : ''}`
        setSaveStatus(res.status === 401 ? 'auth' : 'error')
        setSaveMessage(message)
        console.error('[Assessment] save error:', message)
        return
      }
      setSaveStatus('saved')
      setLastSavedAt(new Date().toLocaleTimeString())
      setSaveMessage(null)
    } catch (error) {
      console.error('Failed to persist answer', error)
      setSaveStatus('error')
      setSaveMessage('Network error while saving. We will retry on your next action.')
    }
  }, [sessionId])

  const persistAnswer = useCallback((payload: AnswerPayload) => {
    if (!isSignedIn) {
      setSaveStatus('auth')
      return
    }
    pendingPayload.current = payload
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      flushPending()
    }, 350)
  }, [flushPending, isSignedIn])

  useEffect(() => {
    const handler = () => {
      flushPending()
    }
    window.addEventListener('pagehide', handler)
    window.addEventListener('beforeunload', handler)
    return () => {
      window.removeEventListener('pagehide', handler)
      window.removeEventListener('beforeunload', handler)
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [flushPending])

  useEffect(() => {
    if (currentStep === 0) {
      startAssessment()
    }
  }, [currentStep, startAssessment])

  return {
    saveStatus,
    lastSavedAt,
    persistAnswer,
    sessionId,
    requireAuth: saveStatus === 'auth',
    reloadSession: loadSession,
    flushPending,
    saveMessage,
    previousAnswers,
  }
}
