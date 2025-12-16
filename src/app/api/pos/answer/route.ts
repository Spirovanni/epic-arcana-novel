import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { posAssessmentAnswers, posAssessments } from '@/lib/schema'
import { and, eq } from 'drizzle-orm'
import { ensureAppUser } from '@/lib/server/users'

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
    const { assessmentId, questionId, value } = body as { assessmentId?: string; questionId?: string; value?: number }

    if (!assessmentId || !questionId || typeof value !== 'number') {
      return NextResponse.json({ error: 'Missing assessmentId, questionId, or value' }, { status: 400 })
    }

    if (value < 1 || value > 5) {
      return NextResponse.json({ error: 'Value must be between 1 and 5' }, { status: 400 })
    }

    const [assessment] = await db
      .select()
      .from(posAssessments)
      .where(and(eq(posAssessments.id, assessmentId), eq(posAssessments.userId, dbUser.id)))
      .limit(1)

    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    if (assessment.status === 'completed') {
      return NextResponse.json({ error: 'Assessment already completed' }, { status: 400 })
    }

    const now = new Date().toISOString()

    await db
      .insert(posAssessmentAnswers)
      .values({
        assessmentId,
        questionId,
        value,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [posAssessmentAnswers.assessmentId, posAssessmentAnswers.questionId],
        set: { value, updatedAt: now },
      })

    return NextResponse.json({ ok: true, savedAt: now })
  } catch (error) {
    console.error('[api/pos/answer] failed', error)
    return NextResponse.json(
      { error: 'Answer error', detail: process.env.NODE_ENV === 'production' ? undefined : String(error) },
      { status: 500 }
    )
  }
}
