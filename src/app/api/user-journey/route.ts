import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { userJourneys, userCalendarAssignments, assignmentTemplates, users, userAssessmentResults } from '@/lib/schema';
import { eq, and, desc } from 'drizzle-orm';
import { resolveHfCalendar } from '@/lib/hfCalendar';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { journeyStartDate, assessmentResultId } = body;

    if (!journeyStartDate || !assessmentResultId) {
      return NextResponse.json(
        { error: 'Journey start date and assessment result ID are required' },
        { status: 400 }
      );
    }

    // Find user in database
    const user = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);
    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's assessment result
    const assessmentResult = await db.select()
      .from(userAssessmentResults)
      .where(and(
        eq(userAssessmentResults.userId, user[0].id),
        eq(userAssessmentResults.id, assessmentResultId)
      ))
      .limit(1);

    if (assessmentResult.length === 0) {
      return NextResponse.json({ error: 'Assessment result not found' }, { status: 404 });
    }

    const startDate = new Date(journeyStartDate);
    const calendarYear = startDate.getFullYear();

    // Check if user already has a journey for this year
    const existingJourney = await db.select()
      .from(userJourneys)
      .where(and(
        eq(userJourneys.userId, user[0].id),
        eq(userJourneys.calendarYear, calendarYear)
      ))
      .limit(1);

    let journeyId: string;

    if (existingJourney.length > 0) {
      // Update existing journey
      await db.update(userJourneys)
        .set({
          journeyStartDate: startDate,
          isActive: true,
          updatedAt: new Date()
        })
        .where(eq(userJourneys.id, existingJourney[0].id));
      
      journeyId = existingJourney[0].id;
    } else {
      // Create new journey
      const newJourney = await db.insert(userJourneys).values({
        userId: user[0].id,
        assessmentResultId: assessmentResultId,
        journeyStartDate: startDate,
        calendarYear: calendarYear,
        currentDay: 1,
        isActive: true
      }).returning({ id: userJourneys.id });

      journeyId = newJourney[0].id;
    }

    // Generate assignments for all 365 days
    await generateUserAssignments(journeyId, startDate, assessmentResult[0]);

    return NextResponse.json({
      success: true,
      journeyId: journeyId,
      message: 'Journey initialized successfully'
    });

  } catch (error) {
    console.error('Error initializing user journey:', error);
    return NextResponse.json(
      { error: 'Failed to initialize journey' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find user in database
    const user = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);
    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's active journey
    const activeJourney = await db.select()
      .from(userJourneys)
      .where(and(
        eq(userJourneys.userId, user[0].id),
        eq(userJourneys.isActive, true)
      ))
      .orderBy(desc(userJourneys.createdAt))
      .limit(1);

    if (activeJourney.length === 0) {
      return NextResponse.json({ 
        journey: null,
        message: 'No active journey found'
      });
    }

    return NextResponse.json({
      journey: activeJourney[0]
    });

  } catch (error) {
    console.error('Error fetching user journey:', error);
    return NextResponse.json(
      { error: 'Failed to fetch journey' },
      { status: 500 }
    );
  }
}

async function generateUserAssignments(
  journeyId: string, 
  startDate: Date, 
  assessmentResult: any
) {
  const assignments = [];
  const personalityType = assessmentResult.personalityProfile?.display_name || 'Explorer';
  const enneagramType = assessmentResult.enneagramType;

  // Generate assignments for exactly 365 days only - no more than first year
  for (let dayOfYear = 1; dayOfYear <= 365; dayOfYear++) {
    const assignmentDate = new Date(startDate);
    assignmentDate.setDate(startDate.getDate() + (dayOfYear - 1));
    
    // Safety check: ensure we never go beyond day 365
    if (dayOfYear > 365) {
      console.warn(`Attempted to create assignment beyond day 365: ${dayOfYear}`);
      break;
    }

    // Get HF Calendar data for this day
    const hfCalendarData = resolveHfCalendar(assignmentDate);
    
    // Check for assignment template for this personality type and day
    let template = await db.select()
      .from(assignmentTemplates)
      .where(and(
        eq(assignmentTemplates.personalityType, personalityType),
        eq(assignmentTemplates.dayOfYear, dayOfYear)
      ))
      .limit(1);

    // Fallback to generic template or generate default
    if (template.length === 0) {
      template = await db.select()
        .from(assignmentTemplates)
        .where(and(
          eq(assignmentTemplates.personalityType, 'Universal'),
          eq(assignmentTemplates.dayOfYear, dayOfYear)
        ))
        .limit(1);
    }

    let assignmentData;
    if (template.length > 0) {
      assignmentData = template[0];
    } else {
      // Generate default assignment
      assignmentData = generateDefaultAssignment(dayOfYear, hfCalendarData, personalityType);
    }

    assignments.push({
      userJourneyId: journeyId,
      dayOfYear: dayOfYear,
      assignmentDate: assignmentDate,
      title: assignmentData.title,
      description: assignmentData.description,
      dailyTheme: assignmentData.dailyTheme,
      personalityFocus: assignmentData.personalityFocus,
      reflectionPrompt: assignmentData.reflectionPrompt,
      practiceExercise: assignmentData.practiceExercise,
      journalPrompt: assignmentData.journalPrompt,
      actionItem: assignmentData.actionItem,
      bookChapter: assignmentData.bookChapter,
      chapterFocus: assignmentData.chapterFocus
    });
  }

  // Delete existing assignments for this journey
  await db.delete(userCalendarAssignments)
    .where(eq(userCalendarAssignments.userJourneyId, journeyId));

  // Insert new assignments in batches
  const batchSize = 50;
  for (let i = 0; i < assignments.length; i += batchSize) {
    const batch = assignments.slice(i, i + batchSize);
    await db.insert(userCalendarAssignments).values(batch);
  }
}

function generateDefaultAssignment(dayOfYear: number, hfCalendarData: any, personalityType: string) {
  const segment = hfCalendarData.segment;
  const daySign = hfCalendarData.daySign || { name: 'Explorer', theme: 'Discovery' };
  
  return {
    title: `Day ${dayOfYear}: ${daySign.name} Wisdom`,
    description: `Explore the ${daySign.theme || 'wisdom'} archetype as a ${personalityType}. Today's focus is on ${segment.name} energy.`,
    dailyTheme: daySign.theme || 'Personal Growth',
    personalityFocus: `${personalityType} development through ${segment.name} practices`,
    reflectionPrompt: `How does the ${daySign.name} archetype resonate with your ${personalityType} nature? What wisdom can you draw from this combination?`,
    practiceExercise: `Spend 10 minutes embodying the ${daySign.name} energy in your daily interactions. Notice how this influences your natural ${personalityType} tendencies.`,
    journalPrompt: `Write about a time when you demonstrated ${daySign.theme || 'wisdom'}. How did this align with or challenge your ${personalityType} characteristics?`,
    actionItem: `Take one concrete action today that combines ${daySign.name} wisdom with your ${personalityType} strengths.`,
    bookChapter: `Book 1, Chapter ${Math.ceil(dayOfYear / 15)}`,
    chapterFocus: `${segment.name} journey and ${daySign.name} teachings`
  };
}