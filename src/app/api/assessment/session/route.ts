import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { assessmentAnswersV2, assessmentSessionsV2 } from '@/lib/schema'
import { ensureDbUser } from '@/lib/server/users'
import { and, desc, eq } from 'drizzle-orm'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type AnswerMap = Record<string, { answerType?: string; value: unknown; updatedAt?: string }>

function mapAnswers(rows: Array<{ questionKey: string; answerType: string; value: unknown; updatedAt: string; answeredAt: string }>): AnswerMap {
  return rows.reduce((acc, row) => {
    acc[row.questionKey] = {
      answerType: row.answerType,
      value: row.value,
      updatedAt: row.updatedAt || row.answeredAt
    }
    return acc
  }, {} as AnswerMap)
}

export async function GET(req: NextRequest) {
  try {
    const dbUser = await ensureDbUser()
    if (!dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const retake = req.nextUrl.searchParams.get('retake') === 'true'

    const inProgress = retake
      ? null
      : await db.select().from(assessmentSessionsV2)
          .where(and(eq(assessmentSessionsV2.userId, dbUser.id), eq(assessmentSessionsV2.status, 'in_progress')))
          .orderBy(desc(assessmentSessionsV2.startedAt))
          .limit(1)

    const session = inProgress && inProgress[0]
      ? inProgress[0]
      : (await db.insert(assessmentSessionsV2).values({
          userId: dbUser.id,
          status: 'in_progress',
          isRetake: retake,
          startedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }).returning())[0]

    const answerRows = await db.select({
      questionKey: assessmentAnswersV2.questionKey,
      answerType: assessmentAnswersV2.answerType,
      value: assessmentAnswersV2.value,
      updatedAt: assessmentAnswersV2.updatedAt,
      answeredAt: assessmentAnswersV2.answeredAt
    })
      .from(assessmentAnswersV2)
      .where(eq(assessmentAnswersV2.sessionId, session.id))

    return NextResponse.json({
      sessionId: session.id,
      status: session.status,
      isRetake: session.isRetake,
      startedAt: session.startedAt,
      answers: mapAnswers(answerRows)
    })
  } catch (error) {
    console.error('[api/assessment/session] failed', error)
    return NextResponse.json({ error: 'Session error', detail: process.env.NODE_ENV === 'production' ? undefined : String(error) }, { status: 500 })
  }
}
