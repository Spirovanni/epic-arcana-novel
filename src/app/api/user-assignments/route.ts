import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { userJourneys, userCalendarAssignments, users } from '@/lib/schema';
import { eq, and, gte, lte, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date'); // ISO date string
    const dayOfYear = searchParams.get('dayOfYear'); // 1-365
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

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
        assignments: [],
        message: 'No active journey found'
      });
    }

    const journey = activeJourney[0];

    // Build query based on parameters
    let query = db.select()
      .from(userCalendarAssignments)
      .where(eq(userCalendarAssignments.userJourneyId, journey.id));

    if (date) {
      // Get assignment for specific date
      const targetDate = new Date(date);
      query = query.where(
        and(
          eq(userCalendarAssignments.userJourneyId, journey.id),
          eq(userCalendarAssignments.assignmentDate, targetDate)
        )
      );
    } else if (dayOfYear) {
      // Get assignment for specific day of year
      query = query.where(
        and(
          eq(userCalendarAssignments.userJourneyId, journey.id),
          eq(userCalendarAssignments.dayOfYear, parseInt(dayOfYear))
        )
      );
    } else if (startDate && endDate) {
      // Get assignments for date range
      const start = new Date(startDate);
      const end = new Date(endDate);
      query = query.where(
        and(
          eq(userCalendarAssignments.userJourneyId, journey.id),
          gte(userCalendarAssignments.assignmentDate, start),
          lte(userCalendarAssignments.assignmentDate, end)
        )
      );
    } else {
      // Get today's assignment by default
      const today = new Date();
      const daysSinceStart = Math.floor(
        (today.getTime() - journey.journeyStartDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;
      
      if (daysSinceStart > 0 && daysSinceStart <= 365) {
        query = query.where(
          and(
            eq(userCalendarAssignments.userJourneyId, journey.id),
            eq(userCalendarAssignments.dayOfYear, daysSinceStart)
          )
        );
      } else {
        // Return empty if outside valid range
        return NextResponse.json({ 
          assignments: [],
          journey: journey,
          message: 'No assignments for current date'
        });
      }
    }

    const assignments = await query.orderBy(userCalendarAssignments.dayOfYear);

    return NextResponse.json({
      assignments: assignments,
      journey: journey
    });

  } catch (error) {
    console.error('Error fetching user assignments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assignments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { assignmentId, action, data } = body;

    if (!assignmentId || !action) {
      return NextResponse.json(
        { error: 'Assignment ID and action are required' },
        { status: 400 }
      );
    }

    // Find user in database
    const user = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);
    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify assignment belongs to user
    const assignment = await db.select({
      assignment: userCalendarAssignments,
      journey: userJourneys
    })
    .from(userCalendarAssignments)
    .innerJoin(userJourneys, eq(userCalendarAssignments.userJourneyId, userJourneys.id))
    .where(and(
      eq(userCalendarAssignments.id, assignmentId),
      eq(userJourneys.userId, user[0].id)
    ))
    .limit(1);

    if (assignment.length === 0) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    let updateData: any = { updatedAt: new Date() };

    switch (action) {
      case 'complete':
        updateData.isCompleted = true;
        updateData.completedAt = new Date();
        break;
        
      case 'uncomplete':
        updateData.isCompleted = false;
        updateData.completedAt = null;
        break;
        
      case 'addNotes':
        updateData.userNotes = data.notes;
        break;
        
      case 'rate':
        if (data.rating >= 1 && data.rating <= 5) {
          updateData.userRating = data.rating;
        }
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await db.update(userCalendarAssignments)
      .set(updateData)
      .where(eq(userCalendarAssignments.id, assignmentId));

    return NextResponse.json({
      success: true,
      message: `Assignment ${action} successful`
    });

  } catch (error) {
    console.error('Error updating assignment:', error);
    return NextResponse.json(
      { error: 'Failed to update assignment' },
      { status: 500 }
    );
  }
}