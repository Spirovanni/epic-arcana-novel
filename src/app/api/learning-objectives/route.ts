import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chapters } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      chapterId, 
      title, 
      author, 
      connect_points, 
      section_of_focus, 
      section_description, 
      connection_focus_area, 
      terminal_learning_objectives 
    } = body;

    if (!chapterId) {
      return NextResponse.json(
        { error: 'Chapter ID is required' },
        { status: 400 }
      );
    }

    const learningObjectivesData = {
      title,
      author,
      connect_points,
      section_of_focus,
      section_description,
      connection_focus_area,
      terminal_learning_objectives,
    };

    const result = await db
      .update(chapters)
      .set({ 
        terminalLearningObjectives: learningObjectivesData,
        updatedAt: new Date()
      })
      .where(eq(chapters.id, chapterId))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: learningObjectivesData,
      message: 'Learning objectives saved successfully'
    });

  } catch (error) {
    console.error('Error saving learning objectives:', error);
    return NextResponse.json(
      { error: 'Failed to save learning objectives' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chapterId = searchParams.get('chapterId');

    if (!chapterId) {
      return NextResponse.json(
        { error: 'Chapter ID is required' },
        { status: 400 }
      );
    }

    const chapter = await db
      .select({ terminalLearningObjectives: chapters.terminalLearningObjectives })
      .from(chapters)
      .where(eq(chapters.id, chapterId))
      .limit(1);

    if (chapter.length === 0) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: chapter[0].terminalLearningObjectives
    });

  } catch (error) {
    console.error('Error fetching learning objectives:', error);
    return NextResponse.json(
      { error: 'Failed to fetch learning objectives' },
      { status: 500 }
    );
  }
}