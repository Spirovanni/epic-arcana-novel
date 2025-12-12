import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { assessments, assessmentAnswers, users } from '@/lib/schema'
import { and, desc, eq, sql } from 'drizzle-orm'
import { getForcedChoiceItems } from '@/lib/items/forced'
import { getLikertItems } from '@/lib/items/likert'

type ProgressAnswer =
  | { type: 'forced'; itemId: string; best: number; worst: number }
  | { type: 'likert'; itemId: string; rating: number }

async function ensureDbUser() {
  const user = await currentUser()
  if (!user) return null

  const existing = await db.select().from(users).where(eq(users.clerkId, user.id)).limit(1)
  if (existing.length > 0) return existing[0]

  const created = await db.insert(users).values({
    clerkId: user.id,
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
    firstName: user.firstName || 'User',
    lastName: user.lastName || '',
    email: user.emailAddresses[0]?.emailAddress || '',
    age: 25
  }).returning()

  return created[0]
}

function getTotalQuestions() {
  return getForcedChoiceItems().length + getLikertItems().length
}

async function ensureAssessment(userId: number, totalQuestions: number, providedId?: string) {
  if (providedId) {
    const [row] = await db.select().from(assessments).where(and(
      eq(assessments.id, providedId),
      eq(assessments.userId, userId)
    )).limit(1)
    if (row) return row
  }

  const [inProgress] = await db.select().from(assessments)
    .where(and(
      eq(assessments.userId, userId),
      eq(assessments.status, 'in_progress')
    ))
    .limit(1)

  if (inProgress) return inProgress

  const [created] = await db.insert(assessments).values({
    userId,
    status: 'in_progress',
    currentQuestionIndex: 0,
    totalQuestions
  }).returning()

  return created
}

