'use client'

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { POS60_V1, PosDomainKey, PosQuestion } from '@/lib/assessment/pos60_v1'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AssessmentNavbar } from '@/components/assessment/AssessmentNavbar'

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
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {domains.map((domain) => (
                <button
                    key={domain.key}
                    onClick={() => onSelect(domain.key)}
                    className={cn(
                        'rounded-xl border px-4 py-3 text-left transition-all duration-300',
                        active === domain.key
                            ? 'bg-slate-800 text-purple-300 border-purple-500/50 shadow-lg shadow-purple-900/20'
                            : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-700'
                    )}
                >
                    <div className="text-sm font-semibold">{domain.label}</div>
                    <div className="text-xs opacity-70 mt-1">
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
        <div className="w-full">
            <div className="flex justify-between text-xs font-medium text-slate-400 uppercase tracking-wider px-1 mb-3">
                <span>Strongly Disagree</span>
                <span className="hidden sm:inline-block">Neutral</span>
                <span>Strongly Agree</span>
            </div>
            <div className="flex justify-between items-center gap-2 bg-slate-900/30 p-3 rounded-2xl border border-slate-800/50">
                {[1, 2, 3, 4, 5].map((v) => (
                    <button
                        key={v}
                        onClick={() => onChange(v)}
                        className={cn(
                            'w-10 h-10 sm:w-12 sm:h-12 rounded-full border text-sm font-bold transition-all duration-200 shadow-sm flex items-center justify-center',
                            value === v
                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-transparent shadow-lg shadow-purple-500/30 scale-110'
                                : 'border-slate-700 bg-slate-800/80 text-slate-400 hover:border-slate-500 hover:text-slate-200 hover:bg-slate-800'
                        )}
                    >
                        {v}
                    </button>
                ))}
            </div>
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
        <Card className="bg-slate-800/50 border-purple-500/20 shadow-lg backdrop-blur-sm transition-all hover:border-purple-500/30">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-medium text-slate-200 leading-relaxed">{text}</CardTitle>
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
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-slate-200">
                <AssessmentNavbar />
                <div className="max-w-3xl mx-auto px-4 py-24">
                    <div className="text-center text-slate-400 animate-pulse">Loading POS-60...</div>
                </div>
            </div>
        )
    }

    if (!POS60_V1.questions.length) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-slate-200">
                <AssessmentNavbar />
                <div className="max-w-3xl mx-auto px-4 py-24">
                    <Card className="bg-slate-800/50 border-purple-500/30">
                        <CardHeader>
                            <CardTitle className="text-red-400">POS-60 unavailable</CardTitle>
                        </CardHeader>
                        <CardContent className="text-slate-400">The question bank is missing. Please add the POS60_V1 data.</CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
            <AssessmentNavbar />

            <div className="max-w-5xl mx-auto px-4 py-12">
                <div className="mb-10 text-center sm:text-left">
                    <p className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-2">Personal Operating System</p>
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent pb-1">
                        POS-60 Assessment
                    </h1>
                    <p className="text-slate-400 mt-3 text-lg max-w-2xl">
                        A 10-minute snapshot across focus, planning, execution, collaboration, and resilience.
                    </p>
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
                    <div className="mb-6 rounded-lg bg-red-900/20 border border-red-500/30 p-4 text-red-300 text-sm">
                        {error}
                    </div>
                ) : null}

                <div className="space-y-6">
                    {currentDomain?.questions.map((question) => (
                        <QuestionCard
                            key={question.id}
                            question={question}
                            answer={answers[question.id]}
                            onAnswer={(v) => handleAnswer(question.id, v)}
                        />
                    ))}
                </div>

                <div className="mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pt-8 border-t border-purple-500/10">
                    <div className="text-sm text-slate-500 font-medium">
                        <span className="text-slate-300">{totalAnswered}</span> <span className="text-slate-600">/</span> <span className="text-slate-400">{totalQuestions} answered</span>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            className="border-purple-500/30 text-slate-400 hover:text-slate-200 hover:bg-purple-500/10 hover:border-purple-500/50"
                            disabled={currentIndex <= 0}
                            onClick={() => setActiveDomain(grouped[Math.max(0, currentIndex - 1)].key)}
                        >
                            Previous
                        </Button>
                        {currentIndex < grouped.length - 1 ? (
                            <Button
                                variant="mystical"
                                onClick={() => setActiveDomain(grouped[Math.min(grouped.length - 1, currentIndex + 1)].key)}
                                disabled={!canContinue}
                                className="min-w-[120px]"
                            >
                                Next Domain
                            </Button>
                        ) : (
                            <Button
                                variant="mystical"
                                onClick={handleComplete}
                                disabled={submitting || totalAnswered !== totalQuestions}
                                className="min-w-[140px]"
                            >
                                {submitting ? 'Submitting...' : 'Complete & View'}
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
        <Suspense fallback={<div className="min-h-screen bg-slate-900 text-slate-400 flex items-center justify-center">Loading...</div>}>
            <PosAssessmentPageInner />
        </Suspense>
    )
}
