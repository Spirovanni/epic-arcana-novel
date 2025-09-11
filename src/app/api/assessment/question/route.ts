import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { assessments, users } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import assessmentData from '@/data/personality-assessment-cleaned.json';

export async function GET(request: Request) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const assessmentId = searchParams.get('assessmentId');
    const questionIndex = parseInt(searchParams.get('questionIndex') || '0');

    if (!assessmentId) {
      return NextResponse.json({ error: 'Assessment ID required' }, { status: 400 });
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

    // Get the question data
    const questions = assessmentData.assessmentQuestions.situationalScenarios;
    const currentQuestion = questions[questionIndex];

    if (!currentQuestion) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json({
      questionId: currentQuestion.id,
      questionText: currentQuestion.scenario,
      options: currentQuestion.options.map((option, index) => ({
        index,
        text: option.text,
        scoring: option.scoring
      })),
      questionIndex,
      totalQuestions: questions.length,
      category: currentQuestion.category
    });

  } catch (error) {
    console.error('Get question error:', error);
    return NextResponse.json(
      { error: 'Failed to get question' },
      { status: 500 }
    );
  }
}