export async function POST(request: Request) {
  try {
    const dbUser = await ensureDbUser()
    if (!dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const { assessmentId: providedAssessmentId, answer } = body as { assessmentId?: string; answer?: ProgressAnswer }

    const totalQuestions = getTotalQuestions()
    const assessment = await ensureAssessment(dbUser.id, totalQuestions, providedAssessmentId)

    // If no answer supplied, just return the current session
    if (!answer) {
      return NextResponse.json({
        assessmentId: assessment.id,
        currentQuestionIndex: assessment.currentQuestionIndex,
        totalQuestions: assessment.totalQuestions
      })
    }

    if (!answer.itemId || !answer.type) {
      return NextResponse.json({ error: 'Invalid answer payload' }, { status: 400 })
    }

    let selectedOptionIndex: number
    let selectedOptionText: string
    let scoringData: Record<string, unknown>

    if (answer.type === 'forced') {
      if (answer.best === undefined || answer.worst === undefined) {
        return NextResponse.json({ error: 'Forced choice answer requires best and worst selections' }, { status: 400 })
      }
      selectedOptionIndex = answer.best
      selectedOptionText = 'forced_choice'
      scoringData = { type: 'forced_choice', best: answer.best, worst: answer.worst }
    } else {
      if (answer.rating === undefined) {
        return NextResponse.json({ error: 'Likert answer requires rating' }, { status: 400 })
      }
      selectedOptionIndex = answer.rating
      selectedOptionText = 'likert'
      scoringData = { type: 'likert', rating: answer.rating }
    }

    // Replace any existing answer for this question
    await db.delete(assessmentAnswers)
      .where(and(
        eq(assessmentAnswers.assessmentId, assessment.id),
        eq(assessmentAnswers.questionId, answer.itemId)
      ))

    await db.insert(assessmentAnswers).values({
      assessmentId: assessment.id,
      questionId: answer.itemId,
      selectedOptionIndex,
      selectedOptionText,
      scoringData
    })

    const [{ count }] = await db.select({
      count: sql<number>`count(distinct ${assessmentAnswers.questionId})`
    })
      .from(assessmentAnswers)
      .where(eq(assessmentAnswers.assessmentId, assessment.id))

    const answeredCount = Number(count) || 0
    const isComplete = answeredCount >= totalQuestions

    await db.update(assessments)
      .set({
        currentQuestionIndex: answeredCount,
        status: isComplete ? 'completed' : 'in_progress',
        updatedAt: new Date(),
        completedAt: isComplete ? new Date() : null
      })
      .where(eq(assessments.id, assessment.id))

    return NextResponse.json({
      assessmentId: assessment.id,
      currentQuestionIndex: answeredCount,
      totalQuestions,
      status: isComplete ? 'completed' : 'in_progress'
    })
  } catch (error) {
    console.error('Progress save error:', error)
    return NextResponse.json(
      { error: 'Failed to save assessment progress' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const dbUser = await ensureDbUser()
    if (!dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [latestAssessment] = await db.select()
      .from(assessments)
      .where(eq(assessments.userId, dbUser.id))
      .orderBy(desc(assessments.updatedAt))
      .limit(1)

    if (!latestAssessment) {
      return NextResponse.json({ error: 'No assessment found' }, { status: 404 })
    }

    const rawAnswers = await db.select({
      questionId: assessmentAnswers.questionId,
      selectedOptionIndex: assessmentAnswers.selectedOptionIndex,
      selectedOptionText: assessmentAnswers.selectedOptionText,
      scoringData: assessmentAnswers.scoringData
    })
      .from(assessmentAnswers)
      .where(eq(assessmentAnswers.assessmentId, latestAssessment.id))

    const forced: Array<{ itemId: string; best: number; worst: number }> = []
    const likert: Array<{ itemId: string; rating: number }> = []

    for (const answer of rawAnswers) {
      const scoringData = (answer.scoringData || {}) as Record<string, unknown>
      const type = scoringData.type || answer.selectedOptionText

      if (type === 'forced_choice') {
        const best = Number(scoringData.best ?? answer.selectedOptionIndex)
        const worst = Number(scoringData.worst)
        if (Number.isFinite(best) && Number.isFinite(worst)) {
          forced.push({ itemId: answer.questionId, best, worst })
        }
      } else {
        const rating = Number(scoringData.rating ?? answer.selectedOptionIndex)
        if (Number.isFinite(rating)) {
          likert.push({ itemId: answer.questionId, rating })
        }
      }
    }

    const answeredCount = forced.length + likert.length
    const totalQuestions = latestAssessment.totalQuestions || getTotalQuestions()

    return NextResponse.json({
      assessmentId: latestAssessment.id,
      currentQuestionIndex: latestAssessment.currentQuestionIndex ?? answeredCount,
      totalQuestions,
      answers: {
        forced,
        likert
      }
    })
  } catch (error) {
    console.error('Progress load error:', error)
    return NextResponse.json(
      { error: 'Failed to load assessment progress' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const dbUser = await ensureDbUser()
    if (!dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const { assessmentId: providedAssessmentId } = body as { assessmentId?: string }

    let assessmentToDelete = null

    if (providedAssessmentId) {
      const [row] = await db.select().from(assessments)
        .where(and(
          eq(assessments.id, providedAssessmentId),
          eq(assessments.userId, dbUser.id)
        ))
        .limit(1)
      assessmentToDelete = row || null
    } else {
      const [row] = await db.select().from(assessments)
        .where(eq(assessments.userId, dbUser.id))
        .limit(1)
      assessmentToDelete = row || null
    }

    if (!assessmentToDelete) {
      return NextResponse.json({ success: true })
    }

    await db.delete(assessmentAnswers).where(eq(assessmentAnswers.assessmentId, assessmentToDelete.id))
    await db.delete(assessments).where(eq(assessments.id, assessmentToDelete.id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Assessment reset error:', error)
    return NextResponse.json(
      { error: 'Failed to reset assessment' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const dbUser = await ensureDbUser()
    if (!dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [assessment] = await db.select().from(assessments)
      .where(eq(assessments.userId, dbUser.id))
      .limit(1)

    if (!assessment) {
      return NextResponse.json({ error: 'No assessment found' }, { status: 404 })
    }

    const answers = await db.select().from(assessmentAnswers)
      .where(eq(assessmentAnswers.assessmentId, assessment.id))

    const forced: { itemId: string; best: number; worst: number }[] = []
    const likert: { itemId: string; rating: number }[] = []

    for (const ans of answers) {
      const data = (ans.scoringData as any) || {}
      if (data.type === 'forced') {
        forced.push({
          itemId: ans.questionId,
          best: typeof data.best === 'number' ? data.best : ans.selectedOptionIndex,
          worst: typeof data.worst === 'number' ? data.worst : 0
        })
      } else {
        likert.push({
          itemId: ans.questionId,
          rating: typeof data.rating === 'number' ? data.rating : ans.selectedOptionIndex
        })
      }
    }

    return NextResponse.json({
      assessmentId: assessment.id,
      answers: { forced, likert },
      currentQuestionIndex: assessment.currentQuestionIndex,
      totalQuestions: assessment.totalQuestions
    })
  } catch (error) {
    console.error('Progress load error:', error)
    return NextResponse.json(
      { error: 'Failed to load assessment progress' },
      { status: 500 }
    )
  }
}
