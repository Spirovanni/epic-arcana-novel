import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { AssessmentResultSchema } from '@/lib/assessment/types'
import { createResultId } from '@/lib/ids'
import { db } from '@/lib/db'
import { users, userAssessmentResults, userJourneys, userCalendarAssignments, assignmentTemplates } from '@/lib/schema'
import { eq, and, desc } from 'drizzle-orm'
import { resolveHfCalendar } from '@/lib/hfCalendar'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the input
    const result = AssessmentResultSchema.parse(body)
    const { journeyStartDate, ...assessmentResult } = body
    
    // Check auth status
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required to save assessment' },
        { status: 401 }
      )
    }

    // Generate a unique result ID
    const resultId = createResultId()
    
    // Try to save to database first, fall back to file system
    const useDatabaseStorage = !!process.env.DATABASE_URL
    
    if (useDatabaseStorage) {
      try {
        const savedResultId = await saveToDatabase(resultId, assessmentResult, userId, journeyStartDate)
        return NextResponse.json({ resultId: savedResultId })
      } catch (dbError) {
        console.error('Database save failed, falling back to file system:', dbError)
        // Fall through to file system save
      }
    }
    
    // Fallback to file system storage
    await saveToLocalFile(resultId, assessmentResult, userId)
    return NextResponse.json({ resultId })
    
  } catch (error) {
    console.error('Error saving assessment result:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid result data', details: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to save assessment result' },
      { status: 500 }
    )
  }
}

async function saveToDatabase(resultId: string, result: any, userId: string, journeyStartDate?: string) {
  // Find or create user
  let user = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);
  
  if (user.length === 0) {
    // Create user if doesn't exist (this might need more user data)
    const newUser = await db.insert(users).values({
      clerkId: userId,
      name: 'User', // You might want to get this from Clerk
      firstName: 'User',
      lastName: '',
      age: 25, // Default values - you might want to collect this during assessment
      email: `${userId}@temp.email` // Placeholder - get from Clerk
    }).returning();
    
    user = newUser;
  }

  // Check if user already has an assessment result
  const existingResult = await db.select()
    .from(userAssessmentResults)
    .where(eq(userAssessmentResults.userId, user[0].id))
    .limit(1);

  let assessmentResultId: string;

  if (existingResult.length > 0) {
    // Update existing result
    await db.update(userAssessmentResults)
      .set({
        primaryPlayerType: result.profile?.display_name || 'Explorer',
        secondaryPlayerType: result.profile?.family || null,
        bigFiveScores: result.bigFive || {},
        enneagramType: result.dominant_type || null,
        personalityProfile: result,
        completedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(userAssessmentResults.id, existingResult[0].id));
    
    assessmentResultId = existingResult[0].id;
  } else {
    // Create new result
    const newResult = await db.insert(userAssessmentResults).values({
      userId: user[0].id,
      assessmentId: resultId, // You might need to create an assessment record first
      primaryPlayerType: result.profile?.display_name || 'Explorer',
      secondaryPlayerType: result.profile?.family || null,
      bigFiveScores: result.bigFive || {},
      enneagramType: result.dominant_type || null,
      personalityProfile: result,
      completedAt: new Date()
    }).returning({ id: userAssessmentResults.id });
    
    assessmentResultId = newResult[0].id;
  }

  // Initialize user journey if journeyStartDate is provided
  if (journeyStartDate) {
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
          assessmentResultId: assessmentResultId,
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

    // Generate assignments for the journey
    await generateUserAssignments(journeyId, startDate, result);
  }

  return resultId;
}

async function generateUserAssignments(journeyId: string, startDate: Date, assessmentResult: any) {
  const assignments = [];
  const personalityType = assessmentResult.profile?.display_name || 'Explorer';

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

    // Fallback to universal template
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

async function saveToLocalFile(resultId: string, result: unknown, userId: string | null) {
  const dataDir = path.join(process.cwd(), 'data')
  const resultsFile = path.join(dataDir, '_local_results.json')
  
  // Ensure data directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  
  // Load existing results
  let existingResults: Record<string, unknown> = {}
  try {
    if (fs.existsSync(resultsFile)) {
      const fileContent = fs.readFileSync(resultsFile, 'utf-8')
      existingResults = JSON.parse(fileContent)
    }
  } catch {
    console.warn('Could not load existing results, starting fresh')
  }
  
  // Remove any previous result for this user (for retake functionality)
  if (userId) {
    const previousResultId = Object.keys(existingResults).find(id => 
      (existingResults[id] as any)?.userId === userId
    )
    if (previousResultId) {
      delete existingResults[previousResultId]
    }
  }
  
  // Add the new result
  existingResults[resultId] = {
    ...(result as Record<string, unknown>),
    userId,
    savedAt: new Date().toISOString(),
    resultId
  }
  
  // Save back to file
  fs.writeFileSync(resultsFile, JSON.stringify(existingResults, null, 2))
}

async function checkExistingResult(userId: string) {
  const dataDir = path.join(process.cwd(), 'data')
  const resultsFile = path.join(dataDir, '_local_results.json')
  
  try {
    if (!fs.existsSync(resultsFile)) {
      return null
    }
    
    const fileContent = fs.readFileSync(resultsFile, 'utf-8')
    const existingResults: Record<string, any> = JSON.parse(fileContent)
    
    // Find the result for this user
    const userResult = Object.values(existingResults).find(
      result => result.userId === userId
    )
    
    return userResult || null
    
  } catch (error) {
    console.error('Error checking existing results:', error)
    return null
  }
}