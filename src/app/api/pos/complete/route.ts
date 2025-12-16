import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { posAssessmentAnswers, posAssessmentResults, posAssessments } from '@/lib/schema'
import { and, eq } from 'drizzle-orm'
import { ensureAppUser } from '@/lib/server/users'
import { scorePosAssessment } from '@/lib/assessment/pos60_scoring'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await ensureAppUser()
    if (!dbUser) {
      return NextResponse.json({ error: 'User record missing' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const { assessmentId } = body as { assessmentId?: string }

    if (!assessmentId) {
      return NextResponse.json({ error: 'Missing assessmentId' }, { status: 400 })
    }

    const [assessment] = await db
      .select()
      .from(posAssessments)
      .where(and(eq(posAssessments.id, assessmentId), eq(posAssessments.userId, dbUser.id)))
      .limit(1)

    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    const answerRows = await db
      .select({
        questionId: posAssessmentAnswers.questionId,
        value: posAssessmentAnswers.value,
      })
      .from(posAssessmentAnswers)
      .where(eq(posAssessmentAnswers.assessmentId, assessmentId))

    const answers = answerRows.reduce<Record<string, number>>((acc, row) => {
      acc[row.questionId] = row.value
      return acc
    }, {})

    let results
    try {
      results = scorePosAssessment(answers)
    } catch (err) {
      console.error('[api/pos/complete] scoring error', err)
      return NextResponse.json({ error: 'Scoring failed', detail: String(err) }, { status: 400 })
    }
    const now = new Date().toISOString()

    await db
      .insert(posAssessmentResults)
      .values({
        assessmentId,
        domainScores: results.domain_scores,
        facetScores: results.facet_scores,
        insights: results.insights,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: posAssessmentResults.assessmentId,
        set: {
          domainScores: results.domain_scores,
          facetScores: results.facet_scores,
          insights: results.insights,
          updatedAt: now,
        },
      })

    await db
      .update(posAssessments)
      .set({
        status: 'completed',
        completedAt: now,
        updatedAt: now,
      })
      .where(eq(posAssessments.id, assessmentId))

    return NextResponse.json({ ok: true, results })
  } catch (error) {
    console.error('[api/pos/complete] failed', error)
    return NextResponse.json(
      { error: 'Complete error', detail: process.env.NODE_ENV === 'production' ? undefined : String(error) },
      { status: 500 }
    )
  }
}
