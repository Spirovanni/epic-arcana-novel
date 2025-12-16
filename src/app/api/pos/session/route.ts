import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { posAssessmentAnswers, posAssessments } from '@/lib/schema'
import { and, desc, eq } from 'drizzle-orm'
import { ensureAppUser } from '@/lib/server/users'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ASSESSMENT_KEY = 'pos60'
const ASSESSMENT_VERSION = 'v1'

type AnswerMap = Record<string, number>

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await ensureAppUser()
    if (!dbUser) {
      return NextResponse.json({ error: 'User record missing' }, { status: 401 })
    }

    const retake = req.nextUrl.searchParams.get('retake') === 'true'
    const now = new Date().toISOString()

    const existing = retake
      ? []
      : await db.select().from(posAssessments)
          .where(
            and(
              eq(posAssessments.userId, dbUser.id),
              eq(posAssessments.assessmentKey, ASSESSMENT_KEY),
              eq(posAssessments.version, ASSESSMENT_VERSION),
              eq(posAssessments.status, 'in_progress')
            )
          )
          .orderBy(desc(posAssessments.startedAt))
          .limit(1)

    const assessment =
      existing[0] ||
      (await db
        .insert(posAssessments)
        .values({
          userId: dbUser.id,
          assessmentKey: ASSESSMENT_KEY,
          version: ASSESSMENT_VERSION,
          status: 'in_progress',
          isRetake: retake,
          startedAt: now,
          updatedAt: now,
        })
        .returning())[0]

    const answerRows = await db
      .select({
        questionId: posAssessmentAnswers.questionId,
        value: posAssessmentAnswers.value,
      })
      .from(posAssessmentAnswers)
      .where(eq(posAssessmentAnswers.assessmentId, assessment.id))

    const answers = answerRows.reduce<AnswerMap>((acc, row) => {
      acc[row.questionId] = row.value
      return acc
    }, {})

    return NextResponse.json({
      assessmentId: assessment.id,
      status: assessment.status,
      isRetake: assessment.isRetake,
      answers,
    })
  } catch (error) {
    console.error('[api/pos/session] failed', error)
    return NextResponse.json(
      { error: 'Session error', detail: process.env.NODE_ENV === 'production' ? undefined : String(error) },
      { status: 500 }
    )
  }
}
