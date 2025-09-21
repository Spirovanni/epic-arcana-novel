import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { assignmentTemplates, users } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const personalityType = searchParams.get('personalityType');
    const dayOfYear = searchParams.get('dayOfYear');

    let templates;

    if (personalityType && dayOfYear) {
      templates = await db.select().from(assignmentTemplates).where(and(
        eq(assignmentTemplates.personalityType, personalityType),
        eq(assignmentTemplates.dayOfYear, parseInt(dayOfYear))
      ));
    } else if (personalityType) {
      templates = await db.select().from(assignmentTemplates).where(
        eq(assignmentTemplates.personalityType, personalityType)
      );
    } else if (dayOfYear) {
      templates = await db.select().from(assignmentTemplates).where(
        eq(assignmentTemplates.dayOfYear, parseInt(dayOfYear))
      );
    } else {
      templates = await db.select().from(assignmentTemplates);
    }

    return NextResponse.json({
      templates: templates
    });

  } catch (error) {
    console.error('Error fetching assignment templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
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

    // Check if user is admin (you might want to implement proper role checking)
    const user = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);
    if (user.length === 0 || user[0].role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const {
      personalityType,
      enneagramType,
      dayOfYear,
      title,
      description,
      dailyTheme,
      personalityFocus,
      reflectionPrompt,
      practiceExercise,
      journalPrompt,
      actionItem,
      bookChapter,
      chapterFocus,
      tags,
      difficulty,
      estimatedTimeMinutes
    } = body;

    // Validate required fields
    if (!personalityType || !dayOfYear || !title || !description || !dailyTheme || 
        !personalityFocus || !reflectionPrompt || !practiceExercise || 
        !journalPrompt || !actionItem) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    if (dayOfYear < 1 || dayOfYear > 365) {
      return NextResponse.json(
        { error: 'Day of year must be between 1 and 365 (first year only)' },
        { status: 400 }
      );
    }

    // Check if template already exists for this personality type and day
    const existingTemplate = await db.select()
      .from(assignmentTemplates)
      .where(and(
        eq(assignmentTemplates.personalityType, personalityType),
        eq(assignmentTemplates.dayOfYear, dayOfYear)
      ))
      .limit(1);

    if (existingTemplate.length > 0) {
      return NextResponse.json(
        { error: 'Template already exists for this personality type and day' },
        { status: 409 }
      );
    }

    const newTemplate = await db.insert(assignmentTemplates).values({
      personalityType,
      enneagramType: enneagramType || null,
      dayOfYear,
      title,
      description,
      dailyTheme,
      personalityFocus,
      reflectionPrompt,
      practiceExercise,
      journalPrompt,
      actionItem,
      bookChapter: bookChapter || null,
      chapterFocus: chapterFocus || null,
      tags: tags || null,
      difficulty: difficulty || 'medium',
      estimatedTimeMinutes: estimatedTimeMinutes || 15
    }).returning({ id: assignmentTemplates.id });

    return NextResponse.json({
      success: true,
      templateId: newTemplate[0].id,
      message: 'Assignment template created successfully'
    });

  } catch (error) {
    console.error('Error creating assignment template:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);
    if (user.length === 0 || user[0].role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { templateId, ...updateData } = body;

    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      );
    }

    // Verify template exists
    const existingTemplate = await db.select()
      .from(assignmentTemplates)
      .where(eq(assignmentTemplates.id, templateId))
      .limit(1);

    if (existingTemplate.length === 0) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    await db.update(assignmentTemplates)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(assignmentTemplates.id, templateId));

    return NextResponse.json({
      success: true,
      message: 'Assignment template updated successfully'
    });

  } catch (error) {
    console.error('Error updating assignment template:', error);
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    );
  }
}