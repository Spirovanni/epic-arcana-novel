import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { assessments, users, assessmentAnswers } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import assessmentData from '@/data/personality-assessment-cleaned.json';

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
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
        completedAt: isComplete ? new Date().toISOString() : undefined,
        updatedAt: new Date().toISOString()
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
