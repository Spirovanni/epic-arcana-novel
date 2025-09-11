import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { assessments, users, assessmentAnswers, userAssessmentResults } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import assessmentData from '@/data/personality-assessment-cleaned.json';

interface BigFiveScores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

interface PlayerTypeScore {
  playerType: string;
  score: number;
}

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { assessmentId } = body;

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

    if (assessment[0].status !== 'completed') {
      return NextResponse.json({ error: 'Assessment not completed' }, { status: 400 });
    }

    // Get all answers for this assessment
    const answers = await db.select()
      .from(assessmentAnswers)
      .where(eq(assessmentAnswers.assessmentId, assessmentId));

    // Calculate Big Five scores
    const bigFiveScores: BigFiveScores = {
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      agreeableness: 0,
      neuroticism: 0
    };

    // Calculate player type scores
    const playerTypeScores: { [key: string]: number } = {};

    // Process each answer
    for (const answer of answers) {
      const scoringData = answer.scoringData as any;
      
      // Add to Big Five scores
      if (scoringData.openness) bigFiveScores.openness += scoringData.openness;
      if (scoringData.conscientiousness) bigFiveScores.conscientiousness += scoringData.conscientiousness;
      if (scoringData.extraversion) bigFiveScores.extraversion += scoringData.extraversion;
      if (scoringData.agreeableness) bigFiveScores.agreeableness += scoringData.agreeableness;
      if (scoringData.neuroticism) bigFiveScores.neuroticism += scoringData.neuroticism;

      // Add to player type scores
      if (scoringData.playerType && Array.isArray(scoringData.playerType)) {
        for (const playerType of scoringData.playerType) {
          playerTypeScores[playerType] = (playerTypeScores[playerType] || 0) + 1;
        }
      }
    }

    // Normalize Big Five scores (convert to 0-100 scale)
    const totalQuestions = answers.length;
    const normalizedBigFive: BigFiveScores = {
      openness: Math.max(0, Math.min(100, ((bigFiveScores.openness / totalQuestions) + 3) * 12.5)),
      conscientiousness: Math.max(0, Math.min(100, ((bigFiveScores.conscientiousness / totalQuestions) + 3) * 12.5)),
      extraversion: Math.max(0, Math.min(100, ((bigFiveScores.extraversion / totalQuestions) + 3) * 12.5)),
      agreeableness: Math.max(0, Math.min(100, ((bigFiveScores.agreeableness / totalQuestions) + 3) * 12.5)),
      neuroticism: Math.max(0, Math.min(100, ((bigFiveScores.neuroticism / totalQuestions) + 3) * 12.5))
    };

    // Find primary and secondary player types
    const sortedPlayerTypes = Object.entries(playerTypeScores)
      .sort(([,a], [,b]) => b - a)
      .map(([playerType, score]) => ({ playerType, score }));

    const primaryPlayerType = sortedPlayerTypes[0]?.playerType || 'book1_theAwakening';
    const secondaryPlayerType = sortedPlayerTypes[1]?.playerType || null;

    // Get the personality profile data
    const primaryProfile = assessmentData.playerTypes[primaryPlayerType as keyof typeof assessmentData.playerTypes];
    const secondaryProfile = secondaryPlayerType ? 
      assessmentData.playerTypes[secondaryPlayerType as keyof typeof assessmentData.playerTypes] : null;

    // Calculate Enneagram type based on primary player type
    const enneagramType = primaryProfile?.enneagram?.type || 9;

    // Calculate color cycle position (1-360 days)
    const colorCyclePosition = Math.floor(Math.random() * 360) + 1;

    // Create comprehensive personality profile
    const personalityProfile = {
      primaryPlayerType: {
        id: primaryPlayerType,
        ...primaryProfile
      },
      secondaryPlayerType: secondaryPlayerType ? {
        id: secondaryPlayerType,
        ...secondaryProfile
      } : null,
      bigFiveScores: normalizedBigFive,
      enneagram: {
        type: enneagramType,
        ...primaryProfile?.enneagram
      },
      colorCyclePosition,
      trionfiCard: primaryProfile?.trionfiCard || 'The Fool',
      heroJourneyStage: primaryProfile?.heroJourneyStage || 'The Ordinary World',
      assessmentMetadata: {
        totalQuestions: totalQuestions,
        completedAt: new Date().toISOString(),
        primaryScore: sortedPlayerTypes[0]?.score || 0,
        secondaryScore: sortedPlayerTypes[1]?.score || 0
      }
    };

    // Save results to database
    const result = await db.insert(userAssessmentResults).values({
      userId: dbUser[0].id,
      assessmentId,
      primaryPlayerType,
      secondaryPlayerType,
      bigFiveScores: normalizedBigFive,
      enneagramType,
      heroJourneyStage: primaryProfile?.heroJourneyStage || 'The Ordinary World',
      colorCyclePosition,
      trionfiCard: primaryProfile?.trionfiCard || 'The Fool',
      personalityProfile
    }).returning();

    return NextResponse.json({
      success: true,
      resultId: result[0].id,
      personalityProfile,
      message: 'Assessment results calculated successfully'
    });

  } catch (error) {
    console.error('Calculate results error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate assessment results' },
      { status: 500 }
    );
  }
}
