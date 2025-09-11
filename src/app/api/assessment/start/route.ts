import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { assessments, users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import assessmentData from '@/data/personality-assessment-cleaned.json';

export async function POST() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find or create user in our database
    let dbUser = await db.select().from(users).where(eq(users.clerkId, user.id)).limit(1);
    
    if (dbUser.length === 0) {
      // Create user if they don't exist
      const newUser = await db.insert(users).values({
        clerkId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.emailAddresses[0]?.emailAddress || '',
        age: 25, // Default age, could be collected later
      }).returning();
      dbUser = newUser;
    }

    // Check if user has an active assessment
    const existingAssessment = await db.select()
      .from(assessments)
      .where(eq(assessments.userId, dbUser[0].id))
      .limit(1);

    if (existingAssessment.length > 0 && existingAssessment[0].status === 'in_progress') {
      return NextResponse.json({
        assessmentId: existingAssessment[0].id,
        currentQuestionIndex: existingAssessment[0].currentQuestionIndex,
        totalQuestions: existingAssessment[0].totalQuestions,
        status: existingAssessment[0].status
      });
    }

    // Create new assessment
    const totalQuestions = assessmentData.assessmentQuestions.situationalScenarios.length;
    const newAssessment = await db.insert(assessments).values({
      userId: dbUser[0].id,
      status: 'in_progress',
      currentQuestionIndex: 0,
      totalQuestions,
    }).returning();

    return NextResponse.json({
      assessmentId: newAssessment[0].id,
      currentQuestionIndex: 0,
      totalQuestions,
      status: 'in_progress'
    });

  } catch (error) {
    console.error('Assessment start error:', error);
    return NextResponse.json(
      { error: 'Failed to start assessment' },
      { status: 500 }
    );
  }
}
