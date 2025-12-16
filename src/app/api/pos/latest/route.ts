import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { posAssessmentResults, posAssessments } from '@/lib/schema'
import { and, desc, eq } from 'drizzle-orm'
import { ensureAppUser } from '@/lib/server/users'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await ensureAppUser()
    if (!dbUser) {
      return NextResponse.json({ error: 'User record missing' }, { status: 401 })
    }

    const latestCompleted = await db
      .select({
        assessmentId: posAssessments.id,
        completedAt: posAssessments.completedAt,
        domainScores: posAssessmentResults.domainScores,
        facetScores: posAssessmentResults.facetScores,
        insights: posAssessmentResults.insights,
      })
      .from(posAssessments)
      .innerJoin(posAssessmentResults, eq(posAssessmentResults.assessmentId, posAssessments.id))
      .where(
        and(
          eq(posAssessments.userId, dbUser.id),
          eq(posAssessments.assessmentKey, 'pos60'),
          eq(posAssessments.version, 'v1'),
          eq(posAssessments.status, 'completed')
        )
      )
      .orderBy(desc(posAssessments.completedAt))
      .limit(1)

    const inProgress = await db
      .select({
        assessmentId: posAssessments.id,
        status: posAssessments.status,
        startedAt: posAssessments.startedAt,
      })
      .from(posAssessments)
      .where(
        and(
          eq(posAssessments.userId, dbUser.id),
          eq(posAssessments.assessmentKey, 'pos60'),
          eq(posAssessments.version, 'v1'),
          eq(posAssessments.status, 'in_progress')
        )
      )
      .orderBy(desc(posAssessments.startedAt))
      .limit(1)

    return NextResponse.json({
      latest: latestCompleted[0] || null,
      inProgress: inProgress[0] || null,
    })
  } catch (error) {
    console.error('[api/pos/latest] failed', error)
    return NextResponse.json(
      { error: 'Latest results error', detail: process.env.NODE_ENV === 'production' ? undefined : String(error) },
      { status: 500 }
    )
  }
}
