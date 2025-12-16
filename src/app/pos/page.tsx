'use client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { POS60_V1, PosDomainKey, PosQuestion } from '@/lib/assessment/pos60_v1'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type AnswerMap = Record<string, number>

const DOMAIN_ORDER: PosDomainKey[] = ['focus', 'planning', 'execution', 'collaboration', 'resilience']

function DomainNav({
  domains,
  active,
  onSelect,
}: {
  domains: { key: PosDomainKey; label: string; count: number; answered: number }[]
  active: PosDomainKey
  onSelect: (key: PosDomainKey) => void
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {domains.map((domain) => (
        <button
          key={domain.key}
          onClick={() => onSelect(domain.key)}
          className={cn(
            'rounded-xl border px-4 py-3 text-left transition-all',
            active === domain.key ? 'border-slate-900 bg-white shadow' : 'border-slate-200 bg-slate-50 hover:bg-white'
          )}
        >
          <div className="text-sm font-semibold text-slate-900">{domain.label}</div>
          <div className="text-xs text-slate-500">
            {domain.answered}/{domain.count} answered
          </div>
        </button>
      ))}
    </div>
  )
}

function Likert({
  value,
  onChange,
}: {
  value?: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {[1, 2, 3, 4, 5].map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={cn(
            'w-10 h-10 rounded-full border text-sm font-semibold transition-all',
            value === v
              ? 'bg-slate-900 text-white border-slate-900'
              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
          )}
        >
          {v}
        </button>
      ))}
    </div>
  )
}

function QuestionCard({
  question,
  answer,
  onAnswer,
}: {
  question: PosQuestion
  answer?: number
  onAnswer: (value: number) => void
}) {
  const text = question.prompt || question.statement || question.text || 'Question'
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base text-slate-900">{text}</CardTitle>
      </CardHeader>
      <CardContent>
        <Likert value={answer} onChange={onAnswer} />
      </CardContent>
    </Card>
  )
}

function PosAssessmentPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const retake = searchParams.get('retake') === 'true'

  const [assessmentId, setAssessmentId] = useState<string | null>(null)
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [activeDomain, setActiveDomain] = useState<PosDomainKey>('focus')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const saveTimers = useRef<Record<string, NodeJS.Timeout>>({})

  const grouped = useMemo(() => {
    return DOMAIN_ORDER.map((key) => ({
      key,
      label: POS60_V1.domains[key]?.label || key,
      questions: POS60_V1.questions.filter((q) => q.domain === key),
    }))
  }, [])

  const totalQuestions = POS60_V1.questions.length
  const totalAnswered = Object.keys(answers).length

  useEffect(() => {
    const loadSession = async () => {
      try {
        setLoading(true)
        const qs = retake ? '?retake=true' : ''
        const res = await fetch(`/api/pos/session${qs}`)
        if (!res.ok) {
          throw new Error('Unable to start POS-60 session')
        }
        const data = await res.json()
        setAssessmentId(data.assessmentId)
        setAnswers(data.answers || {})
      } catch (err) {
        console.error(err)
        setError('Could not load your POS-60 session.')
      } finally {
        setLoading(false)
      }
    }

    loadSession()
  }, [retake])

  const debouncedSave = (questionId: string, value: number) => {
    if (!assessmentId) return
    if (saveTimers.current[questionId]) {
      clearTimeout(saveTimers.current[questionId])
    }
    saveTimers.current[questionId] = setTimeout(async () => {
      try {
        await fetch('/api/pos/answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assessmentId, questionId, value }),
        })
      } catch (err) {
        console.error('[pos] save error', err)
      }
    }, 700)
  }

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
    debouncedSave(questionId, value)
  }

  const handleComplete = async () => {
    if (!assessmentId) return
    try {
      setSubmitting(true)
      const res = await fetch('/api/pos/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Unable to complete assessment')
      }
      router.push('/profile')
    } catch (err) {
      console.error(err)
      setError('Could not complete your POS-60 right now.')
    } finally {
      setSubmitting(false)
    }
  }

  const currentDomain = grouped.find((g) => g.key === activeDomain)
  const currentIndex = grouped.findIndex((g) => g.key === activeDomain)
  const canContinue = !currentDomain?.questions.length || currentDomain?.questions.every((q) => answers[q.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <div className="text-center text-slate-600">Loading POS-60...</div>
        </div>
      </div>
    )
  }

  if (!POS60_V1.questions.length) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <Card>
            <CardHeader>
              <CardTitle>POS-60 unavailable</CardTitle>
            </CardHeader>
            <CardContent>The question bank is missing. Please add the POS60_V1 data.</CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-6">
          <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Personal Operating System</p>
          <h1 className="text-3xl font-bold text-slate-900">POS-60 Assessment</h1>
          <p className="text-slate-600 mt-2">10-minute snapshot across focus, planning, execution, collaboration, and resilience.</p>
        </div>

        <DomainNav
          domains={grouped.map((g) => ({
            key: g.key,
            label: g.label,
            count: g.questions.length,
            answered: g.questions.filter((q) => answers[q.id]).length,
          }))}
          active={activeDomain}
          onSelect={setActiveDomain}
        />

        {error ? (
          <div className="mb-4 text-red-600 text-sm">{error}</div>
        ) : null}

        <div className="space-y-4">
          {currentDomain?.questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              answer={answers[question.id]}
              onAnswer={(v) => handleAnswer(question.id, v)}
            />
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm text-slate-600">
            {totalAnswered}/{totalQuestions} answered
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={currentIndex <= 0}
              onClick={() => setActiveDomain(grouped[Math.max(0, currentIndex - 1)].key)}
            >
              Previous
            </Button>
            {currentIndex < grouped.length - 1 ? (
              <Button
                onClick={() => setActiveDomain(grouped[Math.min(grouped.length - 1, currentIndex + 1)].key)}
                disabled={!canContinue}
              >
                Next domain
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={submitting || totalAnswered !== totalQuestions}>
                {submitting ? 'Submitting...' : 'Submit POS-60'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PosAssessmentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 px-4 py-12 text-slate-600">Loading POS-60...</div>}>
      <PosAssessmentPageInner />
    </Suspense>
  )
}
