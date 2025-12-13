import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { assessments, users, assessmentAnswers, assessmentAnswersV2, assessmentSessionsV2 } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import assessmentData from '@/data/personality-assessment-cleaned.json';
import { ensureDbUser } from '@/lib/server/users';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // New v2 flow: per-question upsert against assessment session
    if (body?.sessionId && body?.questionKey) {
      const dbUser = await ensureDbUser()
      if (!dbUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const { sessionId, questionKey, value, answerType } = body as { sessionId: string; questionKey: string; value: unknown; answerType?: string }

      const session = await db.select().from(assessmentSessionsV2)
        .where(and(eq(assessmentSessionsV2.id, sessionId), eq(assessmentSessionsV2.userId, dbUser.id)))
        .limit(1)

      if (!session.length) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 })
      }

      const now = new Date().toISOString()

      await db.insert(assessmentAnswersV2).values({
        sessionId,
        questionKey,
        value,
        answerType: answerType || 'likert',
        answeredAt: now,
        updatedAt: now,
      }).onConflictDoUpdate({
        target: [assessmentAnswersV2.sessionId, assessmentAnswersV2.questionKey],
        set: {
          value,
          answerType: answerType || 'likert',
          updatedAt: now,
          answeredAt: now
        }
      })

      return NextResponse.json({ ok: true, savedAt: now })
    }

    // Legacy flow fallback
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { assessmentId, questionId, selectedOptionIndex, selectedOptionText } = body;

    if (!assessmentId || !questionId || selectedOptionIndex === undefined || !selectedOptionText) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify user owns this assessment
    const dbUser = await db.select().from(users).where(eq(users.clerkId, user.id)).limit(1);
    if (dbUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const assessment = await db.select()
      .from(assessments)
      .where(and(
        eq(assessments.id, assessmentId),
        eq(assessments.userId, dbUser[0].id)
      ))
      .limit(1);

    if (assessment.length === 0) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    // Get the question data to extract scoring information
    const questions = assessmentData.assessmentQuestions.situationalScenarios;
    const question = questions.find(q => q.id === questionId);
    
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const selectedOption = question.options[selectedOptionIndex];
    if (!selectedOption) {
      return NextResponse.json({ error: 'Invalid option selected' }, { status: 400 });
    }

    // Save the answer
    await db.insert(assessmentAnswers).values({
      assessmentId,
      questionId,
      selectedOptionIndex,
      selectedOptionText,
      scoringData: selectedOption.scoring
    });

    // Update assessment progress
    const nextQuestionIndex = assessment[0].currentQuestionIndex + 1;
    const isComplete = nextQuestionIndex >= assessment[0].totalQuestions;

    await db.update(assessments)
      .set({
        currentQuestionIndex: nextQuestionIndex,
        status: isComplete ? 'completed' : 'in_progress',
        completedAt: isComplete ? new Date() : null,
        updatedAt: new Date()
      })
      .where(eq(assessments.id, assessmentId));

    return NextResponse.json({
      success: true,
      nextQuestionIndex,
      isComplete,
      totalQuestions: assessment[0].totalQuestions
    });

  } catch (error) {
    console.error('Answer submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit answer' },
      { status: 500 }
    );
  }
}
