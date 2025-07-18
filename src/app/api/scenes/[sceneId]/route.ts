import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { scenes, chapters, books } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: { sceneId: string } }) {
  try {
    const { sceneId } = params;

    const sceneData = await db
      .select({
        scene: scenes,
        chapter: chapters,
        book: books,
      })
      .from(scenes)
      .leftJoin(chapters, eq(scenes.chapterId, chapters.id))
      .leftJoin(books, eq(chapters.bookId, books.id))
      .where(eq(scenes.id, sceneId))
      .limit(1);

    if (sceneData.length === 0) {
      return new NextResponse('Scene Not Found', { status: 404 });
    }

    return NextResponse.json(sceneData[0]);
  } catch (error) {
    console.error(`Error fetching scene ${params.sceneId}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { sceneId: string } }) {
  try {
    const { sceneId } = params;
    const body = await request.json();

    // Convert camelCase to snake_case for database fields
    const updateData: any = {};
    
    // Map frontend field names to database column names
    const fieldMappings: { [key: string]: string } = {
      'title': 'title',
      'focus': 'focus', 
      'description': 'description',
      'setup': 'setup',
      'sensoryDetail': 'sensoryDetail',
      'internalConflict': 'internalConflict', 
      'beatGoal': 'beatGoal',
      'symbolism': 'symbolism',
      'tarotSymbolism': 'tarotSymbolism',
      'heroJourneyStage': 'heroJourneyStage',
      'pages': 'pages',
      'primaryTarotCard': 'primaryTarotCard',
      'secondaryTarotCards': 'secondaryTarotCards',
      'preliminarySceneFocus': 'preliminarySceneFocus',
      'preliminarySceneDescription': 'preliminarySceneDescription'
    };

    // Only include fields that are defined in the schema
    for (const [frontendField, dbField] of Object.entries(fieldMappings)) {
      if (body[frontendField] !== undefined) {
        updateData[dbField] = body[frontendField];
      }
    }

    const updatedScene = await db
      .update(scenes)
      .set(updateData)
      .where(eq(scenes.id, sceneId))
      .returning();

    if (updatedScene.length === 0) {
      return new NextResponse('Scene Not Found', { status: 404 });
    }

    return NextResponse.json(updatedScene[0]);
  } catch (error) {
    console.error(`Error updating scene ${params.sceneId}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { sceneId: string } }) {
  try {
    const { sceneId } = params;

    const deletedScene = await db
      .delete(scenes)
      .where(eq(scenes.id, sceneId))
      .returning();

    if (deletedScene.length === 0) {
      return new NextResponse('Scene Not Found', { status: 404 });
    }

    return NextResponse.json({ message: 'Scene deleted successfully' });
  } catch (error) {
    console.error(`Error deleting scene ${params.sceneId}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
