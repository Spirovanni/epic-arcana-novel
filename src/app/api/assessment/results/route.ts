import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { users, userAssessmentResults, assessmentSessionsV2, assessmentResultsV2 } from '@/lib/schema';
import { eq, desc, and } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const assessmentId = searchParams.get('assessmentId');

    // Verify user exists
    const dbUser = await db.select().from(users).where(eq(users.clerkId, user.id)).limit(1);
    if (dbUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let results;

    if (assessmentId) {
      // Get specific assessment result
      results = await db.select()
        .from(userAssessmentResults)
        .where(eq(userAssessmentResults.assessmentId, assessmentId))
        .limit(1);
    } else {
      // Get user's latest assessment result from legacy table
      results = await db.select()
        .from(userAssessmentResults)
        .where(eq(userAssessmentResults.userId, dbUser[0].id))
        .orderBy(desc(userAssessmentResults.completedAt))
        .limit(1);
    }

    // Fallback to V2 assessment results if no legacy results found
    if (results.length === 0) {
      const v2Sessions = await db.select()
        .from(assessmentSessionsV2)
        .where(and(
          eq(assessmentSessionsV2.userId, dbUser[0].id),
          eq(assessmentSessionsV2.status, 'completed')
        ))
        .orderBy(desc(assessmentSessionsV2.completedAt))
        .limit(1);

      if (v2Sessions.length > 0) {
        const v2Results = await db.select()
          .from(assessmentResultsV2)
          .where(eq(assessmentResultsV2.sessionId, v2Sessions[0].id))
          .limit(1);

        if (v2Results.length > 0) {
          const resultData = v2Results[0].result as Record<string, any>;
          return NextResponse.json({
            success: true,
            result: {
              id: v2Sessions[0].id,
              primaryPlayerType: resultData?.profile?.display_name || 'Explorer',
              secondaryPlayerType: resultData?.profile?.family || null,
              bigFiveScores: resultData?.dimensions || {},
              enneagramType: resultData?.dominant_type || null,
              heroJourneyStage: resultData?.profile?.theme || 'The Journey Begins',
              colorCyclePosition: resultData?.chapter || 1,
              trionfiCard: resultData?.profile?.id || null,
              personalityProfile: resultData,
              completedAt: v2Sessions[0].completedAt
            }
          });
        }
      }
      return NextResponse.json({ error: 'No assessment results found' }, { status: 404 });
    }

    const result = results[0];

    return NextResponse.json({
      success: true,
      result: {
        id: result.id,
        primaryPlayerType: result.primaryPlayerType,
        secondaryPlayerType: result.secondaryPlayerType,
        bigFiveScores: result.bigFiveScores,
        enneagramType: result.enneagramType,
        heroJourneyStage: result.heroJourneyStage,
        colorCyclePosition: result.colorCyclePosition,
        trionfiCard: result.trionfiCard,
        personalityProfile: result.personalityProfile,
        completedAt: result.completedAt
      }
    });

  } catch (error) {
    console.error('Get results error:', error);
    return NextResponse.json(
      { error: 'Failed to get assessment results' },
      { status: 500 }
    );
  }
}
